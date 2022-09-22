
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	Vector3.js
// Created:	        02/06/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	Simple Vector3 class
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 02/06/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///          	Create a new vector
///          </summary>
///
/// In:		<param name="_newx">[optional] The new x value</param>
///			<param name="_newy">[optional] The new y value</param>
///			<param name="_newz">[optional] The new z value</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function Vector3(_newx_pVec, _newy, _newz ) {

	if (arguments.length > 0)
	{
		// If 3 args, then setting vectors
		if (arguments.length == 3)
		{
			this.X = _newx_pVec;
			this.Y = _newy;
			this.Z = _newz;
		} else
		{
			// if only 1 arg, then vector passed in.
			this.X = _newx_pVec.X;
			this.Y = _newx_pVec.Y;
			this.Z = _newx_pVec.Z;
		}
	} else
	{
		// if no args, then reset vector.
		this.X =1.0;
		this.Y =0.0;
		this.Z =0.0;
	}
}


// #############################################################################################
/// Property: <summary>
///           	Test Equal
///           </summary>
// #############################################################################################
Vector3.prototype.Equal = function (v2) {
    return this.X == v2.X && this.Y == v2.Y && this.Z == v2.Z;
};


// #############################################################################################
/// Property: <summary>
///           	addition of two Vector3
///           </summary>
// #############################################################################################
Vector3.prototype.Add = function (v2) {
    return new Vector3( this.X+v2.X, this.Y+v2.Y, this.Z+v2.Z );
};

// #############################################################################################
/// Property: <summary>
///           	negation
///           </summary>
// #############################################################################################
Vector3.prototype.Neg = function () {
    return new Vector3( -this.X, -this.Y, -this.Z );
};

// #############################################################################################
/// Property: <summary>
///           	subtraction
///           </summary>
// #############################################################################################
Vector3.prototype.Sub = function (v2) {
    return new Vector3( this.X-v2.X, this.Y-v2.Y, this.Z-v2.Z);
};

// #############################################################################################
/// Property: <summary>
///           	inner ("dot") product
///           </summary>
// #############################################################################################
Vector3.prototype.Dot = function (v2) {
    return this.X * v2.X + this.Y * v2.Y + this.Z * v2.Z;
};


// #############################################################################################
/// Property: <summary>
///           	scalar product
///           </summary>
// #############################################################################################
Vector3.prototype.Scale = function (f) {
	return new Vector3(f * this.X, f * this.Y, f * this.Z);
};

// #############################################################################################
/// Function:<summary>
///				Normalise (magnitude set to 1) all the components of this
///			</summary>
// #############################################################################################
Vector3.prototype.Normalise = function ()
{
	var len = 1.0 / Math.sqrt((this.X * this.X) + (this.Y * this.Y) + (this.Z * this.Z));

	this.X = this.X * len;
	this.Y = this.Y * len;
	this.Z = this.Z * len;
};

Vector3.prototype.LengthSq = function()
{
	var lensq = (this.X * this.X) + (this.Y * this.Y) + (this.Z * this.Z);

	return lensq;
};

Vector3.prototype.Length = function()
{
	var lensq = this.LengthSq();
	if (lensq > 0.0)
	{	
		return Math.sqrt(lensq);
	}
	else
	{
		return 0.0;		
	}
};



// #############################################################################################
/// Function:<summary>
///				vector cross product, this version returns answer in a parameter
///			</summary>
///
/// In:		<param name="_out">vector cross product result</param>
///			<param name="_v">vector</param>
///
// #############################################################################################
Vector3.prototype.CrossProduct = function(_pVec )
{
    var x,y,z;
    x = (this.Y * _pVec.Z) - (this.Z * _pVec.Y);
    y = (this.Z * _pVec.X) - (this.X * _pVec.Z);
    z = (this.X * _pVec.Y) - (this.Y * _pVec.X);
    return new Vector3(x,y,z);
};



// #############################################################################################
/// Function:<summary>
///				vector cross product, this version returns answer in a parameter
///			</summary>
///
/// In:		<param name="_out">vector cross product result</param>
///			<param name="_v">vector</param>
///
// #############################################################################################
Vector3.prototype.SetCrossProduct = function (_pVec1, _pVec2) {
	this.X = (_pVec1.Y * _pVec2.Z) - (_pVec1.Z * _pVec2.Y);
	this.Y = (_pVec1.Z * _pVec2.X) - (_pVec1.X * _pVec2.Z);
	this.Z = (_pVec1.X * _pVec2.Y) - (_pVec1.Y * _pVec2.X);
};


// #############################################################################################
/// Function:<summary>
///             Project point onto axis
///          </summary>
///
/// In:		 <param name="_pVec">Vectcor</param>
/// Out:	 <returns>
///				+C value
///			 </returns>
// #############################################################################################
Vector3.prototype.Projection = function( _pVec )
{
	return (this.X * _pVec.X) + (this.Y * _pVec.Y) + (this.Z * _pVec.Z);
};


