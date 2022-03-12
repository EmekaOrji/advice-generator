// ID: 152
const searchInput = document.getElementById('searchBarInput');
const searchButton = document.getElementById('searchIcon');
const idInput = document.getElementById('adviceId');
const buttons = document.getElementById('buttons');
const button = document.getElementById('newButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const adviceId = document.getElementById('adviceId');
const adviceBox = document.getElementById('adviceText');

function displayLoader() {
	adviceId.innerHTML = "<div id='loaderId'></div>";
	adviceBox.innerHTML = "<div id='loader'></div>";
}

function highlightText() {
	let searched = searchInput.value.trim();
	if (searched !== '') {
		let text = adviceBox.innerHTML;
		let reg = new RegExp(searched, 'gi'); // search for all instances
		let newText = text.replace(reg, (match) => `<span class="highlight">${match}</span>`);
		adviceBox.innerHTML = newText;
	}
}

async function generateRandomAdvice() {
	localStorage.clear();
	const url = 'https://api.adviceslip.com/advice';
	try {
		displayLoader();
		let response = await fetch(url);
		let rawAdvice = await response.json();
		if (response) {
			adviceId.innerHTML = rawAdvice.slip.id;
			adviceBox.innerHTML = rawAdvice.slip.advice;
		}
		return response;
	} catch (error) {
	}
}

async function generateAdviceBySearch(searchQuery) {
	localStorage.clear();
	if (searchQuery) {
		const url = `https://api.adviceslip.com/advice/search/${searchQuery}`;
		try {
			displayLoader();
			let response = await fetch(url);
			let rawAdvice = await response.json();
			if (rawAdvice.message && rawAdvice.message.text === 'No advice slips found matching that search term.') {
				adviceId.innerHTML = 0;
				adviceBox.innerHTML = '';
				const errorFlag = document.createElement('div');
				errorFlag.innerHTML = `${searchQuery} does not exist in any advice`;
				errorFlag.classList.add('error_flag');
				app.appendChild(errorFlag);
				setTimeout(() => {
					errorFlag.remove();
				}, 8000);
				return;
			}
			let adviceArray = rawAdvice.slips;
			let adviceAmount = rawAdvice.total_results;
			if (response) {
				let index = 0;
				renderSlip(index, adviceArray);
				highlightText();
				if (adviceAmount === '1') {
					buttons.classList.add('hide_buttons');
					return;
				}
				buttons.classList.remove('hide_buttons');
				leftButton.addEventListener('click', () => {
					if (index >= 1) {
						index--;
						renderSlip(index, adviceArray);
						highlightText();
					}
				});
				rightButton.addEventListener('click', () => {
					if (index < adviceArray.length - 1) {
						index++;
						renderSlip(index, adviceArray);
						highlightText();
					}
				});
			}
			rawAdvice = null;
		} catch (error) {
		}
		function renderSlip(index, adviceArray) {
			adviceId.innerHTML = adviceArray[index].id;
			adviceBox.innerHTML = adviceArray[index].advice;
		}
	}
}

async function generateAdviceById(id) {
	localStorage.clear();
	if (id) {
		const url = `https://api.adviceslip.com/advice/${id}`;
		try {
			displayLoader();
			let response = await fetch(url);
			let rawAdvice = await response.json();
			if (rawAdvice.message && rawAdvice.message.text === 'No advice slips found matching that id') {
				adviceId.innerHTML = 0;
				adviceBox.innerHTML = '';
				const errorFlag = document.createElement('div');
				errorFlag.innerHTML = `${id} does not exist in any advice`;
				errorFlag.classList.add('error_flag');
				app.appendChild(errorFlag);
				setTimeout(() => {
					errorFlag.remove();
				}, 8000);
				return;
			}
			if (response) {
				adviceId.innerHTML = rawAdvice.slip.id;
				adviceBox.innerHTML = rawAdvice.slip.advice;
			}
			rawAdvice = null;
		} catch (error) {
		}
	}
}

function handleSearch() {
	const searchQuery = searchInput.value;
	if (!searchQuery) {
		buttons.classList.add('hide_buttons');
		if (!generateRandomAdvice()) {
			generateRandomAdvice();
		}
		return;
	}
	generateAdviceBySearch(searchQuery);
}

function init() {
	generateRandomAdvice();
	button.addEventListener('click', () => {
		searchInput.value = '';
		buttons.classList.add('hide_buttons');
		generateRandomAdvice();
	});
}

init();

searchInput.addEventListener('input', (e) => {
	const searchQuery = searchInput.value;
	const newSearchQuery = searchQuery.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	searchInput.value = newSearchQuery;
});
searchButton.addEventListener('click', () => {
	handleSearch();
});
searchInput.addEventListener('keydown', (e) => {
	if (e.which === 13) handleSearch();
});
idInput.addEventListener('keydown', (e) => {
	if (e.which === 13) {
		e.preventDefault();
		const id = idInput.innerHTML;
		generateAdviceById(id);
	}
});
idInput.addEventListener('blur', (e) => {
	const id = idInput.innerHTML;
	generateAdviceById(id);
});