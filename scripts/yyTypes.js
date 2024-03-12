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

var AT_None = -1,
    AT_Object = 0,
	AT_Sprite = 1,
	AT_Sound = 2,
	AT_Room = 3,
	AT_Path = 4,
	AT_Script = 5,
	AT_Font = 6,
	AT_Timeline = 7,
	AT_Shader = 8,
    AT_Sequence = 9,
    AT_AnimCurve = 10,
    AT_ParticleSystem = 11,
    AT_Tilemap = 12, 
    AT_Tileset = 13;

var REFCAT_RESOURCE			= 0x01000000;
var REFCAT_DATA_STRUCTURE	= 0x02000000;
var REFCAT_INSTANCE			= 0x04000000;
var REFCAT_GENERAL          = 0x08000000;

// Runtime instances of resources
var REFID_INSTANCE			= (0x00000001 | REFCAT_INSTANCE);
var REFID_DBG				= (0x00000002 | REFCAT_INSTANCE);
var REFID_PART_SYSTEM		= (0x00000004 | REFCAT_INSTANCE);
var REFID_PART_EMITTER		= (0x00000008 | REFCAT_INSTANCE);
var REFID_PART_TYPE			= (0x00000010 | REFCAT_INSTANCE);

// 
var REFID_OBJECT			= (AT_Object | REFCAT_RESOURCE);
var REFID_SPRITE			= (AT_Sprite | REFCAT_RESOURCE);
var REFID_SOUND				= (AT_Sound | REFCAT_RESOURCE);
var REFID_ROOM				= (AT_Room | REFCAT_RESOURCE);
var REFID_PATH				= (AT_Path | REFCAT_RESOURCE);
var REFID_SCRIPT			= (AT_Script | REFCAT_RESOURCE);
var REFID_FONT				= (AT_Font | REFCAT_RESOURCE);
var REFID_TIMELINE			= (AT_Timeline | REFCAT_RESOURCE);
var REFID_SHADER			= (AT_Shader | REFCAT_RESOURCE);
var REFID_SEQUENCE			= (AT_Sequence | REFCAT_RESOURCE);
var REFID_ANIMCURVE			= (AT_AnimCurve | REFCAT_RESOURCE);
var REFID_PARTICLESYSTEM	= (AT_ParticleSystem | REFCAT_RESOURCE);
var REFID_TILEMAP			= (AT_Tilemap | REFCAT_RESOURCE);
var REFID_TILESET			= (AT_Tileset | REFCAT_RESOURCE);

var REFID_DS_LIST		= (0x00000001 | REFCAT_DATA_STRUCTURE);
var REFID_DS_MAP		= (0x00000002 | REFCAT_DATA_STRUCTURE);
var REFID_DS_GRID		= (0x00000004 | REFCAT_DATA_STRUCTURE);
var REFID_DS_QUEUE		= (0x00000008 | REFCAT_DATA_STRUCTURE);
var REFID_DS_STACK		= (0x00000010 | REFCAT_DATA_STRUCTURE);
var REFID_DS_PRIORITY	= (0x00000020 | REFCAT_DATA_STRUCTURE);


var REFID_BUFFER = (0x00000001 | REFCAT_GENERAL);
var REFID_VERTEX_BUFFER = (0x00000002 | REFCAT_GENERAL);
var REFID_VERTEX_FORMAT = (0x00000003 | REFCAT_GENERAL);
var REFID_SURFACE = (0x00000004 | REFCAT_GENERAL);
var REFID_TIME_SOURCE = (0x00000005 | REFCAT_GENERAL);


function YYRef(_type, _value)
{
    this.type = _type;
    this.value = _value;
}

function MAKE_REF(a, b)
{
    return new YYRef(a, b);
}

function YYASSET_REF(a)
{
    var index = a & 0x00ffffff;
    var type = (a >> 24) & 0xff | REFCAT_RESOURCE;

    switch (type)
    {
    // TODO: Move resources to references
    case REFID_OBJECT:
    case REFID_PARTICLESYSTEM:
        return MAKE_REF(type, index);
    
    default:
        return index;
    }
}

var  g_name2ref = [
    {   "name" : "instance", "type" : REFID_INSTANCE },
    {   "name" : "ds_list",  "type" : REFID_DS_LIST },
    {   "name" : "ds_map", "type" : REFID_DS_MAP},
    {   "name" : "ds_grid", "type" : REFID_DS_GRID},
    {   "name" : "ds_queue", "type" : REFID_DS_QUEUE},
    {   "name" : "ds_stack", "type" : REFID_DS_STACK},
    {   "name" : "ds_priority", "type" : REFID_DS_PRIORITY},
    {   "name" : "object", "type" : REFID_OBJECT},
    {   "name" : "sprite", "type" : REFID_SPRITE},
    {   "name" : "sound", "type" : REFID_SOUND},
    {   "name" : "room", "type" : REFID_ROOM},
    {   "name" : "path", "type" : REFID_PATH},
    {   "name" : "script", "type" : REFID_SCRIPT},
    {   "name" : "font", "type" : REFID_FONT},
    {   "name" : "timeline", "type" : REFID_TIMELINE},
    {   "name" : "shader", "type" : REFID_SHADER},
    {   "name" : "sequence", "type" : REFID_SEQUENCE},
    {   "name" : "animcurve", "type" : REFID_ANIMCURVE},
    {   "name" : "particle system resource", "type" : REFID_PARTICLESYSTEM},
    {   "name" : "dbgref", "type" : REFID_DBG},
    {   "name" : "particle system instance", "type" : REFID_PART_SYSTEM},
    {   "name" : "particle emitter","type" : REFID_PART_EMITTER},
    {   "name" : "particle type", "type" : REFID_PART_TYPE},
    {   "name" : "buffer", "type" : REFID_BUFFER},
    {   "name" : "vertex buffer", "type" : REFID_VERTEX_BUFFER},
    {   "name" : "vertex format", "type" : REFID_VERTEX_FORMAT},
    {   "name" : "surface", "type" : REFID_SURFACE},
    {   "name" : "time source", "type" : REFID_TIME_SOURCE},
    {   "name" : "tilemap", "type" : REFID_TILEMAP},
    {   "name" : "tileset", "type" : REFID_TILESET},

];


function RefName(_ref)
{
    var pRet = "unknown";
    for( var n=0; n<g_name2ref.length; ++n) {
        if (g_name2ref[n].type == _ref) {
            pRet = g_name2ref[n].name;
            break;
        } // end if
    } // end for
    return pRet;
} // end RefName

function Name2Ref( _name )
{
    var pRet = -1;
    for( var n=0; n<g_name2ref.length; ++n) {
        if (g_name2ref[n].name == _name) {
            pRet = g_name2ref[n].type;
            break;
        } // end if
    } // end for
    return pRet;    
}

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
    if (_v instanceof YYRef)
        return _v.value;
    else if (typeof _v === "number")
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
    if (_v instanceof YYRef)
        return _v.value;
    else if (typeof _v === "number")
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
    if (_v instanceof YYRef)
        return _v.value;
    else if (typeof _v === "number")
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
    if (_v instanceof YYRef)
        return _v.value > 0;
    else if (typeof _v === "boolean") 
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

function yyGetRef(_value, _ref, _maxNum, _array, _allowOutOfRange) {
    var ret = -1;
    if (_value instanceof YYRef) {
        var type = _value.type;
        if (type != _ref) {
            if(!_allowOutOfRange)
                yyError("incorrect type (" + RefName(type) + ") expecting a " + RefName(_ref));
        }
        else
            ret = _value.value;
    }
    else {
        ret = yyGetInt32(_value);
    }

    if (!_allowOutOfRange) {
        if (ret < 0 || ret >= _maxNum || (_array && !_array[ret])) {
            yyError("invalid reference to (" + RefName(_ref) + ")");
        }
    }

    return ret;
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
    if (_v instanceof YYRef) {
        return "ref " + RefName(_v.type) + " " + _v.value;
    } // end if
    else if (typeof _v === "string") {
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

            } 
            else if ((typeof g_var2obf !== "undefined") && (g_var2obf["toString"] != undefined) && (_v[ g_var2obf["toString"]]!=undefined)) {
                
                retString = _v[ g_var2obf["toString"]]( _v, _v );
            }
            else {

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
