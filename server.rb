require 'sinatra'
require 'sinatra/reloader'

set :server, 'thin'
set :sockets, []

get '/chat' do
    send_file "chat/chat.html"
end

get '/chat.js' do
    send_file "chat/chat.js"
end

get '/' do
    send_file 'index.html'
end

post "/chat" do
    @name = params["pseudo"]
    puts "The name is #{@name}"
    erb :chat, { :locals => params }
end