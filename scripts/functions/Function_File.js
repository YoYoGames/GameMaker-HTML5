
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	Function_File.js
// Created:	        09/06/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 09/06/2011		V1.0-       MJD     1st version
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///          	A TEXT file type
///          </summary>
// #############################################################################################
/** @constructor */
function yyTextFile() {
	this.m_pFile = "";
	this.m_index = 0;
	this.m_Write = false; // can not write to this file.
	this.m_changed = false;
	this.m_FileName = "";
}

// #############################################################################################
/// Property: <summary>
///           	Skip newlines...
///           </summary>
// #############################################################################################
yyTextFile.prototype.SkipNewLines = function()
{
	var str;	
	var i = this.m_index;
	var s = this.m_pFile;
	while(i<s.length)
	{
		var c = s.charCodeAt(i);
		if( c==0x0d || c==0x0a ){
			i++;
		}else{
			break;
		}
	}
	this.m_index = i;
};


// #############################################################################################
/// Property: <summary>
///           	Skip newlines...
///           </summary>
// #############################################################################################
yyTextFile.prototype.NextLine = function () {
	var str;
	var i = this.m_index;
	var s = this.m_pFile;
	while (i < s.length)
	{
		var c = s.charCodeAt(i);
		if (c == 0x0d || c == 0x0a)
		{
			i++;
			c = s.charCodeAt(i);
			if (c == 0x0d || c == 0x0a)
			{
				i++;
			}
			break;
		} else
		{
			i++;
		}
	}
	this.m_index = i;
};


// #############################################################################################
/// Property: <summary>
///           	Skip whitespace - including new lines
///           </summary>
// #############################################################################################
yyTextFile.prototype.SkipWhiteSpace = function () {
	var str;
	var i = this.m_index;
	var s = this.m_pFile;
	while (i < s.length)
	{
		var c = s.charCodeAt(i);
		if (c == 0x0d || c == 0x0a || c==0x09 || c==0x20)
		{
			i++;
		} else
		{
			break;
		}
	}
	this.m_index = i;
};


// #############################################################################################
/// Function:<summary>
///             SET the string to be used with the string file system
///          </summary>
///
/// In:		 <param name="_filedata">text to be used</param>
/// Out:	 <returns>
///				File handle, or <0 for error
///			 </returns>
// #############################################################################################
function file_text_open_from_string(_filedata) 
{
    var pFile = new yyTextFile();
    pFile.m_pFile = yyGetString(_filedata);
    pFile.m_index = 0;
    pFile.m_FileName = null;

    return g_TextFiles.Add(pFile);
}


// #############################################################################################
/// Function:<summary>
///             Opens the file with the indicated name for reading. The function returns the id 
///             of the file that must be used in the other functions. You can open multiple files 
///             at the same time (32 max). Don't forget to close them once you are finished with them.
///          </summary>
///
/// In:		 <param name="_fname">Name of file to open for reading</param>
/// Out:	 <returns>
///				File handle, or <0 for error
///			 </returns>
// #############################################################################################
function file_text_open_read(_fname) 
{
    _fname = yyGetString(_fname);

	// Always try LOCAL first in case it's been modified and SAVED
	var pTextFile = LoadTextFile_Block(_fname,true);
	if (pTextFile == null) pTextFile = LoadTextFile_Block(_fname, false);
	if (pTextFile == null) return -1;

	var pFile = new yyTextFile();
	pFile.m_pFile = pTextFile;
	pFile.m_index = 0;
	pFile.m_FileName = _fname;

	return g_TextFiles.Add(pFile);
}


// #############################################################################################
/// Function:<summary>
///             Closes the file with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid">File to close</param>
///				
// #############################################################################################
function file_text_close(_fileid)
{
    _fileid = yyGetInt32(_fileid);

	var pFile = g_TextFiles.Get(_fileid);
	if (!pFile)
	{
		yyError("Error: Illegal file handle");
		return;
	}

	// If the file has changed (only happens with WRITE files), then save to local storage
	if (pFile.m_FileName != null) {
	    if (pFile.m_changed) {
	        SaveTextFile_Block(pFile.m_FileName, pFile.m_pFile);
	    }
	}
	
	 g_TextFiles.DeleteIndex(_fileid);
}

// #############################################################################################
/// Function:<summary>
///             Opens the indicated file for writing, creating it if it does not exist. 
///             The function returns the id of the file that must be used in the other functions.
///          </summary>
///
/// In:		 <param name="_fname">Name of file to open for writing</param>
/// Out:	 <returns>
///				File handle, or <0 for error
///			 </returns>
// #############################################################################################
function file_text_open_write(_fname) 
{
	var pFile = new yyTextFile();
	pFile.m_FileName = yyGetString(_fname);
	pFile.m_pFile = "";
	pFile.m_index = 0;
	pFile.m_write = true;

	return g_TextFiles.Add(pFile);
}


// #############################################################################################
/// Function:<summary>
///             Opens the indicated file for appending data at the end, creating it if it does 
///             not exist. The function returns the id of the file that must be used in the other 
///             functions.
///          </summary>
///
/// In:		 <param name="_fname">Name of file to open for appending</param>
/// Out:	 <returns>
///				File handle, or <0 for error
///			 </returns>
// #############################################################################################
function file_text_open_append(_fname) 
{
    _fname = yyGetString(_fname);

	var f = file_text_open_read(_fname);
	if (f < 0)
	{
		// Not found? Open a new file for writing instead...
		return file_text_open_write(_fname);
	}
	var pFile = g_TextFiles.Get(f);
	pFile.m_write = true;
	pFile.m_index = pFile.m_pFile.length; 	// end of file is starting point
	return f;
}




// #############################################################################################
/// Function:<summary>
///             Writes the string to the file with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid">file handle</param>
///			 <param name="_str">string to write</param>
///				
// #############################################################################################
function file_text_write_string(_fileid, _str)
{
	var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}
	if (!pFile.m_write)
	{
		yyError("Error: File " + pFile.m_FileName + " has not been opened with WRITE permisions");
		return;
	}
	
	pFile.m_pFile += yyGetString(_str);
	pFile.m_changed = true;
	pFile.m_index = pFile.m_pFile.length; 	// end of file is starting point
}


// #############################################################################################
/// Function:<summary>
///             Write the real value to the file with the given file id. (As separator between 
///             the integer and decimal part always a dot is used.
///          </summary>
///
/// In:		 <param name="_fileid">File handle</param>
///			 <param name="_x">value to write</param>
///				
// #############################################################################################
function file_text_write_real(_fileid,_x) 
{
	var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}
	if (!pFile.m_write)
	{
		yyError("Error: File " + pFile.m_FileName + " has not been opened with WRITE permisions");
		return;
	}
	pFile.m_pFile += yyGetReal(_x);
	pFile.m_changed = true;
	pFile.m_index = pFile.m_pFile.length; 	// end of file is starting point
}


// #############################################################################################
/// Function:<summary>
///             Write a newline character to the file.
///          </summary>
///
/// In:		 <param name="fileid">file handle</param>
///				
// #############################################################################################
function file_text_writeln(_fileid) 
{
	var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}
	if (!pFile.m_write)
	{
		yyError("Error: File " + pFile.m_FileName + " has not been opened with WRITE permisions");
		return;
	}
	pFile.m_pFile += String.fromCharCode(0x0d);
	pFile.m_pFile += String.fromCharCode(0x0a);
	pFile.m_index = pFile.m_pFile.length; 	// end of file is starting point
}


// #############################################################################################
/// Function:<summary>
///             Reads a string from the file with the given file id and returns this string. 
///             A string ends at the end of line.
///          </summary>
///
/// In:		 <param name="_fileid">File handle</param>
/// Out:	 <returns>
///				string
///			 </returns>
// #############################################################################################
function file_text_read_string(_fileid) 
{
    var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}

	// first SKIP newline(s) - We must be ON a newline to skip them.
	// NB: Not sure why this was added, but it makes it work differently to C++
	// pFile.SkipNewLines();

	var str = "";	
	var i = pFile.m_index;
	var s = pFile.m_pFile;
	while(i<s.length)
	{
	    var c = s.charCodeAt(i);
		if (c == 0x0d || c == 0x0a) {               // PC newline seq is 0x0d then 0x0a.
			break;
		}else{
			str+=s[i++];
		}
	}
	pFile.m_index = i;
	return str;
}


// #############################################################################################
/// Function:<summary>
///             Reads a real value from the file and returns this value.
///          </summary>
///
/// In:		 <param name="_fileid">File handle</param>
/// Out:	 <returns>
///				The "real" number that was read.
///			 </returns>
// #############################################################################################
function file_text_read_real(_fileid) 
{
    var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if (!pFile)
	{
		yyError("Error: Illegal file handle");
		return;
	}

	// first SKIP newline(s) - We must be ON a newline to skip them.
	pFile.SkipWhiteSpace();

	var str = "";
	var i = pFile.m_index;
	var s = pFile.m_pFile;
	while (i < s.length)
	{
		var c = s[i];
		if ((c == '-') && (str == "")) {
		    str += s[i++];
		}
		else if ((c >='0' && c <='9') || (c=='.')) {
			str += s[i++];
		} 
		else {
			break;
		}
	}
	pFile.m_index = i;
	return parseFloat(str);
}


// #############################################################################################
/// Function:<summary>
///             Skips the rest of the line in the file and starts at the start of the next line.
///          </summary>
///
/// In:		 <param name="_fileid">file handle</param>
///				
// #############################################################################################
function file_text_readln(_fileid) 
{
    var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if (!pFile)
	{
		yyError("Error: Illegal file handle");
		return;
	}

	var str = "";	
	var i = pFile.m_index;
	var s = pFile.m_pFile;
	while(i<s.length)
	{
	    var c = s.charCodeAt(i);
		if (c == 0x0d || c == 0x0a)
		{
		    //i++;
		    str += s[i++];
		    if (i < s.length) {
		        c = s.charCodeAt(i);
		        if (c == 0x0d || c == 0x0a) {
		            //i++;
		            str += s[i++];
		        }
		    }
			break;
		}
		else 
		{
			str+=s[i++];
		}
	}
	pFile.m_index = i;

    return str;

//	pFile.NextLine(); 
}

// #############################################################################################
/// Function:<summary>
///             Returns whether we reached the end of the file.
///          </summary>
///
/// In:		 <param name="_fileid">file handle</param>
///				
// #############################################################################################
function file_text_eof(_fileid) {
    var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}

	if( pFile.m_index >= pFile.m_pFile.length ) return true;
	return false;
}


// #############################################################################################
/// Function:<summary>
///             Returns whether we reached the end of a line in the file.
///          </summary>
///
/// In:		 <param name="_fileid">file handle</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_text_eoln(_fileid) 
{
    var pFile = g_TextFiles.Get(yyGetInt32(_fileid));
	if( !pFile ) {
		yyError("Error: Illegal file handle");
		return;
	}
	if( pFile.m_index >= pFile.m_pFile.length ) return true;
	var c = pFile.m_pFile.charCodeAt(pFile.m_index);
	if( c== 0x0a || c==0x0d ) return true;
	return false;
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the file with the given name exists (true) or not (false).
///          </summary>
///
/// In:		 <param name="_fname">file name to look for</param>
/// Out:	 <returns>
///				true for yes, flase for no.
///			 </returns>
// #############################################################################################
function file_exists(_fname) {

    _fname = yyGetString(_fname);

	var exists = FileExists_Block(_fname, true);
	if (exists == true) return true;
	return FileExists_Block(_fname, false);
}


// #############################################################################################
/// Function:<summary>
///             Deletes the file with the given name.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_delete(_fname) 
{    
	if (g_SupportsLocalStorage)
	{
		try {		    
		    window.localStorage['removeItem'](GetLocalStorageName(yyGetString(_fname)));
		    return true;
		}
		catch (ex){
			return false;
		}
	}
	return false;
}


// #############################################################################################
/// Function:<summary>
///             Renames the file with name oldname into newname.
///          </summary>
///
/// In:		 <param name="_oldname">Old file name</param>
///			 <param name="_newname">New file name</param>
///				
// #############################################################################################
function file_rename(_oldname,_newname) 
{
    _oldname = yyGetString(_oldname);

    file_copy(_oldname, yyGetString(_newname));
    file_delete(_oldname); 
}


// #############################################################################################
/// Function:<summary>
///             Copies the file fname to the newname.
///          </summary>
///
/// In:		 <param name="_fname">File to copy FROM</param>
///			 <param name="_newname">File to copy TO</param>
///				
// #############################################################################################
function file_copy(_fname,_newname) 
{
    _fname = yyGetString(_fname);
    _newname = yyGetString(_newname);

    if (true === file_exists(_newname))
        file_delete(_newname);
        
    if (false === file_exists(_fname))
        return false;

    var fSF = file_text_open_read(_fname);
    var fDF = file_text_open_write(_newname);
    
    while (false === file_text_eof(fSF)) {
        var line = file_text_readln(fSF);
        file_text_write_string(fDF, line);
    }
    
    file_text_close(fSF);
    file_text_close(fDF);
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the indicated directory does exist. The name must include the 
///             full path, not a relative path.
///          </summary>
///
/// In:		 <param name="_dname">Directory name to check for</param>
/// Out:	 <returns>
///				true for yes, false for no.
///			 </returns>
// #############################################################################################
function directory_exists(_dname) 
{
    ErrorFunction("directory_exists()");
    return true;
}


// #############################################################################################
/// Function:<summary>
///             Creates a directory with the given name (including the path towards it) 
///             if it does not exist. The name must include the full path, not a relative path.
///          </summary>
///
/// In:		 <param name="_dname">Name of directory to create</param>
/// Out:	 <returns>
///				true for done, false for error
///			 </returns>
// #############################################################################################
function directory_create(_dname) 
{
    ErrorFunction("directory_create()");
    return true;
}

function directory_destroy(_dname) 
{
    ErrorFunction("directory_destroy()");
    return true;
}
// #############################################################################################
/// Function:<summary>
///             Returns the name of the first file that satisfies the mask and the attributes. 
///             If no such file exists, the empty string is returned. The mask can contain a path 
///             and can contain wildchars, for example 'C:\temp\*.doc'. The attributes give the 
///             additional files you want to see. (So the normal files are always returned when 
///             they satisfy the mask.) You can add up the following constants to see the type of 
///             files you want:
///          </summary>
///
/// In:		 <param name="_mask"></param>
///			 <param name="_attr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_find_first(_mask,_attr) 
{
    ErrorFunction("file_find_first()");
    return "";
}


// #############################################################################################
/// Function:<summary>
///             Returns the name of the next file that satisfies the previously given mask and 
///             the attributes. If no such file exists, the empty string is returned.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_find_next() 
{
    ErrorFunction("file_find_next()");
    return "";
}


// #############################################################################################
/// Function:<summary>
///             Must be called after handling all files to free memory.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_find_close()
{
    ErrorFunction("file_find_close()");
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the file has all the attributes given in attr. Use a combination 
///             of the constants indicated above
///          </summary>
///
/// In:		 <param name="_fname"></param>
///			 <param name="_attr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_attributes(_fname,_attr) 
{
	ErrorFunction("file_attributes()");
	return true;
}


// #############################################################################################
/// Function:<summary>
///             Returns the name part of the indicated file name, with the extension but without 
///             the path.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_name(_fname) 
{
    _fname = yyGetString(_fname);

	var a = _fname.lastIndexOf( '\\' );
	var b = _fname.lastIndexOf( '/' );
	var last = (a > b) ? a : b;

	var ret = _fname;
	if (last > 0) {
		ret = _fname.substr( last+1 );
	} // end if

    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Returns the path part of the indicated file name, including the final backslash.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_path(_fname) 
{
    _fname = yyGetString(_fname);

	var a = _fname.lastIndexOf( '\\' );
	var b = _fname.lastIndexOf( '/' );
	var last = (a > b) ? a : b;

	var ret = _fname;
	if (last > 0) {
		ret = _fname.substr( 0, last+1 );
	} // end if

    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Returns the directory part of the indicated file name, which normally is the same 
///             as the path except for the final backslash.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_dir(_fname) 
{
    _fname = yyGetString(_fname);

	var a = _fname.lastIndexOf( '\\' );
	var b = _fname.lastIndexOf( '/' );
	var last = (a > b) ? a : b;

	var ret = _fname;
	if (last > 0) {
		ret = _fname.substr( 0, last );
	} // end if

    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Returns the drive information of the filename.
///				For a URL, it returns the domain address.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_drive(_fname) 
{
    MissingFunction("filename_drive()");
}



// #############################################################################################
/// Function:<summary>
///             Returns the indicated file name, with the extension (including the dot) changed 
///             to the new extension. By using an empty string as the new extension you can remove 
///             the extension.
///          </summary>
///
/// In:		 <param name="_fname"></param>
///			 <param name="_newext"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_change_ext(_fname,_newext) 
{
    _fname = yyGetString(_fname);

	var last = _fname.lastIndexOf( '.' );

	var ret = _fname;
	if (last > 0) {
		ret = _fname.substr( 0, last );
		ret = ret + yyGetString(_newext);
	} // end if

    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Opens the file with the indicated name. The mode indicates what can be done with 
///             the file: 0 = reading, 1 = writing, 2 = both reading and writing). When the file 
///             does not exist it is created. The function returns the id of the file that must 
///             be used in the other functions. You can open multiple files at the same time (32 max). 
///             Don't forget to close them once you are finished with them.
///          </summary>
///
/// In:		 <param name="_fname"></param>
///			 <param name="_mod"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_open(_fname,_mod)
{
    ErrorFunction("file_bin_open()");
}


// #############################################################################################
/// Function:<summary>
///             Rewrites the file with the given file id, that is, clears it and starts writing 
///             at the start.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_rewrite(_fileid) 
{
    ErrorFunction("file_bin_rewrite()");
}


// #############################################################################################
/// Function:<summary>
///             Closes the file with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_close(_fileid) 
{
    ErrorFunction("file_bin_close()");
}


// #############################################################################################
/// Function:<summary>
///             Returns the size (in bytes) of the file with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_size(_fileid) 
{
    ErrorFunction("file_bin_size()");
}


// #############################################################################################
/// Function:<summary>
///             Returns the current position (in bytes; 0 is the first position) of the file 
///             with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_position(_fileid) 
{
    ErrorFunction("file_bin_position()");
}


// #############################################################################################
/// Function:<summary>
///             Moves the current position of the file to the indicated position. To append to a 
///             file move the position to the size of the file before writing.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
///			 <param name="_pos"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_seek(_fileid,_pos) 
{
    ErrorFunction("file_bin_seek()");
}


// #############################################################################################
/// Function:<summary>
///             Writes a byte of data to the file with the given file id.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
///			 <param name="_byte"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_write_byte(_fileid,_byte) 
{
    ErrorFunction("file_bin_write_byte()");
}


// #############################################################################################
/// Function:<summary>
///             Reads a byte of data from the file and returns this.
///          </summary>
///
/// In:		 <param name="_fileid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function file_bin_read_byte(_fileid) 
{
    ErrorFunction("file_bin_read_byte()");
}


// #############################################################################################
/// Function:<summary>
///             Returns the value (a string) of the environment variable with the given name. 
///          </summary>
///
/// In:		 <param name="_name"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function environment_get_variable(_name) 
{
	return "";
}



// #############################################################################################
/// Function:<summary>
///             Returns the extension part of the indicated file name, including the leading dot.
///          </summary>
///
/// In:		 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function filename_ext(_filename) {

    _filename = yyGetString(_filename);

	var dot = _filename.lastIndexOf(".");
	var slash = _filename.lastIndexOf("\\");
	if (slash > dot) return ""; 			// . is pre URL

	return _filename.substr(dot, _filename.length);
}

function _json_get_value(_o) {
    var ret;
    switch (typeof (_o)) {
        case "object":
        	if (_o == null)
        		ret = null;
        	else
            if (_o instanceof Array) {
                ret = new yy_MapListContainer(LIST_TYPE, _json_decode_array(_o));
            } // end if
            else {
                ret = new yy_MapListContainer(MAP_TYPE, _json_decode_object(_o));
            } // end else
            break;
        case "boolean":
            ret = _o ? 1 : 0;
            break;
        case "number":
        case "string":
            ret = _o;
            break;
        default:
            ret = _o.toString();
            break;
    } // end switch
    return ret;
} // end _json_get_value

function _json_decode_array(_obj) {
    var ret = ds_list_create();

    for (var i = 0; i < _obj.length; ++i) {
        var v = _json_get_value( _obj[i] );
        ds_list_add(ret, v);
    } // end for

    return ret;
} // end _json_decode_array

function _json_decode_object(_obj) {
    // create the ds_map to return
    var ret = ds_map_create();

    // iterate over local object to create a ds_map
    for (var o in _obj) {
        var a = _obj[o];
        
        var v = _json_get_value(a);
        ds_map_add(ret, o, v);

    } // end for

    // return the ds_map
    return ret;
}

function json_decode(_string) {

    // remove any spurious hashes denoting new lines by removing any not between double quotes according to the rules at http://www.json.org/
    var str = yyGetString(_string);
    var quoteActive = false;
    try {
        for (var strIndex = 0; strIndex < str.length; strIndex++) {
             
            // Handle the current character being a double quote   
            if (str.charAt(strIndex) == "\"") {
                if (!quoteActive) {
                    quoteActive = true;
                }
                else if (strIndex == 0 || str.charAt(strIndex - 1) != "\\") {
                    quoteActive = false;
                }
            }            
            if (!quoteActive && str.charAt(strIndex) == "#") {                
                str = str.substring(0, strIndex) + str.substring(strIndex + 1, str.length);
                // bump the loop index back so that the for loop increment leaves us in the right place
                strIndex--;
            }
        }
    }
    catch (Error) {
    }

    // decode to a local object
    var pObj = {};
    try {
        pObj = JSON.parse(str);
        // If the base object is an array then we'll not get a satisfactory result
        if (pObj instanceof Array) {            
            str = "{ \"default\" : " + str + "}";
            pObj = JSON.parse(str);
        }    
        
    } 
    catch (err) {
        str = "{ \"default\" : \"" + str.toString() + "\"}";
        try {
            pObj = JSON.parse(str);
        } 
        catch (err) {
        } 
    } 
    return _json_decode_object(pObj);
}

function _json_encode_array(_o)
{
	var ret = "[";
	for( var i=0; i<_o.length; ++i) {
		if (i > 0) ret += ", ";
		ret += _json_encode_value(_o[i]);
	} // end for
	ret += "]";
	return ret;
} // end _json_encode_array

function _json_encode_value(_o) {
    var ret;
    if (_o === null) return null;
    switch (typeof (_o)) {
        case "object":
            switch (_o.ObjType) {
                case LIST_TYPE:
		            if (!(_o._yyvisited) || (_o._yyvisited < g_comparisonARRAY_RValue)) {
		                g_comparisonARRAY_RValue = ++g_countSTRING_RValue;
		                _o._yyvisited = g_countSTRING_RValue;
                    	ret = _json_encode_list(_o.Object); 
		                g_comparisonARRAY_RValue = ++g_countSTRING_RValue;
                	} // end if
                    break;
                case MAP_TYPE:
		            if (!(_o._yyvisited) || (_o._yyvisited < g_comparisonSTRUCT_RValue)) {
		                g_comparisonSTRUCT_RValue = ++g_countSTRING_RValue;
		                _o._yyvisited = g_countSTRING_RValue;
                    	ret = _json_encode_map(_o.Object); 
		                g_comparisonSTRUCT_RValue = ++g_countSTRING_RValue;
                	} // end if
                    break;
                default:
                    if (_o.constructor === Array) {
                    	if  (!(_o._yyvisited) || (_o._yyvisited < g_comparisonARRAY_RValue)) {
			                g_comparisonARRAY_RValue = ++g_countSTRING_RValue;
			                _o._yyvisited = g_countSTRING_RValue;
	                        ret = _json_encode_array(_o);
			                g_comparisonARRAY_RValue = ++g_countSTRING_RValue;
                    	} // end if
                    } else {
                        ret = _o.toString();
                    }
                    break;
            } // end switch
            break;
        case "number":
        case "string":
		case "boolean":
            ret = _o;
            break;
        default:
            ret = _o.toString();
            break;

    } // end switch
    return ret;    
} // end _json_encode_value

function _json_encode_list(_list) {
    var ret = [];

    var pList = g_ListCollection.Get(_list);
    if (pList) {
        for (var i = 0; i < pList.pool.length; ++i) {
            if (pList.pool[i] != undefined) ret.push( _json_encode_value(pList.pool[i]) );
        } // end for
    } // end if

    return ret;
} // end _json_encode_list

function _json_encode_map(_map) {

    var ret = {};
    var pMap = g_ActiveMaps.Get(_map);
    if (pMap) {
        for (var i in pMap) {
            if (!pMap.hasOwnProperty(i)) continue;
            if (pMap[i] !== undefined) ret[i] = _json_encode_value( pMap[i] );
        } // end for
    } // end if

    return ret;
} // end _json_encode_map

function json_encode(_map) {

    var obj = _json_encode_map(yyGetInt32(_map));

    return JSON.stringify(obj);
}

var g_STRING_VISITED_LIST = new Map();

function STRING_HasBeenVisited( _v )
{
	return g_STRING_VISITED_LIST.has(_v);
} // end STRING_HasBeenVisited

function STRING_AddVisited( _v )
{
	g_STRING_VISITED_LIST.set( _v, _v);
}

function STRING_RemoveVisited( _v )
{
	g_STRING_VISITED_LIST.delete(_v);
}

function json_stringify_value(_v)
{
    if (typeof _v === "string") {
        return _v;
    } // end if
    else if(_v === null) {
        return null;
    } // end if
    else if (_v === undefined) {
        return null;
    } // end if
    else if (typeof _v === "number") {
        return _v;
    } // end if
    else if (typeof _v === "boolean") {
        return  _v;
    } // end if
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v.toNumber();
        }
        else if (_v instanceof Array  && !STRING_HasBeenVisited(_v)) {
        	STRING_AddVisited(_v);
            var ret = [];
            for(var i = 0; i < _v.length; i++)
            {
                ret.push(json_stringify_value(_v[i]));
            }
            STRING_RemoveVisited(_v);
            return ret;
        } // end if
        else if (_v.__yyIsGMLObject && !STRING_HasBeenVisited(_v)) {

        	STRING_AddVisited(_v);
            var ret = {};

            for (var n in _v) {
                if (_v.hasOwnProperty(n)) {

                    // Translate to unobfuscated name (if possible)
                    var transname = n;

                    if (typeof g_obf2var != "undefined" && g_obf2var.hasOwnProperty(n)) {
                        transname = "gml"+g_obf2var[n];
                    } // end if

                    if (transname.startsWith("gml") || g_instance_names[transname] != undefined) {
                        var name = transname.startsWith("gml") ? transname.substring(3) : transname;
                        var entry = g_instance_names[transname];
                        if ((entry==undefined) || (entry[0]|entry[1]) ) {
                            Object.defineProperty( ret, name, { 
                                value : json_stringify_value(_v[n]),
                                configurable : true,
                                writable : true,
                                enumerable : true
                            });
                        } // end if
                    } // end if
                } // end if
            } // end for
            STRING_RemoveVisited(_v);
            return ret;
        } // end else
        else  if (STRING_HasBeenVisited(_v)) {
        	return "Cycle found"
        }
    } // end else
    return undefined;
}


function json_stringify( _v )
{
	var a = json_stringify_value(_v);
	return JSON.stringify(a);
}

function _json_parse_array(_obj) {
    var ret = [];

    for (var i = 0; i < _obj.length; ++i) {
        var v = json_parse_value( _obj[i] );
        ret.push( v );
    } // end for

    return ret;
} // end _json_decode_array

function json_parse_value( _v )
{
    if (typeof _v === "string") {
        return _v;
    } // end if
    else if(_v === null) {
        return null;
    } // end if
    else if (_v === undefined) {
        return undefined;
    } // end if
    else if (typeof _v === "number") {
    	return _v;
    } // end if
    else if (typeof _v === "boolean") {
        return  _v;
    } // end if
    else if (typeof _v === "object") {
        if (_v instanceof Array) {
        	return _json_parse_array(_v);
        } // end if
        else {
        	var ret = {};
        	ret.__type = "Object";
        	ret.__yyIsGMLObject = true;
            for (var n in _v) {
                if (_v.hasOwnProperty(n)) {
                    // RK :: TODO need to look up built in names to see if we add "gml"
                    var name;
                    if (g_instance_names[n] != undefined) {
                        name = n;
                    }
                    else if (typeof g_var2obf !== "undefined" && g_var2obf[n] != undefined) {
                        name = g_var2obf[n];
                    }
                    else {
                        name = "gml" + n;
                    }
                	
                	var val = json_parse_value(_v[n]);
                    Object.defineProperty( ret, name, { 
                    	value : val,
                    	configurable : true,
                    	writable : true,
                    	enumerable : true
                    });
                } // end if
            } // end if
            return ret;
        } // end else
    } // end else	
}

function json_parse( _v )
{
	var ret = undefined;
	try {
		var a  = JSON.parse(_v);	
		ret = json_parse_value(a);
	} catch( e )
	{
		// do nothing
		yyError( "JSON parse error" );
	}
	return ret;
}


function load_csv_decode(pText) {
    // RFC 4180 compliant https://tools.ietf.org/html/rfc4180
    var n = pText.length, i = 0;
    var rows = [];
    var row = [];
    var start = 0;
    var item = "";
    var rowStart = 0;
    while (i < n) {
        var p = i;
        var c = pText.charCodeAt(i++);
        switch (c) {
            case 13: case 10: // '\r', '\n'
                if (c == 13 && pText.charCodeAt(i) == 10) i += 1;
                if (p > rowStart) {
                    if (p > start) item += pText.substring(start, p);
                    row.push(item); item = "";
                }
                rows.push(row); row = [];
                rowStart = i;
                start = i;
                break;
            case 44: // ','
                if (p > start) item += pText.substring(start, p);
                row.push(item); item = "";
                if (pText.charCodeAt(i) == 34) { // '"'
                    i += 1; start = i;
                    while (i < n) {
						c = pText.charCodeAt(i++);
						if (c != 34) continue;
						// see what's after a double quote:
                        switch (pText.charCodeAt(i)) {
                            case 34: // `""` escape quote
                                if (i > start) item += pText.substring(start, i);
                                i += 1; start = i;
                                continue;
                            case 13: case 10: case 44: // `",` or `,EOL`
                                break; // go on to break out of loop
							default:
								// allow stray double quotes amid the value
								continue;
                        }
                        break;
                    }
                } else start = i;
                break;
        }
    }
    if (i > rowStart) {
        if (i > start) item += pText.substring(start, i);
        row.push(item);
        rows.push(row);
    }
    return rows;
}
function load_csv(_fname) {

    _fname = yyGetString(_fname);

	var pTextFile = LoadTextFile_Block(_fname,true);
	if (pTextFile == null) pTextFile = LoadTextFile_Block(_fname, false);
	if (pTextFile == null) return -1;
	var pData = load_csv_decode(pTextFile);
	var height = pData.length;
	if (height == 0) return -1;
	var width = pData[0].length;
	if (width == 0) return -1;
	var _id = ds_grid_create(width, height);
	var pGrid = g_ActiveGrids.Get(_id).m_pGrid;
	for (var y = 0; y < height; y++) {
		var pRow = pData[y];
		for (var x = 0; x < pRow.length; x++) {
			pGrid[x + y * width] = pRow[x];
		}
	}
	return _id;
}