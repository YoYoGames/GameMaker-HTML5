
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Movement.js
// Created:			30/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 30/05/2011		
// 
// **********************************************************************************************************************




// #############################################################################################
/// Function:<summary>
///          	Returns whether the instance placed at position(x,y) is collision-free. 
///             This is typically used as a check before actually moving to the new position.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function place_free(_pInst, _x,_y) 
{
	var xx,yy, Result,pInstance;

    Result=true;
	xx = _pInst.x;  
	yy = _pInst.y;
	_pInst.SetPosition(yyGetReal(_x), yyGetReal(_y));
 
    
	var pool = g_RunRoom.GetPool();	
	for (var inst = 0; inst < pool.length; inst++) 
	{
		pInstance = pool[inst];
        if( pInstance.solid )
        {
		    if( _pInst.Collision_Instance( pInstance,true) )
		    { 		        
                Result = false;
			    break;
		    }
        }
	}
	_pInst.SetPosition(xx,yy);
    return Result;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the instance placed at position (x,y) meets nobody. So this 
///             function takes also non-solid instances into account.
///          </summary>
///
/// In:		<param name="_pInst"></param>
/// 		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function place_empty(_pInst,_x,_y,_obj) 
{
	var xx,yy, Result,pInstance;

    Result=true;
	xx = _pInst.x;  
	yy = _pInst.y;
	_pInst.SetPosition(yyGetReal(_x),yyGetReal(_y));
 

	if (is_undefined(_obj)) {
	    _obj = OBJECT_ALL;
	}
	else {
	    _obj = yyGetInt32(_obj);
	}


	Result = Instance_SearchLoop(_pInst, Math.floor(_obj), true, false,
        function (_pInstance) {
            var coll = _pInst.Collision_Instance(_pInstance, true);
            if (!coll) {
                return false; //Has to be this way round as Instance_SearchLoop bails on positive result
            }
            return true;
        }
    );


	_pInst.SetPosition(xx, yy);

	if (Result)
	    return false;
	else
	    return true;
	
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the instance placed at position (x,y) meets obj. obj can be an 
///             object in which case the function returns true is some instance of that object is met. 
///             It can also be an instance id, the special word all meaning an instance of any object, 
///             or the special word other.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function place_meeting(_pInst,_x,_y,_obj) 
{
	var xx,yy, Result,pInstance;

    Result=false;
	xx = _pInst.x;  
	yy = _pInst.y;
	_pInst.SetPosition(yyGetReal(_x), yyGetReal(_y));


	var pool = GetWithArray(yyGetInt32(_obj));
	for (var inst = 0; inst < pool.length; inst++) 
	{
	    pInstance = pool[inst];
	    if ((pInstance.active) && (!pInstance.Marked)) {
	        if (_pInst.Collision_Instance(pInstance, true)) {
	            Result = true;
	            break;
	        }
	    }
	}
	_pInst.SetPosition(xx,yy);
    return Result;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the instance is aligned with the snapping values.
///          </summary>
///
/// In:		<param name="_hsnap"></param>
///			<param name="_vsnap"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function place_snapped(_inst, _hsnap, _vsnap) 
{
    _hsnap = yyGetReal(_hsnap);
    _vsnap = yyGetReal(_vsnap);

    if (_hsnap > 0)
    {
        if (Math.abs(_inst.x - _hsnap * Round(_inst.x / _hsnap)) >= 0.001 ){
            return false;
        }
    }
    if (_vsnap > 0)
    {
        if (Math.abs(_inst.y - _vsnap * Round(_inst.y / _vsnap)) >= 0.001 ) {
            return false;
        }
    }

    return true;
}
// #############################################################################################
/// Function:<summary>
///          	Moves the instance to a free random, snapped position, like the corresponding action.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_hsnap"></param>
///			<param name="_vsnap"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_random(_inst, _hsnap, _vsnap) 
{
    var i = 0;
    var x = 0.0;
	var y = 0.0;
    var xmin;
	var xmax;
	var ymin;
	var ymax;
	var sx = 0;
	var sy = 0;

    xmin = 0; xmax = g_RunRoom.GetWidth();
    ymin = 0; ymax = g_RunRoom.GetHeight();
    if ( true == sprite_exists(_inst.sprite_index) || true == sprite_exists(_inst.mask_index) )
    {
	    var tr = _inst.get_bbox();
	    xmin = Round(_inst.x - tr.left );
        xmax = Round(xmax + _inst.x - tr.right);
        ymin = Round(_inst.y - tr.top);
        ymax = Round(ymax + _inst.y - tr.bottom);
    }
    sx = Round(yyGetReal(_hsnap));
    sy = Round(yyGetReal(_vsnap));
    
    // Try at most 100 times
    for ( i=1 ; i<100 ; i++ )
    {
        x = xmin + YYRandom(xmax - xmin);
        if ( sx > 0 ) { 
            x = sx * floor(x/sx);
        }
        
        y = ymin + YYRandom(ymax-ymin);
        if ( sy > 0 ) { 
            y = sy * floor(y/sy);
        }
        
        if ( true == place_free(_inst,x,y) )
	    {
	    	_inst.SetPosition(x, y);
	    	return;
	    }
    }
}

// #############################################################################################
/// Function:<summary>
///          	Snaps the instance, like the corresponding action.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_hsnap"></param>
///			<param name="_vsnap"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_snap(_pInst,_hsnap,_vsnap) 
{
    _hsnap = yyGetReal(_hsnap);
    _vsnap = yyGetReal(_vsnap);

    _pInst.x = Round(_pInst.x/_hsnap) * _hsnap;
    _pInst.y = Round(_pInst.y/_vsnap) * _vsnap;
    _pInst.bbox_dirty = true;
}

// #############################################################################################
/// Function:<summary>
///          	Wraps the instance when it has left the room to the other side. hor indicates 
///             whether to wrap horizontaly and vert indicates whether to wrap vertically. 
///             margin indicates how far the origin of the instance must be outside the room before 
///             the wrap happens. So it is a margin around the room. You typically use this function 
///             in the Outside event.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_hor"></param>
///			<param name="_vert"></param>
///			<param name="_margin"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_wrap(_inst,_hor,_vert,_margin) 
{
    _margin = yyGetReal(_margin);

    if (yyGetBool(_hor))
	{
		if (_inst.x < -_margin)
		{
		    _inst.SetPosition(_inst.x + g_RunRoom.GetWidth() + 2*_margin, _inst.y);
		}
		if (_inst.x > g_RunRoom.GetWidth() + _margin)
		{
		    _inst.SetPosition(_inst.x - g_RunRoom.GetWidth() - 2*_margin, _inst.y);
		}
	}

    if (yyGetBool(_vert))
	{
		if (_inst.y < -_margin)
		{
		    _inst.SetPosition(_inst.x, _inst.y + g_RunRoom.GetHeight() + 2*_margin);
		}
		if (_inst.y > g_RunRoom.GetHeight()+_margin)
		{
		    _inst.SetPosition(_inst.x, _inst.y - g_RunRoom.GetHeight() - 2*_margin);
		}
	}
}

// #############################################################################################
/// Function:<summary>
///          	Moves the instances with speed sp toward position (x,y).
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_speed"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_towards_point(_pInst,_x,_y,_speed) 
{
  _pInst.hspeed = yyGetReal(_x) - _pInst.x;
  _pInst.vspeed = yyGetReal(_y) - _pInst.y;
  _pInst.speed = yyGetReal(_speed);
}


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
function Bounce_Test(_pInst, _x, _y, _useall)
{
	if (_useall)
	{
		return place_empty(_pInst, _x, _y);
	}
	else
	{
		return place_free(_pInst, _x, _y);
	}
}
// #############################################################################################
/// Function:<summary>
///          	Bounces against solid instances, like the corresponding action. adv indicates 
///				whether to use advance bounce, that also takes slanted walls into account.
///          </summary>
///
/// In:		<param name="_inst">Instance pointer</param>
///			<param name="_advanced">indicates whether to use advance bouncing</param>
///			<param name="_useall">indicates whether to use all || just solid instances</param>
///				
// #############################################################################################
function Command_Bounce( _pInst, _advanced, _useall)
{
	var	i,n;
    var	xx,yy,xn,yn,ldir,rdir,dir;
    var bh,bv,ba,didbounce;

	didbounce=false;
    if( Bounce_Test(_pInst,_pInst.x,_pInst.y,_useall) == false)
	{ 
		_pInst.SetPosition(_pInst.xprevious,_pInst.yprevious); 
		didbounce = true; 
	}
    xx = _pInst.x;
	yy = _pInst.y;
    if( _advanced )
    {
		n = 18;
		dir = 10.0*Math.round( _pInst.direction / 10.0);
		ldir = dir;
		rdir = dir;
		for (i= 1;i<2*n;i++)
		{
			ldir = ldir - 180/n;
			xn = xx + _pInst.speed*Math.cos(ldir*Pi/180);
			yn = yy - _pInst.speed*Math.sin(ldir*Pi/180);
			if( Bounce_Test(_pInst,xn,yn,_useall)  ){
				break;
			}else {
				didbounce = true;
			}
		}

		for (i= 1;i<2*n;i++)
		{
			rdir = rdir + 180/n;
			xn = xx + _pInst.speed*Math.cos(rdir*Pi/180);
			yn = yy - _pInst.speed*Math.sin(rdir*Pi/180);
			if( Bounce_Test(_pInst,xn,yn,_useall) ){
				break;
			}else {
				didbounce = true;
			}
		}
		if (didbounce == true){
			_pInst.direction = 180 + (ldir + rdir) - dir;
		}
	}
    else
    {
		bh = Bounce_Test(_pInst,_pInst.x+_pInst.hspeed,_pInst.y,_useall);
		bv = Bounce_Test(_pInst,_pInst.x,_pInst.y+_pInst.vspeed,_useall);
		ba = Bounce_Test(_pInst,_pInst.x+_pInst.hspeed,_pInst.y+_pInst.vspeed,_useall);
		if ((bh == false) && ( bv == false))
		{ 
			_pInst.hspeed = -_pInst.hspeed; 
			_pInst.vspeed = -_pInst.vspeed;
		}
		else if ((bh == true)&& (bv == true) && (ba == false))
		{ 
			_pInst.hspeed = -_pInst.hspeed; 
			_pInst.vspeed = -_pInst.vspeed;
		}
		else if (bh == false) _pInst.hspeed = -_pInst.hspeed;
		else if (bv == false) _pInst.vspeed = -_pInst.vspeed;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Bounces against solid instances, like the corresponding action. adv indicates 
///             whether to use advance bounce, that also takes slanted walls into account.
///          </summary>
///
/// In:		<param name="_pInst">Instance to test</param>
///			<param name="_adv">Advanced bounce testing?</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_bounce_solid(_pInst,_adv) 
{
	Command_Bounce( _pInst, yyGetBool(_adv), false );
}

// #############################################################################################
/// Function:<summary>
///          	Bounces against all instances, instead of just the solid ones.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_adv"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_bounce_all(_pInst, _adv) 
{
	Command_Bounce( _pInst, yyGetBool(_adv), true );
}

var move_bounce = move_bounce_solid;


// #############################################################################################
/// Function:<summary>
///          	Decides which kind of contact test to perform depending on _useall
///          </summary>
// #############################################################################################
function Contact_TestFree(_inst, _x, _y, _useall)
{
    if (yyGetBool(_useall))
        return place_empty(_inst, _x, _y);
    else
        return place_free(_inst, _x, _y);
}

// #############################################################################################
/// Function:<summary>
///          	Moves the instance in the direction until just before a collision occurs
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="_maxdist"></param>
///         <param name="_useall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_contact(_inst, _dir, _maxdist, _useall)
{
    var steps;
	if (_maxdist <= 0)
		steps = 1000;
	else 
		steps = Round(_maxdist);
 
	var dx = Math.cos(_dir*Math.PI/180);
    var dy = -Math.sin(_dir*Math.PI/180);
    
    if (Contact_TestFree(_inst, _inst.x, _inst.y, _useall) == false)
		return;
		
    for (var i=1;i<=steps;i++)
    {
        if (Contact_TestFree(_inst, _inst.x+dx, _inst.y+dy, _useall))
		    _inst.SetPosition(_inst.x+dx,_inst.y+dy);
	    else 
		    return;
    }
}
function Command_InstancePlace(_pInst,_x,_y,_obj)
{
	var xx = _pInst.x;
	var yy = _pInst.y;
	_pInst.SetPosition(_x,_y);


	var pInstance = Instance_SearchLoop(_pInst, yyGetInt32(_obj), false, OBJECT_NOONE,
		function (_pInstance) {
			if (_pInstance.Collision_Instance(_pInst, true)) {
			    return _pInstance.id;
			}
			return OBJECT_NOONE;
		}
	);
	_pInst.SetPosition(xx, yy);
	return pInstance;
};

function move_and_collide(selfinst,dx,dy,ind,_iterations,xoff,yoff,_x_constraint,_y_constraint)
{
	var ret =[];
	if ((ind == OBJECT_SELF) && (selfinst != NULL)) ind = selfinst.id;
	if (ind == OBJECT_NOONE)
	{
		return ret;
	}

	var res = Command_InstancePlace(selfinst,selfinst.x,selfinst.y,ind);
	if(res!=OBJECT_NOONE)
		return ret;

	if ((dx == 0) && (dy == 0))
	{
		return ret;
	}

	var apply_x_constraints = false;
	var apply_y_constraints = false;
	var x_constraint = -1.0;
	var y_constraint = -1.0;
	
	if(_x_constraint!==undefined)
	{
		x_constraint = _x_constraint;
		if(x_constraint>0)
			apply_x_constraints = true;
	}
	if(_y_constraint!==undefined)
	{
		y_constraint = _y_constraint;
		if(y_constraint>0)
			apply_y_constraints = true;
	}

	var clamp_minx = selfinst.x; 
	var clamp_miny = selfinst.y; 

	var clamp_maxx = clamp_minx + x_constraint; 
	var clamp_maxy = clamp_miny + y_constraint; 
	clamp_minx -= x_constraint; 
	clamp_miny -= y_constraint; 

	var num_steps = 4;
	if(_iterations !== undefined)
		num_steps = _iterations;

	var check_perp = false;
	var delta_length = 0;
	var lxoff =0;
	var lyoff =0;
	if(xoff === undefined || yoff ===undefined || (xoff ===0 && yoff===0))
	{
		check_perp = true;
	}
	else
	{
		delta_length = Math.sqrt(xoff*xoff + yoff *yoff);
		lxoff = xoff/delta_length;
		lyoff = yoff/delta_length;

	}

	var steps = Math.sqrt(dx * dx + dy * dy);
	var ndx = dx/steps;
	var ndy = dy/steps;
	var root2over2 = 0.70710678118654; 
	var step_dist = steps/num_steps;
	var dist_to_travel = steps; 

	for (var i = 0; i < num_steps; i++)
	{
		var this_step_dist = step_dist; 
		if (dist_to_travel < this_step_dist) 
		{ 
			this_step_dist = dist_to_travel; 
			if(this_step_dist<=0)
				break;
		} 
 
		var tx = selfinst.x + ndx * this_step_dist; 
		var ty = selfinst.y + ndy * this_step_dist; 
 
		if (apply_x_constraints) 
		{ 
			tx = clamp(tx, clamp_minx, clamp_maxx); 
		} 
		if(apply_y_constraints) 
		{ 
			ty = clamp(ty, clamp_miny, clamp_maxy); 
		} 
 
		res = Command_InstancePlace(selfinst, tx, ty, ind);
		if (res == OBJECT_NOONE)
		{
			selfinst.x =tx;
			selfinst.y =ty;
			dist_to_travel -= this_step_dist; 
		}
		else 
		{
			if(!ret.includes(res))
				ret[ret.length]= res;
			
			var has_moved = false;

			if(check_perp)
			{
				for (var j = 1; j <num_steps-i+1; j++)
				{
					tx = selfinst.x + root2over2 * (ndx + j * ndy) * this_step_dist; 
					ty = selfinst.y + root2over2 * (ndy - j * ndx) * this_step_dist; 
 
					if (apply_x_constraints) 
					{ 
						tx = clamp(tx, clamp_minx, clamp_maxx); 
					} 
					if (apply_y_constraints) 
					{ 
						ty = clamp(ty, clamp_miny, clamp_maxy); 
					} 
 
					res = Command_InstancePlace(selfinst, tx, ty, ind);
					if (res==OBJECT_NOONE)
					{
						dist_to_travel -= this_step_dist*j; 
						has_moved = true;
						selfinst.x = tx;
						selfinst.y = ty;
						break;
					}
					else
					{
						if(!ret.includes(res))
							ret[ret.length]= res;
					}

					tx = selfinst.x + root2over2 * (ndx - j * ndy) * this_step_dist; 
					ty = selfinst.y + root2over2 * (ndy + j * ndx) * this_step_dist; 
 
					if (apply_x_constraints) 
					{ 
						tx = clamp(tx, clamp_minx, clamp_maxx); 
					} 
					if (apply_y_constraints) 
					{ 
						ty = clamp(ty, clamp_miny, clamp_maxy); 
					} 
 
					
					res = Command_InstancePlace(selfinst, tx, ty, ind);
					if (res==OBJECT_NOONE)
					{
						dist_to_travel -= this_step_dist*j; 
						has_moved = true;
						selfinst.x = tx;
						selfinst.y = ty;
						break;
					}
					else
					{
						if(!ret.includes(res))
							ret[ret.length]= res;
					}
				}
			}
			else
			{
				for (var j = 1; j < num_steps - i + 1; j++)
				{

					tx = selfinst.x + root2over2 * (ndx + j * lxoff) * this_step_dist; 
					ty = selfinst.y + root2over2 * (ndy + j * lyoff) * this_step_dist; 
 
					if (apply_x_constraints) 
					{ 
						tx = clamp(tx, clamp_minx, clamp_maxx); 
					} 
					if (apply_y_constraints) 
					{ 
						ty = clamp(ty, clamp_miny, clamp_maxy); 
					} 
					
					res = Command_InstancePlace(selfinst, tx, ty, ind);
					if (res==OBJECT_NOONE)
					{

						dist_to_travel -= this_step_dist*j; 
						has_moved = true;
						selfinst.x = tx;
						selfinst.y = ty;
						break;
					}
					else
					{
						if(!ret.includes(res))
							ret[ret.length]= res;
					}
				}
			}
			
			if(!has_moved)
				return ret;
		
		}
	}	
	return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Moves the instance in the direction until a contact position with a solid object 
///             is reached. If there is no collision at the current position, the instance is 
///             placed just before a collision occurs. If there already is a collision the instance 
///             is not moved. You can specify the maximal distance to move (use a negative number 
///             for an arbitrary distance).
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="_maxdist"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_contact_solid(_pInst, _dir, _maxdist) 
{
    move_contact(_pInst, yyGetReal(_dir), yyGetReal(_maxdist), false);
}

// #############################################################################################
/// Function:<summary>
///          	Same as the previous function but this time you stop at a contact with any object, 
///             not just solid objects.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="maxdist"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_contact_all(_inst, _dir, _maxdist) 
{
    move_contact(_inst, yyGetReal(_dir), yyGetReal(_maxdist), true);
}


// #############################################################################################
/// Function:<summary>
///             Common move_outside_{} code
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="_maxdist"></param>
///         <param name="_useall"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_outside(_inst, _dir, _maxdist, _useall)
{
    var	steps;
	if (_maxdist <= 0)
		steps = 1000;
	else 
		steps = Round(_maxdist);

	var dx = Math.cos(_dir*Math.PI/180);
    var dy = -sin(_dir*Math.PI/180);
    if (Contact_TestFree(_inst, _inst.x, _inst.y, _useall))
		return;
		
    for (var i=1; i <= steps; i++)
    {
      _inst.SetPosition(_inst.x+dx, _inst.y+dy);
      if (Contact_TestFree(_inst, _inst.x, _inst.y, _useall))
		  return;
    }
}

// #############################################################################################
/// Function:<summary>
///          	Moves the instance in the direction until it no longer lies within a solid object. 
///             If there is no collision at the current position the instance is not moved. You 
///             can specify the maximal distance to move (use a negative number for an arbitrary distance).
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="_maxdist"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_outside_solid(_inst, _dir, _maxdist) 
{   
    move_outside(_inst, yyGetReal(_dir), yyGetReal(_maxdist), false); 
}

// #############################################################################################
/// Function:<summary>
///          	Same as the previous function but this time you move until outside any object, 
///             not just solid objects.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_dir"></param>
///			<param name="_maxdist"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function move_outside_all(_inst, _dir,_maxdist) 
{
    move_outside(_inst, yyGetReal(_dir), yyGetReal(_maxdist), true);
}






// #############################################################################################
/// Function:<summary>
///          	Returns the distance of the bounding box of the current instance to (x,y). 
///             (If the instance does not have a sprite or mask, the result of the function is undefined.)
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function distance_to_point(_inst, _x, _y) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

	if (_inst.bbox_dirty) _inst.Compute_BoundingBox();

    var r = _inst.bbox;

    var xd = 0.0;
    var yd = 0.0;      

    if (_x > r.right )  { xd = _x - r.right; }
    if (_x < r.left )   { xd = _x - r.left; }
    if (_y > r.bottom ) { yd = _y - r.bottom; }
    if (_y < r.top )    { yd = _y - r.top; }
    
    return Math.sqrt((xd * xd) + (yd * yd));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the distance of the instance to the nearest instance of object obj. 
///             (If the instance or object does not have a sprite or mask, the result of the 
///             function is undefined.)
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function distance_to_object(_inst,_obj) 
{
    var dist = 10000000000;
    var i = 0;
    var dist = Instance_SearchLoop2(_inst, yyGetInt32(_obj), false, dist,
        function (_pInstance) {        	

        	if (_inst.bbox_dirty)       _inst.Compute_BoundingBox();
        	if (_pInstance.bbox_dirty)  _pInstance.Compute_BoundingBox();

            var r = _pInstance.bbox;
        	var s = _inst.bbox;        	

        	var xd = 0, yd = 0;
        	if (r.left > s.right ) xd = r.left - s.right;
	        if (r.right < s.left ) xd = r.right - s.left;
	        if (r.top > s.bottom ) yd = r.top - s.bottom;
	        if (r.bottom < s.top ) yd = r.bottom - s.top;
        	return Math.sqrt(xd * xd + yd * yd);
        }
    );
	return dist;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether there is nothing at position (x,y).
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function position_empty(_inst,_x,_y) 
{
	var dist = 10000000000;
	var i = 0;
	var found = Instance_SearchLoop(_inst, OBJECT_ALL, false, false,
        function (_pInstance) {
        	return _pInstance.Collision_Point(yyGetReal(_x), yyGetReal(_y), true);
        }
    );
	return !found;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether at position (x,y) there is an instance obj. obj can be an object, 
///             an instance id, or the keywords self, other, or all.
///          </summary>
///
/// In:		<param name="_inst"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function position_meeting(_pInst,_x,_y,_obj) 
{
    _obj = yyGetInt32(_obj);

	var Result,pInstance;

    Result=false;
 
    if (_obj == OBJECT_SELF) _obj = _pInst.id;

    var x = yyGetReal(_x);
    var y = yyGetReal(_y);

    x = ~~x;
    y = ~~y;

    var pool = GetWithArray(_obj);
	for (var inst = 0; inst < pool.length; inst++) 
	{
	    pInstance = pool[inst];
	    if ((pInstance.active) && (!pInstance.Marked)) {
	        if (pInstance.Collision_Point(x, y, true)) {
	            Result = true;
	            break;
	        }
	    }
	}
    return Result;
}


