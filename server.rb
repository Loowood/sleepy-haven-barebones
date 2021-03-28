require 'sinatra'
require 'sinatra/reloader'
require 'sinatra-websocket'

set :server, 'thin'
set :sockets, []

get '/' do
    if !request.websocket?
        erb :index
    else
        request.websocket do |ws|
            ws.onopen do
                ws.send("Hello World!")
                settings.sockets << ws
            end
            ws.onmessage do |msg|
                EM.next_tick { settings.sockets.each{|s| s.send(msg) } }
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
