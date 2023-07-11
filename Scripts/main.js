
function renderSongs() {
  showLoader()
  let api = 'https://localhost:7245/api/Songs';
ajaxCall(
	'GET',
	api,
	null,
	(data) => {
    hideLoader()
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
    artist.id=d.artist.trim();
    artist.addEventListener('click', () => {
      renderArtist(artist.id);
    });
    item.appendChild(artist);



		// Create and append the song element
		const song = document.createElement('p');
		song.innerText = d.song.trim();
		item.appendChild(song);
    
    const addToFavoritesButton = document.createElement('button');
    addToFavoritesButton.innerHTML = '<i class="far fa-star"></i>';
    addToFavoritesButton.addEventListener('click', () => {
      addToFavorites(obj);
    });
    item.appendChild(addToFavoritesButton);

		// Append the item to the container
		container.appendChild(item);
	}},
	(err) => {
		console.log(err);
	}
);


}



const lastAPI_KEY='0cf192ec4e9d4768370298d196df5ff2';
const lastAPI='https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=KISS&api_key=0cf192ec4e9d4768370298d196df5ff2&format=json';
function renderArtist(name){
  showLoader()
  console.log(name);
    const apiUrl = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+name+'&api_key=0cf192ec4e9d4768370298d196df5ff2&format=json';
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        hideLoader();
        console.log(data.artist);
        const container = document.querySelector('.spotify-playlists');
        container.innerHTML = '';
        artistData=data.artist;
        console.log(artistData.name);
            // Create the artist information div
            var artistInfoDiv = document.createElement("div");
            artistInfoDiv.classList.add("artist-info");

            // Render the artist name
            var artistNameHeading = document.createElement("h2");
            artistNameHeading.textContent = artistData.name;
            artistInfoDiv.appendChild(artistNameHeading);

            // Render the bio
            var bioParagraph = document.createElement("p");
            bioParagraph.textContent = artistData.summary;
            artistInfoDiv.appendChild(bioParagraph);

            // Render the tags
            var tagsHeading = document.createElement("h3");
            tagsHeading.textContent = "Tags";
            artistInfoDiv.appendChild(tagsHeading);

            var tagsList = document.createElement("ul");
            artistData.tags.tag.forEach(function(tag) {
                var tagItem = document.createElement("li");
                tagItem.textContent = tag;
                tagsList.appendChild(tagItem);
            });
            artistInfoDiv.appendChild(tagsList);

            // Render the statistics
            var statsHeading = document.createElement("h3");
            statsHeading.textContent = "Statistics";
            artistInfoDiv.appendChild(statsHeading);

            var statsParagraph = document.createElement("p");
            statsParagraph.innerHTML = "Listeners: " + artistData.stats.listeners + "<br>" +
                "Playcount: " + artistData.stats.playcount;
            artistInfoDiv.appendChild(statsParagraph);

            // Render the URL
            var urlLink = document.createElement("a");
            urlLink.href = artistData.url;
            urlLink.textContent = "Visit Last.fm page";
            artistInfoDiv.appendChild(urlLink);

            // Append the artist information div to the container
            container.appendChild(artistInfoDiv);

      })
      .catch(error => {
        console.error('Error:', error);
      });
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