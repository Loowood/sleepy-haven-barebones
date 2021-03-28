require 'faye'

faye_server = Faye::RackAdapter.new(:mount => '/faye', :timeout => 30)
run faye_server
