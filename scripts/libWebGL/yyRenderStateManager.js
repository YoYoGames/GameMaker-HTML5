// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyRenderStateManager.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// ############################################################################################# 
/// Function:<summary> 
///             Creates a new state manager for storing and filtering gpu state 
///          </summary> 
// ############################################################################################# 
 
function yyBitField(_numbits) 
{     
    var m_val = []; 
    var m_arraysize; 
 
    (function() { 
     
        // Apparently javascript stores values as doubles, but can only do bitwise operations 
        // on 32 bit values, so we'll store an array of 32 bit chunks 
        if (_numbits == undefined) 
            _numbits = 32; 
 
        m_arraysize = ~~(_numbits / 32); 
        if (m_arraysize == 0) 
            m_arraysize = 1; 
 
        m_val = new Array(m_arraysize); 
 
        for(var i = 0; i < m_arraysize; i++) 
        { 
            m_val[i] = 0x0; 
        } 
    })(); 
 
    this.NumBits = function() 
    { 
        return _numbits; 
    };
 
    this.SetBit = function(_bit) 
    { 
        if (_bit >= _numbits) 
            return; 
 
        var entry = ~~(_bit / 32); 
        var bittoset = _bit - (entry * 32); 
        m_val[entry] |= 1 << bittoset; 
    };
 
    this.ClearBit = function(_bit) 
    { 
        if (_bit >= _numbits) 
            return; 
 
        var entry = ~~(_bit / 32); 
        var bittoset = _bit - (entry * 32); 
        m_val[entry] &= ~(1 << bittoset); 
    };
 
    this.GetBit = function(_bit) 
    { 
        if (_bit >= _numbits) 
            return 0; 
 
        var entry = ~~(_bit / 32); 
        var bittoget = _bit - (entry * 32); 
        var val = (m_val[entry] >> bittoget) & 0x1;  
        return val; 
    };
 
    this.SetAllBits = function() 
    { 
        // Set full DWORDS first 
        var i; 
        for(i = 0; i < (m_arraysize-1); i++) 
        { 
            m_val[i] = 0xffffffff; 
        } 
 
        var bitsleft = _numbits - (i * 32); 
        var j; 
        var bit = 1; 
        for(j = 0; j < bitsleft; j++ ) 
        { 
            m_val[i] |= bit; 
            bit<<=1; 
        } 
         
    };
 
    this.ClearAllBits = function() 
    { 
        for(var i = 0; i < m_arraysize; i++) 
        { 
            m_val[i] = 0x0; 
        }         
    };
 
    this.AnyBitSet = function() 
    { 
        var i; 
        for(i = 0; i < m_arraysize; i++) 
        { 
            if (m_val[i] != 0) 
                return 1; 
        } 
 
        return 0; 
    };
 
    this.Or = function(_other) 
    { 
        // Not particularly efficient 
        // TODO: do in 4 byte chunks 
        var numBits = _other.NumBits() > this.NumBits() ? _other.NumBits() : this.NumBits(); 
        var newBits = new yyBitField(numBits); 
 
        for(var i = 0; i < numBits; i++) 
        { 
            var bitVal = this.GetBit(i) | _other.GetBit(i); 
            if (bitVal == 1)             
            { 
                newBits.SetBit(i); 
            }  
        }         
 
        return newBits; 
    };
 
    this.And = function(_other) 
    { 
        // Not particularly efficient 
        // TODO: do in 4 byte chunks 
        var numBits = _other.NumBits() > this.NumBits() ? _other.NumBits() : this.NumBits(); 
        var newBits = new yyBitField(numBits); 
 
        for(var i = 0; i < numBits; i++) 
        { 
            var bitVal = this.GetBit(i) & _other.GetBit(i); 
            if (bitVal == 1)             
            { 
                newBits.SetBit(i); 
            }   
        }         
 
        return newBits; 
    };
}
 
function yyRenderStateCollection(_numrenderstates, _numsamplers, _numsamplerstates) 
{ 
    var renderStates = []; 
    var samplerStates = [];     
 
    (function() { 
        renderStates = new Array(_numrenderstates); 
        samplerStates = new Array(_numsamplers * _numsamplerstates); 
    })(); 

    Object.defineProperties(this, {
	    m_renderStates: {
	        get: function () { return renderStates; },
            set: function (val) { renderStates = val; }
	    },

        m_samplerStates: {
	        get: function () { return samplerStates; },
            set: function (val) { samplerStates = val; }
	    },
	});
} 
 
/** @constructor */ 
function yyRenderStateManager(_numTextureStages,_stackSize,_commandBuilder,_interpolatePixels) {          
 
    var gl = this._gl; 
 
    // Private data 
    //var m_states = []; 
    var m_current = null; 
    var m_next = null; 
 
    var m_stack = []; 
    var m_stackTop; 
 
    var m_changeFlags = null; 
    var m_changeSamplerFlags = null; 
    var m_anyChange = false; 
 
    var m_commandBuilder = _commandBuilder; 
     
    // ############################################################################################# 
    /// Function:<summary> 
    ///             Constructor 
    ///          </summary> 
    // ############################################################################################# 
    (function() { 
     
        m_changeFlags = new yyBitField(64); 
        m_changeSamplerFlags = new yyBitField(64);                  
 
        m_current = new yyRenderStateCollection(yyGL.RenderState_MAX, _numTextureStages, yyGL.SamplerState_MAX); 
        m_next = new yyRenderStateCollection(yyGL.RenderState_MAX, _numTextureStages, yyGL.SamplerState_MAX); 
 
        m_stack = new Array(_stackSize); 
        for(var i = 0; i < _stackSize; i++) 
        { 
            m_stack[i] = new yyRenderStateCollection(yyGL.RenderState_MAX, _numTextureStages, yyGL.SamplerState_MAX); 
        }         
         
        // Now set the inital state values 
        ResetState(); 
    })(); 
 
    function ResetState(){ 
 
        // Set the initial state to all change 
        m_changeFlags.SetAllBits(); 
        m_changeSamplerFlags.SetAllBits(); 
        m_anyChange = true;        
 
        m_stackTop = 0; 
 
        m_current.m_renderStates[yyGL.RenderState_ZEnable] = false; 
        m_current.m_renderStates[yyGL.RenderState_FillMode] = yyGL.FillMode_Solid; 
        m_current.m_renderStates[yyGL.RenderState_ShadeMode] = yyGL.ShadeMode_Gouraud; 
        m_current.m_renderStates[yyGL.RenderState_ZWriteEnable]=true; 
        //m_Current.m_RenderStates[eRenderState_ZWriteEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_AlphaTestEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_SrcBlend]=yyGL.Blend_SrcAlpha; 
        m_current.m_renderStates[yyGL.RenderState_DestBlend]=yyGL.Blend_InvSrcAlpha; 
        m_current.m_renderStates[yyGL.RenderState_CullMode]=yyGL.Cull_NoCulling; 
        m_current.m_renderStates[yyGL.RenderState_ZFunc]=yyGL.CmpFunc_CmpLessEqual;             
        m_current.m_renderStates[yyGL.RenderState_AlphaRef]=0; 
        m_current.m_renderStates[yyGL.RenderState_AlphaFunc]=yyGL.CmpFunc_CmpGreater; 
        m_current.m_renderStates[yyGL.RenderState_AlphaBlendEnable]=true; 
        m_current.m_renderStates[yyGL.RenderState_FogEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_SpecularEnable]=false;      // unused, so should never get changed 
        m_current.m_renderStates[yyGL.RenderState_FogColour]=0x00000000; 
        m_current.m_renderStates[yyGL.RenderState_FogTableMode]=yyGL.Fog_LinearFog; 
        m_current.m_renderStates[yyGL.RenderState_FogStart]=0.0; 
        m_current.m_renderStates[yyGL.RenderState_FogEnd]=1.0; 
        m_current.m_renderStates[yyGL.RenderState_FogDensity]=0;          // unused, so should never get changed 
        m_current.m_renderStates[yyGL.RenderState_RangeFogEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_Lighting]=false; 
        m_current.m_renderStates[yyGL.RenderState_Ambient]=0x00000000;        // unused, so should never get changed 
        m_current.m_renderStates[yyGL.RenderState_FogVertexMode]=yyGL.Fog_LinearFog; 
        m_current.m_renderStates[yyGL.RenderState_ColourWriteEnable]=yyGL.ColourWriteEnableFlags_Red|yyGL.ColourWriteEnableFlags_Blue|yyGL.ColourWriteEnableFlags_Green|yyGL.ColourWriteEnableFlags_Alpha; 
        m_current.m_renderStates[yyGL.RenderState_StencilEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_StencilFail]=yyGL.StencilOp_Keep; 
        m_current.m_renderStates[yyGL.RenderState_StencilZFail]=yyGL.StencilOp_Keep; 
        m_current.m_renderStates[yyGL.RenderState_StencilPass]=yyGL.StencilOp_Keep; 
        m_current.m_renderStates[yyGL.RenderState_StencilFunc]=yyGL.CmpFunc_CmpAlways; 
        m_current.m_renderStates[yyGL.RenderState_StencilRef]=0; 
        m_current.m_renderStates[yyGL.RenderState_StencilMask]=0xffffffff; 
        m_current.m_renderStates[yyGL.RenderState_StencilWriteMask]=0xffffffff; 
        m_current.m_renderStates[yyGL.RenderState_SeparateAlphaBlendEnable]=false; 
        m_current.m_renderStates[yyGL.RenderState_SrcBlendAlpha]=yyGL.Blend_SrcAlpha; 
        m_current.m_renderStates[yyGL.RenderState_DestBlendAlpha]=yyGL.Blend_InvSrcAlpha; 
        m_current.m_renderStates[yyGL.RenderState_CullOrder] = 0;    // dummy (used for some compatibility stuff)
 
        // Copy defaults 
        var i; 
        for(i = 0; i < yyGL.RenderState_MAX; i++) 
        { 
            m_next.m_renderStates[i] = m_current.m_renderStates[i]; 
        } 
        
        var index = 0;
        for(i = 0; i < _numTextureStages; i++) 
        { 
            
            m_current.m_samplerStates[index + yyGL.SamplerState_MagFilter] = _interpolatePixels == true ? yyGL.Filter_LinearFiltering : yyGL.Filter_PointFiltering;
            m_current.m_samplerStates[index + yyGL.SamplerState_MinFilter] = _interpolatePixels == true ? yyGL.Filter_LinearFiltering : yyGL.Filter_PointFiltering;
            m_current.m_samplerStates[index + yyGL.SamplerState_MipFilter] = _interpolatePixels == true ? yyGL.Filter_LinearFiltering : yyGL.Filter_PointFiltering;
            m_current.m_samplerStates[index + yyGL.SamplerState_AddressU] = yyGL.TextureWrap_Clamp; 
            m_current.m_samplerStates[index + yyGL.SamplerState_AddressV] = yyGL.TextureWrap_Clamp; 
            m_current.m_samplerStates[index + yyGL.SamplerState_MinMip] = 0;
            m_current.m_samplerStates[index + yyGL.SamplerState_MaxMip] = 0;
            m_current.m_samplerStates[index + yyGL.SamplerState_MipBias] = 0;
            m_current.m_samplerStates[index + yyGL.SamplerState_MaxAniso] = 0;
            m_current.m_samplerStates[index + yyGL.SamplerState_MipEnable] = yyGL.MipEnable_OnlyMarked;		// set mipmaps to marked only
            index += yyGL.SamplerState_MAX;
        } 
 
        // Copy defaults 
        for(i = 0; i < (yyGL.SamplerState_MAX*_numTextureStages); i++) 
        { 
            m_next.m_samplerStates[i] = m_current.m_samplerStates[i]; 
        } 
 
        m_stackTop = 0; 
    };

    this.Reset = function()
    {
        ResetState();
    };

    this.GetChangeFlags = function()
    {
        return m_changeFlags;
    };

    this.GetSamplerFlags = function() 
    {
        return m_changeSamplerFlags;
    };

    this.AnyChange = function()
    {
        return m_anyChange;
    };
 
    this.SetRenderState = function(_state, _value) 
    { 
        if (m_next.m_renderStates[_state] == _value) 
            return;     // we're already due to switch to this value 
 
        if (m_current.m_renderStates[_state] != _value) 
        { 
            m_changeFlags.SetBit(_state); 
        } 
        else 
        { 
            m_changeFlags.ClearBit(_state); 
        } 
 
        m_next.m_renderStates[_state] = _value; 
 
        // TODO: write OrToSelf function for yyBitField to avoid 
        // having to constantly allocate new instances         
        // Or do we need multiple sets of changeflags at all?? Just combine m_changeFlags and m_changeSamplerFlags 
        m_anyChange = m_changeFlags.AnyBitSet() || m_changeSamplerFlags.AnyBitSet(); 
    };

    this.PeekPrevState = function (_state)
    {
		if (m_stackTop <= 0)
			return 0;

		if ((_state < 0) || (_state >= yyGL.RenderState_MAX))
			return 0;

		return m_stack[m_stackTop - 1].m_renderStates[_state];
	};
 
    this.SetSamplerState = function(_stage, _state, _value) 
    { 
        var index = (_stage*yyGL.SamplerState_MAX)+_state; 
 
        if(m_next.m_samplerStates[index] == _value) 
            return; // we're already due to switch to this value 
 
        if (m_current.m_samplerStates[index] != _value) 
        { 
            m_changeSamplerFlags.SetBit(index); 
        } 
        else 
        { 
            m_changeSamplerFlags.ClearBit(index); 
        } 
 
        m_next.m_samplerStates[index] = _value; 
 
        // TODO: write OrToSelf function for yyBitField to avoid 
        // having to constantly allocate new instances         
        m_anyChange = m_changeFlags.AnyBitSet() || m_changeSamplerFlags.AnyBitSet(); 
    };
 
    this.GetRenderState = function(_state) 
    { 
        return m_next.m_renderStates[_state]; 
    };
 
    this.GetSamplerState = function(_stage, _state) 
    { 
        return m_next.m_samplerStates[(_stage*yyGL.SamplerState_MAX)+_state]; 
    };
 
    this.SaveStates = function() 
    { 
        m_stack[m_stackTop].m_renderStates = m_next.m_renderStates.slice(); 
        m_stack[m_stackTop].m_samplerStates = m_next.m_samplerStates.slice(); 
 
        if (m_stackTop < _stackSize) 
        { 
            m_stackTop++; 
        } 
        else 
        { 
            debug("GPU state stack has run out of space"); 
        } 
    };
 
    this.RestoreStates = function() 
    { 
        if (m_stackTop > 0) 
        { 
            m_stackTop--; 
        } 
        else 
        { 
            debug("Attempting to drop below bottom of GPU state stack"); 
        } 
 
        var i; 
        for(i = 0; i < yyGL.RenderState_MAX; i++) 
        { 
            this.SetRenderState(i, m_stack[m_stackTop].m_renderStates[i]); 
        } 
 
        for(i = 0; i < _numTextureStages; i++) 
        { 
            var j; 
 
            for(j = 0; j < yyGL.SamplerState_MAX; j++) 
            { 
                this.SetSamplerState(i, j, m_stack[m_stackTop].m_samplerStates[(i * _numTextureStages) + j]); 
            } 
        } 
    };
 
    this.Flush = function() 
    { 
        var i; 
        if (m_changeFlags.AnyBitSet()) 
        { 
            for(i = 0; i < yyGL.RenderState_MAX; i++) 
            { 
                if(m_changeFlags.GetBit(i) != 0) 
                { 
                    // Write to command builder 
                    m_commandBuilder.SetRenderState(i, m_next.m_renderStates[i]);
 
                    // Update state 
                    m_current.m_renderStates[i] = m_next.m_renderStates[i]; 
                } 
            } 
 
            m_changeFlags.ClearAllBits(); 
        }

        if (m_changeSamplerFlags.AnyBitSet()) 
        { 
            for(i = 0; i < (_numTextureStages * yyGL.SamplerState_MAX); i++) 
            { 
                if(m_changeSamplerFlags.GetBit(i) != 0) 
                { 
                    var stage = ~~(i / yyGL.SamplerState_MAX);
                    var state = i - (stage * yyGL.SamplerState_MAX);

                    // Write to command builder
                    m_commandBuilder.SetSamplerState(stage, state, m_next.m_samplerStates[i]); 

                    // Update state
                    m_current.m_samplerStates[i] = m_next.m_samplerStates[i];
                }
            }

            m_changeSamplerFlags.ClearAllBits();
        }

        m_anyChange = false; 
    };    
}