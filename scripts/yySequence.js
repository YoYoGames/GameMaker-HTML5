// **********************************************************************************************************************
// 
// Copyright (c)2019, YoYo Games Ltd. All Rights reserved.
// 
// File:            yySequence.js
// Created:         14/08/2019
// Author:          Luke
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 14/08/2019		
// 
// **********************************************************************************************************************

KEY_LENGTH_EPSILON = -0.0001;   // copied from IDE

function CHashMapCalculateHash(snap)
{
	var hash = "";
	for (var i = 0; i < snap.length; i++)
	{
        var val = snap[i];
		hash += val.__type + val.sequenceObjectGlobalID.toString();
	}
	return hash;
}


// #############################################################################################
/// Function:<summary>
///             Constructor for the abstract the CSequenceBaseClass object whuch handles
///             dirtiness and signals when instances need to be updated due to changes.
///          </summary>
// #############################################################################################
/** @constructor */
function CSequenceBaseClass()
{
	this.changeIndex = -1;
    this.globalChangeIndex = -1;
    this.sequenceObjectGlobalID = g_CurrSequenceObjectID++;
    this.__yyIsGMLObject = true;

    // Override Me
    this.UpdateDirtiness = function() {};
    
	this.IsDirty = function(_changeIndex)
	{
		if (this.globalChangeIndex < GetCurrSeqObjChangeIndex())
		{
			this.UpdateDirtiness();

			this.globalChangeIndex = GetCurrSeqObjChangeIndex();
		}

		if (_changeIndex < this.changeIndex)
			return true;
		else
			return false;
	};

	this.SignalChange = function()
	{		
		this.changeIndex = GetNextSeqObjChangeIndex();
	};
}



eTT_Link = 0;
eTT_Invisible = 1;
eTT_Disable = 2;
eTT_Count = 3;

eSM_Loop = 0;
eSM_Single = 1;

sRM_DirectAssign = 0;
sRM_Lerp = 1;
sRM_Max = 2;

eSP_Normal = 0;
eSP_Loop = 1;
eSP_PingPong = 2;
eSP_Max = 3;

eSTT_Base = 0;				// nothing should ever be this
eSTT_Graphic = 1;
eSTT_Audio = 2;
eSTT_Real = 3;
eSTT_Color = 4;
eSTT_Bool = 5;
eSTT_String = 6;
eSTT_Sequence = 7;
eSTT_ClipMask = 8;
eSTT_ClipMask_Mask = 9;
eSTT_ClipMask_Subject = 10;
eSTT_Group = 11;
eSTT_Empty = 12;
eSTT_SpriteFrames = 13;
eSTT_Instance = 14;
eSTT_Message = 15;
eSTT_Moment = 16;
eSTT_Text = 17;
eSTT_Max = 18;

function TrackIsParameter(type) { return (type == eSTT_Real || type == eSTT_Color || type == eSTT_Bool || type == eSTT_String); }

eT_UserDefined = 0;
__X__ = 1;
__Y__ = 2;
__ScaleX__ = 3;
__ScaleY__ = 4;
eT_Gain = 5;
eT_Pitch = 6;
eT_Falloff = 7;
eT_Rotation = 8;
eT_BlendAdd = 9; // 0-1 range
eT_BlendMultiply = 10; // 0-1 range
eT_ClippingMask = 11;
eT_Mask = 12;
eT_Subject = 13;
eT_Position = 14;
eT_Scale = 15;
eT_Origin = 16;
eT_ImageSpeed = 17;
eT_ImageIndex = 18;
Group = 19;
eT_FrameSize = 20;
eT_CharacterSpacing = 21;
eT_LineSpacing = 22;
eT_ParagraphSpacing = 23;

// Extras only in the runner
eT_OriginX = 24;
eT_OriginY = 25;
eT_HeadPosChanged = 26;

eACCT_Linear = 0;
eACCT_CatmullRom_Centripetal = 1;
eACCT_Bezier2D = 2;

eSeqCurveChannel_X = 0;
eSeqCurveChannel_Primary = 0;
eSeqCurveChannel_R = 0;
eSeqCurveChannel_G = 1;
eSeqCurveChannel_Y = 1;
eSeqCurveChannel_B = 2;
eSeqCurveChannel_A = 3;

eTrait_None = 0;
eTrait_ChildrenShouldIgnoreOrigin = 1;

TTALIGN_Left = 0;
TTALIGN_HCentre = 1;
TTALIGN_Right = 2;
TTALIGN_Justify = 3;
TTALIGN_Top = 0;
TTALIGN_VCentre = 1;
TTALIGN_Bottom = 2;


SEQ_KEY_LENGTH_EPSILON = -0.0001;


g_CurrSequenceID = 0;
g_CurrAnimCurveID = 0;
g_CurrTrackID = 0;

// used to track which sequences have been changed and need to be recomputed
g_CurrSeqObjChangeIndex = 1;

g_CurrSequenceObjectID = 0;

g_SeqStack = [];

// #############################################################################################
/// Function:<summary>
///             Returns a new Track ID
///          </summary>
// #############################################################################################
function GetTrackID()
{
    return g_CurrTrackID++;
}

// #############################################################################################
/// Function:<summary>
///             Returns the current sequence object change index
///          </summary>
// #############################################################################################
function GetCurrSeqObjChangeIndex()
{	
	return g_CurrSeqObjChangeIndex;
}

// #############################################################################################
/// Function:<summary>
///             Returns the current sequence object change index and increments the index
///          </summary>
// #############################################################################################
function GetNextSeqObjChangeIndex()
{
	return g_CurrSeqObjChangeIndex++;
}

// #############################################################################################
/// Function:<summary>
///             Multiplies the given matrix by a matrix composed of the given x, y,
///             xscale, yscale, rotation, xorig, yorig values.
///          </summary>
// #############################################################################################
function MultiplyTrackMatrix(matrix, x, y, xscale, yscale, rotation, xorig, yorig)
{
    var dump = new Matrix();
    var compound = new Matrix();
    var tmp = new Matrix();

    if (xorig != 0 || yorig != 0) {
        compound.SetTranslation(-xorig, -yorig, 0);		// offset by origin
    }
    else compound.unit();

    dump.SetScale(xscale, yscale, 1);			// scale
    tmp.Multiply(compound, dump);
    compound.Copy(tmp);

    dump.SetZRotation(rotation);			    // rotate
    tmp.Multiply(compound, dump);
    compound.Copy(tmp);

    dump.SetTranslation(x, y, 0);				// translate
    tmp.Multiply(compound, dump);
    compound.Copy(tmp);

    tmp.Copy(matrix);
    matrix.Multiply(tmp, compound);
}

// #############################################################################################
/// Function:<summary>
///             Returns the start and end key positions for the current key on the given track
///          </summary>
// #############################################################################################
function GetTrackKeyRanges(_headPos, _lastHeadPos, _headDir, _speedscale, _pTrack, _pSeq, _startKeys, _endKeys)
{
    if (_pTrack == null)
        return false;

    if (_pSeq == null)
        return false;

    var playbackspeed = _pSeq.m_playbackSpeed * _speedscale;
    var headDir = _headDir;
    if (playbackspeed < 0.0)
    {
        playbackspeed = -playbackspeed;
        headDir = -headDir;
    }
    return _pTrack.m_keyframeStore.GetKeyframeIndexRanges(_pSeq.m_playback, playbackspeed, _pSeq.m_length, _lastHeadPos, _headPos, headDir, _startKeys, _endKeys, false);
}

// #############################################################################################
/// Function:<summary>
///             Parses the give storage data and return a new Track object
///          </summary>
// #############################################################################################
function SequenceBaseTrack_Load(_pStorage) {
    if ((_pStorage != null) && (_pStorage != undefined)) {

        var modelName = _pStorage.modelName;

        var newTrack;
        switch (modelName) {
            case "GMRealTrack": newTrack = new yySequenceRealTrack(_pStorage); break;
            case "GMGraphicTrack": newTrack = new yySequenceGraphicTrack(_pStorage); break;
            case "GMInstanceTrack": newTrack = new yySequenceInstanceTrack(_pStorage); break;
            case "GMColourTrack": newTrack = new yySequenceColourTrack(_pStorage); break;
            case "GMSpriteFramesTrack": newTrack = new yySequenceSpriteFramesTrack(_pStorage); break;
            case "GMSequenceTrack": newTrack = new yySequenceSequenceTrack(_pStorage); break;
            case "GMAudioTrack": newTrack = new yySequenceAudioTrack(_pStorage); break;
            case "GMTextTrack": newTrack = new yySequenceTextTrack(_pStorage); break;
            case "GMGroupTrack": newTrack = new yySequenceGroupTrack(_pStorage); break;
            case "GMClipMaskTrack": newTrack = new yySequenceClipMaskTrack(_pStorage); break;
            case "GMClipMask_Mask": newTrack = new yySequenceClipMask_MaskTrack(_pStorage); break;
            case "GMClipMask_Subject": newTrack = new yySequenceClipMask_SubjectTrack(_pStorage); break;
            case "GMStringTrack": newTrack = new yySequenceStringTrack(_pStorage); break;
            case "GMBoolTrack": newTrack = new yySequenceBoolTrack(_pStorage); break;
        }

        newTrack.m_keyframeStore = new yyKeyframeStore(newTrack.m_type, _pStorage.keyframeStore);

        return newTrack;
    }
}

// #############################################################################################
/// Function:<summary>
///             Create a new Real Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceRealTrack(_pStorage) {

    yySequenceParameterTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Real;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_interpolation = _pStorage.interpolation;
    }

    Object.defineProperties(this, {
        gmlinterpolation: {
            enumerable: true,
            get: function () { return this.m_interpolation; },
            set: function (_val)
            {
                var val = yyGetInt32(_val);
                if ((val >= 0) && (val < sRM_Max))
                {
                    this.m_interpolation = val;
                }
                else
                {
                    debug("Trying to set interpolation property of track to out-of-bounds value " + yyGetReal(_val));
                }                
            }
        }
    });

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the value for a given channel at the given key
    ///          </summary>
    // #############################################################################################
    this.getValue = function (_channel, _key, _seqlength) {

        if (!this.enabled) return null;
        if (this.m_keyframeStore == null) return null;
        if (this.m_keyframeStore.numKeyframes == 0) return null;

        return this.getCachedChannelVal(_channel, _key, _seqlength);
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Update the cached points for the given channel
    ///          </summary>
    // #############################################################################################
    this.UpdateCachedPoints = function(_channel, _seqlength) {
	    // Mirror new IDE length paradigm
        _seqlength += 1;

        if(_channel > this.numCachedPoints.length)
        {
            var oldMaxCachedChannels = this.numCachedPoints.length;
            this.numCachedPoints.length = _channel + 1;

            // initialise newly added num cached points entries to -1
            // Setting this to -1 allows us to detect channels which are never actually used
            for(var i = oldMaxCachedChannels; i < this.numCachedPoints.length; i++)
            {
                this.numCachedPoints[i] = -1;
            }
        }

        // Reset number of cached points
        this.numCachedPoints[_channel] = 0;

        // Now step through the keyframe list and add the points to the appropriate cached point list
        // I'm currently assuming that they'll be in order and no keyframes will overlap
        for (var i = 0; i < this.m_keyframeStore.numKeyframes; i++)
        {
            var key = this.m_keyframeStore.keyframes[i];
            var value = key.m_channels[_channel];
            if (value == null) {
                // Hack (also in IDE);
                // take the first key then; but we require that this key is an animation curve and that curve contains this channel then
                value = key.m_channels[0];
                if ((value == null) || ((value.m_curveIndex == -1) && (value.m_pEmbeddedCurve == null)))
                    continue;
            }

            if ((value.m_curveIndex == -1) && (value.m_pEmbeddedCurve == null))
            {
                var pPoint = this.AllocNewCachedPoint(_channel);
                pPoint.m_x = key.m_key;
                pPoint.m_value = value.m_realValue;

                if (!key.m_stretch && key.m_length > 1)
                {
                    var pPoint = this.AllocNewCachedPoint(_channel);
                    pPoint.m_x = (key.m_key + (key.m_length));
                    pPoint.m_value = value.m_realValue;
                }
                else if (key.m_stretch == true)
                {
                    if (i == (this.m_keyframeStore.numKeyframes - 1))
                    {
                        // This is the last keyframe, so stretch until the end of the sequence
                        if ((_seqlength - key.m_key) > 1)
                        {
                            var pPoint = this.AllocNewCachedPoint(_channel);
                            pPoint.m_x = key.m_key + (_seqlength - key.m_key);
                            pPoint.m_value = value.m_realValue;
                        }
                    }
                    else
                    {
                        // Get the next key position and add a new point just before it
                        var nextkey = this.m_keyframeStore.keyframes[i + 1];
                        if (nextkey.m_key > (key.m_key + 1))
                        {
                            var pPoint = this.AllocNewCachedPoint(_channel);
                            pPoint.m_x = nextkey.m_key;
                            pPoint.m_value = value.m_realValue;
                        }
                    }
                }
            }
            else
            {
                var keylength = key.m_length;
                if (key.m_stretch == true)
                {
                    if (i == (this.m_keyframeStore.numKeyframes - 1))
                    {
                        // This is the last keyframe, so stretch until the end of the sequence
                        if (_seqlength <= 0) continue;	// err...
                        else
                        {
                            //keylength = _seqlength - (key->key + 1);
                            keylength = _seqlength - key.m_key;
                        }
                    }
                    else
                    {
                        var nextkey = this.m_keyframeStore.keyframes[i + 1];
                        if (nextkey.m_key > key.m_key)
                        {
                            keylength = nextkey.m_key - key.m_key;
                        }
                    }
                }

                var pCurve = null;

                if (value.m_hasEmbeddedCurve)
			    {
			        pCurve = value.m_pEmbeddedCurve;
			    }
			    else
                {
                    // Try and find curve in the global resource list
                    pCurve = g_pAnimCurveManager.Get(value.m_curveIndex);
                }

                if (pCurve == null)
                {
                    //dbg_csol.Output("Could not find anim curve.\n");
                    continue;
                }

                var curvechannel = _channel;
                if (curvechannel >= pCurve.m_numChannels)
                {
                    curvechannel = pCurve.m_numChannels - 1;
                }

                // Now add the curve key points
                pCurve.Evaluate(this, curvechannel, _channel, key.m_key, keylength);
            }
        }
    };
    
    //calculate accumulated frames travelled (area under image speed keys) from _startKey to _key
//returns true if _res is set
    this.calculateAnimDistance = function(_channel, _startKey, _key, _seqlength, _res)
    {
	    var pRes = null;

	    if (!this.enabled) return null;
        if (this.m_keyframeStore == null) return null;
        if (this.m_keyframeStore.numKeyframes == 0) return null;

	    var numpoints = this.numCachedPoints[_channel];
	    if (numpoints == 0) {
		    return null; // no points to be found
	    }

	    //if requested key position is less than start, zero accumulated distance
	    var relKey = _key - _startKey;
	    if (relKey <= 0) {
		    pRes = 0;
		    return pRes;
	    }

	    var pPoints = this.cachedPoints[_channel];
	    var dtotal = 0;
	    //if there is just a single key, speed is constant across entire track
	    if (numpoints == 1) {
		    dtotal = pPoints[0].m_value * relKey;
		    pRes = dtotal;
		    return pRes;
	    }

	    var interpolated = this.m_interpolation == sRM_Lerp;
	    //velocity is continuous up to the first key-
	    var p0 = pPoints[0];
	    var t = yymin(p0.m_x, _key) - _startKey;
	    if( t > 0 )
		    dtotal = p0.m_value * t;

	    for (var i = 1; i < numpoints; ++i)
	    {
		    if (p0.m_x >= _key)
			    break;

		    var p1 = pPoints[i];
		    if (p1.m_x > _startKey)   //ignore this segment if its entirely before the start key
		    {
			    t = yymin(p1.m_x, _key) - p0.m_x;
			    if (t > 0)
			    {
				    var d;
				    var offset = (_startKey - p0.m_x); // distance from p0 to startKey - >0 if start position intersects this segment
				    if (!interpolated)
				    {
					    if (offset > 0) //if start position intersects this segment
						    t -= offset;
					    d = p0.m_value * t;
				    }
				    else
				    {
					    var a = (p1.m_value - p0.m_value) / (p1.m_x - p0.m_x);
					    var v0 = p0.m_value;
					    if (offset >0) {//if start position intersects this segment
						    t -= offset;
						    v0 += a * offset;
					    }
					    d = v0 * t + (0.5 * a * t * t); //v0t +1/2at^2
				    }
				    dtotal += d;
			    }
		    }
		    p0 = p1;
	    }
	    //add any remainder from last key to requested head - constant v to end of track
	    var rem = _key - p0.m_x;
	    if (rem > 0)
	    {
		    var d = p0.m_value * (rem);
		    dtotal += d;
	    }

	    pRes = yymax(dtotal,0);
	    return pRes;
    };
}

// #############################################################################################
/// Function:<summary>
///             Create a new Parameter Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceParameterTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_interpolation = sRM_DirectAssign;
    this.numCachedPoints = [];
    this.cachedPoints = [];

    // #############################################################################################
    /// Function:<summary>
    ///             evaluate the sequence and return the value for the given channel at the given key
    ///          </summary>
    // #############################################################################################
    this.evaluate = function (_channel, _key, _seqlength)
    {
        // Is this track redirected?
        var dest = this.getLinkedTrack();
        if(dest != null)
        {
            // Evaluate this track instead
            return dest.evaluate(_channel, _key, _seqlength);
        }
        return this.getValue(_channel, _key, _seqlength);
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the value for a given channel at the given key
    ///          </summary>
    // #############################################################################################
    this.getValue = function (_channel, _key, _seqlength)
    {
        throw new Error("Not Implemented");
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Allocate a new cached point for the give channel
    ///          </summary>
    // #############################################################################################
    this.AllocNewCachedPoint = function (_channel)
    {
        var newpoint = new yyAnimCurvePoint();
        if (this.cachedPoints[_channel] == undefined)
        {
            this.cachedPoints[_channel] = [];
        }
        this.cachedPoints[_channel][this.numCachedPoints[_channel]] = newpoint;
        this.numCachedPoints[_channel] = this.numCachedPoints[_channel] + 1;

        return newpoint;
    };

    this.getCachedChannelVal = function (_channel, _key, _seqlength)
    {
        var pRes = null;

        var dirty = false;
        var force = false;
        if (_channel >= this.numCachedPoints.length || this.numCachedPoints[_channel] == 0)
        {
            force = true;
        }
        else if (this.globalChangeIndex < GetCurrSeqObjChangeIndex())
        {
            if (this.m_keyframeStore.IsDirty(this.changeIndex))
            {
                dirty = true;
            }

            this.globalChangeIndex = GetCurrSeqObjChangeIndex();
        }

        if (dirty || force)
        {
            // We need to update the cached points for *all* used channels here otherwise when we update changeIndex we lose the ability to detect changes on other channels
            var maxchan = yymax(this.numCachedPoints.length, _channel + 1);
            for (var i = 0; i < maxchan; i++)
{
                if ((i >= this.numCachedPoints.length) || (this.numCachedPoints[i] != -1))
{
                    this.UpdateCachedPoints(i, _seqlength);
                }
            }
            this.changeIndex = yymax(this.changeIndex, this.m_keyframeStore.changeIndex);
        }

        var numpoints = this.numCachedPoints[_channel];
        if (numpoints == 0)
{
            // _res must contain the default value, or be handled otherwise
            return null; // no points to be found
        }

        var pPoints = this.cachedPoints[_channel];

        // TODO: might be worth switching back to linear search in conjunction with keeping track of the index of the start of the pair
        // of evaluated points we interpolated between - this should make normal playback very cheap (unless we're dealing with
        // a lot of tightly packed control points).

        // Special-case start and end points
        if (pPoints[0].m_x > _key)
        {
            pRes = pPoints[0].m_value;
            return pRes;
        }
        else if (pPoints[numpoints - 1].m_x < _key)
        {
            pRes = pPoints[numpoints - 1].m_value;
            return pRes;
        }

        // binary search
        var start, end, mid;
        start = 0;
        end = numpoints;

        mid = (start + end) >> 1;
        while (mid != start)
        {
            if (pPoints[mid].m_x > _key)
            {
                end = mid;
            }
            else
            {
                start = mid;
            }

            mid = (start + end) >> 1;
        }

        if ((this.m_interpolation == sRM_DirectAssign) || (mid == (numpoints - 1)))
        {
            pRes = pPoints[mid].m_value;
            return pRes;
        }
        else
        {
            var pFirstPoint = (pPoints[mid]);
            var pSecondPoint = (pPoints[mid + 1]);

            var prop = 0.0;
            if ((pSecondPoint.m_x - pFirstPoint.m_x) > 0.0)
            {
                prop = (_key - pFirstPoint.m_x) / (pSecondPoint.m_x - pFirstPoint.m_x);
            }

            pRes = (pSecondPoint.m_value * prop) + (pFirstPoint.m_value * (1.0 - prop));
            return pRes;
        }

        //return pRes;
    };
}

// #############################################################################################
/// Function:<summary>
///             Create a new Graphic Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceGraphicTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Graphic;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Instance Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceInstanceTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Instance;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Colour Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceColourTrack(_pStorage) {

    yySequenceParameterTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Color;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_interpolation = _pStorage.interpolation;
    }

    Object.defineProperties(this, {
        gmlinterpolation: {
            enumerable: true,
            get: function () { return this.m_interpolation; },
            set: function (_val)
            {
                var val = yyGetInt32(_val);
                if ((val >= 0) && (val < sRM_Max))
                {
                    this.m_interpolation = val;
                }
                else
                {
                    debug("Trying to set interpolation property of track to out-of-bounds value " + yyGetReal(_val));
                }                
            }
        }
    });

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the value for a given channel at the given key
    ///          </summary>
    // #############################################################################################
    this.getValue = function (_channel, _key, _seqlength) {

        if (!this.enabled) return null;
        if (this.m_keyframeStore == null) return null;
        if (this.m_keyframeStore.numKeyframes == 0) return null;

        var pRes = null;

        // Sample our cached point lists to generate a composite colour value
        // Basically do what the real track does but sample all our curves instead of just one channel and combine their results
        var r, g, b, a;
        r = g = b = a = 1.0;
	
        if ((a = this.getCachedChannelVal(0, _key, _seqlength)) == null)
            return null;
        if ((r = this.getCachedChannelVal(1, _key, _seqlength)) == null)
            return null;
        if ((g = this.getCachedChannelVal(2, _key, _seqlength)) == null)
            return null;
        if ((b = this.getCachedChannelVal(3, _key, _seqlength)) == null)
            return null;

        r *= 255.0;
        g *= 255.0;
        b *= 255.0;
        a *= 255.0;

        var colr = yymin(r, 255);
        var colg = yymin(g, 255);
        var colb = yymin(b, 255);
        var cola = yymin(a, 255);

        pRes = ((cola << 24) & 0xff000000) | ((colb << 16) & 0xff0000) | ((colg << 8) & 0xff00) | (colr & 0xff);
        return pRes;
    };

    this.UpdateCachedPoints = function (_channel, _seqlength)
    {
        // Mirror new IDE length paradigm
        _seqlength += 1;

        if (_channel > this.numCachedPoints.length)
        {
            var oldMaxCachedChannels = this.numCachedPoints.length;
            this.numCachedPoints.length = _channel + 1;

            // initialise newly added num cached points entries to -1
            // Setting this to -1 allows us to detect channels which are never actually used
            for (var i = oldMaxCachedChannels; i < this.numCachedPoints.length; i++)
            {
                this.numCachedPoints[i] = -1;
            }
        }

        // Reset number of cached points
        this.numCachedPoints[_channel] = 0;

        // Now step through the keyframe list and add the points to the appropriate cached point list
        // I'm currently assuming that they'll be in order and no keyframes will overlap
        for (var i = 0; i < this.m_keyframeStore.numKeyframes; i++)
        {
            var key = this.m_keyframeStore.keyframes[i];
            var value = key.m_channels[_channel];
            if (value == null)
            {
                // Colour keys that don't use curves only have a single channel, so just get the first
                value = key.m_channels[0];
                if (value == null)
                    continue;
            }

            if ((value.m_curveIndex == -1) && (value.m_pEmbeddedCurve == null))
            {
                var pPoint = this.AllocNewCachedPoint(_channel);
                pPoint.m_x = key.m_key;
                pPoint.m_value = this.GetColourChannel(value.m_color, _channel);

                if (!key.m_stretch && key.m_length > 1)
                {
                    var pPoint = this.AllocNewCachedPoint(_channel);
                    pPoint.m_x = (key.m_key + (key.m_length - 1));
                    pPoint.m_value = this.GetColourChannel(value.m_color, _channel);
                }
                else if (key.m_stretch == true)
                {
                    if (i == (this.m_keyframeStore.numKeyframes - 1))
                    {
                        // This is the last keyframe, so stretch until the end of the sequence
                        if ((_seqlength - key.m_key) > 1)
                        {
                            var pPoint = this.AllocNewCachedPoint(_channel);
                            pPoint.m_x = key.m_key + (_seqlength - key.m_key);
                            pPoint.m_value = this.GetColourChannel(value.m_color, _channel);
                        }
                    }
                    else
                        {
                        // Get the next key position and add a new point just before it
                        var nextkey = this.m_keyframeStore.keyframes[i + 1];
                        if (nextkey.m_key > (key.m_key + 1))
                        {
                            var pPoint = this.AllocNewCachedPoint(_channel);
                            pPoint.m_x = nextkey.m_key - 1;
                            pPoint.m_value = this.GetColourChannel(value.m_color, _channel);
                        }
                    }
                }
            }
            else
            {
                var keylength = key.m_length;
                if (key.m_stretch == true)
                {
                    if (i == (this.m_keyframeStore.numKeyframes - 1))
                    {
                        // This is the last keyframe, so stretch until the end of the sequence
                        if (_seqlength <= 0) continue;	// err...
                        else
                        {
                            //keylength = _seqlength - (key->key + 1);
                            keylength = _seqlength - key.m_key;
                        }
                    }
                    else
                    {
                        var nextkey = this.m_keyframeStore.keyframes[i + 1];
                        if (nextkey.m_key > key.m_key)
                        {
                            keylength = nextkey.m_key - key.m_key;
                        }
                    }
                }

                var pCurve = null;

                if (value.m_hasEmbeddedCurve)
			    {
			        pCurve = value.m_pEmbeddedCurve;
			    }
			    else
                {
                    // Try and find curve in the global resource list
                    pCurve = g_pAnimCurveManager.Get(value.m_curveIndex);
                }

                if (pCurve == null)
                {
                    //dbg_csol.Output("Could not find anim curve.\n");
                    continue;
                }

                var curvechannel = _channel;
                if (curvechannel >= pCurve.m_numChannels)
                {
                    curvechannel = pCurve.m_numChannels - 1;
                }

                // Now add the curve key points
                pCurve.Evaluate(this, curvechannel, _channel, key.m_key, keylength, 1.0 / 255.0);
            }
        }
    };

    this.GetColourChannel = function (_col, _chan)
    {
        // Channel order (when using animation curves) is ARGB
        // Order in integer colour keyframes is ABGR - for consistency we'll use the animation curve order
        var chanval = 0;
        switch (_chan)
        {
            case 0: chanval = _col >> 24; break;
            case 1: chanval = _col; break;
            case 2: chanval = _col >> 8; break;
            case 3: chanval = _col >> 16; break;
        }

        chanval &= 0xff;

        var floatval = chanval / 255.0;
        return floatval;
    };

    this.AddABGR = function(left, right) {
        var r = yymin((left & 0xff) + (right & 0xff), 255);
        var g = yymin(((left >> 8) & 0xff) + ((right >> 8) & 0xff), 255);
        var b = yymin(((left >> 16) & 0xff) + ((right >> 16) & 0xff), 255);
        var a = yymin(((left >> 24) & 0xff) + ((right >> 24) & 0xff), 255);
        return ((a << 24) & 0xff000000) | ((b << 16) & 0xff0000) | ((g << 8) & 0xff00) | (r & 0xff);
    };

    this.MultiplyABGR = function(left, right) {
        var r = ((left & 0xff) * (right & 0xff) / 255.0);
        var g = (((left >> 8) & 0xff) * ((right >> 8) & 0xff) / 255.0);
        var b = (((left >> 16) & 0xff) * ((right >> 16) & 0xff) / 255.0);
        var a = (((left >> 24) & 0xff) * ((right >> 24) & 0xff) / 255.0);
        return ((a << 24) & 0xff000000) | ((b << 16) & 0xff0000) | ((g << 8) & 0xff00) | (r & 0xff);
    };

    this.MultiplyABGR = function(left, factor) {
        factor = yymax(factor, 0.0);
        factor = yymin(factor, 1.0);
        var r = ((left & 0xff) * factor);
        var g = (((left >> 8) & 0xff) * factor);
        var b = (((left >> 16) & 0xff) * factor);
        var a = (((left >> 24) & 0xff) * factor);
        return ((a << 24) & 0xff000000) | ((b << 16) & 0xff0000) | ((g << 8) & 0xff00) | (r & 0xff);
    };
}

// #############################################################################################
/// Function:<summary>
///             Create a new Sprite Frames Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceSpriteFramesTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_SpriteFrames;

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the value for a given channel at the given key
    ///          </summary>
    // #############################################################################################
    this.getValue = function (_trackpos) {
        //Doing this to maintain compatibility with non-sequenced sprites
        //This isn't really valid to do - if you have a key of frame 2 at time 1 and frame 8 at time 2 it'll draw all the frames between 2 and 8 
        //whereas you really want frame 2 then frame 8 but it gets away with it as the image editor changes the indices of the image frames
        //so 8 would become 3

        var pPre = undefined;
        var pPost = undefined;

        var pPrePost = this.m_keyframeStore.GetKeyFramesAround(_trackpos);
        pPre = pPrePost.pre;
        pPost = pPrePost.post;

        var prevalid = (pPre !== undefined);
        var postvalid = (pPost !== undefined);

        if ((!prevalid) && (!postvalid))
            return -1.0;
        if (!prevalid)
        {
            return pPost.m_imageIndex;
        }
        if (!postvalid)
        {
            //In order to match previous image_index behaviour we're going to assume another key after this one 
            var preval = pPre.m_channels[0].m_imageIndex;
            var postval = preval + 1.0;
            var prekey = pPre.m_key;
            var postkey = prekey+pPre.m_length;

            if (postkey == prekey)
            {
                postkey += 1.0;		// erm, not much else we can do in this case
            }

            var retval = preval + ((_trackpos - prekey) / (postkey - prekey))*(postval - preval);

            return retval;
        }
        var preval = pPre.m_channels[0].m_imageIndex;
        var postval = pPost.m_channels[0].m_imageIndex;
        var prekey = pPre.m_key;
        var postkey = pPost.m_key;

        var retval = preval + ((_trackpos - prekey) / (postkey - prekey))*(postval - preval);

        return retval;
    };
}

// #############################################################################################
/// Function:<summary>
///             Create a new Sequence Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceSequenceTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Sequence;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Audio Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceAudioTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Audio;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Group Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceGroupTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Group;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Text Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceTextTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Text;
}

// #############################################################################################
/// Function:<summary>
///             Create a new ClipMask Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceClipMaskTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_ClipMask;

    this.pMaskTrack = null;
    this.pSubjectTrack = null;
    for(var i = 0; i < this.m_tracks.length; i++)
	{
		var subtrack = this.m_tracks[i];
		if(subtrack.m_type == eSTT_ClipMask_Mask)
		{
			this.pMaskTrack = subtrack;
			if(this.pSubjectTrack != null)
			{
				break;
			}
		}
		else if(subtrack.m_type == eSTT_ClipMask_Subject)
		{
			this.pSubjectTrack = subtrack;
			if(this.pMaskTrack != null)
			{
				break;
			}
		}
	}

    Object.defineProperties(this, {
        gmlmask: {
            enumerable: true,
            get: function () { return this.pMaskTrack; },
            set: function (_val) { this.pMaskTrack = _val; }
        }, 
        gmlsubject: {
            enumerable: true,
            get: function () { return this.pSubjectTrack; },
            set: function (_val) { this.pSubjectTrack = _val; }
        } 
    });
}

yySequenceClipMaskTrack.prototype.GetMaskTrack = function()
{
    return this.pMaskTrack;
};

yySequenceClipMaskTrack.prototype.GetSubjectTrack = function()
{
    return this.pSubjectTrack;
};

// #############################################################################################
/// Function:<summary>
///             Create a new ClipMask Mask Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceClipMask_MaskTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_ClipMask_Mask;
}

// #############################################################################################
/// Function:<summary>
///             Create a new ClipMask Subject Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceClipMask_SubjectTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_ClipMask_Subject;
}

// #############################################################################################
/// Function:<summary>
///             Create a new String Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceStringTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_String;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Bool Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceBoolTrack(_pStorage) {

    yySequenceBaseTrack.call(this, _pStorage); //base constructor
    this.m_type = eSTT_Bool;
}

// #############################################################################################
/// Function:<summary>
///             Create a new Track object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceBaseTrack(_pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[Track]";
    this.id = GetTrackID();

    this.m_modelName = "";
    this.pName = "";
    this.builtinName = 0;
    this.m_traits = 0;
    this.m_isCreationTrack = false;
    this.m_tags = [];
    this.m_numTracks = 0;
    this.m_tracks = [];
    this.m_numResources = 0;
    this.m_ownedResources = [];
    this.m_keyframeStore = new yyKeyframeStore();

    if ((_pStorage != null) && (_pStorage != undefined)) {

        this.m_modelName = _pStorage.modelName;
        this.pName = _pStorage.pName;
        this.builtinName = _pStorage.builtinName;
        this.m_isCreationTrack = _pStorage.creationTrack == 1 ? true : false;
        this.m_traits = _pStorage.traits;

        if(_pStorage.tags !== undefined && _pStorage.tags.length > 0)
        {            
            for(var tagI = 0; tagI < _pStorage.tags.length; tagI++)
            {
                this.m_tags[_pStorage.tags[tagI]["UniqueTagTypeId"]] = _pStorage.tags[tagI];
            }
        }

        this.m_numTracks = _pStorage.tracks.length;
        this.m_tracks = [];
        for (var trackIndex = 0; trackIndex < this.m_numTracks; ++trackIndex) {
            this.m_tracks[trackIndex] = SequenceBaseTrack_Load(_pStorage.tracks[this.m_numTracks - 1 - trackIndex]);
        }

        this.m_numResources = _pStorage.ownedResourceModels.length;
        this.m_ownedResources = [];
        for (var resourceIndex = 0; resourceIndex < this.m_numResources; ++resourceIndex) {
            var ownedResourceEntry = _pStorage.ownedResourceModels[resourceIndex];
            
            var resourceType = ownedResourceEntry.type;
            var resourceData = ownedResourceEntry.resource;
            if(resourceType == "GMAnimCurve")
            {
                this.m_ownedResources[resourceIndex] = new yyAnimCurve(resourceData);
            }
        }
    }

    Object.defineProperties(this, {
        gmlname: {
            enumerable: true,
            get: function () { return this.pName; },
            set: function (_val)
            {
                this.pName = yyGetString(_val);

                this.AssignBuiltinTrackName();
            }
        },
        gmltype: {
            enumerable: true,
            get: function () { return this.m_type; }            
        },
        gmltraits: {
            enumerable: true,
            get: function () { return this.m_traits; },
            set: function (_val) { this.m_traits = yyGetInt32(_val); }
        },
        gmltracks: {
            enumerable: true,
            get: function () { return this.m_tracks; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_tracks = _val;
                }
                else
                {
                    throw new Error("value must be an array of tracks");
                }
            }
        },
        gmlenabled: {
            enumerable: true,
            get: function () { return this.m_tags == null || this.m_tags[eTT_Disable] == undefined; },
            set: function (_val) { this.m_tags[eTT_Disable] = yyGetBool(_val) ? undefined : true; }
        },
        gmlvisible: {
            enumerable: true,
            get: function () { return this.m_tags == null || this.m_tags[eTT_Invisible] == undefined; },
            set: function (_val) { this.m_tags[eTT_Invisible] = yyGetBool(_val) ? undefined : true; }
        },
        enabled : {
            get: function () { return this.m_tags == null || this.m_tags[eTT_Disable] == undefined; },
            set: function (_val) { this.m_tags[eTT_Disable] = yyGetBool(_val) ? undefined : true; }
        },
        visible : {
            get: function () { return this.m_tags == null || this.m_tags[eTT_Invisible] == undefined; },
            set: function (_val) { this.m_tags[eTT_Invisible] = yyGetBool(_val) ? undefined : true; }
        },
        gmlembeddedAnimCurves: {
            enumerable: true,
            get: function () { return this.m_ownedResources; },
            set: function (_val) { this.m_ownedResources = _val; }
        },
        gmllinkedTrack: {
            enumerable: true,
            get: function () { return this.m_tags == null ? null : (this.m_tags[eTT_Link] != null ? this.m_tags[eTT_Link].track : null); },
            set: function (_val)
            {
                if(this.m_tags[eTT_Disable] == null) this.m_tags[eTT_Link] = {};
                this.m_tags[eTT_Link].track = _val;
            }
        },
        gmlkeyframes: {
            enumerable: true,
            get: function () { return this.m_keyframeStore.keyframes; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_keyframeStore.keyframes = _val;
                    this.m_keyframeStore.numKeyframes = _val.length;
                }
                else
                {
                    throw new Error("value must be an array of keyframes");
                }
            }
        }
    });

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the redirected track if the current track contains a 'link' tag
    ///          </summary>
    // #############################################################################################
    this.getLinkedTrack = function () {
        
        if(this.tags != null && this.tags[eTT_Link] != null)
        {
            // Find the target track
            var tagLink = this.tags[eTT_Link];
            if(tagLink == null) return null;
            if(tagLink.track == null)
            {
                // Find the track if it exists
                var track = g_pSequenceManager.GetSequenceFromID(tagLink.trackIndex);
                if(track != null) tagLink.track = track;
            }
            return tagLink.track;
        }

        // Not redirected
        return null;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Updates the values in the given results TrackEval tree with the current values
    ///             being pointed to along the track.
    ///          </summary>
    // #############################################################################################
    this.EvaluateTrack = function (_head, _length, _result, _creationmask)
    {

        // Special-case the origin - this is calculated differently to the other parameters
        // and needs to be reset to a baseline every frame
        _result.xOrigin = 0.0;
        _result.yOrigin = 0.0;
        _creationmask &= ~(1 << eT_Origin);

        _result.paramset = 0;
        _result.ApplyCreationMask(_creationmask);
        //_result.ResetVariables();
        _result.ResetOverrides();

        var tempcreationvalue = _result.hascreationvalue;

        for (var trackIndex = 0; trackIndex < this.m_tracks.length; ++trackIndex) {
            var track = this.m_tracks[trackIndex];

            if (TrackIsParameter(track.m_type) && (track.enabled))
            {
                var isCreationTrack = track.m_isCreationTrack;

                if (isCreationTrack)
                {
                    if (tempcreationvalue & (1 << track.builtinName))
                    {
                        // We don't need to recalcalculate this track's value as this is a creation track and the value hasn't changed
                        continue;
                    }

                    if ((_result.paramset & (1 << track.builtinName)) == 0)
                    {
                        // Only set as creation value if we haven't already evaluated the same sort of field 
                        tempcreationvalue |= (1 << track.builtinName);
                    }
                }
                else
                {
                    // This isn't a creation track so clear the appropriate bit if we've set it 
                    tempcreationvalue &= ~(1 << track.builtinName); 
                }

                switch (track.builtinName) {
                    case eT_Rotation:                    
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Rotation)))
                        {
                            _result.rotation = track.evaluate(eSeqCurveChannel_X, _head, _length);
                            _result.paramset |= (1 << eT_Rotation);
                        }
                        break;
                    case eT_Position:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Position)))
                        {
                            _result.x = track.evaluate(eSeqCurveChannel_X, _head, _length);
                            _result.y = track.evaluate(eSeqCurveChannel_Y, _head, _length);
                            _result.paramset |= (1 << eT_Position);
                        }
                        break;
                    case eT_Scale:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Scale)))
                        {
                            _result.scaleX = track.evaluate(eSeqCurveChannel_X, _head, _length);
                            _result.scaleY = track.evaluate(eSeqCurveChannel_Y, _head, _length);
                            _result.paramset |= (1 << eT_Scale);
                        }
                        break;
                    case eT_BlendMultiply:                    
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_BlendMultiply)))
                        {
                            var color = 0xffffffff;
                            var evalColor = track.evaluate(0, _head, _length);
                            if (evalColor != null) color = evalColor;
                            _result.colorMultiply[0] = (color & 0xff) / 255.0;
                            _result.colorMultiply[1] = ((color >> 8) & 0xff) / 255.0;
                            _result.colorMultiply[2] = ((color >> 16) & 0xff) / 255.0;
                            _result.colorMultiply[3] = ((color >> 24) & 0xff) / 255.0;
                            _result.paramset |= (1 << eT_BlendMultiply);
                        }
                        break;
                    case eT_BlendAdd:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_BlendAdd)))
                        {
                            var color = 0xffffffff;
                            var evalColor = track.evaluate(0, _head, _length);
                            if (evalColor != null) color = evalColor;
                            _result.colorAdd[0] = (color & 0xff) / 255.0;
                            _result.colorAdd[1] = ((color >> 8) & 0xff) / 255.0;
                            _result.colorAdd[2] = ((color >> 16) & 0xff) / 255.0;
                            _result.colorAdd[3] = ((color >> 24) & 0xff) / 255.0;
                            _result.paramset |= (1 << eT_BlendAdd);
                        }
                        break;
                    case eT_Origin:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Origin)))
                        {
                            _result.xOrigin = track.evaluate(eSeqCurveChannel_X, _head, _length);
                            _result.yOrigin = track.evaluate(eSeqCurveChannel_Y, _head, _length);
                            //if(_result.xOrigin != 0) _result.Override(eT_OriginX, true);
                            //if(_result.yOrigin != 0) _result.Override(eT_OriginY, true);
                            _result.paramset |= (1 << eT_Origin);
                        }
                        break;
                    case eT_Gain:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Gain)))
                        {
                            _result.gain = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_Gain);
                        }
                        break;
                    case eT_Pitch:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Pitch)))
                        {
                            _result.pitch = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_Pitch);
                        }
                        break;
                    case eT_Falloff:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_Falloff)))
                        {
                            _result.falloff = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_Falloff);
                        }
                        break;
                    case eT_ImageSpeed:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_ImageSpeed)))
                        {
                            var res = track.evaluate(0, _head, _length);
                            if( res != null )
                                _result.imageSpeed = res;
                            _result.Override(eT_ImageSpeed, true);
                            _result.paramset |= (1 << eT_ImageSpeed);

                            if( track.m_type == eSTT_Real )
                            {
                                //find the start key of asset keyframe at head position - to match IDE and original behaviour when image speed is default
                                var startKey = -1;
                                var haveKey = false;
                                if (this.m_type == eSTT_Graphic || this.m_type == eSTT_Instance) 
                                {
                                    var keyframeStore = this.m_keyframeStore;
                                    var keyframeIndex = keyframeStore.GetKeyframeIndexAtFrame(_head, _length);
                                    if (keyframeIndex >=0) {
                                        var graphicKeyframe = keyframeStore.keyframes[keyframeIndex];
                                        startKey = graphicKeyframe.m_key;
                                        haveKey = true;
                                    }
                                }
                                //skip calculation if theres no asset keyframe at this point - it wont be used
                                _result.imageDistance = -1;
                                if (haveKey) {
                                    var res = track.calculateAnimDistance(0, startKey, _head, _length);
                                    if( res != null )
                                        _result.imageDistance = res;
                                }
                            }
                        }
                        break;
                    case eT_ImageIndex:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_ImageIndex)))
                        {
                            var res = track.evaluate(0, _head, _length);
                            if( res != null )
                                _result.imageIndex = res;
                            _result.Override(eT_ImageIndex, true);
                            _result.paramset |= (1 << eT_ImageIndex);
                        }
                        break;
                    case eT_FrameSize:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_FrameSize)))
                        {
                            _result.FrameSizeX = track.evaluate(eSeqCurveChannel_X, _head, _length);
                            _result.FrameSizeY = track.evaluate(eSeqCurveChannel_Y, _head, _length);
                            _result.paramset |= (1 << eT_FrameSize);
                        }
                        break;
                    case eT_CharacterSpacing:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_CharacterSpacing)))
                        {
                            _result.CharacterSpacing = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_CharacterSpacing);
                        }
                        break;
                    case eT_LineSpacing:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_LineSpacing)))
                        {
                            _result.LineSpacing = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_LineSpacing);
                        }
                        break;
                    case eT_ParagraphSpacing:
                        if (!isCreationTrack || !(_result.paramset & (1 << eT_ParagraphSpacing)))
                        {
                            _result.ParagraphSpacing = track.evaluate(0, _head, _length);
                            _result.paramset |= (1 << eT_ParagraphSpacing);
                        }
                        break;
                    
                }
            }
        }

        tempcreationvalue &= _creationmask;
        _result.hascreationvalue = tempcreationvalue;
    };

    this.AssignBuiltinTrackName = function() {
        if (this.pName == null) {
            this.builtinName = eT_UserDefined;
            return;
        }
        if (this.pName == "position") this.builtinName = eT_Position;
        else if (this.pName == "scale") this.builtinName = eT_Scale;
        else if (this.pName == "gain") this.builtinName = eT_Gain;
        else if (this.pName == "pitch") this.builtinName = eT_Pitch;
        else if (this.pName == "falloff") this.builtinName = eT_Falloff;
        else if (this.pName == "rotation") this.builtinName = eT_Rotation;
        else if (this.pName == "blend_add") this.builtinName = eT_BlendAdd;
        else if (this.pName == "blend_multiply") this.builtinName = eT_BlendMultiply;
        else if (this.pName == "mask") this.builtinName = eT_Mask;
        else if (this.pName == "subject") this.builtinName = eT_Subject;
        else if (this.pName == "origin") this.builtinName = eT_Origin;
        else if (this.pName == "image_speed") this.builtinName = eT_ImageSpeed;
        else if (this.pName == "image_index") this.builtinName = eT_ImageIndex;
        else if (this.pName == "image_angle") this.builtinName = eT_Rotation;
        else if (this.pName == "rotation") this.builtinName = eT_Rotation;
        else if (this.pName == "image_blend") this.builtinName = eT_BlendMultiply;        
        else if (this.pName == "frameSize") this.builtinName = eT_FrameSize;
        else if (this.pName == "characterSpacing") this.builtinName = eT_CharacterSpacing;
        else if (this.pName == "lineSpacing") this.builtinName = eT_LineSpacing;
        else if (this.pName == "paragraphSpacing") this.builtinName = eT_ParagraphSpacing;
        else if (this.pName == "frame_size") this.builtinName = eT_FrameSize;                   // alias for frameSize
        else if (this.pName == "character_spacing") this.builtinName = eT_CharacterSpacing;     // alias for characterSpacing
        else if (this.pName == "line_spacing") this.builtinName = eT_LineSpacing;               // alias for lineSpacing
        else if (this.pName == "paragraph_spacing") this.builtinName = eT_ParagraphSpacing;     // alias for paragraphSpacing
        else this.builtinName = eT_UserDefined;
    };
}

// #############################################################################################
/// Function:<summary>
///             Constrctor for the abstract TrackKeyBase object
///          </summary>
// #############################################################################################
/** @constructor */
function yyTrackKeyBase()
{
    CSequenceBaseClass.call(this); //base constructor

    this.m_channel = 0;

    Object.defineProperties(this, {
        gmlchannel: {
            enumerable: true,
            get: function () { return this.m_channel; },
            set: function (_val) { this.m_channel = yyGetInt32(_val); }
        },        
    });

    this.UpdateDirtiness = function()
    {
        var currChangeIndex = this.changeIndex;
        for(var channel in this.m_channels)
        {
            if (channel.IsDirty(currChangeIndex))
            {
                this.changeIndex = yymax(this.changeIndex, channel.changeIndex);
            }
        }
    };
}

// #############################################################################################
/// Function:<summary>
///             Create a new Message Event Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyMessageEventTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[MessageEventTrackKey]";

    this.m_events = null;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_events = _pStorage.events;
    }

    Object.defineProperties(this, {
        gmlevents: {
            enumerable: true,
            get: function () { return this.m_events; },
            set: function (_val) { this.m_events = _val; }
        },        
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Code Event Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyMomentEventTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[CodeEventTrackKey]";

    if ((_pStorage != null) && (_pStorage != undefined))
    {
        this.m_event = _pStorage.event;
        this.m_event.origfunc = this.m_event;
    }
    else
    {
        this.m_event = null;
    }

    Object.defineProperties(this, {
        gmlevent: {
            enumerable: true,
            get: function () { return this.m_event; },
            set: function (_val) { this.m_event = _val; }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Asset Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAssetTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[AssetTrackKey]";

    this.m_index = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_index = _pStorage.index;
    }

    Object.defineProperties(this, {
        gmlindex: {
            enumerable: true,
            get: function () { return this.m_index; },
            set: function (_val) { this.m_index = _val; }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Graphics Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyGraphicTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[GraphicTrackKey]";

    this.m_spriteIndex = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_spriteIndex = _pStorage.index;
    }

    Object.defineProperties(this, {
        gmlspriteIndex: {
            enumerable: true,
            get: function () { return this.m_spriteIndex; },
            set: function (_val) { this.m_spriteIndex = yyGetInt32(_val); }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Instance Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyInstanceTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[InstanceTrackKey]";

    this.m_objectIndex = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_objectIndex = _pStorage.index;
    }

    Object.defineProperties(this, {
        gmlobjectIndex: {
            enumerable: true,
            get: function () { return this.m_objectIndex; },
            set: function (_val) { this.m_objectIndex = yyGetInt32(_val); }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Audio Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAudioTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[AudioTrackKey]";

    this.m_soundIndex = -1;
    this.m_emitters = 0;
    this.m_mode = 0;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_soundIndex = _pStorage.soundIndex;
        this.m_emitters = _pStorage.emitters;
        this.m_mode = _pStorage.mode;
    }

    Object.defineProperties(this, {
        gmlsoundIndex: {
            enumerable: true,
            get: function () { return this.m_soundIndex; },
            set: function (_val) { this.m_soundIndex = _val; }
        }, 
        gmlemitters: {
            enumerable: true,
            get: function () { return this.m_emitters; },
            set: function (_val) { this.m_emitters = _val; }
        },  
        gmlmode: {
            enumerable: true,
            get: function () { return this.m_mode; },
            set: function (_val) { this.m_mode = _val; }
        },     
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Real Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyRealTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[RealTrackKey]";

    this.m_realValue = 0;
    this.m_hasEmbeddedCurve = false;
    this.m_curveIndex = -1;
    this.m_pEmbeddedCurve = null;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_realValue = _pStorage.realValue;
        this.m_hasEmbeddedCurve = _pStorage.hasEmbeddedCurve;
        this.m_curveIndex = _pStorage.curveIndex;

        if (_pStorage.pEmbeddedCurve != undefined)
        {
            this.m_pEmbeddedCurve = new yyAnimCurve(_pStorage.pEmbeddedCurve);
        }        
    }

    this.UpdateDirtiness = function()
    {
        var currChangeIndex = this.changeIndex;
        for(var channel in this.m_channels)
        {
            var pCurve = g_pAnimCurveManager.GetCurveFromID(channel.m_curveIndex);
    
            if ((pCurve != null) && (pCurve.IsDirty(currChangeIndex)))
            {
                this.changeIndex = yymax(this.changeIndex, pCurve.changeIndex);			
            }
        }
    };

    Object.defineProperties(this, {
        gmlvalue: {
            enumerable: true,
            get: function () { return this.m_realValue; },
            set: function (_val)
            {
                this.m_realValue = yyGetReal(_val);

                // Clear curve data
                this.m_curveIndex = -1;
                this.m_hasEmbeddedCurve = false;
                this.m_pEmbeddedCurve = null;
            }
        }, 
        gmlhasEmbeddedCurve: {
            enumerable: true,
            get: function () { return this.m_hasEmbeddedCurve; },
            set: function (_val) { this.m_hasEmbeddedCurve = yyGetBool(_val); }
        },
        gmlcurve: {
            enumerable: true,
            get: function ()
            {
                var tempcurve = undefined;
                if ((this.m_hasEmbeddedCurve == true) && (this.m_pEmbeddedCurve != null))
                {
                    tempcurve = this.m_pEmbeddedCurve;
                }
                else
                {
                    tempcurve = g_pAnimCurveManager.Get(this.m_curveIndex);                    
                }

                if ((tempcurve == undefined) || (tempcurve == null))
                    return -1;
                else
                    return tempcurve;
            },
            set: function (_val)
            {
                if(typeof(_val) == "object")
                {
                    var idx = g_pAnimCurveManager.AnimCurves.indexOf(_val);
                    if (idx == -1)
                    {
                        // Embedded curve
                        this.m_pEmbeddedCurve = _val;
                        this.m_hasEmbeddedCurve = true;
                        this.m_curveIndex = -1;
                    }
                    else
                    {
                        this.m_curveIndex = idx;
                        this.m_hasEmbeddedCurve = false;
                        this.m_pEmbeddedCurve = null;
                    }
                }
                else
                {
                    // Check for valid index
                    if(g_pAnimCurveManager.Get(this.m_curveIndex) != null)
                    {
                        this.m_curveIndex = _val;
                        this.m_hasEmbeddedCurve = false;
                        this.m_pEmbeddedCurve = null;
                    }
                    else
                    {
                        throw new Error("Invalid curve passed to curve property of keyframe channel");
                    }
                }
            }
        },     
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Color Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyColorTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[ColorTrackKey]";

    this.m_color = 0;
    this.m_hasEmbeddedCurve = false;
    this.m_curveIndex = -1;
    this.m_pEmbeddedCurve = null;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_color = _pStorage.color;
        this.m_hasEmbeddedCurve = _pStorage.hasEmbeddedCurve;
        this.m_curveIndex = _pStorage.curveIndex;

        if (_pStorage.pEmbeddedCurve != undefined)
        {
            this.m_pEmbeddedCurve = new yyAnimCurve(_pStorage.pEmbeddedCurve);
        }        
    }

    Object.defineProperties(this, {
        gmlcolor: {
            enumerable: true,
            get: function ()
            {
                //return this.m_color;

                // Need to change from RGBA to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324	
                var col = [];
                col[1] = (this.m_color & 0xff) / 255.0;
                col[2] = ((this.m_color >> 8) & 0xff) / 255.0;
                col[3] = ((this.m_color >> 16) & 0xff) / 255.0;
                col[0] = ((this.m_color >> 24) & 0xff) / 255.0;

                return col;
            },
            set: function (_val)
            {                
                if (_val instanceof Array)
                {
                    // Need to change from ARGB to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324	
                    var col;
                    col = ((yyGetReal(_val[1]) * 255.0) & 0xff);
                    col |= ((yyGetReal(_val[2]) * 255.0) & 0xff) << 8;
                    col |= ((yyGetReal(_val[3]) * 255.0) & 0xff) << 16;
                    col |= ((yyGetReal(_val[0]) * 255.0) & 0xff) << 24;

                    this.m_color = col;
                }
                else
                {
                    this.m_color = yyGetInt32(_val);
                }

                // Clear curve data
                this.m_curveIndex = -1;
                this.m_hasEmbeddedCurve = false;
                this.m_pEmbeddedCurve = null;
            }
        },
        gmlcolour: {
            enumerable: true,
            get: function ()
            {
                //return this.m_color;

                // Need to change from RGBA to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324	
                var col = [];
                col[1] = (this.m_color & 0xff) / 255.0;
                col[2] = ((this.m_color >> 8) & 0xff) / 255.0;
                col[3] = ((this.m_color >> 16) & 0xff) / 255.0;
                col[0] = ((this.m_color >> 24) & 0xff) / 255.0;

                return col;
            },
            set: function (_val)
            {
                if (_val instanceof Array)
                {
                    // Need to change from ARGB to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324	
                    var col;
                    col = ((yyGetReal(_val[1]) * 255.0) & 0xff);
                    col |= ((yyGetReal(_val[2]) * 255.0) & 0xff) << 8;
                    col |= ((yyGetReal(_val[3]) * 255.0) & 0xff) << 16;
                    col |= ((yyGetReal(_val[0]) * 255.0) & 0xff) << 24;

                    this.m_color = col;
                }
                else
                {
                    this.m_color = yyGetInt32(_val);
                }

                // Clear curve data
                this.m_curveIndex = -1;
                this.m_hasEmbeddedCurve = false;
                this.m_pEmbeddedCurve = null;
            }
        },
        gmlcurve: {
            enumerable: true,
            get: function ()
{
                var tempcurve = undefined;
                if ((this.m_hasEmbeddedCurve == true) && (this.m_pEmbeddedCurve != null))
                {
                    tempcurve = this.m_pEmbeddedCurve;
                }
                else
                {
                    tempcurve = g_pAnimCurveManager.Get(this.m_curveIndex);
                }

                if ((tempcurve == undefined) || (tempcurve == null))
                    return -1;
                else
                    return tempcurve;
            },
            set: function (_val)
{
                if (typeof (_val) == "object")
{
                    var idx = g_pAnimCurveManager.AnimCurves.indexOf(_val);
                    if (idx == -1)
{
                        // Embedded curve
                        this.m_pEmbeddedCurve = _val;
                        this.m_hasEmbeddedCurve = true;
                        this.m_curveIndex = -1;
                    }
                    else
{
                        this.m_curveIndex = idx;
                        this.m_hasEmbeddedCurve = false;
                        this.m_pEmbeddedCurve = null;
                    }
                }
                else
{
                    // Check for valid index
                    if (g_pAnimCurveManager.Get(this.m_curveIndex) != null)
{
                        this.m_curveIndex = _val;
                        this.m_hasEmbeddedCurve = false;
                        this.m_pEmbeddedCurve = null;
                    }
                    else
{
                        throw new Error("Invalid curve passed to curve property of keyframe channel");
                    }
                }
            }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Bool Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyBoolTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[BoolTrackKey]";

    this.m_value = false;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_value = _pStorage.value;
    }

    Object.defineProperties(this, {
        gmlvalue: {
            enumerable: true,
            get: function () { return this.m_value; },
            set: function (_val) { this.m_value = yyGetBool(_val); }
        },        
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new String Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyStringTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[StringTrackKey]";

    this.m_value = "";

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_value = _pStorage.value;
    }

    Object.defineProperties(this, {
        gmlvalue: {
            enumerable: true,
            get: function () { return this.m_value; },
            set: function (_val) { this.m_value = yyGetString(_val); }
        },        
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Text Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yyTextTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[TextTrackKey]";

    this.text = "";
    this.wrap = false;
    this.alignment = 0;
    this.fontIndex = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.text = _pStorage.text;
        this.wrap = _pStorage.wrap;
        this.alignment = _pStorage.alignment;
        this.fontIndex = _pStorage.fontIndex;
    }

    Object.defineProperties(this, {
        gmltext: {
            enumerable: true,
            get: function () { return this.text; },
            set: function (_val) { this.text = yyGetString(_val); }
        },
        gmlwrap: {
            enumerable: true,
            get: function () { return this.wrap; },
            set: function (_val) { this.wrap = yyGetBool(_val); }
        },
        gmlalignmentV: {
            enumerable: true,
            get: function () { return (this.alignment >> 8) & 0xff; },
            set: function (_val) { this.alignment = (this.alignment & 0xff) | ((yyGetInt32(_val) & 0xff) << 8); }
        },
        gmlalignmentH: {
            enumerable: true,
            get: function () { return this.alignment & 0xff; },
            set: function (_val) { this.alignment = (this.alignment & ~0xff) | (yyGetInt32(_val) & 0xff); }
        },
        gmlfontIndex: {
            enumerable: true,
            get: function () { return this.fontIndex; },
            set: function (_val) { this.fontIndex = yyGetInt32(_val); }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Sequence Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.m_index = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_index = _pStorage.index;
    }

    Object.defineProperties(this, {
        gmlindex: {
            enumerable: true,
            get: function () { return this.m_index; },
            set: function (_val) { this.m_index = yyGetInt32(_val); }
        },        
    });

    this.__type = "[SequenceTrackKey]";
}

// #############################################################################################
/// Function:<summary>
///             Create a new SpriteFrames Track Key object
///          </summary>
// #############################################################################################
/** @constructor */
function yySpriteFramesTrackKey(_pStorage)
{
    yyTrackKeyBase.call(this); //base constructor

    this.__type = "[SpriteFramesTrackKey]";

    this.m_imageIndex = -1;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_imageIndex = _pStorage.imageIndex;
    }

    Object.defineProperties(this, {
        gmlimageIndex: {
            enumerable: true,
            get: function () { return this.m_imageIndex; },
            set: function (_val) { this.m_imageIndex = yyGetInt32(_val); }
        },        
    });
}

// #############################################################################################
/// Function:<summary>
///             Create a new Keyframe object
///          </summary>
// #############################################################################################
/** @constructor */
function yyKeyframe(_type, _pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[Keyframe]";

    this.m_key = 0;
    this.m_length = 0;
    this.m_stretch = false;
    this.m_disabled = false;
    this.m_channels = {};

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_key = _pStorage.key;
        this.m_length = _pStorage.length;
        this.m_stretch = _pStorage.stretch;
        this.m_disabled = _pStorage.disabled;

        this.m_channels = {};
        for(var channelKey in _pStorage.channels)
        {
            var data = _pStorage.channels[channelKey];
            var newKeyframe = null;

            switch(_type)
            {
                case eSTT_Graphic:
                    newKeyframe = new yyGraphicTrackKey(data);
                    break;
                case eSTT_Instance:
                    newKeyframe = new yyInstanceTrackKey(data);
                    break;
                case eSTT_Audio:
                    newKeyframe = new yyAudioTrackKey(data);
                    break;
                case eSTT_Text:
                    newKeyframe = new yyTextTrackKey(data);
                    break;
                case eSTT_Real:
                    newKeyframe = new yyRealTrackKey(data);
                    break;
                case eSTT_Color:
                    newKeyframe = new yyColorTrackKey(data);
                    break;
                case eSTT_Bool:
                    newKeyframe = new yyBoolTrackKey(data);
                    break;
                case eSTT_String:
                    newKeyframe = new yyStringTrackKey(data);
                    break;
                case eSTT_Sequence:
                    newKeyframe = new yySequenceTrackKey(data);
                    break;
                case eSTT_SpriteFrames:
                    newKeyframe = new yySpriteFramesTrackKey(data);
                    break;
            }

            if(newKeyframe != null)
            {
                newKeyframe.key = channelKey;
                this.m_channels[channelKey] = newKeyframe;
            }
            else
            {
                throw new Error("Invalid sequence track channel type");
            }
        }
        
    }

    this.SignalChange();

    Object.defineProperties(this, {
        gmlframe: {
            enumerable: true,
            get: function () { return this.m_key; },
            set: function (_val) { this.m_key = yyGetInt32(_val); }
        },
        gmllength: {
            enumerable: true,
            get: function () { return this.m_length; },
            set: function (_val) { this.m_length = yyGetInt32(_val); }
        },
        gmlstretch: {
            enumerable: true,
            get: function () { return this.m_stretch; },
            set: function (_val) { this.m_stretch = yyGetBool(_val); }
        },
        gmldisabled: {
            enumerable: true,
            get: function () { return this.m_disabled; },
            set: function (_val) { this.m_disabled = yyGetBool(_val); }
        },
        gmlchannels: {
            enumerable: true,
            get: function ()
            {
                var channelsArray = [];
                for(var channelKey in this.m_channels)
                {
                    channelsArray.push(this.m_channels[channelKey]);
                }

                channelsArray.sort(function(a, b) {return Number(a.key) - Number(b.key);});

                return channelsArray;
            },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_channels = {};
                    for(var channelIndex = 0; channelIndex < _val.length; channelIndex++)
                    {
                        var key = _val[channelIndex].m_channel;
                        this.m_channels[key] = _val[channelIndex];
                    }
                }
                else
                {
                    throw new Error("value must be an array of keyframes");
                }
            }
        }
    });
}


// #############################################################################################
/// Function:<summary>
///             Create a new KeyframeStore object
///          </summary>
// #############################################################################################
/** @constructor */
function yyKeyframeStore(_type, _pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[KeyframeStore]";

    this.numKeyframes = 0;
    this.keyframes = [];

    if ((_pStorage != null) && (_pStorage != undefined)) {
        var numKeyframeDatas = _pStorage.length;
        for (var keyframeIndex = 0; keyframeIndex < numKeyframeDatas; ++keyframeIndex) {
            this.AddKeyframe(new yyKeyframe(_type, _pStorage[keyframeIndex]));
        }
    }
}

// #############################################################################################
/// Function:<summary>
///             Updates the change index for the keyframe store
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.UpdateDirtiness = function()
{
    // Check status of key frames
	var currChangeIndex = this.changeIndex;
	for (var i = 0; i < this.numKeyframes; i++)
	{
		if (this.keyframes[i].IsDirty(currChangeIndex))
		{
			// Update the change index for this class
			this.changeIndex = yymax(this.changeIndex, this.keyframes[i].changeIndex);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Insert a new keyframe at the correct position in the keyframes array
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.AddKeyframe = function(_keyframe)
{
    var currindex = 0;
    while (currindex < this.numKeyframes)
    {
        if (this.keyframes[currindex].key > _keyframe.key)
        {
            break;
        }

        currindex++;
    }

    this.keyframes.splice(currindex, 0, _keyframe);
    this.numKeyframes++;

    this.SignalChange();
};

// #############################################################################################
/// Function:<summary>
///             Returns the keyframes around the given keyframe
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyFramesAround = function(_key)
{
    var retObj = {};

    if (this.numKeyframes == 0)
        return;

    var start = 0, end = this.numKeyframes;
    var index = (start + end) >> 1;
    var length;
    while (index != start)
    {
        // Get the length of the key, if it stretches it's either till next key or the end of the track
        length = this.keyframes[index].m_stretch
            ? (index + 1 < this.numKeyframes ? this.keyframes[index + 1].m_key : Number.MAX_SAFE_INTEGER)
            : this.keyframes[index].m_length;

        if (this.keyframes[index].m_key <= _key && this.keyframes[index].m_key + length > _key)
        {
            retObj.pre = this.keyframes[index];
            if (index < this.numKeyframes - 1)
                retObj.post = this.keyframes[index + 1];

            return retObj;
        }
        if (this.keyframes[index].m_key > _key) end = index;
        else start = index;
        index = (start + end) >> 1;
    }

    // Get the length of the key, if it stretches it's either till next key or the end of the track
    length = this.keyframes[index].m_stretch
        ? (index + 1 < this.numKeyframes ? this.keyframes[index + 1].m_key : Number.MAX_SAFE_INTEGER)
        : this.keyframes[index].m_length;

    if (this.keyframes[index].m_key <= _key && this.keyframes[index].m_key + length > _key)
    {
        retObj.pre = this.keyframes[index];
        if (index < this.numKeyframes - 1)
            retObj.post = this.keyframes[index + 1];
    }

    return retObj;
};

// #############################################################################################
/// Function:<summary>
///             Returns the keyframe index
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyframeIndexAtFrame = function(_key, _seqlength)
{
    if (this.numKeyframes == 0) return -1;

    var start = 0;
    var end = this.numKeyframes;
    var index = (start + end) >> 1;
    var length;

    while (index != start)
    {
        // Get the length of the key, if it stretches it's either till next key or the end of the track
        length = this.keyframes[index].m_stretch
            ? (index + 1 < this.numKeyframes ? this.keyframes[index + 1].m_key : 0x7fffffff)
            : this.keyframes[index].m_length;

        if (this.keyframes[index].m_key <= _key && this.keyframes[index].m_key + length > _key) return index;
        if (this.keyframes[index].m_key > _key) end = index;
        else start = index;

        index = (start + end) >> 1;
    }

    // Get the length of the key, if it stretches it's either till next key or the end of the track
    length = this.keyframes[index].m_stretch
        ? (index + 1 < this.numKeyframes ? this.keyframes[index + 1].m_key : 0x7fffffff)
        : this.keyframes[index].m_length;

    if (this.keyframes[index].m_key <= _key && this.keyframes[index].m_key + length > _key) return index;

    // Special-case hack for final keys that end at the end of the sequence
    // We need to do this now as for one-shot sequences we actually stop the sequence right at the end rather than just before the end
    if ((index == (this.numKeyframes - 1)) && (_key == _seqlength))
    {
        if ((this.keyframes[index].m_key + length) == _seqlength)
            return index;
    }

    return -1;
};

// #############################################################################################
/// Function:<summary>
///             Returns the keyframe at the given frame
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyframeAtFrame = function(_key, _seqlength)
{
    var keyframeindex = this.GetKeyframeIndexAtFrame(_key, _seqlength);

    if (keyframeindex == -1)
        return null;

    return this.keyframes[keyframeindex];
};


// #############################################################################################
/// Function:<summary>
///             Returns the keyframe index
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyFrameLength = function (_index, _seqlength) {
    if (_index < 0) {
        return 0.0;
    }
    else if (_index > this.numKeyframes) {
        return 0.0;
    }

    if (this.keyframes[_index].m_stretch) {
        if (_index < (this.numKeyframes - 1)) {
            var length = (this.keyframes[_index + 1].m_key - this.keyframes[_index].m_key) - 1.0;
            return length;
        }
        else {
            var length = (_seqlength - this.keyframes[_index].m_key) - 1.0;
            return length;
        }
    }
    else {
        return this.keyframes[_index].m_length;
    }
};





// #############################################################################################
/// Function:<summary>
///             Returns the keyframe index range
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyframeIndexRange = function (_start, _end, _out, _headDir, _includeEnd, _length) {

    if (_includeEnd == undefined)
        _includeEnd = false;
    if (_length == undefined)
        _length = -1.0;

    if (this.numKeyframes == 0)
        return false;

    var swapkeys = false;
    if (_start > _end)
    {
        var temp = _start;
        _start = _end;
        _end = temp;

        swapkeys = true;
    }

    var includeEnd = false;
    var includeStart = false;

    if (_headDir > 0.0)
    {
        includeStart = true;

        if (_includeEnd && (_end == _length))
        {
            includeEnd = true;
        }
    }
    else
    {
        // Because we're playing in reverse we're playing from the end backwards, so the 'start' is actually at _end (!) 
        includeEnd = true; 
 
        if (_includeEnd && (_start == 0.0)) 
        { 
            includeStart = true; 
        } 
    }

    // Check start and end keys
    //if (keyframes[0]->key >= _end)
    if ((includeEnd && (this.keyframes[0].m_key > _end)) || ((!includeEnd) && this.keyframes[0].m_key >= _end))
        return false;

    var lastkeyend = this.keyframes[this.numKeyframes - 1].m_key + this.keyframes[this.numKeyframes - 1].m_length;
    if ((this.keyframes[this.numKeyframes - 1].m_stretch == false) && ((lastkeyend < _start) || (!includeStart && ((lastkeyend == _start)))))
        return false;

    // Find start
    var startkey = 0;

    var start, end, mid;
    var pKey = null;

    // binary search
    start = 0;
    end = this.numKeyframes;

    mid = (start + end) >> 1;
    while (mid != start)
    {
        if (this.keyframes[mid].m_key > _start)
        {
            end = mid;
        }
        else
        {
            start = mid;
        }

        mid = (start + end) >> 1;
    }

    // Now check the length
    pKey = this.keyframes[mid];
    var startkeyend = pKey.m_key + pKey.m_length;
    if ((startkeyend < _start) || (!includeStart && (startkeyend == _start)))
    {
        // outwith the key boundary
        startkey = mid + 1;
    }
    else
    {
        startkey = mid;
    }


    // Find end
    var endkey = 0;

    // binary search
    start = 0;
    end = this.numKeyframes;

    mid = (start + end) >> 1;
    while (mid != start)
    {
        if ((includeEnd && (this.keyframes[mid].m_key > _end)) || ((!includeEnd) && (this.keyframes[mid].m_key >= _end)))
        {
            end = mid;
        }
        else
        {
            start = mid;
        }

        mid = (start + end) >> 1;
    }

    endkey = mid;

    if (endkey < startkey)
    {
        return false;
    }
    else
    {
        if (swapkeys)
        {
            _out.start = endkey;
            _out.end = startkey;
        }
        else
        {
            _out.start = startkey;
            _out.end = endkey;
        }

        return true;
    }
};

// #############################################################################################
/// Function:<summary>
///             Returns the keyframe index ranges
///          </summary>
// #############################################################################################
yyKeyframeStore.prototype.GetKeyframeIndexRanges = function (_loopmode, _speed, _length, _lastHeadPos, _headPos, _headDir, _startKeys, _endKeys, _includeExtremities, _wrapped) {

    if (_includeExtremities == undefined)
        _includeExtremities = false;

    if (_wrapped == undefined)
        _wrapped = false;

    var PINGPONG_DETECTION_EPSILON = 0.99;

    // Find key ranges we need to evaluate
    // Currently we don't handle more than a time difference longer than the sequence length per frame
    // which isn't ideal - need to fix		
    _startKeys[0] = _endKeys[0] = _startKeys[1] = _endKeys[1] = -1;

    var out = { start: -1, end: -1 };

    var havekeys = false;

    if (_loopmode == eSP_Normal)
    {
        havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _headPos, out, _headDir, _includeExtremities, _length);
        _startKeys[0] = out.start;
        _endKeys[0] = out.end;
    }
    else if (_loopmode == eSP_Loop)
    {
        if (_headDir > 0.0)
        {
            if (_wrapped || (_headPos < _lastHeadPos))
            {
                // This means that we have been through a loop transition		
                if (!_includeExtremities || (_lastHeadPos != _length))
                {
                    havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _length, out, _headDir, _includeExtremities, _length);

                    _startKeys[0] = out.start;
                    _endKeys[0] = out.end;
                }

                if (this.GetKeyframeIndexRange(0, _headPos, out, _headDir, _includeExtremities, _length))
                {
                    havekeys = true;
                    _startKeys[1] = out.start;
                    _endKeys[1] = out.end;
                }
            }
            else
            {
                havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _headPos, out, _headDir, _includeExtremities, _length);
                _startKeys[0] = out.start;
                _endKeys[0] = out.end;
            }
        }
        else
        {
            if (_wrapped || (_headPos > _lastHeadPos))
            {
                // This means that we have been through a loop transition		
                if (!_includeExtremities || (_lastHeadPos != 0))
                {
                    havekeys = this.GetKeyframeIndexRange(_lastHeadPos, 0, out, _headDir, _includeExtremities, _length);
                    _startKeys[0] = out.start;
                    _endKeys[0] = out.end;
                }

                if (this.GetKeyframeIndexRange(_length, _headPos, out, _headDir, _includeExtremities, _length))
                {
                    havekeys = true;
                    _startKeys[1] = out.start;
                    _endKeys[1] = out.end;
                }
            }
            else
            {
                havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _headPos, out, _headDir, _includeExtremities, _length);
                _startKeys[0] = out.start;
                _endKeys[0] = out.end;
            }
        }
    }
    else if (_loopmode == eSP_PingPong)
    {
        // hmmm.. currently we don't have enough information here to know for sure what happened
        // but we can make an educated guess
        var expectedelapsedtime = 0.0;
        if (_speed > 0.0)
        {
            expectedelapsedtime = 1.0 / _speed;
        }

        if (_headDir > 0.0)
        {
            if (_wrapped || (_headPos < _lastHeadPos) || ((_headPos - _lastHeadPos) < (expectedelapsedtime * PINGPONG_DETECTION_EPSILON)))
            {
                // This means that we have been through a pingpong transition		
                if (!_includeExtremities || (_lastHeadPos > 0))
                {
                    havekeys = this.GetKeyframeIndexRange(_lastHeadPos, 0, out, _headDir * -1.0, false);
                    _startKeys[0] = out.start;
                    _endKeys[0] = out.end;
                }

                if (this.GetKeyframeIndexRange(0, _headPos, out, _headDir, _includeExtremities, _length))
                {
                    havekeys = true;
                    _startKeys[1] = out.start;
                    _endKeys[1] = out.end;
                }
            }
            else
            {
                havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _headPos, out, _headDir, false);
                _startKeys[0] = out.start;
                _endKeys[0] = out.end;
            }
        }
        else
        {
            if (_wrapped || (_headPos > _lastHeadPos) || ((_lastHeadPos - _headPos) < (expectedelapsedtime * PINGPONG_DETECTION_EPSILON)))
            {
                // This means that we have been through a pingpong transition		
                if (!_includeExtremities || (_lastHeadPos < _length))
                {
                    havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _length, out, _headDir * -1.0, false);
                    _startKeys[0] = out.start;
                    _endKeys[0] = out.end;
                }

                if (this.GetKeyframeIndexRange(_length, _headPos, out, _headDir, _includeExtremities, _length))
                {
                    havekeys = true;
                    _startKeys[1] = out.start;
                    _endKeys[1] = out.end;
                }
            }
            else
            {
                havekeys = this.GetKeyframeIndexRange(_lastHeadPos, _headPos, out, _headDir, false);
                _startKeys[0] = out.start;
                _endKeys[0] = out.end;
            }
        }
    }

    return havekeys;
};

var typeToEventLut =
[
    "event_create",
    "event_destroy",
    "event_clean_up",
    "event_step",
    "event_step_begin",
    "event_step_end",
    "event_async_system"
];

// #############################################################################################
/// Function:<summary>
///             Create a new Sequence object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequence(_pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[Sequence]";

    this.pName = "";
    this.m_playback = 0;
    this.m_playbackSpeed = 30.0;
    this.m_playbackSpeedType = 0;
    this.m_length = 0;
    this.m_volume = 1.0;
    this.m_xorigin = 0;
    this.m_yorigin = 0;
    this.m_messageEventKeyframeStore = new yyKeyframeStore();
    this.m_messageEventKeyframeStore.numKeyframes = 0;
    this.m_messageEventKeyframeStore.keyframes = [];
    this.m_momentEventKeyframeStore = new yyKeyframeStore();
    this.m_momentEventKeyframeStore.numKeyframes = 0;
    this.m_momentEventKeyframeStore.keyframes = [];
    this.m_numTracks = 0;
    this.m_numEvents = 0;
    this.m_tracks = [];
    this["event_create"] = null;
    this["event_destroy"] = null;
    this["event_clean_up"] = null;
    this["event_step"] = null;
    this["event_step_begin"] = null;
    this["event_step_end"] = null;
    this["event_async_system"] = null;
    this["event_broadcast_message"] = null;
    this.fromWAD = false;


    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.pName = _pStorage.pName;
        this.m_playback = _pStorage.playback;
        this.m_playbackSpeed = _pStorage.playbackSpeed;
        this.m_playbackSpeedType = _pStorage.playbackSpeedType;
        this.m_length = _pStorage.length;
        this.m_volume = _pStorage.volume;
        this.m_xorigin = _pStorage.xorigin;
        this.m_yorigin = _pStorage.yorigin;

        // Create Message Event Keyframe Store and Keys
        this.m_messageEventKeyframeStore = new yyKeyframeStore();
        this.m_messageEventKeyframeStore.numKeyframes = 0;
        this.m_messageEventKeyframeStore.keyframes = [];
        for (var keyframeIndex = 0; keyframeIndex < _pStorage.keyframeStore.length; ++keyframeIndex) {
            
            var keyframeStoreData = _pStorage.keyframeStore[keyframeIndex];

            var keyframe = new yyKeyframe();

            keyframe.m_key = keyframeStoreData.key;
            if ((keyframe.m_key < this.m_length) && (keyframe.m_key > (this.m_length + (KEY_LENGTH_EPSILON * 2.0))))
                keyframe.m_key = this.m_length; // we're assuming that this message event key is supposed to be right at the end

            keyframe.m_length = 0;//keyframeStoreData.length; Message Event Keyframes should be of length 0
            keyframe.m_stretch = keyframeStoreData.stretch;
            keyframe.m_disabled = keyframeStoreData.disabled;

            keyframe.m_channels = {};
            for(var channelKey in keyframeStoreData.channels)
            {
                var channelData = keyframeStoreData.channels[channelKey];
                keyframe.m_channels[channelKey] = new yyMessageEventTrackKey(channelData);
            }

            this.m_messageEventKeyframeStore.AddKeyframe(keyframe);
        }

        // Create Code Event keyframe store
        this.m_momentEventKeyframeStore = new yyKeyframeStore();
        this.m_momentEventKeyframeStore.numKeyframes = 0;
        this.m_momentEventKeyframeStore.keyframes = [];
        
        // Create tracks list
        this.m_numTracks = _pStorage.tracks.length;
        this.m_tracks = [];
        for (var trackIndex = 0; trackIndex < this.m_numTracks; ++trackIndex) {
            this.m_tracks[trackIndex] = SequenceBaseTrack_Load(_pStorage.tracks[this.m_numTracks - 1 - trackIndex]);
        }

        this.m_numEvents = _pStorage.sequenceEvents.length;

        for (var eventIndex = 0; eventIndex < this.m_numEvents; ++eventIndex)
        {
            var obj = _pStorage.sequenceEvents[eventIndex];

            var eventType = typeToEventLut[obj.seqEventType];
            this[eventType] = obj.seqEventFunction;
            obj.seqEventFunction.origfunc = obj.seqEventFunction;
        }

        // Create Moment Event Keyframe Store and Keys
        this.m_momentEventKeyframeStore = new yyKeyframeStore();
        this.m_momentEventKeyframeStore.numKeyframes = 0;
        this.m_momentEventKeyframeStore.keyframes = [];
        for (var keyframeIndex = 0; keyframeIndex < _pStorage.momentsKeystore.length; ++keyframeIndex) {
            
            var keyframeStoreData = _pStorage.momentsKeystore[keyframeIndex];
        
            var keyframe = new yyKeyframe();
        
            keyframe.m_key = keyframeStoreData.key;
            if ((keyframe.m_key < this.m_length) && (keyframe.m_key > (this.m_length + (KEY_LENGTH_EPSILON * 2.0))))
                keyframe.m_key = this.m_length; // we're assuming that this moment event key is supposed to be right at the end

            keyframe.m_length = 0;//keyframeStoreData.length; Message Event Keyframes should be of length 0
            keyframe.m_stretch = keyframeStoreData.stretch;
            keyframe.m_disabled = keyframeStoreData.disabled;
        
            keyframe.m_channels = {};
            for(var channelKey in keyframeStoreData.channels)
            {
                var channelData = keyframeStoreData.channels[channelKey];
                keyframe.m_channels[channelKey] = new yyMomentEventTrackKey(channelData);
            }
        
            this.m_momentEventKeyframeStore.AddKeyframe(keyframe);
        }

        this.fromWAD = true;
    }


    Object.defineProperties(this, {
        gmlname: {
            enumerable: true,
            get: function () { return this.pName; },
            set: function (_val) { this.pName = yyGetString(_val); }
        },        
        gmlloopmode: {
            enumerable: true,
            get: function () { return this.m_playback; },
            set: function (_val)
            {
                var val = yyGetInt32(_val);
                if ((val >= 0) && (val < eSP_Max))
                {
                    this.m_playback = val;
                }
                else
                {
                    debug("Trying to set loopmode property of sequence to out-of-bounds value " + yyGetReal(_val));
                }
            }
        },
        gmlplaybackSpeed: {
            enumerable: true,
            get: function () { return this.m_playbackSpeed; },
            set: function (_val) { this.m_playbackSpeed = yyGetReal(_val); }
        },
        gmlplaybackSpeedType: {
            enumerable: true,
            get: function () { return this.m_playbackSpeedType; },
            set: function (_val)
            {
                var val = yyGetInt32(_val);
                if ((val >= 0) && (val < ePlaybackSpeedType_Max))
                {
                    this.m_playbackSpeedType = val;
                }
                else
                {
                    debug("Trying to set playbackSpeedType property of sequence to out-of-bounds value " + yyGetReal(_val));
                }
            }
        },
        gmllength: {
            enumerable: true,
            get: function () { return this.m_length; },
            set: function (_val)
            {
                _val = yyGetReal(_val);
                _val = yymax(_val, 0.0);    // no negative lengths
                this.m_length = _val;
            }
        },
        gmlvolume: {
            enumerable: true,
            get: function () { return this.m_volume; },
            set: function (_val)
            {
                _val = yyGetReal(_val);
                _val = yymax(_val, 0.0);    // no negative volumes
                this.m_volume = _val;
            }
        },
        gmlxorigin: {
            enumerable: true,
            get: function () { return this.m_xorigin; },
            set: function (_val) { this.m_xorigin = yyGetReal(_val); }
        },
        gmlyorigin: {
            enumerable: true,
            get: function () { return this.m_yorigin; },
            set: function (_val) { this.m_yorigin = yyGetReal(_val); }
        },
        gmltracks: {
            enumerable: true,
            get: function () { return this.m_tracks; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_tracks = _val;
                }
                else
                {
                    throw new Error("value must be an array of tracks");
                }
            }
        },
        gmlmessageEventKeyframes: {
            enumerable: true,
            get: function () { return this.m_messageEventKeyframeStore.keyframes; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_messageEventKeyframeStore.keyframes = _val;
                    this.m_messageEventKeyframeStore.numKeyframes = _val.length;
                }
                else
                {
                    throw new Error("value must be an array of keyframes");
                }
            }
        },
        gmlmomentKeyframes: {
            enumerable: true,
            get: function () { return this.m_momentEventKeyframeStore.keyframes; },
            set: function (_val)
                {
                if (_val instanceof Array)
                {
                    this.m_momentEventKeyframeStore.keyframes = _val;
                    this.m_momentEventKeyframeStore.numKeyframes = _val.length;
                }
                else
                {
                    throw new Error("value must be an array of keyframes");
                }
            }
        },
        gmlevent_create: {
            enumerable: true,
            get: function () { return this["event_create"]; },
            set: function (_val) { this["event_create"] = _val; }            
        },
        gmlevent_destroy: {
            enumerable: true,
            get: function () { return this["event_destroy"]; },
            set: function (_val) { this["event_destroy"] = _val; }
        },
        gmlevent_clean_up: {
            enumerable: true,
            get: function () { return this["event_clean_up"]; },
            set: function (_val) { this["event_clean_up"] = _val; }
        },
        gmlevent_step: {
            enumerable: true,
            get: function () { return this["event_step"]; },
            set: function (_val) { this["event_step"] = _val; }
        },
        gmlevent_step_begin: {
            enumerable: true,
            get: function () { return this["event_step_begin"]; },
            set: function (_val) { this["event_step_begin"] = _val; }
        },
        gmlevent_step_end: {
            enumerable: true,
            get: function () { return this["event_step_end"]; },
            set: function (_val) { this["event_step_end"] = _val; }
        },
        gmlevent_async_system: {
            enumerable: true,
            get: function () { return this["event_async_system"]; },
            set: function (_val) { this["event_async_system"] = _val; }
        },
        gmlevent_broadcast_message: {
            enumerable: true,
            get: function () { return this["event_broadcast_message"]; },
            set: function (_val) { this["event_broadcast_message"] = _val; }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Returns an array containing all object ids within the sequence instance
///          </summary>
///
// #############################################################################################
yySequence.prototype.GetObjectIDs = function() {
    var ids = [];
    this.GetObjectIDsFromTrack(this.m_tracks, ids);
    return ids;
};

// #############################################################################################
/// Function:<summary>
///             Returns an array containing all object ids within the given track recursively
///          </summary>
///
// #############################################################################################
yySequence.prototype.GetObjectIDsFromTrack = function(_tracks, _ids) {

    for (var trackIndex = 0; trackIndex < _tracks.length; ++trackIndex)
    {
        var track = _tracks[trackIndex];

		if (track.m_type == eSTT_Instance)
		{
			// Scan through keyframes
			var pInstTrack = track;
			if (pInstTrack.m_keyframeStore != null)
			{
				var numkeys = pInstTrack.m_keyframeStore.numKeyframes;
				for (var i = 0; i < numkeys; i++)
				{
					var pKey = pInstTrack.m_keyframeStore.keyframes[i];

					// Check key channels
                    for(var channelKey in pKey.m_channels)
                    {
                        var ppKey = pKey.m_channels[channelKey];

						if (ppKey.m_objectIndex != -1)
						{
							// Check to see if we have this object already
							if (_ids.indexOf(ppKey.m_objectIndex) == -1)
							{
                                _ids.push(ppKey.m_objectIndex);
							}
						}
					}
				}
			}
		}
		else if (track.m_type == eSTT_ClipMask)
		{
			var pMaskTrack = track;
			this.GetObjectIDsFromTrack(pMaskTrack.GetMaskTrack(), _ids);
			this.GetObjectIDsFromTrack(pMaskTrack.GetSubjectTrack(), _ids);
		}
		else if (track.m_type == eSTT_Sequence)
		{
			var pSeqTrack = track;
			if (pSeqTrack.m_keyframeStore != null)
			{
				var numkeys = pSeqTrack.m_keyframeStore.numKeyframes;
				for (var i = 0; i < numkeys; i++)
				{
					var pKey = pSeqTrack.m_keyframeStore.keyframes[i];

					// Check key channels
                    for(var channelKey in pKey.m_channels)
                    {
                        var ppKey = pKey.m_channels[channelKey];

						if (ppKey.m_index != -1)
						{
							var pSeq = g_pSequenceManager.GetSequenceFromID(ppKey.m_index);
							if (pSeq != null)
							{
								this.GetObjectIDsFromTrack(pSeq.m_tracks, _ids);
							}
						}
					}
				}
			}
		}

		// Check subtracks
		this.GetObjectIDsFromTrack(track.m_tracks, _ids);
	}
};


// #############################################################################################
/// Function:<summary>
///             Create a new Sequences management object
///          </summary>
// #############################################################################################
/** @constructor */
function yySequenceManager() {
    this.Sequences = [];
    this.Instances = [];
}

// #############################################################################################
/// Function:<summary>
///             Add a new sequence into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Sequence Storage</param>
// #############################################################################################
yySequenceManager.prototype.Add = function (_pStorage) {
    var pBack = null;
    if (_pStorage != null) {
        pBack = new yySequence(_pStorage);
    }
    this.Sequences[this.Sequences.length] = pBack;
};

// #############################################################################################
/// Function:<summary>
///             Add a new sequence into the pool and return that sequence
///          </summary>
// #############################################################################################
yySequenceManager.prototype.GetNewSequence = function () {
    var pBack = new yySequence();
    var i;
    for (i = 0; i < this.Sequences.length; i++)
    {
        if (this.Sequences[i] == null)
        {
            this.Sequences[i] = pBack;
            return pBack;
        }
    }

    this.Sequences[this.Sequences.length] = pBack;    
    return pBack;
};

yySequenceManager.prototype.FreeSequence = function (_seq)
{
    if (typeof(_seq) == "object")
    //if (_val instanceof yySequence)
    {
        // Search for sequence in array
        var i;
        for(i = 0; i < this.Sequences.length; i++)
        {
            if (this.Sequences[i] == _seq)
            {
                this.Sequences[i] = null;           // scrub from array
                return;
            }
        }
    }
    else
    {
        if ((_seq >= 0) && (_seq < this.Sequences.length))
        {
            this.Sequences[_seq] = null;
            return;
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Get the Sequence at the given index
///          </summary>
///
/// In:		 <param name="_ind">Sequence index</param>
// #############################################################################################
yySequenceManager.prototype.GetSequenceFromID = function (_ind) {
    if ((_ind < 0) || (_ind >= this.Sequences.length)) {
        return undefined;
    }
    return this.Sequences[_ind];
};

yySequenceManager.prototype.IsLiveSequence = function (_seq)
{
    if ((typeof (_seq) == "object") && (_seq instanceof yySequence))
    {
        // Search for sequence in array
        var i;
        for (i = 0; i < this.Sequences.length; i++)
        {
            if (this.Sequences[i] == _seq)
            {
                return true;
            }
        }
    }

    return false;
};

//returns: true if sequence with give id exists
function _sequence_exists(_index)                   // need to add the underscore at the start so it doesn't class with the GML "sequence_exists"
{
    var pSequence = g_pSequenceManager.Get(_index);
    if( pSequence !== undefined && pSequence !== null )
        return true;
    return false;
}

//returns: name of sequence with given index, or empty string
function sequence_get_name(_index)
{
    var pSequence = g_pSequenceManager.Get(_index);
    if( pSequence !== undefined && pSequence !== null )
        return pSequence.pName;
    return "";
}


// #############################################################################################
/// Function:<summary>
///             Get the SequenceInstance at the given index
///          </summary>
///
/// In:		 <param name="_ind">Sequence index</param>
// #############################################################################################
yySequenceManager.prototype.GetInstanceFromID = function (_ind) {
    if ((_ind < 0) || (_ind >= this.Instances.length)) {
        return undefined;
    }
    return this.Instances[_ind];
};

// #############################################################################################
/// Function:<summary>
///             Deletes the SequenceInstance at the given index
///          </summary>
///
/// In:		 <param name="_ind">Sequence index</param>
// #############################################################################################
yySequenceManager.prototype.FreeInstanceFromID = function (_ind) {
    //this.Instances.splice(_ind, 1);
    this.Instances[_ind] = null;
};

yySequenceManager.prototype.FreeInstance = function (_pInst)
{
    if (_pInst == null)
        return;

    _pInst.CleanupInstances();
    _pInst.CleanupAudioEmitters();

    this.FreeInstanceFromID(_pInst.m_instanceIndex);    
};

// #############################################################################################
/// Function:<summary>
///             Finds the sequence with the given name
///          </summary>
///
/// In:		 <param name="_name">Sequence name</param>
// #############################################################################################
yySequenceManager.prototype.FindSequence = function (_name) {
    for (var i = 0; i < this.Sequences.length; i++) {
        if (this.Sequences[i].pName == _name) {
            return i;
        }
    }
    return -1;
};

// #############################################################################################
/// Function:<summary>
///             Create and return a new CSequenceInstance
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.GetNewInstance = function ()
{
    var index;
    for (index = 0; index < this.Instances.length; index++)
    {
        if (this.Instances[index] == null)
        {            
            break;
        }
    }
    
    this.Instances[index] = new CSequenceInstance(index);
    return this.Instances[index];
};

var g_pMessageEvents = [];
var g_pMomentEvents = [];
var g_pSpriteMessageEvents = [];

function AddMessageEvent(_pKey, _seqElementID)
{    
    var newEvt = new Object();
    newEvt.pKey = _pKey;
    newEvt.seqElementID = _seqElementID;
    g_pMessageEvents[g_pMessageEvents.length] = newEvt;
}

function AddMomentEvent(_pKey, _pSeqInst)
{
    var newEvt = new Object();
    newEvt.pKey = _pKey;
    newEvt.pSeqInst = _pSeqInst;    
    g_pMomentEvents[g_pMomentEvents.length] = newEvt;
}

function AddSpriteMessageEvent(_pKey, _elementID)
{    
    var newEvt = new Object();
    newEvt.pKey = _pKey;
    newEvt.elementID = _elementID;
    g_pSpriteMessageEvents[g_pSpriteMessageEvents.length] = newEvt;
}

// #############################################################################################
/// Function:<summary>
///              Clears out the list of sprite message events by instantiating it with an empty list.
///          </summary>
///
// #############################################################################################

function ResetSpriteMessageEvents()
{
    g_pSpriteMessageEvents = [];
}

yySequenceManager.prototype.EvaluateLayerSequenceElement = function(_pSeqEl, _preDrawUpdate)
{
    if (_pSeqEl == null)
        return;

    var instance = this.Instances[_pSeqEl.m_instanceIndex];

    if (instance != null)
    {
        if ((_pSeqEl.m_dirtyflags == 0) && (_preDrawUpdate || (instance.m_paused && instance.m_hasPlayed) || instance.m_finished))
            return;

        var fps = g_GameTimer.GetFPS();

        instance.m_wrapped = false;

        if (instance.m_hasPlayed == false)			// possibly check for dirtiness here too
        {
            // Scan through the track tree in the associated sequence and see if there's any instances we have to create
            var pSeq = g_pSequenceManager.GetSequenceFromID(instance.m_sequenceIndex);
            if (pSeq != null)
            {
                g_SeqStack.push(pSeq);
                instance.SetupInstances(pSeq.m_tracks, -1, -1, _pSeqEl.m_layer.m_id);
                instance.SetupAudioEmitters(pSeq.m_tracks);
                g_SeqStack.pop();
            }

            instance.m_hasPlayed = true;
        }


        var sequence = this.Sequences[instance.m_sequenceIndex];

        if(sequence != null)
        {
            g_SeqStack.push(sequence);

            // Update instance
            //instance.m_volume = sequence.m_volume;

            // Advance the playhead in the current direction
            // If we fall off the end of the sequence use the playback method to figure out what to do
            instance.lastHeadPosition = instance.m_headPosition;

            if(!_preDrawUpdate && !instance.m_paused && !instance.m_finished)
            {
                var sequenceSpeed = sequence.m_playbackSpeed;
                if (sequence.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
                {
                    sequenceSpeed /= fps;
                }
                instance.m_headPosition += instance.m_headDirection * instance.m_speedScale * sequenceSpeed;
            }

            var tmp = { headPosition: instance.m_headPosition, headDirection: instance.m_headDirection, finished: instance.m_finished };
            instance.m_wrapped = HandleSequenceWrapping(sequence, tmp);
            instance.m_headPosition = tmp.headPosition;
            instance.m_headDirection = tmp.headDirection;                

            var currMatrix = new Matrix();  // possibly set to current world mat?
            
            var setmat = sequence.m_xorigin != 0 || sequence.m_yorigin != 0 ||
                        _pSeqEl.m_x != 0 || _pSeqEl.m_y != 0 ||
                        _pSeqEl.m_angle != 0 ||
                        _pSeqEl.m_scaleX != 1 || _pSeqEl.m_scaleY != 1 ||
                        _pSeqEl.m_layer.m_xoffset != 0 || _pSeqEl.m_layer.m_yoffset != 0;
            if (setmat)
            {
                var scaleMat = new Matrix();
                var rotMat = new Matrix();
                var offsetMat = new Matrix();
                var originMat = new Matrix();

                scaleMat.SetScale(_pSeqEl.m_scaleX, _pSeqEl.m_scaleY, 1);
                rotMat.SetZRotation(_pSeqEl.m_angle);					
                originMat.SetTranslation(-sequence.m_xorigin, -sequence.m_yorigin, 0);
                offsetMat.SetTranslation(_pSeqEl.m_x + _pSeqEl.m_layer.m_xoffset, _pSeqEl.m_y + _pSeqEl.m_layer.m_yoffset, 0);

                var tempmat1 = new Matrix();
                var tempmat2 = new Matrix();
                tempmat1.Multiply(originMat, scaleMat);
                tempmat2.Multiply(tempmat1, rotMat);
                tempmat1.Multiply(tempmat2, offsetMat);

                var oldWorldMat = new Matrix(currMatrix);
                currMatrix.Multiply(tempmat1, oldWorldMat);
            }
                            
            this.HandleUpdateTracks(_pSeqEl, sequence, instance, instance.evalNodeHead, instance, currMatrix, null, sequence.m_tracks, instance.m_headPosition, instance.lastHeadPosition, instance.m_headDirection, false);

            if (!_preDrawUpdate && !instance.m_paused && !instance.m_finished)
            {
                this.HandleMessageEvents(instance, sequence, _pSeqEl.m_id, fps);
                this.HandleMomentEvents(instance, sequence, _pSeqEl.m_id, fps);
            }

            if (tmp.finished)
            {
                instance.SetInstanceInSequenceStatus(false);
                instance.StopAllSounds();
            }

            instance.m_finished = tmp.finished;
            _pSeqEl.m_dirtyflags = 0;
        
            g_SeqStack.pop();
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Updates the sequence instances in a given room
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.UpdateInstancesForRoom = function (_room) {

    if (_room == null) {
        return;
    }

    g_pMessageEvents = [];
    g_pMomentEvents = [];

    var fps = g_GameTimer.GetFPS();

    for (var instanceIndex = 0; instanceIndex < _room.m_SequenceInstancesIds.length; ++instanceIndex)
    {
        var sequenceInstanceId = _room.m_SequenceInstancesIds[instanceIndex];
        var sequenceElement = g_pLayerManager.GetElementFromID(_room, sequenceInstanceId);
        if (sequenceElement == null)
            continue;

        this.EvaluateLayerSequenceElement(sequenceElement, false);
    }

    this.ProcessMessageEvents();
    this.ProcessMomentEvents();
};

// #############################################################################################
/// Function:<summary>
///             Updates the sequence instances in a given room
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.PerformInstanceEvents = function (_room, _eventType)
{

    if (_room == null)
    {
        return;
    }

    var eventName;

    switch(_eventType)
    {
        case EVENT_STEP_NORMAL: eventName = "event_step"; break;
        case EVENT_STEP_BEGIN: eventName = "event_step_begin"; break;
        case EVENT_STEP_END: eventName = "event_step_end"; break;
        case EVENT_OTHER_SYSTEM_EVENT: eventName = "event_async_system"; break;
        case EVENT_OTHER_BROADCAST_MESSAGE: eventName = "event_broadcast_message"; break;
        default: return;    // not supported
    }    

    for (var instanceIndex = 0; instanceIndex < _room.m_SequenceInstancesIds.length; ++instanceIndex)
    {
        var sequenceInstanceId = _room.m_SequenceInstancesIds[instanceIndex];
        var sequenceElement = g_pLayerManager.GetElementFromID(_room, sequenceInstanceId);
        if (sequenceElement == null)
            continue;

        var instance = this.Instances[sequenceElement.m_instanceIndex];

        if (instance != null)
        {
            if(instance.paused || instance.finished)
                continue;

            var sequence = this.Sequences[instance.m_sequenceIndex];

            if (sequence != null)
            {
                // Look for variable with the appropriate event name
                if (sequence[eventName] != null)
                {
                    sequence[eventName].origfunc.call(instance, instance);     // use the instance as "this"
                }
            }
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Updates the sequence instances in a given room
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleInstanceEvent = function (_seqInst, _eventType)
{
    if (_seqInst == null)
    {
        return;
    }

    var eventName;

    switch (_eventType)
    {
        case EVENT_STEP_NORMAL: eventName = "event_step"; break;
        case EVENT_STEP_BEGIN: eventName = "event_step_begin"; break;
        case EVENT_STEP_END: eventName = "event_step_end"; break;

        case EVENT_CREATE: eventName = "event_create"; break;
        case EVENT_DESTROY: eventName = "event_destroy"; break;
        case EVENT_CLEAN_UP: eventName = "event_clean_up"; break;
        default: return;    // not supported
    }

    var sequence = this.Sequences[_seqInst.m_sequenceIndex];

    if (sequence != null)
    {
        // Look for variable with the appropriate event name
        if (sequence[eventName] != null)
        {
            sequence[eventName].origfunc.call(_seqInst, _seqInst);     // use the instance as "this"
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleMessageEvents = function (_pSeqInst, _pSeq, _seqElementID, _fps)
{
    if (_pSeqInst == null)
    return;

    if (_pSeq == null)
        return;

    if (_pSeq.m_messageEventKeyframeStore.numKeyframes == 0)
        return;

    var startkeys = [];
    var endkeys = [];

    var seqSpeed = _pSeq.m_playbackSpeed;
	if (_pSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
		seqSpeed /= _fps;
	if (_pSeqInst.m_speedScale != 0.0)
		seqSpeed *= _pSeqInst.m_speedScale;
	var headDir = _pSeqInst.m_headDirection;
	if (seqSpeed < 0.0)
	{
	    // Handle negative speed scales
	    headDir = -headDir;
	    seqSpeed = -seqSpeed;
	}
	var havekeys = _pSeq.m_messageEventKeyframeStore.GetKeyframeIndexRanges(_pSeq.m_playback, 1.0 / seqSpeed, _pSeq.m_length, _pSeqInst.lastHeadPosition, _pSeqInst.m_headPosition, headDir, startkeys, endkeys, true, _pSeqInst.m_wrapped);
    if (!havekeys)
        return;

    var numkeygroups = 1, offset = 0;
    if (startkeys[1] != -1) numkeygroups = 2;
    if (startkeys[0] == -1) offset = 1;

    for (var k = offset; k < numkeygroups; k++)
    {
        var startkey = startkeys[k];
        var endkey = endkeys[k];
        var inc = 1;
        if (startkey > endkey)
            inc = -1;

        // We want to trigger events in the order the playhead would have hit them
        var i = startkey;
        do
        {
            var pKey = _pSeq.m_messageEventKeyframeStore.keyframes[i];
            AddMessageEvent(pKey, _seqElementID);            

            if (i == endkey)
                break;

            i += inc;
        } while (true);		
    }
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleMomentEvents = function (_pSeqInst, _pSeq, _seqElementID, _fps)
{
    if (_pSeqInst == null)
        return;

    if (_pSeq == null)
        return;

    if (_pSeq.m_momentEventKeyframeStore.numKeyframes == 0)
        return;

    var startkeys = [];
    var endkeys = [];

    var seqSpeed = _pSeq.m_playbackSpeed;
	if (_pSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
		seqSpeed /= _fps;
	if (_pSeqInst.m_speedScale != 0.0)
        seqSpeed *= _pSeqInst.m_speedScale;
	var headDir = _pSeqInst.m_headDirection;
	if (seqSpeed < 0.0)
	{
	    // Handle negative speed scales
	    headDir = -headDir;
	    seqSpeed = -seqSpeed;
	}
	var havekeys = _pSeq.m_momentEventKeyframeStore.GetKeyframeIndexRanges(_pSeq.m_playback, 1.0 / seqSpeed, _pSeq.m_length, _pSeqInst.lastHeadPosition, _pSeqInst.m_headPosition, headDir, startkeys, endkeys, true, _pSeqInst.m_wrapped);
    if (!havekeys)
        return;

    var numkeygroups = 1, offset = 0;
    if (startkeys[1] != -1) numkeygroups = 2;
    if (startkeys[0] == -1) offset = 1;

    for (var k = offset; k < numkeygroups; k++)
    {
        var startkey = startkeys[k];
        var endkey = endkeys[k];
        var inc = 1;
        if (startkey > endkey)
            inc = -1;

        // We want to trigger events in the order the playhead would have hit them
        var i = startkey;
        do
        {
            var pKey = _pSeq.m_momentEventKeyframeStore.keyframes[i];
            AddMomentEvent(pKey, _pSeqInst);
            
            if (i == endkey)
                break;

            i += inc;
        } while (true);
    }
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
//yySequenceManager.prototype.HandleSpriteMessageEvents = function (_pSeqInst, _pSeq, _elementID, _fps)
function HandleSpriteMessageEvents(_pSeq, _elementID, _fps, _speedScale, _headDirection, _lastHeadPosition, _headPosition)
{
    if (_pSeq == null)
        return;

    if (_pSeq.m_messageEventKeyframeStore.numKeyframes == 0)
        return;

    var startkeys = [];
    var endkeys = [];

    var seqSpeed = _pSeq.m_playbackSpeed;
	if (_pSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
		seqSpeed /= _fps;
	if (_speedScale != 0.0)
		seqSpeed *= _speedScale;
	var headDir = _headDirection;
	if (seqSpeed < 0.0)
	{
	    // Handle negative speed scales
	    headDir = -headDir;
	    seqSpeed = -seqSpeed;
	}
	var havekeys = _pSeq.m_messageEventKeyframeStore.GetKeyframeIndexRanges(_pSeq.m_playback, 1.0 / seqSpeed, _pSeq.m_length, _lastHeadPosition, _headPosition, headDir, startkeys, endkeys, true);
    if (!havekeys)
        return;

    var numkeygroups = 1, offset = 0;
    if (startkeys[1] != -1) numkeygroups = 2;
    if (startkeys[0] == -1) offset = 1;

    for (var k = offset; k < numkeygroups; k++)
    {
        var startkey = startkeys[k];
        var endkey = endkeys[k];
        var inc = 1;
        if (startkey > endkey)
            inc = -1;

        // We want to trigger events in the order the playhead would have hit them
        var i = startkey;
        do
        {
            var pKey = _pSeq.m_messageEventKeyframeStore.keyframes[i];
            AddSpriteMessageEvent(pKey, _elementID);            

            if (i == endkey)
                break;

            i += inc;
        } while (true);		
    }
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.ProcessMessageEvents = function ()
{    
    for (var i = 0; i < g_pMessageEvents.length; i++)
    {
        var pKey = g_pMessageEvents[i].pKey;
        var eventlist = pKey.m_channels[0];

        for (var j = 0; j < eventlist.m_events.length; j++)
        {
            // Trigger a separate event for each string (we could group them together if that's preferable)
            //eventlist.
            var map = ds_map_create();
            g_pBuiltIn.event_data = map;
            ds_map_add(map, "event_type", "sequence event");
            ds_map_add(map, "element_id", g_pMessageEvents[i].seqElementID);
            ds_map_add(map, "message", eventlist.m_events[j]);

            g_pSequenceManager.PerformInstanceEvents(g_RunRoom, EVENT_OTHER_BROADCAST_MESSAGE);

            //g_pObjectManager.ThrowEvent(EVENT_OTHER_SYSTEM_EVENT, 0);            
            g_pObjectManager.ThrowEvent(EVENT_OTHER_BROADCAST_MESSAGE, 0);

            ds_map_destroy(map);
            g_pBuiltIn.event_data = -1;
        }        
    }    
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.ProcessMomentEvents = function ()
{   
    // We want to trigger events in the order the playhead would have hit them
    for (var i = 0; i < g_pMomentEvents.length; i++)
    {
        var pKey = g_pMomentEvents[i].pKey;
        var codeevent = pKey.m_channels[0];

        if (codeevent.m_event != null)
        {
            codeevent.m_event.origfunc.call(g_pMomentEvents[i].pSeqInst, g_pMomentEvents[i].pSeqInst);     // use the instance as "this" (also pass through as the first parameter so _inst inside the function is also the instance)
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Handles the throwing of events which are triggered
///             by the sequence's message event keyframes.
///          </summary>
///
// #############################################################################################
function ProcessSpriteMessageEvents()
{    
    for (var i = 0; i < g_pSpriteMessageEvents.length; i++)
    {
        var pKey = g_pSpriteMessageEvents[i].pKey;
        var eventlist = pKey.m_channels[0];

        for (var j = 0; j < eventlist.m_events.length; j++)
        {
            // Trigger a separate event for each string (we could group them together if that's preferable)
            //eventlist.
            var map = ds_map_create();
            g_pBuiltIn.event_data = map;
            ds_map_add(map, "event_type", "sprite event");
            ds_map_add(map, "element_id", g_pSpriteMessageEvents[i].elementID);
            ds_map_add(map, "message", eventlist.m_events[j]);

            g_pSequenceManager.PerformInstanceEvents(g_RunRoom, EVENT_OTHER_BROADCAST_MESSAGE);

            //g_pObjectManager.ThrowEvent(EVENT_OTHER_SYSTEM_EVENT, 0);            
            g_pObjectManager.ThrowEvent(EVENT_OTHER_BROADCAST_MESSAGE, 0);

            ds_map_destroy(map);
            g_pBuiltIn.event_data = -1;
        }        
    }    
};

// #############################################################################################
/// Function:<summary>
///             Handles the sequences when it reaches the end of its timeline.
///             The sequence will either stop, loop, or switch head direction.
///          </summary>
///
// #############################################################################################
function HandleSequenceWrapping(_sequence, _retVals)
{
    if (_sequence == null)
    {
        return false;
    }

    var end = _sequence.m_length;// + SEQ_KEY_LENGTH_EPSILON;
    var hasWrapped = false;

    if (_sequence.m_playback == eSP_Normal)
    {
        if (_retVals.headPosition <= 0.0)
        {
            _retVals.headPosition = 0.0;
            if (_retVals.headDirection < 0.0)
            {
                hasWrapped = true;
                _retVals.finished = true;
            }
        }
        else if (_retVals.headPosition >= end)
        {
            _retVals.headPosition = end;
            if (_retVals.headDirection > 0.0)
            {
                _retVals.finished = true;
                hasWrapped = true;
            }
        }
    }
    else if (_sequence.m_playback == eSP_Loop)
    {
        if ((_retVals.headPosition < 0.0) || (_retVals.headPosition >= end))
        {
            hasWrapped = true;
        }

        if (end > 0)
        {
            _retVals.headPosition = fwrap(_retVals.headPosition, end);
        }
    }
    else if (_sequence.m_playback == eSP_PingPong)
    {
        if ((_retVals.headPosition < 0.0) || (_retVals.headPosition >= end))
        {
            if (_retVals.headPosition < 0.0)
            {
                _retVals.headPosition *= -1.0;
            }

            var loops = (_retVals.headPosition / end);
            _retVals.headPosition = fwrap(_retVals.headPosition, end);
            if (loops & 1)	// if loops is an odd number then we're on a pong rather than a ping (going backwards)
            {
                _retVals.headPosition = end - _retVals.headPosition;
                _retVals.headDirection = -1.0;
            }
            else
            {
                _retVals.headDirection = 1.0;
            }

            hasWrapped = true;
        }
    }

    return hasWrapped;
}

// #############################################################################################
/// Function:<summary>
///             Updates the tracks within the given sequence
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleUpdateTracks = function (_el, _sequence, _instance, _evalTree, _nodeContainer, _matrix, _parentTrack, _tracks, _headPosition, _lastHeadPosition, _headDirection, _dirty) {

    var mAssignHelper = new Matrix();
    var mParentOrigin = new Matrix();
    var existingNode = _evalTree;
    var node = _evalTree;

    for (var trackIndex = 0; trackIndex < _tracks.length; ++trackIndex)
    {
        var currentTrack = _tracks[trackIndex];

        g_SeqStack.push(currentTrack);

        // Match eval criteria in Room_Draw.cpp:DrawTrackList
        if (!TrackIsParameter(currentTrack.m_type) && currentTrack.enabled)
        {
            var retval = GetOrEmplaceTrackEvalNode(_nodeContainer, existingNode, node);

            node = retval.node;
            existingNode = retval.next;            

            //_nodeContainer = node;
            node.m_track = currentTrack;

            var dirty = _dirty || node.value.matrixHeadPosition != _headPosition;
            if(dirty)
            {
                // Evaluate the track
                var creationmask = 0xffffffff;
                if (node.m_parent != null)
                {
                    creationmask = ~(node.m_parent.value.paramset & (~(node.m_parent.value.hascreationvalue)));
                }
                currentTrack.EvaluateTrack(_headPosition, _sequence.m_length, node.value, creationmask);
                node.value.matrixHeadPosition = _headPosition;
            }

            // Gather source variables needed to construct the matrix, like origin
            // Eval tree is not built for the children yet
            switch (currentTrack.m_type)
            {
                case eSTT_Graphic:
                    this.HandleSpriteTrackUpdate(node, node.value, _instance, currentTrack, Fps, _headDirection, _lastHeadPosition, _headPosition, _sequence.m_length);
                    break;
                case eSTT_Sequence:
                    // NOTE: This differs from the cpp runner and is due to the differences in how GetOrEmplaceTrackEvalNode is implemented
                    // here, we create the parent node for the sequence ahead of time, rather than when the child sequennces are evaulated.
                    //if (node.m_subtree == null) node.m_subtree = new TrackEvalNode(node);
                    
                    this.HandleSequenceTrackUpdate(_el, _sequence, _instance, node.value, node.m_subtree, node, _matrix, _parentTrack, currentTrack, _headPosition, _lastHeadPosition, _headDirection, false, dirty);
                    break;
            }

            // Build matrix and eval tree for this track
            if (dirty)
            {
                // Local matrix
                node.value.matrix.unit();
                MultiplyTrackMatrix(node.value.matrix, node.value.x, node.value.y, node.value.scaleX, node.value.scaleY, node.value.rotation, node.value.xOrigin, node.value.yOrigin);

                // Inheritance
                if(node.m_parent != null)
                {
                    if ((_parentTrack.m_traits & eTrait_ChildrenShouldIgnoreOrigin) == 0)
                    {
                        // Remove parentr origin
                        mParentOrigin.SetTranslation(node.m_parent.value.xOrigin, node.m_parent.value.yOrigin, 0);
                        
                        mAssignHelper.Multiply(node.value.matrix, mParentOrigin);
                        node.value.matrix.Copy(mAssignHelper);
                    }

                    // Inherit built-in variables that are not in the matrix
                    var paramset_parentonly = node.m_parent.value.paramset & ~(node.value.paramset);
                    node.value.paramset |= node.m_parent.value.paramset;

                    if (node.value.paramset & (1 << eT_BlendMultiply)) 
                    {
                        if (paramset_parentonly & (1 << eT_BlendMultiply))
                        {       
                            node.value.colorMultiply[0] = node.m_parent.value.colorMultiply[0];
                            node.value.colorMultiply[1] = node.m_parent.value.colorMultiply[1];
                            node.value.colorMultiply[2] = node.m_parent.value.colorMultiply[2];
                            node.value.colorMultiply[3] = node.m_parent.value.colorMultiply[3];
                        }
                        else
                        {
                            node.value.colorMultiply[0] *= node.m_parent.value.colorMultiply[0];
                            node.value.colorMultiply[1] *= node.m_parent.value.colorMultiply[1];
                            node.value.colorMultiply[2] *= node.m_parent.value.colorMultiply[2];
                            node.value.colorMultiply[3] *= node.m_parent.value.colorMultiply[3];
                        }
                    }
                    if (node.value.paramset & (1 << eT_BlendAdd)) 
                    {
                        if (paramset_parentonly & (1 << eT_BlendAdd))
                        {
                            node.value.colorAdd[0] = node.m_parent.value.colorAdd[0];
                            node.value.colorAdd[1] = node.m_parent.value.colorAdd[1];
                            node.value.colorAdd[2] = node.m_parent.value.colorAdd[2];
                            node.value.colorAdd[3] = node.m_parent.value.colorAdd[3];
                        }
                        else
                        {
                            node.value.colorAdd[0] += node.m_parent.value.colorAdd[0];
                            node.value.colorAdd[1] += node.m_parent.value.colorAdd[1];
                            node.value.colorAdd[2] += node.m_parent.value.colorAdd[2];
                            node.value.colorAdd[3] += node.m_parent.value.colorAdd[3];
                        }
                    }
                    if (node.value.paramset & (1 << eT_Gain)) 
                    {
                        if (paramset_parentonly & (1 << eT_Gain))
                        {
                            node.value.gain = node.m_parent.value.gain;
                        }
                        else
                        {
                            node.value.gain *= node.m_parent.value.gain;
                        }
                    }
                    if (node.value.paramset & (1 << eT_Pitch)) 
                    {
                        if (paramset_parentonly & (1 << eT_Pitch))
                        {
                            node.value.pitch = node.m_parent.value.pitch;
                        }
                        else
                        {
                            node.value.pitch *= node.m_parent.value.pitch;
                        }
                    }
                    if (node.value.paramset & (1 << eT_Falloff)) 
                    {
                        if (paramset_parentonly & (1 << eT_Falloff))
                        {
                            node.value.falloff = node.m_parent.value.falloff;
                        }
                        else
                        {
                            node.value.falloff *= node.m_parent.value.falloff;
                        }
                    }
                    if (node.value.paramset & (1 << eT_ImageSpeed)) 
                    {
                        if (paramset_parentonly & (1 << eT_ImageSpeed))
                        {
                            node.value.imageSpeed = node.m_parent.value.imageSpeed;
                        }
                        else
                        {
                            node.value.imageSpeed *= node.m_parent.value.imageSpeed;
                        }
                    }
                    if (node.value.paramset & (1 << eT_ImageIndex)) 
                    {
                        if (paramset_parentonly & (1 << eT_ImageIndex))
                        {
                            node.value.imageIndex = node.m_parent.value.imageIndex;
                        }
                        else
                        {
                            node.value.imageIndex += node.m_parent.value.imageIndex;
                        }
                    }
                }
            }

            var currMatrix = new Matrix();
            currMatrix.Copy(_matrix);

            mAssignHelper.Multiply(node.value.matrix, _matrix);
            _matrix.Copy(mAssignHelper);

            // Explicit track updates
            switch (currentTrack.m_type)
            {
                case eSTT_Sequence:
                    // NOTE: This differs from the cpp runner and is due to the differences in how GetOrEmplaceTrackEvalNode is implemented
                    // here, we create the parent node for the sequence ahead of time, rather than when the child sequennces are evaulated.
                    //if (node.m_subtree == null) node.m_subtree = new TrackEvalNode(node);

                    this.HandleSequenceTrackUpdate(_el, _sequence, _instance, node.value, node.m_subtree, node, _matrix, _parentTrack, currentTrack, _headPosition, _lastHeadPosition, _headDirection, true, dirty);
                    break;

                case eSTT_Audio:
                    this.HandleAudioTrackUpdate(_el, _sequence, _instance, node.value, _matrix, currentTrack, _headPosition, _lastHeadPosition, _headDirection);
                    break;

                case eSTT_Instance:
                    this.HandleInstanceTrackUpdate(_el, _sequence, _instance, node.value, _matrix, currentTrack, _headPosition, _lastHeadPosition);
                    break;
            }

            if (currentTrack.m_tracks.length > 0)
            {
                //if (node.m_subtree == null) node.m_subtree = new TrackEvalNode(node);
                this.HandleUpdateTracks(_el, _sequence, _instance, node.m_subtree, node, _matrix, currentTrack, currentTrack.m_tracks, _headPosition, _lastHeadPosition, _headDirection, dirty);
            }

            _matrix.Copy(currMatrix);
        }

        g_SeqStack.pop();
    }
};


// #############################################################################################
/// Function:<summary>
///             Updates the given sprite track
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleSpriteTrackUpdate = function(_node, _srcVars, _instance, _track, _fps, _headDir, _lastHeadPos, _headPosition, _seqlength) {

    _srcVars.spriteIndex = -1;

    var keyframeStore = _track.m_keyframeStore;

    var graphicKeyframe = keyframeStore.GetKeyframeAtFrame(_headPosition, _seqlength);
    if (graphicKeyframe == null) return;

    var spriteIndex = graphicKeyframe.m_channels[0].m_spriteIndex;

    _srcVars.spriteIndex = spriteIndex;

    var sprite = g_pSpriteManager.Sprites[spriteIndex];

    // Get origin
    if (!_srcVars.Overrides(eT_OriginX)) _srcVars.xOrigin += sprite.xOrigin;
    if (!_srcVars.Overrides(eT_OriginY)) _srcVars.yOrigin += sprite.yOrigin;

    HandleSpriteSequenceMessageEvents(_node, _track, _instance, _fps, _headPosition, _lastHeadPos, _headDir, sprite.sequence, sprite, graphicKeyframe, keyframeStore);
};

function HandleSpriteSequenceMessageEvents(_node, _track, _inst, _fps, _headPosition, _lastHeadPosition, _headDirection, _sequence, _sprite, _spriteKey, _keyframes) 
{
    if(_sequence === null)
    {
        return;
    }

    //skip sprite message events if we have an explicit image index track setting
    if (_node.value.Overrides(eT_ImageIndex))
        return;

    var keyframeIndex = _keyframes.GetKeyframeIndexAtFrame(_headPosition, _sequence.m_length);
    if (keyframeIndex == -1) { return; }    
    
    // Compute which image index should be drawn based on the current position along the sequence
    var imageindex = 0;
    var sprite = _sprite;
    if(sprite.GetCount() > 1)
    {
        // Figure out the current head position relative to the start of this key
        // Clamp both the positions to the key extents
        var subHeadPos = Math.max(_headPosition, _spriteKey.m_key);
        subHeadPos = Math.min(subHeadPos, _spriteKey.m_key + _keyframes.GetKeyFrameLength(keyframeIndex, _sequence.m_length));
        var relHeadPos = subHeadPos - _spriteKey.m_key;
            // Now rescale based on the relative playback speeds of this sprite and it's parent sequence
        var timescale = 1.0;
        var spriteSeq = sprite.sequence;
        if (spriteSeq != null)
        {
            if (spriteSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
            {
                timescale = spriteSeq.m_playbackSpeed / _sequence.m_playbackSpeed;
            }
            else
            {
                timescale = spriteSeq.m_playbackSpeed * (g_GameTimer.GetFPS() / _sequence.m_playbackSpeed);
            }
        }
        else if (sprite.playbackspeed != 0.0)
        {
            if (sprite.playbackspeedtype == ePlaybackSpeedType_FramesPerSecond)
            {
                timescale = sprite.playbackspeed / _sequence.m_playbackSpeed;
            }
            else { timescale = sprite.playbackspeed; }
        }

        relHeadPos *= timescale;
        if (_node.value.Overrides(eT_ImageSpeed))
        {
            var frameDist = _node.value.imageDistance; //evaluated frame distance at _head
            if( frameDist >=0 )
                relHeadPos = frameDist * timescale;
        }
        
        if (spriteSeq != null)
        {
            // Need to handle cases the where the head positions cause the sequence to loop or ping-pong						
            var headDir = 1.0;
            if (_lastHeadPosition > _headPosition)
            {
                headDir = -1.0;
            }
            
            var tmp = { headPosition: relHeadPos, headDirection: headDir, finished: false };
            HandleSequenceWrapping(spriteSeq, tmp);
            relHeadPos = tmp.headPosition;
            headDir = tmp.headDirection;
            
            // Figure out which keyframe we're on
            // There should only be one track and it should be a sprite frames track
            if ((spriteSeq.m_tracks != null) && (spriteSeq.m_tracks[0].m_type == eSTT_SpriteFrames))
            {
                HandleSpriteMessageEvents(_sequence, _inst.id, _fps, _sequence.playbackSpeed, _headDirection, _lastHeadPosition, relHeadPos);
            }
        }
    } 
}


// #############################################################################################
/// Function:<summary>
///             Updates the given sequence track
///          </summary>
///
// #############################################################################################
yySequenceManager.prototype.HandleSequenceTrackUpdate = function (_el, _pSeq, _pInst, _srcVars, _pTree, _nodeContainer, _matrix, _pParentTrack, _pTrack, _headPos, _lastHeadPos, _headDir, _traverseChildren, _dirty) {

    _srcVars.sequenceID = -1;
    _srcVars.pSequence = null;

    var keyframeStore = _pTrack.m_keyframeStore;

    // TODO: unify this and the similar code used when drawing embedded sequences
    // (ideally only do it once)

    // Unlike when rendering (in most cases) we need to evaluate a range of time rather than an
    // instantaneous moment when handling sequences\events\code updates

    // Need to handle ping-pong and looping	

    // Find key ranges we need to evaluate
    // Currently we don't handle more than a time difference longer than the sequence length per frame
    // which isn't ideal - need to fix
    var startkeys = [];
    var endkeys = [];
    var havekeys = GetTrackKeyRanges(_headPos, _lastHeadPos, _headDir, 1.0, _pTrack, _pSeq, startkeys, endkeys);

    if (havekeys)
    {
        // Run through our keys

        var numkeygroups = 1, offset = 0;
        if (startkeys[1] != -1) numkeygroups = 2;
        if (startkeys[0] == -1) offset = 1;

        for (var k = offset; k < numkeygroups; k++)
        {
            var startkey = startkeys[k];
            var endkey = endkeys[k];

            for (var i = startkey; i <= endkey; i++)	// note the <=
            {
                var pKey = keyframeStore.keyframes[i];
                var pKeyChan = pKey.m_channels[0];
                var seqid = pKeyChan.m_index;

                var pSubSeq = g_pSequenceManager.GetSequenceFromID(seqid);
                if (pSubSeq == null) continue;

                g_SeqStack.push(pKey);
                g_SeqStack.push(pKeyChan);
                g_SeqStack.push(pSubSeq);

                //if (!requiresfinegrainedeval)	// handle this logic when we've got tracks that can't miss any frames (i.e. code or event tracks)
                {
                    // Check to see if the playhead is within the scope of this key
                    // Get length of key
                    var len;
                    if (pKey.m_stretch) {
                        if (i >= keyframeStore.numKeyframes - 1) len = _pSeq.m_length - pKey.m_key;
                        else len = keyframeStore.keyframes[i + 1].m_key - pKey.m_key;
                    }
                    else len = pKey.m_length;

                    if ((Math.floor(_headPos) >= pKey.m_key) && (Math.floor(_headPos) < (pKey.m_key + len)))
                    {
                        if (!_traverseChildren) {
                            //
                            //	We're only gathering source variables,
                            //	we're not traversing children yet
                            //
                            if (!_srcVars.Overrides(eT_OriginX)) _srcVars.xOrigin += pSubSeq.m_xorigin;
                            if (!_srcVars.Overrides(eT_OriginY)) _srcVars.yOrigin += pSubSeq.m_yorigin;

                            g_SeqStack.pop();
                            g_SeqStack.pop();
                            g_SeqStack.pop();

                            continue;
                        }

                        _srcVars.sequenceID = seqid;
                        _srcVars.pSequence = pSubSeq;

                        // Figure out the current and last head positions relative to the start of this key
                        // Clamp both the positions to the key extents
                        var subHeadPos = yymax(_headPos, pKey.m_key);
                        var subLastHeadPos = yymax(_lastHeadPos, pKey.m_key);
                        subHeadPos = yymin(subHeadPos, pKey.m_key + len);
                        subLastHeadPos = yymin(subLastHeadPos, pKey.m_key + len);

                        var relHeadPos = subHeadPos - pKey.m_key;
                        var relLastHeadPos = subLastHeadPos - pKey.m_key;

                        // Now rescale based on the relative playback speeds of this sequence and it's parent
                        var timescale = 1.0;
                        if (_pSeq.m_playbackSpeed != 0.0)
                        {
                            if (_pSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
                                timescale = pSubSeq.m_playbackSpeed / _pSeq.m_playbackSpeed;
                            else
                                timescale = pSubSeq.m_playbackSpeed;
                        }

                        relHeadPos *= timescale;
                        relLastHeadPos *= timescale;

                        // Need to handle cases the where the head positions cause the sequence to loop or ping-pong						
                        var headDir = 1.0;

                        if (_lastHeadPos > _headPos)
                            headDir = -1.0;

                        var tmp = { headPosition: relHeadPos, headDirection: headDir, finished: false };
                        HandleSequenceWrapping(pSubSeq, tmp);
                        relHeadPos = tmp.headPosition;
                        headDir = tmp.headDirection;

                        // Process the nested sequence
                        this.HandleUpdateTracks(_el, pSubSeq, _pInst, _pTree, _nodeContainer, _matrix, _pTrack, pSubSeq.m_tracks, relHeadPos, relLastHeadPos, headDir, _dirty);
                    }
                }

                g_SeqStack.pop();
                g_SeqStack.pop();
                g_SeqStack.pop();
            }
        }
    }
};


// #############################################################################################
/// Function:<summary>
///             Updates the given audio track
///          </summary>
// #############################################################################################
yySequenceManager.prototype.HandleAudioTrackUpdate = function (_pEl, _pSeq, _pInst, _srcVars, _matrix, _pTrack, _headPos, _lastHeadPos, _headDir)
{
    _srcVars.emitterIndex = -1;
    _srcVars.soundIndex = -1;

    // Get the keyframe store to use
    var keyframeStore = _pTrack.m_keyframeStore;
    if (keyframeStore == null)
        return;

    // Extract current absolute position of emitter

    // extract instance rotation, scale, and translation from the world matrix
    var emitterPosX = _matrix.m[12];
    var emitterPosY = _matrix.m[13];

    // Evaluate gain and pitch with inheritance
    var gain = _srcVars.gain * _pInst.m_volume * _pSeq.m_volume;
    var pitch = _srcVars.pitch;
    var falloff = _srcVars.falloff;

    // Scan through all the keyframes so we can handle unexpected seeks etc. without having to track changes

    // Get audio key for this track
    var activekeyframe = keyframeStore.GetKeyframeIndexAtFrame(_headPos, _pSeq.m_length);
    var numkeyframes = keyframeStore.numKeyframes;

    if ((_pInst.m_finished) || (_pInst.m_paused))
    {
        activekeyframe = -1;
    }

    for (var i = 0; i < numkeyframes; i++)
    {
        var pAudioKey = keyframeStore.keyframes[i];
        if (pAudioKey != null)
        {
            g_SeqStack.push(pAudioKey);

            for (var channelKey in pAudioKey.m_channels)
{
                var ppChanKey = pAudioKey.m_channels[channelKey];

                g_SeqStack.push(ppChanKey);

                // Look up audio entry associated with this key
                var pAudioInfo = _pInst.trackAudio[CHashMapCalculateHash(g_SeqStack)];

                if (pAudioInfo != null)
                {
                    if (i != activekeyframe)
                    {
                        if (pAudioInfo.soundindex != -1)
                        {
                            audio_stop_sound(pAudioInfo.soundindex);
                            pAudioInfo.soundindex = -1;
                        }
                    }
                    else
                    {
                        if (pAudioInfo.soundindex != -1)
                        {
                            // See if we need to stop and restart this sound
                            if (((pAudioInfo.playdir * _headDir) <= 0) || (((_headPos - _lastHeadPos) * pAudioInfo.playdir) <= 0))
                            {
                                audio_stop_sound(pAudioInfo.soundindex);
                                pAudioInfo.soundindex = -1;
                            }
                        }

                        if (pAudioInfo.soundindex == -1)
                        {
                            pAudioInfo.playdir = _headDir;
                            pAudioInfo.soundindex = audio_play_sound_on(pAudioInfo.emitterindex, ppChanKey.m_soundIndex, (ppChanKey.m_mode == eSM_Loop) ? true : false, 1.0);

                            // Seek to the correct spot in the sample (this matches the IDE logic)
                            var timefromstart;
                            if (pAudioInfo.playdir > 0)
                            {
                                timefromstart = _headPos - pAudioKey.m_key;
                            }
                            else
                            {
                                timefromstart = (pAudioKey.m_key + (pAudioKey.m_length - 1)) - _headPos;
                                if (timefromstart < 0.0)
                                    timefromstart = 0.0;
                            }

                            if ((_pSeq.m_playbackSpeed * _pInst.speedScale) > 0.0)
                            {
                                timefromstart /= (_pSeq.m_playbackSpeed * _pInst.speedScale);;
                            }
                            audio_sound_set_track_position(pAudioInfo.soundindex, timefromstart);
                        }

                        if (pAudioInfo.soundindex != -1)
                        {
                            audio_emitter_gain(pAudioInfo.emitterindex, gain);
                            audio_emitter_pitch(pAudioInfo.emitterindex, pitch);
                            //audio_emitter_falloff(pInfo.emitterindex, )

                            audio_emitter_position(pAudioInfo.emitterindex, emitterPosX, emitterPosY, 0.0);
                        }

                        _srcVars.emitterIndex = pAudioInfo.emitterindex;
                        _srcVars.soundIndex = pAudioInfo.soundindex;
                    }                   
                }

                g_SeqStack.pop();
            }

            g_SeqStack.pop();
        }
    }
};


// #############################################################################################
/// Function:<summary>
///             Updates the given instance track
///          </summary>
// #############################################################################################
yySequenceManager.prototype.HandleInstanceTrackUpdate = function (_pEl, _pSeq, _pInst, _srcVars, _matrix, _pTrack, _headPos, _lastHeadPos)
{
    _srcVars.instanceID = OBJECT_NOONE;

	// Get the keyframe store to use
	var keyframeStore = _pTrack.m_keyframeStore;
	if (keyframeStore == null)
		return;

	// extract instance rotation, scale, and translation from the world matrix
    var spriteRotationZ = Math.atan2(_matrix.m[1], _matrix.m[0]) * -(180 / Math.PI);
    var spriteScaleX = Math.sqrt((_matrix.m[0] * _matrix.m[0]) + (_matrix.m[1] * _matrix.m[1]));
    var spriteScaleY = Math.sqrt((_matrix.m[4] * _matrix.m[4]) + (_matrix.m[5] * _matrix.m[5]));
    var spritePosX = _matrix.m[12];
    var spritePosY = _matrix.m[13];

	var vecX = [];
	vecX[0] = _matrix.m[0];
	vecX[1] = _matrix.m[1];

	var vecY = [];
	vecY[0] = _matrix.m[4];
	vecY[1] = _matrix.m[5];

    // Need to work out whether scaleX or scaleY should be negative
	var crossresult = (vecX[0] * vecY[1]) - (vecX[1] * vecY[0]);
	if (crossresult < 0.0)
	{
	    // Okay, we have a negative scale of one of the axes
	    // Technically we could get away with *always* just scaling the X axis and adjusting the rotation to compensate
	    // But we'll try and maintain the correct scale factors if we can accurately detect them (this detection won't work reliably for nested transformations
	    // since _srcVars.Rotation is only relevant to the current track and not its parents)
	    if (Math.abs(spriteRotationZ - _srcVars.rotation) > 0.0001)
	    {
	        spriteScaleX *= -1.0;
	        spriteRotationZ -= 180.0;
	    }
	    else
	    {
			spriteScaleY *= -1.0;
	    }
    }

	// Scan through all the keyframes so we can handle unexpected seeks etc. without having to track changes
	var activekeyframe = keyframeStore.GetKeyframeIndexAtFrame(_headPos, _pSeq.m_length);
	var numkeyframes = keyframeStore.numKeyframes;

	for (var i = 0; i < numkeyframes; i++)
	{
		var pKey = keyframeStore.keyframes[i];
		if (pKey != null)
		{
            g_SeqStack.push(pKey);

            for(var channelKey in pKey.m_channels)
            {
                var ppKey = pKey.m_channels[channelKey];

                g_SeqStack.push(ppKey);

				// Look up instance entry associated with this key
                var pInstInfo = _pInst.trackInstances[CHashMapCalculateHash(g_SeqStack)];

				if (pInstInfo != null)
				{
                    var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
					if (pInst != null)
					{
                        pInst.SetInSequence(true);
						pInst.SetControlledBySequence(true);
						pInst.SetControllingSeqInst(_pInst);

						if (i != activekeyframe)
						{
							if (pInst.visible == true)
								pInst.visible = false;
						}
						else
						{
						    _srcVars.instanceID = pInst.id;

							if (pInst.visible == false)
								pInst.visible = true;

							if ((_srcVars.paramset & (1<<eT_Position)) || (_pEl.m_dirtyflags & (1 << eT_Position)) || (_pEl.m_layer.m_xoffset != 0.0) || (_pEl.m_layer.m_yoffset != 0.0))
							{
								pInst.x = spritePosX;
								pInst.y = spritePosY;
							}

							if ((_srcVars.paramset & (1<<eT_Rotation)) || (_pEl.m_dirtyflags & (1 << eT_Rotation)))
							{
								pInst.image_angle = spriteRotationZ;
							}

							if ((_srcVars.paramset & (1<<eT_Scale)) || (_pEl.m_dirtyflags & (1 << eT_Scale)))
							{
								pInst.image_xscale = spriteScaleX;
								pInst.image_yscale = spriteScaleY;
							}

							if ((_srcVars.paramset & (1<<eT_BlendMultiply)) || ((_pEl.m_imageBlend & 0x00ffffff) != 0xffffff) || (_pEl.m_imageAlpha != 1.0))
							{								
								var col = 0;

								if ((_pEl.m_imageBlend & 0x00ffffff) != 0xffffff)
								{									
									var r = (_pEl.m_imageBlend & 0xff) / 255.0;
									var g = ((_pEl.m_imageBlend >> 8) & 0xff) / 255.0;
									var b = ((_pEl.m_imageBlend >> 16) & 0xff) / 255.0;
									col = ((_srcVars.colorMultiply[0] * r * 255.0) & 0xff);
									col |= ((_srcVars.colorMultiply[1] * g * 255.0) & 0xff) << 8;
									col |= ((_srcVars.colorMultiply[2] * b * 255.0) & 0xff) << 16;
								}
								else
								{
									col = ((_srcVars.colorMultiply[0] * 255.0) & 0xff);
									col |= ((_srcVars.colorMultiply[1] * 255.0) & 0xff) << 8;
									col |= ((_srcVars.colorMultiply[2] * 255.0) & 0xff) << 16;
								}

								pInst.image_blend = col;
								pInst.image_alpha = _srcVars.colorMultiply[3] * _pEl.m_imageAlpha;
							}

							if (_srcVars.paramset & (1<<eT_ImageSpeed))
							{
								pInst.image_speed = _srcVars.imageSpeed;
							}

							if (_srcVars.paramset & (1<<eT_ImageIndex))
							{
								pInst.image_index = _srcVars.imageIndex;
                            }
                            else if (_srcVars.paramset & (1<<eT_ImageSpeed))
                            {
                                //calculate image index from image speed track
                                var sprite = g_pSpriteManager.Get(pInst.sprite_index);
                        	    if (sprite != null) 
                                {
                                    // Now rescale based on the relative playback speeds of this sprite and it's parent sequence
                                    var timescale = 1.0;
                                    var spriteSeq = sprite.sequence;
                                    if (spriteSeq != null)
                                    {
                                        if (spriteSeq.m_playbackSpeedType == ePlaybackSpeedType_FramesPerSecond)
                                            timescale = spriteSeq.m_playbackSpeed / _pSeq.m_playbackSpeed;
                                        else
                                            timescale = spriteSeq.m_playbackSpeed * (g_GameTimer.GetFPS() / _pSeq.m_playbackSpeed);

                                        var frameDist = _srcVars.imageDistance; //evaluated frame distance at _head
                                        if( frameDist >=0 ) 
                                        {
                                            relHeadPos = frameDist * timescale;
                                            // Need to handle cases the where the head positions cause the sequence to loop or ping-pong						
                                            var headDir = 1.0;
                                            if (_lastHeadPos > _headPos)
                                                headDir = -1.0;

                                            var tmp = { headPosition: relHeadPos, headDirection: headDir, finished: false };
                                            HandleSequenceWrapping(spriteSeq, tmp);
                                            relHeadPos = tmp.headPosition;
                                            headDir = tmp.headDirection;

                                            // Figure out which keyframe we're on
                                            // There should only be one track and it should be a sprite frames track
                                            if ((spriteSeq.m_tracks != null) && (spriteSeq.m_tracks[0].m_type == eSTT_SpriteFrames))
                                            {
                                                var track = spriteSeq.m_tracks[0]; //CSequenceSpriteFramesTrack
                                                var spriteFrameKeyframe = track.m_keyframeStore.GetKeyframeAtFrame(relHeadPos, spriteSeq.m_length);

                                                var imageindex;
                                                if (spriteFrameKeyframe == null) imageindex = -1;		// no key at this time		
                                                else imageindex = spriteFrameKeyframe.m_channels[0].m_imageIndex;

                                                pInst.image_index = imageindex;
                                            }
                                        }
                                    }
                                }
                            }
						}
					}
                }
                
                g_SeqStack.pop();
            }
            
            g_SeqStack.pop();
		}
	}
};






// #############################################################################################
/// Function:<summary>
///             Create a new CSequenceInstance object
///          </summary>
// #############################################################################################
/** @constructor */
function CSequenceInstance(_id)
{
    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[SequenceInstance]";

    this.id = _id;

    // A tree whose structure matches that of this sequence's tracks
    // Contains evaluated variables for each track in the sequence
    this.evalNodeHead = null;

    this.m_sequenceIndex = -1;
    this.m_headPosition = 0.0;
    this.m_headDirection = 1.0;
    this.m_speedScale = 1.0;		// playback speed modifier
    this.m_volume = 1.0;

    this.m_paused = false;
    this.m_finished = false;			// set only for one-shot playback when the playhead reaches the end
    this.m_hasPlayed = false;
    this.m_wrapped = false;             // set when the instance wrapped the last time it was updated

    this.lastHeadPosition = 0.0;

    this.trackAudio = {}; //CSeqTrackAudioInfo
    this.trackInstances = {}; //CSeqTrackInstanceInfo

    this.cachedElementID = -1;

    Object.defineProperties(this, {
        gmlsequence: {
            enumerable: true,
            get: function () { return g_pSequenceManager.GetSequenceFromID(this.m_sequenceIndex); },
            set: function (_val)
            {
                if(typeof(_val) == "object")
                {
                    this.m_sequenceIndex = g_pSequenceManager.Sequences.indexOf(_val);
                }
                else
                {
                    this.m_sequenceIndex = _val;
                }
            }
        },
        gmlheadPosition: {
            enumerable: true,
            get: function () { return this.m_headPosition; },
            set: function (_val)
            {
                var _val = yyGetReal(_val);
                _val = yymax(_val, 0.0);
                
                var seq = g_pSequenceManager.GetSequenceFromID(this.m_sequenceIndex);
                if(seq != null)
                {
                    var length = seq.m_length;
                    _val = yymin(_val, length);                    
                }

                this.m_headPosition = _val;
                this.lastHeadPosition = _val; // don't want to treat this like a normal time step

                //this.m_finished = tmp.finished;
            }
        },
        gmlheadDirection: {
            enumerable: true,
            get: function () { return this.m_headDirection; },
            set: function (_val)
            {
                _val = yyGetReal(_val);
                if(_val != 0)
                {
                    this.m_headDirection = Math.sign(_val);
                }
            }
        },
        gmlspeedScale: {
            enumerable: true,
            get: function () { return this.m_speedScale; },
            set: function (_val)
            {
                _val = yyGetReal(_val);
                //_val = yymax(_val, 0.0);    // no negative speeds
                this.m_speedScale = _val;
            }
        },
        gmlvolume: {
            enumerable: true,
            get: function () { return this.m_volume; },
            set: function (_val)
            {
                _val = yyGetReal(_val);
                _val = yymax(_val, 0.0);    // no negative volumes
                this.m_volume = _val;
            }
        },
        gmlpaused: {
            enumerable: true,
            get: function () { return this.m_paused; },
        },
        gmlfinished: {
            enumerable: true,
            get: function () { return this.m_finished; },
        },
        gmlactiveTracks: {
            enumerable: true,
            get: function ()
            {
                var returnArray = [];
                evalNode = this.evalNodeHead;
                while(evalNode != null)
                {
                    returnArray.push(evalNode);
                    evalNode = evalNode.m_next;
                }

                return returnArray;
            }
        },
        gmlelementID: {
            enumerable: true,
            get: function ()
            {
                // This is not optimal at the moment on HTML5
                // as we're doing two loops through the layer system
                // But ideally we'll implement a fast element lookup
                // like the C++ runner at some point
                if (g_RunRoom != null)
                {
                    if (this.cachedElementID != -1)
                    {
                        var el = g_pLayerManager.GetElementFromID(g_RunRoom, this.cachedElementID);
                        if ((el != null) && (el.m_type == eLayerElementType_Sequence) && (el.m_instanceIndex == this.id))
                        {
                            return this.cachedElementID;
                        }
                    }

                    // We didn't find the cached element, so look for references to this instance in the current room
                    for (var i = 0; i < g_RunRoom.m_Layers.length; i++)
                    {
                        var layer = g_RunRoom.m_Layers.Get(i);
                        for (var j = 0; j < layer.m_elements.length; j++)
                        {
                            var el = layer.m_elements.Get(j);
                            if (el == null)
                                continue;

                            if ((el.m_type == eLayerElementType_Sequence) && (el.m_instanceIndex == this.id))
                            {
                                this.cachedElementID = el.m_id;
                                return this.cachedElementID;
                            }

                        }
                    }
                }
                else
                {
                    return -1;
                }
            }
        }
    });
}

// #############################################################################################
/// Function:<summary>
///             Pause the sequence instance
///          </summary>
///
// #############################################################################################
CSequenceInstance.prototype.Pause = function() {
    if (!this.m_paused)
	{
		this.m_paused = true;

		// Pause any sounds currently playing
		var pAudioInfo = null;
		for(var key in this.trackAudio)
		{
            pAudioInfo = this.trackAudio[key];
			if (audio_is_paused(pAudioInfo.soundindex) == false)
			{
				audio_pause_sound(pAudioInfo.soundindex);
			}

            SetInstanceInSequenceStatus(false);
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Resume the sequence instance
///          </summary>
///
// #############################################################################################
CSequenceInstance.prototype.UnPause = function() {
    if (this.m_paused)
	{
		this.m_paused = false;

		// Resume any sounds currently playing
		var pAudioInfo = null;
		for(var key in this.trackAudio)
		{
            pAudioInfo = this.trackAudio[key];
			if (audio_is_paused(pAudioInfo.soundindex) == true)
			{
				audio_resume_sound(pAudioInfo.soundindex);
			}
		}
	}
};

// #############################################################################################
/// Function:<summary>
///             Stop all sounds being played by the sequence instance
///          </summary>
///
// #############################################################################################
CSequenceInstance.prototype.StopAllSounds = function() {
    // Resume any sounds currently playing
    var pAudioInfo = null;
    for(var key in this.trackAudio)
    {
        pAudioInfo = this.trackAudio[key];
        audio_stop_sound(pAudioInfo.soundindex);
    }

    this.trackAudio = {};
};

// #############################################################################################
/// Function:<summary>
///             Setup all instances associated with the sequence
///          </summary>
///
// #############################################################################################
CSequenceInstance.prototype.SetupInstances = function(_tracks, _objectToOverride, _instanceID, _layerID) {

    for (var trackIndex = 0; trackIndex < _tracks.length; ++trackIndex)
    {
        var track = _tracks[trackIndex];

        g_SeqStack.push(track);

		if (track.m_type == eSTT_Instance)
		{
			// Scan through keyframes
			var pInstTrack = track;
			if (pInstTrack.m_keyframeStore != null)
			{
				var numkeys = pInstTrack.m_keyframeStore.numKeyframes;
				for (var i = 0; i < numkeys; i++)
				{
                    var pKey = pInstTrack.m_keyframeStore.keyframes[i];
                    
                    g_SeqStack.push(pKey);

					// Check key channels
                    for(var channelKey in pKey.m_channels)
                    {
                        var ppKey = pKey.m_channels[channelKey];
                        
						if (ppKey.m_objectIndex != -1)
						{
                            g_SeqStack.push(ppKey);

							// Look to see if we have an entry in the hash table
                            // Don't change any existing entries
                            var pInstInfo = this.trackInstances[CHashMapCalculateHash(g_SeqStack)];
                            
							if ((_objectToOverride == OBJECT_ALL) || (_objectToOverride == ppKey.m_objectIndex))
							{
								if (pInstInfo != null)
								{
									if (pInstInfo.ownedBySequence == true)
									{
										// Destroy the associated instance
                                        var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
										if (pInst != null)
										{
											//DoDestroy(pInst, true);
											Command_Destroy(pInst);
										}
									}

                                    delete this.trackInstances[CHashMapCalculateHash(g_SeqStack)];
								}

								var newInstInfo = new CSeqTrackInstanceInfo();
								newInstInfo.pKeydata = ppKey;
                                if (_instanceID < 10000)
								{
									newInstInfo.objectID = _instanceID;
									newInstInfo.ownedBySequence = true;
								}
								else
								{
									newInstInfo.instanceID = _instanceID;
									newInstInfo.ownedBySequence = false;
								}

								this.trackInstances[CHashMapCalculateHash(g_SeqStack)] = newInstInfo;								
							}
							else
							{
								if (pInstInfo == null)
								{
									// Create the instance - just use depth 0 for the moment
									var pInstance = null;
									if (_layerID == -1)
									{
										pInstance = Command_Create_Depth(ppKey.m_objectIndex, 0, 0, 0, this);
									}
									else
									{
										pInstance = Command_Create_Layer(ppKey.m_objectIndex, 0, 0, _layerID, this);
                                    }
                                    
									if (pInstance != null)
									{
										var newInstInfo = new CSeqTrackInstanceInfo();
										newInstInfo.pKeydata = ppKey;
										newInstInfo.instanceID = pInstance.id;
                                        newInstInfo.ownedBySequence = true;
                                        
										this.trackInstances[CHashMapCalculateHash(g_SeqStack)] = newInstInfo;
									}
                                }
                                else if ((pInstInfo.objectID != -1) && (pInstInfo.instanceID == -1))
								{
									// Create the instance using the overridden object ID
									var pInstance = null;
									if (_layerID == -1)
									{
										pInstance = Command_Create_Depth(pInstInfo.objectID, 0, 0, 0, this);
									}
									else
									{
										pInstance = Command_Create_Layer(pInstInfo.objectID, 0, 0, _layerID, this);
                                    }
                                    
									if (pInstance != null)
									{
										pInstInfo.instanceID = pInstance.id;										
									}
								}
                            }
                            
                            g_SeqStack.pop();
						}						
                    }
                    
                    g_SeqStack.pop();
				}
			}
		}
		else if (track.m_type == eSTT_ClipMask)
		{
			var pMaskTrack = track;
			this.SetupInstances(pMaskTrack.GetMaskTrack(), _objectToOverride, _instanceID, _layerID);
			this.SetupInstances(pMaskTrack.GetSubjectTrack(), _objectToOverride, _instanceID, _layerID);
		}
		else if (track.m_type == eSTT_Sequence)
		{
			var pSeqTrack = track;
			if (pSeqTrack.m_keyframeStore != null)
			{
				var numkeys = pSeqTrack.m_keyframeStore.numKeyframes;
				for (var i = 0; i < numkeys; i++)
				{
                    var pKey = pSeqTrack.m_keyframeStore.keyframes[i];
                    
                    g_SeqStack.push(pKey);

					// Check key channels
                    for(var channelKey in pKey.m_channels)
                    {
                        var ppKey = pKey.m_channels[channelKey];

                        g_SeqStack.push(ppKey);

						if (ppKey.m_index != -1)
						{
							var pSeq = g_pSequenceManager.GetSequenceFromID(ppKey.m_index);
							if (pSeq != null)
							{
                                g_SeqStack.push(pSeq);
                                this.SetupInstances(pSeq.m_tracks, _objectToOverride, _instanceID, _layerID);
                                g_SeqStack.pop();
							}
                        }
                        
                        g_SeqStack.pop();
                    }
                    
                    g_SeqStack.pop();
				}
			}
		}

		// Check subtracks
        this.SetupInstances(track.m_tracks, _objectToOverride, _instanceID, _layerID);
        
        g_SeqStack.pop();
	}

};

CSequenceInstance.prototype.DestroyOwnedInstances = function()
{
    //if (this.trackInstances.length > 0)   // this isn't an array - it's just a hashmap
	{
        for(var key in this.trackInstances)
        {
            var pInstInfo = this.trackInstances[key];

            if ((pInstInfo.ownedBySequence == true) && (pInstInfo.instanceID >= 0))
			{
                var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
				if (pInst != null)
				{
					//DoDestroy(pInst, true);
                    Command_Destroy(pInst);
                    pInstInfo.instanceID = -1;
				}
			}
		}

	}
};

// #############################################################################################
/// Function:<summary>
///             Setup all instances associated with the sequence
///          </summary>
///
// #############################################################################################
CSequenceInstance.prototype.SetupAudioEmitters = function (_tracks)
{

    for (var trackIndex = 0; trackIndex < _tracks.length; ++trackIndex)
    {
        var track = _tracks[trackIndex];

        g_SeqStack.push(track);

        if (track.m_type == eSTT_Audio)
        {
            // Scan through keyframes
            var pAudioTrack = track;
            if (pAudioTrack.m_keyframeStore != null)
            {
                var numkeys = pAudioTrack.m_keyframeStore.numKeyframes;
                for (var i = 0; i < numkeys; i++)
                {
                    var pKey = pAudioTrack.m_keyframeStore.keyframes[i];

                    g_SeqStack.push(pKey);

                    // Check key channels
                    for (var channelKey in pKey.m_channels)
{
                        var ppKey = pKey.m_channels[channelKey];

                        if (ppKey.m_soundIndex != -1)
                        {
                            g_SeqStack.push(ppKey);

                            // Look to see if we have an entry in the hash table
                            // Don't change any existing entries
                            var pAudioInfo = this.trackAudio[CHashMapCalculateHash(g_SeqStack)];                            
                            
                            if (pAudioInfo == null)
                            {
                                // Create an audio emitter
                                var emitter = audio_emitter_create();
                                if ((emitter != undefined) && (emitter != -1))
                                {
                                    var newAudioInfo = new CSeqTrackAudioInfo();
                                    newAudioInfo.emitterindex = emitter;

                                    this.trackAudio[CHashMapCalculateHash(g_SeqStack)] = newAudioInfo;
                                }                                
                            }                            

                            g_SeqStack.pop();
                        }
                    }

                    g_SeqStack.pop();
                }
            }
        }
        else if (track.m_type == eSTT_ClipMask)
        {
            var pMaskTrack = track;
            this.SetupAudioEmitters(pMaskTrack.GetMaskTrack());
            this.SetupAudioEmitters(pMaskTrack.GetSubjectTrack());
        }
        else if (track.m_type == eSTT_Sequence)
        {
            var pSeqTrack = track;
            if (pSeqTrack.m_keyframeStore != null)
            {
                var numkeys = pSeqTrack.m_keyframeStore.numKeyframes;
                for (var i = 0; i < numkeys; i++)
                {
                    var pKey = pSeqTrack.m_keyframeStore.keyframes[i];

                    g_SeqStack.push(pKey);

                    // Check key channels
                    for (var channelKey in pKey.m_channels)
{
                        var ppKey = pKey.m_channels[channelKey];

                        g_SeqStack.push(ppKey);

                        if (ppKey.m_index != -1)
                        {
                            var pSeq = g_pSequenceManager.GetSequenceFromID(ppKey.m_index);
                            if (pSeq != null)
                            {
                                g_SeqStack.push(pSeq);
                                this.SetupAudioEmitters(pSeq.m_tracks);
                                g_SeqStack.pop();
                            }
                        }

                        g_SeqStack.pop();
                    }

                    g_SeqStack.pop();
                }
            }
        }

        // Check subtracks
        this.SetupAudioEmitters(track.m_tracks);

        g_SeqStack.pop();
    }
};

CSequenceInstance.prototype.CleanupInstances = function ()
{
    //if (this.trackInstances.length > 0)   // this isn't an array - it's just a hashmap
	{
        for(var key in this.trackInstances)
        {
            var pInstInfo = this.trackInstances[key];

            if (pInstInfo.instanceID >= 0)
			{
                var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
				if (pInst != null)
				{
                    pInst.SetInSequence(false);
                    pInst.SetControlledBySequence(false);
                    pInst.SetControllingSeqInst(null);

                    if (pInstInfo.ownedBySequence == true)
                    {
                        //DoDestroy(pInst, true);
                        Command_Destroy(pInst);                        
                    }

                    pInstInfo.instanceID = -1;
				}
			}
		}

	}
};

CSequenceInstance.prototype.CleanupAudioEmitters = function ()
{
    //if (this.trackAudio.length > 0)       // this isn't an array - it's just a hashmap
    {
        for (var key in this.trackAudio)
        {
            var pInfo = this.trackAudio[key];

            if ((pInfo.emitterindex != undefined) && (pInfo.emitterindex >= 0))
            {
                audio_stop_sound(pInfo.soundindex);
                audio_emitter_free(pInfo.emitterindex);
                pInfo.emitterindex = -1;
                pInfo.soundindex = -1;
            }
        }

    }
};

CSequenceInstance.prototype.SetInstanceInSequenceStatus = function (_inSequence)
{
    //if (this.trackInstances.length > 0)   // this isn't an array - it's just a hashmap
	{
        for(var key in this.trackInstances)
        {
            var pInstInfo = this.trackInstances[key];

            if (pInstInfo.instanceID >= 0)
			{
                var pInst = g_pInstanceManager.FindInstance(pInstInfo.instanceID);
				if (pInst != null)
				{
                    pInst.SetInSequence(_inSequence);

                    if (_inSequence == true)
                    {
                        pInst.SetControllingSeqInst(this);
                    }
                    else
                    {
                        pInst.SetControllingSeqInst(null);
                    }                    
				}
			}
		}

	}
};

// #############################################################################################
/// Function:<summary>
///             Create a new CSeqTrackAudioInfo object
///          </summary>
// #############################################################################################
/** @constructor */
function CSeqTrackAudioInfo()
{
    //this.keyindex = undefined;
    this.soundindex = -1;
    this.playdir = 1;
    this.emitterindex = -1;
}


// #############################################################################################
/// Function:<summary>
///             Create a new TrackEval object
///          </summary>
// #############################################################################################
/** @constructor */
function TrackEval() {

    this.matrix = new Matrix(); // This track evaluation's corresponding matrix
    this.matrixHeadPosition = -1; // The head position that was evaluated into this 
    this.overridden = 0; //override bit toggles
    this.hascreationvalue = 0; // one bit per track type denoting whether this node contains a value set via creation track 
    this.paramset = 0;

    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.xOrigin = 0;
    this.yOrigin = 0;
    this.gain = 1;
    this.pitch = 1;
    this.falloff = 0;
    //this.width = 0;
    //this.height = 0;
    this.imageIndex = 0;
    this.imageSpeed = 1;
    this.imageDistance = -1;

    this.colorMultiply = [];
    this.colorMultiply[0] = 1;
    this.colorMultiply[1] = 1;
    this.colorMultiply[2] = 1;
    this.colorMultiply[3] = 1;

    this.colorAdd = [];
    this.colorAdd[0] = 0;
    this.colorAdd[1] = 0;
    this.colorAdd[2] = 0;
    this.colorAdd[3] = 0;

    this.spriteIndex = -1;
    this.instanceID = OBJECT_NOONE;
    this.emitterIndex = -1;
    this.soundIndex = -1;
    this.pSequence = null;
    this.sequenceID = -1;

    this.FrameSizeX = 0;
    this.FrameSizeY = 0;
    this.CharacterSpacing = 0;
    this.LineSpacing = 0;
    this.ParagraphSpacing = 0;

}

TrackEval.prototype.ApplyCreationMask = function (_creationmask)
{
    this.hascreationvalue &= _creationmask;
};

// #############################################################################################
/// Function:<summary>
///             Resets the TrackEval variables
///          </summary>
// #############################################################################################
TrackEval.prototype.ResetVariables = function ()
{
    this.x = 0;
    this.y = 0;  
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.xOrigin = 0;
    this.yOrigin = 0;
    this.gain = 1;
    this.pitch = 1;
    this.falloff = 0;
    this.imageIndex = 0;
    this.imageSpeed = 1;
    this.imageDistance = -1;
    this.colorMultiply[0] = 1;
    this.colorMultiply[1] = 1;
    this.colorMultiply[2] = 1;
    this.colorMultiply[3] = 1;
    this.colorAdd[0] = 0;
    this.colorAdd[1] = 0;
    this.colorAdd[2] = 0;
    this.colorAdd[3] = 0;

    this.FrameSizeX = 0;
    this.FrameSizeY = 0;
    this.CharacterSpacing = 0;
    this.LineSpacing = 0;
    this.ParagraphSpacing = 0;

    this.hascreationvalue = 0;
    this.paramset = 0;
};

// #############################################################################################
/// Function:<summary>
///             Resets the TrackEval override flags
///          </summary>
// #############################################################################################
TrackEval.prototype.ResetOverrides = function () {
    this.overridden = 0;
};

// #############################################################################################
/// Function:<summary>
///             Sets the given override flag to the given value
///          </summary>
// #############################################################################################
TrackEval.prototype.Override = function (_track, _value) {
    switch(_track)
    {
        case eT_OriginX: if (_value) this.overridden |= (1 << 0); else this.overridden &= ~(1 << 0); break;
        case eT_OriginY: if (_value) this.overridden |= (1 << 1); else this.overridden &= ~(1 << 1); break;
        case eT_ImageSpeed: if (_value) this.overridden |= (1 << 2); else this.overridden &= ~(1 << 2); break;
        case eT_ImageIndex: if (_value) this.overridden |= (1 << 3); else this.overridden &= ~(1 << 3); break;        
    }
};

// #############################################################################################
/// Function:<summary>
///             Returns whether the given override flag is set
///          </summary>
// #############################################################################################
TrackEval.prototype.Overrides = function (_track) {
    switch (_track) {
        case eT_OriginX: return (this.overridden & (1 << 0)) != 0;
        case eT_OriginY: return (this.overridden & (1 << 1)) != 0;
        case eT_ImageSpeed: return (this.overridden & (1 << 2)) != 0;
        case eT_ImageIndex: return (this.overridden & (1 << 3)) != 0;        
    }
};

// #############################################################################################
/// Function:<summary>
///             Create a new TrackEvalNode object
///          </summary>
// #############################################################################################
/** @constructor */
function TrackEvalNode(_parent)
{
    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[TrackEvalNode]";

    this.m_track = null; // yyTrack
    this.value = new TrackEval();

    this.m_parent = _parent !== undefined ? _parent : null; //TrackEvalNode
    this.m_next = null; // TrackEvalNode
    this.m_subtree = null; //TrackEvalNode

    Object.defineProperties(this, {
        gmlmatrix: {
            enumerable: true,
            get: function ()
            {
                var matrixCopy = new Matrix();
                matrixCopy.Copy(this.value.matrix);
                return matrixCopy.m;
            },
            set: function (_val)
            {
                if((_val instanceof Array || _val instanceof Float32Array) && _val.length == 16)
                {
                    this.value.matrix.unit();

                    for(var i = 0; i < 16; ++i)
                    {
                        this.value.matrix.m[i] = yyGetReal(_val[i]);
                    }
                }
                else
                {
                    throw new Error("value must be an array of numbers and of length 16");
                }
            }
        },

        gmlposx: {
            enumerable: true,
            get: function ()
            {
                return this.value.x;
            },
            set: function (_val)
            {
                this.value.x = yyGetReal(_val);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlposy: {
            enumerable: true,
            get: function ()
            {
                return this.value.y;
            },
            set: function (_val)
            {
                this.value.y = yyGetReal(_val);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlrotation: {
            enumerable: true,
            get: function ()
            {
                return this.value.rotation;
            },
            set: function (_val)
            {
                this.value.rotation = yyGetReal(_val);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlscalex: {
            enumerable: true,
            get: function ()
            {
                return this.value.scaleX;
            },
            set: function (_val)
            {
                this.value.scaleX = yyGetReal(_val);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlscaley: {
            enumerable: true,
            get: function ()
            {
                return this.value.scaleY;
            },
            set: function (_val)
            {
                this.value.scaleY = yyGetReal(_val);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlxorigin: {
            enumerable: true,
            get: function ()
            {
                return this.value.xOrigin;
            },
            set: function (_val)
            {
                this.value.xOrigin = yyGetReal(_val);

                this.value.Override(eT_OriginX, true);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlyorigin: {
            enumerable: true,
            get: function ()
            {
                return this.value.yOrigin;
            },
            set: function (_val)
            {
                this.value.yOrigin = yyGetReal(_val);

                this.value.Override(eT_OriginY, true);

                this.value.matrix.unit();
                MultiplyTrackMatrix(this.value.matrix, this.value.x, this.value.y, this.value.scaleX, this.value.scaleY, this.value.rotation, this.value.xOrigin, this.value.yOrigin);
            }
        },
        gmlgain: {
            enumerable: true,
            get: function ()
            {
                return this.value.gain;
            },
            set: function (_val)
            {
                this.value.gain = yyGetReal(_val);
            }
        },
        gmlpitch: {
            enumerable: true,
            get: function ()
            {
                return this.value.pitch;
            },
            set: function (_val)
            {
                this.value.pitch = yyGetReal(_val);
            }
        },
        gmlfalloff: {
            enumerable: true,
            get: function ()
            {
                return this.value.falloff;
            },
            set: function (_val)
            {
                this.value.falloff = yyGetInt32(_val);
            }
        },        
        gmlimageindex: {
            enumerable: true,
            get: function ()
            {
                return this.value.imageIndex;
            },
            set: function (_val)
            {
                this.value.imageIndex = yyGetInt32(_val);

                this.value.Override(eT_ImageIndex, true);
            }
        },
        gmlimagespeed: {
            enumerable: true,
            get: function ()
            {
                return this.value.imageSpeed;
            },
            set: function (_val)
            {
                this.value.imageSpeed = yyGetReal(_val);

                this.value.Override(eT_ImageSpeed, true);
            }
        },

        gmlcolormultiply: {
            enumerable: true,
            get: function ()
            {
                // Need to change from RGBA order to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                arrCopy = [];                
                arrCopy[0] = yyGetReal(this.value.colorMultiply[3]);
                arrCopy[1] = yyGetReal(this.value.colorMultiply[0]);
                arrCopy[2] = yyGetReal(this.value.colorMultiply[1]);
                arrCopy[3] = yyGetReal(this.value.colorMultiply[2]);
                return arrCopy;
            },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    // Need to change from ARGB order to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                    this.value.colorMultiply[0] = yyGetReal(_val[1]);
                    this.value.colorMultiply[1] = yyGetReal(_val[2]);
                    this.value.colorMultiply[2] = yyGetReal(_val[3]);
                    this.value.colorMultiply[3] = yyGetReal(_val[0]);
                }
                else
                {
                    //throw new Error("value must be an array of numbers");
                    var col = yyGetInt32(_val);
                    this.value.colorMultiply[0] = (col & 0xff) / 255.0;
                    this.value.colorMultiply[1] = ((col >> 8) & 0xff) / 255.0;
                    this.value.colorMultiply[2] = ((col >> 16) & 0xff) / 255.0;
                    this.value.colorMultiply[3] = ((col >> 24) & 0xff) / 255.0;
                }
            }
        },
        gmlcolourmultiply: {
            enumerable: true,
            get: function ()
            {
                // Need to change from RGBA order to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                arrCopy = [];
                arrCopy[0] = yyGetReal(this.value.colorMultiply[3]);
                arrCopy[1] = yyGetReal(this.value.colorMultiply[0]);
                arrCopy[2] = yyGetReal(this.value.colorMultiply[1]);
                arrCopy[3] = yyGetReal(this.value.colorMultiply[2]);
                return arrCopy;
            },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    // Need to change from ARGB order to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                    this.value.colorMultiply[0] = yyGetReal(_val[1]);
                    this.value.colorMultiply[1] = yyGetReal(_val[2]);
                    this.value.colorMultiply[2] = yyGetReal(_val[3]);
                    this.value.colorMultiply[3] = yyGetReal(_val[0]);
                }
                else
                {
                    //throw new Error("value must be an array of numbers");
                    var col = yyGetInt32(_val);
                    this.value.colorMultiply[0] = (col & 0xff) / 255.0;
                    this.value.colorMultiply[1] = ((col >> 8) & 0xff) / 255.0;
                    this.value.colorMultiply[2] = ((col >> 16) & 0xff) / 255.0;
                    this.value.colorMultiply[3] = ((col >> 24) & 0xff) / 255.0;
                }
            }
        },

        gmlcoloradd: {
            enumerable: true,
            get: function ()
            {                
                // Need to change from RGBA order to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                arrCopy = [];
                arrCopy[0] = yyGetReal(this.value.colorAdd[3]);
                arrCopy[1] = yyGetReal(this.value.colorAdd[0]);
                arrCopy[2] = yyGetReal(this.value.colorAdd[1]);
                arrCopy[3] = yyGetReal(this.value.colorAdd[2]);
                return arrCopy;
            },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    // Need to change from ARGB order to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                    this.value.colorAdd[0] = yyGetReal(_val[1]);
                    this.value.colorAdd[1] = yyGetReal(_val[2]);
                    this.value.colorAdd[2] = yyGetReal(_val[3]);
                    this.value.colorAdd[3] = yyGetReal(_val[0]);
                }
                else
                {
                    //throw new Error("value must be an array of numbers");
                    var col = yyGetInt32(_val);
                    this.value.colorAdd[0] = (col & 0xff) / 255.0;
                    this.value.colorAdd[1] = ((col >> 8) & 0xff) / 255.0;
                    this.value.colorAdd[2] = ((col >> 16) & 0xff) / 255.0;
                    this.value.colorAdd[3] = ((col >> 24) & 0xff) / 255.0;
                }
            }
        },
        gmlcolouradd: {
            enumerable: true,
            get: function ()
            {
                // Need to change from RGBA order to ARGB order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                arrCopy = [];
                arrCopy[0] = yyGetReal(this.value.colorAdd[3]);
                arrCopy[1] = yyGetReal(this.value.colorAdd[0]);
                arrCopy[2] = yyGetReal(this.value.colorAdd[1]);
                arrCopy[3] = yyGetReal(this.value.colorAdd[2]);
                return arrCopy;
            },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    // Need to change from ARGB order to RGBA order according to http://jira.yoyogames.lan:8080/browse/SEQ-1324
                    this.value.colorAdd[0] = yyGetReal(_val[1]);
                    this.value.colorAdd[1] = yyGetReal(_val[2]);
                    this.value.colorAdd[2] = yyGetReal(_val[3]);
                    this.value.colorAdd[3] = yyGetReal(_val[0]);
                }
                else
                {
                    //throw new Error("value must be an array of numbers");
                    var col = yyGetInt32(_val);
                    this.value.colorAdd[0] = (col & 0xff) / 255.0;
                    this.value.colorAdd[1] = ((col >> 8) & 0xff) / 255.0;
                    this.value.colorAdd[2] = ((col >> 16) & 0xff) / 255.0;
                    this.value.colorAdd[3] = ((col >> 24) & 0xff) / 255.0;
                }
            }
        },

        gmlspriteIndex: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Graphic))
                {
                    return this.value.spriteIndex;
                }
                else
                {
                    return -1;
                }
            }
        },

        gmlinstanceID: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Instance))
                {
                    return this.value.instanceID;
                }
                else
                {
                    return OBJECT_NOONE;
                }
            }
        },

        gmlemitterIndex: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Audio))
                {
                    return this.value.emitterIndex;
                }
                else
                {
                    return -1;
                }
            }
        },

        gmlsoundIndex: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Audio))
                {
                    return this.value.soundIndex;
                }
                else
                {
                    return -1;
                }
            }
        },

        gmlsequence: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Sequence))
                {
                    return this.value.pSequence;
                }
                else
                {
                    return -1;
                }
            }
        },

        gmlsequenceID: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Sequence))
                {
                    return this.value.sequenceID;
                }
                else
                {
                    return -1;
                }
            }
        },

        gmlframeSizeX: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    return this.value.FrameSizeX;
                }
                else
                {
                    return -1;
                }
            },
            set: function (_val)
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    this.value.FrameSizeX = yyGetReal(_val);
                }          
            }
        },

        gmlframeSizeY: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    return this.value.FrameSizeY;
                }
                else
                {
                    return -1;
                }
            },
            set: function (_val)
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    this.value.FrameSizeY = yyGetReal(_val);
                }          
            }
        },

        gmlcharacterSpacing: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    return this.value.CharacterSpacing;
                }
                else
                {
                    return -1;
                }
            },
            set: function (_val)
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    this.value.CharacterSpacing = yyGetReal(_val);
                }          
            }
        },

        gmllineSpacing: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    return this.value.LineSpacing;
                }
                else
                {
                    return -1;
                }
            },
            set: function (_val)
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    this.value.LineSpacing = yyGetReal(_val);
                }          
            }
        },

        gmlparagraphSpacing: {
            enumerable: true,
            get: function ()
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    return this.value.ParagraphSpacing;
                }
                else
                {
                    return -1;
                }
            },
            set: function (_val)
            {
                if ((this.m_track != null) && (this.m_track.m_type == eSTT_Text))
                {
                    this.value.ParagraphSpacing = yyGetReal(_val);
                }          
            }
        },

        gmltrack: {
            enumerable: true,
            get: function ()
            {
                return this.m_track;
            }
        },
        gmlparent: {
            enumerable: true,
            get: function ()
            {
                return this.m_parent;
            }
        },
        gmlactiveTracks: {
            enumerable: true,
            get: function ()
            {
                var returnArray = [];
                evalNode = this.m_subtree;
                while(evalNode != null)
                {
                    returnArray.push(evalNode);
                    evalNode = evalNode.m_next;
                }

                return returnArray;
            }
        },
    });
}

// #############################################################################################
/// Function:<summary>
///             Returns the current node or creates one if no node exists
///          </summary>
// #############################################################################################
function GetOrEmplaceTrackEvalNode(_nodeContainer, _current, _prev) {

    var retval = {};
    
    if(_current == null)
    {
        // Insert a node
        var node = new TrackEvalNode();

        if (_prev == null)
        {
            if (_nodeContainer instanceof CSequenceInstance)
            {
                _nodeContainer.evalNodeHead = node;                
            }
            else
            {
                _nodeContainer.m_subtree = node;                
            }
        }
        else
        {
            _prev.m_next = node;
        }

        // If the given container is a sequence instance then assign the eval node head for the instance.
        if(_nodeContainer instanceof CSequenceInstance)
        {            
            node.m_parent = null;
        }
        else
        {            
            node.m_parent = _nodeContainer;        
        }

        retval.node = node;
        retval.next = null;
    }
    else
    {
        // Get a node
        retval.node = _current;
        retval.next = _current.m_next;
    }

    return retval;
}


// #############################################################################################
/// Function:<summary>
///             Create a new CSeqTrackInstanceInfo object
///          </summary>
// #############################################################################################
/** @constructor */
function CSeqTrackInstanceInfo()
{
	this.pKeydata = null;
    //CInstance* pInstance;
    this.objectID = -1;
	this.instanceID = -1;
	this.ownedBySequence = false;
	//bool beenCreated;
};