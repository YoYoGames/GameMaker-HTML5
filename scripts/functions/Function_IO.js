
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_IO.js
// Created:         19/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Deals with Game Maker IO
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 19/02/2011		V1.0        MJD     1st version
//                                      Mouse functions added
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Simulates a press of the key with the indicated keycode.
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_key_press(_key)
{
    _key = yyGetInt32(_key);

    // Violating DRY by ripping out of yyKeyDownCallback, however, throwing a keydown event, as Win32 does, is really messy
    // See: http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/14561303#14561303
    if( g_KeyDown[_key]  ) {
        return;      // MUST be a repeat.
    }
    g_KeyDown[_key] = 1;
    g_KeyPressed[_key] = 1;
    g_LastKeyPressed_code = _key;
}

// #############################################################################################
/// Function:<summary>
///             Simulates a release of the key with the indicated keycode.
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_key_release(_key)
{
    _key = yyGetInt32(_key);
    // See keyboard_key_press
    g_KeyUp[_key] = 1;
    g_KeyDown[_key] = 0;    
}

// #############################################################################################
/// Function:<summary>
///             Check mouse buttons
///          </summary>
///
/// In:		 <param name="_num">0=none,-1=any, 1=LMB, 2=RMB or 3=MBM</param>
/// Out:	 <returns>
///				0 for none, 1 for down.
///			 </returns>
// #############################################################################################
function mouse_check( _num )
{
   // with(g_pIOManager)
    {
        switch(yyGetInt32(_num)){
            case 0: if (g_pIOManager.m_DoMouseButton == 0) return 0; else return 1;
            case 1: if ((g_pIOManager.m_DoMouseButton & 1) == 0) return 0; else return 1;
            case 2: if ((g_pIOManager.m_DoMouseButton & 2) == 0) return 0; else return 1;
            case 3: if ((g_pIOManager.m_DoMouseButton & 4) == 0) return 0; else return 1;
            case -1: if (g_pIOManager.m_DoMouseButton == 0) return 1; else return 0;
        }
    }
    return 0;
}

// #############################################################################################
/// Function:<summary>
///             Check mouse button pressed
///          </summary>
///
/// In:		 <param name="_num">0=none,-1=any, 1=LMB, 2=RMB or 3=MBM</param>
/// Out:	 <returns>
///				0 for none, 1 for pressed.
///			 </returns>
// #############################################################################################
function mouse_check_button( _num )
{
    //with(g_pIOManager)
    {
        switch (yyGetInt32(_num)) {
            case 0: if (g_pIOManager.ButtonDown[0] || g_pIOManager.ButtonDown[1] || g_pIOManager.ButtonDown[2] || g_pIOManager.ButtonDown[3] || g_pIOManager.ButtonDown[4]) return 0; else return 1;
            case 1: if (g_pIOManager.ButtonDown[0]) return 1; else return 0;
            case 2: if (g_pIOManager.ButtonDown[1]) return 1; else return 0;
            case 3: if (g_pIOManager.ButtonDown[2]) return 1; else return 0;
            case 4: if (g_pIOManager.ButtonDown[3]) return 1; else return 0;
            case 5: if (g_pIOManager.ButtonDown[4]) return 1; else return 0;
            case -1: if (g_pIOManager.ButtonDown[0] || g_pIOManager.ButtonDown[1] || g_pIOManager.ButtonDown[2] || g_pIOManager.ButtonDown[3] || g_pIOManager.ButtonDown[4]) return 1; else return 0;
        }
    }
    return 0;
}


// #############################################################################################
/// Function:<summary>
///             Check mouse button pressed
///          </summary>
///
/// In:		 <param name="_num">0=none,-1=any, 1=LMB, 2=RMB or 3=MBM</param>
/// Out:	 <returns>
///				0 for none, 1 for pressed.
///			 </returns>
// #############################################################################################
function mouse_check_button_pressed( _num )
{
   // with(g_pIOManager)
    {
        switch (yyGetInt32(_num)) {
            case 0: if (g_pIOManager.ButtonPressed[0] || g_pIOManager.ButtonPressed[1] || g_pIOManager.ButtonPressed[2] || g_pIOManager.ButtonPressed[3] || g_pIOManager.ButtonPressed[4]) return 0; else return 1;
            case 1: if (g_pIOManager.ButtonPressed[0]) return 1; else return 0;
            case 2: if (g_pIOManager.ButtonPressed[1]) return 1; else return 0;
            case 3: if (g_pIOManager.ButtonPressed[2]) return 1; else return 0;
            case 4: if (g_pIOManager.ButtonPressed[3]) return 1; else return 0;
            case 5: if (g_pIOManager.ButtonPressed[4]) return 1; else return 0;
            case -1: if (g_pIOManager.ButtonPressed[0] || g_pIOManager.ButtonPressed[1] || g_pIOManager.ButtonPressed[2] || g_pIOManager.ButtonPressed[3] || g_pIOManager.ButtonPressed[4]) return 1; else return 0;
        }
    }
    return 0;
}

// #############################################################################################
/// Function:<summary>
///             Check mouse button released
///          </summary>
///
/// In:		 <param name="_num">0=none,-1=any, 1=LMB, 2=RMB or 3=MBM</param>
/// Out:	 <returns>
///				0 for none, 1 for pressed.
///			 </returns>
// #############################################################################################
function mouse_check_button_released( _num )
{
    //with(g_pIOManager)
    {
        switch (yyGetInt32(_num)) {
            case 0: if (g_pIOManager.ButtonReleased[0] || g_pIOManager.ButtonReleased[1] || g_pIOManager.ButtonReleased[2] || g_pIOManager.ButtonReleased[3] || g_pIOManager.ButtonReleased[4]) return 0; else return 1;
            case 1: if (g_pIOManager.ButtonReleased[0]) return 1; else return 0;
            case 2: if (g_pIOManager.ButtonReleased[1]) return 1; else return 0;
            case 3: if (g_pIOManager.ButtonReleased[2]) return 1; else return 0;
            case 4: if (g_pIOManager.ButtonReleased[3]) return 1; else return 0;
            case 5: if (g_pIOManager.ButtonReleased[4]) return 1; else return 0;
            case -1: if (g_pIOManager.ButtonReleased[0] || g_pIOManager.ButtonReleased[1] || g_pIOManager.ButtonReleased[2] || g_pIOManager.ButtonReleased[3] || g_pIOManager.ButtonReleased[4]) return 1; else return 0;
        }
        return 0;
    }
}

// #############################################################################################
/// Function:<summary>
///             Not yet supported
///          </summary>
// #############################################################################################
function mouse_wheel_up()
{
	return g_MouseUP;
}

// #############################################################################################
/// Function:<summary>
///             Not yet supported
///          </summary>
// #############################################################################################
function mouse_wheel_down()
{
    return g_MouseDOWN;
}


// #############################################################################################
/// Function:<summary>
///             Clear mouse pressed button
///          </summary>
// #############################################################################################
function mouse_clear( _button ) 
{
    _button = yyGetInt32(_button);

    if (_button == -1) {
        mouse_clear(1);
        mouse_clear(2);
        mouse_clear(3);
    } else if (_button >= 1 && _button <= 3) {
        var i = _button - 1;
        g_pIOManager.ButtonDown[i] = 0;
        g_pIOManager.ButtonPressed[i] = 0;
        g_pIOManager.ButtonReleased[i] = 0;
        g_EventButtons &= ~(1 << i);
    }
}


// #############################################################################################
/// Function:<summary>
///             Clear mouse pressed button
///          </summary>
// #############################################################################################
function    io_clear( ) 
{
    g_pIOManager.Clear();
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the key with the particular keycode is currently down.
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_check(_key) {
    return g_pIOManager.KeyDown[yyGetInt32(_key)];
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the key with the particular keycode was pressed since the last step.
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_check_pressed(_key)
{
    return g_pIOManager.KeyPressed[yyGetInt32(_key)];
}

// #############################################################################################
/// Function:<summary>
///             Clears the state of the key. This means that it will no longer generate keyboard #
///             events until it starts repeating.
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_clear(_key)
{
    _key = yyGetInt32(_key);
    g_pIOManager.KeyDown[_key] = false; 
    g_pIOManager.KeyPressed[_key] = false;
    g_pIOManager.KeyReleased[_key] = false;
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the key with the particular keycode was released since the last step.
///          </summary>
///
/// In:		 <param name="key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_check_released(_key) 
{
    return g_pIOManager.KeyReleased[yyGetInt32(_key)];
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the key with the particular keycode is pressed by checking the 
///             hardware directly. The result is independent of which application has focus. 
///             It allows for a few more checks. In particular you can use keycodes vk_lshift, 
///             vk_lcontrol, vk_lalt, vk_rshift, vk_rcontrol and vk_ralt to check whether the 
///             left or right shift, control or alt key is pressed.
///          </summary>
///
/// In:		 <param name="key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function keyboard_check_direct(_key) 
{
    return g_pIOManager.KeyDown[yyGetInt32(_key)];
}

// #############################################################################################
/// Function:<summary>
///          	Gets the absolute mouse "X" on the canvas.
///          </summary>
///
/// Out:	<returns>
///				The real mouse X
///			</returns>
// #############################################################################################
function display_mouse_get_x()
{
    return (g_pIOManager.MouseX - g_CanvasRect.left);    
    // For some reason g_pBuiltIn.mouse_x gets monkeyed with during HandleMouse() in Event.js so the following isn't necessarily valid
    // return g_pBuiltIn.mouse_x;
}

// #############################################################################################
/// Function:<summary>
///          	Gets the absolute mouse "Y" on the canvas.
///          </summary>
///
/// Out:	<returns>
///				The real mouse Y
///			</returns>
// #############################################################################################
function display_mouse_get_y()
{
    return (g_pIOManager.MouseY - g_CanvasRect.top);
    // For some reason g_pBuiltIn.mouse_y gets monkeyed with during HandleMouse() in Event.js so the following isn't necessarily valid
    // return g_pBuiltIn.mouse_y;
}


// #############################################################################################
/// Function:<summary>
///          	Maps a key to another one
///          </summary>
///
/// In:		<param name="_from">Map THIS key</param>
///			<param name="_to">TO this key</param>
/// Out:	<returns>
///				none
///			</returns>
// #############################################################################################
function keyboard_set_map(_from, _to) {
    _from = yyGetInt32(_from);
    _to = yyGetInt32(_to);

	if(( _from<0) || (_from>MAX_KEYS )) return 0;
	if ((_to < 0) || (_to > MAX_KEYS)) return 0;
	g_pIOManager.KeyMap[_from] = _to;
}

// #############################################################################################
/// Function:<summary>
///          	Get the current mapping of a key
///          </summary>
///
/// In:		<param name="_key">Key to get mapping of</param>
/// Out:	<returns>
///				The key's mapping
///			</returns>
// #############################################################################################
function keyboard_get_map(_key) {
    _key = yyGetInt32(_key);

	if ((_key < 0) || (_key > MAX_KEYS)) return 0;
	return g_pIOManager.KeyMap[_key];
}

// #############################################################################################
/// Function:<summary>
///          	Clear the keyboad mapping
///          </summary>
// #############################################################################################
function keyboard_unset_map()
{
	for (var l = 0; l < MAX_KEYS; l++)
	{
		g_pIOManager.KeyMap[l] = l;
	}
}

function keyboard_virtual_show() {
    ErrorFunction("keyboard_virtual_show()");
}

function keyboard_virtual_hide() {
    ErrorFunction("keyboard_virtual_hide()");
}
function keyboard_virtual_status() {
    ErrorFunction("keyboard_virtual_status()");
}
function keyboard_virtual_height() {
    ErrorFunction("keyboard_virtual_height()");
}
// Gesture stub functions
function gesture_drag_time(_val)
{

}

function gesture_drag_distance(_val)
{

}

function gesture_flick_speed(_val)
{

}

function gesture_double_tap_time(_val)
{

}

function gesture_double_tap_distance(_val)
{

}

function gesture_pinch_distance(_val)
{

}

function gesture_pinch_angle_towards(_val)
{

}

function gesture_pinch_angle_away(_val)
{

}

function gesture_rotate_time(_val)
{

}

function gesture_rotate_angle(_val)
{

}

function gesture_tap_count(_val)
{

}

function gesture_get_drag_time()
{

}

function gesture_get_drag_distance()
{

}

function gesture_get_flick_speed()
{

}

function gesture_get_double_tap_time()
{

}

function gesture_get_double_tap_distance()
{

}

function gesture_get_pinch_distance()
{

}

function gesture_get_pinch_angle_towards()
{

}

function gesture_get_pinch_angle_away()
{

}

function gesture_get_rotate_time()
{

}

function gesture_get_rotate_angle()
{

}

function gesture_get_tap_count()
{

}
