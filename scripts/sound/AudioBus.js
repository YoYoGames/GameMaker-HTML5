class AudioBus extends AudioWorkletNode
{
	static NUM_EFFECT_SLOTS = 8;

	constructor()
	{
		// The bus inherits from AudioWorkletNode to allow for straightforward input connections
		super(g_WebAudioContext, "audio-bus-input", { 
			numberOfInputs: 1,
			numberOfOutputs: 2, 
			outputChannelCount: [2, 2]
		});

		// GML object props
		this.__type = "[AudioBus]";
		this.__yyIsGMLObject = true;

		// Output gain + mix node
		this.outputNode = new AudioWorkletNode(g_WebAudioContext, "audio-bus-output",  { 
			numberOfInputs: 2,
			numberOfOutputs: 1, 
			outputChannelCount: [2]
		});

		this.connect(this.outputNode, 0, 0); // Initial effect chain connection
		this.connect(this.outputNode, 1, 1); // Bypass connection

		this.bypass = false;
		this.gain = 1.0;
		this.effects = Array(AudioBus.NUM_EFFECT_SLOTS).fill(undefined);
		this.nodes = Array(AudioBus.NUM_EFFECT_SLOTS).fill(undefined);

		this.proxy = new Proxy(this.effects, {
			set: (_target, _property, _value, _receiver) => {
				const propAsInt = parseInt(_property);

				if (this.isNodeIndex(propAsInt))
					this.handleConnections(propAsInt, this.handleValue(_value));
				
				_target[_property] = _value;
			}
		});

        // Define user-facing properties
		Object.defineProperties(this, {
			gmlbypass: {
				enumerable: true,
				get: () => {
                	return this.bypass;
                },
				set: (_state) => {
					this.bypass = yyGetBool(_state);

                    const bypass = this.parameters.get("bypass");
                    bypass.value = this.bypass;
                }
			},        
			gmlgain: {
				enumerable: true,
				get: () => {
                    return this.gain; 
                },
				set: (_gain) => {
					this.gain = max(0.0, _gain);

					const gain = this.outputNode.parameters.get("gain");
                    gain.setTargetAtTime(this.gain, 0, AudioEffect.PARAM_TIME_CONSTANT);
                }
			},
			gmleffects: {
				enumerable: true,
				get: () => {
					return this.proxy;
				},
				set: (_effects) => {} // ***** Should investigate how replacing the array affects the proxy
			}
		});
	}

	connectOutput(_destination, _outputIndex, _inputIndex)
	{
		const node = this.outputNode.connect(_destination, _outputIndex, _inputIndex);
	}

	findNextNode(_idx)
	{
		const nodes = this.nodes.slice(_idx + 1, AudioBus.NUM_EFFECT_SLOTS);
		const nextNode = nodes.find((_node) => _node !== undefined);

		return nextNode ?? this.outputNode;
	}

	findPrevNode(_idx) 
	{
		const nodes = this.nodes.slice(0, _idx);
		const prevNode = nodes.findLast((_node) => _node !== undefined);

		return prevNode ?? this;
	}

	handleConnections(_idx, _newNode)
	{
		const currentNode = this.nodes[_idx];

		if (currentNode === undefined && _newNode === undefined)
			return; // No need to change anything

		const prevNode = this.findPrevNode(_idx);
		const nextNode = this.findNextNode(_idx);

		// If the slot is occupied
		if (currentNode !== undefined)
		{
			prevNode.disconnect(currentNode);

			currentNode.disconnect();
			this.effects[_idx].RemoveNode(currentNode);
		}

		// Set the new node
		if (_newNode === undefined)
		{
			prevNode.connect(nextNode, 0, 0);
		}
		else
		{
			prevNode.connect(_newNode, 0, 0);
			_newNode.connect(nextNode, 0, 0);
		}

		this.nodes[_idx] = _newNode;
	}

	handleValue(_value)
	{
		if (_value instanceof AudioEffectStruct)
			return _value.addNode();

		if (_value === undefined)
			return _value;
	
		throw new Error("Value must be Struct.AudioEffect or undefined");
	}

	isNodeIndex(_prop)
	{
		if (_prop >= 0 && _prop < AudioBus.NUM_EFFECT_SLOTS)
			return true;

		return false;
	}
}
