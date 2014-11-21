#!/usr/bin/env python

import codecs
import os
import datetime

import jinja2
import markdown

import model


class Renderer(object):

    """docstring for Renderer"""

    def __init__(self, path='/'):
        self.templateLoader = jinja2.FileSystemLoader(searchpath=path)
        self.templateEnv = jinja2.Environment(loader=self.templateLoader)

    def render(self, template, **data):
        html = self.templateEnv.get_template(template).render(**data)
        return html

    def render_to(self, output, template, **data):
        with codecs.open(output, 'wb', 'utf8') as f:
            f.write(self.render(template, **data))


class MarkdownParser(object):

    """docstring for MarkdownParser"""

    def __init__(self):
        self.extensions = ['markdown.extensions.codehilite']

    def parse(self, source):
        md = markdown.markdown(source, extensions=self.extensions)
        return md


class Generate(object):

    """docstring for Generate"""

    def __init__(self, render_path, dest_path=None, global_data={}):
        self.render_path = render_path
        self.dest_path = render_path if dest_path is None else dest_path
        self.global_data = global_data
        self.render = Renderer(self.render_path)

    def generate(self, template, **data):
        return self.render.render(template, **data)

    def generate_to(self, output, template, **data):
        self.render.render_to(output, template, **data)


class PageGenerate(Generate):

    """docstring for PageGenerate"""

    def generate_pages(self, articles, row_per_page=15):
        page_group = self._chunk(articles, row_per_page)
        total_page = len(page_group)
        pages = [model.Page(i, total_page, page)
                 for i, page in enumerate(page_group, start=1)]
        if not pages:
            return None
        self.generate_to(
            '../gui/index.html',
            'page.html',
            page=pages[0],
            **self.global_data)
        for i in xrange(1, total_page):
            self.generate_to(
                '../gui/page/{0}.html'.format(i + 1),
                'page.html',
                page=pages[i],
                **self.global_data)

    def _chunk(self, lst, size):
        return [lst[i:i + size] for i in xrange(0, len(lst), size)]


class ArticleGenerate(Generate):

    """docstring for ArticleGenerate"""

    def generate_articles(self, source_path):
        self.source_path = source_path
        self.markdown = MarkdownParser()
        articles = self.get_all_articles()
        parent_path = os.path.abspath(os.path.join(source_path, os.pardir))
        for article in articles:
            self.generate_to(os.path.join(parent_path, 'post', ''.join(
                [article.title, '.html'])), 'article.html',
                article=article, **self.global_data)

    def get_all_articles(self):
        files = [os.path.join(self.source_path, f) for f in os.listdir(
            self.source_path) if f.endswith('.md')]
        # http://stackoverflow.com/questions/237079/how-to-get-file-creation-modification-date-times-in-python
        files.sort(key=lambda filename: os.path.getctime(filename), reverse=True)
        articles = []
        for f in files:
            article = model.Article(*self._get_by_names(f))
            articles.append(article)
        last = len(articles) - 1
        for idx, article in enumerate(articles):
            if idx != 0:
                article.prev = articles[idx - 1]
            if idx != last:
                article.next = articles[idx + 1]
        return articles

    def _get_by_names(self, fullname):
        name = os.path.basename(fullname)
        ts = os.path.getctime(fullname)  # the timestamp
        create_time = datetime.datetime.fromtimestamp(
            ts).strftime('%Y-%m-%d %H:%M')
        with codecs.open(fullname, 'rb', 'utf8') as f:
            raw_data = f.read()
        content = self.markdown.parse(raw_data)
        return (os.path.splitext(name)[0], create_time, content)
