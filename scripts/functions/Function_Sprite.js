// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Sprite.js
// Created:         22/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 22/02/2011		V1.0        MJD     1st version
// 26/05/2011		V1.1        MJD     Rest of the functions added
// 
// **********************************************************************************************************************

var		MASK_PRECISE   = 0,
		MASK_RECTANGLE = 1,
		MASK_ELLIPSE   = 2,
		MASK_DIAMOND   = 3;


// #############################################################################################
/// Function:<summary>
///             Get the number of subimages a sprite has
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the number of subimages of</param>
/// Out:	 <returns>
///				Number of sub images, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_exists( _index )
{
    if( g_pSpriteManager.Get(yyGetInt32(_index)) == null ) return false;
    return true;
}



// #############################################################################################
/// Function:<summary>
///             Get the width of a sprite
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the width of</param>
/// Out:	 <returns>
///				width of sprite, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_width( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.width;
}


// #############################################################################################
/// Function:<summary>
///             Get the width of a sprite
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the width of</param>
/// Out:	 <returns>
///				width of sprite, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_height( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.height;
}


// #############################################################################################
/// Function:<summary>
///             Get the NAME of a sprite
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the name of</param>
/// Out:	 <returns>
///				Name of sprite, or "" if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_name( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return "";
    return pSpr.pName;
}
function    sprite_name( _index ){ return sprite_get_name(_index); }

 


// #############################################################################################
/// Function:<summary>
///             Get the number of subimages a sprite has
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the number of subimages of</param>
/// Out:	 <returns>
///				Number of sub images, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_number( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.numb;
}


// #############################################################################################
/// Function:<summary>
///             Get the sprite's transparancy setting 
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the transparancy setting of</param>
/// Out:	 <returns>
///				Transparancy setting, or false if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_transparent( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.transparent;
}

// #############################################################################################
/// Function:<summary>
///             Get the sprite's x offset (X-Origin)
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the offset of</param>
/// Out:	 <returns>
///				X Offset, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_xoffset( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.xOrigin;
}

// #############################################################################################
/// Function:<summary>
///             Get the sprite's y offset (Y-Origin)
///          </summary>
///
/// In:		 <param name="_index">Index of sprite to get the offset of</param>
/// Out:	 <returns>
///				Y Offset, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_yoffset( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.yOrigin;
}


// #############################################################################################
/// Function:<summary>
///             Get the sprite's bounding box left edge
///          </summary>
///
/// In:		 <param name="_index">Index of sprite</param>
/// Out:	 <returns>
///				Left edge, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_bbox_left( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.bbox.left;
}


// #############################################################################################
/// Function:<summary>
///             Get the sprite's bounding box right edge
///          </summary>
///
/// In:		 <param name="_index">Index of sprite</param>
/// Out:	 <returns>
///				Right edge, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_bbox_right( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.bbox.right;
}



// #############################################################################################
/// Function:<summary>
///             Get the sprite's bounding box top edge
///          </summary>
///
/// In:		 <param name="_index">Index of sprite</param>
/// Out:	 <returns>
///				Top edge, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_bbox_top( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.bbox.top;
}


// #############################################################################################
/// Function:<summary>
///             Get the sprite's bounding box bottom edge
///          </summary>
///
/// In:		 <param name="_index">Index of sprite</param>
/// Out:	 <returns>
///				Bottom edge, or 0 if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_bbox_bottom( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return 0;
    return pSpr.bbox.bottom;
}



// #############################################################################################
/// Function:<summary>
///             Get the sprite's mode
///          </summary>
///
/// In:		 <param name="_index">Index of sprite</param>
/// Out:	 <returns>
///				returns the precise setting, or false if not found.
///			 </returns>
// #############################################################################################
function    sprite_get_bbox_mode( _index )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return -1;
    return pSpr.bboxmode;
}



// #############################################################################################
/// Function:<summary>
///             Set the sprites X and Y offset (origin)
///          </summary>
///
/// In:		 <param name="_index">sprite index</param>
///			 <param name="_xoffset">x offset</param>
///			 <param name="_yoffset">y offset</param>
///				
// #############################################################################################
function    sprite_set_offset( _index, _xoffset, _yoffset )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr==null) return;
    pSpr.xOrigin = yyGetReal(_xoffset);
    pSpr.yOrigin = yyGetReal(_yoffset);
    pSpr.CalcCullRadius();
}


// #############################################################################################
/// Function:<summary>
///             Set the sprites bounding box
///          </summary>
///
/// In:		 <param name="_index">sprite index</param>
///			 <param name="_left">left edge</param>
///			 <param name="_top">top edge</param>
///			 <param name="_right">right edge</param>
///			 <param name="_bottom">bottom edge</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    sprite_set_bbox( _index, _left, _top, _right, _bottom )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
    if( pSpr===null) return;
    pSpr.bbox.left = yyGetInt32(_left);
    pSpr.bbox.top  = yyGetInt32(_top);
    pSpr.bbox.right = yyGetInt32(_right);
    pSpr.bbox.bottom = yyGetInt32(_bottom);
}

// #############################################################################################
/// Function:<summary>
///             Set the sprite's mode
///          </summary>
///
/// In:		 <param name="_index">sprite index</param>
///			 <param name="_mode">mode</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sprite_set_bbox_mode( _index, _mode )
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_index));
	if( pSpr==null) return;

	_mode = yyGetInt32(_mode);
	
	if ( (_mode < 0) || (_mode > 2) ) return;
	if ( _mode == pSpr.bboxmode ) return;

	pSpr.bboxmode = _mode;
}


// #############################################################################################
/// Function:<summary>
///             Set the sprite's ALPHA using another sprite
///          </summary>
///
/// In:     <param name="_index">Index of sprite</param>
///         <param name="_spr"sprite to use</param>
///
// #############################################################################################
function sprite_set_alpha_from_sprite( _dest, _src )
{
    var pDest = g_pSpriteManager.Get(yyGetInt32(_dest));
    if (pDest === null) return false;
    if (!pDest.copy)
    {
    	yyError("Error: Can't set the alpha channel of normal sprite. It must 'duplicated' first");
    	return false; 					// can't change a non-duplicated sprite
    }
    var pSrc = g_pSpriteManager.Get(yyGetInt32(_src));
    if (pSrc === null) return false;

    // Copy all available
    var count = pSrc.numb;
    if (count > pDest.numb) {
        count = pDest.numb;
    }

    for (var i = 0; i < count; i++) {
        var pDestTPE = pDest.ppTPE[i];
        var pSrcTPE = pSrc.ppTPE[i];

        CopyImageToAlpha(pDestTPE, pSrcTPE);
    }

    return true;
}



// #############################################################################################
/// Function:<summary>
///             CAdds an area of the screen as a next subimage to the sprite with index ind. 
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
///				
// #############################################################################################
var sprite_add_from_screen = sprite_add_from_screen_RELEASE;
function sprite_add_from_screen_RELEASE(_ind, _x, _y, _w, _h, _removeback, _smooth) {

    _ind = yyGetInt32(_ind);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);
    _removeback = yyGetBool(_removeback);

	var singleimage = document.createElement(g_CanvasName);
	var pGraphics = singleimage.getContext('2d');
	Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
	// TODO: use Graphics_DisableInterpolation(pGraphics);

	// Create a new sprite
	var pNewSpr = g_pSpriteManager.Get(_ind);
	pNewSpr.numb++;

	// This sprite must be the same size as the ones that are already there!
	singleimage.width = pNewSpr.width;
	singleimage.height = pNewSpr.height;
	pGraphics._drawImage( canvas, _x,_y,_w,_h,    0,0,singleimage.width,singleimage.height);
	if (_removeback) {
	    singleimage.complete = Graphics_RemoveBackground_RELEASE(pGraphics, _w, _h);
	}
	else {
	    singleimage.complete = true;
	}	

	pNewSpr.numb++;

	// Create a texture page entry.
	var pTPE = new yyTPageEntry();
	pNewSpr.ppTPE[pNewSpr.ppTPE.length] = pTPE;
	pTPE.x = 0;
	pTPE.y = 0;
	pTPE.w = pNewSpr.width;
	pTPE.h = pNewSpr.height;
	pTPE.XOffset = 0;
	pTPE.YOffset = 0;
	pTPE.CropWidth = pTPE.w;
	pTPE.CropHeight = pTPE.h;
	pTPE.ow = pTPE.w;
	pTPE.oh = pTPE.h;

	pTPE.tp = Graphics_AddImage(singleimage);
	pTPE.texture = g_Textures[pTPE.tp];
	pTPE.texture.complete = true;

	return _ind;
}


// #############################################################################################
/// Function:<summary>
///             Creates a sprite by copying the given area from the surface with the given id
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="w"></param>
///			 <param name="h"></param>
///			 <param name="removeback"></param>
///			 <param name="smooth"></param>
///			 <param name="xorig"></param>
///			 <param name="yorig"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var sprite_create_from_surface = sprite_create_from_surface_RELEASE;
function sprite_create_from_surface_RELEASE(_id, _x, _y, _w, _h, _removeback, _smooth, _xorig, _yorig)
{
    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);
    _removeback = yyGetBool(_removeback);
    _xorig = yyGetInt32(_xorig);
    _yorig = yyGetInt32(_yorig);

	var singleimage = document.createElement(g_CanvasName);
	var pGraphics = singleimage.getContext('2d');
	Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
	// TODO: use Graphics_DisableInterpolation(pGraphics);

	singleimage.width = g_Surfaces.Get(_id).width;
	singleimage.height = g_Surfaces.Get(_id).height;
	pGraphics._drawImage(g_Surfaces.Get(_id), 0, 0);
	if (_removeback) {
	    singleimage.complete = Graphics_RemoveBackground_RELEASE(pGraphics, _w, _h);
	}
	else {
	    singleimage.complete = true;
	}	

	// Create a new sprite
	var pNewSpr = new yySprite();
	var newindex = g_pSpriteManager.AddSprite(pNewSpr);

	pNewSpr.pName = "surface.copy";
	pNewSpr.width = _w;
	pNewSpr.height = _h;
	pNewSpr.bbox = new YYRECT();
	pNewSpr.bbox.right = pNewSpr.width;
	pNewSpr.bbox.bottom = pNewSpr.height;
	pNewSpr.transparent = true;
	pNewSpr.smooth = true;
	pNewSpr.preload = true;
	pNewSpr.bboxmode = 0;
	pNewSpr.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
	pNewSpr.xOrigin = _xorig;
	pNewSpr.yOrigin = _yorig;

	pNewSpr.copy = true;

	pNewSpr.numb = 1;	
	pNewSpr.maskcreated = false;
	pNewSpr.sepmasks = false;
	pNewSpr.colmask = [];    					    // Mask used for precise collision checking
	pNewSpr.ppTPE = []; 							// pointer to TPageEntry
	pNewSpr.Masks = [];                             // Masks
	pNewSpr.CalcCullRadius();


	// Create a texture page entry.
	var pTPE = new yyTPageEntry();
	pNewSpr.ppTPE[0] = pTPE;
	pTPE.x = 0;
	pTPE.y = 0;
	pTPE.w = pNewSpr.width;
	pTPE.h = pNewSpr.height;
	pTPE.XOffset = 0;
	pTPE.YOffset = 0;
	pTPE.CropWidth = pTPE.w;
	pTPE.CropHeight = pTPE.h;
	pTPE.ow = pTPE.w;
	pTPE.oh = pTPE.h;

	pTPE.tp = Graphics_AddImage(singleimage);
	pTPE.texture = g_Textures[pTPE.tp];
	pTPE.texture.complete = true;

    Graphics_SetupTPECaching(pTPE);

	return newindex;
}



// #############################################################################################
/// Function:<summary>
///             Adds an area of the surface id as a next subimage to the sprite with index ind
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_id"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var sprite_add_from_surface = sprite_add_from_surface_RELEASE;
function sprite_add_from_surface_RELEASE(_ind, _id, _x, _y, _w, _h, _removeback, _smooth)
{
    _ind = yyGetInt32(_ind);
    _id = yyGetInt32(_id);
    _x = yyGetInt32(_x);
    _y = yyGetInt32(_y);
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);
    _removeback = yyGetBool(_removeback);

	var singleimage = document.createElement(g_CanvasName);
	var pGraphics = singleimage.getContext('2d');
	Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.

	// Create a new sprite
	var pNewSpr = g_pSpriteManager.Get(_ind);
	pNewSpr.numb++;

	// This sprite must be the same size as the ones that are already there!
	singleimage.width = pNewSpr.width; 
	singleimage.height = pNewSpr.height;
	pGraphics._drawImage(g_Surfaces.Get(_id), 0, 0, _w, _h, 0, 0, singleimage.width, singleimage.height);
	if (_removeback) {
	    singleimage.complete = Graphics_RemoveBackground_RELEASE(pGraphics, _w, _h);
	}
	else {
	    singleimage.complete = true;
	}	


	// Create a NEw texture page entry at the end of the list
	var pTPE = new yyTPageEntry();
	pNewSpr.ppTPE[pNewSpr.ppTPE.length] = pTPE;
	pTPE.x = 0;
	pTPE.y = 0;
	pTPE.w = pNewSpr.width;
	pTPE.h = pNewSpr.height;
	pTPE.XOffset = 0;
	pTPE.YOffset = 0;
	pTPE.CropWidth = pTPE.w;
	pTPE.CropHeight = pTPE.h;
	pTPE.ow = pTPE.w;
	pTPE.oh = pTPE.h;

	pTPE.tp = Graphics_AddImage(singleimage);
	pTPE.texture = g_Textures[pTPE.tp];
	pTPE.texture.complete = true;


	return _ind;
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sprite_delete( _ind ) {
	g_pSpriteManager.Delete(yyGetInt32(_ind));
}



// #############################################################################################
/// Function:<summary>
///             Saves subimage subimg of sprite ind to the file with the name fname. 
///             This must be a .png file.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_subimg"></param>
///			 <param name="_fname"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sprite_save(_ind,_subimg,_fname)
{
    ErrorFunction("sprite_save()");
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var sprite_duplicate = sprite_duplicate_RELEASE;
function sprite_duplicate_RELEASE(_ind) 
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_ind));
	if (pSpr == null) return 0;

	var pNewSpr = new yySprite();
	var newindex = g_pSpriteManager.AddSprite(pNewSpr);

	pNewSpr.pName = pSpr.pName+".copy";
	pNewSpr.width =			pSpr.width;		
	pNewSpr.height = 		pSpr.height; 
	pNewSpr.bbox.Copy(pSpr.bbox);
	pNewSpr.transparent = 	pSpr.transparent;
	pNewSpr.smooth = 		pSpr.smooth;
	pNewSpr.preload = 		pSpr.preload;
	pNewSpr.bboxmode = 		pSpr.bboxmode;
	pNewSpr.colcheck = 		pSpr.colcheck;
	pNewSpr.xOrigin = 		pSpr.xOrigin; 
	pNewSpr.yOrigin = 		pSpr.yOrigin;

	pNewSpr.copy = true;

	pNewSpr.numb =			pSpr.numb; 
	pNewSpr.cullRadius = 	pSpr.cullRadius;
	pNewSpr.maskcreated = 	pSpr.maskcreated;
	pNewSpr.playbackspeedtype =pSpr.playbackspeedtype;
	pNewSpr.playbackspeed = pSpr.playbackspeed;
	pNewSpr.sepmasks =		pSpr.sepmasks; 
	pNewSpr.colmask = []; //Array.slice( 					    // Mask used for precise collision checking
	pNewSpr.ppTPE = []; 							    // pointer to TPageEntry
	pNewSpr.Masks = [];                                    // Masks
	//pNewSpr.bitmaps = [];


	// Loop though and copy all the images, AND create new texture page entries to point to the new images.
	for(var i=0;i<pSpr.numb;i++)
	{
		// Copy texture page entrys.
		var pTPE = new yyTPageEntry();
		pNewSpr.ppTPE[i] = pTPE;
		pTPE.copy( pSpr.ppTPE[i] );

		var pImage = Graphics_ExtractImage(pSpr.ppTPE[i]);
		pTPE.tp = Graphics_AddImage(pImage);
		pTPE.x = 0;
		pTPE.y = 0;
		pTPE.texture = g_Textures[pTPE.tp];
		pTPE.texture.complete = true;

	}
	return newindex;
}


// #############################################################################################
/// Function:<summary>
///             Adds the image stored in the file fname to the set of sprite resources. 
///
///				Many different image file types can be dealt with. When the image is not a gif 
///				image it can be a strip containing a number of subimages for the sprite next to 
///				each other. 
///
///				Use imgnumb to indicate their number (1 for a single image). For 
///				gif images, this argument is not used; the number of images in the gif file is 
///				used instead. 
///
///				removeback indicates whether to make all pixels with the background 
///				color (left-bottom pixel) transparent. 
///
///				smooth indicates whether to smooth the edges. 
///
///				xorig and yorig indicate the position of the origin in the sprite. 
///
///				The function returns the index of the new sprite that you can then use to draw it 
///				or to assign it to the variable sprite_index of an instance. 
///				
///          </summary>
///
/// In:		 <param name="_filename">filename of image to load</param>
///			 <param name="_imgnumb">Number of images</param>
///			 <param name="_removeback">removeback indicates whether to make all pixels with the background color (left-bottom pixel) transparent. </param>
///			 <param name="_smooth">smooth indicates whether to smooth the edges</param>
///			 <param name="_xorig">X origin of the sprite</param>
///			 <param name="_yorig">Y origin of the sprite</param>
/// Out:	 <returns>
///				When an error occurs -1 is returned.
///			 </returns>
// #############################################################################################
function sprite_add(_filename, _imgnumb, _removeback, _smooth, _xorig, _yorig, _prefetch)
{
    _filename = yyGetString(_filename);
    _imgnumb = yyGetInt32(_imgnumb);

	if (_imgnumb < 0) return -1;
    
    if(_imgnumb==0) //you don't really mean it do you...
        _imgnumb=1;

	// Create a new sprite
	var pNewSpr = new yySprite();
	pNewSpr.m_LoadedFromIncludedFiles = true;

	if (_filename.substring(0, 5) == "file:") return -1;
	pNewSpr.pName = _filename;

	if (_prefetch != undefined)
	{
		if (_prefetch)
		{
			pNewSpr.prefetchOnLoad = true;
		}
	}

	var newindex = g_pSpriteManager.AddSprite(pNewSpr);

	////////////////////////////////////////////////////////////////////////////
	// Spine
	if (_filename.endsWith('.json')) {
		pNewSpr.LoadFromSpineAsync(_filename, function (err) {
			var node = g_pASyncManager.Add(newindex, _filename, ASYNC_SPRITE, {});
			node.m_Complete = true;
			node.m_Status = err ? ASYNC_STATUS_ERROR : ASYNC_STATUS_LOADED;
		});
		return newindex;
	}

	////////////////////////////////////////////////////////////////////////////
	// JPEGs, PNGs etc.
	var pFileName = _filename;

	var image = Graphics_AddTexture(pFileName);
	g_Textures[image].onload = ASync_ImageLoad_Callback;
	g_Textures[image].onerror = ASync_ImageLoad_Error_Callback;

	g_pASyncManager.Add(newindex, _filename, ASYNC_SPRITE, g_Textures[image]);

	pNewSpr.width = -1;
	pNewSpr.height = -1;
	pNewSpr.bbox = new YYRECT();
	pNewSpr.bbox.right = 0; //pNewSpr.width;
	pNewSpr.bbox.bottom = 0; //pNewSpr.height;
	pNewSpr.transparent = _removeback;
	pNewSpr.smooth = yyGetBool(_smooth);
	pNewSpr.preload = true;
	pNewSpr.bboxmode = 0;
	pNewSpr.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
	pNewSpr.xOrigin = yyGetInt32(_xorig);
	pNewSpr.yOrigin = yyGetInt32(_yorig);

	pNewSpr.copy = false;

	pNewSpr.numb = _imgnumb;
	pNewSpr.cullRadius = 0;
	pNewSpr.maskcreated = false;
	pNewSpr.sepmasks = false;
	pNewSpr.colmask = [];    					    // Mask used for precise collision checking
	pNewSpr.ppTPE = []; 							// pointer to TPageEntry
	pNewSpr.Masks = [];                             // Masks


	// Create a texture page entry.
	for (var i = 0; i < _imgnumb; i++)
	{
		var pTPE = new yyTPageEntry();
		pNewSpr.ppTPE[i] = pTPE;
		pTPE.x = 0;
		pTPE.y = 0;
		pTPE.w = 0;
		pTPE.h = 0;
		pTPE.XOffset = 0;
		pTPE.YOffset = 0;
		pTPE.CropWidth = 0;
		pTPE.CropHeight = 0;
		pTPE.ow = pTPE.w;
		pTPE.oh = pTPE.h;

		pTPE.tp = image;
		pTPE.texture = g_Textures[pTPE.tp];
	}

	return newindex;
}

function sprite_add_ext(_filename, _imgnumb, _xorig, _yorig, _prefetch)
{
	return sprite_add(_filename, _imgnumb, false, false, _xorig, _yorig, _prefetch);
}

// #############################################################################################
/// Function:<summary>
///             Adds the image stored in the file fname to the set of sprite resources. 
///
///				Many different image file types can be dealt with. When the image is not a gif 
///				image it can be a strip containing a number of subimages for the sprite next to 
///				each other. 
///
///				Use imgnumb to indicate their number (1 for a single image). For 
///				gif images, this argument is not used; the number of images in the gif file is 
///				used instead. 
///
///				removeback indicates whether to make all pixels with the background 
///				color (left-bottom pixel) transparent. 
///
///				smooth indicates whether to smooth the edges. 
///
///				xorig and yorig indicate the position of the origin in the sprite. 
///
///				The function returns the index of the new sprite that you can then use to draw it 
///				or to assign it to the variable sprite_index of an instance. 
///				
///          </summary>
///
/// In:		 <param name="_ind">index of sprite to replace</param>
///    		 <param name="_filename">filename of image to load</param>
///			 <param name="_imgnumb">Number of images</param>
///			 <param name="_removeback">removeback indicates whether to make all pixels with the background color (left-bottom pixel) transparent. </param>
///			 <param name="_smooth">smooth indicates whether to smooth the edges</param>
///			 <param name="_xorig">X origin of the sprite</param>
///			 <param name="_yorig">Y origin of the sprite</param>
/// Out:	 <returns>
///				When an error occurs -1 is returned.
///			 </returns>
// #############################################################################################
function sprite_replace(_ind, _filename, _imgnumb, _removeback, _smooth, _xorig, _yorig)
{
    _ind = yyGetInt32(_ind);
    _filename = yyGetString(_filename);
    _imgnumb = yyGetInt32(_imgnumb);

	if (_imgnumb < 0) return -1;
    
    if(_imgnumb==0) //you don't really mean it do you...
        _imgnumb=1;


	// Create a new sprite
	var pNewSpr = g_pSpriteManager.Get(_ind);
	pNewSpr.m_LoadedFromIncludedFiles = true;

	if (_filename.substring(0, 5) == "file:") return -1;
	var pFileName = _filename;

	////////////////////////////////////////////////////////////////////////////
	// Spine
	if (_filename.endsWith('.json')) {
		pNewSpr.LoadFromSpineAsync(_filename, function (err) {
			var node = g_pASyncManager.Add(_ind, _filename, ASYNC_SPRITE, {});
			node.m_Complete = true;
			node.m_Status = err ? ASYNC_STATUS_ERROR : ASYNC_STATUS_LOADED;
		});
		return _ind;
	}

	////////////////////////////////////////////////////////////////////////////
	// JPEGs, PNGs etc.
	var image = Graphics_AddTexture(pFileName);
	g_Textures[image].onload = ASync_ImageLoad_Callback;
	g_Textures[image].onerror = ASync_ImageLoad_Error_Callback;

	g_pASyncManager.Add(_ind, _filename, ASYNC_SPRITE, g_Textures[image]);

	pNewSpr.width = 0;
	pNewSpr.height = 0;
	pNewSpr.bbox = new YYRECT();
	pNewSpr.bbox.right = 0; 
	pNewSpr.bbox.bottom = 0;
	pNewSpr.transparent = yyGetBool(_removeback);
	pNewSpr.smooth = yyGetBool(_smooth);
	pNewSpr.preload = true;
	pNewSpr.bboxmode = 0;
	pNewSpr.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
	pNewSpr.xOrigin = yyGetInt32(_xorig);
	pNewSpr.yOrigin = yyGetInt32(_yorig);

	pNewSpr.copy = false;

	pNewSpr.numb = _imgnumb;
	pNewSpr.cullRadius = 0;
	pNewSpr.maskcreated = false;
	pNewSpr.sepmasks = false;
	pNewSpr.colmask = [];    					    // Mask used for precise collision checking
	pNewSpr.ppTPE = []; 							// pointer to TPageEntry
	pNewSpr.Masks = [];                             // Masks


	// Create a texture page entry.
	for (var i = 0; i < _imgnumb; i++)
	{
		var pTPE = new yyTPageEntry();
		pNewSpr.ppTPE[i] = pTPE;
		pTPE.x = 0;
		pTPE.y = 0;
		pTPE.w = 0;
		pTPE.h = 0;
		pTPE.XOffset = 0;
		pTPE.YOffset = 0;
		pTPE.CropWidth = 0;
		pTPE.CropHeight = 0;
		pTPE.ow = pTPE.w;
		pTPE.oh = pTPE.h;

		pTPE.tp = image;
		pTPE.texture = g_Textures[pTPE.tp];
	}

	return _ind;
}



// #############################################################################################
/// Function:<summary>
///             Merges the images from sprite ind2 into sprite ind1, adding them at the end. 
///				If the sizes don't match the sprites are stretched to fit. 
///				Sprite ind2 is not deleted!
///          </summary>
///
/// In:		 <param name="_ind">Sprite to  merge WITH</param>
///			 <param name="_spr">Sprite chain to append to _ind</param>
/// Out:	 <returns>
///				_ind
///			 </returns>
// #############################################################################################
function sprite_merge(_dest, _src) {

    _dest = yyGetInt32(_dest);

	// Create a new sprite
	var pDest = g_pSpriteManager.Get(_dest);
	var pSrc = g_pSpriteManager.Get(yyGetInt32(_src));

	var w = pDest.width;
	var h = pDest.height;

//	pNewSpr.numb = _imgnumb;
//	pNewSpr.Masks = [];                             // Masks

	// Now COPY all the textures/images over and create new textute page entrys for them.
	var grap = graphics;
	for (var i = 0; i < pSrc.numb; i++)
	{
		// Create a new canvas for copying the sprite over.
		var singleimage = document.createElement(g_CanvasName);
		var pGraphics = singleimage.getContext('2d');
		Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
		// TODO: use Graphics_DisableInterpolation(pGraphics);

		// Make it the correct size, and blit the image over. (streaching to fit)
		singleimage.width = w;
		singleimage.height = h;
		graphics = pGraphics;
		pGraphics._drawImage(pSrc.ppTPE[i].texture, 0, 0, w, h, 0, 0, singleimage.width, singleimage.height);
		singleimage.complete = true;

		var pTPE = new yyTPageEntry();
		pDest.ppTPE[pDest.ppTPE.length] = pTPE;
		pTPE.x = 0;
		pTPE.y = 0;
		pTPE.w = w;
		pTPE.h = h;
		pTPE.XOffset = 0;
		pTPE.YOffset = 0;
		pTPE.CropWidth = w;
		pTPE.CropHeight = h;
		pTPE.ow = pTPE.w;
		pTPE.oh = pTPE.h;

		pTPE.tp = Graphics_AddImage(singleimage);
		pTPE.texture = g_Textures[pTPE.tp];
		pTPE.texture.complete = true;

		pDest.numb++;
	}
	graphics = grap;


	return _dest;
}




// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_ind1"></param>
///			 <param name="_ind2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sprite_assign(_ind1, _ind2)
{
    _ind1 = yyGetInt32(_ind1);

	// Create a new sprite
	var pDest = g_pSpriteManager.Get(_ind1);
	var pSrc = g_pSpriteManager.Get(yyGetInt32(_ind2));

	pDest.width = pSrc.width;
	pDest.height = pSrc.height;
	pDest.bbox = new YYRECT();
	pDest.bbox.Copy( pSrc ); 
	pDest.transparent = pSrc.transparent;
	pDest.smooth = pSrc.smooth;
	pDest.preload = pSrc.preload;
	pDest.bboxmode = pSrc.bboxmode;
	pDest.colcheck = pSrc.colcheck;
	pDest.xOrigin = pSrc.xOrigin;
	pDest.yOrigin = pSrc.yOrigin;

	pDest.copy = true;

	pDest.numb = pSrc.numb;
	pDest.cullRadius = pSrc.cullRadius;
	pDest.maskcreated = pSrc.maskcreated ;
	pDest.playbackspeedtype =pSrc.playbackspeedtype;
	pDest.playbackspeed = pSrc.playbackspeed;
	pDest.sepmasks = pSrc.sepmasks;
	pDest.colmask = pSrc.colmask.slice(0);    				// Mask used for precise collision checking	
	pDest.ppTPE = []; 							            // pointer to TPageEntry
	if (pSrc.Masks) {
	    pDest.Masks = pSrc.Masks.slice();                       // Masks
	}

	var w = pDest.width;
	var h = pDest.height;

	// Now COPY all the textures/images over and create new textute page entrys for them.
	var grap = graphics;
	for (var i = 0; i < pSrc.numb; i++)
	{
		var pSrcTPE = pSrc.ppTPE[i];
		var pTPE = new yyTPageEntry();
		pDest.ppTPE[i] = pTPE;
		pTPE.x = pSrcTPE.x;
		pTPE.y = pSrcTPE.y;
		pTPE.w = pSrcTPE.w;
		pTPE.h = pSrcTPE.h;
		pTPE.XOffset = pSrcTPE.XOffset;
		pTPE.YOffset = pSrcTPE.YOffset;
		pTPE.CropWidth = pSrcTPE.CropWidth;
		pTPE.CropHeight = pSrcTPE.CropHeight;
		pTPE.ow = pSrcTPE.ow;
		pTPE.oh = pSrcTPE.oh;
		pTPE.tp = pSrcTPE.tp;
		pTPE.texture = pSrcTPE.texture;
	}
	graphics = grap;

	return _ind1;
}




// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="sepmasks"></param>
///			 <param name="bboxmode"></param>
///			 <param name="bbleft"></param>
///			 <param name="bbright"></param>
///			 <param name="bbtop"></param>
///			 <param name="bbbottom"></param>
///			 <param name="kind"></param>
///			 <param name="tolerance"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################


function sprite_collision_mask( _ind, _sepmasks, _bbmode,_bbleft,_bbtop,_bbright,_bbbottom,_kind,_tolerance) 
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_ind));        
    if( pSpr===null) { return false; }
    pSpr.colcheck = yySprite_CollisionType.PRECISE;

    // Clean up if required
    pSpr.colmask = [];
    pSpr.sepmasks = yyGetInt32(_sepmasks);

    // Check whether there are any images
    pSpr.bbox = new YYRECT();
    if (pSpr.numb == 0)
    { 
        return;
    }

    _bbmode = yyGetInt32(_bbmode);
    _kind = yyGetInt32(_kind);
    _tolerance = yyGetInt32(_tolerance);

    pSpr.bboxmode = _bbmode;

	// Create the bounding box
    if (_bbmode == 0)
    {
		// precise mode (should really look at the mask and get the bounds...)
		var lleft = 100000;
		var rright = -100000;
		var ttop = 100000;
		var bbottom  = -100000; 
		
		
		for (var i = 0; i < pSpr.numb; i++)
  		{
  		    var _pTPE = pSpr.ppTPE[i];
  		    var pByteData = Graphics_ExtractImageBytes(_pTPE);
		    var index = 0;
		    for (var k = 0; k < _pTPE.oh; k++)
		    {
		        for (var j = 0; j < _pTPE.ow; j++)
		        {
		            var index =((k*_pTPE.ow +j)*4)+3;
		            if(index<pByteData.length)
		            {
			            if (pByteData[index] > _tolerance) 
			            {
			                if(j<lleft)
			                    lleft = j;
			                if(j>rright)
			                    rright = j;
			                if(k<ttop)
			                    ttop = k;
			                if(k>bbottom)
			                    bbottom = k;
			            }
			        }
			    }		    
		    }
  		}
  		if(lleft==0x7FFFFFFF) //No valid pixels
  		{
  		    pSpr.bbox.left = 0;
		    pSpr.bbox.right =0;
		    pSpr.bbox.top = 0;
		    pSpr.bbox.bottom = 0;
  		}
  		else
  		{
  		    pSpr.bbox.left = lleft;
		    pSpr.bbox.right =rright;
		    pSpr.bbox.top = ttop;
		    pSpr.bbox.bottom = bbottom;
  		}	
	} else if (_bbmode == 1)
	{
		// full image
		pSpr.bbox.left = 0;
		pSpr.bbox.right = pSpr.width;
		pSpr.bbox.top = 0;
		pSpr.bbox.bottom = pSpr.height;
	} else
	{
		// user defined mode
		pSpr.bbox.left = yyGetInt32(_bbleft);
		pSpr.bbox.right = yyGetInt32(_bbright);
		pSpr.bbox.top = yyGetInt32(_bbtop);
		pSpr.bbox.bottom = yyGetInt32(_bbbottom); 	
	}


    // if bounding box mode, then don't assign sprites, just fill in the bounding box.
    //if( _kind==1 ){
    //}


    // Compute the mask(s)
    var ppTPE = pSpr.ppTPE;
    pSpr.colmask = [];
    if(pSpr.sepmasks)
    {
    	for (var i = 0; i < pSpr.numb; i++)
    	{
    		pSpr.colmask[i] = TMaskCreate(null, pSpr.ppTPE[i], _bbmode, pSpr.bbox, _kind, _tolerance);
        }
    }
    else
    {
        // If not separate masks, then OR them altogether. 
    	pSpr.colmask[0] = TMaskCreate(pSpr.colmask[0], pSpr.ppTPE[0], _bbmode, pSpr.bbox, _kind, _tolerance);
    
        for (var i=1;i < pSpr.numb; i++){
        	pSpr.colmask[0] = TMaskCreate(pSpr.colmask[0], pSpr.ppTPE[i], _bbmode, pSpr.bbox, _kind, _tolerance);
        }
    }
    pSpr.maskcreated = true;   	    
}
     


// #############################################################################################
/// Function:<summary>
///          	Create a byte array from a sprite that we can use for collision
///          </summary>
///
/// In:		<param name="_merge"></param>
///			<param name="_pTPE"></param>
///			<param name="_bbmode"></param>
///			<param name="_bbox"></param>
///			<param name="_kind"></param>
///			<param name="_tolerance"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function TMaskCreate(_merge, _pTPE, _bbmode, _bbox, _kind, _tolerance) 
{
	var w = _pTPE.ow;
	var h = _pTPE.oh;

	// get the image bytes
	var wh = h * w;
	var pData = new Uint8Array(wh);
	for(var j=0;j<wh;j++) pData[j] = false;	// clear the array


	if (_kind == MASK_PRECISE)
	{
		var pByteData = Graphics_ExtractImageBytes(_pTPE);
		var index = 0;
		for (var i = 0; i < pByteData.length; i+=4)
		{
			if (pByteData[i + 3] > _tolerance) {
			    pData[index] = true; 
			}
			else {
			    pData[index] = false;
			}
			index++;
		}
	}
	else {
		// Create the mask 
		switch (_kind)
		{
			case MASK_RECTANGLE:		{
											for(var y=_bbox.top;y<=_bbox.bottom;y++){
												for(var x=_bbox.left;x<=_bbox.right;x++){
													pData[x+(y*w)] = true;
												}
											}
											break;
										}

			case MASK_ELLIPSE:		{
											var mx = (_bbox.left + _bbox.right) / 2;
											var dx = mx-_bbox.left+0.5;
											var my = (_bbox.top + _bbox.bottom) / 2;
											var dy = my-_bbox.top+0.5;

											for(var y=_bbox.top;y<=_bbox.bottom;y++){
												for(var x=_bbox.left;x<=_bbox.right;x++){
													if( (dx > 0) && (dy > 0) ) {
														pData[x+(y*w)] = sqr( (x-mx)/dx) + sqr( (y-my)/dy ) < 1;
													}
												}
											}
											break;
										}

			case MASK_DIAMOND:				{
											var mx = (_bbox.left + _bbox.right) / 2;
											var dx = mx-_bbox.left+0.5;
											var my = (_bbox.top + _bbox.bottom) / 2;
											var dy = my-_bbox.top+0.5;

											for(var y=_bbox.top;y<=_bbox.bottom;y++){
												for(var x=_bbox.left;x<=_bbox.right;x++){
													if( (dx > 0) && (dy > 0) ) {
														pData[x+(y*w)] = Math.abs((x-mx)/dx) + Math.abs((y-my)/dy) < 1;
													}
												}
											}
											break;
										}

		}
  
	}

	// merge array is the same size as data... so just "OR" data in.
	if (_merge!=null){
		for (var i = 0; i < pData.length; i++){
			if (_merge[i]) pData[i] = true;
		}
	}
	return pData;
}



// #############################################################################################
/// Function:<summary>
///          	Set the sprite cache 
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_max"></param>
///				
// #############################################################################################
function sprite_set_cache_size(_ind, _max) {

    _ind = yyGetInt32(_ind);

	var pSpr = g_pSpriteManager.Get(_ind);
	if (!pSpr)
	{
		yyError("Trying to adjust the cache on a non-existant sprite (" + string(_ind) + ")");
		return false;
	}

	_max = yyGetInt32(_max);

	var ppTPE = pSpr.ppTPE;
	for (var i = 0; i < pSpr.numb; i++)
	{
		if (ppTPE[i].maxcache > _max)
		{
			ppTPE[i].cache = [];
			ppTPE[i].count = 0;
		}
		ppTPE[i].maxcache = _max;
	}
}


// #############################################################################################
/// Function:<summary>
///          	Set the sprite cache 
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_max"></param>
///				
// #############################################################################################
function sprite_set_cache_size_ext(_ind, _index, _max) {

    _ind = yyGetInt32(_ind);

	var pSpr = g_pSpriteManager.Get(_ind);
	if (!pSpr){
		yyError("Trying to adjust the cache on a non-existant sprite (" + string(_ind) + ")");
		return false;
	}

	_index = yyGetInt32(_index);

	if (_index < 0 || _index > pSpr.numb){
		yyError("Trying to adjust the cache on a non-existant sprite sub image (" + string(_ind) + ", " + string(_index) + ")");
		return;
	}

	_max = yyGetInt32(_max);

	var pTPE = pSpr.ppTPE[_index];
	if (pTPE.maxcache > _max)
	{
		pTPE.cache = [];
		pTPE.count = 0;
	}
	pTPE.maxcache = _max;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function sprite_get_tpe(_index, _subimage)
{
    _index = yyGetInt32(_index);
    _subimage = yyGetInt32(_subimage);

	var pSpr = g_pSpriteManager.Get(_index);
	if (!pSpr)
	{
		yyError("Trying to adjust the cache on a non-existant sprite (" + string(_index) + ")");
		return false;
	}
	if (_subimage < 0 || _subimage > pSpr.numb)
	{
		yyError("Trying to adjust the cache (tpe) on a non-existant sprite sub image (" + string(_index) + ", " + string(_subimage) + ")");
		return;
	}


	var ppTPE = pSpr.ppTPE;
	if (ppTPE[_subimage])
	{
		var pTPE = ppTPE[_subimage];
		var pTP = new yyTPageEntryUserCopy();
		pTP.tpe_x = pTPE.x;
		pTP.tpe_y = pTPE.y;
		pTP.tpe_w = pTPE.w;
		pTP.tpe_h = pTPE.h;
		pTP.tpe_XOffset = pTPE.XOffset;
		pTP.tpe_YOffset = pTPE.YOffset;
		pTP.tpe_CropWidth = pTPE.CropWidth;
		pTP.tpe_CropHeight = pTPE.CropHeight;
		pTP.tpe_ow = pTPE.ow;
		pTP.tpe_oh = pTPE.oh;
		pTP.tpe_tp = pTPE.x;
		pTP.tpe_copy = pTPE.copy;
		pTP.tpe_texture = pTPE.texture;
		return pTP;
	}
	return null;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function sprite_get_texture(_spriteIndex, _frameIndex)
{
    _spriteIndex = yyGetInt32(_spriteIndex);

    if (sprite_exists(_spriteIndex)) {
    
        var spr = g_pSpriteManager.Get(_spriteIndex);        
	    var pTPE = spr.GetTPE(yyGetInt32(_frameIndex));
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
function sprite_get_uvs(_spriteIndex, _frameIndex)
{
    _spriteIndex = yyGetInt32(_spriteIndex);

    if (sprite_exists(_spriteIndex)) {
    
        var spr = g_pSpriteManager.Get(_spriteIndex);
        var pTPE = spr.GetTPE(yyGetInt32(_frameIndex));
	    
	    var texture = pTPE.texture;
	    
	    var oneTexelW = 1.0 / texture.width;
	    var oneTexelH = 1.0 / texture.height;
	    
	    var arrayData = [];
	    arrayData.push(pTPE.x*oneTexelW, pTPE.y*oneTexelH, (pTPE.x+pTPE.CropWidth)*oneTexelW, (pTPE.y+pTPE.CropHeight)*oneTexelH);
	    arrayData.push(pTPE.XOffset, pTPE.YOffset, pTPE.CropWidth/pTPE.ow,pTPE.CropHeight/pTPE.ow );

	    return arrayData;
    }
    return null;
}

function sprite_prefetch(_spriteIndex)
{
	var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));        
	if( pSpr === null)
	{
		 return -1;
	}	
	
	for(var i = 0; i < pSpr.numb; i++)
	{
		var ppTPE = pSpr.ppTPE;
		if (ppTPE[i])
		{
			var pTPE = ppTPE[i];
			if (pTPE.texture)
			{
				if (pTPE.texture.webgl_textureid)
				{
					WebGL_RecreateTexture(pTPE.texture.webgl_textureid);
					return 0;
				}			
			}
		}	
	}
	
	return -1;
}

function sprite_prefetch_multi(_spriteArray)
{
	if (Array.isArray(_spriteArray))
    {
		for(var j = 0; j < _spriteArray.length; j++)
		{
			var pSpr = g_pSpriteManager.Get(_spriteArray[j]);        
			if( pSpr===null)
				continue;
			
			for(var i = 0; i < pSpr.numb; i++)
			{
				var ppTPE = pSpr.ppTPE;
				if (ppTPE[i])
				{
					var pTPE = ppTPE[i];
					if (pTPE.texture)
					{
						if (pTPE.texture.webgl_textureid)
						{
							WebGL_RecreateTexture(pTPE.texture.webgl_textureid);							
						}			
					}
				}	
			}
		}

		return 0;
	}
	else
	{
		return -1;
	}
}



function sprite_flush(_spriteIndex)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));        
	if( pSpr === null)
	{
		 return -1;
	}	
	
	for(var i = 0; i < pSpr.numb; i++)
	{
		var ppTPE = pSpr.ppTPE;
		if (ppTPE[i])
		{
			var pTPE = ppTPE[i];
			if (pTPE.texture)
			{
				if (pTPE.texture.webgl_textureid)
				{
					WebGL_FlushTexture(pTPE.texture.webgl_textureid);
					return 0;
				}			
			}
		}	
	}
	
	return -1;
}

function sprite_flush_multi(_spriteArray)
{
    if (Array.isArray(_spriteArray))
    {
		for(var j = 0; j < _spriteArray.length; j++)
		{
			var pSpr = g_pSpriteManager.Get(_spriteArray[j]);        
			if( pSpr===null)
				continue;
			
			for(var i = 0; i < pSpr.numb; i++)
			{
				var ppTPE = pSpr.ppTPE;
				if (ppTPE[i])
				{
					var pTPE = ppTPE[i];
					if (pTPE.texture)
					{
						if (pTPE.texture.webgl_textureid)
						{
							WebGL_FlushTexture(pTPE.texture.webgl_textureid);							
						}			
					}
				}	
			}
		}

		return 0;
	}
	else
	{
		return -1;
	}
}

function sprite_set_speed(_spriteIndex,_speed,_type)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
    if (pSpr != null)
    {        
		pSpr.playbackspeed = yyGetReal(_speed);
		pSpr.playbackspeedtype = yyGetInt32(_type);

		if (pSpr.sequence != null)
		{
		    pSpr.sequence.m_playbackSpeed = pSpr.playbackspeed;
		    pSpr.sequence.m_playbackSpeedType = pSpr.playbackspeedtype;
		}
	}
}

function sprite_get_speed_type(_spriteIndex)
{
	var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
	if (pSpr != null)
	{
	    if (pSpr.sequence != null)
	    {
	        return pSpr.sequence.m_playbackSpeedType;
	    }
	    else
	    {
	        return pSpr.playbackspeedtype;
	    }
	}
	else
	    return -1;
}

function sprite_get_speed(_spriteIndex)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
    if (pSpr != null)
    {
        if (pSpr.sequence != null)
        {
            return pSpr.sequence.m_playbackSpeed;
        }
        else
        {
            return pSpr.playbackspeed;
        }
    }
    else
        return -1;
}

function sprite_get_nineslice(_spriteIndex)
{
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
    if (pSpr != null)
    {
        if (pSpr.nineslicedata != null)
        {
            return pSpr.nineslicedata;
        }
        else
        {
            // As per the TDD, if the sprite doesn't have a nineslice object then create one and add it to the sprite
            pSpr.nineslicedata = new yyNineSliceData(null);

            return pSpr.nineslicedata;
        }
    }
    else
        return null;
}

function sprite_set_nineslice(_spriteIndex, _nineSlice)
{
    if ((typeof (_nineSlice) !== "object") || (_nineSlice == null) || !(_nineSlice instanceof yyNineSliceData))
    {
        yyError("sprite_set_nineslice() - specified nineslice is not valid");
        return;
    }

    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
    if (pSpr != null)
    {
        pSpr.nineslicedata = _nineSlice;
        pSpr.nineslicedata.cache.dirty = true;
    }
    else
        return null;
}

function sprite_nineslice_create()
{
    return new yyNineSliceData(null);
}


function sprite_get_info( _spriteIndex )
{
    var ret = undefined;
    var pSpr = g_pSpriteManager.Get(yyGetInt32(_spriteIndex));
    if (pSpr != null)
    {
		var type = (pSpr.SWFDictionaryItems != undefined) ? 1 : (pSpr.m_skeletonSprite != undefined) ? 2 : 0;
        ret = new GMLObject();
        variable_struct_set(ret, "width", pSpr.width); //ret.gmlwidth = pSpr.width;
        variable_struct_set(ret, "height", pSpr.height); //ret.gmlheight = pSpr.height;
        variable_struct_set(ret, "xoffset", pSpr.xOrigin); //ret.gmlxoffset = pSpr.xOrigin;
        variable_struct_set(ret, "yoffset", pSpr.yOrigin); //ret.gmlyoffset = pSpr.yOrigin;
        variable_struct_set(ret, "transparent", pSpr.transparent); //ret.gmltransparent = pSpr.transparent;
        variable_struct_set(ret, "smooth", pSpr.smooth); //ret.gmlsmooth = pSpr.smooth;
        variable_struct_set(ret, "preload", pSpr.preload); //ret.gmlpreload = pSpr.preload;
        variable_struct_set(ret, "type", type); //ret.gmltype = (pSpr.SWFDictionaryItems != undefined) ? 1 : (pSpr.m_skeletonSprite != undefined) ? 2 : 0;
        variable_struct_set(ret, "bbox_left", pSpr.bbox.left); //ret.gmlbbox_left = pSpr.bbox.left;
        variable_struct_set(ret, "bbox_right", pSpr.bbox.right); //ret.gmlbbox_right = pSpr.bbox.right;
        variable_struct_set(ret, "bbox_top", pSpr.bbox.top); //ret.gmlbbox_top = pSpr.bbox.top;
        variable_struct_set(ret, "bbox_bottom", pSpr.bbox.bottom); //ret.gmlbbox_bottom = pSpr.bbox.bottom;
        variable_struct_set(ret, "name", pSpr.pName); //ret.gmlname = pSpr.pName;
        variable_struct_set(ret, "num_subimages", pSpr.numb); //ret.gmlnum_subimages = pSpr.numb;
        variable_struct_set(ret, "frame_speed", (pSpr.playbackspeed != undefined) ? pSpr.playbackspeed : -1); //ret.gmlframe_speed = (pSpr.playbackspeed != undefined) ? pSpr.playbackspeed : -1;
        variable_struct_set(ret, "frame_type", (pSpr.playbackspeedtype != undefined) ? pSpr.playbackspeedtype : -1); //ret.gmlframe_type = (pSpr.playbackspeedtype != undefined) ? pSpr.playbackspeedtype : -1;
        variable_struct_set(ret, "use_mask", pSpr.colcheck === yySprite_CollisionType.PRECISE); //ret.gmluse_mask = pSpr.colcheck;
        variable_struct_set(ret, "num_masks", pSpr.colmask.length); //ret.gmlnum_masks  = pSpr.colmask.length;

        switch( type ) {
        case 0: // BITMAP
            {
                var frameArray = [];
                for( var n=0; n<pSpr.ppTPE.length; ++n) {
                    var pTPE = pSpr.ppTPE[n];
                    var tpe = new GMLObject();
					variable_struct_set(tpe, "x", pTPE.x); //tpe.x = pTPE.x;
					variable_struct_set(tpe, "y", pTPE.y); //tpe.y = pTPE.y;
                    variable_struct_set(tpe, "w", pTPE.w); //tpe.gmlw = pTPE.w;
                    variable_struct_set(tpe, "h", pTPE.h); //tpe.gmlh = pTPE.h;
                    variable_struct_set(tpe, "x_offset", pTPE.XOffset); //tpe.gmlx_offset = pTPE.XOffset;
                    variable_struct_set(tpe, "y_offset", pTPE.YOffset); //tpe.gmly_offset = pTPE.YOffset;
                    variable_struct_set(tpe, "crop_width", pTPE.CropWidth); //tpe.gmlcrop_width = pTPE.CropWidth;
                    variable_struct_set(tpe, "crop_height", pTPE.CropHeight); //tpe.gmlcrop_height = pTPE.CropHeight;
                    variable_struct_set(tpe, "original_width", pTPE.ow); //tpe.gmloriginal_width = pTPE.ow;
                    variable_struct_set(tpe, "original_height", pTPE.oh); //tpe.gmloriginal_height = pTPE.oh;
                    variable_struct_set(tpe, "texture", pTPE.tp); //tpe.gmltexture = pTPE.tp;
                    frameArray.push( tpe );
                } // end for

				variable_struct_set(ret, "frames", frameArray); //ret.gmlframes = frameArray;
            } // end block
            break;
        case 1: // SWF
            break;
        case 2: // SPINE
            if (pSpr.m_skeletonSprite != undefined) {

                var pSkelSprite = pSpr.m_skeletonSprite;
                variable_struct_set(ret, "num_atlas", pSkelSprite.m_atlas.pages.length); //ret.gmlnum_atlas = pSkelSprite.m_atlas.pages.length;
                var atlasTexArray = [];
                for( var n=0; n<ret.gmlnum_atlas; ++n) {
                    atlasTexArray.push( pSkelSprite.m_atlas.pages[n].texture.rendererObject );
                } // end for
				variable_struct_set(ret, "atlas_textures", atlasTexArray); //ret.gmlatlas_textures = atlasTexArray;
                variable_struct_set(ret, "premultiplied", pSkelSprite.m_premultiplied); //ret.gmlpremultiplied = pSkelSprite.m_premultiplied;

                var pSkelData = pSkelSprite.m_skeletonData;
                var animNamesArray = [];
                for( var n=0; n<pSkelData.animations.length; ++n) {
                    animNamesArray.push( pSkelData.animations[n].name );
                } // end for
				variable_struct_set(ret, "animation_names", animNamesArray); //ret.gmlanimation_names = animNamesArray;

                var skinNamesArray = [];
                for( var n=0; n<pSkelData.skins.length; ++n) {
                    skinNamesArray.push( pSkelData.skins[n].name );
                } // end for
				variable_struct_set(ret, "skin_names", skinNamesArray); //ret.gmlskin_names = skinNamesArray;

                var bonesArray = [];
                for( var n=0; n<pSkelData.bones.length ; ++n) {
                    var bone = pSkelData.bones[n];
                    var nbone = new GMLObject();

                    variable_struct_set(nbone, "parent", (bone.parent != undefined) ? bone.parent.name : undefined); //nbone.gmlparent = (bone.parent != undefined) ? bone.parent.name : undefined;
                    variable_struct_set(nbone, "name", bone.name); //nbone.gmlname = bone.name;
                    variable_struct_set(nbone, "index", bone.index); //nbone.gmlindex = bone.index;
                    variable_struct_set(nbone, "length", bone.length); //nbone.gmllength = bone.length;
                    variable_struct_set(nbone, "x", bone.x); //nbone.gmlx = bone.x;
                    variable_struct_set(nbone, "y", bone.y); //nbone.gmly = bone.y;
                    variable_struct_set(nbone, "rotation", bone.rotation); //nbone.gmlrotation = bone.rotation;
                    variable_struct_set(nbone, "scale_x", bone.scaleX); //nbone.gmlscale_x = bone.scaleX;
                    variable_struct_set(nbone, "scale_y", bone.scaleY); //nbone.gmlscale_y = bone.scaleY;
                    variable_struct_set(nbone, "shear_x", bone.shearX); //nbone.gmlshear_x = bone.shearX;
                    variable_struct_set(nbone, "shear_y", bone.shearY); //nbone.gmlshear_y = bone.shearY;
                    variable_struct_set(nbone, "transform_mode", bone.transformMode); //nbone.gmltransform_mode = bone.transformMode;
                    bonesArray.push( nbone );
                } // end for
				variable_struct_set(ret, "bones", bonesArray); //ret.gmlbones = bonesArray;

                var slotsArray = [];
               
                for( var n=0; n<pSkelData.slots.length; ++n) {
                    var slot = pSkelData.slots[n];
                    var nslot = new GMLObject();

                    variable_struct_set(nslot, "name", slot.name); //nslot.gmlname = slot.name;
                    variable_struct_set(nslot, "index", slot.index); //nslot.gmlindex = slot.index;
                    variable_struct_set(nslot, "bone", (slot.boneData != undefined) ? slot.boneData.name : "(none)"); //nslot.gmlbone = (slot.boneData != undefined) ? slot.boneData.name : "(none)";
                    variable_struct_set(nslot, "attachment", slot.attachmentName); //nslot.gmlattachment = slot.attachmentName;
                    variable_struct_set(nslot, "red", slot.color.r); //nslot.gmlred = slot.color.r;
                    variable_struct_set(nslot, "green", slot.color.g); //nslot.gmlgreen = slot.color.g;
                    variable_struct_set(nslot, "blue", slot.color.b); //nslot.gmlblue = slot.color.b;
                    variable_struct_set(nslot, "alpha", slot.color.a); //nslot.gmlalpha = slot.color.a;
                    variable_struct_set(nslot, "blend_mode", slot.blendMode); //nslot.gmlblend_mode = slot.blendMode;
                    if (nslot.darkColor != undefined) {
                        variable_struct_set(nslot, "dark_red", slot.darkColor.r); //nslot.gmldark_red = slot.darkColor.r;
                        variable_struct_set(nslot, "dark_green", slot.darkColor.g); //nslot.gmldark_green = slot.darkColor.g;
                        variable_struct_set(nslot, "dark_blue", slot.darkColor.b); //nslot.gmldark_blue = slot.darkColor.b;
                        variable_struct_set(nslot, "dark_alpha", slot.darkColor.a); //nslot.gmldark_alpha = slot.darkColor.a;
                    } // end if

                    var slotAttachmentsArray = pSpr.m_skeletonSprite.GetAttachmentsForSlot(slot.name);
                    variable_struct_set(nslot, "attachments", slotAttachmentsArray);

                    slotsArray.push(nslot);
                } // end for
				variable_struct_set(ret, "slots", slotsArray); //ret.gmlslots = slotsArray;
            } // end if
            break;

        } // end switch

        variable_struct_set(ret, "nineslice", (pSpr.nineslicedata != undefined) ? pSpr.nineslicedata : undefined); //ret.gmlnineslice = (pSpr.nineslicedata != undefined) ? pSpr.nineslicedata : undefined;

        if (pSpr.sequence != undefined) {
            // get broadcast messages
            var messagesArray = [];
            var pStore = pSpr.sequence.m_messageEventKeyframeStore;
            if (pStore != undefined) {
                for(var n=0; n<pStore.numKeyframes; ++n ) {
                    var pKey = pStore.keyframes[n];
                    var time = pKey.m_key;
                    for( var k in pKey.m_channels) {
                        var tk = pKey.m_channels[k];
                        if (tk.m_events != undefined) {
                            for( var e=0; e<tk.m_events.length; ++e) {
                                var entry = new GMLObject();
                                variable_struct_set(entry, "frame", time); //entry.gmlframe = time;
                                variable_struct_set(entry, "message", tk.m_events[e]); //entry.gmlmessage = tk.m_events[e];
                                messagesArray.push(entry);
                            } // end for
                        } // end if
                    } // end for
                } // end for
            } // end if
			variable_struct_set(ret, "messages", messagesArray); //ret.gmlmessages = messagesArray;

            // get frame timing
            var frameInfo = [];
            var pTrack = pSpr.sequence.m_tracks[0];
            if (pTrack != undefined) {
                var pStore = pTrack.m_keyframeStore;
                for( var n=0; n<pStore.numKeyframes; ++n) {
                    var pKey = pStore.keyframes[n];
                    var time = pKey.m_key;
                    var entry = new GMLObject();
                    variable_struct_set(entry, "frame", time); //entry.gmlframe = time;
                    variable_struct_set(entry, "duration", pKey.m_length);
                    for( var k in pKey.m_channels) {
                        var tk = pKey.m_channels[k];
                        variable_struct_set(entry, "image_index", tk.m_imageIndex); //entry.gmlimage_index = tk.m_imageIndex;
                        break;
                    } // end for
                    frameInfo.push(entry);
                } // end for
            } // end if
			variable_struct_set(ret, "frame_info", frameInfo); //ret.gmlframe_info = frameInfo;
        } // end if

    } // end if
    return ret;

}


