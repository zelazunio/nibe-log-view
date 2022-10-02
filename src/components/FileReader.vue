<template>
  <div>
    <div>Choose file:</div>
    <label class="text-reader" id="fileReader">
      <input type="file" @change="readFile" />
    </label>
  </div>
</template>
<script>
export default {
  name: "FileReader",
  methods: {
    readFile(e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => this.$emit("load", e.target.result);
      reader.readAsText(file);
    },
  },
};
</script>
<style scoped>

</style>
