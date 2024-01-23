// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyVertexBuilder.js
// Created:	        06/09/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	Vertex buffer management for WebGL
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 06/09/2011		V1.0        MJD     1st version - based on the C++ runner.
// 
// **********************************************************************************************************************
/** @constructor */
function yyVBufferManager(_commandBuilder,_renderStateManager) {
    
    var gl = this._gl;

	var m_VBufferTypes = [];	
	
	var m_vertexStart = 0,
	    m_lastTexture = null,
	    m_pLastBuff = null,
	    m_lastPrim = yyGL.PRIM_NONE,
	    m_lastShader = null;
	
	var m_commandBuilder = _commandBuilder;   
	var m_renderStateManager = _renderStateManager;

    // #############################################################################################
    /// Function:<summary>
    ///          	Allow for user specified FVFs
    ///          </summary>
    // #############################################################################################    
    /** @this {yyVBufferManager} */
    this.RegisterFVF = function (_FVF) {

        if (m_VBufferTypes[_FVF]) {
            debug("WARNING: Vertex format has already been registered\n");
        }
        else {
            m_VBufferTypes[_FVF] = new yyList(); 	// Allocate the list of yyVBuffers to maintain
        }
    }; 

    // #############################################################################################
    /// Function:<summary>
    ///          	Dispatch the given vbuffer for rendering
    ///          </summary>
    // #############################################################################################
    /** @this {yyVBufferManager} */
    this.Dispatch = function (_prim, _texture, _vbuffer, _vertexStart, _vertexCount) {
		var size = (_vertexCount === undefined)
			? _vbuffer.Current - _vertexStart
			: _vertexCount;

        switch (_prim)
    	{
    		case yyGL.PRIM_TRIANGLE:
    			m_commandBuilder.SetTexture(0, _texture);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawTriangle(_vertexStart, size);
    			break;

    		case yyGL.PRIM_TRIFAN:
    			m_commandBuilder.SetTexture(0, _texture);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawTriFan(_vertexStart, size);
    			break;

    		case yyGL.PRIM_TRISTRIP:
    			m_commandBuilder.SetTexture(0, _texture);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawTriStrip(_vertexStart, size);
    			break;

    		case yyGL.PRIM_LINE:
    			m_commandBuilder.SetTexture(0, null);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawLine(_vertexStart, size);
    			break;

    		case yyGL.PRIM_LINESTRIP:
    			m_commandBuilder.SetTexture(0, null);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawLineStrip(_vertexStart, size);
    			break;

    		case yyGL.PRIM_POINT:
    			m_commandBuilder.SetTexture(0, null);
    			m_commandBuilder.SetVertexBuffer(_vbuffer);
    			m_commandBuilder.DrawPoint(_vertexStart, size);
    			break;
    	}
    };

    // #############################################################################################
    /// Function:<summary>
    ///          	Flush the current "batch"
    ///          </summary>
    ///
    /// In:		<param name="_prim"></param>
    ///			<param name="_texture"></param>
    ///			<param name="_size"></param>
    ///			<param name="_space"></param>
    /// Out:	<returns>
    ///				
    ///			</returns>
    // #############################################################################################
    /** @this {yyVBufferManager} */
    this.Flush = function () {

    	if (m_pLastBuff == null)
		{
			m_renderStateManager.Flush();	// still flush states
			return;
		}
    	
    	this.Dispatch(m_lastPrim, m_lastTexture, m_pLastBuff, m_vertexStart);

    	m_pLastBuff = m_lastTexture = null;
    	m_lastPrim = yyGL.PRIM_NONE;
		m_renderStateManager.Flush();
    };


    // #############################################################################################
    /// Function:<summary>
    ///          	Allocate space for our vertices
    ///          </summary>
    ///
    /// In:		<param name="_prim">PRIM type (triangles, points, lines etc)</param>
    ///			<param name="_pTexture">libWebGL texture</param>
    ///			<param name="_FVF">Flexible vertex format identifier</param>
    ///			<param name="_space">Number of vertices to allocate space for</param>
    /// Out:	<returns>
    ///				Vertex buffer with enough space.
    ///			</returns>
    // #############################################################################################
    /** @this {yyVBufferManager} */
    this.AllocVerts = function (_prim, _pTexture, _FVF, _space, _vertexFormat, _frameCount) {

    	var i, pBuffList, pBuff, pTexture;    	
    	pTexture = _pTexture;

    	if (m_pLastBuff != null)
    	{
    		// Try and fill the same buffer as before... IF it's the same format.
    		if ((m_pLastBuff.FVF == _FVF) && 
    		    ((m_pLastBuff.Current + _space) <= m_pLastBuff.Max) && 
    		    (m_lastTexture == pTexture) && 		    
    		    (m_lastPrim == _prim) && 
    		    ((_prim != yyGL.PRIM_LINESTRIP) && (_prim != yyGL.PRIM_TRISTRIP) && (_prim != yyGL.PRIM_TRIFAN)) &&
				(m_renderStateManager.AnyChange() == false))
    		{    			
    			return m_pLastBuff;
    		}
    		else
    		{
    			var buff = m_pLastBuff;
    			g_webGL.Flush();
    			//this.Flush();
    			// Check to see theres still space in the buffer we used last. This saves us searching for another one, and saves swapping buffers.
    			if ((buff.FVF == _FVF) && ((buff.Current + _space) <= buff.Max))
    			{
    				m_pLastBuff = buff;
    				m_vertexStart = buff.Current;
    				m_lastPrim = _prim;
    				m_lastTexture = pTexture;
    				return m_pLastBuff;
    			}
    		}
    	}
    	else
    		this.Flush();


    	m_lastPrim = _prim;
    	m_lastTexture = pTexture;

    	// If not the same format, OR the last buffer ran out of space... FLUSH first
    	pBuffList = m_VBufferTypes[_FVF].pool; // Get the list of vertex buffers for THIS vertex format
    	for (i = pBuffList.length - 1; i >= 0; i--)
    	{
    		pBuff = pBuffList[i];
    		// If this hasn't already been filled+used
    		if (((pBuff.FrameLock+1) < _frameCount) && (pBuff.Current + _space) <= pBuff.Max)
    		{
    			pBuff.Dirty = true;
    			m_vertexStart = pBuff.Current;
    			m_pLastBuff = pBuff;
    			return pBuff;
    		}
    	}

    	// If we don't find one, then allocate a new VBuffer
    	if (_space < DEFAULT_VB_SIZE) { 
    	    _space = DEFAULT_VB_SIZE;
    	}
    	
    	pBuff = new yyVBuffer(_space, _vertexFormat, true);
    	pBuff.FVF = _FVF; // NB: Extending the buffer object at this point, which isn't the nicest way of doing it (Object literal m_pLastBuff to have both???)
    	pBuff.Dirty = true;
    	m_vertexStart = pBuff.Current;
    	m_pLastBuff = pBuff;
    	
    	m_VBufferTypes[_FVF].Add(pBuff);
    	return pBuff;
    };
}
