(function(exports){

  // Map dimension
  map = {
    width: 1000,
    height: 1000
  };

  // Cameras
  cameras = {}

  // Fake Camera list
  cameras.fake = [
    { id: '4001', merge: 0.02,
      positions:  { x: 0.0, y: 0.0 },
      dimensions: { width: 0.25, height: 0.25 } }, 
    { id: '4002', merge: 0.05,
      positions:  { x: 0.25, y: 0.0 },
      dimensions: { width: 0.25, height: 0.25 } }, 
    { id: '4003', merge: 0.05, 
      positions:  { x: 0.5, y: 0.0 },
      dimensions: { width: 0.25, height: 0.25 } }, 
    { id: '4004', merge: 0.05,
      positions:  { x: 0.75, y: 0.0 },
      dimensions: { width: 0.25, height: 0.25 } }
  ];

  // Real Camera list
  cameras.real = [
    //{ id: '4001', merge: 0.02,
      //positions:  { x: 0.0, y: 0.0 },
      //dimensions: { width: 0.25, height: 0.25 } }, 
    //{ id: '4002', merge: 0.05,
      //positions:  { x: 0.25, y: 0.0 },
      //dimensions: { width: 0.25, height: 0.25 } }, 
    //{ id: '4003', merge: 0.05, 
      //positions:  { x: 0.5, y: 0.0 },
      //dimensions: { width: 0.25, height: 0.25 } }, 
    //{ id: '4004', merge: 0.05,
      //positions:  { x: 0.75, y: 0.0 },
      //dimensions: { width: 0.25, height: 0.25 } }
  ];

  // Time after which a node is considered dead if it does 
  // not move. For example if a person does not move for n 
  // seconds we suppose that she is gone or she is dead :)
  lifetime = 60;

  // Time untill the ticks needs to decrease. A person is 
  // alway moving so this time should be short.
  timetolive = 10;

  // Times a node has to move in the same spot before it
  // is recognize as a person. In real use cases a person 
  // can move objects. For this reason when a node comes
  // to life it needs to show itself for several times. 
  // Only if this node is replicated several times for a
  // short period we have a person.
  ticks = 10;

  exports.map = map;
  exports.cameras = cameras;
  exports.timetolive = timetolive;
  exports.lifetime = lifetime;
  exports.ticks = ticks;

})(typeof exports === 'undefined'? this['settings']={} : exports);
