
// **********************************************************************************************************************
// 
// Copyright (c)2021, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyEffects.js
// Created:         05/10/2021
// Author:          Luke
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 05/10/2021		
// 
// **********************************************************************************************************************

var EFFECT_CLEANUP_FUNC = "cleanup",
EFFECT_STEP_FUNC = "step",
EFFECT_LAYER_BEGIN_FUNC = "layer_begin",
EFFECT_LAYER_END_FUNC = "layer_end",
EFFECT_ROOM_START_FUNC = "room_start",
EFFECT_ROOM_END_FUNC = "room_end";

var EFFECT_AFFECT_SINGLE_LAYER_VAR = "gmAffectsSingleLayerOnly";

var EFFECT_LAYER_PREFIX = "effect_";
var EFFECT_NAME_PREFIX = "_";

var FILTER_LAYER_PREFIX = "filter_";
var FILTER_NAME_PREFIX = "_";

var SHADER_NAME_PREFIX = "_";
var SHADER_NAME_POSTFIX = "_shader";

var INFO_NAME_POSTFIX = "_info";

var FAE_TYPE_UNKNOWN = 0,
FAE_TYPE_FILTER = 1,
FAE_TYPE_EFFECT = 2;

var FAE_PARAM_UNKNOWN = 0,
FAE_PARAM_FLOAT = 1,
FAE_PARAM_INT = 2,
FAE_PARAM_BOOL = 3,
FAE_PARAM_SAMPLER = 4,
FAE_PARAM_MAX = 5;

var g_CurrEffectID = 0;

function GetNextEffectID()
{
	if (g_CurrEffectID >= Number.MAX_SAFE_INTEGER)
		g_CurrEffectID = 0;
	else
		g_CurrEffectID++;
	
	return g_CurrEffectID;
}

// #############################################################################################
/// Function:<summary>
///             Create a new EffectParameterInfo object
///          </summary>
// #############################################################################################
/** @constructor */
function yyEffectParameterInfo()
{
	this.__type = "[EffectParameterInfo]";
	this.pName = null;
	this.pDisplayName = null;
	this.type = 0;
	this.elements = 0;
	this.arraysize = 0;

	this.defaults_data = null;
	this.min_data = null;
	this.max_data = null;

	this.samplerRepeat = false;
	this.samplerFilter = false;
}

// #############################################################################################
/// Function:<summary>
///             Create a new EffectInfo object
///          </summary>
// #############################################################################################
/** @constructor */
function yyEffectInfo(_pStorage)
{
	this.__type = "[EffectInfo]";

	this.pName = null;
	this.pDisplayName = null;
	this.pScriptOrShaderName = null;
	this.type = 0;
	this.numParameters = 0;
	this.pParams = []; // EffectParameterInfo[]
}

// #############################################################################################
/// Function:<summary>
///             Cleanup function for the filter host
///          </summary>
// #############################################################################################
yyEffectInfo.prototype.SetupFromJson = function (_json) 
{
	var jsonObj = JSON.parse(_json);

	this.pName = jsonObj.name;
	this.pDisplayName = jsonObj.displayname;
	this.type = jsonObj.type == "filter" ? FAE_TYPE_FILTER : FAE_TYPE_EFFECT;

	if(this.type == FAE_TYPE_EFFECT)
	{
		this.pScriptOrShaderName = jsonObj.name;
	}
	else
	{
		this.pScriptOrShaderName = jsonObj.name + SHADER_NAME_POSTFIX;
	}

	var parameters = jsonObj.parameters;

	this.numParameters = parameters.length;
	this.pParams = [];
	for(var i = 0; i < parameters.length; i++)
	{
		var jsonParam = parameters[i];

		var param = new yyEffectParameterInfo();
		
		param.pName = jsonParam.name;
		param.pDisplayName = jsonParam.displayname;
		switch(jsonParam.type)
		{
			case "float":
				param.type = FAE_PARAM_FLOAT;
				break;
			case "int":
				param.type = FAE_PARAM_INT;
				break;
			case "bool":
				param.type = FAE_PARAM_BOOL;
				break;
			case "sampler":
				param.type = FAE_PARAM_SAMPLER;
				break;
		}

		param.elements = jsonParam.elements;
		param.arraysize = jsonParam.arraysize !== undefined ? jsonParam.arraysize : 1;
		
		param.defaults_data = [];

		// "default" and "defaults" are both valid...
		var defaults = jsonParam.defaults;
		if(defaults === undefined)
		{
			defaults = jsonParam.default;
		}

		if(defaults instanceof Array)
		{
			for(var j = 0; j < defaults.length; j++)
			{
				param.defaults_data.push(defaults[j]);
			}
		}
		else
		{
			param.defaults_data.push(defaults);
		}

		param.min_data = [];
		if(jsonParam.min instanceof Array)
		{
			for(var j = 0; j < jsonParam.min.length; j++)
			{
				param.min_data.push(jsonParam.min[j]);
			}
		}
		else
		{
			param.min_data.push(jsonParam.min);
		}

		param.max_data = [];
		if(jsonParam.max instanceof Array)
		{
			for(var j = 0; j < jsonParam.max.length; j++)
			{
				param.max_data.push(jsonParam.max[j]);
			}
		}
		else
		{
			param.max_data.push(jsonParam.max);
		}

		if (jsonParam.options != undefined)
		{
			if (param.type == FAE_PARAM_SAMPLER)
			{
				var optionstrings = jsonParam.options.split('|');
				for(var j = 0; j < optionstrings.length; j++)
				{
					if (optionstrings[j] == "repeat")
					{
						param.samplerRepeat = true;
					}
					else if (optionstrings[j] == "filter")
					{
						param.samplerFilter = true;
					}
				}
			}
		}


		this.pParams.push(param);
	}
};

// #############################################################################################
/// Function:<summary>
///             Create a new FilterHost object
///          </summary>
// #############################################################################################
/** @constructor */
function yyFilterHost(_pShader, _shaderId, _pEffectInfo)
{
    this.__type = "[FilterHost]";

	this.pShader = _pShader;
	this.shaderId = _shaderId;
	this.pEffectInfo = _pEffectInfo;
	this.tempSurfaceID = -1;

	this.startTime = -1;
	this.elapsedTime = -1;

	// Constant IDs
	this.gm_vTime = -1;
	this.gm_pTime = -1;
	this.gm_pSurfaceDimensions = -1;
	this.gm_pSurfaceTexelSize = -1;
	this.gm_pCamOffset = -1;
	this.gm_pPreMultiplyAlpha = -1;

	// Parameter uniform IDs	
	this.pParamUniformIDs = [];
	this.pTexDimUniformIDs = [];		// this is used for texture dimensions uniforms for associated texture samplers
	this.pTexelSizeUniformIDs = [];		// this is used for texture dimensions uniforms for associated texture samplers

	var funcId = "";

	funcId = "gml" + EFFECT_CLEANUP_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_CLEANUP_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_CLEANUP_FUNC];
	}
	this[funcId] = this.Cleanup;

	funcId = "gml" + EFFECT_STEP_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_STEP_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_STEP_FUNC];
	}
	this[funcId] = this.Step;

	funcId = "gml" + EFFECT_LAYER_BEGIN_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_LAYER_BEGIN_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_LAYER_BEGIN_FUNC];
	}
	this[funcId] = this.LayerBegin;

	funcId = "gml" + EFFECT_LAYER_END_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_LAYER_END_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_LAYER_END_FUNC];
	}
	this[funcId] = this.LayerEnd;

	funcId = "gml" + EFFECT_ROOM_START_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_ROOM_START_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_ROOM_START_FUNC];
	}
	this[funcId] = this.RoomStart;

	funcId = "gml" + EFFECT_ROOM_END_FUNC;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_ROOM_END_FUNC] != undefined)) {
		funcId = g_var2obf[EFFECT_ROOM_END_FUNC];
	}
	this[funcId] = this.RoomEnd;

	var varId = EFFECT_AFFECT_SINGLE_LAYER_VAR;
	this[varId] = false;		// set this to false initially

	this.GetCommonShaderConstants();
	this.GetCustomShaderConstants();
}

// #############################################################################################
/// Function:<summary>
///             Cleanup function for the filter host
///          </summary>
// #############################################################################################
yyFilterHost.prototype.Cleanup = function () 
{
	//surface_free(this.tempSurfaceID);
	this.tempSurfaceID = -1;
};

// #############################################################################################
/// Function:<summary>
///             Step function for the filter host
///          </summary>
// #############################################################################################
yyFilterHost.prototype.Step = function () 
{
	if (this.startTime == -1)
	{
		this.startTime = YoYo_GetTimer();
	}
	else
	{
		this.elapsedTime = YoYo_GetTimer() - this.startTime;
	}
};

// #############################################################################################
/// Function:<summary>
///             LayerBegin function for the filter host
///          </summary>
// #############################################################################################
yyFilterHost.prototype.LayerBegin = function (_layerID) 
{
	if (g_webGL == null)
		return -1;

	// Check draw event and bail if we're not in the right one
	if ((Current_Event_Type != EVENT_DRAW) || (Current_Event_Number != 0))
		return;	// wrong event	
	
	// Check to see if this filter should apply only to this layer
	var bOnlyThisLayer = false;
	var varId = EFFECT_AFFECT_SINGLE_LAYER_VAR;
	var pVar = this[varId];
	if (pVar !== undefined)	
	{
		bOnlyThisLayer = pVar;
	}

	if (bOnlyThisLayer)
	{		
		var surfwidth = g_ApplicationWidth;
		var surfheight = g_ApplicationHeight;

		var currsurface = surface_get_target();
		if (currsurface != -1)
		{
			surfwidth = surface_get_width(currsurface);
			surfheight = surface_get_height(currsurface);
		}

		this.tempSurfaceID = g_pEffectsManager.AcquireTempSurface(surfwidth, surfheight);

		this.backupWorld = WebGL_GetMatrix(MATRIX_WORLD);
		this.backupView = WebGL_GetMatrix(MATRIX_VIEW);
		var matProj = WebGL_GetMatrix(MATRIX_PROJECTION);

		if (g_RenderTargetActive == -1)
		{
			this.backupProj = matProj;
		}
		else
		{
			var flipMat = new Matrix();
			flipMat.unit();
			flipMat.m[_22] = -1.0;
			this.backupProj.Multiply(matProj, flipMat);
		}

		// Draw everything on this layer to the temporary surface
		surface_set_target(this.tempSurfaceID);
		draw_clear_alpha(0, 0.0);

		WebGL_SetMatrix(MATRIX_WORLD, this.backupWorld);
		var tempCam = g_pCameraManager.GetTempCamera();
		tempCam.SetViewMat(this.backupView);
		tempCam.SetProjMat(this.backupProj);
		tempCam.ApplyMatrices();

		g_webGL.RSMan.SaveStates();

		// If we're using the standard blend equation, override it so we use premultiplied alpha
		if ((g_webGL.RSMan.GetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable) == false) &&
			(g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend) == yyGL.Blend_SrcAlpha) &&
			(g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend) == yyGL.Blend_InvSrcAlpha))
		{
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, true);			
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, yyGL.Blend_InvDestAlpha);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, yyGL.Blend_One);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             LayerEnd function for the filter host
///          </summary>
// #############################################################################################
yyFilterHost.prototype.LayerEnd = function (_layerID) 
{
	if (g_webGL == null)
		return -1;

	// Check draw event and bail if we're not in the right one
	if ((Current_Event_Type != EVENT_DRAW) || (Current_Event_Number != 0))
		return;	// wrong event

	var currsurfaceId = surface_get_target();
	if (currsurfaceId == -1)
		return;	// no surface bound (we can't do anything if there's no surface we can use as a source)

	var surfwidth = surface_get_width(currsurfaceId);
	var surfheight = surface_get_height(currsurfaceId);	

	var scratchSurface = -1;
	if (this.tempSurfaceID != -1)
	{
		g_webGL.RSMan.RestoreStates(true);
		surface_reset_target();

		WebGL_SetMatrix(MATRIX_WORLD, this.backupWorld);
		var tempCam = g_pCameraManager.GetTempCamera();
		tempCam.SetViewMat(this.backupView);
		tempCam.SetProjMat(this.backupProj);
		tempCam.ApplyMatrices();
	}
	else
	{
		scratchSurface = g_pEffectsManager.AcquireTempSurface(surfwidth, surfheight);
	}

	// Save state
	var BackupUserShader = g_CurrentShader;
    g_webGL.RSMan.SaveStates();

	var origWorld = WebGL_GetMatrix(MATRIX_WORLD);
	var origView = WebGL_GetMatrix(MATRIX_VIEW);
	var origProj = WebGL_GetMatrix(MATRIX_PROJECTION);

	var olddepth = GR_Depth;

	// Get camera position before we change render target (if we actually change the render target)
	var viewX = 0.0;
	var viewY = 0.0;
	var pCam = g_pCameraManager.GetActiveCamera();
	if(pCam!=null)
	{
		viewX = pCam.GetViewX();
		viewY = pCam.GetViewY();
	}

	if (this.tempSurfaceID == -1)
	{
		// Set temporary surface
		surface_set_target(scratchSurface);
	}	

	// Set shader and state
	shader_set(this.shaderId);
	//g_webGL.FlushAll(); //FlushShader();
	
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZEnable, false);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, false);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaBlendEnable, false);
	//g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, 0xffffffff);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_CullMode, yyGL.Cull_NoCulling);

	var newWorld = new Matrix();
	var newView = new Matrix();
	var newProj = new Matrix();
	newWorld.unit();
	newView.unit();
	newProj.unit();

	WebGL_SetMatrix(MATRIX_WORLD, newWorld);
	WebGL_SetMatrix(MATRIX_VIEW, newView);
	WebGL_SetMatrix(MATRIX_PROJECTION, newProj);

	// Set common shader constants	
	var fElapsedTime = (this.elapsedTime) / 1000000.0;
	shader_set_uniform_f(this.gm_vTime, fElapsedTime);
	shader_set_uniform_f(this.gm_pTime, fElapsedTime);
	shader_set_uniform_f(this.gm_pSurfaceDimensions, surfwidth, surfheight);
	shader_set_uniform_f(this.gm_pSurfaceTexelSize, (surfwidth > 0) ? (1.0 / surfwidth) : 0.0, (surfheight > 0) ? (1.0 / surfheight) : 0.0);

	shader_set_uniform_f(this.gm_pCamOffset, viewX, viewY);

	shader_set_uniform_f(this.gm_pPreMultiplyAlpha, (this.tempSurfaceID != -1) ? 1.0 : 0.0);

	// Set custom shader constants
	if ((this.pEffectInfo != null) && (this.pParamUniformIDs != null))
	{
		for (var i = 0; i < this.pEffectInfo.numParameters; i++)
		{
			var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo
			var pVar = this[pParam.pName];
			if (pVar != null)
			{
				if (pVar instanceof Array)
				{
					// Extract values into temporary arrays that we can pass to the shader
					switch (pParam.type)
					{
						case FAE_PARAM_FLOAT:
						{
							shader_set_uniform_f_array(this.pParamUniformIDs[i], pVar);
						} break;
						case FAE_PARAM_INT:
						case FAE_PARAM_BOOL:
						{
							shader_set_uniform_i_array(this.pParamUniformIDs[i], pVar);
						} break;		

						// We don't currently support setting samplers from an array
					}	
				}
				else
				{
					switch (pParam.type)
					{
						case FAE_PARAM_FLOAT:
						{						
							shader_set_uniform_f(this.pParamUniformIDs[i], pVar);
						} break;
						case FAE_PARAM_INT:
						case FAE_PARAM_BOOL:
						{						
							shader_set_uniform_f(this.pParamUniformIDs[i], pVar);
						} break;
						case FAE_PARAM_SAMPLER:
						{
							var spriteID = pVar;
							var pSprite = g_pSpriteManager.Get(spriteID);
							if ((pSprite != null) && (pSprite.SWFTimeline === undefined) && (pSprite.m_skeletonSprite === undefined))
							{
								var samplerUniform = this.pParamUniformIDs[i];								

								texture_set_stage(samplerUniform, sprite_get_texture(spriteID, 0));

								shader_set_uniform_f(this.pTexDimUniformIDs[i], pSprite.width, pSprite.height);
								shader_set_uniform_f(this.pTexelSizeUniformIDs[i], (pSprite.width > 0) ? (1.0 / pSprite.width) : 0.0, (pSprite.height > 0) ? (1.0 / pSprite.height) : 0.0);

								// Handle texture repeat and filtering
								if (pParam.samplerRepeat)
								{
									gpu_set_texrepeat_ext(samplerUniform, true);									
								}
								else
								{
									gpu_set_texrepeat_ext(samplerUniform, false);									
								}

								if (pParam.samplerFilter)
								{
									gpu_set_tex_filter_ext(samplerUniform, true);
								}
								else
								{
									gpu_set_tex_filter_ext(samplerUniform, false);
								}
							}						

							/*RValue res;
							RValue args[2];
							args[0].kind = VALUE_INT32;
							args[0].v32 = pParamUniformIDs[i];
							args[1].kind = VALUE_PTR;
							args[1].ptr = YYGetPtr(pVar, 0);
							F_Shader_Set_Texture(res, NULL, NULL, 2, args);*/
						} break;
					}
				}
			}
		}
	}

	if (this.tempSurfaceID != -1)
	{				
		// Enable blending when copying the result
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaBlendEnable, true);
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, false);
		//g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, eBlend_SrcAlpha);
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, yyGL.Blend_One);
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, yyGL.Blend_InvSrcAlpha);
	}

	// Draw textured rectangle
	GR_Depth = 0.0;
	draw_surface_stretched(currsurfaceId, -1, -1, 2, 2, clWhite, 1.0);
	//g_webGL.FlushAll(); //Graphics::Flush();

	if (this.tempSurfaceID != -1)
	{
		g_pEffectsManager.ReleaseTempSurface(this.tempSurfaceID);
		this.tempSurfaceID = -1;
	}
	else
	{	
		// Reset surface
		surface_reset_target();

		// Need to re-set matrices
		WebGL_SetMatrix(MATRIX_WORLD, newWorld);
		WebGL_SetMatrix(MATRIX_VIEW, newView);
		WebGL_SetMatrix(MATRIX_PROJECTION, newProj);

		// Draw temp surface to original surface
		shader_set(-1);
		//g_webGL.FlushAll(); //FlushShader();

		draw_surface_stretched(scratchSurface, -1, -1, 2, 2, clWhite, 1.0);
		//g_webGL.FlushAll(); //Graphics::Flush();

		g_pEffectsManager.ReleaseTempSurface(scratchSurface);
	}

	// Restore state
    g_webGL.RSMan.RestoreStates(true);
	shader_set(BackupUserShader);
	//g_webGL.FlushAll();  //FlushShader();
	GR_Depth = olddepth;

	WebGL_SetMatrix(MATRIX_WORLD, origWorld);
	WebGL_SetMatrix(MATRIX_VIEW, origView);
	WebGL_SetMatrix(MATRIX_PROJECTION, origProj);
};

yyFilterHost.prototype.RoomStart = function () 
{

};

yyFilterHost.prototype.RoomEnd = function () 
{
	surface_free(this.tempSurfaceID);
	this.tempSurfaceID = -1;
};

// #############################################################################################
/// Function:<summary>
///             Returns the common shader constants
///          </summary>
// #############################################################################################
yyFilterHost.prototype.GetCommonShaderConstants = function () 
{
	if (this.pShader == null)
		return;

	this.gm_vTime = shader_get_uniform(this.shaderId, "gm_vTime");
	this.gm_pTime = shader_get_uniform(this.shaderId, "gm_pTime");
	this.gm_pSurfaceDimensions = shader_get_uniform(this.shaderId, "gm_pSurfaceDimensions");
	this.gm_pSurfaceTexelSize = shader_get_uniform(this.shaderId, "gm_pSurfaceTexelSize");
	this.gm_pCamOffset = shader_get_uniform(this.shaderId, "gm_pCamOffset");
	this.gm_pPreMultiplyAlpha = shader_get_uniform(this.shaderId, "gm_pPreMultiplyAlpha");
};

// #############################################################################################
/// Function:<summary>
///             Returns the custom shader constants
///          </summary>
// #############################################################################################
yyFilterHost.prototype.GetCustomShaderConstants = function () 
{
	if (this.pShader == null)
		return;

	if (this.pEffectInfo == null)
		return;

	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		if (this.pEffectInfo.pParams[i].type == FAE_PARAM_SAMPLER)
		{
			this.pParamUniformIDs[i] = shader_get_sampler_index(this.shaderId, this.pEffectInfo.pParams[i].pName);

			// Get texture dimensions uniform
			var pTempName = this.pEffectInfo.pParams[i].pName + "Dimensions";
			this.pTexDimUniformIDs[i] = shader_get_uniform(this.shaderId, pTempName);

			// Get texel size uniform
			pTempName = this.pEffectInfo.pParams[i].pName + "TexelSize";
			this.pTexelSizeUniformIDs[i] = shader_get_uniform(this.shaderId, pTempName);			
		}
		else
		{
			this.pParamUniformIDs[i] = shader_get_uniform(this.shaderId, this.pEffectInfo.pParams[i].pName);
			this.pTexDimUniformIDs[i] = -1;
			this.pTexelSizeUniformIDs[i] = -1;
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Create a new EffectInstance reference object
///          </summary>
// #############################################################################################
/** @constructor */
function yyEffectInstanceRef(_effectInstance)
{
	this.__type = "[EffectInstanceRef]";
	this.__yyIsGMLObject = true;
	this.instance = _effectInstance;
}

// #############################################################################################
/// Function:<summary>
///             Create a new EffectInstance object
///          </summary>
// #############################################################################################
/** @constructor */
function yyEffectInstance(_pObj, _pEffectInfo, _autogenerated)
{
    this.__type = "[EffectInstance]";
	this.pEffectObj = _pObj;
	this.pEffectInfo = _pEffectInfo;
	this.id = GetNextEffectID();
	this.autogenerated = _autogenerated;
	this.frame_stepped = -1;
	this.refs = [];
}

// #############################################################################################
/// Function:<summary>
///             Returns a reference object to the effect instance
///				and adds that reference to a weak set
///          </summary>
// #############################################################################################
yyEffectInstance.prototype.GetRef = function () 
{
	var ref = new yyEffectInstanceRef(this);
	this.refs.push(new WeakRef(ref));
	return ref;
};

// #############################################################################################
/// Function:<summary>
///             Updates the active references list and returns whether
///				all references to the instance have been removed.
///          </summary>
// #############################################################################################
yyEffectInstance.prototype.UpdateRefs = function () 
{
	var activeRefs = [];
	for(var i = 0; i < this.refs.length; i++)
	{
		if(this.refs[i].deref() !== undefined)
		{
			activeRefs.push(this.refs[i]);
		}
	}

	// Prevent the references list from growing. Ideally something like
	// WeakSet would have a "empty" property but we're stuck with arrays which
	// could potentially grow quite large if inactive WeakRefs arn't removed.
	this.refs = activeRefs;

	return this.refs.length > 0;
};

// #############################################################################################
/// Function:<summary>
///             Sets the default parameter variable values
///          </summary>
// #############################################################################################
yyEffectInstance.prototype.SetDefaultValues = function () 
{
	if (this.pEffectObj == null)
		return;

	if (this.pEffectInfo == null)
		return;

	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo

		var totalelements = pParam.elements * ((pParam.arraysize == 0) ? 1 : pParam.arraysize);
		this.SetParam(pParam.pName, pParam.type, totalelements, pParam.defaults_data);
	}
};

// #############################################################################################
/// Function:<summary>
///             Sets a parameter variable value
///          </summary>
///
/// In:		 <param name="paramName">Parameter name</param>
/// In:		 <param name="paramName">Type</param>
/// In:		 <param name="paramName">Elements</param>
/// In:		 <param name="paramName">Data</param>
// #############################################################################################
yyEffectInstance.prototype.SetParam = function (_pParamName, _type, _elements, _data) 
{
	if (this.pEffectObj == null)
		return;

	if (_pParamName == null)
		return;

	if (_data == null)
		return;

	// Get variable from effects object and create it if it doesn't exist
	var pVar = null;

	// Overwrite the contents of the variable with the default values
	if (_elements > 1) 
	{		
		pVar = [];

		for (var j = 0; j < _elements; j++)
		{
			var pEntry = null;
			switch (_type)
			{
			case FAE_PARAM_FLOAT: pEntry = _data[j]; break;
			case FAE_PARAM_INT: pEntry = _data[j]; break;
			case FAE_PARAM_BOOL: pEntry = _data[j] ? 1 : 0; break;
			case FAE_PARAM_SAMPLER:
			{
				var spriteID = g_pSpriteManager.Sprite_Find(_data[j]);
				pEntry = spriteID;
				break;
			}
			}

			pVar.push(pEntry);
		}
	}
	else
	{
		switch (_type)
		{
		case FAE_PARAM_FLOAT: pVar = _data[0]; break;
		case FAE_PARAM_INT: pVar = _data[0]; break;
		case FAE_PARAM_BOOL: pVar = _data[0] ? 1 : 0; break;
		case FAE_PARAM_SAMPLER:
		{
			var spriteID = g_pSpriteManager.Sprite_Find(_data[0]);
			pVar = spriteID;
			break;
		}
		}
	}

	var varId = _pParamName;
	if (this.pEffectInfo.type == FAE_TYPE_EFFECT)
	{
		var varId = "gml" + _pParamName;
		if ((typeof g_var2obf !== "undefined") && (g_var2obf[_pParamName] != undefined)) {
			varId = g_var2obf[_pParamName];
		}
	}

	this.pEffectObj[varId] = pVar;
};

// #############################################################################################
/// Function:<summary>
///             Return the parameter variable value with the given name
///          </summary>
///
/// In:		 <param name="paramName">Parameter name</param>
// #############################################################################################
yyEffectInstance.prototype.GetParamVar = function (_pParamName) 
{
	if (this.pEffectObj == null)
		return null;

	if (this.pEffectInfo == null)
		return null;

	// First look for a param with this name in the effect info
	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo
		if (pParam.pName == _pParamName)
		{
			var varId = _pParamName;
			if (this.pEffectInfo.type == FAE_TYPE_EFFECT)
			{
				var varId = "gml" + _pParamName;
				if ((typeof g_var2obf !== "undefined") && (g_var2obf[_pParamName] != undefined)) {
					varId = g_var2obf[_pParamName];
				}
			}

			// Get variable from effects object and create it if it doesn't exist
			return this.pEffectObj[varId];
		}
	}

	return null;
};

// #############################################################################################
/// Function:<summary>
///             Return all parameter variables
///          </summary>
///
/// In:		 <param name="paramName">Parameter name</param>
// #############################################################################################
yyEffectInstance.prototype.GetParamVars = function () 
{
	if (this.pEffectObj == null)
		return null;

	if (this.pEffectInfo == null)
		return null;

	if (this.pEffectInfo.numParameters == 0)
		return {};

	// Create object to store the variable values
	var pParamObj = {};
	pParamObj.__yyIsGMLObject = true;

	// Populate with parameter list
	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo
		var pParamVar = this.GetParamVar(pParam.pName);
		if (pParamVar != null)
		{
			var varId = "gml" + pParam.pName;
			if ((typeof g_var2obf !== "undefined") && (g_var2obf[pParam.pName] != undefined)) {
				varId = g_var2obf[pParam.pName];
			}

			// Apply the gml prefix here so that users can overwrite the existing values
			pParamObj[varId] = pParamVar;			
		}
	}

	return pParamObj;
};

yyEffectInstance.prototype.GetParamNames = function ()
{
	var res = [];
	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo	
		res.push(pParam.pName);
	}
	return res;
};

// #############################################################################################
/// Function:<summary>
///             Sets the parameter variable value
///          </summary>
///
/// In:		 <param name="paramName">Parameter name</param>
/// In:		 <param name="paramName">Value</param>
// #############################################################################################
yyEffectInstance.prototype.SetParamVar = function (_pParamName, _pVal) 
{
	if (this.pEffectObj == null)
		return false;

	if (this.pEffectInfo == null)
		return false;

	if (_pVal == null)
		return false;

	// First see if this param is actually exposed
	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParam = this.pEffectInfo.pParams[i]; //EffectParameterInfo
		if (pParam.pName == _pParamName)
		{
			var varId = _pParamName;
			if (this.pEffectInfo.type == FAE_TYPE_EFFECT)
			{
				var varId = "gml" + _pParamName;
				if ((typeof g_var2obf !== "undefined") && (g_var2obf[_pParamName] != undefined)) {
					varId = g_var2obf[_pParamName];
				}
			}

			this.pEffectObj[varId] = _pVal;		// this should replace the variable if it already exists	
			return true;
		}
	}	

	return false;
};

// #############################################################################################
/// Function:<summary>
///             Sets the parameter variable values
///          </summary>
///
/// In:		 <param name="paramName">Parameter object</param>
// #############################################################################################
yyEffectInstance.prototype.SetParamVars = function (_pVarsObject) 
{
	if (this.pEffectObj == null)
		return false;

	if (this.pEffectInfo == null)
		return false;

	if (this.pEffectInfo.numParameters == 0)
		return false;

	if (_pVarsObject == null)
		return false;

	// Look for variables with the parameter names
	for (var i = 0; i < this.pEffectInfo.numParameters; i++)
	{
		var pParamName = this.pEffectInfo.pParams[i].pName;

		var varId = "gml" + pParamName;
		if ((typeof g_var2obf !== "undefined") && (g_var2obf[pParamName] != undefined)) {
			varId = g_var2obf[pParamName];
		}
		
		// Need to take into account the gml prefix to user defined variables
		var pVar = _pVarsObject[varId];

		if (pVar !== null && pVar !== undefined)
		{
			this.SetParamVar(pParamName, pVar);
		}
	}	

	return true;
};

function yyTempSurface()
{
	this.width = 0;
	this.height = 0;
	this.surfaceID = -1;
	this.frameLastUsed = -1;
	this.inUse = false;
}


// #############################################################################################
/// Function:<summary>
///             Create a new EffectManager management object
///          </summary>
// #############################################################################################
/** @constructor */
function yyEffectsManager()
{
	this.__type = "[EffectManager]";
	this.m_EffectInfo = {};
	this.m_frameID = 0;
	this.m_pScriptInstance = null;

	this.m_TempSurfaces = [];
}

// #############################################################################################
/// Function:<summary>
///             Initialises the effects manager
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.Init = function () 
{
	if(this.m_pScriptInstance !== null)
	{
		this.m_pScriptInstance = null;
	}

	this.m_pScriptInstance = {};

	this.SetupEffectInfo();
};

// #############################################################################################
/// Function:<summary>
///             Cleans the effects manager
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.Clean = function () 
{
	this.m_EffectInfo = {};
	if(this.m_pScriptInstance !== null)
	{
		this.m_pScriptInstance = null;
	}

	var i;
	for(i = 0; i < this.m_TempSurfaces.length; i++)
	{
		var tempSurf = m_TempSurfaces[i];
		if (tempSurf != null)
		{
			surface_free(tempSurf.surfaceID);
		}
	}
	this.m_TempSurfaces = [];
};

// #############################################################################################
/// Function:<summary>
///             Creates and returns a new effect instance
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.CreateNewEffectInstance = function (_effectname, _autogenerated) 
{
	if (_effectname == null)
		return null;

	var pEffectInfo = this.GetEffectInfo(_effectname);

	var codeObject = null;
	if (pEffectInfo.type == FAE_TYPE_EFFECT)
	{
		// Look for a function with a matching name (this should be the constructor)
		var script_id = method_get_index_from_name(pEffectInfo.pScriptOrShaderName);
		if (script_id != -1)
		{
			// Create a new struct using the constructor and store this in a new EffectInstance
			//F_JSNewGMLObject(res, m_pScriptInstance, NULL, 1, &scriptarg);
			codeObject = __yy_gml_object_create(null, script_id);

			// Inject Dispose function into object					
			//res.pObj->Add("@@Dispose@@", JS_SetupFunction(F_Effect_dispose));
		}
	}
	else if (pEffectInfo.type == FAE_TYPE_FILTER)
	{
		// Look for a shader with a matching name
		var shader_id = Shader_Find(pEffectInfo.pScriptOrShaderName);
		if (shader_id != -1)
		{
			var pShader = g_pGMFile.Shaders[shader_id]; //g_shaderPrograms?
			codeObject = new yyFilterHost(pShader, shader_id, pEffectInfo);
		}
	}

	if ((codeObject != null) && (pEffectInfo != null))
	{
		var newEffect = new yyEffectInstance(codeObject, pEffectInfo, _autogenerated);		
		newEffect.SetDefaultValues();

		var bAffectsSingleLayerOnly = false;
		newEffect.SetParam(EFFECT_AFFECT_SINGLE_LAYER_VAR, FAE_PARAM_BOOL, 1, [ bAffectsSingleLayerOnly ]);		// hard code this just now

		return newEffect;
	}

	return null;
};

// #############################################################################################
/// Function:<summary>
///             Sets up the effects for the given/current room
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.SetupRoomEffects = function (_pRoom) 
{
	if (_pRoom == null)
		_pRoom = g_RunRoom;

	if (_pRoom == null)
		return;	

	// Scan through layers in room to find those with "effect_" at the start
	var pool = _pRoom.m_Layers.pool;
	for (var i = pool.length - 1; i >= 0; i--)
	{
		var pLayer = pool[i]; //CLayer
		this.SetupLayerEffect(_pRoom, pLayer);
	}
};

// #############################################################################################
/// Function:<summary>
///             Cleanup the effects for the given/current room
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.CleanRoomEffects = function (_pRoom) 
{
	if (_pRoom == null)
		_pRoom = g_RunRoom;

	if (_pRoom == null)
		return;

	for (var i = 0; i < _pRoom.m_numEffectLayerIDs; i++)
	{
		var pLayer = g_pLayerManager.GetLayerFromID(_pRoom, _pRoom.m_EffectLayerIDs[i]); //CLayer
		if (pLayer != null)
		{
			pLayer.ClearEffect();		// unreferenced effect instances will be garbage collected
		}
	}
	_pRoom.ClearEffectLayerIDs();	
};

// #############################################################################################
/// Function:<summary>
///             Sets up the effects for the given layer
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.SetupLayerEffect = function (_pRoom, _pLayer) 
{
	if (_pLayer == null)
		return;

	var pEffectInfo = _pLayer.GetInitialEffectInfo(); //CLayerEffectInfo
	if (pEffectInfo != null)
	{
		var pEffectInst = this.CreateNewEffectInstance(pEffectInfo.pName, true); //EffectInstance

		if (pEffectInst != null)
		{
			// Store id of effect instance in layer	
			_pLayer.SetEffect(pEffectInst.GetRef());
			_pRoom.AddEffectLayerID(_pLayer.m_id);

			for (var i = 0; i < pEffectInfo.numParams; i++)
			{
				var pParam = pEffectInfo.pParams[i]; //CLayerEffectParam
				pEffectInst.SetParam(pParam.pName, pParam.type, pParam.elements, pParam.defaults_data);
			}
		
			pEffectInst.SetParam(EFFECT_AFFECT_SINGLE_LAYER_VAR, FAE_PARAM_BOOL, 1, [ pEffectInfo.bAffectsSingleLayerOnly ]);
		}
	}
	else
	{
		var isEffectLayer = _pLayer.m_pName.substring(0, EFFECT_LAYER_PREFIX.length) == EFFECT_LAYER_PREFIX;
		var isFilterLayer = _pLayer.m_pName.substring(0, FILTER_LAYER_PREFIX.length) == FILTER_LAYER_PREFIX;

		if (isEffectLayer || isFilterLayer)
		{
			// Found a suitable layer

			// Check to see if we this layer already has an effect
			// We don't want to set up a new effect here if it does
			if (_pLayer.GetEffect() == null)
			{
				var effectname = EFFECT_NAME_PREFIX + _pLayer.m_pName;

				var pEffectInst = this.CreateNewEffectInstance(effectname, true); //EffectInstance

				if (pEffectInst != null)
				{
					// Store id of effect instance in layer	
					_pLayer.SetEffect(pEffectInst.GetRef());
					_pRoom.AddEffectLayerID(_pLayer.m_id);

					pEffectInst.SetParam(EFFECT_AFFECT_SINGLE_LAYER_VAR, FAE_PARAM_BOOL, 1, [ false ]);		// hard code this just now
				}
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Cleanup the effects for the given layer
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.CleanLayerEffect = function (_pRoom, _pLayer) 
{
	if (_pLayer == null)
		return;

	_pLayer.ClearEffect();
};

// #############################################################################################
/// Function:<summary>
///             Update the effects for the given/current room
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.StepEffectsForRoom = function (_pRoom) 
{
	if (_pRoom == null)
		_pRoom = g_RunRoom;

	if (_pRoom == null)
		return;

	for (var i = 0; i < _pRoom.m_numEffectLayerIDs; i++)
	{
		var pLayer = g_pLayerManager.GetLayerFromID(_pRoom, _pRoom.m_EffectLayerIDs[i]); //CLayer
		if (pLayer != null)
		{
			pLayer.m_effectEnabled = pLayer.m_effectToBeEnabled;	// enable this before the step

			if (pLayer.m_visible)
			{
				var pInst = pLayer.GetEffect().instance;
				if (pInst.frame_stepped != this.m_frameID)	// this ensures that even if the same effect is attached to multiple layers, we'll only step it once per frame
				{
					var funcId = "gml" + EFFECT_STEP_FUNC;
					if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_STEP_FUNC] != undefined)) {
						funcId = g_var2obf[EFFECT_STEP_FUNC];
					}

					// Call step function on effect object
					if(pInst.pEffectObj[funcId] !== undefined)
					{
						pInst.pEffectObj[funcId]();
					}
					pInst.frame_stepped = this.m_frameID;
				}

				// Handle cases where no references for the effect instance exist
				if(!pInst.UpdateRefs())
				{
					var funcId = "gml" + EFFECT_CLEANUP_FUNC;
					if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_CLEANUP_FUNC] != undefined)) {
						funcId = g_var2obf[EFFECT_CLEANUP_FUNC];
					}

					if(pInst.pEffectObj[funcId] !== undefined)
					{
						pInst.pEffectObj[funcId]();
					}
				}
			}
		}
	}

	this.CleanupOldTempSurfaces();

	this.m_frameID++;
};

yyEffectsManager.prototype.ExecuteEffectEventsForRoom = function (_eventname, _pRoom, _visibleonly) 
{	
	if (_pRoom == undefined)
		_pRoom = null;

	if (_visibleonly == undefined)
		_visibleonly = false;

	if (_pRoom == null)
		_pRoom = g_RunRoom;

	if (_pRoom == null)
		return;

	for (var i = 0; i < _pRoom.m_numEffectLayerIDs; i++)
	{
		var pLayer = g_pLayerManager.GetLayerFromID(_pRoom, _pRoom.m_EffectLayerIDs[i]); //CLayer
		if ((pLayer != null) && (!_visibleonly || (pLayer.m_visible)))
		{
			var pInst = pLayer.GetEffect().instance;
			
			var funcId = "gml" + _eventname;
			if ((typeof g_var2obf !== "undefined") && (g_var2obf[_eventname] != undefined)) {
				funcId = g_var2obf[_eventname];
			}

			// Call function on effect object
			if(pInst.pEffectObj[funcId] !== undefined)
			{
				pInst.pEffectObj[funcId]();
			}						
		}
	}	
};

// #############################################################################################
/// Function:<summary>
///             Returns whether the given value is an effect
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.IsRValueAnEffect = function (pVal) 
{
	return pVal.instance !== undefined && pVal.instance.__type == "[EffectInstance]";
};

// #############################################################################################
/// Function:<summary>
///             Returns the effect object referenced by the give value
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.GetEffectFromRValue = function (pVal) 
{
	return pVal.instance.pEffectObj;
};

// #############################################################################################
/// Function:<summary>
///             Returns the effect info for the effect with the given name
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.GetEffectInfo = function (_effectname) 
{
	var ppInfo = this.m_EffectInfo[_effectname]; //EffectInfo
	if (ppInfo != null)
	{
		return ppInfo;
	}

	var pInfo = null; //EffectInfo

	// Look for an info string
	var infoname = _effectname + INFO_NAME_POSTFIX;

	var infostring = variable_global_get(infoname);
	if (infostring != null)
	{
		pInfo = new yyEffectInfo();
		pInfo.SetupFromJson(infostring);	
	}

	if (pInfo == null)
	{
		// This should only apply during the dev phase, where we don't have an info string for every filter\effect
		// Set up bare-bones entry
		pInfo = new yyEffectInfo();
		pInfo.pName = _effectname;
		pInfo.pDisplayName = _effectname;

		if ((_effectname.substring(0, EFFECT_LAYER_PREFIX.length) == EFFECT_LAYER_PREFIX)
			|| (_effectname.substring(0, (EFFECT_NAME_PREFIX + EFFECT_LAYER_PREFIX).length) == (EFFECT_NAME_PREFIX + EFFECT_LAYER_PREFIX)))
		{
			pInfo.type = FAE_TYPE_EFFECT;

			// the script name is the same as the effect name
			pInfo.pScriptOrShaderName = _effectname;		
		}
		else
		{
			pInfo.type = FAE_TYPE_FILTER;

			// Construct the name of the shader
			pInfo.pScriptOrShaderName = _effectname + SHADER_NAME_POSTFIX;
		}

	}

	if (pInfo != null)
	{
		this.m_EffectInfo[_effectname] = pInfo;
	}

	return pInfo;
};

// #############################################################################################
/// Function:<summary>
///             Setup the effect info
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.SetupEffectInfo = function () 
{
	// Go through all rooms to find any filters/effects
	// This is temporary pending the info being stored in the WAD

	var numRooms = g_pRoomManager.pRooms.length;
	for (var i = 0; i < numRooms; i++)
	{
		var pRoom = g_pRoomManager.pRooms[i]; //CRoom
		if (pRoom != null)
		{
			// Scan through layers in room to find those with "filter_" or "effect_" at the start
			var pool = pRoom.m_Layers.pool;
			for (var layerIndex = pool.length - 1; layerIndex >= 0; layerIndex--)
			{
				var pLayer = pool[layerIndex]; //CLayer
				if (pLayer != null)
				{
					var pEffectInfo = pLayer.GetInitialEffectInfo(); //CLayerEffectInfo
					if (pEffectInfo != null)
					{
						this.SetupLayerEffect(pRoom, pLayer);
					}
					else
					{
						var isEffectLayer = pLayer.m_pName.substring(0, EFFECT_LAYER_PREFIX.length) == EFFECT_LAYER_PREFIX;
						var isFilterLayer = pLayer.m_pName.substring(0, FILTER_LAYER_PREFIX.length) == FILTER_LAYER_PREFIX;

						if (isEffectLayer || isFilterLayer)
						{
							// Found a suitable layer						
							var effectname = EFFECT_NAME_PREFIX + pLayer.m_pName;
							this.GetEffectInfo(effectname);
							this.SetupLayerEffect(pRoom, pLayer);		// set up effect here too - this means that all effects in all rooms are modifiable at game start
						}
					}
				}
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Add effect info
///          </summary>
// #############################################################################################
yyEffectsManager.prototype.AddEffectInfo = function (_effectname, _effectJSON) 
{
	var pInfo = new yyEffectInfo();
	pInfo.SetupFromJson(_effectJSON);

	this.m_EffectInfo[_effectname] = pInfo;
};

yyEffectsManager.prototype.AcquireTempSurface = function (_width, _height)
{
	var i;
	for(i = 0; i < this.m_TempSurfaces.length; i++)
	{
		var pTempSurf = this.m_TempSurfaces[i];
		if ((pTempSurf != null) && (pTempSurf.inUse == false))
		{
			if ((pTempSurf.width == _width) && (pTempSurf.height == _height))
			{
				if (surface_exists(pTempSurf.surfaceID))
				{
					// Use this one
					pTempSurf.inUse = true;

					return pTempSurf.surfaceID;
				}
			}
		}
	}

	// Need to add a new surface
	var pSurf = new yyTempSurface();
	pSurf.width = _width;
	pSurf.height = _height;
	pSurf.inUse = true;
	pSurf.surfaceID = surface_create(_width, _height, eTextureFormat_A8R8G8B8);
	pSurf.frameLastUsed = -1;		// irrelevant just now

	this.m_TempSurfaces[this.m_TempSurfaces.length] = pSurf;	

	return pSurf.surfaceID;
};

yyEffectsManager.prototype.ReleaseTempSurface = function(_id)
{
	var i;
	for (i = 0; i < this.m_TempSurfaces.length; i++)
	{
		var pTempSurf = this.m_TempSurfaces[i];
		if ((pTempSurf != null) && (pTempSurf.surfaceID == _id))
		{
			if (pTempSurf.inUse == false)
			{
				dbg_csol.Output("Trying to release temp surface %s which isn't in use\n", _id);
			}
			else
			{
				pTempSurf.inUse = false;

				pTempSurf.frameLastUsed = this.m_frameID;
			}
		}
	}
};

yyEffectsManager.prototype.CleanupOldTempSurfaces = function()
{
	var i;
	for (i = 0; i < this.m_TempSurfaces.length;)
	{
		var pTempSurf = this.m_TempSurfaces[i];		
		if (pTempSurf == null)
		{
			// No idea how this could ever happen, but anyway
			this.m_TempSurfaces.splice(i, 1);			
		}
		else
		{
			var freethis = false;
			if ((pTempSurf.inUse == false) && ((this.m_frameID - pTempSurf.frameLastUsed) > 1))
			{
				freethis = true;
			}
			else if (!surface_exists(pTempSurf.surfaceID))
			{
				freethis = true;
			}
			
			if (freethis)
			{
				surface_free(pTempSurf.surfaceID);				

				this.m_TempSurfaces.splice(i, 1);				
			}
			else
			{
				i++;
			}
		}
	}
};