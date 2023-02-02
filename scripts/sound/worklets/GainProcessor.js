class GainProcessor extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0,   minValue: 0, maxValue: 1 },
            { name: "gain",   automationRate: "a-rate", defaultValue: 0.5, minValue: 0.0 }
        ];
    }

    constructor() 
    {
        super();
        this.makeMortal();
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const gain = parameters.gain;

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                // Copy the input to the output
                outputChannel[s] = inputChannel[s];

                // Check bypass state
                if (bypass[s] ?? bypass[0])
                    continue;

                // Apply gain
                outputChannel[s] *= (gain[s] ?? gain[0]);
            }
        }

        return this.keepAlive;
    }
}

registerProcessor("gain-processor", GainProcessor);
