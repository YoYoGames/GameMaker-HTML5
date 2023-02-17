function Reverb1EffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Reverb1);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, Reverb1EffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlsize: {
            enumerable: true,
            get: () => {
                return this.params.size;
            },
            set: (_size) => {
                this.setParam(Reverb1EffectStruct.paramDescriptors().size, _size);

                this.nodes.forEach((_node) => {
                    const size = _node.parameters.get("size");
                    size.value = this.params.size;
                });
            }
        },
        gmldamp: {
            enumerable: true,
            get: () => {
                return this.params.damp;
            },
            set: (_damp) => {
                this.setParam(Reverb1EffectStruct.paramDescriptors().damp, _damp);

                this.nodes.forEach((_node) => {
                    const damp = _node.parameters.get("damp");
                    damp.value = this.params.damp;
                });
            }
        },
        gmlmix: {
            enumerable: true,
            get: () => {
                return this.params.mix;
            },
            set: (_mix) => {
                this.setParam(Reverb1EffectStruct.paramDescriptors().mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(this.params.mix, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

Reverb1EffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    size:   { name: "size", integer: false, defaultValue: 0.7,  minValue: 0.0, maxValue: 1.0 },
    damp:   { name: "damp", integer: false, defaultValue: 0.1,  minValue: 0.0, maxValue: 1.0 },
    mix:    { name: "mix",  integer: false, defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
});
