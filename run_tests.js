// Node.js test runner - loads game files and runs tests headlessly
var fs = require("fs");

// Load data files
eval(fs.readFileSync("js/data/moves.js", "utf8"));
eval(fs.readFileSync("js/data/beasts.js", "utf8"));
eval(fs.readFileSync("js/data/maps.js", "utf8"));

// Stub localStorage
var localStorage = {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = v; },
    removeItem: function(k) { delete this._data[k]; }
};

// Load engines
eval(fs.readFileSync("js/engine/PlayerState.js", "utf8"));
eval(fs.readFileSync("js/engine/BattleEngine.js", "utf8"));

// Test runner
var _passed = 0, _failed = 0;

function suite(name, fn) {
    console.log("\n=== " + name + " ===");
    fn();
}

function test(name, fn) {
    try {
        fn();
        _passed++;
        console.log("  \u2713 " + name);
    } catch (e) {
        _failed++;
        console.log("  \u2717 " + name + ": " + e.message);
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || "Assertion failed");
}

function assertEqual(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error((msg || "assertEqual") + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
    }
}

function assertClose(actual, expected, tolerance, msg) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error((msg || "assertClose") + ": expected ~" + expected + " (±" + tolerance + "), got " + actual);
    }
}

function resetPlayerState() {
    PlayerState.name = "Trainer";
    PlayerState.team = [];
    PlayerState.inventory = { potions: 5, traps: 10 };
    PlayerState.position = { map: "town", x: 3, y: 5 };
    PlayerState.badges = [];
    PlayerState.defeatedTrainers = [];
    PlayerState.hasStarter = false;
}

// Extract and run test suites from tests.html
var html = fs.readFileSync("tests.html", "utf8");
// Extract content between the main <script> block
var match = html.match(/<script>\s*\n\s*\/\/ =+([\s\S]*?)\/\/ =+\s*\n\s*\/\/ Render Results/);
if (!match) {
    console.log("Could not extract test script from tests.html");
    process.exit(1);
}

var testCode = match[1];
// Remove the test runner definitions (we have our own)
testCode = testCode.replace(/\/\/ Minimal Test Runner[\s\S]*?function resetPlayerState\(\)[\s\S]*?\n\s*\}\n/, "");
// Remove _results references
testCode = testCode.replace(/_results \+= [^\n]+\n/g, "");
testCode = testCode.replace(/_currentSuite = [^\n]+\n/g, "");

eval(testCode);

// Summary
console.log("\n=============================");
console.log("TOTAL: " + _passed + " passed, " + _failed + " failed");
console.log("=============================");
process.exit(_failed > 0 ? 1 : 0);
