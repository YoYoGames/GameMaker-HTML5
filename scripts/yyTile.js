
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyTiles.js
// Created:         17/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/02/2011		
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Game Maker "ACTIVE" Room class
///          </summary>
// #############################################################################################
/** @constructor */
function    yyTile()
{
    this.__type = "[Tile]";
    this.x = 0;                     // X coordinate
    this.y = 0;                     // Y coordinate
    this.index = 0;                 // Background index to use as the tileset
    this.xo = 0;                    // X texel index
    this.yo = 0;                    // Y texel index
    this.w = 0;                      // width in texels
    this.h = 0;                     // height in texels
    this.depth = 0.0;               // depth (acts as layer ID)
    this.id = g_DynamicTileID++;	// tile ID
    this.xscale = 1.0;              // tile X scale
    this.yscale = 1.0;              // tile Y scale
    this.blend = 0xffffff;          // colour blend
    this.alpha = 1.0;
    this.visible = true;
    this.clamped = false;          // used internally for fixing GM bleed-over on TPages
}


// #############################################################################################
/// Function:<summary>
///            In the IDE itself (this may be legacy issues now...) it's possible to setup a
///            tile whose drawing range is outwith the actual image. Within GM there is no
///            visible problem since the tiles are held individually and drawn clamped, but once 
///            the images are on a TPage any drawing outside the tile's range will potentially 
///            bleed over onto adjacent entries in the TPage. Here we fix those issues...
///          </summary>
// #############################################################################################
yyTile.prototype.ClampDrawingRange = function () {

	var pImage = g_pBackgroundManager.GetImage(this.index);
	if (pImage != null)
	{
		var pTPE = pImage.TPEntry;

		if (pTPE.tp >= g_Textures.length) return;
		if (!g_Textures[pTPE.tp].complete) return;
		

		if (this.xo < 0)
		{
			this.w += this.xo;
			this.xo = 0;
		}
		if (this.yo < 0)
		{
			this.h += this.yo;
			this.yo = 0;
		}

		if (pTPE != null)
		{
			if ((this.xo + this.w) >= pTPE.w)
			{
				this.w = pTPE.w - this.xo;
			}
			if ((this.yo + this.h) >= pTPE.h)
			{
				this.h = pTPE.h - this.yo;
			}
		}
	}
};


// #############################################################################################
/// Function:<summary>
///             Create a tile from its "loaded" data
///          </summary>
///
/// In:		 <param name="_pTileStorage">Tile data</param>
///
// #############################################################################################
function    CreateTileFromStorage( _pTileStorage )
{
    //{ "x":0,  "y":0,  "index":2,  "xo":320,  "yo":0,  "w":64,  "h":64,  "depth":10,  "id":10000235,  },
    var pTile = new yyTile();

	if( _pTileStorage.x!=undefined ) pTile.x = _pTileStorage.x;
	if ( _pTileStorage.y!=undefined ) pTile.y = _pTileStorage.y;
	if( _pTileStorage.index!=undefined ) pTile.index = _pTileStorage.index;        
	if( _pTileStorage.xo!=undefined ) pTile.xo = _pTileStorage.xo;              
	if( _pTileStorage.yo!=undefined ) pTile.yo = _pTileStorage.yo;
	if( _pTileStorage.w!=undefined ) pTile.w = _pTileStorage.w;
	if( _pTileStorage.h!=undefined )  pTile.h= _pTileStorage.h;
	if( _pTileStorage.depth!=undefined ) pTile.depth = _pTileStorage.depth;
	if( _pTileStorage.id!=undefined ) pTile.id = _pTileStorage.id;
    if (_pTileStorage.scaleX != undefined) pTile.xscale = _pTileStorage.scaleX;
    if (_pTileStorage.scaleY != undefined) pTile.yscale = _pTileStorage.scaleY;
    if (_pTileStorage.colour != undefined) {
    	pTile.blend = (_pTileStorage.colour&0xffffff);
    	pTile.alpha = ((_pTileStorage.colour>>24)&0xff)/255.0;
    }
    pTile.ClampDrawingRange();



	if (g_DynamicTileID < _pTileStorage.id) g_DynamicTileID = _pTileStorage.id + 1;
    return pTile;
}


// #############################################################################################
/// Function:<summary>
///            Draw the tile. 
///          </summary>
///
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyTile.prototype.Draw = function() {
    if (!this.visible) return false;
    var pImage = g_pBackgroundManager.GetImage(this.index);
    if (pImage != null) {
        var pTPE = pImage.TPEntry;

        if ((pTPE.texture instanceof HTMLImageElement)
        && (pTPE.tp >= g_Textures.length)) return;
        if ((g_Textures[pTPE.tp] instanceof HTMLImageElement)
        && (!g_Textures[pTPE.tp].complete)) return;

        var scalex = pTPE.w / pTPE.ow;
        var scaley = pTPE.h / pTPE.oh;
        if (!g_webGL) {        

            graphics.globalAlpha = this.alpha;    
            if (this.blend != 0xffffff) {            
                var cached_image = Graphics_CacheBlock(pTPE, this.blend);                
    	        if (this.xscale <= 0 || this.yscale <= 0) {    	        
    	        	Graphics_PushTransform(this.x, this.y, this.xscale, this.yscale, 0.0);
                    graphics._drawImage(cached_image, (this.xo * scalex), (this.yo * scaley), this.w * scalex, this.h * scaley, 0, 0, this.w, this.h);
                    Graphics_SetTransform();
    	        }
    	        else {
		        	// otherwise, draw faster
    	        	graphics._drawImage(cached_image, (this.xo * scalex), (this.yo * scaley), (this.w * scalex), (this.h * scaley), this.x, this.y, this.w * this.xscale, this.h * this.yscale);
    	        }    	                     
            }
            else {
                var pTexture = -1;
                if (pTPE.texture instanceof HTMLImageElement)
                    pTexture = g_Textures[pTPE.tp];                
                else 
                    pTexture = pTPE.texture;
                if (this.xscale <= 0 || this.yscale <= 0) {
                
                    Graphics_PushTransform(this.x, this.y, this.xscale, this.yscale, 0.0);
                    graphics._drawImage(pTexture, pTPE.x + (this.xo * scalex), pTPE.y + (this.yo * scalex), this.w * scalex, this.h * scaley, 0, 0, this.w, this.h);                    
                    Graphics_SetTransform();
                } 
                else {
                    graphics._drawImage(pTexture, pTPE.x + (this.xo * scalex), pTPE.y + (this.yo * scalex), this.w * scalex, this.h * scaley, this.x, this.y, this.w * this.xscale, this.h * this.yscale);                                                        
                }
            }
        } 
        else {
            var col = this.blend | ((this.alpha * 255) << 24);
            graphics._drawImage(pTPE, pTPE.x + (this.xo * scalex), pTPE.y + (this.yo * scalex), this.w * scalex, this.h * scalex, this.x, this.y, this.w * this.xscale, this.h * this.yscale, col);
        }
    }
};