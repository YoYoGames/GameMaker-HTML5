
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyBuiltIn.js
// Created:         19/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Deals with all built in variables
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 19/02/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Create a set of built in variables
///          </summary>
// #############################################################################################
/** @constructor */
function    yyBuiltIn()
{
    // global variables
    this.__type = "[BuiltIn]";
    this.room = 0;
    this.room_first = 0;
    this.room_last = 0;
    this.transition_kind = 0;
    this.transition_steps = 0;
    this.score = 0;
    this.lives = 0;
    this.health = 100;
    this.game_id = 0;
    this.working_directory = "/";
    this.temp_directory = "/";
    this.program_directory = "/";
    this.delta_time = 0;
    this.last_time = 0;

    // room parameters
    this.room_width = 0;
    this.room_height = 0;
    this.room_caption = "room";
    this.room_speed = 30;
    this.room_persistent = false;
    
    this.background_color = 0x00000000;
    this.background_showcolor = false;
    this.background_visible = false;
    this.background_foreground = false;
    this.background_index = 0;
    this.background_x = 0;
    this.background_y = 0;
    this.background_width = 0;
    this.background_height = 0;
    this.background_htiled = 0;
    this.background_vtiled = 0;
    this.background_xscale = 1.0;
    this.background_yscale = 1.0;
    this.background_hspeed = 0;
    this.background_vspeed = 0;
    this.background_blend = 0;
    this.background_alpha = 1.0;

    this.view_enabled = false;
    this.view_current = 0;
    this.view_visible = 0;
    this.view_xview = 0;
    this.view_yview = 0;
    this.view_wview = 0;
    this.view_hview = 0;
    this.view_xport = 0;
    this.view_yport = 0;
    this.view_wport = 0;
    this.view_hport = 0;
    this.view_angle = 0;
    this.view_hborder = 0;
    this.view_vborder = 0;
    this.view_hspeed = 0;
    this.view_vspeed = 0;
    this.view_object = 0;

    // interaction values
    this.mouse_x = 0;
    this.mouse_y = 0;
    this.mouse_button = 0;
    this.mouse_lastbutton = 0;
    this.keyboard_key = 0;
    this.keyboard_lastkey = 0;
    this.keyboard_lastchar = "";
    this.keyboard_string = "";
    this.webgl_enabled = false;

    // others    
    this.show_score = false;
    this.show_lives = false;
    this.show_health = false;
    this.caption_score = "score";
    this.caption_lives = "lives";
    this.caption_health = "health";
    this.fps = 0;
    this.fps_real = 0;
    this.current_time = 0;
    this.current_year = 0;
    this.current_month = 0;
    this.current_day = 0;
    this.current_weekday = 0;
    this.current_hour = 0;
    this.current_minute = 0;
    this.current_second = 0;

    // event related
    this.event_action = 0;

    // special
    this.secure_mode = 0;
    this.error_occurred = 0;
    this.error_last = 0;
    this.gamemaker_registered = true;
    this.gamemaker_pro = true;
    this.gamemaker_version = 8.2;

    this.async_load = -1;
    this.event_data = -1;
    this.iap_event_data = -1;
    this.debug_mode = false;

    this.application_surface = -1;

    this.view_visible = [];
    this.view_xview = [];
    this.view_yview = [];
    this.view_wview = [];
    this.view_hview = [];
    this.view_xport = [];
    this.view_yport = [];
    this.view_wport = [];
    this.view_hport = [];
    this.view_angle = [];
    this.view_hborder = [];
    this.view_vborder = [];
    this.view_hspeed = [];
    this.view_vspeed = [];
    this.view_object = [];
    this.view_surface_id = [];
    this.view_camera = [];

    this.background_visible = [];
    this.background_foreground = [];
    this.background_index = [];
    this.background_x = [];
    this.background_y = [];
    this.background_width = [];
    this.background_height = [];
    this.background_htiled = [];
    this.background_vtiled = [];
    this.background_xscale = [];
    this.background_yscale = [];
    this.background_hspeed = [];
    this.background_vspeed = [];
    this.background_blend = [];
    this.background_alpha = [];

    

}

yyBuiltIn.prototype.get_argument_relative = function(_index){ return Argument_Relative; };
yyBuiltIn.prototype.get_instance_id = function(_index){ return g_RunRoom.m_Active.Get(_index).id; };
yyBuiltIn.prototype.get_instance_count = function () { return g_RunRoom.m_Active.length; };

yyBuiltIn.prototype.set_view_enable = function (_onoff) { g_RunRoom.m_enableviews = yyGetBool(_onoff); };
yyBuiltIn.prototype.get_view_enable = function () { return g_RunRoom.m_enableviews; };

yyBuiltIn.prototype.get_browser_width = function () { return GetBrowserWidth(); };
yyBuiltIn.prototype.get_browser_height = function () { return GetBrowserHeight(); };

yyBuiltIn.prototype.get_delta_time = function () { return this.delta_time; };


yyBuiltIn.prototype.get_os_type = function () { return g_OSPlatform; };   //{ return YoYo_GetPlatform(); };
yyBuiltIn.prototype.get_os_device = function () { return YoYo_GetDevice(); };
yyBuiltIn.prototype.get_os_browser = function () { return YoYo_GetBrowser(); };
yyBuiltIn.prototype.get_os_version = function () { return YoYo_GetVersion(); };
yyBuiltIn.prototype.get_async_load = function () { return this.async_load; };
yyBuiltIn.prototype.get_event_data = function () { return this.event_data; };
yyBuiltIn.prototype.get_display_aa = function () { return 0; };
yyBuiltIn.prototype.get_iap_data = function () { return this.iap_event_data; };

yyBuiltIn.prototype.set_current_room = function (_room) { room_goto(yyGetInt32(_room)); };
yyBuiltIn.prototype.get_current_room = function () { return g_RunRoom.id; };

yyBuiltIn.prototype.setbackground_color = function (_val) { g_RunRoom.m_color = this.background_color = yyGetInt32(_val); };
yyBuiltIn.prototype.getbackground_color = function () { return this.background_color; };

yyBuiltIn.prototype.get_application_surface = function() { return g_pBuiltIn.application_surface; };

yyBuiltIn.prototype.set_view_visible = function (_val) { g_pBuiltIn.view_visible[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_xview = function (_val) { g_pBuiltIn.view_xview[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_yview = function (_val) { g_pBuiltIn.view_yview[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_wview = function (_val) { g_pBuiltIn.view_wview[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_hview = function (_val) { g_pBuiltIn.view_hview[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_xport = function (_val) { g_pBuiltIn.view_xport[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_yport = function (_val) { g_pBuiltIn.view_yport[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_wport = function (_val) { g_pBuiltIn.view_wport[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_hport = function (_val) { g_pBuiltIn.view_hport[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_angle = function (_val) { g_pBuiltIn.view_angle[0] = _val; };
yyBuiltIn.prototype.set_view_hborder = function (_val) { g_pBuiltIn.view_hborder[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_vborder = function (_val) { g_pBuiltIn.view_vborder[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_hspeed = function (_val) { g_pBuiltIn.view_hspeed[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_vspeed = function (_val) { g_pBuiltIn.view_vspeed[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_object = function (_val) { g_pBuiltIn.view_object[0] = ~ ~_val; };
yyBuiltIn.prototype.set_view_surface_id = function (_val) { g_pBuiltIn.view_surface_id[0] = ~ ~_val; };


yyBuiltIn.prototype.get_view_visible = function (_val) { return g_pBuiltIn.view_visible[0]; };
yyBuiltIn.prototype.get_view_xview = function (_val) { return g_pBuiltIn.view_xview[0]; };
yyBuiltIn.prototype.get_view_yview = function (_val) { return g_pBuiltIn.view_yview[0]; };
yyBuiltIn.prototype.get_view_wview = function (_val) { return g_pBuiltIn.view_wview[0]; };
yyBuiltIn.prototype.get_view_hview = function (_val) { return g_pBuiltIn.view_hview[0]; };
yyBuiltIn.prototype.get_view_xport = function (_val) { return g_pBuiltIn.view_xport[0]; };
yyBuiltIn.prototype.get_view_yport = function (_val) { return g_pBuiltIn.view_yport[0]; };
yyBuiltIn.prototype.get_view_wport = function (_val) { return g_pBuiltIn.view_wport[0]; };
yyBuiltIn.prototype.get_view_hport = function (_val) { return g_pBuiltIn.view_hport[0]; };
yyBuiltIn.prototype.get_view_angle = function (_val) { return g_pBuiltIn.view_angle[0]; };
yyBuiltIn.prototype.get_view_hborder = function (_val) { return g_pBuiltIn.view_hborder[0]; };
yyBuiltIn.prototype.get_view_vborder = function (_val) { return g_pBuiltIn.view_vborder[0]; };
yyBuiltIn.prototype.get_view_hspeed = function (_val) { return g_pBuiltIn.view_hspeed[0]; };
yyBuiltIn.prototype.get_view_vspeed = function (_val) { return g_pBuiltIn.view_vspeed[0]; };
yyBuiltIn.prototype.get_view_object = function (_val) { return g_pBuiltIn.view_object[0]; };
yyBuiltIn.prototype.get_view_surface_id = function (_val) { return g_pBuiltIn.view_surface_id[0]; };

yyBuiltIn.prototype.set_view_camera = function(_val) {g_pBuiltIn.view_camera[0] = _val;};
yyBuiltIn.prototype.get_view_camera = function(_val) {return g_pBuiltIn.view_camera[0];};


yyBuiltIn.prototype.setbackground_visible = function (_val) { g_pBuiltIn.background_visible[0] = _val; };
yyBuiltIn.prototype.sebackground_foreground = function (_val) { g_pBuiltIn.background_foreground[0] = _val; };
yyBuiltIn.prototype.setbackground_index = function (_val) { g_pBuiltIn.background_index[0] = _val; };
yyBuiltIn.prototype.setbackground_x = function (_val) { g_pBuiltIn.background_x[0] = ~ ~_val; };
yyBuiltIn.prototype.setbackground_y = function (_val) { g_pBuiltIn.background_y[0] = ~ ~_val; };
yyBuiltIn.prototype.setbackground_width = function (_val) { g_pBuiltIn.background_width[0] = ~ ~_val; };
yyBuiltIn.prototype.setbackground_height = function (_val) { g_pBuiltIn.background_height[0] = ~ ~_val; };
yyBuiltIn.prototype.setbackground_htiled = function (_val) { g_pBuiltIn.background_htiled[0] = _val; };
yyBuiltIn.prototype.setbackground_vtiled = function (_val) { g_pBuiltIn.background_vtiled[0] = _val; };
yyBuiltIn.prototype.setbackground_xscale = function (_val) { g_pBuiltIn.background_xscale[0] = _val; };
yyBuiltIn.prototype.setbackground_yscale = function (_val) { g_pBuiltIn.background_yscale[0] = _val; };
yyBuiltIn.prototype.setbackground_hspeed = function (_val) { g_pBuiltIn.background_hspeed[0] = _val; };
yyBuiltIn.prototype.setbackground_vspeed = function (_val) { g_pBuiltIn.background_vspeed[0] = _val; };
yyBuiltIn.prototype.setbackground_blend = function (_val) { g_pBuiltIn.background_blend[0] = _val & 0xffffff; };

yyBuiltIn.prototype.setbackground_showcolor = function (_val) { g_RunRoom.m_showcolor = yyGetBool(_val); };
yyBuiltIn.prototype.getbackground_showcolor = function (_val) { return g_RunRoom.m_showcolor; };

yyBuiltIn.prototype.setbackground_alpha = function (_val) {
	if (_val < 0) _val = 0;
	if (_val > 1) _val = 1;
	g_pBuiltIn.background_alpha[0] = _val;
};

yyBuiltIn.prototype.getbackground_visible = function () { return g_pBuiltIn.background_visible[0]; };
yyBuiltIn.prototype.gebackground_foreground = function () { return g_pBuiltIn.background_foreground[0]; };
yyBuiltIn.prototype.getbackground_index = function () { return g_pBuiltIn.background_index[0]; };
yyBuiltIn.prototype.getbackground_x = function () { return g_pBuiltIn.background_x[0]; };
yyBuiltIn.prototype.getbackground_y = function () { return g_pBuiltIn.background_y[0]; };
yyBuiltIn.prototype.getbackground_width = function () { return g_pBuiltIn.background_width[0]; };
yyBuiltIn.prototype.getbackground_height = function () { return g_pBuiltIn.background_height[0]; };
yyBuiltIn.prototype.getbackground_htiled = function () { return g_pBuiltIn.background_htiled[0]; };
yyBuiltIn.prototype.getbackground_vtiled = function () { return g_pBuiltIn.background_vtiled[0]; };
yyBuiltIn.prototype.getbackground_xscale = function () { return g_pBuiltIn.background_xscale[0]; };
yyBuiltIn.prototype.getbackground_yscale = function () { return g_pBuiltIn.background_yscale[0]; };
yyBuiltIn.prototype.getbackground_hspeed = function () { return g_pBuiltIn.background_hspeed[0]; };
yyBuiltIn.prototype.getbackground_vspeed = function () { return g_pBuiltIn.background_vspeed[0]; };
yyBuiltIn.prototype.getbackground_blend = function () { return g_pBuiltIn.background_blend[0]; };
yyBuiltIn.prototype.getbackground_alpha = function () { return g_pBuiltIn.background_alpha[0]; };


yyBuiltIn.prototype.set_room_speed = function (_val) { _val = yyGetReal(_val); if (g_isZeus) { return g_GameTimer.SetFrameRate(_val); } else { return g_RunRoom.SetSpeed(_val); } };
yyBuiltIn.prototype.get_room_speed = function (_val) { if (g_isZeus) { return g_GameTimer.GetFPS(_val); } else { return g_RunRoom.m_speed; } };

yyBuiltIn.prototype.set_room_caption = function (_val) { return g_RunRoom.SetCaption(yyGetString(_val)); };
yyBuiltIn.prototype.set_room_width = function (_val) { return g_RunRoom.SetWidth(yyGetReal(_val)); };
yyBuiltIn.prototype.set_room_height = function (_val) { return g_RunRoom.SetHeight(yyGetReal(_val)); };
yyBuiltIn.prototype.set_room_persistent = function (_val) { return g_RunRoom.SetPersistent(yyGetBool(_val)); };

yyBuiltIn.prototype.set_cursor_sprite = function (_val) { g_CurrentCursor = _val; };
yyBuiltIn.prototype.get_cursor_sprite = function () { return g_CurrentCursor; };

yyBuiltIn.prototype.get_current_time = function() { var t = get_timer(); return ~~(t/1000); };
yyBuiltIn.prototype.get_current_year = function() { var d = new Date(); return (g_bLocalTime) ? d.getFullYear() : d.getUTCFullYear(); };
yyBuiltIn.prototype.get_current_month = function() { var d = new Date(); return (g_bLocalTime) ? d.getMonth()+1 : d.getUTCMonth()+1; };
yyBuiltIn.prototype.get_current_day = function() { var d = new Date(); return (g_bLocalTime) ? d.getDate() : d.getUTCDate(); };
yyBuiltIn.prototype.get_current_weekday = function() { var d = new Date(); return (g_bLocalTime) ? d.getDay() : d.getUTCDay(); };
yyBuiltIn.prototype.get_current_hour = function() { var d = new Date(); return (g_bLocalTime) ? d.getHours() : d.getUTCHours(); };
yyBuiltIn.prototype.get_current_minute = function() { var d = new Date(); return (g_bLocalTime) ? d.getMinutes() : d.getUTCMinutes(); };
yyBuiltIn.prototype.get_current_second = function() { var d = new Date(); return (g_bLocalTime) ? d.getSeconds() : d.getUTCSeconds(); };

yyBuiltIn.prototype.get_current_event_type = function () { return ConvertEvent(Current_Event_Type); };
yyBuiltIn.prototype.get_current_event_number = function () { return ConvertSubEvent(Current_Event_Type,Current_Event_Number); };
yyBuiltIn.prototype.get_current_event_object = function () { return Current_Object.ID; };



yyBuiltIn.prototype.set_lives_function = function ( _lives ) 
{
	var oldlives = this.lives;
	this.lives = Round(yyGetReal(_lives));
	if ((oldlives > 0) && (this.lives <= 0))
	{
		g_pInstanceManager.PerformEvent(EVENT_OTHER_NOLIVES, 0);
	}
};


yyBuiltIn.prototype.set_health_function = function (_health ) {
	var oldhealth = 0.0;

	oldhealth = this.health;
	this.health = yyGetReal(_health);

	if ((oldhealth > 0) && (this.health <= 0))
	{
		g_pInstanceManager.PerformEvent(EVENT_OTHER_NOHEALTH, 0);
	}
};

yyBuiltIn.prototype.get_mouse_x = function () {
    //#29683 recalculate this value (as c++ runner) to reflect updates in views/cameras
    return window_views_mouse_get_x();
};

yyBuiltIn.prototype.get_mouse_y = function () {
    return window_views_mouse_get_y();
};


// #############################################################################################
/// Function:<summary>
///             Copy ALL built in variables
///          </summary>
///
/// In:		 <param name="_pBuiltIn">Class to clone</param>
// #############################################################################################
yyBuiltIn.prototype.Copy = function (_pBuiltIn) {

	// Copy everything!!	
	for (var v = 0; v < _pBuiltIn.length; v++)
	{
		var p = _pBuiltIn[v];
		this[v] = p;
	}
};