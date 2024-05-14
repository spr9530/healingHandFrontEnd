
const userName = document.getElementById('name');
const phone = document.getElementById('phone')
const form = document.getElementById('userInfoForm')
const message = document.getElementById('message')
const checkboxElements = document.querySelectorAll('input[type="checkbox"]');
let problem = []


document.getElementById('sendMessageBtn').addEventListener('click', function (e) {
    e.preventDefault();
    problem = []
    document.getElementById("optionError").style.display = "none";
    checkboxElements.forEach((checkBox) => {
        if (checkBox.checked) {
            problem.push(checkBox.name)
        }
    })

    if (!userName || !phone || problem.length == 0 || !message) {

        if (problem.length == 0) {
            document.getElementById("optionError").style.display = "block";
        }
    }
    else (sendInfo(userName.value, phone.value, problem, message.value))

});

const sendInfo = async (userName, phone, problem, message) => {
    const sendData = async (userName, phone, problem, message) => {

        try {
            const response = await fetch('https://healing-hand-backend-5l5y.vercel.app/addUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName,
                    phone,
                    problem,
                    message
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

            const data = await response.json();

            setTimeout(window.location.href = "/thankYou.html", 1500)

            return data;
        } catch (error) {
            console.log('Error:', error);
            throw error; // Propagate the error
        }
    };

    const saveData = await sendData(userName, phone, problem, message)

}

document.getElementById("sendMessageBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const userName = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // Reset error messages
    document.getElementById("nameError").style.display = "none";
    document.getElementById("messageError").style.display = "none";
    document.getElementById("phoneError").style.display = "none";


    // Validate input fields
    let hasError = false;
    if (!userName.trim()) {
        document.getElementById("nameError").style.display = "block";
        hasError = true;
    }
    if (!phone.trim()) {
        document.getElementById("phoneError").style.display = "block";
        hasError = true;
    }
    if (!message.trim()) {
        document.getElementById("messageError").style.display = "block";
        hasError = true;
    }

   
});



