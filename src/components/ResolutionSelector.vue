<template>
  <div class="resolutionContainer">
    <div>Choose resolution:</div>
    <select
      name="resolution"
      id="resolution"
      v-model="resolutionSelector"
      @change="$emit('change', resolutionSelector)"
      :disabled="disabled"
    >
      <option :value="constants.ONE_SECOND">1 s</option>
      <option :value="constants.FIVE_SECONDS">5 s</option>
      <option :value="constants.TEN_SECONDS">10 s</option>
      <option :value="constants.THIRTY_SECONDS">30 s</option>
      <option :value="constants.ONE_MINUTE">1 min</option>
      <option :value="constants.FIVE_MINUTES">5 min</option>
      <option :value="constants.TEN_MINUTES">10 min</option>
    </select>
  </div>
</template>

<script>
import constants from "@/const.js";

export default {
  name: "ResolutionSelector",
  data() {
    return {
      resolutionSelector: constants.ONE_MINUTE,
      constants: constants,
    };
  },
  props: {
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.resolutionContainer {
  margin-top: 8px;
}
</style>