// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_ini.js
// Created:			27/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/05/2011		V1.1        MJD     Functions blocked in
// 
// **********************************************************************************************************************



var g_IniFile = null;


// #############################################################################################
/// Function:<summary>
///          	Opens the INI file with the given name. 
///             The ini file must be stored in the same folder as the game!
///          </summary>
///
/// In:		<param name="_file">file to open</param>
///				
// #############################################################################################
function ini_open_from_string(_content) {

    // if still open, close the last one....
    if (g_IniFile) {
        ini_close();
    }

    g_IniFile = INI_OpenFromString(yyGetString(_content));
}


// #############################################################################################
/// Function:<summary>
///          	Opens the INI file with the given name. 
///             The ini file must be stored in the same folder as the game!
///          </summary>
///
/// In:		<param name="_file">file to open</param>
///				
// #############################################################################################
function ini_open(_file) {

    _file = yyGetString(_file);

	// if still open, close the last one....
	if (g_IniFile){
		ini_close();
	}

	var pIni = null;
	if (g_SupportsLocalStorage)
	{
        pIni = INI_OpenIniFile(_file, true);
	}
	if( pIni==null ){
        pIni = INI_OpenIniFile(_file, false);
    }
	if( pIni==null ){
	    pIni = new yyIniFile(_file);
	}
	
	g_IniFile = pIni;
}


// #############################################################################################
/// Function:<summary>
///          	Closes the currently open INI file.
///          </summary>
// #############################################################################################
function ini_close() 
{
	if (!g_IniFile) return; 	// already closed, or not open.

    var file = g_IniFile.WriteIniFile();
    g_IniFile = null;
    return file;
}

// #############################################################################################
/// Function:<summary>
///          	Reads the string value of the indicated key in the indicated section. 
///             When the key or section does not exist the default value is returned.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="_key"></param>
///			<param name="_default"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_read_string(_section,_key,_default)
{
    if (!g_IniFile) yyError("ini_read_string : Trying to read from undefined INI file");
    return g_IniFile.ReadString(yyGetString(_section), yyGetString(_key), yyGetString(_default));
}


// #############################################################################################
/// Function:<summary>
///          	Reads the real value of the indicated key in the indicated section. 
///             When the key or section does not exist the default value is returned.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="_key"></param>
///			<param name="_default"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_read_real(_section,_key,_default) 
{
    if (!g_IniFile) yyError("ini_read_real : Trying to read from undefined INI file");
    return g_IniFile.ReadFloat(yyGetString(_section), yyGetString(_key), yyGetString(_default));
}


// #############################################################################################
/// Function:<summary>
///          	Writes the string value for the indicated key in the indicated section.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="_key"></param>
///			<param name="_value"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_write_string(_section,_key,_value) 
{
    if (!g_IniFile) yyError("ini_write_string : Trying to write to undefined INI file");
    g_IniFile.SetKey(yyGetString(_section), yyGetString(_key), yyGetString(_value));
    return true;
}

// #############################################################################################
/// Function:<summary>
///          	Writes the real value for the indicated key in the indicated section.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="_key"></param>
///			<param name="_value"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_write_real(_section,_key,_value) 
{
    if (!g_IniFile) yyError("ini_write_real : Trying to write to undefined INI file");
    g_IniFile.SetKey( yyGetString(_section), yyGetString(_key), ""+yyGetReal(_value));
    return true;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated key exists in the indicated section.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="_key"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_key_exists(_section,_key)
{
    if (!g_IniFile) yyError("ini_key_exists : Trying to read from undefined INI file");
    var pKey = g_IniFile.FindKey(yyGetString(_section),yyGetString(_key));
    if( pKey!=null && pKey!=undefined ) return true;
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated section exists.
///          </summary>
///
/// In:		<param name="_section"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_section_exists(_section) 
{
    if (!g_IniFile) yyError("ini_section_exists : Trying to read from undefined INI file");
    var pSection = g_IniFile.m_Keys[yyGetString(_section)];
    if( pSection!=null && pSection!=undefined ) return true;
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	Deletes the indicated key from the indicated section.
///          </summary>
///
/// In:		<param name="_section"></param>
///			<param name="key"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_key_delete(_section,_key) 
{
    if (!g_IniFile) yyError("ini_key_delete : Trying to write to undefined INI file");
    return g_IniFile.DeleteKey(yyGetString(_section),yyGetString(_key));
}

// #############################################################################################
/// Function:<summary>
///          	Deletes the indicated section.
///          </summary>
///
/// In:		<param name="_section"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ini_section_delete(_section) 
{
    if (!g_IniFile) yyError("ini_section_delete : Trying to write to undefined INI file");
    return g_IniFile.DeleteSection(yyGetString(_section));
}


