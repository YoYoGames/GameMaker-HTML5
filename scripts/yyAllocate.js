// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyAllocate.js
// Created:			15/07/2011
// Author:			Mike
// Project:			GameMaker HTML5
// Description:		A list which does fast allocation of a slot in an array using a stack for free entries.
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 15/07/2011		V1.0		MJD		1st version
//
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///				Allocate an slot
///          </summary>
///
/// In:		<param name="_initalCount">Number of slots to pre-allocate</param>
/// Out:	<returns>
///				the new class
///			</returns>
// #############################################################################################
/** @constructor */
function yyAllocate( _initalCount )
{
	var args = arguments;
	var argc = arguments.length;

	this.pool = [];
	this.stack = [];		// allocation stack
    this.length = 0;        // size of the ARRAY
    this.count = 0;         // number of elements IN the array

    if (argc > 0)
    {
    	for (var i = 0; i < argc; i++)
    	{
    		this.pool[i] = null;
    		this.stack.push(i);
    	}
    }
}


// #############################################################################################
/// Function:<summary>
///             Allocate an slot
///          </summary>
///
/// Out:	 <returns>
///				An object index
///			 </returns>
// #############################################################################################
yyAllocate.prototype.Alloc = function () 
{
	var n;
	if (this.stack.length === 0)
	{
		n = this.pool.length; // get new index
		this.pool[n] = null;
		return n;
	}

	return this.stack.pop();
};


// #############################################################################################
/// Function:<summary>
///             Add an item to the managers lists
///          </summary>
///
/// In:		 <param name="pObj">Object to add</param>
// #############################################################################################
yyAllocate.prototype.Add = function (_pItem) 
{
	var index = this.Alloc();
	this.pool[index] = _pItem;
	this.count++;
	this.length = this.pool.length;
	return index;
};


// #############################################################################################
/// Function:<summary>
///             Get the item from the pool
///          </summary>
///
/// In:		 <param name="_objind">Object index to return</param>
/// Out:	 <returns>
///				The object, or NULL if not found
///			 </returns>
// #############################################################################################
yyAllocate.prototype.Get =  function (_objind) 
{
	var pVar = null;
	if(_objind >= 0 && _objind < this.pool.length)
	{
		pVar = this.pool[_objind];
	}
	if( pVar === undefined ) pVar = null;
	return pVar;
};



// #############################################################################################
/// Function:<summary>
///             Find an item in the pool, and return its index
///          </summary>
///
/// In:		 <param name="pObj">Item to remove</param>
// #############################################################################################
yyAllocate.prototype.FindItem = function (_item) 
{
	for (var l = 0; l < this.pool.length; l++)
	{
		if (this.pool[l] == _item) return l;
	}
	return -1;
};


// #############################################################################################
/// Function:<summary>
///             Delete an item from the pool by searching for it
///          </summary>
///
/// In:		 <param name="pObj">Item to remove</param>
// #############################################################################################
yyAllocate.prototype.DeleteItem = function (_item) {
	var index = this.FindItem(_item);
	if (index < 0) return;

	this.pool[index] = null;
	this.stack.push(index);
	this.count--;
};



// #############################################################################################
/// Function:<summary>
///             Delete an item from the pool using it's index
///          </summary>
///
/// In:		 <param name="pObj">Items index to remove</param>
// #############################################################################################
yyAllocate.prototype.DeleteIndex = function (_objind) {
	if (_objind < 0 || _objind >= this.pool.length) return;

	this.pool[_objind] = null;
	this.stack.push(_objind);
	this.count--;
};

// #############################################################################################
/// Function:<summary>
///             clear the list (just remake it)
///          </summary>
// #############################################################################################
yyAllocate.prototype.Clear = function () {
	this.pool = [];
	this.stack = [];
	this.count = 0;
	this.length = this.pool.length;
};


// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyAllocate.prototype.Set = function (_index, _val) {
	if (_index < 0 || _index >= this.pool.length) return;
	this.pool[_index] = _val;
};


