
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	Matrix.js
// Created:	        02/06/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	Simple 4x4 Matrix class
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 01/12/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

var _11 = 0;
var _12 = 1;
var _13 = 2;
var _14 = 3;

var _21 = 4;
var _22 = 5;
var _23 = 6;
var _24 = 7;

var _31 = 8;
var _32 = 9;
var _33 = 10;
var _34 = 11;

var _41 = 12;
var _42 = 13;
var _43 = 14;
var _44 = 15;


var __00 = 0;
var __01 = 1;
var __02 = 2;
var __03 = 3;
    
var __10 = 4;
var __11 = 5;
var __12 = 6;
var __13 = 7;
    
var __20 = 8;
var __21 = 9;
var __22 = 10;
var __23 = 11;
    
var __30 = 12;
var __31 = 13;
var __32 = 14;
var __33 = 15;



// #############################################################################################
/// Function:<summary>
///          	Create a new matrix object
///          </summary>
// #############################################################################################
/** @constructor 
  * @param {Object=} _matrix Some value (optional).
*/
function Matrix( _matrix ) {

	this.m = new Float32Array( 16 );
	if (arguments.length > 0)
	{
		var srcMatrix = _matrix.m || _matrix;

		// Copy the matrix
		for (var i = 0; i < 16; i++)
		{
			this.m[i] = srcMatrix[i];
		}
	}
	else
	{
		this.unit();	
	}
}

// #############################################################################################
/// Function:<summary>
///          	Create a new matrix object
///          </summary>
// #############################################################################################
//function Equals( _matrix ) {
//	
//	for (var i=0; i < 16; i++) {
//		if (this.m[i] != _matrix.m[i]) {
//		    return false;
//		}
//	}
//	return true;
//}


// #############################################################################################
/// Property: <summary>
///           	Set the matrix to be a UNIT matrix
///           </summary>
// #############################################################################################
Matrix.prototype.identity = function (v2) {
	this.m[1] = this.m[2] = this.m[3] = this.m[4] = this.m[6] = this.m[7] = this.m[8] = this.m[9] = this.m[11] = this.m[12] = this.m[13] = this.m[14] = 0.0;
	this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1.0;
};
// #############################################################################################
/// Property: <summary>
///           	Set the matrix to be a UNIT matrix
///           </summary>
// #############################################################################################
Matrix.prototype.unit = function (v2) {
	this.m[1] = this.m[2] = this.m[3] = this.m[4] = this.m[6] = this.m[7] = this.m[8] = this.m[9] = this.m[11] = this.m[12] = this.m[13] = this.m[14] = 0.0;
	this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1.0;
};


// #############################################################################################
/// Property: <summary>
///           	Copies the values of a given matrix
///           </summary>
// #############################################################################################
Matrix.prototype.Copy = function (_copy) {
    for (var i = 0; i < 16; i++) {
        this.m[i] = _copy.m[i];
    }
};

// #############################################################################################
/// Function:<summary>
///             Create a LookAT Vector
///          </summary>
///
/// In:		 <param name="_pDest">OUT: Destination matrix</param>
///			 <param name="_pPos">Current position</param>
///			 <param name="_pAt">Look AT position</param>
///			 <param name="_pUp">Up vector</param>
///				
// #############################################################################################
Matrix.prototype.LookAtLH = function(  _pPos, _pAt, _pUp)
{
	var Up = new Vector3(_pUp);
    var Right = new Vector3();
    var Look = _pAt.Sub( _pPos );
	
    Look.Normalise();
	Up.Normalise();

	Right.SetCrossProduct(Up,Look);
    Right.Normalise();

    Up.SetCrossProduct(Look,Right);
    Up.Normalise();

    var X = _pPos.Projection(Right);
    var Y = _pPos.Projection(Up);
    var Z = _pPos.Projection(Look);


	this.m[_11] = Right.X;
	this.m[_12] = Up.X;
	this.m[_13] = Look.X;
	this.m[_14] = 0.0; 
	
	this.m[_21] = Right.Y;
	this.m[_22] = Up.Y;
	this.m[_23] = Look.Y;
	this.m[_24] = 0.0; 
	
	this.m[_31] = Right.Z;
	this.m[_32] = Up.Z;
	this.m[_33] = Look.Z;
	this.m[_34] = 0.0; 
	
	this.m[_41] = -X;
	this.m[_42] = -Y;
	this.m[_43] = -Z;
	this.m[_44] = 1;
};


// #############################################################################################
/// Function:<summary>
///             Builds a left-handed perspective projection matrix based on a field of view.
///          </summary>
///
/// In:		 <param name="_pMatrix">OUT: Destination matrix</param>
///			 <param name="_fovY"></param>
///			 <param name="_aspect"></param>
///			 <param name="_zn"></param>
///			 <param name="_zf"></param>
///				
// #############################################################################################
Matrix.prototype.PerspectiveFovLH = function( _fovY, _aspect, _zn, _zf )
{
	if ((_fovY == 0.0) || (_aspect == 0.0) || (_zn == _zf))
	{
		// avoid divide by zero
		this.unit();
		return;		
	}

    var a = Deg2Rad(_fovY);
    var yScale = 1.0 / Math.tan(a * 0.5);
    var xScale = yScale / _aspect;

	this.m[_11] = xScale;
	this.m[_12] = this.m[_13] = this.m[_14] = 0.0;
	
	this.m[_22] = yScale;
	this.m[_21] = this.m[_23] = this.m[_24] = 0.0;
	
	this.m[_31] = this.m[_32] = 0.0;
	this.m[_34] = 1.0;
	this.m[_33] = _zf / (_zf - _zn);
	
	this.m[_41] = this.m[_42]  = this.m[_44] = 0.0;
	this.m[_43] = -_zn*_zf / (_zf - _zn);
};


// #############################################################################################
/// Function:<summary>
///             Builds a left-handed perspective projection matrix
///          </summary>
///
/// In:		 <param name="_pMatrix">OUT: Destination matrix</param>
///			 <param name="_w">Width of viewport</param>
///			 <param name="_h">Height of viewport</param>
///			 <param name="_zn">Near Z</param>
///			 <param name="_zf">Far Z</param>
///				
// #############################################################################################
Matrix.prototype.PerspectiveLH = function (_w, _h, _zn, _zf)
{
	if ((_w == 0.0) || (_h == 0.0) || (_zn == _zf))
	{
		// avoid divide by zero
		this.unit();
		return;		
	}

	this.m[_11] = 2*_zn / _w;
	this.m[_12] = this.m[_13] = this.m[_14] = 0.0;

	this.m[_22] = 2*_zn / _h;
	this.m[_21] = this.m[_23] = this.m[_24] = 0.0;
	
	this.m[_31] = this.m[_32] = 0.0;
	this.m[_34] = 1.0;
	this.m[_33] = _zf / (_zf - _zn);

	this.m[_41] = this.m[_42]  = this.m[_44] = 0.0;
	this.m[_43] = -_zn*_zf / (_zf - _zn);
};


// #############################################################################################
/// Function:<summary>
///             Builds a left-handed orthographic projection matrix.
///          </summary>
///
/// In:		 <param name="_pMatrix">OUT: Destination matrix</param>
///			 <param name="_w">Width of viewport</param>
///			 <param name="_h">Height of viewport</param>
///			 <param name="_zn">Near Z</param>
///			 <param name="_zf">Far Z</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
Matrix.prototype.OrthoLH= function (_w, _h, _zn, _zf)
{
	if ((_w == 0.0) || (_h == 0.0) || (_zn == _zf))
	{
		// avoid divide by zero
		this.unit();
		return;		
	}

	this.m[_11] = 2.0/ _w;
	this.m[_12] = this.m[_13] = 0.0;
	this.m[_14] = 0;

	this.m[_22] = 2.0/_h;
	this.m[_21] = this.m[_23] = 0.0;
	this.m[_24] = 0;
	
	this.m[_31] = this.m[_32] =0.0;
	this.m[_33] = 1.0 / (_zf - _zn);
	this.m[_34] = 0;

	this.m[_41] = this.m[_42]  = 0.0;
	this.m[_43] = _zn / (_zn - _zf);
	this.m[_44] = 1.0;
};



// #############################################################################################
/// Function:<summary>
///             4x4 matric multiply
///          </summary>
///
/// In:		 <param name="_pDest">OUT: Dest Matrix</param>
///			 <param name="_pS1">Source 1</param>
///			 <param name="_pS2">Source 2</param>
///				
// #############################################################################################
Matrix.prototype.Multiply = function (_pS1, _pS2) {
	this.m[_11] = (_pS1.m[_11] * _pS2.m[_11]) + (_pS1.m[_12] * _pS2.m[_21]) + (_pS1.m[_13] * _pS2.m[_31]) + (_pS1.m[_14] * _pS2.m[_41]);
	this.m[_12] = (_pS1.m[_11] * _pS2.m[_12]) + (_pS1.m[_12] * _pS2.m[_22]) + (_pS1.m[_13] * _pS2.m[_32]) + (_pS1.m[_14] * _pS2.m[_42]);
	this.m[_13] = (_pS1.m[_11] * _pS2.m[_13]) + (_pS1.m[_12] * _pS2.m[_23]) + (_pS1.m[_13] * _pS2.m[_33]) + (_pS1.m[_14] * _pS2.m[_43]);
	this.m[_14] = (_pS1.m[_11] * _pS2.m[_14]) + (_pS1.m[_12] * _pS2.m[_24]) + (_pS1.m[_13] * _pS2.m[_34]) + (_pS1.m[_14] * _pS2.m[_44]);
	this.m[_21] = (_pS1.m[_21] * _pS2.m[_11]) + (_pS1.m[_22] * _pS2.m[_21]) + (_pS1.m[_23] * _pS2.m[_31]) + (_pS1.m[_24] * _pS2.m[_41]);
	this.m[_22] = (_pS1.m[_21] * _pS2.m[_12]) + (_pS1.m[_22] * _pS2.m[_22]) + (_pS1.m[_23] * _pS2.m[_32]) + (_pS1.m[_24] * _pS2.m[_42]);
	this.m[_23] = (_pS1.m[_21] * _pS2.m[_13]) + (_pS1.m[_22] * _pS2.m[_23]) + (_pS1.m[_23] * _pS2.m[_33]) + (_pS1.m[_24] * _pS2.m[_43]);
	this.m[_24] = (_pS1.m[_21] * _pS2.m[_14]) + (_pS1.m[_22] * _pS2.m[_24]) + (_pS1.m[_23] * _pS2.m[_34]) + (_pS1.m[_24] * _pS2.m[_44]);
	this.m[_31] = (_pS1.m[_31] * _pS2.m[_11]) + (_pS1.m[_32] * _pS2.m[_21]) + (_pS1.m[_33] * _pS2.m[_31]) + (_pS1.m[_34] * _pS2.m[_41]);
	this.m[_32] = (_pS1.m[_31] * _pS2.m[_12]) + (_pS1.m[_32] * _pS2.m[_22]) + (_pS1.m[_33] * _pS2.m[_32]) + (_pS1.m[_34] * _pS2.m[_42]);
	this.m[_33] = (_pS1.m[_31] * _pS2.m[_13]) + (_pS1.m[_32] * _pS2.m[_23]) + (_pS1.m[_33] * _pS2.m[_33]) + (_pS1.m[_34] * _pS2.m[_43]);
	this.m[_34] = (_pS1.m[_31] * _pS2.m[_14]) + (_pS1.m[_32] * _pS2.m[_24]) + (_pS1.m[_33] * _pS2.m[_34]) + (_pS1.m[_34] * _pS2.m[_44]);
	this.m[_41] = (_pS1.m[_41] * _pS2.m[_11]) + (_pS1.m[_42] * _pS2.m[_21]) + (_pS1.m[_43] * _pS2.m[_31]) + (_pS1.m[_44] * _pS2.m[_41]);
	this.m[_42] = (_pS1.m[_41] * _pS2.m[_12]) + (_pS1.m[_42] * _pS2.m[_22]) + (_pS1.m[_43] * _pS2.m[_32]) + (_pS1.m[_44] * _pS2.m[_42]);
	this.m[_43] = (_pS1.m[_41] * _pS2.m[_13]) + (_pS1.m[_42] * _pS2.m[_23]) + (_pS1.m[_43] * _pS2.m[_33]) + (_pS1.m[_44] * _pS2.m[_43]);
	this.m[_44] = (_pS1.m[_41] * _pS2.m[_14]) + (_pS1.m[_42] * _pS2.m[_24]) + (_pS1.m[_43] * _pS2.m[_34]) + (_pS1.m[_44] * _pS2.m[_44]);
};


// #############################################################################################
/// Function:<summary>
///             Set the destination to a Z Rotation matrix
///          </summary>
///
/// In:		 <param name="_pDest">Destination matrix</param>
///			 <param name="_angle">angle in degrees</param>
///				
// #############################################################################################
Matrix.prototype.SetZRotation = function( _angle )
{
	this.unit();

    var a = Deg2Rad(_angle);
	var s = Math.sin(a);
	var c = Math.cos(a);

	this.m[_11] = c;
	this.m[_12] = -s;
	this.m[_21] = s;
	this.m[_22] = c;
};



// #############################################################################################
/// Function:<summary>
///             Set the destination to a Z Rotation matrix
///          </summary>
///
/// In:		 <param name="_pDest">Destination matrix</param>
///			 <param name="_angle">angle in degrees</param>
///				
// #############################################################################################
Matrix.prototype.SetYRotation = function ( _angle )
{
	this.unit();

	var a = Deg2Rad(_angle);
	var s = Math.sin(a);
	var c = Math.cos(a);

	this.m[_11] = c;
	this.m[_13] = s;
	this.m[_31] = -s;
	this.m[_33] = c;
};

// #############################################################################################
/// Function:<summary>
///             Set the destination to a Z Rotation matrix
///          </summary>
///
/// In:		 <param name="_pDest">Destination matrix</param>
///			 <param name="_angle">angle in degrees</param>
///				
// #############################################################################################
Matrix.prototype.SetXRotation = function( _angle )
{
	this.unit();

	var a = Deg2Rad(_angle);
	var s = Math.sin(a);
	var c = Math.cos(a);

	this.m[_22] = c;
	this.m[_23] = -s;
	this.m[_32] = s;
	this.m[_33] = c;
};


// #############################################################################################
/// Function:<summary>
///             Build a translation matrix
///          </summary>
// #############################################################################################
Matrix.prototype.SetTranslation = function(_x, _y, _z) {

    this.unit();
    
    this.m[_41] = _x;
	this.m[_42] = _y;
	this.m[_43] = _z;	
};

// #############################################################################################
/// Function:<summary>
///             Build a scale matrix
///          </summary>
// #############################################################################################
Matrix.prototype.SetScale = function(_xs, _ys, _zs) {

    this.unit();
    this.m[_11] = _xs;
    this.m[_22] = _ys;
    this.m[_33] = _zs;
};

// #############################################################################################
/// Function:<summary>
///          	Retrieves maximum unit scale.
///          </summary>
// #############################################################################################
Matrix.prototype.GetMaximumUnitScale = function () {
	var scaleX = Math.sqrt(
		(this.m[_11] * this.m[_11]) + (this.m[_21] * this.m[_21]) + (this.m[_31] * this.m[_31]));
	var scaleY = Math.sqrt(
		(this.m[_12] * this.m[_12]) + (this.m[_22] * this.m[_22]) + (this.m[_32] * this.m[_32]));
	var scaleZ = Math.sqrt(
		(this.m[_13] * this.m[_13]) + (this.m[_23] * this.m[_23]) + (this.m[_33] * this.m[_33]));
	return Math.max(scaleX, scaleY, scaleZ);
};

// #############################################################################################
/// Function:<summary>
///             Builds a matrix that rotates around an arbitrary axis.
///          </summary>
// #############################################################################################
Matrix.prototype.SetRotationAxis = function (_v, _angle) {    

    _v.Normalise();    
    var a = Deg2Rad(_angle);
	var c = Math.cos(a);
	var s = Math.sin(a);
	var omc = 1.0 - c;

    this.unit();
	this.m[0] =  (omc * _v.X * _v.X + c);
	this.m[1] =  (omc * _v.X * _v.Y + s * _v.Z);
	this.m[2] =  (omc * _v.X * _v.Z - s * _v.Y);
                                 
	this.m[4] =  (omc * _v.X * _v.Y - s * _v.Z);
	this.m[5] =  (omc * _v.Y * _v.Y + c);
	this.m[6] =  (omc * _v.Y * _v.Z + s * _v.X);
                                 
	this.m[8] =  (omc * _v.X * _v.Z + s * _v.Y);
	this.m[9] =  (omc * _v.Y * _v.Z - s * _v.X);
	this.m[10] = (omc * _v.Z * _v.Z + c);
};


// #############################################################################################
/// Function:<summary>
///          	Build a full 2D matrix, assuming an orthographic view matrix is in play
///          </summary>
// #############################################################################################
Matrix.prototype.Build2DMatrix = function (_x, _y, _xs, _ys, _rot) {

    this.unit();
        
    // Do a z-rotate
    var a = Deg2Rad(_rot);
	var s = Math.sin(a);
	var c = Math.cos(a);

	this.m[_11] = c;
	this.m[_12] = -s;
	this.m[_21] = s;
	this.m[_22] = c;

    // Set scale
    this.m[_11] *= _xs;
	this.m[_22] *= _ys;

    // Set transform
    this.m[_41] = _x;
	this.m[_42] = _y;	
};


// #############################################################################################
/// Function:<summary>
///          	Build a full fat matrix
///          </summary>
///
/// In:		<param name="_x">X translation</param>
///			<param name="_y">Y translation</param>
///			<param name="_z">Z translation</param>
///			<param name="_xrot">X Rotation</param>
///			<param name="_yrot">Y Rotation</param>
///			<param name="_zrot">Z Rotation</param>
///			<param name="_xscale">X Scale</param>
///			<param name="_yscale">Y Scale</param>
///			<param name="_zscale">Z Scale</param>
/// Out:	<returns>
///				Full fat matrix is build
///			</returns>
// #############################################################################################
Matrix.prototype.BuildMatrix = function ( _x,_y,_z, _xrot,_yrot,_zrot, _xscale,_yscale,_zscale )
{
	var sinp = Math.sin(_xrot);
	var cosp = Math.cos(_xrot);
	var sinh = Math.sin(_yrot);
	var cosh = Math.cos(_yrot);
	var sinr = Math.sin(_zrot);
	var cosr = Math.cos(_zrot);

	var sinrsinp = -sinr*-sinp;	            // common elements
	var cosrsinp = cosr*-sinp;

	this.m[0] = ((cosr * cosh) + (sinrsinp * -sinh)) * _xscale;
	this.m[4] = (-sinr * cosp) * _xscale;
	this.m[8] = ((cosr * sinh) + (sinrsinp * cosh)) * _xscale;
	this.m[12] = _x;

	this.m[1] = ((sinr * cosh) + (cosrsinp * -sinh)) * _yscale;
	this.m[5] = (cosr * cosp) * _yscale;
	this.m[9] = ((sinr * sinh) + (cosrsinp * cosh)) * _yscale;
	this.m[13] = _y;

	this.m[2] = (cosp * -sinh) * _zscale;
	this.m[6] = sinp * _zscale;
	this.m[10] = (cosp * cosh) * _zscale;
	this.m[14] = _z;

	this.m[3] = this.m[7] = this.m[11] = 0.0;
	this.m[15] = 1.0;
};


Matrix.prototype.Invert = function(that)
{

    var s0 = that.m[__00] * that.m[__11] - that.m[__10] * that.m[__01];
    var s1 = that.m[__00] * that.m[__12] - that.m[__10] * that.m[__02];
    var s2 = that.m[__00] * that.m[__13] - that.m[__10] * that.m[__03];
    var s3 = that.m[__01] * that.m[__12] - that.m[__11] * that.m[__02];
    var s4 = that.m[__01] * that.m[__13] - that.m[__11] * that.m[__03];
    var s5 = that.m[__02] * that.m[__13] - that.m[__12] * that.m[__03];
                                                                 
    var c5 = that.m[__22] * that.m[__33] - that.m[__32] * that.m[__23];
    var c4 = that.m[__21] * that.m[__33] - that.m[__31] * that.m[__23];
    var c3 = that.m[__21] * that.m[__32] - that.m[__31] * that.m[__22];
    var c2 = that.m[__20] * that.m[__33] - that.m[__30] * that.m[__23];
    var c1 = that.m[__20] * that.m[__32] - that.m[__30] * that.m[__22];
    var c0 = that.m[__20] * that.m[__31] - that.m[__30] * that.m[__21];

    var det =  (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);
    
    if(det!=0)
    {
       var invdet = 1.0/det;
       var b = new Float32Array(16);
       
        b[__00] = ( that.m[__11] * c5 - that.m[__12] * c4 + that.m[__13] * c3) * invdet;
        b[__01] = (-that.m[__01] * c5 + that.m[__02] * c4 - that.m[__03] * c3) * invdet;
        b[__02] = ( that.m[__31] * s5 - that.m[__32] * s4 + that.m[__33] * s3) * invdet;
        b[__03] = (-that.m[__21] * s5 + that.m[__22] * s4 - that.m[__23] * s3) * invdet;
                                                                    
        b[__10] = (-that.m[__10] * c5 + that.m[__12] * c2 - that.m[__13] * c1) * invdet;
        b[__11] = ( that.m[__00] * c5 - that.m[__02] * c2 + that.m[__03] * c1) * invdet;
        b[__12] = (-that.m[__30] * s5 + that.m[__32] * s2 - that.m[__33] * s1) * invdet;
        b[__13] = ( that.m[__20] * s5 - that.m[__22] * s2 + that.m[__23] * s1) * invdet;
                                                                    
        b[__20] = ( that.m[__10] * c4 - that.m[__11] * c2 + that.m[__13] * c0) * invdet;
        b[__21] = (-that.m[__00] * c4 + that.m[__01] * c2 - that.m[__03] * c0) * invdet;
        b[__22] = ( that.m[__30] * s4 - that.m[__31] * s2 + that.m[__33] * s0) * invdet;
        b[__23] = (-that.m[__20] * s4 + that.m[__21] * s2 - that.m[__23] * s0) * invdet;
                                                                    
        b[__30] = (-that.m[__10] * c3 + that.m[__11] * c1 - that.m[__12] * c0) * invdet;
        b[__31] = ( that.m[__00] * c3 - that.m[__01] * c1 + that.m[__02] * c0) * invdet;
        b[__32] = (-that.m[__30] * s3 + that.m[__31] * s1 - that.m[__32] * s0) * invdet;
        b[__33] = ( that.m[__20] * s3 - that.m[__21] * s1 + that.m[__22] * s0) * invdet;

        this.m = b;
    }
};

Matrix.prototype.TransformVec3 = function(_vec)
{
	var newvec = new Vector3(0.0,0.0,0.0);
	if (_vec != undefined)
	{
		newvec.X = (this.m[_11] * _vec.X) + (this.m[_21] * _vec.Y) + (this.m[_31] * _vec.Z) + this.m[_41];
		newvec.Y = (this.m[_12] * _vec.X) + (this.m[_22] * _vec.Y) + (this.m[_32] * _vec.Z) + this.m[_42];
		newvec.Z = (this.m[_13] * _vec.X) + (this.m[_23] * _vec.Y) + (this.m[_33] * _vec.Z) + this.m[_43];
	}

	return newvec;
};