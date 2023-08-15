// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_Shaders.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// WebGL.js redefines these to useful functions
function fn_texture_get_texel_width(){}
function fn_texture_get_texel_height(){}
function fn_texture_set_stage(){}
function fn_shader_is_compiled(){}
function fn_shader_set(){}
function fn_shader_get_uniform(){}
function fn_shader_set_uniform_i(){}
function fn_shader_set_uniform_f(){}
function fn_shader_set_uniform_matrix(){}
function fn_shader_get_sampler_index(){}
function fn_shader_enable_corner_id(){}
function fn_shader_set_uniform_i_array(){}
function fn_shader_set_uniform_f_array(){}
function fn_shader_set_uniform_f_buffer(){}
function fn_shader_set_uniform_matrix_array(){}
function fn_shader_get_name(){}
// @if feature("2d") && (function("shader_*") || function("texture_get_texel_*") || function("texture_set_stage"))
(() => {
    let _stub = (_name, _val) => () => ErrorFunction(_name, _val);
    compile_if_used(texture_get_texel_width, fn_texture_get_texel_width = _stub("fn_texture_get_texel_width", 0));
    compile_if_used(texture_get_texel_height, fn_texture_get_texel_height = _stub("fn_texture_get_texel_height", 0));
    compile_if_used(texture_set_stage, fn_texture_set_stage = _stub("fn_texture_set_stage"));
    compile_if_used(shader_is_compiled, fn_shader_is_compiled = _stub("fn_shader_is_compiled", 0));
    fn_shader_set = _stub("fn_shader_set");
    compile_if_used(shader_get_uniform, fn_shader_get_uniform = _stub("fn_shader_get_uniform", -1));
    compile_if_used(shader_set_uniform_i, fn_shader_set_uniform_i = _stub("fn_shader_set_uniform_i"));
    compile_if_used(shader_set_uniform_f, fn_shader_set_uniform_f = _stub("fn_shader_set_uniform_f"));
    compile_if_used(shader_set_uniform_matrix, fn_shader_set_uniform_matrix = _stub("fn_shader_set_uniform_matrix"));
    compile_if_used(shader_get_sampler_index, fn_shader_get_sampler_index = _stub("fn_shader_get_sampler_index", -1));
    compile_if_used(shader_enable_corner_id, fn_shader_enable_corner_id = _stub("fn_shader_enable_corner_id"));
    compile_if_used(shader_set_uniform_i_array, fn_shader_set_uniform_i_array = _stub("fn_shader_set_uniform_i_array"));
    compile_if_used(shader_set_uniform_f_array, fn_shader_set_uniform_f_array = _stub("fn_shader_set_uniform_f_array"));
    compile_if_used(shader_set_uniform_f_buffer, fn_shader_set_uniform_f_buffer = _stub("fn_shader_set_uniform_f_buffer"));
    compile_if_used(shader_set_uniform_matrix_array, fn_shader_set_uniform_matrix_array = _stub("fn_shader_set_uniform_matrix_array"));
    compile_if_used(shader_get_name, fn_shader_get_name = _stub("fn_shader_get_name", "<undefined>"));
})();
// @endif
var g_CurrentShader = -1;

// --------------------------------------------------------------------------------------------------------------------
// This block would allow for loading from external sources
// --------------------------------------------------------------------------------------------------------------------
/* 
function yyShader()
{    
    this.shaderProgramIndex = -1;
    this.vertexShaderSrc = null;
    this.fragmentShaderSrc = null;      
};

yyShader.prototype.CompleteLoad = function() {

    if (this.vertexShaderSrc != null && this.fragmentShaderSrc != null) {
        
        this.shaderProgramIndex = fn_shader_load(g_vertexShaderHeader + this.vertexShaderSrc, g_fragmentShaderHeader + this.fragmentShaderSrc);
    }
};

yyShader.prototype.LoadShaders = function(_vertShader, _fragShader) {    
    
    var self = this;
    var vertexShaderXhr = new XMLHttpRequest();
    vertexShaderXhr.open("GET", g_RootDir + _vertShader, false); // synchronous
    vertexShaderXhr.onload = function() {
        self.vertexShaderSrc = vertexShaderXhr.responseText;        
    };
    vertexShaderXhr.send(null);
    
    var fragmentShaderXhr = new XMLHttpRequest();
    fragmentShaderXhr.open("GET", g_RootDir + _fragShader, false);
    fragmentShaderXhr.onload = function() {
        self.fragmentShaderSrc = fragmentShaderXhr.responseText;        
    };
    fragmentShaderXhr.send(null);
    
    self.CompleteLoad();
};*/

function Shader_Find(name)
{
	for(var i = 0; i < g_pGMFile.Shaders.length; i++)
	{
		if(g_pGMFile.Shaders[i].name === name)
		{
			return i;
		}
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function texture_get_texel_width(_tex) {

    return fn_texture_get_texel_width(_tex);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function texture_get_texel_height(_tex) {

    return fn_texture_get_texel_height(_tex);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function texture_set_stage(_stage, _texture) {

    fn_texture_set_stage(yyGetInt32(_stage), _texture);
}

// #############################################################################################
/// Function:<summary>
///             Unless WebGL overrides this, no, shaders are not supported
///          </summary>
// #############################################################################################
function shaders_are_supported() {
    return 0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_is_compiled(_shaderIndex) {

    return fn_shader_is_compiled(yyGetInt32(_shaderIndex));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set(_shaderIndex) {
    _shaderIndex = yyGetInt32(_shaderIndex);
    g_CurrentShader = _shaderIndex;
    fn_shader_set(_shaderIndex);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_reset() {
    g_CurrentShader=-1;
    fn_shader_set(-1);
}


// #############################################################################################
/// Function:<summary>
///             Return the currently set shader
///          </summary>
// #############################################################################################
function shader_current() {
    return g_CurrentShader;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_get_uniform(_shaderIndex, _constName) {

    return fn_shader_get_uniform(yyGetInt32(_shaderIndex), yyGetString(_constName));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_i() {
    
    var handle = arguments[0];
    var shaderData = [].splice.call(arguments, 1, arguments.length);
    fn_shader_set_uniform_i(handle, shaderData);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_f() {
     
    // int _handle, int _dims, int _count, float* _vals
    var handle = arguments[0];
    var shaderData = [].splice.call(arguments, 1, arguments.length);
    fn_shader_set_uniform_f(handle, shaderData);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_i1() {
    
    var handle = arguments[0];
    var shaderData = [];
    shaderData[0] = arguments[1];
    fn_shader_set_uniform_i(handle, shaderData);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_matrix() {

    // int _handle
    var handle = arguments[0];
    // var shaderData = [].splice.call(arguments, 1, arguments.length);
    fn_shader_set_uniform_matrix(handle /*, shaderData*/);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_get_sampler_index(_shaderIndex, _texture) {

    return fn_shader_get_sampler_index(yyGetInt32(_shaderIndex), yyGetString(_texture));
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_on_off"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function shader_enable_corner_id(_on_off) {
    
    fn_shader_enable_corner_id(yyGetBool(_on_off));
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_i_array(_handle, _array) {

    fn_shader_set_uniform_i_array(yyGetInt32(_handle), _array);
}

// #############################################################################################
/// Function:<summary>   	
///          </summary>
// #############################################################################################
function shader_set_uniform_f_array(_handle, _array) {

    fn_shader_set_uniform_f_array(yyGetInt32(_handle), _array);
}

// #############################################################################################
/// Function:<summary>   	
///          </summary>
// #############################################################################################
function shader_set_uniform_f_buffer(_handle, _buffer, _offset, _count) {

    fn_shader_set_uniform_f_buffer(yyGetInt32(_handle), yyGetInt32(_buffer), yyGetInt32(_offset), yyGetInt32(_count));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function shader_set_uniform_matrix_array(_handle, _array) {

    fn_shader_set_uniform_matrix_array(yyGetInt32(_handle), _array);
}

function shader_get_name(_index) {
    return fn_shader_get_name(_index);
}