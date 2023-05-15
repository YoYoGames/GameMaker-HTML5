class EQInput extends AudioWorkletProcessor
{
    static get parameterDescriptors() {
        return [];
    }

    constructor() {
        super();
        this.makeMortal();
    }

    process(_inputs, _outputs, _parameters) {
        const input = _inputs[0];
        const output0 = _outputs[0];
        const output1 = _outputs[1];

        for (let c = 0; c < input.length; ++c) {
            const inputChannel = input[c];
            const output0Channel = output0[c];
            const output1Channel = output1[c];

            for (let s = 0; s < inputChannel.length; ++s) {
                output0Channel[s] = inputChannel[s];
                output1Channel[s] = inputChannel[s];
            }
        }

        return this.keepAlive;
    }
}

class EQOutput extends AudioWorkletProcessor
{
    static get parameterDescriptors() {
        return [
            { name: "bypass", automationRate: "a-rate", defaultValue: 0, minValue: 0, maxValue: 1 }
        ];
    }

    constructor() {
        super();
        this.makeMortal();
    }

    process(_inputs, _outputs, _parameters) {
        const input0 = _inputs[0];
        const input1 = _inputs[1];
        const output = _outputs[0];

        const bypass = _parameters.bypass;

        for (let c = 0; c < input1.length; ++c) {
            const input0Channel = input0[c];
            const input1Channel = input1[c];
            const outputChannel = output[c];

            for (let s = 0; s < input0Channel.length; ++s) {
                const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

                if (b > 0) {
                    outputChannel[s] = input1Channel[s];
                }
                else {
                    outputChannel[s] = input0Channel[s];
                }
            }
        }

        return this.keepAlive;
    }
}

registerProcessor("eq-input", EQInput);
registerProcessor("eq-output", EQOutput);
