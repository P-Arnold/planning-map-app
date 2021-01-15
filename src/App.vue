<template>
    <PlanPerm/>
  <!-- <div class="container-fluid">
  </div> -->
</template>
<script>
import PlanPerm from "./components/PlanPerm.vue";


export default {
  name: 'App',
  components: {
    PlanPerm
  },
  data() {
    return {
      // selectedName: "",
      // selectedID: "",
      // idList: [],
      // nameList: [],
      // productList: [],
    };
  }
  //,
//   async created() {
//     // Get the available product information 
//     const {data} = await axios.get("http://localhost:5000/");
//     this.productList = data;
//     data.forEach(d => {
//       this.idList.push(d.id);
//       this.nameList.push(d.name)
//     });
//   },
//   methods: {
//     // Handling dropdown selections
//     // Just change the name if its different to the current one
//     // And update the currently selected ID 
//     clickName(_name) {
//       if(this.selectedName === _name){
//         return;
//       }
//       else {
//         this.selectedName = _name;
//         const _id = this.productList.find(o => o.name === this.selectedName).id;
//         this.selectedID = _id;
//       }
//     },
//     // Same as above, but just update ID
//     clickID(_id) {
//       if(this.selectedID === _id){
//         return;
//       }
//       else {
//         this.selectedID = _id;
//       }
//     },
//   }
}
</script>

<style lang="scss" scoped>
  // .custom-dropdown {
  //   overflow-y:scroll;
  //   height:30vh;
  // }
</style>
