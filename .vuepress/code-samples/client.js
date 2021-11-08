import CodeSamples from './components/codeSamples'
import Vuex from 'vuex'
import store from './store'

export default function (ctx) {
  const { Vue } = ctx
  Vue.use(Vuex)
  Vue.mixin({ store: store })
  Vue.component('CodeSamples', CodeSamples)
}
