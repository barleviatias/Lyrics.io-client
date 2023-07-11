let api = "https://localhost:7245/api/Songs";
ajaxCall(
  "GET",
  api,
  null,
  (data) => {
    renderSongs(data);
  },
  (err) => {
    console.log(err);
  }
);
function InsertFavoriteSong() {}

function renderSongs(data) {
  strHTML = ``;
  const container = document.querySelector(".spotify-playlists"); // Replace 'container' with the ID of your container element

  // Clear the container
  container.innerHTML = "";
  for (d of data) {
    const item = document.createElement("div");
    item.classList.add("item");

    // Create and append the artist element
    const artist = document.createElement("p");
    artist.innerText = d.artist.trim();
    item.appendChild(artist);

    // Create and append the song element
    const song = document.createElement("p");
    song.innerText = d.song.trim();
    item.appendChild(song);

    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.className=d.id;
	addToFavoritesButton.innerHTML = '<i class="far fa-star"></i>';
    addToFavoritesButton.addEventListener("click", () => {
      let userId = localStorage.getItem("user");
      let songId = addToFavoritesButton.className;
    	let InsertFAPI="https://localhost:7245/api/Songs/InsertFsvorite/userId/"+userId+"/songId/"+songId;
    	ajaxCall("POST" , InsertFAPI , null ,
    	(data)=>{
    	  if(data == -1 ){
    		alert("You Already Liked This Song");
			addToFavoritesButton.style.color="white";
			let delAPI ='https://localhost:7245/api/Songs?userId='+userId+'&songId='+songId;
			ajaxCall("DELETE" ,delAPI,null ,
			(data) =>{
				console.log(data);

			},(err)=>{
				alert(err);

			}
			)
    	  }
		  else{
			alert("This Song Added to Your Favorite List");
			addToFavoritesButton.style.color="red";
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
