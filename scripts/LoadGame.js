// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            LoadGame.js
// Created:         18/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Deals with loading the whole game file
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 18/02/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************
var g_LoadingTotal = 0;
var g_LoadingCount = 0;
var g_ExtensionTotal = 0;
var g_ExtensionCount = 0;
var g_LoadingScreen = null;
var g_LoadingSoundAssets = null;

// As per http://www.w3schools.com/tags/av_prop_networkstate.asp
var NETWORK_EMPTY = 0,
    NETWORK_IDLE = 1,
    NETWORK_LOADING = 2,
    NETWORK_NO_SOURCE = 3;

// #############################################################################################
/// Function:<summary>
///             Initialise the GameMaker "runtime" engine.
///          </summary>
// #############################################################################################
function InitAboyne()
{
    global = new yyGameGlobals();
    g_pBuiltIn = new yyBuiltIn();
	g_pIOManager = new yyIOManager();
	/// @if feature("gamepad")
	g_pGamepadManager = new yyGamepadManager();
	/// @endif

	g_pBuiltIn.pointer_null = new ArrayBuffer(1);
	g_pBuiltIn.pointer_invalid = new ArrayBuffer(1);	
	g_pBuiltIn.NaN = Number.NaN;	
	g_pBuiltIn.infinity = Number.POSITIVE_INFINITY;	
	
	Graphics_Init(canvas);

    g_pInstanceManager = new yyInstanceManager();
	g_pObjectManager = new yyObjectManager();
    g_pRoomManager = new yyRoomManager();
	g_pSpriteManager = new yySpriteManager();
	g_pTextureGroupInfoManager = new yyTextureGroupInfoManager();
    g_pBackgroundManager = new yyBackgroundManager();
    g_pSoundManager = new yySoundManager();
    g_pFontManager = new yyFontManager();
    g_pCollisionList = [];
    g_pPathManager = new yyPathManager();
	// @if feature("timelines")
    g_pTimelineManager = new yyTimelineManager();
	// @endif
	// @if feature("animcurves")
    g_pAnimCurveManager = new yyAnimCurveManager();
	// @endif
	// @if feature("sequences")
    g_pSequenceManager = new yySequenceManager();
	// @endif
    g_pTagManager = new TagManager();
    g_pASyncManager = new yyASyncManager();
    g_pLayerManager = new LayerManager();
	g_pEffectsManager = new yyEffectsManager();
    g_pCameraManager = new CameraManager();
    InitAboyneGlobals();

    Audio_Init(); 

	if (g_isZeus)
	{
		g_pCameraManager.Clean();
		CreateDefaultCamera();
	}
}


// #############################################################################################
/// Function:<summary>
///          	Given a loading error code, return the error string 
///          </summary>
///
/// In:		<param name="_code">Error code</param>
/// Out:	<returns>
///				The error string.
///			</returns>
// #############################################################################################
function GetNetworkErrorText(_code) {
	switch (_code)
	{
		case 1: return "MEDIA_ERR_ABORTED";
		case 2: return "MEDIA_ERR_NETWORK";
		case 3: return "MEDIA_ERR_DECODE";
		case 4: return "MEDIA_ERR_SRC_NOT_SUPPORTED";
	}
	return "Unknown Error";
}


// #############################################################################################
/// Function:<summary>
///          	Given a loading error code, return the error string 
///          </summary>
///
/// In:		<param name="_code">Error code</param>
/// Out:	<returns>
///				The error string.
///			</returns>
// #############################################################################################
function GetNetworkStateText(_code) {

	switch (_code)
	{
		case NETWORK_EMPTY: return "NETWORK_EMPTY";
		case NETWORK_IDLE: return "NETWORK_IDLE";
		case NETWORK_LOADING: return "NETWORK_LOADING";
		case NETWORK_NO_SOURCE: return "NETWORK_NO_SOURCE";
	}
	return "Unknown Error";
}

// #############################################################################################
/// Function:<summary>
///          	Callback for image loading... (this is set to the image)
///          </summary>  
// #############################################################################################
/** @this {XMLHttpRequest} */
function LoadGame_ImageLoad(_event) 
{
	debug("ImageLoaded: " +this.src);	
	g_LoadingCount++;
	
//	this.setAttribute("-ms-interpolation-mode", "nearest-neighbor");
//	this.msInterpolationMode = "nearest-neighbor";
//	this.imageSmoothingEnabled = false;
//	this.imagerendering = "-o-crisp-edges";

//	this.Style = "image-rendering: -moz-crisp-edges; -webkit-interpolation-mode: -webkit-optimize-contrast;-ms-interpolation-mode: nearest-neighbor;";
//	this.setAttribute("image-rendering", '-moz-crisp-edges');
//	this.setAttribute("webkit-interpolation-mode", '-webkit-optimize-contrast');
//	this.setAttribute("ms-interpolation-mode", 'nearest-neighbor');
}

// #############################################################################################
/// Function:<summary>
///          	Callback for image load errors
///          </summary>  
// #############################################################################################
/** @this {XMLHttpRequest} */
function LoadGame_ImageLoad_Error(_event) 
{
	debug("ImageError: " + this.src); //+ "   error: " + GetNetworkErrorText(_event.currentTarget.error["code"]));	
	g_LoadingCount++;
}

/** @this {XMLHttpRequest} */
function LoadedGame_ExtensionLoaded(_event) {
	g_ExtensionCount++;
	debug("ExtensionLoaded: " ); // + this.URL);
}
/** @this {XMLHttpRequest} */
function LoadedGame_ExtensionError(_event) {
	g_ExtensionCount++;
	debug("ExtensionError: "); // + this.URL);
}


// #############################################################################################
/// Function:<summary>
///          	Callbacks for sound loading... (this is set to the image)
///          </summary>  
// #############################################################################################
function ClearEventListeners(_snd) {
	_snd.removeEventListener('canplaythrough', LoadGame_SoundLoad, false);
	_snd.removeEventListener('error', LoadGame_SoundLoad_Error, false);
	_snd.removeEventListener("loadstart", LoadGame_SoundLoad_Loading, false);
	_snd.removeEventListener("suspend", LoadGame_SoundLoad_Suspended, false);
	_snd.removeEventListener("stalled", LoadGame_SoundLoad_Stalled, false);
	_snd.removeEventListener("stall", LoadGame_SoundLoad_Stalled, false);
}


/** @this {XMLHttpRequest} */
function LoadGame_SoundLoad(_event) {

	this.completed = true;
	if (g_LoadingSoundAssets[this.URL] !== null)
	{
		g_LoadingSoundAssets[this.URL] = null;
		g_LoadingCount++;
	}
	ClearEventListeners(this);
	debug("SoundLoaded: " + this.URL);
}

/** @this {XMLHttpRequest} */
function LoadGame_SoundLoad_Error(_event) {

	debug("SoundError: " + this.URL + "   NetworkError: " + GetNetworkErrorText(this.error["code"]));
	this.completed = false;
	if (g_LoadingSoundAssets[this.URL] !== null)
	{
		g_LoadingSoundAssets[this.URL] = null;
		g_LoadingCount++;
	}
	ClearEventListeners(this);
}

/** @this {XMLHttpRequest} */
function LoadGame_SoundLoad_Loading(_event) {
	this.DoingLoading = true;
}

/** @this {XMLHttpRequest} */
function LoadGame_SoundLoad_Suspended(_event) {
	//debug(this.URL + ' loading suspended');
	debug("SoundSuspended: " + this.URL );
	this.completed = true;
	if (g_LoadingSoundAssets[this.URL] !== null)
	{
		g_LoadingSoundAssets[this.URL] = null;
		g_LoadingCount++;
	}
	ClearEventListeners(this);
}

function LoadGame_SoundLoad_Stalled(_event) {
	//debug(this.URL + ' loading stalled');
}



// #############################################################################################
/// Function:<summary>
///          	Load a particle from the web
///          </summary>
///
/// In:		<param name="_filename"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function LoadParticleImage(_filename)
{
	debug("Loading: " + _filename);
	var index = Graphics_AddTexture(_filename);

	// Create a texture page entry.
	var pTPE = new yyTPageEntry();
	pTPE.x = 0;
	pTPE.y = 0;
	pTPE.w = 63;
	pTPE.h = 63;
	pTPE.XOffset = -32;
	pTPE.YOffset = -32;
	pTPE.CropWidth = 63;
	pTPE.CropHeight = 63;
	pTPE.ow = pTPE.w;
	pTPE.oh = pTPE.h;
	pTPE.tp = index;
	pTPE.texture = g_Textures[index];			// get raw texture page
	pTPE.cache = []; 							// clear colour cache
	pTPE.maxcache = 32;		
	pTPE.count = 0;
	var par = g_ParticleTextures.length;
	g_ParticleTextures[par] = pTPE;
	return par;
}


// #############################################################################################
/// Function:<summary>
///          	Get the DOM to include a .JS file. It will need a "game tick" to actually load.
///          </summary>
///
/// In:		<param name="_pFile">JS file to load</param>
///				
// #############################################################################################
function Include_JSFile(_pFile) {
	debug("Loading: " + g_RootDir + _pFile);
	var e = window.document.createElement('script');
	e.setAttribute('src', g_RootDir + _pFile);
	e.setAttribute('type', "text/javascript");
	e.onload = LoadedGame_ExtensionLoaded;
	e.onerror = LoadedGame_ExtensionError;
	window.document.body.appendChild(e);
	g_ExtensionTotal++;
}


// #############################################################################################
/// Function:<summary>
///          	Run through ALL the .JS files we've to load, and get the DOM to load them.
///
///				Extensions: [{ jsFiles: ["test.js"], init: "JS_MYINIT", final: "JS_MYQUIT" }]
///
///          </summary>
///
/// In:		<param name="_GameFile">JSON file</param>
///				
// #############################################################################################
function LoadExtensions(_GameFile) 
{
	if (_GameFile.Extensions !== undefined)
	{
		for (var i = 0; i < _GameFile.Extensions.length; i++)
		{
			var pExt = _GameFile.Extensions[i];

			// if we actually HAVE files to load, then load them.
			// (not all extensions have extra files - GML extensions don't for example)
			if (pExt.jsFiles)
			{
				for (var js = 0; js < pExt.jsFiles.length; js++)
				{
					Include_JSFile(pExt.jsFiles[js]);
				}
			}
		}
	}
}

// #############################################################################################
/// Function:<summary>
///          	Pre-load the extensions....
///          </summary>
// #############################################################################################
function PreLoadExtensions(_GameFile) {

	g_LoadingSoundAssets = [];
	g_ExtensionTotal = 0;
	g_ExtensionCount = 0;
	LoadExtensions(_GameFile);
}

// #############################################################################################
/// Function:<summary>
///          	Load skeleton data
///          </summary>
// #############################################################################################
function LoadSkeletonData(_filename) {
	// @if feature("spine")
    g_LoadingTotal++;
	var request = new XMLHttpRequest();
    request.open('GET', CheckWorkingDirectory(_filename), true);        
    request.send();
    request.onload = function (ev) { 
        g_LoadingCount++;             
        g_pSpriteManager.SkeletonLoad(request.responseText); 
    };
    request.onerror = function (ev) { g_LoadingCount++; };    
	// @endif spine
}


// #############################################################################################
/// Function:<summary>
///          	Load SWF data
///          </summary>
// #############################################################################################
function LoadSwfData(_filename) {
	// @if feature("swf")
    g_LoadingTotal++;	    
	var request = new XMLHttpRequest();
    request.open('GET', CheckWorkingDirectory(_filename), true);
    request.responseType = 'arraybuffer';
    request.send();
    request.onload = function (ev) { 
        g_LoadingCount++;             
        g_pSpriteManager.SWFLoad(request.response || request.responseText); 
    };
    request.onerror = function (ev) { g_LoadingCount++; };    
	// @endif swf
}

// #############################################################################################
/// Function:<summary>
///          	Load the textures..
///          </summary>
///
/// In:		<param name="_GameFile"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################

var set_load_location;

function default_set_load_location(self,other,orig)
{
   // debug('default_set_load_location called with ' + orig);
    return orig;
};

var g_YYTextures = [];

function LoadGame_PreLoadAssets(_GameFile) 
{
	/*jshint evil:true*/
	var t,id;
    if( _GameFile.Name ) document.title = _GameFile.Name;


    if(typeof(gml_Script_gmcallback_html5_set_load_location)!= 'undefined')
    {
        set_load_location = gml_Script_gmcallback_html5_set_load_location;
    }
    else
        set_load_location = default_set_load_location;
      


    g_LoadingScreen = document.getElementById('GM4HTML5_loadingscreen');

    //if (g_LoadingBarCallback === "")
    //{
    	PreLoadExtensions(_GameFile);
    	g_LoadingBarCallback = yyRenderStandardLoadingBar;
    //} else
    //{
	//	try{
   // 		g_LoadingBarCallback = eval(g_LoadingBarCallback);
	//	}catch(e){
   // 		g_LoadingBarCallback = yyRenderStandardLoadingBar;
	//	}
    //}

    g_LoadingCount=0;
	// Load texture pages
	for (var index = 0; index < _GameFile.Textures.length; index++)
	{
		g_LoadingTotal++;
		debug("Loading: " + g_RootDir + _GameFile.Textures[index]);
		t = Graphics_AddTexture(g_RootDir + _GameFile.Textures[index]);
		g_Textures[t].onload = LoadGame_ImageLoad;
		g_Textures[t].onerror = LoadGame_ImageLoad_Error;
		g_Textures[t].URL = _GameFile.Textures[index];		
		g_Textures[t].m_mipsToGenerate = _GameFile.TexturesBlocks[index].MipsToGenerate;

		g_YYTextures[index] = t;
	}
	
	// Load SWF data if it's present
	// @if feature("swf")
	if ((_GameFile.Swfs !== null) && (_GameFile.Swfs !== undefined)) {	
	    LoadSwfData(_GameFile.Swfs);
    }
	// @endif
    
    // Load Spine data if it's present
	// @if feature("spine")
	if ((_GameFile.Skel !== null) && (_GameFile.Skel !== undefined)) {	
	    LoadSkeletonData(_GameFile.Skel);
    }
	// @endif

	// Load the particle textures
	if (true == g_pGMFile.Options.UseParticles) {
		for (var i = 2; i < 16; i++){
			g_LoadingTotal++;
			var p = LoadParticleImage(g_RootDir + "particles/IDR_GIF" + i + ".png");

			t = g_ParticleTextures[p].tp;
			g_Textures[t].onload = LoadGame_ImageLoad;
			g_Textures[t].onerror = LoadGame_ImageLoad_Error;
			g_Textures[t].URL = "particles/IDR_GIF" + i + ".png";		
		}
	}


	// Now load WAV files (not mp3/ogg)
	if(g_AudioModel == Audio_WebAudio)
    {
        for (index = 0; index < _GameFile.Sounds.length; index++)
	    {
		    if(  _GameFile.Sounds[index]!==null)
		    {
	            var groupId = 0;    //default
	            if( _GameFile.Sounds[index].groupId !== undefined ){
	                groupId = _GameFile.Sounds[index].groupId;
	            }
	            
	            if( groupId == 0 )
	            {
	                g_LoadingTotal++;
	                debug("Loading: " + g_RootDir + _GameFile.Sounds[index].origName);

	                if (_GameFile.Sounds[index].kind === 0)
	                {
	                	id = AudioManager_AddRawSound( g_RootDir + _GameFile.Sounds[index].origName,
													   index,
													   _GameFile.Sounds[index].pName,
													   _GameFile.Sounds[index].extension );
	                    if (id === undefined) {
	        	            g_LoadingTotal--;
	                    }
	                }
	                else if ((_GameFile.Sounds[index].kind ==3) || (_GameFile.Sounds[index].kind == 1))
	                {
	                	Audio_PrepareStream( g_RootDir + _GameFile.Sounds[index].origName,
											 index,
											 _GameFile.Sounds[index].pName,
											 _GameFile.Sounds[index].extension );
	                    g_LoadingTotal--;
	                }
	                else
	                {
	                    debug("Attempting to load sound with unknown type: " + _GameFile.Sounds[index].kind);
	                    g_LoadingTotal--;
	                }
	             }
		    }		

	    }
    }
    else if (g_AudioModel == Audio_Sound)
    {
    	var currentName, currentRawSound;
	    for (index = 0; index < _GameFile.Sounds.length; index++)
	    {
		    if (_GameFile.Sounds[index] !== null)
		    {
		    	g_LoadingTotal++;
		    	currentName = _GameFile.Sounds[index].pName;
		    	currentRawSound = g_RawSounds[currentName];

	            debug("Loading: " + g_RootDir + _GameFile.Sounds[index].origName);
	            id = SoundManager_AddRawSound(g_RootDir + _GameFile.Sounds[index].origName, _GameFile.Sounds[index].pName, _GameFile.Sounds[index].extension, LoadGame_SoundLoad, LoadGame_SoundLoad_Error);
	            if ( ( id !== undefined ) && ( currentRawSound ) && ( currentRawSound.URL ) )
	            {
	            	g_LoadingSoundAssets[currentRawSound.URL] = currentRawSound;
	            }
	            else
	            {
	        	    g_LoadingTotal--;
	            }
		    }
	    }
	}		
}


// #############################################################################################
/// Function:<summary>
///          	Ticks through all loading files and checks to see if there is an error, or
///				to see if it loaded.
///          </summary>
// #############################################################################################
function ProcessFileLoading() {
	
	// NB: With the "old" html5 Audio class in use, onerror is not necessarily hit if a sound
	//     isn't found on the server, thus we need this loading check to pick up when the 
	//     network state of the sound is in an error condition	
	for (var i in g_LoadingSoundAssets) {
	    if (!g_LoadingSoundAssets.hasOwnProperty(i)) continue;   
	
		var pAsset = g_LoadingSoundAssets[i];
		if (pAsset)
		{
			if ((pAsset.networkState !== null && pAsset.networkState !== undefined) && 
			    (pAsset.readyState !== null && pAsset.readyState !== undefined))
			{			    
			    // From http://www.w3schools.com/tags/av_prop_readystate.asp
				// readyState = 4 means we have enough data loaded. Might get this BEFORE the loaded callback...
				if ((pAsset.networkState == NETWORK_IDLE || pAsset.networkState == NETWORK_NO_SOURCE) && 
				    (pAsset.DoingLoading) && 
				    (pAsset.readyState != 4))
				{
					// have we actually tried to load?
					if (pAsset.completed !== true)
					{
						pAsset.completed = false;
						g_LoadingCount++;
						g_LoadingSoundAssets[i] = null;
						ClearEventListeners(pAsset);
						debug("SoundError: " + pAsset.URL + "   NetworkState: " + GetNetworkStateText(pAsset.networkState));
					}
				}
			}
		}
	}
}



// #############################################################################################
/// Function:<summary>
///          	Recursively add a collision type.
///          </summary>
///
/// In:		<param name="ID1"></param>
///			<param name="pObj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function AddCollision(ID1, pObj) {

	// Done this one already?
	if (pObj.CollisionDone) return;

	if (pObj.pParent !== null){
		AddCollision(pObj.pParent.ID, pObj.pParent);
	}


	for (var ID2 in pObj.Collisions)	
	{
	    if (!pObj.Collisions.hasOwnProperty(ID2)) continue;
	
		// Check that we haven't previously registered this kind of collision
		if (g_pCollisionList[ID2])
		{
			if (g_pCollisionList[ID2][ID1])
			{
				continue;
			}
		}

		// Now check all parents to see if THEY collide with the desired object
		var found = false;
		var pCheck = pObj;
		while (pCheck !== null)
		{
			var id = pCheck.ID;				// get parent ID

			var pCheck2 = g_pObjectManager.Get(ID2);
			while (pCheck2 !== null)
			{
				var iid = pCheck2.ID;
				// Check to see if the object we're hitting, can hit US OR of our parents!
				// If this happens, we don't have to collide with it as well.
				if (g_pCollisionList[iid] && g_pCollisionList[iid][id])
				{
					found = true;
					break;
				}

				// Only check all collisions on PARENT's list, not our own.
				/*if (pObj != pCheck)
				{
					for (var i in pCheck.Collisions)
					{
						if (i == ID2)
						{
							found = true; 					// we always let the PARENT collide, not us.
							break;
						}
					}
				}*/
				pCheck2 = pCheck2.pParent;
			}
			pCheck = pCheck.pParent;
		}


		if (!found)
		{
			// Insert collision type
			if (!g_pCollisionList[ID1])
			{
				g_pCollisionList[ID1] = [];
			}
			g_pCollisionList[ID1][ID2] = ID2;
		}
	}

	pObj.CollisionDone = true;
}


// #############################################################################################
/// Function:<summary>
///          	Loop through all the collision events, and create the collision table,
///				ONLY add collisions where the PARENT isn't doing the same collision!
///          </summary>
// #############################################################################################
function CreateCollisionArrays() {

	// Now create a collision array of the objects that we need to watch.
	var pool = g_pObjectManager.GetPool();
	for (var ID1 = 0; ID1 < pool.length; ID1++)
	{
		var pObj = pool[ID1];
		if (pObj.pParent !== null){
			AddCollision(pObj.pParent.ID, pObj.pParent);
		}
		AddCollision(ID1,pObj);
	}
}

// #############################################################################################
/// Function:<summary>
///             Load a whole game from the "game file" object
///          </summary>
///
/// In:		 <param name="_GameFile">The game file to laod</param>
///
// #############################################################################################
function LoadGame(_GameFile) 
{
	/*jshint evil:true*/
    var index, pRoom,i;


    g_room_maxid = 1000000;
    g_pBuiltIn.game_id = _GameFile.Options.gameId;
    g_WindowColour = _GameFile.Options.ViewColour;
    g_AllowFullscreen = _GameFile.Options.allowFullScreenKey;
    g_YoYoConfig = _GameFile.Options.Config;
    g_pBuiltIn.game_save_id = GetLocalStorageRoot();
    g_pBuiltIn.game_display_name = _GameFile.Options.DisplayName;
    g_pBuiltIn.game_project_name = _GameFile.Options.ProjectName;
    g_pBuiltIn.working_directory = g_RootDir;
    g_pBuiltIn.local_storage = GetLocalStorageRoot();
    if (g_webGL) g_pBuiltIn.webgl_enabled = true;
    
    // Setup trigger manager first (object init requires them)
    g_pTriggerManager = new yyTriggerManager( _GameFile.Triggers );
    
    g_MD5 =  _GameFile.Options.md5;

    
    // Make OBJECTS
    var id = 0;    
    for (var index = 0; index < _GameFile.GMObjects.length; index++)
    {
        var pObjStorage = _GameFile.GMObjects[index];        
        if( pObjStorage!==null ){
            var pObject = CreateObjectFromStorage( id,pObjStorage );
	        g_pObjectManager.Add( pObject );
	    }
	    id++;
    }

	// Now we've loaded them all, patch up object parents
    g_pObjectManager.PatchParents();

    CreateCollisionArrays();

    
  

    
    // (Load texture pages - now PRE-Startup)
    // Load texture page offsets
	Graphics_SetEntryTable(_GameFile.TPageEntries);

    // Load Sprites
    for(index=0; index<_GameFile.Sprites.length; index++ ){
        if(  _GameFile.Sprites[index]===null ){
            g_pSpriteManager.AddSprite( null );
        }else{
            var pSprite = CreateSpriteFromStorage( _GameFile.Sprites[index] ); 
            g_pSpriteManager.AddSprite( pSprite );
        }
    }
    

    // Load Backgrounds
    for(index=0; index<_GameFile.Backgrounds.length; index++ ){
    	var im = g_pBackgroundManager.AddImage(_GameFile.Backgrounds[index]);
    	var pImage = g_pBackgroundManager.GetImage(im);
		if( pImage!==null ) pImage.copy = TPE_Copy;
    }
    
    // Load Fonts
    for(index=0; index<_GameFile.Fonts.length; index++ ){
        g_pFontManager.Add( _GameFile.Fonts[index]);
    }

	// Load Embedded Fonts
    if ( _GameFile.EmbeddedFonts )
	{
		for ( index = 0; index < _GameFile.EmbeddedFonts.length; ++index )
		{
    		g_pFontManager.AddEmbedded(_GameFile.EmbeddedFonts[index]);
		}
	}

    //Make Rooms    
    for (var index = 0; index < _GameFile.GMRooms.length; index++)
    {
        var pRoomStorage = _GameFile.GMRooms[index];
        if( pRoomStorage !== null ){
            pRoom = new yyRoom();

            // MJD: NO idea why this is done. Rooms are re-created from storage on ROOM START 
            // anyway. Only persistant rooms would need this, and they could be done on demand.

			// LB: This is because of "layer_set_target_room". However, I think we only need to do this for BuildRoomLayers.
			// rather than calling CreateRoomFromStorage and doing the entire thing twice.
			// We either need to do this or check the room storage data in all layer_get_* functions.
			// "layer_set_target_room" means any layer_get_* function can be called for a room before that room has ever been started
			// and is expected to return correct data. The cpp runner currently handles room layers in this way.

            //pRoom.CreateRoomFromStorage(pRoomStorage);
			if(pRoomStorage.LayerCount != undefined)
			{
				if(pRoomStorage.LayerCount > 0)
				{
					g_pLayerManager.BuildRoomLayers(pRoom,pRoomStorage.layers);
				}
			}

            pRoom.m_pStorage = pRoomStorage;        // remember storage ONLY
            g_pRoomManager.Add( pRoom );	    
        }else{
            g_RoomID++;
            g_pRoomManager.Add( null );	    
        }
    }

	g_MD5 = _GameFile.Options.crc;
	//g_MD5CRC = CalcArrayCRC(g_MD5);

    g_pRoomManager.SetRoomOrder( _GameFile.RoomOrder );
    for(i=0;i<_GameFile.RoomOrder.length;i++){
        pRoom = g_pRoomManager.GetOrder( i );
        pRoom.actualroom=i;
    }
    g_pBuiltIn.room_first =  g_pRoomManager.GetOrder( 0 ).id;
    g_pBuiltIn.room_last = g_pRoomManager.GetOrder( g_pRoomManager.m_RoomOrder.length-1 ).id;
    g_pCameraManager.SetInitialLoadHighPoint();


	// Load Paths
    for (index = 0; index < _GameFile.Paths.length; index++)
    {
    	var pPath = CreatePathFromStorage( 	_GameFile.Paths[index] );
    	g_pPathManager.Add( pPath );
    }


    // Load Sounds
    for(index=0; index<_GameFile.Sounds.length; index++ ){
        g_pSoundManager.Add( _GameFile.Sounds[index]);
    }
    

    // Load Timelines
	// @if feature("timelines")
    if (_GameFile.Timelines !== undefined) {
        for(index=0; index<_GameFile.Timelines.length; index++ ){
            g_pTimelineManager.Add( _GameFile.Timelines[index]);
        }
    }
	// @endif


    // Load AnimCurves
	// @if feature("animcurves")
    if (_GameFile.AnimCurves !== undefined) {
        for (index = 0; index < _GameFile.AnimCurves.length; index++) {
            g_pAnimCurveManager.Add(_GameFile.AnimCurves[index]);
        }
    }
	// @endif

    // Load Sequences
	// @if feature("sequences")
    if (_GameFile.Sequences !== undefined) {
        for (index = 0; index < _GameFile.Sequences.length; index++) {
            g_pSequenceManager.Add(_GameFile.Sequences[index]);
        }
    }
	// @endif

	// Load Particle System Emitters
    if (_GameFile.PSEmitters !== undefined) {
		ParticleSystem_Emitters_Load(_GameFile);
    }

	// Load Particle Systems
    if (_GameFile.ParticleSystems !== undefined) {
        for (index = 0; index < _GameFile.ParticleSystems.length; index++) {
			CParticleSystem.CreateFromJSON(_GameFile.ParticleSystems[index]);
        }
    }

	// Load Effect Defs
	if (_GameFile.FiltersAndEffectDefs !== undefined) {
		for (index = 0; index < _GameFile.FiltersAndEffectDefs.length; index++) {
			var def = _GameFile.FiltersAndEffectDefs[index];
            g_pEffectsManager.AddEffectInfo(def.name, def.json);
        }
	}

    //Load Tags
    if( Tags !== undefined && IDToTagList !== undefined ) {
        g_pTagManager.LoadTags(Tags, IDToTagList);
    }

	// Load texture group info
	if (_GameFile.TextureGroupInfo !== undefined)
	{
		for(index = 0; index < _GameFile.TextureGroupInfo.length; index++)
		{
			var pStore = _GameFile.TextureGroupInfo[index];
			var pTGInfo = new yyTextureGroupInfo();

			if (pStore.pName !== undefined) pTGInfo.pName = pStore.pName;
			if (pStore.TextureIDs !== undefined)
			{
				for(var i = 0; i < pStore.TextureIDs.length; i++)
				{
					pTGInfo.textures[i] = g_YYTextures[pStore.TextureIDs[i]];			// need to remap the texture IDs here
				}
			}
			if (pStore.SpriteIDs !== undefined)
			{
				for(var i = 0; i < pStore.SpriteIDs.length; i++)
				{
					pTGInfo.sprites[i] = pStore.SpriteIDs[i];
				}
			}
			// @if feature("spine")
			if (pStore.SpineSpriteIDs !== undefined)
			{
				for(var i = 0; i < pStore.SpineSpriteIDs.length; i++)
				{
					pTGInfo.spinesprites[i] = pStore.SpineSpriteIDs[i];
				}
			}
			// @endif
			if (pStore.FontIDs !== undefined)
			{
				for(var i = 0; i < pStore.FontIDs.length; i++)
				{
					pTGInfo.fonts[i] = pStore.FontIDs[i];
				}
			}
			if (pStore.TilesetIDs !== undefined)
			{
				for(var i = 0; i < pStore.TilesetIDs.length; i++)
				{
					pTGInfo.tilesets[i] = pStore.TilesetIDs[i];
				}
			}

			// Spine sprites now just reference textures from the group so we don't need to retrieve them separately

			g_pTextureGroupInfoManager.AddTextureGroupInfo(pTGInfo);
		}
	}

	// Load the games hiscore table
	highscore_clear();
    highscore_load();



	// Init globals and constants "IF" the functions exist
	if (typeof gmlConst == 'function'){
    	g_gmlConst = new gmlConst();
    }
    if (typeof gmlInitGlobal == 'function'){
    	gmlInitGlobal();
    }

    // Init Loaded extensions...
	if (_GameFile.Extensions !== undefined)
	{
		for (i = 0; i < _GameFile.Extensions.length; i++)
		{
			var pExt = _GameFile.Extensions[i];
		   
			if (pExt.init != undefined) {
			    try {
			        var pFunc = eval(pExt.init);
			        if (pFunc) pFunc();
			    }
                catch (ex){
		            yyError("Error calling extension initialisation function: " + pExt.init  + " exception: " + ex.toString() );
		            }
		        }
		        else if (pExt.initfuncs != undefined) {

		            for (var j = 0; j < pExt.initfuncs.length; j++) {
		                try {
		                    var pFunc = eval(pExt.initfuncs[j]);
		                    if (pFunc) pFunc();
		                }
                        catch (ex){
                            yyError("Error calling extension initialisation function: " + pExt.initfuncs[j]  + " exceptio: " + ex.toString() );
		                }
		        }
			    //if (pExt.init) pExt.init();
			}
		}
	}
}