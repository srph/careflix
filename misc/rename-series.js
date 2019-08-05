const fs = require('fs')
const path = require('path')
const { name, sort, untrail } = require('./utils')

// Running ---------------------
// node <rename-series.js> <directory>
// Example -----------------
// node rename-series.js /home/srph/uploads/tarzan-x
// Output ------------------------
// [Renamed] Tarzan X 1.mp4 to tarzan-x-s1-ep1.mp4
const input = untrail(process.argv[2])
const files = fs.readdirSync(input)
const dirname = name(input)

sort(files.filter(file => path.extname(file) === '.mp4'))
  .forEach((file, i) => {
    const updated = path.join(input, `${dirname}-s1-ep${i + 1}.mp4`)
    const full = path.join(input, file)
    fs.renameSync(full, updated)
    console.log(`[Renamed] ${name(full)} to ${name(updated)}`)
  })