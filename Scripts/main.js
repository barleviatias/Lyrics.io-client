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

      renderSongs(data);
    },
    (err) => {
      console.log(err);
    }
    );

    function renderSongs(data){
        strHTML=``;
        for (d of data){
            
        }
    }
    function InsertFavoriteSong(){
      let InsertFAPI="https://localhost:7245/api/Songs/InsertFsvorite/userId/"+"1"+"/songId/"+"127";
      ajaxCall("POST" , InsertFAPI , null , 
      (data)=>{
        if(data == -1 ){
          alert("You Already Liked This Song");
        }
      },(err)=>{
        alert(err);

      })
    }


