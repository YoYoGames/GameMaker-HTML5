
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyView.js
// Created:			03/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 03/06/2011		
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/** @constructor */
function yyView()						// A view
{
    this.__type = "[View]";
    this.visible = false;
	this.worldx = 0;                    // rectangle in the world (area of the world to draw)
	this.worldy = 0;
	this.worldw = 640;
	this.worldh = 480;   
	this.portx = 0;						// rectangle in the draw region (area to FIT into)
	this.porty = 0;
	this.portw = 640;
	this.porth = 480;
	this.angle = 0;
	this.scaledportx = 0; 			// clip region scaled into "canvas" space
	this.scaledporty = 0;
	this.scaledportx2 = 0; 			    
	this.scaledporty2 = 0;
	this.scaledportw = 640;
	this.scaledporth = 480;
	this.WorldViewScaleX = 1;
	this.WorldViewScaleY = 1;
	this.hborder = 32;                    // "safe" region before scrolling to follow "objid"
    this.vborder = 32;
    this.hspeed = -1;                   // speed to use to "catch up"
    this.vspeed = -1;
    this.objid = -1;                    // object id to follow
    this.surface_id = -1;
	this.cameraID = -1;
	this.m_targetInstance = -1;

	// view_set_viewport (GMS2-Runner-Main#1076): the view's surface is drawn through these triangles instead of as a rectangle
	this.m_polygon = null;              // triangle list as x,y pairs in the view surface's pixels, or null
	this.m_polygonSurface = -1;         // surface view_set_viewport created for the view (freed with the polygon), or -1
	this.m_polygonStartFunc = null;     // called before the triangles are drawn (e.g. to set a shader)
	this.m_polygonEndFunc = null;       // called after they are drawn
}


// #############################################################################################
/// Property: <summary>
///           	Copy a surface class
///           </summary>
// #############################################################################################
yyView.prototype.Copy = function (_src) {
	this.visible = _src.visible;
	this.worldx = _src.worldx;                    // rectangle in the world (area of the world to draw)
	this.worldy = _src.worldy;
	this.worldw = _src.worldw;
	this.worldh = _src.worldh;
	this.portx = _src.portx; 					// rectangle in the draw region (area to FIT into)
	this.porty = _src.porty;
	this.portw = _src.portw;
	this.porth = _src.porth;
	this.angle = _src.angle;
	this.scaledportx = _src.scaledportx; 			// clip region scaled into "canvas" space
	this.scaledporty =  _src.scaledporty;
	this.scaledportx2 = _src.scaledportx2;
	this.scaledporty2 = _src.scaledporty2;
	this.scaledportw = _src.scaledportw;
	this.scaledporth = _src.scaledporth;
	this.WorldViewScaleX = _src.WorldViewScaleX;
	this.WorldViewScaleY = _src.WorldViewScaleY;
	this.hborder = _src.hborder;                    // "safe" region before scrolling to follow "objid"
	this.vborder = _src.vborder;
	this.hspeed = _src.hspeed;                   // speed to use to "catch up"
	this.vspeed = _src.vspeed;
	this.objid = _src.objid;                    // object id to follow
	this.surface_id = _src.surface_id;
	this.cameraID = _src.cameraID;
};

// #############################################################################################
/// Function:<summary>
///             Work out the position in this view of the IO's Mouse coordinate.
///             _horizontal determines whether return X (true) or Y (false) coordinate.
///          </summary>
// #############################################################################################
yyView.prototype.GetMouseCoord = function(_x,_y,_horizontal) {
	var cam = g_pCameraManager.GetCamera(this.cameraID);
	if (cam == null) return 0;

	var pRect = g_CanvasRect;
	_x = (_x - pRect.left - this.scaledportx) / (pRect.scaleX || 1);
	_y = (_y - pRect.top - this.scaledporty) / (pRect.scaleY || 1);

	if (this.cameraID == g_DefaultCameraID) {
		_x = (_x / this.WorldViewScaleX) + this.worldx;
		_y = (_y / this.WorldViewScaleY) + this.worldy;
		return Math.floor((_horizontal ? _x : _y));
	}

	//
	var clipX = _x / this.scaledportw;
	var clipY = _y / this.scaledporth;
	clipX = clipX * 2.0 - 1.0;
	clipY = clipY * 2.0 - 1.0;

	// Now backtransform into room space
	var invViewProj = cam.GetInvViewProjMat();

	// we're treating z as 0 and w as 1
	var out;
	if (_horizontal) {
		out = ((clipX * invViewProj.m[_11]) + (clipY * invViewProj.m[_21]) + invViewProj.m[_41]);
	} else {
		out = ((clipX * invViewProj.m[_12]) + (clipY * invViewProj.m[_22]) + invViewProj.m[_42]);
	}
	return Math.floor(out);
};

// #############################################################################################
/// Function:<summary>
///             Work out the position in this view of the IO's Mouse coordinate.
///             Returns both coordinates as an array: 0 - xpos, 1 - ypos
///          </summary>
// #############################################################################################
yyView.prototype.GetMouseCoords = function(_x, _y, applyCamera = true) {
    var cam = g_pCameraManager.GetCamera(this.cameraID);
    if (cam == null) return 0;

    // First, adjust the incoming coordinates by subtracting the canvas offsets.
    var pRect = g_CanvasRect;
    _x = (_x - pRect.left - this.scaledportx) / (pRect.scaleX || 1);
    _y = (_y - pRect.top - this.scaledporty) / (pRect.scaleY || 1);

    // If using the default camera, or if we don't want to apply camera transformation, 
    // convert using world view scaling and return.
    if (!applyCamera || this.cameraID == g_DefaultCameraID) {
        _x = (_x / this.WorldViewScaleX) + this.worldx;
        _y = (_y / this.WorldViewScaleY) + this.worldy;
        return [Math.floor(_x), Math.floor(_y)];
    }

    // Otherwise, compute clip-space coordinates based on the view's scaled port.
    var clipX = _x / this.scaledportw;
    var clipY = _y / this.scaledporth;
    clipX = clipX * 2.0 - 1.0;
    clipY = clipY * 2.0 - 1.0;

    // Get the inverse view-projection matrix from the camera.
    var invViewProj = cam.GetInvViewProjMat();

    // Compute the backtransformed coordinate using the appropriate row of the matrix.
    _x = (clipX * invViewProj.m[_11]) + (clipY * invViewProj.m[_21]) + invViewProj.m[_41];
	_y = (clipX * invViewProj.m[_12]) + (clipY * invViewProj.m[_22]) + invViewProj.m[_42];

    return [Math.floor(_x), Math.floor(_y)];
};

// #############################################################################################
/// Function:<summary>
///          	Work out the x position in this view of the IO's MouseX
///          </summary>
// #############################################################################################
yyView.prototype.GetMouseX = function (_x, _y) {
	return this.GetMouseCoord(_x, _y, true);
};

// #############################################################################################
/// Function:<summary>
///          	Work out the y position in this view of the IO's MouseY
///          </summary>
// #############################################################################################
yyView.prototype.GetMouseY = function (_x,_y) {
	return this.GetMouseCoord(_x, _y, false);
};

// #############################################################################################
/// Function:<summary>
///          	Create a view from storage
///          </summary>
///
/// In:		<param name="_pViewStorage">pointer to the view object</param>
/// Out:	<returns>
///				the new view object
///			</returns>
// #############################################################################################
function  CreateViewFromStorage( _pViewStorage )
{
    var view = new yyView();
    
    if( _pViewStorage.visible!=undefined ) view.visible = _pViewStorage.visible;           // view active?
    if( _pViewStorage.xview!=undefined ) view.worldx = _pViewStorage.xview;
    if( _pViewStorage.yview!=undefined ) view.worldy = _pViewStorage.yview;
    if( _pViewStorage.wview!=undefined ) view.worldw = _pViewStorage.wview;
    if( _pViewStorage.hview!=undefined ) view.worldh = _pViewStorage.hview;
    if( _pViewStorage.xport!=undefined ) view.portx = _pViewStorage.xport;
    if( _pViewStorage.yport!=undefined ) view.porty = _pViewStorage.yport;
    if( _pViewStorage.wport!=undefined ) view.portw = _pViewStorage.wport;
    if( _pViewStorage.hport!=undefined ) view.porth = _pViewStorage.hport;
    if (_pViewStorage.angle!= undefined) view.porth = _pViewStorage.angle;
    if (_pViewStorage.hborder != undefined) view.hborder = _pViewStorage.hborder;
    if( _pViewStorage.vborder!=undefined ) view.vborder = _pViewStorage.vborder;
    if( _pViewStorage.hspeed!=undefined ) view.hspeed = _pViewStorage.hspeed;
    if( _pViewStorage.vspeed!=undefined ) view.vspeed = _pViewStorage.vspeed;
    if( _pViewStorage.index!=undefined ) view.objid = _pViewStorage.index;

	// if we have a camera stored in the "storage" view, then clone that
	if ( _pViewStorage.cameraID !== undefined && _pViewStorage.cameraID>=0) {
		// Already been setup, so clone it... don't mess around with the storage one
		view.cameraID = g_pCameraManager.CloneCamera(_pViewStorage.cameraID);
	}
	else
	{
		// Create camera and attach it to the view
		var pCam = g_pCameraManager.CreateCameraFromView(view);
		pCam.SetCloned(true);
		view.cameraID = pCam.GetID();
	}

    return view;
}


// @if function("view_set_viewport")
// #############################################################################################
/// Function:<summary>
///             Ear clips a simple polygon (x,y pairs) into a triangle list of vertex indices. Returns
///             [] for fewer than 3 points, or null if it can't be split into triangles: no ear is found,
///             all the points are on one line, or the triangles don't cover the polygon's area (it crosses itself).
///          </summary>
// #############################################################################################
function ViewPolygon_EarClip(_points)
{
	var indices = [];
	var n = Math.floor(_points.length / 2);
	if (n < 3) return indices;

	var crossSign = function (ax, ay, bx, by, cx, cy) {
		var v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
		return (v > 0) ? 1 : ((v < 0) ? -1 : 0);
	};
	var pointInTriangle = function (px, py, ax, ay, bx, by, cx, cy) {
		// a point on one of the triangle's corners (a duplicate vertex) doesn't block it
		if ((px == ax && py == ay) || (px == bx && py == by) || (px == cx && py == cy)) return false;
		var s1 = crossSign(ax, ay, bx, by, px, py);
		var s2 = crossSign(bx, by, cx, cy, px, py);
		var s3 = crossSign(cx, cy, ax, ay, px, py);
		// inside or on an edge: a reflex corner lying on the candidate ear's edge must block it
		var hasNeg = (s1 < 0) || (s2 < 0) || (s3 < 0);
		var hasPos = (s1 > 0) || (s2 > 0) || (s3 > 0);
		return !(hasNeg && hasPos);
	};

	var work = [];
	for (var i = 0; i < n; i++) work.push(i);

	// the winding of the whole polygon tells convex corners from reflex ones
	var area2 = 0;
	for (var i = 0; i < n; i++) {
		var j = (i + 1) % n;
		area2 += _points[2 * i] * _points[2 * j + 1] - _points[2 * j] * _points[2 * i + 1];
	}
	var convexSign = (area2 > 0) ? 1 : -1;

	var m = n;
	var misses = 0;     // vertices tried since the last ear: a full pass without one means it can't be clipped
	var i = 0;
	while (m > 3) {
		if (misses >= m) return null;
		var ip = (i == 0) ? m - 1 : i - 1;
		var inx = (i == m - 1) ? 0 : i + 1;
		var a = work[ip], b = work[i], c = work[inx];
		var ax = _points[2 * a], ay = _points[2 * a + 1];
		var bx = _points[2 * b], by = _points[2 * b + 1];
		var cx = _points[2 * c], cy = _points[2 * c + 1];

		var turn = crossSign(ax, ay, bx, by, cx, cy);
		var isEar = (turn == convexSign);
		for (var k = 0; isEar && k < m; k++) {
			if (k == ip || k == i || k == inx) continue;
			var v = work[k];
			if (pointInTriangle(_points[2 * v], _points[2 * v + 1], ax, ay, bx, by, cx, cy)) isEar = false;
		}

		// an ear is clipped off; a vertex on a straight line between its neighbours is dropped (it adds no area),
		// as in the C++ runner
		if (isEar || (turn == 0)) {
			if (isEar) indices.push(a, b, c);
			work.splice(i, 1);
			m--;
			misses = 0;
		}
		else {
			i++;
			misses++;
		}
		if (i >= m) i = 0;
	}

	if ((m == 3) && (crossSign(_points[2 * work[0]], _points[2 * work[0] + 1], _points[2 * work[1]], _points[2 * work[1] + 1],
		_points[2 * work[2]], _points[2 * work[2] + 1]) != 0)) {
		indices.push(work[0], work[1], work[2]);
	}

	// 3 or more points that give no triangle at all (all on one line) aren't a polygon either
	if (indices.length == 0) return null;

	// The triangles of a simple polygon cover exactly its area. A polygon that crosses itself (a bow tie, say) can
	// still be clipped, into triangles that overlap or spill outside it, and then the areas differ (as in GMRT).
	var triangleArea2 = 0;
	for (var t = 0; t + 2 < indices.length; t += 3) {
		var ta = indices[t], tb = indices[t + 1], tc = indices[t + 2];
		triangleArea2 += Math.abs((_points[2 * tb] - _points[2 * ta]) * (_points[2 * tc + 1] - _points[2 * ta + 1]) -
			(_points[2 * tb + 1] - _points[2 * ta + 1]) * (_points[2 * tc] - _points[2 * ta]));
	}
	var polygonArea2 = Math.abs(area2);
	if (Math.abs(triangleArea2 - polygonArea2) > 1e-3 * Math.max(1, polygonArea2)) return null;
	return indices;
}

// #############################################################################################
/// Function:<summary>
///             The view's surface: the view_surface_id array when the view's index is given
///             (it is the newest value), otherwise the copy on the view
///          </summary>
// #############################################################################################
yyView.prototype.PolygonViewSurface = function (_index) {
	return (_index !== undefined) ? g_pBuiltIn.view_surface_id[_index] : this.surface_id;
};

// #############################################################################################
/// Function:<summary>
///             Sets the view's surface, in the view_surface_id array too when the view's index is given
///          </summary>
// #############################################################################################
yyView.prototype.SetPolygonViewSurface = function (_index, _surface) {
	this.surface_id = _surface;
	if (_index !== undefined) g_pBuiltIn.view_surface_id[_index] = _surface;
};

// #############################################################################################
/// Function:<summary>
///             Lets go of the surface view_set_viewport made once the game has set its own surface for
///             the view: ours isn't used any more, so it is freed (as in the C++ runner). The game's
///             surface never is. While ours is still the view's surface it is kept, even if it has
///             been lost, so that RefreshPolygonSurface can make it again.
///          </summary>
// #############################################################################################
yyView.prototype.CheckPolygonSurface = function (_index) {
	if (this.m_polygonSurface == -1) return;
	if (this.PolygonViewSurface(_index) != this.m_polygonSurface) {
		if (surface_exists(this.m_polygonSurface)) surface_free(this.m_polygonSurface);
		this.m_polygonSurface = -1;
	}
};

// #############################################################################################
/// Function:<summary>
///             Makes sure a view with a polygon has a surface to draw it from. A surface the game
///             set is used as it is. Otherwise the one view_set_viewport made is kept while it exists
///             and is the port's size, and made again (port sized) when it isn't or there isn't one.
///          </summary>
// #############################################################################################
yyView.prototype.EnsurePolygonSurface = function (_index) {
	this.CheckPolygonSurface(_index);

	var current = this.PolygonViewSurface(_index);
	var w = (_index !== undefined) ? g_pBuiltIn.view_wport[_index] : this.portw;
	var h = (_index !== undefined) ? g_pBuiltIn.view_hport[_index] : this.porth;

	if (this.m_polygonSurface != -1) {
		// ours: keep it unless it has been lost or the port's size has changed
		if (surface_exists(this.m_polygonSurface)) {
			if ((surface_get_width(this.m_polygonSurface) == w) && (surface_get_height(this.m_polygonSurface) == h)) return;
			surface_free(this.m_polygonSurface);
		}
		this.m_polygonSurface = -1;
	}
	else if ((current != -1) && surface_exists(current)) {
		// the game's own surface
		return;
	}

	if ((w <= 0) || (h <= 0)) {
		this.SetPolygonViewSurface(_index, -1);
		return;
	}
	var surf = surface_create(w, h);
	this.m_polygonSurface = surf;
	this.SetPolygonViewSurface(_index, surf);
};

// #############################################################################################
/// Function:<summary>
///             Called each frame before a view with a polygon is drawn: makes the surface
///             view_set_viewport made again if it has been lost, or the port's size has changed
///             (view_wport[n] = ..., view_set_wport). A surface the game set isn't touched.
///          </summary>
// #############################################################################################
yyView.prototype.RefreshPolygonSurface = function (_index) {
	if ((this.m_polygon == null) || (this.m_polygonSurface == -1)) return;
	if (this.PolygonViewSurface(_index) != this.m_polygonSurface) {
		this.CheckPolygonSurface(_index);
		return;
	}
	this.EnsurePolygonSurface(_index);
};

// #############################################################################################
/// Function:<summary>
///             Drops the view's polygon and its callbacks, freeing the surface view_set_viewport made
///             for it if that is still the view's surface
///          </summary>
// #############################################################################################
yyView.prototype.ResetPolygon = function (_index) {
	this.CheckPolygonSurface(_index);
	if (this.m_polygonSurface != -1) {
		if (surface_exists(this.m_polygonSurface)) surface_free(this.m_polygonSurface);
		this.SetPolygonViewSurface(_index, -1);
	}
	this.m_polygon = null;
	this.m_polygonSurface = -1;
	this.m_polygonStartFunc = null;
	this.m_polygonEndFunc = null;
};

// #############################################################################################
/// Function:<summary>
///             Is the polygon drawn? It needs triangles and a surface to draw them from.
///          </summary>
// #############################################################################################
yyView.prototype.IsPolygonDrawn = function () {
	return (this.m_polygon != null) && (this.m_polygon.length >= 6) && (this.surface_id != -1) && surface_exists(this.surface_id);
};

// #############################################################################################
/// Function:<summary>
///             Is (_x, _y), in view port units, inside the view's polygon? False if it has none.
///          </summary>
// #############################################################################################
yyView.prototype.PolygonContains = function (_x, _y) {
	if (!this.IsPolygonDrawn()) return false;
	var tris = this.m_polygon;

	// the triangles are in surface pixels, drawn at the view's port position
	var px = _x - this.portx;
	var py = _y - this.porty;
	for (var n = 0; n + 5 < tris.length; n += 6) {
		var d1 = (tris[n + 2] - tris[n]) * (py - tris[n + 1]) - (tris[n + 3] - tris[n + 1]) * (px - tris[n]);
		var d2 = (tris[n + 4] - tris[n + 2]) * (py - tris[n + 3]) - (tris[n + 5] - tris[n + 3]) * (px - tris[n + 2]);
		var d3 = (tris[n] - tris[n + 4]) * (py - tris[n + 5]) - (tris[n + 1] - tris[n + 5]) * (px - tris[n + 4]);
		var hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
		var hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
		if (!(hasNeg && hasPos)) return true;
	}
	return false;
};

// #############################################################################################
/// Function:<summary>
///             Is the canvas position (_x, _y) inside the view? Hit tests a view_set_viewport polygon,
///             or the scaled port rectangle.
///          </summary>
// #############################################################################################
yyView.prototype.ContainsCanvasPoint = function (_x, _y) {
	if (this.IsPolygonDrawn()) {
		// canvas pixels back to view port units (see the scaledport* values set in DrawViews)
		var scaleX = (this.portw != 0) ? (this.scaledportw / this.portw) : 1;
		var scaleY = (this.porth != 0) ? (this.scaledporth / this.porth) : 1;
		var px = this.portx + (_x - this.scaledportx) / scaleX;
		var py = this.porty + (_y - this.scaledporty) / scaleY;
		return this.PolygonContains(px, py);
	}
	return (_x >= this.scaledportx) && (_x < this.scaledportx2) && (_y >= this.scaledporty) && (_y < this.scaledporty2);
};

// #############################################################################################
/// Function:<summary>
///             Draws the view's surface through its polygon onto the current target (the application
///             surface, or the canvas without one). Call it after the view has been drawn into its
///             surface and that surface is no longer the target.
///          </summary>
// #############################################################################################
yyView.prototype.DrawPolygon = function () {
	if (!this.IsPolygonDrawn()) return;

	// startFunc can change the view (even call view_set_viewport), so run the callbacks that are set
	// now, and look the polygon and surface up again after startFunc
	var startFunc = this.m_polygonStartFunc;
	var endFunc = this.m_polygonEndFunc;

	// The triangles are in view port units, which land on the target at port * display scale, as the
	// rectangular views do (DrawViews sets their view ports the same way)
	Graphics_Save();
	Graphics_SetViewPort(0, 0, g_ApplicationWidth, g_ApplicationHeight);
	Graphics_SetViewArea(0, 0, g_ApplicationWidth / g_DisplayScaleX, g_ApplicationHeight / g_DisplayScaleY, 0);

	// a method runs on the struct or instance it is bound to; a script function on global
	var callFunc = function (_func) {
		if (typeof (_func) != "function") return;
		var self = _func.boundObject ?? global;
		_func(self, self);
	};

	try {
		callFunc(startFunc);

		var pSurf = this.IsPolygonDrawn() ? g_Surfaces.Get(this.surface_id) : null;
		if (pSurf) {
			var tris = this.m_polygon;
			var ox = this.portx;
			var oy = this.porty;
			if (g_webGL) {
				var pTPE = pSurf.m_pTPE;
				if (!pTPE.texture.webgl_textureid) WebGL_BindTexture(pTPE);
				var numVerts = Math.floor(tris.length / 2);
				var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);
				var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
				var index = stride * pBuff.Current;
				pBuff.Current += numVerts;
				var texW = pTPE.texture.width, texH = pTPE.texture.height;
				for (var n = 0; n < numVerts; n++, index += stride) {
					var u = tris[2 * n], v = tris[2 * n + 1];
					pBuff.Coords[index + 0] = ox + u;
					pBuff.Coords[index + 1] = oy + v;
					pBuff.Coords[index + 2] = GR_Depth;
					pBuff.UVs[index + 0] = u / texW;
					pBuff.UVs[index + 1] = v / texH;
					pBuff.Colours[index] = 0xffffffff;
				}
				// draw the triangles now, while startFunc's shader is still set
				g_webGL.Flush();
			}
			else {
				// Canvas: clip to the triangles and draw the surface at the port position
				graphics.save();
				graphics.beginPath();
				for (var n = 0; n + 5 < tris.length; n += 6) {
					graphics.moveTo(ox + tris[n], oy + tris[n + 1]);
					graphics.lineTo(ox + tris[n + 2], oy + tris[n + 3]);
					graphics.lineTo(ox + tris[n + 4], oy + tris[n + 5]);
					graphics.closePath();
				}
				graphics.clip();
				graphics.globalAlpha = 1;
				graphics._drawImage(pSurf, ox, oy);
				graphics.restore();
			}
		}

		callFunc(endFunc);
	}
	finally {
		Graphics_Restore();
	}
};
// @endif view_set_viewport
