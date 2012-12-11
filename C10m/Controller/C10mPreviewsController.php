<?php
class C10mPreviewsController extends AppController {
	var $name = 'C10mPreviews';

	function publish() {
        Configure::write('debug', 0);
		$json_array['error'] = 0;


        if($this->Session->read('C10m.User.level') < 1) {
			$json_array['error'] = 1;
		} else {
	        $this->C10mPreview->publishPreviewTables();
        }
        
        $this->layout = 'ajax';
        $this->set('c10mEditablesJsonArray', $json_array);

    }
}
?>