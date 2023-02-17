function BitcrusherEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Bitcrusher);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, BitcrusherEffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params.gain;
            },
            set: (_gain) => {
                this.setParam(BitcrusherEffectStruct.paramDescriptors().gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.setTargetAtTime(this.params.gain, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmlfactor: {
            enumerable: true,
            get: () => {
                return this.params.factor;
            },
            set: (_factor) => {
                this.setParam(BitcrusherEffectStruct.paramDescriptors().factor, _factor);

                this.nodes.forEach((_node) => {
                    const factor = _node.parameters.get("factor");
                    factor.value = this.params.factor;
                });
            }
        },
        gmlresolution: {
            enumerable: true,
            get: () => {
                return this.params.resolution;
            },
            set: (_resolution) => {
                this.setParam(BitcrusherEffectStruct.paramDescriptors().resolution, _resolution);

                this.nodes.forEach((_node) => {
                    const resolution = _node.parameters.get("resolution");
                    resolution.value = this.params.resolution;
                });
            }
        },
        gmlmix: {
            enumerable: true,
            get: () => {
                return this.params.mix;
            },
            set: (_mix) => {
                this.setParam(BitcrusherEffectStruct.paramDescriptors().mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(this.params.mix, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

BitcrusherEffectStruct.paramDescriptors = () => ({
    bypass:     AudioEffectStruct.paramDescriptors().bypass,
    gain:       { name: "gain",       integer: false, defaultValue: 1.0, minValue: 0.0, maxValue: Number.MAX_VALUE },
    factor:     { name: "factor",     integer: true,  defaultValue: 20,  minValue: 1,   maxValue: 100 },
    resolution: { name: "resolution", integer: true,  defaultValue: 8,   minValue: 2,   maxValue: 16  },
    mix:        { name: "mix",        integer: false, defaultValue: 0.8, minValue: 0.0, maxValue: 1.0 }
});
