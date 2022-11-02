<template>
  <div
    class="menuButton"
    :class="{ forVisibleMenu: menuVisible }"
    v-on="$listeners"
  >
    <template v-if="menuVisible">X</template>
    <template v-else>M</template>
  </div>
</template>

<script>
export default {
  name: "MenuButton",
  props: {
    menuVisible: { type: Boolean, required: true },
  },
};
</script>

<style>
.menuButton {
  position: absolute;
  cursor: pointer;
  left: 20px;
  top: 20px;
  font-size: 2rem;
  font-weight: bold;
  padding: 7px 15px;
  border-radius: 60px;
  transition: all 500ms;
  transition-delay: 300ms;
  animation: menuInactiveButtonAnimation 6s infinite ease-in-out;
  z-index: 201;
}

.menuButton:hover {
  background-color: rgba(255, 255, 255, 0.7);
  color: rgba(0, 0, 0, 0.9);
  transition: all 500ms;
  -webkit-animation: none !important;
  -moz-animation: none !important;
  -o-animation: none !important;
  -ms-animation: none !important;
  animation: none !important;
}

.forVisibleMenu {
  font-size: 1rem;
  top: 20px;
  left: calc(var(--menuWidth) - 60px);
  font-weight: bold;
  padding: 10px 15px !important;
  animation: menuActiveButtonAnimation 6s infinite ease-in-out;
}

@keyframes menuInactiveButtonAnimation {
  0% {
    background-color: rgba(70, 70, 70, 0.9);
    color: rgba(185, 185, 185, 0.9);
  }
  30% {
    background-color: rgba(70, 70, 70, 0.9);
    color: rgba(185, 185, 185, 0.9);
  }
  50% {
    background-color: black;
    color: white;
  }
  70% {
    background-color: rgba(70, 70, 70, 0.9);
    color: rgba(185, 185, 185, 0.9);
  }
  100% {
    background-color: rgba(70, 70, 70, 0.9);
    color: rgba(185, 185, 185, 0.9);
  }
}

@keyframes menuActiveButtonAnimation {
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