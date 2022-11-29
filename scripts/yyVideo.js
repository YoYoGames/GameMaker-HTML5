// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyVideo.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

var g_VideoUserEnded = false; //For some reason I can't figure this from the video player...

function video_get_format() {
    var video_format_rgba = 0;
    var video_format_yuv = 1;

    return video_format_rgba; //"RGBA"
}







function video_open(path)
{
    g_VideoUserEnded = false;

    var gameCanvas = document.querySelector("canvas");


    if (gameCanvas.yyvideoplayer == null) {
        gameCanvas.yyvideoplayer = document.createElement('video');
    }
    else {
        gameCanvas.yyvideoplayer.pause();
    }



    const myVideo = gameCanvas.yyvideoplayer;

    var srcpath =CheckWorkingDirectory(path); 

    var playing = false;
    var timeupdate = false;

    myVideo.muted = false;
    myVideo.src = srcpath;

    myVideo.addEventListener('ended', function () {
        var map = ds_map_create();

        ds_map_add(map, "type", "video_end");

        g_pBuiltIn.async_load = map;
        g_pObjectManager.ThrowEvent(EVENT_OTHER_SOCIAL, 0);
        ds_map_destroy(map);
    });

    function add_unmute_listener() {

        //Parts nicked from  function Audio_WebAudioContextTryUnlock() 

        var eventTypeStart = "mousedown";
        var eventTypeEnd = "mouseup";
        if ("ontouchstart" in window) {
            eventTypeStart = "touchstart";
            eventTypeEnd = "touchend";
        }
        if ((window.PointerEvent) || (window.navigator.pointerEnabled) || (window.navigator.msPointerEnabled)) {
            eventTypeStart = "pointerdown";
            eventTypeEnd = "pointerup";
        } // end if


        // Set up context unlock events
        var unmuteVideo = function () {
            var gameCanvas = document.querySelector("canvas");
            const myVideo = gameCanvas.yyvideoplayer;
            if (myVideo != null)
                myVideo.muted = false;
        };

        document.body.addEventListener(eventTypeStart, unmuteVideo, { once: true });
        document.body.addEventListener(eventTypeEnd, unmuteVideo, { once: true });

    }

    
    if (myVideo.requestVideoFrameCallback === undefined) { //urgh can't use nice fast playback
        console.log("requestVideoFrameCallback not supported by browser, video playback likely to be poor");
        myVideo.addEventListener('playing', function () {
            playing = true;
            console.log("Video playing event called");
            checkReady();

            var map = ds_map_create();

            ds_map_add(map, "type", "video_start");

            g_pBuiltIn.async_load = map;
            g_pObjectManager.ThrowEvent(EVENT_OTHER_SOCIAL, 0);
            ds_map_destroy(map);

        }, true);
        myVideo.addEventListener('timeupdate', function () {
            timeupdate = true;
            checkReady();
        }, true);

        myVideo.load();

        var promise = myVideo.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
                debug("video_open failed. User must interact with the page before video with audio can be played. Attempting to play the video muted");

                myVideo.muted = true;
                myVideo.play();
                add_unmute_listener();
            });
        }



        function checkReady() {
            if (playing && timeupdate) {

                if (gameCanvas.videoCanvas == null) {
                    gameCanvas.videoCanvas = document.createElement('canvas');
                    gameCanvas.videoCanvas.style.cssText = "position:fixed; top:1px; left:1px; width:1px; height:1px";
                    gameCanvas.videoCanvas.width = myVideo.videoWidth;
                    gameCanvas.videoCanvas.height = myVideo.videoHeight;
                    document.body.appendChild(gameCanvas.videoCanvas);

                    gameCanvas.videoContext = gameCanvas.videoCanvas.getContext('2d', { alpha: false, desynchronized: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
                }
                else {
                    gameCanvas.videoCanvas.width = myVideo.videoWidth;
                    gameCanvas.videoCanvas.height = myVideo.videoHeight;
                }

                gameCanvas.videoContext.drawImage(gameCanvas.yyvideoplayer, 0, 0);
            }
        }
    }
    else {
        myVideo.addEventListener('playing', function () {
            playing = true;
            console.log("Video playing event called");

            var map = ds_map_create();

            ds_map_add(map, "type", "video_start");

            g_pBuiltIn.async_load = map;
            g_pObjectManager.ThrowEvent(EVENT_OTHER_SOCIAL, 0);
            ds_map_destroy(map);

        }, true);
        const onVideoFrameUpdate = (now, metadata) => {

            if (gameCanvas.videoCanvas == null) {
                gameCanvas.videoCanvas = document.createElement('canvas');
                gameCanvas.videoCanvas.style.cssText = "position:fixed; top:1px; left:1px; width:1px; height:1px";
                gameCanvas.videoCanvas.width = myVideo.videoWidth;
                gameCanvas.videoCanvas.height = myVideo.videoHeight;
                document.body.appendChild(gameCanvas.videoCanvas);

                gameCanvas.videoContext = gameCanvas.videoCanvas.getContext('2d', { alpha: false, desynchronized: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });

                //console.log("video.width:" + myVideo.videoWidth + " height:"+ myVideo.videoHeight);
            }
            else {
                gameCanvas.videoCanvas.width = myVideo.videoWidth;
                gameCanvas.videoCanvas.height = myVideo.videoHeight;
            }

            if ((gameCanvas.yyvideoplayer != null) && (gameCanvas.videoContext != null))
                gameCanvas.videoContext.drawImage(gameCanvas.yyvideoplayer, 0, 0);

            if (gameCanvas.yyvideoplayer != null) {
                if (gameCanvas.yyvideoplayer.src != null)
                    gameCanvas.yyvideoplayer.requestVideoFrameCallback(onVideoFrameUpdate);
                else
                    console.log("stopping video player callback check");
            }
        };
        myVideo.requestVideoFrameCallback(onVideoFrameUpdate);
        myVideo.load();

        var promise = myVideo.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
                debug("video_open failed. User must interact with the page before video with audio can be played. Attempting to play the video muted");

                myVideo.muted = true;
                myVideo.play();
                add_unmute_listener();
            });
        }



       
    }

}

function video_close()
{
    g_VideoUserEnded = true;
    var gameCanvas = document.querySelector("canvas");

    //	if (gameCanvas.videoCanvas != null)
    //	{
    //		document.body.removeChild(gameCanvas.videoCanvas);
    //		gameCanvas.videoCanvas = null;
    //		gameCanvas.videoContext = null;

    //	}

    if (gameCanvas.yyvideoplayer != null) {
        gameCanvas.yyvideoplayer.pause();
        console.log("Pausing video player");
        gameCanvas.yyvideoplayer.removeAttribute('src'); // empty source
        gameCanvas.yyvideoplayer.load();
    }

}

function YYVideoStatus()
{

    if (g_VideoUserEnded)
        return -1;

    
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null)
    {
        if (gameCanvas.yyvideoplayer.paused)
            return -1; //do we have an enum?


        if (!gameCanvas.yyvideoplayer.ended)
            return 0;
    }
    return -1;
}
var VideoPlayer_surface = -4;
var VideoPlayer_buffer = -4;
var VideoPlayer_w = -4;
var VideoPlayer_h = -4;
//extern IBuffer** g_Buffers;

function YYVideoDraw(pBuffDest, width,height)
{
    //char* ptr = (char*)pointer;
    //rel_csol.Output("Video draw %p %d %d\n", pointer,width,height);
   
	var gameCanvas = document.querySelector("canvas");
		
    if (gameCanvas.videoContext != null)
    {
        var img1 = gameCanvas.videoContext.getImageData(0, 0, width, height);
        

        var srcbytebuff = new Uint8Array(img1.data.buffer);

        //		console.log("array[0]=" + arr[0] + "array[1]=" + arr[1]);
        var dstbytebuff = new Uint8Array(pBuffDest.m_pRAWUnderlyingBuffer);
        var _src_mem_size = srcbytebuff.byteLength;
        if(dstbytebuff.byteLength>=_src_mem_size)
        {

            var i;
              
            for (i = 0; i < _src_mem_size; i++) {
                dstbytebuff[ i] = srcbytebuff[i];
            }
            pBuffDest.yyb_UpdateUsedSize(_src_mem_size);
        }
        else
            return 0;


        return 1;
    }
    else
        console.log("Not rendering video as context is null");


    return 0;
}

function YYVideoW() {

    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null)
        return gameCanvas.yyvideoplayer.videoWidth;
    return 0;
}
function YYVideoH()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null)
        return gameCanvas.yyvideoplayer.videoHeight;
    return 0;
}
function video_draw()
{

    if (YYVideoStatus() != 0)
    {
        if (surface_exists(VideoPlayer_surface))
            surface_free(VideoPlayer_surface, true);

        VideoPlayer_surface = -1;

        if (VideoPlayer_buffer >= 0)
        {
            buffer_delete(VideoPlayer_buffer);
        }

        VideoPlayer_buffer = -1;
        VideoPlayer_w = -1;
        VideoPlayer_h = -1;

        var ret = [];
        ret[0] = YYVideoStatus();
        ret[1] = -1;
        ret[2] = -1;
        return ret;
        
		
    }
    else
    {
        if (!surface_exists(VideoPlayer_surface))
        {
            VideoPlayer_w = 1;
            VideoPlayer_h = 1;

            VideoPlayer_surface = surface_create(1, 1);
            //dbg_csol.Output("Surface Created!!! %d", (int)VideoPlayer_surface);
			
            if (VideoPlayer_buffer >= 0 )
            {
                //buffer_delete(VideoPlayer_buffer);
                buffer_delete(VideoPlayer_buffer);
            }

            VideoPlayer_buffer = buffer_create(1*1*4, eBuffer_Format_Fixed, 1);
            //dbg_csol.Output("CreateBuffer!!! %d", VideoPlayer_buffer);
        }

        if (YYVideoW() != 0 && YYVideoH() != 0)
        {
            if (VideoPlayer_w != YYVideoW() || VideoPlayer_h != YYVideoH())
            {

                VideoPlayer_w = YYVideoW();
                VideoPlayer_h = YYVideoH();
                //dbg_csol.Output("Resizing video height width to %d by %d\n", (int)VideoPlayer_w, (int)VideoPlayer_h);

                if (surface_exists(VideoPlayer_surface))
                {
					//dbg_csol.Output("Surface Free");
                    surface_free(VideoPlayer_surface, true);
                }

                if (VideoPlayer_buffer >= 0 )
                {
                  //  dbg_csol.Output("Buffer delete");

                    //buffer_delete(VideoPlayer_buffer);
                    buffer_delete(VideoPlayer_buffer);
                }
                
                VideoPlayer_surface = surface_create(VideoPlayer_w, VideoPlayer_h);
      
                VideoPlayer_buffer = buffer_create(VideoPlayer_w * VideoPlayer_h * 4, eBuffer_Format_Fixed, 1);
                //dbg_csol.Output("Surface Created!!! %d; W: %d H: %d\n", (int)VideoPlayer_surface, (int)VideoPlayer_w, (int)VideoPlayer_h);
                //dbg_csol.Output("CreateBuffer!!! %d; size: %d\n", (int)VideoPlayer_buffer, g_Buffers[(int)VideoPlayer_buffer]->m_Size);
            }
        }   
		

        var pBuff = g_BufferStorage.Get(VideoPlayer_buffer);
        if (!YYVideoDraw(pBuff, VideoPlayer_w, VideoPlayer_h))
        {       
            var ret = [];
            ret[0] = -1;
            ret[1] = -1;
            ret[2] = -1;
            return ret;   
        }

        buffer_set_surface(VideoPlayer_buffer,VideoPlayer_surface,0);
        //g_Buffers[VideoPlayer_buffer]->SetSurface(VideoPlayer_surface, 0);//buffer_set_surface(VideoPlayer_buffer, VideoPlayer_surface, 0);

        var ret = [];
        ret[0] = YYVideoStatus();
        ret[1] = VideoPlayer_surface;
        ret[2] = -1;
        return ret;
    }
}

function video_set_volume(vol)
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {
        gameCanvas.yyvideoplayer.volume = vol;
    }
}

function video_pause()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {
        gameCanvas.yyvideoplayer.pause();

    }
}
function video_resume()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {
        gameCanvas.yyvideoplayer.play();

    }
}
function video_enable_loop(loop)
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) 
        gameCanvas.yyvideoplayer.loop = loop;
}
function video_seek_to(pos)
{
    var timeinsecs = pos / 1000.0;
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null)
    {
        gameCanvas.yyvideoplayer.currentTime = timeinsecs;
    }
}
function video_get_duration()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {
        if (!isNaN(gameCanvas.yyvideoplayer.duration))
            return gameCanvas.yyvideoplayer.duration*1000;

    }
    return 0;
}
function video_get_position()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {

        return gameCanvas.yyvideoplayer.currentTime*1000;

    }
    return 0;
}
function video_get_status()
{
    if (g_VideoUserEnded)
        return 0;

    var gameCanvas = document.querySelector("canvas");

    var video_status_closed = 0;
    var video_status_preparing = 1;
    var video_status_playing = 2;
    var video_status_paused = 3;

    if (gameCanvas.yyvideoplayer != null) {
        if (gameCanvas.yyvideoplayer.ended)
            return video_status_closed;

        if (gameCanvas.yyvideoplayer.paused)
            return video_status_paused;

        //		if(gameCanvas.yyvideoplayer.error)
        //			return video_status_closed;

        if (gameCanvas.yyvideoplayer.readyState < gameCanvas.yyvideoplayer.HAVE_CURRENT_DATA)
            return video_status_preparing;



        return video_status_playing;

    }
    return video_status_closed;
}

function video_is_looping()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {

        return gameCanvas.yyvideoplayer.loop;

    }
    return 0;
}
function video_get_volume()
{
    var gameCanvas = document.querySelector("canvas");

    if (gameCanvas.yyvideoplayer != null) {

        return gameCanvas.yyvideoplayer.volume;

    }
    return 0;
}