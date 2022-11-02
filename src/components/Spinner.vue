<template>
  <div v-if="show" class="spinner">
    <div>Working...</div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    show: { type: Boolean, required: true },
  },
};
</script>

<style scoped>
.spinner {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 202;
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