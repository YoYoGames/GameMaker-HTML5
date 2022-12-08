function LPF2EffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.LPF2);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, LPF2EffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlcutoff: {
            enumerable: true,
            get: () => {
                return this.params.cutoff;
            },
            set: (_cutoff) => {
                this.setParam(LPF2EffectStruct.paramDescriptors().cutoff, _cutoff);

                this.nodes.forEach((_node) => {
                    const cutoff = _node.parameters.get("cutoff");
                    cutoff.value = this.params.cutoff;
                });
            }
        },
        gmlq: {
            enumerable: true,
            get: () => {
                return this.params.q;
            },
            set: (_q) => {
                this.setParam(LPF2EffectStruct.paramDescriptors().q, _q);

                this.nodes.forEach((_node) => {
                    const q = _node.parameters.get("q");
                    q.value = this.params.q;
                });
            }
        }
    });
}

LPF2EffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    freq:   { name: "cutoff", integer: false, defaultValue: 20000, minValue: 10, maxValue: 20000 },
    q:      { name: "q",      integer: false, defaultValue: 1,     minValue: 1,  maxValue: 100 },

    get cutoff() {
        this.freq.maxValue = g_WebAudioContext ? Math.min(g_WebAudioContext.sampleRate / 2, this.freq.maxValue) : this.freq.maxValue;
        this.freq.defaultValue = this.freq.maxValue;
        return this.freq;
    } 
});
