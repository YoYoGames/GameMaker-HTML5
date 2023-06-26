// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyWebGL.js
// Created:	        06/09/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	GameMaker HTML5 "webgl" interface.
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 06/09/2011		V1.0        MJD     1st version... lets get something on screen....
// 
// **********************************************************************************************************************   
var g_webGL = null;
var g_isWebGL2 = false;

var g_savedWebGLState = null;
var g_webGL_textureFont = null;   
var g_set_perspective = true;

// These are globals used for tracking the rendering state of the Runner (GML level)
var GR_3DMode = false,    
    GR_LightingEnabled = false,    
    GR_BlendSrc = yyGL.Blend_SrcAlpha,
    GR_BlendDest = yyGL.Blend_InvSrcAlpha,
    GR_AlphaTestEnabled = 0,
    GR_AlphaTestRefValue = 0.0,
    GR_TextureRepeat = [],
    GR_ColourWriteEnable = { red: true, green: true, blue: true, alpha: true };
    
// These are 3D specific state settings
var GR_Depth = 0.0,
    GR_ZEnable = true,
    GR_ZWriteEnable = true,
    GR_Cull = true,
    GR_CullOrder = yyGL.Cull_Clockwise;
        
var GR_DirectionalLights = null,
    GR_PointLights = null,
    GR_LightColours = null,
    GR_AmbientLight = null,
    GR_FogParameters = null,
    GR_LightType =[],
    GR_LightEnabled = [];


var LIGHT_TYPE_DIR = 0;
var LIGHT_TYPE_POINT =1;



var GR_MarkVertCorners = false,
    GR_SWFAAEnabled = false,
    GR_SWFAAScale = 1.0;
    
    
// Store the set of shader programs created from the user's project
var g_shaderPrograms = [];

var g_Matrix = null,
	g_MatrixStack = null,
	g_MatrixSP = 0;

// Constants for matrix stack
var MATRIX_VIEW = 0,
	MATRIX_PROJECTION = 1,
    MATRIX_WORLD = 2,
    MATRIX_STACK_MAX = 16;
    

// The size we want vertex buffers to be by default
var DEFAULT_VB_SIZE = 16384;

// Circle drawing
var g_circleSteps = 36,
    g_circleCos = [],
    g_circleSin = [];

var offsethackGL = 0.5;

var g_extAnisotropic = null;
var g_extTextureHalfFloat = null;
var g_extTextureHalfFloatLinear = null;
var g_extColourBufferHalfFloat = null;
var g_extTextureFloat = null;
var g_extTextureFloatLinear = null;
var g_extColourBufferFloat = null;
var g_extStandardDerivatives = null;

var g_SupportHalfFloatSurfs = false;
var g_SupportFloatSurfs = false;
var g_SupportSubFourChannelHalfFloatSurfs = false;	
var g_SupportSubFourChannelFloatSurfs = false;
var g_SupportSubFourChannelIntSurfs = false;
var g_HalfFloatSurfsUseSizedFormats = false;		
var g_FloatSurfsUseSizedFormats = false;
var g_IntSurfsUseSizedFormats = false;

var g_SupportGLSLDerivatives = false;
var g_AppendDerivativesExtToShader = false;

// #############################################################################################
/// Function:<summary>
///             Initialise the rendering function pointers.
///          </summary>
// #############################################################################################
function InitWebGLFunctions() {

    InitD3DFunctions();
    InitFVFFunctions();
    InitBufferVertexFunctions();
    InitPrimBuilderFunctions();
    
    DrawCirclePrecision(g_circleSteps);
    
    // Re-bind colour conversions for webgl
    ConvertGMColour = WebGL_ConvertGMColour_RELEASE;    

    // Fill in RELEASE function pointers.
    Graphics_SetViewArea = WebGL_SetViewArea_RELEASE;
    Graphics_SetViewPort = WebGL_SetViewPort_RELEASE;
    Graphics_SetTransform = WebGL_SetTransform_RELEASE;
	Graphics_SetViewAreaTransform = WebGL_SetViewAreaTransform_RELEASE;
    Graphics_ClearScreen = WebGL_ClearScreen_RELEASE;
    Graphics_PushTransform = WebGL_PushTransform_RELEASE;
    Graphics_PushMatrix = WebGL_PushMatrix_RELEASE;
    Graphics_Save = WebGL_Save_RELEASE;
    Graphics_Restore = WebGL_Restore_RELEASE;
    Graphics_DrawText = WebGL_DrawText_RELEASE;
    Graphics_StartFrame = WebGL_StartFrame_RELEASE;
    Graphics_EndFrame = WebGL_EndFrame_RELEASE;
    Graphics_DrawComment = WEBGL_DrawComment_RELEASE;    
    Graphics_UpdateTexture = WebGL_UpdateTexture_RELEASE;

    // Draw functions
    Graphics_TextureDrawSimple = WebGL_TextureDrawSimple_RELEASE;
    Graphics_TextureDrawTiled = WebGL_TextureDrawTiled_RELEASE;
    Graphics_TextureDraw = WebGL_TextureDraw_RELEASE;
    Graphics_TextureDrawPos = WebGL_TextureDrawPos_RELEASE;
    Graphics_SWFDraw = WebGL_DrawSWF_RELEASE;
    Graphics_SWFDrawObject = WebGL_DrawSWFObject_RELEASE;
    Graphics_DrawPart = WebGL_DrawPart_RELEASE;                
    draw_rectangle = WebGL_draw_rectangle_RELEASE;
    draw_roundrect_color_ext = WebGL_draw_roundrect_color_EXT_RELEASE;
    draw_rectangle_color = WebGL_draw_rectangle_color_RELEASE;
    draw_roundrect_colour_ext = WebGL_draw_roundrect_color_EXT_RELEASE;
    draw_rectangle_colour = WebGL_draw_rectangle_color_RELEASE;
    draw_rectangle_gradient = WebGL_draw_rectangle_gradient_RELEASE;
    draw_point = WebGL_draw_point_RELEASE;
    draw_getpixel = WebGL_draw_getpixel_RELEASE;
    draw_getpixel_ext = WebGL_draw_getpixel_ext_RELEASE;
    draw_triangle = WebGL_draw_triangle_RELEASE;
    draw_triangle_color = WebGL_draw_triangle_color_RELEASE;
    draw_ellipse_color = WebGL_draw_ellipse_color_RELEASE;
    draw_circle_color = WebGL_draw_circle_color_RELEASE;
    draw_point_color = WebGL_draw_point_color_RELEASE;
    draw_triangle_colour = WebGL_draw_triangle_color_RELEASE;
    draw_ellipse_colour = WebGL_draw_ellipse_color_RELEASE;
    draw_circle_colour = WebGL_draw_circle_color_RELEASE;
    draw_point_colour = WebGL_draw_point_color_RELEASE;
    draw_line = WebGL_draw_line_RELEASE;
    draw_line_width =  WebGL_draw_line_width_RELEASE;
    draw_line_width_color = WebGL_draw_line_width_color_RELEASE;
    draw_line_width_colour = WebGL_draw_line_width_color_RELEASE;
    draw_clear_alpha = WebGL_draw_clear_alpha_RELEASE;
    draw_set_color = WebGL_draw_set_color_RELEASE;
    draw_set_colour = WebGL_draw_set_color_RELEASE;
    draw_set_alpha = WebGL_draw_set_alpha_RELEASE;
    draw_set_blend_mode_ext = WEBGL_draw_set_blend_mode_ext_RELEASE;
    draw_enable_alphablend = WEBGL_draw_enable_alpha_blend_RELEASE;
    draw_surface = WebGL_draw_surface_RELEASE;    
    draw_path = WEBGL_draw_path;
    mp_grid_draw = WEBGL_mp_grid_draw;
    g_webGL._drawImage = WebGL_drawImage_Replacement_RELEASE;

    // Surfaces
    surface_create = WebGL_surface_create_RELEASE;
    surface_free = WebGL_surface_free_RELEASE;
    surface_getpixel = WebGL_surface_getpixel_RELEASE;
    surface_getpixel_ext = WebGL_surface_getpixel_ext_RELEASE;    
    surface_copy = WebGL_surface_copy_RELEASE;
    surface_copy_part = WebGL_surface_copy_part_RELEASE;
	
    // Backgrounds		
    background_create_from_screen = WebGL_background_create_from_screen_RELEASE;
    background_create_from_surface = WebGL_background_create_from_surface_RELEASE;

    // Sprites
    sprite_add_from_screen = WebGL_sprite_add_from_screen_RELEASE;
    sprite_create_from_surface = WebGL_sprite_create_from_surface_RELEASE;
    sprite_add_from_surface = WebGL_sprite_add_from_surface_RELEASE;

    CopyImageToAlpha = WEBGL_CopyImageToAlpha_RELEASE;
	
    // Shaders		
    fn_texture_get_texel_width = WebGL_texture_get_texel_width_RELEASE;
    fn_texture_get_texel_height = WebGL_texture_get_texel_height_RELEASE;    
    fn_texture_set_stage = WebGL_texture_set_stage_RELEASE;
    fn_shader_is_compiled = WebGL_shader_is_compiled_RELEASE;
    fn_shader_set = WebGL_shader_set_RELEASE;
    fn_shader_get_uniform = WebGL_shader_get_uniform_RELEASE;
    fn_shader_set_uniform_i = WebGL_shader_set_uniform_i_RELEASE;
    fn_shader_set_uniform_f = WebGL_shader_set_uniform_f_RELEASE;    
    fn_shader_set_uniform_matrix = WebGL_shader_set_uniform_matrix_RELEASE;    
    fn_shader_get_sampler_index = WebGL_shader_get_sampler_index_RELEASE; 
    fn_shader_enable_corner_id = WebGL_shader_enable_corner_id_RELEASE;	
    fn_shader_set_uniform_i_array = WebGL_shader_set_uniform_i_array_RELEASE;
    fn_shader_set_uniform_f_array = WebGL_shader_set_uniform_f_array_RELEASE;
    fn_shader_set_uniform_f_buffer = WebGL_shader_set_uniform_f_buffer_RELEASE;
    fn_shader_set_uniform_matrix_array = WebGL_shader_set_uniform_matrix_array_RELEASE;    
    shaders_are_supported = WebGL_shaders_are_supported_RELEASE;
    fn_shader_get_name = WebGL_shader_get_name_RELEASE;
    
    // textures
    texture_set_blending = WebGL_texture_set_blending_RELEASE;
    texture_set_repeat = WebGL_texture_set_repeat_RELEASE;
    texture_set_repeat_ext = WebGL_texture_set_repeat_ext_RELEASE;
    texture_set_interpolation = WebGL_texture_set_interpolation_RELEASE;
    texture_set_interpolation_ext = WebGL_texture_set_interpolation_ext_RELEASE;
    texture_get_repeat = WebGL_texture_get_repeat_RELEASE;    
    texture_get_width = WebGL_texture_get_width_RELEASE;
    texture_get_height = WebGL_texture_get_height_RELEASE;
    texture_get_uvs = WebGL_texture_get_uvs_RELEASE;

    // alpha test    
    draw_set_alpha_test = WebGL_draw_set_alpha_test_RELEASE;
    draw_set_alpha_test_ref_value = WebGL_draw_set_alpha_test_ref_value_RELEASE;
    draw_get_alpha_test = WebGL_draw_get_alpha_test_RELEASE;
    draw_get_alpha_test_ref_value = WebGL_draw_get_alpha_test_ref_value_RELEASE;

    // Buffer surface stuff
    buffer_get_surface = WEBGL_buffer_get_surface;
    buffer_set_surface = WEBGL_buffer_set_surface;
    // 
    PostInitWebGLFunctions();	    	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function InitWebGL(_canvas) {

    var options = {
        Stencil: ((g_pGMFile.Swfs !== undefined) ? true : false),
        PreserveDrawingBuffer: (g_pGMFile.Options.WebGLPreserveDrawingBuffer ? true : false),
        InterpolatePixels: g_InterpolatePixels
    };
    	
    g_webGL = new yyWebGL(_canvas, options);
    if (!g_webGL.Valid) {
        g_webGL = null;
        return false;
    }
    
    if (!InitShaders()) return false;
    if (!InitTextures()) return false;	
    if (!InitLightingEnv()) return false;
   
    g_MatrixStack = [];
    for (var i = 0; i < MATRIX_STACK_MAX; i++) {
        g_MatrixStack[i] = new Matrix();
    }
    g_MatrixSP = -1;
    
    g_RenderTargetActive = 1;
    g_pProjection = new Matrix();
    g_pView = new Matrix();
    
    var stages = g_webGL.GetMaxTextureStages();
    for (var i = 0; i < stages; i++) {
        GR_TextureRepeat[i] = false;
    }
    return true;
}

// #############################################################################################
/// Function:<summary>
///				Private: Set the number of triangles to use for drawing circles and ellipses
///				numb must lie between 4 and 64 and be divisable by 4
///          </summary>
// #############################################################################################
function DrawCirclePrecision(_numb) {

    var n = _numb;

    if (n < 4) n = 4;
    if (n > 64) n = 64;
    n = 4 * ((n / 4) | 0);
    g_circleSteps = n;
    
    // Be absolute about the start and end of the lookup table
    g_circleCos[0] = 1;
    g_circleSin[0] = 0;	
    for (var i = 1; i < n; i++)
    {
        g_circleCos[i] = Math.cos(i*2*Math.PI/n);
        g_circleSin[i] = Math.sin(i*2*Math.PI/n);
    }
    g_circleCos[n] = 1;
    g_circleSin[n] = 0;

} 
// #############################################################################################
/// Function:<summary>
///             Get current circle precision
///          </summary>
// #############################################################################################
function DrawGetCirclePrecision()
{
    return g_circleSteps;
}


// #############################################################################################
/// Function:<summary>
///             Do operations that require the WebGL routines to be previously bound
///          </summary>
// #############################################################################################
function PostInitWebGLFunctions() {

    // Set default shader environment settings
    d3d_set_fog(0, 0xff000000, 0, 0);
    draw_set_alpha_test(0);
    draw_get_alpha_test_ref_value(0);
    
    InitWebGLTextureGetFunctions();        
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function InitShaders()
{    
    return SetupProprietaryShaders();    
} 

// #############################################################################################
/// Function:<summary>
///          	Create any textures we need (like FLAT)
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function InitTextures() {

    var pFlat = document.createElement(g_CanvasName);
    pFlat.m_Width = pFlat.width = 16;
    pFlat.m_Height = pFlat.height = 16;
    pFlat.complete = true;
    pFlat.canvas_element = false;
    pFlat.name = "";
    pFlat.graphics = pFlat.getContext('2d');

    pFlat.graphics.save();
    pFlat.graphics.setTransform(1, 0, 0, 1, 0, 0);
    pFlat.graphics.globalAlpha = 1;
    pFlat.graphics.fillStyle = '#ffffff';
    pFlat.graphics.fillRect(0, 0, 16, 16);
    pFlat.graphics.restore();

    // Create a texture page entry.
    var pTPE = new yyTPageEntry();
    pTPE.x = 0;
    pTPE.y = 0;
    pTPE.w = 15;
    pTPE.h = 15;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = 15;
    pTPE.CropHeight = 15;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;
    pTPE.tp = -1;
    pTPE.texture = pFlat; 						// get raw texture page
    pTPE.cache = []; 							// clear colour cache
    pTPE.maxcache = 1;
    pTPE.count = 0;

    WebGL_BindTexture(pTPE);
    g_webGL.SetNullTexture(pTPE.texture.webgl_textureid);    
    return true;
}


// #############################################################################################
/// Function:<summary>
///             Block out the lighting data with default values
///          </summary>
// #############################################################################################
function InitLightingEnv() {
        
    GR_DirectionalLights = new Float32Array(yyGL.MAX_LIGHTS * 4);
    GR_PointLights = new Float32Array(yyGL.MAX_LIGHTS * 4);
    GR_LightColours = new Float32Array(yyGL.MAX_LIGHTS * 4);    
    GR_AmbientLight = new Float32Array(4);
    GR_AmbientLight[0] = 1;
    GR_AmbientLight[1] = 1;
    GR_AmbientLight[2] = 1;
    GR_AmbientLight[3] = 1;    


    var baseIndex;
    for (var i = 0; i < yyGL.MAX_LIGHTS; i++) 
    {                
        GR_LightColours[i] = 0;
        
        baseIndex = i * 4;
        GR_DirectionalLights[baseIndex + 0] = 0;
        GR_DirectionalLights[baseIndex + 1] = 0;
        GR_DirectionalLights[baseIndex + 2] = 0;
        GR_DirectionalLights[baseIndex + 3] = 0;
                
        GR_PointLights[baseIndex + 0] = 0;
        GR_PointLights[baseIndex + 1] = 0;
        GR_PointLights[baseIndex + 2] = 0;
        GR_PointLights[baseIndex + 3] = 0;
        
        GR_LightEnabled[i] = false;
    }
    return true;
}

// #############################################################################################
/// Function:<summary>
///             To compensate for textures not being bound, the necessity to get at TPEs for
///             textures and whatnot, here's some diversion routines
///          </summary>
// #############################################################################################
function InitWebGLTextureGetFunctions() {

    // This is a bit hacky to allow us to fix an issue with shaders circumventing the normal drawing route(s)
    var fn_sprite_get_texture = sprite_get_texture;
    sprite_get_texture = function(_spriteIndex, _textureIndex) {
    
        var texture = fn_sprite_get_texture(_spriteIndex, _textureIndex);
        // violating law of Demeter on the texture (reaching through to retrieve webgl_textureid)...
        if (texture && !texture.WebGLTexture.webgl_textureid) {
            WebGL_BindTexture(texture.TPE);
        }
        return texture;
    };    

    // And again for background textures    
    var fn_background_get_texture = background_get_texture;
    background_get_texture = function(_ind) {
    
        var texture = fn_background_get_texture(_ind);
        // violating law of Demeter on the texture (reaching through to retrieve webgl_textureid)...
        if (texture && !texture.WebGLTexture.webgl_textureid) {
            WebGL_BindTexture(texture.TPE);
        }
        return texture;
    };
    WebGL_StartFrame_RELEASE();// Call this to setup defaults..
}

// #############################################################################################
/// Function:<summary>
///          	START of a new frame
///          </summary>
// #############################################################################################
function WebGL_StartFrame_RELEASE() {

    g_webGL.StartFrame();    
    g_webGL.SetShader(WebGL_GetDefaultShader());
    
    // To ensure that at the start of a frame of rendering any lighting/fog/etc
    // settings that didn't make it through to WebGL because they were set outwith
    // the Draw event, or for some other reason didn't get processed from the command
    // chain, we have to ensure the correct settings are in use once we kick off
    // drawing.    
    g_webGL.SetAlphaTest(GR_AlphaTestEnabled, GR_AlphaTestRefValue);        
    g_webGL.SetFogData(GR_FogParameters);     
    g_webGL.SetAmbientLighting(GR_AmbientLight);
    g_webGL.SetColorWriteEnable(GR_ColourWriteEnable.red, GR_ColourWriteEnable.green, GR_ColourWriteEnable.blue, GR_ColourWriteEnable.alpha);
        
    for (var i = 0; i < yyGL.MAX_LIGHTS; i++) {
    
        g_webGL.SetLight(i, 
            GR_PointLights.subarray(i*4, (i+1)*4),
            GR_DirectionalLights.subarray(i*4, (i+1)*4),
            GR_LightColours.subarray(i*4, (i+1)*4));
    }
    
    // TODO: And the rest...
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_EndFrame_RELEASE() {

    g_webGL.EndFrame();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_Save_RELEASE(_storeSettings) {    
    
    if (_storeSettings) {
    
        g_savedWebGLState = {};
        if (_storeSettings.Store3D) {

            g_savedWebGLState.GR_3DMode = GR_3DMode;
            g_savedWebGLState.GR_LightingEnabled = GR_LightingEnabled;
            g_savedWebGLState.GR_FogParameters = new Float32Array(GR_FogParameters);
            
            if(g_isZeus)
            {
                g_savedWebGLState.GR_Cull=gpu_get_cullmode();
                g_savedWebGLState.GR_ZEnable=gpu_get_ztestenable();
                g_savedWebGLState.GR_ZWriteEnable=gpu_get_zwriteenable();
            }
            
            // Set to defaults
            GR_3DMode = false;
            GR_LightingEnabled = false;
            
            d3d_set_fog(0, 0xff000000, 0, 0);

            // Setting any of these will flush the vertex buffer so don't worry.
            g_webGL.SetZEnable(false);
            g_webGL.SetCull(false);
            g_webGL.SetZWriteEnable(false);
            g_webGL.SetShader(WebGL_GetDefaultShader());
        }
        if (_storeSettings.StoreState) {
        
            g_savedWebGLState.SrcBlendMode = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);   //GR_BlendSrc;
            g_savedWebGLState.DestBlendMode = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend); //GR_BlendDest;
            g_webGL.SetBlendMode(yyGL.Blend_One, yyGL.Blend_Zero);		    
        }
    }
}

// #############################################################################################
/// Function:<summary> Urgh
///          </summary> this is horrid
// #############################################################################################
function WebGL_Restore_RELEASE(_restoreSettings) {

    if (g_savedWebGLState && _restoreSettings) {
    
        if (_restoreSettings.Restore3D) {
        
            GR_3DMode = g_savedWebGLState.GR_3DMode;
            GR_LightingEnabled = g_savedWebGLState.GR_LightingEnabled;
            GR_FogParameters = new Float32Array(g_savedWebGLState.GR_FogParameters);
            g_webGL.SetFogData(GR_FogParameters);

            // Setting either of these will flush the vertex buffer
            if (GR_3DMode || g_isZeus) {
              
                
                if(g_isZeus)
                {
                    g_webGL.SetCull(g_savedWebGLState.GR_Cull);
                    g_webGL.SetZEnable(g_savedWebGLState.GR_ZEnable);
                    g_webGL.SetZWriteEnable(g_savedWebGLState.GR_ZWriteEnable);
                }
                else
                {
                    g_webGL.SetZEnable(GR_ZEnable);
                    g_webGL.SetZWriteEnable(GR_ZWriteEnable);
                    g_webGL.SetCull(GR_Cull);    
                }
            }
            g_webGL.SetShader(WebGL_GetDefaultShader());               
        }
        if (_restoreSettings.RestoreState) {
                    
            g_webGL.SetBlendMode(g_savedWebGLState.SrcBlendMode, g_savedWebGLState.DestBlendMode);	
        }
        
        g_savedWebGLState = null;
    }
}

// #############################################################################################
/// Function:<summary>
///             Gets the shader used for normal operations depending on the global (yuck) state
///          </summary>
// #############################################################################################
function WebGL_GetDefaultShader() {

    var shaderProgram = undefined;
    if (GR_LightingEnabled) {
        shaderProgram = g_webGL.Shader_3D;
    }
    else {
        shaderProgram = g_webGL.Shader_2D;
    }
    return shaderProgram;
}

function WebGL_SetViewAreaTransform_RELEASE( _sx, _sy, _tx, _ty )
{
    var dw = DISPLAY_WIDTH;
    var dh = DISPLAY_HEIGHT;
    g_pView.unit();
    var w = DISPLAY_WIDTH/_sx;
    var h = DISPLAY_HEIGHT/_sy;
    //g_pView.SetTranslation(-w/2 + _tx/_sx, -h/2 + _ty/_sy, 16000);
    g_pView.SetTranslation( (dw*-0.5 + _tx)/_sx, (dh*-0.5 + _ty)/_sy, 16000);
    
	g_pProjection.OrthoLH( w, -h *g_RenderTargetActive,1.0,32000.0);
    
    WebGL_SetMatrix(MATRIX_VIEW, g_pView);
	WebGL_SetMatrix(MATRIX_PROJECTION, g_pProjection);
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_SetViewArea_RELEASE(_worldx, _worldy, _worldw, _worldh, _angle)
{
    if (!GR_3DMode) {
        // Build the orthographic projection (generates g_pProjection and g_pView???)
        GR_D3D_Set_View_Area(_worldx, _worldy, _worldw, _worldh, _angle);
    }
    else {
        // Build default matrices
        var angle = -_angle * (Math.PI / 180.0);
        var V1 = new Vector3((_worldx + _worldw / 2.0), (_worldy + _worldh / 2.0), -_worldw);
        var V2 = new Vector3((_worldx + _worldw / 2.0), (_worldy + _worldh / 2.0), 0.0);
        var V3 = new Vector3(Math.sin(angle), Math.cos(angle), 0.0);

        g_pView.LookAtLH(V1, V2, V3);

        if (false == g_set_perspective) {
            g_pProjection.OrthoLH(_worldw, -_worldh * g_RenderTargetActive, 1.0, 32000.0);
        }
        else {
            g_pProjection.PerspectiveLH(1.0, _worldh / _worldw, 1.0, 32000.0);
        }
        g_pProjection.m[_22] *= g_RenderTargetActive;
    }

    WebGL_SetMatrix(MATRIX_VIEW, g_pView);
    WebGL_SetMatrix(MATRIX_PROJECTION, g_pProjection);
    WebGL_SetMatrix(MATRIX_WORLD, g_Matrix[MATRIX_WORLD]);

    g_worldx = _worldx;
    g_worldy = _worldy;
    g_worldw = _worldw;
    g_worldh = _worldh;
}


// #############################################################################################
/// Function:<summary>
///          	This specifies the CLIP region, and is in screen pixels.
///          </summary>
///
/// In:		<param name="_portx"></param>
///			<param name="_porty"></param>
///			<param name="_portw"></param>
///			<param name="_porth"></param>
///				
// #############################################################################################
function WebGL_SetViewPort_RELEASE(_portx, _porty, _portw, _porth) {

    g_clipx = _portx;
    g_clipy = _porty;
    g_clipw = _portw;
    g_cliph = _porth;
	    
    var yy = _porty;//window_get_height() - (_porth + _porty );
    if (g_RenderTargetActive == 1)
    {
        yy = window_get_height() - (_porth + _porty );
    }
    g_webGL.SetViewPort(_portx,yy,_portw,_porth);
    g_webGL.Flush(); 
}

// #############################################################################################
/// Function:<summary>
///				Clear the region in the indicated color
///          </summary>
///
/// In:		 <param name="col">Colour to clear the screen with</param>
// #############################################################################################
function WebGL_ClearScreen_RELEASE(_col) {
    // Must flush as some clears are now done with quads, so have to preserve order
    g_webGL.Flush();
    g_webGL.ClearScreen(true, true, true, ConvertGMColour(_col)|0xff000000);
}

// #############################################################################################
/// Function:<summary>
///          	Clears the entire room in the given color and alpha value 
///             (in particular useful for surfaces).
///          </summary>
///
/// In:		<param name="_col"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_clear_alpha_RELEASE(_col, _alpha) {
    // Must flush as some clears are now done with quads, so have to preserve order
    g_webGL.Flush();
    _alpha = yyGetReal(_alpha);
    if (_alpha > 1)  _alpha = 1;
    if (_alpha < 0)  _alpha = 0;
    var col = ((_alpha * 255.0) << 24) | ConvertGMColour(yyGetInt32(_col));
    g_webGL.ClearScreen(true, true, false, col);	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_ConvertGMColour_RELEASE(_col) { 

    return (_col & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_set_alpha_RELEASE( _alpha )
{
    // cap _alpha to between 0 and 1
    if (_alpha < 0) { _alpha = 0; }
    if (_alpha > 1) { _alpha = 1; }
    
    g_GlobalAlpha = _alpha;
}

// #############################################################################################
/// Function:<summary>
///          	Sets the current g_transform...
///          </summary>
// #############################################################################################
function WebGL_SetTransform_RELEASE(_arg) {

    if (arguments.length > 0)
    {
	    var trans = arguments[0];
	    //graphics._setTransform(trans[0], trans[3], trans[1], trans[4], trans[2], trans[5]);
    } else
    {
	    //graphics._setTransform(g_transform[0], g_transform[3], g_transform[1], g_transform[4], g_transform[2], g_transform[5]);
    }
}
// #############################################################################################
/// Function:<summary>
///          	Create a "full" matrix and use "push" it.
///          </summary>
///
/// In:		 <param name="_x">X location</param>
///			 <param name="_y">Y location</param>
///			 <param name="_xs">X scale</param>
///			 <param name="_ys">Y scale</param>
///			 <param name="_angle">angle in radians/</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_PushTransform_RELEASE( _x,_y, _xs,_ys, _angle ) 
{
}

function WebGL_PushMatrix_RELEASE(_matrix)
{
}

// #############################################################################################
/// Function:<summary>
///          	Draw some text usingthe WEB fonts
///          </summary>
///
/// In:		<param name="_font"></param>
///			<param name="_str"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
///			<param name="_col"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_DrawText_RELEASE(_font, _str, _x, _y, _xscale, _yscale, _angle, _col, _alpha) 
{
    if (!g_webGL_textureFont) {
        // create a dummy texture used for rendering font canvas too make it really big (4096x4096)
        var ww = 1024;
        var hh = 1024;
        
        var image = Graphics_AddTextureWH( ww, hh );
        var pTPE = new yyTPageEntry();    
        pTPE.x = 0;     
        pTPE.y = 0;
        pTPE.w = ww;
        pTPE.h = hh;
        pTPE.XOffset = 0;
        pTPE.YOffset = 0;
        pTPE.CropWidth = pTPE.w;
        pTPE.CropHeight = pTPE.h;
        pTPE.ow = pTPE.w;
        pTPE.oh = pTPE.h;
        pTPE.tp = image;
        pTPE.texture = g_Textures[pTPE.tp];
        g_webGL_textureFont = pTPE;
	    
        //g_webGL_spanFont = document.createElement("span");
    } // end if
	
    // RK :: we could keep a cache of the MRU canvases
    // RK :: create a canvas object and render the text to that
    var c = document.createElement( "canvas" );
    var ctx = c.getContext("2d");
    _font = "20px arial";
    ctx.font = _font;
    ctx.textBaseline = "top"; // make sure the text grows from the TL of the canvas	
    ctx.textAlign = "left";
    
    // measure the size of canvas required for the string    
    //g_webGL_spanFont.font = _font;
    //g_webGL_spanFont.textContent = _str;
    var textMetrics = ctx.measureText( _str );
    var width = textMetrics.width;
    var height = 20; //g_webGL_spanFont.offsetHeight;
    c.width = width;
    c.height = height;    
    
    // clear this context with white (with 0 alpha)
    ctx.globalAlpha = 0.0;
    ctx.globalCompositeOperation = "copy";
    ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, c.width, c.height );
   
    // draw the string into the canvas
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "white";
    //ctx.fillRect( 0, 0, width, height );
    ctx.fillText(_str, 0, 0);
	
    // now place it onto the default texture used 
    //Graphics_UpdateTexture( g_webGL_textureFont, 0, 0, c);
    
    // draw this texture to the screen
    //WebGL_TextureDrawWH_RELEASE( g_webGL_textureFont, 0, 0, width, height, _x, _y, _xscale, _yscale, _angle, _col, _col, _col, _col, _alpha );
}

// #############################################################################################
/// Function:<summary>
///          	Push a matrix onto our stack
///          </summary>
///
/// In:		<param name="_matrix">Matrix to push onto the stack</param>
// #############################################################################################
function PushMatrix(_matrix) {

    if (g_MatrixSP >= MATRIX_STACK_MAX) {
        return false;
    }

    g_MatrixSP++;
    if (g_MatrixSP == 0) {	    
        g_MatrixStack[g_MatrixSP] = new Matrix(_matrix);
    }
    else {
        g_MatrixStack[g_MatrixSP].Multiply(g_MatrixStack[g_MatrixSP - 1], _matrix);
    }
    return true;
}

// #############################################################################################
/// Function:<summary>
///          	Pop the top matrix off the stack
///          </summary>
///
/// In:		<param name="_matrix"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function PopMatrix(_matrix) {

    if (g_MatrixSP < 0) {
        return false;
    }
	
    // Set Matrix to that currently on top
    WebGL_SetMatrix(MATRIX_WORLD, g_MatrixStack[g_MatrixSP]);	
    g_MatrixSP--;
    return true;
}

// #############################################################################################
/// Function:<summary>
///          	Clear off the matrix stack altogether
///          </summary>
// #############################################################################################
function MatrixStackClear() {
    g_MatrixSP = -1;
}

// #############################################################################################
/// Function:<summary>
///             Checks to see if the matrix stack is empty
///          </summary>
// #############################################################################################
function MatrixStackEmpty() {

    if (g_MatrixSP < 0) {
        return true;
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Set the top matrix as the current one but don't remove it
///          </summary>
// #############################################################################################
function SetTopMatrix() {

    if (g_MatrixSP < 0) {
        return false;
    }	
    // Set Matrix to that currently on top
    WebGL_SetMatrix(MATRIX_WORLD, g_MatrixStack[g_MatrixSP]);	
    return true;
}


// #############################################################################################
/// Function:<summary>
///             Discard the top matrix
///          </summary>
// #############################################################################################
function DiscardTopMatrix() {

    if (g_MatrixSP < 0) {
        return false;
    }
    g_MatrixSP--;
    return true;
}

// #############################################################################################
/// Function:<summary>
///             Draw a simple TPage entry.
///          </summary>
///
/// In:		 <param name="_pTPE"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_alpha"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_TextureDrawSimple_RELEASE(_pTPE, _x, _y, _alpha) 
{
    var pBuff, curr, colcurr, pCoords, pColours, pUVs,col;
    if (!_pTPE.texture.webgl_textureid) {
        if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
        WebGL_BindTexture(_pTPE);
    }
    
    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;

    _x = _x+_pTPE.XOffset;
    _y = _y+_pTPE.YOffset;
    
    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x;
    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y;
    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x + _pTPE.CropWidth;
    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + _pTPE.CropHeight;
    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = _pTPE.x / _pTPE.texture.width;
    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = _pTPE.y / _pTPE.texture.height;
    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (_pTPE.x + _pTPE.w) / _pTPE.texture.width;
    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (_pTPE.y + _pTPE.h) / _pTPE.texture.height;

    col = ((_alpha*255.0)<<24) | 0xffffff;
    var col1 = col,
        col2 = col,
        col3 = col,
        col4 = col;
    if (GR_MarkVertCorners) {
	
        col1 &= 0xfffefffe;			// clear out bits, ready for "marking"
	    col2 &= 0xfffefffe;			// 
	    col3 &= 0xfffefffe;			// 
	    col4 &= 0xfffefffe;			// 
	    col2 |= 0x00010000;			// Mark which corner we're in!
	    col3 |= 0x00000001;
	    col4 |= 0x00010001;
    }

    pColours[v0] = pColours[v5] = col1;
    pColours[v1] = col2;
    pColours[v2] = pColours[v3] = col3;
    pColours[v4] = col4;    
}

// #############################################################################################
/// Function:<summary>
///             A replacement for Canvas drawimage, although this one takes a colour+alpha
///          </summary>
///
/// In:		 <param name="_pTPE"></param>
///			 <param name="_tx"></param>
///			 <param name="_ty"></param>
///			 <param name="_tw"></param>
///			 <param name="_th"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_drawImage_Replacement_RELEASE(_pTPE, _tx,_ty,_tw,_th,  _x,_y,_w,_h, _col1,_col2,_col3,_col4 ) 
{
    var pBuff, curr, colcurr, pCoords, pColours, pUVs,col;
    if (!_pTPE.texture.webgl_textureid) {
        if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
        WebGL_BindTexture(_pTPE);
    }
    
    if (_col1 == undefined) {
        _col1 = _col2 = _col3 = _col4 = 0xffffffff;
    }
    if (_col2 == undefined) {
        _col2 = _col3 = _col4 = _col1;
    }


    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;
        
    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x;
    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y;
    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x + _w;
    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + _h;
    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = _tx / _pTPE.texture.width;
    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = _ty / _pTPE.texture.height;
    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (_tx + _tw) / _pTPE.texture.width;
    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (_ty + _th) / _pTPE.texture.height;
    
    //var col1 = _col,
    //    col2 = _col,
    //    col3 = _col,
    //    col4 = _col;
    if (GR_MarkVertCorners) {
	
        _col1 &= 0xfffefffe;			// clear out bits, ready for "marking"
	    _col2 &= 0xfffefffe;			// 
	    _col3 &= 0xfffefffe;			// 
	    _col4 &= 0xfffefffe;			// 
	    _col2 |= 0x00010000;			// Mark which corner we're in!
	    _col3 |= 0x00000001;
	    _col4 |= 0x00010001;
    }

    pColours[v0] = pColours[v5] = _col1;
    pColours[v1] = _col2;
    pColours[v2] = pColours[v3] = _col3;
    pColours[v4] = _col4;    
}

// #############################################################################################
/// Function:<summary>
///				Draws the texture tiled to cover at least the given area (xr,yr,wr,hr)
///				No clipping is performed so a slightly larger area might be filled
///				Its origin is placed on position x,y  and it is scaled as indicated
///				htiled indicates whether to use horizontal tiling, vtiled for vertical tiling
///				col is the blend color, alpha is the alpha transparency value (0-1)
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="xorig"></param>
///			 <param name="yorig"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="xsc"></param>
///			 <param name="ysc"></param>
///			 <param name="htiled"></param>
///			 <param name="vtiled"></param>
///			 <param name="xr"></param>
///			 <param name="yr"></param>
///			 <param name="wr"></param>
///			 <param name="hr"></param>
///			 <param name="col"></param>
///			 <param name="alpha"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	WebGL_TextureDrawTiled_RELEASE( _pTPE, _x, _y, _xsc, _ysc, vtiled, htiled, _col, _alpha ) 
{
    var pBuff, curr, colcurr, pCoords, pColours, pUVs,w,h;
    if (!_pTPE.texture.webgl_textureid) {
        if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
        WebGL_BindTexture(_pTPE);
    }

    var _axsc = abs(_xsc);
    var _aysc = abs(_ysc);

    var ow = _pTPE.ow * _axsc;
	var oh = _pTPE.oh * _aysc;
	//account for larger extents when view is rotated - 
	var xr = g_roomExtents.left;
	var yr = g_roomExtents.top;
	var wr = (g_roomExtents.right - g_roomExtents.left);
	var hr = (g_roomExtents.bottom - g_roomExtents.top);

	w = ow;
	h = oh;
	if (htiled)
	{
		//w = (((((g_pCurrentView.worldw + (pTPE->ow - 1)) / pTPE->ow) & 0xffffffff) + 2) * pTPE->ow);
		//w = (((g_ViewAreaW + (ow - 1)) / ow) + 2) * ow;
		//x = g_ViewAreaX + fmod(x - g_ViewAreaX, ow) - ow;
		w = (((wr + (ow - 1)) / ow) + 2) * ow;
		_x = xr + fmod(_x - xr, ow) - ow;
	}
	if (vtiled)
	{
		// h = (((((g_pCurrentView.worldh + (pTPE.oh - 1)) / pTPE.oh) & 0xffffffff) + 2) * pTPE->oh);
		//h = (((g_ViewAreaH + (oh - 1)) / oh) + 2) * oh;
		//y = g_ViewAreaY + fmod(y - g_ViewAreaY, oh) - oh;
		h = (((hr + (oh - 1)) / oh) + 2) * oh;
		_y = yr + fmod(_y - yr, oh) - oh;
	}
	
    if ( (ow <= 0) || (oh <= 0) ) return;           // Drawing would take forever
	
    // compute the correct blending color (saturate alpha)        
    var colour = ConvertGMColour(_col) | (~~((_alpha*255.0)<<24));
	
    var col1 = colour,
        col2 = colour,
        col3 = colour,
        col4 = colour;
    if (GR_MarkVertCorners) {
	
        col1 &= 0xfffefffe;			// clear out bits, ready for "marking"
	    col2 &= 0xfffefffe;			// 
	    col3 &= 0xfffefffe;			// 
	    col4 &= 0xfffefffe;			// 
	    col2 |= 0x00010000;			// Mark which corner we're in!
	    col3 |= 0x00000001;
	    col4 |= 0x00010001;
    }

    var invTWidth = 1.0 / _pTPE.texture.width;
    var invTHeight = 1.0 / _pTPE.texture.height;

    var u = (_pTPE.x * invTWidth);
	var u2 = (_pTPE.x + _pTPE.w)*invTWidth;
	var v = (_pTPE.y * invTHeight);
	var v2 = (_pTPE.y + _pTPE.h)*invTHeight;
	var nw = _xsc * _pTPE.CropWidth;
	var nh = _ysc * _pTPE.CropHeight;
	

    // Work out the loop count targets
    var tx = (w / ow);
    var ty = (h / oh);

    
    var yy = _y + (_pTPE.YOffset * _aysc);
    for (var cy = 0; cy < ty; cy++, yy += (_pTPE.oh * _aysc))
    {
        var xx = _x + (_pTPE.XOffset * _axsc);
	    var yy2 = yy + nh;

	    for (var cx = 0; cx < tx; cx++, xx += (_pTPE.ow * _axsc))
	    {
		    // Cut the texture up varo 4 strips to avoid texture cache misses on PSP
		    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );
		    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
		    var index = stride * pBuff.Current;			
		    pBuff.Current += 6;

		    pCoords = pBuff.Coords;
		    pColours = pBuff.Colours;
		    pUVs = pBuff.UVs;

            var xx2 = xx + nw;

		    // Bottom Left
		    pColours[index] = col4;
		    pCoords[index + 0] = xx;
		    pCoords[index + 1] = yy;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u;
		    pUVs[index + 1] = v;
		
		    // Top Left
		    index += stride;
		    pColours[index] = col1;
		    pCoords[index + 0] = xx2;
		    pCoords[index + 1] = yy;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u2;
		    pUVs[index + 1] = v;
	
		    // Top Right
		    index += stride;
		    pColours[index] = col2;
		    pCoords[index + 0] = xx2;
		    pCoords[index + 1] = yy2;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u2;
		    pUVs[index + 1] = v2;

		    // Top Right
		    index += stride;
		    pColours[index] = col2;
		    pCoords[index + 0] = xx2;
		    pCoords[index + 1] = yy2;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u2;
		    pUVs[index + 1] = v2;
			
		    // Bottom Right
		    index += stride;
		    pColours[index] = col3;
		    pCoords[index + 0] = xx;
		    pCoords[index + 1] = yy2;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u;
		    pUVs[index + 1] = v2;

            // Top left again
            index += stride;
            pColours[index] = col1;
		    pCoords[index + 0] = xx;
		    pCoords[index + 1] = yy;
		    pCoords[index + 2] = GR_Depth;
		    pUVs[index + 0] = u;
		    pUVs[index + 1] = v;
	    }
    }
}

// #############################################################################################
/// Function:<summary>
///             Draw an SWF at the given index
///          </summary>
// #############################################################################################
function WebGL_DrawSWF_RELEASE(SWFDictionary, SWFTimeline, ind, xorig, yorig, x, y, xscale, yscale, angle, color, alpha, TPEs) 
{            
    var oldColourWriteEnable = GR_ColourWriteEnable;
    var oldZWriteEnable = GR_3DMode;

    // Index wraps and may not be on an integer boundary
    ind = ~~ind % (SWFTimeline.numFrames);
    if ( ind < 0 ) {
        ind = ind + (SWFTimeline.numFrames);
    }
	
    // Get colour bytes
    var mulcolor = (color | ((alpha * 255) & 0xff) << 24);

    var colvals = [];
    colvals[0] = mulcolor & 0xff;
    colvals[1] = (mulcolor >> 8) & 0xff;
    colvals[2] = (mulcolor >> 16) & 0xff;
    colvals[3] = (mulcolor >> 24) & 0xff;

    // Set up any transformation here related to pos\rot\scale
    var posMat = new Matrix();
    posMat.SetTranslation(x, y, 0.0);

    var rotMat = new Matrix();
    rotMat.SetZRotation(angle);

    var origMat = new Matrix();	
    origMat.SetTranslation(-xorig / g_SWF_twipscale, -yorig / g_SWF_twipscale, 0.0);

    var scaleMat = new Matrix();
    scaleMat.SetScale(g_SWF_twipscale * xscale, g_SWF_twipscale * yscale, 1.0);	
		
    var tempMat1 = new Matrix();	
    tempMat1.Multiply(origMat, scaleMat);
    var tempMat2 = new Matrix();
    tempMat2.Multiply(tempMat1, rotMat);
    var postMat = new Matrix();
    postMat.Multiply(tempMat2, posMat);

    // Set up matrix to transform from gradient space to texture space
    var translate = new Matrix();
    translate.SetTranslation(0.5, 0.5, 0.0);		
    var scale = new Matrix();
    scale.SetScale(1.0 / 32768.0, 1.0 / 32768.0, 1.0);
    var gradTransMat = new Matrix();
    gradTransMat.Multiply(scale, translate);
	
    // Run through the list of objects in our current frame
    var pFrame = SWFTimeline.Frames[ind];	

    var pActiveMaskObjects = [],
        numActiveMaskObjects = 0,
        totaltris = 0,
        allowAA = true;
    for (var i = 0; i < pFrame.numObjects; i++)	
    {
	    var pObject = pFrame.Objects[i];

	    // First compare active masks to the depth of this object
	    for (var j = 0; j < numActiveMaskObjects;)
	    {
		    var pMaskObject = pActiveMaskObjects[j];
		    if (pMaskObject.clipDepth < pObject.depth)
		    {
			    // Deactivate this mask

			    // Stencil should still be enabled
			    // Decrement stencil value			    
			    g_webGL.SetStencilFunc(yyGL.CmpFunc_CmpAlways);
			    g_webGL.SetStencilPass(yyGL.StencilOp_Decr);				
			    g_webGL.SetColorWriteEnable(false, false, false, false);
			    g_webGL.SetZWriteEnable(false);

			    totaltris += Graphics_SWFDrawObject(SWFDictionary, pMaskObject, postMat, gradTransMat, mulcolor, colvals, false/*no aa*/, TPEs);

			    // Set back to masking again			    
			    g_webGL.SetStencilRef(numActiveMaskObjects - 1);
			    g_webGL.SetStencilFunc(yyGL.CmpFunc_CmpEqual);
			    g_webGL.SetStencilPass(yyGL.StencilOp_Keep);
			    g_webGL.SetColorWriteEnable(oldColourWriteEnable.red, oldColourWriteEnable.green, oldColourWriteEnable.blue, oldColourWriteEnable.alpha);
			    g_webGL.SetZWriteEnable(oldZWriteEnable);
			    
			    allowAA = true;

			    // Remove this mask from the array (this is rubbish so hopefully we don't have too many)
			    numActiveMaskObjects--;
			    for (var k = j; k < numActiveMaskObjects; k++)
			    {
				    pActiveMaskObjects[k] = pActiveMaskObjects[k+1];
			    }
		    }
		    else {
			    j++;
		    }
	    }

	    if (pObject.clipDepth > 0)
	    {
		    // Stick this object in our active list and setup our stencil states
		    pActiveMaskObjects[numActiveMaskObjects++] = pObject;
					    
		    g_webGL.SetStencilEnable(true);
		    g_webGL.SetStencilFunc(yyGL.CmpFunc_CmpAlways);
		    g_webGL.SetStencilPass(yyGL.StencilOp_Incr);		    
		    g_webGL.SetColorWriteEnable(false, false, false, false);
		    g_webGL.SetZWriteEnable(false);
		    
		    allowAA = false;
	    }

	    if (numActiveMaskObjects == 0)
	    {	        
	        g_webGL.SetStencilEnable(false);		    
	        allowAA = true;
	    }

	    totaltris += Graphics_SWFDrawObject(SWFDictionary, pObject, postMat, gradTransMat, mulcolor, colvals, allowAA ? GR_SWFAAEnabled : false, TPEs);

	    if (pObject.clipDepth > 0)
	    {
		    // Set so that we mask subsequent shapes					    
		    g_webGL.SetStencilRef(numActiveMaskObjects);
		    g_webGL.SetStencilFunc(yyGL.CmpFunc_CmpEqual);
		    g_webGL.SetStencilPass(yyGL.StencilOp_Keep);
		    g_webGL.SetColorWriteEnable(oldColourWriteEnable.red, oldColourWriteEnable.green, oldColourWriteEnable.blue, oldColourWriteEnable.alpha);
		    g_webGL.SetZWriteEnable(oldZWriteEnable);		    
		    
		    allowAA = true;
	    }
    }

    // Run through any remaining mask objects and clean up their stencil
    if (numActiveMaskObjects > 0)
    {
	    // Stencil should still be enabled
	    // Decrement stencil value	    	    
	    g_webGL.SetStencilFunc(yyGL.CmpFunc_CmpAlways);
	    g_webGL.SetStencilPass(yyGL.StencilOp_Decr);
	    g_webGL.SetColorWriteEnable(false, false, false, false);
	    g_webGL.SetZWriteEnable(false);	    	    

	    for (var j = 0; j < numActiveMaskObjects; j++)
	    {
		    var pMaskObject = pActiveMaskObjects[j];
		    totaltris += Graphics_SWFDrawObject(SWFDictionary, pMaskObject, postMat, gradTransMat, mulcolor, colvals, false/*no aa*/, TPEs);
	    }		
    }
		
    // Restore render states    
    g_webGL.SetStencilEnable(false);
    g_webGL.SetColorWriteEnable(oldColourWriteEnable.red, oldColourWriteEnable.green, oldColourWriteEnable.blue, oldColourWriteEnable.alpha);
    g_webGL.SetZWriteEnable(oldZWriteEnable);    
}

// #############################################################################################
/// Function:<summary>
///             Draw an SWF object
///          </summary>
// #############################################################################################
function WebGL_DrawSWFObject_RELEASE(SWFDictionaryItems, _pObject, _pPostMat, _pGradTransMat, _mulcolour, _colvals, _aa, TPEs)
{
    // Work out alpha colour for AA        
    var transcolvals = [];
	transcolvals[0] = _colvals[0],
	transcolvals[1] = _colvals[1],
	transcolvals[2] = _colvals[2],
	transcolvals[3] = 0;
	
    var combinedMat = new Matrix();
    combinedMat.Multiply(_pObject.transMat, _pPostMat);
    
    var aascale = 1.0;
	if (_aa) {
        aascale = WebGL_BuildAAScale(_pObject, combinedMat) * GR_SWFAAScale;
    }
    
    var colmul = [],
        coladd = [],
        transcoladd = [];        
    for (var i = 0; i < 4; i++)
    {
	    colmul[i] = _pObject.colTransMul[i];
	    coladd[i] = _pObject.colTransAdd[i];
	    transcoladd[i] = _pObject.colTransAddZeroAlpha[i];
    }

    var numtris = 0;
    // Could potentially optimise this a bit by collapsing all the style groups into a single contiguous list, storing an explicit colour for each triangle vertex and chaining untextured geometry together
    // We'd still have to maintain rendering order so we couldn't chain *all* untextured geometry - just contiguous sections
    // If we also precalculate how long each run is we could reduce the amount of conditionals and calls to AllocVerts
    // Tradeoff is higher bandwidth usage, so may not be an overall win - would need to test
    // This will hit the dynamic geometry pipeline quite hard, so it would also be handy if we wrote directly into vertex buffers on all platforms (if they're in write-combined memory pages (or the equivalent) we'd also avoid poluting the cache on writes as well)
    // Also we could move a lot of the conditional logic to higher levels (i.e. we don't have to do the colour multiplication all the time)
    // Still need to try GPU transform - means lots of batches if we're not using shaders so may not be an overall CPU win, but saves a lot of memory reads\writes for vertex data
    if (_pObject.ID !== 0)
    {
	    var pItem = SWFDictionaryItems[ _pObject.index ];
	    if (pItem.type === eDIType_Shape)
	    {
	        var pShape = pItem;
		    for (var j = 0; j < pShape.StyleGroups.length; j++)
		    {				
			    var pGroup = pShape.StyleGroups[j];
			    for (var k = 0; k < pGroup.numSubShapes; k++)				
			    {
				    var pSubShape = pGroup.SubShapes[k];
				    // TO HERE
				    if ((pSubShape.FillStyle1 >= 0) && (pSubShape.numTriangles > 0))
				    {
					    var pFillStyleData = pGroup.FillStyles[ pSubShape.FillStyle1 ];
					    if ((pFillStyleData !== null) && (pFillStyleData !== undefined))
					    {
						    var filltype = pFillStyleData.type;
						    if (filltype === eSWFFillType_Solid) 
						    {
							    numtris += WebGL_Draw_SolidSWFShape(
							        _pObject, pFillStyleData, pSubShape, combinedMat, _colvals, transcolvals, colmul, coladd, transcoladd, _aa);
						    }
						    else if ((filltype == eSWFFillType_Gradient) || (filltype == eSWFFillType_Bitmap)) 
						    {
							    numtris += WebGL_Draw_BitmapGradientSWFShape(
							        SWFDictionaryItems, _pObject, filltype, pFillStyleData, pSubShape, _pGradTransMat, combinedMat, _colvals, transcolvals, _mulcolour, colmul, coladd, transcoladd, _aa, TPEs);
						    }
					    }
				    }

				    if ((pSubShape.LineStyle >= 0) && (pSubShape.numLineTriangles > 0))
				    {
					    var col = pGroup.LineStyles[ pSubShape.LineStyle ].col;						

					    // Multiply our material colour and mul colour together using good old fashioned fixed point maths
					    // Note that this will make things very slightly darker and more transparent, as 1.0 is represented by 256, not 255
					    var blendcolvals = [];
					    blendcolvals[0] = ((col & 0xff) * _colvals[0]) >> 8;
					    blendcolvals[1] = (((col >> 8) & 0xff) * _colvals[1]) >> 8;
					    blendcolvals[2] = (((col >> 16) & 0xff) * _colvals[2]) >> 8;
					    blendcolvals[3] = (((col >> 24) & 0xff) * _colvals[3]) >> 8;
					    
					    // Apply colour transform (TODO: store and check flag to see if we actually need to do this)
						for (var t = 0; t < 4; t++)
						{
							blendcolvals[t] = ((blendcolvals[t] * colmul[t]) >> 8) + coladd[t];
							blendcolvals[t] = Math.max(0, Math.min(blendcolvals[t], 255));
						}

					    var blendcol = blendcolvals[0] | (blendcolvals[1] << 8) | (blendcolvals[2] << 16) | (blendcolvals[3] << 24);
					    					    
					    // Line AA
					    var transblendcolvals = [];
						transblendcolvals[0] = ((col & 0xff) * transcolvals[0]) >> 8;
						transblendcolvals[1] = (((col >> 8) & 0xff) * transcolvals[1]) >> 8;
						transblendcolvals[2] = (((col >> 16) & 0xff) * transcolvals[2]) >> 8;
						transblendcolvals[3] = (((col >> 24) & 0xff) * transcolvals[3]) >> 8;

						// Apply colour transform (TODO: store and check flag to see if we actually need to do this)
						for (var t = 0; t < 4; t++)
						{
							transblendcolvals[t] = ((transblendcolvals[t] * colmul[t]) >> 8) + transcoladd[t];
							transblendcolvals[t] = yymax(0, yymin(transblendcolvals[t], 255));
						}
						var transblendcol = transblendcolvals[0] | (transblendcolvals[1] << 8) | (transblendcolvals[2] << 16) | (transblendcolvals[3] << 24);
					    
					    // Handle AA on lines at this point
					    if (_aa && (pSubShape.numLineAALines > 0)) {
					    
					        var numVerts = pSubShape.numLineAALines * 6;
					        var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
					        var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
					        var currVert = stride * pBuff.Current;
                            pBuff.Current += numVerts;                                
                            var pCoords = pBuff.Coords;
                            var pColours = pBuff.Colours;
                            var pUVs = pBuff.UVs;						

					        numtris += pSubShape.numLineAALines * 2;
					    
							for (var t = 0; t < pSubShape.numLineAALines; t++)
							{
								var index1 = pSubShape.LineAALines[(t * 2) + 0],
								    index2 = pSubShape.LineAALines[(t * 2) + 1];
									
								var srcX1 = pSubShape.LinePoints[(index1 * 2) + 0],
    								srcY1 = pSubShape.LinePoints[(index1 * 2) + 1];
    								
								var srcX3 = pSubShape.LineAAVectors[(index1 * 2) + 0],
								    srcY3 = pSubShape.LineAAVectors[(index1 * 2) + 1];
								    
								var srcX2 = pSubShape.LinePoints[(index2 * 2) + 0],
    								srcY2 = pSubShape.LinePoints[(index2 * 2) + 1];
    								
								var srcX4 = pSubShape.LineAAVectors[(index2 * 2) + 0],
								    srcY4 = pSubShape.LineAAVectors[(index2 * 2) + 1];																	

								var x1 = (srcX1 * combinedMat.m[_11]) + (srcY1 * combinedMat.m[_21]) + combinedMat.m[_41],
								    y1 = (srcX1 * combinedMat.m[_12]) + (srcY1 * combinedMat.m[_22]) + combinedMat.m[_42],
								    x2 = (srcX2 * combinedMat.m[_11]) + (srcY2 * combinedMat.m[_21]) + combinedMat.m[_41],
								    y2 = (srcX2 * combinedMat.m[_12]) + (srcY2 * combinedMat.m[_22]) + combinedMat.m[_42];

								// Scale offsets
								srcX3 *= aascale;
								srcY3 *= aascale;

								srcX4 *= aascale;
								srcY4 *= aascale;

								var x3 = (srcX3 * combinedMat.m[_11]) + (srcY3 * combinedMat.m[_21]) + x1,
								    y3 = (srcX3 * combinedMat.m[_12]) + (srcY3 * combinedMat.m[_22]) + y1,
								    x4 = (srcX4 * combinedMat.m[_11]) + (srcY4 * combinedMat.m[_21]) + x2,
								    y4 = (srcX4 * combinedMat.m[_12]) + (srcY4 * combinedMat.m[_22]) + y2;
								
								
								// tri 1	
								pCoords[currVert + 0] = x1;
						        pCoords[currVert + 1] = y1;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = blendcol;
					            currVert += stride;
					            
					            pCoords[currVert + 0] = x2;
						        pCoords[currVert + 1] = y2;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = blendcol;
					            currVert += stride;
					            
					            pCoords[currVert + 0] = x3;
						        pCoords[currVert + 1] = y3;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = transblendcol;
					            currVert += stride;
					            
					            // tri 2
					            pCoords[currVert + 0] = x3;
						        pCoords[currVert + 1] = y3;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = transblendcol;
					            currVert += stride;
					            
					            pCoords[currVert + 0] = x2;
						        pCoords[currVert + 1] = y2;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = blendcol;
					            currVert += stride;
					            
					            pCoords[currVert + 0] = x4;
						        pCoords[currVert + 1] = y4;
						        pCoords[currVert + 2] = GR_Depth;
						        pColours[currVert] = transblendcol;
					            currVert += stride;
							}
					    }
					    
						
					    var numVerts = pSubShape.numLineTriangles * 3;
					    var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
					    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
					    var currVert = stride * pBuff.Current;
                        pBuff.Current += numVerts;                                
                        pCoords = pBuff.Coords;
                        pColours = pBuff.Colours;
                        pUVs = pBuff.UVs;						

					    numtris += pSubShape.numLineTriangles;
						
					    var currTri = 0;
					    for (var t = pSubShape.numLineTriangles*3; t > 0; --t)
					    {							
						    var index = pSubShape.LineTriangles[currTri++];

						    var srcX = pSubShape.LinePoints[index*2];
						    var srcY = pSubShape.LinePoints[(index*2) + 1];

						    var x = (srcX * combinedMat.m[_11]) + (srcY * combinedMat.m[_21]) + combinedMat.m[_41];
						    var y = (srcX * combinedMat.m[_12]) + (srcY * combinedMat.m[_22]) + combinedMat.m[_42];
							
						    pCoords[currVert + 0] = x;
						    pCoords[currVert + 1] = y;
						    pCoords[currVert + 2] = GR_Depth;
						    pColours[currVert] = blendcol;
					        currVert += stride;	
					    }
				    }
			    }
		    }
	    }
    }
    return numtris;
}

// #############################################################################################
/// Function:<summary>
///             Draw a bitmap or a gradient SWF shape.
///             The parameter list for this *is* a joke :(
///          </summary>
// #############################################################################################
function WebGL_Draw_BitmapGradientSWFShape(
    SWFDictionaryItems, _pObject, _filltype, _pFillStyleData, _pSubShape, _pGradTransMat, _combinedMat, _colvals, _transcolvals, _mulcolour, _colmul, _coladd, _transcoladd, _aa, TPEs) 
{
    var pCoords,
        pColours,
        pUVs,
        pTPE = null,
        aascale = 1.0,
        texTransMat = new Matrix();

    if (_aa) {
        aascale = WebGL_BuildAAScale(_pObject, _combinedMat) * GR_SWFAAScale;
    }
            
    if (_filltype === eSWFFillType_Gradient)
    {
        var pFillData = _pFillStyleData;
        if (pFillData.tpeindex > -1)
        {
            pTPE = TPEs[pFillData.tpeindex];

            var texscaleMat = new Matrix();
            var texbiasMat = new Matrix();
            var texbiasscaleMat = new Matrix();
            var texgradbiasscaleMat = new Matrix();

            texbiasMat.SetTranslation(pTPE.x / pTPE.texture.width, pTPE.y / pTPE.texture.height, 0);
            texscaleMat.SetScale(pTPE.w / pTPE.texture.width, pTPE.h / pTPE.texture.height, 1.0);

            texbiasscaleMat.Multiply(texscaleMat, texbiasMat);
            texgradbiasscaleMat.Multiply(_pGradTransMat, texbiasscaleMat);
            texTransMat.Multiply(pFillData.transMat, texgradbiasscaleMat);
        }
        else
        {
            pTPE = pFillData.TPE;

            texTransMat.Multiply(pFillData.transMat, _pGradTransMat);
        }
    }
    else if (_filltype === eSWFFillType_Bitmap)
    {
        var pFillData = _pFillStyleData;
        if (pFillData.charIndex !== -1)
        {
            var pBitmapItem = SWFDictionaryItems[pFillData.charIndex];
            if (pBitmapItem.tpeindex > -1)
            {
                pTPE = TPEs[pBitmapItem.tpeindex];

                //var texscaleMat = new Matrix();
                //texscaleMat.SetScale(1.0 / pTexture.width, 1.0 / pTexture.height, 1.0);
                //texTransMat.Multiply(pFillData.transMat, texscaleMat);
                var scalex = pTPE.w / pTPE.ow;
                var scaley = pTPE.h / pTPE.oh;

                var texbiasMat = new Matrix();
                var texscaleMat = new Matrix();
                var texbiasscaleMat = new Matrix();                
                texbiasMat.SetTranslation(pTPE.x / scalex, pTPE.y / scaley, 0);
                texscaleMat.SetScale((1.0 / pTPE.texture.width) * scalex, (1.0 / pTPE.texture.height) * scaley, 1.0);
                texbiasscaleMat.Multiply(texbiasMat, texscaleMat);
                texTransMat.Multiply(pFillData.transMat, texbiasscaleMat);

                if ((pFillData.bitmapFillType === eBitmapFillType_Repeat) ||
                    (pFillData.bitmapFillType === eBitmapFillType_RepeatPoint))
                {
                    // Set to repeat
                    g_webGL.SetTextureWrap(0, true);
                }
                else
                {
                    // Set to clamp
                    g_webGL.SetTextureWrap(0, false);
                }
            }
            else
            {
                var pTexture = pBitmapItem.pTexture;
                // Spoof a TPE for use with AllocVerts
                pTPE = { texture: pTexture };
                if (pTexture !== null)
                {
                    // TODO: apply scaling matrix to fill style matrix as a preprocessing step, to avoid having to do this all the time (a style is uniquely associated with a texture anyway)
                    // In fact, also move the texture pointer into the fill style struct to avoid an indirection
                    var texscaleMat = new Matrix();
                    texscaleMat.SetScale(1.0 / pTexture.width, 1.0 / pTexture.height, 1.0);
                    texTransMat.Multiply(pFillData.transMat, texscaleMat);

                    if ((pFillData.bitmapFillType === eBitmapFillType_Repeat) ||
                        (pFillData.bitmapFillType === eBitmapFillType_RepeatPoint))
                    {
                        // Set to repeat
                        g_webGL.SetTextureWrap(0, true);
                    }
                    else
                    {
                        // Set to clamp
                        g_webGL.SetTextureWrap(0, false);
                    }
                }
            }
        }
    }

    var numtris = 0;
    if (pTPE !== null)
    {
        if (!pTPE.texture.webgl_textureid) {
            if (pTPE.w == 0 || pTPE.h == 0) return;       // if nothing there, don't draw
            WebGL_BindTexture(pTPE);
        }
        numtris += _pSubShape.numTriangles;                
        
        // Do the AA if necessary
        if (_aa && (_pSubShape.numAALines > 0)) {
        
            numtris += _pSubShape.numAALines * 2;
            
            var blendcolvals = [];
		    for (var t = 0; t < 4; t++)
		    {
		    	blendcolvals[t] = ((_colvals[t] * _colmul[t]) >> 8) + _coladd[t];										
		    	blendcolvals[t] = Math.max(0, Math.min(blendcolvals[t], 255));
		    }
            var blendcol = blendcolvals[0] | (blendcolvals[1] << 8) | (blendcolvals[2] << 16) | (blendcolvals[3] << 24);
        
			var transblendcolvals = [];
			// Apply colour transform (TODO: store and check flag to see if we actually need to do this)
			for (var t = 0; t < 4; t++)
			{
				transblendcolvals[t] = ((_transcolvals[t] * _colmul[t]) >> 8) + _transcoladd[t];
				transblendcolvals[t] = Math.max(0, Math.min(transblendcolvals[t], 255));
			}

			var transblendcol = transblendcolvals[0] | (transblendcolvals[1] << 8) | (transblendcolvals[2] << 16) | (transblendcolvals[3] << 24);

			var numVerts = _pSubShape.numAALines * 6;
	        var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);
	        var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
	        var currVert = stride * pBuff.Current;								
            pBuff.Current += numVerts;

            var pCoords = pBuff.Coords;
            var pColours = pBuff.Colours;
            var pUVs = pBuff.UVs;
    	    
    	    var currLine = 0;
    	    for (t = _pSubShape.numAALines; t > 0; t--)
    	    {							
    	        // Double check the increment!
    	    	var index1 = _pSubShape.AALines[currLine++],
    	    	    index2 = _pSubShape.AALines[currLine++];

		    	var currPoint = index1*2,
		    	    currAAPoint = index1*2;

		    	var srcX1 = _pSubShape.Points[currPoint];
		    	currPoint++;
		    	var srcY1 = _pSubShape.Points[currPoint];

		    	var srcX3 = _pSubShape.AAVectors[currAAPoint];
		    	currAAPoint++;
		    	var srcY3 = _pSubShape.AAVectors[currAAPoint];

		    	currPoint = index2*2;
		    	currAAPoint = index2*2;

		    	var srcX2 = _pSubShape.Points[currPoint];
		    	currPoint++;
		    	var srcY2 = _pSubShape.Points[currPoint];

		    	var srcX4 = _pSubShape.AAVectors[currAAPoint];
		    	currAAPoint++;
		    	var srcY4 = _pSubShape.AAVectors[currAAPoint];

		    	var x1 = (srcX1 * _combinedMat.m[_11]) + (srcY1 * _combinedMat.m[_21]) + _combinedMat.m[_41],
		    	    y1 = (srcX1 * _combinedMat.m[_12]) + (srcY1 * _combinedMat.m[_22]) + _combinedMat.m[_42],                                                                               
		    	    x2 = (srcX2 * _combinedMat.m[_11]) + (srcY2 * _combinedMat.m[_21]) + _combinedMat.m[_41],
		    	    y2 = (srcX2 * _combinedMat.m[_12]) + (srcY2 * _combinedMat.m[_22]) + _combinedMat.m[_42];

		    	// Scale offsets
		    	srcX3 *= aascale;
		    	srcY3 *= aascale;

		    	srcX4 *= aascale;
		    	srcY4 *= aascale;

		    	var x3 = (srcX3 * _combinedMat.m[_11]) + (srcY3 * _combinedMat.m[_21]) + x1,
		    	    y3 = (srcX3 * _combinedMat.m[_12]) + (srcY3 * _combinedMat.m[_22]) + y1,
		    	    x4 = (srcX4 * _combinedMat.m[_11]) + (srcY4 * _combinedMat.m[_21]) + x2,
		    	    y4 = (srcX4 * _combinedMat.m[_12]) + (srcY4 * _combinedMat.m[_22]) + y2;
		    	    
		    	// Add on offsets
				srcX3 += srcX1;
				srcY3 += srcY1;

				srcX4 += srcX2;
				srcY4 += srcY2;
		    									
		        pCoords[currVert + 0] = x1;
	            pCoords[currVert + 1] = y1;
	            pCoords[currVert + 2] = GR_Depth;
                pUVs[currVert + 0] = (srcX1 * texTransMat.m[_11]) + (srcY1 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX1 * texTransMat.m[_12]) + (srcY1 * texTransMat.m[_22]) + texTransMat.m[_42];
	            pColours[currVert] = blendcol;
	            currVert += stride;
	            
	            pCoords[currVert + 0] = x2;
	            pCoords[currVert + 1] = y2;
	            pCoords[currVert + 2] = GR_Depth;
                pUVs[currVert + 0] = (srcX2 * texTransMat.m[_11]) + (srcY2 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX2 * texTransMat.m[_12]) + (srcY2 * texTransMat.m[_22]) + texTransMat.m[_42];
	            pColours[currVert] = blendcol;		
	            currVert += stride;
	            
	            pCoords[currVert + 0] = x3;
	            pCoords[currVert + 1] = y3;
	            pCoords[currVert + 2] = GR_Depth;
	            pUVs[currVert + 0] = (srcX3 * texTransMat.m[_11]) + (srcY3 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX3 * texTransMat.m[_12]) + (srcY3 * texTransMat.m[_22]) + texTransMat.m[_42];
	            pColours[currVert] = transblendcol;
	            currVert += stride;
	            
	            pCoords[currVert + 0] = x3;
	            pCoords[currVert + 1] = y3;
	            pCoords[currVert + 2] = GR_Depth;
                pUVs[currVert + 0] = (srcX3 * texTransMat.m[_11]) + (srcY3 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX3 * texTransMat.m[_12]) + (srcY3 * texTransMat.m[_22]) + texTransMat.m[_42];	            	            
	            pColours[currVert] = transblendcol;
	            currVert += stride;
	            
	            pCoords[currVert + 0] = x2;
	            pCoords[currVert + 1] = y2;
	            pCoords[currVert + 2] = GR_Depth;          
	            pUVs[currVert + 0] = (srcX2 * texTransMat.m[_11]) + (srcY2 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX2 * texTransMat.m[_12]) + (srcY2 * texTransMat.m[_22]) + texTransMat.m[_42];	            
	            pColours[currVert] = blendcol;
	            currVert += stride;
	            
	            pCoords[currVert + 0] = x4;
	            pCoords[currVert + 1] = y4;
	            pCoords[currVert + 2] = GR_Depth;
	            pUVs[currVert + 0] = (srcX4 * texTransMat.m[_11]) + (srcY4 * texTransMat.m[_21]) + texTransMat.m[_41];
                pUVs[currVert + 1] = (srcX4 * texTransMat.m[_12]) + (srcY4 * texTransMat.m[_22]) + texTransMat.m[_42];
	            pColours[currVert] = transblendcol;
	            currVert += stride;
	        }    
		}		
            
        // Draw the shape's triangles				
        var numVerts = _pSubShape.numTriangles * 3;
        var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);							        
        var stride = pBuff.GetStride() >> 2;
        var currVert = stride * pBuff.Current;
        pBuff.Current += numVerts;
        								    
        pCoords = pBuff.Coords,
        pColours = pBuff.Colours,
        pUVs = pBuff.UVs;
    	
        var currTri = 0;
        for (var t = _pSubShape.numTriangles*3; t > 0; --t)
        {
            var index = _pSubShape.Triangles[currTri++];
    	
    	    var srcX = _pSubShape.Points[index*2];
    	    var srcY = _pSubShape.Points[(index*2) + 1];

    	    var x = (srcX * _combinedMat.m[_11]) + (srcY * _combinedMat.m[_21]) + _combinedMat.m[_41];
    	    var y = (srcX * _combinedMat.m[_12]) + (srcY * _combinedMat.m[_22]) + _combinedMat.m[_42];

    	    pCoords[currVert + 0] = x;
            pCoords[currVert + 1] = y;	
            pCoords[currVert + 2] = GR_Depth;								
            pColours[currVert] = _mulcolour;									    
    	    pUVs[currVert + 0] = (srcX * texTransMat.m[_11]) + (srcY * texTransMat.m[_21]) + texTransMat.m[_41];
    	    pUVs[currVert + 1] = (srcX * texTransMat.m[_12]) + (srcY * texTransMat.m[_22]) + texTransMat.m[_42];
    		
    	    currVert += stride;
        }
    }
    return numtris;
}

// #############################################################################################
/// Function:<summary>
///             Draw a solid SWF shape
///          </summary>
// #############################################################################################
function WebGL_Draw_SolidSWFShape(_pObject, _pFillStyleData, _pSubShape, _combinedMat, _colvals, _transcolvals, _colmul, _coladd, _transcoladd, _aa) {

    var aascale = 1.0;
    if (_aa) {
        aascale = WebGL_BuildAAScale(_pObject, _combinedMat) * GR_SWFAAScale;
    }

    var useTextureWithSolidFill = false;        
	/*if ((g_ActiveUserShader != NULL) && (g_SolidWhiteTexturePtr != NULL) && (g_SolidWhiteTexturePtr->tex != NULL))
	{
		useTextureWithSolidFill = true;
	}*/

    // Get simpler access
    var pFillData = _pFillStyleData,
	    col = pFillData.col,
	    numtris = 0,
	    t = 0;

	// Multiply our material colour and mul colour together using good old fashioned fixed point maths
	// Note that this will make things very slightly darker and more transparent, as 1.0 is represented by 256, not 255
	var blendcolvals = [];
    var r = (col & 0xff),
	    g = ((col >> 8) & 0xff),
	    b = ((col >> 16) & 0xff),
	    a = ((col >> 24) & 0xff);							        
	blendcolvals[0] = (r * _colvals[0]) >> 8;
	blendcolvals[1] = (g * _colvals[1]) >> 8;
	blendcolvals[2] = (b * _colvals[2]) >> 8;								
	blendcolvals[3] = (a * _colvals[3]) >> 8;

	// Apply colour transform (TODO: store and check flag to see if we actually need to do this)
	for (t = 0; t < 4; t++)
	{
	    blendcolvals[t] = ((blendcolvals[t] * _colmul[t]) >> 8) + _coladd[t];
	    blendcolvals[t] = yymax(0, yymin(blendcolvals[t], 255));
	}
	var blendcol = blendcolvals[0] | (blendcolvals[1] << 8) | (blendcolvals[2] << 16) | (blendcolvals[3] << 24);
	
	// Do AA trans blending
	var transblendcolvals = [];
	transblendcolvals[0] = ((col & 0xff) * _transcolvals[0]) >> 8;
	transblendcolvals[1] = (((col >> 8) & 0xff) * _transcolvals[1]) >> 8;
	transblendcolvals[2] = (((col >> 16) & 0xff) * _transcolvals[2]) >> 8;
	transblendcolvals[3] = (((col >> 24) & 0xff) * _transcolvals[3]) >> 8;

	// Apply colour transform (TODO: store and check flag to see if we actually need to do this)
	for (t = 0; t < 4; t++)
	{
		transblendcolvals[t] = ((transblendcolvals[t] * _colmul[t]) >> 8) + _transcoladd[t];
		transblendcolvals[t] = yymax(0, yymin(transblendcolvals[t], 255));
	}
	var transblendcol = transblendcolvals[0] | (transblendcolvals[1] << 8) | (transblendcolvals[2] << 16) | (transblendcolvals[3] << 24);
	
	
	// Currently just do manual transformation
	if (useTextureWithSolidFill) {
	}
	else if (_aa && (_pSubShape.numAALines > 0)) {
	
	    numtris += _pSubShape.numAALines * 2;
	
	    var numVerts = _pSubShape.numAALines * 6;
	    var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
	    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
	    var currVert = stride * pBuff.Current;								
        pBuff.Current += numVerts;

        var pCoords = pBuff.Coords;
        var pColours = pBuff.Colours;    	
    	
    	var currLine = 0;
    	for (t = _pSubShape.numAALines; t > 0; t--)
    	{							
    	    // Double check the increment!
    		var index1 = _pSubShape.AALines[currLine++],
    		    index2 = _pSubShape.AALines[currLine++];

			var currPoint = index1*2,
			    currAAPoint = index1*2;

			var srcX1 = _pSubShape.Points[currPoint];
			currPoint++;
			var srcY1 = _pSubShape.Points[currPoint];

			var srcX3 = _pSubShape.AAVectors[currAAPoint];
			currAAPoint++;
			var srcY3 = _pSubShape.AAVectors[currAAPoint];

			currPoint = index2*2;
			currAAPoint = index2*2;

			var srcX2 = _pSubShape.Points[currPoint];
			currPoint++;
			var srcY2 = _pSubShape.Points[currPoint];

			var srcX4 = _pSubShape.AAVectors[currAAPoint];
			currAAPoint++;
			var srcY4 = _pSubShape.AAVectors[currAAPoint];

			var x1 = (srcX1 * _combinedMat.m[_11]) + (srcY1 * _combinedMat.m[_21]) + _combinedMat.m[_41],
			    y1 = (srcX1 * _combinedMat.m[_12]) + (srcY1 * _combinedMat.m[_22]) + _combinedMat.m[_42],                                                                               
			    x2 = (srcX2 * _combinedMat.m[_11]) + (srcY2 * _combinedMat.m[_21]) + _combinedMat.m[_41],
			    y2 = (srcX2 * _combinedMat.m[_12]) + (srcY2 * _combinedMat.m[_22]) + _combinedMat.m[_42];

			// Scale offsets
			srcX3 *= aascale;
			srcY3 *= aascale;

			srcX4 *= aascale;
			srcY4 *= aascale;

			var x3 = (srcX3 * _combinedMat.m[_11]) + (srcY3 * _combinedMat.m[_21]) + x1,
			    y3 = (srcX3 * _combinedMat.m[_12]) + (srcY3 * _combinedMat.m[_22]) + y1,
			    x4 = (srcX4 * _combinedMat.m[_11]) + (srcY4 * _combinedMat.m[_21]) + x2,
			    y4 = (srcX4 * _combinedMat.m[_12]) + (srcY4 * _combinedMat.m[_22]) + y2;
											
		    pCoords[currVert + 0] = x1;
	        pCoords[currVert + 1] = y1;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = blendcol;		
	        currVert += stride;
	        
	        pCoords[currVert + 0] = x2;
	        pCoords[currVert + 1] = y2;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = blendcol;		
	        currVert += stride;
	        
	        pCoords[currVert + 0] = x3;
	        pCoords[currVert + 1] = y3;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = transblendcol;
	        currVert += stride;
	        
	        pCoords[currVert + 0] = x3;
	        pCoords[currVert + 1] = y3;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = transblendcol;
	        currVert += stride;
	        
	        pCoords[currVert + 0] = x2;
	        pCoords[currVert + 1] = y2;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = blendcol;
	        currVert += stride;
	        
	        pCoords[currVert + 0] = x4;
	        pCoords[currVert + 1] = y4;
	        pCoords[currVert + 2] = GR_Depth;
	        pColours[currVert] = transblendcol;
	        currVert += stride;
	    }
    }    
	
	var numVerts = _pSubShape.numTriangles * 3;
	var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            
	var currVert = stride * pBuff.Current;
    pBuff.Current += numVerts;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    
    numtris += _pSubShape.numTriangles;
    
	var currTri = 0;								
	for (var t = _pSubShape.numTriangles*3; t > 0; --t)
	{
	    var index = _pSubShape.Triangles[currTri++];
	    
	    var srcX = _pSubShape.Points[index*2];
	    var srcY = _pSubShape.Points[(index*2) + 1];

	    var x = (srcX * _combinedMat.m[_11]) + (srcY * _combinedMat.m[_21]) + _combinedMat.m[_41];
	    var y = (srcX * _combinedMat.m[_12]) + (srcY * _combinedMat.m[_22]) + _combinedMat.m[_42];

	    pCoords[currVert + 0] = x;
	    pCoords[currVert + 1] = y;
	    pCoords[currVert + 2] = GR_Depth;
	    pColours[currVert] = blendcol;
		
	    currVert += stride;									
	}
	return numtris;
}

// #############################################################################################
/// Function:<summary>
///             Draw an SWF at the given index
///          </summary>
// #############################################################################################
function WebGL_BuildAAScale(_pObject, _combinedMat) {

    // Work out the AA scaling required
    if (GR_SWFAAEnabled) {
    
        // Returned cached answer if it's available
        if (_pObject.aascale !== undefined) {
            return _pObject.aascale;
        }
    
        // work out size of one twip on screen		
		var worldmat = WebGL_GetMatrix(MATRIX_WORLD);
		var viewmat = WebGL_GetMatrix(MATRIX_VIEW);
		var projmat = WebGL_GetMatrix(MATRIX_PROJECTION);

        var worldviewmat = new Matrix();
        worldviewmat.Multiply(worldmat, viewmat);
        var worldviewprojmat = new Matrix();
        worldviewprojmat.Multiply(worldviewmat, projmat);
        var finalmat = new Matrix();
		finalmat.Multiply(_combinedMat, worldviewprojmat);

		var viewportwidth = g_webGL.ViewportWidth,
		    viewportheight = g_webGL.ViewportHeight;

        // Ideally base coords on the centre of the shape bounds to get most representative sample
		var srcverts = [];
		srcverts[0] = 0.0;
		srcverts[1] = 0.0;

		srcverts[2] = 1.0;
		srcverts[3] = 0.0;

		srcverts[4] = 0.0;
		srcverts[5] = 1.0;

		var destverts = [];
		for (var i = 0; i < 3; i++){
		
			var W = (srcverts[i*2] * finalmat.m[_14]) + (srcverts[(i*2)+1] * finalmat.m[_24]) + (GR_Depth * finalmat.m[_34]) + finalmat.m[_44];
            
            var index = (i * 2) + 0;
			destverts[index] = (srcverts[i*2] * finalmat.m[_11]) + (srcverts[(i*2)+1] * finalmat.m[_21]) + (GR_Depth * finalmat.m[_31]) + finalmat.m[_41];
			destverts[index] = destverts[index] / W;
			destverts[index] = destverts[index] * viewportwidth;
			
			index++;
			destverts[index] = (srcverts[i*2] * finalmat.m[_12]) + (srcverts[(i*2)+1] * finalmat.m[_22]) + (GR_Depth * finalmat.m[_32]) + finalmat.m[_42];
			destverts[index] = destverts[index] / W;
			destverts[index] = destverts[index] * viewportheight;
		}

		var diffvec = [];
		diffvec[0] = destverts[2] - destverts[0];
		diffvec[1] = destverts[3] - destverts[1];

		diffvec[2] = destverts[4] - destverts[0];
		diffvec[3] = destverts[5] - destverts[1];

		// Get max length
		var maxlength = 0.0,
		    aascale = 1.0,
		    index = 0;	    
		for (var i = 0; i < 2; i++) {
		
			var length = diffvec[index] * diffvec[index];
			index++;
			
			length += diffvec[index] * diffvec[index];
			index++;

			if (length > 0.0) {
				length = Math.sqrt(length);
		    }

			maxlength = Math.max(length, maxlength);
		}

		maxlength *= 0.5;		// take into account -1 to 1 range
		if (maxlength > 0.0) {
			aascale = 1.0 / maxlength;		
		}		
		
		// Cache the return value with the SWF object
		_pObject.aascale = aascale;
		return aascale;
	}
	return 1.0;
}

// #############################################################################################
/// Function:<summary>
///             Draws the texture
///          </summary>
///
/// In:		 <param name="pTPE">Texture page entry</param>
///			 <param name="xorig">The X origin of the texture</param>
///			 <param name="yorig">The Y origin of the texture</param>
///			 <param name="x">the X position to put th origin on</param>
///			 <param name="y">the X position to put th origin on</param>
///			 <param name="xsc">X Scale are the scale factor in x- and y- direction</param>
///			 <param name="ysc">Y Scale are the scale factor in x- and y- direction</param>
///			 <param name="rot">rot is the rotation angle (counterclockwise in radians)</param>
///			 <param name="col">col is the blend color</param>
///			 <param name="_alpha">alpha is the alpha transparency value (0-1)</param>
///				
// #############################################################################################
function WebGL_TextureDraw_RELEASE(_pTPE, _xorig, _yorig, _x, _y, _xsc, _ysc, _rot, _col, _col2,_col3,_col4, _alpha)
{
    var pBuff, curr, colcurr, pCoords, pColours, pUVs;
    if(_pTPE === undefined)
    {
        debug("Attempting to draw texture that is not loaded");
        return;
    }
    if (!_pTPE.texture.webgl_textureid) {
        if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
        WebGL_BindTexture(_pTPE);
    }
    


    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );	
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;

    var x1 =  -_xsc * (_xorig-_pTPE.XOffset);
    var y1 =  -_ysc * (_yorig-_pTPE.YOffset);
	
    var x2 = x1 + (_xsc*_pTPE.CropWidth);
    var y2 = y1 + (_ysc*_pTPE.CropHeight);
    
    if (Math.abs(_rot) < 0.001)
    {
	    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x + x1;
	    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y + y1;
	    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x + x2;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + y2;
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
    }
    else {
	    // do common calculations first
	    var ss = Math.sin(_rot); 
	    var cc = Math.cos(_rot);
	    var x1_cc = x1*cc;
	    var x2_cc = x2*cc;
	    var y1_cc = y1*cc;
	    var y2_cc = y2*cc;
	    var x1_ss = x1*ss;
	    var x2_ss = x2*ss;
	    var y1_ss = y1*ss;
	    var y2_ss = y2*ss;
        
	    pCoords[v0 + 0] = pCoords[v5 + 0]= _x + x1_cc + y1_ss;
	    pCoords[v0 + 1] = pCoords[v5 + 1]= _y - x1_ss + y1_cc;
	    pCoords[v2 + 0] = pCoords[v3 + 0] = _x + x2_cc + y2_ss;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = _y - x2_ss + y2_cc;	    
		
	    pCoords[v1 + 1] = _y - x2_ss + y1_cc;
	    pCoords[v1 + 0] = _x + x2_cc + y1_ss;
	    pCoords[v4 + 0] = _x + x1_cc + y2_ss;
	    pCoords[v4 + 1] = _y - x1_ss + y2_cc;		    
	    
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
    }
    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = _pTPE.x / _pTPE.texture.width;
    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = _pTPE.y / _pTPE.texture.height;
    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (_pTPE.x + _pTPE.w) / _pTPE.texture.width;
    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (_pTPE.y + _pTPE.h) / _pTPE.texture.height;

	// Clamp alpha to 0..255
    var a = ~~(_alpha * 255.0);
    a = a - ( ( a - 255 ) & ( ( 255 - a ) >> 31 ) );
    a = a - ( a & ( a >> 31 ) );
    a = ( a << 24 );

    _col = a | ( _col & 0xffffff );
    if ( _col2 == undefined )
    {
	    _col2 = _col;
	    _col3 = _col;
	    _col4 = _col;
    }
    else
    {
	    _col2 = (_col2 & 0xffffff) |a;
	    _col3 = (_col3 & 0xffffff) |a;
	    _col4 = (_col4 & 0xffffff) |a;
    }
    
    if (GR_MarkVertCorners) {
	
        _col  &= 0xfffefffe;			// clear out bits, ready for "marking"
	    _col2 &= 0xfffefffe;			// 
	    _col3 &= 0xfffefffe;			// 
	    _col4 &= 0xfffefffe;			// 
	    _col2 |= 0x00010000;			// Mark which corner we're in!
	    _col3 |= 0x00000001;
	    _col4 |= 0x00010001;
    }
    pColours[v0] = pColours[v5] = _col;
    pColours[v1] = _col2;
    pColours[v2] = pColours[v3] = _col3;
    pColours[v4] = _col4;
}

// #############################################################################################
/// Function:<summary>
///             Draws the texture with the given coordinates
///          </summary>
// #############################################################################################
function WebGL_TextureDrawPos_RELEASE(_pTPE, _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _alpha) {

    var col = ~~((_alpha * 255.0) << 24) | 0xffffff;
    var col2 = col;
    var col3 = col;
    var col4 = col;

	var pBuff, curr, colcurr, pCoords, pColours, pUVs;
	if (!_pTPE.texture.webgl_textureid) {
	    if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
	    WebGL_BindTexture(_pTPE);
	}

    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );	
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current;
    pBuff.Current += 6;
    
    var v0 = index,
        v1 = v0 + stride,
        v2 = v1 + stride,
        v3 = v2 + stride,
        v4 = v3 + stride,
        v5 = v4 + stride;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;
    
    pCoords[v0 + 0] = pCoords[v5 + 0] = _x1;
    pCoords[v0 + 1] = pCoords[v5 + 1] = _y1;    
    pCoords[v1 + 0] = _x2;
    pCoords[v1 + 1] = _y2;
    pCoords[v2 + 0] = pCoords[v3 + 0] = _x3;
    pCoords[v2 + 1] = pCoords[v3 + 1] = _y3;
    pCoords[v4 + 0] = _x4;
    pCoords[v4 + 1] = _y4;
    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
	
    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = _pTPE.x / _pTPE.texture.width;
    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = _pTPE.y / _pTPE.texture.height;
    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (_pTPE.x + _pTPE.w) / _pTPE.texture.width;
    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (_pTPE.y + _pTPE.h) / _pTPE.texture.height;

    if (GR_MarkVertCorners) {
	
        col  &= 0xfffefffe;			// clear out bits, ready for "marking"
	    col2 &= 0xfffefffe;			// 
	    col3 &= 0xfffefffe;			// 
	    col4 &= 0xfffefffe;			// 
	    col2 |= 0x00010000;			// Mark which corner we're in!
	    col3 |= 0x00000001;
	    col4 |= 0x00010001;
    }
    pColours[v0] = pColours[v5] = col;
    pColours[v1] = col2;
    pColours[v2] = pColours[v3] = col3;
    pColours[v4] = col4;
}

// #############################################################################################
/// Function:<summary>
///             Draws the texture
///          </summary>
///
/// In:		 <param name="pTPE">Texture page entry</param>
///			 <param name="xorig">The X origin of the texture</param>
///			 <param name="yorig">The Y origin of the texture</param>
///			 <param name="x">the X position to put th origin on</param>
///			 <param name="y">the X position to put th origin on</param>
///			 <param name="xsc">X Scale are the scale factor in x- and y- direction</param>
///			 <param name="ysc">Y Scale are the scale factor in x- and y- direction</param>
///			 <param name="rot">rot is the rotation angle (counterclockwise in radians)</param>
///			 <param name="col">col is the blend color</param>
///			 <param name="_alpha">alpha is the alpha transparency value (0-1)</param>
///				
// #############################################################################################
function WebGL_TextureDrawWH_RELEASE(_pTPE, _xorig, _yorig, _width, _height, _x, _y, _xsc, _ysc, _rot, _col, _col2,_col3,_col4, _alpha)
{
    var pBuff, curr, colcurr, pCoords, pColours, pUVs;
    if (!_pTPE.texture.webgl_textureid) {
        if (_pTPE.w == 0 || _pTPE.h == 0) return;       // if nothing there, don't draw
        WebGL_BindTexture(_pTPE);
    }


    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, _pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6 );	
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;

    var x1 =  -_xsc * (_xorig-_pTPE.XOffset);
    var y1 =  -_ysc * (_yorig-_pTPE.YOffset);
	
    var x2 = x1 + (_xsc*_width);
    var y2 = y1 + (_ysc*_height);
    
    if (Math.abs(_rot) < 0.001)
    {
	    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x + x1;
	    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y + y1;
	    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x + x2;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + y2;
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
    }
    else {
	    // do common calculations first
	    var ss = Math.sin(_rot); 
	    var cc = Math.cos(_rot);
	    var x1_cc = x1*cc;
	    var x2_cc = x2*cc;
	    var y1_cc = y1*cc;
	    var y2_cc = y2*cc;
	    var x1_ss = x1*ss;
	    var x2_ss = x2*ss;
	    var y1_ss = y1*ss;
	    var y2_ss = y2*ss;
        
	    pCoords[v0 + 0] = pCoords[v5 + 0]= _x + x1_cc + y1_ss;
	    pCoords[v0 + 1] = pCoords[v5 + 1]= _y - x1_ss + y1_cc;
	    pCoords[v2 + 0] = pCoords[v3 + 0] = _x + x2_cc + y2_ss;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = _y - x2_ss + y2_cc;
		
	    pCoords[v1 + 1] = _y - x2_ss + y1_cc;
	    pCoords[v1 + 0] = _x + x2_cc + y1_ss;
	    pCoords[v4 + 0] = _x + x1_cc + y2_ss;
	    pCoords[v4 + 1] = _y - x1_ss + y2_cc;
	    
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;		    
    }
    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = _pTPE.x / _pTPE.texture.width;
    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = _pTPE.y / _pTPE.texture.height;
    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (_pTPE.x + _width) / _pTPE.texture.width;
    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (_pTPE.y + _height) / _pTPE.texture.height;

    var a = (_alpha * 255.0) << 24; 
    _col = a | (_col & 0xffffff);
    if (_col2 == undefined)
    {
	    _col2 = _col;
	    _col3 = _col;
	    _col4 = _col;
    } else
    {
	    _col2 = _col2|a;
	    _col3 = _col3|a;
	    _col4 = _col4|a;
    }
    
    if (GR_MarkVertCorners) {
	
        _col  &= 0xfffefffe;			// clear out bits, ready for "marking"
	    _col2 &= 0xfffefffe;			// 
	    _col3 &= 0xfffefffe;			// 
	    _col4 &= 0xfffefffe;			// 
	    _col2 |= 0x00010000;			// Mark which corner we're in!
	    _col3 |= 0x00000001;
	    _col4 |= 0x00010001;
    }
    pColours[v0] = pColours[v5] = _col;
    pColours[v1] = _col2;
    pColours[v2] = pColours[v3] = _col3;
    pColours[v4] = _col4;
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_texture"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_canvas"></param>
// #############################################################################################
function WebGL_UpdateTexture_RELEASE( _texture, _x, _y, _w,_h, _canvas, _format ) {

    g_webGL.UpdateTexture(_texture, _x, _y, _w, _h, _canvas, _format);
    
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_pTPE"></param>
///			 <param name="_left"></param>
///			 <param name="_top"></param>
///			 <param name="_width"></param>
///			 <param name="_height"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_DrawPart_RELEASE(_pTPE, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _color, _alpha) {

    if (!_pTPE) return;
    if (!_pTPE.texture) return;

    _color &= 0xffffff;
    _color |= (_alpha * 255) << 24;


    // CLIP the drawing area.
    if (_left < _pTPE.XOffset)
    {
	    var off = _pTPE.XOffset - _left;
	    _x += off * _xscale;
	    _width -= off;
	    _left = 0;
    } else
    {
	    _left -= _pTPE.XOffset;
	    //_width -= _pTPE.XOffset;
    }


    if (_top < _pTPE.YOffset)
    {
	    var off = _pTPE.YOffset - _top;
	    _y += off * _yscale;
	    _height -= off;
	    _top = 0;
    } else
    {
	    _top -= _pTPE.YOffset;
	    //_height -= _pTPE.YOffset;
    }

    if (_width > (_pTPE.CropWidth - _left )) _width = _pTPE.CropWidth - _left;
    if (_height > (_pTPE.CropHeight - _top )) _height = _pTPE.CropHeight - _top;
    if (_width <= 0 || _height <= 0) return;

    WebGL_drawImage_Replacement_RELEASE(_pTPE, _left + _pTPE.x, _top + _pTPE.y, _width, _height, _x, _y, _width * _xscale, _height * _yscale, _color);
}


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_outline"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_rectangle_RELEASE(_x1, _y1, _x2, _y2, _outline)
{    
    var pBuff, curr, colcurr, pCoords, pColours, pUVs;
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    _outline = yyGetBool(_outline);

    //_outline = false;
    var format = yyGL.PRIM_TRIANGLE;
    var count = 6;
    if (_outline) {
	    format = yyGL.PRIM_LINE; 
	    count = 8;
    }

    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(format, null, g_webGL.VERTEX_FORMAT_2D, count);
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += count;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    // For outlines
    var v6 = v5 + stride;
    var v7 = v6 + stride;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    //pUVs = pBuff.UVs;

    var col = ~~((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0xffffff);
	
    // Don't care about UV's as it's a SOLID white texture... so whatever is there is good.
    if (!_outline)
    {
        if (offsethackGL != 0.0)
        {        
            _x2 += offsethackGL;
            _y2 += offsethackGL;
        }

	    // Solid fill, 2 triangles
	    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x1;
	    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y1;
	    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x2;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y2;
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

	    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
    } 
    else
    {
        if (offsethackGL != 0.0)
        {
            _x1 += offsethackGL;
            _y1 += offsethackGL;
            _x2 += offsethackGL;
            _y2 += offsethackGL;
        }

	    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] 
	                 = pColours[v4] = pColours[v5] = pColours[v6] = pColours[v7] = col;

	    // Line set
	    pCoords[v5 + 0] = pCoords[v7 + 0] = pCoords[v6 + 0] = pCoords[v0 + 0] = _x1;// + 0.5;
	    pCoords[v7 + 1] = pCoords[v2 + 1] = pCoords[v1 + 1] = pCoords[v0 + 1] = _y1;//+ 0.5;
	    pCoords[v4 + 0] = pCoords[v3 + 0] = pCoords[v2 + 0] = pCoords[v1 + 0] = _x2;// + 0.5;
	    pCoords[v3 + 1] = pCoords[v4 + 1] = pCoords[v5 + 1] = pCoords[v6 + 1] = _y2;// + 0.5;
	    pCoords[v7 + 1] = _y1;


	    
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = 
	    pCoords[v4 + 2] = pCoords[v5 + 2] = pCoords[v6 + 2] = pCoords[v7 + 2] = GR_Depth;
    }
}


// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
function WebGL_draw_roundrect_color_EXT_RELEASE( _x1, _y1, _x2, _y2, _radx, _rady, _col1, _col2, _outline) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    _radx = yyGetReal(_radx);
    _rady = yyGetReal(_rady);

    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);

    _outline = yyGetBool(_outline);

    if (offsethackGL != 0.0)
    {
        _x1 += offsethackGL;
        _y1 += offsethackGL;
        _x2 += offsethackGL;
        _y2 += offsethackGL;
    }

    var i,w,h;

    w = _radx;
    h = _rady;
    if ( w > Math.abs(_x2-_x1) ) { w = Math.abs(_x2-_x1); }
    if ( h > Math.abs(_y2-_y1) ) { h = Math.abs(_y2-_y1); }

    var c1 = (ConvertGMColour(_col1)&0xffffff) | ((g_GlobalAlpha * 255.0) << 24);
    var c2 = (ConvertGMColour(_col2)&0xffffff) | ((g_GlobalAlpha * 255.0) << 24);

    // The number of points at each corner of the rectangle
    var corner_points = g_circleSteps / 4;

    //_outline = false;
    var format = yyGL.PRIM_TRIFAN;
    var count = ((corner_points + 1) * 4) + 2;
    if (_outline) {
	    format = yyGL.PRIM_LINESTRIP; 
    }

    var xm = (_x1+_x2)*0.5;
    var ym = (_y1+_y2)*0.5;
    var rx = Math.abs(_x2-_x1)*0.5 - w*0.5;
    var ry = Math.abs(_y2-_y1)*0.5 - h*0.5;


    // Find a buffer with enough space for our verts.
    var pBuff = g_webGL.AllocVerts(format, null, g_webGL.VERTEX_FORMAT_2D, count);
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current;
    var startIndex = index;
    pBuff.Current += count;
	
    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;


    // Start in the middle so we can get a gradient colour from the center out.
    pCoords[index]= xm; 
    pCoords[index+1]= ym; 
    pCoords[index+2]= GR_Depth;
    pColours[index]= c1;	
    index += stride;

    //First arc (top right). Draws from center to this point, using colour c1 to c2 allowing for colour gradient.
    for (i = 0; i <= corner_points; i++)
    {
	    pCoords[index]  = (xm+rx+w*g_circleCos[i]/2); 
	    pCoords[index+1]= (ym+ry+h*g_circleSin[i]/2);
	    pCoords[index+2]= GR_Depth;
	    pColours[index] = c2; 
	    index += stride;
    }

    // Arc 2 (top left)
    for (i = corner_points; i <= (corner_points*2); i++)
    {
	    pCoords[index]  = (xm-rx+w*g_circleCos[i]/2); 
	    pCoords[index+1]= (ym+ry+h*g_circleSin[i]/2);
	    pCoords[index+2]= GR_Depth;
	    pColours[index] = c2; 
	    index += stride;
    }

    // Arc 3 (bottom left)
    for (i = (corner_points*2); i <= (corner_points*3); i++)
    {
	    pCoords[index]  = (xm-rx+w*g_circleCos[i]/2); 
	    pCoords[index+1]= (ym-ry+h*g_circleSin[i]/2);
	    pCoords[index+2]= GR_Depth;
	    pColours[index] = c2; 
	    index += stride;
    }

    // Arc 4 (bottom right)
    for (i = (corner_points*3); i <= (corner_points*4); i++)
    {
	    pCoords[index]  = (xm+rx+w*g_circleCos[i]/2); 
	    pCoords[index+1]= (ym-ry+h*g_circleSin[i]/2);
	    pCoords[index+2]= GR_Depth;
	    pColours[index] = c2;
	    index += stride;
		
    }

    // Now close the rect by connecting the lower arc to the higher top arc	
    pCoords[index]  = pCoords[startIndex + stride];
    pCoords[index+1]= pCoords[startIndex + stride + 1];
    pCoords[index+2]= GR_Depth;
    pColours[index] = c2;

    if (_outline)
    {
	    // If we're drawing an outline, we don't want the CENTER point, so duplicate the 1st point on the arc
	    pCoords[startIndex] = pCoords[startIndex + stride];
	    pCoords[startIndex+1] = pCoords[startIndex + stride + 1];
	    pCoords[startIndex+2] = GR_Depth;
	    pColours[startIndex] = pColours[startIndex + stride];
    }	
}

// #############################################################################################
/// Function:<summary>
///             Draw a rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_col">Colour of the rect as a number</param>
///			 <param name="_outline">Whether or not to draw the rect as an outline</param>
///				
// #############################################################################################
function WebGL_draw_rectangle_color_RELEASE(_x1, _y1, _x2, _y2, _col1, _col2, _col3, _col4, _outline) {

    var pBuff, curr, colcurr, pCoords, pColours, pUVs;

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    _col3 = yyGetInt32(_col3);
    _col4 = yyGetInt32(_col4);

    _outline = yyGetBool(_outline);

    var a = ((g_GlobalAlpha * 255.0) << 24);
    _col1 = ConvertGMColour(_col1) | a;
    _col2 = ConvertGMColour(_col2) | a;
    _col3 = ConvertGMColour(_col3) | a;
    _col4 = ConvertGMColour(_col4) | a;

    //_outline = false;
    var format = yyGL.PRIM_TRIANGLE;
    var count = 6;
    if (_outline){
	    format = yyGL.PRIM_LINE; 
	    count = 8;
    }

    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(format, null, g_webGL.VERTEX_FORMAT_2D, count);
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var index = stride * pBuff.Current; 
    pBuff.Current += count;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    // For outlines
    var v6 = v5 + stride;
    var v7 = v6 + stride;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;
    pUVs = pBuff.UVs;

    var col = ~~((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0xffffff);
	
    // Don't care about UV's as it's a SOLID white texture... so whatever is there is good.
    if (!_outline)
    {
       /* if (offsethackGL != 0.0)
        {        
            _x2 += offsethackGL;
            _y2 += offsethackGL;
        }*/

	    // Solid fill, 2 triangles
	    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x1;
	    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y1;
	    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x2 + 1.0;//0.5;
	    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y2 + 1.0;//0.5;
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

	    pColours[v0] = pColours[v5] = _col1;
	    pColours[v2] = pColours[v3] = _col3;
	    pColours[v1] = _col2;
	    pColours[v4] = _col4;
    } 
    else
    {
        if (offsethackGL != 0.0)
        {
            _x1 += offsethackGL;
            _y1 += offsethackGL;
            _x2 += offsethackGL;
            _y2 += offsethackGL;
        }

	    pColours[v0] = pColours[v7] = _col1;
	    pColours[v1] = pColours[v2] = _col2;
	    pColours[v3] = pColours[v4] = _col3;
	    pColours[v5] = pColours[v6] = _col4;

	    // Line set
	    pCoords[v5 + 0] = pCoords[v7 + 0] = pCoords[v6 + 0] = pCoords[v0 + 0] = _x1;// + 0.5;
	    pCoords[v7 + 1] = pCoords[v2 + 1] = pCoords[v1 + 1] = pCoords[v0 + 1] = _y1;// + 0.5;
	    pCoords[v4 + 0] = pCoords[v3 + 0] = pCoords[v2 + 0] = pCoords[v1 + 0] = _x2;// + 0.5;
	    pCoords[v3 + 1] = pCoords[v4 + 1] = pCoords[v5 + 1] = pCoords[v6 + 1] = _y2;// + 0.5;
	    pCoords[v7 + 1] = _y1;
	    
	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = 
	    pCoords[v4 + 2] = pCoords[v5 + 2] = pCoords[v6 + 2] = pCoords[v7 + 2] = GR_Depth;
    }

}

// #############################################################################################
/// Function:<summary>
///          	Plot a single point
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_point_color_RELEASE(_x, _y, _col) {

    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _col = yyGetInt32(_col);

    if (offsethackGL != 0.0)
    {
        _x += offsethackGL;
        _y += offsethackGL;    
    }

    var pBuff, pCoords, pColours;

    pBuff = g_webGL.AllocVerts(yyGL.PRIM_POINT, null, g_webGL.VERTEX_FORMAT_2D, 1);
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var v0 = stride * pBuff.Current;
    pBuff.Current++;

    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    

    var col = ~~((g_GlobalAlpha * 255.0) << 24) | ConvertGMColour(_col);
    pCoords[v0 + 0] = ~~_x + 0.5;
    pCoords[v0 + 1] = ~~_y + 0.5;
    pCoords[v0 + 2] = GR_Depth;
    pColours[v0] = col;	
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_x3"></param>
///			 <param name="_y3"></param>
///			 <param name="_outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_draw_triangle_RELEASE(_x1, _y1, _x2, _y2, _x3, _y3, _outline) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _x3 = yyGetReal(_x3);
    _y3 = yyGetReal(_y3);
    _outline = yyGetBool(_outline);

    if (offsethackGL != 0.0)
    {
        _x1 += offsethackGL;
        _y1 += offsethackGL;
        _x2 += offsethackGL;
        _y2 += offsethackGL;
        _x3 += offsethackGL;
        _y3 += offsethackGL;
    }

    var pBuff, pCoords, pColours, pUVs;

    if (_outline) {
        pBuff = g_webGL.AllocVerts(yyGL.PRIM_LINESTRIP, null, g_webGL.VERTEX_FORMAT_2D, 4);
    } else {
        pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, 3);
    }
    
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var	index = stride * pBuff.Current; 
    pBuff.Current += 3;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
	
    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;

    pCoords[v0 + 0] = _x1;
    pCoords[v0 + 1] = _y1;
    pCoords[v0 + 2] = GR_Depth;
    pCoords[v1 + 0] = _x2;
    pCoords[v1 + 1] = _y2;
    pCoords[v1 + 2] = GR_Depth;
    pCoords[v2 + 0] = _x3;
    pCoords[v2 + 1] = _y3;
    pCoords[v2 + 2] = GR_Depth;
    if (_outline) {
        pCoords[v3 + 0] = _x1;
        pCoords[v3 + 1] = _y1;
        pCoords[v3 + 2] = GR_Depth;
        pBuff.Current++;
    }

    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = ((g_GlobalAlpha * 255.0) << 24) | g_GlobalColour;	
}

// #############################################################################################
/// Function:<summary>
///             Draw a rectangle with a gradient
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_col1">Start colour of the rect as a number</param>
///			 <param name="_col2">End colour of the rect as a number</param>
///			 <param name="_vert">Whether or not the gradient should be vertical (or horizontal)</param>
///			 <param name="_outline">Whether or not to draw the rect as an outline</param>
///				
// #############################################################################################
function WebGL_draw_rectangle_gradient_RELEASE(_x1, _y1, _x2, _y2, _col1, _col2, _vert, _outline) {

    if (_vert) {
        WebGL_draw_rectangle_color_RELEASE(_x1, _y1, _x2, _y2, _col1, _col1, _col2, _col2, _outline);
    }
    else {
        WebGL_draw_rectangle_color_RELEASE(_x1, _y1, _x2, _y2, _col1, _col2, _col2, _col1, _outline);
    }
}

// #############################################################################################
/// Function:<summary>
///          	Plot a single point
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_point_RELEASE(_x, _y) {
    WebGL_draw_point_color_RELEASE(_x,_y,g_GlobalColour_GM);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the color of the pixel corresponding to position (x,y) in the room. 
///             This is not very fast, so use with care.
///          </summary>
///
/// In:		<param name="_x">X coordinate of the pixel</param>
///			<param name="_y">Y coordinate of the pixel</param>
/// Out:	<returns>
///				The colour of the pixel, or 0 for off screen/canvas.
///			</returns>
// #############################################################################################
function WebGL_draw_getpixel_RELEASE(_x, _y) {
    
    var ret = WebGL_draw_getpixel_ext_RELEASE(_x,_y);
    if (Array.isArray(ret))
    {
        // Snip off alpha
        ret.splice(3);
        return ret;
    }
    else
    {
        return ret & 0x00ffffff;
    }    
}

function WebGL_draw_getpixel_ext_RELEASE(_x, _y) {

    var format = eTextureFormat_A8R8G8B8;
    if ((g_CurrentSurfaceId != null) && (g_CurrentSurfaceId != -1))
    {
        var pSurf = g_Surfaces.Get(g_CurrentSurfaceId);
        if (pSurf != null)
        {		
            format = pSurf.FrameBufferData.Texture.Format;
        }
    }
    
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y); 
    if (g_RenderTargetActive < 0) {
        _y = g_webGL.DeviceHeight - _y;
    }
    return g_webGL.GetPixel(_x, _y, format);    
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_x3"></param>
///			 <param name="_y3"></param>
///			 <param name="_outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_draw_triangle_color_RELEASE(_x1, _y1, _x2, _y2, _x3, _y3, _c1,_c2,_c3, _outline) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _x3 = yyGetReal(_x3);
    _y3 = yyGetReal(_y3);

    _c1 = yyGetInt32(_c1);
    _c2 = yyGetInt32(_c2);
    _c3 = yyGetInt32(_c3);

    _outline = yyGetBool(_outline);

    if (offsethackGL != 0.0)
    {
        _x1 += offsethackGL;
        _y1 += offsethackGL;
        _x2 += offsethackGL;
        _y2 += offsethackGL;
        _x3 += offsethackGL;
        _y3 += offsethackGL;
    }

    var pBuff, pCoords, pColours, pUVs;

    var a = ((g_GlobalAlpha * 255.0) << 24);
    _c1 = a | ConvertGMColour(_c1);
    _c2 = a | ConvertGMColour(_c2);
    _c3 = a | ConvertGMColour(_c3);

    if (_outline) {
        pBuff = g_webGL.AllocVerts(yyGL.PRIM_LINESTRIP, null, g_webGL.VERTEX_FORMAT_2D, 4);
    } else {
        pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, 3);
    }

    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var	index = stride * pBuff.Current; 
    pBuff.Current += 3;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
	
    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;

    pCoords[v0 + 0] = _x1;
    pCoords[v0 + 1] = _y1;
    pCoords[v0 + 2] = GR_Depth;
    pCoords[v1 + 0] = _x2;
    pCoords[v1 + 1] = _y2;
    pCoords[v1 + 2] = GR_Depth;
    pCoords[v2 + 0] = _x3;
    pCoords[v2 + 1] = _y3;
    pCoords[v2 + 2] = GR_Depth;
    if (_outline) {
        pCoords[v3 + 0] = _x1;
        pCoords[v3 + 1] = _y1;
        pCoords[v3 + 2] = GR_Depth;
        pBuff.Current++;
    }

    pColours[v0] = _c1;
    pColours[v1] = _c2;
    pColours[v2] = _c3;
    pColours[v3] = _c1;
}


// #############################################################################################
/// Function:<summary>
///				Draws an ellipse with the given bounding box in the current color
///				outline indicates whether to only draw the outline
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_draw_ellipse_color_RELEASE(_x1, _y1, _x2, _y2, _col1, _col2, _outline)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);

    _outline = yyGetBool(_outline);

    if (offsethackGL != 0.0)
    {
        _x1 += offsethackGL;
        _y1 += offsethackGL;
        _x2 += offsethackGL;
        _y2 += offsethackGL;    
    }

    var xm = (_x1+_x2) / 2;
    var ym = (_y1+_y2) / 2;
    var rx = Math.abs((_x1-_x2) / 2);
    var ry = Math.abs((_y1-_y2) / 2);


    var a = ((g_GlobalAlpha * 255.0) << 24);
    _col1 = a | ConvertGMColour(_col1);
    _col2 = a | ConvertGMColour(_col2);

    var pVerts,pBuff,pCoords,pColours;
    var v;
    if (_outline)
    {
        var circle_points = g_circleSteps + 1;
	    pBuff = g_webGL.AllocVerts(yyGL.PRIM_LINESTRIP, null, g_webGL.VERTEX_FORMAT_2D, circle_points);
	    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
        var	index = stride * pBuff.Current;         
        pBuff.Current += circle_points;
		
	    pCoords = pBuff.Coords;
	    pColours = pBuff.Colours;		

	    // Build ellipse point list
	    for (var i = 0; i <= g_circleSteps; i++)
	    {
		    pCoords[index]  = (xm + (rx*g_circleCos[i])); 
		    pCoords[index+1]= (ym + (ry*g_circleSin[i]));
		    pCoords[index+2] = GR_Depth;
		    pColours[index] = _col2;			
		    index += stride;
	    }
    }
    else {
	    var vertcount = g_circleSteps * 3; //(g_circleSteps + 1) * 3
	    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, vertcount);
	    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
        var	index = stride * pBuff.Current;         
        pBuff.Current += vertcount;
				
	    pCoords = pBuff.Coords;
	    pColours = pBuff.Colours;		

	    // Build ellipse point list
	    for (var i = 0; i < g_circleSteps; i++)
	    {
		    pCoords[index] = xm; 
		    pCoords[index+1] = ym; 
		    pCoords[index+2] = GR_Depth;
		    pColours[index] = _col1;
		    index += stride;

		    pCoords[index]= (xm+rx*g_circleCos[i]); 
		    pCoords[index+1]= (ym+ry*g_circleSin[i]);
		    pCoords[index+2] = GR_Depth;
		    pColours[index] = _col2; 
		    index += stride;

		    pCoords[index]= (xm+rx*g_circleCos[i+1]); 
		    pCoords[index+1]= (ym+ry*g_circleSin[i+1]);
		    pCoords[index+2] = GR_Depth;
		    pColours[index] = _col2;
		    index += stride;
	    }
    }
}

// #############################################################################################
/// Function:<summary>
///          	Draws a circle at (x,y) with radius r. outline indicates whether only the 
///             outline must be drawn (true) or it should be filled (false).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_outline">true to draw an outline</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_circle_color_RELEASE(_x, _y, _r, _col1, _col2, _outline) {
    WebGL_draw_ellipse_color_RELEASE(_x-_r, _y-_r, _x+_r, _y+_r, _col1, _col2, _outline);
}

// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2)
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///				
// #############################################################################################
function WebGL_draw_line_RELEASE(_x1, _y1, _x2, _y2) {
    WebGL_draw_line_width_color_RELEASE(_x1, _y1, _x2, _y2, 1.0, g_GlobalColour_GM, g_GlobalColour_GM);
}

// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2) with width w.
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
function WebGL_draw_line_width_RELEASE(_x1, _y1, _x2, _y2, _w ) {
    WebGL_draw_line_width_color_RELEASE(_x1, _y1, _x2, _y2, _w, g_GlobalColour_GM, g_GlobalColour_GM);
}
// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2) with width w.
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
/*
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var	index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    
    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = _x;
    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y;
    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = _x + _w;
    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + _h;
    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;*/

function WebGL_draw_line_width_color_RELEASE(_x1, _y1, _x2, _y2, _w, _col1, _col2) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    _w = yyGetReal(_w);

    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);

    if (offsethackGL != 0.0)
    {
        _x1 += offsethackGL;
        _y1 += offsethackGL;
        _x2 += offsethackGL;
        _y2 += offsethackGL;
    }

    var a = ((g_GlobalAlpha * 255.0) << 24);
    _col1 = a | ConvertGMColour(_col1);
    _col2 = a | ConvertGMColour(_col2);

    // Get a 90 degree vector of the correct length
    var xx = (_x2 - _x1);
    var yy = (_y2 - _y1);
    var l = (xx * xx) + (yy * yy);
    if (l < 0.0001) return;
    l = Math.sqrt(l);
    if (l < 0.0001) return;

    xx = 0.5 * _w * xx / l;
    yy = 0.5 * _w * yy / l;


    var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, 6);
    var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
    var	index = stride * pBuff.Current; 
    pBuff.Current += 6;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
	
    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;	

    // Create a QUAD to draw a line of a certain thickness.
    pCoords[v0 + 0] = (_x1 - yy);
    pCoords[v0 + 1] = (_y1 + xx);
    pCoords[v1 + 0] = (_x2 - yy);
    pCoords[v1 + 1] = (_y2 + xx);	
    pCoords[v2 + 0] = (_x2 + yy);
    pCoords[v2 + 1] = (_y2 - xx);

    pCoords[v3 + 0] = (_x2 + yy);
    pCoords[v3 + 1] = (_y2 - xx);
    pCoords[v4 + 0] = (_x1 + yy);
    pCoords[v4 + 1] = (_y1 - xx);
    pCoords[v5 + 0] = (_x1 - yy);
    pCoords[v5 + 1] = (_y1 + xx);
    
    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

    pColours[v0] = pColours[v4] = pColours[v5] = _col1;
    pColours[v1] = pColours[v2] = pColours[v3] = _col2;
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function initTextureFramebuffer(_pTPE, _w,_h, _format) {

    var frameBufferData = g_webGL.CreateFramebuffer(_w, _h, _format);
    _pTPE.FrameBufferData = frameBufferData;
    
    _pTPE.FrameBuffer = frameBufferData.FrameBuffer;
    _pTPE.texture.webgl_textureid = frameBufferData.Texture;	
}


// #############################################################################################
/// Function:<summary>
///          	Creates a surface of the indicated width and height. Returns the id of the surface, 
///             which must be used in all further calls. Note that the surface will not be cleared. 
///             This is the responsibility of the user. (Set it as a target and call the appropriate 
///             clear function.)
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_surface_create_RELEASE(_w, _h, _format, _forceid) {

    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

    if (_w <= 0 || _h <= 0) {
        yyError("create_surface : Trying to create a surface with size equal to or less than zero.");
    }

    if( _forceid != undefined )
    {
        _forceid = yyGetInt32(_forceid);
    }

    var pTPE = new yyTPageEntry();
   
    pTPE.texture = document.createElement("surf");		// we need an image/surface to attach to, so make a small one
    pTPE.m_Width = _w;
    pTPE.m_Height = _h;
    pTPE.texture.width = _w;
    pTPE.texture.height = _h;
    pTPE.texture.m_Width = _w;
    pTPE.texture.m_Height = _h;    

    if( _forceid != undefined )
    {
        //delete existing framebuffer
        var pSurf = g_Surfaces.Get( _forceid );
        if (pSurf && pSurf.FrameBufferData)
        {
            g_webGL.DeleteFramebuffer(pSurf.FrameBufferData);
        }
    }
        
    initTextureFramebuffer(pTPE,_w,_h, _format);

    pTPE.x = 0;
    pTPE.y = 0;
    pTPE.w = _w;
    pTPE.h = _h;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;

	if( _forceid != undefined )
	{
	    //replace existing surface at index _forceid
	    g_Surfaces.Set( _forceid, pTPE);    
	    pTPE.tp = _forceid;
	}
	else
	{  
		pTPE.tp = g_Surfaces.Add(pTPE);
	}
    pTPE.m_pTPE = pTPE;				// Canvas compatability
    pTPE.texture.complete = true;

    // Add cache details	
    pTPE.cache = [];                // clear colour cache
    pTPE.count = 0;
    pTPE.maxcache = 4; 			// Max number of times to cache this image.

    // Add "tiling" cache details
    pTPE.vh_tile = 0;               // How is it tiled?
    pTPE.hvcached = null;           // tiling cache.

    //  Surfaces ""ARE"" single images....
    pTPE.singleimage = pTPE.texture;
    return pTPE.tp;
}


// #############################################################################################
/// Function:<summary>
///          	Delete a Surface.
///          </summary>
// #############################################################################################
function WebGL_surface_free_RELEASE(_id) {
    
    _id = yyGetInt32(_id);

    if(_id < 0)
    {
        return;
    }

    var pSurf = g_Surfaces.Get(_id);
    if (pSurf && pSurf.FrameBufferData)
    {
        if (CheckForSurface(_id)) {
            ErrorOnce("Error: Surface in use via surface_set_target(). It can not be freed until it has been removed from the surface stack.");
            return;
        }

        g_webGL.FlushAll();
        g_webGL.DeleteFramebuffer(pSurf.FrameBufferData);
        
        // Make sure we aren't holding onto an invalid texture id
	    pSurf.texture.webgl_textureid = undefined;
	    
	    g_Surfaces.DeleteIndex(_id);
    } else if (!pSurf) {
        return 0;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Returns the color of the pixel corresponding to position (x,y) in the surface. 
///             This is not very fast, so use with care.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_surface_getpixel_RELEASE(_id, _x, _y) {

    var ret = WebGL_surface_getpixel_ext_RELEASE(_id, _x, _y);

    if (Array.isArray(ret))
    {
        // Snip off alpha
        ret.splice(3);
        return ret;
    }
    else
    {
        return ret & 0x00ffffff;
    }    
}

// #############################################################################################
/// Function:<summary>
///			</returns>
// #############################################################################################
function WebGL_surface_getpixel_ext_RELEASE(_id, _x, _y) {

    var ret = 0;
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (pSurf != null)
    {		
	    _x = yyGetInt32(_x);
	    _y = yyGetInt32(_y);
	    
	    ret = g_webGL.GetPixelFromFramebuffer(pSurf.FrameBuffer, _x, _y, pSurf.FrameBufferData.Texture.Format);
    }
    return new Long(ret);
}


// #############################################################################################
/// Function:<summary>
///          	Draws the surface at position (x,y). (Without color blending and no alpha transparency.)
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_draw_surface_RELEASE(_id, _x, _y) {

    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;

    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);
    var colour = ((g_GlobalAlpha * 255.0) << 24) | 0x00ffffff;
    graphics._drawImage(pSurf, 0, 0, pSurf.m_Width, pSurf.m_Height, _x, _y, pSurf.m_Width, pSurf.m_Height, colour);
}



// #############################################################################################
/// Function:<summary>
///             Draw a textured QUAD with vertex colours
///          </summary>
///
/// In:		 <param name="tex">D3D Texture map to use</param>
///			 <param name="x1">X coordinate 1</param>
///			 <param name="y1">Y coordinate 1</param>
///			 <param name="x2">X coordinate 2</param>
///			 <param name="y2">Y coordinate 2</param>
///			 <param name="x3">X coordinate 3</param>
///			 <param name="y3">Y coordinate 3</param>
///			 <param name="x4">X coordinate 4</param>
///			 <param name="y4">Y coordinate 4</param>
///			 <param name="u1">Top left X texture coordinate</param>
///			 <param name="v1">Top left Y texture coordinate</param>
///			 <param name="u2">Bottom right X texture coordinate</param>
///			 <param name="v2">Bottom right Y texture coordinate</param>
///			 <param name="c1">Colour+ALPHA #1 to draw with</param>
///			 <param name="c2">Colour+ALPHA #2 to draw with</param>
///			 <param name="c3">Colour+ALPHA #3 to draw with</param>
///			 <param name="c4">Colour+ALPHA #4 to draw with</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function DrawIt_Color(tex,
				  x1,y1, 
				  x2,y2, 
				  x3,y3, 
				  x4,y4, 
				  u1,_v1, 
				  u2,_v2,
				  c1, c2, c3, c4)
{
	//TRACEGFX( "Texture_DrawIt_Color %p, <%f,%f>, <%f,%f>, <%f,%f>, <%f,%f>, [%f,%f], [%f,%f], %08x, %08x, %08x", tex, x1, y1, x2, y2, x3, y3, x4, y4, u1, v1, u2, v2, c1, c2, c3, c4 );



	var z =(GR_Depth);
	var prim = WebGL_translate_primitive_builder_type(PrimType_TRISTRIP);
	
	var vvv = g_webGL.AllocVerts(prim, tex, g_webGL.VERTEX_FORMAT_2D, 6);
	
	
	var stride = vvv.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
	var index = stride * vvv.Current; 
    vvv.Current += 6;

    var pCoords = vvv.Coords;
    var pColours = vvv.Colours;
    var pUVs = vvv.UVs;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    
    // tl
	pCoords[v0 + 0] = 
	pCoords[v5 + 0] = x1;
	pCoords[v0 + 1] = 
	pCoords[v5 + 1] = y1;
	// tr
	pCoords[v1 + 0] = x2;
	pCoords[v1 + 1] = y2;
	// br
	pCoords[v2 + 0] = 
	pCoords[v3 + 0] = x3;
	pCoords[v2 + 1] = 
	pCoords[v3 + 1] = y3;
	// bl
	pCoords[v4 + 0] = x4;
	pCoords[v4 + 1] = y4;	
	// z
	pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = z;
	
    pColours[v0] = pColours[v5] = c1;
    pColours[v1] = c2;
    pColours[v2] = pColours[v3] =c3;
    pColours[v4] = c4;
    
    //
    pUVs[v0 + 0] = pUVs[v5 + 0] = u1;
	pUVs[v0 + 1] = pUVs[v5 + 1] = _v1;	
	// tr
	pUVs[v1 + 0] = u2;
	pUVs[v1 + 1] = _v1;
	// br
	pUVs[v2 + 0] = pUVs[v3 + 0] = u2;
	pUVs[v2 + 1] = pUVs[v3 + 1] = _v2;
	// bl
	pUVs[v4 + 0] = u1;
	pUVs[v4 + 1] = _v2;

    
    return true;
}



// #############################################################################################
/// Function:<summary>
///          	Copies the source surface at position (x,y) in the destination surface. 
///             (Without any form of blending.)
///          </summary>
///
/// In:		<param name="_destination"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_source"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_surface_copy_RELEASE(_destination, _dx, _dy, _source) {

    _destination = yyGetInt32(_destination);
    _dx = yyGetInt32(_dx);
    _dy = yyGetInt32(_dy);
    _source = yyGetInt32(_source);

    g_webGL.Flush();
    g_webGL.RSMan.SaveStates();
    surface_set_target_RELEASE(_destination);
    
    
    
    WebGL_d3d_set_projection_ortho_RELEASE(0, 0, surface_get_width(_destination), surface_get_height(_destination), 0);
    
    var _h = surface_get_height(_source);
    var _w = surface_get_width(_source);
    var _x =0;
    var _y=0;
    var dy1 = _dy;
    var dy2 = (_dy+_h);

    
    var y1 = _y;          
    var y2 = (_y+_h); 
    var u = (1/_w);
    var v = (1/_h);
    //_texture.WebGLTexture.webgl_textureid
    DrawIt_Color(surface_get_texture(_source).WebGLTexture.webgl_textureid, 
                 _dx,dy1, 
                 _dx+_w,dy1,
                 _dx+_w,dy2,
                 _dx,dy2,
                 
                 u*_x,v*y1,
                 u*(_x+_w),v*y2,
                 
                 0xffffffff,0xffffffff,0xffffffff,0xffffffff
                 );
    g_webGL.Flush();
    
    surface_reset_target_RELEASE();

    g_webGL.RSMan.RestoreStates();


//    MissingFunction("surface_copy() (WebGL)");
}

// #############################################################################################
/// Function:<summary>
///          	Copies the indicated part of the source surface at position (x,y) in the 
///             destination surface. (Without any form of blending.)
///          </summary>
///
/// In:		<param name="_destination"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_source"></param>
///			<param name="_xs"></param>
///			<param name="_ys"></param>
///			<param name="_ws"></param>
///			<param name="_hs"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_surface_copy_part_RELEASE(_destination, _dx, _dy, _source, _xs, _ys, _ws, _hs) 
{
    _destination = yyGetInt32(_destination);
    _dx = yyGetInt32(_dx);
    _dy = yyGetInt32(_dy);
    _source = yyGetInt32(_source);
    _xs = yyGetInt32(_xs);
    _ys = yyGetInt32(_ys);
    _ws = yyGetInt32(_ws);
    _hs = yyGetInt32(_hs);

    g_webGL.FlushAll();
    g_webGL.RSMan.SaveStates();
    surface_set_target_RELEASE(_destination);
    
    
    
    WebGL_d3d_set_projection_ortho_RELEASE(0, 0, surface_get_width(_destination), surface_get_height(_destination), 0);
    
    var _h = _hs;
    var _w = _ws;
    var _x =_xs;
    var _y=_ys;
    
    
    var dy1 = _dy;
    var dy2 = (_dy+_h);

    
    var y1 = _y;          
    var y2 = (_y+_h); 
    var u = (1/surface_get_width(_source));
    var v = (1/surface_get_height(_source));
    //_texture.WebGLTexture.webgl_textureid
    DrawIt_Color(surface_get_texture(_source).WebGLTexture.webgl_textureid, 
                 _dx,dy1, 
                 _dx+_w,dy1,
                 _dx+_w,dy2,
                 _dx,dy2,
                 
                 u*_x,v*y1,
                 u*(_x+_w),v*y2,
                 
                 0xffffffff,0xffffffff,0xffffffff,0xffffffff
                 );
    g_webGL.FlushAll();
    
    surface_reset_target_RELEASE();

    g_webGL.RSMan.RestoreStates();
    g_webGL.FlushAll();


}


// #############################################################################################
/// Function:<summary>
///             CAdds an area of the screen as a next subimage to the sprite with index ind. 
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
///				
// #############################################################################################
function WebGL_sprite_add_from_screen_RELEASE(_ind, _x, _y, _w, _h, _removeback, _smooth) {

    MissingFunction("sprite_add_from_screen() (WebGL)");
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Creates a background by copying the given area from the surface with the given id. 
///             removeback indicates whether to make all pixels with the background color (left-bottom pixel) 
///             transparent. smooth indicates whether to smooth the boundaries. This function 
///             makes it possible to create any background you want. Draw the image on the surface 
///             using the drawing functions and next create a background from it. Note that alpha 
///             values are maintained in the background.
///          </summary>
// #############################################################################################
function WebGL_background_create_from_surface_RELEASE(_id,_x,_y,_w,_h,_removeback,_smooth) {

    var pSurf = g_Surfaces.Get(_id);
    if (pSurf != null)
    {	  
        if (pSurf.FrameBufferData.Texture.Format != eTextureFormat_A8R8G8B8)
        {
            debug("Surface " + yyGetInt32(_id) + " can't be used as a background source as it uses unsupported format " + g_webGL.GetSurfaceFormatName(pSurf.FrameBufferData.Texture.Format));
            return -1;
        }

        // Clamp coordinates
        _x = ~~_x;
        _y = ~~_y;
        _w = ~~_w;
        _h = ~~_h;	    	    
        
        // Generate an image to hang the texture off (not sure if this is entirely necessary)
        var singleimage = document.createElement(g_CanvasName);
        var pGraphics = singleimage.getContext('2d');
        Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
		
        var glTexture = g_webGL.CreateTextureFromFramebuffer(singleimage, pSurf.FrameBuffer, _x, _y, _w, _h, _removeback, _smooth);        
        
        // Create a texture page entry.
        var pTPE = new yyTPageEntry();	
        pTPE.x = 0;
        pTPE.y = 0;
        pTPE.w = glTexture.Width;
        pTPE.h = glTexture.Height;
        pTPE.XOffset = 0;
        pTPE.YOffset = 0;
        pTPE.CropWidth = pTPE.w;
        pTPE.CropHeight = pTPE.h;
        pTPE.ow = _w;
        pTPE.oh = _h;
        pTPE.tp = Graphics_AddImage(singleimage);
        pTPE.texture = g_Textures[pTPE.tp];
        pTPE.texture.webgl_textureid = glTexture;
        pTPE.texture.m_Width = singleimage.width;
        pTPE.texture.m_Height = singleimage.height;
        pTPE.texture.complete = true;
            
        var pNew = new yyBackgroundImage();
        pNew.TPEntry = pTPE;
            
        return g_pBackgroundManager.AddBackgroundImage(pNew);
    }
    debug("Surface " + _id + " does not exist");
    return -1;    
}


// #############################################################################################
/// Function:<summary>
///             Creates a background by copying the given area from the screen. removeback indicates 
///             whether to make all pixels with the background color (left-bottom pixel) transparent. 
///             smooth indicates whether to smooth the boundaries. This function makes it possible to 
///             create any background you want. Draw the image on the screen using the drawing functions 
///             and next create a background from it. (If you don't do this in the drawing event you 
///             can even do it in such a way that it is not visible on the screen by not refreshing 
///             the screen.) The function returns the index of the new background. A work of caution 
///             is required here. Even though we speak about the screen, it is actually the drawing 
///             region that matters. The fact that there is a window on the screen and that the image
///             might be scaled in this window does not matter.
///          </summary>
///
/// In:		 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_background_create_from_screen_RELEASE(_x,_y,_w,_h,_removeback,_smooth) {

    _x = ~~_x;
    _y = ~~_y;	
    
    // Generate an image to hang the texture off (not sure if this is entirely necessary)    
    var singleimage = document.createElement(g_CanvasName);
    var pGraphics = singleimage.getContext('2d');
    Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
		
    var glTexture = g_webGL.CreateTextureFromScreen(singleimage, _x, _y, _w, _h, _removeback, _smooth, (g_RenderTargetActive > 0));
    
    // Create a texture page entry.
    var pTPE = new yyTPageEntry();	
    pTPE.x = 0;
    pTPE.y = 0;
    pTPE.w = glTexture.Width;
    pTPE.h = glTexture.Height;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = _w;
    pTPE.oh = _h;		    
    pTPE.tp = Graphics_AddImage(singleimage);
    pTPE.texture = g_Textures[pTPE.tp];
    pTPE.texture.webgl_textureid = glTexture;
    pTPE.texture.width = _w;
    pTPE.texture.height = _h;
    pTPE.texture.m_Width = _w;
    pTPE.texture.m_Height = _h;    
    pTPE.texture.complete = true;
        
    var pNew = new yyBackgroundImage();
    pNew.TPEntry = pTPE;
        
    return g_pBackgroundManager.AddBackgroundImage(pNew);
}

// #############################################################################################
/// Function:<summary>
///             Creates a sprite by copying the given area from the surface with the given id
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="w"></param>
///			 <param name="h"></param>
///			 <param name="removeback"></param>
///			 <param name="smooth"></param>
///			 <param name="xorig"></param>
///			 <param name="yorig"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_sprite_create_from_surface_RELEASE(_id, _x, _y, _w, _h, _removeback, _smooth, _xorig, _yorig) {

    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (pSurf != null)
    {	    	
        if (pSurf.FrameBufferData.Texture.Format != eTextureFormat_A8R8G8B8)
        {
            debug("Surface " + yyGetInt32(_id) + " can't be used as a sprite source as it uses unsupported format " + g_webGL.GetSurfaceFormatName(pSurf.FrameBufferData.Texture.Format));
            return -1;
        }

        // Clamp coordinates
        _x = yyGetInt32(_x);
        _y = yyGetInt32(_y);
        _w = yyGetInt32(_w);
        _h = yyGetInt32(_h);

        _removeback = yyGetBool(_removeback);
        _smooth = yyGetBool(_smooth);
        _xorig = yyGetInt32(_xorig);
        _yorig = yyGetInt32(_yorig);
        
        // Generate an image to hang the texture off (not sure if this is entirely necessary)
        var singleimage = document.createElement(g_CanvasName);
        var pGraphics = singleimage.getContext('2d');
        Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
        
        var glTexture = g_webGL.CreateTextureFromFramebuffer(singleimage, pSurf.FrameBuffer, _x, _y, _w, _h, _removeback, _smooth);
        
        // Create a texture page entry.
        var pTPE = new yyTPageEntry();        
        pTPE.x = 0;
        pTPE.y = 0;
        pTPE.w = glTexture.Width;
        pTPE.h = glTexture.Height;
        pTPE.XOffset = 0;
        pTPE.YOffset = 0;
        pTPE.CropWidth = pTPE.w;
        pTPE.CropHeight = pTPE.h;
        pTPE.ow = _w;
        pTPE.oh = _h;                
        pTPE.tp = Graphics_AddImage(singleimage);	    
        pTPE.texture = g_Textures[pTPE.tp];
        pTPE.texture.webgl_textureid = glTexture;
        pTPE.texture.m_Width = singleimage.width;
        pTPE.texture.m_Height = singleimage.height;
        pTPE.texture.complete = true;

	    // Create a new sprite
        var pNewSpr = new yySprite();                
        pNewSpr.pName = "surface.copy";
        pNewSpr.width = _w;
        pNewSpr.height = _h;
        pNewSpr.bbox = new YYRECT();
        pNewSpr.bbox.right = pNewSpr.width;
        pNewSpr.bbox.bottom = pNewSpr.height;
        pNewSpr.transparent = true;
        pNewSpr.smooth = true;
        pNewSpr.preload = true;
        pNewSpr.bboxmode = 0;
        pNewSpr.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
        pNewSpr.xOrigin = _xorig;
        pNewSpr.yOrigin = _yorig;
        pNewSpr.copy = true;
        pNewSpr.numb = 1;
        pNewSpr.cullRadius = 0;
        pNewSpr.maskcreated = false;
        pNewSpr.sepmasks = false;
        pNewSpr.colmask = [];    					    // Mask used for precise collision checking
        pNewSpr.ppTPE = []; 							// pointer to TPageEntry        
        pNewSpr.Masks = [];                             // Masks
        pNewSpr.CalcCullRadius();
        pNewSpr.ppTPE[0] = pTPE;

        var newindex = g_pSpriteManager.AddSprite(pNewSpr);
        return newindex;
    }
    debug("Surface " + yyGetInt32(_id) + " does not exist");
    return -1;
}



// #############################################################################################
/// Function:<summary>
///             Adds an area of the surface id as a next subimage to the sprite with index ind
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_id"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WebGL_sprite_add_from_surface_RELEASE(_ind, _id, _x, _y, _w, _h, _removeback, _smooth)
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (pSurf != null)
    {
        if (pSurf.FrameBufferData.Texture.Format != eTextureFormat_A8R8G8B8)
        {
            debug("Surface " + yyGetInt32(_id) + " can't be used as a sprite source as it uses unsupported format " + g_webGL.GetSurfaceFormatName(pSurf.FrameBufferData.Texture.Format));
            return -1;
        }

        _ind = yyGetInt32(_ind);

        // Clamp coordinates
        _x = yyGetInt32(_x);
        _y = yyGetInt32(_y);
        _w = yyGetInt32(_w);
        _h = yyGetInt32(_h);

        _removeback = yyGetBool(_removeback);
        _smooth = yyGetBool(_smooth);
        
        // Generate an image to hang the texture off
	    var singleimage = document.createElement(g_CanvasName);
        var pGraphics = singleimage.getContext('2d');
        Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
        
        var glTexture = g_webGL.CreateTextureFromFramebuffer(singleimage, pSurf.FrameBuffer, _x, _y, _w, _h, _removeback, _smooth);        
		    
        // Create a New texture page entry at the end of the list
        var pTPE = new yyTPageEntry();        
        pTPE.x = 0;
        pTPE.y = 0;
        pTPE.w = _w;
        pTPE.h = _h;
        pTPE.XOffset = 0;
        pTPE.YOffset = 0;
        pTPE.CropWidth = pTPE.w;
        pTPE.CropHeight = pTPE.h;
        pTPE.ow = pTPE.w;
        pTPE.oh = pTPE.h;	    
        pTPE.tp = Graphics_AddImage(singleimage);	    
        pTPE.texture = g_Textures[pTPE.tp];
        pTPE.texture.webgl_textureid = glTexture;
        pTPE.texture.m_Width = singleimage.width;
        pTPE.texture.m_Height = singleimage.height;
        pTPE.texture.complete = true;
        
        // Get the sprite being added to
        var pSpr = g_pSpriteManager.Get(_ind);
        pSpr.ppTPE[pSpr.ppTPE.length] = pTPE;
        pSpr.numb++;

        return _ind;
    }
    debug("Surface " + yyGetInt32(_id) + " does not exist");
    return -1;
}

// #############################################################################################
/// Function:<summary>
///          	Copy the image pSrc into the ALPHA channel of pDest. Copies the image. 
///				The original image is "forgotten"
///          </summary>
///
/// In:		<param name="_pDestTPE"></param>
///			<param name="_pSrcTPE"></param>
/// Out:	<returns>
///				true for okay, false for error
///			</returns>
// #############################################################################################
function WEBGL_CopyImageToAlpha_RELEASE( _pDestTPE, _pSrcTPE )
{
	var pSourceData, pDestData;

	// Read texture data
	pSourceData = g_webGL.ExtractWebGLPixels( _pSrcTPE );
	pDestData = g_webGL.ExtractWebGLPixels( _pDestTPE );

	// Apply src to alpha
	var total = ( _pDestTPE.h * _pDestTPE.w * 4 );
	for ( var i = total - 4; i >= 0; i -= 4 )
	{
		var c = ~ ~( ( pSourceData[i] + pSourceData[i + 1] + pSourceData[i + 2] ) / 3 );
		pDestData[i + 3] = c;
	}

	// Delete the old destination sprite and recreate it with the new destination data
	var imgData = new Image();
	g_webGL.DeleteTexture( _pDestTPE.texture.webgl_textureid.Texture );
	_pDestTPE.texture.webgl_textureid = g_webGL.CreateTextureFromDataRGBA( imgData, pDestData, _pDestTPE.w, _pDestTPE.h );
	return true;
}


// #############################################################################################
/// Function:<summary>
///          	This function draws the grid with green cells being free and red cells being 
///             forbidden. This function is slow and only provided as a debug tool.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WEBGL_mp_grid_draw(_id) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
    if (mp)
    {
	    var pBuff, stride, index, curr, colcurr, pCoords, pColours, pUVs,_x1,_y1,_x2,_y2;

	    var red = ~~((g_GlobalAlpha * 255.0) << 24) | 0x0000ff;
	    var green = ~~((g_GlobalAlpha * 255.0) << 24) | 0x00ff00;
	    var count = 6 * (mp.m_vcells * mp.m_hcells);	    

	    // Find a buffer with enough space for our verts.
	    pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, null, g_webGL.VERTEX_FORMAT_2D, count);
	    stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	    
	    index = stride * pBuff.Current; 
	    colcurr = pBuff.Current;
	    pBuff.Current += count;        

        // Don't care about UV's as it's using a solid white texture... so whatever is there is good
	    var pCoords = pBuff.Coords;
	    var pColours = pBuff.Colours;

	    for (var y = 0; y < mp.m_vcells; y++)
	    {
		    for (var x = 0; x < mp.m_hcells; x++, index += stride * 6)
		    {
			    var col = green;			    
			    var v0 = index,
                    v1 = v0 + stride,
                    v2 = v1 + stride,
                    v3 = v2 + stride,
                    v4 = v3 + stride,
                    v5 = v4 + stride;
			    
			    if (mp.m_cells[(mp.m_vcells * x) + y] < 0) col = red;

			    _x1 = ~~(mp.m_left + x * mp.m_cellw);
			    _y1 = ~~(mp.m_top + y * mp.m_cellh);
			    _x2 = _x1 +  mp.m_cellw;
			    _y2 = _y1 +  mp.m_cellh;
			    
			    // Solid fill, 2 triangles
			    pCoords[v5 + 0] = pCoords[v4 + 0] = pCoords[v0 + 0] = _x1;
			    pCoords[v5 + 1] = pCoords[v1 + 1] = pCoords[v0 + 1] = _y1;
			    
			    pCoords[v3 + 0] = pCoords[v2 + 0] = pCoords[v1 + 0] = _x2;
			    pCoords[v4 + 1] = pCoords[v3 + 1] = pCoords[v2 + 1] = _y2;
			    
			    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = 
			        pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
			    
			    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;			    
		    }
	    }
	    return;
    }
    yyError("Error: invalid mp_grid ID (mp_grid_draw)");
}



// #############################################################################################
/// Function:<summary>
///             Draw a path.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_absolute"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function WEBGL_draw_path(_id, _xoff, _yoff, _absolute) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_id)];
    if (!pPath) return;

    _xoff = yyGetInt32(_xoff);
    _yoff = yyGetInt32(_yoff);
    _absolute = yyGetBool(_absolute);

    var pBuff, currVert, pCoords, pColours, pUVs, stride;
    var col = ~ ~((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0xffffff);



    //graphics.globalAlpha = g_GlobalAlpha;
    //graphics.strokeStyle = g_GlobalColour_HTML_RGBA;

    var xx, yy, sp;
    var maxsteps = 0;

    var pPos = pPath.GetPosition(0);
    if (!_absolute)
    {
	    _xoff = _xoff - pPos.x;
	    _yoff = _yoff - pPos.y;
    } else
    {
	    _xoff = 0;
	    _yoff = 0;
    }

    maxsteps = Round(pPath.length / 4.0);
    if (maxsteps == 0) return;


    //_outline = false;
    var count = maxsteps*2;

    // Find a buffer with enough space for our verts.
    pBuff = g_webGL.AllocVerts(yyGL.PRIM_LINE, null, g_webGL.VERTEX_FORMAT_2D, count);
    stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                                
	currVert = stride * pBuff.Current;
	pBuff.Current += count;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;    

    for (var i = 0; i < maxsteps; i++)
    {
	    pPos = pPath.GetPosition(i / maxsteps);
	    var _x1 = ~~(_xoff + pPos.x);
	    var _y1 = ~~(_yoff + pPos.y);	    

	    pColours[currVert + 0] = col;
	    pCoords[currVert + 0] = _x1;
	    pCoords[currVert + 1] = _y1;
	    pCoords[currVert + 2] = GR_Depth;
	    currVert += stride;
	    
	    pPos = pPath.GetPosition((i+1) / maxsteps);
	    var _x2 = ~ ~(_xoff + pPos.x);
	    var _y2 = ~ ~(_yoff + pPos.y);
	    
	    pColours[currVert + 0] = col;	    
	    pCoords[currVert + 0] = _x2;
	    pCoords[currVert + 1] = _y2;
	    pCoords[currVert + 2] = GR_Depth;
	    currVert += stride;	    
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WEBGL_DrawComment_RELEASE(_text) {

    g_webGL.DrawComment(_text);    
}


// #############################################################################################
/// Function:<summary>
///          	Indicates what blend mode to use for both the source and destination color. 
///				The new color is some factor times the source and another factor times the destination. 
///				These factors are set with this function. To understand this, the source and destination 
///				both have a red, green, blue, and alpha component. So the source is (Rs, Gs, Bs, As) and 
///				the destination is (Rd, Gd, Bd, Ad). All are considered to lie between 0 and 1. 
///          </summary>
///
/// In:		<param name="src"></param>
///			<param name="dest"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WEBGL_draw_set_blend_mode_ext_RELEASE(_src, _dest) {

    GR_BlendSrc = _src;
    GR_BlendDest = _dest;
    g_webGL.SetBlendMode(GR_BlendSrc, GR_BlendDest);    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WEBGL_draw_enable_alpha_blend_RELEASE( _enableAlphaBlend )
{
    if( _enableAlphaBlend )
    {
        draw_set_blend_mode( 0 ); //=bm_normal
    }
    else
    {
        draw_set_blend_mode_ext( eBlend_One, eBlend_Zero );
    }
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_get_texel_width_RELEASE(_tex) {    

    if (_tex) {
        return 1.0 / _tex.WebGLTexture.width;
    }
    return 1.0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_get_texel_height_RELEASE(_tex) {
    if (_tex) {
        return 1.0 / _tex.WebGLTexture.height;
    }
    return 1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_set_stage_RELEASE(_stage, _texture) {

    g_webGL.SetTexture(yyGetInt32(_stage), _texture.WebGLTexture.webgl_textureid);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_shader_is_compiled_RELEASE(_shaderIndex) {

    _shaderIndex = yyGetInt32(_shaderIndex);
    if (g_shaderPrograms[_shaderIndex] && g_shaderPrograms[_shaderIndex].program) {
        return 1;
    }
    return 0;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_shader_set_RELEASE(_shaderIndex) {

    _shaderIndex = yyGetInt32(_shaderIndex);
    var shaderProgram = (_shaderIndex == -1) ? WebGL_GetDefaultShader() : g_shaderPrograms[_shaderIndex].program;
    if (shaderProgram) {
        g_webGL.SetShader(shaderProgram);
    }
}


function WebGL_shader_get_name_RELEASE(_shaderIndex) {
    _shaderIndex = yyGetInt32(_shaderIndex);
    var shaderProgram = (_shaderIndex == -1) ? WebGL_GetDefaultShader() : g_shaderPrograms[_shaderIndex].program;
    if (shaderProgram) {
        return shaderProgram.name;
    }
    return "";
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_shader_get_uniform_RELEASE(_shaderIndex, _constName) {

    _shaderIndex = yyGetInt32(_shaderIndex);
    var shaderProgram = (_shaderIndex == -1) ? WebGL_GetDefaultShader() : g_shaderPrograms[_shaderIndex].program;
    if (shaderProgram) {    
        return g_webGL.GetUniformIndex(g_shaderPrograms[_shaderIndex].program, yyGetString(_constName));        
    }
    return undefined;
}

// #############################################################################################
/// Function:<summary>
///             int _handle, int _dims, int _count, int* _vals
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_i_RELEASE(_handle, _shaderData) {

    _handle = yyGetInt32(_handle);
    if (_handle!=-1) {
        g_webGL.SetUniformI(_handle, _shaderData);
    }
}

// #############################################################################################
/// Function:<summary>
///             int _handle, int _dims, int _count, int* _vals
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_f_RELEASE(_handle, _shaderData) {

    _handle = yyGetInt32(_handle);
    if (_handle != -1) {
        g_webGL.SetUniformF(_handle, _shaderData);
    }
}

// #############################################################################################
/// Function:<summary>
///             int _handle, int _dims, int _count, int* _vals
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_matrix_RELEASE(_handle, _shaderData) {

    _handle = yyGetInt32(_handle);
    if (_handle != -1) {
        var mo = WebGL_GetMatrix(MATRIX_WORLD);        
        g_webGL.SetUniformMatrix(_handle, new Float32Array(mo.m));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_shader_get_sampler_index_RELEASE(_shaderIndex, _texture) {

    _shaderIndex = yyGetInt32(_shaderIndex);
    if (g_shaderPrograms[_shaderIndex]) {
    
        var shaderProgram = g_shaderPrograms[_shaderIndex];        
        if (shaderProgram) {            
            for (var i = 0; i < shaderProgram.texture_stages.length; i++) {
            
                if (shaderProgram.texture_stages[i] == _texture) {
                    return Number(i);
                }
            }
        }
    }
    return 0;
}

// #############################################################################################
/// Function:<summary>
///             Set whether or not corners should be demarked for shaders
///          </summary>
// #############################################################################################
function WebGL_shader_enable_corner_id_RELEASE(_on_off) {

    GR_MarkVertCorners = yyGetBool(_on_off);
}


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_i_array_RELEASE(_handle, _array)
{
    if (_array instanceof Array){
        g_webGL.SetUniformArrayI(yyGetInt32(_handle), _array);
    }
    else {
        alert('ERROR: shader_set_uniform_i_array() Data is not an array');
    }
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_f_array_RELEASE(_handle, _array)
{
    if (_array instanceof Array){
        g_webGL.SetUniformArrayF(yyGetInt32(_handle), _array);
    }
    else {
        alert('ERROR: shader_set_uniform_f_array() Data is not an array');
    }
}

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_f_buffer_RELEASE(_handle, _buffer, _offset, _count)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));

    if (!pBuff) {
        alert('ERROR: shader_set_uniform_f_buffer() Data is not a buffer');
        return;
    }

    _offset = yyGetInt32(_offset);
    if (_offset < 0) {
        alert('ERROR: shader_set_uniform_f_buffer() Invalid offset ' + _offset);
        return;
    }

    _count = yyGetInt32(_count);
    if (_count <= 0 || ((_offset + _count * 4) > pBuff.m_Size)) {
        alert('ERROR: shader_set_uniform_f_buffer() Invalid count ' + _count
            + '. Trying to read outside of the buffer.');
        return;
    }

    var _array = new Array(_count);
    for (var i = 0; i < _count; ++i) {
        _array[i] = pBuff.yyb_peek(eBuffer_F32, _offset);
        _offset += 4;
    }

    g_webGL.SetUniformArrayF(yyGetInt32(_handle), _array);
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_shader_set_uniform_matrix_array_RELEASE(_handle, _array) {

    if (_array instanceof Array) {        
    
        var shaderData = new Float32Array(_array);
        g_webGL.SetUniformMatrix(yyGetInt32(_handle), shaderData);
    }
    else {
        alert('ERROR: shader_set_uniform_matrix_array() Data is not an array');
    }
}


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_texture_set_blending_RELEASE(_blend) {
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_texture_set_repeat_RELEASE(_rep) {
        
    var textureStages = g_webGL.GetMaxTextureStages();
    for (var stage = 0; stage < textureStages; stage++) {
        texture_set_repeat_ext(stage, _rep);
    }
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_texture_set_repeat_ext_RELEASE(_stage, _rep) {
    
    GR_TextureRepeat[_stage] = _rep ? true : false;
    g_webGL.SetTextureWrap(_stage, GR_TextureRepeat[_stage]);
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function WebGL_texture_set_interpolation_RELEASE(_linear) {
    
    var textureStages = g_webGL.GetMaxTextureStages();
    for (var stage = 0; stage < textureStages; stage++) {        
        texture_set_interpolation_ext(stage, _linear);
    }    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_set_interpolation_ext_RELEASE(_stage, _linear) {
    
    g_webGL.SetTextureFiltering(_stage, _linear ? yyGL.Filter_LinearFiltering : yyGL.Filter_PointFiltering);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_get_repeat_RELEASE() {

    return GR_TextureRepeat[0];
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_get_width_RELEASE(_tex) {
    
    // C++ runner has proviso for a multiply by wt
    if (typeof(_tex) == "object") {
        return 1.0;
    }
    else if ((yyGetInt32(_tex) != -1) && g_Textures[yyGetInt32(_tex)]) {
        return 1.0;
    } 
    return 0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_texture_get_height_RELEASE(_tex) {

    // C++ runner has proviso for a multiply by wt
    if (typeof(_tex) == "object") {
        return 1.0;
    }
    else if ((yyGetInt32(_tex) != -1) && g_Textures[yyGetInt32(_tex)]) {
        return 1.0;
    }
    return 0;
}



// #############################################################################################
/// Function:<summary>
///                 Get the UVs from a texture (gotten from a sprite_get_texture, font_get_texture etc)
///          </summary>
/// In:      <param name="_tex ">{ WebGLTexture: pTPE.texture, TPE: pTPE }</param>
/// Out:     <returns>
///             Array holding topleft, bottom right
///          </returns>
// #############################################################################################
function WebGL_texture_get_uvs_RELEASE(_tex) {

    if ((_tex == -1) || (_tex === undefined)) return [0, 0, 1, 1];
    
    var pTPE = _tex.TPE;
    var texture = pTPE.texture;
    if (pTPE === undefined || texture===undefined) return [0,0,1,1];
	    
    
    var oneTexelW = 1.0 / texture.width;
    var oneTexelH = 1.0 / texture.height;
	    
    var arrayData = [];
    arrayData.push(pTPE.x*oneTexelW, pTPE.y*oneTexelH, (pTPE.x+pTPE.CropWidth)*oneTexelW, (pTPE.y+pTPE.CropHeight)*oneTexelH);
	    
    return arrayData;

}


// #############################################################################################
/// Function:<summary>
///             Unless WebGL overrides this, no, shaders are not supported
///          </summary>
// #############################################################################################
function WebGL_shaders_are_supported_RELEASE() {
    return 1;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_set_alpha_test_RELEASE(_enable) {

    GR_AlphaTestEnabled = (_enable > 0.5) ? true : false;    
    g_webGL.SetAlphaTest(GR_AlphaTestEnabled, GR_AlphaTestRefValue);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_set_alpha_test_ref_value_RELEASE(_value) {
 
    GR_AlphaTestRefValue = _value / 255.0;
    g_webGL.SetAlphaTest(GR_AlphaTestEnabled, GR_AlphaTestRefValue);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_get_alpha_test_RELEASE() {

    return (GR_AlphaTestEnabled ? 1.0 : 0.0);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_get_alpha_test_ref_value_RELEASE() {

    return GR_AlphaTestRefValue;
}



// #############################################################################################
/// Function:<summary>
///             Setting global matrices
///          </summary>
// #############################################################################################
function WebGL_SetMatrix(_type, _matrix) {

    // Assume a sensible index and matrix (won't break it if not, but it'd be wasteful)
    g_Matrix[_type] = new Matrix(_matrix);

    DirtyRoomExtents();

    g_ViewFrustumDirty |= (_type == MATRIX_VIEW || _type == MATRIX_PROJECTION);

    if(g_webGL==null)
        return;
    switch (_type) {
        case MATRIX_PROJECTION:
            g_webGL.SetProjectionMatrix(g_Matrix[_type]);
         //  g_webGL.SetCullOrder((g_RenderTargetActive < 0) ? yyGL.Cull_CCW : yyGL.Cull_CW);
            break;

        case MATRIX_VIEW:
            g_webGL.SetViewMatrix(g_Matrix[_type]);
            break;

        case MATRIX_WORLD:
            g_webGL.SetWorldMatrix(g_Matrix[_type]);
            break;
    }
    g_webGL.Flush(); 
}

// #############################################################################################
/// Function:<summary>
///             Get the given global matrix object (take care...)
///          </summary>
// #############################################################################################
function WebGL_GetMatrix(_type) {

    switch (_type) {
        case MATRIX_PROJECTION:
        case MATRIX_VIEW:
        case MATRIX_WORLD:
            return g_Matrix[_type];
            break;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Setup any shaders stored in the game file
///          </summary>
// #############################################################################################
function SetupProprietaryShaders() {

    if (g_pGMFile.Shaders) {
    
        for (var i = 0; i < g_pGMFile.Shaders.length; i++)
        {
            var shader = g_pGMFile.Shaders[i];
            g_shaderPrograms[i] = g_webGL.AddShader(shader.Vertex, shader.Fragment, shader.Attributes);

            if (g_shaderPrograms[i].program == null)
            {
                debug("Shader " + shader.name + " can't be compiled. Please check the shader for errors");
            }
        }
    }
    return true;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_set_color_RELEASE( _colour )
{
    g_GlobalColour_GM = _colour;
    g_GlobalColour = ConvertGMColour(_colour);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_BindTexture( _pTPE )
{
    if (!_pTPE.texture.webgl_textureid) 
    {
        var glTexture = g_webGL.CreateTexture(_pTPE.texture);        
        _pTPE.texture.webgl_textureid = glTexture;
	    _pTPE.texture.m_Width = _pTPE.texture.width;
	    _pTPE.texture.m_Height = _pTPE.texture.height;
	}
}

function WebGL_RecreateTexture(_tex, _mipoptions)
{
    if (_tex.Texture)
        return;     // texture already exists
    
    if (_mipoptions === yyGL.MipEnable_On 
        || ((_mipoptions === yyGL.MipEnable_OnlyMarked) && (_tex.Image.m_mipsToGenerate !== undefined && _tex.Image.m_mipsToGenerate !== 0))
        )
    {
        _tex.Flags |= (eInternalTextureFlags.SupportsMips | eInternalTextureFlags.GenerateMips);
    }

    g_webGL.RecreateTexture(_tex, _mipoptions);
    TextureDebugReady(_tex);
}

function WebGL_FlushTexture(_tex, _mipoptions)
{
    if (_tex.Texture)
    {
        g_webGL.DeleteTexture(_tex.Texture);
        _tex.Texture = undefined;

        _tex.Flags &= ~eInternalTextureFlags.HasMips;

        TextureDebugFlushed(_tex);
    }
}

function WebGL_DrawTextureFlush()
{
    g_webGL.FlushAll();
    
    var numtextures = g_Textures.length;
    var i;

    for(i = 0; i < numtextures; i++)
    {
        if (g_Textures[i])
        {
            if (g_Textures[i].webgl_textureid)
            {                
                WebGL_FlushTexture(g_Textures[i].webgl_textureid);
            }
        }
    }    
}

function WebGL_IsTextureValid(_tex, _mipoptions)
{
    if (_tex.Texture != undefined)
    {
        var valid = true;

        if (_mipoptions !== yyGL.MipEnable_DontCare
            && (((_mipoptions == yyGL.MipEnable_On) && (((_tex.Flags & eInternalTextureFlags.HasMips) == 0) && ((_tex.Flags & eInternalTextureFlags.SupportsMips) != 0)))
			|| (((_mipoptions == yyGL.MipEnable_Off) && ((_tex.Flags & eInternalTextureFlags.HasMips) != 0)))
			|| (((_mipoptions == yyGL.MipEnable_OnlyMarked) && (((_tex.Flags & eInternalTextureFlags.GenerateMips) && ((_tex.Flags & eInternalTextureFlags.HasMips) == 0)) || (((_tex.Flags & eInternalTextureFlags.GenerateMips) == 0) && ((_tex.Flags & eInternalTextureFlags.HasMips) != 0))))))
		)
        {
            valid = false;
        }

        return valid;
    }
    else
    {
        return false;
    }
}





// #############################################################################################
/// Function:<summary>
///          	Get a surface (CANVAS) into a buffer
///          </summary>
///
/// In:		<param name="_buffer">Buffer to copy into</param>
/// In:		<param name="_surface">Surface we're copying from</param>
///			<param name="_mode">image processin mode 0=copy</param>
///			<param name="_offset">offset into buffer</param>
///			<param name="_modulo">line modulo</param>
///				
// #############################################################################################
function WEBGL_buffer_get_surface(_buffer, _surface, _mode, _offset, _modulo) {
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));
    var pSurf = g_Surfaces.Get(yyGetInt32(_surface));
    if (!pBuff || !pSurf) return false;
    if(_offset === undefined) _offset = 0;

    // Get RAW buffer
    var pixels = g_webGL.GetRectFromFramebuffer(pSurf.FrameBuffer, 0, 0, pSurf.m_Width, pSurf.m_Height, pSurf.FrameBufferData.Texture.Format);
   
    // Resize buffer if required and valid to do so
    if(pBuff.m_Type == eBuffer_Format_Grow && _offset + pixels.length > pBuff.m_Size)
    {
        pBuff.yyb_resize(_offset + pixels.length);
    }

    for (var i = 0; i < pixels.length; i++) {
        pBuff.yyb_poke(eBuffer_U8, i, pixels[i]);
    }

    pixels = null;      // free Uint8Array[]
}

// #############################################################################################
/// Function:<summary>
///          	Get a surface (CANVAS) into a buffer
///          </summary>
///
/// In:		<param name="_buffer">Buffer to copy into</param>
/// In:		<param name="_surface">Surface we're copying from</param>
///			<param name="_mode">image processin mode 0=copy</param>
///			<param name="_offset">offset into buffer</param>
///			<param name="modulo">line modulo</param>
///				
// #############################################################################################
function WEBGL_buffer_set_surface(_buffer, _surface, _mode, _offset, _modulo) {
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));
    var pSurf = g_Surfaces.Get(yyGetInt32(_surface));
    if (!pBuff || !pSurf) return false;


    //var frameBufferData = g_webGL.CreateFramebuffer(_w, _h);
    //_pTPE.FrameBufferData = frameBufferData;
    //_pTPE.FrameBuffer = frameBufferData.FrameBuffer;
    //_pTPE.texture.webgl_textureid = frameBufferData.Texture;

    var data = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);
    WebGL_UpdateTexture_RELEASE(pSurf.texture.webgl_textureid, 0, 0, pSurf.m_Width,pSurf.m_Height, data, pSurf.FrameBufferData.Texture.Format);
    
    data = null;      // free Uint8Array[]
}

