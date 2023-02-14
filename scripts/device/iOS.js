
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

// Track the identifiers for the current list of active input events
var g_activeInputEventIDs = [];
var g_event = "None";
var g_LastTouchX = 0;
var g_LastTouchY = 0;

// #############################################################################################
/// Function:<summary>
///             Create necessary storage for a touch event
///          </summary>
// #############################################################################################
/** @constructor */
function yyTouchEvent() {

    this.x = 0;
    this.y = 0;
    this.ButtonDown = 0;
    this.ButtonPressed = 0;
    this.ButtonReleased = 0;
    this.ButtonDownLast = 0;
};

// #############################################################################################
/// Function:<summary>
///             Clear off the settings stored by a yyTouchEvent
///          </summary>
// #############################################################################################
yyTouchEvent.prototype.Clear = function () {

    this.ButtonDown = 0;
    this.ButtonPressed = 0;
    this.ButtonReleased = 0;
    this.ButtonDownLast = 0;
};

// #############################################################################################
/// Function:<summary>
///             Works out where, in game terms, the x,y of a touch is and stores it
///          </summary>
// #############################################################################################
yyTouchEvent.prototype.SetTouchLocation = function(_x, _y) {
    
    if (g_RunRoom)
	{
		var pViews;
		if (!g_RunRoom.m_enableviews)
		{
			pViews = g_DefaultViewArray;
		}
		else 
		{
			pViews = g_RunRoom.m_Views;
		}
		
		for (var v = 0; v < pViews.length; v++)
		{
			var pView = pViews[v];
			if (pView.visible)
			{
				//if (pView.surface_id == -1) {
				    				    
					CalcCanvasLocation(canvas, g_CanvasRect);
				//}
				//else {
				//	CalcCanvasLocation(g_Surfaces.Get(pView.surface_id), g_CanvasRect);
				//}
				if (((_x - g_CanvasRect.left) >= pView.scaledportx) &&
				    ((_x - g_CanvasRect.left) < pView.scaledportx2) &&
				    ((_y - g_CanvasRect.top) >= pView.scaledporty) &&
				    ((_y - g_CanvasRect.top) < pView.scaledporty2))
				{
					this.x = pView.GetMouseX(_x,_y);
					this.y = pView.GetMouseY(_x,_y);
					return;
			    }
			 }
	    }
    }
    // Default, just store the values unmodified
    this.x = _x;
    this.y = _y;
};

// #############################################################################################
/// Function:<summary>
///             Load a whole game from the "game file" object
///          </summary>
// #############################################################################################
/** @constructor */
function yyTouch(_id,_x,_y)
{
    this.id=_id;
    this.x = _x;
    this.y = _y;
}




function getExistingMouseDevice(touchEventId) 
{   
    for (var i = 0; i < g_activeInputEventIDs.length; i++) {
    
        if (g_activeInputEventIDs[i] === touchEventId) {
            return i;
        }
    }    
    return -1;    
}

function allocateMouseDevice(touchEventId) {

    var mouseDevice = -1;
    for (var i = 0; i < g_activeInputEventIDs.length; i++) {
    
        if ((g_activeInputEventIDs[i] === touchEventId) || (g_activeInputEventIDs[i] === -1)) 
        {
            mouseDevice = i;
            break;
        }
    }
    if (mouseDevice == -1) {
        mouseDevice = g_activeInputEventIDs.length;
    }
    g_activeInputEventIDs[mouseDevice] = touchEventId;
    
    // Setup the touch event slot for this device
    g_TouchEvents[mouseDevice] = new yyTouchEvent();
    
    return mouseDevice;
}

function touchHandler(event) {


  
    // Each event contains the following:
    // - touches: A list of information for every finger currently touching the screen
    // - targetTouches: Like touches, but is filtered to only the information for finger touches that started out within the same node
    // - changedTouches: A list of information for every finger involved in the event        
    for (var touchIndex = 0; touchIndex < event.changedTouches.length; touchIndex++) {

        var touchEvent = event.changedTouches[touchIndex];

        // Find the "mouse device" we're associating this updated touch with
        var type = "";
        var mouseDevice = -1;
        g_event = event.type;
        switch (event.type) 
        {
            case "touchstart":                
                mouseDevice = allocateMouseDevice(touchEvent["identifier"]); 
                //log("Allocated mouseDevice: " + mouseDevice + " for event: " + touchEvent.identifier);
                //debug("Allocated mouseDevice: " + mouseDevice + " for event: " + touchEvent.identifier);
                break;
            case "touchend":
                mouseDevice = getExistingMouseDevice(touchEvent["identifier"]);
                g_activeInputEventIDs[mouseDevice] = -1;
                //console.log("Ending mouseDevice: " + mouseDevice);
                //debug("Ending mouseDevice: " + mouseDevice + "X:" + touchEvent.screenX + " Y:" + touchEvent.screenY);
                break; 
            
            
            case "touchcancel":
                mouseDevice = getExistingMouseDevice(touchEvent["identifier"]);
                g_activeInputEventIDs[mouseDevice] = -1;
                //console.log("Ending mouseDevice: " + mouseDevice);
                //debug("Ending mouseDevice: " + mouseDevice + "X:" + touchEvent.screenX + " Y:" + touchEvent.screenY);
                break; 
            case "touchmove":                
                mouseDevice = getExistingMouseDevice(touchEvent["identifier"]);                
                //console.log("Moving mouseDevice: " + mouseDevice);
                //debug("Moving mouseDevice: " + mouseDevice);
                break;
            default:
                //console.log("unknown touch event " + event.type);
                return;
        }

        // Each touch has the following:
        // - clientX: X coordinate of touch relative to the viewport (excludes scroll offset)
        // - clientY: Y coordinate of touch relative to the viewport (excludes scroll offset)
        // - screenX: Relative to the screen
        // - screenY: Relative to the screen
        // - pageX: Relative to the full page (includes scrolling)
        // - pageY: Relative to the full page (includes scrolling)
        // - target: Node the touch event originated from
        // - identifier: An identifying number, unique to each touch event
                
        var eventX;
        var eventY;
        
        eventX = touchEvent.clientX; // was touchEvent.screenX
        eventY = touchEvent.clientY; // was touchEvent.screenY
        
        // If it's the first touch event currently in flight then treat it as a main mouse event
        if (mouseDevice == 0) 
        {   
            if (g_pIOManager != null) {
            
            	g_EventMouseX = eventX;//  - canvasMinX;
            	g_EventMouseY = eventY;//  - canvasMinY;
            }
        
            switch (event.type) 
            {
                case "touchstart":  g_EventButtons = 1; break;
                case "touchmove":   g_EventButtons = 1;  break;
                case "touchcancel":
                case "touchend":    g_EventButtons = 0; break;                
            }
        }
        
        // Store the details of the touch event in multi-touch storage
        g_TouchEvents[mouseDevice].SetTouchLocation(eventX, eventY); 
        
        // Ensure the input event is used for virtual keys (devices above 0 are effectively additional mouse buttons)
        g_CurrentInputEvents[mouseDevice].x = eventX;
        g_CurrentInputEvents[mouseDevice].y = eventY;
        
        // Set the flags for virtual keys and the button down value for the touch events
        switch (event.type) 
        {
            case "touchstart":
                //debug("Touch device: " + mouseDevice + " at:" + touchEvent.screenX + "," + touchEvent.screenY + ", or at:" + touchEvent.pageX + ", " + touchEvent.pageY);
                g_TouchEvents[mouseDevice].ButtonDown = 1;
                g_CurrentInputEvents[mouseDevice].Flags = TOUCH_INPUT_EVENT | INPUT_EVENT_ACTIVE | NEW_INPUT_EVENT;                                                        
                break;
            case "touchcancel":
            case "touchend":
                g_TouchEvents[mouseDevice].ButtonDown = 0;
                g_CurrentInputEvents[mouseDevice].Flags = 0;                
                break;
            case "touchmove":
            default:
                break;
        }
        
        // Don't allow the user to move the page around
        event.preventDefault();
    }
}



function positionHandler(e)
{
    var fIsWallpaperEngine = (window["wallpaperMediaIntegration"] || window["wallpaperRegisterAudioListener"]);
    //console.log( "positionHandler - " + e.type  + ", pointerId - " + e["pointerId"] + ", "+ JSON.stringify(g_activeInputEventIDs) + ", " + fIsWallpaperEngine);
    var mouseDevice = -1;    
    var type = "";
    var button = 0;
    var buttons = 0;
    switch( e.type ) {
    case 'mousemove':
        mouseDevice = 0;
        button = e.button;
        buttons = e.buttons;
        break;
    case 'touchstart':
    case 'touchmove':
    case 'touchend':
        touchHandler(e);
        break;
    case 'pointerdown':
    case 'MSPointerDown':
        mouseDevice = allocateMouseDevice(e["pointerId"]); 
        type = "start";
        button = e.button;
        buttons = e.buttons;
        break;
    case 'pointermove':
    case 'MSPointerMove':
    case 'pointerover':
        mouseDevice = getExistingMouseDevice(e["pointerId"]);
        // RK :: Wallpaper Engine on Windows is not generating the "pointerdown" event it jumps straight to "pointerover", 
        // to work around this we pretend this is the "pointerdown" then everything starts to work.
        if (fIsWallpaperEngine && (mouseDevice == -1)) {
            positionHandler( { 
                                "type" : 'pointerdown', 
                                "pointerId" : e["pointerId"],
                                "button" : 1, 
                                "buttons" : 1, 
                                "clientX" : e.clientX, 
                                "clientY" : e.clientY, 
                                "preventDefault" : function() { }
                            });
            mouseDevice = getExistingMouseDevice(e["pointerId"]);
        } // end if
        button = e.button;
        buttons = e.buttons;
        type = "move";
        break;
    case 'pointerup':
    case 'MSPointerUp':
    case 'pointercancel':
    case 'MSPointerCancel':
    case 'pointerout':
    case 'MSPointerOut':
        mouseDevice = getExistingMouseDevice(e["pointerId"]);
        // RK :: Wallpaper Engine on Windows is not generating the "pointerdown" event it jumps straight to "pointerover", 
        // to work around this we pretend this is the "pointerdown" then everything starts to work.
        if (fIsWallpaperEngine && (mouseDevice == -1)) {
            positionHandler( { 
                                "type" : 'pointerdown', 
                                "pointerId" : e["pointerId"],
                                "button" : 1, 
                                "buttons" : 1, 
                                "clientX" : e.clientX, 
                                "clientY" : e.clientY, 
                                "preventDefault" : function() { }
                            });
            mouseDevice = getExistingMouseDevice(e["pointerId"]);
        } // end if
        type = "end";
        button = e.button;
        buttons = e.buttons;
        g_activeInputEventIDs[mouseDevice] = -1;
        break;
    }

    //console.log( "mouseDevice - " + mouseDevice + ", type - "  + type + ", button - " + button + ", buttons - " + buttons + ", x - " + e.clientX + ", y - " + e.clientY + ", "  + JSON.stringify(g_activeInputEventIDs));
    if (mouseDevice >= 0) {

        //console.log( type + " - mouse=" + mouseDevice + ", id = " + e.pointerId);

        // Each touch has the following:
        // - clientX: X coordinate of touch relative to the viewport (excludes scroll offset)
        // - clientY: Y coordinate of touch relative to the viewport (excludes scroll offset)
        // - screenX: Relative to the screen
        // - screenY: Relative to the screen
        // - pageX: Relative to the full page (includes scrolling)
        // - pageY: Relative to the full page (includes scrolling)
        // - target: Node the touch event originated from
        // - identifier: An identifying number, unique to each touch event
                
        var eventX = e.clientX; // was touchEvent.screenX
        var eventY = e.clientY; // was touchEvent.screenY
        
        // If it's the first touch event currently in flight then treat it as a main mouse event
        if (mouseDevice == 0) 
        {   
            if (g_pIOManager != null) {
            
                g_EventMouseX = eventX;//  - canvasMinX;
                g_EventMouseY = eventY;//  - canvasMinY;
            }
        
            switch (type) 
            {
                case "start":  
                case "move":   
                    {
                        g_ButtonButton = 0;
                        if (e.pointerType == "mouse") {
                            g_ButtonButton = button;
                        } // end if

                        if(button != -1)
                        {
                            // Swap middle and RIGHT button, so middle is button 3.   
                            if (g_ButtonButton == 2) g_ButtonButton = 1;
                            else if (g_ButtonButton == 1) g_ButtonButton = 2;

                            g_EventLastButtonDown = g_ButtonButton;
                            g_EventButtonDown = g_ButtonButton;
                            g_EventButtons = buttons;
                        }
                    } // end block
                    break;

                case "end":    g_EventButtons = 0; break;                
            }
            //console.log( "x - " + eventX + ", y - " + eventY + " buttons - " + buttons);
        }
        
        // Store the details of the touch event in multi-touch storage
        g_TouchEvents[mouseDevice].SetTouchLocation(eventX, eventY); 
        
        // Ensure the input event is used for virtual keys (devices above 0 are effectively additional mouse buttons)
        g_CurrentInputEvents[mouseDevice].x = eventX;
        g_CurrentInputEvents[mouseDevice].y = eventY;
        
        // Set the flags for virtual keys and the button down value for the touch events
        switch (type) 
        {
            case "start":
                //debug("Touch device: " + mouseDevice + " at:" + touchEvent.screenX + "," + touchEvent.screenY + ", or at:" + touchEvent.pageX + ", " + touchEvent.pageY);
                g_TouchEvents[mouseDevice].ButtonDown = 1;
                g_CurrentInputEvents[mouseDevice].Flags = TOUCH_INPUT_EVENT | INPUT_EVENT_ACTIVE | NEW_INPUT_EVENT;                                                        
                break;
            case "end":
                g_TouchEvents[mouseDevice].ButtonDown = 0;
                g_CurrentInputEvents[mouseDevice].Flags = 0;                
                break;
            case "move":
            default:
                break;
        }
    } // end if
    
    // Don't allow the user to move the page around
    e.preventDefault();
}

// #############################################################################################
/// Function:<summary>
///             Load a whole game from the "game file" object
///          </summary>
///
/// In:		 <param name="_GameFile">The game file to laod</param>
///
// #############################################################################################
function bindTouchEvents() 
{
    if ((window.PointerEvent) || (window.navigator.pointerEnabled)||(window.navigator.msPointerEnabled)) {

        canvas.addEventListener( "pointerdown",     positionHandler, false );
        canvas.addEventListener( "pointermove",     positionHandler, false );
        canvas.addEventListener( "pointerup",       positionHandler, false );
        canvas.addEventListener( "pointercancel",   positionHandler, false );
        canvas.addEventListener( "pointerover",     positionHandler, false );
        canvas.addEventListener( "pointerout",      positionHandler, false );
        canvas.addEventListener( "MSPointerDown",   positionHandler, false );
        canvas.addEventListener( "MSPointerMove",   positionHandler, false );
        canvas.addEventListener( "MSPointerUp",     positionHandler, false );
        canvas.addEventListener( "MSPointerCancel", positionHandler, false );
        canvas.addEventListener( "MSPointerOver",   positionHandler, false );
        canvas.addEventListener( "MSPointerOut",    positionHandler, false );

    } // end if
    else {
    	canvas.ontouchstart = touchHandler;
    	canvas.ontouchmove = touchHandler;
    	canvas.ontouchend = touchHandler;
    	canvas.ontouchcancel = touchHandler;
    } // end else

    canvas.style.touchAction = "none";
}
