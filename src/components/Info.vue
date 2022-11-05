<template>
  <div class="overlay">
    <div class="infoContainer">
      <div class="closeButton" @click="$emit('close')">
        <template>X</template>
      </div>
      <h2>Nibe log viewer</h2>
      <p>Simple app to view logs from Nibe heat pumps.</p>
      <p>So far tested on F1226, if your logs are not loading and you want to contribute to this tool please send your log file to <a href="mailto:ja_zel@wp.pl">my mail</a> </p>
      <p>Source is available on <a href="https://github.com/zelazunio/nibe-log-view" target="_blank">Github</a>.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Info",
};
</script>

<style>
.overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.infoContainer {
  padding: 5%;
  background-color: #aaaaaa;
  color: white;
  height: 50%;
  width: 50%;
  border: 3px solid black;
  border-radius: 10px;
  position: relative;
}

.closeButton {
  position: absolute;
  cursor: pointer;
  right: 30px;
  top: 20px;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 15px !important;
  border-radius: 60px;
  transition: all 500ms;
  transition-delay: 300ms;
  animation: closeButtonAnimation 6s infinite ease-in-out;
}

.closeButton:hover {
  background-color: rgba(255, 255, 255, 0.7);
  color: rgba(0, 0, 0, 0.9);
  transition: all 500ms;
  -webkit-animation: none !important;
  -moz-animation: none !important;
  -o-animation: none !important;
  -ms-animation: none !important;
  animation: none !important;
}

@keyframes closeButtonAnimation {
  0% {
    background-color: black;
    color: white;
  }
  30% {
    background-color: black;
    color: white;
  }
  50% {
    background-color: rgba(70, 70, 70, 0.9);
    color: rgba(185, 185, 185, 0.9);
  }
  70% {
    background-color: black;
    color: white;
  }
  100% {
    background-color: black;
    color: white;
  }
}
</style>