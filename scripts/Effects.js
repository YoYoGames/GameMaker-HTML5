
// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			Effects.js
// Created:			14/07/2011
// Author:			Mike
// Project:
// Description:		Deals with built in particle effects.
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 14/07/2011		V1.0		MJD		Initial version
//
// **********************************************************************************************************************



var types_created = false,                 // whether the types have been created
	ps_below = -1,                         // the particle system below the rest
	ps_above = -1,                         // the particle system above the rest

	EFFECT_EXPLOSION = 0,
	EFFECT_RING = 1,
	EFFECT_ELLIPSE = 2,
	EFFECT_FIREWORK = 3,
	EFFECT_SMOKE = 4,
	EFFECT_SMOKE_UP = 5,
	EFFECT_STAR = 6,
	EFFECT_SPARK = 7,
	EFFECT_FLARE = 8,
	EFFECT_CLOUD = 9,
	EFFECT_RAIN = 10,
	EFFECT_SNOW = 11,

	pt_ellipse = [0, 0, 0],
	pt_smoke = [0, 0, 0],
	pt_explosion = [0, 0, 0, 0, 0, 0],
	pt_ring = [0, 0, 0],
	pt_firework = [0, 0, 0],
	pt_smokeup = [0, 0, 0],
	pt_star = [0, 0, 0],
	pt_spark = [0, 0, 0],
	pt_flare = [0,0,0],
	pt_cloud = [0,0,0],
	pt_rain = 0,
	pt_snow = 0;

// #############################################################################################
/// Function:<summary>
///				Computes the speed factor. Does frame rate compensation...
///          </summary>
///
/// Out:	 <returns>
///				scaler value...
///			 </returns>
// #############################################################################################
function Speed_Factor()
{
    if(g_isZeus)
    {
    
	    if( ( g_GameTimer.GetFPS() <= 30) || (Fps <= 30) ){
		    return 1.0; 
	    }

	    if( (g_GameTimer.GetFPS()/ Fps) < 1.2 ){
		    return 30.0/g_GameTimer.GetFPS();
	    }else{
		    return 30.0/Fps;
	    }
    }
    else
    {


	    if( ( g_RunRoom.GetSpeed() <= 30) || (Fps <= 30) ){
		    return 1.0; 
	    }

	    if( (g_RunRoom.GetSpeed() / Fps) < 1.2 ){
		    return 30.0/g_RunRoom.GetSpeed();
	    }else{
		    return 30.0/Fps;
	    }
	}
}


// #############################################################################################
/// Function:<summary>
///				Checks whether the particle systems exist and creates them if not
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Eff_Check_Systems()
{
	if ( !ParticleSystem_Exists(ps_below) )	{
	    ps_below = ParticleSystem_Create();
	    if (g_isZeus) {
	        ParticleSystem_Depth(ps_below, 50);     // try and make sure they generally sit above the background layers
	    }
	    else {
	        ParticleSystem_Depth(ps_below, 100000);
	    }
	}

	if ( !ParticleSystem_Exists(ps_above) )	{
	    ps_above = ParticleSystem_Create();

	    if (g_isZeus) {
	        ParticleSystem_Depth(ps_above, -15000);
	    }
	    else {
	        ParticleSystem_Depth(ps_above, -100000);
	    }
	}
	if ( !types_created ){
		Eff_Create_Types();
	}
}


// #############################################################################################
/// Function:<summary>
///				Creates the particle types
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Eff_Create_Types()
{
	var i;

	types_created = true;

	for(i=0 ; i<=5; i++ ){
		pt_explosion[i] = ParticleType_Create();
	}

	for (i = 0; i <= 2; i++)
	{
		pt_ring[i] = ParticleType_Create();
		pt_ellipse[i] = ParticleType_Create();
		pt_firework[i] = ParticleType_Create();
		pt_smoke[i] = ParticleType_Create();
		pt_smokeup[i]= ParticleType_Create();
		pt_star[i] = ParticleType_Create();
		pt_spark[i] = ParticleType_Create();
		pt_flare[i] = ParticleType_Create();
		pt_cloud[i] = ParticleType_Create();
	}
	pt_rain = ParticleType_Create();
	pt_snow = ParticleType_Create();
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	Eff_Effect00(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();

	if (_size === 0)
	{
		ParticleType_Shape( pt_explosion[0], PT_SHAPE_EXPLOSION );
		ParticleType_Size( pt_explosion[0], 0.1, 0.1, 0.05*f, 0 );
		ParticleType_Orientation(pt_explosion[0],0,360,0,0,false);
		ParticleType_Direction(pt_explosion[0],0,360,0,0);
		ParticleType_Speed(pt_explosion[0],2*f,2*f,-0.1*f,0);
		ParticleType_Alpha2(pt_explosion[0],0.6,0);
		ParticleType_Life(pt_explosion[0],Round(10.0/f),Round(15.0/f));
		
		ParticleSystem_Particles_Create_Color( _ps,_x,_y,pt_explosion[0],_col,20 );

		ParticleType_Shape(pt_explosion[1],PT_SHAPE_EXPLOSION);
		ParticleType_Size( pt_explosion[1], 0.1, 0.1, 0.1*f, 0);
		ParticleType_Orientation(pt_explosion[1],0,360,0,0,false);
		ParticleType_Alpha2(pt_explosion[1],0.8,0);
		ParticleType_Life(pt_explosion[1],Round(15/f),Round(15/f));
		
		ParticleSystem_Particles_Create_Color(_ps,_x,_y, pt_explosion[1], 0x000000,1);
	}
	else if (_size == 2)
	{
		ParticleType_Shape(pt_explosion[4],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_explosion[4], 0.4 ,0.4 ,0.2*f, 0);
		ParticleType_Orientation(pt_explosion[4],0,360,0,0,false);
		ParticleType_Direction(pt_explosion[4],0,360,0,0);
		ParticleType_Speed(pt_explosion[4],7*f,7*f,-0.2*f,0);
		ParticleType_Alpha2(pt_explosion[4],0.6,0);
		ParticleType_Life( pt_explosion[4],Round(15/f),Round(20/f) );

		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_explosion[4],_col,20);

		ParticleType_Shape(pt_explosion[5],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_explosion[5], 0.4, 0.4, 0.4*f, 0);
		ParticleType_Orientation(pt_explosion[5],0,360,0,0,false);
		ParticleType_Alpha2(pt_explosion[5],0.8,0);
		ParticleType_Life( pt_explosion[5],Round(20/f),Round(20/f) );

		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_explosion[5],0x000000,1);
	}
	else
	{
		ParticleType_Shape(pt_explosion[2],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_explosion[2], 0.3, 0.3, 0.1*f, 0);
		ParticleType_Orientation(pt_explosion[2],0,360,0,0,false);
		ParticleType_Direction(pt_explosion[2],0,360,0,0);
		ParticleType_Speed(pt_explosion[2],4*f,4*f,-0.18*f,0);
		ParticleType_Alpha2(pt_explosion[2],0.6,0);
		ParticleType_Life(pt_explosion[2],Round(12/f),Round(17/f));
		
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_explosion[2],_col,20);

		ParticleType_Shape(pt_explosion[3],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_explosion[3], 0.3, 0.3, 0.2*f, 0);
		ParticleType_Orientation(pt_explosion[3],0,360,0,0,false);
		ParticleType_Alpha2(pt_explosion[3],0.8,0);
		ParticleType_Life(pt_explosion[3],Round(17/f),Round(17/f));
		
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_explosion[3],0x000000,1);
	}
}




// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	Eff_Effect01(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_ring[0],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ring[0],1,0);
		ParticleType_Size( pt_ring[0], 0.0, 0.0, 0.15*f, 0.0);
		ParticleType_Life(pt_ring[0],Round(10.0/f),Round(12.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ring[0],_col,1);
	}
	else if ( _size == 2 )
	{
		ParticleType_Shape(pt_ring[2],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ring[2],1,0);
		ParticleType_Size(pt_ring[2], 0, 0, 0.4*f, 0);
		ParticleType_Life(pt_ring[2],Round(18.0/f),Round(20.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ring[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_ring[1],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ring[1],1,0);
		ParticleType_Size(pt_ring[1],0, 0, 0.25*f, 0);
		ParticleType_Life(pt_ring[1],Round(13.0/f),Round(15.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ring[1],_col,1);
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect02(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();
	if ( _size === 0 )
	{
		ParticleType_Shape(pt_ellipse[0],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ellipse[0],1,0);
		ParticleType_Size(pt_ellipse[0],0, 0, 0.2*f, 0);
		ParticleType_Scale(pt_ellipse[0],1,0.5);
		ParticleType_Life(pt_ellipse[0],Round(10.0/f),Round(12.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ellipse[0],_col,1);
	}
	else if( _size == 2 )
	{
		ParticleType_Shape(pt_ellipse[2],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ellipse[2],1,0);
		ParticleType_Size(pt_ellipse[2],0, 0, 0.6*f, 0);
		ParticleType_Scale(pt_ellipse[2],1,0.5);
		ParticleType_Life(pt_ellipse[2],Round(18.0/f),Round(20.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ellipse[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_ellipse[1],PT_SHAPE_RING);
		ParticleType_Alpha2(pt_ellipse[1],1,0);
		ParticleType_Size(pt_ellipse[1],0, 0, 0.35*f, 0);
		ParticleType_Scale(pt_ellipse[1],1,0.5);
		ParticleType_Life(pt_ellipse[1],Round(13.0/f),Round(15.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_ellipse[1],_col,1);
	}
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
///				
// #############################################################################################
function Eff_Effect03(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();
	if ( _size === 0 )
	{
		ParticleType_Shape(pt_firework[1],PT_SHAPE_FLARE);
		ParticleType_Size(pt_firework[1],0.1, 0.2, 0, 0);
		ParticleType_Speed(pt_firework[1], 0.5*f, 3.0*f, 0.0, 0.0);
		ParticleType_Direction(pt_firework[1],0,360,0,0);
		ParticleType_Alpha2(pt_firework[1],1,0.4);
		ParticleType_Life(pt_firework[1],Round(15.0/f),Round(25.0/f));
		ParticleType_Gravity(pt_firework[1],0.10*f,270);
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_firework[1],_col,75);
	}
	else if ( _size == 2 )
	{
		ParticleType_Shape(pt_firework[1],PT_SHAPE_FLARE);
		ParticleType_Size(pt_firework[1],0.1, 0.2, 0, 0);
		ParticleType_Speed(pt_firework[1], 0.5*f, 8.0*f, 0.0, 0.0);
		ParticleType_Direction(pt_firework[1],0,360,0,0);
		ParticleType_Alpha2(pt_firework[1],1,0.4);
		ParticleType_Life(pt_firework[1],Round(30.0/f),Round(40.0/f));
		ParticleType_Gravity(pt_firework[1],0.17*f,270);
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_firework[1],_col,250);
	}
	else
	{
		ParticleType_Shape(pt_firework[1],PT_SHAPE_FLARE);
		ParticleType_Size(pt_firework[1], 0.1, 0.2, 0, 0);
		ParticleType_Speed(pt_firework[1], 0.5*f, 6.0*f, 0.0, 0.0);
		ParticleType_Direction(pt_firework[1],0,360,0,0);
		ParticleType_Alpha2(pt_firework[1],1,0.4);
		ParticleType_Life(pt_firework[1],Round(20.0/f),Round(30.0/f));
		ParticleType_Gravity(pt_firework[1],0.15*f,270);
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_firework[1],_col,150);
	}
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect04(_ps, _x, _y, _size, _col)
{
	var i;
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_smoke[0],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smoke[0],0.2, 0.4, -0.01*f, 0);
		ParticleType_Alpha2(pt_smoke[0],0.4,0);
		ParticleType_Life(pt_smoke[0],Round(25.0/f),Round(25.0/f));
		for( i=0 ; i<=5 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps,_x-5+YYRandom(10),_y-5+YYRandom(10),pt_smoke[0],_col,1);
		}
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_smoke[2],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smoke[2],0.4, 1,-0.01*f, 0);
		ParticleType_Alpha2(pt_smoke[2],0.4,0);
		ParticleType_Life(pt_smoke[2],Round(50.0/f),Round(50.0/f));
		for( i=0 ; i<=15 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps,_x-30+YYRandom(60),_y-30+YYRandom(60),pt_smoke[2],_col,1);
		}
	}
	else
	{
		ParticleType_Shape(pt_smoke[1],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smoke[1],0.4, 0.7, -0.01*f, 0);
		ParticleType_Alpha2(pt_smoke[1],0.4,0);
		ParticleType_Life(pt_smoke[1],Round(30.0/f),Round(30.0/f));
		for( i=0 ; i<=10 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps, _x - 15 + YYRandom(30), _y - 15 + YYRandom(30), pt_smoke[1], _col, 1);
		}
	}
}

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect05(_ps, _x,  _y, _size, _col)
{
	var i;
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_smokeup[0],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smokeup[0], 0.2, 0.4, -0.01*f, 0);
		ParticleType_Alpha2(pt_smokeup[0],0.4,0);
		ParticleType_Speed(pt_smokeup[0],3.0*f,4.0*f,0,0);
		ParticleType_Direction(pt_smokeup[0],90,90,0,0);
		ParticleType_Life(pt_smokeup[0],Round(25.0/f),Round(25.0/f));
		for (  i=0 ; i<=5 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps,_x-5+YYRandom(10),_y-5+YYRandom(10),pt_smokeup[0],_col,1);
		}
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_smokeup[2],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smokeup[2], 0.4, 1, -0.01*f, 0);
		ParticleType_Alpha2(pt_smokeup[2],0.4,0);
		ParticleType_Speed(pt_smokeup[2],6.0*f,7.0*f,0,0);
		ParticleType_Direction(pt_smokeup[2],90,90,0,0);
		ParticleType_Life(pt_smokeup[2],Round(50.0/f),Round(50.0/f));
		for (  i=0 ; i<=15 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps,_x-30+YYRandom(60),_y-30+YYRandom(60),pt_smokeup[2],_col,1);
		}
	}
	else
	{
		ParticleType_Shape(pt_smokeup[1],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_smokeup[1], 0.4, 0.7, -0.01*f, 0);
		ParticleType_Alpha2(pt_smokeup[1],0.4,0);
		ParticleType_Speed(pt_smokeup[1],5.0*f,6.0*f,0,0);
		ParticleType_Direction(pt_smokeup[1],90,90,0,0);
		ParticleType_Life(pt_smokeup[1],Round(30.0/f),Round(30.0/f));
		for (  i=0 ; i<=10 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps,_x-15+YYRandom(30),_y-15+YYRandom(30),pt_smokeup[1],_col,1);
		}
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect06(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_star[0],PT_SHAPE_STAR);
		ParticleType_Size(pt_star[0], 0.4, 0.3, -0.02*f, 0);
		ParticleType_Orientation(pt_star[0],0,360,0,0,false);
		ParticleType_Life(pt_star[0],Round(20/f),Round(20/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_star[0],_col,1);
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_star[2],PT_SHAPE_STAR);
		ParticleType_Size(pt_star[2], 1.2, 1.2, -0.04*f, 0);
		ParticleType_Orientation(pt_star[2],0,360,0,0,false);
		ParticleType_Life(pt_star[2],Round(30/f),Round(30/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_star[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_star[1],PT_SHAPE_STAR);
		ParticleType_Size(pt_star[1], 0.75, 0.75, -0.03*f, 0);
		ParticleType_Orientation(pt_star[1],0,360,0,0,false);
		ParticleType_Life(pt_star[1],Round(25/f),Round(25/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_star[1],_col,1);
	}
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	Eff_Effect07(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_spark[0],PT_SHAPE_SPARK);
		ParticleType_Size(pt_spark[0], 0.4, 0.4, -0.02*f,0);
		ParticleType_Orientation(pt_spark[0],0,360,0,0,false);
		ParticleType_Life(pt_spark[0],Round(20/f),Round(20/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_spark[0],_col,1);
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_spark[2],PT_SHAPE_SPARK);
		ParticleType_Size(pt_spark[2], 1.2, 1.2, -0.04*f, 0);
		ParticleType_Orientation(pt_spark[2],0,360,0,0,false);
		ParticleType_Life(pt_spark[2],Round(30/f),Round(30/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_spark[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_spark[1],PT_SHAPE_SPARK);
		ParticleType_Size(pt_spark[1], 0.75, 0.75, -0.03*f, 0);
		ParticleType_Orientation(pt_spark[1],0,360,0,0,false);
		ParticleType_Life(pt_spark[1],Round(25/f),Round(25/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_spark[1],_col,1);
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect08(_ps, _x, _y, _size, _col)
{
	var  f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_flare[0],PT_SHAPE_FLARE);
		ParticleType_Size(pt_flare[0], 0.4, 0.4, -0.02*f, 0);
		ParticleType_Orientation(pt_flare[0],0,360,0,0,false);
		ParticleType_Life(pt_flare[0],Round(20/f),Round(20/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_flare[0],_col,1);
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_flare[2],PT_SHAPE_FLARE);
		ParticleType_Size(pt_flare[2], 1.2, 1.2, -0.04*f, 0);
		ParticleType_Orientation(pt_flare[2],0,360,0,0,false);
		ParticleType_Life(pt_flare[2],Round(30/f),Round(30/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_flare[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_flare[1],PT_SHAPE_FLARE);
		ParticleType_Size(pt_flare[1], 0.75, 0.75, -0.03*f, 0);
		ParticleType_Orientation(pt_flare[1],0,360,0,0,false);
		ParticleType_Life(pt_flare[1],Round(25/f),Round(25/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_flare[1],_col,1);
	}
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function Eff_Effect09(_ps, _x, _y, _size, _col)
{
	var f = Speed_Factor();

	if ( _size === 0 )
	{
		ParticleType_Shape(pt_cloud[0],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_cloud[0],2,2,0,0);
		ParticleType_Scale(pt_cloud[0],1,0.5);
		ParticleType_Alpha3(pt_cloud[0],0,0.3,0);
		ParticleType_Life(pt_cloud[0],Round(100.0/f),Round(100.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_cloud[0],_col,1);
	}
	else if ( _size === 2 )
	{
		ParticleType_Shape(pt_cloud[2],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_cloud[2],8,8,0,0);
		ParticleType_Scale(pt_cloud[2],1,0.5);
		ParticleType_Alpha3(pt_cloud[2],0,0.3,0);
		ParticleType_Life(pt_cloud[2],Round(100.0/f),Round(100.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_cloud[2],_col,1);
	}
	else
	{
		ParticleType_Shape(pt_cloud[1],PT_SHAPE_EXPLOSION);
		ParticleType_Size(pt_cloud[1],4,4,0,0);
		ParticleType_Scale(pt_cloud[1],1,0.5);
		ParticleType_Alpha3(pt_cloud[1],0,0.3,0);
		ParticleType_Life(pt_cloud[1],Round(100.0/f),Round(100.0/f));
		ParticleSystem_Particles_Create_Color(_ps,_x,_y,pt_cloud[1],_col,1);
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	Eff_Effect10(_ps, _x, _y, _size, _col)
{
	var i;
	var f = Speed_Factor();

	ParticleType_Shape(pt_rain,PT_SHAPE_LINE);
	ParticleType_Size(pt_rain, 0.2, 0.3, 0.0 ,0.0);
	ParticleType_Orientation(pt_rain,0,0,0,0,true);
	ParticleType_Speed(pt_rain,7*f,7*f,0,0);
	ParticleType_Direction(pt_rain,260,260,0,0);
	ParticleType_Alpha1(pt_rain,0.4);
	ParticleType_Life(pt_rain,Round(0.2*g_RunRoom.GetHeight()/f),Round(0.2*g_RunRoom.GetHeight()/f));
	if ( _size === 0 )
	{
		for ( i= 0 ; i<=1 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth(), -30.0+YYRandom(20),pt_rain,_col,1);
		}
	}
	else if ( _size == 2 )
	{
		for ( i= 0 ; i<=8 ; i++ )
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth(), -30.0+YYRandom(20),pt_rain,_col,1); 
		}
	}
	else
	{
		for ( i= 0 ; i<=4 ; i++)
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth(), -30.0+YYRandom(20),pt_rain,_col,1); 
		}
	}
}


// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="ps"></param>
///			 <param name="x"></param>
///			 <param name="y"></param>
///			 <param name="size"></param>
///			 <param name="col"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function	Eff_Effect11(_ps, _x, _y, _size, _col)
{
	var i;
	var f = Speed_Factor();

	ParticleType_Shape(pt_snow,PT_SHAPE_SNOW);
	ParticleType_Size(pt_snow, 0.1, 0.25, 0.0, 0.0);
	ParticleType_Alpha1(pt_snow,0.6);
	ParticleType_Orientation(pt_snow,0,360,0,0,false);
	ParticleType_Speed(pt_snow, 2.5*f, 3.0*f, 0.0, 0.0);
	ParticleType_Direction(pt_snow,240,300,0,20);
	ParticleType_Life(pt_snow,Round(0.5*g_RunRoom.GetHeight()/f),Round(0.5*g_RunRoom.GetHeight()/f));
	if ( _size === 0 )
	{
		for ( i= 0 ; i<=0 ; i++)
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth()-60, -30.0+YYRandom(20),pt_snow,_col,1);
		}
	}
	else if ( _size === 2 )
	{
		for ( i= 0 ; i<=6 ; i++)
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth()-60, -30.0+YYRandom(20),pt_snow,_col,1); 
		}
	}
	else
	{
		for (i= 0 ; i<=2 ; i++)
		{
			ParticleSystem_Particles_Create_Color(_ps, YYRandom(1)*1.2*g_RunRoom.GetWidth()-60, -30.0+YYRandom(20),pt_snow,_col,1);
		}
	}
}


// #############################################################################################
/// Function:<summary>
///				Creates an effect
///          </summary>
///
/// In:		<param name="ps"></param>
///			<param name="kind"></param>
///			<param name="x"></param>
///			<param name="y"></param>
///			<param name="size"></param>
///			<param name="col"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function Effect_Create(_ps, _kind, _x, _y, _size, _col)
{
	Eff_Check_Systems();
	
	switch(  _kind )
	{
		case EFFECT_EXPLOSION: Eff_Effect00(_ps,_x,_y,_size,_col); break;
		case EFFECT_RING: Eff_Effect01(_ps,_x,_y,_size,_col); break;
		case EFFECT_ELLIPSE: Eff_Effect02(_ps, _x, _y, _size, _col); break;
		case EFFECT_FIREWORK: Eff_Effect03(_ps,_x,_y,_size,_col); break;
		case EFFECT_SMOKE: Eff_Effect04(_ps,_x,_y,_size,_col); break;
		case EFFECT_SMOKE_UP: Eff_Effect05(_ps,_x,_y,_size,_col); break;
		case EFFECT_STAR: Eff_Effect06(_ps,_x,_y,_size,_col); break;
		case EFFECT_SPARK: Eff_Effect07(_ps,_x,_y,_size,_col); break;
		case EFFECT_FLARE: Eff_Effect08(_ps,_x,_y,_size,_col); break;
		case EFFECT_CLOUD: Eff_Effect09(_ps,_x,_y,_size,_col); break;
		case EFFECT_RAIN: Eff_Effect10(_ps,_x,_y,_size,_col); break;
		case EFFECT_SNOW: Eff_Effect11(_ps,_x,_y,_size,_col); break;
	}
}