function DelayEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Delay);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, DelayEffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmltime: {
            enumerable: true,
            get: () => {
                return this.params.time;
            },
            set: (_time) => {
                this.setParam(DelayEffectStruct.paramDescriptors().time, _time);

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
                this.setParam(DelayEffectStruct.paramDescriptors().feedback, _feedback);

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
                this.setParam(DelayEffectStruct.paramDescriptors().mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(this.params.mix, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

DelayEffectStruct.paramDescriptors = () => ({
    bypass:   AudioEffectStruct.paramDescriptors().bypass,
    time:     { name: "time",     integer: false, defaultValue: 0.2,  minValue: 0.0, maxValue: 5.0 },
    feedback: { name: "feedback", integer: false, defaultValue: 0.5,  minValue: 0.0, maxValue: 1.0 },
    mix:      { name: "mix",      integer: false, defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
});
