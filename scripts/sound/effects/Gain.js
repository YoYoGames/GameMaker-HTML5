// @if feature("audio_effects")
function GainEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Gain);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params[GainEffectStruct.Index.Gain];
            },
            set: (_gain) => {
                const val = this.setParam(GainEffectStruct.Index.Gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.value = val;
                });
            }
        }
    });
}

GainEffectStruct.Index = {
    Bypass: 0,
    Gain: 1
};

GainEffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true,  defaultValue: 0,   minValue: 0,   maxValue: 1 },
    { name: "gain",   integer: false, defaultValue: 0.5, minValue: 0.0, maxValue: Number.MAX_VALUE }
];
// @endif
