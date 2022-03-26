### vue3

::: tip v3 版本的改变
Vue3提升了性能，用Proxy来代替Object.defineProperty, 优化了diff算法，更好的tree-shaking，更好的支持Ts
:::
- v-ref变化  在v-for上 之前会生成数组返回， 现在需要自定义函数来保存每个项

- 新增异步组件 defineAsyncComponent 定义，  与 react loadable相似。
component 选项重命名为 loader。


- $attrs 变化 之前 class style 不会在数组里  3版本后会在


- $children 实例属性 删除不再支持 ， 需要用ref。


- 自定义指令改变，不兼容 ，声明周期名称和 组件生命周期保持一致。


- data选项 改为必须为返回值为 object 的 function ，另外 Mixin 合并行为变更，当来自组件的 data() 及其 mixin 或 extends 基类被合并时，现在将浅层次执行合并:
 ```js
 const Mixin = {
  data() {
    return {
      user: {
        name: 'Jack',
        id: 1
      }
    }
  }
}
const CompA = {
  mixins: [Mixin],
  data() {
    return {
      user: {
        id: 2
      }
    }
  }
}
```
```js
<!--v2:-->

{
  user: {
    id: 2,
    name: 'Jack'
  }
}
```
```js
<!--v3-->
{
  user: {
    id: 2
  }
}
```

- 新增 emits 与之前的props相似， 如果不写emits属性 会把$emit添加到 $attrs里， attrs会添加到组件的根属性上。
所以尽量写上， native修饰符已经取消的原因， 会容易造成绑定两次事件

- 事件API 删除 $on $off $once , 所以之前的事件车 even bus 不能用 了， $emit 不取消， 因为用于触发由父组件声明式添加的事件处理函数。


- 过滤器 删除 之前的管道符 | ， 之后用computed 计算出。 也可以用全局过滤器： 
```js
app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}

<template>
  <h1>Bank Account Balance</h1>
  <p>{{ $filters.currencyUSD(accountBalance) }}</p>
</template>
```


- 片段：  Vue 3 现在正式支持了多根节点的组件，也就是片段！

- 一个新的全局 API：createApp



| 2.x 全局 API |  3.x 实例 API (app) |
| :--: | :--: |
| Vue.config  | app.config |
|Vue.config.productionTip | removed (见下方) |
|Vue.config.ignoredElements| app.config.isCustomElement (见下方)|
|Vue.component	| app.component |
|Vue.directive	| app.directive |
|Vue.mixin	|   app.mixin |
|Vue.use	|   app.use (见下方)
|Vue.prototype  |   app.config.globalProperties |(见下方) |
> prototype 替换为 config.globalProperties、
全局api 替换为 import  模块方式，
$nextTick 也变为 import方式引出


-  新增：对于 v-if/v-else/v-else-if 的各分支项 key 将不再是必须的，因为现在 Vue 会自动生成唯一的 key。
非兼容：如果你手动提供 key，那么每个分支必须使用唯一的 key。你不能通过故意使用相同的 key 来强制重用分支。
非兼容：`<template v-for> 的 key 应该设置在 <template> `标签上 (而不是设置在它的子节点上)。
v-for 时 在 Vue 3.x 中 key 则应该被设置在 `<template> `标签上。`

- v-on 不在支持 keycode 

- $listeners 对象在 Vue 3 中已被移除。现在事件监听器是 $attrs 的一部分：


- 在 prop 的默认函数中访问
this，  把组件接收到的原始 prop 作为参数传递给默认函数；inject API 可以在默认函数中使用。
``` javascript
import { inject } from 'vue'
export default {
  props: {
    theme: {
      default (props) {
        // `props` 是传递给组件的原始值。
        // 在任何类型/默认强制转换之前
        // 也可以使用 `inject` 来访问注入的 property
        return inject('theme', 'default-theme')
      }
    }
  }
}
```

- 过渡class名修改， `<transition-group>` 不再默认渲染根元素，但仍然可以用 tag prop 创建根元素。

  
- v-on 的 .native 修饰符已被移除
因此，对于子组件中未被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 inheritAttrs: false)。

- v-model更改， 取消.sync
```js
<ChildComponent v-model="pageTitle" />
// ChildComponent.vue

export default {
  props: {
    modelValue: String // 以前是`value：String`
  },
  emits: ['update:modelValue'],
  methods: {
    changePageTitle(title) {
      this.$emit('update:modelValue', title) // 以前是 `this.$emit('input', title)`
    }
  }
}
```

- v-for 和 v-if 优先级 更改： v-if 优先，避免在同一级使用

- v-bind合并行为 顺序覆盖
``` html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="blue"></div>

<!-- template -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- result -->
<div id="red"></div>
```
- watch 监听数组的时候必须用deep。
当侦听一个数组时，只有当数组被替换时才会触发回调。如果你需要在数组改变时触发回调，必须指定 deep 选项。

