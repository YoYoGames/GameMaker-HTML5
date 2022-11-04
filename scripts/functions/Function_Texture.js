
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Texture.js
// Created:         17/05/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 17/05/2011		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_inst"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function draw_self( _inst )
{
	var index;

	index = _inst.sprite_index;

    g_skeletonDrawInstance = _inst;
    {
    	var spr = g_pSpriteManager.Get(index);
    	if( spr != null ){
    	    //spr.Draw( Math.floor(_inst.image_index ),
    	    spr.Draw(_inst.image_index,
				_inst.x,_inst.y,_inst.image_xscale, _inst.image_yscale,
				_inst.image_angle, _inst.image_blend, _inst.image_alpha);
    	}
    }
    g_skeletonDrawInstance = null;
}

// #############################################################################################
/// Function:<summary>
///             Draw a sprite with colour, rotation and alpha...
///          </summary>
// #############################################################################################
function    draw_sprite_ext( _pInst, _sprite, _sub_index, _x,_y, _xscale, _yscale, _rot, _col, _alpha )
{
	_sub_index = yyGetInt32(_sub_index);
	_alpha = yyGetReal(_alpha);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
    var pSpr = g_pSpriteManager.Get(_sprite);
    if( pSpr!=null ){
        _alpha = min(1.0, _alpha);
        pSpr.Draw( _sub_index, yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), yyGetReal(_rot), ConvertGMColour(yyGetInt32(_col)), _alpha );
    }
}

// #############################################################################################
/// Function:<summary>
///             Draw a sprite with colour, rotation and alpha...
///          </summary>
// #############################################################################################
function    draw_sprite( _pInst, _sprite, _sub_index, _x,_y )
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
    var pSpr = g_pSpriteManager.Get(_sprite);
    if( pSpr!=null ){
    	pSpr.DrawSimple(_sub_index, yyGetReal(_x), yyGetReal(_y), g_GlobalAlpha);
    }
}

// #############################################################################################
/// Function:<summary>
///             Draw a sprite with colour, rotation and alpha...
///          </summary>
// #############################################################################################
function draw_sprite_pos(_pInst, _sprite, _sub_index, _x1, _y1, _x2,_y2, _x3,_y3, _x4,_y4, _alpha) {

	_sub_index = yyGetInt32(_sub_index);
	_alpha = yyGetReal(_alpha);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
        _alpha = min(1.0, _alpha);
        pSpr.Sprite_DrawSimplePos(_sub_index, yyGetReal(_x1), yyGetReal(_y1), yyGetReal(_x2), yyGetReal(_y2), yyGetReal(_x3), yyGetReal(_y3), yyGetReal(_x4), yyGetReal(_y4), _alpha);
	}
}



// #############################################################################################
/// Function:<summary>
///             Draw a sprite "stretched" on X and Y
///          </summary>
///
/// In:		 <param name="_sprite">Sprite to draw</param>
///			 <param name="_sub_index">sub index of sprite</param>
///			 <param name="_x">X location</param>
///			 <param name="_y">Y location</param>
///			 <param name="_w">X scale</param>
///			 <param name="_h">Y scale</param>
///				
// #############################################################################################
function draw_sprite_stretched(_pInst, _sprite, _sub_index, _x, _y, _w,_h) 
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~ ~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	
		
	    if ((pSpr.nineslicedata != null) && (pSpr.nineslicedata.enabled == true))
	    {
	        pSpr.nineslicedata.Draw(yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), 0, 0xffffff, g_GlobalAlpha, _sub_index, pSpr, true);
	    }
	    else
	    {
	        Graphics_DrawStretchedExt(pSpr.ppTPE[_sub_index], yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), 0xffffff, g_GlobalAlpha);
	    }
	}

}



// #############################################################################################
/// Function:<summary>
///             Draw a sprite "stretched" on X and Y
///          </summary>
///
/// In:		 <param name="_sprite">Sprite to draw</param>
///			 <param name="_sub_index">sub index of sprite</param>
///			 <param name="_x">X location</param>
///			 <param name="_y">Y location</param>
///			 <param name="_w">X scale</param>
///			 <param name="_h">Y scale</param>
///			 <param name="_colour">colour to tint with</param>
///			 <param name="_alpha">alpha to draw with</param>
///				
// #############################################################################################
function    draw_sprite_stretched_ext( _pInst, _sprite, _sub_index, _x,_y, _w, _h, _colour, _alpha )
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~ ~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	
		
	    if ((pSpr.nineslicedata != null) && (pSpr.nineslicedata.enabled == true))
	    {
	        pSpr.nineslicedata.Draw(yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), 0, ConvertGMColour(yyGetInt32(_colour)), yyGetReal(_alpha), _sub_index, pSpr, true);
	    }
	    else
	    {
	        Graphics_DrawStretchedExt(pSpr.ppTPE[_sub_index], yyGetReal(_x), yyGetReal(_y), yyGetReal(_w), yyGetReal(_h), ConvertGMColour(yyGetInt32(_colour)), yyGetReal(_alpha));
	    }
	}
    //draw_sprite_ext(_sprite,_sub_index,_x,_y,_xscale,_yscale,0,_colour, _alpha);
}

// #############################################################################################
/// Constructor: <summary>
///              	Draws the indicated part of subimage subimg (-1 = current) of the sprite with 
///					the top-left corner of the part at position (x,y).
///              </summary>
///
/// In:		<param name="_sprite"></param>
///			<param name="_sub_image"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///
// #############################################################################################
function draw_sprite_part(_pInst, _sprite, _sub_index, _left, _top, _width, _height, _x, _y) 
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~ ~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;


	    Graphics_DrawPart(pSpr.ppTPE[_sub_index], yyGetReal(_left), yyGetReal(_top), yyGetReal(_width), yyGetReal(_height), yyGetReal(_x), yyGetReal(_y), 1, 1, 0xffffff, g_GlobalAlpha);
	}
}



// #############################################################################################
/// Constructor: <summary>
///              	Draws the indicated part of subimage subimg (-1 = current) of the sprite with 
///					the top-left corner of the part at position (x,y) but now with scale factors 
///					and a color and transparency setting.
///              </summary>
///
/// In:		<param name="_sprite"></param>
///			<param name="_subimg"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
///
// #############################################################################################
function draw_sprite_part_ext(_pInst, _sprite, _sub_index, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _color, _alpha)
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~ ~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	


        _color = ConvertGMColour(yyGetInt32(_color));
        Graphics_DrawPart(pSpr.ppTPE[_sub_index], yyGetReal(_left), yyGetReal(_top), yyGetReal(_width), yyGetReal(_height), yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), _color, yyGetReal(_alpha));
        //Graphics_DrawGeneral(pSpr.ppTPE[_sub_index], _left, _top, _width, _height, _x, _y, _xscale, _yscale, 0, _color, _color, _color, _color, _alpha);
	}
}


// #############################################################################################
/// Function:<summary>
///          	Draws the sprite tiled so that it fills the entire room. (x,y) is the place where 
///				one of the sprites is drawn.
///          </summary>
///
/// In:		<param name="_sprite"></param>
///			<param name="_sub_image"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_sprite_tiled(_pInst, _sprite, _sub_index, _x, _y) {

	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
    
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	
    
        Graphics_TextureDrawTiled( pSpr.ppTPE[_sub_index], yyGetReal(_x), yyGetReal(_y), 1,1, true, true, 0xffffff, g_GlobalAlpha);
    }
}



// #############################################################################################
/// Function:<summary>
///          	Draws the sprite tiled so that it fills the entire room but now with scale factors 
///				and a color and transparency setting.
///          </summary>
///
/// In:		<param name="_sprite"></param>
///			<param name="_subimg"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_sprite_tiled_ext(_pInst, _sprite,_sub_index,_x,_y,_xscale,_yscale,_color,_alpha) 
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
    
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	
    
        _color = ConvertGMColour(yyGetInt32(_color));
        Graphics_TextureDrawTiled( pSpr.ppTPE[_sub_index], yyGetReal(_x), yyGetReal(_y), yyGetReal(_xscale), yyGetReal(_yscale), true, true, _color, _alpha);
    }
}


// #############################################################################################
/// Function:<summary>
///          	The most general drawing function. It draws the indicated part of subimage subimg 
///				(-1 = current) of the sprite with the top-left corner of the part at position (x,y) 
///				but now with scale factors, a rotation angle, a color for each of the four vertices 
///				(top-left, top-right, bottom-right, and bottom-left), and an alpha transparency value. 
///				Note that rotation takes place around the top-left corner of the part.
///          </summary>
///
/// In:		<param name="_sprite"></param>
///			<param name="_subimg"></param>
///			<param name="_left"></param>
///			<param name="_top"></param>
///			<param name="_width"></param>
///			<param name="_height"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
///			<param name="_rot"></param>
///			<param name="_c1"></param>
///			<param name="_c2"></param>
///			<param name="_c3"></param>
///			<param name="_c4"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function draw_sprite_general(_pInst, _sprite, _sub_index, _left, _top, _width, _height, _x, _y, _xscale, _yscale, _rot, _c1, _c2, _c3, _c4, _alpha) 
{
	_sub_index = yyGetInt32(_sub_index);
    if( _sub_index<0  ) _sub_index = ~~_pInst.image_index;
	var pSpr = g_pSpriteManager.Get(_sprite);
	if (pSpr != null)
	{
	    if (g_transRoomExtentsDirty)
	    {
		    UpdateTransRoomExtents();
	    }
    	if (pSpr.numb <= 0) return;
	    _sub_index = (~~_sub_index) % pSpr.numb;
	    if (_sub_index < 0) _sub_index = _sub_index + pSpr.numb;	


        _c1 = ConvertGMColour(yyGetInt32(_c1));
        _c2 = ConvertGMColour(yyGetInt32(_c2));
        _c3 = ConvertGMColour(yyGetInt32(_c3));
        _c4 = ConvertGMColour(yyGetInt32(_c4));
        Graphics_DrawGeneral(pSpr.ppTPE[_sub_index], yyGetReal(_left),yyGetReal(_top),yyGetReal(_width),yyGetReal(_height),    yyGetReal(_x),yyGetReal(_y),yyGetReal(_xscale),yyGetReal(_yscale),  yyGetReal(_rot) * Math.PI / 180.0,  _c1,_c2,_c3,_c4,  yyGetReal(_alpha));
	}
}

