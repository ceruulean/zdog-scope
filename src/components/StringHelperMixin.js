const StringHelper = {
  methods:{
    toString(object){
      return JSON.stringify(object);
    },
    capitalize(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  }
}

export default StringHelper