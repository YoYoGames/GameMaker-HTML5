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
    var m_remaindermask;
    var m_numbits;

    var _CalcRemainderMask = function()
    {
        var remainingbits = m_numbits - ((m_arraysize - 1) * 32);
        m_remaindermask = 0xffffffff;        
        for(var i = 0; i < remainingbits; i++)
        {
            m_remaindermask <<= 1;            
        }

        m_remaindermask = ~m_remaindermask;
    };
 
    (function() { 
     
        // Apparently javascript stores values as doubles, but can only do bitwise operations 
        // on 32 bit values, so we'll store an array of 32 bit chunks 
        if (_numbits == undefined) 
            _numbits = 32; 

        m_numbits = _numbits;
 
        m_arraysize = ~~((m_numbits + 31) / 32);
 
        m_val = new Array(m_arraysize); 
 
        for(var i = 0; i < m_arraysize; i++) 
        { 
            m_val[i] = 0x0; 
        } 

        _CalcRemainderMask();
    })();     
 
    this.NumBits = function() 
    { 
        return m_numbits; 
    };

    this.Val = function()
    {
        return m_val;
    };
 
    this.SetBit = function(_bit) 
    { 
        if (_bit >= m_numbits) 
            return; 
 
        var entry = ~~(_bit / 32); 
        var bittoset = _bit - (entry * 32); 
        m_val[entry] |= 1 << bittoset; 
    };
 
    this.ClearBit = function(_bit) 
    { 
        if (_bit >= m_numbits) 
            return; 
 
        var entry = ~~(_bit / 32); 
        var bittoset = _bit - (entry * 32); 
        m_val[entry] &= ~(1 << bittoset); 
    };
 
    this.GetBit = function(_bit) 
    { 
        if (_bit >= m_numbits) 
            return 0; 
 
        var entry = ~~(_bit / 32); 
        var bittoget = _bit - (entry * 32); 
        var val = (m_val[entry] >> bittoget) & 0x1;  
        return val; 
    };
 
    this.SetAllBits = function() 
    { 
        var i; 
        for(i = 0; i < m_arraysize; i++) 
        { 
            m_val[i] = 0xffffffff; 
        } 

        m_val[m_arraysize - 1] &= m_remaindermask;
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
        var newBits;
        if (this.NumBits() < _other.NumBits())
        {
            newBits = new yyBitField(_other.NumBits());                        
            
            var i;
            for(i = 0; i < m_arraysize; i++) 
            { 
                newBits.m_val[i] = m_val[i] | _other.Val()[i];                    
            }

            for(; i < _other.m_arraysize; i++) 
            { 
                newBits.m_val[i] = _other.Val()[i];                    
            }
        }
        else
        {           
            newBits = new yyBitField(this.NumBits());
                 
            var i;
            for(i = 0; i < _other.m_arraysize; i++) 
            { 
                newBits.m_val[i] = m_val[i] | _other.Val()[i];
            }   

            for(; i < m_arraysize; i++) 
            { 
                newBits.m_val[i] = m_val[i];
            }   
        }           
 
        return newBits; 
    };
 
    this.And = function(_other) 
    { 
        var newBits;
        if (this.NumBits() < _other.NumBits())
        {
            newBits = new yyBitField(_other.NumBits());                        
            
            for(var i = 0; i < m_arraysize; i++) 
            { 
                newBits.m_val[i] = m_val[i] & _other.Val()[i];                    
            }            
        }
        else
        {           
            newBits = new yyBitField(this.NumBits());
                        
            for(var i = 0; i < _other.m_arraysize; i++) 
            { 
                newBits.m_val[i] = m_val[i] & _other.Val()[i];
            }   
        }           
        return newBits; 
    };

    this.Not = function()
    {
        var newBits = new yyBitField(_numbits);
        for(i = 0; i < m_arraysize; i++)
        {
            newBits.m_val[i] = ~(m_val[i]);
        }
        newBits.val[m_arraysize - 1] &= newBits.m_remaindermask;    // mask off unused bits

        return newBits;
    };

    this.OrEquals = function(_other) 
    { 
        // This all assumes that bits outside of the _numbits range are zeroed
        if (_other.NumBits() == this.NumBits())
        {
            for(var i = 0; i < m_arraysize; i++)
            {
                m_val[i] |= _other.Val()[i];
            }
        }
        else
        {            
            if (this.NumBits() < _other.NumBits())
            {
                var newArraySize = _other.m_arraysize;
                var newVal = new Array(newArraySize);                 
    
                var i;
                for(i = 0; i < m_arraysize; i++) 
                { 
                    newVal[i] = m_val[i] | _other.Val()[i];                    
                }

                for(; i < newArraySize; i++)
                {
                    newVal[i] = _other.Val()[i];
                }

                m_arraysize = newArraySize;
                m_val = newVal;       
                
                _CalcRemainderMask();
            }
            else
            {           
                var otherArraySize = _other.m_arraysize;
                var i;
                for(i = 0; i < otherArraySize; i++) 
                { 
                    m_val[i] |= _other.Val()[i];
                }            
            }            
        }         
    };

    this.AndEquals = function(_other) 
    { 
        // This all assumes that bits outside of the _numbits range are zeroed        
        if (_other.NumBits() == this.NumBits())
        {
            for(var i = 0; i < m_arraysize; i++)
            {
                m_val[i] &= _other.Val()[i];
            }
        }
        else
        {            
            if (this.NumBits() < _other.NumBits())
            {
                var newArraySize = _other.m_arraysize;
                var newVal = new Array(newArraySize);                 
    
                var i;
                for(i = 0; i < m_arraysize; i++) 
                { 
                    newVal[i] = m_val[i] & _other.Val()[i];                    
                }

                for(; i < newArraySize; i++)
                {
                    newVal[i] = 0;
                }

                m_arraysize = newArraySize;
                m_val = newVal;    
                
                _CalcRemainderMask();
            }
            else
            {           
                var otherArraySize = _other.m_arraysize;
                var i;
                for(i = 0; i < otherArraySize; i++) 
                { 
                    m_val[i] &= _other.Val()[i];                    
                }   
                
                for(; i < m_arraysize; i++)
                {
                    m_val[i] = 0;
                }
            }            
        }         
    };
}

// Specialised version of the above for more efficient 64bit bitfield handling
function yyBitField64() 
{ 
    this.m_hi = 0;
    this.m_lo = 0;        
}

yyBitField64.prototype.SetBit = function(_bit) 
{ 
    if (_bit > 31)
    {
        this.m_hi |= 1 << (_bit - 32);
    }
    else
    {
        this.m_lo |= 1 << _bit;
    }
};
 
yyBitField64.prototype.ClearBit = function(_bit) 
{ 
    if (_bit > 31)
    {
        this.m_hi &= ~(1 << (_bit - 32));
    }
    else
    {
        this.m_lo &= ~(1 << _bit);
    }        
};
 
yyBitField64.prototype.GetBit = function(_bit) 
{ 
    if (_bit > 31)
    {
        return (this.m_hi >> (_bit - 32)) & 0x1;
    }
    else
    {
        return (this.m_lo >> _bit) & 0x1;
    }        
};
 
yyBitField64.prototype.SetAllBits = function() 
{ 
    this.m_hi = 0xffffffff;
    this.m_lo = 0xffffffff;
};
 
yyBitField64.prototype.ClearAllBits = function() 
{ 
    this.m_hi = 0;
    this.m_lo = 0;        
};
 
yyBitField64.prototype.AnyBitSet = function() 
{ 
    return (this.m_hi | this.m_lo) ? 1 : 0;        
};
 
yyBitField64.prototype.Or = function(_other) 
{ 
    var newBits = new yyBitField64();
    newBits.m_hi = this.m_hi | _other.m_hi;
    newBits.m_lo = this.m_lo | _other.m_lo;        

    return newBits; 
};
 
yyBitField64.prototype.And = function(_other) 
{ 
    var newBits = new yyBitField64();
    newBits.m_hi = this.m_hi & _other.m_hi;
    newBits.m_lo = this.m_lo & _other.m_lo;        

    return newBits;         
};

yyBitField64.prototype.Not = function()
{
    var newBits = new yyBitField64();
    newBits.m_hi = ~this.m_hi;
    newBits.m_lo = ~this.m_lo;        

    return newBits;              
};

yyBitField64.prototype.OrEquals = function(_other) 
{ 
    this.m_hi |= _other.m_hi;
    this.m_lo |= _other.m_lo;        
};

yyBitField64.prototype.AndEquals = function(_other) 
{ 
    this.m_hi &= _other.m_hi;
    this.m_lo &= _other.m_lo;        
};
 
function yyRenderStateCollection(_numrenderstates, _numsamplers, _numsamplerstates) 
{ 
    var renderStates = []; 
    var samplerStates = [];     

    // These are not applied in a deferred way like other states
	// But are just here so we can track this information
    var textures = [];
 
    (function() { 
        renderStates = new Array(_numrenderstates); 
        samplerStates = new Array(_numsamplers * _numsamplerstates); 

        textures = new Array(_numsamplers);        
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

        m_textures: {
	        get: function () { return textures; },
            set: function (val) { textures = val; }
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

        // Set up initial texture info
        for (i = 0; i < _numTextureStages; i++)
        {
            m_current.m_textures[i] = null;
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

    this.SetTexture = function(_stage, _texture)
    {
        // This doesn't set the texture on the back end but just caches the value
        // It would probably make sense to actually make this a deferred thing like other state
        if ((_stage < 0) || (_stage >= _numTextureStages))
            return;

        // Note that since we're not deferring texture setting we're using m_current rather than m_next        
        m_current.m_textures[_stage] = _texture;
    };

    this.ClearTexture = function(_texture)
    {
        if (_texture != null)
        {
            for(var i = 0; i < _numTextureStages; i++)
            {
                if (m_current.m_textures[i] == _texture)
                {
                    m_current.m_textures[i] = null;
                }

                for(var j = 0; j < m_stackTop; j++)
                {
                    if (m_stack[j].m_textures[i] == _texture)
                    {
                        m_stack[j].m_textures[i] = null;
                    }
                }
            }
        }
    };    
 
    this.GetRenderState = function(_state) 
    { 
        return m_next.m_renderStates[_state]; 
    };
 
    this.GetSamplerState = function(_stage, _state) 
    { 
        return m_next.m_samplerStates[(_stage*yyGL.SamplerState_MAX)+_state]; 
    };

    this.GetTexture = function(_stage)
    {
        if ((_stage < 0) || (_stage >= _numTextureStages))
            return null;

        return m_current.textures[_stage];
    };
 
    this.SaveStates = function() 
    { 
        m_stack[m_stackTop].m_renderStates = m_next.m_renderStates.slice(); 
        m_stack[m_stackTop].m_samplerStates = m_next.m_samplerStates.slice(); 

        // Note that because texture setting isn't currently deferred we're copying from m_current rather than m_next
        m_stack[m_stackTop].m_textures = m_current.m_textures.slice();
 
        if (m_stackTop < _stackSize) 
        { 
            m_stackTop++; 
        } 
        else 
        { 
            debug("GPU state stack has run out of space"); 
        } 
    };
 
    this.RestoreStates = function(_setTextures) 
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

        if ((_setTextures != undefined) && (_setTextures == true))
        {
            if (g_webGL)
            {
                for(i = 0; i < _numTextureStages; i++)
                {
                    g_webGL.SetTexture(i, m_stack[m_stackTop].m_textures[i]);
                }
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