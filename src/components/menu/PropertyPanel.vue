<template>
  <div v-if="selected.id">
    <div class="row info">
      <div>id: {{displayProps['id']}}</div><div class="text-display-type">{{TYPE}}</div>
    </div>
      <ul>
        <li v-for="(value, prop, index) in writableProps" :key="index">
          {{prop}}: <input type="text" v-model="this.wipOptions[prop]" :placeholder="toString(value)"/>
        </li>
      </ul>
      <button @click="log()">Console Log this</button>
  </div>
</template>

<script>
import { mapState} from 'vuex'// mapActions  mapGetters,

import {ZdogFilterProps, ZDOG_CLASS_NAME} from '../../zdogrigger'

export default {
  name: 'PropertyPanel',
  props: {
  },
  methods:{
    toString(object){
      return JSON.stringify(object);
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
    displayProps(){
      let n = this.Ztree.find(this.selected.id)
      return ZdogFilterProps(n);
    },
    writableProps(){
      let some = {...this.displayProps};
      for(let P of this.READ_ONLY){
        delete some[P];
      }
      return some;
    },
    TYPE(){
      return ZDOG_CLASS_NAME[this.displayProps['assignedType']];
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
</style>
