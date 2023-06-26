// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yySkeletonSprite.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// This is an exceptionally nasty way to keep a Sprite agnostic about which instance triggered its draw
var g_skeletonDrawInstance = null;

var g_SpinePerSlotBlendmodes = false;

var g_SpineCurrUserShader = -1;
var g_SpineTintBlackUniform = null;
var g_SpineTintBlackCol = [0.0, 0.0, 0.0, 0.0];

var REGIONATTACHMENT_OX1 = 0;
var REGIONATTACHMENT_OY1 = 1;
var REGIONATTACHMENT_OX2 = 2;
var REGIONATTACHMENT_OY2 = 3;
var REGIONATTACHMENT_OX3 = 4;
var REGIONATTACHMENT_OY3 = 5;
var REGIONATTACHMENT_OX4 = 6;
var REGIONATTACHMENT_OY4 = 7;

// #############################################################################################
/// Function:<summary>
///             Have a routine to set the draw instance
///          </summary>
// #############################################################################################
function SetSkeletonDrawInstance(_instance) {
    g_skeletonDrawInstance = _instance;
};

function yyImageProxy()
{
    this.width = null;
    this.height = null;
}

function yySpineTexture()
{
    // Basing this on the Texture 'class' in the typescript source
    this.name = null;
    
    this.image = new yyImageProxy();        
    this.getImage = function() { return this.image; };
    
    this.setFilters = function(minFilter, magFilter) { };
    this.setWraps = function(uWrap, vWrap) { };
    this.dispose = function() { };    
       
    this.rendererObject = null;
    this.width = null;
    this.height = null;
}

// #############################################################################################
/// Function:<summary>
///             Initialise storage for the sprite specific porition of a Skeleton animation
///          </summary>
// #############################################################################################
/** @constructor */
function yySkeletonSprite()
{
    // Store "TPE" for each texture so as to have a storage for coloured cache blocks
    this.m_TPE = [];
    this.m_skeletonJson = null;
	this.m_skeletonData = null;
	this.m_atlas = null;
	this.m_clipper = null;
	this.m_premultiplied = false;
	
	if (g_webGL) {
		this.DrawRegion = this.DrawRegion_WebGL;
		this.DrawMesh = this.DrawMesh_WebGL;		
	}
	else {
		this.DrawRegion = this.DrawRegion_RELEASE;
		this.DrawMesh = this.DrawMesh_RELEASE;		
	}
};

// #############################################################################################
/// Function:<summary>
///             Setup a "fake" TPE entry to allow us to track Cache blocks for tinted atlases
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.SetupTPE = function (_name, _width, _height, _tex) {

    this.m_TPE[_name] = { 
        cache: [], 
        count: 0, 
        maxcache: 32, 
        texture: g_Textures[_tex],
        x: 0,
        y: 0,
        w: _width,
        h: _height
    };
};

// #############################################################################################
/// Function:<summary>
///             Setup from pre-loaded string data
///          </summary>
// #############################################################################################
//yySkeletonSprite.prototype.Load = function (_jsonData, _atlasData, _width, _height) {
yySkeletonSprite.prototype.Load = function (_atlasDir, _sprName, _jsonData, _atlasData, _numTextures, _textureSizes, _sprite)
{
    // Setup local variables for use with callback functions
    //var width = _width;
    //var height = _height;
    var numTextures = _numTextures;
    var textureSizes = _textureSizes;
    var currTexture = 0;

    var self = this;
    var loadTexture = function (_atlasPage, _TPE) {
            
        /*var atlasPage = _atlasPage;
        atlasPage.width = width;
        atlasPage.height = height;
        
        var tex = Graphics_AddTexture(g_RootDir + _atlasPage.name);        
        atlasPage.rendererObject = tex;        
        
		g_Textures[tex].onload = function (e) {		
		    self.SetupTPE(atlasPage.name, e.srcElement.width, e.srcElement.height, tex);
		};
		g_Textures[tex].onerror = function (e) {
		    debug("ImageError: " + e.srcElement.src);
		};		
		g_Textures[tex].URL = _atlasPage.name;*/
		
		var newTex = new yySpineTexture();
		newTex.name = _atlasPage;
		//newTex.width = newTex.image.width = width;
        //newTex.height = newTex.image.height = height;		
		newTex.width = newTex.image.width = textureSizes[currTexture].width;
        newTex.height = newTex.image.height = textureSizes[currTexture].height;		
		
        if (_TPE != undefined)
        {            
            newTex.rendererObject = _TPE.tp; 
            self.m_TPE[newTex.name] = _TPE;
        }
        else
        {
            var tex = Graphics_AddTexture(g_RootDir + _atlasDir + _atlasPage);
            newTex.rendererObject = tex;        

            g_Textures[tex].onload = function (e) {	
                newTex.image = 	e.SrcElement;
                var target = e.target || e.srcElement;      // for compatibility with IE6-8
                self.SetupTPE(newTex.name, target.width, target.height, tex);

                if (_sprite.prefetchOnLoad != undefined)
                {
                    if (_sprite.prefetchOnLoad == true)
                    {
                        // We need to create the GL texture here and set it up
                        var newTPE = self.m_TPE[newTex.name];
                        WebGL_BindTexture(newTPE);

                        if (newTPE.texture.webgl_textureid)
                        {
                            WebGL_RecreateTexture(newTPE.texture.webgl_textureid);							
                        }	                        
                    }
                }
            };
            g_Textures[tex].onerror = function (e) {
                var target = e.target || e.srcElement;      // for compatibility with IE6-8
                debug("ImageError: " + target.src);
            };		
            g_Textures[tex].URL = _atlasPage;
        }		

		if (currTexture < (numTextures - 1))
		    currTexture++;
		
		return newTex;
    };

    //this.m_atlas = new spine.TextureAtlas(_atlasData, { load: loadTexture });   
    //this.m_atlas = new spine.TextureAtlas(_atlasData, loadTexture);   
    this.m_atlas = new spine.TextureAtlas(_atlasData);       

    var numTPEs = 0;
    if (_sprite.ppTPE != undefined)
        numTPEs = _sprite.ppTPE.length;
    for(var i = 0; i < this.m_atlas.pages.length; i++)
    {
        var page = this.m_atlas.pages[i];
        page.setTexture(loadTexture(page.name, (i < numTPEs) ? _sprite.ppTPE[i] : undefined));
    }
    this.m_skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.m_atlas));
	//this.m_skeletonData = this.m_skeletonJson.readSkeletonData(JSON.parse(_jsonData));
	this.m_skeletonData = this.m_skeletonJson.readSkeletonData(_jsonData);
};

yySkeletonSprite.prototype.GetNumAtlasTextures = function ()
{    
    if (this.m_atlas)
    {
        if (this.m_atlas.pages)
        {
            return this.m_atlas.pages.length;            
        }
    }

    return 0;
};

yySkeletonSprite.prototype.GetAtlasTextureID = function(_index)
{
	// lol
	if (this.m_atlas)
	{
		if (this.m_atlas.pages)
		{
		    if (this.m_atlas.pages.length > _index)
			{
		        if (this.m_atlas.pages[_index].texture)
				{
		            if (this.m_atlas.pages[_index].texture.rendererObject)
					{
		                return this.m_atlas.pages[_index].texture.rendererObject;
					}
				}
			}
		}
	}

	return -1;	
};

// #############################################################################################
/// Function:<summary>
///             Draw appropos of an instance
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawFrame = function (_animation, _skin, frame, x, y, xs, ys, angle, col, alpha) {
    
    if (this.m_skeletonData === null || this.m_skeletonData === undefined)
        return;

    // Make sure the animation is drawn right way up on the screen
	//spine.Bone.yDown = true;

	var pAnim = new yySkeletonInstance(this);
	pAnim.SelectAnimation(_animation);
	pAnim.SelectSkin(_skin);		
	pAnim.SetAnimationTransform(frame, x, y, xs, ys, angle);	

	var origin = pAnim.GetScreenOrigin();

	// Do the actual drawing of the animation's skeleton
	this.DrawSkeleton(pAnim.m_skeleton, col, alpha, pAnim.m_rotationMatrix, origin[0], origin[1]);
};

// #############################################################################################
/// Function:<summary>
///             Draw appropos of an instance at a given time
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawTime = function (_animation, _skin, _time, x, y, xs, ys, angle, col, alpha) {
    
    if (this.m_skeletonData === null || this.m_skeletonData === undefined)
        return;

    // Make sure the animation is drawn right way up on the screen
	//spine.Bone.yDown = true;

	var pAnim = new yySkeletonInstance(this);
	pAnim.SelectAnimation(_animation);
	pAnim.SelectSkin(_skin);		
	pAnim.SetAnimationTransformTime(_time, x, y, xs, ys, angle);	

	var origin = pAnim.GetScreenOrigin();

	// Do the actual drawing of the animation's skeleton
	this.DrawSkeleton(pAnim.m_skeleton, col, alpha, pAnim.m_rotationMatrix, origin[0], origin[1]);
};


// #############################################################################################
/// Function:<summary>
///             Draw given a static instance
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.Draw = function (frame, x, y, xs, ys, angle, col, alpha) {    	
			
	if (!g_skeletonDrawInstance || !g_skeletonDrawInstance.SkeletonAnimation()) {
		this.DrawFrame(null, null, frame, x, y, xs, ys, angle, col, alpha);
	}
	else { 		
		// Make sure the animation is drawn right way up on the screen
		//spine.Bone.yDown = true;

		// Make sure the animation is in the correct physical state
		var anim = g_skeletonDrawInstance.SkeletonAnimation();
		anim.SetAnimationTransform(frame, x, y, xs, ys, angle, g_skeletonDrawInstance);

		var origin = anim.GetScreenOrigin();

		// Do the actual drawing of the animation's skeleton
		this.DrawSkeleton(anim.m_skeleton, col, alpha, anim.m_rotationMatrix, origin[0], origin[1]);

        if (anim.m_drawCollisionData) {		
			this.DrawCollisionBounds(anim.m_skeletonBounds);
		}
	}
};

yySkeletonSprite.prototype.GetSlotsAtWorldPos = function (_selfinst, _animation, _skin, frame, x, y, xs, ys, angle, _testX, _testY, _list)
{
    ds_list_clear(_list);

    var localskel = false;

    var anim = null;

    if ((_selfinst === undefined) || (_selfinst === null) || (_selfinst.SkeletonAnimation() === null))
    {
        anim = new yySkeletonInstance(this);
        localskel = true;

        anim.SelectAnimation(_animation);
        anim.SelectSkin(_skin);
    }
    else
    {
        anim = _selfinst.SkeletonAnimation();

        if ((_animation !== undefined) && (_animation !== null))
        {
            anim.SelectAnimation(_animation);
        }

        if((_skin !== undefined) && (_skin !== null))
        {
            anim.SelectSkin(_skin);
        }
    }

    anim.SetAnimationTransform(frame, x, y, xs, ys, angle, _selfinst);

    var slotHits = [];
    var numSlotHits = 0;

    for (var i = 0, n = anim.m_skeleton.slots.length; i < n; i++)
    {
        var slot = anim.m_skeleton.drawOrder[i];
        if (!slot.attachment)
            continue;

        var pointInSlot = false;

        if (slot.attachment instanceof spine.RegionAttachment)
        {
            pointInSlot = this.PointInRegion(slot, _testX, _testY);
        }
        else if (slot.attachment instanceof spine.MeshAttachment)
        {
            pointInSlot = this.PointInMesh(slot, _testX, _testY);
        }
        else if (slot.attachment instanceof spine.BoundingBoxAttachment)
        {
            pointInSlot = this.PointInBoundingBox(slot, _testX, _testY);
        }

        if (pointInSlot)
        {
            slotHits[numSlotHits] = slot;
            numSlotHits++;
        }        
    }

    if (numSlotHits > 0)
    {
        for (var i = (numSlotHits - 1) ; i >= 0; i--)
        {
            ds_list_add(_list, slotHits[i].data.name);
        }
    }
};


// #############################################################################################
/// Function:<summary>
///             Debug drawing routine to visualise the collision data at a given frame
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawCollision = function (_animation, ind, x, y, xs, ys, angle, color, _pSpr) {
  
	// Make sure the animation is drawn right way up on the screen
	//spine.Bone.yDown = true;

	var pAnim = new yySkeletonInstance(this);
	pAnim.SelectAnimation(_animation);			
	pAnim.SetAnimationTransform(ind, x, y, xs, ys, angle, null, _pSpr);

	// Draw the bounds
	this.DrawCollisionBounds(pAnim.m_skeletonBounds);
};


// #############################################################################################
/// Function:<summary>
///             Draw a fully setup skeleton
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawSkeleton = function (_skeleton, color, alpha, rotationMatrix, origin_x, origin_y) {

    var gmr = (color & 0xff) / 255.0,
	    gmg = ((color & 0xff00) >> 8)  / 255.0,
	    gmb = ((color & 0xff0000) >> 16)  / 255.0;

    if (g_webGL)
    {
        this.DrawSkeleton_WebGL(_skeleton, gmr, gmg, gmb, alpha, rotationMatrix, origin_x, origin_y);
    }
    else
    {
        this.DrawSkeleton_RELEASE(_skeleton, gmb, gmg, gmr, alpha, rotationMatrix, origin_x, origin_y);         // swap red and blue for canvas drawing
    }
};

yySkeletonSprite.prototype.DrawSkeleton_RELEASE = function (_skeleton, _gmr, _gmg, _gmb, _alpha, _rotation_matrix, _origin_x, _origin_y)
{
    var regionIndices = [0, 1, 2, 2, 3, 0];
    var vertices = [];
    var clipcol = new spine.Color(1.0, 1.0, 1.0, 1.0);
    var twoColorTint = false;

    for (var i = 0, n = _skeleton.slots.length; i < n; i++)
    {
        var slot = _skeleton.drawOrder[i];
        if (!slot.attachment)
            continue;

        var r = (_gmr * 255);
        var g = (_gmg * 255);
        var b = (_gmb * 255);
        var a = (_alpha * 255);
        if ((slot.skeleton != undefined) && (slot.skeleton.r != undefined))
        {
            r *= slot.skeleton.r;
            g *= slot.skeleton.g;
            b *= slot.skeleton.b;
            a *= slot.skeleton.a;
        }
        if (slot.color != undefined)
        {
            r *= slot.color.r;
            g *= slot.color.g;
            b *= slot.color.b;
            a *= slot.color.a;
        }
        if (slot.attachment.color != undefined)
        {
            r *= slot.attachment.color.r;
            g *= slot.attachment.color.g;
            b *= slot.attachment.color.b;
            a *= slot.attachment.color.a;
        }
        var col;
        col = (a << 24) | (r << 16) | (g << 8) | (b << 0);

        var verts = null;
        var uvs = null;
        var indices = null;

        var vertstride = 2;
        var uvoffset = 0;

        var numVerts = 0;
        var numIndices = 0;

        var tpe = null;
        var tex = null;

        if (slot.attachment instanceof spine.RegionAttachment)
        {
            var region = slot.attachment;
            if ((this.m_clipper != null) && (this.m_clipper.isClipping()))
            {
                region.computeWorldVertices(slot.bone, vertices, 0, 2);

                verts = vertices;
                uvs = region.uvs;
                indices = regionIndices;

                numVerts = 4;
                numIndices = 6;

                tex = g_Textures[region.region.renderObject.page.texture.rendererObject];
                if (!tex.complete)
                    continue;

                if (col != g_CacheWhite)
                {

                    if (!this.m_TPE[region.region.renderObject.page.name])
                    {
                        var page = region.region.renderObject.page;
                        this.SetupTPE(page.name, page.width, page.height, page.rendererObject);
                    }
                    tex = Graphics_CacheBlock(this.m_TPE[region.region.renderObject.page.name], col);
                }

                //var atlasPage = region.region.texture;
                var atlasPage = region.region.renderObject.page;                                
                tpe = this.m_TPE[atlasPage.name];
            }
            else
            {
                // Draw as a quad rather than tris to avoid triangulation artifacts
                this.DrawRegion_RELEASE(slot, col, a / 255.0, _rotation_matrix, _origin_x, _origin_y);
            }
        }
        else if (slot.attachment instanceof spine.MeshAttachment)
        {
            var mesh = slot.attachment;
            mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);

            verts = vertices;
            uvs = mesh.uvs;
            indices = mesh.triangles;

            numVerts = mesh.worldVerticesLength;
            numIndices = mesh.triangles.length;
            
            tex = g_Textures[mesh.region.renderObject.page.texture.rendererObject];
            if (!tex.complete)
                continue;

            if (col != g_CacheWhite)
            {
                if (!this.m_TPE[mesh.region.renderObject.page.name])
                {
                    var page = mesh.region.renderObject.page;
                    this.SetupTPE(page.name, page.width, page.height, mesh.region.renderObject.page.rendererObject);
                }
                tex = Graphics_CacheBlock(this.m_TPE[mesh.region.renderObject.page.name], col);
            }
            tpe = this.m_TPE[mesh.region.renderObject.page.name];
        }
        else if (slot.attachment instanceof spine.ClippingAttachment)
        {
            if (this.m_clipper == null)
            {
                this.m_clipper = new spine.SkeletonClipping();
            }

            this.m_clipper.clipStart(slot, slot.attachment);
            continue;
        }

        if ((numVerts > 0) && (tex != null))
        {
            if ((this.m_clipper != null) && (this.m_clipper.isClipping()))
            {
                this.m_clipper.clipTriangles(vertices, numVerts * 2, indices, numIndices, uvs, clipcol, clipcol, twoColorTint);
                verts = this.m_clipper.clippedVertices;
                uvs = this.m_clipper.clippedVertices;
                indices = this.m_clipper.clippedTriangles;
                vertstride = 8;
                uvoffset = 6;

                numVerts = verts.length / vertstride;
                numIndices = indices.length;
            }
           
            for (var v = 0; v < numIndices / 3; v++)
            {
                var baseIdx = v * 3;
                var ind0 = indices[baseIdx++] * vertstride,
                    ind1 = indices[baseIdx++] * vertstride,
                    ind2 = indices[baseIdx++] * vertstride;

                var pts = [];
                pts[0] = {};
                pts[0].x = verts[ind0];
                pts[0].u = uvs[uvoffset + ind0];
                ind0++;
                pts[0].y = verts[ind0];
                pts[0].v = uvs[uvoffset + ind0];

                pts[1] = {};
                pts[1].x = verts[ind1];
                pts[1].u = uvs[uvoffset + ind1];
                ind1++;
                pts[1].y = verts[ind1];
                pts[1].v = uvs[uvoffset + ind1];

                pts[2] = {};
                pts[2].x = verts[ind2];
                pts[2].u = uvs[uvoffset + ind2];
                ind2++;
                pts[2].y = verts[ind2];
                pts[2].v = uvs[uvoffset + ind2];

                /* Apply sprite rotation to X/Y co-ordinates. */
                for(var pi = 0; pi < 3; ++pi)
                {
                    var tmp = RotatePointAroundOrigin([ pts[pi].x, pts[pi].y ], [ _origin_x, _origin_y ], _rotation_matrix);
                    pts[pi].x = tmp[0];
                    pts[pi].y = tmp[1];
                }

                this.drawTriangle(graphics, tex,
                                pts[0].x, pts[0].y,
                                pts[1].x, pts[1].y,
                                pts[2].x, pts[2].y,
                                pts[0].u * tpe.w, pts[0].v * tpe.h,
                                pts[1].u * tpe.w, pts[1].v * tpe.h,
                                pts[2].u * tpe.w, pts[2].v * tpe.h);

                /*pCoords[v0 + 0] = verts[(index * vertstride) + 0];
                pCoords[v0 + 1] = verts[(index * vertstride) + 1];
                pCoords[v0 + 2] = GR_Depth;

                pColours[v0 + 0] = col;

                pUVs[v0 + 0] = uvs[(index * vertstride) + uvoffset + 0];
                pUVs[v0 + 1] = uvs[(index * vertstride) + uvoffset + 1];*/
            }
        }

        if (this.m_clipper != null)
        {
            this.m_clipper.clipEndWithSlot(slot);
        }

        /*if (slot.attachment instanceof spine.RegionAttachment)
        {
            this.DrawRegion_RELEASE(slot, col, alpha);
        }
        else if (slot.attachment instanceof spine.MeshAttachment)
        {
            this.DrawMesh_RELEASE(slot, col, alpha);
        }*/
    }

    if (this.m_clipper != null)
    {
        this.m_clipper.clipEnd();
    }
};

function ConvertSpineBlend(_spineBlendmode, _premul, _convertedblend)
{
    if (_premul == false)
    {
        switch(_spineBlendmode)
        {
            case spine.BlendMode.Normal: _convertedblend.src = yyGL.Blend_SrcAlpha; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
            case spine.BlendMode.Additive: _convertedblend.src = yyGL.Blend_SrcAlpha; _convertedblend.dest = yyGL.Blend_One; break;
            case spine.BlendMode.Multiply: _convertedblend.src = yyGL.Blend_DestColour; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
            case spine.BlendMode.Screen: _convertedblend.src = yyGL.Blend_One; _convertedblend.dest = yyGL.Blend_InvSrcColour; break;
            default: _convertedblend.src = yyGL.Blend_SrcAlpha; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
        }
    }
    else
    {
        switch (_spineBlendmode)
        {
            case spine.BlendMode.Normal: _convertedblend.src = yyGL.Blend_One; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
            case spine.BlendMode.Additive: _convertedblend.src = yyGL.Blend_One; _convertedblend.dest = yyGL.Blend_One; break;
            case spine.BlendMode.Multiply: _convertedblend.src = yyGL.Blend_DestColour; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
            case spine.BlendMode.Screen: _convertedblend.src = yyGL.Blend_One; _convertedblend.dest = yyGL.Blend_InvSrcColour; break;
            default: _convertedblend.src = yyGL.Blend_SrcAlpha; _convertedblend.dest = yyGL.Blend_InvSrcAlpha; break;
        }
    }
}

yySkeletonSprite.prototype.DrawSkeleton_WebGL = function (_skeleton, _gmr, _gmg, _gmb, _alpha, _rotation_matrix, _origin_x, _origin_y)
{
    var regionIndices = [0, 1, 2, 2, 3, 0];
    var vertices = [];
    var clipcol = new spine.Color(1.0, 1.0, 1.0, 1.0);
    var twoColorTint = false;

    var oldsrcblend, olddestblend, oldsrcblenda, olddestblenda;
    var oldsepalpha;
    if (g_SpinePerSlotBlendmodes == true)
    {
        oldsrcblend = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlend);
        olddestblend = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlend);
        oldsrcblenda = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SrcBlendAlpha);
        olddestblenda = g_webGL.RSMan.GetRenderState(yyGL.RenderState_DestBlendAlpha);
        oldsepalpha = g_webGL.RSMan.GetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable);
    }

    var darkcol = new spine.Color(0.0, 0.0, 0.0, 0.0);

    var shaderChanged = false;
    if (g_CurrentShader != g_SpineCurrUserShader)
    {
        g_SpineCurrUserShader = g_CurrentShader;
        shaderChanged = true;

        if (g_SpineCurrUserShader != -1)
        {
            g_SpineTintBlackUniform = shader_get_uniform(g_SpineCurrUserShader, "gm_SpineTintBlackColour");            
        }
    }

    for (var i = 0, n = _skeleton.slots.length; i < n; i++)
    {
        var slot = _skeleton.drawOrder[i];
        if (!slot.attachment)
            continue;

        var r = (_gmr * 255);
        var g = (_gmg * 255);
        var b = (_gmb * 255);
        var a = (_alpha * 255);
        if ((slot.skeleton != undefined) && (slot.skeleton.r != undefined))
        {
            r *= slot.skeleton.r;
            g *= slot.skeleton.g;
            b *= slot.skeleton.b;
            a *= slot.skeleton.a;
        }
        if (slot.color != undefined)
        {
            r *= slot.color.r;
            g *= slot.color.g;
            b *= slot.color.b;
            a *= slot.color.a;
        }
        if (slot.attachment.color != undefined)
        {
            r *= slot.attachment.color.r;
            g *= slot.attachment.color.g;
            b *= slot.attachment.color.b;
            a *= slot.attachment.color.a;
        }
        var col;
        col = (a << 24) | (r << 0) | (g << 8) | (b << 16);

        if (g_SpineCurrUserShader != -1)
        {
            if ((g_SpineTintBlackUniform != undefined) && (g_SpineTintBlackUniform != -1))
            {
                var pDark;
                if ((slot.darkColor != undefined) && (slot.darkColor != null))
                {
                    pDark = slot.darkColor;
                }
                else
                {
                    pDark = darkcol;
                }

                var newcol = [pDark.r * _gmr, pDark.g * _gmg, pDark.b * _gmb, _alpha];

                if ((shaderChanged) || ((g_SpineTintBlackCol[0] != newcol[0]) || (g_SpineTintBlackCol[1] != newcol[1]) || (g_SpineTintBlackCol[2] != newcol[2]) || (g_SpineTintBlackCol[3] != newcol[3])))
                {
                    g_SpineTintBlackCol = newcol;

                    shader_set_uniform_f_array(g_SpineTintBlackUniform, g_SpineTintBlackCol);

                    shaderChanged = false;
                }
            }
        }

        var verts = null;
        var uvs = null;
        var indices = null;

        var vertstride = 2;        
        var uvoffset = 0;

        var numVerts = 0;
        var numIndices = 0;

        var tex = null;

        if (slot.attachment instanceof spine.RegionAttachment)
        {
            var region = slot.attachment;
            region.computeWorldVertices(slot.bone, vertices, 0, 2);

            verts = vertices;
            uvs = region.uvs;
            indices = regionIndices;

            numVerts = 4;
            numIndices = 6;

            tex = g_Textures[region.region.renderObject.page.texture.rendererObject];            
        }
        else if (slot.attachment instanceof spine.MeshAttachment)
        {
            var mesh = slot.attachment;
            mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);

            verts = vertices;
            uvs = mesh.uvs;
            indices = mesh.triangles;

            numVerts = mesh.worldVerticesLength;
            numIndices = mesh.triangles.length;

            tex = g_Textures[mesh.region.renderObject.page.texture.rendererObject];            
        }
        else if (slot.attachment instanceof spine.ClippingAttachment)
        {
            if (this.m_clipper == null)
            {
                this.m_clipper = new spine.SkeletonClipping();                
            }

            this.m_clipper.clipStart(slot, slot.attachment);
            continue;
        }

        if ((numVerts > 0) && (tex != null))
        {
            if (!tex.complete)
                continue;

            if (!tex.webgl_textureid)
                WebGL_BindTexture({ texture: tex });

            if ((this.m_clipper != null) && (this.m_clipper.isClipping()))
            {
                this.m_clipper.clipTriangles(vertices, numVerts * 2, indices, numIndices, uvs, clipcol, clipcol, twoColorTint);
                verts = this.m_clipper.clippedVertices;
                uvs = this.m_clipper.clippedVertices;
                indices = this.m_clipper.clippedTriangles;
                vertstride = 8;
                uvoffset = 6;

                numVerts = verts.length / vertstride;
                numIndices = indices.length;
            }

            if (g_SpinePerSlotBlendmodes == true)
            {
                var slotBlendMode = slot.data.blendMode;
                var convertedblend = new Object();                
                ConvertSpineBlend(slotBlendMode, this.m_premultiplied, convertedblend);
                g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, convertedblend.src);
                g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, convertedblend.dest);
                g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, convertedblend.src);
                g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, convertedblend.dest);
            }

            var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numIndices);
            var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
            var index = stride * pBuff.Current;
            pBuff.Current += numIndices;

            var pCoords = pBuff.Coords;
            var pColours = pBuff.Colours;
            var pUVs = pBuff.UVs;

            var v0 = index;
            for (var v = 0; v < numIndices; v++, v0 += stride)
            {
                var index = indices[v];

                /* Apply sprite rotation to X/Y co-ordinates. */

                var vx = verts[(index * vertstride) + 0];
                var vy = verts[(index * vertstride) + 1];
                var rotatedXY = RotatePointAroundOrigin([ vx, vy ], [ _origin_x, _origin_y ], _rotation_matrix);

                pCoords[v0 + 0] = rotatedXY[0];
                pCoords[v0 + 1] = rotatedXY[1];
                pCoords[v0 + 2] = GR_Depth;

                pColours[v0 + 0] = col;

                pUVs[v0 + 0] = uvs[(index * vertstride) + uvoffset + 0];
                pUVs[v0 + 1] = uvs[(index * vertstride) + uvoffset + 1];
            }
        }

        if (this.m_clipper != null)
        {
            this.m_clipper.clipEndWithSlot(slot);
        }
    }

    if (this.m_clipper != null)
    {
        this.m_clipper.clipEnd();
    }

    if (g_SpinePerSlotBlendmodes == true)
    {
        g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlend, oldsrcblend);
        g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlend, olddestblend);
        g_webGL.RSMan.SetRenderState(yyGL.RenderState_SrcBlendAlpha, oldsrcblenda);
        g_webGL.RSMan.SetRenderState(yyGL.RenderState_DestBlendAlpha, olddestblenda);
        g_webGL.RSMan.SetRenderState(yyGL.RenderState_SeparateAlphaBlendEnable, oldsepalpha);
    }
};

// #############################################################################################
/// Function:<summary>
///             Draw a collision bounds
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawCollisionBounds = function (_skeletonBounds) {

    draw_line(_skeletonBounds.minX, _skeletonBounds.minY, _skeletonBounds.minX, _skeletonBounds.maxY);
	draw_line(_skeletonBounds.minX, _skeletonBounds.maxY, _skeletonBounds.maxX, _skeletonBounds.maxY);
	draw_line(_skeletonBounds.maxX, _skeletonBounds.maxY, _skeletonBounds.maxX, _skeletonBounds.minY);
	draw_line(_skeletonBounds.maxX, _skeletonBounds.minY, _skeletonBounds.minX, _skeletonBounds.minY);

	for (var n = 0; n < _skeletonBounds.polygons.length; n++) {

		var boundsPoly = _skeletonBounds.polygons[n];
		var size = boundsPoly.length / 2;
		for (var m = 0; m < size; m++) {

			var x1, y1, x2, y2;
			x1 = boundsPoly[(m * 2) + 0];
			y1 = boundsPoly[(m * 2) + 1];
			if (m == (size - 1)) {
				x2 = boundsPoly[0];
				y2 = boundsPoly[1];
			}
			else {
				x2 = boundsPoly[((m + 1) * 2) + 0];
				y2 = boundsPoly[((m + 1) * 2) + 1];
			}
			draw_line(x1, y1, x2, y2);
		}		
	}
};


// #############################################################################################
/// Function:<summary>
///             Draw data non-WebGL style
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawRegion_RELEASE = function (slot, col, alpha, rotationMatrix, originX, originY) {

    var region = slot.attachment, vertices = [], uvs;
	var posX = 0;
	var posY = 0;
	if ( slot.skeleton ) {
		posX = slot.skeleton.x;
		posY = slot.skeleton.y;
	}
	else if (slot.bone.skeleton)
	{
		posX=slot.bone.skeleton.x;
		posY=slot.bone.skeleton.y;
    }
	/*region.computeVertices(posX, posY, slot.bone, vertices); 	

    var pts = [];
	pts[0] = {};
	pts[0].x = vertices[2];
	pts[0].y = vertices[3];
	pts[0].u = region.uvs[2];
	pts[0].v = region.uvs[3];

	pts[1] = {};
	pts[1].x = vertices[4];
	pts[1].y = vertices[5];
	pts[1].u = region.uvs[4];
	pts[1].v = region.uvs[5];
	
	pts[2] = {};
	pts[2].x = vertices[6];
	pts[2].y = vertices[7];
	pts[2].u = region.uvs[6];
	pts[2].v = region.uvs[7];	
	
	pts[3] = {};
	pts[3].x = vertices[0];
	pts[3].y = vertices[1];
	pts[3].u = region.uvs[0];
	pts[3].v = region.uvs[1];*/
	
    //vertices = region.updateWorldVertices(slot, false);
	region.computeWorldVertices(slot.bone, vertices, 0, 2);
	uvs = region.uvs;
	
	var pts = [];
	pts[0] = {};
	pts[0].x = vertices[REGIONATTACHMENT_OX2];
	pts[0].y = vertices[REGIONATTACHMENT_OY2];
	pts[0].u = uvs[REGIONATTACHMENT_OX2];
	pts[0].v = uvs[REGIONATTACHMENT_OY2];

	pts[1] = {};
	pts[1].x = vertices[REGIONATTACHMENT_OX3];
	pts[1].y = vertices[REGIONATTACHMENT_OY3];
	pts[1].u = uvs[REGIONATTACHMENT_OX3];
	pts[1].v = uvs[REGIONATTACHMENT_OY3];
	
	pts[2] = {};
	pts[2].x = vertices[REGIONATTACHMENT_OX4];
	pts[2].y = vertices[REGIONATTACHMENT_OY4];
	pts[2].u = uvs[REGIONATTACHMENT_OX4];
	pts[2].v = uvs[REGIONATTACHMENT_OY4];
	
	/*pts[3] = {};
	pts[3].x = vertices[REGIONATTACHMENT_OX1];
	pts[3].y = vertices[REGIONATTACHMENT_OY1];
	pts[3].u = uvs[REGIONATTACHMENT_OX1];
	pts[3].v = uvs[REGIONATTACHMENT_OY1];*/

	/* Apply sprite rotation to X/Y co-ordinates. */
	for(var i = 0; i < 3; ++i)
	{
		var tmp = RotatePointAroundOrigin([ pts[i].x, pts[i].y ], [ originX, originY ], rotationMatrix);;
		pts[i].x = tmp[0];
		pts[i].y = tmp[1];
	}

	graphics.globalAlpha = alpha;
	
	var atlasPage = region.region.renderObject.page;
    //var tex = g_Textures[atlasPage.rendererObject];
	var tex = g_Textures[atlasPage.texture.rendererObject];
	if (!tex.complete) return;



	if (col != g_CacheWhite) {
		
	    if (!this.m_TPE[region.region.renderObject.page.name]) {
	    
	        var page = region.region.renderObject.page;
	        this.SetupTPE(page.name, page.width, page.height, page.rendererObject);
	    }
	    tex = Graphics_CacheBlock(this.m_TPE[region.region.renderObject.page.name], col);
    }

	var tpe = this.m_TPE[atlasPage.name];
	this.drawQuad(graphics, tex,
                    pts[0].x, pts[0].y,
                    pts[1].x, pts[1].y,
                    pts[2].x, pts[2].y,
                    pts[0].u * tpe.w, pts[0].v * tpe.h,
                    pts[1].u * tpe.w, pts[1].v * tpe.h,
                    pts[2].u * tpe.w, pts[2].v * tpe.h);
	/*this.drawTriangle(graphics, tex,
                    pts[0].x, pts[0].y,
                    pts[1].x, pts[1].y,
                    pts[2].x, pts[2].y,
                    pts[0].u * tpe.w, pts[0].v * tpe.h,
                    pts[1].u * tpe.w, pts[1].v * tpe.h,
                    pts[2].u * tpe.w, pts[2].v * tpe.h);
                    
    this.drawTriangle(graphics, tex,
                    pts[2].x, pts[2].y,
                    pts[3].x, pts[3].y,
                    pts[0].x, pts[0].y,
                    pts[2].u * tpe.w, pts[2].v * tpe.h,
                    pts[3].u * tpe.w, pts[3].v * tpe.h,
                    pts[0].u * tpe.w, pts[0].v * tpe.h);*/
};

// #############################################################################################
/// Function:<summary>    
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawMesh_RELEASE = function (slot, col, alpha) {

	var mesh=slot.attachment, vertices=[], uvs;
    //vertices = mesh.updateWorldVertices(slot, false);
	mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);
	uvs = mesh.uvs;

	var atlasPage = mesh.region.renderObject.page;		

	// This is going to get repeated often... 
    //var tex = g_Textures[atlasPage.rendererObject];
	var tex = g_Textures[mesh.region.renderObject.page.texture.rendererObject];
	if (!tex.complete) return;

	if (col != g_CacheWhite) {	
	    if (!this.m_TPE[mesh.region.renderObject.page.name]) {	    
	        var page = mesh.region.renderObject.page;
	        this.SetupTPE(page.name, page.width, page.height, mesh.region.renderObject.page.rendererObject);
	    }
	    tex = Graphics_CacheBlock(this.m_TPE[mesh.region.renderObject.page.name], col);
    }
	
    // trianglesCount referring to the number of indices rather than the number of triangles...
	for (var n = 0; n < mesh.triangles.length / 3; n++) {
	
		var baseIdx = n*3; 
	    var ind0 = mesh.triangles[baseIdx++]*2,
	        ind1 = mesh.triangles[baseIdx++]*2,
	        ind2 = mesh.triangles[baseIdx++]*2;
	    
	    var pts = [];
    	pts[0] = {};
    	pts[0].x = vertices[ind0];
    	pts[0].u = uvs[ind0++];
    	pts[0].y = vertices[ind0];
    	pts[0].v = uvs[ind0];
    	
    	pts[1] = {};
    	pts[1].x = vertices[ind1];
    	pts[1].u = uvs[ind1++];
    	pts[1].y = vertices[ind1];
    	pts[1].v = uvs[ind1];
    	
    	pts[2] = {};
    	pts[2].x = vertices[ind2];
    	pts[2].u = uvs[ind2++];
    	pts[2].y = vertices[ind2];
    	pts[2].v = uvs[ind2];
	    
        var tpe = this.m_TPE[mesh.region.renderObject.page.name];
        this.drawTriangle(graphics, tex,
                        pts[0].x, pts[0].y,
                        pts[1].x, pts[1].y,
                        pts[2].x, pts[2].y,
                        pts[0].u * tpe.w, pts[0].v * tpe.h,
                        pts[1].u * tpe.w, pts[1].v * tpe.h,
                        pts[2].u * tpe.w, pts[2].v * tpe.h);
	}
};

// #############################################################################################
/// Function:<summary>    
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawSkinnedMesh_RELEASE = function (slot, col, alpha) {

	var mesh=slot.attachment,vertices=[];	
	var posX=0;
	var posY=0;
	if(slot.skeleton)
	{
		posX=slot.skeleton.x;
		posY=slot.skeleton.y;
	}
	else if (slot.bone.skeleton)
	{
		posX=slot.bone.skeleton.x;
		posY=slot.bone.skeleton.y;
    }    	
	mesh.computeWorldVertices(posX, posY, slot, vertices);
	
	// These are going to get repeated often... 
	var page = mesh.rendererObject.page;
	var tex = g_Textures[page.rendererObject];
	
	if (col != g_CacheWhite) {	
	    if (!this.m_TPE[page.name]) {	    
	        this.SetupTPE(page.name, page.width, page.height, page.rendererObject);
	    }
	    tex = Graphics_CacheBlock(this.m_TPE[page.name], col);
    }
		
    // trianglesCount referring to the number of indices rather than the number of triangles...
	for (var n = 0; n < mesh.triangles.length / 3; n++) {
	
	    var ind0 = mesh.triangles[(n * 3) + 0],
	        ind1 = mesh.triangles[(n * 3) + 1],
	        ind2 = mesh.triangles[(n * 3) + 2];
	        
	    var pts = [];
    	pts[0] = {};
    	pts[0].x = vertices[(ind0 * 2) + 0];
    	pts[0].y = vertices[(ind0 * 2) + 1];
    	pts[0].u = mesh.uvs[(ind0 * 2) + 0];
    	pts[0].v = mesh.uvs[(ind0 * 2) + 1];
    	
    	pts[1] = {};
    	pts[1].x = vertices[(ind1 * 2) + 0];
    	pts[1].y = vertices[(ind1 * 2) + 1];
    	pts[1].u = mesh.uvs[(ind1 * 2) + 0];
    	pts[1].v = mesh.uvs[(ind1 * 2) + 1];
    	
    	pts[2] = {};
    	pts[2].x = vertices[(ind2 * 2) + 0];
    	pts[2].y = vertices[(ind2 * 2) + 1];
    	pts[2].u = mesh.uvs[(ind2 * 2) + 0];
    	pts[2].v = mesh.uvs[(ind2 * 2) + 1];
	    
        var tpe = this.m_TPE[page.name];
        this.drawTriangle(graphics, tex,
                        pts[0].x, pts[0].y,
                        pts[1].x, pts[1].y,
                        pts[2].x, pts[2].y,
                        pts[0].u * tpe.w, pts[0].v * tpe.h,
                        pts[1].u * tpe.w, pts[1].v * tpe.h,
                        pts[2].u * tpe.w, pts[2].v * tpe.h);
	}
};

// #############################################################################################
/// Function:<summary>    
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.drawTriangle = function(ctx, im, x0, y0, x1, y1, x2, y2,
                                                            sx0, sy0, sx1, sy1, sx2, sy2) 
{
    // Lifted from: http://tulrich.com/geekstuff/canvas/perspective.html
    ctx.save();

    // Clip the output to the on-screen triangle boundaries.
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();    
    ctx.clip();

    /*
      ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

      The context matrix is:

      [ m11 m21 dx ]
      [ m12 m22 dy ]
      [  0   0   1 ]

      Coords are column vectors with a 1 in the z coord, so the transform is:
      x_out = m11 * x + m21 * y + dx;
      y_out = m12 * x + m22 * y + dy;

      From Maxima, these are the transform values that map the source
      coords to the dest coords:

      sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
      [m11 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
      m12 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
      m21 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
      m22 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
      dx = ----------------------------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
      dy = ----------------------------------------------------------------------]
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
    */

    // TODO: eliminate common subexpressions.
    var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
    if (denom == 0) {
        return;
    }
    var m11 = - (sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
    var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
    var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
    var m22 = - (sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
    var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
    var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

    ctx.transform(m11, m12, m21, m22, dx, dy);
    // Draw the whole image.  Transform and clip will map it onto the
    // correct output triangle.
    ctx.drawImage(im, 0, 0);
    ctx.restore();
};


yySkeletonSprite.prototype.drawQuad = function (ctx, im, x0, y0, x1, y1, x2, y2,
                                                            sx0, sy0, sx1, sy1, sx2, sy2)
{
    // Based on: http://tulrich.com/geekstuff/canvas/perspective.html
    ctx.save();

    // Hacked version of drawTriangle that draws a quad instead
    // Since the transformation is a simple matrix transform there's a limited range of operations
    // that can be performed (shearing is the most complex thing that can be done) so we can derive the fourth coordinate
    // from the other three

    var x3, y3;
    x3 = x0 + (x2 - x1);
    y3 = y0 + (y2 - y1);

    // Clip the output to the on-screen triangle boundaries.
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.clip();

    /*
      ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

      The context matrix is:

      [ m11 m21 dx ]
      [ m12 m22 dy ]
      [  0   0   1 ]

      Coords are column vectors with a 1 in the z coord, so the transform is:
      x_out = m11 * x + m21 * y + dx;
      y_out = m12 * x + m22 * y + dy;

      From Maxima, these are the transform values that map the source
      coords to the dest coords:

      sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
      [m11 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
      m12 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
      m21 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
      m22 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
      dx = ----------------------------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
      dy = ----------------------------------------------------------------------]
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
    */

    // TODO: eliminate common subexpressions.
    var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
    if (denom == 0)
    {
        return;
    }
    var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
    var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
    var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
    var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
    var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
    var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

    ctx.transform(m11, m12, m21, m22, dx, dy);
    // Draw the whole image.  Transform and clip will map it onto the
    // correct output triangle.
    ctx.drawImage(im, 0, 0);
    ctx.restore();
};



// #############################################################################################
/// Function:<summary>
///             Draw a region WebGL style
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawRegion_WebGL = function (slot, col, alpha, rotationMatrix) {

    var region = slot.attachment, vertices = [], uvs;	
	var posX=0;
	var posY=0;
	if(slot.skeleton)
	{
		posX=slot.skeleton.x;
		posY=slot.skeleton.y;
	}
	else if ( slot.bone.skeleton)
	{
		posX=slot.bone.skeleton.x;
		posY=slot.bone.skeleton.y;
    }
    //region.computeVertices(posX,posY,slot.bone,vertices);
    //vertices = region.updateWorldVertices(slot, false);
    //vertices = region.updateWorldVertices(slot, false);
	region.computeWorldVertices(slot.bone, vertices, 0, 2);
	uvs = region.uvs;
	
	/*var pts = [];
	pts[0] = {};
	pts[0].x = vertices[REGIONATTACHMENT_OX2];
	pts[0].y = vertices[REGIONATTACHMENT_OY2];
	pts[0].u = uvs[REGIONATTACHMENT_OX2];
	pts[0].v = uvs[REGIONATTACHMENT_OY2];

	pts[1] = {};
	pts[1].x = vertices[REGIONATTACHMENT_OX3];
	pts[1].y = vertices[REGIONATTACHMENT_OY3];
	pts[1].u = uvs[REGIONATTACHMENT_OX3];
	pts[1].v = uvs[REGIONATTACHMENT_OY3];
	
	pts[2] = {};
	pts[2].x = vertices[REGIONATTACHMENT_OX4];
	pts[2].y = vertices[REGIONATTACHMENT_OY4];
	pts[2].u = uvs[REGIONATTACHMENT_OX4];
	pts[2].v = uvs[REGIONATTACHMENT_OY4];
	
	pts[3] = {};
	pts[3].x = vertices[REGIONATTACHMENT_OX1];
	pts[3].y = vertices[REGIONATTACHMENT_OY1];
	pts[3].u = uvs[REGIONATTACHMENT_OX1];
	pts[3].v = uvs[REGIONATTACHMENT_OY1];*/
    
    var tex = g_Textures[region.region.renderObject.texture.rendererObject];
    if (!tex.complete) return;    
    if (!tex.webgl_textureid) WebGL_BindTexture({ texture: tex });

    var numVerts = 6;
	var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
	var index = stride * pBuff.Current; 
    pBuff.Current += numVerts;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;
    var pUVs = pBuff.UVs;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    
    // tl
	pCoords[v0 + 0] = pCoords[v5 + 0] = vertices[REGIONATTACHMENT_OX2];
	pCoords[v0 + 1] = pCoords[v5 + 1] = vertices[REGIONATTACHMENT_OY2];
	// tr
	pCoords[v1 + 0] = vertices[REGIONATTACHMENT_OX3];
	pCoords[v1 + 1] = vertices[REGIONATTACHMENT_OY3];
	// br
	pCoords[v2 + 0] = pCoords[v3 + 0] = vertices[REGIONATTACHMENT_OX4];
	pCoords[v2 + 1] = pCoords[v3 + 1] = vertices[REGIONATTACHMENT_OY4];
	// bl
	pCoords[v4 + 0] = vertices[REGIONATTACHMENT_OX1];
	pCoords[v4 + 1] = vertices[REGIONATTACHMENT_OY1];	
	// z
	pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
	
    pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
    
    //
    pUVs[v0 + 0] = pUVs[v5 + 0] = uvs[REGIONATTACHMENT_OX2];
    pUVs[v0 + 1] = pUVs[v5 + 1] = uvs[REGIONATTACHMENT_OY2];
	// tr
    pUVs[v1 + 0] = uvs[REGIONATTACHMENT_OX3];
    pUVs[v1 + 1] = uvs[REGIONATTACHMENT_OY3];
	// br
    pUVs[v2 + 0] = pUVs[v3 + 0] = uvs[REGIONATTACHMENT_OX4];
    pUVs[v2 + 1] = pUVs[v3 + 1] = uvs[REGIONATTACHMENT_OY4];
	// bl
    pUVs[v4 + 0] = uvs[REGIONATTACHMENT_OX1];
    pUVs[v4 + 1] = uvs[REGIONATTACHMENT_OY1];
};


// #############################################################################################
/// Function:<summary>
///             Draw a mesh WebGL style
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.DrawMesh_WebGL = function (slot, col, alpha) {

    var mesh = slot.attachment, vertices = [], uvs;
	var posX=0;
	var posY=0;
	if(slot.skeleton)
	{
		posX=slot.skeleton.x;
		posY=slot.skeleton.y;
	}
	else if (slot.bone.skeleton)
	{
		posX=slot.bone.skeleton.x;
		posY=slot.bone.skeleton.y;
    }    	
	//mesh.computeWorldVertices(posX,posY,slot,vertices);
    //vertices = mesh.updateWorldVertices(slot, false);
	mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);
	uvs = mesh.uvs;
    
    //var tex = g_Textures[mesh.rendererObject.page.rendererObject];
    var tex = g_Textures[mesh.region.renderObject.texture.rendererObject];
    if (!tex.complete) return;    
    if (!tex.webgl_textureid) WebGL_BindTexture({ texture: tex });
    
    var numVerts = mesh.triangles.length;
	var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, tex.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, numVerts);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types	                            	
	var index = stride * pBuff.Current; 
    pBuff.Current += numVerts;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;
    var pUVs = pBuff.UVs;
    	
    // trianglesCount referring to the number of indices rather than the number of triangles...
    var v0 = index;    
	for (var n = 0; n < numVerts; n++, v0 += stride) {
	
	    var ind0 = mesh.triangles[n];
	        
	    pCoords[v0 + 0] = vertices[(ind0 * 2) + 0];
	    pCoords[v0 + 1] = vertices[(ind0 * 2) + 1];	    
	    pCoords[v0 + 2] = GR_Depth;
	    
	    pColours[v0 + 0] = pColours[v0 + 1] = col;
	    
	    pUVs[v0 + 0] = uvs[(ind0 * 2) + 0];
        pUVs[v0 + 1] = uvs[(ind0 * 2) + 1];
	}
};

yySkeletonSprite.prototype.PointInRegion = function (slot, _x, _y)
{
    var region = slot.attachment, vertices = [];

    region.computeWorldVertices(slot.bone, vertices, 0, 2);

    // Simple cross-product tests
    // We assume the vertices form a convex quad	

    var edge1x, edge1y, edge2x, edge2y;
    var res;

    // First edge
    edge1x = _x - vertices[REGIONATTACHMENT_OX1];
    edge1y = _y - vertices[REGIONATTACHMENT_OY1];

    edge2x = vertices[REGIONATTACHMENT_OX2] - vertices[REGIONATTACHMENT_OX1];
    edge2y = vertices[REGIONATTACHMENT_OY2] - vertices[REGIONATTACHMENT_OY1];

    res = (edge1x * edge2y) - (edge1y * edge2x);

    if (res >= 0)
        return false;

    // Third edge (intuitively it seems that this will restrict the subspace more efficiently than alternating axes)
    edge1x = _x - vertices[REGIONATTACHMENT_OX3];
    edge1y = _y - vertices[REGIONATTACHMENT_OY3];

    edge2x = vertices[REGIONATTACHMENT_OX4] - vertices[REGIONATTACHMENT_OX3];
    edge2y = vertices[REGIONATTACHMENT_OY4] - vertices[REGIONATTACHMENT_OY3];

    res = (edge1x * edge2y) - (edge1y * edge2x);

    if (res >= 0)
        return false;

    // Second edge
    edge1x = _x - vertices[REGIONATTACHMENT_OX2];
    edge1y = _y - vertices[REGIONATTACHMENT_OY2];

    edge2x = vertices[REGIONATTACHMENT_OX3] - vertices[REGIONATTACHMENT_OX2];
    edge2y = vertices[REGIONATTACHMENT_OY3] - vertices[REGIONATTACHMENT_OY2];

    res = (edge1x * edge2y) - (edge1y * edge2x);

    if (res >= 0)
        return false;

    // Fourth edge
    edge1x = _x - vertices[REGIONATTACHMENT_OX4];
    edge1y = _y - vertices[REGIONATTACHMENT_OY4];

    edge2x = vertices[REGIONATTACHMENT_OX1] - vertices[REGIONATTACHMENT_OX4];
    edge2y = vertices[REGIONATTACHMENT_OY1] - vertices[REGIONATTACHMENT_OY4];

    res = (edge1x * edge2y) - (edge1y * edge2x);

    if (res >= 0)
        return false;

    return true;
};

yySkeletonSprite.prototype.PointInMesh = function (slot, _x, _y)
{

    var mesh = slot.attachment, vertices = [];   
    mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, 2);

    var edge1x, edge1y, edge2x, edge2y;
    var res;

    // trianglesCount referring to the number of indices rather than the number of triangles...   
    var numIndices = mesh.triangles.length;
    for (var n = 0; n < numIndices; n += 3)
    {
        var ind0 = mesh.triangles[n + 0];
        var ind1 = mesh.triangles[n + 1];
        var ind2 = mesh.triangles[n + 2];

        var v0x = vertices[(ind0 * 2) + 0];
        var v0y = vertices[(ind0 * 2) + 1];

        var v1x = vertices[(ind1 * 2) + 0];
        var v1y = vertices[(ind1 * 2) + 1];

        var v2x = vertices[(ind2 * 2) + 0];
        var v2y = vertices[(ind2 * 2) + 1];

        // First edge
        edge1x = _x - v0x;
        edge1y = _y - v0y;

        edge2x = v1x - v0x;
        edge2y = v1y - v0y;

        res = (edge1x * edge2y) - (edge1y * edge2x);

        if (res >= 0)
            continue;

        // Second edge
        edge1x = _x - v1x;
        edge1y = _y - v1y;

        edge2x = v2x - v1x;
        edge2y = v2y - v1y;

        res = (edge1x * edge2y) - (edge1y * edge2x);

        if (res >= 0)
            continue;

        // Third edge
        edge1x = _x - v2x;
        edge1y = _y - v2y;

        edge2x = v0x - v2x;
        edge2y = v0y - v2y;

        res = (edge1x * edge2y) - (edge1y * edge2x);

        if (res >= 0)
            continue;

        // Okay we have a hit!        
        return true;
    }

    return false;
};

yySkeletonSprite.prototype.PointInBoundingBox = function (slot, _x, _y)
{

    var boundingBox = slot.attachment, vertices = [];
    boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, vertices, 0, 2);

    var edge1x, edge1y, edge2x, edge2y;
    var res;

    var idx = 0;
    for (var n = 0; n < ((boundingBox.worldVerticesLength)/2) - 1; n++)
    {
        var v0x = vertices[idx + 0];
        var v0y = vertices[idx + 1];

        idx += 2;

        var v1x = vertices[idx + 0];
        var v1y = vertices[idx + 1];

        // Test edge
        edge1x = _x - v0x;
        edge1y = _y - v0y;

        edge2x = v1x - v0x;
        edge2y = v1y - v0y;

        res = (edge1x * edge2y) - (edge1y * edge2x);

        if (res <= 0)
        {
            // The point is on the wrong side of the edge, so bail            
            return false;
        }		
    }

    // Special case last iteration
    var v0x = vertices[idx + 0];
    var v0y = vertices[idx + 1];	

    var v1x = vertices[0];
    var v1y = vertices[1];

    // Test edge
    edge1x = _x - v0x;
    edge1y = _y - v0y;

    edge2x = v1x - v0x;
    edge2y = v1y - v0y;

    res = (edge1x * edge2y) - (edge1y * edge2x);

    if (res <= 0)
    {
        // The point is on the wrong side of the edge, so bail        
        return false;
    }

    // We've passed all the tests so the point is inside    
    return true;
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of animations to the list
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.GetAnimationList = function (_list) {
    
    for (var n = 0; n < this.m_skeletonData.animations.length; n++ ) {
        ds_list_add(_list, this.m_skeletonData.animations[n].name);
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of skins to the list
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.GetSkinList = function (_list) {

    for (var n = 0; n < this.m_skeletonData.skins.length; n++ ) {
        ds_list_add(_list, this.m_skeletonData.skins[n].name);
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of bones to the list
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.GetBoneList = function (_list)
{
    for (var n = 0; n < this.m_skeletonData.bones.length; n++)
    {
        ds_list_add(_list, this.m_skeletonData.bones[n].name);
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out the list of slots to the list
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.GetSlotList = function (_list)
{
    for (var n = 0; n < this.m_skeletonData.slots.length; n++)
    {
        ds_list_add(_list, this.m_skeletonData.slots[n].name);
    }
};

// #############################################################################################
/// Function:<summary>
///             Dump out slot data to the list
///          </summary>
// #############################################################################################
yySkeletonSprite.prototype.GetSlotData = function (_list) {    

    for (var n = 0; n < this.m_skeletonData.slots.length; n++ ) {	

		var pSlot = this.m_skeletonData.slots[n];

		// Create and populate a ds_map then add it to the supplied list
		var map = ds_map_create();		
        ds_map_add(map, "name", pSlot.name);
        ds_map_add(map, "bone", pSlot.boneData.name);
		ds_map_add(map, "attachment", pSlot.attachmentName ? pSlot.attachmentName : "(none)");
		
		ds_list_add(_list, map);
	}	
};

yySkeletonSprite.prototype.GetAttachmentsForSlot = function(_slotName)
{
	var pSlot = this.m_skeletonData.findSlot(_slotName);
	if(pSlot === null)
	{
		/* Couldn't find the slot. */
		return [];
	}

	var attachmentNames = [];

	for (var skinIndex = 0; skinIndex < this.m_skeletonData.skins.length; skinIndex++)
	{
		var skin = this.m_skeletonData.skins[skinIndex];

		var skinSlotEntries = [];
		skin.getAttachmentsForSlot(pSlot.index, skinSlotEntries);

		for (var i = 0; i < skinSlotEntries.length; ++i)
		{
			attachmentNames.push(skinSlotEntries[i].name);
		}
	}

	/* Strip out duplicate attachment names (skins may re-use attachment names) */

	attachmentNames = attachmentNames.filter(function(value, index, array)
	{
		return array.indexOf(value) === index;
	});

	return attachmentNames;
};
