<?php
class C10mAppController extends Controller
{
    var $helpers = array('Html', 'Form', 'C10m.C10m', 'Cache');
    var $uses = array('C10m.C10mDocument', 'C10m.C10mContentElement');
    var $components = array('Session', 'C10m.C10m');

    function beforeFilter()
    {
        $currentLang = $this->Session->read('c10mLanguage');
        $langs = Configure::read('C10m.languages');
        if(!$currentLang) {
            $browserLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
            if(@$langs[$browserLang]) $currentLang = $langs[$browserLang];
            else $currentLang = current($langs);
        }

        Configure::write('Config.language', $currentLang);

        $routerRequest = Router::getRequest();
        $this->currentDocument = $this->C10mDocument->findById(@$routerRequest->params['documentId']);

        if(!$routerRequest) {
            $flipped = array_flip($langs);
            $this->redirect('/' . $flipped[$currentLang] . '/', 301);
        }

        $sitemap = Cache::read('c10m_sitemap');
        if (!$sitemap) {
            $sitemapDocuments = $this->C10mDocument->find('all', array(
                'fields' => array('C10mDocument.id', 'C10mDocument.parent_id','C10mDocument.hide_in_navigation'),
                'order' => 'C10mDocument.lft',
                'conditions' => array('C10mEavName.content is not null'),
                'C10mEavConditionAttributes' => "name"
            ));

            $sitemap = array();

            foreach ($sitemapDocuments as $sitemapItem) {
                foreach ($sitemapItem['C10mDocument']['C10mEavAll'] as $locale => $translation) {
                    $sitemap[$locale][$sitemapItem['C10mDocument']['id']] = array(
                        'id' => $sitemapItem['C10mDocument']['id'],
                        'name' => $translation['name'],
                        'parent_id' => $sitemapItem['C10mDocument']['parent_id'],
                        'hide_in_navigation' => $sitemapItem['C10mDocument']['hide_in_navigation']
                    );
                }
                $sitemap['allLang'][$sitemapItem['C10mDocument']['id']] = array(
                    'id' => $sitemapItem['C10mDocument']['id'],
                    'parent_id' => $sitemapItem['C10mDocument']['parent_id'],
                    'hide_in_navigation' => $sitemapItem['C10mDocument']['hide_in_navigation']
                );
            }

            Cache::write('c10m_sitemap', $sitemap);
        }

        $this->c10mSitemap = $sitemap;
        $this->set('c10mSitemap', $sitemap);

        if ($this->Session->read('C10m.User.level') > 0) {
            $editMode = $this->Session->read('C10m.EditMode');
            if (isset($_REQUEST['c10mEditMode'])) {
                $editMode = $_REQUEST['c10mEditMode'];
                $this->Session->write('C10m.EditMode', $editMode);
            }
        }
        else $editMode = false;

        $this->set('C10mUser', $this->Session->read('C10m.User'));
        $this->set('C10mEditMode', $editMode);

        $this->set('lang', Configure::read('Config.language'));
    }

    function beforeRender()
    {
        $unifyDomain = Configure::read('c10m.unifyDomain');

        if ($unifyDomain && $unifyDomain != $_SERVER['HTTP_HOST']) {
            $this->redirect('http://' . $unifyDomain . Router::url(), '301');
        }

        if ($this->currentDocument) {
            $this->set('leftCol', $this->C10mContentElement->get($this->currentDocument['C10mDocument']['id'], 'left', $this->Session->read('C10m.EditMode')));
            $documentTypes = Configure::read('C10m.documentTypes');
            $template = @$documentTypes[$this->currentDocument['C10mDocument']['type']]['template'];
            if($template) $this->layout = $template;
            $path = $this->C10mDocument->getPath($this->currentDocument['C10mDocument']['id'], false, 1);
        }

        if ($this->name == "CakeError") {
          if(Configure::read('debug') == 0) $this->redirect($this->C10m->url(Configure::read('C10m.errorPage')));
        }

        $navigation = $this->C10mDocument->find('all', array(
            'fields' => array('C10mDocument.id','C10mDocument.parent_id', 'C10mDocument.hide_in_navigation'),
            'recursive' => 1,
            'order' => 'C10mDocument.lft',
            'conditions' => array('C10mEavName.content is not null AND C10mDocument.hide_in_navigation = 0'),
            'C10mEavConditionAttributes' => "name"
        ));

        $navigation = Hash::combine($navigation, '{n}.C10mDocument.id', '{n}', '{n}.C10mDocument.parent_id');

        $this->set('c10mNavigation', $navigation);
        $this->set('c10mPath', @$path);
        $this->set('document', $this->currentDocument);
    }
}

?>