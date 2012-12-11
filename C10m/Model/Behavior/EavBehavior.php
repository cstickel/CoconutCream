<?php
class EavBehavior extends ModelBehavior {
	var $settings;

	function setup(&$Model,$settings=array()) {
		$this->settings[$Model->alias] = $settings;
        $result = App::import('I18n', 'I18n');
	}

	function cleanup(&$Model) {

	}


    /**
     * From TranslateBehavior
     * Get selected locale for model
     *
     * @param Model $Model Model the locale needs to be set/get on.
     * @return mixed string or false
     */
	protected function _getLocale(Model $Model) {
        if (!isset($Model->locale) || is_null($Model->locale)) {
			$I18n = I18n::getInstance();
			$I18n->l10n->get(Configure::read('Config.language'));
			$Model->locale = $I18n->l10n->locale;
		}

		return $Model->locale;
	}

	function beforeValidate(&$Model) {
        $Eav = new C10mEav();
        $locale = $this->_getLocale($Model);
        $existingFields = $Eav->find('list', array('fields' => array('C10mEav.field', 'C10mEav.id'), 'conditions' => array('locale' => $locale, 'model' => $Model->alias, 'foreign_key' => $Model->getID())));

        if(!isset($Model->data['C10mEav'])) $Model->data['C10mEav'] = array();
        if(isset($Model->data[$Model->alias]['C10mEavI18n']))
            foreach($Model->data[$Model->alias]['C10mEavI18n'] as $key => $val) {
                array_push($Model->data['C10mEav'], array(
                    "locale" => $locale,
                    "model" => $Model->alias,
                    "field" => $key,
                    "content" => $val
                ));
            }

        if(isset($Model->data[$Model->alias]['C10mEav']))
            foreach($Model->data[$Model->alias]['C10mEav'] as $key => $val) {
                array_push($Model->data['C10mEav'], array(
                    "locale" => null,
                    "model" => $Model->alias,
                    "field" => $key,
                    "content" => $val
                ));
            }
        foreach($Model->data['C10mEav'] as $key => $val) {
            if(isset($existingFields[$Model->data['C10mEav'][$key]["field"]])) {
                $Model->data['C10mEav'][$key]["id"] = $existingFields[$Model->data['C10mEav'][$key]["field"]];
            }
        }
		return true;
	}

    function beforeFind($Model, $query) {
        App::import('Model', 'C10m.C10mEav');
        $Eav = new C10mEav();
        if(isset($query['C10mEavConditionAttributes'])) {
            if(!isset($query['joins'])) {
                $query['joins'] = array();
            }

            $locale = $this->_getLocale($Model);
            if(!is_array($query['C10mEavConditionAttributes'])) $query['C10mEavConditionAttributes'] = array($query['C10mEavConditionAttributes']);
            foreach($query['C10mEavConditionAttributes'] as $attr) {
                $alias = 'C10mEav'.Inflector::camelize($attr);
                array_push($query['joins'], array(
                    'table' => $Eav->tablePrefix.$Eav->table,
                    'alias' => $alias,
                    'type' => 'LEFT',
                    'conditions'=> array($Model->alias.'.id = '.$alias.'.foreign_key', $alias.'.model' => $Model->alias, $alias.'.field' => $attr, $alias.'.locale' => $locale)
                ));
            }
        }
        return $query;
    }

    function afterFind(&$Model, $results) {
        $locale = $this->_getLocale($Model);
        foreach($results as $key => $result) {
            if(isset($result["C10mEav"])){
                $eavs = Hash::combine($results[$key]['C10mEav'],'{n}.field', '{n}.content', '{n}.locale');
                $results[$key][$Model->alias]['C10mEav'] = isset($eavs[0]) ? $eavs[0] : array();
                $results[$key][$Model->alias]['C10mEavI18n'] = isset($eavs[$locale]) ? $eavs[$locale] : array();
                $results[$key][$Model->alias]['C10mEavAll'] = $eavs;
            }
            unset($results[$key]['C10mEav']);
        }
        return $results;
    }
}
?>