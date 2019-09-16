export interface OriginalTrack {
  index: string
  timestamp: string
  start: string
  end: string
  text: string
}

/**
 * @source https://github.com/radiovisual/srt-to-obj/blob/master/parse-srt.js
 */
function srt2object(srtData: string): OriginalTrack[] {
	const a = [];
	const normalizedSrtData = srtData.replace(/\r\n/g, '\n');
	const lines = normalizedSrtData.split('\n');
	const len = lines.length;

	let o = {
		text: ''
	} as any;

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

export default srt2object