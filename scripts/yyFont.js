// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyFont.js
// Created:         24/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 24/02/2011		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Initialise a Font from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
// #############################################################################################
/** @constructor */
function    yyFont( )
{
    this.__type = "[Font]";
    this.runtime_created = false;
	this.spritefont = false;

	this.pName = "";
	this.pFontName = "";
    this.size = 12;
    this.ascenderOffset = 0;
	this.ascender = 0;
    this.bold = false;
    this.italic = false;
    this.first = 32;			// FIRST chartacter we support
    this.last =  127;			// LAST character we support
    this.fontstyle = "";		// used in "web fonts" to hold the font style
    this.prop = false; 			// used in a sprite font to indicate proportional.
    this.m_sep = 0;
    this.stringMap = null;
    this.SpriteMapDictionary = null;

    this.antialias = 0;
    this.charset = 0;       
    this.scalex = 1;
    this.scaley = 1;
    
    this.growth = 0.0;          // As per revision 28698

    this.glyphs = null;
    this.TPEntry = null;
    this.pSprites = null;
    this.spriteIndex = -1;
	this.max_glyph_height = 0;
    
}

// #############################################################################################
/// Function: <summary>
///           	Create a font from storage
///           </summary>
// #############################################################################################
yyFont.prototype.CreateFromStorage = function (_pStorage) {

    this.spriteIndex = -1;
    this.SpriteMapDictionary = null;
	this.pName = _pStorage.pName;
	this.pFontName = _pStorage.fontname;
	this.size = _pStorage.size;
	this.bold = _pStorage.bold;
	this.italic = _pStorage.italic;
	this.first = _pStorage.first & 0xffff;
	this.runtime_created = false;
	this.ascenderOffset = _pStorage.ascenderOffset;
	this.ascender = _pStorage.ascender;

	this.antialias = 0;
	this.charset = 0;
	if (((_pStorage.first >> 16) & 0xff) !== 0) this.charset = (_pStorage.first >> 16) & 0xff;
	if (((_pStorage.first >> 24) & 0xff) !== 0) this.antialias = ((_pStorage.first >> 24) & 0xff) - 1;

	this.last = _pStorage.last;
	this.scalex = _pStorage.scaleX;
	this.scaley = _pStorage.scaleY;
	this.glyphs = [];
	var f = 99999999;
	var l = -99999999;
	
	var maxHeight = 0;	
	for (var glyph = 0; glyph < _pStorage.glyphs.length; glyph++)
	{
		var index = -2;
		var pGlyph = _pStorage.glyphs[glyph];
		if(pGlyph.c!=undefined) index = pGlyph.c.charCodeAt(0);
		else if (pGlyph.i!=undefined) index = pGlyph.i;

		this.glyphs[index] = pGlyph;
		if( index<f ) f = index;
		if( index>l ) l = index;
		
		if (pGlyph.h > maxHeight) maxHeight = pGlyph.h;
	}
	this.max_glyph_height = maxHeight;
	this.first = f;
	this.last = l;
	this.TPEntry = Graphics_GetTextureEntry(_pStorage.TPageEntry);
};


// #############################################################################################
/// Function: <summary>
///           	Setup the font as a sprite font
///           </summary>
// #############################################################################################
yyFont.prototype.CreateFromSprite = function (_spr, _first, _prop, _sep, _stringmap) {

    this.spriteIndex = _spr;
    this.SpriteMapDictionary = null;
    this.runtime_created = true;
	this.pSprites = g_pSpriteManager.Get(_spr);	
	this.pName = "sprite_font: " + this.pSprites.pName;
	this.pFontName = "spritefont";
	this.size = _spr.width;
	this.bold = false;
	this.italic = false;
	this.first = _first;
	this.stringMap = _stringmap;
	this.spritefont = true;
	this.prop = _prop;
	this.last = _first + this.pSprites.numb;
	this.m_sep = _sep;	

	this.antialias = 0;
	this.charset =10;
	this.scalex = 1;
	this.scaley = 1;
	this.growth = 0.5;

	// No longer need these...
	this.glyphs = null;
	this.TPEntry = null;	
	
	// Work out the size of spaces for sprite fonts where one hasn't been defined
	this.biggestShift = 0;
	for (var i = 0; i < this.pSprites.ppTPE.length; i++) {
	
	    var pTPE = this.pSprites.ppTPE[i];	    
	    if (this.prop) {
			this.biggestShift = yymax(this.biggestShift, pTPE.CropWidth);
		}
		else { 
			this.biggestShift = yymax(this.biggestShift, pTPE.ow);
		}
	}

    // create a map conversion dictionary
	this.SpriteMapDictionary = [];
	if (_stringmap) {
	    var minv = 9999999999;
	    var maxv = -1;
	    for (var i = 0; i < _stringmap.length; i++) {
	        var c = _stringmap.charCodeAt(i);
	        if (c < minv) minv = c;
	        if (c > maxv) maxv = c;
	        this.SpriteMapDictionary[c] = i;
	    }
	    this.first = minv;
	    this.last = maxv;
    } else {
        // ALWAYS remap
	    for (var i = _first; i < (_first + this.pSprites.numb) ; i++) {
	        this.SpriteMapDictionary[i] = i - _first;
	    }
	}

	this.SetSpriteFontHeight();	
};


// #############################################################################################
/// Function:<summary>
///             Works out the maximum height for a sprite font
///          </summary>
// #############################################################################################
yyFont.prototype.SetSpriteFontHeight = function () {
    
    var height = 0;
    for (var n = 0; n < this.pSprites.ppTPE.length; n++) {
    
        var pTPE = this.pSprites.ppTPE[n];
        height = yymax(height, pTPE.oh);
    }
    this.size = height;
};

// #############################################################################################
/// Function:<summary>
///				Returns the height of the text
///          </summary>
///
/// In:		 <param name="str">String to get height of</param>
/// Out:	 <returns>
///				Height of the string provided
///			 </returns>
// #############################################################################################
yyFont.prototype.TextHeight = function (_str) {

    if ((!_str) || (0 === _str.length)) return 0;
    
	if (this.runtime_created) {
		return this.size * this.scalex;
	} 
	else {	    
	    return this.max_glyph_height * this.scalex;
	}
};


// #############################################################################################
/// Function:<summary>
///				Returns the width of the text
///          </summary>
///
/// In:		 <param name="str">String to get width of</param>
/// In:		 <param name="prepared">If set, the input is assumed to be already mapped and containing a single line</param>
/// Out:	 <returns>
///				Width of the text string provided
///			 </returns>
// #############################################################################################
yyFont.prototype.TextWidth = function (_str, _prepared) {

	if ((!_str) || (0 === _str.length)) return 0;
	
	// Split the string into lines and return the longest line's worth
	var lines;
	if (_prepared) {
		lines = [_str];
	} else {
	    lines = g_pFontManager.Split_TextBlock(_str, -1, this);
	}

	if (this.runtime_created) {
	
		if (this.spritefont) {
		
		    var Result = 0;
			for (var i = 0; i < lines.length; i++) {		
		
		        var lineLength = 0;
		        var line = lines[i];
		        for (var j = 0; j < line.length; j++) {
		        			        
			    	lineLength += this.GetShift(line.charCodeAt(j));
			    }
			    Result = yymax(Result, lineLength);
			}
			return Result;
		}
		else {
		    var Result = 0;
		    graphics.font = this.fontstyle;
		    if(graphics.measureText)
		    {
			    for (var i = 0; i < lines.length; i++) 
			    {		
			        var metrics = graphics.measureText(lines[i]);
			        Result = yymax(Result, metrics.width);			    
			    }
			}
			return Result;
		}
	} 
	else {
		var Result = 0;		
		for (var i = 0; i < lines.length; i++) {		
		
		    var lineLength = 0;
		    var line = lines[i];
		    for (var j = 0; j < line.length; j++) {
		    
		    	var c = line.charCodeAt(j);
		    	var pGlyph = this.glyphs[c];
		    	if (!pGlyph) {
		    	    pGlyph = this.glyphs[this.first];
		    	}
		    	lineLength += pGlyph.shift * this.scalex;		    	
		    }
		    Result = yymax(Result, lineLength);
		}
		return Result;
	}
};


// #############################################################################################
/// Function:<summary>
///				Returns the width of the text, only checks _numChars characters. Also only works
///				with single-line text
///          </summary>
///
/// In:		 <param name="_str">String to get width of</param>
/// In:		 <param name="_start">Character to start with</param>
/// In:		 <param name="_numChars">The number of chars to check</param>
/// In:		 <param name="_charSpacing">Any additional spacing between characters</param>
/// Out:	 <returns>
///				Width of the text string provided
///			 </returns>
// #############################################################################################
yyFont.prototype.TextWidthN = function (_str, _start, _numChars, _charSpacing)
{
	_start = yymin(_str.length, _start);
	var end = yymin(_str.length, (_start + _numChars));	
	var charstocheck = end - _start;

	if ((!_str) || (_start >= end))
		return 0;	
	
	if (this.runtime_created)
	{
		if (this.spritefont)
		{		
			var lineLength = 0;
			for (var j = _start; j < end; j++)
			{			
				lineLength += this.GetShift(_str.charCodeAt(j));
			}			

			linelength += charstocheck * _charSpacing;
			return lineLength;
		}
		else
		{
		    var lineLength = 0;
		    graphics.font = this.fontstyle;
		    if(graphics.measureText)
		    {			 
				var stringtocheck = _str.substring(_start, end);
				lineLength = graphics.measureText(stringtocheck);
				lineLength += charstocheck * _charSpacing;
			}
			return lineLength;
		}
	} 
	else
	{
		var lineLength = 0;
		for (var j = _start; j < end; j++)
		{
			var c = _str.charCodeAt(j);
			var pGlyph = this.glyphs[c];
			if (!pGlyph)
			{
				pGlyph = this.glyphs[this.first];
			}
			lineLength += pGlyph.shift * this.scalex;		    	
		}

		lineLength += charstocheck * _charSpacing;		    
		return lineLength;
	}
};


// #############################################################################################
/// Function:<summary>
///				Returns the shift for the character
///          </summary>
///
/// In:		 <param name="ch">character to get shift(Kerning?) of.</param>
/// Out:	 <returns>
///				SHIFT (kerning?) of the character
///			 </returns>
// #############################################################################################
yyFont.prototype.GetShift = function (ch) {

	if (this.runtime_created)
	{	    
		if (this.spritefont)
		{
			var Result = this.m_sep;			
            if ((ch >= this.first) && (ch <= this.last)) {

                var ch2 = this.SpriteMapDictionary[ch];
                var pTPE = this.pSprites.ppTPE[ch2];
                if (!pTPE){
                    result = this.biggestShift;
                }else if (this.prop) {
			        Result += pTPE.CropWidth;			        
			    }
			    else { 
			        Result += pTPE.ow;
			    }
			}
			else if (ch === 32) {
			    Result += this.biggestShift;
			}
			return Result;
		} 
		else {
			graphics.font = this.fontstyle;
			if (graphics.measureText) { // not on WebGL... not sure it should really get here though
			    var metrics = graphics.measureText(String.fromCharCode(ch));
			    return metrics.width;
			}
			return 0;
		}
	}

    var pGlyph = this.glyphs[ch];
	if (pGlyph)                     // get the character shift
	{
	    return pGlyph.shift * this.scalex;
	}
	else if (0x20 >= this.first && 0x20 <= this.last)		// make sure we HAVE a space in the character set
	{
	    // Try and use SPACE if we don't have the letter
		return this.glyphs[0x20].shift * this.scalex;
	}
	else
	{
	    // failing all that, just use the 1st character in the font
		return this.glyphs[this.first].shift * this.scalex; 							
	}
};


function getKerningInfo( ch, pGlyph)
{
	var ret = undefined;
	var low = 0, high = (pGlyph.kerning.length/2)-1, midpoint=0;
	while( low <= high) {
		midpoint = low + ~~((high -low)/2);
		var other = pGlyph.kerning[ midpoint*2 ];
		if (ch == other) {
			ret = pGlyph.kerning[ (midpoint*2) + 1];
			break;
		} // end if
		else
		if (ch < other)
			high = midpoint - 1;
		else
			low = midpoint + 1;
	} // end while
	return ret;
}



// #############################################################################################
/// Function:<summary>
///				Draw a string in the indicated color at the indicated place
///          </summary>
///
/// In:		 <param name="_x">X coordinate to render at</param>
///			 <param name="_y">Y coordinate to render at</param>
///			 <param name="_pStr">string to draw</param>
///			 <param name="_col">Colour to render with</param>
///			 <param name="_alpha">Alpha value to draw with</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFont.prototype.Draw_String_GL_Full = function (_x, _y, _pStr, _xscale, _yscale, _angle, _col1, _col2,_col3,_col4, _charSpacing, _wordSpacing) //, _alpha) {
{
	var TP = this.TPEntry; //g_Textures[this.TPEntry.tp];
	if (!TP.texture.complete) return;                   // if texture hasn't loaded, return...
	var len = _pStr.length;

	var charSpacing = 0.0;
	var wordSpacing = 0.0;
	if (_charSpacing !== undefined)
	{
		charSpacing = _charSpacing;
	}

	if (_wordSpacing !== undefined)
	{
		wordSpacing = _wordSpacing;
	}

	var pPrev = null;
	for (var i = 0; i < len; i++)
	{
		var ch = _pStr.charCodeAt(i);
		var pGlyph = this.glyphs[ch];
	    // Native completly ignores characters it doesn't know about
		if (pGlyph) {
			if ((pPrev != null) && (pGlyph.kerning != undefined)) {
				var kerning = getKerningInfo( pPrev.i, pGlyph);
				if (kerning != undefined) {
					_x += _xscale * this.scalex * kerning;
				} // end if
			} // end if
			pPrev = pGlyph;
		    var xs = pGlyph.x;
		    var ys = pGlyph.y;
		    var ws = pGlyph.w;
		    var hs = pGlyph.h;

		    // use a matrix to rotate and position it..
		    if (Math.abs(_angle) < 0.001) {
		        graphics._drawImage(TP, xs + TP.x, ys + TP.y, ws, hs, _x + (pGlyph.offset * _xscale), _y, ws * this.scalex * _xscale, hs * this.scaley * _yscale, _col1, _col2, _col3, _col4);
		    }
		    else {
		        graphics._drawImage(TP, xs + TP.x, ys + TP.y, ws, hs, _x + (pGlyph.offset * _xscale), _y, ws, hs, _col1, _col2, _col3, _col4);
		    }
		    _x += _xscale  * this.scalex * this.GetShift(ch);
			_x += charSpacing;

			if (_pStr[i] == " ")
				_x += wordSpacing;
		}
	}
	//if (Math.abs(_angle) > 0.001) Graphics_SetTransform();
};

// #############################################################################################
/// Function:<summary>
///				Build a world matrix for rotating text (webgl)
///          </summary>
// #############################################################################################
yyFont.prototype.BuildWorldMatrix = function(_x, _y, _angle) {

    // I appreciate this is probably a bit heavy handed, but sod it
	var mt = new Matrix();
	mt.SetTranslation(-_x, -_y, 0);	    
	var mr = new Matrix();
	mr.SetZRotation(_angle);
	
	var mi = new Matrix();
	mi.Multiply(mt, mr);	    
		    
	mt.SetTranslation(_x, _y, 0);
	
	var mf = new Matrix();
	mf.Multiply(mi, mt);
	
	return mf;
};

// #############################################################################################
/// Function:<summary>
///				Draw a string in the indicated color at the indicated place for WebGL
///          </summary>
// #############################################################################################
yyFont.prototype.Draw_String_GL = function (_x, _y, _pStr, _xscale, _yscale, _angle, _col1, _col2,_col3,_col4, _charSpacing, _wordSpacing) //, _alpha) 
{
    if( this.runtime_created)
    {
        //original
        this.Draw_String_GL_Full(_x, _y, _pStr, _xscale, _yscale, _angle, _col1, _col2, _col3, _col4, _charSpacing, _wordSpacing);
    }

	var charSpacing = 0.0;
	var wordSpacing = 0.0;
	if (_charSpacing !== undefined)
	{
		charSpacing = _charSpacing;
	}

	if (_wordSpacing !== undefined)
	{
		wordSpacing = _wordSpacing;
	}
    
    //tizen optimised
    var cached_image;
	var TP = this.TPEntry; 
	if (!TP.texture.complete) return;                   // if texture hasn't loaded, return...
	var len = _pStr.length;
    
	if (GR_MarkVertCorners) {
	
	    _col1 &= 0xfffefffe;			// clear out bits, ready for "marking"
		_col2 &= 0xfffefffe;			// 
		_col3 &= 0xfffefffe;			// 
		_col4 &= 0xfffefffe;			// 
		_col2 |= 0x00010000;			// Mark which corner we're in!
		_col3 |= 0x00000001;
		_col4 |= 0x00010001;
	}
	
	
	//inline WebGL_drawImage_Replacement_RELEASE, allocate all required verts at once
	var pBuff, pCoords, pColours, pUVs;
	if (!TP.texture.webgl_textureid) WebGL_BindTexture(TP);
	
	//push on the transform	if necessary
	var worldMatrix;
	if (Math.abs(_angle) > 0.001) {

	    worldMatrix = WebGL_GetMatrix(MATRIX_WORLD);
	    WebGL_SetMatrix(MATRIX_WORLD, this.BuildWorldMatrix(_x, _y, _angle));
	}
	
	var numVerts = len * 6;
	pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, TP.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
	var index = stride * pBuff.Current; 
    pBuff.Current += numVerts;
    
    var v0 = index,
        v1 = v0 + stride,
        v2 = v1 + stride,
        v3 = v2 + stride,
        v4 = v3 + stride,
        v5 = v4 + stride;
    
    pCoords = pBuff.Coords;
    pColours = pBuff.Colours;
    pUVs = pBuff.UVs;
    
    var scaleX, scaleY;
    //if (Math.abs(_angle) < 0.001)
    //{
        scaleX = this.scalex * _xscale;
        scaleY = this.scaley * _yscale;
    //} 
    //else {
        //scaleX = this.scalex * _xscale;
        //scaleY = this.scaley * _yscale;
    //}
      
    var skip = 0;
    var s_growth = this.growth,
        invWidth = 1.0 / TP.texture.width,
        invHeight = 1.0 / TP.texture.height;

    var bLerp=false;
    if ( (_col1 != _col2) || (_col3 != _col4) ) {
        var strWidth = this.TextWidth(_pStr, true);
        var invStrWidth = 1/strWidth;
        var alpha = _col1 & 0xff000000;
        bLerp = true;
    }

    var pPrev = null;
    for (var i = 0; i < len; i++)
	{
		var ch = _pStr.charCodeAt(i);
		var pGlyph = this.glyphs[ch];
	
        // Native completely  ignores Glyphs it doesn't know about - so do the same
		if (pGlyph) {
			if ((pPrev != null) && (pGlyph.kerning != undefined)) {
				var kerning = getKerningInfo( pPrev.i, pGlyph);
				if (kerning != undefined) {
					_x += scaleX * kerning;
				} // end if
			} // end if
			pPrev = pGlyph;
		    var xs = pGlyph.x,
                ys = pGlyph.y,
                ws = pGlyph.w + 1,
                hs = pGlyph.h + 1;

		    var x = _x + (pGlyph.offset * _xscale);
		    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = x - s_growth;
		    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = _y - s_growth;
		    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = x + s_growth + (ws * scaleX);
		    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = _y + s_growth + (hs * scaleY);
		    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;

		    pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = (TP.x + xs - s_growth) * invWidth;
		    pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = (TP.y + ys - s_growth) * invHeight;
		    pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (TP.x + xs + ws + s_growth) * invWidth;
		    pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (TP.y + ys + hs + s_growth) * invHeight;

		    //#0029653 interpolate corner colours for each character vertex
		    if (bLerp) {
		        var x0 = pCoords[index];
		        var r1 = Math.min( Math.abs((pCoords[v0] - x0)) * invStrWidth, 1);
		        var r2 = Math.min( Math.abs((pCoords[v1] - x0)) * invStrWidth, 1);
		        var c1 = merge_color(_col1, _col2, r1) | alpha;
		        var c2 = merge_color(_col1, _col2, r2) | alpha;
		        var c3 = merge_color(_col4, _col3, r2) | alpha;
		        var c4 = merge_color(_col4, _col3, r1) | alpha;

		        pColours[v0] = pColours[v5] = c1;
		        pColours[v1] = c2;
		        pColours[v2] = pColours[v3] = c3;
		        pColours[v4] = c4;

		    } else {
		        pColours[v0] = pColours[v5] = _col1;
		        pColours[v1] = _col2;
		        pColours[v2] = pColours[v3] = _col3;
		        pColours[v4] = _col4;
		    }

		    v0 += (stride * 6);
		    v1 += (stride * 6);
		    v2 += (stride * 6);
		    v3 += (stride * 6);
		    v4 += (stride * 6);
		    v5 += (stride * 6);

		    _x += scaleX * pGlyph.shift;
		} else {
		    skip++; // keep track of characters we DONT render
		}

		_x += charSpacing;

		if (_pStr[i] == " ")
			_x += wordSpacing;
    }
    pBuff.Current -= skip*6;  // claim back unused space
    

    // Reset the world matrix    
	if (worldMatrix != undefined) {
	    WebGL_SetMatrix(MATRIX_WORLD, worldMatrix);
	}
};


// #############################################################################################
/// Function:<summary>
///				Draw a string in the indicated color at the indicated place
///          </summary>
///
/// In:		 <param name="_x">X coordinate to render at</param>
///			 <param name="_y">Y coordinate to render at</param>
///			 <param name="_pStr">string to draw</param>
///			 <param name="_col">Colour to render with</param>
///			 <param name="_alpha">Alpha value to draw with</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFont.prototype.Draw_String = function (_x, _y, _pStr, _xscale, _yscale, _angle, _col1, _col2, _col3, _col4, _charSpacing, _wordSpacing) //, _alpha) {        
{
    var cached_image = null;
    var ch;
	var TP = g_Textures[this.TPEntry.tp];
	if (!TP.complete) return;                   // if texture hasn't loaded, return...

	var charSpacing = 0.0;
	var wordSpacing = 0.0;
	if (_charSpacing !== undefined)
	{
		charSpacing = _charSpacing;
	}

	if (_wordSpacing !== undefined)
	{
		wordSpacing = _wordSpacing;
	}

	var la = graphics.globalAlpha;
	graphics.globalAlpha = ((_col1 >> 24)&0xff) / 255.0;    // _alpha;
	var len = _pStr.length;

	// If coloured, then cache a "colourised" version
	_col1 = _col1 & 0xffffff;

    // Don't use a transform matrix unless we have an angle to use
	_angle = RAD(_angle);	
   	var pPrev = null;
	if (Math.abs(_angle) > 0.00001)
	{
		Graphics_PushTransform(_x, _y, this.scalex * _xscale, this.scaley * _yscale, -_angle);
		_x = 0;
		_y = 0;
		
        if (_col1 != 0xffffff)
        {
	        for (var i = 0; i < len; i++)
	        {
		        ch = _pStr.charCodeAt(i);
		        var pGlyph = this.glyphs[ch];
	            // Native completely  ignores Glyphs it doesn't know about - so do the same
		        if (pGlyph) {
					if ((pPrev != null) && (pGlyph.kerning != undefined)) {
						var kerning = getKerningInfo( pPrev.i, pGlyph);
						if (kerning != undefined) {
							_x += kerning;
						} // end if
					} // end if
					pPrev = pGlyph;
		            var ws = pGlyph.w;
		            if (ws != 99999) {
		                var hs = pGlyph.h;
		                cached_image = Graphics_CacheBlock_Do(TP, pGlyph, pGlyph.x + this.TPEntry.x, pGlyph.y + this.TPEntry.y, ws + 2, hs + 2, _col1);
		                graphics._drawImage(cached_image, 0, 0, ws, hs, _x + pGlyph.offset, _y, ws, hs);

		                // Scale is encoded in the transformation matrix
		                _x += this.GetShift(ch);
		            } // end if
		        }

				_x += charSpacing;

				if (_pStr[i] == " ")
					_x += wordSpacing;
	        }
	    } // end if
	    else {
	        for (var i = 0; i < len; i++)
	        {
		        ch = _pStr.charCodeAt(i);
		        var pGlyph = this.glyphs[ch];
	            // Native completely  ignores Glyphs it doesn't know about - so do the same
		        if (pGlyph) {
					if ((pPrev != null) && (pGlyph.kerning != undefined)) {
						var kerning = getKerningInfo( pPrev.i, pGlyph);
						if (kerning != undefined) {
							_x += kerning;
						} // end if
					} // end if
					pPrev = pGlyph;
		            var ws = pGlyph.w;
		            if (ws != 99999) {
		                var hs = pGlyph.h;
		                graphics._drawImage(TP, pGlyph.x + this.TPEntry.x, pGlyph.y + this.TPEntry.y, ws, hs, _x + pGlyph.offset, _y, ws, hs);

		                // Scale is encoded in the transformation matrix
		                _x += this.GetShift(ch);
		            } // end if
		        }

				_x += charSpacing;

				if (_pStr[i] == " ")
					_x += wordSpacing;
	        }
	    } // end else
	    Graphics_SetTransform();
    } // end if
    else {
	    // Truncate towards zero
        _x = ~~(_x + 0.5);
	    _y = ~~(_y + 0.5);
	    
	    var xsc = this.scalex * _xscale;
	    var ysc = this.scaley * _yscale;
        if (_col1 != 0xffffff)
        {
	        for (var i = 0; i < len; i++)
	        {
		        ch = _pStr.charCodeAt(i);
		        var pGlyph = this.glyphs[ch];
	            // Native completely  ignores Glyphs it doesn't know about - so do the same
		        if (pGlyph) {
					if ((pPrev != null) && (pGlyph.kerning != undefined)) {
						var kerning = getKerningInfo( pPrev.i, pGlyph);
						if (kerning != undefined) {
							_x += xsc* kerning;
						} // end if
					} // end if
					pPrev = pGlyph;
		            var ws = pGlyph.w;
		            if (ws != 99999) {
		                var hs = pGlyph.h;
		                cached_image = Graphics_CacheBlock_Do(TP, pGlyph, pGlyph.x + this.TPEntry.x, pGlyph.y + this.TPEntry.y, ws + 2, hs + 2, _col1);
		                graphics._drawImage(cached_image, 0, 0, ws + 1, hs + 1, _x + (pGlyph.offset * xsc), _y, (ws + 1) * xsc, (hs + 1) * ysc);

		                // Scale is NOT encoded in the transformation matrix
		                _x += xsc * this.GetShift(ch);
		            } // end if
		        }

				_x += xsc * charSpacing;

				if (_pStr[i] == " ")
					_x += xsc * wordSpacing;
	        } // end else
	    } // end if
	    else {
	        for (var i = 0; i < len; i++)
	        {
		        ch = _pStr.charCodeAt(i);
		        var pGlyph = this.glyphs[ch];
	            // Native completely  ignores Glyphs it doesn't know about - so do the same
		        if (pGlyph) {
					if ((pPrev != null) && (pGlyph.kerning != undefined)) {
						var kerning = getKerningInfo( pPrev.i, pGlyph);
						if (kerning != undefined) {
							_x += xsc* kerning;
						} // end if
					} // end if
					pPrev = pGlyph;
		            var ws = pGlyph.w;
		            if (ws != 99999) {
		                var hs = pGlyph.h;
		                graphics._drawImage(TP, pGlyph.x + this.TPEntry.x, pGlyph.y + this.TPEntry.y, ws, hs, _x + (pGlyph.offset * xsc), _y, ws * xsc, hs * ysc);

		                // Scale is NOT encoded in the transformation matrix
		                _x += xsc * this.GetShift(ch);
		            } // end if
		        }

				_x += xsc * charSpacing;

				if (_pStr[i] == " ")
					_x += xsc * wordSpacing;
	        } // end for
	    } // end else
	} // end else
	graphics.globalAlpha = la;
};


// #############################################################################################
/// Function:<summary>
///				Draw a string using a SPRITE font in the indicated color at the indicated place
///             _col2,_col3,_col4 ignored on canvas
///          </summary>
///
/// In:		 <param name="_x">X coordinate to render at</param>
///			 <param name="_y">Y coordinate to render at</param>
///			 <param name="_pStr">string to draw</param>
///			 <param name="_col">Colour to render with</param>
///			 <param name="_alpha">Alpha value to draw with</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFont.prototype.Draw_Sprite_String = function (_x, _y, _pStr, _xscale, _yscale, _angle, _col1, _col2, _col3, _col4, _charSpacing, wordSpacing)
{
	if (this.pSprites == null) return;

	var charSpacing = 0.0;
	var wordSpacing = 0.0;
	if (_charSpacing !== undefined)
	{
		charSpacing = _charSpacing;
	}

	if (_wordSpacing !== undefined)
	{
		wordSpacing = _wordSpacing;
	}

	var a = ((_col1 >> 24) & 0xff) / 255.0;
	var la = graphics.globalAlpha;
	graphics.globalAlpha = a;
	_col1 &= 0xffffff;

	var xsc = this.scalex * _xscale;
	var ysc = this.scaley * _yscale;
	
	if (Math.abs(_angle) >= 0.001){
	    Graphics_PushTransform(_x, _y, 1, 1, -RAD(_angle));
	    _y = _x = 0;
    }


	var len = _pStr.length;
	for (var i = 0; i < len; i++)
	{
		var ch = _pStr.charCodeAt(i);
		if (ch != 0x20) 
		{
		    if ((ch >= this.first) && (ch <= this.last))
		    {
		        var ch2 = this.SpriteMapDictionary[ch];
		        if (ch2!==undefined){
		            var pTPE = this.pSprites.ppTPE[ch2];
		            var TP = g_Textures[pTPE.tp]; 		        // get texture page
		            if (TP.complete)							// make sure texture has loaded
		            {
		                var ox = pTPE.XOffset + this.pSprites.xOrigin;
		                var oy = pTPE.YOffset + this.pSprites.yOrigin;
		                if (this.prop) ox = 0;

		                // If coloured, then cache a "colourised" version
		                if (_col1 != 0xffffff) {
		                    var cached_image = Graphics_CacheBlock(pTPE, _col1);
		                    graphics._drawImage(cached_image, 0, 0, pTPE.CropWidth, pTPE.CropHeight, _x + (ox * xsc), _y + (oy * ysc), pTPE.CropWidth * xsc, pTPE.CropHeight * ysc);
		                } else {
		                    graphics._drawImage(TP, pTPE.x, pTPE.y, pTPE.w, pTPE.h, _x + (ox * xsc), _y + (oy * ysc), pTPE.CropWidth * xsc, pTPE.CropHeight * ysc);
		                }
		            }
		        }
		    }
		}		
		_x = _x + xsc * this.GetShift(ch);

		_x += xsc * charSpacing;

		if (_pStr[i] == " ")
			_x += xsc * wordSpacing;
	}


	if (Math.abs(_angle) >= 0.001) Graphics_SetTransform();
	graphics.globalAlpha = la;
};



// #############################################################################################
/// Function:<summary>
///				Draw a string using a SPRITE font in the indicated color at the indicated place
///          </summary>
///
/// In:		 <param name="_x">X coordinate to render at</param>
///			 <param name="_y">Y coordinate to render at</param>
///			 <param name="_pStr">string to draw</param>
///			 <param name="_col1">Colour to render with</param>
///			 <param name="_col2">[optional]top right colour to render with</param>
///			 <param name="_col3">[optional]bottom left colour to render with</param>
///			 <param name="_col4">[optional]bottom right colour to render with</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFont.prototype.Draw_Sprite_String_GL = function (_x, _y, _pStr, _xscale, _yscale, _angle, _c1, _c2, _c3, _c4, _charSpacing, _wordSpacing)
{
	if (this.pSprites == null) return;

	var charSpacing = 0.0;
	var wordSpacing = 0.0;
	if (_charSpacing !== undefined)
	{
		charSpacing = _charSpacing;
	}

	if (_wordSpacing !== undefined)
	{
		wordSpacing = _wordSpacing;
	}

	var len = _pStr.length;
	var xsc = this.scalex * _xscale;
	var ysc = this.scaley * _yscale;

	var worldmat = undefined;
	if (Math.abs(_angle) >= 0.001) {	
	    worldmat = WebGL_GetMatrix(MATRIX_WORLD);
	    WebGL_SetMatrix(MATRIX_WORLD, this.BuildWorldMatrix(_x, _y, _angle));
    }

	
    // remember alpha for blending in
	var alpha = (_c1 & 0xff000000);

    // get delta's  (16.16 format)
	var left_r_dx = ((_c2 & 0xff0000) - (_c1 & 0xff0000)) / len;
	var left_g_dx = ((((_c2 & 0xff00) << 8) - ((_c1 & 0xff00) << 8))) / len;
	var left_b_dx = ((((_c2 & 0xff) << 16) - ((_c1 & 0xff) << 16))) / len;

	var right_r_dx = ((_c3 & 0xff0000) - (_c4 & 0xff0000)) / len;
	var right_g_dx = ((((_c3 & 0xff00) << 8) - ((_c4 & 0xff00) << 8))) / len;
	var right_b_dx = ((((_c3 & 0xff) << 16) - ((_c4 & 0xff) << 16))) / len;

	var left_delta_r = left_r_dx;
	var left_delta_g = left_g_dx;
	var left_delta_b = left_b_dx;
	var right_delta_r = right_r_dx;
	var right_delta_g = right_g_dx;
	var right_delta_b = right_b_dx;

	var c1 = _c1;   // set left edge...
	var c4 = _c4;   //

	for (var i = 0; i < len; i++)
	{
        // do 16.16 maths
	    var c2 = ((_c1 & 0xff0000) + (left_delta_r & 0xff0000)) & 0xff0000;
	        c2 |= ((_c1 & 0xff00) + (left_delta_g >> 8) & 0xff00) & 0xff00;
	        c2 |= ((_c1 & 0xff) + (left_delta_b >> 16)) & 0xff;
	        c2 |= alpha;
	    var c3 = ((_c4 & 0xff0000) + (right_delta_r & 0xff0000)) & 0xff0000;
	        c3 |= ((_c4 & 0xff00) + (right_delta_g >> 8) & 0xff00) & 0xff00;
	        c3 |= ((_c4 & 0xff) + (right_delta_b >> 16)) & 0xff;
	        c3 |= alpha;

	    left_delta_r += left_r_dx;
	    left_delta_g += left_g_dx;
	    left_delta_b += left_b_dx;
	    right_delta_r += right_r_dx;
	    right_delta_g += right_g_dx;
	    right_delta_b += right_b_dx;

		var ch = _pStr.charCodeAt(i);
		if (ch != 0x20) {
		    if (ch < this.first || ch > this.last) {
		    }
		    else {
		        var ch2 = this.SpriteMapDictionary[ch];
		        if (ch2 !== undefined) {
		            var pTPE = this.pSprites.ppTPE[ch2];
		            var TP = g_Textures[pTPE.tp]; 				// get texture page
		            if (TP.complete)							// make sure texture has loaded
		            {
		                var ox = pTPE.XOffset + this.pSprites.xOrigin;
		                var oy = pTPE.YOffset + this.pSprites.yOrigin;
		                if (this.prop) ox = 0;

		                graphics._drawImage(pTPE, pTPE.x, pTPE.y, pTPE.w, pTPE.h, _x + (ox * xsc), _y + (oy * ysc), pTPE.CropWidth * xsc, pTPE.CropHeight * ysc, c1, c2, c3, c4);
		            }
		        }
		    }
		}
		c4 = c3;    // set left edge to be what the last right edge was....
		c1 = c2;    //
		_x += xsc * this.GetShift(ch);

		_x += xsc * charSpacing;

		if (_pStr[i] == " ")
			_x += xsc * wordSpacing;
	}

    // if we had an angle restore world marix
	if (worldmat !== undefined) {
	    WebGL_SetMatrix(MATRIX_WORLD, worldmat);
	}
};




























// #############################################################################################
/// Function:<summary>
///             Create a new Font manager
///          </summary>
// #############################################################################################
/** @constructor */
function    yyFontManager( )
{
    this.Fonts = [];
    this.length = 0;
    this.thefont = null;
    this.fontid = 0;
    this.valign = 0;
    this.halign = 0;

    g_DefaultFont = -1;
    this.fontid = g_DefaultFont;    
}

// #############################################################################################
/// Function:<summary>
///             Get a Font from the manager
///          </summary>
///
/// In:		 <param name="_indexe">Font to retrieve</param>
// #############################################################################################
yyFontManager.prototype.Font_Get = function (_index) {
	return this.Fonts[_index];
};

// #############################################################################################
/// Function:<summary>
///             Add a new Font image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Font image Storage</param>
// #############################################################################################
yyFontManager.prototype.Clear = function () {
	this.Fonts = [];
	this.Fonts.length = 0;
};


// #############################################################################################
/// Function:<summary>
///             Add a new Font image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Font image Storage</param>
// #############################################################################################
yyFontManager.prototype.Add = function (_pStorage) {
	var pFont = null;
	if (_pStorage != null)
	{
		pFont = new yyFont();
		pFont.CreateFromStorage(_pStorage);
	}
	this.Fonts[this.Fonts.length] = pFont;
	return this.Fonts.length - 1;
};

// #############################################################################################
/// Function:<summary>
///             Add a new Embedded Font
///          </summary>
///
/// In:		 <param name="_pStorage">Embedded font in storage</param>
// #############################################################################################
yyFontManager.prototype.AddEmbedded = function (_pStorage) {
    var pFont = null;
    if (_pStorage != null) {
        pFont = new yyFont();
        pFont.CreateFromStorage(_pStorage);
    }

    // TODO: Multiple embedded fonts?
    this.Fonts[-1] = pFont;
};

// #############################################################################################
/// Function:<summary>
///             Add a new Font image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Font image Storage</param>
// #############################################################################################
yyFontManager.prototype.AddFont = function (_pFont) {

	this.Fonts[this.Fonts.length] = _pFont;
	return this.Fonts.length - 1;
};

// #############################################################################################
/// Function:<summary>
// Sets the current font correctly
///          </summary>
// #############################################################################################
yyFontManager.prototype.SetFont = function () {

	if (this.fontid >= 0 && this.fontid <= this.Fonts.length && this.Fonts[this.fontid] != null)
	{
		this.thefont = this.Fonts[this.fontid];
	}
	else
	{
		// Use default font
		this.thefont = this.Fonts[-1];

		if(!this.thefont)
			ErrorOnce( "Error: Failed to set font. Built-in fonts disabled with no current font set." );
	}
};



// #############################################################################################
/// Function:<summary>
// Sets the current font correctly
///          </summary>
// #############################################################################################
yyFontManager.prototype.Get = function( _id ) {
	if (_id >= 0 && _id <= this.Fonts.length && this.Fonts[_id] )
	{
		return this.Fonts[_id];
	}
	return null;
};


// #############################################################################################
/// Function:<summary>
///				replaces hash marks with newline characters
///          </summary>
///
/// In:		 <param name="str">Start to parse</param>
///          <param name="thefont">font to get sizes and mapping from</param>
/// In:		 <param name="_override_zeus">override the GMS2 setting?</param>
/// Out:	 <returns>
///				converted string or the original one back again
///			 </returns>
// #############################################################################################
function    String_Replace_Hash(str, thefont, _override_zeus)
{
    // don't convert anything in ZEUS - unless we come from string_hash_to_newline() function...
    if (_override_zeus === undefined) _override_zeus = false;
    if( _override_zeus==false && g_isZeus) return str;

	if ( str == null) return 0;

	var pS = str;
	var pD = "";	
	var i=0;
	var si = 0;

	while(si<pS.length )
	{
		var s = pS[si];
		if ( s == "#" )
		{		    
			if ((i > 0) && (pS[si-1] == '\\'))
			{							
				pD = pD.substring(0,pD.length-1)+'#';       // the length doesn't change here, so we don't need curr++
			}			
			else
			{
			    pD += String.fromCharCode(0x0d);
				pD += String.fromCharCode(0x0a);
				i++;
			} 
		} 
		else
		{
			pD += s;
			i++;
		} 		
		si++;
	} 
	return pD;
}



// #############################################################################################
/// Function:<summary>
///				Splits the text in individual lines and stores them in sl
///          </summary>
///
/// In:		 <param name="str">String to split</param>
///			 <param name="linewidth"></param>
///			 <param name="sl"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFontManager.prototype.Split_TextBlock = function (_pStr, linewidth, thefont) {

	if (_pStr == null) return;
	if (linewidth < 0) linewidth = 10000000; 	// means nothing will "wrap"
	
	var whitespace = " ";
	var newline = String.fromCharCode(0x0a);
	var newline2 = String.fromCharCode(0x0d);

	var sl = [];
	var sl_index = 0;

    // put newlines in
	if(!g_isZeus) _pStr = String_Replace_Hash(_pStr, thefont);
	var len = _pStr.length;

	// Allocate new space
	var pNew = _pStr;

	var lastChar = pNew[0];
	var start = 0;
	var end = 0;
	while (start < len)
	{
		var total = 0;


		// If width < 0 (i.e. no wrapping required), then we DON'T strip spaces from the start... we just copy it!  (sounds wrong.. but its what they do...)
		if (linewidth == 10000000)
		{
		    while (end < len && pNew[end] != newline && pNew[end] != newline2)
			{ 
		        end++;
		        if (end < len) lastChar = pNew[end]; else lastChar = String.fromCharCode(0x0);
		    }
		    var c;
		    if (end < len) c = pNew[end]; else c = String.fromCharCode(0x0);
		    if ((newline == lastChar) && (newline2 == pNew[end])) { end++; continue; } // ignore, we've already split the line on #10
		    if ((newline2 == lastChar) && (newline == pNew[end])) { end++; continue; } // ignore, we've already split the line on #13

		    lastChar = pNew[end];
			sl[sl_index++] = pNew.substring(start, end); 	// add into our list...
		}
		else
		{
			// Skip leading whitespace
			while (end < len)
			{
				if (pNew[end] != whitespace) break;
				end++;
			}
			start = end;    // we ignore whitespace at the start


			// Loop through string and get the number of chars that will fit in the line.
			while (end < len && total < linewidth)
			{
				c = pNew[end];
				if (c == newline) break; 				// if we hit a newline, then "break" here...
				total += this.thefont.GetShift(c.charCodeAt(0)); 		// add on width of character
				end++;
			}
			// If we shot past the end, then move back a bit until we fit.
			if (total > linewidth)
			{
				end--;
				total -= this.thefont.GetShift(pNew.charCodeAt(end)); 			// add on width of character
			}

			// END of line
			if (pNew[end] == newline)
			{
				//pNew[end] = 0x00;
				sl[sl_index++] = pNew.substring(start, end);
			} else
			{
				// NOT a new line, but we didn't move on... fatal error. Probably a single char doesn't even fit!
				if (end == start) return sl;


				// If we don't END on a "space", OR if the next character isn't a space AS WELL. 
				// then backtrack to the start of the last "word"
				if (end != len)
				{
					if ((pNew[end] != whitespace) || (pNew[end] != whitespace && pNew[end + 1] != whitespace))
					{
						while (end > start)
						{
							if (pNew[--end] == whitespace) break; 				// FOUND start of word
						}
					}
				}

				if (end > start)
				{
					while (pNew[end - 1] == whitespace)
					{
						end--;
					}
				} 
				else if (end == start) // if we're back to the START of the string... look for the next space - or string end.
				{
					while (pNew[end] != whitespace && end < len)
					{
						end++;
					}
				}
				
				sl[sl_index++] = pNew.substring(start, end);
			}
		}
		start = ++end;
	}
	return sl;	
};


// #############################################################################################
/// Function:<summary>
///				Splits the text in individual lines and stores them in sl
///          </summary>
///
/// In:		 <param name="str">String to split</param>
///			 <param name="linewidth"></param>
///			 <param name="sl"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFontManager.prototype.Split_TextBlock_IDEstyle = function (_pStr, _boundsWidth, _boundsHeight, _alignment, _wrap, _charSpacing, _lineSpacing, _paraSpacing) {

	if (_pStr == null) return;	
	
	var whitespace = " ";
	var newline = String.fromCharCode(0x0a);
	var newline2 = String.fromCharCode(0x0d);

	var ret = new Object();
	ret.TotalW = 0.0;
	ret.TotalH = 0.0;
	ret.sl = null;

	var sl = [];	

    // put newlines in
	if(!g_isZeus) _pStr = String_Replace_Hash(_pStr, this.thefont);
	var len = _pStr.length;

	// Allocate new space
	var pNew = _pStr;

	var textLines = [];
	var start = 0;
	var char = 0;

	while (char != len)
	{
		if ((pNew[char] == newline) || (pNew[char] == newline2))
		{
			textLines[textLines.length] = pNew.substring(start, char);

			while((pNew[char] == newline) || (pNew[char] == newline2))
			{
				char++;
			}

			start = char;
		}
		else
		{
			char++;
		}
	}

	if ((char > start) && (start < len))
	{
		textLines[textLines.length] = pNew.substring(start, char);
	}

	var xpos = 0.0;
	var ypos = 0.0;
	var lineHeight = this.thefont.max_glyph_height;
	var totalW = 0.0;

	var spaceWidth = this.thefont.GetShift(32);
	for(var p = 0; p < textLines.length; p++)
	{
		var str = textLines[p];

		var lineData = null;
		if (_wrap)
		{
			var lineWidth = 0.0;

			var curr = 0;
			while(curr < str.length)
			{
				if (str[curr] != whitespace)
					break;
				
				curr++;
			}

			if (curr == str.length)
			{			
				// Empty line
				ypos += lineHeight;
				ypos += _lineSpacing;
				ypos += _paraSpacing;
			}
			else
			{
				// Okay found a non-whitespace character
				var wordStart = curr;
				var wordEnd = curr;
				var lineStart = curr;
				var lineWords = 0;

				while (curr < str.length)
				{
					while((curr < str.length) && (str[curr] != whitespace))
					{
						curr++;
					}

					// Okay we've found a word or reached the end of the line
					var wordWidth = this.thefont.TextWidthN(str, wordStart, curr - wordStart, _charSpacing);
					if ((lineWidth + wordWidth) > _boundsWidth)
					{
						// Add what we've got
						if (lineWords == 0)
						{
							// Even though we've overflowed, we only have a single word, so add it
							lineWidth = wordWidth;
							totalW = yymax(totalW, lineWidth);

							lineData = new Object();
							lineData.pString = str.substring(lineStart, curr);
							lineData.x = xpos;
							lineData.y = ypos;
							lineData.lineWidth = lineWidth;
							lineData.wordSpacing = 0.0;
							lineData.paragraphEnd = false;
							lineData.numWords = 1;

							sl[sl.length] = lineData;

							curr++;

							lineWidth = 0.0;
							lineWords = 0;
							lineStart = curr;
						}
						else
						{
							// Add everything up to the previous word
							totalW = yymax(totalW, lineWidth);

							lineData = new Object();
							lineData.pString = str.substring(lineStart, wordEnd);
							lineData.x = xpos;
							lineData.y = ypos;
							lineData.lineWidth = lineWidth;
							lineData.wordSpacing = 0.0;
							lineData.paragraphEnd = false;
							lineData.numWords = lineWords;

							sl[sl.length] = lineData;

							wordEnd = curr;
							lineWidth = wordWidth;
							lineWords = 1;
							lineStart = wordStart;
						}

						ypos += lineHeight;
						ypos += _lineSpacing;
					}
					else
					{
						wordEnd = curr;

						if (lineWords > 0)
						{
							lineWidth += spaceWidth;
						}

						lineWidth += wordWidth;
						lineWords++;
					}

					// Skip spaces until the next word start (or until the end of the line) 
					var spaceStart = curr + 1;		// leave one space 
					while ((curr < str.length) && (str[curr] == whitespace)) 
					{ 
						curr++; 
					} 

					if (curr > spaceStart) 
					{ 
						// Make sure we only have a single space between words, so shift the contents of the line backwards 
						var firststring = str.substring(0, spaceStart - 1);
						var secondstring = str.substring(curr, str.length);
						str = firststring + secondstring;
						
						curr = spaceStart; 
					} 

					wordStart = curr; 
				}

				// Add remainder 
				if (lineStart < (str.length)) 
				{ 
					lineWidth = this.thefont.TextWidthN(str, lineStart, (str.length) - lineStart, _charSpacing);
					totalW = yymax(totalW, lineWidth); 

					lineData = new Object();
					lineData.pString = str.substring(lineStart, str.length);
					lineData.x = xpos;
					lineData.y = ypos;
					lineData.lineWidth = lineWidth;
					lineData.wordSpacing = 0.0;
					lineData.paragraphEnd = false;
					lineData.numWords = lineWords;

					sl[sl.length] = lineData;
 
					ypos += lineHeight; 
					ypos += _lineSpacing; 
				} 
			}
		}
		else
		{
			var lineWidth = this.thefont.TextWidthN(str, 0, str.length, _charSpacing); 
			totalW = yymax(totalW, lineWidth); 			

			lineData = new Object();
			lineData.pString = str;
			lineData.x = xpos;
			lineData.y = ypos;
			lineData.lineWidth = lineWidth;
			lineData.wordSpacing = 0.0;
			lineData.paragraphEnd = false;
			lineData.numWords = 0;					// hmm need to work this out

			sl[sl.length] = lineData;
 
			if (str.length == 0) 
				lineData.paragraphEnd = true; 
 
			ypos += lineHeight; 
			ypos += _lineSpacing;			 
		}

		if (lineData != null) 
		{ 
			lineData.paragraphEnd = (_wrap) ? true : (p == (textLines.length - 1)); 
			if (lineData.paragraphEnd) 
			{ 
				ypos += _paraSpacing; 
			} 
		} 
	}

	var alignmentV = (_alignment >> 8) & 0xff;
	var alignmentH = _alignment & 0xff;

	// Vertical alignment 
	var totalH = ypos - _lineSpacing - _paraSpacing; 
	if (_wrap) 
	{ 
		var yoffs = 0.0; 
		if (alignmentV == TTALIGN_VCentre)		// middle 
			yoffs = (boundsHeight - totalH) * 0.5; 
		else if (alignmentV == TTALIGN_Bottom)	// bottom 
			yoffs = (boundsHeight - totalH); 
 
		if (yoffs != 0.0) 
		{ 
			var numlines = sl.length; 
			for (var i = 0; i < numlines; i++) 
			{ 
				var ld = sl[i];		
				ld.y += yoffs; 
			} 
 
		} 
	} 
 
	// Horizontal alignment 
	if (alignmentH != TTALIGN_Left)			// left 
	{ 
		var areaW = (_wrap) ? _boundsWidth : totalW; 
 
		var numlines = sl.length; 
		for (var i = 0; i < numlines; i++) 
		{ 
			var ld = sl[i];		
			var lineWidth = ld.lineWidth; 
			if (alignmentH == TTALIGN_Justify)	// justify 
			{ 
				if (!ld.paragraphEnd)			// don't justify last line of paragraph 
				{ 
					if (ld.numWords > 1) 
					{ 
						var extra = (areaW - lineWidth); 
						ld.wordSpacing = extra / (ld.numWords - 1); 
					} 
				} 
			} 
			else if (alignmentH == TTALIGN_Right)	// right 
				ld.x = (areaW - lineWidth); 
			else if (alignmentH == TTALIGN_HCentre)	// centre 
				ld.x = (areaW - lineWidth) * 0.5; 
		} 
	} 

	ret.totalW = totalW;
	ret.totalH = totalH;
	ret.sl = sl;

	return ret;
};

// #############################################################################################
/// Function:<summary>
///				Draws a string in a block in the current font at the given location
///          </summary>
///
/// In:		 <param name="x">X coordinate</param>
///			 <param name="y">Y coordinate</param>
///			 <param name="str">String to print</param>
///			 <param name="linesep"></param>
///			 <param name="linewidth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFontManager.prototype.GR_Text_Draw = function (_str, x, y, linesep, linewidth, _angle, _xscale, _yscale, _c1,_c2,_c3,_c4) {

	var xscale = _xscale;
	var yscale = _yscale;
	var xoff = 0.0;
	var yoff = 0.0;
	var sl = [];
	var i = 0;
	this.SetFont();
	var thefont = this.thefont;
	
	if (_c1 === undefined) {
	    _c1 = g_GlobalColour | ((g_GlobalAlpha * 255.0) << 24);
	    _c2 = g_GlobalColour | ((g_GlobalAlpha * 255.0) << 24);
	    _c3 = g_GlobalColour | ((g_GlobalAlpha * 255.0) << 24);
	    _c4 = g_GlobalColour | ((g_GlobalAlpha * 255.0) << 24);
	} else if (_c2 === undefined) {
	    _c2 = _c1;
	    _c3 = _c1;
	    _c4 = _c1;
    }

	// leave translation until the last possible moment....  MJD
	var str = _str; 
	sl = this.Split_TextBlock(str, linewidth, thefont);

	// compute positions and steps
	var ang = RAD(_angle);
	var ss = Math.sin(ang);
	var cc = Math.cos(ang);

	var fontSize = thefont ? thefont.TextHeight('M') : 20;
	if (this.valign == 1)
		y = y - fontSize / 2.0;

	if (this.valign == 2)
		y = y - fontSize;
	
	if (linesep <= 0)
		linesep = fontSize;
	
	var xsep = ss * yscale * linesep;
	var ysep = cc * yscale * linesep;
	
	// if (linesep > 0)
	{
		if (this.valign == 1)
		{
			y = y -(((sl.length-1) * ysep) / 2.0);
			// x = x - ((sl.length * xsep) / 2.0);
		}

		if (this.valign == 2)
		{
			y = y - ((sl.length-1) * ysep);
			// x = x - (sl.length * xsep);
		}
	}


	// draw it
	if (!thefont)
	{
	    // runtime fonts, use normal canvas drawing....
		if ( !g_webGL )
		{
	        graphics.fillStyle = g_GlobalColour_HTML_RGBA;
	        graphics.globalAlpha = g_GlobalAlpha;
	        for (i = 0; i <= sl.length - 1; i++) {
	            var pStr = sl[i];
	            if (pStr != null) {
	                graphics.fillText(pStr, x, y + 13);
	                y = y + ysep;
	                x = x + xsep;
	            }
	        }
		}
		else
	    {
			if ( this.fontid != -1 )
				ErrorOnce( "Error: Runtime canvas fonts are not supported in WebGL." );
	    }
	}
	else
	{
	    for (i = 0; i <= sl.length - 1; i++)
		{
			xoff = 0;
			yoff = 0;

			if(thefont.ascenderOffset != undefined)
			{
				yoff -= thefont.ascenderOffset * yscale;
			}
			
			var pStr = sl[i]; 


			if (pStr != null)
			{				
			    if (this.halign == 1) xoff = -(xscale * thefont.TextWidth(pStr, true) / 2);
			    if (this.halign == 2) xoff = -(xscale * thefont.TextWidth(pStr, true));
				
				// Adjust offsets to allow for the (x,y) origin of sprite fonts
				if (thefont.spritefont) {
				    xoff -= (xscale * thefont.pSprites.xOrigin);
				    yoff -= (yscale * thefont.pSprites.yOrigin);
				}

				var xx = x + (cc * xoff) + (ss * yoff);
				var yy = y - (ss * xoff) + (cc * yoff);
				if (thefont.runtime_created)
				{
					if (thefont.spritefont)
					{
						if(!g_webGL)
						{
						    thefont.Draw_Sprite_String(xx, yy, pStr, xscale, yscale, _angle, _c1,_c2,_c3,_c4); //g_GlobalColour, g_GlobalAlpha);
						} else
						{
						    thefont.Draw_Sprite_String_GL(xx, yy, pStr, xscale, yscale, _angle, _c1, _c2, _c3, _c4); //g_GlobalColour, g_GlobalAlpha);
						}
					} else
					{
					    if (thefont.loaded) {
					        Graphics_DrawText(thefont.fontstyle, pStr, xx, yy, 1, 1, ang, _c1, _c2, _c3, _c4); //g_GlobalColour, g_GlobalAlpha);
						} // end if
					}
				} else
				{
					if (g_webGL)
					{
					    thefont.Draw_String_GL(xx, yy, pStr, xscale, yscale, _angle, _c1, _c2, _c3, _c4); // g_GlobalColour, g_GlobalAlpha);
					} else
					{
					    thefont.Draw_String(xx, yy, pStr, xscale, yscale, _angle, _c1, _c2, _c3, _c4); //g_GlobalColour, g_GlobalAlpha);
					}
				}
			}

			y = y + ysep;
			x = x + xsep;
		}
	}	
};


// #############################################################################################
/// Function:<summary>
///				Draws a stringlist in the current font at the given location using IDE drawing rules
///          </summary>
///
///	In:		 <param name="_sl">String list to print</param>
/// 		 <param name="_x">X coordinate</param>
///			 <param name="_y">Y coordinate</param>
///			 <param name="_charSpacing"></param>
///			 <param name="_clipLeft"></param>
///			 <param name="_clipRight"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyFontManager.prototype.GR_StringList_Draw_IDEstyle = function (_sl, _x, _y, _charSpacing, _clipLeft, _clipRight)
{
	if (_sl == null)
		return;

	var xscale = 1.0;
	var yscale = 1.0;
	var angle = 0.0;
	var sl = _sl;
	var i = 0;
	this.SetFont();
	var thefont = this.thefont;
	
	var col = g_GlobalColour | ((g_GlobalAlpha * 255.0) << 24);

	var worldMatrix = null;
	if(!g_webGL)
	{
		worldMatrix = g_Matrix[MATRIX_WORLD];

		angle = Math.atan2(worldMatrix.m[1], worldMatrix.m[0]) * (-180 / Math.PI);
        xscale = Math.sqrt((worldMatrix.m[0] * worldMatrix.m[0]) + (worldMatrix.m[1] * worldMatrix.m[1]));
        yscale = Math.sqrt((worldMatrix.m[4] * worldMatrix.m[4]) + (worldMatrix.m[5] * worldMatrix.m[5]));		
	}

	// draw it
	if (!thefont)
	{
	    // runtime fonts, use normal canvas drawing....
		if ( !g_webGL )
		{
	        graphics.fillStyle = g_GlobalColour_HTML_RGBA;
	        graphics.globalAlpha = g_GlobalAlpha;
	        for (i = 0; i <= sl.length - 1; i++) {
	            var pStr = sl[i].pString;
				var xoff = sl[i].x;
				var yoff = sl[i].y;

				var posvec = new Vector3(_x + xoff, _y + yoff + 13, 0);
				var transposvec = worldMatrix.TransformVec3(posvec);

	            if (pStr != null) {
	                graphics.fillText(pStr, transposvec.X, transposvec.Y);	                
	            }
	        }
		}
		else
	    {
			if ( this.fontid != -1 )
				ErrorOnce( "Error: Runtime canvas fonts are not supported in WebGL." );
	    }
	}
	else
	{
		var basey = _y;
		basey += thefont.max_glyph_height;

		if(thefont.ascenderOffset != undefined)
		{
			basey -= thefont.ascenderOffset;
		}

		if(thefont.ascender != undefined)
		{
			basey -= thefont.ascender;
		}

	    for (i = 0; i <= sl.length - 1; i++)
		{
			var pStr = sl[i].pString; 
			var xoff = sl[i].x;
			var yoff = sl[i].y;	
			var wordSpacing = sl[i].wordSpacing;		

			if (pStr != null)
			{							    				
				// Adjust offsets to allow for the (x,y) origin of sprite fonts
				if (thefont.spritefont) {
				    xoff -= (thefont.pSprites.xOrigin);
				    yoff -= (thefont.pSprites.yOrigin);
				}

				var xx = _x + xoff;
				var yy = basey + yoff;
			
				var transposvec = null;
				if (!g_webGL)
				{
					var posvec = new Vector3(xx, yy, 0);
					transposvec = worldMatrix.TransformVec3(posvec);
				}

				if (thefont.runtime_created)
				{
					if (thefont.spritefont)
					{
						if(!g_webGL)
						{
						    thefont.Draw_Sprite_String(transposvec.X, transposvec.Y, pStr, xscale, yscale, angle, col,col,col,col, _charSpacing, wordSpacing); //g_GlobalColour, g_GlobalAlpha);
						} else
						{
						    thefont.Draw_Sprite_String_GL(xx, yy, pStr, xscale, yscale, angle, col, col, col, col, _charSpacing, wordSpacing); //g_GlobalColour, g_GlobalAlpha);
						}
					} else
					{
					    if (thefont.loaded) {
					        Graphics_DrawText(thefont.fontstyle, pStr, xx, yy, 1, 1, angle, col, col, col, col); //g_GlobalColour, g_GlobalAlpha);
						} // end if
					}
				} else
				{
					if (g_webGL)
					{
					    thefont.Draw_String_GL(xx, yy, pStr, xscale, yscale, angle, col, col, col, col, _charSpacing, wordSpacing); // g_GlobalColour, g_GlobalAlpha);
					} else
					{
					    thefont.Draw_String(transposvec.X, transposvec.Y, pStr, xscale, yscale, angle, col, col, col, col, _charSpacing, wordSpacing); //g_GlobalColour, g_GlobalAlpha);
					}
				}
			}
		}
	}	
};



// #############################################################################################
/// Property: <summary>
///           	Work out the width/height of a block of text.
///           </summary>
// #############################################################################################
yyFontManager.prototype.GR_Text_Sizes = function (_str, x, y, linesep, linewidth) {

	g_ActualTextWidth = g_ActualTextHeight = 0;
	
	var sl = [];
	var i = 0;		
	this.SetFont();
	var thefont = this.thefont;

	if ( !thefont )
		return 1;
    				
	sl = this.Split_TextBlock(_str, linewidth, thefont);
	if (linesep < 0)  { 
	    linesep = thefont.TextHeight("M");
	}

	// Count it
	var pStr, w;
	if (sl.length > 0) 
	{
	    for (i = 0; i < sl.length - 1; i++) {
	    	pStr = sl[i];
	    	if (pStr != null) {
				w = thefont.TextWidth(pStr, true);
	    		if (g_ActualTextWidth < w) {
	    		    g_ActualTextWidth = w;
	    		}
	    	}
	    	g_ActualTextHeight += linesep;
	    }
	    g_ActualTextHeight += thefont.TextHeight("M");
	}
	
	pStr = sl[sl.length-1];
	w = thefont.TextWidth(pStr, true);
	if (g_ActualTextWidth < w) g_ActualTextWidth = w;	
};
