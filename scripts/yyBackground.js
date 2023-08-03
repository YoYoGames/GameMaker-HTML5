
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyBackground.js
// Created:         24/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 24/02/2011		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Initialise a background image from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function    yyBackgroundImage()
{
    this.__type = "[Background]";
    this.pName = "";
	this.transparent = false;
	this.smooth = false;
	this.preload = false;
	this.TPEntry = null;
	this.tilewidth=0;
	this.tileheight=0;
	this.tilehsep=0;
	this.tilevsep=0;
	this.tilecolumns=0;
	
	this.frames=0;
	this.tilecount=0;
	this.spriteindex=0;
	this.framelength=0;
	this.framedata=[];
	
	
}

// #############################################################################################
/// Function:<summary>
///             Initialise a background image from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function CreateBackgroundImageFromStorage(_pStorage) {
	var pImage = new yyBackgroundImage();
	pImage.pName = _pStorage.pName;
	if (_pStorage.transparent != undefined) pImage.transparent = _pStorage.transparent;
	if (_pStorage.smooth != undefined) pImage.smooth = _pStorage.smooth;
	if (_pStorage.preload != undefined) pImage.preload = _pStorage.preload;
	pImage.TPEntry = Graphics_GetTextureEntry(_pStorage.TPEntryIndex);
	
	if (_pStorage.tilewidth != undefined) pImage.tilewidth = _pStorage.tilewidth;
    if (_pStorage.tileheight != undefined) pImage.tileheight = _pStorage.tileheight;
    if (_pStorage.tilehsep != undefined) pImage.tilehsep = _pStorage.tilehsep;
    if (_pStorage.tilevsep != undefined) pImage.tilevsep = _pStorage.tilevsep;
    if (_pStorage.tilecolumns != undefined) pImage.tilecolumns = _pStorage.tilecolumns;
	
	
	if (_pStorage.frames != undefined) pImage.frames = _pStorage.frames;
	if (_pStorage.tilecount != undefined) pImage.tilecount = _pStorage.tilecount;
	if (_pStorage.spriteindex != undefined) pImage.spriteindex = _pStorage.spriteindex;
	if (_pStorage.framelength != undefined) pImage.framelength = _pStorage.framelength;
	
	for (var i = 0; i < _pStorage.frames * _pStorage.tilecount; i++)
	{
	    if (_pStorage.framedata[i] != undefined) pImage.framedata[i] = _pStorage.framedata[i];
	}
	
	
	return pImage;
}

yyBackgroundImage.prototype.GetAnimatedTileIndex = function (_sourceIndex,_frame) {
	return this.framedata[(_sourceIndex * this.frames) + _frame]
};
// #############################################################################################
/// Function:<summary>
///             Initialise a background from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function    yyBackground( _pStorage ) 
{
	this.Clear();

    if( _pStorage.visible != undefined) this.visible = _pStorage.visible;
    if( _pStorage.foreground!= undefined ) this.foreground = _pStorage.foreground;
    if( _pStorage.index != undefined) this.index = _pStorage.index;
    if( _pStorage.x != undefined) this.x = _pStorage.x;
    if( _pStorage.y != undefined) this.y = _pStorage.y;
    if( _pStorage.htiled != undefined) this.hTiled = _pStorage.htiled;
    if( _pStorage.vtiled != undefined) this.vTiled = _pStorage.vtiled;
    if( _pStorage.hspeed != undefined) this.hSpeed = _pStorage.hspeed;
    if( _pStorage.vspeed != undefined) this.vSpeed = _pStorage.vspeed;
    if (_pStorage.stretch != undefined) this.stretch = _pStorage.stretch;
    if (_pStorage.alpha != undefined) this.alpha = _pStorage.alpha;
    if (_pStorage.blend != undefined) this.blend = _pStorage.blend;
     
    if (_pStorage.tilewidth != undefined) this.tilewidth = _pStorage.tilewidth;
    if (_pStorage.tileheight != undefined) this.tileheight = _pStorage.tileheight;
    if (_pStorage.tilehsep != undefined) this.tilehsep = _pStorage.tilehsep;
    if (_pStorage.tilevsep != undefined) this.tilevsep = _pStorage.tilevsep;
    if (_pStorage.tilecolumns != undefined) this.tilecolumns = _pStorage.tilecolumns;
    
    if (_pStorage.frames!= undefined) this.frames = _pStorage.frames;
    if (_pStorage.tilecount!= undefined) this.tilecount = _pStorage.tilecount;
	if (_pStorage.spriteindex!= undefined) this.spriteindex = _pStorage.spriteindex;
    if (_pStorage.framelength_micros!= undefined) this.framelength_micros = _pStorage.framelength_micros;
    if (_pStorage.pFrameData!= undefined) this.pFrameData = _pStorage.pFrameData;
	

}

// #############################################################################################
/// Function:<summary>
///          	Reset/Clear the background
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
yyBackground.prototype.Clear = function () {
	this.visible = false;
	this.foreground = false;
	this.index = -1;
	this.x = 0;
	this.y = 0;
	this.hTiled = true;
	this.vTiled = true;
	this.hSpeed = 0;
	this.vSpeed = 0;
	this.xscale = 1;
	this.yscale = 1;
	this.stretch = false;
	this.alpha = 1.0;
	this.blend = 0xffffff;
};


// #############################################################################################
/// Function:<summary>
///             Create a new background manager
///          </summary>
// #############################################################################################
/** @constructor */
function yyBackgroundManager() {
	this.images = [];			// raw images. As many as needed.
	this.background = [];		// backgrounds attached to CURRENT room. (0..7)
}





// #############################################################################################
/// Function:<summary>
///             Get a background from the manager
///          </summary>
///
/// In:		 <param name="_indexe">background to retrieve</param>
// #############################################################################################
yyBackgroundManager.prototype.GetImage = function (_index) {
	return this.images[_index];
};

// #############################################################################################
/// Function:<summary>
///             Get a background from the manager
///          </summary>
///
/// In:		 <param name="_indexe">background to retrieve</param>
// #############################################################################################
yyBackgroundManager.prototype.Get = function (_index) {
	return this.background[_index];
};

// #############################################################################################
/// Function:<summary>
///             Delete a background IMAGE
///          </summary>
///
/// In:		 <param name="_index">Index of image to delete</param>
// #############################################################################################
yyBackgroundManager.prototype.DeleteImage = function (_index) 
{
	// only delete it IF it has a value (saves adding entries to the array if theres nothing there).
	if (this.images[_index] != undefined){
		this.images[_index] = undefined;
	}
};

// #############################################################################################
/// Function:<summary>
///             Add a new background image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">background image Storage</param>
// #############################################################################################
yyBackgroundManager.prototype.Clear = function () {
	this.background = [];
};

// #############################################################################################
/// Function:<summary>
///             Add a new background image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">background image Storage</param>
// #############################################################################################
yyBackgroundManager.prototype.AddImage = function (_pStorage) {
	var pBack = null;
	if (_pStorage != null)
	{
		pBack = CreateBackgroundImageFromStorage(_pStorage);
	}
	return this.AddBackgroundImage(pBack);
};


// #############################################################################################
/// Function:<summary>
///             Add a new background image into the pool
///          </summary>
///
/// In:		 <param name="_pBackground">background image Storage</param>
// #############################################################################################
yyBackgroundManager.prototype.AddBackgroundImage = function (_pBackground) 
{
	var i = this.images.length;
	this.images[i] = _pBackground;
	return i;
};

// #############################################################################################
/// Function:<summary>
///             Add a new background image into the pool
///          </summary>
///
/// In:		 <param name="_index">Index to "set"</param>
///    		 <param name="_pBackground">background image Storage</param>
// #############################################################################################
yyBackgroundManager.prototype.SetBackgroundImage = function (_index, _pBackground) 
{
	this.images[_index] = _pBackground;
};

// #############################################################################################
/// Function:<summary>
///             Add a new background image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">background image Storage</param>
// #############################################################################################
yyBackgroundManager.prototype.Add = function (_pStorage) {
	var pBack = null;
	if (_pStorage != null)
	{
		pBack = new yyBackground(_pStorage);
	}
	this.background[this.background.length] = pBack;
};





