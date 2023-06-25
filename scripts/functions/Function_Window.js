
// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			Function_Window.js
// Created:			05/07/2011
// Author:			Mike
// Project:
// Description:
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 05/07/2011
//
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Sets whether the game window is visible. Clearly you normally want the window to 
///             remain visible during the whole game. The program will not receive keyboard events 
///             when the window is invisible.
///          </summary>
///
/// In:		 <param name="_visible">true for visible, false for invisible</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_visible(_visible) 
{
    ErrorFunction("window_set_visible()");
}


// #############################################################################################
/// Function:<summary>
///          	Gets the current window handle.
///          </summary>
///
/// Out:	<returns>
///				The current canvas name
///			</returns>
// #############################################################################################
function window_handle() {
	return g_CanvasName;
}


// #############################################################################################
/// Function:<summary>
///          	Return the rendering device where supported
///          </summary>
/// Out:	<returns>
///				always 0 in HTML5
///			</returns>
// #############################################################################################
function window_device() {
    if ((null !== g_CurrentGraphics.Context) && (undefined !== g_CurrentGraphics.Context))
        return g_CurrentGraphics.Context;
    else
        return g_CurrentGraphics;
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the game window is visible.
///          </summary>
///
/// Out:	 <returns>
///				always true
///			 </returns>
// #############################################################################################
function window_get_visible() 
{
    return true;
}


// #############################################################################################
/// Function:<summary>
///             Sets whether the window is shown in full screen mode.
///          </summary>
///
/// In:		 <param name="_full">true for full screen, false for "windowed"</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_fullscreen(_full) {
/*	if (g_FullScreen == _full) return;
	g_ToggleFullscreen = true;
	if( _full ) RememberCanvasSettings();
*/
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the window is shown in full screen mode.
///          </summary>
///
/// Out:	 <returns>
///				true for in fullscreen, false for error
///			 </returns>
// #############################################################################################
function window_get_fullscreen() {
	return g_FullScreen;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the border around the window is shown. 
///             (In full screen mode it is never shown.)
///          </summary>
///
/// In:		 <param name="_show"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_showborder(_show) 
{
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the border around the window is shown in windowed mode.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_showborder() 
{
    return true;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the border icons (iconize, maximize, close) are shown. 
///             (In full screen mode these are never shown.)
///          </summary>
///
/// In:		 <param name="_show"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_showicons(_show)
{
    ErrorFunction("window_set_showicons()");
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the border icons are shown in windowed mode.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_showicons()
{
    ErrorFunction("window_get_showicons()");
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the window must always stay on top of other windows.
///          </summary>
///
/// In:		 <param name="_stay"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_stayontop(_stay)
{
    ErrorFunction("window_set_stayontop()");
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the window always stays on top of other windows.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_stayontop() 
{
    ErrorFunction("window_get_stayontop()");
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the window is sizeable by the player. (The player can only size it 
///             when the border is shown and the window is not in full screen mode.)
///          </summary>
///
/// In:		 <param name="_sizeable"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_sizeable(_sizeable)
{
    ErrorFunction("window_set_sizeable()");    
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the window is sizeable by the player.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_sizeable() 
{
    ErrorFunction("window_get_sizeable()");
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Sets the caption string for the window. Normally you specify this when defining 
///             the room and it can be changed using the variable room_caption. So this function 
///             is normally not useful, unless you draw the room yourself rather than letting GameMaker 
///             do it. The caption is only visible when the window has a border and when it is not in full screen mode.
///          </summary>
///
/// In:		 <param name="_caption"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_caption(_caption) 
{
    document.title = yyGetString(_caption);
}


function window_set_min_width(_width){}
function window_set_max_width(_width){}
function window_set_min_height(_height){}
function window_set_max_height(_height){}

// #############################################################################################
/// Function:<summary>
///             Returns the window caption.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_caption() 
{
    return document.title;
}


// #############################################################################################
/// Function:<summary>
///          	Switch the cursor on/off
///          </summary>
///
/// In:		<param name="_on_off">true for on, false for off.</param>
/// Out:	<returns>
///				none
///			</returns>
// #############################################################################################
function EnableCursor(_on_off, _style)
{
	if (_on_off) {
	
		if (_style === undefined) {
		    canvas.style.cursor = "";
		}
		else {
		    canvas.style.cursor = _style;
		}
	}
	else {
		canvas.style.cursor = "none";
	}
}

// #############################################################################################
/// Function:<summary>
///             Sets the mouse cursor used in the window. You can use the following constant: 
///          </summary>
///
/// In:		 <param name="_curs"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_cursor(_curs) 
{
    _curs = yyGetInt32(_curs);
    var cursorStyle = "";
    switch (_curs) {
    
    	case cr_default:	cursorStyle = "auto"; _curs = cr_arrow; break;
        case cr_none:		cursorStyle = "__disable__"; break;
        case cr_arrow:		cursorStyle = "auto"; break;
        case cr_cross:		cursorStyle = "crosshair"; break;
        case cr_beam:		cursorStyle = ""; break;
        case cr_size_nesw:	cursorStyle = "ne-resize"; break;
        case cr_size_ns:	cursorStyle = "n-resize"; break;
        case cr_size_nwse:	cursorStyle = "nw-resize"; break;
        case cr_size_we:	cursorStyle = "w-resize"; break;
        case cr_uparrow:	cursorStyle = ""; break;
        case cr_hourglass:	cursorStyle = "wait"; break;
        case cr_drag:		cursorStyle = "move"; break;
        case cr_nodrop:		cursorStyle = ""; break;
        case cr_hsplit:		cursorStyle = ""; break;
        case cr_vsplit:		cursorStyle = ""; break;
        case cr_multidrag:	cursorStyle = ""; break;
        case cr_sqlwait:	cursorStyle = ""; break;
        case cr_no:			cursorStyle = ""; break;
        case cr_appstart:	cursorStyle = ""; break;
        case cr_help:		cursorStyle = "help"; break;
        case cr_handpoint:	cursorStyle = "pointer"; break;
        case cr_size_all:	cursorStyle = "e-resize"; break;
    };


    if (cursorStyle == "__disable__") {
        // Make sure the sprite cursor is also switched off
        g_CurrentHWCursor = _curs;
        EnableCursor(false, "none");
        return;
    }
    else if (_curs < 0 && cursorStyle == "") {    
        yyError("Cursor type is not supported.");
        EnableCursor(true, cursorStyle);
        return;
    } 
    else {
        // Normal cursor... set it
        g_CurrentHWCursor = _curs;        
        EnableCursor(true, cursorStyle);        
        return;
    }
}


// #############################################################################################
/// Function:<summary>
///             Returns the cursor used in the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_cursor() 
{
	return g_CurrentHWCursor;
}


// #############################################################################################
/// Function:<summary>
///             Sets the color of the part of the window that is not used for displaying the room.
///          </summary>
///
/// In:		 <param name="_colour"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_color(_colour)
{
    g_WindowColour = ConvertGMColour(yyGetInt32(_colour));
}
var window_set_colour = window_set_color;



// #############################################################################################
/// Function:<summary>
///             Returns the window colour.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_color() 
{
    return ConvertGMColour( g_WindowColour );
}
var window_get_colour = window_get_color;


// #############################################################################################
/// Function:<summary>
///             If the window is larger than the actual room normally the room is displayed in a 
///             region centered in the window. It is though possible to indicate that it must be 
///             scaled to fill the whole or part of the window. A value of 1 is no scaling. If you 
///             use a value of 0 the region will be scaled to fill the whole window. If you set it 
///             to a negative value it will be scaled to the maximal size inside the window while 
///             maintaining the aspect ratio (this is often what you want). adaptwindow indicates 
///             whether the window size must be adapted if the scaled room does not fit in. 
///             Adapting the window is only effective when the scale factor is positive.
///          </summary>
///
/// In:		 <param name="_scale"></param>
///			 <param name="_adaptwindow"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_region_scale( _scale, _adaptwindow) 
{
    ErrorFunction("window_set_region_scale()");
}


// #############################################################################################
/// Function:<summary>
///             Returns the scale factor for the drawing region.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_region_scale() 
{
    ErrorFunction("window_get_region_scale()");
}

// #############################################################################################
/// Function:<summary>
///             Sets the position of the (client part of the) window to the indicated position.
///          </summary>
///
/// In:		 <param name="_x"></param>
///			 <param name="_y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_position( _x,_y, _center ) 
{
    if (_center === undefined) _center = false;
    var canv = document.getElementById(g_CanvasName);
    
    // Check if the canvas position has already been fixed in position, one way or another
   
    for (var node = canv; node; node = node.parentNode) {
            
        var position;                
        if (node["currentStyle"]) {
            position = node["currentStyle"]["position"]; // IE
        }
        else if (window.getComputedStyle) {

            try {                
                var style = window.getComputedStyle(node,null);
                if (style) {
                    position = style.getPropertyValue("position");
                }
            }
            catch (e) {
                // getComputedStyle can throw an error if used on the wrong type of element/node
            }
        }
            
        if (position && (position == "fixed")) {
            debug("Warning: Canvas position fixed. Ignoring position alterations");
            return;
        }        
    }
    
    canv.style.position = "absolute";
    if (!yyGetBool(_center)) {
        // setup absolute position
        canv.style.left = yyGetInt32(_x) + "px";
        canv.style.top = yyGetInt32(_y) + "px";
        canv.style.bottom = "";
        canv.style.right = "";
        canv.style.transform = "";
    } else {
        // setup centered
        canv.style.top = "50%";
        canv.style.left = "50%";
        canv.style.bottom = "-50%";
        canv.style.right = "-50%";
        canv.style.transform = "translate(-50%, -50%)";
    }
    
        //document.write("div.display_canvas_center p {margin: 0;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%) }");

}

// #############################################################################################
/// Function:<summary>
///             Sets the size of the (client part of the) window to the indicated size. Note that 
///             is the indicated size is too small to fit the drawing region it is kept large enough 
///             for the region to fit it.
///          </summary>
///
/// In:		 <param name="_w"></param>
///			 <param name="_h"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_size(_w,_h) 
{
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

    canvas.width = _w;
    canvas.height = _h;
    g_OriginalWidth = _w;
    g_OriginalHeight = _h;
	DISPLAY_WIDTH=canvas.width;
	DISPLAY_HEIGHT=canvas.height;

    CalcCanvasLocation(canvas,g_CanvasRect);
    canvasMinY = g_CanvasRect.top;
    canvasMinX = g_CanvasRect.left;
    canvasMaxX = g_CanvasRect.right;
    canvasMaxY = g_CanvasRect.bottom;

	g_LastWidth=DISPLAY_WIDTH;
	g_LastHeight=DISPLAY_HEIGHT;
	g_DisplayWidth=_w;
	g_DisplayHeight=_h;
	g_DisplayScaleX=1;
	g_DisplayScaleY=1;    
}


// #############################################################################################
/// Function:<summary>
///             Sets the position and size of the window rectangle. 
///             (Does both previous routines in one step.)
///          </summary>
///
/// In:		 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_set_rectangle(_x,_y,_w,_h) 
{
    window_set_size(yyGetInt32(_w), yyGetInt32(_h));
    window_set_position(yyGetInt32(_x), yyGetInt32(_y), false);
}


// #############################################################################################
/// Function:<summary>
///             Centers the window on the screen.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_center() 
{
    var bw = GetBrowserWidth();
    var bh = GetBrowserHeight();
    var w = window_get_width();
    var h = window_get_height();
    
    var x= (bw-w)/2;
    var y= (bh-h)/2;
    
    window_set_position(x,y,true);    
}


// #############################################################################################
/// Function:<summary>
///             Gives the window the default size and position (centered) on the screen.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_default() 
{
    ErrorFunction("window_default()");
}


// #############################################################################################
/// Function:<summary>
///             Returns the current x-coordinate of the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_x() 
{
    return canvasMinX;
}


// #############################################################################################
/// Function:<summary>
///             Returns the current y-coordinate of the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_y() 
{
    return canvasMinY;
}


// #############################################################################################
/// Function:<summary>
///             Returns the current width of the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_width() 
{
    return canvasMaxX - canvasMinX;
}


// #############################################################################################
/// Function:<summary>
///             Returns the current height of the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_get_height() 
{
    return canvasMaxY - canvasMinY;
}

function  window_get_visible_rects()
{
  
}

// #############################################################################################
/// Function:<summary>
///             Returns the x-coordinate of the mouse in the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_mouse_get_x() 
{
    return g_EventMouseX;
}


// #############################################################################################
/// Function:<summary>
///             Returns the y-coordinate of the mouse in the window.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_mouse_get_y() 
{
    return g_EventMouseY;
}


// #############################################################################################
/// Function:<summary>
///             Sets the position of the mouse in the window to the indicated values.
///          </summary>
///
/// In:		 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_mouse_set(x,y) 
{
    ErrorFunction("window_mouse_set()");
}

// #############################################################################################
/// Function:<summary>
///             Hides the mouse cursor and locks it in place
///          </summary>
///
/// In:		 <param name="_enable"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function window_mouse_set_locked(_enable)
{
    if (_enable)
    {
        var _requestPointerLock = canvas.requestPointerLock
            || canvas.mozRequestPointerLock
            || canvas.webkitRequestPointerLock
            || canvas.msRequestPointerLock;
        
        if (!_requestPointerLock) return;
        
        var res = _requestPointerLock.call(canvas);
        if (res && res.then) res.catch(function () {});
    }
    else
    {
        var _exitPointerLock = document.exitPointerLock
            || document.mozExitPointerLock
            || document.webkitExitPointerLock
            || document.msExitPointerLock;
        
        if (!_exitPointerLock) return;
        
        var res = _exitPointerLock.call(document);
        if (res && res.then) res.catch(function () {});
    }
}

// #############################################################################################
/// Function:<summary>
///             Checks whether the mouse is locked in place
///          </summary>
///
/// Out:	 <returns>
///				True if the mouse is locked in place
///			 </returns>
// #############################################################################################
function window_mouse_get_locked()
{
	return g_MouseLocked;
}

// #############################################################################################
/// Out:	 <returns>
///				Returns how many pixels has the mouse moved on the x axis since the last frame
///			 </returns>
// #############################################################################################
function window_mouse_get_delta_x()
{
	return g_MouseDeltaX;
}

// #############################################################################################
/// Out:	 <returns>
///				Returns how many pixels has the mouse moved on the y axis since the last frame
///			 </returns>
// #############################################################################################
function window_mouse_get_delta_y()
{
	return g_MouseDeltaY;
}

// #############################################################################################
/// Function:<summary>
///          	 Returns the x-coordinate of the mouse with respect to the view with index id.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				The mouse x-coordinate based around the current view..
///			</returns>
// #############################################################################################
function window_view_mouse_get_x(_id) {

	if (!g_RunRoom.m_enableviews){
		return g_pBuiltIn.mouse_x;
	}

	var pView = g_RunRoom.m_Views[yyGetInt32(_id)];	
	return pView.GetMouseX(g_pIOManager.MouseX,g_pIOManager.MouseY);
	
	// For some reason g_pBuiltIn.mouse_x gets monkeyed with during HandleMouse() in Event.js so the following wasn't necessarily valid
	// return g_pBuiltIn.mouse_x - pView.portx;
}

// #############################################################################################
/// Function:<summary>
///          	 Returns the y-coordinate of the mouse with respect to the view with index id.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				The mouse y-coordinate based around the current view..
///			</returns>
// #############################################################################################
function window_view_mouse_get_y(_id) {

	if (!g_RunRoom.m_enableviews){
		return g_pBuiltIn.mouse_y;
	}

	var pView = g_RunRoom.m_Views[yyGetInt32(_id)];
    return pView.GetMouseY(g_pIOManager.MouseX,g_pIOManager.MouseY);
    
    // For some reason g_pBuiltIn.mouse_y gets monkeyed with during HandleMouse() in Event.js so the following wasn't necessarily valid
	// return g_pBuiltIn.mouse_y - pView.porty;
}

// #############################################################################################
/// Function:<summary>
///          	  Returns the x-coordinate of the mouse with respect to the view it is in
///          </summary>
// #############################################################################################
function window_views_mouse_get_x() {

    if (!g_RunRoom.m_enableviews){
		return g_pBuiltIn.mouse_x;
	}
		
	//reverse iterate for consistency with native runner
	//for (var i = 0; i < g_RunRoom.m_Views.length; i++)
	for (var i = g_RunRoom.m_Views.length-1; i >=0; --i)
	{	    
	    var pView = g_RunRoom.m_Views[i];
	    if (!pView.visible) {
	        continue;
	    }
	    
	    var mx = pView.GetMouseX(g_pIOManager.MouseX,g_pIOManager.MouseY);
	    var my = pView.GetMouseY(g_pIOManager.MouseX,g_pIOManager.MouseY);
	    // check that the results are within the view's region
	    if (((mx >= pView.worldx) && (mx < pView.worldx + pView.worldw)) &&
	        ((my >= pView.worldy) && (mx < pView.worldy + pView.worldh)))
	    {
	        return mx;
	    }
	}
    return window_view_mouse_get_x(0);
}

// #############################################################################################
/// Function:<summary>
///          	  Returns the y-coordinate of the mouse with respect to the view it is in
///          </summary>
// #############################################################################################
function window_views_mouse_get_y() {

    if (!g_RunRoom.m_enableviews){
		return g_pBuiltIn.mouse_y;
	}
	
	//reverse iterate for consistency with native runner
	//for (var i = 0; i < g_RunRoom.m_Views.length; i++)
	for (var i = g_RunRoom.m_Views.length-1; i >=0; --i)
	{
	    var pView = g_RunRoom.m_Views[i]; 
	    if (!pView.visible) {
	        continue;
	    }
	    
	    var mx = pView.GetMouseX(g_pIOManager.MouseX,g_pIOManager.MouseY);
	    var my = pView.GetMouseY(g_pIOManager.MouseX,g_pIOManager.MouseY);
	    // check that the results are within the view's region
	    if (((mx >= pView.worldx) && (mx < pView.worldx + pView.worldw)) &&
	        ((my >= pView.worldy) && (mx < pView.worldy + pView.worldh)))
	    {
	        return my;
	    }
	}
    return window_view_mouse_get_y(0);
}