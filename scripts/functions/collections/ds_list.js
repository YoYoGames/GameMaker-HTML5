
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            ds_list.js
// Created:         20/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Collections used by Game Maker
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 20/02/2011		V1.0        MJD     Simple ds_list implemented.
// 21/07/2011		V1.1		MJD		ds_list finished (read+write added)
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Create a new LIST
///          </summary>
/// Out:	 <returns>
///				returns the ID/Index of the list
///			 </returns>
// #############################################################################################
function    ds_list_create()
{
    var l = new yyList();
    l.packing = true;
    return g_ListCollection.Add( l );            // allocate a new LIST
}


// #############################################################################################
/// Function:<summary>
///             Destroy the list at the given index
///          </summary>
///
/// In:		 <param name="_id">id/index to delete</param>
// #############################################################################################
function ds_list_destroy( _id )
{
    _id = yyGetInt32(_id);

    var pList = g_ListCollection.Get(_id);
    if (pList) {
        pList.Clear();
        g_ListCollection.DeleteIndex(_id);
    }
}

// #############################################################################################
/// Function:<summary>
///             Clear the list
///          </summary>
///
/// In:		 <param name="_id">id/index to delete</param>
// #############################################################################################
function ds_list_clear(_id) {
    var list = g_ListCollection.Get(yyGetInt32(_id));
	if (list)
	{
		list.Clear();
		return;
	}
	yyError("Error: invalid ds_list ID (ds_list_clear)");
}

// #############################################################################################
/// Function:<summary>
///          	Copy a list from one list into another
///          </summary>
///
/// In:		<param name="_id">DEST of copy</param>
///			<param name="_source">SRC to copy from</param>
///				
// #############################################################################################
function ds_list_copy(_id, _source) {

    _id = yyGetInt32(_id);

	var pDest = g_ListCollection.Get(_id);
	if(!pDest)
	{
		yyError("Error: invalid DEST ds_list ID (ds_list_copy)");
		return;
	}

	var pSrc = g_ListCollection.Get(yyGetInt32(_source));
	if(!pSrc)
	{
		yyError("Error: invalid SOURCE ds_list ID (ds_list_copy)");
		return;
	}


	pDest.Copy(pSrc);
	g_ListCollection.Set(_id, pDest);
}

// #############################################################################################
/// Function:<summary>
///             Get the size of the list
///          </summary>
///
/// In:		 <param name="_id">id/index to delete</param>
// #############################################################################################
function ds_list_size(_id) {
    var list = g_ListCollection.Get(yyGetInt32(_id));
	if (list ) return list.length;
	//yyError("Error: invalid ds_list ID (ds_list_size)");
	return 0;
}

// #############################################################################################
/// Function:<summary>
///             Is list empty?
///          </summary>
///
/// In:		 <param name="_id">id/index to delete</param>
// #############################################################################################
function ds_list_empty(_id) {
    var list = g_ListCollection.Get(yyGetInt32(_id));
	if (list )
	{
		if (list.length !== 0) return false; else return true;
	}
	yyError("Error: invalid ds_list ID (ds_list_empty)");
	return true;
}


// #############################################################################################
/// Function:<summary>
///             Add an entry to the END of the list
///         </summary>
///
/// In:     <param name="_id">id/index to delete</param>
///         <param name="_val">value to add</param>
// #############################################################################################
function    ds_list_add() { 

    var args = arguments;
    var argc = arguments.length;

    var list = g_ListCollection.Get( args[0] );
    if (!list) {
        yyError("Error: invalid ds_list ID (ds_list_add)");
        return;
    }
    
    for (var i = 1; i < argc; i++) {
        list.Add( args[i] );
    }
    return ;
}




function ds_list_add_map(_id, _val) {
    return ds_list_add(yyGetInt32(_id), new yy_MapListContainer(MAP_TYPE, _val));
}

function ds_list_add_list(_id, _val) {
    return ds_list_add(yyGetInt32(_id), new yy_MapListContainer(LIST_TYPE, _val));
}

function    ds_list_set( _id, _index, _val )
{
    if (isNaN(_index)) yyError( "Error: index must be a number");
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        list._Set(yyGetInt32(_index), _val);
    }
    else {
	    yyError("Error: invalid ds_list ID (ds_list_set)");
	} // end else
}

function    ds_list_set_pre( _id, _index, _val )
{
    if (isNaN(_index)) yyError( "Error: index must be a number");
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        list._Set(yyGetInt32(_index), _val);
    } else {
	    yyError("Error: invalid ds_list ID (ds_list_set)");
	} // end else
	return _val;
}

function    ds_list_set_post( _id, _index, _val )
{
    if (isNaN(_index)) yyError( "Error: index must be a number");
    var ret = _val;
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        ret = list._Set(yyGetInt32(_index), _val);
    }
    else {
	    yyError("Error: invalid ds_list ID (ds_list_set)");
	} // end else
	return ret;
}
// #############################################################################################
/// Function:<summary>
///             Add an entry to the END of the list
///         </summary>
///
/// In:     <param name="_id">id/index to delete</param>
///         <param name="_val">value to add</param>
// #############################################################################################
function    ds_list_insert( _id, _pos, _val )
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        return list.Insert(yyGetInt32(_pos), _val);
    }
    yyError("Error: invalid ds_list ID (ds_list_insert)");
    return -1;
}


function ds_list_insert_map(_id, _pos, _val) {
    return ds_list_insert(yyGetInt32(_id), yyGetInt32(_pos), new yy_MapListContainer(MAP_TYPE, _val));
}

function ds_list_insert_list(_id, _pos, _val) {
    return ds_list_insert(yyGetInt32(_id), yyGetInt32(_pos), new yy_MapListContainer(LIST_TYPE, _val));
}

// #############################################################################################
/// Function:<summary>
///             Replace an entry
///          </summary>
///
/// In:     <param name="_id">id/index to delete</param>
///         <param name="_pos">position to change</param>
///         <param name="_val">value to add</param>
// #############################################################################################
function    ds_list_replace(_id,_pos,_val)
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        return list.Replace(yyGetInt32(_pos), _val);
    }
    yyError("Error: invalid ds_list ID (ds_list_replace)");
    return -1;
}



// #############################################################################################
/// Function:<summary>
///             delete an entry
///          </summary>
///
/// In:     <param name="_id">id/index to delete</param>
///         <param name="_pos">position to delete</param>
// #############################################################################################
function    ds_list_delete(_id,_pos)
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        return list.DeleteIndex(yyGetInt32(_pos));
    }
}


// #############################################################################################
/// Function:<summary>
///             Find an entry
///          </summary>
///
/// In:		 <param name="_id">id/index to delete</param>
///         <param name="_val">value to locate</param>
// #############################################################################################
function    ds_list_find_index(_id,_val)
{
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if (list) {
        var ret = -1;
        for (var l = 0; l < list.pool.length; l++) {
            var a = list.pool[l];
            if (((typeof (a) == "object") && (a.Object == _val)) || (a==_val)) {
                ret = l;
                break;
            }
        } 
        return ret;
    }
    yyError("Error: invalid ds_list ID (ds_list_find_index)");
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Find an entry
///          </summary>
///
/// In:     <param name="_id">id/index to delete</param>
///         <param name="_pos">position to delete</param>
// #############################################################################################
function    ds_list_find_value(_id,_pos)
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var v,
        pos = Round(_pos),
	    list = g_ListCollection.Get(Round(yyGetInt32(_id)));
	    
    if (list) {
        // out-of-bounds reads faithfully yield undefined on JS,
        // which is exactly what we need for consistent behaviour.
        v = list.pool[pos];
        if (typeof (v) === "object" && v.Object !== undefined) {
            return v.Object;
        } else return v;
    }
    yyError("Error: invalid ds_list ID (ds_list_find_value)");
    return undefined;
}

function    ds_list_is_list(_id,_pos)
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var v,
        pos = Round(_pos),
        list = g_ListCollection.Get(Round(yyGetInt32(_id)));
        
    if (list) {
        // out-of-bounds reads faithfully yield undefined on JS,
        // which is exactly what we need for consistent behaviour.
        v = list.pool[pos];
        if (typeof (v) === "object" && v.Object !== undefined) {
            return v.ObjType == LIST_TYPE;
        } else return false;
    }
    yyError("Error: invalid ds_list ID (ds_list_find_value)");
    return undefined;
}

function    ds_list_is_map(_id,_pos)
{
    if (isNaN(_pos)) yyError( "Error: index must be a number");
    var v,
        pos = Round(_pos),
        list = g_ListCollection.Get(Round(yyGetInt32(_id)));
        
    if (list) {
        // out-of-bounds reads faithfully yield undefined on JS,
        // which is exactly what we need for consistent behaviour.
        v = list.pool[pos];
        if (typeof (v) === "object" && v.Object !== undefined) {
            return v.ObjType == MAP_TYPE;
        } else return false;
    }
    yyError("Error: invalid ds_list ID (ds_list_find_value)");
    return undefined;
}

// #############################################################################################
/// Function:<summary>
///             Sorts the values in the list according to their size, ascending or descending
///          </summary>
// #############################################################################################
function    ds_list_sort(_id,_ascend)
{
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
        // Turns out that Array.sort will outright ignore undefined values,
        // https://tc39.github.io/ecma262/#sec-array.prototype.sort
        // whether there's any worth at making them be sorted correctly is a mystery.
        var mult = yyGetBool(_ascend) ? 1 : -1;
        list.pool.sort(function(a, b) {
            return yyCompareVal(a, b, g_GMLMathEpsilon) * mult;
        });
        return 0;
    }
    yyError("Error: invalid ds_list ID (ds_list_sort)");
    return 0;
}

// #############################################################################################
/// Function:<summary>
///             Shuffle a list
///          </summary>
///
/// In:		 <param name="_id">id/index to shuffle</param>
// #############################################################################################
function    ds_list_shuffle(_id)
{
    var list = g_ListCollection.Get(yyGetInt32(_id));
    if( list ){
    	list.Shuffle();
    	return 0;
    }
	yyError("Error: invalid ds_list ID (ds_list_shuffle)");
    return 0;
}




// #############################################################################################
/// Function:<summary>
///              Turns the data structure into a string and returns this string
///          </summary>
///
/// In:		 <param name="_id">list index</param>
/// Out:	 <returns>
///				the list as a string.
///			 </returns>
// #############################################################################################
function ds_list_write( _id )
{
    _id = yyGetInt32(_id);

	var list = g_ListCollection.Get(_id);
	if(!list)
	{
		yyError("Error: invalid ds_list ID (ds_list_write)");
		return "";
	}

    // Old method
    //return JSON.stringify(list.pool);

	var len = list.length;
	var pBuffer = buffer_create(16384, eBuffer_Format_Grow, 1); 
	buffer_write(pBuffer, eBuffer_U32, 303 );
	buffer_write(pBuffer, eBuffer_U32, len );          

	for ( var i=0 ; i<len ; i++ ) 
	{
	    var val = ds_list_find_value(_id,i);
	    variable_WriteValue(pBuffer,val);
	}

	var st = variable_ConvertToString(pBuffer);
	buffer_delete(pBuffer);
	return st;
}

// #############################################################################################
/// Function:<summary>
///             Reads the data structure from the given string (as created by ds_list_write() ).
///          </summary>
///
/// In:		 <param name="_id">list index</param>
///			 <param name="_pJSON">string to use to create the list</param>
///				
// #############################################################################################
function ds_list_read(_id, _pJSON) 
{
    if (_pJSON === undefined || _pJSON == "") {
        return false;
    }

    _id = yyGetInt32(_id);

    var list = g_ListCollection.Get(_id);
	if (!list)
	{
		yyError("Error: invalid ds_list ID (ds_list_read)");
		return false;
	}

    // old JSON format?
	if (_pJSON[0] == "{") {
	    try {
	        var pList = JSON.parse(_pJSON);
	        list.pool = pList;
	        list.length = pList.length;			// when "packing", both are the same
	        list.count = pList.length;
	    } catch (err) {
	        yyError("Error: reading ds_list file.");
	        return false;
	    }
	} else {
	    // use Native format
	    var pBuffer = variable_ConvertFromString(_pJSON);
	    if (pBuffer < 0) return false;

	    // Move to start of buffer for stream
	    buffer_seek(pBuffer, eBuffer_Start, 0);

	    // Get version, make sure it's a supported one
	    var id = buffer_read(pBuffer, eBuffer_S32);
	    var version;

	    if (id == 302) {
	        version = 3;
	    } else if (id == 303) {
	        version = 0; /* 0 is "current" - parity with C++ implementation. */
	    } else {
	        yyError("Error: unrecognised format - resave the list to update/fix issues. (ds_list_read)");
	        return false;
	    }


	    // Now read the list length and clear the current list
	    var len = buffer_read(pBuffer, eBuffer_S32);
	    list.Clear();

        // Now read in the list
	    for (var i = 0; i < len; i++) {
	        var val = variable_ReadValue(pBuffer, version);
	        ds_list_add(_id, val);
	    }

	    buffer_delete(pBuffer);
	}
	return true;
}

function ds_list_mark_as_map( _id, _pos )
{
    _id = yyGetInt32(_id);
    _pos = yyGetInt32(_pos);

    var val = ds_list_find_value( _id, _pos );
    if( val != undefined )
    {
        ds_list_replace( _id, _pos, new yy_MapListContainer(MAP_TYPE, val));
    }
}

function ds_list_mark_as_list(_id, _pos )
{
    _id = yyGetInt32(_id);
    _pos = yyGetInt32(_pos);

    var val = ds_list_find_value( _id, _pos );
    if( val != undefined )
    {
        ds_list_replace( _id, _pos, new yy_MapListContainer(LIST_TYPE, val));
    }
}



