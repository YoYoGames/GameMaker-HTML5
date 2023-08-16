// **********************************************************************************************************************
// 
// Copyright (c)2021, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyNineSliceData.js
// Created:         08/01/2021
// Author:          MikeR
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 08/01/2021		
// 
// **********************************************************************************************************************

var NINESLICE_TILE_STRETCH = 0,
    NINESLICE_TILE_REPEAT = 1,
    NINESLICE_TILE_MIRROR = 2,
    NINESLICE_TILE_BLANKREPEAT = 3,
    NINESLICE_TILE_HIDE = 4,
    NINESLICE_TILE_MAX = 5;

var NINESLICE_LEFT = 0,
    NINESLICE_TOP = 1,
    NINESLICE_RIGHT = 2,
    NINESLICE_BOTTOM = 3,
    NINESLICE_CENTRE = 4,
    NINESLICE_NUMSLICE = 5;

function yyNineSliceCacheData()
{
    this.dirty = true;

    this.tilemode = [];
    for (var i = 0; i < NINESLICE_NUMSLICE; i++)
    {
        this.tilemode[i] = NINESLICE_TILE_STRETCH;
    }

    this.width = 0;
    this.height = 0;
    this.spriteindex = -1;
    this.frameindex = 0;

    this.transxorigin = 0.0;
    this.transyorigin = 0.0;

    this.verts = [];
    this.uvs = [];
}

yyNineSliceCacheData.prototype.Reset = function (_tilemode, _width, _height, _sprite, _ind)
{
    this.tilemode = [];
    for (var i = 0; i < NINESLICE_NUMSLICE; i++)
    {
        this.tilemode[i] = _tilemode[i];
    }

    this.width = _width;
    this.height = _height;
    this.spriteindex = _sprite;
    this.frameindex = _ind;

    this.verts = [];
    this.uvs = [];

    this.dirty = false;
};

yyNineSliceCacheData.prototype.AddVert = function (_x, _y, _u, _v)
{
    var numvals = this.verts.length;

    this.verts[numvals] = _x;
    this.verts[numvals + 1] = _y;

    this.uvs[numvals] = _u;
    this.uvs[numvals + 1] = _v;
};


// #############################################################################################
/// Function:<summary>
///             Create a new NineSlice object
///          </summary>
// #############################################################################################
/** @constructor */
function yyNineSliceData(_pStorage)
{
    this.__type = "[NineSliceData]";
    this.__yyIsGMLObject = true;
    this.pName = "nineslicedata";

    if ((_pStorage != null) && (_pStorage != undefined))
    {
        this.left = _pStorage.nLeft;
        this.top = _pStorage.nTop;
        this.right = _pStorage.nRight;
        this.bottom = _pStorage.nBottom;

        this.enabled = _pStorage.nEnabled;

        this.tilemode = [];

        for (i = 0; i < NINESLICE_NUMSLICE; i++)
        {
            this.tilemode[i] = _pStorage.nTilemode[i];
        }
    }
    else
    {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.enabled = false;

        this.tilemode = [];

        for (i = 0; i < NINESLICE_NUMSLICE; i++)
        {
            this.tilemode[i] = NINESLICE_TILE_STRETCH;
        }
    }

    this.cache = new yyNineSliceCacheData();

    Object.defineProperties(this, {
        gmlleft: {
            enumerable: true,
            get: function () { return this.left; },
            set: function (_val) { this.left = yyGetInt32(_val); this.cache.dirty = true; }
        },
        gmltop: {
            enumerable: true,
            get: function () { return this.top; },
            set: function (_val) { this.top = yyGetInt32(_val); this.cache.dirty = true; }
        },
        gmlright: {
            enumerable: true,
            get: function () { return this.right; },
            set: function (_val) { this.right = yyGetInt32(_val); this.cache.dirty = true; }
        },
        gmlbottom: {
            enumerable: true,
            get: function () { return this.bottom; },
            set: function (_val) { this.bottom = yyGetInt32(_val); this.cache.dirty = true; }
        },
        gmlenabled: {
            enumerable: true,
            get: function () { return this.enabled; },
            set: function (_val) { this.enabled = yyGetBool(_val); this.cache.dirty = true; }
        },
        gmltilemode: {
            enumerable: true,
            get: function () { return this.tilemode; },
            set: function (_val)
            {
                if (_val instanceof Array)
                {
                    this.tilemode = _val;
                }
                else
                {
                    throw new Error("value must be an array of tilemodes");
                }
            }
        },
    });
}
yyNineSliceData.prototype.toString = function () {
    return yyGetString(this);
};

yyNineSliceData.prototype.SetLeft = function (_val) { this.left = _val; this.cache.dirty = true; };
yyNineSliceData.prototype.SetTop = function (_val) { this.top = _val; this.cache.dirty = true; };
yyNineSliceData.prototype.SetRight = function (_val) { this.right = _val; this.cache.dirty = true; };
yyNineSliceData.prototype.SetBottom = function (_val) { this.bottom = _val; this.cache.dirty = true; };
yyNineSliceData.prototype.SetEnabled = function (_enabled) { this.enabled = _enabled; this.cache.dirty = true; };
yyNineSliceData.prototype.SetTilemode = function (_slice, _mode) { this.tilemode[_slice] = _mode; this.cache.dirty = true; };

yyNineSliceData.prototype.GetLeft = function () { return this.left; };
yyNineSliceData.prototype.GetTop = function () { return this.top; };
yyNineSliceData.prototype.GetRight = function () { return this.right; };
yyNineSliceData.prototype.GetBottom = function () { return this.bottom; };
yyNineSliceData.prototype.GetEnabled = function () { return this.enabled; };
yyNineSliceData.prototype.GetTilemode = function (_slice) { return this.tilemode[_slice]; };

yyNineSliceData.prototype.GenerateCacheData = function (_width, _height, _ind, _sprite)
{
    if (!g_webGL)
        return;         // not supported on canvas

    var pSpr = _sprite;
    if (pSpr == null)
    {
        return;
    }

    this.cache.Reset(this.tilemode, _width, _height, _sprite, _ind);

    var i;
    var U = [];
    var V = [];
    var XOffset = 0.0;
    var YOffset = 0.0;
    var CropWidth = pSpr.width;
    var CropHeight = pSpr.height;
    var texbasex = 0;
    var texbasey = 0;

    var TPE = pSpr.ppTPE[_ind];
    var tex = TPE.texture;

    if (!tex.complete) return;

    XOffset = TPE.XOffset;
    YOffset = TPE.YOffset;
    CropWidth = TPE.CropWidth;
    CropHeight = TPE.CropHeight;
    texbasex = TPE.x;
    texbasey = TPE.y;

    var nineSliceScaleX = CropWidth / TPE.w;
    var nineSliceScaleY = CropHeight / TPE.h;

    // Work out widths/heights and scaling factors
    var leftwidth = this.left;
    var midwidth = (pSpr.width - this.right) - this.left;
    var rightwidth = this.right;

    var topheight = this.top;
    var midheight = (pSpr.height - this.bottom) - this.top;
    var bottomheight = this.bottom;

    var neg_width = (_width < 0) ? 1 : 0; 
    var neg_height = (_height < 0) ? 1 : 0; 
    var flip_winding = (neg_width ^ neg_height) ? true : false; 
 
    var flipw = 1.0; 
    var fliph = 1.0; 
 
    if (neg_width) 
    { 
        _width = -_width; 
        flipw = -1.0; 
    } 
 
    if (neg_height) 
    { 
        _height = -_height; 
        fliph = -1.0; 
    } 

    // Don't let the nineslice corners overlap
    /*if (_width < (leftwidth + rightwidth))
        _width = leftwidth + rightwidth;

    if (_height < (topheight + bottomheight))
        _height = topheight + bottomheight;*/

    var widthscale = (_width - leftwidth - rightwidth) / midwidth;
    var heightscale = (_height - topheight - bottomheight) / midheight;

    // Clip in the same way the IDE does 
    if (_width < leftwidth) 
    { 
        leftwidth = _width;		 
        rightwidth = 0.0; 
        widthscale = 0.0; 
    } 
    else if (_width < (leftwidth + rightwidth)) 
    {		 
        rightwidth = (_width - leftwidth); 
        widthscale = 0.0; 
    } 
 
    if (_height < topheight) 
    { 
        topheight = _height;		 
        bottomheight = 0.0; 
        heightscale = 0.0; 
    } 
    else if (_height < (topheight + bottomheight)) 
    {		 
        bottomheight = (_height - topheight); 
        heightscale = 0.0; 
    } 

    var X = [];
    var Y = [];

    X[0] = 0.0;
    X[1] = leftwidth;
    X[2] = X[1] + midwidth;
    X[3] = X[2] + rightwidth;

    Y[0] = 0.0;
    Y[1] = topheight;
    Y[2] = Y[1] + midheight;
    Y[3] = Y[2] + bottomheight;

    for (i = 0; i < 4; i++)
    {
        U[i] = X[i];
        V[i] = Y[i];
    }

    var xorigin = pSpr.xOrigin;
    var yorigin = pSpr.yOrigin;

    /*if (this.xorigin < X[1])
        this.cache.transxorigin = this.xorigin;
    else if (this.xorigin < X[2])
        this.cache.transxorigin = X[1] + ((this.xorigin - X[1]) * widthscale);
    else
        this.cache.transxorigin = (this.xorigin - X[2]) + ((X[2] - X[1]) * widthscale);

    if (this.yorigin < Y[1])
        this.cache.transyorigin = this.yorigin;
    else if (this.yorigin < Y[2])
        this.cache.transyorigin = Y[1] + ((this.yorigin - Y[1]) * heightscale);
    else
        this.cache.transyorigin = (this.yorigin - Y[2]) + ((Y[2] - Y[1]) * heightscale);*/

    this.cache.transxorigin = xorigin * (_width / pSpr.width);
    this.cache.transyorigin = yorigin * (_height / pSpr.height);

    this.cache.transxorigin *= flipw;
    this.cache.transyorigin *= fliph;    

    // Now shift the right and bottom-most coordinates to account for scaling
    var dist = X[3] - X[2];
    X[2] = X[1] + ((X[2] - X[1]) * widthscale);
    X[3] = X[2] + dist;

    dist = Y[3] - Y[2];
    Y[2] = Y[1] + ((Y[2] - Y[1]) * heightscale);
    Y[3] = Y[2] + dist;

    var alltilemodes = [];
    alltilemodes[0] = NINESLICE_TILE_STRETCH;           alltilemodes[1] = this.tilemode[NINESLICE_TOP];     alltilemodes[2] = NINESLICE_TILE_STRETCH;
    alltilemodes[3] = this.tilemode[NINESLICE_LEFT];    alltilemodes[4] = this.tilemode[NINESLICE_CENTRE];  alltilemodes[5] = this.tilemode[NINESLICE_RIGHT];
    alltilemodes[6] = NINESLICE_TILE_STRETCH;           alltilemodes[7] = this.tilemode[NINESLICE_BOTTOM];  alltilemodes[8] = NINESLICE_TILE_STRETCH;

    // Now build section geometry
    // Lots of duplicated work here but trying to share calculations may turn the code into spaghetti
    var x, y;
    var tempX = [];
    var tempY = [];
    var tempU = [];
    var tempV = [];
    for (y = 0; y < 3; y++)
    {
        for (x = 0; x < 3; x++)
        {
            var index = (y * 3) + x;
            if (alltilemodes[index] == NINESLICE_TILE_HIDE)
                continue;

            tempX[0] = X[x];
            tempX[1] = X[x + 1];

            tempY[0] = Y[y];
            tempY[1] = Y[y + 1];

            tempU[0] = U[x];
            tempU[1] = U[x + 1];

            tempV[0] = V[y];
            tempV[1] = V[y + 1];

            if (tempU[1] <= tempU[0])
                continue;

            if (tempV[1] <= tempV[0])
                continue;

            // Compensate for cropping
            if (XOffset > tempU[1])
                continue;		// section culled

            if (YOffset > tempV[1])
                continue;		// section culled

            if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
            {
                // Simple(ish) case
                // As always, need to account for cropping					
                if (XOffset > tempU[0])
                {
                    var distratio = (XOffset - tempU[0]) / (tempU[1] - tempU[0]);
                    tempX[0] = tempX[0] + ((tempX[1] - tempX[0]) * distratio);
                    if (tempX[0] >= tempX[1])
                        continue;

                    tempU[0] = XOffset;
                }

                if (YOffset > tempV[0])
                {
                    var dist = YOffset - tempV[0];
                    var distratio = (YOffset - tempV[0]) / (tempV[1] - tempV[0]);
                    tempY[0] = tempY[0] + ((tempY[1] - tempY[0]) * distratio);
                    if (tempY[0] >= tempY[1])
                        continue;

                    tempV[0] = YOffset;
                }

                tempU[0] -= XOffset;
                tempU[1] -= XOffset;

                tempV[0] -= YOffset;
                tempV[1] -= YOffset;

                if (tempU[0] > CropWidth)
                    continue;	// section culled

                if (tempV[0] > CropHeight)
                    continue;	// section culled

                if (tempU[1] > CropWidth)
                {
                    var distratio = (CropWidth - tempU[0]) / (tempU[1] - tempU[0]);
                    tempX[1] = tempX[0] + ((tempX[1] - tempX[0]) * distratio);
                    if (tempX[0] >= tempX[1])
                        continue;

                    tempU[1] = CropWidth;
                }

                if (tempV[1] > CropHeight)
                {
                    var distratio = (CropHeight - tempV[0]) / (tempV[1] - tempV[0]);
                    tempY[1] = tempY[0] + ((tempY[1] - tempY[0]) * distratio);
                    if (tempY[0] >= tempY[1])
                        continue;

                    tempV[1] = CropHeight;
                }

                // Rescale U and V coordinates into texture space
                for (i = 0; i < 2; i++)
                {
                    tempU[i] += texbasex * nineSliceScaleX;
                    tempV[i] += texbasey * nineSliceScaleY;

                    tempU[i] /= tex.width * nineSliceScaleX;
                    tempV[i] /= tex.height * nineSliceScaleY;
                }

                // Transform our vertex coordinates
                var xcoord = [];
                var ycoord = [];
                xcoord[0] = xcoord[2] = (tempX[0] * flipw);
                xcoord[1] = xcoord[3] = (tempX[1] * flipw);

                ycoord[0] = ycoord[1] = (tempY[0] * fliph);
                ycoord[2] = ycoord[3] = (tempY[1] * fliph);

                // Define verts
                var coordi = [
                                0, 1, 2,
                                2, 1, 3
                ];

                var uvi = [
                            0, 0,
                            1, 0,
                            0, 1,

                            0, 1,
                            1, 0,
                            1, 1
                ];

                if (flip_winding)
                {
                    for (i = 5; i >= 0; i--)
                    {
                        this.cache.AddVert(xcoord[coordi[i]], ycoord[coordi[i]], tempU[uvi[i * 2]], tempV[uvi[i * 2 + 1]]);
                    }
                }
                else
                {
                    for (i = 0; i < 6; i++)
                    {
                        this.cache.AddVert(xcoord[coordi[i]], ycoord[coordi[i]], tempU[uvi[i * 2]], tempV[uvi[i * 2 + 1]]);
                    }
                }
            }
            else
            {
                // Work out number of repeats in U and V
                var repsu = 1;
                var repsv = 1;

                if ((alltilemodes[index] == NINESLICE_TILE_REPEAT) || (alltilemodes[index] == NINESLICE_TILE_MIRROR))
                    repsu = Math.ceil((tempX[1] - tempX[0]) / (tempU[1] - tempU[0]));

                if ((alltilemodes[index] == NINESLICE_TILE_REPEAT) || (alltilemodes[index] == NINESLICE_TILE_MIRROR))   // in the old nineslice system we had separate tile modes for U and V
                    repsv = Math.ceil((tempY[1] - tempY[0]) / (tempV[1] - tempV[0]));

                var chunkwidth, chunkheight;

                if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
                    chunkwidth = tempX[1] - tempX[0];
                else
                    chunkwidth = tempU[1] - tempU[0];

                if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
                    chunkheight = tempY[1] - tempY[0];
                else
                    chunkheight = tempV[1] - tempV[0];

                var chunkX = [];
                var chunkY = [];
                var chunkU = [];
                var chunkV = [];

                chunkX[0] = 0.0;
                chunkX[1] = chunkwidth;

                chunkY[0] = 0.0;
                chunkY[1] = chunkheight;

                chunkU[0] = tempU[0];
                chunkU[1] = tempU[1];

                chunkV[0] = tempV[0];
                chunkV[1] = tempV[1];

                // Handle chunk cropping based on source image
                if (XOffset > chunkU[0])
                {
                    var distratio = (XOffset - chunkU[0]) / (chunkU[1] - chunkU[0]);
                    chunkX[0] = chunkX[0] + ((chunkX[1] - chunkX[0]) * distratio);
                    if (chunkX[0] >= chunkX[1])
                        continue;		// section culled	

                    chunkU[0] = XOffset;
                }

                if (YOffset > chunkV[0])
                {
                    var distratio = (YOffset - chunkV[0]) / (chunkV[1] - chunkV[0]);
                    chunkY[0] = chunkY[0] + ((chunkY[1] - chunkY[0]) * distratio);
                    if (chunkY[0] >= chunkY[1])
                        continue;		// section culled			

                    chunkV[0] = YOffset;
                }

                chunkU[0] -= XOffset;
                chunkU[1] -= XOffset;

                chunkV[0] -= YOffset;
                chunkV[1] -= YOffset;

                if (chunkU[0] > CropWidth)
                    continue;	// section culled

                if (chunkV[0] > CropHeight)
                    continue;	// section culled

                if (chunkU[1] > CropWidth)
                {
                    var distratio = (CropWidth - chunkU[0]) / (chunkU[1] - chunkU[0]);
                    chunkX[1] = chunkX[0] + ((chunkX[1] - chunkX[0]) * distratio);
                    if (chunkX[0] >= chunkX[1])
                        continue;

                    chunkU[1] = CropWidth;
                }

                if (chunkV[1] > CropHeight)
                {
                    var distratio = (CropHeight - chunkV[0]) / (chunkV[1] - chunkV[0]);
                    chunkY[1] = chunkY[0] + ((chunkY[1] - chunkY[0]) * distratio);
                    if (chunkY[0] >= chunkY[1])
                        continue;

                    chunkV[1] = CropHeight;
                }

                // Okay, now we have our cropped chunk data (yay)
                // TODO: precalculate this for non-stretched sections
                // Now tile/mirror these chunks across the specified area

                var curry;
                for (curry = 0; curry < repsv; curry++)
                {
                    var ypos = tempY[0] + (chunkheight * curry);

                    var localY = [];
                    var localV = [];

                    //var flipV = false;
                    if ((alltilemodes[index] == NINESLICE_TILE_MIRROR) && (curry & 1))
                    {
                        localY[0] = chunkheight - chunkY[1];
                        localY[1] = chunkheight - chunkY[0];

                        localV[0] = chunkV[1];
                        localV[1] = chunkV[0];

                        //flipV = true;
                    }
                    else
                    {
                        localY[0] = chunkY[0];
                        localY[1] = chunkY[1];

                        localV[0] = chunkV[0];
                        localV[1] = chunkV[1];
                    }

                    localY[0] += ypos;
                    localY[1] += ypos;

                    if (localY[1] > tempY[1])
                    {
                        // Clip
                        var distratio = (tempY[1] - localY[0]) / (localY[1] - localY[0]);
                        localV[1] = localV[0] + ((localV[1] - localV[0]) * distratio);
                        localY[1] = tempY[1];
                    }

                    // Finally, rescale U and V coordinates into texture space
                    for (i = 0; i < 2; i++)
                    {
                        localV[i] += texbasey * nineSliceScaleY;
                        localV[i] /= tex.height * nineSliceScaleY;      // webgl specific
                    }

                    var currx;
                    for (currx = 0; currx < repsu; currx++)
                    {
                        var xpos = tempX[0] + (chunkwidth * currx);

                        // TODO: work all this out once for each column
                        // (or ideally, only for 1 normal column (or 2 in the case of mirrored sections) and any 'clipped column' (if necessary))
                        var localX = [];
                        var localU = [];

                        //var flipU = false;
                        if ((alltilemodes[index] == NINESLICE_TILE_MIRROR) && (currx & 1))
                        {
                            localX[0] = chunkwidth - chunkX[1];
                            localX[1] = chunkwidth - chunkX[0];

                            localU[0] = chunkU[1];
                            localU[1] = chunkU[0];

                            //flipU = true;
                        }
                        else
                        {
                            localX[0] = chunkX[0];
                            localX[1] = chunkX[1];

                            localU[0] = chunkU[0];
                            localU[1] = chunkU[1];
                        }

                        localX[0] += xpos;
                        localX[1] += xpos;

                        if (localX[1] > tempX[1])
                        {
                            // Clip
                            var distratio = (tempX[1] - localX[0]) / (localX[1] - localX[0]);
                            localU[1] = localU[0] + ((localU[1] - localU[0]) * distratio);
                            localX[1] = tempX[1];
                        }

                        // Finally, rescale U and V coordinates into texture space
                        for (i = 0; i < 2; i++)
                        {
                            localU[i] += texbasex * nineSliceScaleX;
                            localU[i] /= tex.width * nineSliceScaleX;       // webgl specific                            
                        }

                        // Transform our vertex coordinates
                        // TODO: share more of these calculations
                        var xcoord = [];
                        var ycoord = [];
                        xcoord[0] = xcoord[2] = (localX[0] * flipw);
                        xcoord[1] = xcoord[3] = (localX[1] * flipw);

                        ycoord[0] = ycoord[1] = (localY[0] * fliph);
                        ycoord[2] = ycoord[3] = (localY[1] * fliph);

                        // Define verts
                        var coordi = [
                                        0, 1, 2,
                                        2, 1, 3
                        ];

                        var uvi = [
                                    0, 0,
                                    1, 0,
                                    0, 1,

                                    0, 1,
                                    1, 0,
                                    1, 1
                        ];

                        if (flip_winding)
                        {
                            for (i = 5; i >= 0; i--)
                            {
                                this.cache.AddVert(xcoord[coordi[i]], ycoord[coordi[i]], localU[uvi[i * 2]], localV[uvi[i * 2 + 1]]);
                            }
                        }
                        else
                        {
                            for (i = 0; i < 6; i++)
                            {
                                this.cache.AddVert(xcoord[coordi[i]], ycoord[coordi[i]], localU[uvi[i * 2]], localV[uvi[i * 2 + 1]]);
                            }
                        }
                    }
                }

            }
        }
    }
};

yyNineSliceData.prototype.DrawFromCache = function (_x, _y, _rot, _colour, _alpha, _sprite, _zeroOrigin)
{
    if (!g_webGL)
        return;

    var TPE = _sprite.ppTPE[this.cache.frameindex];
    var tex = TPE.texture;

    if (!tex.complete) return;
    if (g_webGL)
        if (!tex.webgl_textureid)
            //WebGL_BindTexture({ texture: tex });
            WebGL_BindTexture(TPE);

    var i;

    _colour &= 0xffffff;
    var a = (_alpha * 255.0) << 24;
    var _col = a | _colour;

    var maxtrisinrun = DEFAULT_VB_SIZE / 3;     // not sure if this is actually the max we support but it's a reasonable value
    var trisremaining = (this.cache.verts.length / 2) / 3;

    var srcvert = this.cache.verts;
    var srcuv = this.cache.uvs;
    var vindex = 0;
    if (_rot == 0.0)
    {
        var offsetx = _x;
        var offsety = _y;

        if (!_zeroOrigin)
        {
            offsetx -= this.cache.transxorigin;
            offsety -= this.cache.transyorigin;
        }

        while (trisremaining > 0)
        {
            var trisinthisrun = (trisremaining < maxtrisinrun) ? trisremaining : maxtrisinrun;
            trisremaining -= trisinthisrun;

            var pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, trisinthisrun * 3);

            var stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
            var bindex = stride * pVerts.Current;
            pVerts.Current += trisinthisrun * 3;

            var pCoords = pVerts.Coords;
            var pColours = pVerts.Colours;
            var pUVs = pVerts.UVs;

            for (; trisinthisrun > 0; trisinthisrun--)
            {
                pCoords[bindex + 0] = srcvert[vindex] + offsetx; pCoords[bindex + 1] = srcvert[vindex + 1] + offsety; pCoords[bindex + 2] = GR_Depth;
                pColours[bindex] = _col;
                pUVs[bindex + 0] = srcuv[vindex]; pUVs[bindex + 1] = srcuv[vindex + 1];

                bindex += stride;
                vindex += 2;


                pCoords[bindex + 0] = srcvert[vindex] + offsetx; pCoords[bindex + 1] = srcvert[vindex + 1] + offsety; pCoords[bindex + 2] = GR_Depth;
                pColours[bindex] = _col;
                pUVs[bindex + 0] = srcuv[vindex]; pUVs[bindex + 1] = srcuv[vindex + 1];

                bindex += stride;
                vindex += 2;


                pCoords[bindex + 0] = srcvert[vindex] + offsetx; pCoords[bindex + 1] = srcvert[vindex + 1] + offsety; pCoords[bindex + 2] = GR_Depth;
                pColours[bindex] = _col;
                pUVs[bindex + 0] = srcuv[vindex]; pUVs[bindex + 1] = srcuv[vindex + 1];

                bindex += stride;
                vindex += 2;
            }
        }
    }
    else
    {
        var transmat = new Matrix();
        var tempmat = new Matrix();
        var mulmat = new Matrix();
        transmat.unit();
        tempmat.unit();

        if (_zeroOrigin)
        {
            transmat.SetZRotation(_rot);
        }
        else
        {
            transmat.SetTranslation(-this.cache.transxorigin, -this.cache.transyorigin, 0.0);
            tempmat.SetZRotation(_rot);
            mulmat.Multiply(transmat, tempmat);
            transmat = new Matrix(mulmat);
        }
        
        tempmat.unit();
        tempmat.SetTranslation(_x, _y, 0.0);
        mulmat.Multiply(transmat, tempmat);
        transmat = mulmat;          // copying by reference here        

        while (trisremaining > 0)
        {
            var trisinthisrun = (trisremaining < maxtrisinrun) ? trisremaining : maxtrisinrun;
            trisremaining -= trisinthisrun;

            var pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, trisinthisrun * 3);

            var stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
            var bindex = stride * pVerts.Current;
            pVerts.Current += trisinthisrun * 3;

            var pCoords = pVerts.Coords;
            var pColours = pVerts.Colours;
            var pUVs = pVerts.UVs;

            for (; trisinthisrun > 0; trisinthisrun--)
            {
                for (i = 0; i < 3; i++)
                {
                    var tempx = srcvert[vindex];
                    var tempy = srcvert[vindex + 1];
                    pCoords[bindex + 0] = (transmat.m[_11] * tempx) + (transmat.m[_21] * tempy) + transmat.m[_41];
                    pCoords[bindex + 1] = (transmat.m[_12] * tempx) + (transmat.m[_22] * tempy) + transmat.m[_42];
                    pCoords[bindex + 2] = GR_Depth;
                    pColours[bindex] = _col;
                    pUVs[bindex + 0] = srcuv[vindex];
                    pUVs[bindex + 1] = srcuv[vindex + 1];

                    bindex += stride;
                    vindex += 2;
                }
            }
        }
    }
};

yyNineSliceData.prototype.DrawComplex = function (_x, _y, _width, _height, _rot, _colour, _alpha, _ind, _sprite, _zeroOrigin)
{
    if (g_webGL)
    {
        var tilemodediff = false;

        for (var i = 0; i < NINESLICE_NUMSLICE; i++)
        {
            if (this.cache.tilemode[i] != this.tilemode[i])
            {
                tilemodediff = true;
                break;
            }
        }

        if ((this.cache.dirty) || (this.cache.width != _width) || (this.cache.height != _height) || (tilemodediff == true) || (this.cache.spriteindex != _sprite) || (this.cache.frameindex != _ind))
        {
            this.GenerateCacheData(_width, _height, _ind, _sprite);
        }
        this.DrawFromCache(_x, _y, _rot, _colour, _alpha, _sprite, _zeroOrigin);
        return;
    }

    // First work out common stuff
    // I.e. what are the dimensions of each segment

    var i;
    var U = [];
    var V = [];
    var XOffset = 0.0;
    var YOffset = 0.0;
    var CropWidth = _sprite.width;
    var CropHeight = _sprite.height;
    var texbasex = 0;
    var texbasey = 0;

    var TPE = _sprite.ppTPE[_ind];
    var tex = TPE.texture;

    if (!tex.complete) return;
    if (g_webGL)
        if (!tex.webgl_textureid)
            WebGL_BindTexture({ texture: tex });

    XOffset = TPE.XOffset;
    YOffset = TPE.YOffset;
    CropWidth = TPE.CropWidth;
    CropHeight = TPE.CropHeight;
    texbasex = TPE.x;
    texbasey = TPE.y;

    // Work out widths/heights and scaling factors
    var leftwidth = this.left;
    var midwidth = (_sprite.width - this.right) - this.left;
    var rightwidth = this.right;

    var topheight = this.top;
    var midheight = (_sprite.height - this.bottom) - this.top;
    var bottomheight = this.bottom;

    var neg_width = (_width < 0) ? 1 : 0; 
    var neg_height = (_height < 0) ? 1 : 0; 
    var flip_winding = (neg_width ^ neg_height) ? true : false; 
 
    var flipw = 1.0; 
    var fliph = 1.0; 
 
    if (neg_width) 
    { 
        _width = -_width; 
        if (g_webGL)
        {
            flipw = -1.0;
        }
    } 
 
    if (neg_height) 
    { 
        _height = -_height; 
        if (g_webGL)
        {
            fliph = -1.0;
        }
    }	 

    // Don't let the nineslice corners overlap
    /*if (_width < (leftwidth + rightwidth))
        _width = leftwidth + rightwidth;

    if (_height < (topheight + bottomheight))
        _height = topheight + bottomheight;*/

    var widthscale = (_width - leftwidth - rightwidth) / midwidth;
    var heightscale = (_height - topheight - bottomheight) / midheight;

    // Clip in the same way the IDE does 
    if (_width < leftwidth) 
    { 
        leftwidth = _width;		 
        rightwidth = 0.0; 
        widthscale = 0.0; 
    } 
    else if (_width < (leftwidth + rightwidth)) 
    {		 
        rightwidth = (_width - leftwidth); 
        widthscale = 0.0; 
    } 
 
    if (_height < topheight) 
    { 
        topheight = _height;		 
        bottomheight = 0.0; 
        heightscale = 0.0; 
    } 
    else if (_height < (topheight + bottomheight)) 
    {		 
        bottomheight = (_height - topheight); 
        heightscale = 0.0; 
    } 

    var X = [];
    var Y = [];

    X[0] = 0.0;
    X[1] = leftwidth;
    X[2] = X[1] + midwidth;
    X[3] = X[2] + rightwidth;

    Y[0] = 0.0;
    Y[1] = topheight;
    Y[2] = Y[1] + midheight;
    Y[3] = Y[2] + bottomheight;

    for (i = 0; i < 4; i++)
    {
        U[i] = X[i];
        V[i] = Y[i];
    }

    var xorigin = _sprite.xOrigin;
    var yorigin = _sprite.yOrigin;

    var transxorigin;
    var transyorigin;    

    /*if (this.xorigin < X[1])
        transxorigin = this.xorigin;
    else if (this.xorigin < X[2])
        transxorigin = X[1] + ((this.xorigin - X[1]) * widthscale);
    else
        transxorigin = (this.xorigin - X[2]) + ((X[2] - X[1]) * widthscale);

    if (this.yorigin < Y[1])
        transyorigin = this.yorigin;
    else if (this.yorigin < Y[2])
        transyorigin = Y[1] + ((this.yorigin - Y[1]) * heightscale);
    else
        transyorigin = (this.yorigin - Y[2]) + ((Y[2] - Y[1]) * heightscale);*/

    transxorigin = xorigin * (_width / _sprite.width);
    transyorigin = yorigin * (_height / _sprite.height);

    transxorigin *= flipw;
    transyorigin *= fliph;

    // Now shift the right and bottom-most coordinates to account for scaling
    var dist = X[3] - X[2];
    X[2] = X[1] + ((X[2] - X[1]) * widthscale);
    X[3] = X[2] + dist;

    dist = Y[3] - Y[2];
    Y[2] = Y[1] + ((Y[2] - Y[1]) * heightscale);
    Y[3] = Y[2] + dist;

    var alltilemodes = [];
    alltilemodes[0] = NINESLICE_TILE_STRETCH;           alltilemodes[1] = this.tilemode[NINESLICE_TOP];     alltilemodes[2] = NINESLICE_TILE_STRETCH;
    alltilemodes[3] = this.tilemode[NINESLICE_LEFT];    alltilemodes[4] = this.tilemode[NINESLICE_CENTRE];  alltilemodes[5] = this.tilemode[NINESLICE_RIGHT];
    alltilemodes[6] = NINESLICE_TILE_STRETCH;           alltilemodes[7] = this.tilemode[NINESLICE_BOTTOM];  alltilemodes[8] = NINESLICE_TILE_STRETCH;

    // Work out transformations for rotation\translation
    var transmat = undefined;

    if ((_rot != 0.0) || (!g_webGL && (neg_width || neg_height)))
    {
        transmat = new Matrix();
        var tempmat = new Matrix();
        var mulmat = new Matrix();
        transmat.unit();
        tempmat.unit();

        transmat.SetTranslation(-transxorigin, -transyorigin, 0.0);
        tempmat.SetZRotation(_rot);
        mulmat.Multiply(transmat, tempmat);
        transmat = new Matrix(mulmat);
        tempmat.unit();
        tempmat.SetTranslation(_x, _y, 0.0);
        mulmat.Multiply(transmat, tempmat);
        if (g_webGL || (!neg_width && !neg_height))
            transmat = mulmat;          // copying by reference here            
        else
        {
            tempmat.SetScale(neg_width ? -1.0 : 1.0, neg_height ? -1.0 : 1.0, 1.0);
            transmat.Multiply(tempmat, mulmat);
        }
    }
    else
    {
        transmat = new Matrix();
        transmat.SetTranslation(-transxorigin + _x, -transyorigin + _y, 0.0);
    }

    _colour &= 0xffffff;
    var a = (_alpha * 255.0) << 24;
    var _col = a | _colour;

    var cached_image = undefined;
    if (!g_webGL)
    {
        Graphics_PushMatrix(transmat);

        graphics.globalAlpha = _alpha;

        if (_colour != g_CacheWhite)
        {
            cached_image = Graphics_CacheBlock(TPE, _colour);
        }
    }

    // Now draw sections
    // Lots of duplicated work here but trying to share calculations may turn the code into spaghetti
    var x, y;
    var tempX = [];
    var tempY = [];
    var tempU = [];
    var tempV = [];
    for (y = 0; y < 3; y++)
    {
        for (x = 0; x < 3; x++)
        {
            var index = (y * 3) + x;
            if (alltilemodes[index] == NINESLICE_TILE_HIDE)
                continue;

            tempX[0] = X[x];
            tempX[1] = X[x + 1];

            tempY[0] = Y[y];
            tempY[1] = Y[y + 1];

            tempU[0] = U[x];
            tempU[1] = U[x + 1];

            tempV[0] = V[y];
            tempV[1] = V[y + 1];

            if (tempU[1] <= tempU[0])
                continue;

            if (tempV[1] <= tempV[0])
                continue;

            // Compensate for cropping
            if (XOffset > tempU[1])
                continue;		// section culled

            if (YOffset > tempV[1])
                continue;		// section culled

            if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
            {
                // Simple(ish) case
                // As always, need to account for cropping					
                if (XOffset > tempU[0])
                {
                    var distratio = (XOffset - tempU[0]) / (tempU[1] - tempU[0]);
                    tempX[0] = tempX[0] + ((tempX[1] - tempX[0]) * distratio);
                    if (tempX[0] >= tempX[1])
                        continue;

                    tempU[0] = XOffset;
                }

                if (YOffset > tempV[0])
                {
                    var dist = YOffset - tempV[0];
                    var distratio = (YOffset - tempV[0]) / (tempV[1] - tempV[0]);
                    tempY[0] = tempY[0] + ((tempY[1] - tempY[0]) * distratio);
                    if (tempY[0] >= tempY[1])
                        continue;

                    tempV[0] = YOffset;
                }

                tempU[0] -= XOffset;
                tempU[1] -= XOffset;

                tempV[0] -= YOffset;
                tempV[1] -= YOffset;

                if (tempU[0] > CropWidth)
                    continue;	// section culled

                if (tempV[0] > CropHeight)
                    continue;	// section culled

                if (tempU[1] > CropWidth)
                {
                    var distratio = (CropWidth - tempU[0]) / (tempU[1] - tempU[0]);
                    tempX[1] = tempX[0] + ((tempX[1] - tempX[0]) * distratio);
                    if (tempX[0] >= tempX[1])
                        continue;

                    tempU[1] = CropWidth;
                }

                if (tempV[1] > CropHeight)
                {
                    var distratio = (CropHeight - tempV[0]) / (tempV[1] - tempV[0]);
                    tempY[1] = tempY[0] + ((tempY[1] - tempY[0]) * distratio);
                    if (tempY[0] >= tempY[1])
                        continue;

                    tempV[1] = CropHeight;
                }

                // Rescale U and V coordinates into texture space
                for (i = 0; i < 2; i++)
                {
                    tempU[i] += texbasex;
                    tempV[i] += texbasey;

                    // Now done in webGL specific section
                    //tempU[i] /= tex.width;
                    //tempV[i] /= tex.height;
                }

                // Transform our vertex coordinates
                var xcoord = [];
                var ycoord = [];
                xcoord[0] = xcoord[2] = (tempX[0] * flipw);
                xcoord[1] = xcoord[3] = (tempX[1] * flipw);

                ycoord[0] = ycoord[1] = (tempY[0] * fliph);
                ycoord[2] = ycoord[3] = (tempY[1] * fliph);

                if (g_webGL)
                {
                    for (i = 0; i < 4; i++)
                    {
                        // Rescale texture coordinates into texture space
                        tempU[i] /= tex.width;
                        tempV[i] /= tex.height;
                    }

                    // Transform the coordinates by our matrix
                    for (i = 0; i < 4; i++)
                    {
                        var tempx, tempy;

                        tempx = (transmat.m[_11] * xcoord[i]) + (transmat.m[_21] * ycoord[i]) + transmat.m[_41];
                        tempy = (transmat.m[_12] * xcoord[i]) + (transmat.m[_22] * ycoord[i]) + transmat.m[_42];

                        xcoord[i] = tempx;
                        ycoord[i] = tempy;
                    }

                    // Now draw
                    var pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6);

                    var stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
                    var bindex = stride * pVerts.Current;
                    pVerts.Current += 6;

                    var pCoords = pVerts.Coords;
                    var pColours = pVerts.Colours;
                    var pUVs = pVerts.UVs;

                    // Define verts
                    var coordi = [
                                    0, 1, 2,
                                    2, 1, 3
                    ];

                    var uvi = [
                                0, 0,
                                1, 0,
                                0, 1,

                                0, 1,
                                1, 0,
                                1, 1
                    ];

                    if (flip_winding)
                    {
                        for (i = 5; i >= 0; i--)
                        {
                            pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                            pColours[bindex] = _col;
                            pUVs[bindex + 0] = tempU[uvi[i * 2]]; pUVs[bindex + 1] = tempV[uvi[i * 2 + 1]];

                            bindex += stride;
                        }
                    }
                    else
                    {
                        for (i = 0; i < 6; i++)
                        {
                            pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                            pColours[bindex] = _col;
                            pUVs[bindex + 0] = tempU[uvi[i * 2]]; pUVs[bindex + 1] = tempV[uvi[i * 2 + 1]];

                            bindex += stride;
                        }
                    }
                }
                else
                {
                    if (cached_image != undefined)
                    {
                        graphics._drawImage(cached_image, tempU[0] - texbasex, tempV[0] - texbasey, tempU[1] - tempU[0], tempV[1] - tempV[0], xcoord[0], ycoord[0], xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                    }
                    else
                    {
                        graphics._drawImage(tex, tempU[0], tempV[0], tempU[1] - tempU[0], tempV[1] - tempV[0], xcoord[0], ycoord[0], xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                    }
                }
            }
            else
            {
                // Work out number of repeats in U and V
                var repsu = 1;
                var repsv = 1;

                if ((alltilemodes[index] == NINESLICE_TILE_REPEAT) || (alltilemodes[index] == NINESLICE_TILE_MIRROR))
                    repsu = Math.ceil((tempX[1] - tempX[0]) / (tempU[1] - tempU[0]));

                if ((alltilemodes[index] == NINESLICE_TILE_REPEAT) || (alltilemodes[index] == NINESLICE_TILE_MIRROR))
                    repsv = Math.ceil((tempY[1] - tempY[0]) / (tempV[1] - tempV[0]));

                var chunkwidth, chunkheight;

                if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
                    chunkwidth = tempX[1] - tempX[0];
                else
                    chunkwidth = tempU[1] - tempU[0];

                if (alltilemodes[index] == NINESLICE_TILE_STRETCH)
                    chunkheight = tempY[1] - tempY[0];
                else
                    chunkheight = tempV[1] - tempV[0];

                var chunkX = [];
                var chunkY = [];
                var chunkU = [];
                var chunkV = [];

                chunkX[0] = 0.0;
                chunkX[1] = chunkwidth;

                chunkY[0] = 0.0;
                chunkY[1] = chunkheight;

                chunkU[0] = tempU[0];
                chunkU[1] = tempU[1];

                chunkV[0] = tempV[0];
                chunkV[1] = tempV[1];

                // Handle chunk cropping based on source image
                if (XOffset > chunkU[0])
                {
                    var distratio = (XOffset - chunkU[0]) / (chunkU[1] - chunkU[0]);
                    chunkX[0] = chunkX[0] + ((chunkX[1] - chunkX[0]) * distratio);
                    if (chunkX[0] >= chunkX[1])
                        continue;		// section culled	

                    chunkU[0] = XOffset;
                }

                if (YOffset > chunkV[0])
                {
                    var distratio = (YOffset - chunkV[0]) / (chunkV[1] - chunkV[0]);
                    chunkY[0] = chunkY[0] + ((chunkY[1] - chunkY[0]) * distratio);
                    if (chunkY[0] >= chunkY[1])
                        continue;		// section culled			

                    chunkV[0] = YOffset;
                }

                chunkU[0] -= XOffset;
                chunkU[1] -= XOffset;

                chunkV[0] -= YOffset;
                chunkV[1] -= YOffset;

                if (chunkU[0] > CropWidth)
                    continue;	// section culled

                if (chunkV[0] > CropHeight)
                    continue;	// section culled

                if (chunkU[1] > CropWidth)
                {
                    var distratio = (CropWidth - chunkU[0]) / (chunkU[1] - chunkU[0]);
                    chunkX[1] = chunkX[0] + ((chunkX[1] - chunkX[0]) * distratio);
                    if (chunkX[0] >= chunkX[1])
                        continue;

                    chunkU[1] = CropWidth;
                }

                if (chunkV[1] > CropHeight)
                {
                    var distratio = (CropHeight - chunkV[0]) / (chunkV[1] - chunkV[0]);
                    chunkY[1] = chunkY[0] + ((chunkY[1] - chunkY[0]) * distratio);
                    if (chunkY[0] >= chunkY[1])
                        continue;

                    chunkV[1] = CropHeight;
                }

                // Okay, now we have our cropped chunk data (yay)
                // TODO: precalculate this for non-stretched sections
                // Now tile/mirror these chunks across the specified area

                var curry;
                for (curry = 0; curry < repsv; curry++)
                {
                    var ypos = tempY[0] + (chunkheight * curry);

                    var localY = [];
                    var localV = [];

                    var flipV = false;
                    if ((alltilemodes[index] == NINESLICE_TILE_MIRROR) && (curry & 1))
                    {
                        localY[0] = chunkheight - chunkY[1];
                        localY[1] = chunkheight - chunkY[0];

                        localV[0] = chunkV[1];
                        localV[1] = chunkV[0];

                        flipV = true;
                    }
                    else
                    {
                        localY[0] = chunkY[0];
                        localY[1] = chunkY[1];

                        localV[0] = chunkV[0];
                        localV[1] = chunkV[1];
                    }

                    localY[0] += ypos;
                    localY[1] += ypos;

                    if (localY[1] > tempY[1])
                    {
                        // Clip
                        var distratio = (tempY[1] - localY[0]) / (localY[1] - localY[0]);
                        localV[1] = localV[0] + ((localV[1] - localV[0]) * distratio);
                        localY[1] = tempY[1];
                    }

                    // Finally, rescale U and V coordinates into texture space
                    for (i = 0; i < 2; i++)
                    {
                        localV[i] += texbasey;
                        if (g_webGL)
                        {
                            localV[i] /= tex.height;      // webgl specific
                        }
                    }

                    var currx;
                    for (currx = 0; currx < repsu; currx++)
                    {
                        var xpos = tempX[0] + (chunkwidth * currx);

                        // TODO: work all this out once for each column
                        // (or ideally, only for 1 normal column (or 2 in the case of mirrored sections) and any 'clipped column' (if necessary))
                        var localX = [];
                        var localU = [];

                        var flipU = false;
                        if ((alltilemodes[index] == NINESLICE_TILE_MIRROR) && (currx & 1))
                        {
                            localX[0] = chunkwidth - chunkX[1];
                            localX[1] = chunkwidth - chunkX[0];

                            localU[0] = chunkU[1];
                            localU[1] = chunkU[0];

                            flipU = true;
                        }
                        else
                        {
                            localX[0] = chunkX[0];
                            localX[1] = chunkX[1];

                            localU[0] = chunkU[0];
                            localU[1] = chunkU[1];
                        }

                        localX[0] += xpos;
                        localX[1] += xpos;

                        if (localX[1] > tempX[1])
                        {
                            // Clip
                            var distratio = (tempX[1] - localX[0]) / (localX[1] - localX[0]);
                            localU[1] = localU[0] + ((localU[1] - localU[0]) * distratio);
                            localX[1] = tempX[1];
                        }

                        // Finally, rescale U and V coordinates into texture space
                        for (i = 0; i < 2; i++)
                        {
                            localU[i] += texbasex;
                            if (g_webGL)
                            {
                                localU[i] /= tex.width;       // webgl specific
                            }
                        }

                        // Transform our vertex coordinates
                        // TODO: share more of these calculations
                        var xcoord = [];
                        var ycoord = [];
                        xcoord[0] = xcoord[2] = (localX[0] * flipw);
                        xcoord[1] = xcoord[3] = (localX[1] * flipw);

                        ycoord[0] = ycoord[1] = (localY[0] * fliph);
                        ycoord[2] = ycoord[3] = (localY[1] * fliph);

                        if (g_webGL)
                        {
                            // Transform the coordinates by our matrix
                            for (i = 0; i < 4; i++)
                            {
                                var tempx, tempy;

                                tempx = (transmat.m[_11] * xcoord[i]) + (transmat.m[_21] * ycoord[i]) + transmat.m[_41];
                                tempy = (transmat.m[_12] * xcoord[i]) + (transmat.m[_22] * ycoord[i]) + transmat.m[_42];

                                xcoord[i] = tempx;
                                ycoord[i] = tempy;
                            }

                            // Now draw
                            var pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 6);

                            var stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
                            var bindex = stride * pVerts.Current;
                            pVerts.Current += 6;

                            var pCoords = pVerts.Coords;
                            var pColours = pVerts.Colours;
                            var pUVs = pVerts.UVs;

                            // Define verts
                            var coordi = [
                                            0, 1, 2,
                                            2, 1, 3
                            ];

                            var uvi = [
                                        0, 0,
                                        1, 0,
                                        0, 1,

                                        0, 1,
                                        1, 0,
                                        1, 1
                            ];

                            if (flip_winding)
                            {
                                for (i = 5; i >= 0; i--)
                                {
                                    pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                                    pColours[bindex] = _col;
                                    pUVs[bindex + 0] = localU[uvi[i * 2]]; pUVs[bindex + 1] = localV[uvi[i * 2 + 1]];

                                    bindex += stride;
                                }
                            }
                            else
                            {
                                for (i = 0; i < 6; i++)
                                {
                                    pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                                    pColours[bindex] = _col;
                                    pUVs[bindex + 0] = localU[uvi[i * 2]]; pUVs[bindex + 1] = localV[uvi[i * 2 + 1]];

                                    bindex += stride;
                                }
                            }
                        }
                        else
                        {

                            if (flipU || flipV)
                            {
                                // sigh                                
                                graphics._transform(flipU ? -1.0 : 1.0, 0.0, 0.0, flipV ? -1.0 : 1.0, flipU ? xcoord[1] : xcoord[0], flipV ? ycoord[2] : ycoord[0]);

                                if (cached_image != undefined)
                                {
                                    graphics._drawImage(cached_image, localU[0] - texbasex, localV[0] - texbasey, localU[1] - localU[0], localV[1] - localV[0], 0.0, 0.0, xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                                }
                                else
                                {
                                    graphics._drawImage(tex, localU[0], localV[0], localU[1] - localU[0], localV[1] - localV[0], 0.0, 0.0, xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                                }

                                Graphics_SetTransform();
                                Graphics_PushMatrix(transmat);
                            }
                            else
                            {
                                if (cached_image != undefined)
                                {
                                    graphics._drawImage(cached_image, localU[0] - texbasex, localV[0] - texbasey, localU[1] - localU[0], localV[1] - localV[0], xcoord[0], ycoord[0], xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                                }
                                else
                                {
                                    graphics._drawImage(tex, localU[0], localV[0], localU[1] - localU[0], localV[1] - localV[0], xcoord[0], ycoord[0], xcoord[1] - xcoord[0], ycoord[2] - ycoord[0]);
                                }
                            }
                        }
                    }
                }

            }
        }
    }

    if (!g_webGL)
    {
        Graphics_SetTransform();
    }
};

yyNineSliceData.prototype.Draw = function (_x, _y, _width, _height, _rot, _colour, _alpha, _ind, _sprite, _zeroOrigin)
{
    if (_zeroOrigin == undefined)
        _zeroOrigin = false;

    var pSpr = _sprite;
    if (pSpr != null)
    {
        if (pSpr.numb <= 0) return;
        _ind = (~ ~_ind) % pSpr.numb;
        if (_ind < 0) _ind = _ind + pSpr.numb;

        _colour = ConvertGMColour(_colour);

        // Check to see if this nine-slice uses any tiling\mirroring\hiding of sections
        var i;
        var displayflags = 0;
        var anyinvisible = false;
        for (i = 0; i < NINESLICE_NUMSLICE; i++)
        {
            displayflags |= this.tilemode[i];            
            /*if (this.sliceVisible[i] == false)
            {
                anyinvisible = true;
                break;
            }*/
        }

        if (/*(anyinvisible) || */(displayflags != NINESLICE_TILE_STRETCH))
        {
            this.DrawComplex(_x, _y, _width, _height, _rot, _colour, _alpha, _ind, pSpr, _zeroOrigin);
            return;
        }

        var U = [];
        var V = [];
        var XOffset = 0.0;
        var YOffset = 0.0;
        var CropWidth = pSpr.width;
        var CropHeight = pSpr.height;
        var texbasex = 0;
        var texbasey = 0;

        var TPE = pSpr.ppTPE[_ind];
        var tex = TPE.texture;

        if (!tex.complete) return;
        if (g_webGL)
            if (!tex.webgl_textureid)
                //WebGL_BindTexture({ texture: tex });
                WebGL_BindTexture(TPE);

        XOffset = TPE.XOffset;
        YOffset = TPE.YOffset;
        CropWidth = TPE.CropWidth;
        CropHeight = TPE.CropHeight;
        texbasex = TPE.x;
        texbasey = TPE.y;

        var nineSliceScaleX = CropWidth / TPE.w;
        var nineSliceScaleY = CropHeight / TPE.h;

        // Work out widths/heights and scaling factors
        var leftwidth = this.left;
        var midwidth = (pSpr.width - this.right) - this.left;
        var rightwidth = this.right;

        var topheight = this.top;
        var midheight = (pSpr.height - this.bottom) - this.top;
        var bottomheight = this.bottom;

        var neg_width = (_width < 0) ? 1 : 0; 
        var neg_height = (_height < 0) ? 1 : 0; 
        var flip_winding = (neg_width ^ neg_height) ? true : false; 
 
        var flipw = 1.0; 
        var fliph = 1.0; 
 
        if (neg_width) 
        { 
            _width = -_width;

            if (g_webGL)
            {
                flipw = -1.0;
            }
        } 
 
        if (neg_height) 
        { 
            _height = -_height;

            if (g_webGL)
            {
                fliph = -1.0;
            }
        } 

        // Don't let the nineslice corners overlap
        /*if (_width < (leftwidth + rightwidth))
            _width = leftwidth + rightwidth;

        if (_height < (topheight + bottomheight))
            _height = topheight + bottomheight;*/

        var widthscale = (_width - leftwidth - rightwidth) / midwidth;
        var heightscale = (_height - topheight - bottomheight) / midheight;

        // Clip in the same way the IDE does 
        if (_width < leftwidth) 
        { 
            leftwidth = _width; 
            rightwidth = 0.0; 
            widthscale = 0.0; 
        } 
        else if (_width < (leftwidth + rightwidth)) 
        { 
            rightwidth = (_width - leftwidth); 
            widthscale = 0.0; 
        } 
 
        if (_height < topheight) 
        { 
            topheight = _height; 
            bottomheight = 0.0; 
            heightscale = 0.0; 
        } 
        else if (_height < (topheight + bottomheight)) 
        { 
            bottomheight = (_height - topheight); 
            heightscale = 0.0; 
        } 

        var X = [];
        var Y = [];

        X[0] = 0.0;
        X[1] = leftwidth;
        X[2] = X[1] + midwidth;
        X[3] = X[2] + rightwidth;

        Y[0] = 0.0;
        Y[1] = topheight;
        Y[2] = Y[1] + midheight;
        Y[3] = Y[2] + bottomheight;

        var transxorigin;
        var transyorigin;

        var xorigin;
        var yorigin;

        if (_zeroOrigin)
        {
            xorigin = 0;
            yorigin = 0;
        }
        else
        {
            xorigin = pSpr.xOrigin;
            yorigin = pSpr.yOrigin;
        }

        /*if (this.xorigin < X[1])
            transxorigin = this.xorigin;
        else if (this.xorigin < X[2])
            transxorigin = X[1] + ((this.xorigin - X[1]) * widthscale);
        else
            transxorigin = (this.xorigin - X[2]) + ((X[2] - X[1]) * widthscale);

        if (this.yorigin < Y[1])
            transyorigin = this.yorigin;
        else if (this.yorigin < Y[2])
            transyorigin = Y[1] + ((this.yorigin - Y[1]) * heightscale);
        else
            transyorigin = (this.yorigin - Y[2]) + ((Y[2] - Y[1]) * heightscale);*/

        transxorigin = xorigin * (_width / pSpr.width);
        transyorigin = yorigin * (_height / pSpr.height);

        transxorigin *= flipw;
        transyorigin *= fliph;

        if (XOffset > 0)
        {
            // Need to clamp the X coords            
            for (i = 0; i < 4; i++)
            {
                if (X[i] < XOffset)
                {
                    X[i] = XOffset;
                }
            }
        }

        if (YOffset > 0)
        {
            // Need to clamp the Y coords            
            for (i = 0; i < 4; i++)
            {
                if (Y[i] < YOffset)
                {
                    Y[i] = YOffset;
                }
            }
        }

        if (pSpr.width > (XOffset + CropWidth))
        {
            // Need to clamp the X coords
            var clampval = XOffset + CropWidth;

            for (i = 0; i < 4; i++)
            {
                if (X[i] > clampval)
                {
                    X[i] = clampval;
                }
            }
        }

        if (pSpr.height > (YOffset + CropHeight))
        {
            // Need to clamp the Y coords
            var clampval = YOffset + CropHeight;

            for (i = 0; i < 4; i++)
            {
                if (Y[i] > clampval)
                {
                    Y[i] = clampval;
                }
            }
        }

        for (i = 0; i < 4; i++)
        {
            U[i] = X[i] - XOffset;
            V[i] = Y[i] - YOffset;

            U[i] += texbasex * nineSliceScaleX;
            V[i] += texbasey * nineSliceScaleY;

            // Now done in webGL specific section
            //U[i] /= tex.width;
            //V[i] /= tex.height;
        }

        // Now shift the right and bottom-most coordinates to account for scaling
        var dist = X[3] - X[2];
        X[2] = X[1] + ((X[2] - X[1]) * widthscale);
        X[3] = X[2] + dist;

        dist = Y[3] - Y[2];
        Y[2] = Y[1] + ((Y[2] - Y[1]) * heightscale);
        Y[3] = Y[2] + dist;

        // TEMP!!
        /*for (i = 0; i < 4; i++)
        {
            X[i] += _x;
            Y[i] += _y;
        }*/
        // end of TEMP!!

        // Generate coord list (so we can translate\rotate)
        var xcoord = [];
        var ycoord = [];
        xcoord[0] = xcoord[4] = xcoord[8] = xcoord[12] = (X[0] * flipw);
        xcoord[1] = xcoord[5] = xcoord[9] = xcoord[13] = (X[1] * flipw);
        xcoord[2] = xcoord[6] = xcoord[10] = xcoord[14] = (X[2] * flipw);
        xcoord[3] = xcoord[7] = xcoord[11] = xcoord[15] = (X[3] * flipw);

        ycoord[0] = ycoord[1] = ycoord[2] = ycoord[3] = (Y[0] * fliph);
        ycoord[4] = ycoord[5] = ycoord[6] = ycoord[7] = (Y[1] * fliph);
        ycoord[8] = ycoord[9] = ycoord[10] = ycoord[11] = (Y[2] * fliph);
        ycoord[12] = ycoord[13] = ycoord[14] = ycoord[15] = (Y[3] * fliph);

        var transmat = undefined;

        if ((_rot != 0.0) || (!g_webGL && (neg_width || neg_height)))
        {
            transmat = new Matrix();
            var tempmat = new Matrix();
            var mulmat = new Matrix();
            transmat.unit();
            tempmat.unit();

            transmat.SetTranslation(-transxorigin, -transyorigin, 0.0);
            tempmat.SetZRotation(_rot);
            mulmat.Multiply(transmat, tempmat);
            transmat = new Matrix(mulmat);
            tempmat.unit();
            tempmat.SetTranslation(_x, _y, 0.0);
            mulmat.Multiply(transmat, tempmat);

            if (g_webGL || (!neg_width && !neg_height))
                transmat = mulmat;          // copying by reference here            
            else
            {                
                tempmat.SetScale(neg_width ? -1.0 : 1.0, neg_height ? -1.0 : 1.0, 1.0);
                transmat.Multiply(tempmat, mulmat);
            }
        }
        else
        {
            // Transform the coordinates by our 'matrix'
            var offsetx = -transxorigin + _x;
            var offsety = -transyorigin + _y;

            for (i = 0; i < 16; i++)
            {
                var tempx, tempy;

                tempx = xcoord[i] + offsetx;
                tempy = ycoord[i] + offsety;

                xcoord[i] = tempx;
                ycoord[i] = tempy;
            }
        }

        if (g_webGL)
        {
            for (i = 0; i < 4; i++)
            {
                // Rescale texture coordinates into texture space
                U[i] /= tex.width * nineSliceScaleX;
                V[i] /= tex.height * nineSliceScaleY;
            }

            if (_rot != 0.0)
            {
                // Transform the coordinates by our matrix
                for (i = 0; i < 16; i++)
                {
                    var tempx, tempy;

                    tempx = (transmat.m[_11] * xcoord[i]) + (transmat.m[_21] * ycoord[i]) + transmat.m[_41];
                    tempy = (transmat.m[_12] * xcoord[i]) + (transmat.m[_22] * ycoord[i]) + transmat.m[_42];

                    xcoord[i] = tempx;
                    ycoord[i] = tempy;
                }
            }

            var pVerts = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, 54);

            var stride = pVerts.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
            var bindex = stride * pVerts.Current;
            pVerts.Current += 54;

            var pCoords = pVerts.Coords;
            var pColours = pVerts.Colours;
            var pUVs = pVerts.UVs;

            var a = (_alpha * 255.0) << 24;
            var _col = a | (_colour & 0xffffff);

            var coordi = [  // Top left
                            0, 1, 4,
                            4, 1, 5,

                            // Top middle
                            1, 2, 5,
                            5, 2, 6,

                            // Top right
                            2, 3, 6,
                            6, 3, 7,

                            // Middle left
                            4, 5, 8,
                            8, 5, 9,

                            // Middle
                            5, 6, 9,
                            9, 6, 10,

                            // Middle right
                            6, 7, 10,
                            10, 7, 11,

                            // Bottom left
                            8, 9, 12,
                            12, 9, 13,

                            // Bottom middle
                            9, 10, 13,
                            13, 10, 14,

                            // Bottom right
                            10, 11, 14,
                            14, 11, 15
            ];

            var uvi = [ // Top left
                        0, 0,
                        1, 0,
                        0, 1,

                        0, 1,
                        1, 0,
                        1, 1,

                        // Top middle
                        1, 0,
                        2, 0,
                        1, 1,

                        1, 1,
                        2, 0,
                        2, 1,

                        // Top right
                        2, 0,
                        3, 0,
                        2, 1,

                        2, 1,
                        3, 0,
                        3, 1,

                        // Middle left
                        0, 1,
                        1, 1,
                        0, 2,

                        0, 2,
                        1, 1,
                        1, 2,

                        // Middle
                        1, 1,
                        2, 1,
                        1, 2,

                        1, 2,
                        2, 1,
                        2, 2,

                        // Middle right
                        2, 1,
                        3, 1,
                        2, 2,

                        2, 2,
                        3, 1,
                        3, 2,

                        // Bottom left
                        0, 2,
                        1, 2,
                        0, 3,

                        0, 3,
                        1, 2,
                        1, 3,

                        // Bottom middle
                        1, 2,
                        2, 2,
                        1, 3,

                        1, 3,
                        2, 2,
                        2, 3,

                        // Bottom right
                        2, 2,
                        3, 2,
                        2, 3,

                        2, 3,
                        3, 2,
                        3, 3,
            ];

            if (flip_winding)
            {
                for (i = 53; i >= 0; i--)
                {
                    pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                    pColours[bindex] = _col;
                    pUVs[bindex + 0] = U[uvi[i * 2]]; pUVs[bindex + 1] = V[uvi[i * 2 + 1]];

                    bindex += stride;
                }
            }
            else
            {
                for (i = 0; i < 54; i++)
                {
                    pCoords[bindex + 0] = xcoord[coordi[i]]; pCoords[bindex + 1] = ycoord[coordi[i]]; pCoords[bindex + 2] = GR_Depth;
                    pColours[bindex] = _col;
                    pUVs[bindex + 0] = U[uvi[i * 2]]; pUVs[bindex + 1] = V[uvi[i * 2 + 1]];

                    bindex += stride;
                }
            }
        }
        else
        {
            graphics.globalAlpha = _alpha;

            if (_colour != g_CacheWhite)
            {
                var cached_image = Graphics_CacheBlock(TPE, _colour);
                if (transmat != undefined)
                {
                    Graphics_PushMatrix(transmat);
                }                

                var xseg, yseg;
                for (yseg = 0; yseg < 3; yseg++)
                {
                    for (xseg = 0; xseg < 3; xseg++)
                    {
                        graphics._drawImage(cached_image, U[xseg] - texbasex, V[yseg] - texbasey, U[xseg + 1] - U[xseg], V[yseg + 1] - V[yseg], xcoord[xseg], ycoord[yseg * 4], xcoord[xseg + 1] - xcoord[xseg], ycoord[yseg * 4 + 4] - ycoord[yseg * 4]);
                    }
                }

                if (transmat != undefined)
                {
                    Graphics_SetTransform();
                }
            }
            else
            {
                if (transmat != undefined)
                {
                    Graphics_PushMatrix(transmat);                                                     
                }                
                
                var xseg, yseg;
                for (yseg = 0; yseg < 3; yseg++)
                {
                    for (xseg = 0; xseg < 3; xseg++)
                    {
                        graphics._drawImage(tex, U[xseg], V[yseg], U[xseg + 1] - U[xseg], V[yseg + 1] - V[yseg], xcoord[xseg], ycoord[yseg * 4], xcoord[xseg + 1] - xcoord[xseg], ycoord[yseg * 4 + 4] - ycoord[yseg * 4]);
                    }
                }                

                if (transmat != undefined)
                {
                    Graphics_SetTransform();
                }
            }
        }
    }
};