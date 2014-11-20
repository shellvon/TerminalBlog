#!/usr/bin/env python


class Page(object):

    """docstring for Page"""

    def __init__(self, page_number, total_page, articles):
        self.page_number = page_number
        self.posts = articles
        self.total_page = total_page


class Article(object):

    """docstring for Post"""

    def __init__(self, title, time, content, _next=None, _prev=None):
        self.title = title
        self.content = content
        self.time = time
        self.next = _next
        self.prev = _prev
        self.url = "post/{0}.html".format(title)


class Author(object):

    """docstring for Author"""

    def __init__(self, name, description):
        self.name = name
        self.description = description


class Blog(object):

    """docstring for Blog"""

    def __init__(self, name, description):
        self.name = name
        self.description = description
