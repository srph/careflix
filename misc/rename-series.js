const fs = require('fs')
const path = require('path')

// Running ---------------------
// node <rename-series.js> <directory>
// Example -----------------
// node rename-series.js /home/srph/uploads/tarzan-x
// Output ------------------------
// [Renamed] Tarzan X 1.mp4 to tarzan-x-s1-ep1.mp4
const input = process.argv[2]
const files = fs.readdirSync(input)
const dirname = name(input)

files.filter(file => path.extname(file) === '.mp4')
  .sort()
  .forEach((file, i) => {
    const updated = path.join(input, `${dirname}-s1-ep${i + 1}.mp4`)
    const full = path.join(input, file)
    fs.renameSync(full, updated)
    console.log(`[Renamed] ${name(full)} to ${name(updated)}`)
  })

function last(arr) {
  return arr[arr.length - 1]
}

function name(file) {
  return last(file.split(path.sep))
}