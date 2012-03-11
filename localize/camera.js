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

var express  = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.configure(function() {
  app.use(express.bodyParser()); // used to parse the body content
  app.use(allowCrossDomain);
})

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



// -------------
// Logic
// -------------

// Every n seconds the updated node position is given
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
// Controller
// --------------
app.post('/nodes', function(req, res) {
  node = new Node(req.body);
  node.save()
  io.sockets.json.emit('message', node);
  //console.log('< NODE >', node);
  //Node.find({camera: port}, function(err, docs) {
    //console.log('< NODES >', docs);
  //})
})




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
