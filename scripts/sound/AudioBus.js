class AudioBus extends AudioWorkletNode
{
	static NUM_EFFECT_SLOTS = 8;
    static GAIN_TIME_CONSTANT = 0.005; // 5ms

	constructor()
	{
        // Instantiate an AudioWorkletNode representing this bus
        super(g_WebAudioContext, "audio-bus-processor");

        // GML object props
		this.__type = "[AudioBus]";
		this.__yyIsGMLObject = true;

		// The actual gain is a smoothed value so return the target instead
		this.gainTarget = 1.0;

		// Front-end of AudioEffect
		this.effects = Array(AudioBus.NUM_EFFECT_SLOTS).fill(undefined);
		Object.seal(this.effects); // Fixes the array's size (but elements are still mutable)

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlbypass: 
            {
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
			gmlgain: 
            {
				enumerable: true,
				get: () => {
                    return this.gainTarget; 
                },
				set: (_gain) => {
					const newGain = yyGetReal(_gain);

					this.gainTarget = newGain;

                    const gain = this.parameters.get("gain");
                    gain.setTargetAtTime(newGain, 0, AudioBus.GAIN_TIME_CONSTANT);
                }
			},
			gmleffects: 
            {
				enumerable: true,
				get: function () {  return this.effects; },
				set: function (_effects) { 
					if (_effects instanceof Array
						&& _effects.length == AudioBus.NUM_EFFECT_SLOTS)
					{
						this.effects = _effects;
					}
					else
					{
						throw new Error("AudioBus.effects must be an array of size " + AudioBus.NUM_EFFECT_SLOTS);
					}
				}
			}
		});
	}
}
