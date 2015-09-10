// scripts/app/src/shared/models/MapModel.js
angular.module('App.Common')
    .service('MapModel', ['$rootScope', '$http', function ($rootScope, $http) {

            var self   = this;
            self.plots = [];    // array of geoJson objects representing plots
            self.newPlot = {plot:{properties:{}}};  // holds the data for a new geojson plot

            $http.defaults.headers.post['X-WP-Nonce'] = CONFIG.api_nonce;

            self.fetchPlots = function() {
                return $http.get($rootScope.api + '/posts?type=plots&filter[posts_per_page]=-1');  // to-do lift this constant into a service
                // so you don't need to inject scope
            };

            self.create = function () {
                self.newPlot.plot = JSON.stringify(self.newPlot.plot);
                return $http.post('/wp-json/plots',self.newPlot);
            };

            /**
             * which prepares the data (as the meta field in wordpress stores it as a string)
             * this is a bit of a mess :-(
             * (to-do: we probably should do this string->json conversion on the server)
             */
            self.unpackPlot = function(data) {
                var plot = {};
                plot.geo_json = data.geo_json[0].replace(/\\"/g, '"');  // have to delete the escape slashes that wordpress puts in the json
                plot.geo_json = JSON.parse(data.geo_json);
                plot.geo_json.properties.body  = data.content;
                plot.geo_json.properties.image = data.image;
                plot.geo_json.properties.suggestedUses = JSON.parse(data.suggested_uses);
                return plot;
            };

            /**
             * getter for plots
             * @return {JSONarray} : all the geojson data for leaflet
             */
            self.getPlots = function() {
                return self.plots;
            };

            self.addNew = function(plot) {
                self.plots.push(plot);
            };

            /**
             * this method updates all the plots it's called straight after
             * the plots are initially fetched from the server
             * @param {JSON array} plots : array of plot objects
             */
            self.setPlots = function(plots) {
              // manage angular's BS two way binding cycle
              if($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest'){
                $rootScope.$apply(function() {
                  self.plots = plots;
                });
              } else {
                self.plots = plots;
              }
            };

            /**
             * store the text data for the geojson to be combined
             * with geojson for posting to map
             */
            self.storeDetails = function(title, details, type, imageId, suggestedUses) {
                self.newPlot.title         = title;
                self.newPlot.content_raw   = details;
                self.newPlot.areatype      = type;
                self.newPlot.plot.properties.name = title;
                self.newPlot.plot.properties.body = details;
                self.newPlot.plot.properties.areatype = type;
                self.newPlot.imageId = imageId;
                if(suggestedUses) {
                    self.newPlot.suggestedUses = createArrayStringFromObjectBool(suggestedUses);
                }
            };

            self.storePoints = function(e) {
                var type    = e.layerType,
                    layer   = e.layer,
                    data    = fixDataForPosting(layer);

                self.newPlot.plot = {
                                'type'      : 'Feature',
                                'geometry'  : {'type': 'Polygon', 'coordinates': data },
                                'properties': {}  // we fill this bit in later!
                };
            };

            // ----------------------------- private methods ----------------------------- //

            function fixDataForPosting(layer) {
                var points      = layer._latlngs;
                var coordinates = [];

                points.forEach(function(element){
                    var pair = [element.lng, element.lat];
                    coordinates.push(pair);
                });

                // start and end point must match exactly so add the first point as the last
                coordinates.push(coordinates[0]);
                coordinates = [coordinates]; // stringify for posting

                return coordinates;
            }

            /**
             * createArrayStringFromObjectBool : the checkboxes give us an object where keys
             *  are the 'category terms' with either true or false if they are to be included
             *  so we convert it to an string with just the 'category terms'.
             * @param  {Object}        : suggestedUses
             * @return {string}        : comma delimeted string
             */
            function createArrayStringFromObjectBool(suggestedUses) {
                // create empty string
                var suggestedUsesArray = '';
                // get object keys
                var keys = Object.keys(suggestedUses);

                keys.forEach(function(key){
                    if(suggestedUses[key]){// if value is true add key to an array
                        suggestedUsesArray += key += ',';
                    }
                });

                // return string
                return suggestedUsesArray.slice(0,-1); // chop of trailing comma
            }


        }]);
