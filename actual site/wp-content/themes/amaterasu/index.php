<?php get_header(); ?>
<body>
<div id="menu">
<div class="left">Amaterasu<br/>
    Ace Spacecraft
</div>
<div class="right">
    <p>About</p>
    <p>Data Description</p>
    <p>Export Data</p>
    <p>Contact</p>
</div>
</div>
<div id="wrap">





    <section>
        <div class="chart" id="spiralchart"></div>
        <div id="info"></div>


    </section>


    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="<?php bloginfo('template_url'); ?>/js/spiralSegmentChart.js"></script>
    <script src="<?php bloginfo('template_url'); ?>/js/example2.js"></script>
    <script src="http://yandex.st/highlightjs/7.3/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>

</div>
<!--START Menu -->

<!--END Menu -->

</body>

<?php //get_sidebar(); ?>
<?php //get_footer(); ?>
</html>





