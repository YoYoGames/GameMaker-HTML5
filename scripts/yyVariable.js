
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyVariable.js
// Created:			30/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		Deals with variables we can't do natively. (like arrays etc.)
//					Also deals with global/local exists.
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 30/05/2011		V1.0        MJD     1st version. 1D and 2D arrays added.
// 
// **********************************************************************************************************************

// Native runner types
var VALUE_REAL= 0;		// Real value
var VALUE_STRING= 1;		// String value
var VALUE_ARRAY= 2;		// Array value
var VALUE_OBJECT = 6;	// YYObjectBase* value 
var VALUE_INT32= 7;		// Int32 value
var VALUE_UNDEFINED= 5;	// Undefined value
var VALUE_PTR= 3;			// Ptr value
var VALUE_VEC3= 4;		// Vec3 (x,y,z) value (within the RValue)
var VALUE_VEC4= 8;		// Vec4 (x,y,z,w) value (allocated from pool)
var VALUE_VEC44= 9;		// Vec44 (matrix) value (allocated from pool)
var VALUE_INT64= 10;		// Int64 value
var VALUE_ACCESSOR = 11;	// Actually an accessor
var VALUE_NULL = 12;	// JS Null
var VALUE_BOOL = 13;	// Bool value
var VALUE_ITERATOR = 14;	// JS For-in Iterator
var VALUE_REF = 15;		// Reference value (uses the ptr to point at a RefBase structure)

var g_CurrentArrayOwner = 0;


// #############################################################################################
/// Function:<summary>
///          	Simple user Array class
///          </summary>
///
/// In:		<param name="_pName"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function    yyArray( _pName )
{
    this.__type = "[Array]";
    this.m_pName = _pName;
    this.m_array = [];
}

function array_get_2D( _a, _d1, _d2 )
{
    _d1 = yyGetInt32(_d1);
    _d2 = yyGetInt32(_d2);

    if (!(_a instanceof Array)) yyError("array_get_2D() : argument 0 must be an array");
    if (typeof _d1 != "number") yyError( "array_get_2D() : index 1 must be a number" );
    if (typeof _d2 != "number") yyError( "array_get_2D() : index 2 must be a number" );
    if ((_d1 < 0) || (_d1 >= _a.length)) yyError( "array_get_2D() : index 1 out of range" );
    if (!(_a[_d1] instanceof Array)) yyError( "array_get_2D() : second dimension is not an array" );
    if ((_d2 < 0) || (_d2 >= _a[_d1].length)) yyError( "array_get_2D() : index 2 out of range" );
    return _a[_d1][_d2];
}

function array_set_2D( _a, _d1, _d2, _v )
{
    if (!(_a instanceof Array)) yyError( "array_set_2D() : argument 0 must be an array" );
    if (typeof _d1 != "number") yyError( "array_set_2D() : index 1 must be a number" );
    if (typeof _d2 != "number") yyError( "array_set_2D() : index 2 must be a number" );
    if (!(_a[_d1] instanceof Array)) _a[_d1] = [];
    _a[_d1][_d2] = _v;
}

function array_set_2D_pre( _a, _d1, _d2, _v )
{
    _d1 = yyGetInt32(_d1);
    _d2 = yyGetInt32(_d2);

    if (!(_a instanceof Array)) yyError( "array_set_2D_pre() : argument 0 must be an array" );
    if (!(_a[_d1] instanceof Array)) _a[_d1] = [];
    _a[_d1][_d2] = _v;
    return _v;
}

function array_set_2D_post( _a, _d1, _d2, _v )
{
    _d1 = yyGetInt32(_d1);
    _d2 = yyGetInt32(_d2);

    if (!(_a instanceof Array)) yyError( "array_set_2D_post() : argument 0 must be an array" );
    if (!(_a[_d1] instanceof Array)) _a[_d1] = [];
    var ret = _a[_d1][_d2];
    _a[_d1][_d2] = _v;
    return ret;
}

function array_get( _a, _d1 )
{
    _d1 = yyGetInt32(_d1);

    if (!(_a instanceof Array)) yyError( "array_get() : argument 0 must be an array" );
    if ((_d1 < 0) || (_d1 >= _a.length)) yyError( "array_get() : index out of range" );
    return _a[_d1];
}

function array_set( _a, _d1, _v )
{
    _d1 = yyGetInt32(_d1);
    if (!(_a instanceof Array)) { _a = []; }
    _a[_d1] = _v;
}

function array_set_pre( _a, _d1, _v )
{
    if (!(_a instanceof Array)) { _a = []; }
    _a[_d1] = _v;
    return _v;
}

function array_set_post( _a, _d1, _v )
{
    if (!(_a instanceof Array)) { _a = []; }
    var ret = _a[_d1];
    _a[_d1] = _v;
    return ret;
}

function __yy_is_nullish( _v )
{
    return (_v == undefined) || (_v == null);
}

function __yy_gml_array_create( _a )
{
    _a.__yy_owner = g_CurrentArrayOwner;
    return _a;
}

function GMLObject()
{    
    // do nothing just now
    this.__type = "Object";
    this.__yyIsGMLObject = true;
} // end GMLObject

GMLObject.prototype.toString = function () {
    return yyGetString(this);
};

function __yy_gml_object_create( _self, _a )
{
    var r = new GMLObject();
    var args = [];
    args[0] = r;
    args[1] = _self;
    for( var n=2; n<arguments.length; ++n) {
        args[n] = arguments[n];
    } // end for
    
    if (typeof _a === "number")
    {
        _a = JSON_game.Scripts[_a - 100000];
    }

    var func = _a.origfunc ? _a.origfunc : _a;
    if (!func.__yyg__is_constructor) {
        yyError( "target function for 'new' must be a constructor");
    } // end if
    func.apply( r, args );
    return r;
}

function is_method( _a )
{
    return (_a instanceof Function) && (typeof _a.__yy_userFunction !== 'undefined');   
}

function is_callable( _v )
{
    switch( typeof(_v) )
    {
        // Is a function so is callable (return true)
        case "function": return true;
        // Is a number try to get the script from it
        case "number": _v = JSON_game.Scripts[_v - 100000]; break;
        // Is a object, check if it is a 'Long' convert it to number and try to get script from it
        case "object": if (_v instanceof Long) _v = JSON_game.Scripts[_v.toNumber() - 100000]; break;
        // Is not callable (return false)
        default: return false;
    }

    // Check if a script was found
    return _v != undefined;
}

function is_handle( _v )
{
    return _v != undefined && _v instanceof YYRef;
}


function __yyg_call_method( _func )
{
    switch( typeof(_func) )
    {
    case "number":
        _func = JSON_game.Scripts[_func - 100000];
        break;
    case "function":
        // just use it as is
        break;
    case "object":
        if (_func instanceof Long)
            _func = JSON_game.Scripts[_func.toNumber() - 100000];
        else
            yyError( "unable to call function " + string(_func)  + " typeof=" + typeof(_func));
        break;
    default:
        yyError( "unable to call function " + string(_func) + " typeof=" + typeof(_func));
        break;
    }
    return _func;    
}

function __yy_method( _inst, _func )
{
    _func = _func.origfunc ? _func.origfunc : _func;
    var ret = _func;
    if ((_inst == undefined) || (_inst == null)) {
        ret = _func.bind(_inst);
    } else {
        var a = { func : _func, inst : _inst };
        var newfunc = function() {
            var newArgs = Array.prototype.slice.call(arguments);        
            newArgs[0] = this.inst;
            return this.func.apply(null, newArgs);
        };
        ret = newfunc.bind(a);
    }  // end if
    ret.origfunc = _func;           // in case we want to use the method with a different "this"
    ret.boundObject = _inst;
    ret.__yy_userFunction = true;
    _func.__yy_userFunction = true;
    return ret;
}

function method( _inst, _func )
{
    if (typeof _func === "number")
    {
        _func = JSON_game.Scripts[_func - 100000];
    }

    if ((typeof _inst == "number") || (_inst instanceof YYRef))
    {
        _inst = yyInst(null, null, _inst);
    }

    if (!(_func instanceof Function)) yyError("method : argument needs to be a function");
    if (_func.__yy_userFunction) {
        _func = _func.origfunc ? _func.origfunc : _func;
        var ret = _func;
        if ((_inst == undefined) || (_inst == null)) {
            ret = _func.bind(_inst);
        } else {
            var a = { func : _func, inst : _inst };
            var newfunc = function() {
                var newArgs = Array.prototype.slice.call(arguments);
                newArgs[0] = this.inst;
                return this.func.apply(null, newArgs);
            };        
            ret = newfunc.bind(a);
        }
        ret.boundObject = _inst;
        ret.origfunc = _func.origfunc === undefined ? _func : _func.origfunc;           // in case we want to use the method with a different "this"
        ret.__yy_userFunction = true;
        //Object.setPrototypeOf( newfunc, newfunc.origfunc.prototype);
        return ret;
    } // end if
    else {
        var ret = undefined;
        if (_func.origfunc) _func = _func.origfunc;
        if (_func.__yy_bothSelfAndOther) {
            ret = _func.bind(_inst);
        }
        else {
            var a = { func : _func };
            var newfunc;
            if (_func.__yy_onlySelfNoOther) {
                newfunc = function() {
                    var newArgs = Array.prototype.slice.call(arguments);
                    // delete the other
                    newArgs.splice(1,1);
                    return this.func.apply(null, newArgs);
                };                
            }
            else {
                newfunc = function() {
                    var newArgs = Array.prototype.slice.call(arguments);
                    return this.func.apply(null, newArgs.slice(2));
                };
            } // end else
            ret = newfunc.bind(a);
            ret.boundObject = _inst;
            ret.origfunc = _func.origfunc === undefined ? _func : _func.origfunc;           // in case we want to use the method with a different "this"
        } // end else
        return ret;
    } // end else
}

function globals() { return this; }
var g_globalScripts = [];

function  global_scripts_init()
{
    // lazily create an object with all the global scripts in it
    if (g_globalScripts.done === undefined) {

        var g = globals();
        var count = 0;
        for( var f in g) {
            if (g.hasOwnProperty(f) && (typeof g[f] === "function")) {
                g_globalScripts[count] = g[f];
                g[f].__yy_scriptIndex = count;
                ++count;
            } // end if
        } // end for

        g_globalScripts.done = true;
    } // end if    
} // end global_scripts_init

function method_get_index_from_name(name)
{
    // Check script names
    var scriptIndex  = JSON_game.ScriptNames.indexOf("gml_Script_" + name);
    if (scriptIndex != -1) {
        return scriptIndex + 100000;
    }

    // Check global script names
    global_scripts_init();
    scriptIndex = JSON_game.ScriptNames.indexOf("gml_GlobalScript_" + name);
    if (scriptIndex != -1) {
        return scriptIndex + 100000;
    }

    return null;
}

function method_get_self( _method )
{
    if ((typeof _method === "function") && (_method.boundObject !== undefined )) {
        // TODO :: we need to check to see if this is an instance, if it is then return the id
        for( var i = 0; i < g_pObjectManager.objidlist.length; ++i) {
            var object = g_pObjectManager.objidlist[i];
            var numInstances = object.Instances.count;
            for( var ii=0; ii<numInstances; ++ii) {
                if (object.Instances.pool[ii] == _method.boundObject)    
                    return object.Instances.pool[ii].id;
            } // end for
        } // end for
        return _method.boundObject;
    }
    return undefined;
}

function method_get_index( _method )
{
    if (typeof _method === "function") {

        if(_method.origfunc !== undefined)
        {
            // if the name is not a script then lets try the global scripts
            if (_method.origfunc.__yy_scriptIndex !== undefined) {
                return _method.origfunc.__yy_scriptIndex;
            } // end if

            // look through all the scripts and find the original function in the 
            var scriptIndex = JSON_game.Scripts.indexOf(_method.origfunc);
            if(scriptIndex != -1)
            {
                return scriptIndex + 100000;
            }
        }
        else
        {
            // Check whether script exists within user defined scripts and return its index if so
            var scriptIndex = JSON_game.Scripts.indexOf(_method);
            if(scriptIndex != -1)
            {
                return scriptIndex + 100000;
            }
        }
        
        // Check whether script exists within global scripts and return its index if so
        global_scripts_init();
        var globalScriptIndex = g_globalScripts.indexOf(_method);
        if(globalScriptIndex != -1)
        {
            return globalScriptIndex + 100000;
        }
    } // end if
    return undefined;
}

function __yy_gml_is_typed_array(_a) {
    return _a instanceof Int8Array ||
        _a instanceof Uint8Array ||
        _a instanceof Uint8ClampedArray ||
        _a instanceof Int16Array ||
        _a instanceof Uint16Array ||
        _a instanceof Int32Array ||
        _a instanceof Uint32Array ||
        _a instanceof Float32Array ||
        _a instanceof Float64Array ||
        _a instanceof BigInt64Array ||
        _a instanceof BigUint64Array;
}

function __yy_gml_array_check( _a, _b )
{
    // If it is an array with a different owner or typed array create a copy of it.
    if ((Array.isArray(_a) && _a.__yy_owner != g_CurrentArrayOwner) || __yy_gml_is_typed_array(_a)) {
        _a = _a.slice();
    }
    // If it's not an array create an empty array.
    else if (!(_a instanceof Array)) {
        _a = [];
    }
    // Set the current owner
    _a.__yy_owner = g_CurrentArrayOwner;

    return _a;
}

function __yy_gml_array_set_owner( _a )
{
    g_CurrentArrayOwner = _a;
}

function __yy_gml_array_check_index( _a, _b )
{
    if (!(_b instanceof Array) && !(_b instanceof Float32Array)) { 
        yyError( "trying to index variable which is not an array" );
    } // end if
    _a = yyGetInt32(_a);
    if ((_a < 0) || (_a >= _b.length)) yyError( "index out of range" );
    return _a;
}

function __yy_gml_array_check_index_set( _a )
{
    //if (typeof _a != "number") yyError( " index must be a number" );
    _a = yyGetInt32(_a);

    if (_a < 0) yyError("index out of range");
    return _a;
}

function __yy_gml_array_check_index_chain( _a, _b )
{
    if (!(_b instanceof Array)) { 
        _b = []; 
        _b.__yy_owner = g_CurrentArrayOwner;  
    }
    _a = yyGetInt32(_a);    
    if (_a < 0 ) yyError( "index out of range" );

    var index = _a;
    if (!(_b[index] instanceof Array)) {
        _b[index] = []; 
        _b[index].__yy_owner = g_CurrentArrayOwner;  
    } // end if
    else
    if (_b[index].__yy_owner != g_CurrentArrayOwner) {
        _b[index] = _b[index].slice();
        _b[index].__yy_owner = g_CurrentArrayOwner;
    } // end if

    return index;
}

function __yy_gml_errCheck( _a )
{
    if (_a === undefined) {
        yyError( "undefined value in expression" );
    } // end if
    else
    if (_a instanceof ArrayBuffer){
        yyError( "pointer value in expression" );
    } // end if
    return _a;
}

// #############################################################################################
// Returns a function given a function or script index (used for array functions)
// #############################################################################################
function getFunction(_function_or_script, _argn) {

    switch( typeof _function_or_script )
    {
        case "function": return _function_or_script;
        case "number": return JSON_game.Scripts[_function_or_script - 100000];
        default: yyError("argument" + _argn + " is not a method or script");
    }

}

// #############################################################################################
// Returns [offset, loops, step] given raw offset and raw length (used for string/array functions)
// #############################################################################################
function computeIterationValues(_maxLength, _rawOffset, _rawLength) {
    
    var _offset = Math.min(Math.max(_rawOffset, -_maxLength), _maxLength - 1);
    if (_offset < 0) _offset = _maxLength + _offset;

    var _step = 0, _loops = 0;
    if (_rawLength < 0) {
        _step = -1;
        _loops = Math.min(_offset + 1, Math.abs(_rawLength));
    }
    else {
        _step = 1;
        _loops = Math.min(_offset + _rawLength, _maxLength) - _offset;
    }

    return [_offset, _loops, _step];
}


// #############################################################################################
/// Function:<summary>
///          	Compare arrays. 
///             This is a deep comparison - the VALUES of nested arrays are compared recursively.
///          </summary>
///
/// In:		<param name="_a">Array 1</param>
///    		<param name="_b">Array 2</param>
/// Out:	<returns>
///				true for ===, false for !===
///			</returns>
// #############################################################################################
function array_equals(_a, _b)
{
    // Both arguments must be arrays
    if (!Array.isArray(_a) || !Array.isArray(_b)) {
        ELine("array_equals :  both arguments must be arrays");
        return false;
    }
    // Both must match in size and dimensions
    if (_a.length !== _b.length) return false;

    // 1 or 2 dimensions?
    for (var x = 0; x < _a.length; x++) {
        if (Array.isArray(_a[x]) || Array.isArray(_b[x])) {
            if (!array_equals(_a[x], _b[x])) return false;
        }
        else if((typeof _a[x]) == "number" && (typeof _b[x]) == "number")
        {
            /* If values are both numbers, compare with precision set by math_set_epsilon() */
            if (!yyfequal(_a[x], _b[x])) return false;
        }
        else {
            if (_a[x] !== _b[x]) return false;
        }
    }
    return true;
} // end array_equals

function array_create( _size, _val )
{
    if(_size === undefined)
    {
        _size = 0;
    }
    else
    {
        _size = yyGetInt32(_size);
    }

    var v = 0;
    if (arguments.length == 2) v = _val;

    var ret = [];
    ret.__yy_owner = g_CurrentArrayOwner;
    for( var i=0; i<_size; ++i) {
        ret[i] = v;
    } // end for

    return ret;
} // end array_create

function array_copy( _dest, _dest_index, _src, _src_index, _length)
{
    // Check array argument
    if (!Array.isArray(_dest)) yyError("array_copy : argument0 is not an array");

    // Check values argument
    if (!Array.isArray(_src)) yyError("array_copy : argument2 is not an array");

    _dest_index = yyGetInt32(_dest_index);
    _src_index = isFinite(_src_index) ? yyGetInt32(_src_index) : yyGetReal(_src_index);
    _length = isFinite(_length) ? yyGetInt32(_length) : yyGetReal(_length);

    // Compute the correct values for offset, loops and step (direction)
    [ _src_index, _length, _step ] = computeIterationValues(_src.length, _src_index, _length);

    if (_length == 0) return;
    
    // Converts negative offset to positive value and clamps between allowed values
    _dest_index = Math.max(_dest_index, -_dest.length);
    if (_dest_index < 0) _dest_index = _dest.length + _dest_index;

    // Fill any null elements prior to the copy with 0 (real) values. 
    // This mimics the initialisation flow of array data on VM/YYC when MemoryManager::SetLength is called. 
    if (_dest.length < _dest_index) { 
        for (var index = _dest.length; index < _dest_index + min(_src.length - _src_index, _length) ; ++index) { 
            if (_dest[index] == null) { 
                _dest[index] = 0; 
            }
        } // end for  
    } // end if 

    // Reverse indices we want to start at the end and go towards the beginning
    _src_index = _src_index + ((_length - 1) * _step);
    _dest_index += _length;
    _step = -_step;

    // Iterate over the input array range
    while (_length > 0) {
        _dest[--_dest_index] = _src[_src_index];
        _src_index += _step;
        _length -= 1;
    }
} // end array_copy

function array_resize( _array, _newSize )
{
    if (Array.isArray(_array)) {

        _newSize = yyGetInt32(_newSize);
        var oldSize = _array.length;
        _array.length = _newSize;
        if (_newSize > oldSize) {
            for( var n=oldSize; n<_newSize; ++n) {
                _array[n] = 0;
            } // end for
        } // end if

    } // end if
    else {
        yyError( "array_resize : argument0 is not an array");
    } // end else
} // end array_resize

function array_push( _array )
{
    if (Array.isArray(_array)) {
        for( var n=1; n<arguments.length; ++n) {
            _array.push( arguments[n] );
        } // end for
    } // end if
    else {
        yyError( "array_push : argument0 is not an array");
    } // end else
} // end array_push

function array_pop( _array )
{
    if (Array.isArray(_array)) {
        return _array.pop();
    } // end if
    else {
        yyError( "array_pop : argument0 is not an array");
    } // end else
} // end array_pop

function array_shift( _array )
{
    if (Array.isArray(_array)) {
        return _array.shift();
    } // end if
    else {
        yyError( "array_shift : argument0 is not an array");
    } // end else
} // end array_shift

function array_insert( _array, _index )
{
    if (Array.isArray(_array)) {
        _index = yyGetInt32(_index);

        // Fill any null elements prior to the copy with 0 (real) values. 
        // This mimics the initialisation flow of array data on VM/YYC when MemoryManager::SetLength is called.
        _length = _array.length;
        for(n = _index - 1; n >= _length; --n) { 
            _array[n] = 0; 
        }

        _values = Array.prototype.slice.call(arguments, 2);
        Array.prototype.splice.apply(_array, [_index, 0].concat(_values));
    } // end if
    else {
        yyError( "array_insert : argument0 is not an array");
    } // end else
} // end array_insert

function array_delete( _array, _index, _number )
{
    if (Array.isArray(_array)) {
        _index = yyGetReal(_index);
        _number = yyGetReal(_number);

        // If number is negative shift the index back and make number positive again
        if (_number < 0) {
            _index += _number + 1;
            _number = -_number;
        }

        _array.splice( _index, _number );
    } // end if
    else {
        yyError( "array_delete : argument0 is not an array");
    } // end else
} // end array_delete

function array_sort( _array, _typeofSort )
{
    if (Array.isArray(_array)) {

        switch( typeof _typeofSort )
        {
            case "function":
                _array.sort(function(a,b) { return _typeofSort( _typeofSort.boundObject, _typeofSort.boundObject, a, b); } );
                break;
            case "number":
                var func = JSON_game.Scripts[_typeofSort - 100000];
                var obj;
                if ( "boundObject" in func) {
                    obj = func.boundObject;
                } // end if
                else {
                    obj = {};
                } // end else
                _array.sort(function(a,b) { return func( obj, obj, a, b); } );
                break;
            default:
                if (yyGetBool(_typeofSort))
                    _array.sort( function(a,b) { return yyCompareVal(a,b); });
                else
                    _array.sort( function(a,b) { return yyCompareVal(b,a); });
                break;
        }
    } // end if
    else {
        yyError( "array_sort : argument0 is not an array");
    } // end else
} // end array_sort

const shuffleArray = (_array, _offset, _length) => {
    
    _offset = _offset !== undefined ? _offset : 0;
    _length = _length !== undefined ? _length : _array.length - _offset;

    for (let i = _length - 1; i > 0; --i) {
        const j = _offset + Math.floor(Math.random() * (i + 1));
        const temp = _array[_offset + i];
        _array[_offset + i] = _array[j];
        _array[j] = temp;
    }
}; // end shuffleArray

function array_shuffle( _array, _offset, _length )
{
    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    var ret = undefined;
    if (Array.isArray(_array)) {

        // Compute raw values into valid/clamped values
        _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
        _offset = _itValues[0];
        var _loops = _itValues[1];
        var _step = _itValues[2];

        // Order doesn't matter here allways go up
        if (_step < 0) _offset -= (_loops - 1);

        // Duplicate the array
        ret = _array.slice(_offset, _offset + _loops);

        // Shuffle the array
        shuffleArray(ret);

    } // end if
    else {
        yyError( "array_shuffle : argument0 is not an array");
    } // end else
    return ret;
} // end array_shuffle

function array_shuffle_ext(_array, _offset, _length)
{
    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    var ret = undefined;
    if (Array.isArray(_array)) {

        // Compute raw values into valid/clamped values
        _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
        _offset = _itValues[0];
        var _loops = _itValues[1];
        var _step = _itValues[2];

        // Order doesn't matter here allways go up
        if (_step < 0) _offset -= (_loops - 1);

        ret = _array;

        if (_loops == 0) return ret;

        // Shuffle the array
        shuffleArray(ret, _offset, _loops);

    } // end if
    else {
        yyError( "array_shuffle_ext : argument0 is not an array");
    } // end else
    return _loops;
} // end array_shuffle_ext

function array_first(_array) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_first : argument0 is not an array");

    var _length = _array.length;
    return _length == 0 ? undefined : _array[0];
} // end array_first

function array_last(_array) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_last : argument0 is not an array");

    var _length = _array.length;
    return _length == 0 ? undefined : _array[_length -1];
} // end array_last

function array_create_ext(_size, _func) {

    // Check size argument
    _size = _size === undefined ? 0 : yyGetReal(_size);
    
    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    var ret = [];
    ret.__yy_owner = g_CurrentArrayOwner;
    
    for (var i = _size - 1; i >= 0; --i) {
        ret[i] = _func(_obj, _obj, i);
    } // end for

    return ret;
} // end array_create_ext

function array_find_index(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_find_index : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If match found return offset (index)
        if (yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            return _offset;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }
    return -1;
} // end array_find_index

function array_get_index(_array, _value, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_get_index : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If match found return offset (index)
        if (yyCompareVal(_array[_offset], _value, g_GMLMathEpsilon, false) == 0) {
            return _offset;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return -1;
} // end array_get_index

function array_contains(_array, _value, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_contains : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If match found return offset (index)
        if (yyCompareVal(_array[_offset], _value, g_GMLMathEpsilon, false) == 0) {
            return true;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return false;
} // end array_contains

function array_contains_ext(_array, _values, _matchAll, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_contains_ext : argument0 is not an array");

    // Check values argument
    if (!Array.isArray(_values)) yyError("array_contains_ext : argument1 is not an array");
    
    var subArrayLength = _values.length;

    // Early exit if test subset size if zero (should return true)
    if (subArrayLength == 0) return true;

    // Check raw offset and length
    _matchAll = _offset = arguments.length > 2 ? yyGetBool(_matchAll) : false;
    _offset = arguments.length > 3 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 4 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var matchCount = 0;

    // Loop through array range
    while (_loops > 0) {

		var matched = false;
        var current = _array[_offset];
		for (var i = 0; i < subArrayLength; ++i)
		{
			if (yyCompareVal(current, _values[i], g_GMLMathEpsilon, false) == 0)
			{
				matched = true;
				matchCount += 1;
				break;
			}
		}
		// There was a match and any should match; return true
		if (matched && !_matchAll)
		{
			return true;
		}

        // Update index and loops
        _offset += _step;
        _loops--;
    }

	// If match count matches the size of the sub array; return true
	if (matchCount == subArrayLength)
	{
		return true;
	}

    return false;
} // end array_contains_ext

function array_any(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_any : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If match found return true
        if (yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            return true;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    // If no match was found return false
    return false;
} // end array_any

function array_all(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_all : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If there is no match return false
        if (!yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            return false;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    // All elements matched (return true)
    return true;
} // end array_all

function array_foreach(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_foreach : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // Loop through array range
    while (_loops > 0) {

        // If match found return offset (index)
        _func(_obj, _obj, _array[_offset], _offset);

        // Update index and loops
        _offset += _step;
        _loops--;
    }
} // end array_foreach

function array_reduce(_array, _func, _init, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_reduce : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 3 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 4 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    // If no initial value is passed just jump first iteration
    // and use first iteration value as init value.
    if (_init === undefined) {
        _init = _array[_offset];
        _offset += _step;
        _loops--;
    }

    // Loop through array range
    while (_loops > 0) {

        // If match found return offset (index)
        _init = _func(_obj, _obj, _init, _array[_offset], _offset);

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _init;
} // end array_reduce

function array_filter(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_filter : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = [], _idx = 0;
    _ret.__yy_owner = g_CurrentArrayOwner;

    // Loop through array range
    while (_loops > 0) {

        // If element matches predicate function add to output
        if (yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            _ret[_idx] = _array[_offset];
            _idx++;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _ret;
} // end array_filter

function array_filter_ext(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_filter_ext : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = 0, _idx = _offset;

    // Loop through array range
    while (_loops > 0) {

        // If element matches predicate function update the input array
        if (yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            _array[_idx] = _array[_offset];
            _idx += _step;
            _ret++;
        }

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    // Return the number of mutated elements
    return _ret;
} // end array_filter_ext

function array_map(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_map : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = [], _idx = 0;
    _ret.__yy_owner = g_CurrentArrayOwner;

    // Loop through array range
    while (_loops > 0) {

        // Map the input value to the output array
        _ret[_idx] = _func(_obj, _obj, _array[_offset], _offset);
        _idx++;
        
        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _ret;
} // end array_map

function array_map_ext(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_map_ext : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = 0;

    // Loop through array range
    while (_loops > 0) {

        // Update the input array with the mapped value
        _array[_offset] = _func(_obj, _obj, _array[_offset], _offset);
        _ret++;

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    // Return the new array
    return _ret;
} // end array_map_ext

function array_copy_while(_array, _func, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_copy_while : argument0 is not an array");

    // Check method argument
    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    // Check raw offset and length
    _offset = arguments.length > 2 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 3 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = [], _idx = 0;
    _ret.__yy_owner = g_CurrentArrayOwner;

    // Loop through array range
    while (_loops > 0) {

        // If element matches predicate function add to output
        if (yyGetBool(_func(_obj, _obj, _array[_offset], _offset))) {
            _ret[_idx] = _array[_offset];
            _idx++;
        }
        else return _ret;

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _ret;
} // end array_copy_while

function array_unique(_array, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_unique : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _set = new Set();

    // Loop through array range
    while (_loops > 0) {

        // Add element to value set
        _set.add(_array[_offset]);

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    _ret = Array.from(_set);
    _ret.__yy_owner = g_CurrentArrayOwner;

    return _ret;
} // end array_unique

function array_unique_ext(_array, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_unique_ext : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _idx = _offset, _set = new Set();

    // Loop through array range
    while (_loops > 0) {

        var _element = _array[_offset];
        if (!_set.has(_element)) {
            _array[_idx] = _element;
            _idx += _step;
            _ret++;
        }
        
        _set.add(_element);

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _set.size;
} // end array_unique_ext

function array_reverse(_array, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_reverse : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

    var _ret = [], _idx = _loops - 1;;
    _ret.__yy_owner = g_CurrentArrayOwner;

    // Loop through array range
    while (_loops > 0) {

        // Copy to output array in reverse order
        _ret[_idx] = _array[_offset];
        _idx--;

        // Update index and loops
        _offset += _step;
        _loops--;
    }

    return _ret;
} // end array_reverse

function array_reverse_ext(_array, _offset, _length) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_reverse_ext : argument0 is not an array");

    // Check raw offset and length
    _offset = arguments.length > 1 ? yyGetReal(_offset) : 0;
    _length = arguments.length > 2 ? yyGetReal(_length) : _array.length; 

    // Compute raw values into valid/clamped values
    _itValues = computeIterationValues(_array.length, _offset, _length); // [offset, loops, step]
    _offset = _itValues[0];
    var _loops = _itValues[1];
    var _step = _itValues[2];

	// We want to get the start and end index since we will be switching values
	var _ret = _loops, _startIndex = _offset, _endIndex = _offset + (_loops - 1) * _step;

    // Loop through (half of the) array range
    _loops = Math.floor(_loops * .5);
    while (_loops > 0) {

        // Mutate input array to reverse order
        var _temp = _array[_startIndex];
        _array[_startIndex] = _array[_endIndex];
        _array[_endIndex] = _temp;

        // Update indices and loops
        _startIndex += _step;
        _endIndex -= _step;
        _loops--;
    }

    return _ret;
} // end array_reverse_ext

function array_concat(_array) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_concat : argument0 is not an array");

    var _ret = _array;

    // Loop through all the input arguments
    for (var _idx = 1; _idx < arguments.length; _idx++) {

        // Check array argument
        if (!Array.isArray(arguments[_idx])) yyError("array_concat : argument" + _idx + " is not an array");
        _ret = _ret.concat(arguments[_idx]);
    }

    _ret.__yy_owner = g_CurrentArrayOwner;
    return _ret;

} // end array_concat

function array_union(_array) {

    // Check array argument
    if (!Array.isArray(_array)) yyError("array_union : argument0 is not an array");

    var _ret = _array;

    // Loop through all the input arguments
    for (var _idx = 1; _idx < arguments.length; _idx++) {

        // Check array argument
        if (!Array.isArray(arguments[_idx])) yyError("array_union : argument" + _idx + " is not an array");
        _ret = _ret.concat(arguments[_idx]);
    }

    // Make unique values using set
    var _set = new Set(_ret);

    // Convert set back to array
    _ret = Array.from(_set);
    _ret.__yy_owner = g_CurrentArrayOwner;
    
    return _ret;
} // end array_union

function array_intersection(_array) {

    var _map = new Map();

    // Loop through all the input arguments
    for (var _idx = 0; _idx < arguments.length; _idx++) {

        _array = arguments[_idx];

        // Check array argument
        if (!Array.isArray(arguments[_idx])) yyError("array_intersection : argument" + _idx + " is not an array");

        // Remove duplicates
        _array = Array.from(new Set(_array));

        // Go for each element and add to map (keep track of appearances)
        _array.forEach(el => {

            // Add the value to the map or increase its count
            if (_map.has(el)) _map.set(el, _map.get(el) + 1);
            else _map.set(el, 1);
        });
    }

    // Convert map back to array
    var _ret = [], _idx = 0;
    _ret.__yy_owner = g_CurrentArrayOwner;

    _map.forEach((_val, _key) => {
        // Ensure all arrays had the entry
        if (_val == arguments.length) _ret[_idx++] = _key;
    });
    
    return _ret;

} // end array_intersection

// #############################################################################################
// Converts the buffer to a hexadecimal string
// #############################################################################################
function variable_ConvertToString(_pBuffer) {
    var st = "";
    var size = buffer_tell(_pBuffer);           // get current position (size)
    for (var i = 0; i < size; ++i) {
        var y = buffer_peek(_pBuffer, i, eBuffer_U8);
        st += g_Hex[y >> 4] + g_Hex[y & 0xf];
    }
    return st;
}

// #############################################################################################
// Write a "value" out to a buffer
// #############################################################################################
function variable_WriteValue(_pBuffer, _val) {
    // Write a single value to the buffer    
    if (typeof (_val) == "boolean") {
        // Write BOOL (64bit double)
        buffer_write(_pBuffer, eBuffer_U32, VALUE_BOOL);         // BOOL        
        var i = 0;
        if (_val) i = 1;
        buffer_write(_pBuffer, eBuffer_F64, i);                  // write "real" (64bits - stupid)
    } else if (typeof (_val) == "number") {
        // Write "real" (64bit double)
        buffer_write(_pBuffer, eBuffer_U32, VALUE_REAL);
        buffer_write(_pBuffer, eBuffer_F64, _val);
    } else if (typeof (_val) == "string") {
        // Write "pascal" String (len, values)
        buffer_write(_pBuffer, eBuffer_U32, VALUE_STRING);
        var utf8_string = UnicodeToUTF8(_val);                  // UTF8 size needed...
        buffer_write(_pBuffer, eBuffer_U32, utf8_string.length); // length
        buffer_write(_pBuffer, eBuffer_Text, _val);              // Buffer writes as UTF8 strings internally (no 0 at the end)
    } else if (_val instanceof Array) {
        // Write ARRAY
        buffer_write(_pBuffer, eBuffer_U32, VALUE_ARRAY);
        var len = _val.length;
        buffer_write(_pBuffer, eBuffer_U32, len);
        for (var i = 0; i < len; i++) {
            variable_WriteValue(_pBuffer, _val[i]);
        }
    } else {
        // in JS it's probably an object - which we can't write
        buffer_write(_pBuffer, eBuffer_U32, VALUE_UNDEFINED);
        // can't wite value - so don't write anything
    }
}


// #############################################################################################
// Hex digit?
// #############################################################################################
function isHexdigit(_c) {
    return ((_c >= '0') && (_c <= '9')) ||
			((_c >= 'A') && (_c <= 'F')) ||
			((_c >= 'a') && (_c <= 'f'));

}

// #############################################################################################
// Hex nibble to vale
// #############################################################################################
function Hex2Int(_c) {
    var b = (_c & 0x40) >> 6;
    return (_c & 0x0f) + (b * 9);
}

// #############################################################################################
// Convert from the native string into a byte buffer
// #############################################################################################
function variable_ConvertFromString(_str) {

    var len = _str.length;
    if (len === 0) return -1;
    var lenHex = 0;

    // get length of HEX stream
    for (var i = 0; i < len; i += 2) {
        if (isHexdigit(_str[i]) && isHexdigit(_str[i + 1])) {
            lenHex += 2;
        } else {
            break;
        }
    }

    // found hex digits?
    var pBuffer = -1;
    if (lenHex > 0) {
        var pBuffer = buffer_create(lenHex / 2, eBuffer_Format_Grow, 1);

        var index = 0;
        for (var i = 0; i < lenHex; i += 2) {
            var a = ((Hex2Int(_str.charCodeAt(i)) * 16) + Hex2Int(_str.charCodeAt(i + 1)));
            buffer_poke(pBuffer, index++, eBuffer_U8, a);
        }
        return pBuffer;
    }
    return -1;
}

// #############################################################################################
//  Read a value from the buffer and stuff it in the grid (at index)
// #############################################################################################
function variable_ReadValue(_pBuffer, _version) {
    var t = buffer_read(_pBuffer, eBuffer_S32);
    if (t === VALUE_BOOL) {
        var b = buffer_read(_pBuffer, eBuffer_F64);
        var tf = false;
        if (b != 0) tf = true;
        return tf;
    } else if (t === VALUE_REAL) {
        var b = buffer_read(_pBuffer, eBuffer_F64);
        return b;
    } else if (t === VALUE_INT32) {
        // native can also read/write int32's
        var v = buffer_read(_pBuffer, eBuffer_S32);
        return v;
    } else if (t === VALUE_INT64 || t === VALUE_PTR) {
        // native can also read/write int64's - although we can't
        var v = buffer_read(_pBuffer, eBuffer_S32);
        var v2 = buffer_read(_pBuffer, eBuffer_S32);        // best we can do...
        return (v2 << 32) | v;
    } else if (t === VALUE_STRING) {
        var l = buffer_read(_pBuffer, eBuffer_S32);
        s = "";
        for (var i = 0; i < l; i++) {
            s += String.fromCharCode(buffer_read(_pBuffer, eBuffer_U8));
        }
        return UTF8ToUnicode(s);
    } else if (t === VALUE_ARRAY) {
        var arr = [];

        if (_version == 3) {
            var len_1d = buffer_read(_pBuffer, eBuffer_S32);
            if (len_1d === 1) {
                var len = buffer_read(_pBuffer, eBuffer_S32);
                for (var i = 0; i < len; i++) {
                    arr[i] = variable_ReadValue(_pBuffer, _version);
                }
            } else {
                for (var o = 0; o < len_1d; o++) {
                    var len = buffer_read(_pBuffer, eBuffer_S32);
                    for (var i = 0; i < len; i++) {
                        var b = variable_ReadValue(_pBuffer, _version);
                        array_set_2D(arr, o, i, b);
                    }
                }
            }
        } else {
            var len = buffer_read(_pBuffer, eBuffer_S32);
            for (var i = 0; i < len; i++) {
                arr[i] = variable_ReadValue(_pBuffer, _version);
            }
        }

        return arr;
    } else {
        return undefined;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Get the "actual" name of the variable they are trying to access
///          </summary>
///
/// In:		<param name="_name">__gml????__ name</param>
/// Out:	<returns>
///				the real name
///			</returns>
// #############################################################################################
function StripGMLName(_name) {
	return "\""+_name.substr(5, _name.length - 7)+"\"";
}
function StripGMLName_NoQuote(_name) {
	return _name.substr(5, _name.length - 7);
}

/*
// -----------------------------------------------------------------------------------------------------------------------
var g_global_names = {
            // 0=get, 1=set, 2=pro, 3=setter, 4=getter
            "room" : [ true, true, true, "set_current_room", "get_current_room"],
            "room_first" : [ true, false, false, null, null],
            "room_last" : [ true, false, false, null, null],
            "transition_kind" : [ true, true, true, null, null],
            "transition_steps" : [ true, true, true, null, null],
            "score" : [ true, true, true, null, null],
            "lives" : [ true, true, true, "set_lives_function", null],
            "health" : [ true, true, true, "set_health_function", null],
            "game_id" : [ true, false, false, null, null],
            "game_display_name" : [ true, false, true, null, null],
            "game_project_name" : [ true, false, true, null, null],
            "game_save_id" : [ true, false, true, null, null],
            "working_directory" : [ true, false, false, null, null],
            "temp_directory" : [ true, false, false, null, null],
            "program_directory" : [ true, false, false, null, null],
            "instance_count" : [ true, false, false, null, "get_instance_count"],
            "instance_id" : [ true, false, false, null, null],
            // room parameters
            "room_width" : [ true, true, false, "set_room_width", null],
            "room_height" : [ true, true, false, "set_room_height", null],
            "room_caption" : [ true, true, true, "set_room_caption", null],
            "room_speed" : [ true, true, true, "set_room_speed", "get_room_speed"],
            "room_persistent" : [ true, true, true, "set_room_persistent", null],
            "background_color" : [ true, true, true, "setbackground_color", "getbackground_color"],
            "background_showcolor" : [ true, true, true, "setbackground_showcolor", "getbackground_showcolor"],
            "background_colour" : [ true, true, true, "setbackground_color", "getbackground_color"],
            "background_showcolour" : [ true, true, true, "setbackground_showcolor", "getbackground_showcolor"],
            "background_visible" : [ true, true, true, null, null],
            "background_foreground" : [ true, true, true, null, null],
            "background_index" : [ true, true, true, null, null],
            "background_x" : [ true, true, true, null, null],
            "background_y" : [ true, true, true, null, null],
            "background_width" : [ true, false, false, null, null],
            "background_height" : [ true, false, false, null, null],
            "background_htiled" : [ true, true, true, null, null],
            "background_vtiled" : [ true, true, true, null, null],
            "background_xscale" : [ true, true, true, null, null],
            "background_yscale" : [ true, true, true, null, null],
            "background_hspeed" : [ true, true, true, null, null],
            "background_vspeed" : [ true, true, true, null, null],
            "background_blend" : [ true, true, true, null, null],
            "background_alpha" : [ true, true, true, null, null],
            "view_enabled" : [ true, true, true, "set_view_enable", "get_view_enable"],
            "view_current" : [ true, false, false, null, null],
            "view_visible" : [ true, true, true, null, null],
            "view_xview" : [ true, true, true, null, null],
            "view_yview" : [ true, true, true, null, null],
            "view_wview" : [ true, true, true, null, null],
            "view_hview" : [ true, true, true, null, null],
            "view_angle" : [ true, true, true, null, null],
            "view_hborder" : [ true, true, true, null, null],
            "view_vborder" : [ true, true, true, null, null],
            "view_hspeed" : [ true, true, true, null, null],
            "view_vspeed" : [ true, true, true, null, null],
            "view_object" : [ true, true, true, null, null],
            "view_xport" : [ true, true, true, null, null],
            "view_yport" : [ true, true, true, null, null],
            "view_wport" : [ true, true, true, null, null],
            "view_hport" : [ true, true, true, null, null],            
            "view_surface_id" : [ true, true, true, null, null],
            "view_camera" : [ true, true, true, null, null],            
            // interaction values
            "mouse_x" : [ true, false, false, null, "get_mouse_x"],
            "mouse_y" : [ true, false, false, null, "get_mouse_y"],
            "mouse_button" : [ true, true, true, null, null],
            "mouse_lastbutton" : [ true, true, true, null, null],
            "keyboard_key" : [ true, true, true, null, null],
            "keyboard_lastkey" : [ true, true, true, null, null],
            "keyboard_lastchar" : [ true, true, true, null, null],
            "keyboard_string" : [ true, true, true, null, null],
            // others            
            "show_score" : [ true, true, true, null, null],
            "show_lives" : [ true, true, true, null, null],
            "show_health" : [ true, true, true, null, null],
            "caption_score" : [ true, true, true, null, null],
            "caption_lives" : [ true, true, true, null, null],
            "caption_health" : [ true, true, true, null, null],
            "fps" : [ true, false, false, null, null],
            "fps_real" : [ true, false, false, null, null],
            "current_time" : [ true, false, false, null, "get_current_time"],
            "current_year" : [ true, false, false, null, "get_current_year"],
            "current_month" : [ true, false, false, null, "get_current_month"],
            "current_day" : [ true, false, false, null, "get_current_day"],
            "current_weekday" : [ true, false, false, null, "get_current_weekday"],
            "current_hour" : [ true, false, false, null, "get_current_hour"],
            "current_minute" : [ true, false, false, null, "get_current_minute"],
            "current_second" : [ true, false, false, null, "get_current_second"],
            // event related
            "event_type" : [ true, false, false, null, "get_current_event_type"],
            "event_number" : [ true, false, false, null, "get_current_event_number"],
            "event_object" : [ true, false, false, null, "get_current_event_object"],
            "event_action" : [ true, false, false, null, null],
            // special
            "error_occurred" : [ true, true, true, null, null],
            "error_last" : [ true, true, true, null, null],
            "gamemaker_registered" : [ true, false, false, null, null],
            "gamemaker_pro" : [ true, false, false, null, null],
            "application_surface" : [ true, false, false, null, null],
            "os_type" : [ true, false, false, null, "get_os_type"],
            "os_device" : [ true, false, false, null, "get_os_device"],
            "os_browser" : [ true, false, false, null, "get_os_browser"],
            "os_version" : [ true, false, false, null, "get_os_version"],
            "browser_width" : [ true, false, false, null, "get_browser_width"],
            "browser_height" : [ true, false, false, null, "get_browser_height"],
            "async_load" : [ true, false, false, null, "get_async_load"],
            "event_data" : [ true, false, false, null, "get_event_data"],
            "display_aa" : [ true, false, false, null, "get_display_aa"],
            "iap_data" : [ true, false, false, null, "get_iap_data"],            
            "cursor_sprite" : [ true, true, false, "set_cursor_sprite", "get_cursor_sprite"],
            "delta_time" : [ true, true, false, null, "get_delta_time"],
            "webgl_enabled" : [ true, false, false, null, null],
            // internal
            "marked": [false, false, false, null, null],
            "active": [false, false, false, null, null],
    };
*/

// #############################################################################################
/// Function:<summary>
///             Try and see if a global variable exists
///          </summary>
///
/// In:		 <param name="_var"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function variable_global_exists(_var) {
    var ret = false;
    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
        ret = g_global_names[ g_var2obf[_var] ];
    } else {
        ret = g_global_names[ _var ];
    } // end else
    if (ret == undefined) {
        if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
            ret = global.hasOwnProperty(g_var2obf[_var]);
        }
        else {
            ret = global.hasOwnProperty("gml"+_var);
        } // end else
    }  
    else { 
        ret = true;
    } // end else

    return ret;
}





// #############################################################################################
/// Function:<summary>
///             Try and see if a global variable exists
///          </summary>
///
/// In:		 <param name="_var"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function variable_global_get(_var) {

    _var = yyGetString(_var);

    var ret = false;
    var f;
    var settings;
    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
        ret = g_global_names[ g_var2obf[_var] ];
    } else {
        settings = g_global_names[ _var ];
    } // end else
    if (settings == undefined) {
        if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
            ret = global[ g_var2obf[_var] ];
        }
        else {
            ret = global[ "gml"+_var ];
        } // end else
    }  
    else if (settings[0]) { // are we allowed to get???
        if (settings[4] != null ) {
            if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[4]] != undefined)) {
                f = g_pBuiltIn[ g_var2obf[settings[4]] ];
            } else {
                f = g_pBuiltIn[ settings[4] ];
            } // end else
            if (typeof f == 'function') {
                ret = f.call(g_pBuiltIn);
            } // end if
        } // end if
        else {
            ret = g_pBuiltIn[ _var ];
        } // end else
    } // end if

    return ret;
}


// #############################################################################################
/// Function:<summary>
///          	Sets the global variable with the given name (a string) to the given value.
///          </summary>
///
/// In:		<param name="_name"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function variable_global_set(_var, _val) {

    _var = yyGetString(_var);

    var ret = false;
    var f;
    var settings = undefined;
    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
        ret = g_global_names[ g_var2obf[_var] ];
    } else {
        settings = g_global_names[ _var ];
    } // end else
    if (settings == undefined) {
        if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
            global[ g_var2obf[_var] ] = _val;
        }
        else {
            global[ "gml"+_var ] = _val;
        } // end else
    }  
    else if (settings[0]) { // are we allowed to get???
        if (settings[3] != null ) {
            if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[3]] != undefined)) {
                f = g_pBuiltIn[ g_var2obf[settings[3]] ];
            } else {
                f = g_pBuiltIn[ settings[3] ];
            } // end else
            if (typeof f == 'function') {
                f.call( g_pBuiltIn, _val );
            } // end if
        } // end if
        else {
            g_pBuiltIn[ _var ] = _val;
        } // end else
    } // end if
}

/*
// -----------------------------------------------------------------------------------------------------------------------
var g_instance_names = {
            // 0=get, 1=set, 2=pro, 3=setter, 4=getter
            "x" : [ true, true, true, null, null],
            "y" : [ true, true, true, null, null],
            "xprevious" : [ true, true, true, null, null],
            "yprevious" : [ true, true, true, null, null],
            "xstart" : [ true, true, true, null, null],
            "ystart" : [ true, true, true, null, null],
            "hspeed" : [ true, true, true, null, null],
            "vspeed" : [ true, true, true, null, null],
            "direction" : [ true, true, true, null, null],
            "speed" : [ true, true, true, null, null ],
            "friction" : [ true, true, true, null, null],
            "gravity" : [ true, true, true, null, null],
            "gravity_direction" : [ true, true, true, null, null ],
            "object_index" : [ true, false, false, null, null],
            "id" : [ true, false, false, null, null],
            "alarm" : [ true, true, true, null, null],
            "solid" : [ true, true, true, null, null],            
            "visible" : [ true, true, true, null, null],
            "persistent" : [ true, true, true, null, null],
            "depth" : [ true, true, true, null, null],
            "bbox_left" : [ true, false, false, null, null],
            "bbox_right" : [ true, false, false, null, null],
            "bbox_top" : [ true, false, false, null, null],
            "bbox_bottom" : [ true, false, false, null, null],
            "sprite_index" : [ true, true, true, null, null],
            "image_single" : [ true, true, true, null, null],
            "image_number" : [ true, false, false, null, null],
            "sprite_width" : [ true, false, false, null, null],
            "sprite_height" : [ true, false, false, null, null],
            "sprite_xoffset" : [ true, false, false, null, null],
            "sprite_yoffset" : [ true, false, false, null, null],
            "image_xscale" : [ true, true, true, null, null],
            "image_yscale" : [ true, true, true, null, null],
            "image_angle" : [ true, true, true, null, null],
            "image_alpha" : [ true, true, true, null, null],
            "image_blend" : [ true, true, true, null, null],
            "image_speed": [true, true, true, null, null],
            "in_collision_tree": [true,false,false,null,null],
            "mask_index" : [ true, true, true, null, null],
            "path_index" : [ true, false, false, null, null],
            "path_position" : [ true, true, true, null, null],
            "path_positionprevious" : [ true, true, true, null, null],
            "path_speed" : [ true, true, true, null, null],
            "path_scale" : [ true, true, true, null, null],
            "path_orientation" : [ true, true, true, null, null],
            "path_endaction" : [ true, true, true, null, null],
            "timeline_index" : [ true, true, true, null, null],
            "timeline_position" : [ true, true, true, null, null],
            "timeline_speed" : [ true, true, true, null, null],
            "timeline_running" : [ true, true, true, null, null],
            "timeline_loop" : [ true, true, true, null, null],
            // Physics variables
            "phy_rotation" : [ true, true, true, null, null],
            "phy_position_x" : [  true, true, true, null, null],
            "phy_position_y" : [  true, true, true, null, null],
            "phy_angular_velocity" : [ true, true, true, null, null],
            "phy_linear_velocity_x" : [  true, true, true, null, null],
            "phy_linear_velocity_y" : [  true, true, true, null, null],
            "phy_speed_x" : [  true, true, true, null, null],
            "phy_speed_y" : [  true, true, true, null, null],
            "phy_speed" : [  true, false, true, null, null],
            "phy_angular_damping" : [ true, true, true, null, null],
            "phy_linear_damping" : [ true, true, true, null, null],
            "phy_bullet" : [ true, true, true, null, null],
            "phy_fixed_rotation" : [ true, true, true, null, null],
            "phy_active" : [ true, true, true, null, null],
            // Physics w/o setters
            "phy_mass" : [ true, false, true, null, null],
            "phy_inertia" : [ true, false, true, null, null],
            "phy_com_x" : [ true, false, true, null, null],
            "phy_com_y" : [ true, false, true, null, null],
            "phy_dynamic" : [ true, false, true, null, null],
            "phy_kinematic" : [ true, false, true, null, null],
            "phy_sleeping" : [ true, false, true, null, null],
            "phy_position_xprevious" : [ true, true, true, null, null],
            "phy_position_yprevious" : [ true, true, true, null, null],
            // Physics w/o setters only valid during collision events
            "phy_collision_points" : [ true, false, true, null, null],
            "phy_collision_x" : [ true, false, true, null, null],
            "phy_collision_y" : [ true, false, true, null, null],
            "phy_col_normal_x" : [ true, false, true, null, null],
            "phy_col_normal_y" : [ true, false, true, null, null],
            // zeus only
            "layer": [true, true, true, null, null],
            // internal
            "marked": [false, false, false, null, null],
            "active": [false, false, false, null, null],
            "__type": [false, false, false, null, null],
            "bbox": [false, false, false, null, null],
            "__image_index": [false, false, false, null, null],
            "last_sequence_pos": [false, false, false, null, null],
            "sequence_pos": [false, false, false, null, null],
            "sequence_dir": [false, false, false, null, null],
            "path_xstart": [false, false, false, null, null],
            "path_ystart": [false, false, false, null, null],
            "timeline_paused": [false, false, false, null, null],
            "timeline_looped": [false, false, false, null, null],
            "InstanceIndex": [false, false, false, null, null],
            "Created": [false, false, false, null, null],
            "initcode": [false, false, false, null, null],
            "precise": [false, false, false, null, null],
            "bbox_dirty": [false, false, false, null, null],
            "mouse_over": [false, false, false, null, null],
            "pObject": [false, false, false, null, null],
            "pMasterObject": [false, false, false, null, null],
            "m_physicsObject": [false, false, false, null, null],
            "m_skeletonSprite": [false, false, false, null, null],
            "fOutsideRoom": [false, false, false, null, null],
            "fOwnedBySequence": [false, false, false, null, null],
            "createCounter": [false, false, false, null, null],
            "REvent": [false, false, false, null, null],
            "m_pSkeletonAnimation": [false, false, false, null, null],
            "m_nLayerID": [false, false, false, null, null],
            "m_bOnActiveLayer": [false, false, false, null, null],
        };
*/

// #############################################################################################
/// Function:<summary>
///             Does a variable exist inside the instance
///          </summary>
///
/// In:		 <param name="_pInst">Instance to check</param>
///			 <param name="_var">Variable to look for</param>
/// Out:	 <returns>
///				true of the variable is found... false if not..
///			 </returns>
// #############################################################################################
function variable_instance_get(_id, _var) {

    var pObj;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
            pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    } // end else
    _var = yyGetString(_var);

    var ret = undefined;
    if (pObj != null && pObj.length > 0)
    {    	
        for (var inst = 0; inst < pObj.length; inst++)
        {
            var pInst = pObj[inst];			
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {               
                var settings = undefined;
                if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                    ret = g_instance_names[ g_var2obf[_var] ];
                } else {
                    settings = g_instance_names[ _var ];
                } // end else
                if (settings == undefined) {
                    var nm;
                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                        nm = g_var2obf[_var];
                        if (pInst[ nm ] == undefined) {
                            nm = "gml"+_var;
                        }
                    }
                    else {
                        nm = "gml"+_var;
                    } // end else
                    ret = pInst[ nm ];
                    break;
                }  // end if
                else if (settings[0]) { // are we allowed to get???
                    if (settings[4] != null ) {
                        var f = undefined;
                        if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[4]] != undefined)) {
                            f = pInst[ g_var2obf[settings[4]] ];
                        } else {
                            f = pInst[ settings[4] ];
                        } // end else
                        if (typeof f == 'function') {
                            ret = f.call( pInst );
                            break;
                        } // end if
                    } // end if
                    else {
                        ret = pInst[ _var ];
                        break;
                    } // end else
                } // end if
            } // end if
        } // end for
    } // end if

    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Sets the local variable with the given name (a string) to the given value.
///          </summary>
///
/// In:		<param name="_name"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function variable_instance_set(_id, _var, _val) {

    var pObj;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
        pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    } // end else

    _var = yyGetString(_var);

    var ret = false;
    if (pObj != null && pObj.length > 0)
    {    	
    	for (var inst = 0; inst < pObj.length; inst++)
    	{
			var pInst = pObj[inst];			
			if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {
                var settings = undefined;
                if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                    ret = g_instance_names[g_var2obf[_var]]; //doesn't do anything with ret - not sure what this is supposed to be doing but looks wrong
                } else {
                    settings = g_instance_names[ _var ];
                } // end else
                if (settings == undefined) {

                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                        pInst[ g_var2obf[_var] ] = _val;
                    }
                    else {
                        pInst[ "gml"+_var ] = _val;
                    } // end else
                }  
                else if (settings[1]) { // are we allowed to set???
                    if (settings[3] != null ) {
                        var f = undefined;
                        if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[3]] != undefined)) {
                            f = pInst[ g_var2obf[settings[3]] ];
                        } else {
                            f = pInst[ settings[3] ];
                        } // end else
                        if (typeof f == 'function') {
                            f.call( pInst, _val );
                        } // end if
                    } // end if
                    else {
                        pInst[ _var ] = _val;
                    } // end else
                } // end if
			    return;
			} 
    	}
    }
}

function variable_instance_set_post(_id, _var, _val) {

    var pObj;
    var ret;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
        pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    } // end else

    _var = yyGetString(_var);

    var ret = false;
    if (pObj != null && pObj.length > 0)
    {       
        for (var inst = 0; inst < pObj.length; inst++)
        {
            var pInst = pObj[inst];         
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {
                var settings = undefined;
                if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                    ret = g_instance_names[g_var2obf[_var]]; //doesn't do anything with ret - not sure what this is supposed to be doing but looks wrong
                } else {
                    settings = g_instance_names[ _var ];
                } // end else
                if (settings == undefined) {

                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                        ret = pInst[ g_var2obf[_var] ];
                        pInst[ g_var2obf[_var] ] = _val;
                    }
                    else {
                        ret = pInst[ "gml"+_var ];
                        pInst[ "gml"+_var ] = _val;
                    } // end else
                }  
                else if (settings[1]) { // are we allowed to set???
                    if (settings[3] != null ) {
                        var f = undefined;               
                        var g = undefined;         
                        if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[3]] != undefined)) {
                            f = pInst[ g_var2obf[settings[3]] ];
                        } else {
                            f = pInst[ settings[3] ];
                        } // end else
                        if ((typeof g_var2obf !== "undefined") && (g_var2obf[settings[4]] != undefined)) {
                            g = pInst[ g_var2obf[settings[4]] ];
                        } else {
                            g = pInst[ settings[4] ];
                        } // end else
                        if (g != null) {
                            if (typeof g == 'function') {
                                ret = g.call( pInst );
                            } // end if
                        } // end if
                        if (typeof f == 'function') {
                            f.call( pInst, _val );
                        } // end if
                    } // end if
                    else {
                        ret = pInst[ _var ];
                        pInst[ _var ] = _val;
                    } // end else
                } // end if
                return ret;
            } 
        }
    }
    return ret;
}

// #############################################################################################
/// Function:<summary>
///             Does a variable exist inside the instance
///          </summary>
///
/// In:      <param name="_pInst">Instance to check</param>
///          <param name="_var">Variable to look for</param>
/// Out:     <returns>
///             true of the variable is found... false if not..
///          </returns>
// #############################################################################################
function variable_instance_exists(_id, _var) {

    var pObj;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
            pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    } // end else

    _var = yyGetString(_var);

    var ret = false;
    if (pObj != null && pObj.length > 0)
    {       
        for (var inst = 0; !ret && (inst < pObj.length); inst++)
        {
            var pInst = pObj[inst];         
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {
                var settings = undefined;
                if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                    settings = g_instance_names[ g_var2obf[_var] ];
                } else {
                    settings = g_instance_names[ _var ];
                } // end else
                if (settings == undefined) {
                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                        ret = g_var2obf[_var] in pInst;
                    }
                    else {
                        ret = "gml"+_var in pInst;
                    } // end else
                }  
                else {
                    if (pInst.__yyIsGMLObject) 
                        ret = _var in pInst || "gml"+_var in pInst;
                    else
                        ret = true;
                } // end else
                break;
            } // end if
        }
    }
    return ret;
}

function variable_instance_names_count(_id)
{
    var ret = 0;
    var pObj = null;
    var glob = false;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
        pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj = [global];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else {
            pObj = GetWithArray(_id);
        } // end else
    } // end else

    if (pObj != null && pObj.length > 0) {
        for (var inst = 0; inst < pObj.length; inst++) {
            var pInst = pObj[inst];
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {
                var names = __internal__get_variable_names(pInst, glob);
                return names.length / 2;
            } // end if
        }
    } // end if    
    return ret;
}

// returns an array with two entries for each variable
//  0 - user facing name
//  1 - internal name on the object (should just be able to do _struct[ name ] to get or set the value)
function __internal__get_variable_names( _struct, glob )
{
    var ret = [];

    // NOTE : This function only works with the first instance found 
    // get all the names of the variables that start with gml.
    for (var n in _struct) {
        if (_struct.hasOwnProperty(n)) {
            if (n.startsWith("gml")) {
                ret.push(n.substring(3));
                ret.push(n);
            } // end if
        } // end if
    } // end for

    var props = Object.getOwnPropertyNames(_struct);
    for (var i = 0; i < props.length; i++)
    {
        var prop = props[i];

        // Translate to unobfuscated name (if possible)
        var transname = prop;
        
        if (typeof g_obf2var != "undefined" && g_obf2var.hasOwnProperty(prop)) {
            transname = g_obf2var[prop];
        } // end if

        // Make sure it's not one of the standard instance variable names or global names
        var isBuiltIn = (glob) ? g_global_names[transname] != undefined : g_instance_names[transname] != undefined;
        if (_struct.__yyIsGMLObject) {
            if (transname == "__type") continue;
            if (!isBuiltIn && transname==prop) continue;                        
        } // end if
        else {
            if (isBuiltIn) continue;
            if (transname.startsWith("__")) {
                isBuiltIn = (glob) ? g_global_names[transname.substring(2)] != undefined : g_instance_names[transname.substring(2)] != undefined;                        
                if (isBuiltIn) continue;
            } // end if
            if (!isBuiltIn && transname==prop) continue;
        } // end else

        if (!transname.startsWith("gml")) {
            ret.push(transname);
            ret.push(prop);
        } // end if
    } // end for
    return ret;
} // end __internal__get_variable_names

function variable_instance_get_names( _id ) 
{
    var ret = [];
    var pObj = null;
    var glob = false;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
        pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    }
    if (pObj != null)
    {

        for (var inst = 0; inst < pObj.length; inst++)
        {
            var pInst = pObj[inst];         
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {

                var names = __internal__get_variable_names(pInst, glob);
                for(var n=0; n<names.length; n+=2) {
                    if (names[n] != "constructor")
                        ret.push( names[n] );
                } // end for

                return ret;
            } 
        }
    } // end if    
    return ret;
} // end variable_instance_get_names

function __yy_gml_copy_prototype( _dest, _source)
{
    Object.setPrototypeOf( _dest, _source );
  //for (key in _source) {
  //  if (key === "yy_staticInitialiser") continue;
  //  _dest[key] = _source[key]; // copies each property to the objCopy object
  //}    
}



//variable_struct_exists(id,name)
function variable_struct_exists( _id, _name)
{
    return variable_instance_exists( _id, _name );
}

//variable_struct_set(id,name,val)
function variable_struct_set( _id, _name, _val)
{
    return variable_instance_set( _id, _name, _val);
}

function variable_struct_set_pre( _id, _name, _val)
{
    variable_instance_set( _id, _name, _val);
    return _val;
}

function variable_struct_set_post( _id, _name, _val)
{
    return variable_instance_set_post( _id, _name, _val);
}

//variable_struct_get(id,name)
function variable_struct_get( _id, _name)
{
    return variable_instance_get(_id, _name);
}

//variable_struct_get_names(id)
function variable_struct_get_names( _id )
{
    return variable_instance_get_names( _id );
}

//variable_struct_names_count(id)
function variable_struct_names_count( _id )
{
    return variable_instance_names_count( _id );
}

//variable_struct_remove(id, name)
function variable_struct_remove( _id, _var)
{
    var pObj;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
            pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    } // end else
    _var = yyGetString(_var);

    if (pObj != null && pObj.length > 0)
    {       
        for (var inst = 0; inst < pObj.length; inst++)
        {
            var pInst = pObj[inst];         
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {               

                //var settings = undefined;
                //if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                //    settings = g_instance_names[ g_var2obf[_var] ];
                //} else {
                //    settings = g_instance_names[ _var ];
                //} // end else
                //if (settings == undefined) {
                    var nm;
                    if ((typeof g_var2obf !== "undefined") && (g_var2obf[_var] != undefined)) {
                        nm = g_var2obf[_var];
                    }
                    else {
                        nm = "gml"+_var;
                    } // end else
                    if (Object.prototype.hasOwnProperty.call( pInst, nm)) {
                        delete pInst[ nm ];
                    } // end if
                    else 
                    if (Object.prototype.hasOwnProperty.call( pInst, "gml" + _var)) {
                        delete pInst[ "gml" + _var ];
                    } // end if
                    else 
                    if (Object.prototype.hasOwnProperty.call( pInst, _var)) {
                        delete pInst[ _var ];
                    } // end if
                //}  // end if
            } // end if
        } // end for
    } // end if
}


// struct_exists(id,name)
function struct_exists( _id, _name)
{
    return variable_instance_exists( _id, _name );
} // end struct_exists

// struct_set(id,name,val)
function struct_set( _id, _name, _val)
{
    return variable_instance_set( _id, _name, _val);
} // end struct_set

// struct_get(id,name)
function struct_get( _id, _name)
{
    return variable_instance_get(_id, _name);
} // end struct_get

// struct_get_names(id)
function struct_get_names( _id )
{
    return variable_instance_get_names( _id );
} // end struct_get_names

// struct_names_count(id)
function struct_names_count( _id )
{
    return variable_instance_names_count( _id );
} // end struct_names_count

// struct_remove(id,name)
function struct_remove( _id, _var)
{
    return variable_struct_remove( _id, _var );
} // end struct_remove

// struct_foreach(id, func)
function struct_foreach(_id, _func) {

    _func = getFunction(_func, 1);
    _obj = "boundObject" in _func ? _func.boundObject : {};

    var pObj = null;
    var glob = false;
    if ((typeof _id == "object") && _id.__yyIsGMLObject) {
        pObj = [ _id ];
    } else {
        _id = yyGetInt32(_id);

        if (_id == OBJECT_GLOBAL) {
            pObj =  [ global ];
            global.marked = false;
            global.active = true;
            glob = true;
        }
        else  { 
            pObj = GetWithArray(_id);
        } // end else
    }
    if (pObj != null)
    {

        for (var inst = 0; inst < pObj.length; inst++)
        {
            var pInst = pObj[inst];         
            if (pInst.__yyIsGMLObject || (!pInst.marked && pInst.active)) {

                var names = __internal__get_variable_names(pInst, glob);
                for(var n=0; n<names.length; n+=2) {
                    _func(_obj, _obj, names[n], _id[names[n + 1]]);
                } // end for
            } 
        }
    } // end if    
} // end struct_foreach

// struct_get_from_hash(id, hash) : redirects to 'variable_instance_get'
function struct_get_from_hash( _id, _hash) {
    return variable_instance_get( _id, _hash);
} // end struct_get_from_hash

// struct_set_from_hash(id, hash, val) : redirects to 'variable_instance_set'
function struct_set_from_hash(_id, _hash, _val) {
    return variable_instance_set( _id, _hash, _val);
} // end struct_set_from_hash

// variable_get_hash(name) : pass through
function variable_get_hash(_name) {
    return _name;
} // end variable_get_hash

g_CLONE_VISITED_LIST = new Map();

function __internal_variable_clone(_val, _depth) {

    if (g_CLONE_VISITED_LIST.has(_val)) {
        return g_CLONE_VISITED_LIST.get(_val);
    }

    if (typeof _val === "object") {
        
        // Are we an int64?
        if (_val instanceof Long) {
            return _val;
        }

        // We shouldn't clone anymore (just copy OR use reference)
        if (_depth <= 0) {
            return _val;
        }

        // Are we an array?
        if (_val instanceof Array) {

            var clone = new Array(_val.length);
            g_CLONE_VISITED_LIST.set(_val, clone);

            for (var n = 0; n < _val.length; ++n) {
                clone[n] = __internal_variable_clone(_val[n], _depth - 1);
            } // end for

            return clone;
        } // end if
        // We are a struct

        var clone = new GMLObject();
        g_CLONE_VISITED_LIST.set(_val, clone);

        // Go through all the property in the struct
        for (var name in _val) {

            // Don't clone if it is not a property
            if (!_val.hasOwnProperty(name)) {
                continue;
            }

            // Creat a clone of the member value
            var v = __internal_variable_clone(_val[name], _depth - 1);

            // If it is a function that is bound to self then rebind it to the clone struct
            if ((typeof v == 'function') && v.__yy_userFunction && v.boundObject && (v.boundObject == _val)) {
                v = method( clone, v);
            } // end if

            // Define the property in the new object (proper name and attributes)
            Object.defineProperty( clone, name, { 
                value : v,
                configurable : true,
                writable : true,
                enumerable : true
            });
        }

        return clone;
 
    } // end else

    return _val;
}

// variable_clone( _val, _depth)
function variable_clone(_val, _depth) {

    // By default set depth to 128 (this is the same limit we use for JSON stringify in C++ runner to avoid stack-overflow)
    _depth = arguments.length > 1 ? Math.max(0, yyGetReal(_depth)) : 128;

    var clone = __internal_variable_clone(_val, _depth);
    g_CLONE_VISITED_LIST.clear();

    return clone;
} // end variable_clone

