function AudioPropsCalc() {}

AudioPropsCalc.invalid_index = -1;
AudioPropsCalc.not_specified = -1;
AudioPropsCalc.default_priority = 0;
AudioPropsCalc.default_loop = false;
AudioPropsCalc.default_gain = 1;
AudioPropsCalc.default_offset = 0;
AudioPropsCalc.default_pitch = 1;

AudioPropsCalc.CalcGain = function(_voice) {
    const asset = AudioPropsCalc.GetAssetProps(_voice.soundid);
    const group = AudioPropsCalc.GetGroupProps(_voice.soundid);
    // Emitter gains are stored in their own audio node and 
    // will be multiplied with this value by the audio context
    return _voice.gain.get() * asset.gain.get() * group.gain.get();
};

AudioPropsCalc.CalcOffset = function(_voice) {
    if (_voice.startoffset == AudioPropsCalc.not_specified) {
        const asset = AudioPropsCalc.GetAssetProps(_voice.soundid);
        return asset.offset;
    }

    return _voice.startoffset;
};

AudioPropsCalc.CalcPitch = function(_voice) {
    const asset = AudioPropsCalc.GetAssetProps(_voice.soundid);
    const emitter = AudioPropsCalc.GetEmitterProps(_voice.pemitter);

    return _voice.pitch * asset.pitch * emitter.pitch;
};

AudioPropsCalc.GetAssetProps = function(_asset_index) {
    const asset = Audio_GetSound(_asset_index);

    if (asset != null) {
        return (() => ({
            gain: asset.gain,
            offset: asset.trackPos,
            pitch: asset.pitch
        }))();
    }

    return (() => ({
        gain: new TimeRampedParamLinear(AudioPropsCalc.default_gain),
        offset: AudioPropsCalc.default_offset,
        pitch: AudioPropsCalc.default_pitch
    }))();
};

AudioPropsCalc.GetEmitterProps = function(_emitter) {
    if (_emitter != null) {
        return (() => ({
            gain: _emitter.gainnode.gain.value,
            pitch: _emitter.pitch
        }))();
    }

    return (() => ({
        gain: AudioPropsCalc.default_gain,
        pitch: AudioPropsCalc.default_pitch
    }))();
};

AudioPropsCalc.GetGroupProps = function(_assetIndex) {
    const asset = Audio_GetSound(_assetIndex);

    if (asset != null) {
        const group = g_AudioGroups[asset.groupId];

        if (group !== undefined) {
            return (() => ({
                gain: group.gain,
            }))();
        }
    }

    return (() => ({
        gain: new TimeRampedParamLinear(AudioPropsCalc.default_gain),
    }))();
};
