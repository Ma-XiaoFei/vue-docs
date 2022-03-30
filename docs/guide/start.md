# Vue项目搭建

::: tip 提示   
在这里我们使用vite来进行项目的启动与部署

vite 是新一代前端构建工具

开发环境无需打包操作，可快速冷启动、
轻量快速的热加载 （HMR）、
按需编译，不再等待整个应用编译完成
:::

## 安装Vite

```
pnpm i vite -D
or
npm i vite -D
```

## 启动Vite

> Vite使用[esbuild](https://esbuild.github.io/)预构建依赖，Esbuild使用Go编写的，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍

## package.json
```json
{
 "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```
##  vite.config.ts
```ts
import { defineConfig } from "vite";

export default defineConfig({
    
})
```
## index.html
vite 需要要根html文件来渲染页面
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```
## src/main.ts 作为入口文件
- 创建main.ts 入口文件
::: tip 提示
vite 是天生支持ts的，所以可以直接用ts语法
Vite 仅执行 .ts 文件的转译工作，并不执行任何类型检查

可以在构建脚本中运行 tsc --noEmit 或者安装 vue-tsc 然后运行 vue-tsc --noEmit 来对你的 *.vue 文件做类型检查）
:::

## tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "Node",
        "lib": ["DOM", "ESNext", "DOM.Iterable"],
        "strict": true,
        "allowJs": true,
        "sourceMap": true,
    },
    "include": ["src/", "*.d.ts"],
    "exclude": ["node_modules"]
}
```

## git管理项目
```
git初始化
git init
echo "node_modules" >> .gitignore
```

## 安装Vue
- pnpm i vue
- pnpm i @vitejs/plugin-vue -D

## 使用@vitejs/plugin-vue插件
```ts
// vite.config.ts
import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
    plugins:[vuePlugin()]
})
```

## 引入Vue
``` js
// main.ts
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')
```
::: warning 会出现没有.vue模块的ts提示
```js
// 创建 *.d.ts声明文件，声明一个vue模块
/// <reference types="vite/client" />

declare module "*.vue" {
    import type {DefineComponent} from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component

}
```
:::

## typescript支持

- 在vite里使用， vite不会去检测ts语法错误，只管编译，不管校验

- 需要安装 typescript vue-tsc

## Eslint
> eslint 是一个插件化并且可配置的JavaScript语法规则和代码风格的检查工具
### 安装
```
pnpm i eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin @vue/eslint-config-typescript -D
```

| 名称 | 说明 |
| :--:| :--: |
| eslint | 是一个用于识别js代码中发现的错误工具|
|eslint-plugin-vue | Vue官方eslint插件 |
| @typescript-eslint/parser | 一个eslint 解析器，利用typescript-EsTree检查ts源代码 |
| @typescript-eslint/eslint-plugin | 为typescript代码库 提供 lint规则 |
| @vue/eslint-config-typescript | vue eslint-config-typescript

- 创建一个eslint配置 eslintrc.json文件
```json
{
    "root": true,
    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "@vue/typescript/recommended"
    ],
    "plugins": [
        "@typescript-eslint"
    ],
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": 2021
    },
    "rules": {
       "no-unused-vars":"error",
       "semi": "error"
    }
 }
```
- 配置eslint忽略文件 .eslintignore
```
node_modules
dist
build
*.d.ts
```
- 添加脚本
```json
{
   "lint": "eslint --ext .ts,.vue src/",
   "lint:fix": "eslint --ext .ts,.vue src/ --fix"
}
```

## Prettier
> eslint主要解决的是代码质量问题，prettier解决的是代码风格问题
### 安装
```
pnpm i prettier eslint-plugin-prettier @vue/eslint-config-prettier -D
```
| name| desc|
| -- | -- |
| prettier | 代码格式化|
| eslint-plugin-prettier | 作为eslint规则运行prettier |
|  @vue/eslint-config-prettier | Vue 的eslint-config-prettier|


- 创建prettier配置文件
```
echo {}> .prettierrc.js
```
```js
module.exports = {
    printWidth: 70, // 代码宽度建议不超过100字符
    tabWidth: 4, // tab缩进2个空格
    semi: true, // 末尾分号
    singleQuote: true, // 单引号
    jsxSingleQuote: true, // jsx中使用单引号
    trailingComma: 'es5', // 尾随逗号
    arrowParens: 'avoid', // 箭头函数仅在必要时使用()
    htmlWhitespaceSensitivity: 'css', // html空格敏感度
};

``` 
- vscode 安装prettier 插件

## Git hooks
- 可以配置commit前校验代码规范，代码风格
- 可以配置push前执行单元测试等

### husky
- 可以在项目中方便添加git hooks
- 会在.git目录中添加对应钩子，比如pre-commit就会在执行git commit命令时候触发。

### lint-staged
- 用于提交前只检查暂存区的文件， 只校验本次修改的内容。

::: tip 提示
为了方便安装 可以使用mrm来安装以上内容
pnpx mrm lint-staged
:::

### 使用mrm安装 lint-staged
- mrm 会查看package.json用到的依赖项进行安装和配置，无需手动操作
- 它安装过后，会出现.husky目录， 和package.json里的 lint-staged 配置
- 对实际情况进行适当修改


### commitlint
> commitlint 推荐我们使用 config-conventional 配置去写 commit

```
pnpm i @commitlint/cli @commitlint/config-conventional -D
```
- 配置文件 
```
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > .commitlintrc.js.js
```
- 提交格式 `git commit -m <type>[optional scope]: <description>`
- type格式 (默认的) 可以在配置文件里配置其他
```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
merge：合并分支
perf：优化相关，比如提升性能、体验
revert：回滚到上一个版本
build：构建
```
- 配置钩子
```
pnpx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

## 配置别名

```js
// vite.config.ts
import {resolve} from 'path';

 {
    resolve:{
        alias: {
            "@": resolve('src')
        }
    }
}
```
::: warning 注意
当然在vite里配置别名后，ts是不会认的
:::

- tsconfig.json也需要配置
```json
{
    "paths": {
        "@/*": ["src/*"]
    }
}
```