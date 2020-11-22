<template>
  <ul v-if="Ztree"
    >
    <TreeItem v-for="(node) in treeView" :key="node.id"
      :node="node"
      :depth="0"
      />
    <button @click="log">Console Log</button>
    <br/>
  </ul>
</template>

<script>
//import {reactive, onMounted} from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapActions mapGetters

import TreeItem from './TreeItem.vue'
//import { VueDraggableNext } from 'vue-draggable-next'

export default {
  name: 'TreeView',
  components:{
    TreeItem,
 //   draggable: VueDraggableNext
    },
  props: {
  },
  watch:{
    updateTree(){
      this.treeView = this.$store.getters['treeview/view']
    }
  },
  methods:{
    ...mapActions([
      'sortTreeItem',
    ]),
    log(){
      this.fkme = this.Ztree._JSON();
    },
  },
  computed:{
    ...mapState({
      Ztree:state => state.Ztree,
      updateTree:'updateTree',
    }),
    treeView: {
      get() {
        return this.$store.state.treeview.list
      },
      set(value) {
        this.$store.dispatch('treeview/setList', value)
      }
    }
  },
  data(){
    return{
      ghost:false,
      rerender:false,
      fkme:null,
      draggingObject:null,
      dragId:null
    }
  }
}
</script>

<style >
.tree-view{
  background-color: rgb(255,255,255);
}

.tree-view header{
  background-color:rgba(0,0,0,0.7);
  color:rgba(255,255,255,1);
}

.tree-view .row{
  flex-wrap:nowrap;
}

.tree-view .index{
  padding:0 0.2rem 0 0.2rem;
  background-color:rgba(255,255,255,0.2);
}
.tree-view .name{
  flex-grow:4;
  padding:0 0.2rem;
}
.tree-view .type{
  padding:0 0.2rem 0 0.1rem;
  width:6rem;
  background-color:rgba(255,255,255,0.2);
}

.tree-view ul ul {
  padding-left:1rem;
}

.pink{
  background-color:pink
}

</style>
