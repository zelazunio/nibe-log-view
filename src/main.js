import Vue from 'vue'
import NibeLogView from './NibeLogView.vue'
import VuePapaParse from 'vue-papa-parse';
import VueApexCharts from 'vue-apexcharts';

Vue.config.productionTip = false
Vue.use(VuePapaParse);
Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

new Vue({
  render: h => h(NibeLogView),
}).$mount('#app')
