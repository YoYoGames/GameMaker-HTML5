// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyVBuffer.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Creates a new VBuffer object
///          </summary>
// #############################################################################################
/** @constructor */
function yyVBuffer(_size, _vertexFormat, _bindgl) {

    // Grab gl from the prototype
    var gl = this._gl;

    // Ideally these would be setup as properties to allow for encapsulation, but since
    // people might hammer vertex buffers each frame and Chrome's defineProperties support
    // is so abject we need to allow for these to be directly accessed. It's like the PSX
    // days all over again!
    this.VertexArrayBuffer = null;
    this.VertexData = null;
    this.GLBuffer= null;
    
    this.Coords = null;
    this.Colours = null;
    this.Normals = null;
    this.UVs = null;
        
    this.VertexFormat = _vertexFormat;

    this.FrameLock = -1;
    this.Current = 0;
    this.Max = _size; 			// Max number of verts this buffer stores            
    this.Dirty = false;		    // flag for new data

    // Call the constructor for the new object
    Construct(this);
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Constructor
    ///          </summary>
    // #############################################################################################
    function Construct(_buffer) {
        
        CreateStorage(_buffer);
        SetDefaultViews(_buffer);

        // Because primitive building re-uses a lot of VBuffer functionality
        // but doesn't want to directly bind its buffers to Opengl buffers
        if (_bindgl) {
            BindBuffer(_buffer);
        }
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Create typed array storage for the buffer
    ///          </summary>
    // #############################################################################################
    function CreateStorage(_buffer) {
    
        // Same as this.GetStride() but "this" is the window when this executes
        var vertexSize = _buffer.VertexFormat.ByteSize;
        _buffer.VertexArrayBuffer = new ArrayBuffer(_size * vertexSize);
        _buffer.VertexData = new Int8Array(_buffer.VertexArrayBuffer);
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Bind opengl buffers to this buffer
    ///          </summary>
    // #############################################################################################
    function BindBuffer(_buffer) {
    
        _buffer.GLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _buffer.GLBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _buffer.VertexData, gl.DYNAMIC_DRAW);
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: Setup views onto the data that we can easily access later
    ///          </summary>
    // #############################################################################################
    function SetDefaultViews(_buffer) {        
        
        var formatElements = _buffer.VertexFormat.Format;    
        for (var n = 0; n < formatElements.length; n++) {
                            
            var formatElement = formatElements[n];
            switch (formatElement.usage) {
            
                case yyGL.VU_POSITION:
                    _buffer.Coords = GetView(formatElement.gltype, _buffer.VertexArrayBuffer, formatElement.offset);
                    break;
                case yyGL.VU_COLOR:
                    _buffer.Colours = GetView(formatElement.gltype, _buffer.VertexArrayBuffer, formatElement.offset);
                    break;
                case yyGL.VU_NORMAL:
                    _buffer.Normals = GetView(formatElement.gltype, _buffer.VertexArrayBuffer, formatElement.offset);
                    break;
                case yyGL.VU_TEXCOORD:
                    _buffer.UVs = GetView(formatElement.gltype, _buffer.VertexArrayBuffer, formatElement.offset);
                    break;
            }
        }        
    }
    
    // #############################################################################################
    /// Function:<summary>
    ///             Private: open a typed view onto the buffer at the given offset
    ///          </summary>
    // #############################################################################################
    function GetView(_gltype, _arrayBuffer, _bufferOffset) {

        switch (_gltype) {
            case gl.UNSIGNED_BYTE:
                return (new Int32Array(_arrayBuffer, _bufferOffset));
            break;
            case gl.FLOAT:
                return (new Float32Array(_arrayBuffer, _bufferOffset));
            break;
        }
        return false;
    }

    // #############################################################################################
    /// Function:<summary>
    ///             Folds vertex buffer data from the given vbuffer into this one
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBuffer} */
    this.Concat = function (_vbuffer) {                        

        // We shouldn't be concatenating buffers with different formats
        if (_vbuffer.GetStride() === this.GetStride()) {
        
            var vertexDataSize = _vbuffer.Current * _vbuffer.GetStride();
            
            var offset = this.Current * this.GetStride();
            if ((offset + vertexDataSize) > this.VertexData.length) {
            
                // Resize to allow for the new data, don't be exact since in the case of huge
                // models (e.g. the demo one) we're just going to end up constantly resizing            
                var vertexArrayBuffer = new ArrayBuffer(this.VertexData.length * 2);
                var vertexData = new Int8Array(vertexArrayBuffer);            
                vertexData.set(this.VertexData);
                
                this.VertexData = vertexData;
                this.VertexArrayBuffer = vertexArrayBuffer;
                SetDefaultViews(this);
            }        
            this.VertexData.set(_vbuffer.VertexData.subarray(0, vertexDataSize), offset);
            this.Current += _vbuffer.Current;
        }
    };

    // #############################################################################################
    /// Function:<summary>
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBuffer} */
    this.Freeze = function() {

        // Resize data to the exact amount required
        if (this.Current < this.max) {
                         
            var vertexDataSize = this.Current * this.GetStride();
            var newArrayBuffer = new ArrayBuffer(vertexDataSize);
            var newVertexData = new Int8Array(newArrayBuffer);
            
            newVertexData.set(this.VertexData.subarray(0, vertexDataSize));
            this.VertexData = newVertexData;        
            this.VertexArrayBuffer = newArrayBuffer;
        }

        this.GLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.GLBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.VertexData, gl.STATIC_DRAW);    

        // Cull data references no longer required    
        this.Coords = null;
        this.Colours = null;
        this.Normals = null;
        this.UVs = null;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Really only for prim builders that make use of common yyVBuffer functionality
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBuffer} */
    this.IncreaseCurrent = function(_inc) {

        if ((this.Current + _inc) > this.max) {
        
            var newSize = this.max * 2;
            this.max = newSize;

            var arrayBufferReplacement = new ArrayBuffer(newSize);
            var newbufferView = new Int8Array(arrayBufferReplacement);
            newbufferView.set(this.VertexData);
                
            this.VertexArrayBuffer = arrayBufferReplacement;    
            SetDefaultViews(this);
        }
        this.Current += _inc;
    };
    

    // #############################################################################################
    /// Function:<summary>
    ///             How many bytes this vertex format covers
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBuffer} */
    this.GetStride = function() {
                
        return this.VertexFormat.ByteSize;
    };    

    // #############################################################################################
    /// Function: <summary>
    ///              If theres new data, then update the buffers
    ///           </summary>
    // #############################################################################################
    /** @this {yyVBuffer} */
    this.UpdateBuffers = function () {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.GLBuffer);
        
        // Only refresh the minimal amount of data        
        var subView = new Int8Array(this.VertexArrayBuffer, 0, this.Current * this.VertexFormat.ByteSize);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, subView);

    	this.Current = 0;
    	this.Dirty = false;
    };
}
