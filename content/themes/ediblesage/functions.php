<?php
/**
 * Sage includes
 *
 * The $sage_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/sage/pull/1042
 */
$sage_includes = [
  'lib/utils.php',                  // Utility functions
  'lib/init.php',                   // Initial theme setup and constants
  'lib/wrapper.php',                // Theme wrapper class
  'lib/conditional-tag-check.php',  // ConditionalTagCheck class
  'lib/config.php',                 // Configuration
  'lib/assets.php',                 // Scripts and stylesheets
  'lib/titles.php',                 // Page titles
  'lib/extras.php',                 // Custom functions
  'lib/wp_bootstrap_navwalker.php', // bootstrap nav walker
  'lib/wp-app-theme.php',           // WP-APP theme functions
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);

/**
 * converts wordpress terms object to a json of slug:colour
 * @param  [object] $terms [from wordpress get_terms object]
 * @return [JSON string]   [json string of term->slug and colour]
 */
function termsColoursJson($terms) {
  $termsColoursJson = "{";

  if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
    foreach ( $terms as $term ) {
      $termsColoursJson .= "'".$term->slug."':'#000000',";
    }
  }
  return $termsColoursJson."}";
}

//add classes to menus
function special_nav_class($classes, $item){
    // $menu_locations = get_nav_menu_locations();

    // if ( has_term($menu_locations['home-menu'], 'nav_menu', $item) ||  has_term($menu_locations['sitemap'], 'nav_menu', $item)  ) {
    //      if (0 == $item->menu_item_parent) { //makes sure not added to sub-menus
    //        $classes[] = "col-sm-3";
    //    }
    //  }

    return $classes;
}

add_filter('nav_menu_css_class' , 'special_nav_class' , 90 , 2);