// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Maths.js
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

var RAND_MAX = 0x7fff;

var g_GMLMathEpsilon = 1e-5;


// #############################################################################################
/// Function:<summary>
///          	Returns the floor of x, that is, x rounded down to an integer.
///          </summary>
///
/// In:		<param name="_val"></param>
/// Out:	<returns>
///				value floored.
///			</returns>
// #############################################################################################
function floor(_val) {
    return Math.floor(yyGetReal(_val));
}

// #############################################################################################
/// Function:<summary>
///          	Returns x rounded to the nearest integer.
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function DelphiRound(_a) 
{
    _a = yyGetReal(_a);

    var i = Math.sign(_a) * Math.floor(Math.abs(_a));

    if (_a < 0) {
        var f = _a - i;
        if ((i & 1) == 1)
        {
            if (f <= -0.5) {
                return i - 1;
            } else {
                return i;
            }
        } else {
            if (f >= -0.5) {
                return i;
            } else {
                return i - 1;
            }
        }
    } else {
        var f = _a - i;
        if ((i & 1) == 1) {
            if (f >= 0.5) {
                return i + 1;
            } else {
                return i;
            }
        } else {
            if (f <= 0.5) {
                return i;
            } else {
                return i + 1;
            }
        }
    }
}

function yyRound(_a) {
	return ~~_a;
}
var round = DelphiRound;
var Round = DelphiRound;

//var round = Math.floor;
//var Round = Math.floor;

// #############################################################################################
/// Function:<summary>
///          	Returns the absolute value of x.
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
//var abs = Math.abs;
function abs(_a)
{
    return Math.abs(yyGetReal(_a));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the cosine of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function cos(_a)
{
    return Math.cos(yyGetReal(_a));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the cosine of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dcos(_a) {
    return cos(yyGetReal(_a) * 0.0174532925);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the sine of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sin(_a)
{
    return Math.sin(yyGetReal(_a));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the sine of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dsin(_a) {
    return sin(yyGetReal(_a) * 0.0174532925);
}



// #############################################################################################
/// Function:<summary>
///          	Returns the tangent of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function tan(_a)
{
    return Math.tan(yyGetReal(_a));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the tangent of x (x in radians).
///          </summary>
///
/// In:		<param name="_a"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dtan(_a) {
    return tan(yyGetReal(_a) * 0.0174532925);
}


// #############################################################################################
/// Function:<summary>
///             Returns the horizontal x-component of the vector determined by the indicated 
///             length and direction.
///          </summary>
///
/// In:		 <param name="_len">length</param>
///			 <param name="_dir">angle in degrees</param>
/// Out:	 <returns>
///				the length on the X axis
///			 </returns>
// #############################################################################################
function lengthdir_x( _len, _dir )
{
    var v = (yyGetReal(_len) * Math.cos(yyGetReal(_dir) * Pi/180.0));
	var flv = Math.round(v);
	var frac = v - flv;
	if( Math.abs(frac) < 0.0001 ) return flv;
    return v;
}


// #############################################################################################
/// Function:<summary>
///             Returns the vertical y-component of the vector determined by the indicated 
///             length and direction.
///          </summary>
///
/// In:		 <param name="_len">length</param>
///			 <param name="_dir">angle in degrees</param>
/// Out:	 <returns>
///				the length on the Y axis
///			 </returns>
// #############################################################################################
function lengthdir_y( _len, _dir )
{
    var v = -(yyGetReal(_len) * Math.sin(yyGetReal(_dir) * Pi/180.0));
	var flv = Math.round(v);
	var frac = v - flv;
	if( Math.abs(frac) < 0.0001 ) return flv;
    return v;
}


// #############################################################################################
/// Function:<summary>
///             Returns the direction from point (x1,y1) toward point (x2,y2) in degrees.
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function point_direction(_x1,_y1, _x2,_y2)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

	var x = _x2-_x1;
	var y = _y2-_y1;

	if ( x === 0 )
	{
		if ( y > 0 ) return 270.0;
		else if ( y < 0 ) return 90.0;
		else return 0.0;
	}
	else
	{
		var dd = 180.0 * Math.atan2(y, x) / Pi;
		dd = (~ ~round(dd * 1000000)) / 1000000.0;
		if ( dd <= 0.0 ) { 
			return -dd; 
		} else { 
			return (360.0-dd); 
		}
	}
}
function ComputeDir(_x1,_y1, _x2,_y2){ return point_direction(_x1,_y1, _x2,_y2); }


// #############################################################################################
/// Function:<summary>
///             Returns the distance between point (x1,y1) and point (x2,y2).
///          </summary>
///
/// In:		 <param name="_x1">x1 coordinate</param>
///			 <param name="_y1">y1 coordinate</param>
///			 <param name="_x2">x2 coordinate</param>
///			 <param name="_y2">y2 coordinate</param>
/// Out:	 <returns>
///				the distance between x1,y1 and x2,y2
///			 </returns>
// #############################################################################################
function point_distance(_x1,_y1, _x2,_y2)
{
    var dx = yyGetReal(_x2) - yyGetReal(_x1);
    var dy = yyGetReal(_y2) - yyGetReal(_y1);
    return Math.sqrt( dx*dx + dy*dy );
}

// #############################################################################################
/// Function:<summary>
///             Returns the distance between point (x1,y1) and point (x2,y2).
///          </summary>
///
/// In:		 <param name="_x1">x1 coordinate</param>
///			 <param name="_y1">y1 coordinate</param>
///			 <param name="_x2">x2 coordinate</param>
///			 <param name="_y2">y2 coordinate</param>
/// Out:	 <returns>
///				the distance between x1,y1 and x2,y2
///			 </returns>
// #############################################################################################
function point_distance_3d(_x1, _y1, _z1, _x2, _y2, _z2) {
    return Math.sqrt( Sqr(yyGetReal(_x2) - yyGetReal(_x1)) + Sqr( yyGetReal(_y2) - yyGetReal(_y1)) + Sqr(yyGetReal(_z2) - yyGetReal(_z1)) );
}


// #############################################################################################
/// Function:<summary>
///          	Return the smaller number between _a and _b
///          </summary>
///
/// In:		<param name="_a">Number 1</param>
///			<param name="_b">Number 2</param>
/// Out:	<returns>
///				the smaller of _a and _b
///			</returns>
// #############################################################################################
function yymin(_a,_b)
{
    if( _a<_b) return _a; else return _b;
}


// #############################################################################################
/// Function:<summary>
///          	Return the larger number between _a and _b
///          </summary>
///
/// In:		<param name="_a">Number 1</param>
///			<param name="_b">Number 2</param>
/// Out:	<returns>
///				the lager of _a and _b
///			</returns>
// #############################################################################################
function yymax(_a,_b)
{
    if( _a>_b) return _a; else return _b;
}


// #############################################################################################
/// Function:<summary>
///             Returns the maximum of the values. The function can have up to 16 arguments. 
///             They must either be all real or all strings.
///          </summary>
/// Out:	 <returns>
///				the largest value
///			 </returns>
// #############################################################################################
//var max = Math.max;
function max()
{
    var args = arguments;
    var argc = arguments.length;

    if (argc == 0) return 0;
    
    var m = yyGetReal(args[0]);
    for (var i = 1; i < argc; i++) {
        var argi = yyGetReal(args[i]);
        if (m < argi) m = argi;
    }
    return m;
}
function max3(_a,_b,_c){ return max(_a,_b,_c); }

// #############################################################################################
/// Function:<summary>
///             Returns the minimum of the values. The function can have up to 16 arguments. 
///             They must either be all real or all strings.
///          </summary>
/// Out:	 <returns>
///				the smallest value
///			 </returns>
// #############################################################################################
//var min = Math.min;
function min()
{
    var args = arguments;
    var argc = arguments.length;

    if (argc == 0) return 0;
    
    var m = yyGetReal(args[0]);
    for (var i = 1; i < argc; i++) {
        var argi = yyGetReal(args[i]);
        if (m > argi) m = argi;
    }
    return m;
}
function min3(_a,_b,_c){ return min(_a,_b,_c); }


var state = []; 					// initialize state to random bits
var g_RndIndex = 0;						// reset anyway
var g_nRandSeed = InitRandom(0);	// init should also reset this to 0
var g_nRandomPoly = 0xDA442D24;


// #############################################################################################
/// Function:<summary>
///          	Init the random number system to "something"
///          </summary>
///
/// Out:	<returns>
///				0 (for global initialisation)
///			</returns>
// #############################################################################################
function InitRandom( _seed ) {
	var s = _seed;
	for (var i = 0; i < 16; i++)
	{
		s = (((s * 214013 + 2531011) >> 16) & 0x7fffffff) | 0;
		state[i] = ~ ~s; //i ;
	}
	g_RndIndex = 0;
	g_nRandSeed = _seed;
	return g_nRandSeed;
}


// #############################################################################################
/// Function:<summary>
///              Swap the random poly number back to the incorrect version, for compatability.
///          </summary>
// #############################################################################################
function random_use_old_version(_true_false) {
    if (_true_false)
        g_nRandomPoly = 0xDA442D20;
    else
        g_nRandomPoly = 0xDA442D24;
}


// #############################################################################################
/// Function:<summary>
///          	Returns a random number between 0 and 1
///             PRNG from http://www.lomont.org/Math/Papers/2008/Lomont_PRNG_2008.pdf
///             other reading http://stackoverflow.com/questions/1046714/what-is-a-good-random-number-generator-for-a-game
///          </summary>
// #############################################################################################
function rand() {

//	return Math.random();

    var a, b, c, d;
    a = state[g_RndIndex];
    c = state[(g_RndIndex + 13) & 15];
    b = a^c^(a<<16)^(c<<15);
    c = state[(g_RndIndex + 9) & 15];
    c ^= (c>>11);
    a = state[g_RndIndex] = b ^ c;
    d = a ^ ((a << 5) & g_nRandomPoly);
    g_RndIndex = (g_RndIndex + 15) & 15;
    a = state[g_RndIndex];
    state[g_RndIndex] = a ^ b ^ d ^ (a << 2) ^ (b << 18) ^ (c << 28);
    return ((state[g_RndIndex] & 0x7fffffff) / 2147483647.0); 		// between 0 and 1
    //return ((state[g_RndIndex] >> 4) & 0xfffffff) / 268435456.0; 		// between 0 and 1
    //return state[g_RndIndex]; 		// between 0 and 1
  }


// #############################################################################################
/// Function:<summary>
///          	Returns a random real number between 0 and x. The number is always smaller than x.
///          </summary>
///
/// In:		<param name="_v"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function random(_v)
{
	var r = rand();
	return r * yyGetReal(_v);
}


// #############################################################################################
/// Function:<summary>
///          	Returns a random integer number between 0 and x (inclusive when x is an integer).
///          </summary>
///
/// In:		<param name="_v"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function irandom(_v) 
{
    _v = yyGetInt32(_v);
    var sign = _v < 0 ? -1 : 1;
    var r = rand() * (_v + sign);
	rand();
	return  ~~r; 	// ~~ casts to an INT
}


// #############################################################################################
/// Function:<summary>
///          	Returns a random real number between x1 (inclusive) and x2 (exclusive).
///          </summary>
///
/// In:		<param name="val0"></param>
///			<param name="val1"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function random_range(val0, val1) {

    val0 = yyGetReal(val0);
    val1 = yyGetReal(val1);

    if (val0 == val1) {
        return val0;
    }

    var lower, higher;
    if (val0 > val1) {
        lower = val1;
        higher = val0;
    }
    else {
        lower = val0;
        higher = val1;
    }

	var rp1 = rand();
	var result = lower + (rp1 * (higher - lower));

	rand();
	return result;
}



// #############################################################################################
/// Function:<summary>
///          	Sets the seed (an integer) that is used for the random number generation. 
///             Can be used to repeat the same random sequence. (Note though that also some 
///             actions and the system itself uses random numbers.)
///          </summary>
///
/// In:		<param name="_val"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function random_set_seed( _val )
{
    InitRandom(yyGetInt32(_val));
}


// #############################################################################################
/// Function:<summary>
///          	Sets the seed to a random number
///          </summary>
// #############################################################################################
function randomize() 
{
	var d =  new Date();
	var t = d.getMilliseconds();
	t = (t & 0xffffffff) ^ ((t >> 16) & 0xffff) ^ ((t << 16) & 0xffff0000);
    return InitRandom( t );
}
var randomise = randomize;

// #############################################################################################
/// Function:<summary>
///          	Returns a random real number between val0 (inclusive) and val1 (inclusive). 
///             Both val0 and val1 must be integer values (otherwise they are rounded down).
///          </summary>
///
/// In:		<param name="val0"></param>
///			<param name="val1"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function irandom_range(val0, val1) 
{
    val0 = yyGetInt32(val0);
    val1 = yyGetInt32(val1);

    var lower, higher;
    if (val0 > val1) {
        lower = val1;
        higher = val0;
    }
    else {
        lower = val0;
        higher = val1;
    }

    // '| 0' effectively casts to an integer
    var x1 = lower | 0;
    var x2 = higher | 0;
    var result = x1 + ~~random(x2 - x1 + 1);

    return result;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the current seed.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function random_get_seed() 
{
    return g_nRandSeed;
}


// #############################################################################################
/// Function:<summary>
///             Returns one of the arguments choosen randomly.
///          </summary>
///
/// In:		 <param name="paramlist">     variable length arguments    </param>
/// Out:	 <returns>
///				One of the arguments chosen at random.
///			 </returns>
// #############################################################################################
function choose()
{
    var args = arguments;
    var argc = arguments.length;
    if (argc == 0) return 0;
    var index = Math.floor(random(argc));
    return args[index];
}


// #############################################################################################
/// Function:<summary>
///          	Returns the sign of x 
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				Returns the sign of x (-1, 0 or 1).
///			</returns>
// #############################################################################################
function sign(_x) {
    _x = yyGetReal(_x);
    if( _x==0 ) return 0;
    if( _x<0 ) return -1;
    return 1;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the ceiling of x, that is, x rounded up to an integer.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
//var ceil = Math.ceil;
function ceil(_x)
{
    return Math.ceil(yyGetReal(_x));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the fractional part of x, that is, the part behind the decimal dot.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function frac(_x) {
    _x = yyGetReal(_x);
    return _x-~~_x;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the square root of x. x must be non-negative.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sqrt(_x) 
{
    _x = yyGetReal(_x);

    if (_x >= 0)
        return Math.sqrt(_x);
    else 
        yyError("Cannot apply sqrt to negative number.");
}

// #############################################################################################
/// Function:<summary>
///          	Returns x*x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sqr(_x) 
{
    _x = yyGetReal(_x);
    return _x*_x;
}

// #############################################################################################
/// Function:<summary>
///          	Returns x to the power n.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_n"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
//var power = Math.pow;
function power(_x, _n)
{
    return Math.pow(yyGetReal(_x), yyGetReal(_n));
}


// #############################################################################################
/// Function:<summary>
///          	Returns e to the power x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
//var exp = Math.exp;
function exp(_x)
{
    return Math.exp(yyGetReal(_x));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the natural logarithm of x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
//var ln = Math.log;
function ln(_x) 
{    
    return Math.log(yyGetReal(_x));
}

// #############################################################################################
/// Function: <summary>
///             Returns the log base 2 of x.
///           </summary>
///
/// In:		<param name="_x"></param>
///
// #############################################################################################
function log2(_x) 
{
    return Math.log(yyGetReal(_x)) / Math.LN2;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the log base 10 of x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function log10(_x) 
{
    return Math.log(yyGetReal(_x)) / Math.LN10;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the log base n of x.
///          </summary>
///
/// In:		<param name="_n"></param>
///			<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function logn(_n,_x) 
{
    return Math.log(yyGetReal(_x)) / Math.log(yyGetReal(_n));
}

// #############################################################################################
/// Function:<summary>
///          	Returns the inverse sine of x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function arcsin(_val)
{
    var val = yyGetReal(_val);
    if (yyApproximatelyEqual(val, -1.0))
    {
        val = -1.0;
    }
    else if (yyApproximatelyEqual(val, 1.0))
    {
        val = 1.0;
    }

    if (val < -1.0 || val > 1.0)
    {
        yyError("Value " + val + " is not within valid range [-1.0, 1.0]: arcsin()");
    }

    return Math.asin(val);
}

function darcsin(_x) 
{
    return arcsin(_x) * 57.2957795;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the inverse cosine of x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function arccos(_val)
{
    var val = yyGetReal(_val);
    if (yyApproximatelyEqual(val, -1.0))
    {
        val = -1.0;
    }
    else if (yyApproximatelyEqual(val, 1.0))
    {
        val = 1.0;
    }

    if (val < -1.0 || val > 1.0)
    {
        yyError("Value " + val + " is not within valid range [-1.0, 1.0]: arccos()");
    }

    return Math.acos(val);
}

function darccos(_x) 
{
    return arccos(_x) * 57.2957795;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the inverse tangent of x.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function arctan(_val)
{
    return Math.atan(yyGetReal(_val));
}

function darctan(_x) 
{
    return Math.atan(yyGetReal(_x)) * 57.2957795;
}

// #############################################################################################
/// Function:<summary>
///          	Calculates arctan(Y/X), and returns an angle in the correct quadrant.
///          </summary>
///
/// In:		<param name="_y"></param>
///			<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function arctan2(_y, _x)
{
    return Math.atan2(yyGetReal(_y), yyGetReal(_x));
}

function darctan2(_y,_x) 
{
    return arctan2(_y, _x) * 57.2957795;
}

// #############################################################################################
/// Function:<summary>
///          	Converts degrees to radians.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function degtorad(_x) {
    return yyGetReal(_x) * 0.0174532925;
}

// #############################################################################################
/// Function:<summary>
///          	Converts radians to degrees.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function radtodeg(_x) {
    return yyGetReal(_x) * 57.2957795;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the average of the values. 
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function mean() 
{
	var args = mean.arguments;
	var argc = mean.arguments.length;

	if (argc == 0) return 0;
    
	var m = yyGetReal(args[0]);
    for(var i=1;i<argc;i++){
        m += yyGetReal(args[i]);
    }
    return (m/argc);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the median of the values, that is, the middle value. 
///             (When the number of arguments is even, the smaller of the two middle values is 
///             returned.) The function can have up to 16 arguments. They must all be real values.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function median()
{
    var args = median.arguments;
    var argc = median.arguments.length;

    if (argc == 0) return 0;

    var arr = [];
    for ( var i = 0; i < argc; i++ ) {
		arr[i] = yyGetReal(args[i]);
    } // end for

    // sort
    arr.sort(function (a, b) {return a - b;});

    // find
    return arr[ ~~(argc/2) ];

}


// #############################################################################################
/// Function:<summary>
///          	Returns a simple dot product
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dot_product(_x1, _y1, _x2, _y2) {
    return (yyGetReal(_x1) * yyGetReal(_x2) + yyGetReal(_y1) * yyGetReal(_y2));
}

// #############################################################################################
/// Function:<summary>
///          	Returns a simple dot product
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dot_product_3d(_x1, _y1, _z1, _x2, _y2, _z2) {
    return (yyGetReal(_x1) * yyGetReal(_x2) + yyGetReal(_y1) * yyGetReal(_y2) + yyGetReal(_z1) * yyGetReal(_z2));
}

// #############################################################################################
/// Function:<summary>
///          	HTML5 does not currently use an epsilon, so throw away
///          </summary>
///
/// In:		<param name="_d">Epsilon value</param>
// #############################################################################################
function math_set_epsilon(_d) {
    var v = yyGetReal(_d);
    if ((v >= 0) && (v < 1)) {
        if (v == 0) v = 0.00000000001;
        g_GMLMathEpsilon = v;
    }
} 

// #############################################################################################
/// Function:<summary>
///          	HTML5 does not currently use an epsilon, so return 0.0
///          </summary>
// #############################################################################################
function math_get_epsilon() {
    return g_GMLMathEpsilon;
} 


// #############################################################################################
/// Function:<summary>
///          	normalizes the vectors (x1,y1) and (x2,y2) to unit vectors, and returns the 
///             dot product of these normalized vectors."
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dot_product_normalised(_x1,_y1,_x2,_y2) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    // Make vertor 1 a UNIT vector
    var mag1 = Math.sqrt( _x1*_x1   + _y1*_y1 );

    // Make vertor 2 a UNIT vector
    var mag2 = Math.sqrt( _x2*_x2   + _y2*_y2 );

    // return DOT product
    return (_x1 * _x2 + _y1 * _y2) / (mag1 * mag2);
}
var dot_product_normalized = dot_product_normalised;

// #############################################################################################
/// Function:<summary>
///          	normalizes the vectors (x1,y1) and (x2,y2) to unit vectors, and returns the 
///             dot product of these normalized vectors."
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function dot_product_3d_normalised(_x1, _y1, _z1, _x2, _y2, _z2) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _z1 = yyGetReal(_z1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _z2 = yyGetReal(_z2);

	// Make vertor 1 a UNIT vector
	var mag1 = Math.sqrt(_x1 * _x1 + _y1 * _y1 + _z1 * _z1 );

	// Make vertor 2 a UNIT vector
	var mag2 = Math.sqrt(_x2 * _x2 + _y2 * _y2 + _z2 * _z2);

    // return DOT product
	return (_x1 * _x2 + _y1 * _y2 + _z1 * _z2) / (mag1 * mag2);
}
var dot_product_3d_normalized = dot_product_3d_normalised;

// #############################################################################################
/// Function:<summary>
///          	Returns whether x is a real value (as opposed to a string).
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function is_real(_x) {
    if (typeof (_x) == "number") return true;
    else return false;
}

function is_numeric(_x) {
    var ret = false;
    switch (typeof (_x)) {
    case "number":
    case "boolean":
        ret = true;
        break;
    case "object":
        if (_x instanceof Long) {
            ret = true;
        } // end if
        break;
    } // end switch
    return ret;
} // end is_numeric

function is_bool(_x) {
	if (typeof (_x) == "boolean") return true; 
	else return false;
}

function is_undefined(_x) {
	if (typeof (_x) == "undefined") return true; 
	else return false;
}

function is_int32(_x) {
	if ((typeof (_x) === "number") && (~~_x === _x)) return true; 
	else return false;
}

function is_int64(_x) {
    if (_x instanceof Long) return true;
	else return false;
}

function is_ptr(_x) {
    return (typeof(_x) == "object" && (_x instanceof ArrayBuffer)) ? true : false;
}

function is_struct(_x) {
    return ((typeof _x === "object") && (_x.__yyIsGMLObject)) ? true : false;
}

function is_nan(_x) {
    
    // Try to convert to Real and check isNaN
    try 
    {
        // If x is a pointer then it's a number.
        if (is_ptr(_x)) return false;
        if (is_struct(_x)) return true;
        if (is_method(_x)) return true;

        // Else try to convert to real
        value = yyGetReal(_x);
        return Number.isNaN(value);
    }
    // If there was an error then it's not-a-number
    catch 
    { 
        return true;
    }
}

function is_infinity(_x) {

    // Try to convert to Real and check for infinity
    try 
    {
        _x = yyGetReal(_x);
        return !Number.isFinite(_x) && !Number.isNaN(_x);
    }
    // If there was an error then it's not infinity.
    catch 
    { 
        return false;
    }
}

function static_get( s )
{
    var ret = undefined;
    switch( typeof(s) ) {
        case "number":
            var funcId = yyGetInt32(s);
            if (funcId >= 100000) {
                func = JSON_game.Scripts[ funcId - 100000];
                ret = func.prototype;
                ret.__yyIsGMLObject = true;
            } // end if
            break;
        case "function":
            ret = s.prototype;
            ret.__yyIsGMLObject = true;
            break;
        case "object":
            ret = Object.getPrototypeOf(s);
            if (s.__yyIsGMLObject) ret.__yyIsGMLObject = true;
            break;
    } // end switch
    return ret;
} // end static_get

function static_set( d, s )
{
    if ((typeof(s) == "object") && (typeof(d) == "object")) {
        Object.setPrototypeOf(d, s);
    } // end if
} // end static_set

function YYIsInstanceof(_x,_v)
{
    var ret = false;
    if ((typeof(_x) == "object") && (_x.__yyIsGMLObject === true)) {
        var func = undefined;
        var funcId = yyGetInt32(_v);
        if (funcId >= 100000)
            func = JSON_game.Scripts[ funcId - 100000];

        if (func) {

            var c = Object.getPrototypeOf(_x);
            var funcProto  = func.prototype;
            while( c && !ret ) {
                if (c === funcProto) {
                    ret = true;
                    break;
                } // end if

                c =Object.getPrototypeOf(c);
            } // end while

        } // end if
    } // end if

    return ret;
}

function YYInstanceof(_x) {
    var type = typeof(_x);
    var ret = undefined;
    switch( type )
    {
        case "function": ret = "function"; break;
        case "object":
            if (_x instanceof Function)
                ret = "function";
            else
            if (_x.__type === "[instance]") {
                ret = "instance";
            } else
            if (_x.__type === "[weakref]")
            {
                ret = "weakref";
            } else
            if (_x.__type !== undefined ) {
                ret = _x.__type;
                if (ret.startsWith("gml_Script_")) {
                    ret = ret.substring( 11 );
                } // end if
                if (ret.startsWith("___struct___")) {
                    ret = "struct";
                }
            } // end if
            break;
        default:
            break;
    } // end switch
    return ret;
} // end YYInstanceof

function YYTypeof(_x) {
    var ret = typeof(_x);
    switch (ret) {
        case "boolean": return "bool";
        case "function": return "method";
        case "object":
            // JS objects that aren't arrays count as pointers
            return (_x instanceof Array) ? "array" : (_x instanceof ArrayBuffer) ? "ptr" : (_x instanceof Long) ? "int64" : "struct";
        default: return ret;
    }
}

function int64(_x)
{
    if (_x == undefined)
    {
        yyError("int64() argument is undefined");
    }
    else if (_x == null)
    {
        yyError("int64() argument is unset");
    }
    else if (_x instanceof Array)
    {
        yyError("int64() argument is array");
    }

    if ((_x) instanceof Long)
    {
        return _x;
    }
    switch( typeof(_x) )
    {
        case "boolean":
            return Long.fromValue( _x ? 1 : 0, false);
            break;
        default:
            return Long.fromValue(_x, false);
            break;
    }
}

function ptr(_x) {
    // JS does not really have pointers so this function can't do much
    if (_x instanceof ArrayBuffer ) return _x;
    if (_x instanceof Array) yyError( "ptr argument is an array");
    if (_x === undefined) yyError( "ptr argument is undefined");
    var ret = new ArrayBuffer(8);
    var view = new DataView(ret);
    if (typeof _x !== "string") { 
        view.setFloat64( 0, yyGetReal(_x) );
    } // end if
    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether x is a string (as opposed to a real value).
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function is_string(_x) 
{
    if (typeof(_x) == "string") return 1; else return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether x is an array.
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				true if _x is an array
///			</returns>
// #############################################################################################
function is_array(_x) 
{
    if (_x instanceof Array ) return 1; else return 0;
}

// #############################################################################################
/// Function:<summary>
///          	if _x is an array then get the length of it (in 1D)
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				void
///			</returns>
// #############################################################################################
function array_length_1d(_x)
{
    var ret = undefined;
    if (_x instanceof Array)
    {
        ret = _x.length;
    }
    return ret;
}

var array_length = array_length_1d;

// #############################################################################################
/// Function:<summary>
///          	if _x is an array and _d is a dimension then get the length of it (in 2D)
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				length of the axis
///			</returns>
// #############################################################################################
function array_length_2d(_x,_d)
{
    _d = yyGetInt32(_d);

    var ret = 0;
    if ((_x instanceof Array) && (_d >= 0) && (_d < _x.length)) {
        var second = _x[_d];
        if (second instanceof Array) {
            ret = second.length;
        }
    }
    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	if _x is an array then get the height of it (in 2D)
///          </summary>
///
/// In:		<param name="_x"></param>
/// Out:	<returns>
///				number of rows in the array
///			</returns>
// #############################################################################################
function array_height_2d(_x)
{
    var ret = 0;    
    if ((_x instanceof Array)) 
    {
        ret = _x.length;
    }
    return ret;
}


// #############################################################################################
/// Function:<summary>
///          	CLAMP a number between 2 values.
///          </summary>
///
/// In:		<param name="_value">value to clamp</param>
///			<param name="_min">MIN value to clmp to</param>
///			<param name="_max">MAX value to clamp to</param>
/// Out:	<returns>
///				"clamped" value.
///			</returns>
// #############################################################################################
function clamp(_value, _min, _max) {
    _value = yyGetReal(_value);
    _min = yyGetReal(_min);
    _max = yyGetReal(_max);

	if (_value < _min)
		_value = _min;
	if (_value > _max)
		_value = _max;
	return _value;
}

// #############################################################################################
/// Function:<summary>
///          	Do a LERP between 2 values.
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function lerp(_val1, _val2, _amount) {
    _val1 = yyGetReal(_val1);
    _val2 = yyGetReal(_val2);

    return _val1 + ((_val2 - _val1) * _amount);
}


// #############################################################################################
/// Function:<summary>
///          	Return the difference between 2 angles, giving -180 to +180
///          </summary>
///
/// In:		<param name="_src">FROM angle</param>
///			<param name="_dest">TO angle</param>
/// Out:	<returns>
///				The distance between 2 angles -180 to +180
///			</returns>
// #############################################################################################
function angle_difference(_src, _dest) {
    _src = yyGetReal(_src);
    _dest = yyGetReal(_dest);

    return ((((_src - _dest) % 360.0) + 540.0) % 360.0) - 180.0;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether two values are within the current epsilon of each other.
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				true if the values are equal within the given precision, false otherwise.
///			</returns>
// #############################################################################################
function yyApproximatelyEqual(_val1, _val2)
{
    var f = _val1 - _val2;
    return abs(f) <= g_GMLMathEpsilon;
}


// #############################################################################################
/// Function:<summary>
///          	Compares two values with variable precision.
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
///         <param name="_prec"></param>
/// Out:	<returns>
///				0 if the values are equal within the given precision, <= -1.0 if _val1 is less than _val2, >= 1.0 if _val1 is greater than _val2.
///			</returns>
// #############################################################################################
var g_NumberRE = new RegExp(
    '^' +                           // No leading content.
    '[-+]?' +                       // Optional sign.
    '(?:[0-9]{0,30}\\.)?' +         // Optionally 0-30 decimal digits of mantissa.
    '[0-9]{1,30}' +                 // 1-30 decimal digits of integer or fraction.
    '(?:[Ee][-+]?[1-2]?[0-9])?'    // Optional exponent 0-29 for scientific notation.
);
function yyCompareVal(_val1, _val2, _prec, _showError) {
    var ret = undefined;
    _showError = (_showError == undefined) ?  true : _showError;
    if ((typeof _val1 == "number") && (typeof _val2 == "number")) {
        var f = _val1 - _val2;
        if (Number.isNaN(f)) {
            f = (_val1 == _val2) ? 0 : f;
        } // end if
        ret = abs(f) <= _prec ? 0 : (f < 0.0) ? -1 : 1;
    } // end if
    else if (typeof _val1 == "string" && typeof _val2 == "string")
    {
        // both values are strings
        ret = (_val1 === _val2) ? 0 : ((_val1 > _val2) ? 1 : -1);
    }
    else if (_val1 === undefined && _val2 === undefined)
    {
        // both values are undefined
        ret = 0;
    }
    else if (_val1 instanceof ArrayBuffer && _val2 instanceof ArrayBuffer)
    {
        ret = _val1 == _val2 ? 0 : 1;
    }
    else if (_val1 instanceof Array && _val2 instanceof Array)
    {
        ret = _val1.length - _val2.length;
        if (ret == 0) {
            ret = _val1 === _val2 ? 0 : 1;
        } // end if
    }
    else if (_val1 instanceof Long && _val2 instanceof Long)
    {
        // both values are long
        ret = (_val1.sub(_val2)).toNumber();
    } // end if
    else if ((_val1 === undefined && _val2 instanceof Array) ||  (_val2 === undefined && _val1 instanceof Array))
    {
        // both values are undefined
        ret = 1;
    } // end if
    else if (typeof _val1 == "object" && typeof _val2 == "object" && _val1.__yyIsGMLObject && _val2.__yyIsGMLObject) 
    {
        ret = _val1 == _val2 ? 0 : 1;
    } // end if
    else if (typeof _val1 == "object" && typeof _val2 == "object") 
    {
        ret = _val1 == _val2 ? 0 : 1;
    } // end if
    else if (typeof _val1 == "function" && typeof _val2 == "function") {
        ret = _val1 == _val2 ? 0 : 1;
    }

    if (ret === undefined) {
        // convert _val1 into number (if possible)
        if (typeof _val1 == "boolean")
        {
            _val1 = _val1 ? 1 : 0;
        } // end if
        else
        if (typeof _val1 == "string")
        {
            _val1 = _val1.trim();
            var match = _val1.match(g_NumberRE);
            if (match != null) {
                _val1 = Number(match);
                if (Number.isNaN(_val1)) ret = 1;
            } // end if
            else ret = Number.NaN;
        } // end if
        else if (_val1 instanceof Long)
        {
            //_val1 value is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
            _val1 = _val1.toNumber();
        } // end if
        else if (_val1 instanceof Array)
        {
            ret = 1;
            if (_showError)
                yyError( "illegal array use")
        } // end if
        else if (_val1  === undefined) {
            ret = -2;
        } // end if

        // convert val2 into number (if possible)
        if (typeof _val2 == "boolean")
        {
            _val2 = _val2 ? 1 : 0;
        } // end if
        else
        if (typeof _val2 == "string")
        {
            _val2 = _val2.trim();
            var match = _val2.match(g_NumberRE);
            if (match != null) {
                _val2 = Number(match);
                if (Number.isNaN(_val2)) ret = 1;
            } // end if
            else ret = Number.NaN;
        } // end if
        else if (_val2 instanceof Long)
        {
            //_val2 value is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
            _val2 = _val2.toNumber();
        } // end if
        else if (_val2 instanceof Array)
        {
            if (_showError)
                yyError( "illegal array use")
        } // end if
        else if (_val2  === undefined) {
            ret = -2;
        } // end if

        if (ret === undefined) {
            if ((typeof _val1 == "number") && (typeof _val2 == "number")) {
                var f = _val1 - _val2;
                if (Number.isNaN(f)) {
                    f = (_val1 == _val2) ? 0 : f;
                }
                ret = abs(f) <= _prec ? 0 : (f < 0.0) ? -1 : 1;
            } // end if
            else {            
                ret = 1;
                if (typeof _val1 == "number") {
                    ret = -1;
                } // end if
            }  // end else
        } // end if
    }  // end if
    return ret;
}



// #############################################################################################
/// Function:<summary>
///          	Adds together two values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The result of _val1 + _val2
///			</returns>
// #############################################################################################
function yyfplus(_val1, _val2) {
    if (_val1 instanceof Long && _val2 instanceof Long) {
        // _val1 is long, promote _val2 to long (if necessary) and return the result.
        return _val1.add(_val2);
    }
    else
    if (_val1 instanceof Long) {
        // _val1 is long, promote _val2 to long (if necessary) and return the result.
        _val1 = _val1.toNumber();
    }
    else if (_val2 instanceof Long) {
        // _val2 is long, promote _val1 to long (if necessary) and return the result.
        _val2 = _val2.toNumber();
    }

    if ((typeof _val1 === "string") && (typeof _val2 === "string"))
        return _val1 + _val2;

    if ((typeof _val1 === "string") && (typeof _val2 !== "string"))
        yyError( "unable to add string to " + typeof _val2);

    return yyGetReal(_val1) + yyGetReal(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Subtracts the second value from the first
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The result of _val1 - _val2
///			</returns>
// #############################################################################################
function yyfminus(_val1, _val2) {
    if (_val1 instanceof Long && _val2 instanceof Long) {
        // _val1 is long, promote _val2 to long (if necessary) and return the result.
        return _val1.sub(_val2);
    }
    else
    if (_val1 instanceof Long) {
        // _val1 is long, promote _val2 to long (if necessary) and return the result.
        _val1 = _val1.toNumber();
    }
    else if (_val2 instanceof Long) {
        // _val2 is long, promote _val1 to long (if necessary) and return the result.
        _val2 = _val2.toNumber();
    }

    return yyGetReal(_val1) - yyGetReal(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Multiplies two values together
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The product of _val1 and _val2
///			</returns>
// #############################################################################################
function yyftime(_val1, _val2) {
    if (_val1 instanceof Long && _val2 instanceof Long) {
        // _val1 and _val2 are long
        return _val1.mul(_val2);
    }
    else if (_val1 instanceof Long) {
        // _val1 is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val1 = _val1.toNumber();
    }
    else if (_val2 instanceof Long) {
        // _val2 is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val2 = _val2.toNumber();
    }

    if ((typeof _val1 === "number") && (typeof _val2 === "string")) {
        var ret = "";
        for( var n=yyGetReal(_val1)-1; n>=0 ; --n ) {
            ret += _val2;
        } // end for
        return ret;
    } // end if
    else 
        return yyGetReal(_val1) * yyGetReal(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the division of one value by another
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The result of _val1 / _val2
///			</returns>
// #############################################################################################
function yyfdivide(_val1, _val2) {
    if ((typeof _val1 === "number") && (typeof _val2 === "number")) {
        return _val1 / _val2;
    } 
    else if (_val1 instanceof Long && _val2 instanceof Long) {
        // _val1 and _val2 are long
        return _val1.div(_val2);
    } // end if

    //var intRet = false;
    if (_val1 instanceof Long) {
        _val1 = _val1.toNumber();
        //return _val1.div(yyGetReal(_val2));
    } // end if
    if (_val2 instanceof Long) {
        // _val2 is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val2 =  _val2.toNumber();
    } // end if

    var v1 = yyGetReal(_val1);
    var v2 = yyGetReal(_val2);
    var ret =  v1 / v2;

    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the remainder of dividing one value by another
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The result of _val1 % _val2
///			</returns>
// #############################################################################################
function yyfmod(_val1, _val2) {
    if ((_val1 instanceof Long) && (_val2 instanceof Long)){
        // _val1 is long - attempt to preserve type if possible
        return _val1.mod(_val2);
    }
    if (_val2 instanceof Long) {
        //_val2 value is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val2 = _val2.toNumber();
    }
    if (_val1 instanceof Long) {
        //_val2 value is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val1 = _val1.toNumber();
    }

    var v2 = yyGetReal(_val2);
    if (v2 == 0) {
        yyError( "unable to mod with zero");
    } // end if

    return yyGetReal(_val1) % v2;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of times one value can be divided by another producing a only an interger quotient
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				The the number of times one value can be divided by another producing a only an interger quotient
///			</returns>
// #############################################################################################
function yyfdiv(_val1, _val2) {
    if (_val1 instanceof Long) {
        return _val1.div(_val2);
    }
    else if (_val2 instanceof Long) {
        //_val2 value is long, promote it to a number (precision for numbers > (2^53)-1 is lost)
        _val2 = _val2.toNumber();
    }

    if (_val2 == 0) yyError( "divide by zero");
    var v1 = yyGetReal(_val1);
    var v2 = yyGetReal(_val2);
    var v1NaN = Number.isNaN(v1);
    var v2NaN = Number.isNaN(v2);
    if (v1NaN ||v2NaN) {

        // this is Nan div Nan
        if (v1NaN && v2NaN)
            return 1;

        // this is Nan div x
        if (v1NaN) {
            if (Number.isFinite(v2)) 
                return v1;
            else
                return 1;
        } // end if

        // this is x div Nan 
        if (v2NaN) {
            if (Number.isFinite(v1)) 
                return v2;
            else
                return 1;
        } // end if
    } // end if

    if (v1 === v2) return 1;

    return ~~(~~v1 / ~~v2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether two values are not equal to each other
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if the two values are not equal, false otherwise
///			</returns>
// #############################################################################################
function yyfnotequal(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon, false);
    //if (Number.isNaN(ret)) {
    //    yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    //} // end if
    return ret != 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether two values are equal to each other
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if the two values are equal, false otherwise
///			</returns>
// #############################################################################################
function yyfequal(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon, false);
    //if (Number.isNaN(ret)) {
    //    yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    //} // end if
    return ret == 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the first value is strictly less than the second value
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 < _val2
///			</returns>
// #############################################################################################
function yyfless(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon);
    if (Number.isNaN(ret)) {
        yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    } // end if
    return ret == -2 ? false : ret < 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the first value is less than or equal to the second value
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 <= _val2
///			</returns>
// #############################################################################################
function yyflessequal(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon);
    if (Number.isNaN(ret)) {
        yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    } // end if
    return ret == -2 ? false : ret <= 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the first value is stricty greater than the second value
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 > _val2
///			</returns>
// #############################################################################################
function yyfgreater(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon);
    if (Number.isNaN(ret)) {
        yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    } // end if
    return ret == -2 ? false : ret > 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the first value is greater than or equal to the second value
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 >= _val2
///			</returns>
// #############################################################################################
function yyfgreaterequal(_val1, _val2) {
    var ret = yyCompareVal(_val1, _val2, g_GMLMathEpsilon);
    if (Number.isNaN(ret)) {
        yyError( "unable to compare " + string(_val1) + " to " + string(_val2));
    } // end if
    return ret == -2 ? false : ret >= 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the logical AND of two given boolean values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 AND _val2 are true, False otherwise
///			</returns>
// #############################################################################################
function yyfand(_val1, _val2) {
    return yyGetBool(_val1) && yyGetBool(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the logical OR of two given boolean values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 OR _val2 are true, False otherwise
///			</returns>
// #############################################################################################
function yyfor(_val1, _val2) {
    return yyGetBool(_val1) || yyGetBool(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the logical EXCLUSIVE-OR of two given boolean values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				True if _val1 OR _val2 are true but not both, False otherwise
///			</returns>
// #############################################################################################
function yyfxor(_val1, _val2) {
    _val2 = yyGetBool(_val2);
    return yyGetBool(_val1) ? !_val2 : _val2;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the bitwise AND of two given values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				_val1 & _val2
///			</returns>
// #############################################################################################
function yyfbitand(_val1, _val2) {
    if ((typeof _val1 === "number") && (typeof _val2 === "number")) 
        return _val1 & _val2;
    else if ((_val1 instanceof Long)  && (_val2 instanceof Long)) {
        return _val1.and( _val2 );
    }
    else if (_val1 instanceof Long) {
        return _val1.and( yyGetInt64(_val2) );
    }
    else if (_val2 instanceof Long) {
        return _val2.and( yyGetInt64(_val1) );
    }
    else if (typeof _val1 == "number") 
        return _val1 & yyGetInt32(_val2);
    else if (typeof _val2 == "number") 
        return yyGetInt32(_val1) & _val2;

    return yyGetInt32(_val1) & yyGetInt32(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the bitwise OR of two given values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				_val1 | _val2
///			</returns>
// #############################################################################################
function yyfbitor(_val1, _val2) {
    if ((typeof _val1 == "number") && (typeof _val2 == "number")) 
        return _val1 | _val2;
    else if ((_val1 instanceof Long)  && (_val2 instanceof Long)) {
        return _val1.or( _val2 );
    }
    else if (_val1 instanceof Long) {
        return _val1.or( yyGetInt64(_val2) );
    }
    else if (_val2 instanceof Long) {
        return _val2.or( yyGetInt64(_val1) );
    }
    else if (typeof _val1 == "number") 
        return _val1 | yyGetInt32(_val2);
    else if (typeof _val2 == "number") 
        return yyGetInt32(_val1) | _val2;

    return yyGetInt32(_val1) | yyGetInt32(_val2);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the bitwise XOR of two given values
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_val2"></param>
/// Out:	<returns>
///				_val1 ^ _val2
///			</returns>
// #############################################################################################
function yyfbitxor(_val1, _val2) {
    if ((typeof _val1 == "number") && (typeof _val2 == "number")) 
        return _val1 ^ _val2;
    else if ((_val1 instanceof Long)  && (_val2 instanceof Long)) {
        return _val1.xor( _val2 );
    }
    else if (_val1 instanceof Long) {
        return _val1.xor( yyGetInt64(_val2) );
    }
    else if (_val2 instanceof Long) {
        return _val2.xor( yyGetInt64(_val1) );
    }
    else if (typeof _val1 == "number") 
        return _val1 ^ yyGetInt32(_val2);
    else if (typeof _val2 == "number") 
        return yyGetInt32(_val1) ^ _val2;

    return yyGetInt32(_val1) ^  yyGetInt32(_val2);
}


// #############################################################################################
/// Function:<summary>
///          	Returns the first value with the bits shifted to the left the specified number of times
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_num"></param>
/// Out:	<returns>
///				_val1 << _num
///			</returns>
// #############################################################################################
function yyfbitshiftleft(_val1, _num) {
    var shift = yyGetInt32(_num);
    var fNeg = (_val1 < 0);
    if (fNeg) _val1 = -_val1;
    if (typeof _val1 == "number")  {
        _val1 = new Long(_val1);
    } // end else
    else
    if (_val1 instanceof Long) {
    } // end if
    else {
        _val1 = yyGetInt64(_val1);
    } // end else

    var ret = 0;
    if (shift >= 64) 
        ret = 0;
    else
        ret =_val1.shiftLeft(shift);
    if (fNeg) ret = -ret;
    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the first value with the bits shifted to the right the specified number of times
///          </summary>
///
/// In:		<param name="_val1"></param>
///			<param name="_num"></param>
/// Out:	<returns>
///				_val1 >> _num
///			</returns>
// #############################################################################################
function yyfbitshiftright(_val1, _num) {
    var shift = yyGetInt32(_num);
    var fNeg = (_val1 < 0);
    if (fNeg) _val1 = -_val1;
    if (typeof _val1 == "number")  {
        _val1 = new Long(_val1);
    } // end else
    else
    if (_val1 instanceof Long) {
    } // end if
    else {
        _val1 = yyGetInt64(_val1);
    } // end else

    var ret = 0;
    if (shift >= 64) 
        ret = 0;
    else
        ret =_val1.shiftRight(shift);
    if (fNeg) ret = -ret;
    return ret;
}



