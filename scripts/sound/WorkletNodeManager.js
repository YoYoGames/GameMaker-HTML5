function WorkletNodeManager() {
	this.nodes = [];
	this.handle = setInterval(() => this.cleanup(), 5000);
}

WorkletNodeManager.prototype.createBusInput = function(_struct) {
	const maxChannels = g_WebAudioContext.destination.channelCount;

	const node = new AudioWorkletNode(g_WebAudioContext, "audio-bus-input", { 
		numberOfInputs: 1,
		numberOfOutputs: 2, 
		outputChannelCount: [maxChannels, maxChannels],
		channelCount: maxChannels,
		channelCountMode: "explicit"
	});

	this.nodes.push({
		struct: new WeakRef(_struct),
		node: node
	});

	return node;
};

WorkletNodeManager.prototype.createBusOutput = function(_struct) {
	const maxChannels = g_WebAudioContext.destination.channelCount;

	const node = new AudioWorkletNode(g_WebAudioContext, "audio-bus-output",  { 
		numberOfInputs: 2,
		numberOfOutputs: 1, 
		outputChannelCount: [maxChannels],
		channelCount: maxChannels,
		channelCountMode: "explicit"
	});

	this.nodes.push({
		struct: new WeakRef(_struct),
		node: node
	});

	return node;
};

WorkletNodeManager.prototype.createEffect = function(_struct) {
	const workletName = AudioEffect.getWorkletName(_struct.type);
	const maxChannels = g_WebAudioContext.destination.channelCount;

	const node = new AudioWorkletNode(g_WebAudioContext, workletName, { 
		numberOfInputs: 1,
		numberOfOutputs: 1, 
		outputChannelCount: [maxChannels],
		parameterData: _struct.params,
		channelCount: maxChannels,
		channelCountMode: "explicit"
	});

	this.nodes.push({
		struct: new WeakRef(_struct),
		node: node
	});

	return node;
};

WorkletNodeManager.prototype.cleanup = function() {
	this.nodes = this.nodes.filter((_elem) => {
		const struct = _elem.struct.deref();

		if (struct === undefined)
		{
			_elem.node.port.postMessage("kill");
			return false;
		}

		return true;
	});
};

WorkletNodeManager.prototype.killNode = function(_node) {
	const idx = this.nodes.findIndex(_elem => _elem.node === _node);

	if (idx !== -1)
	{
		this.nodes[idx].node.port.postMessage("kill");
		this.nodes.splice(idx, 1);
	}
};

var g_WorkletNodeManager = new WorkletNodeManager();
