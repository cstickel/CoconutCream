<?php
App::import('Controller', 'C10m.C10mEditables');

class C10mDocumentsController extends C10mEditablesController {
    var $name = 'C10mDocuments';

    public $cacheAction = array(
        'index'  => 48000
    );

    function index() {
        if($this->Session->read('C10m.User.level') < 1) {
            $this->redirect('/');
        }
        $documents = $this->C10mDocument->find('all', array('recursive' => 1, 'order' => 'C10mDocument.lft'));
        $documents = Hash::combine($documents, '{n}.C10mDocument.id', '{n}', '{n}.C10mDocument.parent_id');
        $this->set('documents', $documents);
    }

    function sort() {
          $json_array['error'] = 0;
          Configure::write('debug', 2);
          if($this->Session->read('C10m.User.level') < 3) $json_array['error'] = 1;
          else {
              $parentId = @$_REQUEST['parent_id'];
              if(!is_numeric($parentId)) $parentId = null;

              $this->C10mDocument->save(array('C10mDocument' => array('id' => $_REQUEST['id'], 'parent_id' => $parentId)));

              foreach ($_REQUEST['documents'] as $id) {
                  $this->C10mDocument->moveDown($id, true);
              }
          }

        $this->set('json_array', $json_array);
      	$this->layout = 'ajax';
        $this->render('/C10mEditables/default');
      }
};

?>