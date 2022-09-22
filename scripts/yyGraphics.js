// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyGraphics.js
// Created:         19/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     A set of global functions to control graphics. (no longer a class)
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 19/02/2011		V1.0		MJD		1st version
// 20/06/2011		V1.1		MJD		Removed all "class-ness" of it due to javascript speed issues - doesnt like with().
// 
// **********************************************************************************************************************

var	g_Canvas;
var g_Textures;
var	g_pTextureOffsets = null;

var g_DisplayWidth = 1024;
var g_DisplayHeight = 768;
var g_DisplayScaleX = 1;
var	g_DisplayScaleY = 1;


var	g_clipx = 0;
var	g_clipy = 0;
var	g_clipw = 0;
var	g_cliph = 0;
var	g_worldx = 0;
var	g_worldy = 0;
var	g_worldw = 0;
var	g_worldh = 0;
var	g_transform = [];
var g_GlobalFrameCount = 0;

var g_CacheWhite = 0xffffff;
var Graphics_TextureDrawSimple;
var Graphics_TextureDrawTiled;
var Graphics_SetViewPort;
var Graphics_SetViewArea;
var Graphics_SetTransform;
var Graphics_ClearScreen;
var Graphics_PushTransform;
var Graphics_PushMatrix;
var Graphics_DrawPart;
var Graphics_DrawComment;
var Graphics_StartFrame;
var Graphics_Restore;
var Graphics_Save;
var Graphics_SetViewAreaTransform;
var Graphics_TextureDraw;
var Graphics_EndFrame;
var Graphics_SWFDraw;
var Graphics_SWFDrawObject;
var Graphics_DrawText;
// whether to use texture interpolation in 2d context
var Graphics_Interpolation = true;



function    DisplayWidth(){ return g_DisplayWidth; }
function    DisplayHeight(){ return g_DisplayHeight; }

// #############################################################################################
/// Constructor: <summary>
///              	Add "our" canvas functions.
///					This helps obfuscation, and will shrink the code base.
///              </summary>
///
/// In:		<param name="_canvas">The canvas to "update"</param>
///
// #############################################################################################
function Graphics_AddCanvasFunctions(_graphics)
{
	if( !_graphics ) return;
	
	_graphics._transform = _graphics.transform;
	_graphics._setTransform = _graphics.setTransform;
	_graphics._save = _graphics.save;
	_graphics._restore = _graphics.restore;
	_graphics._fillRect = _graphics.fillRect;
	_graphics._strokeRect = _graphics.strokeRect;
	_graphics._beginPath = _graphics.beginPath;
	_graphics._arc = _graphics.arc;
	_graphics._stroke = _graphics.stroke;
	_graphics._closePath = _graphics.closePath;
	_graphics.lineWidth = _graphics.lineWidth;
	_graphics._moveTo = _graphics.moveTo;
	_graphics._lineTo = _graphics.lineTo;
	_graphics._fill = _graphics.fill;
	_graphics._drawImage = _graphics.drawImage;
	_graphics._getImageData = _graphics.getImageData;
	_graphics._createImageData = _graphics.createImageData;
	_graphics._putImageData = _graphics.putImageData;
	_graphics._clip = _graphics.clip;
	_graphics._rect = _graphics.rect;
	/*_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;
	_graphics._ = _graphics.;*/
}

// #############################################################################################
/// Function:<summary>
///             As far as possible, prevent anti-aliasing on a canvas context
///          </summary>
// #############################################################################################
function Graphics_SetInterpolation(_graphics, _enable) {
    if ((_graphics.imageSmoothingEnabled == _enable) &&
        (_graphics.msImageSmoothingEnabled == _enable))     // IE11-specific kludge - modifying some canvas parameters (i.e. the width) changes the interpolation state of the canvas rendering context :/
        return;
	//
    _graphics.imageSmoothingEnabled = _enable;
    _graphics.webkitImageSmoothingEnabled = _enable;
    _graphics.mozImageSmoothingEnabled = _enable;
    _graphics.msImageSmoothingEnabled = _enable;
    _graphics.oImageSmoothingEnabled = _enable;
    // Adaptation of old code, but there are no more browsers that are that broken:
    /*var pCanvas = _graphics.canvas;
    if (pCanvas) {
		var pStyle = pCanvas.style;
		pStyle.msInterpolationMode = (_enable ? "bicubic" : "nearest-neighbor");
		if (_enable) {
			pStyle.setProperty("image-rendering", "optimizeQuality");
		} else {
			pStyle.setProperty("image-rendering", "pixelated");
			if (pStyle.getPropertyValue("image-rendering") == "") {
				pStyle.setProperty("image-rendering", "optimizeSpeed");
			}
		}
	}*/
}
function Graphics_SetInterpolation_Auto(_graphics) {
	if (!g_webGL) Graphics_SetInterpolation(_graphics, Graphics_Interpolation);
}
function texture_set_interpolation(_linear) {
	_linear = _linear > 0.5;
	if (Graphics_Interpolation != _linear) {
		Graphics_Interpolation = _linear;
		// this here is graphics from Function_Surface.js, for clarity
		Graphics_SetInterpolation(graphics, _linear);
	}
}

// #############################################################################################
/// Function:<summary>
///             Main graphics code. globals "canvas" and "graphics" must have been initialised.
///          </summary>
// #############################################################################################
function    Graphics_Init( _canvas )
{
    g_Textures = [];
    g_pTextureOffsets = null;

	g_clipx = 0;
	g_clipy = 0;
	g_clipw = 0;
	g_cliph = 0;

	g_worldx = 0;
	g_worldy = 0;
	g_worldw = 0;
	g_worldh = 0;

	g_transform = [];
	g_transform[0] = 1;
	g_transform[1] = 0;
	g_transform[2] = 0;
	g_transform[3] = 0;
	g_transform[4] = 1;
	g_transform[5] = 0;

    if( !g_webGL ){


	    // Fill in RELEASE function pointers.
        if (CACHE_SINGLE_IMAGE)
        {
    	    Graphics_TextureDrawSimple = Graphics_TextureDrawSimple_Cache;
        } else
        {
    	    Graphics_TextureDrawSimple = Graphics_TextureDrawSimple_NoCache;
        }
        Graphics_TextureDrawTiled = Graphics_TextureDrawTiled_RELEASE;
        Graphics_TextureDraw = Graphics_TextureDraw_RELEASE;
        Graphics_SetViewPort = Graphics_SetViewPort_RELEASE;
        Graphics_SetViewArea = Graphics_SetViewArea_RELEASE;
        Graphics_SetViewAreaTransform = Graphics_SetViewAreaTransform_RELEASE;
        Graphics_SetTransform = Graphics_SetTransform_RELEASE;
        Graphics_ClearScreen = Graphics_ClearScreen_RELEASE;
        Graphics_PushTransform = Graphics_PushTransform_RELEASE;
        Graphics_PushMatrix = Graphics_PushMatrix_RELEASE;
        Graphics_DrawPart = Graphics_DrawPart_RELEASE;
        Graphics_Save = Graphics_Save_RELEASE;
        Graphics_Restore = Graphics_Restore_RELEASE;
        Graphics_DrawText = Graphics_DrawText_RELEASE;
        Graphics_StartFrame = Graphics_StartFrame_RELEASE;
        Graphics_EndFrame = Graphics_EndFrame_RELEASE;
        Graphics_DrawComment = Graphics_DrawComment_RELEASE;
        Graphics_SWFDraw = function () {};
		Graphics_SWFDrawObject = function () {};
		Graphics_Interpolation = !(g_pGMFile.Options && !g_pGMFile.Options.interpolatePixels);


	    // Fill in DEBUG function pointers.
        if(DEBUG_MODE)
        {
    	    if (CACHE_SINGLE_IMAGE)
    	    {
			    // Make the white value slightly OFF white, so it caches a white image as well...
    		    g_CacheWhite = 0x1ffffff;
    		    Graphics_TextureDrawSimple = Graphics_TextureDrawSimple_Cache_DEBUG;
    	    } else
    	    {
    		    Graphics_TextureDrawSimple = Graphics_TextureDrawSimple_NoCache_DEBUG;
    	    }
    	    Graphics_TextureDrawTiled = Graphics_TextureDrawTiled_RELEASE;
    	    Graphics_TextureDraw = Graphics_TextureDraw_DEBUG;
        } 
    }else{
        InitWebGLFunctions();
    }


    Graphics_SetViewPort(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
    Graphics_SetViewArea(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT,0);

    
}

var g_Graphics_Save_Stack = [];
var g_GraphicsCounter = 0;


// #############################################################################################
/// Function:<summary>
///          	Save graphics context
///          </summary>
// #############################################################################################
function Graphics_Save_RELEASE() {
    graphics._save();

    // keep track of save/restores. Should be 0 entries in the stack at the end of the draw
    g_Graphics_Save_Stack.push( 
        {
            counter: g_GraphicsCounter++,
            clipx : g_clipx,
            clipy: g_clipy,
            clipw: g_clipw,
            cliph: g_cliph
        }
        );       
}

// #############################################################################################
/// Function:<summary>
///          	Restore graphics context
///          </summary>
// #############################################################################################
function Graphics_Restore_RELEASE() {
    graphics._restore();

    // Pop last one off the stack
    var g = g_Graphics_Save_Stack.pop();
    g_clipx = g.clipx;
    g_clipy = g.clipy;
    g_clipw = g.clipw;
    g_cliph = g.cliph;
    --g_GraphicsCounter;
}

// #############################################################################################
/// Function:<summary>
///          	Setup caching entries for an individual texture offset object
///          </summary>
// #############################################################################################
function Graphics_SetupTPECaching(_pTPE) {

    _pTPE.cache = [];                       // clear colour cache
    _pTPE.count = 0;
    _pTPE.maxcache = 4;                     // Max number of times to cache this image.

    _pTPE.vh_tile = 0;                      // How is it tiled?
    _pTPE.hvcached = null;                  // tiling cache.

    _pTPE.singleimage = null;               // clear colour cache
    _pTPE.texture = g_Textures[_pTPE.tp];   // get raw pointe to texture.
}

// #############################################################################################
/// Function:<summary>
///          	Setup the texture offset array
///          </summary>
///
/// In:		<param name="_pTable">Pointer to the texture table</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function	Graphics_SetEntryTable(_pTable)
{
	g_pTextureOffsets = _pTable;    
    for (var i = 0; i < _pTable.length; i++)
    {
        var pTPE = _pTable[i];
        Graphics_SetupTPECaching(pTPE);
    }
}

// #############################################################################################
/// Function:<summary>
///          	Create a cacheblock
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyCacheBlock() 
{
	this.pImage = null;
	this.lastused = 0;
}

function Graphics_CacheBlock_Do(_texture, _pCacheObject, _x, _y, _w, _h, _colour) 
{
    var pCacheBlock = null;
    if (_pCacheObject.cache != undefined) {
	    pCacheBlock = _pCacheObject.cache[_colour];
	} // end if
	else {
	    _pCacheObject.cache = [];
	    _pCacheObject.maxcache = 4;
	    _pCacheObject.count = 0;
	} // end else

	if(pCacheBlock != null)
	{
		pCacheBlock.lastused = g_GlobalFrameCount;
		return pCacheBlock.pImage;	
	}
	
	var usetime = -9999999999;
	pCacheBlock = null;	
	if (_pCacheObject.count < _pCacheObject.maxcache)
	{
		pCacheBlock = new yyCacheBlock();
		_pCacheObject.count++;
	}
	else {	
	    // Eject the least recently used cache block
	    var FoundColour = -1;
		for (var i in _pCacheObject.cache)
		{
		    if (!_pCacheObject.cache.hasOwnProperty(i)) continue;
		
			var pBlock = _pCacheObject.cache[i];
			if (pBlock != null)
			{
				var t = g_GlobalFrameCount - pBlock.lastused;
				if (t > usetime)
				{
					FoundColour = i;
					pCacheBlock = pBlock;
					usetime = t;					
				}
			}
		}
		if (FoundColour >= 0) delete _pCacheObject.cache[FoundColour];		
	}

	_pCacheObject.cache[_colour] = pCacheBlock;
	pCacheBlock.lastused = g_GlobalFrameCount;
	pCacheBlock.pImage = Graphics_ColouriseImage(_texture, _x, _y, _w, _h, _colour);
	return pCacheBlock.pImage;
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_pTPE"></param>
///			<param name="_colour"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Graphics_CacheBlock(_pTPE, _colour) 
{
    return Graphics_CacheBlock_Do( _pTPE.texture, _pTPE, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, _colour );
}

// #############################################################################################
/// Function:<summary>
///             "Get" an offset
///          </summary>
// #############################################################################################
function    Graphics_GetTextureEntry( _index )
{
	return g_pTextureOffsets[_index];
}


// #############################################################################################
/// Function:<summary>
///          	Sets the current g_transform...
///          </summary>
// #############################################################################################
function Graphics_SetTransform_RELEASE() 
{
    graphics._setTransform(g_transform[0], g_transform[3], g_transform[1], g_transform[4], g_transform[2], g_transform[5]);
}


// #############################################################################################
/// Function:<summary>
///				Clear the region in the indicated color
///          </summary>
///
/// In:		 <param name="col">Colour to clear the screen with</param>
// #############################################################################################
function Graphics_ClearScreen_RELEASE(_col)
{
    Graphics_Save();

    var trans = [];
    trans[0] = 1;
    trans[1] = 0;
    trans[2] = 0;
    trans[3] = 1;
    trans[4] = 0;
    trans[5] = 0;
    graphics._setTransform(trans[0], trans[1], trans[2], trans[3], trans[4], trans[5]);

    graphics.fillStyle = GetHTMLRGB(_col|0xff000000);
	graphics._fillRect(g_clipx, g_clipy, g_clipw, g_cliph);
        
	Graphics_Restore();
}

// #############################################################################################
/// Function:<summary>
///          	This specifies the CLIP region, and is in screen pixels.
///          </summary>
///
/// In:		<param name="_portx"></param>
///			<param name="_porty"></param>
///			<param name="_portw"></param>
///			<param name="_porth"></param>
///				
// #############################################################################################
function Graphics_SetViewPort_RELEASE(_portx, _porty, _portw, _porth)
{
    g_clipx = _portx;
    g_clipy = _porty;
    g_clipw = _portw;
    g_cliph = _porth;

	if (g_isZeus)
	{

		if ((g_clipx === 0 && g_clipy === 0) && (g_clipw == graphics.canvas.width && g_cliph === graphics.canvas.height)) {
		} else {
			g_transform[0] = 1;
			g_transform[1] = 0;
			g_transform[2] = 0;
			g_transform[3] = 1;
			g_transform[4] = 0;
			g_transform[5] = 0;
			graphics._setTransform(g_transform[0], g_transform[1], g_transform[2], g_transform[3], g_transform[4], g_transform[5]);
		
			graphics.beginPath();
			graphics.moveTo(g_clipx, g_clipy);
			graphics.lineTo(g_clipx + g_clipw, g_clipy);
			graphics.lineTo(g_clipx + g_clipw, g_clipy + g_cliph);
			graphics.lineTo(g_clipx, g_clipy + g_cliph);
		
			// default android browsers has a bug with "clip"
			if (!(g_OSBrowser == BROWSER_DEFAULT_ANDROID && g_OSVersion==4.0))
			{
				graphics.clip();
			}
		}
	}
}



// #############################################################################################
/// Function:<summary>
///				Sets the correct view area in the world angle is the rotation
///				in degrees counter-clockwise
///          </summary>
///
/// In:		 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="w"></param>
///			 <param name="h"></param>
///			 <param name="angle"></param>
///				
// #############################################################################################
function GR_D3D_Set_View_Area(_x, _y, _w, _h, _angle) {

	var V1 = new Vector3((_x + _w / 2.0), (_y + _h / 2.0), -16000.0);
	var V2 = new Vector3((_x + _w / 2.0), (_y + _h / 2.0), 0.0);
	var V3 = new Vector3(Math.sin(-_angle * (Math.PI / 180.0)), Math.cos(-_angle * (Math.PI / 180.0)), 0.0);
	g_pView.LookAtLH(V1, V2, V3);

	g_pProjection.OrthoLH(_w, -_h * g_RenderTargetActive, 1.0, 32000.0);

}

// #############################################################################################
/// Function:<summary>
///          	Create a "full" matrix and use "push" it.
///          </summary>
///
/// In:		 <param name="_x">X location</param>
///			 <param name="_y">Y location</param>
///			 <param name="_xs">X scale</param>
///			 <param name="_ys">Y scale</param>
///			 <param name="_angle">angle in radians/</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Graphics_PushTransform_RELEASE( _x,_y, _xs,_ys, _angle ) 
{
	var trans = [];

    trans[0] = Math.cos(_angle);
    trans[3] = Math.sin(_angle);
    trans[1] = -trans[3];
    trans[4] = trans[0];

    trans[0] *= _xs;
    trans[3] *= _xs;

    trans[1] *= _ys;
    trans[4] *= _ys;

    trans[2] = _x;
    trans[5] = _y;

    graphics._transform( trans[0], trans[3], trans[1], trans[4], trans[2], trans[5] );
}

function Graphics_PushMatrix_RELEASE(_matrix)
{
    graphics._transform(_matrix.m[0], _matrix.m[1], _matrix.m[4], _matrix.m[5], _matrix.m[12], _matrix.m[13]);
}

function Graphics_SetViewAreaTransform_RELEASE(_sx, _sy, _tx, _ty) 
{
    if ((g_clipx === 0 && g_clipy === 0) && (g_clipw == graphics.canvas.width && g_cliph === graphics.canvas.height)) {
    } else {
        //set clip region
        g_transform[0] = 1;
        g_transform[1] = 0;
        g_transform[2] = 0;
        g_transform[3] = 1;
        g_transform[4] = 0;
        g_transform[5] = 0;
        graphics._setTransform(g_transform[0], g_transform[1], g_transform[2], g_transform[3], g_transform[4], g_transform[5]);

        //    graphics.beginPath();
        //graphics._rect(0, 0, 255, 255); //g_clipx, g_clipy, g_clipw, g_cliph);
        graphics.moveTo(g_clipx, g_clipy);
        graphics.lineTo(g_clipx + g_clipw, g_clipy);
        graphics.lineTo(g_clipx + g_clipw, g_clipy + g_cliph);
        graphics.lineTo(g_clipx, g_clipy + g_cliph);
        //graphics.lineTo(g_clipx, g_clipy);
        //graphics._closePath();
        //    graphics.rect(g_clipx, g_clipy, g_clipx + g_clipw, g_clipy + g_cliph);
        //    graphics.stroke();

        // default android browsers has a bug with "clip"
        if (!(g_OSBrowser == BROWSER_DEFAULT_ANDROID && g_OSVersion == 4.0)) {
            graphics.clip();
        }
    }    
    //set view transform
    g_transform[0] = _sx;
    g_transform[1] = 0;
    g_transform[2] = _tx;

    g_transform[3] = 0;
    g_transform[4] = _sy;
    g_transform[5] = _ty;
    graphics._setTransform(g_transform[0], g_transform[3], g_transform[1], g_transform[4], g_transform[2], g_transform[5]);
}

// #############################################################################################
/// Function:<summary>
///          	Specify a "region" to look at in the world.
///          </summary>
///
/// In:		<param name="_wolrdx"></param>
///			<param name="_worldy"></param>
///			<param name="_worldw"></param>
///			<param name="_worldh"></param>
///				
// #############################################################################################
function Graphics_SetViewArea_RELEASE(_worldx, _worldy, _worldw, _worldh, _angle) 
{
    if ((g_clipx === 0 && g_clipy === 0) && (g_clipw == graphics.canvas.width && g_cliph === graphics.canvas.height)) {
    } else {
        g_transform[0] = 1;
        g_transform[1] = 0;
        g_transform[2] = 0;
        g_transform[3] = 1;
        g_transform[4] = 0;
        g_transform[5] = 0;
        graphics._setTransform(g_transform[0], g_transform[1], g_transform[2], g_transform[3], g_transform[4], g_transform[5]);
    
        graphics.beginPath();
        graphics.moveTo(g_clipx, g_clipy);
        graphics.lineTo(g_clipx + g_clipw, g_clipy);
        graphics.lineTo(g_clipx + g_clipw, g_clipy + g_cliph);
        graphics.lineTo(g_clipx, g_clipy + g_cliph);
    
    	// default android browsers has a bug with "clip"
        if (!(g_OSBrowser == BROWSER_DEFAULT_ANDROID && g_OSVersion==4.0))
        {
            graphics.clip();
        }
    }
    
 
    var w = g_clipw / _worldw;
    var h = g_cliph / _worldh;

    g_worldx = _worldx;
    g_worldy = _worldy;
    g_worldw = _worldw;
    g_worldh = _worldh;


    g_transform[0] = w;
    g_transform[1] = 0;
    g_transform[2] = -(_worldx * w) + g_clipx;

    g_transform[3] = 0;
    g_transform[4] = h;
    g_transform[5] = -(_worldy * h) + g_clipy;

    graphics._setTransform(g_transform[0], g_transform[3], g_transform[1], g_transform[4], g_transform[2], g_transform[5]);

}





// #############################################################################################
/// Function:<summary>
///             Add a texture to the "pool"
///          </summary>
///
/// In:		 <param name="_name">Name+path of texture to load</param>
/// Out:	 <returns>
///				The index it's assigned to.
///			 </returns>
// #############################################################################################
function    Graphics_AddTexture( _name )
{
	var i = g_Textures.length;
	var texture = new Image();
	_name = CheckWorkingDirectory(_name);
	texture.crossOrigin = g_HttpRequestCrossOriginType;
	texture.src = set_load_location(null,null,_name);
    g_Textures[i] = texture;
    return i;
}

function    Graphics_AddTextureWH( _width, _height )
{
    var c = document.createElement( "canvas" );
    c.width = _width;
    c.height = _height;
	var i = g_Textures.length;
	var texture = new Image(_width, _height);
	texture.src = set_load_location(null,null,c.toDataURL());
    g_Textures[i] = texture;
    return i;
}

function 	Graphics_AddActualTexture( _image )
{
	var i = g_Textures.length;
    g_Textures[i] = _image;
    return i;
}

// #############################################################################################
/// Function:<summary>
///             Add a texture to the "pool"
///          </summary>
///
/// In:		 <param name="_name">Name+path of texture to load</param>
/// Out:	 <returns>
///				The index it's assigned to.
///			 </returns>
// #############################################################################################
function Graphics_UpdateTexture(  _texture, _x, _y, _w,_h,_canvas )
{
    var context = _texture.getContext('2d');
    context.globalCompositeOperation = 'copy';
    context.drawImage( _canvas, _x, _y );
} 

// #############################################################################################
/// Function:<summary>
///             Adds an IMAGE to the texture pool.
///          </summary>
///
/// In:		 <param name="_pImage">dynamically created image to add</param>
/// Out:	 <returns>
///				The "index" it's assigned to.
///			 </returns>
// #############################################################################################
function Graphics_AddImage(_pImage) 
{
	var i = g_Textures.length;
	g_Textures[i] = _pImage;
	return i;
}


// #############################################################################################
/// Function:<summary>
///             Begin rendering
///          </summary>
// #############################################################################################
function Graphics_StartFrame_RELEASE()
{
	g_GlobalFrameCount++;
}

// #############################################################################################
/// Function:<summary>
///             End rendering
///          </summary>
// #############################################################################################
function Graphics_EndFrame_RELEASE()
{

}


// #############################################################################################
/// Function:<summary>
///          	Extract and image from a texture page into it's "own" single image.
///          </summary>
///
/// In:		<param name="_pTPE">Texture page entry to extract</param>
/// Out:	<returns>
///				A "singleimage" to use.
///			</returns>
// #############################################################################################
function    Graphics_ExtractImage(_pTPE)
{
    var singleimage = document.createElement(g_CanvasName);
    var pImg = singleimage.getContext('2d');   
    Graphics_AddCanvasFunctions(pImg);
    // TODO: use Graphics_DisableInterpolation(pImg);

    singleimage.width = _pTPE.w;
    singleimage.height = _pTPE.h;
    pImg._drawImage(_pTPE.texture, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, 0, 0, _pTPE.w, _pTPE.h);
    
    singleimage.complete = true;    
    return singleimage;
}



// #############################################################################################
/// Function:<summary>
///          	Extract and image into a RAW byte array (ARGB format)
///          </summary>
///
/// In:		<param name="_pTPE">Texture page entry to extract</param>
/// Out:	<returns>
///				A "singleimage" to use.
///			</returns>
// #############################################################################################
function Graphics_ExtractImageBytes(_pTPE) {

	// First allocate and fill the TOTAL size of the original image.
	var pData = [];
	var tot = _pTPE.ow * _pTPE.oh * 4;
	var pSrcData;
	for(var i=0;i<tot;i++) pData[i]=0;

	if (_pTPE.texture.webgl_textureid)
	    pSrcData = g_webGL.ExtractWebGLPixels(_pTPE);
	else
	{
		var singleimage = document.createElement(g_CanvasName);
		var pImg = singleimage.getContext('2d');
		Graphics_AddCanvasFunctions(pImg);
		// TODO: use Graphics_DisableInterpolation(pImg);


		singleimage.width = _pTPE.w;
		singleimage.height = _pTPE.h;
		pImg._drawImage(_pTPE.texture, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, 0, 0, _pTPE.w, _pTPE.h);
		singleimage.complete = true;


		var data, sdata, imagedata, ddata;

		// This function cannot be called if the image is not from the same domain. You'll get security error if you do. ?!?!?
		try
		{
			data = pImg.getImageData(0, 0, _pTPE.w, _pTPE.h);
		} catch (ex)
		{
			return pData;
		}
		pSrcData = data.data;
	}

	var baseindex = (_pTPE.XOffset + (_pTPE.YOffset * _pTPE.ow)) * 4;
	var ww = _pTPE.w * 4;
	var x, y;
	for (y = 0; y < _pTPE.h; y++)
	{
		var bindex = baseindex;
		var imageindex = y*ww;
		for (x = 0; x < ww; x++)
		{
			pData[bindex++] = pSrcData[imageindex++];
		}
		baseindex += _pTPE.ow*4;
	}

	return pData;
}

// #############################################################################################
/// Function:<summary>
///             Draw a simple texture map
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="pTPE"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Graphics_TextureDrawSimple_Cache(_pTPE, _x, _y, _alpha) 
{
	// Need these checks here in case "dynamic loading" has forced an unload of the image.
    if (!_pTPE) return;
    if (!_pTPE.texture) return;
	if (!_pTPE.texture.complete) return;
	if (_pTPE.singleimage == null) _pTPE.singleimage = Graphics_ExtractImage(_pTPE);
	
	_x += _pTPE.XOffset;
	_y += _pTPE.YOffset;
	graphics.globalAlpha = _alpha;

	graphics._drawImage(_pTPE.singleimage, ~ ~_x, ~~_y);
}

// Cache the image - debug mode
function Graphics_TextureDrawSimple_Cache_DEBUG(_pTPE, _x, _y, _alpha)
{
	Graphics_TextureDrawSimple_Cache(_pTPE, _x, _y, _alpha);
}


// Non-cached, release mode
function Graphics_TextureDrawSimple_NoCache(_pTPE, _x, _y, _alpha) 
{
	// Need these checks here in case "dynamic loading" has forced an unload of the image.
    if (!_pTPE) return;
    if (!_pTPE.texture) return;
	if (!_pTPE.texture.complete) return;
	graphics.globalAlpha = _alpha;
	graphics._drawImage(_pTPE.texture, ~ ~_pTPE.x, ~ ~_pTPE.y, _pTPE.w, _pTPE.h, Math.floor(_x) + _pTPE.XOffset, Math.floor(_y) + _pTPE.YOffset, _pTPE.CropWidth, _pTPE.CropHeight);
}

// No cached, debug mode
function Graphics_TextureDrawSimple_NoCache_DEBUG(_pTPE, _x, _y, _alpha) 
{
	Graphics_TextureDrawSimple_NoCache(_pTPE, _x, _y, _alpha);
}

// https://developer.apple.com/library/safari/documentation/appleapplications/reference/safariwebcontent/creatingcontentforsafarioniphone/creatingcontentforsafarioniphone.html
// #############################################################################################
/// Function:<summary>             
///             1) The iOS Safari browser (and others on iOS, seemingly) has an upper limit on 
///             Images of 3 * 1024 * 1024 for devices with <256MB of RAM and 5 * 1024 * 1024 for 
///             devices with >256MB of RAM. When a canvas is used that's larger than this there 
///             won't be any exceptions thrown, it'll just carry on oblivious and simply not 
///             draw anything to the canvas. Therefore we can just try drawing to the canvas
///             and retrieve the data to see if it succeeded and if not.
///             2) SurfaceRT (Win8(JS)) machines seem only capable of <= 2048x2048 canvases. 
///             However, they will let you try and work with one bigger and all that happens is 
///             that if you draw outwith the size limit then nothing gets drawn, so if you try to 
///             use this canvas as a texture there will be big blank spaces past the 2048 limit. 
///             The only way to find out if the canvas size in use is too large is by trying to 
///             explicitly draw the full buffer  width/height somewhere to get it to trip an 
///             "IndexSizeError" exception.
///          </summary>
// #############################################################################################
function    Graphics_CanvasSizeSupported( _canvas ) {

    // Win8(JS) approach    
    try {
        graphics._drawImage(_canvas, 0, 0, _canvas.width, _canvas.height, canvas.width, canvas.height, 0, 0);        
    }
    catch (e) {
        return false;
    }

    // iOS approach
    var ctx = _canvas.getContext('2d');
    ctx.fillStyle = "white";            
    ctx.fillRect(0, 0, 1, 1);
    var imgData = ctx.getImageData(0, 0, 1, 1);
    return (imgData.data[0] === 255);
}

// #############################################################################################
/// Function:<summary>
///             Draw a texture tiled across the screen. This creates a "cache" of the large image
///				to save drawing it many times.
///             NB: Because of speed issues, the non-WebGL version of this explicitly ignores the
///             scaling values.
///          </summary>
// #############################################################################################
function	Graphics_TextureDrawTiled_RELEASE( _pTPE, _x, _y, _xsc, _ysc, vtile, htile, _col, _alpha ) {

	var pTexture = _pTPE.texture;

	if (!pTexture) return;
	if (!pTexture.complete) return;

	// Loaded yet?
	if (_pTPE.w == 0 || _pTPE.h == 0) return;


    var i = 0;
    if( vtile ) i = 1;
    if( htile ) i |= 2; 


    // tiled?        
    if (i === 0)
    {
    	graphics.globalAlpha = _alpha;
    	graphics._drawImage(pTexture, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, _x + _pTPE.XOffset, _y + _pTPE.YOffset, (_pTPE.CropWidth * _xsc), (_pTPE.CropHeight * _ysc));
        return;
    }            
        
	var w = _pTPE.ow;
	var h = _pTPE.oh;
	if (htile)
	{
		w = (((((g_pCurrentView.worldw + (_pTPE.ow - 1)) / _pTPE.ow) & 0xffffffff) + 2) * _pTPE.ow);						
		//_x = g_worldx + (~~((_x - g_worldx) % _pTPE.ow) - _pTPE.ow);		
		_x = g_worldx + (((_x - g_worldx) % _pTPE.ow) - _pTPE.ow);		
	}
	if (vtile)
	{
		h = (((((g_pCurrentView.worldh + (_pTPE.oh - 1)) / _pTPE.oh) & 0xffffffff) + 2) * _pTPE.oh);		
		//_y = g_worldy + (~~((_y - g_worldy) % _pTPE.oh) - _pTPE.oh);
		_y = g_worldy + (((_y - g_worldy) % _pTPE.oh) - _pTPE.oh);
	}
    
	if ((_pTPE.hvcached != null) && (_pTPE.hvcached.width < (w * _pTPE.hvcachedScale) || _pTPE.hvcached.height < (h * _pTPE.hvcachedScale)))
    {
        _pTPE.hvcached = null;
        _pTPE.vh_til = 0;
    }
    
   
    // How is it tiled? 
    if ((_pTPE.vh_tile != i) || (!_pTPE.hvcached)) {    
    
        _pTPE.vh_tile = i;

        var buffer = document.createElement(g_CanvasName);
        var pImg = buffer.getContext('2d');
        Graphics_AddCanvasFunctions(pImg);
        // TODO: use Graphics_DisableInterpolation(pImg);

        //try {            
            buffer.width = w;
            buffer.height = h;
            
            // Not sure why this is here...
            graphics.globalAlpha = 1;
            
            // Compensate for situations where the optimisation will fail due to excessive canvas sizes
            var canvasScale = 1;
            while ((Graphics_CanvasSizeSupported(buffer) === false) && 
                   (buffer.width >= 64) && 
                   (buffer.height >= 64)) 
            {
                debug("WARNING: Tiled image quality reduction");
                buffer.width /= 2;
                buffer.height /= 2;
                canvasScale /= 2;
            }
            
            var sx = _pTPE.x;
            var sy = _pTPE.y;
            if(_col != g_CacheWhite)
            {
    	        pTexture = Graphics_CacheBlock(_pTPE, _col); 
    	        sx=0;
    	        sy=0;
    	    }

            var cx = w / _pTPE.ow;
            var cy = h / _pTPE.oh;
            for (var y = 0; y < cy; y++) {
                for (var x = 0; x < cx; x++) {                    
                    pImg._drawImage(
                        pTexture,
                        sx,//_pTPE.x,
                        sy,//_pTPE.y,
                        _pTPE.w,
                        _pTPE.h,
                        _pTPE.XOffset + ((x * _pTPE.ow) * canvasScale),
                        _pTPE.YOffset + ((y * _pTPE.oh) * canvasScale),
                        _pTPE.CropWidth * canvasScale,
                        _pTPE.CropHeight * canvasScale);
                }
            }
            _pTPE.hvcachedScale = canvasScale;
        //}
        //catch (e) {
        //    alert("Tiled image failed " + e.message);
        //}

        _pTPE.hvcached = buffer;        
    }    
    graphics.globalAlpha = _alpha;    
    graphics._drawImage(_pTPE.hvcached, _x, _y, _pTPE.hvcached.width / _pTPE.hvcachedScale, _pTPE.hvcached.height / _pTPE.hvcachedScale);
    // graphics._drawImage(_pTPE.hvcached, _x, _y);
}



// #############################################################################################
/// Function:<summary>
///             Draws the texture
///          </summary>
///
/// In:		 <param name="pTPE">Texture page entry</param>
///			 <param name="xorig">The X origin of the texture</param>
///			 <param name="yorig">The Y origin of the texture</param>
///			 <param name="x">the X position to put the origin at</param>
///			 <param name="y">the X position to put the origin at</param>
///			 <param name="xsc">X Scale are the scale factor in x- and y- direction</param>
///			 <param name="ysc">Y Scale are the scale factor in x- and y- direction</param>
///			 <param name="rot">rot is the rotation angle (counterclockwise in radians)</param>
///			 <param name="col">col is the blend color</param>
///			 <param name="_alpha">alpha is the alpha transparency value (0-1)</param>
///				
// #############################################################################################
function Graphics_TextureDraw_RELEASE(_pTPE, _xorig, _yorig, _x, _y, _xsc, _ysc, _rot, _col1, _col2, _col3, _col4, _alpha) {

	// Need these checks here in case "dynamic loading" has forced an unload of the image.
	if (!_pTPE.texture) return;
	if (!_pTPE.texture.complete) return;

	// If we scaled down to almost 0, OR have an ALPHA of almost 0.... don't bother.
	if ((abs(_xsc) <= 0.0001) || (abs(_ysc) <= 0.0001) || (_alpha<=0)) { return; }

    _col1 &= 0xffffff;

    var ox = -(_xorig-_pTPE.XOffset);
    var oy = -(_yorig-_pTPE.YOffset);

    // If coloured, then cache a "colourised" version
    var la = graphics.globalAlpha;
    graphics.globalAlpha = _alpha;
            
    if (_col1 != g_CacheWhite)
    {
    	var cached_image = Graphics_CacheBlock(_pTPE, _col1);
    	var r = Math.abs(_rot);    		
    	if ((r < 0.0001) && (_xsc == 1) && (_ysc == 1) && (_pTPE.w === _pTPE.CropWidth) && (_pTPE.h === _pTPE.CropHeight)) {
    	
    		graphics._drawImage(cached_image, _x+ox, _y+oy);    		
    	} 
    	else {    	
			// When doing negative scales, or rotation - use a matrix    	    
    	    if ((_xsc < 0) || (_ysc < 0) || (r > 0.0001)) {
    	    
    			Graphics_PushTransform(_x, _y, _xsc, _ysc, -_rot);
    			graphics._drawImage(cached_image, 0, 0, _pTPE.w, _pTPE.h, ox, oy, _pTPE.CropWidth, _pTPE.CropHeight);
    			Graphics_SetTransform();
    		}
    		else {
				// otherwise, draw faster
    			graphics._drawImage(cached_image, 0, 0, _pTPE.w, _pTPE.h, _x + (ox * _xsc), _y + (oy * _ysc), _pTPE.CropWidth * _xsc, _pTPE.CropHeight * _ysc);
    		}
    	}
    } 
    else {
    
		var r = Math.abs(_rot);
    	if ((r < 0.0001) && (_xsc == 1) && (_ysc == 1) && (_pTPE.w === _pTPE.CropWidth) && (_pTPE.h === _pTPE.CropHeight))
    	{    	
    		if (_pTPE.singleimage == null) {
    		    _pTPE.singleimage = Graphics_ExtractImage(_pTPE);
    		}
    		graphics._drawImage(_pTPE.singleimage, _x + ox, _y + oy);    		
    	}
    	else {
    		// When doing negative scales, or rotation - use a matrix
    		if (_xsc < 0 || _ysc < 0 || r > 0.001) {
    		
    			Graphics_PushTransform(_x, _y, _xsc, _ysc, -_rot);
    			graphics._drawImage(_pTPE.texture, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, ox, oy, _pTPE.CropWidth, _pTPE.CropHeight);
    			Graphics_SetTransform();
    		}
    		else {
    			// otherwise, draw faster
    			graphics._drawImage(_pTPE.texture, _pTPE.x, _pTPE.y, _pTPE.w, _pTPE.h, _x + (ox * _xsc), _y + (oy * _ysc), _pTPE.CropWidth * _xsc, _pTPE.CropHeight * _ysc);
    		}
    	}
    }
    graphics.globalAlpha = la;
}

// #############################################################################################
/// Function:<summary>
///             Draws the texture, debug version
///          </summary>
// #############################################################################################
function    Graphics_TextureDraw_DEBUG( _pTPE, _xorig, _yorig, _x, _y, _xsc, _ysc, _rot, _col1,_col2,_col3,_col4, _alpha)
{
	try
	{
	    Graphics_TextureDraw_RELEASE(_pTPE.texture, _xorig, _yorig, _x, _y, _xsc, _ysc, _rot, _col1,_col2,_col3,_col4, _alpha);
	}
	catch (ex)
	{
		debug("error drawing image");
	} 
}

	
	
// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_pTPE"></param>
///			 <param name="_col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    Graphics_ColouriseImage( _texture, _x, _y, _w, _h, _col )
{
    var buffer = document.createElement(g_CanvasName);
    var pImg = buffer.getContext('2d');
    Graphics_AddCanvasFunctions(pImg); 			// update for OUR functions.
    // TODO: use Graphics_DisableInterpolation(pImg);
        
    buffer.width = _w; 
    buffer.height = _h; 
    pImg._drawImage( _texture,  _x, _y,_w,_h,   0,0,_w,_h);

    if (~~_col != 0xffffff)
    {
    	var data, sdata, imagedata, ddata;
		data = pImg._getImageData(0, 0, buffer.width, buffer.height);
    	sdata = data.data;

    	var imageData = pImg._createImageData(buffer.width, buffer.height);
    	ddata = imageData.data;

    	var r = ((_col >> 16) & 0xff) / 255;
    	var g = ((_col >> 8) & 0xff) / 255;
    	var b = (_col & 0xff) / 255;
    	var total = (data.height * data.width * 4);
    	for (var i = total - 4; i >= 0; i -= 4)
    	{
    		ddata[i] = (sdata[i] * r) | 0;
    		ddata[i + 1] = (sdata[i + 1] * g) | 0;
    		ddata[i + 2] = (sdata[i + 2] * b) | 0;
    		ddata[i + 3] = (sdata[i + 3]);
    	}
    	imageData.data = ddata;
    	pImg._putImageData(imageData, 0, 0);
    }
    return buffer;
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="pTPE"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Graphics_TextureDrawPos(_pTPE, _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _alpha) {

	var pTexture = _pTPE.texture;

	if (!pTexture) return;
	if (!pTexture.complete) return;

	graphics.globalAlpha = _alpha;
	drawTexturedTriangle(pTexture, _x1, _y1, _x2, _y2, _x3, _y3, _pTPE.x, _pTPE.y, _pTPE.x + _pTPE.w, _pTPE.y, _pTPE.x + _pTPE.w, _pTPE.y + _pTPE.h);
	drawTexturedTriangle(pTexture, _x3, _y3, _x4, _y4, _x1, _y1, _pTPE.x + _pTPE.w, _pTPE.y + _pTPE.h, _pTPE.x, _pTPE.y + _pTPE.h, _pTPE.x, _pTPE.y);
}


// #############################################################################################
/// Function:<summary>
///          	Draw a textured triangle...Slow, use with care.
///          </summary>
///
/// In:		<param name="im"></param>
///			<param name="x0"></param>
///			<param name="y0"></param>
///			<param name="x1"></param>
///			<param name="y1"></param>
///			<param name="x2"></param>
///			<param name="y2"></param>
///			<param name="sx0"></param>
///			<param name="sy0"></param>
///			<param name="sx1"></param>
///			<param name="sy1"></param>
///			<param name="sx2"></param>
///			<param name="sy2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function drawTexturedTriangle(im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) 
{
    Graphics_Save();

	// Clip the output to the on-screen triangle boundaries.
	graphics._beginPath();
	graphics._moveTo(x0, y0);
	graphics._lineTo(x1, y1);
	graphics._lineTo(x2, y2);
	graphics._closePath();
	//graphics.stroke();//xxxxxxx for wireframe
	graphics._clip();

	/*
	graphics.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

	The context matrix is:

	[ m11 m21 dx ]
	[ m12 m22 dy ]
	[  0   0   1 ]

	Coords are column vectors with a 1 in the z coord, so the transform is:
	x_out = m11 * x + m21 * y + dx;
	y_out = m12 * x + m22 * y + dy;

	From Maxima, these are the transform values that map the source
	coords to the dest coords:

	sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
	[m11 = - -----------------------------------------------------,
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

	sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
	m12 = -----------------------------------------------------,
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

	sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
	m21 = -----------------------------------------------------,
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

	sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
	m22 = - -----------------------------------------------------,
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

	sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
	dx = ----------------------------------------------------------------------,
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

	sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
	dy = ----------------------------------------------------------------------]
	sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	*/

	// TODO: eliminate common subexpressions.
	var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
	if (denom == 0) return;

	//denom = 1.0 / denom;
	var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
	var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
	var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
	var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
	var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
	var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

	graphics._transform(m11, m12, m21, m22, dx, dy);

	// Draw the whole image.  Transform and clip will map it onto the
	// correct output triangle.
	//
	// TODO: figure out if drawImage goes faster if we specify the rectangle that
	// bounds the source coords.
	graphics._drawImage(im, 0, 0);
	Graphics_Restore();
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="pTPE"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Graphics_DrawPart_RELEASE(_pTPE, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _color, _alpha)
{
	if (!_pTPE) return;
	if (!_pTPE.texture) return;
	if (!_pTPE.texture.complete) return;

	_color &= 0xffffff;
	graphics.globalAlpha = _alpha;
	
	// CLIP the drawing area.
	if (_left < _pTPE.XOffset)
	{
		var off = _pTPE.XOffset - _left;
		_x += off * _xscale;
		_width -= off;
		_left = 0;
	} else
	{
		_left -= _pTPE.XOffset;
		//_width -= _pTPE.XOffset; //?
	}


	if (_top < _pTPE.YOffset)
	{
		var off = _pTPE.YOffset - _top;
		_y += off * _yscale; 	
		_height -= off;
		_top = 0;
	} else
	{
		_top -= _pTPE.YOffset;
		//_height -= _pTPE.YOffset; //?
	}

	if (_width > (_pTPE.CropWidth - _left )) _width = _pTPE.CropWidth - _left;
	if (_height > (_pTPE.CropHeight - _top)) _height = _pTPE.CropHeight - _top;
	if (_width <= 0 || _height <= 0) return;

	_x = ~ ~_x;
	_y = ~ ~_y;
    
	if (_color != g_CacheWhite) {    
		var cached_image = Graphics_CacheBlock(_pTPE, _color);
		if (_xscale < 0 || _yscale < 0) {
    	    Graphics_PushTransform(_x, _y, _xscale, _yscale, 0);
		    graphics._drawImage(cached_image, _left, _top, _width, _height, 0, 0, _width, _height);
		    Graphics_SetTransform();
		}
		else {
		    graphics._drawImage(cached_image, _left, _top, _width, _height, _x, _y, _width * _xscale, _height * _yscale);
		}
	}	
	else {		
	    if (_xscale < 0 || _yscale < 0) {
    	    Graphics_PushTransform(_x, _y, _xscale, _yscale, 0);
		    graphics._drawImage(_pTPE.texture, _left + _pTPE.x, _top + _pTPE.y, _width, _height, 0, 0, _width, _height);
		    Graphics_SetTransform();
		}
		else {
		    graphics._drawImage(_pTPE.texture, _left + _pTPE.x, _top + _pTPE.y, _width, _height, _x, _y, _width * _xscale, _height * _yscale);	    
		}	    
	}	
}



// #############################################################################################
/// Function:<summary>
///          	Draw a texture to "fit" a size
///          </summary>
///
/// In:		<param name="_pTPE"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Graphics_DrawStretchedExt(_pTPE, _x,_y,_w,_h,_color,_alpha) {
	if (!_pTPE) return;
	if (!_pTPE.texture) return;
	if ((_pTPE.texture instanceof HTMLImageElement)
    && (!_pTPE.texture.complete)) return;

	_x = ~ ~_x;
	_y = ~ ~_y;

	var sx = _w / _pTPE.ow;
	var sy = _h / _pTPE.oh;
	Graphics_TextureDraw(_pTPE, 0, 0, _x, _y, sx, sy, 0, _color, _color, _color, _color, _alpha);
}


// #############################################################################################
/// Function:<summary>
///          	General draw function. 
///          </summary>
///
/// In:		<param name="_pTPE"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_rot"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Graphics_DrawGeneral(_pTPE, _left,_top,_width,_height,    _x,_y,_xscale,_yscale,  _rot,  _c1,_c2,_c3,_c4,  _alpha) 
{
	if (!_pTPE) return;
	if (!_pTPE.texture) return;
	if (!_pTPE.texture.complete) return;

/*
	// CLIP the drawing area.
	if (_left < _pTPE.XOffset) {
	
		var off = _pTPE.XOffset - _left;
		_x += off;
		_width -= off;
		_left = 0;
	} 
	else {		
		var off = _pTPE.XOffset;
		_left -= off;		
	}


	if (_top < _pTPE.YOffset) {
		var off = _pTPE.YOffset - _top;
		_y += off;
		_height -= off;
		_top = 0;
	} 
	else {		
		var off = _pTPE.YOffset;
		_top -= off;		
	}

	if (_width > (_pTPE.CropWidth - _left - _pTPE.XOffset)) {
	    _width = _pTPE.CropWidth - _left - _pTPE.XOffset;
	}
	if (_height > (_pTPE.CropHeight - _top - _pTPE.YOffset)) {
	    _height = _pTPE.CropHeight - _top - _pTPE.YOffset;
	}
	if (_width <= 0 || _height <= 0) {
	    return;
	}

	g_pTempTPE.x = _left + _pTPE.x;
	g_pTempTPE.y = _top + _pTPE.y;
	g_pTempTPE.w = _width;
	g_pTempTPE.h = _height;
	g_pTempTPE.XOffset = 0;
	g_pTempTPE.YOffset = 0;
	g_pTempTPE.CropWidth = g_pTempTPE.w;
	g_pTempTPE.CropHeight = g_pTempTPE.h;
	g_pTempTPE.ow = g_pTempTPE.w;
	g_pTempTPE.oh = g_pTempTPE.h;
	g_pTempTPE.tp = _pTPE.tp;
	g_pTempTPE.texture = _pTPE.texture;

	// Add cache details	
	g_pTempTPE.cache = [];					// clear colour cache
	g_pTempTPE.count = 0;
	g_pTempTPE.maxcache = 1; 				// Max number of times to cache this image.

	// Add "tiling" cache details
	g_pTempTPE.vh_tile = 0;					// How is it tiled?
	g_pTempTPE.hvcached = null;				// tiling cache.

	//  Surfaces ""ARE"" single images....
	g_pTempTPE.singleimage = null;

	_x = ~ ~_x;
	_y = ~ ~_y;
    */

	Graphics_TextureDraw(_pTPE, _left, _top, _x, _y, _xscale, _yscale, _rot, _c1, _c2, _c3, _c4, _alpha); 	// only draws with ONE colour!
}

// #############################################################################################
/// Function:<summary>
///          	Copy the image pSrc into the ALPHA channel of pDest. Copies the image. 
///				The original image is "forgotten"
///          </summary>
///
/// In:		<param name="_pDest"></param>
///			<param name="_pDestTPE"></param>
///			<param name="_pSrc"></param>
///			<param name="_pSrcTPE"></param>
/// Out:	<returns>
///				true for okay, false for error
///			</returns>
// #############################################################################################
var CopyImageToAlpha = CopyImageToAlpha_RELEASE;
function CopyImageToAlpha_RELEASE(_pDestTPE, _pSrcTPE) 
{
	if ( g_webGL )
		return false;

	// First copy the SOURCE image to a location where we can play with it.
	var buffer = document.createElement(g_CanvasName);
	var pImg = buffer.getContext('2d');
	Graphics_AddCanvasFunctions(pImg); 			// update for OUR functions.
	// TODO: use Graphics_DisableInterpolation(pImg);

	// Should it scale, or crop?  We'll scale...
	buffer.width = _pDestTPE.w;
	buffer.height = _pDestTPE.h;
	pImg.drawImage(_pSrcTPE.texture, _pSrcTPE.x, _pSrcTPE.y, _pSrcTPE.w, _pSrcTPE.h, 0, 0, _pDestTPE.w, _pDestTPE.h);


	var pSourceData, SourceDataLock, DestDataLock, pDestData, pDestImg;
	try
	{
		// This function cannot be called if the image is not from the same domain. You'll get security error if you do. ?!?!?
		SourceDataLock = pImg.getImageData(0, 0, _pDestTPE.w, _pDestTPE.h);
		pDestImg = _pDestTPE.texture.getContext('2d');
		Graphics_AddCanvasFunctions(pDestImg); 			// update for OUR functions.

		DestDataLock = pDestImg.getImageData(_pDestTPE.x, _pDestTPE.y, _pDestTPE.w, _pDestTPE.h);
	} catch (ex)
	{
		return false;
	}
	pSourceData = SourceDataLock.data;
	pDestData = DestDataLock.data;


	var total = (DestDataLock.height * DestDataLock.width * 4);
	for (var i = total - 4; i >= 0; i -= 4)
	{
		var c = ~ ~((pSourceData[i] + pSourceData[i + 1] + pSourceData[i + 2]) / 3);
		pDestData[i + 3] = c;
	}

	DestDataLock.data = pDestData;
	pDestImg.putImageData(DestDataLock, 0, 0);
	return true;
}



// #############################################################################################
/// Function:<summary>
///          	Draw some text usingthe WEB fonts
///          </summary>
///
/// In:		<param name="_font"></param>
///			<param name="_str"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_angle"></param>
///			<param name="_col"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Graphics_DrawText_RELEASE(_font, _str, _x, _y, _xscale, _yscale, _angle, _col, _alpha) {
    //WebGL_DrawText_RELEASE(_font, _str, _x, _y, _xscale, _yscale, _angle, _col, _alpha );

    graphics.globalAlpha = _alpha;
    graphics.fillStyle = GetHTMLRGBA(_col, 1.0);
    graphics.font = _font;
    graphics.textBaseline = "top"; // make sure the text grows from the TL of the canvas
    Graphics_PushTransform(_x, _y, _xscale, _yscale, -_angle);
    graphics.fillText(_str, 0, 0);
    Graphics_SetTransform();
};


// #############################################################################################
/// Function:<summary>
///             Remove the background from an image
///          </summary>
// #############################################################################################
function Graphics_RemoveBackground_RELEASE(_pImg, _w, _h) {

    try {
        var data, sdata, imagedata, ddata;

        // This function cannot be called if the image is not from the same domain. You'll get security error if you do. ?!?!?
        data = _pImg._getImageData(0, 0, _w, _h);
        sdata = ddata = data.data;

        // Get the transparency colour
        var pixelOffs = (_h - 1) * _w * 4;
        var r = sdata[pixelOffs + 0];
        var g = sdata[pixelOffs + 1];
        var b = sdata[pixelOffs + 2];
        var a = sdata[pixelOffs + 3];

        var total = (data.height * data.width * 4);
        for (var i = total - 4; i >= 0; i -= 4) {
            ddata[i + 0] = sdata[i + 0];
            ddata[i + 1] = sdata[i + 1];
            ddata[i + 2] = sdata[i + 2];
            if ((ddata[i + 0] == r) && (ddata[i + 1] == g) && (ddata[i + 2] == b)) {
                ddata[i + 3] = 0x0;
            }
            else {
                ddata[i + 3] = sdata[i + 3];
            }
        }
        _pImg._putImageData(data, 0, 0);
    }
    catch (ex) {
        return false;
    }

    return true;
};

function Graphics_DrawComment_RELEASE(_text) {
    // do nothing.
};


var g_Gifs = [];



function gif_open(width, height, background_colour)
{
    var encoder = new GIFEncoder();

    encoder.setRepeat(0);
    encoder.setSize(yyGetInt32(width), yyGetInt32(height));
    encoder.start();
    for (var i = 0; i < g_Gifs.length; i++) {

        if (g_Gifs[i] == null) {
            g_Gifs[i] = encoder;
            return i;
        }
    }
    var ret =g_Gifs.length; 
    g_Gifs[g_Gifs.length] = encoder;
    return ret;


};

function gif_save_buffer(gif)
{
    // MissingFunction("gif_save_buffer()");

    gif = yyGetInt32(gif);

    var encoder = g_Gifs[gif];

    if (encoder == null)
        return -1;
    encoder.finish();
    var binary_gif = encoder.stream().getData();
    var pBuffer = buffer_create(binary_gif.length, eBuffer_Format_Grow, 1);
   
    if (pBuffer == null)
        return -1;

    //urgh
    for (var i = 0; i < binary_gif.length;i++)
        buffer_write(pBuffer, eBuffer_U8, binary_gif[i]);

    g_Gifs[gif] = null;

    return pBuffer;

};

function gif_save(gif, filename)
{
    //MissingFunction("gif_save()");

    gif = yyGetInt32(gif);

    var encoder = g_Gifs[gif];

    if (encoder == null)
        return;

    encoder.finish();
    encoder.download(yyGetString(filename));

  //  var binary_gif = encoder.stream().getData();
   // var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
   // SaveTextFile_Block(filename, encode64(binary_gif));
    
     g_Gifs[gif] = null;
};

function gif_add_surface(gif, surface, delaytime, xoffset, yoffset, quantquality)
{
	// Optional params
	if (quantquality === undefined) quantquality = 2;
	if (xoffset === undefined) xoffset = 0;
	if (yoffset === undefined) yoffset = 0;

	var pSurf = g_Surfaces.Get(yyGetInt32(surface));
    if (pSurf != null) {

        var encoder = g_Gifs[yyGetInt32(gif)];

        if (encoder == null)
            return;

        switch (yyGetInt32(quantquality))
        {
            default:
                encoder.setQuality(1);
                break;
            case 0:
                encoder.setQuality(0);
                break;
            case 1:
                encoder.setQuality(30);
                break;
            case 2:
                encoder.setQuality(10);
                break;
        }

        encoder.setDelay(yyGetInt32(delaytime)*10);
        var singleimage = document.createElement(g_CanvasName);
        var pGraphics = singleimage.getContext('2d');
        Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.

        var glTexture = g_webGL.CreateTextureFromFramebuffer(singleimage, pSurf.FrameBuffer, yyGetInt32(xoffset), yyGetInt32(yoffset), encoder.getWidth(), encoder.getHeight(), false, false);

        encoder.addFrame(Uint8ClampedArray.from(glTexture.Image), true);
    }
};


