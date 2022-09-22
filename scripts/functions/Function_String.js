
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_String.js
// Created:			27/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/05/2011		
// 
// **********************************************************************************************************************




// #############################################################################################
/// Function:<summary>
///          	Returns a string containing the character with raw BYTE value set.
///          </summary>
///
/// In:		<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ansi_char(_val) 
{
    return String.fromCharCode(yyGetInt32(_val) & 0xff);
}


// #############################################################################################
/// Function:<summary>
///          	Returns a string containing the character with the given Unicode code..
///          </summary>
///
/// In:		<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function chr(_val) 
{
    _val = yyGetInt32(_val);

    if (_val >= 0x10000) {
        var code = _val;
        code -= 0x10000;
        var highBits = (((code >> 10) & 0x3FF) + 0xD800);
        var lowBits = (code & 0x3FF) + 0xDC00;

        var result = String.fromCharCode(highBits, lowBits);
        return result;
    }
    else {
        return String.fromCharCode(_val);
    }
    return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the asci code of the first character in str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ord(_str) {
    if (!_str || _str == "") return 0;

    _str = yyGetString(_str);

    var code = _str.charCodeAt(0);

    var hi, low;
    if (0xD800 <= code && code <= 0xDBFF) {
        hi = code;
        low = _str.charCodeAt(1);
        // Go one further, since one of the "characters"
        // is part of a surrogate pair
        return ((hi - 0xD800) * 0x400) +
          (low - 0xDC00) + 0x10000;
    }
    return code;
}

// #############################################################################################
/// Function:<summary>
///          	Turns str into a real number. str can contain a minus sign, a decimal dot and 
///             even an exponential part.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function real(_v) {
    if (_v == undefined)
    {
        yyError("real() argument is undefined");
    }
    else if (_v == null)
    {
        yyError("real() argument is unset");
    }
    else if (typeof (_v) == "boolean")
	{
        if (_v) return 1; else return 0;
    }
    else if (typeof (_v) == "number")
	{
        return _v;
    }
    else if (typeof (_v) == "string")
	{
        var stringAsNumber = parseFloat(_v);
        if (isNaN(stringAsNumber))
        {
	        yyError("unable to convert string " + _v + " to real");
	    }
	    else
	    {
	        return stringAsNumber;
	    }
    }
    else if (_v instanceof Long)
    {
        return _v.toNumber();
	}
    else if (_v instanceof Array)
    {
        yyError("real() argument is array");
    }

    return parseFloat(_v);
}

function bool(_v) {
    if (_v == undefined)
    {
        return 0;
    }
    else if (_v == null)
    {
        yyError("bool() argument is unset");
    }
    else if (typeof (_v) == "boolean")
    {
        return _v;
    }
    else if (typeof (_v) == "number")
    {
        return _v > 0.5;
    }
    else if (typeof (_v) == "string")
    {
        // Check for "true"/"false" strings
        if (_v === "true")
        {
            return true;
        }
        else if (_v === "false")
        {
            return false;
        }

        // try parsing a number
        var stringAsNumber = parseFloat(_v);
        if (isNaN(stringAsNumber))
        {
            yyError("unable to convert string " + _v + " to bool");
        }
        else
        {
            return stringAsNumber > 0.5;
        }
    }
    else if(_v instanceof Long)
    {
        return _v.toNumber() > 0.5;
    }
    else if (_v instanceof Array)
    {
        yyError("bool() argument is array");
    }
    else
    {
        return _v != g_pBuiltIn.pointer_null;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Turns the real value into a string using a standard format (no decimal places 
///             when it is an integer, and two decimal places otherwise).
///          </summary>
///
/// In:		<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################

function string(_obj) 
{
    return yyGetString(_obj);
}

// #############################################################################################
/// Function:<summary>
///          	Turns val into a string using your own format: tot indicates the total number 
///             of places and dec indicates the number of decimal places.
///          </summary>
///
/// In:		<param name="_val"></param>
///			<param name="_tot"></param>
///			<param name="_dec"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_format(_val,_tot,_dec) 
{
    if (_val == undefined) {
        return "undefined";
    }

    _val = yyGetReal(_val);
    _dec = yyGetInt32(_dec);

    // Set number of decimal places accordingly and turn into a string
    var strs = _val.toFixed(_dec).toString().split(".");

    // Pad the sections of the string out and concatenate them together
    var str;
    for (var i = 0; i < strs.length; i++) {
        switch (i) {
        	case 0:
        		while (strs[i].length < yyGetInt32(_tot))
        		{
        			strs[i] = " " + strs[i];
        		}
        		str = strs[i];
        		break;

            case 1:
                while (strs[i].length < _dec) {
                    strs[i] = strs[i] + "0";
                }
                str = str + "." + strs[i];
                break;
        }
    }
    return str;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of characters in the string.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_length(_str) 
{
    if( !_str ) {
        return 0;
    }

    _str = yyGetString(_str);

    var numChars = 0;
    for (var i = 0; i < _str.length; ++i) {
        ++numChars;
        var codePoint = _str.charCodeAt(i);
        if (0xD800 <= codePoint && codePoint <= 0xDBFF) {
            ++i;
        }
    }

    return numChars;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of bytes in the string.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_byte_length(_str) {
    if (!_str) {
        return 0;
    }

    _str = yyGetString(_str);

    var i = 0, len = _str.length;
    var out = 0;
    while (i < len) {
        var c = _str.charCodeAt(i++);
        if (c >= 0xD800 && c <= 0xD8FF) {
            // (surrogate pair)
            i += 1; out += 4;
        } else if (c <= 0x7F) {
            out += 1;
        } else if (c <= 0x7FF) {
            out += 2;
        } else if (c <= 0xFFFF) {
            out += 3;
        } else out += 4;
    }
    return out;
}

function __yy_JSIndex2GMLIndex(str, jsIndex)
{
    var jump = 0;

    var strIndex = jsIndex - 1;
    while (strIndex > 0) {
        var lowCode = str.charCodeAt(strIndex);
        // Low code will be between 0xDC00 and 0xDFFF
        if (0xDC00 <= lowCode && lowCode <= 0xDFFF) {
            --jump;
            --strIndex;
        }
        --strIndex;
    }

    return jsIndex + jump + 1;

}

function __yy_GMLIndex2JSIndex(_str, _gmlIndex)
{
   _gmlIndex--;

    // Finding initial index
    var newIndex = _gmlIndex;
    var iter = 0;
    while (iter < _gmlIndex)
    {
        var highCode = _str.charCodeAt(iter);
        // High code will be between 0xD800 and 0xDFFF
        if (0xD800 <= highCode && highCode <= 0xDFFF) {
            newIndex++;
        }
        iter++;
    }
    return newIndex;
}



// #############################################################################################
/// Function:<summary>
///          	Returns the position of substr in str (0=no occurrence).
///          </summary>
///
/// In:		<param name="_substr"></param>
///			<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_pos(_substr, _str)
{
    var inSubstr = yyGetString(_substr);
    var inStr = yyGetString(_str);

    var resIndex = inStr.indexOf(inSubstr);
    return __yy_JSIndex2GMLIndex(inStr, resIndex);
}

function string_pos_ext(_substr, _str, _startPos)
{
    var inSubstr = yyGetString(_substr);
    var inStr = yyGetString(_str);
    var startPos = __yy_GMLIndex2JSIndex( inStr, yyGetInt32(_startPos) );
    ++startPos;
    var resIndex = inStr.indexOf(inSubstr, startPos);
    return __yy_JSIndex2GMLIndex(inStr, resIndex);
}

function string_last_pos(_substr, _str)
{
    var inSubstr = yyGetString(_substr);
    var inStr = yyGetString(_str);

    var resIndex = inStr.lastIndexOf(inSubstr);
    return __yy_JSIndex2GMLIndex(inStr, resIndex);
}

function string_last_pos_ext(_substr, _str, _startPos)
{
    if (_startPos <= 0)
    {
        return 0;
    }

    var inSubstr = yyGetString(_substr);
    var inStr = yyGetString(_str);
    var startPos = __yy_GMLIndex2JSIndex( inStr, yyGetInt32(_startPos) );
    var resIndex = inStr.lastIndexOf(inSubstr, startPos);
    return __yy_JSIndex2GMLIndex(inStr, resIndex);
}

// #############################################################################################
/// Function:<summary>
///          	Returns a substring of str, starting at position index, and of length count.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_index"></param>
///			<param name="_count"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_copy(_str,_index,_count) 
{
    _str = yyGetString(_str);
    _index = yyGetInt32(_index);
    _count = yyGetInt32(_count);
    
    if (_index < 1) {
        _index = 1;
    }
    
    _index--;

    // Finding initial index
    var newIndex = _index;
    var iter = 0;
    while (iter < _index)
    {
        var highCode = _str.charCodeAt(iter);
        // High code will be between 0xD800 and 0xDFFF
        if (0xD800 <= highCode && highCode <= 0xDFFF) {
            newIndex++;
        }
        iter++;
    }

    // Looking forward
    var newCount = _count;
    iter = 0;
    while (iter < _count)
    {
        var highCode = _str.charCodeAt(newIndex + iter);
        // High code will be between 0xD800 and 0xDFFF
        if (0xD800 <= highCode && highCode <= 0xDFFF) {
            newCount++;
        }
        iter++;
    }

	return _str.substring(newIndex , newIndex + newCount ); //javascript doesn't return the index + count character
}

// #############################################################################################
/// Function:<summary>
///          	Returns the character in str at position index.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_index"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_char_at(_str,_index) 
{
    var inStr = yyGetString(_str);
    var inIndex = yyGetInt32(_index);

    --inIndex;

    if ((inStr.length == 0) || (string_length(inStr) <= inIndex)) {
        return "";
    }

    var steps = 0;
    var startIndex = inIndex;
    if (startIndex < 0) {
        startIndex = 0;
    }
    var len = inStr.length;
    while ((startIndex > 0) && (steps < len)) {
        var code = inStr.charCodeAt(steps);
        if (0xD800 <= code && code <= 0xDFFF) {
            ++steps;
        }
        ++steps;
        --startIndex;
    }
    startIndex = steps;

    var high = inStr.charCodeAt(startIndex);

    if (0xD800 <= high && high <= 0xDFFF) {
        var low = inStr.charCodeAt(startIndex + 1);
        return String.fromCharCode(high, low);
    }

    return String.fromCharCode(high);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the ordinal of the character in str at position index.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_index"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_ord_at(_str,_index) 
{
    var inStr = yyGetString(_str);
    var inIndex = yyGetInt32(_index);

    --inIndex;

    if ((inStr.length == 0) || (string_length(inStr) <= inIndex)) {
        return -1;
    }

    var steps = 0;
    var startIndex = inIndex;
    if (startIndex < 0) {
        startIndex = 0;
    }
    var len = inStr.length;
    while ((startIndex > 0) && (steps < len)) {
        var code = inStr.charCodeAt(steps);
        if (0xD800 <= code && code <= 0xDFFF) {
            ++steps;
        }
        ++steps;
        --startIndex;
    }
    startIndex = steps;

    var high = inStr.charCodeAt(startIndex);

    if (0xD800 <= high && high <= 0xDFFF) {
        var low = inStr.charCodeAt(startIndex + 1);
        return ((high - 0xD800) * 0x400) +
          (low - 0xDC00) + 0x10000;
    }

	return high;
}

// #############################################################################################
/// Function:<summary>
///          	Converts a string from UTF16 to UTF8.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				Array of char codes
///			</returns>
// #############################################################################################
function UTF16_to_UTF8(_str)
{
    var utf8 = [];
    for (var i = 0; i < _str.length; i++) {
        var charCode = _str.charCodeAt(i);
        if (charCode < 0x80) {
            utf8.push(charCode);
        }
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6),
                      0x80 | (charCode & 0x3f));
        }
        else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(0xe0 | (charCode >> 12),
                      0x80 | ((charCode >> 6) & 0x3f),
                      0x80 | (charCode & 0x3f));
        }
            // surrogate pair
        else {
            i++;
            charCode = ( ( charCode & 0x3ff ) << 10 ) | ( _str.charCodeAt( i ) & 0x3ff );
            utf8.push(0xf0 | (charCode >> 18),
                      0x80 | ((charCode >> 12) & 0x3f),
                      0x80 | ((charCode >> 6) & 0x3f),
                      0x80 | (charCode & 0x3f));
        }
    }
    return utf8;
}

// #############################################################################################
/// Function:<summary>
///          	Converts a string from UTF16 to UTF8.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				Array of char codes
///			</returns>
// #############################################################################################
function UTF8_to_UTF16(data)
{
    var str = '';
    var i = 0;

    for (i = 0; i < data.length; i++) {
        var value = data[i];

        if (value < 0x80) {
            str += String.fromCharCode(value);
        } else if (value > 0xBF && value < 0xE0) {
            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
            i += 1;
        } else if (value > 0xDF && value < 0xF0) {
            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
            i += 2;
        } else {
            // surrogate pair
            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
            i += 3;
        }
    }

    return str;
}



// #############################################################################################
/// Function:<summary>
///          	Returns the byte in str at position index. (from a UTF8 string)
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_index"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_byte_at(_str,_index) 
{
    var inStr = yyGetString(_str);
    var inIndex = yyGetInt32(_index);

    var _txt = UTF16_to_UTF8(inStr);

    var index = inIndex - 1;
    if (index < 0) {
        index = 0;
    }

    if (index >= _txt.length)
    {
        index = _txt.length - 1;
    }

    return _txt[ index ];
}


// #############################################################################################
/// Function:<summary>
///          	Sets the byte in str at position index.
///          </summary>
// #############################################################################################
function string_set_byte_at(_str,_index,_byte) 
{
    var inStr = yyGetString(_str);
    var byteChar = yyGetInt32(_byte);

    var txt = UTF16_to_UTF8(inStr);
    var index = yyGetInt32(_index) - 1;
    if ((index >= 0) && (index < txt.length)) {
        txt[ index ] = byteChar&0xff;
        return UTF8_to_UTF16(txt);
    }
    else
    {
        yyError("string_set_byte_at : Index beyond end of string.");
    }
    
    return inStr;
}



// #############################################################################################
/// Function:<summary>
///          	Returns a copy of str with the part removed that starts at position index and 
///             has length count.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_index"></param>
///			<param name="_count"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_delete(_str,_index,_count) 
{
    var inStr = yyGetString(_str);
    var inIndex = yyGetInt32(_index);
    var inCount = yyGetInt32(_count);

    if (inCount <= 0 || inIndex <= 0) return inStr;
    
    var steps = 0;
    var startIndex = inIndex - 1;    
    var len = inStr.length;
    while ((startIndex > 0) && (steps < len)) {
        var code = inStr.charCodeAt(steps);
        if (0xD800 <= code && code <= 0xDFFF) {
            ++steps;            
        }
        ++steps;
        --startIndex;
    }
    startIndex = steps;

    steps = inCount;
    endIndex = startIndex;
    while (steps > 0) {
        var code = inStr.charCodeAt(startIndex);
        if (0xD800 <= code && code <= 0xDFFF) {
            ++endIndex;
        }
        ++endIndex;
        --steps;
    }

    return (inStr.substring(0, startIndex) + inStr.substring(endIndex, inStr.length));
}

// #############################################################################################
/// Function:<summary>
///          	Returns a copy of str with substr added at position index.
///          </summary>
///
/// In:		<param name="_substr"></param>
///			<param name="_str"></param>
///			<param name="_index"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_insert(_substr, _str,_index) 
{
    var inSubstr = yyGetString(_substr);
    var inStr = yyGetString(_str);
    var inIndex = yyGetInt32(_index);

    var steps = 0;
    var startIndex = inIndex - 1;
    var len = inStr.length;
    while ((startIndex > 0) && (steps < len)) {
        var code = inStr.charCodeAt(steps);
        if (0xD800 <= code && code <= 0xDFFF) {
            ++steps;
        }
        ++steps;
        --startIndex;
    }
    startIndex = steps;

	return (inStr.substring(0, startIndex) + inSubstr + inStr.substring(startIndex, _str.length));
}

// #############################################################################################
/// Function:<summary>
///          	Returns a copy of str with the first occurrence of substr replaced by newstr.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_substr"></param>
///			<param name="_newstr"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_replace(_str, _substr, _newstr)
{
    var inStr = yyGetString(_str);
    var inSubstr = yyGetString(_substr);
    var inNewstr = yyGetString(_newstr);

    var index = inStr.indexOf(inSubstr);
    if (index === -1 || inSubstr.length === 0) {
        return inStr;
    }

    return inStr.replace(inSubstr, inNewstr);
}

// #############################################################################################
/// Function:<summary>
///          	Returns a copy of str with all occurrences of substr replaced by newstr.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_substr"></param>
///			<param name="_newstr"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_replace_all( _str, _substr, _newstr )
{
    var inStr = yyGetString(_str);
	if ( inStr.length === 0 )
		return "";

	var inSubstr = yyGetString(_substr);
	if ( inSubstr.length === 0 )
        return inStr;

	var inNewstr = yyGetString(_newstr);
    var substrLen = inSubstr.length;
    var returnVal = "";
    var i = inStr.indexOf( inSubstr );
    var k = 0;

    while ( i >= 0 )
    {
    	returnVal += inStr.substring( k, i ) + inNewstr;
    	k = i + substrLen;
    	i = inStr.indexOf( inSubstr, k );
    }

    return k > 0 ? returnVal + inStr.substring( k ) : inStr;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of occurrences of substr in str.
///          </summary>
///
/// In:		<param name="_substr"></param>
///			<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_count(_substr,_str) 
{
    _substr = yyGetString(_substr);
    _str = yyGetString(_str);

    var count = 0;
    if (_substr.length > 0)
    {    
        var index = 0;
        while (index != -1) {
            index = _str.indexOf(_substr, index);
            if (index > -1) {
                count += 1;
                index++;
            }
        }
    }
    return count;
}


// #############################################################################################
/// Function:<summary>
///             replace occurences of Hash with newline character
///          </summary>
///
/// In:     <param name="_str"></param>
/// Out:    <returns>
///             input string with hash replaced
///         </returns>
// #############################################################################################
function string_hash_to_newline( _str )
{
    return String_Replace_Hash(yyGetString(_str), g_pFontManager.Font_Get(g_pFontManager.fontid), true);
}

// #############################################################################################
/// Function:<summary>
///          	Returns a lowercase copy of str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_lower(_str) 
{
    return yyGetString(_str).toLowerCase();
}

// #############################################################################################
/// Function:<summary>
///          	Returns an uppercase copy of str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_upper(_str) 
{
    return yyGetString(_str).toUpperCase();
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string consisting of count copies of str.
///          </summary>
///
/// In:		<param name="_str"></param>
///			<param name="_count"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_repeat(_str,_count) 
{
    var inStr = yyGetString(_str);
    _count = yyGetInt32(_count);

    var s = "";
    for(var i=0;i<_count;i++)
    {
        s = s + inStr;
    }
    return s;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string that only contains the letters in str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_letters(_str) 
{
    var s = "";

    var inStr = yyGetString(_str);

    for (var i = 0; i < inStr.length; i++) {
        var c = inStr[i];
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) {
            s = s + c;
        }
    }
    
    return s;    
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string that only contains the digits in str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_digits(_str) 
{
    var inStr = yyGetString(_str);

    var s = "";
    //var strs = _str.match(/[0-9]*/g);
    /*if (strs != null) {
        for (var n = 0; n < strs.length; n++) {
            s = s + strs[n];
        }
    }*/
    for (var i = 0; i < inStr.length; i++) {
        var c = inStr[i];
        if( c>='0' && c<='9' ){
            s = s+c;
        }
    }
    
    return s;  
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string that contains the letters and digits in str.
///          </summary>
///
/// In:		<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_lettersdigits(_str) 
{
    var inStr = yyGetString(_str);

    var s = "";
    //var strs = _str.match(/[A-Z]|[a-z]|[0-9]*/g);
    /*if (strs != null) {
        for (var n = 0; n < strs.length; n++) {
            s = s + strs[n];
        }
    }*/
    for (var i = 0; i < inStr.length; i++) {
        var c = inStr[i];
        if( (c>='A' && c<='Z') || (c>='a' && c<='z') || (c>='0' && c<='9') ){
            s = s+c;
        }
    }
    return s;  
}