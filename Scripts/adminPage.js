let api = 'https://localhost:7245/';
let users = []

function getUsers(){
    let getUsersAPI = api + 'api/Users';
    ajaxCall("GET" , getUsersAPI , null , 
    (data)=>{
        console.log(data);
        users= data;
    },(err)=>{
        alert(err);
    });
}


function getFavoriteByID(){
    let api3 = api+'api/Songs/GetFavByID?userId=' + 1;

    ajaxCall('GET', api3, null,
      (data) => {
        console.log(data);
      },
      (err) => {
        arr(err);
      }
    );
}
function getFavorite(){
    let favAPI= api+'api/Songs/GetAllFav';
    ajaxCall("GET",favAPI,null,
    (data)=>{
        console.log(data);
    },(err)=>{
        alert(err);
    });
}