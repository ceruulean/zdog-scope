<template>
  <div v-if="itemtype">
    <h2>Create new {{itemtype}}</h2>
    <div v-if="bWarning">
      Warning: fields that failed validation:
      <p v-for="f in invalidFields" :key="f">{{f}}</p>
      <p>Please fix them before proceeding.</p>
    </div>
    <div v-if="selected.id">
      Adding to selected node: {{selected.assignedName}}<br/>(id: {{selected.id}})
    </div>
    <form class="row">
      <div class="field-list">
         <label>
          Name:
          <input type="text" v-model="wipAssignedName" placeholder="untitled"/>
        </label>
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
import {mapActions, mapState} from 'vuex'// mapActions 
import ZdogJSONSchema from '../zdogobjects.json'
import {CREATE_PROPS} from '../zdogrigger'

export default {
  name: 'Creation',
  emit:['close'],
  props: {
    itemtype:String
  },
  watch:{
    itemtype(){
      this.wipOptions = {};
    }
  },
  methods:{
    ...mapActions({
        newZdogObject:'newZdogObject', //argument should be in format {type:int, options:{}}
        validateFields:'properties/validateFields'
    }),
    async submit(){
      await this.validateFields(this.wipOptions);
      if (this.validationSuccess){
        this.createNew();
      }
    },
    createNew(){
      let options = Object.assign({},this.wipOptions);
      let temp = {
        type: this.itemtype,
        options:options,
        assignedName:this.wipAssignedName
        }

      let selected = this.selected.id;
      if (selected) {
        temp.options.addTo = selected;
      }

      this.newZdogObject(temp)
      this.$emit('close-prompt');
    },
    optionDefault(field){
      return ZdogJSONSchema.optionValidator[field].default;
    },
  },
  computed:{
    ...mapState({
        invalidFields: state => state.properties.invalidFields,
        validationSuccess:state => state.properties.validationSuccess,
        selected:state => state.selected,
    }),
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
      let basic = CREATE_PROPS[iN]
      if (iN != 'vector' && iN != 'anchor' && iN != 'dragger'){
        basic = [...CREATE_PROPS['anchor'], ...basic]
      }
      return basic.filter(prop=>{
          return (prop != 'color')
        });
    },
    advEditableProps(){
      if (this.isShape && this.itemtype != 'shape'){
        return CREATE_PROPS['shape'].filter(prop=>{
          return (prop != 'color' && prop != 'path')
        });
      }
      return null;
    },
    bWarning:{
      get(){
        return this.$store.getters['properties/validationFailed']
        },
      set(newVal){
        if (newVal == false) {
          this.$store.dispatch('properties/validationReset')
        }
      }
    }
  },
  data(){
    return{
      optionValidator: ZdogJSONSchema.optionValidator,
      wipOptions:{},
      wipAssignedName: null
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