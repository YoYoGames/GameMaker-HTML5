class DelayProcessor extends AudioWorkletProcessor
{
    static MAX_DELAY_TIME = 5.0; // seconds

    static get parameterDescriptors() 
    {
        return [
            { name: "bypass",   automationRate: "a-rate", defaultValue: 0,    minValue: 0,   maxValue: 1 },
            { name: "time",     automationRate: "a-rate", defaultValue: 0.2,  minValue: 0.0, maxValue: DelayProcessor.MAX_DELAY_TIME },
            { name: "feedback", automationRate: "a-rate", defaultValue: 0.5,  minValue: 0.0, maxValue: 1.0 },
            { name: "mix",      automationRate: "a-rate", defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
        ];
    }

    constructor(_options)
    {
        super();
        this.makeMortal();

        const maxChannels = _options.outputChannelCount[0];

        const delayLineLength = (DelayProcessor.MAX_DELAY_TIME * sampleRate) + 1;

        this.buffer = new Array(maxChannels);
        this.writeIndex = new Uint32Array(maxChannels);

        for (let c = 0; c < maxChannels; ++c)
            this.buffer[c] = new Float32Array(delayLineLength);
    }

    process(inputs, outputs, parameters) 
    {
        const input = inputs[0];
        const output = outputs[0];

        const bypass = parameters.bypass;
        const time = parameters.time;
        const feedback = parameters.feedback;
        const mix = parameters.mix;

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const outputChannel = output[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                // Copy the input to the output
                outputChannel[s] = inputChannel[s];

                // Read a sample from the delay line
                const t = (time[s] !== undefined) ? time[s] : time[0];

                const delayOut = this.read(c, t);

                // Write a sample (with feedback) to the delay line
                const f = (feedback[s] !== undefined) ? feedback[s] : feedback[0];

                const delayIn = inputChannel[s] + (delayOut * f);
                this.write(c, delayIn);

                // Check bypass state
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                if (b > 0.0) {
                    continue;
                }

                // Mix the delayed and original samples
                const m = (mix[s] !== undefined) ? mix[s] : mix[0];
                
                outputChannel[s] *= (1 - m);
                outputChannel[s] += (delayOut * m);
            }
        }

        return this.keepAlive;
    }

    read(_channel, _time)
    {
        const delayInFrames = _time * sampleRate;

        let index1 = (this.writeIndex[_channel] - ~~delayInFrames);
        let index2 = (index1 - 1);
    
        while (index1 < 0)
            index1 += this.buffer[_channel].length;
    
        while (index2 < 0)
            index2 += this.buffer[_channel].length;
    
        const frac = delayInFrames - ~~delayInFrames;
    
        const samp1 = this.buffer[_channel][index1];
        const samp2 = this.buffer[_channel][index2];
    
        return samp1 + (samp2 - samp1) * frac;
    }

    write(_channel, _sample)
    {
        ++this.writeIndex[_channel];
        this.writeIndex[_channel] %= this.buffer[_channel].length;
        
        this.buffer[_channel][this.writeIndex[_channel]] = _sample;
    }
}

registerProcessor("delay-processor", DelayProcessor);
