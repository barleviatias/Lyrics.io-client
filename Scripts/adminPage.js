let api = "https://localhost:7245/";
let users = [];

let counterFavorite = [];

function init() {
  console.log("admin now");
  document.querySelector(".manage-users").style.display = "none";;
  getUsers();
  drawChart();
}

function getUsers() {
  let getUsersAPI = api + "api/Users";
  ajaxCall(
    "GET",
    getUsersAPI,
    null,
    (data) => {
      console.log(data);
      users = data;
      renderUsers(data);
    },
    (err) => {
      alert(err);
    }
  );
}
  function getUsers() {
    let getUsersAPI = api + "api/Users";
    ajaxCall(
      "GET",
      getUsersAPI,
      null,
      (data) => {
        console.log(data);
        users = data;
        renderUsers(data);
      },
      (err) => {
        alert(err);
      }
    );
  }

  function getFavoriteByID() {
    let api3 = api + "api/Songs/GetFavByID?userId=" + 1;

    ajaxCall(
      "GET",
      api3,
      null,
      (data) => {
        console.log(data);
      },
      (err) => {
        arr(err);
      }
    );
  }
  function getFavorite() {
    let con = [];
    let favAPI = api + "api/Songs/GetAllFav";
    ajaxCall(
      "GET",
      favAPI,
      null,

      (data) => {
        for (d in data) {
          if (con.hasOwnProperty(data[d][1]) == false) {
            con[data[d][1]] = 0;
          }
          con[data[d][1]] += 1;
        }
        for (p in con) {
          counterFavorite.push([p, con[p]]);
        }
        console.log(counterFavorite);
      },
      (err) => {
        alert(err);
      }
    );
  }

  function renderUsers(data) {
    console.log("try render");

    $("#example").DataTable({
      data: data,
      columns: [
        { data: "firstName" },
        { data: "lastName" },
        { data: "email" },
        { data: "signDate" },
      ],
    });
  }
  function showManageUsers() {
    document.getElementById("chart_div").innerHTML="";
    let elDiv = document.querySelector(".manage-users");
    elDiv.style.display = "block";
  }
  getFavorite();

  // Load the Visualization API and the corechart package.
  google.charts.load("current", { packages: ["corechart"] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Topping");
    data.addColumn("number", "Slices");
    data.addRows(counterFavorite);

    // Set chart options
    var options = {
      title: "Songs Statistics",
      width: 400,
      height: 300,

    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById("chart_div")
    );
    
    chart.draw(data, options);
    const tmp = document.getElementById("chart_div");
    const child = tmp.firstChild;
    child.style.display="flex";
    child.style.justifyContent = "center";
  }
  function ShowLiked(){
    document.querySelector(".manage-users").style.display = "none";
    document.querySelector("#chart_div").style.display = "none";
    document.querySelector(".manage-liked-songs").style.display = "block";
    RenderLikedSongs(users);
  }

  function RenderLikedSongs(data){
      console.log(data);
      console.log("try render Likes");

    $("#likesTB").DataTable({
      data: data,
      columns: [
        { data: "Email" },
        { data: "Likes" },
     
      ],
    });
  }


function renderUsers(data) {
	console.log('try render');

	$('#example').DataTable({
		data: data,
		columns: [
			{ data: 'firstName' },
			{ data: 'lastName' },
			{ data: 'email' },
			{ data: 'signDate' },
		],
	});
}
function showManageUsers() {
	let elDiv = document.querySelector('.manage-users');
	elDiv.style.display = 'block';
}
getFavorite();

      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
        changeIdToName();
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(counterFavorite);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':500,
                       'backgroundColor':'black',
                       'height':500};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
function changeIdToName(){
    songs=JSON.parse(localStorage.getItem('songs'));
    for(s of songs){
        for(f in counterFavorite){
            if(counterFavorite[f][0]==s.id){
                counterFavorite[f][0]=s.song;
            }
        }
    }
}
