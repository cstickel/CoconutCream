<div class="textBody">
<div id="login">
<h1><?php __('Login'); ?></h1>
<?php
echo $this->Form->create('C10mUser', array('url'=>'login', 'class'=>'contentForm'));
echo $this->Form->input('name', array('label'=>__('User', true).':','maxLength'=> 50, 'class'=>'login_input'));
if(isset($err1)) echo $err1;
echo $this->Form->input('pwd', array('label'=>__('Passowrd', true).':','type'=>'password', 'class'=>'login_input'));
if(isset($err2)) echo $err2.'<br />';
	echo $this->Form->button(__('Login', true),array('alt'=>__('Anmelden', true), 'class' => 'submit', 'type' => 'submit')),
	$this->Form->end();
?></div>
</div>