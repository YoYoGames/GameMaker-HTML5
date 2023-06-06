// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            libWebGL.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///
/// In:		 <param name="_canvas">canvas to BIND to...</param>
///          <param name="_options">Object literal: 
///                 Stencil,
///                 PreserveDrawingBuffer,
///          </param>
///          </summary>
// #############################################################################################
/** @constructor */
function yyWebGL(_canvas, _options) {        

    var gl = null;
    
    // Made members of "this" because the fact they're in use is an implementation detail
    // that the Runner/whatever should not need to know about and should be changeable
    // without affecting the way the Runner/whatever calls this library
    var m_VBufferManager = null,
	    m_CommandBuilder = null,
        m_RenderStateManager = null;
	    
	// Used for tracking VBuffer allocations
	var m_frameCount = 0;
	    
	// Built-in shaders for general rendering
	var m_default2DShader,
	    m_default3DShader,
	    m_CurrentShader;
	    
	// Built-in vertex formats for 2D and 3D rendering
	var m_vertexFormat2D,
	    m_vertexFormat3D,
	    m_vertexFormats = []; // formats registered by the engine for use
	    
    var m_viewportWidth,
        m_viewportHeight,
        m_deviceWidth,
        m_deviceHeight;	    	    
        
    var m_maxTextureStages,
        m_maxTextureSize;

    var m_ShaderIndex = 0;
	Object.defineProperties(this, {
	    Context: {
	        get: function () { return gl; }
	    },	    
	    Valid: {
	        get: function () { return (gl !== null && gl !== undefined); }
	    },
        RSMan: {
            get: function () { return m_RenderStateManager; }
        },
	    VERTEX_FORMAT_2D: {
	        get: function () { return m_vertexFormat2D; }
	    },
	    VERTEX_FORMAT_3D: {
	        get: function () { return m_vertexFormat3D; }	        
	    },
	    Shader_2D: {
	        get: function () { return m_default2DShader; }
	    },
	    Shader_3D: {
	        get: function () { return m_default3DShader; }
	    },
	    ViewportWidth: {
	        get: function () { return m_viewportWidth; }
	    },
	    ViewportHeight: {
	        get: function () { return m_viewportHeight; }
	    },
	    DeviceWidth: {
	        get: function () { return m_deviceWidth; },
	        set: function (val) { m_deviceWidth = val; }
	    },
	    DeviceHeight: {
	        get: function () { return m_deviceHeight; },
	        set: function (val) { m_deviceHeight = val; }
        },
        MaxTextureStages: {
            get: function () { return m_maxTextureStages; } 
        }
	});
    
    // #############################################################################################
    /// Function:<summary>
    ///             Construction
    ///          </summary>
    // #############################################################################################
    (function () {
    	
        gl = BindWebGL(_canvas, _options);
        if (gl) {
        
            // Register the gl object with all other libWebGL classes
            PropagateGL(gl);

            // Enumerate values according to the GL capabilities
            var maxTextureStages = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            m_maxTextureStages = (maxTextureStages < yyGL.MAX_TEXTURE_STAGES)
                ? maxTextureStages
                : yyGL.MAX_TEXTURE_STAGES;
            m_maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            
        
            m_CommandBuilder = new yyCommandBuilder(_options.InterpolatePixels);
            m_RenderStateManager = new yyRenderStateManager(m_maxTextureStages, 32, m_CommandBuilder, _options.InterpolatePixels);
            m_VBufferManager = new yyVBufferManager(m_CommandBuilder, m_RenderStateManager);            

            RegisterDefaultVertexFormats();

            SetupDefaultShader();
            SetupDefault3DShader();

            // At all times a shader needs to be in play, so directly choose the 2D one as a default
            m_CommandBuilder.SetShader(m_default2DShader);

            InitExtensions();
        }        
        
    })();

    // #############################################################################################
    /// Function:<summary>
    //              Private: Enable whatever WebGL extensions we may be able to offer the users.
    ///          </summary>
    // #############################################################################################
    function InitExtensions()
    {
        // Check extension availability
        g_extAnisotropic = (
            gl.getExtension('EXT_texture_filter_anisotropic') ||
            gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
            gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
            );

        g_extTextureHalfFloat = gl.getExtension('OES_texture_half_float');
        g_extTextureHalfFloatLinear = gl.getExtension('OES_texture_half_float_linear');
        g_extColourBufferHalfFloat = gl.getExtension('EXT_color_buffer_half_float');
        g_extTextureFloat = gl.getExtension('OES_texture_float');
        g_extTextureFloatLinear = gl.getExtension('OES_texture_float_linear');
        g_extColourBufferFloat = gl.getExtension('EXT_color_buffer_float');
        
        if (!(typeof WebGL2RenderingContext === typeof undefined) && (gl instanceof WebGL2RenderingContext))        
        {
            g_isWebGL2 = true;
        }
        
        if (g_isWebGL2)
        {
            g_HalfFloatSurfsUseSizedFormats = true;
			g_FloatSurfsUseSizedFormats = true;

			g_SupportSubFourChannelIntSurfs = true;
			g_IntSurfsUseSizedFormats = true;
        }
        else
        {
            g_HalfFloatSurfsUseSizedFormats = false;
			g_FloatSurfsUseSizedFormats = false;
			
			g_SupportSubFourChannelIntSurfs = false;
			g_IntSurfsUseSizedFormats = false;					
        }

        // This can probably be simplified
        if (g_extColourBufferHalfFloat || g_extColourBufferFloat)
        {
            if (g_isWebGL2)
            {                
                g_SupportHalfFloatSurfs = true;                                
                g_SupportSubFourChannelHalfFloatSurfs = true;
            }
            else
            {
                if ((g_extTextureHalfFloat && g_extTextureHalfFloatLinear) ||
                    (g_extTextureFloat && g_extTextureFloatLinear))
                {
                    g_SupportHalfFloatSurfs = true;                                        
                    g_SupportSubFourChannelHalfFloatSurfs = false;
                }
            }
        }

        if (g_extColourBufferFloat)
        {
            if (g_isWebGL2)
            {                
                if (g_extTextureFloatLinear)
                {
                    g_SupportFloatSurfs = true;                                
                    g_SupportSubFourChannelFloatSurfs = true;
                }
            }
            else
            {
                if (g_extTextureFloat && g_extTextureFloatLinear)
                {
                    g_SupportFloatSurfs = true;                                        
                    g_SupportSubFourChannelFloatSurfs = true;
                }
            }
        }

        g_extStandardDerivatives = gl.getExtension('OES_standard_derivatives');
        if (g_isWebGL2 || g_extStandardDerivatives)
        {
            g_SupportGLSLDerivatives = true;

            if (g_extStandardDerivatives)
            {
                g_AppendDerivativesExtToShader = true;
            }
        }
    }
            
    // #############################################################################################
    /// Function:<summary>
    //              Private: This is a slightly hacky way to not be passing the gl object around
    //              any time a new object is created that needs to use it. However, it avoids gl
    //              polluting the global namespace.
    ///          </summary>
    // #############################################################################################
    function PropagateGL(_gl) {
    
        yyCommandBuilder.prototype._gl = _gl;
        yyVBufferManager.prototype._gl = _gl;
        yyVBuffer.prototype._gl = _gl;
        yyGLTexture.prototype._gl = _gl;
        yyVertexFormat.prototype._gl = _gl;
        yyTextureSamplerState.prototype._gl = _gl;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private:
    ///             IE11 has webgl support. IE11 doesn't have FULL webgl support.
    ///             The result of <meta http-equiv="X-UA-Compatible" content="IE=edge" > in
    ///             index.html is that it will ask the browser to go ahead and provide this
    ///             half-arsed webgl. If we manage to successfully call getContext() for webgl
    ///             but then detect it's a broken webgl we won't be able to call getContext('2d')
    ///             and use its results as they'll be null.
    ///             Therefore we're stuck with detecting IE11 and not allowing it to try and bind
    ///             to webgl.
    ///          </summary>
    // #############################################################################################
    function DetectIE11() {

        var userAgent = navigator.userAgent.toString().toLowerCase();
        var tridentLoc = userAgent.indexOf("trident/");
        if (tridentLoc >= 0) {
            var version = parseFloat(userAgent.slice(tridentLoc + "trident/".length));
            if (version == 7) {
                return true;
            }
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Try and bind WebGL to a canvas
    ///          </summary>
    ///
    /// In:		 <param name="_canvas">canvas to BIND to...</param>
    /// Out:	 <returns>
    ///				true for okay, false for error....
    ///			 </returns>
    // #############################################################################################
    function BindWebGL(_canvas, _options)
    {
        //if (DetectIE11()) return null;

	    var glcontext = null;
	    //f=M.getContext(           "experimental-webgl",{antialias:l})))
	    var contextNames = ["webgl","experimental-webgl","moz-webgl","webkit-3d"];      // unfortunately we need to drop back to WebGL1 in order to support OES_standard_derivatives
        //var contextNames = ["webgl2", "webgl","experimental-webgl","moz-webgl","webkit-3d"];
	    //if (window.WebGLRenderingContext)
	    {
		    for (var i = 0; i < contextNames.length; i++)
		    {
			    try
			    {
			        var attributes = {
				        alpha: true, 
				        stencil: _options.Stencil,
				        antialias: false,
				        premultipliedAlpha: false,
				        preserveDrawingBuffer: _options.PreserveDrawingBuffer
				    };
    				
				    glcontext = _canvas.getContext(contextNames[i], attributes);							
				    if (glcontext) {
				        break;
				    }
			    }
			    catch (ex) {
				    return null;
			    }
		    }
	    }	
	    if (glcontext)
	    {
            m_viewportWidth = _canvas.width;
            m_viewportHeight = _canvas.height;
		    m_deviceWidth = m_viewportWidth;
		    m_deviceHeight = m_viewportHeight;
	    }
        return glcontext;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Setup the default vertex formats used for stock 2D/3D rendering
    ///          </summary>
    // #############################################################################################
    function RegisterDefaultVertexFormats() {
        
        var format2D = new yyVertexFormat(),
            format3D = new yyVertexFormat();
            
        // Ordering here must be maintained else it'll mess up the command builder
        // and is independent of the ordering used in shader programs using these formats
        format2D.AddPosition3D();
        format2D.AddColour();
        format2D.AddUV();        
    	
    	format3D.AddPosition3D();
    	format3D.AddColour();
    	format3D.AddUV();
    	format3D.AddNormal();
                        
        m_vertexFormat2D = m_vertexFormats.push(format2D) - 1;
        m_vertexFormat3D = m_vertexFormats.push(format3D) - 1;
        
        m_VBufferManager.RegisterFVF(m_vertexFormat2D);    	    	    	    	
    	m_VBufferManager.RegisterFVF(m_vertexFormat3D);
    	
    	// Make sure we inform the command builder that these are "our" vertex formats
    	// and therefore users may use them implicilty and without care for the order or
    	// existence of the pre-defined shader constants for position, normal, uv and colour
    	format2D.FixedFunction = format3D.FixedFunction = true;
    };
    
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.RegisterVertexFormat = function(_format) {
    
        // Check to see if a previously registered format exactly matches the one provided
        for (var i in m_vertexFormats) {
            if (!m_vertexFormats.hasOwnProperty(i)) continue;
            
            if (m_vertexFormats[i].Equals(_format)) {
                return i;
            }
        }        

        var FVF = m_vertexFormats.push(_format) - 1;
        m_VBufferManager.RegisterFVF(FVF);
        
        return FVF;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.GetVertexFormat = function(_FVF) {
    
        return m_vertexFormats[_FVF];
    };       
    
    // #############################################################################################
    /// Property: <summary>
    ///           	Private: Check on power of two (for texture sizes when being setup...)
    ///           </summary>
    // #############################################################################################
    function isPowerOfTwo(_n)
    {
        while (((_n & 0x1) == 0) && (_n > 1)) {
            _n >>= 1;
        }
        return (_n == 1);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.GetMaxTextureSize = function() {
            
        return m_maxTextureSize;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetViewPort = function(_portx, _porty, _portw, _porth) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetViewPort(_portx, _porty, _portw, _porth);
    };            

    // #############################################################################################
    /// Property: <summary>
    ///           	Private: 
    ///           </summary>
    // #############################################################################################
    function addshader(prog, type, source) {

        var glShadType = (type == 'vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
	    var s = gl.createShader(glShadType);	
        var shadsource = source;
        if ((glShadType == gl.FRAGMENT_SHADER) && g_AppendDerivativesExtToShader)
        {
            shadsource = "#extension GL_OES_standard_derivatives : enable\n" + source;
        }
	    gl.shaderSource(s, shadsource);
	    gl.compileShader(s);
	    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
	    {
	        //alert("Could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(s));
            console.log("Could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(s));
	        console.log("----------------Shader Begin----------------");
	        console.log(shadsource);
	        console.log("-----------------Shader END----------------");
		    return;
	    }
	    gl.attachShader(prog, s);
    };

    // #############################################################################################
    /// Function:<summary>
    ///          	Setup the basic textured 2D and 3D unlit, no fogging shader
    ///          </summary>
    // #############################################################################################    
    function SetupDefaultShader() {

        var vscr = getBasicVertexShader();
	    var fsrc = getBasicFragmentShader();

	    var shaderProgram = gl.createProgram();
	    var error = gl.getError();
	    addshader(shaderProgram, "vertex", vscr);
        addshader(shaderProgram, "fragment", fsrc);
        gl.linkProgram(shaderProgram);
        error = gl.getError();

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
    	    alert("Could not initialise shaders\n\n");
    	    return false;
        }
        gl.useProgram(shaderProgram);    

	    // Look up ViewMatrix constant    
        m_default2DShader = shaderProgram;
    	
    	// Setup standard shader attribute locations for use with our "fixed function" vertex format
	    shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram, "vertex");
        shaderProgram.normalAttribute = gl.getAttribLocation(shaderProgram, "normal");
        shaderProgram.colourAttribute = gl.getAttribLocation(shaderProgram, "color");	    
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "UV");

        shaderProgram.fragmentTextureAttribute = gl.getUniformLocation(shaderProgram, "pTexure");
        shaderProgram.vertexMatricesAttribute = gl.getUniformLocation(shaderProgram, "matrices");
        shaderProgram.fogParametersAttribute = gl.getUniformLocation(shaderProgram, "fogParameters");
        shaderProgram.alphaTestEnableAttribute = gl.getUniformLocation(shaderProgram, "alphaTestEnabled");
        shaderProgram.alphaTestValueAttribute = gl.getUniformLocation(shaderProgram, "alphaRefValue");

        // Setup custom vertex formation locations
	    shaderProgram.AttribIndices = [];
        shaderProgram.AttribIndices.push(gl.getAttribLocation(shaderProgram, "vertex"));
        shaderProgram.AttribIndices.push(gl.getAttribLocation(shaderProgram, "color"));
        shaderProgram.AttribIndices.push(gl.getAttribLocation(shaderProgram, "UV"));

        // Setup custom vertex formation locations
        shaderProgram.AttribIndices = [];
        shaderProgram.Names = [];
        shaderProgram.Types = [];
        if (shaderProgram.positionAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.positionAttribute);
            shaderProgram.Names.push("vertex");
            shaderProgram.Types.push(yyGL.VU_POSITION);
        }
        if (shaderProgram.normalAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.normalAttribute);
            shaderProgram.Names.push("normal");
            shaderProgram.Types.push(yyGL.VU_NORMAL);
        }
        if (shaderProgram.colourAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.colourAttribute);
            shaderProgram.Names.push("color");
            shaderProgram.Types.push(yyGL.VU_COLOR);
        }
        if (shaderProgram.textureCoordAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.textureCoordAttribute);
            shaderProgram.Names.push("UV");
            shaderProgram.Types.push(yyGL.VU_TEXCOORD);
        }
        shaderProgram.shader_index = m_ShaderIndex++;
        return true;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          	Setup the 3D shader capable of fogging and handling 8 lights
    ///          </summary>
    // #############################################################################################
    function SetupDefault3DShader() {

        var vsrc = getFullVertexShader();
        var fsrc = getFullFragmentShader();

	    var shaderProgram = gl.createProgram();
	    var error = gl.getError();
	    addshader(shaderProgram, "vertex", vsrc);
        addshader(shaderProgram, "fragment", fsrc);
        gl.linkProgram(shaderProgram);
        error = gl.getError();

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
    	    alert("Could not initialise 3D shader\n\n");
    	    return false;
        }
        gl.useProgram(shaderProgram);

	    // Look up ViewMatrix constant
        shaderProgram.pViewMatrix = gl.getUniformLocation(shaderProgram, "ViewMatrix");
        m_default3DShader = shaderProgram;        

	    // Setup standard shader attribute locations for use with our "fixed function" vertex format
	    shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram, "vertex");
        shaderProgram.normalAttribute = gl.getAttribLocation(shaderProgram, "normal");
        shaderProgram.colourAttribute = gl.getAttribLocation(shaderProgram, "color");	          
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "UV");

        shaderProgram.fragmentTextureAttribute = gl.getUniformLocation(shaderProgram, "pTexure");
        shaderProgram.vertexMatricesAttribute = gl.getUniformLocation(shaderProgram, "matrices");    
        shaderProgram.dirLightDirAttribute = gl.getUniformLocation(shaderProgram, "dirlightdir");    
        shaderProgram.pointLightPosAttribute = gl.getUniformLocation(shaderProgram, "pointlightpos");
        shaderProgram.lightColourAttribute = gl.getUniformLocation(shaderProgram, "lightcol");    
        shaderProgram.ambientColAttribute = gl.getUniformLocation(shaderProgram, "ambientcol");
        shaderProgram.fogParametersAttribute = gl.getUniformLocation(shaderProgram, "fogParameters");
        shaderProgram.alphaTestEnableAttribute = gl.getUniformLocation(shaderProgram, "alphaTestEnabled");
        shaderProgram.alphaTestValueAttribute = gl.getUniformLocation(shaderProgram, "alphaRefValue");
        
        // Setup custom vertex formation locations
        shaderProgram.AttribIndices = [];
        shaderProgram.Names = [];
        shaderProgram.Types = [];
        if (shaderProgram.positionAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.positionAttribute);
            shaderProgram.Names.push("vertex");
            shaderProgram.Types.push(yyGL.VU_POSITION);
        }
        if (shaderProgram.normalAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.normalAttribute);
            shaderProgram.Names.push("normal");
            shaderProgram.Types.push(yyGL.VU_NORMAL);
        }
        if (shaderProgram.colourAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.colourAttribute);
            shaderProgram.Names.push("color");
            shaderProgram.Types.push(yyGL.VU_COLOR);
        }
        if (shaderProgram.textureCoordAttribute != -1) {
            shaderProgram.AttribIndices.push(shaderProgram.textureCoordAttribute);
            shaderProgram.Names.push("UV");
            shaderProgram.Types.push(yyGL.VU_TEXCOORD);
        }
        shaderProgram.shader_index = m_ShaderIndex++;

        return true;
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.AddShader = function (_vertexShader, _fragmentShader, _attributes) {
            
        // The asset compiler punts "None" into the Vertex/Fragment fields for non GLSL-ES shader so handle these
        if (_vertexShader == "None" || _fragmentShader == "None") {
        
            var shader = { program : null, texture_stages : null };
            return shader;
        }
    
        var shaderProgram = gl.createProgram();
        var error = gl.getError();
        addshader(shaderProgram, "vertex", _vertexShader);
        addshader(shaderProgram, "fragment", _fragmentShader);
        gl.linkProgram(shaderProgram);
        error = gl.getError();

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        
            var shader = { program : null, texture_stages : null };
            return shader;
        }
    
        // Search the shader for texture attributes and assign them to stages    
        gl.useProgram(shaderProgram);                

        // Setup common shader uniform locations (getUniformLocation returns -1 if name isn't found)
        shaderProgram.vertexMatricesAttribute = gl.getUniformLocation(shaderProgram, "gm_Matrices");
        shaderProgram.dirLightDirAttribute = gl.getUniformLocation(shaderProgram, "gm_Lights_Direction");
        shaderProgram.pointLightPosAttribute = gl.getUniformLocation(shaderProgram, "gm_Lights_PosRange");
        shaderProgram.lightColourAttribute = gl.getUniformLocation(shaderProgram, "gm_Lights_Colour");
        shaderProgram.ambientColAttribute = gl.getUniformLocation(shaderProgram, "gm_AmbientColour");
        
        // Grab attribute locations for use with our "fixed function" vertex formats
        shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram, "in_Position");
        shaderProgram.normalAttribute = gl.getAttribLocation(shaderProgram, "in_Normal");
        shaderProgram.colourAttribute = gl.getAttribLocation(shaderProgram, "in_Colour");
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "in_TextureCoord");
        
        // Setup proprietary shader attribute locations for use with custom vertex formats        
        shaderProgram.AttribIndices = [];
        shaderProgram.Types = [];
        for (var attr = 0; attr < _attributes.length; attr++) {
            shaderProgram.AttribIndices.push(gl.getAttribLocation(shaderProgram, _attributes[attr]));
            switch (_attributes[attr]) {
                case "in_Position": shaderProgram.Types.push(yyGL.VU_POSITION); break;
                case "in_Normal": shaderProgram.Types.push(yyGL.VU_NORMAL); break;
                case "in_Colour": shaderProgram.Types.push(yyGL.VU_COLOR); break;
                case "in_TextureCoord": shaderProgram.Types.push(yyGL.VU_TEXCOORD); break;
                default:
                    shaderProgram.Types.push(yyGL.VU_TEXCOORD); break;
            }
        }
        shaderProgram.Names = _attributes;


        // Setup texture stages
        var baseTextureName = "gm_BaseTexture";
        var textureStages = [ baseTextureName ];
        
        // Bind default sample s_TexSample to stage 0
        var stage = 0;
        var shaderData = [];
        var defaultSamplerAttr = gl.getUniformLocation(shaderProgram, baseTextureName);
        gl.uniform1iv(defaultSamplerAttr, [stage++]);
        shaderProgram.fragmentTextureAttribute = defaultSamplerAttr;
        
        // Grab all other texture stages and store off uniform data for potential later use
        shaderProgram.UniformCache = { 
            names: [] // ordered array to go back from uniform location to property data
        };
        for (var u = 0, uniformCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS); u < uniformCount; u++) {

            var s_width = 1;

            var uniformInfo = gl.getActiveUniform(shaderProgram, u),
                uniformName = uniformInfo["name"];
            if (uniformInfo["size"] > 1) {
            
                // For "uniform float u_color[3]" the uniform name baffingly returned by Chrome, at least, is u_color[0]                
                var ind = uniformName.indexOf('[');
                if (ind > 0) { 
                    uniformName = uniformName.substring(0, ind);
                }
            }
            
            if ((uniformInfo["type"] == gl.SAMPLER_2D) || (uniformInfo["type"] == gl.SAMPLER_CUBE)) {
                
                if (uniformName != baseTextureName) {

                    textureStages[stage] = uniformName;

                    var attr = gl.getUniformLocation(shaderProgram, uniformName);
                    gl.uniform1iv(attr, [stage++]);
                }
            } else {
                switch (uniformInfo["type"]) {
                    case gl.FLOAT: s_width = 1; break;
                    case gl.BOOL: s_width = 1; break;
                    case gl.INT: s_width = 1; break;
                    case gl.UNSIGNED_INT: s_width = 1; break;
                    case gl.FLOAT_VEC2: s_width = 2; break;
                    case gl.FLOAT_VEC3: s_width = 3; break;
                    case gl.FLOAT_VEC4: s_width = 4; break;
                    case gl.INT_VEC2: s_width = 2; break;
                    case gl.INT_VEC3: s_width = 3; break;
                    case gl.INT_VEC4: s_width = 4; break;
                    case gl.BOOL_VEC2: s_width = 2; break;
                    case gl.BOOL_VEC3: s_width = 3; break;
                    case gl.BOOL_VEC4: s_width = 4; break;
                    case gl.FLOAT_MAT2: s_width = 4; break;
                    case gl.FLOAT_MAT3: s_width = 9; break;
                    case gl.FLOAT_MAT4: s_width = 16; break;
                    default:
                        s_width = 1;
                }
            }
            
            // Cache the information about the uniform so we can access it quickly later            
            shaderProgram.UniformCache.names[u] = uniformName;
            shaderProgram.UniformCache[uniformName] = {
                index: u,
                location: gl.getUniformLocation(shaderProgram, uniformName),
                info: uniformInfo,
                width: s_width,
                size: uniformInfo.size               
            };
            // Also do an entry that uses the uniform INDEX as the lookup...
            shaderProgram.UniformCache[u] = shaderProgram.UniformCache[uniformName];        
            shaderProgram.vertex = _vertexShader;
            shaderProgram.fragment= _fragmentShader;
        }

        shaderProgram.shader_index = m_ShaderIndex++;
        shader = { program: shaderProgram, texture_stages: textureStages };
        return shader;
    };       

    // #############################################################################################
    /// Function:<summary>
    ///          	START of a new frame
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.StartFrame = function () {
        // Clear the command builder state
	   
	    m_frameCount++;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          	End of frame (flip etc.)
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.EndFrame = function () {        

	    m_VBufferManager.Flush();	    
	    m_CommandBuilder.FrameCount = m_frameCount;
	    m_CommandBuilder.Execute();
	    m_CommandBuilder.Reset();
	    // Set the backbuffer's alpha to 1.0
        gl.clearColor(1, 1, 1, 1);    
        gl.colorMask(false, false, false, true);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.colorMask(true,true,true, true);
        
        // gl.clearStencil(0);
        // gl.clear(gl.STENCIL_BUFFER_BIT);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          	Forces an immediate draw and empty of the current set of draw commands.
    ///             This is used when items such as screen grabs need to be executed.
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.FlushAll = function () {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.Execute();
    };
    
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetBlendMode = function(_src, _dest) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetBlendMode(_src, _dest);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_SrcBlend, _src);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_DestBlend, _dest);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_SrcBlendAlpha, _src);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_DestBlendAlpha, _dest);
    };

    this.SetBlendEnable = function(_enable)
    {
        m_RenderStateManager.SetRenderState(yyGL.RenderState_AlphaBlendEnable, _enable);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################    
    /** @this {yyWebGL} */
    this.SetZEnable = function (_flag) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_ZEnable, _flag);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_ZEnable, _flag);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################    
    /** @this {yyWebGL} */
    this.SetCull = function (_flag) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_CullMode, _flag);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_CullMode, _flag ? yyGL.Cull_CounterClockwise : yyGL.Cull_NoCulling);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetCullOrder = function (_order) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_CullOrder, _order);

        //m_RenderStateManager.SetRenderState(yyGL.RenderState_CullMode, _order);
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetZWriteEnable = function (_flag) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_ZWriteEnable, _flag);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_ZWriteEnable, _flag);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
//    this.SetZEnable = function (_flag) {
//    
//        m_VBufferManager.Flush();
//        m_CommandBuilder.SetRenderState(yyGL.RenderState_ZEnable, _flag);
//    };
//    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################            
    /** @this {yyWebGL} */
    this.SetColorWriteEnable = function (_rflag, _gflag, _bflag, _aflag) {
    
        //m_VBufferManager.Flush();
        var stateData = { red: _rflag, green: _gflag, blue: _bflag, alpha: _aflag };
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_ColourWriteEnable, stateData);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_ColourWriteEnable, stateData);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetLight = function (_ind, _pointLightData, _dirLightData, _lightColourData) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetLight(_ind, _pointLightData, _dirLightData, _lightColourData);
    }; 
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetLightEnable = function (_ind, _flag, _colourData) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetLightEnable(_ind, _flag, _colourData);        
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetAmbientLighting = function (_colourData) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetAmbientLight(_colourData);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetFogData = function (_fog) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetFog(_fog);

        // Unpack fog data and send to state manager
        var fogenable = _fog[0];
        var end = _fog[2];
        var start = end;
        if (_fog[1] != 0.0)
            start = end - (1.0 / _fog[1]);
        var colour = (_fog[4] * 255) | ((_fog[5] * 255) << 8) | ((_fog[6] * 255) << 16) | ((_fog[7] * 255) << 24);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_FogEnable, fogenable);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_FogStart, start);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_FogEnd, end);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_FogColour, colour);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetAlphaTest = function (_enable, _refValue) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetAlphaTest(_enable, _refValue);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_AlphaTestEnable, _enable);
        m_RenderStateManager.SetRenderState(yyGL.RenderState_AlphaRef, (_refValue * 255)|0);    // or the value with 0 to make sure it's an int
    };
               
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetTextureWrap = function (_stage, _wrap) {
    
        //m_VBufferManager.Flush();
        if (_wrap) {
//            m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Wrap);
//		    m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Wrap);

            m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Wrap);
            m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Wrap);
		}
		else {
		    //m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Clamp);
		    //m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Clamp);

            m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Clamp);
            m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Clamp);
		}
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetTextureFiltering = function (_stage, _filter) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_MagFilter, _filter);
	    //m_CommandBuilder.SetSamplerState(_stage, yyGL.SamplerState_MinFilter, _filter);

        m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_MagFilter, _filter);
        m_RenderStateManager.SetSamplerState(_stage, yyGL.SamplerState_MinFilter, _filter);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.GetMaxTextureStages = function () {
    
        return m_maxTextureStages;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetStencilEnable = function (_enable) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_StencilEnable, _enable);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_StencilEnable, _enable);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetStencilFunc = function(_func) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_StencilFunc, _func);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_StencilFunc, _func);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetStencilPass = function(_pass) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_StencilPass, _pass);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_StencilPass, _pass);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetStencilRef = function(_ref) {
    
        //m_VBufferManager.Flush();
        //m_CommandBuilder.SetRenderState(yyGL.RenderState_StencilRef, _ref);

        m_RenderStateManager.SetRenderState(yyGL.RenderState_StencilRef, _ref);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################        
    /** @this {yyWebGL} */
    this.SetShader = function (_shader) {
    
        // TODO: The flush may be heavy handed as we want to avoid unnecessary shader switches so it may not be necessary
        m_VBufferManager.Flush();
        m_CommandBuilder.SetShader(_shader);
        m_CurrentShader = _shader;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.GetUniformIndex = function (_shader, _const) {

        var uniformData = _shader.UniformCache[_const];
        if (uniformData) {
            return uniformData.index;
        }
        return -1;
    };


    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetUniformI = function (_handle, _shaderData) {
            
        if (_handle != -1) {
            m_VBufferManager.Flush();
            m_CommandBuilder.SetUniformI(_handle, _shaderData);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetUniformF = function (_handle, _shaderData) {
    
        if (_handle != -1) {
            m_VBufferManager.Flush();
            m_CommandBuilder.SetUniformF(_handle, _shaderData);    
        }
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetUniformMatrix = function (_handle, _shaderData) {
    
        if (_handle != -1) {
            m_VBufferManager.Flush();
            m_CommandBuilder.SetUniformMatrix(_handle, _shaderData);        // shader data already copied
        }
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Size up the shader data to the correct size/width
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.CopyArray = function (_handle, _shaderData) {
        // make sure the array fits the "WIDTH" of the uniform, and doesn't exceed the overall size
        var width = m_CurrentShader.UniformCache[_handle].width;
        var size = m_CurrentShader.UniformCache[_handle].size;

        var shaderData;
        var l = _shaderData.length;
        var l2 = (l + width) - ((l + width) % width);
        if (l2 > (width * size)) l2 = width * size;

        if (l == l2) {
            // Direct "fit"?  just hard copy.
            shaderData = new Float32Array(_shaderData);
        } else {
            // if not a DIRECT match, then "fit" manually - a lot slower
            shaderData = new Float32Array(l2);
            if (l2 < l) l = l2;
            for (var i = 0; i < l; i++) {
                shaderData[i] = _shaderData[i];
            }
        }
        return shaderData;
    };


    // #############################################################################################
    /// Function:<summary>
    ///             Set an array of INTs
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetUniformArrayI = function (_handle, _shaderData) {
    
        if (_handle != -1) {
            m_VBufferManager.Flush();
            _shaderData = this.CopyArray(_handle, _shaderData);
            m_CommandBuilder.SetUniformArrayI(_handle, _shaderData);        // shader data already copied
        }
    };    
    
    // #############################################################################################
    /// Function:<summary>
    ///             Set an array of floats
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetUniformArrayF = function (_handle, _shaderData)
    {
        if (_handle != -1)
        {
            m_VBufferManager.Flush();
            _shaderData =this.CopyArray(_handle, _shaderData);
            m_CommandBuilder.SetUniformArrayF(_handle, _shaderData);        // shader data already copied
        }
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.DrawComment = function (_str) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.DrawComment(_str);
    };

    this.Flush = function() {
        m_VBufferManager.Flush();
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.UpdateTexture = function (_texture, _x, _y, _w,_h,_canvas, _format) {
    
        // TODO: Not sure I like this being part of the command chain, should it be handled like pixel/screen/surface gets?
        m_CommandBuilder.UpdateTexture( _texture, _x, _y, _w,_h,_canvas, _format );
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // ############################################################################################# 
    /** @this {yyWebGL} */
    this.SetTexture = function (_stage, _texture) {
    
        if (_texture != null)       // we want to allow null textures to be passed to the command builder
        {
            yyGL.REQUIRE(_texture instanceof yyGLTexture, "Texture is not a yyGLTexture", yyGL.ERRORLEVEL_Development);
        }
        
        m_VBufferManager.Flush();
        m_CommandBuilder.SetTexture(_stage, _texture);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetViewMatrix = function (_matrix) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetView(_matrix);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetProjectionMatrix = function (_matrix) {
        
        m_VBufferManager.Flush();
        m_CommandBuilder.SetProjection(_matrix);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetWorldMatrix = function (_matrix) {
        
        m_VBufferManager.Flush();    
        m_CommandBuilder.SetWorld(_matrix);
    };        

    // #############################################################################################
    /// Function:<summary>
    ///             Given a texture/image make a native representation for it
    ///          </summary>
    ///
    /// In:		 <param name="_image">Image (<img>) objec to bind into a texture</param>    
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateTexture = function (_image) {
    
        // Store the current texture before rebinding the texture unit
        //var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    
	    //var glTexture = gl.createTexture();    		
	    //gl.bindTexture(gl.TEXTURE_2D, glTexture);	    
	    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
	    
	    // Extend the image passed in to allow us to track sampler states for it	    	    
	    var ret = new yyGLTexture(undefined/*glTexture*/, _image.width, _image.height, isPowerOfTwo(_image.width) && isPowerOfTwo(_image.height), _image, _image.m_mipsToGenerate, 0, eTextureFormat_A8R8G8B8);
    	
    	// Bind back to the original texture
	    //gl.bindTexture(gl.TEXTURE_2D, storedTexture);
	    
	    return ret;
    };

    this.GetSurfaceFormatName = function( _format)
    {
        switch (_format)
        {
            case	eTextureFormat_UnknownFormat:		return "surface_unknown";
            case	eTextureFormat_A8R8G8B8:			return "surface_rgba8unorm";
                //case	eTextureFormat_DXT1:				return "surface_unknown";		// block compressed formats are not valid for surfaces
                //case	eTextureFormat_DXT2:				return "surface_unknown";
                //case	eTextureFormat_DXT3:				return "surface_unknown";
                //case	eTextureFormat_DXT4:				return "surface_unknown";
                //case	eTextureFormat_DXT5:				return "surface_unknown";
            case	eTextureFormat_Float16:				return "surface_r16float";
            case	eTextureFormat_Float32:				return "surface_r32float";
            case	eTextureFormat_A4R4G4B4:			return "surface_rgba4unorm";
            case	eTextureFormat_R8:					return "surface_r8unorm";
            case	eTextureFormat_R8G8:				return "surface_rg8unorm";
            case	eTextureFormat_R16G16B16A16_Float:	return "surface_rgba16float";
            case	eTextureFormat_R32G32B32A32_Float:	return "surface_rgba32float";
            default:	return "surface_unknown";
        }
    };

    this.ConvertTexFormat = function(_format)
    {
        // This still needs fixing for all formats

        // Set some reasonable defaults in case an unsupported format is specified
        var texFormatData = {
            internalFormat: gl.RGBA,
            format: gl.RGBA, 
            type: gl.UNSIGNED_BYTE 
        };

        switch (_format) 
        { 
            case	eTextureFormat_UnknownFormat:		return texFormatData;
            case	eTextureFormat_A8R8G8B8:			texFormatData.internalFormat = gl.RGBA; texFormatData.format = gl.RGBA; texFormatData.type = gl.UNSIGNED_BYTE; return texFormatData;
            case	eTextureFormat_A4R4G4B4:			texFormatData.internalFormat = gl.RGBA; texFormatData.format = gl.RGBA; texFormatData.type = gl.UNSIGNED_SHORT_4_4_4_4; return texFormatData;
            case	eTextureFormat_DXT1:				return texFormatData;
            case	eTextureFormat_DXT2:				return texFormatData;
            case	eTextureFormat_DXT3:				return texFormatData;
            case	eTextureFormat_DXT4:				return texFormatData;
            case	eTextureFormat_DXT5:				return texFormatData;
            case	eTextureFormat_Depth:				return texFormatData;
            case	eTextureFormat_DepthStencil:		return texFormatData;
            case	eTextureFormat_Float16:				if (!g_SupportHalfFloatSurfs || !g_SupportSubFourChannelHalfFloatSurfs) return texFormatData; texFormatData.internalFormat = g_HalfFloatSurfsUseSizedFormats ? gl.R16F : gl.RED; texFormatData.format = gl.RED; texFormatData.type = g_HalfFloatSurfsUseSizedFormats ? gl.HALF_FLOAT : gl.HALF_FLOAT_OES; return texFormatData;
            case	eTextureFormat_Float32:				if (!g_SupportFloatSurfs || !g_SupportSubFourChannelFloatSurfs) return texFormatData; texFormatData.internalFormat = g_FloatSurfsUseSizedFormats ? gl.R32F : gl.RED; texFormatData.format = gl.RED; texFormatData.type = gl.FLOAT; return texFormatData;
            case	eTextureFormat_R8:					if (!g_SupportSubFourChannelIntSurfs) return texFormatData; texFormatData.internalFormat = g_IntSurfsUseSizedFormats ? gl.R8 : gl.RED; texFormatData.format = gl.RED; texFormatData.type = gl.UNSIGNED_BYTE; return texFormatData;
            case	eTextureFormat_R8G8:				if (!g_SupportSubFourChannelIntSurfs) return texFormatData; texFormatData.internalFormat = g_IntSurfsUseSizedFormats ? gl.RG8 : gl.RG; texFormatData.format = gl.RG; texFormatData.type = gl.UNSIGNED_BYTE; return texFormatData;
            case	eTextureFormat_R16G16B16A16_Float:	if (!g_SupportHalfFloatSurfs) return texFormatData; texFormatData.internalFormat = g_isWebGL2 ? gl.RGBA16F : gl.RGBA; texFormatData.format = gl.RGBA; texFormatData.type = g_isWebGL2 ? gl.HALF_FLOAT : g_extTextureHalfFloat.HALF_FLOAT_OES; return texFormatData;
            case	eTextureFormat_R32G32B32A32_Float:	if (!g_SupportFloatSurfs) return texFormatData; texFormatData.internalFormat = g_FloatSurfsUseSizedFormats ? gl.RGBA32F : gl.RGBA; texFormatData.format = gl.RGBA; texFormatData.type = gl.FLOAT; return texFormatData;
            default:	texFormatData.internalFormat = gl.RGBA; texFormatData.format = gl.RGBA; texFormatData.type = gl.UNSIGNED_BYTE; return true;
        } 

        return texFormatData;
    };

    this.RecreateTexture = function(_gltexture, _mipoptions)
    {
        // Store the current texture before rebinding the texture unit
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        // Get format info
        var texFormatData = this.ConvertTexFormat(_gltexture.Format);
    
	    var glTexture = gl.createTexture();    		
	    gl.bindTexture(gl.TEXTURE_2D, glTexture);	
        if (_gltexture.Image == null)
        {
            gl.texImage2D(gl.TEXTURE_2D, 0, texFormatData.internalFormat, _gltexture.Width, _gltexture.Height, 0, texFormatData.format, texFormatData.type, null);
        }
        else if (_gltexture.Image instanceof Uint8Array)
        {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _gltexture.Width, _gltexture.Height, 0, gl.RGBA, gl.UNSIGNED_BYTE, _gltexture.Image);
        }            
        else
        { 
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _gltexture.Image);
        }
        
        if (_mipoptions !== undefined
            && (_mipoptions == yyGL.MipEnable_On)
             || (_mipoptions == yyGL.MipEnable_OnlyMarked) && ((_gltexture.Flags !== undefined && (_gltexture.Flags & eInternalTextureFlags.GenerateMips) !== 0)))
        {
            gl.generateMipmap(gl.TEXTURE_2D);
            var currentFlags = _gltexture.Flags;
            currentFlags |= eInternalTextureFlags.HasMips;
            _gltexture.Flags = currentFlags;            
        }

        _gltexture.Texture = glTexture;	    
        _gltexture.SamplerState.BindDefaults(gl.TEXTURE_2D);

    	// Bind back to the original texture
        gl.bindTexture(gl.TEXTURE_2D, storedTexture);
        
        _gltexture.IsDirty = true;
    };

    this.IsTextureFormatSupported = function(_format)
    {
        switch (_format) 
        { 
            case eTextureFormat_A8R8G8B8: return true; 
            case eTextureFormat_Float16: if (g_SupportHalfFloatSurfs && g_SupportSubFourChannelHalfFloatSurfs) return true; else return false; 
            case eTextureFormat_Float32: if (g_SupportFloatSurfs && g_SupportSubFourChannelFloatSurfs) return true; else return false; 
            case eTextureFormat_A4R4G4B4: return true; 
            case eTextureFormat_R8: if (g_SupportSubFourChannelIntSurfs) return true; else return false;
            case eTextureFormat_R8G8: if (g_SupportSubFourChannelIntSurfs) return true; else return false;
            case eTextureFormat_R16G16B16A16_Float: if (g_SupportHalfFloatSurfs) return true; else return false; 
            case eTextureFormat_R32G32B32A32_Float: if (g_SupportFloatSurfs) return true; else return false; 
            default: return false; 
        } 
    };

    // #############################################################################################
    /// Function:<summary>
    ///				Clear the region in the indicated color
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.ClearScreen = function (_colour, _depth, _stencil, _col) {
    
        var bits = 0;
        if (_colour) {
            bits |= gl.COLOR_BUFFER_BIT;
        }
        if (_depth) {
            bits |= gl.DEPTH_BUFFER_BIT;
        }
        if (_stencil) {
            bits |= gl.STENCIL_BUFFER_BIT;
        }
	    m_CommandBuilder.ClearScreen(bits, _col);
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetRenderTarget = function (_target) {
    
        m_VBufferManager.Flush();
        m_CommandBuilder.SetRenderTarget(_target);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Set alpha to 0 on any pixels matching the transparency colour
    ///             _pixelData should be an Int32Array of data
    ///          </summary>
    // #############################################################################################
    function RemoveBackground(_pixelData, _w, _h) {

        if ((_w == 0) || (_h == 0)) {
            return;
        }
    	
        // Bottom left pixel of the sprite (who. decided. that. who?)
        var trcol = _pixelData[(_h - 1) * _w] & 0xffffff;
        for (var i = 0; i < (_w*_h); i++)
        {
    	    if ((_pixelData[i] & 0xffffff) == trcol)
    	    {
    		    _pixelData[i] = _pixelData[i] & 0xffffff;	
    	    }
        }
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Get the next POW2 texture size for webgl platforms
    ///          </summary>
    // #############################################################################################
    function GetPOW2Alignment(_size)
    {
        var max = m_maxTextureSize;
        
    	var	size = 1;
    	while (size <= max)
    	{
    		if( _size <= size ) return size;
    		size = size << 1;
    	}
    	return max;	
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateTextureFromScreen = function (_image, _x, _y, _w, _h, _removeback, _smooth, _invert) {    
    
        // Execute current list to ensure what we grab is actually what should've been drawn now
        this.Flush();
          
        var pSourcePixels = new Uint8Array(_w * _h * 4);
        gl.readPixels(_x, m_deviceHeight - (_y + _h), _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, pSourcePixels);    

        // Textures are held upside down compared to the screen, so invert the data if not using the application surface render target
        var pPixels;
        if (_invert) { 
        
            var pixelData = new ArrayBuffer(_w * _h * 4);
            pPixels = new Uint8Array(pixelData);
            for (var v = 0; v < _h; v++) {
                
                var pSrcLine = pSourcePixels.subarray(v * _w * 4, (v + 1) * _w * 4);        
                var pDestLine = pPixels.subarray((_h - 1 - v) * _w * 4, (_h - v) * _w * 4);
	            pDestLine.set(pSrcLine);
            }
            if (_removeback) {
    	        RemoveBackground(new Int32Array(pixelData), _w, _h);
            } 
        }
        else {
            pPixels = pSourcePixels;
        }
               

        // Get the power of 2 size for the texture creation
        var w = GetPOW2Alignment(_w);
        var h = GetPOW2Alignment(_h);
        
        // Store the current texture before rebinding the texture unit
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
        
        // Generate the texture
        /*var glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);*/    	    

        // Set the data for the image that's being associated with the texture
        var ret = new yyGLTexture(undefined/*glTexture*/, w, h, (w == _w) && (h == _h), pPixels);        
        _image.width = w;
	    _image.height = h;
	    
	    // Re-instate the texture found prior to operation
        gl.bindTexture(gl.TEXTURE_2D, storedTexture);
        
        // Clear the command builder state
        m_CommandBuilder.Reset();        
        return ret;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Creates a texture from the supplied frame buffer and coordinates
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateTextureFromFramebuffer = function (_image, _frameBuffer, _x, _y, _w, _h, _removeback, _smooth) {

        // Execute current list to ensure what we grab is actually what should've been drawn now
	    this.FlushAll();
	    
	    // Store off the framebuffer in play before we rebind it
	    var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        
	    // Now set the surface, read the pixels, and change it back.
	    var pixelData = new ArrayBuffer(_w * _h * 4);
	    var pPixels = new Uint8Array(pixelData);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, _frameBuffer);			    
	    gl.readPixels(_x, _y, _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);		
	    
	    // Restore the frame buffer stored
	    gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);
		
	    if (_removeback) {
	        RemoveBackground(new Int32Array(pixelData), _w, _h);
	    }
				
	    // Get the power of 2 size for the texture creation
        var w = GetPOW2Alignment(_w);
        var h = GetPOW2Alignment(_h);
        
        // Store the current texture before rebinding the texture unit
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
		
	    // Generate the texture        
        /*var glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);*/
        
        // Set the data for the image that's being associated with the texture
        var newpixelData = new ArrayBuffer(w * h * 4);
        var pNewPixels = new Uint8Array(newpixelData);
        var y;
        var pos = 0;
        var srcpos = 0;
        for (y = 0; y < _h; y++)
        {            
            var x;
            // Start of line
            for(x = 0; x < _w; x++)
            {
                pNewPixels[pos++] = pPixels[srcpos++];
                pNewPixels[pos++] = pPixels[srcpos++];
                pNewPixels[pos++] = pPixels[srcpos++];
                pNewPixels[pos++] = pPixels[srcpos++];
            }

            // Blank bit at end of line
            for(; x < w; x++)
            {
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
            }
        }

        // Blank bottom part of the image
        for (; y < h; y++)
        {
            var x;
            for (x = 0; x < w; x++)
            {
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
                pNewPixels[pos++] = 0;
            }
        }
        var ret = new yyGLTexture(undefined/*glTexture*/, w, h, (w == _w) && (h == _h), pNewPixels);
        _image.width = w;
        _image.height = h;
        
        // Re-instate the texture found prior to operation
        gl.bindTexture(gl.TEXTURE_2D, storedTexture);
        
        this.FlushAll();
        // Clear the command builder state
        m_CommandBuilder.Reset(); 
        return ret;
    };    
    
    // #############################################################################################
    /// Function:<summary>
    ///             Builds an OpenGL texture from the raw data presented as uint8 rgba quartets
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateTextureFromDataRGBA = function(_image, _data, _w, _h) {        
	    
	    // Get the power of 2 size for the texture creation
	    var w = GetPOW2Alignment(_w);
	    var h = GetPOW2Alignment(_h);
	    
	    // Store the current texture before rebinding the texture unit
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
	    
	    // Generate the texture           
        /*var glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, _data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);*/
        
        // Set the data for the image that's being associated with the texture             
        var ret = new yyGLTexture(undefined/*glTexture*/, w, h, (w == _w) && (h == _h), _data);        
        _image.width = w;
        _image.height = h;
        
        // Re-instate the texture found prior to operation
        gl.bindTexture(gl.TEXTURE_2D, storedTexture); 

	    // Clear the command builder state
	    m_CommandBuilder.Reset();	    	    
        return ret;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Builds an OpenGL texture from the raw data presented as uint32s
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateTextureFromData = function(_image, _data, _w, _h) {
    
        var pixelData = new ArrayBuffer(_w * _h * 4);	
	    var dataView = new DataView(pixelData);
	    for (var n = 0; n < _w * _h; n++) {
	        dataView.setUint32(n * 4, ~~_data[n], true);
	    }
	    return this.CreateTextureFromDataRGBA(_image, new Uint8Array(pixelData), _w, _h);
    };
    
    
    // #############################################################################################
    /// Function:<summary>
    ///             Replaces the alpha of a pre-existing bound texture
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.ReplaceTextureAlpha = function (_texture, _alpha) {
    
        yyGL.REQUIRE(_texture instanceof yyGLTexture, "Texture is not a yyGLTexture", yyGL.ERRORLEVEL_Development);
    
        if (!WebGL_IsTextureValid(_texture, yyGL.MipEnable_DontCare))
        {
            WebGL_FlushTexture(_texture);
            WebGL_RecreateTexture(_texture);
        }

        var glTexture = _texture.Texture;
        var w = _texture.Width;
        var h = _texture.Height;        
        
        // Grab the framebuffer left in use after the command builder execution
        var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    
        // Create a framebuffer backed by the texture
        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glTexture, 0);

        // Read the contents of the framebuffer (data stores the pixel data)                
        var pPixels = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);
        
        // Re-instate the original framebuffer and kill the one we're now done with
        gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);        
        gl.deleteFramebuffer(framebuffer);
        
        // Add the alpha values to the data
        for (var i = 0; i < (w * h); i++) {
        
            pPixels[(i * 4) + 3] = _alpha[i];
        }
        
        // Generate the replacement texture
        var w2 = GetPOW2Alignment(w);
	    var h2 = GetPOW2Alignment(h);
	    
	    // Store the current texture before rebinding the texture unit
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        /*var newTexture = gl.createTexture();                
        gl.bindTexture(gl.TEXTURE_2D, newTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w2, h2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);    
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);*/
        
        // Wrap the new GL texture with the information we need to store
        var ret = new yyGLTexture(undefined/*newTexture*/, w2, h2, (w2 == w) && (h2 == h), pPixels);
        
        // Remove the old glTexture in the process
        gl.deleteTexture(_texture.Texture);
        
        // Re-instate the texture found prior to operation
        gl.bindTexture(gl.TEXTURE_2D, storedTexture);

        return ret;
    };

    /** @this {yyWebGL} */
    this.ReadPixels = function(_x, _y, _w, _h, _format) { 
        
        var pPixels = null;

        // Get format info
        var texFormatData = this.ConvertTexFormat(_format);

        // See texImage2D section in https://registry.khronos.org/webgl/specs/2.0.0/
        // for details of which array types are valid for which formats
        switch(_format)
        {
            case eTextureFormat_A8R8G8B8: pPixels = new Uint8Array( _w*_h*4 ); break;
            case eTextureFormat_A4R4G4B4: pPixels = new Uint16Array( _w*_h); break;
            case eTextureFormat_Float16: pPixels = new Uint16Array( _w*_h); break;
            case eTextureFormat_Float32: pPixels = new Float32Array( _w*_h); break;
            case eTextureFormat_R8: pPixels = new Uint8Array( _w*_h); break;
            case eTextureFormat_R8G8: pPixels = new Uint8Array( _w*_h*2); break;
            case eTextureFormat_R16G16B16A16_Float: pPixels = new Uint16Array( _w*_h*4); break;
            case eTextureFormat_R32G32B32A32_Float: pPixels = new Float32Array( _w*_h*4); break;
            default: return null;   // unhandled format            
        }

        gl.readPixels(_x, _y, _w, _h, texFormatData.format, texFormatData.type, pPixels);

        return pPixels;
    };

    function half_to_float(_uint16val) {

        // See https://en.wikipedia.org/wiki/Half-precision_floating-point_format for details
        
        var ret = 0.0;
        var exponent = (_uint16val & 0x7C00) >> 10;
        var fraction = _uint16val & 0x03FF;
        var sign = 1.0;
        if ((_uint16val >> 15) != 0)
        {
            sign = -1.0;
        }
        if (exponent != 0)
        {
            if (exponent === 0x1f)
            {
                if (fraction != 0)
                    ret = NaN;
                else
                    ret = Infinity;
            }
            else
            {
                ret = sign * (Math.pow(2, exponent - 15) * (1 + (fraction / 0x400)));
            }
        }
        else
        {
            ret = sign * (0.00006103515625 * (fraction / 0x400));           // 0.00006103515625 is the minimum exponent value (2 to the power -14)
        }

        return ret;
    }

    /** @this {yyWebGL} */
    this.ConvertSurfColToRValue = function(_pBuffer, _format) { 
        
        var ret = 0;

        if (_pBuffer == null)
            return 0;

        // The expectation is that _pBuffer is in the correct format for the particular sort of data
        // we're wanting to unpack (i.e. eTextureFormat_A8R8G8B8 will expect a Uint8Array, while
        // eTextureFormat_A4R4G4B4 will expect a Uint16Array )
        switch(_format)
        {
            case eTextureFormat_A8R8G8B8:
                {                    
                    ret = (_pBuffer[0]) | (_pBuffer[1] << 8) | (_pBuffer[2] << 16) | (_pBuffer[3] << 24);
                } break;
            case eTextureFormat_A4R4G4B4:
                {
                    var r,g,b,a;
                    var col16 = _pBuffer[0];

                    r = (((col16 & 0xf000) >> 12) / 15.0) * 255.0; 
                    g = (((col16 & 0xf00) >> 8) / 15.0) * 255.0; 
                    b = (((col16 & 0xf0) >> 4) / 15.0) * 255.0; 
                    a = ((col16 & 0xf) / 15.0) * 255.0;                     
            
                    r = yymin(r, 255); 
                    g = yymin(g, 255); 
                    b = yymin(b, 255); 
                    a = yymin(a, 255); 
                                
                    ret = r | (g << 8) | (b << 16) | (a << 24); 
                } break;                
            case eTextureFormat_Float16:
                {
                    var r = half_to_float(_pBuffer[0]);                    

                    ret = new Array(r, 0.0, 0.0, 0.0);
                } break;
            case eTextureFormat_Float32:
                {
                    var r = _pBuffer[0];

                    ret = new Array(r, 0.0, 0.0, 0.0)  ;
                } break;
            case eTextureFormat_R8:
                {
                    ret = _pBuffer[0];
                } break;
            case eTextureFormat_R8G8:
                {                    
                    ret = (_pBuffer[0]) | (_pBuffer[1] << 8);
                } break;
            case eTextureFormat_R16G16B16A16_Float:
                {
                    var r,g,b,a;

                    r = half_to_float(_pBuffer[0]);
                    g = half_to_float(_pBuffer[1]);
                    b = half_to_float(_pBuffer[2]);
                    a = half_to_float(_pBuffer[3]);

                    ret = new Array(r, g, b, a);
                } break;
            case eTextureFormat_R32G32B32A32_Float:
                {
                    var r,g,b,a;

                    r = _pBuffer[0];
                    g = _pBuffer[1];
                    b = _pBuffer[2];
                    a = _pBuffer[3];

                    ret = new Array(r, g, b, a);
                } break;
        }

        return ret;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Extracts a pixel from the current target
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.GetPixel = function(_x, _y, _format) {    
    
        // Execute current list to ensure what we grab is actually what should've been drawn now
        //this.Flush();    
        this.FlushAll();    

        // Now read the pixel
        //var pPixels = new Uint8Array(16);
        //gl.readPixels(_x, m_deviceHeight-_y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);        
        //var col = (pPixels[0]) + (pPixels[1] << 8) + (pPixels[2] << 16) + (pPixels[3] * 0x01000000);
        var pPixels = this.ReadPixels(_x, m_deviceHeight-_y, 1, 1, _format);
        var col = this.ConvertSurfColToRValue(pPixels, _format);

        // Clear the command builder state
        m_CommandBuilder.Reset();
        return col;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.GetPixelFromFramebuffer = function ( _frameBuffer, _x, _y, _format )
    {
        // Execute current list to ensure what we grab is actually what should've been drawn now
	    this.FlushAll();
	    
	    // Grab the framebuffer left in use after the command builder execution
        var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

	    // Now set the surface, read the pixel, and change it back.
	    var pPixels = new Uint8Array(16);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, _frameBuffer);
	    //gl.readPixels(_x, _y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);	    
	    //var col = (pPixels[0]) + (pPixels[1] << 8) + (pPixels[2] << 16) + (pPixels[3] * 0x01000000);
        var pPixels = this.ReadPixels(_x, _y, 1, 1, _format);
        var col = this.ConvertSurfColToRValue(pPixels, _format);
	    
	    // Re-bind the original framebuffer
	    gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);	    

	    // Clear the command builder state
	    m_CommandBuilder.Reset();
	    return new Long(col);
    };    
    
    // #############################################################################################
    /// Function:<summary>
    ///             Copy a rectangle of pixels from a suface
    ///          </summary>
    /// In:		<param name="_frameBuffer">Framebuffer to copy from</param>
    /// 		<param name="_x">x coordinate</param>
    /// 		<param name="_y">y coordinate</param>
    /// 		<param name="_w">width in pixels</param>
    /// 		<param name="_h">height in pixels</param>
    /// Out:	<returns>
    ///				A Yint8Array of pixels
    ///			</returns>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.GetRectFromFramebuffer = function (_frameBuffer, _x, _y, _w, _h, _format)
    {

        // Execute current list to ensure what we grab is actually what should've been drawn now
        this.FlushAll();

        // Grab the framebuffer left in use after the command builder execution
        var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        // Now set the surface, read the pixel, and change it back.
        //var pPixels = new Uint8Array( _w*_h*4 );
        gl.bindFramebuffer(gl.FRAMEBUFFER, _frameBuffer);
        //gl.readPixels(_x, _y, _w, _h, gl.RGBA, gl.UNSIGNED_BYTE, pPixels);
        var pPixels = this.ReadPixels(_x, _y, _w, _h, _format);

        // The result of this function is always expected to be a Uint8Array
        if (!(pPixels instanceof Uint8Array))
        {
            var temparray = new Uint8Array(pPixels.buffer);
            pPixels = temparray;
        }
        
        // Re-bind the original framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);

        // Clear the command builder state
        m_CommandBuilder.Reset();
        return pPixels;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.CreateFramebuffer = function(_w, _h, _format) {
    
        // Grab the current state that we're going to alter
        var storedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
        var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);        
        var storedRenderBuffer = gl.getParameter(gl.RENDERBUFFER_BINDING);        
        {
            var rttFramebuffer = gl.createFramebuffer();
            rttFramebuffer.width = _w;
            rttFramebuffer.height = _h;
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);

            //var rttTexture = gl.createTexture();
            //gl.bindTexture(gl.TEXTURE_2D, rttTexture);
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _w, _h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);        
            
            // Create the texture wrapper for the texture whilst it is bound
            //var textureInternal = new yyGLTexture(rttTexture, _w, _h, isPowerOfTwo(_w) && isPowerOfTwo(_h), null); 
            var textureInternal = new yyGLTexture(undefined, _w, _h, isPowerOfTwo(_w) && isPowerOfTwo(_h), null, 0, 0, _format); 
            this.RecreateTexture(textureInternal);
            
            // Create depth/stencil buffer
            var rttRenderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, rttRenderbuffer);            
            //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureInternal.Texture, 0);

            if (g_createsurfacedepthbuffers)
            {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, rttFramebuffer.width, rttFramebuffer.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rttRenderbuffer);
            }
        }        
        gl.bindTexture(gl.TEXTURE_2D, storedTexture);        
        gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, storedRenderBuffer);
        
        var frameBufferData = {
            FrameBuffer: rttFramebuffer, 
            RenderBuffer: rttRenderbuffer, 
            Texture: textureInternal 
        };
        return frameBufferData;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.DeleteFramebuffer = function (_frameBuffer) {

        // Update state manager here
        g_webGL.RSMan.ClearTexture(_frameBuffer.Texture);
        
        gl.deleteFramebuffer(_frameBuffer.FrameBuffer);
        gl.deleteRenderbuffer(_frameBuffer.RenderBuffer);
        gl.deleteTexture(_frameBuffer.Texture.Texture);
        
        // Make sure we ditch the reference to the wrapper to give the GC every chance to clean it up
        _frameBuffer.Texture = null;
    };
    

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.DeleteTexture = function (_textureID) {
        gl.deleteTexture(_textureID); //_frameBuffer.Texture.Texture);
    };


    // #############################################################################################
    /// Function:<summary>
    ///             Sets the yyGLTexture to use when NULL has been specified
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.SetNullTexture = function (_texture) {
    
        yyGL.REQUIRE(_texture instanceof yyGLTexture, "NULL texture is not a yyGLTexture", yyGL.ERRORLEVEL_Development);        
        m_CommandBuilder.NullTexture = _texture;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Provide raw VBuffer access to fill up with vertex data.
    ///             _texture can be null to select the NULL texture provided via SetNullTexture.
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.AllocVerts = function (_prim, _texture, _FVF, _numVerts) {
    
        yyGL.REQUIRE((_texture == null) || (_texture instanceof yyGLTexture), "Texture is not a yyGLTexture", yyGL.ERRORLEVEL_Development);        
        return m_VBufferManager.AllocVerts(_prim, _texture, _FVF, _numVerts, m_vertexFormats[_FVF], m_frameCount);
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Given a hand generated vbuffer, prim and so forth, dispatch this buffer
    ///          </summary>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.DispatchVBuffer = function (_prim, _texture, _vbuffer, _vertexStart) {
    
        yyGL.REQUIRE((_texture == null) || (_texture instanceof yyGLTexture), "Texture is not a yyGLTexture", yyGL.ERRORLEVEL_Development);        
        m_VBufferManager.Dispatch(_prim, _texture, _vbuffer, _vertexStart);
    };


    // #############################################################################################
    /// Function:<summary>
    ///          	Extract pixels from a webGl texture
    ///          </summary>
    ///
    /// In:		<param name="_pTPE">Texture page entry to extract</param>
    /// Out:	<returns>
    ///				Uint8Array of pixels
    ///			</returns>
    // #############################################################################################
    /** @this {yyWebGL} */
    this.ExtractWebGLPixels = function (_pTPE)
    {       
        var texture = _pTPE.texture.webgl_textureid;

        if (!WebGL_IsTextureValid(texture, yyGL.MipEnable_DontCare)) {
            WebGL_FlushTexture(texture);
            WebGL_RecreateTexture(texture);
        }

        var glTexture = texture.Texture;
        var w = texture.Width;
        var h = texture.Height;

        // Grab the framebuffer left in use after the command builder execution
        var storedFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        // Create a framebuffer backed by the texture
        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glTexture, 0);

        // Read the contents of the framebuffer (data stores the pixel data)                
        var data = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);

        // Re-instate the original framebuffer and kill the one we're now done with
        gl.bindFramebuffer(gl.FRAMEBUFFER, storedFrameBuffer);
        gl.deleteFramebuffer(framebuffer);

        return data;
    };

}

