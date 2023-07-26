// **********************************************************************************************************************
// 
// Copyright (c)2012, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyPhysicsWorld.js
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
var PHYSICS_DEFAULT_UPDATE_ITERATIONS = 10,    
    PHYSICS_COLLISION_CATEGORIES = 32,
    PHYSICS_DEBUG_RENDER_SHAPE = (1 << 0),
    PHYSICS_DEBUG_RENDER_JOINT = (1 << 1),
    PHYSICS_DEBUG_RENDER_COM = (1 << 2),
    PHYSICS_DEBUG_RENDER_AABB = (1 << 3),
    PHYSICS_DEBUG_RENDER_OBB = (1 << 4),
    PHYSICS_DEBUG_RENDER_CORE_SHAPE = (1 << 5),
    PHYSICS_DEBUG_RENDER_PAIRS = (1 << 6); // broad phase collision pairs
    
var yyBox2D = null;

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function enumerateBox2D() {

    if (yyBox2D === null) 
    {                            
        var b2 = window["b2"];
        yyBox2D = {};
        yyBox2D.version = b2["version"];
        yyBox2D.Vec2 = b2["Vec2"];
        yyBox2D.Vec3 = b2["Vec3"];
        yyBox2D.Mat22 = b2["Mat22"];
        yyBox2D.Mat33 = b2["Mat33"];
        yyBox2D.Rot = b2["Rot"];
        yyBox2D.Transform = b2["Transform"];
        yyBox2D.Sweep = b2["Sweep"];
        yyBox2D.Dot_v2_v2 = b2["Dot_v2_v2"];
        yyBox2D.Cross_v2_v2 = b2["Cross_v2_v2"];
        yyBox2D.Cross_v2_f = b2["Cross_v2_f"];
        yyBox2D.Cross_f_v2 = b2["Cross_f_v2"];
        yyBox2D.Mul_m22_v2 = b2["Mul_m22_v2"];
        yyBox2D.MulT_m22_v2 = b2["MulT_m22_v2"];
        yyBox2D.Distance = b2["Distance"];
        yyBox2D.DistanceSquared = b2["DistanceSquared"];
        yyBox2D.Dot_v3_v3 = b2["Dot_v3_v3"];
        yyBox2D.Cross_v3_v3 = b2["Cross_v3_v3"];
        yyBox2D.Mul_m22_m22 = b2["Mul_m22_m22"];
        yyBox2D.MulT_m22_m22 = b2["MulT_m22_m22"];
        yyBox2D.Mul_m33_v3 = b2["Mul_m33_v3"];
        yyBox2D.Mul22_m33_v2 = b2["Mul22_m33_v2"];
        yyBox2D.Mul_r_r = b2["Mul_r_r"];
        yyBox2D.MulT_r_r = b2["MulT_r_r"];
        yyBox2D.Mul_r_v2 = b2["Mul_r_v2"];
        yyBox2D.MulT_r_v2 = b2["MulT_r_v2"];
        yyBox2D.Mul_t_v2 = b2["Mul_t_v2"];
        yyBox2D.Min_v2 = b2["Min_v2"];
        yyBox2D.Max_v2 = b2["Max_v2"];
        yyBox2D.Clamp = b2["Clamp"];
        yyBox2D.MulT_t_v2 = b2["MulT_t_v2"];
        yyBox2D.Mul_t_t = b2["Mul_t_t"];
        yyBox2D.MulT_t_t = b2["MulT_t_t"];
        yyBox2D.Clamp_v2 = b2["Clamp_v2"];
        yyBox2D.NextPowerOfTwo = b2["NextPowerOfTwo"];
        yyBox2D.Abs_v2 = b2["Abs_v2"];
        yyBox2D.Abs_m22 = b2["Abs_m22"];
        yyBox2D.IsPowerOfTwo = b2["IsPowerOfTwo"];
        yyBox2D.RandomFloat = b2["RandomFloat"];
        yyBox2D.Timer = b2["Timer"];
        yyBox2D.Color = b2["Color"];
        yyBox2D.Draw = b2["Draw"];
        yyBox2D.ContactID = b2["ContactID"];
        yyBox2D.ManifoldPoint = b2["ManifoldPoint"];
        yyBox2D.Manifold = b2["Manifold"];
        yyBox2D.WorldManifold = b2["WorldManifold"];
        yyBox2D.GetPointStates = b2["GetPointStates"];
        yyBox2D.ClipVertex = b2["ClipVertex"];
        yyBox2D.RayCastInput = b2["RayCastInput"];
        yyBox2D.RayCastOutput = b2["RayCastOutput"];
        yyBox2D.AABB = b2["AABB"];
        yyBox2D.CollideCircles = b2["CollideCircles"];
        yyBox2D.CollidePolygonAndCircle = b2["CollidePolygonAndCircle"];
        yyBox2D.FindMaxSeparation = b2["FindMaxSeparation"];
        yyBox2D.FindIncidentEdge = b2["FindIncidentEdge"];
        yyBox2D.CollidePolygons = b2["CollidePolygons"];
        yyBox2D.CollideEdgeAndCircle = b2["CollideEdgeAndCircle"];
        yyBox2D.EPAxis = b2["EPAxis"];
        yyBox2D.TempPolygon = b2["TempPolygon"];
        yyBox2D.ReferenceFace = b2["ReferenceFace"];
        yyBox2D.EPCollider = b2["EPCollider"];
        yyBox2D.CollideEdgeAndPolygon = b2["CollideEdgeAndPolygon"];
        yyBox2D.ClipSegmentToLine = b2["ClipSegmentToLine"];
        yyBox2D.TestShapeOverlap = b2["TestShapeOverlap"];
        yyBox2D.TestOverlap = b2["TestOverlap"];
        yyBox2D.Shape = b2["Shape"];
        yyBox2D.MassData = b2["MassData"];
        yyBox2D.CircleShape = b2["CircleShape"];
        yyBox2D.EdgeShape = b2["EdgeShape"];
        yyBox2D.ChainShape = b2["ChainShape"];
        yyBox2D.PolygonShape = b2["PolygonShape"];
        yyBox2D.Pair = b2["Pair"];
        yyBox2D.PairLessThan = b2["PairLessThan"];
        yyBox2D.BroadPhase = b2["BroadPhase"];
        yyBox2D.DistanceProxy = b2["DistanceProxy"];
        yyBox2D.SimplexCache = b2["SimplexCache"];
        yyBox2D.DistanceInput = b2["DistanceInput"];
        yyBox2D.DistanceOutput = b2["DistanceOutput"];
        yyBox2D.SimplexVertex = b2["SimplexVertex"];
        yyBox2D.Simplex = b2["Simplex"];
        yyBox2D.DistanceFunc = b2["DistanceFunc"];
        yyBox2D.TreeNode = b2["TreeNode"];
        yyBox2D.DynamicTree = b2["DynamicTree"];
        yyBox2D.TOIInput = b2["TOIInput"];
        yyBox2D.TOIOutput = b2["TOIOutput"];
        yyBox2D.SeparationFunction = b2["SeparationFunction"];
        yyBox2D.TimeOfImpact = b2["TimeOfImpact"];
        yyBox2D.BodyDef = b2["BodyDef"];
        yyBox2D.Body = b2["Body"];
        yyBox2D.Filter = b2["Filter"];
        yyBox2D.FixtureDef = b2["FixtureDef"];
        yyBox2D.Fixture = b2["Fixture"];
        yyBox2D.DestructionListener = b2["DestructionListener"];
        yyBox2D.ContactFilter = b2["ContactFilter"];
        yyBox2D.ContactImpulse = b2["ContactImpulse"];
        yyBox2D.ContactListener = b2["ContactListener"];
        yyBox2D.QueryCallback = b2["QueryCallback"];
        yyBox2D.RayCastCallback = b2["RayCastCallback"];
        yyBox2D.TimeStep = b2["TimeStep"];
        yyBox2D.Position = b2["Position"];
        yyBox2D.Velocity = b2["Velocity"];
        yyBox2D.SolverData = b2["SolverData"];
        yyBox2D.World = b2["World"];
        yyBox2D.MixFriction = b2["MixFriction"];
        yyBox2D.MixRestitution = b2["MixRestitution"];
        yyBox2D.ContactRegister = b2["ContactRegister"];
        yyBox2D.ContactEdge = b2["ContactEdge"];
        yyBox2D.Contact = b2["Contact"];
        yyBox2D.CircleContact = b2["CircleContact"];
        yyBox2D.PolygonContact = b2["PolygonContact"];
        yyBox2D.ChainAndCircleContact = b2["ChainAndCircleContact"];
        yyBox2D.ChainAndPolygonContact = b2["ChainAndPolygonContact"];
        yyBox2D.EdgeAndCircleContact = b2["EdgeAndCircleContact"];
        yyBox2D.EdgeAndPolygonContact = b2["EdgeAndPolygonContact"];
        yyBox2D.PolygonAndCircleContact = b2["PolygonAndCircleContact"];
        yyBox2D.defaultFilter = b2["defaultFilter"];
        yyBox2D.defaultListener = b2["defaultListener"];
        yyBox2D.ContactManager = b2["ContactManager"];
        yyBox2D.VelocityConstraintPoint = b2["VelocityConstraintPoint"];
        yyBox2D.ContactPositionConstraint = b2["ContactPositionConstraint"];
        yyBox2D.ContactVelocityConstraint = b2["ContactVelocityConstraint"];
        yyBox2D.PositionSolverManifold = b2["PositionSolverManifold"];
        yyBox2D.ContactSolverDef = b2["ContactSolverDef"];
        yyBox2D.ContactSolver = b2["ContactSolver"];
        yyBox2D.Island = b2["Island"];
        yyBox2D.Jacobian = b2["Jacobian"];
        yyBox2D.JointEdge = b2["JointEdge"];
        yyBox2D.JointDef = b2["JointDef"];
        yyBox2D.Joint = b2["Joint"];
        yyBox2D.RevoluteJointDef = b2["RevoluteJointDef"];
        yyBox2D.RevoluteJoint = b2["RevoluteJoint"];
        yyBox2D.MouseJointDef = b2["MouseJointDef"];
        yyBox2D.MouseJoint = b2["MouseJoint"];
        yyBox2D.DistanceJointDef = b2["DistanceJointDef"];
        yyBox2D.DistanceJoint = b2["DistanceJoint"];
        yyBox2D.PrismaticJointDef = b2["PrismaticJointDef"];
        yyBox2D.PrismaticJoint = b2["PrismaticJoint"];
        yyBox2D.FrictionJointDef = b2["FrictionJointDef"];
        yyBox2D.FrictionJoint = b2["FrictionJoint"];
        yyBox2D.WeldJointDef = b2["WeldJointDef"];
        yyBox2D.WeldJoint = b2["WeldJoint"];
        yyBox2D.WheelJointDef = b2["WheelJointDef"];
        yyBox2D.WheelJoint = b2["WheelJoint"];
        yyBox2D.GearJointDef = b2["GearJointDef"];
        yyBox2D.GearJoint = b2["GearJoint"];
        yyBox2D.MotorJointDef = b2["MotorJointDef"];
        yyBox2D.MotorJoint = b2["MotorJoint"];
        yyBox2D.PulleyJointDef = b2["PulleyJointDef"];
        yyBox2D.PulleyJoint = b2["PulleyJoint"];
        yyBox2D.RopeJointDef = b2["RopeJointDef"];
        yyBox2D.RopeJoint = b2["RopeJoint"];
        yyBox2D.RopeDef = b2["RopeDef"];
        yyBox2D.Rope = b2["Rope"];
        yyBox2D.maxManifoldPoints = b2["maxManifoldPoints"];
        yyBox2D.maxPolygonVertices = b2["maxPolygonVertices"];
        yyBox2D.aabbExtension = b2["aabbExtension"];
        yyBox2D.aabbMultiplier = b2["aabbMultiplier"];
        yyBox2D.linearSlop = b2["linearSlop"];
        yyBox2D.angularSlop = b2["angularSlop"];
        yyBox2D.polygonRadius = b2["polygonRadius"];
        yyBox2D.maxSubSteps = b2["maxSubSteps"];
        yyBox2D.maxTOIContacts = b2["maxTOIContacts"];
        yyBox2D.velocityThreshold = b2["velocityThreshold"];
        yyBox2D.maxLinearCorrection = b2["maxLinearCorrection"];
        yyBox2D.maxAngularCorrection = b2["maxAngularCorrection"];
        yyBox2D.maxTranslation = b2["maxTranslation"];
        yyBox2D.maxTranslationSquared = b2["maxTranslationSquared"];
        yyBox2D.maxRotation = b2["maxRotation"];
        yyBox2D.maxRotationSquared = b2["maxRotationSquared"];
        yyBox2D.baumgarte = b2["baumgarte"];
        yyBox2D.toiBaugarte = b2["toiBaugarte"];
        yyBox2D.timeToSleep = b2["timeToSleep"];
        yyBox2D.linearSleepTolerance = b2["linearSleepTolerance"];
        yyBox2D.angularSleepTolerance = b2["angularSleepTolerance"];
        yyBox2D.epsilon = b2["epsilon"];
        yyBox2D.JsonSerializer = b2["JsonSerializer"];
        yyBox2D.RUBELoader = b2["RUBELoader"];
        yyBox2D.Profiler = b2["Profiler"];
        yyBox2D.ParticleDef = b2["ParticleDef"];
        yyBox2D.ParticleColor = b2["ParticleColor"];
        yyBox2D.ParticleGroupDef = b2["ParticleGroupDef"];
        yyBox2D.ParticleGroup = b2["ParticleGroup"];
        yyBox2D.ParticleSystem = b2["ParticleSystem"];        
    }
}
    
// #############################################################################################
/// Function:<summary>
///             Storage for pertinent contact details
///          </summary>
// #############################################################################################
/** @constructor */
function yyContact(_contact) {
        
    var worldManifold = new yyBox2D.WorldManifold();
    _contact.GetWorldManifold(worldManifold);
                       
    this.m_fixture1 = _contact.GetFixtureA();
    this.m_fixture2 = _contact.GetFixtureB();
    this.m_manifolds = [];
    this.m_worldManifolds = [];            
    this.m_manifolds[0] = _contact.GetManifold();
    this.m_worldManifolds[0] = worldManifold;
};

// #############################################################################################
/// Function:<summary>
///             Storage for collating collision filters
///          </summary>
// #############################################################################################
/** @constructor */
function yyCollisionSettings(_objectIndex, _categoryBits, _maskBits) {

    this.objectIndex = _objectIndex;
    this.categoryBits = _categoryBits;
    this.maskBits = _maskBits;
};
    
// #############################################################################################
/// Function:<summary>
///             Initialise a physics world
///          </summary>
// #############################################################################################
/** @constructor */
function yyPhysicsWorld(_pixelToMetreScale, _defaultSpeed) {

    enumerateBox2D();
    if (yyBox2D === null) {
        yyBox2D = window["b2"];
    }
   	    	    	
    this.m_pixelToMetreScale = _pixelToMetreScale;
    this.m_updateSpeed = _defaultSpeed;
    this.m_updateIterations = PHYSICS_DEFAULT_UPDATE_ITERATIONS;    
    this.m_contactList = [];    
    this.m_ppParticleGroups = [];
    this.m_particleGroupDef = new yyBox2D.ParticleGroupDef();
    this.debugDraw = null;
    this.m_paused = false;
        
    this.m_objectToCollisionCategory = [];
    for (var i = 0; i < PHYSICS_COLLISION_CATEGORIES; i++) {
    
        this.m_objectToCollisionCategory[i] = new yyCollisionSettings(-1, 0, 0);
    }
    
    // Set a default gravity vector
    var gravity = new yyBox2D.Vec2(0, 10);
    this.m_world = new yyBox2D.World(gravity);
    
    this.SetupDebugDraw();
    this.SetupContactListener();
    
    this.DrawParticles = g_webGL ? this.DrawParticles_WebGL : this.DrawParticles_RELEASE;
    this.DrawParticlesExt = g_webGL ? this.DrawParticlesExt_WebGL : this.DrawParticlesExt_RELEASE;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.Pause = function() {

    this.m_paused = true;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.Resume = function() {

    this.m_paused = false;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetupDebugDraw = function() {    
    
    var ctx = document.getElementById("canvas").getContext("2d");    
    if (ctx) {
    
        // Setup debug drawing functionality for this world
        this.debugDraw = new yyBox2D.Draw();    
	    this.debugDraw.SetFlags(yyBox2D.Draw.e_shapeBit | yyBox2D.Draw.e_jointBit);
	    
	    this.debugDraw.m_pWorld = this;
	    this.debugDraw.DrawPolygon = yyBox2DDrawPolygon;
	    this.debugDraw.DrawSolidPolygon = yyBox2DDrawSolidPolygon;
	    this.debugDraw.DrawCircle = yyBox2DDrawCircle;
	    this.debugDraw.DrawSolidCircle = yyBox2DDrawSolidCircle;
	    this.debugDraw.DrawSegment = yyBox2DDrawSegment;
	    this.debugDraw.DrawTransform = yyBox2DDrawTransform;
	    this.debugDraw.DrawParticles = yyBox2DDrawParticles;
	    
	    this.m_world.SetDebugDraw(this.debugDraw);	    
	}
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetupContactListener = function() {

    var contactListener = new yyBox2D.ContactListener();
    contactListener.m_physicsWorld = this;    
    
    contactListener.BeginContact = function(contact) {
        
        if (contact.GetFixtureA().IsSensor() || contact.GetFixtureB().IsSensor()) {
            this.m_physicsWorld.RegisterContactResult(contact);
        }
    };       
    contactListener.PreSolve = function(contact, oldManifold) {
    
        // debug("PreSolve");
    };
    contactListener.EndContact = function(contact) {
            
        // debug("EndContact");
    }; 
    contactListener.PostSolve = function(contact, contactImpulse) {
            
        this.m_physicsWorld.RegisterContactResult(contact);
    };    
    this.m_world.SetContactListener(contactListener);
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.RegisterContactResult = function(_contact) {
        
    // Check the contact list to see if a contact already exists that involves the fixtures in this contact
    // and if so append this contact to the aggregated set of contacts
    for (var n = 0; n < this.m_contactList.length; n++) {
    
        var aggregatedContact = this.m_contactList[n];
        
        if ((aggregatedContact.m_fixture1 == _contact.GetFixtureA() && aggregatedContact.m_fixture2 == _contact.GetFixtureB()) ||
            (aggregatedContact.m_fixture1 == _contact.GetFixtureB() && aggregatedContact.m_fixture2 == _contact.GetFixtureA())) 
        {                  
            var worldManifold = new yyBox2D.WorldManifold();
            _contact.GetWorldManifold(worldManifold);
            aggregatedContact.m_manifolds[aggregatedContact.m_manifolds.length] = _contact.GetManifold();            
            aggregatedContact.m_worldManifolds[aggregatedContact.m_worldManifolds.length] = worldManifold;
            return;
        }
    }    
    this.m_contactList[this.m_contactList.length] = new yyContact(_contact);
};

// #############################################################################################
/// Function:<summary>
///             Set time division to step the physics forward during an update, in seconds
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetUpdateSpeed = function(_speed) {

	this.m_updateSpeed = _speed;
};

// #############################################################################################
/// Function:<summary>
///             For integration accuracy purposes, set the number of iterations the 
///             physics simulations steps through during an update 
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetUpdateIterations = function(_iterations) {

	this.m_updateIterations = _iterations;
};

// #############################################################################################
/// Function:<summary>
///             Set the scale value for converting pixel defined sized 
///             objects to physical sized objects
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetPixelToMetreScale = function(_scale) {

    this.m_pixelToMetreScale = _scale;
    // Find all objects in the game and scale their shapes??
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetGravity = function(_gx, _gy) {

    this.m_world.m_gravity.x = _gx;
    this.m_world.m_gravity.y = _gy;
    
    // Update all dynamic objects to make sure they're awake and respond to the change in gravity if it has length
	if ((_gx != 0.0) || (_gy != 0.0)) {
	
	    var physicsBody = this.m_world.GetBodyList();
	    while ((physicsBody != null) && (physicsBody != undefined))	{
	
			if (physicsBody.GetType() === yyBox2D.Body.b2_dynamicBody) {
				physicsBody.SetAwake(true);				
			}
			physicsBody = physicsBody.GetNext();
		}
	}
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.UpdatePaths = function () {

    var pool = g_RunRoom.m_Active.pool;
	for (var index = 0; index < pool.length; index++)
	{
		var pInst = pool[index];

		if (pInst.path_index >= 0) {
		
		    var physicsObject = pInst.m_physicsObject;		    
		    if (physicsObject !== null && physicsObject !== undefined) {
		    
		        var physicsBody = physicsObject.m_physicsBody;		    
		        if (physicsBody.GetType() !== yyBox2D.Body.b2_dynamicBody) {
				
				    if (pInst.Adapt_Path()) {
			            pInst.PerformEvent(EVENT_OTHER_ENDOFPATH, 0, pInst, pInst);
		            }
		            physicsBody.SetTransform(
		                new yyBox2D.Vec2(pInst.x * this.m_pixelToMetreScale, pInst.y * this.m_pixelToMetreScale), 
		                physicsBody.GetAngle());				    
				}
			}
			else {
			    if (pInst.Adapt_Path()) {
			        pInst.PerformEvent(EVENT_OTHER_ENDOFPATH, 0, pInst, pInst);
		        }
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///          	Save off the xprevious and yprevious for physical positions in pixel space
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.StorePreviousPositions = function () {
    
    var metreToPixelScale = 1.0 / this.m_pixelToMetreScale;

	// Transfer the new positions to the associated instances so that they can be drawn correctly
	var physicsBody = this.m_world.GetBodyList();
	while ((physicsBody != null) && (physicsBody != undefined))	{
	
	    // userData is an instance
		var pInst = physicsBody.GetUserData();
		if ((pInst != null) && (pInst != undefined)) {	        			

			// Update additional physical properties
			pInst.RefreshPhysicalProperties(physicsBody);			
						
		    var pos = physicsBody.GetPosition();
            pInst.phy_position_xprevious = pos.x * metreToPixelScale;
            pInst.phy_position_yprevious = pos.y * metreToPixelScale;            
		}
		physicsBody = physicsBody.GetNext();
	}
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.Update = function (_roomSpeed) {

    // This shouldn't happen, but in case it does I'd rather not get stuck in here
    if (_roomSpeed <= 0) {
        return;
    }
    
    // Make sure kinematic (and non-physics) objects still follow paths
    this.UpdatePaths();
    
    // Don't let the simulation update if paused
    if (this.m_paused == true) {
        return;
    }
    
    this.StorePreviousPositions();
   
	// The amount of time we step forward the physics if there's a 1:1 ratio between room speed and physics speed
	var timeSlice = 1.0 / this.m_updateSpeed;

	// Work out the step forward to do to account for any disparity between room speed and physics speed
	var updateSteps = this.m_updateSpeed / _roomSpeed;	

	// And do the update if there's anything to do this frame
	var updateStepsRemaining = updateSteps;
	while (updateStepsRemaining > 0.0) {
	
		// How much to move the physics forward this step
		var timeStep = (updateStepsRemaining > 1.0) ? timeSlice : (timeSlice * updateStepsRemaining);

		this.m_world.Step(timeStep, this.m_updateIterations, this.m_updateIterations);		
		// this.m_world.Validate();				

		// Decrement the steps left over
		updateStepsRemaining -= 1.0;
	}			

    this.m_world.ClearForces(); // must happen before dispatch contact events or you'll lose impulses/forces applied due to collisions
	this.PreProcess();
	this.DispatchContactEvents();
};

// #############################################################################################
/// Function:<summary>
///          	Transfer physics variables to GM side data
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.PreProcess = function () {

    var metreToPixelScale = 1.0 / this.m_pixelToMetreScale;

	// Transfer the new positions to the associated instances so that they can be drawn correctly
	var physicsBody = this.m_world.GetBodyList();
	while ((physicsBody != null) && (physicsBody != undefined))	{
	
	    // userData is an instance
		var pInst = physicsBody.GetUserData();
		if ((pInst != null) && (pInst != undefined)) {
            
		    if (pInst.marked && pInst.m_physicsObject) {

		        // If prior to the physics update someone's marked an object for destruction
		        // then we shouldn't include it in the next physics simulation step...
		        this.DestroyBody(pInst.m_physicsObject);
		        pInst.m_physicsObject = null;
		    }
		    else {
		        // Update additional physical properties
		        pInst.RefreshPhysicalProperties(physicsBody);
		    }
		}
		physicsBody = physicsBody.GetNext();
	}
};


// #############################################################################################
/// Function:<summary>
///             Dispatch any physics contacts to GM to allow for reponses
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DispatchContactEvents = function () {

    var metreToPixelScale = 1.0 / this.m_pixelToMetreScale;
    for (var i = 0; i < this.m_contactList.length; i++) {

        // Given the aggregated nature of contact event dispatch the user might delete
        // bodies and/or fixture in an event when there's still events queued referring
        // to them. Guard against this now...
        if (this.m_contactList[i].m_fixture1 &&
            this.m_contactList[i].m_fixture2 &&
            this.m_contactList[i].m_fixture1.GetBody() &&
            this.m_contactList[i].m_fixture2.GetBody()) 
        {
            var inst1 = this.m_contactList[i].m_fixture1.GetBody().GetUserData();
            var inst2 = this.m_contactList[i].m_fixture2.GetBody().GetUserData();                                             
                                                
            // Setup instance data storage for the collision        
            inst1.phy_collision_points = 0;
            inst1.phy_collision_x = undefined;
            inst1.phy_collision_y = undefined;
            inst1.phy_col_normal_x = undefined;
            inst1.phy_col_normal_y = undefined;
            
            inst2.phy_collision_points = 0;
            inst2.phy_collision_x = undefined;
            inst2.phy_collision_y = undefined;
            inst2.phy_col_normal_x = undefined;
            inst2.phy_col_normal_y = undefined;      
            
            // Transfer data from the manifolds to the instance storage
            var pointIndex = 0;
            for (var manifoldIndex = 0; manifoldIndex < this.m_contactList[i].m_manifolds.length; manifoldIndex++) {
            
                // var manifold = this.m_contactList[i].m_manifolds[manifoldIndex];
                var worldManifold = this.m_contactList[i].m_worldManifolds[manifoldIndex];
                                
                for (var j in worldManifold.points) {
                    if (!worldManifold.points.hasOwnProperty(j)) continue;                                    
                                                                    
                    // Set contact data on the instances
					if(pointIndex == 0)
					{
						inst1.phy_collision_x = worldManifold.points[j].x * metreToPixelScale;
						inst1.phy_collision_y = worldManifold.points[j].y * metreToPixelScale;
						inst2.phy_collision_x = worldManifold.points[j].x * metreToPixelScale;
						inst2.phy_collision_y = worldManifold.points[j].y * metreToPixelScale;
						inst1.phy_col_normal_x = worldManifold.normal.x;
						inst1.phy_col_normal_y = worldManifold.normal.y;
						inst2.phy_col_normal_x = worldManifold.normal.x;
						inst2.phy_col_normal_y = worldManifold.normal.y;
					}
                    
                    inst1.phy_collision_points++;
                    inst2.phy_collision_points++;
                    pointIndex++;
		        }		    
            }

            // Call the collision events
            if (!inst1.marked && !inst2.marked)
            {
                inst1.PerformEvent(EVENT_COLLISION, inst2.object_index, inst1, inst2);        						
                inst2.PerformEvent(EVENT_COLLISION, inst1.object_index, inst2, inst1);		    
            }
		    
		    // Clear instance data storage now the event is done with
            inst1.phy_collision_points = 0;
            inst1.phy_collision_x = undefined;
            inst1.phy_collision_y = undefined;
            inst1.phy_col_normal_x = undefined;
            inst1.phy_col_normal_y = undefined;
            
            inst2.phy_collision_points = 0;
            inst2.phy_collision_x = undefined;
            inst2.phy_collision_y = undefined;
            inst2.phy_col_normal_x = undefined;
            inst2.phy_col_normal_y = undefined;
		}
    }
    // Clear the contact list
    this.m_contactList = [];
};

function ApplyOffsetToFixture(fixtureDef, offs)
{

	switch (fixtureDef.shape.GetType())
	{
	case yyBox2D.Shape.e_circle:
	{
		var circle = fixtureDef.shape;
		circle.m_p.x += offs.x;
		circle.m_p.y += offs.y;
	}
	break;

	case yyBox2D.Shape.e_polygon:
	{
		var polygon = fixtureDef.shape;
		for (var i = 0; i < polygon.m_count; i++)
		{
			polygon.m_vertices[i].x += offs.x;
			polygon.m_vertices[i].y += offs.y;
		}
	}
	break;

	case yyBox2D.Shape.e_chain:
	{
		var chain = fixtureDef.shape;

		for (var i = 0; i < chain.m_count; i++)
		{
			chain.m_vertices[i].x += offs.x;
			chain.m_vertices[i].y += offs.y;
		}
	}
	break;

	case yyBox2D.Shape.e_edge:
	{
		var edge = fixtureDef.shape;


		edge.m_vertex1.x += offs.x;
		edge.m_vertex1.y += offs.y;
		edge.m_vertex2.x += offs.x;
		edge.m_vertex2.y += offs.y;
	}
	break;

	default:
		break;
	}
}

// #############################################################################################
/// Function:<summary>
///             Bind a fixture and create a physics body
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateBody = function (_pFixture, _pInst, _xoffs, _yoffs, ApplyOffsetToBody)
{
	if (ApplyOffsetToBody === undefined) ApplyOffsetToBody = true;
	
    var returnIndex = -1;
    if (!_pFixture.Finalise()) return;

	// Build simple collision bits settings	
	var fixtureDef = _pFixture.m_fixtureDef;
	// Don't just blow up if they've screwed up the setup
	if (fixtureDef.shape == null) {
		var err = "No fixture shape data present for " + _pInst.GetObj().GetName() + "\n";
		yyError(err, true);
	}
	else {
		var collisionCategory = this.BuildCollisionBits(_pInst.object_index);
		if (collisionCategory != -1) {
		
			fixtureDef.filter.categoryBits = this.m_objectToCollisionCategory[collisionCategory].categoryBits;
			fixtureDef.filter.maskBits = this.m_objectToCollisionCategory[collisionCategory].maskBits;
		}
		else {
			fixtureDef.filter.categoryBits = 0;
			fixtureDef.filter.maskBits = 0;
		}

		// Work out the type of body this fixture indicates if it's the only fixture attached to the physics body
		var bodyType = (_pFixture.m_fixtureDef.density > 0) ? yyBox2D.Body.b2_dynamicBody : (_pFixture.m_kinematic ? yyBox2D.Body.b2_kinematicBody : yyBox2D.Body.b2_staticBody);
		
		// if the instance already has a body asssociated with it then we're just adding a new shape/fixture to the pre-existing body
		if (_pInst.m_physicsObject != null)
		{
			var pBody = _pInst.m_physicsObject.m_physicsBody;
			if (pBody.GetFixtureList() == null)
			{
				// No fixtures currently attached, presumably all deleted... allow the new fixture's density to dictate the body type
				pBody.SetType(bodyType);
			}

			var offs = _pInst.ApplyVisualOffset(-_pInst.image_angle * Pi / 180.0, { x: _xoffs* this.m_pixelToMetreScale, y: _yoffs* this.m_pixelToMetreScale });

			ApplyOffsetToFixture(fixtureDef, offs);

			

			var pFixture = pBody.CreateFixture(fixtureDef);
			returnIndex = _pInst.m_physicsObject.GetFixtureIndex(pFixture);

			offs.x = -offs.x;
			offs.y = -offs.y;

			ApplyOffsetToFixture(fixtureDef, offs);

		}
		else
		{
			var bodyDef = new yyBox2D.BodyDef();
			bodyDef.type = bodyType;
			bodyDef.angle = -_pInst.image_angle * Pi / 180.0;        
			bodyDef.linearDamping = _pFixture.m_linearDamping;
			bodyDef.angularDamping = _pFixture.m_angularDamping;
			bodyDef.awake = _pFixture.m_awake;
			// Fixture position should be adjusted according to the visual offset provided if it's non-zero		
			var finalOffs;
			if (ApplyOffsetToBody)
				finalOffs = _pInst.ApplyVisualOffset(bodyDef.angle, { x: _xoffs, y: _yoffs });
			else
				finalOffs = _pInst.ApplyVisualOffset(bodyDef.angle, { x: 0, y: 0 });
			bodyDef.position.x = (_pInst.x - finalOffs.x) * this.m_pixelToMetreScale;
			bodyDef.position.y = (_pInst.y - finalOffs.y) * this.m_pixelToMetreScale;
			bodyDef.userData = _pInst;        
			var pBody = this.m_world.CreateBody(bodyDef);
			
			if (!ApplyOffsetToBody)
			{
				finalOffs = _pInst.ApplyVisualOffset(bodyDef.angle, { x: _xoffs* this.m_pixelToMetreScale, y: _yoffs* this.m_pixelToMetreScale });
				ApplyOffsetToFixture(fixtureDef, finalOffs);
				_xoffs = 0;
				_yoffs = 0;
			}


			var pFixture = pBody.CreateFixture(fixtureDef);
			
			// Create a physics object for this instance and ensure the instance has a reference to it
			// Also, ensure a note of the collision category is maintained for updating collision bits
			var physicsObject = new yyPhysicsObject(pBody, collisionCategory, _xoffs, _yoffs);
			_pInst.m_physicsObject = physicsObject;
			// Make sure initial physical states are present
			_pInst.RefreshPhysicalProperties(pBody);

			returnIndex = physicsObject.GetFixtureIndex(pFixture);

			if (!ApplyOffsetToBody)
			{
				finalOffs.x = -finalOffs.x;
				finalOffs.y = -finalOffs.y;

				ApplyOffsetToFixture(fixtureDef, finalOffs);
			}

			// As a result of trying to keep down the number of collision categories we need
			// to run through any added bodies and ensure their collision bits are up to date
			this.UpdateInstantiatedShapesCollisionBits();
		}
	}
    return returnIndex;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DestroyBody = function (_physicsObject) {
    
    this.m_world.DestroyBody(_physicsObject.m_physicsBody);
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DestroyJoint = function (_physicsJoint) {

    this.m_world.DestroyJoint(_physicsJoint.m_physicsJoint);
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DebugRender = function (_flags) {

    // If it's webgl we may not have this, atm
    if (this.debugDraw == null) {
        return;
    }

    // re-interpret flags
    var renderFlags = 0;
    if (_flags & PHYSICS_DEBUG_RENDER_SHAPE) {
        renderFlags = renderFlags | yyBox2D.Draw.e_shapeBit;
    }
    if (_flags & PHYSICS_DEBUG_RENDER_JOINT) {
        renderFlags = renderFlags | yyBox2D.Draw.e_jointBit;
    }    
    if (_flags & PHYSICS_DEBUG_RENDER_COM) {
        renderFlags = renderFlags | yyBox2D.Draw.e_centerOfMassBit;
    }    
    if (_flags & PHYSICS_DEBUG_RENDER_AABB) {
        renderFlags = renderFlags | yyBox2D.Draw.e_aabbBit;
    }                    
    if (_flags & PHYSICS_DEBUG_RENDER_PAIRS) {
        renderFlags = renderFlags | yyBox2D.Draw.e_pairBit;
    }              
    // yyBox2D.DebugDraw.e_controllerBit = 0x0020;
    this.debugDraw.SetFlags(renderFlags);
    this.m_world.DrawDebugData();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateDistanceJoint = function(
    _bodyA, 
    _bodyB, 
    _xWorldAnchorA, _yWorldAnchorA, 
    _xWorldAnchorB, _yWorldAnchorB, 
    _collideConnected) 
{
    _bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);

    // Move anchors into world space
    var scale = this.m_pixelToMetreScale;
	var worldAnchorA = new yyBox2D.Vec2(_xWorldAnchorA * scale, _yWorldAnchorA * scale);
	var worldAnchorB = new yyBox2D.Vec2(_xWorldAnchorB * scale, _yWorldAnchorB * scale);

	var jointDef = new yyBox2D.DistanceJointDef();
	jointDef.Initialize(_bodyA.m_physicsBody, _bodyB.m_physicsBody, worldAnchorA, worldAnchorB);
	jointDef.collideConnected = _collideConnected;
	
    var distanceJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(distanceJoint);
	return yyJoint;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateRopeJoint = function(
    _bodyA, 
    _bodyB, 
    _xWorldAnchorA, _yWorldAnchorA, 
    _xWorldAnchorB, _yWorldAnchorB,
    _maxLength, 
    _collideConnected) 
{
    var bodyA = _bodyA.m_physicsBody;
    var bodyB = _bodyB.m_physicsBody;
    bodyA.SetAwake(true);
    bodyB.SetAwake(true);

    // Move anchors into world space
    var scale = this.m_pixelToMetreScale;
	var localAnchorA = bodyA.GetLocalPoint(new yyBox2D.Vec2(_xWorldAnchorA * scale, _yWorldAnchorA * scale));
	var localAnchorB = bodyB.GetLocalPoint(new yyBox2D.Vec2(_xWorldAnchorB * scale, _yWorldAnchorB * scale));

	var jointDef = new yyBox2D.RopeJointDef();
	jointDef.bodyA = bodyA;
	jointDef.bodyB = bodyB;
	jointDef.localAnchorA = localAnchorA;
	jointDef.localAnchorB = localAnchorB;			
	jointDef.maxLength = _maxLength * scale;
	jointDef.collideConnected = _collideConnected;
	
    var ropeJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(ropeJoint);
	return yyJoint;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateRevoluteJoint = function(
    _bodyA, 
    _bodyB, 
    _xWorldAnchor, _yWorldAnchor, 
    _lowerAngleLimit, _upperAngleLimit, _useLimits,
    _maxMotorTorque, _maxSpeed, _useMotor,
	_collideConnected)
{
    _bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);
    
    var scale = this.m_pixelToMetreScale;
    var anchor = new yyBox2D.Vec2(_xWorldAnchor * scale, _yWorldAnchor * scale);
    var jointDef = new yyBox2D.RevoluteJointDef();    
    jointDef.Initialize(_bodyA.m_physicsBody, _bodyB.m_physicsBody, anchor);    
	jointDef.lowerAngle = _lowerAngleLimit;
	jointDef.upperAngle = _upperAngleLimit;
	jointDef.enableLimit = _useLimits;
	jointDef.maxMotorTorque = _maxMotorTorque;
	jointDef.motorSpeed = _maxSpeed;
	jointDef.enableMotor = _useMotor;
	jointDef.collideConnected = _collideConnected;

	var revoluteJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(revoluteJoint);
	return yyJoint;        
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreatePrismaticJoint = function(
    _bodyA, 
	_bodyB,								
	_xWorldAnchor, _yWorldAnchor,
	_xWorldAxis, _yWorldAxis,
	_lowerTranslationLimit, _upperTranslationLimit, _useLimits, 
    _maxMotorForce, _maxSpeed, _useMotor, _collideConnected) 
{
    _bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);

    var scale = this.m_pixelToMetreScale;
    var anchor = new yyBox2D.Vec2(_xWorldAnchor * scale, _yWorldAnchor * scale);
    var axis = new yyBox2D.Vec2(_xWorldAxis, _yWorldAxis);
    axis.Normalize();
    var jointDef = new yyBox2D.PrismaticJointDef();
    jointDef.Initialize(_bodyA.m_physicsBody, _bodyB.m_physicsBody, anchor, axis);
	jointDef.lowerTranslation = _lowerTranslationLimit * scale;
	jointDef.upperTranslation = _upperTranslationLimit * scale;
	jointDef.enableLimit = _useLimits;
	jointDef.maxMotorForce = _maxMotorForce;
	jointDef.motorSpeed = _maxSpeed;
	jointDef.enableMotor = _useMotor;
	jointDef.collideConnected = _collideConnected;

	var prismaticJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(prismaticJoint);
	return yyJoint;  
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreatePulleyJoint = function(
    _bodyA, 
	_bodyB,
	_xWorldGroundAnchorA, _yWorldGroundAnchorA,
	_xWorldGroundAnchorB, _yWorldGroundAnchorB,
	_xLocalAnchorA, _yLocalAnchorA,
	_xLocalAnchorB, _yLocalAnchorB,
	_ratio,
	_collideConnected) 
{     
    _bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);

    var scale = this.m_pixelToMetreScale;
	var jointDef = new yyBox2D.PulleyJointDef();	
	jointDef.Initialize(
	    _bodyA.m_physicsBody, 
	    _bodyB.m_physicsBody,
	    new yyBox2D.Vec2(_xWorldGroundAnchorA * scale, _yWorldGroundAnchorA * scale),
	    new yyBox2D.Vec2(_xWorldGroundAnchorB * scale, _yWorldGroundAnchorB * scale),
	    _bodyA.m_physicsBody.GetWorldPoint(new yyBox2D.Vec2(_xLocalAnchorA * scale, _yLocalAnchorA * scale)),
	    _bodyB.m_physicsBody.GetWorldPoint(new yyBox2D.Vec2(_xLocalAnchorB * scale, _yLocalAnchorB * scale)),
	    _ratio);
	jointDef.collideConnected = _collideConnected;

	var pulleyJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(pulleyJoint);
	return yyJoint; 
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateWheelJoint = function(
    _bodyA, 
	_bodyB,
    _anchor_x, _anchor_y, 
    _axis_x, _axis_y, 
    _enableMotor, 
    _maxMotorTorque, 
    _motorSpeed, 
    _freqHz, 
    _dampingRatio, 
    _collideConnected) 
{
	// Make sure the bodies involved are awake
	_bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);
	
	var scale = this.m_pixelToMetreScale;
	var jointDef = new yyBox2D.WheelJointDef();	
	jointDef.Initialize(
		_bodyA.m_physicsBody, 
	    _bodyB.m_physicsBody,
		new yyBox2D.Vec2(_anchor_x * scale, _anchor_y * scale),
	    new yyBox2D.Vec2(_axis_x, _axis_y));	
	jointDef.enableMotor = _enableMotor;	
	jointDef.maxMotorTorque = _maxMotorTorque;
	jointDef.motorSpeed = _motorSpeed;		
	jointDef.frequencyHz = _freqHz;
	jointDef.dampingRatio = _dampingRatio;
	jointDef.collideConnected = _collideConnected;
	
	var wheelJoint = this.m_world.CreateJoint(jointDef);

	// Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(wheelJoint);
	return yyJoint; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateWeldJoint = function (
    _bodyA, 
    _bodyB, 
    _anchor_x, _anchor_y, 
    _refAngle, 
    _freqHz, 
    _dampingRatio, 
    _collideConnected) 
{
    // Make sure the bodies involved are awake
	_bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);
	
	var scale = this.m_pixelToMetreScale;
	var jointDef = new yyBox2D.WeldJointDef();	
	jointDef.Initialize(
		_bodyA.m_physicsBody, 
	    _bodyB.m_physicsBody,
		new yyBox2D.Vec2(_anchor_x * scale, _anchor_y * scale));	    
	jointDef.referenceAngle = (-_refAngle * 180.0) / Math.PI;
	jointDef.frequencyHz = _freqHz;
	jointDef.dampingRatio = _dampingRatio;
	jointDef.collideConnected = _collideConnected;
	
	var weldJoint = this.m_world.CreateJoint(jointDef);

	// Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(weldJoint);
	return yyJoint; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateFrictionJoint = function (
    _bodyA, 
    _bodyB, 
    _anchor_x, _anchor_y, 
    _maxForce, 
    _maxTorque, 
    _collideConnected) 
{
    // Make sure the bodies involved are awake
	_bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);
	
	var scale = this.m_pixelToMetreScale;
	var jointDef = new yyBox2D.FrictionJointDef();	
	jointDef.Initialize(
		_bodyA.m_physicsBody, 
	    _bodyB.m_physicsBody,
		new yyBox2D.Vec2(_anchor_x * scale, _anchor_y * scale));	    
	jointDef.maxForce = _maxForce;	
	jointDef.maxTorque = _maxTorque;
	jointDef.collideConnected = _collideConnected;
	
	var frictionJoint = this.m_world.CreateJoint(jointDef);

	// Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(frictionJoint);
	return yyJoint; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################						  
yyPhysicsWorld.prototype.CreateGearJoint = function(_bodyA, _bodyB, _jointA, _jointB, _ratio) 
{
    // Check we have a valid configuration of bodies and joints
	if ((_jointA.m_physicsJoint.m_type !== yyBox2D.Joint.e_revoluteJoint) &&
	    (_jointA.m_physicsJoint.m_type !== yyBox2D.Joint.e_prismaticJoint) &&
		(_jointB.m_physicsJoint.m_type !== yyBox2D.Joint.e_revoluteJoint) &&
	    (_jointB.m_physicsJoint.m_type !== yyBox2D.Joint.e_prismaticJoint))
	{
		return -1;
	}
	
    _bodyA.m_physicsBody.SetAwake(true);
    _bodyB.m_physicsBody.SetAwake(true);	

	// Setup the gear joint
	var jointDef = new yyBox2D.GearJointDef();
	jointDef.bodyA = _bodyA.m_physicsBody;
	jointDef.bodyB = _bodyB.m_physicsBody;
	jointDef.joint1 = _jointA.m_physicsJoint;
	jointDef.joint2 = _jointB.m_physicsJoint;
	jointDef.ratio = _ratio;

	var pulleyJoint = this.m_world.CreateJoint(jointDef);

    // Create the wrapper object for the joint and return it
	var yyJoint = new yyPhysicsJoint(pulleyJoint);
	return yyJoint; 
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetCollisionCategory = function(_objectIndex) {

	for (var n = 0; n < PHYSICS_COLLISION_CATEGORIES; n++)
	{
		if (this.m_objectToCollisionCategory[n].objectIndex == _objectIndex)
		{
			return n;			
		}
	}
	return -1;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.AssignCollisionCategory = function(_objectIndex) {

	// Check to see if we've encountered this object before
	var priorEncounter = this.GetCollisionCategory(_objectIndex);
	if (priorEncounter != -1) {
		return priorEncounter;
	}

	// Else, assign a category for this object and clear the category's settings
	for (var n = 0; n < PHYSICS_COLLISION_CATEGORIES; n++) 
	{
		if (this.m_objectToCollisionCategory[n].objectIndex == -1) 
		{
			this.m_objectToCollisionCategory[n].objectIndex = _objectIndex;
			this.m_objectToCollisionCategory[n].categoryBits = (1 << n);
			this.m_objectToCollisionCategory[n].maskBits = 0;
			return n;
		}
	}

	// We failed to assign a category :(
	return -1;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.FindBaseObjectForCollisions = function(_objectIndex, _collisionSet) {

	var baseObject = _objectIndex;
	var currObject = g_pObjectManager.Get(_objectIndex);
	while ((currObject.ParentID >= 0) && g_pObjectManager.Get(currObject.ParentID)) 
	{
		currObject = g_pObjectManager.Get(currObject.ParentID);
		var currObjectIndex = currObject.ID;

		// Check for an object count being the same as the collision set size and double check that all collisions are represented
		var collisionCount = 0;
		for (var id1 in g_pCollisionList) 
        {    
            if (!g_pCollisionList.hasOwnProperty(id1)) continue;
	
	        for (var id2 in g_pCollisionList[id1]) 
	        {
    	        if (!g_pCollisionList[id1].hasOwnProperty(id2)) continue;
    	        
		        var otherIndex = -1;
		        if (id1 == _objectIndex) {
		        	otherIndex = id2;
		        }
		        else if (id2 == _objectIndex) {
		        	otherIndex = id1;
		        }

		        if (otherIndex != -1) {
		        	collisionCount++;
		        }
		    }
	    }
		// If we've got a different set of collisions then no good
		if (collisionCount !== _collisionSet.length) {
			break;
		}

		// Otherwise the current object could be used as the base object
		baseObject = currObjectIndex;
	}

	return baseObject;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetCollisionSet = function(_objectIndex) {

    var collisionSet = [];
    for (var id1 in g_pCollisionList) 
    {    
        if (!g_pCollisionList.hasOwnProperty(id1)) continue;
	
	    for (var id2 in g_pCollisionList[id1]) 
	    {
	        if (!g_pCollisionList[id1].hasOwnProperty(id2)) continue;
		
		    var otherIndex = -1;
		    if (id1 == _objectIndex) {
		    	otherIndex = id2;
		    }
		    else if (id2 == _objectIndex) {
		    	otherIndex = id1;
		    }

		    if (otherIndex !== -1) {
		    	collisionSet[collisionSet.length] = otherIndex;
		    }
		}
	}
	return collisionSet;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetChildCollisionIntersection = function(_obj, _collisionSet) {

    // Step up the inheritance hierarchy looking for any objects whose parent is _obj.ID
	for (var o in g_pObjectManager.objidlist) {
	
	    if (!g_pObjectManager.objidlist.hasOwnProperty(o)) continue;
	
	    var objCandidate = g_pObjectManager.objidlist[o];
	    if (objCandidate.ParentID === _obj.ID) {
	    	        
	    	// Don't include it if it handles no collisions of any sort
	    	if (this.GetCollisionSet(objCandidate.ID).length !== 0) {
	            _collisionSet[_collisionSet.length] = objCandidate.ID;
	        }
	        this.GetChildCollisionIntersection(objCandidate, _collisionSet);
	    }
	}	
};

// #############################################################################################
/// Function:<summary>
///             Gets all object_indices that can be involved in collisions with an object_index, 
///             including parents
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetFullCollisionSet = function(_objectIndex) {

    var collisionSet = this.GetCollisionSet(_objectIndex);
    
    var baseObject = _objectIndex;
	var currObject = g_pObjectManager.Get(_objectIndex);
	while ((currObject.ParentID >= 0) && g_pObjectManager.Get(currObject.ParentID)) {
	
	    currObject = g_pObjectManager.Get(currObject.ParentID);
	    collisionSet = collisionSet.concat(this.GetCollisionSet(currObject.ID));
	}
	
	// For every item in the collision set we need to see if there's an object which inherited from it 
	// that actually has its own set of collisions, meaning it won't otherwise get used for mask bits etc...
	// for (var n in collisionSet) {
	for (var n = 0; n < collisionSet.length; n++)
	{	
	    var oindex = collisionSet[n];
	    var o = g_pObjectManager.Get(oindex); 
	    this.GetChildCollisionIntersection(o, collisionSet);	    
	}
	
	return collisionSet;
};

// #############################################################################################
/// Function:<summary>
///             Given an object_index assigned a collision bit, ensure object_indices that can collide 
///             with it have their bit mask updated to include this object_index, and vice versa
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.ShareMaskBits = function(_objectIndex, _collisionCategory) {
    
	var collisionSet = this.GetFullCollisionSet(_objectIndex);	
	for (var collisionSetIndex = 0; collisionSetIndex < collisionSet.length; ++collisionSetIndex)
	{
		for (var categoryIndex = 0; categoryIndex < PHYSICS_COLLISION_CATEGORIES; ++categoryIndex)
		{			
			if (this.m_objectToCollisionCategory[categoryIndex].objectIndex == collisionSet[collisionSetIndex]) 
			{				
			    // Setup the mutual collision associations for these categories
				this.m_objectToCollisionCategory[_collisionCategory].maskBits |= this.m_objectToCollisionCategory[categoryIndex].categoryBits;
				this.m_objectToCollisionCategory[categoryIndex].maskBits |= this.m_objectToCollisionCategory[_collisionCategory].categoryBits;
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.BuildCollisionBits = function(_objectIndex) {

    // Check if we've encountered this object index before
    var collisionCategory = this.GetCollisionCategory(_objectIndex);
    if (collisionCategory !== -1) {
        return collisionCategory;
    }

	//Find the set of collisions involving this object
	var collisionSet = this.GetCollisionSet(_objectIndex);
			
	// If no collision events unique to this object have been found it might have a parent that satisfies its collision handling
	// Go up the tree of its parents and find the first with a non-zero set of available collision events
	var objectIndex = _objectIndex;
	if (collisionSet.length === 0) {
	
	    var baseObject = _objectIndex;
	    var currObject = g_pObjectManager.Get(_objectIndex);
	    while ((currObject.ParentID >= 0) && g_pObjectManager.Get(currObject.ParentID)) {
	    
		    currObject = g_pObjectManager.Get(currObject.ParentID);
		    objectIndex = currObject.ID;
		    
		    collisionSet = this.GetCollisionSet(objectIndex);
		    if (collisionSet.length !== 0) {
		    
		        // Assign the collision category according to the object index at this parent level
		        collisionCategory = this.GetCollisionCategory(objectIndex);
		        break;
		    }
		}
		
		// If we still have no available collisions then we're done...
		if (collisionSet.length === 0) {
		    return -1;
		}		
	}
	// Ensure a collision category is assigned for the inheritance level we're at (as affected by the prior loop)
	if (collisionCategory === -1) {	
	    
	    collisionCategory = this.AssignCollisionCategory(objectIndex);
	    if (collisionCategory === -1) { 
	    	return -1;
	    }
    }
    
    // Make sure valid collision pairs are reflected for this object index and category
    this.ShareMaskBits(_objectIndex, collisionCategory);	

	return collisionCategory;
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.UpdateInstantiatedShapesCollisionBits = function() {

	var physicsBody = this.m_world.GetBodyList();
	while ((physicsBody != null) && (physicsBody != undefined))	{	
		
		var pInst = physicsBody.GetUserData();		
		if ((pInst != null) && (pInst != undefined)) {
		
    		var category = pInst.m_physicsObject.m_collisionCategory;
    		if (category != -1)
    		{
    			var fd = new yyBox2D.Filter();
    			fd.categoryBits = this.m_objectToCollisionCategory[category].categoryBits;
    			fd.maskBits = this.m_objectToCollisionCategory[category].maskBits;

                var fixture = physicsBody.GetFixtureList();
                while ((fixture != null) && (fixture != undefined)) {
                            
    			    fd.groupIndex = fixture.GetFilterData().groupIndex;
    			    fixture.SetFilterData(fd);    			    

    			    fixture = fixture.m_next;
    			}
    		}
        }
    	physicsBody = physicsBody.GetNext();
	}
};

// #############################################################################################
/// Function:<summary>
///
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.TestOverlap = function(_inst, _other, _x, _y, _angle) {

    // Create a transform for the instance fixture from the given values
	var instTransform = new yyBox2D.Transform();
	instTransform.Set(new yyBox2D.Vec2(_x, _y), _angle);

    if ((_inst.m_physicsObject === null) || (_inst.m_physicsObject === undefined) ||
        (_other.m_physicsObject === null) || (_other.m_physicsObject === undefined))
    {
        return;
    }    
	var instBody = _inst.m_physicsObject.m_physicsBody;
	var otherBody = _other.m_physicsObject.m_physicsBody;

	var instFixture;
	for (instFixture = instBody.GetFixtureList(); instFixture; instFixture = instFixture.GetNext()) {	

        var otherFixture;
        for (otherFixture = otherBody.GetFixtureList(); otherFixture; otherFixture = instFixture.GetNext()) {		
            
            // Indices refer to chains
            if (yyBox2D.TestShapeOverlap(instFixture.GetShape(), 0, otherFixture.GetShape(), 0, instTransform, otherBody.GetTransform())) {
				return true;
			}			
		}		
	}
	return false;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.CreateParticle = function (_flags, _x, _y, _xspeed, _yspeed, _col, _alpha, _category) {

	var def = new yyBox2D.ParticleDef();
	def.flags = _flags;
	def.position.Set(_x * this.m_pixelToMetreScale, _y * this.m_pixelToMetreScale);			
	def.velocity.Set(_xspeed * this.m_pixelToMetreScale, _yspeed * this.m_pixelToMetreScale);
	def.color.Set((_col & 0xff), (_col & 0xff00) >> 8, (_col & 0xff0000) >> 16, (_alpha * 255.0));
	def.userData = _category;
	return this.m_world.CreateParticle(def);	
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DeleteParticle = function (_particleIndex) {

	this.m_world.DestroyParticle(_particleIndex);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.BeginParticleGroup = function (
    _typeflags, _groupflags, _x, _y, _ang, _xspeed, _yspeed, _omega, _col, _alpha, _strength, _category) 
{
    this.m_particleGroupDef.flags = _typeflags;
	this.m_particleGroupDef.groupFlags = _groupflags;
    this.m_particleGroupDef.angle = (-_ang * Pi) / 180.0;
    this.m_particleGroupDef.angularVelocity = (_omega * Pi) / 180.0;
	this.m_particleGroupDef.position.Set(_x * this.m_pixelToMetreScale, _y * this.m_pixelToMetreScale);	
	this.m_particleGroupDef.linearVelocity.Set(_xspeed * this.m_pixelToMetreScale, _yspeed * this.m_pixelToMetreScale);
	this.m_particleGroupDef.color.Set((_col & 0xff), (_col & 0xff00) >> 8, (_col & 0xff0000) >> 16, (_alpha * 255.0));
	this.m_particleGroupDef.strength = _strength;	
	this.m_particleGroupDef.destroyAutomatically = true;
	this.m_particleGroupDef.userData = _category;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.ParticleGroupCircle = function (_radius) {
		
	var shape = new yyBox2D.CircleShape();
	shape.m_radius = Math.abs(_radius * this.m_pixelToMetreScale);

	this.m_particleGroupDef.shape = shape;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.ParticleGroupBox = function (_halfWidth, _halfHeight) {

	// Ensure at least minimum sizes
	if (_halfWidth == 0.0)	{ _halfWidth = 1.0; }
	if (_halfHeight == 0.0) { _halfHeight = 1.0; }

	var shape = new yyBox2D.PolygonShape();	
	shape.SetAsBox(_halfWidth * this.m_pixelToMetreScale, _halfHeight * this.m_pixelToMetreScale);

	this.m_particleGroupDef.shape = shape;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.ParticleGroupPoly = function () {

	var shape = new yyBox2D.PolygonShape();
	this.m_particleGroupDef.shape = shape;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.ParticleGroupAddPoint = function (_x, _y) {

	if ((this.m_particleGroupDef.shape !== null) && 
	    (this.m_particleGroupDef.shape.m_type === yyBox2D.Shape.e_polygon))
	{		
		var shape = this.m_particleGroupDef.shape;
		// Ignore points beyond this for now - raise it in the docs
		if (shape.m_count < yyBox2D.maxPolygonVertices) 
		{
			shape.m_vertices[shape.m_count++] = new yyBox2D.Vec2(_x * this.m_pixelToMetreScale, _y * this.m_pixelToMetreScale);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetFreeParticleGroupSlot = function () {

	// Check for a free slot first	
	for (var n = 0; n < this.m_ppParticleGroups.length; n++) 
	{
	    var group = this.m_ppParticleGroups[n];
		if (group === null || group === undefined) {
			return n;
		}
	}

    var slot = this.m_ppParticleGroups.length;
	return slot;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroup = function (_groupIndex) {

    if (_groupIndex >= 0 && _groupIndex < this.m_ppParticleGroups.length) 
	{
	    return this.m_ppParticleGroups[_groupIndex];
	}
	return null;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.EndParticleGroup = function () {

	if ((this.m_particleGroupDef.shape !== null) && 
	    (this.m_particleGroupDef.shape.m_type === yyBox2D.Shape.e_polygon))
	{
		// Box2D poly shapes need properly setting, but I've used the shape itself to store points
		// So, copying out and then putting back in, though letting the shape sort the rest out in the process
		var vertices = []; //[b2_maxPolygonVertices];
		var shape = this.m_particleGroupDef.shape;		
		for (var n = 0; n < shape.m_count; n++) {
			vertices[n] = new yyBox2D.Vec2(shape.m_vertices[n].x, shape.m_vertices[n].y);
		}		
		shape.Set(vertices, shape.m_count);				
	}			

	var pGroup = this.m_world.CreateParticleGroup(this.m_particleGroupDef);	

	var groupIndex = this.GetFreeParticleGroupSlot();
	this.m_ppParticleGroups[groupIndex] = pGroup;

	return groupIndex;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.JoinParticleGroups = function (_groupTo, _groupFrom) {

	var pGroupTo = this.GetParticleGroup(_groupTo);
	var pGroupFrom = this.GetParticleGroup(_groupFrom);
	if ((pGroupTo !== null) && (pGroupFrom !== null))
	{
		this.m_world.JoinParticleGroups(pGroupTo, pGroupFrom);
		this.m_ppParticleGroups[_groupFrom] = null;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DeleteParticleGroup = function (_groupIndex) {

	var pGroup = this.GetParticleGroup(_groupIndex);
	if (pGroup !== null)
	{
		this.m_world.DestroyParticlesInGroup(pGroup);
		this.m_ppParticleGroups[_groupIndex] = null;
	}	
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DeleteParticleCircleRegion = function (_x, _y, _radius) {

	var shape = new yyBox2D.CircleShape();
	shape.m_radius = _radius * this.m_pixelToMetreScale;

	var txf = new yyBox2D.Transform();
	txf.p.Set(_x * this.m_pixelToMetreScale, _y * this.m_pixelToMetreScale);
	txf.q.SetIdentity();

	this.m_world.DestroyParticlesInShape(shape, txf);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DeleteParticleBoxRegion = function (_x, _y, _halfWidth, _halfHeight) {

	var shape = new yyBox2D.PolygonShape();
	shape.SetAsBox(_halfWidth * this.m_pixelToMetreScale, _halfHeight * this.m_pixelToMetreScale);

	var txf = new yyBox2D.Transform();
	txf.p.Set(_x * this.m_pixelToMetreScale, _y * this.m_pixelToMetreScale);
	txf.q.SetIdentity();

	this.m_world.DestroyParticlesInShape(shape, txf);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DeleteParticlePolyRegion = function (_points, _count) {

	// Clamp the count to a legitimate size	
	if (_count > yyBox2D.maxPolygonVertices) {
		_count = yyBox2D.maxPolygonVertices;
	}

	var points = []; // [b2_maxPolygonVertices]
	for (var n = 0; n < _count; n++) {
		points[n] = new yyBox2D.Vec2(_points[(n * 2) + 0] * this.m_pixelToMetreScale, _points[(n * 2) + 1] * this.m_pixelToMetreScale);
	}

	var polyShape = new yyBox2D.PolygonShape();
	polyShape.Set(points, _count);

	var txf = new yyBox2D.Transform();
	txf.SetIdentity();	

	this.m_world.DestroyParticlesInShape(polyShape, txf);
};

// #############################################################################################
/// Function:<summary>
///				Fills a user created buffer with the particle data in the following format if
///				all the appropriate flags have been selected by the user
///					- uint32 flags
///					- float x
///					- float y
///					- float vx
///					- float vy
///					- uint8 a,b,g,r
///					- uint32 user data
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleDataRange = function (_buffer, _dataFlags, _startIndex, _endIndex) {

    var count = this.m_world.GetParticleCount();
    
    // Some error checking...	
	if (_startIndex < 0 || _startIndex >= count) return;
	if (_endIndex < _startIndex) return;
	if (_endIndex > count) return;
    

	var flags = this.m_world.GetParticleFlagsBuffer();
	var positions = this.m_world.GetParticlePositionBuffer();	
	var velocities = this.m_world.GetParticleVelocityBuffer();
	var colours = this.m_world.GetParticleColorBuffer();	
	var userData = this.m_world.GetParticleUserDataBuffer();

	var startOffset = _buffer.m_BufferIndex;

	var pixelScale = 1.0 / this.m_pixelToMetreScale;
	for (var n = _startIndex; n < _endIndex; n++) 
	{
		if (_dataFlags & (1 << 0)) { 
			_buffer.yyb_write(eBuffer_U32, flags[n]); 
		}
		if (_dataFlags & (1 << 1)) { 
			_buffer.yyb_write(eBuffer_F32, positions[n].x * pixelScale); 
			_buffer.yyb_write(eBuffer_F32, positions[n].y * pixelScale);
		}
		if (_dataFlags & (1 << 2)) { 
			_buffer.yyb_write(eBuffer_F32, velocities[n].x * pixelScale); 
			_buffer.yyb_write(eBuffer_F32, velocities[n].y * pixelScale); 
		}
		if (_dataFlags & (1 << 3)) { 
			_buffer.yyb_write(eBuffer_U32, (colours[n].a << 24) | (colours[n].r << 16) | (colours[n].g << 8) | colours[n].b);
		}
		if (_dataFlags & (1 << 4)) {
			_buffer.yyb_write(eBuffer_S32, userData[n]);			
		}
	}
	_buffer.yyb_seek(eBuffer_Start, startOffset);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleData = function (_buffer, _dataFlags) {

    this.GetParticleDataRange(_buffer, _dataFlags, 0, this.m_world.GetParticleCount());
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleDataParticle = function (_ind, _pBuff, _dataFlags) {    

    this.GetParticleDataRange(_pBuff, _dataFlags, _ind, _ind + 1);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetParticleFlags = function (_ind, _typeflags) {

    if (_ind >= 0 && _ind < this.m_world.GetParticleCount()) {
        
	    var flags = this.m_world.GetParticleFlagsBuffer();	    
	    flags[_ind] = _typeflags;
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetCategoryFlags = function (_category, _typeflags) {

    // Check and retrieve the texture details    
    var count = this.m_world.GetParticleCount();
	var flags = this.m_world.GetParticleFlagsBuffer();
	var userData = this.m_world.GetParticleUserDataBuffer();

    // Count up the set of particles we need to draw	
	for (var n = 0; n < count; n++) 
	{
		if ((_category === 0) || (_category === userData[n]))
		{
		    flags[n] = _typeflags;
		}
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.SetGroupFlags = function (_groupIndex, _flags) {

	var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
		group.SetGroupFlags(_flags);
	}	
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetGroupFlags = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
		return group.GetGroupFlags();		
	}
	return 0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupCount = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
		return group.GetParticleCount();		
	}
	return 0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleDataGroup = function (_groupIndex, _pBuff, _dataFlags) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
		var start = group.GetBufferIndex();
		var end = start + group.GetParticleCount();
        this.GetParticleDataRange(_pBuff, _dataFlags, start, end);        
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupMass = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetMass();
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupInertia = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetInertia();
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupCentreX = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetCenter().x / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupCentreY = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetCenter().y / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupVelocityX = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetLinearVelocity().x / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupVelocityY = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetLinearVelocity().y / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupOmega = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return (group.GetAngularVelocity() * 180.0) / Math.PI;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupX = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetPosition().x / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupY = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    return group.GetPosition().y / this.m_pixelToMetreScale;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.GetParticleGroupAngle = function (_groupIndex) {

    var group = this.GetParticleGroup(_groupIndex);
	if (group !== null && group !== undefined)
	{
	    var angle = group.GetAngle();
	    return (angle * 180.0) / Math.PI;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DrawParticles_RELEASE = function (_typeMask, _category, _spr, _subimg) {

	var count = this.m_world.GetParticleCount();

	var flags = this.m_world.GetParticleFlagsBuffer();
	var positions = this.m_world.GetParticlePositionBuffer();	
	var colours = this.m_world.GetParticleColorBuffer();	
	var userData = this.m_world.GetParticleUserDataBuffer();
	
	var pixelScale = 1.0 / this.m_pixelToMetreScale;
	for (var n = 0; n < count; n++) 
	{
	    if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
			((_category === 0) || (_category === userData[n])))
		{
			var col = (colours[n].b & 0xff) | ((colours[n].g << 8) & 0xff00) | ((colours[n].r << 16) & 0xff0000);
			_spr.Draw(n, positions[n].x * pixelScale, positions[n].y * pixelScale, 1.0, 1.0, 0, col, colours[n].a / 255.0);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DrawParticlesExt_RELEASE = function (_typeMask, _category, _spr, _subimg, _xscale, _yscale, _angle, _col, _alpha) {

    var count = this.m_world.GetParticleCount();

	var flags = this.m_world.GetParticleFlagsBuffer();
	var positions = this.m_world.GetParticlePositionBuffer();			
	var userData = this.m_world.GetParticleUserDataBuffer();
	
	var pixelScale = 1.0 / this.m_pixelToMetreScale;
	for (var n = 0; n < count; n++) 
	{
		if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
			((_category === 0) || (_category === userData[n])))
		{			
			_spr.Draw(n, positions[n].x * pixelScale, positions[n].y * pixelScale, _xscale, _yscale, _angle, _col, _alpha);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DrawParticles_WebGL = function (_typeMask, _category, _spr, _subimg) {

    // Check and retrieve the texture details    
	var pTPE = _spr.ppTPE[_subimg % _spr.GetCount()];
	if (!pTPE) { return; }
	if (!pTPE.texture.complete) { return; }
	if (!pTPE.texture.webgl_textureid) { WebGL_BindTexture(pTPE); }

	var count = this.m_world.GetParticleCount();
	var flags = this.m_world.GetParticleFlagsBuffer();
	var positions = this.m_world.GetParticlePositionBuffer();	
	var colours = this.m_world.GetParticleColorBuffer();	
	var userData = this.m_world.GetParticleUserDataBuffer();
	var pixelScale = 1.0 / this.m_pixelToMetreScale;

    // Count up the set of particles we need to draw	
	var drawCount = 0;
	for (var n = 0; n < count; n++) 
	{
		if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
			((_category === 0) || (_category === userData[n])))
		{
		    drawCount++;
		}
	}
	if (drawCount === 0) { return; }	
		
	var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, drawCount * 6);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
	var index = stride * pBuff.Current; 
    pBuff.Current += drawCount * 6;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;
    var pUVs = pBuff.UVs;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    
    var x1 =  -(_spr.xOrigin-pTPE.XOffset);
	var y1 =  -(_spr.yOrigin-pTPE.YOffset);
	        
	var x2 = x1 + pTPE.CropWidth;
	var y2 = y1 + pTPE.CropHeight;
    
    var drawn = 0;
    for (var n = 0; n < count; n++) 
	{
		if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
			((_category === 0) || (_category === userData[n])))
		{
		    var x = positions[n].x * pixelScale;
		    var y = positions[n].y * pixelScale;		    
		
		    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = x + x1;
		    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = y + y1;
		    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = x + x2;
		    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = y + y2;
		    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
            
            var col = (colours[n].b & 0xff) | ((colours[n].g << 8) & 0xff00) | ((colours[n].r << 16) & 0xff0000) | ((colours[n].a << 24) & 0xff000000);
            pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
            
            pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = pTPE.x / pTPE.texture.width;
            pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = pTPE.y / pTPE.texture.height;
            pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (pTPE.x + pTPE.w) / pTPE.texture.width;
            pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (pTPE.y + pTPE.h) / pTPE.texture.height;
            
            var nextOffs = stride * 6;
            v0 += nextOffs;
            v1 += nextOffs;
            v2 += nextOffs;
            v3 += nextOffs;
            v4 += nextOffs;
            v5 += nextOffs;
        }
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsWorld.prototype.DrawParticlesExt_WebGL = function (_typeMask, _category, _spr, _subimg, _xscale, _yscale, _angle, _col, _alpha) {

    _angle = (_angle * Math.PI) / 180.0;

    // Check and retrieve the texture details    
	var pTPE = _spr.ppTPE[_subimg % _spr.GetCount()];
	if (!pTPE) { return; }
	if (!pTPE.texture.complete) { return; }
	if (!pTPE.texture.webgl_textureid) { WebGL_BindTexture(pTPE); }

	var count = this.m_world.GetParticleCount();
	var flags = this.m_world.GetParticleFlagsBuffer();
	var positions = this.m_world.GetParticlePositionBuffer();		
	var userData = this.m_world.GetParticleUserDataBuffer();
	var pixelScale = 1.0 / this.m_pixelToMetreScale;

    // Count up the set of particles we need to draw	
	var drawCount = 0;
	for (var n = 0; n < count; n++) 
	{
		if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
			((_category === 0) || (_category === userData[n])))
		{
		    drawCount++;
		}
	}
	if (drawCount === 0) { return; }	
		
	var pBuff = g_webGL.AllocVerts(yyGL.PRIM_TRIANGLE, pTPE.texture.webgl_textureid, g_webGL.VERTEX_FORMAT_2D, drawCount * 6);
	var stride = pBuff.GetStride() >> 2; // built-in vbuffer arrays have 4 byte long types
	var index = stride * pBuff.Current; 
    pBuff.Current += drawCount * 6;

    var pCoords = pBuff.Coords;
    var pColours = pBuff.Colours;
    var pUVs = pBuff.UVs;
    
    var v0 = index;
    var v1 = v0 + stride;
    var v2 = v1 + stride;
    var v3 = v2 + stride;
    var v4 = v3 + stride;
    var v5 = v4 + stride;
    
    // _col, _alpha
    var col = _col | (((_alpha * 255) & 0xff) << 24);    
    
    var x1 =  -_xscale * (_spr.xOrigin-pTPE.XOffset);
	var y1 =  -_yscale * (_spr.yOrigin-pTPE.YOffset);
	var x2 = x1 + (_xscale*pTPE.CropWidth);
	var y2 = y1 + (_yscale*pTPE.CropHeight);
    
    var drawn = 0;
    if (Math.abs(_angle) < 0.0001) 
    {        	    
        for (var n = 0; n < count; n++) 
	    {
	    	if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
	    		((_category === 0) || (_category === userData[n])))
	    	{
	    	    var x = positions[n].x * pixelScale;
	    	    var y = positions[n].y * pixelScale;
	    			    		
	    	    pCoords[v0 + 0] = pCoords[v4 + 0] = pCoords[v5 + 0] = x + x1;
	    	    pCoords[v0 + 1] = pCoords[v1 + 1] = pCoords[v5 + 1] = y + y1;
	    	    pCoords[v1 + 0] = pCoords[v2 + 0] = pCoords[v3 + 0] = x + x2;
	    	    pCoords[v2 + 1] = pCoords[v3 + 1] = pCoords[v4 + 1] = y + y2;
	    	    pCoords[v0 + 2] = pCoords[v1 + 2] = pCoords[v2 + 2] = pCoords[v3 + 2] = pCoords[v4 + 2] = pCoords[v5 + 2] = GR_Depth;
                            
                pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
                
                pUVs[v0 + 0] = pUVs[v4 + 0] = pUVs[v5 + 0] = pTPE.x / pTPE.texture.width;
                pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = pTPE.y / pTPE.texture.height;
                pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (pTPE.x + pTPE.w) / pTPE.texture.width;
                pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (pTPE.y + pTPE.h) / pTPE.texture.height;
                
                var nextOffs = stride * 6;
                v0 += nextOffs;
                v1 += nextOffs;
                v2 += nextOffs;
                v3 += nextOffs;
                v4 += nextOffs;
                v5 += nextOffs;
            }
        }
    }
    else 
    {
        var ss = Math.sin(_angle); 
		var cc = Math.cos(_angle);
		var x1_cc = x1*cc;
		var x2_cc = x2*cc;
		var y1_cc = y1*cc;
		var y2_cc = y2*cc;
		var x1_ss = x1*ss;
		var x2_ss = x2*ss;
		var y1_ss = y1*ss;
		var y2_ss = y2*ss;
		
        for (var n = 0; n < count; n++) 
	    {
	    	if (((flags[n] === 0) || ((flags[n] & _typeMask) !== 0)) &&
	    		((_category === 0) || (_category === userData[n])))
	    	{
	    	    var x = positions[n].x * pixelScale;
	    	    var y = positions[n].y * pixelScale;	    	    
                
		        pCoords[v0 + 0] = pCoords[v5 + 0]= x + x1_cc + y1_ss;
		        pCoords[v0 + 1] = pCoords[v5 + 1]= y - x1_ss + y1_cc;
		        pCoords[v2 + 0] = pCoords[v3 + 0] = x + x2_cc + y2_ss;
		        pCoords[v2 + 1] = pCoords[v3 + 1] = y - x2_ss + y2_cc;
		        
		        pCoords[v1 + 1] = y - x2_ss + y1_cc;
		        pCoords[v1 + 0] = x + x2_cc + y1_ss;
		        pCoords[v4 + 0] = x + x1_cc + y2_ss;
		        pCoords[v4 + 1] = y - x1_ss + y2_cc;
                            
                pColours[v0] = pColours[v1] = pColours[v2] = pColours[v3] = pColours[v4] = pColours[v5] = col;
                
                pUVs[v0 + 0] =  pUVs[v4 + 0] = pUVs[v5 + 0] = pTPE.x / pTPE.texture.width;
                pUVs[v0 + 1] = pUVs[v1 + 1] = pUVs[v5 + 1] = pTPE.y / pTPE.texture.height;
                pUVs[v1 + 0] = pUVs[v2 + 0] = pUVs[v3 + 0] = (pTPE.x + pTPE.w) / pTPE.texture.width;
                pUVs[v2 + 1] = pUVs[v3 + 1] = pUVs[v4 + 1] = (pTPE.y + pTPE.h) / pTPE.texture.height;
                
                var nextOffs = stride * 6;
                v0 += nextOffs;
                v1 += nextOffs;
                v2 += nextOffs;
                v3 += nextOffs;
                v4 += nextOffs;
                v5 += nextOffs;
            }
        }
    }
};


yyPhysicsWorld.prototype.GetParticleCount = function ()             { return this.m_world.GetParticleCount(); };

yyPhysicsWorld.prototype.GetParticleMaxCount = function ()          { return this.m_world.GetParticleMaxCount(); };
yyPhysicsWorld.prototype.GetParticleRadius = function ()            { return this.m_world.GetParticleRadius() * (1.0 / this.m_pixelToMetreScale); };
yyPhysicsWorld.prototype.GetParticleDensity = function ()           { return this.m_world.GetParticleDensity(); };
yyPhysicsWorld.prototype.GetParticleDamping = function ()           { return this.m_world.GetParticleDamping(); };
yyPhysicsWorld.prototype.GetParticleGravityScale = function ()      { return this.m_world.GetParticleGravityScale(); }	;

yyPhysicsWorld.prototype.SetParticleMaxCount = function (_count)    { this.m_world.SetParticleMaxCount(_count); };
yyPhysicsWorld.prototype.SetParticleRadius = function (_radius)     { this.m_world.SetParticleRadius(_radius * this.m_pixelToMetreScale); };
yyPhysicsWorld.prototype.SetParticleDensity = function (_density)   { this.m_world.SetParticleDensity(_density); };
yyPhysicsWorld.prototype.SetParticleDamping = function (_damping)   { this.m_world.SetParticleDamping(_damping); };
yyPhysicsWorld.prototype.SetParticleGravityScale = function (_scale){ this.m_world.SetParticleGravityScale(_scale); };
