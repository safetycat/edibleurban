// scripts/app/src/shared/models/MapModel.js
angular.module('App.Common')
    .service('MapModel', ['$rootScope', '$http', function ($rootScope, $http) {

            var self   = this;
            self.plots = [];    // array of geoJson objects representing plots
            self.newPlot = {plot:{properties:{}}};  // holds the data for a new geojson plot

            $http.defaults.headers.post['X-WP-Nonce'] = CONFIG.api_nonce;

            self.fetchPlots = function() {
                return $http.get($rootScope.api + '/posts?type=plots');  // to-do lift this constant into a service
                // so you don't need to inject scope
            };

            self.create = function () {
                self.newPlot.plot = JSON.stringify(self.newPlot.plot);
                return $http.post('/wp-json/plots',self.newPlot);
            };

            /**
             * parses geojson data and correctly formats for leaflet
             * takes all the plots and changes them in place does not
             * create new variable
             * @param  {json} plots : geojson data from server
             * @return {json} plots : geojson data for leaflet
             */
            self.prepareData = function(plots) {
                plots.forEach(function(data){
                    data.geo_json = JSON.parse(data.geo_json);
                    data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);
                    data.geo_json.properties.body = data.content;
                });
                self.plots = plots;
            };

            /**
             * getter for plots
             * @return {JSONarray} : all the geojson data for leaflet
             */
            self.getPlots = function() {
                return self.plots;
            };

            /**
             * store the text data for the geojson to be combined
             * with geojson for posting to map
             */
            self.storeDetails = function(title, details) {
                self.newPlot.title = title;
                self.newPlot.content_raw = details;
                self.newPlot.plot.properties.name = title;
                self.newPlot.plot.properties.body = details;
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

            self.addNew = function(plot) {
                self.plots.push(plot);
            };

            // unpack stringified json object -- this won't be necessary when we fix the post format
            self.unpackReturnedPlot = function(data) {
                data.geo_json = JSON.parse(data.geo_json);
                data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);
                return data;
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
                coordinates = '['+JSON.stringify(coordinates)+']'; // stringify for posting

                return coordinates;
            }

        }]);
