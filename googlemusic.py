#!/usr/bin/python

from gmusicapi import Mobileclient
import os
import commands
import threading
import daemon
import zerorpc
import account

class playMusicThread(threading.Thread):
    def __init__(self, api, trackId, controller):
        super(playMusicThread, self).__init__()
        self.api = api
        self.trackId = trackId
        self.controller = controller
        self.playNext = True

    def run(self):
        print " === start sub thread (sub class) === "
        ANDROID_ID = self.controller.getAndroidId()
        url = self.api.get_stream_url(self.trackId, ANDROID_ID)
        ret = commands.getoutput('cvlc "' + url + '" vlc://quit')
        if self.playNext:
            self.controller.playNext()

    def stop(self):
        self.playNext = False
        commands.getoutput('pkill vlc')

class musicController():
    def __init__(self):
        self.ANDROID_ID = '1234567890abcdef'
        self.email = account.user()
        self.password = account.password()
        self.api = Mobileclient()
        self.login()
        self.index = 0
        self.playQueue = []

    def getAndroidId(self):
        return self.ANDROID_ID

    def login(self):
        logged_in = self.api.login(self.email, self.password, self.ANDROID_ID)
        if logged_in:
            print "Login success"


    def getPlaylists(self):
        return self.api.get_all_user_playlist_contents()

    def clearMusicList(self):
        self.playQueue = []

    def addMusicList(self, musicList):
        self.playQueue.extend(musicList)

    def setMusicList(self, musicList):
        self.clearMusicList()
        self.addMusicList(musicList)

    def getMusicList(self):
        return self.playQueue

    def playMusic(self):
        if(self.index >= len(self.playQueue)):
            return False
        if(self.index < 0):
            self.index = 0
        self.stopMusic()
        trackId = self.playQueue[self.index]['trackId']
        self.mThread = playMusicThread(self.api, trackId, self)
        self.mThread.start()

    def playNext(self):
        self.stopMusic()
        self.index += 1;
        self.playMusic()

    def playPrev(self):
        self.stopMusic()
        self.index -= 1;
        self.playMusic()


    def stopMusic(self):
        try:
            print "stop music"
            self.mThread.stop()
        except:
            pass


if __name__ == '__main__':
    s = zerorpc.Server(musicController())
    s.bind("tcp://0.0.0.0:4242")
    s.run()
    # mc = musicController()
    # lists = mc.getPlaylists()
    # print(lists)
    # playlist = 5
    # mc.addMusicList(lists[playlist]['tracks'])
    # mc.playMusic()
