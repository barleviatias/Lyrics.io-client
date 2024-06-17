var flag = 1;
let api = "https://proj.ruppin.ac.il/cgroup50/test2/tar1/";
const elcheckbox = document.querySelector("input[type='checkbox']");
console.log(elcheckbox);
console.log("loading");
if(localStorage.getItem("isDark")==null){
  localStorage.setItem("isDark",true);
}

let currUser = JSON.parse(localStorage.getItem('user'));
if (currUser != null) {
  window.location.href = 'main.html';
}
checkDark();
// bug when signup user obj dont save the id 

function OpenSignUp() {
  document.querySelector(".errorH3").style.display="none";
  let l = document.querySelector(".SignIn");
  let p = document.querySelector(".SignUp");
  if (l.style.display != "none") {
    l.style.display = "none";
    p.style.display = "flex";
    return;
  }
  l.style.display = "flex";
  p.style.display = "none";
}
function SignUp(event) {
  event.preventDefault();
  Users = {
    firstName: document.SignUpForm.FirstName.value,
    lastName: document.SignUpForm.LastName.value,
    email: document.SignUpForm.email.value,
    password: document.SignUpForm.password.value,
    signDate: getDateNow(),
  };
  console.log(Users);
  let api1 = api + "api/Users/InsertUser";
  ajaxCall(
    "POST",
    api1,
    JSON.stringify(Users),
    (data) => {
      console.log("success");
      // localStorage.setItem("user", JSON.stringify(Users));
      window.location.href = "welcome.html";
    },
    (err) => {
      alert("Email Already Used!");
      // alert(err);
    }
  );
}

function SignIn(event) {
  event.preventDefault();
  let email = document.SignInForm.email.value;
  let password = document.SignInForm.password.value;

  let ConnectAPI = api + "api/Users/LogIn/email/" + email;
  ajaxCall(
    "POST",
    ConnectAPI,
    JSON.stringify(password),
    (data) => {
      document.querySelector(".errorH3").style.display="none";
      if (email == "admin@gmail.com" && password == "123") {
        document.SignInForm.email.value = "";
        document.SignInForm.password.value = "";
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "admin.html";
        return;
      }
      document.SignInForm.email.value = "";
      document.SignInForm.password.value = "";
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "main.html";
    },
    (err) => {
      document.querySelector(".errorH3").style.display="block";
      document.SignInForm.email.value = "";
      document.SignInForm.password.value = "";
    }
  );
}

function getDateNow() {
  var pad = function (num) {
    return ("00" + num).slice(-2);
  };
  var date;
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    pad(date.getUTCMonth() + 1) +
    "-" +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    ":" +
    pad(date.getUTCMinutes()) +
    ":" +
    pad(date.getUTCSeconds()) +
    "Z";
  return date;
}
function checkDark(){
  var bodyElement = document.body;
	let isDark=localStorage.getItem('isDark');
	let chk= document.querySelector('.checkbox');
  var img = document.querySelector(".logo");
	if(isDark=='false'){
    console.log(isDark);
    console.log("starting white");
    bodyElement.classList.remove('dark-mode');
    chk.checked=true;
    img.src = "../img/1.png";
	}
	else{
    img.src = "../img/2.png";
    chk.checked=false;
	}
	
}
function toggleDarkMode() {
  let isDark=JSON.parse(localStorage.getItem('isDark'));
  console.log(isDark);
  if (isDark) {
    console.log("bar");
    var img = document.querySelector(".logo");
    img.src = "../img/1.png";
    localStorage.setItem("isDark",false);
  } else {
    var img = document.querySelector(".logo");
    img.src = "../img/2.png";
    localStorage.setItem("isDark",true);
  }
  var element = document.body;
  element.classList.toggle("dark-mode");
}
