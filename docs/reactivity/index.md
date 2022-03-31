# Vue3核心模块
!['/'](/img/v3_core.png)

- compiler-core: 编译器核心(平台无关)
- compiler-dom: 针对浏览器的编译模块
- compiler-sfc: 用以编译单个vue 文件
- compiler-ssr: 针对服务器渲染的编译模块
- reactivity: 响应式系统
- runtime-core：运行时核心(平台无关)
- runtime-dom: 针对浏览器的运行时，包括dom api、属性、事件处理
- runtime-test: 用于测试，可以用于自定义渲染器测试
- server-renderer: 用于服务器端渲染
- shared: 多个包之间共享内容
- size-check: 用于检测包大小
- template-explorer: 用以调试编译器输出的工具包
- vue: vue完整版本，包含运行时和编译器
- vue-compat: 提供了可配置的vue2兼容 行为


::: tip 提示
与vue2 不同的是，Vue3代码库采用的是monorepos（单仓多包）管理，所有的包都在package文件夹下
:::
## 优点
- 可以较好的分离模块
- 可以单独引入使用



## 响应式流程图
![](/img/reactivity_run.png)

## reactive 
> 创建响应式对象的Api
```js
const obj = {
    name:'xx',
    age: 20
};

const state = reactive(obj);
// console.log(state) => Proxy

```

- 源码
```js
export function reactive(target: object) {
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```
1、reactive 这个函数入口判断是不是一个代理只读的对象，如果是 直接源对象返回，无需操作。
跳过上面的判断 直接返回了createReactiveObject这个函数执行结果。

2、接下来我们去看createReactiveObject 做了什么， 
```js
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```
- 接下来慢慢研究
```js
// 首先判断不是object 直接返回原来的值
 if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
```
``` js
// 然后又继续判断target是不是代理过的proxy
 if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
```

```js
 
/*  
判断target是不是已经代理过的， 如果代理过，再次返回之前代理过的proxy。
proxyMap：是一个全局变量 new出来的一个Map
 */
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }
```
```js

/* 
接下来就是new Proxy 创建实例并返回了，创建后，把当前 target 和 proxy 存入 全局的proxyMap
*/
 const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
```
```js{3}
/* 那么我们去看 baseHandlers里有什么 ，根据生面reactive里传的参数 mutableHandlers ，我们发现它是 baseHandlers模块导入的*/
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

```
```js
/* 点进去发现它是一个 get,set,deleteProperty,has,ownKeys 的属性值集 
那么再去看get、 set等是个啥*/
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}

```
![](/img/getter-setter.png)
- 通过createGetter、createSetter 来创建的getter函数和setter函数

- get函数, 开头去判断是否是已经代理过，如果是，直接return true；
ReactiveFlags.IS_REACTIVE 是一个flag标记：'__v_isReactive'。
根据上面的reactive里是来取这个标记 取到了就说明被代理过。

```js

if (key === ReactiveFlags.IS_REACTIVE) {
    return !isReadonly;
} else if (key === ReactiveFlags.IS_READONLY) {
    return isReadonly;
} else if (key === ReactiveFlags.IS_SHALLOW) {
    return shallow;
...
```
```js
//再往下就是获取源对象的属性值
 const res = Reflect.get(target, key, receiver);

// 这里去收集依赖
 if (!isReadonly) {
    track(target, TrackOpTypes.GET, key);
 }
 //判断取出来的值是不是对象，是的话直接再去reactive
if (isObject(res)) {
    return isReadonly ? readonly(res) : reactive(res);
}
  return res;
 ```

 - set函数 
 ```js

 /* 设置源对象target属性值
 执行trigger函数去派发get函数里收集的依赖 */
 const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue);
      }
    }
    return result;
```


## effect
> effect函数主要是用来做 被代理（reactive）后的值修改后，会去实时去run传递进去的函数.
Vue里面所有的响应式都是通过effect来做的， 包括computed、watch、甚至组件渲染
```js
const obj = {
    name: 'xx'
};
const state = reactive(obj);
effect(()=> {
    console.log(state.name); //=>  xx xxx
});

state.name = 'xxxxx';
//它会输出两次state.name
// 刚开始立刻会执行， 等下面又修改值后，会再次执行

```

- 源码

```js
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn;
  }

  const _effect = new ReactiveEffect(fn);
  if (options) {
    extend(_effect, options);
    if (options.scope) recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;
  return runner;
}
```

:::tip 源码中
可以看到需要传递参数是一个函数和一个可选的options

我们可以看到在effect 里又去new 了ReactiveEffect一个实例， 并且实例身上有个run方法，
new 之后，会立刻去执行run， 执行完后，会把runner返回
:::

- ReactiveEffect
> 接下来就要去看ReactiveEffect里面的逻辑了
```js

export class ReactiveEffect<T = any> {
  active = true;
  deps: Dep[] = [];
  parent: ReactiveEffect | undefined = undefined;
  ...
//这个类里面定义了3个 属性 active、deps、parent
/* 
active表示是否激活，
deps存储的是所有effect的数组
parent 是用来 存储effect父子的关系
*/


/* run 函数里去执行 传递effect传进来的fn 
里面涉及到清楚依赖， 临时存放activeEffect，

当this.fn执行的时候就可以获取fn里面用的的代理值了，就会去走handler 的 get函数
去触发track 收集依赖
*/


 run() {
    if (!this.active) {
      return this.fn();
    }
    let parent: ReactiveEffect | undefined = activeEffect;
    const lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;

      trackOpBit = 1 << ++effectTrackDepth;

      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }

      trackOpBit = 1 << --effectTrackDepth;

      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = undefined;
    }
  }
```


- handler get 函数里面track

```js{4}
/* 在reactive中介绍了 get函数里有一个track*/
// 这里去收集依赖
 if (!isReadonly) {
    track(target, TrackOpTypes.GET, key);
 }
 //它把源对象、type类型为'get' 、和访问的key 传递给track函数了
 ```
 
 - track函数
 ```js
 /*
    主要是去添加依赖项
    targetMap为最大的WeakMap，里面装这 key 为源对象， value为 Map。
    Map里key为 传递进来的key， value为 一个Set 。
    Set里存储的是当前的effect实例

  */
   if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = createDep()));
    }
```


- trigger函数
> 当代理的属性被修改后， 会触发handler 的set函数
在set函数里会去 调用trigger。

```js
/* 把源对象，'set', key， 和 新修改的值， 以及 之前的值 传递进去 */
 trigger(target, TriggerOpTypes.SET, key, value, oldValue);

//首先去get 源对象对应的Map
 const depsMap = targetMap.get(target);
  if (!depsMap) {
    // never been tracked
    return;
  }

//去执行所有的依赖函数
    if (key !== void 0) {
      deps.push(depsMap.get(key));、
    }
    
   for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }

```


## computed
> 计算属性，传入一个fn 返回一个对象， {value: 'xx'}
- computed 内部依然使用的是 ReactiveEffect这个类



```
```










## ref











## 手写源码
```js
// package结构
        | baseHandler.ts
        | effect.ts
 package| index.ts
        | reactive.ts
        | shared.ts

```

- index.ts
```
export { reactive } from './reacive';
export { effect } from './effect';

```
### reactive 


```js
import { mutableHandler } from './baseHandler';
import { isObject } from './shared';

const reactiveMap = new Map();

export enum ReactiveFlags {
    isReactive = '__v_isReactive',
}

export function reactive(target) {
    //如果不是对象直接返回
    if (!isObject(target)) return target;
    //如果target对象上有这个标记 直接返回
    if (target[ReactiveFlags.isReactive]) { 
        return target;
    }

    const exitingProxy = reactiveMap.get(target);
    if (exitingProxy) {
        return exitingProxy;
    }

    const proxy = new Proxy(target, mutableHandler);
    //存储源对象映射
    reactiveMap.set(target, proxy);
    return proxy;
}

```

### effect
```js
//正在激活的effect
let activeEffect = undefined;

//用来存储目标对象 用到的属性集合  =》 { target: { key: [ effect ] } }
const targetMap = new Map();

//清楚依赖dep Fn
function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}

//公共类， 用来管理effect运行
class ReactiveEffect {
    public active = true;
    public parent = undefined;
    public deps = [];
    constructor(public fn) {}

    stop() {
        this.active = false;
        cleanupEffect(this);
    }

    run() {
        if (!this.active) return this.fn();

        try {
            this.parent = activeEffect;
            activeEffect = this;
            cleanupEffect(this);
            return this.fn();
        } finally {
            activeEffect = this.parent;
            this.parent = undefined;
        }
    }
}

//导出的effect
export function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

// 用来收集依赖
export function track(target, type, key) {
    if (!activeEffect) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    const shouldTrack = !dep.has(activeEffect);

    if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

//用来触发依赖的fn
export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (dep) {
        const deps = [...dep];
        deps.forEach(effect => {
            effect !== activeEffect && effect.run();
        });
    }
}

```

### baseHandler 
```js
import { reactive, ReactiveFlags } from './reacive';
import { isObject } from './shared';
import { track, trigger } from './effect';

export const mutableHandler = {
    get(target, key, reciver) {
        if (key === ReactiveFlags.isReactive) {
            return true;
        }
        track(target, 'get', key);
        const res = Reflect.get(target, key, reciver);
        //判断是不是一个对象，如果是再次reactive
        return isObject(res) ? reactive(res) : res;
    },
    set(target, key, value, reciver) {
        const oldValue = target[key];
        const res = Reflect.set(target, key, value, reciver);
        if (!Object.is(oldValue, value)) {
            trigger(target, 'set', key, value, oldValue);
        }

        return res;
    }
};
```

- shared.ts

```js
export const isObject = (obj)=> typeof obj === 'object';
```


## 流程总结
- 当我们reactive一个对象的时候， 会返回一个proxy对象，这个proxy里代理了get、set、delete、等操作。
- 当我们 使用 effect函数的时候，使用到了reactive过的对象，会重新执行，并渲染， vue组件也就是使用effect嵌套出的。
- effect 里使用的属性，会触发proxy的get方法、通过track收集对象的依赖。
- 当属性值被set后，会去触发proxy的set方法， 最终去trriger触发所有的依赖对应的effect