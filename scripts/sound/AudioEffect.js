class AudioEffect extends AudioWorkletNode
{
    static PARAM_TIME_CONSTANT = 0.005; // 5ms

    static Type = {
        Bitcrusher: 0,
		Delay: 1,
		Gain: 2,
		HPF2: 3,
		LPF2: 4,
		Reverb1: 5
    };

    static getWorkletName(_type)
    {
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
    }
}

class AudioEffectStruct
{
    static Create(_type)
    {
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
    }

    constructor(_type)
    {
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

    addNode(_params)
    {
        const node = g_WorkletNodeManager.createEffect(this);
        this.nodes.push(node);
        
        return node;
    }

    removeNode(_node) 
    {
        const idx = this.nodes.findIndex(elem => elem === _node);

        g_WorkletNodeManager.killNode(this.nodes[idx]);

        if (idx !== -1)
            this.nodes.splice(idx, 1);
    }
}
