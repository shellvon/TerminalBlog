#!/usr/bin/env python

import shelve

DATA_FILE = "blogen.dat"


def persistence(maps, flag=True):
    """
    if flag is true,only persistence without update
    if flag is false.update if already has the key.
    """
    db = shelve.open(DATA_FILE, 'c')
    if flag:
        for k in maps:
            if k not in maps:
                db[k] = maps[k]
    else:
        for k in maps:
            db[k] = maps[k]
    db.close()


def get(k, default=None):
    db = shelve.open(DATA_FILE, 'c')
    v = db.get(k, default)
    db.close()
    return v


def set(k, v):
    db = shelve.open(DATA_FILE, 'c')
    db[k] = v
    db.close()
