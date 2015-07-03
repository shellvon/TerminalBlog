#encoding = utf8
import urllib
import os
fw = open('ebook.txt','w')
fw.write('{ "data":[\n')
with open('123.txt','r') as fr:
	for i, line in enumerate(fr):
		book_name,url = urllib.unquote(line.split('|')[2]),line.strip()
		fmt = '["%s","%s"]\n'%(book_name,url) if i==0 else ',["%s","%s"]\n'%(book_name,url)
		fw.write(fmt)
fw.write(']}\n')
print 'ok'