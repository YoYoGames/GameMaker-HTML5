// **********************************************************************************************************************
// 
// Copyright (c)2014, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyWebGL.js
// Author:    		Chris
// Project:		    HTML5
// Description:   	GameMaker HTML5 gamepad interface.
// **********************************************************************************************************************
var g_pGamepadManager = null;
var g_GamePadDeadZones = [];


// #############################################################################################
/// Function:<summary>
///             Single Gamepad class definition via Closure
///          </summary>
// #############################################################################################
/** @constructor */
function yyGamePad() {

    // Class-level constants
    var DEFAULT_AXIS_DEADZONE = 0,
        DEFAULT_BUTTON_THRESHOLD = 0.5;

    // Private data
    var m_id;
    var m_buttonValues = [];
    var m_lastButtonValues = [];
    var m_axisValues = [];     
    var m_axisDeadzone = DEFAULT_AXIS_DEADZONE;
    var m_buttonThreshold = DEFAULT_BUTTON_THRESHOLD;              
       

    Object.defineProperties(this, {
        AxisDeadzone: { 
            get: function () { return m_axisDeadzone; },
            set: function (val) { m_axisDeadzone = val; }
        },
        ButtonThreshold: { 
            get: function () { return m_buttonThreshold; },
            set: function (val) { m_buttonThreshold = val; }
        }
    });
     
    // #############################################################################################
    /// Function:<summary>
    ///             Store off the last set of button values and grab the current state
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.UpdateState = function (_nativeDevice) {
    
        m_id = _nativeDevice.id;
        m_lastButtonValues = m_buttonValues.slice();
        m_axisValues = _nativeDevice.axes.slice();

        var deviceButtons = _nativeDevice.buttons;
        if (deviceButtons) {
        
            for (var b in deviceButtons) {
                if (!deviceButtons.hasOwnProperty(b)) continue;
                if (typeof(deviceButtons[b]) === "object") {                
                    m_buttonValues[b] = deviceButtons[b].value;
                }
                else {
                    m_buttonValues[b] = deviceButtons[b];
                }
            }
        }        
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Return the hardware identifier for the native device
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.DeviceId = function () {
        return m_id || "";
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///             Return the number of buttons associated with the gamepad
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.ButtonCount = function () {
        if (m_buttonValues) {
            return m_buttonValues.length;
        }
        return 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Check to see if a button was pressed this game frame
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.ButtonPressed = function (_buttonIndex) {
            
        var currValue = m_buttonValues[_buttonIndex];
        var lastValue = m_lastButtonValues[_buttonIndex];

        if ((currValue !== undefined) && (lastValue !== undefined)) {
            return ((currValue >= m_buttonThreshold) && (lastValue < m_buttonThreshold));        
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Check to see if a button was released this game frame
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.ButtonReleased = function (_buttonIndex) {

        var currValue = m_buttonValues[_buttonIndex];
        var lastValue = m_lastButtonValues[_buttonIndex];

        if ((currValue !== undefined) && (lastValue !== undefined)) {
            return ((currValue < m_buttonThreshold) && (lastValue >= m_buttonThreshold));
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Check to see if a button was pressed down during this game frame
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.ButtonDown = function (_buttonIndex) {

        var currValue;
        if (typeof(m_buttonValues[_buttonIndex]) === "object") {
            currValue = m_buttonValues[_buttonIndex].value;
        }
        else {
            currValue = m_buttonValues[_buttonIndex];
        }

        if (currValue !== undefined) {
            return (currValue >= m_buttonThreshold);
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Get the raw value of a button
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.ButtonValue = function (_buttonIndex) {

        var currValue;
        if (typeof(m_buttonValues[_buttonIndex]) === "object") {
            currValue = m_buttonValues[_buttonIndex].value;
        }
        else {
            currValue = m_buttonValues[_buttonIndex];
        }
        return currValue || 0.0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Gets the number of axes present for this gamepad
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.AxisCount = function () {

        if (m_axisValues) {
            return m_axisValues.length;
        }
        return 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Gets the value of an axis
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamePad} */
    this.AxisValue = function (_axisIndex, _maxDeadzone) {
        
        var axisValue = m_axisValues[_axisIndex] || 0;
    	if (m_axisDeadzone > 0.0) {

    		var absValue = Math.abs(axisValue);
    		if (absValue < m_axisDeadzone) {
    		    axisValue = 0.0;
    		}
    		else {
    		    // Tweak the scaling of the axis according to the dead zone
    		    var sign = (axisValue >= 0) ? 1.0 : -1.0;
    		    axisValue = ((absValue - m_axisDeadzone) / (_maxDeadzone - m_axisDeadzone)) * sign;
    	    }
    	}		
    	return axisValue;
    };
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @constructor */
function yyGamepadManager() {

    // Common constants
    var MAX_BUTTON_THRESHOLD = 1.0,
        MAX_AXIS_DEADZONE = 1.0;

    // Class-level constants
    var GAMEPAD_API_NOT_SUPPORTED = 0,
        GAMEPAD_API_POLLING_SUPPORT = 1;
        
    var GM_GAMEPAD_CONSTANTS_BASE = 0x8000, // any buttons/axes with a value greater than this are assumed to be from builtin constants
        GM_GAMEPAD_FACE1 = 0x8001,
        GM_GAMEPAD_FACE2 = 0x8002,
        GM_GAMEPAD_FACE3 = 0x8003,
        GM_GAMEPAD_FACE4 = 0x8004,
        GM_GAMEPAD_SHOULDER_LEFT = 0x8005,
        GM_GAMEPAD_SHOULDER_RIGHT = 0x8006,
        GM_GAMEPAD_SHOULDER_LEFT_BOTTOM = 0x8007,
        GM_GAMEPAD_SHOULDER_RIGHT_BOTTOM = 0x8008,
        GM_GAMEPAD_SELECT = 0x8009,
        GM_GAMEPAD_START = 0x800A,
        GM_GAMEPAD_STICK_LEFT = 0x800B,
        GM_GAMEPAD_STICK_RIGHT = 0x800C,
        GM_GAMEPAD_PAD_UP = 0x800D,
        GM_GAMEPAD_PAD_DOWN = 0x800E,
        GM_GAMEPAD_PAD_LEFT = 0x800F,
        GM_GAMEPAD_PAD_RIGHT = 0x8010,
        GM_GAMEPAD_AXIS_LEFT_HORIZONTAL = 0x8011,
        GM_GAMEPAD_AXIS_LEFT_VERTICAL = 0x8012,
        GM_GAMEPAD_AXIS_RIGHT_HORIZONTAL = 0x8013,
        GM_GAMEPAD_AXIS_RIGHT_VERTICAL = 0x8014;
        
    // These are the defines according to the html5 API. They may not be reflected by the actual buttons/axes available...
    var GAMEPAD_FACE_1 = 0, // Face (main) buttons
        GAMEPAD_FACE_2 = 1,
        GAMEPAD_FACE_3 = 2,
        GAMEPAD_FACE_4 = 3,
        GAMEPAD_LEFT_SHOULDER = 4, // Top shoulder buttons
        GAMEPAD_RIGHT_SHOULDER = 5,
        GAMEPAD_LEFT_SHOULDER_BOTTOM = 6, // Bottom shoulder buttons
        GAMEPAD_RIGHT_SHOULDER_BOTTOM = 7,
        GAMEPAD_SELECT = 8,
        GAMEPAD_START = 9,
        GAMEPAD_LEFT_ANALOGUE_STICK = 10, // Analogue sticks (if depressible)
        GAMEPAD_RIGHT_ANALOGUE_STICK = 11,
        GAMEPAD_PAD_TOP = 12, // Directional (discrete) pad
        GAMEPAD_PAD_BOTTOM = 13,
        GAMEPAD_PAD_LEFT = 14,
        GAMEPAD_PAD_RIGHT = 15;

    var GAMEPAD_AXIS_LEFT_ANALOGUE_HOR = 0,
        GAMEPAD_AXIS_LEFT_ANALOGUE_VERT = 1,
        GAMEPAD_AXIS_RIGHT_ANALOGUE_HOR = 2,
        GAMEPAD_AXIS_RIGHT_ANALOGUE_VERT = 3;
        

    /*
    // works... but not really needed. Polling will work just as well...
    window.addEventListener("gamepadconnected", function (e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
          e.gamepad.index, e.gamepad.id,
          e.gamepad.buttons.length, e.gamepad.axes.length);
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        console.log("Gamepad disconnected from index %d: %s",
          e.gamepad.index, e.gamepad.id);
    });
    */
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Checks for the presence of the requisite functionality and runs it.
    ///             We must do so to prevent crashes on pages served with the "Feature-Policy: gamepad 'none'" header.
    ///          </summary>
    // #############################################################################################
    function GamepadsSupported() {

        var api = null;
        try {
            api = GetGamepads();
        } catch(err) {
            console.log("Failed to initialize the Gamepad API: " + err);
        }
        return(api !== null);
    }

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Gets the devices from the Gamepad support
    ///          </summary>
    // #############################################################################################
    function GetGamepads() {

        if (navigator["getGamepads"])          { return navigator["getGamepads"](); }
        if (navigator["webkitGetGamepads"])    { return navigator["webkitGetGamepads"](); }
        if (navigator["webkitGamepads"])       { return navigator["webkitGamepads"](); }    
        return null;
    }

    // Private data
    var m_supported = GamepadsSupported() 
        ? GAMEPAD_API_POLLING_SUPPORT 
        : GAMEPAD_API_NOT_SUPPORTED;
    var m_gamePads = [];

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Polls the html5 support for gamepads
    ///          </summary>
    // #############################################################################################
    function PollGamepadStatus() {
        
        var gamepads = GetGamepads();
        if (gamepads !== null) {        
            var padindex = 0;
            for (padindex = 0; padindex < gamepads.length; ++padindex)
            {
                var device = gamepads[padindex];
                if (!device && m_gamePads[padindex]) {
                    m_gamePads[padindex] = undefined;

                    // Setup audio Async event callback (no ID)
                    var pFile = g_pASyncManager.Add(undefined, undefined, ASYNC_SYSTEM_EVENT, undefined);
                    pFile.event_type = "gamepad lost";
                    pFile.pad_index = padindex;
                    pFile.m_Status = 0;
                    pFile.m_Complete = true;
                }
                else {
                    if (device && !m_gamePads[padindex]) {
                        m_gamePads[padindex] = new yyGamePad();
                        if (g_GamePadDeadZones[padindex] !== undefined) {
                            m_gamePads[padindex].AxisDeadzone = g_GamePadDeadZones[padindex];
                        }
                        // Setup audio Async event callback(no ID)
                        var pFile = g_pASyncManager.Add(undefined, undefined, ASYNC_SYSTEM_EVENT, undefined);
                        pFile.event_type = "gamepad discovered";
                        pFile.pad_index = padindex;
                        pFile.m_Status = 0;
                        pFile.m_Complete = true;
                    }

                    // Update yyGamePad with new device data
                    if (m_gamePads[padindex]) {
                        m_gamePads[padindex].UpdateState(device);
                    }
                }
            }
        }		
    }
       
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Turns a GM constant into a html5 Gamepad support constant
    ///          </summary>
    // #############################################################################################
    function TranslateButtonIndex (_buttonIndex) {

        if (_buttonIndex < GM_GAMEPAD_CONSTANTS_BASE) {
    		return _buttonIndex;
    	}
    	switch (_buttonIndex) 
    	{
    		case GM_GAMEPAD_FACE1:			
    			return GAMEPAD_FACE_1;
    		case GM_GAMEPAD_FACE2:			
    			return GAMEPAD_FACE_2;
    		case GM_GAMEPAD_FACE3:						
    			return GAMEPAD_FACE_3;
    		case GM_GAMEPAD_FACE4:						
    			return GAMEPAD_FACE_4;

    		case GM_GAMEPAD_SHOULDER_LEFT:			
    			return GAMEPAD_LEFT_SHOULDER;
    		case GM_GAMEPAD_SHOULDER_RIGHT:						
    			return GAMEPAD_RIGHT_SHOULDER;
    		case GM_GAMEPAD_SHOULDER_LEFT_BOTTOM:
    			return GAMEPAD_LEFT_SHOULDER_BOTTOM;
    		case GM_GAMEPAD_SHOULDER_RIGHT_BOTTOM:
    			return GAMEPAD_RIGHT_SHOULDER_BOTTOM;

    		case GM_GAMEPAD_SELECT:						
    			return GAMEPAD_SELECT;
    		case GM_GAMEPAD_START:
    			return GAMEPAD_START;

    		case GM_GAMEPAD_STICK_LEFT:			
    			return GAMEPAD_LEFT_ANALOGUE_STICK;
    		case GM_GAMEPAD_STICK_RIGHT: 
    			return GAMEPAD_RIGHT_ANALOGUE_STICK;

    		case GM_GAMEPAD_PAD_UP: 
    			return GAMEPAD_PAD_TOP;
    		case GM_GAMEPAD_PAD_DOWN: 
    			return GAMEPAD_PAD_BOTTOM;
    		case GM_GAMEPAD_PAD_LEFT: 
    			return GAMEPAD_PAD_LEFT;
    		case GM_GAMEPAD_PAD_RIGHT: 
    			return GAMEPAD_PAD_RIGHT;
    	}
    	return 0;
    }

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Translates a GM constant into an html5 Gamepad support constant
    ///          </summary>
    // #############################################################################################
    function TranslateAxisIndex(_axisIndex) {

        if (_axisIndex < GM_GAMEPAD_CONSTANTS_BASE) {
    		return _axisIndex;
    	}
    	switch (_axisIndex) {	
    		case GM_GAMEPAD_AXIS_LEFT_HORIZONTAL:
    			return GAMEPAD_AXIS_LEFT_ANALOGUE_HOR;
    		case GM_GAMEPAD_AXIS_LEFT_VERTICAL:
    			return GAMEPAD_AXIS_LEFT_ANALOGUE_VERT;
    		case GM_GAMEPAD_AXIS_RIGHT_HORIZONTAL:
    			return GAMEPAD_AXIS_RIGHT_ANALOGUE_HOR;
    		case GM_GAMEPAD_AXIS_RIGHT_VERTICAL:
    			return GAMEPAD_AXIS_RIGHT_ANALOGUE_VERT;
    	}
    	return 0;
    }


    // #############################################################################################
    /// Function:<summary>
    ///             Constructor
    ///          </summary>
    // #############################################################################################
    function yyGamepadManager() {
    }

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.GetDeviceCount = function() {

        return m_gamePads.length;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.GetDescription = function(_device) {

        var gamepad = m_gamePads[_device];
        if (gamepad) {
            return gamepad.DeviceId();
        }
        return "";
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.IsSupported = function() {

        return (m_supported !== GAMEPAD_API_NOT_SUPPORTED);
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonThreshold = function(_device) {

        var gamepad = m_gamePads[_device];
        if (gamepad) { 
            return gamepad.ButtonThreshold;
        }    
        return 0.0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.SetButtonThreshold = function(_device, _threshold) {
        
        var gamepad = m_gamePads[_device];
        if (gamepad) { 
            if ((_threshold >= 0.0) && (_threshold <= MAX_BUTTON_THRESHOLD)) {
                gamepad.ButtonThreshold = _threshold;
            }
        }    
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.AxisDeadzone = function(_device) {

        var gamepad = m_gamePads[_device];
        if (gamepad) { 
            return gamepad.AxisDeadzone;
        } else if (g_GamePadDeadZones[_device]!==undefined) {
            return g_GamePadDeadZones[_device];
        }

        // if all else fails... its 0 by default
        return 0.0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.SetAxisDeadzone = function(_device, _deadzone) {

        g_GamePadDeadZones[_device] = _deadzone;        // remember this for when a pad is plugged in.

        var gamepad = m_gamePads[_device];
        if (gamepad) {      	    
            if ((_deadzone >= 0.0) && (_deadzone <= MAX_AXIS_DEADZONE)) {
                gamepad.AxisDeadzone = _deadzone;
            }
        }  
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.Clear = function() {

        m_gamePads = [];
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.Update = function() {

        switch (m_supported) {            
        
            case GAMEPAD_API_POLLING_SUPPORT:
                PollGamepadStatus();
                break;
                
            case GAMEPAD_API_NOT_SUPPORTED:
            default:            
                return;
        }
    };       

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.IsConnected = function(_device) {    
    	
    	if (m_gamePads[_device] !== null && m_gamePads[_device] !== undefined) {
    	    return true;
    	}
    	return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonCount = function(_device) {

        var gamepad = m_gamePads[_device];
        if (gamepad) {  
    	    return gamepad.ButtonCount();
    	}
    	return 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.AxisCount = function(_device) {

        var gamepad = m_gamePads[_device];
        if (gamepad) {  
    	    return gamepad.AxisCount();
    	}
    	return 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonDown = function(_device, _buttonIndex) {
        
        var gamepad = m_gamePads[_device];
        if (gamepad) {        
            return gamepad.ButtonDown(TranslateButtonIndex(_buttonIndex), gamepad.ButtonThreshold);
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonPressed = function(_device, _buttonIndex) {

        var gamepad = m_gamePads[_device];
        if (gamepad) {                    
            return gamepad.ButtonPressed(TranslateButtonIndex(_buttonIndex), gamepad.ButtonThreshold);            
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonReleased = function(_device, _buttonIndex) {

        var gamepad = m_gamePads[_device];
        if (gamepad) {                    
            return gamepad.ButtonReleased(TranslateButtonIndex(_buttonIndex), gamepad.ButtonThreshold);
        }
        return false;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.ButtonValue = function(_device, _buttonIndex) {
    
        var gamepad = m_gamePads[_device];
        if (gamepad) {                    
            return gamepad.ButtonValue(TranslateButtonIndex(_buttonIndex));
        }
        return 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyGamepadManager} */
    this.AxisValue = function(_device, _axisIndex) {
    
        var gamepad = m_gamePads[_device];
        if (gamepad) {                    
            return gamepad.AxisValue(TranslateAxisIndex(_axisIndex), MAX_AXIS_DEADZONE);
        }
        return 0;
    };    
};
