# !/usr/bin/env python
# author:shell-von

import os
import sys
import codecs
import json

reload(sys)
sys.setdefaultencoding('utf8')

INFO = """
/**
 * This file is @generated automatically.
 * Please do not change this file.
 */
"""


def _chinese(source):
    """
    Convert source to Chinese
    """
    return json.dumps(source, ensure_ascii=False)


def generate(fpath):
    maps = {f: os.path.join(os.path.relpath(roots), f) for roots, dirs, files
            in os.walk(fpath) for f in files if f.endswith('.md')
            }
    fname_lst = maps.keys()
    # print _chinese(fname_lst)
    content = 'var filenames = {0};\nvar fname_tree = {1};'.format(
        _chinese(fname_lst), _chinese(maps))
    with codecs.open('statics/javascript/files_map.js', 'wb', 'utf8') as f:
        f.write(INFO)
        f.write(content)
    print 'generate file_map.js ok!'

if __name__ == '__main__':
    try:
        from bloggen import shell
    except Exception, e:
        print e
        exit()
    generate('gui/markdown')
    shell.main('gui', 'bloggen/templates')
