<template>
  <div id="app">
    <resize-sensor @resize="resize" />
    <div class="toolsContainer">
      <div class="column">
        <file-reader @load="loadData" />
        <div class="resolutionContainer">
          <div>Choose resolution:</div>
          <select name="resolution" id="resolution" v-model="resolutionSelector" @change="updateResolution" :disabled="!(columnsConfiguration.length > 0)">
            <option :value="constants.ONE_SECOND">1 s</option>
            <option :value="constants.FIVE_SECONDS">5 s</option>
            <option :value="constants.TEN_SECONDS">10 s</option>
            <option :value="constants.THIRTY_SECONDS">30 s</option>
            <option :value="constants.ONE_MINUTE">1 min</option>
            <option :value="constants.FIVE_MINUTES">5 min</option>
            <option :value="constants.TEN_MINUTES">10 min</option>
          </select>
        </div>
      </div>
      <div
        class="column"
        style="display: flex; flex-wrap: wrap; justify-content: flex-start"
        v-if="columnsConfiguration.length > 0"
      >
        <template v-for="(serie, index) in visibleSeries">
          <div v-if="index > 1" :key="index" class="checkboxContainer">
            <input
              type="checkbox"
              :id="`visibleSerie${index}`"
              v-model="visibleSeries[index]"
              v-if="index > 0"
            />
            <label :for="`visibleSerie${index}`" v-if="index > 0"
              >{{ columnsConfiguration[index].label }}
            </label>
          </div>
        </template>
      </div>
    </div>
    <div class="chartContainer">
      <div v-if="creatingData" class="spinner">
        <div>Working...</div>
      </div>
      <line-chart
        :series="series"
        :height="height"
        @chartUpdated="onChartUpdated"
      />
    </div>
  </div>
</template>

<script>
import FileReader from "./components/FileReader.vue";
import Column from "./classes/Column.js";
import DataPoint from "./classes/DataPoint";
import LineChart from "@/components/LineChart.vue";
import ResizeSensor from "vue-resize-sensor";
import constants from "@/const.js";

export default {
  name: "NibeLogView",
  components: {
    FileReader,
    LineChart,
    ResizeSensor,
  },
  data() {
    LineChart;
    return {
      sourceData: {},
      columnsConfiguration: [],
      columnsData: [],
      creatingData: false,
      chartData: {},
      width: 0,
      height: 0,
      resolution: constants.ONE_MINUTE,
      resolutionSelector: constants.ONE_MINUTE,
      visibleSeries: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
      ],
    };
  },
  computed: {
    constants() {
      return constants;
    },
    series() {
      let result = [];
      this.columnsConfiguration.forEach((column, index) => {
        if (this.visibleSeries[index])
          result.push({
            enabled: false,
            name: column.label,
            data: this.filteredData[index],
          });
        else result.push({ name: "", data: [] });
      });
      return result;
    },
    filteredData() {
      this.timeStart("filteringData");
      let result = [];
      if (this.columnsData.length > 0) {
        for (let i = 0; i < this.columnsData.length; i++) {
          let previousTime = 0;
          result.push(
            this.columnsData[i]
              .filter((entry) => {
                if (
                  new Date(entry.date).getTime() - previousTime >
                  this.resolution
                ) {
                  previousTime = entry.date;
                  return true;
                } else return false;
              })
              .map((entry) => entry.value)
          );
        }
      } else result = [];
      this.timeEnd("filteringData");
      return result;
    },
  },
  methods: {
    resize(size) {
      this.width = size.width;
      this.height = size.height;
    },
    onChartUpdated() {
      this.creatingData = false;
    },
    loadData(data) {
      this.prepareData(data);
    },

    prepareData(data) {
      this.creatingData = true;
      setTimeout(() => {
        this.timeStart("parsingCSV");
        let parsedData = this.$papa.parse(data).data;
        this.timeEnd("parsingCSV");
        this.timeStart("columnsConfiguration");
        this.createColumnsConfiguration(parsedData, this.columnsConfiguration);
        this.timeEnd("columnsConfiguration");
        this.timeStart("columnsData");
        this.columnsData = this.createData(parsedData);
        this.timeEnd("columnsData");
      }, 100);
    },
    createColumnsConfiguration(data, columnsConfiguration) {
      columnsConfiguration.length = 0;
      for (let i = 1; i < data[0].length; i++) {
        columnsConfiguration.push(new Column(data[1][i], data[0][i]));
      }
    },
    createData(data) {
      let newData = [];
      for (let line = 2; line < data.length; line++) {
        let newLine = [];
        newLine.push(new Date(data[line][0] + " " + data[line][1]));
        for (let cell = 2; cell < data[line].length; cell++) {
          newLine.push(data[line][cell]);
        }
        newData.push(newLine);
      }
      let columnsCount = newData[0].length;
      let result = Array.from({ length: columnsCount }, () => []);
      newData.forEach((dataLine) => {
        let date = new Date(dataLine[0]);
        dataLine.forEach((entry, entryIndex) => {
          if (entryIndex > 0) {
            result[entryIndex].push(
              new DataPoint(
                date,
                this.columnsConfiguration[entryIndex],
                dataLine[entryIndex]
              )
            );
          }
        });
      });
      return result;
    },
    timeStart(timerName) {
      if (process.env.NODE_ENV !== "development") return;
      console.time(timerName);
    },
    timeEnd(timerName) {
      if (process.env.NODE_ENV !== "development") return;
      console.timeEnd(timerName);
    },
    updateResolution() {
      this.creatingData = true;
      setTimeout(()=>{this.resolution = this.resolutionSelector}, 100)
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 10px;
  background-color: rgb(209, 217, 224);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.toolsContainer {
  display: flex;
}

.column {
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.resolutionContainer {
  margin-top: 8px;
}

.checkboxContainer {
  padding: 0.2em 1em;
}

.chartContainer {
  position: relative;
}

.spinner {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 10em;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spinnerAnimation 2s infinite ease-in-out;
}

@keyframes spinnerAnimation {
  0% {
    color: rgba(72, 61, 139, 1);
  }
  50% {
    color: rgba(72, 61, 139, 0);
  }
  100% {
    color: rgba(72, 61, 139, 1);
  }
}
</style>