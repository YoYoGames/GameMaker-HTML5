// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yySWFBitmap.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************
// @if feature("swf")
var eBitmapType_JPEGNoHeader = 0,
	eBitmapType_JPEG = 1,
	eBitmapType_JPEGWithAlpha = 2,
	eBitmapType_PNG = 3,
	eBitmapType_GIF = 4,
	eBitmapType_Lossless8bit = 5,
	eBitmapType_Lossless15bit = 6,
	eBitmapType_Lossless24bit = 7,
	eBitmapType_Lossless8bitA = 8,
	eBitmapType_Lossless32bit = 9;

var eBitmapFillType_Repeat = 0,
	eBitmapFillType_Clamp = 1,
	eBitmapFillType_RepeatPoint = 2,
	eBitmapFillType_ClampPoint = 3;

// #############################################################################################
/// Function:<summary>
///             Initialise storage for an SWF Bitmap
///          </summary>
// #############################################################################################
/** @constructor */
function yySWFBitmap(_type, _id) {

    this.type = _type;
    this.id = _id;
    this.pTexture = null;
    this.tpeindex = -1;
};

// #############################################################################################
/// Function:<summary>
///             Parse shape data for this shape
///          </summary>
// #############################################################################################
yySWFBitmap.prototype.BuildBitmapData = function (_arrayBuffer, _dataView, _byteOffset, _littleEndian, _pJPEGTables) {

    var bitmapType = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	
	var width = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	var height = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset += 4;

	this.tpeindex = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset += 4;
	
	/*var imagedatalength = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	var alphadatalength = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
	var colourtablelength = _dataView.getInt32(_byteOffset, _littleEndian);
	_byteOffset+=4;
    
    // Store current byte offset for later re-alignment
    var bytePosition = _byteOffset;
    
    var byteData = new Uint8Array(_arrayBuffer);
    	
	var pImageData = (imagedatalength > 0) ? new Uint8Array(_arrayBuffer, _byteOffset, imagedatalength) : null;
	_byteOffset += imagedatalength;	
	var pAlphaData = (alphadatalength > 0) ? new Uint8Array(_arrayBuffer, _byteOffset, alphadatalength) : null;
	_byteOffset += alphadatalength;
	var pColourTableData = (colourtablelength > 0) ? new Uint8Array(_arrayBuffer, _byteOffset, colourtablelength) : null;
	_byteOffset += colourtablelength;
	
	this.SetupBitmapTexture(bitmapType, width, height, pImageData, pAlphaData, pColourTableData, _pJPEGTables);
	
	// Re-align
	_byteOffset = bytePosition + (((imagedatalength + alphadatalength + colourtablelength) + 3) & ~3);*/
	return _byteOffset;
};

// #############################################################################################
/// Function:<summary>
///             Works out the 16 bit value for two bytes ordered ab in the original data
///          </summary>
// #############################################################################################
yySWFBitmap.prototype.GetWordValue = function (_a, _b) {

    // Check endianness
    var b = new ArrayBuffer(4);
    var a = new Uint32Array(b);
    var c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] == 0xef) {
        return (((_a & 0xff) << 8) | (_b & 0xff)); // 'LE';
    }
    if (c[0] == 0xde) { 
        return (((_b & 0xff) << 8) | (_a & 0xff)); // 'BE';
    }
};

// #############################################################################################
/// Function:<summary>
///             Setup the actual bitmap texture
///          </summary>
// #############################################################################################
yySWFBitmap.prototype.ReadJPEGHeader = function (_imageData) {

    // We're looking for a header of the form:
    // BYTE SOI[2];          /* 00h  Start of Image Marker     */
    // BYTE APP0[2];         /* 02h  Application Use Marker    */
    // BYTE Length[2];       /* 04h  Length of APP0 Field      */
    // BYTE Identifier[5];   /* 06h  "JFIF" (zero terminated) Id String */
    // BYTE Version[2];      /* 07h  JFIF Format Revision      */
    // BYTE Units;           /* 09h  Units used for Resolution */
    // BYTE Xdensity[2];     /* 0Ah  Horizontal Resolution     */
    // BYTE Ydensity[2];     /* 0Ch  Vertical Resolution       */
    // BYTE XThumbnail;      /* 0Eh  Horizontal Pixel Count    */
    // BYTE YThumbnail;      /* 0Fh  Vertical Pixel Count      */       
    // However, we may run into a number of "Markers" before we get to that data and
    // may even reach an 0xFFD9 end of image (EOI) marker before the data we want
    // see http://www.media.mit.edu/pia/Research/deepview/exif.html
    try {
        do {                        
            if (_imageData[1] == 0xd9) { // end of data...
                _imageData = _imageData.subarray(2);
            }                        
            else if (_imageData[1] == 0xd8) {
                // Check for "JFIF"
                if ((_imageData[6] === 0x4a) && (_imageData[7] === 0x46) && (_imageData[8] === 0x49) && (_imageData[9] === 0x46))
                {                    
                    var w = this.GetWordValue(_imageData[14], _imageData[15]);
                    var h = this.GetWordValue(_imageData[16], _imageData[17]);
                    var jpg = { width: w, height: h, body: _imageData };
                    return jpg;
                }
                _imageData = _imageData.subarray(4 + this.GetWordValue(_imageData[4], _imageData[5]));
            }
            else {
                _imageData = _imageData.subarray(2 + this.GetWordValue(_imageData[2], _imageData[3]));
            }
        } while ((_imageData.byteLength >= 0) && (_imageData[0] == 0xff));
    }
    catch (e) {
        debug(e.message);
    }
    
    var jpg = { width: w, height: h, body: _imageData };
    return jpg;
};

// #############################################################################################
/// Function:<summary>
///             Setup the actual bitmap texture
///          </summary>
// #############################################################################################
yySWFBitmap.prototype.SetupBitmapTexture = function (_type, _width, _height, _imageData, _alphaData, _colourTableData, _pJPEGtables) {

	// Need to handle various flavours of formats and compression
	switch(_type)
	{	    	        
		case eBitmapType_GIF: {
		        this.pTexture = this.LoadRawTexture(_width, _height, _imageData, "gif");
		    }
		    break;
		case eBitmapType_PNG: {		
			    this.pTexture = this.LoadRawTexture(_width, _height, _imageData, "png");
			}
			break;
	
	    case eBitmapType_JPEG:
		case eBitmapType_JPEGNoHeader:
			{
			    this.pTexture = this.LoadRawTexture(_width, _height, _imageData, "jpeg");
				/*if (_pJPEGtables !== null)
				{
				    // create new ArrayBuffer and combine the two
				
					// Try gluing the data to the JPEG header
					// NOTE: this is untested as I haven't managed to generate a SWF with a valid split header
					unsigned char* pCombinedData = (unsigned char*)MemoryManager::Alloc(_JPEGtablesSize + _imagedatalength);
					memcpy(pCombinedData, _pJPEGtables, _JPEGtablesSize);
					memcpy(pCombinedData + _JPEGtablesSize, _pImageData, _imagedatalength);
					
					var img = new Image();
                    // Set the img src property using the data URL.
                    img.src = arrayBufferToDataUri(arrayBuffer);
				}
				else
				{
					// Just try without the tables (no idea if this will work)
					pTempBuffer = ReadJPEGFile(_pImageData, _imagedatalength, &width, &height, false);
				}*/
			}
			break;
		case eBitmapType_JPEGWithAlpha:
			{			
			    var jpg = this.ReadJPEGHeader(_imageData);
			    this.pTexture = this.LoadRawTexture(jpg.width, jpg.height, jpg.body, "jpeg", function (_pTPE) {
			    
			        // Alpha channel needs to be decompressed
                    var compressedData = String.fromCharCode.apply(null, new Uint16Array(_alphaData));
                    var compressedData = compressedData.split('').map(function(e) {
                        return e.charCodeAt(0);
                    });
                    
                    // Zlib manages to forcibly define its objects in an obfuscation breaking way...
                    var Zlib = window["Zlib"];
                    var inflate = new Zlib["Inflate"](compressedData);
                    var alphaChannel = inflate["decompress"]();
                    
			        // Add the alpha channel to the loaded texture
			        this.pTexture = ReplaceTextureAlpha(_pTPE, alphaChannel);			        
			    });
			}
			break;			
		case eBitmapType_Lossless8bit:	// fall through (same format as 8bitA)
		case eBitmapType_Lossless8bitA:
			{
			    this.pTexture = null;
			    		    
				// Not tested yet
				/*pTempBuffer = (unsigned char*)MemoryManager::Alloc(_width*_height*4);

				int srcwidth = (_width + 3) & ~3;	// need to take width padding into account

				unsigned int* pDest = (unsigned int*)pTempBuffer;
				for(int j = 0; j < _height; j++)
				{
					unsigned char* pSrc = &(_pImageData[srcwidth*j]);
					for(int i = 0; i < _width; i++)
					{
						unsigned char* pTableEntry = &(_pColourTableData[pSrc[i] * 4]);

						*pDest = (pTableEntry[3] << 24) | (pTableEntry[0] << 16) | (pTableEntry[1] << 8) | pTableEntry[2];
						pDest++;
					}
				}

				width = _width;
				height = _height;*/
			}
			break;
		case eBitmapType_Lossless15bit:	// fall through (should all be the same format (we store 15bit and 24bit data as 32bit)
		case eBitmapType_Lossless24bit:	// fall through (should all be the same format)
		case eBitmapType_Lossless32bit:
			{
			    var pTexture = new Image();
			    var glTexture = g_webGL.CreateTextureFromDataRGBA(pTexture, _imageData, _width, _height);	            
                
	            pTexture.webgl_textureid = glTexture;	            
                pTexture.m_Width = _width;
                pTexture.m_Height = _height;
	            
                this.pTexture = pTexture;
			}
			break;
		default: 
		    break;
	}
};

// #############################################################################################
/// Function:<summary>
///             Function to turn an array buffer into a DataURL form to use with image loading
///          </summary>
// #############################################################################################
yySWFBitmap.prototype.LoadRawTexture = function ( _width, _height, _imageData, _imageType, _onload, _onerror) {
	
	var chars = new Uint16Array(_imageData);
	var stringData = "";
    for (var i=0,l=chars.length; i<l; i++) {
        stringData += String.fromCharCode(chars[i]);
    }
	
	var encodedData = window.btoa(stringData);
	var dataURI = "data:image/" + _imageType + ";base64," + encodedData; // e.g. "data:image/jpeg;base64,"	
		
	var img = new Image();	            
	img.onload = function () {	    
	    // Do the usual texture setups for GL	    
	    var pTPE = {texture: img};
		WebGL_BindTexture(pTPE);        
        if (_onload) {
	        _onload(pTPE);
	    }
	};
	img.onerror = function (e) {
	    debug(e);
	    if (_onerror) {
	        _onerror(e);
	    }
	};
	img.src = set_load_location(null,null,dataURI);
	return img;
};


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
function ReplaceTextureAlpha(_pTPE, _alpha) {    
    
    var glTexture = g_webGL.ReplaceTextureAlpha(_pTPE.texture.webgl_textureid, _alpha);    
    _pTPE.texture.webgl_textureid = glTexture;        
    _pTPE.texture.m_Width = glTexture.Width;
    _pTPE.texture.m_Height = glTexture.Height;
    
    return _pTPE.texture;
}
// @endif