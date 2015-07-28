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

    $http.get(
      $scope.api + '/posts?type=plots'
    ).success(function(data, status, headers, config){
      $scope.postdata = data;
    });

$http.defaults.headers.post['X-WP-Nonce'] = CONFIG.api_nonce;

// xhr.setRequestHeader('X-WP-Nonce', WP_API_Settings.nonce);

$http.post(
    '/wp-json/posts/',
    {
        title         :"Hello World!",
        content_raw   :"Content",
        excerpt_raw   :"Excerpt"
    }).success( function(data){console.dir($scope.postdata.push(data));} );



}]);
