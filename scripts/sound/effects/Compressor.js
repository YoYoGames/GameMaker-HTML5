// @if feature("audio_effects")
function CompressorEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Compressor);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    Object.defineProperties(this, {
        gmlingain: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.InGain];
            },
            set: (_ingain) => {
                const val = this.setParam(CompressorEffectStruct.Index.InGain, _ingain);

                this.nodes.forEach((_node) => {
                    const ingain = _node.parameters.get("ingain");
                    ingain.value = val;
                });
            }
        },
        gmlthreshold: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.Threshold];
            },
            set: (_threshold) => {
                const val = this.setParam(CompressorEffectStruct.Index.Threshold, _threshold);

                this.nodes.forEach((_node) => {
                    const threshold = _node.parameters.get("threshold");
                    threshold.value = val;
                });
            }
        },
        gmlratio: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.Ratio];
            },
            set: (_ratio) => {
                const val = this.setParam(CompressorEffectStruct.Index.Ratio, _ratio);

                this.nodes.forEach((_node) => {
                    const ratio = _node.parameters.get("ratio");
                    ratio.value = val;
                });
            }
        },
        gmlattack: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.Attack];
            },
            set: (_attack) => {
                const val = this.setParam(CompressorEffectStruct.Index.Attack, _attack);

                this.nodes.forEach((_node) => {
                    const attack = _node.parameters.get("attack");
                    attack.value = val;
                });
            }
        },
        gmlrelease: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.Release];
            },
            set: (_release) => {
                const val = this.setParam(CompressorEffectStruct.Index.Release, _release);

                this.nodes.forEach((_node) => {
                    const release = _node.parameters.get("release");
                    release.value = val;
                });
            }
        },
        gmloutgain: {
            enumerable: true,
            get: () => {
                return this.params[CompressorEffectStruct.Index.OutGain];
            },
            set: (_outgain) => {
                const val = this.setParam(CompressorEffectStruct.Index.OutGain, _outgain);

                this.nodes.forEach((_node) => {
                    const outgain = _node.parameters.get("outgain");
                    outgain.value = val;
                });
            }
        }
    });
}

CompressorEffectStruct.Index = {
    Bypass: 0,
    InGain: 1,
    Threshold: 2,
    Ratio: 3,
    Attack: 4,
    Release: 5,
    OutGain: 6
};

CompressorEffectStruct.ParamDescriptors = [
    { name: "bypass",    integer: true,  defaultValue: 0,     minValue: 0,    maxValue: 1 },
    { name: "ingain",    integer: false, defaultValue: 1,     minValue: 1e-6, maxValue: Number.MAX_VALUE },
    { name: "threshold", integer: false, defaultValue: 0.125, minValue: 1e-3, maxValue: 1 },
    { name: "ratio",     integer: false, defaultValue: 4,     minValue: 1,    maxValue: Number.MAX_VALUE },
    { name: "attack",    integer: false, defaultValue: 0.05,  minValue: 1e-3, maxValue: 1e-1},
    { name: "release",   integer: false, defaultValue: 0.25,  minValue: 1e-2, maxValue: 1 },
    { name: "outgain",   integer: false, defaultValue: 1,     minValue: 1e-6, maxValue: Number.MAX_VALUE }
];
// @endif
