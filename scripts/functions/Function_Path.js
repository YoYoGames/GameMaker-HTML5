
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Path.js
// Created:			27/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/05/2011		
// 
// **********************************************************************************************************************

// @if feature("paths")

// #############################################################################################
/// Function:<summary>
///          	Returns whether a path with the given index exists.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_exists(_ind) 
{
	if (g_pPathManager.Paths[yyGetInt32(_ind)]) return true;
	return false;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the name of the path with the given index.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_name(_ind)
{
    _ind = yyGetInt32(_ind);

	if (!g_pPathManager.Paths[_ind]) return "";
	return g_pPathManager.Paths[_ind].name;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the length of the path with the given index.
///          </summary>
///
/// In:		<param name="ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_length(_ind) 
{
    _ind = yyGetInt32(_ind);

	if (!g_pPathManager.Paths[_ind]) return 0;
	return g_pPathManager.Paths[_ind].length;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the kind of connections of the path with the given index (0=straight, 1=smooth).
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_kind(_ind) 
{
    _ind = yyGetInt32(_ind);

	if (!g_pPathManager.Paths[_ind]) return 0;
	return g_pPathManager.Paths[_ind].kind;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the path is closed or not.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_closed(_ind) 
{
    _ind = yyGetInt32(_ind);

	if (!g_pPathManager.Paths[_ind]) return true;
	return g_pPathManager.Paths[_ind].closed;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the precision used for creating smoothed paths.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_precision(_ind) 
{
    _ind = yyGetInt32(_ind);

	if (!g_pPathManager.Paths[_ind]) return 8;
	return g_pPathManager.Paths[_ind].precision;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of defining points for the path.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_number(_ind) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)];
	if (!pPath) return 0;
	if (!pPath.points) return 0;
	return pPath.points.length;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the x-coordinate of the n'th defining point for the path. 0 is the first point.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_point_x(_ind, _n) 
{
    _n = yyGetInt32(_n);

	if( _n < 0) return 0;

	var pPath = g_pPathManager.Paths[yyGetInt32(_ind)];		// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;
	if (!pPath.points) return 0;
	if (pPath.points.lenth >= _n) return 0;
	return pPath.points[_n].x;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the y-coordinate of the n'th defining point for the path. 0 is the first point.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_point_y(_ind,_n) 
{
    _n = yyGetInt32(_n);

	if (_n < 0) return 0;

	var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;
	if (!pPath.points) return 0;
	if (pPath.points.lenth >= _n) return 0;
	return pPath.points[_n].y;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the speed factor at the n'th defining point for the path. 0 is the first point.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_point_speed(_ind,_n)
{
    _n = yyGetInt32(_n);

	if (_n < 0) return 0;

	var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;
	if (!pPath.points) return 0;
	if (pPath.points.lenth >= _n) return 0;
	return pPath.points[_n].speed;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the x-coordinate at position pos for the path. pos must lie between 0 and 1.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_pos"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_x(_ind,_pos) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	return pPath.XPosition(yyGetReal(_pos));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the y-coordinate at position pos for the path. pos must lie between 0 and 1.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_pos"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_y(_ind,_pos) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	return pPath.YPosition(yyGetReal(_pos));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the speed factor at position pos for the path. pos must lie between 0 and 1.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_pos"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_get_speed(_ind,_pos) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	return pPath.SpeedPosition(yyGetReal(_pos));
}


// #############################################################################################
/// Function:<summary>
///          	Sets the kind of connections of the path with the given index (0=straight, 1=smooth).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_kind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_set_kind(_ind, _kind) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	pPath.SetKind(yyGetInt32(_kind));
}

// #############################################################################################
/// Function:<summary>
///          	Sets whether the path must be closed (true) or open (false).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_closed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_set_closed(_ind,_closed) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	pPath.SetClosed(yyGetBool(_closed));
}

// #############################################################################################
/// Function:<summary>
///          	Sets the precision with which the smooth path is calculated (should lie between 1 and 8).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_prec"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_set_precision(_ind,_prec) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	pPath.SetPrecision(yyGetInt32(_prec));
}

// #############################################################################################
/// Function:<summary>
///          	Adds a new empty paths. The index of the path is returned.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_add() 
{
	var pPath = new yyPath();
	g_pPathManager.Add(pPath);
	return pPath.id;
}


// #############################################################################################
/// Function:<summary>
///          	Creates a duplicate copy of the path with the given index. Returns the index of the copy.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_duplicate(_ind) 
{
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return -1;

	var pNewPath = new yyPath();
	g_pPathManager.Add(pNewPath);
	pNewPath.Assign(pPath);

	return pNewPath.id;
}

// #############################################################################################
/// Function:<summary>
///          	Assigns the indicated path to path ind. So this makes a copy of the path. 
///             In this way you can easily set an existing path to a different, e.g. new path. 
///          </summary>
///
/// In:		<param name="_ind">Dest of copy</param>
///			<param name="_path">Src of copy</param>
///				
// #############################################################################################
function path_assign(_ind,_path) 
{
    var pPathDst = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPathDst) return;

	var pPathSrc = g_pPathManager.Paths[yyGetInt32(_path)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPathSrc) return;

	pPathDst.Assign( pPathSrc );
}




// #############################################################################################
/// Function:<summary>
///          	Starts a path for the current instance. The path is the name of the path you want 
///				to start. The speed is the speed with which the path must be followed. A negative 
///				speed means that the instance moves backwards along the path. The endaction indicates 
///				what should happen when the end of the path is reached. The following values can 
///				be used: 
///				
///				0 : stop the path
///				1: continue from the start position (if the path is not closed we jump to the start position
///				2: continue from the current position
///				3: reverse the path, that is change the sign of the speed
///
///				The argument absolute should be true or false. When true the absolute coordinates of 
///				the path are used. When false the path is relative to the current position of the instance. 
///				To be more precise, if the speed is positive, the start point of the path will be placed on 
///				the current position and the path is followed from there. When the speed is negative the end 
///				point of the path will be placed on the current position and the path is followed 
///				backwards from there.
///          </summary>
///
/// In:		<param name="_path">"NAME" of path to start</param>
///			<param name="_speed">The speed with which the path must be followed.</param>
///			<param name="_endaction">Indicates what should happen when the end of the path is reached</param>
///			<param name="_absolute">True or False</param>
///				
// #############################################################################################
function path_start(_inst, _path, _speed, _endaction, _absolute) 
{
    _inst.Assign_Path(yyGetInt32(_path), yyGetReal(_speed), 1, 0, yyGetBool(_absolute), yyGetInt32(_endaction));
}

// #############################################################################################
/// Function:<summary>
///          	Ends the following of a path for the current instance.
///          </summary>
// #############################################################################################
function path_end(_inst) 
{
	_inst.Assign_Path(-1, 0, 1, 0, false, 0);
}



// #############################################################################################
/// Function:<summary>
///             Draw a path.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_absolute"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var draw_path = sys_draw_path;
function sys_draw_path(_id, _xoff, _yoff, _absolute) 
{
    _xoff = yyGetReal(_xoff);
    _yoff = yyGetReal(_yoff);

	var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;

	graphics.globalAlpha = g_GlobalAlpha;
    graphics.strokeStyle = g_GlobalColour_HTML_RGBA;
	
	var xx,yy,sp;
	var maxsteps = 0;

	var pPos = pPath.GetPosition( 0 );
	if (!yyGetBool(_absolute))
	{
		_xoff = _xoff - pPos.x;
		_yoff = _yoff - pPos.y;
	} else
	{
		_xoff = 0;
		_yoff = 0;
	}

	maxsteps = Round( pPath.length/4.0);
	if ( maxsteps == 0 ) return;

    var first = true;
	graphics._beginPath();
	for(var i=0 ; i<=maxsteps ; i++ )
	{
		pPos = pPath.GetPosition( i/maxsteps );
		if( first ){
        	graphics._moveTo(_xoff+pPos.x, _yoff+pPos.y);	
        	first=false;    
		}else{
        	graphics._lineTo(_xoff+pPos.x, _yoff+pPos.y);	    
		}
	}
	graphics._stroke();
	graphics._closePath();
}



// #############################################################################################
/// Function:<summary>
///             Shifts the path over the given amount.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_shift( _id, _xoff, _yoff )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Shift(yyGetReal(_xoff), yyGetReal(_yoff));
}


// #############################################################################################
/// Function:<summary>
///             Scales the path with the given factors (from its center).
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_rescale( _id, _xscale, _yscale )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Scale(yyGetReal(_xscale), yyGetReal(_yscale));
}



// #############################################################################################
/// Function:<summary>
///            Rotates the path counter clockwise over angle degrees (around its center).
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_rotate( _id, _angle )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Rotate(yyGetReal(_angle));
}




// #############################################################################################
/// Function:<summary>
///            Reverses the path.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_reverse( _id )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Reverse();
}



// #############################################################################################
/// Function:<summary>
///            Flips the path vertically (with respect to its center).
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_flip( _id )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Flip();
}


// #############################################################################################
/// Function:<summary>
///            Mirrors the path horizontally (with respect to its center)
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_xoff"></param>
///			 <param name="_yoff"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function path_mirror( _id )
{
    var pPath  = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;
	
	pPath.Mirror();
}

// #############################################################################################
/// Function:<summary>
///          	Changes the point n in the path with the given index to position (x,y) and the 
///				given speed factor.
///          </summary>
///
/// In:		<param name="_id">Path ID</param>
///			<param name="_ind">Point index</param>
///			<param name="_xx"></param>
///			<param name="_yy"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_change_point(_id, _ind, _xx, _yy, _speed) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_id)];
	if (!pPath) return;

	pPath.ChangePoint(_ind, yyGetReal(_xx), yyGetReal(_yy), yyGetReal(_speed));
}

// #############################################################################################
/// Function:<summary>
///          	Deletes the path with the given index.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_delete(_ind) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return;
	
	g_pPathManager.Delete(pPath);
}



// #############################################################################################
/// Function:<summary>
///          	Appends the indicated path to path ind. 
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_path"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_append(_ind, _path) {
    var pDest = g_pPathManager.Paths[yyGetInt32(_ind)]; 	
	if (!pDest) return;
	var pSrc = g_pPathManager.Paths[yyGetInt32(_path)]; 	
	if (!pSrc) return;

	pDest.Append(pSrc);
}

// #############################################################################################
/// Function:<summary>
///          	Adds a point to the path with the given index, at position (x,y) and with the 
///             given speed factor. Remember that a factor of 100 corresponds to the actual speed. 
///             Lower values mean slowing down and higher mean speeding up.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_add_point(_ind, _x, _y, _speed) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;

	pPath.AddPoint(yyGetReal(_x), yyGetReal(_y), yyGetReal(_speed));
}

// #############################################################################################
/// Function:<summary>
///          	Inserts a point in the path with the given index before point n, at position (x,y) 
///             and with the given speed factor.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_n"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_insert_point(_ind, _n, _x, _y, _speed) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;

	pPath.InsertPoint(yyGetInt32(_n), yyGetReal(_x), yyGetReal(_y), yyGetReal(_speed));
}


// #############################################################################################
/// Function:<summary>
///          	Deletes the point n in the path with the given index.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_delete_point(_ind, _n) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;

	pPath.DeletePoint(yyGetInt32(_n));
}

// #############################################################################################
/// Function:<summary>
///          	Clears all the points in the path, turning it into an empty path.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function path_clear_points(_ind) {
    var pPath = g_pPathManager.Paths[yyGetInt32(_ind)]; 	// dont test _ind, as it will simply read "null/undefined" here.
	if (!pPath) return 0;

	pPath.Clear();
}

// @endif

