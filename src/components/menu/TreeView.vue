<template>
  <div class="tree-view" v-if="rerender">
    <h2>Tree View</h2>
    filter anchor icon links
    <figure class="tree-view" v-if="nodeindexset">
    <header class="row between">
      <div class="col index">
        Index
      </div>
      <div class="col name">Name</div>
      <div class="col type">Type</div>
    </header>
      <ul>
        <TreeItem v-for="(value, index) in nodeSet" :key="index"
          :index="index"
          :zdogtype="value.className"
          :assignedname="value.name"
          @edit-zdogger-node-name="changeAssignedName"
          @change-selected="changeSelected"
          :class="(selectednode == value?'highlight':'')"
          />
      </ul>
    </figure>
    <button @click="log">WTF</button>
    <textarea></textarea>
  </div>
</template>

<script>
import TreeItem from './TreeItem.vue'

export default {
  name: 'TreeView',
  components:{TreeItem},
  props: {
    workingillustration:Object,
    nodeindexset:Object,
    selectednode:Object
  },

  methods:{
    getClass(zdoggerNode){
      return zdoggerNode.className;
    },
    //**User assigned name to the node */
    getAssignedName(zdoggerNode){
      return zdoggerNode.name
    },
    changeAssignedName(index, newName){
      this.nodeSetArray[index].name = newName;

      //Hack to force rerender
      this.nodeindexset.add(-1);
      this.nodeindexset.delete(-1)
    },
    changeSelected(index, element){
      this.$emit('change-selected', index, element);
    },
    log(){
     // let y = Array.from(this.nodeindexset)[0];
    }
  },
  computed:{
    toString(){
      return JSON.stringify(this.workingillustration);
    },
    nodeSet(){
      return this.nodeindexset.values();
    },
    nodeSetArray(){
      return  Array.from(this.nodeindexset);
    }
  },
  data(){
    return{
      rerender:true,
    }
  }
}
</script>

<style >
.hello{
  border:1px solid black;
}

figure.tree-view{
  margin:0;
}

.tree-view header{
  background-color:rgba(0,0,0,0.7);
  color:rgba(255,255,255,1);
}

.tree-view .row{
  flex-wrap:nowrap;
}

.tree-view .index{
  padding:0 0.1rem 0 0.2rem;
  background-color:rgba(255,255,255,0.2);
  width:3rem;
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
