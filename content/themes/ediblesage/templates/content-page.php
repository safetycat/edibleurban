<div ng-app="wpApp">

    <div id="map"></div>

    <div class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&amp;times;</button>
                <h4 class="modal-title" id="myModalLabel">Enter Plot Details</h4>
                </div>
                <div class="modal-body">
                     <form>
                      <div class="form-group">
                        <label for="recipient-name" class="control-label">Plot Name:</label>
                        <input type="text" class="form-control" id="plot-title">
                      </div>
                      <div class="form-group">
                        <label for="message-text" class="control-label">Plot Details:</label>
                        <textarea class="form-control" style="height:100px" id="plot-body"></textarea>
                      </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="modal-save">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <div id="postlist" ng-controller="PostListController">

        <ul ng-repeat="post in mapdata">
            <li>{{post.title}}</li>
            <li>{{post.content}}</li>
            <li>{{post.geo_json}}</li>
        </ul>
        <hr />

    </div>

    <?php //the_content(); ?>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>

</div>

<script type="text/javascript">
var map;
    function createMap() {
        // initialise the map
        // set its view to our chosen geographical coordinates and zoom level
        map = L.map('map',{
            scrollWheelZoom : false
        }).setView([52.57, -0.25], 15);

        // add a tile layer to the map
        // set the URL template
        L.tileLayer('https://{s}.tiles.mapbox.com/v4/safetycat.18d897de/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FmZXR5Y2F0IiwiYSI6Ill4U0t4Q1kifQ.24VprC0A7MUNYs5HbhLAAg',{
            id          : 'hello'
        }).addTo(map);



        // initialise the FeatureGroup to store editable layers
        var drawnItems = new L.featureGroup();
        map.addLayer(drawnItems);

        // initialise the draw control ad pass it the feature group of editable layers
        var drawControl = new L.Control.Draw({
            draw: {
                polyline : false,
                rectangle: false,
                circle   : false,
                marker   : false,
                polygon  : {
                    allowIntersection : false, // Restricts shapes to simple polygons
                    drawError         : {
                        color   : '#e1e100', // Color the shape will turn when intersects
                        message : '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                    },
                    shapeOptions      : {
                        color: '#000'
                    }
                }
            },
            edit: {
                featureGroup: drawnItems,
                selectedPathOptions: {
                    maintainColor: true,
                    color: '#000',
                    weight: 10
                }
            }
        });

        map.addControl(drawControl);

        function onDrawCreated(e) {
            var title = getInfo(e);
        }

        function getInfo(e) {

            $('#modal-save').click(function(){
                var modal = $('#basicModal')
                var title = modal.find('#plot-title').val();
                if(title === '') {
                    alert('you have to put a title');
                    return;
                }
              var title = modal.find('#plot-title').val();
              var body  = modal.find('#plot-body').val();
              addandsave(e,{title:title,body:body});
              $('#basicModal').modal('hide');
            });

            $('#basicModal').modal('show');

        }

        function addandsave(e, postdata) {

            var title = postdata.title;
            var content = postdata.body;



            // set up to communicate from leaflet to angular
            var scope = angular.element(document.getElementById('postlist')).scope();

            var type = e.layerType,
                layer = e.layer;

            // Do whatever else you need to. (save to db, add to map etc)
            drawnItems.addLayer(layer);

            var points = layer._latlngs;
            var coordinates = [];

            points.forEach(function(element){
                var pair = [element.lng, element.lat];
                coordinates.push(pair);
            });

            // weird but the start and end point must match exactly
            coordinates.push(coordinates[0]);
            coordinates = '['+JSON.stringify(coordinates)+']';

            // console.log(coordinates);

            scope.$apply(function(){
                var data =
                {
                    title       :title,
                    content_raw :content,
                    plot        :JSON.stringify({
                                    'type'      : 'Feature',
                                    'geometry'  : {'type': 'Polygon', 'coordinates': coordinates },
                                    'properties': {'name': title}
                                })
                };
                scope.save(data)
            })

            // alert('to do: save this to database');

        }

        map.on('draw:created', onDrawCreated);


    } // end onload 

</script>
