const fs = require('fs');
const text = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\b7250967-5945-4fff-aeab-70508f451684\\.system_generated\\logs\\overview.txt', 'utf8');
const match = text.match(/export const CustomHeaderNode[\s\S]*?export const CustomTechStackNode/);
if (match) {
  const code = match[0].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  fs.writeFileSync('temp.txt', code);
}
