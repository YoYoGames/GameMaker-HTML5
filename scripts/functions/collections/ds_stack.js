
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            ds_stack.js
// Created:         20/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     stack collection used by Game Maker
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 26/05/2011		V1.0        MJD     Simple ds_stack blocked in.
// 21/07/2011		V1.1        MJD     Simple ds_stack implemented.
// 
// **********************************************************************************************************************



// #############################################################################################
/// Function:<summary>
///          	Creates a new stack. The function returns an integer as an id that must be used 
///				in all other functions to access the particular stack. You can create multiple stacks.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_create(){
    var st = [];
    return g_StackCollection.Add( st );            // allocate a new LIST
}



// #############################################################################################
/// Function:<summary>
///          	Destroys the stack with the given id, freeing the memory used. Don't forget to 
///				call this function when you are ready with the structure.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_destroy(_id) {
    g_StackCollection.DeleteIndex(yyGetInt32(_id));
}

// #############################################################################################
/// Function:<summary>
///          	Clears the stack with the given id, removing all data from it but not destroying it.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_clear(_id) {

    _id = yyGetInt32(_id);

	var st = g_StackCollection.Get(_id);
	if (st == null) {
		yyError("Error: invalid ds_stack ID (ds_stack_clear)");
		return;
	}
	st = [];
	g_StackCollection.Set(_id, st);
}

// #############################################################################################
/// Function:<summary>
///          	Copies the stack source into the stack with the given id.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_copy(_id, _source) {

    _id = yyGetInt32(_id);

	var pDest = g_StackCollection.Get(_id);
	if (pDest == null)
	{
		yyError("Error: invalid DEST ds_stack ID (ds_stack_clear)");
		return;
	}
	var pSrc = g_StackCollection.Get(yyGetInt32(_source));
	if (pSrc == null)
	{
		yyError("Error: invalid SOURCE ds_stack ID (ds_stack_clear)");
		return;
	}

	pDest = pSrc.slice();
	g_StackCollection.Set(_id, pDest);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of values stored in the stack.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_size(_id) 
{
    var st = g_StackCollection.Get(yyGetInt32(_id));
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_size)");
		return 0;
	}
	return st.length;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the stack is empty. This is the same as testing whether the size is 0.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_empty(_id) {
    var st = g_StackCollection.Get(yyGetInt32(_id));
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_empty)");
		return true;
	}

	if (st.length == 0) return true; else return false;
}


// #############################################################################################
/// Function:<summary>
///          	Pushes the value on the stack.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_push(_id, _val) {


    var args = arguments;
    var argc = arguments.length;

    var stack = g_StackCollection.Get(yyGetInt32(_id));
    if (!stack) {
        yyError("Error: invalid ds_stack ID (ds_stack_push)");
        return;
    }

    for (var i = 1; i < argc; i++) {
        stack.push( args[i] );
    }
}


// #############################################################################################
/// Function:<summary>
///          	Returns the value on the top of the stack and removes it from the stack.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_pop(_id) {
    var st = g_StackCollection.Get(yyGetInt32(_id));
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_pop)");
		return undefined;
	}

	return st.pop();
}

// #############################################################################################
/// Function:<summary>
///          	Returns the value on the top of the stack but does not remove it from the stack.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_top(_id) 
{
    var st = g_StackCollection.Get(yyGetInt32(_id));
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_pop)");
		return 0;
	}

	return st[st.length-1];
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
function ds_stack_write(_id) {
    var st = g_StackCollection.Get(yyGetInt32(_id));
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_write)");
		return;
	}
   
	var len = st.length;
	var pBuffer = buffer_create(16384, eBuffer_Format_Grow, 1);
	buffer_write(pBuffer, eBuffer_U32, 103);
	buffer_write(pBuffer, eBuffer_U32, len);

	for (var i = 0 ; i < len ; i++) {
	    var val = st[i];
	    variable_WriteValue(pBuffer, val);
	}

	var str = variable_ConvertToString(pBuffer);
	buffer_delete(pBuffer);
	return str;

}


// #############################################################################################
/// Function:<summary>
///          	Reads the data structure from the given string (as created by the previous call).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_str"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_stack_read(_id, _pJSON) {

    _id = yyGetInt32(_id);

	var st = g_StackCollection.Get(_id);
	if (st == null)
	{
		yyError("Error: invalid ds_stack ID (ds_stack_read)");
		return false;
	}

	if (_pJSON[0] == "{") {
	    try {
	        st = JSON.parse(_pJSON);
	        g_StackCollection.Set(_id, st);
	    } catch (ex) {
	        yyError("Error: reading ds_stack JSON.");
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

	    if (id == 102) {
	        version = 3;
	    } else if (id == 103) {
	        version = 0; /* 0 is "current" - parity with C++ implementation. */
	    } else {
	        yyError("Error: unrecognised format - resave the stack to update/fix issues. (ds_stack_read)");
	        return false;
	    }


	    // Now read the list length and clear the current list
	    var len = buffer_read(pBuffer, eBuffer_S32);
	    st = [];
	    g_StackCollection.Set(_id, st);

	    // Now read in the list
	    for (var i = 0; i < len; i++) {
	        var val = variable_ReadValue(pBuffer, version);
	        st.push(val);
	    }

	    buffer_delete(pBuffer);
	}
	return true;
}
                                                
                                                


