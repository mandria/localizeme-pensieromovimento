var json = [];
var nodes = [];
var update;

$(document).ready(function() {
  var paper = Raphael($('#canvas')[0], settings.map.width + 1, settings.map.height + 1);
  $('#map').attr('width', map.width);
  $('#map').attr('height', map.height);

  var animation = function(circle) {
    circle.animate({fill: "#223fa3", stroke: "#000", "stroke-width": 3, "stroke-opacity": 0.3}, 500, function() {
      circle.animate({fill: "#FFF", stroke: "#000", "stroke-width": 2, "stroke-opacity": 0.7}, 500, function() {
        animation(circle);
      })
    });
  };
  
  update = function(data) {
    updateNodes(data);
    updateLog(data);
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
      if ($(circles[i]).data('node')) {
        if ($(circles[i]).data('node')._id == node._id) {
          found = $(circles[i]);
        }
      }
    }
    found ? moveNode(found, node) : initNode(node);
  }

  var moveNode = function(found, node) {
    $(found).data('node', node);
    $(found).attr('cx', node.absolute[0] * settings.map.width);
    $(found).attr('cy', node.absolute[1] * settings.map.height);

    var contour = $(found).data('contour');
    $(contour).attr('cx', node.absolute[0] * settings.map.width);
    $(contour).attr('cy', node.absolute[1] * settings.map.height);
  }

  var initNode = function(node) {
    var x = node.absolute[0] * settings.map.width;
    var y = node.absolute[1] * settings.map.height;
    var circle  = paper.circle(x, y, 2);
    $(circle.node).data('node', node);

    var camera = findCamera(node.camera);
    var radius = map.width * camera.merge;
    var contour = paper.circle(x, y, radius).attr({'fill-opacity': '0.8', 'stroke-width': 0.25, stroke: '#ff2b7b'});
    $(circle.node).data('contour', contour.node);

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
    var c = paper.rect(x, y, width, height).attr({fill: '#eee', 'stroke-width': 0.25, stroke: '#ff2b7b'});
    //paper.path("M 10 115 l 10 0").attr({stroke: '#fff', 'stroke-width': 0.25});
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
    var x = ((e.clientX - $(this).attr('x'))/(map.width * camera.dimensions.width));
    var y = ((e.clientY - $(this).attr('y'))/(map.height * camera.dimensions.height));

    var data = {
      camera: port, 
      id: Math.floor(Math.random()*1000000),
      centroid: { x: x, y: y }
    }

    $.ajax({
      type: 'POST',
      contentType: "application/json", // this makes CORS working
      url: url,
      data: JSON.stringify(data),
      dataType: 'json',
    });
  }

  function findCamera(id) {
    return _.filter(settings.cameras.fake, function(camera){ 
      return camera.id == id.toString(); 
    })[0]; 
  }
  

});
