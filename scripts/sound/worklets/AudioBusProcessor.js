class AudioBusInput extends AudioWorkletProcessor
{
    static get parameterDescriptors() 
    {
        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0, minValue: 0, maxValue: 1 }
        ];
    }

    process(inputs, outputs, parameters) 
    {
        // 1 input and 2 outputs
        // 1st output is written to when bypassed
        // 2nd output is written to when not bypassed

        for (let c = 0; c < inputs[0].length; ++c)
        {
            for (let s = 0; s < inputs[0][c].length; ++s)
            {
                if (parameters.bypass[s] == 1.0)
                    outputs[0][c][s] = inputs[0][c][s];
                else
                    outputs[1][c][s] = inputs[0][c][s];
            }
        }

        return true; // This should probably eventually be false
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

    process(inputs, outputs, parameters) 
    {
        // 2 inputs and 1 output
        // 1st input is from the bypass
        // 2nd input is from the effect chain

        // Copy the bypassed audio to the output
        outputs[0] = inputs[0];

        // Then mix in the affected audio with a gain scalar
        for (let c = 0; c < inputs[1].length; ++c)
            for (let s = 0; s < inputs[1][c].length; ++s)
                outputs[0][c][s] += inputs[0][c][s] * parameters.gain[s];

        return true; // This should probably eventually be false
    }
}

registerProcessor("audio-bus-input", AudioBusInput);
registerProcessor("audio-bus-output", AudioBusOutput);
