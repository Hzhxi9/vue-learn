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

    MVVM 比 MVC 精简多了，不仅简化了业务与界面的依赖,还解决了数据频繁更新的问题，不再用选择器操作 DOM。

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
- [ ] 异步更新
- [ ] 全局 API
- [ ] 实例方法

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

- 为什么 data 是个函数并且返回一个对象呢？

  - 在`initData`函数中，会判断 data 是否为函数，是函数就会执行（注意 this 指向 vm），否则就直接赋值给 vm 上的\_data
  - 建议在组件中将 data 写成一个函数，将数据函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用同一份 data，就会造成组件的变量污染，一个变了全都会变的结果

## 响应式原理

1.  computed 缓存原理

    - 实例对应的 watcher, watcher 中有 lazy 为 true 的属性，默认是懒执行且不可更改，表示在模板里读取它的值才会执行计算
    - 对应的 watcher 在初始化的时候会赋值 dirty 属性为 true，当 dirty 为 true 的时候，调用 watcher.evaluate 方法重新求值得到 watcher.value，然后将 dirty 设置为 false
    - 只有下次 watcher 的响应式依赖有更新的时候，会将 watcher 的 dirty 再置为 true，这时候才会重新求值，这样就实现了 computed 的缓存。

2.  computed、 watch、 methods 的区别

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

3.  响应式原理

    整体思路是数据劫持+观察者模式

    ![响应式原理流程图](images/defineReactive.png)

    ![响应式原理流程图](images/reactive.png)

    - [observe(function)](src/observe.js)

      - 响应式真正入口，为对象创建观察者实例
      - 如果对象已经被观察过，则返回已有的观察者实例，否则创建新的观察者实例

    - [Observer(class)](src/Observer.js)

      - 会附加到每个被观察的对象上，value.\_\_ob\_\_ = this，而对象的各个属性则会被转换成 getter/setter，并收集依赖和通知更新

      - 判断被观察的是数组还是对象, 分别处理

    - [defineReactive(function)](src/defineReactive.js)

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

4.  总结

    - 对象的变化侦测

      - Object 可以通过 Object.defineProperty 将属性转换成 getter/setter 的形式来追踪变化，读取数据时会触发 getter，修改数据时会触发 setter
      - 在 getter 中收集有哪些依赖使用了数据，当 setter 被触发时，去触发 getter 中收集的依赖数据发生变化
      - Dep 类用来收集存储依赖，删除依赖和向依赖发送消息等
      - 依赖就是 Watcher，只有 Watcher 触发的 getter 才会收集依赖，哪个 Watcher 触发了 getter， 就把哪个 Watcher 收集到 Dep 中。当数据 发生变化时，会循环依赖列表，把所有的 Watcher 都通知一遍
      - Watcher 的原理是先把自己设置到全局唯一的指定位置(例如 window.target)，然后读取数据，因为读取了数据，所以触发了这个数据的 getter，接 着 getter 中就会从全局唯一的那个位置读取当前正在读取数据的 Watcher，并把这个 watcher 收集到 Dep 中去。通过这样的方式，Watcher 可以主 动去订阅任意一个数据的变化
      - 创建 Observer 类，作用是把一个 Object 中的所有数据（包括子数据）都转换成响应式，也就是它会侦测 object 中所有数据（包括子数据）的变化

    - 数组的变化侦测

      - Array 通过方法来改变内容的，所以通过创建拦截器去覆盖数组原型的方式来追踪变化
      - 为了不污染全局 Array.prototype，我们在 Observer 中针对那些需要侦测变化的数组使用\_\_proto\_\_来覆盖原型方法，但\_\_proto\_\_在 ES6 之前并不是标准属性，不是所有浏览器都支持，因此针对不支持\_\_proto\_\_属性的浏览器，我们直接循环拦截器，把拦截器中的方法直接设置到数组 身上来拦截 Array.prototype 上的原生方法
      - Array 收集依赖的方式和 Object 一样，都是在 getter 中收集，在拦截器中向依赖发消息，将依赖保存在 Observer 实例上

      - 除了侦测数组自身的变化外，数组中元素发生的变化也要侦测，在 Observer 判断当前被侦测的数据是数组，则调用 observeArray 方法将数组中的每一 元素都转换成响应式并侦测变化

      - 对数组新增的数据也要侦测。使用当前操作数组的方法进行判断，如果是 push、unshift、splice 方法，则从参数中新增数据提取出来，然后使用 observeArray 对新增的数据进行变化侦测

    - Observer 总结

      - 在 Observer 中，对每个侦测了变化的数据都标记上了\_\_ob\_\_，并把 this(Observer 实例)保存在\_\_ob\_\_上。 主要有两个作用，一方面是 为了标记数据是否被侦测了变化，保证同一个数据只被侦测了一次。 另一方面可以很方便地通过数据取到\_\_ob\_\_，从而拿到 Observer 实例上的保存的 依赖，当拦截到数组发生变化时，向依赖发送通知

    - Dep 和 Watcher 双向收集

      - Watcher 需要记录自己订阅了谁， 也就是 watcher 实例被收集到了哪些 Dep 里，然后当 Watcher 不想继续订阅这些 Dep 时，循环自己记录的 订 阅 列表来通知他们（Dep）将自己从他们(Dep)的依赖列表中移除掉

      - 如果 Watcher 中的 expOrFn 参数是一个表达式，那么肯定只收集一个 Dep,并且大部分都是这样的
      - 如果 Watcher 中的 expOrFn 参数是一个函数，此时如果该函数内部使用了多个数据，那么此时 Watcher 就要收集多个 Dep

5.  vue 使用 Object.defineProperty() 的缺陷

    - 数组的 length 属性被初始化`configurable: false`，所以想要通过 get/set 方法来监听 length 属性是不可行的

    - 数组因为考虑性能原因，没有使用 Object.defineProperty 对数据的每一项进行拦截，所以通过重写数组方法进行数组响应式监听。

    - 数组中如果是对象数据类型也会递归劫持

    - Object.defineProperty 没有对对象的新属性进行属性劫持，因为在进行数据遍历的时候用的是初始 data 上已经存在的 key

6.  为什么只对对象劫持，而要对数组进行方法重写？

    - 因为对象最多也就几十个属性，拦截起来数量不多，但是数组可能会有几百几千项，拦截起来非常耗性能，所以直接重写数组原型上的方法，是比较节省性能的方案

7.  为什么只重写`push unshift pop shift reverse sort splice`这七个方法

    - 因为这七个方法会改变数组方法，而其他像 concat 这种就不会改变原数组。

8.  根据响应式原理，总结一些优化 vue 代码的方法

    - 对象层级不要嵌套太多层。因为 vue2 中多层对象是通过递归来实现劫持，所以对象层级过深，性能就会差。

    - 不需要响应式的内容不要放到 data 中

      - 可以把数据定义在 data 之外
      - 可以使用 object.freeze()冻结数据

9.  Vue 提供修复对象与数组无法响应式更新的解决方案

    - Vue.$set

      - 处理 target 是数组的情况

        - 先设置 length 属性， 然后调用数组的 splice 方法新增数据，同时触发数组拦截器，监听新增数据

      - 处理 target 是对象的情况

        - 先获取 target 的\_\_ob\_\_

        - 在判断是否为 vue 实例或者根数据

        - 不是响应式数据修改完后直接返回

        - 是响应式数据使用 defineReactive 将新属性转换 getter/setter

        - 通知更新视图

    - Vue.$delete
      - 处理 target 是数组的情况
        - 调用数组的 splice 方法删除数据，同时触发数组拦截器，监听修改后的数组
      - 处理 target 是对象的情况
        - 先获取 target 的\_\_ob\_\_
        - 在判断是否为 vue 实例或者根数据，是就直接返回
        - 是不是 target 自身属性，不是就直接返回
        - 不是响应式数据删除完后直接返回
        - 通知更新视图

## 异步更新

1. vm.$nextTick 使用场景

   - 当更新了状态(数据)后，需要对新 DOM 做一些操作，但是这时候其实获取不到更新后的 DOM，因为还没重新渲染，此时需要使用 nextTick 方法

2. 下次 DOM 更新状态

   - 在 Vue 中，当状态发生变化时，watcher 会得到通知，然后触发虚拟 DOM 的渲染过程。watcher 触发渲染不是同步的而是异步的
   - Vue 中有一个队列，每当需要渲染时，会将 watcher 推送到这个队列中，在下一次事件循环中再让 watcher 触发渲染

   - 下次微任务执行时更新 DOM，而 vm.$nextTick 其实是将回调添加到微任务中。只有在特殊情况下才会降级到宏任务，默认会添加到微任务中

3. 为什么使用异步更新队列

   - Vue2 使用虚拟 DOM 进行渲染，变化侦测的通知只发送到组件，组件内用到的所有状态的变化都会通知到同一个 watcher，然后虚拟 DOM 会对整个组件进行比对（diff）并更改 DOM，也就是说，如果在同一轮事件循环中有两个数据发生了变化，那么组件的 watcher 会收到两份通知，从而进行两次渲染。事实上并不需要渲染两次，虚拟 DOM 会对整个组件进行渲染，所以只需要等所有状态都修改完毕后，一次性将整个组件的 DOM 渲染到最新即可

   - Vue 的实现方式是将收到通知的 watcher 实例添加到队列中缓存起来，并且在添加到队列之前检查其中是否已经存在相同的 watcher，只有不存在时，才将 watcher 实例添加到队列中，然后再下一次事件循环中（event loop）中，Vue 会让队列中的 watcher 触发渲染流程并清空队列。这样就可以保证即使在同一事件循环中有两个状态发生改变，watcher 最后也只执行一次渲染过程

   - 通俗点说就是同一事件循环内多次修改，会统一进行视图更新。

4. 事件循环

   - JavaScript 是一门单线程且非阻塞的脚本语言

     - 单线程指的 Javascript 代码在执行的任何事件都只有一个主线程来处理所有任务
     - 非阻塞指的是当代码需要处理异步任务时，主线程会挂起（pending）这个任务，当异步任务处理完毕后，主线程在根据一定规则去执行相应的回调

   - 事件队列

     - 当任务处理完毕后，JavaScript 会将这个事件加入到一个队列中，这个队列为事件队列
     - 被放入事件队列中的事件不会立刻执行其回调，而是等待当前执行栈中的所有任务执行完毕后，主线程会去查找事件队列中是否有任务

   - 事件循环

     - 当执行栈中的所有任务都执行完毕后，会去检查任务队列中是否有事件存在，如果存在，则会一次执行微任务队列中事件对应的回调，直到为空。然后去宏任务队列中取出一个事件，把对应的回调加入到当前的执行栈，当执行栈中的所有任务都执行完毕后，检查微任务队列中是否有事件存在。无限重复次过程，就形成了一个无限循环，这个循环就叫作事件循环

   - 异步任务

     - 微任务

       - Promise.then
       - MutationObserver 监视对 DOM 树所做更改的能力
       - Object.observe 用来实时监测 js 中对象的变化，变化时调用一个方法
       - process.nextTick 定义出一个动作，并且让这个动作在下一个事件轮询的时间点上执行

     - 宏任务

       - setTimeout
       - setInterval
       - setImmediate 把一些需要长时间运行的操作放在一个回调函数里,在浏览器完成后面的其他语句后,就立刻执行这个回调函数
       - MessageChannel 接口允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据。
       - requestAnimationFrame 你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
       - I/O
       - UI 交互事件

5. 执行栈

   - 当我们执行一个方法时，JavaScript 会生成一个与这个方法对应的执行环境(context)，又叫执行上下文

   - 这个执行环境中有这个方法的私有作用域，上层作用域的指向、方法的参数、私有作用域中定义的变量以及 this 对象。

   - 这个执行环境会被添加到一个栈中，这个栈就是执行栈

6. Vue 的异步更新机制是如何实现的

   - Vue 的异步更新机制的核心是利用了浏览器的异步任务队列来实现的，首选微任务队列(Promise, MutationObserver)，宏任务次之(setImmediate, setTimeout)
   - 当数据响应式更新后，调用 dep.notify()方法通知 dep 中收集的 watcher 去执行 update 方法，watcher.update 将 watcher 自己放入一个 watcher 队列(全局的 queue 数组)
   - 然后通过 nextTick 方法将舒心 watcher 队列的方法(flushSchedulerQueue)放入一个全局的 callbacks 数组中
   - 如果支持浏览器的异步任务队列中没有叫 flushCallbacks 的函数，则执行 timerFunc 的函数，将 flushCallbacks 函数放入异步任务队列。
   - 如果异步任务队列中已经存在 flushCallbacks 函数，等待其执行完成以后在放入下一个 flushCallbacks 函数
   - flushCallbacks 函数负责执行 callbacks 数组中的所有 flushSchedulerQueue 函数
   - flushSchedulerQueue 函数负责刷新 watcher 队列，即执行 queue 数组中的每一个 watcher 的 run 方法，从而进入更新阶段，比如执行组件更新函数或者执行用户 watcher 的回调函数

7. Vue 的 nextTick API 是如何实现的
   - 将传递的回调函数用 try/catch 包装后然后放入 callbacks 数组
   - 执行 timeFunc 函数，在浏览器的异步任务队列放入一个刷新 callbacks 数组的函数

## 全局 API

1. Vue.use(plugin)

   - 判断插件是否已经被安装，如果安装则直接结束，防止重复安装
   - 判断 plugin 是对象还是函数
     - 对象，则执行 install 方法安装插件
     - 函数，则直接调用 plugin 方法安装插件

2. Vue.set(target, key, value)

   由于 Vue 无法探测响应式对象新增的 property， 所以通过 Vue.set 为响应式对象添加一个 property， 可以确保这个新增的 property 同样是响应式的，且触发视图更新

   - 更新数组指定下标的元素，Vue.set(array, idx, val)，内部是通过 splice 方法实现响应式更新
   - 更新对象已有属性，Vue.set(obj, key, val)，直接更新返回
   - 不能向 Vue 实例或者$data 动态添加根级别的响应式数据
   - 如果目标对象不是响应式对象，会执行赋值，但是不会做响应式处理
   - 如果目标对象是响应式对象，新增一个新的 key，会通过 defineReactive 方法设置响应式，并触发依赖更新

3. Vue.delete(target, key, value)

   删除对象的 property，如果对象是响应式，确保删除会触发视图更新，这个方法确保 Vue 能监测到 property 被删除

   - 通过数组下标删除元素，内部通过 splice 方法实现
   - 删除响应式对象某个属性，内部执行 delete obj.key，然后执行依赖更新
   - 不能删除根级别的响应式属性

4. Vue.extend(options)

   - 基于 Vue 创建一个子类，参数 options 会作为该子类的默认全局配置，就像 Vue 的默认全局配置一样。所以通过 Vue.extend 扩展一个子类，一大用处就是内置一些公共配置，供子类的子类使用
     - 定义子类的构造函数，跟 Vue 一样，也是调用了\_init(options)
     - 合并 Vue 的配置和 options，如果选项冲突，则 options 的选项会覆盖 Vue 的配置项
     - 给子类定义全局 Api， 值为 Vue 的全局 Api， 比如 Sub.extend = Super.extend，这样子类同样可以扩展出其他子类
     - 返回子类 Sub

5. Vue.mixin(options)

   - 负责在 Vue 的全局配置上合并 options 配置，然后在每个组件生成 vnode 时会将全局配置合并到组件自身的配置上来

   - 实现的核心是 mergeOptions 方法（合并两个选项， 出现相同配置项时， 子选项会覆盖父选项的配置）

     - 标准化 option 上的 props、 inject、 directive 属性
     - 处理 options 上的 extends 和 mixins， 分别将他们合并到全局配置上
     - 然后将 options 配置和全局配置进行合并，选项冲突时，options 会覆盖全局配置

6. Vue.component(compName, Comp)

   - 负责注册全局组件，就是将组件配置注册到全局配置的 component 选项上(options.components)，然后各个子组件在生成 vnode 时会将全局的 components 选项合并到局部的 components 配置项上

     - 如果第二个参数为空， 则表示获取 compName 的组件构造函数
     - 如果 Comp 是组件配置对象，则使用 Vue.extend 方法得到组件构造函数，否则直接进行下一步
     - 在全局配置上设置组件信息，this.options.components.compName = CompConstructor

7. Vue.filter('my-filter', function(val){})

   - 负责在全局注册过滤器 my-filter，然后每个子组件在生成 vnode 时会将全局的 filters 选项合并到局部的 filters 选项中
     - 如果没有提供第二个参数，则获取 my-filter 过滤器的回调函数
     - 如果提供了第二个参数，则设置 this.options.filters['my-filter'] = function(val)

8. Vue.directive('my-directive', {xx})
   - 在全局注册 my-directive 指令，然后每个子组件在生成 vnode 时会将全局的 directives 选项合并到局部的 directives 选项中。
     - 如果第二个参数为空，则获取指定指令的配置对象
     - 如果不为空且是一个函数的话，则生成配置对象{bind: 第二个参数, update: 第二个参数}
     - 然后将指令配置对象设置到全局配置上，this.options.directives['my-directive'] = { xx }
9. Vue.nextTick(cb)

   延迟回调函数 cb 的执行，一般用于响应式数据更新时，想立即获取更改过后的 DOM 数据

   - 触发依赖通知更新时，将负责更新的 watcher 放入 watcher 队列
   - 将刷新 watcher 队列的函数放到 callbacks 数组中
   - 在浏览器的异步任务队列中放入一个刷新 callbacks 数组的函数
   - Vue.nextTick(cb)来插队，将 cb 函数放入 callbacks 数组
   - 待将来某个时刻执行刷新 callbacks 数组的函数
   - 然后执行 callbacks 数组中众多函数， 触发 watcher.run 的执行，更新 DOM
   - 由于 cb 函数是在后面方放到 callbacks 数组，所以这就保证了先完成的 DOM 更新，在执行 cb 函数
