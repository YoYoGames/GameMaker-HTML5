
// **********************************************************************************************************************
// 
// Copyright (c)2019, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyAnimCurve.js
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

// @if feature("animcurves")
// #############################################################################################
/// Function:<summary>
///             Create a new AnimCurvePoint object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAnimCurvePoint(_pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[CurvePoint]";

    this.m_x = 0;
    this.m_value = 0;
    this.m_tx0 = 0;
    this.m_ty0= 0;
    this.m_tx1 = 0;
    this.m_ty1 = 0;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_x = _pStorage.x;
        this.m_value = _pStorage.value;
        this.m_tx0 = _pStorage.tx0;
        this.m_ty0 = _pStorage.ty0;
        this.m_tx1 = _pStorage.tx1;
        this.m_ty1 = _pStorage.ty1;
    }

    this.SignalChange();

    Object.defineProperties(this, {
        gmlposx: {
            enumerable: true,
            get: function () { return this.m_x; },
            set: function (_val)
            {
                this.m_x = yyGetReal(_val);
                this.SignalChange();
            }
        },
        gmlvalue: {
            enumerable: true,
            get: function () { return this.m_value; },
            set: function (_val)
            {
                this.m_value = yyGetReal(_val);
                this.SignalChange();
            }
        }
    });
}

var g_ScratchPoints = [];

// #############################################################################################
/// Function:<summary>
///             Create a new AnimCurveChannel object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAnimCurveChannel(_pStorage) {

    CSequenceBaseClass.call(this); //base constructor

    this.__type = "[AnimCurveChannel]";

    this.m_name = "";
    this.m_curveType = 0;
    this.m_iterations = 0;
    this.m_numPoints = 0;
    this.m_points = [];
    this.numCachedPoints = 0;
    this.cachedPoints = [];

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.m_name = _pStorage.name;
        this.m_curveType = _pStorage.function;
        this.m_iterations = _pStorage.iterations;
        this.m_numPoints = _pStorage.points.length;
        this.m_points = [];
        for (var pointIndex = 0; pointIndex < this.m_numPoints; ++pointIndex) {
            this.m_points[pointIndex] = new yyAnimCurvePoint(_pStorage.points[pointIndex]);
        }
    }

    this.SignalChange();

    Object.defineProperties(this, {
        gmlname: {
            enumerable: true,
            get: function () { return this.m_name; },
            set: function (_val)
            {
                this.m_name = yyGetString(_val);
            }
        },
        gmltype: {
            enumerable: true,
            get: function () { return this.m_curveType; },
            set: function (_val)
            {
                _val = yyGetInt32(_val);
                _val = yymax(_val, 0);
                this.m_curveType = _val;

                this.ScrubCachedPoints();
                this.changeIndex = GetNextSeqObjChangeIndex();
            }
        },
        gmliterations: {
            enumerable: true,
            get: function () { return this.m_iterations; },
            set: function (_val)
            {
                _val = yyGetInt32(_val);
                _val = yymax(_val, 0);
                this.m_iterations = _val;

                this.ScrubCachedPoints();
                this.changeIndex = GetNextSeqObjChangeIndex();
            }
        },
        gmlnumPoints: {
            enumerable: true,
            get: function () { return this.m_numPoints; }
        },
        gmlpoints: {
            enumerable: true,
            get: function () { return this.m_points; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_points = _val;
                    this.m_numPoints = _val.length;

                    this.ScrubCachedPoints();
                    this.changeIndex = GetNextSeqObjChangeIndex();
                }
                else
                {
                    throw new Error("value must be an array of channels");
                }
            }
        }
    });

    // #############################################################################################
    /// Function:<summary>
    ///             Evaluate the ani8mation curve value from the given x value
    ///          </summary>
    // #############################################################################################
    this.Evaluate = function(_x)
    {
        if (this.NeedsRegen())
        {
            this.UpdateCachedPoints();
            this.changeIndex = GetCurrSeqObjChangeIndex();
        }

        if (_x < 0.0)
            _x = 0.0;

        if (_x > 1.0)
            _x = 1.0;

        // Now find the two nearest points in the cached points list and interpolate between them
        var start = 0;
        var end = this.numCachedPoints - 1;
        var mid = end >> 1;

        while (mid != start)
        {
            if (this.cachedPoints[mid].m_x > _x)
            {
                end = mid;			
            }
            else
            {
                start = mid;
            }

            mid = (start + end) >> 1;
        }	

        var x1 = this.cachedPoints[mid].m_x;
        var x2 = this.cachedPoints[mid + 1].m_x;

        if (x1 == x2)   // these two points line up vertically and happen to exactly match the query value
        {
            return this.cachedPoints[mid].m_value;
        }

        var val1 = this.cachedPoints[mid].m_value;
        var val2 = this.cachedPoints[mid + 1].m_value;	

        var ratio = (_x - x1) / (x2 - x1);
        var val = ((val2 - val1) * ratio) + val1;

        return val;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Updates the cached points for the animation curve
    ///          </summary>
    // #############################################################################################
    this.UpdateCachedPoints = function(_closed, _clampX, _normaliseY)
    {
        // 'Default' values :)
        if (_closed == undefined)
            _closed = false;
        if (_clampX == undefined)
            _clampX = true;
        if (_normaliseY == undefined)
            _normaliseY = true;

        this.ScrubCachedPoints();

        if (this.m_curveType == eACCT_CatmullRom_Centripetal)
        {
            this.ComputeCatmullRom(  _closed, _clampX, _normaliseY );
        }
        else if( this.m_curveType == eACCT_Bezier2D )
        {
            this.ComputeBezier();
        }
        else //this.m_curveType == eACCT_Linear
        {
            var numPoints = this.m_numPoints;
            for (var j = 0; j < numPoints; j++)
            {
                var pPoint = this.AllocNewCachedPoint();
                pPoint.m_x = this.m_points[j].m_x;
                pPoint.m_value = this.m_points[j].m_value;					
            }
        }

        // Reset change index of the curve channel (this will allow us to detect dirty points in future)
        for (var i = 0; i < numPoints; i++)
        {
            this.changeIndex = yymax(this.changeIndex, this.m_points[i].changeIndex);
        }
        //changeIndex = GetCurrSeqObjChangeIndex();
    };

    this.ComputeCatmullRom = function(_closed, _clampX, _normaliseY)
    {
        // Centripetal Catmull-Rom
        var numPoints = this.m_numPoints;
        if (numPoints < 2) { // We need 4 points (we duplicate first and last)
            yyError("Cannot evaluate catmull-rom animation curve, a minimum of 2 points is required");
            return;
        }
        var ptCount = numPoints+2;

        var scale = 1.0;
        var offset = 0.0;
        if (_normaliseY)
        {
            var miny = this.m_points[0].m_value;
            var maxy = miny;
            for(var i = 1; i < numPoints; i++)
            {
                miny = yymin(miny, this.m_points[i].m_value);
                maxy = yymax(maxy, this.m_points[i].m_value);
            }
            var range = maxy - miny;
            offset = miny;
            if (range > 1.0)
                scale = range;
            var rcp_scale = 1.0 / scale;
            var ix = 2;
            for(var i = 0; i < numPoints; i++)
            {
                g_ScratchPoints[ix++] = this.m_points[i].m_x;
                g_ScratchPoints[ix++] = (this.m_points[i].m_value - offset) * rcp_scale;
            }
        }
        else
        {
            ix = 2;
            for (var i = 0; i < numPoints; i++)
            {
                g_ScratchPoints[ix++] = this.m_points[i].m_x;
                g_ScratchPoints[ix++] = this.m_points[i].m_value;
            }
        }

        //double up end points
        g_ScratchPoints[0] = g_ScratchPoints[2];
        g_ScratchPoints[1] = g_ScratchPoints[3];
        var c = ptCount * 2;
        g_ScratchPoints[c - 2] = g_ScratchPoints[c - 4];
        g_ScratchPoints[c - 1] = g_ScratchPoints[c - 3];

        var alpha = 0.5;
        var end = (_closed == true) ? ptCount : ptCount-3;

        for (var i = 0; i < end; ++i) 
        {
            // Clamp/wrap points
            var i0 = i, i1 = i + 1, i2 = i + 2, i3 = i + 3;

            var p0x = g_ScratchPoints[i0 * 2];
            var p1x = g_ScratchPoints[i1 * 2];
            var p2x = g_ScratchPoints[i2 * 2];
            var p3x = g_ScratchPoints[i3 * 2];

            var p0y = g_ScratchPoints[i0 * 2 + 1];
            var p1y = g_ScratchPoints[i1 * 2 + 1];
            var p2y = g_ScratchPoints[i2 * 2 + 1];
            var p3y = g_ScratchPoints[i3 * 2 + 1];

            var t1 = CatmullRomTime(0, p0x, p0y, p1x, p1y, alpha);
            var t2 = CatmullRomTime(t1, p1x, p1y, p2x, p2y, alpha);
            var t3 = CatmullRomTime(t2, p2x, p2y, p3x, p3y, alpha);
                
            var step = (t2 - t1) / this.m_iterations;
            var minX = p1x;
            var maxX = p2x;
            for (var t = t1; t <= t2; t += step)
            {
                var a1x = (t1 - t) / (t1)* p0x + (t) / (t1)* p1x;
                var a1y = (t1 - t) / (t1)* p0y + (t) / (t1)* p1y;				
                var a2x = (t2 - t) / (t2 - t1) * p1x + (t - t1) / (t2 - t1) * p2x;
                var a2y = (t2 - t) / (t2 - t1) * p1y + (t - t1) / (t2 - t1) * p2y;				
                var a3x = (t3 - t) / (t3 - t2) * p2x + (t - t2) / (t3 - t2) * p3x;
                var a3y = (t3 - t) / (t3 - t2) * p2y + (t - t2) / (t3 - t2) * p3y;				

                var b1x = (t2 - t) / (t2)* a1x + (t) / (t2)* a2x;
                var b1y = (t2 - t) / (t2)* a1y + (t) / (t2)* a2y;

                var b2x = (t3 - t) / (t3 - t1) * a2x + (t - t1) / (t3 - t1) * a3x;
                var b2y = (t3 - t) / (t3 - t1) * a2y + (t - t1) / (t3 - t1) * a3y;

                var cx = (t2 - t) / (t2 - t1) * b1x + (t - t1) / (t2 - t1) * b2x;
                var cy = (t2 - t) / (t2 - t1) * b1y + (t - t1) / (t2 - t1) * b2y;

                //enforce +ve progression in x values (ie only single result for given input h )
                if (_clampX)
                {
                    cx = yymax(cx, minX);
                    cx = yymin(cx, maxX);
                    minX = cx;
                }

                var pPoint = this.AllocNewCachedPoint();
                pPoint.m_x = cx;
                pPoint.m_value = (cy * scale) + offset;
            }
        }
        if (_closed == false)
        {
            var pPoint = this.AllocNewCachedPoint();
            pPoint.m_x = this.m_points[numPoints - 1].m_x;
            pPoint.m_value = this.m_points[numPoints - 1].m_value;
        }
    };

    this.ComputeBezier = function()
    {
	    var numPoints = this.m_numPoints;
        if (numPoints < 2) { // We need 2 points min
		    yyError("Cannot evaluate bezier animation curve, a minimum of 2 points is required");
		    return;
	    }
	    var _iterations = this.m_iterations * 2;
	    var iter = 1.0 / _iterations;
	    for (var i = 0; i < numPoints - 1; ++i)
	    {
		    var pt = this.m_points[i];
		    var pt1 = this.m_points[i + 1];
		    var p0x = pt.m_x;
		    var p0y = pt.m_value;
		    var p1x = pt.m_x + pt.m_tx1;
		    var p1y = pt.m_value + pt.m_ty1;
		    var p2x = pt1.m_x + pt1.m_tx0;
		    var p2y = pt1.m_value + pt1.m_ty0;
		    var p3x = pt1.m_x;
		    var p3y = pt1.m_value;

		    for (var j = 0; j < _iterations; ++j)
		    {
			    var t = j * iter;
			    var t2 = t * t;
			    var t3 = t2 * t;
			    var mt = 1 - t;
			    var mt2 = mt * mt;
			    var mt3 = mt2 * mt;
			    var vx = (p0x * mt3) + (3 * p1x * mt2 * t) + (3 * p2x * mt * t2) + (p3x * t3);
			    var vy = (p0y * mt3) + (3 * p1y * mt2 * t) + (3 * p2y * mt * t2) + (p3y * t3);
			    var pPoint = this.AllocNewCachedPoint();
			    pPoint.m_x = vx;
			    pPoint.m_value = vy;
		    }
	    }
	    //add the final end point
	    var pLast = this.m_points[numPoints - 1];
	    var pPoint = this.AllocNewCachedPoint();
	    pPoint.m_x = pLast.m_x;
	    pPoint.m_value = pLast.m_value;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Resets the cached points count
    ///          </summary>
    // #############################################################################################
    this.ScrubCachedPoints = function()
    {
        // The garbage collector will clean up unreferenced points
        this.numCachedPoints = 0;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Returns the cached points array and length
    ///          </summary>
    // #############################################################################################
    this.GetCachedPoints = function(_retObj)
    {
        if (this.NeedsRegen())
        {
            this.UpdateCachedPoints();
            this.changeIndex = GetCurrSeqObjChangeIndex();
        }

        _retObj.numPoints = this.numCachedPoints;
        _retObj.cachedPoints = this.cachedPoints;

        return _retObj;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Allocates the cached points array
    ///          </summary>
    // #############################################################################################
    this.AllocNewCachedPoint = function()
    {
        var newpoint = new yyAnimCurvePoint();

        if(this.cachedPoints == undefined)
        {
            this.cachedPoints = [];
        }
        
        this.cachedPoints[this.numCachedPoints] = newpoint;
        this.numCachedPoints = this.numCachedPoints + 1;

        return newpoint;
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Returns whether the poinst need regenerating
    ///          </summary>
    // #############################################################################################
    this.NeedsRegen = function()
    {
        if (this.numCachedPoints == 0)
        {
            return true;
        }
        else
        {
            if (this.globalChangeIndex < GetCurrSeqObjChangeIndex())		// a very blunt instrument - relies on the fact that changes to sequence-related classes should be rare
            {
                // Need to check points for dirtiness - not ideal if there's a large number
                // but there's nothing linking points to the curve (points may even be shared
                // amongst multiple curves technically) so we can't set anything on the 
                // curve at the same time as the points are changed
                var dirty = false;
                for (var i = 0; i < this.numPoints; i++)
                {
                    if ((this.m_points[i] != null) && (this.m_points[i].IsDirty(this.changeIndex)))
                    {
                        dirty = true;
                        break;
                    }
                }

                this.globalChangeIndex = GetCurrSeqObjChangeIndex();

                return dirty;
            }
            else
            {
                // This channel is up-to-date
                return false;
            }
        }
    };

    // #############################################################################################
    /// Function:<summary>
    ///             Checks whether the curgve is dirty and updates the cached points if so
    ///          </summary>
    // #############################################################################################
    this.UpdateDirtiness = function()
    {
        var dirty = false;	
        for (var i = 0; i < this.numPoints; i++)
        {
            if ((this.m_points[i] != null) && (this.m_points[i].IsDirty(this.changeIndex)))
            {
                dirty = true;
                break;
            }
        }

        if (dirty)
        {
            this.UpdateCachedPoints();
        }
    };
}


// #############################################################################################
/// Function:<summary>
///             Create a new AnimCurve object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAnimCurve(_pStorage) {

    CSequenceBaseClass.call(this); //base constructor
    
    this.__type = "[AnimCurve]";

    this.pName = "";
    this.m_graphType = 0;
    this.m_numChannels = 0;
    this.m_channels = [];    
    this.fromWAD = false;

    if ((_pStorage != null) && (_pStorage != undefined)) {
        this.pName = _pStorage.pName;
        this.m_graphType = _pStorage.graphType;
        this.m_numChannels = _pStorage.channels.length;
        this.m_channels = [];
        for (var channelIndex = 0; channelIndex < this.m_numChannels; ++channelIndex) {
            this.m_channels[channelIndex] = new yyAnimCurveChannel(_pStorage.channels[channelIndex]);
        }
        this.fromWAD = true;
    }

    this.SignalChange();

    Object.defineProperties(this, {
        gmlname: {
            enumerable : true,
            get: function () { return this.pName; },
            set: function (_val)
            {
                this.pName = yyGetString(_val);

                this.IsDirty(this.changeIndex); // check linked data to get things up to date
                this.changeIndex = GetNextSeqObjChangeIndex();
            }
        },        
        gmlnumChannels: {
            enumerable: true,
            get: function () { return this.m_numChannels; }
        },
        gmlgraphType: {
            enumerable: true,
            get: function () { return this.m_graphType; },
            set: function (_val) { this.m_graphType = yyGetInt32(_val); }
        },
        gmlchannels: {
            enumerable: true,
            get: function () { return this.m_channels; },
            set: function (_val)
            {
                if(_val instanceof Array)
                {
                    this.m_channels = _val;
                    this.m_numChannels = _val.length;

                    this.IsDirty(this.changeIndex); // check linked data to get things up to date
                    this.changeIndex = GetNextSeqObjChangeIndex();
                }
                else
                {
                    throw new Error("value must be an array of channels");
                }
            }
        }
    });

    this.UpdateDirtiness = function()
    {
        // Check to see whether this object's children are newer than itself			
        var currChangeIndex = this.changeIndex;
        for (var i = 0; i < this.m_numChannels; i++)
        {
            if ((this.m_channels[i] != null) && (this.m_channels[i].IsDirty(currChangeIndex)))
            {
                this.changeIndex = yymax(this.changeIndex, this.m_channels[i].changeIndex);							
            }
        }
    };

}






function CatmullRomTime(_t, _x1, _y1, _x2, _y2, _alpha) {
	var a = (_x2 - _x1) * (_x2 - _x1) + (_y2 - _y1) * (_y2 - _y1);
    if (a == 0.0) a = 0.0001;
    var b = Math.sqrt(a);
    var c = Math.pow(b, _alpha);
    return c + _t;
}

yyAnimCurve.prototype.Evaluate = function (_track, _curveChannel, _requestedChannel, _keyStart, _keyLength, _valScale)
{
    if (_valScale == undefined)
        _valScale = 1.0;

    var cchannel = this.m_channels[_curveChannel];

	var retObj = { numPoints:0, cachedPoints:[] };
    cchannel.GetCachedPoints(retObj);
    var numpoints = retObj.numPoints;
    var ppPoints = retObj.cachedPoints;

	for (var i = 0; i < numpoints; i++)
	{
		if (ppPoints[i] != null)
		{
			var pPoint = _track.AllocNewCachedPoint(_requestedChannel);
			pPoint.m_x = _keyStart + ppPoints[i].m_x * _keyLength;
			pPoint.m_value = ppPoints[i].m_value * _valScale;
		}
    }
};



// #############################################################################################
/// Function:<summary>
///             Create a new AnimCurve management object
///          </summary>
// #############################################################################################
/** @constructor */
function yyAnimCurveManager() {
    this.AnimCurves = [];
}

// #############################################################################################
/// Function:<summary>
///             Add a new AnimCurve into the pool
///          </summary>
///
/// In:		 <param name="_pStorage">AnimCurve Storage</param>
// #############################################################################################
yyAnimCurveManager.prototype.Add = function (_pStorage) {
    var pBack = null;
    if (_pStorage != null) {
        pBack = new yyAnimCurve(_pStorage);
    }
    this.AnimCurves[this.AnimCurves.length] = pBack;
};

// #############################################################################################
/// Function:<summary>
///             Add a new AnimCurve into the pool and return that AnimCurve
///          </summary>
// #############################################################################################
yyAnimCurveManager.prototype.GetNewCurve = function ()
{
    var pBack = new yyAnimCurve();
    var i;
    for (i = 0; i < this.AnimCurves.length; i++)
    {
        if (this.AnimCurves[i] == null)
        {
            this.AnimCurves[i] = pBack;
            return pBack;
        }
    }

    this.AnimCurves[this.AnimCurves.length] = pBack;
    return pBack;
};

yyAnimCurveManager.prototype.FreeCurve = function(_curve)
{
    if (typeof (_curve) == "object")
    //if (_val instanceof yyAnimCurve)
    {
        // Search for curve in array
        var i;
        for(i = 0; i < this.AnimCurves.length; i++)
        {
            if (this.AnimCurves[i] == _curve)
            {
                this.AnimCurves[i] = null;           // scrub from array
                return;
            }
        }
    }
    else
    {
        if ((_curve >= 0) && (_seq < this.AnimCurves.length))
        {
            this.AnimCurves[_curve] = null;
            return;
        }
    }
};

// #############################################################################################
/// Function:<summary>
///             Get the AnimCurve at the given index
///          </summary>
///
/// In:		 <param name="_ind">AnimCurve index</param>
// #############################################################################################
yyAnimCurveManager.prototype.Get = function (_ind) {
    if ((_ind < 0) || (_ind >= this.AnimCurves.length)) {
        return undefined;
    }
    return this.AnimCurves[_ind];
};

yyAnimCurveManager.prototype.GetCurveFromID = function (_ind) {
    if ((_ind < 0) || (_ind >= this.AnimCurves.length)) {
        return undefined;
    }
    return this.AnimCurves[_ind];
};

yyAnimCurveManager.prototype.IsLiveCurve = function (_curve)
{
    if ((typeof (_curve) == "object") && (_curve instanceof yyAnimCurve))
    {
        // Search for curve in array
        var i;
        for (i = 0; i < this.AnimCurves.length; i++)
        {
            if (this.AnimCurves[i] == _curve)
            {
                return true;
            }
        }
    }

    return false;
};


// #############################################################################################
/// Function:<summary>
///             Finds the AnimCurve with the given name
///          </summary>
///
/// In:		 <param name="_name">AnimCurve name</param>
// #############################################################################################
yyAnimCurveManager.prototype.Find = function (_name) {
    for (var i = 0; i < this.AnimCurves.length; i++) {
        if (this.AnimCurves[i].pName == _name) {
            return i;
        }
    }
    return -1;
};

// #############################################################################################
/// Function:<summary>
///             Retrieves an array of all animation curve asset IDs.
///          </summary>
///
/// Out:	 <returns>
///				An array of all animation curve asset IDs.
///			 </returns>
// #############################################################################################
yyAnimCurveManager.prototype.List = function () {
	var ids = [];
	for (var i = 0; i < this.AnimCurves.length; ++i)
	{
		if (this.AnimCurves[i])
		{
			ids.push(i);
		}
	}
	return ids;
};

//returns: true if animcurve with give id exists
function _animcurve_exists(_index)
{
    var pCurve = g_pAnimCurveManager.Get(_index);
    if( pCurve !== undefined && pCurve !== null )
        return true;
    return false;
}

//returns: name of animcurve with given index, or empty string
function animcurve_get_name( _index )
{
    var pCurve = g_pAnimCurveManager.Get(_index);
    if( pCurve !== undefined && pCurve !== null )
        return pCurve.pName;
    return "";
}
// @endif