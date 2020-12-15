<template>
    <h2>Properties</h2>
  <div class="property-panel"
    @click="closeTooltip"
    v-if="selectedNode && treeLoaded"
    >
      <div class="row info" >
        <div class="word-break">
          id: {{ selected }}
        </div>
        <div class="text-display-type">
          {{ selectedTypeName }}
        </div>
        <label class="input-name">
          <input
            :value="selectedNode['name']"
            class="input-name"
            type="text"
            autocomplete="off"
            autocorrect="off"
            :placeholder="selectedName"
            @change="updateName"
          >
        </label>
      </div>

    <form
      v-if="selectedNode && treeLoaded"
      class="field-list"
    >
      <div class="row">
        <InputVector
          v-for="prop in propList('vectors')"
          :id="`v_${prop}`"
          :key="prop"
          :value="selectedNode[prop]"
          :type="prop"
          @send-coords="inputChange(prop, $event)"
        >
          {{ capitalize(prop) }}
        </InputVector>
      </div>
      <div class="row">
        <InputLabel v-for="prop in propList('nums')"
          :key="prop"
          class="field"
          :for="prop"
          element="input"
          :value="selectedNode[prop]"
          type="number"
          step=0.1
          :placeholder="selectedNode[prop]"
          :name="prop"
          @change="inputChange(prop, $event.target.value)"
          >
        {{ capitalize(prop) }}:
        </InputLabel>
        <label v-for="prop in propList('colors')"
          class="field"
          :for="prop"
          :key="prop"
        >
          {{capitalize(prop)}}:
          <ColorPicker
          :color="selectedNode[prop]"
          @update="inputChange(prop, $event)"
          />
        </label>
      </div>
      <div class="row">
        <InputLabel v-for="prop in propList('bools')"
          :key="prop"
          class="field"
          :for="prop"
          element="input"
          :value="selectedNode[prop]"
          type="checkbox"
          :checked="selectedNode[prop]"
          :name="prop"
          @change="inputChange(prop, $event.target.value)"
          >
        {{ capitalize(prop) }}:
        </InputLabel>

        <Backface v-if="hasBackfaceColor"
            :color="selectedNode.backface"
            :threeD="isThreeD"
            :checked="true"
            @update="inputChange('backface', $event)"
            />
        <Backface v-else
            :threeD="isThreeD"
            :checked="selectedNode.backface"
            @update="inputChange('backface', $event)"
            />
      </div>
      <button @click="saveProps">
        Apply Changes
      </button>
    </form>

    <button @click="bWarning = true">Delete</button>
</div>
<teleport to="body">
  <Modal
    v-if="bWarning"
    @close="bWarning = false"
  >
  Are you sure you want to delete?
    <button @click="deleteSelected">
      Yes
    </button>
    <button @click="bWarning = false">
      Cancel
    </button>
  </Modal>
</teleport>
</template>

<script>
import { mapState, mapActions} from 'vuex'// mapActions  mapGetters,
import {ZCLASS} from '../../zdogger/ztree'

import {StringMixin} from '../../zdogger'

import Modal from '../Modal'

import InputVector from './controls/InputVector'
import ColorPicker from './controls/ColorPicker'
import Backface from './controls/Backface'
import InputLabel from './controls/InputLabel'

export default {
  name: 'PropertyPanel',
  components:{
    InputVector,
    ColorPicker,
    Backface,
    InputLabel,
    Modal
  },
  mixins:[StringMixin],

  data(){
    return{
      READ_ONLY: [
        'type', 'id'
      ],
      wipTooltip:null,
      bWarning:false
    }
  },
  computed:{
    ...mapState({
      selected:state=>state.selected,
      treeLoaded:state=>state.treeLoaded,
      displayProps:state=>state.properties.displayProps,
      selectedNode:state=>state.properties.displayProps.node
    }),
    selectedName(){
      if (!this.$store.state.treeview.selectedListNode) return;
      return this.$store.state.treeview.selectedListNode.name
    },
    selectedTypeName(){
      return ZCLASS.NAMES[this.selectedNode.type];
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
  methods:{
    ...mapActions('properties',[
      'changeDisplay',
      'updateProps',
      'editDisplay'
    ]),
    propList(type){
      let t = this.displayProps.props[type];
      if (type == 'colors') t = t.filter(prop=>prop != 'backface')
      return t
    },
    saveProps(e){
      e.preventDefault();
    },
    editProp(prop, value){
      let p = {option: prop, value: value};
      this.editOption(p)
    },
    inputChange(prop, newVal){
      //this.editOption({option: prop, value: newVal})
      let o = {};
      o[prop] = newVal
      this.updateProps(o)
    },
    updateName(e){
      let ne = e.target.value;
      let o = {name:ne}
      this.updateProps(o)
      this.$store.dispatch('history/updateSelectedName', ne);
    },
    closeTooltip(){
      //this.$emit('close-tooltip');
    },
    deleteSelected(){
      this.$store.dispatch('history/deleteZdog', this.selected)
      this.bWarning = false;
    }
  },
}
</script>

<style lang="scss">
@import '../../assets/fieldinput.css';

.property-panel {
  ::placeholder{
    color:rgba(0,0,0,1);
    opacity:1;
  }

  input{
    &:placeholder-shown {
      color:rgba(0,0,0,1);
      opacity:1;
    }
    &.input-name{
      max-width:100%;
    }
  }

  .info{
    justify-content:space-between;

    div{
      color:rgba(0,0,0,0.6);
      font-size:0.9em;
      padding:0 0.2rem;
    }
  }

  .field{
    font-size:1.05rem;
    margin:3px 2px;
    text-transform:capitalize;
    user-select:none;
  }

}
</style>
