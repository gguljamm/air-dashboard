<template>
  <div>
    <Header></Header>
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
  import Header from '~/components/Header.vue';

  export default {
    components: {
      Header,
    },
  };
</script>

<style>
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  ul, li{
    padding: 0;
    margin: 0;
    list-style: none;
  }

  input::placeholder {
    color: #ddd !important;
  }
  .container {
    max-width: 1230px;
    padding-top: 96px;
    margin: 0 auto;
    min-height: 100vh;
    padding-bottom: 100px;
  }
</style>
