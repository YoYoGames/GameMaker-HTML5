// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            IOManager.js
// Created:         17/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/02/2011		
// 
// **********************************************************************************************************************

var MAX_KEYS = 256;
var MAX_BUTTONS = 5;
var MAX_INPUT_STRING = 1024;

var VIRTUALKEY_ACTIVE = 1;
var VIRTUALKEY_DRAW = 2;
var VIRTUALKEY_OUTLINE = 4;

var	NEW_INPUT_EVENT = 1;                // this is a new event
var	TOUCH_INPUT_EVENT = 2;				// this was done via mouse or touch
var INPUT_EVENT_ACTIVE = 0x80000000;	// this was done via mouse or touch

var MAX_INPUT_EVENTS = 128;             // number of events we can handle each frame

var g_ButtonButton = 0,
    g_EventButtons = 0,
    g_EventMouseX = 0,
    g_EventMouseY = 0,    
    g_EventButtonDown = -1,
    g_EventButtonUp = 0,
    g_EventLastButtonDown = -1,
    g_EventLastButtonUp = 0,
    g_LastKeyPressed = 0,
	g_LastKeyPressed_code = 0,
	g_GameFocus = (typeof (document.hasFocus) == "function" ? document.hasFocus() : true),
	g_MouseUP = 0,
	g_MouseDOWN = 0,
	g_BrowserInputCapture = false,
	g_MouseWheel = 0;


var g_KeyDown = [];
var g_KeyPressed = [];
var g_KeyUp = [];

// Used for virtual key-press tracking
var g_VirtualKeys = [];
var g_InputEvents = [];

// Collects together the current set of input events, including holding onto the mouse down state
var g_CurrentInputEvents = [];

var g_LastVirtualKeys = 0;

// Collects together all touch events as single-button mice
var g_TouchEvents = [];

var g_UnshiftedKeyboardMapping = {
8: String.fromCharCode(8),
9:0,
13:0,
16:0,		//shift	16
17:0,		//ctrl	17
18:0,		//alt	18
19:0,		//pause/break	19
20:0,		//caps lock	20
27:0,		//escape	27
22:0,		//page up	33
32:" ",
34:0,		//page down	34
35:0,		//end	35
36:0,		//home	36
37:0,		//left arrow	37
38:0,		//up arrow	38
39:0,		//right arrow	39
40:0,		//down arrow	40
45:0,		//insert	45
46:0,		//delete	46
47:0,
48:"0",
49:"1",	
50:"2",	
51:"3",	
52:"4",	
53:"5",	
54:"6",	
55:"7",	
56:"8",	
57:"9",
58:"0",
59:";",
61:"=",
65:"a",	
66:"b",	
67:"c",	
68:"d",	
69:"e",	
70:"f",	
71:"g",	
72:"h",	
73:"i",	
74:"j",	
75:"k",	
76:"l",	
77:"m",	
78:"n",	
79:"o",	
80:"p",	
81:"q",	
82:"r",	
83:"s",	
84:"t",	
85:"u",	
86:"v",	
87:"w",	
88:"x",	
89:"y",	
90:"z",	
91:0,		//left window key	91
92:0,		//right window key	92
93:0,		//select key	93
96:"0", 	//numpad 0 96
97:"1",		//numpad 1	97
98:"2",		//numpad 2	98
99:"3",		//numpad 3	99
100:"4",	//numpad 4	100
101:"5",	//numpad 5	101
102:"6",	//numpad 6	102
103:"7",	//numpad 7	103
104:"8",	//numpad 8	104
105:"9",	//numpad 9	105
106:"*",	//multiply	106
107:"+",	//add	107
109:"-",	//subtract	109
110:".",	//decimal point	110
111:"/",	//divide	111
112:0,		//f1	112
113:0,		//f2	113
114:0,		//f3	114
115:0,		//f4	115
116:0,		//f5	116
117:0,		//f6	117
118:0,		//f7	118
119:0,		//f8	119
120:0,		//f9	120
121:0,		//f10	121
122:0,		//f11	122
123:0,		//f12	123
144:0,		//num lock	144
145:0,		//scroll lock	145
173:"-",		
186:";",		
187:"=",		
188:",",		
189:"-",	
190:".",	
191:"/",
192:"'",
219:"[",	//open bracket	219
220:"\\",	
221:"]",	//close braket	221
222:"#",	//single quote	222
223:"`"	
};


var g_ShiftedKeyboardMapping = {
	8: String.fromCharCode(8),
	9: 0,
	13: 0,
	16: 0, 	//shift	16
	17: 0, 	//ctrl	17
	18: 0, 	//alt	18
	19: 0, 	//pause/break	19
	20: 0, 	//caps lock	20
	27: 0, 	//escape	27
	22: 0, 	//page up	33
	32: " ",
	34: 0, 	//page down	34
	35: 0, 	//end	35
	36: 0, 	//home	36
	37: 0, 	//left arrow	37
	38: 0, 	//up arrow	38
	39: 0, 	//right arrow	39
	40: 0, 	//down arrow	40
	45: 0, 	//insert	45
	46: 0, 	//delete	46
	47: 0,
	48: ")",
	49: "!",
	50: "\"",
	51: "£",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	58: ")",
	59: ":",
	61: "+",
	65: "A",
	66: "B",
	67: "C",
	68: "D",
	69: "E",
	70: "F",
	71: "G",
	72: "H",
	73: "I",
	74: "J",
	75: "K",
	76: "L",
	77: "M",
	78: "N",
	79: "O",
	80: "P",
	81: "Q",
	82: "R",
	83: "S",
	84: "T",
	85: "U",
	86: "V",
	87: "W",
	88: "X",
	89: "Y",
	90: "Z",
	91: 0, 	//left window key	91
	92: 0, 	//right window key	92
	93: 0, 	//select key	93
	96: "0", 	//numpad 0 96
	97: "1", 	//numpad 1	97
	98: "2", 	//numpad 2	98
	99: "3", 	//numpad 3	99
	100: "4", //numpad 4	100
	101: "5", //numpad 5	101
	102: "6", //numpad 6	102
	103: "7", //numpad 7	103
	104: "8", //numpad 8	104
	105: "9", //numpad 9	105
	106: "*", //multiply	106
	107: "+", //add	107
	109: "-", //subtract	109
	110: ".", //decimal point	110
	111: "/", //divide	111
	112: 0, 	//f1	112
	113: 0, 	//f2	113
	114: 0, 	//f3	114
	115: 0, 	//f4	115
	116: 0, 	//f5	116
	117: 0, 	//f6	117
	118: 0, 	//f7	118
	119: 0, 	//f8	119
	120: 0, 	//f9	120
	121: 0, 	//f10	121
	122: 0, 	//f11	122
	123: 0, 	//f12	123
	144: 0, 	//num lock	144
	145: 0, 	//scroll lock	145
	173: "_",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	192: "@",
	219: "{", //open bracket	219
	220: "|",
	221: "}", //close braket	221
	222: "~",	//single quote	222
	223: "¬"
};



// #############################################################################################
/// Function:<summary>
///          	Detect going IN of input focus
///          </summary>
// #############################################################################################
function yySetINFocus() {
	g_GameFocus = true;
	//debug("IN focus");
}
// #############################################################################################
/// Function:<summary>
///          	Detect going IN of input focus
///          </summary>
// #############################################################################################
function yySetOUTFocus() {
	g_GameFocus = false;
	//debug("OUT focus");
	Clear_Pressed();
}



// #############################################################################################
/// Function:<summary>
///          	Show/Hide an element. (toggles)
///          </summary>
///
/// In:		<param name="which">Which element to show/hide</param>
// #############################################################################################
function hideshow(which)
{
	if (!document.getElementById) return;
	if (which.style.display == "block")
	{
		which.style.display = "none";
	} else
	{
		which.style.display = "block";
	}
}


// #############################################################################################
/// Function:<summary>
///          	Given a frame and canvas, check it's ours, and if so.. make it active.
///          </summary>
///
/// In:		<param name="_ifr"></param>
///			<param name="_can"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function CheckJSON_Game(_ifr, _can) {
	try
	{
		if (_ifr)
		{
			if (_ifr.JSON_game)
			{
				if (_ifr.JSON_game.Options)
				{
					if (_ifr.JSON_game.Options.gameGuid)
					{
						if (_ifr.JSON_game.Options.gameGuid == JSON_game.Options.gameGuid)
						{
							_ifr.focus();
							_can.focus();
							return true;
						}
					}
				}
			}
		}
	} catch (err)
	{
		// error - don't really care what, just return.
	}
	return false;
}

// #############################################################################################
/// Function:<summary>
///          	Set THIS game to have focus
///          </summary>
// #############################################################################################
function SetGameFocus() {
	var canv = document.getElementById(g_CanvasName);
	var ff;

	// Now look through all the frames and tfind OURS!
	if ((g_OSBrowser == BROWSER_CHROME) || (g_OSBrowser == BROWSER_FIREFOX) || (g_OSBrowser == BROWSER_SAFARI) || (g_OSBrowser == BROWSER_SAFARI_MOBILE))
	{
	    ff = canv.parentNode.frames;
	    if (!ff) {
	        CheckJSON_Game(this, canv);
	    } else {
	        for (var ifrindex = 0; ifrindex < ff.length; ifrindex++) {
	            var ifr = ff[ifrindex];
	            if (CheckJSON_Game(ifr, canv)) break;
	        }
	    }
	} else
	{
	    if (!canv.parentElement || !canv.parentElement.document || !canv.parentNode.document.getElementsByTagName("IFRAME")) {
	        CheckJSON_Game(this, canv);
	    }else{
	        ff = canv.parentNode.document.getElementsByTagName("IFRAME");
	        for (var ifrindex in ff){
	            var ifr = ff[ifrindex].contentWindow;
	            if (CheckJSON_Game(ifr, canv)) break;
	        }
	    }
	}
		
}

// #############################################################################################
/// Function:<summary>
///          	Go into HTML5 fullscreen mode.
///          </summary>
// #############################################################################################


var g_Elem_OriginalPosition;
var g_Elem_OriginalLeft;
var g_Elem_OriginalTop;
var g_Elem_Original_Margin;


var g_Div_Width;
var g_Div_Height;
var g_Div_Margin;
var g_Div_Position;
var g_Div_Left;
var g_Frame_Width;
var g_Frame_Height;
           
function enterFullscreen() {
    var elem = document.getElementById("gm4html5_div_id");
    if(elem)
    {
        
     //   g_Elem_OriginalPosition;
        g_Elem_OriginalLeft = elem.style.left ;
        g_Elem_OriginalTop = elem.style.top;
        g_Elem_Original_Margin = elem.style.margin;


        var top = window.parent;
        if (top != null) {
            if (top.chrome != null && top.chrome.app != null && top.chrome.app.window != null) {
                var precurwind = top.chrome.app.window.current();

                if (precurwind != null) {

                    var cont = window.parent.document.getElementById("container");
                    var gcont = window.parent.document.getElementById("game");
                    if (cont != null) {

                        g_Div_Width = cont.style.width;
                        g_Div_Height = cont.style.height;
                        g_Div_Left = cont.style.left;
                        g_Div_Margin = cont.style.margin;
                        g_Div_Position = cont.style.position;
                    }

                    if (gcont != null) {
                        g_Frame_Width = gcont.style.width;
                        g_Frame_Height = gcont.style.height;
                    }
                    
                    precurwind.fullscreen();
                    
                    var bnds = precurwind.getBounds();



                    if (cont != null) {
                 
                        cont.style.width = "100%";
                        cont.style.height = "100%";
                        cont.style.left = "0";
                        cont.style.margin = 'auto';
                        cont.style.position = 'relative';
                    }


                    if (gcont != null) {
                        gcont.style.width = "100%";
                        gcont.style.height = "100%";
                        canvas.style.width = "100%";
                        canvas.style.height = "100%";
                    }
                }
            }
        }
       
        elem.style.margin = "0px";
        elem.style.top = "0";
        elem.style.left = "0";
        elem.style.marginLeft = "0px";
        elem.style.marginTop = "0px";

        if(elem.mozRequestFullScreen)
        {
        	document.onmozfullscreenchange = function ( event )
        	{
        		document.onmozfullscreenchange = onFullscreenExit;
        	};

        	elem.mozRequestFullScreen();
        }
        else if(elem.webkitRequestFullScreen)
        {
            elem.onwebkitfullscreenchange = function (e) 
            {
				elem.onwebkitfullscreenchange = onFullscreenExit;
		    };
		    
		    if (g_OSBrowser == BROWSER_SAFARI)
		    {
			    elem.webkitRequestFullScreen(); // (Element.ALLOW_KEYBOARD_INPUT);
		    } 
		    else
		    {
			    elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		    }
            //elem.webkitRequestFullScreen();
        }
        else if (document.documentElement.requestFullScreen)
	    {
		    document.documentElement.requestFullScreen();
        }

	    g_ToggleFullscreen = true;
	    return;
    }

	if (canvas.mozRequestFullScreen)
	{
	  	canvas.style.margin = "0px";
        canvas.style.top = "";
        canvas.style.left = "";
        canvas.style.marginLeft = "0px";
        canvas.style.marginTop = "0px";
		canvas.mozRequestFullScreen();
	}
	else if ( canvas.webkitRequestFullScreen )
	{
		canvas.style.margin = "0px";
        canvas.style.top = "";
        canvas.style.left = "";
        canvas.style.marginLeft = "0px";
        canvas.style.marginTop = "0px";
        
		canvas.onwebkitfullscreenchange = function (e) {
			//console.log("Entered fullscreen!");
			canvas.onwebkitfullscreenchange = onFullscreenExit;
		};
		if (g_OSBrowser == BROWSER_SAFARI)
		{
			canvas.webkitRequestFullScreen(); // (Element.ALLOW_KEYBOARD_INPUT);
		} else
		{
			canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else if (document.documentElement.requestFullScreen)
	{
		canvas.style.margin = "0px";
        canvas.style.top = "";
        canvas.style.left = "";
        canvas.style.marginLeft = "0px";
        canvas.style.marginTop = "0px";
		document.documentElement.requestFullScreen();
	}
	g_ToggleFullscreen = true;
}

// #############################################################################################
/// Function:<summary>
///          	Called when full screen is exited on Firefox/Chrome
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function onFullscreenExit() {
	//console.log("Exit fullscreen!");
	
	if(g_FullScreen)
	{
	    var elem = document.getElementById("gm4html5_div_id");
        if(elem)
        {
	        elem.style.left = g_Elem_OriginalLeft;
            elem.style.top = g_Elem_OriginalTop;
            elem.style.margin = g_Elem_Original_Margin;

        }

        var top = window.parent;
        if (top != null) {
            if (top.chrome != null && top.chrome.app != null && top.chrome.app.window != null) {
                var precurwind = top.chrome.app.window.current();

                if (precurwind != null)
                    precurwind.restore();
            }
        }
	    
        g_ToggleFullscreen = true;
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
function CancelFullScreenMode() {
	//console.log("Cacnel fullscreen!");

    var top = window.parent;
    if (top != null) {
        if (top.chrome != null && top.chrome.app != null && top.chrome.app.window != null) {
            var precurwind = top.chrome.app.window.current();

            if (precurwind != null) {
                precurwind.restore();
                g_ToggleFullscreen = true;
                

                var cont = window.parent.document.getElementById("container");

                if (cont != null) {

                    cont.style.width = g_Div_Width;
                    cont.style.height = g_Div_Height;
                    cont.style.left = g_Div_Left;
                    cont.style.margin = g_Div_Margin;
                    cont.style.position = g_Div_Position;
                }

                var gcont = window.parent.document.getElementById("game");

                if (gcont != null) {
                    gcont.style.width = g_Frame_Width;
                    gcont.style.height = g_Frame_Height;

                  
                    canvas.style.width = g_Frame_Width;
                    canvas.style.height = g_Frame_Height;
                }
            }
        }
    }


	if (document.webkitCancelFullScreen)
	{
		document.webkitCancelFullScreen();
	} else if (document.mozCancelFullScreen)
	{
		document.mozCancelFullScreen();
		onFullscreenExit();
	} else
	{
		g_ToggleFullscreen = true;
	}
}



// #############################################################################################
/// Function:<summary>
///          	Grab all "keybaord" input
///          </summary>
// #############################################################################################
function CaptureBrowserInput() {
	if (g_InputCaught) return;
	window.onkeyup = function () { yyKeyUpCallback(arguments[0] || window.event); };
	window.onkeydown = function ()
	{
	    var evt = arguments[0] || window.event;
	    if ( ( g_AllowFullscreen ) && ( evt != null ) && ( evt.which == 121 ) && ( !evt.repeat ) && ( canvas.mozRequestFullScreen ) )
	    {
	    	if ( !document.mozFullScreen )
	    	{
                RememberCanvasSettings();
                enterFullscreen();
	    	}
	    	else
	    	{
                CancelFullScreenMode();
            }

            evt.preventDefault();
            return false;
        }
	    
	    if ( yyKeyDownCallback(evt) == false ) {
            evt.preventDefault();
            return false;
		}
	};
	window.onmouseup = onMouseUp;
	g_InputCaught = true;
}


// #############################################################################################
/// Function:<summary>
///          	Grab all "keybaord" input
///          </summary>
// #############################################################################################
function ReleaseBrowserInput() {
	if (g_InputCaught == false) return;
	window.onkeydown = null;
	window.onkeyup = null;
	window.onmouseup = null;

	g_InputCaught = false;
}


// #############################################################################################
/// Function:<summary>
///             Key down event callback
///          </summary>
// #############################################################################################

function yyFullScreenKeyCode(keycode) {

    if (keycode == 121) {
        //Should be F10
        return true;
    }

    if (window.chrome && window.chrome.app) {
        if (keycode == 183)
            return true;
    }

    return false;
}

function    yyKeyDownCallback( evt )
{
    var keycode;
    //console.log("evt:  " + evt.key + "     code:" + evt.code);
    if(evt == null)
    {
        keycode = window.event.which;
        if (keycode == 122) return true; 	// if F11, then allow it to pass through
        if (keycode != 121) window.event.preventDefault(); else g_ToggleFullscreen = true; //F10
        window.event.preventDefault();
    }
    else 
    {
    //    if (evt.repeat) return false;
    	keycode = evt.which;
    	if (keycode == 122) return true;		// if F11, then allow it to pass through
    	if (keycode == 120) {
    	    //if (g_DebugMode) hideshow(g_debug_window.document.getElementById('debug_console'));
    	} else if (!yyFullScreenKeyCode(keycode)) {
    	    evt.preventDefault();
    	} else {
    	    if (g_AllowFullscreen) {
    	        // F10 pressed for fullscreen.
    	        if (!g_FullScreen) {
    	            RememberCanvasSettings();
    	            enterFullscreen();
    	        } else {
    	            CancelFullScreenMode();
    	        }
    	    }
    	}
        evt.preventDefault();
	}

    // Only set key pressed if not already down
    if (!g_KeyDown[keycode]) {
        g_KeyPressed[keycode] = 1;
    }
  
    g_KeyDown[keycode]=1;
    g_LastKeyPressed_code = keycode;


	// Now do the REALLY annoying mapping of scan codes to characters - as best we can.
	
	if (g_OSBrowser == BROWSER_IE){
	    g_LastKeyPressed = evt.char;        // If we HAVE the correct key, use it!
	} else if (evt.key) {
	    if (evt.key.length == 1) {
	        g_LastKeyPressed = evt.key;         // If we HAVE the correct key, use it!
	    } else if (keycode == 8) {
	        g_LastKeyPressed = String.fromCharCode(8);
	    } else if (keycode == 13) {
	        g_LastKeyPressed = String.fromCharCode(13);
	    } else {
	        g_LastKeyPressed = "";
	    }
	}else{
		if (evt.shiftKey)
		{
			g_LastKeyPressed = g_ShiftedKeyboardMapping[keycode];
		} else
		{
			g_LastKeyPressed = g_UnshiftedKeyboardMapping[keycode];
		}
	}
	if(!g_LastKeyPressed) g_LastKeyPressed = "";
    //console.log(keycode);
	return false;
}

// #############################################################################################
/// Function:<summary>
///             Key down event callback
///          </summary>
// #############################################################################################
function    yyKeyUpCallback( evt )
{
    var keycode;
    if(evt == null)
    {
        keycode = window.event.which;
        if (keycode == 122) return; 	// if F11, then allow it to pass through
        window.event.preventDefault();
    }
    else 
    {
        keycode = evt.which;
        if (keycode == 122) return; 	// if F11, then allow it to pass through
        evt.preventDefault();
    }

    g_KeyUp[keycode]=1;    
    g_KeyDown[keycode] = 0;
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	Fire off an event to the element under the canvas.
///          </summary>
///
/// In:		<param name="_name">name of event</param>
///			<param name="_evt">the event we just got</param>
///				
// #############################################################################################
function FireMouseEvent(_name, _evt) 
{
	var target, pEvent;

	// Find the element UNDER us
	var old = canvas.style.display;
	canvas.style.display = "none";
	target = document.elementFromPoint(_evt.clientX, _evt.clientY);
	canvas.style.display = old;


	target = "canvas";
	pEvent = document.createEvent('MouseEvents');
	pEvent.initMouseEvent(
					   _name,
					   true,     // Click events bubble 
					   true,     // and they can be cancelled 
					   document.defaultView,  // Use the default view 
					   1,        // Just a single click 
					   _evt.screenX,        // Don't bother with co-ordinates 
					   _evt.screenY,
					   _evt.clientX,
					   _evt.clientY,
					   false,    // Don't apply any key modifiers 
					   false,
					   false,
					   false,
					   _evt.button,        // 0 - left, 1 - middle, 2 - right 
					   null
				);
	pEvent.target = target;
	target.dispatchEvent(pEvent); //pEvent);
	//document.body.dispatchEvent(pEvent); //pEvent);
}

// #############################################################################################
/// Function:<summary>
///             Process Mouse moving events...
///          </summary>
///
/// In:		 <param name="evt">Event object</param>
// #############################################################################################
function onMouseMove(_evt) {

	g_EventMouseX = _evt.clientX;
	g_EventMouseY = _evt.clientY;

	// Keep the current input events updated        		
	g_CurrentInputEvents[_evt.button].x = g_EventMouseX;
	g_CurrentInputEvents[_evt.button].y = g_EventMouseY;
}
// #############################################################################################
/// Function:<summary>
///             Process Mouse DOWN events...
///          </summary>
///
/// In:		 <param name="evt">Event object</param>
// #############################################################################################
function onMouseDown(_evt) {

	if (!g_GameFocus)
	{
		SetGameFocus();
	}

	g_ButtonButton = _evt.button;

	// Swap middle and RIGHT button, so middle is button 3.   
	if (g_ButtonButton == 2) g_ButtonButton = 1;
	else if (g_ButtonButton == 1) g_ButtonButton = 2;

	g_EventLastButtonDown = g_ButtonButton;
	g_EventButtonDown = g_ButtonButton;
	g_EventButtons |= (1 << g_ButtonButton);

    // NB: adjustments to x,y according to the TL of the canvas occur in view.GetMouseX/Y()		
	g_CurrentInputEvents[_evt.button].Flags = TOUCH_INPUT_EVENT | INPUT_EVENT_ACTIVE | NEW_INPUT_EVENT;
	g_CurrentInputEvents[_evt.button].x = _evt.pageX;
	g_CurrentInputEvents[_evt.button].y = _evt.pageY;
	
	return _evt;
}

// #############################################################################################
/// Function:<summary>
///             Process Mouse UP events...
///          </summary>
///
/// In:		 <param name="evt">Event object</param>
// #############################################################################################
function onMouseUp(_evt) {
	g_ButtonButton = _evt.button;

	// Swap middle and RIGHT button, so middle is button 3.   
	if (g_ButtonButton == 2) g_ButtonButton = 1;
	else if (g_ButtonButton == 1) g_ButtonButton = 2;

	g_EventLastButtonUp = g_EventButtonUp;
	g_EventButtonUp = g_ButtonButton;
	g_EventButtons &= ~(1 << g_ButtonButton);
	g_EventButtonDown = -1;

	// Clear the current input event for this button
	g_CurrentInputEvents[_evt.button].Flags = 0;

	return false;
}

// #############################################################################################
/// Function:<summary>
///          	On mouse wheel
///          </summary>
///
/// In:		<param name="_evt"></param>
// #############################################################################################
function onMouseWheel(_evt) {
	if(_evt.detail)
	{
		g_MouseWheel = -_evt.detail;
	} else
	{
		g_MouseWheel = _evt.wheelDelta;
	}
}


// #############################################################################################
/// Function:<summary>
///             Called on TAB or browser CLOSE.
///          </summary>
// #############################################################################################
function confirmExit() {
	if(g_pInstanceManager != null)
	{
		g_pInstanceManager.PerformEvent(EVENT_OTHER_ENDGAME, 0);
	}
	return undefined;
}


// #############################################################################################
/// Function:<summary>
///             Create an IO manager
///          </summary>
// #############################################################################################
/**@constructor*/
function    yyIOManager( )
{
    this.LastChar="a";							    // Last character pressed
    this.InputString = [];				// +1 is for termination

    this.CurrentKey = this.LastKey = -1; 
    this.KeyDown = [];						    // whether the key is down
	this.KeyReleased = [];					    // Whether the key was released
	this.KeyPressed = [];					    // Wether the key was pressed


	this.LastButton = this.CurrentButton = 0; 	// Last mouse button pressed
	
	this.ButtonDown = [];						// Whether the mouse button is down
	this.ButtonReleased = [];					// Whether the mouse button was released
	this.ButtonPressed = [];					// Whether the mouse button was pressed
	this.WheelDown = this.WheelUp = false;
	    
	this.KeyMap = [];						    // Translation map for keys

	this.String_Curr = this.m_DoMouseButton = this.m_DoMouseButton_Last = this.m_DoMouseButtonX = this.MouseX = this.MouseY =  this.FrameCount = 0;


    // init data   
	for (var l = 0; l < MAX_INPUT_STRING ; l++){
        this.InputString[l]="";
    }    
    for(var l=0;l<MAX_KEYS;l++){
        this.KeyDown[l]= this.KeyReleased[l]= this.KeyPressed[l]=false;
        this.KeyMap[l] = l;
    }
    for(var l=0;l<MAX_BUTTONS;l++){
        this.ButtonDown[l]= this.ButtonReleased[l]= this.ButtonPressed[l]=false;
    }

    this.Update = IO_Update;
    //this.Clear = IO_Clear;
    this.StartStep = IO_StartStep;
    this.Char_Last_Get = Char_Last_Get;
    this.Char_Last_Set = Char_Last_Set;
    this.Key_Last_Get = Key_Last_Get;
    this.Key_Current_Get = Key_Current_Get;
    this.Key_Last_Set = Key_Last_Set;
    this.Key_Current_Set = Key_Current_Set;
    this.Key_Down = Key_Down;
    this.Key_Pressed = Key_Pressed;
    this.Key_Released = Key_Released;
    this.Key_Clear = Key_Clear;
    this.Button_Last_Get = Button_Last_Get;
    this.Button_Current_Get = Button_Current_Get;
	this.Button_Last_Set = Button_Last_Set;
    this.Button_Current_Set = Button_Current_Set;
    this.Button_Down = Button_Down;
    this.Button_Pressed = Button_Pressed;
    this.Button_Released = Button_Released;
    this.Button_Clear = Button_Clear;
    this.Button_Clear_All = Button_Clear_All;
    this.HandleKeyDown =    IO_HandleKeyDown;
    this.HandleKeyPressed=  IO_HandleKeyPressed;
    this.HandleKeyReleased= IO_HandleKeyReleased;
    this.ProcessVirtualKeys = ProcessVirtualKeys;

	// going from 0 to max makes it a "proper" packed array, and is much faster for some Javascript engines.
    for (var l = 0; l < MAX_KEYS; l++){
        g_KeyDown[l]= g_KeyUp[l] = false;
    }    

    if (!g_ChromeStore) {
        window.onbeforeunload = confirmExit;
    }
    
    // Setup the input events array for handling virtual keys
    g_InputEvents = new Array(MAX_INPUT_EVENTS);
    g_CurrentInputEvents = new Array(MAX_INPUT_EVENTS);
    for (var eventIndex = 0; eventIndex < MAX_INPUT_EVENTS; eventIndex++) {
        g_InputEvents[eventIndex] = new yyInputEvent();
        g_CurrentInputEvents[eventIndex] = new yyInputEvent();
    }        
    
    browser_input_capture( true );    

}

function browser_input_capture( _enable )
{
    _enable = yyGetBool(_enable);

    if (g_BrowserInputCapture == _enable) return;
    
    Clear_Pressed();
    g_BrowserInputCapture = _enable;
    if (_enable) {
        //canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.onmousemove = onMouseMove;
        canvas.onmousedown = onMouseDown;
        window.onmouseup = onMouseUp;
        //canvas.onmouseup = onMouseUp;
        canvas.onmousewheel = onMouseWheel;
        canvas.onselectstart = function() { return false; };

        canvas.addEventListener("DOMMouseScroll", onMouseWheel, false);
        var l = document.getElementById("loading_screen");
        if (l)
        {
    	    l.onmousemove = onMouseMove;
    	    l.onmousedown = onMouseDown;
    	    l.onmouseup = onMouseUp;
    	    l.onmousewheel = onMouseWheel;
    	    l.addEventListener("DOMMouseScroll", onMouseWheel, false);
        }

        window.addEventListener("focus", yySetINFocus);
        window.addEventListener("blur", yySetOUTFocus);

        // IE, Chrome, FireFox and Safari
      
        CaptureBrowserInput();
    } // end if
    else {
    
        //canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.onmousemove = null;
        canvas.onmousedown = null;
        window.onmouseup = null;
        //canvas.onmouseup = null;
        canvas.onmousewheel = null;
        canvas.onselectstart = null;
        
        canvas.removeEventListener("DOMMouseScroll", onMouseWheel);
        var l = document.getElementById("loading_screen");
        if (l)
        {
    	    l.onmousemove = null;
    	    l.onmousedown = null;
    	    l.onmouseup = null;
    	    l.onmousewheel = null;
    	    l.removeEventListener("DOMMouseScroll", onMouseWheel);
        }

        document.body.onfocusin = null;
        document.body.onfocusout = null;
        document.onfocusin = null;
        document.onfocusout = null;
        window.onfocus = null;
        window.onblur = null;

        // IE, Chrome, FireFox and Safari
       
        ReleaseBrowserInput();
    
    } // end else
} // end browser_input_capture

// #############################################################################################
/// Function:<summary>
///				Sets up an InputEvent object 
///          </summary>
///
// #############################################################################################
/**@constructor*/
function yyInputEvent()
{
    this.Flags = 0;
    this.x = 0;
    this.y = 0;
}


// #############################################################################################
/// Function:<summary>
///				Clears all IO related variables setting all buttons unpressed
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Clear_Pressed() 
{
	IO_Key_Clear_All();
	IO_Button_Clear_All();
	g_pBuiltIn.keyboard_key = 0;
	g_pBuiltIn.keyboard_key = "";
	g_LastKeyPressed_code = 0;
	g_LastKeyPressed = "";
}



// #############################################################################################
/// Function:<summary>
///				Clears all IO related variables setting all buttons unpressed
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
//function IO_Clear()
yyIOManager.prototype.Clear = function () {
	//String_Clear();
	this.Key_Clear_All();
	this.Button_Clear_All();

	g_pBuiltIn.keyboard_key = 0;
	g_pBuiltIn.keyboard_lastkey = 0;
	g_pBuiltIn.keyboard_key = "";
	g_LastKeyPressed_code = 0;
	g_LastKeyPressed = "";
	g_pBuiltIn.keyboard_lastchar = "";
	g_pBuiltIn.keyboard_string = "";
};



// #############################################################################################
/// Function:<summary>
///				Returns the last pressed character
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Char_Last_Get()
{
	return this.LastChar;
}

// #############################################################################################
/// Function:<summary>
///				Sets the last pressed character
///          </summary>
///
/// In:		 <param name="ch"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Char_Last_Set(_ch)
{
	this.LastChar = _ch;
}


// #############################################################################################
/// Function:<summary>
///				Returns the keycode of the last pressed key
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function    Key_Last_Get()
{
	return this.LastKey;
}

// #############################################################################################
/// Function:<summary>
///				Returns the keycode of the currently pressed key
///          </summary>
///
/// Out:	 <returns>
///				Current key pressed
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function    Key_Current_Get()
{
	return this.CurrentKey;
}

// #############################################################################################
/// Function:<summary>
///				Sets the keycode of the last pressed key
///          </summary>
///
/// In:		 <param name="key"></param>
// #############################################################################################
/** @this {yyIOManager} */
function  Key_Last_Set(_key)
{
	if ( _key<0 || _key>255) return false;
    this.LastKey= _key;
}

// #############################################################################################
/// Function:<summary>
///				Sets the keycode of the currently pressed key
///          </summary>
///
/// In:		 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Key_Current_Set(_key)
{
	if ( _key<0 || _key>255) return false;
    this.CurrentKey= _key;
}


// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated key is down at the moment
///          </summary>
///
/// In:		 <param name="_key">Key to retrun</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Key_Down(_key)
{
	if ( _key<0 || _key>255) return false;
	return this.KeyDown[_key];
}

// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated key was pressed since last step
///          </summary>
///
/// In:		 <param name="_key">Key to retrun</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function    Key_Pressed(_key)
{
	if ( _key<0 || _key>255) return false;
	return this.KeyPressed[_key];
}

// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated key was pressed since last step
///          </summary>
///
/// In:		 <param name="_key">Key to retrun</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Key_Released( _key )
{
    if ( _key<0 || _key>255) return false;
    return this.KeyReleased[_key];
}

// #############################################################################################
/// Function:<summary>
///				Clears the key status
///          </summary>
///
/// In:		 <param name="_key">Key to clear</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Key_Clear( _key )
{
	if ( _key<0 || _key>255 ) return;
	this.KeyDown[_key] = 0;
	this.KeyPressed[_key] = 0;
	this.KeyReleased[_key] = 0;
}


// #############################################################################################
/// Function:<summary>
///				Clears the key status of all keys
///          </summary>
// #############################################################################################
yyIOManager.prototype.Key_Clear_All = function () {
	this.LastKey = 0;
	this.CurrentKey = 0;
	this.LastChar = 0;

	for (var i = 0; i <= MAX_KEYS; i++)
	{
		this.KeyDown[i] = 0;
		this.KeyPressed[i] = 0;
		this.KeyReleased[i] = 0;
	}
};


// #############################################################################################
/// Function:<summary>
///				Clears the key status of all keys
///          </summary>
// #############################################################################################
function IO_Key_Clear_All() {
    
	for (var i = 0; i < MAX_KEYS; i++)
	{
		g_KeyPressed[i] = 0;		
		g_KeyUp[i] = 0;
		g_KeyDown[i] = 0;
	}
}


// #############################################################################################
/// Function:<summary>
///				Returns the last pressed button (1=left, 2=rigth, 3=middle, 0=none)
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Button_Last_Get()
{
	return this.LastButton;
}

// #############################################################################################
/// Function:<summary>
///				Returns the currently pressed button
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Button_Current_Get()
{
	return this.CurrentButton;
}

// #############################################################################################
/// Function:<summary>
///				Sets the last pressed button (1=left, 2=rigth, 3=middle, 0=none)
///          </summary>
///
/// In:		 <param name="button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Button_Last_Set(_button)
{
  if ( (_button<1) || (_button>3) ) return;
  this.LastButton= _button;
}

// #############################################################################################
/// Function:<summary>
///				Sets the currently pressed button
///          </summary>
///
/// In:		 <param name="button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Button_Current_Set( _button )
{
  if ( (_button<1) || (_button>3) ) return;
  this.CurrentButton= _button;
}

// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated button is down at the moment
///          </summary>
///
/// In:		 <param name="button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function Button_Down(_button)
{
    _button--;
	if ( _button>=0 && _button<MAX_BUTTONS )
	{
	    return this.ButtonDown[_button];
	}
	return false;
}

// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated button was pressed since last step
///          </summary>
///
/// In:		 <param name="_button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function    Button_Pressed( _button )
{
    _button--;
	if( _button>=0 && _button<MAX_BUTTONS)
	{
		return this.ButtonPressed[_button];
	}
}

// #############################################################################################
/// Function:<summary>
///				Returns whether the indicated button was pressed since last step
///          </summary>
///
/// In:		 <param name="_button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Button_Released( _button )
{
    _button--;
    if ( _button>=0 && _button<MAX_BUTTONS ) 
    {
        return this.ButtonReleased[_button];
    }
    return false;
}


// #############################################################################################
/// Function:<summary>
///				Clears the button status
///          </summary>
///
/// In:		 <param name="_button"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Button_Clear(_button)
{
    _button--;
	if ( _button>=0 && _button<MAX_BUTTONS ) 
	{
	    this.ButtonDown[_button] = false;
	    this.ButtonPressed[_button] = false;
	    this.ButtonReleased[_button] = false;
    }
}

// #############################################################################################
/// Function:<summary>
///				Clears the status of all buttons
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @this {yyIOManager} */
function  Button_Clear_All()
{
    this.LastButton = 0;
    this.CurrentButton = 0;

	for(var i=0; i<=MAX_BUTTONS; i++ ){
	
	    this.ButtonDown[i] = false;
	    this.ButtonPressed[i] = false;
	    this.ButtonReleased[i] = false;
	}		
	this.WheelUp = false;
	this.WheelDown = false;
	
	for (var touchIndex = 0; touchIndex < g_TouchEvents.length; touchIndex++) 
	{
        g_TouchEvents[touchIndex].Clear();        
    }
}

// #############################################################################################
/// Function:<summary>
///				Clears the status of all buttons
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function IO_Button_Clear_All() {


	g_EventLastButtonUp = -1;
	g_EventButtonUp = -1;
	g_EventButtonDown = -1;
	g_EventButtons = 0;

	g_CurrentInputEvents[0].Flags = 0;
	g_CurrentInputEvents[0].x = 0;
	g_CurrentInputEvents[0].y = 0;

	g_ButtonButton = -1;

		// Only register a mousedown event if the mouse is within the canvas. This is because we don't
		// seem to get mouseup events if the user is manipulating scroll bars.
		//if ((_evt.pageX >= canvasMinX) && (_evt.pageX <= canvasMaxX) &&
		//    (_evt.pageY >= canvasMinY) && (_evt.pageY <= canvasMaxY))
/*		{
			g_CurrentInputEvents[_evt.button].Flags = TOUCH_INPUT_EVENT | INPUT_EVENT_ACTIVE | NEW_INPUT_EVENT;
			g_CurrentInputEvents[_evt.button].x = _evt.pageX - canvasMinX;
			g_CurrentInputEvents[_evt.button].y = _evt.pageY - canvasMinY;
		}
*/
}

// #############################################################################################
/// Function:<summary>
///             Update the IO system.
///          </summary>
// #############################################################################################
/** @this {yyIOManager} */
function    IO_Update()
{
    // Update touch event button pressed/released settings
    for (var touchIndex = 0; touchIndex < g_TouchEvents.length; touchIndex++)
    {
        var touchEvent = g_TouchEvents[touchIndex];
        if (touchEvent.ButtonDown) {
        
            touchEvent.ButtonReleased = 0;
            touchEvent.ButtonPressed = touchEvent.ButtonDownLast ^ touchEvent.ButtonDown;
        }
        else {
            touchEvent.ButtonReleased = touchEvent.ButtonDownLast ^ touchEvent.ButtonDown;
            touchEvent.ButtonPressed = 0;
        }
        touchEvent.ButtonDownLast = touchEvent.ButtonDown;
    }

    // Copy the current events over to the main events
    for (var eventIndex = 0; eventIndex < g_CurrentInputEvents.length; eventIndex++) 
    {
        g_InputEvents[eventIndex].Flags = g_CurrentInputEvents[eventIndex].Flags;
        g_InputEvents[eventIndex].x = g_CurrentInputEvents[eventIndex].x;
        g_InputEvents[eventIndex].y = g_CurrentInputEvents[eventIndex].y;
        
        // Ensure the current input events don't have the NEW_INPUT_EVENT flag lingering
        g_CurrentInputEvents[eventIndex].Flags &= ~NEW_INPUT_EVENT;
    }

	if (g_LastKeyPressed_code)
	{
		if (g_LastKeyPressed)
		{
			if (g_LastKeyPressed_code == 13)
			{
			}else if (g_LastKeyPressed_code == 8)
			{
				g_pBuiltIn.keyboard_lastchar = g_LastKeyPressed;
				if (g_pBuiltIn.keyboard_string.length > 0)
				{
					g_pBuiltIn.keyboard_string = g_pBuiltIn.keyboard_string.substring(0, g_pBuiltIn.keyboard_string.length - 1);
				}
			} else
			{
				g_pBuiltIn.keyboard_lastchar = g_LastKeyPressed;
				g_pBuiltIn.keyboard_string += g_pBuiltIn.keyboard_lastchar;
				if (g_pBuiltIn.keyboard_string.length > 1024)
				{
					g_pBuiltIn.keyboard_string = g_pBuiltIn.keyboard_string.substring(1, g_pBuiltIn.keyboard_string.length - 1);
				}
			}
		}
		// 
		if (g_pBuiltIn.keyboard_key != 0) {
			g_pBuiltIn.keyboard_lastkey = g_pBuiltIn.keyboard_key;
		}
		g_pBuiltIn.keyboard_key = g_LastKeyPressed_code;
		//
		g_LastKeyPressed_code = 0;
	} else if (!g_pIOManager.KeyDown[g_pBuiltIn.keyboard_key]) {
		// if keyboard_key is no longer held, reset it
	    g_pBuiltIn.keyboard_lastkey = g_pBuiltIn.keyboard_key;
	    g_pBuiltIn.keyboard_key = 0;
	}

    this.MouseX = g_EventMouseX;
    this.MouseY = g_EventMouseY;
    this.m_DoMouseButton = g_EventButtons;    
    
    // LEFT mouse button.
    if ((this.m_DoMouseButton & 1) != 0)
    {
        this.ButtonDown[0] = 1;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x1) != 0)
        {
        	this.ButtonPressed[0] = 1;        	
		}
	}
	else {
        this.ButtonDown[0] = 0;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x1) != 0)
        {
        	this.ButtonReleased[0] = 1;
		}
	}
    	
	// Right mouse button.
    if ((this.m_DoMouseButton & 2) != 0)
    {
        this.ButtonDown[1] = 1;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x2) != 0)
        {
        	this.ButtonPressed[1] = 1;
		}
	}
	else {
        this.ButtonDown[1] = 0;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x2) != 0)
        {
        	this.ButtonReleased[1] = 1;
		}
	}
	    
	// Middle mouse button.
    if ((this.m_DoMouseButton & 4) != 0)
    {
        this.ButtonDown[2] = 1;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x4) != 0)
        {
        	this.ButtonPressed[2] = 1;
		}
	}
	else {
        this.ButtonDown[2] = 0;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x4) != 0)
        {
        	this.ButtonReleased[2] = 1;
		}
	}

	// side1 mouse button.
    if ((this.m_DoMouseButton & 8) != 0)
    {
        this.ButtonDown[3] = 1;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x8) != 0)
        {
        	this.ButtonPressed[3] = 1;
		}
	}
	else {
        this.ButtonDown[3] = 0;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x8) != 0)
        {
        	this.ButtonReleased[3] = 1;
		}
	}
	// side2 mouse button.
    if ((this.m_DoMouseButton & 16) != 0)
    {
        this.ButtonDown[4] = 1;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x10) != 0)
        {
        	this.ButtonPressed[4] = 1;
		}
	}
	else {
        this.ButtonDown[4] = 0;        
        if (((this.m_DoMouseButton_Last ^ this.m_DoMouseButton) & 0x10) != 0)
        {
        	this.ButtonReleased[4] = 1;
		}
	}

    this.m_DoMouseButton_Last = this.m_DoMouseButton;

    g_pBuiltIn.mouse_x = this.MouseX;
    g_pBuiltIn.mouse_y = this.MouseY;
    g_pBuiltIn.mouse_button = g_EventButtonDown + 1;
    g_pBuiltIn.mouse_lastbutton = g_EventLastButtonDown + 1;
    
    this.ProcessVirtualKeys();
}

// #############################################################################################
/// Function:<summary>
///             Process the virtual keys
///          </summary>
// #############################################################################################
/** @this {yyIOManager} */
function ProcessVirtualKeys()
{       
    var CurrentVirtualKeyEvents = 0;
    var bit = 0;

    var w = g_GUIWidth;
    var h = g_GUIHeight;
	var ww = window_get_width();
	var wh = window_get_height();
	if (w < 0) w = ww;
	if (h < 0) h = wh;
	
	for (var eventIndex = 0; eventIndex < g_InputEvents.length; eventIndex++) 
    {
        var inputEvent = g_InputEvents[eventIndex];
        if ((inputEvent.Flags & INPUT_EVENT_ACTIVE) != 0)
        {
            bit = 1;            
            for (var vkeyIndex = 0; vkeyIndex < g_VirtualKeys.length; vkeyIndex++)
            {
                var vkey = g_VirtualKeys[vkeyIndex];
                if ((vkey.flags & VIRTUALKEY_ACTIVE) != 0)
                {
                	var x = (w * (inputEvent.x - g_CanvasRect.left)) / ww;
                	var y = (h * (inputEvent.y - g_CanvasRect.top)) / wh;
                    
                    if((x >= vkey.x) && (x < vkey.x2) && (y >= vkey.y) && (y < vkey.y2))
					{					    
						CurrentVirtualKeyEvents |= bit;						
					}
				}
				bit <<= 1;
            }
            inputEvent.Flags = 0;
        }
    }
    
    // Now process actual KEY press/releases
	bit = 1;	
	var wholediff = g_LastVirtualKeys ^ CurrentVirtualKeyEvents;
	for (var vkeyIndex = 0; vkeyIndex < g_VirtualKeys.length; vkeyIndex++)
	{
	    var vkey = g_VirtualKeys[vkeyIndex];
		if ((vkey.flags & VIRTUALKEY_ACTIVE) != 0)
		{
			var curr = CurrentVirtualKeyEvents & bit;
			var diff = wholediff&bit;
			
			// KEY or BUTTON
			if (vkey.key != 0) 
			{			
				// just pressed
				this.KeyPressed[ vkey.key ] |= (curr && diff);
				// held
				this.KeyDown[ vkey.key ] |= (curr && !diff);
				// released
				this.KeyReleased[ vkey.key ] |= (!curr && diff);
			}
			else {
				// NB: Currently only the main mouse can have virtual keys mapped to it
				// just pressed
				this.ButtonPressed[ vkey.button-1 ] |= (curr && diff);
				// held
				this.ButtonDown[ vkey.button-1 ] |= (curr && !diff);
				// released
				this.ButtonReleased[ vkey.button-1 ] |= (!curr && diff);
			}
		}		
		bit <<= 1;
	}

	g_LastVirtualKeys = CurrentVirtualKeyEvents;
}

// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
function HandleKeyDown(key_down)
{
    var evt = EVENT_KEYBOARD | key_down;
    // We want to check all objects to see who is interested in this event
	var pool = g_RunRoom.m_Active.pool;
	// Don't process any new additions to the pool added to the list end
	var plen = pool.length;		
	for (var o = 0; o < plen; o++)
	{
		// get the object
		var pInst = pool[o];
		var pObj = pInst.pObject;
            
        // IF this object wants the event... then perform the event on ALL its instances.
		if (pObj.REvent[evt])
		{
			pInst.PerformEvent(EVENT_KEYBOARD, key_down, pInst, pInst);
		}
    }
}

// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
function  EventHandleKeyPressed(key_pressed)
{
    var evt = EVENT_KEYPRESS | key_pressed;
    // We want to check all objects to see who is interested in this event
	var pool = g_RunRoom.m_Active.pool;			
	// Don't process any new additions to the pool added to the list end
	var plen = pool.length;		
	for (var o = 0; o < plen; o++)		
	{
		// get the object
		var pInst = pool[o];
		if (pInst.marked) {
		    continue;
		}
		
		var pObj = pInst.pObject;
            
        // IF this object wants the event... then perform the event on ALL its instances.
        if (pObj.REvent[evt])
        {
        	pInst.PerformEvent(EVENT_KEYPRESS, key_pressed, pInst, pInst);
        }
    }
}

// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
function  HandleKeyReleased(key_released)
{
    var evt = EVENT_KEYRELEASE | key_released;
    // We want to check all objects to see who is interested in this event
	var pool = g_RunRoom.m_Active.pool;	
	// Don't process any new additions to the pool added to the list end
	var plen = pool.length;	
	for (var o = 0; o < plen; o++)
	{
		// get the object
		var pInst = pool[o];
		var pObj = pInst.pObject;

		// IF this object wants the event... then perform the event on ALL its instances.
        if (pObj.REvent[evt])
        {
        	pInst.PerformEvent(EVENT_KEYRELEASE, key_released, pInst, pInst);
        }
    }    
}

// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
/** @this {yyIOManager} */
function IO_HandleKeyDown()
{
    // Process PRESSED
    var keyDown = 0; // handles events for NOKEY and ANYKEY
    for(var i=2;i<MAX_KEYS;i++)
    {
        // Has this key been pressed?
        if( this.KeyDown[i] ) 
        {
            keyDown = 1;
            HandleKeyDown(i);      
        }
    }
    
    // Handle NOKEY/ANYKEY events
    HandleKeyDown(keyDown);
}


// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
/** @this {yyIOManager} */
function  IO_HandleKeyPressed()
{
    // Process PRESSED
    var keyPressed = 0; // handles events for NOKEY and ANYKEY  (0=nokey)
    for(var i=2;i<MAX_KEYS;i++)
    {
        // Has this key been pressed?
        if( this.KeyPressed[i] ) 
        {
            keyPressed = 1;						// 1 = ANYKEY
            EventHandleKeyPressed(i);
        }
    }  
    
    // Handle NOKEY/ANYKEY
	EventHandleKeyPressed(keyPressed);      
}



// #############################################################################################
/// Function:<summary>
///				EVENT: Handle the press of a particular key
///          </summary>
///
/// In:		 <param name="key">Key to deal with</param>
// #############################################################################################
/** @this {yyIOManager} */
function  IO_HandleKeyReleased()
{
    // Process PRESSED
    var keyReleased = 0; // handles events for NOKEY and ANYKEY
    for(var i=2;i<MAX_KEYS;i++)
    {
        // Has this key been pressed?
        if( this.KeyReleased[i] ) 
        {
            keyReleased = 1;
            HandleKeyReleased(i);
        }        
    }
    
    // Handle NOKEY/ANYKEY
    HandleKeyReleased(keyReleased);
}




// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
/** @this {yyIOManager} */
function    IO_StartStep()
{
	var pressed = 0,
	    down = 0,
	    released = 0;

	this.FrameCount++;

	// Process keys
	for (var i = 0; i < MAX_KEYS; i++){
		this.KeyPressed[i] = this.KeyReleased[i] = this.KeyDown[i] = 0;		
	}
		
	for (var i = 0; i < MAX_KEYS; i++)
	{
		var key = this.KeyMap[i];

	    this.KeyPressed[key] |= g_KeyPressed[i];
	    this.KeyReleased[key] |= g_KeyUp[i];
	    this.KeyDown[key] |= g_KeyDown[i];

	    pressed |= g_KeyPressed[i];
	    down |= g_KeyDown[i];
	    released |= g_KeyUp[i];

	    g_KeyPressed[i] = 0;
	    g_KeyUp[i] = 0;
	}

	// ANY key
	this.KeyPressed[1] = pressed;
	this.KeyDown[1] = down;
	this.KeyReleased[1] = released;

	// NO key
	this.KeyPressed[0] = pressed^1;
	this.KeyDown[0] = down^1;
	this.KeyReleased[0] = released^1;


	g_MouseUP = g_MouseDOWN = 0;
	if (g_MouseWheel > 0){
		g_MouseUP = 1;
	} else if (g_MouseWheel < 0){
		g_MouseDOWN = 1;
	}
	g_MouseWheel = 0;

        
    for(var i=0;i<=MAX_BUTTONS;i++) {
        this.ButtonPressed[i] = false;
        this.ButtonReleased[i] = false;
    }
    this.WheelUp = false;
    this.WheelDown = false;

    this.Update();





    // Get the default view, or the standard view array
    var pViews;
	if(!g_RunRoom.m_enableviews){
    	pViews = g_DefaultViewArray;
    } else{
    	pViews = g_RunRoom.m_Views;
    }
	
	var pView;
	//default mouse position ( if mouse is not in any view ) is relative to first visible view
	for( var v = 0; v <=7; ++v )
	{
	    pView = pViews[v];
	    if(pView && pView.visible)
	    {
	        g_pBuiltIn.mouse_x = pView.GetMouseX(g_pIOManager.MouseX,g_pIOManager.MouseY);
    		g_pBuiltIn.mouse_y = pView.GetMouseY(g_pIOManager.MouseX,g_pIOManager.MouseY);
    		break;
	    }
	}
	
	// Now loop through the view array and get the mouse_x,mouse_y based on the view it's in.
    for(var v=7;v>=0;v--)
    {
    	pView = pViews[v];
    	if(pView && pView.visible)
    	{
    		//if (pView.surface_id == -1)
    		//{
    			CalcCanvasLocation(canvas, g_CanvasRect);
    		//} else
    		//{
    		//	CalcCanvasLocation(g_Surfaces.Get(pView.surface_id), g_CanvasRect);
    		//}
    		if (((this.MouseX - g_CanvasRect.left) >= pView.scaledportx) && ((this.MouseX - g_CanvasRect.left) < pView.scaledportx2) &&
                ((this.MouseY - g_CanvasRect.top) >= pView.scaledporty) && ((this.MouseY - g_CanvasRect.top) < pView.scaledporty2))
    		{
    		    g_pBuiltIn.mouse_x = pView.GetMouseX(g_pIOManager.MouseX,g_pIOManager.MouseY);
    		    g_pBuiltIn.mouse_y = pView.GetMouseY(g_pIOManager.MouseX,g_pIOManager.MouseY);  
    			break;
    		}
    	}
    }
}


// #############################################################################################
/// Function:<summary>
///             Process keybaord events
///          </summary>
// #############################################################################################
function HandleKeyboard()
{
    g_pIOManager.HandleKeyDown();
    g_pIOManager.HandleKeyPressed();
    g_pIOManager.HandleKeyReleased();
}

// #############################################################################################
/// Function:<summary>
///             Constructor for a VirtualKey object
///          </summary>
// #############################################################################################
/**@constructor*/
function yyVirtualKey(index)
{
    this.flags = 0;
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.w = 0;
    this.h = 0;
    this.u = 0;
    this.v = 0;
    this.key = 0;
    this.button = 0;
}

// #############################################################################################
/// Function:<summary>
///             Allocate a virtual key
///          </summary>
// #############################################################################################
function AllocateVirtualKey()
{
    // Attempt to re-allocate a previously released virtual key
    for (var l = 0; l < g_VirtualKeys.length; ++l) 
    {
        if (g_VirtualKeys[l].flags == 0)
        {
            return g_VirtualKeys[l];
        }
    }
    
    // Allocate a new virtual key by adding a new entry to the virtual keys array
    var i = g_VirtualKeys.length;
    g_VirtualKeys[i] = new yyVirtualKey(i);
 
    return g_VirtualKeys[i];
}

// #############################################################################################
/// Function:<summary>
///             Free up a previously allocated virtual key
///          </summary>
// #############################################################################################
function FreeVirtualKey(_vkey)
{
	g_VirtualKeys[_vkey].flags = 0;
}

// #############################################################################################
/// Function:<summary>
///             Free up a previously allocated virtual key
///          </summary>
// #############################################################################################
function DeleteAllVirtualKeys() {
	// Attempt to re-allocate a previously released virtual key
	for (var l = 0; l < g_VirtualKeys.length; ++l)
	{
		g_VirtualKeys[l].flags = 0;
	}
}
// #############################################################################################
/// Property: <summary>
///           	Render IO specific stuff.
///           </summary>
// #############################################################################################
yyIOManager.prototype.Render = function () {

	login_dialog_update();

	// We don't render into the "world" space. We render directly onto the screen in canvas space.
	Graphics_Save();

	var trans = [];
	trans[0] = 1;
	trans[1] = 0;
	trans[2] = 0;
	trans[3] = 1;
	trans[4] = 0;
	trans[5] = 0;
	Graphics_SetTransform(trans);
	//graphics._setTransform(trans[0], trans[1], trans[2], trans[3], trans[4], trans[5]);


	var oldalpha = draw_get_alpha();
	var oldcolour = draw_get_color();

	draw_set_color(0xffffff);

	// Loop through all the virtual keys and look for draw flags
	for (var l = 0; l < g_VirtualKeyDrawList.length; ++l)
	{
		var pKey = g_VirtualKeyDrawList[l];
		draw_rectangle( pKey.x, pKey.y, pKey.x + pKey.w - 1, pKey.y + pKey.h - 1, true);
	}

	// And ..... restore.
	draw_set_color(oldcolour);
	draw_set_alpha(oldalpha);
	Graphics_Restore();
};
