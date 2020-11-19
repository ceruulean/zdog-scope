<template>
  <div class="modal">
    <div class="dimmer" @click="close">
    </div>
    <button class="close" @click="close">X</button>
    <figure>
      <slot/>
    </figure>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
  emits:['close'],
  props: {
    zdogtype:String,
    label:String
  },

  methods:{
    close(){
      this.$emit('close')
    }
  },
  data(){
    return{
      isActive:false
    }
  }
}
</script>

<style scoped>
.modal{
  position:fixed;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  justify-content:center;
  align-items:center;
  z-index:999;
  display:flex;
}
.modal.active{

  visibility:visible;
  opacity:1;
}


.dimmer{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);
  transition:all 300ms linear;
  z-index:1;
}

.close{
  position:absolute;
  top:0;
  right:0rem;
  background-color:rgba(255,255,255,0.7);
  z-index:3;
}

figure{
  margin:0 auto;
  position:relative;
  min-height:50vh;
  width:98vw;
  max-width:var(--readableParagraph);
  padding:1rem;
  background-color:var(--modalBGColor);
  border-radius:3px;
  z-index:2;
}
</style>