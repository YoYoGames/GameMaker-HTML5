class LowPassFeedbackCombFilter
{
    constructor(_size)
    {
        this.damp1 = 0;
        this.damp2 = 0;
        this.feedback = 0;
        this.z1 = 0;

        this.buffer = new Float32Array(_size);
        this.readIndex = 0;
    }

    process(_sample)
    {
        // Read a sample from the buffer
        const out = this.buffer[this.readIndex];

        // Update the internal filter
        this.z1 = (this.z1 * this.damp1) + (out * this.damp2);

        // Write a sample (with feedback) to the buffer
        this.buffer[this.readIndex] = _sample + (this.z1 * this.feedback);

        // Increment the read frame
        ++this.readIndex;
        this.readIndex %= this.buffer.length;

        return out;
    }

    setFeedback(_feedback)
    {
        this.feedback = Math.min(Math.max(0, _feedback), 1);
    }

    setDamp(_damp)
    {
        this.damp1 = Math.min(Math.max(0, _damp), 1);
        this.damp2 = 1 - this.damp1;
    }
}

class AllPassFilter
{
    constructor(_size)
    {
        this.feedback = 0;

        this.buffer = new Float32Array(_size);
        this.readIndex = 0;
    }

    process(_sample)
    {
        // Read a sample from the buffer
        const out = this.buffer[this.readIndex];

        // Write a sample (with feedback) to the buffer
        this.buffer[this.readIndex] = _sample + (out * this.feedback);

        // Increment the read frame
        ++this.readIndex;
        this.readIndex %= this.buffer.length;

	    // Rearrangement of feedforward scalar of -1
	    return (out - _sample);
    }

    setFeedback(_feedback)
    {
        this.feedback = Math.min(Math.max(0, _feedback), 1);
    }
}

class Reverb1Processor extends AudioWorkletProcessor
{
    static NUM_LPFCFS = 8;
    static NUM_APFS = 4;

    static INPUT_GAIN = 0.015;
    static DAMP_SCALAR = 0.4;
    static ROOM_SCALAR = 0.28;
    static ROOM_OFFSET = 0.7;

    static LPFCF_EVEN = [
        1116,
        1188,
        1277,
        1356,
        1422,
        1491,
        1557,
        1617
    ];

    static LPFCF_ODD = [
        1139,
        1211,
        1300,
        1379,
        1445,
        1514,
        1580,
        1640
    ];

    static APF_EVEN = [
        556,
        441,
        341,
        225
    ];

    static APF_ODD = [
        579,
        464,
        364,
        248
    ]; 

    static get parameterDescriptors() 
    {
        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0,    minValue: 0,   maxValue: 1 },
            { name: "size",   automationRate: "a-rate", defaultValue: 0.7,  minValue: 0.0, maxValue: 1.0 },
            { name: "damp",   automationRate: "a-rate", defaultValue: 0.1,  minValue: 0.0, maxValue: 1.0 },
            { name: "mix",    automationRate: "a-rate", defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
        ];
    }

    constructor(_options)
    {
        super();
        this.makeMortal();

        const maxChannels = _options.outputChannelCount[0];

        this.prevSize = -1;
        this.prevDamp = -1;
        
        this.lpfcf = new Array(maxChannels);
        this.apf = new Array(maxChannels);

        const lpcf_tunings = [Reverb1Processor.LPFCF_EVEN, Reverb1Processor.LPFCF_ODD];
        const apf_tunings = [Reverb1Processor.APF_EVEN, Reverb1Processor.APF_ODD];

        for (let c = 0; c < maxChannels; ++c) {
            this.lpfcf[c] = new Array(Reverb1Processor.NUM_LPFCFS);
            this.apf[c] = new Array(Reverb1Processor.NUM_APFS);

            for (let i = 0; i < Reverb1Processor.NUM_LPFCFS; ++i)
                this.lpfcf[c][i] = new LowPassFeedbackCombFilter(lpcf_tunings[c % lpcf_tunings.length][i]);

            for (let i = 0; i < Reverb1Processor.NUM_APFS; ++i)
                this.apf[c][i] = new AllPassFilter(apf_tunings[c % apf_tunings.length][i]);
        }

        this.setSize(0.5);
        this.setDamp(0.5);
    
        for (let c = 0; c < maxChannels; ++c)
            for (let i = 0; i < Reverb1Processor.NUM_APFS; ++i)
                this.apf[c][i].setFeedback(0.5);
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const size = parameters.size;
        const damp = parameters.damp;
        const mix = parameters.mix;

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                const s = (size[s] !== undefined) ? size[s] : size[0];
                const d = (damp[s] !== undefined) ? damp[s] : damp[0];

                // Update model if needed
                this.setSize(s);
                this.setDamp(d);

                // Copy the input to the output
                outputChannel[s] = inputChannel[s];

                let out = 0;
                const val = inputChannel[s] * Reverb1Processor.INPUT_GAIN;
                
                // Process the combs in parallel
                for (let i = 0; i < Reverb1Processor.NUM_LPFCFS; ++i)
                    out += this.lpfcf[c][i].process(val);

                // Process the allpasses in series
                for (let i = 0; i < Reverb1Processor.NUM_APFS; ++i)
                    out = this.apf[c][i].process(out);

                // Check bypass state
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                if (b > 0.0) {
                    continue;
                }

                // Mix the reverberated and original samples
                const m = (mix[s] !== undefined) ? mix[s] : mix[0];

                outputChannel[s] *= (1 - m);
                outputChannel[s] += (out * m);
            }
        }

        return this.keepAlive;
    }

    setSize(_size)
    {
        if (_size === this.prevSize)
            return;

        const size = (_size * Reverb1Processor.ROOM_SCALAR) + Reverb1Processor.ROOM_OFFSET;

        for (let c = 0; c < this.lpfcf.length; ++c)
            for (let i = 0; i < Reverb1Processor.NUM_LPFCFS; ++i)
                this.lpfcf[c][i].setFeedback(size);

        this.prevSize = _size;
    }

    setDamp(_damp)
    {
        if (_damp === this.prevDamp)
            return;

        const damp = _damp * Reverb1Processor.DAMP_SCALAR;

        for (let c = 0; c < this.lpfcf.length; ++c)
            for (let i = 0; i < Reverb1Processor.NUM_LPFCFS; ++i)
                this.lpfcf[c][i].setDamp(damp);

        this.prevDamp = _damp;
    }
}

registerProcessor("reverb1-processor", Reverb1Processor);
