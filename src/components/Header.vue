<template>
  <div>
    <header>
      <ul>
        <li>
          <a href="pms.html">PMS</a>
        </li>
        <li>
          <a href="oms.html">OMS</a>
        </li>
      </ul>
    </header>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
li {
  list-style: none;
}
  header {
    width: 100%;
    height: 64px;
    background: rgb(52, 104, 218);
  }
  ul {
    overflow: hidden;
  }
  ul > li {
    padding: 0 15px;
    float: left;
    line-height: 64px;
  }
  ul > li > a {
    color: #fff;
  }
</style>