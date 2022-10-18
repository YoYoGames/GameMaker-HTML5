class DelayEffect extends AudioEffect
{
    constructor(_params)
    {
        super("delay-processor", _params);
    }
}

class DelayEffectStruct extends AudioEffectStruct
{
    constructor()
    {
        super(AudioEffect.Type.Delay);

        this.params.time = 0.0;
        this.params.feedback = 0.0;
        this.params.mix = 0.0;

        // Define user-facing properties
		Object.defineProperties(this, {
			gmltime: {
				enumerable: true,
				get: () => {
                    return this.params.time;
                },
				set: (_time) => {
                    this.params.time = clamp(_time, 0.0, 5.0);

                    this.nodes.forEach((_node) => {
                        const time = _node.parameters.get("time");
                        time.setTargetAtTime(this.params.time, 0, AudioEffect.PARAM_TIME_CONSTANT);
                    });
                }
			},
            gmlfeedback: {
				enumerable: true,
				get: () => {
                    return this.params.feedback;
                },
				set: (_feedback) => {
                    this.params.feedback = clamp(_feedback, 0.0, 1.0);

                    this.nodes.forEach((_node) => {
                        const feedback = _node.parameters.get("feedback");
                        feedback.setTargetAtTime(this.params.feedback, 0, AudioEffect.PARAM_TIME_CONSTANT);
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
