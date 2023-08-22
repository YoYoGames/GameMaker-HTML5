
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yySound.js
// Created:         24/02/2011
// Author:          Mike
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 24/02/2011		
// 
// **********************************************************************************************************************


var g_RawSounds = [];

// #############################################################################################
/// Function:<summary>
///             
///          </summary>
///
/// In:		 <param name="_pSnd"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function    Sound_SetOurFunction( _pSnd )
{
}

function canPlayAudioMP3(callback)
{
	try {
		var audio = new Audio();
		//Shortcut which doesn't work in Chrome (always returns ""); pass through
		// if "maybe" to do asynchronous check by loading MP3 data: URI
		if(audio.canPlayType('audio/mpeg') == "probably")
			callback(true);

		//If this event fires, then MP3s can be played
		audio.addEventListener('canplaythrough', function(e){
			callback(true);
		}, false);

		//If this is fired, then client can't play MP3s
		audio.addEventListener('error', function(e){
			callback(false, this.error);
		}, false);

		//Smallest base64-encoded MP3 I could come up with (<0.000001 seconds long)
		audio.src = "data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
		audio.load();
	}
	catch(e){
		callback(false, e);
	}
}

// @if feature("audio")
// #############################################################################################
/// Function:<summary>
///             Initialise a Sound from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
/** @constructor */
function yySound() {
    this.__type = "[sound]";
    this.pName = "";
	this.kind = 0;
	this.extension = "";
	this.origName = "";
	this.effects = 0;
	this.volume = 1;
	this.pan = 0;
	this.preload = true;
	this.sysVolume = 1.0;
	this.soundindex = 0;
	this.pSoundFiles = [];
}

// #############################################################################################
/// Function:<summary>
///             Initialise a Sound from storage
///          </summary>
///
/// In:		 <param name="_pStorage"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
yySound.prototype.LoadFromStorage = function (_pStorage) {

	this.pName = _pStorage.pName;                           // "pName": "xDrop",
	this.kind = _pStorage.kind;                             // "kind": 0,
	this.extension = _pStorage.extension;                   // "extension": ".wav",
	this.origName = _pStorage.origName;                    // "origName": "DropOne.wav",
	this.effects = _pStorage.effects;                       // "effects": 0,
	this.volume = _pStorage.volume;                         // "volume": 1,
	this.pan = _pStorage.pan;                               // "pan": 0,
	this.preload = _pStorage.preload;                       // "preload": true,
	this.sysVolume = this.volume;   //FIX #0005440: Altering sound volume via resource editor - set initial volume to slider value

	// Load sound
	this.AddSound(this.pName);

};


// #############################################################################################
/// Property: <summary>
///           	Add the raw sound "pool"
///           </summary>
// #############################################################################################
yySound.prototype.AddSound = function (_snd) {	
	
	this.soundindex = 0;
	this.pSoundFiles = [];

	var rawSound = g_RawSounds[this.pName];
	if (rawSound)
	{
		// AB: Replaced browser type check with a direct check of whether the clone function exists for consistency
		if(MAX_SOUNDS > 1 && typeof rawSound.cloneNode === "function")
		{
			for (var i = 0; i < MAX_SOUNDS; i++)
				this.pSoundFiles[i] = rawSound.cloneNode( true );
		}
		else
		{
			// If this browser can't clone sound nodes, reduce MAX_SOUNDS to 1 and use the original copy
			MAX_SOUNDS = 1;
			this.pSoundFiles[0] = rawSound;
		}
	}	
};


// #############################################################################################
/// Function:<summary>
///             Add a RAW sound to the pool
///          </summary>
///
/// In:		 <param name="_filename">URL to load from</param>
///			 <param name="_id"></param>
///			 <param name="_ext"></param>
///			 <param name="_onload"></param>
///			 <param name="_onerror"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
var qt_needed_warning = false;
function SoundManager_AddRawSound(_url, _id, _ext, _onload, _onerror) 
{
	_url = CheckWorkingDirectory(_url);
	if (AUDIO_ON == false)
	{
		return undefined;
	}

    var load_via_AUDIO = false;
    var pName = _url;
    var ext;
    var index;
    index = _url.indexOf(_ext);
    if( index>0 ){
        _url = _url.substr(0,index);
    }
    
    //if( _ext == ".wav"){ }

	// See what format the browser can play, and use that. Prefer ogg....
    if (g_canPlayOgg)
    {
    	_ext = "ogg";
    } else if (g_canPlayMp3)
    {
    	_ext = "mp3";
    } else {
		// Else... we'll "try" and use ogg anyway.
    	_ext = "ogg";
    }
    load_via_AUDIO = true;



	// <script type="text/javascript"> var g_GameMakerHTML5Dir = "http://www.yoyogames.com/demos/tntbf/html5game/"; </script>
    // Load this sound via HTML5 "audio" tag?
    if( load_via_AUDIO )
    {
    	// Get the full filename again.
        _url = _url + "." + _ext;
        try {
            var snd = new Audio();
            snd.URL = _url;
            snd.sysVolume = 1.0;
            snd.autobuffer = true;
            if (typeof snd.loop == 'boolean') snd.loop = false;
            snd.preload = 'auto';
            snd.DoingLoading = false; 		// our "loading" flag.
            snd.SoundPlaying = false;


            // Create a "source" element so we can specify the mime type.
            var pSrc = document.createElement('source');
            pSrc.setAttribute("src", _url);
            if (_ext == "ogg") {
                pSrc.setAttribute("type", 'audio/ogg');
                pSrc.setAttribute("codecs", 'vorbis');
            } else {
                pSrc.setAttribute("type", 'audio/mpeg');
            }
            snd.setAttribute("networkState", 0);
            snd.insertBefore(pSrc, null);
            document.body.appendChild(snd);
            g_RawSounds[pName] = snd;

            snd.addEventListener('canplaythrough', _onload, false);
            snd.addEventListener('error', _onerror, false);
            snd.addEventListener("loadstart", LoadGame_SoundLoad_Loading, false);
            snd.addEventListener("suspend", LoadGame_SoundLoad_Suspended, false);
            snd.addEventListener("stalled", LoadGame_SoundLoad_Stalled, false);
            snd.addEventListener("stall", LoadGame_SoundLoad_Stalled, false);

            snd.load();
        } 
        catch (e) {
            //...
            if (g_OSBrowser == BROWSER_SAFARI && qt_needed_warning==false) {
                var nav = navigator;

                qt_needed_warning = true;
                var WinIndex = nav.userAgent.indexOf("Windows");

                if (WinIndex != -1) {
                    alert("Audio Error: Please ensure that quicktime is installed");
                }
            }
        }
	}
    return _id;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Sound manager
///          </summary>
// #############################################################################################
/** @constructor */
function    yySoundManager( )
{
    this.Sounds = [];
    this.length = 0;
}


// #############################################################################################
/// Function:<summary>
///             Delete a sound from the list
///          </summary>
///
/// In:		 <param name="_index">Sound to delete</param>
// #############################################################################################
yySoundManager.prototype.Delete = function (_index) {
	if(this.Sounds[_index])
	{
		this.Stop(_index);
		this.Sounds[_index] = undefined;
	}
};

/** @this {yySound} */
function Sound_Ended_Callback()
{
    this.SoundPlaying = false;
}

// #############################################################################################
/// Function:<summary>
///             Each sound file is cloned several times to allow for multiple plays of the same
///             file, so when it comes to playing a sound we wish to find an available slot
///          </summary>
// #############################################################################################
yySoundManager.prototype.GetSoundFileSlot = function (_index) {
    	
    try {
        var pSoundFile = this.Sounds[_index];
	    if (!pSoundFile) return null;
    
	    var pSoundFileSlot = pSoundFile.pSoundFiles[this.Sounds[_index].soundindex];
	   
	    this.Sounds[_index].soundindex++;
	    if (this.Sounds[_index].soundindex >= MAX_SOUNDS) { 
	        this.Sounds[_index].soundindex = 0;
	    }
	   
	    return pSoundFileSlot;
	}
	catch(e) {
	    debug("Sound buffer unavailable for sound: " + _index);
	}
	return null;
};

// #############################################################################################
/// Function:<summary>
///             Play a sound
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.Play = function(_index) {

    //var thissound=document.getElementById(Sounds[_index].origName);

    var pSoundFile = this.GetSoundFileSlot(_index);
    if (pSoundFile != null) {
        try {

           
            if (pSoundFile.SoundPlaying)
                return;
            var buffered = pSoundFile.buffered;

            var ranges = pSoundFile.buffered.length;
            var i;
            for (i = 0; i < ranges; i++) {
                var start = pSoundFile.buffered.start(i);
                var end = pSoundFile.buffered.end(i);
                //console.log("sound buffer " + i + " starts " + start + " ends " + end + " SoundPlaying " + pSoundFile.SoundPlaying);
            }

            pSoundFile.removeEventListener('ended', Repeat_Sound_Callback, false);
            pSoundFile.removeEventListener('ended', Sound_Ended_Callback, false);
            if (typeof pSoundFile.loop == 'boolean') {
                pSoundFile.loop = false;
            }

            try {
                if (pSoundFile.currentTime != 0) {
                    pSoundFile.currentTime = 0;
                }
            } catch (ex) {
                if (g_VerboseOutput) debug("Error setting current sound time: " + this.Sounds[_index].pName);
            }
            pSoundFile.volume = this.Sounds[_index].sysVolume * g_GlobalVolume;

            pSoundFile.addEventListener('ended', Sound_Ended_Callback, false);
            pSoundFile.SoundPlaying = true;
            pSoundFile.play();
        } catch (ex) {
            if (g_VerboseOutput) debug("Error playing sound: " + this.Sounds[_index].pName);
        }
    }
};



// #############################################################################################
/// Function:<summary>
///             Stop a sound of a specific type
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.Stop = function (_type) {
	//with (this)
	{
		var pSounds = this.Sounds[_type];
		if (!pSounds) return;

		pSounds = pSounds.pSoundFiles;
		for (var i = 0; i < pSounds.length; i++)
		{
			var pSoundFile = pSounds[i];
			if (pSoundFile != null)
			{
				try
				{
					pSoundFile.pause();
        			pSoundFile.SoundPlaying = false;
				} catch (ex)
				{
					if( g_VerboseOutput ) debug("Error stopping sound: " + this.Sounds[_type].pName);
				}
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Stop a sound of a specific type
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.StopAll = function () {

	// loop through all sounds.	
	for (var snds = 0; snds < this.Sounds.length; snds++)
	{
	    if (this.Sounds[snds])
	    {
		    var pSounds = this.Sounds[snds].pSoundFiles;

		    for (var i = 0; i < pSounds.length; i++)
		    {
		    	var pSoundFile = pSounds[i];
		    	if (pSoundFile != null)
		    	{
		    		try
		    		{
		    			pSoundFile.pause();
        			    pSoundFile.SoundPlaying = false;
		    		} 
		    		catch (ex)
		    		{
		    			if( g_VerboseOutput ) debug("Error stopping sound: " + pSoundFile.pName);
		    		}
		    	}
		    }
		}
	}	
};

// #############################################################################################
/// Function:<summary>
///             Stop a sound of a specific type
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.SetGlobalVolume = function (_volume) {

	g_GlobalVolume = _volume;

	// loop through all sounds and adjust their volume accordingly	
	for (var snds = 0; snds < this.Sounds.length; snds++)
	{
		if (this.Sounds[snds])
		{
			var pSounds = this.Sounds[snds].pSoundFiles;
            
			for (var i = 0; i < pSounds.length; i++)
			{
				var pSoundFile = pSounds[i];
				if (pSoundFile != null)
				{
					try
					{
						pSoundFile.volume = pSoundFile.sysVolume * g_GlobalVolume;
					}
					catch (ex)
					{
						if( g_VerboseOutput ) debug("Error setting volume: " + this.Sounds[snds].pName);
					}
				}
			}
		}
	}
};




// #############################################################################################
/// Function:<summary>
///             Callback for Firefox sound loop issue.
///          </summary>
// #############################################################################################
/** @this {yySound} */
function Repeat_Sound_Callback()
{
    try
    {
        this.currentTime = 0;
    } catch (ex)
    {
        if (g_VerboseOutput) debug("Error in Repeat_Sound_Callback: " + ex.message);
    }                            
    this.play();
}

// #############################################################################################
/// Function:<summary>
///             Loop a sound of a specific type
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.Loop = function (_index) {

	var pSoundFile = this.GetSoundFileSlot(_index);	
	if (pSoundFile != null)
	{
		try
		{			    
			if (typeof pSoundFile.loop == 'boolean')
            {
                pSoundFile.loop = true;
            }
            else
            {
                pSoundFile.removeEventListener('ended', Repeat_Sound_Callback, false);
                pSoundFile.removeEventListener('ended', Sound_Ended_Callback, false);
            
                pSoundFile.addEventListener('ended', Repeat_Sound_Callback, false);
                pSoundFile.onended = null;
            }                
            
		    try {
			    if (pSoundFile.currentTime != 0){
				    pSoundFile.currentTime = 0;
			    }
		    } 
		    catch (ex) {
			    if( g_VerboseOutput ) {
			        debug("Error setting current sound time: " + this.Sounds[_index].pName);
			    }
		    }
            
            pSoundFile.volume = this.Sounds[_index].sysVolume * g_GlobalVolume;
            pSoundFile.SoundPlaying = true;
            pSoundFile.play();            
		} 
		catch (ex) {
			if( g_VerboseOutput ) {
			    debug("Error looping sound: " + this.Sounds[_index].pName);
			}
		}		
	}
};


// #############################################################################################
/// Function:<summary>
///             Set the volume for the sound type
///          </summary>
///
/// In:		 <param name="_type">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.Volume = function (_type, _vol) {
	
	
	var pSounds = this.Sounds[_type];
	if (!pSounds) return;

	pSounds = pSounds.pSoundFiles;
	for (var i = 0; i < pSounds.length; i++)
	{
		var pSoundFile = pSounds[i];
		if (pSoundFile != null)
		{
			try
			{
				this.Sounds[_type].sysVolume = _vol;
				pSoundFile.volume = _vol * g_GlobalVolume;
			} catch (ex)
			{
				if( g_VerboseOutput ) debug("Error volume: " + this.Sounds[_type].pName);
			}
		}
	}
	
};

// #############################################################################################
/// Function:<summary>
///             Set the volume for the sound index over a given time (in milliseconds)
///          </summary>
///
/// In:		 <param name="_type">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.VolumeOverTime = function(_index, _vol, _time) {

    var pSound = this.Sounds[_index];
    if (!pSound) return;

    var pSounds = pSound.pSoundFiles;
    for (var i = 0; i < pSounds.length; i++) {
      
        var pSoundFile = pSounds[i];
        if (pSoundFile != null && pSoundFile.SoundPlaying) {
            try {
                // Uses setTimeout to call back to us every {interval}ms whereupon we can update the sound volume until we've reached the final volume			    
                var interval = 50;
                var startVolume = pSound.sysVolume;
                var targetVolume = _vol;
                var volumeStep = Math.abs(startVolume - targetVolume) / (_time / interval);

                function doFade(sf) {
                    setTimeout(function() {

                        var newVolume;

                        if ((startVolume < targetVolume) && (pSoundFile.volume < targetVolume)) {
                            newVolume = pSound.sysVolume + volumeStep;
                        }
                        else if ((startVolume > targetVolume) && (pSoundFile.volume > targetVolume)) {
                            newVolume = pSound.sysVolume - volumeStep;
                        }
                        else {
                            return;
                        }

                        if (newVolume < 0) { newVolume = 0; }
                        if (newVolume > 1) { newVolume = 1; }
                       
                        pSound.sysVolume = newVolume;
                        sf.volume = newVolume * g_GlobalVolume;
                        doFade(sf);

                    }, interval);
                }
                doFade(pSoundFile);
            }
            catch (ex) {
                if (g_VerboseOutput) debug("Error volume: " + pSound.pName);
            }
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Stop a sound of a specific type
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
// #############################################################################################
yySoundManager.prototype.SoundIsPlaying = function (_type) {
	
		var pSounds = this.Sounds[_type];
		if (!pSounds) return;

		pSounds = pSounds.pSoundFiles;
		var playing = false;		
		for (var i = 0; i < pSounds.length; i++)
		{
			var pSoundFile = pSounds[i];
			if (pSoundFile != null)
			{
				try
				{
				    if( pSoundFile.SoundPlaying )
					//if (!(pSoundFile.ened == true || pSoundFile.paused == true))
					{
						playing = true;
						break;
					}
				} catch (ex)
				{
					if (g_VerboseOutput) debug("Error checking play state: " + this.Sounds[_type].pName);
				}
			}
		}
		return playing;
	
};


// #############################################################################################
/// Function:<summary>
///             Get a Sound from the manager
///          </summary>
///
/// In:		 <param name="_indexe">Sound to retrieve</param>
// #############################################################################################
yySoundManager.prototype.Get = function (_index) {
    if (_index < 0 || _index >= this.Sounds.length) return null;
	return this.Sounds[_index];
};



// #############################################################################################
/// Function:<summary>
///             Add a new Sound image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Sound image Storage</param>
// #############################################################################################
yySoundManager.prototype.Clear = function () {
	this.Sounds = [];
	this.Sounds.length = 0;
};


// #############################################################################################
/// Function:<summary>
///             Add a new Sound image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Sound image Storage</param>
// #############################################################################################
yySoundManager.prototype.Add = function (_pStorage) {
	
		var pBack = null;
		if (_pStorage != null)
		{
			pBack = new yySound();
			pBack.LoadFromStorage(_pStorage);
		}
		this.Sounds[this.Sounds.length] = pBack;
	
};



// #############################################################################################
/// Function:<summary>
///             Add a new Sound image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Sound image Storage</param>
// #############################################################################################
yySoundManager.prototype.Create = function () {
	var pSnd = new yySound();
	this.Sounds[this.Sounds.length] = pSnd;
	return this.Sounds.length - 1;
};
// @endif audio
