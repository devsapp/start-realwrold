# realwrold 生产项目最佳实践

- [最佳实践](#最佳实践)
  - [环境划分](#环境划分)
  - [隐私变量](#隐私变量)
  - [fcignore](#fcignore)
- [部署]
  - [版本&灰度](#版本&灰度)
- [Tips]
  - [导出函数配置](#导出函数配置)
- [关于我们](#关于我们)

## 最佳实践
### 环境划分
#### 背景
一般项目开发会有三套环境，测试环境(`test`)，预发环境(`pre`)和线上环境(`prod`)。函数计算FC通过[Service](https://help.aliyun.com/document_detail/73337.html) 进行隔离。同时三套环境有某些配置不太一样，比如测试环境的实例规格小些为`512M`，线上实例规格为`2G`。
> 本质上为了解决配置代码冗余，进行不同环境的划分。
可以通过 Yaml继承[extend](https://www.serverless-devs.com/serverless-devs/extend) 可以实现环境划分效果。

#### 环境划分实践
1. 先创建一个基础的配置模版`s-base.yaml`
```
vars:
  baseService: #  服务名称
    component: fc  # 组件名称
    props: #  组件的属性值
      region: cn-hangzhou
      service:
        name: realworld-app
        description: 欢迎使用ServerlessDevs
      function:
        name: hello-world
        handler: index.handler
        runtime: nodejs12
services:
  frontend: ${vars.baseService}
  backend: ${vars.baseService}
```
这里我们将公共的配置抽离成一个变量`vars`来维护，同时声明两个应用`frontend`(前端服务)以及`backend`(后端服务)来应用它。
> ServerlessDevs内置一些变量，可以很方便的解决一些特殊的问题。详情可以参考[文档](https://www.serverless-devs.com/serverless-devs/yaml#%E5%8F%98%E9%87%8F%E8%B5%8B%E5%80%BC)

2. 配置预发环境`s-pre.yaml`
```
extend: ./s-base.yaml

vars:
  serviceName: realworld-app-pre

services:
  frontend:
    props:
      service:
        name: ${vars.serviceName}
      function:
        name: frontend #  函数名
        codeUri: ./frontend # 具体的代码文件夹
  backend:
    props:
      service:
        name: ${vars.serviceName}
      function:
        name: backend #  函数名
        codeUri: ./backend # 具体的代码文件夹
```
3. 执行部署
线上环境可以命名为`s-prod.yaml`配置和预发环境`s-pre.yaml`类似，不再赘述。
我们通过指定部署文件`s deploy -t s-prod.yaml`部署到预发环境。详情[查看文档](https://www.serverless-devs.com/serverless-devs/yaml#%E6%8F%8F%E8%BF%B0%E6%96%87%E4%BB%B6%E7%AE%80%E4%BB%8B)


### 隐私变量
项目开发中有些隐私信息(数据库连接串，阿里云Ak/SK)，不能上传到Git版本管理中，否则会造成严重中的安全事故。

这时候有几种推荐方式。
#### 方法1(开发测试环境)
1. 在[codeUri](https://www.serverless-devs.com/fc/yaml/function)相对路径下，建立一个`.env`的文件。`.env`格式[参考代码](https://github.com/devsapp/start-realwrold/blob/master/src/.env.example)

2. 同时这个`.env`文件必须放在`.gitignore`文件中，不能提交到代码仓库。

3. 通过[环境变量参数](environmentVariables)传递给函数计算
```
extend: ./s-base.yaml

vars:
  serviceName: realworld-app-pre
services:
  backend:
    props:
      service:
        name: ${vars.serviceName}
      function:
        name: backend #  函数名，会体现
        codeUri: ./backend # 具体的代
        码文件夹
        environmentvariables: # 环境变量
          DB_CONNECTION: ${env(DB_CONNECTION)}
```
参考：
-  environmentvariables ：https://www.serverless-devs.com/fc/yaml/function#environmentvariables

- ${env(环境变量)}： https://www.serverless-devs.com/fc/tips#%E5%85%B3%E4%BA%8Eenv%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95

3. 函数计算代码中获取当前环境变量值
可以通过当前进程获取当前环境变量，比如Nodejs 中这样获取
`process.env.DB_CONNECTION`
#### 方法2(线上环境)
在CICD场景下通过`export DB_CONNECTION=xxx`设置到临时环境变量中生效。
```
jobs:
  serverless-devs-cd:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 12
          registry-url: https://registry.npmjs.org/
      - run: npm install
      - run: npm install -g @serverless-devs/s
      - run: s config add --AccountID ${{secrets.AccountID}} --AccessKeyID ${{secrets.AccessKeyID}} --AccessKeySecret ${{secrets.AccessKeySecret}} -a default
      - run: export DB_CONNECTION=${{secrets.DB_CONNECTION}}
      - run: s deploy
```
加下来的使用方式[方法1](#方法1(开发测试环境))一样，在s.yaml配置`environmentvariables`,然后代码中通过`process.env`获取当前环境变量值。



### fcignore
> 声明：serverless-Devs `ignore` 遵循`.npmignore`规范。基于[minimatch](https://www.npmjs.com/package/minimatch) 库构建。
> 
`.fcignore` 作用于当前`codeUri`目录中，用户在上传代码到函数计算平台时候，可以忽略某些文件。典型场景：比如我的`node_module`依赖上传到[layer](https://help.aliyun.com/document_detail/193057.html)。这时候每次执行`s deploy`时候就需要忽略上传`node_module`。
详细使用说明参考[文档](https://www.serverless-devs.com/fc/tips#%E5%85%B3%E4%BA%8Efcignore%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)。


## 部署

### 版本&灰度
1. 先发布一个版本
`s version publish`
2. 设置两个别名，分别对应预发(pre)环境和线上(prod)环境
```
s alias publish --alias-name pre
s alias publish --alias-name prod
```
3. 添加对应的触发器(trigger)
```
triggers:
  - name: http-trigger
    type: http
    config:
      authType: anonymous
      methods:
        - GET
        - POST
  - name: pre-trigger
    type: http
    qualifier: pre
    config:
      authType: anonymous
      methods:
        - GET
        - POST
  - name: prod-trigger
    type: http
    qualifier: prod
    config:
      authType: anonymous
      methods:
        - GET
        - POST
```

4. 修改域名`qualifier`生效
```
customDomains:
  - domainName: auto
    protocol: HTTP
    routeConfigs:
      - path: /*
        qualifier: pro
```

## Tips

### 导出函数配置
通过`s sync` 命令是将线上的资源(包括配置以及代码)同步到本地。
