<template>
  <div>
    <apexchart
      :height="chartHeight"
      type="line"
      :options="options"
      :series="series"
      v-on="$listeners"
    ></apexchart>
  </div>
</template>

<script>
export default {
  name: "LineChart",
  data() {
    return {
      options: {
        chart: {
          id: "NibeLogView",
          selection: {
            enabled: true,
          },
          events: {
            updated: (/*chartContext, config */) =>{
              this.$emit("chartUpdated");
            },
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          labels: {
            rotate: -30,
            formatter: function (value) {
              let date = new Date(value);
              let dateString = `${("000" + date.getDate()).slice(-2)}-${(
                "000" + date.getMonth()
              ).slice(-2)}-${date.getFullYear()}`;
              let timeString = `${("000" + date.getHours()).slice(-2)}:${(
                "000" + date.getMinutes()
              ).slice(-2)}:${("000" + date.getSeconds()).slice(-2)}`;
              return `${dateString} ${timeString}`;
            },
          },
        },
      },
    };
  },
  computed: {
    chartHeight() {
      return Math.floor(this.height * 0.75);
    },
  },
  props: {
    series: { type: Array, required: true },
    height: { type: Number, default: 300 },
  },
};
</script>

<style>
</style>