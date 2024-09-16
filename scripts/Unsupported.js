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
function game_save(name)			{ ErrorFunction("game_save()"); }
function game_load(name)			{ ErrorFunction("game_load()"); }
function game_save_buffer(buffer)	{ ErrorFunction("game_save_buffer()"); }
function game_load_buffer(buffer)	{ ErrorFunction("game_load_buffer()"); }


// Splash screens
function os_set_orientation_lock()			{ ErrorFunction("os_set_orientation_lock()"); }

// general
function screen_save(fname)                         {MissingFunction("screen_save()");}
function screen_save_part(fname,x,y,w,h)            {MissingFunction("screen_save_part()");}

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

// IO
function keyboard_get_numlock()                     {ErrorFunction("keyboard_get_numlock()");}
function keyboard_set_numlock(on)                   {ErrorFunction("keyboard_set_numlock()");}


// Sprites. Backgrounds
function sprite_save_strip(ind,fname)   {ErrorFunction("sprite_save_strip()");}

// Message boxes/dialogs etc.
function get_open_filename(filter, fname)		{ ErrorFunction("get_open_filename()"); }
function get_save_filename(filter, fname)		{ ErrorFunction("get_save_filename()"); }
function get_open_filename_ext(filter, fname, dir, title) { ErrorFunction("get_open_filename_ext()"); }
function get_save_filename_ext(filter, fname, dir, title) { ErrorFunction("get_save_filename_ext()"); }


// sound
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

/* Audio Debug */
function audio_debug()                                  { ErrorFunction("audio_debug()"); }
function audio_throw_on_error()                         { ErrorFunction("audio_throw_on_error()"); }

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
