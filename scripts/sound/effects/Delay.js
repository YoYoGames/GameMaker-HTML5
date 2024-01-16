// @if feature("audio_effects")
function DelayEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Delay);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmltime: {
            enumerable: true,
            get: () => {
                return this.params[DelayEffectStruct.Index.Time];
            },
            set: (_time) => {
                const val = this.setParam(DelayEffectStruct.Index.Time, _time);

                this.nodes.forEach((_node) => {
                    const time = _node.parameters.get("time");
                    time.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmlfeedback: {
            enumerable: true,
            get: () => {
                return this.params[DelayEffectStruct.Index.Feedback];
            },
            set: (_feedback) => {
                const val = this.setParam(DelayEffectStruct.Index.Feedback, _feedback);

                this.nodes.forEach((_node) => {
                    const feedback = _node.parameters.get("feedback");
                    feedback.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmlmix: {
            enumerable: true,
            get: () => {
                return this.params[DelayEffectStruct.Index.Mix];
            },
            set: (_mix) => {
                const val = this.setParam(DelayEffectStruct.Index.Mix, _mix);

                this.nodes.forEach((_node) => {
                    const mix = _node.parameters.get("mix");
                    mix.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        }
    });
}

DelayEffectStruct.Index = {
    Bypass: 0,
    Time: 1,
    Feedback: 2,
    Mix: 3
};

DelayEffectStruct.ParamDescriptors = [
    { name: "bypass",   integer: true,  defaultValue: 0,    minValue: 0,   maxValue: 1 },
    { name: "time",     integer: false, defaultValue: 0.2,  minValue: 0.0, maxValue: 5.0 },
    { name: "feedback", integer: false, defaultValue: 0.5,  minValue: 0.0, maxValue: 1.0 },
    { name: "mix",      integer: false, defaultValue: 0.35, minValue: 0.0, maxValue: 1.0 }
];
// @endif
