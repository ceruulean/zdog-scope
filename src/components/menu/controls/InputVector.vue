<template>
  <div
    v-if="degrees"
    class="input-vector degrees"
  >
    <div class="title">
      <slot />
    </div>

    <InputVectorTooltip
      id="degrees"
      label="x"
      :value="defaultVal.x"
      :placeholder="defaultVal.x"
      @changev="tooltipChange('x', $event)"
      />

    <InputVectorTooltip
      id="degrees"
      label="y"
      :value="defaultVal.y"
      :placeholder="defaultVal.y"
      @changev="tooltipChange('y', $event)"
      />

    <InputVectorTooltip
      id="degrees"
      label="z"
      :value="defaultVal.z"
      :placeholder="defaultVal.z"
      @changev="tooltipChange('z', $event)"
      />
  </div>
  <div
    v-else
    class="input-vector"
  >
    <div class="title">
      <slot />
    </div>
    <label :for="`${id}x`">
      x:
      <input
        :id="`${id}z`"
        v-model="euler.x"
        type="text"
        name="x"
        autocomplete="off"
        :placeholder="defaultVal.x"
        @change="sendCoords"
      >
      {{ degrees? `&#176;`: '' }}
    </label>

    <label :for="`${id}y`">
      y:
      <input
        :id="`${id}y`"
        v-model="euler.y"
        type="text"
        name="y"
        autocomplete="off"
        :placeholder="defaultVal.y"
        @change="sendCoords"
      >
      {{ degrees? `&#176;`: '' }}
    </label>
    <label :for="`${id}z`">
      z:
      <input
        :id="`${id}z`"
        v-model="euler.z"
        type="text"
        name="z"
        autocomplete="off"
        :placeholder="defaultVal.z"
        @change="sendCoords"
      >
      {{ degrees? `&#176;`: '' }}
    </label>
  </div>
</template>

<script>
import InputVectorTooltip from './InputVectorTooltip'

export default {
  name: 'InputVector',
  components:{InputVectorTooltip},
  props: {
    id:{
      type:String,
      default:null
    },
    default:{
      type:Object,
      default:null
    },
    degrees:{
      type:Boolean,
      default:false
    },
  },
  emits:['send-coords', 'open-tooltip'],

  data(){
    return{
      euler:{
        x:null,
        y:null,
        z:null
      },
      editx:false,
      edity:false,
      editz:false
    }
  },
  computed:{
    defaultVal(){
      let d = this.default
      if (typeof d == 'string') {
        d = JSON.parse(d)
      }
      if (this.degrees){
        let temp = Object.assign({}, d);
        Object.keys(temp).map(coord=>{
          temp[coord] = this.toDeg(temp[coord]);
          this.euler[coord] = temp[coord];
        })
        return temp
      }
      return d
    }
  },

  methods:{
    sendCoords(e){ 
      let newVal = e.target.value;
      if (newVal == e.target.placeholder || newVal == "") return;

      this.emitCoords();
    },
    toRad(degrees){
      return (Math.PI * degrees) / 180;
    },
    toDeg(radians){
      return (180 * radians) / Math.PI;
    },
    emitCoords(){
      let temp = Object.assign({}, this.euler);
      Object.keys(temp).forEach((key) => {
        if (temp[key] == null) {
           delete temp[key]
        } else {
          if(this.degrees) {
            let d = Number(temp[key]) % 360;
            temp[key] = this.toRad(d);
          } else {
            temp[key] = Number(temp[key]);
          }
        }
      });
      this.$emit('send-coords', temp);
    },
    editDegrees(coord){
      this.stopEditDegrees();
      this.$emit('open-tooltip');
      if (coord == 'x'){
        this.editx = true;
      } else if (coord == 'y'){
        this.edity = true;
      } else if (coord == 'z'){
        this.editz = true;
      }
    },
    stopEditDegrees(){
        this.editx = false;
        this.edity = false;
        this.editz = false;
    },
    closeTooltip(){
      this.stopEditDegrees();
    },
    tooltipChange(p, e){
      this.euler[p] = e;
      this.emitCoords();
    }
  }
}
</script>

<style>
.input-vector{
  position:relative;
  display:flex;
  flex-flow:column nowrap;
  margin:0.4rem 0.5rem 0.6rem 0.5rem;
  align-items:flex-end;
  padding-bottom:0.5rem;
}

.input-vector .title{
  width:100%;
}

.input-vector label{
  position:relative;
}

.input-vector input{
  max-width:7ch;
}


.input-coord:hover .degree-range, .degrees input[type="text"]:focus + .degree-range,
.degree-range.editing{
  display:flex;
}
</style>