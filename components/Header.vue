<template>
  <b-navbar toggleable="lg" type="dark" variant="info" style="position:fixed; top: 0; left: 0; width: 100%; z-index: 5">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <div style="max-width: 1230px; margin: 0 auto; width: 100%;">
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#" :class="{ active: $route.path === '/' }" @click="$router.push('/')">실시간 대시보드</b-nav-item>
          <b-nav-item href="#" :class="{ active: $route.path === '/SavedDataDashboard' }" @click="$router.push('/SavedDataDashboard')">저장된 데이터 대시보드</b-nav-item>
          <b-nav-item href="#" :class="{ active: $route.path === '/RealTimeDetailData' }" @click="$router.push('/RealTimeDetailData')">실시간 상세 데이터</b-nav-item>
          <b-nav-item href="#" :class="{ active: $route.path === '/SavedDetailData' }" @click="$router.push('/SavedDetailData')">저장된 상세 데이터</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" :class="{ active: $route.path === '/Setting' }" @click="$router.push('/Setting')">기본설정</b-nav-item>
          <b-nav-item href="#" :class="{ active: $route.path === '/History' }" @click="$router.push('/History')">수집이력</b-nav-item>
          <b-nav-item href="#" :class="{ active: $route.path === '/HistorySetting' }" @click="$router.push('/HistorySetting')">수집설정</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
  export default {

  };
</script>
<style>

</style>
