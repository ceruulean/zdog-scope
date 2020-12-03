<template>
  <div class="picker-wrapper">
    <a class="picker-button"
      @click="open">
      <div class="patch" :style="{'backgroundColor': wipColor}">
      </div>
      <input type="text" v-model="wipColor"
        @change="colorEnter"
        @blur="close"/>
    </a>
    <figure v-if="isActive" class="picker" ref="picker" />
  </div>
</template>

<script>
//import {ref, onMounted} from 'vue' // onUpdated, onUnmounted
import iro from '@jaames/iro';


export default {
  name: 'ColorPicker',
  props: {
    color:{
      type:String,
      default:'#f00'
    }
  },
  emits:['close', 'update'],

  data(){
    return{
      colorPicker:null,
      isActive:false,
      wipColor:this.color,
    }
  },
  computed:{
    selectedNode(){
      return this.$store.getters['selectedNode'];
    }
  },
  methods:{
    // toggle(e){
    //   e.preventDefault();
    //   this.isActive = !this.isActive;
    //   if (!this.isActive){
    //     this.$emit('update')
    //   } else {

    //   }
    // },
    open(){
      if (this.isActive) return;
      this.isActive = true;
      this.$nextTick(()=>{
        this.mountPicker();
      })
    },
    close(){
      this.isActive = false;
    },
    colorEnter(e){
      this.colorPicker.color.set(e.target.value);
      this.wipColor = this.colorPicker.color.rgbaString;
      this.$emit('update', {color:this.wipColor});
      this.selectedNode.color = this.wipColor;
    },
    mountPicker(){
      let cxt = this;
      cxt.colorPicker = new iro.ColorPicker(cxt.$refs.picker, {
        color: cxt.wipColor,
        width:200,
        layout: [
            { 
              component: iro.ui.Box,
            // options: {}
            },
            { 
              component: iro.ui.Slider,
              options: {
                // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
                sliderType: 'hue'
              }
            },
            { 
              component: iro.ui.Slider,
              options: {
                // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
                sliderType: 'alpha'
              }
            },
          ]
      })
      
      cxt.colorPicker.on('color:change', function(color) {
            cxt.wipColor = color.rgbaString
        });

      cxt.colorPicker.on('input:end', function(color){
        cxt.$emit('update', {color:color.rgbaString})
      })

       this.selectedNode.color = this.wipColor;
    },
  },
  // watch:{
  //   wipColor(){
  //     this.selectedNode.color = this.wipColor;
  //   }
  // }
}
</script>

<style scoped>

.picker-wrapper{
  position:relative;
}

.picker{
  position:absolute;
  margin:0;
  top:2rem;
  left:50%;
  transform:translateX(-50%);
  background-color:rgba(255,255,255,0.9);
  padding:0.5rem;
}

.picker-button{
  display:flex;
  flex-flow:row nowrap;
  line-height:1rem;
  background-color:transparent;
  border:none;
}

.patch{
  border-radius:50% 50%;
  width:1rem;
  height:1rem;
}
</style>