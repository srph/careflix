// ---------------------
// @NOTE Never used hahahahaha
// ---------------------
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { name, untrail } = require('./utils')

// Running ---------------------
// node <extract-subs-series.js> <directory>
// Example -----------------
// node extract-subs-movies.js /home/srph/uploads/
// Output ------------------------
// [Extracted] Arrietty to Arrietty-en.srt
// [Extracted] Xyz to Xyz-en.srt
const input = untrail(process.argv[2])
const files = fs.readdirSync(input)

files.filter(file => path.extname(file) === '.mkv')
  .forEach((file, i) => {
    const updated = path.join(input, `${file.replace('.mkv', '')}-en.srt`)
    const full = path.join(input, file)
    execSync(`ffmpeg -i '${full}' '${updated}'`, { stdio: 'inherit' })
    console.log(`[Extracted Subtitle] ${name(full)} to ${name(updated)}`)
  })