const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/sum', (req, res) => {
	const { a, b } = req.query;
	if (!a || !b) return res.status(400).send('Please provide two numbers');
	const sum = Number(a) + Number(b);
	res.send(`The sum of ${a} and ${b} is ${sum}`);
});

//A-Z: 65-90, a-z: 97-122
// text=Z&shift=10 should = 75
app.get('/cipher', (req, res) => {
	const { text, shift } = req.query;
	const numShift = Number(shift);
	if (!text) return res.status(400).send('Please provide a word');
	if (!shift) return res.status(400).send('Please provide a number');
	const textArr = text
		.split('')
		.map(letter => {
			const charCode = letter.charCodeAt(0);
			// const boundaries = {
			// 	base: letter === letter.toUpperCase() ? 65 : 97,
			// 	ceil: letter === letter.toUpperCase() ? 90 : 122
			// };
			const boundaries = getBoundaries(charCode);
			if (charCode >= boundaries.base && charCode <= boundaries.ceil) {
				const newShift = (charCode + numShift - boundaries.base) % 26;
				return String.fromCharCode(boundaries.base + newShift);
			}
		})
		.join('');
	res.send(textArr);
});

function getBoundaries(charCode) {
	let base;
	let ceil;
	if (charCode >= 65 && charCode <= 90) {
		base = 65;
		ceil = 90;
	}
	if (charCode >= 97 && charCode <= 122) {
		base = 97;
		ceil = 122;
	}
	return { base, ceil };
}

// app.get('/lotto', (req, res)=>{

// })

app.listen(8000, () => {
	console.log('Listening on port 8000.');
});
