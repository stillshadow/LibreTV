import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'public', 'icons', 'icon.svg');
const outputs = [
  ['icon-tv-48.png', 48],
  ['icon-tv-96.png', 96],
  ['icon-tv-144.png', 144],
  ['icon-tv-192.png', 192],
  ['icon-tv-512.png', 512],
  ['apple-touch-icon-tv.png', 180],
];

for (const [name, size] of outputs) {
  await sharp(source, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public', 'icons', name));
}

// ICO 支持直接嵌入 PNG；使用 48px 版本作为浏览器标签页图标。
const png = await fs.readFile(path.join(root, 'public', 'icons', 'icon-tv-48.png'));
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6);
header.writeUInt8(48, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await fs.writeFile(path.join(root, 'public', 'favicon-tv.ico'), Buffer.concat([header, png]));
