<?php
App::import('Core', array('Router'));

Router::connect('/c10mCache/images/*', array('plugin' => 'c10m', 'controller' => 'C10mImages', 'action' => 'get'));

$langs = Configure::read('C10m.languages');

if(isset($_REQUEST['lang'])) $lang = $_REQUEST['lang'];
//todo: this should work for subdirs, too. But Dispatcher is not available. How to get baseURL?
else $lang = substr($_SERVER['REQUEST_URI'].'/', 1, 2);

Router::connect('/', array('controller' => 'C10mRedirects', 'action' => 'doRedirect', 'plugin' => 'c10m', Configure::read('C10m.Home')));
if(@$langs[$lang]) {
    App::import('Component', 'Session');
    $session = new SessionComponent(new ComponentCollection());
    $session->write('c10mLanguage', $langs[$lang]);

    $routes = Cache::read('routes_'.$langs[$lang]);

    if(!$routes) {
        App::import('Model', 'C10m.C10mDocument');
        $document = new C10mDocument();
        $documents = $document->find('all', array(
        			'fields' => array('C10mDocument.id','C10mDocument.parent_id', 'C10mDocument.type'),
        			'order' => 'C10mDocument.lft',
                    'conditions' => array('C10mEavName.content is not null'),
                    'C10mEavConditionAttributes' => "name"
        ));
        foreach(array_keys($documents) as $key) {
            $documents[$key]['C10mDocument']['C10mEavI18n']['name'] = urlencode(c10mText2UrlCharReplacement($documents[$key]['C10mDocument']['C10mEavI18n']['name']));
        }
        $routes = Hash::combine($documents, '{n}.C10mDocument.C10mEavI18n.name', '{n}', '{n}.C10mDocument.parent_id');
        Cache::write('routes_'.$langs[$lang], $routes);
    }

    $request = Router::getRequest();
    $parentId = 0;
    $i = 1;
    $match = false;
    $routeParts = explode('/', $request->url);
    while(isset($routeParts[$i]) && Hash::check($routes, $parentId.'.'.$routeParts[$i])) {
        $match = $routes[$parentId][$routeParts[$i]];
        $parentId = $match['C10mDocument']['id'];
        $i++;
    }
    if($match) {
        $documentTypes = Configure::read('C10m.documentTypes');
        $documentType = $documentTypes[$match['C10mDocument']['type']];

        Router::connect($request->here.'*', array('plugin' => $documentType['plugin'],'controller' => $documentType['controller'], 'action' => $documentType['action'], 'documentId' => $match['C10mDocument']['id'], 'c10mLang' => $lang));
    }
}