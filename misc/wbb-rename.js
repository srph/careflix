const fs = require('fs')
const path = require('path')

// Running ---------------------
// node <wbb-rename.js> <directory>
// Initial file -----------------
// -e.bare.bears.s01e01.our.stuff
//
// Output ------------------------
// Renamed to: we-bare-bears-s1-e1
// Renamed to: we-bare-bears-s1-e2
// Renamed to: we-bare-bears-s1-e3
// Renamed to: we-bare-bears-s1-e4
// Renamed to: we-bare-bears-s1-e5
// Renamed to: we-bare-bears-s1-e6
// Renamed to: we-bare-bears-s1-e7
// Renamed to: we-bare-bears-s1-e8
// Renamed to: we-bare-bears-s1-e9
// Renamed to: we-bare-bears-s1-e10
// Renamed to: we-bare-bears-s1-e11
// Renamed to: we-bare-bears-s1-e12
// Renamed to: we-bare-bears-s1-e13
// Renamed to: we-bare-bears-s1-e14
// Renamed to: we-bare-bears-s1-e15
// Renamed to: we-bare-bears-s1-e16
// Renamed to: we-bare-bears-s1-e17
// Renamed to: we-bare-bears-s1-e18
// Renamed to: we-bare-bears-s1-e19
// Renamed to: we-bare-bears-s1-e20
// Renamed to: we-bare-bears-s1-e21
// Renamed to: we-bare-bears-s1-e22
// Renamed to: we-bare-bears-s1-e23
// Renamed to: we-bare-bears-s1-e24
// Renamed to: we-bare-bears-s1-e25
// Renamed to: we-bare-bears-s1-e26
const input = process.argv[2]
const files = fs.readdirSync(input)
files.forEach((file) => {
  const updated = file
    .replace(/\./g, '-')
    .replace(/^-e/, 'we')
    .replace('s01', 's1-')
    .replace('s1-e0', 's1-e')
    .replace(/s01-e[0-9]{1,2}/)
    .split('-')
    .slice(0, 5)
    .join('-')

  fs.renameSync(path.join(input, file), path.join(input, `./${updated}.mkv`))
  console.log('[Renamed] to:', updated)
})