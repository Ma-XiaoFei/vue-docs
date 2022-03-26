## 认识Vue
::: tip Vue是什么呢
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。
:::
## 框架与库的区别
如Vue官网介绍的一样，vue是一个框架，那么前端框架和我们以前了解的jquery库之间有什么区别么？

> 框架大多采用声明式编程，而库大多是命令式。
框架用数据驱动来渲染视图

## 声明式 和 命令式
> 上面提到了Vue是声明式编程的框架，那么什么是声明式编程，命令式编程又是什么呢？

- 命令式编程：“怎么做” => 写给计算机的语言， 指定了每一个步骤
```javascript
//  命令式 改变div中的文案
$('div').html('xxx') 
```

```javascript
// for 循环
for(let item of [1,2,3]){
    console.log(item)
}
```
```javascript
// if 语句
if (window){
    alert('window')
} else {
    console.log('window不存在')
}
```

- 声明式编程：“做什么” => 写给人看的语言
    - 函数式编程  
    - 调用api，只在使用层面
```javascript
console.log([1,2,3].filter(t => t > 1));
```
```html
<!-- vue声明式渲染 -->
<div v-if="true">
    渲染dom
</div>
<ul>
    <li v-for="item in arrays">
        {{item}}
    </li>
</ul>
```

::: tip Vue声明式渲染
用户只负责声明式语法来编程，无需直接操作Dom，提高开发效率，vue内部处理了大量的工作来进行渲染
:::

## vue框架的特点
- MVVM 数据影响视图，视图影响数据
- 简单易学，轻量快速
- 渐进式框架

::: tip 什么是渐进式
其实就是递增的一个过程, 一开始不需要全部掌握Vue整个特性和功能，后续可以再一点点增加。
如： 简单应用（只需一个轻量的核心库），和复杂应用（可以引入各式各样的Vue插件）
:::



## Vue核心内容
- 模板语法
- 模板指令 (v-if、v-for、v-html ......)
- 响应式数据
- 组件化 (components) (组件数据传递)
- 绑定事件与操作
- 生命周期
- 插槽

> 后续的组合式Api

::: tip Vue其他相关
路由渲染、状态管理、ssr等
:::



> 上面这些关于Vue的核心知识，这些你要是都掌握了，这玩意就代表你已经学会并能使用了。 