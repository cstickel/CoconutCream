<?php

if(!$c10mEditablesJsonArray['data'][$c10mEditablesModel]) {
    foreach($c10mEditablesJsonArray['data'] as $key => $data) {
        $c10mEditablesJsonArray['data'][$key][$c10mEditablesModel]['html'] = $this->element($c10mEditablesElement, array('data' => $data));
    }
}
else $c10mEditablesJsonArray['data'][$c10mEditablesModel]['html'] = $this->element($c10mEditablesElement, array('data' => $c10mEditablesJsonArray['data']));

echo json_encode($c10mEditablesJsonArray);
?>