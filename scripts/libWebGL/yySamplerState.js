// #############################################################################################
/// Function:<summary>
///             Creates a new container for a texture settings for filtering/wrapping/etc
///          </summary>
// #############################################################################################	
/** @constructor */
function yyTextureSamplerState(_interpolatePixels) {   	    

    var gl = this._gl;

    // Private data
    var m_states = [];
    
    Object.defineProperties(this, {
	    States: {
	        get: function () { return m_states; }
	    }
	});

    // #############################################################################################
    /// Function:<summary>
    ///             Constructor
    ///          </summary>
    // #############################################################################################
    (function() {
    
        if (_interpolatePixels) {
            m_states[yyGL.SamplerState_MagFilter] = yyGL.Filter_LinearFiltering;
            m_states[yyGL.SamplerState_MinFilter] = yyGL.Filter_LinearFiltering;
            m_states[yyGL.SamplerState_MipFilter] = yyGL.Filter_LinearFiltering;
        }
        else {
            m_states[yyGL.SamplerState_MagFilter] = yyGL.Filter_PointFiltering;
            m_states[yyGL.SamplerState_MinFilter] = yyGL.Filter_PointFiltering;
            m_states[yyGL.SamplerState_MipFilter] = yyGL.Filter_PointFiltering;
        }
        m_states[yyGL.SamplerState_AddressU] = yyGL.TextureWrap_Clamp;
        m_states[yyGL.SamplerState_AddressV] = yyGL.TextureWrap_Clamp;
    })();
    
    
    // #############################################################################################
    /// Function:<summary>
    ///             When creating a texture use this function to set the default texture states
    ///             for the given target (TEXTURE_2D expected)
    ///          </summary>
    // #############################################################################################
    /** @this {yyTextureSamplerState} */
    this.BindDefaults = function (_target) {
        
        var states = m_states;
	    gl.texParameteri(_target, gl.TEXTURE_MAG_FILTER, (states[yyGL.SamplerState_MagFilter] == yyGL.Filter_LinearFiltering) ? gl.LINEAR : gl.NEAREST);
	    gl.texParameteri(_target, gl.TEXTURE_MIN_FILTER, (states[yyGL.SamplerState_MinFilter] == yyGL.Filter_LinearFiltering) ? gl.LINEAR : gl.NEAREST);
    		
	    gl.texParameteri(_target, gl.TEXTURE_WRAP_S, (states[yyGL.SamplerState_AddressU] == yyGL.TextureWrap_Clamp) ? gl.CLAMP_TO_EDGE : gl.REPEAT);
	    gl.texParameteri(_target, gl.TEXTURE_WRAP_T, (states[yyGL.SamplerState_AddressV] == yyGL.TextureWrap_Clamp) ? gl.CLAMP_TO_EDGE : gl.REPEAT);
    };
}
