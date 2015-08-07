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

    self.close = function() {

      if(!self.newPlot.title) {
        alert('you have to put a title');
        return;
      }

      MapModel.storeDetails(self.newPlot.title, self.newPlot.body);

      MapModel.create().then(function(xhr)
        {
          $(self.elem).modal('hide');
          MapModel.addNew(xhr.data);      // when post is successfull add to model
          EventBus.addNewToMap(xhr.data); // and inform maps
        }
      );

    };

  }]);