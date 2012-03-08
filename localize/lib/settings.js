(function() {
  var fake_cameras, map, real_cameras;

  map = {
    width: 1000,
    height: 500
  };

  fake_cameras = [
    {
      id: '4001',
      positions: {
        x: 0.05,
        y: 0.05
      },
      dimensions: {
        width: 0.1,
        height: 0.1
      }
    }, {
      id: '4002',
      positions: {
        x: 0.15,
        y: 0.05
      },
      dimensions: {
        width: 0.1,
        height: 0.1
      }
    }, {
      id: '4003',
      positions: {
        x: 0.25,
        y: 0.05
      },
      dimensions: {
        width: 0.1,
        height: 0.1
      }
    }
  ];

  real_cameras = [
    {
      id: '4001',
      positions: {
        x: 0.05,
        y: 0.05
      },
      dimensions: {
        width: 0.1,
        height: 0.1
      }
    }, {
      id: '4002',
      positions: {
        x: 0.15,
        y: 0.05
      },
      dimensions: {
        width: 0.1,
        height: 0.1
      }
    }
  ];

}).call(this);
