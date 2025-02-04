// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            Function_AnimCurve.js
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

function GetCurveFromRValue(_val)
{
    var pCurve = null;
    if (typeof (_val) == "object")
	//if (_val instanceof yyAnimCurve)
	{
		pCurve = _val;
	}
	else
	{
		var curveID = yyGetInt32(_val);
		pCurve = g_pAnimCurveManager.GetCurveFromID(curveID);
	}

	return pCurve;
}

function animcurve_get(_curveID)
{
	if (arguments.length != 1)
	{
		yyError("animcurve_get() - wrong number of arguments");
		return;
	}	
	
	var pCurve = GetCurveFromRValue(_curveID);
	if (pCurve == null)
	{
	    yyError("animcurve_get() - specified curve not valid");
	}
    else
	{
		return pCurve;
    }
    
    return -1;
}

function animcurve_get_channel_index(_curveIdOrCurveObject, _channelName)
{
    var result = -1;
    if (arguments.length != 2)
    {
        yyError("animcurve_get_channel_index() - wrong number of arguments");
		return result;
    }

    var pCurve = GetCurveFromRValue(_curveIdOrCurveObject);
	if (pCurve == null)
	{
	    yyError("animcurve_get_channel_index() - specified curve not valid");
        return result;
	}

    var name = yyGetString(_channelName);		// we don't need to free this
	for (var i = 0; i < pCurve.m_numChannels; i++)
	{
		var pChan = pCurve.m_channels[i];
		if ((pChan != null) && (pChan.m_name != null) && pChan.m_name == name)
		{
			result = i;
			break;
		}
	}
    return result;
}

function animcurve_get_channel(_curveIdOrCurveObject, _channelIndexOrName)
{
    var result = -1;

	if (arguments.length != 2)
	{
		yyError("animcurve_get_channel() - wrong number of arguments");
		return;
	}

	if (typeof(_curveIdOrCurveObject) != "number" && typeof(_curveIdOrCurveObject) != "object")
	{
		yyError("animcurve_get_channel() - first parameter must be either curve ID or curve object");
		return;
	}

	if (typeof(_channelIndexOrName) != "number" && typeof(_channelIndexOrName) != "string")
	{
		yyError("animcurve_get_channel() - second parameter must be either channel index or channel name");
		return;
	}
	
    var pCurve = GetCurveFromRValue(_curveIdOrCurveObject);

	if (pCurve != null)
	{
		if (typeof(_channelIndexOrName) == "number")
		{
			var channelindex = yyGetInt32(_channelIndexOrName);
			if ((channelindex < 0) || (channelindex >= pCurve.m_numChannels))
			{
				yyError("animcurve_get_channel() - specified channel index out of range");
				return;
			}

			if (pCurve.m_channels[channelindex] == null)
			{
				yyError("animcurve_get_channel() - specified channel is invalid");
				return;
			}

			result = pCurve.m_channels[channelindex];
		}
		else
		{
			var name = yyGetString(_channelIndexOrName);		// we don't need to free this

			// Pretty low-tech
			for (var i = 0; i < pCurve.m_numChannels; i++)
			{
			    var pChan = pCurve.m_channels[i];
				if ((pChan != null) && (pChan.m_name != null) && pChan.m_name == name)
				{
					result = pChan;
					break;
				}
			}
		}
    }
    
    return result;
}

function animcurve_channel_evaluate(_curveObject, _value)
{
	if (arguments.length != 2)
	{
		yyError("animcurve_channel_evaluate() - wrong number of arguments");
		return;
	}

	if (_curveObject == null || !(_curveObject instanceof yyAnimCurveChannel))
	{
		yyError("animcurve_channel_evaluate() - first parameter is not valid animation curve channel");
		return;
	}

	return _curveObject.Evaluate(yyGetReal(_value));
}

function animcurve_create()
{
	var pCurve = g_pAnimCurveManager.GetNewCurve();

	if (pCurve == null)
	{
		yyError("animcurve_create() - could not create new curve");
    }
    
    return pCurve;
}

function animcurve_destroy(_curveIdOrCurveObject)
{
    if (arguments.length != 1)
	{
		yyError("animcurve_destroy() - requires a curve ID or object");
	}

	var pCurve = GetCurveFromRValue(_curveIdOrCurveObject);

	if (pCurve == null)
	{
		yyError("animcurve_destroy() - specified curve not valid");
	}
	else if (pCurve.fromWAD == true)
	{
	    yyError("animcurve_destroy() - can't delete a curve created in the IDE");
	}
	else
	{
		g_pAnimCurveManager.FreeCurve(pCurve);
	}
}

function animcurve_exists(_curveIdOrCurveObject)
{
	if (_curveIdOrCurveObject === undefined) return false;
    if (arguments.length != 1)
    {
        yyError("animcurve_exists() - requires a curve ID or struct");
    }

    var exists = false;
    if (typeof (_curveIdOrCurveObject) == "object")
    {
        if (_curveIdOrCurveObject instanceof yyAnimCurve)
        {            
            if (g_pAnimCurveManager.IsLiveCurve(_curveIdOrCurveObject))
            {
                exists = true;
            }
        }
    }
    else
    {
        var curveID = yyGetInt32(_curveIdOrCurveObject);
        if (g_pAnimCurveManager.GetCurveFromID(curveID) != null)
        {
            exists = true;
        }
    }

    return exists ? 1.0 : 0.0;
}

function animcurve_channel_new()
{
	return new yyAnimCurveChannel();
}

function animcurve_point_new()
{
	return new yyAnimCurvePoint();
}
