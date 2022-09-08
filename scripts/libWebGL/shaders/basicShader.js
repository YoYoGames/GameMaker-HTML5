// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            basicShader.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Provide the source for the built-in basic textured 2D/3D unlit vertex shader
///          </summary>
// #############################################################################################
function getBasicVertexShader() {

    var vsrc =
        "#define MATRIX_VIEW 0\n"+
        "#define MATRIX_PROJECTION 1\n"+
        "#define MATRIX_WORLD 2\n"+
        "#define MATRIX_WORLD_VIEW 3\n"+
        "#define MATRIX_WORLD_VIEW_PROJECTION 4\n"+
        "#define MATRICES_MAX 5\n"+        
        "#define FOG_SETTINGS 0\n"+
        "#define FOG_COLOUR 1\n"+
        "\n" +
        "uniform mat4 matrices[MATRICES_MAX];\n"+        
        "uniform vec4 fogParameters[2];\n" + // 0: (enabled, 1/fogRange, blank, blank) 1: fogColour
	    "\n" +
        "attribute vec3 vertex;\n"+
        "attribute vec4 color;\n"+
        "attribute vec2 UV;\n"+
        "\n" +
        "varying vec4 fcolor;\n"+        
	    "varying vec2 texc;\n"+	 
	    "varying vec4 fogColor;\n"+  	    
	    "varying float fogFactor;\n"+   
	    "\n"+
	    "float CalcFogFactor(vec4 pos)\n"+
        "{\n"+
        "	vec4 viewpos = matrices[MATRIX_WORLD_VIEW] * pos;\n"+
        "   vec4 fogParams = fogParameters[FOG_SETTINGS];\n"+        
        "	return (1.0 - ((fogParams.z - viewpos.z) * fogParams.y)) * fogParams.x;\n"+
        "}\n" +
        "\n" +
        "void main(void)\n"+
        "{\n"+        
        "    fcolor = color;\n"+
        "    texc   = UV;\n"+
        "    vec4 pos = vec4(vertex.xyz, 1);\n"+
        "    fogFactor = CalcFogFactor(pos);\n"+
        "    fogColor = vec4(fogParameters[FOG_COLOUR].xyz, 1);\n"+
        "    gl_Position = matrices[MATRIX_WORLD_VIEW_PROJECTION] * pos;\n"+
        "    gl_PointSize = 1.0;\n"+
        "}";
    return vsrc;
}

// #############################################################################################
/// Function:<summary>
///             Provide the source for the built-in basic textured 2D/3D unlit fragment shader
///          </summary>
// #############################################################################################
function getBasicFragmentShader() {

    var fsrc =    
	    "precision highp float;\n" +
	    "uniform sampler2D pTexure;\n" +
	    "uniform bool alphaTestEnabled;\n" +
	    "uniform float alphaRefValue;" +
	    "\n" +
	    "varying vec4 fcolor;\n" +
	    "varying vec2 texc;\n" +
	    "varying vec4 fogColor;\n" +
	    "varying float fogFactor;\n" +
	    "\n" +
	    "void DoAlphaTest(vec4 SrcColour)\n" +
        "{\n" +
	    "    if (alphaTestEnabled)\n" +
	    "    {\n" +
		"        if (SrcColour.a <= alphaRefValue)\n" + 
		"        {\n" +
		"	        discard;\n" +
		"        }\n" +
		"    }\n" +
	    "}\n" +
	    "\n" +
	    "void main(void)\n" +
        "{\n" +	        		
	    "    vec4 color   = texture2D(pTexure, texc).rgba * fcolor.rgba;\n" +
	    "    DoAlphaTest(color);\n" + 
	    "    gl_FragColor = vec4(mix(color.rgb, fogColor.rgb, fogFactor), color.a);\n" +
        "}\n";
    return fsrc;
}
