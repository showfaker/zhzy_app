import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from '../auth-http.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';

/*
  Generated class for the CommentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommentProvider {
    addCommentUrl: string;
    deleteCommentUrl: string;

    constructor(public http: AuthHttpService, @Inject(APP_CONFIG) public appConfig: AppConfig) {
        console.log('Hello CommentProvider Provider');
        this.addCommentUrl = this.appConfig.apiEndpoint + '/api/workOrders/comment';
        this.deleteCommentUrl = this.appConfig.apiEndpoint + '/api/comments';
    }

    addComment(parmas) {
        return this.http.put(
            this.addCommentUrl + '?orderId=' + parmas.orderId + '&comment=' + parmas.comment,
            parmas
        );
    }

    deleteComment(commentId) {
        return this.http.delete(this.deleteCommentUrl + '?commentId=' + commentId);
    }
}
