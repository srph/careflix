const fs = require('fs')

// Running ---------------------
// node <rename-series.js> <directory>
// Example -----------------
// node rename-series.js /home/srph/uploads/tarzan-x
// Output ------------------------
// [Renamed] Tarzan X 1.mp4 to tarzan-x-s1-ep1.mp4
const input = process.argv[2]
const sub = fs.readFileSync(input, 'utf-8')

srt2obj(sub)

/**
 * Get the number of seconds from readable time (01:03:20,200 -> 3800)
 */
function fromReadableTime(time) {
  const [hour, minute, seconds] = time.split(',')[0].split(':')

  return (
    (Number(hour) * 60 * 60) +
    (Number(minute) * 60) +
    Number(seconds)
  )
}

/**
 * Transforms the return type of srt-to-obj
 * 
 * { start: '00:00:03,300' } -> { start: 3 }
 * { end: '00:00:04,000' } -> { end: 4 }
 */
function srt2obj(str) {
  const result = originalSrt2Obj(str)

  return result.map((track) => {
    console.log(track)
    return {
      ...track,
      start: fromReadableTime(track.start),
      end: fromReadableTime(track.end)
    }
  })
}

function originalSrt2Obj (srtData) {
	const a = [];
	const normalizedSrtData = srtData.replace(/\r\n/g, '\n');
	const lines = normalizedSrtData.split('\n');
	const len = lines.length;

	let o = {
		text: ''
	};

	for (let i = 0; i < len; i++) {
		const line = lines[i].trim();
		let times;
		let lineBreak = '\n';

		if (typeof parseInt(line, 10) === 'number' && (i === 0 || lines[i - 1] === '')) {
			// we found an index
			o.index = line;
		} else if (line.indexOf(' --> ') > -1) {
			// we found a timestamp
			o.timestamp = line;
			times = line.split(' --> ');
			o.start = times[0];
			o.end = times[1];
		} else if (line === '') {
			// we found an empty string, so push o and reset everything
			a.push(o);
			o = {text: ''};
		} else {
			// we must have text to enter since it's not an index, timestamp or empty string.
			// don't add `\n` to the end of the last line of text
			if (lines[i + 1] === '') {
				lineBreak = '';
			}
			o.text += line + lineBreak;
		}
	}
	return a;
};