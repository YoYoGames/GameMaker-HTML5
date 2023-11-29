// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yySWFTimeline.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// @if feature("swf")
// convert from twips to pixels (each twip is 20 pixels)
var g_SWF_twipscale = 1.0 / 20.0;

// #############################################################################################
/// Function:<summary>
///             Parse shape data for this shape
///          </summary>
// #############################################################################################
/** @constructor */
function yySWFTimeline() {

    this.FrameRate = 0;
    this.numFrames = 0;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.collisionMaskHeader = null;        
};


// #############################################################################################
/// Function:<summary>
///             Parse shape data for this shape
///          </summary>
// #############################################################################################
yySWFTimeline.prototype.BuildTimelineData = function (_dataView, _byteOffset, _littleEndian) {

    this.FrameRate = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	this.numFrames = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	this.minX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
	_byteOffset+=4;
	this.maxX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
	_byteOffset+=4;
	this.minY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
	_byteOffset+=4;
	this.maxY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
	_byteOffset+=4;
    
    // Read out collision masks header
	var numCollisionMasks, maskWidth, maskHeight;	
	numCollisionMasks = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	maskWidth = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	maskHeight = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	this.collisionMaskHeader = {
	    numCollisionMasks: numCollisionMasks,
	    maskWidth: maskWidth,
	    maskHeight: maskHeight
	};

    // Read out the frames
    this.Frames = [];
	for (var i = 0; i < this.numFrames; i++)
	{		
	    var pFrame = {};
	    this.Frames.push(pFrame);
	    
		pFrame.numObjects = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pFrame.minX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
		_byteOffset+=4;
		pFrame.maxX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
		_byteOffset+=4;
		pFrame.minY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
		_byteOffset+=4;
		pFrame.maxY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
		_byteOffset+=4;

        pFrame.Objects = [];
		for (var j = 0; j < pFrame.numObjects; j++)
		{
		    var pObject = {};
		    pFrame.Objects.push(pObject);
		    
			pObject.ID = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;

			pObject.index = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;

			pObject.depth = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;

			pObject.clipDepth = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;

			// The format is RGBA in the file - will need to rearrange
			var colmul = [];			
			for (var k = 0; k < 4; k++)
			{
				colmul[k] = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset+=4;
			}

            var coladd = [];
			for (var k = 0; k < 4; k++)
			{
				coladd[k] = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset+=4;
			}
		
			// WIN_CLASSIC format is BGRA, rather than RGBA
			pObject.colTransMul = [];
			pObject.colTransAdd = [];
			pObject.colTransAddZeroAlpha = [];
			
			pObject.colTransMul[0] = colmul[2];
			pObject.colTransAdd[0] = coladd[2];
			pObject.colTransAddZeroAlpha[0] = 0;

			pObject.colTransMul[1] = colmul[1];
			pObject.colTransAdd[1] = coladd[1];
			pObject.colTransAddZeroAlpha[1] = coladd[1];
                   
			pObject.colTransMul[2] = colmul[0];
			pObject.colTransAdd[2] = coladd[0];
			pObject.colTransAddZeroAlpha[2] = coladd[0];

			pObject.colTransMul[3] = colmul[3];
			pObject.colTransAdd[3] = coladd[3];
			pObject.colTransAddZeroAlpha[3] = coladd[3];

			pObject.minX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
			_byteOffset+=4;
			pObject.maxX = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
			_byteOffset+=4;
			pObject.minY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
			_byteOffset+=4;
			pObject.maxY = _dataView.getFloat32(_byteOffset, _littleEndian) * g_SWF_twipscale;
			_byteOffset+=4;

			var transMat = [];
			for (var k = 0; k < 9; k++)
			{
				transMat[k] = _dataView.getFloat32(_byteOffset, _littleEndian);
				_byteOffset+=4;
			}

			// Convert 3x3 to 4x4 matrix
			pObject.transMat = new Matrix();			
			pObject.transMat.m[_11] = transMat[0];
			pObject.transMat.m[_21] = transMat[1];
			pObject.transMat.m[_41] = transMat[2];

			pObject.transMat.m[_12] = transMat[3];
			pObject.transMat.m[_22] = transMat[4];
			pObject.transMat.m[_42] = transMat[5];
		}
	}
	return _byteOffset;
};
// @endif