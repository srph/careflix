const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { name } = require('./utils')

// Running ---------------------
// node <rename-movie.js> <directory>
// Example -----------------
// node rename-movie.js /home/srph/uploads/tarzan-x
// Output ------------------------
// [Extracted Subtitle] tarzan-x.mp4 to tarzan-x-en.mp4
const input = process.argv[2]
const file = fs.readdirSync(input)
  .find(file => path.extname(file) === '.mkv')
const dirname = name(input)

const updated = path.join(input, `${dirname}-en.srt`)
const full = path.join(input, file)
execSync(`ffmpeg -i '${full}' '${updated}'`, { stdio: 'inherit' })
console.log(`[Extracted Subtitle] ${name(full)} to ${name(updated)}`)