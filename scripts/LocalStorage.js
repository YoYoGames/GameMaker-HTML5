// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            LocalStorage.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function SupportsLocalStorage() 
{
	try {
		if (('localStorage' in window) && (window['localStorage'] !== null)) {
			g_SupportsLocalStorage = true;
		}
	} 
	catch (e) {
		g_SupportsLocalStorage = false;
	}
	return g_SupportsLocalStorage;
}

// #############################################################################################
/// Function:<summary>
///             Builds the root key we use for generating localStorage ids
///          </summary>
// #############################################################################################
function GetLocalStorageRoot()
{
    // Only use alpha-numeric characters, and underbars, from the display name
    var displayName = "";
    if (g_pGMFile.Options.DisplayName !== null && g_pGMFile.Options.DisplayName !== undefined) {
    
        for (var i = 0; i < g_pGMFile.Options.DisplayName.length; i++) {
        
            var chr = g_pGMFile.Options.DisplayName[i];
            if ((chr >= 'a' && chr <= 'z') ||
                (chr >= 'A' && chr <= 'Z') ||
                (chr >= '0' && chr <= '9') ||
                (chr === '_'))
            {
                displayName = displayName + g_pGMFile.Options.DisplayName[i];
            }
        }
    }
    if (displayName.length === 0) {
        displayName = "GameMaker";
    }
    return displayName + "." + g_pBuiltIn.game_id + ".";
}

// #############################################################################################
/// Function:<summary>
///             Returns the key used for the key-value pair when something is in local storage
///          </summary>
// #############################################################################################
function GetLocalStorageName(_fname)
{
    return (g_pBuiltIn.local_storage + _fname);
}
