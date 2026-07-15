// Packs public/fav-{16,32,48}.png (created by `npm run icons` via sips)
// into public/favicon.ico as PNG-compressed ICO entries, then removes the
// intermediate files.
import { readFileSync, writeFileSync, rmSync } from "node:fs";

const sizes = [16, 32, 48];
const imgs = sizes.map((s) => readFileSync(`public/fav-${s}.png`));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);

let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s % 256, 0); // width
  e.writeUInt8(s % 256, 1); // height
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(imgs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += imgs[i].length;
  return e;
});

writeFileSync("public/favicon.ico", Buffer.concat([header, ...entries, ...imgs]));
sizes.forEach((s) => rmSync(`public/fav-${s}.png`));
console.log("public/favicon.ico written");
