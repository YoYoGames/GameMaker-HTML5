// **********************************************************************************************************************
// 
// Copyright (c)2018, YoYo Games Ltd. All Rights reserved.
// 
// File:			CameraManager.js
// Created:			23/08/2018
// Author:			Mike
// Project:			HTML5
// Description:		Camera and Camera Manager classes and functions
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 23/08/2018       V1.1        MJD     Moved from Function_Graphics into it's own file - was a bit hidden
// 
// **********************************************************************************************************************

/** @constructor */
function CameraManager() {
    this.m_InitialLoadHighPoint = 0;
    this.m_pScriptInstance = null;
    this.camId = 0;
    this.m_activeCamera = null;
    this.m_CamPool = new yyList();
    this.m_tempCamera = null;
};



/** @constructor */
function CCamera() {
    this.m_id = 0;
    this.m_projMat = new Matrix();
    this.m_viewMat = new Matrix();
    this.m_viewProjMat = new Matrix();
    this.m_invProjMat = new Matrix();
    this.m_invViewMat = new Matrix();
    this.m_invViewProjMat = new Matrix();
    this.m_viewX = 0;
    this.m_viewY = 0;
    this.m_viewWidth = 0;
    this.m_viewHeight = 0;

    this.m_viewSpeedX = 0;
    this.m_viewSpeedY = 0;

    this.m_viewBorderX = 0;
    this.m_viewBorderY = 0;
    this.m_viewAngle = 0;

    this.m_targetInstance = -1;			// an instance to track (-1 if this camera isn't tracking anything)


    this.m_beginScript = null;
    this.m_endScript = null;
    this.m_updateScript = null;

    this.m_is2D = true;
    this.m_isClone = false;
    this.m_isPersistent = false;            // part of a persistant room?
};
CCamera.prototype.SetCloned = function (_cloned) { this.m_isClone = _cloned; };
CCamera.prototype.IsCloned = function () { return this.m_isClone; };

CCamera.prototype.SetPersistent = function (_persistent) { this.m_isPersistent = _persistent; };
CCamera.prototype.GetPersistent = function () { return this.m_isPersistent; };


// ################################################################################################
// Clone a camera
// ################################################################################################
CameraManager.prototype.CloneCamera = function (_id) {

    var pCurrCam = this.GetCamera(_id);
    if (!pCurrCam) return -1;

    var NewCamID = this.CreateCamera();
    var pNewCam = this.GetCamera(NewCamID);

    pNewCam.m_viewX = pCurrCam.m_viewX;
    pNewCam.m_viewY = pCurrCam.m_viewY;
    pNewCam.m_viewWidth = pCurrCam.m_viewWidth;
    pNewCam.m_viewHeight = pCurrCam.m_viewHeight;
    pNewCam.m_viewSpeedX = pCurrCam.m_viewSpeedX;
    pNewCam.m_viewSpeedY = pCurrCam.m_viewSpeedY;
    pNewCam.m_viewBorderX = pCurrCam.m_viewBorderX;
    pNewCam.m_viewBorderY = pCurrCam.m_viewBorderY;
    pNewCam.m_viewAngle = pCurrCam.m_viewAngle;
    pNewCam.m_targetInstance = pCurrCam.m_targetInstance;
    pNewCam.m_beginScript = pCurrCam.m_beginScript;
    pNewCam.m_endScript = pCurrCam.m_endScript;
    pNewCam.m_updateScript = pCurrCam.m_updateScript;

    var viewmat = new Matrix(pCurrCam.m_viewMat);
    var projmat = new Matrix(pCurrCam.m_projMat);
    var viewProjMat = new Matrix(pCurrCam.m_viewProjMat);
    var invProjMat = new Matrix(pCurrCam.m_invProjMat);
    var invViewMat = new Matrix(pCurrCam.m_invViewMat);
    var invViewProjMat = new Matrix(pCurrCam.m_invViewProjMat);
    pNewCam.m_projMat = projmat;
    pNewCam.m_viewMat = viewmat;
    pNewCam.m_viewProjMat = viewProjMat;
    pNewCam.m_invProjMat = invProjMat;
    pNewCam.m_invViewMat = invViewMat;
    pNewCam.m_invViewProjMat = invViewProjMat;
    pNewCam.m_isPersistent = pCurrCam.m_isPersistent;

    pNewCam.SetCloned(true);
    return NewCamID;
};


CCamera.prototype.IsOrthoProj = function () {
    if (this.m_projMat.m[11] == 0)
        return true;

    return false;
};

CCamera.prototype.Update2D = function () {

    if (this.IsOrthoProj()) {
        if ((this.m_projMat.m[4] == 0.0) && (this.m_projMat.m[8] == 0.0) &&
			(this.m_projMat.m[1] == 0.0) && (this.m_projMat.m[9] == 0.0) &&
			(this.m_projMat.m[2] == 0.0) && (this.m_projMat.m[6] == 0.0)) {
            if ((this.m_viewMat.m[2] == 0.0) && (this.m_viewMat.m[6] == 0.0)) {
                this.m_is2D = true;
                return;
            }
        }
    }

    this.m_is2D = false;
};

CCamera.prototype.SetViewMat = function (vmat) {
    this.m_viewMat = vmat;

    this.m_invViewMat.Invert(vmat);
    this.m_viewProjMat.Multiply(this.m_viewMat, this.m_projMat);

    this.m_invViewProjMat.Invert(this.m_viewProjMat);

    this.Update2D();
};
CCamera.prototype.SetProjMat = function (vmat) {
    this.m_projMat = vmat;

    this.m_invProjMat.Invert(vmat);

    this.m_viewProjMat.Multiply(this.m_viewMat, this.m_projMat);

    this.m_invViewProjMat.Invert(this.m_viewProjMat);

    this.Update2D();
};

// ################################################################################################
//  Once all rooms have been created, set the high water mark
//  Cameras should really be found using a dictionary, as this would still suffer
//  when we start creating dynamic rooms.
// ################################################################################################
CameraManager.prototype.SetInitialLoadHighPoint = function () {
    this.m_InitialLoadHighPoint = this.m_CamPool.length;
};

// ################################################################################################
// Create camera
// ################################################################################################
CameraManager.prototype.CreateCamera = function () {
    var NewCam = new CCamera();
    NewCam.m_id = this.camId;
    this.camId++;
    this.m_CamPool.Add(NewCam);
    return NewCam.m_id;
};

// ################################################################################################
// Get camera from it's ID - should be a dictionary
// ################################################################################################
CameraManager.prototype.GetCamera = function (camid) {
    for (var i = 0; i < this.m_CamPool.length; i++) {
        if (this.m_CamPool.Get(i) != null)
            if (this.m_CamPool.Get(i).m_id == camid)
                return this.m_CamPool.Get(i);
    }

    return null;
};

// ################################################################################################
// Destroy a camera - should use the dictionary to lookup
// ################################################################################################
CameraManager.prototype.DestroyCamera = function (camid) {
    for (var i = 0; i < this.m_CamPool.length; i++) {
        var pCam = this.m_CamPool.Get(i);
        if (pCam) {
            if (pCam.m_id === camid) {
                if (this.m_tempCamera == pCam)
                    this.m_tempCamera = null;
                this.m_CamPool.DeleteItem(pCam);
                return;
            }
        }
    }
    return;
};


// ################################################################################################
// Wipe ALL cameras - and reset the high water mark
// ################################################################################################
CameraManager.prototype.ClearAll = function () {
    this.m_CamPool.Clear();
    m_InitialLoadHighPoint = 0;
};

// ################################################################################################
// Create a camera from a given view
// ################################################################################################
CameraManager.prototype.CreateCameraFromView = function (_pView) {
    if (_pView == null)
        return null;

    var pNewCamID = this.CreateCamera();

    var pNewCam = this.GetCamera(pNewCamID);
    if (pNewCam != null) {
        pNewCam.SetViewX(_pView.worldx);
        pNewCam.SetViewY(_pView.worldy);
        pNewCam.SetViewWidth(_pView.worldw);
        pNewCam.SetViewHeight(_pView.worldh);
        pNewCam.SetViewSpeedX(_pView.hspeed);
        pNewCam.SetViewSpeedY(_pView.vspeed);
        pNewCam.SetViewBorderX(_pView.hborder);
        pNewCam.SetViewBorderY(_pView.vborder);
        pNewCam.SetViewAngle(0.0);
        pNewCam.SetTargetInstance(_pView.objid);

        // Initially, just assume the view is aligned to the top-left of the room
        pNewCam.Build2DView(pNewCam.GetViewX() + pNewCam.GetViewWidth() * 0.5, pNewCam.GetViewY() + pNewCam.GetViewHeight() * 0.5);
    }
    return pNewCam;
};

// ################################################################################################
// Start a room
// ################################################################################################
CameraManager.prototype.StartRoom = function () {
    if (this.m_pScriptInstance === null) {
        this.m_pScriptInstance = new yyInstance(0, 0, 0, 0, false, true);
    }
};

// ################################################################################################
// End a room
// ################################################################################################
CameraManager.prototype.EndRoom = function () {
    if (this.m_pScriptInstance != null) {
        this.m_pScriptInstance = null;
    }

    // Kill any cameras above watermark....BUT NOT CLONED ONES!
    // (cloned cameras are used when creating and copying rooms)
    // If a game creates lots of rooms this list could get VERY long...
    // Unlike native, this yyList has a freelist so won't get infinitely long
    for (var i = this.m_InitialLoadHighPoint; i < this.m_CamPool.length; i++) {
        var _pCam = this.m_CamPool.Get(i);
        if (_pCam !== null) {
            if (_pCam.IsCloned() && !_pCam.GetPersistent()) {
                this.DestroyCamera(_pCam.m_id);
            }
        }
    }
};

// ################################################################################################
// Clean a camera
// ################################################################################################
CameraManager.prototype.Clean = function () {
    this.m_currCameraId = 0;
    this.m_activeCamera = null;
    this.m_cameraListCurr = 0;
    this.m_lastCamPos = 0;
    this.m_tempCamera = null;
};

// ################################################################################################
// Destroy a camera - should use the dictionary to lookup
// ################################################################################################
CameraManager.prototype.GetActiveCamera = function () {
    return this.m_activeCamera;
};

CameraManager.prototype.GetTempCamera = function () {
    if (this.m_tempCamera == null)
        this.m_tempCamera = this.GetCamera(this.CreateCamera());
    return this.m_tempCamera;
};

CameraManager.prototype.SetActiveCamera = function (arg0) {
    if (typeof (arg0) == CCamera) {
        this.m_activeCamera = arg0;
    }
    else {
        this.m_activeCamera = this.GetCamera(arg0);
    }
};
CCamera.prototype.GetTargetInstance = function () {
    return this.m_targetInstance;
};
CCamera.prototype.SetTargetInstance = function (arg0) {
    this.m_targetInstance = arg0;
};
CCamera.prototype.SetUpdateScript = function (arg0) {
    this.m_updateScript = arg0;
};
CCamera.prototype.SetBeginScript = function (arg0) {
    this.m_beginScript = arg0;
};
CCamera.prototype.SetEndScript = function (arg0) {
    this.m_endScript = arg0;
};

CCamera.prototype.GetUpdateScript = function () {
    return this.m_updateScript;
};
CCamera.prototype.GetBeginScript = function () {
    return this.m_beginScript;
};
CCamera.prototype.GetEndScript = function () {
    return this.m_endScript;
};

CCamera.prototype.GetViewMat = function () {
    return this.m_viewMat;
};

CCamera.prototype.GetProjMat = function ()
{

    if (g_RenderTargetActive == -1)
    {
        return this.m_projMat;
    }
    else
    {
        var flipMat = new Matrix();
        flipMat.m[_22] = -1;
        var proj = new Matrix();

        proj.Multiply(this.m_projMat, flipMat);

        return proj;
    }
};

CCamera.prototype.GetViewProjMat = function () {
    return this.m_viewProjMat;
};

CCamera.prototype.GetInvProjMat = function () {
    return this.m_invProjMat;
};
CCamera.prototype.GetInvViewMat = function () {
    return this.m_invViewMat;
};



CCamera.prototype.GetInvViewProjMat = function () {
    return this.m_invViewProjMat;
};

CCamera.prototype.SetViewX = function (arg0) {
    this.m_viewX = arg0;
};

CCamera.prototype.GetViewX = function () {
    return this.m_viewX;
};

CCamera.prototype.SetViewY = function (arg0) {
    this.m_viewY = arg0;
};

CCamera.prototype.GetViewY = function () {
    return this.m_viewY;
};
CCamera.prototype.SetID = function (arg0) {
    this.m_id = arg0;
};

CCamera.prototype.GetID = function () {
    return this.m_id;
};

CCamera.prototype.SetViewWidth = function (arg0) {
    this.m_viewWidth = arg0;
};

CCamera.prototype.GetViewWidth = function () {
    return this.m_viewWidth;
};

CCamera.prototype.SetViewHeight = function (arg0) {
    this.m_viewHeight = arg0;
};

CCamera.prototype.GetViewHeight = function () {
    return this.m_viewHeight;
};

CCamera.prototype.SetViewSpeedX = function (arg0) {
    this.m_viewSpeedX = arg0;
};

CCamera.prototype.GetViewSpeedX = function () {
    return this.m_viewSpeedX;
};

CCamera.prototype.SetViewSpeedY = function (arg0) {
    this.m_viewSpeedY = arg0;
};

CCamera.prototype.GetViewSpeedY = function () {
    return this.m_viewSpeedY;
};

CCamera.prototype.SetViewBorderX = function (arg0) {
    this.m_viewBorderX = arg0;
};

CCamera.prototype.GetViewBorderX = function () {
    return this.m_viewBorderX;
};

CCamera.prototype.SetViewBorderY = function (arg0) {
    this.m_viewBorderY = arg0;
};
CCamera.prototype.GetViewBorderY = function () {
    return this.m_viewBorderY;
};

CCamera.prototype.SetViewAngle = function (arg0) {
    this.m_viewAngle = arg0;
};

CCamera.prototype.GetViewAngle = function () {
    return this.m_viewAngle;
};
CCamera.prototype.Begin = function () {
    if (this.m_beginScript !== null) {
        this.m_beginScript(this.m_pScriptInstance, this.m_pScriptInstance);
    }
};
CCamera.prototype.End = function () {
    if (this.m_endScript !== null) {
        this.m_endScript(this.m_pScriptInstance, this.m_pScriptInstance);
    }
};


CCamera.prototype.GetCamPos = function () {
    // Extract position from the view matrix
    var posvec = new Vector3();

    posvec.X = this.m_invViewMat.m[_41];
    posvec.Y = this.m_invViewMat.m[_42];
    posvec.Z = this.m_invViewMat.m[_43];

    return posvec;

};

CCamera.prototype.GetCamDir = function () {
    var dirvec = new Vector3();

    dirvec.X = this.m_viewMat.m[_13];
    dirvec.Y = this.m_viewMat.m[_23];
    dirvec.Z = this.m_viewMat.m[_33];

    dirvec.Normalise();

    return dirvec;
};

CCamera.prototype.GetCamUp = function () {
    var upvec = new Vector3();

    upvec.X = this.m_viewMat.m[_12];
    upvec.Y = this.m_viewMat.m[_22];
    upvec.Z = this.m_viewMat.m[_32];

    upvec.Normalise();

    return upvec;
};



CCamera.prototype.GetCamRight = function () {
    var rightvec = new Vector3();

    rightvec.X = this.m_viewMat.m[_11];
    rightvec.Y = this.m_viewMat.m[_21];
    rightvec.Z = this.m_viewMat.m[_31];

    rightvec.Normalise();

    return rightvec;
};



CCamera.prototype.ApplyMatrices = function () {
    UpdateViewExtents(this.m_viewMat, this.m_projMat, this.m_invViewMat, this.m_invViewProjMat);

    if (g_webGL != null) {
        WebGL_SetMatrix(MATRIX_VIEW, this.m_viewMat);
    }
    else {
        WebGL_SetMatrix(MATRIX_VIEW, this.m_viewMat);
        // Work out port scaling
        var wscale = g_clipw / g_worldw;
        var hscale = g_cliph / g_worldh;

        // May have to 'unrotate' the matrix
        g_transform[0] = this.m_viewMat.m[_11] * wscale;
        g_transform[1] = this.m_viewMat.m[_21] * wscale;
        g_transform[2] = (this.m_viewMat.m[_41] + (g_worldw * 0.5)) * wscale + g_clipx;

        g_transform[3] = this.m_viewMat.m[_12] * hscale;
        g_transform[4] = this.m_viewMat.m[_22] * hscale;
        g_transform[5] = (this.m_viewMat.m[_42] + (g_worldh * 0.5)) * hscale + g_clipy;

        // for some reason this function takes the matrix transposed
        graphics._setTransform(g_transform[0], g_transform[3], g_transform[1], g_transform[4], g_transform[2], g_transform[5]);
    }

    if (g_RenderTargetActive == -1) {
        WebGL_SetMatrix(MATRIX_PROJECTION, this.m_projMat);
    }
    else {
        var flipMat = new Matrix();
        flipMat.m[_22] = -1;
        var proj = new Matrix();

        proj.Multiply(this.m_projMat, flipMat);

        WebGL_SetMatrix(MATRIX_PROJECTION, proj);
    }

};

CCamera.prototype.Update = function () {
    if (this.m_updateScript != null) {
        this.m_updateScript(g_DummyInst, g_DummyInst);
    }
    else {
        if ((this.m_targetInstance >= 0) && (this.m_is2D)) {
            var inst = null;
            if (this.m_targetInstance < 10000) {
                var pObj = g_pObjectManager.Get(this.m_targetInstance);

                var pool = pObj.GetRPool();
                for (var ii = 0; ii < pool.length; ii++) {
                    var pInst = pool[ii];
                    if (pInst.marked) continue;
                    if (!pInst.active) continue;

                    inst = pInst;
                    break;

                }

            }
            else {
                inst = g_pInstanceManager.Get(this.m_targetInstance);

                if (inst != null) {
                    if (inst.marked || (!inst.active))
                        inst = null;
                }
            }
            if (inst != null) {
                var halfwidth = this.m_viewWidth * 0.5;
                var halfheight = this.m_viewHeight * 0.5;
                var l, t;
                var ix, iy;
                l = this.m_viewX;
                t = this.m_viewY;

                if (inst.bbox_dirty) inst.Compute_BoundingBox();
                ix = Math.floor(inst.x);
                iy = Math.floor(inst.y);

                if (2 * this.m_viewBorderX >= this.m_viewWidth) {
                    l = ix - halfwidth;
                }
                else if (ix - this.m_viewBorderX < this.m_viewX) {
                    l = ix - this.m_viewBorderX;
                }
                else if (ix + this.m_viewBorderX > (this.m_viewX + this.m_viewWidth)) {
                    l = ix + this.m_viewBorderX - this.m_viewWidth;
                }

                if (2 * this.m_viewBorderY >= this.m_viewHeight) {
                    t = iy - halfheight;
                }
                else if (iy - this.m_viewBorderY < this.m_viewY) {
                    t = iy - this.m_viewBorderY;
                }
                else if (iy + this.m_viewBorderY > (this.m_viewY + this.m_viewHeight)) {
                    t = iy + this.m_viewBorderY - this.m_viewHeight;
                }


                // Make sure it does not extend beyond the room
                if (l < 0) l = 0;
                if (l + this.m_viewWidth > g_RunRoom.GetWidth()) l = g_RunRoom.GetWidth() - this.m_viewWidth;
                if (t < 0) t = 0;
                if (t + this.m_viewHeight > g_RunRoom.GetHeight()) t = g_RunRoom.GetHeight() - this.m_viewHeight;

                // Restrict motion speed
                if (this.m_viewSpeedX >= 0) {
                    if ((l < this.m_viewX) && (this.m_viewX - l > this.m_viewSpeedX)) l = this.m_viewX - this.m_viewSpeedX;
                    if ((l > this.m_viewX) && (l - this.m_viewX > this.m_viewSpeedX)) l = this.m_viewX + this.m_viewSpeedX;
                }
                if (this.m_viewSpeedY >= 0) {
                    if ((t < this.m_viewY) && (this.m_viewY - t > this.m_viewSpeedY)) t = this.m_viewY - this.m_viewSpeedY;
                    if ((t > this.m_viewY) && (t - this.m_viewY > this.m_viewSpeedY)) t = this.m_viewY + this.m_viewSpeedY;
                }

                this.m_viewX = l;
                this.m_viewY = t;

                this.Build2DView(l + halfwidth, t + halfheight);


            }
        }
    }
};

CCamera.prototype.Build2DView = function (arg0, arg1) {
    var V1 = new Vector3();
    var V2 = new Vector3();
    var V3 = new Vector3();

    V1.X = arg0;
    V1.Y = arg1;
    V1.Z = -16000.0;
    V2.X = arg0;
    V2.Y = arg1;
    V2.Z = 0.0;

    V3.X = Math.sin(-this.m_viewAngle * (Math.PI / 180.0));
    V3.Y = Math.cos(-this.m_viewAngle * (Math.PI / 180.0));
    V3.Z = 0.0;


    var viewMat = new Matrix();
    viewMat.LookAtLH(V1, V2, V3);

    var projMat = new Matrix();
    projMat.OrthoLH(this.m_viewWidth, this.m_viewHeight, 1, 32000.0);

    this.SetViewMat(viewMat);
    this.SetProjMat(projMat);

};

CCamera.prototype.Build3DView = function (arg0, arg1) {
    var V1 = new Vector3();
    var V2 = new Vector3();
    var V3 = new Vector3();

    V1.X = arg0;
    V1.Y = arg1;
    V1.Z = -(this.m_viewWidth);

    V2.X = arg0;
    V2.Y = arg1;
    V2.Z = 0.0;

    V3.X = Math.sin(-this.m_viewAngle * (Math.PI / 180.0));
    V3.Y = Math.cos(-this.m_viewAngle * (Math.PI / 180.0));
    V3.Z = 0.0;


    var viewMat = new Matrix();
    viewMat.LookAtLH(V1, V2, V3);

    var projMat = new Matrix();
    projMat.PerspectiveLH(1.0, -(this.m_viewHeight) / (this.m_viewWidth), 1, 32000.0);

    this.SetViewMat(viewMat);
    this.SetProjMat(projMat);

};

function camera_create() {
    return g_pCameraManager.CreateCamera();
};

function camera_create_view(_viewx, _viewy, _width, _height, _angle, _target, _speedx, _speedy, _borderx, _bordery) {
    var cam_id = g_pCameraManager.CreateCamera();
    var cam = g_pCameraManager.GetCamera(cam_id);

    if (cam != null) {
        cam.SetViewX(yyGetReal(_viewx));
        cam.SetViewY(yyGetReal(_viewy));
        cam.SetViewWidth(yyGetReal(_width));
        cam.SetViewHeight(yyGetReal(_height));

        var angle = 0;
        var target = -1;
        var speedx = -1;
        var speedy = -1;
        var borderx = 0;
        var bordery = 0;

        var numargs = arguments.length;
        if (numargs > 4) angle = yyGetReal(_angle);
        if (numargs > 5) target = yyGetInt32(_target);
        if (numargs > 6) speedx = yyGetReal(_speedx);
        if (numargs > 7) speedy = yyGetReal(_speedy);
        if (numargs > 8) borderx = yyGetReal(_borderx);
        if (numargs > 9) bordery = yyGetReal(_bordery);

        cam.SetViewAngle(angle);
        cam.SetTargetInstance(target);
        cam.SetViewSpeedX(speedx);
        cam.SetViewSpeedY(speedy);
        cam.SetViewBorderX(borderx);
        cam.SetViewBorderY(bordery);

        if (cam.IsOrthoProj()) {
            cam.Build2DView(cam.GetViewX() + (cam.GetViewWidth() * 0.5), cam.GetViewY() + (cam.GetViewHeight() * 0.5));
        }
        else {
            cam.Build3DView(cam.GetViewX() + (cam.GetViewWidth() * 0.5), cam.GetViewY() + (cam.GetViewHeight() * 0.5));
        }
    }

    return cam.m_id;
}

function camera_destroy(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        if (g_pCameraManager.GetActiveCamera() === pCam) {
            g_pCameraManager.SetActiveCamera(null);
        }
        g_pCameraManager.DestroyCamera(pCam.m_id);
    }
};

function camera_apply(arg0) {
    var cam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (cam != null) {
        // Don't change active camera

        // Apply camera's current matrices
        cam.ApplyMatrices();
    }
}

function camera_copy_transforms(arg0,arg1) {
    var dest = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    var src = g_pCameraManager.GetCamera(yyGetInt32(arg1));

    if (dest == null)
    {
        dbg_csol.Output("camera_copy_settings() - camera to copy to doesn't exist\n");
        return;
    }
    if (src == null)
    {
        dbg_csol.Output("camera_copy_settings() - camera to copy from doesn't exist\n");
        return;
    }
    if (src == dest)
    {
        dbg_csol.Output("camera_copy_settings() - source and destination cameras are the same\n");
		return;
    }

    // copy all values
    dest.m_viewX = src.m_viewX;
    dest.m_viewY = src.m_viewY;
    dest.m_viewWidth = src.m_viewWidth;
    dest.m_viewHeight = src.m_viewHeight;
    dest.m_viewSpeedX = src.m_viewSpeedX;
    dest.m_viewSpeedY = src.m_viewSpeedY;
    dest.m_viewBorderX = src.m_viewBorderX;
    dest.m_viewBorderY = src.m_viewBorderY;
    dest.m_viewAngle = src.m_viewAngle;    

    var viewmat = new Matrix(src.m_viewMat);
    var projmat = new Matrix(src.m_projMat);
    var viewProjMat = new Matrix(src.m_viewProjMat);
    var invProjMat = new Matrix(src.m_invProjMat);
    var invViewMat = new Matrix(src.m_invViewMat);
    var invViewProjMat = new Matrix(src.m_invViewProjMat);
    dest.m_projMat = projmat;
    dest.m_viewMat = viewmat;
    dest.m_viewProjMat = viewProjMat;
    dest.m_invProjMat = invProjMat;
    dest.m_invViewMat = invViewMat;
    dest.m_invViewProjMat = invViewProjMat;    
}

function camera_get_active() {
    var cam = g_pCameraManager.GetActiveCamera();
    if (cam != null)
        return cam.m_id;
    else
        return -1;
}

function camera_get_default() {
    var cam = g_pCameraManager.GetCamera(g_DefaultCameraID);
    if (cam != null) {
        return cam.m_id;
    }
    else
        return -1;
}

function camera_set_default(arg0) {
    var cam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (cam != null) {
        g_DefaultCameraID = cam.m_id;
    }
}

// Setters
function camera_set_view_mat(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var vMat = new Matrix();
        for (var i = 0; i < 16; i++)
            vMat.m[i] = arg1[i];

        pCam.SetViewMat(vMat);

    }
};

function camera_set_proj_mat(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var vMat = new Matrix();
        for (var i = 0; i < 16; i++)
            vMat.m[i] = arg1[i];

        pCam.SetProjMat(vMat);

    }
};

function camera_set_view_target(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetTargetInstance(yyGetInt32(arg1));
    }
};

function camera_set_update_script(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        switch (typeof arg1)
        {
            case "number":
                var ind = yyGetInt32(arg1);
                if (ind >= 100000)
                    ind -= 100000;
                pCam.SetUpdateScript(g_pGMFile.Scripts[ind]);
                break;
            case "function":
                pCam.SetUpdateScript(arg1);
                break;
            default:    
                yyError("camera_set_end_script : argument0 is not a function or a script");
        }
    }
};

function camera_set_begin_script(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        switch (typeof arg1)
        {
            case "number":
                var ind = yyGetInt32(arg1);
                if( ind >= 100000 )
                    ind -= 100000;
                pCam.SetBeginScript(g_pGMFile.Scripts[ind]);
                break;
            case "function":
                pCam.SetBeginScript(arg1);
                break;
            default:    
                yyError("camera_set_begin_script : argument0 is not a function or a script");
        }
    }
};

function camera_set_end_script(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        switch (typeof arg1)
        {
            case "number":
                var ind = yyGetInt32(arg1);
                if( ind >= 100000 )
                    ind -= 100000;
                pCam.SetEndScript(g_pGMFile.Scripts[ind]);
                break;
            case "function":
                pCam.SetEndScript(arg1);
                break;
            default:    
                yyError("camera_set_end_script : argument0 is not a function or a script");
        }
    }
};

function camera_set_view(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)// pass in camID, width, height, speed X, speed Y, border X, border Y and angle
{
    var pCam = g_pCameraManager.GetCamera(arg0);
    if (pCam != null) {
        pCam.SetViewX(arg1);
        pCam.SetViewY(arg2);
        pCam.SetViewWidth(arg3);
        pCam.SetViewHeight(arg4);
        pCam.SetViewSpeedX(arg5);
        pCam.SetViewSpeedY(arg6);
        pCam.SetViewBorderX(arg7);
        pCam.SetViewBorderY(arg8);
        pCam.SetViewAngle(arg9);
        pCam.SetTargetInstance(arg10);

        pCam.Build2DView(pCam.GetViewX() + pCam.GetViewWidth() * 0.5, pCam.GetViewY() + pCam.GetViewHeight() * 0.5);

    }

};

function camera_set_view_pos(arg0, arg1, arg2) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetViewX(yyGetReal(arg1));
        pCam.SetViewY(yyGetReal(arg2));
        pCam.Build2DView(pCam.GetViewX() + pCam.GetViewWidth() * 0.5, pCam.GetViewY() + pCam.GetViewHeight() * 0.5);
    }
};

function camera_set_view_size(arg0, arg1, arg2) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetViewWidth(yyGetReal(arg1));
        pCam.SetViewHeight(yyGetReal(arg2));
        pCam.Build2DView(pCam.GetViewX() + pCam.GetViewWidth() * 0.5, pCam.GetViewY() + pCam.GetViewHeight() * 0.5);
    }

};

function camera_set_view_speed(arg0, arg1, arg2) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetViewSpeedX(yyGetReal(arg1));
        pCam.SetViewSpeedY(yyGetReal(arg2));
    }

};

function camera_set_view_border(arg0, arg1, arg2) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetViewBorderX(yyGetReal(arg1));
        pCam.SetViewBorderY(yyGetReal(arg2));
    }
};

function camera_set_view_angle(arg0, arg1) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        pCam.SetViewAngle(yyGetReal(arg1));
        pCam.Build2DView(pCam.GetViewX() + pCam.GetViewWidth() * 0.5, pCam.GetViewY() + pCam.GetViewHeight() * 0.5);
    }

};

// Getters
function camera_get_view_mat(arg0) {
    //Have to check these funcs returning matrixes
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewMat().m;
    }
    return -1;

};
function camera_get_proj_mat(arg0) {
    //Have to check these funcs returning matrixes
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetProjMat().m;
    }
    return -1;

};



function camera_get_view_target(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var instanceID = pCam.GetTargetInstance();
        return (instanceID < 0)
            ? instanceID
            : MAKE_REF(REFID_INSTANCE, instanceID);
    }
    return -1;
};

function camera_get_update_script(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var script = pCam.GetUpdateScript();
        if (typeof script === "number")
        {
            return method_get_index(script);
        }
        else if (typeof script == "function")
        {
            return script;
        }
    }
    return -1;
};

function camera_get_begin_script(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var script = pCam.GetBeginScript();
        if (typeof script === "number")
        {
            return method_get_index(script);
        }
        else if (typeof script == "function")
        {
            return script;
        }
    }
    return -1;
};

function camera_get_end_script(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        var script = pCam.GetEndScript();
        if(typeof script === "number")
        {
            return method_get_index(script);
        }
        else if (typeof script == "function")
        {
            return script;
        }
    }
    return -1;
};

function camera_get_view_x(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewX();
    }
    return -1;

};
function camera_get_view_y(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewY();
    }
    return -1;
};
function camera_get_view_width(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewWidth();
    }
    return -1;

};
function camera_get_view_height(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewHeight();
    }
    return -1;

};
function camera_get_view_speed_x(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewSpeedX();
    }
    return -1;

};
function camera_get_view_speed_y(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewSpeedY();
    }
    return -1;
};
function camera_get_view_border_x(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewBorderX();
    }
    return -1;

};
function camera_get_view_border_y(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewBorderY();
    }
    return -1;

};
function camera_get_view_angle(arg0) {
    var pCam = g_pCameraManager.GetCamera(yyGetInt32(arg0));
    if (pCam != null) {
        return pCam.GetViewAngle();
    }
    return -1;

};
