// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			Function_Font.js
// Created:			01/08/2011
// Author:			Mike
// Project:			HTML5
// Description:		Code for rendering and processing fonts.
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 01/08/2011		V1.1		MJD		Split off from graphics code into it's own set.
//
// **********************************************************************************************************************

function draw_set_halign( _align )
{
    g_pFontManager.halign = yyGetInt32(_align);
}
function draw_get_halign()
{
    return g_pFontManager.halign;
}

function draw_set_valign( _align )
{
    g_pFontManager.valign = yyGetInt32(_align);
}
function draw_get_valign()
{
    return g_pFontManager.valign;
}

function draw_set_font( _font )
{
    g_pFontManager.fontid = yyGetInt32(_font);
}
function draw_get_font()
{
    return g_pFontManager.fontid;
}


// #############################################################################################
/// Function:<summary>
///          	Draws the string at position (x,y), using the drawing color and alpha. 
///				A # symbol or carriage return chr(13) or linefeed chr(10) are interpreted as newline 
///				characters. In this way you can draw multi-line texts. (Use \# to get the # symbol itself.)
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_text(_x, _y, _text) {
    var c = (g_GlobalColour&0xffffff) | (((g_GlobalAlpha*255.0)<<24)&0xff000000);
    g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), -1, -1, 0, 1, 1, c,c,c,c);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the string at position (x,y) like above. The four colors specify the colors 
///				of the top-left, top-right, bottom-right, and bottom-left corner of the text. 
///				alpha is the alpha transparency to be used (0-1).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_text_colour = draw_text_color;
function draw_text_color(_x, _y, _text, _c1, _c2, _c3, _c4, _alpha)
{
    if (!g_webGL) WarningFunction("draw_text_color() only uses the 1st colour");
	var oldalpha = g_GlobalAlpha;
	var oldcol = g_GlobalColour_GM;	
	//g_GlobalAlpha = _alpha;	
    //draw_set_color(_c1);

	
	if (_alpha > 1.0)
	    _alpha = 1.0;
	else if (_alpha < 0)
	    _alpha = 0.0;

	var a = ((yyGetReal(_alpha) * 255) << 24)&0xff000000;
	_c1 = ConvertGMColour(yyGetInt32(_c1) & 0xffffff) | a;
	_c2 = ConvertGMColour(yyGetInt32(_c2) & 0xffffff) | a;
	_c3 = ConvertGMColour(yyGetInt32(_c3) & 0xffffff) | a;
	_c4 = ConvertGMColour(yyGetInt32(_c4) & 0xffffff) | a;

	g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), -1, -1, 0, 1, 1, _c1, _c2, _c3, _c4);
	
	g_GlobalAlpha = oldalpha;
	draw_set_color(oldcol);		
}

// #############################################################################################
/// Function:<summary>
///          	Draws the string at position (x,y) like above. The four colors specify the colors 
///				of the top-left, top-right, bottom-right, and bottom-left corner of the text. 
///				alpha is the alpha transparency to be used (0-1).
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_text_ext_colour = draw_text_ext_color;
function draw_text_ext_color(_x, _y, _text, _sep, _w, _c1, _c2, _c3, _c4, _alpha)
{
    if (!g_webGL) WarningFunction("draw_text_ext_color() only uses the 1st colour");
	var oldalpha = g_GlobalAlpha;
	var oldcol = g_GlobalColour_GM;
	//g_GlobalAlpha = _alpha;
    //draw_set_color(_c1);

	if (_alpha > 1.0)
	    _alpha = 1.0;
	else if (_alpha < 0)
	    _alpha = 0.0;

	var a = (yyGetReal(_alpha) * 255)<<24;
	_c1 = ConvertGMColour(yyGetInt32(_c1) & 0xffffff) | a;
	_c2 = ConvertGMColour(yyGetInt32(_c2) & 0xffffff) | a;
	_c3 = ConvertGMColour(yyGetInt32(_c3) & 0xffffff) | a;
	_c4 = ConvertGMColour(yyGetInt32(_c4) & 0xffffff) | a;

	g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_sep), yyGetInt32(_w), 0, 1, 1, _c1, _c2, _c3, _c4);

    g_GlobalAlpha = oldalpha;
	draw_set_color(oldcol);	
}




// #############################################################################################
/// Function:<summary>
///          	Similar to the previous routine but you can specify two more things. 
///				First of all, sep indicates the separation distance between the lines of text in a 
///				multiline text. Use -1 to get the default distance. Use w to indicate the width of 
///				the text in pixels. Lines that are longer than this width are split- up at spaces 
///				or - signs. Use -1 to not split up lines.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_sep"></param>
///			<param name="_w"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_text_ext(_x, _y, _text, _sep, _w) {
    var c = (g_GlobalColour&0xffffff) | (((g_GlobalAlpha*255.0)<<24)&0xff000000);
    g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_sep), yyGetInt32(_w), 0, 1, 1, c, c, c, c);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the string at position (x,y) in the same way as above, but scale it horizontally 
///				and vertically with the indicated factors and rotate it counter-clockwise over angle degrees.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_text_transformed(_x, _y, _text, _xscale, _yscale, _angle) {
    var c = (g_GlobalColour & 0xffffff) | (((g_GlobalAlpha * 255.0) << 24) & 0xff000000);
    g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), -1, -1, yyGetReal(_angle), yyGetReal(_xscale), yyGetReal(_yscale), c, c, c, c);
}

// #############################################################################################
/// Function:<summary>
///          	Combines the function draw_text_ext and draw_text_transformed. It makes it possible 
///				to draw a multi-line text rotated and scaled.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_sep"></param>
///			<param name="_w"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_text_ext_transformed(_x, _y, _text, _sep, _w, _xscale, _yscale, _angle) {
    var c = (g_GlobalColour & 0xffffff) | (((g_GlobalAlpha * 255.0) << 24) & 0xff000000);
    g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_sep), yyGetInt32(_w), yyGetReal(_angle), yyGetReal(_xscale), yyGetReal(_yscale), c, c, c, c);
}


// #############################################################################################
/// Function:<summary>
///          	Similar to draw_text_ext_transformed() but with colored vertices.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_sep"></param>
///			<param name="_w"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_text_ext_transformed_colour = draw_text_ext_transformed_color;
function draw_text_ext_transformed_color(_x, _y, _text, _sep, _w, _xscale, _yscale, _angle, _c1, _c2, _c3, _c4, _alpha) {
    if (!g_webGL) WarningFunction("draw_text_ext_transformed_color() only uses the 1st colour");
    
	var oldalpha = g_GlobalAlpha;
	var oldcol = g_GlobalColour_GM;

	var a = ((yyGetReal(_alpha) * 255) << 24) & 0xff000000;
	_c1 = ConvertGMColour(yyGetInt32(_c1)) | a;
	_c2 = ConvertGMColour(yyGetInt32(_c2)) | a;
	_c3 = ConvertGMColour(yyGetInt32(_c3)) | a;
	_c4 = ConvertGMColour(yyGetInt32(_c4)) | a;
	g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_sep),  yyGetInt32(_w), yyGetReal(_angle), yyGetReal(_xscale), yyGetReal(_yscale), _c1, _c2, _c3, _c4);

    g_GlobalAlpha = oldalpha;
    draw_set_color(oldcol);	
}


// #############################################################################################
/// Function:<summary>
///          	Similar to draw_text_transformed() but with colored vertices.
///          </summary>
///
/// In:		<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_text"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_text_transformed_colour = draw_text_transformed_color;
function draw_text_transformed_color(_x, _y, _text, _xscale, _yscale, _angle, _c1, _c2, _c3, _c4, _alpha) {
    if (!g_webGL) WarningFunction("draw_text_transformed_color() only uses the 1st colour");
    
	var oldalpha = g_GlobalAlpha;
	var oldcol = g_GlobalColour_GM;
    
	var a = ((yyGetReal(_alpha) * 255) << 24) & 0xff000000;
	_c1 = ConvertGMColour(yyGetInt32(_c1)) | a;
	_c2 = ConvertGMColour(yyGetInt32(_c2)) | a;
	_c3 = ConvertGMColour(yyGetInt32(_c3)) | a;
	_c4 = ConvertGMColour(yyGetInt32(_c4)) | a;
    g_pFontManager.GR_Text_Draw(yyGetString(_text), yyGetReal(_x), yyGetReal(_y), -1, -1, yyGetReal(_angle), yyGetReal(_xscale), yyGetReal(_yscale), _c1,_c2,_c3,_c4);
	
	g_GlobalAlpha = oldalpha;
	draw_set_color(oldcol);	
}



// #############################################################################################
/// Function:<summary>
///          	Height of the string in the current font as it would be drawn using the draw_text() function.
///          </summary>
///
/// In:		<param name="_text"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_height(_text) {
    _text = yyGetString(_text);

    g_pFontManager.SetFont();

    if (!g_pFontManager.thefont )
    	return 1;

    var lines = g_pFontManager.Split_TextBlock(_text, -1, g_pFontManager.thefont);
    if (lines == null) return g_pFontManager.thefont.TextHeight(_text);
    return g_pFontManager.thefont.TextHeight(_text) * lines.length;
}
// #############################################################################################
/// Function:<summary>
///				Width of the string in the current font as it would be drawn using the draw_text() 
///				function. Can be used for precisely positioning graphics.
///          </summary>
///
/// In:		<param name="_text"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function string_width(_text) {
	g_pFontManager.SetFont();
	return g_pFontManager.thefont ? g_pFontManager.thefont.TextWidth(yyGetString(_text)) : 1;
}


// #############################################################################################
/// Function:<summary>
///          	Width of the string in the current font as it would be drawn using the draw_text_ext() 
///				function. Can be used for precisely positioning graphics.
///          </summary>
///
/// In:		<param name="_string"></param>
///			<param name="_sep"></param>
///			<param name="_w"></param>
/// Out:	<returns>
///				The WIDTH in pixels that the string takes up.
///			</returns>
// #############################################################################################
function string_width_ext(_string, _sep, _w) {
    g_pFontManager.SetFont();

    if ( !g_pFontManager.thefont )
    	return 1;

    g_pFontManager.GR_Text_Sizes(yyGetString(_string), 0, 0, yyGetInt32(_sep), yyGetInt32(_w), 0);
	return g_ActualTextWidth;
}

// #############################################################################################
/// Function:<summary>
///          	Height of the string in the current font as it would be drawn using the 
///				draw_text_ext() function.
///          </summary>
///
/// In:		<param name="_string"></param>
///			<param name="_sep"></param>
///			<param name="_w"></param>
/// Out:	<returns>
///				The WIDTH in pixels that the string takes up.
///			</returns>
// #############################################################################################
function string_height_ext(_string, _sep, _w) {
    g_pFontManager.SetFont();

    if ( !g_pFontManager.thefont )
    	return 1;

    g_pFontManager.GR_Text_Sizes(yyGetString(_string), 0, 0, yyGetInt32(_sep), yyGetInt32(_w), 0);
	return g_ActualTextHeight;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether a font with the given index exists.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_exists(_id) {
    if (g_pFontManager.Get(yyGetInt32(_id))) return true; else return false;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the font with the given index is bold.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_bold(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if(!pFont) return false;

	return pFont.bold;
}

// #############################################################################################
/// Function:<summary>
///          	 Returns the fontname of the font with the given index.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_fontname(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if (!pFont) return "";
	return pFont.pFontName;
}
// #############################################################################################
/// Function:<summary>
///          	 Returns the name of the font with the given index.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				The font resouce name
///			</returns>
// #############################################################################################
function font_get_name(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
    if (!pFont) return "";
    return pFont.pName;
}
var font_name = font_get_name;

// #############################################################################################
/// Function:<summary>
///          	 Returns whether the font with the given index is italic.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_italic(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if (!pFont) return false;

	return pFont.italic;
}

// #############################################################################################
/// Function:<summary>
///          	 Returns the index of the first character in the font with the given index.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_first(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if (!pFont) return 0;

	return pFont.first;
}

// #############################################################################################
/// Function:<summary>
///          	 Returns the index of the last character in the font with the given index.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_last(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if (!pFont) return 255;

	return pFont.last;
}


// #############################################################################################
/// Function:<summary>
///          	 Returns the size of the font with the given index.
///          </summary>
///
/// In:		<param name="_id">Font ID</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_size(_id) {
    var pFont = g_pFontManager.Get(yyGetInt32(_id));
	if (!pFont) return 0;

	return pFont.size;
}


// #############################################################################################
/// Function:<summary>
///          	Adds a new font and returns its index, indicating the name, size, whether it is 
///				bold or italic, and the first and last character that must be created.
///          </summary>
///
/// In:		<param name="name"></param>
///			<param name="size"></param>
///			<param name="bold"></param>
///			<param name="italic"></param>
///			<param name="first"></param>
///			<param name="last"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function sys_font_add(_name, _size, _bold, _italic, _first, _last, _doadd) {

	var pFont = new yyFont();
	pFont.growth = 0.5;
	pFont.runtime_created = true;
	pFont.pName = "fnt_" + _name;
	pFont.pFontName = _name;
	pFont.size = _size;
	pFont.bold = _bold;
	pFont.italic = _italic;
	pFont.first = _first;
	pFont.last = _last;
    pFont.loaded = false;

    // if the _name includes a ttf then go for it
    if (_name.toLowerCase().lastIndexOf( ".ttf" ) != -1) {
        pFont.ttfFont = new Font();
        pFont.ttfFont.onload = function () {
            pFont.loaded = true;
        }; // end onload
        pFont.ttfFont.onerror = function (err) {
            alert(err);
        };
        pFont.ttfFont.src = set_load_location(null,null,g_RootDir + _name);
        pFont.fontstyle = _size + "px " + pFont.ttfFont.fontFamily + " ";
	} // end if
	else {
	    pFont.fontstyle = _size + "px " + _name + " ";
	    pFont.loaded = true;
	} // end else
	
	if (_bold) pFont.fontstyle = pFont.fontstyle + "bold ";
	if (_italic) pFont.fontstyle = pFont.fontstyle + "Italic ";
	if( _doadd ){
	    return g_pFontManager.AddFont(pFont);
	}else{
	    return pFont;
	}
}


function font_delete(id)
{
    id = yyGetInt32(id);
    if(g_pFontManager.Fonts[id]!=undefined)
    {
        g_pFontManager.Fonts[id].ttfFont = undefined;
        g_pFontManager.Fonts[id]=undefined;
    }

}

function font_enable_sdf(id,enable)
{
	// SDF rendering can't be dynamically toggled for fonts on HTML5
	console.log("font_enable_sdf() - SDF font rendering can't be dynamically toggled for fonts on HTML5");
}

function font_get_sdf_enabled(id)
{
	if (g_webGL)
	{
		id = yyGetInt32(id);
		if(g_pFontManager.Fonts[id]!=undefined)
		{
			var font = g_pFontManager.Fonts[id];
			return font.sdf;
		}		
	}
	return false;
}

function font_sdf_spread(id,enable)
{
	// SDF spread value is fixed for fonts on HTML5
	console.log("font_enable_sdf() - SDF spread value is fixed for fonts on HTML5");
}

function font_get_sdf_spread(id)
{
	if (g_webGL)
	{
		id = yyGetInt32(id);
		if(g_pFontManager.Fonts[id]!=undefined)
		{
			var font = g_pFontManager.Fonts[id];
			if (font.sdf)
			{
				return font.sdfSpread;
			}			
		}		
	}
	return 0;
}

function font_enable_effects(id,enable,params)
{
	if (g_webGL)
	{
		id = yyGetInt32(id);
		if(g_pFontManager.Fonts[id]!=undefined)
		{
			var font = g_pFontManager.Fonts[id];
			font.effect_params.enabled = yyGetBool(enable);

			font.SetEffectParams(params);			
		}		
	}	
}

// #############################################################################################
/// Function:<summary>
///			</returns>
// #############################################################################################
function font_add(_name, _size, _bold, _italic, _first, _last) {
    return sys_font_add(yyGetString(_name), yyGetInt32(_size), yyGetBool(_bold), yyGetBool(_italic), yyGetInt32(_first), yyGetInt32(_last), true);
}

// #############################################################################################
/// Function:<summary>
///          	Adds a new font and returns its index. The font is created from a sprite. 
///				The sprite should contain a subimage for each character. 
///				first indicate the index of the first character in the sprite. 
///				For example, use ord('0') if your sprite only contains the digits. 
///				prop indicates whether the font is proportional.
///				In a proportional font, for each character the width of the bounding box is used as 
///				the character width. 
///				Finally, sep indicates the amount of white space that must separate the characters horizontally. 
//				A typical value would lie between 2 and 8 depending on the font size.
///          </summary>
///
/// In:		<param name="_spr"></param>
///			<param name="_first">first indicate the index of the first character in the sprite.  (i.e. ord('0') )</param>
///			<param name="_prop">prop indicates whether the font is proportional.</param>
///			<param name="_sep">sep indicates the amount of white space that must separate the characters horizontally.</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_add_sprite(_spr, _first, _prop, _sep) {

	var pFont = new yyFont();
	pFont.CreateFromSprite(yyGetInt32(_spr), yyGetInt32(_first), yyGetBool(_prop), yyGetInt32(_sep), null);	
	return g_pFontManager.AddFont(pFont);
}

// #############################################################################################
/// Function:<summary>
///          	As per font_add_sprite() except we now have a string mapping that determines
///             the ordering of the images in the sprite font
///          </summary>
// #############################################################################################
function font_add_sprite_ext(_spr, _string_map, _prop, _sep) {

    _string_map = yyGetString(_string_map);

    var pFont = new yyFont();
    pFont.CreateFromSprite(yyGetInt32(_spr), _string_map.charCodeAt(0), yyGetBool(_prop), yyGetInt32(_sep), _string_map);	    
    return g_pFontManager.AddFont(pFont);
}

// #############################################################################################
/// Function:<summary>
///          	Adds a new font and returns its index. The font is created from a sprite. 
///				The sprite should contain a subimage for each character. 
///				first indicate the index of the first character in the sprite. 
///				For example, use ord('0') if your sprite only contains the digits. 
///				prop indicates whether the font is proportional.
///				In a proportional font, for each character the width of the bounding box is used as 
///				the character width. 
///				Finally, sep indicates the amount of white space that must separate the characters horizontally. 
//				A typical value would lie between 2 and 8 depending on the font size.
///          </summary>
///
/// In:		<param name="_id">Font to replace</param>
///			<param name="_spr"></param>
///			<param name="_first">first indicate the index of the first character in the sprite.  (i.e. ord('0') )</param>
///			<param name="_prop">prop indicates whether the font is proportional.</param>
///			<param name="_sep">sep indicates the amount of white space that must separate the characters horizontally.</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_replace_sprite(_id, _spr, _first, _prop, _sep) {

    _id = yyGetInt32(_id);
    
	var pFont = g_pFontManager.Get(_id);
	pFont.CreateFromSprite(yyGetInt32(_spr), yyGetInt32(_first), yyGetBool(_prop), yyGetInt32(_sep), null);		
	return _id;                                            
};

function font_replace_sprite_ext(_id, _spr, _string_map, _prop, _sep) {

    _id = yyGetInt32(_id);
    _string_map = yyGetString(_string_map);

	var pFont = g_pFontManager.Get(_id);
	pFont.CreateFromSprite(yyGetInt32(_spr), _string_map.charCodeAt(0), yyGetBool(_prop), yyGetInt32(_sep), _string_map);	 
	return _id;                                            
};

// #############################################################################################
/// Function:<summary>
///          	Set the sprite cache 
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_max"></param>
///				
// #############################################################################################
function font_set_cache_size(_ind, _max) 
{
    _ind = yyGetInt32(_ind);
    _max = yyGetInt32(_max);

	var pFont = g_pFontManager.Get(_ind);
	if( !pFont )
	{
		yyError("Trying to adjust the cache on a non-existant font (" + string(_ind) + ")");
		return false;
	}
	if( pFont.pSprites )
	{
		yyError("Trying to adjust the cache on a SPRITE font (" + string(_ind) + ")");
		return false;
	}

	var ppTPE = pFont.TPEntry;
	if (ppTPE.maxcache > _max)
	{
		ppTPE.cache = [];
		ppTPE.count = 0;
	}
	ppTPE.maxcache = _max;
}



// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function font_get_texture(_ind) 
{
    _ind = yyGetInt32(_ind);

    var pFont = g_pFontManager.Get(_ind);
    if (!pFont) {
        yyError("Trying to adjust the cache on a non-existant font (" + string(_ind) + ")");
        return false;
    }
    if (pFont.pSprites) {
        yyError("Trying to adjust the cache on a SPRITE font (" + string(_ind) + ")");
        return false;
    }

    var pTPE = pFont.TPEntry;
    if (pTPE) {
        return (
			{
				WebGLTexture: pTPE.texture,
				TPE: pTPE,
				toString: () => {
					return "Texture:" + pTPE.texture.URL;
				}
			}
		);
    }
    return null;
}



// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function font_get_uvs(_ind)
{
    _ind = yyGetInt32(_ind);

    var pFont = g_pFontManager.Get(_ind);
    if (!pFont) {
        yyError("Trying to adjust the uvs on a non-existent font (" + string(_ind) + ")");
        return null;
    }

    var pTPE = pFont.TPEntry;
	    
	var texture = pTPE.texture;
	
	var oneTexelW = 1.0 / texture.width;
	var oneTexelH = 1.0 / texture.height;
	
	var arrayData = [];
	arrayData.push(pTPE.x*oneTexelW, pTPE.y*oneTexelH, (pTPE.x+pTPE.CropWidth)*oneTexelW, (pTPE.y+pTPE.CropHeight)*oneTexelH);
	
	return arrayData;    
}

function font_get_info( _ind )
{
	_ind = yyGetInt32(_ind);
    var pFont = g_pFontManager.Get(_ind);
    if (!pFont) {
        return undefined;
    }

    var pTPE = pFont.TPEntry;
    var xpos = pTPE != null ? pTPE.x : 0;
    var ypos = pTPE != null ? pTPE.y : 0;
    ret = new GMLObject();
	variable_struct_set(ret, "ascenderOffset", pFont.ascenderOffset); //ret.gmlascenderOffset = pFont.ascenderOffset;
	variable_struct_set(ret, "ascender", pFont.ascender); //ret.gmlascender = pFont.ascender;
	variable_struct_set(ret, "sdfSpread", pFont.sdfSpread); //ret.gmlsdfSpread = pFont.sdfSpread;
	variable_struct_set(ret, "sdfEnabled", pFont.sdf); 	
	variable_struct_set(ret, "freetype", false); // we don't support freetype fonts on HTML5 but adding this so it has the same fields as the C++ runner	
    variable_struct_set(ret, "size", pFont.size); //ret.gmlsize = pFont.size;
    variable_struct_set(ret, "spriteIndex", pFont.spriteIndex); //ret.gmlspriteIndex = pFont.spriteIndex;
    variable_struct_set(ret, "texture", pTPE != null ? pTPE.tp : -1); //ret.gmltexture = pTPE != null ? pTPE.tp : -1;
    variable_struct_set(ret, "name", pFont.pName); //ret.gmlname = pFont.pName;
    variable_struct_set(ret, "bold", pFont.bold); //ret.gmlbold = pFont.bold;
    variable_struct_set(ret, "italic", pFont.italic); //ret.gmlitalic = pFont.italic;	

	variable_struct_set(ret, "effectsEnabled", pFont.effect_params.enabled);
	variable_struct_set(ret, "effectParams", pFont.GetEffectParams());

    variable_struct_set(ret, "glyphs", new GMLObject()); //ret.gmlglyphs = new GMLObject();
    var glyphs = variable_struct_get(ret, "glyphs");

    if (pFont.spriteIndex != -1) {
    	for( var g in pFont.SpriteMapDictionary) {
	    	if (pFont.SpriteMapDictionary.hasOwnProperty(g)) {
		    	var ge = new GMLObject();
		    	var gl = pFont.SpriteMapDictionary[g];
		    	var gNumber = parseInt(g);
				var char = String.fromCharCode(gNumber);

				variable_struct_set(ge, "char", gl);

				variable_struct_set(glyphs, char, ge);
		    } // end if
    	} // end for
    } // end if
    else {
	    for( var g in pFont.glyphs) {
	    	if (pFont.glyphs.hasOwnProperty(g)) {
		    	var ge = new GMLObject();
		    	var gl = pFont.glyphs[g];
		    	var gNumber = parseInt(g);
				var char = String.fromCharCode(gNumber);

		    	variable_struct_set(ge, "char", gNumber); //ge.gmlchar = gNumber;
		    	variable_struct_set(ge, "x", gl.x); //ge.gmlx = gl.x;
		    	variable_struct_set(ge, "y", gl.y); //ge.gmly = gl.y;
		    	variable_struct_set(ge, "w", gl.w); //ge.gmlw = gl.w;
		    	variable_struct_set(ge, "h", gl.h); //ge.gmlh = gl.h;
		    	variable_struct_set(ge, "shift", gl.shift); //ge.gmlshift = gl.shift;
		    	variable_struct_set(ge, "offset", gl.offset); //ge.gmloffset = gl.offset;
		    	if (gl.kerning != undefined) {
			    	var kerning = [];
			    	for( var k=0; k<gl.kerning.length ; ++k) {
			    		kerning.push( gl.kerning[k] );
			    	} // end for
					variable_struct_set(ge, "kerning", kerning);
		    	} // end if

				variable_struct_set(glyphs, char, ge);
	    	} // end if
	    } // end for
	} // end else



    return ret;
}


function font_add_enable_aa() {
}

function font_add_get_enable_aa()
{
    return false;
}