<template>
<div class="col">
  <label
    :for="id"
  >
    Backface
    <input
      :id="id"
      type="checkbox"
      v-model="bChecked"
      @change="change"
    >
    </label>
    <ColorPicker v-if="bChecked && threeD"
    :color="color"
    @update="update"
    />
</div>
</template>

<script>
import ColorPicker from './ColorPicker.vue'

export default {
  name: 'Backface',
  components:{ColorPicker},
  props: {
    id:{
      type:String,
      default:'backface'
    },
    color:{
      type:String,
      default:'#333'
    },
    threeD:{
      type:Boolean,
      default:false
    },
    checked:{
      type:Boolean,
      default:false
    }
  },
  emits:['update'],

  data(){
    return{
      bChecked:this.checked,
      chooseColor:null
    }
  },

  methods:{
    update(newColor){
      this.chooseColor = newColor;
      this.$emit('update', newColor)
    },
    change(){
      if (this.bChecked == false){
        this.chooseColor = null
        this.$emit('update', false)
      } else if (this.bChecked == true && this.chooseColor == null){
        this.$emit('update', true)
      }
    }
  },
}
</script>