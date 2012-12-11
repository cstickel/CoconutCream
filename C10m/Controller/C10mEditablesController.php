<?php
class C10mEditablesController extends C10mAppController {
	var $name = 'C10mEditablesController';

	function index() {
		
	}

    function get() {
        $modelName = Inflector::singularize($this->name);
        Configure::write('debug', 0);
        $json_array['error'] = 0;

		if($this->Session->read('C10m.User.level') < 1) {
			$json_array['error'] = 1;
		} else {
            if (@$this->data['lang']) {
                $langs = Configure::read('C10m.languages');
                //$this->$modelName->locale = $langs[$this->data['lang']];
                Configure::write('Config.language', $langs[$this->data['lang']]);
            }
            $json_array['data'] = $this->$modelName->find('first', $this->data['options']);
        }
        $this->set('c10mEditablesModel', $modelName);
        $this->set('c10mEditablesJsonArray', $json_array);
		$this->layout = 'ajax';
		$this->render('/c10m_editables/get');
    }

	function edit() {
		$modelName = Inflector::singularize($this->name);
		Configure::write('debug', 0);
		$json_array['error'] = 0;

		if(isset($this->data[$modelName]['lang'])) Configure::write('Config.language', $this->data[$modelName]['lang']);

		if($this->Session->read('C10m.User.level')< 1) {
			$json_array['error'] = 1;
		} else {
       		if (!empty($this->data)) {
                $data = $this->data;
                $data[$modelName] = Hash::expand($data[$modelName]);
                $this->data = $data;
				if($this->data[$modelName]['id'] < 1) {
					unset($this->data[$modelName]['id']);
				}

                if (@$this->data['lang']) {
                    $langs = Configure::read('C10m.languages');
                    $this->$modelName->locale = $langs[$this->data['lang']];
                }
				if ($this->$modelName->saveAll($this->data)) {
					if($this->$modelName->getInsertID() != null) {
						$json_array[$modelName] = $this->$modelName->find('first', array('conditions' => array($modelName.'.id' => $this->$modelName->getInsertID())));
					}
					else {
						$json_array[$modelName] = $this->$modelName->find('first', array('conditions' => array($modelName.'.id' => $this->data[$modelName]['id'])));
					}
					$json_array['error'] = '0';
				} else {
					$json_array['error'] = '2';
				}
			}
		}

        if(!@$this->c10mEditablesElement) $this->c10mEditablesElement = Inflector::underscore($modelName);
        $this->set('c10mEditablesModel', $modelName);
        $this->set('c10mEditablesElement', $this->c10mEditablesElement);
		$this->set('c10mEditablesJsonArray', $json_array);
		$this->layout = 'ajax';
		$this->render('/C10mEditables/edit');
	}

    function delete($id) {
        Configure::write('debug', 0);
        $json_array['error'] = 0;
        $modelName = Inflector::singularize($this->name);

		if($this->Session->read('C10m.User.level')< 1) {
			$json_array['error'] = 1;
		} else {
            $this->$modelName->delete($id);
        }

        $this->set('c10mEditablesJsonArray', $json_array);
		$this->layout = 'ajax';
		$this->render('/C10mEditables/edit');
    }

    function sort($id,$follower_id=null) {
        $modelName = Inflector::singularize($this->name);
    	$json_array['error'] = 0;
		Configure::write('debug', 0);
		if($this->Session->read('C10m.User.level')< 1) $json_array['error'] = 1;
		else {
			if($this->$modelName->editOrder($id,$follower_id)) {
                $json_array['error'] = 0;
            } else {
                $json_array['error'] = 2;
            }
		}
		$this->set('json_array', $json_array);
		$this->layout = 'ajax';
		$this->render('/C10mEditables/edit');
    }
}
?>