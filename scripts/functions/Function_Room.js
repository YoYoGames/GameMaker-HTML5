
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
var room_set_background_colour = room_set_background_color;




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