// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyInstance.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

var g_rr = new YYRECT(0, 0, 0, 0);

// For inherited (and debug) events
var Current_Object = null;
var Current_Event_Type = -1;
var Current_Event_Number = -1;
var g_currentCreateCounter = 0;


// #############################################################################################
/// Function:<summary>
///              Create an instance
///          </summary>
///
/// In:		 <param name="xx">X coordinate</param>
///			 <param name="yy">Y coordinate</param>
///			 <param name="id">ID of instance</param>
///			 <param name="objectind">object ID</param>
///			 <param name="_AddObjectLink">link instance?</param>
///			 <param name="_create_dummy">Create a "dummy" instance? (used in room creation etc)</param>
///				
// #############################################################################################
/**@constructor*/
function    yyInstance( _xx, _yy, _id, _objectind, _AddObjectLink, _create_dummy)
{
    // Array of user "arrays", accessed "by name"
    this.__type = "[instance]";
	this.__x = _xx;
    this.__y = _yy;
	this.__xprevious = _xx;
	this.__yprevious = _yy;
	this.__xstart = _xx;
	this.__ystart = _yy;
	this.__hspeed = 0;
	this.__vspeed = 0;
	this.__direction = 0;
	this.__speed = 0;
	this.__friction = 0;
	this.__gravity = 0;
	this.__gravity_direction = 270;
	this.object_index = _objectind;
	this.id = _id;
	this.active = true;						// true if in the active list, false if not.

	this.in_collision_tree = true; //On html5 everything's in the collision tree atm, member provided for compatibility

	this.alarm = [];
	for(var i= 0 ; i<=(MAXTIMER-1); i++ ) {
	    this.alarm[i] = -1;
	}

	this.__solid = true;
	this.__visible = true;
	this.__persistent = false;
	this.__depth = 0;
	
	this.bbox = new YYRECT(0,0,0,0);
	this.__sprite_index = 0;
	this.__image_index = 0;

    this.image_number = 0;    
    this.sprite_width = 0;    
    this.sprite_height = 0;   
    this.sprite_xoffset = 0;  
    this.sprite_yoffset = 0;  

	this.__image_xscale = 1.0;
	this.__image_yscale = 1.0;
	this.__image_angle = 0;
	this.__image_alpha = 1.0;
	this.__image_blend = 0xffffff;
	this.__image_speed = 1;
	this.__mask_index = -1;

	this.last_sequence_pos = 0;
	this.sequence_pos = 0;
	this.sequence_dir = 1;

	this.path_index = -1;
	this.__path_position = 0;
	this.__path_positionprevious = 0;
	this.__path_speed = 0;
	this.__path_scale = 1;
	this.__path_orientation = 0;
	this.__path_endaction = 0;
	this.path_xstart = 0;       
	this.path_ystart = 0;       

	this.__timeline_index = -1;
	this.__timeline_position = 0;
	this.__timeline_speed = 1;
    this.timeline_paused = true;
    this.timeline_looped = false;


	this.InstanceIndex = -1;
	this.Created = false;

	this.marked = false;
	this.initcode = null;
	this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
    this.bbox_dirty = true;
    this.mouse_over = false;

    this.pObject = null;                                     // Pointer to object type
    this.pMasterObject = null;
    this.m_physicsObject = null;
	this.m_skeletonSprite = null;
	this.m_pMaskSkeleton = null;
	
	this.fOutsideRoom = false;
	this.fInSequence = false;
	this.fOwnedBySequence = false;
	this.m_pControllingSeqInst = null;
	this.fControlledBySequence = false;
	this.fDrawnBySequence = true;

    if( !_create_dummy ){                                   // if paramater not provided
        this.createCounter = g_currentCreateCounter;   
        this.SetObjectIndex(_objectind, _AddObjectLink, true);
        this.UpdateSpriteIndex(this.pObject.SpriteIndex);
    }else{
        this.createCounter = 0;   
        this.object_index = 0;
        //C++ runner creates a dummy object that has sprite_index -1 should probably mimic its behaviour and create an object but for now we'll just copy its sprite index
        this.sprite_index = -1;
        this.m_pSkeletonAnimation = null;
    }
	this.m_nLayerID = -1;
	this.m_bOnActiveLayer = false;
}

yyInstance.prototype = {

	// x property
	get x() { return this.__x; },
	set x(_x) { 
		_x = yyGetReal(_x);
		if( this.__x === _x) return; 
		this.__x = _x; 
		this.bbox_dirty = true; 
	},

	// y property
	get y() { return this.__y; },
	set y(_y) { 
		_y = yyGetReal(_y);
		if( this.__y === _y) return; 
		this.__y = _y; 
		this.bbox_dirty = true; 
	},

	// xstart property
	get xstart() { return this.__xstart; },
	set xstart(_xstart) { 
		_xstart = yyGetReal(_xstart);
		if( this.__xstart === _xstart) return; 
		this.__xstart = _xstart; 
	},

	// ystart property
	get ystart() { return this.__ystart; },
	set ystart(_ystart) { 
		_ystart = yyGetReal(_ystart);
		if( this.__ystart === _ystart) return; 
		this.__ystart = _ystart; 
	},

	// xprevious property
	get xprevious() { return this.__xprevious; },
	set xprevious(_xprevious) { 
		_xprevious = yyGetReal(_xprevious);
		if( this.__xprevious === _xprevious) return; 
		this.__xprevious = _xprevious;
	},

	// yprevious property
	get yprevious() { return this.__yprevious; },
	set yprevious(_yprevious) { 
		_yprevious = yyGetReal(_yprevious);
		if( this.__yprevious === _yprevious) return; 
		this.__yprevious = _yprevious;
	},

	// hspeed property
	get hspeed() { return this.__hspeed; },
	set hspeed(_val) {	
		_val = yyGetReal(_val);
		if (this.__hspeed == _val) return;

		this.__hspeed = _val;
		this.Compute_Speed1();
	},

	// vspeed property
	get vspeed() { return this.__vspeed; },
	set vspeed(_val) {	
		_val = yyGetReal(_val);
		if (this.__vspeed == _val) return;

		this.__vspeed = _val;
		this.Compute_Speed1();
	},

	// direction property
	get direction() { return this.__direction; },
	set direction(_val) {

		_val = yyGetReal(_val);
    	while (_val < 0.0) { _val += 360.0; }
		while (_val > 360.0) { _val -= 360.0; }

		this.__direction = fmod(_val, 360.0);	
		this.Compute_Speed2();
	},

	// speed property
	get speed() { return this.__speed; },
	set speed(_val) {
		_val = yyGetReal(_val);
		if (this.__speed == _val) return;

		this.__speed = _val;
		this.Compute_Speed2();
	},

	// friction property
	get friction() { return this.__friction; },
	set friction(_val) {
		_val = yyGetReal(_val);
		if (this.__friction == _val) return;

		this.__friction = _val;
	},

	// gravity property
	get gravity() { return this.__gravity; },
	set gravity(_val) {
		_val = yyGetReal(_val);
		if (this.__gravity == _val) return;

		this.__gravity = _val;
	},

	// gravity_direction property
	get gravity_direction() { return this.__gravity_direction; },
	set gravity_direction(_val) {
		_val = yyGetReal(_val);
		if (this.__gravity_direction == _val) return;

		this.__gravity_direction = _val;
	},

	// solid property
	get solid() { return this.__solid; },
	set solid(_val) {
		_val = yyGetBool(_val);
		if (this.__solid == _val) return;

		this.__solid = _val;
	},

	// persistent property
	get persistent() { return this.__persistent; },
	set persistent(_val) {
		_val = yyGetBool(_val);
		if (this.__persistent == _val) return;

		this.__persistent = _val;
	},

	// visible property
	get visible() { return this.__visible; },
	set visible(_val) {
		_val = yyGetBool(_val);
		if (this.__visible == _val) return;

		this.__visible = _val;
	},

	// depth property
	get depth() { return this.__depth; },
	set depth(_depth) {
	
		_depth = yyGetReal(_depth);
		if( this.__depth != _depth ){   //only need to re-sort if depth changed
		   
		    this.__depth = _depth;
		    g_RunRoom.m_DepthSorting[g_RunRoom.m_DepthSorting.length] = this;
		    
		    // DONT change layer depth here....    
	    }
	},

	// path position property
	get path_position() { return this.__path_position; },
	set path_position(_val) {
		_val = yyGetReal(_val);
		if (this.__path_position == _val) return;

		this.__path_position = _val;
	},

	// path positionprevious property
	get path_positionprevious() { return this.__path_positionprevious; },
	set path_positionprevious(_val) {
		_val = yyGetReal(_val);
		if (this.__path_positionprevious == _val) return;

		this.__path_positionprevious = _val;
	},

	// path speed property
	get path_speed() { return this.__path_speed; },
	set path_speed(_val) {
		_val = yyGetReal(_val);
		if (this.__path_speed == _val) return;

		this.__path_speed = _val;
	},

	// path scale property
	get path_scale() { return this.__path_scale; },
	set path_scale(_val) {
		_val = yyGetReal(_val);
		if (this.__path_scale == _val) return;

		this.__path_scale = _val;
	},

	// path orientation property
	get path_orientation() { return this.__path_orientation; },
	set path_orientation(_val) {
		_val = yyGetReal(_val);
		if (this.__path_orientation == _val) return;

		this.__path_orientation = _val;
	},

	// path endaction property
	get path_endaction() { return this.__path_endaction; },
	set path_endaction(_val) {
		_val = yyGetInt32(_val);
		if (this.__path_endaction == _val) return;

		this.__path_endaction = _val;
	},

	// timeline index property
	get timeline_index() { return this.__timeline_index; },
	set timeline_index(_val) {
		_val = yyGetInt32(_val);
		if (this.__timeline_index == _val) return;

		this.__timeline_index = _val;
	},

	// timeline position property
	get timeline_position() { return this.__timeline_position; },
	set timeline_position(_val) {
		_val = yyGetReal(_val);
		if (this.__timeline_position == _val) return;

		this.__timeline_position = _val;
	},

	// timeline speed property
	get timeline_speed() { return this.__timeline_speed; },
	set timeline_speed(_val) {
		_val = yyGetReal(_val);
		if (this.__timeline_speed == _val) return;

		this.__timeline_speed = _val;
	},

	// bbox_left property (NOTE: no setter)
	get bbox_left() { 
		if (this.bbox_dirty) 
			this.Compute_BoundingBox(); 
		return this.bbox.left;	
	},

	// bbox_right property (NOTE: no setter)
	get bbox_right() { 
		if (this.bbox_dirty) 
			this.Compute_BoundingBox(); 
		return this.bbox.right;	
	},

	// bbox_top property (NOTE: no setter)
	get bbox_top() { 
		if (this.bbox_dirty) 
			this.Compute_BoundingBox(); 
		return this.bbox.top;	
	},

	// bbox_bottom property (NOTE: no setter)
	get bbox_bottom() { 
		if (this.bbox_dirty) 
			this.Compute_BoundingBox(); 
		return this.bbox.bottom;	
	},

	// sprite_index property
	get sprite_index() { return this.__sprite_index; },
	set sprite_index(_id) {
		_id = yyGetInt32(_id);
    	this.__sprite_index = _id;    
    	this.bbox_dirty = true;
    	this.m_pSkeletonAnimation = null;
	},

	// image_index property
	get image_index() { return this.__image_index; },
	set image_index(_frame) {

	    _frame = yyGetReal(_frame);

		var sprite = g_pSpriteManager.Get(this.sprite_index);

	    if (sprite != null)
	    {
			// Set playhead to the start\end of the keyframe matching this index
			// We're currently assuming that the number of images matches the number of keyframes		
			// Sanity check
	        if(sprite.sequence != null && sprite.sequence.m_tracks != null && sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames)
	        {
				var pTrack = sprite.sequence.m_tracks[0];
	
				var keyframeStore = pTrack.m_keyframeStore;
				var numkeyframes = keyframeStore.numKeyframes;

				if (numkeyframes > 0)
				{	
					var wrappedFrame = fwrap(_frame, numkeyframes);
					var keyindex = wrappedFrame;
					var fracval = wrappedFrame - keyindex;
	
				    // Update the sequence position
					this.sequence_pos = this.last_sequence_pos = (keyframeStore.keyframes[Math.floor(keyindex)].m_key + (fracval * numkeyframes));
	
					this.__image_index = _frame;	// use wrapped value - nope image_index needs to be able to be >image_number for this frame
				}
				else
				{
					this.__image_index = _frame;	// we don't have any actual frames in our sprite frames track so just pass the value straight through
				}
			}
			else
			{
				this.__image_index = _frame;	// we don't have a sprite frames track so just pass the value straight through
			}
		}
		else
		{
			this.__image_index = _frame;	// just use value as-is
		}
	},

	// image_single property
	get image_single() { 	
		if (this.image_speed == 0) {
			return this.image_index;
		} else {
			return -1;
		} // end else
	},
	set image_single(_a) {
		_a = yyGetInt32(_a);
		if (_a < 0)
		{
			this.image_speed = 1;
		} else{
			this.image_speed = 0;
			this.image_index = _a;
		}
	},

	// image_number property (no setter)
	get image_number() { 
		var pSprite = g_pSpriteManager.Get(this.sprite_index);
		if (!pSprite) return 0;
		
		var skeletonAnim = this.SkeletonAnimation();
	    if (skeletonAnim) {
	        return skeletonAnim.FrameCount(pSprite);
	    }
	    else if ((pSprite.SWFTimeline !== null) && (pSprite.SWFTimeline !== undefined)) {
		    return pSprite.SWFTimeline.numFrames;
		}
		return pSprite.ppTPE.length;
	},


	// sprite_width property
	get sprite_width()  {
		var pSprite = g_pSpriteManager.Get(this.sprite_index);
		if (!pSprite) return 0;
		return pSprite.width * this.image_xscale;
	},

	// sprite_height property
	get sprite_height()  {
		var pSprite = g_pSpriteManager.Get(this.sprite_index);
		if (!pSprite) return 0;
		return pSprite.height * this.image_yscale;
	},

	// sprite_xoffset property
	get sprite_xoffset()  {
		var pSprite = g_pSpriteManager.Get(this.sprite_index);
		if (!pSprite) return 0;
		return pSprite.xOrigin * this.image_xscale;	
	},

	// sprite_yoffset property
	get sprite_yoffset() {
		var pSprite = g_pSpriteManager.Get(this.sprite_index);
		if (!pSprite) return 0;
		return pSprite.yOrigin * this.image_yscale;
	},

	// image_xscale property
	get image_xscale() { return this.__image_xscale; },
	set image_xscale(_scale) { 
		_scale = yyGetReal(_scale);
		if (this.__image_xscale === _scale) 
			return; 
		this.__image_xscale = _scale; 
		this.bbox_dirty = true; 
	},

	// image_yscale property
	get image_yscale() { return this.__image_yscale; },
	set image_yscale(_scale) { 
		_scale = yyGetReal(_scale);
		if (this.__image_yscale === _scale) 
			return; 
		this.__image_yscale = _scale; 
		this.bbox_dirty = true; 
	},

	// image_angle property
	get image_angle() { return this.__image_angle; },
	set image_angle(_ang) { 
		_ang = yyGetReal(_ang);
		if( this.__image_angle === _ang) 
			return; 
		this.__image_angle = _ang; 
		this.bbox_dirty = true; 
	},

	// image_blend property
	get image_blend() { return ConvertGMColour(this.__image_blend); },
	set image_blend(_col) { this.__image_blend = yyGetInt32(_col); },

	// image_alpha property
	get image_alpha() { return this.__image_alpha; },
	set image_alpha(_alpha) { this.__image_alpha = yyGetReal(_alpha); },

	// image_speed property
	get image_speed() { return this.__image_speed; },
	set image_speed(_speed) { 
		_speed = yyGetReal(_speed);
		if( this.__image_speed === _speed) 
			return; 
		this.__image_speed = _speed; 
	},

	// mask_index property
	get mask_index() { return this.__mask_index; },
	set mask_index(_id) {
    	this.__mask_index = yyGetInt32(_id);    
    	this.bbox_dirty = true;
        this.m_pMaskSkeleton = null;
	},

	// timeline_running property
	get timeline_running() {
	    if( this.timeline_paused ){
	        return 0;
	    }else{
	        return 1;
	    }
	},
	set timeline_running(_run) { 
		this.timeline_paused = !yyGetBool(_run);
	},

	// timeline_loop property
	get timeline_loop() { 
	    if( this.timeline_looped ){
	        return 1;
	    }else{
	        return 0;
	    }
	},
	set timeline_loop( _loop ) { 
		this.timeline_looped = yyGetBool(_loop);
	},

	// phy_rotation property
	get phy_rotation() { return this.__phy_rotation; },
	set phy_rotation(_rotation) {

	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.SetRotation(yyGetReal(_rotation));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},


	// phy_position_x property
	get phy_position_x() { return this.__phy_position_x; },
	set phy_position_x(_pos) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        this.m_physicsObject.SetPositionX(yyGetReal(_pos) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_position_y property
	get phy_position_y() { return this.__phy_position_y; },
	set phy_position_y(_pos) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        this.m_physicsObject.SetPositionY(yyGetReal(_pos) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_angular_velocity property
	get phy_angular_velocity() { return this.__phy_angular_velocity; },
	set phy_angular_velocity(_angular_velocity) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.SetAngularVelocity(yyGetReal(_angular_velocity));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_linear_velocity_x property
	get phy_linear_velocity_x() { return this.__phy_linear_velocity_x; },
	set phy_linear_velocity_x(_vel) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        this.m_physicsObject.SetLinearVelocityX(yyGetReal(_vel) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_linear_velocity_y property
	get phy_linear_velocity_y() { return this.__phy_linear_velocity_y; },
	set phy_linear_velocity_y(_vel) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        this.m_physicsObject.SetLinearVelocityY(yyGetReal(_vel) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_speed property
	get phy_speed() {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        var TargetSpeed = g_GameTimer.GetFPS();

	        var pixelToMetreScale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;

	        var xs = (this.__phy_linear_velocity_x / pixelToMetreScale) / TargetSpeed;
	        var ys = (this.__phy_linear_velocity_y / pixelToMetreScale) / TargetSpeed;

	        return Math.sqrt((xs * xs) + (ys * ys));
	    }
	    else
	        return undefined;

	},

	// phy_speed_x property
	get phy_speed_x() { return this.__phy_speed_x; },
	set phy_speed_x(_speed) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        var TargetSpeed = g_GameTimer.GetFPS();

	        this.m_physicsObject.SetLinearVelocityX(yyGetReal(_speed) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale * TargetSpeed);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_speed_y property
	get phy_speed_y() { return this.__phy_speed_y; },
	set phy_speed_y(_speed) {
	    if (this.m_physicsObject != null && g_RunRoom != null) {
	        var TargetSpeed = g_GameTimer.GetFPS();
	        this.m_physicsObject.SetLinearVelocityY(yyGetReal(_speed) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale * TargetSpeed);
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_angular_damping property
	get phy_angular_damping() { return this.__phy_angular_damping; },
	set phy_angular_damping(_damping) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.m_physicsBody.SetAngularDamping(yyGetReal(_damping));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_liner_damping property
	get phy_linear_damping() { return this.__phy_linear_damping; },
	set phy_linear_damping(_damping) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.m_physicsBody.SetLinearDamping(yyGetReal(_damping));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_bullet property
	get phy_bullet() { return this.__phy_bullet; },
	set phy_bullet(_isBullet) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.SetBullet(yyGetBool(_isBullet));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_fixed_rotation property
	get phy_fixed_rotation() { return this.__phy_fixed_rotation; },
	set phy_fixed_rotation(_isFixed) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.SetFixedRotation(yyGetBool(_isFixed));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// phy_active property
	get phy_active() { return this.__phy_active; },
	set phy_active(_isActive) {
	    if (this.m_physicsObject != null) {
	        this.m_physicsObject.SetActive(yyGetBool(_isActive));
	        this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
	    }
	},

	// layer property
	get layer() { return this.m_nLayerID; },
	set layer(_layerID)	{
		_layerID = yyGetInt32(_layerID);

		// remove from current layer
		g_pLayerManager.RemoveInstance(g_RunRoom, this);

		this.m_nLayerID = _layerID;

		// add to new layer, if such a layer exists
		var pLayer = g_pLayerManager.GetLayerFromID(g_RunRoom, _layerID);
		if(pLayer != null)
		{
			g_pLayerManager.AddInstanceToLayer(g_RunRoom, pLayer, this);
		    this.__depth = pLayer.depth;
		}
	},

	// in_sequence property
	get in_sequence() { return this.GetInSequence(); },

	// sequence_instance
	get sequence_instance() { return this.GetControllingSeqInst(); },

	// draw_by_sequence property
	get drawn_by_sequence() { return this.GetDrawnBySequence(); },
	set drawn_by_sequence(_drawn_by_sequence) { this.SetDrawnBySequence(_drawn_by_sequence); }		
};

yyInstance.prototype.SetImageIndex = function(_frame)
{
	this.__image_index = _frame;
};

yyInstance.prototype.SetDirtyBBox = function (flag) { this.bbox_dirty = flag; };
yyInstance.prototype.GetDirty = function () { return this.bbox_dirty; };

yyInstance.prototype.SetInSequence = function (flag) { this.fInSequence = flag; };
yyInstance.prototype.GetInSequence = function () { return this.fInSequence; };

yyInstance.prototype.SetOwnedBySequence = function (flag) { this.fOwnedBySequence = flag; };
yyInstance.prototype.GetOwnedBySequence = function () { return this.fOwnedBySequence; };

yyInstance.prototype.SetControllingSeqInst = function (_pSeqInst) { this.m_pControllingSeqInst = _pSeqInst; };
yyInstance.prototype.GetControllingSeqInst = function () { return this.m_pControllingSeqInst; };

yyInstance.prototype.SetControlledBySequence = function (flag) { this.fControlledBySequence = flag; };
yyInstance.prototype.GetControlledBySequence = function () { return this.fControlledBySequence; };

yyInstance.prototype.SetDrawnBySequence = function (flag) { this.fDrawnBySequence = flag; };
yyInstance.prototype.GetDrawnBySequence = function () { return this.fDrawnBySequence; };


// #############################################################################################
/// Function:<summary>
///				Sets the position of the instance
///          </summary>
///
/// In:		 <param name="_newx"></param>
///			 <param name="_newy"></param>
///				
// #############################################################################################
yyInstance.prototype.SetPosition = function (_newx, _newy) {
	if ((this.x == _newx) && (this.y == _newy)) return;

	this.x = _newx;
	this.y = _newy;
	this.bbox_dirty = true;
};

// #############################################################################################
/// Function:<summary>
///				Copy the instance data from "inst" into "this"
///          </summary>
///
/// In:		 <param name="inst">Instance to copy from</param>
///			 <param name="_LinkToObjectType">Link into active objects</param>
// #############################################################################################
yyInstance.prototype.Assign = function (_pInst, _LinkToObjectType) {
	
	if (this.pObject != null)
	{
		this.pObject.RemoveInstance(this);
		this.pObject = null;
	}

	// Copy everything, except instance id
	for (var v in _pInst) {
		var p = _pInst[v];
		this[v] = p;		    
	}			

	// Copy the bbox properly, so it's not just a reference.
	this.bbox = new YYRECT();
	this.bbox.Copy(_pInst.bbox);

	for (var i = 0; i <= MAXTIMER - 1; i++)
	{
		var a = _pInst.alarm[i];
		this.alarm[i] = a;
	}

	if (_LinkToObjectType && this.pObject != null)
	{
		this.pObject.AddInstance(this);
	}
	
	// Any skeleton data needs to be not just a reference
	var skeletonAnim = this.SkeletonAnimation();
	if (skeletonAnim) {
	    this.m_pSkeletonAnimation = skeletonAnim.Clone();
	}	
	this.m_nLayerID = _pInst.layer;
};

// #############################################################################################
/// Function:<summary>
///             Copies object "type" (using index) _val into this one.
///          </summary>
///
/// In:		 <param name="val"></param>
///				
// #############################################################################################
yyInstance.prototype.SetObjectIndex = function (_objindex, _LinkToObjectType, _SetDepthNow) {

	// Set the TYPE index
	this.object_index = _objindex;

	if (this.pObject != null)
	{
		this.pObject.RemoveInstance(this);
		this.pObject = null;
		this.pMasterObject = null;
	}
	if (_objindex == -1) _objindex = 0;


	this.pMasterObject = this.pObject = g_pObjectManager.Get(_objindex);
	if (this.pObject != null)
	{
		// Otherwise add the instance to its list.
		if (_LinkToObjectType)
		{
			this.pObject.AddInstance(this);
		}

		// take a reference to the recursive event list.
		this.REvent = this.pObject.REvent;

		// and copy the data over...
		this.mask_index = this.pObject.SpriteMask;
		
		if(!g_isZeus)
		{
		//Zeus, no object has a depth defined
		    if (_SetDepthNow)
		    {
		    	// RK :: set the underlying variable rather than going through the property
			    this.__depth = this.pObject.Depth;
		    } else
		    {
			    this.depth = this.pObject.Depth;
		    }
		}
		this.solid = this.pObject.Solid;
		this.visible = this.pObject.Visible;
		this.persistent = this.pObject.Persistent;

		//SetSpriteIndex(m_pObject->GetSpriteIndex());		
		
		this.bbox_dirty = true;
	}
};

// #############################################################################################
/// Function:<summary>
///             Set the sprite index for the instance and update state accordingly
///          </summary>
// #############################################################################################
yyInstance.prototype.UpdateSpriteIndex = function (_index) {
        
    var pSprite = g_pSpriteManager.Get(_index);
    if (pSprite) {
        this.bbox.left = pSprite.bbox.left;
        this.bbox.right = pSprite.bbox.right;
        this.bbox.top = pSprite.bbox.top;
        this.bbox.bottom = pSprite.bbox.bottom;
    }
    this.sprite_index = _index;
    
    this.m_pSkeletonAnimation = null;
    // Do I really need this check?
    if (this.pObject !== null) {
        this.SkeletonAnimation();
    }
};

// #############################################################################################
/// Function:<summary>
///				Builds a physics rigid body for this instance from the object definition
///             then transfer back in any previously set properties. For persistent instances.
///          </summary>
// #############################################################################################
yyInstance.prototype.RebuildPhysicsBody = function (_room) {

    // Null off pre-existing bodies to ensure that the data is entirely 
    // rebuilt either now or later in the logic (e.g. room start event)    
    if (_room && this.m_physicsObject) {
		
		_room.m_pPhysicsWorld.DestroyBody(this.m_physicsObject);		
	}    
	this.m_physicsObject = null;
    
    // And if the object came with an IDE definition build it again now
    if (this.pObject.PhysicsData.physicsObject) {
	    
        this.BuildPhysicsBody();
        this.bbox_dirty = true;
    }
};

// #############################################################################################
/// Function:<summary>
///				Builds a physics rigid body for this instance from the object definition
///          </summary>
// #############################################################################################
yyInstance.prototype.BuildPhysicsBody = function () {

    if (!this.pObject.PhysicsData.physicsObject) {
		return;
	}
	
    // For now we're extracting shape data from the sprite, if none exists then abort
	if (!sprite_exists(this.sprite_index)) {
		return;		
	}
	var spr = g_pSpriteManager.Get(this.sprite_index);
	
	// Without a physics world we won't get far
	if (!g_RunRoom.m_pPhysicsWorld) {
        return;
    }

	// Create a physics fixture to work with
	var fixtureID = physics_fixture_create();	
	
	// Bind settings to this fixture		
	var physicsData = this.pObject.PhysicsData,
	    xoffs = 0.0,
	    yoffs = 0.0;
	
	switch (physicsData.physicsShape) 
	{
		case OBJECT_PHYSICS_SHAPE_CIRCLE:
		{
		    var imagescale = 1.0;
		    if (Math.abs(this.image_xscale - this.image_yscale) < 0.0001) {
		        imagescale = this.image_xscale;				
			}
			else {				
				debug("Image scale for physics object using circle collision should not vary across axes: " + this.pObject.Name);
			}
            
			xoffs = -physicsData.physicsShapeVertices[0] * imagescale;
			yoffs = -physicsData.physicsShapeVertices[1] * imagescale;
			
			var radius = physicsData.physicsShapeVertices[2] * imagescale;			
			physics_fixture_set_circle_shape(fixtureID, radius);
		}
		break;
		case OBJECT_PHYSICS_SHAPE_BOX:
		case OBJECT_PHYSICS_SHAPE_POLY:
		{
			physics_fixture_set_polygon_shape(fixtureID);			
			// Change winding order if a -ve scale is in place					
			if ((this.image_xscale * this.image_yscale) < 0) 
			{
			    for (var n = physicsData.physicsShapeVertices.length - 2; n >= 0; n -= 2)
			    {
			    	physics_fixture_add_point(
			    	    fixtureID, 
			    	    physicsData.physicsShapeVertices[n + 0] * this.image_xscale,
			    	    physicsData.physicsShapeVertices[n + 1] * this.image_yscale);
			    }
			}
			else 
			{			
			    for (var n = 0; n < physicsData.physicsShapeVertices.length; n += 2)
			    {
			    	physics_fixture_add_point(
			    	    fixtureID, 
			    	    physicsData.physicsShapeVertices[n + 0] * this.image_xscale, 
			    	    physicsData.physicsShapeVertices[n + 1] * this.image_yscale);
			    }
			}
		}
		break;
	}

	// Setup the remaining fixture settings
	physics_fixture_set_angular_damping(fixtureID, physicsData.physicsAngularDamping);
	physics_fixture_set_linear_damping(fixtureID, physicsData.physicsLinearDamping);
	physics_fixture_set_sensor(fixtureID, physicsData.physicsSensor);
	physics_fixture_set_collision_group(fixtureID, physicsData.physicsGroup);
	physics_fixture_set_density(fixtureID, physicsData.physicsDensity);
	physics_fixture_set_restitution(fixtureID, physicsData.physicsRestitution);
	// Maintain backwards compatability?
	if (physicsData.physicsFriction != undefined) {
	    physics_fixture_set_friction(fixtureID, physicsData.physicsFriction);
	}
	if (physicsData.physicsAwake != undefined) {
	    physics_fixture_set_awake(fixtureID, physicsData.physicsAwake);
	}
	if (physicsData.physicsKinematic != undefined) {
	    physics_fixture_set_kinematic(fixtureID, physicsData.physicsKinematic);
	}

	// And bind the fixture to get the physical object for this instance
	physics_fixture_bind(this, fixtureID, this.id, xoffs, yoffs);	
};

// #############################################################################################
/// Function:<summary>
///				Computes the speed and direction from the components
///          </summary>
// #############################################################################################
yyInstance.prototype.Compute_Speed1 = function () {
	with (this)
	{
		// direction
		if (this.hspeed == 0)
		{
			if (this.vspeed > 0)
			{
				this.__direction = 270;
			}
			else if (this.vspeed < 0)
			{
				this.__direction = 90;
			}
			else { this.__direction = 0; }
		}
		else
		{
			var dd = ClampFloat(180 * (Math.atan2(this.vspeed, this.hspeed)) / Pi);
			if (dd <= 0) { this.__direction = -dd; } else { this.__direction = 360.0 - dd; }
		}

		if (Math.abs(this.__direction - Round(this.__direction)) < 0.0001)
		{
			this.__direction = Round(this.__direction);
		}
		this.__direction = fmod(this.__direction, 360.0);

		// speed
		this.__speed = Math.sqrt(Sqr(this.hspeed) + Sqr(this.vspeed));
		if (Math.abs(this.speed - Round(this.speed)) < 0.0001) this.__speed = Round(this.__speed);
	}
};


// #############################################################################################
/// Function:<summary>
///				Computes the components from the speed and direction
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Compute_Speed2 = function () {
	this.__hspeed = this.speed * ClampFloat(Math.cos(this.direction * 0.0174532925));   //* Pi / 180.0);
	this.__vspeed = -this.speed * ClampFloat(Math.sin(this.direction * 0.0174532925)); // * Pi / 180.0);

	// Round a bit
	if (Math.abs(this.__hspeed - Round(this.__hspeed)) < 0.0001) { this.__hspeed = Round(this.__hspeed); }
	if (Math.abs(this.__vspeed - Round(this.__vspeed)) < 0.0001) { this.__vspeed = Round(this.__vspeed); }
};

function ClampFloat(_f) { return  (~~(_f * 1000000)) / 1000000.0; }

// #############################################################################################
/// Function:<summary>
///				Add speed amount in direction dir
///          </summary>
///
/// In:		 <param name="_dir"></param>
///			 <param name="_amount"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.AddTo_Speed = function (_dir, _amount) {
	this.hspeed += _amount * ClampFloat( Math.cos(_dir * 0.0174532925)); // * Math.PI / 180.0);
	this.vspeed -= _amount * ClampFloat( Math.sin( _dir * 0.0174532925)); //* Math.PI / 180.0);

	this.Compute_Speed1();
};


// #############################################################################################
/// Function:<summary>
///				Adapts the speed of the instance based on friction and gravity
///          </summary>
// #############################################################################################
yyInstance.prototype.AdaptSpeed = function () {
	// deal with friction
	if (this.friction != 0.0)
	{
		var ns;
		if (this.speed > 0)
		{
			ns = this.speed - this.friction;
		}
		else
		{
			ns = this.speed + this.friction;
		}



		if ((this.speed > 0) && (ns < 0))
		{
			this.speed = 0;
		}
		else if ((this.speed < 0) && (ns > 0))
		{
			this.speed = 0;
		}
		else if (this.speed != 0)
		{
			this.speed = ns;
		}
	}


	// deal with gravity
	if (this.gravity != 0)
	{
		this.AddTo_Speed(this.gravity_direction, this.gravity);
	}
};


// #############################################################################################
/// Function:<summary>
///             Get the image number
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.GetImageNumber = function () {

    var pSprite = g_pSpriteManager.Get(this.sprite_index);    

    var skeletonAnim = this.SkeletonAnimation();
    if (skeletonAnim) {
        return skeletonAnim.FrameCount(pSprite);
    }
	return g_pSpriteManager.GetImageCount(this.sprite_index);
};

// #############################################################################################
/// Function:<summary>
///             Handles events with the specific class/Object type to use allowing us to
///             set the level in the inheritance hierarchy we're working from.
///             Shouldn't be called externally!
///          </summary>
///
/// In:		 <param name="_event">the event to perform</param>
///          <param name="_index">"SUB" eventy to use.</param>
///          <param name="_pInst">the THIS to use in the event</param>
///			 <param name="_pOther">the OTHER to use in the event</param>
// #############################################################################################
yyInstance.prototype.PerformEvent = function (_event, _index, _pInst, _pOther, _pInstObject) {

    if( _pInstObject == undefined ) {
        _pInstObject = _pInst.pObject;
    }

    var oldobj = Current_Object;
	var oldtype = Current_Event_Type;
	var oldnumb = Current_Event_Number;
	
	var result = false;
	var break_loop = false;
	if (_event == EVENT_COLLISION) {
		
        //
        // Search for the correct inherited collision event.
        // Run up BOTH parent trees looking for the proper event (current->parent->parent->etc)
        //
		var pChildObj = g_pObjectManager.Get(_index);    //_pOther.pObject;
		while (pChildObj != null && !break_loop)
		{
			var pObj = _pInstObject;
			while (pObj != null && !break_loop)
			{
				// if the object handles this event, then do the event.
				if (pObj.Event[_event])
				{
					if (pObj.Collisions[pChildObj.ID])            // SUB event is the instance object
					{
						Current_Object = pObj;
						Current_Event_Type = _event;
						Current_Event_Number = pChildObj.ID;

						result = pObj.PerformEvent(_event, pChildObj.ID, _pInst, _pOther);
						break_loop = true;
						break;
					}
				}
				// If the object DOESN'T handle this event, then try the parent.
				pObj = pObj.pParent;
			}
			pChildObj = pChildObj.pParent;
		}			
	} 
	else {
	
		var pObj = _pInstObject;
		var evnt = _event | _index;
		while (pObj != null)
		{
			// if the object handles this event, then do the event.
			if (pObj.Event[evnt])
			{
				Current_Object = pObj;
				Current_Event_Type = _event;
				Current_Event_Number = _index;

				result = pObj.PerformEvent(_event, _index, _pInst, _pOther);
				break;
			}
			// If the object DOESN'T handle this event, then try the parent.
			pObj = pObj.pParent;
		}
	}

	// Restore previous current object settings
	Current_Object = oldobj;
	Current_Event_Type = oldtype;
	Current_Event_Number = oldnumb;

	return result;
};

// #############################################################################################
/// Function:<summary>
///             Perform the next most available inherited event on this instance.
///          </summary>
///
/// In:		 <param name="_pInst">the event to perform</param>
///          <param name="_pInst">the THIS to use in the event</param>
///			 <param name="_pOther">the OTHER to use in the event</param>
// #############################################################################################
yyInstance.prototype.PerformEventInherited = function (_event, _index, _pOther) {

    if (Current_Object != null) {
        if (Current_Object.pParent != null) {         	
	        this.PerformEvent(_event, _index, this, _pOther, Current_Object.pParent);
	    }
	}
};

// #############################################################################################
/// Function:<summary>
///             Perform an event on this instance.
///          </summary>
///
/// In:		 <param name="_pInst">the event to perform</param>
///          <param name="_pInst">the THIS to use in the event</param>
///			 <param name="_pOther">the OTHER to use in the event</param>
// #############################################################################################
/*yyInstance.prototype.PerformEvent = function (_event, _index, _pInst, _pOther) {

    //if( pObject.Name == "oAssessmentBack" & _event==EVENT_DRAW){
	//    this.testcode = 1;
	//}
    return this.PerformEvent_Common(_event, _index, _pInst, _pOther, _pInst.pObject);
};*/


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="val"></param>
///				
// #############################################################################################
yyInstance.prototype.sethspeed = function (_val) {
	_val = yyGetReal(_val);
	if (this.hspeed == _val) return;

	this.hspeed = _val;
	this.Compute_Speed1();
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.setvspeed = function (_val) {
	_val = yyGetReal(_val);
	if (this.vspeed == _val) return;
	this.vspeed = _val;
	this.Compute_Speed1();
};


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="val"></param>
///				
// #############################################################################################
yyInstance.prototype.setdirection = function (_val) {

	_val = yyGetReal(_val);

  //  while (_val < 0.0) { _val += 360.0; }
//	while (_val > 360.0) { _val -= 360.0; }

	this.direction = fmod(_val, 360.0);

	while (this.direction < 0.0) { this.direction += 360.0; }

	this.Compute_Speed2();
};


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_val"></param>
///				
// #############################################################################################
yyInstance.prototype.setspeed = function (_val) {
	_val = yyGetReal(_val);
	if (this.speed == _val) return;

	this.speed = _val;
	this.Compute_Speed2();
};

// #############################################################################################
/// Function:<summary>
///				Computes the real scaled, translated bounding box
///          </summary>
// #############################################################################################
yyInstance.prototype.Compute_BoundingBox = function() {
    var maskCollisionSkel = this.MaskCollisionSkeleton();
    var collisionSkel = this.GetCollisionSkeleton();

    if(maskCollisionSkel !== null && g_pSpriteManager.Sprites[this.mask_index].bboxmode == 0 /* "Automatic" */) {
        if (!this.bbox) {
            this.bbox = new YYRECT(0, 0, 0, 0);
        }

        if(maskCollisionSkel.ComputeBoundingBox(this.bbox, this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle))
        {
            this.colcheck = yySprite_CollisionType.SPINE_MESH;
        }
        else {
            this.bbox.left = this.x; // no collisions
            this.bbox.top = this.y;
            this.bbox.right = this.x;
            this.bbox.bottom = this.y;

            this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
        }

        this.bbox_dirty = false;
        return;
    }
    else if(collisionSkel !== null && g_pSpriteManager.Sprites[this.sprite_index].bboxmode == 0 /* "Automatic" */) {
        if (!this.bbox) {
            this.bbox = new YYRECT(0, 0, 0, 0);
        }

        if(collisionSkel.ComputeBoundingBox(this.bbox, this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle))
        {
            this.colcheck = yySprite_CollisionType.SPINE_MESH;
        }
        else {
            this.bbox.left = this.x; // no collisions
            this.bbox.top = this.y;
            this.bbox.right = this.x;
            this.bbox.bottom = this.y;

            this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
        }

        this.bbox_dirty = false;
        return;
    }

    var spr, t;
    var ix = (this.mask_index >= 0) ? this.mask_index : this.sprite_index;
    if (ix < 0 || ix > g_pSpriteManager.Sprites.length) {
            
        if (!this.bbox) {
            this.bbox = new YYRECT(0, 0, 0, 0);
        }
        this.bbox.left = this.x; // no collisions
        this.bbox.top = this.y;
        this.bbox.right = this.x;
        this.bbox.bottom = this.y;

        this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
    }
    else 
    {
        var bbox = this.bbox;
        spr = g_pSpriteManager.Sprites[ix];
        if (this.image_angle == 0) {
        
			if ((spr.nineslicedata != null) && (spr.nineslicedata.GetEnabled()))
			{
				bbox = spr.GetScaledBoundingBox(this.image_xscale, this.image_yscale);

				bbox.left += this.x;
				bbox.right += this.x;

				bbox.top += this.y;
				bbox.bottom += this.y;
			}
			else
			{
				var pRect = spr.bbox;            
				var width = (pRect.right+1) - pRect.left;
				var height = (pRect.bottom + 1) - pRect.top;
				if (g_Collision_Compatibility_Mode)
				{
				    bbox.left = Round(this.x + this.image_xscale * (pRect.left - spr.xOrigin));
				    bbox.right = Round(bbox.left + (this.image_xscale * width));
				}
				else
				{
				    bbox.left = (this.x + this.image_xscale * (pRect.left - spr.xOrigin));
				    bbox.right = (bbox.left + (this.image_xscale * width));
				}
				//bbox.left = Math.floor((this.x + this.image_xscale * (pRect.left - spr.xOrigin)) + 0.5);            
				//bbox.right = Math.floor((this.x + this.image_xscale * (pRect.right - spr.xOrigin + 1)) + 0.5);
				if (bbox.left > bbox.right) {
					t = bbox.left;
					bbox.left = bbox.right;
					bbox.right = t;
				}
				
				if (g_Collision_Compatibility_Mode)
				{
				    bbox.top = Round(this.y + this.image_yscale * (pRect.top - spr.yOrigin));
				    bbox.bottom = Round(bbox.top + (this.image_yscale * height));
				}
				else
				{
				    bbox.top = (this.y + this.image_yscale * (pRect.top - spr.yOrigin));
				    bbox.bottom = (bbox.top + (this.image_yscale * height));

				}
				//bbox.top = Math.floor((this.y + this.image_yscale * (pRect.top - spr.yOrigin)) + 0.5);            
				//bbox.bottom = Math.floor((this.y + this.image_yscale * (pRect.bottom - spr.yOrigin + 1)) + 0.5);
				if (bbox.top > bbox.bottom) {
					t = bbox.top;
					bbox.top = bbox.bottom;
					bbox.bottom = t;
				}
				if (g_Collision_Compatibility_Mode) {
				    bbox.right -= 1;
				    bbox.bottom -= 1;
				}
			}
            
			this.colcheck = spr.colcheck;
        }
        else {
			var xmin, xmax;
			var ymin, ymax;

			if ((spr.nineslicedata != null) && (spr.nineslicedata.GetEnabled()))
			{
				bbox = spr.GetScaledBoundingBox(this.image_xscale, this.image_yscale);

				xmin = bbox.left;
				xmax = bbox.right;

				ymin = bbox.top;
				ymax = bbox.bottom;

				if (g_Collision_Compatibility_Mode) {
				    ymax += 1;
				    xmax += 1;
				}

			}
			else
			{
				var pRect = spr.bbox;            

				// base on sprite bbox, and these can't change, so will always be in order, left<right and top<bottom
				xmin = this.image_xscale * (pRect.left - spr.xOrigin);
				xmax = this.image_xscale * (pRect.right - spr.xOrigin + 1);
				
				ymin = this.image_yscale * (pRect.top - spr.yOrigin);
				ymax = this.image_yscale * (pRect.bottom - spr.yOrigin + 1);
			}

            var cc, ss;
            cc = Math.cos(this.image_angle * Pi / 180.0);
            ss = Math.sin(this.image_angle * Pi / 180.0);

            // factor out "common" calculations...
            var cc_xmax = cc * xmax;
            var cc_xmin = cc * xmin;
            var ss_ymax = ss * ymax;
            var ss_ymin = ss * ymin;
            var t;
            if (cc_xmax < cc_xmin) {
                t = cc_xmin;
                cc_xmin = cc_xmax;
                cc_xmax = t;
            }
            if (ss_ymax < ss_ymin) {
                t = ss_ymin;
                ss_ymin = ss_ymax;
                ss_ymax = t;
            }
            
            if (g_Collision_Compatibility_Mode) {
                bbox.left = Math.floor((this.x + cc_xmin + ss_ymin) + 0.5);
                bbox.right = Math.floor((this.x + cc_xmax + ss_ymax) - 0.5);
            }
            else {
                bbox.left = (this.x + cc_xmin + ss_ymin) ;
                bbox.right = (this.x + cc_xmax + ss_ymax);
            }

            // factor out "common" calculations...
            var cc_ymax = cc * ymax;
            var cc_ymin = cc * ymin;
            var ss_xmax = ss * xmax;
            var ss_xmin = ss * xmin;
            if (cc_ymax < cc_ymin) {
                t = cc_ymin;
                cc_ymin = cc_ymax;
                cc_ymax = t;
            }
            if (ss_xmax < ss_xmin) {
                t = ss_xmin;
                ss_xmin = ss_xmax;
                ss_xmax = t;
            }      
            if (g_Collision_Compatibility_Mode) {
                bbox.top = Math.floor((this.y + cc_ymin - ss_xmax) + 0.5);
                bbox.bottom = Math.floor((this.y + cc_ymax - ss_xmin) - 0.5);
            }
            else
            {
                bbox.top = ((this.y + cc_ymin - ss_xmax));
                bbox.bottom = ((this.y + cc_ymax - ss_xmin));
            }

			this.colcheck = spr.colcheck;
        }
        this.bbox = bbox;
    }    
    this.bbox_dirty = false;
};

// #############################################################################################
/// Function:<summary>
/// Compute the on-screen bounding box, if it needs updating.
/// </summary>
// #############################################################################################
yyInstance.prototype.Maybe_Compute_BoundingBox = function() {
	/* Checks if the mask_index (or its collision options) have changed and sets the dirty flag if
	 * we need to recompute our bounding box.
	*/
	this.MaskCollisionSkeleton();

	if (this.bbox_dirty)
	{
		this.Compute_BoundingBox();
		return;
	}

	var collisionSkel = this.GetCollisionSkeleton();
	if (collisionSkel !== null)
	{
		var sprite = _spr = g_pSpriteManager.Get(this.sprite_index);

		if(collisionSkel.SetAnimationTransform(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle, undefined, sprite))
		{
			 /* Bounding box isn't flagged as dirty, but the Skeleton sprite/animation
			  * state has changed, so force an update anyway.
			*/

			this.Compute_BoundingBox();
			return;
		}
	}
};


// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with a point
///          </summary>
///
/// In:		 <param name="x">X coordinate</param>
///			 <param name="y">Y coordinate</param>
///			 <param name="prec">indicates whether to use precise checking</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Collision_Point = function (_x, _y, _prec) {

	if (this.marked) return false;

	this.Maybe_Compute_BoundingBox();

	var col_delta = -0.00001; //To avoid floating point inaccuracies
	if (g_Collision_Compatibility_Mode)
	{
	    col_delta = 1.0; //or in compat mode to go back to how it was
	}

	// easy cases first
	var bbox = this.bbox;
	if (_x >= bbox.right + col_delta) return false;
	if (_x < bbox.left) return false;
	if (_y >= bbox.bottom + col_delta) return false;
	if (_y < bbox.top) return false;

	if (this.colcheck === yySprite_CollisionType.ROTATED_RECT)
	{
		if (!SeparatingAxisCollisionPoint(this, _x, _y))
		{
			return false;
		}
	}

	var pSpr;
	if (this.mask_index < 0) {
	    pSpr = g_pSpriteManager.Get(this.sprite_index);
	}
	else {
	    pSpr = g_pSpriteManager.Get(this.mask_index);
	}
    // If this is an invalid sprite, or it has NO images, then false.
	if ((pSpr === null) || (pSpr.numb === 0)) return false;

	// If the point collided with the box, and we're not doing "precise" collisions, then exit true.
	if ((!_prec) || this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT) return true;


	// handle precise collision tests
    var Result = false;
	var collisionSkel = this.GetCollisionSkeleton();
    if (collisionSkel !== null) {
        Result = collisionSkel.PointCollision(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle, _x, _y);
    }
    else {    
	    Result = pSpr.PreciseCollisionPoint(Math.floor(this.image_index), bbox,
                                            Round(this.x), Round(this.y),
                                            this.image_xscale, this.image_yscale,
                                            this.image_angle,
                                            Round(_x), Round(_y)
                                        );
    }
	return Result;
};


// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with a rectangle
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="prec">indicates whether to use precise checking</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Collision_Rectangle = function (_x1, _y1, _x2, _y2, _prec) {
	if (this.marked) return false;

	this.Maybe_Compute_BoundingBox();

	// easy cases first
	var bbox = this.bbox;

	var col_delta = 0; //To avoid floating point inaccuracies
	if (g_Collision_Compatibility_Mode)
	{
	    col_delta = 1.0; //or in compat mode to go back to how it was
	}


	var bl = yymin(_x1, _x2);

	if ( bl>= bbox.right + col_delta)
	{
	    return Result;
	}

	var br = yymax(_x1, _x2);

	if ( br <  bbox.left     )
	{
	    return Result;
	}

	var bt = yymin(_y1, _y2);

	if (bt >= bbox.bottom + col_delta)
	{
	    return Result;
	}

	var bb = yymax(_y1, _y2);
	if ( bb <  bbox.top      )
	{
	    return Result;
	}

	var pSpr;
	if (this.mask_index < 0) {
	    pSpr = g_pSpriteManager.Get(this.sprite_index);
	}
	else {
	    pSpr = g_pSpriteManager.Get(this.mask_index);
	}
    // If this is an invalid sprite, or it has NO images, then false.
	if ((pSpr === null) || (pSpr.numb == 0)) return false;

	if (this.colcheck === yySprite_CollisionType.ROTATED_RECT) {
	    if (!SeparatingAxisCollisionBox(this, _x1, _y1, _x2, _y2))
	        return false;
	}

	if ((!_prec) || this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT) {

	    if (!g_Collision_Compatibility_Mode)
	    {
	        var l = (yymax(bl, bbox.left));
	        var t = (yymax(bt, bbox.top));
	        var r = (yymin(br, bbox.right));
	        var b = (yymin(bb, bbox.bottom));

	        if (Math.floor(l + 0.5) == Math.floor(r + 0.5))
				return false;

	        if (Math.floor(t + 0.5) == Math.floor(b + 0.5))
				return false;
	    }
	    return true;
	}

	// handle precise collision tests
    var Result = false;
	var collisionSkel = this.GetCollisionSkeleton();
    if (collisionSkel !== null) {
        Result = collisionSkel.RectangleCollision(this.CollisionImageIndex(), this.x, this.y, 
                                                 this.image_xscale, this.image_yscale, this.image_angle, 
			                                     _x1, _y1, _x2, _y2);
    }
    else {
	    //function Rect(ALeft, ATop, ARight, ABottom: Integer): TRect;
	    g_rr.left = Round(yymin(_x1, _x2));
	    g_rr.top = Round(yymin(_y1, _y2));
	    g_rr.right = Round(yymax(_x1, _x2));
	    g_rr.bottom = Round(yymax(_y1, _y2));
    
	    Result = pSpr.PreciseCollisionRectangle(Math.floor(this.image_index), bbox, Round(this.x), Round(this.y),
	    											this.image_xscale, this.image_yscale, this.image_angle, g_rr);
    }
	return Result;
};

// #############################################################################################
/// Function:<summary>
///				returns true if point(_px,_py) is in ellipse defined by box _x1,_y1,_x2,_y2
///          </summary>
// #############################################################################################
function PtInEllipse(_x1, _y1, _x2, _y2, _px, _py)
{
    //find ellipse centre, x&y radius
    var mx = (_x1 + _x2) * 0.5;
    var my = (_y1 + _y2) * 0.5;
    var ww = (_x2 - _x1) * 0.5;
    var hh = (_y2 - _y1) * 0.5;

    var a = (_px - mx) / ww;
    var b = (_py - my) / hh;
    return ((a * a) + (b * b) <= 1) ? true : false;
};   


// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with an ellipse
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="prec">indicates whether to use precise checking</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Collision_Ellipse = function (_x1, _y1, _x2, _y2, _prec) {

	if (this.marked) return false;

	this.Maybe_Compute_BoundingBox();

    if (this.bbox_dirty) this.Compute_BoundingBox();
    
	//var rr;
	_x1 = Round(_x1);
	_x2 = Round(_x2);
	_y1 = Round(_y1);
	_y2 = Round(_y2);

	var max_x1x2, max_y1y2, min_x1x2, min_y1y2;

	if (_x1 < _x2)
	{
		min_x1x2 = _x1;
		max_x1x2 = _x2;
	} else
	{
		min_x1x2 = _x2;
		max_x1x2 = _x1;
	}
	if (_y1 < _y2)
	{
		min_y1y2 = _y1;
		max_y1y2 = _y2;
	} else
	{
		min_y1y2 = _y2;
		max_y1y2 = _y1;
	}


	// easy cases first
	var bbox = this.bbox;
	if (min_x1x2 >= bbox.right) return false;
	if (max_x1x2 < bbox.left) return false;
	if (min_y1y2 >= bbox.bottom) return false;
	if (max_y1y2 < bbox.top) return false;


	// check whether single line
	if ((_x1 == _x2) || (_y1 == _y2))
	{
		return this.Collision_Rectangle(_x1, _y1, _x2, _y2, _prec);
	}

    // now see whether the ellipse intersect the bounding box
	var cx = (_x1 + _x2) * 0.5;
	var cy = (_y1 + _y2) * 0.5;
	if (!(bbox.left <= cx && bbox.right >= cx) &&
        !(bbox.top <= cy && bbox.bottom >= cy))
	{
	    var px = (bbox.right <= cx) ? bbox.right : bbox.left;
	    var py = (bbox.bottom <= cy) ? bbox.bottom : bbox.top;
	    if( !PtInEllipse( _x1,_y1,_x2,_y2, px, py ))
	        return false;
	}

	var pSpr;
	if (this.mask_index < 0) {
	    pSpr = g_pSpriteManager.Get(this.sprite_index);
	}
	else {
	    pSpr = g_pSpriteManager.Get(this.mask_index);
	}
	if ((pSpr === null) || (pSpr.numb == 0)) return false;

	if (this.colcheck === yySprite_CollisionType.ROTATED_RECT) {
	    if (!SeparatingAxisCollisionEllipse(this, _x1, _y1, _x2, _y2))
	        return false;
	}

	if ((!_prec) || this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT) return true;
	
	g_rr.left = min_x1x2;
	g_rr.top = min_y1y2;
	g_rr.right = max_x1x2;
	g_rr.bottom = max_y1y2;

	// handle precise collision tests
	var collisionSkel = this.GetCollisionSkeleton();
    if (collisionSkel !== null) {
        return collisionSkel.EllipseCollision(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle, g_rr);
    }
    else {	    
	    return pSpr.PreciseCollisionEllipse(Math.floor(this.image_index), bbox, Round(this.x), Round(this.y), this.image_xscale, this.image_yscale, this.image_angle, g_rr);
    }
};


// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with a line segment
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="prec">indicates whether to use precise checking</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Collision_Line = function (_x1, _y1, _x2, _y2, _prec) {

	if (this.marked) return false;

	this.Maybe_Compute_BoundingBox();

	// easy cases first    
	var i_bbox = this.bbox;
	if (yymin(_x1, _x2) >= i_bbox.right + 1) { return false; }
	if (yymax(_x1, _x2) < i_bbox.left) { return false; }
	if (yymin(_y1, _y2) >= i_bbox.bottom + 1) { return false; }
	if (yymax(_y1, _y2) < i_bbox.top) { return false; }

	// now check whether we intersect the bounding box
	// make sure line runs from left to right
	if (_x2 < _x1)
	{
		var val = _x2;
		_x2 = _x1;
		_x1 = val;

		val = _y2;
		_y2 = _y1;
		_y1 = val;
	}

	// shift left end point    
	if (_x1 < i_bbox.left)
	{
		_y1 = _y1 + (i_bbox.left - _x1) * (_y2 - _y1) / (_x2 - _x1);   // _x2 cannot be _x1
		_x1 = i_bbox.left;
	}

	// shift right end point
	if (_x2 > (i_bbox.right + 1))
	{
		_y2 = _y2 + (i_bbox.right + 1 - _x2) * (_y2 - _y1) / (_x2 - _x1);   // x2 cannot be x1
		_x2 = i_bbox.right + 1;
	}

	// check whether part lies outside
	if ((_y1 < i_bbox.top) && (_y2 < i_bbox.top)) { return false; }
	if ((_y1 >= i_bbox.bottom + 1) && (_y2 >= i_bbox.bottom + 1)) { return false; }

		var pSpr;
	    if (this.mask_index < 0) {
	    	pSpr = g_pSpriteManager.Get(this.sprite_index);
	    }
	    else {
	    	pSpr = g_pSpriteManager.Get(this.mask_index);
	    }
	    if ((pSpr == null) || (pSpr == undefined) || (pSpr.GetCount() == 0)) return false;

		if (this.colcheck === yySprite_CollisionType.ROTATED_RECT)
		{
			if (!SeparatingAxisCollisionLine(this, _x1, _y1, _x2, _y2))
			{
				return false;
			}
		}

	if (!_prec || this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT) { return true; }

	// handle precise collision tests
	var collisionSkel = this.GetCollisionSkeleton();
	if (collisionSkel !== null) {
	    return collisionSkel.LineCollision(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle, _x1, _y1, _x2, _y2);
	}
	else {
	    return pSpr.PreciseCollisionLine(this.image_index | 0, i_bbox, Round(this.x), Round(this.y), this.image_xscale, this.image_yscale, this.image_angle, Round(_x1), Round(_y1), Round(_x2), Round(_y2));
    }
};


// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with another instance given that this
///				instance is using a skeleton animation rather than a "normal" sprite
///          </summary>
// #############################################################################################
yyInstance.prototype.Collision_Skeleton = function (inst, prec)
{
	// Go ahead and get the bounding box for our animation
	this.Maybe_Compute_BoundingBox();
	inst.Maybe_Compute_BoundingBox();

	// Do the bounds overlap test
	if ( inst.bbox.left     >= this.bbox.right+1  ) return false;
	if ( inst.bbox.right+1  <= this.bbox.left     ) return false;
	if ( inst.bbox.top      >= this.bbox.bottom+1 ) return false;
	if ( inst.bbox.bottom+1 <= this.bbox.top      ) return false;


	// If the other instance doesn't actually have a sprite then we can't do precise collision testing with it
	var spr1 = g_pSpriteManager.Get(this.sprite_index);
	var spr2 = (inst.mask_index < 0) 
	    ? g_pSpriteManager.Get(inst.sprite_index)
	    : g_pSpriteManager.Get(inst.mask_index);
	    
	if (spr2 === null) return false;	

	// Don't proceed further if precise collision checking hasn't been selected
	if (!prec) return true;

	var skel1 = this.GetCollisionSkeleton();
	var skel2 = inst.GetCollisionSkeleton();

	// At this stage, decide how to test for a collision between the two "sprites"
	if (skel2 !== null) {
		/* inst/spr2 is using spine collisions */
		return skel1.SkeletonCollision(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle,
			skel2, inst.CollisionImageIndex(), inst.x, inst.y, inst.image_xscale, inst.image_yscale, inst.image_angle);				
	}
	else if (spr2.colcheck == yySprite_CollisionType.PRECISE) {
		/* inst/spr2 is using precise collisions */
		return skel1.SpriteCollision(this.CollisionImageIndex(), this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle,
			spr2, inst.bbox, inst.CollisionImageIndex(), inst.x, inst.y, inst.image_xscale, inst.image_yscale, inst.image_angle);	
	}
	else{
		/* inst/spr2 is using bounding box collisions - no more to do. */
		return true;
	}
};


yyInstance.prototype.Animate = function() {

    if(g_isZeus)
    {
        var pImage = g_pSpriteManager.Get( this.sprite_index );
        if(pImage != null)
        {
			if(pImage.sequence === null)
			{
				if (pImage.playbackspeedtype == ePlaybackSpeedType_FramesPerGameFrame)
				{
					this.SetImageIndex(this.image_index + this.image_speed*pImage.playbackspeed);
				}
				else
				{
					var fps = g_GameTimer.GetFPS();
					this.SetImageIndex(this.image_index + this.image_speed*pImage.playbackspeed/fps);
				}
			}

            return;
        }
    }

	// BUGFIX: 30634 If we have no valid image set, increment image_index anyway just like in the Win32 runner
    this.image_index += this.image_speed;
};

function sa_getAxes(points)
{
	var rv = [];

	for (var i = 0; i < 2; ++i)
	{
		var x = points[i + 1].x - points[i].x;
		var y = points[i + 1].y - points[i].y;

		var length = sqrt(x * x + y * y);

		x = x / length;
		y = y / length;

		rv[i] = {"x" : -y, "y" : x};
	}

	return rv;
};

function sa_checkCollision(p1, p2)
{
	var p1Axes = sa_getAxes(p1);
	var p2Axes = sa_getAxes(p2);

	for (var i = 0; i < 2; ++i)
	{
		var p1Proj = sa_getProjection(p1, p1Axes[i]);
		var p2Proj = sa_getProjection(p2, p1Axes[i]);

		var gap_present = ((p1Proj.max <= p2Proj.min) || (p2Proj.max <= p1Proj.min));

		if (gap_present)
			return false;
	}

	for (var i = 0; i < 2; ++i)
	{
		var p1Proj = sa_getProjection(p1, p2Axes[i]);
		var p2Proj = sa_getProjection(p2, p2Axes[i]);

		var gap_present = ((p1Proj.max <= p2Proj.min) || (p2Proj.max <= p1Proj.min));

		if (gap_present)
			return false;
	}

	return true;
};

function sa_getProjection(points, axis)
{
	var newProj = points[0].x * axis.x + points[0].y * axis.y;
	var result = {"min" : newProj, "max" : newProj};

	for (var i = 1; i < 4; ++i)
	{
		newProj = points[i].x * axis.x + axis.y * points[i].y;

		if (newProj < result.min)
			result.min = newProj;
		else if (newProj > result.max)
			result.max = newProj;
	}

	return result;
};

function getPoints(i1)
{
	var ix = (i1.mask_index >= 0) ? i1.mask_index : i1.sprite_index;
    var spr = g_pSpriteManager.Sprites[ix];	
	var xmin, xmax;
	var ymin, ymax;

	if ((spr.nineslicedata != null) && (spr.nineslicedata.GetEnabled()))
	{
		var bbox = spr.GetScaledBoundingBox(i1.image_xscale, i1.image_yscale);

		xmin = bbox.left;
		xmax = bbox.right + 1;

		ymin = bbox.top;
		ymax = bbox.bottom + 1;
	}
	else
	{
		var pRect = spr.bbox;

		// base on sprite bbox, and these can't change, so will always be in order, left<right and top<bottom
		xmin = i1.image_xscale * (pRect.left - spr.xOrigin);
		xmax = i1.image_xscale * (pRect.right - spr.xOrigin + 1);

		ymin = i1.image_yscale * (pRect.top - spr.yOrigin);
		ymax = i1.image_yscale * (pRect.bottom - spr.yOrigin + 1);
	}

	var cc, ss;
	cc = Math.cos(-i1.image_angle * Pi / 180.0);
	ss = Math.sin(-i1.image_angle * Pi / 180.0);

	// factor out "common" calculations...
	var cc_xmax = cc * xmax;
	var cc_xmin = cc * xmin;
	var ss_ymax = ss * ymax;
	var ss_ymin = ss * ymin;
	var cc_ymax = cc * ymax;
	var cc_ymin = cc * ymin;
	var ss_xmax = ss * xmax;
	var ss_xmin = ss * xmin;

	var rv = [];
	var ix = i1.x - 0.5;
	var iy = i1.y - 0.5;

	rv[0] = { "x": (ix + cc_xmin - ss_ymin), "y": (iy + cc_ymin + ss_xmin) };
	rv[1] = { "x": (ix + cc_xmax - ss_ymin), "y": (iy + cc_ymin + ss_xmax) };
	rv[2] = { "x": (ix + cc_xmax - ss_ymax), "y": (iy + cc_ymax + ss_xmax) };
	rv[3] = { "x": (ix + cc_xmin - ss_ymax), "y": (iy + cc_ymax + ss_xmin) };

	return rv;
};

function SeparatingAxisCollision(i1, i2)
{
	var p1 = getPoints(i1);
	var p2 = getPoints(i2);

	return sa_checkCollision(p1, p2);
};

function sa_getAxesLine(points)
{
	var x = points[1].x - points[0].x;
	var y = points[1].y - points[0].y;

	var length = sqrt(x * x + y * y);

	x = x / length;
	y = y / length;

	rv = {"x" : -y, "y" : x};

	return rv;
};

function sa_checkCollisionPoint(p1, p2)
{
    var p1Axes = sa_getAxes(p1);

    for (var i = 0; i < 2; ++i)
    {
        var p1Proj = sa_getProjection(p1, p1Axes[i]);
        var p2Proj = p2.x * p1Axes[i].x + p2.y * p1Axes[i].y;

        var gap_present = ((p1Proj.max <= p2Proj) || (p2Proj <= p1Proj.min));

        if (gap_present)
            return false;
    }

    return true;
};

// #############################################################################################
/// Function:<summary>
///             OBB/axis-aligned ellipse separating axis test
///          </summary>
///
/// In:		 <param name="p1">instance OBB points</param>
///			 <param name="pcentre">ellipse centre</param>
///			 <param name="rx">ellipse x-axis radius</param>
///			 <param name="ry">ellipse y-axis radius</param>
/// Out:	 <returns>
///				true if intersection (no separating axis found)
///			 </returns>
// #############################################################################################
function sa_checkCollisionEllipse(p1, pcentre, rx, ry)
{
    //apply x scale transform to circle with radius ry
    var sx = Math.abs(ry / rx);
    for (var i = 0; i < 4; ++i)
        p1[i].x *= sx;
    pcentre.x *= sx;
    var r = Math.abs(ry);

    var p1Axes = sa_getAxes(p1);

    for (var i = 0; i < 2; ++i)
    {
        var p1Proj = sa_getProjection(p1, p1Axes[i]);
        var pCentreProj = pcentre.x * p1Axes[i].x + pcentre.y * p1Axes[i].y;
        var p2Proj = { "min": pCentreProj - r, "max": pCentreProj + r };
        var gap_present = ((p1Proj.max <= p2Proj.min) || (p2Proj.max <= p1Proj.min));

        if (gap_present)
            return false;
    }

    return true; //no separating axis found
}

function sa_checkCollisionLine(p1, p2)
{
	var p1Axes = sa_getAxes(p1);
	var p2Axis = sa_getAxesLine(p2);

	for (var i = 0; i < 2; ++i)
	{
		var p1Proj = sa_getProjection(p1, p1Axes[i]);
		var p2Proj = sa_getProjectionLine(p2, p1Axes[i]);

		var gap_present = ((p1Proj.max <= p2Proj.min) || (p2Proj.max <= p1Proj.min));

		if (gap_present)
			return false;
	}

	{
		var p1Proj = sa_getProjection(p1, p2Axis);
		var p2Proj = sa_getProjectionLine(p2, p2Axis);

		var gap_present = ((p1Proj.max <= p2Proj.min) || (p2Proj.max <= p1Proj.min));

		if (gap_present)
			return false;
	}

	return true;
}

function sa_getProjectionLine(points, axis)
{
	var newProj = points[0].x * axis.x + points[0].y * axis.y;
	var result = {"min" : newProj, "max" : newProj};

	for (var i = 1; i < 2; ++i)
	{
		newProj = points[i].x * axis.x + axis.y * points[i].y;

		if (newProj < result.min)
			result.min = newProj;
		else if (newProj > result.max)
			result.max = newProj;
	}

	return result;
}

function getPointsLine(_x1, _y1, _x2, _y2)
{
	rv = [];

	rv[0] = {"x" : _x1, "y" : _y1};
	rv[1] = {"x" : _x2, "y" : _y2};

	return rv;
};

function SeparatingAxisCollisionLine(i1, _x1, _y1, _x2, _y2)
{
	var p1 = getPoints(i1);
	var p2 = getPointsLine(_x1, _y1, _x2, _y2);

	return sa_checkCollisionLine(p1, p2);
};

function SeparatingAxisCollisionPoint(i1, _x1, _y1)
{
    var p1 = getPoints(i1);
    var p2 = { "x": _x1, "y": _y1 };
    return sa_checkCollisionPoint(p1, p2);
};

function SeparatingAxisCollisionEllipse(i1, _x1, _y1, _x2, _y2)
{
    var p1 = getPoints(i1);
    var pcentre = { "x": (_x1 + _x2) * 0.5, "y": (_y1 + _y2) * 0.5 };
    var rx = Math.abs(_x1 - _x2) * 0.5;
    var ry = Math.abs(_y1 - _y2) * 0.5;
    return sa_checkCollisionEllipse(p1, pcentre, rx, ry);
};

function SeparatingAxisCollisionBox(i1, _x1, _y1, _x2, _y2)
{
    var p1 = getPoints(i1);
    var p2 = [];
    p2[0] = { "x": _x1, "y": _y1 };
    p2[1] = { "x": _x2, "y": _y1 };
    p2[2] = { "x": _x1, "y": _y2 };
    p2[3] = { "x": _x2, "y": _y2 };

    return sa_checkCollision(p1, p2);
};

// #############################################################################################
/// Function:<summary>
///				Returns whether there is a collision with an instance
///          </summary>
///
/// In:		 <param name="inst"></param>
///			 <param name="prec">indicates whether to use precise checking</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyInstance.prototype.Collision_Instance = function (_pInst, _prec) {

	// should really be done before here.....
	if (this != _pInst && !this.marked && !_pInst.marked)
	{
	    // Change code path if either instance is using a Spine animation
	    if (this.UseSkeletonCollision()) {
	    	return this.Collision_Skeleton(_pInst, _prec);
	    }
	    if (_pInst.UseSkeletonCollision()) {
	    	return _pInst.Collision_Skeleton(this, _prec);
	    }
	
	
	
		// First, if either box is dirty, recompute bounding box.
		if (this.bbox_dirty) this.Compute_BoundingBox();
		if (_pInst.bbox_dirty) _pInst.Compute_BoundingBox();

		var col_delta = 0.0; //To avoid floating point inaccuracies
		if (g_Collision_Compatibility_Mode)
		{
		    col_delta = 1.0; //or in compat mode to go back to how it was
		}
	
		// easy cases first
		var bbox1 = _pInst.bbox;
		var bbox2 = this.bbox;
		if (bbox1.left          >= (bbox2.right + col_delta))   return false;
		if ((bbox1.right + col_delta)   <= bbox2.left)          return false;
		if (bbox1.top           >= (bbox2.bottom + col_delta))  return false;
		if ((bbox1.bottom + col_delta)  <= bbox2.top)           return false;

		if (this.colcheck === yySprite_CollisionType.ROTATED_RECT || _pInst.colcheck === yySprite_CollisionType.ROTATED_RECT)
		{
			if (!SeparatingAxisCollision(this, _pInst))
			{
				return false;
			}
		}

	    // dealing with precise collision checking
		var pSpr1 = null;
		var pSpr2 = null;
		if (this.mask_index < 0) {
		    pSpr1 = g_pSpriteManager.Get(this.sprite_index);
		}
		else {
		    pSpr1 = g_pSpriteManager.Get(this.mask_index);
		}
		if ((pSpr1 == null) || (pSpr1.numb == 0)) return false;


		if (_pInst.mask_index < 0) {
		    pSpr2 = g_pSpriteManager.Get(_pInst.sprite_index);
		}
		else {
		    pSpr2 = g_pSpriteManager.Get(_pInst.mask_index);
		}
		if ((pSpr2 == null) || (pSpr2.numb == 0)) return false;

		if (!_prec || (this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT && _pInst.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT))
		{
		    if (!g_Collision_Compatibility_Mode)
		    {
		        var l = (yymax(bbox1.left, bbox2.left));


		        var t = (yymax(bbox1.top, bbox2.top));


		        var r = (yymin(bbox1.right, bbox2.right));
		        var b = (yymin(bbox1.bottom, bbox2.bottom));

		        if (Math.floor(l + 0.5) == Math.floor(r + 0.5))
                    return false;

		        if (Math.floor(t + 0.5) == Math.floor(b + 0.5))
                    return false;
		    }
		    return true;
		}
	    // NB: (x | 0) is equivalent to (int)n


		if (g_Collision_Compatibility_Mode)
		{
		    return pSpr1.OrigPreciseCollision(this.image_index | 0, this.bbox, Round(this.x), Round(this.y), 
                                          this.image_xscale, this.image_yscale,
                                          this.image_angle,
                                          pSpr2,
                                          _pInst.image_index | 0, _pInst.bbox, Round(_pInst.x), Round(_pInst.y),
                                          _pInst.image_xscale, _pInst.image_yscale,
                                          _pInst.image_angle);
		}
		else
		{
		    return pSpr1.PreciseCollision(this.image_index | 0, this.bbox, Round(this.x), Round(this.y), 
                                          this.image_xscale, this.image_yscale,
                                          this.image_angle,
                                          pSpr2,
                                          _pInst.image_index | 0, _pInst.bbox, Round(_pInst.x), Round(_pInst.y),
                                          _pInst.image_xscale, _pInst.image_yscale,
                                          _pInst.image_angle);
		}
	}
	return false;
};





// #############################################################################################
/// Function:<summary>
///          	Assigns a path to the instance to follow
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_speed"></param>
///			<param name="_scale"></param>
///			<param name="_orient"></param>
///			<param name="_absolute"></param>
///			<param name="_endact"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
yyInstance.prototype.Assign_Path = function (_ind, _speed, _scale, _orient, _absolute, _endact) {
	// First validate the path exists, and assign the index.
	this.path_index = -1;
	if (_ind < 0) return;
	var pPath = g_pPathManager.Paths[_ind]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return;
	if (pPath.length <= 0) return;
	if (_scale < 0) return;
	this.path_index = _ind;


	this.path_speed = _speed;
	if (this.path_speed >= 0)
	{
		this.path_position = 0;
	} else
	{
		this.path_position = 1;
	}


	this.path_positionprevious = this.path_position;
	this.path_scale = _scale;


	this.path_orientation = _orient;
	this.path_endaction = _endact;
	if (_absolute)
	{
		if (this.path_speed >= 0)
		{
			this.SetPosition(pPath.XPosition(0), pPath.YPosition(0));
		}
		else
		{
			this.SetPosition(pPath.XPosition(1), pPath.YPosition(1));
		}
	}


	this.path_xstart = this.x;
	this.path_ystart = this.y;
};


// #############################################################################################
/// Function:<summary>
///				Adapts the position due to the current path .
///          </summary>
///
/// Out:	 <returns>
///				Returns whether the } of the path was reached
///			 </returns>
// #############################################################################################
yyInstance.prototype.Adapt_Path = function () {
    var sp, xx, yy;


    // check whether the path exists
    if (this.path_index < 0) return false;
    
    // CH: user can still hand modify path position even when path speed is 0
    // if (this.path_speed == 0) return false;

    var pPath = g_pPathManager.Paths[this.path_index];
    if (!pPath) return;
    if (pPath.length <= 0) return;

    var atPathEnd = false;

    // get the new path position
    var orient = this.path_orientation * Math.PI / 180.0;

    var pNode = pPath.GetPosition(this.path_position);
    xx = pNode.x;
    yy = pNode.y;
    sp = pNode.speed;
    pNode = null;

    sp = sp / (100 * this.path_scale);
    this.path_position = this.path_position + this.path_speed * sp / pPath.length;

    // handle end actions if required
    var pNode0 = pPath.GetPosition(0);
    if ((this.path_position >= 1) || (this.path_position <= 0)) 
    {
        atPathEnd = (this.path_speed == 0) ? false : true;    // generate an event if 
        //atPathEnd = true;
        switch (this.path_endaction) {

            // stop moving  
            case 0:
                {
                    if (this.path_speed != 0) {
                        this.path_position = 1;
                        this.path_index = -1;
                    }
                    break;
                }

                // continue from start position
            case 1:
                {
                    if (this.path_position < 0) {
                        this.path_position++;
                    }
                    else {
                        this.path_position--;
                    }
                    break;
                }

                // continue from current position
            case 2:
                {
                    var pNode1 = pPath.GetPosition(1);
                    xx = pNode1.x - pNode0.x;
                    yy = pNode1.y - pNode0.y;
                    var xdif = this.path_scale * (xx * Math.cos(orient) + yy * Math.sin(orient));
                    var ydif = this.path_scale * (yy * Math.cos(orient) - xx * Math.sin(orient));

                    if (this.path_position < 0) {
                        this.path_xstart = this.path_xstart - xdif;
                        this.path_ystart = this.path_ystart - ydif;
                        this.path_position++;
                    }
                    else {
                        this.path_xstart = this.path_xstart + xdif;
                        this.path_ystart = this.path_ystart + ydif;
                        this.path_position--;
                    }
                    break;
                }

                // reverse
            case 3:
                {
                    if (this.path_position < 0) {
                        this.path_position = -this.path_position;
                        this.path_speed = Math.abs(this.path_speed);
                    }
                    else {
                        this.path_position = 2 - this.path_position;
                        this.path_speed = -Math.abs(this.path_speed);
                    }
                    break;
                }

                // stop moving
            default:
                {
                    this.path_position = 1;
                    this.path_index = -1;
                }

        }
    }


    // find the new position in the room
    pNode = pPath.GetPosition(this.path_position);
    xx = pNode.x - pNode0.x;           // relative
    yy = pNode.y - pNode0.y;

    var newx = this.path_xstart + this.path_scale * (xx * Math.cos(orient) + yy * Math.sin(orient));
    var newy = this.path_ystart + this.path_scale * (yy * Math.cos(orient) - xx * Math.sin(orient));

    // trick to set the direction
    this.hspeed = newx - this.x;
    this.vspeed = newy - this.y;

    // normal speed should not be used
    this.speed = 0;

    // Set the new position
    this.SetPosition(newx, newy);

    return atPathEnd;
};



// #############################################################################################
/// Function:<summary>
///             get the alarm timer for the given index
///          </summary>
// #############################################################################################
yyInstance.prototype.get_timer = function (_index) {
	var Result = -1;
    if ((_index >= 0) && (_index < MAXTIMER))
    {         		
	    Result = this.alarm[_index] ;
    }
    return Result;
};



// #############################################################################################
/// Function:<summary>
///             get the alarm timer for the given index
///          </summary>
// #############################################################################################
yyInstance.prototype.set_timer = function (_index, _val) {
	if ((_index>=0) && (_index<MAXTIMER))
	{ 
	    this.alarm[_index] = _val;
    }
};


// #############################################################################################
/// Function:<summary>
///             get the alarm timer for the given index
///          </summary>
// #############################################################################################
yyInstance.prototype.get_bbox = function () {

    if (this.bbox_dirty) {
        this.Compute_BoundingBox();
    }
    return this.bbox;
};


// #############################################################################################
/// Function:<summary>
///             Wrap the instance against the room width/height if moving
///          </summary>
// #############################################################################################
yyInstance.prototype.wrap = function(_hor, _vert)
{
    var w, h;
    
    // find the sprite size
    if (!sprite_exists(this.sprite_index))
    {
        w = h =0;
	}
    else
    {
        var pSpr = g_pSpriteManager.Get(this.sprite_index);
        w = pSpr.width * this.image_xscale;
        h = pSpr.height * this.image_yscale;
    }
    
    // do horizontal wrap
    if (_hor)
    {
        if ((this.hspeed < 0) && (this.x < 0)) {
            this.SetPosition(this.x + g_RunRoom.GetWidth() + w, this.y);
        }
        if ((this.hspeed > 0) && (this.x >= g_RunRoom.GetWidth())) {
            this.SetPosition(this.x - g_RunRoom.GetWidth() - w, this.y);
        }
    }
    // do vertical wrap
    if (_vert)
    {
        if ((this.vspeed < 0) && (this.y < 0)) {
            this.SetPosition(this.x, this.y + g_RunRoom.GetHeight() + h);
        }
        if ((this.vspeed > 0) && (this.y >= g_RunRoom.GetHeight())) {
            this.SetPosition(this.x, this.y - g_RunRoom.GetHeight() - h);
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
yyInstance.prototype.ApplyVisualOffset = function (_angle, _visualOffs) {

    var offs = {};
    if ((_visualOffs.x != 0.0) || (_visualOffs.y != 0.0)) {        
    
        var A = _angle;
		var cosA = Math.cos(A);
		var sinA = Math.sin(A);
		
		offs.x = ((_visualOffs.x * cosA) - (_visualOffs.y * sinA));
		offs.y = ((_visualOffs.y * cosA) + (_visualOffs.x * sinA));
    }
    else {
        offs.x =_visualOffs.x;
        offs.y =_visualOffs.y;
    }
    return offs;
};

// #############################################################################################
/// Function:<summary>
///             Transfer across physics data to properties the user can access
///          </summary>
// #############################################################################################
yyInstance.prototype.RefreshPhysicalProperties = function (_physicsBody) {
    
    var TargetSpeed =g_RunRoom.GetSpeed();
    if(g_isZeus)
        TargetSpeed = g_GameTimer.GetFPS();
        
    var metreToPixelScale = 1.0 / g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    
    var finalOffset = this.ApplyVisualOffset(_physicsBody.GetAngle(), this.m_physicsObject.m_visualOffset);
        
    this.x = (_physicsBody.GetPosition().x * metreToPixelScale) + finalOffset.x;
	this.y = (_physicsBody.GetPosition().y * metreToPixelScale) + finalOffset.y;
	this.image_angle = (-_physicsBody.GetAngle() * 180.0) / Pi;
	this.bbox_dirty = true;
	
	this.__phy_rotation = (_physicsBody.GetAngle() * 180.0) / Math.PI;
	this.__phy_position_x = this.x - finalOffset.x;
	this.__phy_position_y = this.y - finalOffset.y;
    this.__phy_angular_velocity = (_physicsBody.GetAngularVelocity() * 180.0) / Math.PI;
    this.__phy_linear_velocity_x = _physicsBody.GetLinearVelocity().x * metreToPixelScale;     // pixels per sec
    this.__phy_linear_velocity_y = _physicsBody.GetLinearVelocity().y * metreToPixelScale;     // pixels per sec
    this.__phy_speed_x = this.phy_linear_velocity_x / TargetSpeed;                  // pixels per step
    this.__phy_speed_y = this.phy_linear_velocity_y / TargetSpeed;                  // pixels per step
    this.__phy_bullet = _physicsBody.IsBullet();
    this.phy_mass = _physicsBody.GetMass();
    this.phy_inertia = _physicsBody.GetInertia();
    this.phy_com_x = _physicsBody.GetWorldCenter().x * metreToPixelScale;
    this.phy_com_y = _physicsBody.GetWorldCenter().y * metreToPixelScale;
    this.phy_dynamic = (_physicsBody.m_type === yyBox2D.Body.b2_dynamicBody);
    this.phy_kinematic = (_physicsBody.m_type === yyBox2D.Body.b2_kinematicBody);
    this.phy_sleeping = !_physicsBody.IsAwake();
    this.__phy_fixed_rotation = _physicsBody.IsFixedRotation();
    this.__phy_active = _physicsBody.IsActive();    
    this.__phy_speed = Math.sqrt((this.phy_speed_x * this.phy_speed_x) + (this.phy_speed_y * this.phy_speed_y));
    this.__phy_angular_damping = _physicsBody.GetAngularDamping();
    this.__phy_linear_damping = _physicsBody.GetLinearDamping();
    
    // Account for the first run through
    if (this.phy_position_xprevious === undefined) {
        this.phy_position_xprevious = _physicsBody.GetPosition().x * metreToPixelScale;
    }
    if (this.phy_position_yprevious === undefined) { 
        this.phy_position_yprevious = _physicsBody.GetPosition().y * metreToPixelScale;
    }
};


//     this.m_physicsObject.SetRotation(_rotation);
//     this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
// };


//     this.m_physicsObject.SetAngularVelocity(_angular_velocity);
//     this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
// };

// #############################################################################################
/// Function:<summary>
///             Set the x position of the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_position_x = function(_pos) {

    this.m_physicsObject.SetPositionX(yyGetReal(_pos) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set the y position of the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_position_y = function(_pos) {

    this.m_physicsObject.SetPositionY(yyGetReal(_pos) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set the linear velocity for the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_linear_velocity_x = function(_vel) {

    this.m_physicsObject.SetLinearVelocityX(yyGetReal(_vel) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set the linear velocity for the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_linear_velocity_y = function(_vel) {

    this.m_physicsObject.SetLinearVelocityY(yyGetReal(_vel) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set the x speed in pixels per step of the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_speed_x = function(_speed) {
    
    var TargetSpeed = g_RunRoom.GetSpeed();
    if(g_isZeus)
        TargetSpeed = g_GameTimer.GetFPS();

    this.m_physicsObject.SetLinearVelocityX(yyGetReal(_speed) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale * TargetSpeed);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set the y speed in pixels per step of the underlying physics object
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_speed_y = function(_speed) {

   
    var TargetSpeed = g_RunRoom.GetSpeed();
    if(g_isZeus)
        TargetSpeed = g_GameTimer.GetFPS();
    this.m_physicsObject.SetLinearVelocityY(yyGetReal(_speed) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale * TargetSpeed);
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set angular damping value
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_angular_damping = function (_damping) {

    this.m_physicsObject.m_physicsBody.SetAngularDamping(yyGetReal(_damping));
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set linear damping value
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_linear_damping = function (_damping) {

    this.m_physicsObject.m_physicsBody.SetLinearDamping(yyGetReal(_damping));
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set whether or not the underlying physics object is a bullet
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_bullet = function(_isBullet) {

    this.m_physicsObject.SetBullet(yyGetBool(_isBullet));
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set whether or not the underlying physics object has fixed rotation
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_fixed_rotation = function(_isFixed) {

    this.m_physicsObject.SetFixedRotation(yyGetBool(_isFixed));
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///             Set whether or not the underlying physics object is active
///          </summary>
// #############################################################################################
yyInstance.prototype.set_physics_active = function(_isActive) {

    this.m_physicsObject.SetActive(yyGetBool(_isActive));
    this.RefreshPhysicalProperties(this.m_physicsObject.m_physicsBody);
};



// #############################################################################################
/// Function:<summary>
///             Access routine for the skeleton animation...
///             also sets up the animation from the Instance's sprite if not already done so
///          </summary>
// #############################################################################################
yyInstance.prototype.SkeletonAnimation = function () {

    if (sprite_exists(this.sprite_index)) {
    	
		var spr = g_pSpriteManager.Get(this.sprite_index);
		if (spr.m_skeletonSprite)
		{
			if (!this.m_pSkeletonAnimation)
			{				
				this.m_pSkeletonAnimation = new yySkeletonInstance(spr.m_skeletonSprite);
			}
		}
	}
	return this.m_pSkeletonAnimation;
};

yyInstance.prototype.MaskCollisionSkeleton = function()
{
	var mask_sprite = null;
	var use_mask_skeleton = false;

	if (this.mask_index >= 0)
	{
		mask_sprite = g_pSpriteManager.Sprites[this.mask_index];
		use_mask_skeleton = mask_sprite.colcheck == yySprite_CollisionType.SPINE_MESH;
	}

	if (this.m_pMaskSkeleton !== null && (!use_mask_skeleton || this.m_pMaskSkeleton.m_skeletonData != mask_sprite.m_skeletonData))
	{
		/* We shouldn't be using a collision mesh from our mask_index, or we should be, but from a
		 * DIFFERENT sprite.
		*/

		this.m_pMaskSkeleton = null;
        this.bbox_dirty = true;
	}

	if (use_mask_skeleton && this.m_pMaskSkeleton === null)
	{
		this.m_pMaskSkeleton = new yySkeletonInstance(mask_sprite.m_skeletonSprite);
		this.bbox_dirty = true;
	}

	return this.m_pMaskSkeleton;
};

yyInstance.prototype.GetCollisionSkeleton = function()
{
	var skel = null;

	if (this.mask_index >= 0)
	{
		skel = this.MaskCollisionSkeleton();
	}
	else{
		skel = this.SkeletonAnimation();

		if(skel !== null)
		{
			var sprite = g_pSpriteManager.Sprites[this.sprite_index];

			if(sprite.colcheck !== yySprite_CollisionType.SPINE_MESH)
			{
				/* Our sprite_index is a Spine sprite, but not using a collision mesh. */
				skel = null;
			}
		}
	}

	return skel;
};

yyInstance.prototype.CollisionImageIndex = function()
{
	if (this.mask_index >= 0 && g_pSpriteManager.Sprites[this.mask_index].colcheck === yySprite_CollisionType.SPINE_MESH)
	{
		return 0.0;
	}
	else{
		return this.image_index;
	}
};

yyInstance.prototype.UseSkeletonCollision = function()
{
	if (this.mask_index < 0)
	{
		return this.SkeletonAnimation()
			&& g_pSpriteManager.Sprites[this.sprite_index].colcheck === yySprite_CollisionType.SPINE_MESH;
	}
	else{
		return g_pSpriteManager.Sprites[this.mask_index].colcheck === yySprite_CollisionType.SPINE_MESH
	}
};

yyInstance.prototype.GetLayerID=function()	{ return this.m_nLayerID; };
yyInstance.prototype.SetLayerID=function(_layerID)	{ this.m_nLayerID = _layerID; };
yyInstance.prototype.GetOnActiveLayer=function() { return this.m_bOnActiveLayer; };
yyInstance.prototype.SetOnActiveLayer=function( _onLayer)	{ this.m_bOnActiveLayer = _onLayer; };


// #############################################################################################
/// Function:<summary>
///             Holds and manages all instances
///          </summary>
// #############################################################################################
/**@constructor*/
function yyInstanceManager() 
{
	this.m_Instances = new yyList();
	this.m_Instances.packing = true;
	this.m_ID2Instance = [];
}

// #############################################################################################
/// Function:<summary>
///          	Clear out all instances.
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.Clear = function () {
	this.m_ID2Instance = [];
	this.m_Instances.Clear();
};



// #############################################################################################
/// Function:<summary>
///          	Get the array of instances
///          </summary>
///
/// Out:	<returns>
///				The instance array
///			</returns>
// #############################################################################################
yyInstanceManager.prototype.GetPool = function () {
	return this.m_Instances.pool;
};


// #############################################################################################
/// Function:<summary>
///             Holds and manages all instances
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.Add = function (pInst) {
	this.m_ID2Instance[pInst.id] = pInst;
	this.m_Instances.Add(pInst);
};


// #############################################################################################
/// Function:<summary>
///          	Using the ID, lookup an instance. 
///             Instance ONLY, not object.
///          </summary>
///
/// In:		<param name="_id">Instance ID</param>
/// Out:	<returns>
///				The instance or null
///			</returns>
// #############################################################################################
yyInstanceManager.prototype.IDLookup = function (_id) {
	return this.m_ID2Instance[_id];
};

// #############################################################################################
/// Function:<summary>
///             Get an instance using its ID
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.Get = function (_id) {
	//var pInst = this.m_ID2Instance["i"+_id];
	var pInst = this.m_ID2Instance[_id];
	if (pInst!=undefined && pInst != null) return pInst;

	var pObj = g_pObjectManager.Get(_id);
	if (pObj != undefined && pObj != null)
	{
		// Find first instance that is NOT marked for deletion
		var foundValidInstance = false;
		for(var i = 0; i < pObj.Instances_Recursive.pool.length; i++)
		{
			pInst = pObj.Instances_Recursive.pool[i];
			if(!pInst.marked)
			{
				foundValidInstance = true;
				break;
			}
		}

		if(!foundValidInstance)
		{
			yyError("Unable to find any instance for object index \'" + _id + "\' name \'" + pObj.Name +"\'")
		}
		else
		{
			if (pInst != undefined && pInst != null) return pInst;
		}
	}

	return null;
};

// #############################################################################################
/// Function:<summary>
///             Find an instance using its ID. Will only search the instances list and not the object manager.
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.FindInstance = function (_id) {
	if(_id >= 0)
	{
		var pInst = this.m_ID2Instance[_id];
		if (pInst != undefined && pInst != null) return pInst;
	}
    return null;
};

// #############################################################################################
/// Function:<summary>
///             Holds and manages all instances
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.Remove = function (_pInst) {
	this.m_Instances.DeleteItem(_pInst);
	var id = _pInst.id;
	this.m_ID2Instance[id] = null;               // just nuke the variable, don't "delete" it.

	/*for(var index in m_ID2Instance)
	{
	if( m_ID2Instance[index] === _pInst ){
	m_ID2Instance.splice( index,1 );
	return;
	}
	}*/
	//m_ID2Instance.splice( _pInst.id,1 );
	//m_ID2Instance[pInst.id] = null;
};



// #############################################################################################
/// Function:<summary>
///             Copy the current positions, into the LAST positions - for ALL instances.
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.RememberOldPositions = function () {
	var pool = g_RunRoom.m_Active.pool;
	var room = g_pLayerManager.GetTargetRoomObj();
	
	for (var index = 0; index < pool.length; index++)
	{
		var pInst = pool[index];
		pInst.xprevious = pInst.x;
		pInst.yprevious = pInst.y;
		pInst.path_positionprevious = pInst.path_position;
		
		pInst.Animate();
		
	}
};



// #############################################################################################
/// Function:<summary>
///             Copy the current positions, into the LAST positions - for ALL instances.
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.UpdatePositions = function() {
    var pool = g_RunRoom.m_Active.pool;
    for (var index = 0; index < pool.length; index++) {
        var pInst = pool[index];

        pInst.AdaptSpeed();
        if (pInst.Adapt_Path()) {
            pInst.PerformEvent(EVENT_OTHER_ENDOFPATH, 0, pInst, pInst);
        }
        if (pInst.hspeed !== 0 || pInst.vspeed !== 0) {
            pInst.x += pInst.hspeed;
            pInst.y += pInst.vspeed;
            pInst.bbox_dirty = true;
        }
    }
};

function SetNewSequencePosition(pInst, sprite, newpos, jump_to_pos)
{
    var fps = g_GameTimer.GetFPS();

    var seqSpeed = sprite.sequence.m_playbackSpeed;
    if (sprite.sequence.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond) seqSpeed /= fps;

    pInst.last_sequence_pos = pInst.sequence_pos;
    pInst.sequence_pos = newpos;

    var tmp = { headPosition: pInst.sequence_pos, headDirection: pInst.sequence_dir, finished: false };
    var hasWrapped = HandleSequenceWrapping(sprite.sequence, tmp);
    pInst.sequence_pos = tmp.headPosition;
    pInst.sequence_dir = tmp.headDirection;				

    // Figure out which keyframe we're on
    // There should only be one track and it should be a sprite frames track
    if ((sprite.sequence.m_tracks != null) && (sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames))
    {
        var pTrack = sprite.sequence.m_tracks[0];
		/*
        var pKey = pTrack.m_keyframeStore.GetKeyframeAtFrame(pInst.sequence_pos, sprite.sequence.m_length);
        if (pKey == null)
        {
            pInst.SetImageIndex(-1);		// no key at this time
        }
        else if(pTrack.m_numTracks > 0)
        {
            pInst.SetImageIndex(pTrack.m_tracks[0].getValue(0, pInst.sequence_pos, sprite.sequence.m_length));
        }
        else if (hasWrapped)
        {
            // Fallback - wrap at sequence length.
            pInst.SetImageIndex(pInst.sequence_pos);
        }
		*/
		if(pTrack != null)
		{
			pInst.SetImageIndex(pTrack.getValue(pInst.sequence_pos));
		}

        if(!jump_to_pos)
        {
            var layer = g_pLayerManager.GetLayerFromID(g_RunRoom, pInst.layer);

            var elementId = -1;
            for (var elementIndex = 0; elementIndex < layer.m_elements.pool.length; ++elementIndex)
            {
                var pEl = layer.m_elements.pool[elementIndex];
                if (pEl !== null && pEl !== undefined && pEl.m_instanceID == pInst.id)
                {
                    elementId = pEl.m_id;
                    break;
                }
            }

            if (elementId !== -1)
            {
                HandleSpriteMessageEvents(sprite.sequence, elementId, fps, seqSpeed, pInst.sequence_dir, pInst.last_sequence_pos, pInst.sequence_pos);
            }
        }
    }

    if (hasWrapped)
    {
        pInst.PerformEvent(EVENT_OTHER_ANIMATIONEND, 0, pInst, pInst);
    }
}


function ConvertImageIndexToSequencePos(pInst, sprite, image_index)
{
    if(sprite.sequence != null)
    {
        if ((sprite.sequence.m_tracks != null) && (sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames))
        {
            var pTrack = sprite.sequence.m_tracks[0];

            var numkeyframes = pTrack.m_keyframeStore.numKeyframes;

            var pKey = pTrack.m_keyframeStore.GetKeyframeAtFrame(pInst.sequence_pos, sprite.sequence.m_length);
            if(pKey != null)
            {
                var endkeyframe = pTrack.m_keyframeStore.keyframes[numkeyframes - 1].m_key + pTrack.m_keyframeStore.keyframes[numkeyframes - 1].m_length;
                    
                    
                var numimageframes = pInst.image_number;

                var imgpos = image_index / numimageframes;

                var fracimgpos = imgpos - Math.floor(imgpos);
                if (fracimgpos < 0)
                {
                    imgpos -= 1.0;
                    fracimgpos += 1.0;
                }

                var retval = Math.floor(imgpos) * endkeyframe;

                var keyindex = Math.floor(fracimgpos * numkeyframes);
                var keyfracpos = (fracimgpos * numkeyframes) - keyindex;
                    
                //         CLAMP(keyindex, 0, numkeyframes - 1);
                keyindex = Math.max(0, Math.min(numkeyframes - 1, keyindex));
                retval += pTrack.m_keyframeStore.keyframes[keyindex].m_key + (keyfracpos * pTrack.m_keyframeStore.keyframes[keyindex].m_length);

                return retval;
            }
        }
    }

    return image_index;
}

// #############################################################################################
/// Function:<summary>
///             Copy the current positions, into the LAST positions - for ALL instances.
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.UpdateImages = function () {

	var pool = g_RunRoom.m_Active.pool;
	for (var index = 0; index < pool.length; index++)
	{
		var pInst = pool[index];
		
		if (pInst.marked) continue;
        if (!pInst.active) continue;

		var sprite = g_pSpriteManager.Get(pInst.sprite_index);
		
		var usesSpriteSequences = false;

	    if (sprite != null)
	    {
	        if(sprite.sequence != null)
	        {
				/*
	            var sequence_image_index = pInst.sequence_pos;
	            if ((sprite.sequence.m_tracks != null) && (sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames))
                {
	                var pTrack = sprite.sequence.m_tracks[0];
                    var pKey = pTrack.m_keyframeStore.GetKeyframeAtFrame(pInst.sequence_pos, sprite.sequence.m_length);
                    if (pKey == null)
                    {
                        pInst.SetImageIndex(-1);		// no key at this time
                    }
                    else if(pTrack.m_numTracks > 0)
                    {
                        sequence_image_index = pTrack.m_tracks[0].getValue(0, pInst.sequence_pos, sprite.sequence.m_length);
                       
                        if (Math.abs(pInst.image_index - sequence_image_index) > g_GMLMathEpsilon)
                        {
                            var newseqpos = ConvertImageIndexToSequencePos(pInst, sprite, pInst.image_index);
                            SetNewSequencePosition(pInst, sprite, newseqpos, true);
                        }
                    }
                }
				*/
				var sequence_image_index = pInst.sequence_pos;
				if ((sprite.sequence.m_tracks != null) && (sprite.sequence.m_tracks[0].m_type == eSTT_SpriteFrames))
			   	{
				   var pTrack = sprite.sequence.m_tracks[0];
				   if (pTrack != null)
				   {
					   sequence_image_index = pTrack.getValue(pInst.sequence_pos);
	   
					   if (Math.abs(pInst.image_index - sequence_image_index)>g_GMLMathEpsilon)
					   {
						   var numkeyframes = pTrack.m_keyframeStore.numKeyframes;
						   if (numkeyframes > 0) { 
							   var keyindex = ~~(pInst.image_index);
							   var fracval = pInst.image_index - keyindex;

							   var newseqpos = pInst.image_index;
							   if (keyindex >= numkeyframes)
							   {
								   newseqpos = pTrack.m_keyframeStore.keyframes[numkeyframes - 1].m_key + (pInst.image_index - (numkeyframes - 1));
							   }
							   else if (keyindex < 0)
							   {
								   newseqpos = pInst.image_index;
							   }
							   else
								   newseqpos = (pTrack.m_keyframeStore.keyframes[keyindex].m_key + (fracval * pTrack.m_keyframeStore.keyframes[keyindex].m_length));

							   newseqpos = ConvertImageIndexToSequencePos(pInst, sprite, pInst.image_index);
							   SetNewSequencePosition(pInst, sprite, newseqpos, true);
						   } // end if
					   }

				   }
				}

				usesSpriteSequences = true;

	            var fps = g_GameTimer.GetFPS();

	            // Get sequence length
	            var length = sprite.sequence.m_length;
				
	            var seqSpeed = sprite.sequence.m_playbackSpeed;
	            if (sprite.sequence.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond) seqSpeed /= fps;

	            SetNewSequencePosition(pInst, sprite, (pInst.sequence_pos + (pInst.sequence_dir * pInst.image_speed * seqSpeed)), false);
	        }
		}
		
		if(!usesSpriteSequences)
	    {
	        var num = pInst.GetImageNumber();
	        if (pInst.image_index >= num) {
	            pInst.image_index -= num;

	            // if this instance acts on this event, then process it....
	            var pObject = pInst.pObject;
	            if (pObject.REvent[EVENT_OTHER_ANIMATIONEND]) {
	                pInst.PerformEvent(EVENT_OTHER_ANIMATIONEND, 0, pInst, pInst);
	            }
	        }
	        else if (pInst.image_index < 0) {
	            pInst.image_index += num;

	            // if this instance acts on this event, then process it....
	            var pObject = pInst.pObject;
	            if (pObject.REvent[EVENT_OTHER_ANIMATIONEND]) {
	                pInst.PerformEvent(EVENT_OTHER_ANIMATIONEND, 0, pInst, pInst);
	            }
	        }
	    }
	}
};



// #############################################################################################
/// Function:<summary>
///             Perform a specific event for ALL active instances
///          </summary>
// #############################################################################################
yyInstanceManager.prototype.PerformEvent = function (_event, _index) {

	var done = true;
	if (g_RunRoom)
	{
		var evnt = _event;
		if (evnt != EVENT_COLLISION) evnt |= _index;

		var count = g_currentCreateCounter++;
		var pool = g_RunRoom.m_Active.pool;	
		for (var index = pool.length - 1; index >= 0; index--)
		{
			var pInst = pool[index];
			if (pInst!==undefined && !pInst.marked && (pInst.createCounter <= count))
			{
			    var pObject = pInst.pObject;

		        //BETA
		        //if( index==0 && evnt == EVENT_STEP_END) ProcessBetaMessage();

			    // if this instance acts on this event, then process it....
			    if (pObject.REvent[evnt])
			    {
			    	done = pInst.PerformEvent(_event, _index, pInst, pInst);
			    }
			}
		}
	}
	return done;
};



// #############################################################################################
/// Function:<summary>
///          	GML access to instance manager.
///          </summary>
///
/// In:		<param name="_id">ID of instance or object</param>
/// Out:	<returns>
///				the first instance of an object, or instance pointed to by the id
///			</returns>
// #############################################################################################
var yyInst = yyInst_DEBUG;
function yyInst_RELEASE(_inst, _other, _id) {
	if (_id instanceof YYRef) {
		_id = yyGetInt32(_id);
	} else {
		if (typeof _id === "object" || typeof _id === "function" ) return _id;
	}
    if (_id == -1) return _inst;
    if (_id == -2) return _other;
    if (_id == -3) return _inst;
    var pInst = g_pInstanceManager.Get(_id);
	if( !pInst ) {
	    pInst = g_pObjectManager.Get(_id);
	    if( pInst ) pInst = pInst.Instances.Get(0);
    }
	return pInst;
}

function yyInst_DEBUG(_inst, _other, _id) {
	if (_id instanceof YYRef) {
		_id = yyGetInt32(_id);
	} else {
		if (typeof _id === "object" || typeof _id === "function" ) return _id;
	}
    if (_id == -1) return _inst;
    if (_id == -2) return _other;
    if (_id == -3) return _inst;
    var pInst = g_pInstanceManager.Get(_id);
	if( !pInst ) {

	    pInst = g_pObjectManager.Get(_id);
	    if( !pInst ) {
	        ErrorOnce("Unknown instance ID: "+_id);
	        debug(stacktrace());
	        return undefined;
	    }
	    pInst = pInst.Instances.Get(0);
    }
	return pInst;
}

// #############################################################################################
/// Function:<summary>
///             Destroy an instance
///          </summary>
// #############################################################################################
function Command_Destroy(_pInst)
{
	if(_pInst.isBeingDestroyed === undefined || _pInst.isBeingDestroyed === false)
	{
		_pInst.isBeingDestroyed = true;
		_pInst.PerformEvent( EVENT_DESTROY, 0, _pInst, _pInst );
    	_pInst.PerformEvent( EVENT_CLEAN_UP, 0, _pInst, _pInst );
    	_pInst.marked = true;
	}
}

// #############################################################################################
/// Function:<summary>
///             Create and add a new instance at the given depth
///          </summary>
// #############################################################################################
function Command_Create_Depth(_objind, _x, _y, _depth, _pCreatedBySequenceInst)
{
    var inst = g_RunRoom.GML_AddInstanceDepth(_x, _y, _depth, _objind);

    if(inst != null)
    {
		if (_pCreatedBySequenceInst != undefined)
		{
			inst.SetInSequence(true);
			inst.SetControlledBySequence(true);
			inst.SetOwnedBySequence(true);
			inst.SetControllingSeqInst(_pCreatedBySequenceInst);
		}
				
        inst.PerformEvent(EVENT_PRE_CREATE, 0, inst, inst);
        inst.PerformEvent(EVENT_CREATE, 0, inst, inst);
	    return inst;
    }

	return null;
}

// #############################################################################################
/// Function:<summary>
///             Create and add a new instance on the given layer
///          </summary>
// #############################################################################################
function Command_Create_Layer(_objind, _x, _y, _layerid, _pCreatedBySequenceInst)
{
    var layer = g_pLayerManager.GetLayerFromID(g_RunRoom, _layerid);
        
    if (layer != null)
    {
        var pInst = g_RunRoom.GML_AddLayerInstance(_x, _y, layer, _objind);

		if (!pInst != null)
		{
			if (_pCreatedBySequenceInst != undefined)
			{
				pInst.SetInSequence(true);
				pInst.SetControlledBySequence(true);
				pInst.SetOwnedBySequence(true);
				pInst.SetControllingSeqInst(_pCreatedBySequenceInst);
			}

			pInst.PerformEvent(EVENT_PRE_CREATE, 0, pInst, pInst);
			pInst.PerformEvent(EVENT_CREATE, 0, pInst, pInst);
			return pInst;
		}
    }

	return null;
}

// #############################################################################################
/// Function:<summary>
///             Returns the depth of the instance if the given value is an instance
///				otherwise returns the last drawn depth value
///          </summary>
// #############################################################################################
function GetInstanceDepth(_inst)
{
	if (_inst instanceof yyInstance)
	{
		return _inst.depth;
	}

	return GR_Depth;
}
