function TremoloEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.Tremolo);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, TremoloEffectStruct.paramDescriptors());

    // Define user-facing properties
    Object.defineProperties(this, {
        gmlrate: {
            enumerable: true,
            get: () => {
                return this.params.rate;
            },
            set: (_rate) => {
                this.setParam(TremoloEffectStruct.paramDescriptors().rate, _rate);

                this.nodes.forEach((_node) => {
                    const rate = _node.parameters.get("rate");
                    rate.value = this.params.rate;
                });
            }
        },
        gmlintensity: {
            enumerable: true,
            get: () => {
                return this.params.intensity;
            },
            set: (_intensity) => {
                this.setParam(TremoloEffectStruct.paramDescriptors().intensity, _intensity);

                this.nodes.forEach((_node) => {
                    const intensity = _node.parameters.get("intensity");
                    intensity.setTargetAtTime(this.params.intensity, 0, AudioEffect.PARAM_TIME_CONSTANT);
                });
            }
        },
        gmloffset: {
            enumerable: true,
            get: () => {
                return this.params.offset;
            },
            set: (_offset) => {
                this.setParam(TremoloEffectStruct.paramDescriptors().offset, _offset);

                this.nodes.forEach((_node) => {
                    const offset = _node.parameters.get("offset");
                    offset.value = this.params.offset;
                });
            }
        },
        gmlshape: {
            enumerable: true,
            get: () => {
                return this.params.shape;
            },
            set: (_shape) => {
                this.setParam(TremoloEffectStruct.paramDescriptors().shape, _shape);

                this.nodes.forEach((_node) => {
                    const shape = _node.parameters.get("shape");
                    shape.value = this.params.shape;
                });
            }
        }
    });
}

TremoloEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass,
    rate:      { name: "rate",      integer: false, defaultValue: 5.0, minValue: 0.0, maxValue: 20.0 },
    intensity: { name: "intensity", integer: false, defaultValue: 1.0, minValue: 0.0, maxValue: 1.0 },
    offset:    { name: "offset",    integer: false, defaultValue: 0.0, minValue: 0.0, maxValue: 1.0 },
    shape:     { name: "shape",     integer: true,  defaultValue: 0,   minValue: 0,   maxValue: 4 }
});
