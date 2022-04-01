# 插件开发说明

<p align="center"><b> 中文 | <a href="./readme_en.md"> English </a>  </b></p>

> Serverless Devs 应用开发需要严格遵守 [Serverless Package Model](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.2/serverless_package_model/readme.md) 中的 [插件模型规范](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.2/serverless_package_model/3.package_model.md#插件模型规范)。在[插件模型规范](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.2/serverless_package_model/3.package_model.md#插件模型规范)中有关于[插件模型元数据](https://github.com/Serverless-Devs/Serverless-Devs/tree/master/spec/zh/0.0.2/serverless_package_model/3.package_model.md#插件模型元数据)的说明。

Serverless Devs的组件开发案例已经被集成到Serverless Devs命令行工具中，通过对Serverless Devs的命令行工具，可以进行空白应用项目的初始化，开发者只需要执行`s init`即可看到：

```shell script

🚀 Serverless Awesome: https://github.com/Serverless-Devs/package-awesome

? Hello Serverless for Cloud Vendors (Use arrow keys or type to search)
❯ Alibaba Cloud Serverless 
  AWS Cloud Serverless 
  Tencent Cloud Serverless 
  Baidu Cloud Serverless 
  Dev Template for Serverless Devs 
```

此时，选择最后的`Dev Template for Serverless Devs`，并按回车：

```shell script
$ s init

🚀 Serverless Awesome: https://github.com/Serverless-Devs/package-awesome

? Hello Serverless for Cloud Vendors Dev Template for Serverless Devs
? Please select an Serverless-Devs Application (Use arrow keys or type to search)
❯ Application Scaffolding 
  Component Scaffolding 
  Plugin Scaffolding 
```

此时，选择`Plugin Scaffolding`，并按回车，即可完成一个完整的Serverless Devs的Application项目的初始化，可以通过命令查看文件树：

```shell script
$ find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
.
|____LICENSE
|____.signore
|____example
| |____s.yaml
|____readme.md
|____publish.yaml
|____.gitignore
|____package.json
|____src
| |____common
| | |____entity.ts
| | |____logger.ts
| |____index.ts
```

这其中：

| 目录 | 含义 |
| --- | --- | 
| LICENSE | 项目默认的LICENSE，默认的LICENSE是遵循MIT开源协议的（推荐） | 
| .signore | 项目发布时，可以选择的忽略文件，类似于npm发布是的`.npmignore`文件 | 
| example | 该组件对应的测试案例 | 
| publish.yaml | 项目所必须的文件，Serverless Devs Package的开发识别文档 |
| .gitignore| 推送到Github的忽略文件 | 
| package.json| Node.js的package.json，需要描述清楚插件的入口文件位置 |
| src| 用户的代码目录 |
| readme.md| 版本的描述，例如当前版本的更新内容等 |

此时，开发者可以在src下完成业务代码的开发，由于默认的初始化项目是Typescript，所以开发完成业务代码还需要编译成Javascript（可以通过`npm run build`进行编译），在完成项目编译之后，还需要对项目进行`publish.yaml`文件的编写。完成之后，即可将项目发不到不同的源，以Github Registry为例，可以在Github创建一个`Public`的仓库，并将编译后的代码放到仓库，并发布一个版本。此时，就可以通过客户端获取到该应用。
