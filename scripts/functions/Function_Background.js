// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Background.js
// Created:         26/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 22/02/2011		V1.0        MJD     1st version, blocked in....
// 
// **********************************************************************************************************************




// #############################################################################################
/// Function:<summary>
///             Checks to see if a background exists
///          </summary>
///
/// In:		 <param name="_resourceindex">RESOURCE index of background</param>
/// Out:	 <returns>
///				true for yes, false for no.
///			 </returns>
// #############################################################################################
function background_exists(_resourceindex)
{
    var background = g_pBackgroundManager.GetImage(_resourceindex);
	if ((background === null) || (background === undefined)) { 
	    return false;
	}
    return true;
}

// #############################################################################################
/// Function:<summary>
///             Gets the name of the background
///          </summary>
///
/// In:		 <param name="_ind">RESOURCE index of background</param>
/// Out:	 <returns>
///				Name, or "" if it doesn't exist
///			 </returns>
// #############################################################################################
function background_get_name(_resourceindex)
{
	var pBack = g_pBackgroundManager.GetImage(_resourceindex);
    if( !pBack) return "";
    return pBack.pName;
}
function background_name(_resourceindex) { return background_get_name(_resourceindex); }


// #############################################################################################
/// Function:<summary>
///             Get the background image width
///          </summary>
///
/// In:		 <param name="_resourceindex">RESOURCE index of background</param>
/// Out:	 <returns>
///				Width of background, or 0 if not found
///			 </returns>
// #############################################################################################
function background_get_width(_resourceindex)
{
	var pBack = g_pBackgroundManager.GetImage(_resourceindex);
	if (!pBack) return 0;
	if (pBack.TPEntry===undefined) return 0;
    return pBack.TPEntry.ow;
}

// #############################################################################################
/// Function:<summary>
///             Get the background image height
///          </summary>
///
/// In:		 <param name="_ind">RESOURCE index of background</param>
/// Out:	 <returns>
///				Height of background, or 0 if not found
///			 </returns>
// #############################################################################################
function background_get_height(_resourceindex)
{
	var pBack = g_pBackgroundManager.GetImage(_resourceindex);
    if( !pBack) return 0;
    if( pBack.TPEntry===undefined) return 0;
    return pBack.TPEntry.oh;
}


// #############################################################################################
/// Function:<summary>
///             Creates a background by copying the given area from the screen. removeback indicates 
///             whether to make all pixels with the background color (left-bottom pixel) transparent. 
///             smooth indicates whether to smooth the boundaries. This function makes it possible to 
///             create any background you want. Draw the image on the screen using the drawing functions 
///             and next create a background from it. (If you don't do this in the drawing event you 
///             can even do it in such a way that it is not visible on the screen by not refreshing 
///             the screen.) The function returns the index of the new background. A work of caution 
///             is required here. Even though we speak about the screen, it is actually the drawing 
///             region that matters. The fact that there is a window on the screen and that the image
///             might be scaled in this window does not matter.
///          </summary>
///
/// In:		 <param name="_x"></param>
///			 <param name="_y"></param>
///			 <param name="_w"></param>
///			 <param name="_h"></param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function background_create_from_screen(_x,_y,_w,_h,_removeback,_smooth)
{
    var surfid = surface_create(_w,_h);
    var pDest = g_Surfaces.Get(surfid);

    // Fill the surface with the colour
	var pImg = pDest.getContext('2d');       
	pImg.drawImage( canvas,-_x,-_y);
	if (_removeback) {
	    Graphics_RemoveBackground_RELEASE(pImg, _w, _h);
	}
    
	var pNew = new yyBackgroundImage();
	var pTPE = new yyTPageEntry();
    pNew.TPEntry = pTPE;
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = _w;
    pTPE.h = _h;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;
    pTPE.tp = surfid;            // NEG to indicates a surface
    pTPE.texture = pDest;

	return g_pBackgroundManager.AddBackgroundImage(pNew);
}


// #############################################################################################
/// Function:<summary>
///             Creates a background by copying the given area from the surface with the given id. 
///             removeback indicates whether to make all pixels with the background color (left-bottom pixel) 
///             transparent. smooth indicates whether to smooth the boundaries. This function 
///             makes it possible to create any background you want. Draw the image on the surface 
///             using the drawing functions and next create a background from it. Note that alpha 
///             values are maintained in the background.
///          </summary>
///
/// In:		 <param name="_id"></param>
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
function background_create_from_surface(_id,_x,_y,_w,_h,_removeback,_smooth)
{
    var pSrc = g_Surfaces.Get(_id);
    var surfid = surface_create(_w,_h);
    var pDest = g_Surfaces.Get(surfid);

    // Fill the surface with the colour
	var pImg = pDest.getContext('2d');       
	pImg.drawImage(pSrc,-_x,-_y);	
	if (_removeback) {
	    Graphics_RemoveBackground_RELEASE(pImg, _w, _h);
	}
    
	var pNew = new yyBackgroundImage();
	var pTPE = new yyTPageEntry();
    pNew.TPEntry = pTPE;
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = _w;
    pTPE.h = _h;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;
	pTPE.tp = surfid;            // NEG to indicates a surface
	pTPE.texture = pDest;

	return g_pBackgroundManager.AddBackgroundImage(pNew);
}

// #############################################################################################
/// Function:<summary>
///             Creates a background of the given size and with the given colour
///          </summary>
///
/// In:		 <param name="_w">Width of background</param>
///			 <param name="_h">Height of background</param>
///			 <param name="_colour"></param>
/// Out:	 <returns>
///				new background index, or -1 for error....
///			 </returns>
// #############################################################################################
function background_create_color(_w,_h,_colour)
{
    var surf = surface_create(_w,_h);
    var pSurf = g_Surfaces.Get(surf);

    // Fill the surface with the colour
	var pImg = pSurf.getContext('2d');       
	pImg.globalAlpha = 1.0;
	pImg.fillStyle = GetHTMLRGBA( ConvertGMColour(_colour), 1);
	pImg.fillRect(0,0, _w,_h);    
    
	var pNew = new yyBackgroundImage();
	var pTPE = new yyTPageEntry();
    pNew.TPEntry = pTPE;
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = _w;
    pTPE.h = _h;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;
	pTPE.tp = surf;            // NEG to indicates a surface
	pTPE.texture = pSurf;

	return g_pBackgroundManager.AddBackgroundImage(pNew);
}
var background_create_colour = background_create_color;

// #############################################################################################
/// Function:<summary>
///              Creates a background of the given size and with the given color. 
///				 KIND = 0=horizontal 1=vertical, 2= rectangle, 3=ellipse, 4=double horizontal, 5=double vertical. It returns the index of the new 
///				 only 0 and 1 supported.
///          </summary>
///
/// In:		 <param name="_w">Width of background</param>
///			 <param name="_h">Height of background</param>
///			 <param name="_col1"></param>
///			 <param name="_col2"></param>
///			 <param name="_kind"></param>
/// Out:	 <returns>
///				new background index, or -1 for error....
///			 </returns>
// #############################################################################################
function    background_create_gradient(_w,_h,_col1,_col2,_kind) 
{
    var surf = surface_create(_w,_h);
    var pSurf = g_Surfaces.Get(surf);

    // Fill the surface with the colour
	var pImg = pSurf.getContext('2d');       
	pImg.globalAlpha = 1.0;
	var grd;
	if( _kind==0 ){
		grd = pImg.createLinearGradient(0, 0, _w, 0);
	}else{
		grd = pImg.createLinearGradient(0, 0, 0, _h);
	}
	grd.addColorStop("0", GetHTMLRGBA(ConvertGMColour(_col1), 1));
	grd.addColorStop("1.0", GetHTMLRGBA(ConvertGMColour(_col2), 1));
	pImg.fillStyle = grd;
	pImg.fillRect(0,0, _w,_h);    

	var pNew = new yyBackgroundImage();
	var pTPE = new yyTPageEntry();
    pNew.TPEntry = pTPE;
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = _w;
    pTPE.h = _h;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;
	pTPE.tp = surf;            // NEG to indicates a surface
	pTPE.texture = pSurf;

	return g_pBackgroundManager.AddBackgroundImage(pNew);
}


// #############################################################################################
/// Function:<summary>
///             Delete a background
///          </summary>
///
/// In:		 <param name="_ind">inde of background to delete</param>
///				
// #############################################################################################
function background_delete( _ind ) {
	return g_pBackgroundManager.DeleteImage(_ind );	
}



// #############################################################################################
/// Function:<summary>
///             Duplicate a background
///          </summary>
///
/// In:		 <param name="_ind">index of background to duplicate</param>
///				
// #############################################################################################
function background_duplicate(_back) 
{
	var pBack = g_pBackgroundManager.GetImage(_back);
	if (pBack != null && pBack != undefined)
	{
		var pImage = Graphics_ExtractImage(pBack.TPEntry);
		var pNew = new yyBackgroundImage();

		pNew.pName = pBack.pName;
		pNew.transparent = pBack.transparent;
		pNew.smooth = pBack.smooth;
		pNew.preload = pBack.preload;
		pNew.copy = true;

		var pTPE = pNew.TPEntry = new yyTPageEntry();
		pTPE.copy(pBack.TPEntry);
		pTPE.tp = Graphics_AddImage(pImage);
		pTPE.texture = g_Textures[pTPE.tp];
		pTPE.texture.complete = true;
		pTPE.x = 0;
		pTPE.y = 0;

		return g_pBackgroundManager.AddBackgroundImage(pNew);
	}
	return -1;
}


// #############################################################################################
/// Function:<summary>
///              Assigns the indicated background to dest background
///          </summary>
///
/// In:		 <param name="_dest">inde of background to assign</param>
///    		 <param name="_src">inde of background to assign</param>
///				
// #############################################################################################
function background_assign( _dest, _src )
{
	var pDest = g_pBackgroundManager.GetImage(_dest);
	var pSrc = g_pBackgroundManager.GetImage(_src);
	
	if( pDest!=null && pDest!=undefined && pSrc!=null && pSrc!= undefined)
	{
		var pImage = Graphics_ExtractImage(pSrc.TPEntry);
		var pNew = new yyBackgroundImage();

		pNew.pName = pSrc.pName;
		pNew.transparent = pSrc.transparent;
		pNew.smooth = pSrc.smooth;
		pNew.preload = pSrc.preload;

		pNew.TPEntry = new yyTPageEntry();
		pNew.TPEntry.copy(pSrc.TPEntry);
		pNew.TPEntry.tp = Graphics_AddImage(pImage);
		pNew.TPEntry.texture = g_Textures[pNew.TPEntry.tp];
		pNew.TPEntry.texture.complete = true;
		pNew.TPEntry.x = 0;
		pNew.TPEntry.y = 0;


		return g_pBackgroundManager.SetBackgroundImage(_dest,pNew);	
	}	
}


// #############################################################################################
/// Function:<summary>
///          	Draws the background at position (x,y). 
///             (Without color blending and no alpha transparency.)
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background(_back,_x,_y) 
{
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;
    Graphics_TextureDrawSimple(pImage.TPEntry, _x, _y, g_GlobalAlpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the background stretched to the indicated region.
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_stretched(_back, _x, _y, _w, _h) {
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;
	Graphics_DrawStretchedExt(pImage.TPEntry, _x, _y, _w, _h, 0xffffff, g_GlobalAlpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the background tiled so that it fills the entire room.
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_tiled(_back,_x,_y) 
{
    var pImage = g_pBackgroundManager.GetImage( _back ); //pBack.index );
    if (!pImage) return;
    Graphics_TextureDrawTiled(pImage.TPEntry, _x, _y, 1, 1, true, true, 0xffffff, g_GlobalAlpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the indicated part of the background with the top-left corner of the 
///             part at position (x,y).
///          </summary>
///
/// In:		<param name="_back"></param>
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
function draw_background_part(_back,_left,_top,_width,_height,_x,_y) 
{
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;

	Graphics_DrawPart(pImage.TPEntry, _left, _top, _width, _height, _x, _y, 1, 1, clWhite, g_GlobalAlpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the background scaled and rotated with blending color 
///             (use c_white for no blending) and transparency alpha (0-1).
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_rot"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_ext(_back,_x,_y,_xscale,_yscale,_rot,_color,_alpha) 
{
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;
	var c = ConvertGMColour(_color);
	Graphics_TextureDraw(pImage.TPEntry, 0, 0, _x, _y, _xscale, _yscale, _rot* Math.PI / 180.0, c, c, c, c, _alpha);	
}

// #############################################################################################
/// Function:<summary>
///          	Draws the background stretched to the indicated region. color is the blending 
///             color and alpha indicates the transparency setting.
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_stretched_ext(_back,_x,_y,_w,_h,_color,_alpha) 
{
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;
    _color = ConvertGMColour(_color);
	Graphics_DrawStretchedExt(pImage.TPEntry, _x, _y, _w, _h, _color, _alpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the background tiled so that it fills the entire room but now with scale 
///             factors and a color and transparency setting.
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_tiled_ext(_back,_x,_y,_xscale,_yscale,_color,_alpha) 
{
    var pImage = g_pBackgroundManager.GetImage( _back ); //pBack.index );
    if (!pImage) return;
    _color = ConvertGMColour(_color);
    //MissingFunction("draw_background_tiled_ext()");
    Graphics_TextureDrawTiled(pImage.TPEntry, _x, _y, _xscale, _yscale, true, true, _color, _alpha);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the indicated part of the background with the top-left corner of the part 
///             at position (x,y) but now with scale factors and a color and transparency setting.
///          </summary>
///
/// In:		<param name="_back"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_background_part_ext(_back,_left,_top,_width,_height,_x,_y,_xscale,_yscale,_color,_alpha) 
{
	var pImage = g_pBackgroundManager.GetImage(_back);
	if (!pImage) return;
    _color = ConvertGMColour(_color);
	Graphics_DrawPart(pImage.TPEntry, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _color, _alpha);
}

// #############################################################################################
/// Function:<summary>
///          	The most general drawing function. It draws the indicated part of the background 
///             with the top-left corner of the part at position (x,y) but now with scale factors, 
///             a rotation angle, a color for each of the four vertices 
///             (top-left, top-right, bottom-right, and bottom-left), and an alpha transparency value. 
///             Note that rotation takes place around the top-left corner of the part.
///          </summary>
///
/// In:		<param name="_back"></param>
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
function draw_background_general(_back,_left,_top,_width,_height,_x,_y,_xscale,_yscale,_rot,_c1,_c2,_c3,_c4,_alpha) {
	var pBack = g_pBackgroundManager.GetImage(_back);
	if (!pBack) return;

    _c1 = ConvertGMColour(_c1);
    _c2 = ConvertGMColour(_c2);
    _c3 = ConvertGMColour(_c3);
    _c4 = ConvertGMColour(_c4);
	Graphics_DrawGeneral(pBack.TPEntry, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _rot* Math.PI / 180.0, _c1, _c2, _c3, _c4, _alpha);

}

// #############################################################################################
/// Function:<summary>
///          	Changes the alpha (transparancy) values in the background with index ind using 
///				the intensity values in the background back. This cannot be undone.
///          </summary>
///
/// In:		<param name="ind"></param>
///			<param name="back"></param>
///				
// #############################################################################################
function background_set_alpha_from_background(_ind, _back) 
{
	var pDest = g_pBackgroundManager.GetImage(_ind);
	var pSrc = g_pBackgroundManager.GetImage(_back);
	if (!pDest || !pSrc) return;

	if (!pDest.copy)
	{
		var pImage = Graphics_ExtractImage(pDest.TPEntry);
		var pNew = new yyBackgroundImage();

		pDest.TPEntry.tp = Graphics_AddImage(pImage);
		pDest.TPEntry.texture = g_Textures[pSrc.TPEntry.tp]; //Fritz: this was reffing pBack, presuming this should be source?
		pDest.TPEntry.texture.complete = true;
		pDest.TPEntry.x = 0;
		pDest.TPEntry.y = 0;
		pDest.copy = true;
	}

	CopyImageToAlpha(pDest.TPEntry, pSrc.TPEntry);

}


// #############################################################################################
/// Function:<summary>
///             Load an image and create a background from it.
///          </summary>
///
/// In:		 <param name="_filename">Name of image to load</param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				new background index, or -1 for error....
///			 </returns>
// #############################################################################################
function background_add(_filename, _removeback, _smooth) 
{
	var pNew = new yyBackgroundImage();
	pNew.pName = "";
	pNew.transparent = _removeback;
	pNew.smooth = _smooth;
	pNew.preload = true;

    // add new background to manager
	var NewIndex = g_pBackgroundManager.AddBackgroundImage(pNew);


    // Now set "loading" going
	if (_filename.substring(0, 5) == "file:") return -1;
	var pFileName = _filename;

	var image = Graphics_AddTexture(pFileName);
	g_Textures[image].onload = ASync_ImageLoad_Callback;
	g_Textures[image].onerror = ASync_ImageLoad_Error_Callback;
    
    // add loading file to ASync manager
    g_pASyncManager.Add( NewIndex, _filename, ASYNC_BACKGROUND, g_Textures[image] );


    // create a new TPage entry for the background
    var pTPE = new yyTPageEntry();
    pNew.TPEntry = pTPE;
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = 0;
    pTPE.h = 0;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;

    pTPE.tp = image;
	pTPE.texture = g_Textures[pTPE.tp];

	return NewIndex;
}


// #############################################################################################
/// Function:<summary>
///             Replace a background with the one specified in the filename.
///          </summary>
///
/// In:		 <param name="_ind">index of background to replace</param>
///			 <param name="_filename">filename of image to load</param>
///			 <param name="_removeback"></param>
///			 <param name="_smooth"></param>
/// Out:	 <returns>
///				new background index, or -1 for error....
///			 </returns>
// #############################################################################################
function background_replace( _ind, _filename, _removeback, _smooth) {

	var pNew = g_pBackgroundManager.GetImage(_ind);
	pNew.transparent = _removeback;
	pNew.smooth = _smooth;

    // Now set "loading" going
	if (_filename.substring(0, 5) == "file:") return -1;
	var pFileName = _filename;
    
    var originalTexId = pNew.TPEntry.texture.webgl_textureid;
	var image = Graphics_AddTexture(pFileName);
	g_Textures[image].webgl_textureid = originalTexId;          //TIZEN fix: prevent binding of new texture until it has loaded, otherwise WebGL crashes
    g_Textures[image].onload = ASync_ImageLoad_Callback;
	g_Textures[image].onerror = ASync_ImageLoad_Error_Callback;
    
    // add loading file to ASync manager
    g_pASyncManager.Add( _ind, _filename, ASYNC_BACKGROUND, g_Textures[image] );


    // create a new TPage entry for the background
    var pTPE = pNew.TPEntry;    
    
    pTPE.x = 0;     
    pTPE.y = 0;
    pTPE.w = 0;
    pTPE.h = 0;
    pTPE.XOffset = 0;
    pTPE.YOffset = 0;
    pTPE.CropWidth = pTPE.w;
    pTPE.CropHeight = pTPE.h;
    pTPE.ow = pTPE.w;
    pTPE.oh = pTPE.h;

    pTPE.hvcached = null;
    pTPE.vh_til = 0;
    pTPE.tp = image;
	pTPE.texture = g_Textures[pTPE.tp];
    
	return _ind;
}


// #############################################################################################
/// Function:<summary>
///             Get the texture (tpage probably) associated with this background
///          </summary>
// #############################################################################################
function background_get_texture(_ind) {

    var pDest = g_pBackgroundManager.GetImage(_ind);
    if (pDest) {
    
        return ({ WebGLTexture: pDest.TPEntry.texture, TPE: pDest.TPEntry });
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
function background_get_uvs(_ind) {

    var pDest = g_pBackgroundManager.GetImage(_ind);
    if (pDest) {
                        
	    var pTPE = pDest.TPEntry;
	    
	    var texture = pTPE.texture;
	    
	    var oneTexelW = 1.0 / texture.m_Width;
	    var oneTexelH = 1.0 / texture.m_Height;
	    
	    var arrayData = [];
	    arrayData.push(pTPE.x*oneTexelW, pTPE.y*oneTexelH, (pTPE.x+pTPE.CropWidth)*oneTexelW, (pTPE.y+pTPE.CropHeight)*oneTexelH);
	    
	    return arrayData;
    }
    return null;
}

function background_prefetch(_backgroundIndex)
{
    var pBack = g_pBackgroundManager.Get(_backgroundIndex);        
	if( pBack===null)
	{
		 return -1;
	}	

	var pTPE = pBack.TPEntry;
	if (pTPE.texture)
	{
		if (pTPE.texture.webgl_textureid)
		{
			WebGL_RecreateTexture(pTPE.texture.webgl_textureid);
			return 0;
		}			
	}
	
	return -1;
}

function background_prefetch_multi(_backgroundArray)
{
    if (Array.isArray(_backgroundArray))
    {
		for(var j = 0; j < _backgroundArray.length; j++)
		{
			var pBack = g_pBackgroundManager.Get(_backgroundArray[j]);        
			if( pBack===null)
			{
				return -1;
			}	

			var pTPE = pBack.TPEntry;
			if (pTPE.texture)
			{
				if (pTPE.texture.webgl_textureid)
				{
					WebGL_RecreateTexture(pTPE.texture.webgl_textureid);
					return 0;
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

function background_flush(_backgroundIndex)
{	
    var pBack = g_pBackgroundManager.Get(_backgroundIndex);        
	if( pBack===null)
	{
		 return -1;
	}	

	var pTPE = pBack.TPEntry;
	if (pTPE.texture)
	{
		if (pTPE.texture.webgl_textureid)
		{
			WebGL_FlushTexture(pTPE.texture.webgl_textureid);
			return 0;
		}			
	}
	
	return -1;
}

function background_flush_multi(_backgroundArray)
{
    if (Array.isArray(_backgroundArray))
    {
		for(var j = 0; j < _backgroundArray.length; j++)
		{
			var pBack = g_pBackgroundManager.Get(_backgroundArray[j]);        
			if( pBack===null)
			{
				return -1;
			}	

			var pTPE = pBack.TPEntry;
			if (pTPE.texture)
			{
				if (pTPE.texture.webgl_textureid)
				{
					WebGL_FlushTexture(pTPE.texture.webgl_textureid);
					return 0;
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