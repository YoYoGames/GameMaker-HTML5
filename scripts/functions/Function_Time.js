// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_Time.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

function NonExistentError(_id)
{
	console.error("Error: Index %d does not correspond to an existing time source\n", _id);
}

function BuiltInResetError()
{
	console.error("Error: Cannot reset a built-in time source\n");
}

function BuiltInStatelessError()
{
	console.error("Error: Cannot change the state of a stateless built-in time source\n");
}

function CreationError()
{
	console.error("Error: Failed to create the time source\n");
}

function DestroyWithChildrenError(_id)
{
	console.error("Error: Cannot destroy the time source (index %d) until its children have been destroyed\n", _id);
}

function BuiltInDestructionError()
{
	console.error("Error: Cannot destroy a built-in time source\n");
}

function BuiltInStopError()
{
	console.error("Error: Cannot stop a built-in time source\n");
}

function IsConfigurable(_ts)
{
	const type = _ts.GetType();

	return (type == eTimeSourceType_Configurable
		|| type == eTimeSourceType_SelfDestructing);
}

function IsReconfigurable(_ts)
{
	return (_ts.GetType() == eTimeSourceType_Configurable);
}

function IsStateful(_ts)
{
	const type = _ts.GetType();

	return (type == eTimeSourceType_Stateful
		|| type == eTimeSourceType_Configurable);
}

function GetTimeSourceWithId(_id)
{
	const visibleBuiltInSources = [
		g_GlobalTimeSource,
		g_GameTimeSource
	];

	for (const source of visibleBuiltInSources)
	{
		const ts = source.FindSourceWithId(_id);

		if (ts != null)
		{
			if (IsConfigurable(ts))
			{
				// The time source is considered destroyed - its actual destruction has just been slightly delayed
				if (ts.IsMarkedForDestruction())
				{
					return null;
				}
			}

			return ts;
		}
	}

	return null;
}

function time_source_create(_parent, _period, _units, _callback, _args = [],
							_reps = 1, _expiryType = eTimeSourceExpiryType_After)
{
	const parent = yyGetInt32(_parent);
	const period = yyGetReal(_period);
	const units = yyGetInt32(_units);
	const callback = _callback;
	const args = _args;
	const reps = yyGetInt64(_reps);
	const expiryType = yyGetInt32(_expiryType);
	
	return TimeSource_Create(parent, period, units, callback, args, reps, expiryType);
}

function TimeSource_Create(_parent, _period, _units, _callback, _args, _reps, _expiryType)
{
	const parent = GetTimeSourceWithId(_parent);

	if (parent != null)
	{
		const ts = parent.AddConfigurableChild(_period, _units, _callback, _args, _reps, _expiryType);

		if (ts != null)
		{
			return ts.GetId();
		}

		CreationError();
	}
	else
	{
		NonExistentError(_parent);
	}

	return -1;
}

function time_source_destroy(_id, _destroyTree = false)
{
	const id = yyGetInt32(_id);
	const destroyTree = yyGetBool(_destroyTree);

	if (destroyTree)
	{
		TimeSource_DestroyTree(id);
	}
	else
	{
		TimeSource_Destroy(id);
	}
}

function TimeSource_Destroy(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			if (ts.GetNumChildren() == 0)
			{
				if (ts.IsLocked())
				{
					return ts.MarkForDestruction(false);
				}

				return ts.GetDestroyingSource().Destroy(ts);
			}

			return DestroyWithChildrenError(_id);
		}

		return BuiltInDestructionError();
	}

	NonExistentError(_id);
}

function TimeSource_DestroyTree(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		// If there is a source in the tree which is executing its callback
		if (ts.FindLockedSource())
		{
			return ts.MarkForDestruction(true);
		}
		else
		{
			return ts.GetDestroyingSource().Destroy(ts);
		}
	}

	NonExistentError(_id);
}

function time_source_start(_id)
{
	const id = yyGetInt32(_id);
	TimeSource_Start(id);
}

function TimeSource_Start(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsStateful(ts))
		{
			return ts.Start();
		}

		return BuiltInStatelessError();
	}

	NonExistentError(_id);
}

function time_source_stop(_id)
{
	const id = yyGetInt32(_id);
	TimeSource_Stop(id);
}

function TimeSource_Stop(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.Stop();
		}

		return BuiltInStopError();
	}

	NonExistentError(_id);
}

function time_source_pause(_id)
{
	const id = yyGetInt32(_id);
	TimeSource_Pause(id);
}

function TimeSource_Pause(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsStateful(ts))
		{
			return ts.Pause();
		}

		return BuiltInStatelessError();
	}

	NonExistentError(_id);
}

function time_source_resume(_id)
{
	const id = yyGetInt32(_id);
	TimeSource_Resume(id);
}

function TimeSource_Resume(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsStateful(ts))
		{
			return ts.Resume();
		}

		return BuiltInStatelessError();
	}

	NonExistentError(_id);
}

function time_source_reset(_id)
{
	const id = yyGetInt32(_id);
	TimeSource_Reset(id);
}

function TimeSource_Reset(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.Reset();
		}

		return BuiltInResetError();
	}

	NonExistentError(_id);
}

function time_source_reconfigure(_id, _period, _units, _callback, _args = [],
	                             _reps = 1, _expiryType = eTimeSourceExpiryType_After)
{
	const id = yyGetInt32(_id);
	const period = yyGetReal(_period);
	const units = yyGetInt32(_units);
	const callback = _callback;
	const args = _args;
	const reps = yyGetInt64(_reps);
	const expiryType = yyGetInt32(_expiryType);

	return TimeSource_Reconfigure(id, period, units, callback, args, reps, expiryType);
}

function TimeSource_Reconfigure(_id, _period, _units, _callback, _args, _reps, _expiryType)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.Reconfigure(_period, _units, _callback, _args, _reps, _expiryType);
		}

		return BuiltInResetError();
	}

	NonExistentError(_id);
}

function time_source_get_period(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetPeriod(id);
}

function TimeSource_GetPeriod(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetPeriod();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_reps_completed(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetRepsCompleted(id);
}

function TimeSource_GetRepsCompleted(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetRepsCompleted();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_reps_remaining(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetRepsRemaining(id);
}

function TimeSource_GetRepsRemaining(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetRepsRemaining();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_units(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetUnits(id);
}

function TimeSource_GetUnits(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetUnits();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_time_remaining(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetTimeRemaining(id);
}

function TimeSource_GetTimeRemaining(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetTimeRemaining();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_state(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetState(id);
}

function TimeSource_GetState(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsStateful(ts))
		{
			return ts.GetState();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_parent(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetParent(id);
}

function TimeSource_GetParent(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			return ts.GetParent().GetId();
		}
	}
	else
	{
		NonExistentError(_id);
	}

	return undefined;
}

function time_source_get_children(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_GetChildren(id);
}

function TimeSource_GetChildren(_id)
{
	const ts = GetTimeSourceWithId(_id);

	if (ts != null)
	{
		return ts.GetChildren().map(_child => _child.GetId());
	}

	NonExistentError(_id);

	return undefined;
}

function time_source_exists(_id)
{
	const id = yyGetInt32(_id);
	return TimeSource_Exists(id);
}

function TimeSource_Exists(_id)
{
	return (GetTimeSourceWithId(_id) != null);
}

function time_seconds_to_bpm(_seconds)
{
	const seconds = yyGetReal(_seconds);
	return Time_SecondsToBPM(seconds);
}

/* Converts a given period in seconds to its equivalent frequency in beats-per-minute */
function Time_SecondsToBPM(_seconds)
{
	if (_seconds > 0.0)
	{
		return 60.0 / _seconds;
	}

	return Infinity;
}

function time_bpm_to_seconds(_bpm)
{
	const bpm = yyGetReal(_bpm);
	return Time_BPMToSeconds(bpm);
}

/* Converts a given frequency in beats-per-minute to its equivalent period in seconds */
function Time_BPMToSeconds(_bpm)
{
	if (_bpm > 0.0)
	{
		return 60.0 / _bpm;
	}

	return Infinity;
}

function call_later(_period, _units, _callback, _repeat=false)
{
	const period = yyGetReal(_period);
	const units = yyGetInt32(_units);
	const repeat = yyGetBool(_repeat);

	return CallLater(period, units, _callback, repeat);
}

/* Creates a 'self-destructing' time source */
function CallLater(_period, _units, _callback, _repeat)
{
	const ts = g_SDTimeSourceParent.AddSelfDestructingChild(_period, _units, _callback, _repeat);

	if (ts != null)
	{
		return ts.GetId();
	}

	CreationError();

	return -1;
}

function call_cancel(_handle)
{
	const handle = yyGetInt32(_handle);
	return CallCancel(handle);
}

/* Destroys an existing 'self-destructing' time source */
function CallCancel(_handle)
{
	const ts = g_SDTimeSourceParent.FindSourceWithId(_handle);

	if (ts != null)
	{
		if (IsConfigurable(ts))
		{
			if (ts.IsLocked())
			{
				return ts.MarkForDestruction(false);
			}

			return ts.GetDestroyingSource().Destroy(ts);
		}

		return BuiltInDestructionError();
	}

	NonExistentError(_handle);
}
