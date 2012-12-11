<?php
class C10mHelper extends AppHelper {

	function url($id, $options = false) {
        $sitemap = $this->_View->viewVars['c10mSitemap'];

        $langs = Configure::read('C10m.languages');

        if(isset($options['lang'])) $lang = $options['lang'];
        else {
            $flipped = array_flip($langs);
            $lang = $flipped[Configure::read('Config.language')];
        }

		$pathList = array();
		$current = $sitemap[$langs[$lang]][$id];

		while($current) {
			$pathList[] = $current['name'];
			$current = @$sitemap[$langs[$lang]][$current['parent_id']];
		}

		$url = '';

        foreach(array_reverse($pathList) as $item) $url .= '/'.urlencode(c10mText2UrlCharReplacement($item));
        if(@$options['preserveParams'] && is_array(@$this->_View->viewVars['preserveParams'])) {
            foreach(@$this->_View->viewVars['preserveParams'] as $item) $url .= '/'.urlencode($item);
        }
		return $this->output('/'.$lang.$url.'/');
	}

}
?>