// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Events.js
// Created:			02/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		General event handling code.
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// ??/??/2011		V1.0        MJD     1st version
// 02/06/2011		V1.1        MJD     Added collision events.
// 
// **********************************************************************************************************************
var g_OSPauseEventRaised = false,
    g_OSPauseEvent = false,
    g_OSPauseEventForcePause = true;

function    RaiseOSPauseEvent(_pause) {

    // When pausing, delay for a frame and let the user check via os_is_paused()
    if (_pause) {
        g_OSPauseEventRaised = true;
    }
    else {
        // On Windows8 if the windows key is pressed to take you to the start screen then we don't
        // get any further processing until it's pressed again... meaning the delayed pause action 
        // doesn't happen until we regain focus, thus we need to clear all these flags to prevent 
        // an out of sequence pause event taking place
        g_OSPauseEvent = false;
        g_OSPauseEventRaised = false;
        if (g_OSPauseEventForcePause) {
            Run_Paused = false;
        }
    }
}

// #############################################################################################
/// Function:<summary>
///             For Non-Win8JS, register the events that can cause us to be paused
///          </summary>
// #############################################################################################
function    RegisterPauseEvents() {

    // Win8JS gets in before here with its own focus/blur functionality so if 
    // it's already here don't add the following
    // If the line var page = WinJS.UI.Pages.define("Windows8Runner.html", {
    // gets altered in default.js for Win8JS then this will break
    if (window["page"] === undefined)
    {
        // Normal html5 games don't pause on lost focus like Win8(JS) apps do
        g_OSPauseEventForcePause = false;
    
        window.addEventListener("focus", function() {
            RaiseOSPauseEvent(false);
        });

        window.addEventListener("blur", function() {
            RaiseOSPauseEvent(true);
        });

        window.addEventListener("click", function() {
            RaiseOSPauseEvent(false);            
        });
    }
}

// #############################################################################################
/// Function:<summary>
///             Handles OS raised events
///          </summary>
// #############################################################################################
function HandleOSEvents() {

    if (g_OSPauseEventRaised) {
        g_OSPauseEvent = true;
        g_OSPauseEventRaised = false;
    }
    else if (g_OSPauseEvent) {        
        g_OSPauseEvent = false;        
        if (g_OSPauseEventForcePause) {
            Run_Paused = true;
        }
    }
}

// #############################################################################################
/// Function:<summary>
///             Handles 'other' 'outside' and 'boundary' events
///          </summary>
// #############################################################################################
function    HandleOther()
{
    var bbox, i, viewIndex;
    var pViews = null;
	if (g_RunRoom.m_enableviews)
	{
		pViews = g_RunRoom.m_Views;		
	}


	var pool = g_RunRoom.m_Active.pool;
    var count = g_currentCreateCounter++;
	for (var instIndex = 0; instIndex < pool.length; instIndex++)
	{
		var inst = pool[instIndex];
		var pObject = inst.pObject;

        if (!inst.marked && (inst.createCounter <= count))
        {
            // Outside events
            if (pObject.REvent[EVENT_OTHER_OUTSIDE])
            {
                var outside = false;
                if (sprite_exists(inst.sprite_index) || sprite_exists(inst.mask_index))
                {                            
                    bbox = inst.get_bbox();
                    outside =  ((bbox.right < 0) || (bbox.left > g_RunRoom.GetWidth()) || (bbox.bottom < 0) || (bbox.top > g_RunRoom.GetHeight()));
                }
                else 
                {
                    outside = ((inst.x < 0) || (inst.x > g_RunRoom.GetWidth()) || (inst.y < 0) || (inst.y > g_RunRoom.GetHeight()));
                }

                if (outside) {
                    if (!inst.fOutsideRoom) {
                        inst.PerformEvent(EVENT_OTHER_OUTSIDE, EVENT_OTHER, inst, inst);                        
                    }
                }
                inst.fOutsideRoom = outside;
            }
                    
            // Boundary events
            if (pObject.REvent[EVENT_OTHER_BOUNDARY])
            {
                if (sprite_exists(inst.sprite_index) || sprite_exists(inst.mask_index))
                {
                    bbox = inst.get_bbox();
                    if ((bbox.left < 0) || (bbox.right > g_RunRoom.GetWidth()) || (bbox.top < 0) || (bbox.bottom > g_RunRoom.GetHeight()))
                    {
                        inst.PerformEvent(EVENT_OTHER_BOUNDARY, EVENT_OTHER, inst, inst);
                    }
                }
                else
                {
                    if ((inst.x < 0) || (inst.x > g_RunRoom.GetWidth()) || (inst.y < 0) || (inst.y > g_RunRoom.GetHeight()))
                    {
                        inst.PerformEvent(EVENT_OTHER_BOUNDARY, EVENT_OTHER, inst, inst);
                    }
                }
            }
                        

            // Handle view related "other" events
            //for (i in pViews)
            if (pViews) {
                for (viewIndex = 0; viewIndex < pViews.length; viewIndex++) {
                    //if (!pViews.hasOwnProperty(i)) continue;

                 
                  
                    //var viewIndex = parseInt(i);
                    var pCurrentView = pViews[viewIndex];
                    if (pCurrentView.visible) {
                        var RoomX = pCurrentView.worldx;
                        var RoomY = pCurrentView.worldy;
                        var RoomR = pCurrentView.worldx + pCurrentView.worldw;
                        var RoomB = pCurrentView.worldy + pCurrentView.worldh;

                        var pCam = g_pCameraManager.GetCamera(pCurrentView.cameraID);
                        if(pCam!=null)
                        {
                            RoomX = pCam.GetViewX();
                            RoomY = pCam.GetViewY();
                            RoomR = pCam.GetViewX() + pCam.GetViewWidth();
                            RoomB = pCam.GetViewY() + pCam.GetViewHeight();
                        }

                        // Outside view events
                        if (pObject.REvent[EVENT_OTHER_OUTSIDE_VIEW0 + viewIndex]) {

                            // Make a distinction whether the instance has a mask (or sprite) || not
                            if (sprite_exists(inst.sprite_index) || sprite_exists(inst.mask_index)) {
                                bbox = inst.get_bbox();
                                if ((bbox.right < RoomX) ||
		                		(bbox.left > RoomR) ||
		                		(bbox.bottom < RoomY) ||
		                		(bbox.top > RoomB)) {
                                    inst.PerformEvent(EVENT_OTHER_OUTSIDE_VIEW0 + viewIndex, EVENT_OTHER, inst, inst);
                                }
                            }
                            else {
                                if ((inst.x < RoomX) ||
		                		(inst.x > RoomR) ||
		                		(inst.y < RoomY) ||
		                		(inst.y > RoomB)) {
                                    inst.PerformEvent(EVENT_OTHER_OUTSIDE_VIEW0 + viewIndex, EVENT_OTHER, inst, inst);
                                }
                            }
                        }

                        // Boundary view events
                        if (pObject.REvent[EVENT_OTHER_BOUNDARY_VIEW0 + viewIndex]) {							
                            if (sprite_exists(inst.sprite_index) || sprite_exists(inst.mask_index)) {

								var intersectsBoundary = true;

                                bbox = inst.get_bbox();
                                if ((bbox.right < RoomX) ||
				        		(bbox.left > RoomR) ||
				        		(bbox.bottom < RoomY) ||
				        		(bbox.top > RoomB)) {
									intersectsBoundary = false; // the instance is completely outside the view
                                }

								if ((bbox.right < RoomR) &&
								(bbox.left > RoomX) &&
								(bbox.bottom < RoomB) &&
								(bbox.top > RoomY))
								{
									intersectsBoundary = false;	// the instance is completely *inside* the view, so doesn't intersect
								}

								if(intersectsBoundary)
								{
									inst.PerformEvent(EVENT_OTHER_BOUNDARY_VIEW0 + viewIndex, EVENT_OTHER, inst, inst);
								}
                            }
                            else {
								// Disabled in cpp runner but this should suffice for a point based intersect check
                                /*if ((inst.x == RoomX) ||
				        		(inst.x == RoomR) ||
				        		(inst.y == RoomY) ||
				        		(inst.y == RoomB)) {
                                    inst.PerformEvent(EVENT_OTHER_BOUNDARY_VIEW0 + viewIndex, EVENT_OTHER, inst, inst);
                                }*/
                            }
                        }
                    }
                }
            }
        }
    }
    
}


// #############################################################################################
/// Function:<summary>
///             Handles collision events
///          </summary>
// #############################################################################################
function    HandleCollision()
{
    // id1 and id2 are the OBJECT IDs to collide with
   for (var id1 in g_pCollisionList) {
        if (!g_pCollisionList.hasOwnProperty(id1)) continue;
    
        // get the 1st object, and its recursive instance pool
        var pObject1 = g_pObjectManager.Get(id1);        
        var pObj1Pool = pObject1.GetRPool();
        
        // Must "foreach" over the list of things needing to collide with
        var count = g_currentCreateCounter++;
        for (var inst1 = 0; inst1 < pObj1Pool.length; inst1++)
        {
        	var pInst1 = pObj1Pool[inst1];
        	if (!pInst1.marked && pInst1.active && (pInst1.createCounter <= count))
        	{
        		// Now get the 2nd object ID we're colliding to.  (must "foreach" over these as well)
        		var pCollArray = g_pCollisionList[id1];
        		for (var coll2 in pCollArray) {
        		    if (!pCollArray.hasOwnProperty(coll2)) continue;
        		
        			// Now get the 2nd object we're going to collide with.
        			var id2 = pCollArray[coll2];        // get id2.
        			var pObject2 = g_pObjectManager.Get(id2);        		        			

        			// Now loop through all recursive INSTANCES of this object and test to the primary one.
        			var pObj2Pool = pObject2.GetRPool();        			
        			for (var inst2 = 0; inst2 < pObj2Pool.length; inst2++)
        			{
        				var pInst2 = pObj2Pool[inst2];
        				
        				if (!pInst2.marked && pInst2.active && (pInst2.createCounter <= count))
        				{
							if( ( pInst1.pObject == pInst2.pObject ) && (inst2<inst1)) continue;

        					// Do they collide?       
        					if (pInst1.Collision_Instance(pInst2, true))
        					{
        						if ((pInst1.solid) || (pInst2.solid))
                                {
                                    pInst1.x = pInst1.xprevious;
                                    pInst1.y = pInst1.yprevious;
                                    pInst1.bbox_dirty = true;
        							pInst1.path_position = pInst1.path_positionprevious;

        							pInst2.x = pInst2.xprevious;
        							pInst2.y = pInst2.yprevious;
        							pInst2.bbox_dirty = true;
        							pInst2.path_position = pInst2.path_positionprevious;
        						}
                                
                                // When we FIND a collision, use the actual object IDs, not the parent IDs
                                // so that we can get the correct collision event code.
                                // Perform event will then run up the parent tree if required anyway
        						pInst1.PerformEvent( EVENT_COLLISION, pInst2.pObject.ID, pInst1, pInst2);
                                pInst2.PerformEvent( EVENT_COLLISION, pInst1.pObject.ID, pInst2, pInst1);
        						

        						if ((pInst1.solid) || (pInst2.solid))
        						{
        							pInst1.Adapt_Path();         // We do not call the end-of-path event again
        							pInst2.Adapt_Path();
        							pInst1.SetPosition(pInst1.x + pInst1.hspeed, pInst1.y + pInst1.vspeed);
        							pInst2.SetPosition(pInst2.x + pInst2.hspeed, pInst2.y + pInst2.vspeed);


        							// If collision is not resolved then set to previous position
        							if (pInst1.Collision_Instance(pInst2, true))
        							{
        								pInst1.x = pInst1.xprevious;
        								pInst1.y = pInst1.yprevious;
        								pInst1.bbox_dirty = true;
        								pInst1.path_position = pInst1.path_positionprevious;

        								pInst2.x = pInst2.xprevious;
        								pInst2.y = pInst2.yprevious;
        								pInst2.bbox_dirty = true;
        								pInst2.path_position = pInst2.path_positionprevious;
        							}
        						}
        					}
        				}
        			}
        		}
        	}
        }
    }  
}              

// #############################################################################################
/// Function:<summary>
///             For the second instance in a collision we need to use the its actual type
///             and recurse up the first instance's inheritance hierarchy until we find a way
///             to handle the collision for the second instance, if at all possible.
///             In the VC_Runner the collision pairs only use instances at their actual type
///             level, thus this situation is handled implicitly.
///             We do not need to do something similar for the first instance in a collision due
///             to the manner in which g_pCollisionList is built up.
///          </summary>
// #############################################################################################
/*function PerformInstanceCollisionRecursive(pInst1, pInst2)
{
    var pObj1 = pInst1.pObject;
    var pObj2 = pInst2.pObject;
    while (pObj1) 
    {                                
        if (pObj2.Collisions[pObj1.ID]) 
        {
            pObj2.PerformEvent(EVENT_COLLISION, pObj1.ID, pInst2, pInst1);
            break;
        }
        pObj1 = pObj1.pParent;
    }
}*/


// #############################################################################################
/// Function:<summary>
///             Given a point, do a collision test with each instance that has the desired
///             event. (mouse click etc).
///          </summary>
///
/// In:		 <param name="_event">Primary event</param>
///    		 <param name="_sub_event">Secondary event</param>
///			 <param name="x">X Point to test with</param>
///			 <param name="y">Y Point to test with</param>
///				
// #############################################################################################
function    DoPointToInstance( _event, _sub_event, _x,_y )
{
    // First scale the coordinate into the current screen scale.
    //_x = _x * scale;

    // Might be better to loop through objects, rather than active instances... less getSprite stuff...
    for(var i=g_RunRoom.m_Active.length-1;i>=0;i-- )
    {
        var pInst = g_RunRoom.m_Active.Get(i);
      //  with( pInst )
        {
            if (pInst.bbox_dirty) pInst.Compute_BoundingBox();
            if (!pInst.marked && pInst.pObject.REvent[_event | _sub_event])
            {
                var pSprite = g_pSpriteManager.Get( pInst.sprite_index );
                var ox = pSprite.xOrigin;
                var oy = pSprite.yOrigin;
                if ((_x >= pInst.bbox.left) && (_x < pInst.bbox.right) && (_y >= pInst.bbox.top) && (_y < pInst.bbox.bottom))
                {
                	pInst.PerformEvent(_event, _sub_event, pInst, pInst);        // timer enum starts at 1..
                }
            }
        }
    }
}



// #############################################################################################
/// Function:<summary>
///				Handles mouse events
///          </summary>
// #############################################################################################
function HandleMouse() 
{
    if (g_RunRoom)
    {
        var ind;

        var count = g_currentCreateCounter;

        var mousex = window_views_mouse_get_x();
        var mousey = window_views_mouse_get_y();

        // Now loop through instances                	
        var ObjPool = g_pObjectManager.GetPool();
        for (var o = 0; o < ObjPool.length; o++)
        {
            var pObj = ObjPool[o];
            var pREvent = pObj.REvent;
            if (pREvent[EVENT_MOUSE_LBUTTON_DOWN] || pREvent[EVENT_MOUSE_MBUTTON_DOWN] || pREvent[EVENT_MOUSE_RBUTTON_DOWN] ||
                    pREvent[EVENT_MOUSE_LBUTTON_PRESSED] || pREvent[EVENT_MOUSE_MBUTTON_PRESSED] || pREvent[EVENT_MOUSE_RBUTTON_PRESSED] ||
                    pREvent[EVENT_MOUSE_LBUTTON_RELEASED] || pREvent[EVENT_MOUSE_MBUTTON_RELEASED] || pREvent[EVENT_MOUSE_RBUTTON_RELEASED] ||
                    pREvent[EVENT_MOUSE_NOBUTTON] || pREvent[EVENT_MOUSE_ENTER] || pREvent[EVENT_MOUSE_LEAVE] || pREvent[EVENT_MOUSE_WHEEL_UP] ||
					pREvent[EVENT_MOUSE_WHEEL_DOWN] 
                )
            {
                if (pObj.Instances.length > 0)
                {
                	var ipool = pObj.Instances.pool.slice(0);                				
                	for (var i = ipool.length-1; i >= 0; i--)
                	{
                		//var pInst = g_RunRoom.m_Active.Get(i);
                		//var pREvent = pInst.pObject.REvent;                					
                		var pInst = ipool[i];

                		// If the instance uses ANY mouse event, then we need to 
                		if (!pInst.marked && (pInst.createCounter <= count))
                		{
                			// NOTE:    This isn't "exactly" how GM8.x works. This will not loop through each instance, on each event.
                			//          Instead, it takes a single instance and does all mouse events on that instance.
                			if (pInst.bbox_dirty) pInst.Compute_BoundingBox();

                			if (pInst.Collision_Point(mousex, mousey, true))
                			{
                				var nobut = true;
                				for (ind = 0; ind < 3; ind++)
                				{
                					if (g_pIOManager.ButtonDown[ind])
                					{
                						if (pREvent[EVENT_MOUSE_LBUTTON_DOWN + ind])
                						{
                							pInst.PerformEvent(EVENT_MOUSE_LBUTTON_DOWN + ind, 0, pInst, pInst);
                						}
                						nobut = false;
                					}
                				}

                				for (ind = 0; ind < 3; ind++)
                				{
                					if (g_pIOManager.ButtonPressed[ind] === 1)
                					{
                						if (pREvent[EVENT_MOUSE_LBUTTON_PRESSED + ind])
                						{
                							pInst.PerformEvent(EVENT_MOUSE_LBUTTON_PRESSED + ind, 0, pInst, pInst);
                						}
                						nobut = false;
                					}
                				}

                				for (ind = 0; ind < 3; ind++)
                				{
                					if (g_pIOManager.ButtonReleased[ind] === 1)
                					{
                						if (pREvent[EVENT_MOUSE_LBUTTON_RELEASED + ind])
                						{
                							pInst.PerformEvent(EVENT_MOUSE_LBUTTON_RELEASED + ind, 0, pInst, pInst);
                						}
                					}
                				}

                				// Handle "no button" events
                				if (nobut)
                				{
                					pInst.PerformEvent(EVENT_MOUSE_NOBUTTON, 0, pInst, pInst);
                				}

                				// mouse_enter
                				if (!pInst.mouse_over)
                				{
                					pInst.PerformEvent(EVENT_MOUSE_ENTER, 0, pInst, pInst);
                					pInst.mouse_over = true;
                				}
                			} 
                			else
                			{
                				// mouse_enter
                				if (pInst.mouse_over)
                				{
                					pInst.PerformEvent(EVENT_MOUSE_LEAVE, 0, pInst, pInst);
                					pInst.mouse_over = false;
                				}

                			}
                		}
                	} // end for
                }
            }
        }

		// handle global mouse event stuff.
		for (ind = 0; ind < 3; ind++)
		{
			if (g_pIOManager.ButtonDown[ind])
			{
				g_pInstanceManager.PerformEvent(EVENT_MOUSE_GLOBAL_LBUTTON_DOWN + ind,0);
			}
		}

		for (ind = 0; ind < 3; ind++)
		{
			if (g_pIOManager.ButtonPressed[ind] === 1)
			{
				g_pInstanceManager.PerformEvent(EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED + ind,0);
			}
		}

		for (ind = 0; ind < 3; ind++)
		{
			if (g_pIOManager.ButtonReleased[ind] === 1)
			{
				g_pInstanceManager.PerformEvent(EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED + ind,0);
			}
		}

        if (g_MouseUP)
        {
            g_pInstanceManager.PerformEvent(EVENT_MOUSE_WHEEL_UP,0);
        }
        if (g_MouseDOWN)
        {
            g_pInstanceManager.PerformEvent(EVENT_MOUSE_WHEEL_DOWN,0);
        }                   
    }   
}


// #############################################################################################
/// Function:<summary>
///				Handles timeline events
///          </summary>
// #############################################################################################
function    HandleTimeLine()
{
    var ind1,ind2,j;
	var pool = g_RunRoom.m_Active.pool;
    var count = g_currentCreateCounter++;
	for (var inst=0; inst < pool.length; inst++)
	{
		var pInst = pool[inst];

		if (!pInst.marked && (pInst.timeline_index >= 0) && (pInst.createCounter <= count))
		{
		    // Updated the timeline position
		    if (!pInst.timeline_paused)
		    {
			    var timeline = g_pTimelineManager.Get(pInst.timeline_index);			
			    if ((timeline !== null) && (timeline !== undefined))
			    {
			        if (pInst.timeline_speed > 0) {
			        			    			        
			            ind1 = timeline.FindLarger(pInst.timeline_position);			            
			            pInst.timeline_position += pInst.timeline_speed;
                        ind2 = timeline.FindLarger(pInst.timeline_position);
                                			                
                        for (j=ind1; j < ind2; j++)
                        {
                            // Perform event timeline...
                            event_perform_timeline(pInst, pInst, pInst.timeline_index, j);
                        }
                                                     
			            if (pInst.timeline_looped && (pInst.timeline_position > timeline.GetLast())) {
    			            pInst.timeline_position = 0;	    		            
		    	        }
		    	    }
		    	    else {
		    	    
		    	        ind1 = timeline.FindSmaller(pInst.timeline_position);			            
			            pInst.timeline_position += pInst.timeline_speed;
                        ind2 = timeline.FindSmaller(pInst.timeline_position);
                                			                
                        for (j = ind1; j > ind2; j--) {
                        
                            // Perform event timeline...
                            event_perform_timeline(pInst, pInst, pInst.timeline_index, j);
                        }
                        
			            if (pInst.timeline_looped && (pInst.timeline_position < 0)) {
    			            pInst.timeline_position = timeline.GetLast();	    		            
		    	        }
		    	    }
			    }
			}
		}
	}
}

// #############################################################################################
/// Function:<summary>
///				Handles time source events
///          </summary>
// #############################################################################################
function HandleTimeSources()
{
    // Propagate time deltas to all time sources
    // g_GlobalTimeSource and g_SDTimeSourceParent are ticked in GameMaker_Tick()
	g_GlobalTimeSource.TickChildren();
	g_SDTimeSourceParent.TickChildren();

    g_GameTimeSource.Tick(g_pBuiltIn.delta_time);
    g_GameTimeSource.TickChildren();

    // Now execute callbacks where necessary.
    // We do this separately from ticking to make sure that all time sources have been updated
    // before potentially operating on them.
    // Note that because the time deltas have already propagated to all sources before any checking began, 
    // any sources created in callbacks this frame will not invoke their own callbacks as they did  
    // not exist during the time delta propagation (and so no time has passed from their perspective).
    g_GlobalTimeSource.CheckChildren();
	g_SDTimeSourceParent.CheckChildren();
    g_GameTimeSource.CheckChildren();
}

// #############################################################################################
/// Function:<summary>
///				Handles alarm events
///          </summary>
// #############################################################################################
function	 HandleAlarm() {

	var pool = g_RunRoom.m_Active.pool;	
    var count = g_currentCreateCounter++;
	for (var inst = 0; inst < pool.length; inst++)
	{
		var pInst = pool[inst];
		if (!pInst.marked && (pInst.createCounter <= count))
		{
			// Now loop through all the timers, and see which ones we need to process.
    		for(var a = 0; a < MAXTIMER; a++)
			{
				var event = EVENT_ALARM|(a+1);		
				var pObj = pInst.pObject;

				// Does anyone (including parents) have an event handler for this?
				if( pObj.REvent[event] ) 
				{
					//inline for tizen...
					var al;
					al = ~~(pInst.alarm[a]);
					
					if( al>=0 ) {
						al--;
						//inline for tizen...
						pInst.alarm[a] = al;
					}
					if (al === 0) {
						pInst.PerformEvent( EVENT_ALARM|(a+1), 0, pInst, pInst );        // timer enum starts at 1..
					}				
				}
			}
		}
	}

}


// #############################################################################################
/// Function:<summary>
///             Convert a GML event into one of our own...
///          </summary>
///
/// In:		 <param name="_event">GML event number </param>
///			 <param name="_subevent">GML sub event number</param>
/// Out:	 <returns>
///				HTML5 runner event number
///			 </returns>
// #############################################################################################
function    event_lookup(_event, _subevent)
{
    switch(_event)
    {
        case GML_EVENT_CREATE : return      EVENT_CREATE;    
        case GML_EVENT_DESTROY : return     EVENT_DESTROY;   
        case GML_EVENT_CLEAN_UP : return     EVENT_CLEAN_UP;   
        case GML_EVENT_ALARM : 
            switch(_subevent)
            {
               case 0:  return   EVENT_ALARM_0;
               case 1:  return   EVENT_ALARM_1;
               case 2:  return   EVENT_ALARM_2;
               case 3:  return   EVENT_ALARM_3;
               case 4:  return   EVENT_ALARM_4;
               case 5:  return   EVENT_ALARM_5;
               case 6:  return   EVENT_ALARM_6;
               case 7:  return   EVENT_ALARM_7;
               case 8:  return   EVENT_ALARM_8;
               case 9:  return   EVENT_ALARM_9;
               case 10:  return  EVENT_ALARM_10;
               case 11:  return  EVENT_ALARM_11;
               default:  return  EVENT_ALARM_0;
            } break;
        case GML_EVENT_STEP : 
            switch(_subevent)
            {
                case    GML_EVENT_STEP_BEGIN:   return EVENT_STEP_BEGIN;
                case    GML_EVENT_STEP_NORMAL:  return EVENT_STEP_NORMAL;
                case    GML_EVENT_STEP_END:     return EVENT_STEP_END;
                default: return EVENT_STEP_NORMAL;
            } break;
            
        case GML_EVENT_COLLISION : return   EVENT_COLLISION;         
        case GML_EVENT_MOUSE:
        	switch (_subevent)
        	{
        		case GML_MOUSE_LeftButton: return EVENT_MOUSE_LBUTTON_DOWN;
        		case GML_MOUSE_RightButton: return EVENT_MOUSE_RBUTTON_DOWN;
        		case GML_MOUSE_MiddleButton: return EVENT_MOUSE_MBUTTON_DOWN;
        		case GML_MOUSE_NoButton: return EVENT_MOUSE_NOBUTTON;
        		case GML_MOUSE_LeftPressed: return EVENT_MOUSE_LBUTTON_PRESSED;
        		case GML_MOUSE_RightPressed: return EVENT_MOUSE_RBUTTON_PRESSED;
        		case GML_MOUSE_MiddlePressed: return EVENT_MOUSE_MBUTTON_PRESSED;
        		case GML_MOUSE_LeftReleased: return EVENT_MOUSE_LBUTTON_RELEASED;
        		case GML_MOUSE_RightReleased: return EVENT_MOUSE_RBUTTON_RELEASED;
        		case GML_MOUSE_MiddleReleased: return EVENT_MOUSE_MBUTTON_RELEASED;
        		case GML_MOUSE_MOUSEEnter: return EVENT_MOUSE_ENTER;
        		case GML_MOUSE_MOUSELeave: return EVENT_MOUSE_LEAVE;
        		case GML_MOUSE_Joystick1Left: return 0;
        		case GML_MOUSE_Joystick1Right: return 0;
        		case GML_MOUSE_Joystick1Up: return 0;
        		case GML_MOUSE_Joystick1Down: return 0;
        		case GML_MOUSE_Joystick1Button1: return 0;
        		case GML_MOUSE_Joystick1Button2: return 0;
        		case GML_MOUSE_Joystick1Button3: return 0;
        		case GML_MOUSE_Joystick1Button4: return 0;
        		case GML_MOUSE_Joystick1Button5: return 0;
        		case GML_MOUSE_Joystick1Button6: return 0;
        		case GML_MOUSE_Joystick1Button7: return 0;
        		case GML_MOUSE_Joystick1Button8: return 0;
        		case GML_MOUSE_Joystick2Left: return 0;
        		case GML_MOUSE_Joystick2Right: return 0;
        		case GML_MOUSE_Joystick2Up: return 0;
        		case GML_MOUSE_Joystick2Down: return 0;
        		case GML_MOUSE_Joystick2Button1: return 0;
        		case GML_MOUSE_Joystick2Button2: return 0;
        		case GML_MOUSE_Joystick2Button3: return 0;
        		case GML_MOUSE_Joystick2Button4: return 0;
        		case GML_MOUSE_Joystick2Button5: return 0;
        		case GML_MOUSE_Joystick2Button6: return 0;
        		case GML_MOUSE_Joystick2Button7: return 0;
        		case GML_MOUSE_Joystick2Button8: return 0;
        		case GML_MOUSE_GlobLeftButton: return EVENT_MOUSE_GLOBAL_LBUTTON_DOWN;
        		case GML_MOUSE_GlobRightButton: return EVENT_MOUSE_GLOBAL_RBUTTON_DOWN;
        		case GML_MOUSE_GlobMiddleButton: return EVENT_MOUSE_GLOBAL_MBUTTON_DOWN;
        		case GML_MOUSE_GlobLeftPressed: return EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED;
        		case GML_MOUSE_GlobRightPressed: return EVENT_MOUSE_GLOBAL_RBUTTON_PRESSED;
        		case GML_MOUSE_GlobMiddlePressed: return EVENT_MOUSE_GLOBAL_MBUTTON_PRESSED;
        		case GML_MOUSE_GlobLeftReleased: return EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED;
        		case GML_MOUSE_GlobRightReleased: return EVENT_MOUSE_GLOBAL_RBUTTON_RELEASED;
        		case GML_MOUSE_GlobMiddleReleased: return EVENT_MOUSE_GLOBAL_MBUTTON_RELEASED;
        		case GML_MOUSE_GML_MOUSEWheelUp: return EVENT_MOUSE_WHEEL_UP;
        		case GML_MOUSE_GML_MOUSEWheelDown: return EVENT_MOUSE_WHEEL_DOWN;
        		default:
        			return 0;
        	} break;
        case GML_EVENT_OTHER:
        	{
        		switch (_subevent)
        		{
        			case GML_EVENT_OTHER_OUTSIDE: return EVENT_OTHER_OUTSIDE;
        			case GML_EVENT_OTHER_BOUNDARY: return EVENT_OTHER_BOUNDARY;
        			case GML_EVENT_OTHER_STARTGAME: return EVENT_OTHER_STARTGAME;
        			case GML_EVENT_OTHER_ENDGAME: return EVENT_OTHER_ENDGAME;
        			case GML_EVENT_OTHER_STARTROOM: return EVENT_OTHER_STARTROOM;
        			case GML_EVENT_OTHER_ENDROOM: return EVENT_OTHER_ENDROOM;
        			case GML_EVENT_OTHER_NOLIVES: return EVENT_OTHER_NOLIVES;
        			case GML_EVENT_OTHER_ANIMATIONEND: return EVENT_OTHER_ANIMATIONEND;
        			case GML_EVENT_OTHER_ENDOFPATH: return EVENT_OTHER_ENDOFPATH;
        			case GML_EVENT_OTHER_NOHEALTH: return EVENT_OTHER_NOHEALTH;
        			case GML_EVENT_OTHER_CLOSEBUTTON: return EVENT_OTHER_CLOSEBUTTON;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW0: return EVENT_OTHER_OUTSIDE_VIEW0;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW1: return EVENT_OTHER_OUTSIDE_VIEW1;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW2: return EVENT_OTHER_OUTSIDE_VIEW2;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW3: return EVENT_OTHER_OUTSIDE_VIEW3;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW4: return EVENT_OTHER_OUTSIDE_VIEW4;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW5: return EVENT_OTHER_OUTSIDE_VIEW5;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW6: return EVENT_OTHER_OUTSIDE_VIEW6;
        			case GML_EVENT_OTHER_OUTSIDE_VIEW7: return EVENT_OTHER_OUTSIDE_VIEW7;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW0: return EVENT_OTHER_BOUNDARY_VIEW0;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW1: return EVENT_OTHER_BOUNDARY_VIEW1;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW2: return EVENT_OTHER_BOUNDARY_VIEW2;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW3: return EVENT_OTHER_BOUNDARY_VIEW3;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW4: return EVENT_OTHER_BOUNDARY_VIEW4;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW5: return EVENT_OTHER_BOUNDARY_VIEW5;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW6: return EVENT_OTHER_BOUNDARY_VIEW6;
        			case GML_EVENT_OTHER_BOUNDARY_VIEW7: return EVENT_OTHER_BOUNDARY_VIEW7;
        			case GML_ev_user0: return EVENT_OTHER_USER0;
        			case GML_ev_user1: return EVENT_OTHER_USER1;
        			case GML_ev_user2: return EVENT_OTHER_USER2;
        			case GML_ev_user3: return EVENT_OTHER_USER3;
        			case GML_ev_user4: return EVENT_OTHER_USER4;
        			case GML_ev_user5: return EVENT_OTHER_USER5;
        			case GML_ev_user6: return EVENT_OTHER_USER6;
        			case GML_ev_user7: return EVENT_OTHER_USER7;
        			case GML_ev_user8: return EVENT_OTHER_USER8;
        			case GML_ev_user9: return EVENT_OTHER_USER9;
        			case GML_ev_user10: return EVENT_OTHER_USER10;
        			case GML_ev_user11: return EVENT_OTHER_USER11;
        			case GML_ev_user12: return EVENT_OTHER_USER12;
        			case GML_ev_user13: return EVENT_OTHER_USER13;
        			case GML_ev_user14: return EVENT_OTHER_USER14;
        			case GML_ev_user15: return EVENT_OTHER_USER15;
        		    case GML_EVENT_OTHER_ANIMATIONUPDATE: return EVENT_OTHER_ANIMATIONUPDATE;
        		    case GML_EVENT_OTHER_ANIMATIONEVENT: return EVENT_OTHER_ANIMATIONEVENT;
        			case GML_EVENT_OTHER_WEB_IMAGE_LOAD: return EVENT_OTHER_WEB_IMAGE_LOAD;
        		    case GML_EVENT_OTHER_WEB_SOUND_LOAD: return EVENT_OTHER_WEB_SOUND_LOAD;
        		    case GML_EVENT_OTHER_WEB_ASYNC: return EVENT_OTHER_WEB_ASYNC;
        		    case GML_EVENT_OTHER_WEB_USER_INTERACTION: return EVENT_OTHER_WEB_USER_INTERACTION;
        		    case GML_EVENT_OTHER_IAP: return EVENT_OTHER_WEB_IAP;
        		    case GML_EVENT_OTHER_NETWORKING: return EVENT_OTHER_NETWORKING;
			    case GML_EVENT_OTHER_SOCIAL: return EVENT_OTHER_SOCIAL;
        		    case GML_EVENT_OTHER_PUSH_NOTIFICATION: return EVENT_OTHER_PUSH_NOTIFICATION;
        		    case GML_EVENT_OTHER_ASYNC_SAVE_LOAD: return EVENT_OTHER_ASYNC_SAVE_LOAD;
        		    case GML_EVENT_OTHER_AUDIO_PLAYBACK: return EVENT_OTHER_AUDIO_PLAYBACK;
				    case GML_EVENT_OTHER_AUDIO_PLAYBACK_ENDED: return EVENT_OTHER_AUDIO_PLAYBACK_ENDED;
        		    case GML_EVENT_OTHER_SYSTEM_EVENT: return EVENT_OTHER_SYSTEM_EVENT;
        		    case GML_EVENT_OTHER_BROADCAST_MESSAGE: return EVENT_OTHER_BROADCAST_MESSAGE;
        				default: return 0;
        		} break;
        	}
        case GML_EVENT_DRAW :      return   EVENT_DRAW | _subevent;                                      
        case GML_EVENT_KEYBOARD :  return   EVENT_KEYBOARD;
        case GML_EVENT_KEYPRESS :  return   EVENT_KEYPRESS;
        case GML_EVENT_KEYRELEASE: return	EVENT_KEYRELEASE;
        case GML_EVENT_TRIGGER: return EVENT_TRIGGER;
        case GML_EVENT_GESTURE:
            switch (_subevent)
            {
                case GML_EVENT_GESTURE_TAP: return EVENT_GESTURE_TAP;
                case GML_EVENT_GESTURE_DOUBLE_TAP: return EVENT_GESTURE_DOUBLE_TAP;
                case GML_EVENT_GESTURE_DRAG_START: return EVENT_GESTURE_DRAG_START;
                case GML_EVENT_GESTURE_DRAG_MOVE: return EVENT_GESTURE_DRAG_MOVE;
                case GML_EVENT_GESTURE_DRAG_END: return EVENT_GESTURE_DRAG_END;
                case GML_EVENT_GESTURE_FLICK: return EVENT_GESTURE_FLICK;
                case GML_EVENT_GESTURE_PINCH_START: return EVENT_GESTURE_PINCH_START;
                case GML_EVENT_GESTURE_PINCH_IN: return EVENT_GESTURE_PINCH_IN;
                case GML_EVENT_GESTURE_PINCH_OUT: return EVENT_GESTURE_PINCH_OUT;
                case GML_EVENT_GESTURE_PINCH_END: return EVENT_GESTURE_PINCH_END;
                case GML_EVENT_GESTURE_ROTATE_START: return EVENT_GESTURE_ROTATE_START;
                case GML_EVENT_GESTURE_ROTATING: return EVENT_GESTURE_ROTATING;
                case GML_EVENT_GESTURE_ROTATE_END: return EVENT_GESTURE_ROTATE_END;
                case GML_EVENT_GESTURE_GLOBAL_TAP: return EVENT_GESTURE_GLOBAL_TAP;
                case GML_EVENT_GESTURE_GLOBAL_DOUBLE_TAP: return EVENT_GESTURE_GLOBAL_DOUBLE_TAP;
                case GML_EVENT_GESTURE_GLOBAL_DRAG_START: return EVENT_GESTURE_GLOBAL_DRAG_START;
                case GML_EVENT_GESTURE_GLOBAL_DRAG_MOVE: return EVENT_GESTURE_GLOBAL_DRAG_MOVE;
                case GML_EVENT_GESTURE_GLOBAL_DRAG_END: return EVENT_GESTURE_GLOBAL_DRAG_END;
                case GML_EVENT_GESTURE_GLOBAL_FLICK: return EVENT_GESTURE_GLOBAL_FLICK;
                case GML_EVENT_GESTURE_GLOBAL_PINCH_START: return EVENT_GESTURE_GLOBAL_PINCH_START;
                case GML_EVENT_GESTURE_GLOBAL_PINCH_IN: return EVENT_GESTURE_GLOBAL_PINCH_IN;
                case GML_EVENT_GESTURE_GLOBAL_PINCH_OUT: return EVENT_GESTURE_GLOBAL_PINCH_OUT;
                case GML_EVENT_GESTURE_GLOBAL_PINCH_END: return EVENT_GESTURE_GLOBAL_PINCH_END;
                case GML_EVENT_GESTURE_GLOBAL_ROTATE_START: return EVENT_GESTURE_GLOBAL_ROTATE_START;
                case GML_EVENT_GESTURE_GLOBAL_ROTATING: return EVENT_GESTURE_GLOBAL_ROTATING;
                case GML_EVENT_GESTURE_GLOBAL_ROTATE_END: return EVENT_GESTURE_GLOBAL_ROTATE_END;
                
                default:
                    return 0;
            } break;
		case GML_EVENT_PRE_CREATE : return      EVENT_PRE_CREATE;   
        default: return 0;
    }
}


// #############################################################################################
/// Function:<summary>
///             Convert a GML subevent into one of our own...
///          </summary>
///
/// In:		 <param name="_event">GML event number </param>
///			 <param name="_subevent">GML sub event number</param>
/// Out:	 <returns>
///				HTML5 runner subevent number
///			 </returns>
// #############################################################################################
function    event_array_index_lookup(_event, _subevent)
{
    switch (_event) {
        case GML_EVENT_COLLISION:
        case GML_EVENT_TRIGGER: 
        case GML_EVENT_KEYBOARD:
        case GML_EVENT_KEYPRESS:
        case GML_EVENT_KEYRELEASE:
        {
            return _subevent;
        } 
    }        
    return 0;
}
