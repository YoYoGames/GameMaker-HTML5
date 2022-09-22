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

function draw_primitive_begin(kind)                                         { ErrorFunction("draw_primitive_begin()"); }
function draw_primitive_begin_texture(kind, texid)                          { ErrorFunction("draw_primitive_begin_texture()"); }
function draw_vertex(x,y)                                                   { ErrorFunction("draw_vertex()"); }
function draw_vertex_color(x,y,col,alpha)                                   { ErrorFunction("draw_vertex_color()"); }
var draw_vertex_colour = draw_vertex_color;
function draw_vertex_texture(x,y,xtex,ytex)                                 { ErrorFunction("draw_vertex_texture()"); }
function draw_vertex_texture_color(x,y,xtex,ytex,col,alpha)                 { ErrorFunction("draw_vertex_texture_color()"); }
var draw_vertex_texture_colour = draw_vertex_texture_color;
function draw_primitive_end()                                               { ErrorFunction("draw_primitive_end()"); }

function d3d_primitive_begin(kind)                                          { ErrorFunction("d3d_primitive_begin()"); }
function d3d_primitive_begin_texture(kind,texid)                            { ErrorFunction("d3d_primitive_begin_texture()"); }
function d3d_vertex(x,y,z)                                                  { ErrorFunction("d3d_vertex()"); }
function d3d_vertex_color(x,y,z,col,alpha)                                  { ErrorFunction("d3d_vertex_color()"); }
var d3d_vertex_colour = d3d_vertex_color;
function d3d_vertex_texture(x,y,z,xtex,ytex)                                { ErrorFunction("d3d_vertex_texture()"); }
function d3d_vertex_texture_color(x,y,z,xtex,ytex,col,alpha)                { ErrorFunction("d3d_vertex_texture_color()"); }
var d3d_vertex_texture_colour = d3d_vertex_texture_color;
function d3d_vertex_normal(x,y,z,nx,ny,nz)                                  { ErrorFunction("d3d_vertex_normal()"); }
function d3d_vertex_normal_color(x,y,z,nx,ny,nz,col,alpha)                  { ErrorFunction("d3d_vertex_normal_color()"); }
var d3d_vertex_normal_colour = d3d_vertex_normal_color;
function d3d_vertex_normal_texture(x,y,z,nx,ny,nz,xtex,ytex)                { ErrorFunction("d3d_vertex_normal_texture()"); }
function d3d_vertex_normal_texture_color(x,y,z,nx,ny,nz,xtex,ytex,col,alpha){ ErrorFunction("d3d_vertex_normal_texture_color()"); }
var d3d_vertex_normal_texture_colour = d3d_vertex_normal_texture_color;
function d3d_primitive_end()                                                { ErrorFunction("d3d_primitive_end()"); }

// ----------------------------------------------------------------------------------------------------------------------------------------
var g_PrimBuffer = null; // raw ArrayBuffer data

var g_PrimType = 0,    
    g_PrimTexture = -1,    
    g_PrimTPE = null,    
    g_PrimVBuffer = null;

var PrimType_POINTLIST = 1,
	PrimType_LINELIST = 2,
	PrimType_LINESTRIP	= 3,
	PrimType_TRILIST = 4,
	PrimType_TRISTRIP = 5,
	PrimType_TRIFAN = 6,
	PrimType_SPRITE = 7;

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
    
    // 3D primitives
    d3d_primitive_begin = WebGL_d3d_primitive_begin_RELEASE;
    d3d_primitive_begin_texture = WebGL_d3d_primitive_begin_texture_RELEASE;
    d3d_vertex = WebGL_d3d_vertex_RELEASE;
    d3d_vertex_color = WebGL_d3d_vertex_color_RELEASE;
    d3d_vertex_colour = WebGL_d3d_vertex_color_RELEASE;
    d3d_vertex_texture = WebGL_d3d_vertex_texture_RELEASE;
    d3d_vertex_texture_color = WebGL_d3d_vertex_texture_color_RELEASE;
    d3d_vertex_texture_colour = WebGL_d3d_vertex_texture_color_RELEASE;
    d3d_vertex_normal = WebGL_d3d_vertex_normal_RELEASE;
    d3d_vertex_normal_color = WebGL_d3d_vertex_normal_color_RELEASE;
    d3d_vertex_normal_colour = WebGL_d3d_vertex_normal_color_RELEASE;
    d3d_vertex_normal_texture = WebGL_d3d_vertex_normal_texture_RELEASE;
    d3d_vertex_normal_texture_color = WebGL_d3d_vertex_normal_texture_color_RELEASE;
    d3d_vertex_normal_texture_colour = WebGL_d3d_vertex_normal_texture_color_RELEASE;
    d3d_primitive_end = WebGL_d3d_primitive_end_RELEASE;
}
	
// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
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
///          </summary>
// #############################################################################################
function WebGL_d3d_primitive_begin_RELEASE(kind) { 

    d3d_primitive_begin_texture(kind, -1);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_primitive_begin_texture_RELEASE(_kind, _tex) {     
        
    g_PrimType = _kind;
    g_PrimTexture = null;
    g_PrimTPE = null;
    
    // The texture provided might be an actual texture object or an index    
    if (typeof(_tex) == "object") {        
        g_PrimTexture = _tex.WebGLTexture;
        g_PrimTPE = _tex.TPE;
    }
    else if ((_tex != -1) && g_Textures[_tex]) {
        g_PrimTexture = g_Textures[_tex];
    }
    
    // If they've managed to find a path through the code without this texture being bound...
    if (g_PrimTexture && !g_PrimTexture.webgl_textureid) {
        WebGL_BindTexture({texture: g_PrimTexture});
    }
    
    g_PrimVBuffer = new yyVBuffer(DEFAULT_VB_SIZE, g_webGL.GetVertexFormat(g_webGL.VERTEX_FORMAT_3D), false);
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

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_RELEASE(_x, _y, _z) { 
    
    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = 0;
    g_PrimVBuffer.Normals[index + 1] = 0;
    g_PrimVBuffer.Normals[index + 2] = 0;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_color_RELEASE(_x, _y, _z, _col, _alpha) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = 0;
    g_PrimVBuffer.Normals[index + 1] = 0;
    g_PrimVBuffer.Normals[index + 2] = 0;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;
    g_PrimVBuffer.Colours[index] = ((_alpha * 255.0) << 24) | ConvertGMColour(_col);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_texture_RELEASE(_x, _y, _z, _xtex, _ytex) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = 0;
    g_PrimVBuffer.Normals[index + 1] = 0;
    g_PrimVBuffer.Normals[index + 2] = 0;
    var uv = vertex_uv(_xtex, _ytex);
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_texture_color_RELEASE(_x, _y, _z, _xtex, _ytex, _col, _alpha) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = 0;
    g_PrimVBuffer.Normals[index + 1] = 0;
    g_PrimVBuffer.Normals[index + 2] = 0;
    var uv = vertex_uv(_xtex, _ytex);
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((_alpha * 255.0) << 24) | ConvertGMColour(_col);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_normal_RELEASE(_x, _y, _z, _nx, _ny, _nz) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = _nx;
    g_PrimVBuffer.Normals[index + 1] = _ny;
    g_PrimVBuffer.Normals[index + 2] = _nz;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;    
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_normal_color_RELEASE(_x, _y, _z, _nx, _ny, _nz, _col, _alpha) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = _nx;
    g_PrimVBuffer.Normals[index + 1] = _ny;
    g_PrimVBuffer.Normals[index + 2] = _nz;
    g_PrimVBuffer.UVs[index + 0] = 0;
    g_PrimVBuffer.UVs[index + 1] = 0;
    g_PrimVBuffer.Colours[index] = ((_alpha * 255.0) << 24) | ConvertGMColour(_col);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_normal_texture_RELEASE(_x, _y, _z, _nx, _ny, _nz, _xtex, _ytex) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = _nx;
    g_PrimVBuffer.Normals[index + 1] = _ny;
    g_PrimVBuffer.Normals[index + 2] = _nz;
    var uv = vertex_uv(_xtex, _ytex);
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_vertex_normal_texture_color_RELEASE(_x, _y, _z, _nx, _ny, _nz, _xtex, _ytex, _col, _alpha) { 

    var stride = g_PrimVBuffer.GetStride() >> 2;
    var index = g_PrimVBuffer.Current * stride;
    g_PrimVBuffer.IncreaseCurrent(1);
    
    g_PrimVBuffer.Coords[index + 0] = _x;
    g_PrimVBuffer.Coords[index + 1] = _y;
    g_PrimVBuffer.Coords[index + 2] = _z;
    g_PrimVBuffer.Normals[index + 0] = _nx;
    g_PrimVBuffer.Normals[index + 1] = _ny;
    g_PrimVBuffer.Normals[index + 2] = _nz;
    var uv = vertex_uv(_xtex, _ytex);
    g_PrimVBuffer.UVs[index + 0] = uv.u;
    g_PrimVBuffer.UVs[index + 1] = uv.v;
    g_PrimVBuffer.Colours[index] = ((_alpha * 255.0) << 24) | ConvertGMColour(_col);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_primitive_end_RELEASE() { 

    var prim = WebGL_translate_primitive_builder_type(g_PrimType);
	if (prim == -1) {
	    return;
	}
    
    // Transfer the stored primitive block to the vbuffer manager
    var vertexData = g_PrimVBuffer.VertexData.subarray(0, g_PrimVBuffer.Current * g_PrimVBuffer.GetStride());
    
    // Alloc vertices
    var glTexture = g_PrimTexture ? g_PrimTexture.webgl_textureid : null;    
    var pBuff = g_webGL.AllocVerts(prim, glTexture, g_webGL.VERTEX_FORMAT_3D, g_PrimVBuffer.Current);
    
    pBuff.VertexData.set(vertexData, pBuff.Current * pBuff.GetStride());
    pBuff.Current += g_PrimVBuffer.Current;
}