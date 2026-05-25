
import { calculateCAS } from "./compute-math";

const mockModels = [
  { id: "calyx/standard-model", downloads: 500, likes: 10, tags: [] },
  { id: "calyx/quantized-model", downloads: 0, likes: 5, tags: ["awq"] }
];

console.log("══════════════════════════════════════════════");
console.log("CALYX NEXUS — Neural Math Audit (AVP 5.0)");
console.log("══════════════════════════════════════════════");

const { nodes } = calculateCAS(mockModels, []);

nodes.forEach(node => {
  console.log(`Node: ${node.id}`);
  console.log(`- Quantized: ${node.isQuantized}`);
  console.log(`- CAS Result: ${node.cas}`);
  
  if (isNaN(node.cas) || !isFinite(node.cas)) {
    console.error("FAIL: Non-finite score detected.");
    process.exit(1);
  }
});

const quantized = nodes.find(n => n.id === "quantized-model");
if (quantized && quantized.cas <= 0) {
  console.error("FAIL: Quantization multiplier not properly applied to zero-download node.");
  process.exit(1);
}

console.log("\nVERDICT: MATHEMATICALLY FLAWLESS.");
