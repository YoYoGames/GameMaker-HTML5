// **********************************************************************************************************************
// 
// Copyright (c)2012, YoYo Games Ltd. All Rights reserved.
// 
// File:			yyPhysicsJoint.js
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
var JOINT_ANCHOR_1_X = 0,
    JOINT_ANCHOR_1_Y = 1,
    JOINT_ANCHOR_2_X = 2,
    JOINT_ANCHOR_2_Y = 3,
    JOINT_REACTION_FORCE_X = 4,
    JOINT_REACTION_FORCE_Y = 5,
    JOINT_REACTION_TORQUE = 6,
    JOINT_MOTOR_SPEED = 7,
    JOINT_ANGLE = 8,
    JOINT_MOTOR_TORQUE = 9,
    JOINT_MAX_MOTOR_TORQUE = 10,
    JOINT_TRANSLATION = 11,
    JOINT_SPEED = 12,
    JOINT_MOTOR_FORCE = 13,
    JOINT_MAX_MOTOR_FORCE = 14,
    JOINT_LENGTH_1 = 15,    
    JOINT_LENGTH_2 = 16,
    JOINT_DAMPING_RATIO = 17,
    JOINT_FREQUENCY = 18,
    JOINT_LOWER_ANGLE_LIMIT = 19,
    JOINT_UPPER_ANGLE_LIMIT = 20,
    JOINT_ANGLE_LIMITS = 21,
    JOINT_MAX_LENGTH = 22,
    JOINT_MAX_TORQUE = 23,
    JOINT_MAX_FORCE = 24;


// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @constructor */
function yyPhysicsJoint(_b2Joint) {
	    
    this.m_physicsJoint = _b2Joint;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsJoint.prototype.EnableMotor = function(_motorState) {

    if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
        (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) ||
        (this.m_physicsJoint instanceof yyBox2D.WheelJoint)) 
    {        
        this.m_physicsJoint.GetBodyA().SetAwake(true);
        this.m_physicsJoint.GetBodyB().SetAwake(true);
        this.m_physicsJoint.EnableMotor(_motorState);
    }
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsJoint.prototype.GetValue = function(_field) {

    switch (_field)
	{
		case JOINT_ANCHOR_1_X:							// All joint types
			return this.m_physicsJoint.GetAnchorA().x;
		case JOINT_ANCHOR_1_Y:
			return this.m_physicsJoint.GetAnchorA().y;
		case JOINT_ANCHOR_2_X:
			return this.m_physicsJoint.GetAnchorB().x;
		case JOINT_ANCHOR_2_Y:
			return this.m_physicsJoint.GetAnchorB().y;
		case JOINT_REACTION_FORCE_X:
			return this.m_physicsJoint.GetReactionForce(1.0 / g_RunRoom.m_pPhysicsWorld.m_timeStep).x;
		case JOINT_REACTION_FORCE_Y:	
			return this.m_physicsJoint.GetReactionForce(1.0 / g_RunRoom.m_pPhysicsWorld.m_timeStep).y;			
		case JOINT_REACTION_TORQUE:
			return this.m_physicsJoint.GetReactionTorque(1.0 / g_RunRoom.m_pPhysicsWorld.m_timeStep);

		case JOINT_MOTOR_SPEED:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
                (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) ||
                (this.m_physicsJoint instanceof yyBox2D.WheelJoint))
            {    						
				return this.m_physicsJoint.GetMotorSpeed();
			}
		}
		break;

		case JOINT_ANGLE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
				return this.m_physicsJoint.GetJointAngle();
			}
			else if (this.m_physicsJoint instanceof yyBox2D.WeldJoint) {
				return this.m_physicsJoint.GetReferenceAngle();
			}
		}
		break;
		case JOINT_MOTOR_TORQUE:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
			    (this.m_physicsJoint instanceof yyBox2D.WheelJoint)) 
			{
				return this.m_physicsJoint.GetMotorTorque(1.0 / g_RunRoom.m_pPhysicsWorld.m_timeStep);
			}
		}
		break;
		case JOINT_MAX_MOTOR_TORQUE:
		{
		    if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
		        (this.m_physicsJoint instanceof yyBox2D.WheelJoint)) 
		    {
			    return this.m_physicsJoint.GetMaxMotorTorque();
			}	
		}
		break;

		case JOINT_TRANSLATION:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) ||
			    (this.m_physicsJoint instanceof yyBox2D.WheelJoint))
			{				
				return this.m_physicsJoint.GetJointTranslation();
			}
		}
		break;
		case JOINT_SPEED:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) ||
			    (this.m_physicsJoint instanceof yyBox2D.WheelJoint))  
			{
				return this.m_physicsJoint.GetJointSpeed();
			}
		}
		break;
		case JOINT_MOTOR_FORCE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) {
				return this.m_physicsJoint.GetMotorForce(1.0 / g_RunRoom.m_pPhysicsWorld.m_timeStep);
			}
		}
		break;
		case JOINT_MAX_MOTOR_FORCE:
		{
		    if (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) {		    
				return this.m_physicsJoint.GetMaxMotorForce();
			}
		}
		break;


		case JOINT_LENGTH_1:
		{		
			if (this.m_physicsJoint instanceof yyBox2D.PulleyJoint) {				
				return this.m_physicsJoint.GetLengthA();
			}
			if (this.m_physicsJoint instanceof yyBox2D.DistanceJoint) {
			    return this.m_physicsJoint.GetLength();
			}
		}
		break;


		case JOINT_LENGTH_2:
		{
			if (this.m_physicsJoint instanceof yyBox2D.PulleyJoint) {
				return this.m_physicsJoint.GetLengthB();
			}
		}
		break;
		case JOINT_DAMPING_RATIO:
		{
		    if ((this.m_physicsJoint instanceof yyBox2D.DistanceJoint) ||
		        (this.m_physicsJoint instanceof yyBox2D.WeldJoint)) 
		    {
			    this.m_physicsJoint.GetDampingRatio();
			}
			else if (this.m_physicsJoint instanceof yyBox2D.WheelJoint) {
			    return this.m_physicsJoint.GetSpringDampingRatio();
			}
		}
		break;
		case JOINT_FREQUENCY:
		{
		    if ((this.m_physicsJoint instanceof yyBox2D.DistanceJoint) ||
		        (this.m_physicsJoint instanceof yyBox2D.WeldJoint)) 
		    {
			    return this.m_physicsJoint.GetFrequency();
			}
			else if (this.m_physicsJoint instanceof yyBox2D.WheelJoint) {
			    return this.m_physicsJoint.GetSpringFrequencyHz();
			}
		}
		break;	


		case JOINT_LOWER_ANGLE_LIMIT:
		{
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    return ((this.m_physicsJoint.GetLowerLimit() * 180.0) / Math.PI);
			}
		}
		break;	
        case JOINT_UPPER_ANGLE_LIMIT:
        {
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    return ((this.m_physicsJoint.GetUpperLimit() * 180.0) / Math.PI);
			}
		}
		break;
        case JOINT_ANGLE_LIMITS:
        {
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    return this.m_physicsJoint.IsLimitEnabled();
			}
		}
		break;
		
		case JOINT_MAX_LENGTH:
		{
			if (this.m_physicsJoint instanceof yyBox2D.RopeJoint) {
			    return this.m_physicsJoint.GetMaxLength();
			}
		}
		break;
		
		case JOINT_MAX_TORQUE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.FrictionJoint) {
				return this.m_physicsJoint.GetMaxTorque();
			}
		}
		break;
		case JOINT_MAX_FORCE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.FrictionJoint) {
				return this.m_physicsJoint.GetMaxForce();
			}
		}
	}
	return 0;
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yyPhysicsJoint.prototype.SetValue = function(_field, _value) {

    switch (_field)
	{
		case JOINT_MOTOR_SPEED:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
                (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) ||
                (this.m_physicsJoint instanceof yyBox2D.WheelJoint)) 
            {        
                this.m_physicsJoint.GetBodyA().SetAwake(true);
                this.m_physicsJoint.GetBodyB().SetAwake(true);	
                this.m_physicsJoint.SetMotorSpeed(_value);				
			}
		}
		break;
					
		case JOINT_MAX_MOTOR_TORQUE:
		{
			if ((this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) ||
			    (this.m_physicsJoint instanceof yyBox2D.WheelJoint))
            {        
                this.m_physicsJoint.GetBodyA().SetAwake(true);
                this.m_physicsJoint.GetBodyB().SetAwake(true);	
                this.m_physicsJoint.SetMaxMotorTorque(_value);				
			}
		}
		break;

		case JOINT_MAX_MOTOR_FORCE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.PrismaticJoint) {
				this.m_physicsJoint.SetMaxMotorForce(_value);
			}
		}
		break;

		
		case JOINT_LENGTH_1:
		{
		    if (this.m_physicsJoint instanceof yyBox2D.DistanceJoint) {
			    this.m_physicsJoint.SetLength(_value);
			}
		}
		break;
		case JOINT_DAMPING_RATIO:
		{
		    if ((this.m_physicsJoint instanceof yyBox2D.DistanceJoint) ||
		        (this.m_physicsJoint instanceof yyBox2D.WeldJoint))
		    {
			    this.m_physicsJoint.SetDampingRatio(_value);
			}
			else if (this.m_physicsJoint instanceof yyBox2D.WheelJoint) {
			    this.m_physicsJoint.SetSpringDampingRatio(_value);
			}
		}
		break;
		case JOINT_FREQUENCY:
		{
		    if ((this.m_physicsJoint instanceof yyBox2D.DistanceJoint) ||
		        (this.m_physicsJoint instanceof yyBox2D.WeldJoint)) 
		    {		    
			    this.m_physicsJoint.SetFrequency(_value);
			}
			else if (this.m_physicsJoint instanceof yyBox2D.WheelJoint) {
			    this.m_physicsJoint.SetSpringFrequencyHz(_value);
			}
		}
		break;

		
		case JOINT_LOWER_ANGLE_LIMIT:
		{
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    var angle = (_value * Math.PI) / 180.0;
			    this.m_physicsJoint.SetLimits(angle, this.m_physicsJoint.GetUpperLimit());
			}
		}
		break;	
        case JOINT_UPPER_ANGLE_LIMIT:
        {
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    var angle = (_value * Math.PI) / 180.0;
			    this.m_physicsJoint.SetLimits(this.m_physicsJoint.GetLowerLimit(), angle);			    
			}
		}
		break;
        case JOINT_ANGLE_LIMITS:
        {
		    if (this.m_physicsJoint instanceof yyBox2D.RevoluteJoint) {
			    this.m_physicsJoint.EnableLimit((_value > 0.5) ? true : false);
			}
		}
		break;	
		
		case JOINT_MAX_LENGTH:
		{
			if (this.m_physicsJoint instanceof yyBox2D.RopeJoint) {
			    this.m_physicsJoint.SetMaxLength(_value);
			}
		}
		break;
		
		case JOINT_MAX_TORQUE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.FrictionJoint) {
				this.m_physicsJoint.SetMaxTorque(_value);
			}
		}
		break;
		case JOINT_MAX_FORCE:
		{
			if (this.m_physicsJoint instanceof yyBox2D.FrictionJoint) {
				this.m_physicsJoint.SetMaxForce(_value);
			}
		}
		break;
	}
};