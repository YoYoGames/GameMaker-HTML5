// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            libWebGLConsts.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Generates the set of shared constants for use with the library
///          </summary>
// #############################################################################################
var yyGL = {

    MAX_LIGHTS: 8,
    MAX_TEXTURE_STAGES: 8,

    PRIM_NONE: -1,
    PRIM_TRIANGLE: 0,
    PRIM_TRIFAN: 1,
    PRIM_TRISTRIP: 2,
    PRIM_LINE: 3,
    PRIM_LINESTRIP: 4,
    PRIM_POINT: 5,        
        
    // Vertex format building constants
    VU_POSITION: 1,
    VU_COLOR: 2,
    VU_NORMAL: 3,
    VU_TEXCOORD: 4,
    VU_BLENDWEIGHT: 5,
    VU_BLENDINDICES: 6,
    VU_PSIZE: 7,
    VU_TANGENT: 8,
    VU_BINORMAL: 9,
    VU_TESSFACTOR: 10,
    VU_POSITIONT: 11,
    VU_FOG: 12,
    VU_DEPTH: 13, 
    VU_SAMPLE: 14,
    VU_MaxVertexUsage: 14,
    
    // Data type for vertex
    VT_FLOAT1: 1,			// One-component float expanded to (float, 0, 0, 1).
    VT_FLOAT2: 2,			// Two-component float expanded to (float, float, 0, 1).
    VT_FLOAT3: 3,			// Three-component float expanded to (float, float, float, 1).
    VT_FLOAT4: 4,			// Four-component float (float, float, float, float).
    VT_COLOR: 5,			// Four-component, packed, unsigned bytes mapped to 0 to 1 range. Input is a D3DCOLOR and is expanded to RGBA order.
    VT_UBYTE4: 6,			// Four-component, unsigned byte.
    VT_MaxType: 6,
    
    // Blends (NB: this is currently set to match up with the Runner engine... it shouldn't *have* to)
    Blend_Zero: 1,
    Blend_One: 2,
    Blend_SrcColour: 3,
    Blend_InvSrcColour: 4,
    Blend_SrcAlpha: 5,
    Blend_InvSrcAlpha: 6,
    Blend_DestAlpha: 7,
    Blend_InvDestAlpha: 8,
    Blend_DestColour: 9,
    Blend_InvDestColour: 10,
    Blend_SrcAlphaSat: 11,
    Blend_BothSrcAlpha: 12,	
    Blend_BothInvSrcAlpha: 13,
    Blend_BlendFactor: 14,
    Blend_InvBlendFactor: 15,
    Blend_SrcColour2: 16,
    Blend_InvSrcColour2: 16,
	
	// Blend equations
	BlendEquation_Add: 1,
	BlendEquation_Max: 2,
	BlendEquation_Subtract: 3,
	BlendEquation_Min: 4,
	BlendEquation_InvSubtract: 5,
    
    // Render states
    RenderState_None: 0,
	RenderState_ZEnable: 1,
    RenderState_FillMode: 2,	
    RenderState_ShadeMode: 3,
	RenderState_ZWriteEnable: 4,
	RenderState_AlphaTestEnable: 5,
	RenderState_SrcBlend: 6,
	RenderState_DestBlend: 7,
	RenderState_CullMode: 8,
	RenderState_ZFunc: 9,
	RenderState_AlphaRef: 10,
	RenderState_AlphaFunc: 11,
    RenderState_AlphaBlendEnable: 12,
    RenderState_FogEnable: 13,
    RenderState_SpecularEnable: 14,
	RenderState_FogColour: 15,
	RenderState_FogTableMode: 16,
	RenderState_FogStart: 17,
	RenderState_FogEnd: 18,
	RenderState_FogDensity: 19,
	RenderState_RangeFogEnable: 20,
	RenderState_Lighting: 21,
	RenderState_Ambient: 22,
	RenderState_FogVertexMode: 23,
	RenderState_ColourWriteEnable: 24,
	RenderState_StencilEnable: 25,
	RenderState_StencilFail: 26,
	RenderState_StencilZFail: 27,
	RenderState_StencilPass: 28,
	RenderState_StencilFunc: 29,
	RenderState_StencilRef: 30,
	RenderState_StencilMask: 31,
	RenderState_StencilWriteMask: 32,
    RenderState_SeparateAlphaBlendEnable: 33,
	RenderState_SrcBlendAlpha: 34,
	RenderState_DestBlendAlpha: 35,
	RenderState_CullOrder: 36,
	RenderState_BlendEquation: 37,
	RenderState_BlendEquationAlpha: 38,
	RenderState_MAX: 39,
      
    // Stencil operations
    StencilOp_Keep: 1,
    StencilOp_Zero: 2,
    StencilOp_Replace: 3,
    StencilOp_Incrsat: 4,
    StencilOp_Decrsat: 5,
    StencilOp_Invert: 6,
    StencilOp_Incr: 7,
    StencilOp_Decr: 8,
    
    // Functional comparisons
    CmpFunc_CmpNever: 1,
	CmpFunc_CmpLess: 2,
	CmpFunc_CmpEqual: 3,
	CmpFunc_CmpLessEqual: 4,
	CmpFunc_CmpGreater: 5,
	CmpFunc_CmpNotEqual: 6,
	CmpFunc_CmpGreaterEqual: 7,
	CmpFunc_CmpAlways: 8,
	
	// Texture repeat modes (either: or)
    TextureWrap_Wrap: 0,
	TextureWrap_Clamp: 1,
	
	// Texture Interpolation 
    SamplerState_MagFilter: 0,
	SamplerState_MinFilter: 1,
	SamplerState_AddressU: 2,
	SamplerState_AddressV: 3,
	SamplerState_MipFilter: 4,
	SamplerState_MinMip: 5,
	SamplerState_MaxMip: 6,
	SamplerState_MipBias: 7,
	SamplerState_MaxAniso: 8,
	SamplerState_MipEnable: 9,
    SamplerState_MAX: 10,
	    
	// Texture filtering
    Filter_PointFiltering: 0,
    Filter_LinearFiltering: 1,
    Filter_Anisotropic: 2,
    Filter_MAX: 3,
	
    Cull_NoCulling: 0,
	Cull_Clockwise: 1,
	Cull_CounterClockwise: 2,

    FillMode_Point: 0,
    FillMode_Wireframe: 1,
    FillMode_Solid: 2,

    ShadeMode_Flat: 0,
	ShadeMode_Gouraud: 1,

    FogType_TableFog: 0,
	FogType_VertexFog: 1,

    Fog_NoFog: 0,
    Fog_ExpFog: 1,
    Fog_Exp2Fog: 2,
    Fog_LinearFog: 3,

    ColourWriteEnableFlags_None: 0,
	ColourWriteEnableFlags_Red: 1,
	ColourWriteEnableFlags_Green: 2,
	ColourWriteEnableFlags_Blue: 4,
    ColourWriteEnableFlags_Alpha: 8,
    
	MipEnable_DontCare: -1,
	MipEnable_Off: 0,
	MipEnable_On: 1,
	MipEnable_OnlyMarked: 2,
	
	// Error levels to use with REQUIRE
	ERRORLEVEL_Debug: 0,
	ERRORLEVEL_Release: 1,
    ERRORLEVEL_Development: 2,
    
    MaxAniso: 1,
	
	// We should be able to filter out requires according to the error level 
	// (this is from Scala which uses assert, require and assume, although require is supposed to be for argument checking...)
	REQUIRE: function (_assertion, _errorMsg, _errorLevel) {
	    if (!_assertion) {
	        throw new Error(_errorMsg);
	    }
	}	
};
Object.freeze(yyGL);