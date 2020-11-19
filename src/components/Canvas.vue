<template>
  <canvas ref="workingCanvas" class="zdog-canvas"
  :width="width"
  :height="height"
  :style="{'background':background}"></canvas>
</template>

<script>
//import {ref, onMounted} from 'vue' // onUpdated, onUnmounted
//import { mapState} from 'vuex'// mapActions 

//import {Zdogger} from '../zdogrigger'

export default {
  
  name: 'Canvas',
  props: {
  },
  setup(){
  },
  methods:{
  },
  computed:{
    // ...mapState([
    //   'illustration',
    // ]),
    width(){
      return window.innerWidth;
    },
    height(){
      return window.innerHeight;
    },
  },
  data(){
    return{
      background:'#d9d9d9'
    }
  }
}
</script>

<style scoped>
.zdog-canvas{
  position:absolute;
  top:0;
  left:0;
  border:1px dotted blue;
  width:100%;
  height:100%;
  z-index:0;
}
</style>
