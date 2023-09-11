// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyCommandBuilder.js
// Created:			28/11/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 28/11/2011		V1.0        MJD     1st version - based on the C++ runner.
//
// OpenGL Error codes:
//
// 1280 GL_INVALID_ENUM      
// 1281 GL_INVALID_VALUE     
// 1282 GL_INVALID_OPERATION 
// 1283 GL_STACK_OVERFLOW    
// 1284 GL_STACK_UNDERFLOW
// 1285 GL_OUT_OF_MEMORY
//
// Ideally, no other part of the library should modify the drawing state of WebGL. 
// If other parts need to they should put the state back to what it was when they found it.
//
// TODO: On supported platforms move the Execute() call to be on a WebWorker?
//
// **********************************************************************************************************************
/** @constructor */
function yyCommandBuilder(_interpolatePixels) {    

    var gl = this._gl;

    // Private constants
    var CMD_NOP = 0,
        CMD_SETTEXTURE = 1,
        CMD_DRAWTRIANGLE = 2,
        CMD_DRAWTRIFAN = 3,
        CMD_DRAWTRISTRIP = 4,
        CMD_DRAWLINE = 5,
        CMD_DRAWLINESTRIP = 6,
        CMD_DRAWPOINT = 7,
        CMD_SETWORLD = 8,
        CMD_SETPROJECTION = 9,
        CMD_SETVIEW = 10,
        CMD_SETVIEWPORT = 11,
        CMD_SETVERTEXBUFFER = 12,
        CMD_CLEARSCREEN = 13,
        CMD_SETRENDER_TARGET = 14,
        CMD_SET_COLOUR_MASK = 15,
        CMD_SET_BLEND_MODE = 16,        
        CMD_SETSHADER = 17,
        CMD_SETUNIFORMI = 18,
        CMD_SETUNIFORMF = 19,
        CMD_SETRENDERSTATE = 20,
        CMD_SETSAMPLERSTATE = 21,
        CMD_SETLIGHT = 22,
        CMD_SETAMBIENT = 23,
        CMD_SETFOG = 24,
        CMD_SETLIGHTENABLE = 25,
        CMD_SETALPHATEST = 26,
        CMD_UPDATE_TEXTURE = 27;
        
    // Shader constant setup for m_matrices
    var CMD_MATRIX_VIEW = 0,
        CMD_MATRIX_PROJECTION = 1,
        CMD_MATRIX_WORLD = 2,
        CMD_MATRIX_WORLD_VIEW = 3,
        CMD_MATRIX_WORLD_VIEW_PROJECTION = 4,
        CMD_MATRIX_MAX = 5;      	     

    // Lets us avoid duplicating code for applying light environment settings
    var SHADER_ENV_FOG_BIT = 1,
        SHADER_ENV_LIGHTING_BIT = 2,    
        SHADER_ENV_AMBIENT_BIT = 4,
        SHADER_ENV_ALPHATEST_BIT = 8;    
	    
	// List of commands, and the associated data, to be translated into gl calls
	var m_commandList = [];
	
	// Command list building state tracking (to prevent unnecessary state switching)
	var m_lastTexture = [],
        m_lastShader,
	    m_lastVBuffer;
	    
	// Execution state tracking
	var m_currentShader,
	    m_activeTextures = [],
	    m_matrices = [],	    
	    m_textureStageSamplerState = [],
	    m_pointLights = new Float32Array(yyGL.MAX_LIGHTS * 4),
	    m_directionalLights = new Float32Array(yyGL.MAX_LIGHTS * 4),
	    m_lightColours = new Float32Array(yyGL.MAX_LIGHTS * 4),
	    m_ambientLight = new Float32Array(4),
	    m_fogParameters = new Float32Array(8), // two vec4s
        m_fogStart = 0.0,
        m_fogEnd = 0.0,
        m_alphaTestEnable = false,
        m_alphaTestValue = 0.0,
        m_stencilEnv,
        m_srcBlend = gl.SRC_ALPHA,
        m_destBlend = gl.ONE_MINUS_SRC_ALPHA,
        m_srcBlendAlpha = gl.SRC_ALPHA,
        m_destBlendAlpha = gl.ONE_MINUS_SRC_ALPHA;
	    
	var m_frameCount = 0,
	    m_nullTexture;
	
	Object.defineProperties(this, {        
        FrameCount: {
            get: function () { return m_frameCount; },
            set: function (val) { m_frameCount = val; }
        },
        NullTexture: {
            get: function () { return m_nullTexture; },
            set: function (val) { m_nullTexture = val; }
        }
    });

    // #############################################################################################
    /// Function:<summary>
    ///             Create a new "Command" builder
    ///          </summary>
    // #############################################################################################
    (function () {
    
        // During execution the "this" object would be the window, so we can't call this.Reset()
        ResetState();
                
        // Setup texture interpolation (sampler states) for the different texture stages
        var maxTextureStages = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        if (maxTextureStages > yyGL.MAX_TEXTURE_STAGES) {
            maxTextureStages = yyGL.MAX_TEXTURE_STAGES;
        }
	    for (var stage = 0; stage < maxTextureStages; stage++) {
	        m_textureStageSamplerState[stage] = new yyTextureSamplerState(_interpolatePixels);
	    }
	    
	    // Setup a default Stencil Buffer environment	    
        var stencilop = ConvertStencilOp(yyGL.StencilOp_Keep);
        m_stencilEnv = {
            ref: 0,
            mask: 0xffffffff,
            writemask: 0xffffffff,            
            func: ConvertComparison(yyGL.CmpFunc_CmpAlways),
            fail: stencilop,
            zfail: stencilop,
            pass: stencilop
        };
        
        // Make sure the matrices we track are set to identity
        for (var i = 0; i < CMD_MATRIX_MAX; i++) {
	        m_matrices[i] = new Matrix();
	    }
	    
	    // Set default GL states 
	    /*gl.disable(gl.CULL_FACE);	    
	    gl.disable(gl.DEPTH_TEST); // assume 2D rendering normally
	    gl.depthFunc(gl.LEQUAL); // set to same as C++ runner, the default GL state being LESS
	    gl.enable(gl.BLEND);
        gl.enable(gl.SCISSOR_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.activeTexture(gl.TEXTURE0);        
        gl.frontFace(gl.CW);
        gl.cullFace(gl.BACK);*/
        // UPDATE: now handled by state manager

    })();
    
    // #############################################################################################
    /// Property: <summary>
    ///           	Private: Resets state tracking for Command Chain building
    ///           </summary>
    // #############################################################################################
    function ResetState() {        

	    m_lastTexture = [];
	    m_lastVBuffer = undefined;
	    m_lastShader = undefined;
	    
	    m_lastTexture[0] = 1; 	// can't be NULL as thats a FLAT texture
	    m_lastTexture[1] = 1;
    };
    
    // #############################################################################################
    /// Property: <summary>    
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.Reset = function() {
        ResetState();
    };    
    
    // #############################################################################################
    /// Property: <summary>    
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetShader = function(_shaderProgram) {

        // Don't allow redundant shader sets
        if (_shaderProgram != m_lastShader) {
        
            // Invalidate the last vertex buffer to ensure state changes take effect
            m_lastVBuffer = null;
            
            m_commandList.push(CMD_SETSHADER);
            m_commandList.push(_shaderProgram);   
            m_lastShader = _shaderProgram;
        }    
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Set a texture
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetTexture = function (_stage, _texture) {

        // Update state manager here
        // Although the state isn't actually *set* at this point from the game's perspective this is the current state
        g_webGL.RSMan.SetTexture(_stage, _texture);
        
	    // Track texture setting so we don't have redundant texture setting.
	    if (m_lastTexture[_stage] == _texture) {
	        return;
	    }
	    m_lastTexture[_stage] = _texture;

	    m_commandList.push(CMD_SETTEXTURE);
	    m_commandList.push(_texture);
	    m_commandList.push(_stage);
    };
    
    // #############################################################################################
    /// Property: <summary>
    ///           	Insert comment into the command chain
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawComment = function (_text) {
	    
	    m_commandList.push(_text);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Update a texture with new bits
    ///           </summary>
    // #############################################################################################
    this.UpdateTexture = function( _texture, _x, _y, _w, _h, _canvas_or_u8array, _format ) {
    
        m_commandList.push( CMD_UPDATE_TEXTURE );
        m_commandList.push( _texture );
        m_commandList.push( _x );
        m_commandList.push( _y );
        m_commandList.push( _w );
        m_commandList.push( _h );
        m_commandList.push(_canvas_or_u8array);
        m_commandList.push(_format);
    };


    // #############################################################################################
    /// Property: <summary>
    ///           	Set vertex buffer
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetVertexBuffer = function (_VBuffer) {

	    // Track "current" vertex buffer usage
	    if (m_lastVBuffer == _VBuffer) return;
	    m_lastVBuffer = _VBuffer;

	    m_commandList.push(CMD_SETVERTEXBUFFER);
	    m_commandList.push(_VBuffer);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Draw a triangle
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawTriangle = function (_start, _primcount ) {

	    m_commandList.push(CMD_DRAWTRIANGLE);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Draw a triangle
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawTriFan = function (_start, _primcount) {

	    m_commandList.push(CMD_DRAWTRIFAN);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Draw a triangle
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawTriStrip = function (_start, _primcount) {

	    m_commandList.push(CMD_DRAWTRISTRIP);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Draw a line
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawLine = function (_start, _primcount ) {

	    m_commandList.push(CMD_DRAWLINE);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	Draw a line
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawLineStrip = function (_start, _primcount) {

	    m_commandList.push(CMD_DRAWLINESTRIP);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.DrawPoint = function (_start, _primcount ) {

	    m_commandList.push(CMD_DRAWPOINT);
	    m_commandList.push(_start);
	    m_commandList.push(_primcount);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetProjection = function (_matrix) {

	    m_commandList.push(CMD_SETPROJECTION);	    
	    m_commandList.push(new Matrix(_matrix));
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetView = function (_matrix) {

	    m_commandList.push(CMD_SETVIEW);	    
	   // ViewMatrix = new Matrix(_matrix);	
	    m_commandList.push(new Matrix(_matrix));		
    };


    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetWorld = function (_matrix) {

	    m_commandList.push(CMD_SETWORLD);	    
	    m_commandList.push(new Matrix(_matrix));	
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetViewPort = function (_x, _y, _w, _h) {

	    m_commandList.push(CMD_SETVIEWPORT);
	    m_commandList.push(_x);
	    m_commandList.push(_y);
	    m_commandList.push(_w);
	    m_commandList.push(_h);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.ClearScreen = function (_mask,_col) {

	    m_commandList.push(CMD_CLEARSCREEN);
	    m_commandList.push(_mask);
	    m_commandList.push(Math.floor(_col));
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetRenderTarget = function (_Target) {

	    m_commandList.push(CMD_SETRENDER_TARGET);
	    m_commandList.push(_Target);
    };


    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetColourMask = function (_alpha,_red,_green,_blue) {

	    m_commandList.push(CMD_SET_COLOUR_MASK);
	    m_commandList.push(_alpha);
	    m_commandList.push(_red);
	    m_commandList.push(_green);
	    m_commandList.push(_blue);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetBlendMode = function(_src, _dest) {
        
        m_commandList.push(CMD_SET_BLEND_MODE);
        m_commandList.push(_src);
        m_commandList.push(_dest);
    };    


    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetUniformI = function(_constHandle, _shaderData) {

        m_commandList.push(CMD_SETUNIFORMI);
        m_commandList.push(_constHandle);
        m_commandList.push(_shaderData);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetUniformF = function(_constHandle, _shaderData) {

        m_commandList.push(CMD_SETUNIFORMF);
        m_commandList.push(_constHandle);
        m_commandList.push(_shaderData);
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetUniformArrayI = function(_constHandle, _shaderData) {

        m_commandList.push(CMD_SETUNIFORMI);
        m_commandList.push(_constHandle);
        m_commandList.push(_shaderData);        
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetUniformArrayF = function(_constHandle, _shaderData) {

        m_commandList.push(CMD_SETUNIFORMF);
        m_commandList.push(_constHandle);
        m_commandList.push(_shaderData);        
    };

    // #############################################################################################
    /// Property: <summary>
    ///           	
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetUniformMatrix = function(_constHandle, _shaderData) {

        m_commandList.push(CMD_SETUNIFORMF);
        m_commandList.push(_constHandle);
        m_commandList.push(_shaderData);
    };


    // #############################################################################################
    /// Property: <summary>
    ///           	Queue up a render state change, where state data is either a single value
    ///             or a map or an array of values according to the type of state change
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetRenderState = function (_renderState, _renderStateData) {

        m_commandList.push(CMD_SETRENDERSTATE);    
        m_commandList.push(_renderState);
        m_commandList.push(_renderStateData);
    };

    // #############################################################################################
    /// Property: <summary>
    ///             Queue up a change to the sampler state for a texture stage
    ///             States are held onto within each texture itself to prevent
    ///             unnecessary changes
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetSamplerState = function (_stage, _state, _setting) {
        
        // Push a command onto the list to ensure the current texture bound to this stage is affected
        m_commandList.push(CMD_SETSAMPLERSTATE);
        m_commandList.push(_stage);
        m_commandList.push(_state);
        m_commandList.push(_setting);
    };


    // #############################################################################################
    /// Property: <summary>
    ///             Force through an update of a light slot
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetLight = function (ind, pointlight, dirlight, lightcol) {
        
        m_commandList.push(CMD_SETLIGHT);
        m_commandList.push(ind);
        m_commandList.push(new Float32Array(pointlight));
        m_commandList.push(new Float32Array(dirlight));
        m_commandList.push(new Float32Array(lightcol));
    };


    // #############################################################################################
    /// Property: <summary>
    ///             Update the ambient lighting
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetAmbientLight = function (colour) {

        m_commandList.push(CMD_SETAMBIENT);
        m_commandList.push(new Float32Array(colour));
    };

    // #############################################################################################
    /// Property: <summary>
    ///             Force through an update of fog settings
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetFog = function (fog) {
        
        m_commandList.push(CMD_SETFOG);
        m_commandList.push(new Float32Array(fog));
    };

    // #############################################################################################
    /// Property: <summary>
    ///             Enable/disable a light. We require the colour of the light since switching it 
    ///             off is handled by setting the colour to black. Clunky, but does work...
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetLightEnable = function (ind, enable, colour) {

        m_commandList.push(CMD_SETLIGHTENABLE);
        m_commandList.push(ind);
        m_commandList.push(enable);
        m_commandList.push(colour);
    };

    // #############################################################################################
    /// Property: <summary>
    ///             Enable/disable alpha testing for the current shader
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.SetAlphaTest = function (_enable, _refval) {

        m_commandList.push(CMD_SETALPHATEST);
        m_commandList.push(_enable);
        m_commandList.push(_refval);
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Convert the engine blend to an opengl version
    ///          </summary>
    // #############################################################################################
    function ConvertBlend( _value )
    {
	    switch( _value )
	    {	        
		    case yyGL.Blend_Zero:				return gl.ZERO;		
		    case yyGL.Blend_One:				return gl.ONE;		
		    case yyGL.Blend_SrcColour:			return gl.SRC_COLOR;	
		    case yyGL.Blend_InvSrcColour:		return gl.ONE_MINUS_SRC_COLOR;
		    case yyGL.Blend_SrcAlpha:			return gl.SRC_ALPHA;
		    case yyGL.Blend_InvSrcAlpha:		return gl.ONE_MINUS_SRC_ALPHA;
		    case yyGL.Blend_DestAlpha:			return gl.DST_ALPHA;
		    case yyGL.Blend_InvDestAlpha:		return gl.ONE_MINUS_DST_ALPHA;
		    case yyGL.Blend_DestColour:		    return gl.DST_COLOR;
		    case yyGL.Blend_InvDestColour:		return gl.ONE_MINUS_DST_COLOR;
		    case yyGL.Blend_SrcAlphaSat:		return gl.SRC_ALPHA_SATURATE;	
		    case yyGL.Blend_BothSrcAlpha:		return 0;	//GL_ONE_MINUS_DOUBLE_SRC_ALPHA;
		    case yyGL.Blend_BothInvSrcAlpha:	return 0;
		    case yyGL.Blend_BlendFactor:		return 0;
		    case yyGL.Blend_InvBlendFactor:	    return 0;
		    case yyGL.Blend_SrcColour2:		    return 0;
		    case yyGL.Blend_InvSrcColour2:		return 0;
	    }
	    return 0;
    }

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Convert the engine stencil op to an opengl version
    ///          </summary>
    // #############################################################################################
    function ConvertStencilOp(_value )
    {
	    switch(_value)
	    {
		    case yyGL.StencilOp_Keep:			return gl.KEEP;
		    case yyGL.StencilOp_Zero:			return gl.ZERO;
		    case yyGL.StencilOp_Replace:		return gl.REPLACE;
		    case yyGL.StencilOp_Incrsat:		return gl.INCR;		// apparently values always saturate
		    case yyGL.StencilOp_Decrsat:		return gl.DECR;		// apparently values always saturate
		    case yyGL.StencilOp_Invert:		    return gl.INVERT;
		    case yyGL.StencilOp_Incr:			return gl.INCR;
		    case yyGL.StencilOp_Decr:			return gl.DECR;
		    default:						    return gl.KEEP;
	    }
    }

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Convert the engine compirson enum to an opengl version
    ///          </summary>
    // #############################################################################################
    function ConvertComparison(_value)
    {
	    switch (_value)
	    {
		    case yyGL.CmpFunc_CmpNever:		return gl.NEVER;
		    case yyGL.CmpFunc_CmpLess:			return gl.LESS;
		    case yyGL.CmpFunc_CmpEqual:		return gl.EQUAL;
		    case yyGL.CmpFunc_CmpLessEqual:	return gl.LEQUAL;
		    case yyGL.CmpFunc_CmpGreater:		return gl.GREATER;
		    case yyGL.CmpFunc_CmpNotEqual:		return gl.NOTEQUAL;
		    case yyGL.CmpFunc_CmpGreaterEqual:	return gl.GEQUAL;
		    case yyGL.CmpFunc_CmpAlways:			       
		    default:						return gl.ALWAYS;

	    }
    }

    // #############################################################################################
    /// Property: <summary>
    ///             Private: Sets the OpenGL render state based on our command chain stored settings
    ///          </summary>
    // #############################################################################################
    function SetGLRenderState(_renderState, _renderStateData) {    

        switch (_renderState) {
        
            /* Let's not leave in a bunch of possibilities in that have no effect...            
            case yyGL.RenderState_FillMode:
            break;                            	    	        	          
            */        
	        case yyGL.RenderState_ZEnable:
	            if (_renderStateData) {
                    gl.enable(gl.DEPTH_TEST);
                }
                else {
                    gl.disable(gl.DEPTH_TEST);
                }
	        break;
            
	        case yyGL.RenderState_ZWriteEnable:
	            gl.depthMask(_renderStateData);
	        break;

            case yyGL.RenderState_AlphaTestEnable:
                m_alphaTestEnable = _renderStateData;                                
                SetLightingEnv(SHADER_ENV_ALPHATEST_BIT);               
            break;

            case yyGL.RenderState_SrcBlend:
                m_srcBlend = ConvertBlend(_renderStateData);
                gl.blendFuncSeparate(m_srcBlend, m_destBlend, m_srcBlendAlpha, m_destBlendAlpha);            
	        break;

            case yyGL.RenderState_DestBlend:
                m_destBlend = ConvertBlend(_renderStateData);
                gl.blendFuncSeparate(m_srcBlend, m_destBlend, m_srcBlendAlpha, m_destBlendAlpha);            
	        break;	        
    	    
	        case yyGL.RenderState_CullMode:
	            if (_renderStateData != yyGL.Cull_NoCulling) {	            	
                    gl.enable(gl.CULL_FACE);     
                    gl.frontFace((_renderStateData === yyGL.Cull_Clockwise) ? gl.CW : gl.CCW);               
                }
                else {
                    gl.disable(gl.CULL_FACE);
                }
	        break;

            case yyGL.RenderState_ZFunc:
                gl.depthFunc(ConvertComparison(_renderStateData));
	        break;

            case yyGL.RenderState_AlphaRef:
                m_alphaTestValue = _renderStateData / 255.0;                
                SetLightingEnv(SHADER_ENV_ALPHATEST_BIT);
	        break;

	        case yyGL.RenderState_AlphaFunc:
                // Does nothing just now (the actual comparison function is baked into the shader)
	        break;
                  
            case yyGL.RenderState_AlphaBlendEnable:
                if (_renderStateData) {
                    gl.enable(gl.BLEND);
                }
                else
                {
                    gl.disable(gl.BLEND);
                }
            break;

            case yyGL.RenderState_FogEnable:
                m_fogParameters[0] = _renderStateData;
                SetLightingEnv(SHADER_ENV_FOG_BIT);
            break;                    

            case yyGL.RenderState_SpecularEnable:
                // ignore just now
            break;      

            case yyGL.RenderState_FogColour:
                m_fogParameters[4] = (_renderStateData & 0xff) / 255.0;
                m_fogParameters[5] = ((_renderStateData >> 8) & 0xff) / 255.0;
                m_fogParameters[6] = ((_renderStateData >> 16) & 0xff) / 255.0;
                m_fogParameters[7] = ((_renderStateData >> 24) & 0xff) / 255.0;
                SetLightingEnv(SHADER_ENV_FOG_BIT);
            break;   

            case yyGL.RenderState_FogTableMode:
                // ignore just now
            break;     

            case yyGL.RenderState_FogStart:
                m_fogStart = _renderStateData;
                var range = m_fogEnd - m_fogStart;
                m_fogParameters[1] = (range == 0.0) ? 0.0 : (1.0 / range);
                SetLightingEnv(SHADER_ENV_FOG_BIT);
            break;     

            case yyGL.RenderState_FogEnd:
                m_fogEnd = _renderStateData;
                m_fogParameters[2] = _renderStateData;
                var range = m_fogEnd - m_fogStart;
                m_fogParameters[1] = (range == 0.0) ? 0.0 : (1.0 / range);
                SetLightingEnv(SHADER_ENV_FOG_BIT);
            break;     

            case yyGL.RenderState_FogDensity:
                // ignore just now
            break;     

            case yyGL.RenderState_RangeFogEnable:
                // ignore just now
            break;     

            case yyGL.RenderState_Lighting:
                // ignore just now
            break;

            case yyGL.RenderState_Ambient:
                // ignore just now
            break;

            case yyGL.RenderState_FogVertexMode:
                // ignore just now
            break;
    	    
	        case yyGL.RenderState_ColourWriteEnable:	        
	            gl.colorMask(_renderStateData.red, _renderStateData.green, _renderStateData.blue, _renderStateData.alpha);
	        break;	   	     
    	        
	        case yyGL.RenderState_StencilEnable:
	            if (_renderStateData) {
	                gl.enable(gl.STENCIL_TEST);
	            }
	            else {
	                gl.disable(gl.STENCIL_TEST);
	            }
	        break;
    	    
	        case yyGL.RenderState_StencilFail:			
	            m_stencilEnv.fail = ConvertStencilOp(_renderStateData);
	            gl.stencilOp(m_stencilEnv.fail, m_stencilEnv.zfail, m_stencilEnv.pass);
	        break;
		    case yyGL.RenderState_StencilZFail:
		        m_stencilEnv.zfail = ConvertStencilOp(_renderStateData);
		        gl.stencilOp(m_stencilEnv.fail, m_stencilEnv.zfail, m_stencilEnv.pass);
		    break;
		    case yyGL.RenderState_StencilPass:			
		        m_stencilEnv.pass = ConvertStencilOp(_renderStateData);
		        gl.stencilOp(m_stencilEnv.fail, m_stencilEnv.zfail, m_stencilEnv.pass);
		    break;
    		
		    case yyGL.RenderState_StencilFunc:			
		        m_stencilEnv.func = ConvertComparison(_renderStateData);
		        gl.stencilFunc(m_stencilEnv.func, m_stencilEnv.ref, m_stencilEnv.mask); 
		    break;
		    case yyGL.RenderState_StencilRef:
		        m_stencilEnv.ref = _renderStateData;
		        gl.stencilFunc(m_stencilEnv.func, m_stencilEnv.ref, m_stencilEnv.mask); 
		    break;
		    case yyGL.RenderState_StencilMask:
		        m_stencilEnv.mask = _renderStateData;
		        gl.stencilFunc(m_stencilEnv.func, m_stencilEnv.ref, m_stencilEnv.mask); 
		    break;
    		
		    case yyGL.RenderState_StencilWriteMask:		
		        gl.stencilMask(_renderStateData);
		    break;	

            case yyGL.RenderState_SeparateAlphaBlendEnable:
                // ignore just now
            break;

            case yyGL.RenderState_SrcBlendAlpha:
                m_srcBlendAlpha = ConvertBlend(_renderStateData);
                gl.blendFuncSeparate(m_srcBlend, m_destBlend, m_srcBlendAlpha, m_destBlendAlpha);            
	        break;

            case yyGL.RenderState_DestBlendAlpha:
                m_destBlendAlpha = ConvertBlend(_renderStateData);
                gl.blendFuncSeparate(m_srcBlend, m_destBlend, m_srcBlendAlpha, m_destBlendAlpha);            
	        break;	 

            case yyGL.RenderState_CullOrder:
                
               if (_renderStateData != yyGL.Cull_NoCulling) {	            	
                    gl.enable(gl.CULL_FACE);     
                    gl.frontFace((_renderStateData === yyGL.Cull_Clockwise) ? gl.CW : gl.CCW);               
                }
                else {
                    gl.disable(gl.CULL_FACE);
                } 
           
	        break;
        }
    }

    // #############################################################################################
    /// Property: <summary>
    ///           	Private: Make sure all three m_matrices stay up to date for the shader.
    ///             TODO: Could be optimised to stop unnecessary multiplications?
    ///           </summary>
    // #############################################################################################
    function SetShaderMatrices() {

        if (m_currentShader && m_currentShader.vertexMatricesAttribute) { 
                
            m_matrices[CMD_MATRIX_WORLD_VIEW].Multiply(m_matrices[CMD_MATRIX_WORLD], m_matrices[CMD_MATRIX_VIEW]);
            m_matrices[CMD_MATRIX_WORLD_VIEW_PROJECTION].Multiply(m_matrices[CMD_MATRIX_WORLD_VIEW], m_matrices[CMD_MATRIX_PROJECTION]);
            
            // Copy matrix data over to one monolithic array
            var matrixData = new Float32Array(16 * CMD_MATRIX_MAX);
            for (var i = 0; i < CMD_MATRIX_MAX; i++) {
                matrixData.set(m_matrices[i].m, i * 16);
            }
            gl.uniformMatrix4fv(m_currentShader.vertexMatricesAttribute, gl.FALSE, matrixData);
        }
    }

    // #############################################################################################
    /// Property: <summary>
    ///             Private: Setup how lighting is performed with the shader
    ///           </summary>
    // #############################################################################################
    function SetLightingEnv(_bits) {        
    
        // Should really assert that m_currentShader exists...
        if (_bits & SHADER_ENV_ALPHATEST_BIT) {
            if (m_currentShader.alphaTestEnableAttribute !== undefined) {
                gl.uniform1i(m_currentShader.alphaTestEnableAttribute, m_alphaTestEnable);
            }
            if (m_currentShader.alphaTestValueAttribute !== undefined) {
                gl.uniform1f(m_currentShader.alphaTestValueAttribute, m_alphaTestValue);
            }
        }

        if ((_bits & SHADER_ENV_FOG_BIT) && (m_currentShader.fogParametersAttribute !== undefined)) {
            gl.uniform4fv(m_currentShader.fogParametersAttribute, m_fogParameters);
        }
        
        if (_bits & SHADER_ENV_LIGHTING_BIT) {
            // Point lights
            if (m_currentShader.pointLightPosAttribute !== undefined) {
                gl.uniform4fv(m_currentShader.pointLightPosAttribute, m_pointLights);
            }
            // Directional lights
            if (m_currentShader.dirLightDirAttribute !== undefined) {
                gl.uniform4fv(m_currentShader.dirLightDirAttribute, m_directionalLights);
            }        
            // Light colours (shared between directional and point lights)
            if (m_currentShader.lightColourAttribute !== undefined) {
                gl.uniform4fv(m_currentShader.lightColourAttribute, m_lightColours);
            }
        }
        
        // Ambient lighting colour
        if ((_bits & SHADER_ENV_AMBIENT_BIT) && (m_currentShader.ambientColAttribute !== undefined)) {
            gl.uniform4fv(m_currentShader.ambientColAttribute, m_ambientLight);
        }
    }

    var filtermodes =
    [
        // Nearest mipmap
        gl.NEAREST_MIPMAP_NEAREST,
        gl.LINEAR_MIPMAP_NEAREST,
        gl.LINEAR_MIPMAP_NEAREST,

        // Linear mipmap filtering
        gl.NEAREST_MIPMAP_LINEAR,
        gl.LINEAR_MIPMAP_LINEAR,
        gl.LINEAR_MIPMAP_LINEAR,

        // Anisotropic filtering (use linear mipmap filtering for this)
        gl.NEAREST_MIPMAP_LINEAR,
        gl.LINEAR_MIPMAP_LINEAR,
        gl.LINEAR_MIPMAP_LINEAR,
    ];

    function GetMinFilteringMode(_min, _mip)
    {
        // Looking at the gl header, the bits are all in logical places to select the different modes
        // But in order to avoid compatibilty issues I'll lay out the options explcitly
        // UPDATE: looks like consts get obfuscated differently to vars so the "return filtermodes" bit below looks up something different
        //const filtermodes = 
        //[
        //    // Nearest mipmap
        //    gl.NEAREST_MIPMAP_NEAREST,
        //    gl.LINEAR_MIPMAP_NEAREST,
        //    gl.LINEAR_MIPMAP_NEAREST,

        //    // Linear mipmap filtering
        //    gl.NEAREST_MIPMAP_LINEAR,
        //    gl.LINEAR_MIPMAP_LINEAR,
        //    gl.LINEAR_MIPMAP_LINEAR,

        //    // Anisotropic filtering (use linear mipmap filtering for this)
        //    gl.NEAREST_MIPMAP_LINEAR,
        //    gl.LINEAR_MIPMAP_LINEAR,
        //    gl.LINEAR_MIPMAP_LINEAR,
        //];

        //rel_csol.Output("Mip filtering mode %d: %d\n", (_mip * eFilter_MAX) + _min, filtermodes[(_mip * eFilter_MAX) + _min]);

        return filtermodes[(_mip * yyGL.Filter_MAX) + _min];
    }

    // #############################################################################################
    /// Property: <summary>
    ///           	Private: Compare sampler settings for a texture to the ones stored via the 
    ///             command chain and update the texture's state if necessary.
    ///             TODO: Do bit mask tests to check anything's changed quickly?
    ///           </summary>
    // #############################################################################################
    function SetTextureSamplerState(_texture, _stage) {

        if (_texture === null || _texture === undefined) {
            return;
        }
        
        var hasMips = false;
        if (_texture.Flags !== undefined) 
        {
            hasMips = (_texture.Flags & eInternalTextureFlags.HasMips) !== 0;
        }

        // Get the texture stage sampler state that's in flight from the command chain
        var textureStageSamplerState = m_textureStageSamplerState[_stage];
        if (textureStageSamplerState === null || textureStageSamplerState === undefined) {
            return;
        }
        var stageStates = textureStageSamplerState.States;
        
        // Get the texture stage sampler state that the current texture is in
        // (If the following is null/undefined then the texture hasn't been setup correctly!)
        var textureStates = _texture.SamplerState.States;
        
        // Check the filtering state for any differences
        if (_texture.IsDirty === true || stageStates[yyGL.SamplerState_MagFilter] != textureStates[yyGL.SamplerState_MagFilter]) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, (stageStates[yyGL.SamplerState_MagFilter] == yyGL.Filter_LinearFiltering) ? gl.LINEAR : gl.NEAREST);
            textureStates[yyGL.SamplerState_MagFilter] = stageStates[yyGL.SamplerState_MagFilter];
        }

        if (!hasMips)
        {
            if (_texture.IsDirty === true || stageStates[yyGL.SamplerState_MinFilter] != textureStates[yyGL.SamplerState_MinFilter]) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, (stageStates[yyGL.SamplerState_MinFilter] == yyGL.Filter_LinearFiltering) ? gl.LINEAR : gl.NEAREST);
                textureStates[yyGL.SamplerState_MinFilter] = stageStates[yyGL.SamplerState_MinFilter];
            }
        }
        else
        {
            if (_texture.IsDirty === true || stageStates[yyGL.SamplerState_MipFilter] != textureStates[yyGL.SamplerState_MipFilter]
                || stageStates[yyGL.SamplerState_MinFilter] != textureStates[yyGL.SamplerState_MinFilter]) 
            {
                var filterMode = GetMinFilteringMode(stageStates[yyGL.SamplerState_MinFilter], stageStates[yyGL.SamplerState_MipFilter]);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
                textureStates[yyGL.SamplerState_MipFilter] = stageStates[yyGL.SamplerState_MipFilter];
                textureStates[yyGL.SamplerState_MinFilter] = stageStates[yyGL.SamplerState_MinFilter];
            }

            /*if (g_SupportLODBias)
            {
                if ((pTex->m_bParamDirty) || (pTex->m_TextureMipBias != g_TextureMipBias[g_CurrActiveTexture]))
                {
                    pTex->m_TextureMipBias = g_TextureMipBias[g_CurrActiveTexture];
                    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_LOD_BIAS, g_TextureMipBias[g_CurrActiveTexture]);
                }
            }*/

			if (g_extAnisotropic)
			{
				if (stageStates[yyGL.SamplerState_MipFilter] == yyGL.Filter_Anisotropic)
				{
                    if (textureStates[yyGL.SamplerState_MaxAniso] != stageStates[yyGL.SamplerState_MaxAniso])
					{
						textureStates[yyGL.SamplerState_MaxAniso] = stageStates[yyGL.SamplerState_MaxAniso];

                        var maxAniso = gl.getParameter(g_extAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);

						var aniso = textureStates[yyGL.SamplerState_MaxAniso];
						aniso = Math.min(aniso, maxAniso);

						gl.texParameterf(gl.TEXTURE_2D, g_extAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, aniso);
					}
				}
				else
				{
					if (textureStates[yyGL.SamplerState_MaxAniso] != 1.0)
					{
						textureStates[yyGL.SamplerState_MaxAniso] = 1.0;
						gl.texParameterf(gl.TEXTURE_2D, g_extAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, 1.0);
					}
				}
			}

			/*//if (g_SupportMinMaxLOD)
			{
				if (stageStates[yyGL.SamplerState_MinMip] != textureStates[yyGL.SamplerState_MinMip])
				{
					textureStates[yyGL.SamplerState_MinMip] = stageStates[yyGL.SamplerState_MinMip];
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_LOD, textureStates[yyGL.SamplerState_MinMip]);
				}

				if (stageStates[yyGL.SamplerState_MaxMip] != textureStates[yyGL.SamplerState_MaxMip])
				{
					textureStates[yyGL.SamplerState_MaxMip] = stageStates[yyGL.SamplerState_MaxMip];
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LOD, textureStates[yyGL.SamplerState_MaxMip]);
				}
			}*/
		}
        
        // Check the wrapping state for any differences
        if (stageStates[yyGL.SamplerState_AddressU] != textureStates[yyGL.SamplerState_AddressU]) {        
            if (_texture.Pow2) {
                var repeatMode = (stageStates[yyGL.SamplerState_AddressU] == yyGL.TextureWrap_Clamp) ? gl.CLAMP_TO_EDGE : gl.REPEAT;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeatMode);
            }
           // else {
           //     debug("WARNING: Non-pow2 texture for TEXTURE_WRAP_S");
           // }
            textureStates[yyGL.SamplerState_AddressU] = stageStates[yyGL.SamplerState_AddressU];
        }
        if (stageStates[yyGL.SamplerState_AddressV] != textureStates[yyGL.SamplerState_AddressV]) {        
            if (_texture.Pow2) {
                var repeatMode = (stageStates[yyGL.SamplerState_AddressV] == yyGL.TextureWrap_Clamp) ? gl.CLAMP_TO_EDGE : gl.REPEAT;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeatMode);
            }
           // else {
           //     debug("WARNING: Non-pow2 texture for TEXTURE_WRAP_T");
           // }
            textureStates[yyGL.SamplerState_AddressV] = stageStates[yyGL.SamplerState_AddressV];
        }

        _texture.IsDirty = false;
    }

    var g_vertexFormatPrevious = null;
    
    // #############################################################################################
    /// Property: <summary>
    ///           	Execute the command for setting a vertex buffer
    ///           </summary>
    // #############################################################################################
    function SetVertexBuffer(_pBuff) {
    
        gl.bindBuffer(gl.ARRAY_BUFFER, _pBuff.GLBuffer);

        // we need to remove all the previous attrib entries
        if (g_vertexFormatPrevious != null) {
            if (g_vertexFormatPrevious.FixedFunction === true) {
                var formatIndex, attribIndex, formatLength = g_vertexFormatPrevious.Format.length;;
                for (formatIndex = 0; formatIndex < formatLength; ++formatIndex) {
                    switch (formatIndex) {
                        case 0: attribIndex = m_currentShader.positionAttribute; break;
                        case 1: attribIndex = m_currentShader.colourAttribute; break;
                        case 2: attribIndex = m_currentShader.textureCoordAttribute; break;
                        case 3: attribIndex = m_currentShader.normalAttribute; break;
                        default: attribIndex = -1; break;
                    }
                    if (attribIndex >= 0) {
                        gl.disableVertexAttribArray(attribIndex);
                    }
                }          
            } // end if
            else {
                // If it's a custom FVF, just loop over the format and match to the attributes parsed
                var formatIndex, attribIndex, formatLength = g_vertexFormatPrevious.Format.length;;
                for (formatIndex = 0; formatIndex < formatLength; ++formatIndex) {                
                    attribIndex = m_currentShader.AttribIndices[formatIndex];
                    if (attribIndex >= 0) {
                        gl.disableVertexAttribArray(attribIndex);
                    }
                }
            }
        }


                
        var pVertexFormat = _pBuff.VertexFormat;        
        g_vertexFormatPrevious = pVertexFormat;
        if (pVertexFormat.FixedFunction === true) {         
        
            // If it's one of our built in (equivalent of Fixed Function pipeline of old) then do things manually
            // These indices must match the order format elements were added in the main yyWebGL class
            var formatIndex, attribIndex, formatElement, formatLength = pVertexFormat.Format.length;
            for (formatIndex = 0; formatIndex < formatLength; ++formatIndex) {
            
                formatElement = pVertexFormat.Format[formatIndex];
                switch (formatIndex) {
                    case 0: attribIndex = m_currentShader.positionAttribute; break;
                    case 1: attribIndex = m_currentShader.colourAttribute; break;
                    case 2: attribIndex = m_currentShader.textureCoordAttribute; break;
                    case 3: attribIndex = m_currentShader.normalAttribute; break;
                    default: attribIndex = -1; break;
                }
                if (attribIndex >= 0) {
                    gl.enableVertexAttribArray(attribIndex);
                    gl.vertexAttribPointer(
                        attribIndex, 
                        formatElement.glcomponents,
                        formatElement.gltype,
                        formatElement.normalised,
                        pVertexFormat.ByteSize, // stride (in bytes)
                        formatElement.offset);  // offset (in bytes)
                }
            }          
        }
        else {
            // If it's a custom FVF, just loop over the format and match to the attributes parsed
            {
                var formatIndex, attribIndex, formatElement, formatLength = pVertexFormat.Format.length;
                var attrib_length = m_currentShader.AttribIndices.length;
                var ShaderCache = pVertexFormat.ShaderCache[m_currentShader.shader_index];

                // if we haven't hooked up this VertexBuffer to this Shader before, then  work out the vertex element hook ups,
                // then cache them in an array that matches the size of the vertex format for easy looping.
                if (ShaderCache === undefined)
                {
                    ShaderCache = [];
                    var slot_used = [];
                    for (formatIndex = 0; formatIndex < formatLength; ++formatIndex) {
                        formatElement = pVertexFormat.Format[formatIndex];

                        // find a matching "attribute" for this element where we can, or set to -1 for not found
                        var usage = formatElement.usage;
                        attribIndex = -1;       // set as not found
                        for (var findex = 0; findex < attrib_length; findex++)
                        {
                            // has this slot been used up (already attached to a stream)? if so....skip it
                            if (slot_used[findex] === undefined) {
                                var slot_index = m_currentShader.AttribIndices[findex];

                                // is this the same usage "type"? if so... hook to this one
                                if (m_currentShader.Types[findex] == usage) {
                                    attribIndex = slot_index;   // set slot
                                    slot_used[findex] = 1;      // mark as used
                                    break;
                                } else if (m_currentShader.Types[findex] == 4 && usage == 2) {
                                    // if it's a vec4, and the format says COLOUR, then use this and fix up shader
                                    m_currentShader.Types[findex] = gl.UNSIGNED_BYTE;
                                    attribIndex = slot_index;   // set slot
                                    slot_used[findex] = 1;      // mark as used
                                    break;
                                }

                            }
                        }
                        ShaderCache.push(attribIndex);
                    }
                    pVertexFormat.ShaderCache[m_currentShader.shader_index] = ShaderCache;
                }


                // Now just loop through and hookup the channels
                for (formatIndex = 0; formatIndex < formatLength; ++formatIndex)
                {
                    formatElement = pVertexFormat.Format[formatIndex];
                    attribIndex = ShaderCache[formatIndex];

                    // if -1 then this shader does not have this element, so drop it.
                    if (attribIndex >= 0) {
                        gl.enableVertexAttribArray(attribIndex);
                        gl.vertexAttribPointer(
                            attribIndex,
                            formatElement.glcomponents,
                            formatElement.gltype,
                            formatElement.normalised,
                            pVertexFormat.ByteSize, // stride (in bytes)
                            formatElement.offset);  // offset (in bytes)
                    }
                }
            }
        }
    }

    // #############################################################################################
    /// Property: <summary>
    ///           	Execute the GL rendering loop.
    ///           </summary>
    // #############################################################################################
    /** @this {yyCommandBuilder} */
    this.Execute = function() {

        // Commonly used variables
        var i, error, handle, shaderData, tupleSize, stage, texture, pBuff, ind, col, enable, uniformCache, uniformData;
        
        i = 0;
        while (i < m_commandList.length) 
        {        
            switch (m_commandList[i]) {
            
                case CMD_SETSHADER:
                    {
                        m_currentShader = m_commandList[i + 1];
                        uniformCache = m_currentShader.UniformCache;
                        i += 2;                         
                        gl.useProgram(m_currentShader);
                        SetShaderMatrices();
                        SetLightingEnv(0xff); // set all lighting environment parts
                        break;
                    }

                case CMD_SETVIEWPORT:
                    {
                        gl.viewport(m_commandList[i + 1], m_commandList[i + 2], m_commandList[i + 3], m_commandList[i + 4]);
                        gl.scissor(m_commandList[i + 1], m_commandList[i + 2], m_commandList[i + 3], m_commandList[i + 4]);
                        i += 5;
                        break;
                    }
                    
                // Clear the screen
                case CMD_CLEARSCREEN:
                    {
                        var depthMask = gl.getParameter(gl.DEPTH_WRITEMASK);
                        var colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
                        gl.depthMask(true);
                        gl.colorMask(true, true, true, true);
                        col = m_commandList[i + 2];
                        gl.clearColor((col & 0xff) / 255.0, ((col >> 8) & 0xff) / 255.0, ((col >> 16) & 0xff) / 255.0, ((col >>24) & 0xff) / 255.0);
                        gl.clear(m_commandList[i + 1]);
                        gl.depthMask(depthMask);
                        gl.colorMask(colorMask[0], colorMask[1], colorMask[2], colorMask[3]);
                        i += 3;
                        break;
                    }
                    
                // m_matrices
                case CMD_SETPROJECTION:
                    {
                        m_matrices[CMD_MATRIX_PROJECTION] = m_commandList[i + 1];                    
                        SetShaderMatrices();                    
                        i += 2;
                        break;
                    }
                case CMD_SETVIEW:
                    {                    
                        m_matrices[CMD_MATRIX_VIEW] = m_commandList[i + 1];
                        SetShaderMatrices();
                        i += 2;
                        break;
                    }
                case CMD_SETWORLD:
                    {
                        m_matrices[CMD_MATRIX_WORLD] = m_commandList[i + 1];                    
                        SetShaderMatrices();
                        i += 2;
                        break;
                    }

                // Set Texture Command                           
                case CMD_SETTEXTURE:
                    {              
                        texture = m_commandList[i + 1];
                        stage = m_commandList[i + 2];
                        i += 3;
                        if (texture === null) {
                                                    
                            texture = m_nullTexture;
                            gl.activeTexture(gl.TEXTURE0 + stage);

                            // Check here if the texture.Texture object actually exists
                            if (!WebGL_IsTextureValid(texture, WebGL_gpu_get_tex_mip_enable()))
                            {
                                WebGL_FlushTexture(texture, WebGL_gpu_get_tex_mip_enable());
                                WebGL_RecreateTexture(texture, WebGL_gpu_get_tex_mip_enable());
                            }

                            gl.bindTexture(gl.TEXTURE_2D, texture.Texture);
                            gl.uniform1i(m_currentShader.fragmentTextureAttribute, 0);                        
                            m_activeTextures[stage] = null;
                        } 
                        else {                        
                            gl.activeTexture(gl.TEXTURE0 + stage);

                            // Check here if the texture.Texture object actually exists
                            if (!WebGL_IsTextureValid(texture, WebGL_gpu_get_tex_mip_enable()))
                            {
                                WebGL_FlushTexture(texture, WebGL_gpu_get_tex_mip_enable());
                                WebGL_RecreateTexture(texture, WebGL_gpu_get_tex_mip_enable());
                            }

                            gl.bindTexture(gl.TEXTURE_2D, texture.Texture);
                            gl.uniform1i(m_currentShader.fragmentTextureAttribute, 0);
                            SetTextureSamplerState(texture, stage);                        
                            m_activeTextures[stage] = texture;
                        }                        
                        break;
                    }                

                // Set Vertex Buffer command
                case CMD_SETVERTEXBUFFER:
                    {                                            
                        pBuff = m_commandList[i + 1];
                        i += 2;
                        if (pBuff.Dirty) {
                            pBuff.UpdateBuffers();
                        }
                        pBuff.FrameLock = this.FrameCount;
                        
                        SetVertexBuffer(pBuff);
                    }
                    break;


                // Primitive rendering            
                case CMD_DRAWTRIANGLE:
                    {
                        gl.drawArrays(gl.TRIANGLES, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                case CMD_DRAWTRIFAN:
                    {
                        gl.drawArrays(gl.TRIANGLE_FAN, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                case CMD_DRAWTRISTRIP:
                    {
                        gl.drawArrays(gl.TRIANGLE_STRIP, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                case CMD_DRAWLINE:
                    {
                        gl.drawArrays(gl.LINES, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                case CMD_DRAWLINESTRIP:
                    {
                        gl.drawArrays(gl.LINE_STRIP, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                case CMD_DRAWPOINT:
                    {
                        gl.drawArrays(gl.POINTS, m_commandList[i + 1], m_commandList[i + 2]);
                        i += 3;
                        break;
                    }
                    
                // Set the current render target    
                case CMD_SETRENDER_TARGET:
                    {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, m_commandList[i + 1]);
                        i += 2;
                        break;
                    }
                
                // Render states
                case CMD_SET_COLOUR_MASK:
                    {
                        gl.colorMask(m_commandList[i + 2], m_commandList[i + 3], m_commandList[i + 4], m_commandList[i + 1]);
                        i += 5;
                        break;
                    }
                case CMD_SET_BLEND_MODE:
                    {
                        //gl.blendFuncSeparate(ConvertBlend(m_commandList[i + 1]), ConvertBlend(m_commandList[i + 2]), gl.ONE, gl.ZERO);
                        gl.blendFunc(ConvertBlend(m_commandList[i + 1]), ConvertBlend(m_commandList[i + 2]));                        
                        i += 3;
                        break;
                    }
                case CMD_SETRENDERSTATE:
	                {
	                    SetGLRenderState(m_commandList[i + 1], m_commandList[i + 2]);
	                    i += 3;
	                    break;
	                }
	                	                
                // Shader constants
                case CMD_SETUNIFORMI:
                    {                        
                        handle = m_commandList[i + 1];                    
                        shaderData = m_commandList[i + 2];
                        i += 3;
                        
                        uniformData = uniformCache[uniformCache.names[handle]];
                        switch (uniformData.info["type"])
                        {
	                	    case gl.INT: gl.uniform1iv(uniformData.location, shaderData); break;
	                	    case gl.INT_VEC2: gl.uniform2iv(uniformData.location, shaderData); break;
	                	    case gl.INT_VEC3: gl.uniform3iv(uniformData.location, shaderData); break;
	                	    case gl.INT_VEC4: gl.uniform4iv(uniformData.location, shaderData); break;

                            case gl.BOOL: gl.uniform1iv(uniformData.location, shaderData); break;
	                	    case gl.BOOL_VEC2: gl.uniform2iv(uniformData.location, shaderData); break;
	                	    case gl.BOOL_VEC3: gl.uniform3iv(uniformData.location, shaderData); break;
	                	    case gl.BOOL_VEC4: gl.uniform4iv(uniformData.location, shaderData); break;
	                    } 	                    
	                    break;
	                }            
                case CMD_SETUNIFORMF:
                    {
                        handle = m_commandList[i + 1];                    
                        shaderData = m_commandList[i + 2];
                        i += 3;
                        
                        uniformData = uniformCache[uniformCache.names[handle]];
                        switch (uniformData.info["type"])
                        {
	                	    case gl.FLOAT: gl.uniform1fv(uniformData.location, shaderData); break;
	                	    case gl.FLOAT_VEC2: gl.uniform2fv(uniformData.location, shaderData); break;
	                	    case gl.FLOAT_VEC3: gl.uniform3fv(uniformData.location, shaderData); break;
	                	    case gl.FLOAT_VEC4: gl.uniform4fv(uniformData.location, shaderData); break;
	                	    case gl.FLOAT_MAT2: gl.uniformMatrix2fv(uniformData.location, false, shaderData); break;
	                	    case gl.FLOAT_MAT3: gl.uniformMatrix3fv(uniformData.location, false, shaderData); break;
	                	    case gl.FLOAT_MAT4: gl.uniformMatrix4fv(uniformData.location, false, shaderData); break;
	                    }	                    
                        break;
                    }
                            
	            case CMD_SETSAMPLERSTATE:
                    {
                        stage = m_commandList[i + 1];
                        var state = m_commandList[i + 2];
                        var setting = m_commandList[i + 3];
                        i += 4;
                        
                        var textureStageSamplerState = m_textureStageSamplerState[stage];
                        textureStageSamplerState.States[state] = setting;

                        if (m_activeTextures[stage] != null)
                        {
                            gl.activeTexture(gl.TEXTURE0 + stage);

                            // Check here if the texture.Texture object actually exists
                            if (!WebGL_IsTextureValid(m_activeTextures[stage], WebGL_gpu_get_tex_mip_enable()))
                            {
                                WebGL_FlushTexture(m_activeTextures[stage], WebGL_gpu_get_tex_mip_enable());
                                WebGL_RecreateTexture(m_activeTextures[stage], WebGL_gpu_get_tex_mip_enable());
                            }

                            gl.bindTexture(gl.TEXTURE_2D, m_activeTextures[stage].Texture);
                        }
                        
                        // Maker sure the current texture bound for this stage is updated
                        SetTextureSamplerState(m_activeTextures[stage], stage);                        
                        break;
                    }            

                case CMD_SETLIGHT:
                    {
                        ind = m_commandList[i + 1];
                        m_pointLights.set(m_commandList[i + 2], ind * 4);
                        m_directionalLights.set(m_commandList[i + 3], ind * 4);
                        m_lightColours.set(m_commandList[i + 4], ind * 4);
                        i += 5;
                        
                        SetLightingEnv(SHADER_ENV_LIGHTING_BIT);                        
                        break;
                    }
                case CMD_SETAMBIENT:
                    {                    
                        m_ambientLight.set(m_commandList[i + 1]);
                        i += 2;   
                        SetLightingEnv(SHADER_ENV_AMBIENT_BIT);                        
                        break;
                    }
                case CMD_SETFOG:
                    {                                        
                        m_fogParameters.set(m_commandList[i + 1]);
                        i += 2;           
                        SetLightingEnv(SHADER_ENV_FOG_BIT);                        
                        break;
                    }
                case CMD_SETLIGHTENABLE:
                    {
                        ind = m_commandList[i + 1];
                        enable = m_commandList[i + 2];
                        col = m_commandList[i + 3]; // the colour the light's meant to be
                        i += 4;
                        if (enable) {
                            m_lightColours.set(col, ind * 4);
                        }
                        else {
                            var baseIndex = ind * 4;
                            m_lightColours[baseIndex + 0] = 0;
                            m_lightColours[baseIndex + 1] = 0;
                            m_lightColours[baseIndex + 2] = 0;
                            m_lightColours[baseIndex + 3] = 0;
                        }
                        SetLightingEnv(SHADER_ENV_LIGHTING_BIT);                        
                        break;
                    }
                case CMD_SETALPHATEST:
                    {
                        m_alphaTestEnable = m_commandList[i + 1];
                        m_alphaTestValue = m_commandList[i + 2];
                        i += 3;
                        SetLightingEnv(SHADER_ENV_ALPHATEST_BIT);                        
                        break;
                    }
               case CMD_UPDATE_TEXTURE:
                    {
                        // RK : retrieve the info from the command list
                        // RK : params are
                        // RK : texture, x, y, canvas info (object ref), texture format
                        // RK : place contents of the canvas (of width and height) on the texture at the x, y pixel position
                        texture = m_commandList[ i + 1];
                        var xx = m_commandList[ i + 2];
                        var yy = m_commandList[ i + 3 ];
                        var ww = m_commandList[i + 4];
                        var hh = m_commandList[i + 5];
                        var canvas = m_commandList[i + 6];
                        var format = m_commandList[i + 7];
                        i += 8;

                        var texFormatData = g_webGL.ConvertTexFormat(format);

                        // May need to do some buffer format switcheroo
                        switch(format)
                        {                            
                            case eTextureFormat_A8R8G8B8: break;
                            case eTextureFormat_A4R4G4B4:
                                { 
                                    var temparray = new Uint16Array( canvas.buffer);
                                    canvas = temparray;
                                } break;
                            case eTextureFormat_Float16:
                                { 
                                    var temparray = new Uint16Array( canvas.buffer);
                                    canvas = temparray;
                                } break;
                            case eTextureFormat_Float32:
                                { 
                                    var temparray = new Float32Array( canvas.buffer);
                                    canvas = temparray;
                                } break;
                            case eTextureFormat_R8: break;
                            case eTextureFormat_R8G8: break;
                            case eTextureFormat_R16G16B16A16_Float:
                                { 
                                    var temparray = new Uint16Array( canvas.buffer);
                                    canvas = temparray;
                                } break;
                            case eTextureFormat_R32G32B32A32_Float:
                                { 
                                    var temparray = new Float32Array( canvas.buffer);
                                    canvas = temparray;
                                } break;
                        }

                        // Hmm... to make this work with the texture-on-demand stuff we'll need to store a complete copy of the
                        // image data that we can then use to rebuild the texture
                        // At the moment this won't work properly

                        if (!WebGL_IsTextureValid(texture, WebGL_gpu_get_tex_mip_enable()))
                        {
                            WebGL_FlushTexture(texture, WebGL_gpu_get_tex_mip_enable());
                            WebGL_RecreateTexture(texture, WebGL_gpu_get_tex_mip_enable());
                        }                        

                        // bind the texture we want to change
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, texture.Texture);
                        //gl.texSubImage2D(gl.TEXTURE_2D, 0, xx, yy, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                        //gl.texSubImage2D(gl.TEXTURE_2D, 0, xx, yy, ww,hh, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                        gl.texSubImage2D(gl.TEXTURE_2D, 0, xx, yy, ww,hh, texFormatData.format, texFormatData.type, canvas);

                        // rebind the correct texture back in
                        if (m_activeTextures.length > 0) {
                            if (m_activeTextures[0] != null) {
                                gl.bindTexture(gl.TEXTURE_2D, m_activeTextures[0].Texture);
                            }
                        }
                        break;
                    }
            }
        }
        
        // Clear off the command list now that we've finished drawing from it
        m_commandList.length = 0;
    };    
}
