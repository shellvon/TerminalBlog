#!/usr/bin/env python

"""
a test script file.

"""

import os
import sys

import generate

reload(sys)
sys.setdefaultencoding('utf8')


def main(path='../gui', render_path='templates'):
    post_dest_path = os.path.join(path, 'post')
    page_dest_path = os.path.join(path, 'page')
    global_data = {
        'blog': {
            'name': "von's blog"
        },
        'author': {
            'name': 'shellvon'
        },
        'root': '/TerminalBlog/gui'
    }
    postgen = generate.ArticleGenerate(
        render_path, post_dest_path, global_data)
    postgen.generate_articles(os.path.join(path, 'markdown'))
    articles = postgen.get_all_articles()
    pagegen = generate.PageGenerate(render_path, page_dest_path, global_data)
    pagegen.generate_pages(articles, 15)
    print 'generate blogs ok..'
if __name__ == '__main__':
    main()
