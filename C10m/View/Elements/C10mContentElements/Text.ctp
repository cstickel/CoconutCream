<?php
$elementConfiguration =  array(
    "editors" => array(
       array(
           "elementId" => 'C10mContentElementTitle_'.$data['C10mContentElement']['id'],
           "editor" => "Textinput",
           "Textinput" => array(
                "fieldName"=> "C10mEavI18n.title"
            )
       ),
       array(
            "elementId" => 'C10mContentElementBody_'.$data['C10mContentElement']['id'],
            "editor" => "Hallo",
            "Hallo" => array(
                "fieldName"=> "C10mEavI18n.body"
            )
       ),
       array(
           "elementId" => 'C10mContentElement_'.$data['C10mContentElement']['id'],
           "editor" => "Delete",
           "id" => 'C10mDeleteContentElement_'.$data['C10mContentElement']['id'],
           "event" => "none",
           "Delete" => array(
            "id" => $data['C10mContentElement']['id']
           ),
           "onSaveSuccess" => "fadeOut"
       )
    ),
    "ContextMenu" => array(
        "actions" => array(
            array(
                "class" => "Delete",
                "target" => "C10mDeleteContentElement_".$data['C10mContentElement']['id'],
                "description" => "Dieses Element löschen."
            )
        )
    ),
    "defaults" => array(
         "modelName"=> "C10mContentElement",
         "controller" => "c10m/C10mContentElements",
         "defaultText"=> "Bitte Text eingeben...",
         "postData" => array(
             "data" => array(
                 "C10mContentElement" => array(
                     "id" => $data['C10mContentElement']['id']
                 )
             )
         )
    )
);
?>

<div id="C10mContentElement_<?php echo $data['C10mContentElement']['id']; ?>"<?php
    if(@$C10mUser['level'] > 2) echo ' class="jfeCEditable" data-jfec="'.htmlspecialchars(json_encode($elementConfiguration)).'"';
    ?>>
    <h2 id="C10mContentElementTitle_<?php echo $data['C10mContentElement']['id']; ?>"><?php echo @$data['C10mContentElement']['C10mEavI18n']['title']; ?></h2>
    <div id="C10mContentElementBody_<?php echo $data['C10mContentElement']['id']; ?>"><?php echo @$data['C10mContentElement']['C10mEavI18n']['body']; ?></div>
</div>