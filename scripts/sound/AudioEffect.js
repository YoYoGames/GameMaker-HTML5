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

    static Create(_type, _params)
    {
        switch (_type)
        {
            case AudioEffect.Type.Bitcrusher:   return new BitcrusherEffect(_params);
            case AudioEffect.Type.Delay:        return new DelayEffect(_params);
            case AudioEffect.Type.Gain:         return new GainEffect(_params);
            case AudioEffect.Type.HPF2:         return new HPF2Effect(_params);
            case AudioEffect.Type.LPF2:         return new LPF2Effect(_params);
            case AudioEffect.Type.Reverb1:      return new Reverb1Effect(_params);
            default:                            return null;
        }
    }

    constructor(_workletName, _params)
    {
        const maxChannels = g_WebAudioContext.destination.channelCount;

        super(g_WebAudioContext, _workletName, { 
			numberOfInputs: 1,
			numberOfOutputs: 1, 
			outputChannelCount: [maxChannels],
            parameterData: _params,
			channelCount: maxChannels,
			channelCountMode: "explicit"
		});
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
        const node = AudioEffect.Create(this.type, _params);
        this.nodes.push(node);
        
        return node;
    }

    removeNode(_node) 
    {
        const idx = this.nodes.findIndex(_node);

        if (idx != -1)
            this.nodes.splice(idx, 1);
    }
}
