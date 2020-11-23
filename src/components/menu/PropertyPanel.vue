<template>
  <div v-if="selected.id">
    <div class="row info">
      <div>id: {{selectedNode.id}}</div>
      <div class="text-display-type">{{selectedTypeName}}</div>
      <label class="nameinput">
        Name:
        <input type="text" v-model="this.wipOptions['assignedName']" :placeholder="toString(selectedNode['assignedName'])"/>
      </label>
    </div>
      <ul>
        <li v-for="prop in selectedAllProps" :key="prop">
          <label>
            {{prop}}:
            <input type="text" v-model="this.wipOptions[prop]" :placeholder="toString(selectedNode[prop])"/>
          </label>
        </li>
      </ul>
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
  </div>
</template>

<script>
import { mapState, mapGetters} from 'vuex'// mapActions  mapGetters,
import {ZDOG_CLASS_NAME, ADVANCED_PROPERTIES} from '../../zdogrigger'

export default {
  name: 'PropertyPanel',
  props: {
  },
  methods:{
    toString(object){
      return JSON.stringify(object);
    },
    saveProps(){
      this.$store.dispatch('properties/changeSelectedProps', this.wipOptions)
      this.wipOptions = {};
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
  },
  data(){
    return{
      wipOptions:{},
      READ_ONLY: [
        'assignedType', 'id'
      ],
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

.property-panel li{
  margin:3px 2px;
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


.property-panel label{
  font-size:1.05rem;
}

.property-panel input{
  color:green;
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
