<ul<?php if(@$addClass) echo ' class="'.$addClass.'"'; ?>>
<?php
$elementConfiguration = array();

foreach($documents[$id] as $document) {
    echo $this->element('C10m.C10mContentElements/C10mDocument', array('data' => $document));
}
?>
</ul>