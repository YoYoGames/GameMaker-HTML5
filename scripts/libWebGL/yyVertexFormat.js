// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyVertexFormat.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Container object for vertex formats
///          </summary>
// #############################################################################################
/** @constructor */
function yyVertexFormat() {

    var gl = this._gl;

    var m_formatBit = 1,            // Tracks the order that elements have been added to the vertex format
        m_fixedFunction = false,    // was the format defined by us for use with a "fixed function" pipeline
        m_format = [],              // array of vertex elements
        m_byteSize = 0,             // size of vertex
        m_bitMask = 0;              // mask with ALL bits set                        
        
    this.ShaderCache = [];

    Object.defineProperties(this, {
        Format: { 
            get: function () { return m_format; },
            set: function (val) { m_format = val; }
        },
        BitMask: { 
            get: function () { return m_bitMask; },
            set: function (val) { m_bitMask = val; }
        },
        ByteSize: {
            get: function () { return m_byteSize; },
            set: function (val) { m_byteSize = val; }
        },
        FixedFunction: {
            get: function () { return m_fixedFunction; },
            set: function (val) { m_fixedFunction = val; }
        }
    });
    
    // #############################################################################################
    /// Function:<summary>
    ///             Generates an object literal to store a format element
    ///          </summary>
    // #############################################################################################
    function CreateFormatElement(_type, _usage, _formatBit) {
    
        var element = { 
            offset: m_byteSize,    // offset from the start of the vertex                
            type: _type,           // type from the list above
            usage: _usage,         // usage from the list above
            bit: _formatBit,       // bit used in bitmask verification        
            gltype: 0,             // the type of element used by GL, e.g. gl.FLOAT
            glcomponents: 0,       // the number of components for this entry
            normalised: false            
        };
        return element;
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Add an element to the vertex format
    ///          </summary>
    // #############################################################################################
    function Add(_type, _usage, _formatBit) {    
    
        m_bitMask |= _formatBit;
        
        // Create an object literal to describe this part of the vertex format
        var formatElement = CreateFormatElement(_type, _usage, _formatBit);        
        switch (_type) {
            
            case yyGL.VT_COLOR:
            case yyGL.VT_UBYTE4:
                m_byteSize += 4;
                formatElement.gltype = gl.UNSIGNED_BYTE;
                formatElement.glcomponents = 4;
                formatElement.normalised = true;
            break;
            case yyGL.VT_FLOAT1:
                m_byteSize += 4;            
                formatElement.gltype = gl.FLOAT;
                formatElement.glcomponents = 1;
                formatElement.normalised = false;
            break;
            case yyGL.VT_FLOAT2:
                m_byteSize += 8;
                formatElement.gltype = gl.FLOAT;
                formatElement.glcomponents = 2;
                formatElement.normalised = false;
            break;
            case yyGL.VT_FLOAT3:
                m_byteSize += 12;
                formatElement.gltype = gl.FLOAT;
                formatElement.glcomponents = 3;
                formatElement.normalised = false;
            break;
            case yyGL.VT_FLOAT4:
                m_byteSize += 16;
                formatElement.gltype = gl.FLOAT;
                formatElement.glcomponents = 4;
                formatElement.normalised = false;
            break;
        }    
        m_format.push(formatElement);
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddPosition = function () {
        
        Add(yyGL.VT_FLOAT2, yyGL.VU_POSITION, m_formatBit);
        m_formatBit = m_formatBit << 1;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddPosition3D = function () {
    
        Add(yyGL.VT_FLOAT3, yyGL.VU_POSITION, m_formatBit);
        m_formatBit = m_formatBit << 1;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddColour = function () {
    
        Add(yyGL.VT_COLOR, yyGL.VU_COLOR, m_formatBit);
        m_formatBit = m_formatBit << 1;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddNormal = function () {
    
        Add(yyGL.VT_FLOAT3, yyGL.VU_NORMAL, m_formatBit);
	    m_formatBit = m_formatBit << 1;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddUV = function () {
    
        Add(yyGL.VT_FLOAT2, yyGL.VU_TEXCOORD, m_formatBit);
	    m_formatBit = m_formatBit << 1;
    };
    
    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.AddCustom = function(_type, _usage) {
    
        if ((_type < yyGL.VT_FLOAT1) || (_type > yyGL.VT_MaxType)) {
	    	debug("ERROR vertex_format_add_custom: illegal types");
	    	return;
	    }	    
	    if ((_usage < yyGL.VU_POSITION) || (_usage > yyGL.VU_MaxVertexUsage)) {
	    	debug("ERROR vertex_format_add_custom: illegal usage");
	    	return;
	    }
	    
	    Add(_type, _usage, m_formatBit);
	    m_formatBit = m_formatBit << 1;
    };
       
    // #############################################################################################
    /// Function:<summary>
    ///             Checks to see if a provided format is the same as this
    ///          </summary>
    // #############################################################################################
    /** @this {yyVertexFormat} */
    this.Equals = function (_format) {
    
        if (m_format.length !== _format.Format.length) {
            return false;
        }

        for (var i = 0; i < m_format.length; i++) {
        
            var formatElThis = m_format[i];
            var formatElTest = _format.Format[i];            

            if ((formatElThis.offset !== formatElTest.offset) ||
                (formatElThis.type !== formatElTest.type) ||
                (formatElThis.usage !== formatElTest.usage) ||
                (formatElThis.bit !== formatElTest.bit) ||
                (formatElThis.gltype !== formatElTest.gltype) ||
                (formatElThis.glcomponents !== formatElTest.glcomponents))
            {
                return false;
            }
        }
        return true;
    };
}
