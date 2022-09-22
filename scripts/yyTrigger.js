// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:	    	yyTrigger.js
// Created:	        08/10/2011
// Author:    		Mike
// Project:		    HTML5
// Description:   	
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 08/10/2011		
// 
// **********************************************************************************************************************


// #############################################################################################
/// Function:<summary>
///             Create a trigger
///          </summary>
// #############################################################################################
/** @constructor */
function yyTrigger()
{
    this.pName = "";
    this.moment = 0;
    this.ConstName = "";
    this.pFunc = null;
}



// #############################################################################################
/// Function:<summary>
///             
///          </summary>
// #############################################################################################
/** @constructor */
function yyTriggerManager( _pTriggers ) 
{
	if (!_pTriggers)
	{
		this.pool = [];
	} else
	{
		this.pool = _pTriggers;
	}

}


// #############################################################################################
/// Function: <summary>
///              Given the function, return the trigger index.
///           </summary>
// #############################################################################################
yyTriggerManager.prototype.Find = function (_pFunction) {
	// Trigger 0 is unused.
	for (var i = 1; i < this.pool.length; i++)
	{
		if (this.pool[i].pFunc == _pFunction)
		{
			return i;
		}
	}
	return -1;
};



// #############################################################################################
/// Function: <summary>
///              Given the index, return the trigger.
///           </summary>
// #############################################################################################
yyTriggerManager.prototype.Get = function(_index){
	return this.pool[_index];
};


// #############################################################################################
/// Function:<summary>
///          	Process triggers for a specific "step"
///          </summary>
///
/// In:		<param name="_step">STEP to process</param>
///				
// #############################################################################################
yyTriggerManager.prototype.Process = function (_moment) {

	// Loop through all triggers and fire the one's that deal with this "moment". Trigger 0 is unused. 
	for (var i = 1; i < this.pool.length; i++)
	{
		var pTrig = this.pool[i];
		if (pTrig.moment == _moment)
		{
			g_pInstanceManager.PerformEvent(EVENT_TRIGGER, i);
		}
	}
};
