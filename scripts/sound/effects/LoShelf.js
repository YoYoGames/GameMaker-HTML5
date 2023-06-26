function LoShelfEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.LoShelf);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, LoShelfEffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlfreq: {
            enumerable: true,
            get: () => {
                return this.params.freq;
            },
            set: (_freq) => {
                this.setParam(LoShelfEffectStruct.paramDescriptors().freq, _freq);

                this.nodes.forEach((_node) => {
                    const freq = _node.parameters.get("freq");
                    freq.value = this.params.freq;
                });
            }
        },
        gmlq: {
            enumerable: true,
            get: () => {
                return this.params.q;
            },
            set: (_q) => {
                this.setParam(LoShelfEffectStruct.paramDescriptors().q, _q);

                this.nodes.forEach((_node) => {
                    const q = _node.parameters.get("q");
                    q.value = this.params.q;
                });
            }
        },
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params.gain;
            },
            set: (_gain) => {
                this.setParam(LoShelfEffectStruct.paramDescriptors().gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.value = this.params.gain;
                });
            }
        }
    });
}

LoShelfEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    __freq: { name: "freq",   integer: false, defaultValue: 500.0,  minValue: 10.0, maxValue: 20000.0 },
    q:      { name: "q",      integer: false, defaultValue: 1.0,    minValue: 1.0,  maxValue: 100.0 },
    gain:   { name: "gain",   integer: false, defaultValue: 1e-2,   minValue: 1e-6, maxValue: Number.MAX_VALUE },

    get freq() {
        this.__freq.maxValue = g_WebAudioContext ? Math.min(g_WebAudioContext.sampleRate / 2.0, this.__freq.maxValue) : this.__freq.maxValue;
        this.__freq.defaultValue = Math.min(this.__freq.defaultValue, this.__freq.maxValue);
        return this.__freq;
    } 
});
