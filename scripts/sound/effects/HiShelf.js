// @if feature("audio_effects")
function HiShelfEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.HiShelf);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlfreq: {
            enumerable: true,
            get: () => {
                return this.params[HiShelfEffectStruct.Index.Freq];
            },
            set: (_freq) => {
                const val = this.setParam(HiShelfEffectStruct.Index.Freq, _freq);

                this.nodes.forEach((_node) => {
                    const freq = _node.parameters.get("freq");
                    freq.value = val;
                });
            }
        },
        gmlq: {
            enumerable: true,
            get: () => {
                return this.params[HiShelfEffectStruct.Index.Q];
            },
            set: (_q) => {
                const val = this.setParam(HiShelfEffectStruct.Index.Q, _q);

                this.nodes.forEach((_node) => {
                    const q = _node.parameters.get("q");
                    q.value = val;
                });
            }
        },
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params[HiShelfEffectStruct.Index.Gain];
            },
            set: (_gain) => {
                const val = this.setParam(HiShelfEffectStruct.Index.Gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.value = val;
                });
            }
        }
    });
}

HiShelfEffectStruct.Index = {
    Bypass: 0,
    Freq: 1,
    Q: 2,
    Gain: 3
};

HiShelfEffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true,  defaultValue: 0,      minValue: 0,    maxValue: 1 },
    { name: "freq",   integer: false, defaultValue: 5000.0, minValue: 10.0, maxValue: 20000.0 },
    { name: "q",      integer: false, defaultValue: 1.0,    minValue: 1.0,  maxValue: 100.0 },
    { name: "gain",   integer: false, defaultValue: 1e-2,   minValue: 1e-6, maxValue: Number.MAX_VALUE } 
];
// @endif
