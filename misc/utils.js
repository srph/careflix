const path = require('path')
const fs = require('fs')

function last(arr) {
  return arr[arr.length - 1]
}

// Get dir/filename from path
// /home/srph/uploads/tarzan-x -> tarzan-x
exports.name = function name(file) {
  return last(file.split(path.sep))
}

// Naturally sort alphanumerical strings
// Without this, we'll get [ep1, ep10, ep2] instead of [ep1, ep2, ep10]
// https://stackoverflow.com/questions/2802341/javascript-natural-sort-of-alphanumerical-strings
exports.sort = function sort(files) {
  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  return files.sort(collator.compare)
}

// Remove trailing slashes
exports.untrail = function untrail(dir) {
  return dir.replace(/\/$/, '')
}

// Get all directories
// @source https://stackoverflow.com/a/24594123/2698227
exports.directories = function directories(path) {
  return fs.readdirSync(path, { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(d => d.name)
}