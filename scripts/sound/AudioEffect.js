function AudioEffect() {
    AudioWorkletNode.call(this);
}

AudioEffect.PARAM_TIME_CONSTANT = 0.005; // 5ms

AudioEffect.Type = {
    Bitcrusher: 0,
    Delay: 1,
    Gain: 2,
    HPF2: 3,
    LPF2: 4,
    Reverb1: 5
};

AudioEffect.getWorkletName = function(_type) {
    switch (_type)
    {
        case AudioEffect.Type.Bitcrusher:   return "bitcrusher-processor";
        case AudioEffect.Type.Delay:        return "delay-processor";
        case AudioEffect.Type.Gain:         return "gain-processor";
        case AudioEffect.Type.HPF2:         return "hpf2-processor";
        case AudioEffect.Type.LPF2:         return "lpf2-processor";
        case AudioEffect.Type.Reverb1:      return "reverb1-processor";
        default:                            return null;
    }
};

function AudioEffectStruct(_type) {
    // GML object props
    this.__type = "[AudioEffect]";
    this.__yyIsGMLObject = true;

    this.nodes = [];

    this.type = _type;
    this.params = {
        bypass: false
    };
    
    // Define user-facing properties
    Object.defineProperties(this, {
        gmlbypass: {
            enumerable: true,
            get: () => {
                return this.params.bypass;  
            },
            set: (_state) => {
                this.params.bypass = yyGetBool(_state);

                this.nodes.forEach((_node) => {
                    const bypass = _node.parameters.get("bypass");
                    bypass.value = this.params.bypass;
                });
            }
        }
    });
}

AudioEffectStruct.Create = function(_type) {
    switch (_type)
    {
        case AudioEffect.Type.Bitcrusher:   return new BitcrusherEffectStruct();
        case AudioEffect.Type.Delay:        return new DelayEffectStruct();
        case AudioEffect.Type.Gain:         return new GainEffectStruct();
        case AudioEffect.Type.HPF2:         return new HPF2EffectStruct();
        case AudioEffect.Type.LPF2:         return new LPF2EffectStruct();
        case AudioEffect.Type.Reverb1:      return new Reverb1EffectStruct();
        default:                            return null;
    }
};

AudioEffectStruct.prototype.addNode = function() {
    const node = g_WorkletNodeManager.createEffect(this);
    this.nodes.push(node);
    
    return node;
};

AudioEffectStruct.prototype.removeNode = function(_node) { 
    const idx = this.nodes.findIndex(elem => elem === _node);

    g_WorkletNodeManager.killNode(this.nodes[idx]);

    if (idx !== -1)
        this.nodes.splice(idx, 1);
};
