
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            ds_priority.js
// Created:         20/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Collections used by Game Maker
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 20/02/2011		V1.0        MJD     Simple ds_priority implemented.
// 
// **********************************************************************************************************************


// #############################################################################################
/** @constructor */
function yyPriorityQueue_Save(_depth, _obj) {
	this.sub = _depth;
	this.data = _obj;
}


// #############################################################################################
/// Function:<summary>
///          	Create a new lIST object
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyPriorityQueue_Item(_depth,_obj) 
{
	this.depth = _depth;
	this.m_pObject = _obj;
}



// #############################################################################################
/// Function:<summary>
///          	Creates a new priority queue. The function returns an integer as an id that must 
///				be used in all other functions to access the particular priority queue.
///          </summary>
///
/// Out:	<returns>
///				The ID of a new list
///			</returns>
// #############################################################################################
function ds_priority_create() {
	var list = new yyOList();
	return g_ActivePriorityQueues.Add(list);
}

// #############################################################################################
/// Function:<summary>
///          	Destroys the priority queue with the given id, freeing the memory used. 
///				Don't forget to call this function when you are ready with the structure.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_destroy(_id) 
{
    g_ActivePriorityQueues.DeleteIndex(yyGetInt32(_id));
}


// #############################################################################################
/// Function:<summary>
///          	Clears the priority queue with the given id, removing all data from it but not 
///				destroying it.
///          </summary>
// #############################################################################################
function ds_priority_clear(_id) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid dest priority queue ds_priority_clear()");
		return;
	}
	pQueue.Clear();
}

// #############################################################################################
/// Function:<summary>
///          	Copies the priority queue source into the priority queue with the given id.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_copy(_id, _source) 
{
    _id = yyGetInt32(_id);

    var pDestQueue = g_ActivePriorityQueues.Get(_id);
	if (pDestQueue == null || pDestQueue  == undefined)
	{
		yyError("Error: invalid dest priority queue ds_priority_copy()");
		return;
	}

	var pSrcQueue = g_ActivePriorityQueues.Get(yyGetInt32(_source));
	if (pSrcQueue == null || pSrcQueue == undefined)
	{
		yyError("Error: invalid source priority queue ds_priority_copy()");
		return;
	}

	// COPY list
	pDestQueue.Copy(pSrcQueue);
	g_ActivePriorityQueues.Set(_id, pDestQueue);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of values stored in the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				The number of values stored in the queue
///			</returns>
// #############################################################################################
function ds_priority_size(_id) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_size()");
		return 0;
	}
	return pQueue.length;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the priority queue is empty. This is the same as testing whether 
///				the size is 0.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_empty(_id) {
    if (ds_priority_size(yyGetInt32(_id)) == 0)
        return true;
    else 
        return false;
}


// #############################################################################################
/// Function:<summary>
///          	Adds the value with the given priority to the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_val"></param>
///			<param name="_prio"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_add(_id, _val, _prio) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_add()");
		return;
	}
	var node = new yyPriorityQueue_Item(_prio, _val);
	pQueue.Add(node);
}


// #############################################################################################
/// Function:<summary>
///          	Changes the priority of the given value in the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_val"></param>
///			<param name="_prio"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_change_priority(_id, _val, _prio) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_change_priority()");
		return;
	}

    var i = 0;
	while (i < pQueue.length)
	{
		var pNode = pQueue.Get(i);
		if (pNode != null)
		{
		    var v = pNode.m_pObject;
		    if( typeof(_val)=="number" && typeof(v)=="number"  )
		    {
			    // Find the node....
			    if( g_Precsision > abs(v-_val) )
			    {
				    // Once we find it. Remove it, change its depth, and add it back in.
				    pQueue.Delete(pNode);
				    pNode.depth = _prio;
				    pQueue.Add(pNode);
				    return;
			    }
		    }else{
			    // Find the node....
			    if (v == _val)
			    {
				    // Once we find it. Remove it, change its depth, and add it back in.
				    pQueue.Delete(pNode);
				    pNode.depth = _prio;
				    pQueue.Add(pNode);
				    return;
			    }
			}
		}
		i++;
	}
}


// #############################################################################################
/// Function:<summary>
///          	Returns the priority of the given value in the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_find_priority(_id, _val)
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_find_priority()");
		return undefined;
	}

	var i = 0;
	while (i < pQueue.length)
	{
	    var pNode = pQueue.Get(i);
	    if (pNode != null)
	    {
	        var v = pNode.m_pObject;
	        if (((typeof (_val) == "number") || (_val instanceof Long)) &&
                ((typeof (v) == "number") || (v instanceof Long)))
	        {
	            // Find the node....
	            var realVal = yyGetReal(_val);
	            var realV = yyGetReal(v);
	            if (g_Precsision > abs(realV - realVal)) return pNode.depth;
	        }
	        else
	        {
	            // Find the node....
	            if (v == _val) return pNode.depth;
	        }
	    }
	    i++;
	}
	return undefined;
}


// #############################################################################################
/// Function:<summary>
///          	Deletes the given value (with its priority) from the priority queue
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_delete_value(_id, _val) {
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_delete_value()");
		return;
	}

	var i = 0;
	while (i < pQueue.length)
	{
		var pNode = pQueue.Get(i);
		if (pNode != null)
		{
		    var v = pNode.m_pObject;
		    if( typeof(_val)=="number" && typeof(v)=="number"  )
		    {
			    // Find the node....
		        if (g_Precsision > abs(v - _val)) {
		            pQueue.Delete(pNode);
		            return;
		        }
		    }
            else {
			    // Find the node....
			    if (v == _val) {
			        pQueue.Delete(pNode);
			    }
			}
		}
		i++;
	}
	return;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the value with the smallest priority and deletes it from the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_delete_min(_id) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_delete_min()");
		return;
	}

	if (pQueue.length <= 0) return 0;

	var pNode = pQueue.Get(0);
	pQueue.Delete(pNode);
	return pNode.m_pObject;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the value with the smallest priority but does not delete it from the 
///				priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_find_min(_id) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_find_min()");
		return undefined;
	}

	if (pQueue.length <= 0) return undefined;

	var pNode = pQueue.Get(0);
	return pNode.m_pObject;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the value with the largest priority and deletes it from the priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_delete_max(_id)
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_delete_max()");
		return;
	}

	if (pQueue.length <= 0) return 0;

	var pNode = pQueue.Get(pQueue.length-1);
	pQueue.Delete(pNode);
	return pNode.m_pObject;
}
// #############################################################################################
/// Function:<summary>
///          	Returns the value with the largest priority but does not delete it from the 
///				priority queue.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_find_max(_id) 
{
    var pQueue = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (pQueue == null || pQueue == undefined)
	{
		yyError("Error: invalid priority queue ds_priority_find_max()");
		return undefined;
	}

	if (pQueue.length <= 0) return undefined;

	var pNode = pQueue.Get(pQueue.length - 1);
	return pNode.m_pObject;
}


// #############################################################################################
/// Function:<summary>
///          	Turns the data structure into a string and returns this string. The string can 
///				then be used to e.g. save it to a file. This provides an easy mechanism for 
///				saving data structures.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_write(_id) {
    var list = g_ActivePriorityQueues.Get(yyGetInt32(_id));
	if (list == null)
	{
		yyError("Error: invalid ds_priority ID (ds_priority_write)");
		return "";
	}

	// Copy array into a "save" obfuscation free "type"
	var pri = [];	
	var val = [];
	for (var index = 0; index < list.pool.length; index++)
	{
		var pItem = list.pool[index];
		if (pItem)
		{
		    pri.push(pItem.depth);
		    val.push(pItem.m_pObject);
		}
	}


	var len = list.pool.length;
	var pBuffer = buffer_create(16384, eBuffer_Format_Grow, 1); 
	buffer_write(pBuffer, eBuffer_U32, 503 );
	buffer_write(pBuffer, eBuffer_U32, len );          

    // Write priorities first
	for ( var i=0 ; i<len ; i++ ) 
	{
	    variable_WriteValue(pBuffer,pri[i]);
	}

    // Write values next
	for ( var i=0 ; i<len ; i++ ) 
	{
	    variable_WriteValue(pBuffer,val[i]);
	}


	var st = variable_ConvertToString(pBuffer);
	buffer_delete(pBuffer);
	return st;
}



// #############################################################################################
/// Function:<summary>
///          	Reads the data structure from the given string (as created by the previous call).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_pJSON"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_priority_read(_id, _pJSON) 
{
    _id = yyGetInt32(_id);

	var queue = g_ActivePriorityQueues.Get(_id);
	if (queue == null)
	{
	    yyError("Error: invalid ds_priority ID (ds_priority_read)");
		return false;
	}

	if (_pJSON[0] == "{") {
	    try {
	        var list = JSON.parse(_pJSON);
	        queue.Clear();

	        for (var index = 0; index < list.length; index++) {
	            var pList = list[index];
	            ds_priority_add(_id, pList.data, pList.sub);
	        }
	    } catch (ex) {
	        yyError("Error: reading ds_priority JSON");
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

	    if (id == 502) {
	        version = 3;
	    } else if (id == 503) {
	        version = 0; /* 0 is "current" - parity with C++ implementation. */
	    } else {
	        yyError("Error: unrecognised format - resave the priority list to update/fix issues. (ds_priority_read)");
	        return false;
	    }


	    // Now read the list length and clear the current list
	    var len = buffer_read(pBuffer, eBuffer_S32);
	    ds_priority_clear(_id);

	    // Now read in the list
	    var pri = [];
	    var val = [];
	    for (var i = 0; i < len; i++) {
	        pri[i] = variable_ReadValue(pBuffer, version);
	    }
	    for (var i = 0; i < len; i++) {
	        val[i] = variable_ReadValue(pBuffer, version);
	    }

	    for (var i = 0; i < len; i++) {
	        ds_priority_add(_id, val[i], pri[i]);
	    }
	    buffer_delete(pBuffer);
	}
	return true;
}


