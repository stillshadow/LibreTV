import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'public', 'icons', 'icon.svg');
const outputs = [
  ['icon-48.png', 48],
  ['icon-96.png', 96],
  ['icon-144.png', 144],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of outputs) {
  await sharp(source, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public', 'icons', name));
}

// ICO 支持直接嵌入 PNG；使用 48px 版本作为浏览器标签页图标。
const png = await fs.readFile(path.join(root, 'public', 'icons', 'icon-48.png'));
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
await fs.writeFile(path.join(root, 'public', 'favicon.ico'), Buffer.concat([header, png]));
