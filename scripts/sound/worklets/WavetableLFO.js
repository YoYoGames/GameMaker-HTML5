function LFO() {}

LFO.Shape = {
	INV_SAWTOOTH: 0,
	SAWTOOTH: 1,
    SINE: 2,
    SQUARE: 3,
    TRIANGLE: 4,
    NUM_SHAPES: 5
};

/*
	LFO Wavetable Generators ~
	These functions generate a 1Hz waveform from a normalised phase parameter (range 0 to 1).
	The generated waveforms also range from 0 to 1.
	The wavetables produced by these functions should only be used for LFOs,
	as reading them at higher frequencies will begin to cause aliasing.
*/
LFO.generateInvSawtooth = function(_phase) {
    return 1.0 - _phase;
};

LFO.generateSawtooth = function(_phase) {
    return _phase;
};

LFO.generateSine = function(_phase) {
	// Offset by (-pi/2) in order to start from 0
    return 0.5 * (Math.sin((_phase * 2.0 * Math.PI) - (Math.PI / 2.0)) + 1.0);
};

LFO.generateSquare = function(_phase) {
    if (_phase < 0.5) {
        return 0.0;
    }

    return 1.0;
};

LFO.generateTriangle = function(_phase) {
    if (_phase < 0.5) {
        return 2.0 * _phase;
    }

    return 2.0 - (2.0 * _phase);
};

LFO.wavetableFns = [
	LFO.generateInvSawtooth,
    LFO.generateSawtooth,
    LFO.generateSine,
    LFO.generateSquare,
    LFO.generateTriangle
];

Wavetable.len = 512;
Wavetable.phaseInc = 1.0 / Wavetable.len;

function Wavetable(_fn) {
    this.data = new Float32Array(Wavetable.len);

	for (let i = 0; i < Wavetable.len; ++i) {
		this.data[i] = _fn(i * Wavetable.phaseInc);
	}
}

Wavetable.prototype.read = function(_phase) {
	_phase = Math.max(0.0, _phase);
	_phase = Math.min(_phase, 1.0);
	
	const targetIndex = _phase * Wavetable.len;

	const targetIndexInt = ~~targetIndex;
	const targetIndexFrac = targetIndex - targetIndexInt;

	let index1 = targetIndexInt;
	let index2 = index1 + 1;

	if (index1 >= Wavetable.len) {
		index1 -= Wavetable.len;
	}

	if (index2 >= Wavetable.len) {
		index2 -= Wavetable.len;
	}

	const samp1 = this.data[index1];
	const samp2 = this.data[index2];

	return samp1 + (samp2 - samp1) * targetIndexFrac;
};

WavetableLFO.wavetables = [];
WavetableLFO.initialisedWavetables = false;

WavetableLFO.minFreq = 0.0;
WavetableLFO.maxFreq = 20.0;

function WavetableLFO() {
    this.fs = 48000;
	this.shape = LFO.Shape.SINE;
	this.freq = 1.0;
	this.phase = 0.0;
	this.phaseInc = 0.0;
	this.phaseOffset = 0.0;

	if (WavetableLFO.initialisedWavetables == true) {
		return;
	}

	for (let i = 0; i < LFO.Shape.NUM_SHAPES; ++i) {
		WavetableLFO.wavetables[i] = new Wavetable(LFO.wavetableFns[i]);
	}

	WavetableLFO.initialisedWavetables = true;
}

WavetableLFO.isInitialised = function() {
	return (WavetableLFO.initialisedWavetables == true);
};

WavetableLFO.prototype.setFs = function(_fs) {
	this.fs = _fs;
	this.updatePhaseInc();
};

WavetableLFO.prototype.setFreq = function(_freq) {
	_freq = Math.max(WavetableLFO.minFreq, _freq);
	_freq = Math.min(_freq, WavetableLFO.maxFreq);

	this.freq = _freq;
	this.updatePhaseInc();
};

WavetableLFO.prototype.setPhaseOffset = function(_offset) {
	_offset = Math.max(0.0, _offset);
	_offset = Math.min(_offset, 1.0);

	const diff = _offset - this.phaseOffset;

	this.phaseOffset = _offset;
	this.phase += diff;

	while (this.phase >= 1.0) {
		this.phase -= 1.0;
	}

	while (this.phase < 0.0) {
		this.phase += 1.0;
	}
};

WavetableLFO.prototype.setShape = function(_shape) {
	_shape = Math.max(0, _shape);
	_shape = Math.min(_shape, LFO.Shape.NUM_SHAPES - 1);

	this.shape = _shape;
};

WavetableLFO.prototype.read = function() {
	const result = WavetableLFO.wavetables[this.shape].read(this.phase);

	this.phase += this.phaseInc;

	while (this.phase >= 1.0) {
		this.phase -= 1.0;
	}

	return result;
};

WavetableLFO.prototype.updatePhaseInc = function() {
	this.phaseInc = this.freq / this.fs;
};
