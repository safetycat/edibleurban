// scripts/app/src/map/controllers/ModalController.js

// controller that gets the list of posts from the API and returns them to the view
angular.module('App.Map')
  .controller('ModalController', ['MapModel','EventBus', 'ImageUploader', function(MapModel, EventBus, ImageUploader){

    // ----------------------------- properties ----------------------------- //

    var self = this;    // usual JS pointer to controller context
    self.newPlot = {};  // store the input for the new plot details
    self.dialogue = {feedback:''};

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

    /**
     * called when the content of the file input box alters
     */
    self.handleFile = function(el) {
      var file = el.files[0];

      var fd = new FormData();
      fd.append('file',file);
      self.dialogue.feedback = "Uploading " + file.name + " please wait...";
      // block button while uploading [cheating for now as it seems a m.p.i.t.a.]
      $("#modal-save").hide('slow');
      // n.b. we pass also file.name as in chrome FormData does not support all features
      ImageUploader.post(fd, file.name).then(function(data){
        self.dialogue.feedback = "Uploading successful";
        // unblock button
        $("#modal-save").show('slow');
        console.log( data.data.ID );
        self.newPlot.imageId = data.data.ID;
      });
    };

    /** ------------------- form validation stuff ---------------------- */


    /**
     * check if form should be showing validation error
     * @param  {string} :field name of the form field
     * @return {bool}   : show object of now.
     */
    self.showMessages = function(field) {
      return self.allowSubmit && self.detailsForm[field].$touched && self.detailsForm[field].$invalid;
    };




    /**
     * close the modal and submit the data in mapmodel
     * @return {[type]} [description]
     */
    self.close = function() {

      MapModel.storeDetails(self.newPlot.title, self.newPlot.body, self.newPlot.areaType, self.newPlot.imageId);

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