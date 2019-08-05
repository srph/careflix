export function last(arr) {
  return arr[arr.length - 1]
}

// Get dir/filename from path
// /home/srph/uploads/tarzan-x -> tarzan-x
export function name(file) {
  return last(file.split(path.sep))
}

// Naturally sort alphanumerical strings
// Without this, we'll get [ep1, ep10, ep2] instead of [ep1, ep2, ep10]
// https://stackoverflow.com/questions/2802341/javascript-natural-sort-of-alphanumerical-strings
export function sort(files) {
  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  return files.sort(collator.compare)
}

// Remove trailing slashes
export function untrail(path) {
  return path.replace(/\/$/, '')
}