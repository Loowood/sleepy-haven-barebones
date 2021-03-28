function displayMessage(pseudo, message) {
    let messageList = document.getElementById("msg-list");
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.appendChild(document.createTextNode(pseudo + " : " + message));
    messageList.appendChild(li);

    document.getElementById("input").value = ""
};

const ws = new WebSocket('wss://' + window.location.host);
let pseudo;

function handleTyping(ele) {
    if(event.key === 'Enter') {
        toSend = JSON.stringify({"type": "message", "pseudo" : pseudo, "message": ele.value})
        ws.send(toSend);
    }
}

window.onload = function(){
    // var ws       = new WebSocket('wss://' + window.location.hostname + ':4567/websockets');
    ws.onopen    = function()  { console.log('websocket opened'); };
    ws.onclose   = function()  { console.log('websocket closed'); }

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
        }
    };

    pseudo = document.getElementById("pseudo").innerHTML

    var connection = setInterval(ping_wsServer, 30000)
}

function ping_wsServer() {
    ws.send("ping");
}