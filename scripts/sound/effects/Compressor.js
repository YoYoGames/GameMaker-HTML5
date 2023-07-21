function CompressorEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Compressor);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, CompressorEffectStruct.paramDescriptors());

    Object.defineProperties(this, {
        gmlingain: {
            enumerable: true,
            get: () => {
                return this.params.ingain;
            },
            set: (_ingain) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().ingain, _ingain);

                this.nodes.forEach((_node) => {
                    const ingain = _node.parameters.get("ingain");
                    ingain.value = this.params.ingain;
                });
            }
        },
        gmlthreshold: {
            enumerable: true,
            get: () => {
                return this.params.threshold;
            },
            set: (_threshold) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().threshold, _threshold);

                this.nodes.forEach((_node) => {
                    const threshold = _node.parameters.get("threshold");
                    threshold.value = this.params.threshold;
                });
            }
        },
        gmlratio: {
            enumerable: true,
            get: () => {
                return this.params.ratio;
            },
            set: (_ratio) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().ratio, _ratio);

                this.nodes.forEach((_node) => {
                    const ratio = _node.parameters.get("ratio");
                    ratio.value = this.params.ratio;
                });
            }
        },
        gmlattack: {
            enumerable: true,
            get: () => {
                return this.params.attack;
            },
            set: (_attack) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().attack, _attack);

                this.nodes.forEach((_node) => {
                    const attack = _node.parameters.get("attack");
                    attack.value = this.params.attack;
                });
            }
        },
        gmlrelease: {
            enumerable: true,
            get: () => {
                return this.params.release;
            },
            set: (_release) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().release, _release);

                this.nodes.forEach((_node) => {
                    const release = _node.parameters.get("release");
                    release.value = this.params.release;
                });
            }
        },
        gmloutgain: {
            enumerable: true,
            get: () => {
                return this.params.outgain;
            },
            set: (_outgain) => {
                this.setParam(CompressorEffectStruct.paramDescriptors().outgain, _outgain);

                this.nodes.forEach((_node) => {
                    const outgain = _node.parameters.get("outgain");
                    outgain.value = this.params.outgain;
                });
            }
        }
    });
}

CompressorEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    ingain:    { name: "ingain",    integer: false, defaultValue: 1,     minValue: 1e-6, maxValue: Number.MAX_VALUE },
    threshold: { name: "threshold", integer: false, defaultValue: 0.125, minValue: 1e-3, maxValue: 1 },
    ratio:     { name: "ratio",     integer: false, defaultValue: 4,     minValue: 1,    maxValue: Number.MAX_VALUE },
    attack:    { name: "attack",    integer: false, defaultValue: 0.05,  minValue: 1e-3, maxValue: 1e-1},
    release:   { name: "release",   integer: false, defaultValue: 0.25,  minValue: 1e-2, maxValue: 1 },
    outgain:   { name: "outgain",   integer: false, defaultValue: 1,     minValue: 1e-6, maxValue: Number.MAX_VALUE }
});