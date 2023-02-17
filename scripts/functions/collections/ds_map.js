// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            ds_map.js
// Created:         20/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Collections used by Game Maker
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 20/02/2011		V1.0        MJD     ds_map blocked in.
// 23/07/2011		V1.1        MJD     Simple ds_map implemented.
// 
// **********************************************************************************************************************
var MAP_TYPE = 1,
    LIST_TYPE = 2;

function UniqueId(){
}

UniqueId.prototype._id = 0;
UniqueId.prototype.generateId = function(){
    return (++UniqueId.prototype._id).toString();
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @constructor */
function yy_MapListContainer( _type,_obj ) {

    this.ObjType = _type;
    this.Object = _obj;
}

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
const hasOwnProperty = Object.prototype.hasOwnProperty;

// Hashes a string
const YYHASH_hash = (string) => {

    let hash = 0;

    string = string.toString();

    for(let i = 0; i < string.length; i++)
    {
        hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
    }

    return hash;
};

// Deep hashes an object
const YYHASH_object = (obj) => {
    //
    if(typeof obj.getTime == 'function')
    {
        return obj.getTime();
    }

    // get all the property keys here
    let props = [];
    for(let property in obj)
    {
        if(hasOwnProperty.call(obj, property))
        {
            props.push( property );
        }
    }
    props.sort(); // sort them all

    // calculate the hash
    let result = 0;
    for(let property in props)
    {
        result += YYHASH_hash(property + YYHASH_value(obj[property]));
    }

    return result;
};

const YYHASH_value = (value) => {

    const type = value == undefined ? undefined : typeof value;
    // Does a type check on the passed in value and calls the appropriate hash method
    return YYHASH_MAPPER[type] ? YYHASH_MAPPER[type](value) + YYHASH_hash(type) : 0;
};

const YYHASH_MAPPER =
{
    string: YYHASH_hash,
    number: YYHASH_hash,
    boolean: YYHASH_hash,
    object: YYHASH_object
    // functions are excluded because they are not representative of the state of an object
    // types 'undefined' or 'null' will have a hash of 0
};
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------


function yy_getHash( _v )
{
    var ret = _v;
    switch( typeof(_v) ) {
    case "object":
        if (_v.id !== undefined) {
            ret = _v.id;
        } // end if
        else {
            // lets convert 
            ret = YYHASH_value(_v);
        } // end else
        break;
    default:
        break;
    } // end switch
    return ret;
}

// #############################################################################################
/// Function:<summary>
///             Creates a new map. The function returns an integer as an id that must be used in 
///             all other functions to access the particular map.
///          </summary>
///
/// Out:	 <returns>
///				ID of the map
///			 </returns>
// #############################################################################################
function ds_map_create() {

	var pMap = new Map();
	var id = g_ActiveMaps.Add( pMap );
	return id;
}


// #############################################################################################
/// Function:<summary>
///             Destroys the map with the given id, freeing the memory used. Don't forget to call 
///             this function when you are ready with the structure.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_destroy(_id) {

    _id = yyGetInt32(_id);

    var pMap = g_ActiveMaps.Get( _id );
    if (pMap) {
        ds_map_destroy_children(pMap);
        g_ActiveMaps.DeleteIndex(_id);
    }
}


// #############################################################################################
/// Function:<summary>
///             Clears the map with the given id, removing all data from it but not destroying it
///          </summary>
///
/// In:		 <param name="_id">MAP ID to clear</param>
///				
// #############################################################################################
function ds_map_clear(_id) {

    _id = yyGetInt32(_id);

	var pMap = g_ActiveMaps.Get( _id );
    if (pMap) {
        ds_map_destroy_children(pMap);
    }
}

function ds_map_destroy_children(_pMap) {
    _pMap.forEach( function( v, key, _pMap) {
        if (v != null && v.Object !== undefined) 
            switch (v.ObjType) {
            case MAP_TYPE:
                ds_map_destroy(v.Object);
                break;
            case LIST_TYPE:
                ds_list_destroy(v.Object);
                break;
            } // end switch
    });
    _pMap.clear();
    if (_pMap.originalKeys)
        _pMap.originalKeys.clear();
}

// #############################################################################################
/// Function:<summary>
///              Copies the map source into the map with the given id.
///          </summary>
///
/// In:		 <param name="_dest">Dest</param>
///			 <param name="_source">Source to copy from</param>
///				
// #############################################################################################
function ds_map_copy(_dest,_source) {

    _dest = yyGetInt32(_dest);

	var pDest = g_ActiveMaps.Get(_dest);
	var pSrc = g_ActiveMaps.Get(yyGetInt32(_source));
	if (pDest && pSrc)
	{
		pDest = new Map();
        pSrc.forEach( function(v, key, pSrc) {
			 pDest.set( key, v);
		});
        g_ActiveMaps.Set(_dest, pDest);
    }
}


// #############################################################################################
/// Function:<summary>
///             Returns the number of key-value pairs stored in the map.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_size(_id) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap) {
        return pMap.size;
    }
    return 0;
}


// #############################################################################################
/// Function:<summary>
///             Returns whether the map is empty. This is the same as testing whether the size is 0.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_empty(_id) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap) {
        return pMap.size == 0;
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Replaces the value corresponding with the key with a new value.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_replace(_id, _key, _val) {

    _key = yy_getHash(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) pMap.set(_key, _val);
}
function ds_map_replace_map(_id, _key, _val) {
    ds_map_replace(_id, _key, new yy_MapListContainer(MAP_TYPE, _val));
}
function ds_map_replace_list(_id, _key, _val) {
    ds_map_replace(_id, _key, new yy_MapListContainer(LIST_TYPE, _val));
}


// #############################################################################################
/// Function:<summary>
///             Deletes the key and the corresponding value from the map. 
///             (If there are multiple entries with the same key, only one is removed.)
///             Our only allow 1 value per key.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_delete(_id, _key) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        _key = yy_getHash(_key);
        pMap.delete( _key );
        if (pMap.originalKeys && pMap.originalKeys.has(_key))
            pMap.originalKeys.delete(_key);
    }
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the key exists in the map.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_exists(_id, _key) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        _key = yy_getHash(_key);
        return pMap.has(_key);
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///             Adds the key-value pair to the map.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_add(_id,_key,_val) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        var origKey = _key;
        _key = yy_getHash(_key);
        if (_key !== origKey) {
            if (pMap.originalKeys == undefined) {
                pMap.originalKeys = new Map();
            } // end if
            pMap.originalKeys.set( _key, origKey );
        } // end if
        pMap.set( _key, _val)
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_add_map(_id, _key, _val) {

    ds_map_add(yyGetInt32(_id), _key, new yy_MapListContainer(MAP_TYPE, _val));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_add_list(_id, _key, _val) {

    ds_map_add(yyGetInt32(_id), _key, new yy_MapListContainer(LIST_TYPE, _val));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_set(_id,_key,_val) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        var origKey = _key;
        _key = yy_getHash(_key);
        if (_key !== origKey) {
            if (pMap.originalKeys == undefined) {
                pMap.originalKeys = new Map();
            } // end if
            pMap.originalKeys.set( _key, origKey );
        } // end if
        pMap.set( _key, _val );
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_set_pre(_id,_key,_val) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        var origKey = _key;
        _key = yy_getHash(_key);
        if (_key !== origKey) {
            if (pMap.originalKeys == undefined) {
                pMap.originalKeys = new Map();
            } // end if
            pMap.originalKeys.set( _key, origKey );
        } // end if
        pMap.set( _key, _val );;        
    }
    return _val;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_set_post(_id,_key,_val) {

    var ret = _val;
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        var origKey = _key;
        _key = yy_getHash(_key);
        if (_key !== origKey) {
            if (pMap.originalKeys == undefined) {
                pMap.originalKeys = new Map();
            } // end if
            pMap.originalKeys.set( _key, origKey );
        } // end if
        ret = pMap.get(_key);
        pMap.set( _key, _val );
    }
    return ret;
}


// #############################################################################################
/// Function:<summary>
///             Returns the value corresponding to the key. 
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_find_value(_id, _key) {
    if (Number.isNaN(_key)) return undefined;
    if ((_id == undefined) || Number.isNaN(_id)) {
        yyError("Error: " + _id + " is not a valid map reference");
        return undefined;
    }
    //_key = __yy_convert_key(_key);

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        _key = yy_getHash(_key);
        var entry = pMap.get( _key );
        if (typeof (entry) === "object" && (entry != null) && entry.Object !== undefined) {
            return entry.Object;
        } else return entry;
    }
    return undefined;
}

function ds_map_values_to_array(_id, _array) {
    if ((_id == undefined) || Number.isNaN(_id)) {
        yyError("Error: " + _id + " is not a valid map reference");
        return undefined;
    }

    var ret;
    if (arguments.length >= 2) {
        ret = _array;
    } // end if
    else {
        ret = [];
    } // end else

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        for( const [a, entry] of pMap) {
            if (typeof (entry) === "object" && (entry != null) && entry.Object !== undefined) {
                    ret.push( entry.Object );
            } else ret.push(entry);
        } // end for
    } // end if

    return ret;
}

function ds_map_keys_to_array(_id, _array) {
    if ((_id == undefined) || Number.isNaN(_id)) {
        yyError("Error: " + _id + " is not a valid map reference");
        return undefined;
    }

    var ret;
    if (arguments.length >= 2) {
        ret = _array;
    } // end if
    else {
        ret = [];
    } // end else

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        for( const [key, a] of pMap) {
            var v = key;
            if (pMap.originalKeys && pMap.originalKeys.has(key))
                v = pMap.originalKeys.get(key);
            ret.push( v );
        } // end for
    } // end if

    return ret;
}

function ds_map_is_map(_id, _key) {
    if (Number.isNaN(_key)) return undefined;
    if ((_id == undefined) || Number.isNaN(_id)) {
        yyError("Error: " + _id + " is not a valid map reference");
        return undefined;
    }

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        _key = yy_getHash(_key);
        var entry = pMap.get( _key );
        if (typeof (entry) === "object" && (entry != null) && entry.Object !== undefined) {
            return entry.ObjType === MAP_TYPE;
        } else return false;
    }
    return undefined;
}

function ds_map_is_list(_id, _key) {
    if (Number.isNaN(_key)) return undefined;
    if ((_id == undefined) || Number.isNaN(_id)) {
        yyError("Error: " + _id + " is not a valid map reference");
        return undefined;
    }

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        _key = yy_getHash(_key);
        var entry = pMap.get( _key );
        if (typeof (entry) === "object" && (entry != null) && entry.Object !== undefined) {
            return entry.ObjType === LIST_TYPE;
        } else return false;
    }
    return undefined;
}


// #############################################################################################
/// Function:<summary>
///             Returns the largest key in the map smaller than the indicated key. 
///             (Note that the key is returned, not the value. You can use the previous routine 
///             to find the value.)
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_find_previous(_id,_key) {

    _key = yy_getHash(_key);
	var prev = undefined;
	var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (const[ key, item]  of pMap) {
        if (key == _key) {
            return prev;
        }            
        prev = key;
    }
    return undefined;
}

// #############################################################################################
/// Function:<summary>
///             Returns the smallest key in the map larger than the indicated key.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_key"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_find_next(_id,_key) {

    _key = yy_getHash(_key);
    var next = false;
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (const [key, item] of pMap) {            
        if (next) {
            return key;
        }        
        if (key == _key) {
            next = true;
        }
    }
    return undefined;
}

// #############################################################################################
/// Function:<summary>
///             Returns the smallest key in the map.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_find_first(_id) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (const [key, item] of pMap) {            
        return key;
    }
    return undefined;
}


// #############################################################################################
/// Function:<summary>
///             Returns the largest key in the map. 
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_find_last(_id) {

    var prev = undefined;
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (const [key, item] of pMap) {
        prev = key;
    }
    return prev;
}

// #############################################################################################
/// Function:<summary>
///             Turns the data structure into a string and returns this string. 
///             The string can then be used to e.g. save it to a file. 
///             This provides an easy mechanism for saving data structures.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_write(_id) {

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap == null)
	{
        yyError("Error: invalid ds_map ID (ds_map_write)");
		return "";
	}

	var pBuffer = buffer_create(16384, eBuffer_Format_Grow, 1);
	buffer_write(pBuffer, eBuffer_U32, 403);

    // first count them....
	var counter = pMap.size;
	buffer_write(pBuffer, eBuffer_U32, counter);

	for (const [key, val] of pMap) {
        var k = key;
        if (pMap.originalKeys && pMap.originalKeys.has(key))
            k = pMap.originalKeys.get(key);
        variable_WriteValue(pBuffer, k);
        var v = val;
        if (typeof (val) === "object" && (val != null) && val.Object !== undefined) 
            v = val.Object;
        variable_WriteValue(pBuffer, v);
	}
	var st = variable_ConvertToString(pBuffer);
	buffer_delete(pBuffer);
	return st;
}

// #############################################################################################
/// Function:<summary>
///             Reads the data structure from the given string (as created by the previous call).
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_pJSON"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function ds_map_read(_id, _pJSON) {

    _id = yyGetInt32(_id);

	var pMap = g_ActiveMaps.Get(_id);
	if(pMap == null)
	{
	    yyError("Error: invalid ds_map ID (ds_map_read)");
		return false;
	}
	
    // is it the C++ format?
	if (_pJSON[0] == "{")
	{
	    try {
	        if (null != _pJSON) {
	            pMap = JSON.parse(_pJSON);
	            g_ActiveMaps.Set(_id, pMap);
	        } else {
	            g_ActiveMaps.Set(_id, '');
	        }
	    } catch (ex) {
	        yyError("Error: reading ds_map JSON.");
	        return false;
	    }
	}else{
		ds_map_clear(_id);

	    // use Native format
		var pBuffer = variable_ConvertFromString(_pJSON);
		if (pBuffer < 0) return false;

	    // Move to start of buffer for stream
		buffer_seek(pBuffer, eBuffer_Start, 0);

	    // Get version, make sure it's a supported one
		var id = buffer_read(pBuffer, eBuffer_S32);
		var version;

		if (id == 402) {
		    version = 3;
		} else if (id == 403) {
		    version = 0; /* 0 is "current" - parity with C++ implementation. */
		} else {
		    yyError("Error: unrecognised format - resave the map to update/fix issues. (ds_map_read)");
		    return false;
		}

		var count = buffer_read(pBuffer, eBuffer_S32);

		while (count > 0) {
		    var key = variable_ReadValue(pBuffer, version);
		    var value = variable_ReadValue(pBuffer, version);
		    ds_map_add(_id, key, value);
		    count--;
		}
		buffer_delete(pBuffer);
	}
	return true;
}

// #############################################################################################
/// Function:<summary>
///             Saves the contents of the ds_map to the filename given as securely as possible
///          </summary>
// #############################################################################################
function ds_map_secure_save(_id, _filename) {

    // Don't do anything if a non-valid filename has been provided
    if (_filename != null) {

        // Get some kind of UDID
        var udid = getEncryptedUDID();

        // Turn the map provided into json data
        var json = json_encode(yyGetInt32(_id));

        // base64 encode the json data
        var jsonData = base64_encode(json);
        
        SaveTextFile_Block(yyGetString(_filename), udid + jsonData);
    }
}

// #############################################################################################
/// Function:<summary>
///             Loads the contents of a filename to a new ds_map
///          </summary>
// #############################################################################################
function ds_map_secure_load_buffer(_buffer)
{
    return -1;
}
function ds_map_secure_save_buffer(_map,_buffer)
{
    return -1;
}
function ds_map_secure_load(_filename) {
        
    var retMap = -1;
    try {
        var udidEncoded = getEncryptedUDID();

        var data = LoadTextFile_Block(yyGetString(_filename), true);
        var udidData = data.substring(0, udidEncoded.length);
        var jsonData = data.substring(udidEncoded.length, data.length);

        if (udidData == udidEncoded) {

            var json = base64_decode(jsonData);
            return json_decode(json);
        }
    }
    catch (e) {
        debug(e.message);
    }
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Should theoretically provide a UDID for the machine but won't in normal use
///          </summary>
// #############################################################################################
function getDeviceIdentifier() {

    // JS doesn't provide a generic way to get UDID and any attempts to store a hand generated one are easily hackable
    // (e.g. extend JS for app to dump all localSettings to an email...) so I'm just going to lob this one across 
    // and if platforms such as Tizen and Windows8 can overload it with a genuine UDID then good
    var id = 0xF35065da3bb79cac7;
    return id.toString();
}

// #############################################################################################
/// Function:<summary>
///             Gets a UDID in some sort of encrypted form
///          </summary>
// #############################################################################################
function getEncryptedUDID() {

    // Just doubly sha1 the UDID reversed
    var udid = getDeviceIdentifier();    
    var udidSha1 = sha1_string_utf8(udid.split("").reverse().join(""));
    return sha1_string_utf8(udidSha1);
}


