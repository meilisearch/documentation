import CodeSamples from './components/codeSamples'

export default function (ctx) {
  const { Vue } = ctx
  Vue.component('code-samples', CodeSamples)
}
