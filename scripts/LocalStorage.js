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
    let _displayName = (g_pGMFile.Options.DisplayName || "").replace(new RegExp("[^\\w]", "g"), "");
    return (_displayName || "GameMaker") + "." + g_pBuiltIn.game_id + ".";
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
