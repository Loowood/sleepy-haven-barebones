function displayMessage(pseudo, message) {
    let messageList = document.getElementById("msg-list");
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.style.overflowWrap = "break-word";
    li.style.backgroundColor = "#3a5873";
    li.style.color = "#e6e6e6";
    li.appendChild(document.createTextNode(pseudo + " : " + message));
    messageList.appendChild(li);
    li.scrollIntoView();
};

function updateUserList(data) {
    let usersList = document.getElementById("users-list");
    usersList.innerHTML = ""
    data.map( (pseudo) => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.style.overflowWrap = "anywhere";
        li.style.backgroundColor = "#3a5873";
        li.style.color = "#e6e6e6";
        li.appendChild(document.createTextNode(pseudo));
        usersList.appendChild(li);
    });
}

const ws = new WebSocket('wss://' + window.location.host);
let pseudo;

function handleTyping(ele) {
    if(event.key === 'Enter' && ele.value != "") {
        let toSend = JSON.stringify({"type": "message", "pseudo" : pseudo, "message": ele.value})
        ws.send(toSend);
        ele.value = ""
    }
}

window.onload = function(){
    // var ws       = new WebSocket('wss://' + window.location.hostname + ':4567/websockets');
    ws.onopen    = function()  {
        displayMessage("INFO", "Connecting ...");
        console.log('websocket opened');
        let updateUserData = {"type": "update-user", "pseudo": pseudo};
        let toSend = JSON.stringify(updateUserData);
        ws.send(toSend);
    };
    ws.onclose   = function()  {
        console.log('websocket closed');
        displayMessage("INFO", "You have been disconnected !");
    };

    ws.onmessage = function(m) {

        if (m.data == "pong") {
            console.log(".")
        } else {
            let msg = JSON.parse(m.data);
            console.log(msg)
            if (msg.type == "info") {
                displayMessage("INFO", msg.content);
            }
            if (msg.type == "message") {
                displayMessage(msg.pseudo, msg.message);
            }
            if (msg.type == "update-users") {
                updateUserList(msg.content);
            }
        }
    };

    pseudo = document.getElementById("pseudo").innerHTML

    var connection = setInterval(ping_wsServer, 30000)
}

function ping_wsServer() {
    ws.send("ping");
}