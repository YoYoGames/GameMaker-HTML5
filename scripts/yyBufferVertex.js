// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyBufferVertex.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// Global storage for vertex buffers
var g_vertexBuffers = [];

// @if function("vertex_*")
// #############################################################################################
//
//     Function definitions for Canvas mode
//
// #############################################################################################
var vertex_create_buffer,
    vertex_create_buffer_ext,
    vertex_delete_buffer,
    vertex_begin,
    vertex_end,
    vertex_position,
    vertex_position_3d,
    vertex_colour,
    vertex_color,
    vertex_rgba,
    vertex_argb,
    vertex_texcoord,
    vertex_normal,
    vertex_float1,
    vertex_float2,
    vertex_float3,
    vertex_float4,
    vertex_ubyte4,
    vertex_freeze,
    vertex_submit,
    vertex_get_number,
    vertex_get_buffer_size,
    vertex_create_buffer_from_buffer,
    vertex_create_buffer_from_buffer_ext,
    draw_flush;

// @if feature("2d")
(() => {
    let _stub = (_name, _val) => () => ErrorFunction(_name, _val);
    vertex_create_buffer = _stub("vertex_create_buffer", -1);
    vertex_create_buffer_ext = _stub("vertex_create_buffer_ext", -1);
    vertex_delete_buffer = _stub("vertex_delete_buffer");
    vertex_begin = _stub("vertex_begin");
    vertex_end = _stub("vertex_end");
    vertex_position = _stub("vertex_position");
    vertex_position_3d = _stub("vertex_position_3d");
    vertex_colour = _stub("vertex_colour");
    vertex_color = vertex_colour;
    vertex_rgba = _stub("vertex_rgba");
    vertex_argb = _stub("vertex_argb");
    vertex_texcoord = _stub("vertex_texcoord");
    vertex_normal = _stub("vertex_normal");
    vertex_float1 = _stub("vertex_float1");
    vertex_float2 = _stub("vertex_float2");
    vertex_float3 = _stub("vertex_float3");
    vertex_float4 = _stub("vertex_float4");
    vertex_ubyte4 = _stub("vertex_ubyte4");
    vertex_freeze = _stub("vertex_freeze");
    vertex_submit = _stub("vertex_submit");
    vertex_get_number = _stub("vertex_get_number");
    vertex_get_buffer_size = _stub("vertex_get_buffer_size");
    vertex_create_buffer_from_buffer = _stub("vertex_create_buffer_from_buffer", -1);
    vertex_create_buffer_from_buffer_ext = _stub("vertex_create_buffer_from_buffer_ext", -1);
    draw_flush = ()=>{};
})();
// @endif

// @if feature("gl")

// Constant for the default vertex buffer storage size
var DEFAULT_VERTEX_BUFFER_SIZE = 8 * 1024;

// #############################################################################################
/// Function:<summary>
///             Initialise the vertex buffer function pointers. 
///             Should only occur if WebGL is active.
///          </summary>
// #############################################################################################
function InitBufferVertexFunctions() {

    vertex_create_buffer = WebGL_vertex_create_buffer_RELEASE;
    vertex_create_buffer_ext = WebGL_vertex_create_buffer_ext_RELEASE;
    vertex_create_buffer_from_buffer = WebGL_vertex_create_buffer_from_buffer;
    vertex_create_buffer_from_buffer_ext = WebGL_vertex_create_buffer_from_buffer_ext;
    vertex_delete_buffer = WebGL_vertex_delete_buffer_RELEASE;
    vertex_begin = WebGL_vertex_begin_RELEASE;
    vertex_end = WebGL_vertex_end_RELEASE;
    vertex_position = WebGL_vertex_position_RELEASE;
    vertex_position_3d = WebGL_vertex_position_3d_RELEASE;
    vertex_colour = WebGL_vertex_colour_RELEASE;
    vertex_color = WebGL_vertex_colour_RELEASE;
    vertex_rgba = WebGL_vertex_rgba_RELEASE;
    vertex_argb = WebGL_vertex_argb_RELEASE;
    vertex_texcoord = WebGL_vertex_texcoord_RELEASE;
    vertex_normal = WebGL_vertex_normal_RELEASE;
    vertex_float1 = WebGL_vertex_float1_RELEASE;
    vertex_float2 = WebGL_vertex_float2_RELEASE;
    vertex_float3 = WebGL_vertex_float3_RELEASE;
    vertex_float4 = WebGL_vertex_float4_RELEASE;
    vertex_ubyte4 = WebGL_vertex_ubyte4_RELEASE;
    vertex_freeze = WebGL_vertex_freeze_RELEASE;
    vertex_submit = WebGL_vertex_submit_RELEASE;
    vertex_get_number = WebGL_vertex_get_number_RELEASE;
    vertex_get_buffer_size = WebGL_vertex_get_buffer_size_RELEASE;
    draw_flush = WebGL_draw_flush_RELEASE;
}


// #############################################################################################
/// Function:<summary>
///             Create a vertex buffer from an actualy buffer "EXT"
///          </summary>
/// In:		<param name="_buffer">The buffer we're using as the source</param>
/// In:		<param name="format">The vertex format we're mapping to</param>
/// In:		<param name="_src_offset">Offset into the source buffer to start reading from</param>
/// In:		<param name="_vert_num">Number of vertices we're going to use</param>
/// Out:	<returns>
///				The new vertex buffer handle or -1 for error 
///			</returns>
// #############################################################################################
function WebGL_vertex_create_buffer_from_buffer_ext(_buffer, _format, _src_offset, _vert_num)
{
    _format = yyGetInt32(_format);
    _src_offset = yyGetInt32(_src_offset);
    _vert_num = yyGetInt32(_vert_num);

    var total = 0;

    // get actual vertex format and buffer
    var VertexFormat = g_webGL.GetVertexFormat(_format);
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));
    if (!pBuff || !VertexFormat) return -1;
    

    // if no vertex count passed in, then use the whole buffer - ignoring src offset as well
    if (_vert_num == -1) {
        _src_offset = 0;
        total = pBuff.m_UsedSize;
        _vert_num = total / VertexFormat.ByteSize;
    } else {
        total = _vert_num * VertexFormat.ByteSize;
        if ((total + _src_offset) > pBuff.m_UsedSize) {         // past end of buffer?
            total = (pBuff.m_UsedSize - _src_offset);
            _vert_num = ~~(total / VertexFormat.ByteSize);      // round to nearest vertex
            total = _vert_num * VertexFormat.ByteSize;
        }
    }


    // Create the new buffer and get it's class
    var vertex_buffer_index = vertex_create_buffer_ext(total);
    var pVBuffer = g_vertexBuffers[vertex_buffer_index];

    // Now get the underlying arrays
    var srcbytebuff = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);     // src
    var dstbytebuff = new Uint8Array(pVBuffer.GetArrayBuffer());                 // dest

    // And do the actual copy
    pVBuffer.Begin(_format);
    var src = _src_offset;
    for (var i = 0; i < total; i++) {
        dstbytebuff[i] = srcbytebuff[src++];
    }
    pVBuffer.SetVertexCount(_vert_num);
    pVBuffer.End();

    // return the new vertex buffer index
    return vertex_buffer_index;

}

// #############################################################################################
/// Function:<summary>
///             Create a vertex buffer from an actualy buffer
///          </summary>
/// In:		<param name="_buffer">The buffer we're using as the source</param>
/// In:		<param name="format">The vertex format we're mapping to</param>
/// Out:	<returns>
///				The new vertex buffer handle or -1 for error 
///			</returns>
// #############################################################################################
function WebGL_vertex_create_buffer_from_buffer(_buffer, _format)
{
    return WebGL_vertex_create_buffer_from_buffer_ext(_buffer, _format, 0, -1);
}

// #############################################################################################
/// Function:<summary>
///             Create a vertex buffer using the default size
///          </summary>
/// Out:	<returns>
///				The new vertex buffer handle or -1 for error 
///			</returns>
// #############################################################################################
function WebGL_vertex_create_buffer_RELEASE() {

    return vertex_create_buffer_ext(DEFAULT_VERTEX_BUFFER_SIZE);
}

// #############################################################################################
/// Function:<summary>
///             Create a vertex buffer using the size provided as the "seed" size.
///             It will always grow anyway.
///          </summary>
/// In:		<param name="_size">Starting size of the buffer in bytes</param>
/// Out:	<returns>
///				The new vertex buffer handle or -1 for error 
///			</returns>
// #############################################################################################
function WebGL_vertex_create_buffer_ext_RELEASE(_size) {

    // Generate the actual vertex buffer
    var vertexBuffer = new yyVBufferBuilder(yyGetInt32(_size));    

    // Get a free slot within the vertex buffer array    
    var vertexBufferIndex = g_vertexBuffers.length;
    for (var i = 0; i < g_vertexBuffers; i++) {
        if ((g_vertexBuffers[i] === null) || (g_vertexBuffers[i] === undefined)) {
            vertexBufferIndex = i;
            break;
        }
    }
    g_vertexBuffers[vertexBufferIndex] = vertexBuffer;
    return vertexBufferIndex;
}

// #############################################################################################
/// Function:<summary>
///             Delete the requested vertex buffer
///          </summary>
/// In:		<param name="_buffer">Buffer to delete</param
// #############################################################################################
function WebGL_vertex_delete_buffer_RELEASE(_buffer) {

    // Release the reference to this buffer
    g_vertexBuffers[yyGetInt32(_buffer)] = null;
}

// #############################################################################################
/// Function:<summary>
///             Start filling in vertex data
///          </summary>
/// In:		<param name="_buffer">Buffer to delete</param
/// In:		<param name="_format">Format of the data we're filling in</param
// #############################################################################################
function WebGL_vertex_begin_RELEASE(_buffer, _format) {
    
    g_vertexBuffers[yyGetInt32(_buffer)].Begin(yyGetInt32(_format));
}

// #############################################################################################
/// Function:<summary>
///             END the filling in of vertex data
///          </summary>
/// In:		<param name="_buffer">Buffer to delete</param
// #############################################################################################
function WebGL_vertex_end_RELEASE(_buffer) {

    g_vertexBuffers[yyGetInt32(_buffer)].End();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_position_RELEASE(_buffer, x, y) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetPosition(yyGetReal(x), yyGetReal(y));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_position_3d_RELEASE(_buffer, x, y, z) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetPosition3D(yyGetReal(x), yyGetReal(y), yyGetReal(z));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_colour_RELEASE(_buffer, col, alpha) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetColour(yyGetInt32(col), yyGetReal(alpha));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_rgba_RELEASE(_buffer, _rgba) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetRGBA(yyGetInt32(_rgba));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_argb_RELEASE(_buffer, _argb) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetARGB(yyGetInt32(_argb));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_texcoord_RELEASE(_buffer, u, v) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetUV(yyGetReal(u), yyGetReal(v));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_normal_RELEASE(_buffer, x, y, z) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetNormal(yyGetReal(x), yyGetReal(y), yyGetReal(z));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_float1_RELEASE(_buffer, x) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetFloat1(yyGetReal(x));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_float2_RELEASE(_buffer, x, y) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetFloat2(yyGetReal(x), yyGetReal(y));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_float3_RELEASE(_buffer, x, y, z) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetFloat3(yyGetReal(x), yyGetReal(y), yyGetReal(z));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_float4_RELEASE(_buffer, x, y, z, w) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetFloat4(yyGetReal(x), yyGetReal(y), yyGetReal(z), yyGetReal(w));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_ubyte4_RELEASE(_buffer, x, y, z, w) {

    g_vertexBuffers[yyGetInt32(_buffer)].SetUByte4(yyGetInt32(x), yyGetInt32(y), yyGetInt32(z), yyGetInt32(w));
}

// #############################################################################################
/// Function:<summary>
///             Freeze the specified dynamic vertex buffer into a frozen one
///          </summary>
/// In:		<param name="_buffer">Buffer to freeze</param>
// #############################################################################################
function WebGL_vertex_freeze_RELEASE(_buffer) {

    var vertexBuffer = g_vertexBuffers[yyGetInt32(_buffer)];
    if (vertexBuffer) {    
        vertexBuffer.Freeze();          
    }
}

// #############################################################################################
/// Function:<summary>
///             Flush the current vertex pipe
///          </summary>
// #############################################################################################
function WebGL_draw_flush_RELEASE() {
    g_webGL.Flush();
}


// #############################################################################################
/// Function:<summary>
///             Draw the contents of a vertex buffer
///          </summary>
/// In:		<param name="_buffer">Buffer to get count of</param>
/// In:		<param name="_primType">Type of primitive to render with</param>
/// In:		<param name="_texture">Texture handle to draw with, or -1 for FLAT</param>
// #############################################################################################
function WebGL_vertex_submit_RELEASE(_buffer, _primType, _texture)
{
    g_webGL.Flush();
    var prim, vertexBuffer = g_vertexBuffers[yyGetInt32(_buffer)];
    if (vertexBuffer) {

        if (g_CurrentShader != -1) {
            var shader = g_shaderPrograms[g_CurrentShader].program;
            var pVertexFormat = vertexBuffer.GetFormat();
            if (pVertexFormat.Format.length < shader.AttribIndices.length) {
                ErrorOnce("Trying to use a vertex buffer with too few inputs for the seleted shader.");
            }
        }
   
        vertexBuffer.Submit(WebGL_translate_primitive_builder_type(yyGetInt32(_primType)), _texture);
    }
}

// #############################################################################################
/// Function:<summary>
///             Get the number of vertices in a vertex buffer
///          </summary>
/// In:		<param name="_buffer">Buffer to get count of</param>
/// Out:	<returns>
///				Number of vertices in buffer
///			</returns>
// #############################################################################################
function WebGL_vertex_get_number_RELEASE(_buffer)
{
    var vertexBuffer = g_vertexBuffers[yyGetInt32(_buffer)];
    if (vertexBuffer)
    {
        return vertexBuffer.GetVertexCount();
    }
    
    return 0;
}


// #############################################################################################
/// Function:<summary>
///             Get the size of a vertex buffer in bytes
///          </summary>
/// In:		<param name="_buffer">Buffer to get size of</param>
/// Out:	<returns>
///				Size of the buffer in bytes
///			</returns>
// #############################################################################################
function WebGL_vertex_get_buffer_size_RELEASE(_buffer)
{
    var vertexBuffer = g_vertexBuffers[yyGetInt32(_buffer)];
    if (vertexBuffer)
    {
        return vertexBuffer.GetArrayBuffer().byteLength;
    }

    return 0;
}

// @endif gl

// @endif vertex_
