// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yySkeletonInstance.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Initialise storage for the instance specific portion of a Skeleton animation
///          </summary>
// #############################################################################################
/** @constructor */
function yySkeletonInstance(_skeletonSprite) {  

	this.m_forceUpdate = false;
	this.m_lastFrame = 0;
	this.m_lastFrameDir = 0;
    this.m_drawCollisionData = false;
	this.m_angle = 0;
	this.m_rotationMatrix = new yyRotationMatrix(0);
	this.m_reversedRotationMatrix = new yyRotationMatrix(0);

	this.m_skeleton = null;
	this.m_skeletonBounds = null;
	this.m_animation = null;
	this.m_animationState = null;
	this.m_animationStateData = null;	
	this.m_skeletonData = null;
	
	// User created attachments from Sprites
	this.m_attachments = [];
    
	this.SetupSkeletonData(_skeletonSprite.m_skeletonData);		
};


// #############################################################################################
/// Function:<summary>
///             Clone a skeleton instance
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.Clone = function () {
    
    var cloned = new yySkeletonInstance({ m_skeletonData: this.m_skeletonData });
    return cloned;
};


// #############################################################################################
/// Function:<summary>
///             Does common initialisation based on provided skeleton data
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetupSkeletonData = function (_skeletonData) {    
                   
	this.m_skeletonData = _skeletonData;
	
    this.m_skeleton = new spine.Skeleton(_skeletonData);
	this.m_animationStateData = new spine.AnimationStateData(this.m_skeleton.data);
	this.m_animationState = new spine.AnimationState(this.m_animationStateData);	
	
	var listener = new Object();	
	listener.start = function(_trackindex) {
	    // Nothing at the moment
	};
	listener.end = function(_trackindex) {
	    // Nothing at the moment
	};
	listener.complete = function(_trackindex, _loopCount) {
	    // Nothing at the moment
	};
	listener.event = function(_trackindex, _event) {
	
	    //fill response map 
        var map = ds_map_create();
        g_pBuiltIn.event_data = map;
        ds_map_add(map, "name", _event.data.name);
        ds_map_add(map, "track", _trackindex );
        ds_map_add(map, "integer", _event.intValue);
        ds_map_add(map, "float", _event.floatValue);

        var stringValue = _event.stringValue ? _event.stringValue : _event.data.stringValue;
        ds_map_add(map, "string", stringValue);
        
        g_pObjectManager.ThrowEvent(EVENT_OTHER_ANIMATIONEVENT,0);            
        
        ds_map_destroy(map);
        g_pBuiltIn.event_data = -1;
	};
	
	this.m_animationState.addListener( listener );

	// Select a default animation	
	if (_skeletonData.animations.length > 0) {		
		this.SelectAnimation(null);
	}					
	this.SelectSkin(null);

	// Create a collision primitive for the skeleton
	this.m_skeletonBounds = new spine.SkeletonBounds();	
};

// #############################################################################################
/// Function:<summary>
///             Work out how many frames represent the current animation
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.FrameCount = function (_sprite, _track) {

    if (_track == undefined)
        _track = 0;
        
    if (_track < 0)
        return 0;
        
	if (_track >= this.m_animationState.tracks.length)
	    return 0;
	    
    var updatesCount = g_RunRoom ? g_RunRoom.GetSpeed() : 30;
    
    if(g_isZeus)
    {
        if ((_sprite != undefined) && (_sprite != null))
        {
            if (_sprite.playbackspeedtype == ePlaybackSpeedType_FramesPerGameFrame)
            {
                updatesCount = g_GameTimer.GetFPS();
            }
            else
            {
                updatesCount = _sprite.playbackspeed;
            }
        }
        else
        {
            updatesCount = g_GameTimer.GetFPS();
        }
    }    
    
	//return ~~((updatesCount * this.m_animation.duration) + 0.5);
	
	if(this.m_animationState.tracks[_track]==null)
	{
	    return ~~((updatesCount * this.m_animation.duration) + 0.5);
	}
	
	return ~~((updatesCount * this.m_animationState.tracks[_track].animation.duration) + 0.5);
};

function fwrap(_val, _div)
{
    // _div needs to be positive
    if (_div < 0.0)
        return _val;
        
    var normval = _val / _div;
    var frac = normval - Math.floor(normval);
    var scaledfrac = frac * _div;
    
    return scaledfrac;
}

// #############################################################################################
/// Function:<summary>
///             Get the index of the animation on the specified track
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.ImageIndex = function (_track) {

    if (_track < 0)
        return 0;
        
	if (_track >= this.m_animationState.tracks.length)
	    return 0;

	if (this.m_animationState.tracks[_track] === null)
	    return 0;
	    
    var updatesCount = g_RunRoom ? g_RunRoom.GetSpeed() : 30;
    
    if(g_isZeus)
    {
        updatesCount = g_GameTimer.GetFPS();
    }
    
    if (updatesCount <= 0)
        return 0;
        
    var frameIndex = this.m_animationState.tracks[_track].trackTime * updatesCount;
    frameIndex = fwrap(frameIndex, updatesCount * this.m_animationState.tracks[_track].animation.duration );    
	return ~~(frameIndex + 0.5);
};

yySkeletonInstance.prototype.SetImageIndex = function (_track, _index) {
	if (_track < 0)
		return;	

	if (_track >= this.m_animationState.tracks.length)
	    return;

	if (this.m_animationState.tracks[_track] === null)
	    return;

    var updatesCount = g_RunRoom ? g_RunRoom.GetSpeed() : 30;
    
    if(g_isZeus)
    {
        updatesCount = g_GameTimer.GetFPS();
    }
    
    if (updatesCount <= 0)
        return 0;
	
    var frameIndex = fwrap(_index, updatesCount * this.m_animationState.tracks[_track].animation.duration );
    var time = (frameIndex / updatesCount);

    this.m_animationState.tracks[_track].trackTime = time;
	this.m_forceUpdate = true;
};

yySkeletonInstance.prototype.Looping = function (_track) {
	if (_track < 0)
		return false;

	if (_track >= this.m_animationState.tracks.length)
	    return false;

	if (this.m_animationState.tracks[_track] === null)
	    return false;

	return this.m_animationState.tracks[_track].loop;
};

yySkeletonInstance.prototype.Finished = function (_track) {
	if (_track < 0)
		return false;

	if (_track >= this.m_animationState.tracks.length)
	    return false;

	if (this.m_animationState.tracks[_track] === null)
	    return false;

	var track = this.m_animationState.tracks[_track];
	return !track.loop && track.trackTime >= track.animation.duration;
};

// #############################################################################################
/// Function:<summary>
///             Select the animation to use
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SelectAnimation = function (_name, _loop = true) {

    this.SelectAnimationExt(_name, 0, _loop);
};

// #############################################################################################
/// Function:<summary>
///             Select the animation, and track, by name. If track is 0 and the animation
///				is NULL then it will select a default animation
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SelectAnimationExt = function (_name, _track, _loop = true) {

    var animation = null;
	if (((_name === null) || (_name === undefined)) && (_track === 0)) {
	
		if (this.m_skeletonData.animations.length > 0) {
		
			animation = this.m_skeletonData.findAnimation(this.m_skeletonData.animations[0].name);
		}
	}
	else {	    
		animation = this.m_skeletonData.findAnimation(_name);
	}

	if (animation !== null && animation !== undefined) {
	
	    if (_track === 0) {
	        this.m_lastFrame = 0;
	        this.m_lastFrameDir = 0;
		    this.m_animation = animation;
		}
		//this.m_animationState.setAnimation(_track, animation, true);		
		this.m_animationState.setAnimation(_track, animation.name, _loop);
	}	
};


// #############################################################################################
/// Function:<summary>
///             Select the skin to use
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SelectSkin = function (_skin) {

	var skinname = _skin;
    if (_skin === null || _skin === undefined) {
    
        if (this.m_skeletonData.defaultSkin) {
			skinname = this.m_skeletonData.defaultSkin.name;		    
		}
	}

	if (skinname != null)
	{
		if(skinname.__type == "[SkeletonSkin]")
		{
			if (this.m_skeleton.m_skin === skinname.m_skin)
			{
				return; // don't change skin if we already have it set
			}
			
			this.m_skeleton.setSkin(skinname.m_skin);
			this.m_skeleton.setSlotsToSetupPose();
		}
		else{
			if  ((this.m_skeleton.skin != null) && (this.m_skeleton.skin.name != null))
			{
				if (skinname == this.m_skeleton.skin.name)
				{
					return; // don't change skin if we already have it set
				}
			}
			
			this.m_skeleton.setSkinByName(skinname);
			this.m_skeleton.setSlotsToSetupPose();
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Set the blending factor between two animations
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetAnimationMix = function (_from, _to, _duration) {

    this.m_animationStateData.setMix(_from, _to, _duration);
};


// #############################################################################################
/// Function:<summary>
///				Set the attachment for a slot
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetAttachment = function (_slotName, _attachmentName) {

    var slot = this.m_skeleton.findSlot(_slotName);	
	if ((slot !== null) && (slot !== undefined)) {
	
	    if (typeof(_attachmentName) === 'number') {
			slot.setAttachment(null);
		}
		else {
		
		    // Search the skins for a pre-existing attachment
			//var slotIndex = this.m_skeleton.findSlotIndex (_slotName);		
			var slotIndex = -1;
			if ((slot.data !== null) && (slot.data !== undefined))
			{
				slotIndex = slot.data.index;
			}
			for (var skinIndex = 0; skinIndex < this.m_skeletonData.skins.length; skinIndex++) {
				var skin = this.m_skeletonData.skins[skinIndex];			
				var attachment = skin.getAttachment(slotIndex, _attachmentName);			
				if (attachment) {
					slot.setAttachment(attachment);
					return;
				}
			}
			
			for (var attachIndex = 0; attachIndex < this.m_attachments.length; attachIndex++) {
			    var attachment = this.m_attachments[attachIndex].attachment;
			    if (attachment.name === _attachmentName) {
			        slot.setAttachment(attachment);
					return;
			    }
			}
		}
	}
};

yySkeletonInstance.prototype.SetSlotColour = function (_slotName, _gmCol)
{
    var slot = this.m_skeleton.findSlot(_slotName);
    if ((slot !== null) && (slot !== undefined))
    {
        var r, g, b, a;

        r = (_gmCol & 0xff) / 255.0;
        g = ((_gmCol & 0xff00) >> 8) / 255.0;
        b = ((_gmCol & 0xff0000) >> 16) / 255.0;

        if (slot.color != undefined)
        {
            a = slot.color.a;
        }
        else
        {
            a = 1.0;
        }

        slot.color = new spine.Color(r, g, b, a);
    }
};

yySkeletonInstance.prototype.SetSlotAlpha = function (_slotName, _gmAlpha)
{
    var slot = this.m_skeleton.findSlot(_slotName);
    if ((slot !== null) && (slot !== undefined))
    {
        var r, g, b, a;

        a = _gmAlpha;

        if (slot.color != undefined)
        {
            r = slot.color.r;
            g = slot.color.g;
            b = slot.color.b;
        }
        else
        {
            r = 1.0;
            g = 1.0;
            b = 1.0;
        }

        slot.color = new spine.Color(r, g, b, a);
    }
};

yySkeletonInstance.prototype.GetSlotColour = function (_slotName, _gmCol)
{
    var slot = this.m_skeleton.findSlot(_slotName);
    if ((slot !== null) && (slot !== undefined))
    {
        var col;

        if (slot.color != undefined)
        {
            col = slot.color.r * 255.0;
            col |= (slot.color.g * 255.0) << 8;
            col |= (slot.color.b * 255.0) << 16;
            col |= 0xff000000;
        }
        else
        {
            col = 0xffffffff;
        }

        return col;
    }

    return 0xffffffff;
};

yySkeletonInstance.prototype.GetSlotAlpha = function (_slotName, _gmCol)
{
    var slot = this.m_skeleton.findSlot(_slotName);
    if ((slot !== null) && (slot !== undefined))
    {
        if (slot.color != undefined)
        {
            return slot.color.a;
        }
        else
        {
            return 1.0;
        }
    }

    return 1.0;
};

// #############################################################################################
/// Function:<summary>
///				Find the attachment if it exists
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.FindAttachment = function( _slotName, _attachmentName, _customOnly = false)
{
	var ret = undefined;

	if(!_customOnly)
	{
		//var slotIndex = this.m_skeleton.findSlotIndex (_slotName);		
		var slotIndex = -1;
		var slot = this.m_skeleton.findSlot(_slotName);
		if ((slot !== null) && (slot !== undefined) && (slot.data !== null) && (slot.data !== undefined))
		{
			slotIndex = slot.data.index;
		}
		for (var skinIndex = 0; skinIndex < this.m_skeletonData.skins.length; skinIndex++) {
			var skin = this.m_skeletonData.skins[skinIndex];			
			var attachment = skin.getAttachment(slotIndex, _attachmentName);			
			if (attachment) {
				ret = _attachmentName;
				break;
			} // end if
		} // end for
	}

	if (ret === undefined ) {
		for (var attachIndex = 0; attachIndex < this.m_attachments.length; attachIndex++) {
		    var attachment = this.m_attachments[attachIndex].attachment;
		    if (attachment.name === _attachmentName) {
		        ret = _attachmentName;
				break;
		    } // end if
		} // end for
	} // end if

	return ret;
};

// #############################################################################################
/// Function:<summary>
///          	Create a new attachment for the instance's skeleton based on an existing sprite
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.CreateAttachment = function (_attachmentName, _pSpr, _ind, _xo, _yo, _xs, _ys, _rot, _spineCol, _gmCol, _gmAlpha, _replaceExisting) {
    
    var pTPE = _pSpr.ppTPE[_ind % _pSpr.GetCount()];
	var pTexture = g_Textures[pTPE.tp];

	var replaceAttachmentIdx;
	for (replaceAttachmentIdx = 0; replaceAttachmentIdx < this.m_attachments.length; replaceAttachmentIdx++)
	{
		var attachment = this.m_attachments[replaceAttachmentIdx].attachment;
		if (attachment.name === _attachmentName)
		{
			if(_replaceExisting)
			{
				break;
			}
			else{
				yyError("Custom attachment with name '" + _attachmentName + "' already exists");
			}
		}
	}

	// Hmmm.. if this sprite has been added using sprite_add() then the texture might not have been loaded yet
	// There's not a particularly great way of handling that case at this point, so just show an error and bail
	// The user should be able to handle it themselves by waiting on the async completion event before creating the attachment
	if (!pTexture.complete)
	{
	    debug("Trying to create attachment " + _attachmentName + " with texture that hasn't been loaded yet.");
	    return;
	 }

	// Setup an atlas page, a region within that atlas and the atlas to base the new attachment on
	var page = new spine.TextureAtlasPage();
	page.name = _pSpr.pName;
	page.rendererObject = pTPE.tp;
	page.width = pTPE.texture.width;
	page.height = pTPE.texture.height;
	page.minFilter = spine.TextureFilter.Linear;
	page.magFilter = spine.TextureFilter.Linear;
	page.uWrap = spine.TextureWrap.ClampToEdge;
    page.vWrap = spine.TextureWrap.ClampToEdge;
    
	page.texture = new yySpineTexture();	
	page.texture.width = page.width;
	page.texture.height = page.height;
	page.texture.rendererObject = pTPE.tp;
	page.texture.image = pTexture;
	page.texture.setFilters(page.minFilter, page.magFilter);
    page.texture.setWraps(page.uWrap, page.vWrap);
	
	var region = new spine.TextureAtlasRegion();
	region.page = page;	
	region.name = _attachmentName;	
	region.x = 0;
	region.y = 0;
	region.width = _pSpr.width;
	region.height = _pSpr.height;
	region.u = pTPE.x / pTPE.texture.width;
	region.v = pTPE.y / pTPE.texture.height;
	region.u2 = (pTPE.x + pTPE.w) / pTPE.texture.width;
	region.v2 = (pTPE.y + pTPE.h) / pTPE.texture.height;
	region.offsetX = 0;
	region.offsetY = 0;
	region.originalWidth = region.width;
	region.originalHeight = region.height;
	region.index = 0;
	region.degrees = 0;
	//region.rotate = 0; // false	
	region.splits = null;
	region.pads = null;	
	region.texture = page.texture;	
    
	var atlas = new spine.TextureAtlas("");
	atlas.pages.push(page);
	atlas.regions.push(region);

	var attachmentLoader = new spine.AtlasAttachmentLoader(atlas);
	var pAttachment = attachmentLoader.newRegionAttachment(this.m_skeletonData.skins[0], _attachmentName, _attachmentName);
	
	pAttachment.width = region.width;
	pAttachment.height = region.height;
	pAttachment.scaleX = _xs;
	pAttachment.scaleY = _ys;
	pAttachment.x = _xo;
	pAttachment.y = _yo;
	pAttachment.rotation = _rot;

	if ((_gmCol != undefined) && (_gmAlpha != undefined))
	{
	    var gmr = (_gmCol & 0xff) / 255.0,
	    gmg = ((_gmCol & 0xff00) >> 8) / 255.0,
	    gmb = ((_gmCol & 0xff0000) >> 16) / 255.0;

	    pAttachment.color = new spine.Color(gmr, gmg, gmb, _gmAlpha);
	}
	else if (_spineCol != undefined)
	{
	    pAttachment.color = new spine.Color();
	    pAttachment.color.setFromColor(_spineCol);
	}
	
	pAttachment.updateOffset(pAttachment);	

	if(replaceAttachmentIdx < this.m_attachments.length)
	{
		// Replace the existing attachment+atlas with new one.

		this.ReplaceSlotAttachments(this.m_attachments[replaceAttachmentIdx].attachment, pAttachment);

		this.m_attachments[replaceAttachmentIdx] = { attachment: pAttachment, atlas: atlas };
	}
	else{
		// Store details created for use with this attachment
		this.m_attachments.push({ attachment: pAttachment, atlas: atlas });
	}
};

yySkeletonInstance.prototype.DestroyAttachment = function (_attachmentName)
{
	for (var i = 0; i < this.m_attachments.length; i++)
	{
		var attachment = this.m_attachments[i].attachment;
		if (attachment.name === _attachmentName)
		{
			this.ReplaceSlotAttachments(attachment, null);
			this.m_attachments.splice(i, 1);

			return true;
		}
	}

	return false;
};

yySkeletonInstance.prototype.ReplaceSlotAttachments = function (_oldAttachment, _newAttachment)
{
	for(var i = 0; i < this.m_skeleton.slots.length; ++i)
	{
		var slot = this.m_skeleton.slots[i];

		if(slot && slot.getAttachment() === _oldAttachment)
		{
			slot.setAttachment(_newAttachment);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Set the blending factor between two animations
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetDrawCollision = function (_val) {

    this.m_drawCollisionData = _val;
};


// #############################################################################################
/// Function:<summary>
///             Sets the animation to the time stamp referred to by the 
///             frame index, set the orientation and update bounds
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetAnimationTransform = function (_ind, _x, _y, _scalex, _scaley, _angle, _eventInstance, _sprite) {

	var skeleton = this.m_skeleton;
	var root = this.m_skeleton.getRootBone();
	var lastFrame = this.m_lastFrame;
	var forceUpdate = this.m_forceUpdate;

	var animationUpdated = false;

	_scaley *= -1.0; /* Y scale seems to be inverted somewhere... */

    var    updateWorldTransform = (_eventInstance !== undefined);
    
    // Try and avoid unnecessary repetition of effort
    if ((forceUpdate == true) ||
    	(lastFrame !== _ind) ||
        (skeleton.x !== _x) || (skeleton.y !== _y) ||
        (skeleton.scaleX != _scalex) || (skeleton.scaleY != _scaley) ||
		(this.m_angle !== _angle))
    {
        var _spr = _sprite;
        if (((_sprite == undefined) || (_sprite == null)) && (_eventInstance != undefined) && (_eventInstance != null))
        {
            var index;
            index = _eventInstance.sprite_index;

            _spr = g_pSpriteManager.Get(index);
        }
	    var frameCount = this.FrameCount(_spr, 0);
	    if (frameCount > 0)
	    {
	        var frameCurr = _ind % frameCount,
			    frameLast = this.m_lastFrame % frameCount,
			    duration = this.m_animation.duration,
			    timelineCount = this.m_animation.timelines.length;
			    
	        var currFrameDir = 0;
	        if (Math.abs(frameCurr - frameLast) < (frameCount / 2))
	        {
	            if (frameCurr > frameLast)
	                currFrameDir = 1;
	            else if (frameCurr < frameLast)
	                currFrameDir = -1;
	            else
	                currFrameDir = 0;
	        }

	        if ((this.m_lastFrameDir > 0) && (frameCurr < frameLast))
	        {
	            // Assume we're moving in the same direction as last frame when handling wrapping behaviour
	            frameCurr += frameCount;
	        }
	        /*else if ((m_lastFrameDir < 0) && (frameCurr > frameLast))
			{
				frameLast += frameCount;
			}*/

	        //if (frameLast > frameCurr) {
            if (frameLast - frameCurr >= frameCount - 1) {
				frameCurr += frameCount;
            }

            this.m_lastFrameDir = currFrameDir;
			
			var frameDelta = (frameCurr - frameLast) / frameCount;			
	        this.m_animationState.update(frameDelta * duration);	        
	    }

	    this.m_animationState.apply(this.m_skeleton);

	    this.m_lastFrame = _ind;		    

	    skeleton.x = _x;
	    skeleton.y = _y;
	    skeleton.scaleX = _scalex;
	    skeleton.scaleY = _scaley;
	    this.m_angle = _angle;
	    this.m_rotationMatrix = new yyRotationMatrix(-_angle);
	    this.m_reversedRotationMatrix = new yyRotationMatrix(_angle);
	    
	    updateWorldTransform = true;
		animationUpdated = true;

	    this.m_forceUpdate = false;
	}
	 
	// If the call is happening during an implicit sprite draw, or a draw_self() call, then we must
	// give the user the opportunity to modify bone positions during an animation update call
	if (updateWorldTransform) {
	
	    if (_eventInstance) {
	        _eventInstance.PerformEvent(EVENT_OTHER_ANIMATIONUPDATE, 0, _eventInstance, null);
	    }

	    this.UpdateWorldTransformAndBounds();
    }

	return animationUpdated;
};

yySkeletonInstance.prototype.UpdateWorldTransformAndBounds = function()
{
	var skeleton = this.m_skeleton;

	skeleton.updateWorldTransform();
	this.m_skeletonBounds.update(this.m_skeleton, 1);

	/* Apply rotation to the m_skeletonBounds used for collision checks. */

	var origin = this.GetScreenOrigin();
	_RotateSkeletonBounds(this.m_skeletonBounds, this.m_rotationMatrix, origin[0], origin[1]);
};

function _RotateSkeletonBounds(_bounds, _rotationMatrix, _rotationOriginX, _rotationOriginY)
{
	var firstVertex = true;

	for (var i = 0; i < _bounds.polygons.length; ++i)
	{
		var poly = _bounds.polygons[i];

		for (var j = 0; j < poly.length;)
		{
			var tmp = RotatePointAroundOrigin([ poly[j], poly[j + 1] ], [ _rotationOriginX, _rotationOriginY ], _rotationMatrix);
			var polyX = poly[j++] = tmp[0];
			var polyY = poly[j++] = tmp[1];

			if (firstVertex)
			{
				_bounds.minX = _bounds.maxX = polyX;
				_bounds.minY = _bounds.maxY = polyY;

				firstVertex = false;
			}
			else {
				_bounds.minX = Math.min(_bounds.minX, polyX);
				_bounds.maxX = Math.max(_bounds.maxX, polyX);

				_bounds.minY = Math.min(_bounds.minY, polyY);
				_bounds.maxY = Math.max(_bounds.maxY, polyY);
			}
		}
	}
}

// #############################################################################################
/// Function:<summary>
///				Sets the currrent animation to the time stamp referred to
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetAnimationTransformTime = function (_time, _x, _y, _scalex, _scaley, _angle) {

    // Translate the time to a frame according to the room speed
	var frameCount = this.FrameCount(undefined, 0);
	var frame = ~~(frameCount * (_time / this.m_animation.duration) + 0.5);
	this.SetAnimationTransform(frame, _x, _y, _scalex, _scaley, _angle);
};

// #############################################################################################
/// Function:<summary>
///				Get the overall bounding box for the whole of the animation's collision polys
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.ComputeBoundingBox = function (_pRect, _ind, _x, _y, _scalex, _scaley, _angle) {	

	if (this.m_skeletonBounds != null)
	{
		var skeletonBounds = this.m_skeletonBounds;
			
		this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle, g_skeletonDrawInstance);

		if (skeletonBounds.boundingBoxes.length > 0)
		{    
			_pRect.left = ~~(skeletonBounds.minX + 0.5);
			_pRect.right = ~~(skeletonBounds.maxX + 0.5);
			_pRect.top = ~~(skeletonBounds.minY + 0.5);
			_pRect.bottom = ~~(skeletonBounds.maxY + 0.5);
			return true;
		}
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Get the overall bounding box for the whole of the animation's collision polys (for the current position\animation state)
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetBoundingBox = function (_pRect) {	
    
	if (this.m_skeletonBounds != null)
	{
		this.UpdateWorldTransformAndBounds();
		
		if (this.m_skeletonBounds.boundingBoxes.length > 0)
		{
			_pRect.left = this.m_skeletonBounds.minX;
			_pRect.right = this.m_skeletonBounds.maxX;
			_pRect.top = this.m_skeletonBounds.minY;
			_pRect.bottom = this.m_skeletonBounds.maxY;
			return true;
		}
	}
	return false;
};


// #############################################################################################
/// Function:<summary>
///				Get the overall bounding box for the whole of the animation's collision polys (for the current position\animation state)
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetNumBoundingBoxAttachments = function () {	
    
    if (this.m_skeletonBounds == null)
        return 0;
        
    //this.m_skeletonBounds.update(this.m_skeleton, 1);
    this.UpdateWorldTransformAndBounds();
    return this.m_skeletonBounds.boundingBoxes.length;    
};

yySkeletonInstance.prototype.GetBoundingBoxAttachment = function (_index) {	
    
    if (this.m_skeletonBounds != null)        
    {
        if (_index >= 0)
        {
			this.UpdateWorldTransformAndBounds();
			
            if (_index < this.m_skeletonBounds.boundingBoxes.length)
            {                	    
                var polygon = this.m_skeletonBounds.polygons[_index];
                var numpoints = polygon.length / 2;
                
                var arr = [];
                arr.push(numpoints);
                arr.push(this.m_skeletonBounds.boundingBoxes[_index].name);
                
                for(var i = 0; i < numpoints; i++)
                {
                    arr.push(polygon[i * 2]);
                    arr.push(polygon[i * 2 + 1]);
                }
                
                return arr;
            }
        }
    }
    
    var arr = [];
    arr.push(0, "");
    return arr;
};

yySkeletonInstance.prototype.GetScreenOrigin = function()
{
	return [ this.m_skeleton.x, this.m_skeleton.y ];
};

// #############################################################################################
/// Function:<summary>
///				Skeleton vs Skeleton collision test
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SkeletonCollision = function (_ind, _x, _y, _scalex, _scaley, _angle,
	 _skel, _ind2, _x2, _y2, _scale2x, _scale2y, _angle2)
{
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);
	_skel.SetAnimationTransform(_ind2, _x2, _y2, _scale2x, _scale2y, _angle2);
		
	for (var n = 0; n < _skel.m_skeletonBounds.polygons.length; n++) {
    
		var boundsPoly = _skel.m_skeletonBounds.polygons[n];
		var size = boundsPoly.length / 2;
		for (var m = 0; m < size; m++) {

			// Get the line segment
			var x1, y1, x2, y2;
			x1 = boundsPoly[(m * 2) + 0];
			y1 = boundsPoly[(m * 2) + 1];
			if (m === (size - 1)) {
				x2 = boundsPoly[0];
				y2 = boundsPoly[1];
			}
			else {
				x2 = boundsPoly[((m + 1) * 2) + 0];
				y2 = boundsPoly[((m + 1) * 2) + 1];
			}

			var hit = this.m_skeletonBounds.intersectsSegment(x1, y1, x2, y2);
			if (hit !== null) {
				return true;
			}			
		}	
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Test for collision with a sprite
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SpriteCollision = function (_ind, _x, _y, _scalex, _scaley,  _angle,
	_spr, _bb2, _ind2, _x2, _y2, _scale2x, _scale2y, _angle2)
{
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);

	if (_spr == null)				{ return false; }
	if (_spr.numb <= 0 )			{ return false; }
	if (_spr.colmask.length > 0)	{ _ind2 = _ind2 % _spr.colmask.length; }
	if (_ind2 < 0)					{ _ind2 = _ind2 + _spr.colmask.length; }		
	
	
	_scale2x = 1.0 / _scale2x;
	_scale2y = 1.0 / _scale2y;

	// Compute overlapping bounding box
	var skeletonBounds = this.m_skeletonBounds;
	var l = yymax(skeletonBounds.minX, _bb2.left);
	var r = yymin(skeletonBounds.maxX, _bb2.right);
	var t = yymax(skeletonBounds.minY, _bb2.top);
	var b = yymin(skeletonBounds.maxY, _bb2.bottom);


	// "Do everything" case - rotation AND scaling!
	var ss2 = Math.sin(-_angle2 * (Pi/180.0));
	var cc2 = Math.cos(-_angle2 * (Pi/180.0));

	for (var i = l; i <= r; i++)
	{
		for (var j = t; j <= b; j++)
		{
			// Work out the entry into the other sprite's collision mask
			var xx = ((cc2*(i - _x2)+ss2*(j - _y2)) * _scale2x + _spr.i_xorig);
			var yy = ((cc2*(j - _y2)-ss2*(i - _x2)) * _scale2y + _spr.i_yorig);
			if ((xx < 0) || (xx >= _spr.i_w)) { continue; }
			if ((yy < 0) || (yy >= _spr.i_h)) { continue; }
			
			if (_spr.i_maskcreated ) {
				if (!_spr.colmask.arr[_ind2].arr[xx + (yy * _spr.i_w)] ) { 
					continue;
				}
			}			

			var hit = skeletonBounds.containsPoint(i, j);
			if (hit !== null) {
				return true;
			}
		}
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Test for collision with a point
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.PointCollision = function (_ind, _x, _y, _scalex, _scaley, _angle,
									                    _x1, _y1) 
{
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);
	var hit = this.m_skeletonBounds.containsPoint(_x1, _y1);
	if (hit !== null) {
		return true;
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Test for collision with a line
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.LineCollision = function (_ind, _x, _y, _scalex, _scaley, _angle,
									                    _x1, _y1, _x2, _y2)
{
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);
	var hit = this.m_skeletonBounds.intersectsSegment(_x1, _y1, _x2, _y2);		
	if (hit !== null) {
		return true;
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Test for collision with a rectangle
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.RectangleCollision = function (_ind, _x, _y, _scalex, _scaley, _angle,
										                    _x1, _y1, _x2, _y2)
{	
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);
	
	var skeletonBounds = this.m_skeletonBounds;
	// Corner to corner	
	var hit = skeletonBounds.intersectsSegment(_x1, _y1, _x2, _y2);		
	if (hit !== null) {
		return true;
	}
	// TL -> TR
	hit = skeletonBounds.intersectsSegment(_x1, _y1, _x2, _y1);
	if (hit !== null) {
		return true;
	}
	// TR -> BR
	hit = skeletonBounds.intersectsSegment(_x2, _y1, _x2, _y2);
	if (hit !== null) {
		return true;
	}
	// BR -> BL
	hit = skeletonBounds.intersectsSegment(_x2, _y2, _x1, _y2);
	if (hit !== null) {
		return true;
	}
	// BL -> TL
	hit = skeletonBounds.intersectsSegment(_x1, _y2, _x1, _y1);
	if (hit !== null) {
		return true;
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///				Test for collision with an ellipse
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.EllipseCollision = function (_ind, _x, _y, _scalex, _scaley, _angle, _rr)
{
	this.SetAnimationTransform(_ind, _x, _y, _scalex, _scaley, _angle);
	
	var skeletonBounds = this.m_skeletonBounds;
	var skeleton = this.m_skeleton;

	// Compute overlapping bounding box
	var l = yymax(skeletonBounds.minX, _rr.left);
	var r = yymin(skeletonBounds.maxX, _rr.right);
	var t = yymax(skeletonBounds.minY, _rr.top);
	var b = yymin(skeletonBounds.maxY, _rr.bottom);

	var mx = ((_rr.right +  _rr.left) / 2);
	var my = ((_rr.bottom + _rr.top) / 2);
	var ww = ((_rr.right -  _rr.left) / 2);
	var hh = ((_rr.bottom - _rr.top) / 2);

	var i_w = (skeletonBounds.maxX - skeletonBounds.minX);
	var i_h = (skeletonBounds.maxY - skeletonBounds.minY);
	var i_xorig = skeleton.x - skeletonBounds.minX;
	var i_yorig = skeleton.y - skeletonBounds.minY;

	if ((_scalex == 1) && (_scaley == 1) && (Math.abs(_angle) <  0.0001))
	{
		// Case without scaling
		for (var i = l; i <= r; i++)
		{
			for (var j = t; j <= b; j++)
			{
				if (sqr((i-mx)/ww) + sqr((j-my)/hh) > 1 ) continue;   // outside ellipse
				var xx = i - _x + i_xorig;
				var yy = j - _y + i_yorig;
				if ( (xx < 0) || (xx >= i_w) ) continue;
				if ( (yy < 0) || (yy >= i_h) ) continue;				

				var hit = skeletonBounds.containsPoint(i, j);
				if (hit !== null) {
					return true;
				}
			}
		}
	}
	else
	{
		// Case with scaling
		var ss = Math.sin(-_angle*Pi/180.0);
		var cc = Math.cos(-_angle*Pi/180.0);
		for (var i = l; i <= r; i++)
		{
			for (var j = t; j <= b; j++)
			{
				if (sqr((i-mx)/ww) + sqr((j-my)/hh) > 1 ) continue;   // outside ellipse
				var xx = Math.floor((cc*(i-_x)+ss*(j-_y))/_scalex + i_xorig);
				var yy = Math.floor((cc*(j-_y)-ss*(i-_x))/_scaley + i_yorig);
				if ( (xx < 0) || (xx >= i_w) ) continue;
				if ( (yy < 0) || (yy >= i_h) ) continue;

				var hit = skeletonBounds.containsPoint(i, j);
				if (hit !== null) {
					return true;
				}
			}
		}
	}

	return false;
};


// #############################################################################################
/// Function:<summary>
///          	Access the setup pose bone data
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetBoneData = function (_bone, _map) {

    var bone = this.m_skeleton.findBone(_bone);
	if (bone) 
	{
		var pMap = g_ActiveMaps.Get(_map);
		if (pMap) 
		{
		    pMap.set( "length", bone.data.length);
		    pMap.set( "x", bone.data.x);			
			pMap.set( "y",  bone.data.y);
			pMap.set( "angle", bone.data.rotation);
			pMap.set( "xscale", bone.data.scaleX);
			pMap.set( "yscale", bone.data.scaleY);
			if ((bone.data.parent !== undefined) && (bone.data.parent !== null))
			{
			    pMap.set( "parent", bone.data.parent.name);
			}
			else
			{
			    pMap.set( "parent", "");
			}
			return true;
		}
	}
	return false;

};

// #############################################################################################
/// Function:<summary>
///          	Alter the setup pose bone data
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetBoneData = function (_bone, _map) {
    
    var bone = this.m_skeleton.findBone(_bone);
	if (bone)
	{
		var pMap = g_ActiveMaps.Get(_map);
		if (pMap) 
		{
		    bone.data.length = (pMap.get("length") !== undefined) ? pMap.get("length") : bone.data.length;
			bone.data.x = (pMap.get("x") !== undefined) ? pMap.get("x") : bone.data.x;
			bone.data.y = (pMap.get("y") !== undefined) ? pMap.get("y") : bone.data.y;
			bone.data.rotation = (pMap.get("angle") !== undefined) ? pMap.get("angle") : bone.data.rotation;
			bone.data.scaleX = (pMap.get("xscale") !== undefined) ? pMap.get("xscale") : bone.data.scaleX;
			bone.data.scaleY = (pMap.get("yscale") !== undefined) ? pMap.get("yscale") : bone.data.scaleY;
			return true;
		}
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///          	Access the current bone state
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetBoneState = function (_inst, _bone, _map) {

    var bone = this.m_skeleton.findBone(_bone);
	if (bone) 
	{
		var pMap = g_ActiveMaps.Get(_map);
		if (pMap) 
		{
			var angle = _inst.image_angle;

			var origin = this.GetScreenOrigin();
			var world_xy = [ bone.worldX, bone.worldY ];
			world_xy = RotatePointAroundOrigin(world_xy, origin, this.m_rotationMatrix);

		    pMap.set( "x", bone.x);
			pMap.set( "y", bone.y);
			pMap.set( "angle", bone.rotation);
			pMap.set( "xscale", bone.scaleX);
			pMap.set( "yscale", bone.scaleY);
			pMap.set( "worldX", world_xy[0]);
			pMap.set( "worldY", world_xy[1]);
			//pMap["worldAngle"] = bone.worldRotation;
			//pMap["worldScaleX"] = bone.worldScaleX;
			//pMap["worldScaleY"] = bone.worldScaleY;
		    //pMap["parent"] = bone.parent.data.name;
			pMap.set( "worldAngleX", bone.getWorldRotationX() - angle);
			pMap.set( "worldAngleY", bone.getWorldRotationY() - angle);
			pMap.set( "worldScaleX", bone.getWorldScaleX());
			pMap.set( "worldScaleY", bone.getWorldScaleY());
			pMap.set( "appliedAngle", bone.arotation);
			if (bone.parent != null)
			    if (bone.parent.data != null)
			        pMap.set( "parent", bone.parent.data.name);
			return true;
		}
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///          	Alter the current bone state
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.SetBoneState = function (_inst, _bone, _map) {

    var bone = this.m_skeleton.findBone(_bone);
	if (bone) 
	{
		var pMap = g_ActiveMaps.Get(_map);
		if (pMap) 
		{
			
			if(pMap.get("angle") !== undefined) bone.rotation = pMap.get("angle");
			if(pMap.get("xscale") !== undefined) bone.scaleX = pMap.get("xscale");
			if(pMap.get("yscale") !== undefined) bone.scaleY = pMap.get("yscale");

			/* The world co-ordinates stored within the spBone do not take the GM sprite rotation
			 * into account, so we need to apply that rotation to those values when initialising
			 * the defaults for worldX/worldY so they exist in the correct co-ordinate space and
			 * reverse the rotation before comparing/applying back to the spBone.
			 *
			 * We can't just rotate and apply the user co-ords as worldX or worldY may be specified
			 * individually and without the corresponding default co-ordinate from the spBone
			 * rotated into the same co-ordinate space, the rotation of the user's co-ordinate
			 * would not be correct.
			 *
			 * See GM-8031.
			*/

			var origin = this.GetScreenOrigin();
			var world_xy = [ bone.worldX, bone.worldY ];
			world_xy = RotatePointAroundOrigin(world_xy, origin, this.m_rotationMatrix);

			if(pMap.get("worldX") !== undefined) world_xy[0] = pMap.get("worldX");
			if(pMap.get("worldY") !== undefined) world_xy[1] = pMap.get("worldY");

			world_xy = RotatePointAroundOrigin(world_xy, origin, this.m_reversedRotationMatrix);

			// Since worldX/worldY and x/y modify the same fields on the bone, favour worldX/worldY if they've changed as this implies
			// that they've been modified deliberately
			if (!(Math.abs(world_xy[0] - bone.worldX) < 0.01) || !(Math.abs(world_xy[1] - bone.worldY) < 0.01))
			{
				var localPos;
				if ((bone.parent !== undefined) && (bone.parent !== null))
				{
					localPos = bone.parent.worldToLocal({x:world_xy[0], y:world_xy[1]});
				}
				else
				{
					localPos = bone.worldToLocal({x:world_xy[0], y:world_xy[1]});
				}

				bone.x = localPos.x;
				bone.y = localPos.y;
			}
			else
			{
				if(pMap.get("x") !== undefined) bone.x = pMap.get("x");
				if(pMap.get("y") !== undefined) bone.y = pMap.get("y");
			}

			return true;
		}
	}
	return false;
};



// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetSkin = function () {

	if (this.m_skeleton.skin) {
		return this.m_skeleton.skin.name;
	}
	return "";
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.CreateSkinFromSkins = function (_name, _baseNames) {
	var newSkin = new spine.Skin(_name);

	for (var i = 0; i < _baseNames.length; ++i)
	{
		var baseSkin = this.m_skeletonData.findSkin(_baseNames[i]);
		if(baseSkin === null)
		{
			debug("Skin " + _baseNames[i] + " not found in skeleton");
		}
		else {
			// spSkin_addSkin(new_skin, base_skin);
			newSkin.copySkin(baseSkin);
		}
	}

	return new yySkeletonSkin(newSkin);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetAnimation = function (_track) {

	if ((_track >= 0) && 
	    (_track < this.m_animationState.tracks.length) &&
	    (this.m_animationState.tracks[_track]) &&
	    (this.m_animationState.tracks[_track].animation))
	{
		return this.m_animationState.tracks[_track].animation.name;
	}
	return "";	
};

// #############################################################################################
/// Function:<summary>
///             Clear the animation at the given track
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.ClearAnimation = function (_track) {

    if ((_track >= 0) && (_track < this.m_animationState.tracks.length)) {
		this.m_animationState.clearTrack(_track);
	}	
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetDuration = function (_anim) {

    var animation = this.m_skeletonData.findAnimation(_anim);
    if (animation) {
        return animation.duration;
    }
    return 0.0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetFrames = function (_anim) {

    var animation = this.m_skeletonData.findAnimation(_anim);
    if (animation) {
    
        var updatesCount = g_RunRoom ? g_RunRoom.GetSpeed() : 30;
    
        if(g_isZeus)
        {
            updatesCount = g_GameTimer.GetFPS();
        }
        
        if (updatesCount <= 0)
            return 0;
            
        var frameCount = animation.duration * updatesCount;
	    return ~~(frameCount + 0.5);        
    }
    return 0.0;
};

yySkeletonInstance.prototype.GetAnimationEventFrames = function (_anim, _eventname)
{
    var animation = this.m_skeletonData.findAnimation(_anim);
    if (animation == null)
    {
        return null;
    }    

    var i;
    var pEventTimeline = null;
    for (i = 0; i < animation.timelines.length; i++)
    {
        var pTimeline = animation.timelines[i];
        if (pTimeline instanceof spine.EventTimeline)        
        {
            pEventTimeline = pTimeline;
            break;
        }
    }

    if (pEventTimeline == null)
    {        
        return null;
    }

    var updatesCount;
    if (g_isZeus)
    {
        updatesCount = g_GameTimer.GetFPS();
    }
    else
    {
        updatesCount = g_RunRoom ? g_RunRoom.GetSpeed() : 30;
    }

    // Multiple events with the same name can exist in animations
    var frameIndices = [];    

    for (i = 0; i < pEventTimeline.events.length; i++)
    {
        var pEvent = pEventTimeline.events[i];
        if (pEvent.data != null)
        {
            var pEventData = pEvent.data;
            if (pEventData.name == _eventname)
            {
                var time = pEvent.time;				

                frameIndices.push(updatesCount * time);                
            }
        }
    }

    if (frameIndices.length == 0)
    {        
        return null;
    }

    return frameIndices;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yySkeletonInstance.prototype.GetAttachment = function (_slotName) {

	var slot = this.m_skeleton.findSlot(_slotName);	
	if (slot !== null && slot !== undefined) {
	
	    if (slot.attachment) {
		    return slot.attachment.name;
		}
	}
	return "";
};

yySkeletonInstance.prototype.GetSlotData = function (_list)
{

    for (var n = 0; n < this.m_skeleton.slots.length; n++)
    {

        var pSlot = this.m_skeleton.slots[n];

        // Create and populate a ds_map then add it to the supplied list
        var map = ds_map_create();
        ds_map_add(map, "name", pSlot.data.name);
        ds_map_add(map, "bone", pSlot.data.boneData.name);
        ds_map_add(map, "attachment", pSlot.attachment ? pSlot.attachment.name : "(none)");

        ds_list_add(_list, map);
    }
};
