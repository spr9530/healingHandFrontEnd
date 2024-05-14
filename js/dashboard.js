const userInfoContainer = document.getElementById('userInfo')
const informationDiv = document.getElementById('userFormInfo')
const cookies = document.cookie;
const token = cookies.split('=')[1]


const body = document.querySelector('.wrapper')
body.style.display = 'none'


const getUserInfo = async () => {
    try {
        const spinner = document.getElementById('spinner');
        spinner.style.display = "block"; // Show spinner while fetching data

        const response = await fetch("https://healing-hand-backend-5l5y.vercel.app/userInfo", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            window.location.href = "404.html"
        }

        const data = await response.json();

        let info = "";
        if (data.length === 0) {
            info += `<tr><td>No Users Yet</td></tr>`;
        } else {
            let count = 0;
            let newData = data.slice().reverse()
            newData.forEach(user => {
                count++;
                info += `<tr id="userRow${count}" onclick="removeUnread('userRow${count}')" ${user.read === 'unread' ? `style="background: #c1f0e6;"` : ``}>
                                    <td>${count}</td>
                                    <td>${user.userName}</td>
                                    <td>${user.phone}</td>
                                    <td>${user.time}</td>
                                    <td><span class="badge text-uppercase"><a href="tel:${user.phone}"> <i class="fas fa-phone-alt me-2"></i></a> <a href="https://wa.me/${user.phone}"><i class="bi bi-whatsapp"></i></a></td>
                                    <td class="impBtn" onclick="showInfo('${user._id}')"><p class="button gray"><i class="fa fa-eye"></i>
                                            View</p></td>
                                    <td class="impBtn" onclick="sureDelete('${user._id}')"><i class="bi bi-x-circle ms-2"></i></td>
                                </tr>`;
            });
        }
        userInfoContainer.innerHTML = info;
        spinner.style.display = "none"; // Hide spinner after data is loaded
        console.log('done');

    } catch (error) {
        console.log("Error:", error);
        // Handle error, maybe show an error message to the user
    }
};

const removeUnread = (id) => {
    const element = document.getElementById(id);
    if (element) {
        setTimeout(() => {
            element.style.background = "";
        }, 1500);
    } else {
        console.log(`Element with id ${id} not found.`);
    }
};

const markUnread = async (id) => {
    const response = await fetch(`https://healing-hand-backend-5l5y.vercel.app/updateUser/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            read: 'read',
        })
    })


}

const sureDelete = (id) => {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = "block";

    const cancelDelete = () => {
        errorMessage.style.display = "none";
    };

    const confirmDelete = async () => {
        document.getElementById('deleteSpinner').style.visibility = 'visible'
        document.getElementById('deleteSpinner').style.opacity = '1'

        await deleteUser(id);
        setTimeout(() => {
            getUserInfo();
            document.getElementById('deleteSpinner').style.visibility = 'hidden'
            document.getElementById('deleteSpinner').style.opacity = '0'
            errorMessage.style.display = "none";
        }, 2000);

    };

    document.getElementById('cancelDelete').addEventListener('click', cancelDelete);
    document.getElementById('sureDelete').addEventListener('click', confirmDelete);
};

const closeInfo = () => {
    if (document.getElementById('userFormInfo')) {
        document.getElementById('userFormInfo').style.display = "none"
    }
}


const deleteUser = async (id) => {
    try {
        const response = fetch(`https://healing-hand-backend-5l5y.vercel.app/deleteUser/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        if (response) {
            const data = await response.json
        }
        else {
            console.log('error')
        }


    } catch (error) {
        console.log('user cant deleted', error)
    }
}


const showInfo = async (id) => {
    try {
        if (informationDiv.style.display !== "flex") {
            informationDiv.style.display = "flex";
        }

        const response = await fetch(`https://healing-hand-backend-5l5y.vercel.app/getUser/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        if (userData && userData.length > 0) {
            informationDiv.innerHTML = `<header>
                <div id="userInfo" class="admin-heading">
                    <h1>${userData[0].userName}</h1>
                    <p>+91 ${userData[0].phone}</p>
                    <p>${userData[0].time}</p>
                    <div class="m-2 mx-0">
                        <a href="tel:${userData[0].phone}"> 
                            <i class="fas fa-phone-alt me-2"></i>
                        </a> 
                        <a href="https://wa.me/${userData[0].phone}">
                            <i class="bi bi-whatsapp"></i>
                        </a>
                    </div>
                </div>
                <div class="admin-icon">
                    <div>
                        <span class="badge text-uppercase d-flex">
                            <a onclick="closeInfo()">
                                <i style="font-size: 2rem; color:black" class="bi bi-x"></i>
                            </a>
                        </span>
                    </div>
                    <div></div>
                </div>
            </header>
    
            <div class="admin-buttons">
                ${userData[0].problem.map((prob) => `<button>${prob}</button>`).join('')}
            </div>
    
            <div class="admin-message">
                <h2>Message</h2>
                <p>${userData[0].message}</p>
                <h2>Note</h2>
                <div class="admin-note">
                    <textarea id="userNote" type="text" value="${userData[0].note}" disabled></textarea>
                    <button onclick="editNote('${userData[0]._id}')" id="editBtn">Edit <i class="bi bi-pencil-fill"></i></button>
                </div>
            </div>`;
        } else {
            informationDiv.innerHTML = `<div></div>`;
        }

        markUnread(id);
    } catch (error) {
        console.error('Error displaying user info:', error);
        // Optionally, provide feedback to the user about the error
    }
};


const editNote = (id) => {
    const editButton = document.getElementById('editBtn')
    const note = document.getElementById('userNote')

    editButton.innerText = "save"
    note.disabled = false

    editButton.addEventListener('click', () => {
        saveInfo(id, note.value)
        note.disabled = true
        editButton.innerText = "edit"
    })
}


const saveInfo = async (id, text) => {

    const response = await fetch(`https://healing-hand-backend-5l5y.vercel.app/updateUser/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            note: text,
        })
    })

    return;
}

const logOutUser = () => {
    deleteCookie('jwt_token')
    window.location.replace('http://127.0.0.1:5500/admin.html');
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

const searchUser = () => {
    let input = document.getElementById('searchUser').value
    let users = document.querySelectorAll('tr');
    
    if (users) {
        users.forEach((user) => {
            if (!user.textContent.trim().includes(input)) {
                user.style.display = 'none'
            }
        })
    }
    else {
        console.log('no user')
    }

}


getUserInfo()

window.addEventListener('load', function () {
    setTimeout(function () {
        document.querySelector('#spinner').style.opacity = '0';
        document.querySelector('#spinner').style.visibility = 'hidden';
        body.style.display = 'block'
        body.style.transition = 'all 1s'
    }, 2000);
});