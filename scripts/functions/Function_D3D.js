// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_D3D.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// --------------------------------------------------------------------------------------------------------------------------------------------------
// WebGL supported
function d3d_start()                                                                            { ErrorFunction("d3d_start()"); }
function d3d_end()                                                                              { ErrorFunction("d3d_end()"); }

function d3d_set_hidden(enable)                                                                 { ErrorFunction("d3d_set_hidden()"); }
function d3d_set_culling(cull)                                                                  { ErrorFunction("d3d_set_culling()"); }
function d3d_set_shading(smooth)                                                                { ErrorFunction("d3d_set_shading()"); }
function d3d_set_zwriteenable(on_off)															{ ErrorFunction("d3d_set_zwriteenable()"); }
function d3d_set_depth(depth)                                                                   { ErrorFunction("d3d_set_depth()"); }
function draw_set_color_write_enable(red, green, blue, alpha)                                   { ErrorFunction("draw_set_color_write_enable()"); }
var draw_set_colour_write_enable = draw_set_color_write_enable;

function d3d_set_lighting(enable)                                                               { ErrorFunction("d3d_set_shading()"); }
function d3d_light_define_direction(ind,dx,dy,dz,col)                                           { ErrorFunction("d3d_light_define_direction()"); }
function d3d_light_define_point(ind,x,y,z,range,col)                                            { ErrorFunction("d3d_light_define_point()"); }
function d3d_light_enable(ind,enable)                                                           { ErrorFunction("d3d_light_enable()"); }
function d3d_light_define_ambient( colour )                                                     { ErrorFunction("d3d_light_define_ambient()"); }
function d3d_set_fog(enable,color,start,end)                                                    { ErrorFunction("d3d_set_fog()"); }
function d3d_light_get(index)                                                                   { ErrorFunction("d3d_light_get()"); }
function d3d_light_get_ambient(index)                                                           { ErrorFunction("d3d_light_get_ambient()"); }
function d3d_get_lighting()                                                                     { ErrorFunction("d3d_get_lighting()"); }


function d3d_draw_floor(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat)                                { ErrorFunction("d3d_draw_floor()"); }
function d3d_draw_ellipsoid(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat,steps)                      { ErrorFunction("d3d_draw_ellipsoid()"); }
function d3d_draw_block(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat)                                { ErrorFunction("d3d_draw_block()"); }
function d3d_draw_cylinder(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat,closed,steps)                { ErrorFunction("d3d_draw_cylinder()"); }
function d3d_draw_cone(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat,closed,steps)                    { ErrorFunction("d3d_draw_cone()"); }
function d3d_draw_wall(x1,y1,z1,x2,y2,z2,texid,hrepeat,vrepeat)                                 { ErrorFunction("d3d_draw_wall()"); }

function d3d_model_create()                                                                     { ErrorFunction("d3d_model_create()"); }
function d3d_model_destroy(ind)                                                                 { ErrorFunction("d3d_model_destroy()"); }
function d3d_model_clear(ind)                                                                   { ErrorFunction("d3d_model_clear()"); }
function d3d_model_save(ind,fname)                                                              { ErrorFunction("d3d_model_save()"); }
function d3d_model_load(ind,fname)                                                              { ErrorFunction("d3d_model_load()"); }
function d3d_model_save_buffer(ind,fname)                                                       { ErrorFunction("d3d_model_save_buffer()"); }
function d3d_model_load_buffer(ind,fname)                                                       { ErrorFunction("d3d_model_load_buffer()"); }



function d3d_model_draw(ind,x,y,z,texid)                                                        { ErrorFunction("d3d_model_draw()"); }
function d3d_model_primitive_begin(ind,kind)                                                    { ErrorFunction("d3d_model_primitive_begin()"); }
function d3d_model_vertex(ind,x,y,z)                                                            { ErrorFunction("d3d_model_vertex()"); }
function d3d_model_vertex_colour(ind, x, y, z, col, alpha) { ErrorFunction("d3d_model_vertex_colour()"); }
function d3d_model_vertex_color(ind, x, y, z, col, alpha) { ErrorFunction("d3d_model_vertex_color()"); }
function d3d_model_vertex_texture(ind,x,y,z,xtex,ytex)                                          { ErrorFunction("d3d_model_vertex_texture()"); }
function d3d_model_vertex_texture_colour(ind, x, y, z, xtex, ytex, col, alpha) { ErrorFunction("d3d_model_vertex_texture_colour()"); }
function d3d_model_vertex_texture_color(ind, x, y, z, xtex, ytex, col, alpha) { ErrorFunction("d3d_model_vertex_texture_color()"); }
function d3d_model_vertex_normal(ind,x,y,z,nx,ny,nz)                                            { ErrorFunction("d3d_model_vertex_normal()"); }
function d3d_model_vertex_normal_color(ind,x,y,z,nx,ny,nz,col,alpha)                            { ErrorFunction("d3d_model_vertex_normal_color()"); }
function d3d_model_vertex_normal_texture(ind,x,y,z,nx,ny,nz,xtex,ytex)                          { ErrorFunction("d3d_model_vertex_normal_texture()"); }
function d3d_model_vertex_normal_texture_color(ind, x, y, z, nx, ny, nz, xtex, ytex, col, alpha) { ErrorFunction("d3d_model_vertex_normal_texture_color()"); }
function d3d_model_vertex_normal_texture_colour(ind, x, y, z, nx, ny, nz, xtex, ytex, col, alpha) { ErrorFunction("d3d_model_vertex_normal_texture_colour()"); }
function d3d_model_primitive_end(ind)                                                           { ErrorFunction("d3d_model_primitive_end()"); }
function d3d_model_block(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat)                                 { ErrorFunction("d3d_model_block()"); }
function d3d_model_cylinder(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps)                 { ErrorFunction("d3d_model_cylinder()"); }
function d3d_model_cone(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps)                     { ErrorFunction("d3d_model_cone()"); }
function d3d_model_ellipsoid(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,steps)                       { ErrorFunction("d3d_model_ellipsoid()"); }
function d3d_model_wall(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat)                                  { ErrorFunction("d3d_model_wall()"); }
function d3d_model_floor(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat)                                 { ErrorFunction("d3d_model_floor()"); }

function d3d_set_perspective(enable)                                                            { ErrorFunction("d3d_set_perspective()"); }
function d3d_set_projection(xfrom,yfrom,zfrom,xto,yto,zto,xup,yup,zup)                          { ErrorFunction("d3d_set_projection()"); }
function d3d_set_projection_ext(xfrom,yfrom,zfrom,xto,yto,zto,xup,yup,zup,angle,aspect,zn,zf)   { ErrorFunction("d3d_set_projection_ext()"); }
function d3d_set_projection_ortho(x,y,w,h,angle)                                                { ErrorFunction("d3d_set_projection_ortho()"); }
function d3d_set_projection_perspective(x,y,w,h,angle)                                          { ErrorFunction("d3d_set_projection_perspective()"); }

function d3d_transform_set_identity()                                                           { ErrorFunction("d3d_transform_set_identity()"); }
function d3d_transform_set_translation(xt,yt,zt)                                                { ErrorFunction("d3d_transform_set_translation()"); }
function d3d_transform_set_scaling(xs,ys,zs)                                                    { ErrorFunction("d3d_transform_set_scaling()"); }
function d3d_transform_set_rotation_x(angle)                                                    { ErrorFunction("d3d_transform_set_rotation_x()"); }
function d3d_transform_set_rotation_y(angle)                                                    { ErrorFunction("d3d_transform_set_rotation_y()"); }
function d3d_transform_set_rotation_z(angle)                                                    { ErrorFunction("d3d_transform_set_rotation_z()"); }
function d3d_transform_set_rotation_axis(xa,ya,za,angle)                                        { ErrorFunction("d3d_transform_set_rotation_axis()"); }
function d3d_transform_add_translation(xt,yt,zt)                                                { ErrorFunction("d3d_transform_add_translation()"); }
function d3d_transform_add_scaling(xs,ys,zs)                                                    { ErrorFunction("d3d_transform_add_scaling()"); }
function d3d_transform_add_rotation_x(angle)                                                    { ErrorFunction("d3d_transform_add_rotation_x()"); }
function d3d_transform_add_rotation_y(angle)                                                    { ErrorFunction("d3d_transform_add_rotation_y()"); }
function d3d_transform_add_rotation_z(angle)                                                    { ErrorFunction("d3d_transform_add_rotation_axis()"); }
function d3d_transform_add_rotation_axis(xa,ya,za,angle)                                        { ErrorFunction("d3d_transform_add_rotation_z()"); }
function d3d_transform_vertex(_x, _y, _z)                                                       { ErrorFunction("d3d_transform_vertex()"); }
function matrix_get(_type)                                                                      { ErrorFunction("matrix_get()"); }
function matrix_set(_type, _matrix)                                                             { ErrorFunction("matrix_set()"); }
// RK :: Changed these as they are mathematical in nature and not specific to WebGL
// These should be separated out from WebGL to a new maths class
var matrix_build = WebGL_Matrix_Build;
var matrix_multiply = WebGL_Matrix_Multiply;
var matrix_transform_vertex = WebGL_Matrix_Transform_Vertex;

var matrix_stack_push = WebGL_matrix_stack_push;
var matrix_stack_pop = WebGL_matrix_stack_pop;           
var matrix_stack_set = WebGL_matrix_stack_set;  
var matrix_stack_clear = WebGL_matrix_stack_clear;                        
var matrix_stack_top = WebGL_matrix_stack_top;                
var matrix_stack_is_empty = WebGL_matrix_stack_is_empty;      

var matrix_build_identity = WebGL_matrix_build_identity;
var matrix_build_lookat = WebGL_matrix_build_lookat;
var matrix_build_projection_ortho = WebGL_matrix_build_projection_ortho;
var matrix_build_projection_perspective = WebGL_matrix_build_projection_perspective;
var matrix_build_projection_perspective_fov = WebGL_matrix_build_projection_perspective_fov;



function d3d_transform_stack_clear()                                                            { ErrorFunction("d3d_transform_stack_clear()"); }
function d3d_transform_stack_empty()                                                            { ErrorFunction("d3d_transform_stack_empty()"); }
function d3d_transform_stack_push()                                                             { ErrorFunction("d3d_transform_stack_push()"); }
function d3d_transform_stack_pop()                                                              { ErrorFunction("d3d_transform_stack_pop()"); }
function d3d_transform_stack_top()                                                              { ErrorFunction("d3d_transform_stack_top()"); }
function d3d_transform_stack_discard()                                                          { ErrorFunction("d3d_transform_stack_discard()"); }


function gpu_set_blendenable(enable)                                                            { ErrorFunction("gpu_set_blendenable()"); }
function gpu_set_ztestenable(enable)                                                            { ErrorFunction("gpu_set_ztestenable()"); }
function gpu_set_zfunc(cmp_func)                                                                { ErrorFunction("gpu_set_zfunc()"); }
function gpu_set_zwriteenable(enable)                                                           { ErrorFunction("gpu_set_zwriteenable()"); }
//function gpu_set_lightingenable(enable)                                                       { ErrorFunction("gpu_set_lightingenable()"); }
function gpu_set_fog(enable,col,start,end)                                                      { ErrorFunction("gpu_set_fog()"); }
function gpu_set_cullmode(cullmode)                                                             { ErrorFunction("gpu_set_cullmode()"); }
function gpu_set_blendmode(mode)                                                                { ErrorFunction("gpu_set_blendmode()"); }
function gpu_set_blendmode_ext(src,dest)                                                        { ErrorFunction("gpu_set_blendmode_ext()"); }
function gpu_set_blendmode_ext_sepalpha(src,dest,srcalpha,destalpha)                            { ErrorFunction("gpu_set_blendmode_ext_sepalpha()"); }
function gpu_set_colorwriteenable(red,green,blue,alpha)                                         { ErrorFunction("gpu_set_colorwriteenable()"); }
function gpu_set_colourwriteenable(red,green,blue,alpha)                                        { ErrorFunction("gpu_set_colourwriteenable()"); }
function gpu_set_alphatestenable(enable)                                                        { ErrorFunction("gpu_set_alphatestenable()"); }
function gpu_set_alphatestref(value)                                                            { ErrorFunction("gpu_set_alphatestref()"); }
function gpu_set_texfilter(linear)                                                              { ErrorFunction("gpu_set_texfilter()"); }
function gpu_set_texfilter_ext(sampler_id,linear)                                               { ErrorFunction("gpu_set_texfilter_ext()"); }
function gpu_set_texrepeat(repeat)                                                              { ErrorFunction("gpu_set_texrepeat()"); }
function gpu_set_texrepeat_ext(sampler_id,repeat)                                               { ErrorFunction("gpu_set_texrepeat_ext()"); }
function gpu_set_tex_filter(linear)                                                             { ErrorFunction("gpu_set_tex_filter()"); }
function gpu_set_tex_filter_ext(sampler_id, linear)                                             { ErrorFunction("gpu_set_tex_filter_ext()"); }
function gpu_set_tex_repeat(repeat)                                                             { ErrorFunction("gpu_set_tex_repeat()"); }
function gpu_set_tex_repeat_ext(sampler_id, repeat)                                             { ErrorFunction("gpu_set_tex_repeat_ext()"); }

function gpu_set_tex_mip_filter(filter)                                                         { ErrorFunction("gpu_set_tex_mip_filter(filter)"); }
function gpu_set_tex_mip_filter_ext(sampler_id, filter)                                         { ErrorFunction("gpu_set_tex_mip_filter_ext(sampler_id, filter)"); }
function gpu_set_tex_mip_bias(bias)                                                             { ErrorFunction("gpu_set_tex_mip_bias(bias)"); }
function gpu_set_tex_mip_bias_ext(sampler_id, bias)                                             { ErrorFunction("gpu_set_tex_mip_bias_ext(sampler_id, bias)"); }
function gpu_set_tex_min_mip(minmip)                                                            { ErrorFunction("gpu_set_tex_min_mip(minmip)"); }
function gpu_set_tex_min_mip_ext(sampler_id, minmip)                                            { ErrorFunction("gpu_set_tex_min_mip_ext(sampler_id, minmip)"); }
function gpu_set_tex_max_mip(maxmip)                                                            { ErrorFunction("gpu_set_tex_max_mip(maxmip)"); }
function gpu_set_tex_max_mip_ext(sampler_id, maxmip)                                            { ErrorFunction("gpu_set_tex_max_mip_ext(sampler_id, maxmip)"); }
function gpu_set_tex_max_aniso(maxaniso)                                                        { ErrorFunction("gpu_set_tex_max_aniso(maxaniso)"); }
function gpu_set_tex_max_aniso_ext(sampler_id, maxaniso)                                        { ErrorFunction("gpu_set_tex_max_aniso_ext(sampler_id, maxaniso)"); }
function gpu_set_tex_mip_enable(setting)                                                        { ErrorFunction("gpu_set_tex_mip_enable(setting)"); }
function gpu_set_tex_mip_enable_ext(sampler_id, setting)                                        { ErrorFunction("gpu_set_tex_mip_enable_ext(sampler_id, setting)"); }


function gpu_get_blendenable()                                                                  { ErrorFunction("gpu_get_blendenable()"); }
function gpu_get_ztestenable()                                                                  { ErrorFunction("gpu_get_ztestenable()"); }
function gpu_get_zfunc()                                                                        { ErrorFunction("gpu_get_zfunc()"); }
function gpu_get_zwriteenable()                                                                 { ErrorFunction("gpu_get_zwriteenable()"); }
//function gpu_get_lightingenable()                                                             { ErrorFunction("gpu_get_lightingenable()"); }
function gpu_get_fog()                                                                          { ErrorFunction("gpu_get_fog()"); }
function gpu_get_cullmode()                                                                     { ErrorFunction("gpu_get_cullmode()"); }
function gpu_get_blendmode()                                                                    { ErrorFunction("gpu_get_blendmode()"); }
function gpu_get_blendmode_ext()                                                                { ErrorFunction("gpu_get_blendmode_ext()"); }
function gpu_get_blendmode_ext_sepalpha()                                                       { ErrorFunction("gpu_get_blendmode_ext_sepalpha()"); }
function gpu_get_blendmode_src()                                                                { ErrorFunction("gpu_get_blendmode_src()"); }
function gpu_get_blendmode_dest()                                                               { ErrorFunction("gpu_get_blendmode_dest()"); }
function gpu_get_blendmode_srcalpha()                                                           { ErrorFunction("gpu_get_blendmode_srcalpha()"); }
function gpu_get_blendmode_destalpha()                                                          { ErrorFunction("gpu_get_blendmode_destalpha()"); }
function gpu_get_colorwriteenable()                                                             { ErrorFunction("gpu_get_colorwriteenable()"); }
function gpu_get_colourwriteenable()                                                            { ErrorFunction("gpu_get_colourwriteenable()"); }
function gpu_get_alphatestenable()                                                              { ErrorFunction("gpu_get_alphatestenable()"); }
function gpu_get_alphatestref()                                                                 { ErrorFunction("gpu_get_alphatestref()"); }
function gpu_get_texfilter()                                                                    { ErrorFunction("gpu_get_texfilter()"); }
function gpu_get_texfilter_ext(sampler_id)                                                      { ErrorFunction("gpu_get_texfilter_ext()"); }
function gpu_get_texrepeat()                                                                    { ErrorFunction("gpu_get_texrepeat()"); }
function gpu_get_texrepeat_ext(sampler_id)                                                      { ErrorFunction("gpu_get_texrepeat_ext()"); }
function gpu_get_tex_filter()                                                                   { ErrorFunction("gpu_get_tex_filter()"); }
function gpu_get_tex_filter_ext(sampler_id)                                                     { ErrorFunction("gpu_get_tex_filter_ext()"); }
function gpu_get_tex_repeat()                                                                   { ErrorFunction("gpu_get_tex_repeat()"); }
function gpu_get_tex_repeat_ext(sampler_id)                                                     { ErrorFunction("gpu_get_tex_repeat_ext()"); }

function gpu_get_tex_mip_filter()                                                               { ErrorFunction("gpu_get_tex_mip_filter()"); }
function gpu_get_tex_mip_filter_ext(sampler_id)                                                 { ErrorFunction("gpu_get_tex_mip_filter_ext(sampler_id)"); }
function gpu_get_tex_mip_bias()                                                                 { ErrorFunction("gpu_get_tex_mip_bias()"); }
function gpu_get_tex_mip_bias_ext(sampler_id)                                                   { ErrorFunction("gpu_get_tex_mip_bias_ext(sampler_id)"); }
function gpu_get_tex_min_mip()                                                                  { ErrorFunction("gpu_get_tex_min_mip()"); }
function gpu_get_tex_min_mip_ext(sampler_id)                                                    { ErrorFunction("gpu_get_tex_min_mip_ext(sampler_id)"); }
function gpu_get_tex_max_mip()                                                                  { ErrorFunction("gpu_get_tex_max_mip()"); }
function gpu_get_tex_max_mip_ext(sampler_id)                                                    { ErrorFunction("gpu_get_tex_max_mip_ext(sampler_id)"); }
function gpu_get_tex_max_aniso()                                                                { ErrorFunction("gpu_get_tex_max_aniso()"); }
function gpu_get_tex_max_aniso_ext(sampler_id)                                                  { ErrorFunction("gpu_get_tex_max_aniso_ext(sampler_id)"); }
function gpu_get_tex_mip_enable()                                                               { ErrorFunction("gpu_get_tex_mip_enable()"); }
function gpu_get_tex_mip_enable_ext(sampler_id)                                                 { ErrorFunction("gpu_get_tex_mip_enable_ext(sampler_id)"); }

function gpu_push_state()                                                                       { ErrorFunction("gpu_push_state()"); }
function gpu_pop_state()                                                                        { ErrorFunction("gpu_pop_state()"); }

function gpu_get_state()                                                                        { ErrorFunction("gpu_get_state()"); }
function gpu_set_state(map)                                                                     { ErrorFunction("gpu_set_state()"); }

// --------------------------------------------------------------------------------------------------------------------------------------------------
    
var g_3DModels = [];

var g_maxmatstack = 50;
var g_matstacktop = 0;
var g_matstack = new Array(g_maxmatstack + 1);

// #############################################################################################
/// Function:<summary>
///             Initialise the D3D function pointers
///             Should only occur when WebGL is enabled
///          </summary>
// #############################################################################################
function InitD3DFunctions() {

    if (!g_webGL) { 
        return;
    }
    // 3D state
    d3d_start = WebGL_d3d_start_RELEASE;
    d3d_end = WebGL_d3d_end_RELEASE;
    
    d3d_set_culling = WebGL_d3d_set_culling_RELEASE;
    d3d_set_shading = WebGL_d3d_set_shading_RELEASE;
    d3d_set_zwriteenable = WebGL_d3d_set_zwriteenable_RELEASE;
    d3d_set_depth = WebGL_d3d_set_depth_RELEASE;
    d3d_set_hidden = WebGL_d3d_set_hidden_RELEASE;
    draw_set_color_write_enable = WebGL_draw_set_color_write_enable_RELEASE;
    draw_set_colour_write_enable = WebGL_draw_set_color_write_enable_RELEASE;
        
    // Matrix operations
    d3d_set_perspective = WebGL_d3d_set_perspective_RELEASE;
    d3d_set_projection = WebGL_d3d_set_projection_RELEASE;
    d3d_set_projection_ext = WebGL_d3d_set_projection_ext_RELEASE;
    d3d_set_projection_ortho = WebGL_d3d_set_projection_ortho_RELEASE;
    d3d_set_projection_perspective = WebGL_d3d_set_projection_perspective_RELEASE;
    
    d3d_transform_set_identity = WebGL_d3d_transform_set_identity_RELEASE;
    d3d_transform_set_translation = WebGL_d3d_transform_set_translation_RELEASE;
    d3d_transform_set_scaling = WebGL_d3d_transform_set_scaling_RELEASE;
    d3d_transform_set_rotation_x = WebGL_d3d_transform_set_rotation_x_RELEASE;
    d3d_transform_set_rotation_y = WebGL_d3d_transform_set_rotation_y_RELEASE;
    d3d_transform_set_rotation_z = WebGL_d3d_transform_set_rotation_z_RELEASE;
    d3d_transform_set_rotation_axis = WebGL_d3d_transform_set_rotation_axis_RELEASE;
    d3d_transform_add_translation = WebGL_d3d_transform_add_translation_RELEASE;
    d3d_transform_add_scaling = WebGL_d3d_transform_add_scaling_RELEASE;
    d3d_transform_add_rotation_x = WebGL_d3d_transform_add_rotation_x_RELEASE;
    d3d_transform_add_rotation_y = WebGL_d3d_transform_add_rotation_y_RELEASE;
    d3d_transform_add_rotation_z = WebGL_d3d_transform_add_rotation_z_RELEASE;
    d3d_transform_add_rotation_axis = WebGL_d3d_transform_add_rotation_axis_RELEASE;
    d3d_transform_vertex = WebGL_d3d_transform_vertex_RELEASE;
    
    d3d_transform_stack_clear = WebGL_d3d_transform_stack_clear_RELEASE;
    d3d_transform_stack_empty = WebGL_d3d_transform_stack_empty_RELEASE;
    d3d_transform_stack_push = WebGL_d3d_transform_stack_push_RELEASE;  
    d3d_transform_stack_pop = WebGL_d3d_transform_stack_pop_RELEASE;
    d3d_transform_stack_top = WebGL_d3d_transform_stack_top_RELEASE;   
    d3d_transform_stack_discard = WebGL_d3d_transform_stack_discard_RELEASE;
    
    
    // Stock geometry primitive drawing routines
    d3d_draw_floor = WebGL_d3d_draw_floor_RELEASE;
    d3d_draw_ellipsoid = WebGL_d3d_draw_ellipsoid_RELEASE;
    d3d_draw_block = WebGL_d3d_draw_block_RELEASE;
    d3d_draw_cylinder = WebGL_d3d_draw_cylinder_RELEASE;
    d3d_draw_cone = WebGL_d3d_draw_cone_RELEASE;
    d3d_draw_wall = WebGL_d3d_draw_wall_RELEASE;
        
    // Lighting
    d3d_set_lighting = WebGL_d3d_set_lighting_RELEASE;
    d3d_light_define_direction = WebGL_d3d_light_define_direction_RELEASE;
    d3d_light_define_point = WebGL_d3d_light_define_point_RELEASE;
    d3d_light_enable = WebGL_d3d_light_enable_RELEASE;
    d3d_light_define_ambient = WebGL_d3d_light_define_ambient_RELEASE;
    d3d_set_fog = WebGL_d3d_set_fog_RELEASE;
    d3d_light_get = WebGL_d3d_light_get_RELEASE;
    d3d_light_get_ambient = WebGL_d3d_light_get_ambient_RELEASE;
    d3d_get_lighting = WebGL_d3d_get_lighting_RELEASE;
    
    // 3D models
    d3d_model_create = WebGL_d3d_model_create_RELEASE;
    d3d_model_destroy = WebGL_d3d_model_destroy_RELEASE;
    d3d_model_clear = WebGL_d3d_model_clear_RELEASE;
    d3d_model_save = WebGL_d3d_model_save_RELEASE;
    d3d_model_load = WebGL_d3d_model_load_RELEASE;
    d3d_model_save_buffer = WebGL_d3d_model_save_buffer_RELEASE;
    d3d_model_load_buffer = WebGL_d3d_model_load_buffer_RELEASE;
    d3d_model_draw = WebGL_d3d_model_draw_RELEASE;
    d3d_model_primitive_begin = WebGL_d3d_model_primitive_begin_RELEASE;
    d3d_model_vertex = WebGL_d3d_model_vertex_RELEASE;
    d3d_model_vertex_color = WebGL_d3d_model_vertex_color_RELEASE;
    d3d_model_vertex_colour = WebGL_d3d_model_vertex_color_RELEASE;
    d3d_model_vertex_texture = WebGL_d3d_model_vertex_texture_RELEASE;
    d3d_model_vertex_texture_color = WebGL_d3d_model_vertex_texture_color_RELEASE;
    d3d_model_vertex_texture_colour = WebGL_d3d_model_vertex_texture_color_RELEASE;
    d3d_model_vertex_normal = WebGL_d3d_model_vertex_normal_RELEASE;
    d3d_model_vertex_normal_color = WebGL_d3d_model_vertex_normal_color_RELEASE;
    d3d_model_vertex_normal_texture = WebGL_d3d_model_vertex_normal_texture_RELEASE;
    d3d_model_vertex_normal_texture_color = WebGL_d3d_model_vertex_normal_texture_color_RELEASE;
    d3d_model_primitive_end = WebGL_d3d_model_primitive_end_RELEASE;    
    
    d3d_model_block = WebGL_d3d_model_block_RELEASE;
    d3d_model_cylinder = WebGL_d3d_model_cylinder_RELEASE;
    d3d_model_cone = WebGL_d3d_model_cone_RELEASE;
    d3d_model_ellipsoid = WebGL_d3d_model_ellipsoid_RELEASE;
    d3d_model_wall = WebGL_d3d_model_wall_RELEASE;
    d3d_model_floor = WebGL_d3d_model_floor_RELEASE;

    matrix_get = WebGL_Matrix_Get;
    matrix_set = WebGL_Matrix_Set;
    matrix_build = WebGL_Matrix_Build;
    matrix_multiply = WebGL_Matrix_Multiply;
    matrix_transform_vertex = WebGL_Matrix_Transform_Vertex;

    matrix_stack_push = WebGL_matrix_stack_push;
    matrix_stack_pop = WebGL_matrix_stack_pop;           
    matrix_stack_set = WebGL_matrix_stack_set;  
    matrix_stack_clear = WebGL_matrix_stack_clear;                        
    matrix_stack_top = WebGL_matrix_stack_top;                
    matrix_stack_is_empty = WebGL_matrix_stack_is_empty;      

    // GPU functions
    gpu_set_blendmode = WebGL_gpu_set_blendmode;
    gpu_set_blendenable = WebGL_gpu_set_blendenable;
    gpu_set_ztestenable = WebGL_gpu_set_ztestenable;
    gpu_set_zfunc = WebGL_gpu_set_zfunc;
    gpu_set_zwriteenable = WebGL_gpu_set_zwriteenable;
    gpu_set_fog = WebGL_gpu_set_fog;
    gpu_set_cullmode = WebGL_gpu_set_cullmode;
    gpu_set_blendmode = WebGL_gpu_set_blendmode;
    gpu_set_blendmode_ext = WebGL_gpu_set_blendmode_ext;
    gpu_set_blendmode_ext_sepalpha = WebGL_gpu_set_blendmode_ext_sepalpha;
    gpu_set_colorwriteenable = WebGL_gpu_set_colorwriteenable;
    gpu_set_colourwriteenable = WebGL_gpu_set_colourwriteenable;
    gpu_set_alphatestenable = WebGL_gpu_set_alphatestenable;
    gpu_set_alphatestref = WebGL_gpu_set_alphatestref;    
    gpu_set_texfilter = WebGL_gpu_set_texfilter;
    gpu_set_texfilter_ext = WebGL_gpu_set_texfilter_ext;
    gpu_set_texrepeat = WebGL_gpu_set_texrepeat;
    gpu_set_texrepeat_ext = WebGL_gpu_set_texrepeat_ext;
    gpu_set_tex_filter = WebGL_gpu_set_texfilter;
    gpu_set_tex_filter_ext = WebGL_gpu_set_texfilter_ext;
    gpu_set_tex_repeat = WebGL_gpu_set_texrepeat;
    gpu_set_tex_repeat_ext = WebGL_gpu_set_texrepeat_ext;

    gpu_set_tex_mip_filter = WebGL_gpu_set_tex_mip_filter;
    gpu_set_tex_mip_filter_ext = WebGL_gpu_set_tex_mip_filter_ext;
    gpu_set_tex_mip_bias = WebGL_gpu_set_tex_mip_bias;
    gpu_set_tex_mip_bias_ext = WebGL_gpu_set_tex_mip_bias_ext;
    gpu_set_tex_min_mip = WebGL_gpu_set_tex_min_mip;
    gpu_set_tex_min_mip_ext = WebGL_gpu_set_tex_min_mip_ext;
    gpu_set_tex_max_mip = WebGL_gpu_set_tex_max_mip;
    gpu_set_tex_max_mip_ext = WebGL_gpu_set_tex_max_mip_ext;
    gpu_set_tex_max_aniso = WebGL_gpu_set_tex_max_aniso;
    gpu_set_tex_max_aniso_ext = WebGL_gpu_set_tex_max_aniso_ext;
    gpu_set_tex_mip_enable = WebGL_gpu_set_tex_mip_enable;
    gpu_set_tex_mip_enable_ext = WebGL_gpu_set_tex_mip_enable_ext;

    gpu_get_blendenable = WebGL_gpu_get_blendenable;
    gpu_get_ztestenable = WebGL_gpu_get_ztestenable;
    gpu_get_zfunc = WebGL_gpu_get_zfunc;
    gpu_get_zwriteenable = WebGL_gpu_get_zwriteenable;
    gpu_get_fog = WebGL_gpu_get_fog;
    gpu_get_cullmode = WebGL_gpu_get_cullmode;
    gpu_get_blendmode = WebGL_gpu_get_blendmode;
    gpu_get_blendmode_ext = WebGL_gpu_get_blendmode_ext;
    gpu_get_blendmode_ext_sepalpha = WebGL_gpu_get_blendmode_ext_sepalpha;
    gpu_get_blendmode_src = WebGL_gpu_get_blendmode_src;
    gpu_get_blendmode_dest = WebGL_gpu_get_blendmode_dest;
    gpu_get_blendmode_srcalpha = WebGL_gpu_get_blendmode_srcalpha;
    gpu_get_blendmode_destalpha = WebGL_gpu_get_blendmode_destalpha;
    gpu_get_colorwriteenable = WebGL_gpu_get_colorwriteenable;
    gpu_get_colourwriteenable = WebGL_gpu_get_colourwriteenable;
    gpu_get_alphatestenable = WebGL_gpu_get_alphatestenable;
    gpu_get_alphatestref = WebGL_gpu_get_alphatestref;    
    gpu_get_texfilter = WebGL_gpu_get_texfilter;
    gpu_get_texfilter_ext = WebGL_gpu_get_texfilter_ext;
    gpu_get_texrepeat = WebGL_gpu_get_texrepeat;
    gpu_get_texrepeat_ext = WebGL_gpu_get_texrepeat_ext;
    gpu_get_tex_filter = WebGL_gpu_get_texfilter;
    gpu_get_tex_filter_ext = WebGL_gpu_get_texfilter_ext;
    gpu_get_tex_repeat = WebGL_gpu_get_texrepeat;
    gpu_get_tex_repeat_ext = WebGL_gpu_get_texrepeat_ext;

    gpu_get_tex_mip_filter = WebGL_gpu_get_tex_mip_filter;
    gpu_get_tex_mip_filter_ext = WebGL_gpu_get_tex_mip_filter_ext;
    gpu_get_tex_mip_bias = WebGL_gpu_get_tex_mip_bias;
    gpu_get_tex_mip_bias_ext = WebGL_gpu_get_tex_mip_bias_ext;
    gpu_get_tex_min_mip = WebGL_gpu_get_tex_min_mip;
    gpu_get_tex_min_mip_ext = WebGL_gpu_get_tex_min_mip_ext;
    gpu_get_tex_max_mip = WebGL_gpu_get_tex_max_mip;
    gpu_get_tex_max_mip_ext = WebGL_gpu_get_tex_max_mip_ext;
    gpu_get_tex_max_aniso = WebGL_gpu_get_tex_max_aniso;
    gpu_get_tex_max_aniso_ext = WebGL_gpu_get_tex_max_aniso_ext;
    gpu_get_tex_mip_enable = WebGL_gpu_get_tex_mip_enable;
    gpu_get_tex_mip_enable_ext = WebGL_gpu_get_tex_mip_enable_ext;

    gpu_push_state = WebGL_gpu_push_state;
    gpu_pop_state = WebGL_gpu_pop_state;

    gpu_get_state = WebGL_gpu_get_state;
    gpu_set_state = WebGL_gpu_set_state;

    g_matstack[0] = new Matrix();   // this should create a unit matrix
}

// #############################################################################################
/// Function:<summary>
///             Indicate we should use perspective projection matrices and 3D vertices
///          </summary>
// #############################################################################################
function WebGL_d3d_start_RELEASE() {

    GR_3DMode = true;
    
    // Force in 3D specific states
    g_webGL.SetZEnable(GR_ZEnable);
    g_webGL.SetZWriteEnable(GR_ZWriteEnable);
    g_webGL.SetCull(GR_Cull);
}

// #############################################################################################
/// Function:<summary>
///             Indicate we're dropping back to 2D rendering
///          </summary>
// #############################################################################################
function WebGL_d3d_end_RELEASE() {
 
    GR_3DMode = false;    
    
    // Force in states that're default to 2D mode
    g_webGL.SetZEnable(false);   
    g_webGL.SetZWriteEnable(false);
    g_webGL.SetCull(false); 
}

// #############################################################################################
/// Function:<summary>
///             Set back face culling state
///          </summary>
// #############################################################################################
function WebGL_d3d_set_culling_RELEASE(_cull) {

    GR_Cull = _cull > 0.5;
    g_webGL.SetCull(GR_Cull);
}

// #############################################################################################
///  Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_shading_RELEASE(_smooth) {

    // shadeModel is not available on webgl (gl_ES)
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_zwriteenable_RELEASE(_onoff) {

    GR_ZWriteEnable = (_onoff > 0.5);
    g_webGL.SetZWriteEnable(GR_ZWriteEnable);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_depth_RELEASE(_newdepth) {
    
    // _depth is a new depth value used for drawing...
    if (GR_3DMode || g_isZeus) {
        GR_Depth = Math.min(16000.0, Math.max(-16000.0, _newdepth) );
    }
    else {
        GR_Depth = 0.0;
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_hidden_RELEASE(_hidden) {

    GR_ZEnable = (_hidden > 0.5);
    g_webGL.SetZEnable(GR_ZEnable);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_draw_set_color_write_enable_RELEASE(red, green, blue, alpha) {
                
    GR_ColourWriteEnable.red = (red >= 0.5);
    GR_ColourWriteEnable.green = (green >= 0.5);
    GR_ColourWriteEnable.blue = (blue >= 0.5);
    GR_ColourWriteEnable.alpha = (alpha >= 0.5);
    g_webGL.SetColorWriteEnable(GR_ColourWriteEnable.red, GR_ColourWriteEnable.green, GR_ColourWriteEnable.blue, GR_ColourWriteEnable.alpha);
}

// #############################################################################################
/// Function:<summary>
///             Set to use perspective matrices rather than orthographic
///             Not entirely sure what the point of this is so it does nowt
///          </summary>
// #############################################################################################
function WebGL_d3d_set_perspective_RELEASE(_enable) {
    g_set_perspective = _enable;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether or not lighting should be enabled
///             If true then we need normals in the vertex data
///          </summary>
// #############################################################################################
function WebGL_d3d_set_lighting_RELEASE(_enable) {
        
    if (GR_LightingEnabled != _enable) {
        
        GR_LightingEnabled = _enable;
        // This doesn't feel right... if a proprietary shader hasn't been set then switch, otherwise leave alone I reckon        
        g_webGL.SetShader(WebGL_GetDefaultShader());
    }
}

function WebGL_d3d_get_lighting_RELEASE() {
    return GR_LightingEnabled;
}

// #############################################################################################
/// Function:<summary>
///             It's called set_project. It sets the view matrix. 
///             Sometimes I don't cry myself to sleep. Sometimes.
///          </summary>
// #############################################################################################
function WebGL_d3d_set_projection_RELEASE(xfrom, yfrom, zfrom, xto, yto, zto, xup, yup, zup) {
    
    var view = new Matrix();
    
    var pos = new Vector3(xfrom, yfrom, zfrom);
    var at = new Vector3(xto, yto, zto);
    var up = new Vector3(xup, yup, zup);		
	view.LookAtLH(pos, at, up);
    
    g_webGL.SetViewMatrix(view);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_projection_ext_RELEASE(xfrom, yfrom, zfrom, xto, yto, zto, xup, yup, zup, angle, aspect, znear, zfar) {

    var view = new Matrix();
    
    var pos = new Vector3(xfrom, yfrom, zfrom);
    var at = new Vector3(xto, yto, zto);
    var up = new Vector3(xup, yup, zup);		
	view.LookAtLH(pos, at, up);
	
	var proj = new Matrix();
	proj.PerspectiveFovLH(angle, aspect, znear, zfar);
	proj.m[_22] *= g_RenderTargetActive;
	
	g_webGL.SetViewMatrix(view);
	g_webGL.SetProjectionMatrix(proj);    
	//g_webGL.SetCullOrder((g_RenderTargetActive < 0) ? yyGL.Cull_CCW : yyGL.Cull_CW);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_projection_ortho_RELEASE(x,y,w,h,angle) {

    var view = new Matrix();    
    var v1 = new Vector3(x + (w/2.0), y + (h/2.0), -w);
	var v2 = new Vector3(x + (w/2.0), y + (h/2.0), 0.0);
	var v3 = new Vector3(Math.sin(-angle*(Math.PI/180.0)), Math.cos(-angle*(Math.PI/180.0)), 0.0);
	view.LookAtLH(v1, v2, v3);

	var ortho = new Matrix();
	ortho.OrthoLH(w, -h * g_RenderTargetActive, 1.0, 32000.0);		
	
	g_webGL.SetViewMatrix(view);
    g_webGL.SetProjectionMatrix(ortho);    
//    g_webGL.SetCullOrder((g_RenderTargetActive < 0) ? yyGL.Cull_CCW : yyGL.Cull_CW);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_projection_perspective_RELEASE(x,y,w,h,angle) {

    var view = new Matrix();    
    var v1 = new Vector3(x + (w/2.0), y + (h/2.0), -w);
	var v2 = new Vector3(x + (w/2.0), y + (h/2.0), 0.0);
	var v3 = new Vector3(Math.sin(-angle*(Math.PI/180.0)), Math.cos(-angle*(Math.PI/180.0)), 0.0);
	view.LookAtLH(v1, v2, v3);
    
    var proj = new Matrix();
    proj.PerspectiveLH(1.0, ( h/w), 1.0, 32000.0);    
    proj.m[_22] *= g_RenderTargetActive;
    
    g_webGL.SetViewMatrix(view);
    g_webGL.SetProjectionMatrix(proj);
 //   g_webGL.SetCullOrder((g_RenderTargetActive < 0) ? yyGL.Cull_CCW : yyGL.Cull_CW);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_floor_RELEASE(x1, y1, z1, x2, y2, z2, texid, hrepeat, vrepeat) {     

	var oldrep = texture_get_repeat();
	texture_set_repeat(true);
  
	// Draw the primitive
	d3d_primitive_begin_texture(PrimType_TRIFAN, texid);
	{
		d3d_vertex_normal_texture(x1,y1,z1,0,0,1,0,0);
		d3d_vertex_normal_texture(x1,y2,z1,0,0,1,0,vrepeat);
		d3d_vertex_normal_texture(x2,y2,z2,0,0,1,hrepeat,vrepeat);
		d3d_vertex_normal_texture(x2,y1,z2,0,0,1,hrepeat,0);
	}
	d3d_primitive_end();

	// Restore things
	texture_set_repeat(oldrep);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_ellipsoid_RELEASE(x1, y1, z1, x2, y2, z2, texid, hrep, vrep, steps) {

	var oldrep = texture_get_repeat();
	texture_set_repeat(true);
	
	// Correct number of steps
	if (steps < 3) {
	    steps = 3;
	}
	if (steps > 128) {
	    steps = 128;
	}

	// Create sin and cos tables
	var cc = []; // [129]
	var ss = []; // [129]
	for (var i = 0; i <= steps; i++)
	{
		cc[i] = Math.cos(i*2.0*Math.PI / steps);
		ss[i] = Math.sin(i*2.0*Math.PI / steps);
	}

	var mx = (x2 + x1) / 2,
        my = (y2 + y1) / 2,
        mz = (z2 + z1) / 2,
        rx = (x2 - x1) / 2,
        ry = (y2 - y1) / 2,
        rz = (z2 - z1) / 2;

	// Draw the primitive in the box
	var rows = (steps + 1) / 2;
	for (var j= 0; j < rows; j++)
	{
		var rh1 = Math.cos(j * Math.PI / rows),
		    rd1 = Math.sin(j * Math.PI / rows),
		    rh2 = Math.cos((j+1) * Math.PI / rows),
		    rd2 = Math.sin((j+1) * Math.PI / rows);

		d3d_primitive_begin_texture(PrimType_TRISTRIP, texid);
		for (var i = 0; i <= steps; i++)
		{
			d3d_vertex_normal_texture(mx+rx*rd1*cc[i], my+ry*rd1*ss[i], mz+rz*rh1,rd1*cc[i], rd1*ss[i], rh1, hrep*i/steps, j*vrep/rows);
			d3d_vertex_normal_texture(mx+rx*rd2*cc[i], my+ry*rd2*ss[i], mz+rz*rh2,rd2*cc[i], rd2*ss[i], rh2, hrep*i/steps, (j+1)*vrep/rows);
		}
		d3d_primitive_end();
	}

	// Restore things	
	texture_set_repeat(oldrep);	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_block_RELEASE(x1,y1,z1,x2,y2,z2,texid,hrep,vrep) {

    var oldrep = texture_get_repeat();
	texture_set_repeat(true);
	
	d3d_primitive_begin_texture(PrimType_TRILIST, texid);	
	{	    
		d3d_vertex_normal_texture(x1,y1,z1,0,0,-1,0,0);
		d3d_vertex_normal_texture(x1,y2,z1,0,0,-1,0,vrep);
		d3d_vertex_normal_texture(x2,y2,z1,0,0,-1,hrep,vrep);

		d3d_vertex_normal_texture(x2,y2,z1,0,0,-1,hrep,vrep);
		d3d_vertex_normal_texture(x2,y1,z1,0,0,-1,hrep,0);
		d3d_vertex_normal_texture(x1,y1,z1,0,0,-1,0,0);
	}

	{
		d3d_vertex_normal_texture(x1,y1,z2,0,0,1,0,0);
		d3d_vertex_normal_texture(x2,y1,z2,0,0,1,hrep,0);
		d3d_vertex_normal_texture(x2,y2,z2,0,0,1,hrep,vrep);

		d3d_vertex_normal_texture(x2,y2,z2,0,0,1,hrep,vrep);
		d3d_vertex_normal_texture(x1,y2,z2,0,0,1,0,vrep);
		d3d_vertex_normal_texture(x1,y1,z2,0,0,1,0,0);
	}

	{
		d3d_vertex_normal_texture(x1,y2,z1,0,1,0,0,0);
		d3d_vertex_normal_texture(x1,y2,z2,0,1,0,0,vrep);
		d3d_vertex_normal_texture(x2,y2,z2,0,1,0,hrep,vrep);

		d3d_vertex_normal_texture(x2,y2,z2,0,1,0,hrep,vrep);
		d3d_vertex_normal_texture(x2,y2,z1,0,1,0,hrep,0);
		d3d_vertex_normal_texture(x1,y2,z1,0,1,0,0,0);
	}

	{
		d3d_vertex_normal_texture(x2,y2,z1,1,0,0,0,0);
		d3d_vertex_normal_texture(x2,y2,z2,1,0,0,0,vrep);
		d3d_vertex_normal_texture(x2,y1,z2,1,0,0,hrep,vrep);

		d3d_vertex_normal_texture(x2,y1,z2,1,0,0,hrep,vrep);
		d3d_vertex_normal_texture(x2,y1,z1,1,0,0,hrep,0);
		d3d_vertex_normal_texture(x2,y2,z1,1,0,0,0,0);
	}

	{
		d3d_vertex_normal_texture(x2,y1,z1,0,-1,0,0,0);
		d3d_vertex_normal_texture(x2,y1,z2,0,-1,0,0,vrep);
		d3d_vertex_normal_texture(x1,y1,z2,0,-1,0,hrep,vrep);

		d3d_vertex_normal_texture(x1,y1,z2,0,-1,0,hrep,vrep);
		d3d_vertex_normal_texture(x1,y1,z1,0,-1,0,hrep,0);
		d3d_vertex_normal_texture(x2,y1,z1,0,-1,0,0,0);
	}

	{
		d3d_vertex_normal_texture(x1,y1,z1,-1,0,0,0,0);
		d3d_vertex_normal_texture(x1,y1,z2,-1,0,0,0,vrep);
		d3d_vertex_normal_texture(x1,y2,z2,-1,0,0,hrep,vrep);

		d3d_vertex_normal_texture(x1,y2,z2,-1,0,0,hrep,vrep);
		d3d_vertex_normal_texture(x1,y2,z1,-1,0,0,hrep,0);
		d3d_vertex_normal_texture(x1,y1,z1,-1,0,0,0,0);
	}	
	d3d_primitive_end();  
  
	// Restore things
	texture_set_repeat(oldrep);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_cylinder_RELEASE(x1,y1,z1,x2,y2,z2,texid,hrep,vrep,closed,steps) {

    var cc = []; 
	var ss = []; 

	var oldrep = texture_get_repeat();
	texture_set_repeat(true);

	// Correct number of steps
	if (steps < 3)  { steps = 3; }
	if (steps > 128){ steps = 128; }


	// Create sin and cos tables
	for (var i = 0; i <= steps; i++)
	{
		cc[i] = Math.cos(i * 2.0 * Math.PI / steps);
		ss[i] = Math.sin(i * 2.0 * Math.PI / steps);
	}
	var mx = (x2+x1)/2.0;
	var my = (y2+y1)/2.0;
	var rx = (x2-x1)/2.0;
	var ry = (y2-y1)/2.0;

	// Draw the primitive in the box
	if (true == closed)
	{
		d3d_primitive_begin_texture(PrimType_TRIFAN, texid);
		d3d_vertex_normal_texture(mx,my,z2,0,0,1,0,vrep);
		for (var i = 0; i <= steps; i++)
		{
			d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z2,0,0,1,0,vrep);
		}
		d3d_primitive_end();
	}


	d3d_primitive_begin_texture(PrimType_TRISTRIP, texid);
	for (var i = 0; i <= steps; i++)
	{
		d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z2,cc[i],ss[i],0,hrep*i/steps,vrep);
		d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z1,cc[i],ss[i],0,hrep*i/steps,0);
	}
	d3d_primitive_end();


	if (true == closed)
	{
		d3d_primitive_begin_texture(PrimType_TRIFAN, texid);
		d3d_vertex_normal_texture(mx,my,z1,0,0,-1,0,0);
		for (var i = steps; i >= 0; i--)
		{
			d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z1,0,0,-1,0,0);
		}
		d3d_primitive_end();
	}
	
	// Restore things
	texture_set_repeat(oldrep);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_cone_RELEASE(x1,y1,z1,x2,y2,z2,texid,hrep,vrep,closed,steps) {

    var cc = []; 
	var ss = []; 

	var oldrep = texture_get_repeat();
	texture_set_repeat(true);

	// Correct number of steps
	if (steps < 3)  { steps = 3; }
	if (steps > 128){ steps = 128; }

	// Create sin and cos tables
	for (var i = 0; i <= steps; i++)
	{
		cc[i] = Math.cos(i * 2.0 * Math.PI / steps);
		ss[i] = Math.sin(i * 2.0 * Math.PI / steps);
	}

	var mx = (x2+x1)/2.0;
	var my = (y2+y1)/2.0;
	var rx = (x2-x1)/2.0;
	var ry = (y2-y1)/2.0;

	// Draw the primitive in the box
	d3d_primitive_begin_texture(PrimType_TRISTRIP, texid);
	for (var i = 0; i <= steps; i++)
	{
		d3d_vertex_normal_texture(mx,my,z2,0,0,1,hrep*i/steps,vrep);
		d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z1,cc[i],ss[i],0,hrep*i/steps,0);
	}
	d3d_primitive_end();

	if (true == closed)
	{
		d3d_primitive_begin_texture(PrimType_TRIFAN, texid);
		d3d_vertex_normal_texture(mx,my,z1,0,0,-1,0,0);
		for (var i = steps; i >= 0; i--)
		{
			d3d_vertex_normal_texture(mx+cc[i]*rx,my+ss[i]*ry,z1,0,0,-1,0,0);
		}
		d3d_primitive_end();
	}

	// Restore things
	texture_set_repeat(oldrep);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_draw_wall_RELEASE(x1,y1,z1,x2,y2,z2,texid,hrep,vrep) {
    	
	var oldrep = texture_get_repeat();	
	texture_set_repeat(true);

	// Draw the primitive
	var l = Math.sqrt(Sqr(x2 - x1) + Sqr(y2 - y1));
	if (l == 0.0) {
	    return;
	}

	var nx =  (y2-y1) / l;
	var ny = -(x2-x1) / l;
	d3d_primitive_begin_texture(PrimType_TRIFAN, texid);
	{
		d3d_vertex_normal_texture(x1,y1,z1,nx,ny,0,0,0);
		d3d_vertex_normal_texture(x2,y2,z1,nx,ny,0,hrep,0);
		d3d_vertex_normal_texture(x2,y2,z2,nx,ny,0,hrep,vrep);
		d3d_vertex_normal_texture(x1,y1,z2,nx,ny,0,0,vrep);
	}
	d3d_primitive_end();

	// Restore things	
	texture_set_repeat(oldrep);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_light_define_direction_RELEASE(ind, dx, dy, dz, col) {

    // Make sure the direction is normalised
    var vec = new Vector3(dx, dy, dz);
    vec.Normalise();

    var baseIndex = ind * 4;
    GR_DirectionalLights[baseIndex + 0] = vec.X;
    GR_DirectionalLights[baseIndex + 1] = vec.Y;
    GR_DirectionalLights[baseIndex + 2] = vec.Z;
    GR_DirectionalLights[baseIndex + 3] = 0.0;

    GR_LightColours[baseIndex + 0] = (col & 0xff) / 255.0;
    GR_LightColours[baseIndex + 1] = ((col >> 8) & 0xff) / 255.0;
    GR_LightColours[baseIndex + 2] = ((col >> 16) & 0xff) / 255.0;
    GR_LightColours[baseIndex + 3] = 1.0;

    GR_LightType[ind] = LIGHT_TYPE_DIR;
        
    // Make sure the partnered point light is set to have no effect
    GR_PointLights[baseIndex + 0] = 0;
    GR_PointLights[baseIndex + 1] = 0;
    GR_PointLights[baseIndex + 2] = 0;
    GR_PointLights[baseIndex + 3] = 0;
    
    g_webGL.SetLight(ind, 
        GR_PointLights.subarray(ind*4, (ind+1)*4),
        GR_DirectionalLights.subarray(ind*4, (ind+1)*4),
        GR_LightColours.subarray(ind*4, (ind+1)*4));    
}

function WebGL_d3d_light_get_ambient_RELEASE()
{

    var col = (((GR_AmbientLight[0] * 255.0) ) & 0xff)
        | (((GR_AmbientLight[1] * 255.0) << 8) & 0xff00)
        | (((GR_AmbientLight[2] * 255.0) << 16) & 0xff0000)
        | (((GR_AmbientLight[3] * 255.0) << 24) & 0xff000000);
   

    return col;

}

function WebGL_d3d_light_get_RELEASE(index)
{
    var ret = [];

    if (index < 0 || index > 7) {
        console.log("draw_light_get() - light index out of range");
        return;
    }

    var baseIndex = index * 4;

    ret[0] = GR_LightEnabled[index];
    ret[1] = GR_LightType[index];

    if (GR_LightType[index] == LIGHT_TYPE_DIR)
    {
        ret[2] = GR_DirectionalLights[baseIndex + 0];
        ret[3] = GR_DirectionalLights[baseIndex + 1];
        ret[4] = GR_DirectionalLights[baseIndex + 2];
        ret[5] = GR_DirectionalLights[baseIndex + 3];
    }
    else
    {
       
        ret[2] = GR_PointLights[baseIndex + 0];
        ret[3] = GR_PointLights[baseIndex + 1];
        ret[4] = GR_PointLights[baseIndex + 2];
        ret[5] = GR_PointLights[baseIndex + 3];
    }


    var r = (((GR_LightColours[baseIndex + 0] * 255.0)) & 0xff);
    var g = (((GR_LightColours[baseIndex + 1] * 255.0) << 8) & 0xff00);
    var b = (((GR_LightColours[baseIndex + 2] * 255.0) << 16) & 0xff0000);
    var a = (((GR_LightColours[baseIndex + 3] * 255.0) << 24) & 0xff000000);


    var col = r|g|b|a;        
     
    ret[6] = col;

    return ret;

}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_light_define_point_RELEASE(ind,x,y,z,range,col) {

    var baseIndex = ind * 4;
    GR_PointLights[baseIndex + 0] = x;
    GR_PointLights[baseIndex + 1] = y;
    GR_PointLights[baseIndex + 2] = z;
    GR_PointLights[baseIndex + 3] = range;
    
    GR_LightColours[baseIndex + 0] = (col  & 0xff) / 255.0;
    GR_LightColours[baseIndex + 1] = ((col >> 8) & 0xff) / 255.0;
    GR_LightColours[baseIndex + 2] = ((col >> 16) & 0xff) / 255.0;
    GR_LightColours[baseIndex + 3] = 1.0;
    

    GR_LightType[ind] = LIGHT_TYPE_POINT;

    // Make sure the partnered directional light is set to have no effect
    GR_DirectionalLights[baseIndex + 0] = 0;
    GR_DirectionalLights[baseIndex + 1] = 0;
    GR_DirectionalLights[baseIndex + 2] = 0;    
    GR_DirectionalLights[baseIndex + 3] = 0;
        
    g_webGL.SetLight(ind, 
        GR_PointLights.subarray(ind*4, (ind+1)*4),
        GR_DirectionalLights.subarray(ind*4, (ind+1)*4),
        GR_LightColours.subarray(ind*4, (ind+1)*4));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_light_enable_RELEASE(ind, enable) {

    GR_LightEnabled[ind] = enable;
         
    // We need to pass in the actual colour of the light since the off is handled by setting the colour to black
    g_webGL.SetLightEnable(ind, enable, GR_LightColours.subarray(ind*4, (ind+1)*4));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_light_define_ambient_RELEASE(colour) {

    // Pull apart and put into float array
    GR_AmbientLight[0] = (colour  & 0xff) / 255.0;
    GR_AmbientLight[1] = ((colour >> 8) & 0xff) / 255.0;
    GR_AmbientLight[2] = ((colour >> 16) & 0xff) / 255.0;
    GR_AmbientLight[3] = ((colour >> 24) & 0xff) / 255.0;
    
    g_webGL.SetAmbientLighting(GR_AmbientLight);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_set_fog_RELEASE(enable,colour,start,end) {
    
    if (GR_FogParameters == null) {
        GR_FogParameters = new Float32Array(8); // Two vec4s
    }    
    GR_FogParameters[0] = enable;
    var range = end - start;
    GR_FogParameters[1] = (range == 0.0) ? 0.0 : (1.0 / range);
    GR_FogParameters[2] = end;
    GR_FogParameters[3] = 0.0;
        
    // Pull apart colour and put into second vec4
    GR_FogParameters[4] = (colour & 0xff) / 255.0;
    GR_FogParameters[5] = ((colour >> 8) & 0xff) / 255.0;
    GR_FogParameters[6] = ((colour >> 16) & 0xff) / 255.0;
    GR_FogParameters[7] = ((colour >> 24) & 0xff) / 255.0;   
            
    g_webGL.SetFogData(GR_FogParameters);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_create_RELEASE() {
    
    return (g_3DModels.push(new yy3DModel()) - 1);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_destroy_RELEASE(ind) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Clear();
        g_3DModels[ind] = null;
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_clear_RELEASE(ind) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Clear();
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_save_RELEASE(ind, fname) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Save(fname);
    }
}

function WebGL_d3d_model_save_buffer_RELEASE(ind, buffer_index) {

}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_load_RELEASE(ind, fname) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Load(fname);
    }
}

function WebGL_d3d_model_load_buffer_RELEASE(ind, buffer_index) {

    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_draw_RELEASE(ind,x,y,z,texid) {
    
    if (g_3DModels[ind]) {
        g_3DModels[ind].Draw(x, y, z, texid);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_primitive_begin_RELEASE(ind,kind) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Begin(kind);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_RELEASE(ind,x,y,z) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Vertex(x, y, z);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_color_RELEASE(ind,x,y,z,col,alpha) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexColor(x, y, z, col, alpha);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_texture_RELEASE(ind,x,y,z,xtex,ytex) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexTexture(x, y, z, xtex, ytex);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_texture_color_RELEASE(ind,x,y,z,xtex,ytex,col,alpha) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexTextureColor(x, y, z, xtex, ytex, col, alpha);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_normal_RELEASE(ind,x,y,z,nx,ny,nz) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexNormal(x, y, z, nx, ny, nz);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_normal_color_RELEASE(ind,x,y,z,nx,ny,nz,col,alpha) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexNormalColor(x, y, z, nx, ny, nz, col, alpha);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_normal_texture_RELEASE(ind,x,y,z,nx,ny,nz,xtex,ytex) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexNormalTexture(x, y, z, nx, ny, nz, xtex, ytex);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_vertex_normal_texture_color_RELEASE(ind,x,y,z,nx,ny,nz,xtex,ytex,col,alpha) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].VertexNormalTextureColor(x, y, z, nx, ny, nz, xtex, ytex, col, alpha);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_primitive_end_RELEASE(ind) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].End();
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_block_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Block(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_cylinder_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Cylinder(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_cone_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Cone(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_ellipsoid_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,steps) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Ellipsoid(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,steps);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_wall_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Wall(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_model_floor_RELEASE(ind,x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    if (g_3DModels[ind]) {
        g_3DModels[ind].Floor(x1,y1,z1,x2,y2,z2,hrepeat,vrepeat);
    }
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_identity_RELEASE() {
    
    WebGL_SetMatrix(MATRIX_WORLD, new Matrix());
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_translation_RELEASE(xt,yt,zt) {

    var m = new Matrix();
    m.SetTranslation(xt, yt, zt);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_scaling_RELEASE(xs,ys,zs) {

    var m = new Matrix();
    m.SetScale(xs, ys, zs);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_rotation_x_RELEASE(angle) {

    var m = new Matrix();
    m.SetXRotation(angle);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_rotation_y_RELEASE(angle) {

    var m = new Matrix();
    m.SetYRotation(angle);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_rotation_z_RELEASE(angle) {

    var m = new Matrix();
    m.SetZRotation(angle);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_set_rotation_axis_RELEASE(xa,ya,za,angle) {

    var m = new Matrix();
    m.SetRotationAxis(new Vector3(xa, ya, za), -angle);
    WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_translation_RELEASE(xt,yt,zt) {

    var mt = new Matrix();
    mt.SetTranslation(xt, yt, zt);	
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, mt);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_scaling_RELEASE(xs,ys,zs) {

    var ms = new Matrix();
    ms.SetScale(xs, ys, zs);	
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, ms);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_rotation_x_RELEASE(angle) {

    var mr = new Matrix();
    mr.SetXRotation(angle);
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, mr);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_rotation_y_RELEASE(angle) {

    var mr = new Matrix();
    mr.SetYRotation(angle);
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, mr);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_rotation_z_RELEASE(angle) {

    var mr = new Matrix();
    mr.SetZRotation(angle);
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, mr);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_add_rotation_axis_RELEASE(xa,ya,za,angle) {

    var mr = new Matrix();
    mr.SetRotationAxis(new Vector3(xa, ya, za), -angle);
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mo, mr);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_vertex_RELEASE(_x, _y, _z) {

    var mo = WebGL_GetMatrix(MATRIX_WORLD);
	var xx = (mo.m[_11]*_x) + (mo.m[_21]*_y) + (mo.m[_31]*_z) + mo.m[_41];
	var yy = (mo.m[_12]*_x) + (mo.m[_22]*_y) + (mo.m[_32]*_z) + mo.m[_42];
	var zz = (mo.m[_13]*_x) + (mo.m[_23]*_y) + (mo.m[_33]*_z) + mo.m[_43];    
	
	var r=[];
	r[0]=xx;
	r[1]=yy;
	r[2]=zz;
	return r;	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_clear_RELEASE() {
    MatrixStackClear();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_empty_RELEASE() {
    return MatrixStackEmpty();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_push_RELEASE() {

    var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    return PushMatrix(mo);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_pop_RELEASE() {
    return PopMatrix();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_top_RELEASE() {
    return SetTopMatrix();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_d3d_transform_stack_discard_RELEASE() {
    return DiscardTopMatrix();
}

//matrix_get = WebGL_Matrix_Get;
//matrix_set = WebGL_Matrix_Set;
//matrix_build = WebGL_Matrix_Build;
//matrix_multiply = WebGL_Matrix_Multiply;		


// #############################################################################################
/// Function:<summary>
///          	Get the world, view, projection matrix
///          </summary>
///
/// In:		<param name="_type"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_Matrix_Get(_type) {
    // Assume a sensible index and matrix (won't break it if not, but it'd be wasteful)

    _type = yyGetInt32(_type);

    var m = [];
    if (_type < 0 || _type > 2) {
        yyError('ERROR: Invalid matrix type (matrix_get)');
        for (var i = 0; i < 16; i++) {
            m[i] = 0;
        }
        return m;
    }

    var mat = g_Matrix[_type];
    for (var i = 0; i < 16; i++) {
        m[i] = mat.m[i];
    }
    return m;
}
// #############################################################################################
/// Function:<summary>
///          	Set the world, view, projection matrix
///          </summary>
///
/// In:		<param name="_type">0 to 2 matrix type</param>
///    		<param name="_matrix">float array</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_Matrix_Set(_type, _matrix) {
    // Assume a sensible index and matrix (won't break it if not, but it'd be wasteful)
    
    _type = yyGetInt32(_type);

    if (_type < 0 || _type > 2) {
        yyError('ERROR: Invalid matrix type (matrix_get)');      
        return;
    }

    /*var m = new Matrix();
        
    var mat = g_Matrix[_type];
    for (var i = 0; i < 16; i++) {
        m.m[i] = _matrix[i];
    }
    WebGL_SetMatrix(_type, m);*/
    WebGL_SetMatrix(_type, _matrix);

    if (_type == MATRIX_VIEW)
    {
        var matProj = new Matrix();
        var matTemp = WebGL_GetMatrix(MATRIX_PROJECTION);

        if (g_RenderTargetActive == -1)
        {
            matProj = matTemp;
        }
        else
        {
            var flipMat = new Matrix();
            flipMat.unit();
            flipMat.m[_22] = -1;

            matProj.Multiply(matTemp, flipMat);
        }
        
        UpdateViewExtents(new Matrix(_matrix), matProj);
    }
    else if (_type == MATRIX_PROJECTION)
    { 
        UpdateViewExtents(WebGL_GetMatrix(MATRIX_VIEW), new Matrix(_matrix));
    }
}

function WebGL_matrix_build_identity() {
    return [ 
    			1, 0, 0, 0,
    			0, 1, 0, 0,
    			0, 0, 1, 0,
    			0, 0, 0, 1,
    		];
}
function WebGL_matrix_build_lookat( xfrom, yfrom, zfrom, xto, yto, zto, xup, yup, zup) {
    var m = new Matrix();
    var vFrom = new Vector3( yyGetReal(xfrom), yyGetReal(yfrom), yyGetReal(zfrom) );
    var vTo = new Vector3( yyGetReal(xto), yyGetReal(yto), yyGetReal(zto) );
    var vUp = new Vector3( yyGetReal(xup), yyGetReal(yup), yyGetReal(zup) );
    m.LookAtLH( vFrom, vTo, vUp);

    /*
    var flipYMatrix = new Matrix();
    flipYMatrix.SetScale(1, g_RenderTargetActive, 1);
    var flipped = new Matrix();
    flipped.Multiply(m, flipYMatrix);
    */

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = m.m[i];
    }
    return mat;
}
function WebGL_matrix_build_projection_ortho(width, height, znear, zfar ) {
    var m = new Matrix();
    m.OrthoLH( yyGetReal(width), yyGetReal(height), yyGetReal(znear), yyGetReal(zfar) );

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = m.m[i];
    }
    return mat;
}
function WebGL_matrix_build_projection_perspective(width, height, znear, zfar) {
    var m = new Matrix();
    m.PerspectiveLH( yyGetReal(width), yyGetReal(height), yyGetReal(znear), yyGetReal(zfar) );

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = m.m[i];
    }
    return mat;
}
function WebGL_matrix_build_projection_perspective_fov(fov, aspect, znear, zfar) {
    var m = new Matrix();
    m.PerspectiveFovLH( yyGetReal(fov), yyGetReal(aspect), yyGetReal(znear), yyGetReal(zfar) );

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = m.m[i];
    }
    return mat;
}


// #############################################################################################
/// Function:<summary>
///          	Set the world, view, projection matrix
///          </summary>
///
/// In:		<param name="_type">0 to 2 matrix type</param>
///    		<param name="_matrix">float array</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_Matrix_Build(_x,_y,_z, _xrot,_yrot,_zrot, _xscale,_yscale,_zscale) {

    var m = new Matrix();
    var pi_180 = (Math.PI/180.0);
    _xrot = (pi_180 * -yyGetReal(_xrot));
    _yrot = (pi_180 * -yyGetReal(_yrot));
    _zrot = (pi_180 * -yyGetReal(_zrot));
    m.BuildMatrix(yyGetReal(_x), yyGetReal(_y), yyGetReal(_z), _xrot, _yrot, _zrot, yyGetReal(_xscale), yyGetReal(_yscale), yyGetReal(_zscale));

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = m.m[i];
    }
    return mat;
}


// #############################################################################################
/// Function:<summary>
///          	Set the world, view, projection matrix
///          </summary>
///
/// In:		<param name="_type">0 to 2 matrix type</param>
///    		<param name="_matrix">float array</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function WebGL_Matrix_Multiply(_s1,_s2) {

    var s1 = new Matrix();
    var s2 = new Matrix();
    var s3 = new Matrix();

    for (var i = 0; i < 16; i++) {
        s1.m[i] = yyGetReal(_s1[i]);
        s2.m[i] = yyGetReal(_s2[i]);
    }
    s3.Multiply(s1, s2);

    var mat = [];
    for (var i = 0; i < 16; i++) {
        mat[i] = s3.m[i];
    }
    return mat;
}

function WebGL_Matrix_Transform_Vertex(_mat, _x, _y, _z)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _z = yyGetReal(_z);

    var res;
    if (arguments.length == 4)
    {
        var xx = (_mat[_11]*_x) + (_mat[_21]*_y) + (_mat[_31]*_z) + _mat[_41];
        var yy = (_mat[_12]*_x) + (_mat[_22]*_y) + (_mat[_32]*_z) + _mat[_42];
        var zz = (_mat[_13]*_x) + (_mat[_23]*_y) + (_mat[_33]*_z) + _mat[_43];

        res = [xx, yy, zz];
    }
    else
    {
        var _w = yyGetReal(arguments[4]);

        var xx = (_mat[_11]*_x) + (_mat[_21]*_y) + (_mat[_31]*_z) + (_mat[_41]*_w);
        var yy = (_mat[_12]*_x) + (_mat[_22]*_y) + (_mat[_32]*_z) + (_mat[_42]*_w);
        var zz = (_mat[_13]*_x) + (_mat[_23]*_y) + (_mat[_33]*_z) + (_mat[_43]*_w);
        var ww = (_mat[_14]*_x) + (_mat[_24]*_y) + (_mat[_34]*_z) + (_mat[_44]*_w);

        res = [xx, yy, zz, ww];
    }

    return res;
}

function WebGL_matrix_stack_push(_matrix)
{
    if (g_matstacktop >= g_maxmatstack)
    {
        // Already at top of stack
        return;
    }

    g_matstacktop++;

    if (arguments.length == 0)
    {
        g_matstack[g_matstacktop] = new Matrix(g_matstack[g_matstacktop-1]);    // if no matrix passed in, copy the previous top of the stack
    }
    else
    {
        var mat = new Matrix();
        var i;
        for(i = 0; i < 16; i++)
        {
            mat.m[i] = _matrix[i];
        }
        
        g_matstack[g_matstacktop] = new Matrix();
        g_matstack[g_matstacktop].Multiply(mat, g_matstack[g_matstacktop-1]);
    }
}

function WebGL_matrix_stack_pop()
{
    g_matstacktop--;

    if (g_matstacktop < 0)
    {
        WebGL_matrix_stack_clear();
    }   
}

function WebGL_matrix_stack_clear()
{
    g_matstacktop = 0;
    g_matstack[0] = new Matrix();    // reset the first matrix in the stack to be unit
}

function WebGL_matrix_stack_set(_matrix)
{
    g_matstack[g_matstacktop] = new Matrix(_matrix);
}

function WebGL_matrix_stack_top()
{
    var elements = new Array(16);
    var i;
    for(i = 0; i < 16; i++)
    {
        elements[i] = g_matstack[g_matstacktop].m[i];
    }

    return elements;
}

function WebGL_matrix_stack_is_empty()
{
    if (g_matstacktop == 0)
        return true;
    else
        return false;
}

function WebGL_gpu_set_blendenable(_enable)
{ 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaBlendEnable, yyGetInt32(_enable) >= 0.5);
}

function WebGL_gpu_set_ztestenable(_enable)
{ 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZEnable, yyGetInt32(_enable) >= 0.5);
}

function WebGL_gpu_set_zfunc(_cmp_func)
{
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZFunc, yyGetInt32(_cmp_func));
}

function WebGL_gpu_set_zwriteenable(_enable)
{
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, yyGetInt32(_enable) >= 0.5);
}

//function WebGL_gpu_set_lightingenable(_enable)                                                       { ErrorFunction("gpu_set_lightingenable()"); }
function WebGL_gpu_set_fog(_enable,_col,_start,_end)
{
    if (Array.isArray(_enable))
    {
        var params = _enable;
		_enable = params[0];    	
		_col = params[1];    	
		_start = params[2];    	
		_end = params[3];    	
    } // end if

    _enable = yyGetBool(_enable);
    _col = yyGetInt32(_col ) | 0xff000000;
    _start = yyGetReal(_start);
    _end = yyGetReal(_end);

    // Support arrays like the C++ runner
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_FogEnable, _enable);
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_FogColour, _col);
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_FogStart, _start);
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_FogEnd, _end);

    // The global fog parameters needs to be set here so that it remains after
    // the current render cycle and into the next until it is reset
    GR_FogParameters[0] = _enable;
    var range = _end - _start;
    GR_FogParameters[1] = (range == 0.0) ? 0.0 : (1.0 / range);
    GR_FogParameters[2] = _end;
    GR_FogParameters[3] = 0.0;
    GR_FogParameters[4] = (_col & 0xff) / 255.0;
    GR_FogParameters[5] = ((_col >> 8) & 0xff) / 255.0;
    GR_FogParameters[6] = ((_col >> 16) & 0xff) / 255.0;
    GR_FogParameters[7] = 1.0; //((_col >> 24) & 0xff) / 255.0;   

    g_webGL.SetFogData(GR_FogParameters);
}

function WebGL_gpu_set_cullmode(_cullmode)
{ 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_CullMode, yyGetInt32(_cullmode));
}

function WebGL_gpu_set_blendmode(_mode)
{
    switch ( yyGetInt32(_mode) )
	{
		case 1:	g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, yyGL.Blend_SrcAlpha); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, yyGL.Blend_One); // add blend
				
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, yyGL.Blend_SrcAlpha); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, yyGL.Blend_One); // add blend
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
				break;

		case 2:	g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, yyGL.Blend_SrcAlpha);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, yyGL.Blend_InvSrcColour); // color blend				

				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, yyGL.Blend_SrcAlpha); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, yyGL.Blend_InvSrcColour); // color blend
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
				break;

		case 3: g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, yyGL.Blend_Zero);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, yyGL.Blend_InvSrcColour); // subtract blend

				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, yyGL.Blend_Zero); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, yyGL.Blend_InvSrcColour); // subtract blend
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
				break;

		default:g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, yyGL.Blend_SrcAlpha);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, yyGL.Blend_InvSrcAlpha);

				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, yyGL.Blend_SrcAlpha); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, yyGL.Blend_InvSrcAlpha); 
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
				break;
	}
}

function WebGL_gpu_set_blendmode_ext(_src,_dest)
{
    var srcblend, destblend;

    // Support array inputs like the C++ runner
    if (Array.isArray(_src))
    {
        srcblend = yyGetInt32(_src[0]);
        destblend = yyGetInt32(_src[1]);
    }
    else
    {
        srcblend = yyGetInt32(_src);
        destblend = yyGetInt32(_dest);
    }
    
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, srcblend);
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, destblend);

    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, srcblend); 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, destblend); 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
}

function WebGL_gpu_set_blendmode_ext_sepalpha(_src,_dest,_srcalpha,_destalpha)
{
    var srcblend, destblend, srcblendalpha, destblendalpha;

    // Support array inputs like the C++ runner
    if (Array.isArray(_src))
    {
        srcblend = yyGetInt32(_src[0]);
        destblend = yyGetInt32(_src[1]);
        srcblendalpha = yyGetInt32(_src[2]);
        destblendalpha = yyGetInt32(_src[3]);
    }
    else
    {
        srcblend = yyGetInt32(_src);
        destblend = yyGetInt32(_dest);
        srcblendalpha = yyGetInt32(_srcalpha);
        destblendalpha = yyGetInt32(_destalpha);
    }
    
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, srcblend);
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, destblend);

    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, srcblendalpha); 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, destblendalpha); 
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, true);
}

function WebGL_gpu_set_colorwriteenable(_red,_green,_blue,_alpha)
{
    var rflag;
    var gflag;
    var bflag;
    var aflag;

    if (Array.isArray(_red))
    {
        var params = _red;
        rflag = (yyGetInt32(params[0]) >= 0.5);
        gflag = (yyGetInt32(params[1]) >= 0.5);
        bflag = (yyGetInt32(params[2]) >= 0.5);
        aflag = (yyGetInt32(params[3]) >= 0.5);
    }
    else
    {
        rflag = (yyGetInt32(_red) >= 0.5);
        gflag = (yyGetInt32(_green) >= 0.5);
        bflag = (yyGetInt32(_blue) >= 0.5);
        aflag = (yyGetInt32(_alpha) >= 0.5);
    }

    var stateData = { red: rflag, green: gflag, blue: bflag, alpha: aflag };        

    g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, stateData);
}

function WebGL_gpu_set_colourwriteenable(_red,_green,_blue,_alpha)
{ 
    WebGL_gpu_set_colorwriteenable(_red, _green, _blue, _alpha);
}

function WebGL_gpu_set_alphatestenable(_enable)
{
    // To match the cpp runner in functionality, the global flag needs to be set here so that
    // it remains after the current render cycle and into the next until it is reset
    GR_AlphaTestEnabled = (yyGetInt32(_enable) >= 0.5) ? true : false;
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, yyGetInt32(_enable) >= 0.5);
}

function WebGL_gpu_set_alphatestref(_value)
{ 
    // To match the cpp runner in functionality, the global value needs to be set here so that
    // it remains after the current render cycle and into the next until it is reset
    GR_AlphaTestRefValue = yyGetInt32(_value) / 255.0;
    g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, yyGetInt32(_value));
}

function WebGL_gpu_set_texfilter(_linear)
{
    var textureStages = g_webGL.MaxTextureStages;
    var i;

    if (yyGetBool(_linear))
    {
        for(i = 0; i < textureStages; i++)
        {
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MagFilter, yyGL.Filter_LinearFiltering);
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MinFilter, yyGL.Filter_LinearFiltering);
        }
    }
    else
    {
        for(i = 0; i < textureStages; i++)
        {
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MagFilter, yyGL.Filter_PointFiltering);
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MinFilter, yyGL.Filter_PointFiltering);
        }
    }
}

function WebGL_gpu_set_texfilter_ext(_sampler_id,_linear)
{
    var sampler_id, linear;
    if (Array.isArray(_sampler_id))
    {
        var params = _sampler_id;
        sampler_id = yyGetInt32(params[0]);
        linear = yyGetBool(params[1]);
    }
    else
    {
        sampler_id = yyGetInt32(_sampler_id);
        linear = yyGetBool(_linear);
    }

    if (linear)
    {
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_MagFilter, yyGL.Filter_LinearFiltering);
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_MinFilter, yyGL.Filter_LinearFiltering);        
    }
    else
    {
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_MagFilter, yyGL.Filter_PointFiltering);
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_MinFilter, yyGL.Filter_PointFiltering);        
    }
}

function WebGL_gpu_set_texrepeat(_repeat)
{
    var textureStages = g_webGL.MaxTextureStages;
    var i;

    if (yyGetBool(_repeat))
    {
        for(i = 0; i < textureStages; i++)
        {
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Wrap);
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Wrap);
        }
    }
    else
    {
        for(i = 0; i < textureStages; i++)
        {
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Clamp);
            g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Clamp);
        }
    }
}

function WebGL_gpu_set_texrepeat_ext(_sampler_id,_repeat)
{
    var sampler_id, repeat;
    if (Array.isArray(_sampler_id))
    {
        var params = _sampler_id;
        sampler_id = yyGetInt32(params[0]);
        repeat = yyGetBool(params[1]);
    }
    else
    {
        sampler_id = yyGetInt32(_sampler_id);
        repeat = yyGetBool(_repeat);
    }

    if (repeat)
    {
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Wrap);
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Wrap);        
    }
    else
    {
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_AddressU, yyGL.TextureWrap_Clamp);
        g_webGL.RSMan.SetSamplerState(sampler_id, yyGL.SamplerState_AddressV, yyGL.TextureWrap_Clamp);        
    }
}

function WebGL_gpu_set_tex_mip_filter(_filter)
{
    var filter = _filter;
    for (var i = 0; i < g_webGL.MaxTextureStages; i++)
    {
        g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MipFilter, filter);
    }
}

function  WebGL_gpu_set_tex_mip_filter_ext(_sampler_index, _filter)
{
	var stage = _sampler_index;
	var filter = _filter;

	if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MipFilter, filter);	
}

function WebGL_gpu_set_tex_mip_bias(_bias)
{
    var bias = _bias;
    for (var i = 0; i < g_webGL.MaxTextureStages; i++)
    {
        g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MipBias, bias);
    }
}

function WebGL_gpu_set_tex_mip_bias_ext(_sampler_index, _bias)
{
    var stage = _sampler_index;
    var bias = _bias;
    
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MipBias, bias);
}

function WebGL_gpu_set_tex_min_mip(_minmip)
{
    var minmip = _minmip;

	for (var i = 0; i < g_webGL.MaxTextureStages; i++)
	{
		g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MinMip, minmip);
	}
}

function WebGL_gpu_set_tex_min_mip_ext(_sampler_index, _minmip)
{
    var stage = _sampler_index;
    var minmip = _minmip;
    
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MinMip, minmip);
}

function WebGL_gpu_set_tex_max_mip(_maxmip)
{
    var maxmip = _maxmip;

	for (var i = 0; i < g_webGL.MaxTextureStages; i++)
	{
		g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MaxMip, maxmip);
	}
}

function WebGL_gpu_set_tex_max_mip_ext(_sampler_index, _maxmip)
{
    var stage = _sampler_index;
    var maxmip = _maxmip;

    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

	g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MaxMip, maxmip);
}

function WebGL_gpu_set_tex_max_aniso(_maxaniso)
{
    var maxaniso = _maxaniso;

    for (var i = 0; i < g_webGL.MaxTextureStages; i++)
	{
		g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MaxAniso, maxaniso);
	}
}

function WebGL_gpu_set_tex_max_aniso_ext(_sampler_index, _maxaniso)
{
    var stage = _sampler_index;
    var maxaniso = _maxaniso;

    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MaxAniso, maxaniso);
}

function WebGL_gpu_set_tex_mip_enable(_enable)
{
    var enable = _enable;

    for (var i = 0; i < g_webGL.MaxTextureStages; i++)
	{
		g_webGL.RSMan.SetSamplerState(i, yyGL.SamplerState_MipEnable, enable);
	}
}

function WebGL_gpu_set_tex_mip_enable_ext(_sampler_index, _enable)
{
    var stage = _sampler_index;
    var enable = _enable;

    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    g_webGL.RSMan.SetSamplerState(stage, yyGL.SamplerState_MipEnable, enable);
}

function WebGL_gpu_get_blendenable()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaBlendEnable) ? 1.0 : 0.0;
}

function WebGL_gpu_get_ztestenable()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_ZEnable) ? 1.0 : 0.0;
}

function WebGL_gpu_get_zfunc()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_ZFunc);
}

function WebGL_gpu_get_zwriteenable()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_ZWriteEnable) ? 1.0 : 0.0;
}

//function WebGL_gpu_get_lightingenable()                                                             { ErrorFunction("gpu_get_lightingenable()"); }
function WebGL_gpu_get_fog()
{
    var params = new Array();
    params.push(g_webGL.RSMan.GetRenderState(yyGL.RenderState_FogEnable) ? 1.0 : 0.0);
    params.push(g_webGL.RSMan.GetRenderState(yyGL.RenderState_FogColour));
    params.push(g_webGL.RSMan.GetRenderState(yyGL.RenderState_FogStart));
    params.push(g_webGL.RSMan.GetRenderState(yyGL.RenderState_FogEnd));

    return params;
}

function WebGL_gpu_get_cullmode()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_CullMode);
}

function WebGL_gpu_get_blendmode()
{
    var srcblend = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);
    var destblend = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend);
    var srcblendalpha = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlendAlpha);
    var destblendalpha = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlendAlpha);

    if ((srcblend != srcblendalpha) || (destblend != destblendalpha))
    {
        return -1;  // can't be expressed by one of our standard constants
    }
    else
    {
        switch(srcblend)
        {
            case eBlend_SrcAlpha:
            {
                switch(destblend)
                {
                    case eBlend_InvSrcAlpha:     return 0;
                    case eBlend_One:             return 1;
                    case eBlend_InvSrcColour:    return 2;
                    default:                    return -1;      // can't be expressed by one of our standard constants
                }
            }

            case eBlend_Zero:
            {
                if (destblend == eBlend_InvSrcColour)
                {
                    return 3;
                }
                else
                {
                    return -1;                                  // can't be expressed by one of our standard constants
                }
            }

            default:
            return -1;
        }
    }
}

function WebGL_gpu_get_blendmode_ext()
{
    var params = new Array();
    params[0] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);
    params[1] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend);

    return params;
}

function WebGL_gpu_get_blendmode_ext_sepalpha()
{
    var params = new Array();
    params[0] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);
    params[1] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend);
    params[2] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlendAlpha);
    params[3] = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlendAlpha);

    return params;
}

function WebGL_gpu_get_blendmode_src()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);
}

function WebGL_gpu_get_blendmode_dest()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend);
}

function WebGL_gpu_get_blendmode_srcalpha()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlendAlpha);
}

function WebGL_gpu_get_blendmode_destalpha()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlendAlpha);
}

function WebGL_gpu_get_colorwriteenable()
{
    var val = g_webGL.RSMan.GetRenderState(yyGL.RenderState_ColourWriteEnable);

    var ret = new Array();
    ret.push(val.red ? 1.0 : 0.0);
    ret.push(val.green ? 1.0 : 0.0);
    ret.push(val.blue ? 1.0 : 0.0);
    ret.push(val.alpha ? 1.0 : 0.0);

    return ret;
}

function WebGL_gpu_get_colourwriteenable()
{
    return WebGL_gpu_get_colorwriteenable();
}

function WebGL_gpu_get_alphatestenable()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaTestEnable) ? 1.0 : 0.0;
}

function WebGL_gpu_get_alphatestref()
{
    return g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaRef);
}

function WebGL_gpu_get_texfilter()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MagFilter) == yyGL.Filter_LinearFiltering ? 1.0 : 0.0;
}

function WebGL_gpu_get_texfilter_ext(_sampler_id)
{
    return g_webGL.RSMan.GetSamplerState(yyGetInt32(_sampler_id), yyGL.SamplerState_MagFilter) == yyGL.Filter_LinearFiltering ? 1.0 : 0.0;
}

function WebGL_gpu_get_texrepeat()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_AddressU) == yyGL.TextureWrap_Wrap ? 1.0 : 0.0;
}

function WebGL_gpu_get_texrepeat_ext(_sampler_id)
{
    return g_webGL.RSMan.GetSamplerState(yyGetInt32(_sampler_id), yyGL.SamplerState_AddressU) == yyGL.TextureWrap_Wrap ? 1.0 : 0.0;
}

function WebGL_gpu_get_tex_mip_filter()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MipFilter);
}

function WebGL_gpu_get_tex_mip_filter_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }
        
    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MipFilter);
}

function WebGL_gpu_get_tex_mip_bias()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MipBias);
}

function WebGL_gpu_get_tex_mip_bias_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MipBias);
}

function WebGL_gpu_get_tex_min_mip()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MinMip);
}

function WebGL_gpu_get_tex_min_mip_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MinMip);
}

function WebGL_gpu_get_tex_max_mip()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MaxMip);
}

function WebGL_gpu_get_tex_max_mip_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MaxMip);
}

function WebGL_gpu_get_tex_max_aniso()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MaxAniso);
}

function WebGL_gpu_get_tex_max_aniso_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MaxAniso);
}

function WebGL_gpu_get_tex_mip_enable()
{
    return g_webGL.RSMan.GetSamplerState(0, yyGL.SamplerState_MipEnable);
}

function WebGL_gpu_get_tex_mip_enable_ext(_sampler_index)
{
    var stage = _sampler_index;
    if ((stage < 0) || (stage >= g_webGL.MaxTextureStages))
    {
        return;
    }

    return g_webGL.RSMan.GetSamplerState(stage, yyGL.SamplerState_MipEnable);
}

function WebGL_gpu_push_state()
{
    g_webGL.RSMan.SaveStates();
}

function WebGL_gpu_pop_state()
{
    g_webGL.RSMan.RestoreStates();
}

var yySaveRenderStates = undefined;
var yySaveSamplerStates = undefined;

function InitSaveRenderStates()
{
    if (yySaveRenderStates == undefined)
    {
        yySaveRenderStates = [
            "blendenable", yyGL.RenderState_AlphaBlendEnable,
            "ztestenable", yyGL.RenderState_ZEnable,
            "zfunc", yyGL.RenderState_ZFunc,
            "zwriteenable", yyGL.RenderState_ZWriteEnable,
            "fogenable", yyGL.RenderState_FogEnable,
            "fogcolor", yyGL.RenderState_FogColour,
            "fogstart", yyGL.RenderState_FogStart,
            "fogend", yyGL.RenderState_FogEnd,
            "cullmode", yyGL.RenderState_CullMode,
            "srcblend", yyGL.RenderState_SrcBlend,
            "destblend", yyGL.RenderState_DestBlend,
            "srcblendalpha", yyGL.RenderState_SrcBlendAlpha,
            "destblendalpha", yyGL.RenderState_DestBlendAlpha,
            "sepalphaenable", yyGL.RenderState_SeparateAlphaBlendEnable,
            "colorwriteenable", yyGL.RenderState_ColourWriteEnable,
            "alphatestenable", yyGL.RenderState_AlphaTestEnable,	
            "alphatestref", yyGL.RenderState_AlphaRef,
            "alphatestfunc", yyGL.RenderState_AlphaFunc    
        ];
    }
}

function InitSaveSamplerStates()
{
    if (yySaveSamplerStates == undefined)
    {
        yySaveSamplerStates = [
            "magfilter", yyGL.SamplerState_MagFilter,
            "minfilter", yyGL.SamplerState_MinFilter,
            "mipfilter", yyGL.SampletState_MipFilter,
            "addressu", yyGL.SamplerState_AddressU,
            "addressv", yyGL.SamplerState_AddressV,
            "minmip", yyGL.SamplerState_MinMip,
            "maxmip", yyGL.SamplerState_MaxMip,
            "mipbias", yyGL.SamplerState_MipBias,
            "maxaniso", yyGL.SamplerState_MaxAniso,
            "mipenable", yyGL.SamplerState_MipEnable
        ];
    }
}

function WebGL_gpu_get_state()
{
    InitSaveRenderStates();
    InitSaveSamplerStates();

    var map = ds_map_create();

    var numSaveRenderStates = yySaveRenderStates.length / 2;
    var numSaveSamplerStates = yySaveSamplerStates.length / 2;
        
    var i;
    for(i = 0; i < numSaveRenderStates; i++)
    {
        var val = g_webGL.RSMan.GetRenderState(yySaveRenderStates[i*2 + 1]);
        ds_map_add(map, yySaveRenderStates[i*2], val);        
    }

    var textureStages = g_webGL.MaxTextureStages;

    for(i = 0; i < numSaveSamplerStates; i++)
    {
        var j;
        for (j = 0; j < textureStages; j++)
        {
            var name = yySaveSamplerStates[i*2].slice(0) + j;
            var val = g_webGL.RSMan.GetSamplerState(j, yySaveSamplerStates[i*2 + 1]);
            ds_map_add(map, name, val);        
        }
    }

    return map;
}

function WebGL_gpu_set_state(_map)
{
    _map = yyGetInt32(_map);

    InitSaveRenderStates();
    InitSaveSamplerStates();
    
    var i;

    var numSaveRenderStates = yySaveRenderStates.length / 2;
    var numSaveSamplerStates = yySaveSamplerStates.length / 2;

    var currentKey = ds_map_find_first(_map);
    while (currentKey != undefined)
    {
        var key = currentKey;
        var value = ds_map_find_value(_map, key);

        var found = false;
        for(i = 0; i < numSaveRenderStates; i++)
        {
            if (key == yySaveRenderStates[i*2])
            {
                g_webGL.RSMan.SetRenderState(yySaveRenderStates[i*2+1], value);

                found = true;
                break;
            }
        }

        if (!found)
        {
            for(i = 0; i < numSaveSamplerStates; i++)
            {
                // There's almost certainly a much better way of doing this
                var statelength = yySaveSamplerStates[i*2].length;
                var stringpart = key.substr(0, statelength);

                if (stringpart == yySaveSamplerStates[i*2])
                {
                    // Extract index from key string
                    var stringnum = key.substr(statelength-1, key.length - statelength);
                    var num = parseInt(stringnum, 10);

                    g_webGL.RSMan.SetSamplerState(num, yySaveSamplerStates[i*2+1], value);
                    break;
                } 
            }
        }

        currentKey = ds_map_find_next(_map, currentKey);
    }    
}

function WebGL_Generic_Stub()
{

}