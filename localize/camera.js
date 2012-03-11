// -------------------
// Initialization
// -------------------

var program = require('commander');

program
  .version('0.1')
  .option('-p, --port <port>', 'specify the port [4001]', Number, 4001)
  .option('-m, --manual', 'Manual node generation with click on camera area')
  .parse(process.argv);


if (!program.port) {
  console.log("> Specify the port [4001].");
  process.exit(1);
} else {
  console.log("> Running on port", program.port);
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

app.listen(program.port);




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

if (!program.manual) {
  Node.remove({camera: program.port}, function(){});
  var node = new Node({camera: program.port, 'id': "4382", 'centroid.x': 0.02193, 'centroid.y': 0.89002});
  node.save();

  // Every n seconds the updated node position is given
  setInterval(update, Math.random()*5000);
}


// -------------
// Logic
// -------------


function update(){
  console.log('Updating camera');
  Node.update({camera: program.port}, {'centroid.x': Math.random(), 'centroid.y': Math.random()}, {}, sync)
};

function sync(err, num) {
  Node.findOne({ camera: program.port}, function (err, doc){
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
  res.send(node);
})




// --------------
// WebSocket
// --------------

io.sockets.on('connection', function(socket) {
  // notifies clients on connection
  socket.emit('connected', { 
    message: 'Successfully connected to ' + program.port
  });
  // Notified by a client being disconnected
  socket.on('disconnect', function() {
    console.log('Client disconnected.');
  });
});
