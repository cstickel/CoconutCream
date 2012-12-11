<?php

App::import('Controller', 'C10m.C10mAppController');

class C10mStaticsController extends C10mAppController {
	var $name = 'C10mStatics';

	function view() {
        $this->render($this->currentDocument['C10mDocument']['id']);
    }

}

?>