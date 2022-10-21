class GainEffectStruct extends AudioEffectStruct
{
    constructor()
    {
        super(AudioEffect.Type.Gain);

        this.params.gain = 1.0;

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
			}
		});
    }
}
