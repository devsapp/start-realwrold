async function preInit(inputObj) {
    console.log(`\n                 _                    _     _ 
  _ __ ___  __ _| |_      ___ __ ___ | | __| |
 | '__/ _ \\/ _\` | \\ \\ /\\ / / '__/ _ \\| |/ _\` |
 | | |  __/ (_| | |\\ V  V /| | | (_) | | (_| |
 |_|  \\___|\\__,_|_| \\_/\\_/ |_|  \\___/|_|\\__,_|
     
                                      `)
}

async function postInit(inputObj) {

    console.log(`\n    Welcome to the real world application
     This application requires to open these services: 
         FC : https://fcnext.console.aliyun.com/

     * 如果遇到npm命令找不到等问题，可以适当进行手动项目构建，并根据需要取消actions内容 
     * 项目初始化完成，您可以直接进入项目目录下，并使用 s deploy 进行项目部署\n`)
}

module.exports = {
    postInit,
    preInit
}
