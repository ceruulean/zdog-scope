<template>
  <div class="hello">
    <h2>Properties</h2>
    <ul v-if="selectednode">
      <h3>{{selectednode.name}}</h3>
        <ul>
          <li v-for="(prop, index) in filteredNode" :key="index">
            {{prop}}: <input type="text" v-model="this.wipOptions[prop]" :placeholder="toString(selectednode.data[prop])"/>
          </li>
        </ul>
        <button @click="log(selectednode)">Console Log this</button>
    </ul>
    <!--Display the canvas/illustration root specs?
    <span v-if="!selectednode">
      <span v-if="workingillustration">
        <h3>Canvas</h3>
        <ul>
          <li v-for="(prop, index) in filteredIllustration" :key="index">
            {{prop}}: <input type="text" v-model="this.wipOptions[prop]" :placeholder="toString(workingillustration[prop])"/>
          </li>
        </ul>
        <button @click="log(workingillustration)">Console Log Illustration</button>
      </span>

    </span>-->
  </div>
</template>

<script>
export default {
  name: 'PropertyPanel',
  props: {
    selectednode:Object,
    workingillustration:Object
  },
  methods:{
    toString(object){
      return JSON.stringify(object);
    },
    filterProps(zDogObject){
      let k = Object.keys(zDogObject);
      return k.filter((prop)=>{
        let value = zDogObject[prop]
        return !(Array.isArray(value)) && (typeof value !== "function")
      })
    },
    log(object){
      console.log(object);
    }
  },
  computed:{
    filteredIllustration(){
      return this.filterProps(this.workingillustration)
    },
    filteredNode(){
      return this.filterProps(this.selectednode.data);
    }
  },
  data(){
    return{
      wipOptions:{}
    }
  }
}
</script>

<style scoped>
.hello{
  border:1px solid black;
}
</style>
