<template></template>
<script setup lang="ts">
import { onMounted } from "vue";
import TypeIt from "typeit";

onMounted(() => {
  new TypeIt(".tagline", {
    strings: [
      "开源软件指的是其源代码公开、可以自由使用、修改和分发的软件。",
      "与专有软件不同，开源软件没有版权限制，任何人都可以在遵循开源许可证的前提下进行改进或修改。",
    ],
    speed: 200,
  }).go();
});
</script>
