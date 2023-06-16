// **********************************************************************************************************************
// 
// Copyright (c)2012, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyPhysicsObject.js
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
/** @constructor */
function yyPhysicsObject(_b2Body, _collisionCategory, _xo, _yo) {
	    		
    this.m_physicsBody = _b2Body;
    this.m_collisionCategory = _collisionCategory;
    this.m_visualOffset = new yyBox2D.Vec2(_xo, _yo);
    this.m_fixtures = [];    
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyImpulse = function(_xWorld, _yWorld, _xForceWorld, _yForceWorld) {
    
    this.m_physicsBody.ApplyLinearImpulse(
        new yyBox2D.Vec2(_xForceWorld, _yForceWorld), 
        new yyBox2D.Vec2(_xWorld, _yWorld),
        true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyForce = function(_xWorld, _yWorld, _xForceWorld, _yForceWorld) {
    
    this.m_physicsBody.ApplyForce(new yyBox2D.Vec2(_xForceWorld, _yForceWorld), new yyBox2D.Vec2(_xWorld, _yWorld), true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyLocalForce = function(_xLocal, _yLocal, _xForceLocal, _yForceLocal) {

    var worldForceVec = this.m_physicsBody.GetWorldVector(new yyBox2D.Vec2(_xForceLocal, _yForceLocal));
	var worldPos = this.m_physicsBody.GetWorldPoint(new yyBox2D.Vec2(_xLocal, _yLocal));		
	this.m_physicsBody.ApplyForce(worldForceVec, worldPos, true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyLocalImpulse = function(_xLocal, _yLocal, _xForceLocal, _yForceLocal) {

    var worldForceVec = this.m_physicsBody.GetWorldVector(new yyBox2D.Vec2(_xForceLocal, _yForceLocal));
	var worldPos = this.m_physicsBody.GetWorldPoint(new yyBox2D.Vec2(_xLocal, _yLocal));	
	this.m_physicsBody.ApplyLinearImpulse(worldForceVec, worldPos, true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyAngularImpulse = function(_impulse) {
    
    this.m_physicsBody.ApplyAngularImpulse(_impulse, true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.ApplyTorque = function(_torque) {
    
    this.m_physicsBody.ApplyTorque(_torque, true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetMass = function(_mass, _cxMetres, _cyMetres, _inertia) {

    var massData = new yyBox2D.MassData();
	massData.mass = _mass;
	massData.I = _inertia;
	massData.center = new yyBox2D.Vec2(_cxMetres, _cyMetres);
	this.m_physicsBody.SetMassData(massData);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetRotation = function(_rotation) {
    
    var position = this.m_physicsBody.GetPosition();
    this.m_physicsBody.SetTransform(position, (_rotation * Math.PI) / 180.0);
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetPositionX = function(_pos) {

    var angle = this.m_physicsBody.GetAngle();
    var posY = this.m_physicsBody.GetPosition().y;
    this.m_physicsBody.SetTransform(new yyBox2D.Vec2(_pos, posY), angle);
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetPositionY = function(_pos) {

    var angle = this.m_physicsBody.GetAngle();
    var posX = this.m_physicsBody.GetPosition().x;
    this.m_physicsBody.SetTransform(new yyBox2D.Vec2(posX, _pos), angle);
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetAngularVelocity = function(_angular_velocity) {

    this.m_physicsBody.SetAngularVelocity((_angular_velocity * Math.PI) / 180.0);
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetLinearVelocityX = function(_vel) {

    var linearVel = this.m_physicsBody.GetLinearVelocity();
    this.m_physicsBody.SetLinearVelocity(new yyBox2D.Vec2(_vel, linearVel.y));
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetLinearVelocityY = function(_vel) {

    var linearVel = this.m_physicsBody.GetLinearVelocity();
    this.m_physicsBody.SetLinearVelocity(new yyBox2D.Vec2(linearVel.x, _vel));
    this.m_physicsBody.SetAwake(true);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetBullet = function(_isBullet) {

    this.m_physicsBody.SetBullet(_isBullet);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetFixedRotation = function(_isFixed) {

    this.m_physicsBody.SetFixedRotation(_isFixed);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetActive = function(_isActive) {

    this.m_physicsBody.SetActive(_isActive);    
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRender = function(_metreToPixelScale)
{
	if (this.m_physicsBody) 
	{		
		this.DebugRenderShapes(_metreToPixelScale);
		this.DebugRenderJoints(_metreToPixelScale);
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderShapes = function(_scale) {

    var fixture = this.m_physicsBody.GetFixtureList();
    while ((fixture != null) && (fixture != undefined)) {
    
        var shape = fixture.GetShape();
		var transform = this.m_physicsBody.GetTransform();
		if (shape instanceof yyBox2D.CircleShape)
	    {
			var center = yyBox2D.Mul_t_v2(transform, shape.m_p);
			draw_ellipse(
				(center.x - shape.m_radius) * _scale, 
				(center.y - shape.m_radius) * _scale, 
				(center.x + shape.m_radius) * _scale, 
				(center.y + shape.m_radius) * _scale, 
				true);
	    }
	    else if (shape instanceof yyBox2D.PolygonShape)
        {	                    		
			var sn = Math.sin(this.m_physicsBody.GetAngle());
			var cs = Math.cos(this.m_physicsBody.GetAngle());
			for (var n = 0; n < shape.m_count; ++n) 
			{
				var posA = shape.m_vertices[n];
				var posB = shape.m_vertices[(n + 1) % shape.m_count];
				var posAT = yyBox2D.Mul_t_v2(transform, posA);
				var posBT = yyBox2D.Mul_t_v2(transform, posB);
				draw_line(posAT.x * _scale, posAT.y * _scale, posBT.x * _scale, posBT.y * _scale);
			}			
		}		
		fixture = fixture.m_next;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderJoints = function(_scale) {
    
    var jn = this.m_physicsBody.m_jointList;
    while ((jn != null) && (jn != undefined)) {
               
		var joint = jn.joint;
		if (joint instanceof yyBox2D.RevoluteJoint) {				
			this.DebugRenderRevoluteJoint(joint, _scale);
		}
        else if (joint instanceof yyBox2D.PrismaticJoint) {
            this.DebugRenderPrismaticJoint(joint, _scale);				
	    }		
        else if (joint instanceof yyBox2D.DistanceJoint) {			
		    this.DebugRenderDistanceJoint(joint, _scale);				
		}
		else if (joint instanceof yyBox2D.PulleyJoint) {
			this.DebugRenderPulleyJoint(joint, _scale);					
		}	
        else if (joint instanceof yyBox2D.GearJoint) {
        
            if (joint.m_revolute1 != null) {
			    this.DebugRenderRevoluteJoint(joint.m_revolute1, _scale);
			}
			if (joint.m_revolute2 != null) {
			    this.DebugRenderRevoluteJoint(joint.m_revolute2, _scale);
			}
			if (joint.m_prismatic1 != null) {
			    this.DebugRenderPrismaticJoint(joint.m_prismatic1, _scale);
			}
			if (joint.m_prismatic2 != null) {
			    this.DebugRenderPrismaticJoint(joint.m_prismatic2, _scale);
			}
        }
		jn = jn.m_next;
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderDistanceJoint = function(_joint, _scale) {

    var anchor1 = _joint.GetAnchorA();
    var anchor2 = _joint.GetAnchorB();
	draw_line(anchor1.x * _scale, anchor1.y * _scale, anchor2.x * _scale, anchor2.y * _scale);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderRevoluteJoint = function(_joint, _scale) {

    var anchor = _joint.GetAnchorA();
	// Draw a cross-hairs at this location
	draw_line(
		(anchor.x * _scale) - 2, (anchor.y * _scale) - 2,
		(anchor.x * _scale) + 2, (anchor.y * _scale) + 2);
	draw_line(
		(anchor.x * _scale) - 2, (anchor.y * _scale) + 2,
		(anchor.x * _scale) + 2, (anchor.y * _scale) - 2);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderPrismaticJoint = function(_joint, _scale) {

    var anchor1 = _joint.GetAnchorA();
	var anchor2 = this.m_physicsBody.GetPosition();
	draw_line(
		anchor1.x * _scale, anchor1.y * _scale,
		anchor2.x * _scale, anchor2.y * _scale);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.DebugRenderPulleyJoint = function(_joint, _scale) {

    // Find which part of the pulley joint we belong to
	var anchor, groundAnchor;
	if (_joint.GetBody1() == this.m_physicsBody)
	{
		anchor = _joint.GetAnchorA();
		groundAnchor = _joint.GetGroundAnchorA();
	}
	else
	{
		anchor = _joint.GetAnchorB();
		groundAnchor = _joint.GetGroundAnchorB();
	}
	// Draw line from object to its ground anchor
	draw_line(
		anchor.x * _scale, anchor.y * _scale,
		groundAnchor.x * _scale, groundAnchor.y * _scale);

	// Draw a line between ground anchors
	draw_line(
		_joint.GetGroundAnchorA().x * _scale, _joint.GetGroundAnchorA().y * _scale,
		_joint.GetGroundAnchorB().x * _scale, _joint.GetGroundAnchorB().y * _scale);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.GetFixtureIndex = function(_fixture) {

    // Search for a free slot first
    for (var i = 0; i < this.m_fixtures.length; i++) {
        if (this.m_fixtures[i] == null || this.m_fixtures[i] == undefined) {
            this.m_fixtures[i] = _fixture;
            return i;
        }
    }
    return (this.m_fixtures.push(_fixture) - 1);
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.RemoveFixture = function(_fixtureIndex) {

    if (this.m_fixtures[_fixtureIndex]) {
    
        this.m_physicsBody.DestroyFixture(this.m_fixtures[_fixtureIndex]);
        this.m_fixtures[_fixtureIndex] = undefined;
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.GetFriction = function(_fixtureIndex) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        return this.m_fixtures[_fixtureIndex].GetFriction();
    }
    return 0.0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.GetDensity = function(_fixtureIndex) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        return this.m_fixtures[_fixtureIndex].GetDensity();
    }
    return 0.0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.GetRestitution = function(_fixtureIndex) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        return this.m_fixtures[_fixtureIndex].GetRestitution();
    }
    return 0.0;
};


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetFriction = function(_fixtureIndex, _val) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        this.m_fixtures[_fixtureIndex].SetFriction(_val);
    }    
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetDensity = function(_fixtureIndex, _val) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        this.m_fixtures[_fixtureIndex].SetDensity(_val);
        this.m_physicsBody.ResetMassData();
    }    
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsObject.prototype.SetRestitution = function(_fixtureIndex, _val) {

    if (this.m_fixtures[_fixtureIndex]) {
            
        this.m_fixtures[_fixtureIndex].SetRestitution(_val);
    }    
};