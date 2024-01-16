// @if feature("audio_effects")
function PeakEQEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.PeakEQ);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlfreq: {
            enumerable: true,
            get: () => {
                return this.params[PeakEQEffectStruct.Index.Freq];
            },
            set: (_freq) => {
                const val = this.setParam(PeakEQEffectStruct.Index.Freq, _freq);

                this.nodes.forEach((_node) => {
                    const freq = _node.parameters.get("freq");
                    freq.value = val;
                });
            }
        },
        gmlq: {
            enumerable: true,
            get: () => {
                return this.params[PeakEQEffectStruct.Index.Freq];
            },
            set: (_q) => {
                const val = this.setParam(PeakEQEffectStruct.Index.Q, _q);

                this.nodes.forEach((_node) => {
                    const q = _node.parameters.get("q");
                    q.value = val;
                });
            }
        },
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params[PeakEQEffectStruct.Index.Freq];
            },
            set: (_gain) => {
                const val = this.setParam(PeakEQEffectStruct.Index.Gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.value = val;
                });
            }
        }
    });
}

PeakEQEffectStruct.Index = {
    Bypass: 0,
    Freq: 1,
    Q: 2,
    Gain: 3
};

PeakEQEffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true,  defaultValue: 0,      minValue: 0,    maxValue: 1 },
    { name: "freq",   integer: false, defaultValue: 1500.0, minValue: 10.0, maxValue: 20000.0 },
    { name: "q",      integer: false, defaultValue: 1.0,    minValue: 1.0,  maxValue: 100.0 },
    { name: "gain",   integer: false, defaultValue: 1e-2,   minValue: 1e-6, maxValue: Number.MAX_VALUE }
];
// @endif
