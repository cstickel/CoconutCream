<script type="text/javascript">
    var BaseURL = '<?php echo $this->Html->url('/', true); ?>';
</script>
<?php
echo $this->Html->script('/C10m/js/vendors/jquery-1.8.3.min', array('block' => 'script'));
echo $this->Html->script('/C10m/js/vendors/jquery-ui-1.9.2.custom.min', array('block' => 'script'));

if(@$C10mUser['level'] > 0) {
    echo $this->Html->script('/C10m/js/jfeComposer/src/jquery.jfeComposer', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/plugins/core', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/plugins/contextmenu', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/adapters/default', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/vendor/rangy/rangy-core', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/vendor/hallo', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/editors/textinput', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/editors/hallo', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/editors/delete', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/src/editors/save', array('block' => 'script'));
    echo $this->Html->script('/C10m/js/jfeComposer/vendor/jquery.mjs.nestedSortable', array('block' => 'script'));

    echo $this->Html->script('/C10m/js/c10m', array('block' => 'script'));


    echo $this->Html->css('/C10m/css/FontAwesome/css/font-awesome');
    echo $this->Html->css('/C10m/css/main');
}
?>