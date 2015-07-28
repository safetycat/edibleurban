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
        // The App Script -- **** do not need as rolled into main.js in gulp build ****
        // wp_enqueue_script( 'wpApp', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app.js', array( 'AngularCore' ), null, true );

        // wp_localize_script( 'wpApp', 'APIdata', array(
        //     'api_url' => esc_url_raw( get_json_url() ),
        //     'api_nonce' => wp_create_nonce( 'wp_json' ),
        //     'template_url' => get_bloginfo( 'template_directory' )
        //     )
        // );

        // // Misc Scripts
        // wp_enqueue_script( 'wpAppScripts', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-scripts.js', array( 'jquery' ), null, true );

        // // Routes
        // wp_enqueue_script( 'wpAppRoutes', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-routes.js', array( 'wpApp' ), null, true );

        // // Factories
        // wp_enqueue_script( 'wpAppFactories', get_stylesheet_directory_uri() . '/assets/js/wp-app/wp-app-factories.js', array( 'wpApp' ), null, true );

        // // Controllers
        // wp_enqueue_script( 'wpAppSignup', get_stylesheet_directory_uri() . '/assets/js/wp-app/controllers/wp-app-signup.js', array( 'wpAppFactories' ), null, true );
        // wp_enqueue_script( 'wpAppStyleGuide', get_stylesheet_directory_uri() . '/assets/js/wp-app/controllers/wp-app-sg.js', array( 'wpAppFactories' ), null, true );
    }

    public function leafletScripts() {
        // USING CDN
        wp_enqueue_script(
            'LeafletCore',
            '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js',
            array( 'AngularRes' ),
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
    }
}
new WPAPP_THEME();
?>