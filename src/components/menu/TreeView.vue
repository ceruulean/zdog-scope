<template>
<div class="min-10">
  <h2>Tree View</h2>
TODO: filter anchors, add icon, searchbar
  <header class="row between">
    <div class="col index">
      Index
    </div>
    <div class="col name">Name</div>
    <div class="col type">Type</div>
  </header>
  <ul v-if="Ztree"
    >
    <TreeItem v-for="(node) in treeView" :key="node.id"
      :node="node"
      :depth="0"
      />
    <button @click="log">Console Log</button>
    <br/>
  </ul>
</div>
</template>

<script>
//import {reactive, onMounted} from 'vue' // onUpdated, onUnmounted
import { mapState} from 'vuex'// mapActions mapGetters

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
    log(){
      console.log(this.Ztree.nodes)
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
        this.$store.dispatch('treeview/changeList', value)
      }
    }
  },
  data(){
    return{
      ghost:false,
      rerender:false,
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
  padding-left:1.1rem;
}

.pink{
  background-color:pink
}

.min-10{
  min-width:10rem;
}

</style>
