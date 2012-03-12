(function(exports){

  map = {
    width: 1000,
    height: 1000
  };

  cameras = {}
  cameras.fake = [
    {
      id: '4001',
      merge: 0.02,
      positions: {
        x: 0.0,
        y: 0.0
      },
      dimensions: {
        width: 0.25,
        height: 0.25
      }
    }, {
      id: '4002',
      merge: 0.05,
      positions: {
        x: 0.25,
        y: 0.0
      },
      dimensions: {
        width: 0.25,
        height: 0.25
      }
    }, {
      id: '4003',
      merge: 0.05,
      positions: {
        x: 0.5,
        y: 0.0
      },
      dimensions: {
        width: 0.25,
        height: 0.25
      }
    }, {
      id: '4004',
      merge: 0.05,
      positions: {
        x: 0.75,
        y: 0.0
      },
      dimensions: {
        width: 0.25,
        height: 0.25
      }
    }
  ];

  cameras.real = [
    //{
      //id: '4001',
      //positions: {
        //x: 0.05,
        //y: 0.05
      //},
      //dimensions: {
        //width: 0.1,
        //height: 0.1
      //}
    //}, {
      //id: '4002',
      //positions: {
        //x: 0.15,
        //y: 0.05
      //},
      //dimensions: {
        //width: 0.1,
        //height: 0.1
      //}
    //}
  ];

  exports.map = map;
  exports.cameras = cameras;

})(typeof exports === 'undefined'? this['settings']={} : exports);
