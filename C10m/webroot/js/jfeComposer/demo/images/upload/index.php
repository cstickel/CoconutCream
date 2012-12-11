<?php
foreach(array_keys(@$_FILES['images']['tmp_name']) as $key) {
			if(is_uploaded_file($_FILES['images']['tmp_name'][$key])) {
				$path = './'.$_FILES['images']['name'][$key];
				move_uploaded_file($_FILES['images']['tmp_name'][$key], $path);
				chmod($path, 0777);
			}
		}

echo '{
"error": 0
}';
?>