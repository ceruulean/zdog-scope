<template>
  <div class="hello">
    <h2>Properties</h2>
    <ul v-if="selected.node">
      <h3>{{selected.node.assignedName}}</h3>
        <ul>
          <li v-for="(value, prop, index) in displayJSON" :key="index">
            {{prop}}: <input type="text" v-model="this.wipOptions[prop]" :placeholder="value"/>
          </li>
        </ul>
        <button @click="log()">Console Log this</button>
    </ul>
  </div>
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
      console.table(this.selected);
    }
  },
  computed:{
    ...mapState([
      'selected',
    ]),
    displayJSON(){
      return ZdogFilterProps(this.selected.node);
    }
  },
  data(){
    return{
      wipOptions:{},
    }
  }
}
</script>

<style scoped>
.hello{
  border:1px solid black;
}
</style>
