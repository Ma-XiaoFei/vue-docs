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

- 单文件组件 ``` <script setup> ```

  ```<script setup>```是在单文件组件中使用组合式API编译时的<font color='red'>语法糖</font>，使用组合式API时该语法是默认推荐的

  ```js
    <script setup>
      //变量
      const msg = 'Hello';

      //函数
      function fn(){
        console.log('fn')
      }

    </script>
  ```

 里面的代码会被编译成组件setup()函数的内容，```<script setup>```中的代码会在<font color='red'>每次组件实例被创建的时候执行。</font>
 

## reactive 
- 创建响应式proxy对象的Api 

```js
const data = reactive({ name: 'hello',age: 20 })

data.name = '哈哈' // 视图刷新
```
## ref
- 创建一个响应式、可更改的ref对象 
  
  如果将一个对象赋值给ref,那么这个对象将通过reactive()转为深层次的响应式对象
```js
<script setup>
  const msg = ref('hello');

  console.log(msg.value);// hello
</script> 

<template>
  // 模版中使用不用.value
  {{msg}}
</template>
```
## watch()
- 监听一个或多个响应式数据，并且在数据变化时调用所给的回调函数
  
  第一个参数是需要监听的数据，可以是一个ref对象、一个响应式对象、一个函数、数组等

  第二个参数是数据发生变化时触发的回调函数，该回调函数有三个参数：新值、旧值、一个用于注册副作用清理的回调函数

  第三个参数是一个可选对象，immediate、deep等

```js
const num = ref(0);
// 监听一个ref
watch(num,(newval,oldval)=<{

})

// 监听多个数据时
const data1 = ref();
const data2 = ref();
watch([data1,data2],([newval1,newval2],[oldval1,oldval2])=>{

})

// 监听一个响应式对象时,watch会自动启用深层监听,无法关闭，无法获取oldValue(获取的是newValue)
const data = reactive({num:0,name:'xxx'});
watch(data,(newval)=>{
  
})

// 监听reactive数据的某一个属性时，不会开启深度监听,oldValue正常获取,如果需要深度深度监听，需要手动加deep:true,加上深度监听后oldvalue无法获取
const msg = reactive({message:'修改数据',age:100,arr:[1,2]})
watch(()=>msg.message,(newval,oldval)=>{

},{deep:true})
```
## defineProps() 和 defineEmits()
  - defineProps 和defineEmits 只能在 setup语法糖中使用的编译器宏，不需要导入
  - defineProps 的接收和 props 的接收相同，defineEmits 的接收和 emits 的接收相同
 ```js
 <script setup>

  const props = defineProps({
      msg:String
  })
  console.log(props.msg)
  
  //如果直接解构数据会失去响应式,toRefs不会失去响应式
  const {msg} = toRefs(props);
  console.log(msg.value)

  const emits = defineEmits(['updata:modelValue','changeData'])
  emits('updata:modelValue',false)

 </script>

 <template>
    // {{props.msg}}
    {{msg}}
 </template>
 ``` 
 ## defineExpose
- defineExpose 也是setup语法糖中使用的编译器宏，不需要导入
- defineExpose可以在```<script setup>```组件中暴露出去属性
```js
  // 子组件
  <script setup>
    const a = ref(2);
    const fn = ()=>{

    }
    defineExpose({
      a,
      fn
    })
  </script>

  // 父组件
  <script setup>
    // 如果多个父组件使用该子组件，都能通过这种方式来获取
    const childRefs = ref('');

    const obtain = ()=>{
      //如果组件使用多次，childRefs.value 获取的是一个数组
      childRefs.value.a  //获取子组件暴露出来的属性
      childRefs.value.fn() //获取子组件暴露出来的函数并且在父组件执行
    }
    
  </script>

  <template>
    <button @click='obtain'>点击</button>  
    <child ref='childRefs'/>
  </template>
```


