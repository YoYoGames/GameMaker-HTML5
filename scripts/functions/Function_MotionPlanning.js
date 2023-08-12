
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_MotionPlanning.js
// Created:			02/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 02/06/2011		
// 
// **********************************************************************************************************************

var MPPot_Maxrot = 30,
    MPPot_Step = 10,
    MPPot_Ahead = 3,
    MPPot_OnSpot = true;


// #############################################################################################
/// Function:<summary>
///             Tests whether a position for inst is free with respect to objects of objind
///             useall is only used when objind = OBJECT_ALL
///          </summary>
///
/// In:		<param name="inst"></param>
///			<param name="x"></param>
///			<param name="y"></param>
///			<param name="objind"></param>
///			<param name="checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function TestFree(_pInst, _x, _y, _objind, _checkall)
{
	if ( _objind == OBJECT_ALL )
	{
		if ( _checkall )
		{
			return place_empty(_pInst, _x,_y);
		}
		else
		{
			return place_free(_pInst, _x, _y);
		}
	}
	else
	{
		return (instance_place(_pInst, _x, _y, _objind) == OBJECT_NOONE);
	}
}


// #############################################################################################
/// Function:<summary>
///          	This function lets the instance take a step straight towards the indicated 
///             position (x,y). The size of the step is indicated by the stepsize. 
///             If the instance is already at the position it will not move any further. 
///             If checkall is true the instance will stop when it hits an instance of any object. 
///             If it is false it only stops when hitting a solid instance. 
///
///             Note: That this function does not try to make detours if it meets an obstacle. 
///             It simply fails in that case. The function returns whether or not the goal position 
///             was reached.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_stepsize"></param>
///			<param name="_objind"></param>
///			<param name="_checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_linear_step_common( _pInst, _x,_y,_stepsize,_objind, _checkall) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _stepsize = yyGetReal(_stepsize);
    _checkall = yyGetBool(_checkall);

    var  Result = false;

    var dist = 0.0;
    var newx = 0.0;
    var newy = 0.0;

    // check whether at the correct position
    if ( (_pInst.x == _x) && (_pInst.y == _y) ) return true;

    // check whether close enough for a single step
    dist = sqrt(  Sqr(_pInst.x-_x)+Sqr(_pInst.y-_y) );
    if ( dist <= _stepsize )
    {
	    newx = _x; 
	    newy = _y;
	    Result = true;
    }
    else
    {
	    newx = _pInst.x + _stepsize * (_x-_pInst.x) / dist;
	    newy = _pInst.y + _stepsize * (_y-_pInst.y) / dist;
	    Result = false;
    }
    // Check whether free
    if ( !TestFree(_pInst,newx,newy,_objind,_checkall) ){ 
        return Result; 
    }
    
    _pInst.direction = point_direction(_pInst.x,_pInst.y, newx,newy );
    _pInst.SetPosition( newx, newy );

    return Result;
}
// #############################################################################################
/// Function:<summary>
///          	This function lets the instance take a step straight towards the indicated 
///             position (x,y). The size of the step is indicated by the stepsize. 
///             If the instance is already at the position it will not move any further. 
///             If checkall is true the instance will stop when it hits an instance of any object. 
///             If it is false it only stops when hitting a solid instance. 
///
///             Note: That this function does not try to make detours if it meets an obstacle. 
///             It simply fails in that case. The function returns whether or not the goal position 
///             was reached.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_stepsize"></param>
///			<param name="_objind"></param>
///			<param name="_checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_linear_step( _pInst, _x,_y,_stepsize, _checkall) 
{ 
    return  mp_linear_step_common( _pInst, _x,_y,_stepsize, OBJECT_ALL, _checkall); 
}


// #############################################################################################
/// Function:<summary>
///          	Same as the function above but this time only instances of obj are considered 
///             as obstacles. obj can be an object or an instance id.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_stepsize"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_linear_step_object( _pInst, _x,_y,_stepsize,_obj) 
{
    return  mp_linear_step_common( _pInst, _x,_y,_stepsize, _obj, true); 
}

// #############################################################################################
/// Function:<summary>
///          	Common functionality for mp_potential_step* calls
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_stepsize"></param>
///			<param name="_objindex"></param>
///			<param name="_checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_potential_step_common(_pInst, _x,_y, _stepsize, _objindex, _checkall) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _stepsize = yyGetReal(_stepsize);
    _objindex = yyGetInt32(_objindex);
    _checkall = yyGetBool(_checkall);

    var Result = false;

	var dist = 0.0;
	var goaldir = 0.0;
	var curdir = 0.0;

	// check whether at the correct position
	if ((_pInst.x == _x) && (_pInst.y == _y))
	{
		Result = true;
		return Result;
	}
	// check whether close enough for a single step
	dist = sqrt(Sqr(_pInst.x - _x) + Sqr(_pInst.y - _y));		
	if (dist <= _stepsize)
	{
		if (TestFree(_pInst, _x, _y, _objindex, _checkall))
		{
			_pInst.direction = point_direction(_pInst.x, _pInst.y, _x, _y);
			_pInst.SetPosition(_x, _y);
		}
		Result = true;
		return Result;
	}

	// Try directions as much as possible towards the goal
	goaldir = point_direction(_pInst.x, _pInst.y, _x, _y);
	curdir = 0;
	Result = false;
	while ( curdir < 180 )
	{
		if (TryDir(goaldir - curdir, _pInst, _stepsize, _objindex, _checkall)) { 
		    return Result; 
		}
		if (TryDir(goaldir + curdir, _pInst, _stepsize, _objindex, _checkall)) { 
		    return Result; 
		}
		curdir = curdir + MPPot_Step;
	}
	// If we did not succeed a local minima was reached
	// To avoid that the instance gets stuck we rotate on the spot
	if (MPPot_OnSpot)
	{
		_pInst.direction = _pInst.direction + MPPot_Maxrot;
	}

	return Result;
}

// #############################################################################################
/// Function:<summary>
///          	Like the previous function, this function lets the instance take a step towards 
///             a particular position. But in this case it tries to avoid obstacles. When the 
///             instance would run into a solid instance (or any instance when checkall is true) 
///             it will change the direction of motion to try to avoid the instance and move around it. 
///             The approach is not guaranteed to work but in most easy cases it will effectively move 
///             the instance towards the goal. The function returns whether or not the goal was reached.
///          </summary>
// #############################################################################################
function mp_potential_step(_pInst, _x,_y, _stepsize, _checkall) 
{
    return mp_potential_step_common(_pInst, _x,_y, _stepsize, OBJECT_ALL, _checkall);
}

// #############################################################################################
/// Function:<summary>
///          	Same as the function above but this time only instances of obj are considered as 
///             obstacles. obj can be an object or an instance id.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_stepsize"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_potential_step_object(_pInst, _x, _y, _stepsize, _obj)
{    
	return mp_potential_step_common(_pInst, _x, _y, _stepsize, _obj, true); 
}


// #############################################################################################
/// Function:<summary>
///          	The previous function does its work using a number of parameters that can be 
///             changed using this function. Globally the method works as follows. It first 
///             tries to move straight towards the goal. It looks a number of steps ahead which 
///             can be set with the parameter ahead (default 3). Reducing this value means that 
///             the instance will start changing direction later. Increasing it means it will 
///             start changing direction earlier. If this check leads to a collision it starts 
///             looking at directions more to the left and to the right of the best direction. 
///             It does this in steps of size rotstep (default 10). Reducing this gives the 
///             instance more movement possibilities but will be slower. The parameter maxrot 
///             is a bit more difficult to explain. The instance has a current direction. 
///             maxrot (default 30) indicates how much it is allowed to change its current 
///             direction in a step. So even if it can move e.g. straight to the goal it will only 
///             do so if it does not violate this maximal change of direction. If you make maxrot 
///             large the instance can change a lot in each step. This will make it easier to find 
///             a short path but the path will be uglier. If you make the value smaller the path 
///             will be smoother but it might take longer detours (and sometimes even fail to find 
///             the goal). When no step can be made the behavior depends on the value of the parameter 
///             onspot. If onspot is true (the default value), the instance will rotate on its 
///             spot by the amount indicated with maxrot. If it is false it will not move at all. 
///             Setting it to false is useful for e.g. cars but reduces the chance of finding a path.
///          </summary>
///
/// In:		<param name="_maxrot"></param>
///			<param name="_rotstep"></param>
///			<param name="_ahead"></param>
///			<param name="_onspot"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_potential_settings(_pInst, _maxrot, _rotstep, _ahead, _onspot) 
{
    MPPot_Maxrot = yymax(1, yyGetReal(_maxrot));
    MPPot_Step = yymax(1, yyGetReal(_rotstep));
    MPPot_Ahead = yymax(1, yyGetReal(_ahead));
    MPPot_OnSpot = yyGetBool(_onspot);    
}


// #############################################################################################
/// Function:<summary>
///                 Take a direct step towards the indicated position with the given speed
///                 returns whether the goal was reached
///          </summary>
// #############################################################################################
function  Motion_Linear_Step(_inst, _x, _y, _speed, _objind, _checkall)
{
	var Result = false;

    var dist = 0.0;
    var newx = 0.0;
    var newy = 0.0;

    // check whether at the correct position
    if ( (_inst.x == _x) && (_inst.y == _y) )
    {
        return true;
    }
    // check whether close enough for a single step
    dist = Math.sqrt(Sqr(_inst.x-_x)+Sqr(_inst.y-_y));
    if ( dist <= _speed )
    {
        newx = _x; 
        newy = _y;
        Result = true;
    }
    else
    {
        newx = _inst.x + _speed * (_x-_inst.x) / dist;
        newy = _inst.y + _speed * (_y-_inst.y) / dist;
        Result = false;
    }


    // Check whether free
    if ( !TestFree(_inst,newx,newy,_objind,_checkall) )
    { 
        return Result; 
    }
    _inst.direction = point_direction(_inst.x, _inst.y, newx, newy);
    _inst.SetPosition( newx, newy );

    return Result;
}

// #############################################################################################
// Computes a path for the instance from (xs,ys) to (xg,yg) with the indicated stepsize
// Returns whether found.
// #############################################################################################
function Motion_Linear_Path(_pInst, _path, _xg, _yg, _stepsize, _objind, _checkall)
{
	var xx = 0.0;
    var yy = 0.0;
    var dd = 0.0;
    var oldx = 0.0;
    var oldy = 0.0;

    var Result = false;

    var pPath = g_pPathManager.Paths[yyGetInt32(_path)];
    if (!pPath) return Result;
    if ( _stepsize <= 0.0 )return Result;

    // save instance information
    xx = _pInst.x;
    yy = _pInst.y;
    dd = _pInst.direction;

    // initialize the path
    pPath.Clear();
    pPath.SetKind( P_STRAIGHT );
    pPath.SetClosed( false );
    pPath.AddPoint(xx, yy, 100);

    // now build the path
    Result = true;
    while ( 1 )
    {
        oldx = _pInst.x;
        oldy = _pInst.y;
        if ( true == Motion_Linear_Step(_pInst,_xg,_yg,_stepsize,_objind,_checkall) )
        { 
            break; 
        }
        if ( (_pInst.x == oldx ) && (_pInst.y == oldy) )
        { 
            Result = false; 
            break;
        }
        pPath.AddPoint(_pInst.x,_pInst.y,100);
    }
	
    if ( true == Result ) 
    { 
        pPath.AddPoint(_xg,_yg,100); 
    }
    // restore instance information
    _pInst.SetPosition(xx,yy);
    _pInst.direction = dd;
    return Result;
}


// #############################################################################################
/// Function:<summary>
///          	This function computes a straight-line path for the instance from its current 
///             position to the position (xg,yg) using the indicated step size. It uses steps as 
///             in the function mp_linear_step(). The indicated path must already exist and will be 
///             overwritten by the new path. (See a later chapter on how to create and destroy paths.) 
///             The function will return whether a path was found. The function will stop and report 
///             failure if no straight path exists between start and goal. If it fails a path is 
///             still created that runs till the position where the instance was blocked.
///          </summary>
///
/// In:		<param name="_path"></param>
///			<param name="_xg"></param>
///			<param name="_yg"></param>
///			<param name="_stepsize"></param>
///			<param name="_checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_linear_path(_pInst, _path, _xg, _yg, _stepsize, _checkall) {
    return Motion_Linear_Path(_pInst, yyGetInt32(_path), yyGetReal(_xg), yyGetReal(_yg), yyGetReal(_stepsize), OBJECT_ALL, yyGetBool(_checkall));
}

// #############################################################################################
/// Function:<summary>
///          	Same as the function above but this time only instances of obj are considered as 
///             obstacles. obj can be an object or an instance id.
///          </summary>
///
/// In:		<param name="_path"></param>
///			<param name="_xg"></param>
///			<param name="_yg"></param>
///			<param name="_stepsize"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_linear_path_object(_pInst, _path,_xg,_yg,_stepsize,_obj) 
{
    return Motion_Linear_Path(_pInst, yyGetInt32(_path), yyGetReal(_xg), yyGetReal(_yg), yyGetReal(_stepsize), yyGetInt32(_obj), true);
}


// #############################################################################################
// Computes the difference between the directions (positive <= 180)
// #############################################################################################
function DiffDir(_dir1, _dir2)
{
    var Result= 0.0;

	while ( _dir1 <= 0.0 ) { _dir1 = _dir1 + 360.0; }
	while ( _dir1 >= 360.0 ) { _dir1 = _dir1 - 360.0; }
	while ( _dir2 < 0.0 ) { _dir2 = _dir2 + 360.0; }
	while ( _dir2 >= 360.0 ) { _dir2 = _dir2 - 360.0; }
	Result = _dir2-_dir1;
	if ( Result < 0.0 ) { Result = -Result; }
	if ( Result > 180.0 ) { Result = 360.0-Result; }

	return Result;
}


// #############################################################################################
// tries a step in the indicated direction; returns whether successful
// #############################################################################################
function TryDir(_dir, _inst, _speed, _objind, _checkall )
{
	var xnew = 0.0;
	var ynew = 0.0;

	// see whether angle is acceptable
	if (DiffDir(_dir, _inst.direction) > MPPot_Maxrot) {
	    return false;
	}

	// check position a bit ahead
	xnew = _inst.x + _speed*MPPot_Ahead*Math.cos( Math.PI * _dir / 180.0 );
	ynew = _inst.y - _speed*MPPot_Ahead*Math.sin( Math.PI * _dir / 180.0 );
	if ( !TestFree(_inst, xnew, ynew, _objind, _checkall)) {
	    return false;
	}
	//check next position
	xnew = _inst.x + _speed*Math.cos( Math.PI * _dir / 180.0 );
	ynew = _inst.y - _speed*Math.sin( Math.PI * _dir / 180.0 );
	if ( !TestFree(_inst, xnew, ynew, _objind, _checkall)) {
	    return false;
	}
	// OK, so set the position
	_inst.direction = _dir;
	_inst.SetPosition( xnew, ynew);
	return true;
}

// #############################################################################################
// Take a step towards the indicated position with the given speed
// avoiding obstacles using some potential field approach
// returns whether the goal was reached
// #############################################################################################
function Motion_Potential_Step(_inst, _x, _y, _speed,_objind, _checkall)
{
	var Result = false;

	var dist = 0.0;
	var goaldir = 0.0;
	var curdir = 0.0;

	// check whether at the correct position
	if ( (_inst.x == _x) && (_inst.y == _y) ){
		return true;
	}

	// check whether close enough for a single step
	dist = Math.sqrt(Sqr(_inst.x-_x)+Sqr(_inst.y-_y));
	if ( dist <= _speed )
	{
	    if (true == TestFree(_inst, _x, _y, _objind, _checkall))
		{
		    _inst.direction = point_direction(_inst.x,_inst.y,_x,_y);
			_inst.SetPosition(_x,_y);
		}
		return true;
	}

	// Try directions as much as possible towards the goal
	goaldir = point_direction(_inst.x, _inst.y,_x,_y);
	curdir = 0;
	Result = false;
	while ( curdir < 180 )
	{
	    if (TryDir(goaldir - curdir, _inst, _speed, _objind, _checkall)) {
	        return Result;
	    }
	    if (TryDir(goaldir + curdir, _inst, _speed, _objind, _checkall)) {
	        return Result;
	    }
		curdir = curdir + MPPot_Step;
	}
	// If we did not succeed a local minima was reached
	// To avoid that the instance gets stuck we rotate on the spot
	if ( MPPot_OnSpot )
	{
		_inst.direction = _inst.direction + MPPot_Maxrot;
	}

	return Result;
}


// #############################################################################################
// Computes a path for the instance from (xs,ys) to (xg,yg) with the indicated stepsize
// Returns whether found. lenfact is the maximal length factor from the dstance
// #############################################################################################
function  Motion_Potential_Path(_inst, _path, _xg, _yg, _stepsize, _lenfact, _objind, _checkall)
{
	var Result = false;

	var maxlen = 0.0;
    var xx = 0.0;
	var yy = 0.0;
	var dd = 0.0;

	var pPath = g_pPathManager.Paths[_path];
	if (!pPath) return Result;
	if ( _lenfact <  1 ) { return Result; }
	if ( _stepsize <= 0 ){ return Result; }

	// compute maximal length allowed
	maxlen = Math.sqrt(Sqr(_xg - _inst.x) + Sqr(_yg - _inst.y)) * _lenfact;
	// save instance information
	xx = _inst.x;
	yy = _inst.y;
	dd = _inst.direction;

    // initialize the path
	pPath.Clear();
	pPath.SetKind( P_STRAIGHT );
	pPath.SetClosed( false );
	pPath.AddPoint(xx, yy, 100);

    // now build the path
	Result = true;

	var lastPathLen=0;
	var pathLen = 0;
	var stationarySteps = 0;
	while ( 1 )
	{
		if ( true == Motion_Potential_Step(_inst,_xg,_yg,_stepsize,_objind,_checkall) )  break;
		pPath.AddPoint( _inst.x, _inst.y , 100);
		lastPathLen = pathLen;
		pathLen = pPath.length;
		if( pathLen > maxlen )
		{
			Result = false;
			break; 
		}
		
		//break from loop if path length is static for many steps...
		if( pathLen == lastPathLen )
		{
			++stationarySteps;
			if( stationarySteps > 100 )
			{
				Result = false;
				break;
			}
		}
		else
		{
			stationarySteps = 0;
		}
	}

	if ( Result ) 
	{
		pPath.AddPoint(_xg,_yg,100);
	}

    // restore instance information
	_inst.SetPosition(xx, yy);
	_inst.direction = dd;
	return Result;
}

// #############################################################################################
/// Function:<summary>
///          	This function computes a path for the instance from its current position and 
///             orientation to the position (xg,yg) using the indicated step size trying to avoid 
///             collision with obstacles. It uses potential field steps, like in the function 
///             mp_potential_step() and also the parameters that can be set with mp_potential_settings(). 
///             The indicated path must already exist and will be overwritten by the new path. 
///             (See a later chapter on how to create and destroy paths.) The function will return 
///             whether a path was found. To avoid the function continuing to compute forever you 
///             need to provide a length factor larger than 1. The function will stop and report 
///             failure if it cannot find a path shorter than this factor times the distance 
///             between start and goal. A factor of 4 is normally good enough but if you expect long 
///             detours you might make it longer. If it fails a path is still created that runs in 
///             the direction of the goal but it will not reach it.
///          </summary>
///
/// In:		<param name="_path"></param>
///			<param name="_xg"></param>
///			<param name="_yg"></param>
///			<param name="_stepsize"></param>
///			<param name="_factor"></param>
///			<param name="_checkall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_potential_path(_pInst, _path,_xg,_yg,_stepsize,_factor,_checkall) 
{
    return Motion_Potential_Path(_pInst, yyGetInt32(_path), yyGetReal(_xg), yyGetReal(_yg), yyGetReal(_stepsize), yyGetReal(_factor), OBJECT_ALL, yyGetBool(_checkall));
}

// #############################################################################################
/// Function:<summary>
///          	Same as the function above but this time only instances of obj are considered as 
///             obstacles. obj can be an object or an instance id.
///          </summary>
///
/// In:		<param name="_path"></param>
///			<param name="_xg"></param>
///			<param name="_yg"></param>
///			<param name="_stepsize"></param>
///			<param name="_factor"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_potential_path_object(_pInst, _path,_xg,_yg,_stepsize,_factor,_obj) 
{
    return Motion_Potential_Path(_pInst, yyGetInt32(_path), yyGetReal(_xg), yyGetReal(_yg), yyGetReal(_stepsize), yyGetReal(_factor), yyGetInt32(_obj), true);
}







// @if function("mp_grid_*")

// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
//
//																	Motion Planing GRID
//
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################

// #############################################################################################
/// Function:<summary>
///          	Create a new GRID
///          </summary>
///
/// In:		<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyMPGrid( _left,_top, _gridwidth,_gridheight,  _cellwidth,_cellheight) {

	this.m_left = _left;
	this.m_top  = _top;
	this.m_hcells = ~~_gridwidth;
	this.m_vcells = ~~_gridheight;
	this.m_cellw = _cellwidth;
	this.m_cellh = _cellheight;
	this.m_cells = [];
	
	this.Clear();
};

// #############################################################################################
/// Function: <summary>
///           	Clear all cells
///           </summary>
// #############################################################################################
yyMPGrid.prototype.Clear = function () {
	// Fill the array with "empty" - also make sure it's an ARRAY, not a dictionary.
	var tot = this.m_hcells * this.m_vcells;
	for (var i = 0; i < tot; i++)
	{
		this.m_cells[i] = 0;
	}
};

// #############################################################################################
/// Function: <summary>
///           	Set a cell
///           </summary>
// #############################################################################################
yyMPGrid.prototype.Poke = function (_x,_y,_val) {
	if (_x < 0 || _x >= this.m_hcells) return;
	if (_y < 0 || _y >= this.m_vcells) return;
	
	this.m_cells[(_x * this.m_vcells) + _y] = _val;
};

// #############################################################################################
/// Function: <summary>
///           	Examine a cell, if out of bounds then return -1
///           </summary>
// #############################################################################################
yyMPGrid.prototype.Peek = function (_x,_y) {
	if (_x < 0 || _x >= this.m_hcells) return -1;
	if (_y < 0 || _y >= this.m_vcells) return -1;
	
	return this.m_cells[(_x * this.m_vcells) + _y];
};

// #############################################################################################
/// Property: <summary>
///           	Fill a rect area with a value
///           </summary>
// #############################################################################################
yyMPGrid.prototype.SetRect = function (_x1,_y1,_x2,_y2, _val)
{
	// CLIP bounds
	var xx1 = ~ ~((yymin(_x1, _x2) - this.m_left) / this.m_cellw);
	if ( xx1 < 0 ) xx1 = 0;

	var xx2 = ~~((yymax(_x1,_x2)-this.m_left) / this.m_cellw);
	if( xx2 >= this.m_hcells) xx2 = this.m_hcells - 1;

	var yy1 = ~ ~((yymin(_y1, _y2) - this.m_top) / this.m_cellh);
	if(yy1 < 0) yy1 = 0;

	var yy2 = ~ ~((yymax(_y1, _y2) - this.m_top) / this.m_cellh);  
	if(yy2 >= this.m_vcells) yy2 = this.m_vcells - 1;


	for(var i=xx1;i<=xx2;i++){
		var index = i*this.m_vcells;
		for(var j=yy1;j<=yy2;j++){
			this.m_cells[ index + j ] = _val;
		}
	}
};








// #############################################################################################
/// Function:<summary>
///          	This function creates the grid. It returns an index that must be used in all other 
///             calls. You can create and maintain multiple grid structures at the same moment. 
///             left and top indicate the position of the top-left corner of the grid. hcells and 
///             vcells indicate the number of horizontal and vertical cells. Finally cellwidth and 
///             cellheight indicate the size of the cells.
///          </summary>
///
/// In:		<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_hcells"></param>
///			<param name="_vcells"></param>
///			<param name="_cellwidth"></param>
///			<param name="_cellheight"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_create(_left,_top,_hcells,_vcells,_cellwidth,_cellheight) {

    var l = new yyMPGrid(yyGetInt32(_left),yyGetInt32(_top),yyGetInt32(_hcells),yyGetInt32(_vcells),yyGetInt32(_cellwidth),yyGetInt32(_cellheight));
	return g_MPGridColletion.Add(l);            // allocate a new LIST
}

// #############################################################################################
/// Function:<summary>
///          	Destroys the indicated grid structure and frees its memory. Don't forget to call 
///             this if you don't need the structure anymore.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_destroy(_id) 
{
    g_MPGridColletion.DeleteIndex(yyGetInt32(_id));
}

// #############################################################################################
/// Function:<summary>
///          	Mark all cells in the grid to be free.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_clear_all(_id) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
		mp.Clear();
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_clear_all)");
}

// #############################################################################################
/// Function:<summary>
///          	Clears the indicated cell. Cell 0,0 is the top left cell.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_h"></param>
///			<param name="_v"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_clear_cell(_id,_h,_v) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp){
	    mp.Poke(yyGetInt32(_h), yyGetInt32(_v), 0);
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_clear_cell)");
}


// #############################################################################################
/// Function:<summary>
///          	Clears all cells that intersect the indicated rectangle (in room coordinates).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_right"></param>
///			<param name="_bottom"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_clear_rectangle(_id,_x1,_y1,_x2,_y2) {
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
	    mp.SetRect(yyGetInt32(_x1),yyGetInt32(_y1),yyGetInt32(_x2),yyGetInt32(_y2), 0);
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_clear_rectangle)");
}


// #############################################################################################
/// Function:<summary>
///          	Marks the indicated cell as being forbidden. Cell 0,0 is the top left cell.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_h"></param>
///			<param name="_v"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_add_cell(_id,_x,_y) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
	    mp.Poke(yyGetInt32(_x), yyGetInt32(_y), -1);
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_add_cell)");
}

// #############################################################################################
/// Function:<summary>
///          	Get the indicated cell and returns it
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_h"></param>
///			<param name="_v"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_get_cell(_id, _x, _y) {
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
    if (mp) {
        return mp.Peek(yyGetInt32(_x), yyGetInt32(_y));
    }
    return -1;
}

// #############################################################################################
/// Function:<summary>
///          	Marks all cells that intersect the indicated rectangle as being forbidden.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_right"></param>
///			<param name="_bottom"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_add_rectangle(_id,_x1,_y1,_x2,_y2) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
	    mp.SetRect(yyGetInt32(_x1), yyGetInt32(_y1), yyGetInt32(_x2), yyGetInt32(_y2), -1);
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_add_rectangle)");
}


// #############################################################################################
/// Function:<summary>
///          	Marks all cells that intersect an instance of the indicated object as being forbidden. 
///             You can also use an individual instance by making obj the id of the instance. Also 
///             you can use the keyword all to indicate all instances of all objects. prec indicates 
///             whether precise collision checking must be used (will only work if precise checking is 
///             enabled for the sprite used by the instance).
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_add_instances(_inst, _id,_obj,_prec) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
	    
	    var col_delta = 0.0001; //To avoid leaching into the next cell
	    if (g_Collision_Compatibility_Mode)
	    {
	        col_delta = 0.0; //or in compat mode to go back to how it was
	    }

	    var InstArray = GetWithArray(yyGetInt32(_obj));
		for (var ins = 0; ins < InstArray.length; ins++)
		{
		    var pInst = InstArray[ins];
		    if (pInst.marked || !pInst.active)  //as native runner (#30338)
		        continue;

			if (pInst.bbox_dirty) pInst.Compute_BoundingBox();

			var xx1 = ~ ~((pInst.bbox.left +col_delta - mp.m_left) / mp.m_cellw);
			if (xx1 < 0) xx1 = 0;

			var xx2 = ~ ~((pInst.bbox.right -col_delta - mp.m_left) / mp.m_cellw);
			if (xx2 >= mp.m_hcells) xx2 = mp.m_hcells - 1;

			var yy1 = ~ ~((pInst.bbox.top +col_delta- mp.m_top) / mp.m_cellh);
			if (yy1 < 0) yy1 = 0;

			var yy2 = ~ ~((pInst.bbox.bottom -col_delta - mp.m_top) / mp.m_cellh);
			if (yy2 >= mp.m_vcells) yy2 = mp.m_vcells - 1;


			for (var i = xx1; i <= xx2; i++)
			{
				for (var j = yy1; j <= yy2; j++)
				{
					if (!yyGetBool(_prec))
					{
						mp.m_cells[i * mp.m_vcells + j] = -1;
						continue;
					}

					if (mp.m_cells[i * mp.m_vcells + j] < 0) continue;

					if (pInst.Collision_Rectangle(mp.m_left + i * mp.m_cellw, mp.m_top + j * mp.m_cellh, mp.m_left + (i + 1) * mp.m_cellw - 1, mp.m_top + (j + 1) * mp.m_cellh - 1, true))
					{
						mp.m_cells[i * mp.m_vcells + j] = -1;
					}
				}
			}
		}
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_add_instances)");
}


// #############################################################################################
/// Function:<summary>
///          	This function draws the grid with green cells being free and red cells being 
///             forbidden. This function is slow and only provided as a debug tool.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var mp_grid_draw = sys_mp_grid_draw;
function sys_mp_grid_draw(_id) 
{
    var mp = g_MPGridColletion.Get(yyGetInt32(_id));
	if (mp)
	{
		graphics.globalAlpha = g_GlobalAlpha;
		var red = GetHTMLRGBA(0xff0000, 1.0);
		var green = GetHTMLRGBA(0x00ff00, 1.0);
		for (var x = 0; x < mp.m_hcells; x++)
		{
			for (var y = 0; y<  mp.m_vcells; y++)
			{
				var col = green;				
				if (mp.m_cells[x*mp.m_vcells + y] < 0 ) { 
				    col = red;
				}
				graphics.fillStyle = col;
				graphics._fillRect(  (mp.m_left+x*mp.m_cellw), (mp.m_top+y*mp.m_cellh),  mp.m_cellw, mp.m_cellh);				
			}
		}
		return;
	}
	yyError("Error: invalid mp_grid ID (mp_grid_draw)");
}


// #############################################################################################
/// Function:<summary>
///          	Computes a path through the grid. path must indicate an existing path that will 
///             be replaced by the computer path. xstart and ystart indicate the start of the 
///             path and xgoal and ygoal the goal. allowdiag indicates whether diagonal moves are 
///             allowed instead of just horizontal or vertical. The function returns whether it 
///             succeeded in finding a path. (Note that the path is independent of the current 
///             instance; It is a path through the g rid, not a path for a specific instance.) 
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_path"></param>
///			<param name="_xstart"></param>
///			<param name="_ystart"></param>
///			<param name="_xgoal"></param>
///			<param name="_ygoal"></param>
///			<param name="_allowdiag"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mp_grid_path(_pInst, _id, _path, _xstart, _ystart, _xgoal, _ygoal, _allowdiag)
{
    _xstart = yyGetInt32(_xstart);
    _ystart = yyGetInt32(_ystart);
    _xgoal = yyGetInt32(_xgoal);
    _ygoal = yyGetInt32(_ygoal);
    _allowdiag = yyGetBool(_allowdiag);

	var cxs,cys,cxg,cyg,i,j,val,d,xx,yy,f1,f2,f3,f4,f6,f7,f8,f9,qq;

	var Result = false;
	var mp = g_MPGridColletion.Get(yyGetInt32(_id));					// get grid
	var pPath = g_pPathManager.Paths[yyGetInt32(_path)]; 				// get path
	if (!pPath || !mp) {
		//if(!pPath) yyError("Error: invalid path ID (mp_grid_path)");
		//if(!mp) yyError("Error: invalid mp_grid ID (mp_grid_path)");
		return Result;								// if either don't exist, then return.
	}

	// find the start && goal cell && check them
	if((_xstart < mp.m_left) || (_xstart >= (mp.m_left+mp.m_hcells*mp.m_cellw) )){
		//yyError("Error: invalid xstart position, not on grid. (mp_grid_path)");
		return Result;
	}
	if((_ystart < mp.m_top) || (_ystart >= mp.m_top+mp.m_vcells*mp.m_cellh)){
		//yyError("Error: invalid ystart position, not on grid. (mp_grid_path)");
		return Result;
	}
	cxs = ~~((_xstart-mp.m_left) / mp.m_cellw);
	cys = ~~((_ystart-mp.m_top) / mp.m_cellh);
	if(mp.m_cells[cxs*mp.m_vcells + cys] < 0)  {
		//yyError("Error: Can't START path in a blocked grid position. (mp_grid_path)");
		return Result;
	}




	if((_xgoal < mp.m_left) || (_xgoal >= mp.m_left+mp.m_hcells*mp.m_cellw)){
		//yyError("Error: invalid xgoal position, not on grid. (mp_grid_path)");
		return Result;
	}
	if((_ygoal < mp.m_top) || (_ygoal >= mp.m_top+mp.m_vcells*mp.m_cellh)){
		//yyError("Error: invalid ygoal position, not on grid. (mp_grid_path)");
		return Result;
	}
	cxg = ~~((_xgoal-mp.m_left) / mp.m_cellw);
	cyg = ~~((_ygoal-mp.m_top) / mp.m_cellh);
	if(mp.m_cells[cxg*mp.m_vcells + cyg] < 0){
		//yyError("Error: Can't END path in a blocked grid position. (mp_grid_path)");
		return Result;
	}
  





  // start the search
  mp.m_cells[cxs*mp.m_vcells + cys] = 1;
  qq = new yyQueue();
  qq.Push( (cxs*mp.m_vcells + cys) );
  
  while( qq.AtLeast(1) )
  {
    val = qq.Pop();
    xx = ~~(val / mp.m_vcells);
    yy = ~~(val % mp.m_vcells);
    if((xx==cxg) && (yy==cyg)) { 
		Result = true; 
		break; 
	}
    d = mp.m_cells[val]+1;
    f1 = (xx>0         ) && (yy<mp.m_vcells-1) && (mp.m_cells[(xx-1)*mp.m_vcells + (yy+1)]==0);
    f2 =                     (yy<mp.m_vcells-1) && (mp.m_cells[(xx  )*mp.m_vcells + (yy+1)]==0);
    f3 = (xx<mp.m_hcells-1) && (yy<mp.m_vcells-1) && (mp.m_cells[(xx+1)*mp.m_vcells + (yy+1)]==0);
    f4 = (xx>0         )                     && (mp.m_cells[(xx-1)*mp.m_vcells + (yy  )]==0);
    f6 = (xx<mp.m_hcells-1)                     && (mp.m_cells[(xx+1)*mp.m_vcells + (yy  )]==0);
    f7 = (xx>0         ) && (yy>0         ) && (mp.m_cells[(xx-1)*mp.m_vcells + (yy-1)]==0);
    f8 =                     (yy>0         ) && (mp.m_cells[(xx  )*mp.m_vcells + (yy-1)]==0);
    f9 = (xx<mp.m_hcells-1) && (yy>0         ) && (mp.m_cells[(xx+1)*mp.m_vcells + (yy-1)]==0);
    // Handle horizontal && vertical moves
    if(f4 ){ 
		mp.m_cells[(xx-1)*mp.m_vcells + yy] = d; 
		qq.Push(~~((xx-1)*mp.m_vcells + yy)); 
	}
    if(f6){ 
		mp.m_cells[(xx+1)*mp.m_vcells + yy] = d; 
		qq.Push(~~((xx+1)*mp.m_vcells + yy)); 
	}
    if(f8){ 
		mp.m_cells[xx*mp.m_vcells + yy-1] = d; 
		qq.Push(~~(xx*mp.m_vcells + yy-1)); 
	}
    if(f2){ 
		mp.m_cells[xx*mp.m_vcells + yy+1] = d; 
		qq.Push(~~(xx*mp.m_vcells + yy+1)); 
	}
    // Handle diagonal moves
    if(_allowdiag && f1 && f2 && f4 ){
		mp.m_cells[(xx-1)*mp.m_vcells + yy+1] = d; 
		qq.Push(~~((xx-1)*mp.m_vcells + yy+1)); 
	}
    if(_allowdiag && f7 && f8 && f4 ){ 
		mp.m_cells[(xx-1)*mp.m_vcells + yy-1] = d; 
		qq.Push(~~((xx-1)*mp.m_vcells + yy-1)); 
	}
    if(_allowdiag && f3 && f2 && f6){ 
		mp.m_cells[(xx+1)*mp.m_vcells + yy+1] = d; 
		qq.Push(~~((xx+1)*mp.m_vcells + yy+1)); 
	}
    if(_allowdiag && f9 && f8 && f6){ 
		mp.m_cells[(xx+1)*mp.m_vcells + yy-1] = d; 
		qq.Push(~~((xx+1)*mp.m_vcells + yy-1)); 
	}
  }  
  qq = undefined;	// Clear queue



  if(Result)
  {
    // compute the path from back to front
    pPath.Clear();
    pPath.Kind = P_STRAIGHT;
    pPath.closed = false;
    pPath.AddPoint( _xgoal,_ygoal, 100 );
    xx = cxg; 
	yy = cyg;

	while( (xx != cxs) || (yy != cys) )
    {
		val = mp.m_cells[xx*mp.m_vcells + yy];
		f1 = (xx>0) && (yy<mp.m_vcells-1) && ( mp.m_cells[(xx-1)*mp.m_vcells + (yy+1)]==val-1 );
		f2 = (yy<mp.m_vcells-1) && (mp.m_cells[(xx  )*mp.m_vcells + (yy+1)]==val-1);
		f3 = (xx<mp.m_hcells-1) && (yy<mp.m_vcells-1) && (mp.m_cells[(xx+1)*mp.m_vcells + (yy+1)]==val-1);
		f4 = (xx>0)&& (mp.m_cells[(xx-1)*mp.m_vcells + (yy  )]==val-1);
		f6 = (xx<mp.m_hcells-1) && (mp.m_cells[(xx+1)*mp.m_vcells + (yy  )]==val-1);
		f7 = (xx>0) && (yy>0) && (mp.m_cells[(xx-1)*mp.m_vcells + (yy-1)]==val-1);
		f8 = (yy>0) && (mp.m_cells[(xx  )*mp.m_vcells + (yy-1)]==val-1);
		f9 = (xx<mp.m_hcells-1) && (yy>0) && (mp.m_cells[(xx+1)*mp.m_vcells + (yy-1)]==val-1);

		// Four directions movement
		if (f4) xx = xx - 1;
		else if (f6) xx = xx + 1;
		else if (f8) yy = yy - 1;
		else if (f2) yy = yy + 1;
		else if (_allowdiag && f1) { xx = xx - 1;yy = yy + 1; }
		else if (_allowdiag && f3) { xx = xx + 1;yy = yy + 1; }
		else if (_allowdiag && f7) { xx = xx - 1;yy = yy - 1; }
		else if (_allowdiag && f9) { xx = xx + 1;yy = yy - 1; };

		if( (xx != cxs) || (yy != cys) ){
			pPath.AddPoint(  ~~(mp.m_left+xx*mp.m_cellw+mp.m_cellw/2),  ~~(mp.m_top+yy*mp.m_cellh+mp.m_cellh/2), 100 );
		}
    };
    pPath.AddPoint( _xstart,_ystart,100 );
    pPath.Reverse();
  };


	// Restore the grid
	for(i=0;i<mp.m_hcells;i++){
		for(j=0;j<mp.m_vcells;j++){
			if( mp.m_cells[i*mp.m_vcells + j]>0 )  mp.m_cells[i*mp.m_vcells + j] = 0;
		}
	}
	return Result;
}

function mp_grid_to_ds_grid(_src, _dest)
{
    _src = yyGetInt32(_src);
    _dest = yyGetInt32(_dest);

    var gridnum = g_ActiveGrids.count;
    var mpnum = g_MPGridColletion.count;

    if ((_src < 0) || (_src >= mpnum) || (_dest < 0) || (_dest >= gridnum))
    { 
        yyError("Error: Invalid source or destination grid");
        return;
    }

    var pGrid = g_ActiveGrids.Get(_dest);
    var pMPGrid = g_MPGridColletion.Get(_src);

    if (pMPGrid == null || pGrid == null)
    { 
        yyError("Error: Invalid source or destination grid");
        return; 
    }

    // Src+Dest must be exactly the same size
    var w = pMPGrid.m_hcells;
    var h = pMPGrid.m_vcells;
    var gw = pGrid.m_Width;
    var gh = pGrid.m_Height;

    if (w != gw || h != gh ) 
    {
        yyError("Error: Grid sizes do not match (mp_grid_to_ds_grid) ");
        return; 
    }
	
    //Now copy values...
    for (var y = 0; y < h; ++y)
    {
		for (var x = 0; x < w; ++x)
        {
		    pGrid.m_pGrid[x + (y * pGrid.m_Width)] = pMPGrid.m_cells[(x * pMPGrid.m_vcells) + y];
        }
    }
}

// @endif mp_grid
