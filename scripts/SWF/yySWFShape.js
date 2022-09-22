var eDIType_Invalid = 0,
	eDIType_Shape = 1,
	eDIType_Bitmap = 2;

var eSWFFillType_Invalid = 0,
	eSWFFillType_Solid = 1,
	eSWFFillType_Gradient = 2,
	eSWFFillType_Bitmap = 3;
	
var eSWFGradType_Linear = 0,
	eSWFGradType_Radial = 1;

var g_SWFVersion = {
    major: 0,
    minor: 0,
    version: 1
};

// #############################################################################################
/// Function:<summary>
///             Initialise an SWF shape
///          </summary>
// #############################################################################################
/** @constructor */
function yySWFShape(_type, _id) {

    this.type = _type;
    this.id = _id;
};

// #############################################################################################
/// Function:<summary>
///             Parse shape data for this shape
///          </summary>
// #############################################################################################
yySWFShape.prototype.BuildShapeData = function (_dataView, _byteOffset, _littleEndian, _SWFDictionary) {

    this.minX = _dataView.getFloat32(_byteOffset, _littleEndian);
    _byteOffset += 4;
    this.maxX = _dataView.getFloat32(_byteOffset, _littleEndian);
    _byteOffset += 4;
    this.minY = _dataView.getFloat32(_byteOffset, _littleEndian);
    _byteOffset += 4;
    this.maxY = _dataView.getFloat32(_byteOffset, _littleEndian);
    _byteOffset += 4;
    
    var numStyleGroups = _dataView.getInt32(_byteOffset, _littleEndian);
    _byteOffset += 4;
    
    this.StyleGroups = [];
    for (var i = 0; i < numStyleGroups; i++) {
    
        var numFillStyles = _dataView.getInt32(_byteOffset, _littleEndian);
        _byteOffset += 4;        
        var numLineStyles = _dataView.getInt32(_byteOffset, _littleEndian);
        _byteOffset += 4;
        var numSubShapes = _dataView.getInt32(_byteOffset, _littleEndian);
        _byteOffset += 4;
        
        var styleGroup = {
            numFillStyles: numFillStyles,
            numLineStyles: numLineStyles,
            numSubShapes: numSubShapes
        };
        styleGroup.FillStyles = (numFillStyles > 0) ? [] : null;
        styleGroup.LineStyles = (numLineStyles > 0) ? [] : null;
        styleGroup.SubShapes = (numSubShapes > 0) ? [] : null;
        
        _byteOffset = this.BuildFillStyles(styleGroup, _dataView, _byteOffset, _littleEndian, _SWFDictionary);
        _byteOffset = this.BuildLineStyles(styleGroup, _dataView, _byteOffset, _littleEndian);
        _byteOffset = this.BuildSubShapes(styleGroup, _dataView, _byteOffset, _littleEndian);
        
        this.StyleGroups.push(styleGroup);
    }        
    return _byteOffset;
};


// #############################################################################################
/// Function:<summary>
///             Parse fill styles data
///          </summary>
// #############################################################################################
yySWFShape.prototype.BuildFillStyles = function (_styleGroup, _dataView, _byteOffset, _littleEndian, _SWFDictionary) {

    _styleGroup.FillStyles = [];
    for (var i = 0; i < _styleGroup.numFillStyles; i++)
	{
		// Read first in to determine type
		var filltype = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset += 4;
		
		var FillStyle = null;
		switch (filltype)
		{
			case eSWFFillType_Solid:
			{		
			    FillStyle = { type: eSWFFillType_Solid };
			    
				var red = _dataView.getUint8(_byteOffset, _littleEndian);
		        _byteOffset++;
				var green = _dataView.getUint8(_byteOffset, _littleEndian);
		        _byteOffset++;
		        var blue = _dataView.getUint8(_byteOffset, _littleEndian);
		        _byteOffset++;
		        var alpha = _dataView.getUint8(_byteOffset, _littleEndian);
		        _byteOffset++;
		        		        
		        FillStyle.col = (red | (green << 8) | (blue << 16) | (alpha << 24));		        
			}
			break;

			case eSWFFillType_Gradient:
			{
			    FillStyle = { type: eSWFFillType_Gradient };
			
				// Read in gradient type
				FillStyle.gradientType = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset += 4;
				
				FillStyle.tpeindex = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset += 4;

				// Read in matrix
				var transMat = [];
				for (var m = 0; m < 9; m++)
				{
				    transMat[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
					 _byteOffset += 4;
				}

				// Convert 3x3 to 4x4 matrix
				FillStyle.transMat = new Matrix();
				FillStyle.transMat.m[_11] = transMat[0];
				FillStyle.transMat.m[_21] = transMat[1];
				FillStyle.transMat.m[_41] = transMat[2];
				FillStyle.transMat.m[_12] = transMat[3];
				FillStyle.transMat.m[_22] = transMat[4];
				FillStyle.transMat.m[_42] = transMat[5];

				// Read in number of gradient records
				FillStyle.numRecords = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset += 4;

				// Now read in gradient records
				FillStyle.Records = [];
				for (var m = 0; m < FillStyle.numRecords; m++)
				{					
					var ratio = _dataView.getInt32(_byteOffset, _littleEndian);										
					_byteOffset += 4;

					var red = _dataView.getUint8(_byteOffset, _littleEndian);
		            _byteOffset++;
				    var green = _dataView.getUint8(_byteOffset, _littleEndian);
		            _byteOffset++;
		            var blue = _dataView.getUint8(_byteOffset, _littleEndian);
		            _byteOffset++;
		            var alpha = _dataView.getUint8(_byteOffset, _littleEndian);
		            _byteOffset++;
		        
		            FillStyle.Records.push({ 
		                ratio: ratio,
		                col: (red | (green << 8) | (blue << 16) | (alpha << 24))
		            });
				}
				// Now create texture from gradient info				
				FillStyle.TPE = null;
				//this.SetupGradientTexture(FillStyle);
			}
			break;

			case eSWFFillType_Bitmap:
			{
			    FillStyle = { type: eSWFFillType_Bitmap };

				// Read in bitmap fill type, character ID and character index
				FillStyle.bitmapFillType = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset += 4;				
				FillStyle.charID = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset += 4;

				// Look up ID in our dictionary to generate the character index
				FillStyle.charIndex = -1;
				for (var index = 0; index < _SWFDictionary.length; index++)
				{				
					if (_SWFDictionary[index].id === FillStyle.charID)
					{
						FillStyle.charIndex = index;
						break;
					}
				}

				// Read in matrix
				var transMat = [];
				for (var m = 0; m < 9; m++)
				{
				    transMat[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
					 _byteOffset += 4;
				}

				// Convert 3x3 to 4x4 matrix
				FillStyle.transMat = new Matrix();
				FillStyle.transMat.m[_11] = transMat[0];
				FillStyle.transMat.m[_21] = transMat[1];
				FillStyle.transMat.m[_41] = transMat[2];
				FillStyle.transMat.m[_12] = transMat[3];
				FillStyle.transMat.m[_22] = transMat[4];
				FillStyle.transMat.m[_42] = transMat[5];
			}
			break;
		}
		_styleGroup.FillStyles.push(FillStyle);		
	}
    return _byteOffset;
};

// #############################################################################################
/// Function:<summary>
///             Setup the gradient texture for use with the fill style
///          </summary>
// #############################################################################################
yySWFShape.prototype.SetupGradientTexture = function (_gradient) {

    if ((_gradient === null) || (_gradient === undefined)) {
		return;
	}
	
	// Constant definitions
	var GRAD_LINEAR_WIDTH = 256,
        GRAD_LINEAR_HEIGHT = 1,
        GRAD_RADIAL_WIDTH = 64,
        GRAD_RADIAL_HEIGHT = 64;
        
	var tempBuff = [];
	var width, height;
	
	switch (_gradient.gradientType)
	{
	    default: return; // gradient type not supported
	    
	    case eSWFGradType_Linear:
	    {		
	    	width = GRAD_LINEAR_WIDTH;
	    	height = GRAD_LINEAR_HEIGHT;
	    	
	    	for (var i = 0; i < GRAD_LINEAR_WIDTH; i++)
	    	{
	    		tempBuff[i] = this.SampleGradient(_gradient, i);
	    	}
	    }
	    break;
	    case eSWFGradType_Radial:
	    {
	    	width = GRAD_RADIAL_WIDTH;
	    	height = GRAD_RADIAL_HEIGHT;		

	    	var midX = (GRAD_RADIAL_WIDTH - 1) / 2;
	    	var midY = (GRAD_RADIAL_HEIGHT - 1) / 2;
	    	var radius = yymin(midX, midY);
	    	
	    	for (var j = 0; j < GRAD_RADIAL_HEIGHT; j++)
	    	{
	    		for (var i = 0; i < GRAD_RADIAL_WIDTH; i++)
	    		{
	    			var posX = i - midX;
	    			var posY = j - midY;
	    			var dist = Math.sqrt(posX * posX + posY * posY);
	    			dist /= radius;

	    			var ratio = 255 * dist;
	    			tempBuff[(j*GRAD_RADIAL_WIDTH)+i] = this.SampleGradient(_gradient, ratio);
	    		}			
	    	}
	    }
	    break;
	}

	_gradient.TPE = Graphics_AddImageFromData(width, height, tempBuff);
};


// #############################################################################################
/// Function:<summary>
///             Create an image from the data delivered
///          </summary>
// #############################################################################################
function Graphics_AddImageFromData(_w, _h, _data)
{	
    var singleimage = document.createElement(g_CanvasName);
    var pGraphics = singleimage.getContext('2d');
	Graphics_AddCanvasFunctions(pGraphics); 			// update for OUR functions.
	
    var glTexture = g_webGL.CreateTextureFromData(singleimage, _data, _w, _h);	

	// Create a texture page entry.
	var pTPE = new yyTPageEntry();	
	pTPE.x = 0;
	pTPE.y = 0;
	pTPE.w = glTexture.Width;
	pTPE.h = glTexture.Height;
	pTPE.XOffset = 0;
	pTPE.YOffset = 0;
	pTPE.CropWidth = pTPE.w;
	pTPE.CropHeight = pTPE.h;
	pTPE.ow = _w;
	pTPE.oh = _h;
	pTPE.tp = Graphics_AddImage(singleimage);	    
	pTPE.texture = g_Textures[pTPE.tp];
	pTPE.texture.webgl_textureid = glTexture;
	pTPE.texture.m_Width = singleimage.width;
	pTPE.texture.m_Height = singleimage.height;

	return pTPE;
}


// #############################################################################################
/// Function:<summary>
///             Generate a graident at the given ratio
///          </summary>
// #############################################################################################
yySWFShape.prototype.SampleGradient = function (_gradient, _ratio) {

	if (_gradient.numRecords <= 0) {
		return 0;
	}

	// Clamp ratio
	_ratio = (_ratio < 0) ? 0 : (_ratio > 255) ? 255 : _ratio;

	if (_ratio < _gradient.Records[0].ratio) {
		return _gradient.Records[0].col;
	}

	for (var i = 1; i < _gradient.numRecords; i++)
	{
		var pRecord = _gradient.Records[i];

		if (pRecord.ratio >= _ratio)
		{
			// Interpolate between this and the previous record
			var pPrevRecord = _gradient.Records[i-1];

			// Fixed-point insanity
			var blendfactor = 0;
			if (pRecord.ratio != pPrevRecord.ratio)
			{
				blendfactor = ((_ratio - pPrevRecord.ratio) << 8) / (pRecord.ratio - pPrevRecord.ratio);
			}

			var invblendfactor = 256 - blendfactor;

			var col = pRecord.col;
			var prevcol = pPrevRecord.col;

			var blendcolvals = [];
			blendcolvals[0] = ((col & 0xff) * blendfactor) >> 8;
			blendcolvals[1] = (((col >> 8) & 0xff) * blendfactor) >> 8;
			blendcolvals[2] = (((col >> 16) & 0xff) * blendfactor) >> 8;
			blendcolvals[3] = (((col >> 24) & 0xff) * blendfactor) >> 8;

			blendcolvals[0] += ((prevcol & 0xff) * invblendfactor) >> 8;
			blendcolvals[1] += (((prevcol >> 8) & 0xff) * invblendfactor) >> 8;
			blendcolvals[2] += (((prevcol >> 16) & 0xff) * invblendfactor) >> 8;
			blendcolvals[3] += (((prevcol >> 24) & 0xff) * invblendfactor) >> 8;

			// Finally re-pack
			var retcol = blendcolvals[0] | (blendcolvals[1] << 8) | (blendcolvals[2] << 16) | (blendcolvals[3] << 24);
			return retcol;
		}
	}

	// Okay we've fallen off the end of the array, so just use the last value
	return _gradient.Records[_gradient.numRecords - 1].col;
};

// #############################################################################################
/// Function:<summary>
///             Parse line styles data
///          </summary>
// #############################################################################################
yySWFShape.prototype.BuildLineStyles = function (_styleGroup, _dataView, _byteOffset, _littleEndian) {

    _styleGroup.LineStyles = [];
    for (var i = 0; i < _styleGroup.numLineStyles; i++)
	{
		var red = _dataView.getUint8(_byteOffset, _littleEndian);
		_byteOffset++;
		var green = _dataView.getUint8(_byteOffset, _littleEndian);
		_byteOffset++;
		var blue = _dataView.getUint8(_byteOffset, _littleEndian);
		_byteOffset++;
		var alpha = _dataView.getUint8(_byteOffset, _littleEndian);
		_byteOffset++;
		
		_styleGroup.LineStyles.push({ 
		    col: (red | (green << 8) | (blue << 16) | (alpha << 24))
		});		    
	}
	return _byteOffset;
};


// #############################################################################################
/// Function:<summary>
///             Parse sub shape data
///          </summary>
// #############################################################################################
yySWFShape.prototype.BuildSubShapes = function (_styleGroup, _dataView, _byteOffset, _littleEndian) {

    var i, m;

    _styleGroup.SubShapes = [];
    for (i = 0; i < _styleGroup.numSubShapes; i++) {
    
        var pSubShape = {};
        _styleGroup.SubShapes.push(pSubShape);
    
        pSubShape.FillStyle0 = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pSubShape.FillStyle1 = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pSubShape.LineStyle = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;

		pSubShape.numPoints = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pSubShape.numLines = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pSubShape.numTriangles = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;

		pSubShape.numLinePoints = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		pSubShape.numLineTriangles = _dataView.getInt32(_byteOffset, _littleEndian);
		_byteOffset+=4;
		
		if (g_SWFVersion.version >= 2) {
		
		    pSubShape.numAALines = _dataView.getInt32(_byteOffset, _littleEndian);
		    _byteOffset+=4;
		    pSubShape.numAAVectors = _dataView.getInt32(_byteOffset, _littleEndian);
		    _byteOffset+=4;
		}
		if (g_SWFVersion.version >= 3) {
		
		    pSubShape.numLineAALines = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;
			pSubShape.numLineAAVectors = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}

        pSubShape.Points = (pSubShape.numPoints > 0) ? [] : null;
        pSubShape.Line = (pSubShape.numLines > 0) ? [] : null;
        pSubShape.Triangles = (pSubShape.numTriangles > 0) ? [] : null;
        pSubShape.LinePoints = (pSubShape.numLinePoints > 0) ? [] : null;		
		pSubShape.LineTriangles = (pSubShape.numLineTriangles > 0) ? [] : null;		
		pSubShape.AALines = (pSubShape.numAALines) ? [] : null;
		pSubShape.AAVectors = (pSubShape.numAAVectors) ? [] : null;		
		pSubShape.LineAALines = (pSubShape.numLineAALines) ? [] : null;
		pSubShape.LineAAVectors = (pSubShape.numLineAAVectors) ? [] : null;

		for (m = 0; m < pSubShape.numPoints*2; m++) {
			pSubShape.Points[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}

		for (m = 0; m < pSubShape.numLines*2; m++) {
			pSubShape.Lines[m] = _dataView.getInt32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}

		for (m = 0; m < pSubShape.numTriangles*3; m++) {
			pSubShape.Triangles[m] = _dataView.getUint32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}

		for (m = 0; m < pSubShape.numLinePoints*2; m++) {
			pSubShape.LinePoints[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}

		for (m = 0; m < pSubShape.numLineTriangles*3; m++) {
			pSubShape.LineTriangles[m] = _dataView.getUint32(_byteOffset, _littleEndian);
			_byteOffset+=4;
		}
		
		if (g_SWFVersion.version >= 2) {
		
		    for (m = 0; m < pSubShape.numAALines*2; m++) {
		        pSubShape.AALines[m] = _dataView.getInt32(_byteOffset, _littleEndian);
		        _byteOffset+=4;
		    }
		    for (m = 0; m < pSubShape.numAAVectors*2; m++) {		    
		        pSubShape.AAVectors[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
		        _byteOffset+=4;
		    }
		}
		
		if (g_SWFVersion.version >= 3) {
		
		    for (m = 0; m < pSubShape.numLineAALines*2; m++) {
				pSubShape.LineAALines[m] = _dataView.getInt32(_byteOffset, _littleEndian);
				_byteOffset+=4;
			}
			for (m = 0; m < pSubShape.numLineAAVectors*2; m++) {
				pSubShape.LineAAVectors[m] = _dataView.getFloat32(_byteOffset, _littleEndian);
				_byteOffset+=4;
			}
		}
	}
	return _byteOffset;
};
