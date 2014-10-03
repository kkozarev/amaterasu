<?php
/**
 * The template for Footer.
 *
 * @package Simon WP Framework
 * @since Simon WP Framework 1.0
 */
?>

<div class="clear"></div>
<div class="outer_footer_wrap">
  <div class="inner_footer_wrap">
    <div class="content">
      <div style="clear: both"></div>
      <div id="footer">
        <?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar("Footer1") ) : ?>
        <?php endif; ?>
        <?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar("Footer2") ) : ?>
        <?php endif; ?>
        <?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar("Footer3") ) : ?>
        <?php endif; ?>
        <div style="clear: both"></div>
        <p>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?> | Powered By Simon WP Framework &amp; WordPress</p></div>
    </div>
  </div>
</div>
<?php wp_footer(); ?>

</body></html>