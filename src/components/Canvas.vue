<template>
  <section class="canvas-wrapper">
    <canvas ref="workingCanvas" class="zdog-canvas"></canvas>
  </section>
</template>

<script>
//import {ref, onMounted, watch} from 'vue' // onUpdated, onUnmounted

export default {
  
  name: 'Canvas',
  emit: ['illustration-mounted'],
  props: {
    zdogobjects:Object
  },
  // setup(props){
  //   watch(() => {console.log(props.zdogobjects)})
  // },
  
  methods:{
    createNew(item){
      let itemType = item.toLowerCase();
      return this.zdogobjects[itemType];
    },

    newIllustration(){
      let options = {element: this.$refs.workingCanvas}
      this.workingIllustration = this.createNew('illustration')(options);
      this.$emit('illustration-mounted', this.workingIllustration)
    }
  },
  computed:{

  },
  data(){
    return {
      workingIllustration: null,

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
  width:100vw;
  height:100vh;
  z-index:0;
}
</style>
