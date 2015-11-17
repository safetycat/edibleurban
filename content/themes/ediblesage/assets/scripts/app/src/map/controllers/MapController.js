// scripts/app/src/map/controllers/MapController.js

angular.module('App.Map')
  .controller('MapController', ['$scope','$routeParams', '$templateCache', '$interpolate', 'MapModel', 'EventBus', function($scope, $routeParams, $templateCache, $interpolate, MapModel, EventBus){

    // ----------------------------- properties ----------------------------- //

    var self  = this; // usual JS pointer to controller context
    var popUpTemplate = $interpolate($templateCache.get('map_popup'));  // we need this to pass a html string to leaflet to define popup content

    // to-do : move this stuff into database somehow
    var locationLookUp = {
      'peterborough' : [52.57  ,  -0.25],
      'newcastle'    : [54.975 ,  -1.61],
      'dallas'       : [32.884054, -96.753051]
    };

    // to-do : move this stuff into database somehow
    var colourLookUp = CONFIG.suggested_use;

    // ----------------------------- public methods ----------------------------- //

    /**
     * initialises leaflet, effectively a constructor
     * @param  {jQuery} el jQuery wrapped DOM element where the map will go
     */
    self.init = function($el) {

      EventBus.storeMapRef(self);         // store a reference to this object with the event bus object
                                          // to enable map to modal controller messaging

      var map;                            // leaflet map object
      var plots;                          // geojson for map objects

      var drawnItems;                     // a map layer the newly drawn items are added to
      var drawControls;                   // some tools added to the map to enable drawing

      var location = $routeParams.place;  // store paramater from url
      var startPos = locationLookUp[location] || [52.57, -0.25]; // default to peterborough.

      L.mapbox.accessToken = 'pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'; // access token for mapbox

      map = L.mapbox.map('map', null, {               // instance the map
        scrollWheelZoom : false
      }).setView(startPos, 15);                       // set view to our chosen geographical coordinates and zoom level

      var layers = addTileLayers(L.mapbox.accessToken);

      layers.Map.addTo(map);                          // add the custom tileset for the project


      L.control.layers(layers).addTo(map);            // add layer switching control

      drawnItems = new L.featureGroup();              // create a layer to put the drawn items on
      map.addLayer(drawnItems);                       // add the new later to the map

      if(CONFIG.logged_in) {
        drawControls = createDrawControl(drawnItems); // initialise the draw controls (if logged in)
        map.addControl(drawControls);                 // add the control to the map
      }

      // add other controls..... //

      map.on('draw:created', self.onDrawCreated);     // add event handlers

      // -------------------------- setup listener for plot changes in model ------------------- //
      $scope.$watch(
        function () {
          return MapModel.plots;
        },
        function(newVal, oldVal) {
          if(newVal.length > 0) {
            renderPlots(map);
          }
        }, true);

      nowGetPlots(map);                               // get plot data and put onto map
    };


    /**
     * modal controller sends a reference
     * pointing back to itself via event bus
     * so we can message the modal
     * @param {controller} modal : modal controller
     */
    self.setModalRefence = function(modal) {
      self.modal = modal;
    };


    /**
     * ++ called from the modal (save button) via the event bus ++
     * when a new plot is posted it is stored by the server
     * and put in the database. this gives it an id. the
     * new plot object complete with id is returned from the
     * server and then added to the map using this method
     */
    self.addNewPostReturnedPlot = function(data) {
      var plot = MapModel.unpackPlot(data);
      MapModel.addNew(plot);
      // addPlotToMap(plot);
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
    function addTileLayers(token) {

      var layers = {
          Map: L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.o2ii1n61/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg'),
          Satellite: L.mapbox.tileLayer('mapbox.satellite')
      };

      return layers;
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

    // function createSearchControl() {

    //   L.Control.Search = L.Control.extend({
    //     options : {
    //       position   : 'topright',
    //       placeholder: 'Search....'
    //     },
    //     initialize : {
    //       // constructor
    //       L.Util.setOptions(this,options);
    //     },
    //     onAdd : function(map){
    //       // happens after added to map
    //       var container = L.DomUtil.create('div','search-container');
    //       this.form = L.DomUtil.create('form','form', container);

    //       var group = L.DomUtil.create('div','form-group',this.form);
    //       this.input = L.DomUtil.create('input','form-control input-sm',group);
    //       this.input.type = 'text';
    //       this.input.placeholder = this.options.placeholder;
    //       this.results = L.DomUtil.create('div','list-group',group);

    //       L.DomEvent.addListener(this.input, 'keyup', _.debounce(this.keyup, 300), this);
    //       L.DomEvent.addListener(this.form, 'submit', this.submit, this);
    //       L.DomEvent.disableClickPropagation(container);
    //       return container;
    //     },
    //     onRemove : function(map){
    //       // when removed
    //       L.DomEvent.removeListener(this._input, 'keyup', this.keyup, this);
    //       L.DomEvent.removeListener(form, 'submit', this.submit, this);
    //     },
    //     keyup:function(e) {
    //       if(e.keyCode === 38 || e.keyCode === 40) {
    //         // do nothing
    //       } else {
    //         this.results.innerHTML = '';
    //         if(this.input.value.length > 2) {
    //           var value = this.input.value;
    //           var results = _.take(_.filter(this.options.data, function(x){
    //             return x.feature.properties.part.toUpperCase().indexOf(value.toUpperCase()) > -1;
    //           }).sort(sortParks), 10);
    //           _.map(results, function(x){
    //             var a = L.DomUtil.create('a', 'list-group-item');
    //             a.href = '';
    //             a.setAttribute('data-result-name', x.feature.properties.park);
    //             a.innerHTML = x.feature.properties.park;
    //             this.results.appendChild(a);
    //             L.DomEvent.addListener(a, 'click', this.itemSelected, this);
    //             return a;
    //           }, this);
    //         }
    //       }
    //     },
    //     itemSelected: function(e) {
    //       L.DomEvent.preventDefault(e);
    //       var elem  = e.target;
    //       var value = elem.innerHTML;
    //       this.input.value = elem.getAttributes('data-result-name');
    //       var feature = _.find(this.options.data, function(x){
    //         return x.feature.properties.park === this.input.value;
    //       }, this);
    //       if(feature) {
    //         this._map.fitBounds(feature.getBounds());
    //       }
    //       this.results.innerHTML = '';
    //     },
    //     submit: function(e) {
    //       L.DomEvent.preventDefault(e);
    //     }
    //   });

    //   L.control.search = functon(id,options) {
    //     return new L.Control.Search(id,options);
    //   }
    // }

    /**
     * calls httpget and passes results through to unpackReturnedPlot
     * the call to MapModel.fetchPlots is asnch so effectively
     * the controller init thread ends here
     */
    function nowGetPlots(map) {
      MapModel.fetchPlots().then(
        function addPlotsToMap(xhr) { // we do this when the plots arrive from the server
          var plots = xhr.data;
          MapModel.setPlots(plots);
        }
      );
      // now we're just waiting for the plots
      // when they arrive we'll do the function
      // in the 'then' part (addPlotsToMap) which adds the plots to
      // the model
    }

    function renderPlots(map) {
      var plots = MapModel.getPlots();
      plots.forEach(
        function(data){
          var type = data.area_type;
          var plot = MapModel.unpackPlot(data);
          createPlot(plot, type).addTo(map);
        }
      );
    }

    /**
     * creates a single plot and binds the feature.properties to the popup content
     * @param  {geojson object} plot
     * @return {GeoJSON layer}
     */
    function createPlot(plot, type) {
      return L.geoJson( plot.geo_json, {
        style         : function() {
          return {fillColor: colourLookUp[type] || '#000000', opacity: 1, color: 'red', weight:1, fillOpacity: 0.6 };  // if no land type specified make it black
        },
        onEachFeature : function(feature, layer) {
          if (feature.properties && feature.properties.name) {
              var body  = feature.properties.body  || "";
              var image = feature.properties.image || "";
              var popUpContent = popUpTemplate( {
                name          : feature.properties.name,
                body          : body,
                area_type     : type,
                image         : image,
                suggestedUses : feature.properties.suggestedUses.toString()
              } );

             layer.bindPopup(popUpContent);
          }
        }
      } );
    }

  }]);