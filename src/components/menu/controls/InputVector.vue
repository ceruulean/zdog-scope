<template>
  <div v-if="degrees" class="input-vector degrees"
    @mouseleave="stopEditDegrees"
    >
    <div class="title"><slot/></div>
    <label :for="`${id}x`" class="input-coord">
      x:
    <input type="text" name="x"
      :id="`${id}z`"
       autocomplete="off"
       v-model="euler.x"
      :placeholder="defaultVal.x"
      @change="sendCoords"
      @click="editDegrees('x')"
      />
        {{degrees? `&#176;`: ''}}

      <div  class="degree-range"
        v-show="editx"
        >
        <label>{{`-360&#176;`}}</label>
        <input type="range" min="-360" max="360"
        v-model="euler.x"
        @change="sendCoords"
        />
        <label>{{`360&#176;`}}</label>
      </div>
    </label>

    <label :for="`${id}y`">
      y:
      <input type="text" name="y" v-model="euler.y"
        :id="`${id}y`"
        autocomplete="off"
        :placeholder="defaultVal.y"
        @change="sendCoords"
        @click="editDegrees('y')"
        />
          {{degrees? `&#176;`: ''}}

        <div class="degree-range"
        v-show="edity"
        >
          <label>{{`-360&#176;`}}</label>
          <input type="range" min="-360" max="360"
          v-model="euler.y"
          @change="sendCoords"
          />
          <label>{{`360&#176;`}}</label>
        </div>
    </label>
    <label :for="`${id}z`">
      z:
      <input type="text" name="z" v-model="euler.z"
        :id="`${id}z`"
        autocomplete="off"
        :placeholder="defaultVal.z"
        @click="editDegrees('z')"
        @change="sendCoords"
        />
          {{degrees? `&#176;`: ''}}

        <div  class="degree-range"
        v-show="editz"
        >
          <label>{{`-360&#176;`}}</label>
          <input type="range" min="-360" max="360"
          v-model="euler.z"
          @change="sendCoords"
          />
          <label>{{`360&#176;`}}</label>
        </div>
    </label>
  </div>
 <div v-else class="input-vector">
    <div class="title"><slot/></div>
    <label :for="`${id}x`">
      x:
    <input type="text" name="x"
      :id="`${id}z`"
       autocomplete="off"
       v-model="euler.x"
      :placeholder="defaultVal.x"
      @change="sendCoords"
      />
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
    editDegrees(coord){
      this.stopEditDegrees();
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
  }
}
</script>

<style scoped>
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

.input-vector.degrees input[type="text"]{
  max-width:6ch;
}

.input-vector input{
  max-width:7ch;
}

.degree-range{
  position:absolute;
  bottom:-2rem;
  z-index:4;
  display:flex;
  flex-flow:row nowrap;
  background-color:var(--colorPri);
  padding:0.1rem;
  font-size:0.5rem;
  border-radius:var(--borderRadius);
}

.degree-range input[type="range"]{
  max-width:13ch;
}

.input-coord:hover .degree-range, .degrees input[type="text"]:focus + .degree-range,
.degree-range.editing{
  display:flex;
}
</style>