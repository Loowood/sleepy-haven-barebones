require 'em-websocket'

@sockets = []

EM.run {
    puts "Starting"

    EM::WebSocket.run(:host => "0.0.0.0", :port => 4568) do |ws|
        ws.onopen do
            ws.send("You are connected !")
        @sockets << ws
        end

        ws.onmessage do |msg|
            EM.next_tick { @sockets.each{|s| s.send(msg) } }
        end

        ws.onclose do
            warn("websocket closed")
            @sockets.delete(ws)
        end
    end
}