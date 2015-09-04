<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/content', 'page'); ?>
<?php endwhile; ?>

<div ng-app="App">
    <div ng-view=""></div>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
    <!-- this file includes template strings used on the front end by javascript -->
    <?php get_template_part('templates/client', 'templates'); ?>
</div>