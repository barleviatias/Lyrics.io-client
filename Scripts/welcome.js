var flag = 1;
let api = "https://localhost:7245/";
const elcheckbox = document.querySelector("input[type='checkbox']");
console.log(elcheckbox);
console.log("loading");
localStorage.setItem("isDark",true);

// bug when signup user obj dont save the id 

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
  let api1 = api + "api/Users/InsertUser";
  ajaxCall(
    "POST",
    api1,
    JSON.stringify(Users),
    (data) => {
      console.log("success");
      localStorage.setItem("user", JSON.stringify(Users));
      window.location.href = "/pages/main.html";
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
      if (email == "admin@gmail.com" && password == "123") {
        document.SignInForm.email.value = "";
        document.SignInForm.password.value = "";
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/pages/admin.html";
        return;
      }
      document.SignInForm.email.value = "";
      document.SignInForm.password.value = "";
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/pages/main.html";
    },
    (err) => {
      alert("Email or Password incorrect");
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

function toggleDarkMode() {
  console.log(flag);
  if (flag) {
    var img = document.querySelector(".logo");
    img.src = "../img/1.png";
    localStorage.setItem("isDark",false);
    flag = 0;
  } else {
    var img = document.querySelector(".logo");
    img.src = "../img/2.png";
    localStorage.setItem("isDark",true);
    flag = 1;
  }
  var element = document.body;
  element.classList.toggle("dark-mode");
}
