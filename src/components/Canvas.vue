<template>
  <canvas
    id="canvas"
    ref="workingCanvas"
    class="zdog-canvas"
    :width="windowWidth"
    :height="windowHeight"
    :style="{backgroundColor:settings.backgroundColor}"
  />

  <canvas
    id="ghost"
    :class="{'hidden':hideGhost}"
    :width="windowWidth"
    :height="windowHeight"
  />

  <div class="developer">
    <button style="z-index:200" @click="hideGhost = !hideGhost">Toggle</button>
  </div>
  <div id="zoom-control">

  </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex'
import { useWindowSize } from 'vue-window-size';

/**
 * NOTES
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 * I want the shape to glow when it's selected...? 'destination-out' option
 * Need to extend Zdog to have Path2D
 *
 */

export default {
  name: 'Canvas',
  // data(){
  //   return{
  //     zoomDisplay:null
  //   }
  // },
  setup(){
    const { width, height } = useWindowSize();

    return{
      windowWidth: width,
      windowHeight: height,
    }
  },
  data(){
    return{
      hideGhost:true
    }
  },
  computed:{
    ...mapState({
      settings:state=>state.canvas.settings,
      selected:state=>state.selected,
      illustration:state=>state.illustration,
    }),
    ...mapGetters({
        selectedNode: 'selectedNode',
    }),
  },
  watch:{
    selectedNode(nVal, oVal){
      if (nVal && nVal != oVal){
        this.showSelectedAxes()
      } else {
        this.clearSelectedAxes()
      }
    },
  },
  methods:{
    ...mapActions('canvas',[
      'showSelectedAxes',
      'clearSelectedAxes',
      'clearCanvasAxes'
    ]),
    clickHandler(event){
      console.log(this.getMousePos(event));
    },
    getMousePos(event){
      console.log(this.camera.zoom);
      return {
        x: event.clientX,
        y: event.clientY
      };
    },
  }
}
</script>

<style>

#canvas, #ghost{
  position:absolute;
  top:0;
  left:0;
}
#canvas{
  width:100vw;
  height:100vh;
  z-index:var(--zCanvas);
}

canvas.ghost-canvas{
  width:100vw;
  height:100vh;
  z-index:var(--zGhost);
}

div.developer{
  z-index:3;
}

.hidden{
  display:none;
}

#zoom-control{
  position:absolute;
  bottom:0;
  z-index:var(--zPanel)
}

#zoom-control figure{
  padding:0.1rem 0.2rem;
  margin:0;

}
</style>
