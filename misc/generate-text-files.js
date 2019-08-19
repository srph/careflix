const fs = require("fs");
const path = require("path");
const { untrail } = require("./utils");

// Running ---------------------
// node generate-text-files.js <directory>
// Example -----------------
// node generate-text-files.js /home/srph/uploads/
// Output ------------------------
// [Generate TXT File] [AnimeRg] Arrietty
// [Generate TXT File] [AnimeRg] My Neighbor Totoro
const input = untrail(process.argv[2]);
const ext = '.mp4'
const files = fs
  .readdirSync(input)
  .filter(file => path.extname(file) === ext);

files.forEach((file) => {
  const txt = path.join(input, `${file.replace(ext, '')}.txt`);
  fs.writeFileSync(txt, '')
  console.log(`[Generate TXT File] for ${file}`);
});
