<template>
  <div class="loadingWrapper">
    <div>
      <b-spinner label="Loading..." style="width: 40px; height: 40px;"></b-spinner>
      <h3>데이터 조회 중입니다.</h3>
      <div>잠시만 기다려 주세요.</div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  .loadingWrapper{
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    > div{
      background-color: #FFF;
      width: 500px;
      height: 300px;
      box-shadow: 0 0 4px 2px rgba(0,0,0,.2);
      left: 50%;
      margin-left: -250px;
      top: 50%;
      margin-top: -150px;
      padding: 60px 40px;
      text-align: center;
      position: absolute;
      > h3{
        padding: 20px 0 10px;
      }
    }
  }
</style>
