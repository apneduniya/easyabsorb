

const upload = async (event) => {

    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    const fileInput = document.getElementById('file');
    fileInput.onchange = () => {
        const selectedFile = fileInput.files[0];
        console.log(selectedFile);
    }
    const fileDesc = document.getElementById('fileDesc').value;
    const categoryName = document.getElementById('categoryName').value;
    const userEmail = document.getElementById('userEmail').value;

    let formData = new FormData();

    formData.append("file", fileInput);
    formData.append("fileDesc", fileDesc);
    formData.append("categoryName", categoryName);
    formData.append("userEmail", userEmail);

    await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        body: formData,
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