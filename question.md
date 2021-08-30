### 说说你对 SPA 单页面的理解，它的优缺点分别是什么？

1. 仅在 Web 页面初始化是加载相应的 HTML、JavaScript、Css。 一旦页面加载完成，SPA 不会因为用户对操作而进行页面的重新加载或者跳转；取而代之是利用路由机制实现 HTML 内容的变化，UI 与用户的交互，避免页面的重新加载
2. 优点
   - 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染
   - 基于上面一点，SPA 相对于服务器压力小
   - 前后端指责分离，架构清晰，前端进行交互逻辑，后端负责数据处理
3. 缺点
   - 首次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、css 统一加载，部分页面按需加载
   - 前进后退路由管理：由于单页面应用在一个页面要显示所有内容，所以不能使用浏览器的前进后退功能，所有页面切换需要自己建立堆栈管理
   - SEO 难度较大，由于所有内容都在一个页面中动态替换显示的，所以在 SEO 有天然的弱势

### Vue 的优点？Vue 的缺点？

优点：

1. 渐进式
2. 组件化
3. 轻量级
4. 虚拟 DOM
5. 数据响应式
6. 数据与视图分离

缺点：

1. 单页面应用不利于 SEO
2. 不兼容 IE8(Object.defineProperty)
3. 首屏加载慢

### 为什么说 Vue 是一个渐进式框架？

一开始不需要你完全掌握它的全部功能特性，可以后续逐步增加功能。没有多做职责之外的事情

通俗点讲就是，你想用啥你就用啥，咱也不强求你。你想用 component 就用，不用也行，你想用 vuex 就用，不用也可以

### Vue 跟 React 的异同点？

相同点

1. 都使用了虚拟 DOM
2. 组件化开发
3. 都是单向数据流(父子组件之间，子组件不建议直接修改父组件的数据)
4. 都支持服务端渲染: Next(React)/Nuxt(Vue)

不同点

1. React 是 JSX，Vue 是 template
2. 数据变化方面，React 是侵入式，需要调用 API(setState)来修改数据，Vue 是非侵入式，直接修改数据即可(内部做了响应式处理，进行了数据拦截)
3. React 是单向绑定， Vue 是双向数据绑定

### MVVM 是什么？和 MVC 有何区别呢？

1. MVC

   M 表示 model，指负责后端数据库取数据
   V 表示 view，指负责将数据展示的地方
   C 表示 controller, 指用户交互的地方，例如用户点击事件等
   思想： controller 负责将 model 的数据展示到 view 视图上

2. MVVM

   VM 表示 view-model，负责两件事

   - 将模型(model)转换成视图(view)，即将后端传过来的数据转换成视图，实现方式是数据双向绑定
   - 将视图(view)转换成模型(model)，即将展示的页面转换为后端数据，实现方式是事件监听

   思想： MVVM 实现了视图与模型的同步改变，也就是说当 model 改变的时候， 不在需要手动操作 DOM 来改变 view 的显示， 而是改变属性后该属性绑定的 view 层显示就会自动改变(对应 Vue 数据驱动的思想)

两者的区别

MVVM 比 MVC 精简多了， 不仅简化了业务与界面的依赖， 而且减少了数据频繁访问的问题，不再使用选择器操作 DOM 来修改视图

因为在 MVVM 中，view 不知道 model 的存在， model 和 view-model 也观察不到 view， 这种低耦合度模式提高了代码的可重用性

Vue 并没有完成遵循 MVVM 的思想，在官方文档中也有提及

严格的 MVVM 要求 view 不能直接与 model 直接通信，而 vue 提供$refs 这个属性，让 model 可以直接操作 view

### 为什么 data 是个函数并且返回一个对象呢？

从源码层面上分析，在 initData 函数中，会进行配置项 options.data 是函数还是对象的判断
是函数就会执行，是对象就会直接赋值给 vue 实例上的 data 属性，所以在组件中建议将 data 写成一个函数，将数据以函数返回值定义，这样每一次复用组件时，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让每个组件去维护各自的数据，而如果写成对象的形式，就使得所有组件实例共用一份 data，就会造成组件的变量污染

### 组件之间的传值方式有哪些？

1. 父组件向子组件传值，子组件通过`props`属性进行接收
2. 子组件通过 `emit`属性 + 事件触发向父组件传值
3. 组件实例中通过`$parent`属性获取父组件实例，通过`$children`属性获取子组件实例，从而获取数据
4. 通过`$refs`属性获取组件实例获取数据
5. 通过`$attrs`和`$listener`属性对组件二次封装时可以方便传值
6. 通过`vuex`状态管理器， 维护全局状态
7. 使用`eventBus`中央事件总线， 跨组件触发事件，传递数据
8. 使用`provide`、 `inject`，在父组件使用`provide`进行数据注入，在子孙组件中使用`inject`获取数据
9. 使用`localStorage`数据本地缓存

### 怎样理解 Vue 的单向数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的值，只能请求父组件对原始数据进行修改

这样防止从子组件意外改变父组件的状态，从而导致应用的数据流向难以理解

如果是在要改变父组件的 props 值， 可以在 data 里面定义一个变量， 并用 props 去初始化它， 之后用$emit 通知父组件去修改

### vue-router 的模式

1. hash 模式

   通过修改#号后面的内容，触发`hashChange`事件，实现路由切换

2. history 模式

   通过`pushState`或者`replaceState`事件切换 url，触发`popState`事件，实现路由切换

   因为单页面应用下只有 index 的 html 文件，所以后端如果不进行配合处理的话，会出现 404 的情况

### v-show / v-if

1. v-show

v-show 通过 修改 dom 元素的 display 属性来控制元素的显示与隐藏，元素不会销毁

2.  v-if

内部编译过程中有一个三元表达式来控制当前指令所在的节点是否渲染，所以每次元素的显示与隐藏都会跑一遍生命周期，来控制组件的生成与销毁

使用场景： 频繁或者大数量显隐使用`v-show`,否则使用`v-if`

### computed / watch / methods

1.  computed

    本质是一个 watcher,，存在`lazy`属性，默认该 watcher 是懒执行切不可更改的，表示需要依赖其他属性计算值，只有在模板读取它的值才会执行计算返回内容

    - 实现数据缓存的原理

      通过判断 watcher.dirty 属性来决定是返回缓冲值还是读取最新值

      在初始化的时候会赋值 dirty 属性为 true
      当 dirty 为 true 时，会调用 watcher.evaluate 方法重新求值得到 watcher.value， 在将 dirty 设置为 false
      当 dirty 为 false 时， 表示 watcher 的响应式依赖没有更新，就直接读取 watcher.value

    - 可以设置 setter 和 getter， 内部判断传入参数是函数还是对象， 函数就直接设置 getter， 对象进 getter、setter 赋值

2.  watch

    watch 可以监听到值的变化然后执行回调，在回调中可以进行一些逻辑操作

    适用于观测某个值的变化然后进行一些异步操作或者开销较大的操作

    可配置选项：

    - immediate 是否立即执行一次回调函数
    - handle 回调函数
    - deep 深度监听对象中的属性

3.  methods

    在一次渲染中，有多个地方是使用同一个 methods 属性，methods 就会被执行多次

    每次视图更新时都会重新执行函数，性能销毁比较大

    使用封装一些较为复杂的处理逻辑

### Vue 的初始化过程

1. 处理了组件的配置项

   - 初始化跟组件时进行选项合并操作，将全局配置合并到根组件的局部配置上
   - 初始化每个子组件时做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项上， 以提高代码的执行效率

2. 初始化了组件实例的关系属性，如`$parent`、`$children`、`$root`、`$refs`等
3. 处理了自定义事件
4. 初始化了 render 函数的渲染函数
5. 调用`beforeCreate`钩子函数
6. 初始化了组件的 inject 配置项，得到 result[key] = val 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例中
7. 数据响应式处理，初始化 props、data、methods、computed、watch
8. 解析组件配置项上的 provide 对象，将其挂载到 vm.provided 属性上
9. 调用`create`钩子函数
10. 判断配置上是否有 el 选项，有就自动调用`$mount`方法，没有则要手动调用`$mount`方法
11. 进入挂载阶段

### 生命周期

内部是在某一个阶段处理完成后，调用 `callHook`方法，执行生命周期钩子函数

1. `beforeCreate`

   实例 Vue 但是还没进行数据的初始化与响应式处理

2. `create`

   数据完成初始化和响应式处理，在这里可以访问到数据以及修改数据

3. `beforeMount`

   render 函数在这里被调用，生成虚拟 DOM，但是还没转成真实 DOM 并替换 el

4. `mounted`

   真实 DOM 挂载完毕

5. `beforeUpdate`

   数据更新后，新的虚拟 DOM 生成，但还没有跟虚拟 DOM 对比打补丁

   在更新组件`mountComponent`函数中的 Watcher 的回调中执行

6. `update`

   新旧虚拟 DOM 对比打补丁后，进行真实 DOM 的更新

   在 Vue 刷新异步队列的时候执行

7. `beforeDestroy`

   实例销毁之前调用，在这一步，依然可以访问数据

8. `destroy`

   实例销毁后调用，该钩子调用后，对应 Vue 实例的所有指令都会被解绑，所有事件监听器会被移除，所有子组件实例也都被销毁

9. `activated`

   被 keep-alive 缓存的组件被激活时调用

10. `deactivated`

    被 keep-alive 缓存的组件停用时调用

### Vue 的父子组件生命周期钩子函数执行顺序

1. 加载渲染过程

   父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

2. 子组件更新过程

   父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

3. 父组件更新过程

   父 beforeUpdate -> 父 updated

4. 销毁过程

   父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

### 使用异步更新的原因

vue2.x 中使用了虚拟 DOM 进行渲染，侦测数据变化的通知只会发送到组件，组件内所有数据的变化都会通知同一个 watcher，然后虚拟 DOM 会对整个虚拟 DOM 进行 diff 并修改 DOM，也就是说，若组件内有多个数据发生改变，组件的 watcher 就会收到多份通知，从而进行多次渲染，但事实上虚拟 DOM 会对整个组件进行渲染，所以只需要等所有数据全部修改完毕后，一次性对整个组件的 DOM 渲染到最新即可

### 异步更新的实现方式

将收到通知 watcher 实例添加到队列中缓存起来，并且在添加队列之前检查其中是否存在相同的 watcher，只要不存在才将 watcher 实例添加到队列中，然后在同一轮事件循环中，Vue 会将队列中 watcher 触发渲染流程并清空队列
这样就可以保证即使在同一事件循环中有两个状态发生改变，watcher 最后也执行一次渲染

### 异步更新的流程

1. Vue 的异步更新机制的核心是利用浏览器异步任务队列，优先使用微任务队列(Promise, MutationObserver), 宏任务次之(setImmediate, setTimeout)
2. 当响应式数据更新完成后，调用 dep.notify()去通知 dep 收集到的所有 watcher 去执行 update 方法，watcher.update 方法将 watcher 放入 watcher 队列中(全局 queue 数组)
3. 通过执行 nextTick 函数将刷新 watcher 队列的函数(flushScheduleQueue)放入全局 callbacks 数组中
4. 如果当前浏览器微任务队列中不存在 flushCallbacks 函数，执行 timerFunc 函数将 flushCallbacks 函数放入微任务队列中
5. 如果微任务队列中存在 flushCallbacks 函数，则等待其执行完成后放入下一个 flushCallbacks 函数
6. flushCallbacks 函数负责执行 callbacks 数组中所有的 flushScheduleQueue 函数
7. flushScheduleQueue 函数负责刷新 watcher 队列，即执行 queue 数组中每一项 watcher 的 run 方法，从而进入 patch 阶段，比如执行组件更新函数或者用户 watcher 的回调函数

### nextTick 的实现方式

1. 将传递的回调函数用 try/catch 包装后放入 callbacks 数组中
2. 执行 timerFunc 方法，在浏览器异步任务队列中放入一个刷新 callbacks 数组的方法

### nextTick 的使用场景

当更新状态后，需要对新 DOM 做一些操作，但是这时候时获取不到更新后的 DOM，因为还没有重新渲染，此时就需要使用 nextTick 方法

### 为什么 v-if 和 v-for 不建议用在同一标签？

在底层编译过程中，v-for 指令的优先级比 v-if 高

### 不需要响应式的数据应该怎么处理？

1. 可以将不需要进行响应式处理的数据放在 data 之外
2. 可以使用 Object.freeze()对数据进行冻结

### 对象新属性无法更新视图，删除属性无法更新视图，为什么？怎么办？

1. 这属于 vue2.x 使用 Object.defineProperty()的缺陷

对于对象来说，Object.defineProperty 是没有对对象新属性进行属性劫持的，因为在进行初始化时，对数据进行遍历的时候用的是初始 data 上已经存在的 key

对于数组来说，因为考虑性能的原因，没有使用 Object.defineProperty 对数组的每一项进行拦截，所以是通过重写数组方法来进行数组响应式监听，所以直接通过索引来修改数组的值是无法被监听的

2. Vue 提供了对象与数组无法响应式更新的解决方法

- 使用 vm.$set 方法

  处理 target 是数组的情况

  先设置 length 属性， 然后调用数组 splice 方法新增数组，同时发出数组拦截器，对新增数据进行监听

  处理 target 时对象的情况

  先获取 target.\_\_ob\_\_, 在判断是否为 vue 实例获取根实例，不是响应式数据修改完直接返回，是响应式数据调用 defineReactive 将新属性转换为 getter/setter，最后通知视图更新

- 使用 vm.$delete 方法

  处理 target 是数组的情况

  调用数组的 splice 方法删除数据，同时触发数组拦截器，监听修改后的数组

  处理 target 是对象的情况

  先获取 target.\_\_ob\_\_
  判断是否为 vue 实例或者根数据，是就直接返回
  判断是不是 target 自身属性，不是就直接返回
  不是响应式数据删除完后直接返回
  是就通知更新视图

### Vue 的 SSR 是什么？有什么好处？

1. SSR 就是服务器渲染
2. 基于 nodejs serve 服务环境进行开发，所有的 html 代码都在服务端渲染
3. 数据返回给前端，然后前端进行"激活"， 即可成为浏览器识别的 html 代码
4. SSR 的首次加载很快，有更好的用户体验，更好的 SEO 优化，因为爬虫能看到整个页面的内容，如果是 vue 项目，由于数据还有经过解析，这就造成爬虫并不会等待你的数据加载完成，所以 vue 项目的 SEO 体验并不好

### 谈谈你对 keep-alive 的了解？

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态， 避免重复渲染，

1. 特性：

   - 一般结合路由和动态组件一起使用，用于缓存组件
   - 提供 include 和 exclude 属性，两者都支持字符串和正则表达式，include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存，其中 exclude 有优先级比 include 高
   - 对应两个钩子函数 activated 和 deactivated，当组件被激活时，调用钩子函数 activated，当组件被移除时，触发钩子函数 deactivated

2. 实现原理

   - 通过 this.$slot.default 拿到插槽组件， 也就说 keep-alive 包裹的组件

   - `getFirstComponentChild`获取第一个子组件，获取该组件的 name(存在组件名则直接组件名， 否则会使用 tag)

   - 将这个 name 通过 include 与 exclude 属性进行配对，匹配不成功(说明不需要进行缓存)则不进行任何操作直接返回 VNode(VNode 节点描述对象，vue 通过 VNode 创建真实 DOM)

   - 匹配到就开始缓存，根据 key 在 this.cache 中查找，如果存在则说明之前已经缓存过了，直接将缓存的 VNode 的 componentInstance(组件实例)覆盖到目前的 VNode 上面。否则将 VNode 存储在 cache 中并且通过 remove(keys, key)将当前的 key 从 keys 中删除在重新 keys.push(key),这样就改变了当前 key 在 keys 中的位置，这个是为了实现 max 的功能并且缓存淘汰策略

   - 如果没有匹配到，说明没有缓存过，这是需要进行缓存，并且判断当前缓存的个数是否超过了 max 指定的个数，如果超过，则销毁 keys 里最后一个组件，并从 keys 中移除，这个就是 LRU(缓存淘汰算法)

   - 最后返回 VNode 或者默认插槽的第一个组件进行 DOM 渲染

3. LRU 的核心思想

   如果数据最近被访问过，那么将来被访问的几率也更高，所以我们将命中缓存的组件 key 重新插入 this.keys 的尾部，这样一来，this.keys 中越往头部的数据即将被访问的几率越低， 所以当缓存数量达到最大值时，我们就删除将来被访问最低的数据，即 this.keys 中第一个缓存的组件

### 响应式原理

首先要搞清楚什么时候是响应式，在 vue 中所说的响应式是指数据响应式，数据变化可以被检测并对这种变化做出响应的机制

而在 Vue 这种 MVVM 框架中，最重要的核心就是实现 model 层和 view 层的连接，通过数据驱动应用，数据变化，视图更新

vue 中的方案是数据劫持 + 观察者模式

vue 在初始化的时候会对数据进行劫持，包括 props、data、methods、 computed、 watcher, 并根据数据类型来做不同的处理

- 如果是对象就采用 Object.defineProperty()的方式来定义数据劫持

  核心函数是`defineReactive`, 对象通过 Object.defineProperty 将属性转换为 getter/setter 的形式来追踪变化，读取数据的时候就触发 getter， 修改数据的时候就触发 setter

  在 getter 中收集有哪些依赖使用了数据， 当 setter 被触发时，去通知 getter 中收集的依赖数据发生了变化

  总结就是在 getter 中进行依赖收集， 在 setter 中派发更新

- 如果是数组就通过创建拦截器去覆盖数组的 7 个变更方法的方式去追踪变化

  数组收集依赖的方式和 object 一样，都是在 getter 中收集，在拦截器中向依赖发送消息，将依赖保存在 Observer 实例上

  在 Observer 判断当前被侦测的数据是数组的话，就调用 observeArray 方法将数组中每一个元素都转换成响应式并侦测变化

  如果使用 push、 unshift、 splice 操作数组的方法，则从参数中将新增的数据提取出来，然后使用 observeArray 方法对新增的数据进行变化侦测

视图更新的机制

- 由于 Vue 执行一个组件的 render 函数是由 Watcher 去代理执行的，Watcher 在执行前会把 Watcher 自身先赋值给 Dep.target 这个全局变量，等待响应式属性去收集它。
- 在组件执行 render 函数时访问了响应式属性，响应式属性就会精确的收集到当前全局存在的 Dep.target 作为自身的依赖。

- 在响应式属性发生更新时通知 Watcher 去重新调用 vm.\_update(vm.\_render())进行组件的视图更新，视图更新的时候会通过 diff 算法对比新老 vnode 差异，通过 patch 即时更新 DOM。

### 双向数据绑定的原理

Vue 的双向数据绑定是指数据变化视图更新，视图变化数据更新

即当输入框内容变化时，data 中的数据同步变化， data 中的数据变化时，文本节点的内容同步发生变化

其中 view 变化更新 data 可以通过事件监听来实现

所以 vue 的数据双向绑定原理的工作主要是如何根据 data 变化来更新 view

vue 主要通过以下四个步骤来实现数据双向绑定

1. 实现了一个监听器 Observer: 对对象与数组进行了不同的处理

   - 关于对象，对对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty()对属性都加上了 getter/setter,这样的话读取这个对象的某个属性的时候， 就进行依赖收集， 给这个对象的某个属性赋值的收获就进行派发更新

   - 关于数组，对数组的七个变更方法进行来重写，创建一个数组拦截器，对使用七个方法操作数组的时候，进行数据监听

2. 实现了一个解析器 Compile: 解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新

3. 实现了一个订阅者 Watcher： Watcher 订阅者是 Observer 和 Compile 之间的通信的桥梁，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时， 触发解析其 Compile 中对应的更新函数

4. 实现了一个订阅器 Dep: 订阅器采用了发布订阅的设计模式，用来收集订阅者 Watcher，对监听器 Observer 和订阅者进行统一管理

### Vue 有哪些全局方法

1. Vue.use

负责 Vue 安装插件

内部实现流程：

- 判断插件是否被安装，如果已经被安装则直接结束

- 判断 plugin 是对象还是函数

  - 如果是对象就执行对象里的 install 方法安装插件
  - 如果是函数就直接调用 plugin 方法安装插件

- 将安装好的插件添加到插件列表中

2. Vue.mixin

负责在 Vue 的全局配置上合并 options 配置，然后在每个组件生成 VNode 的时候将全局配置合并到自身的配置上

核心是 mergeOptions

- 标准化 options 上的 props、inject、directive 属性
- 分别处理 mixin、 extend，然后将他们合并到全局配置上
- 合并组件 options 和全局 options，若发生冲突，则组件 options 覆盖全局 options

3. Vue.extend

基于 Vue 创建一个子类，给子类同样支持进一步扩展的能力，通过 Vue.extend 去扩展子类，一大用处就是内置了一些公共配置，可以供子类的子类使用

实现流程

- 定义 Vue 子类，创建子类的构造函数，并执行 Vue 的\_init 函数
- 设置子类原型对象
- 进行选项合并，合并 Vue 的配置项到自己的配置项上来，如果出现选项冲突，则 options 的选项配置会覆盖全局的配置项
- 给子类定义全局的 API， 值为 Vue 的全局 API，这样子类同样可以扩展其他子类
- 最终返回子类

4. Vue.components

负责注册全局组件，将组件配置注册到全局配置的 component 选项上，然后在每个组件的 VNode 生成时会将全局的 components 选项合并到局部的 components 配置项上

实现流程：

- 如果第二个参数为空，则表示获取 compName 的组件构造函数

- 如果 Comp 是组件配置对象，则使用 Vue。extend 方法得到组件构造函数，否则直接进行下一步

- 在全局配置上设置组件信息， this.options.components.compName = CompConstructor

5. Vue.filter

负责在全局注册过滤器，然后每个子组件在生成 VNode 时将全局的 filters 选项合并到局部的 filters 选项中

实现流程：

- 如果没有提供第二个参数， 则获取第一个参数过滤器的回调函数
- 如果提供了第二个参数，则设置 this.options.filters[第一个参数名] = functions(val)

6. Vue.directive('my-directive',{xx})

负责在全局注册 my-directive 指令，然后在每个组件生成 VNode 的时候将全局的 directives 选项合并到局部的 directives 选项中

- 如果第二个参数为空，则获取指定指令的配置对象
- 如果不为空且是一个函数的话，则生成配置对象{ bind: 第二个参数， update: 第二个参数 }
- 然后将指令配置对象设置到全局配置上， this.options.directives['my-directive'] = { xx }

7. Vue.nextTick(cb)

延迟回调函数 cb 的执行，一般用于响应式数据更新时，想立即获取更改后的 DOM 数据

- 触发依赖通知更新时，将负责更新的 watcher 队列放入 watchers 队列
- 将刷新 watcher 队列的函数放到 callbacks 数组中
- 在浏览器的异步任务中放入一个刷新 callbacks 数组的方法
- Vue.nextTick(cb)，将 cb 函数插入到 callbacks 数组中
- 待将来某个时刻执行刷新 callbacks 数组的函数
- 然后执行 callbacks 数组中众多的函数，触发 watcher.run， 更新 DOM
- 由于 cb 函数是在后面放到 callbacks 数组，所以这就保证了先完成的 DOM 更新，在执行 cb 函数

### vue 有哪些实例方法

1.  vm.$set

2.  vm.$delete

3.  vm.$watch

    作用： 负责观察 Vue 实例上的一个表达式或者一个函数计算结果的变化

    当前发生变化时，回调函数就会被执行，并为回调函数传递两个参数，第一个为更新后的新值，第二个为老值

    如果观察的是一个对象，比如数组，当用数组方法,例如 push 为数组新增一个元素时， 回调函数被触发是传递的新值和老值相同，因为他们指向同一个引用，所以在观察一个对象并且在回调函数中有新老值是否相等的判断时需要注意

    vm.$watch 的第一个参数只接收简单的响应式数据的键路径，对于更复杂的表达式建议使用函数作为第一个参数

    内部原理：

        - 设置 options.user = true，表示当前是一个用户watcher
        - 实例化Watcher实例，当检测到数据更新时，通过watcher去触发回调函数的执行，并传递新老值作为回调函数的参数
        - 返回一个unwatch函数，用于取消观察

4.  vm.$on

    监听当前实例上的自定义事件，事件可由 vm.$emit 触发，回调函数会接收所有传入事件触发函数(vm.$emit)的额外参数

    处理传递的 event 和 callback 两个参数，将注册的事件和回调函数以键值对的形式存储到 vm.\_event 对象中，vm.\_event ={ eventName: [cb1, cb2, ...] }

5.  vm.$emit

    触发当前实例上的指定事件，附加参数都会传递给事件的回调函数

    其内部原理就是执行了 vm.\_event[eventName]中所有的回调函数

6.  vm.$off

    移除自定义事件监听器，即移除 vm.\_events 对象上相关数据

    如果没有提供参数，则移除实例上所有事件监听器

    如果只提供了 event 参数，则移除实例上该事件的所有监听器

    如果两个参数都提供了， 则移除了实例上该事件对应的监听器

7.  vm.$once

    监听一个自定义事件，但是该事件只会被触发一次，一旦触发以后监听器就会被移除

    包装用户传递的回调函数， 当包装函数执行的时候，除了会执行用户回调函数以外还会执行 vm.$off（(event, 包装函数)

    用 vm.$on(event, 包装函数)注册事件

8.  vm.$update()

    用于源码内部的实例方法，负责更新页面，是页面渲染的入口

    实现原理：

    根据是否存在 preVNode 来决定是否首次渲染还是页面更新，从而调用**patch**函数传递不同的参数

9.  vm.$forceUpdate()

    强制 Vue 实例重新渲染，它仅仅影响组件实例本身和插入插槽内部内容的子组件，而不是所有子组件

    实现原理：

    直接调用 vm.\_watcher.update()， 执行该方法触发组件更新

10. vm.$destroy()

    负责完成销毁一个实例，清除他与其他实例的连接，解绑他的全部指令和事件监听，在执行过程中会调用 beforeDestroy 和 destroy 两个钩子函数

    实现原理：

    调用 beforeDestroy 钩子函数
    将自己从父组件($parent)移除， 从而销毁与父组件的关系
    通过 watcher.teardown 来移除依赖监听
    通过 vm.**patch**(vnode, null)方法销毁节点
    调用 destroy 钩子函数
    通过vm.$off 方法移除所有事件监听

11. vm.\_render

    用于源码内部的实例方法，负责生成 vnode

    关键代码就一行，执行 render 函数生成 vnode, 不过其中加了大量的异常处理代码

### Hook Event

1. 定义

   Vue 的自定义事件结合生命周期钩子实现的一种从组件外部向组件注入额外生命周期方法的功能

2. 实现

   - 处理组件自定义事件的时候(vm.$on)，如果发现组件有 hook:xx 格式的事件(xx 为 Vue 的生命周期函数)，则将 vm.\_hasHookEvent 设置为 true，表示该组件有 HookEvent

   - 在组件生命周期方法被触发的时候， 内部会通过 callHook 方法执行这些生命周期函数，在生命周期函数被执行之后，如果发现 vm.\_hasHookEvent 为 true，则表示当前组件有 HookEvent，通过 vm.$emit('hook:xx')触发 HookEvent 的执行

### 自定义指令

指令本质上是装饰器， 是 vue 对 HTML 元素的扩展，给 HTML 元素添加自定义功能

vue 编译 DOM 时，会找到指令对象， 执行指令相关的方法

五个生命周期

1. bind: 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化配置
2. inserted: 被绑定元素插入到父节点是调用
3. update: 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前，可用通过钩子参数中比较更新前后的值来忽略不必要的目标更新
4. componentUpdated: 指令所在组件的 VNode 及其子 VNode 全部更新后调用
5. unbind: 只调用一次，指令与元素解绑时调用

原理

1. 在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性
2. 通过 genDirectives 生成指令代码
3. 在 patch 前将指令的钩子提取到 cbs 中， 在 patch 过程中去调用相应的钩子
4. 当执行指令对应钩子函数时， 调用对应指令定义的方法

### Vue 的性能优化

1. 编译阶段

- 尽量减少 data 中的数据，data 中的数据都会增加 getter/setter， 会收集对应的 watcher
- data 中的对象层级不要过深， 因为 vue2.x 中多层对象是通过递归来实现劫持
- 对于不需要进行响应式处理的数据，可以把数据定义在 data 之外，或者使用 Object.freeze()来冻结数据
- v-if 与 v-for 不要一起使用
- 合理使用 keep-alive 缓存组件
- 使用 v-for 时，一定要使用 key， 并且保证 key 唯一
- 使用路由懒加载、异步组件

  懒加载简单来说就是延迟加载或按需加载，即在需要的时候的时候进行加载。

- 防抖、节流
- 第三方模块按需引入
- 长列表滚动可视区域动态加载
- 组件合理拆分
- 图片懒加载

2. SEO 优化

- 预渲染

  定义： 构建阶段生成匹配预渲染路径的 html 文件（注意：每个需要预渲染的路由都有一个对应的 html）。构建出来的 html 文件已有部分内容

  实现方式： prerender-spa-plugin 是一个 webpack 插件用于在单页应用中预渲染静态 html 内容。

  prerender-spa-plugin 原理： webpack 构建阶段的最后，在本地启动一个 phantomjs，访问配置了预渲染的路由，再将 phantomjs 中渲染的页面输出到 html 文件中，并建立路由对应的目录。

- 服务端渲染 SSR

3. 打包优化

- 压缩代码

- Tree Shaking

一种通过消除最终文件中未使用的代码来优化体积的方法。

- 使用 cdn 加载第三方模块

- 多线程打包 happypack

  将文件解析任务分解成多个子进程并发执行。子进程处理完任务后再将结果发送给主进程。所以可以大大提升 Webpack 的项目构件速度

- splitChunks 抽离公共文件

  Webpack 中一个提取或分离代码的插件，主要作用是提取公共代码，防止代码被重复打包，拆分过大的 js 文件，合并零散的 js 文件。

- sourceMap 优化

4. 用户体验

- 骨架屏
- PWA

5. 缓存

- 客户端缓存
- 服务端缓存
- 服务端开启 gzip 压缩

### Vue 的事件绑定原理

1. 原生 DOM 的绑定

   Vue 在创建真实 DOM 时会调用 createElm， 默认会调用 invokeCreateHooks， 然后遍历当前平台下相对应的属性处理代码， 其中负责事件对象处理函数 updateDOMListeners, 内部会传入 add 方法，使用 addEventListeners 给原生 DOM 添加事件

2. 组件绑定事件

   组件绑定事件是通过 Vue 自定义的$on 方法实现的

### Vue 的模板编译原理，如何从真实 DOM 到虚拟 DOM

1. 首先进行解析， `parse`函数将 html 代码转换成 AST 对象

2. 对编译完的 AST 对象进行优化，通过函数`optimize`对 AST 进行静态标记

   - 标记每个节点是否为静态节点，然后进一步标记静态跟节点
   - 后续更新中就可以跳过这些静态节点
   - 标记静态根节点，用于生成渲染函数阶段，生成静态根节点的渲染函数

3. 通过`generate`函数将 AST 对象转换为可执行的 render 函数的字符串形式

### 获取渲染函数的优先级

render(存在 render,直接跳过编译阶段,运行 mount 挂载) > template(解析 template,转换为 render 函数) > el(获取选择器 outerHTML， 转换为 render 函数)

### 详细说一说编译器的解析过程，它是怎么将 html 字符串模版变成 AST 对象的？

1. 遍历 HTML 模板字符串，通过正则匹配 <

2. 跳过某些不需要处理的标签，比如：注释标签、条件注释标签、Doctype。

3. 解析开始标签

   - 通过`createASTElement`函数创建 AST 对象，包括标签名(tagName), 所有属性(attrs), 标签在 html 模板字符串中的索引

   - 处理上一步得到的 attrs 属性，得到`[{name: attrName, value: attrValue, start: xx, end: xx}, ...]`的形式

   - 处理开始标签上的指令， 比如 v-pre, v-for, v-if, v-once, 并将处理结果放到 AST 对象上

   - 处理结束后将 AST 对象存放到 stack 数组中

   - 处理完成后截断 html 字符串，将已经处理掉的字符串截断

4. 解析闭合标签

   - 如果匹配到结束标签， 就从 stack 数组中拿出最后一个元素， 他和当前匹配到的结束标签是一对

   - 再次处理开始标签上的属性，这些属性和前面的处理的不一样， 比如 key, ref, scopedSlot, 样式等, 并将处理结果放到元素的 AST 对象上

   - 将当前元素和父元素产生联系，给当前元素的 AST 对象设置 parent 属性，然后将自己放到父元素的 AST 对象的 children 数组中

5. 最后遍历完整个 html 模板字符串以后，返回 AST 对象

### 静态节点的定义

1. 文本节点
2. 存在 v-pre 指令
3. 节点上没有 v-bind, v-if, v-for 等指令
4. 非组件

### 静态根节点的定义

1. 节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根
2. 静态根节点不能只有静态文本的子节点，因为这样收益太低，这种情况下始终更新它就好了

### 静态标记的过程

1. 标记静态节点

   - 遍历所有子节点，递归调用 markStatic 函数标记这些子节点
   - 如果节点本身是静态节点但是存在动态的子节点，则将节点修改为动态节点

2. 基于静态节点，进一步标记静态根节点

   - 如果节点本身是静态节点并且有子节点同时子节点不全是文本节点，则标记为静态根节点
   - 如果节点本身不是静态根节点，则递归遍历所有子节点，在子节点标记静态根节点

### 审查元素时发现 data-v-xxxxx，这是啥？

这是在标记 vue 文件中 css 时使用 scoped 标记产生的，因为要保证各文件中的 css 不相互影响，给每个 component 都做了唯一的标记，所以每引入一个 component 就会出现一个新的'data-v-xxx'标记

### Vue 生成渲染函数 with 语法的含义

1. with 语法的作用

   with 语句的原本用意是为逐级的对象访问提供命名空间式的速写方式. 也就是在指定的代码区域, 直接通过节点名称调用对象。

   with 通常被当做重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身。

   使用 with 语法可以帮助我们很好的简化代码

2. 使用 with 语句的弊端

   - 导致数据泄漏
   - 在严格模式下，with 被完全禁止，间接或非安全地使用 eval(…) 也被禁止了
   - 性能下降

3. 在 vue 中使用 with 的作用

   - 在 template 中可以不用写 this。直接使用当前 vue 实例中的属性或方法。
   - with 的作用域和模板的作用域正好契合，可以极大地简化模板编译过程。
   - 用 with 代码量可以很少，而且把作用域的处理交给 js 引擎来做也更可靠。

### 为什么使用虚拟 DOM

1. 虚拟 DOM 的定义： 一个用来描述真实 DOM 的 js 对象

2. 使用虚拟 DOM 的好处

   - 可以追踪状态变化

     - 维护程序的状态，跟踪上次的状态
     - 通过比较前后的两次状态的差异更新真实 DOM

   - 跨平台使用

     - 浏览器平台渲染 DOM
     - 服务端渲染 SSR
     - 原生应用
     - 小程序

   - 真实 DOM 的属性很多，创建 DOM 节点的开销很大，虚拟 DOM 只是普通的 js 对象，描述属性冰不要太多，创建的开销很小

   - 复杂视图情况下可以提升渲染性能(操作 DOM 性能消耗大，减少操作 DOM 的范围可以提升性能)，因为虚拟 DOM+Diff 算法可以精准找到 DOM 树更改的地方，减少 DOM 的操作(重排重绘)

3. 虚拟 DOM 的缺点

   无法进行极致优化： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

### v-model 的原理

我们在 vue 项目中主要使用 v-model 指令在表单 input、textarea、select 等元素上创建双向数据绑定，我们知道 v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；

- checkbox 和 radio 使用 checked 属性和 change 事件；

- select 字段将 value 作为 prop 并将 change 作为事件。
