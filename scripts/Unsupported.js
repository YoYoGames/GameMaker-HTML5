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


// General
function game_save(name)                            { ErrorFunction("game_save()"); }
function game_load(name)                            { ErrorFunction("game_load()"); }
function game_save_buffer(buffer)                   { ErrorFunction("game_save_buffer()"); }
function game_load_buffer(buffer)                   { ErrorFunction("game_load_buffer()"); }

function display_get_frequency()                    { ErrorFunction("display_get_frequency()"); }
function display_reset(AA)                          { ErrorFunction("display_reset()"); }
function display_mouse_set(x,y)                     { ErrorFunction("display_mouse_set()"); }

function external_define()                          { ErrorFunction("external_define()"); return -1; }
function external_call()                            { ErrorFunction("external_call()"); return -1; }
function external_free()                            { ErrorFunction("external_free()"); return -1; }

function screen_save(fname)                         { MissingFunction("screen_save()"); }
function screen_save_part(fname,x,y,w,h)            { MissingFunction("screen_save_part()"); }

function os_set_orientation_lock()                  { ErrorFunction("os_set_orientation_lock()"); }
function zip_unzip()                                { ErrorFunction("zip_unzip()"); }
function extension_exists()                         { return false; }


// IO
function keyboard_get_numlock()                     { ErrorFunction("keyboard_get_numlock()"); }
function keyboard_set_numlock(on)                   { ErrorFunction("keyboard_set_numlock()"); }


// Sprites
function sprite_save_strip(ind,fname)   { ErrorFunction("sprite_save_strip()"); }


// Audio
function audio_destroy_sync_group()                     { ErrorFunction("audio_destroy_sync_group()"); }
function audio_create_sync_group()                      { ErrorFunction("audio_create_sync_group()"); return -1; }
function audio_play_in_sync_group()                     { ErrorFunction("audio_play_in_sync_group()"); return -1; }
function audio_start_sync_group()                       { ErrorFunction("audio_start_sync_group()"); }
function audio_pause_sync_group()                       { ErrorFunction("audio_pause_sync_group()"); }
function audio_resume_sync_group()                      { ErrorFunction("audio_resume_sync_group()"); }
function audio_stop_sync_group()                        { ErrorFunction("audio_stop_sync_group()"); }
function audio_sync_group_get_track_pos()               { ErrorFunction("audio_sync_group_get_track_pos()"); return -1; }
function audio_sync_group_is_playing()                  { ErrorFunction("audio_sync_group_is_playing()"); return -1; }
function audio_sync_group_is_paused()                   { ErrorFunction("audio_sync_group_is_paused()"); return -1; }
function audio_sync_group_debug()                       { ErrorFunction("audio_sync_group_debug()"); }


// Surfaces
function surface_set_target_ext()               { ErrorFunction("surface_set_target_ext()"); return 0; }
function surface_get_target_ext(_)              { ErrorFunction("surface_get_target_ext()"); return -1; }


// Textures
function texture_get_width(texid)           { ErrorFunction("texture_get_width()"); }
function texture_get_height(texid)          { ErrorFunction("texture_get_height()"); }
function texture_get_uvs(_tex)              { ErrorFunction("texture_get_uvs()"); }
function texture_global_scale(pow2integer)  { ErrorFunction("texture_global_scale()"); }


// Dialogs
function get_open_filename(filter, fname)                 { ErrorFunction("get_open_filename()"); }
function get_save_filename(filter, fname)                 { ErrorFunction("get_save_filename()"); }
function get_open_filename_ext(filter, fname, dir, title) { ErrorFunction("get_open_filename_ext()"); }
function get_save_filename_ext(filter, fname, dir, title) { ErrorFunction("get_save_filename_ext()"); }


// Obsolete functions - with existing implementation in WebGL
function draw_set_alpha_test()                           { ErrorFunction("draw_set_alpha_test()"); }
function draw_set_alpha_test_ref_value()                 { ErrorFunction("draw_set_alpha_test_ref_value()"); }
function draw_get_alpha_test()                           { ErrorFunction("draw_get_alpha_test()"); return 0; }
function draw_get_alpha_test_ref_value()                 { ErrorFunction("draw_get_alpha_test_ref_value()"); return 0; }
function texture_set_blending(blend)                     { ErrorFunction("texture_set_blending()"); }
function texture_set_repeat(repeat)                      { ErrorFunction("texture_set_repeat()"); }
function texture_get_repeat()                            { ErrorFunction("texture_get_repeat()"); }
function texture_set_repeat_ext(repeat)                  { ErrorFunction("texture_set_repeat_ext()"); }
function texture_set_interpolation_ext(stage, linear)    { ErrorFunction("texture_set_interpolation_ext()"); }


// All of the functions below are obsolete but still compile in the IDE.
function audio_play_music(_soundid, _bLoop)         { ErrorFunction("audio_play_music()"); }
function audio_stop_music()                         { ErrorFunction("audio_stop_music()"); }
function audio_pause_music()                        { ErrorFunction("audio_pause_music()"); }
function audio_resume_music()                       { ErrorFunction("audio_resume_music()"); }
function audio_music_is_playing()                   { ErrorFunction("audio_music_is_playing()"); return 0; }

function push_local_notification()                  { ErrorFunction("push_local_notification()"); }
function push_get_first_local_notification()        { ErrorFunction("push_get_first_local_notification()"); return -1; }
function push_get_next_local_notification()         { ErrorFunction("push_get_next_local_notification()"); return -1; }
function push_cancel_local_notification()           { ErrorFunction("push_cancel_local_notification()"); return -1; }
function push_get_application_badge_number()        { ErrorFunction("push_get_application_badge_number()"); return -1; }
function push_set_application_badge_number()        { ErrorFunction("push_set_application_badge_number()"); return -1; }

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

// Metro live tile commands
function win8_livetile_tile_notification()              { ErrorFunction("win8_livetile_tile_notification()"); return -1; }
function win8_livetile_tile_clear()                     { ErrorFunction("win8_livetile_tile_clear()"); return -1; }
function win8_livetile_badge_notification()             { ErrorFunction("win8_livetile_badge_notification()"); return -1; }
function win8_livetile_badge_clear()                    { ErrorFunction("win8_livetile_badge_clear()"); return -1; }
function win8_livetile_queue_enable()                   { ErrorFunction("win8_livetile_queue_enable()"); return -1; }

// Metro live tile command list
function win8_livetile_notification_begin()             { ErrorFunction("win8_livetile_notification_begin()"); return -1; }
function win8_livetile_notification_secondary_begin()   { ErrorFunction("win8_livetile_notification_secondary_begin()"); return -1; }
function win8_livetile_notification_expiry()            { ErrorFunction("win8_livetile_notification_expiry()"); return -1; }
function win8_livetile_notification_tag()               { ErrorFunction("win8_livetile_notification_tag()"); return -1; }
function win8_livetile_notification_text_add()          { ErrorFunction("win8_livetile_notification_text_add()"); return -1; }
function win8_livetile_notification_image_add()         { ErrorFunction("win8_livetile_notification_image_add()"); return -1; }
function win8_livetile_notification_end()               { ErrorFunction("win8_livetile_notification_end()"); return -1; }

// Metro secondary tiles
function win8_secondarytile_pin()                       { ErrorFunction("win8_secondarytile_pin()"); return -1; }
function win8_secondarytile_badge_notification()        { ErrorFunction("win8_secondarytile_badge_notification()"); return -1; }
function win8_secondarytile_delete()                    { ErrorFunction("win8_secondarytile_delete()"); return -1; }

// Metro appbar commands
function win8_appbar_enable()                           { ErrorFunction("win8_appbar_enable()"); return -1; }
function win8_appbar_add_element()                      { ErrorFunction("win8_appbar_add_element()"); return -1; }
function win8_appbar_remove_element()                   { ErrorFunction("win8_appbar_remove_element()"); return -1; }

// Metro charms
function win8_settingscharm_add_entry()                 { ErrorFunction("win8_settingscharm_add_entry()"); return -1; }
function win8_settingscharm_add_html_entry()            { ErrorFunction("win8_settingscharm_add_html_entry()"); return -1; }
function win8_settingscharm_remove_entry()              { ErrorFunction("win8_settingscharm_remove_entry()"); return -1; }
function win8_settingscharm_add_xaml_entry()            { ErrorFunction("win8_settingscharm_add_xaml_entry()"); }
function win8_settingscharm_set_xaml_property()         { ErrorFunction("win8_settingscharm_set_xaml_property()"); }
function win8_settingscharm_get_xaml_property()         { ErrorFunction("win8_settingscharm_get_xaml_property()"); }

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

// UWP win8 mirror functions
function uwp_livetile_tile_clear()          { ErrorFunction("uwp_livetile_tile_clear()"); return -1; }
function uwp_livetile_badge_notification()  { ErrorFunction("uwp_livetile_badge_notification()"); return -1; }
function uwp_livetile_badge_clear()         { ErrorFunction("uwp_livetile_badge_clear()"); return -1; }
function uwp_livetile_queue_enable()        { ErrorFunction("uwp_livetile_queue_enable()"); return -1; }

// UWP secondary tile functions
function uwp_secondarytile_pin()                { ErrorFunction("uwp_secondarytile_pin()"); return -1; }
function uwp_secondarytile_badge_notification() { ErrorFunction("uwp_secondarytile_badge_notification()"); return -1; }
function uwp_secondarytile_delete()             { ErrorFunction("uwp_secondarytile_delete()"); return -1; }
function uwp_secondarytile_tile_clear()         { ErrorFunction("uwp_secondarytile_tile_clear()"); return -1; }
function uwp_secondarytile_badge_clear()         { ErrorFunction("uwp_seondarytile_badge_clear()"); return -1; }

// UWP livetile notifications
function uwp_livetile_notification_begin()              { ErrorFunction("uwp_livetile_notification_begin()"); return -1; }
function uwp_livetile_notification_secondary_begin()    { ErrorFunction("uwp_livetile_notification_secondary_begin()"); return -1; }
function uwp_livetile_notification_expiry()             { ErrorFunction("uwp_livetile_notification_expiry()"); return -1; }
function uwp_livetile_notification_tag()                { ErrorFunction("uwp_livetile_notification_tag()"); return -1; }
function uwp_livetile_notification_text_add()           { ErrorFunction("uwp_livetile_notification_text_add()"); return -1; }
function uwp_livetile_notification_image_add()          { ErrorFunction("uwp_livetile_notification_image_add()"); return -1; }
function uwp_livetile_notification_end()                { ErrorFunction("uwp_livetile_notification_end()"); return -1; }
function uwp_livetile_notification_template_add()       { ErrorFunction("uwp_livetile_notification_template_add()"); return -1; }

// UWP appbar functions
function uwp_appbar_enable()            { ErrorFunction("uwp_appbar_enable()"); return -1; }
function uwp_appbar_add_element()       { ErrorFunction("uwp_appbar_add_element()"); return -1; }
function uwp_appbar_remove_element()    { ErrorFunction("uwp_appbar_remove_element()"); return -1; }

function uwp_device_touchscreen_available() { ErrorFunction("uwp_device_touchscreen_available()"); return -1; }
