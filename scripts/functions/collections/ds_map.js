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

// Convert a JS object into something we can use as a key
function __yy_convert_key( _key )
{
    switch( typeof(_key) ) {
        case "undefined":
        case "number":
        case "string":
        case "boolean":
            break;
        case "object":
            if (_key instanceof Long)
                _key = "__@@YYLong-" + _key.toString();
            else
            if (_key instanceof ArrayBuffer)
                _key = "__@@YYArrayBuffer-" + getABId(_key);
            else
                _key = "__@@YYKey-" + JSON.stringify(_key);
            break;
        case "function":
            _key = "__@@YYKeyFunc-" + _key.name;
            break;
        default:
            yyError( "Illegal key type for ds_map");
            break;
    } // end switch
    return _key;    
} // end __yy_convert_key

function getABId( _key )
{
    for (var l = 0; l < g_BufferStorage.pool.length; l++)
    {
        if (g_BufferStorage.pool[l].m_pRAWUnderlyingBuffer == _key) return l.toString();
    }
    return -1;
}

function getABFromId( _id )
{
    return buffer_get_address( Number.fromString( _id) );
}

// convert a key into a JS object we can return to the user
function __yy_from_key(_key)
{
    if (typeof(_key) === "string" ) {
        if (_key.startsWith("__@@YYKey-")) {
            var json = _key.substring( 10 );
            _key = JSON.parse(json);
        } // end if
        else
        if (_key.startsWith("__@@YYLong-")) {
            var long = _key.substring( 11 );
            _key = Long.fromString(long);
        } // end if
        else
        if (_key.startsWith("__@@YYArrayBuffer-")) {
            var buffer = _key.substring( 18 );
            _key = getABFromId(buffer);
        } // end if
        else
        if (_key.startsWith("__@@YYKeyFunc-")) {
            var funcName = _key.substring( 14 );
            _key = eval(funcName);
        }
    } // end if

    return _key;
} // end __yy_from_key



// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @constructor */
function yy_MapListContainer( _type,_obj ) {

    this.ObjType = _type;
    this.Object = _obj;
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

	var pMap = {};
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
    	var pVar = {};
        g_ActiveMaps.Set( _id, pVar );
    }
}

function ds_map_destroy_children(_pMap) {
    for (var k in _pMap) {
        var v = _pMap[k];
        if (v != null && v.Object !== undefined) switch (v.ObjType) {
            case MAP_TYPE:
                ds_map_destroy(v.Object);
                break;
            case LIST_TYPE:
                ds_list_destroy(v.Object);
                break;
        }
    }
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
		pDest = {};
		for (var v in pSrc)
		{
		    if (pSrc.hasOwnProperty(v)) {
			    pDest[v] = pSrc[v];
			}
		}
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
        var count=0;
        for (var i in pMap) {
                     
            if (pMap.hasOwnProperty(i)) {
                count++;
            }
        }
        return count;
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
        for (var i in pMap) {
            if (pMap.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
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

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) pMap[_key] = _val;
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

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
        // this works better than setting to undefined because it removes the field completely,
        // so hasOwnProperty becomes a reliable indication of whether a pair exists.
        delete pMap[_key];
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

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        return pMap.hasOwnProperty(_key);
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

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        if (pMap.hasOwnProperty(_key)) {
            // yyError("Error: KEY(" + _key + ") already present in ds_map[" + _id + "], you can not add a key twice.");
        } else pMap[_key] = _val;
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

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        pMap[_key] = _val;        
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_set_pre(_id,_key,_val) {

    _key = __yy_convert_key(_key);
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        pMap[_key] = _val;        
    }
    return _val;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function ds_map_set_post(_id,_key,_val) {

    _key = __yy_convert_key(_key);
    var ret = _val;
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if (pMap) {
        ret = pMap[_key];
        pMap[_key] = _val;        
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
    _key = __yy_convert_key(_key);

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        var entry = pMap[ _key ];
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
        for( var a in pMap) {
            if (pMap.hasOwnProperty(a)) {
                var entry = pMap[ a ];
                if (typeof (entry) === "object" && (entry != null) && entry.Object !== undefined) {
                        ret.push( entry.Object );
                } else ret.push(entry);
            } // end if
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
        for( var a in pMap) {
            if (pMap.hasOwnProperty(a)) {
                ret.push( __yy_from_key(a) );
            } // end if
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
    _key = __yy_convert_key(_key);

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        var entry = pMap[ _key ];
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
    _key = __yy_convert_key(_key);

    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    if( pMap){
        var entry = pMap[ _key ];
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

    _key = __yy_convert_key(_key);
	var prev = undefined;
	var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (var item in pMap) {

        if (pMap.hasOwnProperty(item)) {

            if (item == _key) {
                return __yy_from_key(prev);
            }            
            prev = item;
        }
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

    _key = __yy_convert_key(_key);
    var next = false;
    var pMap = g_ActiveMaps.Get(yyGetInt32(_id));
    for (var item in pMap) {
            
        if (pMap.hasOwnProperty(item)) {
        
            if (next) {
                return __yy_from_key(item);
            }        
            if (item == _key) {
                next = true;
            }
        }        
    }
    return undefined;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function CheckString(_key) {

    if (typeof (_key) !== "string") return true;

    var dotcount = 0;
    var l = _key.length;
    for (var i = 0; i < l; i++) {
        if ((_key[i] < '0') || (_key[i] > '9')) {
            return true;
        }
        if (_key[i] == '.') dotcount++;
    }
    if (dotcount > 1) return true;
    return false;
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
    for (var item in pMap) {
            
        if (pMap.hasOwnProperty(item)) {
            return __yy_from_key(item);
        }
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
    for (var item in pMap) {
            
        if (pMap.hasOwnProperty(item)) {
            prev = __yy_from_key(item);
        }
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
	var counter = 0;
	for (var item in pMap) {
	    if (pMap.hasOwnProperty(item)) {
	        counter++;
	    }
	}
	buffer_write(pBuffer, eBuffer_U32, counter);

	for (var key in pMap) {
	    if (pMap.hasOwnProperty(key)) {
	        variable_WriteValue(pBuffer, key);
	        var val = pMap[key];
	        variable_WriteValue(pBuffer, val);
        }
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


