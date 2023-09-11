
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

function GetParticleSystemResourceIndex(_arg)
{
    return yyGetRef(_arg, REFID_PARTICLESYSTEM, CParticleSystem.instances.length, CParticleSystem.instances);
}

function GetParticleSystemInstanceIndex(_arg, _optional)
{
    return yyGetRef(_arg, REFID_PART_SYSTEM, g_ParticleSystems.length, g_ParticleSystems, _optional);
}

function GetParticleEmitterIndex(_ps, _arg, _optional)
{
    var count = 0;
    var arr = null;
    if (!_optional)
    {
        arr = g_ParticleSystems[_ps].emitters;
        count = arr.length;
    }
    return yyGetRef(_arg, REFID_PART_EMITTER, count, arr, _optional);
}

function GetParticleTypeIndex(_arg, _optional)
{
    return yyGetRef(_arg, REFID_PART_TYPE, g_ParticleTypes.length, g_ParticleTypes, _optional);
}

function GetSpriteIndex(_arg)
{
    var index = yyGetInt32(_arg);
    if (g_pSpriteManager.Get(index) == null)
        yyError("invalid reference to sprite");
    return index;
}

function GetTimeSourceUnit(arg)
{
    var unit = yyGetInt32(arg);
    if (unit < 0 || unit > 1)
        yyError("invalid argument, expecting a time source unit");
    return unit;
}

function GetLayer(_layerID)
{
    var layerIsString = (typeof _layerID == "string");
    var room = g_pLayerManager.GetTargetRoomObj();
    var layer = layerIsString
        ? g_pLayerManager.GetLayerFromName(room, yyGetString(_layerID))
        : g_pLayerManager.GetLayerFromID(room, yyGetInt32(_layerID));

    if (!layer)
    {
        if (layerIsString)
            yyError("invalid argument, layer name (" + _layerID + ") does not exist");
        else
            yyError("invalid argument, layer ID (" + _layerID + ") does not exist");
    }

    return layer;
}

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
    var pPSI = undefined;
    var emitters = [];

    if (_ind instanceof YYRef
        && _ind.type == REFID_PART_SYSTEM)
    {
        // Particle system INSTANCE
        _ind = GetParticleSystemInstanceIndex(_ind);
        var pPS = g_ParticleSystems[_ind];
        if (pPS != null)
        {
            pPSI = new GMLObject();

            var resource = CParticleSystem.Get(pPS.m_resourceID);

            variable_struct_set(pPSI, "name", resource ? resource.name : "");
            variable_struct_set(pPSI, "xorigin", pPS.xdraw);
            variable_struct_set(pPSI, "yorigin", pPS.ydraw);
            variable_struct_set(pPSI, "oldtonew", pPS.oldtonew ? true : false);
            variable_struct_set(pPSI, "global_space", pPS.globalSpaceParticles);

            for (var i = 0; i < pPS.emitters.length; ++i)
            {
                var emitter = pPS.emitters[i];
                if (emitter)
                {
                    emitters.push(emitter);
                }
            }
        }
    }
    else
    {
        // Particle system RESOURCE
        _ind = GetParticleSystemResourceIndex(_ind);
        var pPS = CParticleSystem.Get(_ind);
        if (pPS != null)
        {
            pPSI = new GMLObject();

            variable_struct_set(pPSI, "name", pPS.name);
            variable_struct_set(pPSI, "xorigin", pPS.originX);
            variable_struct_set(pPSI, "yorigin", pPS.originY);
            variable_struct_set(pPSI, "oldtonew", (pPS.drawOrder == 0));
            variable_struct_set(pPSI, "global_space", pPS.globalSpaceParticles);

            for (var i = 0; i < pPS.emitters.length; ++i)
            {
                var emitter = g_PSEmitters[pPS.emitters[i]];
                if (emitter)
                {
                    emitters.push(emitter);
                }
            }
        }
    }

    if (!pPSI)
    {
        return pPSI;
    }

    var emittersArray = [];
    for (var i = 0; i < emitters.length; ++i)
    {
        var emitter = emitters[i];
        var pEmitterI = new GMLObject();

        variable_struct_set(pEmitterI, "name", emitter.name);
        variable_struct_set(pEmitterI, "mode", emitter.mode);
        variable_struct_set(pEmitterI, "number", emitter.number);
        variable_struct_set(pEmitterI, "delay_min", emitter.delayMin);
        variable_struct_set(pEmitterI, "delay_max", emitter.delayMax);
        variable_struct_set(pEmitterI, "delay_unit", emitter.delayUnit);
        variable_struct_set(pEmitterI, "interval_min", emitter.intervalMin);
        variable_struct_set(pEmitterI, "interval_max", emitter.intervalMax);
        variable_struct_set(pEmitterI, "interval_unit", emitter.intervalUnit);
        variable_struct_set(pEmitterI, "relative", emitter.relative);
        variable_struct_set(pEmitterI, "xmin", emitter.xmin);
        variable_struct_set(pEmitterI, "xmax", emitter.xmax);
        variable_struct_set(pEmitterI, "ymin", emitter.ymin);
        variable_struct_set(pEmitterI, "ymax", emitter.ymax);
        variable_struct_set(pEmitterI, "distribution", emitter.posdistr);
        variable_struct_set(pEmitterI, "shape", emitter.shape);
        variable_struct_set(pEmitterI, "enabled", emitter.enabled);

        var pPartTypeI = new GMLObject();
        var particleType = g_ParticleTypes[emitter.parttype];

        variable_struct_set(pPartTypeI, "ind", emitter.parttype);
        variable_struct_set(pPartTypeI, "sprite", particleType.sprite);
        variable_struct_set(pPartTypeI, "frame", particleType.spritestart);
        variable_struct_set(pPartTypeI, "animate", particleType.spriteanim);
        variable_struct_set(pPartTypeI, "stretch", particleType.spritestretch);
        variable_struct_set(pPartTypeI, "random", particleType.spriterandom);
        variable_struct_set(pPartTypeI, "shape", particleType.shape);
        variable_struct_set(pPartTypeI, "size_xmin", particleType.sizeMinX);
        variable_struct_set(pPartTypeI, "size_xmax", particleType.sizeMaxX);
        variable_struct_set(pPartTypeI, "size_ymin", particleType.sizeMinY);
        variable_struct_set(pPartTypeI, "size_ymax", particleType.sizeMaxY);
        variable_struct_set(pPartTypeI, "size_xincr", particleType.sizeIncrX);
        variable_struct_set(pPartTypeI, "size_yincr", particleType.sizeIncrY);
        variable_struct_set(pPartTypeI, "size_xwiggle", particleType.sizeRandX);
        variable_struct_set(pPartTypeI, "size_ywiggle", particleType.sizeRandY);
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
function part_system_create(_partsys)
{
    var id = -1;

    if (_partsys === undefined)
    {
        id = ParticleSystem_Create();
    }
    else
    {
        _partsys = GetParticleSystemResourceIndex(_partsys);
        var _system = CParticleSystem.Get(_partsys);
        if (_system != null)
        {
            id = _system.MakeInstance();
        }
    }

    return MAKE_REF(REFID_PART_SYSTEM, (id != -1) ? id : 0xffffffff);
}

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
function part_system_destroy(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind, true);
    return ParticleSystem_Destroy(_ind);
}

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
function part_system_exists(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind, true);
    return ParticleSystem_Exists(_ind);
}

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
function part_system_clear(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Clear(_ind, true);
}

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
function part_system_draw_order(_ind, _oldtonew)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_DrawOrder(_ind, _oldtonew);
}

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
function part_system_depth(_ind, _depth)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Depth(_ind, _depth);
}

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
function part_system_color(_ind, _color, _alpha)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Color(_ind, _color, _alpha);
}

var part_system_colour = part_system_color;

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
function part_system_position(_ind, _x, _y)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Position(_ind, _x, _y);
}

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
function part_system_angle(_ind, _angle)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Angle(_ind, _angle);
}

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
function part_system_automatic_update(_ind, _automatic)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_AutomaticUpdate(_ind, _automatic);
}


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
function part_system_automatic_draw(_ind, _automatic)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_AutomaticDraw(_ind, _automatic);
}

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
function part_system_update(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Update(_ind);
}


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
function part_system_drawit(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Draw(_ind);
}


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
function part_particles_create(_ind, _x, _y, _parttype, _number)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    _parttype = GetParticleTypeIndex(_parttype);
    return ParticleSystem_Particles_Create(_ind, _x, _y, _parttype, _number);
}

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
function part_particles_create_color(_ind, _x, _y, _parttype, _color, _number)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    _parttype = GetParticleTypeIndex(_parttype);
    return ParticleSystem_Particles_Create_Color(_ind, _x, _y, _parttype, _color, _number);
}

var part_particles_create_colour = part_particles_create_color;

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
function part_particles_burst(_ind, _x, _y, _partsys)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    _partsys = GetParticleSystemResourceIndex(_partsys);
    return ParticleSystem_Particles_Burst(_ind, _x, _y, _partsys);
}

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
function part_particles_clear(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Particles_Clear(_ind);
}


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
function part_particles_count(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_Particles_Count(_ind);
}


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
function part_type_create()
{
    return MAKE_REF(REFID_PART_TYPE, ParticleType_Create());
};

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
function part_type_destroy(_ind)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Destroy(_ind);
}

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
function part_type_exists(_ind)
{
    _ind = GetParticleTypeIndex(_ind, true);
    return ParticleType_Exists(_ind);
}

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
function part_type_clear(_ind)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Clear(_ind);
}

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
function part_type_shape(_ind, _shape)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Shape(_ind, _shape);
}

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
function part_type_sprite(_ind, _sprite, _animate, _stretch, _random)
{
    _ind = GetParticleTypeIndex(_ind);
    _sprite = GetSpriteIndex(_sprite);
    return ParticleType_Sprite(_ind, _sprite, _animate, _stretch, _random);
}

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
function part_type_subimage(_ind, _subimg)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Subimage(_ind, _subimg);
}

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
function part_type_size(_ind, _size_min, _size_max, _size_incr, _size_wiggle)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Size(_ind, _size_min, _size_max, _size_incr, _size_wiggle);
}

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
function part_type_size_x(_ind, _size_min, _size_max, _size_incr, _size_wiggle)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Size_X(_ind, _size_min, _size_max, _size_incr, _size_wiggle);
}

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
function part_type_size_y(_ind, _size_min, _size_max, _size_incr, _size_wiggle)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Size_Y(_ind, _size_min, _size_max, _size_incr, _size_wiggle);
}

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
function part_type_scale(_ind, _xscale, _yscale)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Scale(_ind, _xscale, _yscale);
}

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
function part_type_blend(_ind, _additive)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Blend(_ind, _additive);
}

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
function part_type_color1(_ind, _color1)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Color1(_ind, _color1);
}

var part_type_colour1 = part_type_color1;

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
function part_type_color2(_ind, _color1, _color2)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Color2(_ind, _color1, _color2);
}

var part_type_colour2 = part_type_color2;

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
function part_type_color3(_ind, _color1, _color2, _color3)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Color3(_ind, _color1, _color2, _color3);
}

var part_type_colour3 = part_type_color3;
var part_type_color = part_type_color3; // for compatability reasons :S
var part_type_colour = part_type_color3; // for compatability reasons :S

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
function part_type_color_mix(_ind, _color1, _color2)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Colour_Mix(_ind, _color1, _color2);
}

var part_type_colour_mix = part_type_color_mix;

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
function part_type_color_rgb(_ind, _rmin, _rmax, _gmin, _gmax, _bmin, _bmax)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Colour_RGB(_ind, _rmin, _rmax, _gmin, _gmax, _bmin, _bmax);
}

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
function part_type_color_hsv(_ind, _hmin, _hmax, _smin, _smax, _vmin, _vmax)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Colour_HSV(_ind, _hmin, _hmax, _smin, _smax, _vmin, _vmax);
}

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
function part_type_alpha1(_ind, _alpha1)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Alpha1(_ind, _alpha1);
}

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
function part_type_alpha2(_ind, _alpha1, _alpha2)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Alpha2(_ind, _alpha1, _alpha2);
}

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
function part_type_alpha3(_ind, _alpha1, _alpha2, _alpha3)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Alpha3(_ind, _alpha1, _alpha2, _alpha3);
}

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
function part_type_life(_ind, _life_min, _life_max)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Life(_ind, _life_min, _life_max);
}

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
function part_type_step(_ind, _step_number, _step_type)
{
    _ind = GetParticleTypeIndex(_ind);
    _step_type = GetParticleTypeIndex(_step_type, true);
    return ParticleType_Step(_ind, _step_number, _step_type);
}


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
function part_type_death(_ind, _death_number, _death_type)
{
    _ind = GetParticleTypeIndex(_ind);
    _death_type = GetParticleTypeIndex(_death_type, true);
    return ParticleType_Death(_ind, _death_number, _death_type);
}

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
function part_type_orientation(_ind, _ang_min, _ang_max, _ang_incr, _ang_wiggle, _ang_relative)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Orientation(_ind, _ang_min, _ang_max, _ang_incr, _ang_wiggle, _ang_relative);
}

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
function part_type_speed(_ind, _speed_min, _speed_max, _speed_incr, _speed_wiggle)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Speed(_ind, _speed_min, _speed_max, _speed_incr, _speed_wiggle);
}

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
function part_type_direction(_ind, _dir_min, _dir_max, _dir_incr, _dir_wiggle)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Direction(_ind, _dir_min, _dir_max, _dir_incr, _dir_wiggle);
}

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
function part_type_gravity(_ind, _grav_amount, _grav_dir)
{
    _ind = GetParticleTypeIndex(_ind);
    return ParticleType_Gravity(_ind, _grav_amount, _grav_dir);
}



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
function part_emitter_create(_ps)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    return MAKE_REF(REFID_PART_EMITTER, ParticleSystem_Emitter_Create(_ps));
}

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
function part_emitter_destroy(_ps, _ind)
{
    _ps = GetParticleSystemInstanceIndex(_ps, true);
    _ind = GetParticleEmitterIndex(_ps, _ind, true);
    return ParticleSystem_Emitter_Destroy(_ps, _ind);
}

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
function part_emitter_destroy_all(_ps)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    return ParticleSystem_Emitter_DestroyAll(_ps);
}

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
function part_emitter_enable(_ps, _ind, _enable)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    return ParticleSystem_Emitter_Enable(_ps, _ind, _enable);
}

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
function part_emitter_exists(_ps, _ind)
{
    _ps = GetParticleSystemInstanceIndex(_ps, true);
    _ind = GetParticleEmitterIndex(_ps, _ind, true);
    return ParticleSystem_Emitter_Exists(_ps, _ind);
}

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
function part_emitter_clear(_ps, _ind)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    return ParticleSystem_Emitter_Clear(_ps, _ind);
}

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
function part_emitter_region(_ps, _ind, _xmin, _xmax, _ymin, _ymax, _shape, _distribution)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    return ParticleSystem_Emitter_Region(_ps, _ind, _xmin, _xmax, _ymin, _ymax, _shape, _distribution);
}

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
function part_emitter_burst(_ps, _ind, _parttype, _number)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    _parttype = GetParticleTypeIndex(_parttype);
    return ParticleSystem_Emitter_Burst(_ps, _ind, _parttype, _number);
}

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
function part_emitter_stream(_ps, _ind, _parttype, _number)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    _parttype = GetParticleTypeIndex(_parttype);
    return ParticleSystem_Emitter_Stream(_ps, _ind, _parttype, _number);
}

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
function part_emitter_delay(_ps, _ind, _delay_min, _delay_max, _delay_unit)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    _delay_unit = GetTimeSourceUnit(_delay_unit);
    return ParticleSystem_Emitter_Delay(_ps, _ind, _delay_min, _delay_max, _delay_unit);
}

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
function part_emitter_interval(_ps, _ind, _interval_min, _interval_max, _interval_unit)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    _interval_unit = GetTimeSourceUnit(_interval_unit);
    return ParticleSystem_Emitter_Interval(_ps, _ind, _interval_min, _interval_max, _interval_unit);
}

// #############################################################################################
/// Function:<summary>
///          	Enable or disable relative/density based mode.
///          </summary>
///
/// In:		<param name="_ps"></param>
///			<param name="_ind"></param>
///			<param name="_enable"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function part_emitter_relative(_ps, _ind, _enable)
{
    _ps = GetParticleSystemInstanceIndex(_ps);
    _ind = GetParticleEmitterIndex(_ps, _ind);
    return ParticleSystem_Emitter_Relative(_ps, _ind, _enable);
}

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
function effect_create_below(_kind, _x, _y, _size, _color)
{
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
function effect_create_above(_kind, _x, _y, _size, _color)
{
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
function effect_create_layer(_layerid, _kind, _x, _y, _size, _color)
{
	var layer = GetLayer(_layerid);

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
function effect_create_depth(_depth, _kind, _x, _y, _size, _color)
{
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
    var id = -1;
    var layer = GetLayer(_layerid);
    _persistent = (_persistent !== undefined) ? yyGetBool(_persistent) : false;

    if (_partsys === undefined)
    {
        id = ParticleSystem_Create(layer.m_id, _persistent);
    }
    else
    {
        _partsys = GetParticleSystemResourceIndex(_partsys);
        var _system = CParticleSystem.Get(_partsys);
        if (_system != null)
        {
            id = _system.MakeInstance(layer.m_id, _persistent);
        }
    }

    return MAKE_REF(REFID_PART_SYSTEM, (id != -1) ? id : 0xffffffff);
}

function part_system_get_layer(_ind)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_GetLayer(_ind);
}

function part_system_layer(_ind, _layerid)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    var layer = GetLayer(_layerid);

    return ParticleSystem_Layer(_ind, layer.m_id);
}

function part_system_global_space(_ind, _enable)
{
    _ind = GetParticleSystemInstanceIndex(_ind);
    return ParticleSystem_GlobalSpace(_ind, _enable);
}
