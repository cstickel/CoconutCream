<?php
if(!$documents) $documents = array();

$elementConfiguration =  array(
                "editors" => array(
                   array(
                       "elementId" => "C10mDocumentName_".$data['C10mDocument']['id'],
                       "editor" => "Textinput",
                       "Textinput" => array(
                            "fieldName"=> "C10mEavI18n.name"
                        )
                   ),
                   array(
                       "elementId" => "C10mDocument_".$data['C10mDocument']['id'],
                       "editor" => "Delete",
                       "id" => "C10mDeleteDocument_".$data['C10mDocument']['id'],
                       "event" => "none",
                       "Delete" => array(
                        "id" => $data['C10mDocument']['id']
                       ),
                       "onSaveSuccess" => "fadeOut"
                   )
                ),
                "ContextMenu" => array(
                    "actions" => array(
                        array(
                            "class" => "Delete",
                            "target" => "C10mDeleteDocument_".$data['C10mDocument']['id'],
                            "description" => "Dieses Dokument löschen."
                        )
                    )
                ),
                "defaults" => array(
                     "modelName"=> "C10mDocument",
                     "controller" => "c10m/C10mDocuments",
                     "defaultText"=> "Bitte Text eingeben...",
                     "postData" => array(
                         "data" => array(
                             "C10mDocument" => array(
                                 "id" => $data['C10mDocument']['id']
                             )
                         )
                     )
                )
            );
echo '<li class="jfeCEditable" data-jfec="'.htmlspecialchars(json_encode($elementConfiguration)).'" id="C10mDocument_'.$data['C10mDocument']['id'].'"><span id="C10mDocumentName_'.$data['C10mDocument']['id'].'">'.@$data['C10mDocument']['C10mEavI18n']['name'].'</span>';
   if(is_array(@$documents[$data['C10mDocument']['id']])) echo $this->element('C10m.RecursiveNavigation', array('documents' => $documents, 'id' => $data['C10mDocument']['id']));
echo '</li>';
?>