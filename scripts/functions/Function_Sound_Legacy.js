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

// #############################################################################################
/// Function:<summary>
///             Plays the indicates sound once. If the sound is background music the 
///             current background music is stopped.
///          </summary>
///
/// In:		 <param name="_index">Sound to play</param>
///
// #############################################################################################
function    sound_play( _index )
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
    g_pSoundManager.Play( _index );
}


// #############################################################################################
/// Function:<summary>
///             Plays the indicates sound, looping continuously. If the sound is background 
///             music the current background music is stopped.
///          </summary>
///
/// In:		 <param name="_index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_loop(_index) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
    g_pSoundManager.Loop( _index );
}


// #############################################################################################
/// Function:<summary>
///             Stops the indicates sound. If there are multiple sounds with this index playing 
///             simultaneously, all will be stopped.
///          </summary>
///
/// In:		 <param name="_index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_stop(_index) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
    g_pSoundManager.Stop(_index);
}


// #############################################################################################
/// Function:<summary>
///             Stops all sounds.
///          </summary>
// #############################################################################################
function sound_stop_all() 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
	g_pSoundManager.StopAll();
}


// #############################################################################################
/// Function:<summary>
///             Returns whether (a copy of) the indicated sound is playing. 
///
///             Note that this functions returns true when the sound actually plays through the 
///             speakers. After you call the function to play a sound it does not immediately 
///             reach the speakers so the function might still return false for a while. 
///             Similar, when the sound is stopped you still hear it for a while 
///             (e.g. because of echo) and the function will still return true.
///          </summary>
///
/// In:		 <param name="_index"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_isplaying(_index) 
{
    if(g_AudioModel!=Audio_Sound)
        return false;

	return g_pSoundManager.SoundIsPlaying(_index);
}


// #############################################################################################
/// Function:<summary>
///             Changes the volume for the indicated sound (0 = low, 1 = high).
///          </summary>
///
/// In:		 <param name="_index"></param>
///			 <param name="_value"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_volume(_index,_value) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
    g_pSoundManager.Volume( _index, _value );
}


// #############################################################################################
/// Function:<summary>
///             Changes the global volume for all sounds (0 = low, 1 = high).
///          </summary>
///
/// In:		 <param name="_value"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_global_volume(_value) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
	g_pSoundManager.SetGlobalVolume(_value);	
}


// #############################################################################################
/// Function:<summary>
///             Changes the volume for the indicated sound to the new value(0 = low, 1 = high)
///             during the indicated time (in milliseconds). This can be used to fade out or fade in music.
///          </summary>
///
/// In:		 <param name="index"></param>
///			 <param name="value"></param>
///			 <param name="time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function sound_fade(_index,_value,_time) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
    g_pSoundManager.VolumeOverTime(Round(_index), _value, Round(_time));
}



// #############################################################################################
/// Function:<summary>
///          	Does the sound exist?
///          </summary>
///
/// In:		<param name="_id">ID of sound</param>
/// Out:	<returns>
///				true for yes, false for no.
///			</returns>
// #############################################################################################
function    sound_exists(_id)
{
    if(g_AudioModel!=Audio_Sound)
        return false;
        
    if( g_pSoundManager.Get(_id) === null ) return false;
    return true;
}


// #############################################################################################
/// Function:<summary>
///             Plays the indicates sound once. If the sound is background music the 
///             current background music is stopped.
///          </summary>
///
/// In:		 <param name="_resource_index">Sound to play</param>
///
// #############################################################################################
function sound_get_kind(_resource_index) 
{
    if(g_AudioModel!=Audio_Sound)
        return -1;
        
	var pSound = g_pSoundManager.Get(_resource_index);
	if (pSound === null) return -1;
	return pSound.kind;
}

// #############################################################################################
/// Function:<summary>
///          	
///          </summary>
///
/// In:		<param name="_id"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function    sound_get_name(_id)
{
    if(g_AudioModel!=Audio_Sound)
        return "";
        
    var pSound = g_pSoundManager.Get(_id);
    if( pSound===null) return "";
    return pSound.pName;
}

function    sound_name(_id)
{ 
    if(g_AudioModel!=Audio_Sound)
        return "";
        
    return sound_get_name(_id); 
}


// #############################################################################################
/// Function:<summary>
///          	Adds a sound resource to the game. fname is the name of the sound file
///          </summary>
///
/// In:		<param name="_fname"></param>
///			<param name="_kind">ignored</param>
///			<param name="_preload">ignored</param>
/// Out:	<returns>
///				ID of sound, -1 for error
///			</returns>
// #############################################################################################
function    sound_add(_fname,_kind,_preload) {

	_fname = CheckWorkingDirectory(_fname);
	if (g_AudioModel!=Audio_Sound)
        return;

	var ext = filename_ext(_fname);
    if (_fname.substring(0, 5) == "file:") return -1;
    var pFileName = ext;//_filename; Fritz - not sure about this but _filename doesn't exist


	SoundManager_AddRawSound(pFileName, _fname, ext, ASync_ImageLoad_Callback, ASync_ImageLoad_Error_Callback);

	var newindex = g_pSoundManager.Create();
	var pSnd = g_pSoundManager.Get(newindex);
	pSnd.pName = _fname;
	pSnd.extension = ext;
	pSnd.origName = _fname;

	// add loading file to ASync manager
	g_pASyncManager.Add( newindex, _fname, ASYNC_SOUND, g_RawSounds[_fname]);
	return newindex;
}


// #############################################################################################
/// Function:<summary>
///          	 Same as the sound_add() but this time a new sound is not created but the existing 
///             sound index is replaced, freeing the old sound. Returns whether correct.
///          </summary>
///
/// In:		<param name="_index">sound ID to replace</param>
///			<param name="_fname">name of file to use</param>
///			<param name="_kind">ignored</param>
///			<param name="_preload">ignored</param>
/// Out:	<returns>
///				true for done, false for error
///			</returns>
// #############################################################################################
function    sound_replace(_index,_fname,_kind,_preload)
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
	sound_stop(_index);

	var ext = filename_ext(_fname);

    if (_fname.substring(0, 5) == "file:") return -1;
    var pFileName = ext;//_filename; Fritz - not sure about this but _filename doesn't exist


	SoundManager_AddRawSound(pFileName, _fname, ext, ASync_ImageLoad_Callback, ASync_ImageLoad_Error_Callback);

	var pSnd = g_pSoundManager.Get(_index);

	// free original music;
	g_RawSounds[pSnd.pName] = undefined;
	pSnd.pSoundFiles = [];

	pSnd.pName = _fname;
	pSnd.extension = ext;
	pSnd.origName = _fname;

	// add loading file to ASync manager
	g_pASyncManager.Add( _index, _fname, ASYNC_SOUND, g_RawSounds[pSnd.pName] );
	return _index;
}

// #############################################################################################
/// Function:<summary>
///          	Deletes the indicated sound, freeing all memory associated with it. 
///          </summary>
///
/// In:		<param name="_index">Sound index</param>
///				
// #############################################################################################
function    sound_delete(_index) 
{
    if(g_AudioModel!=Audio_Sound)
        return;
        
	g_pSoundManager.Delete(_index);
}


