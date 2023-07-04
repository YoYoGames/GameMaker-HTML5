
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Particles.js
// Created:			01/06/2011
// Author:			Mike
// Project:			HTML5
// Description:		Particle engine...
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 01/06/2011		1.0         MJD     1st version
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///			</returns>
// #############################################################################################
function particle_get_info(_ind)
{
    _ind = yyGetInt32(_ind);
    var pPS = CParticleSystem.Get(_ind);
    var pPSI = undefined;
    if (pPS != null)
    {
        pPSI = new GMLObject();

        variable_struct_set(pPSI, "name", pPS.name);
        variable_struct_set(pPSI, "xorigin", pPS.originX);
        variable_struct_set(pPSI, "yorigin", pPS.originY);
        variable_struct_set(pPSI, "oldtonew", (pPS.drawOrder == 0));
        variable_struct_set(pPSI, "global_space", pPS.globalSpaceParticles);

        var emittersArray = [];
        for (var i = 0; i < pPS.emitters.length; ++i)
        {
            var emitterIndex = pPS.emitters[i];
            var templateEmitter = g_PSEmitters[emitterIndex];

            var pEmitterI = new GMLObject();

            variable_struct_set(pEmitterI, "name", templateEmitter.name);
            variable_struct_set(pEmitterI, "mode", templateEmitter.mode);
            variable_struct_set(pEmitterI, "number", templateEmitter.number);
            variable_struct_set(pEmitterI, "delay_min", templateEmitter.delayMin);
            variable_struct_set(pEmitterI, "delay_max", templateEmitter.delayMax);
            variable_struct_set(pEmitterI, "delay_unit", templateEmitter.delayUnit);
            variable_struct_set(pEmitterI, "interval_min", templateEmitter.intervalMin);
            variable_struct_set(pEmitterI, "interval_max", templateEmitter.intervalMax);
            variable_struct_set(pEmitterI, "interval_unit", templateEmitter.intervalUnit);
            variable_struct_set(pEmitterI, "xmin", templateEmitter.xmin);
            variable_struct_set(pEmitterI, "xmax", templateEmitter.xmax);
            variable_struct_set(pEmitterI, "ymin", templateEmitter.ymin);
            variable_struct_set(pEmitterI, "ymax", templateEmitter.ymax);
            variable_struct_set(pEmitterI, "distribution", templateEmitter.posdistr);
            variable_struct_set(pEmitterI, "shape", templateEmitter.shape);
            variable_struct_set(pEmitterI, "enabled", templateEmitter.enabled);

            var pPartTypeI = new GMLObject();
            var particleType = g_ParticleTypes[templateEmitter.parttype];

            variable_struct_set(pPartTypeI, "ind", templateEmitter.parttype);
            variable_struct_set(pPartTypeI, "sprite", particleType.sprite);
            variable_struct_set(pPartTypeI, "frame", particleType.spritestart);
            variable_struct_set(pPartTypeI, "animate", particleType.spriteanim);
            variable_struct_set(pPartTypeI, "stretch", particleType.spritestretch);
            variable_struct_set(pPartTypeI, "random", particleType.spriterandom);
            variable_struct_set(pPartTypeI, "shape", particleType.shape);
            variable_struct_set(pPartTypeI, "size_min", particleType.sizemin);
            variable_struct_set(pPartTypeI, "size_max", particleType.sizemax);
            variable_struct_set(pPartTypeI, "size_incr", particleType.sizeincr);
            variable_struct_set(pPartTypeI, "size_wiggle", particleType.sizerand);
            variable_struct_set(pPartTypeI, "xscale", particleType.xscale);
            variable_struct_set(pPartTypeI, "yscale", particleType.yscale);
            variable_struct_set(pPartTypeI, "life_min", particleType.lifemin);
            variable_struct_set(pPartTypeI, "life_max", particleType.lifemax);
            variable_struct_set(pPartTypeI, "death_type", particleType.deathtype);
            variable_struct_set(pPartTypeI, "death_number", particleType.deathnumber);
            variable_struct_set(pPartTypeI, "step_type", particleType.steptype);
            variable_struct_set(pPartTypeI, "step_number", particleType.stepnumber);
            variable_struct_set(pPartTypeI, "speed_min", particleType.spmin);
            variable_struct_set(pPartTypeI, "speed_max", particleType.spmax);
            variable_struct_set(pPartTypeI, "speed_incr", particleType.spincr);
            variable_struct_set(pPartTypeI, "speed_wiggle", particleType.sprand);
            variable_struct_set(pPartTypeI, "dir_min", particleType.dirmin);
            variable_struct_set(pPartTypeI, "dir_max", particleType.dirmax);
            variable_struct_set(pPartTypeI, "dir_incr", particleType.dirincr);
            variable_struct_set(pPartTypeI, "dir_wiggle", particleType.dirrand);
            variable_struct_set(pPartTypeI, "grav_amount", particleType.grav);
            variable_struct_set(pPartTypeI, "grav_dir", particleType.gravdir);
            variable_struct_set(pPartTypeI, "ang_min", particleType.angmin);
            variable_struct_set(pPartTypeI, "ang_max", particleType.angmax);
            variable_struct_set(pPartTypeI, "ang_incr", particleType.angincr);
            variable_struct_set(pPartTypeI, "ang_wiggle", particleType.angrand);
            variable_struct_set(pPartTypeI, "ang_relative", particleType.angdir);
            // variable_struct_set(pPartTypeI, "color_mode", particleType.colmode);
            variable_struct_set(pPartTypeI, "color1", particleType.colpar[0]);
            variable_struct_set(pPartTypeI, "color2", particleType.colpar[1]);
            variable_struct_set(pPartTypeI, "color3", particleType.colpar[2]);
            variable_struct_set(pPartTypeI, "alpha1", particleType.alphastart);
            variable_struct_set(pPartTypeI, "alpha2", particleType.alphamiddle);
            variable_struct_set(pPartTypeI, "alpha3", particleType.alphaend);
            variable_struct_set(pPartTypeI, "additive", particleType.additiveblend);

            variable_struct_set(pEmitterI, "parttype", pPartTypeI);

            emittersArray.push(pEmitterI);
        }
        variable_struct_set(pPSI, "emitters", emittersArray);
    }
    return pPSI;
}

// #############################################################################################
/// Function:<summary>
///          	Creates a new particle system. It returns the index of the system. 
///             This index must be used in all calls below to set the properties of the particle system.
///          </summary>
///
/// In:		<param name="_partsys"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_create = function (_partsys)
{
    if (_partsys === undefined)
    {
        return ParticleSystem_Create();
    }

    _partsys = yyGetInt32(_partsys);

    var _system = CParticleSystem.Get(_partsys);
    if (_system == null)
    {
        return -1;
    }
    return _system.MakeInstance();
};

// #############################################################################################
/// Function:<summary>
///          	Destroys the particle system ind. Call this if you don't need it anymore to save space.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_destroy = ParticleSystem_Destroy;

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated particle system exists.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_exists = ParticleSystem_Exists;

// #############################################################################################
/// Function:<summary>
///          	Clears the particle system ind to its default settings, removing all particles 
///             and emitter and attractors in it.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_clear = ParticleSystem_Clear;

// #############################################################################################
/// Function:<summary>
///          	Sets the order in which the particle system draws the particles. When oldtonew 
///             is true the oldest particles are drawn first and the newer one lie on top of 
///             them (default). Otherwise the newest particles are drawn first. This can give 
///             rather different effects.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_oldtonew"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_draw_order = ParticleSystem_DrawOrder;


// #############################################################################################
/// Function:<summary>
///          	Sets the depth of the particle system. This can be used to let the particles 
///             appear behind, in front of, or in between instances.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_depth"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_depth = ParticleSystem_Depth;

// #############################################################################################
/// Function:<summary>
///          	Changes the color and alpha with which to blend the particle system.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_color"></param>
///			<param name="_alpha"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_color = ParticleSystem_Color;
var part_system_colour = ParticleSystem_Color;

// #############################################################################################
/// Function:<summary>
///          	Sets the position where the particle system is drawn. This is normally not 
///             necessary but if you want to have particles at a position relative to a moving 
///             object, you can set the position e.g. to that object.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_position = ParticleSystem_Position;

// #############################################################################################
/// Function:<summary>
///          	Changes the rotation of the particle system.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_angle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_angle = ParticleSystem_Angle;

// #############################################################################################
/// Function:<summary>
///          	Indicates whether the particle system must be updated automatically (1) or not (0). 
///             Default is 1.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_automatic"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_automatic_update = ParticleSystem_AutomaticUpdate;


// #############################################################################################
/// Function:<summary>
///          	Indicates whether the particle system must be drawn automatically (1) or not (0). 
///             Default is 1.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_automatic"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_automatic_draw = ParticleSystem_AutomaticDraw;

// #############################################################################################
/// Function:<summary>
///          	This functions updates the position of all particles in the system and lets the 
///             emitters create particles. You only have to call this when updating is not automatic. 
///             (Although sometimes it is also useful to call this function a couple of time to get 
///             the system going.)
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_update = ParticleSystem_Update; 


// #############################################################################################
/// Function:<summary>
///          	This functions draws the particles in the system. You only have to call this when 
///             drawing is not automatic. It should be called in the draw event of some object.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_system_drawit = ParticleSystem_Draw;


// #############################################################################################
/// Function:<summary>
///          	This functions creates number particles of the indicated type at postion (x,y) in the system.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_parttype">INT</param>
///			<param name="_number">INT</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_particles_create = ParticleSystem_Particles_Create;

// #############################################################################################
/// Function:<summary>
///          	This functions creates number particles of the indicated type at postion (x,y) 
///             in the system with the indicated color. This is only useful when the particle 
///             type defines a single color (or does not define a color at all).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_parttype"></param>
///			<param name="_color"></param>
///			<param name="_number"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_particles_create_color = ParticleSystem_Particles_Create_Color;
var part_particles_create_colour = ParticleSystem_Particles_Create_Color;

// #############################################################################################
/// Function:<summary>
///          	This function allows you to burst all particles defined in a particle system
///          	resource at any position in the room. The final area, distribution and number
///          	of the particles created depends on the configuration of emitters inside of the
///          	particle system resource.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_partsys"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_particles_burst = ParticleSystem_Particles_Burst;

// #############################################################################################
/// Function:<summary>
///          	This functions removes all particles in the system.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_particles_clear = ParticleSystem_Particles_Clear;


// #############################################################################################
/// Function:<summary>
///          	This functions returns the number of particles in the system.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_particles_count = ParticleSystem_Particles_Count;


// #############################################################################################
/// Function:<summary>
///          	Creates a new particle type. It returns the index of the type. 
///             This index must be used in all calls below to set the properties of the particle 
///             type. So you will often store it in a global variable.
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_create = ParticleType_Create;

// #############################################################################################
/// Function:<summary>
///          	Destroys particle type ind. Call this if you don't need it anymore to save space.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_destroy = ParticleType_Destroy;

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated particle type exists.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_exists = ParticleType_Exists; 

// #############################################################################################
/// Function:<summary>
///          	Clears the particle type ind to its default settings.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_clear = ParticleType_Clear;

// #############################################################################################
/// Function:<summary>
///          	Sets the shape of the particle type to any of the constants above 
///             (default is pt_shape_pixel).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_shape"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_shape = ParticleType_Shape;

// #############################################################################################
/// Function:<summary>
///          	Sets your own sprite for the particle type. 
///             With animate you indicate whether the sprite should be animated (1) or not (0). 
///             With stretch (1 or 0) you indicate whether the animation must be stretched over 
///             the lifetime of the particle. And with random (1 or 0) you can indicate whether 
///             a random subimage must be choosen as starting image.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_sprite"></param>
///			<param name="_animate"></param>
///			<param name="_stretch"></param>
///			<param name="_random"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_sprite = ParticleType_Sprite;

// #############################################################################################
/// Function:<summary>
///          	This function can be used to set a particle type to use a custom sub-image
///             (frame) of a sprite. If the particle's sprite is animated, then this sub-image
///             will be used as the starting frame of the animation.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_subimg"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_subimage = ParticleType_Subimage;

// #############################################################################################
/// Function:<summary>
///          	Sets the size parameters for the particle type. You specify the minimum starting 
///             size, the maximum starting size, the size increase in each step (use a negative 
///             number for a decrease in size) and the amount of wiggling. 
///             (The default size is 1 and default the size does not change.)
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_size_min"></param>
///			<param name="_size_max"></param>
///			<param name="_size_incr"></param>
///			<param name="_size_wiggle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_size = ParticleType_Size;

// #############################################################################################
/// Function:<summary>
///          	Sets the horizontal and vertical scale. This factor is multiplied with the size. 
///             It is in particular useful when you need to scale differently in x- and y-direction.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_xscale"></param>
///			<param name="_yscale"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_scale = ParticleType_Scale;

// #############################################################################################
/// Function:<summary>
///          	Sets whether to use additive blending (1) or normal blending (0) for the particle type.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_additive"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_blend = ParticleType_Blend;

// #############################################################################################
/// Function:<summary>
///          	Indicates a single color to be used for the particle.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_color1"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color1 = ParticleType_Color1;
var part_type_colour1 = ParticleType_Color1;

// #############################################################################################
/// Function:<summary>
///          	Specifies two colors between which the color is interpolated.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_color1"></param>
///			<param name="_color2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color2 = ParticleType_Color2;
var part_type_colour2 = ParticleType_Color2;

// #############################################################################################
/// Function:<summary>
///          	Similar but this time the color is interpolated between three colors that represent 
///             the color at the start, half-way, and at the end.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_color1"></param>
///			<param name="_color2"></param>
///			<param name="_color3"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color3 = ParticleType_Color3;
var part_type_colour3 = ParticleType_Color3;
var part_type_color = ParticleType_Color3; // for compatability reasons :S
var part_type_colour = ParticleType_Color3; // for compatability reasons :S

// #############################################################################################
/// Function:<summary>
///          	With this function you indicate that the particle should get a color that is a 
///             random mixture of the two indicated colors. This color will remain fixed over 
///             the lifetime of the particle.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_color1"></param>
///			<param name="_color2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color_mix = ParticleType_Colour_Mix;
var part_type_colour_mix = ParticleType_Colour_Mix;

// #############################################################################################
/// Function:<summary>
///          	Can be used to indicate that each particle must have a fixed color but choosen 
///             from a range. You specify a range in the red, green, and blue component of the 
///             color (each between 0 and 255).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_rmin"></param>
///			<param name="_rmax"></param>
///			<param name="_gmin"></param>
///			<param name="_gmax"></param>
///			<param name="_bmin"></param>
///			<param name="_bmax"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color_rgb = ParticleType_Colour_RGB;
var part_type_colour_rgb = ParticleType_Colour_RGB;

// #############################################################################################
/// Function:<summary>
///          	Can be used to indicate that each particle must have a fixed color but choosen 
///             from a range. You specify a range in the hue saturation and value component of 
///             the color (each between 0 and 255).
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_hmin"></param>
///			<param name="_hmax"></param>
///			<param name="_smin"></param>
///			<param name="_smax"></param>
///			<param name="_vmin"></param>
///			<param name="_vmax"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_color_hsv = ParticleType_Colour_HSV;
var part_type_colour_hsv = ParticleType_Colour_HSV;

// #############################################################################################
/// Function:<summary>
///          	Sets a single alpha transparency parameter (0-1) for the particle type.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_alpha1"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_alpha1 = ParticleType_Alpha1;

// #############################################################################################
/// Function:<summary>
///          	Similar but this time a start and end value are given and the alpha value is 
///             interpolated between them.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_alpha1"></param>
///			<param name="_alpha2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_alpha2 = ParticleType_Alpha2;

// #############################################################################################
/// Function:<summary>
///          	This time three values are given between which the alpha transparency is interpolated.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_alpha1"></param>
///			<param name="_alpha2"></param>
///			<param name="_alpha3"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_alpha3 = ParticleType_Alpha3;


// #############################################################################################
/// Function:<summary>
///          	Sets the lifetime bounds for the particle type. (Default both are 100.)
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_life_min"></param>
///			<param name="_life_max"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_life = ParticleType_Life;

// #############################################################################################
/// Function:<summary>
///          	Sets the number and type of particles that must be generated in each step for the 
///             indicated particle type. If you use a negative value, in each step a particle is 
///             generated with a chance -1/number. So for example with a value of -5 a particle is 
///             generated on average once every 5 steps.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_step_number"></param>
///			<param name="_step_type"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_step = ParticleType_Step;

// #############################################################################################
/// Function:<summary>
///          	Sets the number and type of particles that must be generated when a particle of 
///             the indicated type dies. Again you can use negative numbers to create a particle 
///             with a particular chance. Note that these particles are only created when the 
///             particle dies at the end of its life, not when it dies because of a destroyer.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_death_number"></param>
///			<param name="_death_type"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_death = ParticleType_Death;


// #############################################################################################
/// Function:<summary>
///          	Sets the orientation angle properties for the particle type. You specify the minimum 
///				angle, the maximum angle, the increase in each step and the amount of wiggling in angle. 
///				(Default all values are 0.) You can also indicate whether the given angle should be 
///				relative (1) to the current direction of motion or absolute (0). E.g. by setting all 
///				values to 0 but ang_relative to 1, the particle orientation will precisely follow the 
///				path of the particle. 
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_ang_min"></param>
///			<param name="_ang_max"></param>
///			<param name="_ang_incr"></param>
///			<param name="_ang_wiggle"></param>
///			<param name="_ang_relative"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_orientation = ParticleType_Orientation;

// #############################################################################################
/// Function:<summary>
///          	Sets the speed properties for the particle type. (Default all values are 0.) 
///             You specify a minimal and maximal speed. A random value between the given bounds 
///             is chosen when the particle is created. You can indicate a speed increase in each 
///             step Use a negative number to slow the particle down (the speed will never become 
///             smaller than 0). Finally you can indicate some amount of wiggling of the speed.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_speed_min"></param>
///			<param name="_speed_max"></param>
///			<param name="_speed_incr"></param>
///			<param name="_speed_wiggle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_speed = ParticleType_Speed;

// #############################################################################################
/// Function:<summary>
///          	Sets the direction properties for the particle type. (Default all values are 0.) 
///             Again you specify a range of directions (in counterclockwise degrees; 0 indicated 
///             a motion to the right). For example, to let the particle move in a random direction 
///             choose 0 and 360 as values. You can specify an increase in direction for each step, 
///             and an amount of wiggling.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_dir_min"></param>
///			<param name="_dir_max"></param>
///			<param name="_dir_incr"></param>
///			<param name="_dir_wiggle"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_direction = ParticleType_Direction;

// #############################################################################################
/// Function:<summary>
///          	Sets the gravity properties for the particle type. (Default there is no gravity.) 
///             You specify the amount of gravity to be added in each step and the direction. 
///             E.g. use 270 for a downwards direction.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_grav_amount"></param>
///			<param name="_grav_dir"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_type_gravity = ParticleType_Gravity;



// #############################################################################################
/// Function:<summary>
///          	Creates a new emitter in the given particle system. It returns the index of the 
///             emitter. This index must be used in all calls below to set the properties of the emitter.
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_create = ParticleSystem_Emitter_Create;

// #############################################################################################
/// Function:<summary>
///          	Destroys emitter ind in the particle system. Call this if you don't need it 
///             anymore to save space.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_destroy  = ParticleSystem_Emitter_Destroy;

// #############################################################################################
/// Function:<summary>
///          	Destroys all emitters in the particle system that have been created.
///          </summary>
///
/// In:		<param name="_ps"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_destroy_all = ParticleSystem_Emitter_DestroyAll;

// #############################################################################################
/// Function:<summary>
///          	Enables or disables a particle emitter. Disabled emitters aren't updated nor
///             rendered and they don't spawn new particles.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_enable"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_enable = ParticleSystem_Emitter_Enable;

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated emitter exists in the particle system.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_exists = ParticleSystem_Emitter_Exists;

// #############################################################################################
/// Function:<summary>
///          	Clears the emitter ind to its default settings.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_clear = ParticleSystem_Emitter_Clear;

// #############################################################################################
/// Function:<summary>
///          	Sets the region and distribution for the emitter.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_xmin"></param>
///			<param name="_xmax"></param>
///			<param name="_ymin"></param>
///			<param name="_ymax"></param>
///			<param name="_shape"></param>
///			<param name="_distribution"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_region = ParticleSystem_Emitter_Region;

// #############################################################################################
/// Function:<summary>
///          	Bursts once number particles of the indicated type from the emitter.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_parttype"></param>
///			<param name="_number"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_burst = ParticleSystem_Emitter_Burst;

// #############################################################################################
/// Function:<summary>
///          	From this moment on create number particles of the indicated type from the emitter 
///             in every step. If you indicate a number smaller than 0 in each step a particle is 
///             generated with a chance of -1/number. So for example with a value of -5 a particle 
///             is generated on average once every 5 steps.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_parttype"></param>
///			<param name="_number"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_stream = ParticleSystem_Emitter_Stream;

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_delay_min"></param>
///			<param name="_delay_max"></param>
///			<param name="_delay_unit"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_delay = ParticleSystem_Emitter_Delay;

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_interval_min"></param>
///			<param name="_interval_max"></param>
///			<param name="_interval_unit"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
var part_emitter_interval = ParticleSystem_Emitter_Interval;

// #############################################################################################
/// Function:<summary>
///          	Creates an effect of the given kind (see above) at the indicated position. 
///             The effect is created below the instances, that is, at a depth of 100000.
///          </summary>
///
/// In:		<param name="_kind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_size">0 = small, 1 = medium, 2 = large</param>
///			<param name="_color">indicates the color to be used</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function effect_create_below(_kind,_x,_y,_size,_color) {
	Effect_Create(ps_below, yyGetInt32(_kind), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_size), yyGetInt32(_color));
}

// #############################################################################################
/// Function:<summary>
///          	Similar to effect_create_below() function but this time the effect is created on 
///             top of the instances, that is, at a depth of -100000.
///          </summary>
///
/// In:		<param name="_kind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_size">0 = small, 1 = medium, 2 = large</param>
///			<param name="_color">indicates the color to be used</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function effect_create_above(_kind,_x,_y,_size,_color) {
	Effect_Create(ps_above, yyGetInt32(_kind), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_size), yyGetInt32(_color));
}

// #############################################################################################
/// Function:<summary>
///          	Creates an effect of the given kind (see above) at the indicated position on the
///				layer specified.
///          </summary>
///
/// In:		<param name="_layerid"></param>
///			<param name="_kind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_size">0 = small, 1 = medium, 2 = large</param>
///			<param name="_color">indicates the color to be used</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function effect_create_layer(_layerid,_kind,_x,_y,_size,_color) {

	var layer = null;
	if(typeof (_layerid) == "string")
		layer = g_pLayerManager.GetLayerFromName(g_RunRoom, yyGetString(_layerid));
	else
		layer = g_pLayerManager.GetLayerFromID(g_RunRoom, yyGetInt32(_layerid));

	if (layer == null) {
		yyError("Specified layer does not exist");
		return;
	}

	if (!ParticleSystem_Exists(layer.m_effectPS))
		layer.m_effectPS = ParticleSystem_Create(layer.m_id, false);

	var ps = layer.m_effectPS;

	Effect_Create(ps, yyGetInt32(_kind), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_size), yyGetInt32(_color));
}

// #############################################################################################
/// Function:<summary>
///          	Creates an effect of the given kind (see above) at the indicated position at the
///				depth specified.
///          </summary>
///
/// In:		<param name="_depth"></param>
///			<param name="_kind"></param>
///			<param name="_x"></param>
///			<param name="_y"></param>
///			<param name="_size">0 = small, 1 = medium, 2 = large</param>
///			<param name="_color">indicates the color to be used</param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function effect_create_depth(_depth,_kind,_x,_y,_size,_color) {

	_depth = yyGetInt32(_depth);

	var layer = g_pLayerManager.GetLayerWithDepth(g_RunRoom, _depth, true);

	if (layer == null)
		layer = g_pLayerManager.AddDynamicLayer(g_RunRoom, _depth);

	if (!ParticleSystem_Exists(layer.m_effectPS))
		layer.m_effectPS = ParticleSystem_Create(layer.m_id, false);

	var ps = layer.m_effectPS;

	Effect_Create(ps, yyGetInt32(_kind), yyGetReal(_x), yyGetReal(_y), yyGetInt32(_size), yyGetInt32(_color));
}


// #############################################################################################
/// Function:<summary>
///          	Clears all effects. 
///          </summary>
// #############################################################################################
function effect_clear() 
{
	ParticleSystem_Particles_Clear(ps_below);
	ParticleSystem_Particles_Clear(ps_above);
}

function part_system_create_layer(_layerid, _persistent, _partsys)
{
    var room = g_pLayerManager.GetTargetRoomObj();
    
    if (room == null)
    {
        // No valid room, bail
        return;
    }

    var layer = null;
    if (typeof (_layerid) == "string")
        layer = g_pLayerManager.GetLayerFromName(room, yyGetString(_layerid));
    else
        layer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(_layerid));

    if (_persistent == undefined)
    {
        _persistent = false;
    }
    else
    {
        _persistent = yyGetBool(_persistent);
    }

    if (_partsys === undefined)
    {
        return ParticleSystem_Create(layer.m_id, _persistent);
    }

    _partsys = yyGetInt32(_partsys);

    var _system = CParticleSystem.Get(_partsys);
    if (_system == null)
    {
        return -1;
    }
    return _system.MakeInstance(layer.m_id, _persistent);
}

function part_system_get_layer(_ind)
{
    var ret = ParticleSystem_GetLayer(yyGetInt32(_ind));
    return ret;
}

function part_system_layer(_ind, _layerid)
{
    var room = g_pLayerManager.GetTargetRoomObj();

    if (room == null) {
        // No valid room, bail
        return;
    }

    var layer = null;
    if (typeof (_layerid) == "string")
        layer = g_pLayerManager.GetLayerFromName(room, yyGetString(_layerid));
    else
        layer = g_pLayerManager.GetLayerFromID(room, yyGetInt32(_layerid));    

    var ret = ParticleSystem_Layer(yyGetInt32(_ind), layer.m_id);
    return ret;
}

function part_system_global_space(_ind, _enable)
{
    ParticleSystem_GlobalSpace(yyGetInt32(_ind), yyGetBool(_enable));
}
