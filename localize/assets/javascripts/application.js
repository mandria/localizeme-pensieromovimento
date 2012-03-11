var json = [];
var nodes = [];
var update;

$(document).ready(function() {
  var paper = Raphael($('#canvas')[0], settings.map.width + 1, settings.map.height + 1);

  var animation = function(circle) {
    circle.animate({fill: "#223fa3", stroke: "#000", "stroke-width": 8, "stroke-opacity": 0.3}, 500, function() {
      circle.animate({fill: "#FFF", stroke: "#000", "stroke-width": 4, "stroke-opacity": 0.7}, 500, function() {
        animation(circle);
      })
    });
  };
  
  update = function(data) {
    updateNodes(data);
    //updateLog(data);
    json = data;
  };

  var updateLog = function(data) {
    $('#log').empty();
    for (var i=0; i<data.length; i++) {
      $('#log').append(JSON.stringify(data[i]) + '<br/>')
    }
  }

  var updateNodes = function(data) {
    for (var i=0; i<data.length; i++) {
      updateNode(data[i]);
    }
  }

  var updateNode = function(node) {
    var found = false;
    var circles = $('circle');
    for (var i=0; i<circles.length; i++) {
      if ($(circles[i]).data('node')._id == node._id) {
        found = $(circles[i]);
      }
    }
    found ? moveNode(found, node) : initNode(node);
  }

  var moveNode = function(found, node) {
    $(found).data('node', node);
    //$(found).animate({cx: node.absolute.x * 1000, cy: node.absolute.y * 1000}, 1000);
    $(found).attr('cx', node.absolute.x * settings.map.width);
    $(found).attr('cy', node.absolute.y * settings.map.height);
  }

  var initNode = function(node) {
    var circle = paper.circle(node.absolute.x * settings.map.width, node.absolute.y * settings.map.height, 5);
    $(circle.node).data('node', node);
    animation(circle);
    nodes.push(circle);
  }

  var initCameras = function() {
    var cameras = settings.cameras.fake;
    for (var i=0; i<cameras.length; i++) { initCamera(cameras[i]); }
    var cameras = settings.cameras.real;
    for (var i=0; i<cameras.length; i++) { initCamera(cameras[i]); }
  }

  var initCamera = function(camera) {
    var x = settings.map.width * camera.positions.x;
    var y = settings.map.height * camera.positions.y;
    var width = settings.map.width * camera.dimensions.width;
    var height = settings.map.height * camera.dimensions.height;
    var c = paper.rect(x, y, width, height).attr({fill: '#ff2b7b', 'stroke-width': 0.25});
    $(c.node).data('port', camera.id);
    $(c.node).click(generateNode);
  }

  initCameras();

  // Generate a new node when clicking on a camera area.
  //
  // This function is useful for testing puposes where you
  // can simulate a new node and ckeck logic behaviours like
  // two nodes too closed to each others.
  function generateNode(e) {
    var port = $(this).data('port');
    var map = settings.map;
    var camera = findCamera(port);
    var url  = 'http://localhost:' + port + '/nodes';

    var data = {
      camera: port, 
      id: Math.floor(Math.random()*1000),
      centroid: {
        x: ((e.clientX - $(this).position().left)/(map.width * camera.dimensions.width)),
        y: ((e.clientY - $(this).position().top)/(map.height * camera.dimensions.height))
      }
    }

    $.ajax({
      type: 'POST',
      contentType: "application/json", // this makes CORS working
      url: url,
      data: JSON.stringify(data),
      success: function(){ console.log('done'); },
      dataType: 'json',
    });
  }

  function findCamera(id) {
    return _.filter(settings.cameras.fake, function(camera){ 
      return camera.id == id.toString(); 
    })[0]; 
  }
  

});
