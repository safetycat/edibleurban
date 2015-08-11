// scripts/app/src/map/controllers/MapController.js

angular.module('App.Map')
  .controller('MapController', ['MapModel', 'EventBus', function(MapModel, EventBus){

    // ----------------------------- properties ----------------------------- //

    var self  = this; // usual JS pointer to controller context
    self.map = {}; // we will store a reference to the leaflet object here

    // ----------------------------- public methods ----------------------------- //

    /**
     * initialises leaflet
     * @param  {jQuery} el jQuery wrapped DOM element where the map will go
     */
    self.init = function(el) {
      var map,          // leaflet map object
          plots,        // geojson for map objects
          drawnItems,   // a map layer the newly drawn items are added to
          drawControls; // some tools added to the map to enable drawing

      // store a reference to this object with the event bus object
      // to enable map to modal controller messaging
      EventBus.storeMapRef(self);

      // instance the map
      map = L.map(el[0],{
          scrollWheelZoom : false
      }).setView([52.57, -0.25], 15);               // set view to our chosen geographical coordinates and zoom level

      addTileLayer(map);                            // load the custom tileset for the project

      drawnItems  = createDrawnItemsLayer(map);     // create a layer to put the drawn items on
      map.addLayer(drawnItems);                     // add the new later to the map

      drawControls = createDrawControl(drawnItems); // initialise the draw controls
      map.addControl(drawControls);                 // add the control to the map

      // add event handlers
      map.on('draw:created', self.onDrawCreated);

      // get plot data and put onto map
      getPlots(map);
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

    self.addNewToMap = function(plot) {

        plot = MapModel.unpackReturnedPlot(plot);

        L.geoJson( plot.geo_json,{onEachFeature:function(feature, layer)
          {
            if (feature.properties && feature.properties.name)
            {
              layer.bindPopup(feature.properties.name);
            }
          }
        } ).addTo(self.map);
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
     * calls httpget and passes results through to prepare data
     */
    function getPlots(map) {
        MapModel.fetchPlots().then(function(xhr) {
            MapModel.prepareData(xhr.data);
            addPlotsToMap(map);
        });
    }

    /**
     * adds the geoJson in all the plots to the leaflet map
     */
    function addPlotsToMap(map) {
      MapModel.getPlots().forEach(function(data) {
        L.geoJson(data.geo_json,{onEachFeature:function(feature, layer){
          if (feature.properties && feature.properties.name) {
            var body = feature.properties.body || "";
            layer.bindPopup(feature.properties.name + '<hr>' + body);
          }
        }}).addTo(map);
      });
    }
    /**
     * adds a single plot that is returned after the post is made
     * to-do: this needs fixing to roll in with the method above
     * @param {[type]} plot [description]
     */
    self.addPlotToMap = function(plot) {

        plot = MapModel.unpackReturnedPlot(plot);

        L.geoJson( plot.geo_json,{onEachFeature:function(feature, layer)
          {
            if (feature.properties && feature.properties.name)
            {

              var body = feature.properties.body || "";
              layer.bindPopup(feature.properties.name + '<hr>' + body);
            }
          }
        } ).addTo(self.map);
    };

  }]);