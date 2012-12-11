<?php
class SortableBehavior extends ModelBehavior {
	var $settings;

	function setup(&$Model,$settings=array()) {
		if($settings['key']=='')
			$settings['key']='sort_order';

		$this->settings[$Model->alias] = $settings;
	}

	function cleanup(&$Model) {

	}

	function editOrder(&$Model,$id,$follower_id) {
		$object=$Model->findById($id);

		if(!$object) {
			return false;
		}

		$key=$this->settings[$Model->alias]['key'];
		$old_pos=$object[$Model->alias][$key];

		if(is_numeric($follower_id))
			$follower=$Model->findById($follower_id);
		else
			$follower=false;

		if(!$follower) {
			$new_pos=$this->maxPos($Model);
		} else {
			if($old_pos<$follower[$Model->alias][$key])
				$new_pos=$follower[$Model->alias][$key]-1;
			else
				$new_pos=$follower[$Model->alias][$key];
		}

		return $this->setOrder($Model,$id,$old_pos,$new_pos);
	}

	function maxPos(&$Model) {
		if($Model->data[$Model->alias]['parent_id']) {
			$numChildren = $Model->childCount($Model->data[$Model->alias]['parent_id'], true);
			return $numChildren+1;
		} else {
			return $Model->find('count');
		}
	}

	function afterSave(&$Model,$created) {
		if(!$created)
			return true;

		$key=$this->settings[$Model->alias]['key'];
		$id=$Model->getInsertID();

		if(!is_numeric($Model->data[$Model->alias][$key])) {
			$pos=$this->maxPos($Model);

			$Model->query('UPDATE '.$Model->tablePrefix.$Model->useTable.' SET '.$key.'=\''.mysql_real_escape_string($pos).'\' WHERE id=\''.mysql_real_escape_string($id).'\'');
		}

		return true;
	}

	function setOrder(&$Model,$id,$old_pos,$new_pos) {
		$key=$this->settings[$Model->alias]['key'];

		if($old_pos>$new_pos) {
			$Model->query('UPDATE '.$Model->tablePrefix.$Model->useTable.' SET '.$key.'='.$key.'+1 WHERE '.$key.'>=\''.mysql_real_escape_string($new_pos).'\' AND '.$key.'<\''.mysql_real_escape_string($old_pos).'\'');
		} else  if($old_pos<$new_pos) {
			$Model->query('UPDATE '.$Model->tablePrefix.$Model->useTable.' SET '.$key.'='.$key.'-1 WHERE '.$key.'<=\''.mysql_real_escape_string($new_pos).'\' AND '.$key.'>\''.mysql_real_escape_string($old_pos).'\'');
		} else {
			return true;
		}

		$Model->query('UPDATE '.$Model->tablePrefix.$Model->useTable.' SET '.$key.'=\''.mysql_real_escape_string($new_pos).'\' WHERE id=\''.mysql_real_escape_string($id).'\'');

		return true;
	}

	function beforeDelete(&$Model,$cascade) {
			$this->editOrder(&$Model,$Model->id,null);
	}

}
?>