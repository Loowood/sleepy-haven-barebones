require 'sinatra'
require 'sinatra/reloader'
require 'sinatra-websocket'
require 'json'

set :server, 'thin'
set :sockets, []

get '/' do
    if !request.websocket?
        erb :index
    else
        request.websocket do |ws|
            ws.onopen do
                hashToSend = {"type": "info", "content": "You are connected !"}
                toSend = JSON.generate(hashToSend)
                ws.send(toSend)
                settings.sockets << ws
            end
            ws.onmessage do |raw_data|
                if raw_data == "ping"
                    ws.send("pong")
                    next
                end
                puts raw_data
                data = JSON.parse(raw_data)
                if data["type"] == "message"
                    if data["message"] != ""
                        EM.next_tick { settings.sockets.each{|s| s.send(raw_data) } }
                    end
                end
            end
            ws.onclose do
                warn("websocket closed")
                settings.sockets.delete(ws)
            end
        end
    end
end

post '/chat' do
    erb :chat, :locals => params
end

get '/chat.js' do
    send_file 'chat/chat.js'
end

get '/chat.css' do
    send_file 'chat/chat.css'
end
