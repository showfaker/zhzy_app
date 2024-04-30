import { NgModule } from '@angular/core';
import { Homepage2ModulesComponent } from './homepage2-modules/homepage2-modules';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { UploadFilesComponent } from './upload-files/upload-files';
import { UploadPicsComponent } from './upload-pics/upload-pics';
import { CcComponent } from './cc/cc';
import { CommentComponent } from './comment/comment';
@NgModule({
    declarations: [
        Homepage2ModulesComponent,
        UploadFilesComponent,
        UploadPicsComponent,
        CcComponent,
        CommentComponent,
    ],
    imports: [CommonModule, IonicModule, NgxEchartsModule],
    exports: [
        Homepage2ModulesComponent,
        UploadFilesComponent,
        UploadPicsComponent,
        CcComponent,
        CommentComponent,
    ],
})
export class ComponentsModule {}
