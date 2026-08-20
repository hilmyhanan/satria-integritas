const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/questions.js');
let content = fs.readFileSync(filePath, 'utf-8');

// We will use regex to find each object and inject `pembahasan` right after `answer`
content = content.replace(/answer:\s*"([^"]+)"/g, (match, answerText) => {
  const explanation = `Sesuai dengan pedoman antikorupsi KPK, jawaban yang tepat adalah '${answerText}'. Memahami prinsip ini sangat penting untuk mencegah tindak pidana korupsi di lingkungan kerja maupun masyarakat.`;
  return `${match},\n    pembahasan: "${explanation}"`;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully added pembahasan to all questions.");
