// @if feature("audio_effects")
function Reverb1EffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Reverb1);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlsize: {
            enumerable: true,
            get: () => {
                return this.params[Reverb1EffectStruct.Index.Size];
            },
            set: (_size) => {
                const val = this.setParam(Reverb1EffectStruct.Index.Size, _size);

                this.nodes.forEach((_node) => {
                    const size = _node.parameters.get("size");
                    size.value = val;
                });
            }
        },
        gmldamp: {
            enumerable: true,
            get: () => {
                return this.params[Reverb1EffectStruct.Index.Damp];
            },
            set: (_damp) => {
                const val = this.setParam(Reverb1EffectStruct.Index.Damp, _damp);

                this.nodes.forEach((_node) => {
                    const damp = _node.parameters.get("damp");
                    damp.value = val;
                });
            }
        },
        gmlmix: {
            enumerable: true,
            get: () => {
                return this.params[Reverb1EffectStruct.Index.Mix];
            },
            set: (_mix) => {
                const val = this.setParam(Reverb1EffectStruct.Index.Mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

Reverb1EffectStruct.Index = {
    Bypass: 0,
    Size: 1,
    Damp: 2,
    Mix: 3
};

Reverb1EffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true,  defaultValue: 0,    minValue: 0,   maxValue: 1 },
    { name: "size",   integer: false, defaultValue: 0.7,  minValue: 0.0, maxValue: 1.0 },
    { name: "damp",   integer: false, defaultValue: 0.1,  minValue: 0.0, maxValue: 1.0 },
    { name: "mix",    integer: false, defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
];
// @endif
