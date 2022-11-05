function TimeRampedParamLinear(_initialVal) {
    this.__val = _initialVal;
    this.__origin = _initialVal;
    this.__target = _initialVal;
    this.__diff = 0;
    this.__rampStart = 0;
    this.__rampEnd = 0;
    this.__rampScalar = 0;
}

TimeRampedParamLinear.prototype.get = function() {
    return this.__val;
};

TimeRampedParamLinear.prototype.set = function(_target, _timeMs = 0) {
    _timeMs = Math.max(0, _timeMs);

    if (_timeMs == 0) {
        this.__val = _target;
        this.__target = _target;
        this.__rampEnd = performance.now();
    }
    else {
        this.__origin = this.__val;
        this.__target = _target;
        this.__diff = this.__target - this.__origin;
        
        this.__rampStart = performance.now();
        this.__rampEnd = this.__rampStart + _timeMs;
        this.__rampScalar = 1 / (this.__rampEnd - this.__rampStart);
    }
};

TimeRampedParamLinear.prototype.update = function() {
    const currentTime = performance.now();

    if (currentTime >= this.__rampEnd) {
        this.__val = this.__target;
    }
    else {
        let frac = (currentTime - this.__rampStart) * this.__rampScalar;
        frac = Math.max(0, Math.min(frac, 1));

        this.__val = this.__origin + (this.__diff * frac);
    }

    return this.__val;
};
