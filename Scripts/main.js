let likedSongsId = [];
let bar;
let api = 'https://localhost:7245/';
let currUser = JSON.parse(localStorage.getItem('user'));
function init() {
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
	document.querySelector('.spotify-playlists').style.display="block";
	if (showSearch == 0) {
		document.querySelector('.search-div').innerHTML = '';
	}
	console.log(data);
	getFavSongs();
	hideLoader();
	strHTML = ``;
	const container = document.querySelector('.spotify-playlists'); // Replace 'container' with the ID of your container element
	// Clear the container
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
    song.id=d.id;
		song.innerText = d.song.trim();
    song.addEventListener('click',()=>{
      renderSong(song.id);
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
	let image_url='../img/user.png';
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
				const url = 'https://musicbrainz.org/ws/2/artist/' + artistData.mbid + '?inc=url-rels&fmt=json';
				console.log(url);
				 fetch(url)
					 .then(res => res.json())
					 .then((out) => {
						 const relations = out.relations;
						//  console.table(relations);
						 // Find image relation
						 for (let i = 0; i < relations.length; i++) {
							 if (relations[i].type === 'image') {
								 image_url = relations[i].url.resource;
								 if (image_url.startsWith('https://commons.wikimedia.org/wiki/File:')) {
									 const filename = image_url.substring(image_url.lastIndexOf('/') + 1);
									 image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename;
								 }
								}
							}
							console.log(image_url);
							var artistImg = document.createElement('img');
							artistImg.src = image_url;
							artistImg.className='artist-img'
						   artistInfoDiv.insertBefore(artistImg,artistInfoDiv.firstChild);
					 })
					 .catch(err => { throw console.log(err) });
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
			bioParagraph.textContent = artistData.bio.content;
			artistInfoDiv.appendChild(bioParagraph);

			// Render the tags
			var tagsHeading = document.createElement('h3');
			tagsHeading.textContent = 'Tags';
			artistInfoDiv.appendChild(tagsHeading);

			var tagsList = document.createElement('ul');
			artistData.tags.tag.forEach(function (tag) {
				var tagItem = document.createElement('li');
				tagItem.textContent = tag;
				tagsList.appendChild(tagItem);
			});
			artistInfoDiv.appendChild(tagsList);

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
  container.innerHTML = '';
  for (s of songs){
    if(s.id==songId){

      // Create the artist information div
      var artistInfoDiv = document.createElement('div');
      artistInfoDiv.classList.add('artist-info');
    
      // Render the artist name
      var artistNameHeading = document.createElement('h2');
      artistNameHeading.textContent = s.name;
      artistInfoDiv.appendChild(artistNameHeading);
    
      var bioTitle = document.createElement('p');
      bioTitle.textContent = s.artist;
      artistInfoDiv.appendChild(bioTitle);
      // Render the bio
      var bioParagraph = document.createElement('p');
      bioParagraph.textContent = s.lyrics;
      artistInfoDiv.appendChild(bioParagraph);
  
    }
  }
	container.appendChild(artistInfoDiv);
  hideLoader();
}
// renderArtist('kiss')

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
	document.querySelector('.spotify-playlists').style.display="none";
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
