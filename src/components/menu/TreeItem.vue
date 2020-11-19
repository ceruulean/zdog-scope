<template>
<div class="roq" v-if="node">
  <li
    :class="{'tree-item':true}"
      >
    <div @click.stop="highlight"
        ref="selectitem"
        :class="{
          'data-set':true,
          'row':true,
          'highlight': isSelected}"
      >
      <button v-if="hasChildren"
        @click="toggleCollapse"
        >
        {{collapsed? '+' : '-'}}
      </button>
      <div class="index">{{node.index}}</div>

      <input v-if="editingName && isSelected"
        autofocus
        ref="textbox"
        class="name" type="text" v-model="wipName"
        :placeholder="node.assignedName"
        @keydown="keydownHandler"
        @blur="finishEditAssignedName"/>
      <label v-else
        class="name"
        @dblclick="editAssignedName">
          {{node.assignedName}}
      </label>

      <div class="type">
        {{node.assignedType}}
      </div>
    </div>

    <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
    <ul v-if="children">
    <TreeItem v-for="(node) in children" :key="node.id"
    :class="{'collapsed':collapsed}"
    :node="node"
    />
    </ul>
  </li>
</div>
</template>

<script>
//import {ref } from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapGetters

export default {
  name: 'TreeItem',
  props: {
    node:Object,
  },
  watch:{
    selectedid(){
      this.finishEditAssignedName();
    },
    hasChildren(newVal, oldVal){
      if (!oldVal) {
        this.getChildrenView();
      }
    },
    updateTree(){
      this.getChildrenView();
    }
  },
  methods:{
    ...mapActions([
      'changeSelectedName', //newName
      'changeSelected' //{node: obj, element: element}
    ]),
    editAssignedName(){
      this.editingName = true;
    },
    finishEditAssignedName(){
      this.editingName = false;
      if (!this.wipName) return
      this.changeSelectedName(this.wipName)
      // let newName = this.wipName
      // this.$emit('edit-zdogger-node-name', this.node, newName);
      this.wipName = null;
    },
    keydownHandler(event){
      if (event.keyCode == 13) { //'Enter' pressed
        this.finishEditAssignedName();
      }
    },
    highlight(){
      //this.listElement.classList.add('highlight');
      let payload = {id: this.node.id,
       element: this.selectItem
       }
      this.changeSelected(payload)
      //this.$emit('change-selected', this.node.id, this.selectedElement);
    },
    toggleCollapse(){
      this.collapsed = !this.collapsed;
      if (!this.children) {
        //fetch children
        this.getChildrenView();
      }
    },
    getChildrenView(){
      try{
        let fk = this.ZdogObject.children.map(child=>{
          return this.Ztree.trimmedView(child);
        }).filter(x=>x)
        this.children = fk;
      } catch(e){
        //console.log(e)
      }
    },
  },
  computed:{
    ...mapState({
      selectedid:state => state.selected.id,
      Ztree: 'Ztree',
      updateTree:'updateTree'
    }),
    selectItem(){
      return this.$refs.selectitem;
    },
    isSelected(){
      return (this.selectedid && this.selectedid == this.node.id)
    },
    hasChildren(){
      try{
        return (this.ZdogObject.children.some(child=>{
          return child.id
        }))
      }catch(e){
        return false
      }
    },
    ZdogObject(){
      return this.Ztree.find(this.node.id);
    },
  },
  data(){
    return{
      children:null,
      editingName:false,
      wipName:null,
      collapsed:false,
    }
  }
}
</script>

<style>
.tree-item{
 /* background-color:rgba(100, 97, 97, 1);*/
  display:flex;
  justify-content:space-between;
  flex-direction:column;
}

.tree-item * {
  cursor:pointer;
}


.tree-item .row{
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

.tree-item .highlight{
  background-color:rgba(31, 79, 255, 0.4);
}

.tree-item .editing{
  z-index:51;
}

.tree-item .data-set{
  width: 100%;
}
.tree-item ul{
  position:relative;
}

.tree-item button{
  position:absolute;
  left:0;
  line-height:0.3rem;
  padding:0.2rem 0.1rem;
}

.tree-item .index{
  text-align:right;
  border-right:1px solid rgb(92, 85, 85);
}

.collapsed{
  display:none;
}

</style>
