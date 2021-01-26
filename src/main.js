import './scss/main.scss'
import 'leaflet/dist/leaflet.css';

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'

// Leaflet JS icon fix
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


Vue.config.productionTip = false
Vue.use(BootstrapVue)

<<<<<<< HEAD
=======
//Add the script tag to head here, so can use API env variable
>>>>>>> e607269... more resetting
let hscript = document.createElement("script");
hscript.setAttribute("src", `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_API}&libraries=places`);
document.head.appendChild(hscript);

<<<<<<< HEAD
=======

>>>>>>> e607269... more resetting
new Vue({
  render: h => h(App),
}).$mount('#app')
