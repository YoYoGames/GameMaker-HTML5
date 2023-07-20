function AudioEffect() {}

AudioEffect.PARAM_TIME_CONSTANT = 0.005; // 5ms

AudioEffect.Type = {
    Bitcrusher: 0,
    Delay: 1,
    Gain: 2,
    HPF2: 3,
    LPF2: 4,
    Reverb1: 5,
    Tremolo: 6,
    PeakEQ: 7,
    HiShelf: 8,
    LoShelf: 9,
    EQ: 10,
    Compressor: 11
};

AudioEffect.getWorkletName = function(_type) {
    switch (_type) {
        case AudioEffect.Type.Bitcrusher:   return "bitcrusher-processor";
        case AudioEffect.Type.Delay:        return "delay-processor";
        case AudioEffect.Type.Gain:         return "gain-processor";
        case AudioEffect.Type.HPF2:         return "hpf2-processor";
        case AudioEffect.Type.LPF2:         return "lpf2-processor";
        case AudioEffect.Type.Reverb1:      return "reverb1-processor";
        case AudioEffect.Type.Tremolo:      return "tremolo-processor";
        case AudioEffect.Type.PeakEQ:       return "peak-eq-processor";
        case AudioEffect.Type.HiShelf:      return "hi-shelf-processor";
        case AudioEffect.Type.LoShelf:      return "lo-shelf-processor";
        case AudioEffect.Type.EQ:           return null;
        case AudioEffect.Type.Compressor:   return "compressor-processor";
        default:                            return null;
    }
};

function AudioEffectStruct(_type) {
    // GML object props
    this.__type = "[AudioEffect]";
    this.__yyIsGMLObject = true;

    this.nodes = [];

    this.type = _type;
    this.params = {};
    
    // Define user-facing properties
    Object.defineProperties(this, {
        gmltype: {
            enumerable: true,
            get: () => {
                return this.type;  
            },
            set: (_type) => {
                throw new Error("Unable to set AudioEffect.type - property is read-only");
            }
        },
        gmlbypass: {
            enumerable: true,
            get: () => {
                return this.params.bypass;  
            },
            set: (_state) => {
                this.setParam(AudioEffectStruct.paramDescriptors().bypass, _state);

                this.nodes.forEach((_node) => {
                    const bypass = _node.parameters.get("bypass");
                    bypass.value = this.params.bypass;
                });
            }
        }
    });
}

AudioEffectStruct.Create = function(_type, _params) {
    switch (_type)
    {
        case AudioEffect.Type.Bitcrusher:   return new BitcrusherEffectStruct(_params);
        case AudioEffect.Type.Delay:        return new DelayEffectStruct(_params);
        case AudioEffect.Type.Gain:         return new GainEffectStruct(_params);
        case AudioEffect.Type.HPF2:         return new HPF2EffectStruct(_params);
        case AudioEffect.Type.LPF2:         return new LPF2EffectStruct(_params);
        case AudioEffect.Type.Reverb1:      return new Reverb1EffectStruct(_params);
        case AudioEffect.Type.Tremolo:      return new TremoloEffectStruct(_params);
        case AudioEffect.Type.PeakEQ:       return new PeakEQEffectStruct(_params);
        case AudioEffect.Type.HiShelf:      return new HiShelfEffectStruct(_params);
        case AudioEffect.Type.LoShelf:      return new LoShelfEffectStruct(_params);
        case AudioEffect.Type.EQ:           return new EQEffectStruct(_params);
        case AudioEffect.Type.Compressor:   return new CompressorEffectStruct(_params);
        default:                            return null;
    }
};

AudioEffectStruct.paramDescriptors = () => ({
    bypass: { name: "bypass", integer: true, defaultValue: 0, minValue: 0, maxValue: 1 }
});

AudioEffectStruct.prototype.addInstance = function() {
    const node = g_WorkletNodeManager.createEffect(this);
    this.nodes.push(node);

    const ret = { input: node, output: node };
    return ret;
};

AudioEffectStruct.prototype.initParams = function(_params, _descriptors) {
    Object.values(_descriptors).forEach(_desc => {
        const val = (() => {
            if (_params === undefined || _params["gml" + _desc.name] === undefined) {
                return _desc.defaultValue;
            }

            return _params["gml" + _desc.name];
        })();

        this.setParam(_desc, val);
    });
};

AudioEffectStruct.prototype.setParam = function(_desc, _val) {
    _val = clamp(_val, _desc.minValue, _desc.maxValue);

    if (_desc.integer === true)
        _val = ~~_val;

    this.params[_desc.name] = _val;
};

AudioEffectStruct.prototype.removeNode = function(_node) { 
    const idx = this.nodes.findIndex(elem => elem === _node);

    if (idx !== -1) {
        g_WorkletNodeManager.killNode(this.nodes[idx]);
        this.nodes.splice(idx, 1);
    }
};
