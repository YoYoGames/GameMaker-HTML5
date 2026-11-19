"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const runtimeRoot = process.env.TEST_RUNTIME_ROOT || path.join(__dirname, "..");
const source = fs.readFileSync(path.join(runtimeRoot, "scripts/functions/Function_Maths.js"), "utf8");

function loadMaths() {
    class FixedDate extends Date {
        constructor() { super(1_700_000_000_000); }
    }
    return vm.runInNewContext(source + "\n({ random_set_seed, random_get_seed, randomize, " +
        "randomise, random_use_old_version, next: () => rand(), state })",
    { yyGetInt32: value => value | 0, Date: FixedDate });
}

// Reference: the extended seed recurrence followed by WELL512's 32-bit words.
// Uint32Array wraps each store and >>> gives the unsigned right shift.
function reference(seed, polynomial) {
    const words = new Uint32Array(16);
    for (let i = 0; i < words.length; i++) {
        seed = (Math.imul(seed, 214013) + 2531011) & 0x7fffffff;
        words[i] = seed;
    }
    let index = 0;
    return () => {
        const current = words[index];
        const tap13 = words[(index + 13) & 15];
        const tap9 = words[(index + 9) & 15];
        const left = current ^ tap13 ^ (current << 16) ^ (tap13 << 15);
        const right = tap9 ^ (tap9 >>> 11);
        words[index] = left ^ right;
        const mix = words[index] ^ ((words[index] << 5) & polynomial);
        index = (index - 1) & 15;
        const previous = words[index];
        words[index] = previous ^ left ^ mix ^ (previous << 2) ^ (left << 18) ^ (right << 28);
        return (words[index] & 0x7fffffff) / 0x7fffffff;
    };
}

test("extended RNG keeps all 16 state words in range over repeated calls", () => {
    const rng = loadMaths();
    rng.random_set_seed(12345, true);
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 512; j++) rng.next();
        for (const word of rng.state) {
            assert.ok(word >= BigInt(0) && word <= BigInt(0xffffffff),
                "a state word exceeded 32 bits");
        }
    }
});

test("extended seeds repeat the unsigned 32-bit sequence for both polynomials", () => {
    const rng = loadMaths();
    for (const oldVersion of [false, true]) {
        rng.random_use_old_version(oldVersion);
        for (const seed of [0, 12345, -1, -2147483648, 2147483647]) {
            for (const secondArgument of [false, true]) {
                rng.random_set_seed(seed, secondArgument);
                assert.equal(rng.random_get_seed(), seed);
                const nextExpected = reference(seed, oldVersion ? 0xda442d20 : 0xda442d24);
                for (let i = 0; i < 1024; i++) {
                    assert.equal(rng.next(), nextExpected(), `seed ${seed}, draw ${i}`);
                }
            }
        }
    }
});

test("randomize and its alias select the extended mode; one-argument seeds still use legacy mode", () => {
    const rng = loadMaths();
    const seed = rng.randomize();
    assert.equal(rng.random_get_seed(), seed);
    assert.equal(rng.randomise(), seed);
    const nextExpected = reference(seed, 0xda442d24);
    for (let i = 0; i < 128; i++) assert.equal(rng.next(), nextExpected());

    rng.random_set_seed(12345);
    const legacyWords = [1715860630, 540338984, 34089729, 2053762291,
        1826726686, 179941711, 643335848, 1142551168];
    for (const word of legacyWords) assert.equal(rng.next(), word / 0x7fffffff);
});
