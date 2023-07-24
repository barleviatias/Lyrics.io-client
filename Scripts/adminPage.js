let api = "https://proj.ruppin.ac.il/cgroup18/test2/tar1/";
let users = [];
let favorites = [];
let counterFavorite = [];
let flag = 0;
let currUser = JSON.parse(localStorage.getItem("user"));

function showChartDiv() {
  document.querySelector(".manage-users").style.display = "none";
  document.querySelector(".manage-liked-songs").style.display = "none";
  document.getElementById("chart_div").style.display = "block";
  document.getElementById("chart_div1").style.display = "block";
}

async function init() {
  if(localStorage.getItem("songs")==null){
    try {
      await getSongs();
      // The getSongs function will now be awaited until the data is fetched and stored in localStorage.
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }
  if (currUser.email.split(" ")[0] != "admin@gmail.com") {
    window.location.href = "welcome.html";
  }
  console.log("admin now");
  document.querySelector(".manage-users").style.display = "none";
  document.querySelector(".manage-liked-songs").style.display = "none";

  drawChart();
  artistStat();
  getUsers();
  showManageUsers();
}
function getSongs() {
  return new Promise((resolve, reject) => {
    // closeMenu();
    let api1 = api + 'api/Songs';
    console.log(api);
    ajaxCall(
      'GET',
      api1,
      null,
      (data) => {
        localStorage.setItem('songs', JSON.stringify(data));
        resolve(data);
      },
      (err) => {
        console.log(err);
        reject(err);
      }
    );
  });
}

function getUsers() {
  let getUsersAPI = api + "api/Users";
  ajaxCall(
    "GET",
    getUsersAPI,
    null,
    (data) => {
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
        console.log("Get Favortite");
    },
    (err) => {
      arr(err);
    }
  );
}

function renderUsers(data) {
  console.log("try render");
  let i = 0;
  $("#example").DataTable({
    paging: false,
    data: data,
    columns: [
      { data: "firstName" },
      { data: "lastName" },
      { data: "email" },
      { data: "signDate" },
      {
        data: "id",
        render: function (data, type, row) {
          let d = $("#example").DataTable().rows().data();
          return (
            '<button class="btn btn-danger remove-btn" data-id="' +
            data +
            '" data-email="' +
            row.email +
            '">Remove</button>'
          );
          // return `<button id ='${i++}' class='delete' onclick="deleteUser($('#example').DataTable().rows( this.id ).data())" >delete</button>`;
        },
      },
    ],
  });
  // Attach click event to the remove button
  $("#example tbody").on("click", ".remove-btn", function () {
    const row = $(this).closest('tr');
    $("#example").DataTable().row(row).remove().draw();
    const userId = $(this).data();
    // Call the function with the user ID as an argument
    removeUser(userId.email);
  });
}

// Function to remove the user (replace this with your actual implementation)
function removeUser(email) {
  let deleteAPI = api + "api/Users/DeleteUser/email/" + email;
  ajaxCall(
    "DELETE",
    deleteAPI,
    null,
    (data) => {
      for (let u in users) {
        if (users[u]["email"] == email) {
          delete users[u];
        }
      }
    },
    (err) => {
      alert(err);
    }
  );
}
function showManageUsers() {
  document.getElementById("chart_div").style.display = "none";
  document.getElementById("chart_div1").style.display = "none";

  document.querySelector(".manage-liked-songs").style.display = "none";
  let elDiv = document.querySelector(".manage-users");
  elDiv.style.display = "block";
}

// Load the Visualization API and the corechart package.
google.charts.load("current", { packages: ["corechart"] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function getFavorite() {
  return new Promise((resolve, reject) => {
    let con = [];
    let favAPI = api + "api/Songs/GetAllFav";
    ajaxCall(
      "GET",
      favAPI,
      null,
      (data) => {
        let songs1 = JSON.parse(localStorage.getItem("songs"));
        favorites = data;
        for (d in data) {
          if (con.hasOwnProperty(data[d][1]) == false) {
            con[data[d][1]] = 0;
          }
          con[data[d][1]] += 1;
        }
        for (p in con) {
          for (s in songs1) {
            if (songs1[s].id == p) {
              counterFavorite.push([songs1[s].song, con[p]]);
            }
          }
        }
        console.log("success");
        resolve(); // Resolve the Promise after the data is processed
      },
      (err) => {
        reject(err); // Reject the Promise if there is an error
      }
    );
  });
}



async function drawChart() {

  await getFavorite();
  console.log(counterFavorite);
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Topping");
  data.addColumn("number", "Slices");
  data.addRows(counterFavorite);

  // Set chart options
  var options = {
    title: "Songs Statistics",
    width: 1000,
    height: 500,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("chart_div")
  );

  chart.draw(data, options);
  const tmp = document.getElementById("chart_div");
  const child = tmp.firstChild;
  child.style.display = "flex";
  child.style.justifyContent = "center";
}
function ShowLiked() {
  document.querySelector(".manage-users").style.display = "none";
  document.querySelector("#chart_div").style.display = "none";
  document.querySelector("#chart_div1").style.display = "none";

  RenderLikedSongs(users);
}

function RenderLikedSongs(data) {
  let songs = JSON.parse(localStorage.getItem("songs"));
  document.querySelector(".manage-liked-songs").style.display = "block";
  if (flag == 1) {
    return;
  }
  console.log("try render Likes");
  let finalData = [];
  for (d in data) {
    let whos = {};
    whos["email"] = data[d].email;
    let likesSongs = [];
    for (i in favorites) {
      if (data[d].id == favorites[i][0]) {
        for (s in songs) {
          if (favorites[i][1] == songs[s].id) {
            likesSongs.push(songs[s].song);
          }
        }
      }
    }
    whos["Likes"] = likesSongs;
    finalData.push(whos);
  }

  $("#likesTB").DataTable({
    data: finalData,
    columns: [{ data: "email" }, { data: "Likes", render: "[<br>]" }],
  });
  flag = 1;
}

function logout() {
  window.location.href = "welcome.html";
  localStorage.removeItem("user");
}

function artistStat() {
  let artistAPI = api + "api/Songs/GetAllArtists";
  ajaxCall(
    "GET",
    artistAPI,
    null,
    (data) => {
      let songsList = JSON.parse(localStorage.getItem("songs"));
      let final = {};
      let favoriteArtists = [];
      for (let f in favorites) {
        for (let s in songsList) {
          if (songsList[s].id == favorites[f][1]) {
            if (Object.keys(final).includes(songsList[s].artist) == false) {
              final[songsList[s].artist] = 0;
            }
            final[songsList[s].artist] += 1;
          }
        }
      }
      for (let k in final) {
        favoriteArtists.push([k, final[k]]);
      }
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Topping");
      data.addColumn("number", "Slices");
      data.addRows(favoriteArtists);

      // Set chart options
      var options = {
        title: "Artists Statistics",
        width: 1000,
        height: 500,
        is3D: "true",
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(
        document.getElementById("chart_div1")
      );

      chart.draw(data, options);
      const tmp = document.getElementById("chart_div1");
      const child = tmp.firstChild;
      child.style.display = "flex";
      child.style.justifyContent = "center";
    },
    (err) => {
      alert(err);
    }
  );
}
