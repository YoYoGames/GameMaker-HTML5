// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyASync.js
// Created:			02/08/2011
// Author:			Mike
// Project:			HTML5
// Description:		Used to load images, sounds and files ASync across the web.
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 02/08/2011		V1.0		MJD		1st version
//
// **********************************************************************************************************************

var ASYNC_UNKNOWN = 0,
    ASYNC_IMAGE = 1,
    ASYNC_SPRITE = 2,
    ASYNC_BACKGROUND = 3,
    ASYNC_SOUND = 4,
    ASYNC_WEB = 5,
    ASYNC_USER = 6,
	ASYNC_BINARY = 7,
	ASYNC_NETWORKING = 8,
	ASYNC_AUDIO_PLAYBACK = 9,
    ASYNC_SYSTEM_EVENT = 10,            // device discovery/loss, user login

    ASYNC_STATUS_NONE=0,
    ASYNC_STATUS_LOADED=1,
    ASYNC_STATUS_ERROR=-1,
    
    ASYNC_WEB_STATUS_LOADED=0,
    ASYNC_WEB_STATUS_LOADING=1,
    ASYNC_WEB_STATUS_ERROR=-1;
    
    

var g_AsyncLookup_obj = [];
var g_AsyncLookup_data = [];



function AsyncAlloc(_obj, _data) {
	g_AsyncLookup_obj.push(_obj);
	g_AsyncLookup_data.push(_data);
}

function AsyncAlloc_pop(_obj) {

	var i=0;
	for (i = 0; i < g_AsyncLookup_obj.length; i++)
	{
		if (g_AsyncLookup_obj[i] == _obj)
		{
			var pFile = g_AsyncLookup_data[i];
			g_AsyncLookup_data.splice(i, 1);
			g_AsyncLookup_obj.splice(i, 1);
			return pFile;
		}
	}
	return undefined;
}


// #############################################################################################
/// Function:<summary>
///          	An ASync node
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyASyncNode() {
	this.m_Name = "";
	this.m_ID = -1;
	this.m_Status = 0;
	this.m_pObject = null;
	this.m_Type = ASYNC_UNKNOWN;
	this.m_Complete = false;
}



// #############################################################################################
/// Function:<summary>
///             IMAGE load callback
///          </summary>
///
/// In:		 <param name="_event"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ASync_ImageLoad_Callback(_event) {


	var pTPE,pTexture,pFile = AsyncAlloc_pop(_event.currentTarget); // _event.currentTarget.GameMakerASyncLoad;
	//var pFile = _event.currentTarget.GameMakerASyncLoad;
    if( !pFile ) return;

    pFile.m_Complete = true;
    pFile.m_Status = ASYNC_STATUS_LOADED;
    
    
    if( pFile.m_Type == ASYNC_SPRITE )
    {
        // Now actually UPDATE the sprite and TPage stuff.
        var pSpr = g_pSpriteManager.Get( pFile.m_ID );
        if (pSpr === null) return;
		if (!pSpr.ppTPE) return;
		if (!pSpr.ppTPE[0]) return;
        if (!pSpr.ppTPE[0].texture) return;
        
        pTexture = pSpr.ppTPE[0].texture;
        pTexture.webgl_textureid=undefined;
        
        var w = pTexture.width;
        var h = pTexture.height;
        var sprw = Math.floor(w/pSpr.numb);
        var x = 0;
        pSpr.width = sprw;
	    pSpr.height = h;
	    pSpr.bbox.right = sprw;
	    pSpr.bbox.bottom = h;
	    pSpr.CalcCullRadius();

        for(var i=0;i<pSpr.numb;i++)
        {
            pTPE = pSpr.ppTPE[i];
            
            pTPE.x = x;
            pTPE.w = sprw;
            pTPE.h = h;
	        pTPE.CropWidth = pTPE.w;
	        pTPE.CropHeight = pTPE.h;
	        pTPE.ow = pTPE.w;
	        pTPE.oh = pTPE.h;
	        pTPE.cache = [];
	        pTPE.count = 0;
	        pTPE.maxcache = 4;
	        
	        x+=sprw;
	    }
        return;
    }    
    
    if( pFile.m_Type == ASYNC_BACKGROUND )
    {
        // Now actually UPDATE the sprite and TPage stuff.
        var pBack = g_pBackgroundManager.GetImage( pFile.m_ID );
        if( pBack === null ) return;
        
        pTPE =pBack.TPEntry;
        pTexture = pTPE.texture;
        pTexture.webgl_textureid=undefined;
            
        pTPE.w = pTexture.width;
        pTPE.h = pTexture.height;
        pTPE.CropWidth = pTPE.w;
        pTPE.CropHeight = pTPE.h;
        pTPE.ow = pTPE.w;
        pTPE.oh = pTPE.h;
        pTPE.cache = [];
        pTPE.count = 0;
        pTPE.maxcache = 4;
        
        return;
    }
    if (pFile.m_Type == ASYNC_SOUND)
    {
    	pFile.m_pObject.complete = true;

    	var pSnd = g_pSoundManager.Get(pFile.m_ID);
    	pSnd.AddSound( g_RawSounds[pFile.m_Name] );
    	return;
    }   
    
    if (pFile.m_Type == ASYNC_BINARY)
    {
        var X = pFile.m_pObject;
        if( X.status!=200 ){
            pFile.m_Status = X.status;
        }else{
            var pBuff = g_BufferStorage.Get(pFile.m_pObject.ms_buffer);
            var offset = pFile.m_pObject.ms_offset;
            var doresize=false;
            var size = pFile.m_pObject.ms_size;
            var arrayBuffer = pFile.m_pObject.response;                 // Note: not oReq.responseText
            if (arrayBuffer) 
            {
                var byteArray = new Uint8Array(arrayBuffer);
                var _type =0;
                if( size==-1 ){
                    size = byteArray.byteLength;       
                    
                    // on a -1, native copies in the WHOLE file, allowing the buffer to grow to fit
                    doresize=true;
                    _type = pBuff.m_Type;
                    pBuff.m_Type = eBuffer_Format_Grow;
                }
                    
                if( size>byteArray.byteLength ) size = byteArray.byteLength;
                
                var CurrentIndex = buffer_tell(pFile.m_pObject.ms_buffer);
                pBuff.yyb_seek(eBuffer_Start,offset);
                for (var i = 0; i < byteArray.byteLength; i++) {
                    var a = byteArray[i];
                    pBuff.yyb_write(eBuffer_U8, a);                    
                }
                pBuff.yyb_seek(eBuffer_Start,CurrentIndex);
                if(doresize) pBuff.m_Type = _type;
            }    
        }	
    	return;
    }        
}


// #############################################################################################
/// Function:<summary>
///             IMAGE load error callback
///          </summary>
///
/// In:		 <param name="_event"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ASync_ImageLoad_Error_Callback(_event)
{
	var pFile = AsyncAlloc_pop(_event.currentTarget); // _event.currentTarget.GameMakerASyncLoad;
    if( !pFile ) return;

    pFile.m_Complete = true;
    pFile.m_Status = ASYNC_STATUS_ERROR;
}




// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyASyncManager() {
	this.queue = [];
	this.queueLength = 0;
}

// #############################################################################################
/// Function: <summary>
///				Get the pool
///           </summary>
// #############################################################################################
yyASyncManager.prototype.Add = function (_id, _filename, _type, _object) {

	// Add a new file to "watch"
	var pFile = new yyASyncNode();
	pFile.m_ID = _id;
	pFile.m_Name = _filename;
	pFile.m_pObject = _object;
	pFile.m_Type = _type;
	this.queue[this.queueLength++] = pFile;

	AsyncAlloc(_object ,  pFile );
	//_object.GameMakerASyncLoad = pFile;
	return pFile;
};



// #############################################################################################
/// Function: <summary>
///				Get the pool
///           </summary>
// #############################################################################################
yyASyncManager.prototype.Process = function () {
	var map = ds_map_create();
	g_pBuiltIn.async_load = map;

	var queue = this.queue;
	for (var i = 0; i < this.queueLength; i++)
	{
		var pFile = queue[i];
		if (pFile !== null)
		{
			if (pFile.m_Complete)
			{
				ds_map_clear(map);
				//
				if (pFile.m_Type == ASYNC_NETWORKING)
				{
					// (all async_load fields are already filled out in m_pObject)
					var pObject = pFile.m_pObject;
					for (var prop in pObject) {
						if (pObject.hasOwnProperty(prop)) {
							ds_map_add(map, prop, pObject[prop]);
						}
					}
				} else if (pFile.m_Type == ASYNC_BINARY)
				{
					ds_map_add(map, "filename", pFile.m_Name);
					ds_map_add(map, "url", pFile.m_Name);
				} else if (pFile.m_Type == ASYNC_WEB)
				{
					ds_map_add(map, "filename", "");
					ds_map_add(map, "url", pFile.m_Name);
					ds_map_add(map, "result", pFile.m_Data);
					ds_map_add(map, "http_status", pFile.m_http_status);
					ds_map_add(map, "response_headers", pFile.m_ResponseHeadersMap);
				} else if (pFile.m_Type == ASYNC_USER)
				{
					ds_map_add(map, "username", pFile.username);
					ds_map_add(map, "password", pFile.password);
					ds_map_add(map, "url", "");
					ds_map_add(map, "result", pFile.result);
					ds_map_add(map, "value", pFile.value);
					ds_map_add(map, "http_status", 0);
				} else if (pFile.m_Type == ASYNC_AUDIO_PLAYBACK) {
				    ds_map_add(map, "queue_id", pFile.queue_id);
				    ds_map_add(map, "buffer_id", pFile.buffer_id);
				    ds_map_add(map, "queue_shutdown", pFile.queue_shutdown);
				} else if (pFile.m_Type == ASYNC_SYSTEM_EVENT) {
				    ds_map_add(map, "event_type", pFile.event_type);
				    ds_map_add(map, "pad_index", pFile.pad_index);
				}else{
					ds_map_add(map, "url", "");
					ds_map_add(map, "result", "");
					ds_map_add(map, "http_status", 0);
					ds_map_add(map, "filename", pFile.m_Name);
				}


				if (pFile.m_Type != ASYNC_NETWORKING)
				{
					ds_map_add(map, "id", pFile.m_ID);
					ds_map_add(map, "status", pFile.m_Status);
				}

				if (pFile.m_Type == ASYNC_IMAGE) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_IMAGE_LOAD, 0, true); // Throw an event for the image
				else if (pFile.m_Type == ASYNC_SPRITE) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_IMAGE_LOAD, 0, true); // Throw an event for the image
				else if (pFile.m_Type == ASYNC_BACKGROUND) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_IMAGE_LOAD, 0, true); // Throw an event for the image
				else if (pFile.m_Type == ASYNC_SOUND) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_SOUND_LOAD, 0, true);
				else if (pFile.m_Type == ASYNC_WEB) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_ASYNC, 0, true);
				else if (pFile.m_Type == ASYNC_USER) g_pObjectManager.ThrowEvent(EVENT_OTHER_WEB_USER_INTERACTION, 0, true);
				else if (pFile.m_Type == ASYNC_BINARY) g_pObjectManager.ThrowEvent(EVENT_OTHER_ASYNC_SAVE_LOAD, 0, true);
				else if (pFile.m_Type == ASYNC_NETWORKING) g_pObjectManager.ThrowEvent(EVENT_OTHER_NETWORKING, 0, true);
				else if (pFile.m_Type == ASYNC_AUDIO_PLAYBACK) g_pObjectManager.ThrowEvent(EVENT_OTHER_AUDIO_PLAYBACK, 0, true);
				else if (pFile.m_Type == ASYNC_SYSTEM_EVENT) g_pObjectManager.ThrowEvent(EVENT_OTHER_SYSTEM_EVENT, 0, true);

				// Done load, so delete handle.
				this.queue[i] = null;

                // Web specifically needs to kill the ds_map used for response headers
				if (pFile.m_Type == ASYNC_WEB) {
				    ds_map_destroy(pFile.m_ResponseHeadersMap);
				}
				// Networking data event needs to get rid of the temporary buffer
				if (pFile.m_Type == ASYNC_NETWORKING && pFile.m_pObject.type == NETWORK_TYPE_DATA) {
					buffer_delete(pFile.m_pObject.buffer);
				}
			}
		}
	}

	this.queueLength = 0;

	ds_map_destroy(map);
	g_pBuiltIn.async_load = -1;
};



