// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Unsupported.js
// Created:         25/09/2011
// Author:          Mike
// Project:         HTML5
// Description:     Holds the functions we do not support...
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/05/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************


// Scripts
function execute_string()			{ ErrorFunction("execute_string()");}
function execute_file()				{ ErrorFunction("execute_file()");}
function show_info()				{ ErrorFunction("show_info()");}
function load_info(fname)           { ErrorFunction("load_info()");}
function script_get_text(ind)		{ ErrorFunction("script_get_text()"); }
function game_save(name)			{ ErrorFunction("game_save()"); }
function game_load(name)			{ ErrorFunction("game_load()"); }
function game_save_buffer(buffer)	{ ErrorFunction("game_save_buffer()"); }
function game_load_buffer(buffer)	{ ErrorFunction("game_load_buffer()"); }


// Splash screens
function splash_show_video(fname,loop)      { ErrorFunction("splash_show_video()"); }
function splash_show_text(fname,delay)      { ErrorFunction("splash_show_text()"); }
function splash_show_image(fname,delay)     { ErrorFunction("splash_show_image()"); }
function splash_show_web(url,delay)         { ErrorFunction("splash_show_web()"); }
function splash_set_main(main)              { ErrorFunction("splash_set_main()"); }
function splash_set_scale(scale)            { ErrorFunction("splash_set_scale()"); }
function splash_set_cursor(vis)             { ErrorFunction("splash_set_cursor()"); }
function splash_set_color(col)              { ErrorFunction("splash_set_color()"); }
var splash_set_colour = splash_set_color;
function splash_set_caption(cap)            { ErrorFunction("splash_set_caption()"); }
function splash_set_fullscreen(full)        { ErrorFunction("splash_set_fullscreen()"); }
function splash_set_border(border)          { ErrorFunction("splash_set_border()"); }
function splash_set_size(w,h)               { ErrorFunction("splash_set_size()"); }
function splash_set_position(x,y)           { ErrorFunction("splash_set_position()"); }
function splash_set_adapt(adapt)            { ErrorFunction("splash_set_adapt()"); }
function splash_set_top(top)                { ErrorFunction("splash_set_top()"); }
function splash_set_interrupt(interrupt)    { ErrorFunction("splash_set_interrupt()"); }
function splash_set_stop_key(stop)          { ErrorFunction("splash_set_stop_key()"); }
function splash_set_stop_mouse(stop)        { ErrorFunction("splash_set_stop_mouse()"); }
function splash_set_close_button(show)      { ErrorFunction("splash_set_close_button()"); }
function os_set_orientation_lock()			{ ErrorFunction("os_set_orientation_lock()"); }

// general
function screen_redraw()                            {ErrorFunction("screen_redraw()");}
function screen_refresh()                           {ErrorFunction("screen_refresh()");}
function set_automatic_draw(value)                  {ErrorFunction("set_automatic_draw()");}
function set_synchronization(value)                 {ErrorFunction("set_synchronization()");}
function screen_wait_vsync()                        {ErrorFunction("screen_wait_vsync()");}
function window_set_region_size(w,h,adaptwindow)    {ErrorFunction("window_set_region_size()");}
function window_get_region_width()                  {ErrorFunction("window_get_region_width()");}
function window_get_region_height()                 {ErrorFunction("window_get_region_height()");}
function screen_save(fname)                         {MissingFunction("screen_save()");}
function screen_save_part(fname,x,y,w,h)            {MissingFunction("screen_save_part()");}
function transition_define(kind,name)               {MissingFunction("transition_define()");}
function transition_exists(kind)                    {MissingFunction("transition_exists()");}

function display_get_colordepth()                   {ErrorFunction("display_get_colordepth()");}
function display_get_frequency()                    {ErrorFunction("display_get_frequency()");}
function display_set_size(w,h)                      {ErrorFunction("display_set_size()");}
function display_set_colordepth(coldepth)           {ErrorFunction("display_set_colordepth()");}
function display_set_frequency(frequency)           {ErrorFunction("display_set_frequency()");}
function display_set_all(w,h,frequency,coldepth)    {ErrorFunction("display_set_all()");}
function display_test_all(w,h,frequency,coldepth)   {ErrorFunction("display_test_all()");}
function display_reset(AA)                          {ErrorFunction("display_reset()");}
function display_mouse_set(x,y)                     {ErrorFunction("display_mouse_set()");}


// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

var g_Clipboard = [];
var g_ClipboardActive = false;
var g_ActivatingClipboard = false;

function activate_clipboard()
{
	// if we support clipboard
	if (!g_ClipboardActive && navigator.clipboard) {

		if (!g_ActivatingClipboard) {

			g_ActivatingClipboard = true;
			// get permission first for clipboard
			navigator.permissions.query( { "name": 'clipboard-read', "allowWithoutGesture": true}).then( function(result) {

				if ((result.state == 'granted') || (result.state == 'prompt')) {

					// flag that clipboard is active and 
					g_ClipboardActive = true;
					g_ActivatingClipboard = false;

					// empty out everything that we have accumulated on the GM Clipboard into the main clipboard
					for( var n =0; n<g_Clipboard.length; ++n) {
						navigator.clipboard.writeText( g_Clipboard[n]);
					} // end for
					g_Clipboard = [];

					// setup to read text from clipboard
					navigator.clipboard.readText().then( clipText => { if (clipText != "") g_Clipboard.push( clipText ); } ).catch( () => {} );

				} // end if

			});
		} // end if
	} // end if
} // end activate_clipboard

function clipboard_has_text() { 
	if (!g_ClipboardActive) {
		activate_clipboard();
		return false;
	} // end if
	navigator.clipboard.readText().then( clipText => { if (clipText != "") g_Clipboard.push( clipText ); } ).catch( () => {} );
	return g_Clipboard.length > 0; 
}

function clipboard_get_text() {
	var ret = "";
	if (!g_ClipboardActive) {
		activate_clipboard();
	} // end if
	else
	if (g_Clipboard.length > 0) {
		ret = g_Clipboard.pop();
	} // end if
	return ret;
}

function clipboard_set_text(str) {
	var textToCopy = yyGetString(str);
	if (!g_ClipboardActive) {
		activate_clipboard();
		g_Clipboard.push( textToCopy );
	} // end if
	else {
		if (navigator.clipboard)
			navigator.clipboard.writeText(textToCopy);
	} // end else
}

// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

function set_program_priority(priority)             {MissingFunction("set_program_priority()");}




// IO
function joystick_exists(id)                        { return false; }
function joystick_name(id)                          {ErrorFunction("joystick_name()");}
function joystick_axes(id)                          {ErrorFunction("joystick_axes()");}
function joystick_buttons(id)                       {ErrorFunction("joystick_buttons()");}
function joystick_has_pov(id)                       {ErrorFunction("joystick_has_pov()");}
function joystick_direction(id)                     {ErrorFunction("joystick_direction()");}
function joystick_check_button(id,numb)             {ErrorFunction("joystick_check_button()");}
function joystick_xpos(id)                          {ErrorFunction("joystick_xpos()");}
function joystick_ypos(id)                          {ErrorFunction("joystick_ypos()");}
function joystick_zpos(id)                          {ErrorFunction("joystick_zpos()");}
function joystick_rpos(id)                          {ErrorFunction("joystick_rpos()");}
function joystick_upos(id)                          {ErrorFunction("joystick_upos()");}
function joystick_vpos(id)                          {ErrorFunction("joystick_vpos()");}
function joystick_pov(id)                           {ErrorFunction("joystick_pov()");}

function io_handle( )                               {ErrorFunction("io_handle()");}
function mouse_wait()                               {ErrorFunction("mouse_wait()");}
function keyboard_wait()                            {ErrorFunction("keyboard_wait()");}
function keyboard_get_numlock()                     {ErrorFunction("keyboard_get_numlock()");}
function keyboard_set_numlock(on)                   {ErrorFunction("keyboard_set_numlock()");}


// Sprites. Backgrounds
function background_save(ind,fname)     {ErrorFunction("background_save()");}
function sprite_save_strip(ind,fname)   {ErrorFunction("sprite_save_strip()");}


// Objects
function object_add()                                   {ErrorFunction("object_add()");}
function object_delete(ind)                             {ErrorFunction("object_delete()");}
function object_event_add(ind,evtype,evnumb,codestr)    {ErrorFunction("object_event_add()");}
function object_event_clear(ind,evtype,evnumb)          {ErrorFunction("object_event_clear()");}


// Particles
function part_changer_create(_ps)										{ ErrorFunction("part_changer_create()"); }
function part_changer_destroy(_ps,_ind)									{ ErrorFunction("part_changer_destroy()"); }
function part_changer_destroy_all(_ps)									{ ErrorFunction("part_changer_destroy_all()"); }
function part_changer_exists(_ps,_ind)									{ ErrorFunction("part_changer_exists()"); }
function part_changer_clear(_ps,_ind)									{ ErrorFunction("part_changer_clear()"); }
function part_changer_region(_ps,_ind,_xmin,_xmax,_ymin,_ymax,_shape)	{ ErrorFunction("part_changer_region()"); }
function part_changer_types(_ps,_ind,_parttype1,_parttype2)				{ ErrorFunction("part_changer_types()"); }
function part_changer_kind(_ps,_ind,_kind)								{ ErrorFunction("part_changer_kind()"); }

function part_deflector_create(ps)									{ ErrorFunction("part_deflector_create()"); }
function part_deflector_destroy(ps,ind)								{ ErrorFunction("part_deflector_destroy()"); }
function part_deflector_destroy_all(ps)								{ ErrorFunction("part_deflector_destroy_all()"); }
function part_deflector_exists(ps,ind)								{ ErrorFunction("part_deflector_exists()"); }
function part_deflector_clear(ps,ind)								{ ErrorFunction("part_deflector_clear()"); }
function part_deflector_region(ps,ind,xmin,xmax,ymin,ymax)			{ ErrorFunction("part_deflector_region()"); }
function part_deflector_kind(ps,ind,kind)							{ ErrorFunction("part_deflector_kind()"); }
function part_deflector_friction(ps,ind,friction)					{ ErrorFunction("part_deflector_friction()"); }

function part_destroyer_create(ps)									{ ErrorFunction("part_destroyer_create()"); }
function part_destroyer_destroy(ps,ind)								{ ErrorFunction("part_destroyer_destroy()"); }
function part_destroyer_destroy_all(ps)								{ ErrorFunction("part_destroyer_destroy_all()"); }
function part_destroyer_exists(ps,ind)								{ ErrorFunction("part_destroyer_exists()"); }
function part_destroyer_clear(ps,ind)								{ ErrorFunction("part_destroyer_clear()"); }
function part_destroyer_region(ps,ind,xmin,xmax,ymin,ymax,shape)    { ErrorFunction("part_destroyer_region()"); }

function part_attractor_create(ps)								{ ErrorFunction("part_attractor_create()"); }
function part_attractor_destroy(ps,ind)							{ ErrorFunction("part_attractor_destroy()"); }
function part_attractor_destroy_all(ps)							{ ErrorFunction("part_attractor_destroy_all()"); }
function part_attractor_exists(ps,ind)							{ ErrorFunction("part_attractor_exists()"); }
function part_attractor_clear(ps,ind)							{ ErrorFunction("part_attractor_clear()"); }
function part_attractor_position(ps,ind,x,y)					{ ErrorFunction("part_attractor_position()"); }
function part_attractor_force(ps,ind,force,dist,kind,aditive)   { ErrorFunction("part_attractor_force()"); }



// executing programs
function execute_program(prog,arg,wait)     { ErrorFunction("execute_program()"); }
function execute_shell(prog,arg)            { ErrorFunction("execute_shell()"); }
var secure_mode = true;


// Registry
function registry_write_string(name,str)                    { ErrorFunction("registry_write_string()"); }
function registry_write_real(name,x)                        { ErrorFunction("registry_write_real()"); }
function registry_read_string(name)                         { ErrorFunction("registry_read_string()"); }
function registry_read_real(name)                           { ErrorFunction("registry_read_real()"); }
function registry_exists(name)                              { ErrorFunction("registry_exists()"); }
function registry_write_string_ext(key,name,str)            { ErrorFunction("registry_write_string_ext()"); }
function registry_write_real_ext(key,name,x)                { ErrorFunction("registry_write_real_ext()"); }
function registry_read_string_ext(key,name)                 { ErrorFunction("registry_read_string_ext()"); }
function registry_read_real_ext(key,name)                   { ErrorFunction("registry_read_real_ext()"); }
function registry_exists_ext(key,name)                      { ErrorFunction("registry_exists_ext()"); }
function registry_set_root(root)                            { ErrorFunction("registry_set_root()"); }


// Message boxes/dialogs etc.
function message_text_font(_name,_size,_color,_style)       {ErrorFunction("message_text_font()");}
function message_button(_spr)                               {ErrorFunction("message_button()");}
function message_button_font(_name,_size,_color,_style)     {ErrorFunction("message_button_font()");}
function message_input_font(_name, _size, _color, _style)   {ErrorFunction("message_input_font()");}
function message_text_charset()					{ ErrorFunction("message_text_charset()"); }
function message_mouse_color(col)				{ ErrorFunction("message_mouse_color()"); }
function message_input_color(col)				{ ErrorFunction("message_input_color()"); }
function message_caption(show, str)				{ ErrorFunction("message_caption()"); }
function message_position(x, y)					{ ErrorFunction("message_position()"); }
function message_size(w, h)						{ ErrorFunction("message_size()"); }
function show_menu(str, def)					{ ErrorFunction("show_menu()"); }
function show_menu_pos(x, y, str, def)			{ ErrorFunction("show_menu_pos()"); }
function get_color(defcol)						{ ErrorFunction("get_color()"); }
function get_open_filename(filter, fname)		{ ErrorFunction("get_open_filename()"); }
function get_save_filename(filter, fname)		{ ErrorFunction("get_save_filename()"); }
function get_open_filename_ext(filter, fname, dir, title) { ErrorFunction("get_open_filename_ext()"); }
function get_save_filename_ext(filter, fname, dir, title) { ErrorFunction("get_save_filename_ext()"); }
function get_directory(dname) { ErrorFunction("get_directory()"); }
function get_directory_alt(capt, root)			{ ErrorFunction("get_directory_alt()"); }
//function show_error(str, abort)					{ ErrorFunction("show_error()"); }


// sound
function sound_3d_set_sound_position(snd,x,y,z)                                         { ErrorFunction("sound_3d_set_sound_position()"); } 
function sound_3d_set_sound_velocity(snd,x,y,z)                                         { ErrorFunction("sound_3d_set_sound_velocity()"); }
function sound_3d_set_sound_distance(snd,mindist,maxdist)                               { ErrorFunction("sound_3d_set_sound_distance()"); }
function sound_3d_set_sound_cone(snd,x,y,z,anglein,angleout,voloutside)                 { ErrorFunction("sound_3d_set_sound_cone()"); }
function sound_background_tempo(factor)                                                 { ErrorFunction("sound_background_tempo()"); }
function sound_pan(index,value)                                                         { ErrorFunction("sound_pan()"); }
function sound_set_search_directory(dir)                                                { ErrorFunction("sound_set_search_directory()"); }
function sound_effect_set(snd,effect)                                                   { ErrorFunction("sound_effect_set()"); }
function sound_effect_chorus(snd,wetdry,depth,feedback,frequency,wave,delay,phase)      { ErrorFunction("sound_effect_chorus()"); }
function sound_effect_echo(snd,wetdry,feedback,leftdelay,rightdelay,pandelay)           { ErrorFunction("sound_effect_echo()"); }
function sound_effect_flanger(snd,wetdry,depth,feedback,frequency,wave,delay,phase)     { ErrorFunction("sound_effect_flanger()"); }
function sound_effect_gargle(snd,rate,wave)                                             { ErrorFunction("sound_effect_gargle()"); }
function sound_effect_reverb(snd,gain,mix,time,ratio)                                   { ErrorFunction("sound_effect_reverb()"); }
function sound_effect_compressor(snd,gain,attack,release,threshold,ratio,delay)         { ErrorFunction("sound_effect_compressor()"); }
function sound_effect_equalizer(snd,center,bandwidth,gain)                              { ErrorFunction("sound_effect_equalizer()"); }
function sound_discard(index)                                                           { ErrorFunction("sound_discard()"); }
function sound_restore(index)                                                           { ErrorFunction("sound_restore()"); }
function sound_get_preload(index)														{ ErrorFunction("sound_get_preload()"); }

function cd_init()                  { ErrorFunction("cd_init()"); }
function cd_present()               { ErrorFunction("cd_present()"); }
function cd_number()                { ErrorFunction("cd_number()"); }
function cd_playing()               { ErrorFunction("cd_playing()"); }
function cd_paused()                { ErrorFunction("cd_paused()"); }
function cd_track()                 { ErrorFunction("cd_track()"); }
function cd_length()                { ErrorFunction("cd_length()"); }
function cd_track_length(n)         { ErrorFunction("cd_track_length()"); }
function cd_position()              { ErrorFunction("cd_position()"); }
function cd_track_position()        { ErrorFunction("cd_track_position()"); }
function cd_play(first,last)        { ErrorFunction("cd_play()"); }
function cd_stop()                  { ErrorFunction("cd_stop()"); }
function cd_pause()                 { ErrorFunction("cd_pause()"); }
function cd_resume()                { ErrorFunction("cd_resume()"); }
function cd_set_position(pos)       { ErrorFunction("cd_set_position()"); }
function cd_set_track_position(pos) { ErrorFunction("cd_set_track_position()"); }
function cd_open_door()             { ErrorFunction("cd_open_door()"); }
function cd_close_door()            { ErrorFunction("cd_close_door()"); }
function MCI_command(str)           { ErrorFunction("MCI_command()"); }
					
function texture_preload(texid)             { ErrorFunction("texture_preload()"); }
function texture_set_priority(texid,prio)   { ErrorFunction("texture_set_priority()"); }
function texture_get_width(texid)           { ErrorFunction("texture_get_width()"); }
function texture_get_height(texid)          { ErrorFunction("texture_get_height()"); }
function texture_set_blending(blend)        { ErrorFunction("texture_set_blending()"); }
function texture_set_repeat(repeat)         { ErrorFunction("texture_set_repeat()"); }
function texture_get_repeat()               { ErrorFunction("texture_get_repeat()"); }
function texture_set_repeat_ext(repeat)     { ErrorFunction("texture_set_repeat_ext()"); }

function texture_set_interpolation_ext(stage, linear)    { ErrorFunction("texture_set_interpolation_ext()"); }
function texture_get_uvs(_tex) { ErrorFunction("texture_get_uvs()"); }
function texture_global_scale(pow2integer) { ErrorFunction("texture_global_scale()"); }


function file_open_read()             { ErrorFunction("file_open_read()"); }
function file_open_write()            { ErrorFunction("file_open_write()"); }
function file_open_append()           { ErrorFunction("file_open_append()"); }
function file_read_real()             { ErrorFunction("file_read_real()"); }
function file_read_string()           { ErrorFunction("file_read_string()"); }
function file_readln()                { ErrorFunction("file_readln()"); }
function file_write_real()            { ErrorFunction("file_write_real()"); }
function file_write_string()          { ErrorFunction("file_write_string()"); }
function file_writeln()               { ErrorFunction("file_writeln()"); }
function file_eof()                   { ErrorFunction("file_eof()"); }
function file_eoln()                  { ErrorFunction("file_eoln()"); }
function file_close()                 { ErrorFunction("file_close()"); }

//steam functions
function steam_activate_overlay()               { ErrorFunction("steam_activate_overlay()"); return -1; }
function steam_is_overlay_enabled()             { ErrorFunction("steam_is_overlay_enabled()"); return -1;  }
function steam_is_overlay_activated()           { ErrorFunction("steam_is_overlay_activated()"); return -1;  }
function steam_get_persona_name()               { ErrorFunction("steam_get_persona_name()"); return "";}
function steam_initialised()                    { ErrorFunction("steam_initialised()"); return -1;  }
function steam_is_cloud_enabled_for_app()       { ErrorFunction("steam_is_cloud_enabled_for_app()"); return -1; }
function steam_is_cloud_enabled_for_account()   { ErrorFunction("steam_is_cloud_enabled_for_account()"); return -1;  }
function steam_file_persisted()                 { ErrorFunction("steam_file_persisted()"); return -1; }
function steam_get_quota_total()                { ErrorFunction("steam_get_quota_total()"); return -1;}
function steam_get_quota_free()                 { ErrorFunction("steam_get_quota_free()"); return -1;}
function steam_file_write()                     { ErrorFunction("steam_file_write()"); return -1;}
function steam_file_write_file()                { ErrorFunction("steam_file_write_file()"); return -1;}
function steam_file_read()                      { ErrorFunction("steam_file_read()"); return "";}
function steam_file_delete()                    { ErrorFunction("steam_file_delete()"); return -1;}
function steam_file_exists()                    { ErrorFunction("steam_file_exists()"); return -1; }
function steam_file_size()                      { ErrorFunction("steam_file_size()"); return -1; }
function steam_file_share()                     { ErrorFunction("steam_file_share()");  return -1; }
function steam_publish_workshop_file()          { ErrorFunction("steam_publish_workshop_file()"); return -1; }
function steam_is_screenshot_requested()        { ErrorFunction("steam_is_screenshot_requested()"); return -1; }
function steam_send_screenshot()                { ErrorFunction("steam_send_screenshot()"); return -1; }
function steam_is_user_logged_on()              { ErrorFunction("steam_is_user_logged_on()"); return -1; }
function steam_get_user_steam_id()              { ErrorFunction("steam_get_user_steam_id()"); return -1; }
function steam_user_owns_dlc()                  { ErrorFunction("steam_user_owns_dlc()"); return -1; }
function steam_user_installed_dlc()             { ErrorFunction("steam_user_installed_dlc()"); return -1; }
function steam_set_achievement()                { ErrorFunction("steam_set_achievement()"); return -1; }
function steam_get_achievement()                { ErrorFunction("steam_get_achievement()"); return -1; }
function steam_clear_achievement()              { ErrorFunction("steam_clear_achievement()"); return -1; }
function steam_set_stat_int()                   { ErrorFunction("steam_set_stat_int()"); return -1; }
function steam_set_stat_float()                 { ErrorFunction("steam_set_stat_float()"); return -1; }
function steam_set_stat_avg_rate()              { ErrorFunction("steam_set_stat_avg_rate()"); return -1; }
function steam_get_stat_int()                   { ErrorFunction("steam_get_stat_int()"); return -1; }
function steam_get_stat_float()                 { ErrorFunction("steam_get_stat_float()"); return -1; }
function steam_get_stat_avg_rate()              { ErrorFunction("steam_get_stat_avg_rate()"); return -1; }
function steam_reset_all_stats()                { ErrorFunction("steam_reset_all_stats()"); return -1; }
function steam_reset_all_stats_achievements()   { ErrorFunction("steam_reset_all_stats_achievements()"); return -1; }
function steam_stats_ready()                    { ErrorFunction("steam_stats_ready()"); return -1; }
function steam_create_leaderboard()             { ErrorFunction("steam_create_leaderboard()"); return -1; }
function steam_upload_score()                   { ErrorFunction("steam_upload_score()"); return -1; }
function steam_upload_score_ext()               { ErrorFunction("steam_upload_score_ext()"); return -1; }
function steam_download_scores_around_user()    { ErrorFunction("steam_download_scores_around_user()"); return -1; }
function steam_download_scores()                { ErrorFunction("steam_download_scores()"); return -1; }
function steam_download_friends_scores()        { ErrorFunction("steam_download_friends_scores()"); return -1; }
function steam_upload_score_buffer()            { ErrorFunction("steam_upload_score_buffer()"); return -1; }
function steam_upload_score_buffer_ext()        { ErrorFunction("steam_upload_score_buffer_ext()"); return -1; }
function steam_activate_overlay_browser()       { ErrorFunction("steam_activate_overlay_browser()"); return -1; }
function steam_activate_overlay_user()          { ErrorFunction("steam_activate_overlay_user()"); return -1; }
function steam_activate_overlay_store()         { ErrorFunction("steam_activate_overlay_store()"); return -1; }
function steam_get_user_persona_name()          { ErrorFunction("steam_get_user_persona_name()"); return -1; }


//steam ugc functions
function steam_get_app_id()                                { ErrorFunction("steam_get_app_id()"); return -1; }
function steam_get_user_account_id()                       { ErrorFunction("steam_get_user_account_id()"); return -1; }
function steam_ugc_download()                              { ErrorFunction("steam_ugc_download()"); return -1; }
function steam_ugc_create_item()                           { ErrorFunction("steam_ugc_create_item()"); return -1; }
function steam_ugc_start_item_update()                     { ErrorFunction("steam_ugc_start_item_update()"); return -1; }
function steam_ugc_set_item_title()                        { ErrorFunction("steam_ugc_set_item_title()"); return -1; }
function steam_ugc_set_item_description()                  { ErrorFunction("steam_ugc_set_item_description()"); return -1; }
function steam_ugc_set_item_visibility()                   { ErrorFunction("steam_ugc_set_item_visibility()"); return -1; }
function steam_ugc_set_item_tags()                         { ErrorFunction("steam_ugc_set_item_tags()"); return -1; }
function steam_ugc_set_item_content()                      { ErrorFunction("steam_ugc_set_item_content()"); return -1; }
function steam_ugc_set_item_preview()                      { ErrorFunction("steam_ugc_set_item_preview()"); return -1; }
function steam_ugc_submit_item_update()                    { ErrorFunction("steam_ugc_submit_item_update()"); return -1; }
function steam_ugc_get_item_update_progress()              { ErrorFunction("steam_ugc_get_item_update_progress()"); return -1; }
function steam_ugc_subscribe_item()                        { ErrorFunction("steam_ugc_subscribe_item()"); return -1; }
function steam_ugc_unsubscribe_item()                      { ErrorFunction("steam_ugc_unsubscribe_item()"); return -1; }
function steam_ugc_num_subscribed_items()                  { ErrorFunction("steam_ugc_num_subscribed_items()"); return -1; }
function steam_ugc_get_subscribed_items()                  { ErrorFunction("steam_ugc_get_subscribed_items()"); return -1; }
function steam_ugc_get_item_install_info()                 { ErrorFunction("steam_ugc_get_item_install_info()"); return -1; }
function steam_ugc_get_item_update_info()                  { ErrorFunction("steam_ugc_get_item_update_info()"); return -1; }
function steam_ugc_request_item_details()                  { ErrorFunction("steam_ugc_request_item_details()"); return -1; }
function steam_ugc_create_query_user()                     { ErrorFunction("steam_ugc_create_query_user()"); return -1; }
function steam_ugc_create_query_user_ex()                  { ErrorFunction("steam_ugc_create_query_user_ex()"); return -1; }
function steam_ugc_create_query_all()                      { ErrorFunction("steam_ugc_create_query_all()"); return -1; }
function steam_ugc_create_query_all_ex()                   { ErrorFunction("steam_ugc_create_query_all_ex()"); return -1; }
function steam_ugc_query_set_cloud_filename_filter()       { ErrorFunction("steam_ugc_query_set_cloud_filename_filter()"); return -1; }
function steam_ugc_query_set_match_any_tag()               { ErrorFunction("steam_ugc_query_set_match_any_tag()"); return -1; }
function steam_ugc_query_set_search_text()                 { ErrorFunction("steam_ugc_query_set_search_text()"); return -1; }
function steam_ugc_query_set_ranked_by_trend_days()        { ErrorFunction("steam_ugc_query_set_ranked_by_trend_days()"); return -1; }
function steam_ugc_query_add_required_tag()                { ErrorFunction("steam_ugc_query_add_required_tag()"); return -1; }
function steam_ugc_query_add_excluded_tag()                { ErrorFunction("steam_ugc_query_add_excluded_tag()"); return -1; }
function steam_ugc_query_set_return_long_description()     { ErrorFunction("steam_ugc_query_set_return_long_description()"); return -1; }
function steam_ugc_query_set_return_total_only()           { ErrorFunction("steam_ugc_query_set_return_total_only()"); return -1; }
function steam_ugc_query_set_allow_cached_response()       { ErrorFunction("steam_ugc_query_set_allow_cached_response()"); return -1; }
function steam_ugc_send_query(ugc_query_handle) { ErrorFunction("steam_ugc_send_query( ugc_query_handle )"); return -1; }
function steam_current_game_language() { ErrorFunction("steam_current_game_language()"); return -1; }
function steam_available_languages() { ErrorFunction("steam_available_languages()"); return -1; }





function draw_set_alpha_test()                  { ErrorFunction("draw_set_alpha_test()"); }
function draw_set_alpha_test_ref_value()        { ErrorFunction("draw_set_alpha_test_ref_value()"); }
function draw_get_alpha_test()                  { ErrorFunction("draw_get_alpha_test()"); return 0; }
function draw_get_alpha_test_ref_value()        { ErrorFunction("draw_get_alpha_test_ref_value()"); return 0; }



function zip_unzip()                                { ErrorFunction("zip_unzip()"); }
function zip_create()                               { ErrorFunction("zip_create()"); }
function zip_add_file()                             { ErrorFunction("zip_add_file()"); }
function zip_save()                                 { ErrorFunction("zip_save()"); }

function game_change()                              { ErrorFunction("game_change()"); }

function winphone_license_trial_version()           { ErrorFunction("winphone_license_trial_version()"); }
function winphone_tile_title()                      { ErrorFunction("winphone_tile_title()"); }
function winphone_tile_count()                      { ErrorFunction("winphone_tile_count()"); }
function winphone_tile_back_title()                 { ErrorFunction("winphone_tile_back_title()"); }
function winphone_tile_back_content()               { ErrorFunction("winphone_tile_back_content()"); }
function winphone_tile_back_content_wide()          { ErrorFunction("winphone_tile_back_content_wide()"); }
function winphone_tile_front_image()                { ErrorFunction("winphone_tile_front_image()"); }
function winphone_tile_front_image_small()          { ErrorFunction("winphone_tile_front_image_small()"); }
function winphone_tile_front_image_wide()           { ErrorFunction("winphone_tile_front_image_wide()"); }
function winphone_tile_back_image()                 { ErrorFunction("winphone_tile_back_image()"); }
function winphone_tile_back_image_wide()            { ErrorFunction("winphone_tile_back_image_wide()"); }
function winphone_tile_background_colour()          { ErrorFunction("winphone_tile_background_colour()"); }
function winphone_tile_background_color()           { ErrorFunction("winphone_tile_background_color()"); }
function winphone_tile_icon_image()                 { ErrorFunction("winphone_tile_icon_image()"); }
function winphone_tile_small_icon_image()           { ErrorFunction("winphone_tile_small_icon_image()"); }
function winphone_tile_wide_content()               { ErrorFunction("winphone_tile_wide_content()"); }
function winphone_tile_cycle_images()               { ErrorFunction("winphone_tile_cycle_images()"); }
function winphone_tile_small_background_image()     { ErrorFunction("winphone_tile_small_background_image()"); }
                                                    

//function gml_release_mode()                         { return 1; }
function push_local_notification()                  { ErrorFunction("push_local_notification()"); }
function push_get_first_local_notification()        { ErrorFunction("push_get_first_local_notification()"); return -1; }
function push_get_next_local_notification()         { ErrorFunction("push_get_next_local_notification()"); return -1; }
function push_cancel_local_notification()           { ErrorFunction("push_cancel_local_notification()"); return -1; }
function push_get_application_badge_number()        { ErrorFunction("push_get_application_badge_number()"); return -1; }
function push_set_application_badge_number()        { ErrorFunction("push_set_application_badge_number()"); return -1; }

//function application_get_position()                 { ErrorFunction("application_get_position()"); }
//function application_surface_draw_enable()          { ErrorFunction("application_surface_draw_enable()"); }
//function application_surface_enable()               { ErrorFunction("application_surface_enable()"); }
//function application_surface_is_enabled()           { ErrorFunction("application_surface_is_enabled()"); return 0; }
//
function surface_set_target_ext()                       { ErrorFunction("surface_set_target_ext()"); return 0; }
function surface_get_target_ext()                       { ErrorFunction("surface_set_target_ext()"); return -1; }

/* Audio Emitters */
function audio_emitter_velocity()                       { ErrorFunction("audio_emitter_velocity()"); }
function audio_emitter_get_vx()                         { ErrorFunction("audio_emitter_get_vx()"); return 0.0; }
function audio_emitter_get_vy()                         { ErrorFunction("audio_emitter_get_vy()"); return 0.0; }
function audio_emitter_get_vz()                         { ErrorFunction("audio_emitter_get_vz()"); return 0.0; }

/* Audio Listeners */
function audio_set_listener_mask()                      { ErrorFunction("audio_set_listener_mask()"); }
function audio_sound_set_listener_mask()                { ErrorFunction("audio_sound_set_listener_mask()"); }
function audio_emitter_set_listener_mask()              { ErrorFunction("audio_emitter_set_listener_mask()"); }

/* Audio Sync Groups */
function audio_destroy_sync_group()                     { ErrorFunction("audio_destroy_sync_group()"); return -1; }
function audio_create_sync_group()                      { ErrorFunction("audio_create_sync_group()"); return -1; }
function audio_play_in_sync_group()                     { ErrorFunction("audio_play_in_sync_group()"); }
function audio_start_sync_group()                       { ErrorFunction("audio_start_sync_group()"); }
function audio_pause_sync_group()                       { ErrorFunction("audio_pause_sync_group()"); }
function audio_resume_sync_group()                      { ErrorFunction("audio_resume_sync_group()"); }
function audio_stop_sync_group()                        { ErrorFunction("audio_stop_sync_group()"); }
function audio_sync_group_get_track_pos()               { ErrorFunction("audio_sync_group_get_track_pos()"); return -1; }
function audio_sync_group_is_playing()                  { ErrorFunction("audio_sync_group_is_playing()"); return -1; }
function audio_sync_group_is_paused()                   { ErrorFunction("audio_sync_group_is_paused()"); return -1; }
function audio_sync_group_debug()                       { ErrorFunction("audio_sync_group_debug()"); }

function gpio_set()                                     { ErrorFunction("GPIO is not supported"); }
function gpio_clear()                                   { ErrorFunction("GPIO is not supported"); }
function gpio_get()                                     { ErrorFunction("GPIO is not supported"); return 0; }
function gpio_set_mode()                                { ErrorFunction("GPIO is not supported"); }

// Metro live tile commands
function win8_livetile_tile_notification()              { ErrorFunction("win8_livetile_tile_notification()"); return -1; }
function win8_livetile_tile_clear()                     { ErrorFunction("win8_livetile_tile_clear()"); return -1; }
function win8_livetile_badge_notification()             { ErrorFunction("win8_livetile_badge_notification()"); return -1; }
function win8_livetile_badge_clear()                    { ErrorFunction("win8_livetile_badge_clear()"); return -1; }
function win8_livetile_queue_enable()                   { ErrorFunction("win8_livetile_queue_enable()"); return -1; }

// Metro secondary tiles
function win8_secondarytile_pin()                       { ErrorFunction("win8_secondarytile_pin()"); return -1; }
function win8_secondarytile_badge_notification()        { ErrorFunction("win8_secondarytile_badge_notification()"); return -1; }
function win8_secondarytile_delete()                    { ErrorFunction("win8_secondarytile_delete()"); return -1; }

function win8_settingscharm_add_xaml_entry()            { ErrorFunction("win8_settingscharm_add_xaml_entry()"); }
function win8_settingscharm_set_xaml_property()         { ErrorFunction("win8_settingscharm_set_xaml_property()"); }
function win8_settingscharm_get_xaml_property()         { ErrorFunction("win8_settingscharm_get_xaml_property()"); }

// Metro live tile command list
function win8_livetile_notification_begin()             { ErrorFunction("win8_livetile_notification_begin()"); return -1; }
function win8_livetile_notification_secondary_begin()   { ErrorFunction("win8_livetile_notification_secondary_begin()"); return -1; }
function win8_livetile_notification_expiry()            { ErrorFunction("win8_livetile_notification_expiry()"); return -1; }
function win8_livetile_notification_tag()               { ErrorFunction("win8_livetile_notification_tag()"); return -1; }
function win8_livetile_notification_text_add()          { ErrorFunction("win8_livetile_notification_text_add()"); return -1; }
function win8_livetile_notification_image_add()         { ErrorFunction("win8_livetile_notification_image_add()"); return -1; }
function win8_livetile_notification_end()               { ErrorFunction("win8_livetile_notification_end()"); return -1; }

// Metro appbar commands
function win8_appbar_enable()                           { ErrorFunction("win8_appbar_enable()"); return -1; }
function win8_appbar_add_element()                      { ErrorFunction("win8_appbar_add_element()"); return -1; }
function win8_appbar_remove_element()                   { ErrorFunction("win8_appbar_remove_element()"); return -1; }

// Metro charms
function win8_settingscharm_add_entry()                 { ErrorFunction("win8_settingscharm_add_entry()"); return -1; }
function win8_settingscharm_add_html_entry()            { ErrorFunction("win8_settingscharm_add_html_entry()"); return -1; }
function win8_settingscharm_remove_entry()              { ErrorFunction("win8_settingscharm_remove_entry()"); return -1; }

// Metro share
function win8_share_image()                             { ErrorFunction("win8_share_image()"); return -1; }
function win8_share_screenshot()                        { ErrorFunction("win8_share_screenshot()"); return -1; }
function win8_share_file()                              { ErrorFunction("win8_share_file()"); return -1; }
function win8_share_url()                               { ErrorFunction("win8_share_url()"); return -1; }
function win8_share_text()                              { ErrorFunction("win8_share_text()"); return -1; }

// Metro search
function win8_search_enable()                           { ErrorFunction("win8_search_enable()"); return -1; }
function win8_search_disable()                          { ErrorFunction("win8_search_disable()"); return -1; }
function win8_search_add_suggestions()                  { ErrorFunction("win8_search_add_suggestions()"); return -1; }

// Metro device presence
function win8_device_touchscreen_available()            { ErrorFunction("win8_device_touchscreen_available()"); return -1; }

// Metro licensing (Yank spelling)
function win8_license_initialize_sandbox()              { ErrorFunction("win8_license_initialize_sandbox()"); return -1; }
function win8_license_trial_version()                   { ErrorFunction("win8_license_trial_version()"); return -1; }

//uwp win8 mirror functions ---------
function uwp_livetile_tile_clear()          { ErrorFunction("uwp_livetile_tile_clear()"); return -1; }
function uwp_livetile_badge_notification()  { ErrorFunction("uwp_livetile_badge_notification()"); return -1; }
function uwp_livetile_badge_clear()         { ErrorFunction("uwp_livetile_badge_clear()"); return -1; }
function uwp_livetile_queue_enable()        { ErrorFunction("uwp_livetile_queue_enable()"); return -1; }

//uwp secondary tile functions
function uwp_secondarytile_pin()                { ErrorFunction("uwp_secondarytile_pin()"); return -1; }
function uwp_secondarytile_badge_notification() { ErrorFunction("uwp_secondarytile_badge_notification()"); return -1; }
function uwp_secondarytile_delete()             { ErrorFunction("uwp_secondarytile_delete()"); return -1; }
function uwp_secondarytile_tile_clear()         { ErrorFunction("uwp_secondarytile_tile_clear()"); return -1; }
function uwp_secondarytile_badge_clear()         { ErrorFunction("uwp_seondarytile_badge_clear()"); return -1; }

//uwp livetile notifications
function uwp_livetile_notification_begin()              { ErrorFunction("uwp_livetile_notification_begin()"); return -1; }
function uwp_livetile_notification_secondary_begin()    { ErrorFunction("uwp_livetile_notification_secondary_begin()"); return -1; }
function uwp_livetile_notification_expiry()             { ErrorFunction("uwp_livetile_notification_expiry()"); return -1; }
function uwp_livetile_notification_tag()                { ErrorFunction("uwp_livetile_notification_tag()"); return -1; }
function uwp_livetile_notification_text_add()           { ErrorFunction("uwp_livetile_notification_text_add()"); return -1; }
function uwp_livetile_notification_image_add()          { ErrorFunction("uwp_livetile_notification_image_add()"); return -1; }
function uwp_livetile_notification_end()                { ErrorFunction("uwp_livetile_notification_end()"); return -1; }
function uwp_livetile_notification_template_add()       { ErrorFunction("uwp_livetile_notification_template_add()"); return -1; }

// uwp appbar functions
function uwp_appbar_enable()            { ErrorFunction("uwp_appbar_enable()"); return -1; }
function uwp_appbar_add_element()       { ErrorFunction("uwp_appbar_add_element()"); return -1; }
function uwp_appbar_remove_element()    { ErrorFunction("uwp_appbar_remove_element()"); return -1; }

function uwp_device_touchscreen_available() { ErrorFunction("uwp_device_touchscreen_available()"); return -1; }

function external_define() { ErrorFunction("external_define()"); return -1; }
function external_call() { ErrorFunction("external_call()"); return -1; }
function external_free() { ErrorFunction("external_free()"); return -1; }
//-------
