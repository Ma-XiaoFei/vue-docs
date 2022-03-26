### Vue3相关
::: tip 与Vue2区别
Vu3是兼容Vue2的，区别关键在于Composition API（组合式API）
:::

## setup 
- 所有的组合式Api使用的场地
```js
export default {
  setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    console.log(context.attrs)

    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots)

    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit)

    // 暴露公共 property (函数)
    console.log(context.expose)
  }
  return {

  }
}
```
- 允许返回 两种返回值
   
    1、返回对象 ，对象中的属性可以在tamplate里使用

    2、返回一个h(渲染函数)

::: warning 注意
1、尽量不要v2（options）和v3一起使用

2、v2 里 的（data、methods）可以访问到setup里面的属性方法
setup里访问不到 v2 里 的 data、methods）

3、setup优先级要高
:::