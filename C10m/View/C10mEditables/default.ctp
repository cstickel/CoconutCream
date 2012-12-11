<?php
	if(is_array(@$json_array['render'])) {
		foreach($json_array['render'] as $element) {
			$json_array['html'][$element['key']] = $this->element($element['view'],$element['data']);
		}
	}
	echo json_encode($json_array);
?>