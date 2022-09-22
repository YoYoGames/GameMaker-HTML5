
// complicated by the fact that images may have been scaled before being placed on the TPage
// then they are cropped ...
// so the scale can be calculated by ow/w or oh/h
// the actual width and height come from the CropWidth and CropHeight
/** @constructor */
function    yyTPageEntry()
{
    this.x = 0;				// x position (in texels) on the texture
    this.y = 0;				// y position (in texels) on the texture
    this.w = 0;				// width before cropping and after scaling (in texels) of the image
    this.h = 0;				// height before cropping and after scaling (in texels) of the image
    this.XOffset = 0;		// X offset (in texels) into the image based on the original size.
    this.YOffset = 0;			// Y offset (in texels) into the image based on the original size.
    this.CropWidth = 0;		// width (in texels) of the image
    this.CropHeight = 0;		// height (in texels) of the image
    this.ow = 0;				// original width (texels)
    this.oh = 0;				// original height (texels)
    this.tp = 0; 			// texture page index
    this.copy = TPE_Copy;
}
function    yyTPageEntryUserCopy()
{
}
// Copy a texture page entry.
/** @constructor */
function TPE_Copy(_pTPE) 
{
	this.x = _pTPE.x;
	this.y = _pTPE.y;
	this.w = _pTPE.w;
	this.h = _pTPE.h;
	this.XOffset = _pTPE.XOffset;
	this.YOffset = _pTPE.YOffset;
	this.CropWidth = _pTPE.CropWidth;
	this.CropHeight = _pTPE.CropHeight;
	this.ow = _pTPE.ow;
	this.oh = _pTPE.oh;
	this.tp = _pTPE.tp;
}


/** @constructor */
function    YYSprite()
{
    this.pName = "";
    this.width = 0;
    this.height = 0;
    this.bboxLeft = 0;
    this.bboxRight = 0;
    this.bboxBottom = 0;
    this.bboxTop = 0;
    this.transparent = 0;
    this.smooth = 0;
    this.preload = 0;
    this.bboxMode = 0;
    this.colCheck = 0;
    this.xOrigin = 0;
    this.yOrigin = 0;
    this.TPageEntrys = [];          // followed by count * (YYTPageEntry*)
}


/** @constructor */
function YYObjectStorage()
{
    this.pName = "<object>";
    this.spriteIndex = 0;
	this.visible = true;
    this.solid = true;
    this.depth = 0;
    this.persistent = false;
    this.parent = -1;
    this.spritemask = false;
}


/** @constructor */
function YYInstancesStorage()
{
    this.x = 0;
    this.y = 0;
    this.index = 0;
    this.id = 0;
    this.pCode = null;   
}


/** @constructor */
function YYTileStorage()
{
    this.x = 0;
    this.y = 0;
    this.index = 0;
    this.xo = 0;
    this.yo = 0;
    this.w = 0;
    this.h = 0;
    this.depth = 0;
    this.id = 0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.colour = -1;
}


/** @constructor */
function YYViewStorage()
{
    this.visible = false;
    this.xview = 0;
    this.yview = 0;
    this.wview = 0;
    this.hview = 0;
    this.xport = 0;
    this.yport = 0;
    this.wport = 0;
    this.hport = 0;
    this.hborder = 0;
    this.vborder = 0;
    this.hspeed = 0;
    this.vspeed = 0;
    this.index = 0;
}


/** @constructor */
function YYBackgroundStorage()
{
    this.visible = false;
    this.foreground = 0;
    this.index = 0;
    this.x = 0;
    this.y = 0;
    this.hTiled = 0;
    this.vTiled = 0;
    this.hSpeed = 0;
    this.vSpeed = 0;
	this.stretch = 0;
}

/** @constructor */
function yyRoomStorage()
{
    this.pName = "<room>";
    this.pCaption = "Game Maker Room";
    this.width = 640;
    this.height = 480;
    this.speed = 30;
    this.persistent = false;
    this.colour = 0;
    this.showColour = false;
    this.pCode=null;
    this.enableViews = false;
    
    this.pInstances = [];            // Array of YYRoomInstances
    this.pBackgrounds = [];          // Array of YYRoomBackgrounds
    this.pViews = [];                // Array of YYRoomViews
    this.pTiles = [];                // Array of YYRoomTiles
}



/** @constructor */
function    yyGameFile()
{
    this.GMObjects = [];        // YYObjectStorage
    this.GMRooms = [];
    this.Textures = [];         // texture pages
    this.Sprites = [];          // Sprites!
}


