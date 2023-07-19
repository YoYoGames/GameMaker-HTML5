// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            runner.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

//
// here.
//
/*jshint evil:true*/
document.write('<script type="text/javascript" src="scripts/device/iOS.js"></script>');
document.write('<script type="text/javascript" src="scripts/device/Gamepad.js"></script>');
document.write('<script type="text/javascript" src="scripts/Vector3.js"></script>');
document.write('<script type="text/javascript" src="scripts/Matrix.js"></script>');
document.write('<script type="text/javascript" src="scripts/Plane.js"></script>');
document.write('<script type="text/javascript" src="scripts/Frustum.js"></script>');
document.write('<script type="text/javascript" src="scripts/Unsupported.js"></script>');
document.write('<script type="text/javascript" src="scripts/Globals.js"></script>');
document.write('<script type="text/javascript" src="scripts/GameGlobals.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyVariable.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyBuiltIn.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTypes.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyQueue.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyList.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyOList.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyAllocate.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyIOManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyNineSliceData.js"></script>');
document.write('<script type="text/javascript" src="scripts/yySprite.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyObject.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyInstance.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyBackground.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyFont.js"></script>');
document.write('<script type="text/javascript" src="scripts/yySound.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTile.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyPlayfield.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyPath.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyView.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyRoom.js"></script>');
document.write('<script type="text/javascript" src="scripts/yy3DModel.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyGraphics.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyIniFile.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyParticle.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTimeline.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyAnimCurve.js"></script>');
document.write('<script type="text/javascript" src="scripts/yySequence.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyEffects.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyASync.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTrigger.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyVertexManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyWeakRef.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyBufferVertex.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyBuffer.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyVideo.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTime.js"></script>');
document.write('<script type="text/javascript" src="scripts/LocalStorage.js"></script>');
document.write('<script type="text/javascript" src="scripts/Storage.js"></script>');
document.write('<script type="text/javascript" src="scripts/Events.js"></script>');
document.write('<script type="text/javascript" src="scripts/Effects.js"></script>');
document.write('<script type="text/javascript" src="scripts/CameraManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/Builders/yyPrimBuilder.js"></script>');
document.write('<script type="text/javascript" src="scripts/Builders/yyVBufferBuilder.js"></script>');
document.write('<script type="text/javascript" src="scripts/physics/yyPhysicsDebugRender.js"></script>');
document.write('<script type="text/javascript" src="scripts/physics/yyPhysicsFixture.js"></script>');
document.write('<script type="text/javascript" src="scripts/physics/yyPhysicsJoint.js"></script>');
document.write('<script type="text/javascript" src="scripts/physics/yyPhysicsObject.js"></script>');
document.write('<script type="text/javascript" src="scripts/physics/yyPhysicsWorld.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_grid.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_list.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_map.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_priority.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_queue.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/collections/ds_stack.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Maths.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Misc.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_YoYo.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_String.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Debug.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Date.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_IO.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_ini.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Graphics.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Texture.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Sound.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Sound_Legacy.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Sprite.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Object.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Background.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Path.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Instance.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Game.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Tiles.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Room.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Layers.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Particles.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Movement.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Surface.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_MotionPlanning.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Collision.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_File.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Font.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Timeline.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Action.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Window.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Physics.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Gamepad.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Shaders.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_D3D.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_IAP.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_HTTP.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Networking.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_AnimCurve.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Sequence.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Tags.js"></script>');
document.write('<script type="text/javascript" src="scripts/functions/Function_Time.js"></script>');
document.write('<script type="text/javascript" src="scripts/animation/yySkeletonInstance.js"></script>');
document.write('<script type="text/javascript" src="scripts/animation/yySkeletonSkin.js"></script>');
document.write('<script type="text/javascript" src="scripts/animation/yySkeletonSprite.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyRenderStateManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/libWebGL.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/libWebGLConsts.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyCommandBuilder.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yySamplerState.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyGLTexture.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyVBuffer.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyVBufferManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/yyVertexFormat.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/shaders/basicShader.js"></script>');
document.write('<script type="text/javascript" src="scripts/libWebGL/shaders/fullShader.js"></script>');
document.write('<script type="text/javascript" src="scripts/SWF/yySWFBitmap.js"></script>');
document.write('<script type="text/javascript" src="scripts/SWF/yySWFShape.js"></script>');
document.write('<script type="text/javascript" src="scripts/SWF/yySWFTimeline.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyWebGL.js"></script>');
document.write('<script type="text/javascript" src="scripts/yyTextureGroupInfo.js"></script>');
document.write('<script type="text/javascript" src="scripts/LoadGame.js"></script>');
document.write('<script type="text/javascript" src="scripts/_GameMaker.js"></script>');

document.write('<script type="text/javascript" src="scripts/fontjs/Font.js"></script>');
document.write('<script type="text/javascript" src="scripts/jsBox2D/jsliquidfun.js"></script>');
document.write('<script type="text/javascript" src="scripts/zlib/inflate.min.js"></script>');
document.write('<script type="text/javascript" src="scripts/zlib/deflate.min.js"></script>');
document.write('<script type="text/javascript" src="scripts/fingerprintjs/fingerprint.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/WorkletNodeManager.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/AudioBus.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/AudioEffect.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/AudioEmitter.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/AudioPlaybackProps.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/AudioPropsCalc.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Bitcrusher.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Compressor.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Delay.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/EQ.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Gain.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/HiShelf.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/HPF2.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/LoShelf.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/LPF2.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/PeakEQ.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Reverb1.js"></script>');
document.write('<script type="text/javascript" src="scripts/sound/effects/Tremolo.js"></script>');
//document.write('<script type="text/javascript" src="scripts/spine/spine.js"></script>');
document.write('<script type="text/javascript" src="scripts/spine/spine-core.js"></script>');


document.write('<script type="text/javascript" src="scripts/functions/Function_ClickableButton.js"></script>');

document.write('<script type="text/javascript" src="scripts/jsgif/LZWEncoder.js"></script>');
document.write('<script type="text/javascript" src="scripts/jsgif/NeuQuant.js"></script>');
document.write('<script type="text/javascript" src="scripts/jsgif/GIFEncoder.js"></script>');

document.write('<script type="text/javascript" src="scripts/long/long.js"></script>');
document.write('<script type="text/javascript" src="scripts/utils/TimeRampedParamLinear.js"></script>');

/*jshint evil:false*/
