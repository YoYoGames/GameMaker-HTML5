class AudioEmitter extends PannerNode {
    constructor() {
        if (Audio_IsMainBusInitialised() === false) {
            console.error("Cannot create audio emitters until audio engine is running - check audio_system_is_initialised()");
            return null;
        }

        super(g_WebAudioContext);
    
        this.gainnode = new GainNode(g_WebAudioContext, { gain: 1.0 });
        this.connect(this.gainnode);
    
        this.reset();
    }
}

AudioEmitter.prototype.reset = function() {
    this.setPosition(0.0, 0.0, 0.01); // why was 'z' not zero?

    this.refDistance = 100.0;
    this.maxDistance = 100000.0;
    this.rolloffFactor = 1.0;

    this.coneInnerAngle = 360.0;
    this.coneOuterAngle = 0.0;
    this.coneOuterGain = 0.0;

    this.distanceModel = falloff_model;
    this.panningModel = "equalpower";

    this.gainnode.gain.value = 1.0;

    g_AudioBusMain.connectInput(this.gainnode);
    this.bus = g_AudioBusMain;

    this.pitch = 1.0;

    if (g_AudioFalloffModel === DistanceModels.AUDIO_FALLOFF_NONE) {
        // Workaround for no falloff
        this.rolloffFactor = 0.0; 

        // Store this value so we can restore it if the falloff model changes later
        this.original_rolloffFactor = 1.0; 
    }

    this.active = true;
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
    this.refDistance = _falloffRef;
    this.maxDistance = _falloffMax;
    this.rolloffFactor = _falloffFactor;
    this.distanceModel = falloff_model;

    if (g_AudioFalloffModel === DistanceModels.AUDIO_FALLOFF_NONE) {
        this.original_rolloffFactor = this.rolloffFactor;
        this.rolloffFactor = 0.0;
    }
};

AudioEmitter.prototype.getPositionX = function() {
    return this.positionX.value;
};

AudioEmitter.prototype.getPositionY = function() {
    return this.positionY.value;
};

AudioEmitter.prototype.getPositionZ = function() {
    return this.positionZ.value;
};

AudioEmitter.prototype.setPosition = function(_x, _y, _z) {
    this.positionX.value = _x;
    this.positionY.value = _y;
    this.positionZ.value = _z;
};
