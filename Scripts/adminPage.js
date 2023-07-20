let api = 'https://localhost:7245/';
let users = [];
let counterFavorite=[];

function init(){
    console.log("admin now");

    getUsers();
    // $('#example').DataTable( {
    //     data: users
    // } );
}


function getUsers(){
    let getUsersAPI = api + 'api/Users';
    ajaxCall("GET" , getUsersAPI , null , 
    (data)=>{
        console.log(data);
        users= data;
        renderUsers(data);
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
    let con=[];
    let favAPI= api+'api/Songs/GetAllFav';
    ajaxCall("GET",favAPI,null,
    
    (data)=>{
        for (d in data){
            if( con.hasOwnProperty(data[d][1]) == false){
                con[data[d][1]] = 0;
            }
            con[data[d][1]] += 1;
        }
        for (p in con){
            counterFavorite.push([p,con[p]]);
        }
        console.log(counterFavorite);
    },(err)=>{
        alert(err);
    });
}



function renderUsers(data){
    console.log("try render");

    $('#example').DataTable( {
        data: data,
        columns: [
            { data: 'firstName' },
            { data: 'lastName' },
            { data: 'email' },
            { data: 'signDate' }
        ]
    } );
}
function showManageUsers(){
    let elDiv=document.querySelector(".manage-users");
    elDiv.style.display='block';
}
getFavorite();
