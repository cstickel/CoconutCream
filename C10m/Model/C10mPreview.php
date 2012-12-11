<?php
class C10mPreview extends AppModel {
	var $name = 'C10mPreview';
	var $useTable = false;
   	
   	public function publishPreviewTables() {
   		$preview = $this->query('show tables like "'.$this->tablePrefix.'preview_%";');
   		foreach($preview as $table) {
               $previewName = current($table["TABLE_NAMES"]);
               $name = substr($previewName, strlen($this->tablePrefix.'preview_'));
               $liveName = $this->tablePrefix.$name;

               $this->query("DROP TABLE IF EXISTS ".$liveName);

               $this->query("CREATE TABLE ".$liveName." like ".$previewName);
               $this->query("INSERT INTO ".$liveName." SELECT * FROM ".$previewName);
   			}
   	}
}
?>