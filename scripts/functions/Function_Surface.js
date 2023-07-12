
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Surface.js
// Created:			09/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 09/06/2011		V1.0        MJD     1st verison. Functions blocked in...
// 
// **********************************************************************************************************************
// Surface stack so you can push multiple surfaces and pop them off again.
var g_SurfaceStack = [];
var g_createsurfacedepthbuffers = true;

// #############################################################################################
/// Function:<summary>
///          	Resize a sirface - does not keep the contents
///          </summary>
///
/// In:		<param name="_id"></param>
/// 		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var surface_resize = surface_resize_RELEASE;
function surface_resize_RELEASE(_id, _w, _h) 
{
    _id = yyGetInt32(_id);
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

    // if we're resizing the application surface, don't... store it, and 
	// it'll happen at the start of the NEXT frame.
    if( _id == g_ApplicationSurface )
    {
        g_NewApplicationSize = true;
        g_NewApplicationWidth = _w;
        g_NewApplicationHeight = _h;
        return 1;
    }

    if( !surface_exists(_id) )
    {
        yyError("Surface does not exist");
        return 0;
    }


    if (CheckForSurface(_id)) {
        ErrorOnce("Error: Surface in use via surface_set_target(). It can not be resized until it has been removed from the surface stack.");
        return;
    }

    //resize...
    var pSurf = g_Surfaces.Get(_id);
    var format = eTextureFormat_A8R8G8B8;

    if (g_webGL)
    {
        format = pSurf.texture.webgl_textureid.format;
    }
    
    surface_create( _w,_h, format, _id );   //create new surface and replace existing in _id slot

    return 0;
}

function surface_depth_disable(_disable)
{
    if (yyGetBool(_disable))
    {
        g_createsurfacedepthbuffers = false;
    }
    else
    {
        g_createsurfacedepthbuffers = true;
    }
}

function surface_get_depth_disable()
{
    return g_createsurfacedepthbuffers ? false : true;
}


// #############################################################################################
/// Function:<summary>
///          	Creates a surface of the indicated width and height. Returns the id of the surface, 
///             which must be used in all further calls. Note that the surface will not be cleared. 
///             This is the responsibility of the user. (Set it as a target and call the appropriate 
///             clear function.)
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var surface_create = surface_create_RELEASE;
function surface_create_RELEASE(_w, _h, _format, _forceid) 
{
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

    if (_w <= 0 || _h <= 0) {
        yyError("create_surface : Trying to create a surface with size equal to or less than zero.");
    }

	var pSurf = document.createElement(g_CanvasName);
    pSurf.m_Width = pSurf.width = _w;
    pSurf.m_Height = pSurf.height = _h;
    pSurf.complete = true;
    pSurf.canvas_element = false;
	pSurf.name = "";    

	pSurf.graphics = pSurf.getContext('2d');
	Graphics_AddCanvasFunctions(pSurf.graphics); 			// update for OUR functions.


    // Create TP index
	var pTPE = new yyTPageEntry();
	pSurf.m_pTPE = pTPE;
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
	if( _forceid != undefined )
	{
	    //replace existing surface at index _forceid
	    g_Surfaces.Set( _forceid, pSurf);    
	    pTPE.tp = _forceid;
	}
	else
	{
	    pTPE.tp = g_Surfaces.Add(pSurf);    
	}
	pTPE.texture = pSurf;				// store RAW texture

    // Add cache details	
    pTPE.cache = [];                // clear colour cache
    pTPE.count = 0;
    pTPE.maxcache= 4;				// Max number of times to cache this image.

    // Add "tiling" cache details
    pTPE.vh_tile = 0;               // How is it tiled?
    pTPE.hvcached = null;           // tiling cache.

    //  Surfaces ""ARE"" single images....
    pTPE.singleimage = pSurf;       
	
	
	return pTPE.tp;
}



// #############################################################################################
/// Function:<summary>
///             Uses a CANVAS ELEMENT as a surface!
///          	Creates a surface of the indicated width and height. Returns the id of the surface, 
///             which must be used in all further calls. Note that the surface will not be cleared. 
///             This is the responsibility of the user. (Set it as a target and call the appropriate 
///             clear function.)
///          </summary>
///
/// In:		<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function surface_create_ext(_name, _w,_h, _format) 
{
    _name = yyGetString(_name);
    _w = yyGetInt32(_w);
    _h = yyGetInt32(_h);

	var pSurf = document.getElementById(_name);
	if (!pSurf)
	{
		WarningFunction("Can not find pre-created canvas element: " + _name);
		return surface_create(_w, _h, _format);
	}
	pSurf.name = _name;
    pSurf.m_Width = pSurf.width = _w;
    pSurf.m_Height = pSurf.height = _h;
    pSurf.complete = true;
    pSurf.canvas_element = true;    

    pSurf.graphics = pSurf.getContext('2d');
    Graphics_AddCanvasFunctions(pSurf.graphics); 			// update for OUR functions
    
    
    pSurf.onmousemove = onMouseMove;
    pSurf.onmousedown = onMouseDown;
    pSurf.onmouseup = onMouseUp;
    
    // Create TP index
	var pTPE = new yyTPageEntry();
	pSurf.m_pTPE = pTPE;
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
	pTPE.tp = g_Surfaces.Add(pSurf);    
	pTPE.texture = pSurf;				// store RAW texture

    // Add cache details	
    pTPE.cache = [];                // clear colour cache
    pTPE.count = 0;
    pTPE.maxcache= 4;				// Max number of times to cache this image.

    // Add "tiling" cache details
    pTPE.vh_tile = 0;               // How is it tiled?
    pTPE.hvcached = null;           // tiling cache.

    //  Surfaces ""ARE"" single images....
    pTPE.singleimage = pSurf;       
	
	
	return pTPE.tp;
}



// #############################################################################################
/// Function:<summary>
///          	Frees the memory used by the surface.
///          </summary>
///
/// In:		<param name="_id">surface ID</param>
///				
// #############################################################################################
var surface_free = surface_free_RELEASE;
function surface_free_RELEASE(_id) 
{
    _id = yyGetInt32(_id);

    if(_id < 0)
    {
        return;
    }

    if (!surface_exists(_id)) {
        return 0;
    }

    if (CheckForSurface(_id)) {
        ErrorOnce("Error: Surface in use via surface_set_target(). It can not be freed until it has been removed from the surface stack.");
        return;
    }
	g_Surfaces.DeleteIndex(_id);
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the surface with the indicated id exists.
///          </summary>
///
/// In:		<param name="_id">Check to see if the surface exists</param>
/// Out:	<returns>
///				1 for yes, 0 for no.  (not true/false as native does values)
///			</returns>
// #############################################################################################
function surface_exists(_id) 
{
    if (g_Surfaces.Get(yyGetInt32(_id)) != null) return 1; else return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the width of the surface.
///          </summary>
///
/// In:		<param name="_id">Get the width of the surface</param>
/// Out:	<returns>
///				width of surface, or 0 if not found
///			</returns>
// #############################################################################################
function surface_get_width(_id) 
{
    if( _id == g_ApplicationSurface ){
		return g_ApplicationWidth;
	}

    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
	if( pSurf != null)
	{
		return pSurf.m_Width;
	}
    return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the height of the surface.
///          </summary>
///
/// In:		<param name="_id">ID of surface</param>
/// Out:	<returns>
///				Height of surface, or 0 if not found
///			</returns>
// #############################################################################################
function surface_get_height(_id) 
{
    if( _id == g_ApplicationSurface ){
		return g_ApplicationHeight;
	}

    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
	if( pSurf != null)
	{
		return pSurf.m_Height;
	}
	return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the texture corresponding to the surface. This can be used to draw textured 
///             objects with the image of the surface.
///          </summary>
///
/// In:		<param name="_id">ID of surface</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function surface_get_texture(_id) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (pSurf != null)
    {      
        return ({ WebGLTexture: pSurf.texture, TPE: pSurf.m_pTPE }); 
    }
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Search for a surface ID in the current surface stack list
///          </summary>
/// Out:	<returns>
///				return true for found, false for not found.
///			</returns>
// #############################################################################################
function CheckForSurface(_id)
{
    _id = yyGetInt32(_id);

    if (g_CurrentSurfaceId == _id) return true;
    var len = g_CurrentSurfaceIdStack.length;
    for (var i = 0; i < len; i++) {
        if (g_CurrentSurfaceIdStack[i] == _id) return true;
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	Sets the indicated surface as the drawing target. All subsequent drawing happens 
///             on this surface. It resets the projection to simply cover the surface.
///				This
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				return true;
///			</returns>
// #############################################################################################
var surface_set_target_system = surface_set_target_system_RELEASE;
function surface_set_target_system_RELEASE(_id) 
{
    _id = yyGetInt32(_id);

    var pSurf = g_Surfaces.Get(_id);
    if (pSurf != null) {

        if (!g_webGL) Graphics_Save();

        // Store the current settings on the stack
        g_SurfaceStack.push({
            FrameBuffer: g_CurrentFrameBuffer,
            RenderTargetActive: g_RenderTargetActive,
            cannvas_graphics: graphics,
            worldx: g_worldx,
            worldy: g_worldy,
            worldw: g_worldw,
            worldh: g_worldh,

            viewportx: g_clipx,
            viewporty: g_clipy,
            viewportw: g_clipw,
            viewporth: g_cliph,
        });

        g_CurrentSurfaceIdStack.push(g_CurrentSurfaceId);
        g_CurrentSurfaceId = _id;

        if (g_webGL) {
            g_CurrentFrameBuffer = pSurf.FrameBuffer;
            g_webGL.SetRenderTarget(pSurf.FrameBuffer);
            g_RenderTargetActive = -1;
        } else {
            g_CurrentGraphics = pSurf.graphics;
            graphics = pSurf.graphics;
            Graphics_SetInterpolation_Auto(graphics);
        }
    }
}

// #############################################################################################
/// Function:<summary>
///          	Sets the indicated surface as the drawing target. All subsequent drawing happens 
///             on this surface. It resets the projection to simply cover the surface.
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				return true;
///			</returns>
// #############################################################################################
var surface_set_target = surface_set_target_RELEASE;
function surface_set_target_RELEASE(_id) 
{
    _id = yyGetInt32(_id);

    var pSurf = g_Surfaces.Get(_id);

    if (pSurf == null)
    {
        return false;
    }

    if (!g_webGL) Graphics_Save();

    var currcam = g_pCameraManager.GetActiveCamera();
    
    if (currcam != null)
    {
        g_SurfaceStack.push({
            FrameBuffer: g_CurrentFrameBuffer,
            RenderTargetActive: g_RenderTargetActive,                

            viewportx: g_clipx,
            viewporty: g_clipy,
            viewportw: g_clipw,
            viewporth: g_cliph,

            worldx: g_worldx,
            worldy: g_worldy,
            worldw: g_worldw,
            worldh: g_worldh,                

            cannvas_graphics: graphics,

            ActiveCam: true,

            camx: currcam.m_viewX,
            camy: currcam.m_viewY,
            camw: currcam.m_viewWidth,
            camh: currcam.m_viewHeight,

            cama: currcam.m_viewAngle,

            camviewmat: new Matrix(currcam.m_viewMat),
            camprojmat: new Matrix(currcam.m_projMat),
        });
    }
    else
    {
        g_SurfaceStack.push({
            FrameBuffer: g_CurrentFrameBuffer,
            RenderTargetActive: g_RenderTargetActive,                

            viewportx: g_clipx,
            viewporty: g_clipy,
            viewportw: g_clipw,
            viewporth: g_cliph,

            worldx: g_worldx,
            worldy: g_worldy,
            worldw: g_worldw,
            worldh: g_worldh,

            cannvas_graphics: graphics,

            ActiveCam: false,
        });
    }
    g_CurrentSurfaceIdStack.push(g_CurrentSurfaceId);
    g_CurrentSurfaceId = _id;


    if (g_webGL) {
        g_CurrentFrameBuffer = pSurf.FrameBuffer;
        g_webGL.SetRenderTarget(pSurf.FrameBuffer);
        g_RenderTargetActive = -1;
    } else {
        g_CurrentGraphics = pSurf.graphics;
        graphics = pSurf.graphics;
        Graphics_SetInterpolation_Auto(graphics);
    }


    Graphics_SetViewPort(0, 0, pSurf.m_Width, pSurf.m_Height);

    if (g_isZeus) {
        UpdateDefaultCamera(0, 0, pSurf.m_Width, pSurf.m_Height, 0);
    }
    else {
        Graphics_SetViewArea(0, 0, pSurf.m_Width, pSurf.m_Height, 0);
    }

    if (g_webGL) g_webGL.Flush();
    DirtyRoomExtents();


    if (!g_webGL) {
        Graphics_SetInterpolation_Auto(graphics);
    }
	
    return true;
}

function surface_get_target() {

    return g_CurrentSurfaceId;

}



// #############################################################################################
/// Function:<summary>
///          	Resets the drawing target to the normal screen.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var surface_reset_target = surface_reset_target_RELEASE;
function surface_reset_target_RELEASE()
{
    // Restore current settings if anything has been saved
    var storedState = g_SurfaceStack.pop();
    if (storedState) {

        g_clipx = storedState.viewportx;
        g_clipy = storedState.viewporty;
        g_clipw = storedState.viewportw;
        g_cliph = storedState.viewporth;

        g_worldx = storedState.worldx;
        g_worldy = storedState.worldy;
        g_worldw = storedState.worldw;
        g_worldh = storedState.worldh;

        var activeCam = storedState.ActiveCam;
        var camx, camy, camw, camh, cama, camviewmat, camprojmat;

        if (activeCam == true)
        {
            camx = storedState.camx;
            camy = storedState.camy;
            camw = storedState.camw;
            camh = storedState.camh;
            cama = storedState.cama;
            camviewmat = storedState.camviewmat;
            camprojmat = storedState.camprojmat;
        }

        if (!g_webGL) {
            graphics = storedState.cannvas_graphics;
            Graphics_Restore();
        } else {
            g_RenderTargetActive = storedState.RenderTargetActive;
            g_CurrentFrameBuffer = storedState.FrameBuffer;
        }

        if (g_InGUI_Zone && g_SurfaceStack.length == 0) {
            // (This is function SetGuiView in the C++ runner)
            Graphics_SetViewPort(0, 0, g_DisplayWidth, g_DisplayHeight);
            g_pProjection.OrthoLH(g_DisplayWidth, -g_DisplayHeight * g_RenderTargetActive, 1.0, 32000.0);
            Calc_GUI_Scale();
        } else {
            Graphics_SetViewPort(g_clipx, g_clipy, g_clipw, g_cliph);
            if (g_isZeus) {
                var currcam = g_pCameraManager.GetActiveCamera();
                if ((activeCam == true) && (currcam != null))
                {
                    UpdateCamera(camx, camy, camw, camh, cama, currcam);
                    currcam.SetViewMat(new Matrix(camviewmat));
                    currcam.SetProjMat(new Matrix(camprojmat));
                    currcam.ApplyMatrices();
                }
                else
                {
                    UpdateDefaultCamera(g_worldx, g_worldy, g_worldw, g_worldh, 0);
                }
            }
            else {
                Graphics_SetViewArea(g_worldx, g_worldy, g_worldw, g_worldh, 0);
            }
        }
    }
    else {
        yyError("surface_reset_target : Surface stacking error detected");
    }
    if (g_webGL) g_webGL.SetRenderTarget(g_CurrentFrameBuffer);
    g_CurrentSurfaceId = g_CurrentSurfaceIdStack.pop();
    if (g_CurrentSurfaceId == null) g_CurrentSurfaceId = -1;

    if (!g_webGL) Graphics_SetInterpolation_Auto(graphics);
    DirtyRoomExtents();
}


// #############################################################################################
/// Function:<summary>
///          	Read a pixel from a surface - can be slow.
///          </summary>
///
/// In:		<param name="_buffer"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function GetCanvasPixel(_buffer, _x, _y) 
{
	var data = null;
	var pImg = _buffer.getContext('2d');
	try
	{
		// This function cannot be called if the image is not from the same domain. You'll get security error if you do. ?!?!?
		//data = pImg._getImageData(0, 0, _buffer.width, _buffer.height);
		data = pImg._getImageData(_x, _y, 1,1);//_buffer.width, _buffer.height);
    } catch (ex)
	{
		return 0xff000000;		// cant read pixel, so it's BLACK!
	}
	var sdata = data.data;
	var index = 0;  //((_buffer.width *  _y) + _x)*4;
	var a1 = sdata[index] & 0xff;
	var a2 = sdata[index + 1] & 0xff;
	var a3 = sdata[index + 2] & 0xff;
	var a4 = sdata[index + 3] & 0xff;

	return ( a1 | (a2<<8) | (a3 <<16) | (a4 <<24) ) ;          // ARGB

}

// #############################################################################################
/// Function:<summary>
///          	Returns the color of the pixel corresponding to position (x,y) in the surface. 
///             This is not very fast, so use with care.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var surface_getpixel = surface_getpixel_RELEASE;
var surface_getpixel_ext = surface_getpixel_ext_RELEASE;
function surface_getpixel_RELEASE(_id, _x, _y) 
{
    return surface_getpixel_ext_RELEASE(_id, _x, _y) &0xffffff;
}
function surface_getpixel_ext_RELEASE(_id, _x, _y) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
	if( pSurf != null)
	{
	    return GetCanvasPixel(pSurf, yyGetInt32(_x), yyGetInt32(_y));
	}
	return 0x00000000;
}



// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_buffer"></param>
///			<param name="_fname"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function SaveCanvas(_buffer, _fname) 
{
	var img = canvas.toDataURL();

	// strip off the data: url prefix to get just the base64-encoded bytes
	/*var data = img.replace(/^data:image\/\w+;base64,/, "");*/
}

// #############################################################################################
/// Function:<summary>
///          	Saves a png image of the surface in the given filename. Useful for making screenshots.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_fname">File name to save as</param>
///				
// #############################################################################################
function surface_save(_id, _fname) 
{
/*    var pSurf = g_Surfaces.Get(_id);
	if( pSurf != null)
	{
		SaveCanvas(pSurf, _fname);
	}*/
	MissingFunction("surface_save()");
}

// #############################################################################################
/// Function:<summary>
///          	Saves part of the surface in the given png filename.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_fname"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function surface_save_part(_id,_fname,_x,_y,_w,_h) 
{
    MissingFunction("surface_save_part()");
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface at position (x,y). (Without color blending and no alpha transparency.)
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var draw_surface = draw_surface_RELEASE;
function draw_surface_RELEASE(_id, _x, _y) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;

    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    
    // I don't think there's a reason to preserve state here, but I'm just not
    // confident about the intended state of the canvas
    var alpha = graphics.globalAlpha;
    {
        graphics.globalAlpha = g_GlobalAlpha;
        graphics._drawImage(pSurf, _x, _y);
    }
    graphics.globalAlpha = alpha;
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface stretched to the indicated region.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_w"></param>
///			<param name="_h"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_surface_stretched(_id,_x,_y,_w,_h) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;
    Graphics_DrawStretchedExt(pSurf.m_pTPE, yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), 0xffffff, 1.0);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface tiled so that it fills the entire room.
///          </summary>
///
/// In:		<param name="_id"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_surface_tiled(_id,_x,_y) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
	if( pSurf != null)
	{
	    Graphics_TextureDrawTiled(pSurf.m_pTPE, yyGetReal(_x), yyGetReal(_y), 1, 1, true, true, 0xffffff, 1);
    }
}

// #############################################################################################
/// Function:<summary>
///          	Draws the indicated part of the surface with its origin at position (x,y).
///          </summary>
///
/// In:		<param name="_id"></param>
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
function draw_surface_part(_id,_left,_top,_width,_height,_x,_y) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;

    Graphics_DrawPart(pSurf.m_pTPE, yyGetReal(_left), yyGetReal(_top), yyGetReal(_width), yyGetReal(_height), yyGetReal(_x), yyGetReal(_y), 1, 1, 0xffffff, 1.0);
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface scaled and rotated with blending color (use c_white for no 
///             blending) and transparency alpha (0-1).
///          </summary>
///
/// In:		<param name="_id"></param>
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
function draw_surface_ext(_id,_x,_y,_xscale,_yscale,_rot,_color,_alpha) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;

    var c = ConvertGMColour(yyGetInt32(_color));
	Graphics_TextureDraw(pSurf.m_pTPE, 0, 0, yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), (yyGetReal(_rot) * 0.0174532925), c,c,c,c, yyGetReal(_alpha));
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface stretched to the indicated region. color is the blending color 
///             and alpha indicates the transparency setting.
///          </summary>
///
/// In:		<param name="_id"></param>
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
function draw_surface_stretched_ext(_id,_x,_y,_w,_h,_color,_alpha) 
{
    var pSurf = g_Surfaces.Get(yyGetInt32(_id));
    if (!pSurf) return;

    var c = ConvertGMColour(yyGetInt32(_color));
	Graphics_DrawStretchedExt(pSurf.m_pTPE, yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), c, yyGetReal(_alpha));
}

// #############################################################################################
/// Function:<summary>
///          	Draws the surface tiled so that it fills the entire room but now with scale factors 
///             and a color and transparency setting.
///          </summary>
///
/// In:		<param name="_id"></param>
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
var draw_surface_tiled_ext = draw_surface_tiled_ext_RELEASE;
function draw_surface_tiled_ext_RELEASE(_id, _x, _y, _xscale, _yscale, _color, _alpha) 
{
    ErrorFunction("draw_surface_tiled_ext()");
}

// #############################################################################################
/// Function:<summary>
///          	Draws the indicated part of the surface with its origin at position (x,y) but 
///             now with scale factors and a color and transparency setting.
///          </summary>
///
/// In:		<param name="_id"></param>
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
function draw_surface_part_ext(_id,_left,_top,_width,_height,_x,_y,_xscale,_yscale,_color,_alpha) 
{
    _id = yyGetInt32(_id);

    var pSurf = g_Surfaces.Get(_id);
	if( pSurf != null)
	{
        // Create a TEMP TP index, and fill in "offsets"
	    var pTPE = new yyTPageEntry();
	    pTPE.x = 0;
	    pTPE.y = 0;
	    pTPE.w = pSurf.width;
	    pTPE.h = pSurf.height;
	    pTPE.XOffset = 0;
	    pTPE.YOffset = 0;
	    pTPE.CropWidth = pTPE.w;
	    pTPE.CropHeight = pTPE.h;
	    pTPE.ow = pTPE.w;
	    pTPE.oh = pTPE.h;
	    pTPE.tp = _id;

        // Add cache details	
        pTPE.cache = [];                // clear colour cache
        pTPE.count = 0;
        pTPE.maxcache= 4;				// Max number of times to cache this image.

        // Add "tiling" cache details
        pTPE.vh_tile = 0;               // How is it tiled?
        pTPE.hvcached = null;           // tiling cache.

        //  Surfaces ARE single images....
        if (!g_webGL) {
        	pTPE.singleimage = pSurf;
        	pTPE.texture = pSurf;
        } 
        else {
        	pTPE.singleimage = pSurf.texture;
        	pTPE.texture = pSurf.texture;
        }

        var c = ConvertGMColour(yyGetInt32(_color));
        Graphics_DrawPart(pTPE, yyGetReal(_left), yyGetReal(_top), yyGetReal(_width), yyGetReal(_height), yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), c, yyGetReal(_alpha));
    }
}

// #############################################################################################
/// Function:<summary>
///          	The most general drawing function. It draws the indicated part of the surface 
///             with its origin at position (x,y) but now with scale factors, a rotation angle, 
///             a color for each of the four vertices (top-left, top-right, bottom-right, and 
///             bottom-left), and an alpha transparency value.
///          </summary>
///
/// In:		<param name="_id"></param>
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
function draw_surface_general(_id,_left,_top,_width,_height,_x,_y,_xscale,_yscale,_rot,_c1,_c2,_c3,_c4,_alpha) 
{
    _id = yyGetInt32(_id);

    var pSurf = g_Surfaces.Get(_id);
	if( pSurf != null)
	{
        // Create a TEMP TP index, and fill in "offsets"
	    var pTPE = new yyTPageEntry();
	    pTPE.x = yyGetReal(_left);     
	    pTPE.y = yyGetReal(_top);
	    pTPE.w = yyGetReal(_width);
	    pTPE.h = yyGetReal(_height);
	    pTPE.XOffset = 0;
	    pTPE.YOffset = 0;
	    pTPE.CropWidth = pTPE.w;
	    pTPE.CropHeight = pTPE.h;
	    pTPE.ow = pTPE.w;
	    pTPE.oh = pTPE.h;
	    pTPE.tp = _id;

        // Add cache details	
        pTPE.cache = [];                // clear colour cache
        pTPE.count = 0;
        pTPE.maxcache= 4;				// Max number of times to cache this image.

        // Add "tiling" cache details
        pTPE.vh_tile = 0;               // How is it tiled?
        pTPE.hvcached = null;           // tiling cache.

	    //  Surfaces ""ARE"" single images....

        _x = yyGetReal(_x);
        _y = yyGetReal(_y);
        _xscale = yyGetReal(_xscale);
        _yscale = yyGetReal(_yscale);
        _rot = yyGetReal(_rot);
        _alpha = yyGetReal(_alpha);

		_c1 = ConvertGMColour(yyGetInt32(_c1));
		_c2 = ConvertGMColour(yyGetInt32(_c2));
		_c3 = ConvertGMColour(yyGetInt32(_c3));
		_c4 = ConvertGMColour(yyGetInt32(_c4));
        if (!g_webGL)
        {
        	pTPE.singleimage = pSurf;
        	pTPE.texture = pSurf;
        	Graphics_TextureDraw(pTPE, 0, 0, _x, _y, _xscale, _yscale, (_rot * 0.0174532925), _c1,_c2,_c3,_c4, _alpha);
        } else
        {
        	pTPE.singleimage = pSurf.texture;
        	pTPE.texture = pSurf.texture;
        	Graphics_TextureDraw(pTPE, 0, 0, _x, _y, _xscale, _yscale, (_rot * 0.0174532925), _c1, _c2, _c3, _c4, _alpha);
        }
    }     
}

// #############################################################################################
/// Function:<summary>
///          	Copies the source surface at position (x,y) in the destination surface. 
///             (Without any form of blending.)
///          </summary>
///
/// In:		<param name="_destination"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_source"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function surface_copy(_destination,_x,_y,_source) {

    var pDest = g_Surfaces.Get(yyGetInt32(_destination));
    var pSrc = g_Surfaces.Get(yyGetInt32(_source));
	if( pDest!=null && pSrc!=null)
	{
		var pImg = pDest.getContext('2d');
		
		pImg.save();
		pImg.globalCompositeOperation = 'copy';
		pImg.drawImage(pSrc, yyGetInt32(_x), yyGetInt32(_y));
		pImg.restore();
	}
}

// #############################################################################################
/// Function:<summary>
///          	Copies the indicated part of the source surface at position (x,y) in the 
///             destination surface. (Without any form of blending.)
///          </summary>
///
/// In:		<param name="_destination"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_source"></param>
///			<param name="_xs"></param>
///			<param name="_ys"></param>
///			<param name="_ws"></param>
///			<param name="_hs"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function surface_copy_part(_destination,_x,_y, _source,_xs,_ys,_ws,_hs) 
{
    var pDest = g_Surfaces.Get(yyGetInt32(_destination));
    var pSrc = g_Surfaces.Get(yyGetInt32(_source));
	if( pDest!=null && pSrc!=null)
	{
	    _x = yyGetReal(_x);
	    _y = yyGetReal(_y);
	    _xs = yyGetReal(_xs);
	    _ys = yyGetReal(_ys);
	    _ws = yyGetReal(_ws);
	    _hs = yyGetReal(_hs);

	    var trans = [];
		var pImg = pDest.getContext('2d');

		pImg.save();
        
        trans[0] = 1;
        trans[1] = 0;
        trans[2] = 0;
        trans[3] = 1;
        trans[4] = 0;
        trans[5] = 0;
        pImg.setTransform( trans[0], trans[1], trans[2], trans[3], trans[4], trans[5] );

        pImg.beginPath();
        pImg.rect(_x, _y, _ws, _hs);
        pImg.clip();
		
		pImg.globalCompositeOperation = 'copy';
		pImg.drawImage(pSrc,  _xs,_ys,_ws,_hs,  _x, _y, _ws,_hs);
		pImg.restore();
	} 
}

function SurfaceFormatSupported(_format)
{        
	switch (_format)
	{
		case eTextureFormat_A8R8G8B8: return true;
		case eTextureFormat_Float16: return true;
        case eTextureFormat_Float32: return true;
        case eTextureFormat_A4R4G4B4: return true; 
        case eTextureFormat_R8: return true;
        case eTextureFormat_R8G8: return true;
		case eTextureFormat_R16G16B16A16_Float: return true;
        case eTextureFormat_R32G32B32A32_Float: return true;
		default: return false;
	}
}

function TextureFormatSupported(_format)
{
    if (g_webGL)
    {
        return g_webGL.IsTextureFormatSupported(_format);
    }
    else
    {
        if (_format == eTextureFormat_A8R8G8B8)
        {
            return true;
        }
        else
        {
            return false;
        }
    }	
}

function surface_format_is_supported(_format)
{
    if (SurfaceFormatSupported(_format) && TextureFormatSupported(_format))
    {
        return true;
    }

    return false;
}

function surface_get_format(_id)
{    
    var pSurf = g_Surfaces.Get(_id);
	if( pSurf != null)
	{
        if (g_webGL)
        {
            if (pSurf.FrameBufferData.Texture)
            {
                return pSurf.FrameBufferData.Texture.Format;
            }
        }
        else
        {
            return eTextureFormat_A8R8G8B8; // canvas always uses this format
        }
    }

    return eTextureFormat_UnknownFormat;
}


