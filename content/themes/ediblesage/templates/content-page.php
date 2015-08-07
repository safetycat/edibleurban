<div ng-app="App">

    <map id="map"></map>
    <modal></modal>
    <!--
    <div id="postlist">

        <ul ng-repeat="post in mapdata">
            <li>{{post.title}}</li>
            <li>{{post.content}}</li>
            <li>{{post.geo_json}}</li>
        </ul>
        <hr />

    </div>
    -->

    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>

</div>