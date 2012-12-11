<?php
class C10mRedirectsController extends AppController {

	var $name = 'C10mRedirects';

	public function doRedirect($id) {
        $this->redirect($this->C10m->url($id), 301);
	}
}
?>