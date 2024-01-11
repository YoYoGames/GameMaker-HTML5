// **********************************************************************************************************************
// 
// Copyright (c)2013, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyPrimBuilder.js
// Created:	        25/06/2013
// Author:    		Chris
// Project:		    HTML5
// Description:   	GameMaker HTML5 "webgl" primitive building
// 
// *********************************************************************************************************************

// @if feature("gl") && (function("draw_primitive_*") || function("draw_vertex*") || function("vertex_*"))

// primitive type translation is shared between draw_primitive_* and vertex_submit
var PrimType_POINTLIST = 1,
	PrimType_LINELIST = 2,
	PrimType_LINESTRIP	= 3,
	PrimType_TRILIST = 4,
	PrimType_TRISTRIP = 5,
	PrimType_TRIFAN = 6,
	PrimType_SPRITE = 7;

function WebGL_translate_primitive_builder_type(_prim) {
   
    switch (_prim) {
        case PrimType_POINTLIST:    return yyGL.PRIM_POINT;
	    case PrimType_LINELIST:     return yyGL.PRIM_LINE;
	    case PrimType_LINESTRIP:    return yyGL.PRIM_LINESTRIP;
	    case PrimType_TRILIST:      return yyGL.PRIM_TRIANGLE;
	    case PrimType_TRISTRIP:     return yyGL.PRIM_TRISTRIP;
	    case PrimType_TRIFAN:       return yyGL.PRIM_TRIFAN; 
	    case PrimType_SPRITE:       return yyGL.PRIM_TRIANGLE;
    }
    return -1;
}

// @endif primitives or vertex buffers on WebGL

// @if function("draw_primitive_*") || function("draw_vertex*")
var draw_primitive_begin,
    draw_primitive_begin_texture,
    draw_vertex,
    draw_vertex_color,
    draw_vertex_colour,
    draw_vertex_texture,
    draw_vertex_texture_color,
    draw_vertex_texture_colour,
    draw_primitive_end;

// @if feature("2d")
(() => {
    let _stub = (_name) => () => ErrorFunction(_name);
    draw_primitive_begin = _stub("draw_primitive_begin");
    draw_primitive_begin_texture = _stub("draw_primitive_begin_texture");
    draw_vertex = _stub("draw_vertex");
    draw_vertex_color = _stub("draw_vertex_color");
    draw_vertex_colour = draw_vertex_color;
    draw_vertex_texture = _stub("draw_vertex_texture");
    draw_vertex_texture_color = _stub("draw_vertex_texture_color");
    draw_vertex_texture_colour = draw_vertex_texture_color;
    draw_primitive_end = _stub("draw_primitive_end");
})();
// @endif 2d

// @if feature("gl")

var g_PrimType = 0,    
    g_PrimTexture = -1,    
    g_PrimTPE = null,    
    g_PrimVBuffer = null;

// #############################################################################################
/// Function:<summary>
///             Bind primitive building functions to WebGL versions
///          </summary>
// #############################################################################################
function InitPrimBuilderFunctions() { 

    draw_primitive_begin = WebGL_draw_primitive_begin_RELEASE;
    draw_primitive_begin_texture = WebGL_draw_primitive_begin_texture_RELEASE;
    draw_vertex = WebGL_draw_vertex_RELEASE;
    draw_vertex_color = WebGL_draw_vertex_color_RELEASE;
    draw_vertex_colour = WebGL_draw_vertex_color_RELEASE;
    draw_vertex_texture = WebGL_draw_vertex_texture_RELEASE;
    draw_vertex_texture_color = WebGL_draw_vertex_texture_color_RELEASE;
    draw_vertex_texture_colour = WebGL_draw_vertex_texture_color_RELEASE;
    draw_primitive_end = WebGL_draw_primitive_end_RELEASE; 
}

// #############################################################################################
/// Function:<summary>
///             Invalidate the primitive builder setup to prevent anything inadvertantly using
///             data that's been carved off elsewhere
///          </summary>
// #############################################################################################
function primitive_builder_clear() {

    g_PrimType = 0;
    g_PrimTexture = -1;
    g_PrimTPE = null;  
    g_PrimVBuffer = null;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_primitive_begin_RELEASE(_kind) {

    WebGL_draw_primitive_begin_texture_RELEASE(yyGetInt32(_kind), -1);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################   
function WebGL_draw_primitive_begin_texture_RELEASE(_kind, _tex) {  
    
    g_PrimType = yyGetInt32(_kind);    
    g_PrimTexture = null;
    g_PrimTPE = null;
    
    // The texture provided might be an actual texture object or an index    
    if (typeof(_tex) == "object") {
        g_PrimTexture = _tex.WebGLTexture;
        g_PrimTPE = _tex.TPE;
    }
    else if ((_tex != -1) && g_Textures[yyGetInt32(_tex)]) {
        g_PrimTexture = g_Textures[yyGetInt32(_tex)];
    }
    
    // If they've managed to find a path through the code without this texture being bound...
    if (g_PrimTexture && !g_PrimTexture.webgl_textureid) {
        WebGL_BindTexture({texture: g_PrimTexture});
    }
    
    g_PrimVBuffer = new yyVBuffer(DEFAULT_VB_SIZE, g_webGL.GetVertexFormat(g_webGL.VERTEX_FORMAT_2D), false);
}

// #############################################################################################
// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_vertex_RELEASE(_x, _y) {
    
    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);    
    
    g_PrimVBuffer.Coords[index + 0] = yyGetReal(_x);
    g_PrimVBuffer.Coords[index + 1] = yyGetReal(_y);
    g_PrimVBuffer.Coords[index + 2] = GR_Depth;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);    
}

// #############################################################################################
// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_vertex_color_RELEASE(_x, _y, _colour, _alpha) {

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = yyGetReal(_x);
    g_PrimVBuffer.Coords[index + 1] = yyGetReal(_y);
    g_PrimVBuffer.Coords[index + 2] = GR_Depth;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;    
    g_PrimVBuffer.Colours[index] = ((yyGetReal(_alpha) * 255.0) << 24) | ConvertGMColour(yyGetInt32(_colour));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_vertex_texture_RELEASE(_x, _y, _u, _v) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = yyGetReal(_x);
    g_PrimVBuffer.Coords[index + 1] = yyGetReal(_y);
    g_PrimVBuffer.Coords[index + 2] = GR_Depth;
    var uv = vertex_uv(yyGetReal(_u), yyGetReal(_v));
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_vertex_texture_color_RELEASE(_x, _y, _u, _v, _colour, _alpha) { 
   
    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = yyGetReal(_x);
    g_PrimVBuffer.Coords[index + 1] = yyGetReal(_y);
    g_PrimVBuffer.Coords[index + 2] = GR_Depth;
    var uv = vertex_uv(yyGetReal(_u), yyGetReal(_v));
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((yyGetReal(_alpha) * 255.0) << 24) | ConvertGMColour(yyGetInt32(_colour));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_primitive_end_RELEASE() {    

	var prim = WebGL_translate_primitive_builder_type(g_PrimType);
	if (prim == -1) {
	    return;
	}	
    
    // Transfer the stored primitive block to the vbuffer manager
    var vertexData = g_PrimVBuffer.VertexData.subarray(0, g_PrimVBuffer.Current * g_PrimVBuffer.GetStride());
    
    // Alloc vertices
    var glTexture = g_PrimTexture ? g_PrimTexture.webgl_textureid : null;    
    var pBuff = g_webGL.AllocVerts(prim, glTexture, g_webGL.VERTEX_FORMAT_2D, g_PrimVBuffer.Current);
    
    pBuff.VertexData.set(vertexData, pBuff.Current * pBuff.GetStride());
    pBuff.Current += g_PrimVBuffer.Current;    
}

// #############################################################################################
/// Function:<summary>
///             If we have a TPE available, adjust the UV accordingly
///          </summary>
// #############################################################################################
function vertex_uv(_u, _v) {

    if (g_PrimTPE && g_PrimTexture) {
        return ({ 
            u: (g_PrimTPE.x + (_u * g_PrimTPE.CropWidth)) / g_PrimTexture.m_Width, 
            v: (g_PrimTPE.y + (_v * g_PrimTPE.CropHeight)) / g_PrimTexture.m_Height 
        });
    }        
    else {
        return ({ u: _u, v: _v });
    }
};
// @endif draw_primitive GL

// @endif draw_primitive
