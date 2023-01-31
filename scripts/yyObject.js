// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyObject.js
// Created:			25/10/2011
// Author:			Mike
// Project:			HTML5
// Description:		Object class
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// ??/??/2011		V1.0		MJD		1st version
// 25/10/2011		V1.1		MJD		Fixing collision loading.
//
// **********************************************************************************************************************

var OBJECT_PHYSICS_SHAPE_CIRCLE = 0,
    OBJECT_PHYSICS_SHAPE_BOX = 1,
    OBJECT_PHYSICS_SHAPE_POLY = 2;

// #############################################################################################
/// Function:<summary>
///          	Create a collision
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/**@constructor*/
function yyTriggerEvent() {
	this.m_pFunction = null; 	// function to call
	this.m_Index = 0; 			// trigger index
	this.m_pTrigger = null; 	// Actual trigger entry
}

// #############################################################################################
/// Function:<summary>
///          	Create a collision
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
/**@constructor*/
function yyCollisionEntry() {
	this.m_pFunction = null;		// function to call
	this.m_derived = false;			// is this a derived call?
	this.m_pObject = null;			// the object that this function came from.
}

// #############################################################################################
/// Function:<summary>
///          	Create storage for object level physics data
///          </summary>
// #############################################################################################
/**@constructor*/
function yyPhysicsData() {

    this.physicsObject = false;
    /*this.physicsSensor = false;
    this.physicsShape = 0;
    this.physicsDensity = 0;
    this.physicsRestitution = 0;
    this.physicsGroup = 0;
    this.physicsLinearDamping = 0;
    this.physicsAngularDamping = 0;
    this.friction = 0;*/
}

// #############################################################################################
/// Function:<summary>
///             Our object class
///          </summary>
///
/// In:		 <param name="objectnumber">Object number</param>
///			 <param name="name">Name of the object</param>
// #############################################################################################
/**@constructor*/
function    yyObject( _objectnumber, _name )
{
    this.__type = "[Object]";
    this.Flags = 0;
    this.ID = _objectnumber;							// object ID
    this.Name = _name;								// object name
    this.SpriteMask = -1;                           // index of the mask sprite
    this.SpriteIndex = 0;                           // index of the sprite used
    this.Depth = 0;                                 // depth of the object
    this.Solid = false;
    this.Visible = false;
    this.Persistent = false;
    this.ParentID = 0;                              // index of the parent
    this.pParent = null;

    this.ManagerIndex = -1;                          // the index int the manager
    this.CollisionDone = false;						 // Used for tracking collision list building
    
    this.Instances = new yyList();                   // list of all the objects instances
    this.Instances_Recursive = new yyList();         // recursive (parent) instance lists
    this.Instances.packing = true;
    this.Instances_Recursive.packing = true;

	this.ObjAlarm = [];
	for(var a=0;a<MAXTIMER;a++){
	    this.ObjAlarm[a]=null;
	}

	this.ObjKeyDown = [];
	this.ObjKeyPressed = [];
	this.ObjKeyReleased = [];
    this.Collisions = [];
    this.Triggers = [];
    this.Event = [];
    this.REvent = [];
    
    this.PhysicsData = new yyPhysicsData();    
}

yyObject.prototype.GetPool = function () { return this.Instances.pool; };
yyObject.prototype.GetRPool = function () { return this.Instances_Recursive.pool; };


// #############################################################################################
/// Function:<summary>
///             Create an object from its "loaded" data
///          </summary>
///
/// In:		 <param name="_ID"></param>
///			 <param name="_pObjectStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    CreateObjectFromStorage( _ID, _pObjectStorage ) {


    var pObj = new yyObject( _ID, _pObjectStorage.pName );
   // with(pObj)
    {
        if (_pObjectStorage.spriteIndex != undefined) pObj.SpriteIndex = _pObjectStorage.spriteIndex;
        if (_pObjectStorage.visible != undefined) pObj.Visible = _pObjectStorage.visible;
        if (_pObjectStorage.solid != undefined) pObj.Solid = _pObjectStorage.solid;
        if (_pObjectStorage.depth != undefined) pObj.Depth = _pObjectStorage.depth;
        if (_pObjectStorage.persistent != undefined) pObj.Persistent = _pObjectStorage.persistent;
        if (_pObjectStorage.parent != undefined) pObj.ParentID = _pObjectStorage.parent;
        if (_pObjectStorage.spritemask != undefined) pObj.SpriteMask = _pObjectStorage.spritemask;
        
        
        
        if( _pObjectStorage.PreCreateEvent) { pObj.PreCreateEvent =  _pObjectStorage.PreCreateEvent; pObj.Event[EVENT_PRE_CREATE] = true;  }
        if( _pObjectStorage.CreateEvent) { pObj.CreateEvent =  _pObjectStorage.CreateEvent; pObj.Event[EVENT_CREATE] = true;  }
        if( _pObjectStorage.DestroyEvent){ pObj.DestroyEvent = _pObjectStorage.DestroyEvent; pObj.Event[EVENT_DESTROY] = true; }
        if( _pObjectStorage.CleanUpEvent){ pObj.CleanUpEvent = _pObjectStorage.CleanUpEvent; pObj.Event[EVENT_CLEAN_UP] = true; }
        
        if( _pObjectStorage.StepBeginEvent) {pObj.StepBeginEvent = _pObjectStorage.StepBeginEvent;        pObj.Event[EVENT_STEP_BEGIN] = true; }
        if( _pObjectStorage.StepNormalEvent) {pObj.StepNormalEvent = _pObjectStorage.StepNormalEvent;     pObj.Event[EVENT_STEP_NORMAL] = true; }
        if( _pObjectStorage.StepEndEvent) {pObj.StepEndEvent = _pObjectStorage.StepEndEvent;              pObj.Event[EVENT_STEP_END] = true; }
        
        if( _pObjectStorage.DrawEvent) {pObj.DrawEvent = _pObjectStorage.DrawEvent; pObj.Event[EVENT_DRAW] = true; }
        if( _pObjectStorage.DrawGUI) {pObj.DrawGUI = _pObjectStorage.DrawGUI; pObj.Event[EVENT_DRAW_GUI] = true; }
        if (_pObjectStorage.DrawEventBegin) { pObj.DrawEventBegin = _pObjectStorage.DrawEventBegin; pObj.Event[EVENT_DRAW_BEGIN] = true; }
        if (_pObjectStorage.DrawEventEnd) { pObj.DrawEventEnd = _pObjectStorage.DrawEventEnd; pObj.Event[EVENT_DRAW_END] = true; }
        if (_pObjectStorage.DrawGUIBegin) { pObj.DrawGUIBegin = _pObjectStorage.DrawGUIBegin; pObj.Event[EVENT_DRAW_GUI_BEGIN] = true; }
        if (_pObjectStorage.DrawGUIEnd) { pObj.DrawGUIEnd = _pObjectStorage.DrawGUIEnd; pObj.Event[EVENT_DRAW_GUI_END] = true; }
        if (_pObjectStorage.DrawPre) { pObj.DrawPre = _pObjectStorage.DrawPre; pObj.Event[EVENT_DRAW_PRE] = true; }
        if (_pObjectStorage.DrawPost) { pObj.DrawPost = _pObjectStorage.DrawPost; pObj.Event[EVENT_DRAW_POST] = true; }
        if (_pObjectStorage.DrawResize) { pObj.DrawResize = _pObjectStorage.DrawResize; pObj.Event[EVENT_DRAW_RESIZE] = true; }
        

        if( _pObjectStorage.NoButtonPressed) {pObj.NoButtonPressed = _pObjectStorage.NoButtonPressed;       pObj.Event[EVENT_MOUSE_NOBUTTON] = true; }
        if( _pObjectStorage.LeftButtonDown) {pObj.LeftButtonDown = _pObjectStorage.LeftButtonDown;          pObj.Event[EVENT_MOUSE_LBUTTON_DOWN] = true; }
        if( _pObjectStorage.RightButtonDown)  {pObj.RightButtonDown = _pObjectStorage.RightButtonDown;      pObj.Event[EVENT_MOUSE_RBUTTON_DOWN] = true; }
        if( _pObjectStorage.MiddleButtonDown)  {pObj.MiddleButtonDown = _pObjectStorage.MiddleButtonDown;   pObj.Event[EVENT_MOUSE_MBUTTON_DOWN] = true; }
        if( _pObjectStorage.LeftButtonPressed) {pObj.LeftButtonPressed = _pObjectStorage.LeftButtonPressed;         pObj.Event[EVENT_MOUSE_LBUTTON_PRESSED] = true; }
        if( _pObjectStorage.RightButtonPressed)  {pObj.RightButtonPressed = _pObjectStorage.RightButtonPressed;     pObj.Event[EVENT_MOUSE_RBUTTON_PRESSED] = true; }
        if( _pObjectStorage.MiddleButtonPressed)  {pObj.MiddleButtonPressed = _pObjectStorage.MiddleButtonPressed;  pObj.Event[EVENT_MOUSE_MBUTTON_PRESSED] = true; }
        if( _pObjectStorage.LeftButtonReleased)  {pObj.LeftButtonReleased = _pObjectStorage.LeftButtonReleased;       pObj.Event[EVENT_MOUSE_LBUTTON_RELEASED] = true; }
        if( _pObjectStorage.RightButtonReleased)  {pObj.RightButtonReleased = _pObjectStorage.RightButtonReleased;    pObj.Event[EVENT_MOUSE_RBUTTON_RELEASED] = true; }
        if( _pObjectStorage.MiddleButtonReleased)  {pObj.MiddleButtonReleased = _pObjectStorage.MiddleButtonReleased; pObj.Event[EVENT_MOUSE_MBUTTON_RELEASED] = true; }
        if (_pObjectStorage.MouseWheelUp) { pObj.MouseWheelUp = _pObjectStorage.MouseWheelUp; pObj.Event[EVENT_MOUSE_WHEEL_UP] = true; }
        if (_pObjectStorage.MouseWheelDown) { pObj.MouseWheelDown = _pObjectStorage.MouseWheelDown; pObj.Event[EVENT_MOUSE_WHEEL_DOWN] = true; }

        if( _pObjectStorage.GlobalLeftButtonDown) {pObj.GlobalLeftButtonDown = _pObjectStorage.GlobalLeftButtonDown;          pObj.Event[EVENT_MOUSE_GLOBAL_LBUTTON_DOWN] = true; }
        if( _pObjectStorage.GlobalRightButtonDown)  {pObj.GlobalRightButtonDown = _pObjectStorage.GlobalRightButtonDown;      pObj.Event[EVENT_MOUSE_GLOBAL_RBUTTON_DOWN] = true; }
        if( _pObjectStorage.GlobalMiddleButtonDown)  {pObj.GlobalMiddleButtonDown = _pObjectStorage.GlobalMiddleButtonDown;   pObj.Event[EVENT_MOUSE_GLOBAL_MBUTTON_DOWN] = true; }
        if( _pObjectStorage.GlobalLeftButtonPressed) {pObj.GlobalLeftButtonPressed = _pObjectStorage.GlobalLeftButtonPressed; pObj.Event[EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED] = true; }
        if( _pObjectStorage.GlobalRightButtonPressed)  {pObj.GlobalRightButtonPressed = _pObjectStorage.GlobalRightButtonPressed;     pObj.Event[EVENT_MOUSE_GLOBAL_RBUTTON_PRESSED] = true; }
        if( _pObjectStorage.GlobalMiddleButtonPressed)  {pObj.GlobalMiddleButtonPressed = _pObjectStorage.GlobalMiddleButtonPressed;  pObj.Event[EVENT_MOUSE_GLOBAL_MBUTTON_PRESSED] = true; }
        if( _pObjectStorage.GlobalLeftButtonReleased)  {pObj.GlobalLeftButtonReleased = _pObjectStorage.GlobalLeftButtonReleased;         pObj.Event[EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED] = true; }
        if( _pObjectStorage.GlobalRightButtonReleased)  {pObj.GlobalRightButtonReleased = _pObjectStorage.GlobalRightButtonReleased;    pObj.Event[EVENT_MOUSE_GLOBAL_RBUTTON_RELEASED] = true; }
        if( _pObjectStorage.GlobalMiddleButtonReleased)  {pObj.GlobalMiddleButtonReleased = _pObjectStorage.GlobalMiddleButtonReleased; pObj.Event[EVENT_MOUSE_GLOBAL_MBUTTON_RELEASED] = true; }

        if( _pObjectStorage.MouseEnter) {pObj.MouseEnter = _pObjectStorage.MouseEnter;       pObj.Event[EVENT_MOUSE_ENTER] = true; }
        if (_pObjectStorage.MouseLeave) { pObj.MouseLeave = _pObjectStorage.MouseLeave; pObj.Event[EVENT_MOUSE_LEAVE] = true; }

        if (_pObjectStorage.GestureTapEvent) { pObj.GestureTapEvent = _pObjectStorage.GestureTapEvent; pObj.Event[EVENT_GESTURE_TAP] = true; }
        if (_pObjectStorage.GestureDoubleTapEvent) { pObj.GestureDoubleTapEvent = _pObjectStorage.GestureDoubleTapEvent; pObj.Event[EVENT_GESTURE_DOUBLE_TAP] = true; }
        if (_pObjectStorage.GestureDragStartEvent) { pObj.GestureDragStartEvent = _pObjectStorage.GestureDragStartEvent; pObj.Event[EVENT_GESTURE_DRAG_START] = true; }
        if (_pObjectStorage.GestureDragMoveEvent) { pObj.GestureDragMoveEvent = _pObjectStorage.GestureDragMoveEvent; pObj.Event[EVENT_GESTURE_DRAG_MOVE] = true; }
        if (_pObjectStorage.GestureDragEndEvent) { pObj.GestureDragEndEvent = _pObjectStorage.GestureDragEndEvent; pObj.Event[EVENT_GESTURE_DRAG_END] = true; }
        if (_pObjectStorage.GestureFlickEvent) { pObj.GestureFlickEvent = _pObjectStorage.GestureFlickEvent; pObj.Event[EVENT_GESTURE_FLICK] = true; }

        if (_pObjectStorage.GestureGlobalTapEvent) { pObj.GestureGlobalTapEvent = _pObjectStorage.GestureGlobalTapEvent; pObj.Event[EVENT_GESTURE_GLOBAL_TAP] = true; }
        if (_pObjectStorage.GestureGlobalDoubleTapEvent) { pObj.GestureGlobalDoubleTapEvent = _pObjectStorage.GestureGlobalDoubleTapEvent; pObj.Event[EVENT_GESTURE_GLOBAL_DOUBLE_TAP] = true; }
        if (_pObjectStorage.GestureGlobalDragStartEvent) { pObj.GestureGlobalDragStartEvent = _pObjectStorage.GestureGlobalDragStartEvent; pObj.Event[EVENT_GESTURE_GLOBAL_DRAG_START] = true; }
        if (_pObjectStorage.GestureGlobalDragMoveEvent) { pObj.GestureGlobalDragMoveEvent = _pObjectStorage.GestureGlobalDragMoveEvent; pObj.Event[EVENT_GESTURE_GLOBAL_DRAG_MOVE] = true; }
        if (_pObjectStorage.GestureGlobalDragEndEvent) { pObj.GestureGlobalDragEndEvent = _pObjectStorage.GestureGlobalDragEndEvent; pObj.Event[EVENT_GESTURE_GLOBAL_DRAG_END] = true; }
        if (_pObjectStorage.GestureGlobalFlickEvent) { pObj.GestureGlobalFlickEvent = _pObjectStorage.GestureGlobalFlickEvent; pObj.Event[EVENT_GESTURE_GLOBAL_FLICK] = true; }

        if( _pObjectStorage.OutsideEvent)       {pObj.OutsideEvent =  _pObjectStorage.OutsideEvent;            pObj.Event[EVENT_OTHER_OUTSIDE] = true; }
        if( _pObjectStorage.BoundaryEvent)      {pObj.BoundaryEvent = _pObjectStorage.BoundaryEvent;           pObj.Event[EVENT_OTHER_BOUNDARY] = true; }
        if( _pObjectStorage.StartGameEvent)     {pObj.StartGameEvent = _pObjectStorage.StartGameEvent;         pObj.Event[EVENT_OTHER_STARTGAME] = true; }
        if( _pObjectStorage.EndGameEvent)       {pObj.EndGameEvent = _pObjectStorage.EndGameEvent;             pObj.Event[EVENT_OTHER_ENDGAME] = true; } 
        if( _pObjectStorage.StartRoomEvent)     {pObj.StartRoomEvent = _pObjectStorage.StartRoomEvent;         pObj.Event[EVENT_OTHER_STARTROOM] = true; }
        if( _pObjectStorage.EndRoomEvent)       {pObj.EndRoomEvent = _pObjectStorage.EndRoomEvent;             pObj.Event[EVENT_OTHER_ENDROOM] = true; }
        if( _pObjectStorage.NoLivesEvent)       {pObj.NoLivesEvent = _pObjectStorage.NoLivesEvent;             pObj.Event[EVENT_OTHER_NOLIVES] = true; }
        if( _pObjectStorage.AnimationEndEvent)  {pObj.AnimationEndEvent = _pObjectStorage.AnimationEndEvent;   pObj.Event[EVENT_OTHER_ANIMATIONEND] = true; }
        if( _pObjectStorage.EndOfPathEvent)     {pObj.EndOfPathEvent = _pObjectStorage.EndOfPathEvent;         pObj.Event[EVENT_OTHER_ENDOFPATH] = true; }
        if( _pObjectStorage.NoHealthEvent)      {pObj.NoHealthEvent = _pObjectStorage.NoHealthEvent;           pObj.Event[EVENT_OTHER_NOHEALTH] = true; }
        if( _pObjectStorage.CloseButtonEvent)   {pObj.CloseButtonEvent = _pObjectStorage.CloseButtonEvent;     pObj.Event[EVENT_OTHER_CLOSEBUTTON] = true; }
        if( _pObjectStorage.OutsideView0Event)  {pObj.OutsideView0Event = _pObjectStorage.OutsideView0Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW0] = true; }
        if( _pObjectStorage.OutsideView1Event)  {pObj.OutsideView1Event = _pObjectStorage.OutsideView1Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW1] = true; }
        if( _pObjectStorage.OutsideView2Event)  {pObj.OutsideView2Event = _pObjectStorage.OutsideView2Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW2] = true; }
        if( _pObjectStorage.OutsideView3Event)  {pObj.OutsideView3Event = _pObjectStorage.OutsideView3Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW3] = true; }
        if( _pObjectStorage.OutsideView4Event)  {pObj.OutsideView4Event = _pObjectStorage.OutsideView4Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW4] = true; }
        if( _pObjectStorage.OutsideView5Event)  {pObj.OutsideView5Event = _pObjectStorage.OutsideView5Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW5] = true; }
        if( _pObjectStorage.OutsideView6Event)  {pObj.OutsideView6Event = _pObjectStorage.OutsideView6Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW6] = true; }
        if( _pObjectStorage.OutsideView7Event)  {pObj.OutsideView7Event = _pObjectStorage.OutsideView7Event;   pObj.Event[EVENT_OTHER_OUTSIDE_VIEW7] = true; }        
        if( _pObjectStorage.BoundaryView0Event) {pObj.BoundaryView0Event = _pObjectStorage.BoundaryView0Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW0] = true; }
        if( _pObjectStorage.BoundaryView1Event) {pObj.BoundaryView1Event = _pObjectStorage.BoundaryView1Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW1] = true; }
        if( _pObjectStorage.BoundaryView2Event) {pObj.BoundaryView2Event = _pObjectStorage.BoundaryView2Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW2] = true; }
        if( _pObjectStorage.BoundaryView3Event) {pObj.BoundaryView3Event = _pObjectStorage.BoundaryView3Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW3] = true; }
        if( _pObjectStorage.BoundaryView4Event) {pObj.BoundaryView4Event = _pObjectStorage.BoundaryView4Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW4] = true; }
        if( _pObjectStorage.BoundaryView5Event) {pObj.BoundaryView5Event = _pObjectStorage.BoundaryView5Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW5] = true; }
        if( _pObjectStorage.BoundaryView6Event) {pObj.BoundaryView6Event = _pObjectStorage.BoundaryView6Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW6] = true; }
        if( _pObjectStorage.BoundaryView7Event) {pObj.BoundaryView7Event = _pObjectStorage.BoundaryView7Event; pObj.Event[EVENT_OTHER_BOUNDARY_VIEW7] = true; }
        
        if( _pObjectStorage.AnimationUpdateEvent)  {pObj.AnimationUpdateEvent = _pObjectStorage.AnimationUpdateEvent;   pObj.Event[EVENT_OTHER_ANIMATIONUPDATE] = true; }        


        if( _pObjectStorage.UserEvent0) {pObj.UserEvent0 = _pObjectStorage.UserEvent0; pObj.Event[EVENT_OTHER_USER0] = true; }
        if( _pObjectStorage.UserEvent1) {pObj.UserEvent1 = _pObjectStorage.UserEvent1; pObj.Event[EVENT_OTHER_USER1] = true; }
        if( _pObjectStorage.UserEvent2) {pObj.UserEvent2 = _pObjectStorage.UserEvent2; pObj.Event[EVENT_OTHER_USER2] = true; }
        if( _pObjectStorage.UserEvent3) {pObj.UserEvent3 = _pObjectStorage.UserEvent3; pObj.Event[EVENT_OTHER_USER3] = true; }
        if( _pObjectStorage.UserEvent4) {pObj.UserEvent4 = _pObjectStorage.UserEvent4; pObj.Event[EVENT_OTHER_USER4] = true; }
        if( _pObjectStorage.UserEvent5) {pObj.UserEvent5 = _pObjectStorage.UserEvent5; pObj.Event[EVENT_OTHER_USER5] = true; }
        if( _pObjectStorage.UserEvent6) {pObj.UserEvent6 = _pObjectStorage.UserEvent6; pObj.Event[EVENT_OTHER_USER6] = true; }
        if( _pObjectStorage.UserEvent7) {pObj.UserEvent7 = _pObjectStorage.UserEvent7; pObj.Event[EVENT_OTHER_USER7] = true; }
        if( _pObjectStorage.UserEvent8) {pObj.UserEvent8 = _pObjectStorage.UserEvent8; pObj.Event[EVENT_OTHER_USER8] = true; }
        if( _pObjectStorage.UserEvent9) {pObj.UserEvent9 = _pObjectStorage.UserEvent9; pObj.Event[EVENT_OTHER_USER9] = true; }
        if( _pObjectStorage.UserEvent10) {pObj.UserEvent10 = _pObjectStorage.UserEvent10; pObj.Event[EVENT_OTHER_USER10] = true; }
        if( _pObjectStorage.UserEvent11) {pObj.UserEvent11 = _pObjectStorage.UserEvent11; pObj.Event[EVENT_OTHER_USER11] = true; }
        if( _pObjectStorage.UserEvent12) {pObj.UserEvent12 = _pObjectStorage.UserEvent12; pObj.Event[EVENT_OTHER_USER12] = true; }
        if( _pObjectStorage.UserEvent13) {pObj.UserEvent13 = _pObjectStorage.UserEvent13; pObj.Event[EVENT_OTHER_USER13] = true; }
        if( _pObjectStorage.UserEvent14) {pObj.UserEvent14 = _pObjectStorage.UserEvent14; pObj.Event[EVENT_OTHER_USER14] = true; }
        if( _pObjectStorage.UserEvent15) {pObj.UserEvent15 = _pObjectStorage.UserEvent15; pObj.Event[EVENT_OTHER_USER15] = true; }

        if (_pObjectStorage.WebImageLoadedEvent) { pObj.WebImageLoadedEvent = _pObjectStorage.WebImageLoadedEvent; pObj.Event[EVENT_OTHER_WEB_IMAGE_LOAD] = true; }
        if (_pObjectStorage.WebSoundLoadedEvent) { pObj.WebSoundLoadedEvent = _pObjectStorage.WebSoundLoadedEvent; pObj.Event[EVENT_OTHER_WEB_SOUND_LOAD] = true; }
        if (_pObjectStorage.WebAsyncEvent) { pObj.WebAsyncEvent = _pObjectStorage.WebAsyncEvent; pObj.Event[EVENT_OTHER_WEB_ASYNC] = true; }
        if (_pObjectStorage.WebUserInteractionEvent) { pObj.WebUserInteractionEvent = _pObjectStorage.WebUserInteractionEvent; pObj.Event[EVENT_OTHER_WEB_USER_INTERACTION] = true; }
        if (_pObjectStorage.WebIAPEvent) { pObj.WebIAPEvent = _pObjectStorage.WebIAPEvent; pObj.Event[EVENT_OTHER_WEB_IAP] = true; }
        if (_pObjectStorage.SocialEvent) { pObj.SocialEvent = _pObjectStorage.SocialEvent; pObj.Event[EVENT_OTHER_SOCIAL] = true; }
        if (_pObjectStorage.PushNotificationEvent) { pObj.PushNotificationEvent = _pObjectStorage.PushNotificationEvent; pObj.Event[EVENT_OTHER_PUSH_NOTIFICATION] = true; }
        if (_pObjectStorage.AsyncSaveLoadEvent) { pObj.AsyncSaveLoadEvent = _pObjectStorage.AsyncSaveLoadEvent; pObj.Event[EVENT_OTHER_ASYNC_SAVE_LOAD] = true; }        
        if (_pObjectStorage.NetworkingEvent) { pObj.NetworkingEvent = _pObjectStorage.NetworkingEvent; pObj.Event[EVENT_OTHER_NETWORKING] = true; }        
        if (_pObjectStorage.AudioPlaybackEvent) { pObj.AudioPlaybackEvent = _pObjectStorage.AudioPlaybackEvent; pObj.Event[EVENT_OTHER_AUDIO_PLAYBACK] = true; }        
        if (_pObjectStorage.AudioRecordingEvent) { pObj.AudioRecordingEvent = _pObjectStorage.AudioRecordingEvent; pObj.Event[EVENT_OTHER_AUDIO_RECORDING] = true; }        
        if (_pObjectStorage.AnimationEventEvent) { pObj.AnimationEventEvent = _pObjectStorage.AnimationEventEvent; pObj.Event[EVENT_OTHER_ANIMATIONEVENT] = true; }
        if (_pObjectStorage.SystemEvent) { pObj.SystemEvent = _pObjectStorage.SystemEvent; pObj.Event[EVENT_OTHER_SYSTEM_EVENT] = true; }
        if (_pObjectStorage.BroadcastMessageEvent) { pObj.BroadcastMessageEvent = _pObjectStorage.BroadcastMessageEvent; pObj.Event[EVENT_OTHER_BROADCAST_MESSAGE] = true; }
 
        if( _pObjectStorage.ObjAlarm0) {pObj.ObjAlarm[0] = _pObjectStorage.ObjAlarm0;  pObj.Event[EVENT_ALARM_0] = true; }
        if( _pObjectStorage.ObjAlarm1) {pObj.ObjAlarm[1] = _pObjectStorage.ObjAlarm1;  pObj.Event[EVENT_ALARM_1] = true; }
        if( _pObjectStorage.ObjAlarm2) {pObj.ObjAlarm[2] = _pObjectStorage.ObjAlarm2;  pObj.Event[EVENT_ALARM_2] = true; }
        if( _pObjectStorage.ObjAlarm3) {pObj.ObjAlarm[3] = _pObjectStorage.ObjAlarm3;  pObj.Event[EVENT_ALARM_3] = true; }
        if( _pObjectStorage.ObjAlarm4) {pObj.ObjAlarm[4] = _pObjectStorage.ObjAlarm4;  pObj.Event[EVENT_ALARM_4] = true; }
        if( _pObjectStorage.ObjAlarm5) {pObj.ObjAlarm[5] = _pObjectStorage.ObjAlarm5;  pObj.Event[EVENT_ALARM_5] = true; }
        if( _pObjectStorage.ObjAlarm6) {pObj.ObjAlarm[6] = _pObjectStorage.ObjAlarm6;  pObj.Event[EVENT_ALARM_6] = true; }
        if( _pObjectStorage.ObjAlarm7) {pObj.ObjAlarm[7] = _pObjectStorage.ObjAlarm7;  pObj.Event[EVENT_ALARM_7] = true; }
        if( _pObjectStorage.ObjAlarm8) {pObj.ObjAlarm[8] = _pObjectStorage.ObjAlarm8;  pObj.Event[EVENT_ALARM_8] = true; }
        if( _pObjectStorage.ObjAlarm9) {pObj.ObjAlarm[9] = _pObjectStorage.ObjAlarm9;  pObj.Event[EVENT_ALARM_9] = true; }
        if( _pObjectStorage.ObjAlarm10) {pObj.ObjAlarm[10] = _pObjectStorage.ObjAlarm10; pObj.Event[EVENT_ALARM_10] = true; }
        if( _pObjectStorage.ObjAlarm11) {pObj.ObjAlarm[11] = _pObjectStorage.ObjAlarm11; pObj.Event[EVENT_ALARM_11] = true; }
        
        
        // Keyboard Pressed events (horrible but here we go....)
        //if( _pObjectStorage.KeyPressed_)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_] = _pObjectStorage.KeyPressed_; pObj.Event[GML_EVENT_KEYPRESS_] = true; }
        if( _pObjectStorage.KeyPressed_NOKEY)  { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NOKEY] = _pObjectStorage.KeyPressed_NOKEY; pObj.Event[GML_EVENT_KEYPRESS_NOKEY] = true; }
        if( _pObjectStorage.KeyPressed_ANYKEY)      { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_ANYKEY] = _pObjectStorage.KeyPressed_ANYKEY; pObj.Event[GML_EVENT_KEYPRESS_ANYKEY] = true; }
        if( _pObjectStorage.KeyPressed_BACKSPACE){ pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_BACKSPACE] = _pObjectStorage.KeyPressed_BACKSPACE; pObj.Event[GML_EVENT_KEYPRESS_BACKSPACE] = true; }
        if( _pObjectStorage.KeyPressed_TAB)      { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_TAB] = _pObjectStorage.KeyPressed_TAB; pObj.Event[GML_EVENT_KEYPRESS_TAB] = true; }
        if( _pObjectStorage.KeyPressed_ENTER)    { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_ENTER] = _pObjectStorage.KeyPressed_ENTER; pObj.Event[GML_EVENT_KEYPRESS_ENTER] = true; }
        if( _pObjectStorage.KeyPressed_SHIFT )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_SHIFT ] = _pObjectStorage.KeyPressed_SHIFT ; pObj.Event[GML_EVENT_KEYPRESS_SHIFT ] = true; }
        if( _pObjectStorage.KeyPressed_CTRL  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_CTRL  ] = _pObjectStorage.KeyPressed_CTRL  ; pObj.Event[GML_EVENT_KEYPRESS_CTRL  ] = true; }
        if( _pObjectStorage.KeyPressed_ALT   )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_ALT   ] = _pObjectStorage.KeyPressed_ALT   ; pObj.Event[GML_EVENT_KEYPRESS_ALT   ] = true; }
        if( _pObjectStorage.KeyPressed_PAUSE )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_PAUSE ] = _pObjectStorage.KeyPressed_PAUSE ; pObj.Event[GML_EVENT_KEYPRESS_PAUSE ] = true; }
        if( _pObjectStorage.KeyPressed_ESCAPE)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_ESCAPE] = _pObjectStorage.KeyPressed_ESCAPE; pObj.Event[GML_EVENT_KEYPRESS_ESCAPE] = true; }
        if( _pObjectStorage.KeyPressed_SPACE )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_SPACE ] = _pObjectStorage.KeyPressed_SPACE ; pObj.Event[GML_EVENT_KEYPRESS_SPACE ] = true; }

        if( _pObjectStorage.KeyPressed_PAGEUP  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_PAGEUP  ] = _pObjectStorage.KeyPressed_PAGEUP  ; pObj.Event[GML_EVENT_KEYPRESS_PAGEUP  ] = true; }
        if( _pObjectStorage.KeyPressed_PAGEDOWN)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_PAGEDOWN] = _pObjectStorage.KeyPressed_PAGEDOWN; pObj.Event[GML_EVENT_KEYPRESS_PAGEDOWN] = true; }
        if( _pObjectStorage.KeyPressed_END     )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_END     ] = _pObjectStorage.KeyPressed_END     ; pObj.Event[GML_EVENT_KEYPRESS_END     ] = true; }
        if( _pObjectStorage.KeyPressed_HOME    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_HOME    ] = _pObjectStorage.KeyPressed_HOME    ; pObj.Event[GML_EVENT_KEYPRESS_HOME    ] = true; }
        if( _pObjectStorage.KeyPressed_LEFT    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_LEFT    ] = _pObjectStorage.KeyPressed_LEFT    ; pObj.Event[GML_EVENT_KEYPRESS_LEFT    ] = true; }
        if( _pObjectStorage.KeyPressed_UP      )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_UP      ] = _pObjectStorage.KeyPressed_UP      ; pObj.Event[GML_EVENT_KEYPRESS_UP      ] = true; }
        if( _pObjectStorage.KeyPressed_RIGHT   )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_RIGHT   ] = _pObjectStorage.KeyPressed_RIGHT   ; pObj.Event[GML_EVENT_KEYPRESS_RIGHT   ] = true; }
        if( _pObjectStorage.KeyPressed_DOWN    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_DOWN    ] = _pObjectStorage.KeyPressed_DOWN    ; pObj.Event[GML_EVENT_KEYPRESS_DOWN    ] = true; }
        if( _pObjectStorage.KeyPressed_INSERT  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_INSERT  ] = _pObjectStorage.KeyPressed_INSERT  ; pObj.Event[GML_EVENT_KEYPRESS_INSERT  ] = true; }
        if( _pObjectStorage.KeyPressed_DELETE  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_DELETE  ] = _pObjectStorage.KeyPressed_DELETE  ; pObj.Event[GML_EVENT_KEYPRESS_DELETE  ] = true; }

        if( _pObjectStorage.KeyPressed_0) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_0] = (_pObjectStorage.KeyPressed_0); pObj.Event[GML_EVENT_KEYPRESS_0] = true; }
        if( _pObjectStorage.KeyPressed_1) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_1] = (_pObjectStorage.KeyPressed_1); pObj.Event[GML_EVENT_KEYPRESS_1] = true; }
        if( _pObjectStorage.KeyPressed_2) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_2] = (_pObjectStorage.KeyPressed_2); pObj.Event[GML_EVENT_KEYPRESS_2] = true; }
        if( _pObjectStorage.KeyPressed_3) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_3] = (_pObjectStorage.KeyPressed_3); pObj.Event[GML_EVENT_KEYPRESS_3] = true; }
        if( _pObjectStorage.KeyPressed_4) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_4] = (_pObjectStorage.KeyPressed_4); pObj.Event[GML_EVENT_KEYPRESS_4] = true; }
        if( _pObjectStorage.KeyPressed_5) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_5] = (_pObjectStorage.KeyPressed_5); pObj.Event[GML_EVENT_KEYPRESS_5] = true; }
        if( _pObjectStorage.KeyPressed_6) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_6] = (_pObjectStorage.KeyPressed_6); pObj.Event[GML_EVENT_KEYPRESS_6] = true; }
        if( _pObjectStorage.KeyPressed_7) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_7] = (_pObjectStorage.KeyPressed_7); pObj.Event[GML_EVENT_KEYPRESS_7] = true; }
        if( _pObjectStorage.KeyPressed_8) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_8] = (_pObjectStorage.KeyPressed_8); pObj.Event[GML_EVENT_KEYPRESS_8] = true; }
        if( _pObjectStorage.KeyPressed_9) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_9] = (_pObjectStorage.KeyPressed_9); pObj.Event[GML_EVENT_KEYPRESS_9] = true; }

        if( _pObjectStorage.KeyPressed_A) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_A] = (_pObjectStorage.KeyPressed_A); pObj.Event[GML_EVENT_KEYPRESS_A] = true; }
        if( _pObjectStorage.KeyPressed_B) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_B] = (_pObjectStorage.KeyPressed_B); pObj.Event[GML_EVENT_KEYPRESS_B] = true; }
        if( _pObjectStorage.KeyPressed_C) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_C] = (_pObjectStorage.KeyPressed_C); pObj.Event[GML_EVENT_KEYPRESS_C] = true; }
        if( _pObjectStorage.KeyPressed_D) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_D] = (_pObjectStorage.KeyPressed_D); pObj.Event[GML_EVENT_KEYPRESS_D] = true; }
        if( _pObjectStorage.KeyPressed_E) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_E] = (_pObjectStorage.KeyPressed_E); pObj.Event[GML_EVENT_KEYPRESS_E] = true; }
        if( _pObjectStorage.KeyPressed_F) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F] = (_pObjectStorage.KeyPressed_F); pObj.Event[GML_EVENT_KEYPRESS_F] = true; }
        if( _pObjectStorage.KeyPressed_G) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_G] = (_pObjectStorage.KeyPressed_G); pObj.Event[GML_EVENT_KEYPRESS_G] = true; }
        if( _pObjectStorage.KeyPressed_H) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_H] = (_pObjectStorage.KeyPressed_H); pObj.Event[GML_EVENT_KEYPRESS_H] = true; }
        if( _pObjectStorage.KeyPressed_I) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_I] = (_pObjectStorage.KeyPressed_I); pObj.Event[GML_EVENT_KEYPRESS_I] = true; }
        if( _pObjectStorage.KeyPressed_J) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_J] = (_pObjectStorage.KeyPressed_J); pObj.Event[GML_EVENT_KEYPRESS_J] = true; }
        if( _pObjectStorage.KeyPressed_K) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_K] = (_pObjectStorage.KeyPressed_K); pObj.Event[GML_EVENT_KEYPRESS_K] = true; }
        if( _pObjectStorage.KeyPressed_L) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_L] = (_pObjectStorage.KeyPressed_L); pObj.Event[GML_EVENT_KEYPRESS_L] = true; }
        if( _pObjectStorage.KeyPressed_M) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_M] = (_pObjectStorage.KeyPressed_M); pObj.Event[GML_EVENT_KEYPRESS_M] = true; }
        if( _pObjectStorage.KeyPressed_N) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_N] = (_pObjectStorage.KeyPressed_N); pObj.Event[GML_EVENT_KEYPRESS_N] = true; }
        if( _pObjectStorage.KeyPressed_O) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_O] = (_pObjectStorage.KeyPressed_O); pObj.Event[GML_EVENT_KEYPRESS_O] = true; }
        if( _pObjectStorage.KeyPressed_P) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_P] = (_pObjectStorage.KeyPressed_P); pObj.Event[GML_EVENT_KEYPRESS_P] = true; }
        if( _pObjectStorage.KeyPressed_Q) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_Q] = (_pObjectStorage.KeyPressed_Q); pObj.Event[GML_EVENT_KEYPRESS_Q] = true; }
        if( _pObjectStorage.KeyPressed_R) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_R] = (_pObjectStorage.KeyPressed_R); pObj.Event[GML_EVENT_KEYPRESS_R] = true; }
        if( _pObjectStorage.KeyPressed_S) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_S] = (_pObjectStorage.KeyPressed_S); pObj.Event[GML_EVENT_KEYPRESS_S] = true; }
        if( _pObjectStorage.KeyPressed_T) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_T] = (_pObjectStorage.KeyPressed_T); pObj.Event[GML_EVENT_KEYPRESS_T] = true; }
        if( _pObjectStorage.KeyPressed_U) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_U] = (_pObjectStorage.KeyPressed_U); pObj.Event[GML_EVENT_KEYPRESS_U] = true; }
        if( _pObjectStorage.KeyPressed_V) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_V] = (_pObjectStorage.KeyPressed_V); pObj.Event[GML_EVENT_KEYPRESS_V] = true; }
        if( _pObjectStorage.KeyPressed_W) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_W] = (_pObjectStorage.KeyPressed_W); pObj.Event[GML_EVENT_KEYPRESS_W] = true; }
        if( _pObjectStorage.KeyPressed_X) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_X] = (_pObjectStorage.KeyPressed_X); pObj.Event[GML_EVENT_KEYPRESS_X] = true; }
        if( _pObjectStorage.KeyPressed_Y) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_Y] = (_pObjectStorage.KeyPressed_Y); pObj.Event[GML_EVENT_KEYPRESS_Y] = true; }
        if( _pObjectStorage.KeyPressed_Z) { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_Z] = (_pObjectStorage.KeyPressed_Z); pObj.Event[GML_EVENT_KEYPRESS_Z] = true; }

        if( _pObjectStorage.KeyPressed_F1 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F1 ] = (_pObjectStorage.KeyPressed_F1 ); pObj.Event[GML_EVENT_KEYPRESS_F1 ] = true; }
        if( _pObjectStorage.KeyPressed_F2 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F2 ] = (_pObjectStorage.KeyPressed_F2 ); pObj.Event[GML_EVENT_KEYPRESS_F2 ] = true; }
        if( _pObjectStorage.KeyPressed_F3 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F3 ] = (_pObjectStorage.KeyPressed_F3 ); pObj.Event[GML_EVENT_KEYPRESS_F3 ] = true; }
        if( _pObjectStorage.KeyPressed_F4 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F4 ] = (_pObjectStorage.KeyPressed_F4 ); pObj.Event[GML_EVENT_KEYPRESS_F4 ] = true; }
        if( _pObjectStorage.KeyPressed_F5 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F5 ] = (_pObjectStorage.KeyPressed_F5 ); pObj.Event[GML_EVENT_KEYPRESS_F5 ] = true; }
        if( _pObjectStorage.KeyPressed_F6 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F6 ] = (_pObjectStorage.KeyPressed_F6 ); pObj.Event[GML_EVENT_KEYPRESS_F6 ] = true; }
        if( _pObjectStorage.KeyPressed_F7 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F7 ] = (_pObjectStorage.KeyPressed_F7 ); pObj.Event[GML_EVENT_KEYPRESS_F7 ] = true; }
        if( _pObjectStorage.KeyPressed_F8 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F8 ] = (_pObjectStorage.KeyPressed_F8 ); pObj.Event[GML_EVENT_KEYPRESS_F8 ] = true; }
        if( _pObjectStorage.KeyPressed_F9 )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F9 ] = (_pObjectStorage.KeyPressed_F9 ); pObj.Event[GML_EVENT_KEYPRESS_F9 ] = true; }
        if( _pObjectStorage.KeyPressed_F10)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F10] = (_pObjectStorage.KeyPressed_F10); pObj.Event[GML_EVENT_KEYPRESS_F10] = true; }
        if( _pObjectStorage.KeyPressed_F11)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F11] = (_pObjectStorage.KeyPressed_F11); pObj.Event[GML_EVENT_KEYPRESS_F11] = true; }
        if( _pObjectStorage.KeyPressed_F12)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_F12] = (_pObjectStorage.KeyPressed_F12); pObj.Event[GML_EVENT_KEYPRESS_F12] = true; }

        if( _pObjectStorage.KeyPressed_NUM_LOCK )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_LOCK ] = (_pObjectStorage.KeyPressed_NUM_LOCK ); pObj.Event[GML_EVENT_KEYPRESS_NUM_LOCK ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_0    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_0    ] = (_pObjectStorage.KeyPressed_NUM_0    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_0    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_1    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_1    ] = (_pObjectStorage.KeyPressed_NUM_1    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_1    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_2    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_2    ] = (_pObjectStorage.KeyPressed_NUM_2    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_2    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_3    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_3    ] = (_pObjectStorage.KeyPressed_NUM_3    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_3    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_4    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_4    ] = (_pObjectStorage.KeyPressed_NUM_4    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_4    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_5    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_5    ] = (_pObjectStorage.KeyPressed_NUM_5    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_5    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_6    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_6    ] = (_pObjectStorage.KeyPressed_NUM_6    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_6    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_7    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_7    ] = (_pObjectStorage.KeyPressed_NUM_7    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_7    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_8    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_8    ] = (_pObjectStorage.KeyPressed_NUM_8    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_8    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_9    )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_9    ] = (_pObjectStorage.KeyPressed_NUM_9    ); pObj.Event[GML_EVENT_KEYPRESS_NUM_9    ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_STAR )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_STAR ] = (_pObjectStorage.KeyPressed_NUM_STAR ); pObj.Event[GML_EVENT_KEYPRESS_NUM_STAR ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_PLUS )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_PLUS ] = (_pObjectStorage.KeyPressed_NUM_PLUS ); pObj.Event[GML_EVENT_KEYPRESS_NUM_PLUS ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_MINUS)   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_MINUS] = (_pObjectStorage.KeyPressed_NUM_MINUS); pObj.Event[GML_EVENT_KEYPRESS_NUM_MINUS] = true; }
        if( _pObjectStorage.KeyPressed_NUM_DOT  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_DOT  ] = (_pObjectStorage.KeyPressed_NUM_DOT  ); pObj.Event[GML_EVENT_KEYPRESS_NUM_DOT  ] = true; }
        if( _pObjectStorage.KeyPressed_NUM_DIV  )   { pObj.ObjKeyPressed[GML_EVENT_KEYPRESS_NUM_DIV  ] = (_pObjectStorage.KeyPressed_NUM_DIV  ); pObj.Event[GML_EVENT_KEYPRESS_NUM_DIV  ] = true; }


        // Keyboard (key down) events
        if( _pObjectStorage.Key_NOKEY) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NOKEY] = (_pObjectStorage.Key_NOKEY); pObj.Event[GML_EVENT_KEYBOARD_NOKEY] = true; }
        if( _pObjectStorage.Key_ANYKEY) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_ANYKEY] = (_pObjectStorage.Key_ANYKEY); pObj.Event[GML_EVENT_KEYBOARD_ANYKEY] = true; }
        if( _pObjectStorage.Key_BACKSPACE) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_BACKSPACE] = (_pObjectStorage.Key_BACKSPACE); pObj.Event[GML_EVENT_KEYBOARD_BACKSPACE] = true; }
        if( _pObjectStorage.Key_TAB)     { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_TAB] = (_pObjectStorage.Key_TAB); pObj.Event[GML_EVENT_KEYBOARD_TAB] = true; }
        if( _pObjectStorage.Key_ENTER)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_ENTER] = (_pObjectStorage.Key_ENTER); pObj.Event[GML_EVENT_KEYBOARD_ENTER] = true; }
        if( _pObjectStorage.Key_SHIFT )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_SHIFT ] = (_pObjectStorage.Key_SHIFT ); pObj.Event[GML_EVENT_KEYBOARD_SHIFT ] = true; }
        if( _pObjectStorage.Key_CTRL  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_CTRL  ] = (_pObjectStorage.Key_CTRL  ); pObj.Event[GML_EVENT_KEYBOARD_CTRL  ] = true; }
        if( _pObjectStorage.Key_ALT   )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_ALT   ] = (_pObjectStorage.Key_ALT   ); pObj.Event[GML_EVENT_KEYBOARD_ALT   ] = true; }
        if( _pObjectStorage.Key_PAUSE )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_PAUSE ] = (_pObjectStorage.Key_PAUSE ); pObj.Event[GML_EVENT_KEYBOARD_PAUSE ] = true; }
        if( _pObjectStorage.Key_ESCAPE)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_ESCAPE] = (_pObjectStorage.Key_ESCAPE); pObj.Event[GML_EVENT_KEYBOARD_ESCAPE] = true; }
        if( _pObjectStorage.Key_SPACE )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_SPACE ] = (_pObjectStorage.Key_SPACE ); pObj.Event[GML_EVENT_KEYBOARD_SPACE ] = true; }

        if( _pObjectStorage.Key_PAGEUP  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_PAGEUP  ] = (_pObjectStorage.Key_PAGEUP  ); pObj.Event[GML_EVENT_KEYBOARD_PAGEUP  ] = true; }
        if( _pObjectStorage.Key_PAGEDOWN)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_PAGEDOWN] = (_pObjectStorage.Key_PAGEDOWN); pObj.Event[GML_EVENT_KEYBOARD_PAGEDOWN] = true; }
        if( _pObjectStorage.Key_END     )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_END     ] = (_pObjectStorage.Key_END     ); pObj.Event[GML_EVENT_KEYBOARD_END     ] = true; }
        if( _pObjectStorage.Key_HOME    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_HOME    ] = (_pObjectStorage.Key_HOME    ); pObj.Event[GML_EVENT_KEYBOARD_HOME    ] = true; }
        if( _pObjectStorage.Key_LEFT    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_LEFT    ] = (_pObjectStorage.Key_LEFT    ); pObj.Event[GML_EVENT_KEYBOARD_LEFT    ] = true; }
        if( _pObjectStorage.Key_UP      )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_UP      ] = (_pObjectStorage.Key_UP      ); pObj.Event[GML_EVENT_KEYBOARD_UP      ] = true; }
        if( _pObjectStorage.Key_RIGHT   )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_RIGHT   ] = (_pObjectStorage.Key_RIGHT   ); pObj.Event[GML_EVENT_KEYBOARD_RIGHT   ] = true; }
        if( _pObjectStorage.Key_DOWN    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_DOWN    ] = (_pObjectStorage.Key_DOWN    ); pObj.Event[GML_EVENT_KEYBOARD_DOWN    ] = true; }
        if( _pObjectStorage.Key_INSERT  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_INSERT  ] = (_pObjectStorage.Key_INSERT  ); pObj.Event[GML_EVENT_KEYBOARD_INSERT  ] = true; }
        if( _pObjectStorage.Key_DELETE  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_DELETE  ] = (_pObjectStorage.Key_DELETE  ); pObj.Event[GML_EVENT_KEYBOARD_DELETE  ] = true; }

        if( _pObjectStorage.Key_0) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_0] = (_pObjectStorage.Key_0); pObj.Event[GML_EVENT_KEYBOARD_0] = true; }
        if( _pObjectStorage.Key_1) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_1] = (_pObjectStorage.Key_1); pObj.Event[GML_EVENT_KEYBOARD_1] = true; }
        if( _pObjectStorage.Key_2) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_2] = (_pObjectStorage.Key_2); pObj.Event[GML_EVENT_KEYBOARD_2] = true; }
        if( _pObjectStorage.Key_3) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_3] = (_pObjectStorage.Key_3); pObj.Event[GML_EVENT_KEYBOARD_3] = true; }
        if( _pObjectStorage.Key_4) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_4] = (_pObjectStorage.Key_4); pObj.Event[GML_EVENT_KEYBOARD_4] = true; }
        if( _pObjectStorage.Key_5) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_5] = (_pObjectStorage.Key_5); pObj.Event[GML_EVENT_KEYBOARD_5] = true; }
        if( _pObjectStorage.Key_6) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_6] = (_pObjectStorage.Key_6); pObj.Event[GML_EVENT_KEYBOARD_6] = true; }
        if( _pObjectStorage.Key_7) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_7] = (_pObjectStorage.Key_7); pObj.Event[GML_EVENT_KEYBOARD_7] = true; }
        if( _pObjectStorage.Key_8) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_8] = (_pObjectStorage.Key_8); pObj.Event[GML_EVENT_KEYBOARD_8] = true; }
        if( _pObjectStorage.Key_9) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_9] = (_pObjectStorage.Key_9); pObj.Event[GML_EVENT_KEYBOARD_9] = true; }

        if( _pObjectStorage.Key_A) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_A] = (_pObjectStorage.Key_A); pObj.Event[GML_EVENT_KEYBOARD_A] = true; }
        if( _pObjectStorage.Key_B) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_B] = (_pObjectStorage.Key_B); pObj.Event[GML_EVENT_KEYBOARD_B] = true; }
        if( _pObjectStorage.Key_C) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_C] = (_pObjectStorage.Key_C); pObj.Event[GML_EVENT_KEYBOARD_C] = true; }
        if( _pObjectStorage.Key_D) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_D] = (_pObjectStorage.Key_D); pObj.Event[GML_EVENT_KEYBOARD_D] = true; }
        if( _pObjectStorage.Key_E) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_E] = (_pObjectStorage.Key_E); pObj.Event[GML_EVENT_KEYBOARD_E] = true; }
        if( _pObjectStorage.Key_F) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F] = (_pObjectStorage.Key_F); pObj.Event[GML_EVENT_KEYBOARD_F] = true; }
        if( _pObjectStorage.Key_G) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_G] = (_pObjectStorage.Key_G); pObj.Event[GML_EVENT_KEYBOARD_G] = true; }
        if( _pObjectStorage.Key_H) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_H] = (_pObjectStorage.Key_H); pObj.Event[GML_EVENT_KEYBOARD_H] = true; }
        if( _pObjectStorage.Key_I) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_I] = (_pObjectStorage.Key_I); pObj.Event[GML_EVENT_KEYBOARD_I] = true; }
        if( _pObjectStorage.Key_J) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_J] = (_pObjectStorage.Key_J); pObj.Event[GML_EVENT_KEYBOARD_J] = true; }
        if( _pObjectStorage.Key_K) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_K] = (_pObjectStorage.Key_K); pObj.Event[GML_EVENT_KEYBOARD_K] = true; }
        if( _pObjectStorage.Key_L) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_L] = (_pObjectStorage.Key_L); pObj.Event[GML_EVENT_KEYBOARD_L] = true; }
        if( _pObjectStorage.Key_M) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_M] = (_pObjectStorage.Key_M); pObj.Event[GML_EVENT_KEYBOARD_M] = true; }
        if( _pObjectStorage.Key_N) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_N] = (_pObjectStorage.Key_N); pObj.Event[GML_EVENT_KEYBOARD_N] = true; }
        if( _pObjectStorage.Key_O) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_O] = (_pObjectStorage.Key_O); pObj.Event[GML_EVENT_KEYBOARD_O] = true; }
        if( _pObjectStorage.Key_P) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_P] = (_pObjectStorage.Key_P); pObj.Event[GML_EVENT_KEYBOARD_P] = true; }
        if( _pObjectStorage.Key_Q) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_Q] = (_pObjectStorage.Key_Q); pObj.Event[GML_EVENT_KEYBOARD_Q] = true; }
        if( _pObjectStorage.Key_R) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_R] = (_pObjectStorage.Key_R); pObj.Event[GML_EVENT_KEYBOARD_R] = true; }
        if( _pObjectStorage.Key_S) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_S] = (_pObjectStorage.Key_S); pObj.Event[GML_EVENT_KEYBOARD_S] = true; }
        if( _pObjectStorage.Key_T) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_T] = (_pObjectStorage.Key_T); pObj.Event[GML_EVENT_KEYBOARD_T] = true; }
        if( _pObjectStorage.Key_U) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_U] = (_pObjectStorage.Key_U); pObj.Event[GML_EVENT_KEYBOARD_U] = true; }
        if( _pObjectStorage.Key_V) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_V] = (_pObjectStorage.Key_V); pObj.Event[GML_EVENT_KEYBOARD_V] = true; }
        if( _pObjectStorage.Key_W) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_W] = (_pObjectStorage.Key_W); pObj.Event[GML_EVENT_KEYBOARD_W] = true; }
        if( _pObjectStorage.Key_X) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_X] = (_pObjectStorage.Key_X); pObj.Event[GML_EVENT_KEYBOARD_X] = true; }
        if( _pObjectStorage.Key_Y) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_Y] = (_pObjectStorage.Key_Y); pObj.Event[GML_EVENT_KEYBOARD_Y] = true; }
        if( _pObjectStorage.Key_Z) { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_Z] = (_pObjectStorage.Key_Z); pObj.Event[GML_EVENT_KEYBOARD_Z] = true; }

        if( _pObjectStorage.Key_F1 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F1 ] = (_pObjectStorage.Key_F1 ); pObj.Event[GML_EVENT_KEYBOARD_F1 ] = true; }
        if( _pObjectStorage.Key_F2 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F2 ] = (_pObjectStorage.Key_F2 ); pObj.Event[GML_EVENT_KEYBOARD_F2 ] = true; }
        if( _pObjectStorage.Key_F3 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F3 ] = (_pObjectStorage.Key_F3 ); pObj.Event[GML_EVENT_KEYBOARD_F3 ] = true; }
        if( _pObjectStorage.Key_F4 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F4 ] = (_pObjectStorage.Key_F4 ); pObj.Event[GML_EVENT_KEYBOARD_F4 ] = true; }
        if( _pObjectStorage.Key_F5 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F5 ] = (_pObjectStorage.Key_F5 ); pObj.Event[GML_EVENT_KEYBOARD_F5 ] = true; }
        if( _pObjectStorage.Key_F6 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F6 ] = (_pObjectStorage.Key_F6 ); pObj.Event[GML_EVENT_KEYBOARD_F6 ] = true; }
        if( _pObjectStorage.Key_F7 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F7 ] = (_pObjectStorage.Key_F7 ); pObj.Event[GML_EVENT_KEYBOARD_F7 ] = true; }
        if( _pObjectStorage.Key_F8 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F8 ] = (_pObjectStorage.Key_F8 ); pObj.Event[GML_EVENT_KEYBOARD_F8 ] = true; }
        if( _pObjectStorage.Key_F9 )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F9 ] = (_pObjectStorage.Key_F9 ); pObj.Event[GML_EVENT_KEYBOARD_F9 ] = true; }
        if( _pObjectStorage.Key_F10)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F10] = (_pObjectStorage.Key_F10); pObj.Event[GML_EVENT_KEYBOARD_F10] = true; }
        if( _pObjectStorage.Key_F11)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F11] = (_pObjectStorage.Key_F11); pObj.Event[GML_EVENT_KEYBOARD_F11] = true; }
        if( _pObjectStorage.Key_F12)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_F12] = (_pObjectStorage.Key_F12); pObj.Event[GML_EVENT_KEYBOARD_F12] = true; }

        if( _pObjectStorage.Key_NUM_LOCK )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_LOCK ] = (_pObjectStorage.Key_NUM_LOCK ); pObj.Event[GML_EVENT_KEYBOARD_NUM_LOCK ] = true; }
        if( _pObjectStorage.Key_NUM_0    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_0    ] = (_pObjectStorage.Key_NUM_0    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_0    ] = true; }
        if( _pObjectStorage.Key_NUM_1    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_1    ] = (_pObjectStorage.Key_NUM_1    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_1    ] = true; }
        if( _pObjectStorage.Key_NUM_2    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_2    ] = (_pObjectStorage.Key_NUM_2    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_2    ] = true; }
        if( _pObjectStorage.Key_NUM_3    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_3    ] = (_pObjectStorage.Key_NUM_3    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_3    ] = true; }
        if( _pObjectStorage.Key_NUM_4    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_4    ] = (_pObjectStorage.Key_NUM_4    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_4    ] = true; }
        if( _pObjectStorage.Key_NUM_5    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_5    ] = (_pObjectStorage.Key_NUM_5    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_5    ] = true; }
        if( _pObjectStorage.Key_NUM_6    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_6    ] = (_pObjectStorage.Key_NUM_6    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_6    ] = true; }
        if( _pObjectStorage.Key_NUM_7    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_7    ] = (_pObjectStorage.Key_NUM_7    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_7    ] = true; }
        if( _pObjectStorage.Key_NUM_8    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_8    ] = (_pObjectStorage.Key_NUM_8    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_8    ] = true; }
        if( _pObjectStorage.Key_NUM_9    )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_9    ] = (_pObjectStorage.Key_NUM_9    ); pObj.Event[GML_EVENT_KEYBOARD_NUM_9    ] = true; }
        if( _pObjectStorage.Key_NUM_STAR )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_STAR ] = (_pObjectStorage.Key_NUM_STAR ); pObj.Event[GML_EVENT_KEYBOARD_NUM_STAR ] = true; }
        if( _pObjectStorage.Key_NUM_PLUS )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_PLUS ] = (_pObjectStorage.Key_NUM_PLUS ); pObj.Event[GML_EVENT_KEYBOARD_NUM_PLUS ] = true; }
        if( _pObjectStorage.Key_NUM_MINUS)   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_MINUS] = (_pObjectStorage.Key_NUM_MINUS); pObj.Event[GML_EVENT_KEYBOARD_NUM_MINUS] = true; }
        if( _pObjectStorage.Key_NUM_DOT  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_DOT  ] = (_pObjectStorage.Key_NUM_DOT  ); pObj.Event[GML_EVENT_KEYBOARD_NUM_DOT  ] = true; }
        if( _pObjectStorage.Key_NUM_DIV  )   { pObj.ObjKeyDown[GML_EVENT_KEYBOARD_NUM_DIV  ] = (_pObjectStorage.Key_NUM_DIV  ); pObj.Event[GML_EVENT_KEYBOARD_NUM_DIV  ] = true; }



        // Key Released events
        if( _pObjectStorage.KeyReleased_NOKEY) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NOKEY] = (_pObjectStorage.KeyReleased_NOKEY); pObj.Event[GML_EVENT_KEYRELEASE_NOKEY] = true; }
        if( _pObjectStorage.KeyReleased_ANYKEY) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_ANYKEY] = (_pObjectStorage.KeyReleased_ANYKEY); pObj.Event[GML_EVENT_KEYRELEASE_ANYKEY] = true; }
        if( _pObjectStorage.KeyReleased_BACKSPACE) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_BACKSPACE] = (_pObjectStorage.KeyReleased_BACKSPACE); pObj.Event[GML_EVENT_KEYRELEASE_BACKSPACE] = true; }
        
        if( _pObjectStorage.KeyReleased_TAB)     { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_TAB] = (_pObjectStorage.KeyReleased_TAB); pObj.Event[GML_EVENT_KEYRELEASE_TAB] = true; }
        if( _pObjectStorage.KeyReleased_ENTER)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_ENTER] = (_pObjectStorage.KeyReleased_ENTER); pObj.Event[GML_EVENT_KEYRELEASE_ENTER] = true; }
        if( _pObjectStorage.KeyReleased_SHIFT )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_SHIFT ] = (_pObjectStorage.KeyReleased_SHIFT ); pObj.Event[GML_EVENT_KEYRELEASE_SHIFT ] = true; }
        if( _pObjectStorage.KeyReleased_CTRL  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_CTRL  ] = (_pObjectStorage.KeyReleased_CTRL  ); pObj.Event[GML_EVENT_KEYRELEASE_CTRL  ] = true; }
        if( _pObjectStorage.KeyReleased_ALT   )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_ALT   ] = (_pObjectStorage.KeyReleased_ALT   ); pObj.Event[GML_EVENT_KEYRELEASE_ALT   ] = true; }
        if( _pObjectStorage.KeyReleased_PAUSE )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_PAUSE ] = (_pObjectStorage.KeyReleased_PAUSE ); pObj.Event[GML_EVENT_KEYRELEASE_PAUSE ] = true; }
        if( _pObjectStorage.KeyReleased_ESCAPE)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_ESCAPE] = (_pObjectStorage.KeyReleased_ESCAPE); pObj.Event[GML_EVENT_KEYRELEASE_ESCAPE] = true; }
        if( _pObjectStorage.KeyReleased_SPACE )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_SPACE ] = (_pObjectStorage.KeyReleased_SPACE ); pObj.Event[GML_EVENT_KEYRELEASE_SPACE ] = true; }

        if( _pObjectStorage.KeyReleased_PAGEUP  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_PAGEUP  ] = (_pObjectStorage.KeyReleased_PAGEUP  ); pObj.Event[GML_EVENT_KEYRELEASE_PAGEUP  ] = true; }
        if( _pObjectStorage.KeyReleased_PAGEDOWN)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_PAGEDOWN] = (_pObjectStorage.KeyReleased_PAGEDOWN); pObj.Event[GML_EVENT_KEYRELEASE_PAGEDOWN] = true; }
        if( _pObjectStorage.KeyReleased_END     )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_END     ] = (_pObjectStorage.KeyReleased_END     ); pObj.Event[GML_EVENT_KEYRELEASE_END     ] = true; }
        if( _pObjectStorage.KeyReleased_HOME    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_HOME    ] = (_pObjectStorage.KeyReleased_HOME    ); pObj.Event[GML_EVENT_KEYRELEASE_HOME    ] = true; }
        if( _pObjectStorage.KeyReleased_LEFT    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_LEFT    ] = (_pObjectStorage.KeyReleased_LEFT    ); pObj.Event[GML_EVENT_KEYRELEASE_LEFT    ] = true; }
        if( _pObjectStorage.KeyReleased_UP      )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_UP      ] = (_pObjectStorage.KeyReleased_UP      ); pObj.Event[GML_EVENT_KEYRELEASE_UP      ] = true; }
        if( _pObjectStorage.KeyReleased_RIGHT   )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_RIGHT   ] = (_pObjectStorage.KeyReleased_RIGHT   ); pObj.Event[GML_EVENT_KEYRELEASE_RIGHT   ] = true; }
        if( _pObjectStorage.KeyReleased_DOWN    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_DOWN    ] = (_pObjectStorage.KeyReleased_DOWN    ); pObj.Event[GML_EVENT_KEYRELEASE_DOWN    ] = true; }
        if( _pObjectStorage.KeyReleased_INSERT  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_INSERT  ] = (_pObjectStorage.KeyReleased_INSERT  ); pObj.Event[GML_EVENT_KEYRELEASE_INSERT  ] = true; }
        if( _pObjectStorage.KeyReleased_DELETE  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_DELETE  ] = (_pObjectStorage.KeyReleased_DELETE  ); pObj.Event[GML_EVENT_KEYRELEASE_DELETE  ] = true; }

        if( _pObjectStorage.KeyReleased_0) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_0] = (_pObjectStorage.KeyReleased_0); pObj.Event[GML_EVENT_KEYRELEASE_0] = true; }
        if( _pObjectStorage.KeyReleased_1) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_1] = (_pObjectStorage.KeyReleased_1); pObj.Event[GML_EVENT_KEYRELEASE_1] = true; }
        if( _pObjectStorage.KeyReleased_2) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_2] = (_pObjectStorage.KeyReleased_2); pObj.Event[GML_EVENT_KEYRELEASE_2] = true; }
        if( _pObjectStorage.KeyReleased_3) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_3] = (_pObjectStorage.KeyReleased_3); pObj.Event[GML_EVENT_KEYRELEASE_3] = true; }
        if( _pObjectStorage.KeyReleased_4) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_4] = (_pObjectStorage.KeyReleased_4); pObj.Event[GML_EVENT_KEYRELEASE_4] = true; }
        if( _pObjectStorage.KeyReleased_5) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_5] = (_pObjectStorage.KeyReleased_5); pObj.Event[GML_EVENT_KEYRELEASE_5] = true; }
        if( _pObjectStorage.KeyReleased_6) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_6] = (_pObjectStorage.KeyReleased_6); pObj.Event[GML_EVENT_KEYRELEASE_6] = true; }
        if( _pObjectStorage.KeyReleased_7) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_7] = (_pObjectStorage.KeyReleased_7); pObj.Event[GML_EVENT_KEYRELEASE_7] = true; }
        if( _pObjectStorage.KeyReleased_8) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_8] = (_pObjectStorage.KeyReleased_8); pObj.Event[GML_EVENT_KEYRELEASE_8] = true; }
        if( _pObjectStorage.KeyReleased_9) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_9] = (_pObjectStorage.KeyReleased_9); pObj.Event[GML_EVENT_KEYRELEASE_9] = true; }

        if( _pObjectStorage.KeyReleased_A) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_A] = (_pObjectStorage.KeyReleased_A); pObj.Event[GML_EVENT_KEYRELEASE_A] = true; }
        if( _pObjectStorage.KeyReleased_B) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_B] = (_pObjectStorage.KeyReleased_B); pObj.Event[GML_EVENT_KEYRELEASE_B] = true; }
        if( _pObjectStorage.KeyReleased_C) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_C] = (_pObjectStorage.KeyReleased_C); pObj.Event[GML_EVENT_KEYRELEASE_C] = true; }
        if( _pObjectStorage.KeyReleased_D) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_D] = (_pObjectStorage.KeyReleased_D); pObj.Event[GML_EVENT_KEYRELEASE_D] = true; }
        if( _pObjectStorage.KeyReleased_E) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_E] = (_pObjectStorage.KeyReleased_E); pObj.Event[GML_EVENT_KEYRELEASE_E] = true; }
        if( _pObjectStorage.KeyReleased_F) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F] = (_pObjectStorage.KeyReleased_F); pObj.Event[GML_EVENT_KEYRELEASE_F] = true; }
        if( _pObjectStorage.KeyReleased_G) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_G] = (_pObjectStorage.KeyReleased_G); pObj.Event[GML_EVENT_KEYRELEASE_G] = true; }
        if( _pObjectStorage.KeyReleased_H) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_H] = (_pObjectStorage.KeyReleased_H); pObj.Event[GML_EVENT_KEYRELEASE_H] = true; }
        if( _pObjectStorage.KeyReleased_I) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_I] = (_pObjectStorage.KeyReleased_I); pObj.Event[GML_EVENT_KEYRELEASE_I] = true; }
        if( _pObjectStorage.KeyReleased_J) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_J] = (_pObjectStorage.KeyReleased_J); pObj.Event[GML_EVENT_KEYRELEASE_J] = true; }
        if( _pObjectStorage.KeyReleased_K) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_K] = (_pObjectStorage.KeyReleased_K); pObj.Event[GML_EVENT_KEYRELEASE_K] = true; }
        if( _pObjectStorage.KeyReleased_L) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_L] = (_pObjectStorage.KeyReleased_L); pObj.Event[GML_EVENT_KEYRELEASE_L] = true; }
        if( _pObjectStorage.KeyReleased_M) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_M] = (_pObjectStorage.KeyReleased_M); pObj.Event[GML_EVENT_KEYRELEASE_M] = true; }
        if( _pObjectStorage.KeyReleased_N) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_N] = (_pObjectStorage.KeyReleased_N); pObj.Event[GML_EVENT_KEYRELEASE_N] = true; }
        if( _pObjectStorage.KeyReleased_O) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_O] = (_pObjectStorage.KeyReleased_O); pObj.Event[GML_EVENT_KEYRELEASE_O] = true; }
        if( _pObjectStorage.KeyReleased_P) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_P] = (_pObjectStorage.KeyReleased_P); pObj.Event[GML_EVENT_KEYRELEASE_P] = true; }
        if( _pObjectStorage.KeyReleased_Q) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_Q] = (_pObjectStorage.KeyReleased_Q); pObj.Event[GML_EVENT_KEYRELEASE_Q] = true; }
        if( _pObjectStorage.KeyReleased_R) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_R] = (_pObjectStorage.KeyReleased_R); pObj.Event[GML_EVENT_KEYRELEASE_R] = true; }
        if( _pObjectStorage.KeyReleased_S) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_S] = (_pObjectStorage.KeyReleased_S); pObj.Event[GML_EVENT_KEYRELEASE_S] = true; }
        if( _pObjectStorage.KeyReleased_T) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_T] = (_pObjectStorage.KeyReleased_T); pObj.Event[GML_EVENT_KEYRELEASE_T] = true; }
        if( _pObjectStorage.KeyReleased_U) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_U] = (_pObjectStorage.KeyReleased_U); pObj.Event[GML_EVENT_KEYRELEASE_U] = true; }
        if( _pObjectStorage.KeyReleased_V) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_V] = (_pObjectStorage.KeyReleased_V); pObj.Event[GML_EVENT_KEYRELEASE_V] = true; }
        if( _pObjectStorage.KeyReleased_W) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_W] = (_pObjectStorage.KeyReleased_W); pObj.Event[GML_EVENT_KEYRELEASE_W] = true; }
        if( _pObjectStorage.KeyReleased_X) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_X] = (_pObjectStorage.KeyReleased_X); pObj.Event[GML_EVENT_KEYRELEASE_X] = true; }
        if( _pObjectStorage.KeyReleased_Y) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_Y] = (_pObjectStorage.KeyReleased_Y); pObj.Event[GML_EVENT_KEYRELEASE_Y] = true; }
        if( _pObjectStorage.KeyReleased_Z) { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_Z] = (_pObjectStorage.KeyReleased_Z); pObj.Event[GML_EVENT_KEYRELEASE_Z] = true; }

        if( _pObjectStorage.KeyReleased_F1 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F1 ] = (_pObjectStorage.KeyReleased_F1 ); pObj.Event[GML_EVENT_KEYRELEASE_F1 ] = true; }
        if( _pObjectStorage.KeyReleased_F2 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F2 ] = (_pObjectStorage.KeyReleased_F2 ); pObj.Event[GML_EVENT_KEYRELEASE_F2 ] = true; }
        if( _pObjectStorage.KeyReleased_F3 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F3 ] = (_pObjectStorage.KeyReleased_F3 ); pObj.Event[GML_EVENT_KEYRELEASE_F3 ] = true; }
        if( _pObjectStorage.KeyReleased_F4 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F4 ] = (_pObjectStorage.KeyReleased_F4 ); pObj.Event[GML_EVENT_KEYRELEASE_F4 ] = true; }
        if( _pObjectStorage.KeyReleased_F5 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F5 ] = (_pObjectStorage.KeyReleased_F5 ); pObj.Event[GML_EVENT_KEYRELEASE_F5 ] = true; }
        if( _pObjectStorage.KeyReleased_F6 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F6 ] = (_pObjectStorage.KeyReleased_F6 ); pObj.Event[GML_EVENT_KEYRELEASE_F6 ] = true; }
        if( _pObjectStorage.KeyReleased_F7 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F7 ] = (_pObjectStorage.KeyReleased_F7 ); pObj.Event[GML_EVENT_KEYRELEASE_F7 ] = true; }
        if( _pObjectStorage.KeyReleased_F8 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F8 ] = (_pObjectStorage.KeyReleased_F8 ); pObj.Event[GML_EVENT_KEYRELEASE_F8 ] = true; }
        if( _pObjectStorage.KeyReleased_F9 )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F9 ] = (_pObjectStorage.KeyReleased_F9 ); pObj.Event[GML_EVENT_KEYRELEASE_F9 ] = true; }
        if( _pObjectStorage.KeyReleased_F10)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F10] = (_pObjectStorage.KeyReleased_F10); pObj.Event[GML_EVENT_KEYRELEASE_F10] = true; }
        if( _pObjectStorage.KeyReleased_F11)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F11] = (_pObjectStorage.KeyReleased_F11); pObj.Event[GML_EVENT_KEYRELEASE_F11] = true; }
        if( _pObjectStorage.KeyReleased_F12)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_F12] = (_pObjectStorage.KeyReleased_F12); pObj.Event[GML_EVENT_KEYRELEASE_F12] = true; }

        if( _pObjectStorage.KeyReleased_NUM_LOCK )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_LOCK ] = (_pObjectStorage.KeyReleased_NUM_LOCK ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_LOCK ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_0    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_0    ] = (_pObjectStorage.KeyReleased_NUM_0    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_0    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_1    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_1    ] = (_pObjectStorage.KeyReleased_NUM_1    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_1    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_2    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_2    ] = (_pObjectStorage.KeyReleased_NUM_2    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_2    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_3    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_3    ] = (_pObjectStorage.KeyReleased_NUM_3    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_3    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_4    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_4    ] = (_pObjectStorage.KeyReleased_NUM_4    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_4    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_5    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_5    ] = (_pObjectStorage.KeyReleased_NUM_5    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_5    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_6    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_6    ] = (_pObjectStorage.KeyReleased_NUM_6    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_6    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_7    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_7    ] = (_pObjectStorage.KeyReleased_NUM_7    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_7    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_8    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_8    ] = (_pObjectStorage.KeyReleased_NUM_8    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_8    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_9    )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_9    ] = (_pObjectStorage.KeyReleased_NUM_9    ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_9    ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_STAR )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_STAR ] = (_pObjectStorage.KeyReleased_NUM_STAR ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_STAR ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_PLUS )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_PLUS ] = (_pObjectStorage.KeyReleased_NUM_PLUS ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_PLUS ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_MINUS)   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_MINUS] = (_pObjectStorage.KeyReleased_NUM_MINUS); pObj.Event[GML_EVENT_KEYRELEASE_NUM_MINUS] = true; }
        if( _pObjectStorage.KeyReleased_NUM_DOT  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_DOT  ] = (_pObjectStorage.KeyReleased_NUM_DOT  ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_DOT  ] = true; }
        if( _pObjectStorage.KeyReleased_NUM_DIV  )   { pObj.ObjKeyReleased[GML_EVENT_KEYRELEASE_NUM_DIV  ] = (_pObjectStorage.KeyReleased_NUM_DIV  ); pObj.Event[GML_EVENT_KEYRELEASE_NUM_DIV  ] = true; }

        
        
        // Triggers...
        var i = 0;
        if( _pObjectStorage.TriggerEvents != undefined )
        {
        	while (i < _pObjectStorage.TriggerEvents.length)
        	{
        		var key = parseInt(_pObjectStorage.TriggerEvents[i]) + 1;  // get the object ID (no trigger 0 here)
        		var pFunc = _pObjectStorage.TriggerEvents[i+1];            // get the function to call if the trigger is TRUE
                //var key = g_pTriggerManager.Find(pFunc);
                var pTrig = g_pTriggerManager.Get(key);

        		pObj.Event[EVENT_TRIGGER ] = true;						// flag triggers as used.
        		pObj.Event[EVENT_TRIGGER | key] = true; 			// flag a "specific" trigger as used.

        		var pTrigger = new yyTriggerEvent();
        		pTrigger.m_pFunction = pFunc;
        		pTrigger.m_pTrigger = pTrig;
        		pTrigger.m_Index = key;
        		pObj.Triggers[EVENT_TRIGGER | key] = pTrigger;
				i += 2;
        	}
        }
        


        // Collisions...
        i = 0;
        if( _pObjectStorage.CollisionEvents != undefined )
        {
        	while (i < _pObjectStorage.CollisionEvents.length)
        	{
        		pObj.Event[EVENT_COLLISION] = true;
        		var key = parseInt(_pObjectStorage.CollisionEvents[i]);      // get the object ID
        		var func = _pObjectStorage.CollisionEvents[i + 1];           // get the function callback

        		var pColl = new yyCollisionEntry();
        		pColl.m_pFunction = func;
        		pColl.m_Derived = false;
        		pColl.m_pObject = this;

        		pObj.Collisions[key] = pColl;
				i += 2;
        	}
        }
        
        // Physics data
        if (_pObjectStorage.physicsObject != undefined) {
            
            pObj.PhysicsData.physicsObject = _pObjectStorage.physicsObject;
            pObj.PhysicsData.physicsSensor = _pObjectStorage.physicsSensor;
            pObj.PhysicsData.physicsShape = _pObjectStorage.physicsShape;
            pObj.PhysicsData.physicsDensity = _pObjectStorage.physicsDensity;
            pObj.PhysicsData.physicsRestitution = _pObjectStorage.physicsRestitution;
            pObj.PhysicsData.physicsGroup = _pObjectStorage.physicsGroup;
            pObj.PhysicsData.physicsLinearDamping = _pObjectStorage.physicsLinearDamping;
            pObj.PhysicsData.physicsAngularDamping = _pObjectStorage.physicsAngularDamping;
            pObj.PhysicsData.physicsFriction = _pObjectStorage.physicsFriction;
            pObj.PhysicsData.physicsAwake = _pObjectStorage.physicsAwake;
            pObj.PhysicsData.physicsKinematic = _pObjectStorage.physicsKinematic;
            pObj.PhysicsData.physicsShapeVertices = _pObjectStorage.physicsShapeVertices;
        }
    }
    return pObj;
}


// #############################################################################################
/// Function:<summary>
///             Create an object from its "loaded" data
///          </summary>
///
/// In:		 <param name="_ID"></param>
///			 <param name="_pObjectStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyObject.prototype.HasEvent = function (_event, _subevent) {
	if (this.Event[_event]) return true;
	return false;
};

// #############################################################################################
/// Function:<summary>
///             Execute a single event for this object
///          </summary>
///
/// In:		 <param name="_pInst">this object</param>
///			 <param name="_pother">other object</param>
// #############################################################################################
yyObject.prototype.PerformEvent = function (_event, index, _pInst, _pOther, _is_async) {
    // Stop when room has changed or an error occured
    //+allow certain events when room or instance is persistent (as native runner)
    if (!_is_async && (_event != EVENT_CLEAN_UP) && New_Room != -1  && !((_pInst.persistent || g_RunRoom.m_persistent) && ((_event==EVENT_CREATE) || (_event == EVENT_PRE_CREATE) || (_event==EVENT_DESTROY) || (_event==EVENT_ALARM) || (_event == EVENT_OTHER) || (_event == EVENT_OTHER_NETWORKING) || (_event == EVENT_OTHER_WEB_ASYNC)))){
        return;
    }


	var LastEvent = g_LastEvent;
	var LastEventArrayIndex = g_LastEventArrayIndex;
	var LastEventpObject = g_LastEventpObject;
	var oldrel = Argument_Relative;

	g_LastEventpObject = this;
	g_LastEvent = _event;
	g_LastEventArrayIndex = index;
	Argument_Relative = false;

	var done = true;
	switch (_event)
	{
        case EVENT_PRE_CREATE: if (this.PreCreateEvent) this.PreCreateEvent(_pInst, _pOther); else done = false; break;
		case EVENT_CREATE: if (this.CreateEvent) this.CreateEvent(_pInst, _pOther); else done = false; break;
		case EVENT_DESTROY: if (this.DestroyEvent) this.DestroyEvent(_pInst, _pOther); else done = false; break;
		case EVENT_CLEAN_UP: if (this.CleanUpEvent) this.CleanUpEvent(_pInst, _pOther); else done = false; break;
		case EVENT_ALARM: done = false; break;  // Shouldn't get called directly
		case EVENT_STEP: done = false; break;
		case EVENT_COLLISION: if (this.Collisions[index]) this.Collisions[index].m_pFunction(_pInst, _pOther); break;
		case EVENT_KEYBOARD: if (this.ObjKeyDown[_event | index]) this.ObjKeyDown[_event | index](_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE: done = false; break;  // Shouldn't get called directly
		case EVENT_OTHER: done = false; break;  // Shouldn't get called directly
		case EVENT_DRAW: if (this.DrawEvent) this.DrawEvent(_pInst, _pOther); else done = false; break;
		case EVENT_KEYPRESS: if (this.ObjKeyPressed[_event | index]) this.ObjKeyPressed[_event | index](_pInst, _pOther); else done = false; break;
		case EVENT_KEYRELEASE: if (this.ObjKeyReleased[_event | index]) this.ObjKeyReleased[_event | index](_pInst, _pOther); else done = false; break;
		case EVENT_TRIGGER: if (this.Triggers[_event | index])
			{
				var pTriggerEvent = this.Triggers[_event | index]; 						// 1st get the trigger event block
				var pTrigger = pTriggerEvent.m_pTrigger;							// Now get the trigger "store" 
				var result = pTrigger.pFunc(_pInst, _pOther);						// evaluater the trigger
				if (result | g_ForceTrigger)
				{
					pTriggerEvent.m_pFunction(_pInst, _pOther);						// Finally, IF the trigger returned TRUE, call the object event.
				}
			}
			break;

		case EVENT_DRAW_GUI: if (this.DrawGUI) this.DrawGUI(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_BEGIN: if (this.DrawEventBegin) this.DrawEventBegin(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_END: if (this.DrawEventEnd) this.DrawEventEnd(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_GUI_BEGIN: if (this.DrawGUIBegin) this.DrawGUIBegin(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_GUI_END: if (this.DrawGUIEnd) this.DrawGUIEnd(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_PRE: if (this.DrawPre) this.DrawPre(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_POST: if (this.DrawPost) this.DrawPost(_pInst, _pOther); else done = false; break;
		case EVENT_DRAW_RESIZE: if (this.DrawResize) this.DrawResize(_pInst, _pOther); else done = false; break;

		case EVENT_STEP_BEGIN: if (this.StepBeginEvent) this.StepBeginEvent(_pInst, _pOther); else done = false; break;
		case EVENT_STEP_NORMAL: if (this.StepNormalEvent) this.StepNormalEvent(_pInst, _pOther); else done = false; break;
		case EVENT_STEP_END: if (this.StepEndEvent) this.StepEndEvent(_pInst, _pOther); else done = false; break;

		case EVENT_OTHER_OUTSIDE: if (this.OutsideEvent) this.OutsideEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY: if (this.BoundaryEvent) this.BoundaryEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_STARTGAME: if (this.StartGameEvent) this.StartGameEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_ENDGAME: if (this.EndGameEvent) this.EndGameEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_STARTROOM: if (this.StartRoomEvent) this.StartRoomEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_ENDROOM: if (this.EndRoomEvent) this.EndRoomEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_NOLIVES: if (this.NoLivesEvent) this.NoLivesEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_ANIMATIONEND: if (this.AnimationEndEvent) this.AnimationEndEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_ENDOFPATH: if (this.EndOfPathEvent) this.EndOfPathEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_NOHEALTH: if (this.NoHealthEvent) this.NoHealthEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_CLOSEBUTTON: if (this.CloseButtonEvent) this.CloseButtonEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW0: if (this.OutsideView0Event) this.OutsideView0Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW1: if (this.OutsideView1Event) this.OutsideView1Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW2: if (this.OutsideView2Event) this.OutsideView2Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW3: if (this.OutsideView3Event) this.OutsideView3Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW4: if (this.OutsideView4Event) this.OutsideView4Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW5: if (this.OutsideView5Event) this.OutsideView5Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW6: if (this.OutsideView6Event) this.OutsideView6Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_OUTSIDE_VIEW7: if (this.OutsideView7Event) this.OutsideView7Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW0: if (this.BoundaryView0Event) this.BoundaryView0Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW1: if (this.BoundaryView1Event) this.BoundaryView1Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW2: if (this.BoundaryView2Event) this.BoundaryView2Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW3: if (this.BoundaryView3Event) this.BoundaryView3Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW4: if (this.BoundaryView4Event) this.BoundaryView4Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW5: if (this.BoundaryView5Event) this.BoundaryView5Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW6: if (this.BoundaryView6Event) this.BoundaryView6Event(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_BOUNDARY_VIEW7: if (this.BoundaryView7Event) this.BoundaryView7Event(_pInst, _pOther); else done = false; break;
		
		case EVENT_OTHER_ANIMATIONUPDATE: if (this.AnimationUpdateEvent) this.AnimationUpdateEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_ANIMATIONEVENT: if (this.AnimationEventEvent) this.AnimationEventEvent(_pInst, _pOther); else done = false; break;

		case EVENT_OTHER_WEB_IMAGE_LOAD: if (this.WebImageLoadedEvent) this.WebImageLoadedEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_WEB_SOUND_LOAD: if (this.WebSoundLoadedEvent) this.WebSoundLoadedEvent(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_WEB_ASYNC: if (this.WebAsyncEvent) this.WebAsyncEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_WEB_USER_INTERACTION: if (this.WebUserInteractionEvent) this.WebUserInteractionEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_WEB_IAP: if (this.WebIAPEvent) this.WebIAPEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_SOCIAL: if( this.SocialEvent) this.SocialEvent( _pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_PUSH_NOTIFICATION: if( this.PushNotificationEvent) this.PushNotificationEvent( _pInst, _pOther); else done =false; break;
        case EVENT_OTHER_ASYNC_SAVE_LOAD: if( this.AsyncSaveLoadEvent) this.AsyncSaveLoadEvent( _pInst, _pOther); else done =false; break;
        case EVENT_OTHER_NETWORKING: if( this.NetworkingEvent) this.NetworkingEvent( _pInst, _pOther); else done =false; break;
	    case EVENT_OTHER_AUDIO_PLAYBACK: if (this.AudioPlaybackEvent) this.AudioPlaybackEvent( _pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_AUDIO_RECORDING: if (this.AudioRecordingEvent) this.AudioRecordingEvent( _pInst, _pOther); else done = false; break;
	    case EVENT_OTHER_SYSTEM_EVENT: if (this.SystemEvent) this.SystemEvent(_pInst, _pOther); else done = false; break;

	    case EVENT_OTHER_BROADCAST_MESSAGE: if (this.BroadcastMessageEvent) this.BroadcastMessageEvent(_pInst, _pOther); else done = false; break;

		case EVENT_OTHER_USER0: if (this.UserEvent0) this.UserEvent0(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER1: if (this.UserEvent1) this.UserEvent1(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER2: if (this.UserEvent2) this.UserEvent2(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER3: if (this.UserEvent3) this.UserEvent3(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER4: if (this.UserEvent4) this.UserEvent4(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER5: if (this.UserEvent5) this.UserEvent5(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER6: if (this.UserEvent6) this.UserEvent6(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER7: if (this.UserEvent7) this.UserEvent7(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER8: if (this.UserEvent8) this.UserEvent8(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER9: if (this.UserEvent9) this.UserEvent9(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER10: if (this.UserEvent10) this.UserEvent10(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER11: if (this.UserEvent11) this.UserEvent11(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER12: if (this.UserEvent12) this.UserEvent12(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER13: if (this.UserEvent13) this.UserEvent13(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER14: if (this.UserEvent14) this.UserEvent14(_pInst, _pOther); else done = false; break;
		case EVENT_OTHER_USER15: if (this.UserEvent15) this.UserEvent15(_pInst, _pOther); else done = false; break;


		case EVENT_MOUSE_NOBUTTON: if (this.NoButtonPressed) this.NoButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_LBUTTON_DOWN: if (this.LeftButtonDown) this.LeftButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_RBUTTON_DOWN: if (this.RightButtonDown) this.RightButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_MBUTTON_DOWN: if (this.MiddleButtonDown) this.MiddleButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_LBUTTON_PRESSED: if (this.LeftButtonPressed) this.LeftButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_RBUTTON_PRESSED: if (this.RightButtonPressed) this.RightButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_MBUTTON_PRESSED: if (this.MiddleButtonPressed) this.MiddleButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_LBUTTON_RELEASED: if (this.LeftButtonReleased) this.LeftButtonReleased(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_RBUTTON_RELEASED: if (this.RightButtonReleased) this.RightButtonReleased(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_MBUTTON_RELEASED: if (this.MiddleButtonReleased) this.MiddleButtonReleased(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_WHEEL_UP: if (this.MouseWheelUp) this.MouseWheelUp(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_WHEEL_DOWN: if (this.MouseWheelDown) this.MouseWheelDown(_pInst, _pOther); else done = false; break;

		case EVENT_MOUSE_GLOBAL_LBUTTON_DOWN: if (this.GlobalLeftButtonDown) this.GlobalLeftButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_RBUTTON_DOWN: if (this.GlobalRightButtonDown) this.GlobalRightButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_MBUTTON_DOWN: if (this.GlobalMiddleButtonDown) this.GlobalMiddleButtonDown(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED: if (this.GlobalLeftButtonPressed) this.GlobalLeftButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_RBUTTON_PRESSED: if (this.GlobalRightButtonPressed) this.GlobalRightButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_MBUTTON_PRESSED: if (this.GlobalMiddleButtonPressed) this.GlobalMiddleButtonPressed(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED: if (this.GlobalLeftButtonReleased) this.GlobalLeftButtonReleased(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_RBUTTON_RELEASED: if (this.GlobalRightButtonReleased) this.GlobalRightButtonReleased(_pInst, _pOther); else done = false; break;
		case EVENT_MOUSE_GLOBAL_MBUTTON_RELEASED: if (this.GlobalMiddleButtonReleased) this.GlobalMiddleButtonReleased(_pInst, _pOther); else done = false; break;

		case EVENT_MOUSE_ENTER: if (this.MouseEnter) this.MouseEnter(_pInst, _pOther); else done = false; break;
	    case EVENT_MOUSE_LEAVE: if (this.MouseLeave) this.MouseLeave(_pInst, _pOther); else done = false; break;

	    case EVENT_GESTURE_TAP: if (this.GestureTapEvent) this.GestureTapEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_DOUBLE_TAP: if (this.GestureDoubleTapEvent) this.GestureDoubleTapEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_DRAG_START: if (this.GestureDragStartEvent) this.GestureDragStartEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_DRAG_MOVE: if (this.GestureDragMoveEvent) this.GestureDragMoveEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_DRAG_END: if (this.GestureDragEndEvent) this.GestureDragEndEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_FLICK: if (this.GestureFlickEvent) this.GestureFlickEvent(_pInst, _pOther); else done = false; break;

	    case EVENT_GESTURE_GLOBAL_TAP: if (this.GestureGlobalTapEvent) this.GestureGlobalTapEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_GLOBAL_DOUBLE_TAP: if (this.GestureGlobalDoubleTapEvent) this.GestureGlobalDoubleTapEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_GLOBAL_DRAG_START: if (this.GestureGlobalDragStartEvent) this.GestureGlobalDragStartEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_GLOBAL_DRAG_MOVE: if (this.GestureGlobalDragMoveEvent) this.GestureGlobalDragMoveEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_GLOBAL_DRAG_END: if (this.GestureGlobalDragEndEvent) this.GestureGlobalDragEndEvent(_pInst, _pOther); else done = false; break;
	    case EVENT_GESTURE_GLOBAL_FLICK: if (this.GestureGlobalFlickEvent) this.GestureGlobalFlickEvent(_pInst, _pOther); else done = false; break;

		case EVENT_ALARM_0: if (this.ObjAlarm[0] != null) this.ObjAlarm[0](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_1: if (this.ObjAlarm[1] != null) this.ObjAlarm[1](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_2: if (this.ObjAlarm[2] != null) this.ObjAlarm[2](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_3: if (this.ObjAlarm[3] != null) this.ObjAlarm[3](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_4: if (this.ObjAlarm[4] != null) this.ObjAlarm[4](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_5: if (this.ObjAlarm[5] != null) this.ObjAlarm[5](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_6: if (this.ObjAlarm[6] != null) this.ObjAlarm[6](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_7: if (this.ObjAlarm[7] != null) this.ObjAlarm[7](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_8: if (this.ObjAlarm[8] != null) this.ObjAlarm[8](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_9: if (this.ObjAlarm[9] != null) this.ObjAlarm[9](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_10: if (this.ObjAlarm[10] != null) this.ObjAlarm[10](_pInst, _pOther); else done = false; break;
		case EVENT_ALARM_11: if (this.ObjAlarm[11] != null) this.ObjAlarm[11](_pInst, _pOther); else done = false; break;

		default:
			done = false;
	}

	Argument_Relative = oldrel;
	g_LastEvent = LastEvent;
	g_LastEventArrayIndex = LastEventArrayIndex;
	g_LastEventpObject = LastEventpObject;
	return done;
};


// #############################################################################################
/// Function:<summary>
///             Convert the event type from HTML5 events to GML events
///          </summary>
///
/// In:		 <param name="_event">HTML5 event</param>
/// out:     <returns>
///             GML Event
///          </returns>
// #############################################################################################
function ConvertEvent(_event)
{
    switch (_event) {
        case EVENT_PRE_CREATE: return GML_EVENT_PRE_CREATE;
        case EVENT_CREATE: return GML_EVENT_CREATE;
        case EVENT_DESTROY: return GML_EVENT_DESTROY;
        case EVENT_CLEAN_UP: return GML_EVENT_CLEAN_UP;
        case EVENT_ALARM: return GML_EVENT_ALARM;
        case EVENT_STEP: return GML_EVENT_STEP;
        case EVENT_COLLISION: return GML_EVENT_COLLISION;
        case EVENT_KEYBOARD: return GML_EVENT_KEYBOARD;
        case EVENT_MOUSE: return GML_EVENT_MOUSE;
        case EVENT_OTHER: return GML_EVENT_OTHER;
        case EVENT_DRAW: return GML_EVENT_DRAW;
        case EVENT_KEYPRESS: return GML_EVENT_KEYPRESS;
        case EVENT_KEYRELEASE: return GML_EVENT_KEYRELEASE;
        case EVENT_TRIGGER: return GML_EVENT_TRIGGER;

        case EVENT_DRAW_GUI: return GML_EVENT_DRAW;
        case EVENT_DRAW_BEGIN: return GML_EVENT_DRAW;
        case EVENT_DRAW_END: return GML_EVENT_DRAW;
        case EVENT_DRAW_GUI_BEGIN: return GML_EVENT_DRAW;
        case EVENT_DRAW_GUI_END: return GML_EVENT_DRAW;
        case EVENT_DRAW_PRE: return GML_EVENT_DRAW;
        case EVENT_DRAW_POST: return GML_EVENT_DRAW;
        case EVENT_DRAW_RESIZE: return GML_EVENT_DRAW;

        case EVENT_STEP_BEGIN: return GML_EVENT_STEP;
        case EVENT_STEP_NORMAL: return GML_EVENT_STEP;
        case EVENT_STEP_END: return GML_EVENT_STEP;

        case EVENT_OTHER_OUTSIDE:           return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY:          return GML_EVENT_OTHER;
        case EVENT_OTHER_STARTGAME:         return GML_EVENT_OTHER;
        case EVENT_OTHER_ENDGAME:           return GML_EVENT_OTHER;
        case EVENT_OTHER_STARTROOM:         return GML_EVENT_OTHER;
        case EVENT_OTHER_ENDROOM:           return GML_EVENT_OTHER;
        case EVENT_OTHER_NOLIVES:           return GML_EVENT_OTHER;
        case EVENT_OTHER_ANIMATIONEND:      return GML_EVENT_OTHER;
        case EVENT_OTHER_ENDOFPATH:         return GML_EVENT_OTHER;
        case EVENT_OTHER_NOHEALTH:          return GML_EVENT_OTHER;
        case EVENT_OTHER_CLOSEBUTTON:       return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW0:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW1:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW2:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW3:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW4:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW5:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW6:     return GML_EVENT_OTHER;
        case EVENT_OTHER_OUTSIDE_VIEW7:     return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW0:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW1:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW2:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW3:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW4:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW5:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW6:    return GML_EVENT_OTHER;
        case EVENT_OTHER_BOUNDARY_VIEW7:    return GML_EVENT_OTHER;

        case EVENT_OTHER_ANIMATIONUPDATE: return GML_EVENT_OTHER;
        case EVENT_OTHER_ANIMATIONEVENT: return GML_EVENT_OTHER;

        case EVENT_OTHER_WEB_IMAGE_LOAD:        return GML_EVENT_OTHER;
        case EVENT_OTHER_WEB_SOUND_LOAD:        return GML_EVENT_OTHER;
        case EVENT_OTHER_WEB_ASYNC:             return GML_EVENT_OTHER;
        case EVENT_OTHER_WEB_USER_INTERACTION:  return GML_EVENT_OTHER;
        case EVENT_OTHER_WEB_IAP:               return GML_EVENT_OTHER;
        case EVENT_OTHER_SOCIAL:                return GML_EVENT_OTHER;
        case EVENT_OTHER_PUSH_NOTIFICATION:     return GML_EVENT_OTHER;
        case EVENT_OTHER_ASYNC_SAVE_LOAD:       return GML_EVENT_OTHER;
        case EVENT_OTHER_NETWORKING:            return GML_EVENT_OTHER;
        case EVENT_OTHER_AUDIO_PLAYBACK:        return GML_EVENT_OTHER;
        case EVENT_OTHER_AUDIO_RECORDING:       return GML_EVENT_OTHER;
        case EVENT_OTHER_SYSTEM_EVENT:          return GML_EVENT_OTHER;

        case EVENT_OTHER_USER0: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER1: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER2: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER3: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER4: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER5: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER6: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER7: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER8: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER9: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER10: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER11: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER12: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER13: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER14: return GML_EVENT_OTHER;
        case EVENT_OTHER_USER15: return GML_EVENT_OTHER;


        case EVENT_MOUSE_NOBUTTON:          return GML_EVENT_MOUSE;
        case EVENT_MOUSE_LBUTTON_DOWN:      return GML_EVENT_MOUSE;
        case EVENT_MOUSE_RBUTTON_DOWN:      return GML_EVENT_MOUSE;
        case EVENT_MOUSE_MBUTTON_DOWN:      return GML_EVENT_MOUSE;
        case EVENT_MOUSE_LBUTTON_PRESSED:   return GML_EVENT_MOUSE;
        case EVENT_MOUSE_RBUTTON_PRESSED:   return GML_EVENT_MOUSE;
        case EVENT_MOUSE_MBUTTON_PRESSED:   return GML_EVENT_MOUSE;
        case EVENT_MOUSE_LBUTTON_RELEASED:  return GML_EVENT_MOUSE;
        case EVENT_MOUSE_RBUTTON_RELEASED:  return GML_EVENT_MOUSE;
        case EVENT_MOUSE_MBUTTON_RELEASED:  return GML_EVENT_MOUSE;
        case EVENT_MOUSE_WHEEL_UP:          return GML_EVENT_MOUSE;
        case EVENT_MOUSE_WHEEL_DOWN:        return GML_EVENT_MOUSE;

        case EVENT_MOUSE_GLOBAL_LBUTTON_DOWN: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_RBUTTON_DOWN: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_MBUTTON_DOWN: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_RBUTTON_PRESSED: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_MBUTTON_PRESSED: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_RBUTTON_RELEASED: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_GLOBAL_MBUTTON_RELEASED: return GML_EVENT_MOUSE;

        case EVENT_MOUSE_ENTER: return GML_EVENT_MOUSE;
        case EVENT_MOUSE_LEAVE: return GML_EVENT_MOUSE;

        case EVENT_GESTURE_TAP:         return GML_EVENT_GESTURE;
        case EVENT_GESTURE_DOUBLE_TAP:  return GML_EVENT_GESTURE;
        case EVENT_GESTURE_DRAG_START:  return GML_EVENT_GESTURE;
        case EVENT_GESTURE_DRAG_MOVE:   return GML_EVENT_GESTURE;
        case EVENT_GESTURE_DRAG_END:    return GML_EVENT_GESTURE;
        case EVENT_GESTURE_FLICK:       return GML_EVENT_GESTURE;

        case EVENT_GESTURE_GLOBAL_TAP: return GML_EVENT_GESTURE;
        case EVENT_GESTURE_GLOBAL_DOUBLE_TAP: return GML_EVENT_GESTURE;
        case EVENT_GESTURE_GLOBAL_DRAG_START: return GML_EVENT_GESTURE;
        case EVENT_GESTURE_GLOBAL_DRAG_MOVE: return GML_EVENT_GESTURE;
        case EVENT_GESTURE_GLOBAL_DRAG_END: return GML_EVENT_GESTURE;
        case EVENT_GESTURE_GLOBAL_FLICK: return GML_EVENT_GESTURE;

        case EVENT_ALARM_0: return GML_EVENT_ALARM;
        case EVENT_ALARM_1: return GML_EVENT_ALARM;
        case EVENT_ALARM_2: return GML_EVENT_ALARM;
        case EVENT_ALARM_3: return GML_EVENT_ALARM;
        case EVENT_ALARM_4: return GML_EVENT_ALARM;
        case EVENT_ALARM_5: return GML_EVENT_ALARM;
        case EVENT_ALARM_6: return GML_EVENT_ALARM;
        case EVENT_ALARM_7: return GML_EVENT_ALARM;
        case EVENT_ALARM_8: return GML_EVENT_ALARM;
        case EVENT_ALARM_9: return GML_EVENT_ALARM;
        case EVENT_ALARM_10: return GML_EVENT_ALARM;
        case EVENT_ALARM_11: return GML_EVENT_ALARM;

        default:
            return -1;      // who knows
    }
}

// #############################################################################################
/// Function:<summary>
///             Convert the event type from HTML5 events to GML "sub" events
///          </summary>
///
/// In:		 <param name="_event">HTML5 event</param>
/// out:     <returns>
///             GML Event
///          </returns>
// #############################################################################################
function ConvertSubEvent(_event, _subevent)
{
    if ((_event & 0xff00) == EVENT_KEYBOARD) {
        return _subevent;
    } else if ((_event & 0xff00) == EVENT_KEYPRESS) {
        return _subevent;
    } else if ((_event & 0xff00) == EVENT_KEYRELEASE) {
        return _subevent;
    } else if ((_event & 0xff00) == EVENT_COLLISION) {
        return _subevent;
    }


    switch (_event)
    {
        case EVENT_PRE_CREATE: return 0;
        case EVENT_CREATE: return 0;
        case EVENT_DESTROY: return 0;
        case EVENT_CLEAN_UP: return 0;
        case EVENT_ALARM: return 0;
        case EVENT_STEP: return 0;
        case EVENT_COLLISION: return 0;
        case EVENT_KEYBOARD: return _subevent;
        case EVENT_MOUSE: return 0;
        case EVENT_OTHER: return 0;
        case EVENT_DRAW: return 0;
        case EVENT_KEYPRESS: return _subevent;
        case EVENT_KEYRELEASE: return _subevent;
        case EVENT_TRIGGER: return 0;

        case EVENT_DRAW_GUI: return GML_EVENT_DRAW_GUI;
        case EVENT_DRAW_BEGIN: return EVENT_DRAW_BEGIN & 0xff;
        case EVENT_DRAW_END: return EVENT_DRAW_END & 0xff;
        case EVENT_DRAW_GUI_BEGIN: return EVENT_DRAW_GUI_BEGIN & 0xff;
        case EVENT_DRAW_GUI_END: return EVENT_DRAW_GUI_END & 0xff;
        case EVENT_DRAW_PRE: return EVENT_DRAW_PRE & 0xff;
        case EVENT_DRAW_POST: return EVENT_DRAW_POST & 0xff;
        case EVENT_DRAW_RESIZE: return GML_EVENT_DRAW_RESIZE & 0xff;

        case EVENT_STEP_BEGIN: return GML_EVENT_STEP_BEGIN;
        case EVENT_STEP_NORMAL: return GML_EVENT_STEP_NORMAL;
        case EVENT_STEP_END: return GML_EVENT_STEP_END;

        case EVENT_OTHER_OUTSIDE: return GML_EVENT_OTHER_OUTSIDE;
        case EVENT_OTHER_BOUNDARY: return GML_EVENT_OTHER_BOUNDARY;
        case EVENT_OTHER_STARTGAME: return GML_EVENT_OTHER_STARTGAME;
        case EVENT_OTHER_ENDGAME: return GML_EVENT_OTHER_ENDGAME;
        case EVENT_OTHER_STARTROOM: return GML_EVENT_OTHER_STARTROOM;
        case EVENT_OTHER_ENDROOM: return GML_EVENT_OTHER_ENDROOM;
        case EVENT_OTHER_NOLIVES: return GML_EVENT_OTHER_NOLIVES;
        case EVENT_OTHER_ANIMATIONEND: return GML_EVENT_OTHER_ANIMATIONEND;
        case EVENT_OTHER_ENDOFPATH: return GML_EVENT_OTHER_ENDOFPATH;
        case EVENT_OTHER_NOHEALTH: return GML_EVENT_OTHER_NOHEALTH;
        case EVENT_OTHER_CLOSEBUTTON: return GML_EVENT_OTHER_CLOSEBUTTON;
        case EVENT_OTHER_OUTSIDE_VIEW0: return GML_EVENT_OTHER_OUTSIDE_VIEW0;
        case EVENT_OTHER_OUTSIDE_VIEW1: return GML_EVENT_OTHER_OUTSIDE_VIEW1;
        case EVENT_OTHER_OUTSIDE_VIEW2: return GML_EVENT_OTHER_OUTSIDE_VIEW2;
        case EVENT_OTHER_OUTSIDE_VIEW3: return GML_EVENT_OTHER_OUTSIDE_VIEW3;
        case EVENT_OTHER_OUTSIDE_VIEW4: return GML_EVENT_OTHER_OUTSIDE_VIEW4;
        case EVENT_OTHER_OUTSIDE_VIEW5: return GML_EVENT_OTHER_OUTSIDE_VIEW5;
        case EVENT_OTHER_OUTSIDE_VIEW6: return GML_EVENT_OTHER_OUTSIDE_VIEW6;
        case EVENT_OTHER_OUTSIDE_VIEW7: return GML_EVENT_OTHER_OUTSIDE_VIEW7;
        case EVENT_OTHER_BOUNDARY_VIEW0: return GML_EVENT_OTHER_BOUNDARY_VIEW0;
        case EVENT_OTHER_BOUNDARY_VIEW1: return GML_EVENT_OTHER_BOUNDARY_VIEW1;
        case EVENT_OTHER_BOUNDARY_VIEW2: return GML_EVENT_OTHER_BOUNDARY_VIEW2;
        case EVENT_OTHER_BOUNDARY_VIEW3: return GML_EVENT_OTHER_BOUNDARY_VIEW3;
        case EVENT_OTHER_BOUNDARY_VIEW4: return GML_EVENT_OTHER_BOUNDARY_VIEW4;
        case EVENT_OTHER_BOUNDARY_VIEW5: return GML_EVENT_OTHER_BOUNDARY_VIEW5;
        case EVENT_OTHER_BOUNDARY_VIEW6: return GML_EVENT_OTHER_BOUNDARY_VIEW6;
        case EVENT_OTHER_BOUNDARY_VIEW7: return GML_EVENT_OTHER_BOUNDARY_VIEW7;

        case EVENT_OTHER_ANIMATIONUPDATE: return GML_EVENT_OTHER_ANIMATIONUPDATE;
        case EVENT_OTHER_ANIMATIONEVENT: return GML_EVENT_OTHER_ANIMATIONEVENT;

        case EVENT_OTHER_WEB_IMAGE_LOAD: return GML_EVENT_OTHER_WEB_IMAGE_LOAD;
        case EVENT_OTHER_WEB_SOUND_LOAD: return GML_EVENT_OTHER_WEB_SOUND_LOAD;
        case EVENT_OTHER_WEB_ASYNC: return GML_EVENT_OTHER_ASYNC_SAVE_LOAD;
        case EVENT_OTHER_WEB_USER_INTERACTION: return GML_EVENT_OTHER_WEB_USER_INTERACTION;
        case EVENT_OTHER_WEB_IAP: return GML_EVENT_OTHER_IAP;
        case EVENT_OTHER_SOCIAL: return GML_EVENT_OTHER_SOCIAL;
        case EVENT_OTHER_PUSH_NOTIFICATION: return GML_EVENT_OTHER_PUSH_NOTIFICATION;
        case EVENT_OTHER_ASYNC_SAVE_LOAD: return GML_EVENT_OTHER_ASYNC_SAVE_LOAD;
        case EVENT_OTHER_NETWORKING: return GML_EVENT_OTHER_NETWORKING;
        case EVENT_OTHER_AUDIO_PLAYBACK: return GML_EVENT_OTHER_AUDIO_PLAYBACK;
        case EVENT_OTHER_AUDIO_RECORDING: return EVENT_OTHER_AUDIO_RECORDING;
        case EVENT_OTHER_SYSTEM_EVENT: return GML_EVENT_OTHER_SYSTEM_EVENT;

        case EVENT_OTHER_BROADCAST_MESSAGE: return GML_EVENT_OTHER_BROADCAST_MESSAGE;

        case EVENT_OTHER_USER0: return GML_EVENT_OTHER_USER0;
        case EVENT_OTHER_USER1: return GML_EVENT_OTHER_USER1;
        case EVENT_OTHER_USER2: return GML_EVENT_OTHER_USER2;
        case EVENT_OTHER_USER3: return GML_EVENT_OTHER_USER3;
        case EVENT_OTHER_USER4: return GML_EVENT_OTHER_USER4;
        case EVENT_OTHER_USER5: return GML_EVENT_OTHER_USER5;
        case EVENT_OTHER_USER6: return GML_EVENT_OTHER_USER6;
        case EVENT_OTHER_USER7: return GML_EVENT_OTHER_USER7;
        case EVENT_OTHER_USER8: return GML_EVENT_OTHER_USER8;
        case EVENT_OTHER_USER9: return GML_EVENT_OTHER_USER9;
        case EVENT_OTHER_USER10: return GML_EVENT_OTHER_USER10;
        case EVENT_OTHER_USER11: return GML_EVENT_OTHER_USER11;
        case EVENT_OTHER_USER12: return GML_EVENT_OTHER_USER12;
        case EVENT_OTHER_USER13: return GML_EVENT_OTHER_USER13;
        case EVENT_OTHER_USER14: return GML_EVENT_OTHER_USER14;
        case EVENT_OTHER_USER15: return GML_EVENT_OTHER_USER15;


        case EVENT_MOUSE_NOBUTTON: return GML_MOUSE_NoButton;
        case EVENT_MOUSE_LBUTTON_DOWN: return GML_MOUSE_LeftButton;
        case EVENT_MOUSE_RBUTTON_DOWN: return GML_MOUSE_RightButton;
        case EVENT_MOUSE_MBUTTON_DOWN: return GML_MOUSE_MiddleButton;
        case EVENT_MOUSE_LBUTTON_PRESSED: return GML_MOUSE_LeftPressed;
        case EVENT_MOUSE_RBUTTON_PRESSED: return GML_MOUSE_RightPressed;
        case EVENT_MOUSE_MBUTTON_PRESSED: return GML_MOUSE_MiddlePressed;
        case EVENT_MOUSE_LBUTTON_RELEASED: return GML_MOUSE_LeftReleased;
        case EVENT_MOUSE_RBUTTON_RELEASED: return GML_MOUSE_RightReleased;
        case EVENT_MOUSE_MBUTTON_RELEASED: return GML_MOUSE_MiddleReleased;
        case EVENT_MOUSE_WHEEL_UP: return GML_MOUSE_GML_MOUSEWheelUp;
        case EVENT_MOUSE_WHEEL_DOWN: return GML_MOUSE_GML_MOUSEWheelDown;

        case EVENT_MOUSE_GLOBAL_LBUTTON_DOWN: return GML_MOUSE_GlobLeftButton;
        case EVENT_MOUSE_GLOBAL_RBUTTON_DOWN: return GML_MOUSE_GlobRightButton;
        case EVENT_MOUSE_GLOBAL_MBUTTON_DOWN: return GML_MOUSE_GlobMiddleButton;
        case EVENT_MOUSE_GLOBAL_LBUTTON_PRESSED: return GML_MOUSE_GlobLeftPressed;
        case EVENT_MOUSE_GLOBAL_RBUTTON_PRESSED: return GML_MOUSE_GlobRightPressed;
        case EVENT_MOUSE_GLOBAL_MBUTTON_PRESSED: return GML_MOUSE_GlobMiddlePressed;
        case EVENT_MOUSE_GLOBAL_LBUTTON_RELEASED: return GML_MOUSE_GlobLeftReleased;
        case EVENT_MOUSE_GLOBAL_RBUTTON_RELEASED: return GML_MOUSE_GlobRightReleased;
        case EVENT_MOUSE_GLOBAL_MBUTTON_RELEASED: return GML_MOUSE_GlobMiddleReleased;

        case EVENT_MOUSE_ENTER: return GML_MOUSE_MOUSEEnter;
        case EVENT_MOUSE_LEAVE: return GML_MOUSE_MOUSELeave;

        case EVENT_GESTURE_TAP: return GML_EVENT_GESTURE_TAP;
        case EVENT_GESTURE_DOUBLE_TAP: return GML_EVENT_GESTURE_DOUBLE_TAP;
        case EVENT_GESTURE_DRAG_START: return GML_EVENT_GESTURE_DRAG_START;
        case EVENT_GESTURE_DRAG_MOVE: return GML_EVENT_GESTURE_DRAG_MOVE;
        case EVENT_GESTURE_DRAG_END: return GML_EVENT_GESTURE_DRAG_END;
        case EVENT_GESTURE_FLICK: return GML_EVENT_GESTURE_FLICK;

        case EVENT_GESTURE_GLOBAL_TAP: return GML_EVENT_GESTURE_GLOBAL_TAP;
        case EVENT_GESTURE_GLOBAL_DOUBLE_TAP: return GML_EVENT_GESTURE_GLOBAL_DOUBLE_TAP;
        case EVENT_GESTURE_GLOBAL_DRAG_START: return GML_EVENT_GESTURE_GLOBAL_DRAG_START;
        case EVENT_GESTURE_GLOBAL_DRAG_MOVE: return GML_EVENT_GESTURE_GLOBAL_DRAG_MOVE;
        case EVENT_GESTURE_GLOBAL_DRAG_END: return GML_EVENT_GESTURE_GLOBAL_DRAG_END;
        case EVENT_GESTURE_GLOBAL_FLICK: return GML_EVENT_GESTURE_GLOBAL_FLICK;

        case EVENT_ALARM_0: return 0;
        case EVENT_ALARM_1: return 1;
        case EVENT_ALARM_2: return 2;
        case EVENT_ALARM_3: return 3;
        case EVENT_ALARM_4: return 4;
        case EVENT_ALARM_5: return 5;
        case EVENT_ALARM_6: return 6;
        case EVENT_ALARM_7: return 7;
        case EVENT_ALARM_8: return 8;
        case EVENT_ALARM_9: return 9;
        case EVENT_ALARM_10: return 10;
        case EVENT_ALARM_11: return 11;

        default:
            return 0;      // who knows
    }
}


// #############################################################################################
/// Function:<summary>
///             Add an instance into the various lists.
///          </summary>
///
/// In:		 <param name="_pInstance"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyObject.prototype.AddInstance = function (_pInstance) {
	this.Instances.Add(_pInstance);
	var pObj = this;
	while (pObj != null)
	{
		pObj.Instances_Recursive.Add(_pInstance);
		pObj = pObj.pParent;
	}
};


// #############################################################################################
/// Function:<summary>
///             Remove an instance from the object and object_recursive list
///          </summary>
///
/// In:		 <param name="_pInstance">Instance to remove</param>
// #############################################################################################
yyObject.prototype.RemoveInstance = function (_pInstance) {
	this.Instances.DeleteItem(_pInstance);

	// Remove instance from "recursive" lists... 	
	var pObjType = this;
	while (pObjType != null)
	{
		pObjType.Instances_Recursive.DeleteItem(_pInstance);
		pObjType = pObjType.pParent;
	}
};



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_event"></param>
/// In:		 <param name="_index"></param>
// #############################################################################################
yyObject.prototype.PerformInstanceEvent = function (_event, _index, _is_async) {

	// If we don't do this event, then return...
	if (!this.Event[_event | _index]) return;

	// If this object DOES perform this event, then loop through all its instances and perform the event on each.
	var pool = this.Instances_Recursive.pool;
	for (var i = 0; i < pool.length; i++)
	{
		var pInst = pool[i];
		this.PerformEvent(_event, _index, pInst, pInst, _is_async);
	}
};

















// #############################################################################################
/// Function:<summary>
///             Creates an object manager
///          </summary>
// #############################################################################################
/**@constructor*/
function yyObjectManager() {
	this.objnamelist = [];
	this.objidlist = [];
	this.length = 0;
}    


// #############################################################################################
/// Function:<summary>
///          	Get the array of objects
///          </summary>
///
/// Out:	<returns>
///				The object array
///			</returns>
// #############################################################################################
yyObjectManager.prototype.GetPool = function () {
	return this.objidlist;
};

// #############################################################################################
/// Function:<summary>
///             Add an object to the managers lists
///          </summary>
///
/// In:		 <param name="pObj">Object to add</param>
// #############################################################################################
yyObjectManager.prototype.Add = function (_pObj) {
	this.length++;
	this.objnamelist[_pObj.Name] = _pObj;
	this.objidlist[_pObj.ID] = _pObj;
};



// #############################################################################################
/// Function:<summary>
///             Get the object using it's ID as a lookup
///          </summary>
///
/// In:		 <param name="pObj">Object to add</param>
// #############################################################################################
yyObjectManager.prototype.Get = function (_ID) {
	return this.objidlist[_ID];
};



// #############################################################################################
/// Function:<summary>
///				Returns whether the object index exists
///          </summary>
///
/// In:		 <param name="_index">Object ID to check for</param>
/// Out:	 <returns>
///				TRUE for yes, FALSE for no
///			 </returns>
// #############################################################################################
yyObjectManager.prototype.Exists = function (_id) {
	if(!this.objidlist[_id]) return false; else return true;
};


// #############################################################################################
/// Function:<summary>
///             Returns the name of the object
///          </summary>
///
/// In:		 <param name="_ID">The object ID/index</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yyObjectManager.prototype.Get_Object_Name = function (_ID) {
    var pObj = this.objidlist[_ID];
	if (!pObj)
	{
		return "<undefined>";
	} else
	{
		return pObj.Name;
	}
};


// #############################################################################################
/// Function:<summary>
///				Returns the index of object name. -1 if is does not exist
///				Usually only called during level/room initialisation
///          </summary>
///
/// In:		 <param name="name"></param>
/// Out:	 <returns>
///				Object index or -1 for not found
///			 </returns>
// #############################################################################################
yyObjectManager.prototype.Object_Find = function (_name) {
	var pObj = this.objnamelist[_name];
	if (pObj != null) return pObj.ID;
	return -1;
};



// #############################################################################################
/// Function: <summary>
///           	Throw a global event.
///           </summary>
// #############################################################################################
yyObjectManager.prototype.ThrowEvent = function(_event, _index, _is_async) {
	// for (var o in g_pObjectManager.objidlist)
	for (var o = 0; o < g_pObjectManager.objidlist.length; o++)
	{	    
		// get the object
		var pObj = g_pObjectManager.objidlist[o];
		// IF this object wants the event... then perform the event on ALL its instances.
		if (pObj.Event[_event | _index])
		{
			pObj.PerformInstanceEvent(_event, _index, _is_async);
		}
	}
};


// #############################################################################################
/// Function: <summary>
///           	
///           </summary>
// #############################################################################################
yyObjectManager.prototype.PatchParents = function () {

	// First, patch up 
	var pool = this.objidlist;	
	for (var index = 0; index < pool.length; index++)
	{
		var pObj = pool[index];
		pObj.pParent = g_pObjectManager.Get(pObj.ParentID);
		if (!pObj.pParent) pObj.pParent = null;


		// Copy all the event flags into the Recursive Event array
		for (var e = 0; e < pObj.Event.length; e++)
		{
			var evt = pObj.Event[e];
			if (evt)
			{
				pObj.REvent[e] = true; 	// if the parent has the event, then so do we!
			}
		}

	}


	// next, make a "recursive" event flag array.	
	for (var index = 0; index < pool.length; index++)
	{
		var pMasterObject = pool[index];
		var pObj = pMasterObject.pParent;

		while (pObj != null)
		{			
			for (var e = 0; e < pObj.Event.length; e++)
			{
				var evt = pObj.Event[e];
				if (evt)
				{
					pMasterObject.REvent[e] = true; 	// if the parent has the event, then so do we!
				}
			}
			pObj = pObj.pParent;
		}
	}
};










// #############################################################################################
/// Function:<summary>
///				Returns the object as an ARRAY using it's ID as a lookup.
///             (Used in GML to do a with() on an ID).
///          </summary>
///
/// In:		 <param name="_ID">ID of object</param>
/// Out:	 <returns>
///				An object in an array.
///			 </returns>
// #############################################################################################
function  GetWithArray( _ID )
{
    var candidates = [];

    if ((typeof _ID === "object") && !((_ID instanceof Array) || (_ID instanceof ArrayBuffer))) {
        candidates[0] =  _ID;
    } // end if
    else
    if( _ID === OBJECT_ALL ){
        candidates = g_RunRoom.GetPool();
    } // end if
    else 
    if ((typeof _ID === "undefined")) {
        // Do nothing
    }
    else {    
        _ID = yyGetInt32(_ID);
        var pObj = g_pObjectManager.Get(_ID);
        if (pObj != null) {
    		candidates = pObj.Instances_Recursive.pool;
        } // end if
        else {
            var pInst = g_pInstanceManager.Get(_ID);
            if (pInst != null) {
                candidates[0] = pInst;
            } // end if
        } // end else
    } // end else
    
    var ret = [];
    for( var n=0; n<candidates.length; ++n) {
        var o = candidates[n];
        if (o instanceof yyInstance) {
            if (!o.marked && o.active) {
                ret.push(o);                
            } // end if
        } // end if
        else {
            ret.push(o);
        } // end else

    } // end for
    return ret;
}



/*
// #############################################################################################
/// Function:<summary>
///             Sets the sprite of the object with the given index. 
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_spr">-1 to remove the current sprite from the object.</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_sprite(_ind,_spr)
{
    var pObj = g_pObjectManager.objidlist[_ind];
    if( !pObj ) return;

    var pSpr = g_pSpriteManager.Get(_spr);
    if( !pSpr ) return;
    
    pObj.SpriteIndex = _spr;        
}

// #############################################################################################
/// Function:<summary>
///             Sets whether instances created of the object must default be solid (true or false).
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_solid"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_solid(_ind,_solid) 
{
    var pObj = g_pObjectManager.objidlist[_ind];
    if( !pObj ) return;

    var b = false;
    if( _solid>0.5 )  b=true;
    pObj.Solid = b;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether instances created of the object must default be visible (true or false).
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_vis"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_visible(_ind,_vis) 
{
    var pObj = g_pObjectManager.objidlist[_ind];
    if( !pObj ) return;

    var b = false;
    if( _vis>0.5 )  b=true;
    pObj.Visible = b;
}

// #############################################################################################
/// Function:<summary>
///             Sets the default depth of instances created of the object.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_depth"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_depth(_ind,_depth) 
{
    var pObj = g_pObjectManager.objidlist[_ind];
    if( !pObj ) return;

    pObj.Depth = _depth;
}

// #############################################################################################
/// Function:<summary>
///             Sets whether instances created of the object must default be persistent (true or false).
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_pers"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_persistent(_ind,_pers)
{
    var pObj = g_pObjectManager.objidlist[_ind];
    if( !pObj ) return;

    var b = false;
    if( _pers>0.5 )  b=true;
    pObj.Persistent = b;
}

// #############################################################################################
/// Function:<summary>
///             Sets the sprite mask of the object with the given index.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_spr">-1 to set the mask to be the sprite of the object.</param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_mask(_ind,_spr) 
{
    MissingFunction("object_set_mask()");
}

// #############################################################################################
/// Function:<summary>
///             Sets the parent of the object. Use -1 to not have a parent. 
///             Changing the parent changes the behavior of instances of the object.
///          </summary>
///
/// In:		 <param name="_ind"></param>
///			 <param name="_obj"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function object_set_parent(_ind,_obj) 
{
    MissingFunction("object_set_parent()");
}
*/



