
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyList.js
// Created:         17/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     A basic LIST object for us...
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/02/2011		V1.00		MJD		1st verison
// 14/07/2011		V1.01		MJD		changed functions to use "prototype"
//										removed all "with()" constructs
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
function yyList( ) {
    this.FreeList = [];
    this.pool = [];
    this.packing = false;
    this.length = 0;        // size of the ARRAY
    this.count = 0;         // number of elements IN the array
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
yyList.prototype.Alloc = function() {
    if (this.FreeList.length == 0) {
        return this.pool.length;
    }
    return this.FreeList.pop();


/*    for (var l = 0; l < this.pool.length; l++) {
        if (this.pool[l] == null) return l; 	// Found some space...
    }
    return this.pool.length; 				// add a new one
*/    
};


// #############################################################################################
/// Function:<summary>
///             Add an item to the managers lists
///          </summary>
///
/// In:		 <param name="pObj">Object to add</param>
// #############################################################################################
yyList.prototype.Add = function (_pItem) {
	var index;
	if (this.packing)
	{
		index = this.pool.length;
	} else
	{
		index = this.Alloc();
	}
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
/// In:		 <param name="pObj">Object to add</param>
// #############################################################################################
yyList.prototype.Get = function (_objind) {
	if (_objind < 0 || _objind >= this.pool.length) return null;
	return this.pool[_objind];
};



// #############################################################################################
/// Function:<summary>
///             Find an item in the pool, and return its index
///          </summary>
///
/// In:		 <param name="pObj">Item to remove</param>
// #############################################################################################
yyList.prototype.FindItem = function (_item) {
	for (var l = 0; l < this.pool.length; l++)
	{
		if (this.pool[l] == _item) return l;
	}
};


// #############################################################################################
/// Function:<summary>
///             Delete an item from the pool by searching for it
///          </summary>
///
/// In:		 <param name="pObj">Item to remove</param>
// #############################################################################################
yyList.prototype.DeleteItem = function(_item) 
{
    for (var l = 0; l < this.pool.length; l++) 
    {
        if (this.pool[l] == _item) 
        {
            if (this.packing) 
            {
                this.pool.splice(l, 1);
            } else {
                this.pool[l] = null;
                this.FreeList.push(l);
            }
            this.count--;
            this.length = this.pool.length;
            return true;
        }
    }
    return false;
};



// #############################################################################################
/// Function:<summary>
///             Delete an item from the pool using it's index
///          </summary>
///
/// In:		 <param name="pObj">Items index to remove</param>
// #############################################################################################
yyList.prototype.DeleteIndex = function (_objind) {
	if (_objind < 0 || _objind >= this.pool.length) return false;
	if (this.packing)
	{
		this.pool.splice(_objind, 1);
	} else
	{
		this.pool[_objind] = null;
		this.FreeList.push(_objind);
}
	this.count--;
	this.length = this.pool.length;
	return true;
};

// #############################################################################################
/// Function:<summary>
///             clear the list (just remake it)
///          </summary>
// #############################################################################################
yyList.prototype.Clear = function() 
{
    var pool = this.pool;
    for (var i = 0; i < pool.length; i++) {
        var v = pool[i];
        if (v != null && v.Object !== undefined) switch (v.ObjType) {
            case MAP_TYPE:
                ds_map_destroy(v.Object);
                break;
            case LIST_TYPE:
                ds_list_destroy(v.Object);
                break;
        }
    }
    this.pool = [];
    this.FreeList = [];
    this.count = 0;
    this.length = this.pool.length;
};



// #############################################################################################
/// Function:<summary>
///             insert elements into the array
///          </summary>
// #############################################################################################
yyList.prototype.Insert = function(_index, _val) {
    if (_index < 0 || _index > this.pool.length) return;
    for (var i = 0; i < this.FreeList.length; i++) {
        // adjust free list for newly instered element
        if (this.FreeList[i] >= _index) {
            this.FreeList[i]++;
        }
    }
    this.pool.splice(_index, 0, _val);
    this.count++;
    this.length = this.pool.length;

};


// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyList.prototype.Set = function (_index, _val) {
	if (_index < 0 || _index >= this.pool.length) return;
	this.pool[_index] = _val;
};

// #############################################################################################
/// Function:<summary>
///             Replaces a value at the provided index (throw if out-pf-bounds)
///          </summary>
// #############################################################################################
yyList.prototype.Replace = function (_index, _val) {
	if (_index < 0 || _index >= this.pool.length) {
        yyError("ds_list_replace :: Trying to access an out-of-bounds index [| " + _index + "]");
        return;
    }
	this.pool[_index] = _val;
};

// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyList.prototype._Set = function (_index, _val) {
    if (_index < 0) {
        yyError( "index is negative " + _index );
        return _val;
    } // end if
	if (_index >= this.pool.length) {
	
	    var l = this.pool.length;
	    while( _index >= l ) {
	        this.Add( 0 );
	        ++l;
	    } // end while
	    
	} // end if
	
	var ret = this.pool[_index];
    this.pool[_index] = _val;
    return ret;
};

// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyList.prototype.Sort = function(_assend) {
    if (_assend) {
        this.pool.sort(function(a, b) { return a - b; });
    } else {
        this.pool.sort(function(a, b) { return b - a; });
    }
    
    // rebuild freelist
    this.FreeList = [];
    for (var i = 0; i < this.pool.length; i++) {
        if (this.pool[i] == null || this.pool[i] == undefined) {
            this.FreeList.push(i);
        }
    }
};


// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyList.prototype.Randomize = function () {
	this.pool.sort(function () { return 0.5 - Math.random(); });
};

// #############################################################################################
/// Function:<summary>
///             Sets a value at the provided index
///          </summary>
// #############################################################################################
yyList.prototype.Shuffle = function () {


     var currentIndex = this.pool.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.pool[currentIndex];
        this.pool[currentIndex] = this.pool[randomIndex];
        this.pool[randomIndex] = temporaryValue;
      }




	//this.pool.sort(function () { return 0.5 - Math.random(); });
};



// #############################################################################################
/// Function: <summary>
///           	Copy a list into here.
///           </summary>
// #############################################################################################
yyList.prototype.Copy = function (_src) {
	this.pool = _src.pool.slice();
	this.FreeList = _src.FreeList.slice();
	this.packing = _src.packing;
	this.length = _src.length;
	this.count = _src.count;         
};

