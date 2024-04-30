import { MutilService } from './../../providers/util/Mutil.service';
import { CommentProvider } from './../../providers/comment/comment';
import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';

/**
 * Generated class for the CommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'comment',
    templateUrl: 'comment.html'
})
export class CommentComponent implements OnChanges {
    @Input() commentsList = [];
    @Input() orderId = null;

    text: string;
    commentContent: any;

    constructor(private commentprovider: CommentProvider, private mutilservice: MutilService) {
        console.log('Hello CommentComponent Component');
    }

    ngOnChanges(changes) {
        if (changes.commentsList && changes.commentsList.currentValue) {
            this.commentsList = changes.commentsList.currentValue;
        }
    }

    addComment() {
        if (!this.commentContent) {
            return this.mutilservice.popToastView('评论内容不能为空！');
        }
        this.commentprovider
            .addComment({
                orderId: this.orderId,
                comment: this.commentContent
            })
            .subscribe((res) => {
                this.commentsList.unshift(res);
                this.commentContent = '';
                this.mutilservice.popToastView('评论成功');
            });
    }

    deleteComment(commentId) {
        this.commentprovider.deleteComment(commentId).subscribe((res) => {
            _.remove(this.commentsList, (o) => {
                return o.commentId == commentId;
            });
            this.mutilservice.popToastView('删除成功');
        });
    }
}
