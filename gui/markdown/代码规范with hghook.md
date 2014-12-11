我的代码风格被吐槽不只一次了，至于多差可以参考[我的github](https://github.com/shellvon?tab=repositories),我平时写代码的习惯一览无余.

记得在大约一个月以前，我参加知道创宇面试->面试官最后给我的评价其中之一就是我的代码规范问题。面试官提示我的另外一个问题是我的心浮气躁，我一直在尽力去改.

恩，此处演示如何在hg中添加代码规范检测的hook.
因为项目使用的PHP,所以规范检测自然用的是PHPCS。

######1.进入项目根目录,并执行添加hook的脚本.

	:::shell
	#!/usr/bin/env bash
	BASEDIR=$(dirname $0)
	hgrcfile=".hg/hgrc"
	hookstr="[hooks]"
	precommitstr="precommit.phpcs = $BASEDIR/pre-commit"

	cp -n $hgrcfile $hgrcfile.org
	if grep 'hooks' $hgrcfile --quiet; then
	    if grep 'precommit.phpcs' $hgrcfile --quiet; then
	        "$BASEDIR"/remove-hook.sh
	    fi
	    sed -i s!'^\[hooks\]'!'[hooks]\n'"$precommitstr"! $hgrcfile
	else
	    echo "" >> $hgrcfile
	    echo $hookstr >> $hgrcfile
	    echo $precommitstr >> $hgrcfile
	fi


######2.检查配置是否正确
    #grep 'precommit.phpcs'  path/to/.hgrc

以上shell脚本是为其添加hook，事件是precommit,需要调用的脚本名字是pre-commit,下面是precommit的源代码


	:::shell
	#!/bin/bash
	set -f
	commitFiles=`hg status -nam`
	args='-n -p -s'
	phpFiles="";
	phpFilesCount=0;
	[ -f .hgignore ] && ignoreFile="`tr '\n' ',' < .hgignore |sed 's/,$//g'`"
	for f in $commitFiles; do
	    if [[ ! -e $f ]]; then
	        continue;
	    fi
	    if [[ $f == *.php ]]; then
	        phpFilesCount=$((phpFilesCount+1))
	        phpFiles="$phpFiles $f"
	    fi
	done;
	if [[ $phpFilesCount -eq 0 ]]; then
	    exit 0;
	fi
	if [[ $phpFilesCount > 2 ]]; then
	    args="$args --report=summary"
	fi
	ignoreFile="$ignoreFile"
	[ -n $ignoreFile ] && args=`echo "${args} --ignore='${ignoreFile}'"`
	eval phpcs $args $phpFiles

如果shell脚本看不懂，可以看这里=>[参考文档](http://mercurial.selenic.com/wiki/HookExamples)
使用Python编写：
	
	:::python
	#coding: utf8
	import sys
	import os
	import platform

	def phpcs(ui, repo, hooktype, node=None, source=None, **kwargs):
	    cmd = 'hg status -n'
	    stFileList = ''
	    stFileCount = 0
	    for item in os.popen(cmd).readlines():
	        itemList = item.strip().split(".")
	        if (itemList[len(itemList)-1]).strip().lower() == 'php' :
	            if stFileCount == 0 :
	                stFileList = item
	            else :
	                stFileList = stFileList + " " + item
	            stFileCount = stFileCount + 1
	    if stFileCount > 0 :
	        argsPHPCS = ""
	        cmdPHPCS = "phpcs %s %s" % (argsPHPCS , stFileList)
	        errorMsg = os.popen(cmdPHPCS).read().strip()
	        if errorMsg != '':
	            ui.warn(errorMsg)
	            return True        
	    return False

使用git的请[参考这里](http://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).


测试文章结束。。