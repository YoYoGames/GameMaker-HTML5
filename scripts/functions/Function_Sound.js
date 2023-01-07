// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Sound.js
// Created:         22/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     Game Maker SOUND functions...
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 22/02/2011		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

var audio_sounds = [];
var BASE_SOUND_INDEX = 300000;
var audio_sounds_index = BASE_SOUND_INDEX;
var audio_emitters = {};
var audio_emitters_index = 0;
var audio_sampledata = [];
var audio_global_paused = false;

var audio_max_playing_sounds = 128; //Default, can be changed

var BASE_BUFFER_SOUND_INDEX = 100000;
var buffer_sounds = [];
var buffer_sampledata = [];
var g_bufferSoundCount = 0;

var BASE_QUEUE_SOUND_INDEX = 200000;
var queue_sounds = [];
var queue_sampledata = [];
var g_queueSoundCount = 0;

var DYNAMIC_BUFFER_SIZE = 1024; // number of bytes to fill each time for dynamic buffers

var g_audioSoundCount=0;	//size of audio_sounds[] array
var g_handleMap = [];			//map of [handleid] -> audioSound object
var g_fadingSounds = [];    //array of currently fading sounds

var g_UseDummyAudioBus = false;

var DistanceModels = {
    AUDIO_FALLOFF_NONE:0,
	AUDIO_FALLOFF_INVERSE_DISTANCE:1,
	AUDIO_FALLOFF_INVERSE_DISTANCE_CLAMPED:2,
	AUDIO_FALLOFF_LINEAR_DISTANCE:3,
	AUDIO_FALLOFF_LINEAR_DISTANCE_CLAMPED:4,
	AUDIO_FALLOFF_EXPONENT_DISTANCE:5,
	AUDIO_FALLOFF_EXPONENT_DISTANCE_CLAMPED:6

};

var Channels = {
		AUDIO_CHANNELS_MONO:0,
		AUDIO_CHANNELS_STEREO:1,
		AUDIO_CHANNELS_3D:2
};

const AudioStreamType = {
    UNSTREAMED: 0,
    STREAMED: 1
};

var AudioSampleState =
{
	INIT: 'init',
	LOADING: 'loading',
	LOADED: 'loaded',
	DECODING: 'decoding',
	READY: 'ready'
};

var WebAudioContextState =
{
	SUSPENDED: 'suspended',
	RUNNING: 'running',
	CLOSED: 'closed'
};

var AudioCommand =
{
	PLAY: "Audio_Play"
};

var g_MP3VolumeNumSteps = 0;
var g_MP3UpdateVolume = 1.0;
var g_MP3VolumeStep = 0;

function audio_update()
{
    if (g_AudioModel != Audio_WebAudio)
        return;

    // Update and apply gains
    g_AudioGroups.forEach(_group => _group.gain.update());
    audio_sampledata.forEach(_asset => _asset.gain.update());
    audio_sounds.forEach(_voice => {
        if (_voice.bActive) {
            _voice.gain.update();
            _voice.pgainnode.gain.value = AudioPropsCalc.CalcGain(_voice);
        }
    });
}

var g_hidden;

function audio_reinit()
{
    if (g_AudioModel != Audio_WebAudio)
    {
        return;
    }

    g_AudioMainVolumeNode.disconnect();

    g_AudioMainVolumeNode = new GainNode(g_WebAudioContext);
    g_AudioMainVolumeNode.connect(g_WebAudioContext.destination);

    g_WebAudioContext.listener.pos = new Vector3(0,0,0);
    g_WebAudioContext.listener.velocity = new Vector3(0,0,0);
    g_WebAudioContext.listener.ori = new Array(0,0,0,0,0,0);
}


function Audio_Init()
{
    if (g_AudioModel !== Audio_WebAudio)
        return;

    g_WebAudioContext = new AudioContext();
    g_WebAudioContext.addEventListener("statechange", Audio_WebAudioContextOnStateChanged);

    g_HandleStreamedAudioAsUnstreamed = ( g_OSPlatform == BROWSER_IOS );
    g_UseDummyAudioBus = (g_OSBrowser === BROWSER_SAFARI_MOBILE);

    g_AudioMainVolumeNode = new GainNode(g_WebAudioContext);
    g_AudioMainVolumeNode.connect(g_WebAudioContext.destination);

    if (g_UseDummyAudioBus) {
        Audio_CreateMainBus();
    }
    else {
        g_WebAudioContext.audioWorklet.addModule(g_pGMFile.Options.GameDir + "/sound/worklets/audio-worklet.js")
        .then(() => {
            Audio_CreateMainBus();
        }).catch((_err) => {
            console.error("Failed to load audio worklets => " + _err);
        });
    }
    
    audio_falloff_set_model(DistanceModels.AUDIO_FALLOFF_NONE);

    //visibiliy event /property varies between browsers...ugh
    var visibilityChange; 
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      g_hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
      g_hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      g_hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      g_hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, handleVisibilityChange,false);

    g_WebAudioContext.listener.pos = new Vector3(0,0,0);
    g_WebAudioContext.listener.velocity = new Vector3(0,0,0);
    g_WebAudioContext.listener.ori = new Array(0,0,0,0,0,0);
    
    audio_listener_position(0,0,0);
    audio_listener_orientation(0,0,1.0,0,1.0,0.0);
    
    Audio_InitSampleData();
    AudioGroups_Init();

    Audio_WebAudioContextTryUnlock();
}

function Audio_Quit()
{
	if (g_WebAudioContext == null) return;
	if (g_WebAudioContext.closing == true) return;

	g_WebAudioContext.closing = true;
	g_WebAudioContext.removeEventListener("statechange", Audio_WebAudioContextOnStateChanged);
	g_WebAudioContext.close().then(() => {
		g_WebAudioContext = null;
	});
}

function Audio_CreateMainBus() {
    const busType = g_UseDummyAudioBus ? DummyAudioBus : AudioBus;

    g_AudioBusMain = new busType();
    g_AudioBusMain.connectOutput(g_AudioMainVolumeNode);
    g_pBuiltIn.audio_bus_main = g_AudioBusMain;
}

/** @constructor */
function audioSampleData()
{
    this.buffer = null;
    this.gain = new TimeRampedParamLinear(1);
    this.configGain = 1.0;  //the original volume setting in GMS
    this.pitch = 1.0;
    this.duration = 0.0;
    this.trackPos = 0.0;    //sample track offset(seconds)
    this.loopStart = 0.0;
    this.loopEnd = 0.0;
    this.groupId = 0;
    this.kind = AudioStreamType.UNSTREAMED;
    this.state = AudioSampleState.INIT;
    this.commands = [];
}

audioSampleData.prototype.ProcessCommands = function ()
{
	// Process commands
	for ( var i = 0; i < this.commands.length; ++i )
	{
        var currentCommand = this.commands[i];

		switch (currentCommand[0])
		{
			case AudioCommand.PLAY:
				Audio_Play(currentCommand[1]);
				break;
		}
	}

	// Remove all processed comands
	this.commands.length = 0;
};

audioSampleData.prototype.TryDecode = function ( _rawData, _processCommands )
{
	if ( this.state != AudioSampleState.LOADED || !_rawData)
		return false;

	var sampleData = this;
	sampleData.state = AudioSampleState.DECODING;

	g_WebAudioContext.decodeAudioData( _rawData.response,
		function ( buffer )
		{
			sampleData.buffer = buffer;
			sampleData.state = AudioSampleState.READY;

			if ( _processCommands )
				sampleData.ProcessCommands();
		},
		function ( err )
		{
			sampleData.state = AudioSampleState.LOADED;
			debug( "ERROR: Failed to decode audio data: " + err );
		}
	);

	return true;
};

/** @constructor */
function audioSound(_props)
{
    this.pgainnode = g_WebAudioContext.createGain();
    this.pemitter = null;
    this.handle=0;

	this.Init(_props);
}

audioSound.prototype.Init = function(_props)
{
    this.bActive = false;
    this.playbackCheckpoint = {
        contextTime: 0.0,
        bufferTime: 0.0
    };
    this.pbuffersource = null;
    this.pgainnode.disconnect();
    this.gain = new TimeRampedParamLinear(_props.gain);
    this.startoffset = _props.offset;
    this.pitch = _props.pitch;
	this.pemitter = _props.emitter;
    this.paused = false;
    this.soundid = _props.asset_index;
    this.loop = _props.loop;
    this.systempaused = false;
    this.priority = _props.priority;
	this.bStreamed = false;
	this.bBuffered = false;
	this.bQueued = false;
	this.audio_tag = null; //html5 audio tag for streamed audio
	this.streamSource = null; //web audio source for streamed audio
    this.pgainnode.gain.value = AudioPropsCalc.CalcGain(this); 
	
	if( this.soundid >=0 )
	{
	    this.bStreamed = IsSoundStreamed( this.soundid );
	    this.bBuffered = IsSoundBuffered( this.soundid );
	    this.bQueued = IsSoundQueued( this.soundid );
	    //apply sample gain setting

	    if (!this.bBuffered && !this.bQueued )
	    {
		      if( this.handle >= BASE_SOUND_INDEX ) {
							//re-using existing object - invalidate the handleMap for this soundid, as we are replacing with a new one
							//otherwise, functions with previous handle argument, will affect this new sound (with different handle)
							g_handleMap[ this.handle -  BASE_SOUND_INDEX ] = null;
		      }

		      //increment handle each time we use
		      this.handle = audio_sounds_index;
		      g_handleMap[ audio_sounds_index -  BASE_SOUND_INDEX ] = this;
		      ++audio_sounds_index;
	    }
    }
};

audioSound.prototype.stop = function() {
    if (this.bActive === false)
        return;

    if (this.soundid >= BASE_QUEUE_SOUND_INDEX 
    && this.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount)) {
        var queueSoundId = this.soundid - BASE_QUEUE_SOUND_INDEX;
        queue_sounds[queueSoundId].scriptNode.onended = null;
        queue_sounds[queueSoundId].scriptNode.disconnect();
    }
    else if (this.pbuffersource !== null) {
        this.pbuffersource.onended = null;
        this.pbuffersource.loop = false;
        this.pbuffersource.stop(0);
        this.pbuffersource.disconnect();
    }

    if (this.pgainnode !== null)
        this.pgainnode.disconnect();

    this.pemitter = null;
    this.soundid = -1;
    this.bActive = false;
};

audioSound.prototype.pause = function() {
    if (this.bActive === false || this.paused === true)
        return;

    //remove ended handler which sets bActive to false - 
    //need to keep sound "active" while paused, so it is not replaced by new sound
    if (this.soundid >= BASE_QUEUE_SOUND_INDEX 
    && this.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount)) {
        const queueSoundId = this.soundid - BASE_QUEUE_SOUND_INDEX;
        queue_sounds[queueSoundId].scriptNode.onended = null;
        queue_sounds[queueSoundId].scriptNode.disconnect(0);
    }
    else {
        this.pbuffersource.onended = null;
        this.pbuffersource.stop(0);
        this.setPlaybackCheckpoint();
    }

    this.paused = true;
};

audioSound.prototype.resume = function() {
    if (this.bActive === false || this.paused === false)
        return;

    if (this.soundid >= BASE_QUEUE_SOUND_INDEX 
    && this.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount)) {
        const queueSoundId = this.soundid - BASE_QUEUE_SOUND_INDEX;
        queue_sounds[queueSoundId].scriptNode.connect(this.pgainnode);
        queue_sounds[queueSoundId].scriptNode.onended = (_event) => {
            this.bActive = false;
        };
    }
    else {
        const pitch = AudioPropsCalc.CalcPitch(this);
        this.pbuffersource = g_WebAudioContext.createBufferSource();
        this.pbuffersource.playbackRate.value = pitch;
        this.playbackCheckpoint.contextTime = g_WebAudioContext.currentTime;

        this.pgainnode = g_WebAudioContext.createGain();

        const sampleData = Audio_GetSound(this.soundid);

        this.pgainnode.gain.value = AudioPropsCalc.CalcGain(this);

        this.pbuffersource.connect(this.pgainnode);

        this.pbuffersource.onended = (_event) => {
            this.bActive = false;
        };

        if (this.pemitter !== null) 
            this.pgainnode.connect(this.pemitter);
        else
            g_AudioBusMain.connectInput(this.pgainnode);

        this.pbuffersource.buffer = sampleData.buffer;

        //oddly enough, this seems to work for looped sounds also...suspicious (see original above )
        if (this.loop === true)
            this.pbuffersource.loop = true;
 
        const numloopsplayed = Math.floor(this.playbackCheckpoint.bufferTime / this.pbuffersource.buffer.duration);
        const playpoint = this.playbackCheckpoint.bufferTime - numloopsplayed * this.pbuffersource.buffer.duration;
        this.pbuffersource.start(0, playpoint);
    }

    this.paused = false;
};

audioSound.prototype.isPlaying = function() {
    if (this.bActive === false)
        return false;

    if (this.bQueued) {
        var queued_sound = queue_sounds[this.soundid - BASE_QUEUE_SOUND_INDEX];

        if (!queued_sound || !queued_sound.scriptNode || !queued_sound.scriptNode.onended) 
            return false;

        return true;
    }
    else {
        if (this.pbuffersource === null)
            return false;

        //NB- "playbackState" is only defined for webkitAudioContext - undefined for AudioContext
        // ... we should get rid of it then
        if (this.pbuffersource.playbackState == undefined 
        || this.pbuffersource.playbackState != this.pbuffersource.FINISHED_STATE
        || _audioSound.paused) {
            return true;
        }
    }
    
    return false;
};

audioSound.prototype.setLoopStart = function(_offsetSecs) {
    if (this.bActive === false || this.pbuffersource === null || g_WebAudioContext === null)
        return;

    const samplePeriod = 1.0 / g_WebAudioContext.sampleRate;

    const trueLoopEnd = this.getTrueLoopEnd();
    const maxLoopStart = trueLoopEnd - samplePeriod;

    _offsetSecs = Math.max(0.0, _offsetSecs);
    _offsetSecs = Math.min(_offsetSecs, maxLoopStart);

    this.setPlaybackCheckpoint();
    
    this.pbuffersource.loopStart = _offsetSecs;

    this.setPlaybackCheckpoint();
};

audioSound.prototype.setLoopEnd = function(_offsetSecs) {
    if (this.bActive === false || this.pbuffersource === null || g_WebAudioContext === null)
        return;

    const samplePeriod = 1.0 / g_WebAudioContext.sampleRate;
    const duration = this.pbuffersource.buffer.duration;
    const loopStart = this.pbuffersource.loopStart;

    const minLoopEnd = (_offsetSecs <= 0.0) ? 0.0 : (loopStart + samplePeriod);

    _offsetSecs = Math.max(minLoopEnd, _offsetSecs);
    _offsetSecs = Math.min(_offsetSecs, duration);      
    
    this.setPlaybackCheckpoint();
    const playbackPosition = this.playbackCheckpoint.bufferTime;

    /* 
        Once the loop section has been reached a single time, Web Audio
        considers the buffer source to be 'looping' and will constrain the playback
        position to the loop section. So, in case our new loop-end here leaves the current
        playback position outside of the new loop section, we need to preemptively disable looping
        in order to prevent the 'correction' of the playback position during the next render quantum.
        The voice-level attribute (i.e. this.loop) will still reflect the user's chosen loop status.
    */
    this.pbuffersource.loop = (playbackPosition < _offsetSecs);
    this.pbuffersource.loopEnd = _offsetSecs;
    
    this.setPlaybackCheckpoint();
};

audioSound.prototype.getLoopStart = function() {
    if (this.bActive === false || this.pbuffersource === null)
        return 0.0;

    return this.pbuffersource.loopStart;
};

audioSound.prototype.getLoopEnd = function() {
    if (this.bActive === false || this.pbuffersource === null)
        return 0.0;

    return this.pbuffersource.loopEnd;
};

audioSound.prototype.getTrueLoopEnd = function() {
    if (this.bActive === false || this.pbuffersource === null)
        return 0.0;

    const loopEnd = this.pbuffersource.loopEnd;

    if (loopEnd <= 0.0)
        return this.pbuffersource.buffer.duration;

    return loopEnd;
};

audioSound.prototype.getLoopLength = function() {
    if (this.bActive === false || this.pbuffersource === null)
        return 0.0;

    const loopStart = this.pbuffersource.loopStart;
    const trueLoopEnd = this.getTrueLoopEnd();

    return (trueLoopEnd - loopStart);
};

audioSound.prototype.setPlaybackCheckpoint = function() {
    if (g_WebAudioContext === null)
        return;

    const contextTime = g_WebAudioContext.currentTime;

    this.playbackCheckpoint = {
        contextTime: contextTime,
        bufferTime: this.getPlaybackPosition(contextTime)
    };
};

audioSound.prototype.getPlaybackPosition = function(_contextTime) {
    if (this.bActive === false || this.pbuffersource === null || g_WebAudioContext === null)
        return 0.0;

    const checkpoint = this.playbackCheckpoint;

    if (this.paused === true)
        return checkpoint.bufferTime;

    const pitch = this.pbuffersource.playbackRate.value;

    if (_contextTime === undefined)
        _contextTime = g_WebAudioContext.currentTime;

    const timePassed = (_contextTime - checkpoint.contextTime) * pitch;

    const trueLoopEnd = this.getTrueLoopEnd();
    const wasBeyondLoopEnd = (checkpoint.bufferTime > trueLoopEnd);

    const isLooping = this.pbuffersource.loop;

    let playbackPosition = checkpoint.bufferTime;

    if (isLooping === false || wasBeyondLoopEnd === true) {
        playbackPosition += timePassed;
    }
    else {
        const loopStart = this.getLoopStart();
        const timeToLoopStart = loopStart - checkpoint.bufferTime;
        
        if (timePassed < timeToLoopStart) {
            playbackPosition += timePassed;
        }
        else {
            const loopLength = this.getLoopLength();
            playbackPosition = loopStart + (timePassed - timeToLoopStart) % loopLength;
        }
    }

    return playbackPosition;
}

function GetAudioSoundFromHandle( _handle )
{
	//user might pass in any old rubbish so check here-
	if( _handle <  BASE_SOUND_INDEX || _handle >=audio_sounds_index)
	{
		debug( "Error: invalid sound handle " + _handle );
		return null;
	}
	var sound = g_handleMap[ _handle - BASE_SOUND_INDEX];
	
	//DEBUG - should always point to an audioSound object
	//BUT-when we reuse audioSound objects, we must invalidate the handleMap for the previous handle
	//-so we must handle a null return
	if( sound == undefined )//|| sound == null )
	{
		//debug( "Error: invalid sound handle " + _handle );
		return null;
	}
	return sound;
}


function IsSoundStreamed( soundid )
{
	if ( g_HandleStreamedAudioAsUnstreamed )
		return false;

    if (soundid >= 0 && soundid < audio_sampledata.length)
    {
       if (audio_sampledata[soundid].kind == AudioStreamType.STREAMED)
       {
            return true;
       }
    }
    else if (soundid < BASE_BUFFER_SOUND_INDEX)
    {
        debug("IsSoundStreamed - Error: soundid " + soundid + " not found");
    }
    return false;
}

function IsSoundBuffered( soundid )
{
    if( soundid >=BASE_BUFFER_SOUND_INDEX && soundid < BASE_QUEUE_SOUND_INDEX)
    {
        return true;
    }
    return false;
}

function IsSoundQueued( soundid )
{
    if( soundid >=BASE_QUEUE_SOUND_INDEX && soundid < BASE_SOUND_INDEX)
    {
        return true;
    }
    return false;
}

function getUrlForSound( _soundid )
{
    var sound = g_pGMFile.Sounds[_soundid];
    if (sound == null) {
        //check for sound from audio_create_stream
        url = "";
        sound = audio_sampledata[_soundid];
        if (sound != null && sound.fromFile !== undefined) {
            url = CheckWorkingDirectory(sound.fromFile);
        }
        return url;
    }

	var url = g_RootDir + sound.origName;
	var ext = sound.extension;

	url = CheckWorkingDirectory(url);
	    
    var index = url.indexOf(ext);
    if( index>0 ){
        url = url.substr(0,index);
    } 

	// See what format the browser can play, and use that. Prefer ogg....
    if (g_canPlayOgg)
    {
    	ext = "ogg";
    } else if (g_canPlayMp3)
    {
    	ext = "mp3";
    } else {
		// Else... we'll "try" and use ogg anyway.
    	ext = "ogg";
    }
    url = url+"."+ext;
	return url;
}

// Web audio context -------------
var g_WaitingForWebAudioTouchUnlock = false;
var g_HandleStreamedAudioAsUnstreamed = false;

function Audio_WebAudioPlaybackAllowed()
{
    return g_WebAudioContext && (g_WebAudioContext.state === WebAudioContextState.RUNNING);
}

function Audio_WebAudioContextTryUnlock()
{
	if ( g_WaitingForWebAudioTouchUnlock )
        return;

	g_WaitingForWebAudioTouchUnlock = true;

	// We'll have to resume the audio context when the user interacts - determine the event types based on what's available
	var eventTypeStart = "mousedown";
	var eventTypeEnd = "mouseup";
	if ( "ontouchstart" in window )
	{
		eventTypeStart = "touchstart";
		eventTypeEnd = "touchend";
	}
    if ((window.PointerEvent) || (window.navigator.pointerEnabled)||(window.navigator.msPointerEnabled)) {
		eventTypeStart = "pointerdown";
		eventTypeEnd = "pointerup";
    } // end if


	// Set up context unlock events
	var unlockWebAudioContext = function ()
	{
		g_WebAudioContext.resume().then( function ()
		{
			document.body.removeEventListener( eventTypeStart, unlockWebAudioContext );
			document.body.removeEventListener( eventTypeEnd, unlockWebAudioContext );
			g_WaitingForWebAudioTouchUnlock = false;

			debug( "WebAudio Context unlocked." );
		},
		function ( reason )
		{
			debug( "ERROR: Failed to unlock WebAudio Context. Reason: " + reason );
		} );
	};

    document.body.addEventListener( eventTypeStart, unlockWebAudioContext, false );
    document.body.addEventListener( eventTypeEnd, unlockWebAudioContext, false );
}

function Audio_WebAudioContextOnStateChanged()
{
	debug( "WebAudio Context state updated to: " + g_WebAudioContext.state );

	Audio_WebAudioContextReportStatus();
}

function Audio_WebAudioContextReportStatus()
{
	var isCtxAvailable = Audio_WebAudioPlaybackAllowed( );
	var map = ds_map_create();
	g_pBuiltIn.async_load = map;

	ds_map_add( map, "event_type", "audio_system_status" );
	ds_map_add( map, "status", isCtxAvailable ? "available" : "unavailable" );
	g_pObjectManager.ThrowEvent( EVENT_OTHER_SYSTEM_EVENT, 0 );

	ds_map_destroy( map );
	g_pBuiltIn.async_load = -1;
}

function audio_system_is_available()
{
	if ( !g_WebAudioContext )
		return false;

	return Audio_WebAudioPlaybackAllowed( );
}

function audio_sound_is_playable(_soundId)
{
    _soundId = yyGetInt32(_soundId);

	var sampleData = Audio_GetSound( _soundId );
	if ( sampleData == null )
		return false;

	if ( !audio_system_is_available() )
		return false;

	var currentSound = g_pSoundManager.Get( _soundId );
	if ( sampleData.state == AudioSampleState.LOADED && currentSound )
	{
		// Decode audio if it's been preloaded
		var rawData = g_RawSounds[ currentSound.pName ];
		if ( rawData )
			sampleData.TryDecode( rawData, true );
	}

	return (sampleData.state == AudioSampleState.READY);
}

function Audio_Play(_voice)
{
    const sound_asset = Audio_GetSound(_voice.soundid);
    const playbackStreamed = _voice.bStreamed && !g_HandleStreamedAudioAsUnstreamed;

    if (sound_asset.state != AudioSampleState.READY )
	{
		// Decode audio if it's been preloaded
        var currentSound = g_pSoundManager.Get(_voice.soundid);

        if (sound_asset.state == AudioSampleState.LOADED && !playbackStreamed && currentSound )
		{
            var rawData = g_RawSounds[currentSound.pName];

            if (rawData)
            {
                sound_asset.TryDecode(rawData, true);
            }
		}

        sound_asset.commands.push([AudioCommand.PLAY, _voice]);

        return false;
    }

    // This should probably be closer to the 'real' start
    _voice.setPlaybackCheckpoint();

    if (playbackStreamed)
    {
        Audio_PlayStreamed(_voice);
    }
    else
    {
        Audio_PlayUnstreamed(_voice);
    }

    _voice.bActive = true;

	return true;
}

//play streamed audio
//_audioSound : audioSound object
//_soundid : sample index

function Audio_PlayStreamed(_voice, _onStart)
{
    var srcUrl = getUrlForSound(_voice.soundid);

	try
	{
		//recreate audio tag - problems with reusing
		//-can only connect to volume node by calling createMediaElementSource ( which throws exception if done again for same audio tag )
		if (_voice.audio_tag != null)
		{
            document.body.removeChild(_voice.audio_tag);
		}

        _voice.audio_tag = new Audio();
        var audio_tag = _voice.audio_tag;
		audio_tag.controls = false;
		audio_tag.autoplay = true;
		audio_tag.preload = "none";
        audio_tag.loop = _voice.loop;
		audio_tag.src = set_load_location(null, null, srcUrl);
		audio_tag.defaultPlaybackRate = AudioPropsCalc.CalcPitch(_voice);
        const offset = AudioPropsCalc.CalcOffset(_voice);
		audio_tag.currentTime = offset;
		audio_tag.preservesPitch = false;
		document.body.appendChild(audio_tag);

		// Set the start offset once we have the audio metadata
		if (offset > 0.0)
		{
			audio_tag.addEventListener('loadedmetadata', function() {
                _voice.audio_tag.currentTime = offset;
			});
		}

		audio_tag.load(); //required if src has changed?; might even fix currentTime setting bug...kind of
       
        try 
        {
            var playPromise = audio_tag.play();

            if (playPromise !== undefined) 
            {
				playPromise.then(() => {
					// Automatic playback started
                    if (_onStart)
                    {
                        _onStart();
                    }
				}).catch((error) => {
					// Automatic playback failed
					console.log("Audio playback failed: ", error);
                    Audio_Stop(_voice);
				});
			}
        }
        catch (ex) 
        {
			debug("audio_tag.play() exception: " + ex);
		}
		
		// When audio ends, set it to inactive, allowing it to be reallocated (if not already recycled).
		audio_tag.addEventListener("ended", function (e) {
            if (_voice.audio_tag == this) 
            {
                Audio_Stop(_voice);
            }
            else 
            {
				// Remove the audio tag (recycled voice will have a new audio tag)
				document.body.removeChild(this);
			}
		});
        
        _voice.streamSource = g_WebAudioContext.createMediaElementSource(audio_tag);   
        _voice.streamSource.connect(_voice.pgainnode); 
	}
    catch (ex) 
    {
    	debug("Audio_PlayStreamed exception: " + ex);
    	return false;
	}
}

function Audio_PlayUnstreamed(_voice)
{
	try
	{
		var sourceNode = null;
		var queued = false;
	
        if (_voice.soundid >= BASE_QUEUE_SOUND_INDEX
            && _voice.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount))
		{
			queued = true;
            var queue_id = _voice.soundid - BASE_QUEUE_SOUND_INDEX;
			queue_sounds[queue_id].scriptNode.connect(_voice.pgainnode);
            queue_sounds[queue_id].gainnode = _voice.pgainnode;
			sourceNode = queue_sounds[queue_id].scriptNode;
		}
		else
        {
            _voice.pbuffersource = g_WebAudioContext.createBufferSource();
            _voice.pbuffersource.playbackRate.value = AudioPropsCalc.CalcPitch(_voice);
            _voice.pbuffersource.loop = _voice.loop;
            const sound_asset = Audio_GetSound(_voice.soundid);
            _voice.pbuffersource.buffer = sound_asset.buffer;
            _voice.pbuffersource.connect(_voice.pgainnode);
            sourceNode = _voice.pbuffersource;
		}

        _voice.playbackCheckpoint.contextTime = g_WebAudioContext.currentTime;
		
        sourceNode.onended = (event) => 
        {
            _voice.bActive = false;

            if (_voice.pbuffersource.loop === true)
            {
                Audio_PlayUnstreamed(_voice);
            }
		};
		
		if (!queued)
		{
            const offset = AudioPropsCalc.CalcOffset(_voice);
            sourceNode.start(0, offset);
            _voice.playbackCheckpoint.bufferTime = offset;
		}
	}
	catch (ex)
	{
		debug("Audio_PlayUnstreamed exception: " + ex);
    }
}

//stop -----------------------------
function Audio_Stop( _audioSound )
{
	if( _audioSound.bActive )
	{
		if( _audioSound.bStreamed )
			Audio_StopStreamed( _audioSound );
		else
			Audio_StopUnstreamed( _audioSound );
		
		_audioSound.soundid = -1;
		_audioSound.bActive = false;
	}
}

function Audio_StopStreamed( _audioSound )
{
	if( _audioSound.audio_tag != null )
	{
		try{
			_audioSound.audio_tag.pause();
            _audioSound.streamSource.disconnect(); 
            _audioSound.streamSource = null;
			
			//gain nodes/emitters for streamed sounds?
			if( _audioSound.pgainnode!=null)
				_audioSound.pgainnode.disconnect();
			audioSound.pemitter = null;

			document.body.removeChild(_audioSound.audio_tag);
			_audioSound.audio_tag = null;
			
		}catch(Ex) 	{
			debug("Audio_StopStreamed exception: " + Ex );
		}
	}
}

function Audio_StopUnstreamed( _audioSound )
{
	try{
      if( _audioSound.soundid >= BASE_QUEUE_SOUND_INDEX && _audioSound.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount))
      {
          var queueSoundId = _audioSound.soundid - BASE_QUEUE_SOUND_INDEX;
          queue_sounds[queueSoundId].scriptNode.onended = null;
          queue_sounds[queueSoundId].scriptNode.disconnect();
      }
      else if( _audioSound.pbuffersource != null )
      {
          _audioSound.pbuffersource.onended = null; //Fix #0014959-onended firing for next sound immediately when audioSound reused
          _audioSound.pbuffersource.loop = false;
          _audioSound.pbuffersource.stop(0);
          _audioSound.pbuffersource.disconnect();
      }

      if( _audioSound.pgainnode!=null)
          _audioSound.pgainnode.disconnect();
      _audioSound.pemitter = null;
	}catch(Ex) 	{
		debug("Audio_StopUnstreamed exception: " + Ex );
	}
}

//pause --------------------------
function Audio_Pause( _audioSound )
{
    if( _audioSound.bActive && !_audioSound.paused )
	{
	    if (_audioSound.bQueued) {
	        Audio_PauseUnstreamed(_audioSound);
	    }
		else if( _audioSound.bStreamed )
			Audio_PauseStreamed( _audioSound );
		else
			Audio_PauseUnstreamed( _audioSound );
		_audioSound.paused = true;
	}
}

function Audio_PauseStreamed( _audioSound )
{
	try{
		_audioSound.audio_tag.pause();
	}catch(Ex) 	{
		debug("Audio_PauseStreamed exception: " + Ex );
	}
}

function Audio_PauseUnstreamed( _audioSound )
{
	try{
		//remove ended handler which sets bActive to false - need to keep sound "active" while paused, so it is not replaced by new sound
    if( _audioSound.soundid >= BASE_QUEUE_SOUND_INDEX && _audioSound.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount))
    {
        var queueSoundId = _audioSound.soundid - BASE_QUEUE_SOUND_INDEX;
        queue_sounds[queueSoundId].scriptNode.disconnect(0);
        queue_sounds[queueSoundId].scriptNode.onended = null;
    }
    else
    {
        _audioSound.pbuffersource.onended = null;
        _audioSound.pbuffersource.stop(0);
        _audioSound.setPlaybackCheckpoint();
    }
	}catch(Ex) 	{
		debug("Audio_PauseUnstreamed exception: " + Ex );
	}
}

//resume--------------
function Audio_Resume( _audioSound )
{
    if (_audioSound.bActive && _audioSound.paused)
	{
	    if (_audioSound.bQueued) {
	        Audio_ResumeUnstreamed(_audioSound);
	    }else if( _audioSound.bStreamed )
			Audio_ResumeStreamed( _audioSound );
		else
			Audio_ResumeUnstreamed( _audioSound );
	
		_audioSound.paused = false;
	}
}

function Audio_ResumeStreamed( _audioSound )
{
	if( _audioSound.paused )
	{
		try{
			_audioSound.audio_tag.play();
		}catch(Ex) 	{
			debug("Audio_ResumeStreamed exception: " + Ex );
		}	
	}
}

function Audio_ResumeUnstreamed( _audioSound )
{
	try{
    if( _audioSound.soundid >= BASE_QUEUE_SOUND_INDEX && _audioSound.soundid < (BASE_QUEUE_SOUND_INDEX + g_queueSoundCount))
    {
        var queueSoundId = _audioSound.soundid - BASE_QUEUE_SOUND_INDEX;
        queue_sounds[queueSoundId].scriptNode.connect(_audioSound.pgainnode);
        queue_sounds[queueSoundId].scriptNode.onended = function( event )
        {
            _audioSound.bActive = false;
        };
    }
    else
    {
        var pitch = AudioPropsCalc.CalcPitch(_audioSound);
        _audioSound.pbuffersource = g_WebAudioContext.createBufferSource();
        _audioSound.pbuffersource.playbackRate.value = pitch;
        _audioSound.playbackCheckpoint.contextTime = g_WebAudioContext.currentTime;

        _audioSound.pgainnode = g_WebAudioContext.createGain();

        var sampleData = Audio_GetSound(_audioSound.soundid);

        _audioSound.pgainnode.gain.value = AudioPropsCalc.CalcGain(_audioSound);

        _audioSound.pbuffersource.connect(_audioSound.pgainnode);

        _audioSound.pbuffersource.onended = function( event )
        {
            _audioSound.bActive = false;
        };


        if(_audioSound.pemitter!=null) {
            _audioSound.pgainnode.connect(_audioSound.pemitter);
        } 
        else
        {
            g_AudioBusMain.connectInput(_audioSound.pgainnode); //No emitter to connect to so it goes straight to main bus
            //instead connect to sample gain node
            //_audioSound.pgainnode.connect( audio_sampledata[_audioSound.soundid].pgainnode );
        }

        _audioSound.pbuffersource.buffer = sampleData.buffer;

        //if(_audioSound.loop>0)
        //{
        //   _audioSound.pbuffersource.loop = true;
        //   
        //   //Interface doesn't currently allow you to pause a looping sample and resume from where you paused at *sigh*
        //   _audioSound.pbuffersource.noteGrainOn(0,0,_audioSound.pbuffersource.buffer.duration);
        //}
        //else

        //oddly enough, this seems to work for looped sounds also...suspicious (see original above )
        if(_audioSound.loop>0)
            _audioSound.pbuffersource.loop = true;

        {
            var numloopsplayed = Math.floor(_audioSound.playbackCheckpoint.bufferTime/_audioSound.pbuffersource.buffer.duration);
            var playpoint = _audioSound.playbackCheckpoint.bufferTime - numloopsplayed * _audioSound.pbuffersource.buffer.duration;
            //_audioSound.pbuffersource.noteGrainOn(0,playpoint,_audioSound.pbuffersource.buffer.duration-playpoint); //This would just play what was left in the buffer
            _audioSound.pbuffersource.start(0,playpoint);
        }
    }
	}catch(Ex) 	{
		debug("Audio_ResumeUnstreamed exception: " + Ex );
	}
}

function Audio_IsSoundPaused(_voice)
{
    if (_voice.bActive) 
    {
        return _voice.paused;
    }

    return false;
}

function Audio_IsSoundPlaying( _audioSound )
{
	var bPlaying = false;
	if( _audioSound.bActive )	//+paused?
	{
	    if (_audioSound.bQueued) {
	        var queued_sound = queue_sounds[_audioSound.soundid - BASE_QUEUE_SOUND_INDEX];
	        if (!queued_sound) return false;
	        if (!queued_sound.scriptNode) return false;
	        if (!queued_sound.scriptNode.onended) return false; else return true;
	    }
		else if( _audioSound.bStreamed )
			bPlaying = Audio_IsPlayingStreamed( _audioSound );
		else
			bPlaying = Audio_IsPlayingUnstreamed( _audioSound );
	}
    //debug("Audio_IsSoundPlaying " + _audioSound.soundid + "= " + bPlaying );
    return bPlaying;
}

function Audio_IsPlayingUnstreamed( _audioSound )
{
	 if (_audioSound.pbuffersource != null) 
	 {
		//console.log( "playbackState=" + _audioSound.pbuffersource.playbackState );
		//!initially playbackState will be SCHEDULED_STATE
		//if (_audioSound.pbuffersource.playbackState == _audioSound.pbuffersource.PLAYING_STATE)
		
		//NB- "playbackState" is only defined for webkitAudioContext - undefined for AudioContext
		if ( (_audioSound.pbuffersource.playbackState == undefined ||_audioSound.pbuffersource.playbackState != _audioSound.pbuffersource.FINISHED_STATE) || _audioSound.paused)
		{
			return true;
		}
     }
	 return false;
}

function Audio_IsPlayingStreamed( _audioSound )
{
	if( _audioSound.audio_tag != null )
	{
		if( !_audioSound.audio_tag.ended )
		{
			return true;
		}
	}
	return false;
}


function getFreeVoice(_props)
{
	if(g_AudioModel!= Audio_WebAudio)
       return null;
	   
	//TODO::check that we have a free stream first..?
	//why don't we just hold a stream tag for each audioSound, since we new it anyway...
	
	var i;
	var sound;
	//check for inactive sound we can re-use
	for( i=0; i < g_audioSoundCount; ++i )
	{
		sound = audio_sounds[i];
		if( !sound.bActive )
		{
			//inactive- reuse; reset to defaults - set handle! - !must allocate new AudioBufferSourceNode to play again! OK we do this in play fns
			sound.Init(_props);
			return sound;
		}
		else 
		{
		    if (sound.bQueued && sound.soundid == _props.asset_index)
		        return null; //queue sound already allocated
		    //check if sound has stopped
			var bStopped = false;
			if( sound.bStreamed )
			{
			    bStopped = sound.audio_tag == null || sound.audio_tag.ended;
			} 
			else
			{
			    bStopped = ((sound.pbuffersource != null && sound.pbuffersource.playbackState != undefined && sound.pbuffersource.playbackState == sound.pbuffersource.FINISHED_STATE) && !sound.paused);  //!don't re-use paused sounds or we can't resume them!
			}
			if( bStopped )
			{
				//sound has finished playing, re-use
				sound.Init(_props);
				return sound; 
			}
		}
	}
	
	//no free sounds, create a new one
	if( g_audioSoundCount < audio_max_playing_sounds )
	{
		var newSound = new audioSound(_props);
		audio_sounds[g_audioSoundCount] = newSound;
		++g_audioSoundCount;

		return newSound;
	}

	//max sounds playing; kill & re-use lowest lower priority sound
	var minpriority = _props.priority;
	var killIndex = -1;
	for( i =0; i < g_audioSoundCount; ++i )
	{
		sound = audio_sounds[i];
		if( sound.priority < minpriority )
		{
			killIndex = i;
			minpriority = sound.priority;
		}
	}
	if( killIndex >=0 )
	{
		debug("killing sound on channel " + killIndex );
		var killSound = audio_sounds[ killIndex ];
		Audio_Stop( killSound );
		killSound.Init(_props);	//allocate a new handle
		return killSound;	//re-use it
	}
	
	debug("reached max sounds and no lower priority");
	return null;
}

function Audio_GetSound(soundid)
{
	var pSound = null;
	if(soundid>=0 && soundid<=audio_sampledata.length )
	{
		pSound = audio_sampledata[soundid];
	}
	else
	{
		var bufferSoundId = soundid - BASE_BUFFER_SOUND_INDEX;
		if( bufferSoundId >=0 && bufferSoundId < g_bufferSoundCount)
		{
				pSound = buffer_sampledata[bufferSoundId];
		}
		else
		{
			var queueSoundId = soundid - BASE_QUEUE_SOUND_INDEX;

			if (queueSoundId >= 0 && queueSoundId < g_queueSoundCount)
			{
				pSound = queue_sampledata[queueSoundId];
			}
		}
	}

	return pSound;
}

function audio_play_sound_common(_props) {
    if (_props.invalid())
        return -1;

    const voice = getFreeVoice(_props);

    if (voice === null)
        return -1;

    switch (_props.type) {
        case AudioPlaybackType.NON_POSITIONAL:
            g_AudioBusMain.connectInput(voice.pgainnode);
            break;
        case AudioPlaybackType.POSITIONAL_SPECIFIED:
            const pos = _props.position;
            // Create a temporary emitter
            _props.emitter = create_emitter();
            _props.emitter.setPosition(pos.x, pos.y, pos.z);
            emitter_set_falloff(_props.emitter, pos.falloff_ref, pos.falloff_max, pos.falloff_factor);
            // Intentional fall-through
        case AudioPlaybackType.POSITIONAL_EMITTER:
            voice.pemitter = _props.emitter;
            voice.pgainnode.connect(voice.pemitter);
            break;
        default:
            debug("Warning: Unknown audio playback type => " + _props.type);
            return -1;
    }

    Audio_Play(voice, _props);

    return voice.handle;
}

// interface functions -----------------------------------------------------

function audio_play_sound(_asset_index, _priority, _loop, _gain, _offset, _pitch)
{
    const props = new AudioPlaybackProps({
        sound: _asset_index, 
        priority: _priority, 
        loop: _loop, 
        gain: _gain, 
        offset: _offset, 
        pitch: _pitch
    });

    return audio_play_sound_common(props); 
}

function audio_play_sound_on(_emitter_index, _asset_index, _loop, _priority, _gain, _offset, _pitch)
{
    const props = new AudioPlaybackProps({
        emitter: _emitter_index,
        sound: _asset_index,
        loop: _loop,
        priority: _priority, 
        gain: _gain, 
        offset: _offset, 
        pitch: _pitch
    });

    return audio_play_sound_common(props);
}

function audio_play_sound_at(_asset_index, _x, _y, _z, _falloff_ref, _falloff_max, _falloff_fac, _loop, _priority, _gain, _offset, _pitch)
{
    const props = new AudioPlaybackProps({
        sound: _asset_index,
        position: {
            x: _x,
            y: _y,
            z: _z,
            falloff_ref: _falloff_ref,
            falloff_max: _falloff_max,
            falloff_factor: _falloff_fac
        },
        loop: _loop, 
        priority: _priority, 
        gain: _gain, 
        offset: _offset, 
        pitch: _pitch
    });

    return audio_play_sound_common(props);
}

function audio_play_sound_ext(_params)
{
    if (typeof _params !== "object")
        yyError("Error: audio_play_sound_ext => argument must be a struct");

    const props = new AudioPlaybackProps(_params);

    return audio_play_sound_common(props);
}
	
function audio_stop_sound( _soundid )
{
	if(g_AudioModel!= Audio_WebAudio)
	    return;

	_soundid = yyGetInt32(_soundid);
	
	var sound;
	if(_soundid>=BASE_SOUND_INDEX)
	{
		sound = GetAudioSoundFromHandle( _soundid );
		if (sound != null) {
		    if (sound.bQueued) {
                // remove from handle map
		        g_handleMap[sound.handle - BASE_SOUND_INDEX] = undefined;
		    }
            Audio_Stop(sound);
		}
	}
	else
	{
		for(var i=0;i<g_audioSoundCount;++i)
		{
			sound = audio_sounds[i];
			if( sound.soundid == _soundid )
				Audio_Stop( sound );
		}   
	}
}

function audio_pause_sound( _soundid)
{
    if(g_AudioModel!=Audio_WebAudio)
        return;

    _soundid = yyGetInt32(_soundid);
	
	var sound;
	if( _soundid >= BASE_SOUND_INDEX)
	{
		sound = GetAudioSoundFromHandle( _soundid );
		if( sound != null ) {
		    Audio_Pause( sound );
		}
	}
	else
	{
		for(var i=0;i<g_audioSoundCount;++i)
		{
			sound = audio_sounds[i];
			if( sound.soundid == _soundid )		
			{				
				Audio_Pause( sound );
				//audio_sounds[i].systempaused = true;   //?why only for this case...? TODO required for pause/resume on page hide; 
				//but don't resume sounds which were already paused on page hide!
			}
		}
	}
}

function audio_resume_sound( _soundid)
{
    if(g_AudioModel!= Audio_WebAudio)
        return;

    _soundid = yyGetInt32(_soundid);

    if (_soundid >= BASE_SOUND_INDEX)
    {    
        let sound = GetAudioSoundFromHandle( _soundid );
        if( sound != null ) {
            Audio_Resume( sound );
        }
    }
    else
    {
        for(var i=0;i<g_audioSoundCount;++i)
        {
            let sound = audio_sounds[i];
            if( sound.soundid == _soundid )		
            {
                Audio_Resume(sound);
            }
        }              
    }
}

function audio_play_music( _soundid,_bLoop)
{
	debug("audio_play_music :: deprecated function\n");
}

function audio_stop_music()
{
	debug("audio_stop_music :: deprecated function");
}

function audio_pause_music() 
{
	debug("audio_pause_music :: deprecated function");
}

function audio_resume_music() 
{
    debug("audio_resume_music :: deprecated function");
}

function audio_music_is_playing() 
{
    debug("audio_music_is_playing :: deprecated function");
    return 0;
}

function audio_exists(_id) {

    _id = yyGetInt32(_id);

    //check for audio resource
    var pSound = Audio_GetSound(_id);
    if (pSound != null)
        return true;

    //check for active sound handle
    var sound = g_handleMap[_id - BASE_SOUND_INDEX];
    if (sound && sound.bActive)
        return true;

    return false;
}

function audio_sound_get_pitch(_soundid)
{
    if (g_AudioModel == Audio_WebAudio)
    {
        _soundid = yyGetInt32(_soundid);

        if (_soundid >= BASE_SOUND_INDEX) 
        {
            const voice = GetAudioSoundFromHandle(_soundid);

            if (voice != null && voice.bActive)
            {
                return voice.pitch;
            }
        }
        else
        {
        	const sound_asset = Audio_GetSound(_soundid);

            // Queued sounds not currently supported
            if (sound_asset != null && IsSoundQueued(_soundid) == false)
		    {
                return sound_asset.pitch;
            }
        }
    }

    return 1.0;
}

function audio_sound_pitch(_soundid, pitch)
{
    _soundid = yyGetInt32(_soundid);
    pitch = yyGetReal(pitch);

    if (_soundid < 0) 
        return;

    if (g_AudioModel != Audio_WebAudio)
        return;
    
	if (_soundid >= BASE_SOUND_INDEX) 
	{
        const voice = GetAudioSoundFromHandle(_soundid);

        if (voice != null && voice.bActive)
		{
            voice.setPlaybackCheckpoint();

            voice.pitch = pitch;

            const new_pitch = AudioPropsCalc.CalcPitch(voice);

			if (voice.bStreamed)
			{
				voice.audio_tag.playbackRate = new_pitch;
            }
			else
			{
                voice.pbuffersource.playbackRate.value = new_pitch;
			}
		}
    }
    else
    {
        const sound_asset = Audio_GetSound(_soundid);

        // Queued sounds not currently supported
        if (sound_asset == null || IsSoundQueued(_soundid))
            return;

        // Update the asset-level pitch
        sound_asset.pitch = pitch;

        // Update any playing sounds
        for (let i = 0; i < g_audioSoundCount; ++i)
        {
            const voice = audio_sounds[i];

            if (voice.bActive && voice.soundid == _soundid)		
            {
                voice.setPlaybackCheckpoint();

                const new_pitch = AudioPropsCalc.CalcPitch(voice);

                if (voice.bStreamed)
                {
                    voice.audio_tag.playbackRate = new_pitch;
                }
                else
                {
                    voice.pbuffersource.playbackRate.value = new_pitch;
                }
            }
        }
    }
}

function audio_sound_get_gain(_index)
{
    if (g_AudioModel != Audio_WebAudio)
        return;

    _index = yyGetInt32(_index);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);

        if (voice != null && voice.bActive)
            return voice.gain.get();
    }
    else {
        const asset = audio_sampledata[_index];

        if (asset !== undefined)
            return asset.gain.get();
    }

    return 0;
}

function audio_sound_gain(_index, _gain, _timeMs)
{
    if (g_AudioModel != Audio_WebAudio)
        return;

    _index = yyGetInt32(_index);

    _gain = yyGetReal(_gain);
    _gain = Math.max(0, _gain);

    _timeMs = yyGetInt32(_timeMs); 
    _timeMs = Math.max(0, _timeMs);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);

        if (voice == null)
            return;

        if (voice.bActive) {
            voice.gain.set(_gain, _timeMs);

            if (_timeMs == 0) 
                voice.pgainnode.gain.value = AudioPropsCalc.CalcGain(voice);
        }
    }
    else {
        const asset = audio_sampledata[_index];

        if (asset !== undefined) {
            asset.gain.set(_gain, _timeMs);

            if (_timeMs == 0) {
                // Update all the active voices playing this asset
                audio_sounds.forEach(_voice => {
                    if (_voice.bActive && _voice.soundid == _index) {
                        _voice.pgainnode.gain.value = AudioPropsCalc.CalcGain(_voice);
                    }
                });
            }
        }
    }
}

function audio_music_gain(level, time) 
{
    debug("audio_music_gain :: deprecated function\n");
}

function handleVisibilityChange()
{
    // Make sure we resume and suspend the audio ourselves
    // this is only allowed after first canvas iteration
    if (g_WebAudioContext)
    {
        (document.visibilityState === 'visible') ? g_WebAudioContext.resume() : g_WebAudioContext.suspend();
    }

    if(g_AudioModel==Audio_WebAudio)
    {
        if(document[g_hidden] == true)
        {
            if(!audio_global_paused)
            {
             //   debug("pause all audio");
                audio_global_paused = true;
                audio_pause_all_opt(true);
            }      
        }
        else if(document[g_hidden] == false)
        {
            if(audio_global_paused)
            {
                audio_resume_all_opt(true);
                //debug("resume all audio");
                audio_global_paused = false;
            }
        }   
    }
}

function audio_sound_length(_soundid)
{
	if(g_AudioModel!=Audio_WebAudio)
	    return -1;

	_soundid = yyGetInt32(_soundid);

	//TODO !...can we get streamed sound duration...? there is a duration property in the audio tag but doesn't sound promising...
	var sampleid = -1;
	if(_soundid<BASE_SOUND_INDEX)	//sample index
	{
		sampleid = _soundid;
	}
	else	//handle
	{
		var sound = GetAudioSoundFromHandle( _soundid );
		if( sound != null ) {
		    sampleid = sound.soundid;
		}
	}

	if( sampleid != -1 )
	{
		 if( IsSoundStreamed( sampleid ) )
		 {
			//for streamed sounds - duration passed through from asset compiler
			return( audio_sampledata[ sampleid ].duration );
		 }
		 else
		 {
			return audio_sampledata[ sampleid ].buffer.duration;
		 }
	}
	return -1;
}



function audio_sound_get_track_position(_soundid)
{
    if (g_AudioModel != Audio_WebAudio)
        return 0;

    _soundid = yyGetInt32(_soundid);
		
	if (_soundid >= BASE_SOUND_INDEX) 
	{
		const voice = GetAudioSoundFromHandle(_soundid);

		if (voice != null)
		{
		    return voice.getPlaybackPosition();
		}
	}
	else if (_soundid >= 0)
	{
	    const sound_asset = audio_sampledata[_soundid];

	    if (sound_asset != undefined)
	    {
	        return sound_asset.trackPos;
	    }
	}

	return 0.0;
}

function Audio_SetTrackPos( _audioSound, _time )
{
    if( _audioSound.bActive )
    {
        if( !_audioSound.bStreamed )
        {
            //AudioBufferSourceNode- cannot call start/noteOn more than once- have to stop and replay at time offset
            //Audio_StopUnstreamed( _audioSound );
            //don't need to disconnect gain nodes since we are reusing audioSound
            const duration = _audioSound.pbuffersource.buffer.duration;

            if (_time >= 0)
            {
                _time = Math.min(_time, duration);

                if (_audioSound.paused)
                {
                    //simply need to resume at different offset
                    _audioSound.playbackCheckpoint.bufferTime = _time;
                }
                else
                {
                    _audioSound.pbuffersource.onended = null;
                    _audioSound.pbuffersource.stop(0);
                    _audioSound.pbuffersource.disconnect();
                    _audioSound.startoffset = _time;

                    Audio_PlayUnstreamed(_audioSound);
                }
            }
        }
        else // Streamed sounds
        {
        	const duration = _audioSound.audio_tag.duration;

        	// If we haven't loaded the audio metadata (and thus can't determine the duration),
        	// then postpone the setting of the track position until it has loaded.
        	if (isNaN(duration))
        	{
        		_audioSound.audio_tag.addEventListener('loadedmetadata', function() {
                    _time = Math.min(_time, this.duration);
                    this.currentTime = _time;
                });
        	}
            else if (_time >= 0)
            {
                _time = Math.min(_time, duration);
                _audioSound.audio_tag.currentTime = _time;
            }
        }
    }
}

function audio_sound_set_track_position(_soundid, _time)
{
    if (g_AudioModel != Audio_WebAudio) 
        return;

    _soundid = yyGetInt32(_soundid);
    _time = yyGetReal(_time);
    
    if (_soundid >= BASE_SOUND_INDEX) 
	{
		const voice = GetAudioSoundFromHandle(_soundid);

		if (voice != null)
		{
            Audio_SetTrackPos(voice, _time);
        }
    }
    else if (_soundid >= 0)
    {
        _time = yymax(_time, 0);
        const duration = audio_sound_length(_soundid);

	    if (_time < duration)
	    {
	        const sampleData = audio_sampledata[_soundid];

	        if (sampleData != undefined)
	        {
	            sampleData.trackPos = _time;
	        }
	    }
    }
}

function audio_sound_loop_start(_index, _offsetSecs) {
    _index = yyGetInt32(_index);
    _offsetSecs = yyGetReal(_offsetSecs);

    const assetDuration = audio_sound_length(_index);

    if (assetDuration === -1) {
        debug("audio_sound_loop_start() - could not determine length of asset");
        return;
    }

    _offsetSecs = clamp(_offsetSecs, 0, assetDuration);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);

        if (voice !== null)
            voice.setLoopStart(_offsetSecs);     
	}
	else {
		const asset = Audio_GetSound(_index);

        if (asset === null) {
            debug("audio_sound_loop_start() - no asset found with index " + _index);
            return;
        }

        asset.loopStart = _offsetSecs;

        const voices = audio_sounds.filter(_voice => _voice.soundid === _index);
        voices.forEach(_voice => _voice.setLoopStart(_offsetSecs));
	}
}

function audio_sound_get_loop_start(_index) {
    _index = yyGetInt32(_index);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);
        
        if (voice === null)
            return 0.0;

        if (voice.bStreamed) {
            // Handle streamed sounds
            return 0.0;
        }
        else {
            return voice.pbuffersource.loopStart;
        }
	}
	else {
		const asset = Audio_GetSound(_index);

        if (asset === null) {
            debug("audio_sound_get_loop_start() - no asset found with index " + _index);
            return 0.0;
        }

        return asset.loopStart;
	}
}

function audio_sound_loop_end(_index, _offsetSecs) {
    _index = yyGetInt32(_index);
    _offsetSecs = yyGetReal(_offsetSecs);

    const assetDuration = audio_sound_length(_index);

    if (assetDuration === -1) {
        debug("audio_sound_loop_end() - could not determine length of asset");
        return;
    }

    _offsetSecs = clamp(_offsetSecs, 0, assetDuration);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);

        if (voice !== null)
            voice.setLoopEnd(_offsetSecs);     
	}
	else {
		const asset = Audio_GetSound(_index);

        if (asset === null) {
            debug("audio_sound_loop_end() - no asset found with index " + _index);
            return;
        }

        asset.loopEnd = _offsetSecs;

        const voices = audio_sounds.filter(_voice => _voice.soundid === _index);
        voices.forEach(_voice => _voice.setLoopEnd(_offsetSecs));
	}
}

function audio_sound_get_loop_end(_index) {
    _index = yyGetInt32(_index);

    if (_index >= BASE_SOUND_INDEX) {
        const voice = GetAudioSoundFromHandle(_index);
        
        if (voice === null)
            return 0.0;

        if (voice.bStreamed) {
            // Handle streamed sounds
            return 0.0;
        }
        else {
            return voice.pbuffersource.loopEnd;
        }
	}
	else {
		const asset = Audio_GetSound(_index);

        if (asset === null) {
            debug("audio_sound_get_loop_end() - no asset found with index " + _index);
            return 0.0;
        }

        return asset.loopEnd;
	}
}

function audio_system() {

//these should use the defined values in audio_main to match up but for now I'll hardwire it
    if (g_AudioModel == Audio_WebAudio)
        return 1;
    else
        return 0;
}

function audio_emitter_exists(_emitterid)
{
    if(audio_emitters[yyGetInt32(_emitterid)]!=undefined)
        return true;
        
    return false;
}

function audio_get_type(_soundid)
{
    if(g_AudioModel!=Audio_WebAudio)
		return -1;
	
    if (IsSoundStreamed(yyGetInt32(_soundid)))
	{
		return 1;	//closest equivalent to old "music" type
	}
	return 0;
}	

function audio_get_name(_index )
{
    if( g_AudioModel == Audio_WebAudio )
    {
        _index = yyGetInt32(_index);

        var soundId = -1;
        if (_index >= BASE_SOUND_INDEX) 
	    {
            //_soundid = single sound handle		
		    var sound = GetAudioSoundFromHandle( _index );
		    if( sound != null )
		    {
		        soundId = sound.soundid;    //audio_sound index = g_pGMFile.Sounds[] index 
		    }
        }
        else 
	    {
		    //sample index
		    soundId = _index;
        }
	    if( soundId >=0 && soundId < g_pGMFile.Sounds.length )
        {
            var name = g_pGMFile.Sounds[soundId].pName;   //!CHECK is this right...?
            return name;
        }
	}
	
    return "<undefined>";
}	

var falloff_model;  //web audio falloff model
var g_AudioFalloffModel;    //gml audio falloff setting
function audio_falloff_set_model(_model)
{
    if(g_AudioModel != Audio_WebAudio) {
        return;
    }

    _model = yyGetInt32(_model);
    
    if (_model == g_AudioFalloffModel)
        return; //no change

    var tempnode = g_WebAudioContext.createPanner();
    g_AudioFalloffModel = _model;

    switch(_model)
    {
		case DistanceModels.AUDIO_FALLOFF_NONE:
		    //webaudio does not have a "no falloff" model as such; 
		    //use inverse model and override the falloff factor to mimic no falloff
		    falloff_model = tempnode.INVERSE_DISTANCE;
		    if (falloff_model == undefined) falloff_model = "inverse";
			break;
		case DistanceModels.AUDIO_FALLOFF_INVERSE_DISTANCE:
			falloff_model = tempnode.INVERSE_DISTANCE;
			if (falloff_model == undefined) falloff_model = "inverse";
			break;
		case DistanceModels.AUDIO_FALLOFF_INVERSE_DISTANCE_CLAMPED:
			debug("Audio_falloff_inverse_distance_clamped not supported in html5\n");
			break;
		case DistanceModels.AUDIO_FALLOFF_LINEAR_DISTANCE:
			falloff_model = tempnode.LINEAR_DISTANCE;
			if (falloff_model == undefined) falloff_model = "linear";
			break;
		case DistanceModels.AUDIO_FALLOFF_LINEAR_DISTANCE_CLAMPED:
			debug("Audio_falloff_linear_distance_clamped not supported in html5\n");
			break;
		case DistanceModels.AUDIO_FALLOFF_EXPONENT_DISTANCE:
			falloff_model = tempnode.EXPONENTIAL_DISTANCE;
			if (falloff_model == undefined) falloff_model = "exponential";
			break;
		case DistanceModels.AUDIO_FALLOFF_EXPONENT_DISTANCE_CLAMPED:
			debug("Audio_falloff_exponent_distance_clamped not supported in html5\n");
			
			break;

		default:
			debug("Attempting to set audio falloff to unknown model\n");
			break;
    }

    //update existing emitters (falloff model actually a property of emitter )
    for (var key in audio_emitters)
    {
        if( !audio_emitters.hasOwnProperty(key))
            continue;
        var emitter = audio_emitters[key];
        emitter.distanceModel = falloff_model;
        
        //set/restore rolloff factor
        if (g_AudioFalloffModel == DistanceModels.AUDIO_FALLOFF_NONE)
        {
            emitter.original_rolloffFactor = emitter.rolloffFactor;
            emitter.rolloffFactor = 0;
        }
        else if (typeof emitter.original_rolloffFactor !== 'undefined')
        {
            emitter.rolloffFactor = emitter.original_rolloffFactor;
            emitter.original_rolloffFactor = undefined;
        }
    }
    
}

//TODO - used for both system pause & audio_pause_all - check logic...
//-system pause/resume (ie page hidden ) should not resume sounds which were *already* paused
function audio_pause_all_opt( _bSystemPause )
{
    for(var i=0;i<g_audioSoundCount;++i)
	{
        var sound = audio_sounds[i];
        if( sound.bActive )
		{
			if( !sound.paused )
			{
				Audio_Pause( sound );
                if( _bSystemPause )
					sound.systempaused = true;   
            }
        }
    } 
}

function audio_stop_all() 
{
    for(var i=0;i<g_audioSoundCount;++i)
    {
        var sound = audio_sounds[i];
		if( sound.bActive )
		{
			Audio_Stop( sound );
        }
    }   
}

function audio_group_stop_sounds( _groupId) 
{
    for(var i=0;i<g_audioSoundCount;++i)
    {
        var sound = audio_sounds[i];
		if( sound.bActive )
		{
			var groupId = audio_sampledata[ sound.soundid ].groupId;
			if( groupId == _groupId )
			{
			    Audio_Stop( sound );
			}
        }
    }   
}

function audio_pause_all( )
{
    audio_pause_all_opt(false);
}
function audio_resume_all()
{
    audio_resume_all_opt(false);
}

function audio_resume_all_opt(_bSystemPause)
{
    for(var i=0;i<g_audioSoundCount;++i)
	{
        var sound = audio_sounds[i];
        if( sound.bActive )
		{
			if( sound.paused)
			{
				if( _bSystemPause )
				{
					//only resume sounds paused by system pause -
					if(sound.systempaused )
					{
						Audio_Resume( sound );
						sound.systempaused = false;   
					}
				}
				else
				{
					//resume all sounds
					Audio_Resume( sound );
				}
			}
		}
    } 
}

function audio_is_paused( _soundid )
{
    if (g_AudioModel !== Audio_WebAudio) 
        return false;

    _soundid = yyGetInt32(_soundid);
		
	if (_soundid >= BASE_SOUND_INDEX) 
	{
        //_soundid = single sound handle		
		var sound = GetAudioSoundFromHandle( _soundid );
		if( sound != null )
		{
		    return Audio_IsSoundPaused( sound );
		}
	}
	else 
	{
		//_soundid = sample index
		for(var i=0; i < g_audioSoundCount; ++i )
		{
			sound = audio_sounds[i];
			if( sound.soundid == _soundid )
			{
			    if( sound.bActive )
			    {
				    if( Audio_IsSoundPaused( sound ) )
				    {
					    return true;
				    }
		        }
			}
		}
	}
	
	return false;
}

// ******************************************************************************************
//  GML function: audio_is_playing()
//  Check to see if the audio file/queue/streamed audio is playing
// ******************************************************************************************
function audio_is_playing(_soundid)
{
	if (g_AudioModel !== Audio_WebAudio) 
	    return false;

	_soundid = yyGetInt32(_soundid);

	if (_soundid >= BASE_SOUND_INDEX) 
	{
		var sound = GetAudioSoundFromHandle( _soundid );
		if( sound != null )
		{
			if( Audio_IsSoundPlaying( sound ) )
			{
				return true;
			}
		}
	}	
	else 
	{
		//_soundid = sample index
		for(var i=0; i < g_audioSoundCount; ++i )
		{
			sound = audio_sounds[i];
			if( sound.soundid == _soundid )
			{
			    if( sound.bActive )
			    {
				    if( Audio_IsSoundPlaying( sound ) )
				    {
					    return true;
				    }
		        }
			}
		}
	}

    return false;       
}

// ******************************************************************************************
// GML function: audio_listener_position()
// Changes the position of the listener within the audio space.
// ******************************************************************************************
function audio_listener_position(_one, _two, _three)
{
    if(g_AudioModel==Audio_WebAudio)
    {
        _one = yyGetReal(_one);
        _two = yyGetReal(_two);
        _three = yyGetReal(_three);

        var lis = g_WebAudioContext.listener;
        lis.setPosition( _one, _two, _three );

    	// AB: Need to check if pos exists - can be undefined on some browsers
        if ( lis.pos )
        {
        	lis.pos.X = _one;
        	lis.pos.Y = _two;
        	lis.pos.Z = _three;
        }
        else
        {
        	lis.pos = new Vector3(_one, _two, _three);
        }
    }
}
function audio_listener_velocity( _one,_two,_three)
{
    if(g_AudioModel==Audio_WebAudio)
    {
        _one = yyGetReal(_one);
        _two = yyGetReal(_two);
        _three = yyGetReal(_three);

        var lis = g_WebAudioContext.listener;
        lis.setVelocity( _one, _two, _three );

    	// AB: Need to check if pos exists - can be undefined on some browsers
        if ( lis.velocity )
		{
			lis.velocity.X = _one;
			lis.velocity.Y = _two;
			lis.velocity.Z = _three;
        }
        else
        {
        	lis.velocity = new Vector3( _one, _two, _three );
        }
    }
}

function audio_listener_orientation( _one,_two,_three,_four,_five,_six)
{
    if(g_AudioModel==Audio_WebAudio)
    {
        _one = yyGetReal(_one);
        _two = yyGetReal(_two);
        _three = yyGetReal(_three);
        _four = yyGetReal(_four);
        _five = yyGetReal(_five);
        _six = yyGetReal(_six);

        var lis = g_WebAudioContext.listener;
        lis.setOrientation( _one, _two, _three, _four, _five, _six );

    	// AB: Need to check if pos exists - can be undefined on some browsers
        if ( lis.ori )
		{
        	lis.ori[0] = _one;
        	lis.ori[1] = _two;
        	lis.ori[2] = _three;
        	lis.ori[3] = _four;
        	lis.ori[4] = _five;
        	lis.ori[5] = _six;
        }
        else
		{
        	lis.ori = new Array( _one, _two, _three, _four, _five, _six );
		}
    }
}

function audio_listener_set_position( _listenerId, _x, _y, _z )
{
    if( yyGetInt32(_listenerId) == 0 )
    {
        audio_listener_position( yyGetReal(_x), yyGetReal(_y), yyGetReal(_z) );
    } 
}

function audio_listener_set_velocity( _listenerId, _vx, _vy, _vz )
{
    if( yyGetInt32(_listenerId) == 0 )
    {
        audio_listener_velocity( yyGetReal(_vx), yyGetReal(_vy), yyGetReal(_vz) );
    }
}

function audio_listener_set_orientation( _listenerId, _lookat_x,_lookat_y,_lookat_z,_up_x,_up_y,_up_z )
{
    if( yyGetInt32(_listenerId) == 0 )
    {
        audio_listener_orientation( yyGetReal(_lookat_x), yyGetReal(_lookat_y), yyGetReal(_lookat_z), yyGetReal(_up_x), yyGetReal(_up_y), yyGetReal(_up_z) );
    }
}

function audio_listener_get_data( _listenerId )
{
    if( yyGetInt32(_listenerId) == 0 )
    {
        var lis = g_WebAudioContext.listener;
        var map = ds_map_create();
        ds_map_add( map, "x", lis.pos.X );
        ds_map_add( map, "y", lis.pos.Y );
        ds_map_add( map, "z", lis.pos.Z );
        
        ds_map_add( map, "vx", lis.velocity.X );
        ds_map_add( map, "vy", lis.velocity.Y );
        ds_map_add( map, "vz", lis.velocity.Z );
        
        ds_map_add( map, "lookat_x", lis.ori[0] );
        ds_map_add( map, "lookat_y", lis.ori[1] );
        ds_map_add( map, "lookat_z", lis.ori[2] );
        ds_map_add( map, "up_x", lis.ori[3] );
        ds_map_add( map, "up_y", lis.ori[4] );
        ds_map_add( map, "up_z", lis.ori[5] );
        return map;
    }
    return -1;
}

function audio_emitter_position( _one,_two,_three,_four)
{
    if(g_AudioModel==Audio_WebAudio)
    {
        var emitter = audio_emitters[yyGetInt32(_one)];
        if( emitter != undefined )
        {
            _two = yyGetReal(_two);
            _three = yyGetReal(_three);
            _four = yyGetReal(_four);

            emitter.setPosition(_two,_three,_four);
            emitter.pos.X = _two;
            emitter.pos.Y = _three;
            emitter.pos.Z = _four;
        }
    }
}


function audio_emitter_get_x( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.pos.X;
    }
    return 0;
}

function audio_emitter_get_y( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.pos.Y;
    }
    return 0;
}

function audio_emitter_get_z( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.pos.Z;
    }
    return 0;
}

function audio_emitter_velocity( _one,_two,_three,_four)
{
//html5 panner doesn't have a velocity element
   // if(g_AudioModel==Audio_WebAudio)
   // {
  //      var emitter = audio_emitters[_one];
  //      if( emitter != undefined )
  //      {
           // emitter.setVelocity(_two,_three,_four);
  //          emitter.velocity.X = _two;
  //          emitter.velocity.Y = _three;
  //          emitter.velocity.Z = _four;
  //      }
  //  }
}

function audio_emitter_get_vx( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.velocity.X;
    }
    return 0;
}

function audio_emitter_get_vy( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.velocity.Y;
    }
    return 0;
}

function audio_emitter_get_vz( _emitterId )
{
    var emitter = audio_emitters[yyGetInt32(_emitterId)];
    if( emitter != undefined )
    {
        return emitter.velocity.Z;
    }
    return 0;
}

//creates a new web audio panner and returns it
function create_emitter()
{
    const emitter = g_WebAudioContext.createPanner();			// also clears to defaults.
    emitter.gainnode = g_WebAudioContext.createGain();
    emitter.gainnode.gain.value = 1.0;
    g_AudioBusMain.connectInput(emitter.gainnode);
    emitter.connect(emitter.gainnode);
    emitter.bus = g_AudioBusMain;
    emitter.maxDistance = 100000;
    emitter.refDistance = 100;  //to match native    
    emitter.pitch = 1.0;
    emitter.rolloffFactor = 1;
    if (g_AudioFalloffModel == DistanceModels.AUDIO_FALLOFF_NONE) {
        emitter.rolloffFactor = 0;   //no falloff
        emitter.original_rolloffFactor = 1;
    }

    emitter.coneInnerAngle = 360;
    emitter.coneOuterAngle = 0;
    emitter.coneOuterGain = 0;
    emitter.distanceModel = falloff_model;
    emitter.panningModel = 'equalpower';
    //store position/velocity for getters
    emitter.setPosition(0, 0, 0.01);
    emitter.pos = new Vector3(0, 0, 0.01);
    return emitter;
}

function audio_emitter_create(  )
{
    if(g_AudioModel!= Audio_WebAudio)
        return;
        
    var ind = audio_emitters_index;
    audio_emitters_index++;
    audio_emitters[ind] = create_emitter();
    return ind;
}

function audio_emitter_free(_emitterid)
{
    if(g_AudioModel==Audio_WebAudio)
    {
        _emitterid = yyGetInt32(_emitterid);

        var emitter = audio_emitters[_emitterid];
        if( emitter != undefined )
        {
            //stop playing sounds
            var i;
            for( i=0; i < g_audioSoundCount; ++i )
            {
                var sound = audio_sounds[i];
                if( sound.bActive && sound.pemitter === emitter )
                {
                    Audio_Stop( sound );   
                }
            }
                
            emitter.disconnect();
            emitter.gainnode.disconnect();
            delete audio_emitters[_emitterid];
        }
    }
}

function audio_master_gain( _one)
{
    if(g_AudioModel!= Audio_WebAudio)
        return;
        
    g_AudioMainVolumeNode.gain.value = yyGetReal(_one);
}

function audio_set_master_gain( _listenerId, _gain )
{
    if( yyGetInt32(_listenerId) == 0 )
    {
        audio_master_gain( yyGetReal(_gain) );
    }
}

function audio_get_master_gain( _listenerId )
{
    if (yyGetInt32(_listenerId) == 0)
    {
        return g_AudioMainVolumeNode.gain.value;
    }
    return 0;
}


function audio_emitter_gain(_emitter_index, _gain)
{
    if (g_AudioModel != Audio_WebAudio)
        return;
        
    const emitter = audio_emitters[yyGetInt32(_emitter_index)];

    if (emitter != undefined)
    {
        // This will also update any voices using this emitter
        emitter.gainnode.gain.value = yyGetReal(_gain);
    }
}

function audio_emitter_get_gain(_emitter_index)
{
    if (g_AudioModel == Audio_WebAudio)
    {
        const emitter = audio_emitters[yyGetInt32(_emitter_index)];

        if (emitter != undefined)
        {
            return emitter.gainnode.gain.value;
        }
    }

    return 0.0;
}

function audio_emitter_pitch(index, pitch)
{
    if (g_AudioModel != Audio_WebAudio)
        return;

    index = yyGetInt32(index);

    const emitter = audio_emitters[index];

    if (emitter == undefined)
        return;

    pitch = yyGetReal(pitch);

    emitter.pitch = pitch;

    // Apply pitch change to all voices playing on this emitter
    for (let i = 0; i < g_audioSoundCount; ++i)
	{
        const voice = audio_sounds[i];

        if (voice.bActive) 
		{
            if (voice.pemitter === emitter) 
            {
                voice.setPlaybackCheckpoint();

                const new_pitch = AudioPropsCalc.CalcPitch(voice);

                if (voice.bStreamed)
                {
                    voice.audio_tag.playbackRate = new_pitch;
                }
                else
                {
                    voice.pbuffersource.playbackRate.value = new_pitch;
                }
            }
		}
    } 
}

function audio_emitter_get_pitch(_emitterId)
{
    if (g_AudioModel == Audio_WebAudio)
    {
        const emitter = audio_emitters[yyGetInt32(_emitterId)];

        if (emitter != undefined)
        {
            return emitter.pitch;
        }
    }

    return 1.0;
}

function audio_emitter_falloff(_one,_two,_three,_four)
{
    if(g_AudioModel!= Audio_WebAudio)
        return;
        
    var emitter = audio_emitters[yyGetInt32(_one)];
    if (emitter != undefined) {
        emitter_set_falloff(emitter, yyGetReal(_two), yyGetReal(_three), yyGetReal(_four));
    }
}

function emitter_set_falloff(emitter, falloff_ref, falloff_max, falloff_fac)
{
    emitter.refDistance = falloff_ref;
    emitter.maxDistance = falloff_max;
    emitter.rolloffFactor = falloff_fac;
    emitter.distanceModel = falloff_model;
    if (g_AudioFalloffModel == DistanceModels.AUDIO_FALLOFF_NONE) {
        emitter.original_rolloffFactor = emitter.rolloffFactor;
        emitter.rolloffFactor = 0;
    }
}

function audio_channel_num( _num_channels)
{
    _num_channels = yyGetInt32(_num_channels);

    if( _num_channels < audio_max_playing_sounds )
	{
		for(var i= _num_channels; i< g_audioSoundCount;++i)
		{
			var sound = audio_sounds[i];
			if( sound.bActive )
			{
				Audio_Stop( sound );
			}
		}
		
		if( g_audioSoundCount > _num_channels )
			g_audioSoundCount = _num_channels;
    }   
	
	audio_max_playing_sounds = _num_channels;
}

//multiple listener support - stub functions since only 1 web audio listener
function audio_sound_get_listener_mask(soundid)             { return 1; }
function audio_sound_set_listener_mask(soundid,mask)        {}
function audio_emitter_get_listener_mask(emitterid)         { return 1;}
function audio_emitter_set_listener_mask(emitterid,mask)    {}
function audio_get_listener_mask()                          { return 1;}
function audio_set_listener_mask(mask)                      {}
function audio_get_listener_count()                         { return 1;}
function audio_get_listener_info(index)                     
{
    if(g_AudioModel== Audio_WebAudio)
    {
        index = yyGetInt32(index);

        if(index == 0 )
        {
            var map = ds_map_create();
            ds_map_add( map, "name", "default");
            ds_map_add( map, "mask", 1 );
            ds_map_add( map, "index", index );
            return map;
        }
    }
    return -1;
}
function audio_debug(trueFalse)                             {}

//loading -------------------------
/** @this {XMLHttpRequest} */
function Audio_SoundError(e)
{
   if(g_AudioModel!= Audio_WebAudio)
       return;
       
   var targetid = e.target.targetid;
   
   debug("error loading sound" + targetid);
   
   if (targetid != undefined)
   {
        debug("AudioError: " + this.URL );
	    this.completed = false;
	    
		g_LoadingCount++;
	    
	    ClearEventListeners(this);
   }
}

/** @this {XMLHttpRequest} */
function Audio_SoundLoad(e) 
{
   if(g_AudioModel!= Audio_WebAudio)
       return;
       
   var targetid = e.target.targetid;
   if( g_VerboseOutput )
   		debug( "sound loaded: " + targetid );

   if (targetid != undefined)
   {
		this.completed = true;
	  
		//wait until audio is DECODED before flagging as loaded - otherwise sounds at start-up may fail to play
		//g_LoadingCount++;
	    
		ClearEventListeners(this);
		// debug(request.response);
		//g_WebAudioContext.createGainNode();
		//  g_WebAudioContext.decodeAudioData(asbuff,onaudioloaded);
	    
		try
		{
			var sampleData = audio_sampledata[targetid];
			sampleData.state = AudioSampleState.DECODING;

			g_WebAudioContext.decodeAudioData(e.target.response,
				function ( buffer )
				{
					sampleData.buffer = buffer;
					sampleData.state = AudioSampleState.READY;
					g_LoadingCount++;
				},
				function ( err )
				{
					sampleData.state = AudioSampleState.LOADED;
					g_LoadingCount++;
					debug( "error decoding audio data:" + err );
				}
			);
		}
		catch ( ex )
		{
			debug("error decoding audio data: " + ex.message );
			g_LoadingCount++;
		}
   }
}

function Audio_StreamedSoundPreloaded(_event)
{
	if ( g_AudioModel != Audio_WebAudio )
		return;

	this.completed = true;
	ClearEventListeners( this );

	var targetid = _event.target.targetid;
	if ( g_VerboseOutput )
		debug( "streamed sound pre-loaded: " + targetid );

	var sampleData = audio_sampledata[targetid];
	if ( sampleData )
	{
		sampleData.state = AudioSampleState.LOADED;
	}
	else
	{
		debug( "ERROR: No sample data sound for sound ID " + targetid + " in Audio_StreamedSoundPreloaded" );
	}
}

function Audio_PrepareStream(_url, _id, _name, _ext)
{
	//just store gain & pitch
	//TODO - check sample gain - does not look like it is being applied anywhere...
	//could we have a gain node for each sample and connect to audioSound.pgainnode ? 

    var sampleData = audio_sampledata[_id];
    sampleData.buffer = null;

	// Preload streamed audio on IOS
    if(g_HandleStreamedAudioAsUnstreamed)
    {
    	AudioManager_AddStreamedSoundAsRaw( _url, _id, _name, _ext );
    }
    else
    {
    	sampleData.state = AudioSampleState.READY;
    }
}

function Audio_SoundReadyStateChange(e)
{
     var targetid = e.target.targetid;
     debug("Audio_SoundReadyStateChange:targetid/readyState/status:"+targetid+'/'+e.target.readyState+'/'+e.target.status); 
}

function Audio_SoundProgress(e)
{
    var targetid = e.target.targetid;
    debug("Audio_SoundProgress:targetid/loaded/total:"+targetid+'/'+e.loaded+'/'+e.total);
}

function AudioManager_GetPreloadRequest( _url, _ext )
{
	_url = CheckWorkingDirectory( _url );

	var index;
	index = _url.indexOf( _ext );
	if ( index > 0 )
	{
		_url = _url.substr( 0, index );
	}

	// See what format the browser can play, and use that. Prefer ogg....
	if ( g_canPlayOgg )
	{
		_ext = "ogg";
	}
	else if ( g_canPlayMp3 )
	{
		_ext = "mp3";
	}
	else
	{
		// Else... we'll "try" and use ogg anyway.
		_ext = "ogg";
	}

	_url = _url + "." + _ext;

	// Start d/l request
	var request = new XMLHttpRequest();

	request.open( 'GET', _url, true ); // fix for Wii U NWF - must open before setting responseType
	request.responseType = 'arraybuffer';

	request.URL = _url;
	request.completed = false;

	return request;
}

function AudioManager_AddRawSound(_url, _id, _name, _ext, _pGroup) 
{
	if ((g_AudioModel != Audio_WebAudio) || (AUDIO_ON == false)) 
	{
        return undefined;
    }
	
	// Create d/l request
	var request = AudioManager_GetPreloadRequest( _url, _ext );
   
    // Decode asynchronously
    if( _pGroup != undefined )
    {
        request.targetid = { group:_pGroup, soundId: _id };
        request.onload = GroupOnSoundLoad;
        request.onerror = GroupOnSoundLoadError;
    }
    else
    {
    	request.targetid = _id;
        request.onload = Audio_SoundLoad;
        request.onerror = Audio_SoundError;
        request.ontimeout = Audio_SoundError;
        request.onprogress = Audio_SoundProgress;
        request.onreadystatechange = Audio_SoundReadyStateChange;
    }

    request.send();
    g_RawSounds[_name] = request;
    return _id;
}

function AudioManager_AddStreamedSoundAsRaw(_url, _id, _name, _ext)
{
	if ( ( g_AudioModel != Audio_WebAudio ) || ( AUDIO_ON == false ) )
	{
		return undefined;
	}

	var request = AudioManager_GetPreloadRequest( _url, _ext );
	request.targetid = _id;
	request.onload = Audio_StreamedSoundPreloaded;
	request.onerror = Audio_SoundError;

	request.send();
	g_RawSounds[_name] = request;
	return _id;
}

//audio groups ---------------- 

//load state "constants" hah
var eAudioGroup_Unloaded="Unloaded";
var eAudioGroup_Loading="Loading";
var eAudioGroup_Loaded="Loaded";
var eAudioGroup_Unloading="Unloading";
var g_AudioGroupCount = 0;
var g_AudioGroups = [];

/** @constructor */
function yyAudioGroup(_groupId) {
    this.groupId = _groupId;
	this.loadState = eAudioGroup_Unloaded;
	this.loadCount = 0;
	this.loadProgress = 0;
	this.soundList = []; // Array of asset indices
    this.gain = new TimeRampedParamLinear(1);
}

yyAudioGroup.prototype.AddSound = function(_sound)
{
    this.soundList.push(_sound);
};

yyAudioGroup.prototype.SetState = function(_newState) 
{
    if( this.loadState != _newState )
    {
        this.loadState = _newState;
        debug("Audio Group " + this.groupId + "-> " + this.loadState );
    
        //- send async loaded event chappy
        if( _newState == eAudioGroup_Loaded )
        {
            var map = ds_map_create();
            g_pBuiltIn.async_load = map;
            ds_map_add(map, "type", "audiogroup_load" );
            ds_map_add(map, "group_id", this.groupId );
            g_pObjectManager.ThrowEvent(EVENT_OTHER_ASYNC_SAVE_LOAD,0);            
        }
    }
};

yyAudioGroup.prototype.getGain = function() {
    return this.gain.get();
};

yyAudioGroup.prototype.setGain = function(_gain, _timeMs) {
    _gain = Math.max(0, _gain);
    _timeMs = Math.max(0, _timeMs);

    this.gain.set(_gain, _timeMs);

    if (_timeMs == 0) {
        // Update all active voices playing assets from this group
        audio_sounds.forEach(_voice => {
            const assetIndex = this.soundList.find(_assetIndex => _assetIndex == _voice.soundid);

            if (assetIndex !== undefined)
                _voice.pgainnode.gain.value = AudioPropsCalc.CalcGain(_voice);
        });
    }
};

/** @this {XMLHttpRequest} */
function GroupOnSoundLoad( e )
{
	//'this' is XMLHttpRequest
	var targetid = this.targetid.soundId;
	var pGroup = this.targetid.group;
	if( g_VerboseOutput )
		debug( "sound loaded " + targetid );

	if(targetid != undefined)
	{
		e.target.completed = true;
		//wait until audio is DECODED before flagging as loaded
		ClearEventListeners( this );

		try
		{
			var sampleData = audio_sampledata[targetid];
			sampleData.state = AudioSampleState.DECODING;

			g_WebAudioContext.decodeAudioData(e.target.response,
				function ( buffer )
				{
					sampleData.buffer = buffer;
					sampleData.state = AudioSampleState.READY;
					pGroup.DecrementLoadCount();
				},
				function ( err )
				{
					sampleData.state = AudioSampleState.LOADED;
					pGroup.DecrementLoadCount();
					debug( "error decoding audio data:" + err );
				}
			);
		}
		catch ( ex )
		{
			debug("error decoding audio data: " + ex.message );
			pGroup.DecrementLoadCount();
		}
	}
}

/** @this {XMLHttpRequest} */
function GroupOnSoundLoadError( e )
{
    //'this' is XMLHttpRequest
    var targetid = this.targetid.soundId;
    var pGroup = this.targetid.group;
    debug("error loading sound" + targetid);
    if(targetid != undefined)
    {
        debug("AudioError: " + this.URL );
	    this.completed = false;
	    ClearEventListeners(this);
	    pGroup.DecrementLoadCount();
   }
}

yyAudioGroup.prototype.DecrementLoadCount = function()
{
    this.loadCount--;
    if( this.soundList.length > 0 )
    {
        this.loadProgress = ((this.soundList.length - this.loadCount)*100) / (this.soundList.length);
    }
    
    if( this.loadCount <=0 )
    {
        //load complete
        this.SetState( eAudioGroup_Loaded );
    }
};

yyAudioGroup.prototype.Load = function() 
{
    if( this.loadState != eAudioGroup_Unloaded )
    {
        return 0;
    }
    if( this.soundList.length == 0 ) {
        return 0;
    }
    
    this.SetState( eAudioGroup_Loading );
    this.loadCount = this.soundList.length;
    this.loadProgress = 0;
    var i;
    for( i=0; i < this.soundList.length; ++i )
    {
        var index = this.soundList[i];

        if (g_pGMFile.Sounds[index].kind == AudioStreamType.UNSTREAMED)
        {
            //unstreamed -> AudioManager_AddRawSound
        	var id = AudioManager_AddRawSound( g_RootDir + g_pGMFile.Sounds[index].origName,
											   index,
											   g_pGMFile.Sounds[index].pName,
											   g_pGMFile.Sounds[index].extension,
											   this );
            if( id === undefined )
                this.DecrementLoadCount();
        }
        else
        {
            //streamed so no load required
            this.DecrementLoadCount();
        }
    }
};

yyAudioGroup.prototype.Unload = function() 
{
    if( this.loadState != eAudioGroup_Loaded )
    {
        return 0;
    }
    this.SetState( eAudioGroup_Unloading ); 
    //STOP all sounds for this group
    audio_group_stop_sounds( this.groupId );
    
    //null buffer ref i suppose...
    var i;
    for( i=0; i < this.soundList.length; ++i )
    {
        var index = this.soundList[i];
        var sampleData = audio_sampledata[index];
	    if( sampleData != undefined )
	    {
	        sampleData.buffer = null;
	    }
    }
    this.SetState( eAudioGroup_Unloaded ); 
};

yyAudioGroup.prototype.IsLoaded = function() 
{
    if( this.loadState == eAudioGroup_Loaded )
    {
        return 1;
    }
    return 0;
};

yyAudioGroup.prototype.GetLoadProgress = function()
{
    if( this.loadState == eAudioGroup_Loaded )
    {
        return 100;
    }
    
    if( this.loadState == eAudioGroup_Loading )
    {
        return ~~this.loadProgress;
    }
    
    return 0;   //unloaded / unloading
};

function Audio_InitSampleData()
{
    //MOVED from Add_RawSound on load etc - as we may not load all sounds on startup
    //console.log("Audio_InitSampleData");
    var index;
    for (index = 0; index < g_pGMFile.Sounds.length; index++)
	{
	    if(  g_pGMFile.Sounds[index]!==null)
	    {
            var sampleData = new audioSampleData();
            audio_sampledata[index] = sampleData;
            sampleData.buffer = null; 
            var initialGain = g_pGMFile.Sounds[index].volume;
            sampleData.gain = new TimeRampedParamLinear(initialGain);
            sampleData.configGain = initialGain;
            sampleData.pitch = 1.0;
            sampleData.kind = g_pGMFile.Sounds[index].kind;
            
            if(  g_pGMFile.Sounds[index].duration != undefined )
            {
                sampleData.duration = g_pGMFile.Sounds[index].duration;
            }
            
            sampleData.groupId = 0;
            var groupId = g_pGMFile.Sounds[index].groupId;
            if( groupId != undefined )
            {
                sampleData.groupId = groupId;
            }
        }
    }
}

function AudioGroups_Init()
{        
    if (g_pGMFile.AudioGroups)
    {
        var i;
        g_AudioGroupCount = g_pGMFile.AudioGroups.length;
        for( i=0; i < g_AudioGroupCount; ++i )
        {
            g_AudioGroups[i] = new yyAudioGroup(i);
        }
        
        //!must call Audio_InitSampleData() first!
        for (i = 0; i < audio_sampledata.length; ++i )
	    {
	        var sound = audio_sampledata[i];
	        if( sound != undefined )
	        {
	            var groupId = sound.groupId;
	            if( g_AudioGroups[groupId] != undefined )
	            {
	                if( g_pGMFile.AudioGroups[groupId].enabled )
	                    g_AudioGroups[groupId].AddSound(i);
	            }
	        }
        }
    }
}

function audio_group_load( _groupId )
{
    _groupId = yyGetInt32(_groupId);

    if( _groupId > 0 && _groupId < g_AudioGroupCount )
    {
        var pGroup = g_AudioGroups[_groupId];
        var result = pGroup.Load();
        return result;
    }
    return 0;
}

function audio_group_unload( _groupId )
{
    _groupId = yyGetInt32(_groupId);

    if( _groupId > 0 && _groupId < g_AudioGroupCount )
    {
        var pGroup = g_AudioGroups[_groupId];
        var result = pGroup.Unload();
        return result;
    }
    return 0;
}

function audio_group_is_loaded( _groupId )
{
    _groupId = yyGetInt32(_groupId);

    if( _groupId == 0 ) {
        return 1;
    }
    
    if( _groupId > 0 && _groupId < g_AudioGroupCount )
    {
        var pGroup = g_AudioGroups[_groupId];
        var result = pGroup.IsLoaded();
        return result;
    }
    return 0;
}		
		
function audio_group_load_progress( _groupId )
{
    _groupId = yyGetInt32(_groupId);

    if( _groupId == 0 ) {
        return 100;
    }
    
    if( _groupId > 0 && _groupId < g_AudioGroupCount )
    {
        var pGroup = g_AudioGroups[_groupId];
        var result = pGroup.GetLoadProgress();
        return result;
    }        
    return 0;
}

function audio_group_name(_groupId )
{
    _groupId = yyGetInt32(_groupId);

    if( _groupId >= 0 && _groupId < g_AudioGroupCount )
    {
        var name = g_pGMFile.AudioGroups[_groupId].name;
        return name;
	}
	
    return "<undefined>";
}	

function audio_group_stop_all( _groupId )
{
    audio_group_stop_sounds( yyGetInt32(_groupId) );
}

function audio_group_set_gain(_groupId, _gain, _timeMs)
{
    _groupId = yyGetInt32(_groupId);
    _gain = yyGetReal(_gain);
    _timeMs = yyGetInt32(_timeMs);

    const group = g_AudioGroups[_groupId];

    if (group !== undefined)
        group.setGain(_gain, _timeMs);
}

function audio_group_get_gain(_groupId)
{
    _groupId = yyGetInt32(_groupId);

    const group = g_AudioGroups[_groupId];

    if (group !== undefined) 
        return group.getGain();

    return 1;
}

function audio_create_stream(_filename)
{
    var sampleData = new audioSampleData();
    sampleData.buffer = null;
    sampleData.gain = new TimeRampedParamLinear(1);
    sampleData.configGain = 1;
    sampleData.pitch = 1;
    sampleData.kind = AudioStreamType.STREAMED;
    sampleData.duration = -1; //unknown
    sampleData.groupId = 0;
    sampleData.fromFile = yyGetString(_filename);

    //append to end of audio_sampledata array (or fill in empty slots created by audio_destroy_stream)
    var index = audio_sampledata.length;
    for (var i = g_pGMFile.Sounds.length; i < audio_sampledata.length; ++i) {
        if (audio_sampledata[i] == null) {
            index = i;
            break;
        }
    }

    audio_sampledata[index] = sampleData;
    return index;
}

function audio_destroy_stream(_soundid)
{
    _soundid = yyGetInt32(_soundid);

    const pSound = audio_sampledata[_soundid];
    if (pSound != null) {
        if (pSound.fromFile !== undefined)
        {
            audio_stop_sound(_soundid);
            audio_sampledata[_soundid] = null;
        }
    }
}


function allocateBufferSound( )
{
  if(g_AudioModel!= Audio_WebAudio)
       return null;
     
  for (var i = 0; i < g_bufferSoundCount; i++)
  {
      const sound = buffer_sounds[i];
      if (sound != null && !sound.bBuffered)
      {
          const props = new AudioPlaybackProps({
            sound: BASE_BUFFER_SOUND_INDEX + i, 
            priority: 10
          });
          sound.Init(props);
          return sound;
      }
  }

  //no free sounds, create a new one
  if( g_bufferSoundCount < audio_max_playing_sounds )
  {
    const props = new AudioPlaybackProps({
        sound: BASE_BUFFER_SOUND_INDEX + g_bufferSoundCount,
        priority: 10
    });
    var newSound = new audioSound(props);
    buffer_sounds[g_bufferSoundCount] = newSound;
    newSound.handle = BASE_BUFFER_SOUND_INDEX + g_bufferSoundCount;
    ++g_bufferSoundCount;

    return newSound;
  }

  return null;
}

function endian_swap_u32(swapme)
{
    //((swapme&0xFF)<<24) | ((swapme&0xFF00)<<8) | ((swapme&0xFF0000)>>8) | ((swapme&0xFF000000)>>24);
    return swapme; 
}

function endian_swap_u16(swapme)
{
    //((swapme&0xFF)<<8) | ((swapme&0xFF00)>>8);
    return swapme;
}

function audio_create_buffer_sound(_bufferId, _bufferFormat, _sampleRate, _offset, _length, _channels)
{
    var newSound = allocateBufferSound( );
    if( newSound == null ) return -1;

    _bufferId = yyGetInt32(_bufferId);
    _bufferFormat = yyGetInt32(_bufferFormat);
    _sampleRate = yyGetInt32(_sampleRate);
    _offset = yyGetInt32(_offset);
    _length = yyGetInt32(_length);
    _channels = yyGetInt32(_channels);

    var numChannels = 1;

    if (_channels == Channels.AUDIO_CHANNELS_STEREO)
        numChannels = 2;
    else if (_channels > Channels.AUDIO_CHANNELS_3D)
    {
        debug("audio_create_buffer_sound - unhandled _channels setting : " + _channels);
        return -1;
    }

    let bitsPerSample = 8;

    if (_bufferFormat == eBuffer_S16)
        bitsPerSample = 16;
    else if (_bufferFormat != eBuffer_U8)
    {
        debug("audio_create_buffer_sound - unhandled _bufferFormat setting : " + _bufferFormat);
        return -1;
    }

    _sampleRate = Math.min(Math.max(_sampleRate, 8000), 48000);

    buffer_seek( _bufferId, eBuffer_Start, 0 );
    var bufferSize = _length;

    /* Here we prevent the Web Audio context from cleanly resampling the buffer
       to the rate of the audio context by aligning the audio buffer rate with
       that of the audio context and then crudely resampling the signal ourselves.
       This is done to emulate the resampling that happens on other platforms
       and maintain consistency of the perceived sound. */

    // Find the new/old sample rate ratio
    const sr_ratio = g_WebAudioContext.sampleRate / _sampleRate;

    // And its inverse
    const increment = 1.0 / sr_ratio;

    // Calculate the divisor needed to convert from u8/s16 to f32
    const divisor = Math.pow(2, bitsPerSample - 1);

    // Create the audio buffer
    const bufferOptions = {
        length: _length / (numChannels * bitsPerSample / 8) * sr_ratio,
        numberOfChannels: numChannels,
        sampleRate: g_WebAudioContext.sampleRate
    };

    const audioBuffer = new AudioBuffer(bufferOptions);

    // Used for counting samples using the inverse of sr_ratio
    let frac_pos = 0.0;

    for (let f = 0; f < audioBuffer.length; ++f)
    {
        for (let ch = 0; ch < audioBuffer.numberOfChannels; ++ch)
        {
            const channelData = audioBuffer.getChannelData(ch);

            if (frac_pos - 1.0 >= 0.0)
            {
                // Take a new sample from the signal
                channelData[f] = (buffer_read(_bufferId, _bufferFormat) / divisor) - 1.0;
                frac_pos -= 1.0;
            }
            else
            {
                // Copy the previous sample
                channelData[f] = channelData[f - 1];
            }

            frac_pos += increment;
        }  
    }

    var sampleData = new audioSampleData();
    sampleData.gain = new TimeRampedParamLinear(1);
    sampleData.configGain = 1.0;
    sampleData.pitch = 1.0;
    sampleData.kind = AudioStreamType.UNSTREAMED;
    sampleData.duration = bufferSize / ( _sampleRate * numChannels * bitsPerSample / 8 );
    sampleData.groupId = 0;
    sampleData.commands = [];
    sampleData.state = AudioSampleState.READY;
    sampleData.buffer = audioBuffer;

    buffer_sampledata[newSound.handle - BASE_BUFFER_SOUND_INDEX] = sampleData;

    return newSound.handle;
}

function audio_free_buffer_sound(_soundId)
{
    _soundId = yyGetInt32(_soundId);

    var bufferSoundId = _soundId - BASE_BUFFER_SOUND_INDEX;
    if( bufferSoundId <0 || bufferSoundId >= g_bufferSoundCount)
    {
        debug("sound " + _soundId + " does not appear to be a buffer sound, not freeing");
        return -1;
    }

    buffer_sounds[bufferSoundId].bBuffered = false;
    buffer_sampledata[bufferSoundId] = null;
    return 0;
}

function allocateQueueSound( )
{
    if(g_AudioModel!= Audio_WebAudio)
        return null;
     
    for (let i = 0; i < g_queueSoundCount; i++)
    {
        const sound = queue_sounds[i];
        if (sound && !sound.bQueued)
        {
            const props = new AudioPlaybackProps({
                sound: BASE_QUEUE_SOUND_INDEX + i,
                priority: 10
            });
            sound.Init(props);
            return sound;
        }
    }

    //no free sounds, create a new one
    if( g_queueSoundCount < audio_max_playing_sounds )
    {
        // look to see if we have some empty slots, if so reuse one
        var found = g_queueSoundCount;
        for (let i = 0; i < g_queueSoundCount; i++) {
            const sound = queue_sounds[i];
            if (!sound ) {
                found = i;
                break;
            }
        }

        const props = new AudioPlaybackProps({
            sound: BASE_QUEUE_SOUND_INDEX + found,
            priority: 10
        });
        var newSound = new audioSound(props);
        queue_sounds[found] = newSound;
        newSound.handle = BASE_QUEUE_SOUND_INDEX + found;
        if (found == g_queueSoundCount) ++g_queueSoundCount;

        return newSound;
    }

    return null;
}

function audio_create_play_queue(_format, _sampleRate, _channels)
{
    _format = yyGetInt32(_format);
    _sampleRate = yyGetInt32(_sampleRate);
    _channels = yyGetInt32(_channels);

    if (_channels != Channels.AUDIO_CHANNELS_MONO && _channels != Channels.AUDIO_CHANNELS_STEREO && _channels != Channels.AUDIO_CHANNELS_3D)
    {
        debug("audio_create_play_queue: channels should be audio_mono, audio_stereo or audio_3d");
        return -1;
    }
    var num_channels = 1;
    if (_channels == Channels.AUDIO_CHANNELS_STEREO) num_channels = 2;

    if (_sampleRate < 1000) _sampleRate = 1000;
    if (_sampleRate > 48000) _sampleRate = 48000;

    if (_format != eBuffer_U8 && _format != eBuffer_S16)
    {
        debug("audio_create_play_queue: unsupported format (use buffer_u8,buffer_s16)");
        return -1;
    }

    // get a queue slot
    var newSound = allocateQueueSound();
    if ( newSound == null )
    {
    	debug( "Failed to create play queue." );
    	return -1;
    }

    newSound.queueFormat = _format;
    newSound.queueSampleRate = _sampleRate;
    newSound.queueChannels = _channels;

    newSound.scriptNode = g_WebAudioContext.createScriptProcessor(DYNAMIC_BUFFER_SIZE, 0, num_channels);
    newSound.scriptNode.sourceBuffers = [];
    newSound.scriptNode.pendingSourceBufferCount = 0;
    newSound.scriptNode.currentOffset = 0;

    newSound.scriptNode.onaudioprocess = function (audioProcessingEvent)
    {
        //**************************************************************************
        //  Callback function - used to refill the buffer
        //**************************************************************************
        var outputBuffer = audioProcessingEvent.outputBuffer;
        var scriptNode = newSound.scriptNode;
        var max_channels = outputBuffer.numberOfChannels;

        // put the data from the current buffer in there
        for (var sample = 0; sample < DYNAMIC_BUFFER_SIZE; sample++)
        {
            // Do we have more buffers we can use to fill the output with?
            if (scriptNode.sourceBuffers.length > 0)
            {
                // Fill all channels (2 max just now... might do 7.1 in the future - who knows)
                for (let channel = 0; channel < max_channels; channel++)
                {
                    const outputData = outputBuffer.getChannelData(channel);
                    outputData[sample] = scriptNode.sourceBuffers[0].getChannelData(channel)[scriptNode.currentOffset];
                }
                scriptNode.currentOffset++;

                // If we've emptied one of our buffers, we need a GML callback to let the game know
                if (scriptNode.currentOffset >= scriptNode.sourceBuffers[0].length)
                {
                    // Remove this buffer from out play list
                    var old_element = scriptNode.sourceBuffers.shift();

                    // Setup audio Async event callback
                    var pFile = g_pASyncManager.Add(newSound.handle, undefined, ASYNC_AUDIO_PLAYBACK, undefined);
                    pFile.queue_id = newSound.handle;
                    pFile.buffer_id = old_element.__old_buffer_id;
                    pFile.queue_shutdown = 0;
                    pFile.m_Status = 0;
                    pFile.m_Complete = true;

                    // reset offset
                    scriptNode.currentOffset = 0;
                }
            }
            else
            {
                // Nothing left to play, so fill with zeros (quiet)
                for (let channel = 0; channel < max_channels; channel++) {
                    const outputData = outputBuffer.getChannelData(channel);
                    outputData[sample] = 0;
                }
            }
        }
    };

    // Now setup the new sound to queue
    var sampleData = new audioSampleData();
    sampleData.gain = new TimeRampedParamLinear(1);
    sampleData.configGain = 1.0;
    sampleData.pitch = 1.0;
    sampleData.kind = AudioStreamType.UNSTREAMED;
    sampleData.duration = 0.0;
    sampleData.groupId = 0;
    sampleData.commands = [];
    sampleData.state = AudioSampleState.READY;
    queue_sampledata[newSound.handle - BASE_QUEUE_SOUND_INDEX] = sampleData;

    // return the handle to the GML
    return newSound.handle;
}

function audio_queue_sound(_queueId, _bufferId, _offset, _len)
{
    _queueId = yyGetInt32(_queueId);
    _bufferId = yyGetInt32(_bufferId);
    _offset = yyGetInt32(_offset);
    _len = yyGetInt32(_len);

    var queueSoundId = _queueId - BASE_QUEUE_SOUND_INDEX;
    if( queueSoundId <0 && queueSoundId >= g_queueSoundCount)
    {
        debug("sound " + _queueId + " does not appear to be a queue sound, can't queue a sound behind it.");
        return -1;
    }

    var queueSound = queue_sounds[queueSoundId];
    if (!queueSound  ||queue_sounds[queueSoundId].bQueued == false)
    {
        debug("looks like queue sound " + _queueId + " has been freed already, not queueing behind it.");
        return -1;
    }

    //var buffered_sound_id = audio_create_buffer_sound(_bufferId, queueSound.queueFormat, queueSound.queueSampleRate, _offset, _len, queueSound.queueChannels);
    {
        var numChannels = 1;

        if (queueSound.queueChannels == Channels.AUDIO_CHANNELS_STEREO) numChannels = 2;
        else if (queueSound.queueChannels > Channels.AUDIO_CHANNELS_3D)
        {
            debug("audio_create_buffer_sound - unhandled queueSound.queueChannels setting : " + queueSound.queueChannels);
            return -1;
        }

        // get sound format - U8 or S16, amything else is an error
        var bitsPerSample = 8;
        if (queueSound.queueFormat == eBuffer_S16) bitsPerSample = 16;
        else if (queueSound.queueFormat != eBuffer_U8)
        {
            debug("audio_create_buffer_sound - unhandled queueSound.queueFormat setting : " + queueSound.queueFormat);
            return -1;
        }




        buffer_seek(_bufferId, eBuffer_End, 0);
        var bufferSize = _len;

        var wavBuffer = buffer_create(44 + bufferSize, eBuffer_Format_Fast, 1);
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(0x46464952) ); // 'RIFF'
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(36 + bufferSize) );
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(0x45564157) ); // 'WAVE' 57415645

        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(0x20746d66) ); // 'fmt ' 666d7420
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(16)); // MAGIC - 16 == PCM
        buffer_write( wavBuffer, eBuffer_U16, endian_swap_u16(1) ); // MAGIC - 1 = PCM
        buffer_write( wavBuffer, eBuffer_U16, endian_swap_u16(numChannels)  );
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(queueSound.queueSampleRate) );
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(queueSound.queueSampleRate * numChannels * bitsPerSample / 8)); // ByteRate
        buffer_write( wavBuffer, eBuffer_U16, endian_swap_u16(numChannels * bitsPerSample / 8)); // BlockAlign
        buffer_write( wavBuffer, eBuffer_U16, endian_swap_u16(bitsPerSample)); // BlockAlign

        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(0x61746164) ); // 'data'  64617461
        buffer_write( wavBuffer, eBuffer_U32, endian_swap_u32(bufferSize));
        buffer_copy(_bufferId, _offset, bufferSize, wavBuffer, 44);

        var pBuff = buffer_get_address(wavBuffer);

        queueSound.scriptNode.pendingSourceBufferCount++;

        try {
            g_WebAudioContext.decodeAudioData(pBuff,
                    function(buffer) {
                        buffer_delete(wavBuffer);
                        buffer.__old_buffer_id = _bufferId;
                        queueSound.scriptNode.sourceBuffers.push(buffer);
                        queueSound.scriptNode.pendingSourceBufferCount--;
                    },
                    function(err)
                    {
                        debug("error decoding audio data:" + err);
                        buffer_delete(wavBuffer);
                    }
            );
        } catch( ex ) {
            debug("audio_create_buffer_sound - error decoding audio data: " + ex + " -- " + ex.message );
        }
    }

    // create a buffered sound from the bufferId
    // if there's nothing left in this queue

    return -1;
}

function audio_free_play_queue(_queueId)
{
    _queueId = yyGetInt32(_queueId);

    var queueSoundId = _queueId - BASE_QUEUE_SOUND_INDEX;
    if( queueSoundId <0 || queueSoundId >= g_queueSoundCount)
    {
        debug("sound " + _queueId + " does not appear to be a queue sound, not freeing");
        return -1;
    }

    audio_stop_sound(_queueId);

    queue_sounds[queueSoundId].bQueued = false;
    queue_sounds[queueSoundId] = undefined;
    delete queue_sounds[queueSoundId];
    return 0;
}

navigator.getUserMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

function audio_get_recorder_count()
{
    if (navigator.getUserMedia)
    {
        return 1;
    }

    return 0;
}

function audio_get_recorder_info(_index)
{
    _index = yyGetInt32(_index);

    if (_index < 0 || _index > audio_get_recorder_count())
    {
        debug("audio_get_recorder_info - device " + _index + " is not available");
        return -1;
    }

    var map = ds_map_create();

    ds_map_add( map, "name", "User provided audio input");
    ds_map_add( map, "index", 0);
    ds_map_add( map, "data_format", eBuffer_S16);
    ds_map_add( map, "sample_rate", 16000);
    ds_map_add( map, "channels", 0);

    return map;
}

var gRecording = false;
var gRecorder = undefined;

function audio_start_recording(_deviceNum)
{
    var count = audio_get_recorder_count();

    if (count <= 0)
    {
        debug("audio_start_recording - not available in this browser.");
        return -1;
    }

    _deviceNum = yyGetInt32(_deviceNum);

    if (_deviceNum >= count)
    {
        debug("audio_start_recording - device " + _deviceNum + " is not available.");
        return -1;
    }

    var block_size = 4096;

    if (gRecorder === undefined)
    {
        gRecorder = g_WebAudioContext.createScriptProcessor(block_size, 1, 1);
        gRecorder.wavBuffer = buffer_create(block_size * 2, eBuffer_Format_Fast, 1);
        gRecorder.onaudioprocess = function(audioProcessingEvent) {

            var inputBuffer = audioProcessingEvent.inputBuffer;

            buffer_seek(gRecorder.wavBuffer, eBuffer_Start, 0);

            var rate_ratio = g_WebAudioContext.sampleRate / 16000;

            for (var channel = 0; channel < inputBuffer.numberOfChannels; channel++)
            {
                var inputData = inputBuffer.getChannelData(channel);

                var samples_written = 0;

                // put the data from the current buffer in there
                for (var sample = 0; sample < block_size; sample += rate_ratio)
                {
                    buffer_write(gRecorder.wavBuffer, eBuffer_S16, Math.round(inputData[Math.floor(sample)] * 32767));
                    ++samples_written;
                }

                if (gRecording)
                {
                    var map = ds_map_create();
                    g_pBuiltIn.async_load = map;
                    ds_map_add(map, "buffer_id", gRecorder.wavBuffer );
                    ds_map_add(map, "channel_index", 0);
                    ds_map_add(map, "data_len", samples_written * 2 );
                    g_pObjectManager.ThrowEvent(EVENT_OTHER_AUDIO_RECORDING,0);   
                }
            }
        };

        var constraints = { "audio":true };
        navigator.getUserMedia(
                // constraints - we're just after audio ta
                constraints,
                // success callback
                function(stream)
                {
                    var source = g_WebAudioContext.createMediaStreamSource(stream);
                    source.connect(gRecorder);
                    var gainNode = g_WebAudioContext.createGain();
                    gRecorder.connect(gainNode);
                    gainNode.connect(g_WebAudioContext.destination);
                },
                // failure callback
                function(err)
                {
                    debug("audio_start_recording : error has occured in getUserMedia call " + err);
                }
                );
    }

    gRecording = true;

    return 0;
}

function audio_stop_recording(_deviceNum)
{
    gRecording = false;
}

function audio_bus_create()
{
    const busType = g_UseDummyAudioBus ? DummyAudioBus : AudioBus;

    const bus = new busType();
    g_AudioBusMain.connectInput(bus.outputNode);

    return bus;
}

function audio_effect_create(_type, _params)
{
    if (_params && typeof _params !== "object")
        yyError("Error: Audio effect parameters must be a struct");

    return AudioEffectStruct.Create(_type, _params);
}

function audio_emitter_bus(_emitterIdx, _bus)
{
    const emitter = audio_emitters[yyGetInt32(_emitterIdx)];

    if (emitter === undefined)
        return;

    const busType = g_UseDummyAudioBus ? DummyAudioBus : AudioBus;

    if (!(_bus instanceof busType))
        yyError("audio_emitter_bus() - argument 'bus' should be a Struct.AudioBus");

    emitter.gainnode.disconnect();
    _bus.connectInput(emitter.gainnode);
    emitter.bus = _bus;
}

function audio_emitter_get_bus(_emitterIdx)
{
    const emitter = audio_emitters[yyGetInt32(_emitterIdx)];

    if (emitter === undefined)
        return undefined;

    return emitter.bus;
}

function audio_bus_get_emitters(_bus)
{
    const busType = g_UseDummyAudioBus ? DummyAudioBus : AudioBus;

    if (!(_bus instanceof busType))
        yyError("audio_bus_get_emitters() - argument 'bus' should be a Struct.AudioBus");

    const emitterIds = [];

    for (const id in audio_emitters) {
        if (audio_emitters[id].bus === _bus)
            emitterIds.push(Number(id));
    }

    return emitterIds;
}
