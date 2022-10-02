<template>
  <div style="width: 100%; height: 100%; background-color: gray">
    <canvas id="canvas" />
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
export default {
  name: "BarChart",
  props: { chartData: {type: Object} },
  data() {
    return{ 
      chart: null,
    }
  },
  mounted() {
//    const labels = ["January", "February", "March", "April", "May", "June"];
//    const data = {
//      labels: labels,
//      datasets: this.datasets,
//    };

    const config = {
      type: "line",
      data: ()=>(this.chartData),
      options: {},
    };
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById("canvas"), config);
  },
  watch: {
    chartData: {
      handler:  function() {console.log('ping'); this.chart.update()},
      deep: true
      }
  }
};
</script>
