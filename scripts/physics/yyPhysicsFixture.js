// **********************************************************************************************************************
// 
// Copyright (c)2012, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyPhysicsFixture.js
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
// @if feature("physics")
/** @constructor */
function yyPhysicsFixture() {
//function yyPhysicsFixture(_fixtureID) {

	// These not part of the shape definition but required when setting up the physical body
	this.m_linearDamping = 0;
	this.m_angularDamping = 0;
	//this.m_fixtureID = _fixtureID;
	
	this.m_kinematic = false;
	this.m_awake = true;
	
	this.m_loopChain = false;
	
	// Box2D definition for this fixture
    this.m_fixtureDef = new yyBox2D.FixtureDef();   
    
    // Array for building up polygon vertices
    this.m_vertices = null;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetCircleShape = function(_radius) {

    this.m_vertices = null;
    this.m_fixtureDef.shape = new yyBox2D.CircleShape();
    this.m_fixtureDef.shape.m_radius = _radius;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetBoxShape = function(_halfWidth, _halfHeight) {

    this.m_vertices = null;
    this.m_fixtureDef.shape = new yyBox2D.PolygonShape();
    this.m_fixtureDef.shape.SetAsBox(_halfWidth, _halfHeight);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetPolygonShape = function() {

    this.m_vertices = [];
    this.m_fixtureDef.shape = new yyBox2D.PolygonShape();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetChainShape = function(_loop) {
    
    this.m_vertices = [];
    this.m_loopChain = _loop;
    this.m_fixtureDef.shape = new yyBox2D.ChainShape();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetEdgeShape = function(v1x, v1y, v2x, v2y) {
    
    var v1 = new yyBox2D.Vec2(v1x,v1y);
    var v2 = new yyBox2D.Vec2(v2x,v2y);

    this.m_vertices = null; 
    this.m_fixtureDef.shape = new yyBox2D.EdgeShape();
    this.m_fixtureDef.shape.Set(v1, v2);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.AddShapePoint = function(_x, _y) {

    var vertexCount = this.m_vertices.length;    
    this.m_vertices[vertexCount] = new yyBox2D.Vec2(_x, _y);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.Finalise = function() {
             
    // If no vertices for this shape then there's nothing to worry about
    if (this.m_vertices === null || this.m_vertices === undefined) {
        return true;
    }

    if (this.m_fixtureDef.shape.m_type === yyBox2D.Shape.e_polygon) {
    
        if (this.m_vertices.length > 2) {
            this.m_fixtureDef.shape.Set(this.m_vertices, this.m_vertices.length);            
            return true;
        }        
    }
    else if (this.m_fixtureDef.shape.m_type === yyBox2D.Shape.e_chain) {
                
        if (this.m_loopChain) {
            if (this.m_vertices.length >= 3) {
                this.m_fixtureDef.shape.CreateLoop(this.m_vertices, this.m_vertices.length);
                return true;
            }
        }
        else {
            if (this.m_vertices.length >= 2) {
                this.m_fixtureDef.shape.CreateChain(this.m_vertices, this.m_vertices.length);
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
yyPhysicsFixture.prototype.SetCollisionGroup = function(_group) { 

    this.m_fixtureDef.filter.groupIndex = _group; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetFriction = function(_friction) {

    this.m_fixtureDef.friction = _friction; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetRestitution = function(_restitution) {

    this.m_fixtureDef.restitution = _restitution; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetDensity = function(_density) {

    this.m_fixtureDef.density = _density; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetSensor = function(_isSensor) {

    this.m_fixtureDef.isSensor = _isSensor; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetLinearDamping = function(_damping) {

    this.m_linearDamping = _damping; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetAngularDamping = function(_damping) { 

    this.m_angularDamping = _damping; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetAngularDamping = function(_damping) { 

    this.m_angularDamping = _damping; 
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetAwake = function(_awake) { 

    this.m_awake = _awake;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsFixture.prototype.SetKinematic = function() {
    
    this.m_kinematic = true;
};
// @endif
