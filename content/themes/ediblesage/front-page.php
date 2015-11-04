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

Key:
<table width="100%" cellpadding="10" border="1" style="margin-bottom: 5px">
    <tr>
    <td width="50px" style="background:#96c25d"></td>
        <td align="left" style="padding-left:2px">Green <br />Space</td> 
    <td width="50px" style="background:#d28cba"></td>
        <td align="left" style="padding-left:2px">Indoor <br />Space</td>
    <td width="50px" style="background:#eac1c0"></td>
        <td align="left" style="padding-left:2px">Pavement <br/>or pedestrian area</td>
    <td width="50px" style="background:#eaaf24"></td>
        <td align="left" style="padding-left:2px">Public Space</td> 
    <td width="50px" style="background:#aedce7"></td>
        <td align="left" style="padding-left:2px">Rooftop</td>
    <td width="50px" style="background:#f4cda3"></td>
        <td align="left" style="padding-left:2px">Tarmac</td> 
    <td width="50px" style="background:#858e93"></td>
        <td align="left" style="padding-left:2px">Vacant Land</td> 

    </tr>
</table>
<div ng-app="App">
    <div ng-view=""></div>
    <!-- this file includes template strings used on the front end by javascript -->
    <?php get_template_part('templates/client', 'templates'); ?>
</div>
