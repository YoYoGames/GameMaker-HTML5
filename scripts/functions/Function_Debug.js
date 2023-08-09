 
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Debug.js
// Created:         17/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/05/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

var g_MissingFunction_done = [];
var g_WarningFunction_done = [];
var g_ErrorOnce_done = [];
var lastPrint = Date.now();
var DIALOG_TYPE_LOGIN = 0;
var DIALOG_TYPE_INPUT = 1;
var DIALOG_TYPE_QUESTION = 2;
var DIALOG_TYPE_MESSAGE = 3;


// #############################################################################################
/// Property: <summary>
///           	
///           </summary>
// #############################################################################################
var print = function(text) {
    if (!text) return;
    if (g_DebugMode) {
        if (g_debug_window) {
            var element = g_debug_window.document.getElementById('debug_console');
            if (element) {
                var newline = String.fromCharCode(0x0a);
                text = text.replace('<b>', '').replace('</b>', '');

                var diff = Date.now() - lastPrint;
                if (!element) {
                    alert(text);
                } else {
                    element.value += text + newline;
                    // scroll down
                    var len = element.textLength;
                    /*if (len == undefined || len == 0 )
                    {
                    element.setSelectionRange(0, len);
                    } else
                    {
                    element.setSelectionRange(len - 1, len);
                    }*/
                }
                lastPrint = Date.now();
            }
        }
    }
    if (g_pGMFile != undefined) {
        if (g_pGMFile.Options.outputDebugToConsole)
            console.log(text);
        if (g_pGMFile.Options.outputDebugToDiv) {
            var dbgDiv = document.getElementById("yyDebugDiv");
            var lineOutput = document.createElement('P');
            lineOutput.textContent += text;
            dbgDiv.appendChild(lineOutput);
        }
    }
};

// #############################################################################################
/// Function:<summary>
///          	Console out debug text
///          </summary>
// #############################################################################################
function debug(text)
{
  var index;
  
  for (index = 0; index < arguments.length; ++index) {
      print( arguments[index] );
  }
}

// #############################################################################################
/// Function:<summary>
///          	Console out debug text
///          </summary>
// #############################################################################################
//function Error(text) {
//    var index;

//    for (index = 0; index < arguments.length; ++index)
//    {
//    	print(arguments[index]);
//    }
//}

function YYErrorObject( _message, _longMessage, _script, _line, _stackTrace )
{
    this.gmlmessage = _message;
    this.gmllongMessage = _longMessage;
    this.gmlstacktrace = _stackTrace;
    this.gmlscript = _script;
    this.gmlline = _line;
    this.__yyIsGMLObject = true;
}

YYErrorObject.prototype.toString = function () {
    return yyGetString(this);
};

function __yy__processException( _ex )
{
    if (_ex instanceof Error) {
        // convert from a system Error into a YYErrorObject
        var message = (_ex.message) ? _ex.message : "";
        var longMessage = (_ex.message) ? _ex.constructor.name + " - " + _ex.message : "";
        var script = (_ex.fileName) ? _ex.fileName : "";
        var line = (_ex.lineNumber) ? _ex.lineNumber : -1;
        var stacktrace = [];
        if (_ex.stack) {
            stacktrace = _ex.stack.split(/\r?\n/);
        } // end if
        _ex = new YYErrorObject( message, longMessage, script, line, stacktrace);;
    } // end if
    return _ex;
}


// #############################################################################################
/// Function:<summary>
///          	Console out debug text
///          </summary>
// #############################################################################################
function yyError(text) {
    var index;

    var stacktraceArray = getStacktraceArray();
    var exObj = new YYErrorObject( text, text, ExtractFunctionName(yyError.caller.name), -1, stacktraceArray ); 

    throw exObj;
}

// #############################################################################################
/// Function:<summary>
///          	Console out debug text
///          </summary>
// #############################################################################################
function ErrorOnce(_text) {
	if (!g_ErrorOnce_done[_text])
	{
	    g_ErrorOnce_done[_text] = true;
	    stacktrace(_text);

	    debug(_text);

        // if debug output is on, then do an ALERT with this as well - 
	    //if (g_pGMFile != undefined) {
	    //    if (g_pGMFile.Options.outputDebugToConsole) {
	    //        console.log(_text + "\n\nSee console for more info\n");
	    //    }
	    //}
	}
}

// #############################################################################################
/// Function:<summary>
///             Function is not supported error
///          </summary>
///
/// In:		 <param name="_text">Name of function</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ErrorFunction(_text)
{
    if( !g_MissingFunction_done[_text] )
    {
        g_MissingFunction_done[_text] = true;
        var txt =  "Error: function " + _text + " is not supported.";
        debug( txt );
    }
}


// #############################################################################################
/// Function:<summary>
///             Function is not supported error
///          </summary>
///
/// In:		 <param name="_text">Name of function</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ErrorNotSupported(_text) {
	if (!g_MissingFunction_done[_text])
	{
		g_MissingFunction_done[_text] = true;
		var txt = "Error: " + _text + " is not supported.";
		debug(txt);
	}
}



// #############################################################################################
/// Function:<summary>
///             Display an error for a missing function
///          </summary>
///
/// In:		 <param name="_text">error string</param>
///				
// #############################################################################################
function MissingFunction( _text )
{   
    if( !g_MissingFunction_done[_text] )
    {
        g_MissingFunction_done[_text] = true;
        var txt =  "Error: function "+_text+" is not yet implemented";
        debug( txt );
    }
}


// #############################################################################################
/// Function:<summary>
///             Display a warning about a function. (i.e. not all colours used etc.)
///          </summary>
///
/// In:		 <param name="_text">warning string</param>
///				
// #############################################################################################
function WarningFunction(_text) {
	if (!g_WarningFunction_done[_text])
	{
		g_WarningFunction_done[_text] = true;
		var txt = "Warning: function " + _text;
		debug(txt);
	}
}

// #############################################################################################
/// Function:<summary>
///          	Given a string with "#", replace them with 0x0a.
///          </summary>
///
/// In:		<param name="_txt">String to replace</param>
/// Out:	<returns>
///				Replaced string.
///			</returns>
// #############################################################################################
function SplitText(_txt) 
{
	var sl = g_pFontManager.Split_TextBlock(_txt, -1);

	var newline = String.fromCharCode(0x0a);
	var s = "";
	for (var i = 0; i < sl.length; i++)
	{
		if (i != 0) s = s + newline;
		s += sl[i];
	}
	return s;
}

// #############################################################################################
/// Function:<summary>
///             Display an error for an action
///          </summary>
///
/// In:		 <param name="_errstr">error string</param>
///			 <param name="_serious">true/false for serioud (aborts)</param>
///				
// #############################################################################################
function MessageBox( _errstr )
{
	if (!_errstr) return;
	alert(_errstr);
}


// #############################################################################################
/// Function:<summary>
///             Display an error for an action
///          </summary>
///
/// In:		 <param name="_errstr">error string</param>
///			 <param name="_serious">true/false for serioud (aborts)</param>
///				
// #############################################################################################
function Error_Show_Action( _errstr, _serious )
{
	if (!_errstr) return;
	alert(_errstr);
}


function debug_event(_event)
{
    switch( _event ) {
        case "RangeError":
            {
                throw new RangeError( "debug_event");
            }
            break;
        default:
            break;
    }
}

function dbg_view() { ErrorFunction( "dbg_view()" ); }
function dbg_section() { ErrorFunction( "dbg_seciton()" ); }
function dbg_view_delete() { ErrorFunction( "dbg_view_delete()" ); }
function dbg_section_delete() { ErrorFunction( "dbg_section_delete()" ); }
function dbg_slider() { ErrorFunction( "dbg_slider()" ); }
function dbg_drop_down() { ErrorFunction( "dbg_drop_down()" ); }
function dbg_watch() { ErrorFunction( "dbg_watch()" ); }
function dbg_same_line() { ErrorFunction( "dbg_same_line()" ); }
function dbg_button() { ErrorFunction( "dbg_button()" ); }
function dbg_text_input() { ErrorFunction( "dbg_text_input()" ); }
function dbg_checkbox() { ErrorFunction( "dbg_checkbox()" ); }
function dbg_colour() { ErrorFunction( "dbg_colour()" ); }
function dbg_color() { ErrorFunction( "dbg_color()" ); }
function dbg_text() { ErrorFunction( "dbg_text()" ); }
function dbg_sprite() { ErrorFunction( "dbg_sprite()" ); }
function ref_create() { ErrorFunction( "ref_create()" ); return 0; }
function is_debug_overlay_open() { return false; }
function show_debug_log() { ErrorFunction( "show_debug_log()" ); ; }



// #############################################################################################
/// Function:<summary>
///             Output a message to the debug console
///          </summary>
///
/// In:		 <param name="_txt">text to output</param>
///				
// #############################################################################################
function show_debug_message( _txt )
{
    var msg = yyGetString(_txt);
    if (!msg) return;

    if (arguments.length == 1) {
        debug(msg);
        return;
    }

    if (typeof(msg) != "string") 
    {
        yyError("show_debug_message() trying to use string template but argument0 is not a string");
    }

    var _values = [];
    for( var n=1; n<arguments.length; ++n) {
        _values.push(arguments[n]);
    }
    
    debug(__yy_StringReplacePlaceholders(msg, _values));
}

// #############################################################################################
/// Function:<summary>
///             Output a message to the debug console
///          </summary>
///
/// In:		 <param name="_txt">text to output</param>
///				
// #############################################################################################
function show_debug_message_ext( _txt, _values )
{
    var msg = yyGetString(_txt);
    if (!msg) return;

    if (typeof(msg) != "string") {
        yyError("show_debug_message_ext() argument0 is not a string");
    }

    if (!(_values instanceof Array)) {
        yyError("show_debug_message_ext() argument1 is not an array");
    }

    debug(__yy_StringReplacePlaceholders(msg, _values));
}

// #############################################################################################
/// Function:<summary>
///             Enable or disable the debug overlay (does nothing on HTML5)
///          </summary>
///
/// In:		 <param name="_txt">text to output</param>
///				
// #############################################################################################
function show_debug_overlay( _onOff )
{
}

function debug_get_callstack( maxDepth )
{
  var callstack = [];
  if (maxDepth == undefined) maxDepth = 100;
  
  var caller = arguments.callee.caller;
  while( caller!= null ) {
    callstack.push( caller );
    if (callstack.length >= maxDepth) break;

    caller = caller.caller;

    if (callstack.indexOf(caller) >= 0)     // check for cycle
        break;
  } // end while

  var callstack_names = [];
  for (var i = 0; i < callstack.length; i++)
  {
      callstack_names[i] = callstack[i].name;
  }
  callstack_names.push( 0 );

  return callstack_names;
}

// #############################################################################################
/// Function:<summary>
///             Show a message box with some user TEXT in it.
///          </summary>
///
/// In:		 <param name="_txt">text to display</param>
///				
// #############################################################################################
function show_message_async(_txt) {
    //show_debug_message( "show_message_async :: txt=" + _txt );
    YYDialogAdd(g_AsyncUserID, DIALOG_TYPE_MESSAGE, [yyGetString(_txt)]);
    return g_AsyncUserID++;
}

// #############################################################################################
/// Function:<summary>
///             Show a message box with some user TEXT in it.
///          </summary>
///
/// In:		 <param name="_txt">text to display</param>
///				
// #############################################################################################
function show_message(_txt) 
{
    var msg = yyGetString(_txt);
    if (!msg) return;
    alert(SplitText(msg));
}

// #############################################################################################
/// Function:<summary>
///             Displays a standard error message (and/or writes it to the log file). 
///             abort indicates whether the game should abort.
///          </summary>
///
/// In:		 <param name="_str"></param>
///			 <param name="_abort"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function show_error(_str,_abort) 
{
    _str = yyGetString(_str);
	if (!_str) return;
	alert(_str);
    // can't abort....?!?!?!
}


// #############################################################################################
/// Function:<summary>
///          	Displays a question; returns true when the user selects yes and false otherwise.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function show_question_async(_str) {
    //show_debug_message( "show_question_async :: str=" + _str );
    YYDialogAdd( g_AsyncUserID, DIALOG_TYPE_QUESTION, [ yyGetString(_str) ] );
    return g_AsyncUserID++;
}
// #############################################################################################
/// Function:<summary>
///          	Displays a question; returns true when the user selects yes and false otherwise.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function show_question(_str) {
    _str = yyGetString(_str);

    if (!_str) {
        _str = "";
    }
    if (window.confirm) {
        return confirm(SplitText(_str)) ? 1.0 : 0.0;
    }
    ErrorFunction("show_question()");
    return 0;
}


// #############################################################################################
/// Function:<summary>
///          	Asks the player in a dialog box for a number. str is the message. def is the 
///				default number shown.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_def"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function get_integer_async(_str, _def) {
    //show_debug_message( "get_integer_async :: str=" + _str + ", def=" + _def );
    YYDialogAdd( g_AsyncUserID, DIALOG_TYPE_INPUT, [ yyGetString(_str), yyGetString(_def) ] );
    return g_AsyncUserID++;
}

// #############################################################################################
/// Function:<summary>
///          	Asks the player in a dialog box for a number. str is the message. def is the 
///				default number shown.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_def"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function get_integer(_str,_def) 
{
    return parseFloat( prompt(yyGetString(_str), yyGetString(_def) ) );
}


// #############################################################################################
/// Function:<summary>
///          	Create a login dialog
///          </summary>
// #############################################################################################
function createLoginDialog( _dialogData )
{
    //show_debug_message( "createLoginDialog = " + _dialogData );
	var root = document.getElementById(g_CanvasName);
	
	// Make containing DIV
	var pParent = root.parentNode;
	var div = document.createElement("div");
	g_dialogName = "gm4html5_login_ID";
	div.setAttribute("class", "gm4html5_login");
	div.setAttribute("id", g_dialogName);
	pParent.insertBefore(div, root.nextSibling);
	div.innerHTML = "<div class=\"gm4html5_login_header\">Login</div>" +
					"<table>" +
					"<tr>" +
						"<td><label for=\"username\" id=\"gm4html5_login_label_username_id\">Username:</label></td>" +
						"<td><input type=\"text\" id=\"gm4html5_login_username_id\" value=\"username\" /></td>" +
					"</tr>" +
					"<tr>" +
						"<td><label for=\"password\" id=\"gm4html5_login_label_password_id\">Password:</label></td>" +
						"<td><input type=\"password\" id=\"gm4html5_login_password_id\" value=\"password\" /></td>" +
					"</tr>" +
					"</table>" +
					"<div class=\"gm4html5_login_button\"><input type=\"button\" value=\"Login\" id=\"gm4html5_login_button_id\"/></div>" +
					"<div class=\"gm4html5_cancel_button\"><input type=\"button\" value=\"Cancel\" id=\"gm4html5_cancel_button_id\" /></div>";

	ReleaseBrowserInput();
	g_DialogActive = true;

	
	var login = document.getElementById("gm4html5_login_button_id");
	var login_username = document.getElementById("gm4html5_login_username_id");
	var login_password = document.getElementById("gm4html5_login_password_id");
	login_username.value = _dialogData.strings[0];
	login_password.value = _dialogData.strings[1];

	login.onmouseup = function () {
		//var login_username = document.getElementById("gm4html5_login_username_id");
		//var login_password = document.getElementById("gm4html5_login_password_id");
		var username = login_username.value;
		var password = login_password.value;

		// Setup the ASYNC callback
		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = username;
		pAsync.password = password;
		pAsync.value = 0;
		pAsync.result = "";
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_LOADED;

		pParent.removeChild(div);
		g_DialogActive = false;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};

	// On cancel throw an error
	var cancel = document.getElementById("gm4html5_cancel_button_id");
	cancel.onmouseup = function () {
		pParent.removeChild(div);
		g_DialogActive = false;

		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = 0;
		pAsync.result = "";
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_ERROR;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};
	
	login_dialog_update();
	g_pASyncManager.Add(_dialogData.id, null, ASYNC_USER, g_dialogName);
} // end createLoginDialog

// #############################################################################################
/// Function:<summary>
///          	Create an input dialog
///          </summary>
// #############################################################################################
function createInputDialog( _dialogData )
{
    //show_debug_message( "createInputDialog = " + _dialogData );
	var root = document.getElementById(g_CanvasName);

	// Make containing DIV
	var pParent = root.parentNode;
	var div = document.createElement("div");
	g_dialogName = "gm4html5_input_ID";
	div.setAttribute("class", "gm4html5_login");
	div.setAttribute("id", g_dialogName);
	pParent.insertBefore(div, root.nextSibling);
	div.innerHTML = "<table>" +
					"<tr>" +
						"<td><label for=\"username\" id=\"gm4html5_input_message_id\">Message</label></td>" +
					"</tr>" +
					"<tr>" +
						"<td><input type=\"text\" id=\"gm4html5_input_text_id\" value=\"text\" /></td>" +
					"</tr>" +
					"</table>" +
					"<div class=\"gm4html5_login_button\"><input type=\"button\" value=\"OK\" id=\"gm4html5_input_ok_button_id\"/></div>" +
					"<div class=\"gm4html5_cancel_button\"><input type=\"button\" value=\"Cancel\" id=\"gm4html5_input_cancel_button_id\" /></div>";

	ReleaseBrowserInput();
	g_DialogActive = true;

	
	var input_message = document.getElementById("gm4html5_input_message_id");
	var input_text = document.getElementById("gm4html5_input_text_id");
	input_message.innerHTML = _dialogData.strings[0];
	input_text.value = _dialogData.strings[1];

	var ok = document.getElementById("gm4html5_input_ok_button_id");
	ok.onmouseup = function () {
		var text = input_text.value;

		// Setup the ASYNC callback
		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = parseFloat(text);
		pAsync.result = text;
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_LOADED;

		pParent.removeChild(div);
		g_DialogActive = false;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};

	// On cancel throw an error
	var cancel = document.getElementById("gm4html5_input_cancel_button_id");
	cancel.onmouseup = function () {
		pParent.removeChild(div);
		g_DialogActive = false;

		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = 0;
		pAsync.result = "";
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_ERROR;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};
	
	login_dialog_update();
	g_pASyncManager.Add(_dialogData.id, null, ASYNC_USER, g_dialogName);
} // end createInputDialog

// #############################################################################################
/// Function:<summary>
///          	Create a question dialog
///          </summary>
// #############################################################################################
function createQuestionDialog( _dialogData )
{
    //show_debug_message( "createQuestionDialog = " + _dialogData );
	var root = document.getElementById(g_CanvasName);

	// Make containing DIV
	var pParent = root.parentNode;
	var div = document.createElement("div");
	g_dialogName = "gm4html5_question_ID";
	div.setAttribute("class", "gm4html5_login");
	div.setAttribute("id", g_dialogName);
	pParent.insertBefore(div, root.nextSibling);
	div.innerHTML = "<table>" +
					"<tr>" +
						"<td><label for=\"username\" id=\"gm4html5_question_message_id\">Message</label></td>" +
					"</tr>" +
					"</table>" +
					"<div class=\"gm4html5_login_button\"><input type=\"button\" value=\"Yes\" id=\"gm4html5_question_yes_button_id\"/></div>" +
					"<div class=\"gm4html5_cancel_button\"><input type=\"button\" value=\"No\" id=\"gm4html5_question_no_button_id\" /></div>";

	ReleaseBrowserInput();
	g_DialogActive = true;

	
	var question_message = document.getElementById("gm4html5_question_message_id");
	question_message.innerHTML = _dialogData.strings[0];

	var ok = document.getElementById("gm4html5_question_yes_button_id");
	ok.onmouseup = function () {
		// Setup the ASYNC callback
		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = 1;
		pAsync.result = "1";
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_LOADED;

		pParent.removeChild(div);
		g_DialogActive = false;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};

	// On cancel throw an error
	var cancel = document.getElementById("gm4html5_question_no_button_id");
	cancel.onmouseup = function () {
		pParent.removeChild(div);
		g_DialogActive = false;

		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = 0;
		pAsync.result = "0";
		pAsync.m_Complete = true;
		pAsync.m_Status = ASYNC_STATUS_ERROR;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );
	};
	
	login_dialog_update();
	g_pASyncManager.Add(_dialogData.id, null, ASYNC_USER, g_dialogName);
} // end createQuestionDialog

// #############################################################################################
/// Function:<summary>
///          	Create a message dialog
///          </summary>
// #############################################################################################
function createMessageDialog( _dialogData )
{
    //show_debug_message( "createMessageDialog = " + _dialogData );
	var root = document.getElementById(g_CanvasName);

	// Make containing DIV
	var pParent = root.parentNode;
	var div = document.createElement("div");
	g_dialogName = "gm4html5_message_ID";
	div.setAttribute("class", "gm4html5_login");
	div.setAttribute("id", g_dialogName);
	pParent.insertBefore(div, root.nextSibling);
	div.innerHTML = "<table>" +
					"<tr>" +
						"<td><label for=\"username\" id=\"gm4html5_message_message_id\">Message</label></td>" +
					"</tr>" +
					"</table>" +
					"<div class=\"gm4html5_login_button\"><input type=\"button\" value=\"OK\" id=\"gm4html5_message_ok_button_id\"/></div>";

	ReleaseBrowserInput();
	g_DialogActive = true;

	
	var question_message = document.getElementById("gm4html5_message_message_id");
	question_message.innerHTML = _dialogData.strings[0];

	var ok = document.getElementById("gm4html5_message_ok_button_id");
	ok.onmouseup = function () {
		
		// Setup the ASYNC callback
		var pAsync = AsyncAlloc_pop(g_dialogName);
		if (!pAsync) return;
		pAsync.username = "";
		pAsync.password = "";
		pAsync.value = 1;
		pAsync.result = "1";
		pAsync.m_Complete = true;
		pAsync.m_Status = 1;
		pParent.removeChild(div);
		g_DialogActive = false;
		CaptureBrowserInput();
		YYDialogRemoveAndKick(  _dialogData.id );

	};

//	// On cancel throw an error
//	var cancel = document.getElementById("gm4html5_message_cancel_button_id");
//	cancel.onmouseup = function () {

//		var pAsync = AsyncAlloc_pop(g_dialogName);
//		if (!pAsync) return;
//		pAsync.username = "";
//		pAsync.password = "";
//		pAsync.value = 0;
//		pAsync.result = "0";
//		pAsync.m_Complete = true;
//		pAsync.m_Status = 0;
//		pParent.removeChild(div);
//		g_DialogActive = false;
//		CaptureBrowserInput();
//		YYDialogRemoveAndKick(  _dialogData.id );
//	};
//	
	login_dialog_update();
	g_pASyncManager.Add(_dialogData.id, null, ASYNC_USER, g_dialogName);
} // end createMessageDialog

// #############################################################################################
/// Function:<summary>
///          	Create the dialog data
///          </summary>
// #############################################################################################
/** @constructor */
function yyDialogData( _id, _type, _strings ) {
    this.id = _id;
    this.type = _type;
    this.strings = _strings;
}

// #############################################################################################
/// Function:<summary>
///          	Kick the top entry in the dialog list (i.e. display the dialog)
///          </summary>
// #############################################################################################
function YYDialogKick() {
    // inside the kick
    // get type of last dialog
    // start that dialog type
    if (g_dialogs.length > 0) {
    
        // get the first entry and kick that one
        switch( g_dialogs[0].type ) {
        case DIALOG_TYPE_LOGIN: // login dialog
            createLoginDialog( g_dialogs[0] );
            break;
        case DIALOG_TYPE_INPUT: // input dialog
            createInputDialog( g_dialogs[0] );
            break;
        case DIALOG_TYPE_QUESTION: // show question
            createQuestionDialog( g_dialogs[0] );
            break;
        case DIALOG_TYPE_MESSAGE: // show message
            createMessageDialog( g_dialogs[0] );
            break;
        } // end switch
    
    } // end if    
} // end YYDialogKick


function YYDialogFormatText( _strings )
{
    for( var i=0; i < _strings.length; ++i )
    {
        var str = _strings[i];
        if( typeof(str) == 'string')
        {
            //escape: str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            var strEscaped = "";
            for (var n = 0; n < str.length; n++) {
            
                var chr = str[n];
                switch (chr) {
                    case '&':                
                        strEscaped = strEscaped + '&amp;';
                        break;
                    case '<':
                        strEscaped = strEscaped + '&lt;';
                        break;
                    case '>':
                        strEscaped = strEscaped + '&gt;';
                        break;
                    default:
                        strEscaped = strEscaped + chr;
                        break;
                }
            }            
            str = strEscaped;
            
            //carriage returns
            var crlf = String.fromCharCode(13) + String.fromCharCode(10);
            str = str.split('#').join('<br>');
            str = str.split(crlf).join('<br>');
            _strings[i] = str;
        }
    }
} 
       
// #############################################################################################
/// Function:<summary>
///          	Add a new dialog
///          </summary>
///
/// Params:	<returns>
///				id of the dialog to add
///             type of the dialog
///             string arry for this dialog
///			</returns>
// #############################################################################################
function YYDialogAdd( _id, _type, _strings /* array of strings*/ ) {
    //show_debug_message( "YYDialogAdd :: id=" + _id + ", type=" + _type + ", strings=" + _strings);
    
    YYDialogFormatText(_strings);    
    var d = new yyDialogData( _id, _type, _strings );
    g_dialogs.push( d );
    
    if (g_dialogs.length == 1) {
        YYDialogKick();
    } // end if
} // end YYDialogAdd

// #############################################################################################
/// Function:<summary>
///          	Remove a dialog from the list and then kick the dialog list
///          </summary>
///
/// Params:	<returns>
///				id of the dialog to remove
///			</returns>
// #############################################################################################
function  YYDialogRemoveAndKick( _id ) {
    // remove the dialog with this id
    //show_debug_message( "YYDialogRemoveAndKick = " + _id );
    var index = -1;
    for( var i=0; i<g_dialogs.length; ++i) {
        if (g_dialogs[i].id == _id) {
            index = i;
            break;
        } // end if
    } // end for
    
    // asuming we found it then remove it
    if (index >= 0 ) {
        g_dialogs.splice( index, 1 );
    } // end if
    
    // now kick if we need to
    YYDialogKick();
} // end YYDialogRemoveAndKick


// #############################################################################################
/// Function:<summary>
///          	Setup the login dialog
///          </summary>
///
/// Out:	<returns>
///				an ID for the callback
///			</returns>
// #############################################################################################
function get_login_async(_default_user, _default_password) {
    //show_debug_message( "get_login_async :: user=" + _default_user + ", password=" + _default_password );
    YYDialogAdd( g_AsyncUserID, DIALOG_TYPE_LOGIN, [ _default_user, _default_password ] );
    return g_AsyncUserID++;
}

// #############################################################################################
/// Function:<summary>
///          	Asks the player in a dialog box for a string. str is the message. def is the 
///				default value shown.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_def"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function get_string_async(_str, _def) {
    //show_debug_message( "get_string_async :: str=" + _str + ", def=" + _def );
    YYDialogAdd( g_AsyncUserID, DIALOG_TYPE_INPUT, [ yyGetString(_str), yyGetString(_def) ] );
    return g_AsyncUserID++;
}


// #############################################################################################
/// Function:<summary>
///          	Asks the player in a dialog box for a string. str is the message. def is the 
///				default value shown.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_def"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function get_string(_str, _def) {
    return prompt(yyGetString(_str), yyGetString(_def));
}



// #############################################################################################
/// Function:<summary>
///          	Updates the location/position of the dialog etc.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function login_dialog_update() {
	if (g_DialogActive)
	{
		var login = document.getElementById(g_dialogName);
		var w = login.offsetWidth;
		var h = login.offsetHeight;
		var xx = (canvas.width - w) / 2;
		var yy = (canvas.height - h) / 2;


		g_CanvasRect = new YYRECT();
		CalcCanvasLocation(canvas,g_CanvasRect);

		login.style.left = ~~(xx+g_CanvasRect.left) + "px";
		login.style.top = ~ ~(yy + g_CanvasRect.top) + "px";
	}
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_func"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ExtractFunctionName(_func) {
    return _func.substr(0, _func.indexOf("("));
/*    var curr = _func.indexOf("(")+1;
    var notdone = true;
    var count = 1;
    var l =_func.length; 
    while(curr<l) {
        if (_func.charAt(curr) == ')') {
            curr++;
            count--;
            if (count == 0) break;
        }
        curr++;
    }
    return _func.substr(0, curr);*/
}


// #############################################################################################
/// Function:<summary>
///          	Dump a stacktrace to the debug window
///          </summary>
///
/// In:		<param name="iLevel"></param>
///			<param name="bArguments"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function stacktrace(_error) {
  
    var f = arguments.callee.caller;
    var str = "Error: " + _error + "\n" + "--------------------------------------------------------------------\n";
    while (f) {
        var name = "\t"+ExtractFunctionName(f.toString());
        str += name + '(';
        for (var i = 0; i < f.arguments.length; i++) {
            if (i != 0) {
                str += ', ';
            }
            
            if (typeof f.arguments[i] == "string") {
                str += '"' + f.arguments[i].toString() + '"';
            }
            else if ((typeof f.arguments[i] == "number") || (f.arguments[i] instanceof Long)) {
                str += f.arguments[i].toString();
            }
            else {
                if (f.arguments[i] == undefined) {
                    str += "[undefined]";                    
                }
                else if (f.arguments[i] == null) {
                    str += "[null]";
                }
                else if (f.arguments[i].__type) {
                    str += f.arguments[i].__type;
                }
                else {
                    str += "[unknown]";
                }
            }
        }
        str += ")\n";   //+ chr(13);
        f = f.caller;        
    }
    debug(str);
}

function getStacktraceArray(_error) {
  
    var f = arguments.callee.caller;
    var ret = [];
    while (f && (ret.length < 100)) {
        var name = ExtractFunctionName(f.toString());
        str = name + '(';
        for (var i = 0; i < f.arguments.length; i++) {
            if (i != 0) {
                str += ', ';
            }
            
            if (typeof f.arguments[i] == "string") {
                str += '"' + f.arguments[i].toString() + '"';
            }
            else if ((typeof f.arguments[i] == "number") || (f.arguments[i] instanceof Long)) {
                str += f.arguments[i].toString();
            }
            else {
                if (f.arguments[i] == undefined) {
                    str += "[undefined]";                    
                }
                else if (f.arguments[i] == null) {
                    str += "[null]";
                }
                else if (f.arguments[i].__type) {
                    str += f.arguments[i].__type;
                }
                else {
                    str += "[unknown]";
                }
            }
        }
        str += ")\n";   //+ chr(13);
        ret.push( str );
        f = f.caller;        
    }
    return ret;
}


// #############################################################################################
/// Function:<summary>
///          	Update the debug windows "instance" list
///          </summary>
// #############################################################################################
function UpdateDebugInstanceList() {

    if (!g_debug_window) return;
    var ListBox = g_debug_window.document.getElementById('debug_instances');
    if (!ListBox) return;

    var CurrList = [];

    // get Current instances in list
    var options = ListBox.options;
    for (var index in options) {    
        if (!options.hasOwnProperty(index)) continue;
    
        if (index != "selectedIndex" && index!="length") {
            var o = options[index];
            if (o && o.text) {
                CurrList[CurrList.length] = o.text;
            }
        }
    }

    // Scan ALL instances and figure out the NEW ones, and untag "current" ones.
    var NewList = [];
    for (var index in g_pInstanceManager.m_ID2Instance) {    
        if (!g_pInstanceManager.m_ID2Instance.hasOwnProperty(index)) continue;
    
        var inst = g_pInstanceManager.m_ID2Instance[index];
        if (inst !== undefined && inst !== null) {
            var s = inst.id.toString();
            var i;
            for (i = 0; i < CurrList.length; i++) {
                if (CurrList[i] == s) break;
            }
            if (i >= CurrList.length) {
                NewList[NewList.length] = s;
            } else {
                CurrList.splice(i, 1);
            }
        }
    }


    // Any let in CurrList are now "deleted" entries, so we remove them
    for (var index in CurrList) {
        if (!CurrList.hasOwnProperty(index)) continue;
        for (var o in options) {
            if (!options.hasOwnProperty(o)) continue;
            if (options[o].text = index) {
                ListBox.removeChild(options[o]);
                break;
            }
        }
    }


    // Now we add all the NEW instances
    for (var index = 0; index < NewList.length; index++) {
        var inst = NewList[index];
        var option = g_debug_window.document.createElement("option");
        option.text = "" + inst;
        ListBox.add(option, null);
        //g_debug_window.AddItem(ListBox, option);
    }
}

var g_DebuggerDecimalPlaces = 3;
var g_LastSelected = -1;
// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function UpdateInsanceData() 
{
    if (!g_debug_window) return;
    var ListBox = g_debug_window.document.getElementById('debug_instances');
    var InstanceData = g_debug_window.document.getElementById('debug_Instance_Data');
    if (!ListBox || !InstanceData) return;


    var selected = ListBox.selectedIndex;
    if (selected < 0) {
  //      if (InstanceData.value != "") InstanceData.value = "";
        return;
    }

    if (selected == undefined) return;
    //if (g_LastSelected == selected) return;
    //g_LastSelected = selected;

    // get ID of item selected
    selected = parseInt(ListBox.options[selected].text);
    var pInst = g_pInstanceManager.m_ID2Instance[selected];
    if (!pInst) return;

    // clear text
    var s = [];
    s[s.length] = '<table ALIGN="left" VALIGN="top" style="border-spacing:0px; border-collapse:collapse; border:0px; margin:0px;">';
    s[s.length] = '<tr bgcolor="#f0f0f0" "><td style="width:130px;"><b>Object</b></td><td style="width:270px;"><b>' + pInst.pObject.Name + '</b></td></tr>';
    s[s.length] = '<tr><td>x</td><td>' +  pInst.x.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>y</td><td>' +  pInst.y.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>depth</td><td>' + pInst.depth.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>visible</td><td>' + pInst.visible + '</td></tr>';
    s[s.length] = '<tr><td>persistent</td><td>' + pInst.persistent + '</td></tr>';
    s[s.length] = '<tr><td>vspeed</td><td>' + pInst.vspeed.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>direction</td><td>' + pInst.direction.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>speed</td><td>' + pInst.speed.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>friction</td><td>' + pInst.friction.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>gravity</td><td>' + pInst.gravity.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>gravity_direction</td><td>' + pInst.gravity_direction.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';

    var pSpr = g_pSpriteManager.Get(pInst.sprite_index);
    if( !pSpr ){
        s[s.length] = '<tr><td>sprite_index</td><td><none></td></tr>';
    } else {
        var imgindex = pInst.image_index;
        if (imgindex < 0 || imgindex > pSpr.ppTPE.length) imgindex = 0;
        var pTPE = pSpr.ppTPE[~ ~imgindex];
        s[s.length] = '<tr><td>sprite_index</td><td height="' + (pTPE.oh + 32) + 'px">' + pSpr.pName +
                  '<br>' +
                  '<div style="padding:0px; margin:0px; border:0px; overflow: hidden; ' +
                  'width:' + pTPE.CropWidth + 'px; height:' + pTPE.CropHeight + 'px; ' +
                  'background: url(' + pTPE.texture.src + ') ' + -pTPE.x + 'px ' + -pTPE.y + 'px;" />' +
                  '</td></tr>';
    }

    s[s.length] = '<tr><td>image_index</td><td>' + pInst.image_index.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>image_speed </td><td>' + pInst.image_speed.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>image_blend</td><td>' + ~~pInst.image_blend + '</td></tr>';
    s[s.length] = '<tr><td>image_alpha</td><td>' + pInst.image_alpha.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>image_xscale</td><td>' + pInst.image_xscale.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>image_yscale</td><td>' + pInst.image_yscale.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>mask_index</td><td>' + pInst.mask_index.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';

    s[s.length] = '<tr><td>path_index</td><td>' + pInst.path_index.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_position</td><td>' + pInst.path_position.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_speed</td><td>' + pInst.path_speed.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_scale</td><td>' + pInst.path_scale.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_orientation</td><td>' + pInst.path_orientation.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_endaction</td><td>' + pInst.path_endaction.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_xstart</td><td>' + pInst.path_xstart.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';
    s[s.length] = '<tr><td>path_ystart</td><td>' + pInst.path_ystart.toFixed(g_DebuggerDecimalPlaces) + '</td></tr>';


    for (var ii = 0; ii < 12; ii++) {
        s[s.length] = '<tr><td>alarm['+ii+']</td><td>' + ~~pInst.alarm[ii] + '</td></tr>';
    }
    s[s.length] = '</table>';
    InstanceData.innerHTML = s.join("");
}



// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function UpdateDebugWindow() {
    UpdateDebugInstanceList();
    UpdateInsanceData();
}
