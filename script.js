let users;

if (JSON.parse(localStorage.getItem('Users'))) {
    let localUsers = JSON.parse(localStorage.getItem('Users'));
    users = localUsers;

} else {
    users = [];

}


let authUser;
if (JSON.parse(localStorage.getItem('authUser'))) {
    authUser = JSON.parse(localStorage.getItem('authUser'));
} else {
    authUser = [];
}




function handleSubmit(event) {
    event.preventDefault();

    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById('password').value;

    // let regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
    // let textFieldRegEx = /^[a-zA-Z]+$/;


    // if (regExp.test(password)) {
    //     document.getElementById('passmessage').innerHTML = ""
    // } else {
    //     document.getElementById('passmessage').innerHTML = "password must contain number-digit-special number-length upto 8 "
    //     return false;
    // }

    // if (textFieldRegEx.test(fname)) {
    //     document.getElementById('namemessage').innerHTML = ""
    // } else {
    //     document.getElementById('namemessage').innerHTML = "Name not contain any digit"
    //     return false;
    // }
    const time = new Date();

    const obj = {
        userId: users.length + 1,
        firstName: fname,
        lastName: lname,
        userEmail: email,
        userPassword: password,
        createdTime: time,
        message: []
    }

    if (users.length > 0) {
        for (const value of users) {
            value.message.push({
                otherUserId: obj.userId,
                Name: obj.firstName,
                chatHistory: []
            });

            obj.message.push({
                otherUserId: value.userId,
                Name: value.firstName,
                chatHistory: []
            });

        }
    }

    users.push(obj);

    let usersString = JSON.stringify(users);
    localStorage.setItem("Users", usersString);



}

function handleLogin(event) {
    event.preventDefault();
    let userFound = false;
    let loginemail = document.getElementById("email").value;
    let loginPassword = document.getElementById("password").value;

    let usersData = localStorage.getItem("Users");

    let usersObj = JSON.parse(usersData);

    if (usersObj == null) {
        document.getElementById('loginmessage').innerHTML = "user not found";
    }

    for (const value of usersObj) {
        if (value.userEmail == loginemail && value.userPassword == loginPassword) {
            console.log('user exits')
            userFound = true;
            value["lastLogin"] = new Date();
            for (const user of usersObj) {

                for (const message of user.message) {
                    if (message.otherUserId === value.userId) {

                        message.lastLogin = value.lastLogin;
                    }
                }
            }
            let usersString = JSON.stringify(usersObj);
            localStorage.setItem("Users", usersString);
            authUser[authUser.length] = value;
            let authString = JSON.stringify(authUser);
            localStorage.setItem("authUser", authString);

            window.location.href = "./dashboard.html";
            console.log(usersString);
        }
    }

    if (userFound == false) {
        document.getElementById('errorloginmessage').innerHTML = "Login is incorrect"

        return false;
    } else {
        document.getElementById('successloginmessage').innerHTML = "Login Successfully"
        window.location.href = "./dashboard.html";
    }
}


function handleSignout() {
    localStorage.removeItem('authUser');
    window.location.href = "./login.html";
}

/*User profiles*/


function loginUserAvatar() {
    let name = authUser[0].firstName;
    let avatar = name.slice(0, 2);
    document.getElementById('loginuserAvatar').innerHTML = avatar;
    document.getElementById('chatuserAvatar').innerHTML = avatar;
}

loginUserAvatar();


const profiles = () => {
    let loginUser = authUser[0].userId
    console.log("login id : " +
        loginUser)
    for (const value of users) {
        if (value.userId == loginUser) {
            for (const message of value.message) {
                const list = document.createElement("li");
                list.innerHTML = `${message.Name} `;
                const username = message.Name;
                const userLogo = username.slice(0, 2);
                const spanlogo = document.createElement("li");
                spanlogo.innerHTML = userLogo;
                const userTime = document.createElement("li");
                const lastLoginDate = new Date(message.lastLogin);

                const hours = lastLoginDate.getHours();
                const minutes = lastLoginDate.getMinutes();

                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                userTime.innerHTML = `${formattedTime}`;

                userTime.style.textAlign = "right";
                userTime.style.color = "var(--icon-color)";
                userTime.style.fontSize = '13px'


                const styles = {

                    fontSize: '18px',
                    fontFamily: 'var(--text-font-family)',
                    marginLeft: '20px',
                    width: '70%'
                };

                const logoStyles = {
                    fontSize: '18px',
                    fontFamily: 'var(--heading-font-family)',
                    backgroundColor: '#fbb238',
                    color: 'var(--background-color)',
                    borderRadius: '50px',
                    padding: '7px',
                    textTransform: 'uppercase',


                };

                let column1 = document.getElementById("chatscreen-column1");
                let column2 = document.getElementById("chatscreen-column2");
                let backIcon = document.getElementById("back-icon");

                function handleScreenSize(tabScreen) {


                    if (tabScreen.matches) {

                        column2.style.display = "none";

                        list.addEventListener("click", () => {
                            backIcon.style.display = "inline-block";
                            column1.style.display = "none";

                            column2.style.display = "block";

                        })
                        backIcon.addEventListener("click", () => {
                            column1.style.display = "block";
                            column2.style.display = "none";
                        })
                    } else {
                        column1.style.display = "block";
                        column2.style.display = "block";
                    }
                }


                let tabScreen = window.matchMedia("(max-width:768px)");


                tabScreen.addEventListener("change", () => {
                    handleScreenSize(tabScreen);

                })


                Object.assign(spanlogo.style, logoStyles);
                Object.assign(list.style, styles);


                const container = document.createElement("div");
                container.style.display = "flex";
                container.style.alignItems = "center";

                container.style.borderBottom = "1px solid #ecebeb";
                container.style.padding = "10px 15px";
                container.style.cursor = "pointer";
                container.onclick = () => {
                    startChat(message.otherUserId);
                }

                container.appendChild(spanlogo);
                container.appendChild(list);
                container.appendChild(userTime);
                container.addEventListener('mouseover', () => {
                    container.style.backgroundColor = 'var(--dark-grey)';
                })
                container.addEventListener('mouseout', () => {
                    container.style.backgroundColor = 'white';
                })


                document.getElementById("profile").appendChild(container);

            }
        }
    }




}


profiles();



let messageId = 0;

function startChat(receiverId) {
    let loginUser = authUser[0].userId
    for (const value of users) {
        if (value.userId == loginUser) {
            for (const message of value.message) {
                if (message.otherUserId == receiverId) {
                    let name = message.Name;
                    let logo = name.slice(0, 2);
                    document.getElementById('reciever-logo').innerHTML = logo;
                    document.getElementById('receiver-name').innerHTML = name;
                    displayChatHistory(message.chatHistory, loginUser);
                    document.getElementById('sendMessage').addEventListener('click', () => {
                        let inputMessage = document.getElementById('text').value;

                        const obj = {
                            msg_id: messageId++,
                            msg_time: new Date(),
                            text: inputMessage,
                            sid: value.userId
                        }

                        message.chatHistory.push(obj);
                        for (const otheruser of users) {
                            if (otheruser.userId == receiverId) {
                                for (const messagecopy of otheruser.message) {
                                    if (messagecopy.otherUserId == loginUser) {
                                        messagecopy.chatHistory.push(obj)
                                        break;
                                    }
                                }
                            }
                        }
                        console.log("message send")

                        let usersString = JSON.stringify(users);
                        localStorage.setItem("Users", usersString);
                        document.getElementById('text').value = '';

                        displayChatHistory(message.chatHistory, loginUser);
                    })

                }
            }
        }
    }


}

function displayChatHistory(chatHistory, loginUser) {

    const chatWindowBody = document.getElementById('chat-window-body');
    chatWindowBody.innerHTML = '';
    for (const value of chatHistory) {
        const container = document.createElement("div");
        const messageParagraph = document.createElement("p");
        messageParagraph.innerHTML = value.text;
        const messageTime = document.createElement("p");

        const messageDate = new Date(value.msg_time);

        const minutes = messageDate.getMinutes();
        const seconds = messageDate.getSeconds();

        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        messageTime.innerHTML = `${formattedTime}`;
        messageTime.style.color = "var(--icon-color)";
        messageTime.style.fontSize = "13px";
        messageTime.style.margin = "0px";
        messageParagraph.style.marginBottom = "0px";

        if (value.sid == loginUser) {
            container.classList.add('sender-message');
        } else {
            container.classList.add('receiver-message');
        }
        container.appendChild(messageParagraph);
        container.appendChild(messageTime);
        document.getElementById('chat-window-body').appendChild(container);
    }


}







document.getElementById('reciever-logo').innerHTML = "No User Selected";




// const profiles = () => {
//     for (const value of users) {
//         if (value.userId !== authUser[0].userId) {
//             const list = document.createElement("li");
//             list.innerHTML = `${value.firstName}`;
//             list.style.cursor = "pointer";
//             list.onclick = () => showchatScreen(value.userId);
//             document.getElementById("profile").appendChild(list);
//         }
//     }
// }



// function showchatScreen(receiverid) {
//     console.log("jis sy chat krni hy " + receiverid)
//     authId = authUser[0].userId;
//     const obj = {
//         type: authId,
//         message: "",
//         receiveId: receiverid,

//     }

//     console.log("jis user ka object update krna hy " + authId)
//     for (let i = 0; i < users.length; i++) {


//         if (users[i].userId == authId) {
//             console.log("login array updated " + users[i].userId)
//             users[i].chat.push(obj);
//             let usersString = JSON.stringify(users);
//             localStorage.setItem("Users", usersString);
//         }

//     }

//     document.getElementById("chat-screen").style.display = "block";
// }


// profiles();


// function sendMessage() {
//     let message = document.getElementById("text").value;
//     let authId = authUser[0].userId;
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].userId == authId) {
//             //console.log("chat length " + users[i].chat[users[i].chat.length - 1])
//             users[i].chat[users[i].chat.length - 1].message = message;
//             let usersString = JSON.stringify(users);
//             localStorage.setItem("Users", usersString);

//             showChat();
//         }
//         break;
//     }


// }

// function showChat() {
//     let authId = authUser[0].userId;
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].userId == authId) {
//             for (const value of users[i].chat) {
//                 if (value.type == authId) {
//                     if (value.message == null) {
//                         continue;
//                     } else {
//                         let senderMessage = value.message;

//                         document.getElementById('sender-message').innerHTML += senderMessage;

//                     }
//                 }
//                 if (value.receiveId == authId) {
//                     if (value.message == null) {
//                         continue;
//                     } else {
//                         let recMessage = value.message;
//                         document.getElementById('receiver-message').innerHTML += recMessage;

//                     }
//                 }
//             }
//         }
//     }
// }