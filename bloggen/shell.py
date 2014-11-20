#!/usr/bin/env python

"""
a test script file.

"""

import sys

import generate

reload(sys)
sys.setdefaultencoding('utf8')


def main():
    render_path = 'templates'
    post_dest_path = '../gui/post'
    page_dest_path = '../gui/page'
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
    postgen.generate_articles('../gui/markdown')
    articles = postgen.get_all_articles()
    pagegen = generate.PageGenerate(render_path, page_dest_path, global_data)
    pagegen.generate_pages(articles, 15)
    print 'generate ok..'
if __name__ == '__main__':
    main()
