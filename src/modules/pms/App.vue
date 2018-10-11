<template>
  <div id="app">
    <h1>PMS</h1>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  components: {
    Header
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
</style>