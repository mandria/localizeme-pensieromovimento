# -------------------
# Initialization
# -------------------

express  = require 'express'
app      = express.createServer()
io       = require('socket.io').listen(app)
settings = new require('./assets/javascripts/settings')

app.use('/assets', express.static __dirname + '/assets')
app.listen 4000



# ----------
# Models
# ----------

mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/localize'

Node = mongoose.model 'node', new mongoose.Schema
    camera : String   # camera ID
    id     : String   # blob node ID
    relative:         # position into single camera (%)
      x : Number
      y : Number
    absolute:         # position into whole map (%)
      x : Number
      y : Number

Node.remove {}, -> console.log "Removed all stored records"



# ---------------
# Controller
# ---------------

app.get '/', (req, res) ->
  res.sendfile(__dirname + '/index.html')



# -------------------
# WebSocket Server
# -------------------

io.sockets.on 'connection', (socket) ->
  socket.emit 'connected', { message: 'Client successfully connected.' }
  socket.on 'disconnect', -> console.log 'Client disconnected.'


# Send updated nodes
emitNodes = ->
  Node.find {}, (err, docs) ->
    io.sockets.json.emit 'nodes', docs



# -------------------------------------
# WebSocket Client for *real* cameras
# -------------------------------------

settings.cameras.real.forEach (camera) ->
  client = require('websocket').client
  socket = new client()
  
  socket.connect 'ws://192.168.1.150:' + camera.id, 'tsps-protocol'

  socket.on 'connect', (connection) ->
    port = @socket._peername.port
    console.log '> Connected to camera', port

    connection.on 'error', (error) -> console.log '> Error connection to camera', port
    connection.on 'close', -> console.log '> Camera connection closed', port

    connection.on 'message', (data) ->
      data = JSON.parse data.utf8Data
      setNode data, port, settings.cameras.real



# -------------------------------------
# WebSocket Client for *fake* cameras
# -------------------------------------

settings.cameras.fake.forEach (camera) -> 
  socket = require('socket.io-client').connect('http://localhost:' + camera.id)

  socket.on 'connected', (data) -> console.log '> Connected to camera', @socket.options.port
  socket.on 'disconnect', (data) -> console.log '> Disconnected from camera', @socket.options.port

  socket.on 'message', (data) ->
    port = this.socket.options.port
    console.log '> Message received from', port
    set_node data, port, settings.cameras.fake



# -------------
# Set node
# -------------

set_node = (data, port, cameras) ->
  camera = (camera for camera in cameras when camera.id == port)[0]

  Node.findOne {id: data.id, camera: port}, (err, node) ->
    if node 
      update_node node, data, camera
    else
      new_node data, port, camera

# -------------
# Update node
# -------------

update_node = (node, data, camera) ->
  node.relative.x = data.centroid.x
  node.relative.y = data.centroid.y
  absolutize node, camera
  save_node node
  return node

# -------------
# Create node
# -------------

new_node = (data, port, camera) ->
  node = new Node
    camera: port 
    id: data.id 
    'relative.x': data.centroid.x
    'relative.y': data.centroid.y

  absolutize node, camera
  save_node node
  return node

# ---------------
# Save the node
# ---------------

save_node = (node) ->
  node.save (err) ->
    console.log "> Error ", err if (err)
    emitNodes()

# ------------------------
# Set the absolute value
# ------------------------

absolutize = (node, camera) ->
  node.absolute.x = camera.positions.x + (camera.dimensions.width * node.relative.x)
  node.absolute.y = camera.positions.y + (camera.dimensions.height * node.relative.y)
