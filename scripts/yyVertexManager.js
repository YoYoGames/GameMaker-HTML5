// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyVertexManager.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

function vertex_format_begin()                              { ErrorFunction("vertex_format_begin"); }
function vertex_format_end()                                { ErrorFunction("vertex_format_end"); }
function vertex_format_delete(format_id)                    { ErrorFunction("vertex_format_delete"); }
function vertex_format_add_position()                       { ErrorFunction("vertex_format_add_position"); }
function vertex_format_add_position_3d()                    { ErrorFunction("vertex_format_add_position_3d"); }
function vertex_format_add_colour()                         { ErrorFunction("vertex_format_add_colour"); }
function vertex_format_add_color()                          { ErrorFunction("vertex_format_add_color"); }
function vertex_format_add_normal()                         { ErrorFunction("vertex_format_add_normal"); }
function vertex_format_add_texcoord()                       { ErrorFunction("vertex_format_add_texcoord"); }
function vertex_format_add_textcoord()                      { ErrorFunction("vertex_format_add_textcoord"); }
function vertex_format_add_custom(type, usage)              { ErrorFunction("vertex_format_add_custom"); }
function vertex_format_get_info(format_id)                  { ErrorFunction("vertex_format_get_info"); }

// ---------------------------------------------------------------------------------------------
// Tracks the format currently under construction
var g_newFormat = null;

// #############################################################################################
/// Function:<summary>
///             Initialise the vertex buffer function pointers. 
///             Should only occur if WebGL is active.
///          </summary>
// #############################################################################################
function InitFVFFunctions() {

    vertex_format_begin = WebGL_vertex_format_begin_RELEASE;
    vertex_format_end = WebGL_vertex_format_end_RELEASE;
    vertex_format_delete = WebGL_vertex_format_delete_RELEASE;
    vertex_format_add_position = WebGL_vertex_format_add_position_RELEASE;
    vertex_format_add_position_3d = WebGL_vertex_format_add_position_3d_RELEASE;
    vertex_format_add_colour = WebGL_vertex_format_add_colour_RELEASE;
    vertex_format_add_color = WebGL_vertex_format_add_colour_RELEASE;
    vertex_format_add_normal = WebGL_vertex_format_add_normal_RELEASE;
    vertex_format_add_texcoord = WebGL_vertex_format_add_texcoord_RELEASE;
    vertex_format_add_textcoord = WebGL_vertex_format_add_texcoord_RELEASE; //This was in wrongly, add both spellings...
    vertex_format_add_custom = WebGL_vertex_format_add_custom_RELEASE;
    vertex_format_get_info = WebGL_vertex_format_get_info_RELEASE;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_begin_RELEASE() {

    if (g_newFormat != null) {
        debug("ERROR vertex_format_begin: Vertex format is already under construction");        
    }
    else {
        g_newFormat = new yyVertexFormat();        
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_position_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_position: No vertex format is under construction");        
    }
    else {
        g_newFormat.AddPosition();        	    
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_position_3d_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_position_3d: No vertex format is under construction");        
    }
    else {        
        g_newFormat.AddPosition3D();	    
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_colour_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_colour: No vertex format is under construction");        
    }
    else {
        g_newFormat.AddColour();	    
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_normal_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_normal: No vertex format is under construction");        
    }
    else {
        g_newFormat.AddNormal();
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_texcoord_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_textcoord: No vertex format is under construction");        
    }
    else {
        g_newFormat.AddUV();
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_add_custom_RELEASE(_type, _usage) {
    
    if (g_newFormat == null) {
        debug("ERROR vertex_format_add_normal: No vertex format is under construction");        
    }
    else {	    
	    g_newFormat.AddCustom(yyGetInt32(_type), yyGetInt32(_usage));	    
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_end_RELEASE() {

    if (g_newFormat == null) {
        debug("ERROR vertex_format_end: No vertex format under construction");
        return -1;
    }        

    // Store the format with the webgl library
	var formatIndex = g_webGL.RegisterVertexFormat(g_newFormat);
	
	// And reset for the next run
    g_newFormat = null;	
	
	return formatIndex;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function WebGL_vertex_format_delete_RELEASE(_format_id)
{
    // BM: Stubbed as the underlying system shares vertex formats but DOESN'T reference count.
    debug("WARNING vertex_format_delete not implemented on HTML5 (System shares vertex formats but doesn't reference count)");
}

function WebGL_vertex_format_get_info_RELEASE(_format_id)
{
    var format = g_webGL.GetVertexFormat(yyGetInt32(_format_id));

    if (!format)
        return undefined;

    pVFI = new GMLObject();

    variable_struct_set(pVFI, "stride", format.ByteSize);
    variable_struct_set(pVFI, "num_elements", format.Format.length);

    var elementsArray = [];
    for (var i = 0; i < format.Format.length; ++i)
    {
        var element = format.Format[i];
        var pElementI = new GMLObject();

        variable_struct_set(pElementI, "usage", element.usage);
        variable_struct_set(pElementI, "type", element.type);
        variable_struct_set(pElementI, "size", format.GetTypeSize(element.type));
        variable_struct_set(pElementI, "offset", element.offset);

        elementsArray.push(pElementI);
    }
    variable_struct_set(pVFI, "elements", elementsArray);

    return pVFI;
}
