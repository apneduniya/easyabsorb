
if (!localStorage.getItem("email") || !localStorage.getItem("password")) {
  window.location.href = '/frontend/account.html';
}

const html = document.documentElement;
const body = document.body;
const menuLinks = document.querySelectorAll(".admin-menu a");
const collapseBtn = document.querySelector(".admin-menu .collapse-btn");
const toggleMobileMenu = document.querySelector(".toggle-mob-menu");
const switchInput = document.querySelector(".switch input");
const switchLabel = document.querySelector(".switch label");
const switchLabelText = switchLabel.querySelector("span:last-child");
const collapsedClass = "collapsed";
const lightModeClass = "light-mode";

/*TOGGLE HEADER STATE*/
collapseBtn.addEventListener("click", function () {
  body.classList.toggle(collapsedClass);
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "collapse menu"
    ? this.setAttribute("aria-label", "expand menu")
    : this.setAttribute("aria-label", "collapse menu");
});

/*TOGGLE MOBILE MENU*/
toggleMobileMenu.addEventListener("click", function () {
  body.classList.toggle("mob-menu-opened");
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "open menu"
    ? this.setAttribute("aria-label", "close menu")
    : this.setAttribute("aria-label", "open menu");
});

/*SHOW TOOLTIP ON MENU LINK HOVER*/
for (const link of menuLinks) {
  link.addEventListener("mouseenter", function () {
    if (
      body.classList.contains(collapsedClass) &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      const tooltip = this.querySelector("span").textContent;
      this.setAttribute("title", tooltip);
    } else {
      this.removeAttribute("title");
    }
  });
}

/*TOGGLE LIGHT/DARK MODE*/
if (localStorage.getItem("dark-mode") === "false") {
  html.classList.add(lightModeClass);
  switchInput.checked = false;
  switchLabelText.textContent = "Light";
}

switchInput.addEventListener("input", function () {
  html.classList.toggle(lightModeClass);
  if (html.classList.contains(lightModeClass)) {
    switchLabelText.textContent = "Light";
    localStorage.setItem("dark-mode", "false");
  } else {
    switchLabelText.textContent = "Dark";
    localStorage.setItem("dark-mode", "true");
  }
});

const greetByTime = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const greetingText = document.getElementById("greeting");

  if (currentHour >= 5 && currentHour < 12) {
    greetingText.innerHTML = "Good morning!";
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingText.innerHTML = "Good afternoon!";
  } else if (currentHour >= 17 && currentHour < 21) {
    greetingText.innerHTML = "Good evening!";
  } else {
    greetingText.innerHTML = "Good night!";
  }
}

const userEmail = document.getElementById("user-email");
userEmail.innerHTML = localStorage.getItem("email");

const motivation = document.getElementById("motivation");
motivation.innerHTML = "“The best way to predict your future is to create it.” —Abraham Lincoln.";

// Call the function to see the greeting
greetByTime();

// Get the modal
const uploadModal = document.getElementById("myUploadModal");
const categoryModal = document.getElementById("myCategoryModal");

// When the user clicks on the button, open the modal
const openUploadModel = () => {
  console.log("hello");
  uploadModal.style.display = "block";
}

const openCategoryModel = () => {
  console.log("hello");
  categoryModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === uploadModal) {
    uploadModal.style.display = "none";
  }

  else if (event.target === categoryModal) {
    categoryModal.style.display = "none";
  }
}

const getCategories = async () => {

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');


  // console.log(name, email, password);

  await fetch('http://localhost:8000/category/get', {
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
      console.log(data.message);
      const categoryContainer = document.getElementById("category-container");
      let categoryContent = "";
      // Iterate over each element in the array
      data["message"].forEach(element => {
        console.log(element)
        // Concatenate the HTML tag with the element
        categoryContent += "<li><a>" + element + "</a></li>";
      });

      categoryContainer.innerHTML = categoryContent;
    })
    .catch(error => {
      console.log(error);
      alert("Error...")
    });
}

const func = async () => {
  await getCategories();
}

func()


const handleUpload = (event) => {


  console.log("test")
  event.preventDefault(); // Prevent the form from submitting and refreshing the page

  const fileDesc = document.getElementById('file-description').value;
  const categoryName = document.getElementById('category-name').value;

  const fileInput = document.getElementById('file');
  fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
    console.log(selectedFile);
  }

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  let formData = new FormData();
  formData.append("fileDesc", fileDesc);
  formData.append("categoryName", categoryName);
  formData.append("file", fileInput);
  formData.append("userEmail", email);
  formData.append("password", password);

  console.log(formData)

  formData = `
  ------WebKitFormBoundaryAWmm2rFpmUs2Lplu
Content-Disposition: form-data; name="fileDesc"

${fileDesc}
------WebKitFormBoundaryAWmm2rFpmUs2Lplu
Content-Disposition: form-data; name="categoryName"

${categoryName}
------WebKitFormBoundaryAWmm2rFpmUs2Lplu
Content-Disposition: form-data; name="userEmail"

${email}
------WebKitFormBoundaryAWmm2rFpmUs2Lplu
Content-Disposition: form-data; name="password"

${password}
------WebKitFormBoundaryAWmm2rFpmUs2Lplu
Content-Disposition: form-data; name="file"; filename="logo.png"
Content-Type: image/png

${fileInput}
------WebKitFormBoundaryAWmm2rFpmUs2Lplu--`

  fetch('http://localhost:8000/upload/upload', {
    method: 'POST',
    // body: {
    //   "fileDesc": fileDesc,
    //   "categoryName": categoryName,
    //   "file": fileInput,
    //   "email": email,
    //   "password": password
    // },
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data;",
      // "Accept": "application/json"
    }
  })
    .then(async response => {
      const data = await response.json();
      console.log(data);

      // uploadModal.style.display = "none";
    })
    .catch(error => {
      console.log(error);
      console.error("Error...")
    });
}




