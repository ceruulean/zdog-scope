<template>
  <div v-if="itemName">
    <h2>Create new {{itemName}}</h2>
    <form class="row">
      <label v-for="(field, index) in fields" :key="field">
        {{field}}
        <input type="text" v-model="wipOptions[field]" :placeholder="placeholders[index]"/>
      </label>
      <span v-if="isShape && itemName != 'shape'">
        <label
          v-for="(field, index) in shapeFields"
          :key="field">
          {{field}}
          <input type="text" v-model="wipOptions[field]" :placeholder="shapePlaceholders[index]"/>
        </label>
      </span>
    </form>
    <button @click="submit">Create</button>
  </div>
</template>

<script>
import ZdogJSONSchema from '../zdogobjects.json'

export default {
  name: 'Creation',
  emit:['submit-new-shape'],
  props: {
    itemName:String
  },
  watch:{
    itemName(){
      this.wipOptions = {};
    }
  },
  methods:{
    submit(){
      console.log(this.wipOptions);
      let invalids = this.validateFields();
      if (invalids.length == 0) { // the returned array is empty
        let payload = Object.assign({},this.wipOptions);
        this.$emit('submit-new-shape', this.itemName, payload);
      } else {
          console.log(`You have errors in your fields: `)
        for (let i in invalids){
          console.log(invalids[i]);
        }
      }
    },
    getFieldNames(item){
      return Object.keys(this.optionSchema[item]);
    },
    getPlaceholders(item){
      return Object.values(this.optionSchema[item]);
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
            } else {
              incorrectFields.push(field);
              continue;
            }
          } else if (validType == 'number'){
              let toNum = Number(value);
              if (isNaN(value)){
                incorrectFields.push(field);
                continue;
              } else if (validType == 'integer') {
                if (Number.isInteger(toNum)){
                  continue;
                } //otherwise mark incorrect
                incorrectFields.push(field);
              } else {
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
      let test = this.optionSchema[this.itemName];
      if (!test) return
      return this.getFieldNames(this.itemName);
    },
    shapeFields(){
      return this.getFieldNames('shape');
    },
    shapePlaceholders(){
      return this.getPlaceholders('shape');
    },
    placeholders(){
      let test = this.optionSchema[this.itemName];
      if (!test) return
       test = Object.values(this.optionSchema[this.itemName])
      return test;
    },
    isShape(){
      return (this.itemName != 'vector') && (this.itemName != 'anchor') && (this.itemName != 'group')
      && (this.itemName != 'illustration');
    },
    isAbstract(){
      return (this.itemName == 'vector') || (this.itemName == 'anchor') || (this.itemName == 'group')
      || (this.itemName == 'illustration');
    },
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
</style>