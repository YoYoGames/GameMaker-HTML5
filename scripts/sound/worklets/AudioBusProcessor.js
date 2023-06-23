AudioWorkletProcessor.prototype.makeMortal = function() {
    this.keepAlive = true;
    this.port.onmessage = (_msg) => {
        if (_msg.data === "kill")
            this.keepAlive = false;
    };
};

class AudioBusInput extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0, minValue: 0, maxValue: 1 }
        ];
    }

    constructor()
    {
        super();
        this.makeMortal();
    }

    process(inputs, outputs, parameters) 
    {
        // 1 input and 2 outputs
        // 1st output is written to when not bypassed
        // 2nd output is written to when bypassed
        const input = inputs[0];
        const bypass = parameters.bypass;

        for (let c = 0; c < input.length; ++c)
        {
            const inputChannel = input[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                outputs[b][c][s] = inputChannel[s];
            }
        }

        return this.keepAlive;
    }
}

class AudioBusOutput extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        return [
            { name: "gain", automationRate: "a-rate", defaultValue: 1, minValue: 0 }
        ];
    }

    constructor()
    {
        super();
        this.makeMortal();
    }

    process(inputs, outputs, parameters) 
    {
        // 2 inputs and 1 output
        // 1st input is from the effect chain
        // 2nd input is from the bypass
        const input0 = inputs[0];
        const input1 = inputs[1];
        const output = outputs[0];

        const gain = parameters.gain;

        // Copy the bypassed audio to the output
        for (let c = 0; c < input1.length; ++c)
        {
            const inputChannel = input1[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s)
                outputChannel[s] = inputChannel[s];
        }

        // Then mix in the affected audio with a gain scalar
        for (let c = 0; c < input0.length; ++c)
        {
            const inputChannel = input0[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                const g = (gain[s] !== undefined) ? gain[s] : gain[0];

                outputChannel[s] += inputChannel[s] * g;
            }
        }

        return this.keepAlive;
    }
}

registerProcessor("audio-bus-input", AudioBusInput);
registerProcessor("audio-bus-output", AudioBusOutput);
