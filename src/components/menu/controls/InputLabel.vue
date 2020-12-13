<template>
    <label
      class="input"
      :for="name"
    >
      <slot/>
      <component
        :is="element"
        v-bind="$attrs"
        autocomplete="off"
        autocorrect="off"
      />
      <div v-if="$attrs.type == 'number'"
        class="numberarrows no-select">
        <div class="incr">+</div>
        <div class="decr">-</div>
      </div>
    </label>
</template>

<script>
import StringMixin from '../../../zdogger'

// import InputVector from './InputVector'
 import ColorPicker from './ColorPicker'
// import Backface from './Backface'


export default {
  name: 'InputLabel',
  mixins:[StringMixin],
  inheritAttrs: false,
  components:{
    ColorPicker
  },
  props: {
    name:{
      type:String,
      default:null
    },
    element:{
      type:String,
      default:'input'
    }
  },
  emits:['model-value'],
  computed:{
    // compType(){
    //   if (this.type == 'color'){
    //     return 'ColorPicker' 
    //   } else if (this.type == 'vector'){
    //     return 'InputVector'
    //   } else if (this.type =='backface'){
    //     return 'Backface'
    //   }
    // }
  },

  methods:{
  },
}
</script>

<style>

.input input[type=number]::-webkit-inner-spin-button,
.input input[type=number]::-webkit-outer-spin-button
{
  -webkit-appearance: none;
  margin: 0;
}

.input input[type=number]
{
  -moz-appearance: textfield;
}

.input .numberarrows{
  position:absolute;
  top:0;
  right:0;
  height:100%;
  display:flex;
  flex-flow:column nowrap;
  background-color:var(--colorPri);
  z-index: 1;
  cursor:pointer;
}
.input .numberarrows .incr{
  height:50%;
}

.input .numberarrows .decr{
  height:50%;
}

</style>