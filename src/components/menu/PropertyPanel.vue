<template>
  <div class="property-panel"
    @click="closeTooltip">
    <h2>Properties</h2>
    <form
      v-if="selectedNode"
      :key="wipOptions"
      class="field-list"
    >
      <div class="row info">
        <div class="word-break">
          id: {{ selectedNode.id }}
        </div>
        <div class="text-display-type">
          {{ selectedTypeName }}
        </div>
        <label class="input-name">
          <input
            v-model="wipOptions['assignedName']"
            class="input-name"
            type="text"
            autocomplete="off"
            autocorrect="off"
            :placeholder="selectedNode['assignedName']"
          >
        </label>
      </div>
      <div class="row">
        <InputVector
          v-for="prop in vectorProps"
          :id="`v_${prop}`"
          :key="prop"
          :default="selectedNode[prop]"
          :degrees="(prop == 'rotate')"
          @send-coords="updateVectorProp(prop, $event)"
        >
          {{ capitalize(prop) }}
        </InputVector>
      </div>
      <div class="row">
        <label
          v-for="prop in textProps"
          :key="prop"
          class="field"
          :for="prop"
        >
          {{ capitalize(prop) }}:
          <input 
            v-model="wipOptions[prop]"
            type="text"
            autocomplete="off"
            :placeholder="toString(selectedNode[prop])"
            :name="prop"
          >
        </label>
        <label v-if="hasColor"
          class="field"
          for="color"
        >
          Color:
          <ColorPicker
          :color="selectedNode['color']"
          @update="update"
          />
          <!-- <input 
            v-model="wipOptions['color']"
            type="text"
            autocomplete="off"
            :placeholder="toString(selectedNode['color'])"
            name="color"
          > -->
        </label>
      </div>
      <div class="row">
        <label
          v-for="prop in boolProps"
          :key="prop"
          class="field"
          :for="prop"
        >
          {{ capitalize(prop) }}:
          <input 
            v-model="wipOptions[prop]"
            type="checkbox"
            autocomplete="off"
            :checked="selectedNode[prop]"
            :name="prop"
          >
        </label>
      </div>
      <button @click="saveProps">
        Apply Changes
      </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters} from 'vuex'// mapActions  mapGetters,
import {ZDOG_CLASS_NAME, ADVANCED_PROPERTIES} from '../../zdogrigger'

import StringHelper from '../StringHelperMixin'

import InputVector from './controls/InputVector'
import ColorPicker from './controls/ColorPicker'

export default {
  name: 'PropertyPanel',
  components:{
    InputVector,
    ColorPicker,
  },
  mixins:[StringHelper],

  data(){
    return{
      wipOptions:{},
      READ_ONLY: [
        'assignedType', 'id'
      ],
      wipTooltip:null,
    }
  },
  computed:{
    ...mapState([
      'selected','Ztree'
    ]),
    ...mapGetters('properties',[
      'selectedNode',
      'selectedAllProps',
      'textProps',
      'vectorProps',
      'boolProps'
    ]),
    advancedProps(){
      return ADVANCED_PROPERTIES;
    },
    selectedTypeName(){
      return ZDOG_CLASS_NAME[this.selectedNode.assignedType];
    },
    hasColor(){
      return this.selectedAllProps.includes('color');
    }
  },
  watch:{
    selectedNode(){
      this.wipOptions = {};
    }
  },
  methods:{
    toString(object){
      return JSON.stringify(object);
    },
    capitalize(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    saveProps(e){
      e.preventDefault();
      this.$store.dispatch('properties/changeSelectedProps', this.wipOptions)
      this.wipOptions = {};
    },
    update(options){
      this.$store.dispatch('properties/update', options)
    },
    updateVectorProp(prop, data){
      let temp = Object.assign({}, this.selectedNode[prop]);
      Object.assign(temp, data);
      this.wipOptions[prop] = temp;
    },
    closeTooltip(){
      //this.$emit('close-tooltip');
    },
    log(){
      //console.table(this.selected);
      //console.table(this.selected);
      console.table(this.Ztree.find(this.selected.id));
    }
  },
}
</script>

<style>
@import '../../assets/fieldinput.css';

.property-panel .info{
  justify-content:space-between;
}.property-panel .info div{
  color:rgba(0,0,0,0.6);
  font-size:0.9em;
  padding:0 0.2rem;
}

.property-panel ::placeholder
{
  color:rgba(0,0,0,1);
  opacity:1;
}
.property-panel input:placeholder-shown {
  color:rgba(0,0,0,1);
  opacity:1;
}

.property-panel .field{
  font-size:1.05rem;
  margin:3px 2px;
  text-transform:capitalize;
  user-select:none;
}

.property-panel input.input-name{
  max-width:100%;
}
</style>
