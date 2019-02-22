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
			const boundaries = {
				base: letter === letter.toUpperCase() ? 65 : 97,
				ceil: letter === letter.toUpperCase() ? 90 : 122
			};
			// const boundaries = getBoundaries(charCode);
			if (charCode >= boundaries.base && charCode <= boundaries.ceil) {
				const newShift = (charCode + numShift - boundaries.base) % 26;
				return String.fromCharCode(boundaries.base + newShift);
			}
		})
		.join('');
	res.send(textArr);
});

// function getBoundaries(charCode) {
// 	let base;
// 	let ceil;
// 	if (charCode >= 65 && charCode <= 90) {
// 		base = 65;
// 		ceil = 90;
// 	}
// 	if (charCode >= 97 && charCode <= 122) {
// 		base = 97;
// 		ceil = 122;
// 	}
// 	return { base, ceil };
// }

app.get('/lotto', (req, res) => {
	const userNumbers = req.query.numbers.map(number => Number(number));
	const dupilcateNum = findDuplicates(userNumbers);
	const randomNumbers = makeRandomNumArr();
	if (userNumbers.length !== 6 || !userNumbers.every(isValidNumber))
		return res.status(400).send('Please only provide 6 numbers');
	if (dupilcateNum.length > 0)
		return res.status(400).send('Please provide 6 distinct numbers');
	const matchedNumbers = findMatchingNumbers(userNumbers, randomNumbers);
	switch (matchedNumbers.length) {
		case 4:
			res.send('Congratulations, you win a free ticket');
			break;
		case 5:
			res.send('Congratulations, you win a free ticket');
			break;
		case 6:
			res.send('Wow! Unbelievable! You could have won the mega millions!');
			break;
		default:
			res.send('Sorry, you lose');
			break;
	}
});

function isValidNumber(number) {
	return !isNaN(number);
}

function findMatchingNumbers(userArr, randomArr) {
	const arr = [];
	userArr.forEach(number => {
		if (randomArr.indexOf(number) !== -1) arr.push(number);
	});
	return arr;
}

function makeRandomNumArr() {
	const arr = [];
	while (arr.length < 6) {
		const number = makeRandomNumber0to20();
		if (arr.indexOf(number) === -1) arr.push(number);
	}
	return arr;
}

function makeRandomNumber0to20() {
	return Math.floor(Math.random() * 20);
}

function findDuplicates(arr) {
	return arr.filter((item, index) => arr.indexOf(item) != index);
}

app.listen(8000, () => {
	console.log('Listening on port 8000.');
});
