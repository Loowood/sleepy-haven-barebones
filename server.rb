require 'sinatra'
require 'sinatra/reloader'
require 'sinatra-websocket'
require 'json'

set :server, 'thin'
set :sockets, []
set :connectedUsers, []

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
                elsif data["type"] == "update-user"
                    if data["pseudo"] == ""
                        wrongPseudoHash = {"type": "info", "content": "You can't have a blank pseudo !"}
                        hashToSend = JSON.generate(wrongPseudoHash)
                        ws.send(hashToSend);
                        settings.sockets.delete(ws)
                    else
                        settings.connectedUsers << {"socket": ws, "pseudo": data["pseudo"]}
                        newConnection = {"type": "info", "content": data["pseudo"] + " has connected !"}
                        userList = {"type": "update-users", "content": settings.connectedUsers.map { |x| x[:pseudo] }}
                        EM.next_tick do 
                            settings.sockets.each do |s|
                                if s != ws
                                    s.send(JSON.generate(newConnection))
                                end
                                s.send(JSON.generate(userList))
                            end
                        end
                    end
                end
            end
            ws.onclose do
                warn("websocket closed")

                # Removing the user
                settings.sockets.delete(ws)
                pseudoLeaving = settings.connectedUsers.select { |x| x[:socket] == ws }
                settings.connectedUsers.delete(pseudoLeaving[0])
                
                # Updating Users
                userList = {"type": "update-users", "content": settings.connectedUsers.map { |x| x[:pseudo] }}
                EM.next_tick do 
                    settings.sockets.each do |s|
                        s.send(JSON.generate(userList))
                    end
                end
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
