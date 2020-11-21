<template>
  <div v-if="itemtype">
    <h2>Create new {{itemtype}}</h2>
    <form class="row">
      <div class="field-list">
        <label v-for="(field) in editableProps" :key="`${field}_creation`">
          {{field}}
          <input type="text" v-model="wipOptions[field]" :placeholder="optionDefault(field)"/>
        </label>
      </div>

      <div>Color picker component here</div>
      <div v-if="advEditableProps" class="field-list">
        <h3>Advanced</h3>
        <label
          v-for="(field) in advEditableProps"
          :key="`${field}_adv`">
          {{field}}
          <input type="text" v-model="wipOptions[field]" :placeholder="optionDefault(field)"/>
        </label>
      </div>

    </form>
    <button @click="submit">Create</button>
  </div>
</template>

<script>
//import {mapState, mapActions} from 'vuex'// mapActions 
import ZdogJSONSchema from '../zdogobjects.json'
import {SET_PROPS} from '../zdogrigger'

export default {
  name: 'Creation',
  emit:['submit-new-shape'],
  props: {
    itemtype:String
  },
  watch:{
    itemtype(){
      this.wipOptions = {};
    }
  },
  methods:{
    submit(){
      let invalids = this.validateFields();
      if (invalids.length == 0) { // the returned array is empty
        let payload = Object.assign({},this.wipOptions);
        this.$emit('submit-new-shape', this.itemtype, payload);
      } else {
          console.log(`You have errors in your fields: `)
        for (let i in invalids){
          console.log(invalids[i]);
        }
      }
    },
    optionDefault(field){
      return ZdogJSONSchema.optionValidator[field].default;
    },
    validateFields(){
      let incorrectFields = [];
      let k = Object.keys(this.wipOptions);
      let v = Object.values(this.wipOptions);
      for (let index = 0; index < k.length; index++){
        let field = k[index];
        let value = v[index];
        let validType = this.optionValidator[field].type;
        if (typeof value != validType){
          if (validType == 'Array') { // needs to be array
            if (Array.isArray(value)){
              continue;
            }
          } else if (validType == 'integer') {
            let toNum = Number(value);
            if (Number.isInteger(toNum)){
              continue;
            }
          } else if (validType == 'number'){
            let toNum = Number(value);
            if (isNaN(toNum)){
              incorrectFields.push(field);
              continue;
            }
          }
        incorrectFields.push(field);
        }
      }
        return incorrectFields;
    }
  },
  computed:{
    fields(){
      return ZdogJSONSchema.optionSchema[this.itemtype];
    },
    shapeFields(){
      return ZdogJSONSchema.optionSchema['shape'];
    },
    isShape(){
      return (this.itemtype != 'vector') && (this.itemtype != 'anchor') && (this.itemtype != 'group')
      && (this.itemtype != 'illustration');
    },
    isAbstract(){
      return (this.itemtype == 'vector') || (this.itemtype == 'anchor') || (this.itemtype == 'group')
      || (this.itemtype == 'illustration');
    },
    editableProps(){
      let iN = this.itemtype;
      let basic = SET_PROPS[iN]
      if (iN != 'vector' && iN != 'anchor' && iN != 'dragger'){
        basic = [...SET_PROPS['anchor'], ...basic]
      }
      return basic.filter(prop=>{
          return (prop != 'color')
        });
    },
    advEditableProps(){
      if (this.isShape && this.itemtype != 'shape'){
        return SET_PROPS['shape'].filter(prop=>{
          return (prop != 'color' && prop != 'path')
        });
      }
      return null;
    }
  },
  data(){
    return{
      optionSchema: ZdogJSONSchema.optionSchema,
      optionValidator: ZdogJSONSchema.optionValidator,
      transformOptions:{
        translate: null,
        rotate:null,
        scale:null,
      },
      wipOptions:{}
    }
  }
}
</script>

<style scoped>
input{
  max-width:10ch;
}

.field-list{
  display:flex;
  flex-flow:column nowrap;
}
</style>