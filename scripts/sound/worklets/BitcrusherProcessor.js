class BitcrusherProcessor extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        return [
            { name: "bypass",     automationRate: "a-rate", defaultValue: 0,   minValue: 0,   maxValue: 1 },
            { name: "gain",       automationRate: "a-rate", defaultValue: 1.0, minValue: 0.0 },
            { name: "factor",     automationRate: "a-rate", defaultValue: 20,  minValue: 1,   maxValue: 100 },
            { name: "resolution", automationRate: "a-rate", defaultValue: 8,   minValue: 2,   maxValue: 16  },
            { name: "mix",        automationRate: "a-rate", defaultValue: 0.8, minValue: 0.0, maxValue: 1.0 }
        ];
    }

    static scalars = [
        undefined,
        undefined,
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        256,
        512,
        1024,
        2048,
        4096,
        8192,
        16384,
        32768
    ];

    constructor(_options)
    {
        super();
        this.makeMortal();

        const maxChannels = _options.outputChannelCount[0];

        this.sample = new Float32Array(maxChannels);
        this.hold = new Uint32Array(maxChannels);
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const gain = parameters.gain;
        const factor = parameters.factor;
        const resolution = parameters.resolution;
        const mix = parameters.mix;

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                // Copy the input to the output
                outputChannel[s] = inputChannel[s];

                // Update held sample
                if (this.hold[c] === 0)
                    this.sample[c] = inputChannel[s];

                // Update hold counter
                const f = (factor[s] !== undefined) ? factor[s] : factor[0];

                ++this.hold[c];
                this.hold[c] %= f;

                // Check bypass state
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                if (b > 0.0) {
                    continue;
                }

                // Get the held sample
                let val = this.sample[c];

                // Apply gain and hard clip
                const g = (gain[s] !== undefined) ? gain[s] : gain[0];

                val *= g;
                val = Math.max(Math.min(val, 1.0), -1.0);

                // Resolution reduction
                const r = (resolution[s] !== undefined) ? resolution[s] : resolution[0];
                const max = (val > 0.0) ? BitcrusherProcessor.scalars[r] - 1 : BitcrusherProcessor.scalars[r];

                val = Math.round(val * max) / max;

                // Mix the distorted and original samples
                const m = (mix[s] !== undefined) ? mix[s] : mix[0];

                outputChannel[s] *= (1.0 - m);
                outputChannel[s] += (val * m);
            }
        }

        return this.keepAlive;
    }
}

registerProcessor("bitcrusher-processor", BitcrusherProcessor);
