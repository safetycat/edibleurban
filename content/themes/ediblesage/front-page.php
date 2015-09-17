<div class="intro-text well">
<?php while (have_posts()) : the_post(); ?>
    <?php the_content(); ?>
<?php endwhile; ?>
<button class="intro-text_close_open button btn-default">
    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="text"> Close</span>
</button>
</div>

<script type="text/javascript">
    
    jQuery(function(){
        jQuery('.intro-text_close_open').click(function(e){
            $box = jQuery('.intro-text');
            console.log($box);
            if($box.hasClass('minimised')){
                $box.removeClass('minimised');
                 $box.find('.text').html(' Close');
            } else {
                $box.addClass('minimised');
                $box.find('.text').html(' Open');
            }
        });
    });
</script>

<div ng-app="App">
    <div ng-view=""></div>
    <!-- this file includes template strings used on the front end by javascript -->
    <?php get_template_part('templates/client', 'templates'); ?>
</div>