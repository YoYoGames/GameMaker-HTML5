
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Action.js
// Created:         26/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 22/02/2011		V1.0        MJD     1st version, blocked in....
// 
// **********************************************************************************************************************

// Whether the arguments to a function are relative
var Argument_Relative = false;

// Error messages
var error_a0003 = 'Trying to stop non-existing sound.',
    error_a0004 = 'Trying to draw a non-existing sprite.',
    error_a0005 = 'Trying to draw a non-existing background.',
    error_a0006 = 'Cannot compare arguments.',
    //error_a0007 = 'Video file not found (or name too long).',
    error_a0008 = 'Trying to replace non-existing resource.',
    error_a0009 = 'File does not exist.',
    //error_a0010 = 'Trying to save screen to empty image file name.',
    //error_a0011 = 'In secure mode you cannot open webpages.',
    //error_a0012 = 'Failed to open the webpage.',
    //error_a0013 = 'The particle system must first be created.',
    error_a0014 = 'The particle emitter must first be created.';

// Track particle systems
var g_ParticleSystem = -1,
    g_ParticleType = [],
    g_ParticleEmit = [];


function action_execute_script()                { ErrorFunction("action_execute_script()"); }
function action_show_info()                     { ErrorFunction("action_show_info()"); }
function action_show_video()                    { ErrorFunction("action_show_video()"); }

function action_unknown()                       {}
function action_path_old()                      { action_unknown(); }
function action_draw_font()                     { action_unknown(); }
function action_draw_font_old()                 { action_unknown(); }
function action_fill_color()                    { action_unknown(); }
function action_line_color()                    { action_unknown(); }
function action_highscore()                     { action_unknown(); }

function action_if_question(_arg)
{ 
    return show_question(_arg);
}

function action_set_relative(rel)
{
    Argument_Relative = (rel < 0.5) ?  false : true;
}


function action_set_cursor(_spr, _show) {
	window_set_cursor(_spr);
	g_CurrentCursor = _spr;
	if( !_show ){
        EnableCursor(false);
	}else{
        EnableCursor(true);
	}
}


function action_set_sprite(_inst, _spr, _scale)
{
    // Left in for compatibility
    var sprIndex = Round(_spr);
    if (sprite_exists(sprIndex))
    {
        _inst.sprite_index = sprIndex;
    }
    
    if (_scale > 0 )
    {
        _inst.image_xscale = _scale;
        _inst.image_yscale = _scale;
    }
}

function action_set_motion(_inst, _dir, _val)
{
    if ( true == Argument_Relative )
    {
        _inst.AddTo_Speed(_dir, _val);
    }
    else
    {
        _inst.direction = _dir;
        _inst.speed = _val;
    }
}

function action_set_hspeed(_inst, _speed)
{
    if ( Argument_Relative )
    {
        _inst.hspeed = _inst.hspeed + _speed;
    }
    else
    {
        _inst.hspeed = _speed;
    }
}

function action_set_vspeed(_inst, _speed)
{
    if ( Argument_Relative )
    {
        _inst.vspeed = _inst.vspeed+_speed;
    }
    else
    {
        _inst.vspeed = _speed;
    }
}

function action_set_gravity(_inst, _gdir, _gravity)
{
    if (true == Argument_Relative )
    {
        _inst.gravity_direction += _gdir;
        _inst.gravity += _gravity;
    }
    else
    {
        _inst.gravity_direction = _gdir;
        _inst.gravity = _gravity;
    }
}

function action_set_friction(_inst, _friction)
{
    if (true == Argument_Relative )
    {
        _inst.friction += _friction;
    }
    else
    {
        _inst.friction = _friction;
    }
}

function action_move(_inst, direction, size)
{ 
    var b = false;
	var d = 0;

    // Check whether any direction allowed
    if (direction.length != 9)
    {
        debug("Incorrect argument for action_move()");
        return;
    }  

    for ( d=0 ; d<9 ; d++ ) 
    {
	    b = ((true==b) || (direction[d] == '1')) ? true : false;
    }
    
    if ( true != b ) { 
        return;
    }

    // Adapt the speed
    if ( true == Argument_Relative )
    {
        _inst.speed = _inst.speed + size;
    }
    else
    {
        _inst.speed = size ;
    }

    // Find a valid direction    
    do
    {
	    d = floor(YYRandom(9));
    } while ( !(direction[d] == '1') );

    switch(d)
    {
        case 0: _inst.direction = 225; break;
        case 1: _inst.direction = 270; break;
        case 2: _inst.direction = 315; break;
        case 3: _inst.direction = 180; break;
	    case 4: { _inst.direction = 0; _inst.speed = 0; break; }
        case 5: _inst.direction = 0; break;
        case 6: _inst.direction = 135; break;
        case 7: _inst.direction = 90; break;
        case 8: _inst.direction = 45; break;
    }    
}

function action_move_point(_inst, _x, _y, _speed)
{     
    if ( true == Argument_Relative )
    {
        move_towards_point(_inst, _x + _inst.x, _y + _inst.y, _speed);
       }
    else
    {
        move_towards_point(_inst, _x, _y, _speed);
    }
}

function action_move_to(_inst, _x, _y)
{
    if ( true == Argument_Relative )
    {
        _inst.SetPosition(_x + _inst.x, _y + _inst.y);
    }
    else
    {
        _inst.SetPosition(_x, _y);
    }
}

function action_move_start(_inst)
{
    _inst.SetPosition(_inst.xstart, _inst.ystart);
}

function action_move_random(_inst, _sx, _sy)
{
    move_random(_inst, _sx, _sy);
}

function action_snap(_inst, _hsnap, _vsnap)
{
    move_snap(_inst, _hsnap, _vsnap);
}
    
function action_wrap(_inst, _wrap)
{
    var wrap = Round(_wrap);
    _inst.wrap((wrap == 0) || (wrap == 2) ? true : false, (wrap == 1) || (wrap == 2) ? true : false);
}

function action_reverse_xdir(_inst)
{
    _inst.hspeed = -_inst.hspeed;
}

function action_reverse_ydir(_inst)
{
    _inst.vspeed = -_inst.vspeed;
}

function action_move_contact(_inst, _dir, _maxdist, _useall) 
{    
    move_contact(_inst, _dir, _maxdist, _useall);
}

function action_bounce(_inst, _adv, _useall)                        
{ 
    Command_Bounce(_inst, (_adv >= 0.5) ? true : false, (_useall == 1) ? true : false);
}

function action_kill_object(_inst)
{
    instance_destroy(_inst );
}

function action_create_object(_inst, _objid, _x, _y)
{
    var objid  = Round(_objid);
	if (true != object_exists(objid))
	{	    
		debug("Creating existence for non-existent object: " + objid.toString());
		return;
	}
        
    var inst = null;
	if ( true == Argument_Relative )
	{
		inst = g_RunRoom.GML_AddInstance(_x + _inst.x, _y + _inst.y, objid);
	}
	else
	{
		inst = g_RunRoom.GML_AddInstance(_x, _y, objid);
	}

    inst.PerformEvent(EVENT_PRE_CREATE, 0, inst, inst);
	inst.PerformEvent(EVENT_CREATE, 0, inst, inst);
	inst.created = true;
}

function action_create_object_motion(_inst, _objid, _x, _y, _speed, _dir)
{    
    var objid = Round(_objid);
	if (true != object_exists(objid))
	{
		debug("Creating instance for non-existent object: "  + objid);
		return;
	}

    var inst = null;
	if ( true == Argument_Relative )
	{
		inst = g_RunRoom.GML_AddInstance(_x + _inst.x, _y + _inst.y, objid);
	}
	else
	{
		inst = g_RunRoom.GML_AddInstance(_x, _y, objid);
	}

	inst.speed = _speed;
    inst.direction =_dir;
    inst.PerformEvent(EVENT_PRE_CREATE, 0, inst, inst);
	inst.PerformEvent(EVENT_CREATE, 0, inst, inst);
	inst.created = true;
}

function action_create_object_random(_inst, _objid0, _objid1, _objid2, _objid3, _x, _y)
{
    if (!object_exists(_objid0 | 0) && !object_exists(_objid1 | 0) && !object_exists(_objid2  | 0) && !object_exists(_objid3 | 0))
    {
		return;
	}

	while ( true )
	{		
		var n = ~~YYRandom(4);
		var id = arguments[n + 1] | 0;
		if (!object_exists(id)) {
		    continue;
		}

        var inst;
		if (true == Argument_Relative)
		{
			inst = g_RunRoom.GML_AddInstance(_x + _inst.x, _y + _inst.y, id);
		}
		else
		{
			inst = g_RunRoom.GML_AddInstance(_x, _y, id);
		}

        inst.PerformEvent(EVENT_PRE_CREATE, 0, inst, inst);
		inst.PerformEvent(EVENT_CREATE, 0, inst, inst);
	    inst.created = true;
	    return;
	}
}

function action_sprite_set(_inst, _spr, _subimg, _imgspeed)
{
    var sprIndex = Round(_spr);
    if (sprite_exists(sprIndex)) {
        _inst.sprite_index = sprIndex;
    }
    
    if (_subimg >= 0) {    
        _inst.image_index = _subimg;        
    }
        
    _inst.image_speed = _imgspeed;
}

function action_sprite_color(_inst, _col, _alpha)
{
    _inst.image_blend = Round(_col);
    _inst.image_alpha = _alpha;    
}
var action_sprite_colour = action_sprite_color;


function action_sound(_snd, _loop) {
    if (g_AudioModel == Audio_WebAudio) {
        var snd = Round(_snd);
        audio_play_sound(snd, 1, _loop >= 0.5 ? true : false);
/* audio_music fns DEPRECATED
       switch (audio_get_type(snd)) {
            case 0:
                audio_play_sound(snd, 1, _loop >= 0.5 ? true : false);
                break;
            case 1:
                audio_play_music(snd, _loop >= 0.5 ? true : false);
                break;
        } // end switch
*/        
    }
    else {
        var snd = Round(_snd);
        if (_loop >= 0.5) {
            g_pSoundManager.Loop(snd);
        }
        g_pSoundManager.Play(snd);
    }
}

function action_set_alarm(_inst, _time, _alarm)                     
{
    var alarm = Round(_alarm);
    var time = Round(_time);
    if (!Argument_Relative || (_inst.get_timer(alarm) < 0) )
	{
		_inst.set_timer(alarm, time);
	}
	else
	{
		_inst.set_timer(alarm, _inst.get_timer(alarm) + time);
	}
}

function action_end_game()
{
    game_end();
}

function action_restart_game()                  
{
    game_restart();    
}

function action_if_dice(_arg)
{    
    var Result;
    if (_arg <= 1 )
    {
        Result = 1;
    }
    else
    {
        Result = (YYRandom(Round(1000*_arg)) <= 1000) ? 1 : 0;
    }
    return Result;
}

function action_if_variable()                   
{ 
    var r = 0;
    if (typeof(arguments[0]) != typeof(arguments[1]))
    {
        // It's fine to compare a boolean against a number so convert if necessary
        if ((typeof(arguments[0] == "boolean") && (typeof(arguments[1]) == "number"))) {
            r = (arguments[0] == true) ? (1 - arguments[1]) : (0 - arguments[1]);
        }
        else if ((typeof(arguments[1] == "boolean") && (typeof(arguments[0]) == "number"))) {
            r = (arguments[1] == true) ? (arguments[0] - 1) : (arguments[0] - 0);
        }
        else {
            debug(error_a0006);
            return;
        }        
    }
    else {
        if (typeof(arguments[0]) == "string")
        {
            // From the C => "r = strcmp( _val1.str, _val2.str)"
            r = (arguments[0] == arguments[1]) ? 0 : 1;
        }
        else
        {
            r = arguments[0] - arguments[1];
        }
    }
    
    var result;
    if (Round(arguments[2]) == 1)
    {
        result = (r < 0) ? 1 : 0;
    }
    else if (Round(arguments[2]) == 2)
    {
        result = (r > 0) ? 1 : 0;
    }
    else if (Round(arguments[2]) == 3)
    {
        result = (r <= 0) ? 1 : 0;
    }
    else if (Round(arguments[2]) == 4)
    {
        result = (r >= 0) ? 1 : 0;
    }
    else
    {
        result = (r == 0) ? 1 : 0;
    }
    return result;
}

function action_draw_variable(_inst, _var, _x, _y)
{
    var str = "";    
	if (typeof(arguments[0]) == "number")
	{
		if (_var == Round(_var))
		{
			str = (Round(_var) | 0).toString();
		}
		else
		{
			str = _var.toFixed(2).toString(); // should be 10.2 and not hard-coded like this
		}
	}
	else
	{
		str = _var.toString();
	}


	if (Argument_Relative )
	{
		draw_text(_x + _inst.x, _y + _inst.y, str);
	}
	else
	{
		draw_text(_x, _y, str);
	}
}

function action_set_score(_score)
{
    if (Argument_Relative)
    {
        g_pBuiltIn.score += Round(_score);
    }
    else
    {
        g_pBuiltIn.score = Round(_score);
    }
}

function action_if_score()
{    
    var result;
    if (Round(arguments[1]) == 1)
    {
        result = (g_pBuiltIn.score < arguments[0]) ? 1 : 0;
    }
    else if (Round(arguments[1]) == 2)
    {
        result = (g_pBuiltIn.score > arguments[0]) ? 1 : 0;
    }
    else
    {
        result = (g_pBuiltIn.score == arguments[0]) ? 1 : 0;
    }
    return result;
}

function action_draw_score(_inst, _x, _y, _score_str)
{
    var scoreStr = "";
    if (_score_str)
    {
        scoreStr = _score_str;
    }

    var score = scoreStr + g_pBuiltIn.score.toString();	
	if (Argument_Relative)
	{
		draw_text(_x + _inst.x, _y + _inst.y, score);
	}
	else
	{
		draw_text(_x, _y, score);
	}
}

function action_set_life(_lives)                      
{
	var oldlives = g_pBuiltIn.lives;
    if ( true == Argument_Relative )
    {
        g_pBuiltIn.lives += Round(_lives);
    }
    else
    {
        g_pBuiltIn.lives = Round(_lives);
    }

    if ((oldlives > 0) && (g_pBuiltIn.lives <= 0) ) 
    {
    	g_pInstanceManager.PerformEvent(EVENT_OTHER_NOLIVES, 0);    
    }
}

function action_if_life()
{
    var result;
    if (Round(arguments[1]) == 1)
    {
        result = (g_pBuiltIn.lives < arguments[0]) ? 1 : 0;
    }
    else if (Round(arguments[1]) == 2)
    {
        result = (g_pBuiltIn.lives > arguments[0]) ? 1 : 0;
    }
    else
    {
        result = (g_pBuiltIn.lives == arguments[0]) ? 1 : 0;
    }
    return result;
}

function action_draw_life(_inst, _x, _y, _life_str)
{
    var lifeStr = _life_str;
    if (!lifeStr)
    {
        lifeStr = "";
    }
    
    var lives = lifeStr + g_pBuiltIn.lives.toString();
	if (Argument_Relative )
	{
		draw_text(_x + _inst.x, _y + _inst.y, lives);
	}
	else
	{
		draw_text(_x, _y, lives);
	}
}

function action_draw_life_images(_inst, _x, _y, _spr)
{    
    if (sprite_exists(Round(_spr)))
    {
        var spr = g_pSpriteManager.Get(Round(_spr));
        var w = spr.width;
        for (var i=0; i < g_pBuiltIn.lives; i++)
        {
            if (Argument_Relative)
	        {
	        	spr.Draw(0, _x + _inst.x + (i*w), _y + _inst.y, 1, 1, 0, clWhite, 1);
	        }
            else
	        {
	        	spr.Draw(0, _x + (i*w), _y, 1, 1, 0, clWhite, 1);
	        }
	    }
    }
}

function action_set_health(_inst, _health)                    
{
    var oldhealth = 0.0;

    oldhealth = g_pBuiltIn.health;
    if ( true == Argument_Relative )
    {
        g_pBuiltIn.health += _health;
    }
    else
    {
        g_pBuiltIn.health = _health;
    }

    if ((oldhealth > 0) && (g_pBuiltIn.health <= 0))
    {
        g_pInstanceManager.PerformEvent(EVENT_OTHER_NOHEALTH, 0);    	
    }
}

function action_if_health(_inst, _value, _op)
{
	var result;
	_op = ~ ~_op;
	if (_op == 1)
    {
    	result = (g_pBuiltIn.health < _value) ? 1 : 0;
    }
    else if (_op == 2)
    {
    	result = (g_pBuiltIn.health > _value) ? 1 : 0;
    }
    else
    {
    	result = (g_pBuiltIn.health == _value) ? 1 : 0;
    }
    return result;
}
  
function action_set_caption(_show_score_caption, _score_caption, _show_lives_caption, _lives_caption, _show_health_caption, _health_caption)
{    
    g_pBuiltIn.show_score = Round(_show_score_caption) == 1 ? true : false;        
    g_pBuiltIn.caption_score = _score_caption;
        
    g_pBuiltIn.show_lives = Round(_show_lives_caption) == 1 ? true : false;
    g_pBuiltIn.caption_lives = _lives_caption;
    
    g_pBuiltIn.show_health = Round(_show_health_caption) == 1 ? true : false;
    g_pBuiltIn.caption_health = _health_caption;       
}

function action_draw_sprite(_inst, _spr, _x, _y, _subimg)
{    
    if (!sprite_exists(Round(_spr)) )
    {
	    debug(error_a0004);
	    return; 
    }
 
    var subimg;
    if (_subimg < 0) {
        subimg = _inst.image_index;
    }
    else {
        subimg = Math.floor(_subimg);
    }
    
    var spr = g_pSpriteManager.Get(Round(_spr));
    if (Argument_Relative)
    {        
        spr.Draw(subimg, _x + _inst.x, _y + _inst.y, 1, 1, 0, clWhite, 1);
    }
    else
    {
        spr.Draw(subimg, _x, _y, 1, 1, 0, clWhite, 1);
    }
}

function action_draw_background(_inst, _bg, _x, _y, _tiled)
{

    //Fritz: Seems to have been disabled at some point in the past & throwing multiple errors so going to nuke it
    ErrorFunction("action_draw_background()");
    /*
    if ( true != Background_Exists(Round(_bg)) )
    {
        debug(error_a0005);
        return;
    }
    
    var background = g_pBackgroundManager.Get(Round(_bg));
    var tiled = (_tiled >= 0.5) ? true : false;
    */
/*    
    if (Argument_Relative)
    {        
        // bg.DrawTiled(_x + _inst.x, _y + _inst.y, 1.0, 1.0, tiled, tiled, 0,0, g_RunRoom.GetWidth(), g_Run_Room.GetHeight(), clWhite, 1.0);
    }
    else
    {
        // bg.DrawTiled(_x, _y, 1.0, 1.0, tiled, tiled, 0,0, g_RunRoom.GetWidth(), g_Run_Room.GetHeight(), clWhite, 1.0);
    }
*/    
}

function action_draw_text(_inst, _str, _x, _y)
{
    if (Argument_Relative)
    {
        draw_text(_x + _inst.x, _y + _inst.y, _str);
    }
    else
    {
        draw_text(_x, _y, _str);        
    }
}

function action_draw_text_transformed(_inst, _text, _x, _y, _xscale, _yscale, _rot)
{
    if (Argument_Relative)
    {
        draw_text_transformed(_x + _inst.x, _y + _inst.y, _text, _xscale, _yscale, _rot);
    }
    else
    {
        draw_text_transformed(_x, _y, _text, _xscale, _yscale, _rot);
    }
}

function action_draw_rectangle(_inst, _x, _y, _x2, _y2, _outline)
{
    if (Argument_Relative )
    {
        draw_rectangle(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, (_outline >= 0.5) ? true : false);
    }
    else
    {
        draw_rectangle(_x, _y, _x2, _y2, (_outline >= 0.5) ? true : false);
    }
}

function action_draw_line(_inst, _x, _y, _x2, _y2)
{
    if (Argument_Relative )
    {
        draw_line(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y);
    }
    else
    {
        draw_line(_x, _y, _x2, _y2);        
    }
}

function action_color(_col)
{              
    draw_set_color(_col);
}
var action_colour = action_color;


function action_font(_font, _halign)
{
    draw_set_font(_font);
    draw_set_halign(_halign);
}


function action_draw_health(_inst, _x, _y, _x2, _y2, _col, _col2)
{
    var col1 = 0;
    var col2 = 0;
    var col3 = 0;
    var col4 = 0;
    switch (Round(_col))
    {
        case 0: col1 = clBlack; break;
        case 1: col1 = clBlack; break;
        case 2: col1 = clGray; break;
        case 3: col1 = clSilver; break;
        case 4: col1 = clWhite; break;
        case 5: col1 = clMaroon; break;
        case 6: col1 = clGreen; break;
        case 7: col1 = clOlive; break;
        case 8: col1 = clNavy; break;
        case 9: col1 = clPurple; break;
        case 10: col1 = clTeal; break;
        case 11: col1 = clRed; break;
        case 12: col1 = clLime; break;
        case 13: col1 = clYellow; break;
        case 14: col1 = clBlue; break;
        case 15: col1 = clFuchsia; break;
        case 16: col1 = clAqua; break;
    }

    switch (Round(_col2))
    {
        case 0: { col2 = clRed; col3 = clYellow; col4 = clLime; } break;
        case 1: { col2 = clBlack; col3 = clGray; col4 = clWhite; } break;
        case 2: col2 = clBlack; break;
        case 3: col2 = clGray; break;
        case 4: col2 = clSilver; break;
        case 5: col2 = clWhite; break;
        case 6: col2 = clMaroon; break;
        case 7: col2 = clGreen; break;
        case 8: col2 = clOlive; break;
        case 9: col2 = clNavy; break;
        case 10: col2 = clPurple; break;
        case 11: col2 = clTeal; break;
        case 12: col2 = clRed; break;
        case 13: col2 = clLime; break;
        case 14: col2 = clYellow; break;
        case 15: col2 = clBlue; break;
        case 16: col2 = clFuchsia; break;
        case 17: col2 = clAqua; break;
    }

    if (Round(_col2) > 1)
    {
        col3 = col2; 
        col4 = col2;
    }
    
    if (Argument_Relative )
    {
        draw_healthbar_ex(_x+_inst.x,_y+_inst.y, _x2+_inst.x, _y2+_inst.y, g_pBuiltIn.health, col1, col2, col3, col4, 0, (_col >= 0.5)?true:false, true);
    }
    else
    {
    	draw_healthbar_ex(_x, _y, _x2, _y2, g_pBuiltIn.health, col1, col2, col3, col4, 0, (_col >= 0.5) ? true : false, true);
    }
}

function action_another_room(_room, _transition)
{
    room_goto(Round(_room));
}

function action_current_room()
{
    room_restart();
}

function action_previous_room()
{
    room_goto_previous();
}

function action_next_room()
{
    room_goto_next();
}

function action_if_previous_room()
{    
    return ((g_pBuiltIn.get_current_room() != g_pBuiltIn.room_first) ? 1 : 0);
}

function action_if_next_room()
{
    return ((g_pBuiltIn.get_current_room() != g_pBuiltIn.room_last) ? 1 : 0);
}

function action_partsyst_create(_depth) 
{
    if (g_ParticleSystem < 0) {
        g_ParticleSystem = ParticleSystem_Create();
    }
	ParticleSystem_Clear(g_ParticleSystem);
	ParticleSystem_Depth(g_ParticleSystem, Round(_depth));
		
    g_ParticleType = new Array(16);
    g_ParticleEmit = new Array(16);
	for (var i = 0 ; i < 16; i++ ) {
	    g_ParticleType[i] = -1;
	    g_ParticleEmit[i] = -1;
	}
}
    
function action_partsyst_destroy()
{
    if (g_ParticleSystem >= 0) {
        ParticleSystem_Destroy(g_ParticleSystem);
    }
    g_ParticleSystem = -1;
}

function action_partsyst_clear()
{
    if (g_ParticleSystem >= 0) {
        ParticleSystem_Particles_Clear(g_ParticleSystem);
    }
}

function action_parttype_create_old(_type, _shape, _sizeMin, _sizeMax, _colStart, _colEnd)
{
    var type = Round(_type);
    var shape = Round(_shape);
    var colStart = Round(_colStart);
    var colEnd = Round(_colEnd);

	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}
	if (g_ParticleType[type] < 0 ) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];
	ParticleType_Shape(pt, shape);
	ParticleType_Size(pt, _sizeMin, _sizeMax, 0, 0);
	ParticleType_Color2(pt, colStart, colEnd);
}

function action_parttype_create(_type, _shape, _spr, _sizeMin, _sizeMax, _sizeIncr)
{    
    var type = Round(_type);
	var shape = Round(_shape);
	var spr = Round(_spr);

	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}
	
	if (g_ParticleType[type] < 0) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];
	ParticleType_Shape(pt, shape);
	ParticleType_Sprite(pt, spr, true, false, false);
	ParticleType_Size(pt, _sizeMin, _sizeMax, _sizeIncr, 0);
}

function action_parttype_color(_type, _mixCol, _colStart, _colEnd, _alphaStart, _alphaEnd)
{    
    var type = Round(_type);
    var mixCol = Round(_mixCol);    
    var colStart = Round(_colStart);
    var colEnd = Round(_colEnd);
    
	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}
    if (g_ParticleType[type] < 0 ) {
        g_ParticleType[type] = ParticleType_Create();
    }
    var pt = g_ParticleType[type];
    if (mixCol == 0)
    {
        ParticleType_Colour_Mix(pt, colStart, colEnd);
    }
    else
    {
        ParticleType_Color2(pt, colStart, colEnd);
    }
    ParticleType_Alpha2(pt, _alphaStart, _alphaEnd);
}
var action_parttype_colour = action_parttype_color;

function action_parttype_life(_type, _lifeMin, _lifeMax)
{
    var type = Round(_type);
    var lifeMin = Round(_lifeMin);
    var lifeMax = Round(_lifeMax);

	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}
	if (g_ParticleType[type] < 0 ) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];
	ParticleType_Life(pt, lifeMin, lifeMax);
}

function action_parttype_speed(_type, _speedMin, _speedMax, _dirMin, _dirMax, _speedIncr)
{    
    var type = Round(_type);

	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}	
	if (g_ParticleType[type] < 0 ) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];
	ParticleType_Speed(pt, _speedMin, _speedMax, -_speedIncr, 0);
	ParticleType_Direction(pt, _dirMin, _dirMax, 0, 0);
}

function action_parttype_gravity(_type, _gravStrength, _gravDir)
{   
    var type = Round(_type);
 
	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}	
	if (g_ParticleType[type] < 0 ) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];	
	ParticleType_Gravity(pt, _gravStrength, _gravDir);
}

function action_parttype_secondary(_type, _stepType, _stepNumber, _deathType, _deathNumber)
{
    var type = Round(_type);    
    var stepNumber = Round(_stepNumber);
    var stepType = Round(_stepType);
    var deathNumber = Round(_deathNumber);
    var deathType = Round(_deathType);
 
	if (g_ParticleSystem < 0) {
	    g_ParticleSystem = ParticleSystem_Create();
	}	
	if (g_ParticleType[type] < 0 ) {
	    g_ParticleType[type] = ParticleType_Create();
	}
	var pt = g_ParticleType[type];
	
	ParticleType_Step(pt, stepNumber, g_ParticleType[stepType]);
	ParticleType_Death(pt, deathNumber, g_ParticleType[deathType]);
}

function action_partemit_create(_emit, _shape, _xmin, _xmax, _ymin, _ymax)
{    
    var emit = Round(_emit);
    var shape = Round(_shape);

	if (g_ParticleSystem < 0) { 
	    g_ParticleSystem = ParticleSystem_Create();
	}
	if (g_ParticleEmit[emit] < 0 ) {
	    g_ParticleEmit[emit] = ParticleSystem_Emitter_Create(g_ParticleSystem);
	}
    var pe = g_ParticleEmit[emit];
    ParticleSystem_Emitter_Region(g_ParticleSystem, pe, _xmin, _xmax, _ymin, _ymax, shape, PART_EDISTR_LINEAR);
}

function action_partemit_destroy(_emit)
{
    var emit = Round(_emit);

    if (g_ParticleSystem < 0) {
        g_ParticleSystem = ParticleSystem_Create();
    }
    if (g_ParticleEmit[emit] < 0 ) {
        return;
    }
    var pe = g_ParticleEmit[emit];
    ParticleSystem_Emitter_Destroy(g_ParticleSystem, pe);
}

function action_partemit_burst(_emit, _type, _number)
{
    var emit = Round(_emit);
    var type = Round(_type);
    var number = Round(_number);

    if (g_ParticleSystem < 0) {
        g_ParticleSystem = ParticleSystem_Create();
    }
    if (g_ParticleEmit[emit] < 0 )
    {
        debug(error_a0014);
        return;
    }
    var pe = g_ParticleEmit[emit];
    ParticleSystem_Emitter_Burst(g_ParticleSystem, pe, g_ParticleType[type], number);
}

function action_partemit_stream(_emit, _type, _number)
{
    var emit = Round(_emit);
    var type = Round(_type);
    var number = Round(_number);

    if (g_ParticleSystem < 0) {
        g_ParticleSystem = ParticleSystem_Create();
    }
    if (g_ParticleEmit[emit] < 0 )
    {
        debug(error_a0014);
        return;
    }
    var pe = g_ParticleEmit[emit];
    ParticleSystem_Emitter_Stream(g_ParticleSystem, pe, g_ParticleType[type], number);
}

function action_draw_gradient_hor(_inst, _x, _y, _x2, _y2, _col1, _col2)
{
    if (Argument_Relative)
    {
        draw_rectangle_gradient(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, _col1, _col2, false, false);
    }
    else
    {
        draw_rectangle_gradient(_x, _y, _x2, _y2, _col1, _col2, false, false);
    }
}

function action_draw_gradient_vert(_inst, _x, _y, _x2, _y2, _col1, _col2)
{
    if (Argument_Relative)
    {
        draw_rectangle_gradient(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, _col1, _col2, true, false);
    }
    else
    {
        draw_rectangle_gradient(_x, _y, _x2, _y2, _col1, _col2, true, false);
    }
}

function action_draw_arrow(_inst, _x, _y, _x2, _y2, _size)
{
    if (Argument_Relative)
    {
        draw_arrow(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, _size);
    }
    else
    {
        draw_arrow(_x, _y, _x2, _y2, _size);        
    }
}

function action_if_empty(_inst, _arg0, _arg1, _arg2)
{
    var val1 = _arg0;
	var val2 = _arg1;
    
    if (Argument_Relative) 
    {
	    val1 += _inst.x;
	    val2 += _inst.y;
    }
    if (Round(_arg2) == 0)
    {
	    return place_free(_inst, val1, val2) ? 1 : 0;
    }
    
	return place_empty(_inst, val1, val2) ? 1 : 0;
}

function action_if_collision(_inst, _arg0, _arg1, _arg2)
{
	var val1 = _arg0;
	var val2 = _arg1;
	if (Argument_Relative ) 
	{
		val1 += _inst.x;
		val2 += _inst.y;
	}

	if (Round(_arg2) == 0)
	{
		return !place_free(_inst, val1, val2) ? 1 : 0;
	}
	return !place_empty(_inst, val1, val2) ? 1 : 0;
}

function action_if(_arg0)
{
    return _arg0;
}

function action_if_number(_arg0, _arg1, _arg2)
{
    var n = instance_number(Round(_arg0));
    
    var result;
    if (Round(_arg2) == 1)
    {
        result = (n < _arg1) ? 1 : 0;
    }
    else if (Round(_arg2) == 2)
    {
        result = (n > _arg1) ? 1 : 0;
    }
    else
    {
        result = (n == _arg1) ? 1 : 0;
    }
    
    return result;
}

function action_if_object(_inst, _obj, _x, _y)
{     
    if (Argument_Relative)
    {
        return place_meeting(_inst, _x + _inst.x, _y + _inst.y, Round(_obj)) ? 1 : 0;
    }
    return place_meeting(_inst, _x, _y, Round(_obj)) ? 1 : 0;
}

function action_if_mouse(_arg0)
{
    var result;    
    switch (Round(_arg0))
    {
        case 1: result = (g_pIOManager.Button_Down(1) || g_pIOManager.Button_Released(1)) ? 1 : 0; break;
        case 2: result = (g_pIOManager.Button_Down(2) || g_pIOManager.Button_Released(2)) ? 1 : 0; break;
        case 3: result = (g_pIOManager.Button_Down(3) || g_pIOManager.Button_Released(3)) ? 1 : 0; break;
        default:result = (g_pIOManager.Button_Current_Get() == 0) ? 1 : 0;
    }
    
    return result;
}

function action_if_aligned(_inst, _x, _y)
{
    if (_x > 0)
    {        
        if (Math.abs(_inst.x - _x * Round(_inst.x / _x)) >= 0.001 ) {
            return 0;
        }
    }

    if (_y > 0)
    {
        if (Math.abs(_inst.y - _y * Round(_inst.y / _y)) >= 0.001 ) {
            return 0;
        }
    }

    return 1;
}

function action_path(_inst, _path, _speed, _atend, _relative)
{
    _inst.Assign_Path(Round(_path), _speed, 1, 0, (_relative >= 0.5) ? true : false, Round(_atend));
}

function action_path_end(_inst)
{
    _inst.Assign_Path(-1, 0, 1, 0, false, 0);
}

function action_path_position(_inst, _pos)
{
    if (Argument_Relative)
    {
        _inst.path_position += _pos;
    }
    else
    {
        _inst.path_position = _pos;
    }
}

function action_path_speed(_inst, _speed)
{
    if (Argument_Relative)
    {
        _inst.path_speed = _inst.path_speed + _speed;
    }
    else
    {
        _inst.path_speed = _speed;
    }
}

function action_linear_step(_inst, _x, _y, _stepsize, _checkall)
{
    if (Argument_Relative)
    {
        mp_linear_step(_inst, _x + _inst.x, _y + _inst.y, _stepsize, (_checkall >= 0.5) ? true : false);
    }
    else
    {
        mp_linear_step(_inst, _x, _y, _stepsize, (_checkall >= 0.5) ? true : false);
    }
}

function action_potential_step(_inst, _x, _y, _stepsize, _checkall)
{
    if (Argument_Relative)
    {
        mp_potential_step(_inst, _x + _inst.x, _y + _inst.y, _stepsize, (_checkall >= 0.5) ? true : false);
    }
    else
    {
        mp_potential_step(_inst, _x, _y, _stepsize, (_checkall >= 0.5) ? true : false);
    }
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_inst"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function action_inherited(_inst, _other) {

	if (!_inst) return;
	event_inherited(_inst, _other);
	
	/*if (!object_exists(_inst)) {
	    return;
	}
	var parent = _inst.pObject.pParent;
	if( _inst.pObject.pParent!=null )
	{
	    if (!object_exists(parent)) {
	        return;
	    }
	    parent.PerformEvent(Current_Event_Type, Current_Event_Number, _inst, _inst);
	}*/
}

function action_change_object(_inst, _newobj, _perform_events)                 
{
    instance_change(_inst, _newobj | 0, (_perform_events >= 0.5) ? true : false);
}

function action_kill_position(_inst, _x, _y)
{
    if (Argument_Relative)
    {
        position_destroy(_inst, _x + _inst.x, _y + _inst.y);
    }
    else
    {
        position_destroy(_inst, _x, _y);
    }
}

function action_end_sound(_snd) {

    if (g_AudioModel == Audio_WebAudio) {
        var snd = Round(_snd);

        audio_stop_sound(snd);
        
    }
    else {
        var snd = g_pSoundManager.Get(Round(_snd));
        if ((snd != null) && (snd != undefined)) {
            g_pSoundManager.Stop(_snd);
        }
        else {
            debug(error_a0003);
        }
    }
}

function action_if_sound(_snd) {
    if (g_AudioModel == Audio_WebAudio) {
        var snd = Round(_snd);

        return audio_is_playing(snd);

    }
    else {
        var snd = g_pSoundManager.Get(Round(_snd));
        if ((snd != null) && (snd != undefined)) {
            return (g_pSoundManager.SoundIsPlaying(_snd) ? 1 : 0);
        }
        return 0;
    }
}

function action_effect(_inst, _kind, _x, _y, _size, _col, _below)
{
    var ps = (_below < 0.5) ? ps_above : ps_false;
    
    if (Argument_Relative)
    {
        Effect_Create(ps, Round(_kind), _x + _inst.x, _y + _inst.y, Round(_size), Round(_col));
    }
    else
    {
        Effect_Create(ps, Round(_kind), _x, _y, Round(_size), Round(_col));
    }
}

function action_message(_message)
{
    alert(_message);
}

function action_sprite_transform(_inst, _sx, _sy, _angle, _dir)
{
    _inst.image_xscale = _sx;
    _inst.image_yscale = _sy;
    _inst.image_angle = _angle;
    if ((_dir == 1) || (_dir == 3)) {
        _inst.image_xscale = -_inst.image_xscale;
    }
    if ((_dir == 2) || (_dir == 3)) {
        _inst.image_yscale = -_inst.image_yscale;
    }
}

function action_sleep(_sleepTime, _refresh)
{
    if (_refresh >= 0.5 )
    {
        g_RunRoom.Draw();
    }

    Timing_Wait(_sleepTime);
}

function action_snapshot(_fname)
{
    surface_save(0, _fname);
}

function action_replace_sprite(_spr, _fname, _imgNum)
{
	if (!sprite_exists(Round(_spr)))
	{
		debug(error_a0008);
		return; 
	}

	if (!file_exists(_fname))
	{
		debug(error_a0009);
		return;
	}
    
	var spr = g_pSpriteManager.Get(Round(_spr));
	sprite_replace(Round(_spr), _fname, Round(_imgNum), spr.colcheck, spr.transparent, spr.smooth, spr.preload, spr.xOrigin, spr.yOrigin);
}

function action_replace_sound(_snd, _fname)
{
    if (!sound_exists(Round(_snd)))
    {
	    debug(error_a0008);
	    return; 
    }
    if ( true != file_exists(_fname))
    {
        debug(error_a0009);
        return;
    }
    
    var snd = g_pSoundManager.Get(Round(_snd));
    sound_replace(Round(_snd), _fname, snd.kind, snd.preload);
}

function action_replace_background(_bg, _fname)
{
    if (!background_exists(Round(_bg)) )
    {
        debug(error_a0008);
        return;
    }
    if (!file_exists(_fname)) //Fritz: was FileExists() which doesn't
    {
        debug(error_a0009);
        return; 
    }
    var back = g_pBackgroundManager.Get(Round(_bg));
    background_replace(Round(_bg), _fname, back.transparent, back.smooth, back.preload);
}

function action_set_timeline(_inst, _index, _pos)
{
    action_timeline_set(_inst, _index, _pos, 0, 0);    
}

function action_timeline_set(_inst, _index, _pos, _paused, _loop)
{
    _inst.timeline_index = _index;
    _inst.timeline_position = _pos;
    _inst.timeline_paused = _paused;
    _inst.timeline_looped = _loop;
}

function action_set_timeline_position(_inst, _pos)
{
    if (Argument_Relative)
    {
        _inst.timeline_position += _pos;
    }
    else
    {
        _inst.timeline_position = _pos;
    }
}

function action_set_timeline_speed(_inst, _speed)
{
    if (Argument_Relative)
    {
        _inst.timeline_speed += _speed;
    }
    else
    {
        _inst.timeline_speed = _speed;
    }
}

function action_timeline_start(_inst)
{
    _inst.timeline_paused = false;
}

function action_timeline_stop(_inst)
{
    _inst.timeline_paused = true;
    _inst.timeline_position = 0;
}

function action_timeline_pause(_inst)
{
    _inst.timeline_paused = true;
}

function action_draw_ellipse(_inst, _x, _y, _x2, _y2, _outline)
{
    if (Argument_Relative)
    {
        draw_ellipse(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, (_outline >= 0.5) ? true : false);
    }
    else
    {
        draw_ellipse(_x, _y, _x2, _y2, (_outline >= 0.5) ? true : false);
    }
}

function action_draw_ellipse_gradient(_inst, _x, _y, _x2, _y2, _col1, _col2) {

    if (Argument_Relative) 
    {
        draw_ellipse_gradient(_x + _inst.x, _y + _inst.y, _x2 + _inst.x, _y2 + _inst.y, _col1, _col2, false);
    }
    else 
    {
        draw_ellipse_gradient(_x, _y, _x2, _y2, _col1, _col2, false);
    }
}

function action_splash_web(_url) 
{
    YoYo_OpenURL(_url);
}

function action_webpage(_url) 
{
    YoYo_OpenURL(_url);
}

function action_highscore_show(_background, _border, _col1, _col2, _fontname, _fontsize, _fontstyle)
{
    var x, y;
    x = (g_pBuiltIn.room_width / 2) - 100;    
    y = (g_pBuiltIn.room_height / 2) - 100;        
    draw_highscore(x, y, x + 200, y + 200);
}

// #############################################################################################
/// Function:<summary>
///          	Action to clear hiscores.
///          </summary>
// #############################################################################################
function action_highscore_clear()
{
	highscore_clear();
	highscore_save();
}


// #############################################################################################
/// Function:<summary>
///          	Action to toggle/clear/set fullscreen mode
///          </summary>
///
/// In:		<param name="_mode">0,1 or 2</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function action_fullscreen(_mode) {
/*
	var full;
	
	// toggle?
	if (_mode == 0)
	{
		if (window_get_fullscreen())
		{
			full = false;
		} else
		{
			full = false;
		}
	} else if (_mode == 1)
	{
		full = false;			// into windowed
	} else if (_mode == 2)
	{
		full = true;			// into fullscreen
	} else
		return;


	window_set_fullscreen(full);
*/
}


