// @if feature("audio_effects")
function BitcrusherEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Bitcrusher);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params[BitcrusherEffectStruct.Index.Gain];
            },
            set: (_gain) => {
                const val = this.setParam(BitcrusherEffectStruct.Index.Gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmlfactor: {
            enumerable: true,
            get: () => {
                return this.params[BitcrusherEffectStruct.Index.Factor];
            },
            set: (_factor) => {
                const val = this.setParam(BitcrusherEffectStruct.Index.Factor, _factor);

                this.nodes.forEach((_node) => {
                    const factor = _node.parameters.get("factor");
                    factor.value = val;
                });
            }
        },
        gmlresolution: {
            enumerable: true,
            get: () => {
                return this.params[BitcrusherEffectStruct.Index.Resolution];
            },
            set: (_resolution) => {
                const val = this.setParam(BitcrusherEffectStruct.Index.Resolution, _resolution);

                this.nodes.forEach((_node) => {
                    const resolution = _node.parameters.get("resolution");
                    resolution.value = val;
                });
            }
        },
        gmlmix: {
            enumerable: true,
            get: () => {
                return this.params[BitcrusherEffectStruct.Index.Mix];
            },
            set: (_mix) => {
                const val = this.setParam(BitcrusherEffectStruct.Index.Mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

BitcrusherEffectStruct.Index = {
    Bypass: 0,
    Gain: 1,
    Factor: 2,
    Resolution: 3,
    Mix: 4
};

BitcrusherEffectStruct.ParamDescriptors = [
    { name: "bypass",     integer: true,  defaultValue: 0,   minValue: 0,   maxValue: 1 },
    { name: "gain",       integer: false, defaultValue: 1.0, minValue: 0.0, maxValue: Number.MAX_VALUE },
    { name: "factor",     integer: true,  defaultValue: 20,  minValue: 1,   maxValue: 100 },
    { name: "resolution", integer: true,  defaultValue: 8,   minValue: 2,   maxValue: 16  },
    { name: "mix",        integer: false, defaultValue: 0.8, minValue: 0.0, maxValue: 1.0 }
];
// @endif
