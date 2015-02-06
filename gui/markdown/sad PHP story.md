最近做公司某个ticket的时候涉及到一个小需求，天真的我写的代码去实现了[ArrayAccess ](http://php.net/manual/en/class.arrayaccess.php)，以为这样我就可以使用PHP中像`array_key_exists`这样的函数，
结果写了半天，发现始终打开方式不对.......

后来，在[这里](http://phpsadness.com/sad/8)看到了一个忧伤的故事～

>Some array functions, like array_key_exists, simply don't work when used on a class which implements all the right interfaces to behave as an array.

简单的代码样例子就用他的吧：

	:::PHP
	<?php
	class X implements ArrayAccess {
  		function offsetGet($key){}
  		function offsetSet($key,$value){}
  		function offsetExists($key){return true;}
  		function offsetUnset($key){}
  	}
  	$x = new X();
  	var_dump(array_key_exists("a", $x));  // outputs bool(false)

唉。。我顺便看了一下[这个网站](http://phpsadness.com/)的其他Sad Story,发现确实有些sad.
