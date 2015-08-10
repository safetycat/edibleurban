// scripts/app/src/map/directives/MapDirective.js


/**
 * this is a minimal directive which binds the map element to the MapController object
 * when the map element is read the link function triggers the init method on the controller
 */
angular.module('App.Map')
    .directive('map',function(){
        return {
            scope            : {},
            controllerAs     : 'MapController',
            controller       : 'MapController',
            bindToController : true,
            template         : '<div></div>',
            replace          : true,
            link             : function(scope, element, attrs, MapController) { MapController.init( element ); }
        };
    });