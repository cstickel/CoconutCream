<?php
App::import('Controller', 'C10m.C10mEditables');

class C10mContentElementsController extends C10mEditablesController {
	var $name = 'C10mContentElements';

	function index() {
        $this->set('contentElements', $this->C10mContentElement->get($this->currentDocument['C10mDocument']['id'], 'main', $this->Session->read('C10m.EditMode')));
	}
/*
    function translate() {
        $id = $_REQUEST['id'];
        $sourceLang = $_REQUEST['source'];
        $modelName = Inflector::singularize($this->name);
        Configure::write('debug', 0);
        $json_array['error'] = 0;

		if(!$this->Session->read('c10mAuthorized')) {
			$json_array['error'] = 1;
		} else {
            $langs = Configure::read('C10m.languages');
            $currentLang = Configure::read('Config.language');
            if($langs[$sourceLang] != $currentLang) {
                Configure::write('Config.language', $langs[$sourceLang]);
                $new = $this->$modelName->findById($id);
                Configure::write('Config.language', $currentLang);
                $this->$modelName = new $modelName();

                foreach($new["C10mContentElementI18nData"] as $key => $value) {
                    if($key != 'visible') {
                        unset($new["C10mContentElementI18nData"][$key]['locale']);
                        unset($new["C10mContentElementI18nData"][$key]['id']);
                        unset($new["C10mContentElementI18nData"][$key]['created']);
                        $this->$modelName->saveAll($this->C10mContentElement->fixDataFormat(array(
                                                       "C10mContentElement" => array(
                                                           'id' => $id
                                                       ),
                                                       "C10mContentElementI18nData" => $new["C10mContentElementI18nData"][$key]
                                                   )));
                    }
                }
            }
        }

        $json_array[$modelName] = $this->$modelName->find('first', array('conditions' => array($modelName.'.id' => $id)));
        $this->set('c10mEditablesModel', $modelName);
        $this->set('c10mEditablesElement', Inflector::underscore($modelName));
		$this->set('c10mEditablesJsonArray', $json_array);
		$this->layout = 'ajax';
        $this->render('/c10m_editables/edit');
    }

    function edit() {
        if(is_uploaded_file(@$_FILES['c10mContentElementImage']['tmp_name'])) {
            App::import('Model', 'C10m.C10mImage');

            $image = new C10mImage();
            $uniqid = $image->add(@$_FILES['c10mContentElementImage'], 'C10mContentElement', $this->data['C10mContentElement']['id']);
            if($uniqid) {
                $this->data['C10mContentElementI18nData']['key'] = 'image';
                $this->data['C10mContentElementI18nData']['value'] = $uniqid;
            }
        }

        $this->data = $this->C10mContentElement->fixDataFormat($this->data);

        parent::edit();
    }*/
}

?>