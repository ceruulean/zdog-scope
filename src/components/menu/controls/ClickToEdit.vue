<template>
  <component
    :is="element"
    v-if="editing"
    v-bind="$attrs"
    ref="inp"
    @keydown="keydownHandler"
    @blur="finish"
    @change="$emit('edit-change', $event.target.value)"
  >
    <slot />
  </component>
  <label
    v-if="dbl && !editing"
    @dblclick="edit"
  >
    {{ label }}
  </label>
  <label
    v-if="!dbl && !editing"
    @click="edit"
  >
    {{ label }}
  </label>
</template>

<script>
export default {
  name: 'ClickToEdit',
  inheritAttrs: false,
  props: {
    dbl:{
      type:Boolean,
      default:false
    },
    label:{
      type:String,
      default:null     
    },
    element:{
      type:String,
      default:"input"  
    }
  },
  emits:['edit-start','edit-change', 'edit-finish'],

  data(){
    return{
      editing:false,
    }
  },

  methods:{
    keydownHandler(event){
      if (event.keyCode == 13) { //'Enter' pressed
        this.finish();
      }
    },
    edit(){
      this.editing = true;
      this.$emit('edit-start')
    },
    finish(){
      this.editing = false;
      this.$emit('edit-finish', this.$refs.inp.value)
    }
  },
}
</script>