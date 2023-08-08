
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Instance.js
// Created:			31/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 31/05/2011		
// 
// **********************************************************************************************************************



// #############################################################################################
/// Function:<summary>
///          	Returns the id of the (n+1)'th instance of type obj. obj can be an object or 
///             the keyword all. If it does not exist, the special object noone is returned. 
///             Note that the assignment of the instances to the instance id's changes every 
///             step so you cannot use values from previous steps.
///          </summary>
///
/// In:		<param name="_obj"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_find(_obj,_n) 
{
    _n = yyGetInt32(_n);

    var pInstArray = GetWithArray(yyGetInt32(_obj));
    if( pInstArray==null ) return OBJECT_NOONE;
    if( _n>=pInstArray.length ) return OBJECT_NOONE;
    
    var inst = pInstArray[_n];

    if((inst.active) && (!inst.marked))
        return inst.id;

    return OBJECT_NOONE;
}

function instance_id_get(_inst, _index) {
	return g_RunRoom.m_Active.Get(yyGetInt32(_index)).id;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether an instance of type obj exists. obj can be an object, an 
///             instance id, or the keyword all.
///          </summary>
///
/// In:		<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_exists(_obj) 
{
    var pObj = GetWithArray(yyGetInt32(_obj));
    if (pObj != null && pObj.length > 0)
    {    	
    	for (var inst = 0; inst < pObj.length; inst++)
    	{
			var pInst = pObj[inst];			
			if (!pInst.marked && pInst.active) return true;
    	}
    }
    return false;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the number of instances of type obj. obj can be an object or the keyword all.
///          </summary>
///
/// In:		<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_number(_obj) 
{
    var pInstArray = GetWithArray(yyGetInt32(_obj));
    if( pInstArray==null ) return 0;
    
    var count = 0;
    for (var i = 0; i < pInstArray.length; i++) {
        if ((pInstArray[i].active) && (!pInstArray[i].marked))
            count++;
    }
    
	return count;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the id of the instance of type obj at position (x,y). When multiple 
///             instances are at that position the first is returned. obj can be an object or 
///             the keyword all. If it does not exist, the special object noone is returned.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_position(_x,_y,_obj) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    return Instance_SearchLoop( null, yyGetInt32(_obj), false,OBJECT_NOONE,    _x,_y,  
        function(_pInstance)
        {
            if( _pInstance.Collision_Point(_x,_y,true) ) 
                return _pInstance.id; 
            else 
                return OBJECT_NOONE;
        }
    );
}
function instance_position_list(_x, _y, _obj, _list, _ordered)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

	var list = g_ListCollection.Get(yyGetInt32(_list));
	if (!list) {
		yyError("Error: invalid ds_list ID (instance_position_list)");
		return 0;
	}
	var found = 0;
	var sort = yyGetBool(_ordered);
	var arr = [];

	Instance_SearchLoop( null, yyGetInt32(_obj), false,OBJECT_NOONE, _x, _y,  
		function(_pInstance) {
			if (_pInstance.Collision_Point(_x,_y,true)) {
			    if (sort)
			        arr[found] = _pInstance;
                else
			        list.Add(_pInstance.id);
				found += 1;
			} 
			return OBJECT_NOONE;
		}
	);

	if (sort)
	    AppendCollisionResults(arr, list, _x, _y);

	return found;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the id of the instance of type obj nearest to (x,y). obj can be an 
///             object or the keyword all.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_nearest(_inst,_x,_y,_obj) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    var dist = 10000000000;
    var i = OBJECT_NOONE;
    var object_id = Instance_SearchLoop2( null, yyGetInt32(_obj), false,OBJECT_NOONE,    _x,_y,  
        function(_pInstance)
        {
            var xx = _x-_pInstance.x;
            var yy = _y-_pInstance.y;
                
            var d = Math.sqrt(xx*xx + yy*yy);
            if( d<dist){
            	i = _pInstance.id;
            	dist = d;
            }
        }
    );
	return i;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the id of the instance of type obj furthest away from (x,y). 
///             obj can be an object or the keyword all.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_furthest( _inst, _x,_y,_obj ) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    var dist = -10000000000;
    var i = OBJECT_NOONE;
    var object_id = Instance_SearchLoop2( null, yyGetInt32(_obj), false,OBJECT_NOONE,    _x,_y,  
        function(_pInstance)
        {
            var xx = _x-_pInstance.x;
            var yy = _y-_pInstance.y;
                
            var d = Math.sqrt(xx*xx + yy*yy);
            if( d>dist){
                i = _pInstance.id;
                dist = d;
            }
        }
    );
	return i;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the id of the instance of type obj met when the current instance is 
///             placed at position (x,y). obj can be an object or the keyword all. 
///             If it does not exist, the special object noone is returned.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_place( _pInst, _x,_y,_obj) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    var xx = _pInst.x;
    var yy = _pInst.y;
    _pInst.SetPosition(_x,_y);

    var id = Instance_SearchLoop(null, yyGetInt32(_obj), false, OBJECT_NOONE, _x, _y,
        function (_pInstance) {
            if (_pInstance.Collision_Instance(_pInst, true))
            {
            	return _pInstance.id;
            }
            else
            {
            	return OBJECT_NOONE;
            }
        }
    );
    _pInst.SetPosition(xx,yy);
    return id;
}
function instance_place_list(_pInst, _x, _y, _obj, _list, _ordered)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

	var list = g_ListCollection.Get(yyGetInt32(_list));
	if (!list) {
	    yyError("Error: invalid ds_list ID (instance_place_list)");
		return 0;
	}
	var xx = _pInst.x;
	var yy = _pInst.y;
	_pInst.SetPosition(_x,_y);
	var found = 0;
	var sort = yyGetBool(_ordered);
	var arr = [];

	Instance_SearchLoop(null, yyGetInt32(_obj), false, OBJECT_NOONE, _x, _y,
		function (_pInstance) {
			if (_pInstance.Collision_Instance(_pInst, true)) {
			    if (sort)
			        arr[found] = _pInstance;
                else
                    list.Add(_pInstance.id);
                
				found += 1;
			}
			return OBJECT_NOONE;
		}
	);
	_pInst.SetPosition(xx, yy);

    //Fritz: Looks like the C++ runner no longer appends the calling instance, so removing this here
	// LB: YYC/VM also include the searching instance if "all" is used as the object type, even though
	// its technically only there because we moved it there for the check. Add 1 to the found value match.
//	if (_obj == OBJECT_ALL) {
//		list.Add(_pInst.id);
//		found++;
//	}

	if (sort)
	    AppendCollisionResults(arr, list, _x, _y);

	return found;
}

function DoDestroy(_pInst, _executeEvent)
{
	if (!_pInst.marked && _pInst.active) {
		if ((_executeEvent === undefined) || (_executeEvent)) {
			Command_Destroy(_pInst);
		}
		else {
			_pInst.PerformEvent( EVENT_CLEAN_UP,0, _pInst, _pInst );
			_pInst.marked = true;
		}
	}
}

// #############################################################################################
/// Function:<summary>
///             Destroy an instance - or rather, mark for deletion later...
///          </summary>
///
/// In:     <param name="_pInst">"this"</param>
///         <param name="_pOther">"other"</param>
///				
// #############################################################################################
function instance_destroy( _pInst, _id,  _executeEvent )
{
    _executeEvent = _executeEvent !== undefined ? yyGetBool(_executeEvent) : true;

	if (_id === undefined) {
		DoDestroy(_pInst, _executeEvent);	
	} // end if
	else {
	    var pObj = GetWithArray(yyGetInt32(_id));
	    if (pObj != null && pObj.length > 0)
	    {    	
	    	for (var inst = 0; inst < pObj.length; inst++)
	    	{
				var pInst = pObj[inst];
				DoDestroy(pInst, _executeEvent);	
	    	} // end for
	    } // end if
	} // end else
}



// #############################################################################################
/// Function:<summary>
///          	Destroys all instances whose sprite contains position (x,y).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function position_destroy(_inst, _x, _y) 
{
	// make a list of things we want to delete,
	var pool = g_RunRoom.m_Active.pool;
	var found = [];
	for (var i = 0; i < pool.length; i++) {
		var pInst = pool[i];
		if (pInst.Collision_Point(yyGetReal(_x), yyGetReal(_y), true)) {
			found.push(pInst);
		}
	}
	// and then delete them:
	for (var i = 0; i < found.length; i++) {
		instance_destroy(found[i]);
	}
}

// #############################################################################################
/// Function:<summary>
///          	Changes all instances at (x,y) into obj. perf indicates whether to perform 
///             the destroy and creation events.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
///			<param name="_perf"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function position_change(_inst, _x, _y, _objindex, _perf) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

	var bottom, top;
	var keep = [];
	var pActiveList = g_RunRoom.m_Active;
	
	for (var i = 0; i < pActiveList.pool.length; i++)
	{
		var pInst = pActiveList.pool[i];
		if (pInst.bbox_dirty) pInst.Compute_BoundingBox();

		var bbox = pInst.bbox;
		if (!((_x > bbox.right) || (_x < bbox.left) || (_y > bbox.bottom) || (_y < bbox.top)))
		{
			keep[keep.length] = pInst;
		}
	}

	// Now run through the list and delete them.
	var pActiveList = g_RunRoom.m_Active;
	for (var i = 0; i < keep.length; i++)
	{
		instance_change(keep[i], yyGetInt32(_objindex), _perf);
	} 
}


// #############################################################################################
/// Function:<summary>
///          	Sets the motion with the given speed in direction dir.
///          </summary>
///
/// In:		<param name="_dir"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function motion_set(_inst, _dir,_speed) 
{
  _inst.direction = yyGetReal(_dir);
  _inst.speed = yyGetReal(_speed);
}

// #############################################################################################
/// Function:<summary>
///          	Adds the motion to the current motion (as a vector addition).
///          </summary>
///
/// In:		<param name="_dir"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function motion_add(_inst, _dir, _speed) 
{
    _inst.AddTo_Speed(yyGetReal(_dir), yyGetReal(_speed));
}



// #############################################################################################
/// Function:<summary>
///          	Creates a copy of the current instance. The argument indicates whether the 
///             creation event must be executed for the copy. The function returns the id of 
///             the new copy.
///          </summary>
///
/// In:		<param name="_performevent"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function instance_copy(_inst, _performevent) 
{
	var pNewInst = new yyInstance(0, 0, g_room_maxid++, _inst.object_index, true);
	var storedId = pNewInst.id;	
	pNewInst.Assign(_inst, true);
	pNewInst.id = storedId;
	pNewInst.m_bOnActiveLayer = false;   //zeus-not added to layer yet

    var pInst = g_RunRoom.AddInstanceToRoom( pNewInst );
	if( yyGetBool(_performevent) ){
	    pNewInst.PerformEvent(EVENT_PRE_CREATE, 0, pNewInst, pNewInst );
	    pNewInst.PerformEvent(EVENT_CREATE, 0, pNewInst, pNewInst );
	}
	return pNewInst.id;
}


// #############################################################################################
/// Function:<summary>
///          	Changes the instance into obj. perf indicates whether to perform the 
///             destroy and creation events.
///          </summary>
///
/// In:		<param name="_inst">Instance to effect</param>
///    		<param name="_objindex">Object to change into</param>
///			<param name="_perf">Perform destroy and create events?</param>
///				
// #############################################################################################
function instance_change_RELEASE(_inst, _objindex, _perf) 
{
    _perf = yyGetBool(_perf);

	if( _perf ) {
		_inst.PerformEvent(EVENT_DESTROY, 0, _inst, _inst );	
		_inst.PerformEvent(EVENT_CLEAN_UP, 0, _inst, _inst);
	} // end if

	_inst.SetObjectIndex(yyGetInt32(_objindex), true, false);							// FLAG depth to go into the depth re-order list for re-sorting later.
	_inst.UpdateSpriteIndex(_inst.pObject.SpriteIndex);
	
	// Change over the physics body	if one exists/should exist
	// @if feature("physics")
	_inst.RebuildPhysicsBody(g_RunRoom);
	// @endif

	if( _perf ) {
		_inst.PerformEvent(EVENT_PRE_CREATE, 0, _inst, _inst );
		_inst.PerformEvent(EVENT_CREATE, 0, _inst, _inst );    
	} // end if
}

function instance_change_DEBUG(_inst, _objindex, _perf)
{
    _objindex = yyGetInt32(_objindex);

	if (!g_pObjectManager.Exists(_objindex)){
		debug("Error: Trying to change an instance to an nonexistent object type.");
		return;
	}
	instance_change_RELEASE(_inst, _objindex, yyGetBool(_perf));
}
var instance_change = instance_change_DEBUG; 

// #############################################################################################
/// Function:<summary>
///          	Deactivates all instances in the room. If notme is true the calling instance 
///				is not deactivated (which is normally what you want).
///          </summary>
///
/// In:		<param name="_inst">"this" instance</param>
///			<param name="_notme">TRUE if you don't want THIS instance to be deactivated as well</param>
///				
// #############################################################################################
function instance_deactivate_all(_inst, _notme) {

	var list = [];
	list = g_RunRoom.m_Active.pool; 			// Copy the whole array.
	g_RunRoom.m_Active.Clear();


	var pDeactiveList = g_RunRoom.m_Deactive;
	for (var i = 0; i < list.length; i++)
	{
		if (list[i] == _inst)
		{
			if (yyGetBool(_notme) == false)
			{
				g_RunRoom.DeactivateInstance(list[i]); // if we want to deactive "me" then do so...
			} else
			{
				g_RunRoom.m_Active.Add(list[i]);
			}
		} else
		{
			g_RunRoom.DeactivateInstance(list[i]); // deactive everything else.
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Activates all instances in the room.
///          </summary>
///
/// In:		<param name="_inst">"this" instance</param>
// #############################################################################################
function instance_activate_all(_inst) {

	var list = [];
	list = g_RunRoom.m_Deactive.pool; 			// Copy the whole array.
	g_RunRoom.m_Deactive.Clear();


	var pActiveList = g_RunRoom.m_Active;
	for (var i = 0; i < list.length; i++)
	{
		g_RunRoom.ActivateInstance(list[i]);
		//pActiveList.Add(list[i]); 					// Active everything!
		//list[i].active = true;
	}
}


// #############################################################################################
/// Function:<summary>
///          	Recursively checks to see if an object inherits from a given index
///          </summary>
// #############################################################################################
function object_has_parent(_obj, _parentIndex) {

    if (_obj.ParentID >= 0) {

        _parentIndex = yyGetInt32(_parentIndex);

        var parentObject = g_pObjectManager.Get(_obj.ParentID);
        if (parentObject) {
            if (parentObject.ID == _parentIndex) {
                return true;
            }
            else {
                return object_has_parent(parentObject, _parentIndex);
            }
        }
    }
    return false;
};

// #############################################################################################
/// Function:<summary>
///          	Activate all instances of a cetrtain object type in the room.
///          </summary>
///
/// In:		<param name="_inst">"this" instance</param>
///    		<param name="_objindex">"this" instance</param>
// #############################################################################################
function instance_activate_object(_inst, _objindex) 
{
    _objindex = yyGetInt32(_objindex);

	var i;
	var keep = [];
	var pDeactiveList = g_RunRoom.m_Deactive;

    if (_objindex == OBJECT_ALL) {	    
	    for (var i = 0; i < pDeactiveList.pool; i++) {
	        var pInst = pDeactiveList.pool[i];
            keep[keep.length] = pInst;
	    }
	} else {	    
	    for (var i = 0; i < pDeactiveList.pool.length; i++) {
	        var pInst = pDeactiveList.pool[i];
	        if (pInst.object_index == _objindex || pInst.id == _objindex) {
	            keep[keep.length] = pInst;
	        }
	        else if (object_has_parent(g_pObjectManager.Get(pInst.object_index), _objindex)) {
	            keep[keep.length] = pInst;
	        }
	    }
	}
	var pActiveList = g_RunRoom.m_Active;
	for (i = 0; i < keep.length; i++)
	{
		g_RunRoom.ActivateInstance(keep[i]);
	}
}


// #############################################################################################
/// Function:<summary>
///          	Deactivate all instances of a cetrtain object type in the room.
///          </summary>
///
/// In:		<param name="_inst">"this" instance</param>
///    		<param name="_objindex">"this" instance</param>
// #############################################################################################
function instance_deactivate_object(_inst, _objindex) 
{
    _objindex = yyGetInt32(_objindex);

	var i;
	var keep = [];
	var pActiveList = g_RunRoom.m_Active;
	if (_objindex == OBJECT_ALL) {	    
	    for (var i = 0; i < pActiveList.pool.length; i++) {
	        var pInst = pActiveList.pool[i];
            keep[keep.length] = pInst;
	    }
	} 
	else {	    
	    for (var i = 0; i < pActiveList.pool.length; i++) {
	        var pInst = pActiveList.pool[i];
	        if (pInst.object_index == _objindex || pInst.id == _objindex) {
	            keep[keep.length] = pInst;
	        }
	        else if (object_has_parent(g_pObjectManager.Get(pInst.object_index), _objindex)) {
	            keep[keep.length] = pInst;
	        }
	    }
	}
	var pDeactiveList = g_RunRoom.m_Deactive;
	for (i = 0; i < keep.length; i++)
	{
		g_RunRoom.DeactivateInstance(keep[i]);
	}
}


// #############################################################################################
/// Function:<summary>
///          	Deactivates all instances in the indicated region (that is, those whose bounding 
///				box lies partially inside the region). If inside is false the instances completely 
///				outside the region are deactivated. If notme is true the calling instance is not 
///				deactivated (which is normally what you want).
///          </summary>
///
/// In:		 <param name="_inst"></param>
///			 <param name="_left"></param>
///			 <param name="_top"></param>
///			 <param name="_width"></param>
///			 <param name="_height"></param>
///			 <param name="_wantinside">true if you want the ones INSIDE to deactivate</param>
///			 <param name="_notme"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function instance_deactivate_region(_inst, _left,_top,_width,_height,_wantinside,_notme) 
{
    _left = yyGetReal(_left);
    _top = yyGetReal(_top);
    _width = yyGetReal(_width);
    _height = yyGetReal(_height);

	var bottom, top, right;
	var keep = [];
	var pActiveList = g_RunRoom.m_Active;


	right = _left + _width - 1;
	bottom = _top + _height - 1;	
	for (var i = 0; i < pActiveList.pool.length; i++)
	{
	    var outside = false;
		var pInst = pActiveList.pool[i];
		if (pInst.bbox_dirty) pInst.Compute_BoundingBox();

		var bbox = pInst.bbox;
		if ((bbox) && ((pInst.sprite_index >= 0) || (pInst.mask_index >= 0))) {
		    if ((_left > bbox.right) || (right < bbox.left)  || (_top > bbox.bottom ) || (bottom < bbox.top)) {
		        outside=true;
		    }
		}
		else {
		    if ((pInst.x > right) || (pInst.x < _left) || (pInst.y > bottom) || (pInst.y < _top)) {
		        outside = true;
		    }
		}
		
		if ( outside != yyGetBool(_wantinside) ) keep[keep.length] = pInst;		
	}



	var pDeactiveList = g_RunRoom.m_Deactive;
	for (i = 0; i < keep.length; i++)
	{
	    if (_inst == keep[i]) {
	    	if (!yyGetBool(_notme)) {
	    		g_RunRoom.DeactivateInstance(keep[i]);
		    }
	    } 
	    else {
	    	g_RunRoom.DeactivateInstance(keep[i]);
		}
	}
}

function instance_deactivate_region_special( _inst, _x, _y, _width, _height, _notme, _activateArray, _deactivateArray)
{
	yyError( "not implemented yet!");
}


function instance_deactivate_layer(_inst,arg1)
{
 var room = g_RunRoom;

    if(room==null)
    {
        return -1;
    }
    var pLayer=null;
   
    if ((typeof (arg1) === "string") )
        pLayer = g_pLayerManager.GetLayerFromName(room,yyGetString(arg1).toLowerCase());
    else
        pLayer = g_pLayerManager.GetLayerFromID(room,yyGetInt32(arg1));
    
    
    if(pLayer === null)
        return;

    for(var j=0;j<pLayer.m_elements.length;j++)
    {
        var el = pLayer.m_elements.Get(j);
        if (el == null)
            continue;
        if(el.m_type==eLayerElementType_Instance)
        {
             room.DeactivateInstance(el.m_pInstance);
        }
    }
}

function instance_activate_layer(inst,arg1)
{
    var room = g_RunRoom;

    if(room==null)
    {
        return -1;
    }
    var pLayer=null;
   
    if ((typeof (arg1) === "string") )
        pLayer = g_pLayerManager.GetLayerFromName(room, yyGetString(arg1).toLowerCase());
    else
        pLayer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(arg1));
    
    
    if(pLayer === null)
        return;

    for(var j=0;j<pLayer.m_elements.length;j++)
    {
        var el = pLayer.m_elements.Get(j);
        if (el == null)
            continue;
        if(el.m_type==eLayerElementType_Instance)
        {
             room.ActivateInstance(el.m_pInstance);
        }
    }
}


// #############################################################################################
/// Function:<summary>
///          	Activates all instances in the indicated region. If inside is false the instances 
///             completely outside the region are activated.
///          </summary>
///
/// In:		 <param name="_inst"></param>
///			 <param name="_left"></param>
///			 <param name="_top"></param>
///			 <param name="_width"></param>
///			 <param name="_height"></param>
///			 <param name="_wantinside">true if you want the ones INSIDE to deactivate</param>
///			 <param name="_notme"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function instance_activate_region(_inst, _left,_top,_width,_height,_wantinside) 
{
    _left = yyGetReal(_left);
    _top = yyGetReal(_top);
    _width = yyGetReal(_width);
    _height = yyGetReal(_height);

	var i;
	var bottom, top,right;
	var keep = [];
	var pDeactiveList = g_RunRoom.m_Deactive;


	right = _left + _width - 1;
	bottom = _top + _height - 1;	
	for (var i = 0; i < pDeactiveList.pool.length; i++)
	{
	    var outside = false;
		var pInst = pDeactiveList.pool[i];
		if (pInst.bbox_dirty) pInst.Compute_BoundingBox();

		var bbox = pInst.bbox;
		if( (pInst.sprite_index>=0)  || (pInst.mask_index>=0) ){
			if( bbox.right<_left || bbox.left>right || bbox.bottom<_top || bbox.top>bottom)
			{
		        outside=true;
		    }
		}
		else {
		    if ((pInst.x > right) || (pInst.x < _left)  || (pInst.y > bottom ) || (pInst.y< _top)) {
		        outside=true;
		    }
		}

		if ( outside != yyGetBool(_wantinside) ) keep[keep.length] = pInst;		
	}

	var pActiveList = g_RunRoom.m_Active;
	for (i = 0; i < keep.length; i++)
	{
	//    if (_inst == keep[i]) {
	   // 	if (!_notme)
	    //	{
	    //		g_RunRoom.ActivateInstance(keep[i]);
		  //  }
	  //  }
	    //else {
	    	g_RunRoom.ActivateInstance(keep[i]);
	    //}
	}
}

