

let api = "https://localhost:7245/api/Songs";
  ajaxCall(
    "GET",
    api,null,
    (data) => {

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
    InsertFavoriteSong();

