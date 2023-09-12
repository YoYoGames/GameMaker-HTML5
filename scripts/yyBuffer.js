// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyBuffer.js
// Created:	        06/09/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	Buffer processing
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 06/09/2011		V1.0        MJD     1st version - based on the C++ runner.
// 25/04/2017		V1.1        MJD     Re-wrote the MD5 to be the same as the C++ runner
// 06/05/2017		V1.2        MJD     Added m_UsedSize to support creating VBs from buffers
// 
// **********************************************************************************************************************
var eBuffer_GeneralError = -1,
    eBuffer_OutOfSpace = -2,
    eBuffer_OutOfBounds = -3,
    eBuffer_InvalidType = -4,
    eBuffer_UnknownBuffer = -5;

var eBuffer_Format_Fixed = 0,
    eBuffer_Format_Grow = 1,
    eBuffer_Format_Wrap = 2,
    eBuffer_Format_Fast = 3,
    eBuffer_Format_VBuffer = 4;

var eBuffer_None = 0,
	eBuffer_U8 = 1,
	eBuffer_S8 = 2,
	eBuffer_U16 = 3,
	eBuffer_S16 = 4,
	eBuffer_U32 = 5,
	eBuffer_S32 = 6,
	eBuffer_F16 = 7,
	eBuffer_F32 = 8,
	eBuffer_F64 = 9,
	eBuffer_Bool = 10,
	eBuffer_String = 11,
	eBuffer_U64 = 12,
    eBuffer_Text = 13;


var eBuffer_Start = 0,
	eBuffer_Relative = 1,
	eBuffer_End = 2;

// #############################################################################################
/// Function:<summary>
///          	Base64 decode into a binbuffer
///          </summary>
///
/// In:		 <param name="data">data to be decoded</param>
///    		 <param name="_out_len">lenth of output buffer</param>
///    		 <param name="_pBuffer">byte buffer (or array) to decode INTO</param>
///    		 <param name="_offset">start offset into destination buffer to decode at</param>
///    		 <param name="_add_null">add a 0x00 at the end of the stream?</param>
/// Out:	<returns>
///				The decoded buffer
///			</returns>
// #############################################################################################
function Base64DecodeBin(data, _out_len, _pBuffer, _out_offset, _add_null, _in_byte_offset) 
{
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits;
    var i = 0;
    var ac = _out_offset;
    var dec = "";

    var start_block = Math.floor(_in_byte_offset / 3);
    i = start_block * 4;

    var discard = _in_byte_offset % 3;


    if (!data) {
        return data;
    }


    data += '';
    do {
        // unpack four hexets into three octets using index points in b64

        // Looping around these allows us to get rid of invalid characters - like newlines!
        h1 = h2 = h3 = h4 = -1;
        while (h1 < 0) {
            h1 = b64.indexOf(data.charAt(i++));     // returns -1 if not valid
        }
        while (h2 < 0) {
            h2 = b64.indexOf(data.charAt(i++));
        }
        while (h3 < 0) {
            h3 = b64.indexOf(data.charAt(i++));
        }
        while (h4 < 0) {
            h4 = b64.indexOf(data.charAt(i++));
        }

        var chr1 = (h1 << 2) | (h2 >> 4);
        var chr2 = ((h2 & 15) << 4) | (h3 >> 2);
        var chr3 = ((h3 & 3) << 6) | h4;

        _pBuffer[ac++] = chr1;
        if (ac >= _out_len) return _pBuffer;
        if (h3 != 64) {
            _pBuffer[ac++] = chr2;
            if (ac >= _out_len) return _pBuffer;
        }
        if (h4 != 64) {
            _pBuffer[ac++] = chr3;
            if (ac >= _out_len) return _pBuffer;
        }
    } while (i < data.length);

    var out_ = ac;
    if (_add_null && out_ < _out_len) {
        _pBuffer[out_++] = '\0';
    }
    return _pBuffer;
}



// #############################################################################################
/// Property: <summary>
///              
///           </summary>
// #############################################################################################
function Base64Encode(input, length)
{        
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
       chr1 = input.charCodeAt(i++);
       chr2 = input.charCodeAt(i++);
       chr3 = input.charCodeAt(i++);
       enc1 = chr1 >> 2;

       enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
       enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
       enc4 = chr3 & 63;

       if (isNaN(chr2)) {
          enc3 = enc4 = 64;
       } 
       else if (isNaN(chr3)) {
          enc4 = 64;
       }

       output = output +
          _keyStr.charAt(enc1) +
          _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) +
          _keyStr.charAt(enc4);

       chr1 = chr2 = chr3 = "";
       enc1 = enc2 = enc3 = enc4 = "";

    } while (i < length);

    return output;
}

// #############################################################################################
/// Function:<summary>
///             Get the next POW2 texture size
///          </summary>
///
/// In:		 <param name="_size"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function GetPOW2Alignment( _size )
{
	var	size = 1;
	while(size<=1024)
	{
		if( _size <= size ) return size;
		size = size << 1;
	}
	return 1024;	
}


// #############################################################################################
/// Function:<summary>
///             Fix buffers for Chrome, Firefox, Opera and Safari
///          </summary>
// #############################################################################################
/** @constructor */
function yyBuffer( _size, _type, _alignment, _srcbytebuff ) {

    _alignment = GetPOW2Alignment(_alignment & 0x1ff);

    this.m_RealSize = _size + _alignment;   
    
   
	this.m_Type = _type;
	this.m_Size = _size;
	this.m_Alignment = _alignment;
	this.m_AlignmentOffset = 0;
	this.m_BufferIndex = 0;
	this.m_UsedSize = 0;
	
    // Allocate	type conversion buffers	
	this.m_pRAWUnderlyingBuffer = new ArrayBuffer(_size);
	this.m_DataView = new DataView(this.m_pRAWUnderlyingBuffer);

    //fill with provided Uint8Array
	if (_srcbytebuff != undefined && _srcbytebuff.length > 0)
	{
	    var fillSize = yymin(_srcbytebuff.length, _size);
	    this.m_UsedSize = fillSize;
	    var dstbytebuff = new Uint8Array(this.m_pRAWUnderlyingBuffer);
	    for (var i = 0; i < fillSize; i++) {
	        dstbytebuff[i] = _srcbytebuff[i];
	    }
	}
}

// #############################################################################################
/// Function:<summary>
///          	Return the size of a "type"
///          </summary>
///
/// In:		<param name="_type">Type to get the size of</param>
/// Out:	<returns>
///				size or -1 for error 
///			</returns>
// #############################################################################################
function BUfferTypeSizeOf( _type )
{
	switch( _type ){
		case eBuffer_U8:	
		case eBuffer_S8:
		case eBuffer_Bool:	return 1;
		case eBuffer_U16:
		case eBuffer_S16:	
		case eBuffer_F16:	return 2;
		case eBuffer_U32:
		case eBuffer_S32:	
		case eBuffer_F32:	return 4;
		case eBuffer_F64:	return 8;
	}
	return -1;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_resize = function(newSize) {

    var NewBuff = new ArrayBuffer(newSize);

    var oldbuf = new Uint8Array(this.m_pRAWUnderlyingBuffer);
    var newbuf = new Uint8Array(NewBuff);

    // buffer.set() does not like sizing down... so do manually
    if (this.m_pRAWUnderlyingBuffer.byteLength > newSize) {
        for (var i = 0; i < newSize; i++) {
            newbuf[i] = oldbuf[i];
        }
    } else {
        newbuf.set(oldbuf);
    }
    this.m_pRAWUnderlyingBuffer = NewBuff;

    this.m_DataView = new DataView(this.m_pRAWUnderlyingBuffer); //Prolly need to reset this.
    this.m_Size = newSize;

    this.yyb_UpdateUsedSize(-1);
};


// #############################################################################################
/// Function:<summary>
///          	Update the "used" size of a buffer
///          </summary>
///
/// In:		<param name="_size">new size (or undefined)</param>
/// In:		<param name="_reset">reset flag(or undefined)</param>
// #############################################################################################
yyBuffer.prototype.yyb_UpdateUsedSize = function(_size, _reset)
{
    if (_size == undefined) _size = -1;
    if (_reset == undefined) _reset = false;


    var size = _size;
    if (size == -1) size = this.m_BufferIndex;
    if (_reset) {
        this.m_UsedSize = size;
    } else {
        this.m_UsedSize = yymax(this.m_UsedSize, size);
        this.m_UsedSize = yymin(this.m_UsedSize, this.m_Size);
    }
};




// #############################################################################################
///  Function:<summary>
///             Convert string to UTF-8 format.
///             Hi to low order (so in 2 byte format, first byte is the upper 5 bits of the char)
///           </summary>
//
// NumBytes  NumBits   First   Last     Byte 1	    Byte 2      Byte 3     Byte 4
// 1	       7	   U+0000   U+007F   0xxxxxxx
// 2	      11       U+0080   U+07FF   110xxxxx   10xxxxxx		
// 3	      16       U+0800   U+FFFF   1110xxxx   10xxxxxx    10xxxxxx	
// 4	      21       U+10000  U+10FFFF 11110xxx   10xxxxxx    10xxxxxx   10xxxxxx
// 
// #############################################################################################
function UnicodeToUTF8(_str) {
    var txt = "";
    for (var i = 0; i < _str.length; i++) {
        var charCode = _str.charCodeAt(i);
        if (charCode < 0x80) {
            txt += String.fromCharCode(charCode & 0x7f);
        } else if (charCode < 0x0800) {
            txt += String.fromCharCode((((charCode >> 6) & 0x1f) | 0xc0));
            txt += String.fromCharCode((charCode & 0x3f) | 0x80);
        } else if (charCode < 0x10000) {
            txt += String.fromCharCode(((charCode >> 12) & 0x0f) | 0xe0);
            txt += String.fromCharCode(((charCode >> 6) & 0x3f) | 0x80);
            txt += String.fromCharCode((charCode & 0x3f) | 0x80);
        } else {
            txt += String.fromCharCode(((charCode >> 18) & 0x07) | 0xf0);
            txt += String.fromCharCode(((charCode >> 12) & 0x3f) | 0x80);
            txt += String.fromCharCode(((charCode >> 6) & 0x3f) | 0x80);
            txt += String.fromCharCode((charCode & 0x3f) | 0x80);
        }
    }
    return txt;
}


// #############################################################################################
/// Function:<summary>
///          	Return the size of a "type"
///          </summary>
///
/// In:		<param name="_type">Type to get the size of</param>
/// Out:	<returns>
///				size or -1 for error 
///			</returns>
// #############################################################################################
yyBuffer.prototype.yyb_read = function(_type) {


    // Deal with basic alignment first
    //m_BufferIndex = (m_BufferIndex + (m_Alignment-1)) & ~(m_Alignment-1);		// align
    this.m_BufferIndex = (((this.m_BufferIndex + this.m_AlignmentOffset) + (this.m_Alignment - 1)) & ~(this.m_Alignment - 1)) - this.m_AlignmentOffset; 	// align
    if (this.m_BufferIndex >= this.m_Size && this.m_Type == eBuffer_Format_Wrap) {
        // while loop incase its a stupid alignment on a small buffer
        while (this.m_BufferIndex >= this.m_Size) {
            this.yyb_calcnextalignmentoffset();
            this.m_BufferIndex -= this.m_Size;
        }
    }

    // Out of space?
    if (this.m_BufferIndex >= this.m_Size) return (_type==eBuffer_String) ? "" : eBuffer_OutOfBounds;

    var res;
    switch (_type) {
        case eBuffer_Bool:
            res = this.m_DataView.getUint8(this.m_BufferIndex++);
            if (res == 1) {
                res = true;
            } else {
                res = false;
            }
            break;
        case eBuffer_U8:
            {
                res = this.m_DataView.getUint8(this.m_BufferIndex++);
            }
            break;
        case eBuffer_String:
        case eBuffer_Text:
            {
                res = "";
                var chr;
                var chrCode = 0;

                while(this.m_BufferIndex<this.m_UsedSize)
                {
                    var v = 0;
                    chr = -1;
                    chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);

                    if ((chrCode & 0x80) == 0) {
                        v = chrCode;
                    } else if ((chrCode & 0xe0) == 0xc0) {
                        v = (chrCode&0x1f)<<6;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f);

                    } else if ((chrCode & 0xf0) == 0xe0) {
                        v = (chrCode & 0x0f)<<12;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f) << 6;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f);

                    } else {
                        v = (chrCode & 0x07)<<18;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f) << 12;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f) << 6;
                        chrCode = this.m_DataView.getUint8(this.m_BufferIndex++, true);
                        v |= (chrCode & 0x3f);
                        chr = String.fromCharCode((v >> 10) + 0xD7C0) + String.fromCharCode((v & 0x3FF) | 0xDC00);
                    }
                    if (v == 0x00) break;
                    if(chr < 0) chr = String.fromCharCode(v);
                    res += chr;
                }
            }
            break;
        case eBuffer_S8:
            res = this.m_DataView.getInt8(this.m_BufferIndex++);
            break;

        case eBuffer_U16:
            res = this.m_DataView.getUint16(this.m_BufferIndex, true);
            this.m_BufferIndex += 2;
            break;
        case eBuffer_S16:
            res = this.m_DataView.getInt16(this.m_BufferIndex, true);
            this.m_BufferIndex += 2;
            break;

        case eBuffer_S32:
            res = this.m_DataView.getInt32(this.m_BufferIndex, true);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_U32:
            res = new Long( this.m_DataView.getUint32(this.m_BufferIndex, true), 0);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_F32:
            res = this.m_DataView.getFloat32(this.m_BufferIndex, true);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_F64:
            res = this.m_DataView.getFloat64(this.m_BufferIndex, true);
            this.m_BufferIndex += 8;
            break;
        case eBuffer_U64:
            var low = this.m_DataView.getUint32(this.m_BufferIndex, true);
            this.m_BufferIndex += 4;
            var high = this.m_DataView.getUint32(this.m_BufferIndex, true);
            this.m_BufferIndex += 4;
            res = new Long(low, high);
            break;

    }
    return res;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_calcnextalignmentoffset = function() {
    this.m_AlignmentOffset = (this.m_AlignmentOffset + this.m_Size) % this.m_Alignment;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function BufferSizeOf(_type) {

    var sizeneeded = 0;
    
    switch (_type) {

        case eBuffer_Bool:
        case eBuffer_U8:
        case eBuffer_S8:
            sizeneeded = 1;
            break;

        case eBuffer_U16:
        case eBuffer_S16:
            sizeneeded = 2;
            break;

        case eBuffer_S32:
        case eBuffer_U32:
        case eBuffer_F32:
            sizeneeded = 4;
            break;

        case eBuffer_F64:
        case eBuffer_U64:
            sizeneeded = 8;
            break;

    }

    return sizeneeded;

}

function yyMD5(){
    this.i = new Uint32Array(2);   //[2];       //uint32
    this.buf = new Uint32Array(4); //[4];    //uint32
    this.IN = new Uint8Array(64);       //[64];     //unsigned char
    this.digest=new Uint8Array(16);   // [16];   //unsigned char
    
    this.i[0]=this.i[1]=0;
    this.buf[0] = this.buf[1] = this.buf[2] = this.buf[3] = 0;
    for(var i=0;i<64;i++) this.IN[i]=0;
    for(var i=0;i<16;i++) this.digest[i]=0;
}


// get the digest as a hex string
yyMD5.prototype.yyb_hex = function() 
{
    var hh = "0123456789abcdef";
    var s="";
	for(var h=0;h<16;h++){
	    var b = this.digest[h];
	    s += hh[((b>>4)&0xf)];
	    s += hh[(b&0xf)];
	}
	return s;
};

function _initmd5()
{
    var mdContext = new yyMD5();
    mdContext.i[0] = mdContext.i[1] = 0;

    /* Load magic initialization constants.
    */
    mdContext.buf[0] = 0x67452301;
    mdContext.buf[1] = 0xefcdab89;
    mdContext.buf[2] = 0x98badcfe;
    mdContext.buf[3] = 0x10325476;
    return mdContext;
}
var md5_temp_var = new Uint32Array(16);


// F, G and H are basic MD5 functions: selection, majority, parity
function md5_F(x, y, z){    
    md5_temp_var[0] = x;
    md5_temp_var[1] = y;
    md5_temp_var[2] = z;
     return ( ((md5_temp_var[0]) & (md5_temp_var[1])) | ((~md5_temp_var[0]) & (md5_temp_var[2])) );
}
function md5_G(x, y, z){
    md5_temp_var[0] = x;
    md5_temp_var[1] = y;
    md5_temp_var[2] = z;
    return ( ((md5_temp_var[0]) & (md5_temp_var[2])) | ((md5_temp_var[1]) & (~md5_temp_var[2])) );
}
function md5_H(x, y, z){
    md5_temp_var[0] = x;
    md5_temp_var[1] = y;
    md5_temp_var[2] = z;
    return ((md5_temp_var[0]) ^ (md5_temp_var[1]) ^ (md5_temp_var[2]));
}
function md5_I(x, y, z){
    md5_temp_var[0] = x;
    md5_temp_var[1] = y;
    md5_temp_var[2] = z;
    return ((md5_temp_var[1]) ^ ((md5_temp_var[0]) | (~md5_temp_var[2])));
}




// ROTATE_LEFT rotates x left n bits
var md5_x_n= new Uint32Array(2);
function md5_ROTATE_LEFT(x, n) {    
    md5_x_n[0] = x;
    md5_x_n[1] = ((md5_x_n[0]<<n)&0xffffffff) | ((md5_x_n[0]>>(32-n))&((1<<n)-1));      // might have to MASK these bits off
    return md5_x_n[1];
}


// FF, GG, HH, and II transformations for rounds 1, 2, 3, and 4
// Rotation is separate from addition to prevent recomputation 
var md5_var_a= new Uint32Array(7);
function md5_FF(a, b, c, d, x, s, ac)
{
    md5_var_a[0] = a;
    md5_var_a[1] = b;
    md5_var_a[2] = c;
    md5_var_a[3] = d;
    md5_var_a[4] = x;
    md5_var_a[5] = s;
    md5_var_a[6] = ac;
    md5_var_a[0] += md5_F( md5_var_a[1], md5_var_a[2], md5_var_a[3]) + md5_var_a[4] + (md5_var_a[6]);
    md5_var_a[0] = md5_ROTATE_LEFT(md5_var_a[0], md5_var_a[5] );
    md5_var_a[0] += md5_var_a[1];
    return md5_var_a[0];
}
function md5_GG(a, b, c, d, x, s, ac)
{
    md5_var_a[0] = a;
    md5_var_a[1] = b;
    md5_var_a[2] = c;
    md5_var_a[3] = d;
    md5_var_a[4] = x;
    md5_var_a[5] = s;
    md5_var_a[6] = ac;
    md5_var_a[0] += md5_G(md5_var_a[1], md5_var_a[2], md5_var_a[3]) + md5_var_a[4] + (md5_var_a[6]); 
    md5_var_a[0] = md5_ROTATE_LEFT(md5_var_a[0], md5_var_a[5]); 
    md5_var_a[0] += md5_var_a[1];
    return md5_var_a[0];
}
function md5_HH(a, b, c, d, x, s, ac)
{
    md5_var_a[0] = a;
    md5_var_a[1] = b;
    md5_var_a[2] = c;
    md5_var_a[3] = d;
    md5_var_a[4] = x;
    md5_var_a[5] = s;
    md5_var_a[6] = ac;
    md5_var_a[0] += md5_H( md5_var_a[1], md5_var_a[2], md5_var_a[3]) + md5_var_a[4] + (md5_var_a[6]);
    md5_var_a[0] = md5_ROTATE_LEFT(md5_var_a[0], md5_var_a[5]);
    md5_var_a[0] += md5_var_a[1];
    return md5_var_a[0];
}
function md5_II(a, b, c, d, x, s, ac)
{
    md5_var_a[0] = a;
    md5_var_a[1] = b;
    md5_var_a[2] = c;
    md5_var_a[3] = d;
    md5_var_a[4] = x;
    md5_var_a[5] = s;
    md5_var_a[6] = ac;
    md5_var_a[0] += md5_I( md5_var_a[1], md5_var_a[2], md5_var_a[3] ) + md5_var_a[4] + (md5_var_a[6]);
    md5_var_a[0] = md5_ROTATE_LEFT(md5_var_a[0], md5_var_a[5]);
    md5_var_a[0] += md5_var_a[1];
    return md5_var_a[0];
}

// Basic MD5 step. Transform buf based on in.
function Transform(_buf, _in)
{
  var a = _buf[0], b = _buf[1], c = _buf[2], d = _buf[3];

    // Round 1
    var S11 = 7;
    var S12 = 12;
    var S13 = 17;
    var S14 = 22;
    a = md5_FF ( a, b, c, d, _in[ 0], S11, 0xD76AA478); // 1     3614090360U    
    d = md5_FF ( d, a, b, c, _in[ 1], S12, 0xE8C7B756); // 2     3905402710U
    c = md5_FF ( c, d, a, b, _in[ 2], S13, 0x242070DB); // 3      606105819U
    b = md5_FF ( b, c, d, a, _in[ 3], S14, 0xC1BDCEEE); // 4     3250441966U
    a = md5_FF ( a, b, c, d, _in[ 4], S11, 0xF57C0FAF); // 5     4118548399U
    d = md5_FF ( d, a, b, c, _in[ 5], S12, 0x4787C62A); // 6     1200080426U
    c = md5_FF ( c, d, a, b, _in[ 6], S13, 0xA8304613); // 7     2821735955U
    b = md5_FF ( b, c, d, a, _in[ 7], S14, 0xFD469501); // 8     4249261313U
    a = md5_FF ( a, b, c, d, _in[ 8], S11, 0x698098D8); // 9     1770035416U
    d = md5_FF ( d, a, b, c, _in[ 9], S12, 0x8B44F7AF); // 10    2336552879U
    c = md5_FF ( c, d, a, b, _in[10], S13, 0xFFFF5BB1); // 11    4294925233U
    b = md5_FF ( b, c, d, a, _in[11], S14, 0x895CD7BE); // 12    2304563134U
    a = md5_FF ( a, b, c, d, _in[12], S11, 0x6B901122); // 13    1804603682U
    d = md5_FF ( d, a, b, c, _in[13], S12, 0xFD987193); // 14    4254626195U
    c = md5_FF ( c, d, a, b, _in[14], S13, 0xA679438E); // 15    2792965006U
    b = md5_FF ( b, c, d, a, _in[15], S14, 0x49B40821); // 16    1236535329U
        
    // Rmd5_ound 2
    var S21 = 5;
    var S22 = 9;
    var S23 = 14;
    var S24 = 20;
    a = md5_GG ( a, b, c, d, _in[ 1], S21, 0xF61E2562); // 17 4129170786U
    d = md5_GG ( d, a, b, c, _in[ 6], S22, 0xC040B340); // 18 3225465664U
    c = md5_GG ( c, d, a, b, _in[11], S23, 0x265E5A51); // 19  643717713U
    b = md5_GG ( b, c, d, a, _in[ 0], S24, 0xE9B6C7AA); // 20 3921069994U
    a = md5_GG ( a, b, c, d, _in[ 5], S21, 0xD62F105D); // 21 3593408605U
    d = md5_GG ( d, a, b, c, _in[10], S22, 0x02441453); // 22   38016083U
    c = md5_GG ( c, d, a, b, _in[15], S23, 0xD8A1E681); // 23 3634488961U
    b = md5_GG ( b, c, d, a, _in[ 4], S24, 0xE7D3FBC8); // 24 3889429448U
    a = md5_GG ( a, b, c, d, _in[ 9], S21, 0x21E1CDE6); // 25  568446438U
    d = md5_GG ( d, a, b, c, _in[14], S22, 0xC33707D6); // 26 3275163606U
    c = md5_GG ( c, d, a, b, _in[ 3], S23, 0xF4D50D87); // 27 4107603335U
    b = md5_GG ( b, c, d, a, _in[ 8], S24, 0x455A14ED); // 28 1163531501U
    a = md5_GG ( a, b, c, d, _in[13], S21, 0xA9E3E905); // 29 2850285829U
    d = md5_GG ( d, a, b, c, _in[ 2], S22, 0xFCEFA3F8); // 30 4243563512U
    c = md5_GG ( c, d, a, b, _in[ 7], S23, 0x676F02D9); // 31 1735328473U
    b = md5_GG ( b, c, d, a, _in[12], S24, 0x8D2A4C8A); // 32 2368359562U

    // Round 3
    var S31 = 4;
    var S32 = 11;
    var S33 = 16;
    var S34 = 23;
    a = md5_HH ( a, b, c, d, _in[ 5], S31, 0xFFFA3942); // 33 4294588738U
    d = md5_HH ( d, a, b, c, _in[ 8], S32, 0x8771F681); // 34 2272392833U
    c = md5_HH ( c, d, a, b, _in[11], S33, 0x6D9D6122); // 35 1839030562U
    b = md5_HH ( b, c, d, a, _in[14], S34, 0xFDE5380C); // 36 4259657740U
    a = md5_HH ( a, b, c, d, _in[ 1], S31, 0xA4BEEA44); // 37 2763975236U
    d = md5_HH ( d, a, b, c, _in[ 4], S32, 0x4BDECFA9); // 38 1272893353U
    c = md5_HH ( c, d, a, b, _in[ 7], S33, 0xF6BB4B60); // 39 4139469664U
    b = md5_HH ( b, c, d, a, _in[10], S34, 0xBEBFBC70); // 40 3200236656U
    a = md5_HH ( a, b, c, d, _in[13], S31, 0x289B7EC6); // 41  681279174U
    d = md5_HH ( d, a, b, c, _in[ 0], S32, 0xEAA127FA); // 42 3936430074U
    c = md5_HH ( c, d, a, b, _in[ 3], S33, 0xD4EF3085); // 43 3572445317U
    b = md5_HH ( b, c, d, a, _in[ 6], S34, 0x04881D05); // 44   76029189U
    a = md5_HH ( a, b, c, d, _in[ 9], S31, 0xD9D4D039); // 45 3654602809U
    d = md5_HH ( d, a, b, c, _in[12], S32, 0xE6DB99E5); // 46 3873151461U
    c = md5_HH ( c, d, a, b, _in[15], S33, 0x1FA27CF8); // 47  530742520U
    b = md5_HH ( b, c, d, a, _in[ 2], S34, 0xC4AC5665); // 48 3299628645U

  // Round 4
    var S41 = 6;
    var S42 = 10;
    var S43 = 15;
    var S44 = 21;
    a = md5_II ( a, b, c, d, _in[ 0], S41, 0xF4292244); // 49 4096336452U
    d = md5_II ( d, a, b, c, _in[ 7], S42, 0x432AFF97); // 50 1126891415U
    c = md5_II ( c, d, a, b, _in[14], S43, 0xAB9423A7); // 51 2878612391U
    b = md5_II ( b, c, d, a, _in[ 5], S44, 0xFC93A039); // 52 4237533241U
    a = md5_II ( a, b, c, d, _in[12], S41, 0x655B59C3); // 53 1700485571U
    d = md5_II ( d, a, b, c, _in[ 3], S42, 0x8F0CCC92); // 54 2399980690U
    c = md5_II ( c, d, a, b, _in[10], S43, 0xFFEFF47D); // 55 4293915773U
    b = md5_II ( b, c, d, a, _in[ 1], S44, 0x85845DD1); // 56 2240044497U
    a = md5_II ( a, b, c, d, _in[ 8], S41, 0x6FA87E4F); // 57 1873313359U
    d = md5_II ( d, a, b, c, _in[15], S42, 0xFE2CE6E0); // 58 4264355552U
    c = md5_II ( c, d, a, b, _in[ 6], S43, 0xA3014314); // 59 2734768916U
    b = md5_II ( b, c, d, a, _in[13], S44, 0x4E0811A1); // 60 1309151649U
    a = md5_II ( a, b, c, d, _in[ 4], S41, 0xF7537E82); // 61 4149444226U
    d = md5_II ( d, a, b, c, _in[11], S42, 0xBD3AF235); // 62 3174756917U
    c = md5_II ( c, d, a, b, _in[ 2], S43, 0x2AD7D2BB); // 63  718787259U
    b = md5_II ( b, c, d, a, _in[ 9], S44, 0xEB86D391); // 64 3951481745U

    _buf[0] += a;
    _buf[1] += b;
    _buf[2] += c;
    _buf[3] += d;
}

function MD5Update(_mdContext, _inBuf, _offset, _inLen)
{
    var _in = new Uint32Array(16);        // UINT4
    var mdi;            // int
    var i, ii;          // unsigned int
    var _index=0;       // _inBuf index
    
    // compute number of bytes mod 64
    mdi = (_mdContext.i[0] >> 3) & 0x3F;

    // update number of bits
    if( (_mdContext.i[0] + ((_inLen << 3)&0xffffffff)) < _mdContext.i[0] )
    {
        _mdContext.i[1]++;
    }
    _mdContext.i[0] += (_inLen << 3)&0xffffffff;
    _mdContext.i[1] += (_inLen >> 29)&0xffffffff;

  while (_inLen--) {
    // add new character to buffer, increment mdi
    _mdContext.IN[mdi++] = _inBuf[_index++];

    // transform if necessary
    if (mdi == 0x40) {
      for (i = 0, ii = 0; i < 16; i++, ii += 4)
        _in[i] =( ((0xffffffff&_mdContext.IN[ii+3]) << 24) |
                  ((0xffffffff&_mdContext.IN[ii+2]) << 16) |
                  ((0xffffffff&_mdContext.IN[ii+1]) << 8) |
                   (0xffffffff&_mdContext.IN[ii])
                 );
      Transform( _mdContext.buf, _in );
      mdi = 0;
    }
  }
}


var md5_PADDING = new Uint8Array(64);
/*
  Array holds....
  [
  0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
];*/

function MD5Final( _mdContext )
{
    var   _in = new Uint32Array(16);     // UINT4
    var   mdi;            // int
    var   i, ii;          // unsigned int 
    var   padLen;         // unsigned int 

    // save number of bits
    _in[14] = _mdContext.i[0];
    _in[15] = _mdContext.i[1];

    // compute number of bytes mod 64
    mdi = ((_mdContext.i[0] >> 3) & 0x3F);

    /* pad out to 56 mod 64 */
    padLen = (mdi < 56) ? (56 - mdi) : (120 - mdi);
    md5_PADDING[0]=0x80;
    MD5Update(_mdContext, md5_PADDING, 0, padLen);

  // append length in bits and transform
    for (i = 0, ii = 0; i < 14; i++, ii += 4)
    {
        _in[i] = ((~~_mdContext.IN[ii+3]) << 24) |               //UINT4
                 ((~~_mdContext.IN[ii+2]) << 16) |
                 ((~~_mdContext.IN[ii+1]) << 8) |
                  (~~_mdContext.IN[ii]);
    }
    Transform( _mdContext.buf, _in );

    // store buffer in digest
    for (i = 0, ii = 0; i < 4; i++, ii += 4) {
        _mdContext.digest[ii]   =  (_mdContext.buf[i] & 0xFF);          //(unsigned char)
        _mdContext.digest[ii+1] = ((_mdContext.buf[i] >> 8) & 0xFF);    // (unsigned char)
        _mdContext.digest[ii+2] = ((_mdContext.buf[i] >> 16) & 0xFF);   // (unsigned char)
        _mdContext.digest[ii+3] = ((_mdContext.buf[i] >> 24) & 0xFF);   // (unsigned char)
    }
}


// MD5 a buffer
function DoMD5(_buff, _size,_offset)
{
    var mdContext = _initmd5();
    var amountToHash = _size;
    while(amountToHash > 0)
	{
		var amountToHashNow = yymin(amountToHash, _size - _offset);
		MD5Update( mdContext, _buff, _offset, amountToHashNow );
		_offset = 0;
		amountToHash -= amountToHashNow;
	}
	MD5Final( mdContext );
    return mdContext.yyb_hex();
}

function crc32_init() { 
    var poly = -306674912; 
    var tab = new Array(256); 
    for (var i = 0; i < 256; i++) { 
        var crc = i; 
        var times = 8; 
        while (--times >= 0) { 
            if ((crc & 1) != 0) { 
                crc = crc >>> 1 ^ poly; 
            } else 
                crc >>>= 1; 
        } 
        tab[i] = crc; 
    } 
    return tab; 
}
 
var crc32_tab = crc32_init(); 
function crc32(b, pos, len) { 
    var crc = 0xffffffff;
    var tab = crc32_tab; 
    var i = pos; 
    for (var _g1 = pos + len; i < _g1; i++) 
        crc = (tab[(crc ^ b[i]) & 255] ^ ((crc >>> 8) & 0x00ffffff)) >>> 0;
    return crc; 
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_crc32 = function(_offset, _size)
{
    if (this.m_Size == 0)
        return;

    // Usual clamping   

    if (_size < 0)
        _size = this.m_Size;

    if (this.m_Type == eBuffer_Format_Wrap) {
        while (_offset < 0)
            _offset += this.m_Size;

        while (_offset >= this.m_Size)
            _offset -= this.m_Size;
    }
    else {
        if (_offset < 0)
            _offset = 0;

        if (_offset >= this.m_Size)
            _offset = this.m_Size - 1;

        if ((_offset + _size) > this.m_Size)
            _size = this.m_Size - _offset;
    }

    if (_size > this.m_Size - _offset)
        return "";
    else{
        return crc32( new Uint8Array(this.m_pRAWUnderlyingBuffer, _offset, _size),0, _size );
    }
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_md5 = function(_offset, _size) {

    if (this.m_Size == 0)
        return;

    // Usual clamping	

    if (_size < 0)
        _size = this.m_Size;

    if (this.m_Type == eBuffer_Format_Wrap) {
        while (_offset < 0)
            _offset += this.m_Size;

        while (_offset >= this.m_Size)
            _offset -= this.m_Size;
    }
    else {
        if (_offset < 0)
            _offset = 0;

        if (_offset >= this.m_Size)
            _offset = this.m_Size - 1;

        if ((_offset + _size) > this.m_Size)
            _size = this.m_Size - _offset;
    }

    if (_size > this.m_Size - _offset)
        return "";
    else{
        return DoMD5( new Uint8Array(this.m_pRAWUnderlyingBuffer, _offset, _size),_size, 0 );
    }
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_sha1 = function(_offset, _size) {

    if (this.m_Size == 0)
        return;

    // Usual clamping	

    if (_size < 0)
        _size = this.m_Size;

    if (this.m_Type == eBuffer_Format_Wrap) {
        while (_offset < 0)
            _offset += this.m_Size;

        while (_offset >= this.m_Size)
            _offset -= this.m_Size;
    }
    else {
        if (_offset < 0)
            _offset = 0;

        if (_offset >= this.m_Size)
            _offset = this.m_Size - 1;

        if ((_offset + _size) > this.m_Size)
            _size = this.m_Size - _offset;
    }

    if (_size > this.m_Size - _offset)
        return "";
    else
        return sha1_string_utf8(String.fromCharCode.apply(null, new Uint8Array(this.m_pRAWUnderlyingBuffer, _offset, _size)));
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_save = function(filename, offset, size) {

    SaveTextFile_Block(filename, this.yyb_base64encode(offset, size));
};

// #############################################################################################
/// Function:<summary>
///          	compress buffer data in given range
///          </summary>
/// In:		<param name="_offset">start offset</param>
/// In:		<param name="_size">bytes to compress</param>
/// Out:	<returns>
///				zlib compressed data
///			</returns>
// #############################################################################################
yyBuffer.prototype.yyb_compress = function (_offset, _size)
{
    if (this.m_Size == 0)
        return;
    
    if (_size < 0)
        _size = this.m_Size;
    
    _offset = clamp(_offset, 0, this.m_Size-1);
    _size = clamp(_size, 0, this.m_Size - _offset);
    if (_size <= 0)
        return;
    
    var u8array = new Uint8Array(this.m_pRAWUnderlyingBuffer, _offset, _size);
    var deflate = new Zlib.Deflate(u8array);
    var compressed = deflate.compress();
    return compressed; //Uint8Array
};


// #############################################################################################
/// Function:<summary>
///          	zlib decompress entire buffer
///          </summary>
/// Out:	<returns>
///				decompressed data
///			</returns>
// #############################################################################################
yyBuffer.prototype.yyb_decompress = function ()
{
    result = undefined;
    try {
        var _data = new Uint8Array(this.m_pRAWUnderlyingBuffer, 0, this.m_UsedSize);
        var inflate = new Zlib.Inflate(_data);
        var result = inflate.decompress();
    } catch (_ex) {
        show_debug_message("buffer decompress exception: " + _ex.message);
    }

    return result; //Uint8Array
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_base64encode = function(_offset, _size) {

    if (this.m_Size == 0)
        return;

    // Usual clamping
    if (_size < 0)
        _size = this.m_Size;
    if( _size == 0 )
        return "";

    if (this.m_Type == eBuffer_Format_Wrap) {
        while (_offset < 0)
            _offset += this.m_Size;

        while (_offset >= this.m_Size)
            _offset -= this.m_Size;
    }
    else {
        if (_offset < 0)
            _offset = 0;

        if (_offset >= this.m_Size)
            _offset = this.m_Size - 1;

        if ((_offset + _size) > this.m_Size)
            _size = this.m_Size - _offset;
    }

    if (_size > this.m_Size - _offset) {
        return "";
    }
    else {
        var u8array = new Uint8Array(this.m_pRAWUnderlyingBuffer, _offset, _size);
       
        var stringData = "";
        for (var i = 0; i < _size; i++) {
            stringData += String.fromCharCode(u8array[i]);
        }
        return Base64Encode(stringData, _size);
        
    }
};

// #############################################################################################
/// Function:<summary>
///          <summary>
// #############################################################################################
yyBuffer.prototype.yyb_base64decode = function(_encoded_string, _offset) {

    var dstbytebuff = new Uint8Array(this.m_pRAWUnderlyingBuffer);
    return Base64DecodeBin(_encoded_string, dstbytebuff.length - _offset, dstbytebuff, _offset, false, 0);
};





// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_write = function(_type, _value) {

    var UTF8_String;
    var size = 0;
    // Deal with basic alignment first	
    this.m_BufferIndex = (((this.m_BufferIndex + this.m_AlignmentOffset) + (this.m_Alignment - 1)) & ~(this.m_Alignment - 1)) - this.m_AlignmentOffset; 	// align
    if (this.m_BufferIndex >= this.m_Size && this.m_Type == eBuffer_Format_Wrap) {
        // while loop incase its a stupid alignment on a small buffer
        while (this.m_BufferIndex >= this.m_Size) {
            this.yyb_calcnextalignmentoffset();
            this.m_BufferIndex -= this.m_Size;
        }
    }

    // Out of space?
    if ((this.m_BufferIndex >= this.m_Size) && (this.m_Type != eBuffer_Format_Grow)) {
        return eBuffer_OutOfSpace;
    }


    var sizeneeded = BufferSizeOf(_type);
    if( ( _type === eBuffer_String ) || ( _type === eBuffer_Text ) ){
        UTF8_String = UnicodeToUTF8(_value);
        sizeneeded = UTF8_String.length;
        if( _type === eBuffer_String )  sizeneeded++;  // null at the end of a string (not text)
    }

    if ((this.m_BufferIndex + sizeneeded) > this.m_Size) {
        // Resize buffer...
        if (this.m_Type == eBuffer_Format_Grow) {
            var oldsize = this.m_Size;
            var newSize = this.m_Size;

            while ((this.m_BufferIndex + sizeneeded) > newSize) {
                newSize = (newSize << 1); 
            }
            this.yyb_resize(newSize);
        } else {
            if (this.m_Type != eBuffer_Format_Wrap) {
                return eBuffer_OutOfSpace; 			// out of space
            }
        }
    }


    switch (_type) {

        case eBuffer_Bool:
            if (_value == true) {
                _value = 1;
            } else {
                _value = 0;
            }/*jshint -W086 */      // disable break; expected check
            // intentional drop through (see read too)
        case eBuffer_U8:
            {
                this.m_DataView.setUint8(this.m_BufferIndex, _value);
                this.m_BufferIndex++;
            }
            break;

        case eBuffer_String:
        case eBuffer_Text:
            {               
                for (var i = 0; i < UTF8_String.length; i++) {
                    var charCode = UTF8_String.charCodeAt(i) & 0xff;   // Now UTF8, so only a byte in size
                    this.m_DataView.setUint8(this.m_BufferIndex++, charCode, true);
                }
                // "text" mode doesn't add a NULL at the end.
                if (_type === eBuffer_String) {
                    this.m_DataView.setUint8(this.m_BufferIndex++, 0, true);
                }
            }
            break;
        case eBuffer_S8:
            this.m_DataView.setInt8(this.m_BufferIndex, _value);
            this.m_BufferIndex++;
            break;

        case eBuffer_U16:
            this.m_DataView.setUint16(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 2;
            break;
        case eBuffer_S16:
            this.m_DataView.setInt16(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 2;
            break;

        case eBuffer_S32:
            this.m_DataView.setInt32(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_U32:
            this.m_DataView.setUint32(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_F32:
            this.m_DataView.setFloat32(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 4;
            break;
        case eBuffer_F64:
            this.m_DataView.setFloat64(this.m_BufferIndex, _value, true);
            this.m_BufferIndex += 8;
            break;
        case eBuffer_U64:
            var int64Val = yyGetInt64(_value);
            this.m_DataView.setUint32(this.m_BufferIndex, int64Val.low, true);
            this.m_BufferIndex += 4;
            this.m_DataView.setUint32(this.m_BufferIndex, int64Val.high, true);
            this.m_BufferIndex += 4;
            break;
    }

    this.yyb_UpdateUsedSize(-1);

    return 0;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_peek = function(_type, _offset) {

    var size = BufferSizeOf(_type);

    if (_offset < 0)
        return undefined; // invalid location

    if (this.m_Type != eBuffer_Format_Wrap) {
        if (_offset > (this.m_Size - size))
            return undefined; // can't read off the end of the buffer
    }
    else {
        while (_offset >= this.m_Size) {
            _offset -= this.m_Size;
        }
    }

    var res;
    switch (_type) {
        case eBuffer_Bool:
            res = this.m_DataView.getUint8(_offset);
            if (res == 1) {
                res = true;
            } else {
                res = false;
            }
            break;
        case eBuffer_U8:
            {
                res = this.m_DataView.getUint8(_offset);
            }
            break;
        case eBuffer_S8:
            res = this.m_DataView.getInt8(_offset);
            break;

        case eBuffer_U16:
            res = this.m_DataView.getUint16(_offset, true);
            break;
        case eBuffer_S16:
            res = this.m_DataView.getInt16(_offset, true);
            break;

        case eBuffer_S32:
            res = this.m_DataView.getInt32(_offset, true);
            break;
        case eBuffer_U32:
            res = this.m_DataView.getUint32(_offset, true);
            break;
        case eBuffer_F32:
            res = this.m_DataView.getFloat32(_offset, true);
            break;
        case eBuffer_F64:
            res = this.m_DataView.getFloat64(_offset, true);
            break;
        case eBuffer_U64:
            var low = this.m_DataView.getUint32(_offset, true);
            var high = this.m_DataView.getUint32(_offset + 4, true);
            res = new Long(low, high);
            break;
        case eBuffer_String:
        case eBuffer_Text:
            {
                res = "";
                var chr;
                var chrCode = 0;

                var currOffset = _offset;

                while(currOffset<this.m_UsedSize)
                {
                    var v = 0;
                    chr = -1;
                    chrCode = this.m_DataView.getUint8(currOffset++, true);

                    if ((chrCode & 0x80) == 0) {
                        v = chrCode;
                    } else if ((chrCode & 0xe0) == 0xc0) {
                        v = (chrCode&0x1f)<<6;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f);

                    } else if ((chrCode & 0xf0) == 0xe0) {
                        v = (chrCode & 0x0f)<<12;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f) << 6;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f);

                    } else {
                        v = (chrCode & 0x07)<<18;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f) << 12;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f) << 6;
                        chrCode = this.m_DataView.getUint8(currOffset++, true);
                        v |= (chrCode & 0x3f);
                        chr = String.fromCharCode((v >> 10) + 0xD7C0) + String.fromCharCode((v & 0x3FF) | 0xDC00);
                    }
                    if (v == 0x00) break;
                    if(chr < 0) chr = String.fromCharCode(v);
                    res += chr;
                }
            }
            break;

    }
    return res;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_fill = function(_offset, _size, _type, _value, _stride, _fillgaps) {

    if (this.m_Size == 0)
        return;

    if (_size < 0)
        _size = this.m_Size;

    if (this.m_Type == eBuffer_Format_Wrap) {
        while (_offset < 0)
            _offset += this.m_Size;

        while (_offset >= this.m_Size)
            _offset -= this.m_Size;
    }
    else {
        if (_offset < 0)
            return;

        if (_offset >= this.m_Size)
            return; 			// can't fill off the end

        // Truncate size if required
        if ((_offset + _size) > this.m_Size)
            _size = this.m_Size - _offset;
    }


    var dstbytebuff = new Uint8Array(this.m_pRAWUnderlyingBuffer);

    var virtualoffset = _offset;
    var writeoffset = _offset;
    var startvirtualoffset = virtualoffset;
    var byteswritten = 0;
    var endvirtualoffset = _offset + _size;
    var typesize = BufferSizeOf(_type);
    if( ( _type === eBuffer_String ) || ( _type === eBuffer_Text ) ){
        UTF8_String = UnicodeToUTF8(_value);
        typesize = UTF8_String.length;
        if( _type === eBuffer_String )  typesize++;  // null at the end of a string (not text)
    }



    var bAlign;
    if (_stride <= 0)
        bAlign = true;
    else {
        bAlign = false;
        typesize = yymin(typesize, _stride); // should probably just bail, but this allows the loop to handle a stride that is smaller than the data type being used
    }

    // Determine if we have to write on the first iteration
    var bWritingData;
    if (((bAlign && ((virtualoffset % this.m_Alignment) == 0)) || !bAlign) && (typesize <= _size)) {
        bWritingData = true;
    }
    else {
        bWritingData = false;
    }
    var i;
    // Having wrapping support makes this code a bit complicated :(
    while (byteswritten < _size) {
        writeoffset = virtualoffset % this.m_Size; // wrap write offset to buffer size

        if (bWritingData) {
            // Can write instance of type			
            //	unsigned char* pMem = &m_pMemory[writeoffset];
            //	unsigned char* pSrcData = pData;

            if ((writeoffset + typesize) <= this.m_Size) {

                //for(i=typesize;i>0;i--){
                //*pMem++ = *pSrcData++;
                //dstbytebuff[writeoffset+i] = 
                //}
                this.yyb_poke(_type, writeoffset, _value);
                writeoffset += typesize;
                virtualoffset += typesize;
                this.yyb_UpdateUsedSize(writeoffset);
            }
            else {
                // Wrap				
                //for(i=typesize;i>0;i--){
                //*pMem++ = *pSrcData++;
                this.yyb_poke(_type, writeoffset, _value);
                writeoffset += typesize;
                //	writeoffset++;

                if (writeoffset >= this.m_Size) {
                    this.yyb_UpdateUsedSize(this.m_Size);
                    writeoffset = 0;
                    //  pMem = m_pMemory;
                }
                //}				
                virtualoffset += typesize;
            }

            byteswritten += typesize;

            bWritingData = false;
        }
        else {
            // Otherwise move to the next write point, writing zeros if required
            var nextvirtualoffset;
            if (bAlign)
                nextvirtualoffset = (virtualoffset + (this.m_Alignment - 1)) & ~(this.m_Alignment - 1);
            else
                nextvirtualoffset = startvirtualoffset + _stride;

            if (nextvirtualoffset > endvirtualoffset) {
                nextvirtualoffset = endvirtualoffset;
            }

            var filldist = nextvirtualoffset - virtualoffset;

            if (_fillgaps) {
                if ((writeoffset + filldist) <= this.m_Size) {
                    //memset(m_pMemory + writeoffset, 0, filldist);

                    for (i = 0; i < filldist; i++) {
                        dstbytebuff[writeoffset + i] = 0;
                    }

                    writeoffset += filldist;
                    this.yyb_UpdateUsedSize(writeoffset);
                }
                else {
                    var amountToWrite = filldist;
                    while (amountToWrite > 0) {
                        var amountToWriteNow = yymin(amountToWrite, this.m_Size - writeoffset);
                        // memset(m_pMemory + writeoffset, 0, amountToWriteNow);
                        for (i = 0; i < amountToWriteNow; i++) {
                            dstbytebuff[writeoffset + i] = 0;
                        }

                        writeoffset += amountToWriteNow;
                        this.yyb_UpdateUsedSize(writeoffset);
                        writeoffset = writeoffset % this.m_Size;
                        amountToWrite -= amountToWriteNow;
                    }
                }
            }
            else {
                writeoffset += filldist;
                this.yyb_UpdateUsedSize(writeoffset);
            }

            virtualoffset += filldist;
            byteswritten += filldist;
            startvirtualoffset = virtualoffset;

            // Check for end condition
            if ((byteswritten + typesize) <= _size) {
                bWritingData = true;
            }
        }
    }

    return;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_poke = function(_type, _offset, _value) {

    if (_offset < 0)
        return;

    var size = BufferSizeOf(_type);

    if (this.m_Type != eBuffer_Format_Wrap) {
        if (_offset > (this.m_Size - size))
            return 0; // can't write off the end of the buffer
    }
    else {
        while (_offset >= this.m_Size) {
            _offset -= this.m_Size;
        }
    }

    switch (_type) {

        case eBuffer_Bool:
            if (_value == true) {
                _value = 1;
            } else {
                _value = 0;
            }/*jshint -W086*/       // disable break expected

        case eBuffer_U8:
            this.m_DataView.setUint8(_offset, _value);
            this.yyb_UpdateUsedSize(_offset + 1);
            return;
            //break;
        case eBuffer_S8:
            this.m_DataView.setInt8(_offset, _value);
            this.yyb_UpdateUsedSize(_offset + 1);
            return;
            //break;

        case eBuffer_U16:
            this.m_DataView.setUint16(_offset, _value, true);
            break;
        case eBuffer_S16:
            this.m_DataView.setInt16(_offset, _value, true);
            break;

        case eBuffer_S32:
            this.m_DataView.setInt32(_offset, _value, true);
            break;
        case eBuffer_U32:
            this.m_DataView.setUint32(_offset, _value, true);
            break;
        case eBuffer_F32:
            this.m_DataView.setFloat32(_offset, _value, true);
            break;
        case eBuffer_F64:
            this.m_DataView.setFloat64(_offset, _value, true);
            break;
        case eBuffer_U64:
            var int64Val = yyGetInt64(_value);
            this.m_DataView.setUint32(_offset, int64Val.low, true);
            this.m_DataView.setUint32(_offset + 4, int64Val.high, true);
            break;
        case eBuffer_String:
        case eBuffer_Text:
            {               
                for (var i = 0; i < _value.length; i++) {
                    var charCode = _value.charCodeAt(i) & 0xff;   // Now UTF8, so only a byte in size
                    this.m_DataView.setUint8(_offset++, charCode, true);
                }
                // "text" mode doesn't add a NULL at the end.
                if (_type === eBuffer_String) {
                    this.m_DataView.setUint8(_offset++, 0, true);
                }
                this.yyb_UpdateUsedSize(_offset);
            }
            return;
            //break;
    }
    this.yyb_UpdateUsedSize(_offset + size);
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyBuffer.prototype.yyb_seek = function(_base, _offset) {


    switch (_base) {
        case eBuffer_Start:
            if (_offset < 0) _offset = 0;
            this.m_BufferIndex = _offset;
            break;
        case eBuffer_Relative:
            this.m_BufferIndex += _offset;
            if (this.m_BufferIndex < 0) this.m_BufferIndex = 0;
            break;
        case eBuffer_End:
            this.m_BufferIndex = this.m_Size - _offset;
            if (this.m_BufferIndex > this.m_Size) this.m_BufferIndex = this.m_Size;
            break;
    }

    return this.m_BufferIndex;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_seek(buffer, base, offset) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return 0;

    return pBuff.yyb_seek(yyGetInt32(base), yyGetInt32(offset));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_read(buffer, type) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return 0;
    return pBuff.yyb_read(yyGetInt32(type));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_peek(buffer, offset, type) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return 0;
    return pBuff.yyb_peek(yyGetInt32(type), yyGetInt32(offset));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_poke(buffer, offset, type, value) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return 0;
    return pBuff.yyb_poke(yyGetInt32(type), yyGetInt32(offset), value);
}



function  buffer_create_from_vertex_buffer( vbindex, _type, _alignment )
{
    vbindex = yyGetInt32(vbindex);

    if(vbindex>=g_vertexBuffers.length || vbindex <0)
    {
        console.log("buffer_create_from_vertex_buffer: Specified vertex buffer doesn't exist.");
        return -1;
    }

    _alignment = yyGetInt32(_alignment);

    var vbuff = g_vertexBuffers[vbindex];
    if (vbuff)
    {
        if(vbuff.m_frozen)
        {
            console.log("buffer_create_from_vertex_buffer: Can't create buffer from frozen vertex buffer.");
            return -1;
        }

        if (vbuff.GetVertexCount() == 0 || vbuff.GetFormat() == null)
        {
            console.log("buffer_create_from_vertex_buffer: Can't create buffer from empty vertex buffer.");
            return -1;
        }
        if(_alignment<1 || _alignment >1024)
        {
            console.log("buffer_create_from_vertex_buffer: Illegal alignment size");
            return -1;
        }
        var size = vbuff.GetVertexCount() * vbuff.GetFormat().ByteSize;

        var buffindex = buffer_create(size, yyGetInt32(_type), _alignment);
        if (buffindex >= 0)
        {
            var buffobj = g_BufferStorage.Get(buffindex);
            var ua0 = new Int8Array(vbuff.GetArrayBuffer(), 0, vbuff.GetVertexCount() * vbuff.GetFormat().ByteSize);
            var ua1 = new Int8Array(buffobj.m_pRAWUnderlyingBuffer);
            for (var i = 0; i < size; i++)
                ua1[i] = ua0[i];
            buffobj.m_UsedSize = size;
            return buffindex;
        }
        else
        {
            console.log("buffer_create_from_vertex_buffer: unable to create buffer");
        }


    }

    return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function  buffer_create_from_vertex_buffer_ext( vbindex, _type, _alignment, _startVertex, _numVerts )
{
    vbindex = yyGetInt32(vbindex);

    if(vbindex>=g_vertexBuffers.length || vbindex <0)
    {
        console.log("buffer_create_from_vertex_buffer_ext: Specified vertex buffer doesn't exist.");
        return -1;
    }

    _alignment = yyGetInt32(_alignment);

    var vbuff = g_vertexBuffers[vbindex];
    if (vbuff)
    {
        if(vbuff.m_frozen)
        {
            console.log("buffer_create_from_vertex_buffer_ext: Can't create buffer from frozen vertex buffer.");
            return -1;
        }

        if (vbuff.GetVertexCount() == 0 || vbuff.GetFormat() == null)
        {
            console.log("buffer_create_from_vertex_buffer_ext: Can't create buffer from empty vertex buffer.");
            return -1;
        }
        if(_alignment<1 || _alignment >1024)
        {
            console.log("buffer_create_from_vertex_buffer: Illegal alignment size");
            return -1;
        }
        var size = yyGetInt32(_numVerts) * vbuff.GetFormat().ByteSize;
        var offset = yyGetInt32(_startVertex) * vbuff.GetFormat().ByteSize;

        var buffindex = buffer_create(size, yyGetInt32(_type), _alignment);
        if (buffindex >= 0)
        {
            var buffobj = g_BufferStorage.Get(buffindex);
            var ua0 = new Int8Array(vbuff.GetArrayBuffer(), offset, size);
            var ua1 = new Int8Array(buffobj.m_pRAWUnderlyingBuffer);
            for (var i = 0; i < size; i++)
                ua1[i] = ua0[i];
            buffobj.m_UsedSize = size;
            return buffindex;
        }
        else
        {
            console.log("buffer_create_from_vertex_buffer: unable to create buffer");
        }


    }

    return -1;
}

function buffer_copy_from_vertex_buffer( vbindex, _startVertex, _numVerts, _bufferIndex, _destOffset)
{
    vbindex = yyGetInt32(vbindex);

    if(vbindex>=g_vertexBuffers.length || vbindex <0)
    {
        console.log("buffer_copy_from_vertex_buffer: Specified vertex buffer doesn't exist.");
        return -1;
    }

    var vbuff = g_vertexBuffers[vbindex];
    if (vbuff)
    {
        if(vbuff.m_frozen)
        {
            console.log("buffer_copy_from_vertex_buffer: Can't create buffer from frozen vertex buffer.");
            return -1;
        }

        if (vbuff.GetVertexCount() == 0 || vbuff.GetFormat() == null)
        {
            console.log("buffer_copy_from_vertex_buffer: Can't create buffer from empty vertex buffer.");
            return -1;
        }

        var numVerts = yyGetInt32(_numVerts);
        var startVertex = yyGetInt32(_startVertex);

        if (numVerts <= 0) {
            console.log("buffer_copy_from_vertex_buffer: specified number of vertices is invalid");
            return -1;             
        }

        if ((startVertex < 0) || (startVertex >= vbuff.GetVertexCount()))  {
            console.log("buffer_copy_from_vertex_buffer: specified start vertex is out of range");
            return -1;             
        }

        if ((startVertex + numVerts) > vbuff.GetVertexCount()) {
            numVerts = vbuff.GetVertexCount() - startVertex;
        } // end if

        var pBuff = g_BufferStorage.Get(yyGetInt32(_bufferIndex));
        if (!pBuff) {
            console.log("buffer_copy_from_vertex_buffer: specified buffer does not exist");
            return -1; 
        } // end if

        if ((_destOffset < 0) || (_destOffset > pBuff.m_Size)) {
            console.log("buffer_copy_from_vertex_buffer: destination offset is out of range of the destination buffer");
            return -1; 
        } // end if

        var size = numVerts * vbuff.GetFormat().ByteSize;
        var offset = startVertex * vbuff.GetFormat().ByteSize;

        // RK :: TODO this needs to handle grow buffers and other things like that....
        var ua0 = new Int8Array(vbuff.GetArrayBuffer(), offset, size);
        var ua1 = new Int8Array(pBuff.m_pRAWUnderlyingBuffer);
        for (var i = 0; i < size; i++)
            ua1[i+_destOffset] = ua0[i];

        return _bufferIndex;
    } // end if

    return -1;

}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_create(_size, _type, _alignment) {

    try {
        return g_BufferStorage.Add(new yyBuffer(yyGetInt32(_size), yyGetInt32(_type), yyGetInt32(_alignment)));
    } catch (e) {

        alert("ArrayBuffer Error : This functionality requires at least IE10 " + e);
        return -1;
    }        
}

function buffer_allocate(_srcByteBuffer) {

    try {
        return g_BufferStorage.Add(new yyBuffer(_srcByteBuffer.length, eBuffer_Format_Fixed, 1, _srcByteBuffer));
    } catch (e) {

        alert("ArrayBuffer Error : This functionality requires at least IE10 " + e);
        return -1;
    }        
}

// #############################################################################################
/// Function:<summary>
///             Does buffer exist?
///          </summary>
// #############################################################################################
function buffer_exists(_handle){
    var pBuff = g_BufferStorage.Get(yyGetInt32(_handle));
    if (!pBuff) return 0; 
    return 1;
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_write( _index, _type, _value ) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_write(yyGetInt32(_type), _value);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_tell(_index) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.m_BufferIndex;

}

// #############################################################################################
// Function:
//              Copy bytes from one buffer to another
//          </summary>
//  In:     _pDest          Destination Buffer
//          _pSrc           Source Buffer
//          _src_mem_size   How big is the memory buffer?
//          _src_offset     offset into buffer
//          _src_size       Number of bytes to try and copy
//          _dest_offset    Destination offset
//          _grow           Grow dest buffer?
//          _wrap           Wrap dest buffer?
//          _src_wrap       Source is a wrapping buffer?
//
// #############################################################################################
function CopyMemoryToBuffer(_pDest, _pSrc, _src_mem_size, _src_offset, _src_size, _dest_offset, _grow, _wrap, _src_wrap)
{

	if (_src_mem_size <= 0)
		return 0;

	// Clamp source offset and size to valid values	
	if (_src_size < 0)
	    _src_size = _src_mem_size;


	if (_src_wrap) {
	    while (_src_offset < 0)
	        _src_offset += _src_mem_size;

	    while (_src_offset >= _src_mem_size)
	        _src_offset -= _src_mem_size;

	    if ((_src_offset + _src_size) <= _src_mem_size)
	        _src_wrap = false;	// no need to wrap the source
	}
	else
	{
	    if (_src_offset < 0)
	        _src_offset = 0;

	    if (_src_offset >= _src_mem_size)
	        _src_offset = _src_mem_size - 1;

	    if ((_src_offset + _src_size) > _src_mem_size)
	        _src_size = _src_mem_size - _src_offset;
	}
	
	var dest_size = _src_size;	

	// Clamp dest offset and dest size to valid values
	if (!_grow)
	{
		if (_pDest.m_Size <= 0)
		{
			// This'll never work - bail			
			return 0;
		}		

		if (_wrap)
		{
			while(_dest_offset < 0)
				_dest_offset += _pDest.m_Size;

			while(_dest_offset >= _pDest.m_Size)
				_dest_offset -= _pDest.m_Size;			

			if ((_dest_offset + dest_size) <= _pDest.m_Size)
				_wrap = false;	// disable wrapping if the source data won't extend past the edge of the buffer
		}
		else
		{
			if (_dest_offset < 0)
				_dest_offset = 0;

			if (_dest_offset >= _pDest.m_Size)
				_dest_offset = _pDest.m_Size - 1;				

			if ((_dest_offset + dest_size) > _pDest.m_Size)
				dest_size = _pDest.m_Size - _dest_offset;
		}
	}
	else
	{
		// Work out if we need to resize the buffer
		if (_dest_offset < 0)
			_dest_offset = 0;

		if ((_dest_offset + dest_size) > _pDest.m_Size)
		{
			// Resize the buffer
			var newsize = _dest_offset + dest_size;
			_pDest.yyb_resize( newsize );					
		}
	}
							
	//m_BufferIndex = 0;			

    var srcbytebuff = new Uint8Array(_pSrc.m_pRAWUnderlyingBuffer);
    var dstbytebuff = new Uint8Array(_pDest.m_pRAWUnderlyingBuffer);
    var i;
	if (_wrap || _src_wrap)
	{
		var amountToCopy = dest_size;
		while(amountToCopy > 0)
		{
			var amountToCopyNow = yymin(amountToCopy, (_pDest.m_Size - _dest_offset));
			amountToCopyNow = yymin(amountToCopyNow, _src_mem_size - _src_offset);
			
			 for (i = 0; i < amountToCopyNow; i++) {
                dstbytebuff[_dest_offset + i] = srcbytebuff[_src_offset + i];
            }
			//memcpy(_pDest->m_pMemory + _dest_offset, _pSrcMem + _src_offset, amountToCopyNow);				
			 _dest_offset += amountToCopyNow;
			 this.yyb_UpdateUsedSize(_dest_offset);
			_src_offset += amountToCopyNow;
			_dest_offset = _dest_offset % _pDest.m_Size;
			_src_offset = _src_offset % _src_mem_size;
			amountToCopy -= amountToCopyNow;
		}
	}
	else
	{
	
	    for (i = 0; i < _src_mem_size; i++) {
	        dstbytebuff[_dest_offset + i] = srcbytebuff[_src_offset + i];
	    }
	    _pDest.yyb_UpdateUsedSize(_dest_offset + dest_size);
		//memcpy(_pDest->m_pMemory + _dest_offset, _pSrcMem + _src_offset, dest_size);	
	}

	return 1;	// success!
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_copy(src_buffer, src_offset, size, dest_buffer, dest_offset) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(src_buffer));
    if (!pBuff) 
        return eBuffer_UnknownBuffer;

    var pDestBuff = g_BufferStorage.Get(yyGetInt32(dest_buffer));
    if (!pDestBuff)
        return eBuffer_UnknownBuffer;

  	var grow;
	if ((pDestBuff.m_Type == eBuffer_Format_Grow) || (pDestBuff.m_Size == 0))
		grow = true;
	else
		grow = false;

	var wrap;
	if (pDestBuff.m_Type == eBuffer_Format_Wrap)
		wrap = true;
	else
		wrap = false;

	var src_wrap;
	if (pBuff.m_Type == eBuffer_Format_Wrap)
		src_wrap = true;
	else
		src_wrap = false;

    //function CopyMemoryToBuffer(_pDest, _pSrc, _src_mem_size, _src_offset, _src_size, _dest_offset, _grow, _wrap, _src_wrap)
	var success = CopyMemoryToBuffer(pDestBuff, pBuff, pBuff.m_Size, yyGetInt32(src_offset), yyGetInt32(size), yyGetInt32(dest_offset), grow, wrap, src_wrap);

}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_get_type(_index)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.m_Type;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_get_alignment(_index)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.m_Alignment;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_get_size(_index) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.m_Size;

}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_resize(_index, _newsize) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_resize(yyGetInt32(_newsize));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_sizeof(_type) {
    return BufferSizeOf(yyGetInt32(_type));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_fill(buffer, offset, type, value, size) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_fill(yyGetInt32(offset), yyGetInt32(size), yyGetInt32(type), value, -1, true);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_md5(buffer, offset, size)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_md5(yyGetInt32(offset), yyGetInt32(size));
}

function buffer_crc32( buffer, offset, size)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_crc32(yyGetInt32(offset), yyGetInt32(size));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_sha1(buffer, offset, size) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_sha1(yyGetInt32(offset), yyGetInt32(size));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_base64_encode(buffer, offset, size) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_base64encode(yyGetInt32(offset), yyGetInt32(size));
}


function is_base64(c) {
    return (isalnum(c) || (c == '+') || (c == '/'));
}


function base64_decoded_length(stringtodecode) {

    var enc_len = stringtodecode.length;

    var enc_trailing_char_pos = ((enc_len + 3) & ~3) - 4;		

    var extra_bytes = 0;
    if (enc_trailing_char_pos > 0)
    {		
        var currpos = enc_trailing_char_pos + 1;		// don't care about the 4th last character as we need at least 2 in a 'quartet' to form a byte
        while ((currpos <= enc_len) && (stringtodecode.charAt(currpos) != '=') && is_base64(stringtodecode.charAt(currpos)))
        {
            extra_bytes++;
            currpos++;
        }
    }

    // Figure out number of decoded bytes minus trailing characters
    var dec_len = (enc_trailing_char_pos / 4) * 3;
    dec_len += extra_bytes;

    return dec_len;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_base64_decode(stringtodecode) {

    stringtodecode = yyGetString(stringtodecode);

    var decodedlength = base64_decoded_length(stringtodecode);
    var iBuff = buffer_create(decodedlength, eBuffer_Format_Fixed, 1);
    var pBuff = g_BufferStorage.Get(iBuff);
    if (!pBuff) return eBuffer_UnknownBuffer;
    pBuff.yyb_base64decode(stringtodecode, 0);
    pBuff.yyb_UpdateUsedSize(decodedlength, true);
    return iBuff;
}

function buffer_compress(_bufferid, _offset, _size)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_bufferid));
    if (!pBuff) return eBuffer_UnknownBuffer;

    var compressed = pBuff.yyb_compress(yyGetInt32(_offset), yyGetInt32(_size));
    if( compressed != undefined && compressed.length > 0)
    {
        //return new buffer with compressed data
        var index = buffer_allocate(compressed);
        return index;        
    }
    return -1;
}

function buffer_decompress(_bufferId)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_bufferId));
    if (!pBuff) return eBuffer_UnknownBuffer;

    var decompressed = pBuff.yyb_decompress();
    if( decompressed != undefined && decompressed.length > 0)
    {
        //return new buffer with decompressed data
        var index = buffer_allocate(decompressed);
        return index;
    }
    return -1;
}





// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_base64_decode_ext(buffer, stringtodecode, offset) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));    
    if (!pBuff) return eBuffer_UnknownBuffer;
    var decodedlength = base64_decoded_length(stringtodecode);
    if ((offset + decodedlength) > pBuff.m_Size) {
        pBuff.yyb_resize( offset + decodedlength);
    } //end if 
    pBuff.yyb_UpdateUsedSize(offset+decodedlength);
    pBuff.yyb_base64decode(yyGetString(stringtodecode), yyGetInt32(offset));    
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_save(buffer, filename) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_save(yyGetString(filename),0,pBuff.m_Size);
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_delete(_index) {

    _index = yyGetInt32(_index);

    var pBuff = g_BufferStorage.Get(_index);
    if (!pBuff) return eBuffer_UnknownBuffer;

    pBuff.m_pRAWUnderlyingBuffer = null;
    pBuff.m_DataView = null;
    g_BufferStorage.DeleteIndex(_index);
    
    return 0;
}

function buffer_async_group_begin() {
    ErrorFunction("buffer_async_group_begin()");
}
function buffer_async_group_option(){
    ErrorFunction("buffer_async_group_option()");
}
function buffer_async_group_end() {
    return g_LastAsyncLoad;
}
var g_LastAsyncLoad = -1;
// #############################################################################################
/// Function:<summary>
///             Load buffer in a binary format (async)
///          </summary>
/// In:		 <param name="_buffer">pre-allocated buffer index</param>
/// In:		 <param name="_fname">filename to load</param>
/// In:		 <param name="_offset">offset into buffer to START file at</param>
/// In:		 <param name="_size">number of bytes to load, or -1 for all</param>
// #############################################################################################
function buffer_load_async(_buffer, _fname, _offset, _size) {

    _buffer = yyGetInt32(_buffer);
    _fname = yyGetString(_fname);
    _offset = yyGetInt32(_offset);

    var pBuff = g_BufferStorage.Get(_buffer);
    if (!pBuff) return -1;
    
    // Try and load from local storage first
    var pTextFile = LoadBinaryFile_Block(_fname, true);
    if (pTextFile)
    {
        if (_size >= 0 && pTextFile.length > _size)
        {
            pTextFile = pTextFile.slice(0, _size);
        }

        var oldPos = pBuff.m_BufferIndex;

        pBuff.m_BufferIndex = _offset;
        pBuff.yyb_write(eBuffer_Text, pTextFile);

        pBuff.m_BufferIndex = oldPos;
        
        var pFile = g_pASyncManager.Add(_buffer, _fname, ASYNC_BINARY, undefined);
        pFile.m_Complete = true;
        pFile.m_Status = 200;   // HTTP okay
        g_LastErrorStatus = 0;
        return _buffer;
    }
    
    // kick off a load, and then file an async callback
    try{
        _fname = CheckWorkingDirectory(_fname);
        var X = new XMLHttpRequest();   //!window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
        X.open("GET", _fname, true);
        X.responseType = "arraybuffer";
        X.onload = ASync_ImageLoad_Callback;
        X.ms_offset = _offset;
        X.ms_size = yyGetInt32(_size);
        X.ms_filename = _fname;
        X.ms_buffer = _buffer;
       
        g_pASyncManager.Add(_buffer, _fname, ASYNC_BINARY, X);
        X.send(null);
        g_LastErrorStatus = X.status;
                        
    }catch(e){
        return -1;
    }
    g_LastAsyncLoad = _buffer;
    return _buffer;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_load(_fname) {
    
    _fname = yyGetString(_fname);
    var shouldDecode = true;

    var pTextFile = LoadBinaryFile_Block(_fname, true);
    if (pTextFile == null)
    {
        pTextFile = LoadBinaryFile_Block(_fname, false);
        shouldDecode = false;
    }
    if (pTextFile == null) return -1;

    if(shouldDecode)
    {
        return buffer_base64_decode(pTextFile);
    }
    else
    {
        var ret = new ArrayBuffer( pTextFile.length );
        var retView = new Uint8Array(ret);
        for( var i=0; i<pTextFile.length ; ++i) {
            retView[i] = pTextFile.charCodeAt(i) & 0xff;
        } // end for
        return buffer_allocate(retView);
    }
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_save_ext(buffer, filename, offset, size) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;
    return pBuff.yyb_save(yyGetString(filename), yyGetInt32(offset), yyGetInt32(size));
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_save_async(buffer, filename, offset, size) {

    buffer = yyGetInt32(buffer);
    filename = yyGetString(filename);

    buffer_save_ext(buffer, filename, yyGetInt32(offset), yyGetInt32(size));

    var pFile = g_pASyncManager.Add(buffer, filename, ASYNC_BINARY, undefined);
    g_LastErrorStatus = 0;

    pFile.m_Complete = true;
    pFile.m_Status = 200;   // HTTP okay
    return buffer;

}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_load_ext(buffer, filename, offset) {
   var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
   var dstbytebuff = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);
   buffer_load_partial(buffer, filename, 0, dstbytebuff.length - offset, offset)
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function buffer_load_partial(buffer, filename, src_offset, len, dst_offset) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (!pBuff) return eBuffer_UnknownBuffer;

    filename = yyGetString(filename);
    dst_offset = yyGetInt32(dst_offset);

    var shouldDecode = true;

    var pTextFile = LoadBinaryFile_Block(filename, true);
    if (pTextFile == null)
    {
        pTextFile = LoadBinaryFile_Block(filename, false);
        shouldDecode = false;
    }
    if (pTextFile == null) return -1;

    var dstbytebuff = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);

    if(shouldDecode)
    {
        var decodedlength = base64_decoded_length(pTextFile);
        if ((dst_offset + decodedlength) > pBuff.m_Size) {
            pBuff.yyb_resize( dst_offset + decodedlength);
            dstbytebuff = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);
        } //end if 
        pBuff.yyb_UpdateUsedSize(dst_offset+decodedlength);
        Base64DecodeBin(pTextFile, len, dstbytebuff, dst_offset, false, yyGetInt32(src_offset));
    }
    else
    {
        var ret = new ArrayBuffer( pTextFile.length );
        var retView = new Uint8Array(ret);
        for( var i=0; i<pTextFile.length ; ++i) {
            retView[i] = pTextFile.charCodeAt(i) & 0xff;
        } // end for
        var i, j;
        if ((dst_offset + len) > pBuff.m_Size) {
            pBuff.yyb_resize( dst_offset + len);
            dstbytebuff = new Uint8Array(pBuff.m_pRAWUnderlyingBuffer);
        } //end if 
        pBuff.yyb_UpdateUsedSize(dst_offset+len);
	    for (i = dst_offset, j = src_offset; i < dstbytebuff.length && j < retView.length; i++, j++) {
            dstbytebuff[i] = retView[j];
	    }
    }
}

// #############################################################################################
/// Function:<summary>
///          	Get the underlying buffer - as close to an address as we can get in HTML5
///          </summary>
///
/// In:		<param name="_index">buffer index</param>
/// Out:	<returns>
///				The ArrayBuffer() object, or undefined
///			</returns>
// #############################################################################################
function buffer_get_address(_index) {
    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return undefined;

    return pBuff.m_pRAWUnderlyingBuffer;
}


// #############################################################################################
/// Function:<summary>
///          	Get a surface (CANVAS) into a buffer
///          </summary>
///
/// In:		<param name="_buffer">Buffer to copy into</param>
/// In:		<param name="_surface">Surface we're copying from</param>
///			<param name="_mode">image processin mode 0=copy</param>
///			<param name="_offset">offset into buffer</param>
///			<param name="modulo">line modulo</param>
///				
// #############################################################################################
function buffer_get_surface(_buffer, _surface, _offset) {
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));
    var pSurf = g_Surfaces.Get(yyGetInt32(_surface));
    if (!pBuff || !pSurf) return false;


    var data = null;
    var pImg = pSurf.graphics;
    
    try {
        // This function cannot be called if the image is not from the same domain. You'll get security error if you do.
        data = pImg._getImageData(0, 0, pSurf.m_Width, pSurf.m_Height);
    } catch (ex) {
        return false;		// cant read surface
    }
    var rawbuff = data.data;
    pBuff.yyb_seek(eBuffer_Start, yyGetInt32(_offset));
    // Copy surface into dest buffer    
    for (var i = 0; i < rawbuff.length; i++) {
        pBuff.yyb_poke(eBuffer_U8, i, rawbuff[i]);
    }
    return true;
}


function buffer_set_used_size(_index, _size)
{

    var pBuff = g_BufferStorage.Get(yyGetInt32(_index));
    if (!pBuff) return false;


    pBuff.yyb_UpdateUsedSize(yyGetInt32(_size));

}

// #############################################################################################
/// Function:<summary>
///          	Put the contents of a buffer into a surface
///          </summary>
///
/// In:		<param name="_buffer">Buffer to copy from</param>
/// In:		<param name="_surface">Surface we're copying into</param>
///			<param name="_mode">image processin mode 0=copy</param>
///			<param name="_offset">offset into buffer</param>
///			<param name="modulo">line modulo</param>
///
// #############################################################################################
function buffer_set_surface(_buffer, _surface, _offset)
{
    var pBuff = g_BufferStorage.Get(yyGetInt32(_buffer));
    var pSurf = g_Surfaces.Get(yyGetInt32(_surface));
    if (!pBuff || !pSurf) return false;


    var data = null;
    var pImg = pSurf.graphics;

    try {
        // Make new image data with space for the data
        var imgData = pImg.createImageData(pSurf.m_Width, pSurf.m_Height);
        var data = imgData.data;

        // Copy in data
        var len = pSurf.m_Width * pSurf.m_Height * 4;
        for (var i = 0; i < len; i++) {
            data[i] = pBuff.yyb_peek(eBuffer_U8, i+_offset);
        }

        // SET the image data
        pImg._putImageData(imgData, 0, 0);
    } catch (ex) {
        return false;		// Error setting surface
    }

    return true;
}

