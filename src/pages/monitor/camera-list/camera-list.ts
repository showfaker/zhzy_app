import { CameraHlsPage } from './../camera-hls/camera-hls';
import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { VideoService } from '../../../providers/video.service';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Video } from '../../../models/video';

declare var cordova;

@Component({
  selector: 'page-cameraList',
  templateUrl: 'camera-list.html'
})
export class CameraListPage {
  stationId: string;
  videoList: Video[];
  private search: string = '';
  constructor(
    public navCtrl: NavController,
    public videoService: VideoService,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController
  ) {
    this.stationId = this.navParams.get('stationId');
  }

  ionViewDidLoad() {
    this.getVideoList();
  }

  getVideoList() {
    if (this.stationId) {
      this.videoService.getCameras({ stationId: this.stationId }).subscribe((e) => {
        console.log(e);
        if (e && e.length > 0) {
          this.videoList = e;
        }
      });
    }
  }

  play(video: Video) {
    this.navCtrl.push(CameraHlsPage, {
      cameraId: video.cameraId
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
