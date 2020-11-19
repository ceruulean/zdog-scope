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
      <button v-if="node.children.length > 0" @click="toggleCollapse">{{collapsed? '+' : '-'}}</button>
      <div class="index">{{nodeIndex}}</div>

      <input v-if="editingName && isSelected"
        autofocus
        ref="textbox"
        class="name" type="text" v-model="wipName"
        :placeholder="assignedName"
        @keydown="keydownHandler"
        @blur="finishEditAssignedName"/>
      <label v-else
        class="name"
        @dblclick="editAssignedName">
          {{assignedName}}
      </label>

      <div class="type">
        {{zDogType}}
      </div>
    </div>

    <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
    <ul v-if="node.children.length > 0">
    <TreeItem v-for="(node) in node.children" :key="node.id"
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

import {ZDOG_CLASS_NAME} from '../../zdogrigger'

export default {
  name: 'TreeItem',
  props: {
    node:Object,
  },
  watch:{
    selectednode(){
      this.finishEditAssignedName();
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
      let payload = {node: this.node,
       element: this.selectItem
       }
      this.changeSelected(payload)
      //this.$emit('change-selected', this.node.id, this.selectedElement);
    },
    toggleCollapse(){
      this.collapsed = !this.collapsed;
    },
    debug(){
      //console.log(this.nodee);
    }
  },
  computed:{
    // ...mapGetters([
    //   'treeOrphans',
    //   // ...
    // ]),
    ...mapState({
      selectednode:state => state.selected.node,
      Ztree: 'Ztree'
    }),
    selectItem(){
      return this.$refs.selectitem;
    },
    nodeIndex(){
      return this.Ztree.indexOf(this.node);
    },
    assignedName(){
      return this.node.assignedName;
    },
    isSelected(){
      return (this.selectednode && this.selectednode.id == this.node.id)
    },
    zDogType(){
      return ZDOG_CLASS_NAME[this.node.assignedType];
    },
  },
  data(){
    return{
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
.tree-item ul ul {
  padding-left:1rem;
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
