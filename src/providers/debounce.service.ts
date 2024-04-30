import { Injectable, Inject } from "@angular/core";



@Injectable()
export class DebounceService {
    private temp: string = "test";
    constructor() {

    }

    /**
     * 延迟节流（首次及后续都需要间隔一段时间触发才生效）
     * @param fn 节流事件函数
     * @param delay 节流的毫秒数
     * @returns 
     */
    throttleDelayExecution(fn, delay, model) {
        let last = Date.now();  // 使用时间戳实现
        return function () {
            let now = Date.now();
            if (now - last >= delay) {
                fn.apply(model, arguments);
                last = now;
            }
        }
    }

    /**
     * 一般节流函数（前缘节流，首次触发立即生效，后续需要间隔一段时间触发才生效）
     * @param fn 节流事件函数
     * @param delay 节流的毫秒数
     * @returns
     */
    throttleImmediateExecution(fn, delay, model) {
        let timer: any | null = null;   // 使用定时器实现
        return function () {
            if (!timer) {
                fn.apply(model, arguments);
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            }
        }
    }

    /**
     * 节流优化完整版
     * @param delay 节流的毫秒数
     * @param fn 节流事件函数
     * @param isImmediate 是否立即执行
     * @returns 
     */
    throttle(fn, delay, isImmediate:boolean = true) {
        let last = Date.now();
        return function () {
            let now = Date.now();
            if (isImmediate) {
                fn.apply(this, arguments);
                isImmediate = false;
                last = now;
            }
            if (now - last >= delay) {
                fn.apply(this, arguments);
                last = now;
            }
        }
    }

    /**
     * 滚动节流函数
     * @param infiniteScroll 滚动节流事件
     * @param delay 节流的毫秒数
     * @param fn 节流事件函数
     */
    infiniteDebounce(delay, fn, infiniteScroll:{ complete:() => void }) {
        let timer: any | null = null;
        return function () {
            if (timer) {
                return false;
            }
            timer = setTimeout(function() {
                timer = null;
                fn.apply(infiniteScroll);
            }, delay);   
        }
    }
}