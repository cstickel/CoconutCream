<?php
class C10mDocument extends C10mAppModel {
	var $name = 'C10mDocument';

    var $hasMany = array(
        'C10mEav' => array(
            'className' => 'C10m.C10mEav',
            'foreignKey' => 'foreign_key',
            'dependent'     => true
        )
    );

    public $actsAs = array(
        'Tree',
        'C10m.Eav'
    );

    function afterSave() {
        $lang = Configure::read('Config.language');
        Cache::delete('c10m_sitemap');
        Cache::delete('routes_'.$lang);
    }
}
?>