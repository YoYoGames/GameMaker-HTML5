// @if feature("audio_effects")
function LPF2EffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.LPF2);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlcutoff: {
            enumerable: true,
            get: () => {
                return this.params[LPF2EffectStruct.Index.Cutoff];
            },
            set: (_cutoff) => {
                const val = this.setParam(LPF2EffectStruct.Index.Cutoff, _cutoff);

                this.nodes.forEach((_node) => {
                    const cutoff = _node.parameters.get("cutoff");
                    cutoff.value = val;
                });
            }
        },
        gmlq: {
            enumerable: true,
            get: () => {
                return this.params[LPF2EffectStruct.Index.Q];
            },
            set: (_q) => {
                const val = this.setParam(LPF2EffectStruct.Index.Q, _q);

                this.nodes.forEach((_node) => {
                    const q = _node.parameters.get("q");
                    q.value = val;
                });
            }
        }
    });
}

LPF2EffectStruct.Index = {
    Bypass: 0,
    Cutoff: 1,
    Q: 2
};

LPF2EffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true,  defaultValue: 0,      minValue: 0,    maxValue: 1 },
    { name: "cutoff", integer: false, defaultValue: 500.0, minValue: 10.0, maxValue: 20000.0 },
    { name: "q",      integer: false, defaultValue: 1.5,   minValue: 1.0,  maxValue: 100.0 } 
];
// @endif
