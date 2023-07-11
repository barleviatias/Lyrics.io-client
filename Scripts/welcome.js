var flag=1;
const elcheckbox = document.querySelector("input[type='checkbox']");
console.log(elcheckbox);
console.log("loading");

// checkbox.addEventListener("toggleDarkMode", () => {
//   log("change");
//   document.body.classList.toggle("dark-mode")
// })
function OpenSignUp() {
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
  let api = "https://localhost:7245/api/Users/InsertUser";
  ajaxCall(
    "POST",
    api,
    JSON.stringify(Users),
    (data) => {
      console.log("success");
      localStorage.setItem("user", JSON.stringify(Users));
      window.location.href = "/pages/main.html";
    },
    (err) => {
      console.log(err);
      console.log("error sign up");
      // alert(err);
    }
    );
}

function SignIn(event) {
  event.preventDefault();
  let email = document.SignInForm.email.value;
  let password = document.SignInForm.password.value;
  let ConnectAPI='https://localhost:7245/api/Users/LogIn/email/'+email;
  ajaxCall("POST",ConnectAPI,JSON.stringify(password), (data)=>{
    console.log(data);
    window.location.href = "/pages/main.html";
  }),(err)=>{
    alert(err);
  }
  
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
    pad(date.getUTCSeconds())+"Z";
    return date;
}


function toggleDarkMode() {
  console.log(flag);
  if(flag){
    var img=document.querySelector(".logo");
    img.src = '../img/1.png';
    flag=0;
  }else{
    var img=document.querySelector(".logo");
    img.src ='../img/2.png';
    flag=1;
  }
  var element = document.body;
  element.classList.toggle("dark-mode");
}