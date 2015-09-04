// src/app.js

var wpApp = angular.module('App',
    [
      'App.Common',
      'App.Map',
      'ngMessages',
      'ngRoute',
      'ngResource'
    ]).config(['$routeProvider',function($routeProvider){
      $routeProvider
        .when('/',{
          redirectTo:'/peterborough'
        })
        .when('/:place',{
          templateUrl : '/content/themes/ediblesage/assets/scripts/app/src/map/tmpl/main.html'
        })
        .otherwise({redirectTo:'/'});
    }]).run(['$rootScope', function($rootScope){
    // MIGHT NOT NEAD THIS IN $scope AS USING $resource FROM FACTORY
    // set up global gonfig - grabs from a global config object
    $rootScope.api   = CONFIG.api_url;
    $rootScope.nonce = CONFIG.api_nonce;          // this is especially important to get for API calls that require authentication
    $rootScope.dir   = CONFIG.template_url;
}]);

