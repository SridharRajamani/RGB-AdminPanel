const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_FILE = path.join(__dirname, 'staticTextIndex.json');
const JSX_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'button', 'li', 'a'];

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function extractTextFromJSX(file) {
  const content = fs.readFileSync(file, 'utf8');
  const results = [];
  // Simple regex to match <tag>Text</tag> (not perfect, but works for most static text)
  const regex = new RegExp(`<(${JSX_TAGS.join('|')})[^>]*>([^<>{}]+)<\/\\1>`, 'gi');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].trim();
    if (text && !/^[{}]/.test(text)) {
      results.push({
        text,
        file,
        index: match.index
      });
    }
  }
  return results;
}

function main() {
  const files = walk(SRC_DIR);
  let allText = [];
  files.forEach(file => {
    allText = allText.concat(extractTextFromJSX(file));
  });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allText, null, 2), 'utf8');
  console.log(`Extracted ${allText.length} static text entries to ${OUTPUT_FILE}`);
}

main(); 