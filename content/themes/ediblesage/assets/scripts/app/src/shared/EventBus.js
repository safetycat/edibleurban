/**
 * event bus is an under developed component that should
 * allow for directive/controller to communicate with another
 * directive/controller on the same level (i.e. when one is not on a parent element of the other)
 * it's just a singleton service that sets to a message passing system
 * it's way too specific to be useful elsewhere but works at the moment for ediblesage
 * to-do: generalise to a publish/subscribe pattern.
 */

// scripts/app/src/shared//EventBus.js
angular.module('App.Common')
    .service('EventBus', function () {

            var bus = this; // stash pointer to context

            /**
             * stores a reference to the map controller
             * @param  {controller} map : reference to the map controller
             */
            bus.storeMapRef = function(map) {
                bus.map = map;
            };

            /**
             * does what it says on the tin
             * @param  {controller} modal : reference to the modal controller
             */
            bus.passModalRefToMap = function(modal) {
                bus.modal = modal;
                bus.map.setModalRefence(modal);
            };

            // called when modal is closed and succefully posted new data
            bus.addNewToMap = function(plot) {
                bus.map.addPlotToMap(plot);
            };

        });