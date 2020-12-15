<template>
  <div class="picker-wrapper">
    <a class="picker-button"
      @click="open">
      <div class="patch" :style="{'backgroundColor': wipColor}"
        @click="toggle">
      </div>
      <input type="text"
        aria-label="colorpicker"
        v-model="wipColor"
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
      default:'#333'
    }
  },
  emits:['close', 'update'],

  data(){
    return{
      colorPicker:null,
      isActive:false,
      wipColor:this.color
    }
  },
  methods:{
    open(){
      if (this.isActive) return;
      this.isActive = true;
      this.$nextTick(()=>{
        this.wipColor = this.color;
        this.mountPicker();
      })
    },
    close(){
      this.isActive = false;
    },
    toggle(e){
      e.stopPropagation();
      e.preventDefault()
      if (!this.isActive) {
        this.open()
      } else {
        this.close();
      }
    },
    colorEnter(e){
      this.colorPicker.color.set(e.target.value);
      this.wipColor = this.colorPicker.color.rgbaString
      this.$emit('update', this.wipColor);
    },
    mountPicker(){
      let cxt = this;
      cxt.colorPicker = new iro.ColorPicker(cxt.$refs.picker, {
        color: cxt.color,
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
        cxt.$emit('update', color.rgbaString)
      })
    },
  },
}
</script>

<style>

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
  z-index:var(--zPanel)
}

a.picker-button{
  display:flex;
  flex-flow:row nowrap;
  line-height:1rem;
  background-color:transparent;
  border:none;
  align-items:center;
}

.picker-wrapper input{
  height:1.3rem;
}

.patch{
  border-radius:50% 50%;
  width:1.5rem;
  height:1.5rem;
  margin:0.1rem 0.3rem;
}
</style>