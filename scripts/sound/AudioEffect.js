// @if feature("audio_effects")
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
    this.params = [];
    
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
                return this.params[AudioEffectStruct.Index.Bypass];  
            },
            set: (_state) => {
                const val = this.setParam(AudioEffectStruct.Index.Bypass, _state);

                this.nodes.forEach((_node) => {
                    const bypass = _node.parameters.get("bypass");
                    bypass.value = val;
                });
            }
        }
    });
}

AudioEffectStruct.GetStructType = function(_type) {
    switch (_type)
    {
        case AudioEffect.Type.Bitcrusher:   return BitcrusherEffectStruct;
        case AudioEffect.Type.Delay:        return DelayEffectStruct;
        case AudioEffect.Type.Gain:         return GainEffectStruct;
        case AudioEffect.Type.HPF2:         return HPF2EffectStruct;
        case AudioEffect.Type.LPF2:         return LPF2EffectStruct;
        case AudioEffect.Type.Reverb1:      return Reverb1EffectStruct;
        case AudioEffect.Type.Tremolo:      return TremoloEffectStruct;
        case AudioEffect.Type.PeakEQ:       return PeakEQEffectStruct;
        case AudioEffect.Type.HiShelf:      return HiShelfEffectStruct;
        case AudioEffect.Type.LoShelf:      return LoShelfEffectStruct;
        case AudioEffect.Type.EQ:           return EQEffectStruct;
        case AudioEffect.Type.Compressor:   return CompressorEffectStruct;
        default:                            return undefined;
    }
};

AudioEffectStruct.Create = function(_type, _params) {
    const structType = AudioEffectStruct.GetStructType(_type);
    return (structType === undefined) ? undefined : new structType(_params);
};

AudioEffectStruct.Index = {
    Bypass: 0
};

AudioEffectStruct.ParamDescriptors = [
    { name: "bypass", integer: true, defaultValue: 0, minValue: 0, maxValue: 1 }
];

AudioEffectStruct.prototype.addInstance = function() {
    const node = g_WorkletNodeManager.createEffect(this);
    this.nodes.push(node);

    const ret = { input: node, output: node };
    return ret;
};

AudioEffectStruct.prototype.initParams = function(_params) {    
    const descriptors = this.getParamDescriptors();
    
    descriptors.forEach((_desc, _idx) => {
        let val = _desc.defaultValue;
    
        if (_params !== undefined && _params["gml" + _desc.name] !== undefined) {
            val = _params["gml" + _desc.name];
        }

        this.setParam(_idx, val);
    });
};

AudioEffectStruct.prototype.setParam = function(_idx, _val) {
    const structType = AudioEffectStruct.GetStructType(this.type);
    const desc = structType.ParamDescriptors[_idx];

    _val = clamp(_val, desc.minValue, desc.maxValue);

    if (desc.integer === true)
        _val = ~~_val;

    this.params[_idx] = _val;
    return _val;
};

AudioEffectStruct.prototype.getParamDescriptors = function() {
    const structType = AudioEffectStruct.GetStructType(this.type);
    return structType.ParamDescriptors;
};

AudioEffectStruct.prototype.getParamDescriptor = function(_idx) {
    return this.getParamDescriptors()[_idx];
};

AudioEffectStruct.prototype.removeNode = function(_node) { 
    const idx = this.nodes.findIndex(elem => elem === _node);

    if (idx !== -1) {
        g_WorkletNodeManager.killNode(this.nodes[idx]);
        this.nodes.splice(idx, 1);
    }
};

AudioEffectStruct.prototype.updateFreqDesc = function(_desc) {
    if (this.isFilter() === false) {
        return _desc;
    }

    if (_desc.name !== "cutoff" && _desc.name !== "freq") {
        return _desc;
    }

    _desc.maxValue = g_WebAudioContext ? Math.min(g_WebAudioContext.sampleRate / 2, _desc.maxValue)
                                       : _desc.maxValue;
    _desc.defaultValue = Math.min(_desc.defaultValue, _desc.maxValue);
    return _desc;
};

AudioEffectStruct.prototype.isFilter = function() {
    switch (this.type) {
        case AudioEffect.Type.HiShelf:
        case AudioEffect.Type.HPF2:
        case AudioEffect.Type.LoShelf:
        case AudioEffect.Type.LPF2:
        case AudioEffect.Type.PeakEQ:
            return true;
        default:
            return false;
    }
};
// @endif