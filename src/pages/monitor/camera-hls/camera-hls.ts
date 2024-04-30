import { VideoService } from './../../../providers/video.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VgHLS } from 'videogular2/src/streaming/vg-hls/vg-hls';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StatusBar } from '@ionic-native/status-bar';
import Hls from 'hls.js';

/**
 * Generated class for the CameraHlsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-camera-hls',
  templateUrl: 'camera-hls.html'
})
export class CameraHlsPage {
  @ViewChild(VgHLS) vgHls: VgHLS;


  currentStream = null;
  playr: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private videoservice: VideoService,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar
  ) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    // this.videoservice.getHikHls(cameraId).subscribe((res) => {
    //     this.currentStream = res;
    //     this.api.play();
    // });
  }

  onPlayerReady(api) {

  }

  ionViewDidLoad() {
    const cameraId = this.navParams.get('cameraId');
    const params = {
      cameraIds: cameraId,
      protocol: 2,
      quality: 1
    }

    const videoContentEle = (document.getElementById('video-content') as any);

    this.videoservice.getCamerasLiveAddress(params).subscribe(object => {
      let video = (document.getElementById('video-container-main') as any);
      let hls = null;
      video.width = videoContentEle.offsetWidth;
      video.height = videoContentEle.offsetHeight;
      // video.height = videoContentEle.offsetHeight;
      let videoSrc = object[cameraId].url;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function () {
          video.play();
        });
      }

      this.playr = {
        video,
        hls,
      }

    })
  }


  back() {
    this.navCtrl.pop();
  }

  ionViewWillLeave() {

    if (this.playr && this.playr.hls) {
      this.playr.hls.destroy();
      this.playr.hls = null;
    }

    if (this.playr && this.playr.video) {
      this.playr.video.pause();
    }
    this.playr = {}

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
}
