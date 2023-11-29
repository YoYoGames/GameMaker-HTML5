
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyTimeline.js
// Created:         01/08/2011
// Author:          Chris
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 01/08/2011		
// 
// **********************************************************************************************************************

// @if feature("timelines")
// #############################################################################################
/// Function:<summary>
///             Create a new TIMELINE object
///          </summary>
// #############################################################################################
/** @constructor */
function yyTimeline(_pStorage)
{
    this.__type = "[Timeline]";
    if ((_pStorage != null) && (_pStorage != undefined))
    {
        this.pName = _pStorage.pName;        
        this.Events = _pStorage.Events;
    }
    else {
        this.pName = "";
        this.Events = [];
    }
}


// #############################################################################################
/// Function:<summary>
///             Finds the index for the first event larger than or equal to the timeStamp
///          </summary>
///
/// In:		 <param name="_timeStamp">Time stamp</param>
// #############################################################################################
yyTimeline.prototype.FindLarger = function(_timeStamp) 
{
	if (this.Events.length == 0) {
		return	0;
    }
		
	// Will happen very often so we first check last
	if (_timeStamp > this.Events[this.Events.length - 1].Time)
	{
		return this.Events.length;
	}
	
	for (var i=0; i < this.Events.length; i++)
	{
	    if (this.Events[i].Time >= _timeStamp) {
			return i;
	    }
	}
	return this.Events.length;
};

// #############################################################################################
/// Function:<summary>
///             Finds the index for the last event smaller than or equal to _timeStamp
///          </summary>
///
/// In:		 <param name="_timeStamp">Time stamp</param>
// #############################################################################################
yyTimeline.prototype.FindSmaller = function(_timeStamp) {

	if (this.Events.length == 0) {
		return	0;
    }
	// Will happen very often so we first check last
	if (_timeStamp < this.Events[0].Time)
	{
		return -1;
	}
	for (var i = this.Events.length-1; i >= 0; i--)
	{
		if (this.Events[i].Time <= _timeStamp) {
			return i;
		}
	}
	return -1;
};

// #############################################################################################
/// Function:<summary>
///             // Finds the index for the first event larger than or equal to the timeStamp
///          </summary>
///
/// In:		 <param name="_timeStamp">Time stamp</param>
// #############################################################################################
yyTimeline.prototype.GetLast = function() 
{
	return this.Events[this.Events.length - 1].Time;
};


// #############################################################################################
/// Function:<summary>
///             Create a new TIMELINE management object
///          </summary>
// #############################################################################################
/** @constructor */
function yyTimelineManager()
{
    this.Timelines = [];
}

// #############################################################################################
/// Function:<summary>
///             Add a new timeline image into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">Timeline image Storage</param>
// #############################################################################################
yyTimelineManager.prototype.Add = function (_pStorage) 
{
	var pBack = null;
	if (_pStorage != null)
	{
		pBack = new yyTimeline(_pStorage);
	}
	this.Timelines[this.Timelines.length] = pBack;	
};

// #############################################################################################
/// Function:<summary>
///             Get the timeline at the given index
///          </summary>
///
/// In:		 <param name="_ind">Timeline index</param>
// #############################################################################################
yyTimelineManager.prototype.Get = function (_ind) 
{
    if ((_ind < 0) || (_ind >= this.Timelines.length)) {
        return undefined;
    }
    return this.Timelines[_ind];
};

// #############################################################################################
/// Function:<summary>
///             Finds the timeline with the given name
///          </summary>
///
/// In:		 <param name="_name">Timeline name</param>
// #############################################################################################
yyTimelineManager.prototype.Find = function(_name) 
{
    for (var i = 0; i < this.Timelines.length; i++ ) 
    {
        if (this.Timelines[i].pName == _name) {
            return i;
        }
    }
    return -1;
};

// #############################################################################################
/// Function:<summary>
///             Retrieves an array of all time line asset IDs.
///          </summary>
///
/// Out:	 <returns>
///				An array of all time line asset IDs.
///			 </returns>
// #############################################################################################
yyTimelineManager.prototype.List = function () {
	var ids = [];
	for (var i = 0; i < this.Timelines.length; ++i)
	{
		if (this.Timelines[i])
		{
			ids.push(i);
		}
	}
	return ids;
};

// #############################################################################################
/// Function:<summary>
///             Clears the events of the timeline at the given index
///          </summary>
///
/// In:		 <param name="_ind">Timeline index</param>
// #############################################################################################
yyTimelineManager.prototype.Clear = function(_ind) 
{
    if ((_ind >= 0) || (_ind < this.Timelines.length)) {
        this.Timelines[_ind].Events.Clear();
    }
};

// #############################################################################################
/// Function:<summary>
///             Adds a new timeline
///          </summary>
///
/// Out:     <param name="_ind">Timeline index</param>
// #############################################################################################
yyTimelineManager.prototype.AddNew = function () {
	var index = this.Timelines.length;

	var timeline = new yyTimeline(null);
	timeline.pName = "__newtimeline" + index;

	this.Timelines[index] = timeline;

	return index;
};

// #############################################################################################
/// Function:<summary>
///             Removes the timeline at the given index
///          </summary>
// #############################################################################################
yyTimelineManager.prototype.Delete = function (_ind) {
	if ((_ind >= 0) || (_ind < this.Timelines.length))
	{
		this.Timelines[_ind] = null;
	}
};

// #############################################################################################
/// Function:<summary>
///             Adds an event to the given timeline at the given time stamp
///          </summary>
// #############################################################################################
yyTimelineManager.prototype.AddEvent = function (_ind, _timeStamp, _codestr) {
	if ((_ind >= 0) || (_ind < this.Timelines.length))
	{
		var timeline = this.Timelines[_ind];
		
		// find pos to add the event
		var eventIndex = timeline.FindSmaller(_timeStamp)+1;
		
		// insert an entry
		var obj = [];
		obj.Time = _timeStamp;
		obj.Event = _codestr;
		timeline.Events.splice(eventIndex,0, obj);
	}
};

// #############################################################################################
/// Function:<summary>
///             Clears the event from the given timeline at the given time stamp
///          </summary>
// #############################################################################################
yyTimelineManager.prototype.ClearEvent = function (_ind, _timeStamp) {
	if ((_ind >= 0) || (_ind < this.Timelines.length))
	{
		var timeline = this.Timelines[_ind];

		for (var i = 0; i < timeline.Events.length; i++)
		{
			if (timeline.Events[i].Time == _timeStamp)
			{
			    timeline.Events.splice(i,1);
				break;
			}
		}
	}
};
// @endif timelines
