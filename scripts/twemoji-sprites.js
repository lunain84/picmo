const fs = require('fs');
const path = require('path');

const camelCase = require('camelcase');
const SVGSpriter = require('svg-sprite');

const compactEmojis = require('emojibase-data/en/compact.json');
const { groups } = require('emojibase-data/en/messages.json')

const nameMappings = {};

const categoryFiles = {};

const spriter = new SVGSpriter({
  mode: {
    inline: true,
    symbol: {
      dest: path.resolve(__dirname, '../src/renderers/twemoji/sprites')
    }
  },
  shape: {
    id: {
      generator: (name, file) => nameMappings[file.path]
    }
  }
});

function getTwemojiHexcode({ hexcode }, stripFe0f = false) {
  return hexcode
    .split('-')
    .filter(hex => !stripFe0f || hex !== 'FE0F')
    .map(hex => parseInt(hex, 16))
    .map(number => number.toString(16))
    .join('-');
}

function getPath(emoji) {
  const basePath = 'twemoji/assets/svg';
  const paths = [
    `${basePath}/${getTwemojiHexcode(emoji)}.svg`,
    `${basePath}/${getTwemojiHexcode(emoji, true)}.svg`,
  ]

  return paths.find(path => fs.existsSync(path));
}

function compile(spriter, category) {
  return new Promise((resolve, reject) => {
    spriter.compile({
      inline: true,
      symbol: {
        dest: path.resolve(__dirname, '../src/renderers/twemoji/sprites'),
        sprite: `twemoji-${category.key}.svg`,
      }
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function addEmoji(emoji) {
  const path = getPath(emoji);
    if (!path) {
      console.warn(`Skipping ${emoji.hexcode}: no svg found`);
    } else {
      nameMappings[path] = emoji.hexcode;
      spriter.add(path, null, fs.readFileSync(path));
      if (emoji.skins) {
        emoji.skins.forEach(skin => addEmoji(skin));
      }
    }
}

async function generateGroup(category) {
  const emojis = compactEmojis.filter(emoji => emoji.group === category.order);
  console.log(`Generating sprite sheet for: ${category.key} with ${emojis.length} emojis`);

  emojis.forEach(emoji => addEmoji(emoji));

  try { 
    const result = await compile(spriter, category);
    for (const mode in result) {
      for (const resource in result[mode]) {
        const outputPath = result[mode][resource].path;
        console.log(`Writing ${outputPath}`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, result[mode][resource].contents);
        categoryFiles[category.key] = result[mode][resource].basename;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function writeIndex() {
  const imports = [];
  const exportArray = [];

  Object.entries(categoryFiles).forEach(([category, file]) => {
    const categoryKey = camelCase(category);
    imports.push(`import ${categoryKey} from './${file}';`)
    exportArray.push(categoryKey);
  });
  
  const index = imports.join('\n') + '\n\n' + `export default [${exportArray.join(', ')}];`;

  console.log('Writing index');
  fs.writeFileSync(path.resolve(__dirname, '../src/renderers/twemoji/sprites/index.js'), index);
}

async function main() {
  console.log('*** Generating Twemoji sprite sheets ***');

  await Promise.all(groups.map(group => generateGroup(group)));
  writeIndex();
}

main();
