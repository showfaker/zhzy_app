import {Injectable, NgModule} from "@angular/core";
import {
    ActionSheetController, ActionSheetOptions, AlertController, AlertOptions, Loading, LoadingController,
    ToastController, ToastOptions, Alert
} from "ionic-angular";
import {AlertButton} from "ionic-angular/components/alert/alert-options";
import {ActionSheetButton} from "ionic-angular/components/action-sheet/action-sheet-options";
import { PromptOptions } from "./prompt-options";

@NgModule({
    providers: [
        AlertController,
        ToastController,
        LoadingController
    ]
})

@Injectable()
// 控件工具类
export class ComponentsUtil {
    private spinner: Loading;
    private alert: Alert;
    constructor(private alertCtrl: AlertController
        , private actionSheetCtrl: ActionSheetController
        , private toastCtrl: ToastController
        , private loadingCtrl: LoadingController) {
    }

    /**
     * 显示确认提示框
     * @param {string} message 需要显示的消息
     */
    showAlert(message: string,cssClass?: string) {
        if(this.alert){
            this.alert.dismiss().catch(() => {});
            this.alert = null;
        }
        this.alert = this.alertCtrl.create({
            title: '提示',
            subTitle: message,
            buttons: ['确认'],
            cssClass: cssClass || undefined
        });
        this.alert.present();
    }

    /**
     * 显示 loading
     * @param content 要显示的文字，默认加载中
     * @param {number} duration 时长，持续显示则为0
     * @param spinner 图标类型
     * @param cssClass 样式
     */
    showLoading(content?: string, duration?: number, spinner?: string, cssClass?: string): void {
        if (this.spinner) {
            return;
        }
        this.spinner = this.loadingCtrl.create({
            spinner: spinner || '',
            duration: duration,
            content: content || '加载中...',
            cssClass: cssClass || undefined
        });
        this.spinner.present();
    }

    /**
     * 隐藏 loading
     */
    hideLoading(): void {
        if (this.spinner) {
            this.spinner.dismiss().catch(() => {
            });
            this.spinner = null;
        }
    }

    /**
     * 显示输入提示框
     * @param {PromptOptions} options 提示框的参数
     * @returns {Promise<string>}
     */
    showPrompt(options: PromptOptions): Promise<string> {
        return new Promise(resolve => {
            let alertOptions: AlertOptions = options;

            let cancelBtn: AlertButton = {
                text: '取消'
            };

            let confirmBtn: AlertButton = {
                text: '确认',
                handler: data => {
                    if (!data || !data[0]
                        || (options.confirmTrigger && !options.confirmTrigger(data[0]))) {
                        return false;
                    }
                    resolve(data[0]);
                }
            };

            alertOptions.title = options.title || '提示';
            alertOptions.buttons = [cancelBtn, confirmBtn];
            alertOptions.inputs = options.inputs
                || [{type: options.inputType, value: options.defaultValue}];

            let prompt = this.alertCtrl.create(alertOptions);
            prompt.present();
        });
    }

    /**
     * 弹出确认提示框
     * @param {AlertOptions} options
     * @returns {Promise<void>}
     */
    showConfirm(options: AlertOptions) {
        const alert = this.alertCtrl.create({
            title: options.title || '请确认',
            message: options.message || '提示内容',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: function () {
                        console.log('选择取消按钮');
                    }
                }, {
                    text: (options.buttons[0] as AlertButton).text || '确认',
                    handler: (options.buttons[0] as AlertButton).handler || function () {
                        console.log('选择确认按钮');
                    }
                }
            ]
        });

        if (options.buttons.length > 1) {
            Array.prototype.push.apply(options.buttons.slice(1));
        }

        alert.present();
    }

    /**
     * 显示选择列表
     * @param {ActionSheetOptions} options 选择列表参数
     */
    showPopupList(options: ActionSheetOptions): void {
        let cancelBtn: ActionSheetButton = {
            text: '取消',
            role: 'cancel'
        };

        options.buttons = options.buttons || [];
        options.buttons.push(cancelBtn);

        let popupList = this.actionSheetCtrl.create(options);
        popupList.present();
    }

    /**
     * 显示 toast
     * @param {ToastOptions} options toast 参数
     */
    showToast(options: ToastOptions): void {
        options.duration = options.duration || 1000;

        let toast = this.toastCtrl.create(options);
        toast.present();
    }

}
