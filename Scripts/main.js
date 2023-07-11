

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
            console.log(d);
        }
    }
