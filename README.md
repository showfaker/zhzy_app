node 版本 8
#  APP 

交互设计：
https://pro.modao.cc/app/AiFq441xARhzWkDr7bsQA1vPutA3kLm?#screen=sF0E17C8E5C1526367561919

ionic cordova plugin add cordova-plugin-nemsvideo

ionic cordova build ios

cordova prepare

```javascript
// node_modules/@ionic/app-scripts/bin/ionic-app-scripts.js
// 原
#!/usr/bin/env node
// 修改为
#!/usr/bin/env node --max_old_space_size=8192
```

```javascript
// node_modules/ionic-angular/components/datetime/datetime.js
// 原
var nowString = new Date().toISOString();
// 修改为
var nowString = new Date(+new Date() + 8 * 3600 * 1000).toISOString();
```

# ios 扫码 添加 一维码

```swift
// 原
metaOutput!.metadataObjectTypes = [AVMetadataObject.ObjectType.qr]
// 修改为
metaOutput!.metadataObjectTypes = [
  AVMetadataObject.ObjectType.qr,
  AVMetadataObject.ObjectType.ean13,
  AVMetadataObject.ObjectType.ean8,
  AVMetadataObject.ObjectType.code128,
  AVMetadataObject.ObjectType.code39,
  AVMetadataObject.ObjectType.code39Mod43,
  AVMetadataObject.ObjectType.interleaved2of5
]

// 原
if found.type == AVMetadataObject.ObjectType.qr && found.stringValue != nil {
    scanning = false
    let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: found.stringValue)
    commandDelegate!.send(pluginResult, callbackId: nextScanningCommand?.callbackId!)
    nextScanningCommand = nil
}

//修改为
if [AVMetadataObject.ObjectType.qr,
    AVMetadataObject.ObjectType.ean13,
    AVMetadataObject.ObjectType.ean8,
    AVMetadataObject.ObjectType.code128,
    AVMetadataObject.ObjectType.code39,
    AVMetadataObject.ObjectType.code39Mod43,
    AVMetadataObject.ObjectType.interleaved2of5
].contains(found.type) && found.stringValue != nil {
    scanning = false
    let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: found.stringValue)
    commandDelegate!.send(pluginResult, callbackId: nextScanningCommand?.callbackId!)
    nextScanningCommand = nil
}

```

# Android 扫码 添加 一维码

```java
// 原
formatList.add(BarcodeFormat.QR_CODE);
//添加的 statr
formatList.add(BarcodeFormat.UPC_A);   // UPC标准码(通用商品)
formatList.add(BarcodeFormat.UPC_E);   // UPC缩短码(商品短码)
formatList.add(BarcodeFormat.EAN_13);
formatList.add(BarcodeFormat.EAN_8);
formatList.add(BarcodeFormat.CODE_39);
formatList.add(BarcodeFormat.CODE_93);
formatList.add(BarcodeFormat.CODE_128);
formatList.add(BarcodeFormat.ITF);
formatList.add(BarcodeFormat.DATA_MATRIX);
//添加的 end
```



应用签名(安卓)
cd platforms/android
生成签名工具keystore: keytool -genkey -v -keystore your-full-keystore-name.keystore -alias your-lias-name -keyalg RSA -keysize 2048 -validity 360000
备注： 在项目根目录执行这句话，其中 your-full-keystore-name.keystore 是你自己设置的keystore全称，your-lias-name 是你keystore的别名，两个都自己按照自己的项目来自定义命名。

生成未签名的apk文件: cordova build --release android (备注 : 所有的红色Android是小写)
备注： 生成apk之后，将apk移动到项目根目录，同keystore同级，为了之后进行签名工作方便

签名apk: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore your-full-keystore-name.keystore android-release-unsigned.apk your-lias-name

 ionic cordova plugin add com-sarriaroman-photoviewer@1.2.4 cordova-plugin-compat@1.2.0 com.kit.cordova.amaplocation@2.0.0 cordova-plugin-add-swift-support@2.0.2 cordova-plugin-android-permissions@1.0.2 cordova-plugin-appversion@1.0.0 cordova-plugin-app-update@2.0.2 cordova-plugin-app-version@0.1.9 cordova-plugin-camera@4.1.0 cordova-plugin-file@6.0.2 cordova-plugin-file-opener2@2.2.1 cordova-plugin-file-transfer@1.7.1 cordova-plugin-filechooser@1.2.0 cordova-plugin-filepath@1.5.8 cordova-plugin-filepicker@1.1.6 cordova-plugin-geolocation@4.0.2 cordova-plugin-ionic-keyboard@2.2.0 cordova-plugin-ionic-webview@1.2.1 cordova-plugin-qrscanner@3.0.1 cordova-plugin-screen-orientation@3.0.2 cordova-plugin-splashscreen@5.0.3 cordova-plugin-statusbar@2.4.3 cordova-plugin-telerik-imagepicker@2.3.3 cordova-plugin-whitelist@1.3.4 cordova-plugin-device@2.0.3


 ionic cordova plugin add com-sarriaroman-photoviewer@1.2.4 cordova-plugin-compat@1.2.0 com.kit.cordova.amaplocation@2.0.0 cordova-plugin-android-permissions@1.0.2 cordova-plugin-appversion@1.0.0 cordova-plugin-app-update@2.0.2 cordova-plugin-app-version@0.1.9 cordova-plugin-camera@4.1.0 cordova-plugin-file@6.0.2 cordova-plugin-file-opener2@2.2.1 cordova-plugin-file-transfer@1.7.1 cordova-plugin-filechooser@1.2.0 cordova-plugin-filepath@1.5.8 cordova-plugin-filepicker@1.1.6 cordova-plugin-geolocation@4.0.2 cordova-plugin-ionic-keyboard@2.2.0 cordova-plugin-ionic-webview@1.2.1 cordova-plugin-qrscanner@3.0.1 cordova-plugin-screen-orientation@3.0.2 cordova-plugin-splashscreen@5.0.3 cordova-plugin-statusbar@2.4.3 cordova-plugin-telerik-imagepicker@2.3.3 cordova-plugin-whitelist@1.3.4 cordova-plugin-device@2.0.3
