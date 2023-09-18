
// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyIniFile.js
// Created:			11/07/2011
// Author:			Mike
// Project:			GameMaker HTML5
// Description:		Given a string, creates an INI file structure.
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 11/07/2011       V1.0        MJD     Ported from the C++ version.
//
// **********************************************************************************************************************


var g_LastFileSize = 0,
	g_LastErrorStatus = 0;


// #############################################################################################
/// Function:<summary>
///          	Create a new INI file "object"
///          </summary>
///
/// Out:	<returns>
///				The "empty" object
///			</returns>
// #############################################################################################
/**@constructor*/
function yyIniFile( _pName )
{
	this.m_Changed = false;
	this.m_Keys = [];
	this.m_pFileName = _pName; 
	this.m_pFileBuffer = "";
	this.m_FileIndex = 0;
	this.m_LineNumber = 0;
}


// #############################################################################################
/// Function:<summary>
///             Create an INI file handler from a string
///          </summary>
///
/// In:		 <param name="FileName">string holding the whole ini file</param>
///
// #############################################################################################
function INI_OpenFromString(_content)
{
    var pIniFile = new yyIniFile(null);
    pIniFile.m_pFileBuffer = _content;
    pIniFile.ReadIniFile();

    var count = 0;    
    for (var i in pIniFile.m_Keys) {            
        if (!pIniFile.m_Keys.hasOwnProperty(i)) continue;    
        count++;
        break;
    }
    //if (count == 0) return null;      // could be an empty ini file.
    return pIniFile;
}


// #############################################################################################
/// Function:<summary>
///             Create an ini file class
///          </summary>
///
/// In:		 <param name="FileName">Name of the ini file</param>
///
// #############################################################################################
function INI_OpenIniFile(_FileName, _fLocal)
{
    var pFile = LoadTextFile_Block( _FileName, _fLocal );

	var pIniFile = new yyIniFile(_FileName);
	pIniFile.m_pFileBuffer = pFile;
	pIniFile.ReadIniFile();
	
	var count=0;
	for (var i in pIniFile.m_Keys) {
	    if (!pIniFile.m_Keys.hasOwnProperty(i)) continue;	    
	    count++;
	    break;
	}
	if( count==0 ) return null;
	return pIniFile;
}




// #############################################################################################
/// Function:<summary>
///             Move to AFTER the newline
///          </summary>
// #############################################################################################
yyIniFile.prototype.NextLine = function () {
	while ((this.m_pFileBuffer.charCodeAt(this.m_FileIndex) != 0x0a) && (this.m_pFileBuffer.charCodeAt(this.m_FileIndex) != 0x0d) && (this.m_FileIndex < this.m_Size))
	{
		this.m_FileIndex++;
	}
	this.m_LineNumber++;
	this.m_FileIndex++; 	// Skip 0x0a or 0x0d
	if (this.m_FileIndex >= this.m_Size) return;

	// Now check or the second part of the new line...
	if ((this.m_pFileBuffer.charCodeAt(this.m_FileIndex) == 0x0a) && (this.m_pFileBuffer.charCodeAt(this.m_FileIndex) == 0x0d))
	{
		this.m_FileIndex++; 	// Skip 0x0a or 0x0d
	}
};

// #############################################################################################
/// Function:<summary>
///             Is the next character a whitespace character? (includes comments etc..)
///          </summary>
///
/// Out:	 <returns>
///				TRUE for yes, FALSE for no.
///			 </returns>
// #############################################################################################
yyIniFile.prototype.IsWhiteSpace = function () {

	//with (this)
	{
		if (this.m_FileIndex >= this.m_Size) return false;

		var c = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
		if (c == 0x20 || c == 0x09 || c == 0x0a || c == 0x0d || c == ord('#') || c == ord(';'))		// GM ini files don't support comments AT ALL!
		{
			return true;
		} else
		{
			return false;
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Skip all whitespace (including newlines and comments)
///          </summary>
// #############################################################################################
yyIniFile.prototype.SkipWhiteSpace = function () {
	//with (this)
	{
		// Skip whitespace (and newlines/comments etc.)
		while (this.IsWhiteSpace() && (this.m_FileIndex < this.m_Size))
		{
			// if we find a comment, ignore it....   (GM doesn't support comments)
			var c = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
			if (c == ord('#') || c == ord(';'))
			{
				this.NextLine();
			} else if (c == 0x0a)
			{
				this.m_LineNumber++;
			}
			this.m_FileIndex++;
		}
		if (this.m_FileIndex >= this.m_Size) return;
	}
};

// #############################################################################################
/// Function:<summary>
///             Find the next section
///          </summary>
///
/// Out:	 <returns>
///				If not found, return NULL
///			 </returns>
// #############################################################################################
yyIniFile.prototype.GetSection = function () {
	//with (this)
	{
		this.SkipWhiteSpace();

		// Scan for a "[" which will hold the section
		while ((this.m_pFileBuffer.charAt(this.m_FileIndex) != '[') && (this.m_FileIndex < this.m_Size))
		{
			this.m_FileIndex++;
		}
		if (this.m_FileIndex >= this.m_Size) return null;


		// Remember string start, but skip '['
		this.m_FileIndex++;
		var StartIndex = this.m_FileIndex;


		// Scan for a "]" which will hold the section
		while ((this.m_pFileBuffer.charAt(this.m_FileIndex) != ']') && (this.m_FileIndex < this.m_Size))
		{
			this.m_FileIndex++;
		}
		if (this.m_FileIndex >= this.m_Size) return null;

		// Make a new section.
		var len = this.m_FileIndex - StartIndex;
		var pSection = [];
		pSection.__m_pIniFileName__ = this.m_pFileBuffer.substr(StartIndex, len);

		this.m_FileIndex++; // Skip white space
		return pSection;
	}
};


// #############################################################################################
/// Function:<summary>
///             Find the next section
///          </summary>
///
/// Out:	 <returns>
///				If not found, return NULL
///			 </returns>
// #############################################################################################
yyIniFile.prototype.GetKey = function (_Section) {

	//with (this)
	{
	    this.SkipWhiteSpace();
	    if (this.m_FileIndex >= this.m_Size || this.m_pFileBuffer.charAt(this.m_FileIndex) == '[') return false;


		// Remember string start
	    var StartIndex = this.m_FileIndex;


		// Scan past the KEY (get it's length)
		var LastWhiteSpace = -1;
		while ((this.m_pFileBuffer.charAt(this.m_FileIndex) != '=') && (this.m_FileIndex < this.m_Size))
		{
		    if (this.IsWhiteSpace())
			{
		        if (LastWhiteSpace < 0) LastWhiteSpace = this.m_FileIndex;
			} else
			{
				LastWhiteSpace = -1;
			}
		    this.m_FileIndex++;
		}
		if (this.m_FileIndex >= this.m_Size) return false;
		if (LastWhiteSpace < 0) LastWhiteSpace = this.m_FileIndex;

		// Make a new section.
		var len = LastWhiteSpace - StartIndex;
		var pKey = this.m_pFileBuffer.substr(StartIndex, len);


		// Now find the '=' sign
		while ((this.m_pFileBuffer.charAt(this.m_FileIndex) != '=') && (this.m_FileIndex < this.m_Size))
		{
		    this.m_FileIndex++;
		}
		if (this.m_FileIndex >= this.m_Size) return false;
		this.m_FileIndex++; // Skip '='



		//
		// Now read the VALUE. First skip the white space before the vlaue, but make sure we dont go onto a newline
		//
		var line = this.m_LineNumber;
		this.SkipWhiteSpace();
		if (line != this.m_LineNumber) return false;



		// Now read to the end of the line (or comment character)
		var comment1 = ord('#');
		var comment2 = ord(';');
		var instring = false;

		var cc = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
		switch (cc) {
			case 34/* '"'.code */:
			case 39/* "'".code */:
				// Are we IN a string? If so use the string character as the EOL
				comment1 = cc;
				comment2 = cc;
				instring = true;
				this.m_FileIndex++;
				break;
			case 91/* "[".code */:
			case 123/* "{".code */:
				// Since we don't support escape characters and JSON can contain
				// arbitrary combinations of non-new-line chars, assume that a line
				// with JSON isn't going to also have a comment at the end of it
				// (as if comments after values aren't rare enough as-is)
				comment1 = -1;
				comment2 = -1;
				break;
		}
		StartIndex = this.m_FileIndex;


		// Now read to the end of the line (or comment character)
		var LastWhiteSpaceChar = -1;
		var c = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
		while ((c != 0x0a) && (c != 0x0d) && (c != comment1) && (c != comment2) && (this.m_FileIndex < this.m_Size))
		{
			if (c == 0x20 || c == 0x09)
			{
			    if (LastWhiteSpaceChar < 0) LastWhiteSpaceChar = this.m_FileIndex;
			} else
			{
				LastWhiteSpaceChar = -1;
			}
			if (c == ord('\\')) this.m_FileIndex++; 		//GM doesn't support litterals.
			this.m_FileIndex++;
			c = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
		}

		if (LastWhiteSpaceChar >= 0 && !instring)
		{
			len = LastWhiteSpaceChar - StartIndex;
		} else
		{
		    len = this.m_FileIndex - StartIndex;
		}
		var pValue = this.m_pFileBuffer.substr(StartIndex, len);
		_Section[pKey] = pValue;

		// IF we were in a string, get the end of line
		if (instring)
		{
		    cc = this.m_pFileBuffer.charCodeAt(this.m_FileIndex);
			if ((cc == comment1) && (cc == comment2))
			{
			    while ((this.m_pFileBuffer.charCodeAt(this.m_FileIndex) != 0x0a) && (this.m_pFileBuffer.charCodeAt(this.m_FileIndex) != 0x0d) && (this.m_FileIndex < this.m_Size))
				{
			        this.m_FileIndex++; // go to end of line
				}

			}
		}

		return true;
	}
};


// #############################################################################################
/// Function:<summary>
///             Load an INI file into memory
///          </summary>
///
/// In:		 <param name="_filename">Name of INI file</param>
///			 <param name="content"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyIniFile.prototype.ReadIniFile = function () {
	//with (this)
	{
	    if (this.m_pFileBuffer == null) return false;
	    this.m_Size = this.m_pFileBuffer.length;
	    this.m_FileIndex = 0;
	    this.m_LineNumber = 0;

		// First, get the first section so we can head into the loop ready.
	    var pSection = this.GetSection();
		if (pSection == null)
		{
		    this.m_pFileBuffer = null;
			return false;
		}
		this.m_Keys[pSection.__m_pIniFileName__] = pSection;


		// Now read in the INI file
		while (this.m_FileIndex < this.m_Size)
		{
			var found = this.GetKey(pSection);
			if (!found)
			{
			    if (this.m_FileIndex < this.m_Size)
				{
			        if (this.m_pFileBuffer.charAt(this.m_FileIndex) == '[')
					{
			            pSection = this.GetSection();
						if (pSection == null)
						{
						    this.m_pFileBuffer = null;
							return true;
						}
						this.m_Keys[pSection.__m_pIniFileName__] = pSection;
					}
				}
			}
		}
		this.m_pFileBuffer = null;
		return true;
	}
};



// #############################################################################################
/// Function:<summary>
///             Given the section + key, retrun the key container.
///          </summary>
///
/// In:		 <param name="_pSectionName">Section name</param>
///			 <param name="_pKeyName">Key to retrieve</param>
/// Out:	 <returns>
///				the key container, or NULL for not found
///			 </returns>
// #############################################################################################
yyIniFile.prototype.FindKey = function (_pSectionName, _pKeyName) {
	//with (this)
	{
	    var pSection = this.m_Keys[_pSectionName];
		if (pSection != null && pSection != undefined)
		{
			var pValue = pSection[_pKeyName];
			if (pValue != undefined) return pValue;        // also returns NULL if it's been deleted.
		}
		return null;
	}
};


// #############################################################################################
/// Function:<summary>
///             Given the section + key, retrun the INT it holds - or the default if not found
///          </summary>
///
/// In:		 <param name="_pSectionName">Section name</param>
///			 <param name="_pKeyName">Key to retrieve</param>
/// Out:	 <returns>
///				the INT it holds, or 0 for not found  (or user supplied value)
///			 </returns>
// #############################################################################################
yyIniFile.prototype.ReadInt = function (_pSectionName, _pKeyName, _default) {
	//with (this)
	{
	    var pKey = this.FindKey(_pSectionName, _pKeyName);
		if (pKey != null)
		{
		    return this.parseInt(pKey, 10);
		} else
		{
			return _default;
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Given the section + key, retrun the INT it holds - or the default if not found
///          </summary>
///
/// In:		 <param name="_pSectionName">Section name</param>
///			 <param name="_pKeyName">Key to retrieve</param>
/// Out:	 <returns>
///				the INT it holds, or 0.0f for not found (or user supplied value)
///			 </returns>
// #############################################################################################
yyIniFile.prototype.ReadFloat = function (_pSectionName, _pKeyName, _default) {
	//with (this)
	{
	    var pKey = this.FindKey(_pSectionName, _pKeyName);
		if (pKey != null)
		{
		    return parseFloat(pKey);
		} else
		{
		    return parseFloat(_default);
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Given the section + key, retrun the INT it holds - or the default if not found
///          </summary>
///
/// In:		 <param name="_pSectionName">Section name</param>
///			 <param name="_pKeyName">Key to retrieve</param>
/// Out:	 <returns>
///				the STRING it holds, or "<none>"for not found  (or user supplied value)
///			 </returns>
// #############################################################################################
yyIniFile.prototype.ReadString = function(_pSectionName, _pKeyName, _default) 
{
	//with (this)
	{
	    var pKey = this.FindKey(_pSectionName, _pKeyName);
		if (pKey != null)
		{
			return pKey;
		} else
		{
			return _default;
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Set a KEY value.
///          </summary>
///
/// In:		 <param name="_pSectionName">Section name</param>
///			 <param name="_pKeyName">KEY name</param>
///			 <param name="_pValue"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyIniFile.prototype.SetKey = function (_pSectionName, _pKeyName, _pValue) 
{
    this.m_Changed = true;

	var pSection = this.m_Keys[_pSectionName];
	if (pSection == null || pSection == undefined)
	{
		pSection = [];
		pSection.__m_pIniFileName__ = _pSectionName;
		this.m_Keys[pSection.__m_pIniFileName__] = pSection;
	}

	pSection[_pKeyName] = _pValue;
	return true;
};

// #############################################################################################
/// Function:<summary>
///             delete a key.
///          </summary>
///
/// In:		 <param name="_pKeyName"></param>
///			 <param name="_pSectionName"></param>
/// Out:	 <returns>
///				true for done, false for not found.
///			 </returns>
// #############################################################################################
yyIniFile.prototype.DeleteKey = function(_pSectionName, _pKeyName) 
{
    var pSection = this.m_Keys[_pSectionName];
	if (pSection == null || pSection == undefined) return false;

	var pKey = pSection[_pKeyName];
	if (pKey == null || pKey == undefined) return false;

	this.m_Changed = true;
	pSection[_pKeyName] = null;
	return true;
};

// #############################################################################################
/// Function:<summary>
///             Delete a whole section (and the keys)
///          </summary>
///
/// In:		 <param name="SectionName"></param>
/// Out:	 <returns>
///				true for done, false for not found.
///			 </returns>
// #############################################################################################
yyIniFile.prototype.DeleteSection = function (_pSectionName) {
	var pSection = this.m_Keys[_pSectionName];
	if (pSection == null || pSection == undefined) return false;

	this.m_Changed = true;
	this.m_Keys[_pSectionName] = null;
	return true;
};


// #############################################################################################
/// Function:<summary>
///             Save out the INI file.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyIniFile.prototype.WriteIniFile = function() {

    var pFile = "";
    var newline = chr(0x0d) + chr(0x0a);

    for (var section in this.m_Keys) {    
	    if (!this.m_Keys.hasOwnProperty(section)) continue;
    
        pFile = pFile + "[" + section + "]" + newline;

        var pSection = this.m_Keys[section];
        for (var key in pSection) {
            if (!pSection.hasOwnProperty(key)) continue;
        
            if (key != "__m_pIniFileName__") {
                var pValue = pSection[key];
                if (pValue != null)
                {
                    if (pValue.indexOf('"') < 0)
                    {
                        // If there are no double quotes in value, double-quote it
                        pFile += key + '="' + pValue + '"' + newline;
                    } else if (pValue.indexOf("'") < 0)
                    {
                        // Otherwise, if there are no single quotes, use those instead
                        pFile += key + "='" + pValue + "'" + newline;
                    } else
                    {
                        // Since we don't support escape characters and things are
                        // going to break now anyway, write the value without quotes
                        // - at least JSON data won't break
                        pFile += key + "=" + pValue + newline;
                    }
                }
            }
        }
    }

    if (this.m_Changed) {
        SaveTextFile_Block(this.m_pFileName, pFile);
        this.m_Changed = false;
    }

    return pFile;
};



// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################

// #############################################################################################
/// Function:<summary>
///          	Check to see if the working directory has been added to the filename already,
///				And if not, then add it.
///          </summary>
///
/// In:		<param name="_FileName">Filename</param>
/// Out:	<returns>
///				The filename WITH working_directory added
///			</returns>
// #############################################################################################
function CheckWorkingDirectory(_FileName) {
	if (_FileName.substring(0, 5) == "file:") return _FileName;
	if (_FileName.substring(0, 5) == "data:") return _FileName;
	if ((_FileName.substring(0, 7) == "http://") || (_FileName.substring(0, 8) == "https://")) return _FileName;

	// Working directory already appended?
	if (_FileName.substring(0, g_RootDir.length) == g_RootDir) return set_load_location(null,null,_FileName);

	return set_load_location(null,null,g_RootDir + _FileName);
}


// #############################################################################################
/// Function:<summary>
///          	Check the URL and see if it's a valid type.
///				And if not, then add it.
///          </summary>
///
/// In:		<param name="_FileName">Filename</param>
/// Out:	<returns>
///             true for okay, false for not.
///			</returns>
// #############################################################################################
function CheckValidURL(_FileName) {
    if (_FileName.substring(0, 5) == "file:") return false;
    if (_FileName.substring(0, 4) == "ftp:") return false;
    if (_FileName.substring(0, 7) == "gopher:") return false;
    if (_FileName.substring(0, 7) == "mailto:") return false;
    if (_FileName.substring(0, 5) == "news:") return false;
    if (_FileName.substring(0, 5) == "nntp:") return false;
    if (_FileName.substring(0, 7) == "telnet:") return false;
    if (_FileName.substring(0, 5) == "wais:") return false;
    if (_FileName.substring(0, 5) == "news:") return false;
    if (_FileName.substring(1, 1) == ":") return false;             // probably c: style
    return true;
}

// #############################################################################################
/// Function:<summary>
///          	Raw "get size" of file. Can also do file_exists etc.
///          </summary>
///
/// In:		<param name="_name"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function RawFileExists(_url) {
	try
	{
		var http = new XMLHttpRequest();
		http.open('HEAD', _url, false);
		http.send();
		
		g_LastErrorStatus = http.status;
		var bExists = (http.status != 404 && http.status !=0);

		return bExists;
	} catch (e)
	{
		return false;
	}
}


// #############################################################################################
/// Function:<summary>
///             Read/Write a BINARY file from a server
///          </summary>
///
/// In:		 <param name="U">file or URL to access</param>
///			 <param name="V">false for GET, true for POST</param>
/// Out:	 <returns>
///				the file, or null if an error occured.
///			 </returns>
// #############################################################################################
function RawServerReadWrite(U, V) 
{
    try{
        var X = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        X.open(V ? 'PUT' : 'GET', U, false );
		// RK :: This is using a trick to download the file as text and then avoid the encoding changing the data see
		// https://web.archive.org/web/20071103070418/http://mgran.blogspot.com/2006/08/downloading-binary-streams-with.html
        X.overrideMimeType('text\/plain; charset=x-user-defined');
        X.send(V ? V : '');
        g_LastErrorStatus = X.status;
        return X.responseText;
    }catch(e){
        return null;
    }
}

// #############################################################################################
/// Function:<summary>
///             Read/Write a TEXT file from a server
///          </summary>
///
/// In:		 <param name="U">file or URL to access</param>
///			 <param name="V">false for GET, true for POST</param>
/// Out:	 <returns>
///				the file, or null if an error occured.
///			 </returns>
// #############################################################################################
function TextServerReadWrite(U, V)
{
    try{
        var X = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        X.open(V ? 'PUT' : 'GET', U, false );
        X.send(V ? V : '');
        g_LastErrorStatus = X.status;
        return X.responseText;
    }catch(e){
        return null;
    }
}


// #############################################################################################
/// Function:<summary>
///             Try and delete a file from a server
///          </summary>
///
/// In:		 <param name="U"></param>
/// Out:	 <returns>
///				true for okay, false for error.
///			 </returns>
// #############################################################################################
function RawServerDelete(U) 
{
    try{
        var X = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        X.open("DELETE", U, false );
        X.send('');
        g_LastErrorStatus = X.status;
        return X.status;
    }catch(e){
        return false;
    }
}

// #############################################################################################
/// Function:<summary>
///             Save a TEXT file to local storage
///          </summary>
///
/// In:		 <param name="_filename"></param>
///			 <param name="_pFile"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function SaveTextFile_Block(_filename, _pFile) 
{
    // Write to local storage
    if (g_ChromeStore) {
        /*var s = g_pBuiltIn.local_storage + _filename;
        chrome.storage.local.set({ s : _pFile }, function() {
            //console.log('Settings saved: ' + _pFile);
        });*/
        return false;
    }
    else if (g_SupportsLocalStorage) {
		try {
		    window.localStorage[GetLocalStorageName(_filename)] = _pFile;
		    return true;
		} 
		catch (ex) {
			return false;
		}
	}
}

// #############################################################################################
/// Function:<summary>
///             Load a TEXT file from local, OR remote (blocking)
///          </summary>
///
/// In:		 <param name="_FileName"></param>
///			 <param name="_fLocal"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function LoadTextFile_Block( _FileName, _fLocal )
{
	return LoadXXXFile_Block( _FileName, _fLocal, TextServerReadWrite );
}

// #############################################################################################
/// Function:<summary>
///             Load a BINARY file from local, OR remote (blocking)
///          </summary>
///
/// In:		 <param name="_FileName"></param>
///			 <param name="_fLocal"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function LoadBinaryFile_Block( _FileName, _fLocal )
{
	return LoadXXXFile_Block( _FileName, _fLocal, RawServerReadWrite );
}

function LoadXXXFile_Block( _FileName, _fLocal, _ServerReadWriteFunc )
{
	var pFile = null;

	if (_FileName.substring(0, 5) == "file:") return null;


	if (_fLocal) 
	{
		if ((_FileName.substring(0, 7) == "http://") || (_FileName.substring(0, 8) == "https://")) return; // NOT a local file!

        // Chrome store does NOT support localStorage, so use file API instead.
		if (g_ChromeStore) 
		{
		    return null;
		}
		else if (g_SupportsLocalStorage) {
			try {
				pFile = window.localStorage[GetLocalStorageName(_FileName)];
			} 
			catch (ex) {
				return null;
			}
			if ( (pFile == undefined) || (pFile==null) ) return null;
		}
	}
	else
	{
	    if (!CheckValidURL(_FileName)) return null;
		_FileName = CheckWorkingDirectory(_FileName);


		pFile = _ServerReadWriteFunc(_FileName, false);
		if( ( pFile ==null ) || (pFile==undefined ) ) return null;
		if (g_LastErrorStatus == 404) return null;
	}
	return pFile;
}

// #############################################################################################
/// Function:<summary>
///             Load a TEXT file from local, OR remote (blocking)
///          </summary>
///
/// In:		 <param name="_FileName"></param>
///			 <param name="_fLocal"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function FileExists_Block(_FileName, _fLocal) {

	var pFile = null;

	if (_FileName.substring(0, 5) == "file:") return null;

	if (_fLocal) {
	
	    if (g_ChromeStore) {
	        return false;
	    }
	    else if (g_SupportsLocalStorage) {
			try {
			    var name = GetLocalStorageName(_FileName);
				// We should consider empty files (empty strings) has "existing".
				if (window.localStorage[name] !== undefined) {
				    return true;
				}				
				return false;
			} 
			catch (ex) {
				return false;
			}
		}
	}
	else {
	    if (!CheckValidURL(_FileName)) {
	        return false;
	    }
	    _FileName = CheckWorkingDirectory(_FileName);
		return RawFileExists(_FileName);
	}
}

