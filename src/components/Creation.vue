<template>
  <div v-if="itemtype">
    <h2>Create new {{ itemtype }}</h2>
    <div v-if="bWarning">
      Warning: fields that failed validation:
      <p
        v-for="f in invalidFields"
        :key="f"
      >
        {{ f }} needs a
        {{ validSchema[f].type }}
      </p>
      <p>Please fix them before proceeding.</p>
    </div>
    <form class="field-list">
      <div class="row">
        <label class="input-name">
          <input
            v-model="wipAssignedName"
            type="text"
            placeholder="untitled"
          >
        </label>
      </div>
      <div class="row between-">
        <div
          v-if="!bBlank"
          class="field-list radio"
        >
          Append to:
          <label
            v-if="selected.id"
            for="append_selected"
          >
            <input
              id="append_selected"
              v-model="appendTo"
              type="radio"
              name="appendto"
              value="selected"
              checked
            >
            Selected
            <br>(id: {{ selected.id }})
          </label>
          <label for="append_choose">
            <input
              id="append_choose"
              v-model="appendTo"
              type="radio"
              name="appendto"
              value="choose"
            >
            Choose<br>
            <select />
          </label>
          <label for="append_none">
            <input
              id="append_none"
              v-model="appendTo"
              type="radio"
              name="appendto"
              value="nothing"
            >
            None
          </label>
        </div>
        <div class="field-list col">
          <label
            v-for="(field) in textProps"
            :key="`${field}_creation`"
            :for="`${field}_creation`"
          >
            {{ capitalize(field) }}
            <input
              :id="`${field}_creation`"
              v-model="wipOptions[field]"
              type="text"
              :placeholder="optionDefault(field)"
            >
          </label>
        </div>
        <ColorPicker
          @update="updateColor"
          />
      </div>
      <div class="row">
        <InputVector
          v-for="field in vectorProps"
          :id="`${field}_creation`"
          :key="`${field}_creation`"
          :default="optionDefault(field)"
          :degrees="(field == 'rotate')"
        >
          {{ capitalize(field) }}
        </InputVector>
        <div class="field-list col">
          <label
            v-for="(field) in boolProps"
            :key="`${field}_creation`"
            :for="`${field}_creation`"
          >
            {{ capitalize(field) }}
            <input
              :id="`${field}_creation`"
              v-model="wipOptions[field]"
              type="checkbox"
              :checked="optionDefault(field)"
            >
          </label>
        </div>
      </div>
    </form>
    <button @click="submit">
      Create
    </button>
  </div>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
import ZdogJSONSchema from '../zdogobjects.json'
import {ZDOG_CLASS, ZDOG_CLASS_TYPE} from '../zdogrigger'

import InputVector from './menu/controls/InputVector'
import ColorPicker from './menu/controls/ColorPicker'

import StringHelper from './StringHelperMixin'

export default {
  name: 'Creation',
  components:{
    InputVector,
    ColorPicker
  },
  mixins:[StringHelper],
  props: {
    itemtype:{
      type:String,
      default:null
    }
  },
  emits:['close-prompt'],

  data(){
    return{
      wipOptions:{},
      wipAssignedName: null,
      appendTo:'selected'
    }
  },
  methods:{
    ...mapActions({
        newZdogObject:'newZdogObject', //argument should be in format {type:int, options:{}}
        validateFields:'properties/validateFields',
        newIllustration:'newIllustration'
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

      if (this.itemtype == 'illustration') {
        this.newIllustration(temp)
      } else {
        let selected = this.selected.id;
        if (selected) {
          temp.options.addTo = selected;
        }
        this.newZdogObject(temp)
      }
      this.$emit('close-prompt');
    },
    optionDefault(field){
      return ZdogJSONSchema.optionValidator[field].default;
    },
    updateColor(newColor){
      this.wipOptions['color'] = newColor;
    }
  },
  computed:{
    ...mapState({
        invalidFields: state => state.properties.invalidFields,
        validationSuccess:state => state.properties.validationSuccess,
        selected:state => state.selected,
    }),
    ...mapGetters('properties',[
        'BOOL_PROPS',
        'VECTOR_PROPS',
        'CYCLIC_PROPS',
        'bBlank'
    ]),
    textProps(){
      let a = [...this.BOOL_PROPS, ...this.VECTOR_PROPS, 'color'];
      let u = this.ALL_PROPS.filter(prop=>{
        return !a.includes(prop)
      })
      return u
    },
    boolProps(){
      return this.ALL_PROPS.filter(prop=>{
        return this.BOOL_PROPS.includes(prop)
      })
    },
    vectorProps(){
      return this.ALL_PROPS.filter(prop=>{
        return this.VECTOR_PROPS.includes(prop)
      })
    },
    validSchema(){
      return ZdogJSONSchema.optionValidator;
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
    },
    ALL_PROPS(){
      return ZDOG_CLASS_TYPE[ZDOG_CLASS[this.itemtype]].optionKeys.filter(prop=>{
        return (prop != 'addTo' && prop != 'onPrerender' && prop != 'onDragStart'
        && prop != 'onDragMove' && prop != 'onDragEnd' && prop != 'onResize')
      });
    }
  },
  watch:{
    itemtype(){
      this.wipOptions = {};
    }
  },
}
</script>

<style scoped>
@import '../assets/fieldinput.css';

.field-list .radio{
  align-items:flex-start;
  text-align:left;
}
</style>