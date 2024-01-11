// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyTextureGroupInfo.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function    yyTextureGroupInfo()
{
    this.__type = "[TextureGroupInfo]";
    this.pName = "unknowntexturegroup";
    this.textures = [];
    this.sprites = [];
    this.spinesprites = [];
    this.fonts = [];
    this.tilesets = [];
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function    yyTextureGroupInfoManager()
{
    this.TextureGroupInfo = [];
}



// #############################################################################################
/// Function:<summary>
///             Add a texture to the "pool"
///          </summary>
///
/// In:		 <param name="_name">Name+path of texture to load</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyTextureGroupInfoManager.prototype.AddTextureGroupInfo = function (_pTGInfo)
{
	var n = this.TextureGroupInfo.length;
	this.TextureGroupInfo[n] = _pTGInfo;
	return n;
};

yyTextureGroupInfoManager.prototype.Find = function(_pName)
{
    for(var i = 0; i < this.TextureGroupInfo.length; i++)
    {
        if (this.TextureGroupInfo[i].pName == _pName)
        {
            return this.TextureGroupInfo[i];
        }
    }

    return null;
};

yyTextureGroupInfoManager.prototype.FindTex = function(_texid)
{
    for(var i = 0; i < this.TextureGroupInfo.length; i++)
    {
        var pTGInfo = this.TextureGroupInfo[i];
        for(var j = 0; j < pTGInfo.textures.length; j++)
        {
            if (pTGInfo.textures[j] == _texid)
            {
                return pTGInfo;
            }
        }        
    }

    return null;
};

yyTextureGroupInfoManager.prototype.FindGLTex = function(_gltex)
{
    for(var i = 0; i < this.TextureGroupInfo.length; i++)
    {
        var pTGInfo = this.TextureGroupInfo[i];
        for(var j = 0; j < pTGInfo.textures.length; j++)
        {
            if (g_Textures[pTGInfo.textures[j]])
            {
                var tex = g_Textures[pTGInfo.textures[j]];

                if (tex.webgl_textureid)
                {
                    if (tex.webgl_textureid === _gltex)
                    {
                        return pTGInfo;
                    }
                }
            }            
        }        
    }

    return null;
};

function _getWebGLTex(_tex_id)
{
    if (g_Textures[_tex_id])
    {
        if (g_Textures[_tex_id].webgl_textureid)
        {
            return g_Textures[_tex_id].webgl_textureid;
        }
    }

    return null;
}

function texture_is_ready(_tex_id_or_groupname)
{
    if (g_webGL == null)
        return -1;

    if ((typeof (_tex_id_or_groupname) === "string"))
    {
        var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_tex_id_or_groupname));
        if (pTGInfo == null)
        {
            return 0;
        }

        for (var i = 0; i < pTGInfo.textures.length; i++)
        {
            var gltex = _getWebGLTex(pTGInfo.textures[i]);
            if (gltex != null)
            {
                if (!WebGL_IsTextureValid(gltex, yyGL.MipEnable_DontCare))
                {
                    return 0;
                }
            }
            else
            {
                return 0;
            }
        }

        return 1;
    }
    else
    {
        var gltex = _getWebGLTex(yyGetInt32(_tex_id_or_groupname));
        if (gltex != null)
        {
            return WebGL_IsTextureValid(gltex, yyGL.MipEnable_DontCare);
        }
    }

    return 0;
}

function texture_prefetch(_tex_id_or_groupname)
{
    if (g_webGL == null)
        return -1;

    if ((typeof (_tex_id_or_groupname) === "string") )
    {
        var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_tex_id_or_groupname));
        if (pTGInfo == null)
        {
            return -1;
        }

        for(var i = 0; i < pTGInfo.textures.length; i++)
        {
            var gltex = _getWebGLTex(pTGInfo.textures[i]);
            if (gltex != null)
            {
                WebGL_RecreateTexture(gltex);
            }
        }
    }
    else
    {
        var gltex = _getWebGLTex(yyGetInt32(_tex_id_or_groupname));
        if (gltex != null)
        {
            WebGL_RecreateTexture(gltex);
        }
    }            
}

function texture_flush(_tex_id_or_groupname)
{
    if (g_webGL == null)
        return -1;

    if ((typeof (_tex_id_or_groupname) === "string") )
    {
        var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_tex_id_or_groupname));
        if (pTGInfo == null)
        {
            return -1;
        }

        for(var i = 0; i < pTGInfo.textures.length; i++)
        {
            var gltex = _getWebGLTex(pTGInfo.textures[i]);
            if (gltex != null)
            {
                WebGL_FlushTexture(gltex);
            }
        }
    }
    else
    {
        var gltex = _getWebGLTex(yyGetInt32(_tex_id_or_groupname));
        if (gltex != null)
        {
            WebGL_FlushTexture(gltex);
        }
    }           
}

function texturegroup_get_names()
{
    var ret = [];
    for(var i = 0; i < g_pTextureGroupInfoManager.TextureGroupInfo.length; i++)
    {
        ret.push( g_pTextureGroupInfoManager.TextureGroupInfo[i].pName );
    }
    return ret;
}

function texturegroup_get_textures(_groupname)
{
    var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_groupname));
    if (pTGInfo == null)
    {
        return -1;
    }

    var ret = new Array();
    for(var i = 0; i < pTGInfo.textures.length; i++)
    {
        ret.push(pTGInfo.textures[i]);
    }
    
    return ret;
}

function texturegroup_get_sprites(_groupname)
{
    var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_groupname));
    if (pTGInfo == null)
    {
        return -1;
    }

    var ret = new Array();
    for(var i = 0; i < pTGInfo.sprites.length; i++)
    {
        ret.push(pTGInfo.sprites[i]);
    }
    
    return ret;
}

function texturegroup_get_fonts(_groupname)
{
    var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_groupname));
    if (pTGInfo == null)
    {
        return -1;
    }

    var ret = new Array();
    for(var i = 0; i < pTGInfo.fonts.length; i++)
    {
        ret.push(pTGInfo.fonts[i]);
    }
    
    return ret;
}

function texturegroup_get_tilesets(_groupname)
{
    var pTGInfo = g_pTextureGroupInfoManager.Find(yyGetString(_groupname));
    if (pTGInfo == null)
    {
        return -1;
    }

    var ret = new Array();
    for(var i = 0; i < pTGInfo.tilesets.length; i++)
    {
        ret.push(pTGInfo.tilesets[i]);
    }
    
    return ret;
}

function texturegroup_load(_groupname, _prefetch)
{
    // Do nothing on HTML5
}

function texturegroup_unload(_groupname)
{
    // Do nothing on HTML5
}

function texturegroup_get_status(_groupname)
{    
    return 3;       // equivalent to eTGI_Status_Fetched on the C++ runner
}

function texturegroup_set_mode(_explicit, _debug, _default_sprite)
{
    // Do nothing on HTML5
}

var g_TextureDebugMessages = 0;

function texture_debug_messages(_enable)
{
    if (g_webGL == null)
        return -1;

    if (yyGetBool(_enable))
        g_TextureDebugMessages = 1;
    else
        g_TextureDebugMessages = 0;
}

function TextureDebugReady(_gltex)
{
    if (g_TextureDebugMessages > 0)
    {
        // Get texture ID
        var texid = -1;
        for(var i = 0; i < g_Textures.length; i++)
        {
            if (g_Textures[i])
            {
                if (g_Textures[i].webgl_textureid)
                {
                    if (g_Textures[i].webgl_textureid === _gltex)
                    {
                        texid = 0;
                        break;
                    }
                }
            }
        }

        var pTGInfo = g_pTextureGroupInfoManager.FindGLTex(_gltex);
        if (pTGInfo != null)
        {
            show_debug_message("Texture unpacked - Group: " + pTGInfo.pName + ", Texture ID: " + String(texid) + ", Width: " + _gltex.Width + ", Height " + _gltex.Height);
        }
        else if (g_TextureDebugMessages > 1)
        {
            show_debug_message("Texture unpacked - Group: None, Texture ID: " + String(texid) + ", Width: " + _gltex.Width + ", Height " + _gltex.Height);
        }
    }
}

function TextureDebugFlushed(_gltex)
{
    if (g_TextureDebugMessages > 0)
    {
        // Get texture ID
        var texid = -1;
        for(var i = 0; i < g_Textures.length; i++)
        {
            if (g_Textures[i])
            {
                if (g_Textures[i].webgl_textureid)
                {
                    if (g_Textures[i].webgl_textureid === _gltex)
                    {
                        texid = 0;
                        break;
                    }
                }
            }
        }

        var pTGInfo = g_pTextureGroupInfoManager.FindGLTex(_gltex);
        if (pTGInfo != null)
        {
            show_debug_message("Texture flushed - Group: " + pTGInfo.pName + ", Texture ID: " + String(texid) + ", Width: " + _gltex.Width + ", Height " + _gltex.Height);
        }
        else if (g_TextureDebugMessages > 1)
        {
            show_debug_message("Texture flushed - Group: None, Texture ID: " + String(texid) + ", Width: " + _gltex.Width + ", Height " + _gltex.Height);
        }
    }
}