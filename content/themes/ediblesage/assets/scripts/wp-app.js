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
    alert('map data changed');
    console.dir(L);
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



    $http.get(
      $scope.api + '/posts?type=plots'
    ).success(function(data, status, headers, config){
      $scope.mapdata = data;

      $http.post(
        '/wp-json/plots',
        {
            title         :"Whatever!",
            content_raw   :"Content",
            plot          :JSON.stringify({
                             'type': 'Feature',
                             'geometry': {
                                'type': 'Point',
                                'coordinates': [125.6, 10.1]
                             },
                             'properties': {
                             'name': 'Dinagat Islands' 
                             }
                            })
        }).success( function(data){
          $scope.mapdata.push(data);
        } );

    });

}]);
