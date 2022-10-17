class BitcrusherEffect extends AudioEffect
{
    constructor()
    {
        super("bitcrusher-processor");
    }
}

class BitcrusherEffectStruct extends AudioEffectStruct
{
    constructor()
    {
        super(AudioEffect.Type.Bitcrusher);

        this.params.gain = 1.0;
        this.params.factor = 1;
        this.params.resolution = 16;
        this.params.mix = 0.0;

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlgain: {
				enumerable: true,
				get: () => {
                    return this.params.gain;
                },
				set: (_gain) => {
                    this.params.gain = max(0.0, _gain);

                    this.nodes.forEach((_node) => {
                        const gain = _node.parameters.get("gain");
                        gain.setTargetAtTime(this.params.gain, 0, AudioEffect.PARAM_TIME_CONSTANT);
                    });
                }
			},
            gmlfactor: {
				enumerable: true,
				get: () => {
                    return this.params.factor;
                },
				set: (_factor) => {
                    this.params.factor = ~~clamp(_factor, 1, 100);

                    this.nodes.forEach((_node) => {
                        const factor = _node.parameters.get("factor");
                        factor.value = this.params.factor;
                    });
                }
			},
            gmlresolution: {
				enumerable: true,
				get: () => {
                    return this.params.resolution;
                },
				set: (_resolution) => {
                    this.params.resolution = ~~clamp(_resolution, 2, 16);

                    this.nodes.forEach((_node) => {
                        const resolution = _node.parameters.get("resolution");
                        resolution.value = this.params.resolution;
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
