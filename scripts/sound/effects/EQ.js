function EQEffectStruct(_params) {
    AudioEffectStruct.call(this, AudioEffect.Type.EQ);
    Object.setPrototypeOf(this, AudioEffectStruct.prototype);

    this.initParams(_params, PeakEQEffectStruct.paramDescriptors());

    const paramsWereGiven = (_params !== undefined);

    if (paramsWereGiven === false) {
        _params = {};
    }

    this.locut = new HPF2EffectStruct(_params.gmllocut);
    this.loshelf = new LoShelfEffectStruct(_params.gmlloshelf);
    this.eq1 = new PeakEQEffectStruct(_params.gmleq1);
    this.eq2 = new PeakEQEffectStruct(_params.gmleq2);
    this.eq3 = new PeakEQEffectStruct(_params.gmleq3);
    this.eq4 = new PeakEQEffectStruct(_params.gmleq4);
    this.hishelf = new HiShelfEffectStruct(_params.gmlhishelf);
    this.hicut = new LPF2EffectStruct(_params.gmlhicut);

    if (_params.gmllocut === undefined) {
        this.locut.gmlcutoff = 10;
        this.locut.gmlq = 1;
    }

    if (_params.gmlloshelf === undefined) {
        this.loshelf.gmlfreq = 200;
        this.loshelf.gmlgain = (paramsWereGiven === true) ? db_to_lin(0) : db_to_lin(12)
    }

    if (_params.gmleq1 === undefined) {
        this.eq1.gmlfreq = 500;
        this.eq1.gmlgain = (paramsWereGiven === true) ? db_to_lin(0) : db_to_lin(-24);
    }

    if (_params.gmleq2 === undefined) {
        this.eq2.gmlfreq = 1000;
        this.eq2.gmlgain = db_to_lin(0);
    }

    if (_params.gmleq3 === undefined) {
        this.eq3.gmlfreq = 2000;
        this.eq3.gmlgain = db_to_lin(0);
    }

    if (_params.gmleq4 === undefined) {
        this.eq4.gmlfreq = 3000;
        this.eq4.gmlgain = db_to_lin(0);
    }

    if (_params.gmlhishelf === undefined) {
        this.hishelf.gmlfreq = 5000;
        this.hishelf.gmlgain = (paramsWereGiven === true) ? db_to_lin(0) : db_to_lin(18);
    }

    if (_params.gmlhicut === undefined) {
        this.hicut.gmlcutoff = LPF2EffectStruct.paramDescriptors().cutoff.maxValue;
        this.hicut.gmlq = 1;
    }

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
    
        const ret = { input: inputNode, output: outputNode };
        return ret;
    };
}

EQEffectStruct.paramDescriptors = () => ({
    bypass: AudioEffectStruct.paramDescriptors().bypass
});
