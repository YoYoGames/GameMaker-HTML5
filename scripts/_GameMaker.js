
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	_GameMaker.js
// Created:	        09/07/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	GameMaker HTML5 "Aboyne" runtime engine.
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 09/07/2011		
// 
// **********************************************************************************************************************
//var image = new Image();
//image.src = "smiley.png";
//var image2 = new Image();
//image2.src = "html5game/onClick_test_texture_0.png";
//image2.width = 128;
//image2.height = 128;
//image2.src = image.src;
//var testpng = new Image();
//testpng.src = "html5game/test.png";
var div_a = 0;
var xxx=100;

var canvas = null;
var g_Canvas_OriginalPosition, g_Canvas_OriginalLeft, g_Canvas_OriginalTop, g_Canvas_Style, g_Canvas_Original_Parent, g_Canvas_Original_Next, g_Canvas_InRoot, g_Canvas_Original_Margin;
var g_ChromeStore = false;
var graphics = null;
var g_CurrentGraphics;
var g_LoadGraphics = null;
var GlobalGraphicsHandle = null;
var g_StartUpState=0;
var g_LoadingCanvasCreated=false;

// Run steps for the game
var	lastfpstime = 0;
var newfps = 0;
var Fps = 60;
if (!Date.now) Date.now = function() { return new Date().getTime(); };
var g_StartDateTime = Date.now();
var g_CurrentTime = g_StartDateTime;
var g_FrameStartTime = g_StartDateTime;
var g_HttpRequestCrossOriginType = "anonymous";

//application surface...
var g_ApplicationSurface =-1;
var g_ApplicationWidth =-1;
var g_ApplicationHeight =-1;
var g_Application_Surface_Autodraw = true;
var g_AppSurfaceEnabled = true;
var g_bUsingAppSurface = true;          //using app surface this frame
var g_OldApplicationWidth = -1;
var g_OldApplicationHeight = -1;
var	g_NewApplicationWidth = -1;
var	g_NewApplicationHeight = -1;
var	g_NewApplicationSize = false;
var g_KeepAspectRatio = true;
var g_AppSurfaceRect = { x:0, y:0, w:0, h:0 };
var g_InGUI_Zone = false;
var g_SentLicense = false;
var g_DevicePixelRatio = 1;
var g_CanvasBackingScorePixelRatio = 1;
var g_CanvasPixelScale = 1;

var g_FirstTimeIn = 0;
var g_60_fps_counter = 0;
var g_Master_60_fps_counter = 0;

// Chrome store package?
if (window.chrome && window.chrome.app) { 
    g_ChromeStore = true;
    try {
        if( window && window['localStorage'] ){
            g_ChromeStore = false;
        }
    } catch (e) {
    }
}

// IE11 doesn't support Number.isNaN (since it's only in the draft spec for ECMAScript 6)
// so we define our own version here within Number.
if(Number.isNaN === undefined)
{
    Number.isNaN = function(o) { return typeof(o) === 'number' && isNaN(o); };
}

// On load now help in the index.html file so sites can more easily add their own APIs
//window.onload = GameMaker_Init;

window.yyRequestAnimationFrame = 
    window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame;

if (!window.yyRequestAnimationFrame) {
    // if RAF is somehow amiss but we need short timeouts, register a message handler
    // https://dbaron.org/log/20100309-faster-timeouts
    window.addEventListener("message", function(e) {
        if (e.source == window && e.data == "yyRequestAnimationFrame") {
            e.stopPropagation();
            animate();
        }
    }, true);
}
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return window.yyRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);	
        };
} )();

var g_GMLUnhandledExceptionHandler = undefined;

function IsFeatureEnabled( _flag )
{
	return (g_pGMFile.FeatureFlags !== undefined) && (g_pGMFile.FeatureFlags[ _flag ] !== undefined);
} // end IsFeatureEnabled

function exception_unhandled_handler( func )
{
	var ret = g_GMLUnhandledExceptionHandler;
	if ((func instanceof Function) || (func == undefined))
    {
		g_GMLUnhandledExceptionHandler = func;
	}
    else if(typeof func == "number")
    {
        var script = script_get(func);
        if(script != null)
        {
            g_GMLUnhandledExceptionHandler = script;
        }
        else
        {
            yyError( "exception_unhandled_handler : argument should be a function" );
        }
    }
	else
    { 
		yyError( "exception_unhandled_handler : argument should be a function" );
    }
	return ret;
}

function yyUnhandledExceptionHandler( event )
{
	if ((g_GMLUnhandledExceptionHandler == undefined) || !(g_GMLUnhandledExceptionHandler instanceof Function)) {
		var string = "Unhandled Exception - " + event.message + " in file " + event.filename + " at line " + event.lineno ;
		print( string );
		//alert( string );
		game_end(-1);
	} // end if
	else {
		var ret = g_GMLUnhandledExceptionHandler( undefined, undefined, event.error );
		game_end( ret );
	}
	debugger;
	return false;
}

function yyUnhandledRejectionHandler( error )
{
	var string =  "Unhandled Rejection - " + error.message;
	console.error(string);
	if (error && error.promise) {
		error.promise.catch(function(err){
			var _endGame = true;
			try {
				var _urlPos = err.stack.indexOf("https://");
				if (_urlPos < 0) _urlPos = err.stack.indexOf("http://");
				if (_urlPos >= 0) {
                    var reg_line_split = new RegExp("\\r\\n|\\r|\\n", "g");
					var _rows = err.stack.slice(_urlPos).split(reg_line_split);
					if (_rows.length > 0) {
						var _url = _rows[0];
						_urlPos = _url.lastIndexOf("/");
						if (_urlPos > 0) {
							var _errUrl = new URL(_url.slice(0, _urlPos + 1));
							if ((_errUrl.hostname != window.location.hostname) ||
								(_errUrl.pathname.indexOf(g_pGMFile.Options.GameDir) < 0)){
								// The error is caused by an external resource.
								_endGame = false;
							}
						}
					}
				}
			}
			catch (e) {
				console.error(e.message);
			}
			if (_endGame) {
				game_end(-2);
				debugger;
			}
		});
	}
	return false;
}

window.addEventListener( "error", yyUnhandledExceptionHandler );
window.addEventListener( "unhandledrejection", yyUnhandledRejectionHandler );


//external access for js extensions
var GMS_API = {
    "debug_msg": show_debug_message,
    "ds_list_size": ds_list_size,
    "ds_list_find_value": ds_list_find_value,
    "json_encode": json_encode,
    "json_decode": json_decode,
    "extension_get_option_value": extension_get_option_value,
    "send_async_event_social": YYSendAsyncEvent_Social,
    "get_facebook_app_id": YYGetFacebookAppId,
	"get_app_version_string": YYGetAppVersionString
};

function YYGetFacebookAppId() {
    return g_pGMFile.Options.Facebook;
}

function YYGetAppVersionString()
{
	var appVersion = g_pGMFile.Options.MajorVersion + "." +
					 g_pGMFile.Options.MinorVersion + "." +
					 g_pGMFile.Options.BuildVersion + " r" +
					 g_pGMFile.Options.RevisionVersion;
	return appVersion;
}

function YYSendAsyncEvent_Social(_mapobj) {
  //  var dsmap = ds_map_create();

    var jsonString = JSON.stringify(_mapobj);
    var dsMap = json_decode(jsonString);
    //TODO-handle json_decode fail...?

    g_pBuiltIn.async_load = dsMap;
    g_pObjectManager.ThrowEvent(EVENT_OTHER_SOCIAL, 0);
    ds_map_destroy(dsMap);
}
//-------------------------------


var g_debug_window = null;
// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ClearConsoleCallback() 
{
	if (g_debug_window)
	{
		g_debug_window.document.getElementById("debug_console").value = "";
	}
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
function ToggleDebugPause() {
    if (g_debug_window) {
        if (Run_Paused) {
            Run_Paused = false;
        } else {
            Run_Paused = true;
        }
    }
}



// #############################################################################################
/// Function:<summary>
///             Create our debug console, but hide it.
///          </summary>
///
/// In:		 <param name="_canvas">The canvcas handle</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function CreateDebugConsole() {

    try
    {
        g_debug_window = window.open('', 'gamemakerstudio_debugconsole_window', 'width=990,height=600,titlebar=yes,scrollbars,resizable'); //bletoolbar=no,menubar=no'); //,scrollbars,resizable,toolbar,status');
	    // Did it open?
	    if (g_debug_window)
	    {
	    	// Is the debug_console already there from a previous run?
	    	if (!g_debug_window.document.getElementById("debug_console"))
	    	{
	    		//with (g_debug_window.document)
	    		{
	    		    g_debug_window.document.write('<!DOCTYPE html><html>' +
                    '<header>'+
	                    '<title>GameMaker - DEBUG console</title>'+
                    '</header>'+
                    '<body>'+
	                    '<table border="0"><tr>' +
	                        '<td>Debug Output</td><td>Instances</td><td>InstanceData</td></tr>'+
	    		                '<tr><td><textarea id="debug_console" wrap="off" style="width: 450px; height:500px;  display: block;" cols="70"></textarea></td>' +
	    		                '<td>'+
	    			                '<select id="debug_instances" size=31 style="width: 120px; height: 500px; font-family: monospace;" > ' +
	    			                  /*'<option value="CA" >California</option>'+
	    			                  '<option value="CO" >Colorado</option>'+
	    			                  '<option value="CN" >Connecticut</option>'+*/
	    			                '</select>'+
	    		                '</td>'+
	    		                '<td ALIGN="left" VALIGN="top" style="min-width:350px; width:300px; height:500px; font-family: monospace; border:solid 1px #666"><div id="debug_Instance_Data"  style="width:100%; height:500px;overflow: auto;"></div></td>' +
	    	                '</tr></table>' +
	                    '<br><button type="button" id="clear_console_button" onclick="ClearConsoleCallback()">Clear Console</button>' +
	                    '<button type="button" id="gm_pause_button" onclick="ToggleDebugPause()">Pause/Resume</button>' +
                    '</body>' +
                    '</html>');				

	    		}
	    		var but = g_debug_window.document.getElementById("clear_console_button");
	    		but.onclick = function() { ClearConsoleCallback(); };
	    		but = g_debug_window.document.getElementById("gm_pause_button");
	    		but.onclick = function() { ToggleDebugPause(); };
}	    	
	    }
//	    		                '<td>Instance Data<br><textarea id="debug_Instance_Data" style="display: block;" rows="31" cols="25" style="font-family: san-serif;"></textarea></td>'+
	    // Create a debug console.
	    /*    var c = document.getElementById(g_CanvasName);
	    var y = document.createElement('textarea');
	    y.setAttribute("id","debug_console");
	    y.setAttribute("cols","100");
	    y.setAttribute("rows","20");
	    y.style.display = "none";
	    var obj = c.parentNode;
	    obj.insertBefore(y, c.nextSibling);
	    */
        g_GameMakerIdentifier = 0x71562;
    }
    catch (e) {
        debug(e.message);
    }
}



// #############################################################################################
/// Function:<summary>
///             Create a canvas for loading from
///          </summary>
///
/// In:		 <param name="_canvas">The canvcas handle</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function CreateLoadingCanvas()
{
    var c = document.getElementById(g_CanvasName);
    var obj = c.parentNode;

    // Create a loading screen canvas the same size and shape of the primary one, and place it over the top of the MAIN screen.
    var load = document.createElement('canvas');

    // position where the game canvas is - will update every frame to adjust for centering
    CalcCanvasLocation(canvas, g_CanvasRect);
    load.style.position = "absolute";
    load.style.left = g_CanvasRect.left + "px";
    load.style.top = g_CanvasRect.top + "px";


    load.width = c.width;   
    load.height = c.height; 
    load.setAttribute("id","loading_screen");
    obj.insertBefore(load, c.nextSibling);
    g_LoadGraphics = load.getContext('2d');
    Graphics_AddCanvasFunctions(g_LoadGraphics);
}

// #############################################################################################
/// Function:<summary>
///             Decode a string
///          </summary>
///
/// In:		 <param name="_str">String to decode</param>
/// Out:	 <returns>
///				resulting string
///			 </returns>
// #############################################################################################
function DecodeString(_str)
{
    var s = "";
    var l = _str.length;    
    for (var i=0; i < l; i++) {
        s = s + String.fromCharCode(_str.charCodeAt(i)^0x1a);
    }
    return s;    
}

// #############################################################################################
/// Function:<summary>
///             Delete the loading screen canvas
///          </summary>
// #############################################################################################
function DeleteLoadingCanvas()
{    
    var c = document.getElementById(g_CanvasName);
    var l = document.getElementById("loading_screen");
    //BETA
    var obj = c.parentNode;
    if (l != null)
    {
        obj.removeChild(l);
    }
    g_LoadGraphics = null;
    g_LoadingCanvasCreated = false;
}

// #############################################################################################
/// Function:<summary>
///          	Get the location of the canvas on the web page.
///          </summary>
///
/// Out:	<returns>
///				canvasMinX,canvasMinY hold the base of the canvas.
///				canvasMaxX,canvasMaxY hold the top end.
///			</returns>
// #############################################################################################
function CalcCanvasLocation(_canvas,_rect)
{
    //
    var rect = _canvas.getBoundingClientRect();
    _rect.left = rect.left;
    _rect.top = rect.top;
    //
    _rect.right = _rect.left + DISPLAY_WIDTH;
    _rect.bottom= _rect.top + DISPLAY_HEIGHT;
    //
    _rect.scaleX = (_canvas.clientWidth / _canvas.width) || 1;
    _rect.scaleY = (_canvas.clientHeight / _canvas.height) || 1;
}

// #############################################################################################
/// Function:<summary>
///          	Given the text the address bar, parse it and get the 
///          </summary>
///
/// In:		<param name="_url"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ParseURL(_url) {
	g_Arguments = [];
	g_ArgumentIndex = [];
	g_ArgumentValue = [];
	g_ArgumentCount = 0;

	var params = _url.search;
	var url = _url.protocol + "//" + _url.host + _url.pathname;
	g_ArgumentIndex[0] = url;
	g_ArgumentValue[0] = null;
	
	if (params[0] == "?") params = params.substring(1, params.length);
	
	var index = 0;
	var start = 0;
	var arg = "";
	var val = null;
	while (index < params.length)
	{
		var c = params[index];
		
		// end of paramater?
		if (c == "&")
		{
			if (arg != "")
			{
				if( start!=index) val = params.substring(start, index);
				g_ArgumentIndex[g_ArgumentIndex.length] = arg;
				g_ArgumentValue[g_ArgumentValue.length] = val;
				g_Arguments[arg] = val;
				g_ArgumentCount++;
				arg = "";
				val = null;
			}
			start = index + 1;
		} else if (c == "=")
		{
			arg = params.substring(start, index);
			val = null;
			start = index + 1;
		}
		index++;
	}

	// Probably no "&" at the end of the string... so finsih off.
	if (arg != "")
	{
		if (start != index) val = params.substring(start, index);
		g_ArgumentIndex[g_ArgumentIndex.length] = arg;
		g_ArgumentValue[g_ArgumentValue.length] = val;
		g_Arguments[arg] = val;
		g_ArgumentCount++;
		arg = val = "";
	}

}

function RememberCanvasSettings() {
	g_Canvas_OriginalPosition = canvas.style.position;
	g_Canvas_OriginalLeft = canvas.style.left;
	g_Canvas_OriginalTop = canvas.style.top;
	g_Canvas_Style = canvas.style.cssText;
	g_Canvas_Original_Parent = canvas.parentNode;
	g_Canvas_Original_Next = canvas.nextSibling;
	g_Canvas_InRoot = false;
	g_Canvas_Original_Margin = canvas.margin;
	if( (g_Canvas_Original_Parent == document.body) || (canvas.mozRequestFullScreen) || (canvas.webkitRequestFullScreen))
	{
		g_Canvas_InRoot = true;
	}

}

//------------------------------------------------------------------------------

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
window['GameMaker_Init'] = GameMaker_Init;  //Keeps this as an entry point for Google Closure Compiler

var g_obf2var = undefined;

function GameMaker_Init() 
{
    debug('------- GameMaker_Init -------------');
    if (!document.getElementById || !document.createElement) return;
	canvas = document.getElementById(g_CanvasName);

	graphics = null;
	if( !canvas) return;
	
    ParseURL( window.location );
	g_pGMFile = JSON_game;

	// initialise the map of obfuscated names to var 
	if (typeof g_var2obf !== "undefined") {
		g_obf2var = Object.getOwnPropertyNames(g_var2obf).reduce((acc, prop) => {
		  acc[g_var2obf[prop]] = prop;
		  return acc;
		}, {});	
	} // end if

    if (g_pGMFile.Options.outputDebugToDiv) {
        var logOutput = document.createElement('div');
        logOutput.id = "yyDebugDiv";
        logOutput.style.display = "none";
        document.body.appendChild(logOutput);
    }

    DetectBrowser();

    if ((g_pGMFile.Options && g_pGMFile.Options.debugMode) || (g_pGMFile.Options && g_pGMFile.Options.debugMode == undefined))
    {
        g_DebugMode = true; 	// if in DEBUG mode, allow console output.
        //hideshow(g_debug_window.document.getElementById('debug_console'));
    }
	
	if((g_pGMFile.Options!= undefined) && (g_pGMFile.Options.AssetCompilerMajorVersion !=undefined) && (g_pGMFile.Options.AssetCompilerMajorVersion>1) )
	{
	    g_isZeus = true;
	    
	    if(g_pGMFile.Options.GameSpeed!=undefined)
	    {
	        g_GameTimer.SetFrameRate(g_pGMFile.Options.GameSpeed);
	    }
	    
	}
	

	RegisterPauseEvents();

	// Initialise WebGL OR Canvas as needed
	g_OpenGLRequired = false;

    //Shifted out here as non-webgl will now use these
    g_Matrix = [];
    g_Matrix[MATRIX_PROJECTION] = new Matrix();
    g_Matrix[MATRIX_VIEW] = new Matrix();
    g_Matrix[MATRIX_WORLD] = new Matrix();

	if ((g_pGMFile.Options.WebGL) && (g_pGMFile.Options.WebGL != 0))
	{
	    g_InterpolatePixels = g_pGMFile.Options.interpolatePixels;
		var glinit = undefined;
		glinit = InitWebGL(canvas);   
		
		if (glinit) {
		    graphics = g_webGL;
		} 
		else {
			// If we REQUIRE WebGL, then Don't play this game.
			if (g_pGMFile.Options.WebGL == 1)
			{
				g_OpenGLRequired = true;
			}
			graphics = canvas.getContext('2d');
		}
	} 
	else {
		graphics = canvas.getContext('2d');
	}
	g_CurrentGraphics = graphics;

	g_Collision_Compatibility_Mode = g_pGMFile.Options.CollisionCompatibility;
 	g_LastCanvasWidth = canvas.width;
    g_LastCanvasHeight = canvas.height;    
    
    if ((g_pGMFile.Options.UseNewAudio == true) || g_isZeus) {
        g_AudioModel = Audio_WebAudio;
    }

    

    document.body.style.overflow = "hidden";

	GlobalGraphicsHandle = graphics;	

    g_OriginalWidth  = canvas.width;
    g_OriginalHeight = canvas.height;

    // get width, height and canvas bounds... this must happen before the first CalcCanvasLocation
    DISPLAY_WIDTH = g_OriginalWidth;
    DISPLAY_HEIGHT = g_OriginalHeight;

    //initial application surface = canvas size (=room size/view bounds)
    g_ApplicationWidth = DISPLAY_WIDTH;
    g_ApplicationHeight = DISPLAY_HEIGHT;
    g_KeepAspectRatio = (g_pGMFile.Options.scale != 0);

    g_DevicePixelRatio = window.devicePixelRatio || 1;
    g_CanvasBackingScorePixelRatio = (graphics.webkitBackingStorePixelRatio || graphics.mozBackingStorePixelRatio || graphics.msBackingStorePixelRatio ||
                                      graphics.oBackingStorePixelRatio || graphics.backingStorePixelRatio || 1);
    g_CanvasPixelScale = g_DevicePixelRatio / g_CanvasBackingScorePixelRatio;
    
    g_CanvasRect = new YYRECT();
    CalcCanvasLocation(canvas,g_CanvasRect);
    canvasMinY = g_CanvasRect.top;
    canvasMinX = g_CanvasRect.left;
    canvasMaxX = g_CanvasRect.right;
    canvasMaxY = g_CanvasRect.bottom;
    
    //if facebook is enabled, initialise it now, and defer creating the debug console ( as it interferes with fbAsyncInit callback )
    if (g_pGMFile.Options.Facebook && !g_pGMFile.Options.UseFBExtension)
    {
        console.log("using internal runtime facebook");
        YoYoFBInit(g_pGMFile.Options.Facebook);
    }
    else if (g_pGMFile.Options && g_pGMFile.Options.debugMode)
    {
        CreateDebugConsole();
    }

	// Remember these settings, as FULLSCREEN will mess them up.
	RememberCanvasSettings();

	// Update the canvas to use OUR functions. This helps obfuscation, and will shrink the code base.
	Graphics_AddCanvasFunctions(graphics);


	//document.body.appendChild( canvas );
	
	document.body.oncontextmenu = function() { return false; };
	

    bindTouchEvents();

	// If we have a loading screen... find it.
    g_LoadingScreen = document.getElementById('GM4HTML5_loadingscreen');



    //requestAnimationFrame
	//setInterval(GameMaker_Tick, 1000 / (60));


    //if( (g_pGMFile.Options && g_pGMFile.Options.debugMode) || ( g_pGMFile.Options && g_pGMFile.Options.debugMode==undefined) )
	//{
    //	g_DebugMode = true; 	// if in DEBUG mode, allow console output.
    //	//hideshow(g_debug_window.document.getElementById('debug_console'));
    //}
    if (g_webGL && g_DebugMode)
    {
    	debug("WebGL Enabled!");
    	debug("Max Texture Size=" + g_webGL.GetMaxTextureSize());
    }
    InitAboyne();                               // Init the "runtime" engine
    YoYo_Init();                                // Init the YoYo GML functions       

	// IF we required WebGL and it's not available, ignore everything and abort.
	if (g_OpenGLRequired)
	{
		g_StartUpState = -2;
	} else
	{
		if (g_DebugMode) g_pBuiltIn.debug_mode = g_pGMFile.Options.debugMode;
		g_LoadingBarCallback = "";
		g_CustomLoadingBarCallback = "";
		g_LoadingCompleteCallback = function () { };
		//if (g_pGMFile.Options)
		//{
			/*if (g_pGMFile.Options.debugMode)
			{
				g_DebugMode = true; 	// if in DEBUG mode, allow console output.
				g_pBuiltIn.debug_mode = g_pGMFile.Options.debugMode;
				hideshow(document.getElementById('debug_console'));
			}*/
		//	if (g_pGMFile.Options.loadingBarCallback)
		//	{
		//		g_LoadingBarCallback = g_pGMFile.Options.loadingBarCallback;
		//	}
		//}



		// if we have a loading bar callback, then we need to load extensions first.... 
		//if (g_LoadingBarCallback != "")
		//{
		//	PreLoadExtensions(g_pGMFile);
		//	g_StartUpState = -1;
		//} else
		{
			LoadGame_PreLoadAssets(g_pGMFile);
			g_StartUpState = 0;
		}
	}
    //CheckParams();

    /* Focus our window (or iframe) now... */
	window.focus();

    /* ...and whenever the canvas is clicked. */
	canvas.addEventListener("click", function (e) {
	    window.focus();
	});
    
    g_FrameStartTime = Date.now();
	window.requestAnimFrame(animate);
}

/*var dv1 = document.getElementById('gamemaker_image');
dv1.style.left=xxx+"px";
var r = "rotate("+div_a+"deg)";
dv1.style.msTransform=r;
dv1.style.MozTransform = r;
dv1.style.WebkitTransform = r;
xxx+=1;
xxx &= 255;
div_a+=1;
if( div_a>360 ) div_a-=360;
*/
// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function animate() {
    // once in-game, timing is handled by GameMaker_Tick
    if (g_StartUpState != 3) window.requestAnimFrame(animate);
    

    if (g_LoadingCanvasCreated) {
        // Adjust the location each tick to adjust for centering/moving etc.
        CalcCanvasLocation(canvas, g_CanvasRect);
        var load = document.getElementById("loading_screen");
        load.style.position = "absolute";
        load.style.left = g_CanvasRect.left+"px";
        load.style.top = g_CanvasRect.top + "px";
    }
    var done = false;
    while(!done)
    {
        done=true;
        switch (g_StartUpState)
        {
            case -2:
                {
                    if (g_LoadingCanvasCreated) DeleteLoadingCanvas();
                    yyWebGLRequiredError(graphics, DISPLAY_WIDTH, DISPLAY_HEIGHT);
                    break;
                }

                // This is used for custom loading bars, we need to load extensions FIRST before everything else.
            case -1:	if (g_ExtensionTotal == g_ExtensionCount)
            {
                //ALl extensions should have loaded by now
                LoadGame_PreLoadAssets(g_pGMFile);
                //g_LoadingTotal = 100;
                g_StartUpState = 0;
                if (!g_LoadingCanvasCreated) {
                    CreateLoadingCanvas();
                    g_LoadingCanvasCreated = true;
                }
                ProcessFileLoading();
                g_LoadingBarCallback(g_LoadGraphics, DISPLAY_WIDTH, DISPLAY_HEIGHT, g_LoadingTotal, g_LoadingCount, g_LoadingScreen);
            }
                break;

            case 0:     
                if(!g_LoadingCanvasCreated)
                {
                    CreateLoadingCanvas();
                    g_LoadingCanvasCreated=true;
                }
                if (g_LoadingCount >= g_LoadingTotal) {
                    g_LoadingCount = g_LoadingTotal; 
                    g_StartUpState = 1;
                    done = false;
                }
                ProcessFileLoading();
                if(g_pGMFile.Options.loadingBarCallback)
                {
                    if (g_ExtensionTotal == g_ExtensionCount)
                    {
                        g_CustomLoadingBarCallback = eval(g_pGMFile.Options.loadingBarCallback);
                        g_CustomLoadingBarCallback(g_LoadGraphics, DISPLAY_WIDTH, DISPLAY_HEIGHT, g_LoadingTotal, g_LoadingCount, g_LoadingScreen);
                    }
					
                }
                else
                    g_LoadingBarCallback(g_LoadGraphics, DISPLAY_WIDTH, DISPLAY_HEIGHT, g_LoadingTotal, g_LoadingCount, g_LoadingScreen);
                //g_LoadingCount++;
                break;

            case 1:
                if (g_ExtensionTotal == g_ExtensionCount)
                {
                    DeleteLoadingCanvas();
                    LoadGame(g_pGMFile);
                    g_StartUpState = 2;
                    done = false;
                }
                break;

            case 2:     g_LoadingCompleteCallback();
                debug("Entering main loop...");
                StartGame();
                g_StartUpState = 3;
                g_pBuiltIn.last_time = new Date().getTime();
                done = false;
                break;

            case 3:
                GameMaker_Tick();
                break;	
        }
    }


}

// #############################################################################################
/// Function:<summary>
///             Draw text "centered"
///          </summary>
///
/// In:		 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="colour"></param>
///			 <param name="text"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function yyDrawCenteredText(_graphics, x,y,colour, text)
{
    _graphics.fillStyle=colour;
	_graphics.lineStyle=colour;
	_graphics.font = "14px Verdana"; ;
    _graphics.textAlign = "center";
    _graphics.fillText(text, x,y);
    _graphics.textAlign = "left";
}

// #############################################################################################
/// Function:<summary>
///          	Render the "standard" loading bar...
///          </summary>
///
/// In:		<param name="_graphics">Handle to the graphics context</param>
///			<param name="_width">width of canvas</param>
///			<param name="_height">height of canvas</param>
///			<param name="_total">Total number of files being loaded</param>
///			<param name="_current">Current count to have loaded</param>
///				
// #############################################################################################
function yyWebGLRequiredError(_graphics, _width,_height) 
{
	_graphics.fillStyle = GetHTMLRGBA(0x151515, 1.0);
	_graphics.fillRect(0, 0, _width, _height);

	yyDrawCenteredText(_graphics, _width / 2, (_height / 2), GetHTMLRGBA(0x8d8f90, 1.0), "WebGL is required to run this application.");
}


// #############################################################################################
/// Function:<summary>
///          	Render the "standard" loading bar...
///          </summary>
///
/// In:		<param name="_graphics">Handle to the graphics context</param>
///			<param name="_width">width of canvas</param>
///			<param name="_height">height of canvas</param>
///			<param name="_total">Total number of files being loaded</param>
///			<param name="_current">Current count to have loaded</param>
///				
// #############################################################################################
function yyRenderStandardLoadingBar(graphics, _width, _height, _total, _current, _loadingscreen) {

    //	if( g_webGL ) return;    

	graphics.globalAlpha = 1;
	
	
	if (_loadingscreen)
	{
	
	    try
	    {
    	    graphics.save();
	        graphics.fillStyle = GetHTMLRGBA( 0 ,1);
	        graphics.globalCompositeOperation = 'copy';
	        graphics.fillRect(0, 0, _width, _height);	
    	    graphics.restore();
		    graphics.drawImage(g_LoadingScreen, 0, 0, _width, _height);
		}
		catch (e)
		{
		    show_message(e.message);
		}
	} else
	{
		var barwidth = (_width / 100) * 50;				// Loading bar 80% width of screen
		var barheight = 2;                              // Loading bar only 4 pixels high
		var x = (_width - barwidth) / 2;
		var y = 10 + (_height - barheight) / 2;

		graphics.fillStyle = GetHTMLRGBA(0x151515, 1.0);
		graphics.fillRect(0, 0, _width, _height);


		if (_current != 0)
		{
			var w = (barwidth / _total) * _current;

			// Dar gray bar
			graphics.fillStyle = GetHTMLRGBA(0x404040, 1.0);
			graphics.fillRect(x, y, barwidth, barheight);

			graphics.fillStyle = GetHTMLRGBA(0x8d8f90, 1.0);
			graphics.fillRect(x, y, w, barheight);
		}

		yyDrawCenteredText(graphics, _width / 2, (_height / 2), GetHTMLRGBA(0x8d8f90, 1.0), "Loading");
	}
}



// #############################################################################################
/// Function:<summary>
///             erase all current backgrounds and add the new rooms backgrounds instead.
///          </summary>
///
/// In:		 <param name="_pRoom">Room to use</param>
// #############################################################################################
function    CreateRoomBackgrounds( _pRoom  )
{
    g_pBackgroundManager.Clear();
    
    var pBackgrounds = _pRoom.m_pStorage.backgrounds;
    for (var i=0; i < pBackgrounds.length; i++)
    {
        g_pBackgroundManager.Add( pBackgrounds[i] );
        var pBack = g_pBackgroundManager.Get(i);
        var pBackImage = g_pBackgroundManager.GetImage(i);
        g_pBuiltIn.background_visible[i] = pBack.visible;
        g_pBuiltIn.background_foreground[i] = pBack.foreground;
        g_pBuiltIn.background_index[i] = pBack.index;
        g_pBuiltIn.background_x[i] = pBack.x;
        g_pBuiltIn.background_y[i] = pBack.y;
        if ((pBackImage !== null) && (pBackImage !== undefined) && (pBackImage.TPEntry !== null) && (pBackImage.TPEntry !== undefined)) {
            g_pBuiltIn.background_width[i] = pBackImage.TPEntry.w;
            g_pBuiltIn.background_height[i] = pBackImage.TPEntry.h;
        } //end if
        else {
            g_pBuiltIn.background_width[i] = 0;
            g_pBuiltIn.background_height[i] = 0;
        } // end else
        g_pBuiltIn.background_htiled[i] = pBack.hTiled;
        g_pBuiltIn.background_vtiled[i] = pBack.vTiled;
        g_pBuiltIn.background_xscale[i] =  pBack.xscale;
        g_pBuiltIn.background_yscale[i] = pBack.yscale;
        g_pBuiltIn.background_vspeed[i] = pBack.vSpeed;
        g_pBuiltIn.background_hspeed[i] = pBack.hSpeed;
        g_pBuiltIn.background_blend[i] = pBack.blend;
        g_pBuiltIn.background_alpha[i] = pBack.alpha;
    }
    g_pBuiltIn.background_color = _pRoom.m_color;
}


function roughSizeOfObject_debug(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf(value) === -1
        ) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}


// #############################################################################################
/// Function:<summary>
///				Starts the particular room; starting indicates whether starting the game
///          </summary>
///
/// In:		 <param name="numb"></param>
///			 <param name="starting"></param>
// #############################################################################################
function StartRoom( _numb, _starting )
{
	// get the current room
	if( g_RunRoom )
	{
	    //Seems to be the closest to EndRoom that we have currently...
		g_RunRoom.RemoveMarked();
		

	    // IF this room is persistant, then we need to protect the cameras to stop them being nuked
	    // if it's NOT persistant, then clear the flag...
		var persistant = g_RunRoom.GetPersistent();
		for (var i = 0; i <8; i++) 
		{
		    var pView = g_RunRoom.GetView(i);
            if(pView){
		        var CamID = pView.cameraID;
		        if (CamID != -1) {
		            var pCam = g_pCameraManager.GetCamera(CamID);
		            if (pCam) {
		                if (persistant) {
		                    pCam.SetPersistent(true);
		                } else {
		                    pCam.SetPersistent(false);
		                }
		            }
		        }
		    }
        }


		if(g_isZeus)
        {
            if(g_pCameraManager!=null)
            {
                g_pCameraManager.EndRoom();
            }
        }	
	}

    var g_CurrentRoom = g_RunRoom;

    // This must be set before performing the room_end event else the event will be blocked
    New_Room = -1;
    
    effect_clear();

    g_pEffectsManager.ExecuteEffectEventsForRoom(EFFECT_ROOM_END_FUNC, g_RunRoom);
    
    g_pInstanceManager.PerformEvent(EVENT_OTHER_ENDROOM, 0);

    ParticleSystem_RemoveAllFromLayers();
    
    DeleteAllVirtualKeys();    

    // Extract all persistent instances from the room currently in use.
    // NB: This is done first since clearing the rooms m_Active list means that if
    // we switch room to the currently active room then we don't successfully delete
    // the instances from the instance pool and thus end up with 2x the instances we should    
    var persistent = [];
    var persinstlayernames = [];
    if (g_CurrentRoom != null)
    {            
        // Loop through all the active instances and copy any persistent ones to the persistent array        
        for (var i=g_CurrentRoom.m_Active.length-1; i>=0; i--)
        {
            var pInst = g_CurrentRoom.m_Active.Get(i);
            if (pInst.persistent)
            {
                persistent[persistent.length] = pInst;
                pInst.createdone = true;

                var layer = g_pLayerManager.GetLayerFromID(g_CurrentRoom, pInst.layer);
                if (layer != null)
                {
                    if (layer.m_dynamic)
                    {
                        persinstlayernames[persinstlayernames.length] = null;
                    }
                    else
                    {
                        persinstlayernames[persinstlayernames.length] = layer.m_pName;
                    }
                }
                else
                {
                    persinstlayernames[persinstlayernames.length] = null;
                }
            }
        }
        
        // Now remove the copied instances from the active list...
        for (var i=persistent.length-1; i >= 0; i--) {
            g_CurrentRoom.m_Active.DeleteItem(persistent[i]);
        }

        // Finally, remove all NON-persistent instances (clean up OLD room)
        if (g_CurrentRoom.m_persistent === false) {
            g_CurrentRoom.ClearInstances(true);

            // Clean up layers here now too
            g_pLayerManager.CleanRoomLayers(g_CurrentRoom);
        }
        else {
        
        	for (var i = g_CurrentRoom.m_Active.length - 1; i >= 0; i--)
        	{
        		var pInst = g_CurrentRoom.m_Active.Get(i);
        		pInst.pObject.RemoveInstance(pInst);
        	}

            g_pLayerManager.CleanRoomLayerRuntimeData(g_CurrentRoom);
        }
    }


    // Some global initialization	
	//g_pIOManager.Clear();
	g_pGamepadManager.Clear();

	// Kill all particles currently in flight
	//ParticleSystem_ClearParticles();          // don't do this, to match C++ runner

    // is the current room persistant?
	if(g_RunRoom && !g_RunRoom.m_persistent) {
	    //var int_size = roughSizeOfObject_debug(g_RunRoom);
	    //console.log("size: " + int_size);
	    var storage = g_RunRoom.m_pStorage;     // only bit we want to keep
	    g_RunRoom.Init();
	    //var int_size = roughSizeOfObject_debug(g_RunRoom);
	    //console.log("size: " + int_size);
	    g_RunRoom.m_pStorage = storage;     // only bit we want to keep
    }



    // Create the room, dealing with persistence
	g_RunRoom = g_pRoomManager.Get(_numb);
	var ispersistent = g_RunRoom.m_persistent;
	if (ispersistent === true && (g_RunRoom.m_Initialised === false || _starting === true)) {
	    ispersistent=false;
	}
	if (ispersistent === false)
	{
		g_RunRoom.CreateRoomFromStorage(g_RunRoom.m_pStorage);
		g_RunRoom.CopyViewsToArrays();
	} 
	else {
	
		g_RunRoom.SetWidth(g_RunRoom.m_width);
		g_RunRoom.SetHeight(g_RunRoom.m_height);
		g_RunRoom.SetSpeed(g_RunRoom.m_speed);
		g_RunRoom.SetCaption(g_RunRoom.m_pCaption);
		g_RunRoom.SetPersistent(g_RunRoom.m_persistent);
		g_RunRoom.CopyViewsToArrays();
		for (i = g_RunRoom.m_Active.length - 1; i >= 0; i--)
		{
			var pInst = g_RunRoom.m_Active.Get(i);
			pInst.pObject.AddInstance(pInst);
		}
	}
	
	
	g_pBuiltIn.room = g_RunRoom.id;	
	SetCanvasSize();

    //initialise view scaledport properties- mouse_x/y will return NaN until first draw otherwise
	var sx = g_AppSurfaceRect.w / (g_roomExtents.right - g_roomExtents.left);
	var sy = g_AppSurfaceRect.h / (g_roomExtents.bottom - g_roomExtents.top);
	var pViews = (g_RunRoom.m_enableviews) ? g_RunRoom.m_Views : g_DefaultViewArray;
	for (var i = 0; i < pViews.length; i++) {
	    var pView = pViews[i];
	    pView.scaledportx = pView.portx * sx + g_AppSurfaceRect.x;
	    pView.scaledporty = pView.porty * sy + g_AppSurfaceRect.y;
	    pView.scaledportw = pView.portw * sx;
	    pView.scaledporth = pView.porth * sy;
	    pView.scaledportx2 = pView.scaledportx + pView.scaledportw;
	    pView.scaledporty2 = pView.scaledporty + pView.scaledporth;
	}

    CreateRoomBackgrounds( g_RunRoom );
    
    // Initialise effects
    g_pEffectsManager.Init();

    // Set up runtime data for this room's layers
    if(g_pLayerManager!=null)
        g_pLayerManager.BuildRoomLayerRuntimeData(g_RunRoom);

    ParticleSystem_AddAllToLayers();

	// If this room is NOT persistent then we need to recreate all instances EXCEPT those that already exist in the persistent list
	// Any instance created in here will perform the create event... including "new" PERSISTENT instances
	if (ispersistent === false)
	{
	    // Build the physics world for this room if not persistent and one is required
	    g_RunRoom.BuildPhysicsWorld();
	    
        // Loop through all instances in the storage of the room and create the ones NOT in the persistent list...
        g_RunRoom.ClearInstances(false);
	    // g_RunRoom.m_Active = new yyOList(); //Fritz Closure changes was         m_Active = new yyOList();
        // which makes no sense. ClearInstances was nuking the list
        var pInstStorage = g_RunRoom.m_pStorage.pInstances;
        for (var l=0; l < g_RunRoom.m_pStorage.pInstances.length; l++)
        {
            var found = false;
            var pIStore = g_RunRoom.m_pStorage.pInstances[l];
            
            if (pIStore.index >= 0)
            {                
                // Now check to see if this instance exists in the persistent list and has thus already been created
                for (var u=persistent.length-1;u>=0;u--)
                {
                    if( pIStore.id == persistent[u].id ) {
                        found = true;

                        // Remove the persistent instance from the layer system (otherwise we end up adding it multiple times)
                        g_pLayerManager.RemoveStorageInstanceFromAnyLayer(g_RunRoom, persistent[u].id);

                        break;
                    }
                }
                
                // if it doesn't then create it and add it to the room, and execute any creation code and events we need
                if (!found)
                {
                	var pInstance = g_RunRoom.CreateInstance(pIStore.x, pIStore.y, pIStore.id, pIStore.index, pIStore.scaleX, pIStore.scaleY, pIStore.imageSpeed, pIStore.imageIndex, pIStore.rotation, pIStore.colour);                	    
                	pInstance.createdone = false; 
                }
            }
        }        
        
        var pInstStorage = g_RunRoom.m_pStorage.pInstances;
        for(var l=0; l < g_RunRoom.m_pStorage.pInstances.length; l++)
        {
            var pIStore = g_RunRoom.m_pStorage.pInstances[l];
            var pInstance = g_pInstanceManager.Get(pIStore.id);
            if (pInstance && (pInstance.createdone == false)) {
            
            	pInstance.createdone = true;    	
            	
            	if(!g_CreateEventOrderSwap && !g_isZeus) {
            	
            		if (pIStore.pCode) pIStore.pCode(pInstance, pInstance);
            		pInstance.PerformEvent(EVENT_PRE_CREATE, 0, pInstance, pInstance);
            		if (pIStore.pPreCreateCode) pIStore.pPreCreateCode(pInstance, pInstance);
            		pInstance.PerformEvent(EVENT_CREATE, 0, pInstance, pInstance);
            	} 
            	else {
            	
            		pInstance.PerformEvent(EVENT_PRE_CREATE, 0, pInstance, pInstance);
            		if (pIStore.pPreCreateCode) pIStore.pPreCreateCode(pInstance, pInstance);
            		pInstance.PerformEvent(EVENT_CREATE, 0, pInstance, pInstance);
            		if (pIStore.pCode) pIStore.pCode(pInstance, pInstance);
            	}
            }
        }
	}
    else
	{
	    // We want to run through the persistent list and make sure they don't exist on any layers already (as we'll be added them after)
	    for (var u = persistent.length - 1; u >= 0; u--)
	    {
	        // Remove the persistent instance from the layer system (otherwise we end up adding it multiple times)
	        g_pLayerManager.RemoveInstanceFromAnyLayer(g_RunRoom, persistent[u]);	        
	    }	     
	}
    // Add the persistent instances into the room's active list
    for (var u=0; u < persistent.length; u++)
    {
        g_RunRoom.m_Active.Add(persistent[u]);
        persistent[u].RebuildPhysicsBody();

        // Add persistent object to layer system
        if (g_isZeus)
        {
            var newLayerID = -1;
            if (persinstlayernames[u] != null)
            {
                var templayer = g_pLayerManager.GetLayerFromName(g_RunRoom, persinstlayernames[u]);
                if (templayer == null)
                {
                    templayer = g_pLayerManager.AddLayer(g_RunRoom, persistent[u].depth, persinstlayernames[u]);
                }

                if (templayer != null)
                {
                    newLayerID = templayer.m_id;
                }
            }

            persistent[u].SetOnActiveLayer(false);
            persistent[u].layer = newLayerID;
            g_pLayerManager.AddInstance(g_RunRoom, persistent[u]);
            var instlayer = g_pLayerManager.GetLayerFromID(g_RunRoom, persistent[u].layer);
            if (instlayer != null)
            {
                persistent[u].depth = instlayer.depth; // make sure instance depth matches layer
            }
        }
    }
    
    if(g_isZeus)
    {
        if(g_pCameraManager!=null)
        {
            g_pCameraManager.StartRoom();
        }
    }
    
    // Start the room, performing the correct events
    if (_starting) {
        g_pInstanceManager.PerformEvent(EVENT_OTHER_STARTGAME, 0 );
    }

    // If the room has startup code, execute it...  
    if ((ispersistent == false) && (g_RunRoom.m_code != null))
    {
        var pDummyInst = new yyInstance(0, 0, 0, 0, false, true);
        //try {
    		g_RunRoom.m_code(pDummyInst,pDummyInst);
    	//} catch(e) {
    	//	game_end(-1);
    	//}
    	pDummyInst = null;
    }    
    
    g_pInstanceManager.PerformEvent(EVENT_OTHER_STARTROOM,0);
    g_pEffectsManager.ExecuteEffectEventsForRoom(EFFECT_ROOM_START_FUNC, g_RunRoom);
    
    g_RunRoom.m_Initialised = true;

/*  
    // draw room for the first time
    if (New_Room == -1)
    {
        // Check whether we did not already move to another room
        if (Draw_Automatic == true)
        {
            Draw_Room();
            GR_Transition_Finish();
            GR_D3D_Start_Frame();
            Transition_Kind=0;
        }
    }
*/
}

function    SwitchRoom( _NewRoom )
{
    //EndRoom(false);
	StartRoom(_NewRoom,false);
}



// #############################################################################################
/// Function:<summary>
///				Starts the game
///          </summary>
// #############################################################################################
function    StartGame()
{
	//g_pObjectManager.Create_Object_Lists();
	g_pBuiltIn.score = 0;	
	g_pBuiltIn.lives = -1;

	Score = 0;
	Lives=-1;
	Transition_Kind=0;
	
	
	// create the running rooms
	persnumb = 0;   // no persistent instances
	StartRoom( g_pRoomManager.GetOrder(0).id, true );
    
    g_FrameStartTime = Date.now();
	lastfpstime = g_FrameStartTime;
	g_pBuiltIn.fps = Fps;
	g_pBuiltIn.fps_real = Fps;

    if(g_AudioModel == Audio_WebAudio)
    {
        // Audio: Report current device status to the newly created room
        Audio_EngineReportState();
    }
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/*function ProcessBetaMessage()
{
    var time = g_CurrentTime - g_StartDateTime;
    if( time <(183*997) ) return;

    g_StartDateTime = new Date().getTime();
    var c = document.getElementById(g_CanvasName);
    var l = document.getElementById("loading_screen");
    //BETA
    var g = g_LoadGraphics;
    g._save();
	g.globalAlpha = 1.0;
    g.globalCompositeOperation = 'copy';
	g.fillStyle = GetHTMLRGBA(0,0);
	g._fillRect(0, 0, c.width, c.height);
	g._restore();
	g.globalAlpha = 0.25;
	for(var i=0;i<14;i+=3){
        yyDrawCenteredText(g_LoadGraphics, (c.width/2)+g_DrawOffset[i], 16+g_DrawOffset[i+1], GetHTMLRGBA(g_DrawOffset[i+2], 1.0), DecodeString(g_pBETAWarning1));
        yyDrawCenteredText(g_LoadGraphics, (c.width/2)+g_DrawOffset[i], 37+g_DrawOffset[i+1], GetHTMLRGBA(g_DrawOffset[i+2], 1.0), DecodeString(g_pBETAWarning2));
    }
}*/

// #############################################################################################
/// Function:<summary>
///          	If we're ending the game, we need to kill everything off - including persistent objects!
///             Note that this function is also used when the game is reset.
///          </summary>
/// In:		 <param name="_reset">Whether the game will be reset afterwards.</param>
// #############################################################################################
function Run_EndGame(_reset) {

	g_ParticleTypes = [];
	g_ParticleSystems = [];
	types_created = 0;

	// Clear all instances - including persistant ones.
	g_RunRoom.m_Active.Clear();
	g_RunRoom.m_Deactive.Clear();
	var pool = g_pObjectManager.objidlist;
	for (var i = 0; i < pool.length; i++) {
		var pObj = pool[i];
		pObj.Instances.Clear();
		pObj.Instances_Recursive.Clear();
	}
	g_pInstanceManager.Clear();

	if (_reset) {
		// Just stops all audio instances.
		audio_stop_all();
	} else {
		// Destroys the AudioContext instance.
		Audio_Quit();
	}
}






// #############################################################################################
/// Function:<summary>
///          	Render any system level stuff we need to render. 
///				This will always be ON TOP of the game
///          </summary>
// #############################################################################################
function 	RenderSystemOverlays() {
	g_pIOManager.Render();
}

// #############################################################################################
/// Function:<summary>
///          	Process the new and moved instances in the active list.
///          </summary>
// #############################################################################################
function UpdateActiveLists() {
	//PROBLEM! Sort() could be wrong if m_DepthSorting list not empty, as there will be unsorted entries in active array
	//-so Sort can insert in the wrong place
	//-need to remove unsorted entries first, before doing insertion sort
	if (g_RunRoom.m_DepthSorting.length > 0) g_RunRoom.ProcessDepthList2();
	//if( g_RunRoom.m_Active.unsorted>=0 ) g_RunRoom.m_Active.Sort();
    //if (g_RunRoom.m_DepthSorting.length > 0) g_RunRoom.ProcessDepthList();
	//if (g_RunRoom.m_NewInstances.length > 0) g_RunRoom.ProcessNewInstanceList();
	if (g_ParticleChanges.length > 0) g_RunRoom.ProcessParticleDepthChange();
	

}

// #############################################################################################
/// Function:<summary>
///          	Update the positions of the instances
///          </summary>
// #############################################################################################
function UpdateInstancePositions() {

    if (g_RunRoom.m_pPhysicsWorld) {
        if(g_isZeus)
        {
            g_RunRoom.m_pPhysicsWorld.Update(g_GameTimer.GetFPS());
        }
        else
            g_RunRoom.m_pPhysicsWorld.Update(g_RunRoom.m_speed);
    }
    else {
        g_pInstanceManager.UpdatePositions();	
    }
}

// #############################################################################################
/// Function:<summary>
///          	Handle collisions if the physics hasn't taken control
///          </summary>
// #############################################################################################
function UpdateCollisions() {

    if ((g_RunRoom.m_pPhysicsWorld == null) || (g_RunRoom.m_pPhysicsWorld == undefined)) {
        HandleCollision();
    }
}

// #############################################################################################
/// Function:<summary>
///				Executes a single frame of the game.
///          </summary>
// #############################################################################################
function    GameMaker_DoAStep() {

	g_pBuiltIn.delta_time = (g_CurrentTime - g_pBuiltIn.last_time)*1000;
	g_pBuiltIn.last_time = g_CurrentTime;

    ResetSpriteMessageEvents();
    
	g_pIOManager.StartStep();	
	HandleOSEvents();
	
	g_pGamepadManager.Update();
	g_pInstanceManager.RememberOldPositions();                     	// Remember old positions
	
	g_pInstanceManager.UpdateImages();
	UpdateActiveLists();
	if (New_Room != -1) return;

    g_pLayerManager.UpdateLayers();

    // Handle events that must react to the old position
    g_pSequenceManager.PerformInstanceEvents(g_RunRoom, EVENT_STEP_BEGIN);
	g_pInstanceManager.PerformEvent(EVENT_STEP_BEGIN, 0);
	UpdateActiveLists();
	if (New_Room != -1) return;


	// If a resize event has been triggered, then do it NOW!
	if (g_DoResizeEvent){
		g_DoResizeEvent = false;
		g_pInstanceManager.PerformEvent(EVENT_DRAW_RESIZE, 0);
    }

    // ASync loading (and events) are called after the BEGIN step.
    g_pASyncManager.Process();
    UpdateActiveLists();
    if (New_Room != -1) return;

	HandleTimeLine();
	UpdateActiveLists();
    if (New_Room != -1) return;

    HandleTimeSources();
    UpdateActiveLists();
    if (New_Room != -1) return;

	HandleAlarm();
	UpdateActiveLists();
	if (New_Room != -1) return;

	HandleKeyboard();
	UpdateActiveLists();
	if (New_Room != -1) return;

	//HandleJoystick();
	//if (New_Room != -1) return;

	HandleMouse();
	UpdateActiveLists();
	if (New_Room != -1) return;

    g_pEffectsManager.StepEffectsForRoom(g_RunRoom);
	g_pSequenceManager.UpdateInstancesForRoom(g_RunRoom);                   // update this at the same time as the step event
	g_pSequenceManager.PerformInstanceEvents(g_RunRoom, EVENT_STEP_NORMAL);
	g_pInstanceManager.PerformEvent(EVENT_STEP_NORMAL, 0);                 	//HandleStep(EVENT_STEP_END);	
    UpdateActiveLists();
    if (New_Room != -1) return;

    ProcessSpriteMessageEvents();

    UpdateInstancePositions();

	// Handle event that should react to the new position
	HandleOther();
	UpdateActiveLists();
	if (New_Room != -1) return;


	YYPushEventsDispatch();
	UpdateActiveLists();
	if (New_Room != -1) return;

    UpdateCollisions();	
	UpdateActiveLists();
	if (New_Room != -1) return;

	g_pSequenceManager.PerformInstanceEvents(g_RunRoom, EVENT_STEP_END);
	g_pInstanceManager.PerformEvent(EVENT_STEP_END, 0);                 	//HandleStep(EVENT_STEP_END);
    UpdateActiveLists();
    if (New_Room != -1) return;

	// Handle the particle systems
	ParticleSystem_UpdateAll();


	// Bookkeeping && drawing
	if (g_RunRoom!=null) {
    	g_RunRoom.RemoveMarked();
    	if (Draw_Automatic) {
    	    g_RunRoom.Draw();
    	    UpdateActiveLists();
    	}
    }
    //RenderBrowserInfo();
		
	g_RunRoom.ScrollBackground();
		
	// Set all instances in the new positions
	//Cursor_Subimage = Cursor_Subimage+1;
	//if (DebugMode){
	//	DebugForm->UpdateDebugInfo();
	//}

	RenderSystemOverlays();
	
	audio_update();
}



	
// #############################################################################################
/// Function:<summary>
///          	Sets the size of the canvas, and works out scaling values for "the world"
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function SetCanvasSize()
{
    var left,right,top,bottom;
    
    left = 0;
    right = -999999;
    top  = 0;
    bottom = -999999;
    
    if (g_RunRoom.m_enableviews)
    {            
        for (var i = 0; i < g_RunRoom.m_Views.length; i++)
        {
            var pView = g_RunRoom.m_Views[i];
            if (pView.visible )// && pView.surface_id==-1) 
            {                    
                if( right < pView.portx+pView.portw ) right = pView.portx + pView.portw;                    
                if( bottom< pView.porty+pView.porth ) bottom = pView.porty + pView.porth;
            }
        }
    }    
    else {
        left = 0;
        right = g_RunRoom.m_width;
        top = 0;
        bottom = g_RunRoom.m_height;
        
        g_DefaultView.portw =  g_DefaultView.worldw = right;
        g_DefaultView.porth = g_DefaultView.worldh = bottom;
    }
    
    //restore app surface settings
    if( g_AppSurfaceEnabled )
    {
        if( !g_bUsingAppSurface )
        {
            g_ApplicationWidth = g_OldApplicationWidth;
		    g_ApplicationHeight = g_OldApplicationHeight;
		}
    }
    else
    {
        //draw direct to entire display
        g_ApplicationWidth = DISPLAY_WIDTH;
		g_ApplicationHeight = DISPLAY_HEIGHT;
		if( surface_exists(g_ApplicationSurface))
		{
		    surface_free( g_ApplicationSurface );
		    g_ApplicationSurface = -1;
		}
    }
    g_bUsingAppSurface = g_AppSurfaceEnabled;	//use app surface this frame?    

	g_DisplayWidth =  DISPLAY_WIDTH; 
	g_DisplayHeight = DISPLAY_HEIGHT;
    g_DisplayScaleX = g_ApplicationWidth / (right-left);
    g_DisplayScaleY = g_ApplicationHeight / (bottom-top);

    // no Angle allowed on view....
    var r = new YYRECT();
    r.left = left;
    r.top = top;
    r.right = right;
    r.bottom = bottom;
    g_roomExtents = r;
    //set initial g_world values since room extents are restored from these 
    g_worldx = r.left;
    g_worldy = r.top;
    g_worldw = r.right-r.left;
    g_worldh = r.bottom - r.top;

    Get_FullScreenOffset();
}


// #############################################################################################
/// Function:<summary>
///             Get the widh of the browser window
///          </summary>
///
/// Out:	 <returns>
///				Width in pixels
///			 </returns>
// #############################################################################################
function GetDebugBrowserWidth() {
	var w = 640;
	if (typeof (g_debug_window.window.innerWidth) == 'number')
	{
		//Non-IE
		w = g_debug_window.window.innerWidth;
	} else if (g_debug_window.document.documentElement && g_debug_window.document.documentElement.clientWidth)
	{
		//IE 6+ in 'standards compliant mode'
		w = g_debug_window.document.documentElement.clientWidth;
	} else if (g_debug_window.document.body && document.body.clientWidth)
	{
		//IE 4 compatible
		w = g_debug_window.document.body.clientWidth;
	}
	return w;
}

// #############################################################################################
/// Function:<summary>
///             Get the height of the browser window
///          </summary>
///
/// Out:	 <returns>
///				Height in pixels
///			 </returns>
// #############################################################################################
function GetDebugBrowserHeight() {
	var h = 480;
	if (typeof (g_debug_window.window.innerHeight) == 'number')
	{
		//Non-IE
		h = g_debug_window.window.innerHeight;
	} else if (g_debug_window.document.documentElement && g_debug_window.document.documentElement.clientHeight)
	{
		//IE 6+ in 'standards compliant mode'
		h = g_debug_window.document.documentElement.clientHeight;
	} else if (g_debug_window.document.body && document.body.clientHeight)
	{
		//IE 4 compatible
		h = g_debug_window.document.body.clientHeight;
	}
	return h;
}
	
	
// #############################################################################################
/// Function:<summary>
///             Get the widh of the browser window
///          </summary>
///
/// Out:	 <returns>
///				Width in pixels
///			 </returns>
// #############################################################################################
function    GetBrowserWidth()
{
    var w = 640; 
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        w = window.innerWidth;
    } else if( document.documentElement && document.documentElement.clientWidth ) {
        //IE 6+ in 'standards compliant mode'
        w = document.documentElement.clientWidth;
    } else if( document.body && document.body.clientWidth ) {
        //IE 4 compatible
        w = document.body.clientWidth;
    }
    return w;
}

// #############################################################################################
/// Function:<summary>
///             Get the height of the browser window
///          </summary>
///
/// Out:	 <returns>
///				Height in pixels
///			 </returns>
// #############################################################################################
function    GetBrowserHeight()
{
    var h = 480; 
    if( typeof( window.innerHeight ) == 'number' ) {
        //Non-IE
        h = window.innerHeight;
    } else if( document.documentElement && document.documentElement.clientHeight ) {
        //IE 6+ in 'standards compliant mode'
        h = document.documentElement.clientHeight;
    } else if( document.body && document.body.clientHeight ) {
        //IE 4 compatible
        h = document.body.clientHeight;
    }
    return h;
}



// #############################################################################################
/// Function:<summary>
///             private method for UTF-8 encoding
///          </summary>
///
/// In:		 <param name="string"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function _utf8_encode (string) {

    string = string.replace(String.fromCharCode(0x0a)+String.fromCharCode(0x0d)+String.fromCharCode(0x0a),"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else if ((c > 2047) && (c < 32768)) {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode(((c >> 18) & 7) | 240);
            utftext += String.fromCharCode(((c >> 12) & 63) | 128);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
}

function isalnum(aChar)
{
  return (isDigit(aChar) || isAlpha(aChar));
}
// Test for digits
function isDigit(aChar)
{
    var myCharCode = aChar.charCodeAt(0);

  if((myCharCode > 47) && (myCharCode <  58))
  {
     return true;
  }

  return false;
}
// Test for letters (only good up to char 127)
function isAlpha(aChar)
{
    var myCharCode = aChar.charCodeAt(0);

  if(((myCharCode > 64) && (myCharCode <  91)) ||
    ((myCharCode > 96) && (myCharCode < 123)))
  {
     return true;
  }

  return false;
}

// #############################################################################################
/// Function:<summary>
///             Convert a byte array into a HEX string
///          </summary>
///
/// In:		 <param name="_pBuffer"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function BufferToHex(_pBuffer)
{
    var s="";
    for(var i=0;i<_pBuffer.length;i++){
        var b = _pBuffer[i]&0xff;
        s = s+ g_Hex[b>>4]+g_Hex[b&0xf];
    }
    return s;
}

// #############################################################################################
/// Function:<summary>
///             Convert a byte array into a HEX string
///          </summary>
///
/// In:		 <param name="_pBuffer"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function IntToHex(_val)
{
    var s="";
    for(var i=0;i<8;i++){
        s = s+ g_Hex[ ((_val>>28)&0xf) ];
        _val = _val << 4;
    }
    return s;
}
function YYUDID()
{
    //Needs to return a udid for the machine we are running on
 
    var fingerprint = new Fingerprint().get();


    return fingerprint;

    //    return "e2770c0a-928f-4985-b331-cf6e2c3c56b5";
}
// #############################################################################################
/// Function:<summary>
///             Process HTML5 "pingback"
///          </summary>
// #############################################################################################

function StringToArray8(str) 
{
  //var buf = new ArrayBuffer(str.length); 
  var bufView = new Uint8Array(str.length);
  for (var i=0, strLen=str.length; i<strLen; i++) 
  {
        bufView[i] = str.charAt(i);
  }
  return bufView;
};

function Array8ToString(buf) 
{
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};


// #############################################################################################
/// Function:<summary>
///             Process "misc" stuff. Like into/outof fullscreen
///          </summary>
// #############################################################################################
function ProcessMisc() 
{
    CalcCanvasLocation(canvas,g_CanvasRect);
    canvasMinY = g_CanvasRect.top;
    canvasMinX = g_CanvasRect.left;
    canvasMaxX = g_CanvasRect.right;
    canvasMaxY = g_CanvasRect.bottom;
	//CalcCanvasLocation(canvas);
    
    Graphics_SetInterpolation_Auto(graphics);

	if ((g_LastCanvasWidth != canvas.width) || (g_LastCanvasHeight != canvas.height))
    {
    	g_DoResizeEvent = true;
    }
    g_LastCanvasWidth  = canvas.width;
    g_LastCanvasHeight = canvas.height;

    var w = GetBrowserWidth();
    var h = GetBrowserHeight();

    // Check the screen is still the same size....
    if( (g_FullScreen) && (!g_ToggleFullscreen) )
    {
        if(( g_LastWidth!=w ) || ( g_LastHeight!=h ))
        {
            // Force into fullscreen to resize to the latest canvas size.
            g_ToggleFullscreen = true;
            g_FullScreen = false;
        }
    }

    // Check for in/out of full screen mode.
    if( g_ToggleFullscreen )
    {
        g_ToggleFullscreen = false;
        
        if( g_FullScreen )
        {
            w = g_OriginalWidth;
            h = g_OriginalHeight;
            g_FullScreen = false;

            // Remember these settings, as FULLSCREEN will mess them up.
            canvas.style.position = g_Canvas_OriginalPosition;
            canvas.style.left = g_Canvas_OriginalLeft;
            canvas.style.top = g_Canvas_OriginalTop;
            canvas.style.margin = g_Canvas_Original_Margin;
            canvas.style.cssText = g_Canvas_Style;
            
            if (!g_Canvas_InRoot)
            {
            	if (canvas.parentNode != g_Canvas_Original_Parent)
            	{
            		g_Canvas_Original_Parent.insertBefore(canvas, g_Canvas_Original_Next);
            	}
            }
        }
        else
        {
           	g_FullScreen = true;
         
           	window_set_position(0, 0);
           	//canv.style.top = "0px";
           	//canv.style.left = "0px";
           	/*canvas.marginTop = "0px";
           	canvas.marginLeft = "";
           	canvas.marginBottom = "";
           	canvas.marginRight = "";
           	canvas.paddingLeft = "";
           	canvas.paddingRight = "";
           	canvas.paddingBottom = "";
           	canvas.paddingTop = "";
           	canvas.borderTop = "";
           	canvas.borderBottom = "";
           	canvas.borderLeft = "";
           	canvas.borderRight = "";*/

           	if (!g_Canvas_InRoot)
           	{
           		if (canvas.parentNode == g_Canvas_Original_Parent)
           		{
           			g_Canvas_Original_Parent.removeChild(canvas);
           			document.body.insertBefore(canvas, null);
           		}
           	}
		}
        
		canvas.width = w;
		canvas.height = h;
		DISPLAY_WIDTH = canvas.width;
		DISPLAY_HEIGHT = canvas.height;
		canvasMinX = canvas.offsetLeft;
		canvasMaxX = canvasMinX + DISPLAY_WIDTH;
		canvasMinY = canvas.offsetTop;
		canvasMaxY = canvasMinX + DISPLAY_HEIGHT;
				
		g_LastWidth = DISPLAY_WIDTH;
		g_LastHeight = DISPLAY_HEIGHT;
		
		g_DisplayWidth = w;
		g_DisplayHeight = h;
        g_DisplayScaleX = 1;
        g_DisplayScaleY = 1;

        SetCanvasSize();
    }
}



var g_CollisionEllipseCounterMax = 0;
var g_CollisionEllipseCounter = 0;
// #############################################################################################
/// Function:<summary>
///             Starts the next frame, and uses the "timer" to sleep...
///          </summary>
// #############################################################################################
function GameMaker_Tick() 
{
	//
	if (g_webGL) {
	    // g_webGL.RSMan.Reset();
	    g_webGL.Flush();
    }
    
    //
    var TargetSpeed;
    if (g_isZeus) {
        g_GameTimer.Update();
        TargetSpeed = g_GameTimer.GetFPS();
    } else {
        TargetSpeed = g_RunRoom.GetSpeed();
        if (TargetSpeed <= 0) {
            TargetSpeed = 1;
            g_RunRoom.SetSpeed(1);
        }
    }

    const last_time_ms = g_CurrentTime;
    g_CurrentTime = Date.now();

    // Time since last tick (needs to be converted from ms to us)
    const delta_time_us = (g_CurrentTime - last_time_ms) * 1000;
    g_GlobalTimeSource.Tick(delta_time_us);
    g_SDTimeSourceParent.Tick(delta_time_us);

    // fps measurement:
	if (g_CurrentTime >= lastfpstime + 1000) {
        // don't recalc fps if tab was out of focus
        if (g_CurrentTime - g_FrameStartTime < 2000) {
            Fps = newfps;
            g_pBuiltIn.fps = Fps;
        }
        newfps = 0;
        lastfpstime = g_CurrentTime;
	}
    newfps++;

    // schedule next frame:
    // this might be best done after if(!Run_Paused) block,
    // but then an exception would halt the game loop.
    var nextFrameAt = g_FrameStartTime + 1000 / TargetSpeed;
    var now = Date.now();
    var delay = g_FrameStartTime + 1000 / TargetSpeed - now;
    if (delay < 0) delay = 0;
    g_FrameStartTime = now + delay;
    if (delay > 4) {
        // 4ms is the general minimum timeout time as per spec,
        // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
        setTimeout(function() {
            if (window.yyRequestAnimationFrame) {
                window.yyRequestAnimationFrame(animate);
            } else {
                // Don't re-enter, that would be bad.
                //animate();
            }
        }, delay); 
    } else {
        if (window.yyRequestAnimationFrame) {
            window.yyRequestAnimationFrame(animate);
        } else {
            window.postMessage("yyRequestAnimationFrame", "*");
        }
    }

    if (!Run_Paused)
    {
		ProcessMisc();

        // MAX of 10 times around this loop... then we HAVE to break out to allow for input to be processed
		var ErrorCount = 10;            
		var done = false;
		while (!done)
		{
	        done = true;

		    // update default view each frame.
		    if (g_RunRoom === null)
		    {
			    g_DefaultView.scaledportx2 = g_DefaultView.scaledportw = g_DefaultView.portw = g_DefaultView.worldw = DISPLAY_WIDTH;
			    g_DefaultView.scaledporty2 = g_DefaultView.scaledporth = g_DefaultView.porth = g_DefaultView.worldh = DISPLAY_HEIGHT;
		    } else
		    {
			    SetCanvasSize();
		    }


		    // **********************************************
		    // Execute and render a single game frame
		    // **********************************************
		    // Start of frame (new_room is always -1 here...)
		    Graphics_StartFrame();
            // Do actual game tick code
		    GameMaker_DoAStep();
		    // not a "flip" just a GL end, so ALWAYS do it...       //was ... if (New_Room < 0)		    
		    Graphics_EndFrame();



			// See whether we should the room || the game
			switch (New_Room) {
				case -1:
					// Nothing needs to be done
					break;

				case ROOM_ENDOFGAME:
				case ROOM_ABORTGAME:
					Run_EndGame(false);
					return;

				case ROOM_RESTARTGAME:
					Run_EndGame(true);
					// Reset rooms to ensure persistence isn't carried over
					g_pRoomManager.ResetAll();
					StartGame();
					break;

				case ROOM_LOADGAME:
					LoadGame();
					break;

				default:
					SwitchRoom(New_Room);
					done = false;
					break;
			}
		    ErrorCount--;
		    if (ErrorCount <= 0) break;
		}

        g_MouseDeltaX = 0;
        g_MouseDeltaY = 0;
    }
    
	// if in DEBUG mode, do debug "stuff"
	if (g_pGMFile.Options && g_pGMFile.Options.debugMode) {
	    UpdateDebugWindow();
    }
}
