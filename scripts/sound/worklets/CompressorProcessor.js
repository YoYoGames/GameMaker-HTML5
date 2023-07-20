class Env {
    constructor(_time = 1e-3) {
        this.setTime(_time);
    }

    /* Time to move ~63.2% towards target value */
    setTime(_time) {
        this.tc = Math.exp(-1 / (_time * sampleRate));
    }

    process(_in, _prev) {
        return _in + this.tc * (_prev - _in);
    }
}

class AttRelEnv {
    constructor(_att, _rel) {
        this.att = new Env(_att);
        this.rel = new Env(_rel);

        this.prevAtt = _att;
        this.prevRel = _rel;
    }

    setAtt(_time) {
        if (_time === this.prevAtt)
            return;

        this.att.setTime(_time);
        this.prevAtt = _time;
    }

    setRel(_time) {
        if (_time === this.prevRel)
            return;

        this.rel.setTime(_time);
        this.prevRel = _time;
    }

    process(_in, _prev) {
        if (_in > _prev)
            return this.att.process(_in, _prev);
        else
            return this.rel.process(_in, _prev);
    }
}

class CompressorProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: "bypass",    automationRate: "a-rate", defaultValue: 0,     minValue: 0,    maxValue: 1 },
            { name: "ingain",    automationRate: "a-rate", defaultValue: 1,     minValue: 0 },
            { name: "threshold", automationRate: "a-rate", defaultValue: 0.125, minValue: 1e-3, maxValue: 1 },
            { name: "ratio",     automationRate: "a-rate", defaultValue: 4,     minValue: 1 },
            { name: "attack",    automationRate: "a-rate", defaultValue: 0.05,  minValue: 1e-3, maxValue: 1e-1 },
            { name: "release",   automationRate: "a-rate", defaultValue: 0.25,  minValue: 1e-2, maxValue: 1 },
            { name: "outgain",   automationRate: "a-rate", defaultValue: 1,     minValue: 0 }
        ];
    }

    constructor(_opts) {
        super();
        this.makeMortal();

        const att = CompressorProcessor.parameterDescriptors.find(_p => _p.name === "attack");
        const rel = CompressorProcessor.parameterDescriptors.find(_p => _p.name === "release");

        this.env = new AttRelEnv(att.defaultValue, rel.defaultValue);
        this.excessSmoothed = 0;
    }

    process(_ins, _outs, _params) {
        const input = _ins[0];
        const output = _outs[0];

        const bypass = _params.bypass;
        const ingain = _params.ingain;
        const outgain = _params.outgain;
        const threshold = _params.threshold;
        const ratio = _params.ratio;
        const attack = _params.attack;
        const release = _params.release;

        if (input.length === 0)
            return this.keepAlive;

        for (let s = 0; s < input[0].length; ++s) {
            /* Create frame */
            let frame = input.map(_c => _c[s]);

            /* Copy in => out */
            output.forEach((_c, _i) => {
                _c[s] = frame[_i];
            });

            /* Input gain */
            const ig = (ingain[s] !== undefined) ? ingain[s] : ingain[0];
            frame = frame.map(_s => _s *= ig);

            /* Calc excess */
            const rect = frame.map(_s => Math.abs(_s));
            const max = Math.max(...rect);
            const maxdB = linToDb(max);
            const t = (threshold[s] !== undefined) ? threshold[s] : threshold[0];
            const tdB = linToDb(t);
            const excess = Math.max(0, maxdB - tdB);

            /* Smooth excess */
            const att = (attack[s] !== undefined) ? attack[s] : attack[0];
            const rel = (release[s] !== undefined) ? release[s] : release[0];
            this.env.setAtt(att);
            this.env.setRel(rel);
            this.excessSmoothed = this.env.process(excess, this.excessSmoothed);

            /* Check bypass */
            const b = (bypass[s] !== undefined) ? bypass[s] : bypass[0];

            if (b > 0)
                continue;

            /* Gain reduction */
            const r = (ratio[s] !== undefined) ? ratio[s] : ratio[0];
            const gdB = (this.excessSmoothed / r) - this.excessSmoothed;
            const g = dbToLin(gdB);
            frame = frame.map(_s => _s *= g);

            /* Output gain */
            const og = (outgain[s] !== undefined) ? outgain[s] : outgain[0];
            frame = frame.map(_s => _s *= og);

            /* Write frame */
            output.forEach((_c, _i) => {
                _c[s] = frame[_i];
            });
        }

        return this.keepAlive;
    }
}

function linToDb(_x) {
    return 20 * Math.log10(_x);
}

function dbToLin(_x) {
    return Math.pow(10, _x / 20);
}

registerProcessor("compressor-processor", CompressorProcessor);
