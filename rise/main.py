#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" main.py


"""

import datetime
import json
import operator
import os
import sys
import time

try:
    from urllib.parse import urlparse, quote, unquote
except:
    from urlparse import urlparse, quote, unquote

root_dir = os.path.abspath(os.path.dirname(__file__)) + "/"
config = None
filelist = None
fileindex = None
last_mtime = None

import flask
app = flask.Flask(__name__)

@app.route("/")
def handle_index():
    global filelist

    reload_if_updated()
        
    return flask.render_template(
        'index.html',
        filelist=filelist,
        netloc=get_netloc(flask.request.url)
    )

@app.route("/view/<path:basename>")
def handle_view(basename):
    global filelist
    global fileindex

    b = utf8_to_unicode(unquote(basename))
    if b not in fileindex:    
        return "404"

    i = fileindex[b]
    return flask.render_template(
        'view.html',
        file=filelist[i],
        netloc=get_netloc(flask.request.url)
    )

def load_config():
    global root_dir
    global config

    fp = open(root_dir + "/config.json")
    config = json.load(fp)
    fp.close()

def get_config(var):
    global config
    return config[var]
    
def load_filelist():
    global filelist
    global fileindex

    fp = None
    for i in range(5):
        try:
            fp = open(get_config("list"), encoding='utf-8')
            filelist = json.loads(fp.read(), 'utf-8')
        except IOError:
            time.sleep(2 ** i)
    if fp is None:
        return
            
    fp.close()
    
    filelist = sorted(filelist, key=operator.itemgetter('start','encoded'), reverse=True)
    fileindex = {}
    
    for i in range(len(filelist)):
        sdt = datetime.datetime.fromtimestamp(filelist[i]['start'] / 1000)
        filelist[i]["startDateTime"] = sdt
        base = os.path.basename(filelist[i]["encoded"])
        filelist[i]["basename"] = base
        enc = quote(unicode_to_utf8(base))
        filelist[i]["viewPageURL"] = "/view/%s" % enc
        filelist[i]["mediaURL"] = config["mediaPathBase"] + enc 
        
        fileindex[base] = i

def get_netloc(url):
    return urlparse(url).netloc

def reload_if_updated():
    global last_mtime
    mtime = os.path.getmtime(get_config("list"))
    
    if last_mtime != mtime:
        last_mtime = mtime
        load()

def load():
    load_config()
    load_filelist()

try:
    unicode('')
    # python2
    def unicode_to_utf8(u):
        return u.encode('utf-8')
    def utf8_to_unicode(s):
        return s.decode('utf-8')
except:
    # python3
    def unicode_to_utf8(u):
        return u.encode('utf-8')
    def utf8_to_unicode(s):
        return bytes(s, 'utf-8').decode('utf-8')
    
    
if __name__ == "__main__":
    load()
    app.run(host="0.0.0.0", port=50080, debug=True)
    
