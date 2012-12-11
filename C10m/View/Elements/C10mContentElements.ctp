<?php
if(is_array(@$data))
    foreach($data as $contentElement) {
        echo $this->element('C10m.C10mContentElement', array('data' => $contentElement));
}