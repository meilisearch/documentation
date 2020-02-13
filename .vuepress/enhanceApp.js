
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

// async function is also supported, too
export default ({
  Vue, // the version of Vue being used in the VuePress app
}) => {
  Vue.use(Tooltip);
}
