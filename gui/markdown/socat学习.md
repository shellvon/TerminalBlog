

这几天无意发现了一个很好玩的软件叫`socat`.看了一下手册：

		Socat  is a command line based utility that establishes two bidirectional byte streams and transfers data between them. Because the streams can  be constructed from a large set of different types of data sinks and sources (see address types), and because lots of address options may  be  applied to the streams, socat can be used for many different purposes. 

捉急的翻译是：可以在俩数据流之间建立一个双向通道，它的地址类型因为很多所以很好玩(可以用于不同用途～

###端口转发

	:::bash
	➜  ~ socat TCP-LISTEN:80,fork TCP:localhost:8000

这样本来原来应该访问8000端口才可以看到的东西，现在访问80也可以看到。

###传输文件
通常我是用的`scp/nc`之类的命令拷贝的。但是你也可以用这种方式传输

	:::bash
	(hostA)➜  ~ socat TCP4-LISTEN:port OPEN:filename,create,append
	(hostB)➜  ~ cat filename | socat - TCP4:hostA:port

在`hostA`上去监听一个tcp端口port,然后`hostB`中就可以传过去了～～

###网络程序
虽然我不知道是不是应该叫这个名词。

	:::bash
	(hostA)➜  ~ socat tcp-l:1234 exec:/bin/zsh,pty,stderr
	(hostB)➜  ~ socat readline tcp:hostA:1234

可以在另外一台电脑`hostB`上打开`hostA`的zsh(不知道这算不算反弹Shell),如果觉得TCP不安全，socat也支持`openssl`呢。

	:::bash
	(hostA)➜ ~ socat openssl-listen:1234,reuseaddr,cert=./serv.pem,cafile=./client.crt EXEC:/bin/zsh
	(hostB)➜ ~ socat - openssl-connect:172.20.80.253:1234,cert=./client.pem,cafile=./serv.crt
	
可以执行zsh,当然也可以把任何程序变成一个网络程序来玩～ 比如：
	
	:::bash
	socat tcp4-listen:1234,fork EXEC:"python -u program.py"

然后可以用电脑连接过去玩这个～

###结尾
我在学习`socat`的时候看过的一些资料：

+ [http://www.dest-unreach.org/socat/doc/](http://www.dest-unreach.org/socat/doc/)
+ [http://www.volkerschatz.com/net/socatproc.html](http://www.volkerschatz.com/net/socatproc.html)
+ [http://www.brodul.org/socat-hack-for-web-developers.html](http://www.brodul.org/socat-hack-for-web-developers.html)
+ [http://www.radarhack.com/tutorial/DEFEATING_THE_NETWORK_SECURITY_INFRASTRUCTURE.pdf](http://www.radarhack.com/tutorial/DEFEATING_THE_NETWORK_SECURITY_INFRASTRUCTURE.pdf)
+ [https://blog.rootshell.be/2010/10/31/socat-another-network-swiss-army-knife/](https://blog.rootshell.be/2010/10/31/socat-another-network-swiss-army-knife/)
+ [https://www.pentestpartners.com/blog/socat-fu-lesson/](https://www.pentestpartners.com/blog/socat-fu-lesson/)
+ [https://funoverip.net/2011/01/reverse-ssl-backdoor-with-socat-and-metasploit/](https://funoverip.net/2011/01/reverse-ssl-backdoor-with-socat-and-metasploit/)


	



 	
 