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
      'supports' => array('title','editor','custom-fields','thumbnail')
    )
  );
}
add_action( 'init', 'edible_register_my_post_types' );



/**
 * register Custom Taxonomy
 */
function createTaxonomies() {

    $labels = array(
        'name'                       => _x( 'Land Type', 'Taxonomy General Name', 'text_domain' ),
        'singular_name'              => _x( 'Land Type', 'Taxonomy Singular Name', 'text_domain' ),
        'menu_name'                  => __( 'Land Types', 'text_domain' ),
        'all_items'                  => __( 'Land Types', 'text_domain' ),
        'parent_item'                => __( 'Parent Type', 'text_domain' ),
        'parent_item_colon'          => __( 'Parent Type:', 'text_domain' ),
        'new_item_name'              => __( 'New Land Type', 'text_domain' ),
        'add_new_item'               => __( 'Add new Land Type', 'text_domain' ),
        'edit_item'                  => __( 'Edit Land Type', 'text_domain' ),
        'update_item'                => __( 'Update Land Type', 'text_domain' ),
        'view_item'                  => __( 'View Land Type', 'text_domain' ),
        'separate_items_with_commas' => __( 'Separate Land Types with commas', 'text_domain' ),
        'add_or_remove_items'        => __( 'Add or remove Land Type', 'text_domain' ),
        'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
        'popular_items'              => __( 'Popular Land Types', 'text_domain' ),
        'search_items'               => __( 'Search Land Types', 'text_domain' ),
        'not_found'                  => __( 'Land Type Not Found', 'text_domain' ),
    );
    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
    );
    register_taxonomy( 'area-type', array( EDIBLE_POST_TYPE ), $args );

    // ---------------------- //

    $labels = array(
        'name'                       => _x( 'Suggested Use', 'Taxonomy General Name', 'text_domain' ),
        'singular_name'              => _x( 'Suggested Use', 'Taxonomy Singular Name', 'text_domain' ),
        'menu_name'                  => __( 'Suggested Uses', 'text_domain' ),
        'all_items'                  => __( 'Suggested Uses', 'text_domain' ),
        'parent_item'                => __( 'Parent Type', 'text_domain' ),
        'parent_item_colon'          => __( 'Parent Type:', 'text_domain' ),
        'new_item_name'              => __( 'New Suggested Use', 'text_domain' ),
        'add_new_item'               => __( 'Add new Suggested Use', 'text_domain' ),
        'edit_item'                  => __( 'Edit Suggested Use', 'text_domain' ),
        'update_item'                => __( 'Update Suggested Use', 'text_domain' ),
        'view_item'                  => __( 'View Suggested Use', 'text_domain' ),
        'separate_items_with_commas' => __( 'Separate Suggested Uses with commas', 'text_domain' ),
        'add_or_remove_items'        => __( 'Add or remove Suggested Use', 'text_domain' ),
        'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
        'popular_items'              => __( 'Popular Suggested Uses', 'text_domain' ),
        'search_items'               => __( 'Search Suggested Uses', 'text_domain' ),
        'not_found'                  => __( 'Suggested Use Not Found', 'text_domain' ),
    );
    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
    );
    register_taxonomy( 'suggested-use', array( EDIBLE_POST_TYPE ), $args );


}
add_action( 'init', 'createTaxonomies' );



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

    // we don't need all that extra data in the post
    global $wp_json_posts, $wp_json_pages, $wp_json_users, $wp_json_media, $wp_json_taxonomies;
    remove_filter( 'json_prepare_post',    array( $wp_json_users, 'add_post_author_data' ), 10);
    remove_filter( 'json_prepare_post',    array( $wp_json_media, 'add_thumbnail_data' ), 10);
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

    // we have this problem which has kind of spread in a few places front and back end where its difficult
    // to manipulate the meta field stuff just since it's all a string so we'd need to convert into into some 
    // kind of native PHP object, insert into it and then convert it back to a string to serve it. which we can
    // do but haven't yet.
    if( $post['post_type'] === EDIBLE_POST_TYPE ){

        foreach($keys_to_remove as $key){
            unset($data[$key]);
        }

        // this is slighly complex to gather the terms into an array
        $suggestedUsesTerms = get_the_terms( $post['ID'], 'suggested-use' );
        $suggestedUses      = array();
        if($suggestedUsesTerms) {
            foreach ($suggestedUsesTerms as $key => $term) {
                $suggestedUses[] = $term->name;
            }
        }
        $suggestedUses = json_encode($suggestedUses); //n.b. PHP 5.2 and above

        $data['suggested_uses'] = $suggestedUses;
        if(get_the_terms( $post['ID'], 'area-type' )[0]){
            $data['area_type']  = get_the_terms( $post['ID'], 'area-type' )[0]->name;
        }
        $data['geo_json']       = get_post_meta( $post['ID'] )['map_data'];

        if( has_post_thumbnail($post['ID']) ) {
            $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post['ID']) );
            $data['image'] = $thumb[0]; // we only allow one image
        }

    }
    return $data;
}
add_filter( 'json_prepare_post', 'edible_post_ammend' , 20, 3 );

