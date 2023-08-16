// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_Sequence.js
// Created:         11/10/2019
// Author:          Luke
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 11/10/2019		V1.0        MJD     1st version
// 
// **********************************************************************************************************************

function GetSequenceFromRValue(_val)
{
	var pSeq = null;
    if (typeof(_val) == "object")
	//if (_val instanceof yySequence)
	{
		return _val;
	}
	else
	{
		var seqID = yyGetInt32(_val);
		pSeq = g_pSequenceManager.GetSequenceFromID(seqID);
	}

	return pSeq;
}

function sequence_create()
{
	var pSeq = g_pSequenceManager.GetNewSequence();

	if (pSeq == null)
	{
		yyError("sequence_create() - could not create new sequence");
	}
	else
	{
		return pSeq;
    }
    
    return -1;
}

function sequence_destroy(_sequenceOrId)
{
	if (arguments.length != 1)
	{
		yyError("sequence_destroy() - requires a sequence ID or object");
	}

	var pSeq = GetSequenceFromRValue(_sequenceOrId);
	
	if (pSeq == null)
	{
		yyError("sequence_destroy() - specified sequence not valid");
	}
	else if (pSeq.fromWAD == true)
	{
	    yyError("sequence_destroy() - can't delete a sequence created in the IDE");
	}
	else
	{
		g_pSequenceManager.FreeSequence(pSeq);		
	}
}

function sequence_get(_sequenceId)
{
    if (arguments.length != 1)
    {
        yyError("sequence_get() - requires a sequence ID");
    }

    var pSeq = GetSequenceFromRValue(_sequenceId);

    if (pSeq == null)
    {
        yyError("sequence_get() - specified sequence not valid");
    }
    else
    {
        return pSeq;
    }
}

function sequence_exists(_sequenceStructOrId)
{
    if (arguments.length != 1)
    {
        yyError("sequence_exists() - requires a sequence ID or struct");
    }

    var exists = false;
    if (typeof (_sequenceStructOrId) == "object")        
    {
        if (_sequenceStructOrId instanceof yySequence)
        {            
            if (g_pSequenceManager.IsLiveSequence(_sequenceStructOrId))
            {
                exists = true;
            }
        }
    }
    else
    {
        var seqID = yyGetInt32(_sequenceStructOrId);
        if (g_pSequenceManager.GetSequenceFromID(seqID) != null)
        {
            exists = true;
        }
    }

    return exists ? 1.0 : 0.0;
}

function sequence_keyframestore_new(_type)
{
	if (arguments.length != 1)
	{
		yyError("sequencekeyframestore_new() - requires a type parameter");
	}

	_type = yyGetInt32(_type);

    var pKeyframeStore = null;
	switch (_type)
	{
		case eSTT_Graphic:
		case eSTT_Instance:
		case eSTT_Sequence:
		case eSTT_Audio:
		case eSTT_SpriteFrames:
		case eSTT_Bool:
		case eSTT_String:
		case eSTT_Real:
	    case eSTT_Color:
	    case eSTT_Message:
        case eSTT_Moment:
            pKeyframeStore = new yyKeyframeStore(_type);
            break;
		default: yyError("Unsupported keyframe store type"); break;
	}

	if (pKeyframeStore == null)
	{
		return -1;
	}
	else
	{
		return pKeyframeStore;
	}	
}


function sequence_keyframe_new(_type)
{
	if (arguments.length != 1)
	{
		yyError("sequencekeyframe_new() - requires a type parameter");
	}

	_type = yyGetInt32(_type);

	var pKeyframe = null;
	switch (_type)
	{
		case eSTT_Graphic:
		case eSTT_Instance:
		case eSTT_Sequence:
		case eSTT_Audio:
		case eSTT_Text:
		case eSTT_SpriteFrames:
		case eSTT_Bool:
		case eSTT_String:
		case eSTT_Real:
	    case eSTT_Color:
	    case eSTT_Message:
        case eSTT_Moment:		
            pKeyframe = new yyKeyframe(_type);
            break;
		default: yyError("Unsupported keyframe type"); break;
	}

	if (pKeyframe == null)
	{
		return -1;
	}
	else
	{
		return pKeyframe;
	}
}


function sequence_keyframedata_new(_type)
{
	if (arguments.length != 1)
	{
		yyError("sequencekeyframedata_new() - requires a type parameter");
	}

	_type = yyGetInt32(_type);

	var pKey = null;
	switch (_type)
	{
		case eSTT_Graphic: pKey = new yyGraphicTrackKey(); break;
		case eSTT_Instance: pKey = new yyInstanceTrackKey(); break;
		case eSTT_Sequence: pKey = new yySequenceTrackKey(); break;
		case eSTT_Audio: pKey = new yyAudioTrackKey(); break;
		case eSTT_Text: pKey = new yyTextTrackKey(); break;
		case eSTT_SpriteFrames: pKey = new yySpriteFramesTrackKey(); break;
		case eSTT_Bool: pKey = new yyBoolTrackKey(); break;
		case eSTT_String: pKey = new yyStringTrackKey(); break;
		case eSTT_Real: pKey = new yyRealTrackKey(); break;
	    case eSTT_Color: pKey = new yyColorTrackKey(); break;
	    case eSTT_Message: pKey = new yyMessageEventTrackKey(); break;
		case eSTT_Moment: pKey = new yyMomentEventTrackKey(); break;
		default: yyError("Unsupported keyframe type"); break;
	}

	if (pKey == null)
	{
		return -1;
	}
	else
	{
		return pKey;
	}
}


function sequence_track_new(_type)
{
	if (arguments.length != 1)
	{
		yyError("sequencetrack_new() - requires a type parameter");
	}

	_type = yyGetInt32(_type);

	var pTrack = null;
	switch (_type)
	{
		case eSTT_Graphic: pTrack = new yySequenceGraphicTrack(); break;
		case eSTT_Instance: pTrack = new yySequenceInstanceTrack(); break;
		case eSTT_Audio: pTrack = new yySequenceAudioTrack(); break;
		case eSTT_Text: pTrack = new yySequenceTextTrack(); break;
		case eSTT_Real: pTrack = new yySequenceRealTrack(); break;
		case eSTT_Color: pTrack = new yySequenceColorTrack(); break;
		case eSTT_Bool: pTrack = new yySequenceBoolTrack(); break;
		case eSTT_String: pTrack = new yySequenceStringTrack(); break;
		case eSTT_Sequence: pTrack = new yySequenceSequenceTrack(); break;		
		case eSTT_Particle: pTrack = new yySequenceParticleTrack(); break;
		case eSTT_ClipMask: pTrack = new yySequenceClipMaskTrack(); break;
		case eSTT_ClipMask_Mask: pTrack = new yySequenceClipMask_MaskTrack(); break;
		case eSTT_ClipMask_Subject: pTrack = new yySequenceClipMask_SubjectTrack(); break;
		case eSTT_Group: pTrack = new yySequenceGroupTrack(); break;		
		case eSTT_SpriteFrames: pTrack = new yySequenceSpriteFramesTrack(); break;				
		default: yyError("Unsupported track type"); break;
	}

	if (pTrack == null)
	{
		return -1;
	}
	else
	{
		return pTrack;
	}
}

function sequence_get_objects(_sequenceOrId)
{
	if (arguments.length != 1)
	{
		yyError("sequence_get_objects() - wrong number of arguments");
		return;
	}

	var pSeq = null;
	pSeq = GetSequenceFromRValue(_sequenceOrId);

	if (pSeq != null)
	{
		return pSeq.GetObjectIDs().map((id) => MAKE_REF(REFID_OBJECT, id));
	}

	return -1;
}

function sequence_instance_override_object(_inst, _objectID, _instanceID)
{
	if (arguments.length != 3)
	{
		yyError("sequence_instance_override_object() - wrong number of arguments");
		return;
	}
	
	if ((typeof(_inst) !== "object") || (_inst == null) || !(_inst instanceof CSequenceInstance))
	{
		yyError("sequence_instance_override_object() - specified sequence instance is not valid");
		return;
	}

	var pSeqInst = _inst;
	var pSeq = g_pSequenceManager.GetSequenceFromID(pSeqInst.m_sequenceIndex);
	if (pSeq != null)
	{
		_objectID = yyGetInt32(_objectID);
		_instanceID = yyGetInt32(_instanceID);

		g_SeqStack.push(pSeq);

		pSeqInst.SetupInstances(pSeq.m_tracks, _objectID, _instanceID, -1);

		g_SeqStack.pop();
	}	
}