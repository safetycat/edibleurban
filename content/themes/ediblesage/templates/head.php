<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- move to some kind of enque css -->
  <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.2.3/leaflet.draw.css" />
  <script type="text/javascript"> // this could move to a seperate file
  window.CONFIG = {
    api_url      : "<?php echo esc_url_raw(get_json_url()); ?>",
    api_nonce    : "<?php echo wp_create_nonce('wp_json'); ?>",
    template_url : "<?php echo get_bloginfo('template_directory'); ?>",
    logged_in    : "<?php echo is_user_logged_in(); ?>"
  };
  </script>
  <?php wp_head(); ?>
</head>