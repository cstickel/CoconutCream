<?php
class C10mContentElement extends C10mAppModel {
	var $name = 'C10mContentElement';

    var $hasMany = array(
           'C10mEav' => array(
               'className' => 'C10m.C10mEav',
               'foreignKey' => 'foreign_key',
               'dependent'     => true
           )
       );

    var $actsAs=array(
        'C10m.Sortable'=>array('key'=>'sort_order'),
        'C10m.Eav'
    );
/*
    var $hasMany = array('C10m.C10mContentElementData', 'C10m.C10mContentElementI18nData');

   function fixDataFormat($data = false) {
       if(!$data) $data = $this->data;

        if($data['C10mContentElementI18nData'] && array_values($data['C10mContentElementI18nData']) !== $data['C10mContentElementI18nData']) {
            $data['C10mContentElementI18nData'] = array($data['C10mContentElementI18nData']);
        }
        if($data['C10mContentElementData']) $data['C10mContentElementData'] = array($data['C10mContentElementData']);


       if(@$data['C10mContentElement']['id'] > 0) {
            foreach($data['C10mContentElementI18nData'] as $key => $i18nData) {
                if(!isset($i18nData['id']) || $i18nData['id'] < 1) {
                     $exists = $this->C10mContentElementI18nData->find('first', array('conditions' => array('key' => $i18nData['key'], 'c10m_content_element_id' => $data['C10mContentElement']['id'])));
                     if($exists) {
                         $data['C10mContentElementI18nData'][$key]['id'] = $exists['C10mContentElementI18nData']['id'];
                     }
                }
            }
        }
        $this->data = $data;
        return $this->data;
    }

    function afterFind(array $results) {
        if(!isset($results[0]['C10mContentElement'])) return $results;
        App::Import('Model', 'C10m.C10mContentElementData');
        App::Import('Model', 'C10m.C10mContentElementI18nData');

        $C10mContentElementData = new C10mContentElementData();
        $C10mContentElementI18nData = new C10mContentElementI18nData();

        $ids = Set::extract($results, '/C10mContentElement/id');

        $result = $C10mContentElementI18nData->find('all', array('conditions' => array('C10mContentElementI18nData.c10m_content_element_id' => $ids)));
        $i18nData = Set::combine($result, '/C10mContentElementI18nData/key', '{n}.C10mContentElementI18nData', '/C10mContentElementI18nData/c10m_content_element_id');

        $result = $C10mContentElementData->find('all', array('conditions' => array('C10mContentElementData.c10m_content_element_id' => $ids)));
        $data = Set::combine($result, '/C10mContentElementData/key', '{n}.C10mContentElementData', '/C10mContentElementData/c10m_content_element_id');

        $results = Set::combine($results, '/C10mContentElement/id', '/');

        foreach($data as $key=>$val) {
            $results[$key]['C10mContentElementData'] = $val;
        }
        foreach($i18nData as $key=>$val) {
            $results[$key]['C10mContentElementI18nData'] = $val;
        }
        return array_values($results);
    }
*/
    function get($documentId = false,$section = false, $showHidden = false) {
        $conditions = array();
        if($documentId) $conditions['C10mContentElement.document_id'] = $documentId;
        if($section) $conditions['C10mContentElement.section'] = $section;
        $options = array('conditions' => $conditions,'order' => 'C10mContentElement.sort_order ASC');
        if(!$showHidden) {
            $conditions['C10mEavVisible.content'] = 1;
            $options['C10mEavConditionAttributes'] = "name";
        }

        return $this->find('all', $options);
    }
}
?>