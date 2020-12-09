<template>
  <li
    v-if="node"
    :class="{'roq':true}"
  >
    <div
      class="tree-item"
      @dragover="dragOver"
      @dragleave="dragOverIndicate = false"
      @drop="drop"
    >
      <div
        ref="selectitem"
        class="data-set row"
        draggable="true"
        @click.stop="highlight"
        @dragstart="dragStart"
        @dragend="dragEnd"
      >
        <div class="index">
          <button
            v-if="hasChildren"
            @click="toggleCollapse"
          >
            {{ collapsed? '+' : '-' }}
          </button>
          <p>{{ node.index }}</p>
        </div>

        <div class="name">
          <ClickToEdit element="input"
            :dbl="true"
            autofocus
            type="text"
            :placeholder="node.assignedName"
            :label="node.assignedName"
            @edit-finish="finishEditAssignedName"
            />
        </div>


        <div class="text-display-type type">
          {{ node.assignedType }}
        </div>
      </div>
      <div
        v-if="dragOverIndicate"
        class="drag-over-ghost"
      />
      <!--
    <teleport to="[data-teleport]">
      <div v-if="editingName" class="editing-blocker"
        @click="editBlocker"
        ></div>
    </teleport>-->
      <ul v-if="hasChildren">
        <TreeItem
          v-for="(child) in node.children"
          :key="child.id"
          :class="{'collapsed':collapsed}"
          :node="child"
          :parent-id="node.id"
        />
      </ul>
    </div>
  </li>
</template>

<script>
//import {ref} from 'vue' // onUpdated, onUnmounted
import { mapState, mapActions} from 'vuex'// mapGetters

import ClickToEdit from './controls/ClickToEdit'

export default {
  name: 'TreeItem',
  components:{ClickToEdit},
  props: {
    node:{
      type:Object,
      default:null
    },
    parentId:{
      type:String,
      default:null
    }
  },
  emits:['drag-started', 'drag-stop'],

  data(){
    return{
      dragOverIndicate:false,
      editingName:false,
      collapsed:true,
    }
  },
  computed:{
    ...mapState({
      selectedid:state => state.selected.id,
      updateTree:'updateTree'
    }),
    selectItem(){
      return this.$refs.selectitem;
    },
    isSelected(){
      return (this.selectedid && this.selectedid == this.node.id)
    },
    hasChildren(){
      return (this.node.children && this.node.children.length > 0)
    },
    validDropzone(){
      let nid = this.node.id;
      if (this.$store.state.treeview.blockIds.includes(nid)) return false 
      return true
    }
  },
  watch:{
    selectedid(){
      this.finishEditAssignedName();
    }
  },
  methods:{
    ...mapActions({
      changeSelectedName:'treeview/changeSelectedName', //newName
      changeSelected:'changeSelected', //{node: obj, element: element}
      saveSelected:'treeview/saveSelected',
      startDrag:'treeview/startDrag',
      stopDrag:'treeview/stopDrag'
    }),
    dragStart(e){
      let payload = {childId: this.node.id}
      this.startDrag({blockIds:[this.node.id, this.parentId]})
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    },
    dragEnd(){
      this.dragOverIndicate = false;
      this.stopDrag()
    },
    dragOver(e){
      e.preventDefault();
      e.stopPropagation();
      if (!this.validDropzone) return;
      this.dragOverIndicate = true;
      e.dataTransfer.dropEffect = "move";
    },
    drop(e){
      e.preventDefault();
      e.stopPropagation();
      if (!this.validDropzone) return;
      let data = JSON.parse(e.dataTransfer.getData("text/plain"));
      let payload = {
        id: data.childId,
        newParentId: this.node.id,
      }
      this.$store.dispatch('treeview/sortItem', payload)
      //this.$emit('sort-tree', payload)
      this.dragEnd();
    },
    finishEditAssignedName(newVal){
      if (!newVal) return
      this.changeSelectedName(newVal)
    },
    highlight(){
      let payload = {id: this.node.id,
       element: this.selectItem
       }
      if (this.selectedid == this.node.id) {return}
      this.changeSelected(payload)
      this.saveSelected(this.node)
    },
    toggleCollapse(e){
      e.preventDefault();
      e.stopPropagation();
      this.collapsed = !this.collapsed;
    },
    log(event) {
      console.log(event)
    },
  },
}
</script>

<style>
.tree-item{
 /* background-color:rgba(100, 97, 97, 1);*/
  display:flex;
  justify-content:space-between;
  flex-direction:column;
  position:relative;
}

.tree-item * {
  cursor:pointer;
}


.tree-item .row{
  border-bottom: 1px solid rgba(0,0,0,0.3);
}

.tree-item .highlight{
  background-color:var(--colorLight);
}

.tree-item .editing{
  z-index:51;
}

.tree-item .data-set{
  width: 100%;
  height:1.3rem;
}
.tree-item ul{
  position:relative;
}

.tree-item button{
  position:relative;
  line-height:0.3rem;
  padding:0.2rem 0.1rem;
  width:2.5ch;
}

.tree-item .index{
  text-align:right;
  border-right:1px solid rgba(92, 85, 85, 0.2);
  display:flex;
  flex-flow:row nowrap;
}

.tree-item .index p{
  margin:0;
  padding:0;
  padding-left:1ch;
  max-width:5ch;
  font-size:0.9rem;
  color:var(--colorMain);
}

.tree-item li:before{
  position:absolute;
  top:0;
  left:0.6rem;
  content:'';
  width:1px;
  background-color:var(--colorMain);
  height:100%;
}

.tree-item .name{
  width:99%;
  text-align:left;
  max-width:initial;
}

.tree-item .name input{
  width:100%;
}

.collapsed{
  display:none;
}

.tree-item .empty-list-dropzone{
  padding:0.5rem 0 0 0;
}

.drag-over-ghost{
  border:1px dashed var(--colorPri);
  background-color:var(--colorLight);
  opacity:0.5;
  height:1.3rem;
  margin-left:1rem;
  /*needs arrow to indicate child*/
}

</style>
