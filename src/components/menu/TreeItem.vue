<template>
  <li
    v-if="node"
    class="tree-item"
    @dragover="dragOver"
    @dragleave="dragOverIndicate = false"
    @drop="drop"
  >
      <div
        ref="selectitem"
        :class="{'data-set':true, 'row':true, 'highlight':(selected == node.id)}"
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
            :placeholder="node.name"
            :label="node.name"
            @edit-finish="finishEditAssignedName"
            />
        </div>


        <div class="text-display-type type">
          {{ node.type }}
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
          @select-uncollapse="uncollapseBubble"
        />
      </ul>
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
    },
  },
  emits:['drag-started', 'drag-stop','select-uncollapse'],

  data(){
    return{
      dragOverIndicate:false,
      editingName:false,
      collapsed:true,
    }
  },
  computed:{
    ...mapState({
      selected:'selected',
      updateTree:'updateTree'
    }),
    isSelected(){
      return (this.selected == this.node.id)
    },
    hasChildren(){
      return (this.node.children && this.node.children.length > 0)
    },
    validDropzone(){
      let nid = this.node.id;
      if (this.$store.state.treeview.blockIds.includes(nid)) return false 
      return true
    },
    truncName(){
      let max = 20
      let text = this.node.name
      return text.substr(0,max-1)+(text.length>max?'&hellip;':''); 
    }
  },
  methods:{
    ...mapActions({
      changeSelectedName:'history/updateSelectedName', //newName
      changeSelected:'changeSelected',
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
      if (!newVal || (newVal == this.node.name)) return
      this.changeSelectedName(newVal)
    },
    highlight(){
      if (this.selected == this.node.id) {return}
      this.changeSelected(this.node.id)
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
    uncollapseBubble(){
      this.collapsed = false
      this.$emit('select-uncollapse')
    }
  },
  watch:{
    isSelected(newVal){
      if (this.collapsed && newVal == true){
        this.$emit('select-uncollapse')
      }
    }
  }
}
</script>

<style lang='scss'>
.tree-item{
  display:flex;
  justify-content:space-between;
  flex-direction:column;
  position:relative;
  cursor:pointer;

/*States*/
  .highlight{
    background-color:var(--colorLight);
  }
  .collapsed{
    display:none;
  }
/*Dom Elements*/
  ul{
    position:relative;
  }
  button{
    position:relative;
    line-height:0.3rem;
    padding:0.2rem 0.1rem;
    width:2.5ch;
  }
  li:before{
    position:absolute;
    top:0;
    left:0.6rem;
    content:'';
    width:1px;
    background-color:var(--colorMain);
    height:100%;
  }
/*inner Styling*/
  .row{
    border-bottom: 1px solid rgba(0,0,0,0.3);
  }
  .data-set{
    width: 100%;
    height:1.3rem;
  }
  .index{
    text-align:right;
    border-right:1px solid rgba(92, 85, 85, 0.2);
    display:flex;
    flex-flow:row nowrap;

    p{
      margin:0;
      padding:0;
      padding-left:1ch;
      max-width:5ch;
      font-size:0.9rem;
      color:var(--colorMain);
    }
  }
  .name{
    width:99%;
    text-align:left;
    max-width:initial;

    input{
      width:100%;
    }
  }
/*Drag N Drop*/
  .empty-list-dropzone{
    padding:0.5rem 0 0 0;
  }
  .drag-over-ghost{
    border:1px dashed var(--colorPri);
    background-color:var(--colorLight);
    opacity:0.5;
    height:1.3rem;
    margin-left:1rem;
    /*needs arrow to indicate child?*/
  }
}


</style>
