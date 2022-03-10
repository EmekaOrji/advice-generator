// ID: 152

const url = 'https://api.adviceslip.com/advice';
const adviceId = document.getElementById('adviceId');
const adviceBox = document.getElementById('adviceText');

async function generateAdvice() {
	try {
		adviceBox.innerHTML = "<div id='loader'></div>";
		let response = await fetch(url);
		let rawAdvice = await response.json();
		if (response) {
			adviceId.innerHTML = rawAdvice.slip.id;
			adviceBox.innerHTML = rawAdvice.slip.advice;
		}
	} catch (error) {
		console.log(error);
	}
}

generateAdvice();
const button = document.getElementById('button');
button.addEventListener('click', generateAdvice);
