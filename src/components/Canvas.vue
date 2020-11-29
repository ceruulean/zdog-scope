<template>
  <canvas ref="workingCanvas" class="zdog-canvas"
  :width="width"
  :height="height"
  :style="{backgroundColor:settings.backgroundColor}"
  @click="clickHandler"></canvas>
</template>

<script>
//import {ref, onMounted} from 'vue' // onUpdated, onUnmounted
import {mapState} from 'vuex'// mapGetters


//import {Zdogger} from '../zdogrigger'

/**
 * NOTES
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 * I want the shape to glow when it's selected...? 'destination-out' option
 * Need to extend Zdog to have Path2D
 *
 */

export default {
  
  name: 'Canvas',
  props: {
  },
  setup(){
  },
  methods:{
    clickHandler(event){
      console.log(this.getMousePos(event));
    },
    getMousePos(event){
      return {
        x: event.clientX,
        y: event.clientY
      };
    },
    // isShapeClicked(path, {x, y}){
    //   ctx.isPointInPath
    // }
  },
  computed:{
    ...mapState({
      settings:state=>state.canvas.settings,
      selected:state=>state.selected,
    }),
    width(){
      return window.innerWidth;
    },
    height(){
      return window.innerHeight;
    },
  },
}
</script>

<style scoped>
.zdog-canvas{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:0;
}
</style>
