<template>
  <div :class="{'input-vector': true, 'degrees':degrees}">
    <slot/>
    <label :for="`${id}x`">
      x:
    <input type="text" name="x"
      :id="`${id}z`"
       autocomplete="off"
       v-model="euler.x"
      :placeholder="defaultVal.x"
      @change="sendCoords"/>
        {{degrees? `&#176;`: ''}}
    </label>
    <label :for="`${id}y`">
      y:
      <input type="text" name="y" v-model="euler.y"
        :id="`${id}y`"
        autocomplete="off"
        :placeholder="defaultVal.y"
        @change="sendCoords"/>
          {{degrees? `&#176;`: ''}}
    </label>
    <label :for="`${id}z`">
      z:
      <input type="text" name="z" v-model="euler.z"
        :id="`${id}z`"
        autocomplete="off"
        :placeholder="defaultVal.z"
        @change="sendCoords"/>
          {{degrees? `&#176;`: ''}}
    </label>
  </div>
</template>

<script>
export default {
  name: 'InputVector',
  emits:['send-coords'],
  props: {
    id:String,
    default:Object,
    degrees:{
      type:Boolean,
      default:false
    },
  },

  methods:{
    sendCoords(e){ 
      let newVal = e.target.value;
      if (newVal == e.target.placeholder || newVal == "") return;

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
    toRad(degrees){
      return (Math.PI * degrees) / 180;
    },
    toDeg(radians){
      return (180 * radians) / Math.PI;
    },
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
        })
        return temp
      }
      return d
    }
  },
  data(){
    return{
      euler:{
        x:null,
        y:null,
        z:null
      }
    }
  }
}
</script>

<style scoped>
.input-vector{
  display:flex;
  flex-flow:column nowrap;
  margin:0.4rem 0.5rem 0.6rem 0.5rem;
}

.input-vector.degrees input{
  max-width:5ch;
}

.input-vector input{
  max-width:7ch;
}
</style>