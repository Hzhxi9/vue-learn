## Vue 源码实现

[Vue](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/mounted.html#%E6%80%BB%E7%BB%93)
[Vue 实现原理讲义](https://vue-course-doc.vercel.app/#_4-%E6%B8%B2%E6%9F%93%E5%87%BD%E6%95%B0)
[尤雨溪教你写 vue 高级 vue 教程 源码分析](https://www.bilibili.com/video/BV1d4411v7UX/?p=4&spm_id_from=pageDriver)

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
- [ ] Hook Event
- [ ] 编译器 编译
- [x] 编译器 优化
- [ ] render helper
- [ ] patch

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
   - 然后通过 nextTick 方法将刷新 watcher 队列的方法(flushSchedulerQueue)放入一个全局的 callbacks 数组中
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

## 实例方法

1. vm.$set(obj, key, value)

   用于向响应式对象添加添加了新的 property， 并确认这个新的 property 同样是响应式，并触发视图更新

   - 由于 Vue 无法探测对象新增属性或者通过所有为数组新增一个元素 `this.obj.newProperty = 'value' 、 this.arr[3] = 'value'`
   - 为对象添加了一个新的响应式数据，调用 defineReactive 方法为对象增加响应式数据，然后执行 dep.notify 进行依赖通知，更新视图
   - 为数组添加一个新的响应式数据，通过 splice 方法实现
   - Vue.set 的别名

2. vm.$delete(obj, key)

   用于删除对象上的属性，如果对象是响应式的， 且能确保能触发视图更新

   - 避开 Vue 不能检测属性被删除的情况
   - 删除数组指定下标的元素，内部通过 splice 方法来完成
   - 删除对象上的指定属性，则是先通过 delete 运算符删除该属性，然后执行 dep.notify 进行依赖通知， 更新视图

3. vm.$watch(expOrFn, callback, [options])

   负责观察 Vue 实例上的一个表达式或者一个函数计算结果的变化

   - 当其发生变化时，回调函数就会被执行，并为回调函数传递两个参数，第一个为更新后的新值，第二个为老值
   - 如果观察的是一个对象，比如数组，当用数组方法，比如 push 为数组新增一个元素时，回调函数被触发时传递的新值和老值相同，因为他们指向同一个引用，所以在观察一个对象并且在回调函数中有新老值是否相等的判断时需要注意
   - vm.$watch 的第一个参数只接收简单的响应式数据的键路径，对于更复杂的表达式建议使用函数作为第一个参数
   - vm.$watch 的内部原理
     - 设置 options.user = true， 标志是一个用户 watcher
     - 实例化一个 Watcher 实例，当检测到数据更新时，通过 watcher 去触发回调函数的执行，并传递新老值作为回调函数的参数
     - 返回一个 unwatch 函数， 用于取消观察

4. vm.$on(event, callback)

   - 监听当前实例上的自定义事件， 事件可由 vm.$emit 触发，回调函数会接收所有传入事件触发函数(vm.$emit)的额外参数
   - 处理传递的 event 和 callback 两个参数，将注册的事件和回调函数以键值对的形式存储到 vm.\_event 对象中，vm.\_events = {eventName: [cb1, cb2, ...],...}

5. vm.$emit(eventName, [...args])

   - 触发当前实例上的指定事件，附加参数都会传递给事件的回调函数
   - 其内部原理就是执行 vm.events[eventName]中所有的回调函数

6. vm.$off(event, callback)

   移除自定义事件监听器， 即移除 vm.\_events 对象上相关数据

   - 如果没有提供参数， 则移除实例上的所有事件监听
   - 如果只提供了 event 参数，则移除实例上该事件的所有监听器
   - 如果两个参数都提供了， 则移除了实例上该事件对应的监听器

7. vm.$once(event, callback)

   监听一个自定义事件，但是该事件只会被触发一次，一旦触发以后监控器就会被移除

   - 包装用户传递的回调函数，当包装函数执行的时候，除了会执行用户回调函数之外还会执行，vm.$off(event, 包装函数)
   - 用 vm.$on(event, 包装函数)注册事件

8. vm.\_update(vnode, hydrating)

   用于源码内部的实例方法，负责更新页面，是页面渲染的入口

   - 其内部根据是否存在 preVNode 来决定是否首次渲染， 还是页面更新，从而调用\_patch\_\_函数时传递不同的参数

9. vm.$forceUpdate()

   迫使 Vue 实例重新渲染， 它仅仅影响组件实例本身和插入插槽内容的子组件，而不是所有子组件

   - 直接调用 vm.\_watcher.update()， 执行该方法触发组件更新

10. vm.$destroy()

    负责完全销毁一个实例。清理他与其他实例的连接，解绑它的全部指令和事件监听器。在执行过程中会调用 beforeDestroy 和 destroy 两个钩子函数

    - 调用 beforeDestroy 钩子函数
    - 将自己从父组件($parent)移除，从而销毁与父组件的关系
    - 通过 watcher.teardown 来移除依赖监听
    - 通过 vm.\_\_patch\_\_(vnode, null) 方法销毁节点
    - 调用 destroy 钩子函数
    - 通过 vm.$off 方法移除所有的事件监听

11. vm.\_render

    用于源码内部的实例方法，负责生成 vnode

    关键代码就一行，执行 render 函数生成 vnode, 不过其中加了大量的异常处理代码

## Hook Event

1. 定义

   Vue 自定义事件结合生命周期钩子实现的一种从组件外部为组件注入额外的生命周期方法的功能

2. 实现

- 处理组件自定义事件的时候(vm.$on)，如果发现组件有 hook:xx 格式的事件(xx 为 Vue 的生命周期函数)，则将 vm.\_hasHookEvent 设置为 true， 表示该组件有 HookEvent
- 在组件生命周期方法被触发的时候，内部会通过 callHook 方法来执行这些生命周期函数，在生命周期函数被执行之后，如果发现 vm.\_hasHookEvent 为 true，则表示当前组件有 Hook Event，通过 vm.$emit('hook:xx')触发 HookEvent 的执行

## 编译器

### 解析

将 html 代码转换为 AST 对象

#### 编译流程

1. [入口](src/platforms/web/entry-runtime-with-compiler.js)

   - 找到入口的方法

     - 断点调试，初始化最后一步是执行$mount 进行挂载，在全量的 Vue 包中这一步就会进入编译
     - 通过 rollup 的配置文件中一步步找

   - 源码分析

     - 判断配置选项中有无 render 函数
       - 有 render 函数直接跳过编译阶段，直接运行 mount 挂载
       - 无 render 函数 判断有无 template 模板字符串
         - 有 template 模板字符串，如果是 id 选择器，获取该元素的 innerHTML 作为模板，如果是正常的元素，获取 innerHTML 作为模板
         - 无 template 模板字符串，获取 el 选项，用 el 选择器的 outerHTML 作为模板
     - 进入编译阶段

       - 通过 compileToFunction 获取 render 动态渲染函数 和 staticRenderFns 静态渲染函数
       - 将这两个函数设置到 options 中

     - 执行挂载

   - 重点

     - 获取渲染函数的优先级

       - render(存在， 直接跳过编译阶段，运行 mount 挂载) > template(解析 template, 转换为 render 函数) > el (解析， 转换为 render 函数)

2. [compileToFunction](src/platforms/web/compiler/index.js)

   通过 createCompiler 函数向外暴露 compile, compileToFunctions 这两个方法

3. [createCompiler](src/compiler/index.js)

   通过 createCompilerCreator 处理 核心编译函数 baseCompile 暴露 ast 抽象语法树对象， render 函数和 staticRenderFns 函数

4. [createCompilerCreator](src/compiler/create-compiler.js)

   返回 createCompiler 编译函数 返回的 compile 函数和 createCompileToFunctionFn 处理过的 compileToFunctions 函数

   - 合并选项， 将传入的 options 选项合并到 finalOptions(baseOptions)中，得到最终的编译配置对象
   - 调用核心编译器 baseCompile 得到编译结果
   - 将编译期间产生的 error 和 tip 挂载到编译结果上返回编译结果

5. [createCompileToFunctionFn](src/compiler/to-function.js)

   返回编译结果，并进行缓存，再次编译时在缓存中获取

   - 执行编译函数，得到编译结果 => compiled
   - 处理编译期间产生的 error 和 tip， 分别输出到控制台
   - 将编译得到字符串代码通过 new Function(codeStr)转换成可执行函数，得到 render 函数和 staticRenderFns 静态渲染函数
   - 缓存编译结果

#### 编译核心

1. 核心函数 (baseCompile)[src/compiler/index.js]

   在运行 baseCompile 函数之前做的所有事情，都是为了构造最终的配置选项

   - 解析： 通过 parse 函数获取 ast 对象

     - 将模板解析成 AST, 每个节点的 ast 对象上设置了元素的所有信息，比如标签信息，属性信息， 插槽信息，父节点，子节点
     - 具有有那些属性，查看 start 和 end 这两个处理开始和结束标签的方法

   - 优化： 通过 optimize 函数遍历 ast，进行静态标记

     - 标记每个节点是否为静态节点，然后进一步标记静态根节点
     - 这样在后续更新中就可以跳过这些静态节点
     - 标记静态根节点，用于生成渲染函数阶段，生成静态根节点的渲染函数

   - 代码生成： 通过 generate 函数将 ast 转换为 render 函数的字符串形式
     - 从 ast 生成渲染函数，生成比如 `code.render = "_c('div',{attrs:{"id":"app"}},_l((arr),function(item){return _c('div',{key:item},[_v(_s(item))])}),0)"`

2. (parse)[src/compiler/parse/index]

   将 HTML 字符串编译成 AST 对象

   - 通过 parseHTML 解析 HTML 字符串，处理所有标签以及标签上的属性

     - start 函数，处理开始标签
       - 通过函数 createASTElement 创建 ast 对象
       - 通过 preTransforms 函数，处理存在的 v-model 指令的 input 标签， 分别处理为 input 为 checkbox、radio、其他情况
       - 处理标签上的众多指令， 比如 v-pre(当 inVPre 为 true)，v-for，v-if，v-once
         - v-for 的优先级比 v-if 高
       - 如果根节点 root 不存在则设置当前元素为根节点
       - 如果当前元素为非自闭合标签则将自己 push 到 stack 数组中， 并记录 currentParent， 在接下来处理子元素时用来告诉自己子元素自己的父节点是谁
       - 如果当前元素为自闭合标签，则表示该标签要处理结束，让自己和父元素产生关系，已经设置子元素，通过 closeElement 函数处理 ast 对象
     - end 函数，处理结束标签
       - 获取开始标签对应的结束标签(栈顶)
       - closeElement 函数处理结束标签
     - chars 函数， 处理文本

       - 异常处理(文本不能作为组件的根元素，放在根元素之外的文本会被忽略)
       - 对 text 文本进行处理，(删除空格符， 压缩空格符)
       - 基于 text 生成 ast 对象

         - 存在表达式(界定符)
           - parseText 函数处理表达式
             - 判断是否存在指令
             - 遍历整个 text， 当匹配不到界定符标记的时候跳出循环
             - 将匹配到字符串指令前面的字符串 push 到 tokens 中
             - 将过滤器转换成 vue 虚拟 dom 的解析方法函数， 然后把指令转义成函数 push 到 tokens 中， 绑定指令转换成{"@binding": exp}push 到 rawTokens 中
             - 最后处理最后一个字符串
         - 纯文本节点
           - 设置`child = { type:3, text } `

       - 将 child push 到当前父元素 children 属性中

     - comment 函数，处理注释内容
       - 设置 `child = { type:3, text, isComment: true }`
       - 将注释内容 push 到当前父元素的 children 属性中

### 优化

1. 通过函数`optimize`对编译完的 AST 对象进行静态标记

   - 遍历 AST，为每个节点做静态标记，标记其是否为静态节点，然后进一步标记出静态根节点，这样在后续更新的过程中就可以跳过这些静态节点了；标记静态根用于生成渲染函数阶段，生成静态根节点的渲染函数

2. 编译流程

   - 获取静态 key， 比如 staticStyle， staticClass
   - 设置平台保留标签
   - 标记静态节点
     - 遍历所有子节点，递归调用 markStatic 函数来标记这些子节点的 static 属性
     - 当遍历到子节点是动态节点，则将父节点更新为非静态节点
     - 如果节点本身是静态节点，但是存在非静态子节点，则将节点修改为非静态节点
     - 如果节点存在 v-if、v-else-if、v-else 这些指令，则依次标记 block 中节点的 static
   - 进一步标记静态根节点
     - 如果节点是静态的或者节点上有 v-once 指令，进来标记当前节点是否被 v-for 指令所在的节点包裹
     - 如果节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根节点
     - 如果节点本身不是静态根节点，递归遍历其子节点，在子节点中标记静态根节点
     - 如果节点存在 v-if、v-else-if、v-else 指令，则为 block 节点标记静态根

3. 静态节点的定义

   - 文本节点
   - 存在 v-pre 指令
   - 节点上没有 v-bind，v-if，v-for 等指令
   - 非组件

### 渲染函数

1.  函数`generate` 代码生成，将 AST 转换成可执行的 render 函数的字符串形式

        ```js
          code = {
            render: `with(this){return ${_c(tag, data, children, normalizationType)}}`,
            staticRenderFns: [_c(tag, data, children, normalizationType), ...]
          };
        ```

2.  渲染函数的生成过程

    - 编译器生成的渲染函数有两种
      - 第一类就是 render 函数， 负责生成动态节点的 VNode
      - 第二类就是放在 staticRenderFns 数组中的静态渲染函数，这些函数负责生成静态节点的 VNode
    - 渲染函数生成的过程，其实就是在遍历 AST 节点，通过递归的方式，处理每个节点，最后生成比如`_c(tag, attr, children, normalizationType)`的结果
      - tag 是标签，attr 是属性对象，children 是子节点组成的数组，其中每个元素的格式都是`_c(tag, attr, children, normalizationType)`的形式， normalization 表示节点的规范化类型， 是一个数字 0、1、2，不重要。

3.  静态节点是怎么处理的
    静态节点的处理分为两步

    - 将生成静态节点 VNode 函数放到 staticRenderFns 数组中
    - 返回一个`_m(idx)`的可执行函数，意思是执行 staticRenderFns 数组中下标为 idx 的函数，生成静态节点的 vnode

4.  v-once、 v-if、 v-for、组件等都是怎么处理的

    - 单纯的 v-once 节点处理方式和静态节点一致
    - v-if 节点的处理结果是一个三元表达式
    - v-for 节点的处理结果是可执行的\_l 函数， 该函数负责生成 v-for 节点的 vnode
    - 组件的处理结果和普通元素一样，得到的是形如`_c(compName)`的可执行代码， 生成组件的 VNode

5.  `with`语句可以扩展作用域链， 所以生成的代码中`_c、_l、_v、_s`都是 this 上一些方法， 也就是说在运行时执行这些方法可以生成各个节点的 VNode

## render helper

在 Vue 实例上挂载一些运行时的工具方法，这些方法用在编译器生成的渲染函数中，用于生成组件的 VNode

1. 渲染函数生成 VNode 是通过其中的`_c、_l、_v、_s`等方法实现的
   调用渲染工具函数的入口在`src/core/instance/render-helpers/index.js`的`installRenderHelpers`方法
   定义这些运行时的工具方法的文件文件位置`src/core/instance/render-helpers/index.js`

   - `_c`: 负责生成组件或者 HTML 元素的 VNode，执行的是`createElement`(src/core/vdom/create-element.js)方法， `_c`是所有 render-helper 方法中最复杂，也是是核心的一个部分，其他方法都是他的组成部分

     - 接受标签，属性 JSON 字符串 ，子节点数组，节点规范化类型为参数
     - 异常处理
       - 属性不能为响应式对象或者标签不存在， 返回空节点
       - key 只能是字符串或者数字
     - 将子元素进行标准化处理
     - 生成 VNode

       - 如果标签是平台保留标签，或者未知元素，则直接 new VNode 得到 vnode
       - 如果标签是是一个组件，则执行`createComponent`方法去生成 VNode

         - 进行子组件选项合并，合并全局配置到组件配置上
         - 处理组件的 v-model 指令
           - 将 v-model 的信息转换为 data.attrs 对象属性、值，data.on 对象上的事件、回调
         - 处理组件的 props，提取组件的 props 数据，以组件的 props 配置中的属性为 key，父组件中对应的数据为 value 生成一个 propsData 对象，当组件更新时生成新的 VNode，又会进行这一步，这就是 props 响应式的原理

         - 判断函数式组件
           - 如果显示提供 props 对象，遍历 props 配置，从 propsData 对象中获取指定属性的值
           - 如果隐性提供 props 对象，则将组件上的所有 a……tribute 自动解析为 props
           - 实例化函数式组件的渲染上下文
           - 调用 render 函数生成 vnode 并给 render 函数传入`_c`和渲染上下文
           - 标记函数式组件
         - 处理其他数据，比如获取事件监听器对象
         - 普通组件
           - 在 data 属性上设置 hook 对象，安装了一些内置钩子，组件 patch 阶段会用到这些钩子方法
             钩子函数分别为`init, prepatch、insert、destroy`
             - init:
               - 如果是被 keep- alive 组件包裹的组件， 触发更新比较
               - 如果是非 keep-alive 组件包裹或者子组件初始化，
                 - 调用`createComponentInstanceForVnode`得到 vue 组件实例
                 - 执行组件的$mount 方法，进入挂载阶段，通过编译得到 render 函数，然后编译，patch，最后渲染到页面
             - prepatch:
               - 更新 VNode，用新的 VNode 配置更新旧的 VNode 上的各种配置
             - insert:
               - 如果组件未挂载，执行 mounted 进行挂载
             - destroy:
               - 销毁组件
                 - 被 keep-alive 包裹，负责让组件失活，但不销毁组件，从而缓存组件
                 - 不被 keep-alive 包裹，直接调用$destroy 钩子销毁组件
           - 实例化组件的 VNode

   - `_l`, 运行时渲染 v-for 指令的帮助函数，其执行的函数是`renderList(src/core/instance/render-helpers/render-list)`
     - 当 val 为数组或者字符串时
       - 定义一个 val 长度的新数组，循环遍历 val 值，依次为每一项执行 render 方法生成 VNode，最终返回一个 VNode 数组
     - 当 val 为数字时
       - 定义一个长度为 val 的新数组，循环遍历 val 值，依次为每一项执行 render 方法生成 VNode，最终返回一个 VNode 数组
     - 当 val 为可迭代对象时
       - 获取 val 的迭代器，以及当前迭代器的结果
       - 循环当前迭代器的结果， 结束循环的条件为结果的 done 属性为 false，将每次迭代器结果的 value push 到结果数组中，最后返回 VNode 数组
     - 当 val 是普通对象时
       - 获取每个对象的 key 数组
       - 创建一个可以 key 数组长度的数组
       - 循环遍历 key 数组，依次为每一项执行 render 方法生成 VNode，最终返回一个 VNode 数组
   - `_m`, 运行时负责生成静态树的 VNode，其执行的函数是`renderStatic(src/core/instance/render-helpers/render-static)`
     - 读取缓存中的 静态节点的 VNode 数组
     - 根据传入的下标，获取缓冲里的结果，如果有缓冲且没有被包裹在 v-for 指令所在的节点内部，直接返回缓冲结果
     - 没有缓冲结果，则执行 staticRenderFns 数组中指定元素(静态树的渲染函数)生成该静态树的 VNode，并缓存
     - 调用 markStatic 函数为静态树的 VNode 进行标记，即添加`{ isStatic: true, key:`\_\_static\_\_${index}`, isOnce: false }`

2. 一个组件生成 VNode 的过程
   - 组件实例初始化，最后执行$mount 进入挂载阶段
   - 如果是只包含运行时的 vue.js，只直接进入挂载阶段，因为这时候的组件以及变成了渲染函数，编译过程通过模块打包器 + vue-loader + vue-template-compiler 完成
   - 如果没有使用预编译，则必须使用全量的 vue.js
   - 挂载时如果发现组件配置项上没有 render 选项， 则进入编译阶段
   - 将模板字符串编译成 AST 语法树，其实就是一个普通的 JS 对象
   - 然后优化 AST 语法树， 遍历 AST 对象，标记每一个节点是否为静态节点； 然后再进一步标记出静态根节点，在组件后续更新时会跳过这些静态节点的更新，以提高性能
   - 将 AST 生成渲染函数， 生成的渲染函数有两部分组成
     - 负责生成动态节点 VNode 的 render 函数
     - 负责生成静态节点的 staticRenderFns 数组，里面每个元素都是一个生成静态节点 VNode 的函数，这些函数会作为 render 函数的组成部分
   - 将渲染函数放到组件的配置对象上，进入挂载阶段，即执行 mountComponent 方法
   - 最终负责渲染组件和更新组件的是一个叫 updateComponent 方法，该方法每次执行前首先需要执行 vm.\_render 函数，该函数负责执行编译器生成的 render， 得到组件的 VNode
   - 将一个组件生成的 VNode 的具体工作是由 render 函数中的`_m,_c,_l,_o`等方法完成的，这些方法都被挂载到 Vue 实例上，负责在运行时生成组件 VNode

## patch

### 使用 VNode 和 diff 算法的原因

在 1.x 版本的时候， Vue 是没有 VNode 和 Diff 算法的，那个版本的核心只有响应式原理`Object.defineProperty、 Dep、 Watcher`，在这个版本中，watcher 与 dom 是一一对应的，watcher 可以很明确的知道这个 key 在组件模版中的位置， 因此可以做到定向更新，所以他的更新效率是非常高的，但是无法完成一个企业级的应用，因为页面在足够复杂时，就会包含很多组件，在这种架构下就意味着一个页面会产生大量的 watcher， 这非常耗性能

所以在 2.x 版本中，引入 VNode 和 diff 算法的概念起解决 1.x 版本的问题，将 watcher 的粒度放大，变成一个组件一个 watcher(渲染 watcher)这时候页面再大，watcher 也很少，这就解决了 watcher 太多导致性能下降的问题

通过引入 VNode，当组件中数据更新时，会为组件生成一个新的 VNode，通过比对这新老两个 VNode， 找出不一样的地方，然后执行 DOM 操作更新发生变化的节点，这就是 diff 过程

### 为什么使用虚拟 DOM

概念： 一个用来描述真实 DOM 的 Javascript 对象

原因:

1.  MVVM 框架解决视图和状态同步问题
2.  虚拟 DOM 可以跟踪状态变化
    - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
    - 通过比较前后两次状态差异更新真实 DOM
3.  跨平台使用
    - 浏览器平台渲染 DOM
    - 服务端渲染 SSR(Nuxt/Next)
    - 原生应用(Weex/React Native)
    - 小程序(mpvue/uni-app)
4.  真实 DOM 的属性很多，创建 DOM 节点开销很大，虚拟 DOM 只是普通的 Javascript 对象，描述属性并不需要太多，创建开销很小
5.  复杂视图情况下提升渲染性能(操作 DOM 性能消耗大，减少操作 DOM 的范围可以提升性能)，因为虚拟 DOM + Diff 算法可以精准找到 DOM 树变更的地方，减少 DOM 的操作（重排重绘）

### 入口

文件位置 `src/core/instance/lifecycle`

`updateComponent()`方法，调用`vm._update`方法， 内部执行`vm._render`函数，得到 VNode,并将 VNode 传递给\_update 方法，接下来就进行 patch 阶段

### vm.\_update

页面首次渲染和后续更新的入口位置，也是 patch 的入口位置

通过判断 prevNode 存不存在，决定走首次渲染还是更新页面

### patch

文件位置 `src/core/vdom/patch`

1. 如果新节点不存在， 老节点存在，则调用 destroy 销毁老节点
2. 如果新 VNode 存在，老 VNode 不存在， 这种情况出现在一个组件初次渲染的时候出现，此时调用 createElm 创建组件
3. 判断老节点是否是真实元素
   - 如果不是真实元素且新老节点是同一节点，则是更新阶段，执行 patch 更新节点
   - 如果是真实元素，则表示是初次渲染
     - 获取老节点的真实元素，以及老节点的父元素，即 body
     - 调用 createElm 方法，基于新 VNode 创建整棵 DOM 并插入到 body 元素下

### 同一节点的定义

在`sameVnode`函数中判断

1. 两个节点的 key 必须相同
2. 两个节点的标签必须相同
3. 两个节点的注释节点必须相同
4. 两个节点都要有 data 属性
5. 两个都是 input 标签时要满足 type 也相同

简而言之就是 key 相同且选择器也相同的就是视为同一节点

### patchVNode

1. 全量更新新节点的属性， 循环遍历，调用各个组件的钩子 update 函数
2. 如果新老节点都有 children 属性，则进行递归 diff
3. 如果老节点没有 children 属性，新节点有 children 属性则创建这些 children 属性的节点
4. 如果老节点有 children 属性， 新节点没有 children 属性，则移除这些老节点的 children 节点
5. 如果老节点是文本节点，则将文本内容置空
6. 如果新节点是文本节点且不与老节点文本文本内容相同，则更新文本节点

### undateChildren

比较新老节点的 children 属性，这里就是 diff 过程

### diff 算法

概念： diff 是发生在虚拟 DOM 上的，新虚拟 DOM 和老虚拟 DOM 进行 diff(精细化比较)，算出应该如何最小量更新，最后反映到真正的 DOM 上。

原理： 1. key 很重要，key 是这个节点的唯一标识，告诉 diff 算法，在更改前后它们是同一个 DOM 节点 2. 只有是同一个虚拟节点，才进行精细化比较，否则就是暴力删除旧的，插入新的。3. 只进行同层比较，不会进行跨层比较。 即使是同一个虚拟节点，但是跨层了，就不进行精细化比较，而是暴力删除旧的，然后插入新的

diff 过程

1. 判断 oldVNode 是虚拟节点还是真实节点
   - 若为真实节点，要包装为虚拟节点
2. 如果 oldVNode 和 newVNode 选择器以及 key 不相同则代表不是同一个节点，删除旧的，插入新的
3. 如果 oldVNode 和 newVNode 是同一节点且是同一个对象就什么也不做
4. 不是同一个对象，就判断 newVNode 有没有 text 属性，则是不是带文本内容
   - 若 newVNode 存在文本内容且与 oldVNode 不相同，删除 oldVNode.elm 的 innerText，改为 newVNode 的的 text 属性(即使 oldVNode 存在 children 属性，以一并删除)
5. 不存在文本内容，则意味 newVNode 有 children 属性， 判断 oldVNode 有没有 children 属性
   - oldVNode 没有 children 属性，清空 oldVNode 中的 text，并且把 newVNode 的 children 添加到 DOM 中
   - oldVNode 和 newVNode 都有存在 children 属性
     - 首先进行四种命中查找
       - 新前与旧前
       - 新后与旧后
       - 新后与旧前(此时需要移动节点，将新前指向的节点移动到旧后之后)
       - 新前与旧后(此时需要移动节点，将新前指向的节点移动到旧前之前)
     - 如果四种命中查找都没有找到，那么通过遍历找到新前节点在老节点中为位置索引
       - 若在老节点中没有找到新开始节点，则说明是新创建的元素，执行创建
       - 在老节点找到新开始节点
         - 如果这两个节点是同一个，则执行 patch，patch 结束后将老节点置为 undefined
         - 如果不是同一个节点，则视为新元素，执行创建
     - 循环结束后
       - 新节点存在剩余节点，说明新节点中有要插入的节点，执行插入
       - 旧节点存在剩余节点，说明旧节点中有要被删除的节点，执行删除

### key 的作用

1. diff 操作可以更加快速
2. diff 操作可以更加准确(避免渲染失误)

### 不用 index 作为 key

别用 index 作为 key，和没写基本上没区别，因为不管你数组的顺序怎么颠倒，index 都是 0, 1, 2 这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。
