class AudioBus extends AudioWorkletNode
{
	static NUM_EFFECT_SLOTS = 8;
    static GAIN_TIME_CONSTANT = 0.005; // 5ms

	constructor()
	{
		// The bus inherits from AudioWorkletNode to allow for straightforward (dis)connection
		super(g_WebAudioContext, "audio-bus-input", { 
			numberOfInputs: 1,
			numberOfOutputs: 2, 
			outputChannelCount: [2, 2]
		});

		// Output gain + mix node
		this.outputNode = new AudioWorkletNode(g_WebAudioContext, "audio-bus-output",  { 
			numberOfInputs: 2,
			numberOfOutputs: 1, 
			outputChannelCount: [2]
		});

		super.connect(this.outputNode, 0, 0); // Bypass connection
		super.connect(this.outputNode, 1, 1); // Initial effect chain connection

		// Front-end of AudioEffect
		this.effects = Array(AudioBus.NUM_EFFECT_SLOTS).fill(undefined);
		Object.seal(this.effects); // Fixes the array's size (but elements are still mutable)

		// The actual gain is a smoothed value so return the target instead
		this.gainTarget = 1.0;

		// GML object props
		this.__type = "[AudioBus]";
		this.__yyIsGMLObject = true;

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlbypass: {
				enumerable: true,
				get: () => {
                	const bypass = this.parameters.get("bypass");
                    return bypass.value;
                },
				set: (_state) => {
                    const bypass = this.parameters.get("bypass");
                    bypass.value = yyGetBool(_state);
                }
			},        
			gmlgain: {
				enumerable: true,
				get: () => {
                    return this.gainTarget; 
                },
				set: (_gain) => {
					const newGain = yyGetReal(_gain);
					this.gainTarget = newGain;

					const gain = this.outputNode.parameters.get("gain");
                    gain.setTargetAtTime(newGain, 0, AudioBus.GAIN_TIME_CONSTANT);
                }
			},
			gmleffects: {
				enumerable: true,
				get: function () {  return this.effects; },
				set: function (_effects) { 
					if (_effects instanceof Array
						&& _effects.length == AudioBus.NUM_EFFECT_SLOTS) {
						this.effects = _effects;
					}
					else {
						throw new Error("AudioBus.effects must be an array of size " + AudioBus.NUM_EFFECT_SLOTS);
					}
				}
			}
		});
	}

	connect(_destination, _outputIndex, _inputIndex)
	{
		this.outputNode.connect(_destination, _outputIndex, _inputIndex);
	}
}
