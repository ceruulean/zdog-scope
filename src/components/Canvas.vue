<template>
  <canvas
    ref="workingCanvas"
    class="zdog-canvas"
    :width="width"
    :height="height"
    :style="{backgroundColor:settings.backgroundColor}"
    @click="clickHandler"
  />

  <canvas
    class="ghost-canvas"
    :width="width"
    :height="height"
  />

  <div class="axes-controls" />
  <div class="zoom-control">
    <figure>{{ zoom }}</figure>
  </div>
</template>

<script>
//import {onMounted} from 'vue' // onUpdated, onUnmounted
import {mapState, mapActions} from 'vuex'

/**
 * NOTES
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 * I want the shape to glow when it's selected...? 'destination-out' option
 * Need to extend Zdog to have Path2D
 *
 */

export default {
  name: 'Canvas',

  computed:{
    ...mapState({
      settings:state=>state.canvas.settings,
      selected:state=>state.selected,
    }),
    selectedNode(){
      return this.$store.getters['selectedNode'];
    },
    illustration(){
      return this.$store.getters['illustration'];
    },
    width(){
      return window.innerWidth;
    },
    height(){
      return window.innerHeight;
    },
    zoom(){
      let i = this.$store.getters['illustration'];
      if (i){
        return `${Math.round(i.zoom * 100)}%`
      }
      return null;
    }
  },
  watch:{
    selectedNode(nVal, oVal){
      if (nVal && nVal != oVal){
        this.showSelectedAxes()
      } else {
        this.clearSelectedAxes()
      }
    },
    illustration(){
      this.showCanvasAxes();
    }
  },
  methods:{
    ...mapActions('canvas',[
      'showCanvasAxes',
      'showSelectedAxes',
      'clearSelectedAxes',
      'clearCanvasAxes'
    ]),
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
  }
}
</script>

<style>

[class$="-canvas"]{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}
.zdog-canvas{
  top:0;
  left:0;
  position:absolute;
  width:100vw;
  height:100vh;
  z-index:0;
}

.ghost-canvas{
  z-index:1;
  display:none;
}

.zoom-control{
  position:absolute;
  bottom:0;
}

.zoom-control figure{
  padding:0.1rem 0.2rem;
  margin:0;

}
</style>
