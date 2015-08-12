// scripts/app/src/map/controllers/ModalController.js

// controller that gets the list of posts from the API and returns them to the view
angular.module('App.Map')
  .controller('ModalController', ['MapModel','EventBus', function(MapModel, EventBus){

    // ----------------------------- properties ----------------------------- //

    var self = this;    // usual JS pointer to controller context
    self.newPlot = {};  // store the input for the new plot details

    // ----------------------------- public methods ----------------------------- //

    /**
     * modal controller has to pass a reference to itself to the
     * map controller upon initialisaton, it uses the eventbus
     * @param  {jQuery} el : the element the modal is on as a jquery object
     */
    self.init = function(el) {
      self.elem = el;
      EventBus.passModalRefToMap(self);
    };

    /**
     * opens the modal
     */
    self.open = function() {
      $(self.elem).modal('show');
    };

    /** ------------------- form validation stuff ---------------------- */


    /**
     * check if form should be showing validation error
     * @param  {string} :field name of the form field
     * @return {bool}   : show object of now.
     */
    self.showMessages = function(field) {
      return self.detailsForm[field].$touched && self.detailsForm[field].$invalid;
    };




    /**
     * close the modal and submit the data in mapmodel
     * @return {[type]} [description]
     */
    self.close = function() {

      MapModel.storeDetails(self.newPlot.title, self.newPlot.body, self.newPlot.areaType);

      MapModel.create().then(function(xhr)
        {
          $(self.elem).modal('hide');
          self.detailsForm.$setPristine();
          self.detailsForm.$setUntouched();
          self.newPlot = {};

          EventBus.addNewToMap(xhr.data); // and inform maps
        }
      );

    };

  }]);