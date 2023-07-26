
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyRoom.js
// Created:	        17/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/02/2011		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Game Maker "ACTIVE" Room class
///          </summary>
// #############################################################################################
/**@constructor*/
function    yyRoom()
{
    this.id = g_RoomID++;
    this.Init();
    
 
  };

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoom.prototype.Init = function () {
    this.__type = "[Room]";
    this.m_lasttile = ""; 						// index of the last tile found

	this.m_pCaption = ""; 					    // caption of the room
	this.m_speed = 30;                            // game speed for the room (steps per second)
	this.m_width = 1024;                          // size of the room (in pixels)
	this.m_height = 768;
	this.m_persistent = false; 			    // Whether room instances are persistent
	this.m_Initialised = false;
	this.m_color = 0xc0c0c0;				// The screen color
	this.m_showcolor = true; 				// Whether to draw the screen color
	this.m_ViewClearScreen = true;
    this.m_ClearDisplayBuffer = true;

	this.m_background = [];                     // the backgrounds
	for (var t = 0; t < MAX_BACKGROUNDS; t++)
	{
		this.m_background[t] = null;
	}

	this.m_enableviews = false; 				// whether views are enabled
	this.m_code = null; 						// Creation code for the room

	this.m_Active = new yyList(); 		        // the ACTIVE instance list (ordered by DEPTH)
	this.m_Active.packing = true;
	this.m_Deactive = new yyList(); 		    // the DEACTIVE instance list
	this.m_Deactive.packing = true;
	this.m_DepthSorting = []; 				    // When the depth is changed, we need to remember it so we can "change" it at a safe point. 
	//this.m_NewInstances = []; 				// When a new instance is added, its added to the layers at the end of the event
	//this.m_ParticleChanges = []; 			    // When a particle system changes depth (this needs to be global because it can be called before there is a room)

	this.m_NumTiles = 0;
	this.m_Tiles = [];
	this.m_PlayfieldManager = new yyPlayfieldManager();
	this.m_Views = [];

	this.m_Marked = [];

	this.m_SequenceInstancesIds = [];

	// RK :: Used to reduce the amount of memory used when loading rooms
	this.m_pStorage = null;

	this.m_pName = "Room";
	
	// space for a physics representation of the room
	this.m_pPhysicsWorld = null;
	this.m_Layers = new yyOList();

	this.m_EffectLayerIDs = [];
	this.m_numEffectLayerIDs = 0;
};

// #############################################################################################
/// Function:<summary>
///             Are the views enabled?
///          </summary>
// #############################################################################################
yyRoom.prototype.GetEnableViews = function () { return this.m_enableviews; };
yyRoom.prototype.GetWidth = function () { return this.m_width; };
yyRoom.prototype.GetHeight = function () { return this.m_height; };
yyRoom.prototype.GetSpeed = function () { return this.m_speed; };
yyRoom.prototype.GetName = function () { return this.m_pName; };
yyRoom.prototype.GetCaption = function () { return this.m_pCaption; };
yyRoom.prototype.GetPersistent = function () { return this.m_persistent; };
yyRoom.prototype.GetPool = function () { return this.m_Active.pool; };

yyRoom.prototype.SetWidth = function (_val) { this.m_width = _val; g_pBuiltIn.room_width = _val; };
yyRoom.prototype.SetHeight = function (_val) { this.m_height = _val; g_pBuiltIn.room_height = _val; };
yyRoom.prototype.SetSpeed = function (_val) { this.m_speed = _val; g_pBuiltIn.room_speed = _val; };
yyRoom.prototype.SetName = function (_name) { this.m_pName = _name; };
yyRoom.prototype.SetCaption = function (_caption) { this.m_pCaption = _caption; g_pBuiltIn.room_caption = _caption; };
yyRoom.prototype.SetPersistent = function (_val) { this.m_persistent = _val; g_pBuiltIn.room_persistent = _val; };


// #############################################################################################
/// Function:<summary>
///             Generates storage information for an empty room for later use when switching to
///             this room
///          </summary>
// #############################################################################################
yyRoom.prototype.CreateEmptyStorage = function () {

	this.m_pStorage =
    {
    	pName: "room_empty_" + this.id,
    	width: 640,
    	height: 480,
    	backgrounds: [
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}],
    	views: [
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}],
    	pInstances: [],
    	tiles: []
    };


	this.CreateRoomFromStorage(this.m_pStorage);

};


// #############################################################################################
/// Function:<summary>
///             Merges the storage with the current storage for this room
///             this room
///          </summary>
// #############################################################################################
yyRoom.prototype.CloneStorage = function (_pStorage) {

	if ( _pStorage != null )
	{
        // Copy across the basic settings (except for the name... that's expected
		this.m_pStorage.width = _pStorage.width;
		this.m_pStorage.height = _pStorage.height;
		this.m_pStorage.colour = _pStorage.colour;
		this.m_pStorage.showColour = _pStorage.showColour;
		this.m_pStorage.enableViews = _pStorage.enableViews;
		this.m_pStorage.viewClearScreen = _pStorage.viewClearScreen;
		this.m_pStorage.pCaption = _pStorage.pCaption;
		this.m_pStorage.speed = _pStorage.speed;
		this.m_pStorage.persistent = _pStorage.persistent;
		this.m_pStorage.clearDisplayBuffer = _pStorage.clearDisplayBuffer;
		this.m_pStorage.LayerCount = _pStorage.LayerCount;

		// Creation code
		if ( _pStorage.pCode )
		{
			this.m_pStorage.pCode = _pStorage.pCode;
		}

		// Physics world
		if ( _pStorage.physicsWorld )
		{
			this.m_pStorage.physicsWorld = _pStorage.physicsWorld;
			this.m_pStorage.physicsTop = _pStorage.physicsTop;
			this.m_pStorage.physicsLeft = _pStorage.physicsLeft;
			this.m_pStorage.physicsRight = _pStorage.physicsRight;
			this.m_pStorage.physicsBottom = _pStorage.physicsBottom;
			this.m_pStorage.physicsGravityX = _pStorage.physicsGravityX;
			this.m_pStorage.physicsGravityY = _pStorage.physicsGravityY;
			this.m_pStorage.physicsPixToMeters = _pStorage.physicsPixToMeters;
		}
    
		// 1.x backgrounds
        for (var i = 0; i < _pStorage.backgrounds.length; i++) 
        {        
            var sourceBackground = _pStorage.backgrounds[i];
            if (sourceBackground != null) 
            {            
            	this.m_pStorage.backgrounds[i] =
				{
					visible: sourceBackground.visible, 
					index: sourceBackground.index, 
					vspeed: sourceBackground.vspeed, 
					hspeed: sourceBackground.hspeed,                
					foreground: sourceBackground.foreground,
					x: sourceBackground.x,
					y: sourceBackground.y,
					htiled: sourceBackground.htiled,
					vtiled: sourceBackground.vtiled,
					stretch: sourceBackground.stretch,
					alpha: sourceBackground.alpha,
					blend: sourceBackground.blend
				};
            }
        }

		// Views
        for (var i = 0; i < _pStorage.views.length; i++) 
        {        
            var sourceView = _pStorage.views[i];
            if (sourceView) 
            {
                this.m_pStorage.views[i] = {
                    visible: sourceView.visible,                      
                    xview: sourceView.xview,
                    yview: sourceView.yview,
                    wview: sourceView.wview,
                    hview: sourceView.hview,
                    xport: sourceView.xport,
                    yport: sourceView.yport,
                    wport: sourceView.wport,
                    hport: sourceView.hport,
                    hborder: sourceView.hborder,
                    vborder: sourceView.vborder,
                    hspeed: sourceView.hspeed,
                    vspeed: sourceView.vspeed,
                    index: sourceView.index
                };

                // test later
                /*if (g_isZeus) {

                    if (sourceView.cameraID != undefined) {
                        //Already been setup, don't create another    
                        this.m_pStorage.cameraID = g_pCameraManager.CloneCamera(cameraID);
                    }
                    else {
                        // Create camera and attach it to the view
                        var pCam = g_pCameraManager.CreateCameraFromView(this.m_pStorage.views[i]);
                        this.m_pStorage.views[i].cameraID = pCam.GetID();
                    }
                }*/
            }            
        }
    
		// Instances
        this.m_pStorage.pInstances = new Array(_pStorage.pInstances.length);
        for (var i = 0; i < _pStorage.pInstances.length; i++) 
        {
            var sourceInstance = _pStorage.pInstances[i];
            if (sourceInstance) 
            {                
                this.m_pStorage.pInstances[i] = {
                    x: sourceInstance.x,
                    y: sourceInstance.y,
                    index: sourceInstance.index,
                    id: sourceInstance.id,
                    rotation: sourceInstance.image_angle,
                    scaleX: sourceInstance.scaleX,
					scaleY: sourceInstance.scaleY,
					imageSpeed: sourceInstance.imageSpeed,
					imageIndex: sourceInstance.imageIndex,
                    colour: sourceInstance.image_blend, 
                    pCode: sourceInstance.pCode,
                    pPreCreateCode: sourceInstance.pPreCreateCode
                };
            }
        }        
        
		// Tiles
        this.m_pStorage.tiles = new Array(_pStorage.tiles.length);
        for (var i = 0; i < _pStorage.tiles.length; i++) 
        {
            var sourceTile = _pStorage.tiles[i];
            if (sourceTile != null)
            {
                this.m_pStorage.tiles[i] = {                            
                    x: sourceTile.x,
	                y: sourceTile.y,
	                index: sourceTile.index,
	                xo: sourceTile.xo,   
	                yo: sourceTile.yo,
	                w: sourceTile.w,
	                h: sourceTile.h,
	                depth: sourceTile.depth,
	                id: sourceTile.id,
	                scaleX: sourceTile.scaleX,
	                scaleY: sourceTile.scaleY,
					colour: sourceTile.colour
                };
	        }
        }

		// Layers
        this.m_pStorage.layers = new Array( _pStorage.layers.length );
        for ( var i = 0; i < _pStorage.layers.length; i++ )
        {
        	var sourceLayer = _pStorage.layers[i];
        	if ( sourceLayer != null )
        	{
				// Shared properties
        		var newLayer =
				{
					pName: sourceLayer.pName,
					id: sourceLayer.id,
					type: sourceLayer.type,
					depth: sourceLayer.depth,
					x: sourceLayer.x,
					y: sourceLayer.y,
					hspeed: sourceLayer.hspeed,
					vspeed: sourceLayer.vspeed,
					visible: sourceLayer.visible,
					effectEnabled: sourceLayer.effectEnabled,
					effectType: sourceLayer.effectType
				};

				// Copy effect properties
				newLayer.effectProperties = new Array( sourceLayer.effectProperties.length );

				var effectPropIdx;
				for (effectPropIdx = 0; effectPropIdx < sourceLayer.effectProperties.length; effectPropIdx++) 
        		{
					newLayer.EffectProperties[effectPropIdx] =
					{
						type: sourceLayer.effectProperties[effectPropIdx].type,
						name: sourceLayer.effectProperties[effectPropIdx].name,
						value: sourceLayer.effectProperties[effectPropIdx].value
					};
				}

				// Type-specific properties
        		switch(sourceLayer.type)
        		{
        			case YYLayerType_Background:
        				newLayer.bvisible = sourceLayer.bvisible;
        				newLayer.bforeground = sourceLayer.bforeground;
        				newLayer.bindex = sourceLayer.bindex;
        				newLayer.bhtiled = sourceLayer.bhtiled;
        				newLayer.bvtiled = sourceLayer.bvtiled;
        				newLayer.bstretch = sourceLayer.bstretch;
        				newLayer.bblend = sourceLayer.bblend;
        				newLayer.playbackspeedtype = sourceLayer.playbackspeedtype;
        				newLayer.bimage_index = sourceLayer.bimage_index;
        				newLayer.bimage_speed = sourceLayer.bimage_speed;
        				break;

        			case YYLayerType_Instance:
        				newLayer.icount = sourceLayer.icount;
        				newLayer.iinstIDs = sourceLayer.iinstIDs ? sourceLayer.iinstIDs.slice(0) : [];
        				break;

        			case YYLayerType_Tile:
        				newLayer.tcount = sourceLayer.tcount;
        				newLayer.tMapWidth = sourceLayer.tMapWidth;
        				newLayer.tMapHeight = sourceLayer.tMapHeight;
        				newLayer.tIndex = sourceLayer.tIndex;
        				newLayer.ttiles = sourceLayer.ttiles ? sourceLayer.ttiles.slice( 0 ) : [];
        				break;

        			case YYLayerType_Asset:
        				var assetIdx;

        				// Assets/tiles
        				newLayer.acount = sourceLayer.acount;
        				newLayer.assets = new Array( sourceLayer.assets.length );

        				for (assetIdx = 0; assetIdx < sourceLayer.assets.length; assetIdx++) 
        				{
        					newLayer.assets[assetIdx] =
							{
								ax: sourceLayer.assets[assetIdx].ax,
								ay: sourceLayer.assets[assetIdx].ay,
								aindex: sourceLayer.assets[assetIdx].aindex,
								aXO: sourceLayer.assets[assetIdx].aXO,
								aYO: sourceLayer.assets[assetIdx].aYO,
								aW: sourceLayer.assets[assetIdx].aW,
								aH: sourceLayer.assets[assetIdx].aH,
								aDepth: sourceLayer.assets[assetIdx].aDepth,
								aId: sourceLayer.assets[assetIdx].aId,
								aXScale: sourceLayer.assets[assetIdx].aXScale,
								aYScale: sourceLayer.assets[assetIdx].aYScale,
								aBlend: sourceLayer.assets[assetIdx].aBlend
							};
        				}

						// Sprites
        				newLayer.scount = sourceLayer.scount;
        				newLayer.sprites = new Array( sourceLayer.sprites.length );

        				for ( assetIdx = 0; assetIdx < sourceLayer.sprites.length; assetIdx++ )
        				{
        					newLayer.sprites[assetIdx] =
							{
								sName: sourceLayer.sprites[assetIdx].sName,
								sIndex: sourceLayer.sprites[assetIdx].sIndex,
								sX: sourceLayer.sprites[assetIdx].sX,
								sY: sourceLayer.sprites[assetIdx].sY,
								sXScale: sourceLayer.sprites[assetIdx].sXScale,
								sYScale: sourceLayer.sprites[assetIdx].sYScale,
								sBlend: sourceLayer.sprites[assetIdx].sBlend,
								sPlaybackSpeedType: sourceLayer.sprites[assetIdx].sPlaybackSpeedType,
								sImageSpeed: sourceLayer.sprites[assetIdx].sImageSpeed,
								sImageIndex: sourceLayer.sprites[assetIdx].sImageIndex,
								sRotation: sourceLayer.sprites[assetIdx].sRotation
							};
        				}

        			    // Sequences
        				newLayer.ecount = sourceLayer.ecount;       // ecount??
        				newLayer.sequences = new Array(sourceLayer.sequences.length);

        				for (assetIdx = 0; assetIdx < sourceLayer.sequences.length; assetIdx++)
        				{
        				    newLayer.sequences[assetIdx] =
							{
							    sName: sourceLayer.sequences[assetIdx].sName,
							    sIndex: sourceLayer.sequences[assetIdx].sIndex,
							    sX: sourceLayer.sequences[assetIdx].sX,
							    sY: sourceLayer.sequences[assetIdx].sY,
							    sXScale: sourceLayer.sequences[assetIdx].sXScale,
							    sYScale: sourceLayer.sequences[assetIdx].sYScale,
							    sBlend: sourceLayer.sequences[assetIdx].sBlend,
							    sPlaybackSpeedType: sourceLayer.sequences[assetIdx].sPlaybackSpeedType,
							    sImageSpeed: sourceLayer.sequences[assetIdx].sImageSpeed,
							    sHeadPosition: sourceLayer.sequences[assetIdx].sHeadPosition,
							    sRotation: sourceLayer.sequences[assetIdx].sRotation
							};
        				}

						// Particles
						newLayer.pcount = sourceLayer.pcount;
						newLayer.particles = new Array(sourceLayer.particles.length);

						for (assetIdx = 0; i < sourceLayer.particles.length; assetIdx++)
						{
							var srcParticle = sourceLayer.particles[assetIdx];

							newLayer.particles[assetIdx] =
							{
								sName: srcParticle.sName,
								sIndex: srcParticle.sIndex,
								sX: srcParticle.sX,
								sY: srcParticle.sY,
								sXScale: srcParticle.sXScale,
								sYScale: srcParticle.sYScale,
								sBlend: srcParticle.sBlend,
								sRotation: srcParticle.sRotation,
							};
						}

        				break;
					case YYLayerType_Effect:
						newLayer.m_pInitialEffectInfo = sourceLayer.m_pInitialEffectInfo;
						break;
        		}

				// Store cloned layer
        		this.m_pStorage.layers[i] = newLayer;
        	}
		}
    }
};


// #############################################################################################
/// Function:<summary>
///             Create a room from its "loaded" data
///          </summary>
///
/// In:		 <param name="_ID"></param>
///			 <param name="_pObjectStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoom.prototype.CreateRoomFromStorage = function (_pRoomStorage) 
{
	this.Init();
	this.m_pStorage = _pRoomStorage;
	if (_pRoomStorage.pName != undefined) this.SetName(_pRoomStorage.pName);
	if (_pRoomStorage.pCaption != undefined) this.SetCaption(_pRoomStorage.pCaption);
	if (_pRoomStorage.width != undefined) this.SetWidth(_pRoomStorage.width);
	if (_pRoomStorage.height != undefined) this.SetHeight(_pRoomStorage.height);
	if (_pRoomStorage.speed != undefined) this.SetSpeed(_pRoomStorage.speed);
	if (_pRoomStorage.persistent != undefined) this.SetPersistent(_pRoomStorage.persistent);
	if (_pRoomStorage.colour != undefined) this.m_color = _pRoomStorage.colour;
	if (_pRoomStorage.showColour != undefined) this.m_showcolor = _pRoomStorage.showColour;
	if (_pRoomStorage.enableViews != undefined) this.m_enableviews = _pRoomStorage.enableViews;
	if (_pRoomStorage.viewClearScreen != undefined) this.m_ViewClearScreen = _pRoomStorage.viewClearScreen;
	if (_pRoomStorage.clearDisplayBuffer != undefined) this.m_ClearDisplayBuffer = _pRoomStorage.clearDisplayBuffer;

	// If we add any defaults, we need to "set" the values
	this.SetWidth(this.m_width);
	this.SetHeight(this.m_height);
	this.SetSpeed(this.m_speed);
	this.SetCaption(this.m_pCaption);
	this.SetPersistent(this.m_persistent);
	this.m_Views = [];


	// Make Tiles
	this.m_NumTiles = 0;		
	for (var index = 0; index < _pRoomStorage.tiles.length; index++)
	{
		var pTileStorage = _pRoomStorage.tiles[index];
		if (pTileStorage != null)
		{
			var pTile = CreateTileFromStorage(pTileStorage);
			this.m_PlayfieldManager.Add(pTile);
			this.m_Tiles[pTile.id] = pTile;
			this.m_NumTiles++;
		}
	}

	if (_pRoomStorage.pCode != undefined) this.m_code = _pRoomStorage.pCode;

	// Create views				
	for (var v = 0; v < _pRoomStorage.views.length; v++)
	{
		this.m_Views[v] = CreateViewFromStorage(_pRoomStorage.views[v]);
	}	
	
	if(_pRoomStorage.LayerCount != undefined)
	{
	    if(_pRoomStorage.LayerCount > 0)
	    {
	        g_pLayerManager.BuildRoomLayers(this,_pRoomStorage.layers);
	    }
	}
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
yyRoom.prototype.BuildPhysicsWorld = function() {

    // evaluates to true if value is not: null, undefined, NaN, empty string, 0, false
    if (this.m_pStorage.physicsWorld) {
    
        if(g_isZeus)
        {
            this.m_pPhysicsWorld = new yyPhysicsWorld(this.m_pStorage.physicsPixToMeters, g_GameTimer.GetFPS());
        }
        else
        {
            this.m_pPhysicsWorld = new yyPhysicsWorld(this.m_pStorage.physicsPixToMeters, this.GetSpeed());
        }
        this.m_pPhysicsWorld.SetGravity(this.m_pStorage.physicsGravityX, this.m_pStorage.physicsGravityY);
    }
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoom.prototype.ClearInstances = function (do_delete_events) {
	var i;
	var delindex = 0;
	var DelList = [];

	// Loop through all the active instances, and get all the non-persistant ones.
	for (i = this.m_Active.length - 1; i >= 0; i--)
	{
		var inst = this.m_Active.Get(0);
		if (do_delete_events)
		{
			inst.PerformEvent( EVENT_CLEAN_UP,0, inst, inst );
		}
		this.DeleteInstance(inst);
	}

	for (i = this.m_Deactive.length - 1; i >= 0; i--)
	{
		this.DeleteInstance(this.m_Deactive.Get(0));
	}
};


// #############################################################################################
/// Function:<summary>
///             Clears the instances held in the storage for this room
///          </summary>
///
// #############################################################################################
yyRoom.prototype.ClearInstancesFromStorage = function () {
    this.m_pStorage.pInstances = [];
};

yyRoom.prototype.GetView= function(index) {

    
    if(this.m_Views!=undefined)
    {
        var view = this.m_Views[index];
        if(view!=undefined)
            return view;
    }
    
    return undefined; 

};



// #############################################################################################
/// Function:<summary>
///             Create a new instance from the 
///          </summary>
///
/// In:		 <param name="_store"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoom.prototype.GML_AddInstance = function (_x, _y, _objid) {
	return this.AddInstance(_x, _y, g_room_maxid++, _objid,false,0);
};
yyRoom.prototype.GML_AddLayerInstance = function (_x, _y,_layer, _objid) {
	return this.AddLayerInstance(_x, _y,_layer, g_room_maxid++, _objid, true);
};
yyRoom.prototype.GML_AddInstanceDepth = function (_x, _y,_depth, _objid) {
    var inst = this.AddInstance(_x, _y, g_room_maxid++, _objid, true, _depth); 
    
	return inst;
};
// #############################################################################################
/// Function:<summary>
///             Create a new instance, and add it to the rooms active list
///          </summary>
///
/// In:		 <param name="_x">X coordinate</param>
///			 <param name="_y">X coordinate</param>
///			 <param name="_id">instance index (must be unique)</param>
///			 <param name="_objindex">Object to base instance on</param>
/// Out:	 <returns>
///				the instance pointer
///			 </returns>
// #############################################################################################
yyRoom.prototype.CreateInstance = function (_x, _y, _id, _objindex, _scaleX, _scaleY, _imageSpeed, _imageIndex, _rotation,_colour)
{
    
    var pinst = new yyInstance(_x, _y, _id, _objindex, true);
    this.m_Active.Add(pinst);
    g_pInstanceManager.Add(pinst);


	if (_imageSpeed != undefined) pinst.image_speed = _imageSpeed;
	if (_imageIndex != undefined) pinst.image_index = _imageIndex;	    	
    if (_scaleX != undefined) pinst.image_xscale = _scaleX;
    if (_scaleY != undefined) pinst.image_yscale = _scaleY;
    if (_rotation != undefined) pinst.image_angle = _rotation;
    if (_colour != undefined) {
        pinst.image_blend = _colour & 0xffffff;
        pinst.image_alpha = ((_colour >> 24) & 0xff) / 255.0;
    }

    if (g_isZeus)
    {
        pinst.sequence_pos = pinst.last_sequence_pos = pinst.image_index;

        // Not exactly the same flow as the C++ runner (the way instances are handled is a bit different)

        // Check to see if the instance is already in the layer system
        var elandlay = g_pLayerManager.GetElementAndLayerFromInstanceID(this, _id);
        if (elandlay == null) {
            g_pLayerManager.AddInstance(this, pinst);
        }
        else
        {
            g_pLayerManager.BuildElementRuntimeData(this, elandlay.layer, elandlay.element);
        }
    }
    pinst.BuildPhysicsBody();
    
  //  g_pLayerManager.AddInstance(this,pinst);
    return pinst;
};


// #############################################################################################
/// Function:<summary>
///             Add a new instance (runtime created) to the room.
///             Setting on a layer is defered until the end of the event
///          </summary>
///
/// In:		 <param name="_x">X coordinate</param>
///			 <param name="_y">X coordinate</param>
///			 <param name="_id">instance index (must be unique)</param>
///			 <param name="_objindex">Object to base instance on</param>
///			 <param name="_overridedepth">change the depth - dont use layer/object</param>
///			 <param name="_depth">depth to set</param>
/// Out:	 <returns>
///				the instance pointer
///			 </returns>
// #############################################################################################
yyRoom.prototype.AddInstance = function (_x, _y, _id, _objindex, _overridedepth, _depth)
{
    var pinst = new yyInstance(_x, _y, _id, _objindex, true);
    this.m_Active.Add(pinst);
    g_pInstanceManager.Add(pinst);

    if (_overridedepth)
    {
        pinst.depth = _depth;
    }
    //this.m_NewInstances.push({ inst: pinst, type: 0 } );

    if (g_isZeus) {
        // Not exactly the same flow as the C++ runner (the way instances are handled is a bit different)
        // Check to see if the instance is already in the layer system
        var elandlay = g_pLayerManager.GetElementAndLayerFromInstanceID(this, _id);
        if (elandlay == null) {
            g_pLayerManager.AddInstance(this, pinst);
        }
        else
        {
            g_pLayerManager.BuildElementRuntimeData(this, elandlay.layer, elandlay.element);
        }
    }

    pinst.BuildPhysicsBody();
    return pinst;
};



// #############################################################################################
/// Function:<summary>
///             Add a new instance to a layer
///             Setting on a layer is defered until the end of the event
///          </summary>
///
/// In:		 <param name="_x">X coordinate</param>
///			 <param name="_y">X coordinate</param>
///			 <param name="_id">instance index (must be unique)</param>
///			 <param name="_objindex">Object to base instance on</param>
///			 <param name="_overridedepth">change the depth - dont use layer/object</param>
///			 <param name="_depth">depth to set</param>
/// Out:	 <returns>
///				the instance pointer
///			 </returns>
// #############################################################################################
yyRoom.prototype.AddLayerInstance = function (_x, _y, _layer, _id, _objindex)
{

    var pinst = new yyInstance(_x, _y, _id, _objindex, true);
    
    pinst.depth = _layer.depth;
    
    this.m_Active.Add(pinst);
    g_pInstanceManager.Add(pinst);

    pinst.BuildPhysicsBody();
    
    //this.m_NewInstances.push({ inst: pinst, type: 1, layer:_layer });

    if(g_isZeus)
        g_pLayerManager.AddInstanceToLayer(this,_layer,pinst);
    
    return pinst;
};
// #############################################################################################
/// Function:<summary>
///             Adds an instance to the room
///          </summary>
///
/// In:		 <param name="_inst">Instance to add</param>
// #############################################################################################
yyRoom.prototype.AddInstanceToRoom = function (_pInst) {
	this.m_Active.Add(_pInst);
	g_pInstanceManager.Add(_pInst);

	if (g_isZeus)
	{
	    var pLayer = g_pLayerManager.GetLayerFromID(this, _pInst.m_nLayerID);
	    if(pLayer!=null)
	        g_pLayerManager.AddInstanceToLayer(this, pLayer, _pInst);
	}
};

// #############################################################################################
/// Function:<summary>
///             Copy all the view data into the arrays for GML to access
///          </summary>
// #############################################################################################
yyRoom.prototype.CopyViewsToArrays = function () {
	// ensure all the builtin arrays are setup
	var w = display_get_width();
	var h = display_get_height();
	for (var i = 0; i < MAX_VIEWS; i++)
	{
		g_pBuiltIn.view_visible[i] = false;
		g_pBuiltIn.view_xview[i] = 0;
		g_pBuiltIn.view_yview[i] = 0;
		g_pBuiltIn.view_wview[i] = g_RunRoom.m_width;
		g_pBuiltIn.view_hview[i] = g_RunRoom.m_height;
		g_pBuiltIn.view_xport[i] = 0;
		g_pBuiltIn.view_yport[i] = 0;
		g_pBuiltIn.view_wport[i] = w;
		g_pBuiltIn.view_hport[i] = h;
		g_pBuiltIn.view_angle[i] = 0;
		g_pBuiltIn.view_hborder[i] = 0;
		g_pBuiltIn.view_vborder[i] = 0;
		g_pBuiltIn.view_hspeed[i] = 0;
		g_pBuiltIn.view_vspeed[i] = 0;
		g_pBuiltIn.view_object[i] = -1;
		g_pBuiltIn.view_surface_id[i] = -1;
		g_pBuiltIn.view_camera[i] = -1;
	} // end for

	// Update the view user variables
	var index = 0;
	for (var i = 0; i < this.m_Views.length; i++)
	{
		var pView = this.m_Views[i];

		g_pBuiltIn.view_visible[index] = pView.visible;
		g_pBuiltIn.view_xview[index] = pView.worldx;
		g_pBuiltIn.view_yview[index] = pView.worldy;
		g_pBuiltIn.view_wview[index] = pView.worldw;
		g_pBuiltIn.view_hview[index] = pView.worldh;
		g_pBuiltIn.view_xport[index] = pView.portx;
		g_pBuiltIn.view_yport[index] = pView.porty;
		g_pBuiltIn.view_wport[index] = pView.portw;
		g_pBuiltIn.view_hport[index] = pView.porth;
		g_pBuiltIn.view_angle[index] = pView.angle;
		g_pBuiltIn.view_hborder[index] = pView.hborder;
		g_pBuiltIn.view_vborder[index] = pView.vborder;
		g_pBuiltIn.view_hspeed[index] = pView.hspeed;
		g_pBuiltIn.view_vspeed[index] = pView.vspeed;
		g_pBuiltIn.view_object[index] = pView.objid;
		g_pBuiltIn.view_surface_id[index] = pView.surface_id;
		g_pBuiltIn.view_camera[index] = pView.cameraID;

		index++;
	}
};

// #############################################################################################
/// Function:<summary>
///             Copy all the view data FROM the arrays back into the view data
///          </summary>
// #############################################################################################
yyRoom.prototype.CopyViewsFromArrays = function () {

	// Update the view user variables
	var index = 0;	
	for (var i = 0; i < this.m_Views.length; i++)
	{
		var pView = this.m_Views[i];

		pView.visible = g_pBuiltIn.view_visible[index];
		pView.worldx = g_pBuiltIn.view_xview[index];
		pView.worldy = g_pBuiltIn.view_yview[index];
		pView.worldw = g_pBuiltIn.view_wview[index];
		pView.worldh = g_pBuiltIn.view_hview[index];
		pView.portx = g_pBuiltIn.view_xport[index];
		pView.porty = g_pBuiltIn.view_yport[index];
		pView.portw = g_pBuiltIn.view_wport[index];
		pView.porth = g_pBuiltIn.view_hport[index];
		pView.angle = g_pBuiltIn.view_angle[index];
		pView.hborder = g_pBuiltIn.view_hborder[index];
		pView.vborder = g_pBuiltIn.view_vborder[index];
		pView.hspeed = g_pBuiltIn.view_hspeed[index];
		pView.vspeed = g_pBuiltIn.view_vspeed[index];
		pView.objid = g_pBuiltIn.view_object[index];
		pView.surface_id = g_pBuiltIn.view_surface_id[index];
		pView.cameraID = g_pBuiltIn.view_camera[index];

		index++;
	}
};


// #############################################################################################
/// Function: <summary>
///           		Autoscroll the backgrounds
///           </summary>
// #############################################################################################
yyRoom.prototype.ScrollBackground = function () {
	// Draw the backgrounds
	for (var i = 0; i < g_pBackgroundManager.background.length; i++)
	{
		var pBack = g_pBackgroundManager.Get(i);

		pBack.hspeed = g_pBuiltIn.background_hspeed[i];
		pBack.vspeed = g_pBuiltIn.background_vspeed[i];
		pBack.x = g_pBuiltIn.background_x[i];
		pBack.y = g_pBuiltIn.background_y[i];

		pBack.x += pBack.hspeed;
		pBack.y += pBack.vspeed;

		g_pBuiltIn.background_x[i] = pBack.x;
		g_pBuiltIn.background_y[i] = pBack.y;		
	}
};

// #############################################################################################
/// Function:<summary>
///             This updates all views to follow the object the user has requested.
///             views that have no object to follow are not touched/processed
///          </summary>
// #############################################################################################
yyRoom.prototype.UpdateViews = function () {

	var i;
	var l, t, ix, iy;
	var pView;
	var pInst;

	if (!this.m_enableviews) return;
	this.CopyViewsFromArrays();

	// Update the pViews	
	for (i = 0; i < this.m_Views.length; i++)
	{
		pView = this.m_Views[i];
		
		if(!pView.visible)
		    continue;
		    
		
		if(g_isZeus && g_webGL==null)
		{
		    //Copy some bits from camera to view
		    if (pView.cameraID != -1)
			{
				var pCam = g_pCameraManager.GetCamera(pView.cameraID);

				if (pCam != null)
				{
					pView.objid = pCam.m_targetInstance; //It may have been set in code
				}
			}
		}
		
		
		
		if (g_isZeus/* && (g_webGL!=null)*/)
		{
			if (pView.cameraID != -1)
			{
				var pCam = g_pCameraManager.GetCamera(pView.cameraID);

				if (pCam != null)
				{
					pCam.Update();
				}
			}
		}
		else if ((pView.visible) && (pView.objid >= 0))
		{
			// Find the pInstance to follow
			pInst = null;
			if (pView.objid < 100000)
			{
				// if they selected an OBJECT, then pick the 1st unmarked one!
				var pObj = g_pObjectManager.Get(pView.objid);
				if (pObj != null)
				{
					var pool = pObj.GetRPool();					
					for (var o = 0; o < pool.length; o++)
					{
						pInst = pool[o];
						if (!pInst.marked) break;   // if NOT marked, use this one!
						pInst = null;               // makes sure we can tell we found one		        
					}
				}

			}
			else                           // pView object is an pInstance
			{
				pInst = g_pInstanceManager.Get(pView.objid);
				if (!pInst && pInst.marked) pInst = null;
			}

			// if we have an object to follow.... then follow it!
			if (pInst != null)
			{
				// Find the new position
				l = pView.worldx;
				t = pView.worldy;
				ix = pInst.x;
				iy = pInst.y;

				if (2 * pView.hborder >= pView.worldw)
				{
					l = ix - pView.worldw / 2;
				} else if (ix - pView.hborder < pView.worldx)
				{
					l = ix - pView.hborder;
				} else if (ix + pView.hborder > pView.worldx + pView.worldw)
				{
					l = ix + pView.hborder - pView.worldw;
				}

				if (2 * pView.vborder >= pView.worldh)
				{
					t = iy - pView.worldh / 2;
				} else if (iy - pView.vborder < pView.worldy)
				{
					t = iy - pView.vborder;
				} else if (iy + pView.vborder > pView.worldy + pView.worldh)
				{
					t = iy + pView.vborder - pView.worldh;
				}


				// Make sure it does not extend beyond the room
				if (l < 0) l = 0;
				if (l + pView.worldw > this.m_width) l = this.m_width - pView.worldw;
				if (t < 0) t = 0;
				if (t + pView.worldh > this.m_height) t = this.m_height - pView.worldh;

				// Restrict motion speed
				if (pView.hspeed >= 0)
				{
					if ((l < pView.worldx) && (pView.worldx - l > pView.hspeed)) l = pView.worldx - pView.hspeed;
					if ((l > pView.worldx) && (l - pView.worldx > pView.hspeed)) l = pView.worldx + pView.hspeed;
				}
				if (pView.vspeed >= 0)
				{
					if ((t < pView.worldy) && (pView.worldy - t > pView.vspeed)) t = pView.worldy - pView.vspeed;
					if ((t > pView.worldy) && (t - pView.worldy > pView.vspeed)) t = pView.worldy + pView.vspeed;
				}
				pView.worldx = l;
				pView.worldy = t;

			} //if (pInst != null) 

		} // if((pView.visible) && (pView.objid>=0))

	}

	this.CopyViewsToArrays();
	
	var left,right,top,bottom;
    
    left = 999999;
    right = -999999;
    top  = 999999;
    bottom = -999999;
    
               
    for (var i = 0; i < g_RunRoom.m_Views.length; i++)
    {
        pView = g_RunRoom.m_Views[i];
        if (pView.visible )// && pView.surface_id==-1) 
        {                    
            if( left>pView.portx) left = pView.portx;
	        if( right<(pView.portx+pView.portw) ) right= pView.portx+pView.portw;
	        if( top>pView.porty) top = pView.porty;
	        if( bottom<(pView.porty+pView.porth) ) bottom = pView.porty+pView.porth;       
        }
    }
           
    g_DisplayScaleX = g_ApplicationWidth /  (right-left);
	g_DisplayScaleY = g_ApplicationHeight /  (bottom-top);
	
	
};




yyRoom.prototype.DrawLayerInstanceElement = function(_rect,_layer,_el)
{
    //CLayerInstanceElement
    var inst = _el.m_pInstance; //yyInstance
	if (inst != null)
	{
		// If this instance has been "marked", move to the next one
		if (!inst.marked && inst.active && inst.visible && (!inst.GetControlledBySequence() || !inst.GetDrawnBySequence()))
		{
			var obj = g_pObjectManager.Get(inst.object_index);
			if(obj!=null)
			{
				// If theres a script for drawing (including parent), do that instead...
			    if (obj.REvent[EVENT_DRAW])
				{
				    g_skeletonDrawInstance = inst;
				    inst.PerformEvent(EVENT_DRAW, 0, inst, inst);				        // do recursive events...
				    g_skeletonDrawInstance = null;
				    
				}
				else
				{
	
					// Otherwise just DRAW it..
					var pImage = g_pSpriteManager.Get( inst.sprite_index );  //yySprite
					if( pImage!=null )
					{
						g_skeletonDrawInstance = inst;
						
						if ((inst.image_xscale === 1) && (inst.image_yscale === 1) && (inst.image_angle === 0) && (ConvertGMColour(inst.image_blend) === 0xffffff) &&  (inst.image_alpha === 1))
						{
						    pImage.DrawSimple(inst.image_index,inst.x,inst.y, inst.image_alpha * g_GlobalAlpha);
						
						}
						else
						{
						    pImage.Draw(inst.image_index,inst.x,inst.y,inst.image_xscale,inst.image_yscale,inst.image_angle,ConvertGMColour(inst.image_blend),inst.image_alpha);
						
						
						}
					 	
					 	g_skeletonDrawInstance = null;
					}
					
				}
			}
		} // end if
	}
};
yyRoom.prototype.DrawLayerOldTilemapElement = function(_rect,_layer,_el)
{
    //Don't have one of these in our project, so bit hard to test...
//    LinkedList<CTileSlab>::iterator slabiter = _pOldTilemapEl->m_tiles.GetIterator();
//	while (*slabiter != NULL)
	
	for( var i=0;i<_el.m_tiles.length();i++)
	{
	    var tileslab = _el.m_TileData;
	    
	    for( var j=0;j<tileslab.length();j++)
	    {
	        var tile = tileslab[j]; //YYRoomTile3?
	        
	    
	    }
	
	
	}
	
/*	{
		CTileSlab* pSlab = *slabiter;
		RTile* pTiles = pSlab->m_Tiles;
		int numTiles = pSlab->m_nTilesUsed;
		if (numTiles > 0)
		{
			for(int i = 0; i < numTiles; i++)
			{
				RTile* thetile = &(pTiles[i]);
				if (!(thetile->visible))
					continue;

				// CLIP
				float xT = thetile->x;
				float xB = thetile->x + (thetile->xscale*thetile->w);
				float yL = thetile->y;
				float yR = thetile->y + (thetile->yscale*thetile->h);
				float x1 = yymin( xT, xB );
				float x2 = yymax( xT, xB );
				float y1 = yymin( yL, yR );
				float y2 = yymax( yL, yR );
				if( (Background_Exists(thetile->index)) && (x1 <= _viewrect->right) && (y1 <= _viewrect->bottom) && (x2 >= _viewrect->left) && (y2 >= _viewrect->top) )
				{
					// Draw the tile...
					Background_Data(thetile->index)->DrawPart(	(float)thetile->xo,(float)thetile->yo,
															(float)thetile->w,(float)thetile->h,
															thetile->x + _pLayer->m_xoffset,			thetile->y + _pLayer->m_yoffset,
															thetile->xscale,	thetile->yscale,
															thetile->blend,
															thetile->alpha);
				}
			}
		}

		slabiter.Next();
	}
*/

};


// #############################################################################################
/// Function:<summary>
///             Draw a background element. An animating sprite with colour tinting, 
///             or a flat colour with alpha
///          </summary>
///
/// In:		 <param name="_rect">Rect to "fit" in</param>
/// In:		 <param name="_el">The element we're drawing</param>
// #############################################################################################
yyRoom.prototype.DrawLayerBackgroundElement = function(_rect,_layer,_el)
{
    var back = _el.m_pBackground;
	if (!back.visible)		return;
	if (back.foreground)	return;
	
	var bcol = back.blend;


    // Does this background have a sprite?	
	if (sprite_exists(back.index))
	{
	    // get sprite details
        var pImage = g_pSpriteManager.Get( back.index );
        if (!pImage) return;
        
        // get current frame and round (it will be a fraction), then MOD to number of frames
        var vindex = (~~back.image_index) % pImage.ppTPE.length;
        if(pImage.ppTPE[vindex]!=undefined){
        
            if(back.stretch)
            {
                var xscale = g_RunRoom.GetWidth()/pImage.width;
                var yscale = g_RunRoom.GetHeight()/pImage.height;
            
                Graphics_TextureDrawTiled(pImage.ppTPE[vindex], _layer.m_xoffset, _layer.m_yoffset, xscale, yscale, back.vtiled, back.htiled, bcol, back.alpha);
            }
            else
                Graphics_TextureDrawTiled(pImage.ppTPE[vindex], _layer.m_xoffset, _layer.m_yoffset, back.xscale, back.yscale, back.vtiled, back.htiled, bcol, back.alpha);
        }
	}
	else
	{
		// Don't "just" clear - it doesn't respect the current viewport
	    var oldAlpha = g_GlobalAlpha;
	    g_GlobalAlpha = back.alpha;
	    if (!g_webGL) bcol = ConvertGMColour(back.blend);		
		draw_rectangle_color(g_roomExtents.left, g_roomExtents.top, g_roomExtents.right, g_roomExtents.bottom, bcol, bcol, bcol, bcol, false);
	    g_GlobalAlpha = oldAlpha;
	}	
};


// #############################################################################################
/// Function:<summary>
///             Draw a sprite element (on asset layer). 
///             An animating sprite with colour tinting, or a flat colour with alpha
///          </summary>
///
/// In:		 <param name="_rect">Rect to "fit" in</param>
/// In:		 <param name="_layer">Layer being drawn</param>
/// In:		 <param name="_el">The element we're drawing</param>
// #############################################################################################
yyRoom.prototype.DrawLayerSpriteElement = function(_rect,_layer,_el)
{
    if (sprite_exists(_el.m_spriteIndex))
	{
	    var pImage = g_pSpriteManager.Get( _el.m_spriteIndex );
		if (!pImage) return;
		
		if(pImage.m_skeletonSprite !== undefined)
		{
			if ((_el.m_imageScaleX == 1.0) && (_el.m_imageScaleY == 1.0) && (_el.m_imageAngle == 0.0) && (_el.m_imageBlend == 0xffffff)) // &&  (pInst.image_alpha == 1.0))
			{
				pImage.DrawSimple(_el.m_imageIndex, _el.m_x + _layer.m_xoffset, _el.m_y + _layer.m_yoffset, _el.m_imageAlpha);
			}
			else
			{
				pImage.Draw(_el.m_imageIndex, _el.m_x + _layer.m_xoffset, _el.m_y + _layer.m_yoffset, _el.m_imageScaleX, _el.m_imageScaleY, _el.m_imageAngle, _el.m_imageBlend, _el.m_imageAlpha);
			}
		}
		else
		{
			if ((_el.m_imageScaleX == 1.0) && (_el.m_imageScaleY == 1.0) && (_el.m_imageAngle == 0.0) && (_el.m_imageBlend == 0xffffff)) // &&  (pInst.image_alpha == 1.0))
			{
				pImage.DrawSimple(_el.m_imageIndex, _el.m_x + _layer.m_xoffset, _el.m_y + _layer.m_yoffset, _el.m_imageAlpha);
			}
			else
			{
				pImage.Draw(_el.m_imageIndex, _el.m_x + _layer.m_xoffset, _el.m_y + _layer.m_yoffset, _el.m_imageScaleX, _el.m_imageScaleY, _el.m_imageAngle, _el.m_imageBlend, _el.m_imageAlpha);
			}	
		}
	}
};

var g_DefaultCameraID = -1;

function CreateDefaultCamera()
{
	g_DefaultCameraID = g_pCameraManager.CreateCamera();
}

function UpdateCamera(_x, _y, _w, _h, _angle, pCam)
{
	//var defaultcam = g_pCameraManager.GetCamera(g_DefaultCameraID);

	if (pCam)
	{		
		pCam.SetViewX(_x);
		pCam.SetViewY(_y);
		pCam.SetViewWidth(_w);
		pCam.SetViewHeight(_h);
		pCam.SetViewAngle(_angle);

		if (pCam.m_is2D)
		{
			pCam.Build2DView(pCam.GetViewX() + (pCam.GetViewWidth() * 0.5), pCam.GetViewY() + (pCam.GetViewHeight() * 0.5));
			pCam.ApplyMatrices();
		}
		else
		{
			pCam.Build3DView(pCam.GetViewX() + (pCam.GetViewWidth() * 0.5), pCam.GetViewY() + (pCam.GetViewHeight() * 0.5));
			pCam.ApplyMatrices();

			// This is a total hack but keeps it consistent with the old stuff			
			g_worldx = _x;
			g_worldy = _y;
			g_worldw = _w;
			g_worldh = _h;

			var ViewAreaA = _angle;
			
			SetViewExtents(g_worldx,g_worldy,g_worldw,g_worldh,ViewAreaA);
		}

		//g_pCameraManager.SetActiveCamera(g_DefaultCameraID);
		//defaultcam.ApplyMatrices();
	}
}

function UpdateDefaultCamera(_x, _y, _w, _h, _angle)
{
	var defaultcam = g_pCameraManager.GetCamera(g_DefaultCameraID);
	if (defaultcam == null)
		defaultcam = g_pCameraManager.GetTempCamera();
	// Note: This may override user's camera configuration if it's a cam passed
	// in with camera_set_default!
	UpdateCamera(_x, _y, _w, _h, _angle, defaultcam);
	g_pCameraManager.SetActiveCamera(defaultcam.GetID());
}

function DrawTile(_rect,_back,_indexdata,_frame,_x,_y,_depth)
{
    if(_back!=null)
    {
      
        var pBack = _back;
        var pTex = null;
        
        var uscale = 1;
        var vscale = 1;
        var fastpath = false;
        var tilewidth=0;
        var tileheight=0;
        var tileincu =0,tileincv=0;
        var origu=0,origv=0;
        
         _frame = _frame % pBack.framelength;    
        if(pBack.TPEntry===null || pBack.TPEntry === undefined)
        {
            //Not sure we have this setup yet
        }
        else
        {           
            var TPE=pBack.TPEntry;
            var tex = TPE.texture;
            
            if (!tex.complete) return;   
            if(g_webGL) 
                if (!tex.webgl_textureid) 
                    WebGL_BindTexture({ texture: tex });
                                
            uscale = TPE.w/TPE.ow;
            vscale = TPE.h/TPE.oh;
            
            if(TPE.XOffset!=0 || TPE.YOffset!=0 || TPE.CropWidth!=TPE.ow || TPE.CropHeight!=TPE.oh)
            {               
                fastpath = false;
            }
            else
            {
                fastpath = true;
                
                tilewidth = pBack.tilewidth*uscale/tex.width;
                tileheight = pBack.tileheight*vscale/tex.height;
                
                var tilehsep = pBack.tilehsep*uscale/tex.width;
                var tilevsep = pBack.tilevsep*vscale/tex.height;
                
                origu = tilehsep +TPE.x/tex.width;
                origv = tilevsep +TPE.y/tex.height;
                
                tileincu = tilewidth+ tilehsep*2;
                tileincv = tileheight+tilevsep*2;
                
            
            }   
        }
        
        var xoffset,yoffset,depth;
     
        {
            xoffset=_x;
            yoffset=_y;
            depth=_depth;
        }
        
        if(tex!=null)
        {
        
            var tiledatamask = g_pLayerManager.GetTiledataMask();
         
            if(fastpath)
            {
                //Going to do webgl here, worry about canvas later, going to be fun
            
            
                
                var tileWidthPix = pBack.tilewidth;
                var tileHeightPix = pBack.tileheight;
                var tilecolumns = pBack.tilecolumns;
                
          
                
                var pVerts=null;
                var pCurrVert=null;
                
                var stride,bindex,pCoords,pColours,pUVs,v0,v1,v2,v3,v4,v5;
                
                if(g_webGL)
                {
					var col = ~~((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0xffffff);
                 
                    var tiledata = _indexdata;
                    tiledata&= tiledatamask;
                    
                    var tileindex = (tiledata>> TileIndex_Shift) & TileIndex_ShiftedMask;
                    if(tileindex===0)
                        return;
                   
                    tileindex = pBack.framedata[tileindex*pBack.frames+_frame];
                    
                    if(tileindex===0)
                        return;
                        
                   
                    pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6);
                   
				    stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
                    bindex = stride * pVerts.Current; 
                    pVerts.Current += 6;

                    pCoords = pVerts.Coords;
                    pColours = pVerts.Colours;
                    pUVs = pVerts.UVs;

                    v0 = bindex;
                    v1 = v0 + stride;
                    v2 = v1 + stride;
                    v3 = v2 + stride;
                    v4 = v3 + stride;
                    v5 = v4 + stride;		
                    
             
                    var xpos = xoffset;
				    var ypos = yoffset;
				    var xo = ((tileindex % tilecolumns) * tileincu) + origu;
				    var yo = (Math.floor(tileindex / tilecolumns) * tileincv) + origv;
					
					
				    var topleftX = xpos;
				    var topleftY = ypos;
				    var toprightX = xpos + tileWidthPix;
				    var toprightY = ypos;
				    var bottomleftX = xpos;
				    var bottomleftY = ypos + tileHeightPix;
				    var bottomrightX = xpos + tileWidthPix;
				    var bottomrightY = ypos + tileHeightPix;

				    var topleftU = xo;
				    var topleftV = yo;
				    var toprightU = xo + tilewidth;
				    var toprightV = yo;
				    var bottomleftU = xo;
				    var bottomleftV = yo + tileheight;
				    var bottomrightU = xo + tilewidth;
				    var bottomrightV = yo + tileheight;
					
				    // Pretty crap (lots of reads and writes)...
				    if (tiledata & TileScaleRot_Mask)
				    {
					    if (tiledata & TileMirror_Mask)
					    {
						    var temp;
						    temp = topleftU;
						    topleftU = toprightU;
						    toprightU = temp;

						    temp = bottomleftU;
						    bottomleftU = bottomrightU;
						    bottomrightU = temp;							
					    }

					    if (tiledata & TileFlip_Mask)
					    {
						    var temp;
						    temp = topleftV;
						    topleftV = bottomleftV;
						    bottomleftV = temp;

						    temp = toprightV;
						    toprightV = bottomrightV;
						    bottomrightV = temp;							
					    }

					    if (tiledata & TileRotate_Mask)
					    {
						    var temp;
						    temp = topleftU;
						    topleftU = bottomleftU;
						    bottomleftU = bottomrightU;
						    bottomrightU = toprightU;
						    toprightU = temp;

						    temp = topleftV;
						    topleftV = bottomleftV;
						    bottomleftV = bottomrightV;
						    bottomrightV = toprightV;
						    toprightV = temp;							
					    }
					    
				    }
					
					
				    pCoords[v0 + 0] = topleftX;
                    pCoords[v0 + 1] = topleftY;	
                    pCoords[v0 + 2] = depth;
                   
                    pCoords[v1 + 0] = pCoords[v4 + 0] = toprightX;
                    pCoords[v1 + 1] = pCoords[v4 + 1] = toprightY;	
                    pCoords[v1 + 2] = pCoords[v4 + 2] = depth;
                	
            	    pCoords[v2 + 0] = pCoords[v3 + 0] = bottomleftX;
                    pCoords[v2 + 1] = pCoords[v3 + 1] = bottomleftY;	
                    pCoords[v2 + 2] = pCoords[v3 + 2] = depth;
                	
            	    pCoords[v5 + 0] = bottomrightX;
                    pCoords[v5 + 1] = bottomrightY;	
                    pCoords[v5 + 2] = depth;
                	
                    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
                    
                   
                    pUVs[v0 + 0] =  topleftU;
                    pUVs[v0 + 1] =  topleftV;	
                   
                    pUVs[v1 + 0] = pUVs[v4 + 0] = toprightU;
                    pUVs[v1 + 1] = pUVs[v4 + 1] = toprightV;
                    
                    pUVs[v2 + 0] = pUVs[v3 + 0] = bottomleftU;
                    pUVs[v2 + 1] = pUVs[v3 + 1] = bottomleftV;
                    
                    pUVs[v5 + 0] = bottomrightU;
                    pUVs[v5 + 1] = bottomrightV;
					

                }
                else
                {
                    //Non Web-GL
                  
                    var tiledata = _indexdata;
                    var tileindex = (tiledata>> TileIndex_Shift) & TileIndex_ShiftedMask;
                    if(tileindex===0)
                        return;
                        
                    tileindex = pBack.framedata[tileindex*pBack.frames+_frame];
                    
                    if(tileindex===0)
                        return;
                        
                    var xpos =  xoffset;
				    var ypos =  yoffset;
				    var xo = ((tileindex % tilecolumns) * tileincu) + origu;
				    var yo = (Math.floor(tileindex / tilecolumns) * tileincv) + origv;
					
					
				    var topleftX = xpos;
				    var topleftY = ypos;
				    var toprightX = xpos + tileWidthPix;
				    var toprightY = ypos;
				    var bottomleftX = xpos;
				    var bottomleftY = ypos + tileHeightPix;
				    var bottomrightX = xpos + tileWidthPix;
				    var bottomrightY = ypos + tileHeightPix;

				    var topleftU = xo;
				    var topleftV = yo;
				    var toprightU = xo + tilewidth;
				    var toprightV = yo;
				    var bottomleftU = xo;
				    var bottomleftV = yo + tileheight;
				    var bottomrightU = xo + tilewidth;
				    var bottomrightV = yo + tileheight;
					
					var oldalpha = graphics.globalAlpha;
					graphics.globalAlpha = g_GlobalAlpha;

					var textouse = tex;
					var shiftX = 0;
					var shiftY = 0;
					var col = g_GlobalColour & 0xffffff;
					if (col != 0xffffff)					
					{
						textouse = Graphics_CacheBlock(TPE, col);      
						shiftX = -TPE.x; 
						shiftY = -TPE.y;
					}

				    if (tiledata & TileScaleRot_Mask)
				    {
				        var _xsc=1;
				        var _ysc=1;
				        var _rot=0;
				    
					    if (tiledata & TileMirror_Mask)
					    {
						   _xsc =-_xsc;
					    }

					    if (tiledata & TileFlip_Mask)
					    {
						    _ysc = -_ysc;					
					    }

					    if (tiledata & TileRotate_Mask)
					    {
						    _rot = -1.5708;			
					    }

		                Graphics_PushTransform(Math.floor(topleftX)+tileWidthPix*0.5, Math.floor(topleftY)+tileHeightPix*0.5, _xsc, _ysc, -_rot);
		                graphics._drawImage(textouse, Math.floor(topleftU*tex.width) + shiftX,Math.floor(topleftV*tex.height) + shiftY, Math.floor(tilewidth*tex.width), Math.floor(tileheight*tex.height), -tileWidthPix*0.5,-tileWidthPix*0.5, tileWidthPix, tileHeightPix);
		                Graphics_SetTransform();

				    }
				    else
				    {
				    
				    
					    		    
				        graphics._drawImage(textouse,Math.floor(topleftU*tex.width) + shiftX,Math.floor(topleftV*tex.height) + shiftY, Math.floor(tilewidth*tex.width), Math.floor(tileheight*tex.height), Math.floor(topleftX), Math.floor(topleftY),tileWidthPix, tileHeightPix);	    						
				    }
					graphics.globalAlpha = oldalpha;     
                }   
            }
        }
    }
};

function draw_tile(_inst,_back,_tileindex,_frame,_x,_y)
{

  
    if(background_exists(_back))
    {
        var backwidth = background_get_width(_back);
        var backheight = background_get_height(_back);
        var pBack = g_pBackgroundManager.GetImage(_back);

        var tileindex = ((_tileindex >> TileIndex_Shift) & TileIndex_ShiftedMask);
    
        if(pBack!=null && tileindex>pBack.tilecount)
        {
            return;
        }

		var x = yyGetReal(_x);
        var y = yyGetReal(_y);
        var depth = GetInstanceDepth(_inst);
        
        DrawTile(g_roomExtents,pBack,_tileindex,_frame,x,y,depth);
        
    }        
};

yyRoom.prototype.DrawLayerTilemapElement = function(_rect,_layer,_el,_xpos,_ypos,_depth)
{
    if(background_exists(_el.m_backgroundIndex))
    {
        var backwidth = background_get_width(_el.m_backgroundIndex);
        var backheight = background_get_height(_el.m_backgroundIndex);
        var pBack = g_pBackgroundManager.GetImage(_el.m_backgroundIndex);
        var pTex = null;
        
        var uscale = 1;
        var vscale = 1;
        var fastpath = false;
        var tilewidth=0;
        var tileheight=0;
        var tileincu =0,tileincv=0;
        var origu=0,origv=0;
        
        
        if(pBack.TPEntry===null || pBack.TPEntry === undefined)
        {
            //Not sure we have this setup yet
        }
        else
        {           
            var TPE=pBack.TPEntry;
            var tex = TPE.texture;
            
            if (!tex.complete) return;   
            if(g_webGL) 
                if (!tex.webgl_textureid) 
                    WebGL_BindTexture({ texture: tex });
                                
            uscale = TPE.w/TPE.ow;
            vscale = TPE.h/TPE.oh;
            
            if(TPE.XOffset!=0 || TPE.YOffset!=0 || TPE.CropWidth!=TPE.ow || TPE.CropHeight!=TPE.oh)
            {               
                fastpath = false;
            }
            else
            {
                fastpath = true;
                
                tilewidth = pBack.tilewidth*uscale/tex.width;
                tileheight = pBack.tileheight*vscale/tex.height;
                
                var tilehsep = pBack.tilehsep*uscale/tex.width;
                var tilevsep = pBack.tilevsep*vscale/tex.height;
                
                origu = tilehsep +TPE.x/tex.width;
                origv = tilevsep +TPE.y/tex.height;
                
                tileincu = tilewidth+ tilehsep*2;
                tileincv = tileheight+tilevsep*2;
                
            
            }   
        }
        
        var xoffset,yoffset,depth;
        if(_layer!=null)
        {
            xoffset=_layer.m_xoffset+_el.m_x;
            yoffset=_layer.m_yoffset+_el.m_y;
            depth = _layer.depth;
        }
        else
        {
            xoffset=_xpos;
            yoffset=_ypos;
            depth=_depth;
        }
        
        if(tex!=null)
        {
        
            var tiledatamask = g_pLayerManager.GetTiledataMask();
            tiledatamask &= _el.m_tiledataMask;
        
            if(fastpath)
            {
                //Going to do webgl here, worry about canvas later, going to be fun
                var maxtilesinrun = 2048;//???
                var minx = Math.floor((_rect.left - xoffset)/pBack.tilewidth);
                var maxx = Math.floor(((_rect.right-xoffset)+pBack.tilewidth)/pBack.tilewidth);
                var miny = Math.floor((_rect.top-yoffset)/pBack.tileheight);
                var maxy = Math.floor(((_rect.bottom-yoffset)+pBack.tileheight)/pBack.tileheight);
                
                minx = yymax(0,minx);
                maxx = yymin(_el.m_mapWidth,maxx);
                
                miny = yymax(0,miny);
                maxy = yymin(_el.m_mapHeight,maxy);
                
                var tileWidthPix = pBack.tilewidth;
                var tileHeightPix = pBack.tileheight;
                var tilecolumns = pBack.tilecolumns;
                
                var tilesremaining = (maxx-minx)*(maxy-miny);
                
                var tilesinthisrun = 0;
                
                var pVerts=null;
                var pCurrVert=null;
                
                var stride,bindex,pCoords,pColours,pUVs,v0,v1,v2,v3,v4,v5;
                
                if(g_webGL)
                {
                    for(var y=miny;y<maxy;y++)
                    {
                        var index = y*_el.m_mapWidth+minx;
                        for(var x=minx;x<maxx;x++,index++,tilesremaining--)
                        {
                            var tiledata = _el.m_pTiles[index];
                            tiledata&= tiledatamask;
                            
                            var tileindex = (tiledata>> TileIndex_Shift) & TileIndex_ShiftedMask;
                            if(tileindex===0)
                                continue;
                                
                            tileindex = pBack.framedata[tileindex*pBack.frames+_el.m_frame];
                            
                            if(tileindex===0)
                                continue;
                                
                            if(tilesinthisrun===0)
                            {
                                tilesinthisrun = yymin(tilesremaining, maxtilesinrun);
                                pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, tilesinthisrun * 6);
                               
							    stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
	                            bindex = stride * pVerts.Current; 
                                pVerts.Current += tilesinthisrun * 6;

                                pCoords = pVerts.Coords;
                                pColours = pVerts.Colours;
                                pUVs = pVerts.UVs;
        
                                v0 = bindex;
                                v1 = v0 + stride;
                                v2 = v1 + stride;
                                v3 = v2 + stride;
                                v4 = v3 + stride;
                                v5 = v4 + stride;		
                            }
                     
                            var xpos = x * tileWidthPix + xoffset;
						    var ypos = y * tileHeightPix + yoffset;
						    var xo = ((tileindex % tilecolumns) * tileincu) + origu;
						    var yo = (Math.floor(tileindex / tilecolumns) * tileincv) + origv;
    						
    						
						    var topleftX = xpos;
						    var topleftY = ypos;
						    var toprightX = xpos + tileWidthPix;
						    var toprightY = ypos;
						    var bottomleftX = xpos;
						    var bottomleftY = ypos + tileHeightPix;
						    var bottomrightX = xpos + tileWidthPix;
						    var bottomrightY = ypos + tileHeightPix;

						    var topleftU = xo;
						    var topleftV = yo;
						    var toprightU = xo + tilewidth;
						    var toprightV = yo;
						    var bottomleftU = xo;
						    var bottomleftV = yo + tileheight;
						    var bottomrightU = xo + tilewidth;
						    var bottomrightV = yo + tileheight;
    						
						    // Pretty crap (lots of reads and writes)...
						    if (tiledata & TileScaleRot_Mask)
						    {
							    if (tiledata & TileMirror_Mask)
							    {
								    var temp;
								    temp = topleftU;
								    topleftU = toprightU;
								    toprightU = temp;

								    temp = bottomleftU;
								    bottomleftU = bottomrightU;
								    bottomrightU = temp;							
							    }

							    if (tiledata & TileFlip_Mask)
							    {
								    var temp;
								    temp = topleftV;
								    topleftV = bottomleftV;
								    bottomleftV = temp;

								    temp = toprightV;
								    toprightV = bottomrightV;
								    bottomrightV = temp;							
							    }

							    if (tiledata & TileRotate_Mask)
							    {
								    var temp;
								    temp = topleftU;
								    topleftU = bottomleftU;
								    bottomleftU = bottomrightU;
								    bottomrightU = toprightU;
								    toprightU = temp;

								    temp = topleftV;
								    topleftV = bottomleftV;
								    bottomleftV = bottomrightV;
								    bottomrightV = toprightV;
								    toprightV = temp;							
							    }
							    
						    }
    						
    						
						    pCoords[v0 + 0] = topleftX;
	                        pCoords[v0 + 1] = topleftY;	
	                        pCoords[v0 + 2] = depth;
    	                   
	                        pCoords[v1 + 0] = pCoords[v4 + 0] = toprightX;
	                        pCoords[v1 + 1] = pCoords[v4 + 1] = toprightY;	
	                        pCoords[v1 + 2] = pCoords[v4 + 2] = depth;
                        	
                    	    pCoords[v2 + 0] = pCoords[v3 + 0] = bottomleftX;
	                        pCoords[v2 + 1] = pCoords[v3 + 1] = bottomleftY;	
	                        pCoords[v2 + 2] = pCoords[v3 + 2] = depth;
                        	
                    	    pCoords[v5 + 0] = bottomrightX;
	                        pCoords[v5 + 1] = bottomrightY;	
	                        pCoords[v5 + 2] = depth;
                        	
                            pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = 0xffffffff;
                            
                           
                            pUVs[v0 + 0] =  topleftU;
	                        pUVs[v0 + 1] =  topleftV;	
    	                   
	                        pUVs[v1 + 0] = pUVs[v4 + 0] = toprightU;
	                        pUVs[v1 + 1] = pUVs[v4 + 1] = toprightV;
    	                    
	                        pUVs[v2 + 0] = pUVs[v3 + 0] = bottomleftU;
	                        pUVs[v2 + 1] = pUVs[v3 + 1] = bottomleftV;
    	                    
	                        pUVs[v5 + 0] = bottomrightU;
	                        pUVs[v5 + 1] = bottomrightV;
    						
						    v0+=stride*6;
						    v1+=stride*6;
						    v2+=stride*6;
						    v3+=stride*6;
						    v4+=stride*6;
						    v5+=stride*6;
                            tilesinthisrun--;
                        } 
                    }
                    
                    
                    if(tilesinthisrun>0)
                        pVerts.Current -= tilesinthisrun * 6;

                }
                else
                {
                    //Non Web-GL
                    for(var y=miny;y<maxy;y++)
                    {
                        var index = y*_el.m_mapWidth+minx;
                        for(var x=minx;x<maxx;x++,index++,tilesremaining--)
                        {
                            var tiledata = _el.m_pTiles[index];
                            var tileindex = (tiledata>> TileIndex_Shift) & TileIndex_ShiftedMask;
                            if(tileindex===0)
                                continue;
                                
                            tileindex = pBack.framedata[tileindex*pBack.frames+_el.m_frame];
                            
                            if(tileindex===0)
                                continue;
                                
                            var xpos = x * tileWidthPix + xoffset;
						    var ypos = y * tileHeightPix + yoffset;
						    var xo = ((tileindex % tilecolumns) * tileincu) + origu;
						    var yo = (Math.floor(tileindex / tilecolumns) * tileincv) + origv;
    						
    						
						    var topleftX = xpos;
						    var topleftY = ypos;
						    var toprightX = xpos + tileWidthPix;
						    var toprightY = ypos;
						    var bottomleftX = xpos;
						    var bottomleftY = ypos + tileHeightPix;
						    var bottomrightX = xpos + tileWidthPix;
						    var bottomrightY = ypos + tileHeightPix;

						    var topleftU = xo;
						    var topleftV = yo;
						    var toprightU = xo + tilewidth;
						    var toprightV = yo;
						    var bottomleftU = xo;
						    var bottomleftV = yo + tileheight;
						    var bottomrightU = xo + tilewidth;
						    var bottomrightV = yo + tileheight;
    						
							    
						    if (tiledata & TileScaleRot_Mask)
						    {
						        var _xsc=1;
						        var _ysc=1;
						        var _rot=0;
						    
							    if (tiledata & TileMirror_Mask)
							    {
								   _xsc =-_xsc;
							    }

							    if (tiledata & TileFlip_Mask)
							    {
								    _ysc = -_ysc;					
							    }

							    if (tiledata & TileRotate_Mask)
							    {
								    _rot = -1.5708;			
							    }

    			                Graphics_PushTransform(Math.floor(topleftX)+tileWidthPix*0.5, Math.floor(topleftY)+tileHeightPix*0.5, _xsc, _ysc, -_rot);
    			                graphics._drawImage(tex, Math.floor(topleftU*tex.width),Math.floor(topleftV*tex.height), Math.floor(tilewidth*tex.width), Math.floor(tileheight*tex.height), -tileWidthPix*0.5,-tileWidthPix*0.5, tileWidthPix, tileHeightPix);
    			                Graphics_SetTransform();
  
						    }
						    else
						    {
						    
						    
							    		    
						        graphics._drawImage(tex,Math.floor(topleftU*tex.width),Math.floor(topleftV*tex.height), Math.floor(tilewidth*tex.width), Math.floor(tileheight*tex.height), Math.floor(topleftX), Math.floor(topleftY),tileWidthPix, tileHeightPix);	    
						    }
					    }
				    }            
                }   
            }
        }
    }
};

yyRoom.prototype.DrawLayerParticleSystem = function(_rect,_layer,_el)
{
	var ps = _el.m_systemID;

	if (!ParticleSystem_Exists(ps)) return;

	var pSystem = g_ParticleSystems[ps];

	if (!pSystem.automaticdraw) return;

	var matWorldOld = WebGL_GetMatrix(MATRIX_WORLD);

	var matRot = new Matrix();
	matRot.SetZRotation(_el.m_imageAngle + pSystem.angle);

	var matScale = new Matrix();
	matScale.SetScale(_el.m_imageScaleX, _el.m_imageScaleY, 1.0);

	var matScaleRot = new Matrix();
	matScaleRot.Multiply(matScale, matRot);

	var matPos = new Matrix();
	matPos.SetTranslation(-pSystem.xdraw, -pSystem.ydraw, 0.0);
	
	var matWorldNew = new Matrix();
	matWorldNew.Multiply(matPos, matScaleRot);
	matWorldNew.Translation(pSystem.xdraw + _el.m_x, pSystem.ydraw + _el.m_y, 0.0);

	WebGL_SetMatrix(MATRIX_WORLD, matWorldNew);
	ParticleSystem_SetMatrix(ps, matWorldNew);
	ParticleSystem_Draw(ps, _el.m_imageBlend, _el.m_imageAlpha);
	WebGL_SetMatrix(MATRIX_WORLD, matWorldOld);
};

yyRoom.prototype.DrawLayerTileElement = function (_rect, _layer, _el) {
    // TODO - cull according to screen rect
    if (!_el.m_visible) return false;
    var pImage = g_pSpriteManager.Get(_el.m_index);
    if (pImage != null) {
        var pTPE = pImage.ppTPE[0];

        if ((pTPE.texture instanceof HTMLImageElement)
        && (pTPE.tp >= g_Textures.length)) return;
        if ((g_Textures[pTPE.tp] instanceof HTMLImageElement)
        && (!g_Textures[pTPE.tp].complete)) return;

        Graphics_DrawPart(pTPE, _el.m_xo, _el.m_yo, _el.m_w, _el.m_h, _el.m_x, _el.m_y, _el.m_imageScaleX, _el.m_imageScaleY, _el.m_imageBlend, _el.m_imageAlpha);

        /*var scalex = pTPE.w / pTPE.ow;
        var scaley = pTPE.h / pTPE.oh;
        if (!g_webGL) {

            graphics.globalAlpha = _el.m_imageAlpha;
            if (_el.m_imageBlend != 0xffffff) {
                cached_image = Graphics_CacheBlock(pTPE, _el.m_imageBlend);
                if (_el.m_imageScaleX <= 0 || _el.m_imageScaleY <= 0) {
                    Graphics_PushTransform(_el.m_x, _el.m_y, _el.m_imageScaleX, _el.m_imageScaleY, 0.0);
                    graphics._drawImage(cached_image, (_el.m_xo * scalex), (_el.m_yo * scaley), _el.m_w * scalex, _el.m_h * scaley, 0, 0, _el.m_w, _el.m_h);
                    Graphics_SetTransform();
                }
                else {
                    // otherwise, draw faster
                    graphics._drawImage(cached_image, (_el.m_xo * scalex), (_el.m_yo * scaley), (_el.m_w * scalex), (_el.m_h * scaley), _el.m_x, _el.m_y, _el.m_w * _el.m_imageScaleX, _el.m_h * _el.m_imageScaleY);
                }
            }
            else {
                var pTexture = -1;
                if (pTPE.texture instanceof HTMLImageElement)
                    pTexture = g_Textures[pTPE.tp];
                else
                    pTexture = pTPE.texture;
                if (_el.m_imageScaleX <= 0 || _el.m_imageScaleY <= 0) {

                    Graphics_PushTransform(_el.m_x, _el.m_y, _el.m_imageScaleX, _el.m_imageScaleY, 0.0);
                    graphics._drawImage(pTexture, pTPE.x + (_el.m_xo * scalex), pTPE.y + (_el.m_yo * scalex), _el.m_w * scalex, _el.m_h * scaley, 0, 0, _el.m_w, _el.m_h);
                    Graphics_SetTransform();
                }
                else {
                    graphics._drawImage(pTexture, pTPE.x + (_el.m_xo * scalex), pTPE.y + (_el.m_yo * scalex), _el.m_w * scalex, _el.m_h * scaley, _el.m_x, _el.m_y, _el.m_w * _el.m_imageScaleX, _el.m_h * _el.m_imageScaleY);
                }
            }
        }
        else {
            var col = _el.m_imageBlend | ((_el.imageAlpha * 255) << 24);
            graphics._drawImage(pTPE, pTPE.x + (_el.m_xo * scalex), pTPE.y + (_el.m_yo * scalex), _el.m_w * scalex, _el.m_h * scalex, _el.m_x, _el.m_y, _el.m_w * _el.m_imageScaleX, _el.m_h * _el.m_imageScaleY, col);
        }*/
    }
};


yyRoom.prototype.DrawLayerSequenceElement = function (_rect, _layer, _pSequenceEl) {

	// Update sequence element in case there has been changes between the sequence instance update pre-step and now 
	g_pSequenceManager.EvaluateLayerSequenceElement(_pSequenceEl, true);

    var pInst = g_pSequenceManager.GetInstanceFromID(_pSequenceEl.m_instanceIndex);
    if ((pInst != null) && (pInst.evalNodeHead != null))
	{
        var pSeq = g_pSequenceManager.GetSequenceFromID(pInst.m_sequenceIndex);
		if (pSeq != null)
		{
            var oldWorldMat = new Matrix();
            var setmat = _pSequenceEl.m_x != 0 || _pSequenceEl.m_y != 0 || _pSequenceEl.m_angle != 0 || _pSequenceEl.m_scaleX != 1 || _pSequenceEl.m_scaleY != 1;
            if (setmat)
            {
                oldWorldMat = WebGL_GetMatrix(MATRIX_WORLD);

                var scaleMat = new Matrix();
                var rotMat = new Matrix();
                var offsetMat = new Matrix();
                var originMat = new Matrix();

                scaleMat.SetScale(_pSequenceEl.m_scaleX, _pSequenceEl.m_scaleY, 1);
                rotMat.SetZRotation(_pSequenceEl.m_angle);
                offsetMat.SetTranslation(-pSeq.m_xorigin * _pSequenceEl.m_scaleX, -pSeq.m_yorigin * _pSequenceEl.m_scaleY, 0);
                originMat.SetTranslation(pSeq.m_xorigin * _pSequenceEl.m_scaleX, pSeq.m_yorigin * _pSequenceEl.m_scaleY, 0);

                var mat = new Matrix();
                mat.Multiply(offsetMat, rotMat);
                var mat2 = new Matrix();
                mat2.Multiply(mat, originMat);
                mat.Multiply(scaleMat, mat2);

                mat.m[12] = _pSequenceEl.m_x;
                mat.m[13] = _pSequenceEl.m_y;
				
                var newWorldMat = new Matrix();
                newWorldMat.Multiply(mat, oldWorldMat);

                WebGL_SetMatrix(MATRIX_WORLD, newWorldMat);

                DirtyRoomExtents();
			}
			
			g_SeqStack.push(pSeq);
            this.DrawSequence(_rect, _layer, _pSequenceEl, pInst.evalNodeHead, pInst.m_headPosition, pInst.lastHeadPosition, pInst.m_headDirection, pSeq, false);
			g_SeqStack.pop();

            if (setmat)
            {
                WebGL_SetMatrix(MATRIX_WORLD, oldWorldMat);
            }
        }
    }
};

yyRoom.prototype.DrawSequence = function (_rect, _layer, _pSequenceEl, _evalTree, _headPosition, _lastHeadPosition, _headDirection, _sequence, _isNested, _sequenceMatrix) {

    if (_sequence == null)
    {
        return;
    }

    var oldWorldMat = new Matrix();
    var setmat = !_isNested && (_sequence.m_xorigin != 0 || _sequence.m_yorigin != 0);
    if (setmat)
    {
        oldWorldMat = WebGL_GetMatrix(MATRIX_WORLD);
	
        var transMat = new Matrix();
        transMat.BuildMatrix(-_sequence.m_xorigin, -_sequence.m_yorigin, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	
        var newWorldMat = new Matrix();
        newWorldMat.Multiply(transMat, oldWorldMat);
	
        WebGL_SetMatrix(MATRIX_WORLD, newWorldMat);

        DirtyRoomExtents();
    }

    this.DrawTrackList(_rect, _layer, _pSequenceEl, _evalTree, _headPosition, _lastHeadPosition, _headDirection, _sequence.m_tracks, _sequence);

    if (setmat)
    {
        WebGL_SetMatrix(MATRIX_WORLD, oldWorldMat);
    }
};

yyRoom.prototype.DrawTrackList = function (_rect, _layer, _pSequenceEl, _evalTree, _headPosition, _lastHeadPosition, _headDirection, _tracks, _sequence) {

    var currNode = _evalTree;
    var mWorld = new Matrix();
    var mAssignHelper = new Matrix();

    for (var trackIndex = 0; trackIndex < _tracks.length; ++trackIndex)
    {
        var track = _tracks[trackIndex];

        if (TrackIsParameter(track.m_type) || !track.enabled || !track.visible)
        {
            if (!TrackIsParameter(track.m_type) && track.enabled)
            {
                // This can be null if it wasn't evaluated, e.g. parameter tracks are not evaluated
                if (currNode != null) {
                    currNode = currNode.m_next;
                }
            }
            continue;
		}
		
		g_SeqStack.push(track);

        switch (track.m_type)
        {
            default: break;
            case eSTT_ClipMask_Mask:
            case eSTT_ClipMask_Subject:
                // This can be null if it wasn't evaluated, e.g. parameter tracks are not evaluated
                if (currNode != null) {
                    currNode = currNode.m_next;
				}
				g_SeqStack.pop();
                continue;
        }

        if (currNode != null)
        {
            // Push matrix
            mWorld = WebGL_GetMatrix(MATRIX_WORLD);
            mAssignHelper.Multiply(currNode.value.matrix, mWorld);
            WebGL_SetMatrix(MATRIX_WORLD, mAssignHelper);
        }

        if (currNode != null)
        {
            switch (track.m_type)
            {
                default: break;
                case eSTT_Graphic:
                    this.HandleSequenceGraphic(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
                    break;
                case eSTT_Sequence:
                    this.HandleSequenceSequence(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
                    break;
                case eSTT_ClipMask:
                    // Masks require webgl to be enabled
                    if (g_webGL)
                    {
                        this.HandleSequenceClipMask(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
                    }
                    break;
                case eSTT_Instance:
                    this.HandleSequenceInstance(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
                    break;
				case eSTT_Text:
                    this.HandleSequenceText(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
                    break;
				case eSTT_Particle:
					this.HandleSequenceParticle(_rect, _layer, _pSequenceEl, currNode, track, _headPosition, _lastHeadPosition, _headDirection, _sequence);
					break;
            }
        }
		
		// if currNode is null then this track hasn't been evaluated,
        // which means it's not a valid "renderable" parent in the first place
        if (currNode != null && track.m_tracks.length > 0)
        {
            // Traverse children
            this.DrawTrackList(_rect, _layer, _pSequenceEl, currNode.m_subtree, _headPosition, _lastHeadPosition, _headDirection, track.m_tracks, _sequence);
        }

        // Pop matrix
        WebGL_SetMatrix(MATRIX_WORLD, mWorld);

        // This can be null if it wasn't evaluated, e.g. parameter tracks are not evaluated
        if (currNode != null)
        {
            currNode = currNode.m_next;
		}
		
		g_SeqStack.pop();
    }
};

yyRoom.prototype.HandleSequenceGraphic = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence) {

    var keyframeStore = _track.m_keyframeStore;

    var keyframeIndex = keyframeStore.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
    if (keyframeIndex == -1) return;

    var graphicKeyframe = keyframeStore.keyframes[keyframeIndex];
    var spriteIndex = graphicKeyframe.m_channels[0].m_spriteIndex;

    var sprite = g_pSpriteManager.Sprites[spriteIndex];

    // Compute which image index should be drawn based on the current position along the sequence
    var imageindex = 0;
    if(sprite.GetCount() > 1)
    {
        // Figure out the current head position relative to the start of this key
        // Clamp both the positions to the key extents
        var subHeadPos = Math.max(_headPosition, graphicKeyframe.m_key);
        subHeadPos = Math.min(subHeadPos, graphicKeyframe.m_key + keyframeStore.GetKeyFrameLength(keyframeIndex, _sequence.m_length));
        var relHeadPos = subHeadPos - graphicKeyframe.m_key;

        // Now rescale based on the relative playback speeds of this sprite and it's parent sequence
        var timescale = 1.0;
        var spriteSeq = sprite.sequence;
        if (spriteSeq != null)
        {
            if (spriteSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
                timescale = spriteSeq.m_playbackSpeed / _sequence.m_playbackSpeed;
            else
                //timescale = spriteSeq.m_playbackSpeed;
                timescale = spriteSeq.m_playbackSpeed * (g_GameTimer.GetFPS() / _sequence.m_playbackSpeed);
        }
        else if (sprite.playbackspeed != 0.0)
        {
            if (sprite.playbackspeedtype == ePlaybackSpeedType_FramesPerSecond)
                timescale = sprite.playbackspeed / _sequence.m_playbackSpeed;
            else timescale = sprite.playbackspeed;
        }

        relHeadPos *= timescale;
        if (_node.value.Overrides(eT_ImageSpeed))
        {
            var frameDist = _node.value.imageDistance; //evaluated frame distance at _head
            if( frameDist >=0 )
                relHeadPos = frameDist * timescale;
        }

        if (_node.value.Overrides(eT_ImageIndex))
        {
            // Explicitly set image index
            imageindex = _node.value.imageIndex;
            if (imageindex < 0) imageindex = 0;
            else if (imageindex >= sprite.GetCount()) imageindex = sprite.GetCount() - 1;
        }
        else if (spriteSeq != null)
        {
            // Need to handle cases the where the head positions cause the sequence to loop or ping-pong						
            var headDir = 1.0;
            if (_lastHeadPosition > _headPosition)
                headDir = -1.0;

            var tmp = { headPosition: relHeadPos, headDirection: headDir, finished: false };
            HandleSequenceWrapping(spriteSeq, tmp);
            relHeadPos = tmp.headPosition;
            headDir = tmp.headDirection;

            // Figure out which keyframe we're on
            // There should only be one track and it should be a sprite frames track
            if ((spriteSeq.m_tracks != null) && (spriteSeq.m_tracks[0].m_type == eSTT_SpriteFrames))
            {
                var track = spriteSeq.m_tracks[0]; //CSequenceSpriteFramesTrack
                var spriteFrameKeyframe = track.m_keyframeStore.GetKeyframeAtFrame(relHeadPos, spriteSeq.m_length);

                if (spriteFrameKeyframe == null) imageindex = -1;		// no key at this time		
                else imageindex = spriteFrameKeyframe.m_channels[0].m_imageIndex;
            }
        }
        else
        {
            imageindex = relHeadPos;
            if (imageindex < 0)
            {
                imageindex = -imageindex;
                imageindex = imageindex % sprite.GetCount();
                if (imageindex > 0) imageindex = sprite.GetCount() - imageindex;
            }
            else if (imageindex >= sprite.GetCount())
            {
                imageindex = imageindex % sprite.GetCount();
            }
        }
    }

    // Color transform
    var mul = _node.value.colorMultiply;
    var add = _node.value.colorAdd;
    var r = Math.min(255, ((mul[0] + add[0]) * (_pSequenceEl.m_imageBlend & 0xff)));
    var g = Math.min(255, ((mul[1] + add[1]) * ((_pSequenceEl.m_imageBlend >> 8) & 0xff)));
    var b = Math.min(255, ((mul[2] + add[2]) * ((_pSequenceEl.m_imageBlend >> 16) & 0xff)));
    var drawcol = (Math.max(0, r))
				| (Math.max(0, g) << 8)
                | (Math.max(0, b) << 16);
    var a = Math.min(1, (mul[3] + add[3]) * _pSequenceEl.m_imageAlpha);

    // If overriding width,height of the graphic, set scale accordingly based on source
    var xscale = 1, yscale = 1;
    var xorig = sprite.xOrigin, yorig = sprite.yOrigin;

    var oldworldmat;
    var restorematrix = false;

    if ((g_webGL) && (sprite.nineslicedata != null) && (sprite.nineslicedata.enabled == true))
    {
        var spriteScaleX = Math.sqrt((_node.value.matrix.m[0] * _node.value.matrix.m[0]) + (_node.value.matrix.m[1] * _node.value.matrix.m[1]));
        var spriteScaleY = Math.sqrt((_node.value.matrix.m[4] * _node.value.matrix.m[4]) + (_node.value.matrix.m[5] * _node.value.matrix.m[5]));

        if ((spriteScaleX < 0.999) || (spriteScaleX > 1.001) ||
			(spriteScaleY < 0.999) || (spriteScaleY > 1.001))
        {
			restorematrix = true;						

            xscale = spriteScaleX;
            yscale = spriteScaleY;

            xorig *= spriteScaleX;
            yorig *= spriteScaleY;
            
            oldworldmat = WebGL_GetMatrix(MATRIX_WORLD);
            var normalisedworldmat = new Matrix(oldworldmat);
            normalisedworldmat.m[0] /= xscale;
            normalisedworldmat.m[1] /= xscale;

            normalisedworldmat.m[4] /= yscale;
            normalisedworldmat.m[5] /= yscale;
            
            WebGL_SetMatrix(MATRIX_WORLD, normalisedworldmat);
        }
    }


    //if (_node.value.Overrides(eT_Width)) {
    //    xscale = _node.value.width / (sprite.width <= 0 ? 1 : sprite.width);
    //    xorig = sprite.xOrigin * xscale;
    //}
    //if (_node.value.Overrides(eT_Height)) {
    //    yscale = _node.value.height / (sprite.height <= 0 ? 1 : sprite.height);
    //    yorig = sprite.yOrigin * yscale;
    //}

    if (!g_webGL)
    {
        // extract sprite rotation, scale, and translation from the world matrix
        var worldMatrix = g_Matrix[MATRIX_WORLD];
        var spriteRotationZ = Math.atan2(worldMatrix.m[1], worldMatrix.m[0]) * (-180 / Math.PI);
        var spriteScaleX = Math.sqrt(Math.pow(worldMatrix.m[0], 2) + Math.pow(worldMatrix.m[1], 2)) * xscale;
        var spriteScaleY = Math.sqrt(Math.pow(worldMatrix.m[4], 2) + Math.pow(worldMatrix.m[5], 2)) * yscale;
        //var spritePosX = worldMatrix.m[12] + _layer.m_xoffset + (xorig * spriteScaleX);
        //var spritePosY = worldMatrix.m[13] + _layer.m_yoffset + (yorig * spriteScaleY);

        var posvec = new Vector3(xorig, yorig, 0);
        var transposvec = worldMatrix.TransformVec3(posvec);
        var spritePosX = transposvec.X;
        var spritePosY = transposvec.Y;

        // Set the world matrix to the identity while rendering as the world matrix is
        // used within yySprite.Draw to calculate the culling boundaries. Since we are rendering
        // directly in world space already, we don't require the boundaries to be shifted in this case.
        WebGL_SetMatrix(MATRIX_WORLD, new Matrix());

        sprite.Draw(imageindex, spritePosX, spritePosY, spriteScaleX, spriteScaleY, spriteRotationZ, drawcol, Math.max(0, a));

        // Reset the world matrix
        WebGL_SetMatrix(MATRIX_WORLD, worldMatrix);
    }
    else
    {
        sprite.Draw(imageindex, _layer.m_xoffset + xorig, _layer.m_yoffset + yorig, xscale, yscale, 0, drawcol, Math.max(0, a));
    }

    if (restorematrix)
    {
        WebGL_SetMatrix(MATRIX_WORLD, oldworldmat);
    }
};


yyRoom.prototype.HandleSequenceSequence = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence) {

    // Get the keyframe store to use
    var keyframeStore = _track.m_keyframeStore;

	var startkeys = [];
	var endkeys = [];
	var numkeygroups = 1, offset = 0;

	var sequencekeyindex = keyframeStore.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
	if (sequencekeyindex == -1)
		return;

	startkeys[0] = endkeys[0] = sequencekeyindex;

	/*
    // Since the sequences referenced by this track may contain object instances which have draw events, we can't afford to miss any out	
    // Need to handle ping-pong and looping of the parent track too

    // Find key ranges we need to evaluate
    // Currently we don't handle more than a time difference longer than the sequence length per frame
    // which isn't ideal - need to fix
    var startkeys = [];
    var endkeys = [];
    var havekeys = GetTrackKeyRanges(_headPosition, _lastHeadPosition, _headDirection, 1.0, _track, _sequence, startkeys, endkeys);	
    if (!havekeys) return;

    // Currently only support embedded sequences that are on the same layer as the parent
    // Run through our keys

    var numkeygroups = 1, offset = 0;
    if (startkeys[1] != -1) numkeygroups = 2;
    if (startkeys[0] == -1) offset = 1;*/

    for (var k = offset; k < numkeygroups; k++)
    {
        var startkey = startkeys[k];
        var endkey = endkeys[k];

        for (var i = startkey; i <= endkey; i++)	// note the <=
        {
			var pKey = keyframeStore.keyframes[i];
			var pKeyChan = pKey.m_channels[0];
            var seqid = pKeyChan.m_index;

            var pSubSeq = g_pSequenceManager.GetSequenceFromID(seqid);
			if (pSubSeq == null) continue;
			
			g_SeqStack.push(pKey);
			g_SeqStack.push(pKeyChan);
			g_SeqStack.push(pSubSeq);

            //if (!requiresfinegrainedeval)	// handle this logic when we've got tracks that can't miss any frames (i.e. code or event tracks)
            {
                // Check to see if the playhead is within the scope of this key
                // Get length of key
                var len;
                if (pKey.m_stretch) {
                    if (i >= keyframeStore.numKeyframes - 1) len = _sequence.m_length - pKey.m_key;
                    else len = keyframeStore.keyframes[i + 1].m_key - pKey.m_key;
                }
                else len = pKey.m_length;

                if ((_headPosition >= pKey.m_key) && (_headPosition < (pKey.m_key + len)))
                if ((Math.floor(_headPosition) >= pKey.m_key) && (Math.floor(_headPosition) < (pKey.m_key + len)))
                {
                    // We don't push a matrix for nested sequences because each
                    // element already has the appropriate matrix to represent themselves
                    DirtyRoomExtents();

                    // Figure out the current and last head positions relative to the start of this key
                    // Clamp both the positions to the key extents
                    var subHeadPos = Math.max(_headPosition, pKey.m_key);
                    var subLastHeadPos = Math.max(_lastHeadPosition, pKey.m_key);
                    subHeadPos = Math.min(subHeadPos, pKey.m_key + (len - 1));
                    subLastHeadPos = Math.min(subLastHeadPos, pKey.m_key + (len - 1));

                    var relHeadPos = subHeadPos - pKey.m_key;
                    var relLastHeadPos = subLastHeadPos - pKey.m_key;

                    // Now rescale based on the relative playback speeds of this sequence and it's parent
                    var timescale = 1.0;
                    if (_sequence.m_playbackSpeed != 0.0)
                    {
                        if(_sequence.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
                            timescale = pSubSeq.m_playbackSpeed / _sequence.m_playbackSpeed;
                        else timescale = pSubSeq.m_playbackSpeed;
                    }

                    if (_node.value.Overrides(eT_ImageSpeed)) {
                        // Multiply by overridden image speed
                        timescale *= _node.value.imageSpeed;
                    }

                    relHeadPos *= timescale;
                    relLastHeadPos *= timescale;

                    // Need to handle cases the where the head positions cause the sequence to loop or ping-pong						
                    var headDir = 1.0;
                    if (_lastHeadPosition > _headPosition) headDir = -1.0;

                    var tmp = { headPosition: relHeadPos, headDirection: headDir, finished: false };
                    HandleSequenceWrapping(pSubSeq, tmp);
                    relHeadPos = tmp.headPosition;
                    headDir = tmp.headDirection;

                    // Now process the subtracks of this sequence
					this.DrawSequence(_rect, _layer, _pSequenceEl, _node.m_subtree, relHeadPos, relLastHeadPos, headDir, pSubSeq, true);
                }
			}
			
			g_SeqStack.pop();
			g_SeqStack.pop();
			g_SeqStack.pop();
        }
    }
};


function ClippingMaskState()
{
	this.StencilRef = 0xCAFEBABE;
	this.StencilEnable = 0xCAFEBABE;
	this.StencilFunc = 0xCAFEBABE;
	this.StencilPass = 0xCAFEBABE;
	this.ColourWriteEnable = 0xCAFEBABE;
	this.ZWriteEnable = 0xCAFEBABE;
	this.AlphaTestEnable = 0xCAFEBABE;
	this.AlphaRef = 0xCAFEBABE;
	this.AlphaFunc = 0xCAFEBABE;
}

ClippingMaskState.prototype.Apply = function()
{
	if(this.StencilRef != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilRef, this.StencilRef);
	if(this.StencilEnable != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilEnable, this.StencilEnable);
	if(this.StencilFunc != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilFunc, this.StencilFunc);
	if(this.StencilPass != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, this.StencilPass);
	if(this.ColourWriteEnable != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, this.ColourWriteEnable);
	if(this.ZWriteEnable != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, this.ZWriteEnable);
	if(this.AlphaTestEnable != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, this.AlphaTestEnable);
	if(this.AlphaRef != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, this.AlphaRef);
	if(this.AlphaFunc != 0xCAFEBABE) g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, this.AlphaFunc);
};

ClippingMaskState.prototype.Save = function()
{
	this.StencilRef = g_webGL.RSMan.GetRenderState(yyGL.RenderState_StencilRef);
	this.StencilEnable = g_webGL.RSMan.GetRenderState(yyGL.RenderState_StencilEnable);
	this.StencilFunc = g_webGL.RSMan.GetRenderState(yyGL.RenderState_StencilFunc);
	this.StencilPass = g_webGL.RSMan.GetRenderState(yyGL.RenderState_StencilPass);
	this.ColourWriteEnable = g_webGL.RSMan.GetRenderState(yyGL.RenderState_ColourWriteEnable);
	this.ZWriteEnable = g_webGL.RSMan.GetRenderState(yyGL.RenderState_ZWriteEnable);
	this.AlphaTestEnable = g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaTestEnable);
	this.AlphaRef = g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaRef);
	this.AlphaFunc = g_webGL.RSMan.GetRenderState(yyGL.RenderState_AlphaFunc);
};

g_clippingMaskStack = [];
g_globalClippingMaskState = null;
g_SeqClippingMaskDepth = 0;

yyRoom.prototype.HandleSequenceClipMask = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence)
{
	var maskTrack = null;
	var subjectTrack = null;
	var maskNode = null;
	var subjectNode = null;

	// Find mask and subject tracks as immediate children of this track
	var currentNode = _node.m_subtree == null ? null : _node.m_subtree;
	for(var i = 0; i < _track.m_tracks.length; i++) {
		var subtrack = _track.m_tracks[i];
		if(subtrack.m_type == eSTT_ClipMask_Mask) {
			maskTrack = subtrack;
			maskNode = currentNode;
			if(subjectTrack != null) break;
		}
		else if(subtrack.m_type == eSTT_ClipMask_Subject) {
			subjectTrack = subtrack;
			subjectNode = currentNode;
			if(maskTrack != null) break;
		}
		currentNode = currentNode.m_next;
	}

	if (g_SeqClippingMaskDepth == 0)
	{
		g_webGL.RSMan.SaveStates();
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilEnable, true);
	}

	// Setup mask states

	// Always alpha test
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, true);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, 0); // we want colour parameters on the clipping mask to apply to the result of the clipping mask (subject) not the mask (which this simulates)
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, yyGL.CmpFunc_CmpGreater);

	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilEnable, true);				
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilFunc, yyGL.CmpFunc_CmpEqual);	

	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, 0);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, false);			
	
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilRef, g_SeqClippingMaskDepth);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, yyGL.StencilOp_Incr);

	g_SeqClippingMaskDepth++;

	// Draw mask
	g_SeqStack.push(maskTrack);
	this.DrawTrackList(_rect, _layer, _pSequenceEl, maskNode.m_subtree, _headPosition, _lastHeadPosition, _headDirection, maskTrack.m_tracks, _sequence);
	g_SeqStack.pop();

	g_SeqClippingMaskDepth--;

	if (g_SeqClippingMaskDepth == 0)
	{
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, g_webGL.RSMan.PeekPrevState(yyGL.RenderState_ColourWriteEnable));
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, g_webGL.RSMan.PeekPrevState(yyGL.RenderState_ZWriteEnable));

		// Apply global alpha test state		
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, g_webGL.RSMan.PeekPrevState(yyGL.RenderState_AlphaTestEnable));
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, g_webGL.RSMan.PeekPrevState(yyGL.RenderState_AlphaRef));
		g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, g_webGL.RSMan.PeekPrevState(yyGL.RenderState_AlphaFunc));
	}

	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilRef, g_SeqClippingMaskDepth + 1);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, yyGL.StencilOp_Keep);

	// Draw subject/children
	g_SeqStack.push(subjectTrack);
	this.DrawTrackList(_rect, _layer, _pSequenceEl, subjectNode.m_subtree, _headPosition, _lastHeadPosition, _headDirection, subjectTrack.m_tracks, _sequence);
	g_SeqStack.pop();

	// Cleanup mask	
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, yyGL.StencilOp_Decr);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, 0);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, 0);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, true);
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, 0); // we want colour parameters on the clipping mask to apply to the result of the clipping mask (subject) not the mask (which this simulates) 
	g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, yyGL.CmpFunc_CmpGreater);

	g_SeqClippingMaskDepth++;

	// Draw mask
	g_SeqStack.push(maskTrack);
	this.DrawTrackList(_rect, _layer, _pSequenceEl, maskNode.m_subtree, _headPosition, _lastHeadPosition, _headDirection, maskTrack.m_tracks, _sequence);
	g_SeqStack.pop();

	g_SeqClippingMaskDepth--;

	if (g_SeqClippingMaskDepth == 0)
	{
		g_webGL.RSMan.RestoreStates();
	}
};

yyRoom.prototype.HandleSequenceInstance = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence)
{
	// Get the keyframe store to use
	var keyframeStore = _track.m_keyframeStore;

	// Get sprite ID for this track
	var instancekeyindex = keyframeStore.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
	if (instancekeyindex == -1)
		return;

	var pInstKey = keyframeStore.keyframes[instancekeyindex];

	if (pInstKey != null)
	{
		g_SeqStack.push(pInstKey);

		var pSeqInst = g_pSequenceManager.GetInstanceFromID(_pSequenceEl.m_instanceIndex);
		if (pSeqInst != null)
		{
			var oldworldmat = WebGL_GetMatrix(MATRIX_WORLD);

			var idmat = new Matrix();
			idmat.unit();
			WebGL_SetMatrix(MATRIX_WORLD, idmat);

			for (var channelKey in pInstKey.m_channels)
			{
				var ppKey = pInstKey.m_channels[channelKey];

				g_SeqStack.push(ppKey);

				// Look up instance entry associated with this key
				var pInstInfo = pSeqInst.trackInstances[CHashMapCalculateHash(g_SeqStack)];

				if (pInstInfo != null)
				{
					//if (pInstInfo.ownedBySequence) // Now the sequence potentially handles drawing of *all* instances it controls (including those created externally and used to override bits of the sequence) - fixes https://bugs.opera.com/browse/GM-3874
					{
						var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
						if ((pInst != null) && (pInst.GetDrawnBySequence()))
						{
							if (!(pInst.marked || (!pInst.active) || (!pInst.visible)))
							{
								// Perform drawing event, if we couldn't, then draw it "simply"
								//if (!pInst.PerformEvent(EVENT_DRAW, 0, pInst, pInst))
								if( !pInst.REvent[EVENT_DRAW] )
								{
									// Otherwise just DRAW it..
									var pSprite = g_pSpriteManager.Get(pInst.sprite_index);
									if (pSprite)
									{
										if ((pInst.image_xscale == 1.0) && (pInst.image_yscale == 1.0) && (pInst.image_angle == 0.0) && (pInst.image_blend == 0xffffff)) // &&  (pInst.image_alpha == 1.0))
										{
											pSprite.DrawSimple(pInst.image_index, pInst.x, pInst.y, pInst.image_alpha * g_GlobalAlpha);
										}
										else
										{
											pSprite.Draw(pInst.image_index,
															pInst.x, pInst.y,
															pInst.image_xscale, pInst.image_yscale,
															pInst.image_angle,
															ConvertGMColour(pInst.image_blend),
															pInst.image_alpha * g_GlobalAlpha
														);
										}
									}
								}
								else
								{
									// If theres a script for drawing, do that instead...
									g_skeletonDrawInstance = pInst;
									pInst.PerformEvent(EVENT_DRAW, 0, pInst, pInst);
									g_skeletonDrawInstance = null;
								}
							}
						}
					}
				}

				g_SeqStack.pop();
			}

			WebGL_SetMatrix(MATRIX_WORLD, oldworldmat);
		}

		g_SeqStack.pop();
	}	
};

yyRoom.prototype.HandleSequenceParticle = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence) {

	var keyframes = _track.m_keyframeStore;
	var keyframeCurrent = null;

	// Find the current keyframe
	var index = keyframes.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
	if (index != -1)
	{
		var keyframe = keyframes.keyframes[index];
		if (keyframe != null)
		{
			keyframeCurrent = keyframe.m_channels[0];
		}
	}
	
	if (_pSequenceEl.m_instanceIndex == -1) return;

	var _pInst = g_pSequenceManager.GetInstanceFromID(_pSequenceEl.m_instanceIndex);

	// If keyframe changed, destroy the old particle system
	var keyframeLast = _pInst.m_trackIDToLastKeyframe[_track.id];
	if (keyframeLast !== undefined && keyframeLast !== keyframeCurrent)
	{
		var psLast = _pInst.m_trackIDToPS[_track.id];
		if (psLast !== undefined && psLast != -1)
		{
			ParticleSystem_Destroy(psLast);
		}
		_pInst.m_trackIDToPS[_track.id] = -1;
	}

	var ps = -1;
	var particleSystem = _pInst.m_trackIDToPS[_track.id];
	if (particleSystem === undefined || particleSystem === -1)
	{
		// Create a new particle system from the current key
		if (keyframeCurrent && keyframeCurrent.particleSystemIndex != -1)
		{
			ps = CParticleSystem.Get(keyframeCurrent.particleSystemIndex).MakeInstance();
			ParticleSystem_AutomaticDraw(ps, false);
			ParticleSystem_AutomaticUpdate(ps, false);
			_pInst.m_trackIDToPS[_track.id] = ps;
		}
	}
	else
	{
		// The particle system already exists
		ps = particleSystem;
	}

	// Draw the particles
	if (ps != -1)
	{
		var mul = _node.value.colorMultiply;
		var add = _node.value.colorAdd;
		var r = Math.min(255, ((mul[0] + add[0]) * (_pSequenceEl.m_imageBlend & 0xff)));
		var g = Math.min(255, ((mul[1] + add[1]) * ((_pSequenceEl.m_imageBlend >> 8) & 0xff)));
		var b = Math.min(255, ((mul[2] + add[2]) * ((_pSequenceEl.m_imageBlend >> 16) & 0xff)));
		var drawcol = (Math.max(0, r))
					| (Math.max(0, g) << 8)
					| (Math.max(0, b) << 16);
		var a = Math.min(1, (mul[3] + add[3]) * _pSequenceEl.m_imageAlpha);

		ParticleSystem_Draw(ps, drawcol, a);
	}

	// Keep track of the last keyframe played
	_pInst.m_trackIDToLastKeyframe[_track.id] = keyframeCurrent;
};

yyRoom.prototype.HandleSequenceText = function (_rect, _layer, _pSequenceEl, _node, _track, _headPosition, _lastHeadPosition, _headDirection, _sequence) {

    var keyframeStore = _track.m_keyframeStore;

    var keyframeIndex = keyframeStore.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
    if (keyframeIndex == -1) return;

    var pTextKey = keyframeStore.keyframes[keyframeIndex];

	var text = pTextKey.m_channels[0].text;
	if (text == null)
		return;

	var wrap = pTextKey.m_channels[0].wrap;
	var alignment = pTextKey.m_channels[0].alignment;
	var fontID = pTextKey.m_channels[0].fontIndex;

	var oldFontID = draw_get_font();
	var oldCol = draw_get_color();
	var oldAlpha = draw_get_alpha();

    // Color transform
    var mul = _node.value.colorMultiply;
    var add = _node.value.colorAdd;
    var r = Math.min(255, ((mul[0] + add[0]) * (_pSequenceEl.m_imageBlend & 0xff)));
    var g = Math.min(255, ((mul[1] + add[1]) * ((_pSequenceEl.m_imageBlend >> 8) & 0xff)));
    var b = Math.min(255, ((mul[2] + add[2]) * ((_pSequenceEl.m_imageBlend >> 16) & 0xff)));
    var drawcol = (Math.max(0, r))
				| (Math.max(0, g) << 8)
                | (Math.max(0, b) << 16);
    var a = Math.min(1, (mul[3] + add[3]) * _pSequenceEl.m_imageAlpha);

	draw_set_font(fontID);
	draw_set_color(drawcol);
	draw_set_alpha(a);

	var frameWidth = -1;
	var frameHeight = -1;
	if (_node.value.paramset & (1 << eT_FrameSize))
	{
		frameWidth = _node.value.FrameSizeX;
		frameHeight = _node.value.FrameSizeY;
	}	

	var charSpacing = 0.0;
	if (_node.value.paramset & (1 << eT_CharacterSpacing))
	{
		charSpacing = _node.value.CharacterSpacing;
	}

	var lineSpacing = 0.0;
	if (_node.value.paramset & (1 << eT_LineSpacing))
	{
		lineSpacing = _node.value.LineSpacing;
	}

	var paraSpacing = 0.0;
	if (_node.value.paramset & (1 << eT_ParagraphSpacing))
	{
		paraSpacing = _node.value.ParagraphSpacing;
	}

	var pFontParams = _node.value.pFontEffectParams;

	g_pFontManager.SetFont();
	var sldata = g_pFontManager.Split_TextBlock_IDEstyle(text, frameWidth, frameHeight, alignment, wrap, charSpacing, lineSpacing, paraSpacing);

	var mask = wrap && ((sldata.totalW > frameWidth + 2) || (sldata.totalH > frameHeight + 2));
	if (mask)
	{
		if (g_webGL)
		{
			// Set up stencil
			if (g_clippingMaskStack == null || g_clippingMaskStack.length == 0)
			{
				// Get current render states to restore to when we're done
				if (g_globalClippingMaskState == null) g_globalClippingMaskState = new ClippingMaskState();
				g_globalClippingMaskState.Save();
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilEnable, true);
			}

			// Render to stencil buffer
			var state = new ClippingMaskState();
			state.StencilFunc = yyGL.CmpFunc_CmpGreater;
			state.StencilPass = yyGL.StencilOp_Replace;
			state.ColourWriteEnable = 0;
			state.ZWriteEnable = 0;
			state.StencilRef = g_clippingMaskStack.length + 1;
			state.Apply();
			// So we can restore this state again, for nested clipping masks
			g_clippingMaskStack.push(state);


			// Always alpha test
			if (g_globalClippingMaskState.AlphaTestEnable == 0)
			{
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, true);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, 0); // we want colour parameters on the clipping mask to apply to the result of the clipping mask (subject) not the mask (which this simulates)
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, yyGL.CmpFunc_CmpGreater);
			}

			// Draw mask
			var numVerts = 4;
			var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRISTRIP, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
			var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            
			var currVert = stride * pBuff.Current;
			pBuff.Current += numVerts;

			var pCoords = pBuff.Coords;
			var pColours = pBuff.Colours;		
					
			pCoords[currVert + 0] = 0.0;
			pCoords[currVert + 1] = 0.0;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = 0.0;
			pCoords[currVert + 1] = frameHeight;// + 1;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = frameWidth;// + 1;
			pCoords[currVert + 1] = 0.0;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = frameWidth;// + 1;
			pCoords[currVert + 1] = frameHeight;// + 1;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;												

			// Increase stencil buffer
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, yyGL.StencilOp_Incr);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilFunc, g_clippingMaskStack.length < 2 ? yyGL.CmpFunc_CmpLessEqual : yyGL.CmpFunc_CmpEqual);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, g_clippingMaskStack.length < 2 ? g_globalClippingMaskState.ColourWriteEnable : 0);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, g_clippingMaskStack.length < 2 ? g_globalClippingMaskState.ZWriteEnable : 0);

			// Apply global alpha test state
			if (g_globalClippingMaskState.AlphaTestEnable == 0)
			{
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, g_globalClippingMaskState.AlphaTestEnable);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, g_globalClippingMaskState.AlphaRef);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, g_globalClippingMaskState.AlphaFunc);
			}
		}
		else
		{
			worldMatrix = g_Matrix[MATRIX_WORLD];

			graphics.save();

			var posvec0 = new Vector3(0, 0, 0);
			var posvec1 = new Vector3(0, frameHeight, 0);
			var posvec2 = new Vector3(frameWidth, frameHeight, 0);
			var posvec3 = new Vector3(frameWidth, 0, 0);

			var transposvec0 = worldMatrix.TransformVec3(posvec0);
			var transposvec1 = worldMatrix.TransformVec3(posvec1);
			var transposvec2 = worldMatrix.TransformVec3(posvec2);
			var transposvec3 = worldMatrix.TransformVec3(posvec3);

			// Clip the output to the on-screen rectangle boundaries.
			graphics.beginPath();
			graphics.moveTo(transposvec0.X, transposvec0.Y);
			graphics.lineTo(transposvec1.X, transposvec1.Y);
			graphics.lineTo(transposvec2.X, transposvec2.Y);
			graphics.lineTo(transposvec3.X, transposvec3.Y);
			graphics.closePath();    
			graphics.clip();
		}
	}
	
	g_pFontManager.GR_StringList_Draw_IDEstyle(sldata.sl, 0.0, 0.0, charSpacing, 0.0, sldata.totalW, pFontParams);

	if (mask)
	{
		if (g_webGL)
		{
			// Always alpha test
			if (g_globalClippingMaskState.AlphaTestEnable == 0)
			{
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaTestEnable, true);
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaRef, 0); // we want colour parameters on the clipping mask to apply to the result of the clipping mask (subject) not the mask (which this simulates)
				g_webGL.RSMan.SetRenderState(yyGL.RenderState_AlphaFunc, yyGL.CmpFunc_CmpGreater);
			}

			// Zero stencil buffer
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilPass, yyGL.StencilOp_Zero);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_StencilFunc, yyGL.CmpFunc_CmpEqual);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_ColourWriteEnable, 0);
			g_webGL.RSMan.SetRenderState(yyGL.RenderState_ZWriteEnable, 0);

			// Draw mask again
			var numVerts = 4;
			var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRISTRIP, null, g_webGL.VERTEX_FORMAT_2D, numVerts);
			var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            
			var currVert = stride * pBuff.Current;
			pBuff.Current += numVerts;

			var pCoords = pBuff.Coords;
			var pColours = pBuff.Colours;		
					
			pCoords[currVert + 0] = 0.0;
			pCoords[currVert + 1] = 0.0;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = 0.0;
			pCoords[currVert + 1] = frameHeight + 1;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = frameWidth + 1;
			pCoords[currVert + 1] = 0.0;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;
			currVert += stride;	

			pCoords[currVert + 0] = frameWidth + 1;
			pCoords[currVert + 1] = frameHeight + 1;
			pCoords[currVert + 2] = GR_Depth;
			pColours[currVert] = 0xffffffff;		

			// Pop and apply the render state for this track
			var restore = g_clippingMaskStack.pop();
			restore.Apply();
			//delete restore;

			// Restore global render state, we're out of the clipping mask track
			if (g_clippingMaskStack.length == 0) {
				g_globalClippingMaskState.Apply();
			}
		}
		else
		{
			graphics.restore();
		}
	}

	draw_set_font(oldFontID);
	draw_set_color(oldCol);
	draw_set_alpha(oldAlpha);
};



yyRoom.prototype.DrawRoomLayers = function(_rect){

    var oldtype = Current_Event_Type;
    var oldnumb = Current_Event_Number;

    Current_Event_Type = EVENT_DRAW;
    Current_Event_Number = 0;

     var player,el,i,pool;
	    pool = this.m_Layers.pool;
	    for (i = pool.length - 1; i >= 0; i--)
	    {
	        player =pool[i];
	        if(player===null || player.m_visible<=0)
	        {
	            continue;
	        }
	        
	        if (g_pLayerManager.IsDepthForced())
		    {
			    WebGL_d3d_set_depth_RELEASE(g_pLayerManager.GetForcedDepth());
		    }
		    else
		    {
			    WebGL_d3d_set_depth_RELEASE(player.depth);		
		    }		
	        
	        
	     //   GR_Depth = player.depth;
	        //TODO SetLayerShader
	        //TODO ExecuteLayerScript

			if (player.m_effectEnabled)
				ExecuteEffectFunction(player, EFFECT_LAYER_BEGIN_FUNC, EVENT_DRAW, 0);

	        SetLayerShader(player.m_shaderId);
	        ExecuteLayerScript(player.m_id, player.m_beginScript);
	        
	        for(var j=0;j<player.m_elements.length;j++)
	        {
	            el = player.m_elements.Get(j);
	            if(el!=null)
	            {
	                if(el.m_type === eLayerElementType_Background)
	                {
	                    this.DrawLayerBackgroundElement(_rect,player,el);
	                }
	                else if(el.m_type === eLayerElementType_Instance)
	                {
	                    this.DrawLayerInstanceElement(_rect,player,el);
	                }
	                else if(el.m_type === eLayerElementType_OldTilemap)
	                {
	                    this.DrawLayerOldTilemapElement(_rect,player,el);
	                }
	                else if(el.m_type === eLayerElementType_Sprite)
	                {
	                    this.DrawLayerSpriteElement(_rect,player,el,0,0,0);
	                }
	                else if(el.m_type === eLayerElementType_Tilemap)
	                {
	                    this.DrawLayerTilemapElement(_rect,player,el);
	                }   
					else if(el.m_type === eLayerElementType_ParticleSystem)
					{
						this.DrawLayerParticleSystem(_rect,player,el);
					}
					else if (el.m_type === eLayerElementType_Tile)
					{
						this.DrawLayerTileElement(_rect,player,el);
					}
					else if (el.m_type === eLayerElementType_Sequence)
					{
					    this.DrawLayerSequenceElement(_rect, player, el);
					}
	            }
	        }

	        ExecuteLayerScript(player.m_id, player.m_endScript);
	        ResetLayerShader(player.m_shaderId);

			if (player.m_effectEnabled)
				ExecuteEffectFunction(player, EFFECT_LAYER_END_FUNC, EVENT_DRAW, 0);
	    }

	    Current_Event_Type = oldtype;
	    Current_Event_Number = oldnumb;
};

// #############################################################################################
/// Function:<summary>
///             Draw everything actually "inside" the room
///          </summary>
///
/// In:		 <param name="_rect">Region to draw to</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoom.prototype.DrawTheRoom = function (_rect) {

	g_roomExtents = _rect;
    DirtyRoomExtents();
	if (this.m_showcolor)
	{
		Graphics_ClearScreen(ConvertGMColour(g_pBuiltIn.background_color));
	}
	else if(this.m_Layers!=null && this.m_Layers.length>0)
	{
		Graphics_ClearScreen(ConvertGMColour(0xfff7ffff));
	}

	this.ExecuteDrawEvent(_rect, EVENT_DRAW_BEGIN);

    if(this.m_Layers!=null && this.m_Layers.length>0)
    {
        //Drawing as layers
        this.DrawRoomLayers(_rect);
    }
   
    this.ExecuteDrawEvent(_rect, EVENT_DRAW_END);
	
};

// #############################################################################################
/// Property: <summary>
///           	Draw the user cursor
///           </summary>
// #############################################################################################
yyRoom.prototype.DrawUserCursor = function () {
	// Draw USER curser
	if (g_CurrentCursor >= 0)
	{
		var pSpr = g_pSpriteManager.Get(g_CurrentCursor);
		if (pSpr != null)
		{
			pSpr.Draw(g_CurrentCursorFrame, g_pIOManager.MouseX - g_CanvasRect.left, g_pIOManager.MouseY - g_CanvasRect.top, 1.0, 1.0, 0, 0xffffff, 1.0);
		}
		g_CurrentCursorFrame++;
		if (g_CurrentCursorFrame > pSpr.numb) g_CurrentCursorFrame -= pSpr.numb;
	}
};

// #############################################################################################
/// Property: <summary>
///           	Adds the effect layer id to the room
///           </summary>
// #############################################################################################
yyRoom.prototype.AddEffectLayerID = function (_id) {

	// First make sure the layer isn't already in the list
	var index = this.m_EffectLayerIDs.indexOf(_id);
	if(index != -1)
	{
		return;
	}

	// Okay, we didn't find it, so add it now
	this.m_EffectLayerIDs.push(_id);
	this.m_numEffectLayerIDs++;
};

// #############################################################################################
/// Property: <summary>
///           	Removes the effect layer id from the room
///           </summary>
// #############################################################################################
yyRoom.prototype.RemoveEffectLayerID = function (_id) {
	var index = this.m_EffectLayerIDs.indexOf(_id);
	if (index != -1)
	{
		this.m_EffectLayerIDs.splice(index, 1);
		this.m_numEffectLayerIDs--;
		return;
	}
};

// #############################################################################################
/// Property: <summary>
///           	Removes all effect layer id from the room
///           </summary>
// #############################################################################################
yyRoom.prototype.ClearEffectLayerIDs = function () {
	this.m_EffectLayerIDs.length = 0;
	this.m_numEffectLayerIDs = 0;
};

function ExecuteEffectFunction(_pLayer, _funcname, _etype, _enumb)
{
	if (_pLayer === null)
		return;

	if (_funcname === null)
		return;

	var effectVal = _pLayer.GetEffect();

	if (effectVal == null)
		return;

	var pEffectObj = g_pEffectsManager.GetEffectFromRValue(effectVal);

	if (pEffectObj == null)
		return;

	/*
	var oldobj = Current_Object;
	var oldtype = Current_Event_Type;
	var oldnumb = Current_Event_Number;
	Current_Object = _pLayer.m_id;                 // for debug and for inherited events
	Current_Event_Type = _etype;
	Current_Event_Number = _enumb;
	*/

	var funcId = "gml" + _funcname;
	if ((typeof g_var2obf !== "undefined") && (g_var2obf[_funcname] != undefined)) {
		funcId = g_var2obf[_funcname];
	}

	// Call effect script function
	if(pEffectObj[funcId] !== undefined)
	{
		pEffectObj[funcId](_pLayer.m_id);
	}

	/*
	Current_Object = oldobj;                 // for debug and for inherited events
	Current_Event_Type = oldtype;
	Current_Event_Number = oldnumb;
	*/
};

function ExecuteLayerScript(layerid,script)
{
    if(script != null)
    {
		var inst = g_pLayerManager.GetScriptInstance();
		if(inst === null)
		{
			var pScriptInst = new yyInstance(0, 0, 0, 0, false, true);
        	g_pLayerManager.SetScriptInstance(pScriptInst);
			inst = g_pLayerManager.GetScriptInstance();
		}

		inst.SetOnActiveLayer(true);
		inst.SetLayerID(layerid);
		script(inst ,inst);
		inst.SetOnActiveLayer(false);
    }
};

function SetLayerShader(shaderid)
{
    if(shaderid!=-1)
    {
        shader_set(shaderid);    
    
    }
};
function ResetLayerShader(shaderid)
{
    if(shaderid!=-1)
    {
        shader_reset();
    }
};
// #############################################################################################
/// Function:<summary>
///             Execute a draw event
///          </summary>
///
/// In:		 <param name="r">Rect to "fit" in</param>
// #############################################################################################
yyRoom.prototype.ExecuteDrawEvent = function (_rect, _event) {
	var pSprite, pInst, i, pool, pSprites;
	
	Current_Event_Type = _event;

	g_roomExtents = _rect;
	DirtyRoomExtents();
	
	if ((this.m_Layers.length > 0))
	{
	    //Layer eventing
	    var player,el;
	    pool = this.m_Layers.pool;
	    for (i = pool.length - 1; i >= 0; i--)
	    {
	        player =pool[i];
	        if(player==null || player.m_visible==false)
	        {
	            continue;
	        }

			Current_Event_Number = EVENT_DRAW_BEGIN;

			if (player.m_effectEnabled)
				ExecuteEffectFunction(player, EFFECT_LAYER_BEGIN_FUNC, EVENT_DRAW_BEGIN, 0);

	        SetLayerShader(player.m_shaderId);
	        ExecuteLayerScript(player.m_id, player.m_beginScript);
	        
	        for(var j=0;j<player.m_elements.length;j++)
	        {
	            el = player.m_elements.Get(j);
	            if(el!=null)
	            {
	                if(el.m_type === eLayerElementType_Instance)
	                {
	                    pInst = el.m_pInstance;
	                    if(pInst!=null)
	                    {
	                        if(!(pInst.marked || (!pInst.active) || (!pInst.visible)))
	                        {
	                            if (pInst.REvent[_event])
	                            {
	                                pInst.PerformEvent(_event, 0, pInst, pInst);
	                            }
	                        }
	                    }
	                }
	            }
	        }

			Current_Event_Number = EVENT_DRAW_END;
	       
	        ExecuteLayerScript(player.m_id,player.m_endScript);
	        ResetLayerShader(player.m_shaderId);

			if (player.m_effectEnabled)
				ExecuteEffectFunction(player, EFFECT_LAYER_END_FUNC, EVENT_DRAW_BEGIN, 0);
	    
	    }
	}
	else
	{
	
	
	    pool = this.m_Active.pool;
	    pSprites = g_pSpriteManager.Sprites;

	    for (i = pool.length - 1; i >= 0; i--)
	    {
		    pInst = pool[i];

		    // If this instance has been "marked", move to the next one - should really be a WHILE loop here instead of "continue"
		    if (pInst.marked || !pInst.visible) continue;


		    // Perform drawing event, if we couldn't, then draw it "simply"
		    if (pInst.REvent[_event])
		    {
		        pInst.PerformEvent(_event, 0, pInst, pInst);
		    }
	    }
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.PreDraw = function(r) {

    // 
	// PRE-Draw event - goes to back Buffer
	//
    g_pCurrentView = g_GUIView;
    g_pCurrentView.scaledportx = 0;
    g_pCurrentView.scaledporty = 0;
    g_pCurrentView.scaledportw = r.right;
    g_pCurrentView.scaledporth = r.bottom;
    g_pCurrentView.scaledportx2 = r.right;
    g_pCurrentView.scaledporty2 = r.bottom;
    g_pCurrentView.WorldViewScaleX = 1.0;
    g_pCurrentView.WorldViewScaleY = 1.0;
    Graphics_Save();
    {
        Graphics_SetViewPort(0, 0, r.right, r.bottom);
        Graphics_SetViewArea(0, 0, r.right, r.bottom, 0);
	    if (this.m_ClearDisplayBuffer && g_bUsingAppSurface) {
	        Graphics_ClearScreen(g_WindowColour);
	    }
        this.ExecuteDrawEvent(r, EVENT_DRAW_PRE);
    }
    Graphics_Restore();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.SetApplicationSurface = function () {
    
    if( g_bUsingAppSurface )
    {
        //Create Application Surface?
        if( (g_ApplicationSurface < 0) || !surface_exists(g_ApplicationSurface) )
        {
            g_ApplicationSurface = surface_create( g_ApplicationWidth, g_ApplicationHeight, eTextureFormat_A8R8G8B8 );
            g_pBuiltIn.application_surface = g_ApplicationSurface;
            debug("Application Surface created: w="+g_ApplicationWidth + ", h=" + g_ApplicationHeight );
        }
        //Resize the surface?
        if( g_NewApplicationSize )
        {
            g_NewApplicationSize = false;
            //surface_resize( g_ApplicationSurface, g_NewApplicationWidth, g_NewApplicationHeight );
            surface_create(g_NewApplicationWidth, g_NewApplicationHeight, eTextureFormat_A8R8G8B8, g_ApplicationSurface );
            g_ApplicationWidth = g_NewApplicationWidth;
		    g_ApplicationHeight = g_NewApplicationHeight;
		    debug("Application Surface resized: w=" + g_ApplicationWidth + ", h="+ g_ApplicationHeight );
		    SetCanvasSize();
        }
        
        // Set to use the application surface        
        //surface_set_target_system( g_ApplicationSurface );
        surface_set_target( g_ApplicationSurface );
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.DrawViews = function (r) {
    Graphics_Save();

    // Store off the room extents prior to handling views, which can change the global room extents and screw up GUI bounds checking
    var roomExtents = new YYRECT();
    roomExtents.Copy(g_roomExtents);


	if (g_isZeus)
	{
		UpdateDefaultCamera(0, 0, r.right,r.bottom,0);
	}
	
	g_DisplayScaleX = 1;
	g_DisplayScaleY = 1;
	this.SetApplicationSurface();

    this.UpdateViews();	

    // Get a "VIEW" array... and if we don't have one, supply the "fake" one.
	var pViews;
	if (!this.m_enableviews) {
	
		pViews = g_DefaultViewArray;
	
		Graphics_SetViewPort(0, 0, g_ApplicationWidth, g_ApplicationHeight);
         
		if (g_isZeus) {
			g_DefaultView.cameraID = g_DefaultCameraID;
		    UpdateDefaultCamera(0, 0, g_RunRoom.m_width, g_RunRoom.m_height, 0);
		}
		else {
		    Graphics_SetViewArea(0, 0, g_RunRoom.m_width, g_RunRoom.m_height, 0);
		}
	} 
	else {
	
		pViews = this.m_Views;
       
		
        if (this.m_ViewClearScreen) {
            Graphics_SetViewPort(0, 0, g_ApplicationWidth, g_ApplicationHeight);
            Graphics_SetViewArea(0, 0, g_ApplicationWidth, g_ApplicationHeight, 0 );
		    Graphics_ClearScreen(g_WindowColour); 		// In case the views don't cover the window
		}
	}    	
	

	var asx = g_AppSurfaceRect.w / g_ApplicationWidth;
	var asy = g_AppSurfaceRect.h / g_ApplicationHeight;
	var sx = g_DisplayScaleX;
	var sy = g_DisplayScaleY;
	
	Current_View = 0;	
	//if (this.m_enableviews) //do this always - we have a dummy view setup if not using views
	//{
	    for (var i = 0; i < pViews.length; i++)
	    {
		    g_pCurrentView = pViews[i];
		    if (g_pCurrentView.visible)
		    {
			    var graph = GlobalGraphicsHandle;
			    Graphics_Save();
			    {
			        if (g_pCurrentView.surface_id != -1)
			        {
			    	    surface_set_target_system(g_pCurrentView.surface_id);
			        } 
    		
			        //scaled port SHOULD BE port coords in final canvas space ( for canvas mouse -> view/world mouse coords )
		            //DO NOT want to use for SetViewPort as that should be in application surface coords
			        g_pCurrentView.scaledportx = g_pCurrentView.portx * sx * asx + g_AppSurfaceRect.x;
			        g_pCurrentView.scaledporty = g_pCurrentView.porty * sy * asy + g_AppSurfaceRect.y;
			        g_pCurrentView.scaledportw = g_pCurrentView.portw * sx * asx;
			        g_pCurrentView.scaledporth = g_pCurrentView.porth * sy * asy;
			        g_pCurrentView.scaledportx2 = g_pCurrentView.scaledportx + g_pCurrentView.scaledportw;
			        g_pCurrentView.scaledporty2 = g_pCurrentView.scaledporty + g_pCurrentView.scaledporth;
			        g_pCurrentView.WorldViewScaleX = g_pCurrentView.scaledportw / g_pCurrentView.worldw;
			        g_pCurrentView.WorldViewScaleY = g_pCurrentView.scaledporth / g_pCurrentView.worldh;


			        //view port in app surface...
			        if (g_pCurrentView.surface_id != -1)
			        {
			            //fill surface with view
			            Graphics_SetViewPort(0, 0, surface_get_width(g_pCurrentView.surface_id), surface_get_height(g_pCurrentView.surface_id) );
			        }
			        else
			        {
                        // This appears to be overriding the application surface dimensions and view port
			        	Graphics_SetViewPort( g_pCurrentView.portx * sx, g_pCurrentView.porty * sy,
                                              g_pCurrentView.portw * sx, g_pCurrentView.porth * sy );
                    }

			        if(g_isZeus/* && (g_webGL!=null)*/)
			        {
			            g_pCameraManager.SetActiveCamera(g_pCurrentView.cameraID);
			            var pCam = g_pCameraManager.GetActiveCamera();
			            if(pCam!=null)
			            {
			                pCam.Begin();						
			                pCam.ApplyMatrices();												
			            }
			        }
			        else
			            Graphics_SetViewArea(g_pCurrentView.worldx, g_pCurrentView.worldy, g_pCurrentView.worldw, g_pCurrentView.worldh, g_pCurrentView.angle);

                    if(/*(g_webGL==null) || */(!g_isZeus))
                    {
			            // no Angle allowed on view....unless it's webgl...
			            if( Math.abs( g_pCurrentView.angle) < 0.001)
			            {
			                r.left = g_pCurrentView.worldx;
			                r.top = g_pCurrentView.worldy;
			                r.right = g_pCurrentView.worldx + g_pCurrentView.worldw;
			                r.bottom = g_pCurrentView.worldy + g_pCurrentView.worldh;
			            } 
			            else
			            {
			                // We need a larger area here to make sure we draw enough - calculate extents from rotation
			                var rad = g_pCurrentView.angle * (Pi/180);
			                var s = Math.abs( Math.sin(rad));
			                var c = Math.abs( Math.cos(rad));
			                var ex = (c * g_pCurrentView.worldw) + (s * g_pCurrentView.worldh);
			                var ey = (s * g_pCurrentView.worldw) + (c * g_pCurrentView.worldh);
			                r.left = g_pCurrentView.worldx + (g_pCurrentView.worldw - ex)/2;
			                r.right = g_pCurrentView.worldx + (g_pCurrentView.worldw + ex)/2;
			                r.top = g_pCurrentView.worldy + (g_pCurrentView.worldh - ey)/2; 
			                r.bottom = g_pCurrentView.worldy + (g_pCurrentView.worldh + ey)/2; 
			            }
			            g_pBuiltIn.view_current = i;
			            this.DrawTheRoom(r);
			        }
			        else
			        {

			            g_pBuiltIn.view_current = i;
			            this.DrawTheRoom(g_roomExtents);
			        }


			        if (g_pCurrentView.surface_id != -1) {
			            surface_reset_target();
			        }
			        Current_View++;
    			    
    			  
			        if (g_isZeus)
			        {			
    			    
			            var pCam = g_pCameraManager.GetActiveCamera();
			            if(pCam!=null)
			            {
			                pCam.End(); 
			            }			    
				        g_pCameraManager.SetActiveCamera(-1);		// no active camera
			        }

			    }
			    Graphics_Restore();
		    }		
	    }
	//}
	//else
	//{
	    //Not using views....
	//     this.DrawTheRoom(r);
	//}
	
	// Restore the room extents to the pre-view handling state
	g_roomExtents.Copy(roomExtents);
	Graphics_Restore();

};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.DrawApplicationSurface = function (r) {

    if( g_Application_Surface_Autodraw && g_bUsingAppSurface)
    {
        Graphics_Save({ Store3D: true, StoreState: true });

        r.left = 0;
        r.top = 0;
        r.right = window_get_width();
        r.bottom = window_get_height();

        var rect = g_AppSurfaceRect;//Get_FullScreenOffset();  //aspect adjust
		
		var gl = g_webGL;
        var atest = gl && gpu_get_alphatestenable();
        if (gl) gpu_set_alphatestenable(false);
        
        Graphics_SetViewPort(0, 0, r.right, r.bottom);
        Graphics_SetViewArea(0, 0, r.right, r.bottom, 0);
        draw_surface_stretched(g_ApplicationSurface, rect.x, rect.y, rect.w, rect.h);            
        
        if (gl) gpu_set_alphatestenable(atest);
      
     
        Graphics_Restore({ Restore3D: true, RestoreState: true });
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.PostDraw = function (r) {

    //
	// Now do POST draw event
	//	
	r.left = 0;
	r.top = 0;
	r.right = window_get_width();
	r.bottom = window_get_height();

	g_pCurrentView = g_GUIView;
	g_pCurrentView.scaledportx = 0;
	g_pCurrentView.scaledporty = 0;
	g_pCurrentView.scaledportw = r.right;
	g_pCurrentView.scaledporth = r.bottom;
	g_pCurrentView.scaledportx2 = r.right;
	g_pCurrentView.scaledporty2 = r.bottom;
	g_pCurrentView.WorldViewScaleX = 1.0;
	g_pCurrentView.WorldViewScaleY = 1.0;
    Graphics_Save();
    {
	    Graphics_SetViewPort(0, 0, r.right, r.bottom);
	    Graphics_SetViewArea(0, 0, r.right, r.bottom, 0);
	    this.ExecuteDrawEvent(r, EVENT_DRAW_POST);
	}
	Graphics_Restore();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.DrawGUI = function (r) {

    var dispx = g_DisplayScaleX;
    var dispy = g_DisplayScaleY;

    
	var gui_width = g_GUIWidth;
	var gui_height = g_GUIHeight;
	if( gui_width<0 ) gui_width = window_get_width(); 
	if( gui_height<0 ) gui_height = window_get_height(); 
    
	Graphics_Save({ Store3D: true });		
	{
	    r.left = 0;
	    r.top = 0;
	    r.right = window_get_width();
	    r.bottom = window_get_height();

	    g_DisplayScaleX = r.right / gui_width;
	    g_DisplayScaleY = r.bottom / gui_height;

	    g_pCurrentView = g_GUIView;
	    g_pCurrentView.scaledportx = 0;
	    g_pCurrentView.scaledporty = 0;
	    g_pCurrentView.scaledportw = r.right;
	    g_pCurrentView.scaledporth = r.bottom;
	    g_pCurrentView.scaledportx2 = r.right;
	    g_pCurrentView.scaledporty2 = r.bottom;
	    g_pCurrentView.WorldViewScaleX = g_DisplayScaleX; //1.0;
	    g_pCurrentView.WorldViewScaleY = g_DisplayScaleY; //1.0;

	    g_InGUI_Zone = true;
	    Graphics_SetViewPort(0, 0, r.right, r.bottom);
	    //Graphics_SetViewArea(0, 0, gui_width, gui_height, 0);
	    Calc_GUI_Scale();

        var roomExtents = new YYRECT();
        roomExtents.Copy(g_roomExtents);
        g_roomExtents.left =0;
        g_roomExtents.top=0;
        g_roomExtents.right=gui_width;
        g_roomExtents.bottom=gui_height;

	    this.ExecuteDrawEvent(r, EVENT_DRAW_GUI_BEGIN);
	    this.ExecuteDrawEvent(r, EVENT_DRAW_GUI);
	    this.ExecuteDrawEvent(r, EVENT_DRAW_GUI_END);
	    g_InGUI_Zone = false;
        g_roomExtents.Copy(roomExtents);
    }
	Graphics_Restore({ Restore3D: true });
	
	g_DisplayScaleX = dispx;
	g_DisplayScaleY = dispy;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyRoom.prototype.DrawCursor = function (r) {

    if (g_CurrentCursor >= 0) 
	{
	    Graphics_Save();
	    Graphics_SetViewPort(0, 0, r.right, r.bottom);
	    Graphics_SetViewArea(0, 0, r.right, r.bottom, 0);
        this.DrawUserCursor();
	    Graphics_Restore();
	}
};

// #############################################################################################
/// Function:<summary>
///             Draw the room
///          </summary>
// #############################################################################################
yyRoom.prototype.Draw = function () {
	Graphics_Save();

    // reset clip to full canvas size for this frame
	g_clipx = 0;
	g_clipy = 0;
	g_clipw = canvas.width;
	g_cliph = canvas.height;


	var r = new YYRECT();
	if (this.m_enableviews) {
	    r.left = 0;
	    r.top = 0;
	    r.right = window_get_width();
	    r.bottom = window_get_height();
	}
	else {
        // If views are disabled, use the room extents as our draw area
	    r.Copy(g_roomExtents);
	}
    
	this.PreDraw(r);
	//this.SetApplicationSurface();				
	this.DrawViews(r);	
	// Disable application_surface, and now render direct to the screen
	if (g_bUsingAppSurface) {
	    surface_reset_target();
	}
	//check surface stack is empty
	if (g_SurfaceStack.length != 0)
	{
	    yyError("Unbalanced surface stack. You MUST use surface_reset_target() for each set.");
	    return;
	}		
	this.PostDraw(r);
    this.DrawApplicationSurface(r);
	this.DrawGUI(r);
	this.DrawCursor(r);
	Graphics_Restore();
};

// #############################################################################################
/// Function:<summary>
///             Works out the GUI view matrix and scaling, and sets it
///          </summary>
// #############################################################################################
function Calc_GUI_Scale()
{
    var gui_width = g_GUIWidth;
    var gui_height = g_GUIHeight;
	if( gui_width<0 ) gui_width = DISPLAY_WIDTH;
	if( gui_height<0 ) gui_height = DISPLAY_HEIGHT;
	
	var sx = 1;
	var sy = 1;
	var tx = 0;
	var ty = 0;
	
	if( g_GUI_Maximise )
	{
        sx = g_GUI_X_Scale;
        sy = g_GUI_Y_Scale;
        tx = g_GUI_Xoffset;
        ty = g_GUI_Yoffset;
        Graphics_SetViewAreaTransform( sx, sy, tx, ty );
    }
    else
    {
        //gui top left is app surface origin
        tx = g_AppSurfaceRect.x;
        ty = g_AppSurfaceRect.y;
        //"fixed" gui size? 
        if( g_GUIWidth > 0 ) {
            sx = g_AppSurfaceRect.w / gui_width;
        }
        if( g_GUIHeight > 0 ) {
            sy = g_AppSurfaceRect.h / gui_height;
        }
        Graphics_SetViewAreaTransform( sx, sy, tx, ty );
    }
    DirtyRoomExtents();
};

// #############################################################################################
/// Function:<summary>
///             Removed all "marked" instances - those that have been deleted.
///          </summary>
// #############################################################################################
yyRoom.prototype.RemoveMarked = function () {

	// First copy all MARKED instances into array
	var tmp = [];
	var pInstArray = g_pInstanceManager.m_Instances.pool;	
	for (var i = 0; i < pInstArray.length; i++)
	{
		var pInst = pInstArray[i];
		if (pInst.marked)
		{
			tmp[tmp.length] = pInst;
		}
	}

	// Now loop through the marked list, and delete them from everywhere else!
	for (var i = 0; i < tmp.length; i++)
	{
		var pInst = tmp[i];
		this.DeleteInstance(pInst);
	}
};



// #############################################################################################
/// Function:<summary>
///             Delete an instance from the room
///          </summary>
///
/// In:		 <param name="pInst">Instance to remove</param>
// #############################################################################################
yyRoom.prototype.DeleteInstance = function (pInst) {

    if (this.m_pPhysicsWorld && pInst.m_physicsObject) {
        this.m_pPhysicsWorld.DestroyBody(pInst.m_physicsObject);
    }
    g_pLayerManager.RemoveInstance(this, pInst);
    g_pInstanceManager.Remove(pInst);
	this.m_Active.DeleteItem(pInst);
	this.m_Deactive.DeleteItem(pInst);
	pInst.pObject.RemoveInstance(pInst);
};

// #############################################################################################
/// Property: <summary>
///           	Deactivate instance
///           </summary>
// #############################################################################################
yyRoom.prototype.DeactivateInstance = function (_pInst) {
	if (_pInst.active)
	{
		this.m_Active.DeleteItem(_pInst); 		// Remove from active list
		_pInst.pObject.RemoveInstance(_pInst); 	// remove instance from the object list/rlist

		// Now add to deactve list
		this.m_Deactive.Add(_pInst); 			// move it into active list
		_pInst.active = false;
	}
};


// #############################################################################################
/// Property: <summary>
///           	Activate instance
///           </summary>
// #############################################################################################
yyRoom.prototype.ActivateInstance = function (_pInst) {
	if (!_pInst.active)
	{
		this.m_Deactive.DeleteItem(_pInst); 		// move it into active list

		this.m_Active.Add(_pInst); 			// Remove from active list
		_pInst.pObject.AddInstance(_pInst); 			// remove instance from the object list/rlist

		// Now add to deactve list
		_pInst.active = true;
	}
};

// #############################################################################################
/// Property: <summary>
///           	Add a tile to the room.
///           </summary>
// #############################################################################################
yyRoom.prototype.AddTile = function (_pTile) {

	this.m_PlayfieldManager.Add(_pTile);
	this.m_Tiles[_pTile.id] = _pTile;
	this.m_NumTiles++;
};



// #############################################################################################
/// Property: <summary>
///           	Add a tile to the room.
///           </summary>
// #############################################################################################
yyRoom.prototype.DeleteTile = function (_id) {
	var pTile = this.m_Tiles[_id];
	if (pTile)
	{
	    this.m_PlayfieldManager.DeleteTile(pTile);
		this.m_Tiles[_id] = undefined;
		this.m_NumTiles--;
	}
};

// #############################################################################################
/// Property: <summary>
///           	Add a tile to the room.
///           </summary>
// #############################################################################################
yyRoom.prototype.DeleteTileLayer = function (_depth) {

	var pPlayfield = this.m_PlayfieldManager.Get(_depth);
	if (pPlayfield != null && pPlayfield != undefined) {
	
	    var pool = pPlayfield.GetPool();
	    
	    // Delete all tile that exist in this layer.	    
	    for (var tile = 0; tile < pool.length; tile++)
	    {
	    	var pTile = pool[tile];
	    	if (pTile)
	    	{
	    		this.m_Tiles[pTile.id] = null;
	    		this.m_NumTiles--;
	    	}
	    }	    
	}
	this.m_PlayfieldManager.Delete(_depth);
};


// #############################################################################################
/// Property: <summary>
///           	Remove all tiles currently in use
///           </summary>
// #############################################################################################
yyRoom.prototype.ClearTiles = function () {

    this.m_NumTiles = 0;
    this.m_Tiles = [];
};


// #############################################################################################
/// Property: <summary>
///           	Remove all tiles specified in storage
///           </summary>
// #############################################################################################
yyRoom.prototype.ClearTilesFromStorage = function () {
	this.m_pStorage.tiles = [];
};





yyRoom.prototype.ProcessDepthList2 = function () {
    if (this.m_DepthSorting.length == 0) return;
	var list = this.m_DepthSorting;


	//remove all the unsorted entries in SORTED section, and move to end of list
	for (var i = 0; i < list.length; i++)
	{
		var pInst = list[i];

		//Have a look see if we need to move its layer
		var room = g_RunRoom;
		if (room != null) {
			var pLayer = g_pLayerManager.GetLayerFromID(room, pInst.m_nLayerID);

			if (pLayer != null) {
				if (floor(pLayer.depth) != floor(pInst.depth)) {
					if (pLayer.m_dynamic && pLayer.m_elements.length == 1) {
						//We're the only thing on the layer, we can just change it's depth
						g_pLayerManager.ChangeLayerDepth(room, pLayer, pInst.depth, true);
					}
					else {
						g_pLayerManager.RemoveInstanceFromLayer(room, pLayer, pInst);
						//Move to a new layer
						g_pLayerManager.AddInstance(room, pInst);

					}
				}
			}
		}
	}
	
	// Now we've processed it... Clear the list
	this.m_DepthSorting = [];
};

/*
yyRoom.prototype.ProcessNewInstanceList = function () {
    // New instances
	if (g_isZeus) {
	    var len = this.m_NewInstances.length;
	    for (var i = 0; i < len; i++)
	    {
	        var pinst_change = this.m_NewInstances[i];
	        var pinst = pinst_change.inst;
	        var t = pinst_change.type;
	        var id = pinst.id;

	        if (g_isZeus) {
	            // Check to see if the instance is already in the layer system
	            if (t == 0) {
	                var elandlay = g_pLayerManager.GetElementAndLayerFromInstanceID(this, id);
	                if (elandlay == null) {
	                    g_pLayerManager.AddInstance(this, pinst);
	                }
	                else {
	                    g_pLayerManager.BuildElementRuntimeData(this, elandlay.layer, elandlay.element)
	                }
	            } else if (t == 1) {
	                var layer = pinst_change.layer;
	                g_pLayerManager.AddInstanceToLayer(this, layer, pinst);
	            }
	        }
	    }
	}
	if (this.m_NewInstances.length != 0) this.m_NewInstances = [];       // wipe array
};
*/

yyRoom.prototype.ProcessParticleDepthChange = function () {
    // Particle systems changing depth
	if (g_isZeus) {
	    var len = g_ParticleChanges.length;
	    for (var i = 0; i < len; i++) {
	        var pPartChange = g_ParticleChanges[i];
	        var pPartSys = pPartChange.part_sys;
	        var type = pPartChange.type;
	        var id = pPartSys.id;

            // type 0 = change depth
	        if (type == 0) {
	            // Remove this from any layer it happens to be on and re-add it again (ignored of not on a layer yet)
	            g_pLayerManager.RemoveElementById(g_RunRoom, pPartSys.m_elementID, true);
	            var pPartEl = new CLayerParticleElement();
	            pPartEl.m_systemID = id;
	            //pPartEl.m_origLayerID = -1;  // scrub any associated layer ID if we're manually changing depth
	            pPartSys.m_elementID = g_pLayerManager.AddNewElementAtDepth(g_RunRoom, pPartSys.depth, pPartEl, true, true);
	        }
        }
	}
	if( g_ParticleChanges.length!=0 ) g_ParticleChanges = []; // wipe array
};




// Sequences

yyRoom.prototype.AddSeqInstance = function (_id) {
    this.m_SequenceInstancesIds[this.m_SequenceInstancesIds.length] = _id;
};

yyRoom.prototype.RemoveSeqInstance = function (_id) {
    // Find id in list and swap with last entry (the order of the list doesn't matter (at the moment))
    for (var i = 0; i < this.m_SequenceInstancesIds.length; i++)
    {
        if (this.m_SequenceInstancesIds[i] == _id)
        {
            this.m_SequenceInstancesIds.splice(i, 1);
            return;
        }
    }
};

















// #############################################################################################
/// Function:<summary>
///             Simple room manager
///          </summary>
// #############################################################################################
/**@constructor*/
function    yyRoomManager()
{
    this.pRooms = []; //new yyList();
    this.m_RoomOrder = [];
}


// #############################################################################################
/// Function:<summary>
///             Set the room order
///          </summary>
// #############################################################################################
yyRoomManager.prototype.SetRoomOrder = function (_order) {
	this.m_RoomOrder = _order;
};


// #############################################################################################
/// Function:<summary>
///             Add a room to the list
///          </summary>
///
/// In:		 <param name="_pRoom">Room to add</param>
/// Out:	 <returns>
///				index room was added at
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.Add = function (_pRoom) {
	return this.pRooms[this.pRooms.length] = _pRoom;
};

// #############################################################################################
/// Function:<summary>
///             Get a room at a specific point
///          </summary>
///
/// In:		 <param name="_pRoom"></param>
/// Out:	 <returns>
///				The actual room
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.Get = function (_Index) {
    if(_Index<0 || _Index>=this.pRooms.length)
        return null;
        

	return this.pRooms[_Index];
};

// #############################################################################################
/// Function:<summary>
///             Get a room at a specific point
///          </summary>
///
/// In:		 <param name="_pRoom"></param>
/// Out:	 <returns>
///				The actual room
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.GetOrder = function (_Index) {
	return this.pRooms[this.m_RoomOrder[_Index]];
};

// #############################################################################################
/// Function:<summary>
///             Delete a room
///          </summary>
///
/// In:		 <param name="_Index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.Delete = function (_Index) {
	this.pRooms[_Index] = null;
};

// #############################################################################################
/// Function:<summary>
///             Creates a new room that is a duplicate of the room at the index given
///          </summary>
///
/// In:		 <param name="_Index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.DuplicateRoom = function (_Index) {

    var pOriginalRoom = g_pRoomManager.Get(_Index);

    var pDuplicateRoom = new yyRoom();
    pDuplicateRoom.CreateEmptyStorage();
    pDuplicateRoom.CloneStorage(pOriginalRoom.m_pStorage);
        
    this.Add(pDuplicateRoom);    
    return pDuplicateRoom.id;
};


// #############################################################################################
/// Function:<summary>
///             Assigns a room from another
///          </summary>
///
/// In:		 <param name="_Index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyRoomManager.prototype.AssignRoom = function (_dest, _source) {

    // Add all instances, tiles, backgrounds etc... to the destination room and copy across the basic settings
    var destRoom = this.pRooms[_dest];
    var sourceRoom = this.pRooms[_source];
    
    if (!destRoom || !sourceRoom) {
        return;
    }
    
    // Assign the source storage to the destination room
	destRoom.CloneStorage(sourceRoom.m_pStorage);
};


// #############################################################################################
/// Function:<summary>
///             Forces all rooms back to the storage settings
///             May be used to prevent persistence carrying over when reseting the game
///          </summary>
// #############################################################################################
yyRoomManager.prototype.ResetAll = function () {

    // Make sure we nuke all cameras first
    g_pCameraManager.ClearAll();
    CreateDefaultCamera();

    for (var roomIndex in this.pRooms) {
        if (!this.pRooms.hasOwnProperty(roomIndex)) continue;
    
        // Clear out actual room (not storage)
        var room = this.pRooms[roomIndex];
        for (var i = 0; i < 8; i++) {
            var room_view = room.GetView(i);
            if (room_view) {
                room_view.cameraID = -1;      // remove camera reference
            }
        }

        // Now clear out room storage
        var pStorage = room.m_pStorage;
        if (pStorage)
        {
            for (var i = 0; i < 8; i++) {
                var view = pStorage.views[i];
                if (view) {
                    if (view.cameraID !== undefined) {
                        delete pStorage.views[i].cameraID;      // remove camera reference
                    }
                } else {
                    var b = 0;
                }
            }
        }
    }

    // and now reset the high watermark
    g_pCameraManager.SetInitialLoadHighPoint();
};
