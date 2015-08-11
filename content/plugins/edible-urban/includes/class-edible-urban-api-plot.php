<?php
class EdibleUrban_API_Plot extends WP_JSON_CustomPostType {

    /**
     * Associated post type
     * all this is built from the documentation here
     * http://wp-api.org/guides/extending.html
     * @var string Type slug
     */
    protected $type = 'plots';


    public function register_routes($routes) {

        $routes = parent::register_routes($routes);

        $routes[ '/plots' ] = array(
            array( array( $this, 'create_plot' ), WP_JSON_Server::CREATABLE | WP_JSON_Server::ACCEPT_JSON ),
        );

        return $routes;

    }

    /**
     * this method is called when the /plots url is hit using a POST method as defined in the register routes above
     * @param  [type]   $data    : the data in the post
     * @return [string] $new_data: geojson data served in response to the post - just the same posted data served back
     */
    function create_plot( $data ) {

        if ( ! empty( $type ) && $type !== $this->type ) {
            return new WP_Error( 'json_post_invalid_type', __( 'Invalid post type' ), array( 'status' => 400 ) );
        }

        $retval = $this->insert_post( $data );
        if ( is_wp_error( $retval ) ) {
            return $retval;
        }

        // convert to post type
        set_post_type( $retval, 'plots' );

        // add geojson meta data
        add_post_meta($retval, 'map_data', $data['plot'], true);

        $data = (array)get_post( $retval, 'view');

        // apply_filters( 'json_prepare_post', $data );



        // hack :-(
        $keys_to_remove = [  // the stuff listed here is stuff included by default that we don't need on the front-end
            'post_status',
            'post_type',
            'post_parent',
            'post_link',
            'post_format',
            'post_slug',
            'post_guid',
            'post_menu_order',
            'post_comment_status',
            'post_ping_status',
            'post_sticky',
            'post_meta',
            'post_date',
            'post_modified',
            'post_date_tz',
            'post_date_gmt',
            'post_modified_tz',
            'post_modified_gmt',
            'post_terms',
            'post_author',
            'comment_status',
            'ping_status',
            'post_password',
            'post_name',
            'to_ping',
            'pinged',
            'post_content_filtered',
            'guid',
            'menu_order',
            'post_mime_type',
            'comment_count',
            'filter',
        ];

        if( $data['post_type'] === EDIBLE_POST_TYPE ){
            $data['geo_json'] = get_post_meta( $data['ID'] )['map_data'];
            foreach($keys_to_remove as $key)
            unset($data[$key]);
        }

        $new_data = array(
            'id'        => $data['ID'],
            'title'     => $data['post_title'],
            'content'   => $data['post_content'],
            'excerpt'   => $data['post_excerpt'],
            'geo_json'  => $data['geo_json']
        );

        return $new_data;
    }
}