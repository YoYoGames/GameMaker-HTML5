
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Game.js
// Created:         25/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     General gaming functions
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 25/02/2011		V1.0        MJD     1st version.
// 
// **********************************************************************************************************************

var TimingMethod = 1;       //tm_countvsyncs=1, tm_sleep=0

// #############################################################################################
/// Function:<summary>
///          	Simple "sleep"
///          </summary>
///
/// In:		<param name="_time"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sleep(_time) 
{
	Timing_Wait(_time*1000);
}

function scheduler_resolution_set(_val)
{

}

function scheduler_resolution_get()
{
    return -1;
}

// #############################################################################################
/// Function:<summary>
///          	Set timing method. Vsync counting, or "old" timer
///          </summary>
///
/// In:		<param name="_method">method to use</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function display_set_timing_method(_method){
    TimingMethod = yyGetInt32(_method);
}

// #############################################################################################
/// Function:<summary>
///          	Get timing method. 
///          </summary>
/// Out:	<returns>
///				0 or 1 for the timing method supposed to be getting used.
///			</returns>
// #############################################################################################
function display_get_timing_method() {
    return TimingMethod;
}
// #############################################################################################
/// Function:<summary>
///             get a list of instances for this object (recursive)
///          </summary>
///
/// In:		 <param name="_obj">object ID to use</param>
/// Out:	 <returns>
///				list of active instances - recursive
///			 </returns>
// #############################################################################################
//function    instance_number( _obj )
//{   
//    return g_pObjectManager.Get(_obj).Instances_Recursive.length;
//}


// #############################################################################################
/// Function:<summary>
///          	Hiscore container object
///          </summary>
// #############################################################################################
/** @constructor */
function yy_HiScoreContainer(_value, _name) {
	this.name = _name;
	this.value = _value;
}



// #############################################################################################
/// Function:<summary>
///          	Load hiscores
///          </summary>
// #############################################################################################
function highscore_load() {

	var file = LoadTextFile_Block("hiscores_data_", true);
	if (file != null)
	{
        try{
		    var HighScores = JSON.parse(file);

		    var i;
		    for (i = 0; i < MAX_HIGHSCORE; i++)
		    {
			    g_HighScoreNames[i] = HighScores[i].name;
			    g_HighScoreValues[i] = HighScores[i].value;
		    }
        } catch (ex) {
            yyError("Error: reading hiscore JSON");
        }
	}
}



// #############################################################################################
/// Function:<summary>
///          	Save hiscores
///          </summary>
// #############################################################################################
function highscore_save() {
	var HighScores = {};
	var i;
	for (i = 0; i < MAX_HIGHSCORE; i++)
	{
		HighScores[i] = new yy_HiScoreContainer(g_HighScoreValues[i], g_HighScoreNames[i]);
	}
	var file = JSON.stringify(HighScores);
	SaveTextFile_Block("hiscores_data_", file);
}


// #############################################################################################
/// Function:<summary>
///          	Draws the highscore table in the room in the indicated box, using the current font. 
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_highscore(_x1, _y1, _x2, _y2)
{
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);

	var halign = g_pFontManager.halign;
	var dy = (_y2 - _y1) / MAX_HIGHSCORE;
	for (var i = 0; i < MAX_HIGHSCORE; i++)
	{
		// Look for insertion point
		g_pFontManager.halign = 0;							// LEFT align		
		draw_text(_x1, _y1, g_HighScoreNames[i]);
		g_pFontManager.halign = 2; 							// RIGHT align		
		draw_text(_x2, _y1, g_HighScoreValues[i].toString());

		_y1 += dy;
	}
	g_pFontManager.halign = halign;
}




// #############################################################################################
/// Function:<summary>
///          	Clears the highscore list.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function highscore_clear() 
{
    g_HighScoreValues[0]=
    g_HighScoreValues[1]=
    g_HighScoreValues[2]=
    g_HighScoreValues[3]=
    g_HighScoreValues[4]=
    g_HighScoreValues[5]=
    g_HighScoreValues[6]=
    g_HighScoreValues[7]=
    g_HighScoreValues[8]=
    g_HighScoreValues[9]=0;
    g_HighScoreNames[0]=
    g_HighScoreNames[1]=
    g_HighScoreNames[2]=
    g_HighScoreNames[3]=
    g_HighScoreNames[4]=
    g_HighScoreNames[5]=
    g_HighScoreNames[6]=
    g_HighScoreNames[7]=
    g_HighScoreNames[8]=
    g_HighScoreNames[9] = g_HighscoreNobody;
}

// #############################################################################################
/// Function:<summary>
///          	Adds a player with name str and score numb to the list.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_numb"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function highscore_add( _str,_numb ) 
{
    _numb = yyGetInt32(_numb);

    var highscoreString = yyGetString(_str);
    if (!highscoreString) {
        highscoreString = "";
    }
    
    for(var i=0;i<MAX_HIGHSCORE;i++)
    {
        // Look for insertion point
        if( _numb>g_HighScoreValues[i] ) {
        
            g_HighScoreValues.splice(i,0,_numb);           
            g_HighScoreNames.splice(i,0,highscoreString);
            
			// Remove the last one (which has now fallen off the bottom)
            g_HighScoreValues.splice(10,1);
            g_HighScoreNames.splice(10, 1);
            highscore_save();
            return;
        }
    }
}


// #############################################################################################
/// Function:<summary>
///          	Returns the score of the person on the given place (1-10). This can be used 
///				to draw your own highscore list.
///          </summary>
///
/// In:		<param name="_place"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function highscore_value(_place) 
{
    _place = yyGetInt32(_place);

	if (_place < 1 || _place >MAX_HIGHSCORE) return -1;
    return g_HighScoreValues[_place-1];
}


// #############################################################################################
/// Function:<summary>
///          	Returns the name of the person on the given place (1-10).
///          </summary>
///
/// In:		<param name="_place"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function highscore_name(_place) 
{
    _place = yyGetInt32(_place);

	if (_place < 1 || _place > MAX_HIGHSCORE) return "";
    return g_HighScoreNames[_place-1];
}


// #############################################################################################
/// Function:<summary>
///             LERP between to colours
///          </summary>
///
/// In:		 <param name="_col1">Colour #1</param>
///			 <param name="_col2">Colour #2</param>
///			 <param name="_value">LERP Value</param>
/// Out:	 <returns>
///				Merged TRGB value
///			 </returns>
// #############################################################################################
function Color_MergeRGB(_col1, _col2, _value)
{
	var r1,r2,g1,g2,b1,b2;

	r1 = (_col1>>16)&0xff;
	g1 = (_col1>>8)&0xff;
	b1 = (_col1&0xff);
	
	r2 = (_col2>>16)&0xff;
	g2 = (_col2>>8)&0xff;
	b2 = (_col2&0xff);
	
	
	var val2 = 1.0 - _value;
	var r = Round(r1*val2 + r2*_value);
	var g = Round(g1*val2 + g2*_value);
	var b = Round(b1*val2 + b2*_value);

	var col = ((r&0xff)<<16) | ((g&0xff)<<8) | (b&0xff);
	return col;
}

// #############################################################################################
/// Function:<summary>
///				LERPs between the two colors, value between 0 and 1 (0=col1, 1=col2)
///          </summary>
///
/// In:		 <param name="_col1">Colour #1</param>
///			 <param name="_col2">Colour #2</param>
///			 <param name="_value">LERP Value</param>
/// Out:	 <returns>
///				Merged TColor
///			 </returns>
// #############################################################################################
function Color_Merge(_col1, _col2, _value)
{        
	return Color_MergeRGB(_col1, _col2, _value);
}

// #############################################################################################
/// Function:<summary>
///				Multiplies two colors
///          </summary>
///
/// In:		 <param name="_col1">Colour #1</param>
///			 <param name="_col2">Colour #2</param>
/// Out:	 <returns>
///				Resulting color
///			 </returns>
// #############################################################################################
function Color_Multiply(_col1, _col2)
{
    return make_color_rgb(
		(color_get_red(_col1) * color_get_red(_col2)) / 255,
		(color_get_green(_col1) * color_get_green(_col2)) / 255,
		(color_get_blue(_col1) * color_get_blue(_col2)) / 255);
}

// #############################################################################################
/// Function:<summary>
///             Perform event
///          </summary>
///
/// In:		 <param name="_pInst">Instance to apply event to</param>
///			 <param name="_event">event to do</param>
///			 <param name="_subevent">SubEvent</param>
// #############################################################################################
function event_perform(_pInst, _pOther, _event, _subevent)
{
    _event = yyGetInt32(_event);
    _subevent = yyGetInt32(_subevent);

    if(YYInstanceof(_pInst) != "instance")
    {
        yyError("Attempt to dispatch event on non-instance object");
    }

    var oldforce = g_ForceTrigger;
    g_ForceTrigger = true;      // FORCE the callback to the trigger event
    
	var event = event_lookup(_event, _subevent);
	var index = event_array_index_lookup(_event, _subevent);
	_pInst.PerformEvent(event, index, _pInst, _pOther);

    g_ForceTrigger = oldforce;      // FORCE the callback to the trigger event
}


// #############################################################################################
/// Function:<summary>
///             Perform async event with ds_map
///          </summary>
///
/// In:		 <param name="_pInst">Instance to apply event to</param>
///			 <param name="_event">event to do</param>
///			 <param name="_ds_map">gml obj data</param>
// #############################################################################################
function event_perform_async(_pInst, _pOther, _event, _ds_map)
{
	var current_async_map = g_pBuiltIn.async_load
	
    _event = yyGetInt32(_event);
    _ds_map = yyGetInt32(_ds_map);
    g_pBuiltIn.async_load = _ds_map;
    g_pObjectManager.ThrowEvent(EVENT_OTHER,_event);
	
	ds_map_destroy(_ds_map);
	
	g_pBuiltIn.async_load = current_async_map;
}


// #############################################################################################
/// Function:<summary>
///             Performs events on an object using the given timeline at the event index given
///          </summary>
///
/// In:         <param name="_pInst">Instance to apply timeline event to</param>
///             <param name="_timelineInd">Timeline to use</param>
///             <param name="_eventInd">Event index</param>
/// Out:    <returns>
///               
///            </returns>
// #############################################################################################
function event_perform_timeline(_pInst, _other, _timelineInd, _eventInd)
{
    var timeline = g_pTimelineManager.Get(_timelineInd);
    if ((timeline != null) && (timeline != undefined))
    {
        var eventData = timeline.Events[_eventInd];
        if ((eventData != null) && (eventData != undefined))
        {
            // Call the event code associated with the timeline event
            eventData.Event(_pInst, _pInst);
        }
    }
}

// #############################################################################################
/// Function:<summary>
///          	This functions works the same as the function above except that this time you can 
///				specify events in another object. Note that the actions in these events are applied 
///				to the current instance, not to instances of the given object!
///          </summary>
///
/// In:		<param name="obj">Object ID to perform event with</param>
///			<param name="_event">Event type</param>
///			<param name="_subevent">Sub event type</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function event_perform_object(_pInst, _pOther, _obj, _event, _subevent) 
{
    _obj = yyGetInt32(_obj);
    _event = yyGetInt32(_event);
    _subevent = yyGetInt32(_subevent);

	var event = event_lookup(_event, _subevent);
	var index = event_array_index_lookup(_event, _subevent);

	var pObject = g_pObjectManager.Get(_obj);
	
	if(!pObject )
	{
	    yyError("Error: undefined object id passed to event_perform_object: " + _obj);
	}
	else
	{
	    var oldobj = Current_Object;
	    var oldtype = Current_Event_Type;
	    var oldnumb = Current_Event_Number;

	    Current_Object = pObject;
	    Current_Event_Type = event;
	    Current_Event_Number = index;

        var pCurrObj = pObject;
        while(pCurrObj != null)
        {
            // Check whether the object has the current event and if not
            // check the object's parent until the event is found.
            if(pCurrObj.PerformEvent(event, index, _pInst, _pOther))
            {
                break;
            }
            pCurrObj = pCurrObj.pParent;
        }

	    // Restore previous current object settings
	    Current_Object = oldobj;
	    Current_Event_Type = oldtype;
	    Current_Event_Number = oldnumb;
	}
}


var g_DontRun = true;
// #############################################################################################
/// Function:<summary>
///          	In the other events you can also define 16 user events. These are only performed 
///				if you call this function. numb must lie in the range 0 to 15.
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_subevent"></param>
///				
// #############################################################################################
function event_user(_pInst, _pOther, _subevent) {

    _subevent = yyGetInt32(_subevent);

	if (_subevent < 0 || _subevent > 15)
	{
		yyError("Error: illegal user event ID: " + _subevent);
	}
	_subevent += GML_ev_user0;
	event_perform(_pInst, _pOther, GML_EVENT_OTHER, _subevent);
}



// #############################################################################################
/// Function:<summary>
///          	Performs the inherited event. This only works if the instance has a parent object.
///          </summary>
///
/// In:		<param name="_pInst"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function event_inherited(_pInst, _pOther) {

    _pInst.PerformEventInherited(g_LastEvent, g_LastEventArrayIndex, _pOther);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of command-line parameters. The actual parameters can be retrieved 
///				with the following function.
///          </summary>
///
/// Out:	<returns>
///				The number of arguments passed into the web page
///			</returns>
// #############################################################################################
function parameter_count() {
	return g_ArgumentCount;
}

// #############################################################################################
/// Function:<summary>
///          	Returns command-line parameters n. The first parameter has index 1. The last one has index 
///          </summary>
///
/// In:		<param name="_index"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function parameter_string(_index) {

    _index = yyGetInt32(_index);

	if (_index < 0 || _index > g_ArgumentCount) return "";

	var s = g_ArgumentIndex[_index];
	if (g_ArgumentValue[_index] != null) s = s + "=" + g_ArgumentValue[_index];
	return s;
}


// #############################################################################################
/// Function:<summary>
///          	Get current language string, common to os_get_region/language
///          </summary>
// #############################################################################################
function get_language_string()
{
    var lang = "en";
    // Avoid obfuscation nastiness
    if (navigator["language"])
    {        
        lang = navigator["language"];
    }
    else if (navigator["userLanguage"])
    {
        lang = navigator["userLanguage"];
    }
    return lang;
}

// #############################################################################################
/// Function:<summary>
///          	Get current language
///          </summary>
///
/// Out:	<returns>
///				language string
///			</returns>
// #############################################################################################
function os_get_language() {

    var lang = get_language_string();
    var dashPos = lang.indexOf("-");
    if (dashPos >= 0) {
        lang = lang.substring(0, dashPos);
    }
    return lang; 
}

// #############################################################################################
/// Function:<summary>
///          	Get current region
///          </summary>
// #############################################################################################
function os_get_region()                            
{ 
    var region = "";
    var lang = get_language_string();    
    
    var dashPos = lang.indexOf("-");
    if (dashPos >= 0) {
        region = lang.substring(dashPos + 1, lang.length);
    }
    return region;
}

function os_check_permission()
{
}

function os_request_permission()
{
}


// #############################################################################################
/// Function:<summary>
///          	Enable/Disable double tap/click
///          </summary>
// #############################################################################################
function device_mouse_dbclick_enable(_enable) { }

// #############################################################################################
/// Function:<summary>
///          	base64 encode a string
///          </summary>
///
/// Out:	<returns>
///				The new Base64 string
///			</returns>
// #############################################################################################
function base64_encode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Rafał Kukawski (http://kukawski.pl)
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits;
    var i = 0;
    var ac = 0;
    var enc = "";
    var tmp_arr = [];

    if (!data) {
        return data;
    }

    data = yyGetString(data);

    if (typeof data !== "string") return undefined;
    
    data = UnicodeToUTF8(data);

    do { 
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}


// #############################################################################################
/// Function:<summary>
///          	Decode UTF8 to unicode
///          </summary>
///
/// Out:	<returns>
///				A UNICODE string
///			</returns>
// #############################################################################################
function UTF8ToUnicode(_txt)
{
    var res = "";
    var index = 0;
    while(index<_txt.length)
    {
        var v = 0;
        var chrCode = _txt.charCodeAt(index++);
        if ((chrCode & 0x80) == 0) {
            v = chrCode;

        } else if ((chrCode & 0xe0) == 0xc0) {
            v = (chrCode & 0x1f) << 6;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f);

        } else if ((chrCode & 0xf0) == 0xe0) {
            v = (chrCode & 0x0f) << 12;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f) << 6;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f);

        } else {
            v = (chrCode & 0x07) << 18;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f) << 12;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f) << 6;
            chrCode = _txt.charCodeAt(index++);
            v |= (chrCode & 0x3f);
        }
        if (v == 0x00) break;
        var chr = String.fromCharCode(v);
        res += chr;
    }
    return res;
}


// #############################################################################################
/// Function:<summary>
///          	base64 encode a string
///          </summary>
///
/// Out:	<returns>
///				The new Base64 string
///			</returns>
// #############################################################################################
function base64_decode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits;
    var i = 0;
    var ac = 0;
    var dec = "";
    var tmp_arr = [];
    
    if (!data) {
        return data;
    }

    data = yyGetString(data);

    data += '';
    do { 
        // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } 
        else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } 
        else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return UTF8ToUnicode(dec);
}



function base64_decode_unicode(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits;
    var i = 0;
    var ac = 0;
    var dec = "";
    var tmp_arr = [];

    if (!data) {
        return data;
    }

    data = yyGetString(data);

    data += '';
    do {
        // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        }
        else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        }
        else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return dec;
}


// #############################################################################################
/// Function:<summary>
///          	MD5 a unicode string 
///          </summary>
///
/// Out:	<returns>
///				The new MD5 string
///			</returns>
// #############################################################################################
function md5_string_unicode(string) { return hex_md5(str2rstr_utf16le(yyGetString(string))); }

// #############################################################################################
/// Function:<summary>
///          	MD5 a UTF8 string
///          </summary>
///
/// Out:	<returns>
///				The new MD5 string
///			</returns>
// #############################################################################################
function md5_string_utf8(string) { return hex_md5(yyGetString(string)); }

// #############################################################################################
/// Function:<summary>
///          	MD5 a whole file
///          </summary>
///
/// Out:	<returns>
///				The new MD5 string
///			</returns>
// #############################################################################################
function md5_file(fname) { return "unsupported"; }


// #############################################################################################
/// Function:<summary>
///          	Check to see if the network is connected
///          </summary>
///
/// Out:	<returns>
///				Always true....
///			</returns>
// #############################################################################################
function os_is_network_connected() 
{ 
    if (navigator != null && navigator != undefined) {
        return navigator["onLine"] ? 1.0 : 0.0;
    }
    return 1.0; 
}


// #############################################################################################
/// Function:<summary>
///          	Enable or Disable OS powersaving features
///          </summary>
///
// #############################################################################################
function os_powersave_enable(enable) {  }

// #############################################################################################
/// Function:<summary>
///          	Lock the current orientation of the display
///          </summary>
///
// #############################################################################################
function os_lock_orientation(enable) { }

function analytics_event( _event )
{
    _event = yyGetString(_event);

    try {
        if( g_pGMFile.Options.TrackingID )  //Google analytics
        {
            _gaq.push(['_trackEvent', 'GMEvent',_event] );
        }
        else if( g_pGMFile.Options.FlurryId )
        {
                FlurryAgent.logEvent( _event );
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch
    
}

function analytics_event_ext(_event) 
{
    _event = yyGetString(_event);

    try {
        var arguments = arguments;
        if( g_pGMFile.Options.TrackingID )  //Google analytics
        {
            //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
            if( arguments.length >=3)
            {
                //arg[0](_event) = action; arg[1] = opt_label, arg[2] = opt_value
                _gaq.push(['_trackEvent', 'GMEvent',_event, arguments[1], arguments[2]] );
            }
            else
            {
                _gaq.push(['_trackEvent', 'GMEvent',_event] );
            }
        }
        else if( g_pGMFile.Options.FlurryId )
        {
            //Flurry Event parameters can be passed in as an object where the key and value are non-blank strings;
            //A maximum of 10 event parameters per event is supported.
            if( (arguments.length >=3) && (arguments.length&1)==1)
            {
                var params = {};
                var numParams = arguments.length-1;
                if( numParams > 10 ) {
                    numParams = 10;
                }
                
                for(var i = 0; i < numParams; i+=2)
                {
                    params[ arguments[i+1] ] = arguments[i+2].toString();
                }
                FlurryAgent.logEvent( _event, params );
            }
            else
            {
                FlurryAgent.logEvent( _event );
            }
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch
}


// #############################################################################################
/// Function:<summary>
///          	Return the SHA1 of a string
///          </summary>
///
/// Out:	<returns>
///				SHA1 string
///			</returns>
// #############################################################################################
function sha1_string_unicode(_string) { return hex_sha1(str2rstr_utf16le(yyGetString(_string))); }

// #############################################################################################
/// Function:<summary>
///          	Return the SHA1 of a UTF8 string
///          </summary>
///
/// Out:	<returns>
///				SHA1 string
///			</returns>
// #############################################################################################
function sha1_string_utf8(_string) { return hex_sha1(yyGetString(_string)); }

// #############################################################################################
/// Function:<summary>
///          	Return the SHA1 of a UTF8 string
///          </summary>
///
/// Out:	<returns>
///				SHA1 string
///			</returns>
// #############################################################################################
function sha1_file(_fname) { return "unsupported"; }

//Nicked from http://pajhome.org.uk/crypt/md5/md5.html
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  //try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  //try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}


//and the sha-1 version from same place

function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}







/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

// #############################################################################################
/// Function:<summary>
///          	Perform the appropriate triplet combination function for the current iteration
///          </summary>
///
/// In:		<param name="t"></param>
///			<param name="b"></param>
///			<param name="c"></param>
///			<param name="d"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

// #############################################################################################
/// Function:<summary>
///          	Determine the appropriate additive constant for the current iteration
///          </summary>
///
/// In:		<param name="t"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function Resource_Find(_name, _array) {
    
    for (var index = 0; index < _array.length; index++)
    {
        var pObjStorage = _array[index];
        if (pObjStorage.pName == _name) {
            return index;
        }
    }
    return -1;
}

function Resource_Find_Shader(_name, _array) {
    
    for (var index = 0; index < _array.length; index++)
    {
        var pObjStorage = _array[index];
        if (pObjStorage.name == _name) {
            return index;
        }
    }
    return -1;
}

function Resource_Find_Script(_name, _array) {

    var gmlName = "gml_Script_"+ _name;
    var scriptId = -1;
    for (var index = 0; index < _array.length; index++)
    {
        var scrName = _array[index];
        if( scrName.endsWith(_name)){
            if( scrName == gmlName )
                return index + 100000;
            else if( scrName == _name ) 
                scriptId = index +100000; //global script with the same id as a regular script - but keep looking as we may have script function with same name which takes priority
        }
    }

    if(scriptId == -1)
    {
        var globalName = "gml_GlobalScript_"+ _name;
        for (var index = 0; index < _array.length; index++)
        {
            var scrName = _array[index];
            if( scrName.endsWith(_name)){
                if( scrName == globalName )
                    return index + 100000;
            }
        }
    }

    return scriptId;
}

//returns: {type,id} for given resource name
function ResourceGetTypeIndex(_name )
{
    _name = yyGetString(_name);
    var typeId = { type:-1, id:-1 };
    if ((ret = Resource_Find(_name, g_pGMFile.GMObjects)) >= 0)                { typeId.type = AT_Object;   typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Sprites)) >= 0)                  { typeId.type=AT_Sprite;     typeId.id = ret; return typeId; }
    if ((ret = Resource_Find(_name, g_pGMFile.GMRooms)) >= 0)                  { typeId.type=AT_Room;       typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Sounds)) >= 0)	               { typeId.type=AT_Sound;      typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Backgrounds)) >= 0)              { typeId.type= g_isZeus ? AT_Tiles : AT_Background,      typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Paths)) >= 0)                    { typeId.type=AT_Path;       typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Fonts)) >= 0)                    { typeId.type=AT_Font;       typeId.id = ret; return typeId; }
	if ((ret = Resource_Find(_name, g_pGMFile.Timelines)) >= 0)                { typeId.type=AT_Timeline;   typeId.id = ret; return typeId; }
	if ((ret = Resource_Find_Script(_name, g_pGMFile.ScriptNames)) >= 0)       { typeId.type=AT_Script;     typeId.id = ret; return typeId; }
	if ((ret = Resource_Find_Shader(_name, g_pGMFile.Shaders)) >= 0)           { typeId.type=AT_Shader;     typeId.id = ret; return typeId; }
    if ((ret = Resource_Find(_name, g_pGMFile.Sequences)) >= 0)                { typeId.type=AT_Sequence;   typeId.id = ret; return typeId; }
    if ((ret = Resource_Find(_name, g_pGMFile.AnimCurves)) >= 0)               { typeId.type=AT_AnimCurve;  typeId.id = ret; return typeId; }
    if ((ret = CParticleSystem.Find(_name)) >= 0)                              { typeId.type=AT_ParticleSystem;  typeId.id = ret; return typeId; }
    
    return typeId;
}

function ResourceGetName( _index, _assetType )
{
    switch( _assetType )
    {
        case AT_Object:	        return (object_exists(_index)) ? object_get_name(_index) : "";
        case AT_Sprite:	        return (sprite_exists(_index)) ? sprite_get_name(_index) : "";
        case AT_Sound:		    return (sound_exists(_index)) ? sound_get_name(_index) : "";
        case AT_Room:		    return (room_exists(_index)) ? room_get_name(_index) : "";
        case AT_Tiles:
        case AT_Background:     return (background_exists(_index)) ? background_get_name(_index) : "";
        case AT_Path:		    return ( path_exists(_index)) ? path_get_name(_index) : "";
        case AT_Script:	        return ( script_exists(_index)) ? script_get_name(_index) : "";
        case AT_Font:		    return ( font_exists(_index)) ? font_get_name(_index) : "";
        case AT_Timeline:	    return ( timeline_exists(_index)) ? timeline_get_name(_index) : "";
        case AT_Shader:	        return ( shader_exists(_index)) ? shader_get_name(_index) : "";
        case AT_Sequence:	    return ( _sequence_exists(_index)) ? sequence_get_name(_index) : "";
        case AT_AnimCurve:	    return ( _animcurve_exists(_index)) ? animcurve_get_name(_index) : "";
    }
    return "";
}

// #############################################################################################
/// Function:<summary>
///          	Search the different kinds of assets to find the index of the name provided
///          </summary>
// #############################################################################################
function asset_get_index(_name)
{
    _name = yyGetString(_name);
    var typeId = ResourceGetTypeIndex(_name);
    if( typeId.id >=0 )
        return typeId.id;
	
	// Check the built-in and other defined constants (in the correct for overwriting builtin ones)
	var props = Object.getOwnPropertyNames(g_pBuiltIn);
	for (var i = 0; i > props; i++) {	    
	    if (props[i] == _name) {
	        return i;
	    }
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          	Search the different kinds of assets to find the type of asset
///          </summary>
// #############################################################################################
function asset_get_type(_name)
{
    _name = yyGetString(_name);
    var typeId = ResourceGetTypeIndex(_name);
    return typeId.type;
/*
    if (Resource_Find(_name, g_pGMFile.GMObjects) >= 0)     { return AT_Object; }
    if (Resource_Find(_name, g_pGMFile.GMRooms) >= 0)       { return AT_Room; }
	if (Resource_Find(_name, g_pGMFile.Sprites) >= 0)       { return AT_Sprite; }
	if (Resource_Find(_name, g_pGMFile.Sounds) >= 0)	    { return AT_Sound; }
	if (Resource_Find(_name, g_pGMFile.Backgrounds) >= 0)   { return AT_Background; }
	if (Resource_Find(_name, g_pGMFile.Paths) >= 0)         { return AT_Path; }
	if (Resource_Find(_name, g_pGMFile.Fonts) >= 0)         { return AT_Font; }	
	if (Resource_Find(_name, g_pGMFile.Timelines) >= 0)     { return AT_Timeline; }
	// if (Resource_Find(_name, g_pGMFile.Scripts) >= 0)       { return AT_Script; }
	if (Resource_Find(_name, g_pGMFile.Shaders) >= 0)       { return AT_Shader; }
	return -1;
*/
}

function alarm_get(inst, index)
{
    return inst.alarm[yyGetInt32(index)];
}

function alarm_set(inst, index, count)
{
    inst.alarm[yyGetInt32(index)] = yyGetInt32(count);
}

function game_set_speed(arg0,arg1)
{
    arg0 = yyGetReal(arg0);

    if(arg0<0)
        return;

    if(arg0==0)
        g_GameTimer.SetFrameRate(arg0);
    
    if (yyGetInt32(arg1) == 0)
        g_GameTimer.SetFrameRate(arg0);
    else
        g_GameTimer.SetFrameRate(1000000.0/arg0);
    
    
};
function game_get_speed(arg0)
{
    if(!g_GameTimer.IsFixedTick())
        return 0;

    if(yyGetInt32(arg0) == 0)
        return g_GameTimer.GetFPS();
    else
        return 1000000.0/g_GameTimer.GetFPS();
    
}

//Going to put timer related stuff here
/** @constructor */
function CTimingSource()
{
    this.m_elapsed_micros=0;
	this.m_last_micros=0;
	this.m_paused=false;

	this.m_fps=0;		// frame rate in hertz (more accurate than storing time-per-frame for common refresh rates) - 0 represents an unfixed tick rate
	this.m_delta_micros=0;
};


CTimingSource.prototype.SetFrameRate=function(arg0)
{
    this.m_fps = arg0;
    this.Reset();

};
CTimingSource.prototype.Pause=function(arg0){this.m_paused = arg0; };
CTimingSource.prototype.ElapsedMicroSeconds=function(){ return this.m_elapsed_micros;};
CTimingSource.prototype.ElapsedSeconds=function(){return this.m_elapsed_micros*0.000001; };
CTimingSource.prototype.ElapsedFrames=function(arg0){ return this.m_elapsed_micros/arg0; };
CTimingSource.prototype.IsFixedTick=function()
{
    if(this.m_fps>0.0) 
        return true;
        
    return true;
};

CTimingSource.prototype.Reset= function()
{
    this.m_elapsed_micros = 0;
    if(this.m_fps >0.0)
    {
        this.m_last_micros = YoYo_GetTimer();
    }
    else
    {
        this.m_last_micros = 0;
    }
    this.m_delta_micros = 0;
    this.m_paused = false;
};

CTimingSource.prototype.Update=function()
{
    var current;
    
    if(this.m_fps>0.0)
    {
        current = this.m_last_micros + 1000000.0/this.m_fps;
    }
    else
        current = YoYo_GetTimer();
        
   this.m_delta_micros = current - this.m_last_micros;
   
   if(!this.m_paused)
        this.m_elapsed_micros+=this.m_delta_micros;
    
   this.m_last_micros = current; 
   

};
CTimingSource.prototype.GetFPS=function()
{
    if(this.m_fps >0)
        return this.m_fps;
    
    if(this.m_delta_micros>0)
    {
        return 1000000.0/this.m_delta_micros;
    }
    return 30.0;

};

var g_GameTimer = new CTimingSource();
