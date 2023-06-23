class TremoloProcessor extends AudioWorkletProcessor
{
    static get parameterDescriptors() {
        return [
            { name: "bypass",    automationRate: "a-rate", defaultValue: 0,   minValue: 0,   maxValue: 1 },
            { name: "rate",      automationRate: "a-rate", defaultValue: 5.0, minValue: 0.0, maxValue: 20.0 },
            { name: "intensity", automationRate: "a-rate", defaultValue: 1.0, minValue: 0.0, maxValue: 1.0 },
            { name: "offset",    automationRate: "a-rate", defaultValue: 0.0, minValue: 0.0, maxValue: 1.0 },
            { name: "shape",     automationRate: "a-rate", defaultValue: 0,   minValue: 0,   maxValue: 4 }
        ];
    }

    constructor(_options) {
        super();
        this.makeMortal();

        const maxChannels = _options.outputChannelCount[0];

        this.prevRate = new Array(maxChannels).fill(1.0);
        this.prevOffset = new Array(maxChannels).fill(0.0);
        this.prevShape = new Array(maxChannels).fill(LFO.Shape.INV_SAWTOOTH);

        this.lfo = new Array(maxChannels);

        for (let c = 0; c < maxChannels; ++c) {
            this.lfo[c] = new WavetableLFO();

            this.lfo[c].setFs(sampleRate);
            this.lfo[c].setFreq(this.prevRate[c]);
            this.lfo[c].setShape(this.prevShape[c]);

            if (c % 2 === 1) {
                // Only set offset for odd channels
                this.lfo[c].setPhaseOffset(this.prevOffset[c]);
            }
        }
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const rate = parameters.rate;
        const intensity = parameters.intensity;
        const offset = parameters.offset;
        const shape = parameters.shape;

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                // Copy the input to the output
                outputChannel[s] = inputChannel[s];

                // Update LFO parameters
                const r = (rate[s] !== undefined) ? rate[s] : rate[0];
                const o = (offset[s] !== undefined) ? offset[s] : offset[0];
                const sh = (shape[s] !== undefined) ? shape[s] : shape[0];

                this.updateLFO(c, r, o, sh);

                // Read (and advance) the LFO
                const lfoOut = this.lfo[c].read();

                // Check bypass state
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                if (b > 0.0) {
                    continue;
                }

                // Scale a sample using the LFO output and intensity
                const i = (intensity[s] !== undefined) ? intensity[s] : intensity[0];

                const out = inputChannel[s] * lfoOut * i;

                // Mix the scaled sample with the original sample
                outputChannel[s] *= (1.0 - i);
                outputChannel[s] += out;
            }
        }

        return this.keepAlive;
    }

    updateLFO(_channel, _rate, _offset, _shape) {
        if (_rate !== this.prevRate[_channel]) {
            this.lfo[_channel].setFreq(_rate);
            this.prevRate[_channel] = _rate;
        }

        if (_offset !== this.prevOffset[_channel]) {
            // Only set offset for odd channels
            if (_channel % 2 === 1) {
                this.lfo[_channel].setPhaseOffset(_offset);
            }

            this.prevOffset[_channel] = _offset;
        }

        if (_shape !== this.prevShape[_channel]) {
            this.lfo[_channel].setShape(_shape);
            this.prevShape[_channel] = _shape;
        }
    }
}

registerProcessor("tremolo-processor", TremoloProcessor);
