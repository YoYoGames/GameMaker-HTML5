
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyPlayfield.js
// Created:         17/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Playfields hold lists of tiles, batched by depth
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/05/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Create a new
///          </summary>
// #############################################################################################
/**@constructor*/
function    yyPlayfield( _depth )
{   
    this.depth = _depth;
    this.visible = true; 
    this.Tiles = new yyList();
}

// #############################################################################################
/// Function:<summary>
///             Create a tile from its "loaded" data
///          </summary>
///
/// In:		 <param name="_pTileStorage">Tile data</param>
///
// #############################################################################################
yyPlayfield.prototype.Add = function (_pTile) {
	this.Tiles.Add(_pTile);
};


// #############################################################################################
/// Function:<summary>
///             Delete a tile from the 
///          </summary>
///
/// In:		 <param name="_pTileStorage">Tile data</param>
///
// #############################################################################################
yyPlayfield.prototype.Delete = function (_pTile) {
	this.Tiles.DeleteItem(_pTile);
};

// #############################################################################################
/// Function:<summary>
///             Draw all the tiles in this playfield
///          </summary>
// #############################################################################################
yyPlayfield.prototype.Draw = function (_rect) {

    if (!this.visible) {
        return;
    } 

    var pool = this.Tiles.pool;
	for (var index = 0; index < pool.length; index++)
	{	    
		var pTile = pool[index];
		if (pTile != null)
		{
		    // Take into account the tile's scaling		    	    		    
			var xB = pTile.x + (pTile.xscale*pTile.w),
			    yR = pTile.y + (pTile.yscale*pTile.h);
			
			var x1 = (pTile.x < xB) ? pTile.x : xB,
			    x2 = (pTile.x > xB) ? pTile.x : xB,
			    y1 = (pTile.y < yR) ? pTile.y : yR,
			    y2 = (pTile.y > yR) ? pTile.y : yR;
		    
		    if ((x1 <= _rect.right) && (y1 <= _rect.bottom) && 
		        (x2 >= _rect.left) && (y2 >= _rect.top))
		    {
		        pTile.Draw();
            }
        }
	}
};


// #############################################################################################
/// Function:<summary>
///             Get the actual POOL of tiles
///          </summary>
///
/// Out:	 <returns>
///				the pool.
///			 </returns>
// #############################################################################################
yyPlayfield.prototype.GetPool = function () {
	return this.Tiles.pool;
};







// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
/// Function:<summary>
///             Create a playfield manager
///          </summary>
// ##########################################################################################################################################################################################
// ##########################################################################################################################################################################################
/**@constructor*/
function    yyPlayfieldManager()
{   
    this.m_Playfields = new yyOList();
    this.m_NextIndex = -1;
}


// #############################################################################################
/// Property: <summary>
///           	Find the playfield with the correct depth.
///           </summary>
///
/// In:		 <param name="_depth">Playfield depth</param>
///
// #############################################################################################
yyPlayfieldManager.prototype.Get = function (_depth) {
	var pPlayfield;

	// Find playfield at tyile depth...
	for (var index = 0; index < this.m_Playfields.count; index++)
	{
		pPlayfield = this.m_Playfields.Get(index);
		if (pPlayfield.depth == _depth) return pPlayfield;
	}
	return null;
};

// #############################################################################################
/// Property: <summary>
///           	Delete the playfield with the depth provided.
///           </summary>
///
/// In:		 <param name="_depth">Playfield depth</param>
///
// #############################################################################################
yyPlayfieldManager.prototype.Delete = function (_depth) {
	var pPlayfield = this.Get(_depth);
	if (pPlayfield)
	{
		this.m_Playfields.Delete(pPlayfield);
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
yyPlayfieldManager.prototype.Add = function (_pTile) {
	var pPlayfield;

	// Find playfield at tyile depth...
	pPlayfield = this.Get(_pTile.depth);
	if(!pPlayfield)
	{
	    pPlayfield = new yyPlayfield(_pTile.depth);
	    this.m_Playfields.Add(pPlayfield);
	}
	pPlayfield.Add(_pTile);
};

// #############################################################################################
/// Function:<summary>
///             Create a tile from its "loaded" data
///          </summary>
///
/// In:		 <param name="_pTileStorage">Tile data</param>
///
// #############################################################################################
yyPlayfieldManager.prototype.DeleteTile = function (_pTile) {
	// Find playfield at tyile depth...
	var pPlayfield = this.Get(_pTile.depth);
	if (pPlayfield)
	{
		pPlayfield.Delete(_pTile);
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
yyPlayfieldManager.prototype.GetFirst = function () {
	this.m_NextIndex = this.m_Playfields.length-1;
	return this.m_Playfields.Get(this.m_NextIndex);
};

// #############################################################################################
/// Function:<summary>
///             Create a tile from its "loaded" data
///          </summary>
///
/// In:		 <param name="_pTileStorage">Tile data</param>
///
// #############################################################################################
yyPlayfieldManager.prototype.GetNext = function () {
	this.m_NextIndex--;
	if( this.m_NextIndex<0 ) return null;
	return this.m_Playfields.Get(this.m_NextIndex);
};


// #############################################################################################
/// Property: <summary>
///           	Hide/Show a playfield
///           </summary>
// #############################################################################################
yyPlayfieldManager.prototype.SetPlayfieldVisibility = function (_depth, _vis) {
	var pPlayfield = this.Get(_depth);
	if (pPlayfield) pPlayfield.visible = (_vis >= 0.5);
};
