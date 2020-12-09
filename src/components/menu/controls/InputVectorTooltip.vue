<template>
  <div class="input-coord">
   <label
      :for="`${id}${label}`"
      :class="{'z100':editing}"
    >
      {{label}}:
      <input
        :id="`${id}${label}`"
        class="input-degrees"
        :value="wipValue"
        type="number"
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
          <label>{{ `${min}&#176;` }}</label>
          <input
            v-model="wipValue"
            type="range"
            :min="min"
            :max="max"
            @change="changeV"
          >
          <label>{{ `${max}&#176;` }}</label>
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
  computed:{
    min(){
      return Math.round(this.value) - 180;
    },
    max(){
      return Math.round(this.value) + 180;
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

.z100{
  z-index:100;
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