
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Collision.js
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
///          	This function tests whether at point (x,y) there is a collision with entities of 
///             object obj. 
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
///			<param name="_notme"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function collision_point(_pInst, _x,_y,_obj,_prec,_notme) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _prec = yyGetBool(_prec);

    return Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x, _y, _prec,  
        function( _pInstance )
        {
            var coll = _pInstance.Collision_Point(_x,_y,_prec);
            if (!coll) {
                return OBJECT_NOONE;
            }
            return _pInstance.id;
        }
    );
}

// #############################################################################################
/// Function:<summary>
///            adds instance ids to destination list, sorted by distance from point _px,_py
///          </summary>
///
/// In:		 <param name="_instArray">array of yyInstance</param>
///			 <param name="_destList">ds list to append to</param>
///			 <param name="_px"></param>
///			 <param name="_py"></param>
// #############################################################################################
function AppendCollisionResults(_instArray, _destList, _px, _py) {
    var sortArr = [];
    for (var i = 0; i < _instArray.length; ++i) {
        var pInst = _instArray[i];
        var dx = pInst.x - _px;
        var dy = pInst.y - _py;
        var distSq = (dx * dx) + (dy * dy);
        var obj = { instId: pInst.id, dist: distSq };
        sortArr.push(obj);
    }
    sortArr.sort(function (a, b) { return a.dist - b.dist; });

    for (var i = 0; i < sortArr.length; ++i) {
        _destList.Add(sortArr[i].instId);
    }
}

function collision_point_list(_pInst, _x, _y, _obj, _prec, _notme, _list, _ordered)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _prec = yyGetBool(_prec);

    var list = g_ListCollection.Get(yyGetInt32(_list));
    if (!list) {
        yyError("Error: invalid ds_list ID (collision_point_list)");
        return 0;
    }
    var found = 0;
    var sort = yyGetBool(_ordered);
    var arr = [];
    Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x, _y, _prec,  
        function( _pInstance ) {
            if (_pInstance.Collision_Point(_x,_y,_prec)) {
                if (sort)
                    arr[found] = _pInstance;
                else
                    list.Add(_pInstance.id);
                found += 1;
            }
            return OBJECT_NOONE;
        }
    );

    if (sort)
        AppendCollisionResults(arr, list, _x, _y);

    return found;
}

// #############################################################################################
/// Function:<summary>
///          	This function tests whether there is a collision between the (filled) rectangle 
///             with the indicated opposite corners and entities of object obj. For example, 
///             you can use this to test whether an area is free of obstacles.
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
///			<param name="_notme"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function collision_rectangle(_pInst, _x1,_y1,_x2,_y2,_obj,_prec,_notme) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

	return Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,
        function (_pInstance) {
        	var coll = _pInstance.Collision_Rectangle(_x1, _y1, _x2, _y2, _prec);
        	if (!coll) {
        	    return OBJECT_NOONE;
        	}
        	return _pInstance.id;
        }
    );
}
function collision_rectangle_list(_pInst, _x1, _y1, _x2, _y2, _obj, _prec, _notme, _list, _ordered)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

    var list = g_ListCollection.Get(yyGetInt32(_list));
    if (!list) {
        yyError("Error: invalid ds_list ID (collision_rectangle_list)");
        return 0;
    }
    var found = 0;
    var sort = yyGetBool(_ordered);
    var arr = [];
    Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,
        function (_pInstance) {
        	if (_pInstance.Collision_Rectangle(_x1, _y1, _x2, _y2, _prec)) {
        	    if (sort)
        	        arr[found] = _pInstance;
                else
        	        list.Add(_pInstance.id);
                found += 1;
            }
            return OBJECT_NOONE;
        }
    );

    if (sort) {
        var cx = (_x1 + _x2) * 0.5;
        var cy = (_y1 + _y2) * 0.5;
        AppendCollisionResults(arr, list, cx,cy);
    }

    return found;
}

// #############################################################################################
/// Function:<summary>
///          	This function tests whether there is a collision between the (filled) circle 
///             centered at position (xc,yc) with the given radius and entities of object obj. 
///             For example, you can use this to test whether there is an object close to a 
///             particular location.
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_xc"></param>
///			<param name="_yc"></param>
///			<param name="_radius"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
///			<param name="_notme"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function collision_circle(_pInst, _xc,_yc,_radius,_obj,_prec,_notme) 
{
    return collision_ellipse(_pInst, 
                            _xc-_radius, _yc-_radius,
                            _xc+_radius, _yc+_radius,
                            _obj,
                            _prec,
                            _notme
                            );
}
function collision_circle_list(_pInst, _xc,_yc,_radius,_obj,_prec,_notme,_list,_ordered) {
    var list = g_ListCollection.Get(yyGetInt32(_list));
    if (!list) {
        yyError("Error: invalid ds_list ID (collision_circle_list)");
        return 0;
    }
    return collision_ellipse_list(_pInst,
                            _xc-_radius, _yc-_radius,
                            _xc+_radius, _yc+_radius,
                            _obj, _prec, _notme, _list,_ordered);
}

// #############################################################################################
/// Function:<summary>
///          	This function tests whether there is a collision between the (filled) ellipse 
///             with the indicated opposite corners and entities of object obj. 
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
///			<param name="_notme"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function collision_ellipse(_pInst, _x1,_y1,_x2,_y2,_obj,_prec,_notme) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

	return Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,  
        function(_pInstance) 
        {
            var coll = _pInstance.Collision_Ellipse(_x1,_y1,_x2,_y2,_prec);
        	if (!coll) {
        	    return OBJECT_NOONE;
        	}
        	return _pInstance.id;
        }
    );
}
function collision_ellipse_list(_pInst, _x1, _y1, _x2, _y2, _obj, _prec, _notme, _list, _ordered)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

    var list = g_ListCollection.Get(yyGetInt32(_list));
    if (!list) {
        yyError("Error: invalid ds_list ID (collision_ellipse_list)");
        return 0;
    }
    var found = 0;
    var sort = (_ordered >= 0.5) ? true : false;
    var arr = [];
	Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,  
        function(_pInstance) {
            if (_pInstance.Collision_Ellipse(_x1,_y1,_x2,_y2,_prec)) {
                if (sort)
                    arr[found] = _pInstance;
                else
                    list.Add(_pInstance.id);
                found += 1;
            }
        	return OBJECT_NOONE;
        }
    );

	if (sort) {
	    var cx = (_x1 + _x2) * 0.5;
	    var cy = (_y1 + _y2) * 0.5;
	    AppendCollisionResults(arr, list, cx,cy);
	}

    return found;
}

// #############################################################################################
/// Function:<summary>
///          	This function tests whether there is a collision between the line segment from 
///             (x1,y1) to (x2,y2) and entities of object obj. This is a powerful function. 
///             You can e.g. use it to test whether an instance can see another instance by 
///             checking whether the line segment between them intersects a wall.
///          </summary>
///
/// In:		<param name="_pInst"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_obj"></param>
///			<param name="_prec"></param>
///			<param name="_notme"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function collision_line(_pInst, _x1,_y1,_x2,_y2,_obj,_prec,_notme)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

    return Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,
        function(_pInstance) 
        {
            var coll = _pInstance.Collision_Line(_x1, _y1, _x2, _y2, _prec);
        	if (!coll) {
        	    return OBJECT_NOONE;        	
        	}
        	return _pInstance.id;
        }
    );
}
function collision_line_list(_pInst, _x1,_y1,_x2,_y2,_obj,_prec,_notme,_list,_ordered)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _prec = yyGetBool(_prec);

    var list = g_ListCollection.Get(yyGetInt32(_list));
    if (!list) {
        yyError("Error: invalid ds_list ID (collision_line_list)");
        return 0;
    }
    var found = 0;
    var sort = yyGetBool(_ordered);
    var arr = [];
    Instance_SearchLoop(_pInst, yyGetInt32(_obj), yyGetBool(_notme), OBJECT_NOONE, _x1, _y1, _x2, _y2, _prec,
        function(_pInstance) {
            if (_pInstance.Collision_Line(_x1, _y1, _x2, _y2, _prec)) {
                if (sort)
                    arr[found] = _pInstance;
                else
                    list.Add(_pInstance.id);
                found += 1;
            }
        	return OBJECT_NOONE;
        }
    );

    if (sort)
        AppendCollisionResults(arr, list, _x1, _y1);

    return found;
}




// #############################################################################################
/// Function:<summary>
///             Test to see if a point is inside a rectangle
///          </summary>
///
/// In:		 <param name="Result"></param>
///			 <param name="selfinst"></param>
///			 <param name="otherinst"></param>
///			 <param name="argc"></param>
///			 <param name="arg"></param>
/// Out:	 <returns>
///				true for yes, false if no
///			 </returns>
// #############################################################################################
function point_in_rectangle(_px, _py, _x1, _y1, _x2, _y2)
{
    _px = yyGetReal(_px);
    _py = yyGetReal(_py);

	// Test point in rect
    if( ( _px >= yyGetReal(_x1) && _px <= yyGetReal(_x2) ) && ( _py >= yyGetReal(_y1) && _py <= yyGetReal(_y2) ) ){
	    return true;
	}
	return false;
}


// #############################################################################################
/// Function:<summary>
///          	Test to see if a rectangle is inside another rectangle
///          </summary>
///
/// In:		<param name="_px1"></param>
///			<param name="_py1"></param>
///			<param name="_px2"></param>
///			<param name="_py2"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				0 for no
///             1 for yes
///             2 for overlapping
///			</returns>
// #############################################################################################
function rectangle_in_rectangle(_px1, _py1, _px2, _py2, _x1, _y1, _x2, _y2)
{
    _px1 = yyGetReal(_px1);
    _py1 = yyGetReal(_py1);
    _px2 = yyGetReal(_px2);
    _py2 = yyGetReal(_py2);

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    var IN = 0;

    var swap = 0; // ensure bottom left is actually bottom left.
    if (_px1 > _px2) { swap = _px1; _px1 = _px2; _px2 = swap; }
    if (_py1 > _py2) { swap = _py1; _py1 = _py2; _py2 = swap; }
    if (_x1 > _x2) { swap = _x1; _x1 = _x2; _x2 = swap; }
    if (_y1 > _y2) { swap = _y1; _y1 = _y2; _y2 = swap; }
    
    // Test point in rect
    if ((_px1 >= _x1 && _px1 <= _x2) && (_py1 >= _y1 && _py1 <= _y2)) IN |= 1;
    if ((_px2 >= _x1 && _px2 <= _x2) && (_py1 >= _y1 && _py1 <= _y2)) IN |= 2;
    if ((_px2 >= _x1 && _px2 <= _x2) && (_py2 >= _y1 && _py2 <= _y2)) IN |= 4;
    if ((_px1 >= _x1 && _px1 <= _x2) && (_py2 >= _y1 && _py2 <= _y2)) IN |= 8;

    var result = 0;
    
    if (IN == 15) {
        result = 1.0;
    } else if (IN == 0) {
        result = 0.0;
        // now for edge cases.. source being intersected by dest 
        IN = 0;
        if ((_x1 >= _px1 && _x1 <= _px2) && (_y1 >= _py1 && _y1 <= _py2)) IN |= 1;
        if ((_x2 >= _px1 && _x2 <= _px2) && (_y1 >= _py1 && _y1 <= _py2)) IN |= 2;
        if ((_x2 >= _px1 && _x2 <= _px2) && (_y2 >= _py1 && _y2 <= _py2)) IN |= 4;
        if ((_x1 >= _px1 && _x1 <= _px2) && (_y2 >= _py1 && _y2 <= _py2)) IN |= 8;
        if (0 != IN)
            result = 2.0;
        else { // lets try another case, source goes over dest in x axis
            IN = 0;
            if ((_x1 >= _px1 && _x1 <= _px2) && (_py1 >= _y1 && _py1 <= _y2)) IN |= 1;
            if ((_x2 >= _px1 && _x2 <= _px2) && (_py1 >= _y1 && _py1 <= _y2)) IN |= 2;
            if ((_x2 >= _px1 && _x2 <= _px2) && (_py2 >= _y1 && _py2 <= _y2)) IN |= 4;
            if ((_x1 >= _px1 && _x1 <= _px2) && (_py2 >= _y1 && _py2 <= _y2)) IN |= 8;
            if (0 != IN)
                result = 2.0;
            else { // one more case, source goes over dest in y axis
                IN = 0;
                if ((_px1 >= _x1 && _px1 <= _x2) && (_y1 >= _py1 && _y1 <= _py2)) IN |= 1;
                if ((_px2 >= _x1 && _px2 <= _x2) && (_y1 >= _py1 && _y1 <= _py2)) IN |= 2;
                if ((_px2 >= _x1 && _px2 <= _x2) && (_y2 >= _py1 && _y2 <= _py2)) IN |= 4;
                if ((_px1 >= _x1 && _px1 <= _x2) && (_y2 >= _py1 && _y2 <= _py2)) IN |= 8;
                if (0 != IN)
                    result = 2.0;
            }
        }
    } else {
        result = 2.0;
    }

    return result;
}


// #############################################################################################
/// Function:<summary>
///          	Test if a point lies inside a triangle
///          </summary>
///
/// In:		<param name="px">Point X</param>
///			<param name="py">Point Y</param>
///			<param name="x1">Trangle X1</param>
///			<param name="y1">Trangle Y1</param>
///			<param name="x2">Trangle X2</param>
///			<param name="y2">Trangle Y2</param>
///			<param name="x3">Trangle X3</param>
///			<param name="y3">Trangle Y3</param>
/// Out:	<returns>
///				true for yes, false for no
///			</returns>
// #############################################################################################
function PointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    var v0x = x3 - x1;
    var v1x = x2 - x1;
    var v2x = px - x1;

    var v0y = y3 - y1;
    var v1y = y2 - y1;
    var v2y = py - y1;

    var dot00 = (v0x * v0x) + (v0y * v0y);
    var dot01 = (v0x * v1x) + (v0y * v1y);
    var dot02 = (v0x * v2x) + (v0y * v2y);
    var dot11 = (v1x * v1x) + (v1y * v1y);
    var dot12 = (v1x * v2x) + (v1y * v2y);

    var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);

    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return ((u >= 0.0) && (v >= 0.0) && (u + v < 1.0));
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_px"></param>
///			<param name="_py"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_x3"></param>
///			<param name="_y3"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function point_in_triangle(_px, _py, _x1, _y1, _x2, _y2, _x3, _y3) {
    return PointInTriangle(yyGetReal(_px), yyGetReal(_py), yyGetReal(_x1), yyGetReal(_y1), yyGetReal(_x2), yyGetReal(_y2), yyGetReal(_x3), yyGetReal(_y3));
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_px"></param>
///			<param name="_py"></param>
///			<param name="_cx"></param>
///			<param name="_cy"></param>
///			<param name="_rad_squared"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function PointInCircle(_px, _py, _cx, _cy, _rad_squared )
{
	var d = (((_px-_cx)*(_px-_cx))+((_py-_cy)*(_py-_cy)));
	if( d<=_rad_squared ) return true;
	return false;
}

function point_in_circle(_px, _py, _cx, _cy, _rad) {
    return PointInCircle(yyGetReal(_px), yyGetReal(_py), yyGetReal(_cx), yyGetReal(_cy), yyGetReal(_rad) * yyGetReal(_rad));
}


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_sx1"></param>
///			<param name="_sy1"></param>
///			<param name="_sx2"></param>
///			<param name="_sy2"></param>
///			<param name="_cx"></param>
///			<param name="_cy"></param>
///			<param name="_rad"></param>
/// Out:	<returns>
///				0 for no
///             1 for yes
///             2 for overlapping
///			</returns>
// #############################################################################################
function rectangle_in_circle(_sx1, _sy1, _sx2, _sy2, _cx, _cy, _rad) 
{
	var x1,y1,x2,y2,cx,cy,rad,intersectx,intersecty;

	x1 = yyGetReal(_sx1);
	y1 = yyGetReal(_sy1);
	x2 = yyGetReal(_sx2);
	y2 = yyGetReal(_sy2);

	cx = yyGetReal(_cx);
	cy = yyGetReal(_cy);
	rad = yyGetReal(_rad);
	var rad_squared = rad*rad;


	// Get nearest point on rects edge
	intersectx = cx;
	intersecty = cy;
	if( intersectx<x1 ) intersectx=x1;
	if( intersectx>x2 ) intersectx=x2;
	if( intersecty<y1 ) intersecty=y1;
	if( intersecty>y2 ) intersecty=y2;

	var dist = (intersectx - cx) * (intersectx - cx) + (intersecty - cy) * (intersecty - cy);
	var Result = 0.0;
	if( dist<=rad_squared ){
	    Result = 2.0;
		if( ( PointInCircle(x1,y1, cx,cy,rad_squared))  && 
		    ( PointInCircle(x2,y1, cx,cy,rad_squared)) &&
		    ( PointInCircle(x2,y2, cx,cy,rad_squared)) &&
		    ( PointInCircle(x1,y2, cx,cy,rad_squared)) )
		   {
			Result = 1.0;
		}
    }
    return Result;
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_sx1"></param>
///			<param name="_sy1"></param>
///			<param name="_sx2"></param>
///			<param name="_sy2"></param>
///			<param name="_cx"></param>
///			<param name="_cy"></param>
///			<param name="_rad"></param>
/// Out:	<returns>
///				0 for no
///             1 for yes
///             2 for overlapping
///			</returns>
// #############################################################################################
function circle_in_rectangle(_sx1, _sy1, _sx2, _sy2, _cx, _cy, _rad) 
{
    var x1, y1, x2, y2, cx, cy, rad, intersectx, intersecty;

    x1 = yyGetReal(_sx1);
    y1 = yyGetReal(_sy1);
    x2 = yyGetReal(_sx2);
    y2 = yyGetReal(_sy2);

    cx = yyGetReal(_cx);
    cy = yyGetReal(_cy);
    rad = yyGetReal(_rad);
    var rad_squared = rad * rad;


    // Get nearest point on rects edge
    intersectx = cx;
    intersecty = cy;
    if (intersectx < x1) intersectx = x1;
    if (intersectx > x2) intersectx = x2;
    if (intersecty < y1) intersecty = y1;
    if (intersecty > y2) intersecty = y2;

    var dist = (intersectx - cx) * (intersectx - cx) + (intersecty - cy) * (intersecty - cy);
    var Result = 0.0;
    if (dist <= rad_squared) {
        Result = 2.0;
        if ((Math.abs(cx - x1) > rad) && (Math.abs(cx - x2) > rad) && (Math.abs(cy - y1) > rad) && (Math.abs(cy - y2) > rad)) {
            Result = 1.0;
        }
    }
    return Result;
}

function get_axis(p0, p1)
{
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    var axis = { "x": -dy, "y": dx };
    return axis;
}

function project_pts(pts, num, axis)
{
    var min, max;
    var d = pts[0].x * axis.x + pts[0].y * axis.y;
    min = max = d;

    for (var i = 1; i < num; ++i)
    {
        d = pts[i].x * axis.x + pts[i].y * axis.y;
        if (d < min) min = d;
        else if (d > max) max = d;
    }
    var proj = { "min": min, "max": max };
    return proj;
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_sx1"></param>
///			<param name="_sy1"></param>
///			<param name="_sx2"></param>
///			<param name="_sy2"></param>
///			<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_x3"></param>
///			<param name="_y3"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function rectangle_in_triangle(_sx1, _sy1, _sx2, _sy2, _x1, _y1, _x2, _y2, _x3, _y3) 
{
    _sx1 = yyGetReal(_sx1);
    _sy1 = yyGetReal(_sy1);
    _sx2 = yyGetReal(_sx2);
    _sy2 = yyGetReal(_sy2);
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _x3 = yyGetReal(_x3);
    _y3 = yyGetReal(_y3);

    var IN = 0;
    if (PointInTriangle(_sx1, _sy1, _x1, _y1, _x2, _y2, _x3, _y3)) IN |= 1;
    if (PointInTriangle(_sx2, _sy1, _x1, _y1, _x2, _y2, _x3, _y3)) IN |= 2;
    if (PointInTriangle(_sx2, _sy2, _x1, _y1, _x2, _y2, _x3, _y3)) IN |= 4;
    if (PointInTriangle(_sx1, _sy2, _x1, _y1, _x2, _y2, _x3, _y3)) IN |= 8;
    if (IN == 15) {
        return 1.0;
    } else if (IN != 0) {
        return 2.0;
    }

    //SAT test to catch intersection cases where no rect points in tri - 5 axes to test
    var pt = []; //tri pts
    pt[0] = { "x": _x1, "y": _y1 };
    pt[1] = { "x": _x2, "y": _y2 };
    pt[2] = { "x": _x3, "y": _y3 };

    var axes = [];  //x,y,tri axes
    axes[0] = { "x": 0, "y": 1 };
    axes[1] = { "x": 1, "y": 0 };
    axes[2] = get_axis(pt[0], pt[1]);
    axes[3] = get_axis(pt[1], pt[2]);
    axes[4] = get_axis(pt[2], pt[0]);

    var bpt = []; //box pts
    bpt[0] = { "x": _sx1, "y": _sy1 };
    bpt[1] = { "x": _sx2, "y": _sy1 };
    bpt[2] = { "x": _sx1, "y": _sy2 };
    bpt[3] = { "x": _sx2, "y": _sy2 };

    for (var i = 0; i < 5; ++i)
    {
        var axis = axes[i];
        var tproj = project_pts(pt, 3, axis);
        var bproj = project_pts(bpt, 4, axis);
        if (bproj.max <= tproj.min || tproj.max <= bproj.min) {
            return 0.0; //separating axis found
        }
    }
    return 2.0; //no separating axes, overlapping
}
