const fs = require('fs')

fs.readFile('./platforms/android/build.gradle', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  data = data.replace(/jcenter\(\)/g, `
    jcenter()
    maven{ url 'https://maven.aliyun.com/repository/public'}
    maven{ url 'https://maven.aliyun.com/repository/google'}`)
  fs.writeFile('./platforms/android/build.gradle', data, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('写入 platforms/android/build.gradle 成功!')
  })
})

// fs.readFile('./platforms/android/app/build.gradle', 'utf8', (err, data) => {
//   if (err) {
//     console.log('未发现platforms/android/app/build.gradle文件')
//     return
//   }
//   data = data.replace(/maven.google.com/g, 'maven.aliyun.com/repository/public')
//   fs.writeFile('./platforms/android/app/build.gradle', data, err => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log('写入 platforms/android/app/build.gradle 成功!')
//   })
// })

// fs.readFile('./platforms/android/CordovaLib/build.gradle', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   data = data.replace(/maven.google.com/g, 'maven.aliyun.com/repository/public')
//   fs.writeFile('./platforms/android/CordovaLib/build.gradle', data, err => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log('写入 platforms/android/CordovaLib/build.gradle 成功!')
//   })
// })

// fs.readFile('./platforms/android/cordova/lib/plugin-build.gradle', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   data = data.replace(/maven.google.com/g, 'maven.aliyun.com/repository/public')
//   fs.writeFile('./platforms/android/cordova/lib/plugin-build.gradle', data, err => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log('写入 platforms/android/cordova/lib/plugin-build.gradle 成功!')
//   })
// })