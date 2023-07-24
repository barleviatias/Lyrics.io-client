let likedSongsId = [];
const numOfQuestions = 5;
let score = 0;
let reward = 1;
let timeLeft = 30; // Set the initial time in seconds
let timerInterval; // Variable to store the interval reference
let rnd;
let hints = 2;
let count = 0;
let quizeArr = [];
let flag = 0;
let bar;
let api = 'https://proj.ruppin.ac.il/cgroup18/test2/tar1/';
let currUser = JSON.parse(localStorage.getItem('user'));
function init() {
	checkDark();
	isMobileMode();
	let elFull = document.getElementById('full');
	elFull.addEventListener('click', () => {
		closeMenu();
	});

	elHellolbl = document.querySelector('.hello');
	if (currUser == null) {
		window.location.href = '/pages/welcome.html';
	} else {
		console.log(currUser);
		elHellolbl.innerText = 'Hello,' + currUser.firstName;
	}
	getSongs();
}
async function getSongs() {
	// closeMenu();
	showLoader();
	await getFavSongs();
	let api1 = api + 'api/Songs';
	ajaxCall(
		'GET',
		api1,
		null,
		(data) => {
			hideLoader();
			localStorage.setItem('songs', JSON.stringify(data));
			renderSongs(data);
		},
		(err) => {
			console.log(err);
		}
	);
}
async function getLikedSongs() {
	// closeMenu();
	await getFavSongs();
	console.log(likedSongsId);
	let lstLikedSongs = [];
	songs = JSON.parse(localStorage.getItem('songs'));
	console.log(songs);
	for (s of songs) {
		if (likedSongsId.includes(s.id)) {
			console.log('match');
			lstLikedSongs.push(s);
		}
	}
	renderSongs(lstLikedSongs);
	console.log(lstLikedSongs);
}
function renderSongs(data, showSearch = 0) {
	document.querySelector('.spotify-playlists').style.display = 'block';
	if (showSearch == 0) {
		document.querySelector('.search-div').innerHTML = '';
	}
	console.log(data);
	getFavSongs();
	hideLoader();
	strHTML = ``;
	const container = document.querySelector('.spotify-playlists'); // Replace 'container' with the ID of your container element
	// Clear the container
	document.querySelector('.videos').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	container.innerHTML = '';
	for (d of data) {
		const item = document.createElement('div');
		item.classList.add('item');
		// Create and append the artist element
		const artist = document.createElement('p');
		artist.innerText = d.artist.trim();
		// Add onclick function to artist element
		artist.id = d.artist.trim();
		artist.addEventListener('click', () => {
			renderArtist(artist.id);
		});
		item.appendChild(artist);

		// Create and append the song element
		const song = document.createElement('p');
		song.id = d.id;
		song.innerText = d.song.trim();
		song.addEventListener('click', () => {
			renderSong(song.id);
			Show();
		});
		item.appendChild(song);

		const addToFavoritesButton = document.createElement('button');
		addToFavoritesButton.className = d.id;
		addToFavoritesButton.classList.add = 'btn-fav';
		addToFavoritesButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
		if (likedSongsId.includes(d.id)) {
			addToFavoritesButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
			addToFavoritesButton.style.color = 'green';
		}
		addToFavoritesButton.addEventListener('click', () => {
			let userId = currUser.id;
			let songId = addToFavoritesButton.className;
			let InsertFAPI =
				api + 'api/Songs/InsertFsvorite/userId/' + userId + '/songId/' + songId;
			ajaxCall(
				'POST',
				InsertFAPI,
				null,
				(data) => {
					if (data == -1) {
						addToFavoritesButton.style.color = 'white';
						addToFavoritesButton.innerHTML =
							'<i class="fa-regular fa-heart"></i>';
						getFavSongs();
						let delAPI =
							api + 'api/Songs?userId=' + userId + '&songId=' + songId;
						ajaxCall(
							'DELETE',
							delAPI,
							null,
							(data) => {
								console.log(data);
							},
							(err) => {
								alert(err);
							}
						);
					} else {
						addToFavoritesButton.style.color = 'green';
						addToFavoritesButton.innerHTML =
							'<i class="fa-solid fa-heart"></i>';
					}
				},
				(err) => {
					alert(err);
				}
			);
		});
		item.appendChild(addToFavoritesButton);

		// Append the item to the container
		container.appendChild(item);
	}
}

function renderArtist(name) {
	showLoader();
	let image_url = '../img/user.png';
	const apiUrl =
		'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' +
		name +
		'&api_key=0cf192ec4e9d4768370298d196df5ff2&format=json';
	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			hideLoader();
			console.log(data.artist);
			const container = document.querySelector('.spotify-playlists');
			container.innerHTML = '';
			artistData = data.artist;
			console.log(artistData.name);
			if (artistData.mbid) {
				const url =
					'https://musicbrainz.org/ws/2/artist/' +
					artistData.mbid +
					'?inc=url-rels&fmt=json';
				console.log(url);
				fetch(url)
					.then((res) => res.json())
					.then((out) => {
						const relations = out.relations;
						//  console.table(relations);
						// Find image relation
						for (let i = 0; i < relations.length; i++) {
							if (relations[i].type === 'image') {
								image_url = relations[i].url.resource;
								if (
									image_url.startsWith(
										'https://commons.wikimedia.org/wiki/File:'
									)
								) {
									const filename = image_url.substring(
										image_url.lastIndexOf('/') + 1
									);
									image_url =
										'https://commons.wikimedia.org/wiki/Special:Redirect/file/' +
										filename;
								}
							}
						}
						console.log(image_url);
						var artistImg = document.createElement('img');
						artistImg.src = image_url;
						artistImg.className = 'artist-img';
						artistInfoDiv.insertBefore(artistImg, artistInfoDiv.firstChild);
					})
					.catch((err) => {
						throw console.log(err);
					});
			}
			// Create the artist information div
			var artistInfoDiv = document.createElement('div');
			artistInfoDiv.classList.add('artist-info');

			// Render the artist name
			var artistNameHeading = document.createElement('h2');
			artistNameHeading.textContent = artistData.name;
			artistInfoDiv.appendChild(artistNameHeading);
			var bioTitle = document.createElement('p');
			bioTitle.textContent = 'Summary';
			artistInfoDiv.appendChild(bioTitle);
			// Render the bio
			var bioParagraph = document.createElement('p');
			bioParagraph.innerHTML = artistData.bio.content;
			artistInfoDiv.appendChild(bioParagraph);

			// Render the statistics
			var statsHeading = document.createElement('h3');
			statsHeading.textContent = 'Statistics';
			artistInfoDiv.appendChild(statsHeading);

			var statsParagraph = document.createElement('p');
			statsParagraph.innerHTML =
				'Listeners: ' +
				artistData.stats.listeners +
				'<br>' +
				'Playcount: ' +
				artistData.stats.playcount;
			artistInfoDiv.appendChild(statsParagraph);

			// Render the URL
			var urlLink = document.createElement('a');
			urlLink.href = artistData.url;
			urlLink.textContent = 'Visit Last.fm page';
			artistInfoDiv.appendChild(urlLink);

			// Render the URL
			var urlLink = document.createElement('q');
			urlLink.href = artistData.url;
			urlLink.textContent = 'Visit Last.fm page';
			artistInfoDiv.appendChild(urlLink);

			// Append the artist information div to the container
			container.appendChild(artistInfoDiv);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}
function renderSong(songId) {
	showLoader();
	songs = JSON.parse(localStorage.getItem('songs'));
	const container = document.querySelector('.spotify-playlists');
	document.querySelector('.videos').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	container.innerHTML = '';
	for (s of songs) {
		if (s.id == songId) {
			// Create the artist information div
			var artistInfoDiv = document.createElement('div');
			artistInfoDiv.classList.add('artist-info');

			var bioTitle = document.createElement('h2');
			searchSong(s.song, s.artist);
			bioTitle.textContent = s.song;
			artistInfoDiv.appendChild(bioTitle);
			// Render the artist name
			var artistNameHeading = document.createElement('h3');
			artistNameHeading.textContent = s.artist;
			artistInfoDiv.appendChild(artistNameHeading);

			// Render the bio
			var bioParagraph = document.createElement('p');
			bioParagraph.textContent = s.lyrics;
			artistInfoDiv.appendChild(bioParagraph);
		}
	}
	container.appendChild(artistInfoDiv);
	hideLoader();
}

function showLoader() {
	const loader = document.getElementById('loader');
	loader.style.display = 'block';
}

function hideLoader() {
	const loader = document.getElementById('loader');
	loader.style.display = 'none';
}

function getFavSongs() {
	return new Promise((resolve, reject) => {
		let currUser = JSON.parse(localStorage.getItem('user'));
		let api3 = api + 'api/Songs/GetFavByID?userId=' + currUser.id;

		ajaxCall(
			'GET',
			api3,
			null,
			(data) => {
				console.log(data);
				likedSongsId = data;
				resolve(data);
			},
			(err) => {
				reject(err);
			}
		);
	});
}

function logout() {
	window.location.href = '/pages/welcome.html';
	localStorage.removeItem('user');
}
function OpenSearch() {
	document.querySelector('.spotify-playlists').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	document.querySelector('.videos').style.display = 'none';
	let searchDiv = document.querySelector('.search-div'); // Replace 'container' with the ID of your container element
	// Clear the container
	console.log(searchDiv);
	searchDiv.innerHTML = '';
	const searchContainer = document.createElement('div');
	const searchInput = document.createElement('input');
	const searchTypeSelect = document.createElement('select');
	const searchButton = document.createElement('button');
	const searchResults = document.createElement('div');

	searchContainer.setAttribute('id', 'search-container');

	searchInput.setAttribute('type', 'text');
	searchInput.setAttribute('id', 'search-input');
	searchInput.setAttribute('placeholder', 'Enter search term');

	searchTypeSelect.setAttribute('id', 'search-type');
	searchTypeSelect.innerHTML = `
    <option value="name">Song Name</option>
    <option value="artist">Artist</option>
    <option value="lyrics">Lyrics</option>
  `;

	searchButton.setAttribute('id', 'search-button');
	searchButton.textContent = 'Search';
	searchButton.onclick = Search;

	searchContainer.appendChild(searchInput);
	searchContainer.appendChild(searchTypeSelect);
	searchContainer.appendChild(searchButton);
	searchDiv.appendChild(searchContainer);
}
function Search() {
	let val = document.getElementById('search-input').value;
	if (val == '') {
		alert('Please Insert Search key');
		return;
	}
	let type =
		document.getElementById('search-type').options[
			document.getElementById('search-type').selectedIndex
		].innerHTML;
	if (type == 'Song Name') {
		let nameApi = api + 'api/Songs/GetBySongName/song/' + val;
		ajaxCall(
			'GET',
			nameApi,
			null,
			(data) => {
				console.log(data);
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
	if (type == 'Artist') {
		let artistApi = api + 'api/Songs/GetSongsByARTIST/artist/' + val;
		ajaxCall(
			'GET',
			artistApi,
			null,
			(data) => {
				console.log(data);
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
	if (type == 'Lyrics') {
		let lyricsApi = api + 'api/Songs/GetBySongLyrics/lyrics/' + val;
		ajaxCall(
			'GET',
			lyricsApi,
			null,
			(data) => {
				console.log(data);
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
}

function HideAll() {
	document.querySelector('.spotify-playlists').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	document.querySelector('.search-div').style.display = 'none';
	document.querySelector('.videos').style.display = 'none';
}

function Show() {
	var data = {
		url: 'https://audd.tech/example.mp3',
		return: 'apple_music,spotify',
		api_token: 'test',
	};

	$.getJSON('https://api.audd.io/?jsonp=?', data, function (result) {
		console.log(result);
	});
}

function searchSong(songName, artist) {
	const apiKey = 'AIzaSyDp9sFEyhoz0XNo1iKtnGPiipf7TdRhH7g';
	console.log(artist.trim() + '-' + songName);
	fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
			artist.trim() + '-' + songName
		)}&type=video&key=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.items.length > 0) {
				const videoId = data.items[0].id.videoId;
				console.log(videoId);
				const link = `https://www.youtube.com/watch?v=${videoId}`;
				console.log(link);
				playVideo(videoId); // You can do whatever you want with the link here
			} else {
				console.log('No videos found for the given song name.');
			}
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}
function playVideo(videoId) {
	if (videoId) {
		const playerDiv = document.querySelector('.videos');
		playerDiv.style.display = 'block';
		playerDiv.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
	} else {
		console.error('Invalid YouTube URL.');
	}
}

function extractVideoId(url) {
	const match = url.match(
		/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)/
	);
	return match ? match[1] : null;
}

function Search() {
	let val = document.getElementById('search-input').value;
	if (val == '') {
		alert('Please Insert Search key');
		return;
	}
	let type =
		document.getElementById('search-type').options[
			document.getElementById('search-type').selectedIndex
		].innerHTML;
	if (type == 'Song Name') {
		let nameApi = api + 'api/Songs/GetBySongName/song/' + val;
		ajaxCall(
			'GET',
			nameApi,
			null,
			(data) => {
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
	if (type == 'Artist') {
		let artistApi = api + 'api/Songs/GetSongsByARTIST/artist/' + val;
		ajaxCall(
			'GET',
			artistApi,
			null,
			(data) => {
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
	if (type == 'Lyrics') {
		let lyricsApi = api + 'api/Songs/GetBySongLyrics/lyrics/' + val;
		ajaxCall(
			'GET',
			lyricsApi,
			null,
			(data) => {
				renderSongs(data, 1);
			},
			(err) => {
				alert(err);
			}
		);
	}
}
function quizeArtist() {
	quizeArr = [];
	let arrGame = JSON.parse(localStorage.getItem('songs'));
	for (let i = 0; i < numOfQuestions; i++) {
		rnd = Math.floor(Math.random() * arrGame.length);
		let opt = [];
		let question = {
			q: 'what song belong to ' + arrGame[rnd].artist,
			a: arrGame[rnd].song,
			options: [],
		};
		for (let j = 0; j < 4; j++) {
			opt.push(arrGame[rnd].song);
			arrGame.splice(rnd, 1);
			rnd = Math.floor(Math.random() * arrGame.length);
		}
		question.options = shuffle(opt);
		quizeArr.push(question);
	}
	renderQuestion(quizeArr.pop());
}
function quizeSongs() {
	quizeArr = [];
	let arrGame = JSON.parse(localStorage.getItem('songs'));
	for (let i = 0; i < numOfQuestions; i++) {
		rnd = Math.floor(Math.random() * arrGame.length);
		let opt = [];
		let question = {
			q: 'which artist sing this song? \n ' + '"' + arrGame[rnd].song + '"',
			a: arrGame[rnd].artist,
			options: [],
		};
		for (let j = 0; j < 4; j++) {
			opt.push(arrGame[rnd].artist);
			arrGame.splice(rnd, 1);
			rnd = Math.floor(Math.random() * arrGame.length);
		}
		question.options = shuffle(opt);
		quizeArr.push(question);
	}
	renderQuestion(quizeArr.pop());
}
function startGame() {
	clearInterval(timerInterval);
	let elcontainer = document.querySelector('.spotify-playlists');
	document.querySelector('.quize-div').style.display = 'block';
	elcontainer.innerHTML = '';
	let container = document.querySelector('.question');
	container.innerHTML = '';
	score = 0;
	count = 0;
	hints = 2;

	let lblHello = document.createElement('h2');
	lblHello.innerText = 'Hello ' + currUser.firstName + ' lets challenge';
	let btnSongs = document.createElement('button');
	btnSongs.innerText = 'Songs Quize';
	btnSongs.addEventListener('click', () => {
		quizeSongs();
	});
	let btnArtitst = document.createElement('button');
	btnArtitst.innerText = 'Artist Quize';
	btnArtitst.addEventListener('click', () => {
		quizeArtist();
	});
	container.appendChild(lblHello);
	container.appendChild(btnArtitst);
	container.appendChild(btnSongs);

	difficultyOptions = ['Easy', 'Medium', 'Hard'];
	difficultyOptions.forEach((option, index) => {
		const label = document.createElement('label');
		label.innerHTML = `<input type="radio" name="difficulty" value="${option}" ${
			index === 0 ? 'checked' : ''
		} onchange="handleDifficultyChange()" /> ${option}`;
		container.appendChild(label);
		container.appendChild(document.createElement('br'));
	});
}
function handleDifficultyChange() {
	const selectedOption = document.querySelector(
		'input[name="difficulty"]:checked'
	).value;

	switch (selectedOption) {
		case 'Easy':
			// Code for Easy difficulty
			reward = 1;
			timeLeft = 30;
			console.log('Easy difficulty selected!');
			break;
		case 'Medium':
			reward = 2;
			timeLeft = 15;
			// Code for Medium difficulty
			console.log('Medium difficulty selected!');
			break;
		case 'Hard':
			reward = 4;
			timeLeft = 10;
			// Code for Hard difficulty
			console.log('Hard difficulty selected!');
			break;
		default:
			// Code for default case (if no option is selected)
			console.log('Please select a difficulty!');
	}
}
function renderQuestion(q) {
	if (quizeArr.length != 0) {
		elScore = document.querySelector('.score');
		elQuestion = document.querySelector('.question');
		elQuestion.innerHTML = '';
		var timerDiv = document.createElement('div');
		timerDiv.className = 'timer-div';
		var timerlbl = document.createElement('p');
		timerlbl.className = 'timer';
		timerDiv.appendChild(timerlbl);
		elQuestion.appendChild(timerDiv);
		var question = document.createElement('h2');
		question.innerText = q.q;
		elQuestion.appendChild(question);
		for (let i = 0; i < q.options.length; i++) {
			const btnOpt = document.createElement('button');
			btnOpt.innerText = q.options[i];
			btnOpt.className = 'option';
			btnOpt.id = q.options[i];
			btnOpt.addEventListener('click', () => {
				clearInterval(timerInterval);
				checkAns(btnOpt.id, q);
			});
			elQuestion.appendChild(btnOpt);
		}
		if (hints > 0) {
			var hintBtn = document.createElement('button');
			hintBtn.className = 'btn-hint';
			hintBtn.innerText = 'Get Hint';
			// hintBtn.onclick=getHint();
			hintBtn.addEventListener('click', () => {
				getHint(q);
			});
			elQuestion.appendChild(hintBtn);
		}
		elScore.innerText = 'score:' + score;
		startTimer();
	} else {
		quizeEnd();
	}
}

async function checkAns(ans, q) {
	let elLbl = document.querySelector('.lbl-message');
	elBtn = document.getElementById(ans);
	if (ans == q.a) {
		score += 10 *reward* timeLeft;
		count++;
		elBtn.className = 'correct';
	} else {
		elBtn.className = 'wrong';
	}
	elOpt = document.querySelectorAll('.option');
	for (let i = 0; i < elOpt.length; i++) {
		elOpt[i].disabled = true;
	}
	await sleep(1 * 1000);
	renderQuestion(quizeArr.pop());
}
function quizeEnd() {
	elQuestion = document.querySelector('.question');
	elQuestion.innerHTML = '';
	strHTML = `Your Result is:`;
	var elDiv = document.createElement('div');
	elDiv.className = 'result';
	for (let i = 0; i < count; i++) {
		strHTML += '<i class="star fa fa-star" aria-hidden="true"></i>';
	}
	for (let i = 0; i < numOfQuestions - count; i++) {
		strHTML += '<i class="star-f fa fa-star" aria-hidden="true"></i>';
	}
	InsertScore();
	elDiv.innerHTML = strHTML;
	elQuestion.appendChild(elDiv);
}
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick q remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function startTimer() {
	// timeLeft = 30; // Reset the timer to 10 seconds
	updateTimerDisplay();

	// Start the timer interval
	timerInterval = setInterval(function () {
		timeLeft -= 1;
		updateTimerDisplay();

		// Check if the timer has reached 0
		if (timeLeft <= 0) {
			clearInterval(timerInterval); // Clear the interval when time is up

			renderQuestion(quizeArr.pop());
			// handleTimeUp();
		}
	}, 1000);
}

function updateTimerDisplay() {
	const timerDiv = document.querySelector('.timer');
	if (timerDiv) {
		timerDiv.innerText = `${timeLeft}`;
	}
}

function getHint(q) {
	hints--;
	elQuestion = document.querySelector('.question');
	elQuestion.innerHTML = '';
	hintQ = q.options;
	while (hintQ.length > 2) {
		temp = hintQ.pop();
		if (temp == q.a) {
			hintQ.unshift(temp);
		}
	}
	hintQ = shuffle(hintQ);
	var timerDiv = document.createElement('div');
	timerDiv.className = 'timer-div';
	var timerlbl = document.createElement('p');
	timerlbl.className = 'timer';
	timerDiv.appendChild(timerlbl);
	elQuestion.appendChild(timerDiv);
	var question = document.createElement('h2');
	question.innerText = q.q;
	elQuestion.appendChild(question);
	for (let j = 0; j < hintQ.length; j++) {
		const btnOp = document.createElement('button');
		btnOp.innerText = hintQ[j];
		btnOp.className = 'option';
		btnOp.id = hintQ[j];
		btnOp.addEventListener('click', () => {
			clearInterval(timerInterval);
			checkAns(btnOp.id, q);
		});
		elQuestion.appendChild(btnOp);
	}
}
function InsertScore() {
	let curUser = JSON.parse(localStorage.getItem('user'));
	let InsertScoreAPI =
		api + 'api/Users/InsertScore/userId/' + curUser.id + '/score/' + score;
	ajaxCall(
		'POST',
		InsertScoreAPI,
		null,
		(data) => {},
		(err) => {
			alert(err);
		}
	);
}
function GetScore() {
	let curUser = JSON.parse(localStorage.getItem('user'));
	let GetScoreAPI = api + 'api/Users/GetAllScores';
	ajaxCall(
		'GET',
		GetScoreAPI,
		null,
		(data) => {
			for (let d in data) {
				if (data[d][0] == curUser.id) {
					return;
				}
			}
		},
		(err) => {
			alert(err);
		}
	);
}
function openMenu() {
	elMenu = document.querySelector('.sidebar');
	elMenu.style.display = 'block';
	elFull = document.getElementById('full');
	elFull.style.display = 'block';

	// elBody=document.querySelector('body');
	// elBody.addEventListener('click', () => {
	// 	event.stopPropagation();
	// 	closeMenu();
	// });
}
function closeMenu() {
	elMenu = document.querySelector('.sidebar');
	elMenu.style.display = 'none';
	elFull = document.getElementById('full');
	elFull.style.display = 'none';
}

function checkDark() {
	let isDark = localStorage.getItem('isDark');
	var img = document.querySelector('.logoImg');
	const theme = document.querySelector('#theme-link');
	let chk = document.querySelector('.checkbox');
	if (isDark == 'false') {
		img.src = '../img/1.png';
		theme.href = '../Styles/main-light.css';
		chk.checked = true;
	} else {
		chk.checked = false;
	}
}
function toggleDarkMode() {
	var img = document.querySelector('.logoImg');
	const theme = document.querySelector('#theme-link');
	// Swap out the URL for the different stylesheets
	if (theme.getAttribute('href') == '../Styles/main-light.css') {
		localStorage.setItem('isDark', true);
		img.src = '../img/2.png';
		theme.href = '../Styles/main.css';
	} else {
		localStorage.setItem('isDark', false);
		console.log('dark');
		img.src = '../img/1.png';
		theme.href = '../Styles/main-light.css';
	}
}

// Function to check if the device is in mobile mode
function isMobileMode() {
	// Define the media query for mobile devices
	const mobileQuery = window.matchMedia('(max-width: 767px)');

	// Check if the media query matches (i.e., the device is in mobile mode)
	if (mobileQuery.matches) {
		return true;
	} else {
		return false;
	}
}

// Usage example
if (isMobileMode()) {
	console.log('You are in mobile mode.');
} else {
	// elMenu = document.querySelector('.sidebar');
	// elMenu.style.display = 'block';
	console.log('You are not in mobile mode.');
}
