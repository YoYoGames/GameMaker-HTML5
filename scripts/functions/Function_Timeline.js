
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Timeline.js
// Created:			27/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/05/2011		
// 
// **********************************************************************************************************************



// #############################################################################################
/// Function:<summary>
///          	Returns whether a time line with the given index exists.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_exists(_ind) 
{
    if (_ind === undefined) return false;
    if (g_pTimelineManager.Get(yyGetInt32(_ind)) != undefined) {
        return true;
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the name of the time line with the given index.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_get_name(_ind)
{
    var tl = g_pTimelineManager.Get(yyGetInt32(_ind));
    if (tl != undefined) {
        return tl.pName;
    }
    return "";
}

function timeline_name(_ind) { return timeline_get_name(_ind); }

// #############################################################################################
/// Function:<summary>
///          	Adds a new time line. It returns the index of the time line.
///          </summary>
///
/// Out:	<returns>
///				ID of new timeline
///			</returns>
// #############################################################################################
function timeline_add() 
{
    return g_pTimelineManager.AddNew();    
}

// #############################################################################################
/// Function:<summary>
///          	Deletes the time line with the given index. Make sure no instances uses the 
///             time line in any room.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_delete(_ind) 
{
    g_pTimelineManager.Delete(yyGetInt32(_ind));
}

// #############################################################################################
/// Function:<summary>
///          	Clears the time line with the given index removing all its moments. 
///             Make sure no instances uses the time line at the moment.
///          </summary>
///
/// In:		<param name="_ind"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_clear(_ind) 
{
    g_pTimelineManager.Clear(yyGetInt32(_ind));
}

// #############################################################################################
/// Function:<summary>
///          	Adds a code action to the time line at moment step. codestr contains the code 
///             for the actions. If the step does not exist it is created. So you can add 
///             multiple code actions for the same moment.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_step"></param>
///			<param name="_codestr"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_moment_add(_ind,_step,_codestr) 
{
     //g_pTimelineManager.AddEvent(_ind, _step, _codestr);
    ErrorFunction("timeline_moment_add()");
}

function timeline_moment_add_script(_ind,_step,_script) 
{
    // get the script function    
    switch( typeof _script) {
        case "number":
        case "function":
            var func = typeof _script == "number" ? g_pGMFile.Scripts[yyGetInt32(_script) - 100000] : _script;
            g_pTimelineManager.AddEvent(yyGetInt32(_ind), yyGetInt32(_step), func );
            break;
        default:
            break;
    }
}

function timeline_size(_ind) 
{
    var tl = g_pTimelineManager.Get(yyGetInt32(_ind));
    var ret = 0;
    if (tl != undefined) {
        ret = tl.Events.count;
    } // end if
    return ret;
}

function timeline_max_moment(_ind) 
{
    var tl = g_pTimelineManager.Get(yyGetInt32(_ind));
    var ret = 0;
    if (tl != undefined) {
        ret = tl.GetLast();
    } // end if
    return ret;
}

// #############################################################################################
/// Function:<summary>
///          	You can use this function to clear all the actions for a particular moment.
///          </summary>
///
/// In:		<param name="_ind"></param>
///			<param name="_step"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function timeline_moment_clear(_ind,_step) 
{
    //ErrorFunction("timeline_moment_clear()");
    g_pTimelineManager.ClearEvent(yyGetInt32(_ind), yyGetInt32(_step));
}

