<div id="C10mContentElementsMain">
<?php
    if(@$C10mUser['level'] > 2) {
?>
<span class="addContentElement jfeCEditable" id="C10mContentElementMainNew" data-jfec="<?php
echo htmlspecialchars(json_encode(array(
    "editors" => array(
       array(
           "elementId" => "C10mContentElementMainNew",
           "editor" => "Save",
           "Save" => array(
               "action" => "update",
               "addData" => array(
                   "type" => "Text",
                   "section" => "main",
                   "document_id" => $document['C10mDocument']['id']
                )
            ),
           "onSaveSuccess"=> "appendToParent"
       )
    ),
    "defaults" => array(
         "modelName"=> "C10mContentElement",
         "controller" => "c10m/C10mContentElements"
    )
)));
?>"></span>
<?php
    }
echo $this->element('C10m.C10mContentElements', array('data' => $contentElements));
?>
</div>