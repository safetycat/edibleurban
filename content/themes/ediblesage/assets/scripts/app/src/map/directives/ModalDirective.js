// scripts/app/src/map/directives/ModalDirective.js


/**
 * this is a minimal directive which binds the modal element to the ModalController object
 * when the modal element is read the link function triggers the init method on the controller
 */
angular.module('App.Map')
    .directive('modal',function(){
        return {
            scope            : {},
            controllerAs     : 'ModalController',
            controller       : 'ModalController',
            bindToController : true,
            replace          : true,
            templateUrl      : '/new_plot_form/',
            link             : function(scope, element, attrs, ModalController) { ModalController.init( element ); }
        };
    });