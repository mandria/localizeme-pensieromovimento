// -------------------
// Initialization
// -------------------

var port = process.argv.splice(2)[0];
console.log(port);

if (!port) {
  console.log("> Insert a :port number when running server");
  process.exit(1);
} else {
  console.log("> Running on port", port);
}

var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(port);



// ----------
// Models
// ----------

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/localize_mock')

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Node = new Schema({
    camera : String        // camera ID
  , id     : String        // blob node ID
  , centroid : {
      x      : Number        // x pos
    , y      : Number        // y pos
  }
});

Node = mongoose.model('Node', Node);

Node.remove({camera: port}, function(){});
var node = new Node({camera: port, 'id': "4382", 'centroid.x': 0.02193, 'centroid.y': 0.89002});
node.save();



// --------------
// Controller
// -------------

// Every 5 seconds the updated node position is given
setInterval(update, Math.random()*5000);

function update(){
  console.log('Updating camera');
  Node.update({camera: port}, {'centroid.x': Math.random(), 'centroid.y': Math.random()}, {}, sync)
};

function sync(err, num) {
  Node.findOne({ camera: port}, function (err, doc){
    io.sockets.json.emit('message', doc);
  })
}



// --------------
// WebSocket
// --------------

io.sockets.on('connection', function(socket) {
  // notifies clients on connection
  socket.emit('connected', { 
    message: 'Successfully connected to ' + port
  });
  // Notified by a client being disconnected
  socket.on('disconnect', function() {
    console.log('Client disconnected.');
  });
});
