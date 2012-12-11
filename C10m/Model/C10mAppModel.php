<?php
class C10mAppModel extends AppModel {
    var $name = 'C10mAppModel';

    var $translateModel = 'C10m.C10mI18n';

    function __construct($id = false, $table = null, $ds = null) {
		parent::__construct($id, $table, $ds);

     	if(CakeSession::read('C10m.User')) {
			$this->tablePrefix = $this->tablePrefix.'preview_';
     	}
   	}
}
?>