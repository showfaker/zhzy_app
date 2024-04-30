import {AlertOptions} from "ionic-angular";
import {AlertInputOptions} from "ionic-angular/components/alert/alert-options";

export class PromptOptions implements AlertOptions {
    title?: string;
    subTitle?: string;
    message?: string;
    cssClass?: string;
    mode?: string;
    inputs?: AlertInputOptions[];
    enableBackdropDismiss?: boolean;
    confirmTrigger?: (data: string | number) => boolean;
    inputType? = 'text';
    defaultValue?: string;
}
