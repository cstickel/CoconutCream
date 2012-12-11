<div id="C10mEditorSitemap">
<span class="addContentElement jfeCEditable" id="C10mDocumentNew" data-jfec="<?php
echo htmlspecialchars(json_encode(array(
    "editors" => array(
       array(
           "elementId" => "C10mDocumentNew",
           "editor" => "Save",
           "Save" => array(
               "action" => "update",
               "addData" => array(
                    "C10mEavI18n"=> array(
                        "name" => ""
                    ),
                )
            ),
           "onSaveSuccess"=> "appendToC10mEditorSitemap"
       )
    ),
    "defaults" => array(
         "modelName"=> "C10mDocument",
         "controller" => "c10m/C10mDocuments"
    )
)));
?>"></span>
<?php
echo $this->element('C10m.RecursiveNavigation', array('documents' => $documents, 'id' => 0));
?>
</div>