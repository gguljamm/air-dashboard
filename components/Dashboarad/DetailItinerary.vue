<template>
  <div class="itineraryWrapper" :style="{
    left: `${position.left}px`,
    top: `${position.top + windowScrollY}px`,
  }">
    <div>
      <div class="header">
        최저가 상세 데이터<br>
        {{ selectedItinerary[0].agentPriceOptionList.find(z => filter[z.category]).name }}
        <b-button @click="$emit('close')"><b-icon-x font-scale="2" style="color: #FFF"></b-icon-x></b-button>
      </div>
      <ul class="tbody">
        <div class="thead">
          <div>항공사</div>
          <div>출국스케줄</div>
          <div>귀국스케줄</div>
          <div>노출가격</div>
        </div>
        <li v-for="x in selectedItinerary">
          <div>
            <div v-for="y in getAirlineList([x.outboundLegData, x.inboundLegData])">
              {{ y }}
            </div>
          </div>
          <div>
            {{ x.outboundLegData.departureDateTime.split('T')[1].substr(0, 5) }}<br>
            {{ x.outboundLegData.arrivalDateTime.split('T')[1].substr(0, 5) }}<br>
            {{ x.outboundLegData.flightNumbers.map(z => z.replace(' ', '')).join('/') }}
          </div>
          <div>
            {{ x.inboundLegData.departureDateTime.split('T')[1].substr(0, 5) }}<br>
            {{ x.inboundLegData.arrivalDateTime.split('T')[1].substr(0, 5) }}<br>
            {{ x.inboundLegData.flightNumbers.map(z => z.replace(' ', '')).join('/') }}
          </div>
          <div>{{ $format.numberFormat(x.agentPriceOptionList.find(z => filter[z.category]).price) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // id: 288
  // code: "EY"
  // name: "에티하드항공"
  // imageUrl: "https://s1.apideeplink.com/images/airlines/60.png"
  // displayCode: "EY"
  export default {
    data() {
      return {
        windowScrollY: 0,
      }
    },
    props: ['selectedItinerary', 'position', 'carriers', 'filter'],
    methods: {
      getAirlineList(legs) {
        const arr = [];
        for (let x = 0; x < legs.length; x += 1) {
          const text = legs[x].carriers.join('/');
          if (arr.indexOf(text) === -1) {
            arr.push(text);
          }
        }
        return arr;
      },
    },
    mounted() {
      console.log(this.selectedItinerary);
      this.windowScrollY = window.scrollY;
      // console.log(this.selectedItinerary);
    },
  };
</script>

<style lang="scss">
  .itineraryWrapper{
    position: absolute;
    width: 500px;
    height: 400px;
    z-index: 10;
    margin-top: -411px;
    margin-left: -28px;
    box-shadow: 0 0 4px 2px rgba(0,0,0,.1);
    border-radius: 8px;
    > div{
      overflow: hidden;
      border-radius: 8px;
      background-color: #FFF;
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      font-size: 13px;
      .header{
        font-size: 14px;
        padding-top: 9px;
        width: 100%;
        height: 50px;
        background-color: #999;
        line-height: 16px;
        padding-left: 20px;
        color: #FFF;
        position: relative;
        button{
          padding: 0;
          color: #FFF;
          position: absolute;
          top: 5px;
          right: 0;
          width: 40px;
          height: 40px;
          background-color: transparent;
          border: none;
        }
      }
      .tbody{
        .thead{
          display: flex;
          height: 22px;
          position: sticky;
          line-height: 21px;
          border-bottom: 1px solid #eee;
          text-align: center;
          top: 0;
          left: 0;
          width: 100%;
          background-color: #FFF;
          > div{
            flex: 0 0 25%;
          }
        }
        position: absolute;
        left: 0;
        right: 0;
        top: 50px;
        bottom: 0;
        overflow-y: auto;
        > li{
          display: table;
          border-bottom: 1px dashed #eee;
          padding: 4px 0;
          width: 100%;
          > div{
            word-break: break-all;
            display: table-cell;
            width: 25%;
            text-align: center;
            vertical-align: middle;
          }
        }
      }
    }
    &:after{
      content: '';
      box-shadow: 0 0 4px 2px rgba(0,0,0,.1);
      position: absolute;
      left: 240px;
      bottom: -11px;
      z-index: 0;
      width: 21px;
      height: 21px;
      transform: rotate(45deg);
      background-color: #FFF;
    }
  }
</style>
