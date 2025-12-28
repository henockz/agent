import assert from "node:assert";
import test from "node:test";

import { IntentAnalyzer } from "@services/IntentAnalyer.js";
test("analyzeIntent returns apparel for sweater intent", async () => {
    const analyzer = new IntentAnalyzer();      
    const result =  analyzer.analyze("I want to buy a sweater");
    assert.strictEqual(result, "apparel"); 
});

test("analyzeIntent returns vehicle for car ", async () => {
    const analyzer = new IntentAnalyzer();      
    const result = analyzer.analyze("I want to buy a car");
    assert.strictEqual(result, "vehicle"); 
});


test("analyzeIntent returns vehicle for audi ", async () => {
    const analyzer = new IntentAnalyzer();      
    const result = analyzer.analyze("I want to buy an audi");
    assert.strictEqual(result, "vehicle"); 
});

test("analyzeIntent returns food for pasta ", async () => {
    const analyzer = new IntentAnalyzer();      
    const result =  analyzer.analyze("I want to buy pasta");
    assert.strictEqual(result, "food"); 
});

test("analyzeIntent returns unknown for chair ", async () => {
    const analyzer = new IntentAnalyzer();      
    const result = analyzer.analyze("I want to buy a chair");
    assert.strictEqual(result, "unknown"); 
});

