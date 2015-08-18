<div ng-app="App">
    <a href="#/peterborough">Peterborough</a> |
    <a href="#/newcastle">Newcastle</a> |
    <a href="#/dallas">Dallas</a> |
    <a href="wordpress/wp-admin/">Log In</a>
    <hr />
    <div ng-view=""></div>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
    <!-- this file includes template strings used on the front end by javascript -->
    <?php get_template_part('templates/client', 'templates'); ?>
</div>