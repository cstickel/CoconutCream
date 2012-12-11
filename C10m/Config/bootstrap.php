<?php
function c10mText2UrlCharReplacement($text) {
	$text=str_replace(' ', '-', $text);
	$text= preg_replace('/[^a-zA-Z0-9öäüÖÄÜ]/','-',$text);
	$text= preg_replace('/-+/','-',$text);
	return $text;
}

//Default Configuration

Configure::write('C10m.languages', array(
    'en' => 'eng'
));

config('C10mConfig');