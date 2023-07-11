let api = 'https://localhost:7245/api/Songs';
ajaxCall(
	'GET',
	api,
	null,
	(data) => {
		renderSongs(data);
	},
	(err) => {
		console.log(err);
	}
);

function renderSongs(data) {
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
	}
}
