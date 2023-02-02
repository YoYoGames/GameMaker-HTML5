var AudioPlaybackType = {
    NON_POSITIONAL: 0,
    POSITIONAL_SPECIFIED: 1,
    POSITIONAL_EMITTER: 2
};

function AudioPlaybackProps(_props) {
    if (this.getProp(_props, "sound", this, "asset_index", true, yyGetInt32, AudioPropsCalc.invalid_index)) {
        this.asset = Audio_GetSound(this.asset_index);

        if (this.asset !== null) {
            this.loopStart = this.asset.loopStart;
            this.loopEnd = this.asset.loopEnd;
        }
    }

    if (this.getProp(_props, "emitter", this, "emitter_index", true, yyGetInt32, AudioPropsCalc.invalid_index)) {
        this.type = AudioPlaybackType.POSITIONAL_EMITTER;
        this.emitter = audio_emitters[this.emitter_index];
    }
    
    this.getProp(_props, "priority", this, "priority", true, yyGetReal, AudioPropsCalc.default_priority);
    this.getProp(_props, "loop", this, "loop", true, yyGetBool, AudioPropsCalc.default_loop);
    this.getProp(_props, "gain", this, "gain", true, yyGetReal, AudioPropsCalc.default_gain);
    this.getProp(_props, "offset", this, "offset", true, yyGetReal, AudioPropsCalc.not_specified);
    this.getProp(_props, "pitch", this, "pitch", true, yyGetReal, AudioPropsCalc.default_pitch);

    if (typeof _props.gmlposition === "object" && this.type === undefined) {
            this.type = AudioPlaybackType.POSITIONAL_SPECIFIED;

            const position = _props.position ?? _props.gmlposition;
            this.position = {};

            this.getProp(position, "x", this.position, "x", false, yyGetReal, 0);
            this.getProp(position, "y", this.position, "y", false, yyGetReal, 0);
            this.getProp(position, "z", this.position, "z", false, yyGetReal, 0);
            this.getProp(position, "falloff_ref", this.position, "falloff_ref", true, yyGetReal, 0);
            this.getProp(position, "falloff_max", this.position, "falloff_max", true, yyGetReal, 1);
            this.getProp(position, "falloff_factor", this.position, "falloff_factor", true, yyGetReal, 1);
    }

    this.type ??= AudioPlaybackType.NON_POSITIONAL;
}

AudioPlaybackProps.prototype.getProp = function(_srcObj, _srcKey, _destObj, _destKey, 
    _gmlPrefix, _converterFn, _default) {
    if (_srcObj[_srcKey] !== undefined) {
        _destObj[_destKey] = _converterFn(_srcObj[_srcKey]);
        return true;
    }
    
    if (_gmlPrefix && _srcObj["gml" + _srcKey] !== undefined) {
        _destObj[_destKey] = _converterFn(_srcObj["gml" + _srcKey]);
        return true;
    }

    _destObj[_destKey] = _default;
    return false;
};

AudioPlaybackProps.prototype.invalid = function() {
    if (this.asset == null) {
        debug("Audio playback failed - invalid asset index: " + this.asset_index);
        return true;
    }

    if (!audio_group_is_loaded(this.asset.groupId)) {
        debug(audio_get_name(this.asset_index) + ": Audio Group " + this.asset.groupId + " is not loaded");
        return true;
    }

    if (!Audio_WebAudioPlaybackAllowed()) {
        debug("Audio playback failed. WebAudio Context suspended (user must interact with the page before audio can be played).");
        return true;
    }

    if (this.type === AudioPlaybackType.POSITIONAL_EMITTER && this.emitter === undefined) {
        debug("Attempting to play sound on inactive emitter: " + this.emitter_index);
        return true;
    }

    return false;
};
