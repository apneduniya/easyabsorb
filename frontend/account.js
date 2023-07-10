
if (localStorage.getItem("email") && localStorage.getItem("password")) {
  window.location.href = '/frontend/index.html';
}

let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()

let changeForm = (e) => {

  switchCtn.classList.add("is-gx");
  setTimeout(function () {
    switchCtn.classList.remove("is-gx");
  }, 1500)

  switchCtn.classList.toggle("is-txr");
  switchCircle[0].classList.toggle("is-txr");
  switchCircle[1].classList.toggle("is-txr");

  switchC1.classList.toggle("is-hidden");
  switchC2.classList.toggle("is-hidden");
  aContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-txl");
  bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
  for (let i = 0; i < allButtons.length; i++)
    allButtons[i].addEventListener("click", getButtons);
  for (let i = 0; i < switchBtn.length; i++)
    switchBtn[i].addEventListener("click", changeForm)
}

const register = async (event) => {

  event.preventDefault(); // Prevent the form from submitting and refreshing the page

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;


  // console.log(name, email, password);

  await fetch('http://localhost:8000/user/register', {
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "password": password,
      "username": name
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
    .then(async response => {
      const data = await response.json();
      console.log(data);
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);

      window.location.href = '/frontend/index.html';
    })
    .catch(error => {
      console.log(error);
      alert("Error...")
    });
}


const login = async (event) => {

  event.preventDefault(); // Prevent the form from submitting and refreshing the page

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // console.log(name, email, password);

  await fetch('http://localhost:8000/user/login', {
    method: 'POST',
    body: JSON.stringify({
      "email": email,
      "password": password,
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
    .then(async response => {
      const data = await response.json();
      console.log(data);
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);

      window.location.href = '/frontend/index.html';
    })
    .catch(error => {
      console.log(error);
      alert("Error...")
    });
}

window.addEventListener("load", mainF);