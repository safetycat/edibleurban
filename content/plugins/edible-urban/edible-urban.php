<?php

/*  Plugin Name: Edible Urban
    Plugin URI:
    Description: plug in to enable rest api for custom posts which have a geojson custom field, requires wp-rest-api plugin
    Version: 0.0.1
    Author: Safety Cat
    Author URI: http://safetycat.co.uk/
    License: GPLv2
*/

/*  Copyright 2015  JAMES SMITH  (email : zz.james@gmail.com)
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

define( 'WP_APP_PLUGIN_URL',  plugins_url( '', __FILE__ ) );
define( 'WP_APP_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'EDIBLE_POST_TYPE',  'plots');  // change the name of the POST_TYPE here



/**
 * action executed when plugin is activated
 */
function edible_install() {
    // check for wp-api : to-do figure how to do this out later.
    is_plugin_active('json-rest-api');
}
register_activation_hook( __FILE__, 'edible_install' );



/**
 * register a post type of plots
 * which has a custom field to contain
 * the geojson string
 */
function edible_register_my_post_types() {

  register_post_type( EDIBLE_POST_TYPE, array(
      'labels' => array('name' => 'Plots'),
      'taxonomies'  => array( 'category' ),
      'public' => true,
      'supports' => array('title','editor','custom-fields')
    )
  );
}
add_action( 'init', 'edible_register_my_post_types' );



/**
 * set up custom post type API:
 * this instantiates a class that
 * extends the existing wp-api plug-in to
 * accomodate our plot type's custom field(s)
 */
function edible_api_init($server) {
    // we do the require here as we can be sure the WP_API plugin is loaded (which our class extends)
    $api_config_path = dirname(__FILE__).'/includes/class-edible-urban-api-plot.php';
    require_once $api_config_path;

    $edibleUrban_API_Plot = new EdibleUrban_API_Plot($server);
    $edibleUrban_API_Plot->register_filters();
}
add_action( 'wp_json_server_before_serve', 'edible_api_init', 11, 1 );



/**
 * when serving the JSON
 * add the custom field into the JSON (not done by default!)
 * and remove anything we're not using
 */
function edible_post_ammend( $data, $post, $context ) {

    $keys_to_remove = [  // the stuff listed here is stuff included by default that we don't need on the front-end
        'status',
        'type',
        'parent',
        'link',
        'format',
        'slug',
        'guid',
        'menu_order',
        'comment_status',
        'ping_status',
        'sticky',
        'meta',
        'date',
        'modified',
        'date_tz',
        'date_gmt',
        'modified_tz',
        'modified_gmt',
        'terms',
        'author',
    ];

    if( $post['post_type'] === EDIBLE_POST_TYPE ){
        $data['geo_json'] = get_post_meta( $post['ID'] )['map_data'];
        foreach($keys_to_remove as $key)
            unset($data[$key]);
    }
    return $data;
}
add_filter( 'json_prepare_post', 'edible_post_ammend' , 20, 3 );

