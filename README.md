TerminalBlog
============

geek版博客

TerminalBlog目录下`bloggen`是Python写的自动生成博客的静态博客生成器，
属于测试阶段。daemon不支持windows.自能手动执行shell.py的main方法。
不支持命令行部署/生成/日志。。。。。

gui目录是利用blogen生成的gui博客。其中`gui/post`内容是利用`gui/markdown`
里面的内容自动生成.

`TerminalBlog/index.html`是终端版本的博客。只支持使用cat/more等命令查看markdown的内容

`autogenerate.py`用来生成终端需要的配置数据。

大概就是这些
