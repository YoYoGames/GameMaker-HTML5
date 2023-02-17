// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyTypes.js
// Created:	        16/04/2019
// Author:          Luke B
// Project:         HTML5
// Description:     Utility functions which handle and convert between the different GML types
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 16/04/2019		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///				Converts the given type to a real number if required and returns the result.
///          </summary>
///
/// In:		 <param name="_v">The value to convert</param>
/// Out:	 <returns>
///				The given type as a real number value
///			 </returns>
// #############################################################################################
function yyGetReal(_v)
{
    if (typeof _v === "number")
        return _v;
    else if (typeof _v === "boolean") 
        return _v ? 1 : 0;
    else if (typeof _v === "string") {
        _v = _v.trim();
        var match = _v.match(g_NumberRE);
        if (match != null) {
            return Number(match);
        } // end if
    }
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v.toNumber();
        }
        else
        if (!(_v instanceof Array) && !(_v instanceof ArrayBuffer)) {
            if (_v.id !== undefined) {
                return _v.id;
            } // end if
            return Number (_v);
        } // end if
    }
    else if(typeof _v === "function")
    {
        var methodIndex = method_get_index(_v);
        if(methodIndex !== undefined)
        {
            return methodIndex;
        }
    }
    yyError( "unable to convert " + string(_v) + " to a number" );                
    return 0;
}

// #############################################################################################
/// Function:<summary>
///				Converts the given type to a long number if required and returns the result.
///          </summary>
///
/// In:		 <param name="_v">The value to convert</param>
/// Out:	 <returns>
///				The given type as a long number value
///			 </returns>
// #############################################################################################
function yyGetInt64(_v) {
    if (typeof _v === "number")
        return Long.fromValue(_v, false);
    else if (typeof _v === "boolean") 
        return Long.fromValue(_v ? 1 : 0, false);
    else if (typeof _v === "string") {
        var match = _v.match(g_NumberRE);
        if (match != null) {
            return Long.fromValue(Number(match), false);
        } // end if
    }
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v;
        }
        else
        if (!(_v instanceof Array) && !(_v instanceof ArrayBuffer)) {
            if (_v.id !== undefined) {
                return Long.fromValue(_v.id, false);
            } // end if
            return Long.fromValue(Number (_v), false);
        } // end if
    }
    else if(typeof _v === "function")
    {
        var methodIndex = method_get_index(_v);
        if(methodIndex !== undefined)
        {
            return methodIndex;
        }
    }
    yyError( "unable to convert " + string(_v) + " to a number" );                
    return 0;
} // end function


// #############################################################################################
/// Function:<summary>
///				Converts the given type to an int32 number if required and returns the result.
///          </summary>
///
/// In:		 <param name="_v">The value to convert</param>
/// Out:	 <returns>
///				The given type as an int32 number value
///			 </returns>
// #############################################################################################
function yyGetInt32(_v) {
    if (typeof _v === "number")
        return ~~_v;
    else if (typeof _v === "boolean") 
        return _v ? 1 : 0;
    else if (typeof _v === "string") {
        var match = _v.match(g_NumberRE);
        if (match != null) {
            return ~~Number(match);
        } // end if
    } // end if
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v.toInt();
        }
        else 
        if (!(_v instanceof Array) && !(_v instanceof ArrayBuffer)) {
            if (_v.id !== undefined) {
                return _v.id;
            } // end if
            return ~~Number(_v);
        } // end if
    } // end if
    else if(typeof _v === "function")
    {
        var methodIndex = method_get_index(_v);
        if(methodIndex !== undefined)
        {
            return methodIndex;
        }
    }
    yyError( "unable to convert " + string(_v) + " to a number" );                
    return 0;
}


// #############################################################################################
/// Function:<summary>
///				Converts the given type to a boolean if required and returns the result.
///          </summary>
///
/// In:		 <param name="_v">The value to convert</param>
/// Out:	 <returns>
///				The given type as a boolean value
///			 </returns>
// #############################################################################################
function yyGetBool(_v) {
    if (typeof _v === "boolean") 
        return _v;
    else if (_v === undefined) 
        return false;
    else if (typeof _v === "number")
        return _v > 0.5;
    else if (typeof _v === "string") {
        if (_v === "true") {
            return true;
        } else
        if (_v === "false") {
            return false;
        } else {
            var match = _v.match(g_NumberRE);
            if (match != null) {
                return Number(match) > 0.5;
            } // end if
        } // end else
    }
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v.toNumber() > 0.5;
        }
        else
        if (_v instanceof yyInstance) {
            return true;
        }
        else
        if (_v.__yyIsGMLObject)
            return true;
        else
        if (!(_v instanceof Array) && !(_v instanceof ArrayBuffer)) {
            return Number(_v) > 0.5;
        } // end if
        else
        if (_v instanceof ArrayBuffer) {
            return _v != g_pBuiltIn.pointer_null;
        }
    }
    else if(typeof _v === "function")
    {
        return true;
    }
    yyError( "unable to convert " + string(_v) + " to a boolean" );                
    return false;
}


// #############################################################################################
/// Function:<summary>
///				Converts the given type to a string if required and returns the result.
///          </summary>
///
/// In:		 <param name="_v">The value to convert</param>
/// Out:	 <returns>
///				The given type as a string
///			 </returns>
// #############################################################################################
var g_countSTRING_RValue = 0;
//var g_countInOutSTRING_RValue = 0;
var g_comparisonARRAY_RValue = 1;
var g_comparisonSTRUCT_RValue = 1;
var g_incQuotesSTRING_RValue = 0;

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


function yyGetString(_v) {
    if (typeof _v === "string") {
        var ret = "";
        if (g_incQuotesSTRING_RValue > 0)
            ret += "\"";
        ret += _v;
        if (g_incQuotesSTRING_RValue > 0)
            ret += "\"";
        return ret;
    } // end if
    else if(_v === null) {
        return "null";
    } // end if
    else if (_v === undefined) {
        return "undefined";
    } // end if
    else if (_v === g_pBuiltIn.pointer_null) {
        return "null";
    } // end if
    else if (typeof _v === "number") {
        if (isFinite(_v)) {
            if( (~~_v) != _v)
            {
                return _v.toFixed(2);
            }else{
                return _v.toString();
            }
        } else {
            if (Number.isNaN(_v))
                return "NaN";
            else
            if (_v < 0)
                return "-inf";
            else
                return "inf";
        } // end else
    } // end if
    else if (typeof _v === "boolean") {
        return  (_v) ? "1" : "0";
    } // end if
    else if (typeof _v === "object") {
        if (_v instanceof Long) {
            return _v.toString(10);
        }
        else if (_v instanceof Array) {
            var retString = "";
            ++g_incQuotesSTRING_RValue;
            if (!STRING_HasBeenVisited(_v)) {
                STRING_AddVisited(_v);
                retString = "[ ";
                for(var n = 0; n < _v.length; ++n) {
                    if (n != 0) {
                        retString += ",";
                    } // end if
                    retString += yyGetString(_v[n]);
                } // end for
                retString += " ]";
                STRING_RemoveVisited(_v);
            } // end if
            else {
                retString = "\"Warning: Recursive array found\"";
            } // end else
            --g_incQuotesSTRING_RValue;
            return retString;
        } // end if
        else /* if (_v.__yyIsGMLObject) */ {
            var retString = "";

            if (_v[ "gmltoString" ] != undefined ) {

                retString = _v.gmltoString( _v, _v );

            } else {

                ++g_incQuotesSTRING_RValue;
                if (!STRING_HasBeenVisited(_v)) {
                    STRING_AddVisited(_v);
                    var retString = "{ ";
                    var names = __internal__get_variable_names(_v, false);                
                    for( var n=0; n<names.length; n+=2) {
                        if (n != 0) {
                            retString += ", ";
                        } // end if
                        retString += names[ n ];
                        retString += " : ";
                        retString += yyGetString(_v[ names[n+1] ]);
                    } // end for  
                    retString += " }";
                    STRING_RemoveVisited(_v);
                } // end if
                else {
                    retString = "\"Warning: Recursive struct found\"";
                } // end else
                --g_incQuotesSTRING_RValue;
            } // end else
            return retString;
        }
    } // end else
    else if(typeof _v === "function")
    {
        var methodIndex = method_get_index(_v);
        if(methodIndex !== undefined)
        {
            return methodIndex.toString();
        }
    } // end else
    return _v.toString();
}
