var wpApp = angular.module('wpApp',['ngRoute','ngResource']);


wpApp.factory('Plots', ['$resource',function($resource) {
    return $resource(CONFIG.api_url + '/posts/:id?_wp_json_nonce=' + CONFIG.api_nonce + '&type[]=plots', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// MIGHT NOT NEAD THIS IN $scope AS USING $resource FROM FACTORY
// set up global gonfig - grabs from a global config object
wpApp.run(['$rootScope', function($rootScope){
    $rootScope.api   = CONFIG.api_url;
    $rootScope.nonce = CONFIG.api_nonce;          // this is especially important to get for API calls that require authentication
    $rootScope.dir   = CONFIG.template_url;
}]);



// controller that gets the list of posts from the API and returns them to the view
wpApp.controller('PostListController', ['$scope', '$http', 'Plots', function($scope, $http, plots){

  // this should be somewhere else
  $http.defaults.headers.post['X-WP-Nonce'] = CONFIG.api_nonce;

  // model
  $scope.mapdata = [];

  $scope.$watch(function() { return $scope.mapdata; }, function() {
    console.log('map data changed');

    // initMap();              
    // // clear markers
    // for (var i = 0; i < markers.length; i++ ) {
    //   markers[i].setMap(null);
    // }
    // markers = [];

    // angular.forEach(scope.myLocations, function(value, key){
    //   // a single object in this example could be:
    //   // { lat: 50, lon: 3, title: "my title", content: "my content" }
    //   var location = new google.maps.LatLng(value.lat, value.lon);
    //   setMarker(map, location, value.title, value.content);
    // });
  });

  $scope.save = function(data) {
    $http.post(
      '/wp-json/plots',
      data
    ).success( function(data){
        // unpack stringified json object
        data.geo_json = JSON.parse(data.geo_json);
        data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);
        L.geoJson(data.geo_json,{onEachFeature:function(feature, layer){
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      }}).addTo(map);
        // $scope.mapdata.push(data);
      } );
  };

  $http.get(
    $scope.api + '/posts?type=plots'
  ).success(function(data, status, headers, config){

    createMap();

    data.forEach(function(data){
      data.geo_json = JSON.parse(data.geo_json);
      data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);
      $scope.mapdata = data;
      console.log(data.geo_json);
      L.geoJson(data.geo_json,{onEachFeature:function(feature, layer){
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      }}).addTo(map);
    });

    // data = data[0];
    // data.geo_json = JSON.parse(data.geo_json);
    // data.geo_json.geometry.coordinates = JSON.parse(data.geo_json.geometry.coordinates);

    // console.log(data);
    // createMap();


  });



}]);










