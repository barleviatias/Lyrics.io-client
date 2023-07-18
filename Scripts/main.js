let likedSongsId =[];
let bar;
let currUser=JSON.parse(localStorage.getItem('user'));
function init(){
  elHellolbl=document.querySelector('.hello');
  if(currUser==null){
    window.location.href = "/pages/welcome.html";
  }
  else{
    console.log(currUser);
    elHellolbl.innerText="Hello,"+currUser.firstName;
  }
  getSongs();

}
async function getSongs(){
  showLoader()
  await getFavSongs();
  let api = 'https://localhost:7245/api/Songs';
  ajaxCall(
    'GET',
    api,
    null,
    (data) => {
      hideLoader()
      localStorage.setItem("songs",JSON.stringify(data));
      renderSongs(data);
      
    },(err)=>{
      console.log(err);
    });
}
 async function getLikedSongs(){
  await getFavSongs();
  console.log(likedSongsId);
  let lstLikedSongs=[];
  songs= JSON.parse(localStorage.getItem("songs"));
  console.log(songs);
  for (s of songs){
    if (likedSongsId.includes(s.id)){
      console.log("match");
      lstLikedSongs.push(s);
    }
  }
  renderSongs(lstLikedSongs);
  console.log(lstLikedSongs);
}
function renderSongs(data) {
  console.log(data);
  getFavSongs();
    hideLoader()
		strHTML = ``;
	const container = document.querySelector('.spotify-playlists'); // Replace 'container' with the ID of your container element
  // Clear the container
  container.innerHTML = "";
  for (d of data) {
    const item = document.createElement("div");
    item.classList.add("item");

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
    const song = document.createElement("p");
    song.innerText = d.song.trim();
    item.appendChild(song);

    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.className=d.id;
    addToFavoritesButton.classList.add="btn-fav";
    addToFavoritesButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
    if(likedSongsId.includes(d.id)){
      addToFavoritesButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
      addToFavoritesButton.style.color="green";
    }
    addToFavoritesButton.addEventListener("click", () => {
      let userId = currUser.id;
      let songId = addToFavoritesButton.className;
    	let InsertFAPI=api+"api/Songs/InsertFsvorite/userId/"+userId+"/songId/"+songId;
    	ajaxCall("POST" , InsertFAPI , null ,
    	(data)=>{
    	  if(data == -1 ){
			addToFavoritesButton.style.color="white";
      addToFavoritesButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
      getFavSongs();
			let delAPI =api+'api/Songs?userId='+userId+'&songId='+songId;
			ajaxCall("DELETE" ,delAPI,null ,
			(data) =>{
				console.log(data);

			},(err)=>{
				alert(err);

			}
			)
    	  }
		  else{
			addToFavoritesButton.style.color="green";
      addToFavoritesButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
		  }
    	}
    	,(err)=>{
    	  alert(err);
    	})
    });
    item.appendChild(addToFavoritesButton);

		// Append the item to the container
		container.appendChild(item);
  }


}

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


function getFavSongs() {
  return new Promise((resolve, reject) => {
    let currUser = JSON.parse(localStorage.getItem('user'));
    let api = 'https://localhost:7245/api/Songs/GetFavByID?userId=' + currUser.id;

    ajaxCall('GET', api, null,
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


function logout(){
  window.location.href = "/pages/welcome.html";
  localStorage.removeItem('user'); 
}