class AudioEmitter {
    constructor() {
        if (Audio_IsMainBusInitialised() === false) {
            console.error("Cannot create audio emitters until audio engine is running - check audio_system_is_initialised()");
            return null;
        }
        
        this.gainnode = Audio_CreateGainNode(g_WebAudioContext);
        this.pannerNode = AudioEmitter.createPannerNode();
        this.pannerNode.connect(this.gainnode);
    
        this.reset();
    }
}

AudioEmitter.createPannerNode = function() {
    if (PannerNode === undefined) {
        return g_WebAudioContext.createPanner();
    }

    return new PannerNode(g_WebAudioContext);
};

AudioEmitter.prototype.reset = function() {
    this.setPosition(0.0, 0.0, 0.01); // why was 'z' not zero?

    this.pannerNode.refDistance = 100.0;
    this.pannerNode.maxDistance = 100000.0;
    this.pannerNode.rolloffFactor = 1.0;

    this.pannerNode.coneInnerAngle = 360.0;
    this.pannerNode.coneOuterAngle = 0.0;
    this.pannerNode.coneOuterGain = 0.0;

    this.pannerNode.distanceModel = falloff_model;
    this.pannerNode.panningModel = "equalpower";

    this.gainnode.gain.value = 1.0;

    g_AudioBusMain.connectInput(this.gainnode);
    this.bus = g_AudioBusMain;

    this.pitch = 1.0;

    if (g_AudioFalloffModel === DistanceModels.AUDIO_FALLOFF_NONE) {
        // Workaround for no falloff
        this.pannerNode.rolloffFactor = 0.0; 

        // Store this value so we can restore it if the falloff model changes later
        this.original_rolloffFactor = 1.0; 
    }

    this.active = true;
};

AudioEmitter.prototype.getInput = function() {
    return this.pannerNode;
};

AudioEmitter.prototype.isActive = function() {
    return this.active === true;
};

AudioEmitter.prototype.getBus = function() {
    return this.bus;
};

AudioEmitter.prototype.setBus = function(_bus) {
    this.gainnode.disconnect();
    _bus.connectInput(this.gainnode);
    this.bus = _bus;
};

AudioEmitter.prototype.setFalloff = function(_falloffRef, _falloffMax, _falloffFactor) {
    this.pannerNode.refDistance = _falloffRef;
    this.pannerNode.maxDistance = _falloffMax;
    this.pannerNode.rolloffFactor = _falloffFactor;
    this.pannerNode.distanceModel = falloff_model;

    if (g_AudioFalloffModel === DistanceModels.AUDIO_FALLOFF_NONE) {
        this.original_rolloffFactor = this.pannerNode.rolloffFactor;
        this.pannerNode.rolloffFactor = 0.0;
    }
};

AudioEmitter.prototype.getPositionX = function() {
    return this.pannerNode.positionX.value;
};

AudioEmitter.prototype.getPositionY = function() {
    return this.pannerNode.positionY.value;
};

AudioEmitter.prototype.getPositionZ = function() {
    return this.pannerNode.positionZ.value;
};

AudioEmitter.prototype.setPosition = function(_x, _y, _z) {
    this.pannerNode.positionX.value = _x;
    this.pannerNode.positionY.value = _y;
    this.pannerNode.positionZ.value = _z;
};
