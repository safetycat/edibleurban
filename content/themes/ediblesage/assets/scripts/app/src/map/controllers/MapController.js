// scripts/app/src/map/controllers/MapController.js

angular.module('App.Map')
  .controller('MapController', ['$routeParams','MapModel', 'EventBus', function($routeParams, MapModel, EventBus){

    // ----------------------------- properties ----------------------------- //

    var self  = this; // usual JS pointer to controller context
    self.map = {}; // we will store a reference to the leaflet object here

    // to-do : move this stuff into database somehow
    var locationLookUp = {
      'peterborough' : [52.57  ,  -0.25],
      'newcastle'    : [54.975 ,  -1.61],
      'dallas'       : [32.775 , -96.79]
    };

    // to-do : move this stuff into database somehow
    var colourLookUp = {
      'Aquaponics'    : '#880000',
      'Closed Roads'  : '#008800',
      'Indoor Farming': '#000088',
      'Public Space'  : '#888800',
      'Roof Tops'     : '#008888'
    };

    // ----------------------------- public methods ----------------------------- //

    /**
     * initialises leaflet
     * @param  {jQuery} el jQuery wrapped DOM element where the map will go
     */
    self.init = function(el) {
      var map,          // leaflet map object
          plots,        // geojson for map objects
          drawnItems,   // a map layer the newly drawn items are added to
          drawControls, // some tools added to the map to enable drawing
          location = $routeParams.place; // store paramater from url

      var startPos = locationLookUp[location] || [52.57, -0.25]; // default to peterborough.

      // store a reference to this object with the event bus object
      // to enable map to modal controller messaging
      EventBus.storeMapRef(self);

      // instance the map
      map = L.map(el[0],{
          scrollWheelZoom : false
      }).setView(startPos, 15);               // set view to our chosen geographical coordinates and zoom level

      addTileLayer(map);                            // load the custom tileset for the project

      drawnItems  = createDrawnItemsLayer(map);     // create a layer to put the drawn items on
      map.addLayer(drawnItems);                     // add the new later to the map
      if(CONFIG.logged_in){
        drawControls = createDrawControl(drawnItems); // initialise the draw controls
        map.addControl(drawControls);                 // add the control to the map
      }
      // add event handlers
      map.on('draw:created', self.onDrawCreated);

      // get plot data and put onto map
      nowGetPlots(map);
      self.map = map; // thought I wouldn't have to do this but I was wrong.
    };

    /**
     * modal controller sends a reference
     * to itself via event bus
     * @param {controller} modal : modal controller
     */
    self.setModalRefence = function(modal) {
      self.modal = modal;
    };

    /**
     * when a new plot is posted it is stored by the server
     * and put in the server. this gives it an id. the
     * new plot object complete with id is returned from the
     * server and then added to the map using this method
     * ultimately called from the modal (save button) via the event bus
     */
    self.addNewPostReturnedPlot = function(data) {
      var plot = MapModel.unpackReturnedPlot(data);
      MapModel.addNew(plot);
      addPlotToMap(plot);
    };

    // ----------------------------- event handlers ----------------------------- //
    self.onDrawCreated = function(e) {
        self.modal.open(); // get the text data by opening a modal with form in
        MapModel.storePoints(e);
    };

    // ----------------------------- private methods ----------------------------- //

    /**
     * add a tile layer to the map
     * set the URL template - todo pull this out into a constant
     * @param {leaflet object} map - basically the instance of leaflet
     */
    function addTileLayer(map) {
      L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.18d897de/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg',
          {
            id          : 'hello'
          }
      ).addTo(map);
    }

    /**
     * initialise the drawnItems FeatureGroup to store editable shapes and add it to the map on a new layer
     * @param {leaflet object} map - basically the instance of leaflet
     */
    function createDrawnItemsLayer(map) {
      var drawnItems = new L.featureGroup();
      return drawnItems;
    }

    /**
     * initialise the draw controls and pass it the drawnItems FeatureGroup of editable layers
     * @param {leaflet object} drawnItems -a leaflet map layer that stores the drawn items
     */
    function createDrawControl(drawnItems) {
      var drawControl = new L.Control.Draw({
        draw: {
            polyline : false,
            rectangle: false,
            circle   : false,
            marker   : false,
            polygon  : {
                allowIntersection : false, // Restricts shapes to simple polygons
                drawError         : {
                    color   : '#e1e100', // Color the shape will turn when intersects
                    message : '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions      : {
                    color: '#000'
                }
            }
        },
        edit: {
            featureGroup: drawnItems,
            selectedPathOptions: {
                maintainColor: true,
                color: '#000',
                weight: 10
            }
        }
      });

      return drawControl;
    }


    /**
     * calls httpget and passes results through to unpackReturnedPlot
     * the call to MapModel.fetchPlots is asnch so effectively
     * the controller init thread ends here
     */
    function nowGetPlots(map) {
        MapModel.fetchPlots().then(function(xhr) {

              // we do this when the plots arrive from the server
              var plots = xhr.data;
              plots.forEach(function(data){
                  var plot = MapModel.unpackReturnedPlot(data);
                  MapModel.addNew(plot);
                  addPlotToMap(plot);
              });

        });
        // now we're just waiting for the plots
        // when they arrive we'll do the function
        // in the 'then' part which adds the plots to
        // the map
    }

    /**
     * adds a single plot to the map and binds the feature.properties to the popup content
     * @param {geojson object} plot
     */
    function addPlotToMap(plot) {
      L.geoJson( plot.geo_json, {
        style         : function() {
          return {color: colourLookUp[plot.area_type]};
        },
        onEachFeature : function(feature, layer) {
          if (feature.properties && feature.properties.name) {
              var body  = feature.properties.body  || "";
              var image = feature.properties.image || "";
              var popUpContent = MapModel.popUpFormat(feature.properties.name, body, plot.area_type, image);

              layer.bindPopup(popUpContent);
          }
        }
      } ).addTo(self.map);
    }

  }]);