et users = [];
// let table = new DataTable('#example');

let counterFavorite={};
let counterFavorite = [];

function init(){
    console.log("admin now");
function init() {
	console.log('admin now');

    getUsers();
    // $('#example').DataTable( {
    //     data: users
    // } );
	getUsers();
    drawChart();
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
function getUsers() {
	let getUsersAPI = api + 'api/Users';
	ajaxCall(
		'GET',
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
	let api3 = api + 'api/Songs/GetFavByID?userId=' + 1;

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
	ajaxCall(
		'GET',
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
function getFavorite(){
    let favAPI= api+'api/Songs/GetAllFav';
    ajaxCall("GET",favAPI,null,
    (data)=>{
        for (d in data){
            if( counterFavorite.hasOwnProperty(data[d][1]) == false){
                counterFavorite[data[d][1]] = 0;
            }
            counterFavorite[data[d][1]] += 1;

        }
        console.log( console.log(counterFavorite));
    },(err)=>{
        alert(err);
    });
function getFavorite() {
	let favAPI = api + 'api/Songs/GetAllFav';
	ajaxCall(
		'GET',
		favAPI,
		null,
		(data) => {
			for (d in data) {
				if (counterFavorite.hasOwnProperty(data[d][1]) == false) {
					counterFavorite[data[d][1]] = 0;
				}
				counterFavorite[data[d][1]] += 1;
			}
			console.log(console.log(counterFavorite));
		},
		(err) => {
			alert(err);
		}
	);
}

function renderUsers(data) {
	console.log('try render');


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
function showManageUsers(){
    let elDiv=document.querySelector(".manage-users");
    elDiv.style.display='block';
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

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(counterFavorite);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }