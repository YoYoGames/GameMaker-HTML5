class HPF2Effect extends AudioEffect
{
    constructor()
    {
        super("hpf2-processor");
    }
}

class HPF2EffectStruct extends AudioEffectStruct
{
    constructor()
    {
        super(AudioEffect.Type.HPF2);

        this.params.cutoff = 10.0;
        this.params.q = 1.0;

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlcutoff: {
				enumerable: true,
				get: () => {
                    return this.params.cutoff;
                },
				set: (_cutoff) => {
                    const max = Math.min(g_WebAudioContext.sampleRate / 2.0, 20000.0);

                    this.params.cutoff = clamp(_cutoff, 10.0, max);

                    this.nodes.forEach((_node) => {
                        const cutoff = _node.parameters.get("cutoff");
                        cutoff.value = this.params.cutoff;
                    });
                }
			},
            gmlq: {
				enumerable: true,
				get: () => {
                    return this.params.q;
                },
				set: (_q) => {
                    this.params.q = clamp(_q, 1.0, 100.0);

                    this.nodes.forEach((_node) => {
                        const q = _node.parameters.get("q");
                        q.value = this.params.q;
                    });
                }
			}
		});
    }
}