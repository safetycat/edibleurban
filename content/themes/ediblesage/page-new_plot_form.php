<div class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
<!-- ok so general rule is don't touch anything with ng- prefix -->
<!-- whatever else is cool -->
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
                <h4 class="modal-title" id="myModalLabel">
                    Enter Plot Details
                </h4>
            </div>

            <form name="ModalController.detailsForm"><!-- exposes to controller via name attribute -->
                <div class="modal-body">
                    <div class="form-group">
                        <label for="plotTitle" class="control-label">Plot Name:</label>
                        <input
                          type        = "text"
                          class       = "form-control"
                          id          = "plotTitle"
                          name        = "plotTitle"
                          ng-model    = "ModalController.newPlot.title"
                          ng-maxlength= "60"
                          ng-required = "true"><!-- value in this input box is bound to 'title' in controller -->

                       <!-- shown when form invalid -->
                        <div
                          class       = "alert alert-warning"
                          ng-messages = "ModalController.detailsForm.plotTitle.$error"
                          ng-if       = "ModalController.showMessages('plotTitle')">
                            <div ng-message="required">
                                <small>Plot Title is required!</small>
                            </div>
                            <div ng-message="maxlength">
                                <small>Too long!</small>
                            </div>
                        </div>
                        <!-- -->
                    </div>
                    <div class="form-group">
                        <label for="plotBody" class="control-label">Plot Details:</label>
                        <textarea
                          class="form-control"
                          style="height:100px"
                          id="plotBody"
                          name="plotBody"
                          ng-model="ModalController.newPlot.body"> <!-- value in this text area is bound to 'body' in controller -->
                        </textarea>
                    </div>
                    <!-- file input group -->
                    <label for="fileupload" class="control-label">Image (not required):</label>
                    <div class="input-group">
                        <span class="input-group-btn">
                            <span class="btn btn-primary btn-file">
                                Browse&hellip; <input type="file" multiple name="fileupload" ng-model="ModalController.newPlot.file" onchange="angular.element(this).scope().ModalController.handleFile(this)">
            <!-- see http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields-->
                            </span>
                        </span>
                        <input type="text" class="form-control" ng-model="ModalController.dialogue.feedback" readonly>
                    </div>

<!-- radio buttons for land type -->
<?php
  $terms = get_terms( "area-type", array( 'hide_empty' => 0 ) );
?>

                    <div class="form-group clearfix">
                        <fieldset>
                            <legend><span style="font-size: 14px;font-weight: 700;">Land Type:</span></legend>

                            <?php
                            foreach($terms as $index => $term):
                            ?>

                              <div class=""><!-- some kind of column mixin class ? -->

                                <div class="radio">
                                    <label>
                                      <input
                                        type     = "radio"
                                        name     = "areaType"
                                        value    = "<?php echo $term->slug;?>"
                                        ng-model = "ModalController.newPlot.areaType" />
                                      <?php echo $term->name;?>
                                    </label>
                                </div>

                              </div>
                            <?php
                            endforeach;
                            ?>

                        </fieldset>
                    </div>


<!-- checkboxes for suggested use -->
<?php
  $terms = get_terms( "suggested-use", array( 'hide_empty' => 0 ) );
?>


                    <div class="form-group clearfix">
                        <fieldset>
                            <legend><span style="font-size: 14px;font-weight: 700;">Suggested Uses:</span></legend>

                            <?php
                            foreach($terms as $index => $term):
                            ?>

                              <div class=""><!-- some kind of column mixin class ? -->

                                <div class="checkbox">
                                    <label>
                                      <input
                                        type="checkbox"
                                        name="suggestedUse"
                                        value="<?php echo $term->slug;?>"
                                        ng-model="ModalController.newPlot.suggestedUse.<?php echo $term->slug;?>" />
                                      <?php echo $term->name;?>
                                    </label>
                                </div>
                              </div>
                            <?php
                            endforeach;
                            ?>
                        </fieldset>
                    </div>

                </div>

<!-- model footer with cancel/submit buttons -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button
                        type        = "button"
                        class       = "btn btn-primary"
                        id          = "modal-save"
                        ng-disabled = "!ModalController.detailsForm.$valid"
                        ng-click    = "ModalController.close()">Send</button>
                </div>
            </form>
        </div>
    </div>
</div>