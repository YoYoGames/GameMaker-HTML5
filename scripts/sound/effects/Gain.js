function GainEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Gain);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, GainEffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlgain: {
            enumerable: true,
            get: () => {
                return this.params.gain;
            },
            set: (_gain) => {
                this.setParam(GainEffectStruct.paramDescriptors().gain, _gain);

                this.nodes.forEach((_node) => {
                    const gain = _node.parameters.get("gain");
                    gain.setTargetAtTime(this.params.gain, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

GainEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    gain:   { name: "gain", integer: false, defaultValue: 0.5, minValue: 0.0, maxValue: Number.MAX_VALUE }
});
