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

            };

            /**
             * which prepares the data (as the meta field in wordpress stores it as a string)
             * (to-do: we probably should do this string->json conversion on the server)
             */
            self.unpackReturnedPlot = function(data) {
                data.geo_json = JSON.parse(data.geo_json);
                data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);
                data.geo_json.properties.body  = data.content;
                data.geo_json.properties.image = data.image;
                return data;
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
             * store the text data for the geojson to be combined
             * with geojson for posting to map
             */
            self.storeDetails = function(title, details, type, imageId) {
                self.newPlot.title = title;
                self.newPlot.content_raw = details;
                self.newPlot.areatype = type;
                self.newPlot.plot.properties.name = title;
                self.newPlot.plot.properties.body = details;
                self.newPlot.plot.properties.areatype = type;
                self.newPlot.imageId = imageId;
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

            // this shouldn't be here
            // to-do: move this to a template somewhere easy to edit
            self.popUpFormat = function(name, body, area_type, image) {
                var retval = '';

                retval += name + '<hr/>';
                if(image){
                    retval += "<img src='"+image+"'/>";
                }
                retval += body + '<hr/>';
                retval += area_type;

                return retval;
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
