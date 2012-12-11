<?php
class C10mUsersController extends C10mAppController {

	var $name = 'C10mUsers';
	var $helpers = array('Html', 'Form');

	function login() {
		if($this->Session->read('C10m.User')) {
			$this->redirect('/');
		} else {
			if (!empty($this->data)) {
				if($this->data['C10mUser']['name'] == '') {
					$this->set('err1', 'Kein Benutzername angegeben');
				}

                $users = Configure::read('C10m.Users');
                $user = @$users[$this->data['C10mUser']['name']];

				if($user['password'] === $this->data['C10mUser']['pwd']) {
					$this->Session->write('C10m.User', $user);
					$this->redirect('/');
				} else {
					$this->set('err2', 'Falsches Passwort');
				}
			}
		}
	}

	function logout() {
		if($this->Session->read('C10m.User')) {
			$this->Session->delete('C10m.User');
			$this->Session->delete('C10m.EditMode');
		}
		$this->redirect('/');
	}
}
?>