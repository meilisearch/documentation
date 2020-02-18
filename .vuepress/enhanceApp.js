import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

export default ({
  Vue, // the version of Vue being used in the VuePress app
}) => {
  Vue.use(Tooltip);
}
