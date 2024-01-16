// @if feature("audio_effects")
function TremoloEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Tremolo);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params);

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlrate: {
            enumerable: true,
            get: () => {
                return this.params[TremoloEffectStruct.Index.Rate];
            },
            set: (_rate) => {
                const val = this.setParam(TremoloEffectStruct.Index.Rate, _rate);

                this.nodes.forEach((_node) => {
                    const rate = _node.parameters.get("rate");
                    rate.value = val;
                });
            }
        },
        gmlintensity: {
            enumerable: true,
            get: () => {
                return this.params[TremoloEffectStruct.Index.Intensity];
            },
            set: (_intensity) => {
                const val = this.setParam(TremoloEffectStruct.Index.Intensity, _intensity);

                this.nodes.forEach((_node) => {
                    const intensity = _node.parameters.get("intensity");
                    intensity.setTargetAtTime(val, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmloffset: {
            enumerable: true,
            get: () => {
                return this.params[TremoloEffectStruct.Index.Offset];
            },
            set: (_offset) => {
                const val = this.setParam(TremoloEffectStruct.Index.Offset, _offset);

                this.nodes.forEach((_node) => {
                    const offset = _node.parameters.get("offset");
                    offset.value = val;
                });
            }
        },
        gmlshape: {
            enumerable: true,
            get: () => {
                return this.params[TremoloEffectStruct.Index.Shape];
            },
            set: (_shape) => {
                const val = this.setParam(TremoloEffectStruct.Index.Shape, _shape);

                this.nodes.forEach((_node) => {
                    const shape = _node.parameters.get("shape");
                    shape.value = val;
                });
            }
        }
    });
}

TremoloEffectStruct.Index = {
    Bypass: 0,
    Rate: 1,
    Intensity: 2,
    Offset: 3,
    Shape: 4
};

TremoloEffectStruct.ParamDescriptors = [
    { name: "bypass",    integer: true,  defaultValue: 0,   minValue: 0,   maxValue: 1 },
    { name: "rate",      integer: false, defaultValue: 5.0, minValue: 0.0, maxValue: 20.0 },
    { name: "intensity", integer: false, defaultValue: 1.0, minValue: 0.0, maxValue: 1.0 },
    { name: "offset",    integer: false, defaultValue: 0.0, minValue: 0.0, maxValue: 1.0 },
    { name: "shape",     integer: true,  defaultValue: 0,   minValue: 0,   maxValue: 4 }
];
// @endif
