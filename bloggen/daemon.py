#!/usr/bin/env python

import os
import sys
import logging
from datetime import datetime

import pyinotify

import shell

logging.basicConfig(
    level=logging.INFO, filename='/var/log/FileChangeEventHandler.log')


class FileChangeEventHandler(pyinotify.ProcessEvent):

    def process_IN_CREATE(self, event):
        self._handler(event)

    def process_IN_DELETE(self, event):
        self._handler(event)

    def process_IN_MODIFY(self, event):
        self._handler(event)

    def _handler(self, event):
        pathname = event.pathname
        isdir = os.path.isdir(pathname)
        if event.dir:
            logging.info(
                '{0} dir:{1} at:{2}'.format(
                    event.maskname,
                    pathname,
                    datetime.now()))
        else:
            logging.info('{0} file:{1} at:{2}'.format(
                event.maskname, pathname, datetime.now()))
            # shell.main() if filechanges.rebuild it.


def notify(path_to_watch, rec=False):
    wm = pyinotify.WatchManager()
    wm.add_watch(path_to_watch, pyinotify.ALL_EVENTS, rec=rec)
    eh = FileChangeEventHandler()
    notifier = pyinotify.Notifier(wm, eh)
    try:
        notifier.loop(daemonize=True, pid_file='/tmp/filechangenotify.pid')
    except pyinotify.NotifierError, err:
        print >>sys.stderr, err
