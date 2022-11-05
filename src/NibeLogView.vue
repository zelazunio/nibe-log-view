<template>
  <div id="app">
    <resize-sensor @resize="resize" />
    <menu-button :menuVisible="menuVisible" @click="menuVisible=!menuVisible"/>
    <info v-if="infoVisible" @close="infoVisible=false"></info>
    <div class="menu" :class="{ menuOpen: menuVisible }">
      <div class="toolsContainer">
        <div class="column infoButtonContainer">
          <button class="infoButton" @click="infoVisible=true">
            INFO 
          </button>
        </div>
        <div class="column">
        <file-reader @load="loadData" />
        <resolution-selector :disabled="columnsConfiguration.length === 0" @change="updateResolution"/>
      </div>
      <div
        class="column"
        v-if="columnsConfiguration.length > 0"
        style="flex-grow: 1; overflow-y: auto"
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
    </div>
    <div class="chartContainer">
      <spinner :show="creatingData"/>
      <line-chart
        :series="series"
        :height="height"
        @chartUpdated="onChartUpdated"
        @click="manuVisible=false"
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
import MenuButton from './components/MenuButton.vue';
import Info from './components/Info.vue';
import Spinner from './components/Spinner.vue';
import ResolutionSelector from './components/ResolutionSelector.vue';

require("@/assets/css/menu.css");

export default {
  name: "NibeLogView",
  components: {
    FileReader,
    LineChart,
    ResizeSensor,
    MenuButton,
    Info,
    Spinner,
    ResolutionSelector,
  },
  data() {
    return {
      sourceData: {},
      columnsConfiguration: [],
      columnsData: [],
      creatingData: false,
      chartData: {},
      width: 0,
      height: 0,
      menuVisible: false,
      infoVisible: false,
      resolution: constants.ONE_MINUTE,
      constants: constants,
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
    updateResolution(resolution) {
      this.creatingData = true;
      setTimeout(() => {
        this.resolution = resolution;
      }, 100);
    },
  },
};
</script>

<style>
@media screen and (max-width: 369px) {
  :root {
    --menuWidth: 100%;
  }
}
@media screen and (min-width: 370px) and (max-width: 639px){
  :root {
    --menuWidth: 50%;
  }
}
@media screen and (min-width: 640px) {
  :root {  
  --menuWidth: 30%;
  }
}

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
  display: flex;
  overflow: hidden;
}
.toolsContainer {
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
}

.column {
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  flex-direction: column;
}

.checkboxContainer {
  padding: 0.2em 1em;
  margin: auto;
}

.chartContainer {
  position: relative;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

.infoButtonContainer {
  height: 60px; 
  display: flex; 
  align-items: flex-start; 
  justify-content: center;
}

.infoButton {
  padding: 5px 20px;
  font-weight: 500;
}
</style>