<template>
  <ul v-if="selected.id">
    <h3>{{selected.id.assignedName}}</h3>
      <ul>
        <li v-for="(value, prop, index) in displayJSON" :key="index">
          {{prop}}: <input type="text" v-model="this.wipOptions[prop]" :placeholder="value"/>
        </li>
      </ul>
      <button @click="log()">Console Log this</button>
  </ul>
</template>

<script>
import { mapState} from 'vuex'// mapActions  mapGetters,

import {ZdogFilterProps} from '../../zdogrigger'

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
    displayJSON(){
      let n = this.Ztree.find(this.selected.id)
      return ZdogFilterProps(n);
    }
  },
  data(){
    return{
      wipOptions:{},
    }
  }
}
</script>

<style>
.property-panel{
  border:1px solid black;
  background-color:rgb(255,255,255)
}
</style>
