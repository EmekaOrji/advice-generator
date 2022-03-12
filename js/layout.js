const searchBarBox = document.getElementById('searchBar');
const searchBar = document.getElementById('searchBarInput');

searchBar.addEventListener('focus', () => {
	searchBarBox.classList.add('search-bar_active');
});
searchBar.addEventListener('blur', () => {
	searchBarBox.classList.remove('search-bar_active');
});