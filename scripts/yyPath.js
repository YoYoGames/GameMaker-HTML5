
// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyPath.js
// Created:			13/06/2011
// Author:			Mike
// Project:			GameMaker HTML5
// Description:
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 13/06/2011		V1.0		MJD		1st version
//
// **********************************************************************************************************************

var P_STRAIGHT = 0,
	P_CURVED = 1;

var g_Path_MasterID = 0;

// #############################################################################################
/// Function:<summary>
///          	Create an Internal point (or waypoint)
///          </summary>
// #############################################################################################
/**@constructor*/
function yyIntPoint( _x, _y, _speed )
{
	this.x = _x;
	this.y = _y;				// its position
	this.speed = _speed;        // its speed
	this.l = 0;					// its length from the start (not used in waypoints)
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
// #############################################################################################
/**@constructor*/
function yyPath() 
{
    this.__type = "[Path]";
    this.name = "";
	this.id = g_Path_MasterID++;
	this.kind = 0; 				// kind of path
	this.closed = 1; 			// whether the path must be closed
	this.precision = 4; 		// number of subdivisions for smooth paths
	this.Clear();
}


// #############################################################################################
/// Property: <summary>
///           	Reset the path
///           </summary>
// #############################################################################################
yyPath.prototype.Clear = function () {	
	
	this.points = [];				// Any reason NOT to create the array?
	this.intpoints = [];
	this.count = 0; 				// number of waypoints
	this.intcount = 0; 				// number of internal points
	this.length = 0; 				// length of the path
};

// #############################################################################################
/// Function:<summary>
///				Returns the right waypoint
///          </summary>
///
/// In:		 <param name="index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/**@this {yyPath}*/
//function Path_GetPoint( _index )
//{
//	if  ( (_index < 0) || (_index >= count) )
//	{
//		return yyIntPoint(0,0,0);
//	}
//	return this.points[_index];
//}


// #############################################################################################
/// Function:<summary>
///				Sets the kind of path
///          </summary>
///
/// In:		 <param name="val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.SetKind = function (_val) {
	if ((_val < 0) || (_val > 1))
	{
		this.kind = 0;
	}
	else
	{
		this.kind = _val;
	}

	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///				Sets the closed property of the path
///          </summary>
///
/// In:		 <param name="val"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.SetClosed = function (_val) {
	this.closed = _val;
	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///				Sets the precision of the path
///          </summary>
///
/// In:		 <param name="val"></param>
// #############################################################################################
yyPath.prototype.SetPrecision = function (_val) {
	if (_val < 0) _val = 0;
	if (_val > 8) _val = 8;
	this.precision = _val;
	this.ComputeInternal();
};

// #############################################################################################
/// Function:<summary>
///             computes the length fields for the internal path
///          </summary>
// #############################################################################################
yyPath.prototype.ComputeLength = function () {

	var i = 0;
	this.length = 0;
	if (this.intcount <= 0) return;
	this.intpoints[0].l = 0;
	for (i = 1; i < this.intcount; i++)
	{
		this.intpoints[i].l = this.length = this.length + sqrt(Sqr(this.intpoints[i].x - this.intpoints[i - 1].x) + Sqr(this.intpoints[i].y - this.intpoints[i - 1].y));
	}
};


// #############################################################################################
/// Function:<summary>
///             // Adds an internal point to the set
///          </summary>
///
/// In:		 <param name="xx"></param>
///			 <param name="yy"></param>
///			 <param name="ss"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.AddInternalPoint = function (_xx, _yy, _ss) {

	this.intcount++;
	var pWith = new yyIntPoint();
	this.intpoints[this.intcount - 1] = pWith;
	pWith.x = _xx;
	pWith.y = _yy;
	pWith.speed = _ss;	
};



// #############################################################################################
/// Function:<summary>
///				computes a linear internal path
///          </summary>
// #############################################################################################
yyPath.prototype.ComputeLinear = function () {

	this.intcount = 0;
	if (this.count <= 0) return;
	for (var i = 0; i < this.count; i++)
	{
		this.AddInternalPoint(this.points[i].x, this.points[i].y, this.points[i].speed);
	}
	if (this.closed)
	{
		this.AddInternalPoint(this.points[0].x, this.points[0].y, this.points[0].speed);
	}
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="depth"></param>
///			 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="s1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="s2"></param>
///			 <param name="x3"></param>
///			 <param name="y3"></param>
///			 <param name="s3"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.HandlePiece = function (_depth, _x1, _y1, _s1, _x2, _y2, _s2, _x3, _y3, _s3) {
	if (_depth == 0) return;

	var mx = (_x1 + _x2 + _x2 + _x3) / 4.0;
	var my = (_y1 + _y2 + _y2 + _y3) / 4.0;
	var ms = (_s1 + _s2 + _s2 + _s3) / 4.0;

	if (Sqr(_x2 - _x1) + Sqr(_y2 - _y1) > 16.0)
	{
		this.HandlePiece(_depth - 1, _x1, _y1, _s1, (_x2 + _x1) / 2.0, (_y2 + _y1) / 2.0, (_s2 + _s1) / 2.0, mx, my, ms);
	}

	this.AddInternalPoint(mx, my, ms);
	if (Sqr(_x2 - _x3) + Sqr(_y2 - _y3) > 16.0)
	{
		this.HandlePiece(_depth - 1, mx, my, ms, (_x3 + _x2) / 2.0, (_y3 + _y2) / 2.0, (_s3 + _s2) / 2.0, _x3, _y3, _s3);
	}
};


// #############################################################################################
/// Function:<summary>
///             computes a curved internal path
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.ComputeCurved = function () {
	var i = 0;
	var n = 0;
	this.intcount = 0;

	if (this.count <= 0) return;
	if (!this.closed)
	{
		this.AddInternalPoint(this.points[0].x, this.points[0].y, this.points[0].speed);
	}
	if (this.closed)
	{
		n = this.count - 1;
	} else
	{
		n = this.count - 3;
	}

	for (i = 0; i <= n; i++)
	{
		var point1 = this.points[i % this.count];
		var point2 = this.points[(i + 1) % this.count];
		var point3 = this.points[(i + 2) % this.count];
		this.HandlePiece(this.precision,
						(point1.x + point2.x) / 2.0, (point1.y + point2.y) / 2.0, (point1.speed + point2.speed) / 2.0,
						 point2.x, point2.y, point2.speed,
						(point2.x + point3.x) / 2.0, (point2.y + point3.y) / 2.0, (point2.speed + point3.speed) / 2.0
						);
	}

	if (!this.closed)
	{
		this.AddInternalPoint(this.points[this.count - 1].x, this.points[this.count - 1].y, this.points[this.count - 1].speed);
	}
	else
	{
		this.AddInternalPoint(this.intpoints[0].x, this.intpoints[0].y, this.intpoints[0].speed);
	}
};

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
yyPath.prototype.ComputeInternal = function () {
	if (this.kind == 1)
	{
		this.ComputeCurved();
	}
	else
	{
		this.ComputeLinear();
	}
	this.ComputeLength();
};

// #############################################################################################
/// Function:<summary>
///          	Create a PATH object
///          </summary>
///
/// In:		<param name="_pStorage"></param>
/// Out:	<returns>
///				The new path object
///			</returns>
// #############################################################################################
function CreatePathFromStorage( _pStorage ) 
{
	var pPath = new yyPath();
	
	if ((_pStorage != undefined) && (_pStorage != null))
	{
	    if( _pStorage.precision!=undefined )    { pPath.precision = _pStorage.precision; }
	    if( _pStorage.closed!=undefined )       { pPath.closed = _pStorage.closed; }
	    if( _pStorage.kind!=undefined )         { pPath.kind = _pStorage.kind; }
	    if( _pStorage.pName!=undefined )        { pPath.name = _pStorage.pName; }
	    if( _pStorage.points!=undefined )       { pPath.count = _pStorage.points.length; }

	    // Copy points over	    
	    for (var p = 0; p < _pStorage.points.length; p++)
	    {
	    	var pPoint = _pStorage.points[p];
	    	var pNewPoint = new yyIntPoint( pPoint.x, pPoint.y, pPoint.speed );
	    	pPath.points[pPath.points.length] = pNewPoint;
	    }

	    pPath.ComputeInternal();
	}

	return pPath;
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="sp"></param>
/// Out:	 <returns>
///				Returns the point. DO NOT MODIFY!!!
///			 </returns>
// #############################################################################################
var g_pPathNode = new yyIntPoint(0,0,100);
yyPath.prototype.GetPosition = function (_ind) {
	var pos = 0;
	// easy cases
	if (this.intcount <= 0)
	{
		g_pPathNode.x = 0;
		g_pPathNode.y = 0;
		g_pPathNode.speed = 0;
		return g_pPathNode;
	}
	if ((this.intcount == 1) || (this.length == 0) || (_ind <= 0))
	{
		return this.intpoints[0]; 		// Just return the actual point- DO NOT MODIFY!!
	}

	if (_ind >= 1)
	{
		return this.intpoints[this.intcount - 1]; // Just return the actual point- DO NOT MODIFY!!
	}


	// get the right interval
	var l = this.length * _ind;
	pos = 0;


	// MJD = looks slow.... whatever it is...
	// TODO: Use binary search ???
	while ((pos < this.intcount - 2) && (l >= this.intpoints[pos + 1].l))
	{
		pos++;
	}

	// find the right coordinate
	var pNode = this.intpoints[pos];
	l = l - pNode.l;
	var w = this.intpoints[pos + 1].l - pNode.l;

	if (w != 0)
	{
		pos++;
		g_pPathNode.x = pNode.x + l * (this.intpoints[pos].x - pNode.x) / w;
		g_pPathNode.y = pNode.y + l * (this.intpoints[pos].y - pNode.y) / w;
		g_pPathNode.speed = pNode.speed + l * (this.intpoints[pos].speed - pNode.speed) / w;
		pNode = g_pPathNode;
	}
	return pNode;
};


// #############################################################################################
/// Function:<summary>
///				Returns the x-coordinate of position ind (0..1) on the path
///          </summary>
///
/// In:		 <param name="ind">index to get X from</param>
/// Out:	 <returns>
///				"X" position
///			 </returns>
// #############################################################################################
yyPath.prototype.XPosition = function (_ind) {
	var p = this.GetPosition(_ind);
	return p.x;
};

// #############################################################################################
/// Function:<summary>
///				Returns the x-coordinate of position ind (0..1) on the path
///          </summary>
///
/// In:		 <param name="ind">index to get X from</param>
/// Out:	 <returns>
///				"X" position
///			 </returns>
// #############################################################################################
yyPath.prototype.YPosition = function (_ind) {
	var p = this.GetPosition(_ind);
	return p.y;
};

// #############################################################################################
/// Function:<summary>
///				Returns the x-coordinate of position ind (0..1) on the path
///          </summary>
///
/// In:		 <param name="ind">index to get X from</param>
/// Out:	 <returns>
///				"X" position
///			 </returns>
// #############################################################################################
yyPath.prototype.SpeedPosition = function (_ind) {
	var p = this.GetPosition(_ind);
	return p.speed;
};




// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_pPath"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
yyPath.prototype.Assign = function (_pPath) {
	this.points = null; 			// the waypoints on the path
	this.intpoints = null; 		// internal representation of the path
	this.name = _pPath.name;
	this.count = _pPath.count;
	this.kind = _pPath.kind;
	this.closed = _pPath.closed;
	this.precision = _pPath.precision;
	this.intcount = _pPath.intcount;
	this.length = _pPath.length;

	// Copy points...
	this.points = [];
	var pClonePoint;
	var pPoint;
	var pPoints = _pPath.points;
	var dest = this.points;
	for (var p = 0; p < pPoints.length; p++)
	{
		pPoint = pPoints[p];
		pClonePoint = new yyIntPoint(pPoint.x, pPoint.y, pPoint.speed);
		pClonePoint.l = pPoint.l;
		dest[dest.length] = pClonePoint;
	}


	// Copy waypoints...
	this.intpoints = [];
	var pIntpoints = _pPath.intpoints;
	var dest = this.intpoints;
	for (var p = 0; p < pIntpoints.length; p++)
	{
		pPoint = pIntpoints[p];
		pClonePoint = new yyIntPoint(pPoint.x, pPoint.y, pPoint.speed);
		pClonePoint.l = pPoint.l;
		dest[dest.length] = pClonePoint;
	}
};



// #############################################################################################
/// Function:<summary>
///				Shifts the point over the indicated vector
///          </summary>
///
/// In:		 <param name="xtr"></param>
///			 <param name="ytr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.Shift= function(_xoff, _yoff)
{
	for ( var i = 0 ; i<=this.count-1 ; i++ )
	{
		this.points[i].x += _xoff;
		this.points[i].y += _yoff;
	}
	this.ComputeInternal();
};

// #############################################################################################
/// Function:<summary>
///				Returns the center of the path
///          </summary>
///
/// In:		 <param name="xx"></param>
///			 <param name="yy"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.Center = function( )
{
	var xmin = 100000000;
	var xmax = -100000000;
	var ymin = 100000000;
	var ymax = -100000000;

	for(var i = 0 ; i<= this.count-1 ; i++ )
	{
		if ( this.points[i].x < xmin ) xmin = this.points[i].x;
		if ( this.points[i].x > xmax ) xmax = this.points[i].x;
		if ( this.points[i].y < ymin ) ymin = this.points[i].y;
		if ( this.points[i].y > ymax ) ymax = this.points[i].y;
	}

	return new yyIntPoint((xmin+xmax)/2.0,  (ymin+ymax)/2.0,  0);
};



// #############################################################################################
/// Function:<summary>
///				Reverses the path
///          </summary>
// #############################################################################################
yyPath.prototype.Reverse = function()
{
	if ( this.count <= 1 ) return;


    var NewPoint = [];
	for(var  i=this.count-1; i>=0;i--)
	{
	    // Take from the END of points, and add to the start of NewPoint.
	    NewPoint[NewPoint.length] = this.points[i];
	}
	// Then simply assign new reveresed array.
    this.points = NewPoint;

    // and recompute
	this.ComputeInternal();
};



// #############################################################################################
/// Function:<summary>
///             Mirrors the path horizontally
///          </summary>
// #############################################################################################
yyPath.prototype.Mirror = function()
{
	var pCenter = this.Center();
	this.Shift(-pCenter.x,-pCenter.y);

	for(var i = 0 ; i<=this.count-1; i++ )
	{
		this.points[i].x = -this.points[i].x;
	}
	this.Shift(pCenter.x,pCenter.y);
	this.ComputeInternal();
};



// #############################################################################################
/// Function:<summary>
///				Flips the path vertically
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.Flip = function()
{
	var pCenter = this.Center();
	this.Shift(-pCenter.x,-pCenter.y);

	for(var i = 0 ; i<=this.count-1; i++ )
	{
		this.points[i].y = -this.points[i].y;
	}
	this.Shift(pCenter.x,pCenter.y);
	this.ComputeInternal();
};




// #############################################################################################
/// Function:<summary>
///				Rotates the path over the given angle
///          </summary>
///
/// In:		 <param name="_angle"></param>
// #############################################################################################
yyPath.prototype.Rotate = function(_angle)
{
	var pCenter = this.Center();
	this.Shift(-pCenter.x,-pCenter.y);


	for(var i = 0 ; i<=this.count-1; i++ )
	{
		var xx = this.points[i].x;
		var yy = this.points[i].y;
		var th = _angle * Math.PI/180.0;
		this.points[i].x = xx*Math.cos(th) + yy*Math.sin(th) ;
		this.points[i].y = yy*Math.cos(th) - xx*Math.sin(th);
	}

	this.Shift(pCenter.x,pCenter.y);
	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///				Scales the path in the indicated way
///          </summary>
///
/// In:		 <param name="xscale">Scale on X</param>
///			 <param name="yscale">Scale on Y</param>
// #############################################################################################
yyPath.prototype.Scale = function (_xscale, _yscale)
{
	var pCenter = this.Center();
	this.Shift(-pCenter.x,-pCenter.y);


	for(var i = 0 ; i<=this.count-1; i++ )
	{
		this.points[i].x = this.points[i].x * _xscale;
		this.points[i].y = this.points[i].y * _yscale;
	}
	
	this.Shift(pCenter.x,pCenter.y);
	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///				Changes a point in the set; return the index
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="xx"></param>
///			 <param name="yy"></param>
///			 <param name="ss"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.ChangePoint = function (_ind, _xx, _yy, _ss) {
	if (_ind < 0 || _ind >= this.count) return;

	this.points[_ind].x = _xx;
	this.points[_ind].y = _yy;
	this.points[_ind].speed = _ss;

	this.ComputeInternal();
};





// #############################################################################################
/// Function:<summary>
///				Deletes a point in the set
///          </summary>
///
/// In:		 <param name="ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.DeletePoint = function(_ind)
{
	if (_ind < 0 || _ind >= this.count) return;

	this.points.splice(_ind,1);
	this.count--;
	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///				Copies the contents of path at the end of the path
///          </summary>
///
/// In:		 <param name="path"></param>
// #############################################################################################
yyPath.prototype.Append = function (_pPath) {
	if (_pPath.count == 0) return;

	for (var i = 0; i <= _pPath.count - 1; i++)
	{
		this.points[this.points.length] = _pPath.points[i];
		this.count++;
	}

	this.ComputeInternal();
};


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="xx"></param>
///			 <param name="yy"></param>
///			 <param name="ss"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.InsertPoint = function (_ind, _xx, _yy, _ss) {
	if (_ind < 0 || _ind > this.count) return;
	this.count++;

	var pPoint = new yyIntPoint(_xx, _yy, _ss);
	this.points.splice(_ind, 0, pPoint);

	this.ComputeInternal();
};



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="xx"></param>
///			 <param name="yy"></param>
///			 <param name="ss"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyPath.prototype.AddPoint = function (_xx, _yy, _ss) {
	var pPoint = new yyIntPoint(_xx, _yy, _ss);
	if (!this.points) this.points = [];
	this.points[this.points.length] = pPoint;
	this.count++;

	this.ComputeInternal();
};









// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/**@constructor*/
function yyPathManager() 
{
	this.Paths = [];
	g_Path_MasterID = 0;
}


// #############################################################################################
/// Function:<summary>
///          	Add a path into the dictionary.
///          </summary>
///
/// In:		<param name="_pPath"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
yyPathManager.prototype.Add = function (_pPath) {
	this.Paths[_pPath.id] = _pPath;
};


// #############################################################################################
/// Function:<summary>
///          	Add a path into the dictionary.
///          </summary>
///
/// In:		<param name="_pPath"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
yyPathManager.prototype.Delete = function (_pPath) {
	this.Paths[_pPath.id] = undefined;
};

// #############################################################################################
/// Function:<summary>
///             Retrieves an array of all path asset IDs.
///          </summary>
///
/// Out:	 <returns>
///				An array of all path asset IDs.
///			 </returns>
// #############################################################################################
yyPathManager.prototype.List = function () {
	var ids = [];
	for (var i = 0; i < this.Paths.length; ++i)
	{
		if (this.Paths[i])
		{
			ids.push(i);
		}
	}
	return ids;
};
