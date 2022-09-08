// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            fullShader.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Provide the source for the built-in full fog, 8 light 3D vertex shader
///          </summary>
// #############################################################################################
function getFullVertexShader() {

    var vscr = 
        "#define LIGHTS_MAX 8\n" +        
        "#define MATRIX_VIEW 0\n" +
        "#define MATRIX_PROJECTION 1\n" +
        "#define MATRIX_WORLD 2\n" +
        "#define MATRIX_WORLD_VIEW 3\n" +
        "#define MATRIX_WORLD_VIEW_PROJECTION 4\n" +
        "#define MATRICES_MAX 5\n" +
        "#define FOG_SETTINGS 0\n"+
        "#define FOG_COLOUR 1\n"+
        "\n" +
        "uniform mat4 matrices[MATRICES_MAX];\n"+        
        "uniform vec4 fogParameters[2];\n"+ // 0: (enabled, 1/fogRange, blank, blank) 1: fogColour
        "\n" +
        "uniform vec4 dirlightdir[LIGHTS_MAX];\n" +        
        "uniform vec4 pointlightpos[LIGHTS_MAX];\n" +
        "uniform vec4 lightcol[LIGHTS_MAX];\n" +
        "uniform vec4 ambientcol;\n" +
	    "\n" +
        "attribute vec3 vertex;\n" +
        "attribute vec3 normal;\n" +
        "attribute vec4 color;\n" +
        "attribute vec2 UV;\n" +        
        "\n" +
        "varying vec4 fcolor;\n" +
	    "varying vec2 texc;\n" +
	    "varying vec4 fogColor;\n"+  	    
	    "varying float fogFactor;\n"+  
	    "\n" +
	    "float CalcFogFactor(vec4 pos)\n" +
        "{\n" +        
        "	vec4 viewpos = matrices[MATRIX_WORLD_VIEW] * pos;\n" +
        "   vec4 fogParams = fogParameters[FOG_SETTINGS];\n"+        
        "	return (1.0 - ((fogParams.z - viewpos.z) * fogParams.y)) * fogParams.x;\n"+
        "}\n" +
        "\n" +
        "vec4 DoDirLight(vec3 ws_normal, vec4 dir, vec4 diffusecol)\n" +
        "{\n" +        
	    "    float dotresult = dot(ws_normal, dir.xyz);\n" +
	    "    dotresult = max(0.0, dotresult);\n" +
	    "    return dotresult * diffusecol;\n" +
        "}\n" +
        "\n" +
        "vec4 DoPointLight(vec3 ws_pos, vec3 ws_normal, vec4 posrange, vec4 diffusecol)\n" +
        "{\n" +
        "	float atten = 0.0;\n" +
        "\n" +
        "	vec3 diffvec = ws_pos - posrange.xyz;\n" +
        "	float veclen = length(diffvec);\n" +        
        "	if (veclen <= posrange.w)\n" +
        "	{\n" +        
        "        atten = 1.0 / (1.0 + (veclen / posrange.w));\n" + // see GR_3D_Light_Define_Point
        "	}\n" +
        "\n" +
        "	diffvec /= veclen;\n" + 
        "	float dotresult = dot(ws_normal, diffvec);\n" +        
        "	dotresult = max(0.0, dotresult);\n" +        
        "\n" +
        "	return (diffusecol * dotresult * atten);\n" +        
        "}\n" +
        "\n" +
        "vec4 DoLighting(vec4 vertexcolour, vec4 objectspacepos, vec3 objectspacenormal)\n" +
        "{\n" +    	
        "    vec3 ws_normal;\n" +
    	"    vec3 ws_pos;\n" +
    	"    vec4 objectspacenormal4 = vec4(objectspacenormal, 0.0);\n" +    	
    	"\n" +
    	"    ws_normal = (matrices[MATRIX_WORLD] * objectspacenormal4).xyz;\n" +
    	"    ws_normal = -normalize(ws_normal);\n" +            	
    	"    ws_pos = (matrices[MATRIX_WORLD] * objectspacepos).xyz;\n" +
        "\n" +
        "    vec4 accumcol = vec4(0.0, 0.0, 0.0, 0.0);\n" +
    	"    for(int i = 0; i < LIGHTS_MAX; i++)\n" +    	
    	"    {\n" +
    	"    	accumcol += DoDirLight(ws_normal, dirlightdir[i], lightcol[i]);\n" +    	
    	"    }\n" +
    	"    for(int i = 0; i < LIGHTS_MAX; i++)\n" +
    	"    {\n" +
    	"    	accumcol += DoPointLight(ws_pos, ws_normal, pointlightpos[i], lightcol[i]);\n" +    	
    	"    }\n" +
    	"    accumcol *= vertexcolour;\n" +
    	"    accumcol += ambientcol;\n" +    	
    	"    return min(vec4(1.0, 1.0, 1.0, 1.0), accumcol);\n" +
        "}\n" +
        "\n" +
        "void main(void)\n" +
        "{\n" +                                                
        "    vec4 pos = vec4(vertex.xyz, 1);\n"+
        "    vec4 lcolor = DoLighting(color, pos, normal);\n"+        
        "    fcolor = vec4(lcolor.xyz, 1);\n"+
        "    fogFactor = CalcFogFactor(pos);\n"+
        "    fogColor = vec4(fogParameters[FOG_COLOUR].xyz, 1);\n"+
        "    texc = UV;\n"+
        "    gl_Position = matrices[MATRIX_WORLD_VIEW_PROJECTION] * pos;\n"+
        "    gl_PointSize = 1.0;\n"+
        "}";
        
    return vscr;
}

// #############################################################################################
/// Function:<summary>
///             Provide the source for the built-in full fog, 8 light 3D fragment shader
///          </summary>
// #############################################################################################
function getFullFragmentShader() {

    var fsrc =
	    "precision highp float;\n" +
	    "uniform sampler2D pTexure;\n" +
	    "uniform bool alphaTestEnabled;\n" +
	    "uniform float alphaRefValue;" +
	    "\n" +
	    "varying vec4 fcolor;\n" +
	    "varying vec2 texc;\n" +
	    "varying vec4 fogColor;\n"+  	    
	    "varying float fogFactor;\n"+  
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
	    "\n" +
	    "void main(void)\n" +
        "{\n" +	
	    "    vec4 color   = texture2D( pTexure, texc ).rgba * fcolor.rgba;\n" +	    
	    "    DoAlphaTest(color);\n" + 
	    "    gl_FragColor = vec4(mix(color.rgb, fogColor.rgb, fogFactor), color.a);\n" +
        "}\n";
    return fsrc;
}