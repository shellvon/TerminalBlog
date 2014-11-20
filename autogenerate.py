# !/usr/bin/env python
# author:shell-von

import os
import sys
import codecs

reload(sys)
sys.setdefaultencoding('utf8')

INFO = """
/**
 * This file is @generated automatically.
 * Please do not change this file.
 */
"""


def generate(fpath):
    maps = {f: os.path.join(os.path.relpath(roots), f) for roots, dirs, files in
            os.walk(fpath)for f in files if f.endswith('.md')
            }
    fname_lst = maps.keys()
    content = 'var filenames = {0};\nvar fname_tree = {1};'.format(
        fname_lst, maps)
    with codecs.open('statics/javascript/files_map.js', 'wb', 'utf8') as f:
        f.write(INFO)
        f.write(content)
if __name__ == '__main__':
    generate('gui/markdown')
