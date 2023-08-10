// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yySprite.js
// Created:         19/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 19/02/2011		
// 
// **********************************************************************************************************************

var ePlaybackSpeedType_FramesPerSecond = 0,
	ePlaybackSpeedType_FramesPerGameFrame = 1,
    ePlaybackSpeedType_Max = 2;

var SKELETON_FRAMECOUNT = 2147483647;

/**
 * Type of collision check used for this sprite.
 * Keep in sync with GMSprite::CollisionType in GMAssetCompiler.
*/
var yySprite_CollisionType = {
	AXIS_ALIGNED_RECT: 0,  /**< Bounding box collision check. */
	PRECISE: 1,            /**< Precise per-pixel collision check using mask. */
	ROTATED_RECT: 2,       /**< Bounding box collision check (with rotation). */
	SPINE_MESH: 3,         /**< Spine collision mesh check. */
};


/** @constructor */
function ColVertPos()
{
	this.x=0;
	this.y=0;
};

/** @constructor */
function ColVertTex()
{
	this.u=0;
	this.v=0;
};


// #############################################################################################
/// Function:<summary>
///             simple rect
///          </summary>
// #############################################################################################
/** @constructor */
function    YYRECT()
{
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
};

// #############################################################################################
/// Function:<summary>
///             Copy the bounding box
///          </summary>
///
/// In:		 <param name="_bbox">Box to copy</param>
// #############################################################################################
YYRECT.prototype.Copy = function (_bbox) {
	this.left = _bbox.left;
	this.right = _bbox.right;
	this.top = _bbox.top;
	this.bottom = _bbox.bottom;
};


// #############################################################################################
/// Function:<summary>
///             Create a new SPRITE object
///          </summary>
// #############################################################################################
/** @constructor */
function    yySprite()
{
	//this.DrawSimple = Sprite_Draw_Simple;
	//this.DrawSimplePos = Sprite_Draw_Simple_Pos;
    //this.Draw = Sprite_Draw_Ex;
    //this.GetCollisionChecking = Sprite_GetCollisionChecking;
    //this.GetXOrigin = Sprite_GetXOrigin;
    //this.GetYOrigin = Sprite_GetYOrigin;
    //this.GetCount = Sprite_GetCount;
    //this.GetBoundingBox = Sprite_GetBoundingBox;
    //this.PreciseCollisionPoint = Sprite_PreciseCollisionPoint;
    //this.PreciseCollisionRectangle = Sprite_PreciseCollisionRectangle;
    //this.PreciseCollisionEllipse = Sprite_PreciseCollisionEllipse;
    //this.PreciseCollision = Sprite_PreciseCollision;

    this.__type = "[sprite]";
    this.pName = "sprite";
	this.width = 16;									// size of the subimages
	this.height = 16;
	this.bbox = new YYRECT;                             // The bounding box
	this.transparent = true;							// Whether transparent
	this.smooth = true;									// Whether to smooth the boundaries
	this.preload = true;								// Whether to preload the texture
	this.bboxmode = 0;									// Bounding box mode (0=automatic, 1=full, 2=manual)
	this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;  // whether to prepare for precise collision checking
	this.xOrigin = 0;								    //origin of the sprite
	this.yOrigin = 0;
	
	this.copy = false; 								// is this a COPY of a sprite (so a custom image)

	this.numb = 0;										// number of subimages
	this.cullRadius = 8;								// cull radius (calculated at load)
	this.maskcreated = false;							// Whether the collision mask was created
	this.sepmasks = false;								// Whether the sub images have individual masks (or all use the same one).
	this.colmask = [];						            // Mask used for precise collision checking
	this.bitmaps = [];						            // the original bitmaps (device independent) in internal format
	this.ppTPE = [];								    // pointer to TPageEntry
	this.Masks = [];                                    // Masks
	this.playbackspeedtype = ePlaybackSpeedType_FramesPerSecond;
	this.playbackspeed = 30;

	this.sequence = null;						    // If present, we use sequence keyframe data for frame timing
	this.nineslicedata = null;
	this.m_LoadedFromChunk = false;
	this.m_LoadedFromIncludedFiles = false;
};
yySprite.prototype.GetCollisionChecking = function () { return this.colcheck === yySprite_CollisionType.PRECISE; };
yySprite.prototype.GetXOrigin = function () { return this.xOrigin; };
yySprite.prototype.GetYOrigin = function () { return this.yOrigin; };
yySprite.prototype.GetBoundingBox = function () { return this.bbox; };
yySprite.prototype.GetCount = function () { return this.numb; };


yySprite.prototype.GetWidth = function () { return this.width; };
yySprite.prototype.GetHeight = function () { return this.height; };
/** Truncates a floating point value into an integer. */
var __floatToInt = function (x) { return ~~x; };

/**
 * @param {spine.Skeleton} _skeleton
 *
 * @returns {[width: Number, height: Number]?}
 */
yySprite.prototype.GetSkeletonSpriteSize = function (_skeleton)
{
	var bounds = new YYRECT();

	_skeleton.updateWorldTransform();

	if (this.GetSkeletonBounds(_skeleton, bounds))
	{
		var width  = __floatToInt(bounds.right - bounds.left + 0.5);
		var height = __floatToInt(bounds.bottom - bounds.top + 0.5);
		return [width, height];
	}

	var skins = _skeleton.data.skins;
	for (var i = 0; i < skins.length; ++i)
	{
		_skeleton.setSkin(skins[i]);
		_skeleton.updateWorldTransform();

		if (this.GetSkeletonBounds(_skeleton, bounds))
		{
			var width  = __floatToInt(bounds.right - bounds.left + 0.5);
			var height = __floatToInt(bounds.bottom - bounds.top + 0.5);
			return [width, height];
		}
	}

	return null;
};

/**
 * @param {spine.Skeleton} _skeleton
 * @param {YYRECT} _bounds
 *
 * @returns {Boolean}
 */
yySprite.prototype.GetSkeletonBounds = function (_skeleton, _bounds)
{
	var retval = false;

	_bounds.left   = Number.MAX_SAFE_INTEGER;
	_bounds.top    = Number.MAX_SAFE_INTEGER;
	_bounds.right  = Number.MIN_SAFE_INTEGER;
	_bounds.bottom = Number.MIN_SAFE_INTEGER;

	var drawOrder = _skeleton.drawOrder;
	// var x = _skeleton.x, y = _skeleton.y;
	for (var i = 0; i < drawOrder.length; ++i)
	{
		var slot = drawOrder[i];
		if (slot.attachment)
		{
			if (slot.attachment instanceof spine.RegionAttachment)
			{
				var region = slot.attachment;

				var vertices = new Array(8);
				region.computeWorldVertices(slot.bone, vertices, 0, 2);

				for (var j = 0; j < 4; ++j)
				{
					var transformedX = vertices[(j * 2) + 0];
					var transformedY = vertices[(j * 2) + 1];

					_bounds.left   = __floatToInt(Math.min(_bounds.left,   transformedX));
					_bounds.right  = __floatToInt(Math.max(_bounds.right,  transformedX));
					_bounds.top    = __floatToInt(Math.min(_bounds.top,    transformedY));
					_bounds.bottom = __floatToInt(Math.max(_bounds.bottom, transformedY));

					retval = true;
				}
			}
			else if (slot.attachment instanceof spine.MeshAttachment)
			{
				var mesh = slot.attachment;

				var vertices = new Array(mesh.worldVerticesLength);
				mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);

				var numVerts = mesh.worldVerticesLength >> 1;
				for (var j = 0; j < numVerts; ++j)
				{
					var transformedX = vertices[(j * 2) + 0];
					var transformedY = vertices[(j * 2) + 1];

					_bounds.left   = __floatToInt(Math.min(_bounds.left,   transformedX));
					_bounds.right  = __floatToInt(Math.max(_bounds.right,  transformedX));
					_bounds.top    = __floatToInt(Math.min(_bounds.top,    transformedY));
					_bounds.bottom = __floatToInt(Math.max(_bounds.bottom, transformedY));

					retval = true;
				}
			}
		}
	}

	return retval;
};

yySprite.prototype.GetScaledBoundingBox = function(_xscale, _yscale)
{
	var scaledBB = new YYRECT;

	var abs_xscale = Math.abs(_xscale);
	var abs_yscale = Math.abs(_yscale);

	// First make bounds exclusive rather than inclusive
	// Much easier to deal with
	var tempBB = new YYRECT;
	tempBB.left = this.bbox.left;
	tempBB.right = this.bbox.right + 1;	
	tempBB.top = this.bbox.top;
	tempBB.bottom = this.bbox.bottom + 1;

	if ((this.nineslicedata != null) && (this.nineslicedata.GetEnabled()))
	{		
		// If bounding box covers entire sprite then we don't need to do anything clever
		if ((tempBB.left == 0) && (tempBB.top == 0) && (tempBB.right == this.width) && (tempBB.bottom == this.height))
		{			
			scaledBB.left = 0;
			scaledBB.top = 0;
			scaledBB.right = tempBB.right * abs_xscale;
			scaledBB.bottom = tempBB.bottom * abs_yscale;
		}
		else
		{
			var scaledSpriteWidth = this.width * abs_xscale;
			var scaledSpriteHeight = this.height * abs_yscale;

			var sliceLeftWidth = this.nineslicedata.GetLeft();	
			var origSliceMidWidth = (this.width - this.nineslicedata.GetRight()) - this.nineslicedata.GetLeft();
			var sliceMidWidth = origSliceMidWidth;
			var sliceRightWidth = this.nineslicedata.GetRight();
			var sliceTopHeight = this.nineslicedata.GetTop();
			var origSliceMidHeight = (this.height - this.nineslicedata.GetBottom()) - this.nineslicedata.GetTop();
			var sliceMidHeight = origSliceMidHeight;
			var sliceBottomHeight = this.nineslicedata.GetBottom();			

			if (scaledSpriteWidth < sliceLeftWidth)
			{
				sliceLeftWidth = scaledSpriteWidth;
				sliceMidWidth = 0.0;
				sliceRightWidth = 0.0;
			}
			else if (scaledSpriteWidth < (sliceLeftWidth + sliceRightWidth))
			{
				sliceMidWidth = 0.0;
				sliceRightWidth = scaledSpriteWidth - sliceLeftWidth;
			}
			else
			{
				sliceMidWidth = scaledSpriteWidth - (sliceLeftWidth + sliceRightWidth);
			}			

			if (scaledSpriteHeight < sliceTopHeight)
			{
				sliceTopHeight = scaledSpriteHeight;
				sliceMidHeight = 0.0;
				sliceBottomHeight = 0.0;
			}
			else if (scaledSpriteHeight < (sliceTopHeight + sliceBottomHeight))
			{
				sliceMidHeight = 0.0;
				sliceBottomHeight = scaledSpriteHeight - sliceTopHeight;
			}
			else
			{
				sliceMidHeight = scaledSpriteHeight - (sliceTopHeight + sliceBottomHeight);
			}
			
			// Work out what segments the bounding box straddles
			if (tempBB.left <= this.nineslicedata.GetLeft())
				scaledBB.left = tempBB.left;									// if we're in the left segment the value is unchanged
			else if (tempBB.left >= ((this.width - this.nineslicedata.GetRight())))
				scaledBB.left = sliceLeftWidth + sliceMidWidth + (tempBB.left - (this.width - this.nineslicedata.GetRight()));	// if we're in the right segment the value has the same position relative to the right edge
			else
			{
				// If we're in the middle segment we've got a bit more work to do
				var ratio = (tempBB.left - this.nineslicedata.GetLeft()) / origSliceMidWidth;
				scaledBB.left = sliceLeftWidth + (sliceMidWidth * ratio);
			}

			if (tempBB.right <= this.nineslicedata.GetLeft())
				scaledBB.right = tempBB.right;									// if we're in the left segment the value is unchanged
			else if (tempBB.right >= ((this.width - this.nineslicedata.GetRight())))
				scaledBB.right = sliceLeftWidth + sliceMidWidth + (tempBB.right - (this.width - this.nineslicedata.GetRight()));	// if we're in the right segment the value has the same position relative to the right edge
			else
			{
				// If we're in the middle segment we've got a bit more work to do
				var ratio = (tempBB.right - this.nineslicedata.GetLeft()) / origSliceMidWidth;
				scaledBB.right = sliceLeftWidth + (sliceMidWidth * ratio);
			}

			if (tempBB.top <= this.nineslicedata.GetTop())
				scaledBB.top = tempBB.top;									// if we're in the top segment the value is unchanged
			else if (tempBB.top >= ((this.height - this.nineslicedata.GetBottom())))
				scaledBB.top = sliceTopHeight + sliceMidHeight + (tempBB.top - (this.height - this.nineslicedata.GetBottom()));	// if we're in the bottom segment the value has the same position relative to the bottom edge
			else
			{
				// If we're in the middle segment we've got a bit more work to do
				var ratio = (tempBB.top - this.nineslicedata.GetTop()) / origSliceMidHeight;
				scaledBB.top = sliceTopHeight + (sliceMidHeight * ratio);
			}

			if (tempBB.bottom <= this.nineslicedata.GetTop())
				scaledBB.bottom = tempBB.bottom;									// if we're in the top segment the value is unchanged
			else if (tempBB.bottom >= ((this.height - this.nineslicedata.GetBottom())))
				scaledBB.bottom = sliceTopHeight + sliceMidHeight + (tempBB.bottom - (this.height - this.nineslicedata.GetBottom()));	// if we're in the bottom segment the value has the same position relative to the bottom edge
			else
			{
				// If we're in the middle segment we've got a bit more work to do
				var ratio = (tempBB.bottom - this.nineslicedata.GetTop()) / origSliceMidHeight;
				scaledBB.bottom = sliceTopHeight + (sliceMidHeight * ratio);
			}

			// Clamp
			scaledBB.left = yymin(scaledBB.left, scaledSpriteWidth);
			scaledBB.right = yymin(scaledBB.right, scaledSpriteWidth);

			scaledBB.top = yymin(scaledBB.top, scaledSpriteHeight);
			scaledBB.bottom = yymin(scaledBB.bottom, scaledSpriteHeight);
		}

		// Offset by scaled origin
		scaledBB.left -= this.xOrigin * abs_xscale;
		scaledBB.right -= this.xOrigin * abs_xscale;

		scaledBB.top -= this.yOrigin * abs_yscale;
		scaledBB.bottom -= this.yOrigin * abs_yscale;		
	}
	else
	{
		scaledBB.left = (tempBB.left - this.xOrigin) * abs_xscale;
		scaledBB.right = (tempBB.right - this.xOrigin) * abs_xscale;		

		scaledBB.top = (tempBB.top - this.yOrigin) * abs_yscale;
		scaledBB.bottom = (tempBB.bottom - this.yOrigin) * abs_yscale;		
	}

	// Finally, flip according to scale sign
	if (_xscale < 0.0)
	{
		scaledBB.left = -scaledBB.left;
		scaledBB.right = -scaledBB.right;
	}

	if (_yscale < 0.0)
	{
		scaledBB.top = -scaledBB.top;
		scaledBB.bottom = -scaledBB.bottom;
	}

	if (scaledBB.left > scaledBB.right)
	{
		var tempval = scaledBB.left;
		scaledBB.left = scaledBB.right;
		scaledBB.right = tempval;
	}

	if (scaledBB.top > scaledBB.bottom)
	{
		var tempval = scaledBB.top;
		scaledBB.top = scaledBB.bottom;
		scaledBB.bottom = tempval;
	}

	// Finally subtract 1 to undo the one-pixel expansion we added at the start
	scaledBB.right -= 1;
	scaledBB.bottom -= 1;

	return scaledBB;
};


// #############################################################################################
/// Property: <summary>
///           	Calculate the cull radius
///           </summary>
// #############################################################################################
yySprite.prototype.CalcCullRadius = function () {
	// calculate the cull Radius
	var yorigSQ = (this.yOrigin * this.yOrigin);
	var xorigSQ = (this.xOrigin * this.xOrigin);
	var rorigSQ = (this.width - this.xOrigin) * (this.width - this.xOrigin);
	var borigSQ = (this.height - this.yOrigin) * (this.height - this.yOrigin);
	var TLRadius = ~ ~ceil(sqrt(xorigSQ + yorigSQ));
	var TRRadius = ~ ~ceil(sqrt(rorigSQ + yorigSQ));
	var BLRadius = ~ ~ceil(sqrt(xorigSQ + borigSQ));
	var BRRadius = ~ ~ceil(sqrt(rorigSQ + borigSQ));

	this.cullRadius = yymax(TLRadius, yymax(TRRadius, yymax(BLRadius, BRRadius)));
};


// #############################################################################################
/// Property: <summary>
///           	Build SWF data associated with the sprite
///           </summary>
// #############################################################################################
yySprite.prototype.BuildSWFData = function (_swfIndex, _xo, _yo) {

    try {
        if (g_pSpriteManager.swfSpriteData !== undefined) {
        
            var littleEndian = true;
            var byteOffset = 0;
            var swfArrayBuffer = g_pSpriteManager.swfSpriteData[_swfIndex];
            
            var dataView = new DataView(swfArrayBuffer);
            if (dataView !== undefined) {                        
            
                // Read in the header details            
                var JPEGTableSize = dataView.getInt32(byteOffset, littleEndian);
                // Check for the version bit used by C++ runner
                var SWF_EXT_FLAG = (1 << 31);
                if ((JPEGTableSize & SWF_EXT_FLAG) != 0) {
                
                    JPEGTableSize &= (~SWF_EXT_FLAG);
                    // Skip over the version encoded since we already had backwards compatibility in the html5 header :s
                    byteOffset += 4; 
                }
                byteOffset += 4;
                
                var pJPEGTables = null;            
                if (JPEGTableSize > 0)
                {
                    pJPEGTables = new Uint8Array(swfArrayBuffer, byteOffset, JPEGTableSize);
                    byteOffset += ((JPEGTableSize + 3) & ~3);
                }

                var numDictionaryItems = dataView.getUint32(byteOffset, littleEndian);
                byteOffset += 4;

                // Read in shape data from the dictionary
                this.SWFDictionaryItems = [];
                for (var i = 0; i < numDictionaryItems; i++) {
        
                    var type = dataView.getInt32(byteOffset, littleEndian);
                    byteOffset += 4;        
                    var id = dataView.getInt32(byteOffset, littleEndian);
                    byteOffset += 4;
                    
                    var pShape = null;
                    if (type === eDIType_Shape) {
                        pShape = new yySWFShape(type, id);
                        byteOffset = pShape.BuildShapeData(dataView, byteOffset, littleEndian, this.SWFDictionaryItems);
                    }
                    else if (type === eDIType_Bitmap) {
                        pShape = new yySWFBitmap(type, id);
                        byteOffset = pShape.BuildBitmapData(swfArrayBuffer, dataView, byteOffset, littleEndian, pJPEGTables);
                    }
                    else {                    
                        pShape = { type: eDIType_Invalid, id: id };
                    }
                    this.SWFDictionaryItems.push(pShape);
                }
                
                // Read in the timeline data
                this.SWFTimeline = new yySWFTimeline();
                byteOffset = this.SWFTimeline.BuildTimelineData(dataView, byteOffset, littleEndian);
                
                // Sort out any collision masks
                if (this.SWFTimeline.collisionMaskHeader.numCollisionMasks > 0) {
					byteOffset = this.SetupSWFCollisionMasks(dataView, byteOffset, littleEndian);
					
					if (!this.m_LoadedFromChunk) {
                        this.colcheck = yySprite_CollisionType.PRECISE;
                    }
                }
                else {
                    this.width = this.SWFTimeline.maxX;
                    this.height = this.SWFTimeline.maxY;

                    if (!this.m_LoadedFromChunk) {
                        this.colcheck = yySprite_CollisionType.AXIS_ALIGNED_RECT;
                    }
				}
				
				if(!this.m_LoadedFromChunk)
				{
                	this.bboxmode = 0;
					this.preload = true;
				}
                
                if (!this.m_LoadedFromChunk && this.colcheck === yySprite_CollisionType.AXIS_ALIGNED_RECT) {
                    this.bbox.left = this.SWFTimeline.minX;
		            this.bbox.right = this.SWFTimeline.maxX;
		            this.bbox.top = this.SWFTimeline.minY;
		            this.bbox.bottom = this.SWFTimeline.maxY;
		            this.xOrigin = _xo;
		            this.yOrigin = _yo;
                }                
                // i_numb = m_SWF_Timeline->numFrames;                
                this.CalcCullRadius();                
                this.SetSWFDrawRoutines();                	
            }
        }
    }
    catch (e) {
        debug("Cannot build SWF data " + e.message);
    }
};


// #############################################################################################
/// Function:<summary>
///          	Setup collision masks for an SWF
///          </summary>
// #############################################################################################
yySprite.prototype.SetupSWFCollisionMasks = function (_dataView, _byteOffset, _littleEndian) {

    if (this.colcheck !== yySprite_CollisionType.PRECISE) {
        return;
    }

    // Dispose of the original collision mask
    this.colmask = [];
    
    // Set the w/h of the sprite according to the collision mask header of the timeline
    this.width = this.SWFTimeline.collisionMaskHeader.maskWidth;
	this.height = this.SWFTimeline.collisionMaskHeader.maskHeight;
	
	// shorthand this
	var numCollisionMasks = this.SWFTimeline.collisionMaskHeader.numCollisionMasks;

    // Load in the new collision mask	    
	for (var i = 0; i < numCollisionMasks; i++)
	{
		var colMaskSize = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset += 4;
				
		var offsetStore = _byteOffset;

        // Decompress the RLE mask
        var maskEntry = 0;
        var mask = [];
        for (var j = 0; j < colMaskSize; j++) {
        
            var headerByte = _dataView.getUint8(_byteOffset, _littleEndian);
            _byteOffset += 1;
            
            var writeVal = ((headerByte) & 0x80) != 0 ? true : false;
		    var runlength = ((headerByte) & 0x7f) + 1;
		    for (var k = 0; k < runlength; k++)
		    {
		    	mask[maskEntry++] = writeVal;
		    }		    
		}
        var u8mask = new Uint8Array(mask.length);
        for (var i = 0; i < mask.length; ++i)
            u8mask[i] = mask[i];
        this.colmask[i] = u8mask;
		
		// Increment, taking alignment into account
	    _byteOffset = offsetStore + ((colMaskSize + 3) & ~3);
	}
	this.maskcreated = true;	
	return _byteOffset;
};

// #############################################################################################
/// Function:<summary>
///          	Re-direct draw routines to those that draw SWFs for the sprite
///          </summary>
// #############################################################################################
yySprite.prototype.SetSWFDrawRoutines = function () {

    this.Draw = function (_ind, _x, _y, _xscale, _yscale, _angle, _colour, _alpha) {    
	    Graphics_SWFDraw(
	        this.SWFDictionaryItems, this.SWFTimeline, _ind, this.xOrigin, this.yOrigin, _x, _y, _xscale, _yscale, _angle, _colour, _alpha, this.ppTPE);
    };
    
    this.DrawSimple = function (_ind, _x, _y, _alpha) {
        Graphics_SWFDraw(
            this.SWFDictionaryItems, this.SWFTimeline, _ind, this.xOrigin, this.yOrigin, _x, _y, 1.0, 1.0, 0.0, 0xffffffff, _alpha, this.ppTPE);
    };
};



// #############################################################################################
/// Property: <summary>
///           	Build skeleton data associated with the sprite
///           </summary>
// #############################################################################################
yySprite.prototype.BuildSkeletonData = function (_skeletonData) {
	if (_skeletonData) {
		this.m_skeletonSprite = new yySkeletonSprite();
		//this.m_skeletonSprite.Load(skeletonData.json, skeletonData.atlas, skeletonData.width, skeletonData.height);
		this.m_skeletonSprite.Load(
			this.m_LoadedFromIncludedFiles ? '' : (this.pName + '/'),
			this.pName, _skeletonData.json, _skeletonData.atlas,
			_skeletonData.numTextures, _skeletonData.textureSizes,
            this);
	}

	// Set simple draw routines to target the skeleton sprite
	this.Draw = function (_ind, _x, _y, _xscale, _yscale, _angle, _colour, _alpha) {    	    
		this.m_skeletonSprite.Draw(_ind, _x, _y, _xscale, _yscale, _angle, _colour, _alpha);
	};
	
	this.DrawSimple = function (_ind, _x, _y, _alpha) {
		this.m_skeletonSprite.Draw(_ind, _x, _y, 1, 1, 0, 0xffffff, _alpha);
	};

	this.numb = SKELETON_FRAMECOUNT;
};

// #############################################################################################
/// Property: <summary>
///           	Loads sprite data from a Spine .json file
///           </summary>
// #############################################################################################
yySprite.prototype.LoadFromSpineAsync = function (_filename, _callback) {
	var loadFileContents = function (_filename, _callback) {
		var errorMessage = 'Could not load file contents!';
		var request = new XMLHttpRequest();
		request.open('GET', CheckWorkingDirectory(_filename), true);
		request.send();
		request.onload = function () {
			if (_callback) {
				_callback((request.status == 200) ? null : errorMessage,
					request.response || request.responseText);
			}
		};
		request.onerror = function () {
			if (_callback) {
				_callback(errorMessage);
			}
		};
	};

	var getSpineTexturePages = function (_atlas) {
		var lines = _atlas.split('\n');
		
		// Array of texture page info
		var textures = [];
		// Current texture page
		var current = undefined;
		// If true then next line read is a filename
		var checkFilename = true;

		var reSize = new RegExp('^size*:\\s*(\\d+)\\s*,\\s*(\\d+)$');

		for (var i = 0; i < lines.length; ++i) {
			var line = lines[i].trim();

			if (checkFilename) {
				// Found texture name
				if (current != undefined) {
					if (current.width === undefined
						|| current.height === undefined) {
						// Size was not parsed!
						return undefined;
					}
					textures.push(current);
				}
				current = { name: line };
				checkFilename = false;
			} else {
				if (line == '') {
					// Found texture page separator
					checkFilename = true;
				} else if (current != undefined) {
					// Found texture size
					var m = line.match(reSize);
					if (m) {
						current.width = parseInt(m[1]);
						current.height = parseInt(m[2]);
					}
				}
			}
		}

		if (current != undefined) {
			if (current.width === undefined
				|| current.height === undefined) {
				// Size was not parsed!
				return undefined;
			}
			textures.push(current);
		}

		return textures;
	};

	var sprite = this;
	var atlasFilename = _filename.slice(0, -5) + '.atlas';
	var waitingForCallback = 2;
	var hasError = false;
	var atlas;
	var textures;

	var tryCallback = function (err) {
		if (hasError) {
			return;
		}
	
		if (err) {
			hasError = true;
			if (_callback) {
				_callback(err);
			}
			return;
		}

		if (--waitingForCallback == 0) {
			var skeletonData = {
				json: json,
				atlas: atlas,
				numTextures: textures.length,
				textureSizes: textures,
			};
			sprite.BuildSkeletonData(skeletonData);
			var size = sprite.GetSkeletonSpriteSize((new yySkeletonInstance(sprite.m_skeletonSprite)).m_skeleton);
			if (size instanceof Array)
			{
				sprite.width = size[0];
				sprite.height = size[1];
			}

			// Trigger async callback
			if (_callback) {
				_callback();
			}
		}
	};

	loadFileContents(_filename, function (_err, _contents) {
		if (!_err) {
			json = _contents;
		}
		tryCallback(_err);
	});

	loadFileContents(atlasFilename, function (_err, _contents) {
		if (!_err) {
			atlas = _contents;
			textures = getSpineTexturePages(atlas);
			if (textures === undefined) {
				tryCallback('Invalid atlas format!');
				return;
			}
		}
		tryCallback(_err);
	});
};

// #############################################################################################
/// Property: <summary>
///           	Build sequence associated with the sprite
///           </summary>
// #############################################################################################
yySprite.prototype.BuildSequenceData = function (_sequenceData) {
	this.sequence = new yySequence(_sequenceData);
	
	// Update the sprite's origin with that of the sequence
	this.xOrigin = this.sequence.m_xorigin;
	this.yOrigin = this.sequence.m_yorigin;
};

// #############################################################################################
/// Property: <summary>
///           	Build nineslice data associated with the sprite
///           </summary>
// #############################################################################################
yySprite.prototype.BuildNineSliceData = function (_ninesliceData)
{
    this.nineslicedata = new yyNineSliceData(_ninesliceData);    
};

// #############################################################################################
/// Function:<summary>
///          	Un-ByteRun the mask
///          </summary>
///
/// In:		<param name="_pSprite">Sprite we're working on</param>
///			<param name="_mask">Mask index</param>
///				
// #############################################################################################
function DecompressMask(_pSprite, _mask) {

/*	_pSprite = new yySprite();
	_pSprite.Masks = []
	_pSprite.Masks[0] = [];
	_pSprite.Masks[0][0] = 0x01;	// 2 copy
	_pSprite.Masks[0][1] = 0x01;
	_pSprite.Masks[0][2] = 0x02;
	_pSprite.Masks[0][3] = 0x84;	// 5 run
	_pSprite.Masks[0][4] = 0xff;
	_pSprite.Masks[0][5] = 0x84;	// 5 run
	_pSprite.Masks[0][6] = 0x00;
	_pSprite.Masks[0][7] = 0x04;	// 5 copy
	_pSprite.Masks[0][8] = 0x01;
	_pSprite.Masks[0][9] = 0x02;
	_pSprite.Masks[0][10] = 0x03;
	_pSprite.Masks[0][11] = 0x04;
	_pSprite.Masks[0][12] = 0x05;
	_mask = 0;
*/
/*	if (_pSprite.pName == "spr_backgroundshape"){
		_pSprite.pName = "spr_backgroundshape";
		while (true);
	}*/

	if (_pSprite.Masks[_mask] != null)
	{
		var m = [];
		var src = 0;
		var dest = 0;
		var d;
		while( src < _pSprite.Masks[_mask].length )
		{
			var runcopy = _pSprite.Masks[_mask][src++];

			if (runcopy & 0x80)
			{
				// if top bit set, RUN
				runcopy = (runcopy & 0x7f) + 1; 			// +1 (we never have 0)
				d = _pSprite.Masks[_mask][src++];			// get "run" value
				for (var v = 0; v < runcopy; v++){			
					m[dest++] = d;							// fill with copied byte
				}
			} 
			else
			{
				// if top bit clear, COPY	
				runcopy++; 									// +1 (we never have 0)
				for (var v = 0; v < runcopy; v++){
					m[dest++] = _pSprite.Masks[_mask][src++];
				}
			}
		}
	}
	_pSprite.Masks[_mask] = m;
}

// #############################################################################################
/// Function:<summary>
///             Create a sprite from the "storage" format.
///          </summary>
///
/// In:		 <param name="_pStore">Storage entry</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    CreateSpriteFromStorage( _pStore )
{
    var pSprite = new yySprite();
    if( _pStore.pName !== undefined ) pSprite.pName = _pStore.pName;
	if( _pStore.width !== undefined ) pSprite.width = _pStore.width;							// size of the subimages
	if( _pStore.height !== undefined ) pSprite.height = _pStore.height;											
	if( _pStore.bboxLeft !== undefined ) pSprite.bbox.left = _pStore.bboxLeft;
	if( _pStore.bboxRight !== undefined ) pSprite.bbox.right = _pStore.bboxRight;
	if( _pStore.bboxTop !== undefined )  pSprite.bbox.top = _pStore.bboxTop;
	if( _pStore.bboxBottom !== undefined ) pSprite.bbox.bottom = _pStore.bboxBottom;
	if( _pStore.transparent !== undefined ) pSprite.transparent = _pStore.transparent;							    // Whether transparent
	if( _pStore.smooth !== undefined ) pSprite.smooth = _pStore.smooth;									// Whether to smooth the boundaries
	if( _pStore.preload !== undefined) pSprite.preload = _pStore.preload;								    // Whether to preload the texture
	if( _pStore.bboxMode !== undefined ) pSprite.bboxmode = _pStore.bboxMode;									// Bounding box mode (0=automatic, 1=full, 2=manual)
	if( _pStore.colCheck !== undefined ) pSprite.colcheck = _pStore.colCheck;								// whether to prepare for precise collision checking
	if( _pStore.xOrigin !== undefined ) pSprite.xOrigin = _pStore.xOrigin;								    //origin of the sprite
	if( _pStore.yOrigin !== undefined ) pSprite.yOrigin = _pStore.yOrigin;	
	
	if(_pStore.playbackspeedtype !== undefined) pSprite.playbackspeedtype = _pStore.playbackspeedtype;
	if(_pStore.playbackspeed !== undefined) pSprite.playbackspeed = _pStore.playbackspeed;
	
		
	pSprite.Masks = null;
	
	if (_pStore.swf !== undefined) {
		pSprite.m_LoadedFromChunk = true;
	    pSprite.BuildSWFData(_pStore.swf, pSprite.xOrigin, pSprite.yOrigin);
	}

	if (_pStore.sequence !== undefined) {
	    pSprite.BuildSequenceData(_pStore.sequence);
	}

	if (_pStore.nineslice !== undefined) {
	    pSprite.BuildNineSliceData(_pStore.nineslice);
	}
		
	if(_pStore.Masks !== undefined) pSprite.Masks = _pStore.Masks;
	    	
	pSprite.ppTPE = [];
    for(var i=_pStore.TPEntryIndex.length-1;i>=0;i--){
    	pSprite.ppTPE[i] =   _pStore.TPEntryIndex[i];       // Just use the storage data directly - it's never changed!
    }	

    if (pSprite.numb == 0)
    {
        pSprite.numb = pSprite.ppTPE.length;
    }

	// Copy actual entry, and set Crop width+height as it must be at least 1
	for(var i=0;i<pSprite.ppTPE.length;i++)
	{
	    pSprite.ppTPE[i] = Graphics_GetTextureEntry( pSprite.ppTPE[i] );
	    if (pSprite.ppTPE[i] != null) {
            if( pSprite.ppTPE[i].CropWidth==0 ) pSprite.ppTPE[i].CropWidth=1;
            if( pSprite.ppTPE[i].CropHeight==0 ) pSprite.ppTPE[i].CropHeight=1;
        } // end if
	}	

	// Do this after we've set up our TPEs
	if (_pStore.skel !== undefined) {
		var skeletonData = g_pSpriteManager.SkeletonData
			? g_pSpriteManager.SkeletonData[_pStore.skel]
			: undefined;
	    pSprite.BuildSkeletonData(skeletonData);
	}

	pSprite.CalcCullRadius();    	

    // Expand masks
    if( pSprite.Masks )
    {
        for(var i=0;i<_pStore.Masks.length;i++)
        {
        	if (!_pStore.Decompressed) DecompressMask(pSprite, i);

            pSprite.maskcreated = true;
            var size = pSprite.width * pSprite.height;
            var mask = new Uint8Array(size);
            
            // unpack the mask
		    var strideM = ((pSprite.width+7)>>3); //8;
		    var offs = 0;
		    for( var y=0; y<pSprite.height; ++y, offs+=strideM)
		    {
			    var m = 0x80;
			    var oM = offs;
			    for(var x=0; x<pSprite.width; ++x, m>>=1) 
			    {
				    if (m==0) 
				    {
					    m=0x80;
					    ++oM;
				    } 
				    mask[x + (y * pSprite.width)] = ((pSprite.Masks[i][oM] & m)!=0);
			    } 
		    } 
            
            
            pSprite.colmask[i] = mask;
		}

    }
    _pStore.Decompressed = true;    
    return pSprite;
}

function SphereIsVisible(position, radius)
{
	var worldMat = g_Matrix[MATRIX_WORLD];
	var cullScale = worldMat.GetMaximumUnitScale();
	var frustum = GetViewFrustum();
	return frustum.IntersectsSphere(worldMat.TransformVec3(position), radius * cullScale);
}

// #############################################################################################
/// Function:<summary>
///             Get the actual sprite data.
///          </summary>
///
/// In:		 <param name="_spr_number">Sprite to get</param>
/// Out:	 <returns>
///				The sprite data or null
///			 </returns>
// #############################################################################################
yySprite.prototype.DrawSimple = function (_sub_image, _x, _y, _alpha) {
	if (this.numb <= 0) return;

    // if (g_transRoomExtentsDirty)
	// {
	// 	UpdateTransRoomExtents();
	// }

	var cullRadius  = this.cullRadius;

	if (SphereIsVisible(new Vector3(_x, _y, GR_Depth), cullRadius))
	{
		_sub_image = (~ ~_sub_image) % this.numb;
		if (_sub_image < 0) _sub_image = _sub_image + this.numb;
        
        // no texture data
		if (!this.ppTPE) return;
        // Make sure we're not dealing with a texture that's been downsized to fit the tpage
        var pTPE = this.ppTPE[_sub_image];
        if (!pTPE) return; // no loaded? texture group etc?

        if ((this.nineslicedata != null) && (this.nineslicedata.enabled == true))
        {
            var col = 0xffffffff;
            this.nineslicedata.Draw(_x, _y, this.width, this.height, 0, col, 1, _sub_image, this);
        }
        else
        {
            if ((pTPE.w == pTPE.CropWidth) && (pTPE.h == pTPE.CropHeight))
            {
                Graphics_TextureDrawSimple(pTPE, _x - this.xOrigin, _y - this.yOrigin, _alpha);
            }
            else
            {
                var col = 0xffffffff;
                Graphics_TextureDraw(pTPE, 0, 0, _x - this.xOrigin, _y - this.yOrigin, 1, 1, 0, col, col, col, col, 1);
            }
        }
	}
};


// #############################################################################################
/// Function:<summary>
///				Draws subimage ind of the sprite partially transparent
///          </summary>
///
/// In:		 <param name="ind"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="xscale"></param>
///			 <param name="yscale"></param>
///			 <param name="angle"></param>
///			 <param name="color"></param>
///			 <param name="alpha"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.Draw = function (_ind, _x, _y, _xscale, _yscale, _angle, _colour, _alpha) {

	if (this.numb <= 0) return; // No images?

	if (this.sequence != null)
	{
		if (_ind < 0)
		{
			return;		// denotes empty space in the sequence
		}
	}

    // if (g_transRoomExtentsDirty)
	// {
	// 	UpdateTransRoomExtents();
	// }

    if (!this.ppTPE) return;

	var xcullRadius = abs(this.cullRadius * _xscale);
	var ycullRadius = abs(this.cullRadius * _yscale);

	var cullRadius;
	if (xcullRadius > ycullRadius){
		cullRadius = xcullRadius;
	}else{
		cullRadius = ycullRadius;
	}

	if (SphereIsVisible(new Vector3(_x, _y, GR_Depth), cullRadius))
	{
		// Index wraps..
		_ind = (~ ~_ind) % this.numb;
		if (_ind < 0) _ind += this.numb;

		_angle = fmod(_angle, 360.0);

		if ((this.nineslicedata != null) && (this.nineslicedata.enabled == true))
		{		    
		    this.nineslicedata.Draw(_x, _y, this.width * _xscale, this.height * _yscale, _angle, _colour, _alpha, _ind, this);
		}
		else
		{
		    // undefined forces colour+alpha into ALL verts
		    Graphics_TextureDraw(this.ppTPE[_ind], this.xOrigin, this.yOrigin, _x, _y, _xscale, _yscale, _angle * Math.PI / 180.0, _colour, undefined, undefined, undefined, _alpha);
		}
	}
};


yySprite.prototype.GetSkeletonSlotsAtPoint = function(_inst, _x, _y, _list)
{
    if ((this.m_skeletonSprite === undefined) || (this.m_skeletonSprite === null))
        return;     // not a Spine sprite

    var xscale = _inst.image_xscale;
    var yscale = _inst.image_yscale;

    var x = _inst.x;
    var y = _inst.y;
    var ind = Math.floor(_inst.image_index);

    if (this.numb > 0)
    {
        ind = (~ ~ind) % this.numb;
    }
    if (ind < 0) ind += this.numb;

    var angle = _inst.image_angle;

    this.m_skeletonSprite.GetSlotsAtWorldPos(_inst, undefined, undefined, ind, x, y, xscale, yscale, angle, _x, _y, _list);

};



// #############################################################################################
/// Function:<summary>
///             Get the actual sprite data.
///          </summary>
///
/// In:		 <param name="_spr_number">Sprite to get</param>
/// Out:	 <returns>
///				The sprite data or null
///			 </returns>
// #############################################################################################
yySprite.prototype.Sprite_DrawSimplePos = function (_sub_image, _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _alpha) {
	if (this.numb <= 0) return;

	_sub_image = (~ ~_sub_image) % this.numb;
	if (_sub_image < 0) _sub_image = _sub_image + this.numb;

	if (!this.ppTPE) return;
	Graphics_TextureDrawPos(this.ppTPE[_sub_image], _x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _alpha);
};

function _ColMaskSet(u, v, pMaskBase,width)
{
	//HTML5 Doesn't have compressed masks so this is simpler
	return pMaskBase[u + (v * width)]
};


yySprite.prototype.CollisionTilemapLine= function (bb2,xl,yl,xr,yr)
{
	if ((xr - xl == 0) && (yr - yl == 0))
	{

		if ((xl < bb2[0].x) || (xl >= bb2[1].x)) return false;
		if ((yr < bb2[0].y) || (yr >= bb2[2].y)) return false;

		return true;
	}

	if (abs(xr - xl) >= abs(yr - yl))
	{

		var sx = ~~yymax(bb2[0].x, xl);
		//therefore proportion along line is 
		var prop = (sx - xl) / (xr - xl);
		//therefore starty is
		var sy = yl + prop * (yr - yl);
		var ex = ~~yymin(bb2[1].x, xr);
		var dy = (yl - yr) / (xl - xr);
		for (var i = sx; i <= ex; i++, sy += dy)
		{
			if ((sx < bb2[0].x) || (sx >= bb2[1].x)) continue;
			if ((sy < bb2[0].y) || (sy >= bb2[2].y)) continue;
	
			return true;
		}
	}
	else
	{
		// make sure line runs from top to bottom
		if (yr < yl)
		{
			var val = yr; yr = yl; yl = val;
			val = xr; xr = xl; xl = val;
		}

		var sy = ~~yymax(bb2[0].y, yl);
		//therefore proportion along line is 
		var prop = (sy - yl) / (yr - yl);
		//therefore startx is
		var sx = xl + prop * (xr - xl);

		var ey = ~~yymin(bb2[2].y, yr);

		var dx = (xr - xl) / (yr - yl);

		for (var i = sy; i <= ey; i++, sx += dx)
		{
			if ((sx < bb2[0].x) || (sx >= bb2[1].x)) continue;
			if ((sy < bb2[0].y) || (sy >= bb2[2].y)) continue;

			return true;
		}
	}

	return false;

};

yySprite.prototype.CollisionTilemapEllipse= function (bb2,xl,yl,xr,yr)
{
	var l = yymax(xl, bb2[0].x);

	l = ~~(Math.floor(l) + 0.5);

	var r = ~~yymin(xr, bb2[2].x);
	var t = yymax(yl, bb2[0].y);

	t = ~~(Math.floor(t) + 0.5);
	var b = ~~yymin(yr, bb2[2].y);


	var mx = ((xl+xr) / 2);
	var my = ((yl+yr) / 2);
	var ww = ((xr - xl) / 2);
	var hh = ((yr - yl) / 2);

	for (var i = l; i <= r; i++)
	{
		for (var j = t; j <= b; j++)
		{
			if (Sqr((i - mx) / ww) + Sqr((j - my) / hh) > 1) 
				continue;   // outside ellipse

			return true;
		}
	}
	return false;
};

yySprite.prototype.PreciseCollisionTilemapRect= function ( tMaskData, bb2, t_ibbox,  xl,  yl,  xr, yr,  sprwidth)
{

	var l = yymax(xl, bb2[0].x);

	l = ~~(Math.floor(l) + 0.5);

	var r = ~~yymin(xr, bb2[2].x);
	var t = yymax(yl, bb2[0].y);

	t = ~~(Math.floor(t) + 0.5);
	var b = ~~yymin(yr, bb2[2].y);

	var sleftedge = t_ibbox[0].u;
	var stopedge = t_ibbox[0].v;


	var tuscalex = (t_ibbox[1].u - t_ibbox[0].u) / (bb2[1].x - bb2[0].x);
	var tuscaley = (t_ibbox[3].u - t_ibbox[0].u) / (bb2[3].y - bb2[0].y);

	var tvscalex = (t_ibbox[1].v - t_ibbox[0].v) / (bb2[1].x - bb2[0].x);
	var tvscaley = (t_ibbox[3].v - t_ibbox[0].v) / (bb2[3].y - bb2[0].y);

	var _sleftedge = yymin(t_ibbox[0].u, yymin(t_ibbox[1].u, t_ibbox[2].u));// sleftedge;
	var _srightedge = yymax(t_ibbox[0].u, yymax(t_ibbox[1].u, t_ibbox[2].u));
	var _stopedge = yymin(t_ibbox[0].v, yymin(t_ibbox[1].v, t_ibbox[2].v));
	var  _sbottomedge = yymax(t_ibbox[0].v, yymax(t_ibbox[1].v, t_ibbox[2].v));

	for (var i = l; i < r; i += 1.0)
	{
		var u2 = (((i)-bb2[0].x) * tuscalex + sleftedge) + (((t)-bb2[0].y) * tuscaley);
		var v2 = (((t)-bb2[0].y) * tvscaley + stopedge) + (((i)-bb2[0].x) * tvscalex);

		for (var j = t; j < b; j += 1.0, v2 += tvscaley, u2 += tuscaley)
		{
			if (tMaskData != null)
			{
				if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
				if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

				if (!_ColMaskSet(~~u2, ~~v2, tMaskData, sprwidth))
					continue;

			}
			return true;
		}
	}

	return false;

};


yySprite.prototype.PreciseCollisionTilemapLine= function ( tMaskData, bb2, t_ibbox,  xl,  yl,  xr, yr,  sprwidth)
{


	var sleftedge = t_ibbox[0].u;
	var stopedge = t_ibbox[0].v;


	var tuscalex = (t_ibbox[1].u - t_ibbox[0].u) / (bb2[1].x - bb2[0].x);
	var tuscaley = (t_ibbox[3].u - t_ibbox[0].u) / (bb2[3].y - bb2[0].y);

	var tvscalex = (t_ibbox[1].v - t_ibbox[0].v) / (bb2[1].x - bb2[0].x);
	var tvscaley = (t_ibbox[3].v - t_ibbox[0].v) / (bb2[3].y - bb2[0].y);

	var _sleftedge = yymin(t_ibbox[0].u, yymin(t_ibbox[1].u, t_ibbox[2].u));// sleftedge;
	var _srightedge = yymax(t_ibbox[0].u, yymax(t_ibbox[1].u, t_ibbox[2].u));
	var _stopedge = yymin(t_ibbox[0].v, yymin(t_ibbox[1].v, t_ibbox[2].v));
	var  _sbottomedge = yymax(t_ibbox[0].v, yymax(t_ibbox[1].v, t_ibbox[2].v));

	if ((xr - xl == 0) && (yr - yl == 0))
	{
		var u2 = (((xr)-bb2[0].x) * tuscalex + sleftedge) + (((yr)-bb2[0].y) * tuscaley);
		var v2 = (((yr)-bb2[0].y) * tvscaley + stopedge) + (((xr)-bb2[0].x) * tvscalex);
		if ((v2 < _stopedge) || (v2 >= _sbottomedge)) return false;
		if ((u2 < _sleftedge) || (u2 >= _srightedge)) return false;

		if (_ColMaskSet(~~u2, ~~v2, tMaskData,sprwidth))
			return true;

		return false;
	}

	// Check shallow
	if (abs(xr - xl) >= abs(yr - yl))
	{

		var sx =~~yymax(bb2[0].x, xl);
		//therefore proportion along line is 
		var prop = (sx - xl) / (xr - xl);
		//therefore starty is
		var sy = yl + prop * (yr - yl);

		var ex = ~~yymin(bb2[1].x, xr);
		var dy =  (yl - yr)/ (xl - xr) ;
		for (var i = sx; i <=ex ; i++, sy += dy)
		{
			
			var u2 = (((i)-bb2[0].x) * tuscalex + sleftedge) + (((sy)-bb2[0].y) * tuscaley);
			var v2 = (((sy)-bb2[0].y) * tvscaley + stopedge) + (((i)-bb2[0].x) * tvscalex);

			if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
			if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

			if (_ColMaskSet(~~u2, ~~v2, tMaskData,sprwidth))
				return true;		
		}
	}
	else
	{
		// make sure line runs from top to bottom
		if (yr < yl)
		{
			var val = yr; yr = yl; yl = val;
			val = xr; xr = xl; xl = val;
		}


		var sy = ~~yymax(bb2[0].y, yl);
		//therefore proportion along line is 
		var prop = (sy - yl) / (yr - yl);
		//therefore startx is
		var sx = xl + prop * (xr - xl);

		var ey = ~~yymin(bb2[2].y, yr);

		var dx = (xr - xl) / (yr - yl);

		for (var i = sy; i <= ey; i++, sx += dx)
		{
			
			var u2 = (((sx)-bb2[0].x) * tuscalex + sleftedge) + (((i)-bb2[0].y) * tuscaley);
			var v2 = (((i)-bb2[0].y) * tvscaley + stopedge) + (((sx)-bb2[0].x) * tvscalex);

			if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
			if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

			if (_ColMaskSet(~~u2, ~~v2, tMaskData,sprwidth))
				return true;
		}

	}

	return false;

};

yySprite.prototype.PreciseCollisionTilemapEllipse= function ( tMaskData, bb2, t_ibbox,  xl,  yl,  xr, yr,  sprwidth)
{
	var l = yymax(xl, bb2[0].x);

	l = ~~(Math.floor(l) + 0.5);

	var r = ~~yymin(xr, bb2[2].x);
	var t = yymax(yl, bb2[0].y);

	t = ~~(Math.floor(t) + 0.5);
	var b = ~~yymin(yr, bb2[2].y);

	var sleftedge = t_ibbox[0].u;
	var stopedge = t_ibbox[0].v;


	var tuscalex = (t_ibbox[1].u - t_ibbox[0].u) / (bb2[1].x - bb2[0].x);
	var tuscaley = (t_ibbox[3].u - t_ibbox[0].u) / (bb2[3].y - bb2[0].y);

	var tvscalex = (t_ibbox[1].v - t_ibbox[0].v) / (bb2[1].x - bb2[0].x);
	var tvscaley = (t_ibbox[3].v - t_ibbox[0].v) / (bb2[3].y - bb2[0].y);

	var _sleftedge = yymin(t_ibbox[0].u, yymin(t_ibbox[1].u, t_ibbox[2].u));// sleftedge;
	var _srightedge = yymax(t_ibbox[0].u, yymax(t_ibbox[1].u, t_ibbox[2].u));
	var _stopedge = yymin(t_ibbox[0].v, yymin(t_ibbox[1].v, t_ibbox[2].v));
	var  _sbottomedge = yymax(t_ibbox[0].v, yymax(t_ibbox[1].v, t_ibbox[2].v));

	var mx = ((xl+xr) / 2);
	var my = ((yl+yr) / 2);
	var ww = ((xr - xl) / 2);
	var hh = ((yr - yl) / 2);

	
	for (var i = l; i <= r; i++)
	{
		var u2 = (((i)-bb2[0].x) * tuscalex + sleftedge) + (((t)-bb2[0].y) * tuscaley);
		var v2 = (((t)-bb2[0].y) * tvscaley + stopedge) + (((i)-bb2[0].x) * tvscalex);

		for (var j = t; j <= b; j++, v2 += tvscaley, u2 += tuscaley)
		{
			if (Sqr((i - mx) / ww) + Sqr((j - my) / hh) > 1) continue;   // outside ellipse

			if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
			if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

			if (_ColMaskSet(~~u2, ~~v2, tMaskData,sprwidth))
				return true;


		}
	}
	return false;

};

yySprite.prototype.PreciseCollisionTilemap = function (img1, bb1, _x1, _y1, scale1x, scale1y, angle1, bb2, t_ibbox,tMaskData,sprwidth) {


	// Compute overlapping bounding box
	var l = yymax(bb1.left, bb2[0].x);

	l = Math.floor(l) + 0.5;

	var r = yymin(bb1.right, bb2[2].x);
	var t = yymax(bb1.top, bb2[0].y);

	t = Math.floor(t) + 0.5;
	var b = yymin(bb1.bottom, bb2[2].y);


	var leftedge = this.bbox.left;
	var rightedge = this.bbox.right + 1.0;
	var topedge = this.bbox.top;
	var bottomedge = this.bbox.bottom + 1.0;


	if (this.colcheck === yySprite.PRECISE)
	{
	    //If you have precise collisions you can't have collisions outside the texture - you can only do that with rectangle collisions where it is permissible to have i_bbox.left<0 etc
	    if (leftedge < 0) 
	        leftedge = 0;
	    if (rightedge > this.width)
	        rightedge = this.width;

	    if (topedge < 0)
	        topedge = 0;
	    if (bottomedge > this.height)
	        bottomedge = this.height;

	}
	var hasrot1 = false;

	if (angle1 > g_GMLMathEpsilon || angle1 < -g_GMLMathEpsilon)
		hasrot1 = true;

	var sleftedge = t_ibbox[0].u;
	var stopedge = t_ibbox[0].v;

	scale1x = 1.0 / scale1x;
	scale1y = 1.0 / scale1y;

	var tuscalex = (t_ibbox[1].u - t_ibbox[0].u) / (bb2[1].x - bb2[0].x);
	var tuscaley = (t_ibbox[3].u - t_ibbox[0].u) / (bb2[3].y - bb2[0].y);

	var tvscalex = (t_ibbox[1].v - t_ibbox[0].v) / (bb2[1].x - bb2[0].x);
	var tvscaley = (t_ibbox[3].v - t_ibbox[0].v) / (bb2[3].y - bb2[0].y);

	var maskdata = null;
	var maskdata2 = null;

	maskdata = this.colmask[img1];//GetMaskData(img1);
	maskdata2 = tMaskData;

	var _sleftedge = yymin(t_ibbox[0].u, yymin(t_ibbox[1].u, t_ibbox[2].u));// sleftedge;
	var _srightedge = yymax(t_ibbox[0].u, yymax(t_ibbox[1].u, t_ibbox[2].u));
	var _stopedge = yymin(t_ibbox[0].v, yymin(t_ibbox[1].v, t_ibbox[2].v));
	var  _sbottomedge = yymax(t_ibbox[0].v, yymax(t_ibbox[1].v, t_ibbox[2].v));
	var ourwidth = this.GetWidth();

	if (!hasrot1 )
	{

		var du1 = scale1x;
		var du2 = tuscalex;
		var u1 = ((l - _x1) * scale1x + this.GetXOrigin());
		
		for (var i = l; i < r; i += 1.0, u1 += du1)
		{
			var u2 = (((i) - bb2[0].x) * tuscalex + sleftedge) + (((t) - bb2[0].y) * tuscaley);
			var v2 = (((t) - bb2[0].y) * tvscaley + stopedge) + (((i) - bb2[0].x) * tvscalex);

			if ((u1 < leftedge) || (u1 >= rightedge)) continue;

			var u1i = ~~u1;
			
			for (var j = t; j < b; j += 1.0, v2 += tvscaley, u2 += tuscaley)
			{
				if (maskdata != null)
				{
					var v1 = ((j - _y1) * scale1y + this.GetYOrigin());

					if ((v1 < topedge) || (v1 >= bottomedge)) continue;
					if (!_ColMaskSet(u1i, ~~v1, maskdata,ourwidth))
						continue;
				}

				if (maskdata2 != null)
				{
					if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
					if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

					if (!_ColMaskSet(~~u2, ~~v2, maskdata2,sprwidth))
						continue;

				}
				return true;
			}
		}
	}
	else
	{
		var ss1, cc1,  u1,  v1;

		// "Do Everything" case - rotation AND scaling!
		if (hasrot1)
		{
			ss1 = Math.sin(-angle1 * Pi / 180.0);
			cc1 = Math.cos(-angle1 * Pi / 180.0);
		}



		for (var i = l; i < r; i += 1.0)
		{
			
			var u2 = (((i) - bb2[0].x) * tuscalex + sleftedge) + (((t) - bb2[0].y) * tuscaley);
			var v2 = (((t) - bb2[0].y) * tvscaley + stopedge) + (((i) - bb2[0].x) * tvscalex);
			

			for (var j = t; j < b; j += 1.0, v2 += tvscaley, u2 += tuscaley)
			{

				u1 = ((cc1 * (i - _x1) + ss1 * (j - _y1)) * scale1x + this.GetXOrigin());
				if ((u1 < leftedge) || (u1 >= rightedge)) continue;
				v1 = ((cc1 * (j - _y1) - ss1 * (i - _x1)) * scale1y + this.GetYOrigin());
				

				if ((v1 < topedge) || (v1 >= bottomedge)) continue;
				if (maskdata != null)
				{
					if (!_ColMaskSet(~~u1, ~~v1, maskdata,ourwidth))
						continue;
				}

				if (maskdata2 != null)
				{
					if ((v2 < _stopedge) || (v2 >= _sbottomedge)) continue;
					if ((u2 < _sleftedge) || (u2 >= _srightedge)) continue;

					if (!_ColMaskSet(~~u2, ~~v2, maskdata2, sprwidth))
						continue;

				}
				return true;
			}
		}
	}

	return false;
};
// #############################################################################################
/// Function:<summary>
///				Returns whether img1 of the sprite at position (x1,y1), scaled with scalex,scaley 
///				and rotated over angle intersects the point
///          </summary>
///
/// In:		 <param name="img1"></param>
///			 <param name="bb1"></param>
///			 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="scalex"></param>
///			 <param name="scaley"></param>
///			 <param name="angle"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.PreciseCollisionPoint = function (_img1, _bb1, _x1, _y1, _scalex, _scaley, _angle, _x, _y) {
	var xx, yy;

	if (!this.maskcreated) return true;             // When no mask it is always true
	if (this.numb <= 0) return false;
	_img1 = _img1 % this.colmask.length;
	if (_img1 < 0) _img1 = _img1 + this.colmask.length;
    
	_x1 -= 0.5; //offset as native runner
	_y1 -= 0.5;

	if (Math.abs(_angle) < 0.0001)
	{
		xx = Math.floor((_x - _x1) / _scalex + this.xOrigin);
		yy = Math.floor((_y - _y1) / _scaley + this.yOrigin);
	}
	else
	{
		var ss = Math.sin(-_angle * Math.PI / 180.0);
		var cc = Math.cos(-_angle * Math.PI / 180.0);
		xx = Math.floor((cc * (_x - _x1) + ss * (_y - _y1)) / _scalex + this.xOrigin);
		yy = Math.floor((cc * (_y - _y1) - ss * (_x - _x1)) / _scaley + this.yOrigin);
	}

	if ((xx < 0) || (xx >= this.width)) return false;
	if ((yy < 0) || (yy >= this.height)) return false;
	return this.colmask[_img1][xx + (yy * this.width)];
};


// #############################################################################################
/// Function:<summary>
///				Returns whether img1 of the sprite at position (x1,y1), scaled with scale intersects the rectangle
///          </summary>
///
/// In:		 <param name="img1"></param>
///			 <param name="bb1"></param>
///			 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="scalex"></param>
///			 <param name="scaley"></param>
///			 <param name="angle"></param>
///			 <param name="rr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.PreciseCollisionRectangle = function (_img1, _bb1, _x1, _y1, _scalex, _scaley, _angle, _rr) {
	if (!this.maskcreated) return true; 		// When no mask it is always true


	// Correct the subimage
	if (this.numb <= 0) return false;
	_img1 = _img1 % this.colmask.length;
	if (_img1 < 0) { _img1 = _img1 + this.colmask.length; }


	// Compute overlapping bounding box
	var l = yymax(_bb1.left, _rr.left);
	var r = yymin(_bb1.right, _rr.right);
	var t = yymax(_bb1.top, _rr.top);
	var b = yymin(_bb1.bottom, _rr.bottom);

	_x1 -= 0.5;  //offset as native runner
	_y1 -= 0.5;

	if ((_scalex == 1) && (_scaley == 1) && (Math.abs(_angle) < 0.0001))
	{
		// Case without scaling
		for (var i = l; i <= r; i++)
		{
			for (var j = t; j <= b; j++)
			{
				var xx = ~~(i - _x1 + this.xOrigin);
				var yy = ~~(j - _y1 + this.yOrigin);
				if ((xx < 0) || (xx >= this.width)) continue;
				if ((yy < 0) || (yy >= this.height)) continue;
				if (this.colmask[_img1][xx + (yy * this.width)] == true) return true;
			}
		}
	}
	else
	{
		// Case with scaling and or rotating
		var ss = Math.sin(-_angle * Pi / 180.0);
		var cc = Math.cos(-_angle * Pi / 180.0);
		var onescalex = 1.0 / _scalex;
		var onescaley = 1.0 / _scaley;
		for (var i = l; i <= r; i++)
		{
			for (var j = t; j <= b; j++)
			{
				var xx = Math.floor((cc * (i - _x1) + ss * (j - _y1)) * onescalex + this.xOrigin);
				var yy = Math.floor((cc * (j - _y1) - ss * (i - _x1)) * onescaley + this.yOrigin);
				if ((xx < 0) || (xx >= this.width)) continue;
				if ((yy < 0) || (yy >= this.height)) continue;
				if (this.colmask[_img1][xx + (yy * this.width)]) return true;
			}
		}
	}

	return false;
};


// #############################################################################################
/// Function:<summary>
/// Returns whether img1 of the sprite at position (x1,y1), scaled with scale
/// intersects the ellipse
///          </summary>
///
/// In:		 <param name="img1"></param>
///			 <param name="bb1"></param>
///			 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="scalex"></param>
///			 <param name="scaley"></param>
///			 <param name="angle"></param>
///			 <param name="rr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.PreciseCollisionEllipse = function (_img1, _bb1, _x1, _y1, _scalex, _scaley, _angle, _rr) {
	var i, j;
	if (!this.maskcreated) return true; 		// When no mask it is always true

	// Correct the subimage
	if (this.numb <= 0) return false;
	_img1 = _img1 % this.colmask.length;
	if (_img1 < 0) _img1 = _img1 + this.colmask.length;


	// Compute overlapping bounding box
	var l = yymax(_bb1.left, _rr.left);
	var r = yymin(_bb1.right, _rr.right);
	var t = yymax(_bb1.top, _rr.top);
	var b = yymin(_bb1.bottom, _rr.bottom);

	var mx = ((_rr.right + _rr.left) / 2);
	var my = ((_rr.bottom + _rr.top) / 2);
	var ww = 1.0 / ((_rr.right - _rr.left) / 2);
	var hh = 1.0 / ((_rr.bottom - _rr.top) / 2);
	var pMask = this.colmask[_img1];

    var tmp;
	if ((_scalex == 1) && (_scaley == 1) && (Math.abs(_angle) < 0.0001))
	{
		// Case without scaling
		for (i = l; i <= r; i++)
		{
			tmp = (i - mx) * ww;
			var sqrxx = tmp*tmp;//Sqr((i - mx) * ww);
			var xx = i - _x1 + this.xOrigin;
			if ((xx < 0) || (xx >= this.width)) continue;

			for (j = t; j <= b; j++)
			{
				tmp = (j - my) * hh;
				//if (sqrxx + Sqr((j - my) * hh) > 1) continue;   // outside ellipse
				if (sqrxx + (tmp*tmp) > 1) continue;   // outside ellipse

				var yy = j - _y1 + this.yOrigin;
				if ((yy < 0) || (yy >= this.height)) continue;

				if (pMask[xx + (yy * this.width)]) return true;
			}
		}
	}
	else
	{
		// Case with scaling
		var ss = Math.sin(-_angle * Math.PI / 180.0);
		var cc = Math.cos(-_angle * Math.PI / 180.0);
		var onescalex = 1.0 / _scalex;
		var onescaley = 1.0 / _scaley;

		for (i = l; i <= r; i++)
		{
			// common loop terms.
			var ix1 = (i - _x1);
			var cc_i_x1 = cc * ix1;
			var ss_i_x1 = ss * ix1;
			var tmp = (i - mx) * ww;
			var sq1 = tmp*tmp;//Sqr((i - mx) * ww);

			for (j = t; j <= b; j++)
			{
				var jmy = (j - my) * hh;
				if ((sq1 + (jmy * jmy)) > 1) continue;   // outside ellipse

				var j_y1 = j - _y1;
				var xx = ~ ~(((cc_i_x1 + ss * j_y1) * onescalex) + this.xOrigin);
				if ((xx < 0) || (xx >= this.width)) continue;

				var yy = ~ ~(((cc * j_y1 - ss_i_x1) * onescaley) + this.yOrigin);
				if ((yy < 0) || (yy >= this.height)) continue;

				if (pMask[xx + (yy * this.width)]) return true;
			}
		}
	}

	return false;
};


// #############################################################################################
/// Function:<summary>
///				Returns whether img1 of the sprite at position (x1,y1), scaled with scale1
///				intersects the second sprite inside the bounding boxes
///          </summary>
///
/// In:		 <param name="_img1"></param>
///			 <param name="_bb1"></param>
///			 <param name="_x1"></param>
///			 <param name="_y1"></param>
///			 <param name="_scale1x"></param>
///			 <param name="_scale1y"></param>
///			 <param name="_angle1"></param>
///			 <param name="_spr"></param>
///			 <param name="_img2"></param>
///			 <param name="_bb2"></param>
///			 <param name="_x2"></param>
///			 <param name="_y2"></param>
///			 <param name="_scale2x"></param>
///			 <param name="_scale2y"></param>
///			 <param name="_angle2"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.PreciseCollision = function (_img1, _bb1, _x1, _y1, _scale1x, _scale1y, _angle1, _pSpr, _img2, _bb2, _x2, _y2, _scale2x, _scale2y, _angle2) {
	// Some easy cases
	if (_pSpr == null) return false;

	// Correct the subimage
	if (this.numb <= 0) return false;
	if (_pSpr.numb <= 0) return false;

	if (this.colmask.length > 0) _img1 = _img1 % this.colmask.length; //DCL added if()
	if (_img1 < 0) { _img1 = _img1 + this.colmask.length; ; }
	if (_pSpr.colmask.length > 0) _img2 = _img2 % _pSpr.colmask.length; //DCL added if()
	if (_img2 < 0) { _img2 = _img2 + _pSpr.colmask.length; }


	_scale1x = 1.0 / _scale1x;
	_scale1y = 1.0 / _scale1y;
	_scale2x = 1.0 / _scale2x;
	_scale2y = 1.0 / _scale2y;

	// Compute overlapping bounding box
	var l = yymax(_bb1.left, _bb2.left);

	l = Math.floor(l) + 0.5;

	var r = yymin(_bb1.right, _bb2.right);
	var t = yymax(_bb1.top, _bb2.top);

	t = Math.floor(t) + 0.5;
	var b = yymin(_bb1.bottom, _bb2.bottom);


	var leftedge = this.bbox.left;
	var rightedge = this.bbox.right + 1.0;
	var topedge = this.bbox.top;
	var bottomedge = this.bbox.bottom + 1.0;


	if (this.colcheck === yySprite.PRECISE)
	{
	    //If you have precise collisions you can't have collisions outside the texture - you can only do that with rectangle collisions where it is permissible to have i_bbox.left<0 etc
	    if (leftedge < 0) 
	        leftedge = 0;
	    if (rightedge > this.width)
	        rightedge = this.width;

	    if (topedge < 0)
	        topedge = 0;
	    if (bottomedge > this.height)
	        bottomedge = this.height;

	}
	var sleftedge = _pSpr.bbox.left;
	var srightedge = _pSpr.bbox.right+1.0;
	var stopedge = _pSpr.bbox.top;
	var sbottomedge = _pSpr.bbox.bottom + 1.0;
	var spr = _pSpr;
	if (spr.colcheck === yySprite.PRECISE)
	{
	    if (sleftedge < 0)
	        sleftedge = 0;
	    if (srightedge > spr.width)
	        srightedge = spr.width;

	    if (stopedge < 0)
	        stopedge = 0;
	    if (sbottomedge > spr.height)
	        sbottomedge = spr.height;
	}

	var hasrot1 = false; 
	var hasrot2 = false;

	if (_angle1 > g_GMLMathEpsilon || _angle1 < -g_GMLMathEpsilon)
	    hasrot1 = true;
	if (_angle2 > g_GMLMathEpsilon || _angle2 < -g_GMLMathEpsilon)
	    hasrot2 = true;

	
	if ( !hasrot1 && !hasrot2 )
	{
       

	    var du1 = _scale1x;
	    var du2 = _scale2x;
	    var u1 = ((l- _x1) * _scale1x + this.xOrigin);
	    var u2 = ((l - _x2) * _scale2x + spr.xOrigin);
	    for (var i = l ; i < r; i += 1.0, u1 += du1, u2 += du2)
	    {
			
	        if ((u1 < leftedge) || (u1 >= rightedge)) continue;

			
	        if ((u2 < sleftedge) || (u2 >= srightedge)) continue;

	        var u1i = ~~u1 ;
	        var u2i = ~~u2 ;
			
			
	        for (var j = t ; j < b; j += 1.0)
	        {	
	            if (this.colcheck === yySprite_CollisionType.PRECISE)
	            {

	                var v1 = ((j - _y1) * _scale1y + this.yOrigin);

	                if ((v1 < topedge) || (v1 >= bottomedge)) continue;
	                if (this.maskcreated) {
	                    if (!this.colmask[_img1][u1i + (~~(v1) * this.width)]) continue;
	                }
	            }
				
	            if (spr.colcheck === yySprite_CollisionType.PRECISE)
	            {
	                var v2 = ((j - _y2) * _scale2y + spr.yOrigin);


	                if ((v2 < stopedge) || (v2 >= sbottomedge)) continue;
	                if (spr.maskcreated) {
	                    if (!spr.colmask[_img2][u2i + (~~(v2) * spr.width)]) continue;
	                }
	            }
	            return true;
	        }
	    }
	}
	else
	{
	    var ss1, cc1, ss2, cc2,u1,u2,v1,v2;

	    // "Do Everything" case - rotation AND scaling!
	    if (hasrot1)
	    {
	        ss1 = Math.sin(-_angle1 * Pi / 180.0);
	        cc1 = Math.cos(-_angle1 * Pi / 180.0);
	    }
	    if (hasrot2)
	    {
	        ss2 = Math.sin(-_angle2 * Pi / 180.0);
	        cc2 = Math.cos(-_angle2 * Pi / 180.0);
	    }


	    for (var i = l ; i < r; i += 1.0)
	    {
	        if (!hasrot1)
	        {
	            u1 = ((i - _x1) * _scale1x + this.xOrigin);
	            if ((u1 < leftedge) || (u1 >= rightedge)) continue;
	        }

	        if (!hasrot2)
	        {
	            u2 = ((i - _x2) * _scale2x + spr.xOrigin);
	            if ((u2 < sleftedge) || (u2 >= srightedge)) continue;
	        }

	        for (var j = t ; j < b; j += 1.0)
	        {
	            if (hasrot1)
	            {
	                u1 = ((cc1 * (i - _x1) + ss1 * (j - _y1)) * _scale1x + this.xOrigin);
	                if ((u1 < leftedge) || (u1 >= rightedge)) continue;
	                v1 = ((cc1 * (j - _y1) - ss1 * (i - _x1)) * _scale1y + this.yOrigin);
	            }
	            else
	            {
	                v1 = ((j - _y1) * _scale1y + this.yOrigin);
	            }

	            if ((v1 < topedge) || (v1 >= bottomedge)) continue;
	            if (this.colcheck === yySprite_CollisionType.PRECISE)
	            {
	                if (this.maskcreated) 
	                {
	                    if (!this.colmask[_img1][~~(u1) + (~~(v1) * this.width)]) continue;
	                }
	            }

	            if (hasrot2)
	            {
	                u2 = ((cc2 * (i - _x2) + ss2 * (j - _y2)) * _scale2x + spr.xOrigin);
	                if ((u2 < sleftedge) || (u2 >= srightedge)) continue;
	                v2 = ((cc2 * (j - _y2) - ss2 * (i - _x2)) * _scale2y + spr.yOrigin);
	            }
	            else
	            {
	                v2 = ((j - _y2) * _scale2y + spr.yOrigin);
	            }

				
	            if ((v2 <stopedge) || (v2 >= sbottomedge)) continue;
	            if (spr.colcheck === yySprite_CollisionType.PRECISE)
	            {
	                if (spr.maskcreated) 
	                {
	                    if (!spr.colmask[_img2][~~(u2) + (~~(v2) * spr.width)]) continue;
	                }
	            }
	            return true;
	        }
	    }
	}

	return false;
};


yySprite.prototype.OrigPreciseCollision = function (_img1, _bb1, _x1, _y1, _scale1x, _scale1y, _angle1, _pSpr, _img2, _bb2, _x2, _y2, _scale2x, _scale2y, _angle2) {
    // Some easy cases
    if (_pSpr == null) return false;

    // Correct the subimage
    if (this.numb <= 0) return false;
    if (_pSpr.numb <= 0) return false;

    if (this.colmask.length > 0) _img1 = _img1 % this.colmask.length; //DCL added if()
    if (_img1 < 0) { _img1 = _img1 + this.colmask.length;; }
    if (_pSpr.colmask.length > 0) _img2 = _img2 % _pSpr.colmask.length; //DCL added if()
    if (_img2 < 0) { _img2 = _img2 + _pSpr.colmask.length; }


    _scale1x = 1.0 / _scale1x;
    _scale1y = 1.0 / _scale1y;
    _scale2x = 1.0 / _scale2x;
    _scale2y = 1.0 / _scale2y;

    // Compute overlapping bounding box
    var l = yymax(_bb1.left, _bb2.left);
    var r = yymin(_bb1.right, _bb2.right);
    var t = yymax(_bb1.top, _bb2.top);
    var b = yymin(_bb1.bottom, _bb2.bottom);

    // No rotation or scaling.
    if ((_scale1x == 1) && (_scale2x == 1) && (_scale1y == 1) && (_scale2y == 1) && (_angle1 == 0) && (_angle2 == 0)) {
        for (var i = l; i <= r; i++) {
            for (var j = t; j <= b; j++) {
                var xx = i - _x1 + this.xOrigin;
                var yy = j - _y1 + this.yOrigin;
                if ((xx < 0) || (xx >= this.width)) continue;
                if ((yy < 0) || (yy >= this.height)) continue;
                if (this.maskcreated) {
                    if (!this.colmask[_img1][xx + (yy * this.width)]) continue;
                }
                xx = i - _x2 + _pSpr.xOrigin;
                yy = j - _y2 + _pSpr.yOrigin;
                if ((xx < 0) || (xx >= _pSpr.width)) continue;
                if ((yy < 0) || (yy >= _pSpr.height)) continue;
                if (_pSpr.maskcreated) {
                    if (!_pSpr.colmask[_img2][xx + (yy * _pSpr.width)]) continue;
                }
                return true;
            }
        }
    }
        // Scaling but no rotation
    else if ((_angle1 == 0) && (_angle2 == 0)) {
        for (var i = l; i <= r; i++) {
            for (var j = t; j <= b; j++) {
                var xx = Math.floor(((i - _x1) * _scale1x + this.xOrigin));
                var yy = Math.floor(((j - _y1) * _scale1y + this.yOrigin));
                if ((xx < 0) || (xx >= this.width)) continue;
                if ((yy < 0) || (yy >= this.height)) continue;
                if (this.maskcreated) {
                    if (!this.colmask[_img1][xx + (yy * this.width)]) continue;
                }
                xx = Math.floor(((i - _x2) * _scale2x + _pSpr.xOrigin));
                yy = Math.floor(((j - _y2) * _scale2y + _pSpr.yOrigin));
                if ((xx < 0) || (xx >= _pSpr.width)) continue;
                if ((yy < 0) || (yy >= _pSpr.height)) continue;
                if (_pSpr.maskcreated) {
                    if (!_pSpr.colmask[_img2][xx + (yy * _pSpr.width)]) continue;
                }
                return true;
            }
        }
    }
    else {
        // "Do Everything" case - rotation AND scaling!
        //	    	_angle1 = _angle1 % 360;
        //	    	_angle2 = _angle2 % 360;
        var ss1 = Math.sin(-_angle1 * Pi / 180);
        var cc1 = Math.cos(-_angle1 * Pi / 180);
        var ss2 = Math.sin(-_angle2 * Pi / 180);
        var cc2 = Math.cos(-_angle2 * Pi / 180);

        for (var i = l; i <= r; i++) {
            for (var j = t; j <= b; j++) {
                var xx = Math.floor(((cc1 * (i - _x1) + ss1 * (j - _y1)) * _scale1x + this.xOrigin));
                var yy = Math.floor(((cc1 * (j - _y1) - ss1 * (i - _x1)) * _scale1y + this.yOrigin));
                if ((xx < 0) || (xx >= this.width)) continue;
                if ((yy < 0) || (yy >= this.height)) continue;

                if (this.maskcreated) {
                    if (!this.colmask[_img1][xx + (yy * this.width)]) continue;
                }

                xx = Math.floor(((cc2 * (i - _x2) + ss2 * (j - _y2)) * _scale2x + _pSpr.xOrigin));
                yy = Math.floor(((cc2 * (j - _y2) - ss2 * (i - _x2)) * _scale2y + _pSpr.yOrigin));
                if ((xx < 0) || (xx >= _pSpr.width)) continue;
                if ((yy < 0) || (yy >= _pSpr.height)) continue;

                if (_pSpr.maskcreated) {
                    if (!_pSpr.colmask[_img2][xx + (yy * _pSpr.width)]) continue;
                }
                return true;
            }
        }
    }

    return false;
};

// #############################################################################################
/// Function:<summary>
///				Returns whether img1 of the sprite at position (x1,y1), scaled with scale intersects the line segment
///          </summary>
///
/// In:		 <param name="img1"></param>
///			 <param name="bb1"></param>
///			 <param name="x1"></param>
///			 <param name="y1"></param>
///			 <param name="scalex"></param>
///			 <param name="scaley"></param>
///			 <param name="angle"></param>
///			 <param name="xl"></param>
///			 <param name="yl"></param>
///			 <param name="xr"></param>
///			 <param name="yr"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.PreciseCollisionLine = function (_img1, _bb1, _x1, _y1, _scalex, _scaley, _angle, _xl, _yl, _xr, _yr) {

	if (!this.maskcreated)
	{
		return true; 		// When no mask it is always true
	}

	// Correct the subimage
	if (this.numb <= 0)
	{
		return false;
	}
	_img1 = _img1 % this.colmask.length;
	if (_img1 < 0)
	{
		_img1 = _img1 + this.colmask.length;
	}


	// Vertical or horizontal or pixel
	if ((_xl == _xr) || (_yl == _yr))
	{
		var rc = new YYRECT();
		rc.left = _xl;
		rc.top = yymin(_yl, _yr);
		rc.right = _xr;
		rc.bottom = yymax(_yl, _yr);

		return this.PreciseCollisionRectangle(_img1, _bb1, _x1, _y1, _scalex, _scaley, _angle, rc);
	}

	var ss = Math.sin(-_angle * Math.PI / 180.0);
	var cc = Math.cos(-_angle * Math.PI / 180.0);

	_x1 -= 0.5; //offset as native runner
	_y1 -= 0.5;

	// Check shallow
	if (Math.abs(_xr - _xl) >= Math.abs(_yr - _yl))
	{
		// make sure line runs from left to right
		if (_xr < _xl)
		{
			var val = _xr;
			_xr = _xl;
			_xl = val;

			val = _yr;
			_yr = _yl;
			_yl = val;
		}

		var dd = (_yr - _yl) / (_xr - _xl);
		// now check the relevant pixels

		for (var i = yymax(_bb1.left, _xl); i <= yymin(_bb1.right, _xr); i++)
		{
			var xx = Math.floor((cc * (i - _x1) + ss * (_yl + (i - _xl) * dd - _y1)) / _scalex + this.xOrigin);
			var yy = Math.floor((cc * (_yl + (i - _xl) * dd - _y1) - ss * (i - _x1)) / _scaley + this.yOrigin);
			if ((xx < 0) || (xx >= this.width)) continue;
			if ((yy < 0) || (yy >= this.height)) continue;
			if (this.colmask[_img1][xx + (yy * this.width)]) return true;
		}
	}
	else
	{
		// make sure line runs from top to bottom
		if (_yr < _yl)
		{
			var val = _yr;
			_yr = _yl;
			_yl = val;

			val = _xr;
			_xr = _xl;
			_xl = val;
		}
		var dd = (_xr - _xl) / (_yr - _yl);

		// now check the relevant pixels
		for (var i = yymax(_bb1.top, _yl); i <= yymin(_bb1.bottom, _yr); i++)
		{
			var xx = Math.floor((cc * (_xl + (i - _yl) * dd - _x1) + ss * (i - _y1)) / _scalex + this.xOrigin);
			var yy = Math.floor((cc * (i - _y1) - ss * (_xl + (i - _yl) * dd - _x1)) / _scaley + this.yOrigin);
			if ((xx < 0) || (xx >= this.width)) continue;
			if ((yy < 0) || (yy >= this.height)) continue;
			if (this.colmask[_img1][xx + (yy * this.width)]) return true;
		}
	}

	return false;
};

// #############################################################################################
/// Function:<summary>
///				Returns the texture page entry for the given index (if it exists)
///          </summary>
///
/// In:		 <param name="ind"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySprite.prototype.GetTPE = function(_ind) {

    if (this.numb <= 0) { 
        return null;
    }
	_ind = _ind % this.numb;

	if (_ind < 0) { 
	    _ind = _ind + this.numb;
	}
	
	if (this.ppTPE) {
	    return this.ppTPE[_ind];
	}
	return null;
};







// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function    yySpriteManager()
{
    this.Sprites = [];
}



// #############################################################################################
/// Function:<summary>
///             Add a texture to the "pool"
///          </summary>
///
/// In:		 <param name="_name">Name+path of texture to load</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySpriteManager.prototype.AddSprite = function (_pSprite) {
	var n = this.Sprites.length;
	this.Sprites[n] = _pSprite;
	return n;
};


// #############################################################################################
/// Function:<summary>
///             Get the number of sub-images in the selected sprite.
///          </summary>
///
/// In:		 <param name="_spr_number">Sprite to get the sub-image count of</param>
/// Out:	 <returns>
///				The number of sub-images, or 1 if not found
///			 </returns>
// #############################################################################################
yySpriteManager.prototype.GetImageCount = function (_spr_number) {
	var sprite = this.Sprites[_spr_number];
	if (!sprite) return null;
	if ((sprite.SWFTimeline !== null) && (sprite.SWFTimeline !== undefined)) {
	    return sprite.SWFTimeline.numFrames;
	}		
	return sprite.ppTPE.length;
};


// #############################################################################################
/// Function:<summary>
///             Get the actual sprite data.
///          </summary>
///
/// In:		 <param name="_spr_number">Sprite to get</param>
/// Out:	 <returns>
///				The sprite data or null
///			 </returns>
// #############################################################################################
yySpriteManager.prototype.Get = function (_spr_number) {
    if (Number.isNaN(_spr_number)) return null;
	if (_spr_number < 0 || _spr_number >= this.Sprites.length) return null;
	return this.Sprites[_spr_number];
};


yySpriteManager.prototype.Sprite_Find = function(_name)
{
	for(var i = 0; i < this.Sprites.length; i++)
	{
		if(this.Sprites[i].pName == _name)
		{
			return i;
		}
	}
	return -1;
};


// #############################################################################################
/// Function:<summary>
///          	Delete a sprite from the list
///          </summary>
///
/// In:		<param name="_id">sprite to delete</param>
///				
// #############################################################################################
yySpriteManager.prototype.Delete = function(_id) {
	var pSprite = this.Sprites[_id];
	if (pSprite != undefined) {
		var flush = true;
		for (var i = 0; i < pSprite.ppTPE.length; i++) {
			var pTPE = pSprite.ppTPE[i];
			if (!pTPE || !pTPE.texture) continue;
			var pTexture = pTPE.texture;
			if (!pTexture || !pTexture.webgl_textureid) continue;
			if (flush) {
				g_webGL.FlushAll();
				flush = false;
			}
			
			// Update state manager here 
			g_webGL.RSMan.ClearTexture(pTexture.webgl_textureid); 

			g_webGL.DeleteTexture(pTexture.webgl_textureid.Texture);
			pTexture.webgl_textureid = null;
		}
		this.Sprites[_id] = undefined;
	}
};


// #############################################################################################
/// Function:<summary>
///          	Parse the loaded SWF data
///             SWFs only supported for WebGL where we're expecting Uint8Arrays to exist, on IE it'll take exception
///          </summary>
// #############################################################################################
yySpriteManager.prototype.SWFLoad = function (_data) {

    try {
        // header consists of:
        // "rswf";
        // major.minor.version;
        // header size; (to offset to the start of the swf data
        // number of swfs;
        // size of each swf;                  
        var dataview = {
            data: new Uint8Array(_data),
            offset: 0
        };            
        function nextString (_dataview) {
            var separator = ";";
            var str = "";
            while (dataview.offset < _dataview.data.byteLength) {                    
                if (_dataview.data[dataview.offset] === separator.charCodeAt(0)) {
                    dataview.offset++;
                    break;
                }
                str = str + String.fromCharCode(_dataview.data[dataview.offset]);                    
                dataview.offset++;
            }
            return str;
        };
               
        var type = nextString(dataview);
        if (type == "rswf") {            
            
            // Make sure the SWF loading code knows what version it's dealing with
            var version = nextString(dataview),            
                versionInfo = version.split('.', 3);
                
            g_SWFVersion.major = parseInt(versionInfo[0]);
            g_SWFVersion.minor = parseInt(versionInfo[1]);
            g_SWFVersion.version = parseInt(versionInfo[2]);
            
            var headerSize = parseInt(nextString(dataview)),
                spriteCount = parseInt(nextString(dataview));

            // Get the version code, header size and sprite count
            this.swfSpriteData = [];

            // Extract each SWF            
            var dataOffset = headerSize;
            for (var i = 0; i < spriteCount; i++) {
                                               
                var swfSize = parseInt(nextString(dataview));
                this.swfSpriteData[i] = _data.slice(dataOffset, dataOffset + swfSize);                
                dataOffset += swfSize;
            }
        }
    }
    catch (e) {
        debug("Cannot parse SWF data " + e.message);        
    }
};


// #############################################################################################
/// Function:<summary>
///          	Parse the loaded Skeleton data
///          </summary>
// #############################################################################################
yySpriteManager.prototype.SkeletonLoad = function (_spineText) {

    function multiply_uint32(a, b) {
        var ah = (a >> 16) & 0xffff, al = a & 0xffff;
        var bh = (b >> 16) & 0xffff, bl = b & 0xffff;
        var high = ((ah * bl) + (al * bh)) & 0xffff;
        return ((high << 16) >>> 0) + (al * bl);
    };
    
    function spine_decode(_data) {
    
        var mod = Math.pow(2, 32);
        var decode = 6*7;
        var decodedData = "";
        for (var j = 0; j < _data.length; j++) {
        
            decodedData += String.fromCharCode((_data.charCodeAt(j) - (decode & 0xff)) & 0xff);
            decode = multiply_uint32(decode, (decode + 1) % mod) % mod;
        }
        return decodedData;
    };
    
    this.SkeletonData = [];

    try {
        // header consists of:
        // "skel";
        // major.minor.version; 
        // offset to the start of the spine data;
        // number of spine chunks;
        // size of each spine chunk;
        var splitArray = _spineText.split(';', 4);
        if (splitArray[0] == "skel") {

            var version = splitArray[1];                        
            var dataOffset = parseInt(splitArray[2]);
            var spineCount = parseInt(splitArray[3]);            
            
            var spineDataIndex = 4 + spineCount;
            splitArray = _spineText.split(';', spineDataIndex);

            // Get the version code, header size and sprite count
            for (var i = 0; i < spineCount; i++) {
            
                var spineDataSize = parseInt(splitArray[4 + i]);
            
                // Read out the data relating to this specific spine instance
                var spineData = _spineText.substr(dataOffset, spineDataSize);
                
                // Split into the header and the combined json and atlas data
                var spineSplit = spineData.split(';', 2);
                
                // Untie reading the data from specific indices
                var ind = 0;
                
                var jsonSize = parseInt(spineSplit[ind++]);
                var numTextures = parseInt(spineSplit[ind++]);                                
                var textureSizes = [];
                spineSplit = spineData.split(';', numTextures * 2 + 3);
                for (var t = 0; t < numTextures; t++)
                {
                    var texSize = new Object();
                    texSize.width = parseInt(spineSplit[ind++]);
                    texSize.height = parseInt(spineSplit[ind++]);
                    textureSizes[t] = texSize;                    
                }
                var jsonEncoded = spineSplit[ind].substr(0, jsonSize);
                var atlasEncoded = spineSplit[ind].substr(jsonSize, spineSplit[ind].length - jsonSize);

                // Store for later use when loading sprites
                this.SkeletonData.push({
                    json: spine_decode(base64_decode_unicode(jsonEncoded)),
                    atlas: spine_decode(base64_decode_unicode(atlasEncoded)),
                    numTextures: numTextures,
                    textureSizes: textureSizes                    
                });
                /*
                // Split into the header and the combined json and atlas data
                var spineSplit = spineData.split(';', 4);
                
                // Untie reading the data from specific indices
                var ind = 0;

                var jsonSize = parseInt(spineSplit[ind++]);
                var atlasWidth = parseInt(spineSplit[ind++]);
                var atlasHeight = parseInt(spineSplit[ind++]);
                
                var jsonEncoded = spineSplit[ind].substr(0, jsonSize);
                var atlasEncoded = spineSplit[ind].substr(jsonSize, spineSplit[ind].length - jsonSize);
                
                // Store for later use when loading sprites
                this.SkeletonData.push({
                    json: spine_decode(base64_decode_unicode(jsonEncoded)),
                    atlas: spine_decode(base64_decode_unicode(atlasEncoded)),
                    width: atlasWidth,
                    height: atlasHeight
                });*/
                
                dataOffset += spineDataSize;
            }
        }
    }
    catch (e) {
        debug("Cannot parse Spine data " + e.message);        
    }
};
