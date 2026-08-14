// Generates dependency-free PNG icons. Run with: node tools/generate-icons.js
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const size = Buffer.alloc(4); size.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([size, name, data, checksum]);
}

function icon(size) {
  const rows = [];
  const scale = size / 128;
  const inside = (x, y, left, top, right, bottom) => x >= left * scale && x < right * scale && y >= top * scale && y < bottom * scale;
  for (let y = 0; y < size; y += 1) {
    const row = Buffer.alloc(1 + size * 4); row[0] = 0;
    for (let x = 0; x < size; x += 1) {
      let color = [255, 107, 53, 255];
      const border = x < 6 * scale || y < 6 * scale || x >= size - 6 * scale || y >= size - 6 * scale;
      if (border) color = [23, 26, 24, 255];
      if (inside(x, y, 28, 35, 39, 91) || inside(x, y, 28, 81, 58, 92)) color = [23, 26, 24, 255];
      if (inside(x, y, 64, 35, 75, 92)) color = [23, 26, 24, 255];
      if (inside(x, y, 87, 35, 99, 73) || inside(x, y, 87, 82, 99, 93)) color = [255, 248, 232, 255];
      row.set(color, 1 + x * 4);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))), chunk("IEND", Buffer.alloc(0))
  ]);
}

for (const size of [16, 32, 48, 128]) {
  fs.writeFileSync(path.join(__dirname, "..", "icons", `icon${size}.png`), icon(size));
}
