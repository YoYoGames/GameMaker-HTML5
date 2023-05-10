function EQEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.EQ);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, PeakEQEffectStruct.paramDescriptors());

    _params ??= {};

    this.locut = new HPF2EffectStruct(_params.gmllocut);
    this.loshelf = new LoShelfEffectStruct(_params.gmlloshelf);
    this.eq1 = new PeakEQEffectStruct(_params.gmleq1);
    this.eq2 = new PeakEQEffectStruct(_params.gmleq2);
    this.eq3 = new PeakEQEffectStruct(_params.gmleq3);
    this.eq4 = new PeakEQEffectStruct(_params.gmleq4);
    this.hishelf = new HiShelfEffectStruct(_params.gmlhishelf);
    this.hicut = new LPF2EffectStruct(_params.gmlhicut);

    Object.defineProperties(this, {
        gmllocut: {
            enumerable: true,
            get: () => {
                return this.locut;
            },
            set: (_unused) => {}
        },
        gmlloshelf: {
            enumerable: true,
            get: () => {
                return this.loshelf;
            },
            set: (_unused) => {}
        },
        gmleq1: {
            enumerable: true,
            get: () => {
                return this.eq1;
            },
            set: (_unused) => {}
        },
        gmleq2: {
            enumerable: true,
            get: () => {
                return this.eq2;
            },
            set: (_unused) => {}
        },
        gmleq3: {
            enumerable: true,
            get: () => {
                return this.eq3;
            },
            set: (_unused) => {}
        },
        gmleq4: {
            enumerable: true,
            get: () => {
                return this.eq4;
            },
            set: (_unused) => {}
        },
        gmlhishelf: {
            enumerable: true,
            get: () => {
                return this.hishelf;
            },
            set: (_unused) => {}
        },
        gmlhicut: {
            enumerable: true,
            get: () => {
                return this.hicut;
            },
            set: (_unused) => {}
        }
    });

    this.addInstance = function() {
        const maxChannels = g_WebAudioContext.destination.channelCount;
    
        const inputNode = new AudioWorkletNode(g_WebAudioContext, "eq-input", { 
            numberOfInputs: 1,
            numberOfOutputs: 2, 
            outputChannelCount: [maxChannels, maxChannels],
            channelCount: maxChannels,
            channelCountMode: "explicit"
        });
    
        const locutNode = this.locut.addInstance();
        const loshelfNode = this.loshelf.addInstance();
        const eq1Node = this.eq1.addInstance();
        const eq2Node = this.eq2.addInstance();
        const eq3Node = this.eq3.addInstance();
        const eq4Node = this.eq4.addInstance();
        const hishelfNode = this.hishelf.addInstance();
        const hicutNode = this.hicut.addInstance();
    
        const outputNode = new AudioWorkletNode(g_WebAudioContext, "eq-output", { 
            numberOfInputs: 2,
            numberOfOutputs: 1, 
            outputChannelCount: [maxChannels],
            parameterData: this.params,
            channelCount: maxChannels,
            channelCountMode: "explicit"
        });
    
        this.nodes.push(outputNode);
    
        inputNode.connect(outputNode, 1, 1);
        inputNode.connect(locutNode.input, 0, 0);
        locutNode.output.connect(loshelfNode.input, 0, 0);
        loshelfNode.output.connect(eq1Node.input, 0, 0);
        eq1Node.output.connect(eq2Node.input, 0, 0);
        eq2Node.output.connect(eq3Node.input, 0, 0);
        eq3Node.output.connect(eq4Node.input, 0, 0);
        eq4Node.output.connect(hishelfNode.input, 0, 0);
        hishelfNode.output.connect(hicutNode.input, 0, 0);
        hicutNode.output.connect(outputNode, 0, 0);
    
        g_WorkletNodeManager.nodes.push({
            struct: new WeakRef(this),
            node: inputNode
        });
    
        g_WorkletNodeManager.nodes.push({
            struct: new WeakRef(this),
            node: outputNode
        });
    
        return { input: inputNode, output: outputNode };
    };
}

EQEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass
});
