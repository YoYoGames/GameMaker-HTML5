// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            ds_grid.js
// Created:         20/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Collections used by Game Maker
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 20/02/2011		V1.0        MJD     Simple ds_grid implemented.
// 20/07/2011		V1.1		MJD		All but 3 functions completed and tested.
// 
// **********************************************************************************************************************


var g_Grid_min,
	g_Grid_max,
	g_Grid_value,
	g_Grid_mean,
	g_Grid_value_exists,
	g_Grid_value_x,
	g_Grid_value_y;

// #############################################################################################
/// Function:<summary>
///          	Sets the precision used for comparisons. (data structures)
///          </summary>
// #############################################################################################
function ds_set_precision(_prec)
{
    g_Precsision = yyGetReal(_prec);
}



// #############################################################################################
/// Function:<summary>
///          	Simple struct to allow us to save the grid.
///          </summary>
// #############################################################################################
/** @constructor */
function yySaveGrid(){ 
	this.width=0;
	this.height=0;
	this.body=[];
}



// #############################################################################################
/// Function:<summary>
///          	Create a new grid object
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyGrid(_w, _h) 
{
	this.m_pGrid = [];
	this.m_Width = _w;
	this.m_Height = _h;
	var t=_w*_h;
	for (var i = 0; i < t; i++)
	{
		this.m_pGrid[i] = 0;
	}
}
// #############################################################################################
/// Property: <summary>
///           	Copy the grid
///           </summary>
// #############################################################################################
yyGrid.prototype.Copy = function (_src) {
	this.m_Width = _src.m_Width;
	this.m_Height = _src.m_Height;
	this.m_pGrid = _src.m_pGrid.slice();
};


// #############################################################################################
/// Function:<summary>
///          	Creates a new grid with the indicated width and height. The function returns an 
///				integer as an id that must be used in all other functions to access the particular grid.
///          </summary>
///
/// In:		<param name="_w">Width of grid</param>
///			<param name="_h">Height of grid</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_create(_w, _h) {

    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

	if (_w < 0 || _h < 0){
		yyError("Error: Invalid ds_grid size: (" + _w + "," + _h + ")");
	}
	var pGrid = new yyGrid(_w, _h);
	var id = g_ActiveGrids.Add(pGrid);
	return id;
}


// #############################################################################################
/// Function:<summary>
///          	Destroys the grid with the given id, freeing the memory used. Don't forget to 
///				call this function when you are ready with the structure.
///          </summary>
///
/// In:		<param name="_id">index to delete</param>
///				
// #############################################################################################
function ds_grid_destroy(_id) {
	g_ActiveGrids.DeleteIndex(yyGetInt32(_id));
}

// #############################################################################################
/// Function:<summary>
///          	 Copies the grid source into the grid with the given id.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_copy(_id, _source) {
	var pDestGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if(!pDestGrid )
	{
		yyError("Error: invalid dest ds_grid(copy)");
		return;
	}

	var pSrcGrid = g_ActiveGrids.Get(yyGetInt32(_source));
	if (!pSrcGrid )
	{
		yyError("Error: invalid source ds_grid(copy)");
		return;
	}

	pDestGrid.Copy(pSrcGrid);
}


// #############################################################################################
/// Function:<summary>
///          	Resizes the grid to the new width and height. Existing cells keep their original 
///				value.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_resize(_id, _w, _h) {

    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);
    _id = yyGetInt32(_id);

	if (_w < 0 || _h < 0)
	{
		yyError("Error: Can't resize grid to ("+string(_w)+","+string(_h)+")");
		return;
	}

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid )
	{
		yyError("Error: invalid dest ds_grid(copy)");
		return;
	}

	var pGrid2 = new yyGrid(_w, _h);
	var i = g_ActiveGrids.Add(pGrid2);

	// COPY grid
	ds_grid_set_grid_region(i, _id, 0, 0, pGrid.m_Width - 1, pGrid.m_Height - 1, 0, 0);
	
	// Now remove the temp ID, and copy the grid over...
	g_ActiveGrids.DeleteIndex(i);
	g_ActiveGrids.Set(_id, pGrid2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the width of the grid with the indicated id.
///          </summary>
///
/// In:		<param name="_id">Grid ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_width(_id) {
	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if (!pGrid )
	{
		yyError("Error: invalid ds_grid ID (ds_grid_width)");
		return;
	}
	return pGrid.m_Width;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the height of the grid with the indicated id.
///          </summary>
///
/// In:		<param name="_id">Grid ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_height(_id) {
	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if (!pGrid )
	{
		yyError("Error: invalid ds_grid ID (ds_grid_height)");
		return;
	}
	return pGrid.m_Height;
}


// #############################################################################################
/// Function:<summary>
///          	Clears the grid with the given id, to the indicated value (can both be a number or a string).
///          </summary>
///
/// In:		<param name="_id">Grid ID</param>
/// In:		<param name="_val">value to fill with</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_clear(_id,_val) {
	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if (!pGrid )
	{
		yyError("Error: invalid ds_grid ID (ds_grid_height)");
		return;
	}
	for (var i = 0; i < pGrid.m_pGrid.length; i++)
	{
		pGrid.m_pGrid[i] = _val;
	}
}



// #############################################################################################
/// Function:<summary>
///          	Sets the indicated cell in the grid with the given id, to the indicated value 
///				(can both be a number or a string).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var ds_grid_set = ds_grid_set_DEBUG;
function ds_grid_set_DEBUG(_id, _x, _y, _val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid) 
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set)");
		return;
	}
	if (_x < 0 || _x >= pGrid.m_Width || _y < 0 || _y >= pGrid.m_Height) 
	{
		yyError("Error: grid out of bounds(set) - GridID: " + _id + "  size[" + pGrid.m_Width + "," + pGrid.m_Height + "]  at  (" + _x + "," + _y + ")");
		return;
	}
	pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
}

function ds_grid_set_RELEASE(_id, _x, _y, _val) 
{
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
    if ((_x < 0) || (_x >= pGrid.m_Width) || 
        (_y < 0) || (_y >= pGrid.m_Height))
    {
        return;   
    }
    pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
}

var ds_grid_set_pre = ds_grid_set_pre_DEBUG;
function ds_grid_set_pre_DEBUG(_id, _x, _y, _val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid) 
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set)");
		return _val;
	}
	if (_x < 0 || _x >= pGrid.m_Width || _y < 0 || _y >= pGrid.m_Height) 
	{
		yyError("Error: grid out of bounds(set) - GridID: " + _id + "  size[" + pGrid.m_Width + "," + pGrid.m_Height + "]  at  (" + _x + "," + _y + ")");
		return _val;
	}
	pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
	return _val;
}

function ds_grid_set_pre_RELEASE(_id, _x, _y, _val) 
{
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
    if ((_x < 0) || (_x >= pGrid.m_Width) || 
        (_y < 0) || (_y >= pGrid.m_Height))
    {
        return _val;   
    }
    pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
    return _val;
}

var ds_grid_set_post = ds_grid_set_post_DEBUG;
function ds_grid_set_post_DEBUG(_id, _x, _y, _val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid) 
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set)");
		return _val;
	}
	if (_x < 0 || _x >= pGrid.m_Width || _y < 0 || _y >= pGrid.m_Height) 
	{
		yyError("Error: grid out of bounds(set) - GridID: " + _id + "  size[" + pGrid.m_Width + "," + pGrid.m_Height + "]  at  (" + _x + "," + _y + ")");
		return _val;
	}
	var ret = pGrid.m_pGrid[_x + (_y * pGrid.m_Width)];
	pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
	return ret;
}

function ds_grid_set_post_RELEASE(_id, _x, _y, _val) 
{
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
    if ((_x < 0) || (_x >= pGrid.m_Width) || 
        (_y < 0) || (_y >= pGrid.m_Height))
    {
        return _val;   
    }
	var ret = pGrid.m_pGrid[_x + (_y * pGrid.m_Width)];
    pGrid.m_pGrid[_x + (_y * pGrid.m_Width)] = _val;
    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Add the value to the indicated cell in the grid with the given id. For strings 
//				this corresponds to concatenation.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_add(_id, _x, _y, _val) {

    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

    var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_add)");
		return;
	}
	if (_x < 0 || _x >= pGrid.m_Width || _y < 0 || _y >= pGrid.m_Height)
	{
		yyError("Error: grid out of bounds(ds_grid_add): " + _id + " (" + _x + "," + _y + ")");
		return;
	}
	
	var index = _x + (_y * pGrid.m_Width);	
	var destVal = pGrid.m_pGrid[index];
	var destType = typeof(destVal);
	var incomingType = typeof(_val);

	// They are same type and either a number/string (ADD)
	if (destType == incomingType && (destType == "number" || destType == "string")) 
	{
		pGrid.m_pGrid[index] += _val;
	}
	// Either is an object (SET)
	else if (destType != "object" || incomingType != "object")
	{
		pGrid.m_pGrid[index] = _val;
	}
	// Neither is a string cast them (ADD)
	else if (destType != "string" && incomingType != "string")
	{
		pGrid.m_pGrid[index] = yyGetReal(destVal) + yyGetReal(_val);
	}
	// Else replace the current value (SET)
	else pGrid.m_pGrid[index] = _val;
}


// #############################################################################################
/// Function:<summary>
///          	Multiplies the value to the indicated cell in the grid with the given id. 
///				Is only valid for numbers.
///          </summary>
///
/// In:		<param name="id"></param>
///			<param name="x"></param>
///			<param name="y"></param>
///			<param name="val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function    ds_grid_multiply(_id,_x,_y,_val) {

    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);

    var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_multiply)");
		return;
	}
	if (_x < 0 || _x >= pGrid.m_Width || _y < 0 || _y >= pGrid.m_Height)
	{
		yyError("Error: grid out of bounds(ds_grid_multiply): " + _id + " (" + _x + "," + _y + ")");
		return;
	}
	
	var index = _x + (_y * pGrid.m_Width);
	var destVal = pGrid.m_pGrid[index];
	var destType = typeof(destVal);

	// If either are a string (IGNORE)
	if (typeof(_val) == "string" || destType == "string") return; 
	
	// Cast both elements to real and multiply
	pGrid.m_pGrid[index] = yyGetReal(destVal) * yyGetReal(_val);
}

// #############################################################################################
/// Function:<summary>
///          	Sets the all cells in the region in the grid with the given id, to the indicated 
///				value (can both be a number or a string).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_set_region(_id, _x1, _y1, _x2, _y2, _val) 
{
    _id = yyGetInt32(_id);
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);

	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}

	var pGrid = g_ActiveGrids.Get(_id);
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_region)");
		return;
	}

	// Now actually loop through and do the "set"
	var yMin = yymax(0, yymin(_y1, _y2));
	var yMax = yymin(pGrid.m_Height - 1, yymax(_y1, _y2));
	var xMin = yymax(0, yymin(_x1, _x2));
	var xMax = yymin(pGrid.m_Width - 1, yymax(_x1, _x2));
	for (var y = yMin; y <= yMax; y++)
	{
		for (var x = xMin; x <= xMax; x++)
		{
			var index = (y * pGrid.m_Width)+x;
			pGrid.m_pGrid[index] = _val;
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Add the value to the cell in the region in the grid with the given id. 
///				For strings this corresponds to concatenation.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_add_region(_id, _x1, _y1, _x2, _y2, _val) {

    _id = yyGetInt32(_id);
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);

	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_add_region)");
		return;
	}
	if ((_x1 < 0 || _x1 >= pGrid.m_Width || _y1 < 0 || _y1 >= pGrid.m_Height) || (_x2 < 0 || _x2 >= pGrid.m_Width || _y2 < 0 || _y2 >= pGrid.m_Height))
	{
		yyError("Error: region out of bounds(ds_grid_add_region): " + _id);
	}


	// Now actually loop through and do the "set"
	for (var y = _y1; y <= _y2; y++)
	{
		var index = (y * pGrid.m_Width) + _x1;
		for (var x = _x1; x <= _x2; x++)
		{
			var destVal = pGrid.m_pGrid[index];
			var destType = typeof(destVal);
			var incomingType = typeof(_val);

			// They are same type and either a number/string (ADD)
			if (destType == incomingType && (destType == "number" || destType == "string")) 
			{
				pGrid.m_pGrid[index] += _val;
			}
			// Either is an object (SET)
			else if (destType != "object" || incomingType != "object")
			{
				pGrid.m_pGrid[index] = _val;
			}
			// Neither is a string cast them (ADD)
			else if (destType != "string" && incomingType != "string")
			{
				pGrid.m_pGrid[index] = yyGetReal(destVal) + yyGetReal(_val);
			}
			// Else replace the current value (SET)
			else pGrid.m_pGrid[index] = _val;

			index++;
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Multiplies the value to the cells in the region in the grid with the given id. 
///				Is only valid for numbers.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_multiply_region(_id, _x1, _y1, _x2, _y2, _val) {

    _id = yyGetInt32(_id);
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);

	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}

	var pGrid = g_ActiveGrids.Get(_id);
	if (pGrid == null || pGrid == undefined)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_multiply_region)");
		return;
	}
	if ((_x1 < 0 || _x1 >= pGrid.m_Width || _y1 < 0 || _y1 >= pGrid.m_Height) || (_x2 < 0 || _x2 >= pGrid.m_Width || _y2 < 0 || _y2 >= pGrid.m_Height))
	{
		yyError("Error: region out of bounds(ds_grid_multiply_region): " + _id);
	}


	// Now actually loop through and do the "set"
	for (var y = _y1; y <= _y2; y++)
	{
		var index = (y * pGrid.m_Width) + _x1;
		for (var x = _x1; x <= _x2; x++)
		{	
			var destVal = pGrid.m_pGrid[index];
			var destType = typeof(destVal);

			// If either are a string (IGNORE)
			if (typeof(_val) == "string" || destType == "string") continue; 
			
			// Cast both elements to real and multiply
			pGrid.m_pGrid[index] = yyGetReal(destVal) * yyGetReal(_val);

			index++;
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Sets all cells in the disk with center (xm,ym) and radius r. 
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_set_disk(_id,_x,_y,_r,_val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _r = yyGetReal(_r);

	var pGrid = g_ActiveGrids.Get(_id);
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_disk)");
		return;
	}

	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var i = 0;
	var j = 0;

	x1 = ~ ~(yymax(0.0, Math.floor(_x - _r)));
	x2 = ~ ~(yymin(pGrid.m_Width - 1, Math.ceil(_x + _r)));
	y1 = ~ ~(yymax(0, Math.floor(_y - _r)));
	y2 = ~ ~(yymin(pGrid.m_Height - 1, Math.ceil(_y + _r)));

	_r = _r*_r;
	var w = pGrid.m_Width;
	for ( i=x1 ; i<=x2 ; i++ )
	{
		var ix = (i-_x)*(i-_x);
		for ( j=y1 ; j<=y2 ; j++ )
		{
			var jy = j-_y;
			if ( ix+(jy*jy) <= _r )
			{
				if (i >= 0 && i < pGrid.m_Width && j >= 0 && j < pGrid.m_Height)
				{
					pGrid.m_pGrid[i + (j*w)] = _val;
				}				
			}
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Add the value to all cells in the disk with center (xm,ym) and radius r. 
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_add_disk(_id,_x,_y,_r,_val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _r = yyGetReal(_r);

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_disk)");
		return;
	}

	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var i = 0;
	var j = 0;

	x1 = ~ ~(yymax(0.0, Math.floor(_x - _r)));
	x2 = ~ ~(yymin(pGrid.m_Width - 1, Math.ceil(_x + _r)));
	y1 = ~ ~(yymax(0, Math.floor(_y - _r)));
	y2 = ~ ~(yymin(pGrid.m_Height - 1, Math.ceil(_y + _r)));

	_r = _r * _r;
	var w = pGrid.m_Width;
	for (i = x1; i <= x2; i++)
	{
		var ix = (i - _x) * (i - _x);
		for (j = y1; j <= y2; j++)
		{
			var jy = j - _y;
			if (ix + (jy * jy) <= _r)
			{
				if (i >= 0 && i < pGrid.m_Width && j >= 0 && j < pGrid.m_Height)
				{
					var index = i + (j * w);		
					var destVal = pGrid.m_pGrid[index];
					var destType = typeof(destVal);
					var incomingType = typeof(_val);

					// They are same type and either a number/string (ADD)
					if (destType == incomingType && (destType == "number" || destType == "string")) 
					{
						pGrid.m_pGrid[index] += _val;
					}
					// Either is an object (SET)
					else if (destType != "object" || incomingType != "object")
					{
						pGrid.m_pGrid[index] = _val;
					}
					// Neither is a string cast them (ADD)
					else if (destType != "string" && incomingType != "string")
					{
						pGrid.m_pGrid[index] = yyGetReal(destVal) + yyGetReal(_val);
					}
					// Else replace the current value (SET)
					else pGrid.m_pGrid[index] = _val;
				}				
			}
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Add the value to all cells in the disk with center (xm,ym) and radius r. 
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_multiply_disk(_id,_x,_y,_r,_val) 
{
    _id = yyGetInt32(_id);
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _r = yyGetReal(_r);

	var pGrid = g_ActiveGrids.Get(_id);
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_disk)");
		return;
	}

	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var i = 0;
	var j = 0;

	x1 = ~ ~(yymax(0.0, Math.floor(_x - _r)));
	x2 = ~ ~(yymin(pGrid.m_Width - 1, Math.ceil(_x + _r)));
	y1 = ~ ~(yymax(0, Math.floor(_y - _r)));
	y2 = ~ ~(yymin(pGrid.m_Height - 1, Math.ceil(_y + _r)));

	_r = _r * _r;
	var w = pGrid.m_Width;
	for (i = x1; i <= x2; i++)
	{
		var ix = (i - _x) * (i - _x);
		for (j = y1; j <= y2; j++)
		{
			var jy = j - _y;
			if (ix + (jy * jy) <= _r)
			{
				if (i >= 0 && i < pGrid.m_Width && j >= 0 && j < pGrid.m_Height)
				{
					var index = i + (j * w);		
					var destVal = pGrid.m_pGrid[index];
					var destType = typeof(destVal);
		
					// If either are a string (IGNORE)
					if (typeof(_val) == "string" || destType == "string") continue; 
					
					// Cast both elements to real and multiply
					pGrid.m_pGrid[index] = yyGetReal(destVal) * yyGetReal(_val);
				}				
			}
		}
	}
}



// #############################################################################################
/// Function:<summary>
///          	Common code for region copy
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_xpos"></param>
///			<param name="_ypos"></param>
///			<param name="_call"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_set_grid_region_Common(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos,_call) 
{
    _id = yyGetInt32(_id);
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);
    _xpos = yyGetInt32(_xpos);
    _ypos = yyGetInt32(_ypos);

	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}

	var pSrcGrid = g_ActiveGrids.Get(_source);
	if(!pSrcGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_grid_region)");
		return;
	}
	var pDestGrid = g_ActiveGrids.Get(_id);
	if(!pDestGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_grid_region)");
		return;
	}


	var si = _x1 + (pSrcGrid.m_Width * _y1);
	var di = _xpos + (pDestGrid.m_Width * _ypos);


	// Now actually loop through and do the "copy"
	if (si >= di) {
	    for (var y = _y1; y <= _y2; y++) {
	        var tempxpos = _xpos;
	        var index = (y * pSrcGrid.m_Width) + _x1;
	        for (var x = _x1; x <= _x2; x++) {
	            if ((x >= 0 && x < pSrcGrid.m_Width && y >= 0 && y < pSrcGrid.m_Height) && (tempxpos >= 0 && tempxpos < pDestGrid.m_Width && _ypos >= 0 && _ypos < pDestGrid.m_Height)) {
	                _call(pDestGrid, (tempxpos + (_ypos * pDestGrid.m_Width)), pSrcGrid, index);
	            }
	            index++;
	            tempxpos++;
	        }
	        _ypos++;
	    }
	} else {
	    _ypos += _y2 - _y1;
	    _xpos += _x2 - _x1;
	    for (var y = _y2; y >= _y1; y--) {
	        var tempxpos = _xpos;
	        var index = (y * pSrcGrid.m_Width) + _x2;
	        for (var x = _x2; x >= _x1; x--) {
	            if ((x >= 0 && x < pSrcGrid.m_Width && y >= 0 && y < pSrcGrid.m_Height) && (tempxpos >= 0 && tempxpos < pDestGrid.m_Width && _ypos >= 0 && _ypos < pDestGrid.m_Height)) {
	                _call(pDestGrid, (tempxpos + (_ypos * pDestGrid.m_Width)), pSrcGrid, index);
	            }
	            index--;
	            tempxpos--;
	        }
	        _ypos--;
	    }

	}
}

// #############################################################################################
/// Function:<summary>
///          	Copies the contents of the cells in the region in grid source to grid id. 
///				xpos and ypos indicate the place where the region must be placed in the grid. 
///				(Can also be used to copy values from one place in a grid to another.)
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_xpos"></param>
///			<param name="_ypos"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_set_grid_region(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos) 
{
	ds_grid_set_grid_region_Common(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos,
		function myfunction(_pDestGrid, _destindex, _pGrid, _index) {
			_pDestGrid.m_pGrid[_destindex] = _pGrid.m_pGrid[_index];
		}
	);
}

// #############################################################################################
/// Function:<summary>
///          	SCopies the contents of the cells in the region in grid source to grid id. 
///				xpos and ypos indicate the place where the region must be placed in the grid. 
///				(Can also be used to copy values from one place in a grid to another.)
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_xpos"></param>
///			<param name="_ypos"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_add_grid_region(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos ) 
{
	ds_grid_set_grid_region_Common(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos,
		function myfunction(_pDestGrid, _destindex, _pGrid, _index) {

			var destVal = _pDestGrid.m_pGrid[_destindex];
			var destType = typeof(destVal);
			var incomingValue = _pGrid.m_pGrid[_index];
			var incomingType = typeof(incomingValue);

			// They are same type and either a number/string (ADD)
			if (destType == incomingType && (destType == "number" || destType == "string")) 
			{
				_pDestGrid.m_pGrid[_destindex] += incomingValue;
			}
			// Either is an object (SET)
			else if (destType != "object" || incomingType != "object")
			{
				_pDestGrid.m_pGrid[_destindex] = incomingValue;
			}
			// Neither is a string cast them (ADD)
			else if (destType != "string" && incomingType != "string")
			{
				_pDestGrid.m_pGrid[_destindex] = yyGetReal(destVal) + yyGetReal(incomingValue);
			}
			// Else replace the current value (SET)
			else _pDestGrid.m_pGrid[_destindex] = incomingValue;
		});
}

// #############################################################################################
/// Function:<summary>
///          	Multiplies the contents of the cells in the region in grid source to grid id. 
///				xpos and ypos indicate the place where the region must be multiplied in the grid. 
///				(id and source can be the same.) Only valid for numbers.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_source"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_xpos"></param>
///			<param name="_ypos"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_multiply_grid_region(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos, _val) {
	ds_grid_set_grid_region_Common(_id, _source, _x1, _y1, _x2, _y2, _xpos, _ypos,
		function myfunction(_pDestGrid, _destindex, _pGrid, _index) {

			var destVal = _pDestGrid.m_pGrid[_destindex];
			var incomingValue = _pGrid.m_pGrid[_index];

			// They are same type and strings ignore
			if (typeof(destVal) == "string" || typeof(incomingValue) == "string") return;

			// Cast both to reals and perform multiplication
			_pDestGrid.m_pGrid[_destindex] = yyGetReal(destVal) * yyGetReal(incomingValue);
		});
}

// #############################################################################################
/// Function:<summary>
///          	Returns the value of the indicated cell in the grid with the given id.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var ds_grid_get = ds_grid_get_DEBUG;
function    ds_grid_get_DEBUG(_id,_x,_y)
{
    _id = yyGetInt32(_id);

	var pGrid = g_ActiveGrids.Get(_id),
	    x = yyGetInt32(_x),
        y = yyGetInt32(_y);
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_get)");
		return undefined;
	}    
    
	if (x < 0 || x >= pGrid.m_Width || y < 0 || y >= pGrid.m_Height)
	{
		yyError("Error: grid out of bounds(get) - GridID: " + _id + "  size[" + pGrid.m_Width + "," + pGrid.m_Height + "]  at  (" + x + "," + y + ")");
		return undefined;
	}
	
	return pGrid.m_pGrid[x + (y * pGrid.m_Width)];
}
// release mode version
function ds_grid_get_RELEASE(_id, _x, _y)
{
    var pGrid = g_ActiveGrids.Get(_id);
    return pGrid.m_pGrid[~~_x + (~~_y * pGrid.m_Width)];
}


// #############################################################################################
/// Function:<summary>
///             "Common" grid "get" function
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_get_common(_id,_x1,_y1,_x2,_y2)                  
{
    _id = yyGetInt32(_id);
    _x1 = yyGetInt32(_x1);
    _y1 = yyGetInt32(_y1);
    _x2 = yyGetInt32(_x2);
    _y2 = yyGetInt32(_y2);

	var pGrid = g_ActiveGrids.Get(_id);
	if (!pGrid) {
		yyError("Error: invalid ds_grid ID (ds_grid_get_sum)");
		return 0;
	}


	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if( _x1<0 ) _x1=0;
	if (_x1 >= pGrid.m_Width) _x1 = pGrid.m_Width - 1;
	if( _x2<0 ) _x2=0;
	if (_x2 >= pGrid.m_Width) _x2 = pGrid.m_Width - 1;



	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}
	if( _y1<0 ) _y1=0;
	if (_y1 >= pGrid.m_Height) _y1 = pGrid.m_Height - 1;
	if( _y2<0 ) _y2=0;
	if (_y2 >= pGrid.m_Height) _y2 = pGrid.m_Height - 1;


	g_Grid_max = g_Grid_min = g_Grid_value = g_Grid_mean = 0;
	var first = true;
	var count = 0;
    
	// Now actually loop through and do the "copy"
	for (var y = _y1; y <= _y2; y++)
	{
		var index = (y * pGrid.m_Width) + _x1;
		for (var x = _x1; x <= _x2; x++)
		{
			var v = pGrid.m_pGrid[index];
			if( first ){
				g_Grid_min = g_Grid_max = v;
				first = false;
			}else{
				if( g_Grid_min>v ) g_Grid_min=v;
				if( g_Grid_max<v ) g_Grid_max=v;
			}
			if( typeof v !== "string"){
			    g_Grid_value += v;
			}
			count++;
			index++;
		}
    }
	g_Grid_mean = g_Grid_value / count;
}

// #############################################################################################
/// Function:<summary>
///             Returns the sum of the values of the cells in the region in the grid with the 
///             given id. Does only work when the cells contain numbers.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function    ds_grid_get_sum(_id,_x1,_y1,_x2,_y2)                  
{
	ds_grid_get_common(_id,_x1,_y1,_x2,_y2);
	return g_Grid_value;
}
// #############################################################################################
/// Function:<summary>
///             Returns the sum of the values of the cells in the region in the grid with the 
///             given id. Does only work when the cells contain numbers
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_get_max(_id,_x1,_y1,_x2,_y2)
{
	ds_grid_get_common(_id,_x1,_y1,_x2,_y2);
	return g_Grid_max;
}

// #############################################################################################
/// Function:<summary>
///             Returns the sum of the values of the cells in the region in the grid with the 
///             given id. Does only work when the cells contain numbers.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_get_min(_id,_x1,_y1,_x2,_y2) {
	ds_grid_get_common(_id, _x1, _y1, _x2, _y2);
	return g_Grid_min;
}


// #############################################################################################
/// Function:<summary>
///             Returns the sum of the values of the cells in the region in the grid with the 
///             given id. Does only work when the cells contain numbers.
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_get_mean(_id,_x1,_y1,_x2,_y2) {
	ds_grid_get_common(_id, _x1, _y1, _x2, _y2);
	return g_Grid_mean;
}



// #############################################################################################
/// Function:<summary>
///          	"Common" disk function
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_get_disk_common(_id,_x,_y,_r)  
{
	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if (!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_disk)");
		return;
	}

	_x = yyGetReal(_x);
	_y = yyGetReal(_y);
	_r = yyGetReal(_r);

	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var i = 0;
	var j = 0;

	x1 = ~ ~(yymax(0.0, Math.floor(_x - _r)));
	x2 = ~ ~(yymin(pGrid.m_Width - 1, Math.ceil(_x + _r)));
	y1 = ~ ~(yymax(0, Math.floor(_y - _r)));
	y2 = ~ ~(yymin(pGrid.m_Height - 1, Math.ceil(_y + _r)));

	var first = true;
	var count = 0;
	g_Grid_max = g_Grid_min = g_Grid_value = 0;
	_r = _r * _r;
	var w = pGrid.m_Width;
	for (i = x1; i <= x2; i++)
	{
		var ix = (i - _x) * (i - _x);
		for (j = y1; j <= y2; j++)
		{
			var jy = j - _y;
			if (ix + (jy * jy) <= _r)
			{
				if (i >= 0 && i < pGrid.m_Width && j >= 0 && j < pGrid.m_Height)
				{
					var v = pGrid.m_pGrid[i + (j * w)];
					if( first ){
						g_Grid_min = g_Grid_max = v;
						first = false;
					}else{
						if( g_Grid_min>v ) g_Grid_min=v;
						if( g_Grid_max<v ) g_Grid_max=v;
					}
					if (typeof v !== "string") {
					    g_Grid_value += v;
					} 
					count++;
				}
			}
		}
	}
	g_Grid_mean = g_Grid_value / count;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the sum of the values of the cells in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_get_disk_sum(_id,_x,_y,_r)  
{
	ds_grid_get_disk_common(_id,_x,_y,_r);
	return g_Grid_value;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the max of the values of the cells in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_get_disk_max(_id,_x,_y,_r) 
{
	ds_grid_get_disk_common(_id,_x,_y,_r);
	return g_Grid_max;
}



// #############################################################################################
/// Function:<summary>
///          	Returns the min of the values of the cells in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_get_disk_min(_id,_x,_y,_r) {
	ds_grid_get_disk_common(_id, _x, _y, _r);
	return g_Grid_min;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the min of the values of the cells in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_get_disk_mean(_id, _x, _y, _r) 
{
	ds_grid_get_disk_common(_id, _x, _y, _r);
	return g_Grid_mean;
}




// #############################################################################################
/// Function:<summary>
///             Returns whether the value appears somewhere in the region.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_value_common(_id,_x1,_y1,_x2,_y2,_val) 
{
    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if(!pGrid){
		yyError("Error: invalid ds_grid ID (ds_grid_get_sum)");
		return 0;
	}

	_x1 = yyGetInt32(_x1);
	_y1 = yyGetInt32(_y1);
	_x2 = yyGetInt32(_x2);
	_y2 = yyGetInt32(_y2);

	if (_x1 > _x2)
	{
		var t = _x1;
		_x1 = _x2;
		_x2 = t;
	}
	if( _x1<0 ) _x1=0;
	if (_x1 >= pGrid.m_Width) _x1 = pGrid.m_Width - 1;
	if( _x2<0 ) _x2=0;
	if (_x2 >= pGrid.m_Width) _x2 = pGrid.m_Width - 1;



	if (_y1 > _y2)
	{
		var t = _y1;
		_y1 = _y2;
		_y2 = t;
	}
	if( _y1<0 ) _y1=0;
	if (_y1 >= pGrid.m_Height) _y1 = pGrid.m_Height - 1;
	if( _y2<0 ) _y2=0;
	if (_y2 >= pGrid.m_Height) _y2 = pGrid.m_Height - 1;


	g_Grid_value_exists = false;
	g_Grid_value_x = -1;
	g_Grid_value_y = -1;

	for (var y = _y1; y <= _y2; y++)
	{
		var index = (y * pGrid.m_Width) + _x1;
		for (var x = _x1; x <= _x2; x++)
		{
		    var v = pGrid.m_pGrid[index];
		    if( (typeof(_val)=="number" && typeof(v)=="number") )
		    {
			    if (g_Precsision > abs(_val-v) )
			    {
				    g_Grid_value_exists = true;
				    g_Grid_value_x = x;
				    g_Grid_value_y = y;
				    return true;
			    }
			}else{
			    if ( _val == v  )
			    {
				    g_Grid_value_exists = true;
				    g_Grid_value_x = x;
				    g_Grid_value_y = y;
				    return true;
			    }
			}
			index++;
		}
	}
	return false;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the value appears somewhere in the region.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_value_exists(_id, _x1, _y1, _x2, _y2, _val) 
{
	ds_grid_value_common(_id, _x1, _y1, _x2, _y2, _val);
	return g_Grid_value_exists;
}

// #############################################################################################
/// Function:<summary>
///             Returns the x-coordinate of the cell in which the value appears in the region.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    ds_grid_value_x(_id,_x1,_y1,_x2,_y2,_val) {
	ds_grid_value_common(_id, _x1, _y1, _x2, _y2, _val);
	return g_Grid_value_x;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the y-coordinate of the cell in which the value appears in the region.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function    ds_grid_value_y(_id,_x1,_y1,_x2,_y2,_val) {
	ds_grid_value_common(_id, _x1, _y1, _x2, _y2, _val);
	return g_Grid_value_y;
}


// #############################################################################################
/// Function:<summary>
///          	"Common" disk function
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_xm"></param>
///			<param name="_ym"></param>
///			<param name="_r"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_value_disk_common(_id, _x, _y, _r, _val) {

	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_set_disk)");
		return;
	}

	_x = yyGetReal(_x);
	_y = yyGetReal(_y);
	_r = yyGetReal(_r);

	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var i = 0;
	var j = 0;

	x1 = ~ ~(yymax(0.0, Math.floor(_x - _r)));
	x2 = ~ ~(yymin(pGrid.m_Width - 1, Math.ceil(_x + _r)));
	y1 = ~ ~(yymax(0, Math.floor(_y - _r)));
	y2 = ~ ~(yymin(pGrid.m_Height - 1, Math.ceil(_y + _r)));

	g_Grid_value_x = g_Grid_value_y = -1;
	g_Grid_value_exists = false;

	_r = _r * _r;
	var w = pGrid.m_Width;
	for (i = x1; i <= x2; i++)
	{
		var ix = (i - _x) * (i - _x);
		for (j = y1; j <= y2; j++)
		{
			var jy = j - _y;
			if (ix + (jy * jy) <= _r)
			{
				if (i >= 0 && i < pGrid.m_Width && j >= 0 && j < pGrid.m_Height)
				{
					var v = pGrid.m_pGrid[i + (j * w)];
		            if( (typeof(_val)=="number" && typeof(v)=="number") )
		            {
        			    if (g_Precsision > abs(_val-v) )
					    {
						    g_Grid_value_x = i;
						    g_Grid_value_y = j;
						    g_Grid_value_exists = true;
						    return;
    					}
    				}else{
					    if (v == _val)
					    {
						    g_Grid_value_x = i;
						    g_Grid_value_y = j;
						    g_Grid_value_exists = true;
						    return;
    					}
    				}
				}
			}
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the value appears somewhere in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_value_disk_exists(_id,_x,_y,_r,_val) {
	ds_grid_value_disk_common(_id, _x, _y, _r, _val);
	return g_Grid_value_exists;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the x-coordinate of the cell in which the value appears in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function    ds_grid_value_disk_x(_id,_x,_y,_r,_val) {
	ds_grid_value_disk_common(_id, _x, _y, _r, _val);
	return g_Grid_value_x;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the y-coordinate of the cell in which the value appears in the disk.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_value_disk_y(_id, _x, _y, _r, _val) {
	ds_grid_value_disk_common(_id, _x, _y, _r, _val);
	return g_Grid_value_y;
}

// #############################################################################################
/// Function:<summary>
///				Shuffles the values in the grid such that they end up in a random order.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_shuffle(_id) {
	var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if (pGrid == null || pGrid == undefined)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_shuffle)");
		return;
	}

	pGrid.m_pGrid.sort(function () { return 0.5 - Math.random(); });
}



// #############################################################################################
/// Function:<summary>
///          	Turns the data structure into a string and returns this string. The string can 
///				then be used to e.g. save it to a file. This provides an easy mechanism for saving 
///				data structures.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				JSON holding the grid object
///			</returns>
// #############################################################################################
function ds_grid_write(_id) 
{
    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_write)");
		return;
	}

    
	var width = pGrid.m_Width;
	var height= pGrid.m_Height;

	var pBuffer = buffer_create(16384, eBuffer_Format_Grow, 1); 
	buffer_write(pBuffer, eBuffer_U32, 603 );
	buffer_write(pBuffer, eBuffer_U32, width );                 
	buffer_write(pBuffer, eBuffer_U32, height );                

	
	for ( var x=0 ; x<=width-1 ; x++ )
	{
	    for ( y=0 ; y<=height-1 ; y++ )
	    {
	        var val = pGrid.m_pGrid[x + (y * width)];
	        variable_WriteValue(pBuffer, val);
	    }
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
///			<param name="_pJSON">The </param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function ds_grid_read(_id, _pJSON)
{
    if (!_pJSON) {
        yyError("Error: no string provided (ds_grid_read)");
        return false;
    }


    var pGrid = g_ActiveGrids.Get(yyGetInt32(_id));
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_read)");
		return false;
	}

    // Old JSON format?
	if (_pJSON[0] == "{") {
	    try {
	        var pGridNew = JSON.parse(_pJSON);
	        // Make sure it parsed something sensible rather than 
	        // potentially trashing the original grid with garbage
	        if ((pGridNew != null) && (pGridNew != undefined) &&
                (typeof (pGridNew.body) == "object") &&
                (typeof (pGridNew.width) == "number") &&
                (typeof (pGridNew.height) == "number")) {
	            pGrid.m_Width = pGridNew.width;
	            pGrid.m_Height = pGridNew.height;
	            pGrid.m_pGrid = pGridNew.body;
	        }
	    } catch (ex) {
	        yyError("Error: reading ds_grid JSON");
	        return false;
	    }
	    return true;
	} else {
	    // use Native format
	    var pBuffer = variable_ConvertFromString(_pJSON);
	    if(pBuffer<0) return false;

        // Move to start of buffer for stream
	    buffer_seek(pBuffer, eBuffer_Start, 0);

        // Get version, make sure it's a supported one
	    var id = buffer_read(pBuffer, eBuffer_S32);
	    var version;

	    if (id == 602) {
	        version = 3;
	    } else if (id == 603) {
	        version = 0; /* 0 is "current" - parity with C++ implementation. */
	    } else {
	        yyError("Error: unrecognised format - resave the grid to update/fix issues. (ds_grid_read)");
	        return false;
	    }


        // Now read the grid size
	    var w = buffer_read(pBuffer, eBuffer_S32);
	    var h = buffer_read(pBuffer, eBuffer_S32);
	    pGrid.m_Width = w;
	    pGrid.m_Height = h;
	    pGrid.m_pGrid = [];
	    var t = w * h;
	    for (var i = 0; i < t; i++) {
	        pGrid.m_pGrid[i] = 0;
	    }

        
	    for ( i=0 ; i<=w-1 ; i++ )
	    {
	        for ( j=0 ; j<=h-1 ; j++ )
	        {				
	            var val = variable_ReadValue(pBuffer, version);
	            pGrid.m_pGrid[i + (j * w)] = val;
	        }
	    }


	    buffer_delete(pBuffer);
	    return true;
	}	
}

// #############################################################################################
/// Function:<summary>
///          	Sort the grid by column
///          </summary>
// #############################################################################################
function ds_grid_sort(_id, _column, _ascending) {

    _id = yyGetInt32(_id);
    _column = yyGetInt32(_column);
    _ascending = yyGetBool(_ascending);

    var pGrid = g_ActiveGrids.Get(_id);
	if(!pGrid)
	{
		yyError("Error: invalid ds_grid ID (ds_grid_read)");
		return;
	}
	
	// Generate the column to sort
	var sortedArray = [];
	for (var y = 0; y < pGrid.m_Height; y++) {
	    sortedArray[y] = ds_grid_get(_id, _column, y);
	}
	var mult = _ascending ? 1 : -1;
	sortedArray.sort(function(a, b) {
	    return yyCompareVal(a, b, g_GMLMathEpsilon) * mult;
	});
        
    // Block out a target grid
    var gridDest = [];
    
    // Setup a boolean array to make sure we don't screw up on collisions
    var rowUsed = [];
    for (var y = 0; y < sortedArray.length; y++) {
        rowUsed[y] = false;
    }

    // TODO: Make sure it handles collisions in the original array properly
    // Now compare the sorted array with the original column and alter the other columns accordingly
    for (var y = 0; y < sortedArray.length; y++) {

        var sortedArrayVal = sortedArray[y];
        for (var j = 0; j < sortedArray.length; j++) {
        
            var yc = _ascending ? j : (sortedArray.length - 1 - j);        
            if (rowUsed[yc]) {
                continue;
            }

            var arrayVal = ds_grid_get(_id, _column, yc);
            if (arrayVal == sortedArrayVal) {
            
                // Set all other columns accordingly
                for (var x = 0; x < pGrid.m_Width; x++) {
                    gridDest[x + (pGrid.m_Width * y)] = ds_grid_get(_id, x, yc);
                }
                rowUsed[yc] = true;
                break;
            }
        }
    }
    pGrid.m_pGrid = gridDest;
}


// #############################################################################################
/// Function:<summary>
///          	Convert a ds_grid into a mp_grid (of the same size)
///          </summary>
// #############################################################################################
function ds_grid_to_mp_grid(_src, _dest, _predicate) {

    var pGrid = g_ActiveGrids.Get(yyGetInt32(_src));
    var pMPGrid = g_MPGridColletion.Get(yyGetInt32(_dest));

    if (pMPGrid == null || pGrid == null)
    {
        yyError("ds_grid_to_mp_grid :: Invalid source or destination grid");
        return; 
    }

    // Src+Dest must be exactly the same size
    var w = pMPGrid.m_hcells;
    var h = pMPGrid.m_vcells;
    var gw = pGrid.m_Width;
    var gh = pGrid.m_Height;

    if (w != gw || h != gh ) 
    {
        yyError("ds_grid_to_mp_grid :: Grid sizes do not match");
        return; 
    }
	
    // There is no predicate just direct copy from ds_grid to mp_grid
	// zero-ed cells will be empty and everything else will be made occupied
	if (_predicate == undefined)
	{
		for (var y = 0; y < h; ++y)
		{
			for (var x = 0; x < w; ++x)
			{
				var val = yyGetReal(pGrid.m_pGrid[x + (y * pGrid.m_Width)]);
				pMPGrid.m_cells[(x * pMPGrid.m_vcells) + y] = val === 0 ? 0 : -1;
			}
		}
	}
	// There is a predicate function
	else 
	{
		// Check method argument
		_func = getFunction(_predicate, 2);
		_obj = "boundObject" in _func ? _func.boundObject : {};

		for (var y = 0; y < h; ++y)
		{
			for (var x = 0; x < w; ++x)
			{
				var val = pGrid.m_pGrid[x + (y * pGrid.m_Width)];
				var res = yyGetBool(_func(_obj, _obj, val, x, y));

				pMPGrid.m_cells[(x * pMPGrid.m_vcells) + y] = res ? -1 : 0;
			}
		}
	}
}