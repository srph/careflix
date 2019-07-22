const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Running ---------------------
// node <extract-subs-series.js> <directory>
// Example -----------------
// node extract-srt-series.js /home/srph/uploads/kimetsu-no-yaiba
// Output ------------------------
// [Extracted] kimetsu-no-yaiba-1.mkv to kimetsu-no-yaiba-1.srt
// [Extracted] kimetsu-no-yaiba-2.mkv to kimetsu-no-yaiba-2.srt
const input = process.argv[2]
const files = fs.readdirSync(input)
const dirname = name(input)

files.filter(file => path.extname(file) === '.mkv')
  .sort()
  .forEach((file, i) => {
    const updated = path.join(input, `${dirname}-s1-ep${i + 1}.srt`)
    const full = path.join(input, file)
    execSync(`ffmpeg -i '${full}' '${updated}'`, { stdio: 'inherit' })
    console.log(`[Extracted] ${name(full)} to ${name(updated)}`)
  })

function last(arr) {
  return arr[arr.length - 1]
}

function name(file) {
  return last(file.split(path.sep))
}