// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Physics.js
// Created:			01/06/2011
// Author:			Chris
// Project:			HTML5
// Description:		Physics Functions
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 15/02/2012		1.0         CPH     1st version
// 
// **********************************************************************************************************************
var g_physicsFixtures = new yyAllocate();
var g_physicsObjects = new yyAllocate();
var g_physicsJoints = new yyAllocate();

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_world_create(_pixelToMetreScale) {
    
    _pixelToMetreScale = yyGetReal(_pixelToMetreScale);

    if (g_RunRoom.m_pPhysicsWorld) {
    
        g_RunRoom.m_pPhysicsWorld.SetPixelToMetreScale(_pixelToMetreScale);
        if(g_isZeus)
        {
		    g_RunRoom.m_pPhysicsWorld.SetUpdateSpeed(g_GameTimer.GetFPS());
		}
		else
		{
		    g_RunRoom.m_pPhysicsWorld.SetUpdateSpeed(g_RunRoom.GetSpeed());
		}
    }
    else {
        if(g_isZeus)
        {
            var physicsWorld = new yyPhysicsWorld(_pixelToMetreScale, g_GameTimer.GetFPS());
            g_RunRoom.m_pPhysicsWorld = physicsWorld;	
        }
        else
        {
            var physicsWorld = new yyPhysicsWorld(_pixelToMetreScale, g_RunRoom.GetSpeed());
            g_RunRoom.m_pPhysicsWorld = physicsWorld;	
        }
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_world_draw_debug(_flags) {

    g_RunRoom.m_pPhysicsWorld.DebugRender(yyGetInt32(_flags));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_world_gravity(_gx, _gy) {
    
    g_RunRoom.m_pPhysicsWorld.SetGravity(yyGetReal(_gx), yyGetReal(_gy));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_world_update_speed(_speed) {
    
    g_RunRoom.m_pPhysicsWorld.SetUpdateSpeed(yyGetInt32(_speed));	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_world_update_iterations(_iterations) {
    
    g_RunRoom.m_pPhysicsWorld.SetUpdateIterations(yyGetInt32(_iterations));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_pause_enable(_pause) {

    if (yyGetBool(_pause)) {        
        g_RunRoom.m_pPhysicsWorld.Pause();
    }
    else {        
        g_RunRoom.m_pPhysicsWorld.Resume();
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_create() {

    //var fixtureID = g_physicsFixtures.Add(new yyPhysicsFixture(fixtureID));
    var fixtureID = g_physicsFixtures.Add(new yyPhysicsFixture());
    return fixtureID;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_kinematic(_fixtureID) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetKinematic();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_density(_fixtureID, _density) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetDensity(yyGetReal(_density));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_restitution(_fixtureID, _restitution) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetRestitution(yyGetReal(_restitution));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_friction(_fixtureID, _friction) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetFriction(yyGetReal(_friction));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_collision_group(_fixtureID, _group) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetCollisionGroup(yyGetInt32(_group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_sensor(_fixtureID, _sensorState) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetSensor(yyGetBool(_sensorState));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_linear_damping(_fixtureID, _damping) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetLinearDamping(yyGetReal(_damping));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_angular_damping(_fixtureID, _damping) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetAngularDamping(yyGetReal(_damping));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_awake(_fixtureID, _awake) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetAwake(yyGetInt32(_awake));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_circle_shape(_fixtureID, _circleRadius) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetCircleShape(yyGetReal(_circleRadius) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_box_shape(_fixtureID, _halfWidth, _halfHeight) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    fixture.SetBoxShape(yyGetReal(_halfWidth) * scale, yyGetReal(_halfHeight) * scale);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_edge_shape(_fixtureID, v1x, v1y, v2x, v2y) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    fixture.SetEdgeShape(yyGetReal(v1x) * scale, yyGetReal(v1y) * scale, yyGetReal(v2x) * scale, yyGetReal(v2y) * scale);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_polygon_shape(_fixtureID) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetPolygonShape();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_set_chain_shape(_fixtureID, _loop) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    fixture.SetChainShape(yyGetBool(_loop));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_add_point(_fixtureID, _local_x, _local_y) {

    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    fixture.AddShapePoint(yyGetReal(_local_x) * scale, yyGetReal(_local_y) * scale);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_bind_ext(_inst, _fixtureID, _id, _xo, _yo) {

    _xo = yyGetReal(_xo);
    _yo = yyGetReal(_yo);

    var fixtureIndex = -1;
    var _error_code = -1;
    var fixture = g_physicsFixtures.Get(yyGetInt32(_fixtureID));
    var _obj = yyGetInt32(_id);
    if (_obj == OBJECT_SELF) {
        _obj = _inst.id;
    }
    
    if (_obj == OBJECT_ALL) 
    {
        var pool = g_pInstanceManager.GetPool();
        for (var inst = 0; inst < pool.length; inst++)
        {
        	var pInst = pool[inst];        	
        	if (pInst.marked) continue;
        	
        	fixtureIndex = g_RunRoom.m_pPhysicsWorld.CreateBody(fixture, pInst, _xo, _yo, false);
        }
    }
    else if(_obj < 100000)
    {
        // Get the object we want to collide with
        var pObj = g_pObjectManager.Get(_obj);
        if (pObj === null)  {
            return _error_code;
        }
        
        // Now get all the objects instances, including inherited.
        var pool = pObj.GetRPool();
        for (var inst = 0; inst < pool.length;inst++ )
        {
        	var pInst = pool[inst];        	
        	if (pInst.marked) continue;
        	
        	fixtureIndex = g_RunRoom.m_pPhysicsWorld.CreateBody(fixture, pInst, _xo, _yo, false);
        }
    }
    else
    {
        var pInst = g_pInstanceManager.Get(_obj);        
        fixtureIndex = g_RunRoom.m_pPhysicsWorld.CreateBody(fixture, pInst, _xo, _yo, false);
    }	          
    return fixtureIndex;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_bind(_inst, _fixtureID, _id, _xoffs, _yoffs)
{
    _fixtureID = yyGetInt32(_fixtureID);
    _id = yyGetInt32(_id);

    if (_xoffs !== undefined && _yoffs !== undefined) {
        return physics_fixture_bind_ext(_inst, _fixtureID, _id, yyGetReal(_xoffs), yyGetReal(_yoffs));
    }
    else {
        return physics_fixture_bind_ext(_inst, _fixtureID, _id, 0.0, 0.0);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_fixture_delete(_fixtureID) {

    g_physicsFixtures.DeleteIndex(yyGetInt32(_fixtureID));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_distance_create(_inst1, _inst2, _world_anchor_1_x, _world_anchor_1_y, _world_anchor_2_x, _world_anchor_2_y, _collideInstances) {
    
    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));	
    
    var joint = g_RunRoom.m_pPhysicsWorld.CreateDistanceJoint(
        objA.m_physicsObject,
		objB.m_physicsObject,
		yyGetReal(_world_anchor_1_x), yyGetReal(_world_anchor_1_y),
		yyGetReal(_world_anchor_2_x), yyGetReal(_world_anchor_2_y),
		yyGetBool(_collideInstances));
	
	if (joint != -1) {	
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_rope_create(_inst1, _inst2, _world_anchor_1_x, _world_anchor_1_y, _world_anchor_2_x, _world_anchor_2_y, _maxLength, _collideInstances) {

    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
    
    var joint = g_RunRoom.m_pPhysicsWorld.CreateRopeJoint(
        objA.m_physicsObject,
		objB.m_physicsObject,
		yyGetReal(_world_anchor_1_x), yyGetReal(_world_anchor_1_y),
		yyGetReal(_world_anchor_2_x), yyGetReal(_world_anchor_2_y),
		yyGetReal(_maxLength),
		yyGetBool(_collideInstances));
	
	if (joint != -1) {	
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_revolute_create(_inst1, _inst2, _world_anchor_x, _world_anchor_y, _lower_angle_limit, _upper_angle_limit, _enable_limit, _max_motor_torque, _motor_speed, _enable_motor, _collideInstances) {

    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
    
	var joint = g_RunRoom.m_pPhysicsWorld.CreateRevoluteJoint(
	    objA.m_physicsObject,
		objB.m_physicsObject,
		yyGetReal(_world_anchor_x), yyGetReal(_world_anchor_y),
		(yyGetReal(_lower_angle_limit) * Math.PI) / 180.0,	
		(yyGetReal(_upper_angle_limit) * Math.PI) / 180.0,
		yyGetBool(_enable_limit),
		yyGetReal(_max_motor_torque),
		yyGetReal(_motor_speed),
		yyGetBool(_enable_motor),
		yyGetBool(_collideInstances));
		
	if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_prismatic_create(_inst1, _inst2, _world_anchor_x, _world_anchor_y, _world_axis_x, _world_axis_y, _lower_translation_limit, _upper_translation_limit, _enable_limit, _max_motor_force, _motor_speed, _enable_motor, _collideInstances) {

    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
        
	var joint = g_RunRoom.m_pPhysicsWorld.CreatePrismaticJoint(
		objA.m_physicsObject,
		objB.m_physicsObject,
		yyGetReal(_world_anchor_x), yyGetReal(_world_anchor_y),
		yyGetReal(_world_axis_x), yyGetReal(_world_axis_y),
		yyGetReal(_lower_translation_limit),
		yyGetReal(_upper_translation_limit),
		yyGetBool(_enable_limit),
		yyGetReal(_max_motor_force),
		yyGetReal(_motor_speed),
		yyGetBool(_enable_motor),
		yyGetBool(_collideInstances));
   
	if (joint != -1) {
	    return g_physicsJoints.Add(joint);	    
	}	
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_pulley_create(_inst1, _inst2, _world_anchor_1_x, _world_anchor_1_y, _world_anchor_2_x, _world_anchor_2_y, _local_anchor_1_x, _local_anchor_1_y, _local_anchor_2_x, _local_anchor_2_y, _ratio, _collideInstances) {

    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
	var joint = g_RunRoom.m_pPhysicsWorld.CreatePulleyJoint(
		objA.m_physicsObject,
		objB.m_physicsObject, 
		yyGetReal(_world_anchor_1_x), yyGetReal(_world_anchor_1_y),
		yyGetReal(_world_anchor_2_x), yyGetReal(_world_anchor_2_y),
        yyGetReal(_local_anchor_1_x), yyGetReal(_local_anchor_1_y),
        yyGetReal(_local_anchor_2_x), yyGetReal(_local_anchor_2_y),
		yyGetReal(_ratio),
		yyGetBool(_collideInstances));
				
    if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_wheel_create(
    _inst1, _inst2, _anchor_x, _anchor_y, _axis_x, _axis_y, _enableMotor, _max_motor_torque, _motor_speed, _freq_hz, _damping_ratio, _collideInstances) 
{
    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
	var joint = g_RunRoom.m_pPhysicsWorld.CreateWheelJoint(
		objA.m_physicsObject,
		objB.m_physicsObject, 
		yyGetReal(_anchor_x), yyGetReal(_anchor_y),
		yyGetReal(_axis_x), yyGetReal(_axis_y),
		yyGetBool(_enableMotor),
		yyGetReal(_max_motor_torque),
		yyGetReal(_motor_speed),
		yyGetReal(_freq_hz),
		yyGetReal(_damping_ratio),
		yyGetBool(_collideInstances));
				
    if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_weld_create(_inst1, _inst2, _anchor_x, _anchor_y, _ref_angle, _freq_hz, _damping_ratio, _collideInstances) 
{
    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
	var joint = g_RunRoom.m_pPhysicsWorld.CreateWeldJoint(
		objA.m_physicsObject,
		objB.m_physicsObject, 
		yyGetReal(_anchor_x), yyGetReal(_anchor_y),
		yyGetReal(_ref_angle),
		yyGetReal(_freq_hz),
		yyGetReal(_damping_ratio),
		yyGetBool(_collideInstances));
				
    if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_friction_create(_inst1, _inst2, _anchor_x, _anchor_y, _max_force, _max_torque, _collideInstances) 
{
    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));
	var joint = g_RunRoom.m_pPhysicsWorld.CreateFrictionJoint(
		objA.m_physicsObject,
		objB.m_physicsObject, 
		yyGetReal(_anchor_x), yyGetReal(_anchor_y),
		yyGetReal(_max_force),
		yyGetReal(_max_torque),		
		yyGetBool(_collideInstances));
				
    if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_gear_create(_inst1, _inst2, _joint1, _joint2, _ratio) {

    var objA = g_pInstanceManager.Get(yyGetInt32(_inst1));
    var objB = g_pInstanceManager.Get(yyGetInt32(_inst2));

    var jointA = g_physicsJoints.Get(yyGetInt32(_joint1));
    var jointB = g_physicsJoints.Get(yyGetInt32(_joint2));

    if(jointA == null || jointB == null)
    {
        yyError( "A joint does not exist" );
        return;
    }
	
	var joint = g_RunRoom.m_pPhysicsWorld.CreateGearJoint(objA.m_physicsObject, objB.m_physicsObject, jointA, jointB, yyGetReal(_ratio));
	
	if (joint != -1) {
	    return g_physicsJoints.Add(joint);
	}
	return -1;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_enable_motor(_joint, _motorState) {

    var physicsJoint = g_physicsJoints.Get(yyGetInt32(_joint));
    if(physicsJoint == null)
    {
        yyError( "A joint does not exist" );
        return;
    }
    physicsJoint.EnableMotor(yyGetBool(_motorState));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_get_value(_joint, _field) {

    var physicsJoint = g_physicsJoints.Get(yyGetInt32(_joint));
    if(physicsJoint == null)
    {
        yyError( "A joint does not exist" );
        return;
    }
    return physicsJoint.GetValue(yyGetInt32(_field));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_set_value(_joint, _field, _value) {

    var physicsJoint = g_physicsJoints.Get(yyGetInt32(_joint));
    if(physicsJoint == null)
    {
        yyError( "A joint does not exist" );
        return;
    }
    return physicsJoint.SetValue(yyGetInt32(_field), yyGetReal(_value));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_joint_delete(_jointID) {

    _jointID = yyGetInt32(_jointID);
    var physicsJoint = g_physicsJoints.Get(_jointID);
    if(physicsJoint != null)
    {
        g_RunRoom.m_pPhysicsWorld.DestroyJoint(physicsJoint);
    }
    g_physicsJoints.DeleteIndex(_jointID);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_force(_pInst, _xpos, _ypos, _xforce, _yforce) {

    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;		
	var worldSpaceX = yyGetReal(_xpos) * scale;
	var worldSpaceY = yyGetReal(_ypos) * scale;	
	_pInst.m_physicsObject.ApplyForce(worldSpaceX, worldSpaceY, yyGetReal(_xforce), yyGetReal(_yforce));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_impulse(_pInst, _xpos, _ypos, _ximpulse, _yimpulse) {

    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;		
	var worldSpaceX = yyGetReal(_xpos) * scale;
	var worldSpaceY = yyGetReal(_ypos) * scale;	
	_pInst.m_physicsObject.ApplyImpulse(worldSpaceX, worldSpaceY, yyGetReal(_ximpulse), yyGetReal(_yimpulse));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_local_force(_pInst, _xlocal, _ylocal, _xforce_local, _yforce_local) {

    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;		
	var localSpaceX = yyGetReal(_xlocal) * scale;
	var localSpaceY = yyGetReal(_ylocal) * scale;	
	_pInst.m_physicsObject.ApplyLocalForce(localSpaceX, localSpaceY, yyGetReal(_xforce_local), yyGetReal(_yforce_local));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_local_impulse(_pInst, _xlocal, _ylocal, _ximpulse_local, _yimpulse_local) {

    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    var localSpaceX = yyGetReal(_xlocal) * scale;
    var localSpaceY = yyGetReal(_ylocal) * scale;	
    _pInst.m_physicsObject.ApplyLocalImpulse(localSpaceX, localSpaceY, yyGetReal(_ximpulse_local), yyGetReal(_yimpulse_local));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_angular_impulse(_pInst, _impulse) {

    _pInst.m_physicsObject.ApplyAngularImpulse(yyGetReal(_impulse));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_apply_torque(_pInst, _torque) {
       	
    _pInst.m_physicsObject.ApplyTorque(yyGetReal(_torque));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_mass_properties(_pInst, _mass, _local_centre_of_mass_x, _local_centre_of_mass_y, _inertia) {

    var scale = g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    _pInst.m_physicsObject.SetMass(yyGetReal(_mass), yyGetReal(_local_centre_of_mass_x) * scale, yyGetReal(_local_centre_of_mass_y) * scale, yyGetReal(_inertia));    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_draw_debug(_pInst) {

    if ((_pInst.m_physicsObject != null) && (_pInst.m_physicsObject != undefined)) {
        _pInst.m_physicsObject.DebugRender(1.0 / g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale);
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_test_overlap(_inst, _x, _y, _angle, _obj) {
    
    _obj = yyGetInt32(_obj);

    var _pInst = _inst; //???
    // Note sure why someone would want to try this, but whatever
    if (_obj == OBJECT_SELF) {
        _obj = _pInst.id;
    }
    
    var x = yyGetReal(_x) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    var y = yyGetReal(_y) * g_RunRoom.m_pPhysicsWorld.m_pixelToMetreScale;
    var angle = (yyGetReal(_angle) * Math.PI) / 180.0;
    if (_obj == OBJECT_ALL) 
    {
        var pool = g_pInstanceManager.GetPool();
        for (var inst = 0; inst < pool.length; inst++)
        {
        	var pInst = pool[inst];
        	if (pInst.marked) continue;
        	
        	if (g_RunRoom.m_pPhysicsWorld.TestOverlap(_inst, pInst, x, y, angle)) {
        	    return true;
        	}
        }
    }
    else if(_obj < 100000)
    {
        // Get the object we want to collide with
        var pObj = g_pObjectManager.Get(_obj);
        if (pObj === null)  {
            return false;
        }
        
        // Now get all the objects instances, including inherited.
        var pool = pObj.GetRPool();
        for (var inst = 0; inst < pool.length;inst++ )
        {
        	var pInst = pool[inst];        	
        	if (pInst.marked) continue;
        	
        	if (g_RunRoom.m_pPhysicsWorld.TestOverlap(_inst, pInst, x, y, angle)) {
        	    return true;
        	}
        }
    }
    else
    {
        var pInst = g_pInstanceManager.Get(_obj);        
        return g_RunRoom.m_pPhysicsWorld.TestOverlap(_inst, pInst, x, y, angle);        	
    }	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_remove_fixture(_inst, _fixtureIndex) {

    _fixtureIndex = yyGetInt32(_fixtureIndex);

    var _error_code = -1;
    var _obj = yyGetInt32(_inst);
    if (_obj == OBJECT_SELF) {
        _obj = _inst.id;
    }
    
    if (_obj == OBJECT_ALL) 
    {
        var pool = g_pInstanceManager.GetPool();
        for (var inst = 0; inst < pool.length; inst++)
        {
        	var pInst = pool[inst];        	
        	if (pInst.marked) continue;
        	
        	if (pInst.m_physicsObject) {
        	    pInst.m_physicsObject.RemoveFixture(_fixtureIndex);
        	}
        }
    }
    else if(_obj < 100000)
    {
        // Get the object we want to collide with
        var pObj = g_pObjectManager.Get(_obj);
        if (pObj === null)  {
            return _error_code;
        }
        
        // Now get all the objects instances, including inherited.
        var pool = pObj.GetRPool();
        for (var inst = 0; inst < pool.length;inst++ )
        {
        	var pInst = pool[inst];        	
        	if (pInst.marked) continue;
        	
        	if (pInst.m_physicsObject) {
        	    pInst.m_physicsObject.RemoveFixture(_fixtureIndex);
        	}
        }
    }
    else
    {
        var pInst = g_pInstanceManager.Get(_obj);        
        if (pInst.m_physicsObject) {
        	pInst.m_physicsObject.RemoveFixture(_fixtureIndex);
        }
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_get_friction(_inst, _fixtureIndex) {
    
    if (_inst.m_physicsObject) {
    	return _inst.m_physicsObject.GetFriction(yyGetInt32(_fixtureIndex));
    }
    return 0.0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_get_density(_inst, _fixtureIndex) {
    
    if (_inst.m_physicsObject) {
        return _inst.m_physicsObject.GetDensity(yyGetInt32(_fixtureIndex));
    }
    return 0.0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_get_restitution(_inst, _fixtureIndex) {
    
    if (_inst.m_physicsObject) {
        return _inst.m_physicsObject.GetRestitution(yyGetInt32(_fixtureIndex));
    }
    return 0.0;
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_set_friction(_inst, _fixtureIndex, _val) {
    
    if (_inst.m_physicsObject) {
        _inst.m_physicsObject.SetFriction(yyGetInt32(_fixtureIndex), yyGetReal(_val));
    }    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_set_density(_inst, _fixtureIndex, _val) {
    
    if (_inst.m_physicsObject) {
        _inst.m_physicsObject.SetDensity(yyGetInt32(_fixtureIndex), yyGetReal(_val));
    }    
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_set_restitution(_inst, _fixtureIndex, _val) {
    
    if (_inst.m_physicsObject) {
        _inst.m_physicsObject.SetRestitution(yyGetInt32(_fixtureIndex), yyGetReal(_val));
    }    
}


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_create(typeflags, x, y, xv, yv, col, alpha, category) {

    return g_RunRoom.m_pPhysicsWorld.CreateParticle(yyGetInt32(typeflags), yyGetReal(x), yyGetReal(y), yyGetReal(xv), yyGetReal(yv), yyGetInt32(col), yyGetReal(alpha), yyGetInt32(category));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_delete(ind) {

    g_RunRoom.m_pPhysicsWorld.DeleteParticle(yyGetInt32(ind));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_delete_region_circle(x, y, radius) {

    g_RunRoom.m_pPhysicsWorld.DeleteParticleCircleRegion(yyGetReal(x), yyGetReal(y), yyGetReal(radius));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_delete_region_box(x, y, halfWidth, halfHeight) {

    g_RunRoom.m_pPhysicsWorld.DeleteParticleBoxRegion(yyGetReal(x), yyGetReal(y), yyGetReal(halfWidth), yyGetReal(halfHeight));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_delete_region_poly(pointList) {

    pointList = yyGetInt32(pointList);

    var points = [];
    for (var n = 0; n < ds_list_size(pointList); n++) {
        points.push(ds_list_find_value(pointList, n));
    }
    g_RunRoom.m_pPhysicsWorld.DeleteParticlePolyRegion(points, points.length >> 1);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_begin(typeflags, groupflags, x, y, ang, xv, yv, omega, col, alpha, strength, category) {

    g_RunRoom.m_pPhysicsWorld.BeginParticleGroup(yyGetInt32(typeflags), yyGetInt32(groupflags), yyGetReal(x), yyGetReal(y), yyGetReal(ang), yyGetReal(xv), yyGetReal(yv), yyGetReal(omega), yyGetInt32(col), yyGetReal(alpha), yyGetReal(strength), yyGetInt32(category));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_circle(radius) {

    g_RunRoom.m_pPhysicsWorld.ParticleGroupCircle(yyGetReal(radius));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_box(halfWidth, halfHeight) {

    g_RunRoom.m_pPhysicsWorld.ParticleGroupBox(yyGetReal(halfWidth), yyGetReal(halfHeight));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_polygon() {

    g_RunRoom.m_pPhysicsWorld.ParticleGroupPoly();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_add_point(x, y) {

    g_RunRoom.m_pPhysicsWorld.ParticleGroupAddPoint(yyGetReal(x), yyGetReal(y));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_end() {

    return g_RunRoom.m_pPhysicsWorld.EndParticleGroup();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_join(to, from) {

    g_RunRoom.m_pPhysicsWorld.ParticleGroupJoin(yyGetInt32(to), yyGetInt32(from));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_delete(ind) {

    g_RunRoom.m_pPhysicsWorld.DeleteParticleGroup(yyGetInt32(ind));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_draw(typemask, category, sprite, subimg) {
    
    var pSpr = g_pSpriteManager.Get(yyGetInt32(sprite));
    if (pSpr !== null) {
        g_RunRoom.m_pPhysicsWorld.DrawParticles(yyGetInt32(typemask), yyGetInt32(category), pSpr, yyGetInt32(subimg));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_draw_ext(typemask, category, sprite, subimg, xscale, yscale, angle, col, alpha) {
    
    var pSpr = g_pSpriteManager.Get(yyGetInt32(sprite));
    if (pSpr !== null) {
        g_RunRoom.m_pPhysicsWorld.DrawParticlesExt(yyGetInt32(typemask), yyGetInt32(category), pSpr, yyGetInt32(subimg), yyGetReal(xscale), yyGetReal(yscale), yyGetReal(angle), yyGetInt32(col), yyGetReal(alpha));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_count() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleCount();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_data(buffer, dataFlags) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (pBuff) {
        g_RunRoom.m_pPhysicsWorld.GetParticleData(pBuff, yyGetInt32(dataFlags));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_max_count() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleMaxCount();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_radius() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleRadius();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_density() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleDensity();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_damping() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleDamping();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_gravity_scale() {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGravityScale();
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_max_count(count) {

    g_RunRoom.m_pPhysicsWorld.SetParticleMaxCount(yyGetInt32(count));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_radius(radius) {

    g_RunRoom.m_pPhysicsWorld.SetParticleRadius(yyGetReal(radius));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_density(density) {

    g_RunRoom.m_pPhysicsWorld.SetParticleDensity(yyGetReal(density));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_damping(damping) {

    g_RunRoom.m_pPhysicsWorld.SetParticleDamping(yyGetReal(damping));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_gravity_scale(scale) {

    g_RunRoom.m_pPhysicsWorld.SetParticleGravityScale(yyGetReal(scale));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_flags(_ind, _typeflags) {

    g_RunRoom.m_pPhysicsWorld.SetParticleFlags(yyGetInt32(_ind), yyGetInt32(_typeflags));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_category_flags(_category, _typeflags) {

    g_RunRoom.m_pPhysicsWorld.SetCategoryFlags(yyGetInt32(_category), yyGetInt32(_typeflags));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_set_group_flags(_group, _flags) {

    g_RunRoom.m_pPhysicsWorld.SetGroupFlags(yyGetInt32(_group), yyGetInt32(_flags));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_group_flags(_group) {

    return g_RunRoom.m_pPhysicsWorld.GetGroupFlags(yyGetInt32(_group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_get_data_particle(ind, buffer, dataFlags) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (pBuff) {
        g_RunRoom.m_pPhysicsWorld.GetParticleDataParticle(yyGetInt32(ind), pBuff, yyGetInt32(dataFlags));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_count(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupCount(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_data(group, buffer, dataFlags) {

    var pBuff = g_BufferStorage.Get(yyGetInt32(buffer));
    if (pBuff) {
        g_RunRoom.m_pPhysicsWorld.GetParticleDataGroup(yyGetInt32(group), pBuff, yyGetInt32(dataFlags));
    }
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_mass(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupMass(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_inertia(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupInertia(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_centre_x(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupCentreX(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_centre_y(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupCentreY(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_vel_x(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupVelocityX(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_vel_y(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupVelocityY(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_ang_vel(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupOmega(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_x(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupX(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_y(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupY(yyGetInt32(group));
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function physics_particle_group_get_angle(group) {

    return g_RunRoom.m_pPhysicsWorld.GetParticleGroupAngle(yyGetInt32(group));
}