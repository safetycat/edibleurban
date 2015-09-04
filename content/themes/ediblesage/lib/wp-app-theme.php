<?php

/**
 * to do - change this to wp_register_script as shown in
 * http://code.tutsplus.com/articles/how-to-include-javascript-and-css-in-your-wordpress-themes-and-plugins--wp-24321
 */

class WPAPP_THEME {

    function __construct(){

        add_action( 'wp_enqueue_scripts', array( $this, 'angularScripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'leafletScripts' ) );
    }

    function wpApp_baseScripts() {

    }

    public function leafletScripts() {
        // USING CDN
        wp_enqueue_script(
            'LeafletCore',
            '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js',
            array( 'AngularMessages' ),
            null,
            false
        );
        wp_enqueue_script(
            'LeafletDraw',
            '//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.2.3/leaflet.draw.js',
            array( 'LeafletCore' ),
            null,
            false
        );
    }

    // Making this a plublic function so AngularJS scripts don't load on every page by default
    public function angularScripts() {
        // USING CDN
        wp_enqueue_script(
            'AngularCore',
            '//code.angularjs.org/1.4.0-rc.2/angular.min.js',
            array( 'jquery' ),
            null,
            false
        );
        wp_enqueue_script(
            'AngularRoute',
            '//code.angularjs.org/1.4.0-rc.2/angular-route.min.js',
            array('AngularCore'),
            null,
            false
        );
        wp_enqueue_script(
            'AngularRes',
            '//code.angularjs.org/1.4.0-rc.2/angular-resource.min.js',
            array('AngularRoute'),
            null,
            false
        );
        wp_enqueue_script(
            'AngularMessages',
            '//code.angularjs.org/1.4.0-rc.2/angular-messages.min.js',
            array('AngularRes'),
            null,
            false
        );


    }
}
new WPAPP_THEME();
?>