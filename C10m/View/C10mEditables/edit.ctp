<?php
$c10mEditablesJsonArray['html'] = $this->element('C10m.C10mContentElements/'.$c10mEditablesModel, array('data' => $c10mEditablesJsonArray[$c10mEditablesModel]));
echo json_encode($c10mEditablesJsonArray);
?>