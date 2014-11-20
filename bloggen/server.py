#!/usr/bin/env python

import BaseHTTPServer


class SimpleServer(object):

    """docstring for SimpleServer"""

    def __init__(self, port=8000):
        self.sever = BaseHTTPServer.HTTPServer
        self.handler = BaseHTTPServer.BaseHTTPRequestHandler
        self.port = port
        self.http = self.sever(('localhost', self.port), self.handler)

    def start(self):
        print 'Server HTTPSever On:', self.http.socket.getsocketname()
        self.http.serve_forever()

    def stop(self):
        self.http.shutdown()
        self.server.socket.close()
        print 'Closed The HTTPServer'

    def restart(self):
        self.stop()
        self.start()
        print 'restart ok'
