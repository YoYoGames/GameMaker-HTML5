class Reverb1EffectStruct extends AudioEffectStruct
{
    constructor()
    {
        super(AudioEffect.Type.Reverb1);

        this.params.size = 0.5;
        this.params.damp = 0.5;
        this.params.mix = 0.0;

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlsize: {
				enumerable: true,
				get: () => {
                    return this.params.size;
                },
				set: (_size) => {
                    this.params.size = clamp(_size, 0.0, 1.0);

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
                    this.params.damp = clamp(_damp, 0.0, 1.0);

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
                    this.params.mix = clamp(_mix, 0.0, 1.0);

                    this.nodes.forEach((_node) => {
                        const mix = _node.parameters.get("mix");
                        mix.setTargetAtTime(this.params.mix, 0, AudioEffect.PARAM_TIME_CONSTANT);
                    });
                }
			}
		});
    }
}
