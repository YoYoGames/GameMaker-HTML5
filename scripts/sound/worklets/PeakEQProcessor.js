class PeakEQProcessor extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        const maxFreq = Math.min(sampleRate / 2.0, 20000.0);

        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0,                         minValue: 0,    maxValue: 1 },
            { name: "freq",   automationRate: "a-rate", defaultValue: Math.min(1500.0, maxFreq), minValue: 10.0, maxValue: maxFreq },
            { name: "q",      automationRate: "a-rate", defaultValue: 1.0,                       minValue: 1.0,  maxValue: 100.0 },
            { name: "gain",   automationRate: "a-rate", defaultValue: 1e-2,                      minValue: 1e-6 }
        ];
    }

    constructor(_options)
    {
        super();
        this.makeMortal();

        const maxChannels = _options.outputChannelCount[0];

        this.a1 = 0;
        this.a2 = 0;
        this.b0 = 0;
        this.b1 = 0;
        this.b2 = 0;

        this.x1 = new Float32Array(maxChannels);
        this.x2 = new Float32Array(maxChannels);
        this.y1 = new Float32Array(maxChannels);
        this.y2 = new Float32Array(maxChannels);

        this.prevFreq = -1;
        this.prevQ = -1;
        this.prevGain = -1;
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const freq = parameters.freq;
        const q = parameters.q;
        const gain = parameters.gain;

        const paramsAreConstant = (freq.length === 1 && q.length === 1 && gain.length === 1);

        if (paramsAreConstant)
            this.calcCoefficients(freq[0], q[0], gain[0]);

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                // Recalc coefficients if needed
                if (paramsAreConstant === false) {
                    const f = (freq[s] !== undefined) ? freq[s] : freq[0];
                    const qs = (q[s] !== undefined) ? q[s] : q[0];
                    const g = (gain[s] !== undefined) ? gain[s] : gain[0];

                    this.calcCoefficients(f, qs, g);
                }

                // Calculate the new sample
                const y0 = this.b0 * inputChannel[s]
                         + this.b1 * this.x1[c]
                         + this.b2 * this.x2[c]
                         - this.a1 * this.y1[c]
                         - this.a2 * this.y2[c];

                // Shift the original samples
                this.x2[c] = this.x1[c];
                this.x1[c] = inputChannel[s];
    
                // Shift the filtered samples
                this.y2[c] = this.y1[c];
                this.y1[c] = y0;

                // Write the original/filtered sample to the output
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                outputChannel[s] = (b > 0) ? inputChannel[s] : y0;
            }
        }

        return this.keepAlive;
    }

    calcCoefficients(_freq, _q, _gain)
    {
        if (_freq === this.prevFreq && _q === this.prevQ && _gain === this.prevGain)
            return;

        const w0 = 2 * Math.PI * _freq / sampleRate;

        const cos_w0 = Math.cos(w0);
        const A = Math.sqrt(_gain);

        const alpha = Math.sin(w0) / (2 * _q);
        const alpha_a = alpha / A;
        const alpha_b = alpha * A;
    
        const a0 = 1 + alpha_a;
        const a1 = -2 * cos_w0;
        const a2 = 1 - alpha_a;
    
        const b0 = 1 + alpha_b;
        const b1 = a1;
        const b2 = 1 - alpha_b;
    
        this.a1 = a1 / a0;
        this.a2 = a2 / a0;
        this.b0 = b0 / a0;
        this.b1 = b1 / a0;
        this.b2 = b2 / a0;

        this.prevFreq = _freq;
        this.prevQ = _q;
        this.prevGain = _gain;
    }
}

registerProcessor("peak-eq-processor", PeakEQProcessor);
