
// **********************************************************************************************************************
// 
// Copyright (c)2016, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Layers.js
// Created:         17/02/2016
// Author:          Fritz
// Project:         HTML5
// Description:     
// 
// 
// **********************************************************************************************************************

var YYLayerType_Undefined = 0,
YYLayerType_Background=1,
YYLayerType_Instance=2,
YYLayerType_Asset=3,
YYLayerType_Tile=4,
YYLayerType_Particle=5,
YYLayerType_Effect=6;


var	eLayerElementType_Undefined = 0,
	eLayerElementType_Background=1,
	eLayerElementType_Instance=2,
	eLayerElementType_OldTilemap=3,
	eLayerElementType_Sprite=4,
	eLayerElementType_Tilemap=5,
    eLayerElementType_ParticleSystem=6,
    eLayerElementType_Tile = 7,					// probably replace a single oldtilemap with a whole bunch of these
    eLayerElementType_Sequence = 8,
    eLayerElementType_Effect = 9;

var TileInherit_Shift = 31;
var TileFlip_Shift = 29;
var TileMirror_Shift = 28;
var TileRotate_Shift = 30;

var TileInherit_Mask = (1 << TileInherit_Shift);	// don't care about this bit in the runner
var TileFlip_Mask = (1 << TileFlip_Shift);
var TileMirror_Mask = (1 << TileMirror_Shift);
var TileRotate_Mask = (1 << TileRotate_Shift);					

var TileScaleRot_Shift = TileMirror_Shift;
var TileScaleRot_Mask = (0x7 << TileScaleRot_Shift);
var TileScaleRot_ShiftedMask = 0x7;

var TileIndex_Shift = 0;
var TileIndex_Mask = (0x7ffff << TileIndex_Shift);
var TileIndex_ShiftedMask = (0x7ffff);

/** @constructor */
function CBackGM2()
{
	this.visible=true;				// whether to show the background at start
    this.foreground=false;			// whether forground rather than background
    this.index=0;					// sprite index
    //float	x,y;					// position of the image (in pixels)
    this.htiled=false;
    this.vtiled=false;			    // whether tiled (if image)
    //float	hspeed,vspeed;			// scrolling speed (if image)
    this.xscale=1.0;
    this.yscale=1.0;
    this.stretch=false;
    this.blend=0;					// blending color
    this.alpha=1.0;					// alpha transparency factor
    this.playbackspeedtype = ePlaybackSpeedType_FramesPerSecond;       // 0 = frames per second (default), 1 = frames per game frame
    this.playbackspeed=0;           // actual image playback speed
	this.image_speed=0;             // scaler (starts at 1)
	this.image_index=0;
};
/** @constructor */
function CLayer()
{
this.m_id=0;
this.depth =0;
this.m_xoffset=0;
this.m_yoffset=0;
this.m_hspeed=0;
this.m_vspeed=0;
this.m_visible=true;
this.m_dynamic =0;
this.m_pName="";
this.m_beginScript=null;
this.m_endScript=null;
this.m_shaderId=-1;
this.m_timer=null;
this.m_elements = new yyList();
this.m_effectEnabled = true;
this.m_effectToBeEnabled = true;
this.m_effect = null; // yyEffectInstanceRef
this.m_pInitialEffectInfo = null;
this.m_effectPS = -1;
};

CLayer.prototype.SetEffect = function(_effect)
{
    this.m_effect = _effect;
};

CLayer.prototype.ClearEffect = function()
{
    this.m_effect = null;
};

CLayer.prototype.GetEffect = function()
{
    return this.m_effect;
};

CLayer.prototype.HasEffect = function()
{
    return this.m_effect != null;
};

CLayer.prototype.GetInitialEffectInfo = function()
{
    return this.m_pInitialEffectInfo;
};


/** @constructor */
function YYRoomLayer()
{
	// a single layer
	this.pName="";
	this.id=0;
	this.type=0;
	this.depth=0;
	this.x=0;
	this.y=0;
	this.hspeed=0;
	this.vspeed=0;
	this.visible=0;
};
/** @constructor */
function YYRoomTile3()
{
     this.x=0;
     this.y=0;
     this.index=0;
     this.xo=0;
     this.yo=0;
     this.w=0;
     this.h=0;
     this.depth=0;
     this.id=0;
	 this.scaleX=0;
	 this.scaleY=0;
	 this.colour=0;
};
/** @constructor */
function CLayerInstanceElement()
{

	this.m_instanceID=-1;
	this.m_pInstance=null;
	this.m_type = eLayerElementType_Instance;
    this.m_bRuntimeDataInitialised = false;
    this.m_name = "";

};
/** @constructor */
function CLayerBackgroundElement()
{
    this.m_pBackground=null;
    this.m_type = eLayerElementType_Background;
    this.m_bRuntimeDataInitialised = false;
    this.m_name = "";
    this.m_id=0;
};
/** @constructor */
function CLayerTilemapElement()
{
    this.m_type = eLayerElementType_Tilemap;
    this.m_backgroundIndex=-1;
    this.m_x=0;
    this.m_y=0;
    this.m_mapWidth=0;
    this.m_mapHeight=0;
    this.m_frame=0;
    this.m_pTiles=[];
    this.m_bRuntimeDataInitialised = false;
    this.m_name = "";
    this.m_id=0;
    this.m_tiledataMask=~TileInherit_Mask;
};
/** @constructor */
function CLayerOldTilemapElement()
{
    this.m_type = eLayerElementType_OldTilemap;
    this.m_TileData=[];
    this.m_tiles=[];
    this.m_name = "";
    this.m_id=0;
    this.m_bRuntimeDataInitialised = false;

};
/** @constructor */
function CLayerSpriteElement()
{
    this.m_spriteIndex=-1;			// the sprite    
    this.m_imageSpeed = 1;           // speed with which to display the images (when fps based, this is a 1.0 scaler)
    this.m_playbackspeedtype = ePlaybackSpeedType_FramesPerSecond;
    this.m_sequencePos = 0;
    this.m_sequenceDir = 1;
    this.m_imageIndex=0;           // current index in the sprite
    this.m_imageScaleX=1;          // x scale factor for the image
    this.m_imageScaleY=1;          // y scale factor for the image
    this.m_imageAngle=0;           // rotation angle for the image
    this.m_imageBlend=0xffffffff;  // blending for the image	
    this.m_imageAlpha=1;           // alpha transparency for the image	
    this.m_x=0;
    this.m_y=0;					// position	
    this.m_type = eLayerElementType_Sprite;
    this.m_name = "";
    this.m_id=0;
    this.m_bRuntimeDataInitialised = false;
};

/** @constructor */
function CLayerSequenceElement() {
    this.m_sequenceIndex = -1;	    // the index of the sequence within the sequence manager sequences list
    this.m_instanceIndex = -1;      // the index of the instance within the sequence manager instances list
    this.m_imageSpeed = 1;       // actual sequence playback speed
    this.m_headPosition = 0;        // animation keyframe head position
    this.m_imageBlend = 0xffffffff;	// blending for the image
    this.m_imageAlpha = 1;           // alpha transparency for the image
    this.m_scaleX = 1;              // x scale factor for the image
    this.m_scaleY = 1;              // y scale factor for the image
    this.m_x = 0;
    this.m_y = 0;				    // position	
    this.m_angle = 0;		    // rotation	    
    this.m_type = eLayerElementType_Sequence;
    this.m_name = "";
    this.m_id = 0;
    this.m_bRuntimeDataInitialised = false;
    this.m_layer = null;
    this.m_dirtyflags = 0;
};

/** @constructor */
function CLayerParticleElement()
{
    this.m_type = eLayerElementType_ParticleSystem;
    this.m_systemID=-1;
    this.m_name = "";
    this.m_id=0;
    this.m_bRuntimeDataInitialised = false;

    // When loaded from WAD:
    this.m_ps = -1;          // The id of the particle system resource
    this.m_imageScaleX = 1.0;
    this.m_imageScaleY = 1.0;
    this.m_imageAngle = 0.0;
    this.m_imageBlend = 0xffffffff;
    this.m_imageAlpha = 1.0;
    this.m_x = 0;
    this.m_y = 0;
};

/** @constructor */
function CLayerTileElement()
{
    this.m_visible=true;        // whether this tile is visible
    this.m_index=-1;            // the sprite index
    this.m_x=0;                 // position
    this.m_y=0;                 // position
    this.m_w=0;                 // width on sprite
    this.m_h=0;                 // height on sprite
    this.m_imageScaleX=1.0;     // x scale factor for the image
    this.m_imageScaleY=1.0;     // y scale factor for the image
    this.m_imageAngle=0.0;      // rotation angle for the image
    this.m_imageBlend=0xffffffff;   // blending for the image
    this.m_imageAlpha=1.0;      // alpha transparency for the image
    this.m_xo=0;                // x position on the background
    this.m_yo=0;                // y position on the background

    this.m_type = eLayerElementType_Tile;
    this.m_name = "";
    this.m_id=0;
    this.m_bRuntimeDataInitialised = false;
};

/** @constructor */
function CLayerEffectParam()
{
    this.pName = null;
	this.type = 0;
	this.elements = 0;	

    this.defaults_data = null;
    //this.defaults_float;
    //this.defaults_int;
    //this.defaults_bool;
    //this.defaults_sampler;		// sampler defaults are PNG names
};

/** @constructor */
function CLayerEffectInfo()
{
    this.m_type = eLayerElementType_Effect;
    this.pName="";
    this.numParams = 0;
    this.pParams=[];
    this.bAffectsSingleLayerOnly = false;
};

var YYEffectLayerParamType_Real = 0;
var YYEffectLayerParamType_Colour = 1;
var YYEffectLayerParamType_Sampler = 2;
var YYEffectLayerParamType_Max = 3;



var RTILE_SLAB_SIZE	= 32;
/** @constructor */
function LayerManager()
{
    this.m_LayerIDWatermark = 0;
    this.m_CurrentLayerID = 0;
    this.m_CurrentElementID = 0;
    this.m_bInitialised = false;
    this.m_TiledataMask = 0xffffffff;
    this.m_nTargetRoom = -1;
    this.m_ForceDepth = false;
    this.m_ForcedDepth = 0;
    this.m_ScriptInstance = null;
};

LayerManager.prototype.GetLayerIDWatermark=function(){ return this.m_LayerIDWatermark;};
LayerManager.prototype.SetLayerIndexWatermark=function(_id){this.m_LayerIWatermark=_id;};
 
LayerManager.prototype.SetForceDepth = function (_force) { this.m_ForceDepth = _force; };
LayerManager.prototype.SetForcedDepth = function (_depth) { this.m_ForcedDepth = _depth; };
LayerManager.prototype.IsDepthForced = function () { return this.m_ForceDepth; };
LayerManager.prototype.GetForcedDepth = function () { return this.m_ForcedDepth; };
 
LayerManager.prototype.GetTiledataMask=function()
{
    return this.m_TiledataMask;
};

LayerManager.prototype.SetTiledataMask=function(arg1)
{
    this.m_TiledataMask=arg1;
};
 
LayerManager.prototype.Init = function()
{
	if (!this.m_bInitialised)
	{		
		this.m_bInitialised = true;
	}
};

LayerManager.prototype.RemoveBackgroundElement= function(_layer,_element)
{
    if(_element.m_pBackground!=null)
    {
        delete(_element.m_pBackground);
        _element.m_pBackground=null;
    }

    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveInstanceElement= function(_layer,_element,_destroyInstance)
{
    if (_element.m_pInstance) {
        _element.m_pInstance.SetOnActiveLayer(false);
    }

    if (_destroyInstance)
    {
        //if (_element.m_instanceID >= 0 && _element.m_pInstance)       // -14 is object_unset
        if (_element.m_instanceID >= 0)
        {
            var inst = g_pInstanceManager.Get(_element.m_instanceID);
            if (inst != null)
            {
                instance_destroy(inst);
            }            
        }
    }
    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveOldTilemapElement= function(_layer,_element)
{    
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveSpriteElement=function(_layer,_element)
{
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveTilemapElement=function(_layer,_element)
{
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveParticleElement=function(_layer,_element)
{
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveTileElement=function(_layer,_element)
{
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};

LayerManager.prototype.RemoveSequenceElement=function(_layer,_element)
{
    // Don't need to do anything here    
    _layer.m_elements.DeleteItem(_element);
};


LayerManager.prototype.RemoveElementFromLayer= function(_room,_el,_layer,_removeDynamicLayers,_destroyInstances)
{
    if(_room==null)
       return;
    
    var element = _el;
    var layer = _layer;
    
  

    if(element===null)
        return;


    this.CleanElementRuntimeData(element);
    
    switch(element.m_type)
    {
        case eLayerElementType_Background:
            this.RemoveBackgroundElement(layer,element);
            break;
        case eLayerElementType_Instance:
            this.RemoveInstanceElement(layer,element,_destroyInstances);
            break;
        case eLayerElementType_OldTilemap:
            this.RemoveOldTilemapElement(layer,element);
            break;
        case eLayerElementType_Sprite:
            this.RemoveSpriteElement(layer,element);
            break;
        case eLayerElementType_Tilemap:
            this.RemoveTilemapElement(layer,element);
            break;       
        case eLayerElementType_ParticleSystem:
            this.RemoveParticleElement(layer,element);
            break; 
        case eLayerElementType_Tile:
            this.RemoveTileElement(layer,element);
            break;
        case eLayerElementType_Sequence:
            this.RemoveSequenceElement(layer,element);
            break;    
    };

    // This doesn't exist just now - need to implement
    //_room.m_LayerElementLookup.Delete(element.m_id);

    return;
};

LayerManager.prototype.RemoveElementById= function (_room,_elid,_removeDynamicLayers,_destroyInstances)
{
    
    if(_room==null)
       return;
    
    var element = null;
    var layer = null;
    
    for(var i=0;i<_room.m_Layers.length;i++)
    {
        layer = _room.m_Layers.Get(i);
        element = this.GetElementFromIDWithLayer(layer, _elid);
        if(element!=null)
            break;
    }    

    if(element===null)
        return;


    this.CleanElementRuntimeData(element);
    
    switch(element.m_type)
    {
        case eLayerElementType_Background:
            this.RemoveBackgroundElement(layer,element);
            break;
        case eLayerElementType_Instance:
            this.RemoveInstanceElement(layer,element,_destroyInstances);
            break;
        case eLayerElementType_OldTilemap:
            this.RemoveOldTilemapElement(layer,element);
            break;
        case eLayerElementType_Sprite:
            this.RemoveSpriteElement(layer,element);
            break;
        case eLayerElementType_Tilemap:
            this.RemoveTilemapElement(layer,element);
            break;       
        case eLayerElementType_ParticleSystem:
            this.RemoveParticleElement(layer,element);
            break; 
        case eLayerElementType_Tile:
            this.RemoveTileElement(layer,element);
            break; 
        case eLayerElementType_Sequence:
            this.RemoveSequenceElement(layer,element);
            break;      
    };

    // This doesn't exist just now - need to implement
    //_room.m_LayerElementLookup.Delete(element.m_id);

    return;
};

LayerManager.prototype.MoveElement = function(_room, _element, _targetlayer)
{
    if (_room == null)
        return;

    if (_element == null)
        return;

    if (_targetlayer == null)
        return;

    // Get current layer that the element is on
    var elandlay = g_pLayerManager.GetElementAndLayerFromID(_room, _element.m_id);
    if (elandlay != null)
    {
        // Remove the element from it's original layer
        elandlay.layer.m_elements.DeleteItem(_element);
    }

    if (_element.m_type == eLayerElementType_Instance)
    {
        if (_element.m_pInstance != null)
        {
            _element.m_pInstance.layer = _targetlayer.m_id;
            _element.m_pInstance.SetOnActiveLayer(true);
        }
    }

    _targetlayer.m_elements.Add(_element);
};

LayerManager.prototype.GetTargetRoomObj = function()
{
    if (this.m_nTargetRoom == -1)
        return g_RunRoom;

    var room = g_pRoomManager.Get(this.m_nTargetRoom);

    if (room == null)
        return g_RunRoom;

    return room;
};


LayerManager.prototype.Close = function()
{	    

};

LayerManager.prototype.BuildBackgroundElementRuntimeData = function( _room ,_layer,_element)
{
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildInstanceElementRuntimeData = function( _room ,_layer,_element)
{
    var inst = g_pInstanceManager.Get(_element.m_instanceID);
	if (inst===null)
		return;
    
    
    //Look to see if this is on a layer already & remove it if it is...
 //   if(inst.m_nLayerID!=-1 && inst.m_bOnActiveLayer)
//    {
        //...
  //  }
    
    
    _element.m_pInstance = inst;
    inst.m_nLayerID = _layer.m_id;
    inst.m_bOnActiveLayer = true;
    inst.depth = _layer.depth;
  
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildOldTilemapElementRuntimeData = function( _room ,_layer,_element)
{
    //stuff to go here
    // This is now deprecated anyway
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildSpriteElementRuntimeData = function( _room ,_layer,_element)
{
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildTilemapElementRuntimeData = function( _room ,_layer,_element)
{
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildParticleElementRuntimeData = function( _room ,_layer,_element)
{
    if (_element.m_ps != -1 && _element.m_systemID == -1)
    {
        CParticleSystem.Get(_element.m_ps).MakeInstance(_layer.m_id, false, _element);
    }

    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildTileElementRuntimeData = function( _room ,_layer,_element)
{
    _element.m_bRuntimeDataInitialised=true;
};

LayerManager.prototype.BuildSequenceElementRuntimeData = function (_room, _layer, _element)
{
    var sequenceInstance = g_pSequenceManager.GetNewInstance();

    sequenceInstance.m_sequenceIndex = _element.m_sequenceIndex;
    sequenceInstance.m_headPosition = _element.m_headPosition;
    sequenceInstance.m_speedScale = _element.m_imageSpeed;
    

    _room.AddSeqInstance(_element.m_id);

    _element.m_instanceIndex = sequenceInstance.id;

    // Call create event
    g_pSequenceManager.HandleInstanceEvent(sequenceInstance, EVENT_CREATE);

    _element.m_bRuntimeDataInitialised = true;
};

LayerManager.prototype.BuildElementRuntimeData = function( _room ,_layer,_element)
{

    if(_room===null)
        return;
        
    if(_layer===null)
        return;
        
    if(_element===null)
        return;
        
    if (_element.m_bRuntimeDataInitialised) // already initialised
        return;

    switch(_element.m_type)
    {
        case eLayerElementType_Background: this.BuildBackgroundElementRuntimeData(_room, _layer, _element); break;
		case eLayerElementType_Instance: this.BuildInstanceElementRuntimeData(_room, _layer, _element); break;
		case eLayerElementType_OldTilemap: this.BuildOldTilemapElementRuntimeData(_room, _layer, _element); break;
		case eLayerElementType_Sprite: this.BuildSpriteElementRuntimeData(_room, _layer, _element); break;
		case eLayerElementType_Tilemap: this.BuildTilemapElementRuntimeData(_room, _layer, _element); break;
        case eLayerElementType_ParticleSystem: this.BuildParticleElementRuntimeData(_room, _layer, _element); break;
        case eLayerElementType_Tile: this.BuildTileElementRuntimeData(_room, _layer, _element); break;
        case eLayerElementType_Sequence: this.BuildSequenceElementRuntimeData(_room, _layer, _element); break;
    }    
};  

LayerManager.prototype.SetLayerIndexWatermark = function(_id)
{
    this.m_LayerIDWatermark = _id;   
};

LayerManager.prototype.BuildRoomLayerRuntimeData = function(_room)
{
    if((_room.m_Layers===null) || (_room.m_Layers.length===0))
        return;
        
    for(var i=0;i<_room.m_Layers.length;i++)
    {
        var player = _room.m_Layers.Get(i);
        player.m_timer = YoYo_GetTimer();
        
        for(var j=0;j<player.m_elements.length;j++)
        {
            var el = player.m_elements.Get(j);
            if (el == null)
                continue;

            this.BuildElementRuntimeData(_room,player,el);
        }
 
    }
};

LayerManager.prototype.AddNewElement = function(_room,_layer,_element,_buildRuntimeData)
{
    if(_room == null || _layer==null || _element===null)
        return -1;

    _element.m_id = this.GetNextElementID();
    _element.m_layer = _layer;

    var insertIndex = 0;
    if(_element.m_type != eLayerElementType_Instance)
    {
        for(var elemI = 0; elemI < _layer.m_elements.pool.length; elemI++)
        {
            var pEl = _layer.m_elements.pool[elemI];
            if(pEl == null || pEl.m_type != eLayerElementType_Instance)
            {
                break;
            }
            else
            {
                if(pEl.m_pInstance !== null && pEl.m_pInstance.active)
                {
                    insertIndex = elemI + 1;
                }
                else
                {
                    break;
                }
            }
        }
    }

    _layer.m_elements.Insert(insertIndex, _element);

    if(_buildRuntimeData)
    {
        this.BuildElementRuntimeData(_room,_layer,_element);
    }

    return _element.m_id;
};

LayerManager.prototype.AddNewElementAtDepth = function (_room, _depth, _element, _buildRuntimeData, _useDynamicLayers) {

    if (_room == null || _element === null)
        return -1;

    var layer = this.GetLayerWithDepth(_room, _depth, _useDynamicLayers);
    if ((layer == null) && (_useDynamicLayers))
    {
        // Create a new dynamic layer
        layer = this.AddDynamicLayer(_room, _depth);
    }

    if (layer == null)
    {
        // Okay, could neither find nor create a layer at the specified depth so bail        
        return -1;
    }

    return this.AddNewElement(_room, layer, _element, _buildRuntimeData);
};

LayerManager.prototype.GetLayerFromName=function(_room,_name)
{
    // if null OR undefined
    if(!_name) return null;
    _name = _name.toLowerCase();

    for(var i=0;i<_room.m_Layers.length;i++)
    {        
        var layer = _room.m_Layers.Get(i);
        if (layer===undefined || layer===null) continue;
        if (!layer.m_pName) continue;
           
        if (layer.m_pName.toLowerCase() === _name){
                return layer;
        }
    }
    
    return null;
   
};

LayerManager.prototype.GetLayerIDForInstance = function(_room, _instanceID)
{
    if (_room == null)
        return -1;

    for(var i=0;i<_room.m_Layers.length;i++)
    {
        var layer = _room.m_Layers.Get(i);
        if (layer != null)
        {
            for (var j = 0; i < layer.m_elements.length; j++)
            {
                var el = layer.m_elements.Get(j);
                if (el != null)
                {
                    if (el.m_type === eLayerElementType_Instance)
                    {
                        if (el.m_instanceID == _instanceID)
                        {
                            return layer.m_id;
                        }                        
                    }
                }
            }
        }
    }

    return -1;
};

LayerManager.prototype.CleanElementRuntimeData = function(_element)
{
    if (_element == null)
        return;

    // Determine element type
    switch(_element.m_type)
    {
        case eLayerElementType_Background:
            {
                this.CleanBackgroundElementRuntimeData(_element);
            } break;

        case eLayerElementType_Instance:
            {
                this.CleanInstanceElementRuntimeData(_element);
            } break;

        case eLayerElementType_OldTilemap:
            {
                this.CleanOldTilemapElementRuntimeData(_element);
            } break;

        case eLayerElementType_Sprite:
            {
                this.CleanSpriteElementRuntimeData(_element);
            } break;

        case eLayerElementType_Tilemap:
            {
                this.CleanTilemapElementRuntimeData(_element);
            } break;

        case eLayerElementType_ParticleSystem:
            {
                this.CleanParticleElementRuntimeData(_element);
            } break;

        case eLayerElementType_Tile:
            {
                this.CleanTileElementRuntimeData(_element);
            } break;
        case eLayerElementType_Sequence:
            {
                this.CleanSequenceElementRuntimeData(_element);
            } break;
    }

    _element.m_bRuntimeDataInitialised = false;
};

LayerManager.prototype.CleanBackgroundElementRuntimeData = function(_backEl)
{
    // No memory to free for this type, so just return to the pool	
};

LayerManager.prototype.CleanInstanceElementRuntimeData = function(_instEl)
{	
    // Reset on-layer flag
    // Look up from instance ID in case something has happened to the original object    
    var inst = g_pInstanceManager.Get(_instEl.m_instanceID);
    if (inst != null)
    {
        inst.SetOnActiveLayer(false);
    }	

    _instEl.m_pInstance = null;
};

LayerManager.prototype.CleanOldTilemapElementRuntimeData = function(_tilemapEl)
{		
    // Return tile slabs to the pool
    // Depracated
    /*CTileSlab* slab = _pTilemapEl->m_tiles.GetFirst();
    while(slab != NULL)
    {		
        _pTilemapEl->m_tiles.Remove(slab);
        m_TilePool.ReturnToPool(slab);

        slab = _pTilemapEl->m_tiles.GetFirst();
    }*/
};

LayerManager.prototype.CleanSpriteElementRuntimeData = function(_spriteEl)
{
    // No memory to free for this type, so just return to the pool	
};

LayerManager.prototype.CleanTilemapElementRuntimeData = function(_tilemapEl)
{
    // No memory to free for this type, so just return to the pool	
};

LayerManager.prototype.CleanParticleElementRuntimeData = function(_particleEl)
{
    // No memory to free for this type, so just return to the pool	
};

LayerManager.prototype.CleanTileElementRuntimeData = function(_tileEl)
{
    // No memory to free for this type, so just return to the pool	
};

LayerManager.prototype.CleanSequenceElementRuntimeData = function(_seqEl)
{
    if(g_RunRoom != null)
    {
        // Remove the sequence instance from the room
        g_RunRoom.RemoveSeqInstance(_seqEl.m_id);
    }

    var sequenceInstance = g_pSequenceManager.GetInstanceFromID(_seqEl.m_instanceIndex);    

    // Call clean up event    
    g_pSequenceManager.HandleInstanceEvent(sequenceInstance, EVENT_CLEAN_UP);

    // Delete the instance associated with this element
    g_pSequenceManager.FreeInstance(sequenceInstance);    
};

LayerManager.prototype.AddDynamicLayer = function(_room, _depth)
{
    var NewLayer = new CLayer();
    NewLayer.m_id = g_pLayerManager.GetNextLayerID();
    NewLayer.depth = _depth;    
   
    NewLayer.m_dynamic = true;
    g_RunRoom.m_Layers.Add(NewLayer);
    
    return NewLayer;
    

};

LayerManager.prototype.AddInstance= function (_room,_inst)
{
    
    if(_room == null || _inst===null)
        return;
    if(_inst.GetOnActiveLayer() === false)
    {
        if(_inst.m_nLayerID==-1)
        {
            var _layer = this.GetLayerWithDepth(_room,_inst.depth,true);
            if(_layer ===null)
            {
                _layer=this.AddDynamicLayer(_room,_inst.depth);
            }
            this.AddInstanceToLayer(_room,_layer,_inst);
        }
        else
        {
            var layer = this.GetLayerFromID(_room,_inst.m_nLayerID);
            
            if(layer === null)
                return;
            
            this.AddInstanceToLayer(_room,layer,_inst);
        }
    }
};

LayerManager.prototype.AddInstanceToLayer= function(_room,_layer,_inst)
{

    if(_room == null || _layer==null || _inst===null)
        return;
   
    if(_inst.GetOnActiveLayer() === false)
    {
        var NewInstanceElement = new CLayerInstanceElement();        
        NewInstanceElement.m_instanceID = _inst.id;
        NewInstanceElement.m_pInstance = _inst;
        _inst.m_nLayerID = _layer.m_id;
        _inst.SetOnActiveLayer(true);
        NewInstanceElement.m_bRuntimeDataInitialised = true;
        
        g_pLayerManager.AddNewElement(_room, _layer, NewInstanceElement, false);
    }
};

LayerManager.prototype.RemoveInstance = function (_room, _inst) {
    if (_inst.GetOnActiveLayer() === false)
        return;

    var layer = this.GetLayerFromID(_room, _inst.m_nLayerID);
    if (layer === null) {
        // Layer does not exist
        _inst.SetOnActiveLayer(false);
        return;
    }

    this.RemoveInstanceFromLayer(_room, layer, _inst);
};

LayerManager.prototype.RemoveInstanceFromAnyLayer = function (_room, _inst)
{
    if (_room == null || _inst === null)
        return;

    if (_inst.GetOnActiveLayer() === true)
    {
        for (var j = 0; j < _room.m_Layers.length; j++)
        {
            var layer = _room.m_Layers.Get(j);
            for (var i = 0; i < layer.m_elements.length; i++)
            {
                var el = layer.m_elements.Get(i);
                if (el != null)
                {
                    if (el.m_type == eLayerElementType_Instance)
                    {
                        if (el.m_pInstance == _inst)
                        {
                            this.RemoveElementFromLayer(_room, el, layer, true, false);

                            _inst.SetOnActiveLayer(false);
                            _inst.m_nLayerID = -1;
                            // If this layer is marked as dynamic and doesn't have any elements in it, remove it
                            //    if ((_layer.m_dynamic) && (_layer.m_elements.count == 0)) {
                            //      RemoveLayer(_pRoom, _layer.m_id);
                            // }

                            return;
                        }
                    }
                }
            }
        }
    }
};

LayerManager.prototype.RemoveInstanceFromLayer=function(_room,_layer,_inst)
{
    if(_room == null || _layer==null || _inst===null)
        return;

    if(_inst.GetOnActiveLayer() === true)
    {
        for (var i = 0; i < _layer.m_elements.length; i++)
        {
            var el = _layer.m_elements.Get(i);
            if (el != null)
            {
                if (el.m_type == eLayerElementType_Instance)
                {
                    if (el.m_pInstance == _inst)
                    {                        
                        this.RemoveElementFromLayer(_room, el,_layer, true, false);

                        _inst.SetOnActiveLayer(false);
                        _inst.m_nLayerID = -1;
                        // If this layer is marked as dynamic and doesn't have any elements in it, remove it
                    //    if ((_layer.m_dynamic) && (_layer.m_elements.count == 0)) {
                      //      RemoveLayer(_pRoom, _layer.m_id);
                       // }
                    }
                }
            }
        }        
    }
};

LayerManager.prototype.RemoveStorageInstanceFromAnyLayer = function (_room, _instanceID)
{
    if (_room == null)
        return;
    
    for (var j = 0; j < _room.m_Layers.length; j++)
    {
        var layer = _room.m_Layers.Get(j);
        for (var i = 0; i < layer.m_elements.length; i++)
        {
            var el = layer.m_elements.Get(i);
            if (el != null)
            {
                if (el.m_type == eLayerElementType_Instance)
                {
                    if (el.m_instanceID == _instanceID)
                    {
                        this.RemoveElementFromLayer(_room, el, layer, true, false);                            

                        return;
                    }
                }
            }
        }
    }
};

LayerManager.prototype.RemoveStorageInstanceFromLayer = function (_room, _layer, _instanceID)
{
    if (_room == null || _layer == null)
        return;

    for (var i = 0; i < _layer.m_elements.length; i++) {
        var el = _layer.m_elements.Get(i);
        if (el != null) {
            if (el.m_type == eLayerElementType_Instance) {
                if (el.m_instanceID == _instanceID) {
                    this.RemoveElementFromLayer(_room, el,_layer, true, false);                    

                   
                }
            }
        }
    }
};

LayerManager.prototype.AddLayer = function(_room, _depth, _name)
{
    if (_room == null)
        return null;

    var NewLayer = new CLayer();
    NewLayer.m_id = this.GetNextLayerID();
    NewLayer.depth = _depth;
    NewLayer.m_pName = _name;
    NewLayer.m_dynamic = false;    

    _room.m_Layers.Add(NewLayer);

    return NewLayer;

};

LayerManager.prototype.RemoveLayer = function(_room,_layerID,_destroyInstances)
{
    if (_destroyInstances == undefined)
    {
        _destroyInstances = true;
    }

    var layer = this.GetLayerFromID(_room,_layerID);
    if (layer!=null)
    {
        // Iterate through all the elements on the layer and remove them
        for(var i = 0; i < layer.m_elements.length; i++)
        {
            var el = layer.m_elements.Get(i);
            if (el != null)
            {
                this.RemoveElementFromLayer(_room, el, layer, false, _destroyInstances);
            }
        }

        _room.m_Layers.Delete(layer);
    }
};

LayerManager.prototype.ChangeLayerDepth = function(_room, _layer, _newDepth, _allowMerging)
{
    if (_room == null)
        return;

    if (_layer == null)
        return;

    if (_newDepth == _layer.depth)
        return; // no change required

    var olddepth = _layer.depth;
    _layer.depth = _newDepth;

    // Remove then re-add the layer to insert it at the correct place in the list
    _room.m_Layers.Delete(_layer);
    _room.m_Layers.Add(_layer);

    if (_layer.m_dynamic && _allowMerging)
    {
        // Search for any other dynamic layers with the same depth and merge them with this one
        var layerstomerge = [];
        var numlayerstomerge = 0;

        var layerindex = _room.m_Layers.FindItem(_layer);
        if (layerindex != -1)       // if it *does* equal -1 then we've got serious problems
        {
            var tempindex = layerindex - 1;

            // First search backwards
            while(tempindex >= 0)
            {
                var testlayer = _room.m_Layers.Get(tempindex);
                if ((testlayer == null) || (testlayer.depth == _layer.depth))
                {
                    if (testlayer != null)          // I don't think this should ever be the case
                    {
                        if (testlayer.m_dynamic)
                        {    
                            layerstomerge[numlayerstomerge++] = testlayer;
                        }
                    }

                    tempindex--;
                }
                else
                {
                    break;
                }
            };            

            tempindex = layerindex + 1;            
            while(tempindex < _room.m_Layers.length)
            {
                var testlayer = _room.m_Layers.Get(tempindex);
                if ((testlayer == null) || (testlayer.depth == _layer.depth))
                {
                    if (testlayer != null)          // I don't think this should ever be the case
                    {
                        if (testlayer.m_dynamic)
                        {    
                            layerstomerge[numlayerstomerge++] = testlayer;
                        }
                    }

                    tempindex++;
                }
                else
                {
                    break;
                }
            };   

            // Now copy the elements from the other layers to the current layer
            for(var i = 0; i < numlayerstomerge; i++)
            {
                var templayer = layerstomerge[i];
                for(var j = 0; j < templayer.m_elements.length; j++)
                {
                    var el = templayer.m_elements.Get(j);
                    if (el == null)
                        continue;

                    if (el.m_type == eLayerElementType_Instance)
                    {
                        if (el.m_pInstance != null)
                        {                            
                            el.m_pInstance.m_nLayerID = _layer.m_id;
                        }
                    }
                    
                    // TODO: mirror C++ runner and store layer reference in element for fast lookup - we'd need to change the layer reference here
                    _layer.m_elements.Add(el);
                }

                templayer.m_elements.Clear();   // clear element list in temp layer (don't want the elements themselves to be deleted)
                g_pLayerManager.RemoveLayer(_room, templayer.m_id, false);
            }
        }
    }    
};

LayerManager.prototype.GetLayerWithDepth=function(_room,_depth,_dynamicOnly)
{
    if (_room == null) return null;

    //c++ uses a hash map for this but we'll just blit through for now...    
    for(var i=0;i<_room.m_Layers.length;i++)
    {        
        var layer = _room.m_Layers.Get(i);
        if((layer.depth===_depth) && (!_dynamicOnly || (layer.m_dynamic)))
            return layer;
    }
    
    return null;
   
};


LayerManager.prototype.GetLayerFromID=function(_room,_id)
{
    //c++ uses a hash map for this but we'll just blit through for now...    
    for(var i=0;i<_room.m_Layers.length;i++)
    {        
        var layer = _room.m_Layers.Get(i);
        if(layer.m_id===_id)
            return layer;
    }
    
    return null;
   
};

LayerManager.prototype.GetNextLayerID= function()
{   
    if (this.m_CurrentLayerID < this.m_LayerIDWatermark) 
        this.m_CurrentLayerID = this.m_LayerIDWatermark; 
    this.m_CurrentLayerID++;
    return this.m_CurrentLayerID;
};
LayerManager.prototype.GetNextElementID= function()
{   
    return this.m_CurrentElementID++;
};

LayerManager.prototype.GetElementFromID=function(_room,_elementID)
{

    if(_room==null)
        return null;
    
    for(var i=0;i<_room.m_Layers.length;i++)
    {
        var layer = _room.m_Layers.Get(i);
        var element = g_pLayerManager.GetElementFromIDWithLayer(layer,_elementID);
        if(element!=null)
            return element;
    }    

    return null;
};


LayerManager.prototype.GetElementAndLayerFromID=function(_room,_elementID)
{

    if(_room==null)
        return null;
    
    for(var i=0;i<_room.m_Layers.length;i++)
    {
        var layer = _room.m_Layers.Get(i);
        var element = g_pLayerManager.GetElementFromIDWithLayer(layer,_elementID);
        if(element!=null)
        {
            var elandlay = new CLayerElement();
            elandlay.element = element;
            elandlay.layer = layer;
            return elandlay;
        }
    }    

    return null;
};


LayerManager.prototype.GetElementFromIDWithLayer=function(_layer,_elID)
{

    if(_layer==null)
        return null;
        
    for(var i=0;i<_layer.m_elements.length;i++)
    {
        var el = _layer.m_elements.Get(i);
        if (el == null)
            continue;

        if(el.m_id===_elID)
        {
            return el;
        }
    }

    return null;

};

LayerManager.prototype.GetFirstElementOfType=function(_layer,_eltype)
{

    if(_layer==null)
        return null;
        
    for(var i=_layer.m_elements.length-1;i>=0;i--)
    {
        var el = _layer.m_elements.Get(i);
        if (el == null || el===undefined)continue;
        if (el.m_type==_eltype) 
            return el;
    }

    return null;

};

LayerManager.prototype.GetElementFromName=function(_layer,_elname)
{

    if(_layer==null || _elname==null)
        return null;
        
    _elname = _elname.toLowerCase();
    for(var i=0;i<_layer.m_elements.length;i++)
    {
        var el = _layer.m_elements.Get(i);
        if (el == null || el===undefined)continue;
        if (!el.m_name) continue;

        if(el.m_name.toLowerCase()===_elname)
        {
            return el;
        }
    }

    return null;

};

LayerManager.prototype.GetElementAndLayerFromInstanceID = function (_room, _instanceID)
{
    if(_room==null)
        return null;
    
    for(var i=0;i<_room.m_Layers.length;i++)
    {
        var layer = _room.m_Layers.Get(i);
        if (layer != null) {
            for (var j = 0; j < layer.m_elements.length; j++) {
                var el = layer.m_elements.Get(j);
                if (el != null)
                {
                    if (el.m_type == eLayerElementType_Instance)
                    {
                        if (el.m_instanceID == _instanceID)
                        {
                            var elandlay = new CLayerElement();
                            elandlay.element = el;
                            elandlay.layer = layer;
                            return elandlay;
                        }
                    }
                }               
            }
        }        
    }    

    return null;
};

LayerManager.prototype.GetLayerForElement = function (_room, _elementID) {
    if (_room == null)
        return null;

    for (var i = 0; i < _room.m_Layers.length; i++) {
        var layer = _room.m_Layers.Get(i);
        if (layer != null) {
            for (var j = 0; j < layer.m_elements.length; j++) {
                var el = layer.m_elements.Get(j);
                if (el != null) {
                    if (el.m_id == _elementID)
                    {
                        return layer;
                    }                    
                }
            }
        }
    }

    return null;
};

LayerManager.prototype.UpdateLayers = function()
{
    if(g_RunRoom.m_Layers === null || g_RunRoom.m_Layers.length===0)
        return;
        
    var numlayers = g_RunRoom.m_Layers.length;
    
    var time = YoYo_GetTimer();
    
    for(var i=0;i<numlayers;i++)
    {
        var layer = g_RunRoom.m_Layers.Get(i);
        
        var tdelta = time-layer.m_timer;
        
        if(tdelta> 2000000) 
            tdelta = 0;

        layer.m_xoffset += layer.m_hspeed;
        layer.m_yoffset += layer.m_vspeed;
        
        for(var j=0;j<layer.m_elements.length;j++)
        {
            var el = layer.m_elements.Get(j);
            if (el == null)
                continue;

            var type = el.m_type;
            if(type == eLayerElementType_Background)
            {
                var pBack = el.m_pBackground;
                if(pBack!=null)
                {
                    if (pBack.playbackspeedtype == ePlaybackSpeedType_FramesPerGameFrame)
                    {
                        pBack.image_index += pBack.image_speed * pBack.playbackspeed;
                    }
                    else
                    {
                        var fps = g_GameTimer.GetFPS();
                        pBack.image_index += (pBack.image_speed * pBack.playbackspeed)/fps;
                    }
                
                    //el.m_pBackground.image_index += el.m_pBackground.image_speed;
                }
            }
            else if (type == eLayerElementType_Sprite)
            {
                var sprite = g_pSpriteManager.Get(el.m_spriteIndex);

                if (sprite.sequence != null)
                {
                    var lastSequenceHead = el.m_sequencePos;
                    var fps = (sprite.playbackspeedtype == ePlaybackSpeedType_FramesPerSecond) ? g_GameTimer.GetFPS() : 1.0;
                    el.m_sequencePos += el.m_sequenceDir * (sprite.playbackspeed / fps) * el.m_imageSpeed;

                    var tmp = { headPosition: el.m_sequencePos, headDirection: el.m_sequenceDir, finished: false };
                    HandleSequenceWrapping(sprite.sequence, tmp);
                    el.m_sequencePos = tmp.headPosition;
                    el.m_sequenceDir = tmp.headDirection;

                    // Figure out which keyframe we're on
                    // There should only be one track and it should be a sprite frames track
                    if ((sprite.sequence.m_tracks != null) && (sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames))
                    {
                        var track = sprite.sequence.m_tracks[0];
                        var graphicKeyframe = track.m_keyframeStore.GetKeyframeAtFrame(el.m_sequencePos, sprite.sequence.m_length);
                        if (graphicKeyframe == null)
                        {
                            el.m_imageIndex = -1;		// no key at this time						
                        }
                        else
                        {
                            el.m_imageIndex = graphicKeyframe.m_channels[0].m_imageIndex;
                        }

                        HandleSpriteMessageEvents(sprite.sequence, el.m_id, fps, sprite.playbackspeed, el.m_sequenceDir, lastSequenceHead, el.m_sequencePos);
                    }
                }
                else if(sprite.m_skeletonSprite !== undefined)
                {
                    el.m_imageIndex += el.m_imageSpeed;
                }
                else
                {
                    var fps = g_GameTimer.GetFPS();
                    if (fps != 0.0)
                    {
                        if (sprite.playbackspeedtype != ePlaybackSpeedType_FramesPerSecond)
                            fps = 1.0;                        
                        el.m_imageIndex += (sprite.playbackspeed / fps) * el.m_imageSpeed;
                    }                    
                }
            }
            else if( type == eLayerElementType_Tilemap)
            {
                var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);
                if(back!=null)
                {
                    if(back.framelength>0)
                        el.m_frame= Math.floor((time/back.framelength)%back.frames);
                    else
                        el.m_frame=(el.m_frame+1)%back.frames;
                }
            }
        }
        layer.m_timer = YoYo_GetTimer(); 
    }
};

LayerManager.prototype.CleanRoomLayers = function(_room)
{
    if(_room==null)
        return;

    if (_room.m_Layers == null)
        return;

    var pLayer,pool;
    pool = _room.m_Layers.pool;
    while(pool.length > 0)
    {
        pLayer = pool[0];
        if (pLayer == null)
        {
            continue;
        }

        this.RemoveLayer(_room, pLayer.m_id, false);        
    }
};

LayerManager.prototype.CleanRoomLayerRuntimeData = function (_room)
{
    if(_room==null)
        return;

    if (_room.m_Layers == null)
        return;

    for (var l = 0; l < _room.m_Layers.pool.length; ++l)
    {
        var _layer = _room.m_Layers.pool[l];
        for (var e = 0; e < _layer.m_elements.pool.length; ++e)
        {
            var _element = _layer.m_elements.pool[e];
            this.CleanElementRuntimeData(_element);
        }
    }
};

LayerManager.prototype.BuildRoomLayers = function(_room,_roomLayers)
{
    if(_room===null)
        return;
        
    if(_roomLayers===null)
        return;
        
    if(!this.m_bInitialised)
        this.Init();
        
    var r_width = _room.m_width;
    var r_height = _room.m_height;
    
    var numlayers = _roomLayers.length;
    
    {
        var pLayer;
        for(var j=numlayers-1;j>=0;j--)
        {
            pLayer = _roomLayers[j];
            var NewLayer = new CLayer();            
            
            if( pLayer.pName!=undefined ) NewLayer.m_pName = pLayer.pName;    // case insensitve
            if( pLayer.id!=undefined ) NewLayer.m_id = pLayer.id;
            if( pLayer.depth!=undefined ) NewLayer.depth = pLayer.depth;
            if( pLayer.x!=undefined ) NewLayer.m_xoffset = pLayer.x;
            if( pLayer.y!=undefined ) NewLayer.m_yoffset = pLayer.y;
            if( pLayer.hspeed!=undefined ) NewLayer.m_hspeed = pLayer.hspeed;
            if( pLayer.vspeed!=undefined ) NewLayer.m_vspeed = pLayer.vspeed;
            if( pLayer.visible!=undefined ) NewLayer.m_visible = pLayer.visible;
            if( pLayer.effectEnabled!=undefined) NewLayer.m_effectEnabled = NewLayer.m_effectToBeEnabled = pLayer.effectEnabled;

            if (( pLayer.effectType != undefined) && (pLayer.effectType != ""))
            {
                var pEffectInfo = new CLayerEffectInfo();					
                pEffectInfo.pName = pLayer.effectType;
                pEffectInfo.numParams = 0;

                // Count number of unique params
                for (var n = 0; n < pLayer.effectProperties.length; n++)
                {
                    // Hack - ignore sampler parameters that have .png or .jpg in their values as these always denote default textures and we handle those in a different way
                    var pParamVal = pLayer.effectProperties[n].value;
                    if ((pParamVal == "") || pParamVal.includes(".png") || pParamVal.includes(".jpg"))
                        continue;

                    // If this is the first instance of this param name in the list, count it
                    var m;
                    for (m = 0; m < n; m++)
                    {
                        // We're assuming that the string table is only storing unique strings, so params with the same name should share the same string offset
                        if (pLayer.effectProperties[n].name == pLayer.effectProperties[m].name)
                            break;                        
                    }

                    if (n == m)
                    {
                        pEffectInfo.numParams++;
                    }
                }

                var pEffectParams = []; //CLayerEffectParam[]

                // Now get param names, types and number of elements
                var pCurrDest = null; //CLayerEffectParam
                var currindex = -1;
                var pCurrName = "";
                var typeelements = 1;
                for (var n = 0; n < pLayer.effectProperties.length; n++)
                {
                    // Hack - ignore sampler parameters that have .png or .jpg in their values as these always denote default textures and we handle those in a different way
                    var pParamVal = pLayer.effectProperties[n].value;
                    if ((pParamVal == "") || pParamVal.includes(".png") || pParamVal.includes(".jpg"))
                        continue;
                        
                    var pFileParam = pLayer.effectProperties[n];
                    if (pCurrName != pFileParam.name)
                    {                        
                        currindex++;
                        pCurrName = pFileParam.name;
                        pCurrDest = new CLayerEffectParam();
                        pEffectParams[currindex] = pCurrDest;
                        
                        var pParamName = pFileParam.name;
                        pCurrDest.pName = pParamName;
                        var resObj = ConvertFileEffectParamType(pFileParam.type);
                        typeelements = resObj.elements;
                        pCurrDest.type = resObj.type;

                        pCurrDest.defaults_data = [];
                        //pCurrDest.defaults_float = []; 
                        //pCurrDest.defaults_int = []; 
                        //pCurrDest.defaults_bool = []; 
                        //pCurrDest.defaults_sampler = [];
                    }		

                    var currelement = pCurrDest.elements;
                    pCurrDest.elements += typeelements;

                    var pFileValue = pFileParam.value;
                    var tempval = pFileValue;

                    switch (pFileParam.type)
                    {
                        case YYEffectLayerParamType_Real: pCurrDest.defaults_data[currelement] = parseFloat(tempval); break;
                        case YYEffectLayerParamType_Colour:
                        {
                            if (pFileValue.length > 0)
                            {
                                if (pFileValue[0] == '#')
                                {
                                    tempval = "0x"+pFileValue.substring(1);
                                    tempval = parseInt(tempval);

                                    // Order is apparently ABGR
                                    var col = tempval;
                                    var r, g, b, a;
                                    r = (col & 0xff) / 255.0;
                                    g = ((col >> 8) & 0xff) / 255.0;
                                    b = ((col >> 16) & 0xff) / 255.0;
                                    a = ((col >> 24) & 0xff) / 255.0;
                                    pCurrDest.defaults_data[currelement] = r;
                                    pCurrDest.defaults_data[currelement + 1] = g;
                                    pCurrDest.defaults_data[currelement + 2] = b;
                                    pCurrDest.defaults_data[currelement + 3] = a;
                                }
                            }
                        } break;
                        case YYEffectLayerParamType_Sampler: pCurrDest.defaults_data[currelement] = tempval; break;
                    }
                }					

                pEffectInfo.pParams = pEffectParams;
                pEffectInfo.bAffectsSingleLayerOnly = true;
                NewLayer.m_pInitialEffectInfo = pEffectInfo;
            }
            
            if(pLayer.type === YYLayerType_Background)
            {
                var NewBackLayer = new CLayerBackgroundElement();                
                NewBackLayer.m_pBackground = new CBackGM2();
             
                var blayer;   
               
                
                NewBackLayer.m_pBackground.image_speed = 1.0;

                if(pLayer.bvisible!=undefined) NewBackLayer.m_pBackground.visible = pLayer.bvisible;
                if(pLayer.bforeground!=undefined) NewBackLayer.m_pBackground.foreground = pLayer.bforeground;
                if(pLayer.bindex!=undefined) NewBackLayer.m_pBackground.index = pLayer.bindex;
                if(pLayer.bhtiled!=undefined) NewBackLayer.m_pBackground.htiled = pLayer.bhtiled;
                if(pLayer.bvtiled!=undefined) NewBackLayer.m_pBackground.vtiled = pLayer.bvtiled;
                if (pLayer.bblend != undefined) { NewBackLayer.m_pBackground.blend = ConvertGMColour(pLayer.bblend); NewBackLayer.m_pBackground.alpha = ((pLayer.bblend >> 24) & 0xff) / 255.0; }
                
                if(pLayer.playbackspeedtype!=undefined) NewBackLayer.m_pBackground.playbackspeedtype = pLayer.playbackspeedtype;
                if(pLayer.bimage_speed!=undefined) NewBackLayer.m_pBackground.playbackspeed = pLayer.bimage_speed;
                if(pLayer.pName!=undefined) NewBackLayer.m_name = pLayer.pName;
                
                //wut?
                if ((pLayer.bstretch != undefined) )
                {
                   NewBackLayer.m_pBackground.stretch = pLayer.bstretch ;    
                }
                
                if ((pLayer.bstretch != undefined) && (pLayer.bstretch == true) && (sprite_exists(NewBackLayer.m_pBackground.index)))
                {
                    var value = sprite_get_width(NewBackLayer.m_pBackground.index); //These will be ignored if stretch is set but give them a default
                    if(value>0)
                      NewBackLayer.m_pBackground.xscale = r_width/value ;
                    
                    value = sprite_get_height(NewBackLayer.m_pBackground.index);
                    if(value>0)
                      NewBackLayer.m_pBackground.yscale = r_height/value ;    
                }

                
                this.AddNewElement(_room,NewLayer,NewBackLayer);
                
            }
            else if(pLayer.type === YYLayerType_Instance)
            {
                
                var numinsts =0;
                if(pLayer.icount!=undefined) numinsts =pLayer.icount; 
                
                for(var i=numinsts-1;i>=0;i--)
                {
                    var NewInstanceElement = new CLayerInstanceElement();                    
                    NewInstanceElement.m_instanceID = pLayer.iinstIDs[i];
                    
                    this.AddNewElement(_room,NewLayer,NewInstanceElement,false);
                }
                
                
            }
            else if(pLayer.type === YYLayerType_Asset)
            {
            
                
                var numtiles =0;
                if(pLayer.acount!=undefined) numtiles = pLayer.acount;
                
                
                if(numtiles>0)
                {

                    var i;
                    for(i = numtiles - 1; i >= 0; i--)
                    {
                        var newTile = new CLayerTileElement();

                        if(pLayer.assets[i].ax!=undefined) newTile.m_x=pLayer.assets[i].ax;
                        if(pLayer.assets[i].ay!=undefined) newTile.m_y=pLayer.assets[i].ay;
                        if(pLayer.assets[i].aindex!=undefined) newTile.m_index=pLayer.assets[i].aindex;
                        if(pLayer.assets[i].aXO!=undefined) newTile.m_xo=pLayer.assets[i].aXO;
                        if(pLayer.assets[i].aYO!=undefined) newTile.m_yo=pLayer.assets[i].aYO;
                        if(pLayer.assets[i].aW!=undefined) newTile.m_w=pLayer.assets[i].aW;
                        if(pLayer.assets[i].aH!=undefined) newTile.m_h=pLayer.assets[i].aH;                                                
                        if(pLayer.assets[i].aXScale!=undefined) newTile.imageScaleX=pLayer.assets[i].aXScale;
                        if(pLayer.assets[i].aYScale!=undefined) newTile.imageScaleY=pLayer.assets[i].aYScale;
                        if (pLayer.assets[i].aBlend != undefined) { newTile.imageBlend = pLayer.assets[i].aBlend & 0xffffff; newTile.imageAlpha = ((pLayer.assets[i].aBlend >> 24) & 0xff) / 255.0; }

                        this.AddNewElement(_room, NewLayer, newTile, false);

                    }

                    /*var NewTileLayer = new CLayerOldTilemapElement();
                    var NewTiles = new YYRoomTile3();                    
                    NewTileLayer.m_TileData = NewTiles;
                    for(var i=0;i<numtiles;i++)
                    {
                        
                        NewTileLayer.tile[i]= pLayer.assets[i];
                        if(pLayer.assets[i].ax!=undefined) NewTiles[i].x=pLayer.assets[i].ax;
                        if(pLayer.assets[i].ay!=undefined) NewTiles[i].y=pLayer.assets[i].ay;
                        if(pLayer.assets[i].aindex!=undefined) NewTiles[i].index=pLayer.assets[i].aindex;
                        if(pLayer.assets[i].aXO!=undefined) NewTiles[i].xo=pLayer.assets[i].aXO;
                        if(pLayer.assets[i].aYO!=undefined) NewTiles[i].yo=pLayer.assets[i].aYO;
                        if(pLayer.assets[i].aW!=undefined) NewTiles[i].w=pLayer.assets[i].aW;
                        if(pLayer.assets[i].aH!=undefined) NewTiles[i].h=pLayer.assets[i].aH;
                        if(pLayer.assets[i].aDepth!=undefined) NewTiles[i].depth=pLayer.assets[i].aDepth;
                        if(pLayer.assets[i].aId!=undefined) NewTiles[i].id=pLayer.assets[i].aId;
                        if(pLayer.assets[i].aXScale!=undefined) NewTiles[i].scaleX=pLayer.assets[i].aXScale;
                        if(pLayer.assets[i].aYScale!=undefined) NewTiles[i].scaleY=pLayer.assets[i].aYScale;
                        if(pLayer.assets[i].aBlend!=undefined) NewTiles[i].colour=ConvertGMColour(pLayer.assets[i].aBlend);
                    }
                    this.AddNewElement(_room,NewLayer,NewTileLayer,false);*/
                }
                
                var numsprites = 0;
                if(pLayer.scount!=undefined) numsprites = pLayer.scount;
                if(numsprites>0)
                {
                    for(var i=numsprites-1; i>=0; i--)
                    {
//    this.m_playbackspeedtype=ePlaybackSpeedType_FramesPerSecond;    // 0 = frames per second (default), 1 = frames per game frame
//    this.m_playbackspeed=0;        // actual image playback speed
                    
                        var NewSprite = new CLayerSpriteElement();   
                        NewSprite.m_playbackspeedtype = ePlaybackSpeedType_FramesPerSecond;
                        NewSprite.m_spriteIndex = pLayer.sprites[i].sIndex;
                        NewSprite.m_sequencePos = pLayer.sprites[i].sImageIndex;
                        NewSprite.m_sequenceDir = 1.0;
                                                
                        if( pLayer.sprites[i].sPlaybackSpeedType!=undefined) NewSprite.m_playbackspeedtype=pLayer.sprites[i].sPlaybackSpeedType;
                        NewSprite.m_imageSpeed = pLayer.sprites[i].sImageSpeed;
                        NewSprite.m_imageIndex = pLayer.sprites[i].sImageIndex;
                        NewSprite.m_imageScaleX = pLayer.sprites[i].sXScale;
                        NewSprite.m_imageScaleY = pLayer.sprites[i].sYScale;
                        NewSprite.m_imageAngle = pLayer.sprites[i].sRotation;
                        NewSprite.m_imageBlend = ConvertGMColour(pLayer.sprites[i].sBlend & 0xffffff);
                        NewSprite.m_imageAlpha = ((pLayer.sprites[i].sBlend>>24)&0xff) / 255.0;
                        NewSprite.m_x = pLayer.sprites[i].sX;
                        NewSprite.m_y = pLayer.sprites[i].sY;
                        NewSprite.m_name = pLayer.sprites[i].sName;
                        
                        this.AddNewElement(_room,NewLayer,NewSprite,false);
                    
                    }
                }

                // Sequences
                var numsequences = 0;
                if (pLayer.ecount != undefined) numsequences = pLayer.ecount;
                if (numsequences > 0) {
                    for (var i = numsequences-1; i >= 0; i--) {

                        var NewSequence = new CLayerSequenceElement();

                        NewSequence.m_sequenceIndex = pLayer.sequences[i].sIndex;
                        //NewSequence.m_imageSpeed = pLayer.sequences[i].sImageSpeed;
                        NewSequence.m_headPosition = pLayer.sequences[i].sHeadPosition;
                        // NewSequence.m_blend = pLayer.sequences[i].sBlend;
                        NewSequence.m_imageBlend = ConvertGMColour(pLayer.sequences[i].sBlend & 0xffffff);
                        NewSequence.m_imageAlpha = ((pLayer.sequences[i].sBlend>>24)&0xff) / 255.0;
                        NewSequence.m_scaleX = pLayer.sequences[i].sXScale;
                        NewSequence.m_scaleY = pLayer.sequences[i].sYScale;
                        NewSequence.m_x = pLayer.sequences[i].sX;
                        NewSequence.m_y = pLayer.sequences[i].sY;
                        NewSequence.m_angle = pLayer.sequences[i].sRotation;
                        NewSequence.m_name = pLayer.sequences[i].sName;
                        NewSequence.m_layer = NewLayer;
                        NewSequence.m_imageSpeed = pLayer.sequences[i].sImageSpeed;

                        this.AddNewElement(_room, NewLayer, NewSequence, false);
                    }
                }

                // Particles
                var numparticles = 0;
                if (pLayer.pcount != undefined) numparticles = pLayer.pcount;

                if (numparticles > 0) {
                    for (var i = numparticles - 1; i >= 0; --i)
                    {
                        var pParticle = pLayer.particles[i];
                        var NewParticle = new CLayerParticleElement();

                        NewParticle.m_systemID = -1;
                        NewParticle.m_ps = pParticle.sIndex;
                        NewParticle.m_imageScaleX = pParticle.sXScale;
                        NewParticle.m_imageScaleY = pParticle.sYScale;
                        NewParticle.m_imageAngle = pParticle.sRotation;
                        NewParticle.m_imageBlend = ConvertGMColour(pParticle.sBlend & 0xffffff);
                        NewParticle.m_imageAlpha = ((pParticle.sBlend>>24)&0xff) / 255.0;
                        NewParticle.m_x = pParticle.sX;
                        NewParticle.m_y = pParticle.sY;
                        NewParticle.m_pName = pParticle.sName;

                        this.AddNewElement(_room, NewLayer, NewParticle, false);
                    }
                }
            }
            else if(pLayer.type === YYLayerType_Tile)
            {
                if (pLayer.tIndex >= 0)  // ignore any tile elements that have a negative index (as this means they don't have a tileset assigned)
                {
                    var TileLayer = new CLayerTilemapElement();                
                    
                    
                    TileLayer.m_backgroundIndex = pLayer.tIndex;
                    TileLayer.m_mapWidth = pLayer.tMapWidth;
                    TileLayer.m_mapHeight = pLayer.tMapHeight;
                    TileLayer.m_pTiles=[];

                    var numtiles =0;
                    if(pLayer.tcount!=undefined) numtiles =pLayer.tcount; 
                    
                    for(var i=0;i<numtiles;i++)
                    {
                    TileLayer.m_pTiles[i]= pLayer.ttiles[i];
                    }
                    if(pLayer.pName!=undefined) TileLayer.m_name = pLayer.pName;
            
                    this.AddNewElement(_room,NewLayer,TileLayer,false);
                }
           
            }
            else if(pLayer.type === YYLayerType_Effect)
            {
                if (NewLayer.m_pInitialEffectInfo != null)
                {
                    NewLayer.m_pInitialEffectInfo.bAffectsSingleLayerOnly = false;          // effects layers currently always affect everything below them
                }
            }

            _room.m_Layers.Add(NewLayer);
            this.SetLayerIndexWatermark( yymax(this.GetLayerIDWatermark(), NewLayer.m_id) );
        }
        
    }
};

function ConvertFileEffectParamType(_filetype)
{
	var type = FAE_PARAM_FLOAT;
	if ((_filetype >= 0) || (_filetype < YYEffectLayerParamType_Max))
	{
		var mapping =
		[
			FAE_PARAM_FLOAT,		//YYEffectLayerParamType_Real
			FAE_PARAM_FLOAT,		//YYEffectLayerParamType_Colour
			FAE_PARAM_SAMPLER,		//YYEffectLayerParamType_Sampler
        ];

		type = mapping[_filetype];
	}

    var resObj = {};

    var elements = 1;
    switch (_filetype)
    {
    case YYEffectLayerParamType_Real: break;
    case YYEffectLayerParamType_Colour: elements = 4; break;
    case YYEffectLayerParamType_Sampler: break;
    default: break;
    }

    resObj.type = type;
    resObj.elements = elements;

	return resObj;
}

LayerManager.prototype.SetScriptInstance = function(_inst)
{
    this.m_ScriptInstance = _inst;
};

LayerManager.prototype.GetScriptInstance = function()
{
    return this.m_ScriptInstance;
};


function layerGetObj(room, id_or_name) {
    if (typeof (id_or_name) === "string") return g_pLayerManager.GetLayerFromName(room, yyGetString(id_or_name));
    return g_pLayerManager.GetLayerFromID(room, yyGetInt32(id_or_name));
};

function layerGetFromTargetRoom(_id_or_name) {
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room == null) return null;
    
    return layerGetObj(room, _id_or_name);
};

function layer_get_id( _name) 
{
    var room = g_pLayerManager.GetTargetRoomObj();

   if(room==null)
    return -1;
   
   var pLayer = g_pLayerManager.GetLayerFromName(room, yyGetString(_name));
   if(pLayer!=null)
   {
        return pLayer.m_id;
   }
    
   return -1;
};

function layer_get_id_at_depth(_depth)
{
    var room = g_pLayerManager.GetTargetRoomObj();

    if(room==null)
    {
        var arr = [];
        arr[0] = -1;
        return arr;
    }

    var res = [];
    var numlayers = 0;
    var i;
    for(i = 0; i < room.m_Layers.length; i++ )
    {
        var layer = room.m_Layers[i];
        if (layer != null)
        {
            if (layer.depth == yyGetInt32(_depth))
            {
                res[numlayers++] = layer.m_id;
            }
        }
    }

    if (numlayers == 0)
    {
        var arr = [];
        arr[0] = -1;
        return arr;
    }

    return res;
}

function layer_get_depth( _id)
{
    var pLayer = layerGetFromTargetRoom(_id);
   if(pLayer!=null)
   {
        return pLayer.depth;
   }
    
   return -1;

};


function layer_create( _depth,_name) 
{
    var room = g_pLayerManager.GetTargetRoomObj();

    if (room == null) return -1;

    var NewLayer = new CLayer();    
    NewLayer.m_id = g_pLayerManager.GetNextLayerID();
    NewLayer.depth = yyGetInt32(_depth);
    NewLayer.m_pName = yyGetString(_name);
    NewLayer.m_dynamic = false;

    if ((NewLayer.m_pName == undefined) || (NewLayer.m_pName == null))
    {
        NewLayer.m_pName = "_layer_" + NewLayer.m_id.toString(16);
    }

    room.m_Layers.Add(NewLayer);    
    
    return NewLayer.m_id;

};

function layer_destroy( arg1) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(room, arg1);

    if(pLayer!=null)
        g_pLayerManager.RemoveLayer(room,pLayer.m_id);

    return -1;
};

function layer_destroy_instances(arg1)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(room, arg1);

    if(pLayer!=null)
    {
        for(var i = 0; i < pLayer.m_elements.length; i++)
        {
            var el = pLayer.m_elements.Get(i);
            if (el != null)
            {
                if (el.m_type == eLayerElementType_Instance)
                {
                    g_pLayerManager.RemoveElementFromLayer(room, el,pLayer, false, true);
                }
            }
        }
    }
    return -1;
};

function layer_add_instance( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(room, arg1);

    if (pLayer === null) return -1;

    if (room == g_RunRoom)
    {    
        var inst = g_pInstanceManager.Get(yyGetInt32(arg2));
        
        if(inst ===null)
            return -1;
        g_pLayerManager.RemoveInstance(room,inst);
        g_pLayerManager.AddInstanceToLayer(room,pLayer,inst);    
    }
    else
    {
        var instanceID = yyGetInt32(arg2);
        var oldLayerID = g_pLayerManager.GetLayerIDForInstance(room, instanceID);
        if (oldLayerID != -1)
        {
            var oldLayer = g_pLayerManager.GetLayerFromID(room, oldLayerID);
            g_pLayerManager.RemoveStorageInstanceFromLayer(room, oldLayer, instanceID);
        }

        var instEl = new CLayerInstanceElement();
        instEl.m_instanceID = instanceID;

        g_pLayerManager.AddNewElement(room, pLayer, instEl, false);
    }
    return -1;
};

function layer_remove_instance( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();

    var pLayer = layerGetObj(room, arg1);
    
    if(pLayer === null)
        return;
    var inst = g_pInstanceManager.Get(yyGetInt32(arg2));
    
    if(inst ===null)
        return;
        
    if(inst.m_bOnActiveLayer===false)
    {
        return;
    }
    
    if(inst.m_nLayerID != pLayer.m_id)
    {
        return;
    }
    g_pLayerManager.RemoveInstanceFromLayer(room,pLayer,inst);
};

function layer_has_instance( arg1,arg2) 
{
    var pLayer = layerGetFromTargetRoom(arg1);
    if (pLayer === null) return false;
        
    var inst = g_pInstanceManager.Get(yyGetInt32(arg2));
    
    if(inst ===null)
        return false;
        
    if(inst.m_bOnActiveLayer===true && inst.m_nLayerID === pLayer.m_id)
    {
        return true;
    }
    
    return false;
};

function layer_instance_get_instance(_id) {
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room != null) {
        var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(_id));
        if (el != null && el.m_type === eLayerElementType_Instance) {
            return MAKE_REF(REFID_INSTANCE, el.m_instanceID);
        }
    }
    return OBJECT_NOONE;
}

function layer_set_visible( arg1,arg2) 
{
    var pLayer = layerGetFromTargetRoom(arg1);
    if (pLayer === null) return;
   
   pLayer.m_visible = yyGetBool(arg2);
  
};
function layer_get_visible( arg1) 
{
    var pLayer = layerGetFromTargetRoom(arg1);
    if (pLayer === null) return;
    
    return pLayer.m_visible;
};

function layer_exists( arg1) 
{
    var pLayer = layerGetFromTargetRoom(arg1);
    if (pLayer === null) return false;
        
    return true;
};

function layer_script_begin( arg1,arg2) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return;

    if(typeof (arg2) === "number")
    {
        var ind = yyGetInt32(arg2);
        if( ind >= 100000 )
            ind -= 100000;
        layer.m_beginScript = g_pGMFile.Scripts[yyGetInt32(ind)];
    }
    else
    {
        layer.m_beginScript = arg2;
    }

    if(g_pLayerManager.GetScriptInstance() === null)
    {
        var pScriptInst = new yyInstance(0, 0, 0, 0, false, true);
        g_pLayerManager.SetScriptInstance(pScriptInst);
    }
};
function layer_script_end( arg1,arg2) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return;

    if(typeof (arg2) === "number")
    {
        var ind = yyGetInt32(arg2);
        if( ind >= 100000 )
            ind -= 100000;
        layer.m_endScript = g_pGMFile.Scripts[yyGetInt32(ind)];
    }
    else
    {
        layer.m_endScript = arg2;
    }

    if(g_pLayerManager.GetScriptInstance() === null)
    {
        var pScriptInst = new yyInstance(0, 0, 0, 0, false, true);
        g_pLayerManager.SetScriptInstance(pScriptInst);
    }
};

function layer_shader( arg1,arg2)
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return;

    layer.m_shaderId = yyGetInt32(arg2);
};

function __find_script_id( _script )
{
    var ret = _script;
    var len =  g_pGMFile.Scripts.length;
    for( var n=0; n<len; ++n) {
        if (_script == g_pGMFile.Scripts[n]) {
            ret = n + 100000;
            break;
        } // end if
    } // end for
    return ret;
};

function layer_get_script_begin( arg1) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return -1;
    
    _script_id = __find_script_id(layer.m_beginScript);
    return _script_id === null ? -1 : _script_id;
};
function layer_get_script_end( arg1) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return -1;

    _script_id = __find_script_id(layer.m_endScript);
    return _script_id === null ? -1 : _script_id;
};

function layer_get_shader( arg1) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return -1;
            
    return layer.m_shaderId;
};

function layer_set_target_room(arg1)
{
    g_pLayerManager.m_nTargetRoom = yyGetInt32(arg1);
};

function layer_get_target_room()
{
    return g_pLayerManager.m_nTargetRoom;
}

function layer_reset_target_room()
{
    g_pLayerManager.m_nTargetRoom = -1;
}

// Background element functions

function layerBackgroudGetElement(bg_element_id) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var el = g_pLayerManager.GetElementFromID(room, bg_element_id);

    if ((el != null) && (el.m_type === eLayerElementType_Background) && (el.m_pBackground != null)) return el;
    return null;
};

function layer_background_get_id( arg1)
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return -1;
    
    var el = g_pLayerManager.GetElementFromName(layer,layer.m_pName);
    if(el!=null)
    {
        return el.m_id;
    }
   
    
};
function layer_background_exists( arg1,arg2) 
{
    var layer = layerGetFromTargetRoom(arg1);
    if (layer === null) return false;

    var el = g_pLayerManager.GetElementFromIDWithLayer(layer, yyGetInt32(arg2));
    if((el!=null) && (el.m_type ===eLayerElementType_Background) && (el.m_pBackground!=null))
    {
        return true;
    }
    return false;
};

function layer_background_create( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return -1;

    var layer = layerGetObj(room, arg1);        
   
    if(layer!=null)
    {
    
    
        var NewBackLayer = new CLayerBackgroundElement();        
        NewBackLayer.m_pBackground = new CBackGM2();
     
        var blayer;   
       
        NewBackLayer.m_pBackground.visible = true;
        NewBackLayer.m_pBackground.foreground = false;
        NewBackLayer.m_pBackground.index = yyGetInt32(arg2);
        NewBackLayer.m_pBackground.htiled = false;
        NewBackLayer.m_pBackground.vtiled = false;
        NewBackLayer.m_pBackground.blend = 0xffffffff;
        NewBackLayer.m_pBackground.alpha = 1;
        NewBackLayer.m_pBackground.image_index = 0;
        NewBackLayer.m_pBackground.image_speed = 1;
        //NewBackLayer.m_name = pLayer.pName;
        
       
       
        g_pLayerManager.AddNewElement(room,layer,NewBackLayer);
    
        return NewBackLayer.m_id;
    }
    return -1;

};
function layer_background_destroy( arg1) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return;

    g_pLayerManager.RemoveElementById(room, yyGetInt32(arg1));
};

function layer_background_visible( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.visible = yyGetBool(arg2);
    }
};
function layer_background_change( arg1,arg2) {

    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.index = yyGetInt32(arg2);
    }
};
function layer_background_htiled( arg1,arg2)
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.htiled = yyGetBool(arg2);
    }
};
function layer_background_vtiled( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.vtiled = yyGetBool(arg2);
    }
};
function layer_background_xscale( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.xscale = yyGetReal(arg2);
    }
};
function layer_background_yscale( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.yscale = yyGetReal(arg2);
    }
};


function layer_background_stretch( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.stretch = yyGetBool(arg2);
    }
};

function layer_background_blend( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.blend = ConvertGMColour(yyGetInt32(arg2));
    }
};
function layer_background_alpha( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.alpha = yyGetReal(arg2);
    }
};
function layer_background_index( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        var image_index = yyGetInt32(arg2);
        var max_index = sprite_get_number(el.m_pBackground.image_index);

        el.m_pBackground.image_index = fwrap(image_index, max_index);
    }
};
function layer_background_sprite( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.index = yyGetReal(arg2);
    }
};
function layer_background_speed( arg1,arg2) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_pBackground.image_speed = yyGetReal(arg2);
    }
};

function layer_background_get_visible( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.visible;
    }
    
    return true;
};
function layer_background_get_sprite( arg1)
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.index;
    }
    
    return -1;

};

function layer_background_get_htiled( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.htiled;
    }
    
    return false;
};
function layer_background_get_vtiled( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.vtiled;
    }
    
    return false;
};
function layer_background_get_stretch( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.stretch;
    }
    
    return false;

};


function layer_background_get_xscale( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.xscale;
    }
    
    return 1;

};


function layer_background_get_yscale( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.yscale;
    }
    
    return 1;

};


function layer_background_get_blend( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return ConvertGMColour(el.m_pBackground.blend);
    }
    
    return 0;

};
function layer_background_get_alpha( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.alpha;
    }
    
    return 0;

};
function layer_background_get_index( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.image_index;
    }
    
    return -1;


};
function layer_background_get_speed( arg1) 
{
    var el = layerBackgroudGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_pBackground.image_speed;
    }
    
    return 0;

};

// Sprite element functions
function layerSpriteGetElement(spr_element_id) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var el = g_pLayerManager.GetElementFromID(room, spr_element_id);

    if ((el != null) && (el.m_type === eLayerElementType_Sprite)) return el;
    return null;
};

function layer_sprite_get_id( _layerid,_spritename)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return -1;

    var layer = layerGetObj(room, _layerid);
            
   
    if(layer!=null)
    {
        var element = g_pLayerManager.GetElementFromName(layer, yyGetString(_spritename));
        if(element!=null && element.m_type == eLayerElementType_Sprite)
        {
            return element.m_id;
        }
    }
    return -1;
};
function layer_sprite_exists( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return false;

    var layer = layerGetObj(room, arg1);
    if (layer === null) return false;

    var el = g_pLayerManager.GetElementFromIDWithLayer(layer, yyGetInt32(arg2));
    if((el!=null) && (el.m_type ===eLayerElementType_Sprite) )
    {
        return true;
    }
    return false;

};

function layer_sprite_create( arg1,arg2,arg3,arg4) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return -1;

    var layer = layerGetObj(room, arg1);
        
    if(layer!=null)
    {
    
        var sprel = new CLayerSpriteElement();
        
        sprel.m_spriteIndex = yyGetInt32(arg4);
        sprel.m_x = yyGetReal(arg2);
        sprel.m_y = yyGetReal(arg3);

        g_pLayerManager.AddNewElement(room,layer,sprel);
    
        return sprel.m_id;
    }
    return -1;

};
function layer_sprite_destroy( arg1) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return;

    g_pLayerManager.RemoveElementById(room, yyGetInt32(arg1));

};

function layer_sprite_change( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_spriteIndex = yyGetInt32(arg2);
    }

};
function layer_sprite_index( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return;

    var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(arg1));
    if((el!=null) && (el.m_type ===eLayerElementType_Sprite))
    {
        el.m_imageIndex = yyGetInt32(arg2);

        var frame = yyGetInt32(arg2);
        var sprite = g_pSpriteManager.Get(el.m_spriteIndex);

        if (sprite != null)
        {
            // Set playhead to the start\end of the keyframe matching this index
            // We're currently assuming that the number of images matches the number of keyframes		
            // Sanity check
            if (sprite.sequence != null && sprite.sequence.m_tracks != null && sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames)
            {
                var pTrack = sprite.sequence.m_tracks[0];

                var keyframeStore = pTrack.m_keyframeStore;
                var numkeyframes = keyframeStore.numKeyframes;

                if (numkeyframes > 0)
                {
                    var wrappedFrame = fwrap(frame, numkeyframes);
                    var keyindex = wrappedFrame;
                    var fracval = wrappedFrame - keyindex;

                    // Update the sequence position
                    el.m_sequencePos = (keyframeStore.keyframes[Math.floor(keyindex)].m_key + (fracval * numkeyframes));
                    el.m_imageIndex = wrappedFrame;	// use wrapped value
                }
                else
                {
                    el.m_imageIndex = frame;	// we don't have any actual frames in our sprite frames track so just pass the value straight through
                }
            }
            else
            {
                el.m_imageIndex = frame;	// we don't have a sprite frames track so just pass the value straight through
            }
        }
        else
        {
            el.m_imageIndex = frame;	// just use value as-is
        }
    }
};
function layer_sprite_speed( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageSpeed = yyGetReal(arg2);
    }

};
function layer_sprite_xscale( arg1,arg2)
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageScaleX = yyGetReal(arg2);
    }
};
function layer_sprite_yscale( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageScaleY = yyGetReal(arg2);
    }
};
function layer_sprite_angle( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageAngle = yyGetReal(arg2);
    }
};
function layer_sprite_blend( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageBlend =ConvertGMColour(yyGetInt32(arg2));
    }
};
function layer_sprite_alpha( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_imageAlpha = yyGetReal(arg2);
    }
};
function layer_sprite_x( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_x = yyGetReal(arg2);
    }
};
function layer_sprite_y( arg1,arg2) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        el.m_y = yyGetReal(arg2);
    }
};

function layer_sprite_get_sprite( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_spriteIndex;
    }
    return -1;
};
function layer_sprite_get_index( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageIndex;
    }
    return -1;
};	
function layer_sprite_get_speed( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageSpeed;
    }
    return 0;
};	
function layer_sprite_get_xscale( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageScaleX;
    }
    return 1;

};
function layer_sprite_get_yscale( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageScaleY;
    }
    return 1;

};	
function layer_sprite_get_angle( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageAngle;
    }
    return 0;

};	
function layer_sprite_get_blend( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return ConvertGMColour(el.m_imageBlend);
    }
    return 0;

};
function layer_sprite_get_alpha( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_imageAlpha;
    }
    return 0;

};			
function layer_sprite_get_x( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_x;
    }
    return 0;
};	
function layer_sprite_get_y( arg1) 
{
    var el = layerSpriteGetElement(arg1);
    if (el != null)
    {
        return el.m_y;
    }
    return 0;

};

// Tilemap element functions
function layerTilemapGetElement(tm_element_id)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var el = g_pLayerManager.GetElementFromID(room, tm_element_id);

    if ((el != null) && (el.m_type === eLayerElementType_Tilemap)) return el;
    return null;
}

function layer_tilemap_get_id( arg1) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) MAKE_REF(REFID_BACKGROUND,-1);

    var layer = layerGetObj(room, arg1); 
    if(layer!=null)
    {
        var element = g_pLayerManager.GetFirstElementOfType(layer,eLayerElementType_Tilemap);
        if(element!=null && element.m_type == eLayerElementType_Tilemap)
        {
            return MAKE_REF(REFID_BACKGROUND,element.m_id);
        }
    }
    return MAKE_REF(REFID_BACKGROUND,-1);

};
function layer_tilemap_exists( arg1,arg2) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return false;

    var layer = layerGetObj(room, arg1);
    if(layer!=null)
    {
        // did we get a tilemap name, or a tilemap ID?
        var element = g_pLayerManager.GetElementFromIDWithLayer(layer, yyGetInt32(arg2));

        if(element!=null && element.m_type == eLayerElementType_Tilemap)
        {
            return true;
        }
    }
    return false;

};

function layer_tilemap_create( arg1,arg2,arg3,arg4,arg5,arg6) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return MAKE_REF(REFID_BACKGROUND,-1);;

    var layer = layerGetObj(room, arg1);
   
    if(layer!=null)
    {
        var TileLayer = new CLayerTilemapElement();
      
        TileLayer.m_backgroundIndex = yyGetInt32(arg4);
        TileLayer.m_mapWidth = yyGetInt32(arg5);
        TileLayer.m_mapHeight = yyGetInt32(arg6);
        TileLayer.m_x = yyGetReal(arg2);
        TileLayer.m_y = yyGetReal(arg3);
        TileLayer.m_pTiles=[];

        var numtiles =0;
        numtiles =arg5*arg6; 
        
        for(var i=0;i<numtiles;i++)
        {
           TileLayer.m_pTiles[i]=0;
        }
       // if(pLayer.pName!=undefined) TileLayer.m_name = pLayer.pName;
   
        g_pLayerManager.AddNewElement(room,layer,TileLayer,true);

        return MAKE_REF(REFID_BACKGROUND,TileLayer.m_id);
       
    }
    return MAKE_REF(REFID_BACKGROUND,-1);
};
function layer_tilemap_destroy( arg1) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if (room === null) return;
    
    g_pLayerManager.RemoveElementById(room, yyGetInt32(arg1));
};

function layer_x(arg1,arg2)
{
    var layer = layerGetFromTargetRoom(arg1);
   
    if(layer!=null)
    {
        layer.m_xoffset = yyGetReal(arg2);
    }
};

function layer_y(arg1,arg2)
{
    var layer = layerGetFromTargetRoom(arg1);
   
    if(layer!=null)
    {
        layer.m_yoffset = yyGetReal(arg2);
    }
   
};

function layer_get_x(arg1)
{
    var layer = layerGetFromTargetRoom(arg1);
   
    if(layer!=null)
    {
        return layer.m_xoffset;
    }
    
    return 0;
};

function layer_get_y(arg1)
{
    var layer = layerGetFromTargetRoom(arg1);
   
    if(layer!=null)
    {
        return layer.m_yoffset;
    }
    
    return 0;
};

function layer_hspeed(layer_id, speed)
{
    var layer = layerGetFromTargetRoom(layer_id);

    if (layer != null) {
        layer.m_hspeed = yyGetReal(speed);
    }

    return 0;
};

function layer_vspeed(layer_id, speed)
{
    var layer = layerGetFromTargetRoom(layer_id);

    if (layer != null) {
        layer.m_vspeed = yyGetReal(speed);
    }

    return 0;
};

function layer_get_hspeed(layer_id)
{
    var layer = layerGetFromTargetRoom(layer_id);

    if (layer != null) {
        return layer.m_hspeed;
    }

    return 0;
};

function layer_get_vspeed(layer_id)
{
    var layer = layerGetFromTargetRoom(layer_id);

    if (layer != null) {
        return layer.m_vspeed;
    }

    return 0;
};

function tilemap_tileset( arg1,arg2) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_backgroundIndex = yyGetInt32(arg2);
    } 
};

function tilemap_x( arg1,arg2) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_x = yyGetReal(arg2);
    } 
};
function tilemap_y( arg1,arg2) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_y = yyGetReal(arg2);
    } 
};

function tilemap_set( arg1,arg2,arg3,arg4) 
{
    arg3 = yyGetInt32(arg3);
    arg4 = yyGetInt32(arg4);

    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        if(arg3<0)
        {
            debug("tilemap_set_tile called with negative x coord, fails");
            return;
        }
        if(arg4<0)
        {
            debug("tilemap_set_tile called with negative y coord, fails");
            return;
        }
        if(arg3>=el.m_mapWidth)
        {
            debug("tilemap_set_tile called with x coord greater than map width, fails");
            return;
        }
        if(arg4>=el.m_mapHeight)
        {
            debug("tilemap_set_tile called with y coord greater than map height, fails");
            return;
        }
        
        var x = arg3;
        var y = arg4;
		var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

		var tileindexdata = yyGetInt32(arg2);
		var tileindex = ((tileindexdata >> TileIndex_Shift) & TileIndex_ShiftedMask);
		if (back != null && tileindex >= back.tilecount)
		{
			debug("layer_tilemap_set_tile() - tile index outside tile set count");
			return;
		}

		// Replace the tile data at this location
		var index = (y * el.m_mapWidth) + x;
		el.m_pTiles[index] = tileindexdata;		
    } 

};

/** @constructor */
function CLayerElement()
{
	this.element=-1;				// whether to show the background at start
    this.layer=-1;
};
     

function tilemap_set_at_pixel( arg1,arg2,arg3,arg4) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var ret = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(arg1));

    if (ret == null) return -1;
    
    
    var el = ret.element;
    var _layer=ret.layer;
    
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap))
    {  
		var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);


        var tw = back.tilewidth;
        var th = back.tileheight;

        var rcptw = 1/tw;
        var rcpth = 1/th;
        
        var tmapoffx = el.m_x+_layer.m_xoffset;
        var tmapoffy = el.m_y+_layer.m_yoffset;
        
        var tmpw = el.m_mapWidth*tw;
        var tmph = el.m_mapHeight*th;
        
        var x = yyGetReal(arg3);
        var y = yyGetReal(arg4);
        
        x-= tmapoffx;
        y-= tmapoffy;
        
        if(x<0)
            return -1;
            
        if(y<0)
            return -1;
            
        if(x>=tmpw)
            return -1;
        if(y>tmph)
            return -1;

        var indexX = Math.floor(x*rcptw);
        var indexY = Math.floor(y*rcpth);
        
        indexX = yymax(0,yymin(indexX,el.m_mapWidth));
        indexY = yymax(0,yymin(indexY,el.m_mapHeight));

        var index = indexY*el.m_mapWidth + indexX;


		var tileindexdata = yyGetInt32(arg2);
		var tileindex = ((tileindexdata >> TileIndex_Shift) & TileIndex_ShiftedMask);
		if (back != null && tileindex >= back.tilecount)
		{
			debug("tilemap_set_tile_at_pixel() - tile index outside tile set count");
			return;
		}
		el.m_pTiles[index] = tileindexdata;		
    } 

};

// #############################################################################################
/// Function:<summary>
///             Get the texture (tpage probably) associated with this background
///          </summary>
// #############################################################################################
function tileset_get_texture(_ind) {

    var pDest = g_pBackgroundManager.GetImage(yyGetInt32(_ind));
    if (pDest) {
    
        return ({ WebGLTexture: pDest.TPEntry.texture, TPE: pDest.TPEntry });
    }
    return null;
}

// #############################################################################################
/// Function:<summary>
///             Get the texture (tpage probably) associated with this background
///          </summary>
// #############################################################################################
function tileset_get_name(_ind) {

    var pDest = g_pBackgroundManager.GetImage(yyGetInt32(_ind));
    if( !pDest) return "";
    return pDest.pName;
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:     <param name="_ind"></param>
/// Out:    <returns>
///             
///         </returns>
// #############################################################################################
function tileset_get_uvs(_ind) {

    var pDest = g_pBackgroundManager.GetImage(yyGetInt32(_ind));
    if (pDest) {
                        
        var pTPE = pDest.TPEntry;
        
        var texture = pTPE.texture;
        
        var oneTexelW = 1.0 / texture.m_Width;
        var oneTexelH = 1.0 / texture.m_Height;
        
        var arrayData = [];
        arrayData.push(pTPE.x*oneTexelW, pTPE.y*oneTexelH, (pTPE.x+pTPE.CropWidth)*oneTexelW, (pTPE.y+pTPE.CropHeight)*oneTexelH);
        
        return arrayData;
    }
    return null;
}

function tileset_get_info(_ind) {

    var pDest = g_pBackgroundManager.GetImage(yyGetInt32(_ind));
    var ret = undefined;
    if( pDest) {
        ret = new GMLObject();

        var pTPE = pDest.TPEntry;        
        var texture = pTPE.texture;
        variable_struct_set(ret, "width", texture.width); 
        variable_struct_set(ret, "height", texture.height); 
        variable_struct_set(ret, "texture", pTPE.tp); 
        variable_struct_set(ret, "tile_width", pDest.tilewidth); 
        variable_struct_set(ret, "tile_height", pDest.tileheight); 
        variable_struct_set(ret, "tile_horizontal_separator", pDest.tilehsep); 
        variable_struct_set(ret, "tile_vertical_separator", pDest.tilevsep); 
        variable_struct_set(ret, "tile_columns", pDest.tilecolumns); 
        variable_struct_set(ret, "tile_count", pDest.tilecount); 
        variable_struct_set(ret, "sprite_index", pDest.spriteindex); 
        variable_struct_set(ret, "frame_count", pDest.frames); 
        variable_struct_set(ret, "frame_length_ms", pDest.framelength); 

        var frames = new GMLObject();
        for( var t = 0; t < pDest.tilecount; ++t) {

            var allFramesSame = true;
            for( var f=0; allFramesSame &&  f<pDest.frames; ++f) {

                var tt = pDest.framedata[ (t*pDest.frames) + f ];
                if (tt == 0) break;
                allFramesSame = (tt == t);

            } // end for

            // goto next tile if all frames are the same in the framedata.
            if (allFramesSame) continue;


            var fr = [];            
            for( var f=0; f<pDest.frames; ++f) {

                var tt = pDest.framedata[ (t*pDest.frames) + f ];
                if (tt == 0) break;

                fr[f] = tt;
            } // end for

            variable_struct_set(frames, t.toString(), fr); 
        } // end for

        variable_struct_set(ret, "frames", frames); 
    } // end if

    return ret;
}


function tilemap_get_tileset( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_backgroundIndex;
    }
    return -1;

};
function tilemap_get_tile_width( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
    	var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

        if(back!=null)
        {
            return back.tilewidth;
        }
    }
    return -1;

};
function tilemap_get_tile_height( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
    	var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

        if(back!=null)
        {
            return back.tileheight;
        }
    }
    return -1;
};
function tilemap_get_width( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_mapWidth;
    }
    return -1;

};
function tilemap_get_height( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_mapHeight;
    }
    return -1;
};

function tilemap_resize(_tilemap, _newWidth, _newHeight)
{
    if (_newWidth < 1) _newWidth = 1;
    if (_newHeight < 1) _newHeight = 1;

    var tiles = [];
    var numtiles = _newWidth * _newHeight;
    for (var i = 0; i < numtiles; ++i)
    {
        tiles[i] = 0;
    }

    var src = 0;
    var dest = 0;
    for (var y = 0; y < Math.min(_newHeight, _tilemap.m_mapHeight) ; ++y)
    {
        var count = Math.min(_newWidth, _tilemap.m_mapWidth);
        for (var i = 0; i < count; ++i)
            tiles[dest + i] = _tilemap.m_pTiles[src + i];

        src += _tilemap.m_mapWidth;
        dest += _newWidth;
    }

    _tilemap.m_pTiles = tiles;
    _tilemap.m_mapWidth = _newWidth;
    _tilemap.m_mapHeight = _newHeight;
}


function tilemap_set_width(_tilemap, _newWidth)
{
    var el = layerTilemapGetElement(yyGetInt32(_tilemap));
    if (el != null)
    {
        tilemap_resize(el, yyGetInt32(_newWidth), el.m_mapHeight);
    }
}

function tilemap_set_height(_tilemap, _newHeight)
{
    var el = layerTilemapGetElement(yyGetInt32(_tilemap));
    if (el != null)
    {
        tilemap_resize(el, el.m_mapWidth, yyGetInt32(_newHeight));
    }
}

function tilemap_get_x( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_x;
    }
    return -1;
};
function tilemap_get_y( arg1) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_y;
    }
    return -1;

};

function tilemap_get( arg1,arg2,arg3) 
{
    arg2 = yyGetInt32(arg2);
    arg3 = yyGetInt32(arg3);

    var room = g_pLayerManager.GetTargetRoomObj();

    if (room == null) {
        return 0;
    }

    var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(arg1));
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap))
    {
        if(arg2<0)
        {
            debug("tilemap_get_tile called with negative x coord, fails");
            return;
        }
        if(arg3<0)
        {
            debug("tilemap_get_tile called with negative y coord, fails");
            return;
        }
        if(arg2>=el.m_mapWidth)
        {
            debug("tilemap_get_tile called with x coord greater than map width, fails");
            return;
        }
        if(arg3>=el.m_mapHeight)
        {
            debug("tilemap_get_tile called with y coord greater than map height, fails");
            return;
        }
                
		// Replace the tile data at this location
		var index = (arg3 * el.m_mapWidth) + arg2;
		return el.m_pTiles[index];		
    } 
    return -1;
};
function tilemap_get_at_pixel( arg1,arg2,arg3) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var ret = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(arg1));
    
    if(ret==null)
    {
        return -1;
    }
    
    
    var el = ret.element;
    var _layer=ret.layer;
    
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap))
    {
        var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

        var tw = back.tilewidth;
        var th = back.tileheight;

        var rcptw = 1/tw;
        var rcpth = 1/th;
        
        var tmapoffx = el.m_x+_layer.m_xoffset;
        var tmapoffy = el.m_y+_layer.m_yoffset;
        
        var tmpw = el.m_mapWidth*tw;
        var tmph = el.m_mapHeight*th;
        
        var x = yyGetReal(arg2);
        var y = yyGetReal(arg3);
        
        x-= tmapoffx;
        y-= tmapoffy;
        
        if(x<0)
            return -1;
            
        if(y<0)
            return -1;
            
        if(x>=tmpw)
            return -1;
        if(y>tmph)
            return -1;

        var indexX = Math.floor(x*rcptw);
        var indexY = Math.floor(y*rcpth);
        
        indexX = yymax(0,yymin(indexX,el.m_mapWidth));
        indexY = yymax(0,yymin(indexY,el.m_mapHeight));

        var index = indexY*el.m_mapWidth + indexX;


		
		return el.m_pTiles[index];		
        
    
    }
  
    return -1;
    

};
function tilemap_get_cell_x_at_pixel( arg1,arg2,arg3) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var ret = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(arg1));
    
    if(ret==null)
    {
        return -1;
    }
    
    
    var el = ret.element;
    var _layer=ret.layer;
    
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap))
    {
        var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

        var tw = back.tilewidth;
        var th = back.tileheight;

        var rcptw = 1/tw;
        var rcpth = 1/th;
        
        var tmapoffx = el.m_x+_layer.m_xoffset;
        var tmapoffy = el.m_y+_layer.m_yoffset;
        
        var tmpw = el.m_mapWidth*tw;
        var tmph = el.m_mapHeight*th;
        
        var x = yyGetReal(arg2);
        var y = yyGetReal(arg3);
        
        x-= tmapoffx;
        y-= tmapoffy;
        
        if(x<0)
            return -1;
            
        if(y<0)
            return -1;
            
        if(x>=tmpw)
            return -1;
        if(y>tmph)
            return -1;




        return( Math.floor(x*rcptw)); 
    
    }
  
    return -1;
    


};
function tilemap_get_cell_y_at_pixel( arg1,arg2,arg3) 
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var ret = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(arg1));
    
    if(ret==null)
    {
        return -1;
    }
    
    
    var el = ret.element;
    var _layer=ret.layer;
    
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap))
    {
        var back = g_pBackgroundManager.GetImage(el.m_backgroundIndex);

        var tw = back.tilewidth;
        var th = back.tileheight;

        var rcptw = 1/tw;
        var rcpth = 1/th;
        
        var tmapoffx = el.m_x+_layer.m_xoffset;
        var tmapoffy = el.m_y+_layer.m_yoffset;
        
        var tmpw = el.m_mapWidth*tw;
        var tmph = el.m_mapHeight*th;
        
        var x = yyGetReal(arg2);
        var y = yyGetReal(arg3);
        
        x-= tmapoffx;
        y-= tmapoffy;
        
        if(x<0)
            return-1;
            
        if(y<0)
            return-1;
            
        if(x>=tmpw)
            return-1;
        if(y>tmph)
            return-1;


        return( Math.floor(y*rcpth)); 
    
    }
  
    return -1;
    

};

function tilemap_clear(arg1,arg2)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var ret = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(arg1));
    
    if(ret==null)
    {
        return;
    }
    
    
    var el = ret.element;
    var _layer=ret.layer;
    
    if((el!=null) && (el.m_type ===eLayerElementType_Tilemap) && (_layer!=null))
    {
    
        var tiledata = yyGetInt32(arg2);
        var index =0;
        for(var i=0;i<el.m_mapWidth;i++)
        {
            for(var j=0;j<el.m_mapHeight;j++,index++)
            {
                el.m_pTiles[index] = tiledata;
            }
        }
    
    }
};

function tilemap_set_global_mask(arg1)
{
    g_pLayerManager.SetTiledataMask(yyGetInt32(arg1));
};

function tilemap_get_global_mask()
{
    return g_pLayerManager.GetTiledataMask();
};

function tilemap_get_mask(arg1)
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_tiledataMask;
    }
    return -1;
};

function tilemap_get_frame(arg1)
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        return el.m_frame;
    }
    return -1;
};

function tilemap_set_mask(arg1,arg2)
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        el.m_tiledataMask = yyGetInt32(arg2);
    }
};



function draw_tilemap(inst, arg1,arg2,arg3) 
{
    var el = layerTilemapGetElement(yyGetInt32(arg1));
    if (el != null)
    {
        var room = g_pLayerManager.GetTargetRoomObj();
        var x = yyGetReal(arg2);
        var y = yyGetReal(arg3);
        var depth = GetInstanceDepth(inst);
        room.DrawLayerTilemapElement(g_roomExtents, null, el, x, y, depth);
    }

};

// Tile functions
function tile_set_empty( arg1) 
{
    var tileindexdata = yyGetInt32(arg1);
	tileindexdata &= (~TileIndex_Mask);	// set tile index to 0	

	return tileindexdata;

};

function tile_set_index( arg1,arg2) 
{
    var tileindexdata = yyGetInt32(arg1);		
	var newindex = yyGetInt32(arg2);

	// Should really do some sanity checking here, but we don't currently store enough info to fully check if the index is out of range

	// Now modify tile data	
	tileindexdata &= (~TileIndex_Mask);	// set tile index to 0
	tileindexdata |= newindex << TileIndex_Shift;	

	return tileindexdata;
};
function tile_set_flip( arg1,arg2) 
{

	var flip = yyGetBool(arg2);

	var tileindexdata = yyGetInt32(arg1);	
	if (flip)
		tileindexdata |= TileFlip_Mask;		// set bit to 1
	else
		tileindexdata &= (~TileFlip_Mask);	// set bit to 0	

	return tileindexdata;
};
function tile_set_mirror( arg1,arg2) 
{
    var flip = yyGetBool(arg2);

	var tileindexdata = yyGetInt32(arg1);	
	if (flip)
		tileindexdata |= TileMirror_Mask;		// set bit to 1
	else
		tileindexdata &= (~TileMirror_Mask);	// set bit to 0	

	return tileindexdata;
};
function tile_set_rotate( arg1,arg2) 
{
    var flip = yyGetBool(arg2);

	var tileindexdata = yyGetInt32(arg1);	
	if (flip)
		tileindexdata |= TileRotate_Mask;		// set bit to 1
	else
		tileindexdata &= (~TileRotate_Mask);	// set bit to 0	

	return tileindexdata;
};

function tile_get_empty( arg1) 
{
	return (yyGetInt32(arg1) & TileIndex_Mask) ? 0.0 : 1.0;	
};
function tile_get_index( arg1) 
{
    var tileindexdata = yyGetInt32(arg1);

	var index = (tileindexdata & TileIndex_Mask) >> TileIndex_Shift;	

	return index;	 
};
function tile_get_flip( arg1) 
{
    var tileindexdata = yyGetInt32(arg1);

	return ((tileindexdata & TileFlip_Mask) ? true : false);	  

};
function tile_get_mirror( arg1) 
{
    var tileindexdata = yyGetInt32(arg1);

	return ((tileindexdata & TileMirror_Mask) ? true : false);	  
};
function tile_get_rotate( arg1) 
{
    var tileindexdata = yyGetInt32(arg1);

	return ((tileindexdata & TileRotate_Mask) ? true : false);	  

};

function ShallowCopyVars( _dest, _other)
{
    if (_other != undefined) {
        var props = Object.getOwnPropertyNames(_other);
        props = props.filter(val => !val.startsWith("__"));
        for (var i = 0; i < props.length; i++)
        {
            var prop = props[i];
            settings = g_instance_names[ prop ];
            var v = _other[ prop ];
            if ((typeof v == 'function') && v.__yy_userFunction && v.boundObject && (v.boundObject == _other)) {
                v = method( _dest, v);
            } // end if
            if (settings == undefined) {
                _dest[ prop ] = v;
            } 
            else if (settings[1]) { // are we allowed to set
                if (settings[3] != null ) {
                    var f = undefined;
                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[3]] != undefined)) {
                        f = _dest[ g_var2obf[settings[3]] ];
                    } else {
                        f = _dest[ settings[3] ];
                    } // end else
                    if (typeof f == 'function') {
                        f.call( _dest, v );
                    } // end if
                } // end if
                else {
                    _dest[ prop ] = v;
                } // end else                
            }
        } // end if
    } // end if
} // end ShallowCopyVars


function instance_create_depth( _x,_y,_depth,_objind, _basis) 
{
	if (g_pLayerManager.GetTargetRoomObj() != g_RunRoom) return -1;

	if(_depth == undefined)
		_depth = 0;
    _objind = yyGetInt32(_objind);
	
    var o = g_pObjectManager.Get(_objind);
	if (!o)
	{
		yyError("Error: Trying to create an instance using non-existent object type (" + _objind + ")");
		return OBJECT_NOONE;
	}
    var inst =g_RunRoom.GML_AddInstanceDepth(yyGetReal(_x), yyGetReal(_y), yyGetInt32(_depth), _objind);
  
    if(inst!=null)
    {
        inst.PerformEvent(EVENT_PRE_CREATE, 0, inst, inst );
        ShallowCopyVars( inst, _basis );
        inst.PerformEvent(EVENT_CREATE, 0, inst, inst );
	    return MAKE_REF(REFID_INSTANCE, inst.id);
    }

	return OBJECT_NOONE;
};



function instance_create_layer( _x,_y,_layerid,_obj, _basis)
{
    if (g_pLayerManager.GetTargetRoomObj() != g_RunRoom) return -1;

    _obj = yyGetInt32(_obj);

    var o = g_pObjectManager.Get(_obj);
	if (!o)
	{
		yyError("Error: Trying to create an instance using non-existent object type (" + _obj + ")");
		return OBJECT_NOONE;
	}

    var layer =-1;
    
    if(typeof (_layerid) == "string")
        layer = g_pLayerManager.GetLayerFromName(g_RunRoom, yyGetString(_layerid));
    else
        layer = g_pLayerManager.GetLayerFromID(g_RunRoom, yyGetInt32(_layerid));
        
    if (layer != null && layer != -1) {
        var pInst = g_RunRoom.GML_AddLayerInstance(yyGetReal(_x), yyGetReal(_y), layer, _obj);
        pInst.PerformEvent(EVENT_PRE_CREATE, 0, pInst, pInst);
        ShallowCopyVars( pInst, _basis );
        pInst.PerformEvent(EVENT_CREATE, 0, pInst, pInst);
        return MAKE_REF(REFID_INSTANCE, pInst.id);
    } else {
        yyError("Error: Trying to create an instance on a non-existant layer");
    }
	
	return OBJECT_NOONE;

};

function layer_get_all() {
    var room = g_pLayerManager.GetTargetRoomObj();

    var arr = [];
    if (room == null) {
        return arr;
    }
    var numlayers = 0;

    for (var i = 0; i < room.m_Layers.length; i++) {
        var layer = room.m_Layers.Get(i);
        if (layer != null) {
            if (layer.m_dynamic == false) {
                arr[numlayers++] = layer.m_id;
            }
        }
    }

    return arr;
};

function layer_get_all_elements(_layerid) {
    var room = g_pLayerManager.GetTargetRoomObj();
    var layer = layerGetObj(room, _layerid);

    var arr = [];
    var numelements = 0;
    if (layer != null) {
        for (var i = 0; i < layer.m_elements.length; i++) {
            var el = layer.m_elements.Get(i);
            if (el != null) {
                arr[numelements++] = el.m_id;
            }
        }
    }

    return arr;
};

function layer_get_name(_layerid) {
    var layer = layerGetFromTargetRoom(_layerid);
    if (layer != null)
    {
        if (layer.m_pName == null)
        {
            return "";
        }
        else
        {
            return layer.m_pName.slice(0);  // copy the layer's name string
        }
    }

    return "";
};

function layer_depth(_layerid, _depth)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var layer = layerGetObj(room, _layerid);

    if (layer != null)
    {
        _depth = yyGetInt32(_depth);

        if (layer.depth == _depth)
        {
            return;     // depth is the same so we don't need to do anything
        }

        g_pLayerManager.ChangeLayerDepth(room, layer, _depth, false);
    }
};

function layer_get_element_layer(_elid)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var elandlay = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(_elid));
    if (elandlay != null)
    {
        return elandlay.layer.m_id;
    }

    return -1;
};

function layer_get_element_type(_elid) {
    var room = g_pLayerManager.GetTargetRoomObj();

    if (room == null) {
        return -1;
    }

    var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(_elid));
    if (el != null)
    {
        return el.m_type;
    }

    return -1;
};

function layer_element_move(_elid, _targetlayerID) {
    var room = g_pLayerManager.GetTargetRoomObj();
    var elandlay = g_pLayerManager.GetElementAndLayerFromID(room, yyGetInt32(_elid));
    if (elandlay == null)
    {
        return -1;
    }

    var targetlayer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(_targetlayerID));
    if (targetlayer != null)
    {
        g_pLayerManager.MoveElement(room, elandlay.element, targetlayer);
    }
};

function layer_force_draw_depth(_force, _depth) {
    g_pLayerManager.SetForceDepth(yyGetBool(_force));
    g_pLayerManager.SetForcedDepth(yyGetInt32(_depth));
};

function layer_is_draw_depth_forced() {
    return g_pLayerManager.IsDepthForced() ? true : false;
};

function layer_get_forced_depth() {
    return g_pLayerManager.GetForcedDepth();
};


function layerTileGetElement(tile_element_id)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(tile_element_id));
    if ((el != null) && (el.m_type === eLayerElementType_Tile)) return el;
    return null;
}

function layer_tile_exists(_layerid, _arg2) {
    var room = g_pLayerManager.GetTargetRoomObj();

    if (room == null) {
        return 0;
    }

    if (arguments.length == 1)
    {
        var el = g_pLayerManager.GetElementFromID(room, yyGetInt32(_layerid));

        if (el != null)
        {
            return 1;
        }
    }
    else
    {
        var layer = null;
        if (typeof (_layerid) == "string")
            layer = g_pLayerManager.GetLayerFromName(room, yyGetString(_layerid));
        else
            layer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(_layerid));

        if (layer != null)
        {
            var el = g_pLayerManager.GetElementFromIDWithLayer(layer, yyGetInt32(_arg2));

            if (el != null)
            {
                return 1;
            }
        }
    }

    return 0;
};

function layer_tile_create(_layerid, _x, _y, _tileset, _left, _top, _width, _height) {
    var room = g_pLayerManager.GetTargetRoomObj();
    var layer = layer = layerGetObj(room, _layerid);

    if (layer != null)
    {
        var newTileEl = new CLayerTileElement();
        newTileEl.m_index = yyGetInt32(_tileset);
        newTileEl.m_x = yyGetReal(_x);
        newTileEl.m_y = yyGetReal(_y);
        newTileEl.m_xo = yyGetInt32(_left);
        newTileEl.m_yo = yyGetInt32(_top);
        newTileEl.m_w = yyGetInt32(_width);
        newTileEl.m_h = yyGetInt32(_height);
        newTileEl.m_visible = true;

        // Add to the specified layer
        g_pLayerManager.AddNewElement(room, layer, newTileEl, room == g_RunRoom ? true : false);

        return newTileEl.m_id;
    }
};

function layer_tile_destroy(_elid)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    g_pLayerManager.RemoveElementById(room, yyGetInt32(_elid));

    return -1;
};

function layer_tile_change(tile_element_id, sprite)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null)
    {
        el.m_index = yyGetInt32(sprite);
    }
};

function layer_tile_xscale(tile_element_id, scale)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_imageScaleX = yyGetReal(scale);
    }
};

function layer_tile_yscale(tile_element_id, scale)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_imageScaleY = yyGetReal(scale);
    }
};

function layer_tile_blend(tile_element_id, col)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_imageBlend = yyGetInt32(col);
    }
};

function layer_tile_alpha(tile_element_id, alpha)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_imageAlpha = yyGetReal(alpha);
    }
};

function layer_tile_x(tile_element_id, x)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_x = yyGetReal(x);
    }
};

function layer_tile_y(tile_element_id, y)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_y = yyGetReal(y);
    }
};

function layer_tile_region(tile_element_id, left, top, width, height)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_xo = yyGetInt32(left);
        el.m_yo = yyGetInt32(top);
        el.m_w = yyGetInt32(width);
        el.m_h = yyGetInt32(height);
    }
};

function layer_tile_visible(tile_element_id, visible) {
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        el.m_visible = yyGetBool(visible);
    }
};

function layer_tile_get_sprite(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_index;
    }
    return -1;
};

function layer_tile_get_xscale(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_imageScaleX;
    }
    return 1;
};

function layer_tile_get_yscale(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_imageScaleY;
    }
    return 1;
};

function layer_tile_get_blend(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_imageBlend;
    }
    return 0;
};

function layer_tile_get_alpha(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_imageAlpha;
    }
    return 0;
};

function layer_tile_get_x(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_x;
    }
    return 0;
};

function layer_tile_get_y(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_y;
    }
    return 0;
};

function layer_tile_get_region(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        var arr = [];
        arr[0] = el.m_xo;
        arr[1] = el.m_yo;
        arr[2] = el.m_w;
        arr[3] = el.m_h;
        return arr;
    }
    return -1;
};

function layer_tile_get_visible(tile_element_id)
{
    var el = layerTileGetElement(tile_element_id);
    if (el != null) {
        return el.m_visible;
    }
    return false;
};





// Sequence Functions

function layerSequenceGetInstance(sequence_element_id)
{
    var room = g_pLayerManager.GetTargetRoomObj();

    var el = g_pLayerManager.GetElementFromID(room, sequence_element_id);
    if (el != null && el.m_type == eLayerElementType_Sequence) {
        return el;
    }

    return null;
};

function layer_sequence_get_instance(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));

    if(el == null)
    {
        return -1;
    }

    var inst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
    
    return inst != null ? inst : -1;
};

function layer_sequence_create(layer_id, posx, posy, sequence_id)
{
    sequence_id = yyGetInt32(sequence_id);

    var room = g_pLayerManager.GetTargetRoomObj();

    var layer = null;
    if(typeof(layer_id) == "string")
    {
        layer = g_pLayerManager.GetLayerFromName(room, yyGetString(layer_id));
    }
    else
    {
        layer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(layer_id));
    }

    if(layer == null)
    {
        return -1;
    }

    var sequence = g_pSequenceManager.GetSequenceFromID(sequence_id);
    if(sequence == null)
    {
        return -1;
    }

    var newSeqEl = new CLayerSequenceElement();
    newSeqEl.m_sequenceIndex = sequence_id;    
    newSeqEl.m_headPosition = 0;
    newSeqEl.m_blend = -1;
    newSeqEl.m_scaleX = 1;
    newSeqEl.m_scaleY = 1;
    newSeqEl.m_x = posx;
    newSeqEl.m_y = posy;
    newSeqEl.m_angle = 0;
    newSeqEl.m_name = sequence.name;

    // Add to the specified layer
    g_pLayerManager.AddNewElement(room, layer, newSeqEl, room == g_RunRoom ? true : false);

    return newSeqEl.m_id;
}

function layer_sequence_destroy(sequence_element_id)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));

    if (el == null)
    {
        return -1;
    }

    var inst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
    if (inst != null)
    {
        // Execute destroy event
        g_pSequenceManager.HandleInstanceEvent(inst, EVENT_DESTROY);
    }

    g_pLayerManager.RemoveElementById(room, yyGetInt32(sequence_element_id));
}

function layer_sequence_exists(arg1, arg2)
{
    var layer = layerGetFromTargetRoom(arg1);
    var el = g_pLayerManager.GetElementFromIDWithLayer(layer, yyGetInt32(arg2));
    if ((el != null) && (el.m_type === eLayerElementType_Sequence))
    if (el != null)
    {
        return true;
    }
    return false;

};

function layer_sequence_x(sequence_element_id, pos_x)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            el.m_x = yyGetReal(pos_x);
            el.m_dirtyflags |= (1<<eT_Position);
		}
    }

    return -1;
};

function layer_sequence_y(sequence_element_id, pos_y)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            el.m_y = yyGetReal(pos_y);
            el.m_dirtyflags |= (1 << eT_Position);
		}
    }

    return -1;
};

function layer_sequence_angle(sequence_element_id, angle)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
        {
            el.m_angle = yyGetReal(angle);
            el.m_dirtyflags |= (1 << eT_Rotation);
        }
    }

    return -1;
};

function layer_sequence_xscale(sequence_element_id, xscale)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
        {
            el.m_scaleX = yyGetReal(xscale);
            el.m_dirtyflags |= (1 << eT_Scale);
        }
    }

    return -1;
};

function layer_sequence_yscale(sequence_element_id, yscale)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
        {
            el.m_scaleY = yyGetReal(yscale);
            el.m_dirtyflags |= (1 << eT_Scale);
        }
    }

    return -1;
};

function layer_sequence_headpos(sequence_element_id, position)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            // Get the sequence associated with this instance so we can clamp the head position to it's extents
            // Use same logic as property now
            var seq = g_pSequenceManager.GetSequenceFromID(seqInst.m_sequenceIndex);
            var headPos = yyGetReal(position);
            headPos = yymax(headPos, 0.0);
            if(seq != null)
            {
                var length = seq.m_length;
                headPos = yymin(headPos, length);                
            }

            if ((seqInst.m_headPosition != headPos) || (seqInst.lastHeadPosition != headPos))
            {
                seqInst.m_headPosition = headPos;
                seqInst.lastHeadPosition = headPos; // don't want to treat this like a normal time step

                el.m_dirtyflags |= (1 << eT_HeadPosChanged);
                //seqInst.m_finished = tmp.finished;
            }
		}
    }

    return -1;
};

function layer_sequence_headdir(sequence_element_id, direction)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            direction = yyGetReal(direction);
            if(direction != 0)
            {
                seqInst.m_headDirection = Math.sign(direction);
            }
		}
    }

    return -1;
};


function layer_sequence_pause(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            seqInst.Pause();
		}
    }

    return -1;
};

function layer_sequence_play(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            seqInst.UnPause(); // Play

            if(seqInst.m_finished)
            {
                // reset the play head
                if(seqInst.m_headDirection < 0.0)
                {
                    var seq = g_pSequenceManager.GetSequenceFromID(seqInst.m_sequenceIndex);
                    if(seq != null)
                    {
                        seqInst.m_headPosition = seqInst.lastHeadPosition = (seq.m_length - 1);
                    }
                }
                else
                {
                    seqInst.m_headPosition = seqInst.lastHeadPosition = 0.0;
                }
                seqInst.m_finished = false;
            }
		}
    }

    return -1;
};

function layer_sequence_speedscale(sequence_element_id, speedscale)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{
            speedscale = yyGetReal(speedscale);
            //speedscale = yymax(speedscale, 0.0);    // no negative speeds please
            seqInst.m_speedScale = speedscale;
		}
    }

    return -1;
};

function layer_sequence_get_x(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if(el != null)
    {
        return el.m_x;
    }

    return -1;
};

function layer_sequence_get_y(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if(el != null)
    {
        return el.m_y;
    }

    return -1;
};

function layer_sequence_get_angle(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        return el.m_angle;
    }

    return -1;
};

function layer_sequence_get_xscale(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        return el.m_scaleX;
    }

    return -1;
};

function layer_sequence_get_yscale(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        return el.m_scaleY;
    }

    return -1;
};

function layer_sequence_get_headpos(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{			
			return seqInst.m_headPosition;			
		}
    }

    return -1;
};

function layer_sequence_get_headdir(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{			
			return seqInst.m_headDirection;			
		}
    }

    return -1;
};

function layer_sequence_get_sequence(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
        {
            var seq = g_pSequenceManager.GetSequenceFromID(seqInst.m_sequenceIndex);
            if (seq != null)
            {
                return seq;
            }			
		}
    }

    return -1;
};

function layer_sequence_is_paused(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{			
			return seqInst.m_paused;			
		}
    }

    return -1;
};

function layer_sequence_is_finished(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{			
			return seqInst.m_finished;			
		}
    }

    return -1;
};

function layer_sequence_get_speedscale(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null) {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
		{			
			return seqInst.m_speedScale;			
		}
    }

    return -1;
};

function layer_sequence_get_length(sequence_element_id)
{
    var el = layerSequenceGetInstance(yyGetInt32(sequence_element_id));
    if (el != null)
    {
        var seqInst = g_pSequenceManager.GetInstanceFromID(el.m_instanceIndex);
        if (seqInst != null)
{
            var seq = g_pSequenceManager.GetSequenceFromID(seqInst.m_sequenceIndex);
            if (seq != null)
{
                return seq.m_length;
            }
        }
    }

    return -1;
};

function sequence_instance_exists(_objectID)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    if(room != null)
    {
        for (var instanceIndex = 0; instanceIndex < room.m_SequenceInstancesIds.length; ++instanceIndex)
        {
            var sequenceInstanceId = room.m_SequenceInstancesIds[instanceIndex];
            var sequenceElement = g_pLayerManager.GetElementFromID(room, sequenceInstanceId);
            if(_objectID == sequenceElement.m_sequenceIndex)
            {
                return true;
            }
        }
    }
    
    return false;
};

function fx_create(_effectname)
{
    if (arguments.length != 1)
	{
		yyError("fx_create() - wrong number of arguments");
		return -1;
	}

    var pEffectInst = g_pEffectsManager.CreateNewEffectInstance(yyGetString(_effectname), false);
    return pEffectInst.GetRef();
}

function fx_get_name(_effect)
{
    if (arguments.length != 1)
	{
		yyError("fx_get_name() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_get_name() - parameter should be an FX object");
		return -1;
	}

    return _effect.instance.pEffectInfo.pName;
}

function fx_get_parameter_names(_effect)
{
    if (arguments.length != 1)
	{
		yyError("fx_get_parameter_names() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_get_parameter_names() - parameter should be an FX object");
		return -1;
	}

    return _effect.instance.GetParamNames();
}

function fx_get_parameter(_effect, _name)
{
    if (arguments.length != 2)
	{
		yyError("fx_get_parameter() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_get_parameter() - first parameter should be an FX object");
		return -1;
	}

    return _effect.instance.GetParamVar(_name);
}

function fx_get_parameters(_effect)
{
    if (arguments.length != 1)
	{
		yyError("fx_get_parameters() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_get_parameters() - parameter should be an FX object");
		return -1;
	}

    return _effect.instance.GetParamVars();
}

function fx_get_single_layer(_effect)
{
    if (arguments.length != 1)
	{
		yyError("fx_get_single_layer() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_get_single_layer() - parameter should be an FX object");
		return -1;
	}
    
    if ((_effect.instance == null) || (_effect.instance.pEffectObj == null))
    {
        yyError("fx_get_single_layer() - FX object is corrupted");
		return -1;
    }

    // To read the value we cannot use 'GetParamVar' because that will only return values that are defined in the 'pEffectInfo.pParams' array.
    var varId = EFFECT_AFFECT_SINGLE_LAYER_VAR;
    if (_effect.instance.pEffectInfo.type == FAE_TYPE_EFFECT) {
        var varId = "gml" + EFFECT_AFFECT_SINGLE_LAYER_VAR; 
        if ((typeof g_var2obf !== "undefined") && (g_var2obf[EFFECT_AFFECT_SINGLE_LAYER_VAR] != undefined)) { 
            varId = g_var2obf[EFFECT_AFFECT_SINGLE_LAYER_VAR]; 
        }
    }
 
    return _effect.instance.pEffectObj[varId] == 1 ? true : false;
}

function fx_set_parameter(_effect, _name, _val)
{
    if (arguments.length < 3)
	{
		yyError("fx_set_parameter() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_set_parameter() - first parameter should be an FX object");
		return -1;
	}
    
    if(arguments.length == 3)
    {
        _effect.instance.SetParamVar(_name, _val);
    }
    else
    {
        var arr = arguments.slice(2);
        _effect.instance.SetParamVar(_name, arr);
    }
}

function fx_set_parameters(_effect, _valObj)
{
    if (arguments.length != 2)
	{
		yyError("fx_set_parameters() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_set_parameters() - first parameter should be an FX object");
		return -1;
	}

    if(typeof _valObj !== "object")
    {
        yyError("fx_set_parameters() - second parameter should be a parameter struct");
    }

    _effect.instance.SetParamVars(_valObj);
}

function fx_set_single_layer(_effect, _val)
{
    if (arguments.length < 2)
	{
		yyError("fx_set_single_layer() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("fx_set_single_layer() - first parameter should be an FX object");
		return -1;
	}

    if ((_effect.instance == null) || (_effect.instance.pEffectObj == null))
    {
        yyError("fx_set_single_layer() - FX object is corrupted");
		return -1;
    }

    _effect.instance.SetParam(EFFECT_AFFECT_SINGLE_LAYER_VAR, FAE_PARAM_BOOL, 1, [ yyGetBool(_val) ]);
}

function layer_set_fx(_layerId, _effect)
{
    if (arguments.length != 2)
	{
		yyError("layer_set_fx() - wrong number of arguments");
		return -1;
	}

	if (g_pEffectsManager.IsRValueAnEffect(_effect) == false)
	{
		yyError("layer_set_fx() - second parameter should be an FX object");
		return -1;
	}

    var pRoom = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(pRoom, _layerId);

	if (pLayer == null)
	{
		// Couldn't find specified layer
		return -1;
	}

	pLayer.SetEffect(_effect);
	pRoom.AddEffectLayerID(pLayer.m_id);	
}

function layer_get_fx(_layerId)
{
    if (arguments.length != 1)
	{
		yyError("layer_get_fx() - wrong number of arguments");
		return -1;
	}

    var pRoom = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(pRoom, _layerId);

	if (pLayer == null)
	{
		// Couldn't find specified layer
		return -1;
	}

	var effect = pLayer.GetEffect();
    if(effect !== null)
    {
        return effect;
    }

    return -1;
}

function layer_clear_fx(_layerId)
{
    if (arguments.length != 1)
	{
		yyError("layer_get_fx() - wrong number of arguments");
		return -1;
	}

    var pRoom = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(pRoom, _layerId);

	if (pLayer == null)
	{
		// Couldn't find specified layer
		return -1;
	}

	pLayer.ClearEffect();
    pRoom.RemoveEffectLayerID(pLayer.m_id);
}

function layer_enable_fx(_layerId, _enable)
{
    if (arguments.length != 2)
	{
		yyError("layer_enable_fx() - wrong number of arguments");
		return -1;
	}	

    var pRoom = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(pRoom, _layerId);

	if (pLayer == null)
	{
		// Couldn't find specified layer
		return -1;
	}

    pLayer.m_effectToBeEnabled = _enable;	
}

function layer_fx_is_enabled(_layerId)
{
    if (arguments.length != 1)
	{
		yyError("layer_fx_is_enabled() - wrong number of arguments");
		return 1;
	}	

    var pRoom = g_pLayerManager.GetTargetRoomObj();
    var pLayer = layerGetObj(pRoom, _layerId);

	if (pLayer == null)
	{
		// Couldn't find specified layer
		return true;
	}

    return pLayer.m_effectToBeEnabled;	
}
