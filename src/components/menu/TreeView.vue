<template>
  <ul v-if="Ztree">
    <TreeItem v-for="(node) in treeOrphans" :key="node.id"
      :node="node"
      />
      <button @click="log">FK me</button>
  </ul>
</template>

<script>
//import {ref, onMounted, } from 'vue' // onUpdated, onUnmounted

import { mapState, } from 'vuex'// mapActions mapGetters

import TreeItem from './TreeItem.vue'

export default {
  name: 'TreeView',
  components:{TreeItem},
  props: {
  },
  methods:{
  },
  computed:{
    ...mapState({
      Ztree:state => state.Ztree,
      treeOrphans:state => state.Ztree.orphans
    }),
  },
  data(){
    return{

      rerender:false,
    }
  }
}
</script>

<style >
.hello{
  border:1px solid black;
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
  width:2rem;
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

</style>
