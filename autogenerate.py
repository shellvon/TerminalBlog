# !/usr/bin/env python
# author:shell-von

import os
import json

INFO = """
/**
 * This file is @generated automatically.
 * Please do not change this file.
 */
"""


def generate(fpath):
	# ignore the .git folders.
    maps = {f: os.path.join(os.path.relpath(roots), f) for roots, dirs, files in
    	os.walk(fpath)for f in files
    		if not os.path.join(os.path.relpath(roots), f).startswith('.git')
    	}
    fname_lst = maps.keys()
    content = 'var filenames = {0};\nvar fname_tree = {1};'.format(fname_lst, maps)
    with open('statics/javascript/files_map.js', 'wb') as f:
        f.write(INFO)
        f.write(content)
if __name__ == '__main__':
    generate(os.getcwd())
