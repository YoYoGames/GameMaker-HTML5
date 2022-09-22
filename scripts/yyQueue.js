// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:			yyQueue.js
// Created:			21/10/2011
// Author:			Mike
// Project:			HTML5
// Description:		Simple "queue"
//
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 21/10/2011		V1.0		MJD		1st version.
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///          	Create a new QUEUE
///          </summary>
// #############################################################################################
/**@constructor*/
function yyQueue() 
{
	this.queue = [];
	this.offset = 0;
	this.Pop = yyQueue.prototype.Dequeue;
	this.Push = yyQueue.prototype.Enqueue;
};

// #############################################################################################
/// Function: <summary>
///           	Get the length of the queue
///           </summary>
// #############################################################################################
yyQueue.prototype.Length = function () {
	return (this.queue.length - this.offset);
};

// #############################################################################################
/// Function: <summary>
///           	Length at LEAST have "_count" elements in it?
///           </summary>
// #############################################################################################
yyQueue.prototype.AtLeast = function (_count) {
	return ((this.queue.length - this.offset) >= _count);
};

// #############################################################################################
/// Function: <summary>
///           	Is the queue empty?
///           </summary>
// #############################################################################################
yyQueue.prototype.IsEmpty = function () {
	return (this.queue.length==0);
};

// #############################################################################################
/// Function: <summary>
///           	Enqueue an item
///           </summary>
// #############################################################################################
yyQueue.prototype.Enqueue = function (_item) {
	this.queue.push(_item);
};

// #############################################################################################
/// Function: <summary>
///           	Dequeue an item
///           </summary>
// #############################################################################################
yyQueue.prototype.Dequeue = function () 
{
	if( this.IsEmpty() ) return undefined;

	// get item from start of queue
	var item = this.queue[this.offset];

	// Only cut down on space "now and then", and base it on the size of the queue.
	if ((++this.offset * 2) >= this.queue.length)
	{
		this.queue = this.queue.slice(this.offset);
		this.offset = 0;
	}

	return item;
};

// #############################################################################################
/// Function: <summary>
///           	Look at the start of the queue
///           </summary>
// #############################################################################################
yyQueue.prototype.peek = function () {
	if (this.queue.length > 0){
		return this.queue[this.offset];
	} else{
		return undefined;
	}
};

