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
            :placeholder="selectedAllProps['assignedName']"
          >
        </label>
      </div>
      <div class="row">
        <label
          v-for="(val, prop) in selectedAllProps"
          :key="prop"
          class="field"
          :for="prop"
        >
          {{ capitalize(prop) }}:
          <input 
            v-model="wipOptions[prop]"
            type="text"
            autocomplete="off"
            :placeholder="toString(val)"
            :name="prop"
          >
        </label>
        <!-- <InputVector
          v-for="prop in vectorProps"
          :id="`v_${prop}`"
          :key="prop"
          :default="selectedNode[prop]"
          :degrees="(prop == 'rotate')"
          @send-coords="updateVectorProp(prop, $event)"
        >
          {{ capitalize(prop) }}
        </InputVector> -->
      </div>
      <div class="row">
        <!-- <label
          v-for="prop in numProps"
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
        <label v-for="prop in colorProps"
          class="field"
          :for="prop"
          :key="prop"
        >
          {{capitalize(prop)}}:
          <ColorPicker
          :color="selectedNode[prop]"
          @update="updateColor(prop, $event)"
          />
        </label> -->
      </div>
      <div class="row">
        <!-- <label
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
        <Backface v-if="hasBackfaceColor"
            :color="selectedNode.backface"
            :threeD="isThreeD"
            :checked="true"
            @update="updateColor('backface', $event)"
            />
        <Backface v-else
            :threeD="isThreeD"
            :checked="selectedNode.backface"
            @update="updateColor('backface', $event)"
            /> -->
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

// import InputVector from './controls/InputVector'
// import ColorPicker from './controls/ColorPicker'
// import Backface from './controls/Backface'
// import Input from './controls/input'

export default {
  name: 'PropertyPanel',
  components:{
    // InputVector,
    // ColorPicker,
    // Backface,
    // Input
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
  mounted(){
    this.wipOptions = this.selectedAllProps;
  },
  computed:{
    ...mapState([
      'selected'
    ]),
    ...mapGetters('properties',[
      'selectedAllProps',
      'numProps',
      'colorProps',
      'vectorProps',
      'boolProps'
    ]),
    selectedNode(){
      return this.$store.getters['selectedNode'];
    },
    advancedProps(){
      return ADVANCED_PROPERTIES;
    },
    selectedTypeName(){
      return ZDOG_CLASS_NAME[this.selectedNode.assignedType];
    },
    hasColor(){
      return this.selectedAllProps.includes('color');
    },
    hasBackfaceColor(){
      let bf = this.selectedNode.backface;
      return (typeof bf == 'string')
    },
    isThreeD(){
      return this.selectedTypeName == 'cylinder' || this.selectedTypeName == 'hemisphere'
      || this.selectedTypeName == 'cone'
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
    updateColor(prop, newColor){
      this.wipOptions[prop] = newColor;
      this.$store.dispatch('properties/update', this.wipOptions)
    },
    updateVectorProp(prop, data){
      let temp = Object.assign({}, this.selectedNode[prop]);
      Object.assign(temp, data);
      this.wipOptions[prop] = temp;
      let o = {}
      o[prop] = temp;
      this.$store.dispatch('properties/update', o)
    },
    closeTooltip(){
      //this.$emit('close-tooltip');
    },
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
