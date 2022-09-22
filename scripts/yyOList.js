
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyOList.js
// Created:         17/02/2011
// Author:          Mike
// Project:		    HTML5
// Description:     An ordered list of Instances for the room rendering system.
//					Based on smallest, to largest.
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/02/2011		V1.0        MJD     Taken from yyList
// 20/07/2011		V1.1		MJD		Added Clear()
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Allocate an slot
///          </summary>
///
/// Out:	 <returns>
///				An object index
///			 </returns>
// #############################################################################################
/**@constructor*/
function yyOList( )
{
    this.pool = [];
    this.length = 0;        // size of the ARRAY
    this.count = 0;         // number of elements IN the array
    this.unsorted = -1;		// start of unsorted section....
}

// #############################################################################################
/// Function:<summary>
///             Add an item to the managers lists
///          </summary>
///
/// In:		 <param name="_pInst">Instance to add</param>
// #############################################################################################
yyOList.prototype.Get = function (_index) {
	return this.pool[_index];
};

// #############################################################################################
/// Function:<summary>
///             Add an item to the managers lists
///          </summary>
///
/// In:		 <param name="_pInst">Instance to add</param>
// #############################################################################################
yyOList.prototype.Add = function (_pItem) {
		for (var i = 0; i < this.pool.length; i++)
		{
			if (_pItem.depth < this.pool[i].depth)
			{
				this.pool.splice(i, 0, _pItem);
				this.count++;
				this.length = this.pool.length;
				return i;
			}
		}
		// Add to END of list
		this.pool[this.pool.length] = _pItem;
		this.count++;
		this.length = this.pool.length;
		return this.length - 1;
};


// #############################################################################################
/// Function:<summary>
///             Add an item into the "unsorted" section of the order list.
///          </summary>
///
/// In:		 <param name="_pInst">Instance to add</param>
// #############################################################################################
yyOList.prototype.AddUnsorted = function (_pItem) {
	if (this.unsorted < 0)
	{
		this.unsorted = this.pool.length;
	}
	this.pool[this.pool.length] = _pItem;
	this.count++;
	this.length = this.pool.length;
	return this.length - 1;
};



// #############################################################################################
/// Function:<summary>
///             Sorts the "unordered" section, into the main pack.
///          </summary>
///
/// In:		 <param name="_pInst">Instance to add</param>
// #############################################################################################
yyOList.prototype.Sort = function (_pItem) {

	var i = this.unsorted;
	if (i < 0) return;

	var list = [];
	while (i < this.pool.length)
	{
		list[list.length] = this.pool[i];
		i++;
	}
	this.pool.splice(this.unsorted, this.pool.length - this.unsorted);


	// Now "instert" them all properly....
	for (i = 0; i < list.length; i++)
	{
		this.Add(list[i]);
	}
	this.unsorted = -1;
};

// #############################################################################################
/// Function:<summary>
///             Delete an item from the list
///          </summary>
///
/// In:		 <param name="_pInst">Instance to add</param>
// #############################################################################################
yyOList.prototype.Delete = function (_pItem) {
	for (var i = 0; i < this.pool.length; i++)
	{
		// As long as the list is sorted before a delete happens (as instances are marked), 
		// we dont need to updated "unsorted" list "start" point.
		if (_pItem == this.pool[i])
		{
			this.pool.splice(i, 1);
			this.count--;
			this.length = this.pool.length;
			return true;
		}
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///             Clear/Reset the list
///          </summary>
// #############################################################################################
yyOList.prototype.Clear = function () 
{
	this.pool = [];
	this.length = this.count = 0;
};



// #############################################################################################
/// Function:<summary>
///             Get an item
///          </summary>
// #############################################################################################
yyOList.prototype.Get = function (_index) {
	return this.pool[_index];
};


yyOList.prototype.FindItem = function (_pItem) {
    for (var i = 0; i < this.pool.length; i++) {
        if (_pItem == this.pool[i]) {
            return i;
        }
    }
    return -1;
};



// #############################################################################################
/// Function: <summary>
///           	Copy a list into here.
///           </summary>
// #############################################################################################
yyOList.prototype.Copy = function (_src) {
	this.pool = _src.pool.slice();
	this.length = _src.length;
	this.count = _src.count;
	this.unsorted = _src.unsorted;
};

