<div ng-app="App">
    <a href="#/peterborough">Peterborough</a> | 
    <a href="#/newcastle">Newcastle</a> | 
    <a href="#/dallas">Dallas</a> |
    <a href="wordpress/wp-admin/">Log In</a>
    <hr />
    <div ng-view=""></div>
    <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
</div>