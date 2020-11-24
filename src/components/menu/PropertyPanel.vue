<template>
  <form v-if="selected.id">
    <div class="row info">
      <div class="word-break">id: {{selectedNode.id}}</div>
      <div class="text-display-type">{{selectedTypeName}}</div>
      <label class="nameinput">
        Name:
        <input type="text" autocomplete="off" autocorrect="off"
           v-model="this.wipOptions['assignedName']"
          :placeholder="toString(selectedNode['assignedName'])"/>
      </label>
    </div>
    <div class="row">
      <InputVector v-for="prop in vectorProps" :key="prop"
      :default="selectedNode[prop]"
      @send-coords="update(prop, $event)">
      {{prop}}
      </InputVector>
    </div>
    <div class="row">
      <label v-for="prop in nonVectorProps" :key="prop"
        :for="prop">
        {{prop}}:
        <input 
          type="text" autocomplete="off"
          v-model="this.wipOptions[prop]"
          :placeholder="toString(selectedNode[prop])"
          :name="prop"/>
      </label>
    </div>

    <!--
      <ul>
        <li v-for="prop in advancedProps" :key="prop">
          <label>
            {{prop}}:
            <input type="text" v-model="this.wipOptions[prop]" :placeholder="toString(selectedNode[prop])"/>
          </label>
        </li>
      </ul>
      -->
      <button @click="saveProps">Save Properties</button>
    <!--Warning-->
  </form>
</template>

<script>
import { mapState, mapGetters} from 'vuex'// mapActions  mapGetters,
import {ZDOG_CLASS_NAME, ADVANCED_PROPERTIES} from '../../zdogrigger'

import InputVector from './controls/InputVector.vue'

export default {
  name: 'PropertyPanel',
  components:{
    InputVector
  },
  props: {
  },
  methods:{
    toString(object){
      return JSON.stringify(object);
    },
    saveProps(e){
      e.preventDefault();
      this.$store.dispatch('properties/changeSelectedProps', this.wipOptions)
      this.wipOptions = {};
    },
    update(prop, data){
      this.wipOptions[prop] = data;
    },
    log(){
      //console.table(this.selected);
      //console.table(this.selected);
      console.table(this.Ztree.find(this.selected.id));
    }
  },
  computed:{
    ...mapState([
      'selected','Ztree'
    ]),
    ...mapGetters('properties',[
      'selectedNode',
      'selectedAllProps',
    ]),
    advancedProps(){
      return ADVANCED_PROPERTIES;
    },
    selectedTypeName(){
      return ZDOG_CLASS_NAME[this.selectedNode.assignedType];
    },
    nonVectorProps(){
      return this.selectedAllProps.filter((prop)=>{
        return !this.VECTOR_PROPS.includes(prop);
      })
    },
    vectorProps(){
      return this.selectedAllProps.filter((prop)=>{
        return this.VECTOR_PROPS.includes(prop);
      })
    }
  },
  data(){
    return{
      wipOptions:{},
      READ_ONLY: [
        'assignedType', 'id'
      ],
      VECTOR_PROPS:[
        'rotate','translate','scale','front'
      ]
    }
  }
}
</script>

<style>
.property-panel{
  border:1px solid black;
  background-color:rgb(255,255,255)
}

.property-panel .info{
  justify-content:space-between;
}.property-panel .info div{
  color:rgba(0,0,0,0.6);
  font-size:0.9em;
  padding:0 0.2rem;
}

.property-panel form{
  display:flex;
  flex-flow:column nowrap
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

.word-break{
  word-break: break-all;
}

.property-panel label{
  font-size:1.05rem;
  margin:3px 2px;
  text-transform:capitalize;
  user-select:none;
}

.property-panel input{
  color:green;
  max-width:6rem;
}

.nameinput{
  width:100%;
}
.nameinput input{
  border-top:none;
  border-left:none;
  border-right:none;
  border-bottom:2px solid var(--colorInputPri);
}
</style>
