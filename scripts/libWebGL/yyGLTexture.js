// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyGLTexture.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

/** @constructor */
function yyGLTexture(_glTexture, _width, _height, _pow2, _image, _numMips, _flags, _format) {

    var gl = this._gl;

    var m_samplerState,
        m_texture,
        m_width,
        m_height,
        m_pow2,
        m_image,
        m_numMips,
        m_flags,
        m_format;

    var m_isDirty;
     
    Object.defineProperties(this, {
        SamplerState: {
            get: function () { return m_samplerState; }
        },        
        Texture: {
            get: function () { return m_texture; },
            set: function (_val) { m_texture = _val; }
        },
        Width: {
            get: function () { return m_width; }
        },
        Height: {
            get: function () { return m_height; }
        },
        Pow2: {
            get: function () { return m_pow2; }
        },
        Image: {
            get: function () { return m_image; }            
        },
        NumMips: {
            get: function () { return m_numMips; }
        },
        Flags: {
            get: function () { return m_flags; },
            set: function (_val) { m_flags = _val; }
        },
        IsDirty: {
            get: function () { return m_isDirty; },
            set: function (_val) { m_isDirty = _val; }
        },
        Format: {
            get: function () { return m_format; }
        },
    });
       
    // #############################################################################################
    /// Function:<summary>
    ///             Construction
    ///          </summary>
    // #############################################################################################        
    (function () {
    
        m_texture = _glTexture;
        m_width = _width;
        m_height = _height;
        m_pow2 = _pow2;
        m_image = _image;
        m_numMips = _numMips;
        m_flags = _flags;
        m_format = _format;
        m_isDirty = false;

        if (m_format == undefined)
            m_format = eTextureFormat_A8R8G8B8;

        m_samplerState = new yyTextureSamplerState();
        
        if (m_texture)
        {            
            m_samplerState.BindDefaults(gl.TEXTURE_2D);
        }

        m_flags = eInternalTextureFlags.NoFlags;

        if (m_numMips !== undefined
            && m_numMips !== 0)
        {
            m_flags |= (eInternalTextureFlags.GenerateMips | eInternalTextureFlags.SupportsMips);
        }
        
    })();
}

// #############################################################################################
/// Enum:<summary>
///         Texture flags and options
///      </summary>
// #############################################################################################
var eTextureFlags = 
{
	NoFlags:                0,
	Dirty:                  1,
	RenderTarget:           2,
	DepthBuffer:            4,
	RenderTargetLinear:     8,
	Hack:                   16,
	GenerateMips:           32,
	ScreenTex:              64
};
Object.freeze(eTextureFlags);

var eInternalTextureFlagBits =
{	
	Dirty: 			    0,
	NoScaling: 		    1,
    NPOT: 				2,
	RenderTarget: 		3,
	GenerateMips: 		4,
	HasMips: 			5,
	SupportsMips: 		6,
	IsReady: 			7,
	ScreenTex: 		    8,
	DepthBuffer: 		9,
	Plat: 				16,	
	//Beware beyond here
};
Object.freeze(eInternalTextureFlagBits);

var eInternalTextureFlags = 
{
	NoFlags :		0,
	Dirty :			(1 << eInternalTextureFlagBits.Dirty),
	NoScaling :		(1 << eInternalTextureFlagBits.NoScaling),
    NPOT :			(1 << eInternalTextureFlagBits.NPOT),
	RenderTarget :	(1 << eInternalTextureFlagBits.RenderTarget),	
	GenerateMips :	(1 << eInternalTextureFlagBits.GenerateMips),
	HasMips :		(1 << eInternalTextureFlagBits.HasMips),
	SupportsMips :	(1 << eInternalTextureFlagBits.SupportsMips),
	IsReady :		(1 << eInternalTextureFlagBits.IsReady),
	ScreenTex :		(1 << eInternalTextureFlagBits.ScreenTex)
};
Object.freeze(eInternalTextureFlags);