// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyTime.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

/* Built-in time source IDs */
var eTimeSource_Global = 0,
    eTimeSource_Game = 1,
    eTimeSource_SDParent = 2;

/* Time source units */
var eTimeSourceUnits_Seconds = 0,
    eTimeSourceUnits_Frames = 1;

/* Time sources expiry types */
var eTimeSourceExpiryType_Nearest = 0,
    eTimeSourceExpiryType_After = 1;

/* Time source states */
var eTimeSourceState_Initial = 0,
    eTimeSourceState_Active = 1,
    eTimeSourceState_Paused = 2,
    eTimeSourceState_Stopped = 3;

/* Time source types */
var eTimeSourceType_Basic = 0,
    eTimeSourceType_Stateful = 1,
    eTimeSourceType_Configurable = 2,
    eTimeSourceType_SelfDestructing = 3;

/* Converts microseconds (us) into seconds (s) */
function MicrosToSeconds(_us)
{
    return _us / 1e6;
}

/* Converts seconds (s) into microseconds (us) */
function SecondsToMicros(_s)
{
    return _s * 1e6;
}

/********** CTimeSource *********/

class CTimeSource
{
    /* Creates a time source with the given ID */
    constructor(_id)
    {
        this.type = eTimeSourceType_Basic;
        this.dt = 0; // Delta time - the time passed since the last call to Tick()
        this.children = [];

        if (_id === undefined)
        {
            this.id = CTimeSource.idCtr++; // The ID (index) of the time source
        }
        else
        {
            if (_id < CTimeSource.idCtr)
            {
                throw new Error("Failed to assign the correct ID to a built-in time source.")
            }

            this.id = _id;
            CTimeSource.idCtr = _id + 1;
        }
    }

    /* Handles a request to destroy the given time source */
    Destroy(_source)
    {
        // Built-ins cannot be destroyed
        if (_source == this)
        {
            // So just destroy all of their children
            this.children = [];
        }
        else
        {
            this.RemoveChild(_source);
        }
    }

    /* Returns the time source which can destroy this one */
    GetDestroyingSource()
    {
        // Built-ins cannot be destroyed, but can handle calls for their own destruction (see CTimeSource::Destroy)
        return this;
    }

    /* Indicates that the time source's children should be destroyed at the earliest opportunity */
    MarkForDestruction(_markChildren)
    {
        // Built-ins cannot be destroyed, so this only applies to their children
        if (_markChildren)
        {
            for (let i = 0; i < this.children.length; ++i)
            {
                const child = this.children[i];

                if (child != null)
                {
                    child.MarkForDestruction(true);
                }
            }
        }
    }

    /* Regular 'tick' function which updates the time source */
    Tick(_dt)
    {
        this.dt += _dt;
    }

    /* Ticks the timers of all of the time sources which are children of this one */
    TickChildren()
    {
        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                child.Tick(this.dt);
            }
        }

        this.dt = 0;
    }

    /* Checks whether any of the time sources which are children of this one should invoke their callback */
    CheckChildren()
    {
        // Create a shallow copy of the currently existing children
        const children = this.children.slice();

        for (let i = 0; i < children.length; ++i)
        {
            const child_copy = children[i];

            if (child_copy != null)
            {
                // Now cross reference the copy of the child with the actual children to see if it still exists.
                // We do this in case a source deletes its sibling.
                const idx = this.children.indexOf(child_copy);

                if (idx != -1)
                {
                    const child = this.children[idx];

                    // Another source might have marked this one for destruction
                    if (!child.IsMarkedForDestruction())
                    {
                        child.Check();
                    }

			        // For the case where a child tries to destroy itself (or a subtree which it is part of) during its callback,
			        // we delayed it until it returned from the callback - so destroy it now.
                    if (child.IsMarkedForDestruction())
                    {
                        this.RemoveChild(child);
                    }
                }
            }
        }
    }
    
    /* Creates a new configurable time source which is a child of this one */
    AddConfigurableChild(_period, _units, _callback, _args, _reps, _expiryType)
    {
        const child = new CConfigurableTimeSource(this, _period, _units, _callback, _args, _reps, _expiryType);

        if (child != null)
        {
            this.children.push(child);
            return child;
        }

        return null;
    }

    /* Creates a new 'self-destructing' time source which is a child of this one */
    AddSelfDestructingChild(_period, _units, _callback, _repeat)
    {
        const child = new CSelfDestructingTimeSource(this, _period, _units, _callback, _repeat);

        if (child != null)
        {
            this.children.push(child);
            return child;
        }

        return null;
    }

    /* Destroys a time soruce which is a child of this one */
    RemoveChild(_child)
    {
        const child = this.children.indexOf(_child);

        if (child != -1)
        {
            this.children.splice(child, 1);
        }
    }

    /* Returns all of the children of this time source */
    GetChildren()
    {
        return this.children;
    }

    /* Returns the number of children of this time source */
    GetNumChildren()
    {
        return this.children.length;
    }

    /* Returns the ID of this time source */
    GetId()
    {
        return this.id;
    }

    /* Starting with itself, searches through child time sources to return the one with the given ID, if it exists. */
    FindSourceWithId(_id)
    {
        if (this.id == _id)
        {
            return this;
        }

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                const ts = child.FindSourceWithId(_id);

                if (ts != null)
                {
                    return ts;
                }
            }
        }

        return null;
    }

    /* Searches through child time sources to return the one which is locked, if any */
    FindLockedSource()
    {
        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                const ts = child.FindLockedSource();

                if (ts != null)
                {
                    return ts;
                }
            }
        }

        return null;
    }

    /* Returns the type of the time source */
    GetType()
    {
        return this.type;
    }
}

CTimeSource.idCtr = 0;

/********** CStatefulTimeSource *********/

class CStatefulTimeSource extends CTimeSource
{
    constructor(_id)
    {
        super(_id);
        this.type = eTimeSourceType_Stateful;
        this.state = eTimeSourceState_Active;
    }

    /* Pauses the time source and all of its children */
    Pause()
    {
        // State change only applies to active sources
        if (this.state == eTimeSourceState_Active)
        {
            this.state = eTimeSourceState_Paused;
        }

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                child.Pause();
            }
        }
    }

    /* Resumes the time source and all of its children */
    Resume()
    {
        // State change only applies to paused sources
        if (this.state == eTimeSourceState_Paused)
        {
            this.state = eTimeSourceState_Active;
        }

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                child.Resume();
            }
        }
    }

    /* Starts/Resumes the time source and all of its children */
    Start()
    {
        this.PropagateState(eTimeSourceState_Active);
    }

    /* Returns the current state of the time source */
    GetState()
    {
        return this.state;
    }

    /* Sets the state of the time source and propagates the change to all of its children */
    PropagateState(_state)
    {
        this.state = _state;

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                child.PropagateState(this.state);
            }
        }
    }
}

/********** CConfigurableTimeSource *********/

class CConfigurableTimeSource extends CStatefulTimeSource
{
    constructor(_parent, _period, _units, _callback, _args, _reps, _expiryType)
    {
        super();
        this.type = eTimeSourceType_Configurable;
        this.locked = false; // This ensures the source's existence while it invokes the callback
        this.markedForDestruction = false; // This indicates that the source should destroy itself when it can

        this.parent = _parent;
        this.period = 1;
        this.units = eTimeSourceUnits_Seconds;
        this.callback = null;
        this.args = null;
        this.repsRequested = 0; // -1 indicates infinite repetition
        this.repsCompleted = 0;
        this.repsRemaining = 0;
        this.expiryType = eTimeSourceExpiryType_After;

        this.t = 0; // Internal time
        this.state = eTimeSourceState_Initial;

        this.Reconfigure(_period, _units, _callback, _args, _reps, _expiryType);
    }

    /* Destroys the given time source, if it is a child of this one */
    Destroy(_source)
    {
        this.RemoveChild(_source);
    }

    /* Returns the time source which can destroy this one */
    GetDestroyingSource()
    {
        return this.parent;
    }

    /* Regular 'tick' function which updates the time source */
    Tick(_dt)
    {
        this.dt = _dt;

        if (this.state == eTimeSourceState_Active)
        {
            this.IncrementTimer();
        }

        this.TickChildren();
    }

    /* Checks whether the time source should expire */
    Check()
    {
        if (this.state == eTimeSourceState_Active)
        {
            if (this.Expired() || this.ShouldExpireEarly())
            {
                this.HandleExpiry();
            }
        }

        this.CheckChildren();
    }

    /* Starts/Resumes the time source and all of its children */
    Start()
    {
        // If the time source has completely expired
        if (this.HasFinished())
        {
            // Prepare to restart with the same configuration
            this.SoftReset();
        }

        this.PropagateState(eTimeSourceState_Active);
    }

    /* Stops the time source and all of its children */
    Stop()
    {
        // State change only applies to non-initial and unfinished sources
        if (this.state != eTimeSourceState_Initial && !this.HasFinished())
        {
            this.state = eTimeSourceState_Stopped;
            this.t = 0;
        }

        for (let i = 0; i < this.children.length; ++i)
        {
            const child = this.children[i];

            if (child != null)
            {
                child.Stop();
            }
        }
    }

    /* Prepares the time source to re-run with the same configuration */
    SoftReset()
    {
        this.state = eTimeSourceState_Initial;
        this.t = 0;
        this.repsRemaining = this.repsRequested;
    }

    /* Resets the state of the time source */
    Reset()
    {
        this.PropagateState(eTimeSourceState_Initial);

        this.t = 0;
        this.repsRemaining = this.repsRequested;
        this.repsCompleted = 0;
    }

    /* Fully resets and reconfigures the time source */
    Reconfigure(_period, _units, _callback, _args, _reps, _expiryType)
    {
        this.ValidateInputs(_period, _units, _callback, _args, _reps, _expiryType);

        this.period = this.ConvertPeriod(_period, _units);
        this.units = _units;
        this.callback = (typeof _callback === "number") ? script_get(_callback) : _callback;
        this.args = [global, global, ..._args]; // self, other, [destructured args]
        this.repsRequested = _reps;
        this.expiryType = _expiryType;

        // Reset the state
        this.Reset();
    }

    /* Returns the period of the time source */
    GetPeriod()
    {
        if (this.units == eTimeSourceUnits_Seconds)
        {
            return MicrosToSeconds(this.period);
        }

        return this.period;
    }

    /* Returns the units that the time source is currently using */
    GetUnits()
    {
        return this.units;
    }

    /* Returns the number of times the time source has expired since its last hard reset */
    GetRepsCompleted()
    {
        return this.repsCompleted;
    }

    /* Returns the number of times the timer will expire before it soft resets */
    GetRepsRemaining()
    {
        return this.repsRemaining;
    }

    /* Returns the time left until the next expiry of the time source in the given units */
    GetTimeRemaining()
    {
        const tRemaining = yymax(this.period - this.t, 0);

        if (this.units == eTimeSourceUnits_Seconds)
        {
            return MicrosToSeconds(tRemaining);
        }

        return tRemaining;
    }

    /* Returns the parent time source of this one */
    GetParent()
    {
        return this.parent;
    }

    /* Returns whether the time source is currently executing the callback */
    IsLocked()
    {
        return this.locked;
    }

    /* Starting with itself, searches through child time sources to return the one which is locked, if any */
    FindLockedSource()
    {
        if (this.locked)
        {
            return this;
        }

        const child = super.FindLockedSource();

        if (child != null)
        {
            return child;
        }

        return null;
    }

    /* Indicates that the time source should be destroyed at the earliest opportunity */
    MarkForDestruction(_markChildren)
    {
        this.markedForDestruction = true;

        super.MarkForDestruction(_markChildren);
    }

    /* Returns whether the time source should be destroyed at the earliest opportunity */
    IsMarkedForDestruction()
    {
        return this.markedForDestruction;
    }

    /* Increments the internal timer */
    IncrementTimer()
    {
        if (this.units == eTimeSourceUnits_Seconds)
        {
            // Apply the accumulated time deltas since the last tick
            this.t += this.dt;
        }
        else if (this.units == eTimeSourceUnits_Frames)
        {
            // As this is being called once per frame, we can simply increment
            ++this.t;
        }
    }

    /* Handles rollover of the internal timer on expiry */
    RolloverTimer()
    {
        if (this.t < this.period)
        {
            // If we expired early then t should be negative
            this.t -= this.period;
        }
        else
        {
            // t might be much greater than period if there was a break in execution
            // or if period is very small, so modulo rather than subtract
            this.t %= this.period;
        }
    }

    /* Handles counting of repetitions completed/remaining */
    HandleReps()
    {
        ++this.repsCompleted;

        if (this.repsRemaining > 0)
        {
            --this.repsRemaining;
        }
    }

    /* Returns whether the time source has finished running completely */
    HasFinished()
    {
        return (this.repsRemaining == 0);
    }

    /* Returns whether the time source should expire */
    Expired()
    {
        return (this.t >= this.period);
    }

    /* Returns whether the time source should expire early (i.e. now) */
    ShouldExpireEarly()
    {
        if (this.expiryType == eTimeSourceExpiryType_Nearest
         && this.units == eTimeSourceUnits_Seconds)
        {
            const timeRemaining = this.period - this.t;

            // This is fairly crude - we could instead take an average of dt
            // to account for variable frame rates, if necessary
            if (timeRemaining > this.dt)
            {
                // This probably isn't the penultimate tick
                return false;
            }

            const estimatedOvershoot = (this.t + this.dt) - this.period;

            // If we're closer to the expiry time now than we would be on the next tick
            if (timeRemaining < estimatedOvershoot)
            {
                return true;
            }
        }

        return false;
    }

    /* Handles expiry of the time source */
    HandleExpiry()
    {
        this.HandleReps();

        if (this.HasFinished())
        {
            // Clip the internal timer
            this.t = this.period;
            this.state = eTimeSourceState_Stopped;
        }
        else
        {
            this.RolloverTimer();
        }

        this.InvokeCallback();
    }

    /* Invokes the callback attached to the time source */
    InvokeCallback()
    {
        if (this.callback != null)
        {
            this.locked = true;
            this.callback(...this.args);
            this.locked = false;
        }
    }

    /* Converts a 'real' (floating point) period into an integer, based on the units it is measured in */
    ConvertPeriod(_period, _units)
    {
        if (_units == eTimeSourceUnits_Seconds)
        {
            const period = yymax(_period, 1e-6);

            // Internally, we use microseconds as our units
            return Math.floor(SecondsToMicros(period));
        }
        else
        {
            // Perhaps we should allow for fractional frame periods, 
            // to make use of the expiry types for frame-based time sources...
            const period = yymax(_period, 1.0);
            return Math.floor(period);
        }
    }

    /* Validates all input parameters used to configure time sources */
    ValidateInputs(_period, _units, _callback, _args, _reps, _expiryType)
    {
        this.ValidateUnits(_units);
        this.ValidatePeriod(_period, _units);
        this.ValidateCallback(_callback);
        this.ValidateArgs(_args);
        this.ValidateReps(_reps);
        this.ValidateExpiryType(_expiryType);
    }

    /* Validates the requested period */
    ValidatePeriod(_period, _units)
    {
        switch (_units) // _units should be valid
        {
            // Period clipping/conversion happens in ConvertPeriod()
            case eTimeSourceUnits_Seconds:
            {
                if (_period < 1e-6) // 1us is our timer resolution
                {
                    console.warn("Warning: Second-based time source period was too low and will be clipped (min: 1e-6).\n");
                }
                break;
            }
            case eTimeSourceUnits_Frames:
            {
                const frac = _period % 1;

                if (_period < 1.0) // Can't have a sub-frame period
                {
                    console.warn("Warning: Frame-based time source period was too low and will be clipped (min: 1).\n");
                }
                else if (frac != 0.0) // Can't have a non-integer frame-based period, for now...
                {
                    console.warn("Warning: Non-integral period for a frame-based time source will be converted to an integer.\n");
                }
                break;
            }
            default: // Just in case...
            {
                yyError("Error: Illegal time source unit type: " + _units);
                break;
            }
        }
    }

    /* Validates the requested units */
    ValidateUnits(_units)
    {
        switch (_units)
        {
            default:
                yyError("Error: Illegal time source unit type: " + _units);
            case eTimeSourceUnits_Seconds:
            case eTimeSourceUnits_Frames:
                break;
        }
    }

    /* Validates the requested callback */
    ValidateCallback(_callback)
    {
        if (typeof _callback != 'function'
        && (typeof _callback != 'number' || script_get(_callback) === null))
        {
            yyError("Error: Time source callback must be a method or function");
        }
    }

    /* Validates the requested callback arguments */
    ValidateArgs(_args)
    {
        if (!Array.isArray(_args))
        {
            yyError("Error: Time source callback arguments must be an array");
        }
    }

    /* Validates the requested repetitions */
    ValidateReps(_reps)
    {
        if (_reps < -1) // -1 indicates infinite repetition
        {
            yyError("Error: Illegal time source repetition value: " + _reps);
        }
    }

    /* Validates the requested expiry type */
    ValidateExpiryType(_expiryType)
    {
        switch (_expiryType)
        {
            default:
                yyError("Error: Illegal time source expiry type: " + _expiryType);
            case eTimeSourceExpiryType_Nearest:
            case eTimeSourceExpiryType_After:
                break;
        }
    }
};

/********** CSelfDestructingTimeSource *********/

class CSelfDestructingTimeSource extends CConfigurableTimeSource
{
    constructor(_parent, _period, _units, _callback, _repeat)
    {
        super(_parent, _period, _units, _callback, [], _repeat == true ? -1 : 1, eTimeSourceExpiryType_After);
        this.type = eTimeSourceType_SelfDestructing;
        this.state = eTimeSourceState_Active;
    }

    /* Handles expiry of the time source */
    HandleExpiry()
    {
        this.HandleReps();

        if (this.HasFinished())
        {
            // Clip the internal timer
            this.t = this.period;

            // Will be destroyed after the callback
		    this.markedForDestruction = true;
        }
        else
        {
            this.RolloverTimer();
        }

        this.InvokeCallback();
    }
};

/* Built-in time sources */
var g_GlobalTimeSource = new CTimeSource(eTimeSource_Global);
var g_GameTimeSource = new CStatefulTimeSource(eTimeSource_Game);
var g_SDTimeSourceParent = new CTimeSource(eTimeSource_SDParent);
