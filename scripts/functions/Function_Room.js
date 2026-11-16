// Removed zero width no break space
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Room.js
// Created:         26/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 26/05/2011		V1.0        MJD     1st version. Functions blocked in.
// 
// **********************************************************************************************************************

var g_InEndGame = false;
var g_fAlreadyFinished = false;


// #############################################################################################
/// Function:<summary>
///             Returns whether a room with the given index exists.
///          </summary>
///
/// In:		 <param name="_ind">room index to check</param>
/// Out:	 <returns>
///				true for yes, false for no.
///			 </returns>
// #############################################################################################
function room_exists( _ind )
{
    if (_ind === undefined) return false;

    var room = g_pRoomManager.Get(yyGetInt32(_ind));
    if ((room === null) || (room == undefined)) {
        return false;
    }
    return true;
}


// #############################################################################################
/// Function:<summary>
///              Returns the name of the room with the given index.
///          </summary>
///
/// In:		 <param name="_ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_get_name(_ind)
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
	if (pRoom === null) return "";
	if ((pRoom.m_pStorage === undefined) || (pRoom.m_pStorage === null)) return "";
    return pRoom.m_pStorage.pName;
}
function room_name(_ind){ return room_get_name(_ind); }


// #############################################################################################
/// Function:<summary>
///             The variable definitions an instance is created with - run the object pre create
///             event then the instance pre creation code with a blank struct as self, undefined
///             if there are none
///          </summary>
// #############################################################################################
function room_get_info_variables(_pObj, _pPreCreateCode)
{
    var hasPreCreate = _pObj && _pObj.REvent[EVENT_PRE_CREATE];
    if (!hasPreCreate && !_pPreCreateCode) return undefined;
    var variables = {};
    variables.__yyIsGMLObject = true;
    if (hasPreCreate) Perform_PreCreate_Struct(_pObj, variables);
    if (_pPreCreateCode) _pPreCreateCode(variables, variables);
    return variables;
}

// #############################################################################################
/// Function:<summary>
///             room_get_info for a running room (the current room, or a persistent room that has
///             been visited) - reports the room as it is now rather than as it was laid out in the
///             room editor, same layout as the C++ runner
///          </summary>
// #############################################################################################
function room_get_info_live(pRoom, _views, _instances, _layers, _layer_elements, _tilemap_data, _variables)
{
    var ret = {};
    ret.__yyIsGMLObject = true;
    var pStorage = pRoom.m_pStorage || {};

    variable_struct_set(ret, "width", pRoom.m_width);
    variable_struct_set(ret, "height", pRoom.m_height);
    variable_struct_set(ret, "persistent", pRoom.m_persistent);
    variable_struct_set(ret, "colour", pRoom.m_color);
    variable_struct_set(ret, "creationCode", pRoom.m_code ? pRoom.m_code : -1);
    // @if feature("physics")
    variable_struct_set(ret, "physicsWorld", pRoom.m_pPhysicsWorld ? true : false);
    variable_struct_set(ret, "physicsGravityX", pStorage.physicsGravityX ? pStorage.physicsGravityX : 0);
    variable_struct_set(ret, "physicsGravityY", pStorage.physicsGravityY ? pStorage.physicsGravityY : 0);
    variable_struct_set(ret, "physicsPixToMeters", pStorage.physicsPixToMeters ? pStorage.physicsPixToMeters : 0);
    // @endif physics
    variable_struct_set(ret, "enableViews", pRoom.m_enableviews);
    variable_struct_set(ret, "clearDisplayBuffer", pRoom.m_ClearDisplayBuffer);
    variable_struct_set(ret, "clearViewportBackground", pRoom.m_ViewClearScreen);

    if (_views) {
        var views = [];
        for (var i = 0; i < pRoom.m_Views.length; i++) {
            var pView = pRoom.m_Views[i];
            if (!pView) continue;
            var v = {};
            v.__yyIsGMLObject = true;
            variable_struct_set(v, "visible", pView.visible);
            variable_struct_set(v, "xview", pView.worldx);
            variable_struct_set(v, "yview", pView.worldy);
            variable_struct_set(v, "wview", pView.worldw);
            variable_struct_set(v, "hview", pView.worldh);
            variable_struct_set(v, "xport", pView.portx);
            variable_struct_set(v, "yport", pView.porty);
            variable_struct_set(v, "wport", pView.portw);
            variable_struct_set(v, "hport", pView.porth);
            variable_struct_set(v, "hborder", pView.hborder);
            variable_struct_set(v, "vborder", pView.vborder);
            variable_struct_set(v, "hspeed", pView.hspeed);
            variable_struct_set(v, "vspeed", pView.vspeed);
            var objid = pView.objid;
            variable_struct_set(v, "object", (objid >= 0) ? ((objid >= 100000) ? MAKE_REF(REFID_INSTANCE, objid) : MAKE_REF(REFID_OBJECT, objid)) : -1);
            variable_struct_set(v, "cameraID", pView.cameraID);
            views[i] = v;
        } // end for
        variable_struct_set(ret, "views", views);
    } // end if

    if (_layers) {
        var layers = [];
        var layerPool = pRoom.m_Layers.pool;
        for (var l = 0; l < layerPool.length; l++) {
            var pLayer = layerPool[l];
            if (!pLayer) continue;
            var newLayer = {};
            newLayer.__yyIsGMLObject = true;
            variable_struct_set(newLayer, "id", pLayer.m_id);
            variable_struct_set(newLayer, "name", pLayer.m_pName);
            variable_struct_set(newLayer, "depth", pLayer.depth);
            variable_struct_set(newLayer, "xoffset", pLayer.m_xoffset);
            variable_struct_set(newLayer, "yoffset", pLayer.m_yoffset);
            variable_struct_set(newLayer, "hspeed", pLayer.m_hspeed);
            variable_struct_set(newLayer, "vspeed", pLayer.m_vspeed);
            variable_struct_set(newLayer, "visible", pLayer.m_visible);
            variable_struct_set(newLayer, "beginScript", pLayer.m_beginScript ? pLayer.m_beginScript : -1);
            variable_struct_set(newLayer, "endScript", pLayer.m_endScript ? pLayer.m_endScript : -1);
            variable_struct_set(newLayer, "effectEnabled", pLayer.m_effectEnabled);
            variable_struct_set(newLayer, "effectToBeEnabled", pLayer.m_effectToBeEnabled);
            variable_struct_set(newLayer, "shaderID", MAKE_REF(REFID_SHADER, pLayer.m_shaderId));

            var pEffectInfo = pLayer.m_pInitialEffectInfo;
            if (pEffectInfo) {
                var effectInfo = {};
                effectInfo.__yyIsGMLObject = true;
                variable_struct_set(effectInfo, "name", pEffectInfo.pName);
                variable_struct_set(effectInfo, "singleLayerOnly", pEffectInfo.bAffectsSingleLayerOnly);
                var effectParams = [];
                for (var p = 0; p < pEffectInfo.pParams.length; p++) {
                    var pParam = pEffectInfo.pParams[p];
                    var param = {};
                    param.__yyIsGMLObject = true;
                    variable_struct_set(param, "name", pParam.pName);
                    variable_struct_set(param, "values", pParam.defaults_data ? pParam.defaults_data.slice() : []);
                    effectParams[p] = param;
                } // end for
                variable_struct_set(effectInfo, "effectParams", effectParams);
                variable_struct_set(newLayer, "effectInfo", effectInfo);
            } // end if

            if (_layer_elements) {
                var elements = [];
                var elPool = pLayer.m_elements.pool;
                for (var e = 0; e < elPool.length; e++) {
                    var pEl = elPool[e];
                    if (!pEl) continue;
                    var element = {};
                    element.__yyIsGMLObject = true;
                    if (pEl.m_name) variable_struct_set(element, "name", pEl.m_name);
                    variable_struct_set(element, "id", pEl.m_id);
                    variable_struct_set(element, "type", pEl.m_type);
                    switch (pEl.m_type) {
                        case eLayerElementType_Background:
                            var pB = pEl.m_pBackground;
                            if (pB) {
                                variable_struct_set(element, "visible", pB.visible);
                                variable_struct_set(element, "sprite_index", MAKE_REF(REFID_SPRITE, pB.index));
                                variable_struct_set(element, "htiled", pB.htiled);
                                variable_struct_set(element, "vtiled", pB.vtiled);
                                variable_struct_set(element, "xscale", pB.xscale);
                                variable_struct_set(element, "yscale", pB.yscale);
                                variable_struct_set(element, "stretch", pB.stretch);
                                variable_struct_set(element, "blendColour", ConvertGMColour(pB.blend) & 0xffffff);
                                variable_struct_set(element, "blendAlpha", pB.alpha);
                                variable_struct_set(element, "image_index", pB.image_index);
                                variable_struct_set(element, "image_speed", pB.image_speed);
                                variable_struct_set(element, "speed_type", pB.playbackspeedtype);
                            } // end if
                            break;
                        case eLayerElementType_Instance:
                            variable_struct_set(element, "inst_id", MAKE_REF(REFID_INSTANCE, pEl.m_instanceID));
                            break;
                        case eLayerElementType_Sprite:
                            variable_struct_set(element, "sprite_index", MAKE_REF(REFID_SPRITE, pEl.m_spriteIndex));
                            variable_struct_set(element, "image_index", pEl.m_imageIndex);
                            variable_struct_set(element, "image_speed", pEl.m_imageSpeed);
                            variable_struct_set(element, "speed_type", pEl.m_playbackspeedtype);
                            variable_struct_set(element, "image_xscale", pEl.m_imageScaleX);
                            variable_struct_set(element, "image_yscale", pEl.m_imageScaleY);
                            variable_struct_set(element, "image_angle", pEl.m_imageAngle);
                            variable_struct_set(element, "image_blend", ConvertGMColour(pEl.m_imageBlend) & 0xffffff);
                            variable_struct_set(element, "image_alpha", pEl.m_imageAlpha);
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            break;
                        case eLayerElementType_Tilemap:
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            variable_struct_set(element, "width", pEl.m_mapWidth);
                            variable_struct_set(element, "height", pEl.m_mapHeight);
                            variable_struct_set(element, "data_mask", pEl.m_tiledataMask);
                            variable_struct_set(element, "tileset_index", MAKE_REF(REFID_TILESET, pEl.m_backgroundIndex));
                            if (_tilemap_data) {
                                var count = pEl.m_mapWidth * pEl.m_mapHeight;
                                var tiles = new Array(count);
                                for (var t = 0; t < count; t++) {
                                    var tv = pEl.m_pTiles[t];
                                    tiles[t] = (tv === undefined) ? 0 : (tv >>> 0);
                                } // end for
                                variable_struct_set(element, "tiles", tiles);
                            } // end if
                            break;
                        case eLayerElementType_ParticleSystem:
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            variable_struct_set(element, "ps", MAKE_REF(REFID_PARTICLESYSTEM, pEl.m_ps));
                            variable_struct_set(element, "xscale", pEl.m_imageScaleX);
                            variable_struct_set(element, "yscale", pEl.m_imageScaleY);
                            variable_struct_set(element, "angle", pEl.m_imageAngle);
                            variable_struct_set(element, "blend", ConvertGMColour(pEl.m_imageBlend) & 0xffffff);
                            variable_struct_set(element, "alpha", pEl.m_imageAlpha);
                            break;
                        case eLayerElementType_Tile:
                            variable_struct_set(element, "visible", pEl.m_visible);
                            variable_struct_set(element, "sprite_index", MAKE_REF(REFID_SPRITE, pEl.m_index));
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            variable_struct_set(element, "width", pEl.m_w);
                            variable_struct_set(element, "height", pEl.m_h);
                            variable_struct_set(element, "image_xscale", pEl.m_imageScaleX);
                            variable_struct_set(element, "image_yscale", pEl.m_imageScaleY);
                            variable_struct_set(element, "image_angle", pEl.m_imageAngle);
                            // tile element blends are stored as they are, the other element blends are stored converted (ConvertGMColour)
                            variable_struct_set(element, "image_blend", pEl.m_imageBlend & 0xffffff);
                            variable_struct_set(element, "image_alpha", pEl.m_imageAlpha);
                            variable_struct_set(element, "xo", pEl.m_xo);
                            variable_struct_set(element, "yo", pEl.m_yo);
                            break;
                        case eLayerElementType_Sequence:
                            variable_struct_set(element, "seq_id", MAKE_REF(REFID_SEQUENCE, pEl.m_sequenceIndex));
                            variable_struct_set(element, "image_speed", pEl.m_imageSpeed);
                            variable_struct_set(element, "image_xscale", pEl.m_scaleX);
                            variable_struct_set(element, "image_yscale", pEl.m_scaleY);
                            variable_struct_set(element, "image_angle", pEl.m_angle);
                            variable_struct_set(element, "image_blend", ConvertGMColour(pEl.m_imageBlend) & 0xffffff);
                            variable_struct_set(element, "image_alpha", pEl.m_imageAlpha);
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            variable_struct_set(element, "head_position", pEl.m_headPosition);
                            break;
                        case eLayerElementType_Text:
                            variable_struct_set(element, "x", pEl.m_x);
                            variable_struct_set(element, "y", pEl.m_y);
                            variable_struct_set(element, "font_index", MAKE_REF(REFID_FONT, pEl.m_fontIndex));
                            variable_struct_set(element, "xscale", pEl.m_scaleX);
                            variable_struct_set(element, "yscale", pEl.m_scaleY);
                            variable_struct_set(element, "angle", pEl.m_angle);
                            variable_struct_set(element, "blend", ConvertGMColour(pEl.m_blend) & 0xffffff);
                            variable_struct_set(element, "alpha", pEl.m_alpha);
                            variable_struct_set(element, "xorigin", pEl.m_originX);
                            variable_struct_set(element, "yorigin", pEl.m_originY);
                            variable_struct_set(element, "origin", pEl.m_origin);
                            variable_struct_set(element, "text", pEl.m_text);
                            variable_struct_set(element, "h_align", pEl.m_alignment & 0xff);
                            variable_struct_set(element, "v_align", (pEl.m_alignment >> 8) & 0xff);
                            variable_struct_set(element, "char_spacing", pEl.m_charSpacing);
                            variable_struct_set(element, "line_spacing", pEl.m_lineSpacing);
                            variable_struct_set(element, "paragraph_spacing", pEl.m_paragraphSpacing);
                            variable_struct_set(element, "frame_width", pEl.m_frameW);
                            variable_struct_set(element, "frame_height", pEl.m_frameH);
                            variable_struct_set(element, "wrap", pEl.m_wrap);
                            variable_struct_set(element, "wrap_mode", pEl.m_wrapMode);
                            break;
                    } // end switch
                    elements.push(element);
                } // end for
                variable_struct_set(newLayer, "elements", elements);
            } // end if
            layers.push(newLayer);
        } // end for
        variable_struct_set(ret, "layers", layers);
    } // end if

    if (_instances) {
        // the room editor placements, so instances that came from the room keep their creation code
        var records = {};
        if (pStorage.pInstances) {
            for (var r = 0; r < pStorage.pInstances.length; r++) {
                var rec = pStorage.pInstances[r];
                if (rec) records[rec.id] = rec;
            } // end for
        } // end if

        // the instances as they are now, active and deactivated, including ones created at runtime
        var instances = [];
        var lists = [pRoom.m_Active.pool, pRoom.m_Deactive.pool];
        for (var li = 0; li < lists.length; li++) {
            var pool = lists[li];
            for (var n = 0; n < pool.length; n++) {
                var pInst = pool[n];
                if (!pInst || pInst.marked) continue;
                var record = records[pInst.id];
                var alpha = Math.round(pInst.image_alpha * 255);
                alpha = (alpha < 0) ? 0 : ((alpha > 255) ? 255 : alpha);

                var inst = {};
                inst.__yyIsGMLObject = true;
                variable_struct_set(inst, "x", pInst.x);
                variable_struct_set(inst, "y", pInst.y);
                // object_index/id cannot go through variable_struct_set (see g_instance_names)
                inst.object_index = pInst.pObject ? pInst.pObject.Name : "";
                inst.id = MAKE_REF(REFID_INSTANCE, pInst.id);
                variable_struct_set(inst, "creation_code", (record && record.pCode) ? record.pCode : -1);
                variable_struct_set(inst, "pre_creation_code", (record && record.pPreCreateCode) ? record.pPreCreateCode : -1);
                variable_struct_set(inst, "xscale", pInst.image_xscale);
                variable_struct_set(inst, "yscale", pInst.image_yscale);
                variable_struct_set(inst, "image_speed", pInst.image_speed);
                variable_struct_set(inst, "image_index", pInst.image_index);
                // __image_blend is the colour as it was set, the image_blend getter converts it (swaps red and blue on the canvas renderer)
                variable_struct_set(inst, "colour", ((alpha << 24) | (pInst.__image_blend & 0xffffff)) >>> 0);
                variable_struct_set(inst, "angle", pInst.image_angle);
                variable_struct_set(inst, "variables", _variables ? room_get_info_variables(pInst.pObject, record ? record.pPreCreateCode : null) : undefined);
                instances.push(inst);
            } // end for
        } // end for
        variable_struct_set(ret, "instances", instances);
    } // end if

    return ret;
}

// _live reports the room as it is now for the current room, or a persistent room that has been visited, otherwise the room as laid out in the room editor
function room_get_info(_ind, _views, _instances, _layers, _layer_elements, _tilemap_data, _live, _variables)
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
    if ((pRoom !== null) && (_live ?? false) && ((pRoom === g_RunRoom) || (pRoom.m_persistent && pRoom.m_Initialised))) {
        return room_get_info_live(pRoom, _views ?? true, _instances ?? true, _layers ?? true, _layer_elements ?? true, _tilemap_data ?? true, _variables ?? false);
    } // end if
    var ret = {};
    ret.__yyIsGMLObject = true;
    if ((pRoom !== null) && (pRoom.m_pStorage !== undefined) && (pRoom.m_pStorage !== null)) {

        _views = _views ?? true;
        _instances = _instances ?? true;
        _layers = _layers ?? true;
        _layer_elements = _layer_elements ?? true;
        _tilemap_data = _tilemap_data ?? true;
        _variables = _variables ?? false;

        var pStorage = pRoom.m_pStorage;
        variable_struct_set(ret, "width", pStorage.width ? pStorage.width : 1024);
        variable_struct_set(ret, "height", pStorage.height ? pStorage.height : 768);
        variable_struct_set(ret, "persistent", pStorage.persistent ? pStorage.persistent : false);
        variable_struct_set(ret, "colour", pStorage.colour ? pStorage.colour : 0xc0c0c0);
        variable_struct_set(ret, "creationCode", pStorage.pCode ? pStorage.pCode : -1);
        // Physics world
        // @if feature("physics")
        variable_struct_set(ret, "physicsWorld", pStorage.physicsWorld ? pStorage.physicsWorld : false);
        if (pStorage.physicsWorld) {
            variable_struct_set(ret, "physicsGravityX", pStorage.physicsGravityX ? pStorage.physicsGravityX : 0);
            variable_struct_set(ret, "physicsGravityY", pStorage.physicsGravityY ? pStorage.physicsGravityY : 0);
            variable_struct_set(ret, "physicsPixToMeters", pStorage.physicsPixToMeters ? pStorage.physicsPixToMeters : 0);
        } // end if
        // @endif physics world storage clone        
        variable_struct_set(ret, "enableViews", pStorage.enableViews ? pStorage.enableViews : false);
        variable_struct_set(ret, "clearDisplayBuffer", pStorage.clearDisplayBuffer ? pStorage.clearDisplayBuffer : true);
        variable_struct_set(ret, "clearViewportBackground", pStorage.clearViewportBackground ? pStorage.clearViewportBackground : true);
        if (_views) {
            var views = new Array(pStorage.views.length);
            for (var i = 0; i < pStorage.views.length; i++) 
            {        
                var sourceView = pStorage.views[i];
                if (sourceView) 
                {
                    var v = {};
                    v.__yyIsGMLObject = true;
                    variable_struct_set(v, "visible", sourceView.visible ? sourceView.visible : false);
                    variable_struct_set(v, "xview", sourceView.xview ? sourceView.xview : 0);
                    variable_struct_set(v, "yview", sourceView.yview ? sourceView.yview : 0);
                    variable_struct_set(v, "wview", sourceView.wview ? sourceView.wview : 640);
                    variable_struct_set(v, "hview", sourceView.hview ? sourceView.hview : 480);
                    variable_struct_set(v, "xport", sourceView.xport ? sourceView.xport : 0);
                    variable_struct_set(v, "yport", sourceView.yport ? sourceView.yport : 0);
                    variable_struct_set(v, "wport", sourceView.wport ? sourceView.wport : 640);
                    variable_struct_set(v, "hport", sourceView.hport ? sourceView.hport : 480);
                    variable_struct_set(v, "hborder", sourceView.hborder ? sourceView.hborder : 32);
                    variable_struct_set(v, "vborder", sourceView.vborder ? sourceView.vborder : 32);
                    variable_struct_set(v, "hspeed", sourceView.hspeed ? sourceView.hspeed : -1);
                    variable_struct_set(v, "vspeed", sourceView.vspeed ? sourceView.vspeed : -1);
                    var indexref = sourceView.index ? ((sourceView.index >= 100000) ? MAKE_REF(REFID_INSTANCE, sourceView.index) : MAKE_REF(REFID_OBJECT, sourceView.index)): -1;
                    variable_struct_set(v, "object", indexref);
                    variable_struct_set(v, "cameraID", sourceView.cameraID ? sourceView.cameraID : -1);
                    views[i] = v;
                } // end if            
            } // end for        
            variable_struct_set(ret, "views", views);
        } // end if       

        if (_instances) {
            // Instances
            var instances = new Array(pStorage.pInstances.length);
            for (var i = 0; i < pStorage.pInstances.length; i++) 
            {
                var sourceInstance = pStorage.pInstances[i];
                if (sourceInstance) 
                {
                    var pObj = g_pObjectManager.Get(yyGetInt32(sourceInstance.index));
                    var inst = {};
                    inst.__yyIsGMLObject = true;
                    variable_struct_set(inst, "x", sourceInstance.x ? sourceInstance.x : 0);
                    variable_struct_set(inst, "y", sourceInstance.y ? sourceInstance.y : 0);
                    
			//broken as object_index/id cannot be set on objects as per g_instance_names
			//variable_struct_set(inst, "object_index", pObj.Name);
			//variable_struct_set(inst, "id", sourceInstance.id);

            //unsafe fixes
			inst.object_index = pObj.Name;
            inst.id = sourceInstance.id;
                    
                    //for some reason room instances now internally use the "rotation" variable, instead of angle
                    variable_struct_set(inst, "angle", sourceInstance.rotation ? sourceInstance.rotation : 0);
                    //variable_struct_set(inst, "angle", sourceInstance.angle ? sourceInstance.angle : 0);

                    variable_struct_set(inst, "xscale", sourceInstance.scaleX ? sourceInstance.scaleX : 1);
                    variable_struct_set(inst, "yscale", sourceInstance.scaleY ? sourceInstance.scaleY : 1);
                    variable_struct_set(inst, "image_speed", sourceInstance.imageSpeed ? sourceInstance.imageSpeed : 1);
                    variable_struct_set(inst, "image_index", sourceInstance.imageIndex ? sourceInstance.imageIndex : 0);
                    variable_struct_set(inst, "colour", sourceInstance.image_blend ? sourceInstance.image_blend : 0x00ffffff);
                    variable_struct_set(inst, "creation_code", sourceInstance.pCode ? sourceInstance.pCode : -1);
                    variable_struct_set(inst, "pre_creation_code", sourceInstance.pPreCreateCode ? sourceInstance.pPreCreateCode : -1);

                    // the variable definitions this instance will be created with, undefined if they were not asked for or there are none
                    variable_struct_set(inst, "variables", _variables ? room_get_info_variables(pObj, sourceInstance.pPreCreateCode) : undefined);
                    instances[i] = inst;
                } // end if
            } // end for     
            variable_struct_set(ret, "instances", instances);

        } // end if   

        if (_layers) {
            // Layers
            var layers = new Array( pStorage.layers.length );
            for ( var i = 0; i < pStorage.layers.length; i++ )
            {
                var sourceLayer = pStorage.layers[i];
                if ( sourceLayer != null )
                {
                    // Shared properties
                    var newLayer = {};
                    newLayer.__yyIsGMLObject = true;
                    variable_struct_set(newLayer, "name", sourceLayer.pName ? sourceLayer.pName : "");
                    variable_struct_set(newLayer, "id", sourceLayer.id ? sourceLayer.id : 0);
                    variable_struct_set(newLayer, "type", sourceLayer.type ? sourceLayer.type : 0);
                    variable_struct_set(newLayer, "depth", sourceLayer.depth ? sourceLayer.depth : 0);
                    variable_struct_set(newLayer, "xoffset", sourceLayer.x ? sourceLayer.x : 0);
                    variable_struct_set(newLayer, "yoffset", sourceLayer.y ? sourceLayer.y : 0);
                    variable_struct_set(newLayer, "hspeed", sourceLayer.hspeed ? sourceLayer.hspeed : 0);
                    variable_struct_set(newLayer, "vspeed", sourceLayer.vspeed ? sourceLayer.vspeed : 0);
                    variable_struct_set(newLayer, "visible", sourceLayer.visible ? sourceLayer.visible : true);
                    variable_struct_set(newLayer, "effectEnabled", sourceLayer.effectEnabled ? sourceLayer.effectEnabled : true);
                    variable_struct_set(newLayer, "effectType", sourceLayer.effectType ? sourceLayer.effectType : -1);

                    // Copy effect properties
                    // @if feature("layerEffects")
                    var effectParams = new Array( sourceLayer.effectProperties.length );

                    var effectPropIdx;
                    for (effectPropIdx = 0; effectPropIdx < sourceLayer.effectProperties.length; effectPropIdx++) 
                    {
                        var param = {};
                        param.__yyIsGMLObject = true;
                        variable_struct_set(param, "type", sourceLayer.effectProperties[effectPropIdx].type);
                        variable_struct_set(param, "name", sourceLayer.effectProperties[effectPropIdx].name);
                        variable_struct_set(param, "value", sourceLayer.effectProperties[effectPropIdx].value);
                        effectParams[effectPropIdx] = param;
                    }
                    variable_struct_set(newLayer, "effectParams", effectParams);
                    // @endif
                    // Store cloned layer
                    layers[i] = newLayer;

                    if (_layer_elements) {
                        var elements = [];
                        // Type-specific properties
                        switch(sourceLayer.type)
                        {
                            case YYLayerType_Background:
                                var element = {};
                                element.__yyIsGMLObject = true;
                                variable_struct_set( element, "type", sourceLayer.type );
                                elements[0] = element;
                                variable_struct_set( element, "visible", sourceLayer.bvisible ? sourceLayer.bvisible : true );
                                variable_struct_set( element, "foreground", sourceLayer.bforeground ?  sourceLayer.bforeground : false);
                                variable_struct_set( element, "sprite_index", sourceLayer.bindex ? MAKE_REF(REFID_SPRITE, sourceLayer.bindex) : 0 );
                                variable_struct_set( element, "htiled", sourceLayer.bhtiled ? sourceLayer.bhtiled : false );
                                variable_struct_set( element, "vtiled", sourceLayer.bvtiled ? sourceLayer.bvtiled : false );
                                variable_struct_set( element, "stretch", sourceLayer.bstretch ?  sourceLayer.bstretch : false);
                                variable_struct_set( element, "blendColour", sourceLayer.bblend ? sourceLayer.bblend & 0xffffff : 0x00ffffff);
                                variable_struct_set( element, "blendAlpha", sourceLayer.bblend ? (((sourceLayer.bblend & 0xff000000)>>24)&0xff)/255 : 1);
                                variable_struct_set( element, "image_speed", sourceLayer.bimage_speed ?  sourceLayer.bimage_speed : 1);
                                variable_struct_set( element, "image_index", sourceLayer.bimage_index ? sourceLayer.bimage_index : 0 );
                                variable_struct_set( element, "speed_type", sourceLayer.playbackspeedtype ? sourceLayer.playbackspeedtype : 0 );
                                break;

                            case YYLayerType_Instance:
                                elements = new Array( sourceLayer.iinstIDs.length );
                                for( var ii=0; ii < sourceLayer.iinstIDs.length; ++ii) {
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", sourceLayer.type );
                                    variable_struct_set( element, "inst_id", MAKE_REF(REFID_INSTANCE, sourceLayer.iinstIDs[ii]) );
                                    elements[ii] = element;
                                } // end for
                                break;

                            case YYLayerType_Tile:
                                var element = {};
                                element.__yyIsGMLObject = true;
                                variable_struct_set( element, "type", sourceLayer.type );
                                elements[0] = element;
                                variable_struct_set( element, "x", 0 );
                                variable_struct_set( element, "y", 0 );
                                variable_struct_set( element, "width", sourceLayer.tMapWidth ? sourceLayer.tMapWidth : 0 );
                                variable_struct_set( element, "height", sourceLayer.tMapHeight ? sourceLayer.tMapHeight : 0 );
                                variable_struct_set( element, "tileset_index", sourceLayer.tIndex ? MAKE_REF(REFID_TILESET, sourceLayer.tIndex) : 0 );
                                if (_tilemap_data)
                                    variable_struct_set( element, "tiles", sourceLayer.ttiles ? expandTiles(sourceLayer.ttiles) : [] );
                                break;

                            case YYLayerType_Asset:
                                var assetIdx;

                                // Assets/tiles
                                for (assetIdx = 0; assetIdx < sourceLayer.assets.length; assetIdx++) 
                                {
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", 7 );
                                    variable_struct_set( element, "x", sourceLayer.assets[assetIdx].ax);
                                    variable_struct_set( element, "y", sourceLayer.assets[assetIdx].ay);
                                    variable_struct_set( element, "sprite_index", MAKE_REF(REFID_SPRITE, sourceLayer.assets[assetIdx].aindex));
                                    variable_struct_set( element, "xo", sourceLayer.assets[assetIdx].aXO);
                                    variable_struct_set( element, "yo", sourceLayer.assets[assetIdx].aYO);
                                    variable_struct_set( element, "width", sourceLayer.assets[assetIdx].aW);
                                    variable_struct_set( element, "height", sourceLayer.assets[assetIdx].aH);
                                    variable_struct_set( element, "id", sourceLayer.assets[assetIdx].aId);
                                    variable_struct_set( element, "image_xscale", sourceLayer.assets[assetIdx].aXScale);
                                    variable_struct_set( element, "image_yscale", sourceLayer.assets[assetIdx].aYScale);
                                    variable_struct_set( element, "image_blend", sourceLayer.assets[assetIdx].aBlend & 0x00ffffff );
                                    variable_struct_set( element, "image_alpha", (((sourceLayer.assets[assetIdx].aBlend & 0xff000000) >> 24)&0xff)/255);
                                    variable_struct_set( element, "visible", true );
                                    elements.push(element);
                                } // end for

                                // Sprites
                                for ( assetIdx = 0; assetIdx < sourceLayer.sprites.length; assetIdx++ )
                                {
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", 4 );
                                    variable_struct_set( element, "id", sourceLayer.sprites[assetIdx].sName);
                                    variable_struct_set( element, "sprite_index", MAKE_REF(REFID_SPRITE, sourceLayer.sprites[assetIdx].sIndex));
                                    variable_struct_set( element, "x", sourceLayer.sprites[assetIdx].sX);
                                    variable_struct_set( element, "y", sourceLayer.sprites[assetIdx].sY);
                                    variable_struct_set( element, "image_xscale", sourceLayer.sprites[assetIdx].sXScale);
                                    variable_struct_set( element, "image_yscale", sourceLayer.sprites[assetIdx].sYScale);
                                    variable_struct_set( element, "image_blend", sourceLayer.sprites[assetIdx].sBlend & 0x00ffffff );
                                    variable_struct_set( element, "image_alpha", (((sourceLayer.sprites[assetIdx].sBlend & 0xff000000) >>24)&0xff)/255);
                                    variable_struct_set( element, "speed_type", sourceLayer.sprites[assetIdx].sPlaybackSpeedType);
                                    variable_struct_set( element, "image_speed", sourceLayer.sprites[assetIdx].sImageSpeed);
                                    variable_struct_set( element, "image_index", sourceLayer.sprites[assetIdx].sImageIndex);
                                    variable_struct_set( element, "image_angle", sourceLayer.sprites[assetIdx].sRotation);
                                    elements.push(element);
                                } // end for

                                // Sequences
                                for (assetIdx = 0; assetIdx < sourceLayer.sequences.length; assetIdx++)
                                {
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", 8 );
                                    variable_struct_set( element, "id", sourceLayer.sequences[assetIdx].sName);
                                    variable_struct_set( element, "seq_id", MAKE_REF(REFID_SEQUENCE, sourceLayer.sequences[assetIdx].sIndex));
                                    variable_struct_set( element, "x", sourceLayer.sequences[assetIdx].sX);
                                    variable_struct_set( element, "y", sourceLayer.sequences[assetIdx].sY);
                                    variable_struct_set( element, "image_xscale", sourceLayer.sequences[assetIdx].sXScale);
                                    variable_struct_set( element, "image_yscale", sourceLayer.sequences[assetIdx].sYScale);
                                    variable_struct_set( element, "image_blend", sourceLayer.sequences[assetIdx].sBlend & 0x00ffffff );
                                    variable_struct_set( element, "image_alpha", (((sourceLayer.sequences[assetIdx].sBlend & 0xff000000)>>24)&0xff)/255);
                                    variable_struct_set( element, "speed_type", sourceLayer.sequences[assetIdx].sPlaybackSpeedType);
                                    variable_struct_set( element, "image_speed", sourceLayer.sequences[assetIdx].sImageSpeed);
                                    variable_struct_set( element, "head_position", sourceLayer.sequences[assetIdx].sHeadPosition);
                                    variable_struct_set( element, "angle", sourceLayer.sequences[assetIdx].sRotation);
                                    elements.push(element);
                                } // end for                                

                                // Particles
                                for (assetIdx = 0; assetIdx < sourceLayer.particles.length; assetIdx++)
                                {
                                    var srcParticle = sourceLayer.particles[assetIdx];
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", 6 );
                                    variable_struct_set( element, "id", srcParticle.sName );
                                    variable_struct_set( element, "ps", MAKE_REF(REFID_PARTICLESYSTEM, srcParticle.sIndex) );
                                    variable_struct_set( element, "x", srcParticle.sX);
                                    variable_struct_set( element, "y", srcParticle.sY);
                                    variable_struct_set( element, "xscale", srcParticle.sXScale);
                                    variable_struct_set( element, "yscale", srcParticle.sYScale);
                                    variable_struct_set( element, "blend", srcParticle.sBlend & 0x00ffffff);
                                    variable_struct_set( element, "alpha", (((srcParticle.sBlend & 0xff000000)>>24)&0xff)/255);
                                    variable_struct_set( element, "angle", srcParticle.sRotation);
                                    elements.push(element);
                                } // end for

                                // Text items
                                for (assetIdx = 0; assetIdx < sourceLayer.textitems.length; assetIdx++)
                                {
                                    var element = {};
                                    element.__yyIsGMLObject = true;
                                    variable_struct_set( element, "type", 9 );
                                    variable_struct_set( element, "id", sourceLayer.textitems[assetIdx].sName);
                                    variable_struct_set( element, "font_id", MAKE_REF(REFID_FONT, sourceLayer.textitems[assetIdx].sFontIndex));
                                    variable_struct_set( element, "text", sourceLayer.textitems[assetIdx].sText);
                                    variable_struct_set( element, "x", sourceLayer.textitems[assetIdx].sX);
                                    variable_struct_set( element, "y", sourceLayer.textitems[assetIdx].sY);
                                    variable_struct_set( element, "xorigin", sourceLayer.textitems[assetIdx].sXOrigin);
                                    variable_struct_set(element, "yorigin", sourceLayer.textitems[assetIdx].sYOrigin);
                                    variable_struct_set(element, "origin", sourceLayer.textitems[assetIdx].sOrigin);
                                    variable_struct_set( element, "h_align", sourceLayer.textitems[assetIdx].sAlignment & 0xff);
                                    variable_struct_set( element, "v_align", (sourceLayer.textitems[assetIdx].sAlignment >> 8) & 0xff);
                                    variable_struct_set( element, "char_spacing", sourceLayer.textitems[assetIdx].sCharSpacing);
                                    variable_struct_set( element, "line_spacing", sourceLayer.textitems[assetIdx].sLineSpacing);
                                    variable_struct_set( element, "paragraph_spacing", sourceLayer.textitems[assetIdx].sParagraphSpacing);
                                    variable_struct_set( element, "frame_width", sourceLayer.textitems[assetIdx].sFrameW);
                                    variable_struct_set( element, "frame_height", sourceLayer.textitems[assetIdx].sFrameH);
                                    variable_struct_set(element, "wrap", sourceLayer.textitems[assetIdx].sWrap);
                                    variable_struct_set(element, "wrap_mode", sourceLayer.textitems[assetIdx].sWrapMode);
                                    variable_struct_set( element, "xscale", sourceLayer.textitems[assetIdx].sXScale);
                                    variable_struct_set( element, "yscale", sourceLayer.textitems[assetIdx].sYScale);
                                    variable_struct_set( element, "blend", sourceLayer.textitems[assetIdx].sBlend & 0x00ffffff );
                                    variable_struct_set( element, "alpha", (((sourceLayer.textitems[assetIdx].sBlend & 0xff000000)>>24)&0xff)/255);
                                    variable_struct_set( element, "angle", sourceLayer.textitems[assetIdx].sRotation);
                                    elements.push(element);
                                } // end for

                                break;
                            case YYLayerType_Effect:
                                //newLayer.effectInfo = sourceLayer.m_pInitialEffectInfo;
                                //variable_struct_set(newLayer, "effectType", sourceLayer.effectType ? sourceLayer.effectType : -1);
                                //var effectInfo = {}
                                //effectInfo.__yyIsGMLObject = true;
                                //variable_struct_set( effectInfo, "name", sourceLayer.m_pInitialEffectInfo.pName);
                                //variable_struct_set( effectInfo, "singleLayerOnly", sourceLayer.m_pInitialEffectInfo.bAffectsSingleLayerOnly);
                                //var effectParams = new Array( sourceLayer.m_pInitialEffectInfo.pParams.length );
                                //for( var pp=0; pp<sourceLayer.m_pInitialEffectInfo.pParams.length; ++pp) {
                                //    var p = sourceLayer.m_pInitialEffectInfo.pParams[pp];
                                //    var param = {};
                                //    param.__yyIsGMLObject = true;
                                //    variable_struct_set( param, "singleLayerOnly", sourceLayer.m_pInitialEffectInfo.bAffectsSingleLayerOnly);
                                //    effectParams[pp] = param;
                                //} // end for
                                //variable_struct_set( newLayer, "effectInfo", effectInfo);
                                break;
                        } // end switch
                        variable_struct_set(newLayer, "elements", elements);
                    } // end if
                } // end if
            } // end for
            variable_struct_set(ret, "layers", layers);
        } // end if
    } // end if
    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Sets the width for the room with the indicated index.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_w"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_set_width(_ind,_w) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
    if( pRoom===null ) return;
    pRoom.m_pStorage.width = yyGetInt32(_w);
}

// #############################################################################################
/// Function:<summary>
///              Sets the height for the room with the indicated index.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_h"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_set_height(_ind,_h)
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
    if( pRoom===null ) return;
    pRoom.m_pStorage.height = yyGetInt32(_h);
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the room with the indicated index is persistent or not.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_set_persistent(_ind, _val) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
    if( pRoom===null ) return;
    
    var persistent = yyGetBool(_val);
    pRoom.m_pStorage.persistent = persistent;
}



// #############################################################################################
/// Function:<summary>
///             Sets the color properties for the room with the indicated index if is does 
///             not have a background image. col indicates the color and show indicates whether 
///             the color must be shown or not.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_colour"></param>
///			 <param name="_show"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_set_background_color(_ind,_colour,_show) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
    if( pRoom===null ) return;
    pRoom.m_pStorage.colour = yyGetInt32(_colour);
    pRoom.m_pStorage.showColour = yyGetBool(_show);

}
// @if function("room_set_background_colour")
var room_set_background_colour = room_set_background_color;
// @endif




// ########################################################
//  Function:   Get a camera from a storage room
//  In:     _roomindex = ID of room (not current one)
//          _viewindex = index of view to get
// ########################################################
function room_get_camera(_roomindex, _viewindex)
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_roomindex));
    if (pRoom) {
        var view_array = pRoom.m_pStorage.views;
        if (!view_array) return -1;
        var view = view_array[yyGetInt32(_viewindex)];

        if (view) {
            if (view.cameraID !== undefined) {
                return view.cameraID;
            }
        }
	}
    
    return -1;
}

// ########################################################
//  Function:   Set a camera from in a storage room
//  In:     _roomindex = ID of room (not current one)
//          _viewindex = index of view to get
//          _camid     = index of camera (non-cloned)
// ########################################################
function room_set_camera(_roomindex, _viewindex, _camid)
{
    _viewindex = yyGetInt32(_viewindex);

    var pRoom = g_pRoomManager.Get(yyGetInt32(_roomindex));
    if (pRoom) {
        var view_array = pRoom.m_pStorage.views;
        if (!view_array)
        {
            // if views don't exist - then make them
            pRoom.m_pStorage.views = [];
            view_array = pRoom.m_pStorage.views;
            for (var i = 0; i < 8; i++) {
                view_array[i] = {};
            }
        }
        var view = view_array[_viewindex];
        if (!view) {
            view_array[_viewindex] = {};
            view = view_array[_viewindex];
        }
        view.cameraID = yyGetInt32(_camid);
    }
}


// ########################################################
//  Function:   Get a viewport from a room storage
//  In:     _roomindex = ID of room (not current one)
//          _viewindex = index of view to get
// ########################################################
function room_get_viewport(_roomindex, _viewindex)
{

    var ret=[];
    ret[0]= 0;      // setup defaults
    ret[1]= 0;
    ret[2]= 0;
    ret[3]= 640;    // default yyView values
    ret[4]= 480;

    var pRoom = g_pRoomManager.Get(yyGetInt32(_roomindex));
    if (pRoom) 
    {
        var view_array = pRoom.m_pStorage.views;
        if (view_array) {
            var view = view_array[yyGetInt32(_viewindex)];
	       	    
            if(view)
            {
                if(view.visible!==undefined) ret[0]= view.visible;
                if(view.xport !== undefined) ret[1]= view.xport;
                if(view.yport !== undefined) ret[2]= view.yport;
                if(view.wport !== undefined) ret[3]= view.wport;
                if(view.hport !== undefined) ret[4]= view.hport;
                return ret;
            }   
        }
    }
    
    ret[0]= 0;
    ret[1]= 0;
    ret[2]= 0;
    ret[3]= 0;
    ret[4]= 0;
    return ret;

}

// ########################################################
//  Function:   Set a viewport from in room storage
//  In:     _roomindex = ID of room (not current one)
//          _viewindex = index of view to get
// ########################################################
function room_set_viewport(_roomindex, _viewindex, _visible, _xport, _yport, _wport, _hport)
{
    _viewindex = yyGetInt32(_viewindex);

    var pRoom = g_pRoomManager.Get(yyGetInt32(_roomindex));
	if (pRoom) 
	{
	    if (pRoom.m_pStorage) {
	        var view = pRoom.m_pStorage.views;
	        if (!view) {
                // if views don't exist - then make them
	            pRoom.m_pStorage.views = [];
	            for(var i=0;i<8;i++){
	                pRoom.m_pStorage.views[i] = {};
	            }
	        }
	        view = view[_viewindex];
	        if (view === undefined){
	            view[_viewindex] = {};
	            view = view[_viewindex];
            }
	        view.visible = yyGetBool(_visible);
	        view.xport = yyGetInt32(_xport);
	        view.yport = yyGetInt32(_yport);
	        view.wport = yyGetInt32(_wport);
	        view.hport = yyGetInt32(_hport);
	    }
    }
}




// #############################################################################################
/// Function:<summary>
///             Sets whether views must be enabled for the room with the indicated index.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_set_view_enabled(_ind, _val) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
	if (pRoom) {
	    pRoom.m_pStorage.enableViews = yyGetBool(_val); 	// change actual storage...
	}
}

// #############################################################################################
/// Function:<summary>
///             Adds a new room. It returns the index of the room. Note that the room will not be
///             part of the room order. So the new room does not have a previous or a next room. 
///             If you want to move to an added room you must provide the index of the room.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_add() 
{
    var pRoom = new yyRoom();
    pRoom.CreateEmptyStorage();
    g_pRoomManager.Add(pRoom);
    
    return pRoom.id;
}


// #############################################################################################
/// Function:<summary>
///             Adds a copy of the room with the given index. It returns the index of the room.
///          </summary>
///
/// In:		 <param name="_ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_duplicate(_ind) 
{
    _ind = yyGetInt32(_ind);

    var pRoom = g_pRoomManager.Get(_ind);
    if (!pRoom) {
    
        debug("Trying to duplicate non-existent room.");
        return 0;
    }
    
    return g_pRoomManager.DuplicateRoom(_ind);
}

// #############################################################################################
/// Function:<summary>
///             Assigns the indicated room to room ind. So this makes a copy of the room.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_room"></param>
/// Out:	 <returns>
///				Whether or not it was able to successfully complete the operation
///			 </returns>
// #############################################################################################
function room_assign(_ind,_room) 
{
    _ind = yyGetInt32(_ind);
    _room = yyGetInt32(_room);

    if (g_pRoomManager.Get(_ind) && g_pRoomManager.Get(_room)) {
        g_pRoomManager.AssignRoom(_ind, _room);
        return true;
    }
    
    return false;
}


// #############################################################################################
/// Function:<summary>
///             Adds a new instance of object obj to the room, placing it at the indicate position. 
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_obj"></param>
/// Out:	 <returns>
///				The index of the instance.
///			 </returns>
// #############################################################################################
function room_instance_add(_ind,_x,_y,_obj) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
	if (pRoom) {
	
	    // Allocate the instance ID
	    var instance_id = g_room_maxid++;
    
        // Add the instance to the storage of the room
        var instanceIndex = pRoom.m_pStorage.pInstances.length;
        pRoom.m_pStorage.pInstances[instanceIndex] = { 
            x: yyGetReal(_x), 
            y: yyGetReal(_y), 
            index: yyGetInt32(_obj), 
            id: instance_id };

        if(!g_DoneFirstRoomCreation)
        {
            var storageIndex = pRoom.m_pStorage.creationOrderIds.length;
            pRoom.m_pStorage.creationOrderIds[storageIndex] = instance_id;
        }  
        pRoom.m_creationOrder.push(pRoom.m_pStorage.pInstances[instanceIndex]);

		return MAKE_REF(REFID_INSTANCE, instance_id);
	}
	
	return 0;
}


// #############################################################################################
/// Function:<summary>
///             Removes all instances from the indicated room.
///          </summary>
///
/// In:		 <param name="_ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_instance_clear(_ind) 
{
    var pRoom = g_pRoomManager.Get(yyGetInt32(_ind));
	if (pRoom) {
        pRoom.ClearInstancesFromStorage();
    }
}


// #############################################################################################
/// Function:<summary>
///             Goto next room..
///          </summary>
// #############################################################################################
function room_goto_next()
{    
    if( (g_RunRoom.actualroom+1)>=g_pRoomManager.pRooms.length ) return;
    New_Room = g_pRoomManager.GetOrder(g_RunRoom.actualroom + 1).id;
}


// #############################################################################################
/// Function:<summary>
///             Goto next room..
///          </summary>
// #############################################################################################
function room_restart()
{    
    New_Room = g_RunRoom.id;
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_room"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_goto( _room )
{
    _room = yyGetInt32(_room);

    var nextRoom = g_pRoomManager.Get(_room);
    if ((nextRoom == null) || (nextRoom == undefined)) {
        ErrorOnce("Error: Room " + _room + " is not a valid room index");
    }
    else {        
        New_Room = _room;
    }        
};



// #############################################################################################
/// Function:<summary>
///             Goto previous room..
///          </summary>
// #############################################################################################
function room_goto_previous()
{    
    if( (g_RunRoom.actualroom-1)<0 ) return;
    New_Room = g_pRoomManager.GetOrder(g_RunRoom.actualroom - 1).id;
};


// #############################################################################################
/// Function:<summary>
///             Return the index of the room before numb (-1 = none) but don't go there.
///          </summary>
///
/// In:		 <param name="_numb"></param>
/// Out:	 <returns>
///				The previous room
///			 </returns>
// #############################################################################################
function room_previous(_numb) 
{
	var prev = -1;

    for(var i=0;i<g_pRoomManager.m_RoomOrder.length; i++)
    {
        if( g_pRoomManager.m_RoomOrder[i] == yyGetInt32(_numb) ) return prev;
        prev = g_pRoomManager.m_RoomOrder[i];
    }
    return -1;
};

// #############################################################################################
/// Function:<summary>
///             Return the index of the room after numb (-1 = none).
///          </summary>
///
/// In:		 <param name="_numb"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function room_next(_numb) 
{
    for(var i=0;i<(g_pRoomManager.m_RoomOrder.length-1); i++)
    {
        if( g_pRoomManager.m_RoomOrder[i] == yyGetInt32(_numb) ) {
            return g_pRoomManager.m_RoomOrder[i+1];
        }
    }
    return -1;
};


// #############################################################################################
/// Function:<summary>
///             Ends the game
///          </summary>
///
// #############################################################################################
function game_end()
{
    New_Room = ROOM_ENDOFGAME;

    if (g_InEndGame == false)
    {
        g_InEndGame = true;
        if (typeof (gmlGameEndScripts) == "function")
        {            
            gmlGameEndScripts();
        } // end if        
    }

    if (!g_fAlreadyFinished) {
        // RK:: This message is here so that HTML5 tests can end without timing out... please do not change or remove
        if (arguments.length > 0)
            show_debug_message("###game_end###" + arguments[0]);
        else
            show_debug_message("###game_end###0");
        g_fAlreadyFinished = true;
    } // end if
}

// #############################################################################################
/// Function:<summary>
///             Restarts the game
///          </summary>
///
// #############################################################################################
function game_restart()
{
	g_pBuiltIn.score = 0;
	g_pBuiltIn.lives = 0;
	g_pBuiltIn.health = 100;
	New_Room = ROOM_RESTARTGAME;
}
