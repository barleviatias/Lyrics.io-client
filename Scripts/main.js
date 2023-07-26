let likedSongsId = [];
const numOfQuestions = 6;
let arrAns = [];
let top3 = [];
let score = 0;
let reward = 1;
let time = 30; // Set the initial time in seconds
let timerInterval; // Variable to store the interval reference
let rnd;
let hints = 3;
let count = 0;
let quizeArr = [];
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
		window.location.href = 'welcome.html';
	} else {
		elHellolbl.innerText = 'Hello,' + currUser.firstName;
	}

	getSongs();

	getUsers();
	GetScore();
}
async function getSongs() {
	showLoader();
	await getFavSongs();
	let api1 = api + 'api/Songs';
	//check if songs alredy loaded
	if (localStorage.getItem('songs') == null) {
		console.log("empty songs");
		ajaxCall(
			'GET',
			api1,
			null,
			(data) => {
				localStorage.setItem('songs', JSON.stringify(data));
				hideLoader();
				renderSongs(data);
			},
			(err) => {
				console.log(err);
			}
		);
	} else {
		console.log(" songs from local");
		hideLoader();
		renderSongs(JSON.parse(localStorage.getItem('songs')));
	}
}
async function getLikedSongs() {
	await getFavSongs();
	let lstLikedSongs = [];
	songs = JSON.parse(localStorage.getItem('songs'));
	for (s of songs) {
		if (likedSongsId.includes(s.id)) {
			console.log('match');
			lstLikedSongs.push(s);
		}
	}
	renderSongs(lstLikedSongs);
}
function renderSongs(data, showSearch = 0) {
	document.querySelector('.spotify-playlists').style.display = 'block';
	if (showSearch == 0) {
		document.querySelector('.search-div').innerHTML = '';
	}
	getFavSongs();
	hideLoader();
	strHTML = ``;
	const container = document.querySelector('.spotify-playlists'); 
	document.querySelector('.videos').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	container.innerHTML = '';
	for (d of data) {
		const item = document.createElement('div');
		item.classList.add('item');
		const artist = document.createElement('p');
		artist.innerText = d.artist.trim();
		artist.id = d.artist.trim();
		artist.className='artist-h';
		artist.addEventListener('click', () => {
			renderArtist(artist.id);
		});
		item.appendChild(artist);

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
		addToFavoritesButton.innerHTML = '<i class="empty fa-regular fa-heart"></i>';
		if (likedSongsId.includes(d.id)) {
			addToFavoritesButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
			addToFavoritesButton.style.color = 'green';
		}
		//add button like and onclick function
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

		container.appendChild(item);
	}
}

function getUsers() {
	let getUsersAPI = api + 'api/Users';
	ajaxCall(
		'GET',
		getUsersAPI,
		null,
		(data) => {
			users = data;
		},
		(err) => {
			alert(err);
		}
	);
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
			const container = document.querySelector('.spotify-playlists');
			container.innerHTML = '';
			artistData = data.artist;
			if (artistData.mbid) {
				const url =
					'https://musicbrainz.org/ws/2/artist/' +
					artistData.mbid +
					'?inc=url-rels&fmt=json';
				fetch(url)
					.then((res) => res.json())
					.then((out) => {
						const relations = out.relations;
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
	window.location.href = 'welcome.html';
	localStorage.removeItem('user');
}
function OpenSearch() {
	document.querySelector('.spotify-playlists').style.display = 'none';
	document.querySelector('.quize-div').style.display = 'none';
	document.querySelector('.videos').style.display = 'none';
	let searchDiv = document.querySelector('.search-div'); // Replace 'container' with the ID of your container element
	// Clear the container
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
			if (data.items.length > 0) {
				const videoId = data.items[0].id.videoId;
				const link = `https://www.youtube.com/watch?v=${videoId}`;
				console.log(link);
				playVideo(videoId,link); // You can do whatever you want with the link here
			} else {
				console.log('No videos found for the given song name.');
			}
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}
function playVideo(videoId,link) {

	if (videoId) {
		const playerDiv = document.querySelector('.videos');
		let StrHTML=``;
		strHTML+=` <a href="${link}" target="_blank"><button class="btn-youtube"><i class="fa-brands fa-youtube"></i></button></a>`;
		strHTML+=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
		playerDiv.style.display = 'block';
		playerDiv.innerHTML = strHTML
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
	console.log(quizeArr);
	renderQuestion(quizeArr.pop());
}
async function renderTop3() {
	try {
		let top3 = await GetScore();
		console.log(top3);

		let cont = document.querySelector('.question');
		let top3Div = document.createElement('div');
		top3Div.className = 'top-3';
		top3Div.innerHTML = '';

		let elscore = `<h3>Best Scores</h3>`;
		for (let t in top3) {
			for (let u in users) {
				if (users[u].id == top3[t][0]) {
					elscore +=
						`<div class="top3div"><h2>${users[u].firstName} ${users[u].lastName}</h2>` +
						`<h2>${top3[t][1]}</h2></div>`;
				}
			}
		}

		top3Div.innerHTML = elscore;
		cont.appendChild(top3Div);
	} catch (err) {
		alert(err);
	}
}

function startGame() {
	clearInterval(timerInterval);
	let elcontainer = document.querySelector('.spotify-playlists');
	document.querySelector('.quize-div').style.display = 'flex';

	elcontainer.innerHTML = '';
	let container = document.querySelector('.question');
	container.innerHTML = '';
	score = 0;
	count = 0;
	arrAns = [];
	hints = 3;
	time = 30;

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
	let optionDiv = document.createElement('div');
	optionDiv.className = 'option-div';
	difficultyOptions = ['Easy', 'Medium', 'Hard'];
	difficultyOptions.forEach((option, index) => {
		const label = document.createElement('label');
		label.innerHTML = `<input type="radio" name="difficulty" value="${option}" ${
			index === 0 ? 'checked' : ''
		} onchange="handleDifficultyChange()" /> ${option}`;
		optionDiv.appendChild(label);
		optionDiv.appendChild(document.createElement('br'));
	});
	container.appendChild(optionDiv);
	renderTop3();
}
function handleDifficultyChange() {
	const selectedOption = document.querySelector(
		'input[name="difficulty"]:checked'
	).value;

	switch (selectedOption) {
		case 'Easy':
			// Code for Easy difficulty
			reward = 1;
			time = 30;
			hints = 3;
			console.log('Easy difficulty selected!');
			break;
		case 'Medium':
			reward = 2;
			hints = 1;
			time = 15;
			// Code for Medium difficulty
			console.log('Medium difficulty selected!');
			break;
		case 'Hard':
			reward = 4;
			hints = 0;
			time = 10;
			// Code for Hard difficulty
			console.log('Hard difficulty selected!');
			break;
		default:
			// Code for default case (if no option is selected)
			console.log('Please select a difficulty!');
	}
}
function renderQuestion(q) {
	// clearInterval(timerInterval);
	if (quizeArr.length > 0) {
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
		elScore.innerText = 'score: ' + score;
		startTimer();
	} else {
		quizeEnd();
	}
}

async function checkAns(ans, q) {
	let elLbl = document.querySelector('.lbl-message');
	elBtn = document.getElementById(ans);
	if (ans == q.a) {
		score += 10 * reward * timeLeft;
		arrAns.push(1);
		elBtn.className = 'correct';
	} else {
		arrAns.push(0);
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
	clearInterval(timerInterval);
	elScore = document.querySelector('.score');
	elScore.innerText = 'score: ' + score;
	console.log(arrAns);
	elQuestion = document.querySelector('.question');
	elQuestion.innerHTML = '';
	strHTML = `Your Result is:<div>`;
	var elDiv = document.createElement('div');
	elDiv.className = 'result';
	for (let i = 0; i < arrAns.length; i++) {
		if (arrAns[i] == 1) {
			strHTML += '<i class="star fa fa-check" aria-hidden="true"></i>';
		} else {
			strHTML += '<i class="star-f fa fa-times" aria-hidden="true"></i>';
		}
	}
	InsertScore();
	strHTML += `</div>`;
	strHTML += ` <button onclick="startGame()">Play again</button>`;
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
	timeLeft = time; // Reset the timer to 10 seconds
	updateTimerDisplay();

	// Start the timer interval
	timerInterval = setInterval(function () {
		timeLeft -= 1;
		updateTimerDisplay();
		// Check if the timer has reached 0
		if (timeLeft <= 0) {
			renderQuestion(quizeArr.pop());
			arrAns.push(0);
			clearInterval(timerInterval); // Clear the interval when time is up

			// handleTimeUp();
		}
		if (timeLeft <= 0 && quizeArr.length <= 0) {
			console.log('enddd');
			quizeEnd();
			// clearInterval(timerInterval);
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
async function GetScore() {
	let top3 = [];
	return new Promise((resolve, reject) => {
		let curUser = JSON.parse(localStorage.getItem('user'));
		let GetScoreAPI = api + 'api/Users/GetAllScores';

		ajaxCall(
			'GET',
			GetScoreAPI,
			null,
			(data) => {
				let relevante = data.sort(function (a, b) {
					return b[1] - a[1];
				});

				for (let i = 0; i < 3; i++) {
					top3.push(relevante[i]);
				}

				resolve(top3);
			},
			(err) => {
				reject(err);
			}
		);
	});
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

function renderAdditions(){
	let container=document.querySelector('.spotify-playlists');
	document.querySelector('.search-div').innerHTML = '';
	document.querySelector('.quize-div').style.display = 'none';
	container.style.display = 'block';
	container.innerHTML='';
	strHTML=`   <h2 class="section-title">Introducing the latest enhancements to our project</h2>
    <ul>
        <li class="list-item">
            <span>Dark Mode with State Persistence:</span> Enjoy a soothing, eye-friendly browsing experience with Dark Mode, and your preference will be remembered each time you return.
        </li>
        <li class="list-item">
            <span>Enhanced Game Quiz Features:</span> Take your gaming experience to new heights with adjustable difficulty levels, helpful hints, and an exciting built-in timer.
        </li>
        <li class="list-item">
            <span>YouTube API Integration:</span> Effortlessly make API calls to YouTube servers, obtaining valuable data such as video IDs, links, and other information, directly within the project.
        </li>
        <li class="list-item">
            <span>Artist Data API:</span> Using the Last.fm API, retrieve comprehensive information about the artist by making API calls with the artist's ID. Send the necessary API requests to obtain the artist's image, along with other details, seamlessly integrating this data into the project.
        </li>
        <li class="list-item">
            <span>Admin Panel - Delete User:</span> Empower administrators with the ability to securely manage user accounts, including the option to delete specific accounts for maintenance or policy adherence.
        </li>
        <li class="list-item">
		<span>Visual Statistics:</span> Gain valuable insights from easy-to-understand graphs, charts, and infographics, making complex data accessible and engaging.
        </li>
        <li class="list-item">
            <span>Enhanced UX/UI Experience:</span> Navigate effortlessly with an intuitive, visually appealing, and user-friendly interface, designed based on valuable user feedback.
        </li>
    </ul>`;
	container.innerHTML=strHTML;
}