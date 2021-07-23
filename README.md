## Vue 源码实现

[Vue](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/mounted.html#%E6%80%BB%E7%BB%93)

1.  MVC(Model View Controller), 是模型-视图-控制器的缩写,一种软件设计典范

    - Model(模型)：是应用程序用于处理应用程序数据逻辑的部分，通常模型对象负责在数据库存取数据
    - View(视图)：是应用程序中处理数据显示的部分，通常视图是依据模型数据创建的
    - Controller(控制器)：是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入,并向模型发送数据

    总结: Controller 负责将 Model 的数据用 View 显示出来,换句话就是在 Controller 里面把 Model 的数据赋值到 View

2.  MVVM

    新增了 VM 类

    - ViewModel：做了两件事
      一是将模型转化成视图，即将后端传递的数据转化为视图，实现方法是数据绑定
      二是将视图转化为后端数据，实现方式是事件监听

3.  MVC 与 MVVM 的区别

    MVVM 实现了 View 和 Model 的自动同步，也就是说当 Model 改变时候，不在需要手动修改 Dom,来改变 View 的显示，而是改变属性后该属性对应的 View 层显示会自动改变(对应 Vue 数据驱动的思想)

    MVVM 比 MVC 精简多了，不仅简化了业务与界面的依赖,还解决了数据频繁更新的问题，不再用选择器操作 Dom。

    因为在 MVVM 中，View 不知道 Model 的存在,Model 和 ViewModel 也观察不到 View,这种低耦合模式提高代码的可重用性

4.  Vue 并没有完全遵循 MVVM 的思想 这一点官网自己也有说明

    严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

## 名词解释

- 耦合和内聚

  每个模块之间相互联系的紧密程度，模块之间联系越紧密，则耦合性越高，模块的独立性就越差！反之同理；
  一个模块中各个元素之间的联系的紧密程度，如果各个元素（语句、程序段）之间的联系程度越高，则内聚性越高，即‘高内聚’ ！
  如: 一个项目中有 20 个方法调用良好，但是要修改了其中一个，另外的 19 个都要进行修改，这就是高耦合！独立性太差！

## vue 源码目录设计

```
src
├── compiler        # 编译相关
├── core            # 核心代码
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码

```

1. compiler

   compiler 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。

   编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

2. core

   core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。

3. platforms

   Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

4. server
   Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

   服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

5. sfc

   通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。

   这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

6. shared

   Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

## Vue 的定义

Vue 实际就是一个用`Function`实现的类，只能通过`new Vue`去实例它

为什么 Vue 类不用`class`实现

1.  Vue 有很多`xxxMixin`的函数调用，并把 Vue 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法。
2.  Vue 按功能把这些阔脏分散到多个模块去实现，而不是在一个模块里实现所有，这种方法是用`class`难以实现
3.  这种方式非常方便代的维护和管理。

## 数据驱动

1. 核心思想： 数据驱动
2. 概念： 视图是由数据驱动生成的，对视图的修改，不会直接操作 DOM,而是通过修改数据
3. 意义
   - 相比于传统的前端开发，如使用 jq 等前端库直接修改 DOM,大大简化了代码量
   - 特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。

## TODO

- [x] Vue 初始化过程
- [ ] 响应式原理

## Vue 初始化过程

1. 处理组件配置项
   - 初始化根组件时进行选项合并操作，将全局配置合并到根组件的局部配置上
   - 初始化每个子组件时候做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率
2. 初始化组件实例的关系属性，比如`$parent`、`$children`、`$root`、`$refs` 等
3. 处理了自定义事件
4. 初始化了 render 函数的渲染
5. 调用 beforeCreate 钩子函数
6. 初始化组件的 inject 配置项，得到 result[key]=val 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例中
7. 数据响应式处理，初始化 props, methods, data, computed, watch
8. 解析组件配置项上的 provide 对象，将其挂载到 vm.provided 属性上
9. 调用了 create 钩子函数
10. 如果发现配置上有 el 选项， 则自动调用`$mount`方法，没有则要手动调用`$mount`
11. 接下来则进入挂载阶段

## 响应式原理

1. computed 缓存原理

   - 实例对应的 watcher, watcher 中有 lazy 为 true 的属性，默认是懒执行且不可更改，表示在模板里读取它的值才会执行计算
   - 对应的 watcher 在初始化的时候会赋值 dirty 属性为 true，当 dirty 为 true 的时候，调用 watcher.evaluate 方法重新求值得到 watcher.value，然后将 dirty 设置为 false
   - 只有下次 watcher 的响应式依赖有更新的时候，会将 watcher 的 dirty 再置为 true，这时候才会重新求值，这样就实现了 computed 的缓存。

2. computed、 watch、 methods 的区别

   - methods

     - 在一次渲染中，有多个地方使用同一个 methods 属性，methods 会被执行多次，

     - 每次视图有更新都会重新执行函数，性能消耗较大

     - 适用于封装一些较为复杂的处理逻辑(同步、异步)

   - computed

     - 实例对应 watcher，默认懒执行且不可更改，表示依赖其他属性计算值，只有当计算值变化才会返回内容

     - computed 实例对应的 watcher, 通过判断 watcher.dirty, 当 watcher.dirty 为 true 时，调用 watcher.evaluate 方法重新求值得到 watcher.value, 在将 watcher.dirty 设置为 false, 如果 watcher 的响应式依赖没有更新，就直接读取读取 watcher.value, 实现 computed 的缓存

     - computed 可以值设置 set 和 get, 内部判断传入参数函数还是对象进行处理，函数直接设置 get, 对象进行 get，set 赋值

   - watch

     - watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。
     - watcher 可配置选项, immediate(立即执行一次回调函数)、 handle(object | function | string | array) 、deep(深度监听对象中的属性) 等
     - 适用于观测某个值的变化去执行异步方法或者开销较大的操作

3. 响应式原理

   整体思路是数据劫持+观察者模式

   ![响应式原理流程图](images/defineReactive.png)

   ![响应式原理流程图](images/reactive.png)

   - [observe(function)](src/observe.js)

     - 响应式真正入口，为对象创建观察者实例
     - 如果对象已经被观察过，则返回已有的观察者实例，否则创建新的观察者实例

   - [Observer(class)](src/Observer.js)

     - 会附加到每个被观察的对象上，value.\_\_ob\_\_ = this，而对象的各个属性则会被转换成 getter/setter，并收集依赖和通知更新

     - 判断被观察的是数组还是对象, 分别处理

   - [defineReactive(function)] (src/defineReactive.js)

     - 拦截 obj[key]的读取和设置操作

     - 在第一次读取时收集依赖(dep.depend())，比如执行 render 函数生虚拟 DOM 时会有读取操作

     - 在更新时设置新值并通知更新(dep.notify())

   - [methodsToPatch](src/array.js)

     - 基于数组原型对象创建新的对象，通过复写增强 array 原型方法，使其具有依赖通知更新的能力来处理数组响应式

     - 选择 7 种数组方法(push, pop, unshift, shift, reverse, splice,sort)方法进行重写(AOP 切片思想)

     - 所以在 Vue 中修改数组的索引和长度是无法监控的，需要通过以上七种变异方法才能触发数组对应的 watcher 进行更新

   - [Dep(class)](src/Dep.js)

     - 一个 dep 对应一个 obj.key
     - 读取响应式数据时，负责收集依赖(Dep.depend)，每个 dep 依赖的 watcher 有哪些
     - 更新响应式数据时，负责通知 dep 中哪些 watcher 去执行 update 方法(Dep.notify)

   - [Watcher(class)](src/Watcher.js)

     - Watcher 是一个中介的角色，数据发生变化的时候通知他，然后他在通知其他地方
     - 当数据更新时 watcher 会被触发，访问 this.computedProperty 时也会触发 watcher

   总结

   对象的变化侦测

   - Object 可以通过 Object.defineProperty 将属性转换成 getter/setter 的形式来追踪变化，读取数据时会触发 getter，修改数据时会触发 setter
   - 在 getter 中收集有哪些依赖使用了数据，当 setter 被触发时，去触发 getter 中收集的依赖数据发生变化
   - Dep 类用来收集存储依赖，删除依赖和向依赖发送消息等
   - 依赖就是 Watcher，只有 Watcher 触发的 getter 才会收集依赖，哪个 Watcher 触发了 getter， 就把哪个 Watcher 收集到 Dep 中。当数据发生变化时，会循环依赖列表，把所有的 Watcher 都通知一遍
   - Watcher 的原理是先把自己设置到全局唯一的指定位置(例如 window.target)，然后读取数据，因为读取了数据，所以触发了这个数据的 getter，接着 getter 中就会从全局唯一的那个位置读取当前正在读取数据的 Watcher，并把这个 watcher 收集到 Dep 中去。通过这样的方式，Watcher 可以主动去订阅任意一个数据的变化
   - 创建 Observer 类，作用是把一个 Object 中的所有数据（包括子数据）都转换成响应式，也就是它会侦测 object 中所有数据（包括子数据）的变化

   数组的变化侦测

   - Array 通过方法来改变内容的，所以通过创建拦截器去覆盖数组原型的方式来追踪变化
   - 为了不污染全局 Array.prototype，我们在 Observer 中针对那些需要侦测变化的数组使用\_\_proto\_\_来覆盖原型方法，但\_\_proto\_\_在 ES6 之前并不是标准属性，不是所有浏览器都支持，因此针对不支持\_\_proto\_\_属性的浏览器，我们直接循环拦截器，把拦截器中的方法直接设置到数组身上来拦截 Array.prototype 上的原生方法
   - Array 收集依赖的方式和 Object 一样，都是在 getter 中收集，在拦截器中向依赖发消息，将依赖保存在 Observer 实例上

   - 除了侦测数组自身的变化外，数组中元素发生的变化也要侦测，在 Observer 判断当前被侦测的数据是数组，则调用 observeArray 方法将数组中的每一元素都转换成响应式并侦测变化

   - 对数组新增的数据也要侦测。使用当前操作数组的方法进行判断，如果是 push、unshift、splice 方法，则从参数中新增数据提取出来，然后使用 observeArray 对新增的数据进行变化侦测

   Observer 总结

   - 在 Observer 中，对每个侦测了变化的数据都标记上了\_\_ob\_\_，并把 this(Observer 实例)保存在\_\_ob\_\_上。 主要有两个作用，一方面是为了标记数据是否被侦测了变化，保证同一个数据只被侦测了一次。 另一方面可以很方便地通过数据取到\_\_ob\_\_，从而拿到 Observer 实例上的保存的依赖，当拦截到数组发生变化时，向依赖发送通知

   Dep 和 Watcher 双向收集

   - Watcher 需要记录自己订阅了谁， 也就是 watcher 实例被收集到了哪些 Dep 里，然后当 Watcher 不想继续订阅这些 Dep 时，循环自己记录的订阅列表来通知他们（Dep）将自己从他们(Dep)的依赖列表中移除掉

   - 如果 Watcher 中的 expOrFn 参数是一个表达式，那么肯定只收集一个 Dep,并且大部分都是这样的
   - 如果 Watcher 中的 expOrFn 参数是一个函数，此时如果该函数内部使用了多个数据，那么此时 Watcher 就要收集多个 Dep
