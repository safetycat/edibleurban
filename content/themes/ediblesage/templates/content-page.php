<div id="map"></div>

<?php the_content(); ?>
<?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>

<script type="text/javascript">


    window.onload = function() {
        // first we initialise the map and set its view to our chosen geographical coordinates and zoom level
        var map = L.map('map').setView([52.57, -0.25], 15);
        // notice that setView returns the ma object, most leaflet methods act like this for chaining

        // add a tile layer to the map. in this case the mapbox streets tile layer
        // we set the URL template
        // the attribution text
        // the maximum zoom level

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom     : 18,
            id          : 'some shit',
            accessToken : 'blah'
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




        // var marker = L.marker([51.5, -0.09]).addTo(map);

        // var circle = L.circle([51.508, -0.11], 500, {
        //     color       : 'red',
        //     fillColor   : '#f03',
        //     fillOpacity : 0.5
        // }).addTo(map);

        // var polygon = L.polygon([
        //     [51.509,-0.08],
        //     [51.503,-0.06],
        //     [51.51,-0.047]
        // ]).addTo(map);

        // marker.bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();
        // circle.bindPopup('I am a circle');
        // polygon.bindPopup('I am a polygon');

        // var popup = L.popup() // stand alone pop up
        //         .setLatLng([51.5,-0.15])
        //         .setContent('I am a stand alone pop up')
        //         .openOn(map);

        function onMapClick(e) {
            popup.setLatLng(e.latlng)
                .setContent('you clicked the map at '+ e.latlng)
                .openOn(map);
        }

        function onDrawCreated(e) {
            var type = e.layerType,
                layer = e.layer;

            if (type === 'marker') {
                // Do marker specific actions
            }
            // Do whatever else you need to. (save to db, add to map etc)
            drawnItems.addLayer(layer);
            alert('to do: save this to database');

        }

        // map.on('click', onMapClick);
        map.on('draw:created', onDrawCreated);


    } // end onload 

</script>

<script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.2.3/leaflet.draw.js"></script>
