jQuery(document).ready(function() {
  var points = [];

  var process = function(data) {
    var lines = data.split(/\n/g);
    for( var i = 0; i < lines.length; ++i ) {
      // header
      if (i == 0) { continue };

      var values = lines[i].split(' ');
      points.push( values );
    };
  };

  jQuery.ajax({
    type: "GET",
    url: "data/cloud.txt",
    dataType: "text",
    success: function(data) {
      process(data);
      makeScene();
    }
  });


  var makeScene = function() {
    var container;
    var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();
    function init() {
      container = document.createElement( 'div' );
      document.body.appendChild( container );
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
      scene = new THREE.Scene();
      geometry = new THREE.Geometry();

      for ( i = 0; i < points.length; i ++ ) {
        var vertex = new THREE.Vector3();
        var point = points[i];
        vertex.x = parseFloat(point[0]);
        vertex.y = parseFloat(point[1]);
        vertex.z = parseFloat(point[2]);
        if (i == 1) {
          // sample output
          console.log(vertex.x);
          console.log(vertex.y);
          console.log(vertex.z);
        };
        geometry.vertices.push( vertex );
      };

      material = new THREE.PointsMaterial({color: 0xFFFFFF, size: 0.1});
      particles = new THREE.Points( geometry, material );
      scene.add( particles );


      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

      controls = new THREE.OrbitControls(camera, renderer.domElement);

      var firstVertice = geometry.vertices[0];
      camera.position.set(firstVertice.x, firstVertice.y, firstVertice.z + 30);
      camera.lookAt(firstVertice);

      controls.target.set(geometry.vertices[0].x,geometry.vertices[0].y,geometry.vertices[0].z);
    };

    function animate() {
      requestAnimationFrame( animate );
      render();
      controls.update();
    }

    jQuery('div').click(function() {
      console.log(camera.position);
      console.log(controls.target);
    });

    function render() {
      var time = Date.now() * 0.00005;
      renderer.render( scene, camera );
    }
  };
});
