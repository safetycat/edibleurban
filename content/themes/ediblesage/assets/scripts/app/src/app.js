var wpApp = angular.module('App',
    [
      'App.Common',
      'App.Map',
      'ngRoute',
      'ngResource'
    ]).run(['$rootScope', function($rootScope){
    // MIGHT NOT NEAD THIS IN $scope AS USING $resource FROM FACTORY
    // set up global gonfig - grabs from a global config object
    $rootScope.api   = CONFIG.api_url;
    $rootScope.nonce = CONFIG.api_nonce;          // this is especially important to get for API calls that require authentication
    $rootScope.dir   = CONFIG.template_url;
}]);


// wpApp.factory('Plots', ['$resource',function($resource) {
//     return $resource(CONFIG.api_url + '/posts/:id?_wp_json_nonce=' + CONFIG.api_nonce + '&type[]=plots', {
//         id: '@id'
//     }, {
//         update: {
//             method: 'PUT'
//         }
//     });
// }]);