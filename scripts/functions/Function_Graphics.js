
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Graphics.js
// Created:			09/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 09/06/2011		
// 
// **********************************************************************************************************************
var eBlend_Zero=1,
    eBlend_One=2,
    eBlend_SrcColour=3,
    eBlend_InvSrcColour=4,
    eBlend_SrcAlpha = 5,
    eBlend_InvSrcAlpha = 6,
    eBlend_DestAlpha = 7,
    eBlend_InvDestAlpha = 8,
    eBlend_DestColour=9,
    eBlend_InvDestColour=10,
    eBlend_SrcAlphaSat=11;

var offsethack = 0.0;

// #############################################################################################
/// Function:<summary>
///          	Get gui width
///          </summary>
///
/// Out:	<returns>
///				the current gui width
///			</returns>
// #############################################################################################
function display_get_gui_height() {
    var gui_height = g_GUIHeight;
    var scale = g_GUI_Y_Scale;
    if (gui_height < 0)
        gui_height = window_get_height();
    if (scale == 0.0)
        scale = 1.0;
    return gui_height / scale;
}

// #############################################################################################
/// Function:<summary>
///          	Get gui width
///          </summary>
///
/// Out:	<returns>
///				the current gui width
///			</returns>
// #############################################################################################
function display_get_gui_width() {
    var gui_width = g_GUIWidth;
    var scale = g_GUI_X_Scale;
	if( gui_width<0 )
	    gui_width = window_get_width();
    if (scale == 0.0)
        scale = 1.0;
	return gui_width / scale;
}

// #############################################################################################
/// Function:<summary>
///          	Get X DPI
///          </summary>
///
/// Out:	<returns>
///				DPI in "X" direction
///			</returns>
// #############################################################################################
function display_set_gui_size(_width,_height) 
{
	g_GUIWidth = yyGetInt32(_width); 
	g_GUIHeight = yyGetInt32(_height);
	
	g_GUI_Maximise = false;
	g_GUI_Xoffset = 0;
	g_GUI_Yoffset = 0;
	g_GUI_X_Scale = 1;
	g_GUI_Y_Scale = 1;

    //update now?
    if( g_InGUI_Zone )
    {
        Calc_GUI_Scale();
    }
}

function display_set_gui_maximise(_xscale, _yscale, _xoffset, _yoffset)
{
    g_GUI_Maximise = true;
	g_GUI_Xoffset = 0;
	g_GUI_Yoffset = 0;
	g_GUI_X_Scale = 1;
	g_GUI_Y_Scale = 1;
	g_GUIWidth = -1;
	g_GUIHeight = -1;

	if (_xscale == -1 && _yscale == -1 && _xoffset == undefined && _yoffset == undefined)
	{
		if (g_InGUI_Zone) {
			Calc_GUI_Scale();
		}
		return;
	}
		
    if( _xscale != undefined ) g_GUI_X_Scale = yyGetReal(_xscale);
    if( _yscale != undefined ) g_GUI_Y_Scale = yyGetReal(_yscale);
    if( _xoffset != undefined ) g_GUI_Xoffset = yyGetReal(_xoffset);
    if( _yoffset != undefined ) g_GUI_Yoffset = yyGetReal(_yoffset);

    //update now?
    if( g_InGUI_Zone )
    {
        Calc_GUI_Scale();
    }
}

var display_set_gui_maximize = display_set_gui_maximise;

// #############################################################################################
/// Function:<summary>
///          	Get X DPI
///          </summary>
///
/// Out:	<returns>
///				DPI in "X" direction
///			</returns>
// #############################################################################################
var DPI_X = 96 ;
function display_get_dpi_x() { return DPI_X * window.devicePixelRatio; }

// #############################################################################################
/// Function:<summary>
///          	Get Y DPI
///          </summary>
///
/// Out:	<returns>
///				DPI in "Y" direction
///			</returns>
// #############################################################################################
var DPI_Y = 96;
function display_get_dpi_y() { return DPI_Y; }

// #############################################################################################
/// Function:<summary>
///          	Returns the width of the display in pixels.
///             (returns the CANVAS size)
///          </summary>
///
/// Out:	<returns>
///				width of the canvas in pixels
///			</returns>
// #############################################################################################
function display_get_width()
{
	return GetBrowserWidth();
}

// #############################################################################################
/// Function:<summary>
///          	Returns the height of the display in pixels.
///             (returns the CANVAS size)
///          </summary>
///
/// Out:	<returns>
///				height of the canvas in pixels
///			</returns>
// #############################################################################################
function display_get_height()
{
    return GetBrowserHeight();
}


// #############################################################################################
/// Function:<summary>
///          	Get the orientation of the device.
///          </summary>
///
/// Out:	<returns>
///				Currently always returns 0 (LANDSCAPE)
///			</returns>
// #############################################################################################
function display_get_orientation() {
	return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Clears the entire room in the given color (no alpha blending).
///          </summary>
///
/// In:		<param name="_col">Colour to clear to</param>
///				
// #############################################################################################
function draw_clear( _col )
{
	Graphics_ClearScreen(ConvertGMColour(yyGetInt32(_col)));
}

// #############################################################################################
/// Function:<summary>
///          	Clears the entire room in the given color and alpha value 
///             (in particular useful for surfaces).
///          </summary>
///
/// In:		<param name="_col"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_clear_alpha = draw_clear_alpha_RELEASE;
function draw_clear_alpha_RELEASE(_col, _alpha) 
{
    _col = yyGetInt32(_col);
    _alpha = yyGetReal(_alpha);

    Graphics_Save();

	var trans = [];
	trans[0] = 1;
	trans[1] = 0;
	trans[2] = 0;
	trans[3] = 1;
	trans[4] = 0;
	trans[5] = 0;
	graphics._setTransform(trans[0], trans[1], trans[2], trans[3], trans[4], trans[5]);


	// if its a total clear, then we can use clearRect....if it's there.
	if (!graphics.clearRect || _col != 0 || _alpha != 0)
	{
		graphics.globalAlpha = _alpha;
		graphics.fillStyle = GetHTMLRGBA( ConvertGMColour(_col) ,_alpha);
		graphics.globalCompositeOperation = 'copy';
		graphics.fillRect(g_clipx, g_clipy, g_clipw, g_cliph);
	} 
	else
	{
		graphics.clearRect(g_clipx, g_clipy, g_clipw, g_cliph);
	}

	Graphics_Restore();
}


// #############################################################################################
/// Function:<summary>
///          	Returns a color with the indicated red, green, and blue components, where 
///             red, green and blue must be values between 0 and 255.
///          </summary>
///
/// In:		<param name="_red"></param>
///			<param name="_green"></param>
///			<param name="_blue"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function make_color_rgb(_red,_green,_blue) 
{
    return (yyGetInt32(_red)) | (yyGetInt32(_green) << 8) | (yyGetInt32(_blue) << 16);
}
function    make_color(_r, _g, _b) { return make_color_rgb(_r, _g, _b); }
var make_colour_rgb = make_color_rgb;
var make_colour = make_color;

// #############################################################################################
/// Function:<summary>
///          	Returns the red component of the color.
///          </summary>
///
/// In:		<param name="_col">colour to extract RED from</param>
/// Out:	<returns>
///				RED value
///			</returns>
// #############################################################################################
function color_get_blue(_col) 
{
    return (yyGetInt32(_col) >> 16) & 0xff;
}
var colour_get_blue = color_get_blue;

// #############################################################################################
/// Function:<summary>
///          	Returns the green component of the color.
///          </summary>
///
/// In:		<param name="_col">colour to extract GREEN from</param>
/// Out:	<returns>
///				GREEN value
///			</returns>
// #############################################################################################
function color_get_green(_col) 
{
    return (yyGetInt32(_col) >> 8) & 0xff;
}
var colour_get_green = color_get_green;


// #############################################################################################
/// Function:<summary>
///          	Returns the blue component of the color.
///          </summary>
///
/// In:		<param name="_col">colour to extract BLUE from</param>
/// Out:	<returns>
///				BLUE value
///			</returns>
// #############################################################################################
function color_get_red(_col) 
{
    return (yyGetInt32(_col) & 0xff);
}
var colour_get_red = color_get_red;


// #############################################################################################
/// Function:<summary>
///				Transforms a RGB color into a HSV color
///          </summary>
///
/// In:		 <param name="col">RGB colour to convert to HSV</param>
/// Out:	 <returns>
///				Converted HSV colour
///			 </returns>
// #############################################################################################
function Color_RGBtoHSV( _col )
{
    _col = yyGetInt32(_col);

	var rr = 0.0;
	var gg = 0.0;
	var bb = 0.0;
	var hh = 0.0;
	var ss = 0.0;
	var vv = 0.0;
	var d = 0.0;
	var m = 0.0;

	rr = (_col&0xff)/255.0;
	gg = ((_col>>8)&0xff)/255.0;	
	bb = ((_col>>16)&0xff)/255.0;
	m = yymin( yymin(rr,gg) , bb);
	vv = yymax( yymax(rr,gg) , bb);
	d = vv-m;

	if ( vv == 0 ) ss = 0.0; else ss = 1.0*d/vv;		
	if ( ss == 0 ) hh = 0.0;							
	else if ( rr == vv ) hh = 60.0*(gg-bb)/d;			
	else if ( gg == vv ) hh = 120.0 + 60.0*(bb-rr)/d;	
	else hh = 240.0 + 60.0*(rr-gg)/d ;				
	if ( hh<0 ) hh = hh+360.0;								
	
	// v,s,h
	var v = Math.min(255, Math.max( 0, vv * 255.0));
	var s = Math.min(255, Math.max( 0, ss * 255.0));
	var h = Math.min(255, Math.max(0, (hh * 255.0) / 360.0));
	var Result = { h: h, s: s, v: v };
	return Result;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the hue component of the color.
///          </summary>
///
/// In:		<param name="_col"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function color_get_hue(_col) 
{
    var hsv = Color_RGBtoHSV(_col);
    return hsv.h;
}
var colour_get_hue = color_get_hue;

// #############################################################################################
/// Function:<summary>
///          	Returns the saturation component of the color.
///          </summary>
///
/// In:		<param name="_col"></param>
/// Out:	<returns>
///				The saturation of the colour
///			</returns>
// #############################################################################################
function color_get_saturation(_col)
{
    var hsv = Color_RGBtoHSV(_col);
    return hsv.s;
}
var colour_get_saturation = color_get_saturation;

// #############################################################################################
/// Function:<summary>
///          	Returns the value component of the color.
///          </summary>
///
/// In:		<param name="_col"></param>
/// Out:	<returns>
///				The value of the colour
///			</returns>
// #############################################################################################
function color_get_value(_col)
{
    var hsv = Color_RGBtoHSV(_col);
    return hsv.v;
}
var colour_get_value = color_get_value;

// #############################################################################################
/// Function:<summary>
///          	Returns a merged color of col1 and col2. The merging is determined by amount. 
///             A value of 0 corresponds to col1, a value of 1 to col2, and values in between to 
///             merged values.
///             DOES A LERP.
///          </summary>
///
/// In:		<param name="_col1"></param>
///			<param name="_col2"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function merge_color(_col1,_col2,_amount) 
{
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    _amount = yyGetReal(_amount);

    var r1 = (_col1>>16)&0xff;
    var g1 = (_col1>>8)&0xff;
    var b1 = _col1&0xff;

    var r2 = (_col2>>16)&0xff;
    var g2 = (_col2>>8)&0xff;
    var b2 = _col2&0xff;
    
    var amount2 = 1.0 - _amount;
    var r = ~~( r1*amount2 + r2*_amount);
    var g = ~~( g1*amount2 + g2*_amount);
    var b = ~~( b1*amount2 + b2*_amount);
    
    return ((r<<16)&0xff0000) | ((g<<8)&0xff00) | (b&0xff);
}
var merge_colour = merge_color;

// #############################################################################################
/// Function:<summary>
///             Returns a color with the indicated hue, saturation and value components 
///				(each between 0 and 255).
///          </summary>
///
/// In:		 <param name="_hue"></param>
///    		 <param name="_saturation"></param>
///  		 <param name="_value"></param>
///				
// #############################################################################################
function make_color_hsv( _hue,_saturation,_value ) 
{
	var rr = 0.0;
	var gg = 0.0;
	var bb = 0.0;
	var hh = 0.0;
	var ss = 0.0;
	var vv = 0.0;
	var f = 0.0;
	var p = 0.0;
	var q = 0.0;
	var t = 0.0;
	var i = 0;
	var Result;

	hh = yyGetReal(_hue)*360.0/255.0;
	if ( hh == 360.0 ) hh = 0.0;
	ss = yyGetReal(_saturation)/255.0;
	vv = yyGetReal(_value)/255.0;

	if (ss == 0)
	{
		rr = vv;
		gg = vv;
		bb = vv;
	}
	else
	{
		hh = hh/60.0; 
		i = Math.floor(hh);
		f = hh - i;
		p = vv*(1.0-ss);					
		q = vv*(1.0-(ss*f));				
		t = vv*(1.0-(ss*(1.0-f)));		
		switch ( i )
		{
			case 0: 	{ rr=vv; gg=t;  bb=p; } break;
			case 1: 	{ rr=q;  gg=vv; bb=p; } break;
			case 2: 	{ rr=p;  gg=vv; bb=t; } break;
			case 3: 	{ rr=p;  gg=q;  bb=vv; } break;
			case 4: 	{ rr=t;  gg=p;  bb=vv; } break;
			default:	{ rr=vv; gg=p; bb=q; }
		}
	}

	rr = Math.max(0, Math.min(255, Math.floor((rr * 255.0) + 0.5)));
	gg = Math.max(0, Math.min(255, Math.floor((gg * 255.0) + 0.5)));
	bb = Math.max(0, Math.min(255, Math.floor((bb * 255.0) + 0.5)));

	Result = rr | (gg << 8) | (bb << 16);
	return Result;

}
var make_colour_hsv = make_color_hsv;


// #############################################################################################
/// Function:<summary>
///             Set drawing alpha
///          </summary>
///
/// In:		 <param name="_alpha">Alpha value to set</param>
///				
// #############################################################################################
function draw_set_alpha( _alpha )
{
    _alpha = yyGetReal(_alpha);

    // cap _alpha to between 0 and 1
    if (_alpha < 0) { _alpha = 0; }
    if (_alpha > 1) { _alpha = 1; }
    
    g_GlobalAlpha = _alpha;    
    g_GlobalColour_HTML_RGBA = GetHTMLRGBA(g_GlobalColour, g_GlobalAlpha);
}

// #############################################################################################
/// Function:<summary>
///          	Get the current drawing alpha
///          </summary>
///
/// Out:	<returns>
///				the current global alpha value.
///			</returns>
// #############################################################################################
function draw_get_alpha( )
{
    return g_GlobalAlpha;
}

// #############################################################################################
/// Function:<summary>
///          	Get the current drawing colour
///          </summary>
///
/// Out:	<returns>
///				the current global colour value.
///			</returns>
// #############################################################################################
function draw_get_color( )
{
    return g_GlobalColour_GM;
}
var draw_get_colour = draw_get_color;

// #############################################################################################
/// Function:<summary>
///             Set drawing alpha
///          </summary>
///
/// In:		 <param name="_colour">Set global colour</param>
///				
// #############################################################################################
function draw_set_color( _colour )
{
    _colour = yyGetInt32(_colour);

    g_GlobalColour_GM = _colour;
    g_GlobalColour = ConvertGMColour(_colour);
    g_GlobalColour_HTML_RGB = GetHTMLRGB(g_GlobalColour);
    g_GlobalColour_HTML_RGBA = GetHTMLRGBA(g_GlobalColour,g_GlobalAlpha);
}

var draw_set_colour = draw_set_color;

function draw_set_lighting(_enable)
{
    d3d_set_lighting(_enable);
};
function draw_light_enable(ind,_enable)
{
    d3d_light_enable(ind,_enable);
};
function draw_light_define_direction(ind,dx,dy,dz,col)
{
    d3d_light_define_direction(ind,dx,dy,dz,col);
};
function draw_light_define_ambient(colour)
{
    d3d_light_define_ambient(colour);
};
function draw_light_define_point(ind, x, y, z, r, col)
{
    d3d_light_define_point(ind, x, y, z, r, col);
};


function draw_light_get_ambient()
{
    return d3d_light_get_ambient();
}

function draw_light_get(ind)
{
    return d3d_light_get(yyGetInt32(ind));
};

function draw_get_lighting() {
    return d3d_get_lighting();
}

// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################


// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
function draw_roundrect( _x1, _y1, _x2, _y2, _outline) {
    draw_roundrect_color_ext(_x1, _y1, _x2, _y2, 10, 10, g_GlobalColour_GM, g_GlobalColour_GM, _outline); 
}
// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
function draw_roundrect_ext(_x1, _y1, _x2, _y2, _radx, _rady, _outline) {
    draw_roundrect_color_ext(_x1, _y1, _x2, _y2, _radx, _rady, g_GlobalColour_GM, g_GlobalColour_GM, _outline);
}
// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
function draw_roundrect_color(_x1, _y1, _x2, _y2, _col1, _col2, _outline) {
    draw_roundrect_color_ext(_x1, _y1, _x2, _y2, 10, 10, _col1, _col2, _outline);
}
var draw_roundrect_colour = draw_roundrect_color;

// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
var draw_roundrect_color_ext = draw_roundrect_color_EXT_RELEASE;
var draw_roundrect_colour_ext = draw_roundrect_color_EXT_RELEASE;
function draw_roundrect_color_EXT_RELEASE(_x1, _y1, _x2, _y2, _radx, _rady, _col1, _col2, _outline) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _radx = yyGetReal(_radx);
    _rady = yyGetReal(_rady);
    _col1 = yyGetReal(_col1);
    _col2 = yyGetReal(_col2);
    _outline = yyGetBool(_outline);

    if (offsethack != 0.0)
    {
        _x1 += offsethack;
        _y1 += offsethack;
        _x2 += offsethack;
        _y2 += offsethack;
    }

    // Re-order the points if necessary to stop the curve pinching inwards
    if (_y2 < _y1) {
        var temp = _y1;
        _y1 = _y2;
        _y2 = temp;
    }
    if (_x2 < _x1) {
        var temp = _x1;
        _x1 = _x2;
        _x2 = temp;
    }

    var width = _x2 - _x1;
    var height = _y2 - _y1;

    var radiusx = _radx;
    var radiusy = _rady;

    var col = graphics.globalAlpha = g_GlobalAlpha;

    graphics.beginPath();
    graphics.moveTo(_x1 + radiusx, _y1);
    graphics.lineTo(_x1 + width - radiusx, _y1);
    graphics.quadraticCurveTo(_x1 + width, _y1, _x1 + width, _y1 + radiusy);
    graphics.lineTo(_x1 + width, _y1 + height - radiusy);
    graphics.quadraticCurveTo(_x1 + width, _y1 + height, _x1 + width - radiusx, _y1 + height);
    graphics.lineTo(_x1 + radiusx, _y1 + height);
    graphics.quadraticCurveTo(_x1, _y1 + height, _x1, _y1 + height - radiusy);
    graphics.lineTo(_x1, _y1 + radiusy);
    graphics.quadraticCurveTo(_x1, _y1, _x1 + radiusx, _y1);
    graphics.closePath();

    if (_outline) {
        graphics.strokeStyle = GetHTMLRGBA(ConvertGMColour(_col1), 1.0);
        graphics.stroke();
    } else {
        graphics.fillStyle = GetHTMLRGBA(ConvertGMColour(_col1), 1.0);
        graphics.fill();
    }
}

// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_outline">Outline the rect?</param>
///				
// #############################################################################################
var draw_rectangle = draw_rectangle_RELEASE;
function draw_rectangle_RELEASE ( _x1,_y1, _x2,_y2, _outline )
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _outline = yyGetBool(_outline);

	graphics.globalAlpha = g_GlobalAlpha;
    
    if( _outline )
    {
        if (offsethack != 0.0)
        {
            _x1 += offsethack;
            _y1 += offsethack;
            _x2 += offsethack;
            _y2 += offsethack;
        }

        graphics.lineWidth = 1;
        graphics.strokeStyle = g_GlobalColour_HTML_RGBA;
        graphics._strokeRect(_x1 + 0.5, _y1 + 0.5, (_x2 - _x1), (_y2 - _y1) );
    } else
    {

        if (offsethack != 0.0)
        {            
            _x2 += offsethack;
            _y2 += offsethack;
        }
        graphics.fillStyle = g_GlobalColour_HTML_RGBA;
        graphics._fillRect(_x1,_y1, _x2-_x1+1,_y2-_y1+1);
    }        
}

// #############################################################################################
/// Function:<summary>
///             Draw a "round" rectangle
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_col">Colour of the rect as a number</param>
///			 <param name="_outline">Whether or not to draw the rect as an outline</param>
///				
// #############################################################################################
var draw_rectangle_color = draw_rectangle_color_RELEASE;
var draw_rectangle_colour = draw_rectangle_color_RELEASE;
function    draw_rectangle_color_RELEASE( _x1,_y1, _x2,_y2, _col1, _col2,_col3,_col4, _outline ) {

    //return;

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    _col3 = yyGetInt32(_col3);
    _col4 = yyGetInt32(_col4);
    _outline = yyGetBool(_outline);

	var col = GetHTMLRGBA( ConvertGMColour(_col1), 1.0 );
	graphics.globalAlpha = g_GlobalAlpha;

    if (_outline)
    {
        if (offsethack != 0.0)
        {
            _x1 += offsethack;
            _y1 += offsethack;
            _x2 += offsethack;
            _y2 += offsethack;
        }

        graphics.lineWidth = 1;
        graphics.strokeStyle = col;
        graphics._strokeRect(_x1 + 0.5, _y1 + 0.5, (_x2 - _x1), (_y2 - _y1));
    }
    else 
    {
        if (offsethack != 0.0)
        {        
            _x2 += offsethack;
            _y2 += offsethack;
        }

        graphics.fillStyle = col;
        graphics._fillRect(_x1 + 0.5, _y1 + 0.5, (_x2 - _x1), (_y2 - _y1));
    }        
}

// #############################################################################################
/// Function:<summary>
///             Draw a rectangle with a gradient
///          </summary>
///
/// In:		 <param name="_x1">Top X coordinate</param>
///			 <param name="_y1">Top Y coordinate</param>
///			 <param name="_x2">Bottom X coordinate</param>
///			 <param name="_y2">Bottom X coordinate</param>
///			 <param name="_col1">Start colour of the rect as a number</param>
///			 <param name="_col2">End colour of the rect as a number</param>
///			 <param name="_vert">Whether or not the gradient should be vertical (or horizontal)</param>
///			 <param name="_outline">Whether or not to draw the rect as an outline</param>
///				
// #############################################################################################
var draw_rectangle_gradient = draw_rectangle_gradient_RELEASE;
function draw_rectangle_gradient_RELEASE(_x1, _y1, _x2, _y2, _col1, _col2, _vert, _outline)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    _vert = yyGetBool(_vert);
    _outline = yyGetBool(_outline);

	graphics.globalAlpha = g_GlobalAlpha;
	graphics.lineWidth = 1;

	var col1 = GetHTMLRGBA( ConvertGMColour(_col1), 1.0 );
    var col2 = GetHTMLRGBA( ConvertGMColour(_col2), 1.0 );
    var gradient;
    if (_vert) {
        gradient = graphics.createLinearGradient(_x1, _y1, _x1, _y2);
    }
    else {
        gradient = graphics.createLinearGradient(_x1, _y1, _x2, _y1);        
    }
    gradient.addColorStop(0, col1 );
    gradient.addColorStop(1, col2 );
    
    if (_outline)
    {
        if (offsethack != 0.0)
        {
            _x1 += offsethack;
            _y1 += offsethack;
            _x2 += offsethack;
            _y2 += offsethack;
        }

        graphics.strokeStyle = gradient;
        graphics._strokeRect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
    }
    else 
    {
        if (offsethack != 0.0)
        {        
            _x2 += offsethack;
            _y2 += offsethack;
        }

        graphics.fillStyle = gradient;
        graphics._fillRect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
    } 
}

// #############################################################################################
/// Function:<summary>
///          	Plot a single point
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_point = draw_point_RELEASE;
function draw_point_RELEASE(_x, _y)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    if (offsethack != 0.0)
    {
        _x += offsethack;
        _y += offsethack;    
    }

    graphics.globalAlpha = g_GlobalAlpha;
    graphics.fillStyle = g_GlobalColour_HTML_RGBA;
    graphics._fillRect(_x, _y, 1, 1);
}



// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2) with width w.
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
function draw_line_width(_x1, _y1, _x2, _y2, _w) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);

    if (offsethack != 0.0)
    {
        _x1 += offsethack;
        _y1 += offsethack;
        _x2 += offsethack;
        _y2 += offsethack;
    }

	// Start from the top-left point.
	graphics.globalAlpha = g_GlobalAlpha;
	graphics.strokeStyle = g_GlobalColour_HTML_RGB; // gradient; //g_GlobalColour_HTML_RGBA;
	graphics.lineWidth = yyGetReal(_w);

	graphics._beginPath();
	graphics._moveTo(_x1 + 0.5, _y1 +0.5);
	graphics._lineTo(_x2 + 0.5, _y2 + 0.5);
	graphics._closePath();
	graphics._stroke();
	graphics._fillRect(_x2, _y2, 1, 1);		// CHROME doesn't fill in the bottom pixel!
}




// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2).
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
function draw_line(_x1,_y1,_x2,_y2) 
{
    draw_line_width(_x1,_y1,_x2,_y2,1);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the color of the pixel corresponding to position (x,y) in the room. 
///             This is not very fast, so use with care.
///          </summary>
///
/// In:		<param name="_x">X coordinate of the pixel</param>
///			<param name="_y">Y coordinate of the pixel</param>
/// Out:	<returns>
///				The colour of the pixel, or 0 for off screen/canvas.
///			</returns>
// #############################################################################################
var draw_getpixel = draw_getpixel_RELEASE;
var draw_getpixel_ext = draw_getpixel_ext_RELEASE;
function draw_getpixel_RELEASE(_x, _y)
{    
    return draw_getpixel_ext_RELEASE(yyGetReal(_x), yyGetReal(_y)) & 0x00ffffff;
}

function draw_getpixel_ext_RELEASE(_x, _y)
{
    var ws = canvas.width / g_OriginalWidth;
    var hs = canvas.height / g_OriginalHeight;

    // Get the default view, or the standard view array, and translate the _x, _y accordingly
    var col = GetCanvasPixel(canvas, yyGetReal(_x) * ws, yyGetReal(_y) * hs);
	return col;
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_x3"></param>
///			 <param name="_y3"></param>
///			 <param name="_outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var draw_triangle = draw_triangle_RELEASE;
function draw_triangle_RELEASE(_x1, _y1, _x2, _y2, _x3, _y3, _outline) {

    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _x3 = yyGetReal(_x3);
    _y3 = yyGetReal(_y3);

    /*_x1 += 0.5;
    _y1 += 0.5;
    _x2 += 0.5;
    _y2 += 0.5;
    _x3 += 0.5;
    _y3 += 0.5;*/

    if (offsethack != 0.0)
    {
        _x1 += offsethack;
        _y1 += offsethack;
        _x2 += offsethack;
        _y2 += offsethack;
        _x3 += offsethack;
        _y3 += offsethack;
    }

	graphics.globalAlpha = g_GlobalAlpha;
	graphics.lineWidth = 1;
	if (yyGetBool(_outline))
	{
		graphics.strokeStyle = g_GlobalColour_HTML_RGBA;
		graphics._beginPath();
		graphics._moveTo(_x1, _y1);
		graphics._lineTo(_x2, _y2);
		graphics._lineTo(_x3, _y3);
		graphics._lineTo(_x1, _y1);
		graphics._stroke();
		graphics._closePath();
	} else
	{
		// HORRIBLE!!
		graphics.strokeStyle = g_GlobalColour_HTML_RGBA;
		graphics.lineJoin = "bevel";
		graphics.fillStyle = g_GlobalColour_HTML_RGBA;
		graphics._beginPath();
		graphics._moveTo(_x1, _y1);
		graphics._lineTo(_x2, _y2);
		graphics._lineTo(_x3, _y3);
		graphics._lineTo(_x1, _y1);
		graphics._fill();
		graphics._stroke();
		graphics._closePath();
		//graphics.mozImageSmoothingEnabled = true;
		graphics.lineJoin = "miter";
	}

}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_x3"></param>
///			<param name="_y3"></param>
///			<param name="_col1"></param>
///			<param name="_col2"></param>
///			<param name="_col3"></param>
///			<param name="_outline"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_triangle_color = draw_triangle_color_RELEASE;
var draw_triangle_colour = draw_triangle_color_RELEASE;
function draw_triangle_color_RELEASE(_x1, _y1, _x2, _y2, _x3, _y3, _col1, _col2, _col3, _outline) {
	var col1 = GetHTMLRGB(ConvertGMColour(_col1)|0xff000000);

	_x1 = yyGetReal(_x1);
	_y1 = yyGetReal(_y1);
	_x2 = yyGetReal(_x2);
	_y2 = yyGetReal(_y2);
	_col1 = yyGetInt32(_col1);
	_col2 = yyGetInt32(_col2);
	_col3 = yyGetInt32(_col3);
	_col4 = yyGetInt32(_col4);
	_outline = yyGetBool(_outline);

	/*_x1 += 0.5;
	_y1 += 0.5;
	_x2 += 0.5;
	_y2 += 0.5;
	_x3 += 0.5;
	_y3 += 0.5;*/

	if (offsethack != 0.0)
	{
	    _x1 += offsethack;
	    _y1 += offsethack;
	    _x2 += offsethack;
	    _y2 += offsethack;
	    _x3 += offsethack;
	    _y3 += offsethack;
	}

	graphics.globalAlpha = g_GlobalAlpha;
	graphics.lineWidth = 1;
	if (_outline)
	{
		graphics.strokeStyle = col1;
		graphics._beginPath();
		graphics._moveTo(_x1, _y1);
		graphics._lineTo(_x2, _y2);
		graphics._lineTo(_x3, _y3);
		graphics._lineTo(_x1, _y1);
		graphics._stroke();
		graphics._closePath();
	} else
	{
		// HORRIBLE!!
		graphics.strokeStyle = col1;
		graphics.lineJoin = "bevel";
		graphics.fillStyle = col1;
		graphics._beginPath();
		graphics._moveTo(_x1, _y1);
		graphics._lineTo(_x2, _y2);
		graphics._lineTo(_x3, _y3);
		graphics._lineTo(_x1, _y1);
		graphics._fill();
		graphics._stroke();
		graphics._closePath();
		//graphics.mozImageSmoothingEnabled = true;
		graphics.lineJoin = "miter";
	}
}

// #############################################################################################
/// Function:<summary>
///				Draws a healthbar at the location with the colors; amount between 0 and 100
///				direction:	0 = from left, 
///							1 = from right, 
///							2 = from top, 
///							3 = from bottom
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="amount"></param>
///			 <param name="backcol"></param>
///			 <param name="mincol"></param>
///			 <param name="midcol"></param>
///			 <param name="maxcol"></param>
///			 <param name="direction">direction: 0 = from left, 1 = from right, 2 = from top, 3 = from bottom</param>
///			 <param name="showback"></param>
///			 <param name="showborder"></param>
// #############################################################################################
var draw_healthbar_ex = draw_healthbar_ex_RELEASE;
function draw_healthbar_ex_RELEASE(_x1, _y1, _x2, _y2, _amount, _backcol, _mincol, _midcol, _maxcol, _direction, _showback, _showborder)
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _amount = yyGetReal(_amount);
    _backcol = yyGetInt32(_backcol);
    _mincol = yyGetInt32(_mincol);
    _midcol = yyGetInt32(_midcol);
    _maxcol = yyGetInt32(_maxcol);
    _direction = yyGetInt32(_direction);
    _showback = yyGetBool(_showback);
    _showborder = yyGetBool(_showborder);

    var xx1;
	var xx2;
	var yy1;
	var yy2;
	var col;

	// Draw background
	if (_showback)
	{
		draw_rectangle_color(_x1, _y1, _x2, _y2, _backcol, _backcol, _backcol, _backcol, false);
		if (_showborder)
		{
			draw_rectangle_color(_x1, _y1, _x2, _y2, clBlack, clBlack, clBlack, clBlack, true);
		}
	}

	// Computer bar
	if ( _amount < 0 ) {
	    _amount = 0;
	}
	if ( _amount > 100 ) {
	    _amount = 100;
	}
	var fr = _amount / 100;

	switch (_direction)
	{
		case 0:		xx1 = _x1;            
					yy1 = _y1;                  
					xx2 = _x1+fr*(_x2-_x1);  
					yy2 = _y2;
					break;

		case 1:		xx1 = _x2-fr*(_x2-_x1); 
					yy1 = _y1;
					xx2 = _x2;             
					yy2 = _y2; 
					break;

		case 2:		xx1 = _x1;
					yy1 = _y1;                 
					xx2 = _x2;
					yy2 = _y1+fr*(_y2-_y1); 
					break;

		case 3:		xx1 = _x1; 
					yy1 = _y2-fr*(_y2-_y1); 
					xx2 = _x2; 
					yy2 = _y2; 
					break;

		default:	xx1 = _x1; 
					yy1 = _y1; 
					xx2 = _x1+fr*(_x2-_x1); 
					yy2 = _y2;
					break;
	}

	if ( _amount > 50 )	
	{
		col = Color_MergeRGB(_midcol, _maxcol, (_amount - 50.0) / 50.0);
	}
	else {
		col = Color_MergeRGB(_mincol, _midcol, _amount / 50.0);
	}

	draw_rectangle_color(xx1, yy1, xx2, yy2, col, col, col, col, false);
	if ( _showborder )
	{
		draw_rectangle_color(xx1, yy1, xx2, yy2, clBlack, clBlack, clBlack, clBlack, true);
	}
}

function draw_healthbar(_x1, _y1, _x2, _y2, _amount, _backcol, _mincol, _maxcol, _direction, _showback, _showborder) {
	var col = merge_color( _mincol,_maxcol, 0.5);
	draw_healthbar_ex(_x1, _y1, _x2, _y2, _amount, _backcol, _mincol, col, _maxcol, _direction, _showback, _showborder);
}



// #############################################################################################
/// Function:<summary>
///             Sets the precision with which circles are drawn, that is, the number of segments 
///             they consist of. The precision must lie between 4 and 64 and must be dividable 
///             by 4. This is also used for drawing ellipses and rounded rectangles.
///
///             This is ignored.
///
///          </summary>
///
/// In:		 <param name="_precision"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function draw_set_circle_precision(_precision) 
{
    // function ignored on non-WebGL.
    DrawCirclePrecision( yyGetInt32(_precision) );
}
function draw_get_circle_precision() 
{
    return DrawGetCirclePrecision();
}


// #############################################################################################
/// Function:<summary>
///				Draws an arrow with a point of the indicated size
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="size"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var draw_arrow = draw_arrow_RELEASE;
function draw_arrow_RELEASE(x1, y1, x2, y2, size)
{
    x1 = yyGetReal(x1);
    y1 = yyGetReal(y1);
    x2 = yyGetReal(x2);
    y2 = yyGetReal(y2);
    size = yyGetReal(size);

	var dd = Math.sqrt( ((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)) );
	if (dd != 0) 
	{    
	    if (size > dd) {
	        size = dd;
	    }
	    var xx = size * (x2-x1)/dd;
	    var yy = size * (y2-y1)/dd;

	    draw_line(x1, y1, x2, y2);
	    draw_triangle(x2-xx-yy/3.0, y2-yy+xx/3.0, x2, y2, x2-xx+yy/3.0, y2-yy-xx/3.0, false);
	}
}

// #############################################################################################
/// Function:<summary>
///				Draws an ellipse with the given bounding box in the current color
///				outline indicates whether to only draw the outline
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function draw_ellipse(_x1, _y1, _x2, _y2, _outline) {
    draw_ellipse_color(_x1, _y1, _x2, _y2, g_GlobalColour_GM, g_GlobalColour_GM, _outline);
}


// #############################################################################################
/// Function:<summary>
///				Draws an ellipse with the given bounding box in the current color
///				outline indicates whether to only draw the outline
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var draw_ellipse_color = draw_ellipse_color_RELEASE;
var draw_ellipse_colour = draw_ellipse_color_RELEASE;
function draw_ellipse_color_RELEASE(x, y, x1, y1, _col1, _col2, outline)
{
    x = yyGetReal(x);
    y = yyGetReal(y);
    x1 = yyGetReal(x1);
    y1 = yyGetReal(y1);
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    outline = yyGetBool(outline);

    if (offsethack != 0.0)
    {
        x += offsethack;
        y += offsethack;
        x1 += offsethack;
        y1 += offsethack;        
    }

    var w = x1 - x;
    var h = y1 - y;

    var kappa = 0.5522848;
    var ox = (w / 2) * kappa; // control point offset horizontal
    var oy = (h / 2) * kappa; // control point offset vertical
    var xe = x + w;           // x-end
    var ye = y + h;           // y-end
    var xm = x + w / 2;       // x-middle
    var ym = y + h / 2;       // y-middle

    graphics.beginPath();
    graphics.moveTo(x, ym);
    graphics.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    graphics.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    graphics.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    graphics.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    graphics.closePath();
 
    var col1 = GetHTMLRGBA( ConvertGMColour(_col1), 1.0);
    var col2 = GetHTMLRGBA( ConvertGMColour(_col2), 1.0);
    
    if (w <= 0) w *= -1; 
    if (h <= 0) h *= -1;
    var gradient = graphics.createRadialGradient( xm,ym, 0, xm, ym, min(w/2,h/2) );
    gradient.addColorStop(0, col1);
    gradient.addColorStop(1, col2);
 
    graphics.globalAlpha = g_GlobalAlpha;
    if (outline) {   
    	graphics.lineWidth = 1;
        graphics.strokeStyle = gradient; 
        graphics.stroke();
    }
    else {
        graphics.fillStyle = gradient; 
        graphics.fill();
    }
}


// #############################################################################################
/// Function:<summary>
///          	Draws a circle at (x,y) with radius r. outline indicates whether only the 
///             outline must be drawn (true) or it should be filled (false).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_outline">true to draw an outline</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_circle_color = draw_circle_color_RELEASE;
var draw_circle_colour = draw_circle_color_RELEASE;
function draw_circle_color_RELEASE(_x, _y, _r, _col1, _col2, _outline)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _r = yyGetReal(_r);
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);
    _outline = yyGetBool(_outline);

    if (offsethack != 0.0)
    {
        _x += offsethack;
        _y += offsethack;        
    }

    graphics.globalAlpha = g_GlobalAlpha;

    var col1 = GetHTMLRGBA( ConvertGMColour(_col1), 1.0);
    var col2 = GetHTMLRGBA( ConvertGMColour(_col2), 1.0);
    var gradient = graphics.createRadialGradient( _x,_y, 0, _x, _y, _r );
    gradient.addColorStop(0, col1);
    gradient.addColorStop(1, col2);
 
    graphics._beginPath();
    if( _outline )
    {
     	graphics.lineWidth = 1;
        graphics.strokeStyle = gradient; //g_GlobalColour_HTML_RGBA; 
        graphics._arc(_x, _y, _r, 0, Math.PI*2, true); 
        graphics._stroke();
	} else
	{
        graphics.fillStyle = gradient; //g_GlobalColour_HTML_RGBA;
        graphics._arc(_x, _y, _r, 0, Math.PI*2, false); 
        graphics._fill();
	}
	graphics._closePath();
}

// #############################################################################################
/// Function:<summary>
///          	Draws a circle at (x,y) with radius r. outline indicates whether only the 
///             outline must be drawn (true) or it should be filled (false).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_r"></param>
///			<param name="_outline">true to draw an outline</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_circle(_x,_y,_r,_outline) {
	draw_circle_color(_x, _y, _r, g_GlobalColour_GM, g_GlobalColour_GM, _outline);
}


// #############################################################################################
/// Function:<summary>
///          	Plot a single point
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_point_color = draw_point_color_RELEASE;
var draw_point_colour = draw_point_color_RELEASE;
function draw_point_color_RELEASE(_x, _y, _col)
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);

    if (offsethack != 0.0)
    {
        _x += offsethack;
        _y += offsethack;        
    }

    var col1 = GetHTMLRGBA(ConvertGMColour(yyGetInt32(_col)), 1.0);

    graphics.globalAlpha = g_GlobalAlpha;
    graphics.fillStyle = col1;
    graphics._fillRect(_x,_y,1,1);
}




// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2) with width w.
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
var draw_line_width_color = draw_line_width_color_RELEASE;
var draw_line_width_colour = draw_line_width_color_RELEASE;
function draw_line_width_color_RELEASE(_x1, _y1, _x2, _y2, _w, _col1, _col2) 
{
    _x1 = yyGetReal(_x1);
    _y1 = yyGetReal(_y1);
    _x2 = yyGetReal(_x2);
    _y2 = yyGetReal(_y2);
    _w = yyGetReal(_w);
    _col1 = yyGetInt32(_col1);
    _col2 = yyGetInt32(_col2);

    if (offsethack != 0.0)
    {
        _x1 += offsethack;
        _y1 += offsethack;
        _x2 += offsethack;
        _y2 += offsethack;    
    }

    // Start from the top-left point.
	graphics.globalAlpha = g_GlobalAlpha;

    var col1 = GetHTMLRGBA( ConvertGMColour(_col1), 1.0);
    var col2 = GetHTMLRGBA( ConvertGMColour(_col2), 1.0);
    var gradient = graphics.createLinearGradient(_x1, _y1, _x2, _y2);
    gradient.addColorStop(0, col1);
    gradient.addColorStop(1, col2);
    
	graphics.strokeStyle = gradient; //g_GlobalColour_HTML_RGBA;

    graphics._beginPath();
    graphics._moveTo(_x1 + 0.5, _y1 + 0.5);
    graphics._lineTo(_x2 + 0.5, _y2 + 0.5);
    graphics.lineWidth = _w;
    graphics._stroke();
    graphics._closePath();
}


// #############################################################################################
/// Function:<summary>
///          	Draws a line from (x1,y1) to (x2,y2) with width w.
///          </summary>
///
/// In:		<param name="_x1"></param>
///			<param name="_y1"></param>
///			<param name="_x2"></param>
///			<param name="_y2"></param>
///			<param name="_w"></param>
///				
// #############################################################################################
function draw_line_color(_x1,_y1,_x2,_y2,_col1,_col2) 
{
    draw_line_width_color(_x1,_y1, _x2,_y2, 1, _col1,_col2);
}
var draw_line_colour = draw_line_color;


// #############################################################################################
/// Function:<summary>
///             Draws a button, up indicates whether up (1) or down (0).
///          </summary>
///
/// In:		 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_down"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function draw_button(_x1, _y1, _x2, _y2, _down)
{
    /*_x1+=1.5;
    _y1+=1.5;
    _x2-=0.5;
    _y2-=0.5;*/

    if (offsethack != 0.0)
    {
        _x1 += offsethack;
        _y1 += offsethack;
        _x2 += offsethack;
        _y2 += offsethack;     
    }

	if ( _down )
	{
	    draw_line_width_color(_x1,_y1,_x2,_y1,2, 0xffffff, 0xffffff );
	    draw_line_width_color(_x1,_y1,_x1,_y2,2, 0xffffff, 0xffffff );

	    draw_line_width_color(_x2,_y1,_x2,_y2,2, 0x404040, 0x404040 );
	    draw_line_width_color(_x2,_y2,_x1,_y2,2, 0x404040, 0x404040 );
	}
	else
	{
	    draw_line_width_color(_x1,_y1,_x2,_y1,2, 0x404040, 0x404040 );
	    draw_line_width_color(_x1,_y1,_x1,_y2,2, 0x404040, 0x404040 );

	    draw_line_width_color(_x2,_y1,_x2,_y2,2, 0xffffff, 0xffffff );
	    draw_line_width_color(_x2,_y2,_x1,_y2,2, 0xffffff, 0xffffff );
	}

	draw_rectangle_color(_x1,_y1, _x2,_y2, g_GlobalColour_GM, g_GlobalColour_GM, g_GlobalColour_GM, g_GlobalColour_GM, false);
}


// #############################################################################################
/// Function:<summary>
///				Draws an ellipse with the given bounding box with a gradient from the centre
///             of the ellipse to the max radius of the ellipse
///          </summary>
///
/// In:		 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="x2"></param>
///			 <param name="y2"></param>
///			 <param name="outline"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function draw_ellipse_gradient(x, y, x1, y1, col1, col2, outline) 
{
	draw_ellipse_color(x, y, x1, y1, col1, col2, outline);
}

// #############################################################################################
/// Function:<summary>
///          	Indicates what blend mode to use. The following values are possible: 
///				bm_normal, bm_add, bm_subtract, and bm_max. Don't forget to reset the mode to normal 
///				after use because otherwise also other sprites and even the backgrounds are drawn 
///				with the new blend mode.
///          </summary>
///
/// In:		<param name="mode"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_set_blend_mode(_blend) 
{
    switch (_blend)
	{
		case 1:	draw_set_blend_mode_ext(eBlend_SrcAlpha, eBlend_One); // add blend												
				break;

		case 2:	draw_set_blend_mode_ext(eBlend_SrcAlpha, eBlend_InvSrcColour); // color blend				
				break;

		case 3: draw_set_blend_mode_ext(eBlend_Zero, eBlend_InvSrcColour); // subtract blend
				break;

		default:draw_set_blend_mode_ext(eBlend_SrcAlpha, eBlend_InvSrcAlpha);
				break;
	}
}

// #############################################################################################
/// Function:<summary>
///          	Indicates what blend mode to use for both the source and destination color. 
///				The new color is some factor times the source and another factor times the destination. 
///				These factors are set with this function. To understand this, the source and destination 
///				both have a red, green, blue, and alpha component. So the source is (Rs, Gs, Bs, As) and 
///				the destination is (Rd, Gd, Bd, Ad). All are considered to lie between 0 and 1. 
///          </summary>
///
/// In:		<param name="src"></param>
///			<param name="dest"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_set_blend_mode_ext = draw_set_blend_mode_ext_html5;
function draw_set_blend_mode_ext_html5(src, dest) {
	ErrorFunction("Blend modes only available in WebGL mode.");
}

// #############################################################################################
/// Function:<summary>
///          	FLUSH textures (release them)
///          </summary>
// #############################################################################################
function draw_texture_flush() {

    if (g_webGL == null)
        return;             // WebGL only

    WebGL_DrawTextureFlush();
}

// #############################################################################################
/// Function:<summary>
///          	Enable/Disable the draw event.
///          </summary>
// #############################################################################################
function draw_enable_drawevent(_onoff) {
    Draw_Automatic = yyGetBool(_onoff);
}


// #############################################################################################
/// Function:<summary>
///          	Set the animation to use for an instance using skeletal animation
///          </summary>
// #############################################################################################
function skeleton_animation_set(_inst, _name, _loop = true) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
		skeletonAnim.SelectAnimation(yyGetString(_name), _loop);
		_inst.image_index = 0;
		skeletonAnim.SetImageIndex(0, 0);
    }    
}

// #############################################################################################
/// Function:<summary>
///          	Set the blend between two animations for an instance using skeletal animation
///          </summary>
// #############################################################################################
function skeleton_animation_mix(_inst, _anim_from, _anim_to, _duration) { 

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.SetAnimationMix(yyGetString(_anim_from), yyGetString(_anim_to), yyGetReal(_duration));
    }    
}

// #############################################################################################
/// Function:<summary>
///          	Set the animation on the given track
///          </summary>
// #############################################################################################
function skeleton_animation_set_ext(_inst, _anim, _track, _loop = true) { 

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {	
        _track = yyGetInt32(_track);
        skeletonAnim.SelectAnimationExt(yyGetString(_anim), _track, _loop);
        if (_track == 0)
        {
            _inst.image_index = 0;
            skeletonAnim.SetImageIndex(0, 0);
        }
	}
}

// #############################################################################################
/// Function:<summary>
///          	Get the animation on the given track
///          </summary>
// #############################################################################################
function skeleton_animation_get_ext(_inst, _track) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        return skeletonAnim.GetAnimation(yyGetInt32(_track));
	}
	return "";
}

// #############################################################################################
/// Function:<summary>
///          	Set an attachment for a slot of an instance's skeleton
///          </summary>
// #############################################################################################
function skeleton_attachment_set(_inst, _slot, _attachment) { 

    _slot = yyGetString(_slot);

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
		if (typeof(_attachment) == "string") {
			skeletonAnim.SetAttachment(_slot, _attachment);
		} // end if
		else {
            _attachment = yyGetInt32(_attachment);
		    if (sprite_exists(_attachment))
	        {
	            var pSpr = g_pSpriteManager.Get(_attachment);
	            if (skeletonAnim.FindAttachment( _slot, pSpr.pName) === undefined) {
		        	skeletonAnim.CreateAttachment(pSpr.pName, pSpr, 0, pSpr.xOrigin, pSpr.yOrigin, 1, 1, 0, undefined, 0xffffffff, 1.0, false);
		        } // end if
				skeletonAnim.SetAttachment(_slot, pSpr.pName);
		    }
		    else
		    {
		        skeletonAnim.SetAttachment(_slot, -1);
		    }
		} // end else
	} // end if
}

// #############################################################################################
/// Function:<summary>
///          	Get the attachment for a slot of an instance's skeleton
///          </summary>
// #############################################################################################
function skeleton_attachment_get(_inst, _slot) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        return skeletonAnim.GetAttachment(yyGetString(_slot));
	}
	return "";
}

// #############################################################################################
/// Function:<summary>
///          	Create a new attachment for the instance's skeleton based on an existing sprite
///          </summary>
// #############################################################################################
function skeleton_attachment_create(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot) {
    
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        _ind = yyGetInt32(_ind);

	    if (sprite_exists(_sprite) && (_ind >= 0))
        {
	        var pSpr = g_pSpriteManager.Get(_sprite);
	        if ((pSpr.SWFDictionaryItems != undefined) || (pSpr.m_skeletonSprite != undefined))
	        {
	            console.log("ERROR: Sprite '" + pSpr.pName + "' is not valid for use as an attachment (must be a bitmap)\n");
	            return -1.0;
	        }
	        skeletonAnim.CreateAttachment(yyGetString(_name), pSpr, _ind, yyGetReal(_xo), yyGetReal(_yo), yyGetReal(_xs), yyGetReal(_ys), yyGetReal(_rot), undefined, undefined, undefined, false);

	        return 1.0;
	    }
    }

    return -1.0;
}

function skeleton_attachment_create_colour(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        _ind = yyGetInt32(_ind);

        if (sprite_exists(_sprite) && (_ind >= 0))
        {
            var pSpr = g_pSpriteManager.Get(_sprite);
            if ((pSpr.SWFDictionaryItems != undefined) || (pSpr.m_skeletonSprite != undefined))
            {
                console.log("ERROR: Sprite '" + pSpr.pName + "' is not valid for use as an attachment (must be a bitmap)\n");
                return -1.0;
            }
            skeletonAnim.CreateAttachment(yyGetString(_name), pSpr, _ind, yyGetReal(_xo), yyGetReal(_yo), yyGetReal(_xs), yyGetReal(_ys), yyGetReal(_rot), undefined, yyGetInt32(_col), yyGetReal(_alpha), false);

            return 1.0;
        }
    }

    return -1.0;
}

function skeleton_attachment_create_color(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha)
{
    skeleton_attachment_create_colour(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha);
}

function skeleton_attachment_replace(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot) {
    
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        _ind = yyGetInt32(_ind);

	    if (sprite_exists(_sprite) && (_ind >= 0))
        {
	        var pSpr = g_pSpriteManager.Get(_sprite);
	        if ((pSpr.SWFDictionaryItems != undefined) || (pSpr.m_skeletonSprite != undefined))
	        {
	            console.log("ERROR: Sprite '" + pSpr.pName + "' is not valid for use as an attachment (must be a bitmap)\n");
	            return -1.0;
	        }
	        skeletonAnim.CreateAttachment(yyGetString(_name), pSpr, _ind, yyGetReal(_xo), yyGetReal(_yo), yyGetReal(_xs), yyGetReal(_ys), yyGetReal(_rot), undefined, undefined, undefined, true);

	        return 1.0;
	    }
    }

    return -1.0;
}

function skeleton_attachment_replace_colour(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        _ind = yyGetInt32(_ind);

        if (sprite_exists(_sprite) && (_ind >= 0))
        {
            var pSpr = g_pSpriteManager.Get(_sprite);
            if ((pSpr.SWFDictionaryItems != undefined) || (pSpr.m_skeletonSprite != undefined))
            {
                console.log("ERROR: Sprite '" + pSpr.pName + "' is not valid for use as an attachment (must be a bitmap)\n");
                return -1.0;
            }
            skeletonAnim.CreateAttachment(yyGetString(_name), pSpr, _ind, yyGetReal(_xo), yyGetReal(_yo), yyGetReal(_xs), yyGetReal(_ys), yyGetReal(_rot), undefined, yyGetInt32(_col), yyGetReal(_alpha), true);

            return 1.0;
        }
    }

    return -1.0;
}

function skeleton_attachment_destroy(_inst, _name)
{
	var name = yyGetString(_name);

	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		var foundAttachment = skeletonAnim.DestroyAttachment(name);
		if(!foundAttachment)
		{
			console.log("skeleton_attachment_destroy: Attempted to destroy non-existant attachment '" + name + "'");
		}
	}
}

function skeleton_attachment_exists(_inst, _name)
{
	var name = yyGetString(_name);

	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		var foundAttachment = (skeletonAnim.FindAttachment(null, name, true) !== undefined);
		return foundAttachment;
	}
}

function skeleton_attachment_replace_color(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha)
{
    skeleton_attachment_replace_colour(_inst, _name, _sprite, _ind, _xo, _yo, _xs, _ys, _rot, _col, _alpha);
}

function skeleton_slot_colour_set(_inst, _slot, _col, _alpha)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        _slot = yyGetString(_slot);
        skeletonAnim.SetSlotColour(_slot, yyGetInt32(_col));
        skeletonAnim.SetSlotAlpha(_slot, yyGetReal(_alpha));
    }
}

function skeleton_slot_color_set(_inst, _slot, _col, _alpha)
{
    skeleton_slot_colour_set(_inst, _slot, _col, _alpha);
}

function skeleton_slot_colour_get(_inst, _slot)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        return skeletonAnim.GetSlotColour(yyGetString(_slot));
    }

    return 0xffffffff;
}

function skeleton_slot_color_get(_inst, _slot)
{
    return skeleton_slot_colour_get(_inst, _slot);
}

function skeleton_slot_alpha_get(_inst, _slot)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        return skeletonAnim.GetSlotAlpha(yyGetString(_slot));
    }

    return 1.0;
}

// #############################################################################################
/// Function:<summary>
///          	Set the skin for an instance using skeletal animation
///          </summary>
// #############################################################################################
function skeleton_skin_set(_inst, _name) {
    
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{
		if(_name.__type == "[SkeletonSkin]")
		{
			skeletonAnim.SelectSkin(_name);
		}
		else{
			skeletonAnim.SelectSkin(yyGetString(_name));
		}
	}
}


// #############################################################################################
/// Function:<summary>
///          	Get the skin for an instance using skeletal animation
///          </summary>
// #############################################################################################
function skeleton_skin_get(_inst) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
		return skeletonAnim.GetSkin();
	}
	return "";
}

// #############################################################################################
/// Function:<summary>
///          	Get the skin for an instance using skeletal animation
///          </summary>
// #############################################################################################
function skeleton_skin_create(_inst, _name, _base) {
	var name = yyGetString(_name);
	
	if(!Array.isArray(_base))
	{
		yyError("skeleton_skin_create argument 2 incorrect type (expecting an Array)");
	}
	
	var baseNames = [];
	for(var i = 0; i < _base.length; ++i)
	{
		baseNames.push(yyGetString(_base[i]));
	}
	
	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		var newSkin = skeletonAnim.CreateSkinFromSkins(name, baseNames);
		return newSkin;
	}
}

// #############################################################################################
/// Function:<summary>
///          	Get the name of the animation in use
///          </summary>
// #############################################################################################
function skeleton_animation_get(_inst) {

    return skeleton_animation_get_ext(_inst, 0);
}

// #############################################################################################
/// Function:<summary>
///          	Get the duration of the named animation
///          </summary>
// #############################################################################################
function skeleton_animation_get_duration(_inst, _animation) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        return skeletonAnim.GetDuration(yyGetString(_animation));
	}
	return 0.0;
}

// #############################################################################################
/// Function:<summary>
///          	Get the duration of the named animation
///          </summary>
// #############################################################################################
function skeleton_animation_get_frames(_inst, _animation) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        return skeletonAnim.GetFrames(yyGetString(_animation));
	}
	return 0.0;
}

// #############################################################################################
/// Function:<summary>
///          	Get the current frame index of the animation in use
///          </summary>
// #############################################################################################
function skeleton_animation_get_frame(_inst, _track) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        return skeletonAnim.ImageIndex(yyGetInt32(_track));
	}

	return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Get the current frame index of the animation in use
///          </summary>
// #############################################################################################
function skeleton_animation_set_frame(_inst, _track, _index) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.SetImageIndex(yyGetInt32(_track), yyGetInt32(_index));
	}
}

function skeleton_animation_get_position(_inst, _track)
{
	var track = yyGetInt32(_track);

	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		var num_frames = skeletonAnim.FrameCount(undefined, track);
		var current_frame = skeletonAnim.ImageIndex(track);

		if(num_frames != 0)
		{
			var fractional_position = current_frame / num_frames;

			if (fractional_position < 0.0) fractional_position = 0.0;
			if (fractional_position > 1.0) fractional_position = 1.0;

			return fractional_position;
		}
	}

	return -1;
}

function skeleton_animation_set_position(_inst, _track, _position)
{
	var track = yyGetInt32(_track);
	var fractional_position = yyGetReal(_position);

	/* Wrap animation position */

	if (fractional_position >= 1.0 || fractional_position <= 1.0)
	{
		
		fractional_position -= Math.floor(fractional_position / 1.0);
	}

	if (fractional_position < 0.0)
	{
		fractional_position = 1.0 + fractional_position;
	}

	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		var num_frames = skeletonAnim.FrameCount(undefined, track);

		if (num_frames != 0)
		{
			var frame_idx = Math.floor(fractional_position * num_frames);

			/* Clamp in case of rounding errors. */
			if (frame_idx < 0) frame_idx = 0;
			if (frame_idx >= num_frames) frame_idx = num_frames - 1;

			skeletonAnim.SetImageIndex(track, frame_idx);
		}
	}
}

function skeleton_animation_get_event_frames(_inst, _anim, _event)
{
    var frames = [];

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        var eventframes = skeletonAnim.GetAnimationEventFrames(_anim, _event);
        if (eventframes == null)
        {
            frames.push(-1);
        }
        else
        {
            frames = eventframes;
        }
    }
    else
    {
        frames.push(-1);
    }

    return frames;
}

// #############################################################################################
/// Function:<summary>
///             Clear the animation at the given track
///          </summary>
// #############################################################################################
function skeleton_animation_clear(_inst, _track) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.ClearAnimation(yyGetInt32(_track));
	}	
}

// #############################################################################################
/// Function:<summary>
///             Return if the given animation track is looping.
///          </summary>
// #############################################################################################
function skeleton_animation_is_looping(_inst, _track)
{
	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		return skeletonAnim.Looping(yyGetInt32(_track));
	}

	return false;
}

// #############################################################################################
/// Function:<summary>
///             Return if the given animation track is finished.
///          </summary>
// #############################################################################################
function skeleton_animation_is_finished(_inst, _track)
{
	var skeletonAnim = _inst.SkeletonAnimation();
	if (skeletonAnim)
	{
		return skeletonAnim.Finished(yyGetInt32(_track));
	}

	return false;
}

// #############################################################################################
/// Function:<summary>
///          	Set whether to draw the collision prims for an instance using skeletal anims
///          </summary>
// #############################################################################################
function skeleton_collision_draw_set(_inst, _val) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.SetDrawCollision(yyGetReal(_val) > 0.5 ? true : false);
	}
}


// #############################################################################################
/// Function:<summary>
///          	Access the setup pose bone data
///          </summary>
// #############################################################################################
function skeleton_bone_data_get(_inst, _bone, _map) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        skeletonAnim.GetBoneData(yyGetString(_bone), yyGetInt32(_map));
	}
}

// #############################################################################################
/// Function:<summary>
///          	Alter the setup pose bone data
///          </summary>
// #############################################################################################
function skeleton_bone_data_set(_inst, _bone, _map) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        skeletonAnim.SetBoneData(yyGetString(_bone), yyGetInt32(_map));
	}
}

// #############################################################################################
/// Function:<summary>
///          	Access the current bone state
///          </summary>
// #############################################################################################
function skeleton_bone_state_get(_inst, _bone, _map) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.GetBoneState(_inst, yyGetString(_bone), yyGetInt32(_map));
	}
}

// #############################################################################################
/// Function:<summary>
///          	Alter the current bone state
///          </summary>
// #############################################################################################
function skeleton_bone_state_set(_inst, _bone, _map) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
	{		
        skeletonAnim.SetBoneState(_inst, yyGetString(_bone), yyGetInt32(_map));
	}
}

// #############################################################################################
/// Function:<summary>
///          	Draw a skeleton sprite
///          </summary>
// #############################################################################################
function draw_skeleton(_sprite, _animname, _skinname, _frame, _x, _y, _xscale, _yscale, _rot, _colour, _alpha) {
    
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite) {
	        pSpr.m_skeletonSprite.DrawFrame(yyGetString(_animname), yyGetString(_skinname), yyGetInt32(_frame), yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), yyGetReal(_rot), yyGetInt32(_colour), yyGetReal(_alpha));
        }
	}
}

// #############################################################################################
/// Function:<summary>
///          	Draw a skeleton sprite
///          </summary>
// #############################################################################################
function draw_skeleton_time(_sprite, _animname, _skinname, _time, _x, _y, _xscale, _yscale, _rot, _colour, _alpha) {
    
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite) {
	        pSpr.m_skeletonSprite.DrawTime(yyGetString(_animname), yyGetString(_skinname), yyGetReal(_time), yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), yyGetReal(_rot), yyGetInt32(_colour), yyGetReal(_alpha));
        }
	}
}

function draw_skeleton_instance() {
    ErrorFunction("draw_skeleton_instance()");
};

// #############################################################################################
/// Function:<summary>
///          	Draw a skeleton sprite's collision data
///          </summary>
// #############################################################################################
function draw_skeleton_collision(_sprite,_animname,_frame,_x,_y,_xscale,_yscale,_rot,_colour) {

    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite) {
	        pSpr.m_skeletonSprite.DrawCollision(yyGetString(_animname), yyGetInt32(_frame), yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), yyGetReal(_rot), yyGetInt32(_colour), pSpr);
        }
	}
}

function draw_enable_skeleton_blendmodes(_enable)
{
    g_SpinePerSlotBlendmodes = yyGetBool(_enable);
}

function draw_get_enable_skeleton_blendmodes()
{
    return g_SpinePerSlotBlendmodes;
}

// #############################################################################################
/// Function:<summary>
///             Dump out the list of animations belonging to a skeleton sprite
///          </summary>
// #############################################################################################
function skeleton_animation_list(_sprite, _list) {

    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite) {
	        pSpr.m_skeletonSprite.GetAnimationList(yyGetInt32(_list));
        }
	}
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of skins belonging to a skeleton sprite
///          </summary>
// #############################################################################################
function skeleton_skin_list(_sprite, _list) {

    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite) {
	        pSpr.m_skeletonSprite.GetSkinList(yyGetInt32(_list));
        }
	}
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of bones belonging to a skeleton sprite
///          </summary>
// #############################################################################################
function skeleton_bone_list(_sprite, _list)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
    if (pSpr != null && pSpr != undefined)
    {
        if (pSpr.m_skeletonSprite)
        {
            pSpr.m_skeletonSprite.GetBoneList(yyGetInt32(_list));
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of slots belonging to a skeleton sprite
///          </summary>
// #############################################################################################
function skeleton_slot_list(_sprite, _list)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
    if (pSpr != null && pSpr != undefined)
    {
        if (pSpr.m_skeletonSprite)
        {
            pSpr.m_skeletonSprite.GetSlotList(yyGetInt32(_list));
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out the slot data belonging to a skeleton sprite
///          </summary>
// #############################################################################################
function skeleton_slot_data(_sprite, _list) {

    var pSpr = g_pSpriteManager.Get(yyGetInt32(_sprite));
	if (pSpr != null && pSpr != undefined)
	{
	    if (pSpr.m_skeletonSprite)
	    {
	        pSpr.m_skeletonSprite.GetSlotData(yyGetInt32(_list));
	        return 1;
        }
	}

	return -1;
};

function skeleton_slot_data_instance(_inst, _list)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        skeletonAnim.GetSlotData(yyGetInt32(_list));
        return 1;
    } // end if

    return -1;
};

function skeleton_get_imageindex(_inst, _track) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        return skeletonAnim.ImageIndex(_track);
    }
    return 0.0;
};

function skeleton_get_minmax(_inst) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        var rect = new YYRECT(0, 0, 0, 0);
        if (skeletonAnim.GetBoundingBox(rect)) {
            var arr = [];
            arr.push(rect.left, rect.top, rect.right, rect.bottom);
            return arr;
        }
    }

    var arr = [];
    arr.push(0.0, 0.0, 0.0, 0.0);
    return arr;
};

function skeleton_get_num_bounds(_inst) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        return skeletonAnim.GetNumBoundingBoxAttachments();
    }
    return 0.0;
};

function skeleton_get_bounds(_inst, _index) {

    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim) {
        return skeletonAnim.GetBoundingBoxAttachment(yyGetInt32(_index));
    }

    var arr = [];
    arr.push(0, "");
    return arr;
};

function skeleton_find_slot(_inst, _x, _y, _list)
{
    var skeletonAnim = _inst.SkeletonAnimation();
    if (skeletonAnim)
    {
        var pSpr = g_pSpriteManager.Get(_inst.sprite_index);
        if (pSpr != null && pSpr != undefined)
        {
            if (pSpr.m_skeletonSprite)
            {
                pSpr.GetSkeletonSlotsAtPoint(_inst, yyGetReal(_x), yyGetReal(_y), yyGetInt32(_list));
            }
        }        
    }

}

// #############################################################################################
/// Function:<summary>
///          	Flag whether or not to draw SWFs with AA
///          </summary>
// #############################################################################################
function draw_enable_swf_aa(_flag) {

    GR_SWFAAEnabled = yyGetBool(_flag);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function draw_set_swf_aa_level(_aalevel) {

    GR_SWFAAScale = yyGetReal(_aalevel);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function draw_get_swf_aa_level() {

    return GR_SWFAAScale;
};


function SetViewExtents(xview, yview, wview, hview,  angle)
{
	
	if (Math.abs( angle) <0.001)
	{
        // No idea why we had all these offsets here
	    g_roomExtents.left = xview;//(xview - 0.999);
	    g_roomExtents.top = yview;//(yview - 0.999);
	    g_roomExtents.right = xview + wview;//(xview+wview + 0.999);
	    g_roomExtents.bottom = yview + hview;//(yview+hview + 0.999);
	}
	else
	{
		// We need a larger area here to make sure we draw enough - calculate extents from angle
		var rad = angle * (Math.PI/180.0);
		var s = Math.abs( sin(rad) );
		var c = Math.abs( cos(rad) );
		var ex = (c * wview) + (s * hview);
		var ey = (s * wview) + (c * hview);
		g_roomExtents.left = (xview + (wview - ex)/2);
		g_roomExtents.right = (xview + (wview + ex)/2);
		g_roomExtents.top = (yview + (hview - ey)/2);
		g_roomExtents.bottom = (yview + (hview + ey)/2);
		
	
	}
};

// Updates view extents from view and projection matrices. Optionally inverse
// view and inverse view-projection matrices can be provided to speed up
// computations if they are already available.
function UpdateViewExtents(_matView, _matProj, _matInvView, _matInvViewProj)
{
    var isOrthoProj = (_matProj.m[11] == 0);
    
    if (isOrthoProj)
    {
        if (_matInvView === undefined)
        {
            _matInvView = new Matrix();
            _matInvView.Invert(_matView);
        }
        
        if (_matInvViewProj === undefined)
        {
            var matViewProj = new Matrix();
            matViewProj.Multiply(_matView, _matProj);
            
            _matInvViewProj = new Matrix();
            _matInvViewProj.Invert(matViewProj);
        }
        
        var campos = new Vector3();
        campos.X = _matInvView.m[_41];
        campos.Y = _matInvView.m[_42];
        campos.Z = _matInvView.m[_43];

        // Experimental
        // Back transform clip space extents by the inverse of our view-proj matrix to get our room-space bounds
        var leftvec, rightvec, upvec, downvec;
        leftvec = _matInvViewProj.TransformVec3(new Vector3(-1.0, 0.0, 0.0));
        rightvec = _matInvViewProj.TransformVec3(new Vector3(1.0, 0.0, 0.0));
        upvec = _matInvViewProj.TransformVec3(new Vector3(0.0, 1.0, 0.0));
        downvec = _matInvViewProj.TransformVec3(new Vector3(0.0, -1.0, 0.0));

        var diffh = rightvec.Sub(leftvec);
        var diffv = upvec.Sub(downvec);

        g_worldw = diffh.Length();
        g_worldh = diffv.Length();

        g_worldx = campos.X - (g_worldw * 0.5);
        g_worldy = campos.Y - (g_worldh * 0.5);

        var normdiffv = diffv;
        normdiffv.Normalise();

        var angle = Math.acos(normdiffv.Y);
        if (normdiffv.X < 0.0) {
            angle = (2.0 * Math.PI) - angle;
        }

        var ViewAreaA = (angle / (2.0 * Math.PI)) * 360.0;

        /*g_worldx = campos.X - (this.m_viewWidth * 0.5);
		g_worldy = campos.Y - (this.m_viewHeight * 0.5);
		g_worldw = this.m_viewWidth;
		g_worldh = this.m_viewHeight;
		var ViewAreaA = this.m_viewAngle;*/

        //Needs implmenting
        SetViewExtents(g_worldx, g_worldy, g_worldw, g_worldh, ViewAreaA);
    }
    else
    {
        // Not ideal, but set the view area to the room extents if this is a perspective camera
        // We would need to change the way we do culling and work out extents for tile drawing etc across the codebase to handle this properly
        g_worldx = 0;
        g_worldy = 0;
        g_worldw = g_RunRoom != null ? g_RunRoom.GetWidth() : 1;
        g_worldh = g_RunRoom != null ? g_RunRoom.GetHeight() : 1;
        SetViewExtents(g_worldx, g_worldy, g_worldw, g_worldh, 0);
    }
}

function GetViewFrustum()
{
    if (g_ViewFrustumDirty)
    {
        var viewProjMat = new Matrix();
        viewProjMat.Multiply(g_Matrix[MATRIX_VIEW], g_Matrix[MATRIX_PROJECTION]);
        g_ViewFrustum.FromViewProjMat(viewProjMat);
        g_ViewFrustumDirty = false;
    }
    return g_ViewFrustum;
}

function DirtyRoomExtents()
{
    g_transRoomExtentsDirty = true;
};

function UpdateTransRoomExtents()
{	
	if (g_transRoomExtentsDirty)
	{
	    var worldMat = new Matrix();
	    worldMat.Invert( g_Matrix[MATRIX_WORLD]);
	    
	    
	    var posX = [];
	    var posY = [];
	    posX[0] = g_roomExtents.left;
		posX[1] = g_roomExtents.right;
		posX[2] = g_roomExtents.right;
		posX[3] = g_roomExtents.left;

		posY[0] = g_roomExtents.top;
		posY[1] = g_roomExtents.top;
		posY[2] = g_roomExtents.bottom;
		posY[3] = g_roomExtents.bottom;
		
		
		g_transRoomExtents.left = Number.MAX_SAFE_INTEGER;
		g_transRoomExtents.top = Number.MAX_SAFE_INTEGER;
		g_transRoomExtents.right = Number.MIN_SAFE_INTEGER;
		g_transRoomExtents.bottom = Number.MIN_SAFE_INTEGER;
		
		
		for(var i = 0; i < 4; i++)
		{
			var outX = ((posX[i] * worldMat.m[0]) + (posY[i] * worldMat.m[4]) + worldMat.m[12]);
			var outY = ((posX[i] * worldMat.m[1]) + (posY[i] * worldMat.m[5]) + worldMat.m[13]);

			g_transRoomExtents.left = yymin(g_transRoomExtents.left,outX);
			g_transRoomExtents.top = yymin(g_transRoomExtents.top, outY);
			g_transRoomExtents.right = yymax(g_transRoomExtents.right, outX);
			g_transRoomExtents.bottom = yymax(g_transRoomExtents.bottom, outY);
		}
		
		g_transRoomExtentsDirty = false;
	}
};


function view_get_camera(view) {
    return g_pBuiltIn.view_camera[yyGetInt32(view)];
};

function view_get_visible(view) {
    return g_pBuiltIn.view_visible[yyGetInt32(view)];
};

function view_get_xport(view) {
    return g_pBuiltIn.view_xport[yyGetInt32(view)];
};

function view_get_yport(view) {
    return g_pBuiltIn.view_yport[yyGetInt32(view)];
};

function view_get_wport(view) {
    return g_pBuiltIn.view_wport[yyGetInt32(view)];
};

function view_get_hport(view) {
    return g_pBuiltIn.view_hport[yyGetInt32(view)];
};

function view_get_surface_id(view) {
    return g_pBuiltIn.view_surface_id[yyGetInt32(view)];
};

function view_set_camera(view, camera) {
    g_pBuiltIn.view_camera[yyGetInt32(view)] = yyGetInt32(camera);
};

function view_set_visible(view, visible) {
    g_pBuiltIn.view_visible[yyGetInt32(view)] = yyGetInt32(visible);
};

function view_set_xport(view, xport) {
    g_pBuiltIn.view_xport[yyGetInt32(view)] = yyGetInt32(xport);
};

function view_set_yport(view, yport) {
    g_pBuiltIn.view_yport[yyGetInt32(view)] = yyGetInt32(yport);
};

function view_set_wport(view, wport) {
    g_pBuiltIn.view_wport[yyGetInt32(view)] = yyGetInt32(wport);
};

function view_set_hport(view, hport) {
    g_pBuiltIn.view_hport[yyGetInt32(view)] = yyGetInt32(hport);
};

function view_set_surface_id(view, surface_id) {
    g_pBuiltIn.view_surface_id[yyGetInt32(view)] = yyGetInt32(surface_id);
};

// Stubs
function display_get_windows_vertex_buffer_method() {
    return 0;
};

function display_get_windows_alternate_sync() {
    return 0;
};

function display_set_windows_vertex_buffer_method() {

};

function display_set_windows_alternate_sync() {

};
function display_set_ui_visibility() {

};

function display_set_sleep_margin() {

}
function display_get_sleep_margin() {
    return 0;
}
