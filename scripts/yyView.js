
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
///          	Work out the x position in this view of the IO's MouseX
///          </summary>
// #############################################################################################
yyView.prototype.GetMouseX = function (_x,_y) {
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