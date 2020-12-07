<template>
    <label
      class="field"
      :for="name"
    >
      <slot/>
      <component
        :is="element"
        v-bind="$attrs"
      />
    </label>
</template>

<script>
import StringHelper from '../../StringHelperMixin'

// import InputVector from './InputVector'
 import ColorPicker from './ColorPicker'
// import Backface from './Backface'


export default {
  name: 'InputLabel',
  mixins:[StringHelper],
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
  emits:['done'],
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
.input-toggle{
  display:flex;
}

.input-toggle span{
  margin-right:0.3rem;
}

.input-toggle input{
 display:none;
}

.input-toggle input:checked{

}

.tog-des{
  background-color:grey;
  border-radius:1.3rem;
  width:2.4rem;
  height:1.3rem;
}

.input-toggle input:checked + .tog-des{
  background-color:green;
}

</style>