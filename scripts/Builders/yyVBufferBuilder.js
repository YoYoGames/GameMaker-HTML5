// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyVBufferBuilder.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Vertex buffer container
///          </summary>
// #############################################################################################
/** @constructor */	
function yyVBufferBuilder(_size) {        

    var m_arrayBuffer = null,
        m_dataView = null,        
        m_VBuffer = null,
        m_frozen = false,
        m_vertexFormat = null,
        m_FVF;
      
    var m_currentBitMask = 0,
        m_vertexCount = 0,
        m_streamStart = 0,
        m_streamCurrent = 0;

		var m_this = this;

    // #############################################################################################
    /// Function:<summary>
    ///             Constructor: Sets up the storage for this buffer
    ///          </summary>
    // #############################################################################################
    (function () {    
        m_arrayBuffer = new ArrayBuffer(_size);
        m_dataView = new DataView(m_arrayBuffer);
    })();

    // #############################################################################################
    /// Function:<summary>
    ///             Private: Find the next unwritten usage of the given vertex type
    ///          </summary>
    // #############################################################################################
    function FindNextUsage(_usage, _type) {
    	
    	var onefound = false;
        var vertexElements = m_vertexFormat.Format;    
    	for (var i = 0; i < vertexElements.length; i++)	{
    	
    	    var element = vertexElements[i];	    
    		if (((_usage == -1) || (element.usage == _usage)) && (element.type == _type))
    		{
    			onefound = true;
    			// if this element hasn't been written, then use it!
    			if((element.bit & m_currentBitMask) === 0) {
    			
    			    var dataOffset = (m_streamCurrent + element.offset);
    				m_currentBitMask |= element.bit;				
    				
    				// End of THIS vertex being written? if so move the offsets on by a vertex...
    				if (m_vertexFormat.BitMask === m_currentBitMask) {
    				
    				    m_currentBitMask = 0;
    				    m_vertexCount++;					
    					m_streamCurrent += m_vertexFormat.ByteSize;
    					
    					// Check to see if we need to resize the buffer
    					if ((m_streamCurrent + m_vertexFormat.ByteSize) >= m_arrayBuffer.byteLength) {
    					
    					    m_this.Resize(m_arrayBuffer.byteLength * 2);
    					}
    				}
    				return dataOffset;
    			}
    		}		
    	}
    	// if we found one, but it was already written... then it's an error. Whole vertex probably wasn't finished.
    	if (onefound) {
    		debug("VERTEX BUILDER: element already written, must write the whole vertex first\n\n", true);
    		return -1;
    	}
    	// Element not found at all within the vertex format... 
    	debug("VERTEX BUILDER: Vertex format does not contain selected type.\n\n", true);
    	return -1;
    };    

    // #############################################################################################
    /// Function:<summary>
    ///             Resizes the buffer if its size is different than the size provided.
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.Resize = function (_size) {
        if (m_arrayBuffer.byteLength != _size)
        {
            var arrayBufferReplacement = new ArrayBuffer(_size);
                                                        
            var oldBufferView = new Int8Array(m_arrayBuffer);
            var newbufferView = new Int8Array(arrayBufferReplacement);
            newbufferView.set(oldBufferView);
            
            m_arrayBuffer = arrayBufferReplacement;
            m_dataView = new DataView(m_arrayBuffer);
        }
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Sets up the storage for this buffer
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.Begin = function (_FVF) {

        m_currentBitMask = 0;
        m_vertexCount = 0;
        m_streamStart = 0;
        m_streamCurrent = 0;
        
        m_FVF = _FVF;
        m_vertexFormat = g_webGL.GetVertexFormat(_FVF);
        
        // Make sure there's enough space in this buffer for at least one vertex of the given format
        if (m_vertexFormat.ByteSize > m_arrayBuffer.byteLength) {
        
            // Arbitrarily resize to give space for at least a cube's worth of vertices
            this.Resize(m_vertexFormat.ByteSize * 36);
        }
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.End = function () {
    };
    
    this.GetFVF = function () { return m_FVF; };
    this.SetFVF = function (_fvf) {
        m_FVF = _fvf;
        m_vertexFormat = g_webGL.GetVertexFormat(_fvf);
    };
    this.GetFormat = function () { return g_webGL.GetVertexFormat(m_FVF); };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetPosition = function (x, y) {
    
        var dataOffset = FindNextUsage(yyGL.VU_POSITION, yyGL.VT_FLOAT2);
        if (dataOffset >= 0) {
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
        }    
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetPosition3D = function (x, y, z) {
    
        var dataOffset = FindNextUsage(yyGL.VU_POSITION, yyGL.VT_FLOAT3);
        if (dataOffset >= 0) {
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
            m_dataView.setFloat32(dataOffset + 8, z, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetColour = function(_col, _alpha) {
    
        var dataOffset = FindNextUsage(yyGL.VU_COLOR, yyGL.VT_COLOR);
        if (dataOffset >= 0) {
            var colourData = ((_alpha * 255.0) << 24) | ConvertGMColour(_col);
            m_dataView.setUint32(dataOffset, colourData, true);        
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetRGBA = function (_rgba) {
    
        var dataOffset = FindNextUsage(yyGL.VU_COLOR, yyGL.VT_COLOR);
        if (dataOffset >= 0) {                        
        
            // Re-order to opengls expected abgr ordering
            var col = ((_rgba&0xff)<<24) | ((_rgba&0xff00)<<8) | ((_rgba&0xff0000) >> 8) | ((_rgba&0xff000000)>>24);
            m_dataView.setUint32(dataOffset, col, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetARGB = function (_argb) {
    
        var dataOffset = FindNextUsage(yyGL.VU_COLOR, yyGL.VT_COLOR);
        if (dataOffset >= 0) {
        
            // OpenGL works as abgr so flip channels
            var col = (_argb&0xff000000) | ((_argb&0xff)<<16) | (_argb&0xff00) | ((_argb&0xff0000)>>16);
            m_dataView.setUint32(dataOffset, col, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetUV = function (u, v) {
    
        var dataOffset = FindNextUsage(yyGL.VU_TEXCOORD, yyGL.VT_FLOAT2);
        if (dataOffset >= 0) {            
            m_dataView.setFloat32(dataOffset, u, true);
            m_dataView.setFloat32(dataOffset + 4, v, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetNormal = function (x, y, z) {
    
        var dataOffset = FindNextUsage(yyGL.VU_NORMAL, yyGL.VT_FLOAT3);
        if (dataOffset >= 0) {
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
            m_dataView.setFloat32(dataOffset + 8, z, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetFloat1 = function (x) {
    
        var dataOffset = FindNextUsage(-1, yyGL.VT_FLOAT1);
        if (dataOffset >= 0) {            
            m_dataView.setFloat32(dataOffset, x, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetFloat2 = function (x, y) {
    
        var dataOffset = FindNextUsage(-1, yyGL.VT_FLOAT2);
        if (dataOffset >= 0) {            
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetFloat3 = function (x, y, z) {
    
        var dataOffset = FindNextUsage(-1, yyGL.VT_FLOAT3);
        if (dataOffset >= 0) {            
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
            m_dataView.setFloat32(dataOffset + 8, z, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetFloat4 = function (x, y, z, w) {
    
        var dataOffset = FindNextUsage(-1, yyGL.VT_FLOAT4);
        if (dataOffset >= 0) {            
            m_dataView.setFloat32(dataOffset, x, true);
            m_dataView.setFloat32(dataOffset + 4, y, true);
            m_dataView.setFloat32(dataOffset + 8, z, true);
            m_dataView.setFloat32(dataOffset + 12, w, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.SetUByte4 = function (x, y, z, w) {
    
        var dataOffset = FindNextUsage(-1, yyGL.VT_UBYTE4);
        if (dataOffset >= 0) {            
            m_dataView.setUint8(dataOffset, x, true);
            m_dataView.setUint8(dataOffset + 1, y, true);
            m_dataView.setUint8(dataOffset + 2, z, true);
            m_dataView.setUint8(dataOffset + 3, w, true);
        }
    };
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.Freeze = function () {
    
        // Hand create a new VBuffer and set its data
        var vbuffer = new yyVBuffer(m_vertexCount, m_vertexFormat, false);

        // Copy the vertex buffer data across to the VBuffer and freeze it
        var vertexDataSize = m_vertexCount * m_vertexFormat.ByteSize;
        var vertexDataView = new Int8Array(m_arrayBuffer, 0, vertexDataSize);        
        vbuffer.VertexData.set(vertexDataView);
        vbuffer.Current += m_vertexCount;
        vbuffer.Freeze();

        m_VBuffer = vbuffer;
        m_frozen = true;
        m_arrayBuffer = null; // invalidate any further attempts to alter this buffer
        m_dataView = null;  
    };    
    
    // #############################################################################################
    /// Function:<summary>    
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferBuilder} */	
    this.Submit = function(_primType, _texture) {

        if (m_frozen) {

            // Directly submit the vertex buffer
            // (I don't believe a flush is necessary as it shouldn't affect
            // the building up of the current in-flight vertex buffer)
            if (_texture == -1) {
                g_webGL.DispatchVBuffer(_primType,null, m_VBuffer, 0);
            }
            else {
                // Check whether the webgl texture has been initialised yet and do so if not
                if (_texture && !_texture.WebGLTexture.webgl_textureid) {
                    WebGL_BindTexture(_texture.TPE);
                }
                g_webGL.DispatchVBuffer(_primType, _texture.WebGLTexture.webgl_textureid, m_VBuffer, 0);
            }
        }
        else {
            var pBuff;
            if (_texture == -1) {
                pBuff = g_webGL.AllocVerts(_primType, null, m_FVF, m_vertexCount);
            } else {
                // Check whether the webgl texture has been initialised yet and do so if not
                if (_texture && !_texture.WebGLTexture.webgl_textureid) {
                    WebGL_BindTexture(_texture.TPE);
                }
                pBuff = g_webGL.AllocVerts(_primType, _texture.WebGLTexture.webgl_textureid, m_FVF, m_vertexCount);
            }

            // Get the data across
            var currpos = pBuff.Current * m_vertexFormat.ByteSize;

            // Open a data view onto the vertex array to allow for easy copying to the VBuffer vertex data store
            var vertexDataView = new Int8Array(m_arrayBuffer, 0, m_vertexCount * m_vertexFormat.ByteSize);

            // This buffer copy might seem a bit unnecessary but it's there so that the vertex buffer can be reused
            pBuff.VertexData.set(vertexDataView, currpos);
            pBuff.Current += m_vertexCount;
        }
    };

    this.SetVertexCount = function (_count) {
        m_vertexCount = _count;
        m_streamStart = 0;
        m_streamCurrent = _count * m_vertexFormat.ByteSize;

    };

    this.GetVertexCount = function ()
    {
        return m_vertexCount;
    };

    this.GetArrayBuffer = function ()
    {
        return m_arrayBuffer;
    };


}



