function handleMessage(message) {
    let messageList = document.getElementById("msg-list");
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.appendChild(document.createTextNode(message));
    messageList.appendChild(li);

    document.getElementById("input").value = ""
};

const ws = new WebSocket('wss://localhost:4568');
let pseudo;

function handleTyping(ele) {
    if(event.key === 'Enter') {
        ws.send(pseudo + ":" + ele.value);
    }
}

window.onload = function(){
    // var ws       = new WebSocket('wss://' + window.location.hostname + ':4567/websockets');
    ws.onopen    = function()  { console.log('websocket opened'); };
    ws.onclose   = function()  { console.log('websocket closed'); }

    ws.onmessage = function(m) {
        handleMessage(m.data);
    };

    pseudo = document.getElementById("pseudo").innerHTML
}
/*    (function(){
        var show = function(el){
            return function(msg){ el.innerHTML = msg + '<br />' + el.innerHTML; }
        }(document.getElementById('msgs'));

        console.log(window.location.host)
        console.log(window.location.pathname)

        var ws       = new WebSocket('ws://localhost:4567/websockets');
        ws.onopen    = function()  { show('websocket opened'); };
        ws.onclose   = function()  { show('websocket closed'); }
        ws.onmessage = function(m) { show('websocket message: ' +  m.data); };

        var sender = function(f){
            var input     = document.getElementById('input');
            input.onclick = function(){ input.value = "" };
            f.onsubmit    = function(){
                ws.send(input.value);
                input.value = "send a message";
                return false;
            }
        }(document.getElementById('form'));
    })();
}*/