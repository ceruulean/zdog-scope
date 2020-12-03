<template>
  <div class="input-coord">
   <label
      :for="`${id}${label}`"
      class="input-coord"
    >
      {{label}}:
      <input
        :id="`${id}${label}`"
        class="input-degrees"
        v-model="wipValue"
        type="text"
        :name="label"
        autocomplete="off"
        :placeholder="placeholder"
        @change="changeV"
        @click="open"
      >
      &#176;
      </label>
      <Tooltip v-if="editing"
        @close="close">
        <div
          class="degree-range"
        >
          <label>{{ `-360&#176;` }}</label>
          <input
            v-model="wipValue"
            type="range"
            min="-360"
            max="360"
            @change="changeV"
          >
          <label>{{ `360&#176;` }}</label>
        </div>
      </Tooltip>
  </div>
</template>

<script>
import Tooltip from './Tooltip'
import ClickOutsideTrigger from '../../ClickOutsideTriggerMixin'

export default {
  name: 'InputVectorTooltip',
  components:{Tooltip},
  mixins:[ClickOutsideTrigger],
  emits:['changev'],
  props:{
    id:String,
    label:String,
    value:Number,
    placeholder:Number
  },

  data(){
    return{
      wipValue:this.value,
      editing:false
    }
  },

  methods:{
    changeV(){
      this.$emit('changev', this.wipValue)
    },
    close(){
      this.editing = false;
    },
    open(){
      this.editing = true;
    }
  }
}
</script>

<style>
.input-coord{
  position:relative;
}

.degree-range{
  display:flex;
  flex-flow:row nowrap;
  background-color:var(--colorPri);
  padding:0.1rem;
  font-size:0.5rem;
  border-radius:var(--borderRadius);
  bottom:-1.9rem;
  left:0;
}

.input-degrees{
  max-width:6ch;
}

.degree-range input[type="range"]{
  max-width:13ch;
}
</style>