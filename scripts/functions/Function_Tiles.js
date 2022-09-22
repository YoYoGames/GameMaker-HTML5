
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Tiles.js
// Created:         17/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/05/2011		V1.0        MJD     Stub functions added
// 
// **********************************************************************************************************************



// #############################################################################################
/// Function:<summary>
///             Adds a new tile to the room with the indicated values (see above for their meaning). 
///             The function returns the id of the tile that can be used later on.
///          </summary>
///
/// In:		 <param name="_background">Background index</param>
///			 <param name="left">X texel start</param>
///			 <param name="top">Y texel start</param>
///			 <param name="width">width of tile in texels</param>
///			 <param name="height">height of tile in texels</param>
///			 <param name="x">X coordinate of tile in pixels</param>
///			 <param name="y">Y coordinate of tile in pixels</param>
///			 <param name="depth">Depth value of tile</param>
/// Out:	 <returns>
///				Retuns tile ID.
///			 </returns>
// #############################################################################################
function tile_add(_background, _left, _top, _width, _height, _x, _y, _depth) 
{
	var pTile = new yyTile();
	pTile.x = _x;
	pTile.y = _y;
	pTile.depth = _depth;
	pTile.xo = _left;
	pTile.yo = _top;
	pTile.w = _width;
	pTile.h = _height;
	pTile.index = _background;
	pTile.ClampDrawingRange();

	g_RunRoom.AddTile(pTile);
	return pTile.id;
}

// #############################################################################################
/// Function:<summary>
///             Deletes the tile with the given id.
///          </summary>
///
/// In:		 <param name="id">ID of tile to delete</param>
// #############################################################################################
function tile_delete(_id) 
{
	g_RunRoom.DeleteTile(_id);
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_exists(_id) 
{
    if( g_RunRoom.m_Tiles[_id] == null ) return false;
    return true;
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_get_x(_id)
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.x;
}

// #############################################################################################
/// Function:<summary>
///             Returns the y-position of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id">ID of tile</param>
/// Out:	 <returns>
///				Y texel coordinate
///			 </returns>
// #############################################################################################
function tile_get_y(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.y;
}

// #############################################################################################
/// Function:<summary>
///             Returns the left value of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id">ID of tile</param>
/// Out:	 <returns>
///				X texel coordinate
///			 </returns>
// #############################################################################################
function tile_get_left(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.xo;
}

// #############################################################################################
/// Function:<summary>
///             Returns the top value of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id">ID of tile</param>
/// Out:	 <returns>
///				Y texel coordinate
///			 </returns>
// #############################################################################################
function tile_get_top(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.yo;
}

// #############################################################################################
/// Function:<summary>
///             Returns the width of the tile with the given id.
///          </summary>
// #############################################################################################
function tile_get_width(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.w;
}


// #############################################################################################
/// Function:<summary>
///             Returns the height of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_get_height(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.h;
}

// #############################################################################################
/// Function:<summary>
///             Returns the depth of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				return depth
///			 </returns>
// #############################################################################################
function tile_get_depth(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.depth;
}

// #############################################################################################
/// Function:<summary>
///             Returns whether the tile with the given id is visible.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				returns visibility
///			 </returns>
// #############################################################################################
function tile_get_visible(_id)
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.visible;
}


// #############################################################################################
/// Function:<summary>
///             Returns the xscale of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				retutrn x scale
///			 </returns>
// #############################################################################################
function tile_get_xscale(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.xscale;
}


// #############################################################################################
/// Function:<summary>
///             Returns the yscale of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				return y scale
///			 </returns>
// #############################################################################################
function tile_get_yscale(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if(!pTile) return 0;
    
    return pTile.yscale;
}

// #############################################################################################
/// Function:<summary>
///             Returns the background of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				return background id
///			 </returns>
// #############################################################################################
function tile_get_background(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return 0;
    
    return pTile.index;
}

// #############################################################################################
/// Function:<summary>
///             Returns the blending color of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				return tile tinting colour
///			 </returns>
// #############################################################################################
function tile_get_blend(_id) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return 0;
    
    return pTile.blend;
}

// #############################################################################################
/// Function:<summary>
///              Returns the alpha value of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
/// Out:	 <returns>
///				return tile alpha
///			 </returns>
// #############################################################################################
function tile_get_alpha(_id)
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return 0;
    
    return pTile.alpha;
}


// #############################################################################################
/// Function:<summary>
///             Sets the position of the tile with the given id.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_x"></param>
///			 <param name="_y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_position(_id,_x,_y) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if (pTile) {
        pTile.x = _x;
        pTile.y = _y;
    }   
}

// #############################################################################################
/// Function:<summary>
///             Sets the region of the tile with the given id in its background.
///				UVs WILL BE CLAMPED TO TILE SPACE.
///          </summary>
///
/// In:		 <param name="_id">ID of tile to change</param>
///			 <param name="_left">new left edge texel</param>
///			 <param name="_top">new top edge texel</param>
///			 <param name="_width">new width of tile</param>
///			 <param name="_height"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_region(_id,_left,_top,_width,_height) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if (pTile) {
        pTile.xo = _left;
        pTile.yo = _top;
        pTile.w = _width;
        pTile.h = _height;
        pTile.ClampDrawingRange();
    }
}

// #############################################################################################
/// Function:<summary>
///             Sets the background for the tile with the given id.
///				UVs WILL BE CLAMPED TO TILE SPACE.
///          </summary>
///
/// In:		 <param name="_id"></param>
///			 <param name="_background"></param>
/// Out:	 <returns>
///				set background
///			 </returns>
// #############################################################################################
function tile_set_background(_id,_background) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if (pTile) {
        pTile.index = _background;
        pTile.ClampDrawingRange();
    }
}

// #############################################################################################
/// Function:<summary>
///             Sets whether the tile with the given id is visible.
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="visible"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_visible(_id,_visible) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if (pTile) {
        pTile.visible = _visible;
    }
}


// #############################################################################################
/// Function:<summary>
///             Sets the depth of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="depth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_depth(_id,_depth) 
{
	var pTile = g_RunRoom.m_Tiles[_id];
	if (pTile)
	{
		g_RunRoom.m_PlayfieldManager.DeleteTile(pTile);
		pTile.depth = _depth;
		g_RunRoom.m_PlayfieldManager.Add(pTile);
	}
}


// #############################################################################################
/// Function:<summary>
///             Sets the scaling of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="xscale"></param>
///			 <param name="yscale"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_scale(_id,_xscale,_yscale) 
{
	var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return;
    pTile.xscale = _xscale;
    pTile.yscale = _yscale;
}

// #############################################################################################
/// Function:<summary>
///             Sets the blending color of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="color"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_blend(_id,_colour) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return;
    pTile.blend = ConvertGMColour(_colour);
}

// #############################################################################################
/// Function:<summary>
///             Sets the alpha value of the tile with the given id.
///          </summary>
///
/// In:		 <param name="id"></param>
///			 <param name="alpha"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_set_alpha(_id,_alpha) 
{
    var pTile = g_RunRoom.m_Tiles[_id];
    if( !pTile ) return 0;
    pTile.alpha = _alpha;
}



// #############################################################################################
/// Function:<summary>
///             Hides all tiles at the indicated depth layer.
///          </summary>
///
/// In:		 <param name="depth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_hide(_depth) 
{
	g_RunRoom.m_PlayfieldManager.SetPlayfieldVisibility(_depth,false);
}

// #############################################################################################
/// Function:<summary>
///             Shows all tiles at the indicated depth layer.
///          </summary>
///
/// In:		 <param name="depth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_show(_depth) {
	g_RunRoom.m_PlayfieldManager.SetPlayfieldVisibility(_depth, true);
}

// #############################################################################################
/// Function:<summary>
///             Deletes all tiles at the indicated depth layer.
///          </summary>
///
/// In:		 <param name="depth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_delete(_depth) {
	g_RunRoom.DeleteTileLayer(_depth);
}

// #############################################################################################
/// Function:<summary>
///             Shifts all tiles at the indicated depth layer over the vector x,y. Can be used to create scrolling layers of tiles.
///          </summary>
///
/// In:		 <param name="depth"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_shift(_depth,_x,_y) 
{
	var pPlayfield = g_RunRoom.m_PlayfieldManager.Get(_depth);
	if( !pPlayfield ) return;
	
	var pool = pPlayfield.GetPool();

	// Delete all tile that exist in this layer.	
	for (var tile = 0; tile < pool.length; tile++)
	{
		var pTile = pool[tile];
		if (pTile)
		{
			pTile.x += _x;
			pTile.y += _y;
		}
	}
}


// #############################################################################################
/// Function:<summary>
///             Returns the id of the tile with the given depth at position (x,y). When no tile 
///             exists at the position -1 is returned. When multiple tiles with the given 
///             depth exist at the position the first one is returned.
///          </summary>
///
/// In:		 <param name="depth"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_find(_depth,_x,_y) 
{        
    for (var index in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(index)) continue;
    
        var pTile = g_RunRoom.m_Tiles[index];
        if (pTile != null) {
            if((_depth == pTile.depth) && (_x >= pTile.x) && (_x < (pTile.x + (pTile.w*pTile.xscale))) && (_y >= pTile.y) && (_y < (pTile.y + (pTile.h*pTile.yscale))) )
		    {
		    	return pTile.id;
		    }
		}
	}
	return -1;
}


// #############################################################################################
/// Function:<summary>
///             Deletes the tile with the given depth at position (x,y). When multiple 
///             tiles with the given depth exist at the position they are all deleted.
///          </summary>
///
/// In:		 <param name="depth"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_delete_at(_depth,_x,_y) 
{
	var tiles = [];
	for (var index in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(index)) continue;
	    
	    // Find the tile.
		var pTile = g_RunRoom.m_Tiles[index];		
		if (pTile) {
		    if ((_depth == pTile.depth) && (_x >= pTile.x) && (_x < (pTile.x + (pTile.w * pTile.xscale))) && (_y >= pTile.y) && (_y < (pTile.y + (pTile.h * pTile.yscale)))) {
		        // IF found, remember it.
		        tiles[tiles.length] = index;
		    }
		}
	}


	// Now nuke them all.
	for (var i = 0; i < tiles.length; i++)
	{
		g_RunRoom.DeleteTile(tiles[i]);
	}
}

// #############################################################################################
/// Function:<summary>
///             Changes the depth of all tiles at the indicated depth to the new depth. With this 
///             function you can move whole tile layers to a new depth.
///          </summary>
///
/// In:		 <param name="_depth"></param>
///			 <param name="_newdepth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function tile_layer_depth(_depth,_newdepth) {

	// Loop through all tiles and get the ones at a specific depth
	var tiles = [];
	for (var index in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(index)) continue;
	
		var pTile = g_RunRoom.m_Tiles[index];
		if (pTile) {
		    if (_depth == pTile.depth) {
		        tiles[tiles.length] = pTile;
		    }
		}
	}


	// Now move them all to a new layer
	for (var i = 0; i < tiles.length; i++)
	{
		var pTile = tiles[i];

		g_RunRoom.m_PlayfieldManager.Delete(pTile);
		pTile.depth = _newdepth;
		g_RunRoom.m_PlayfieldManager.Add(pTile);
	} 
}

// #############################################################################################
/// Function:<summary>
///          	Return the total number of tiles in the current room
///          </summary>
///
/// Out:	<returns>
///				the number of tiles
///			</returns>
// #############################################################################################
function tile_get_count()
{
    // loop through all tiles and get the ACTUAL number of tiles, ignoring nulls and undefined slots
    var count = 0;
    for (var index in g_RunRoom.m_Tiles)
    {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(index)) continue;

        var pTile = g_RunRoom.m_Tiles[index];
        if (pTile) count++;
    }
    return count;
}


// #############################################################################################
/// Function:<summary>
///          	Return tile ID at tile index "_index"
///          </summary>
///
/// Out:	<returns>
///				the number of tiles
///			</returns>
// #############################################################################################
function tile_get_id(_index) {
    // Loop through all tiles and get the ones at a specific depth
    if (_index < 0 || _index >= g_RunRoom.m_NumTiles) return -1;
    
    for (var index in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(index)) continue;
    
        var pTile = g_RunRoom.m_Tiles[index];
        if (pTile) {
            if (_index == 0) return pTile.id;
            _index--;
        }
    }
    return -1;
}

// #############################################################################################
/// Function:<summary>
///          	Return a list if ALL tile IDs in the room
///          </summary>
///
/// Out:	<returns>
///				Array holding the tile ids
///			</returns>
// #############################################################################################
function tile_get_ids() 
{
    var tiles = [];
    var index=0;
    for (var tile in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(tile)) continue;

        var pTile = g_RunRoom.m_Tiles[tile];
        if (pTile) {
            tiles[index] = pTile.id;
            index++;
        }
    }
    return tiles;
}

// #############################################################################################
/// Function:<summary>
///          	Return a list if ALL tile IDs in the room
///          </summary>
///
/// Out:	<returns>
///				Array holding the tile ids
///			</returns>
// #############################################################################################
function tile_get_ids_at_depth(_depth) {
    var tiles = [];
    var index = 0;
    for (var tile in g_RunRoom.m_Tiles) {
        if (!g_RunRoom.m_Tiles.hasOwnProperty(tile)) continue;

        var pTile = g_RunRoom.m_Tiles[tile];
        if (pTile && pTile.depth == _depth) {
            tiles[index] = pTile.id;
            index++;
        }
    }
    return tiles;
}
