class AudioBusProcessor extends AudioWorkletProcessor
{
    static NUM_EFFECT_SLOTS = 8;

    static get parameterDescriptors() 
    {
        return [
            { name: "bypass", automationRate: "k-rate", defaultValue: 0, minValue: 0, maxValue: 1 },
            { name: "gain",   automationRate: "a-rate", defaultValue: 1, minValue: 0 }
        ];
    }

    constructor()
    {
        super();

		this.effects = Array(AudioBusProcessor.NUM_EFFECT_SLOTS).fill(undefined);
		Object.seal(this.effects); // Fixes the array's size (but elements are still mutable)
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0]; // 1 input and output per AudioBusProcessor

        if (parameters.bypass[0] == 0.0)
        {
            // Run the input through the effects chain
            this.effects.forEach(effect => {
                if (effect != undefined)
                    effect.process(input);
            });

            // Then apply the bus gain
            input.forEach(channel => {
                for (let s = 0; s < channel.length; ++s)
                    channel[s] *= parameters.gain[s];
            }); 
        }

        outputs[0] = input;

        return true; // This should probably eventually be false
    }
}

registerProcessor("audio-bus-processor", AudioBusProcessor);
