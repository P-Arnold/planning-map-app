<template>
  <div class="mapp">
    <l-map
      ref="lmap"
      :zoom="zoom_"
      :center="latLng(this.map_centre[0],this.map_centre[1])"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker
        :key="index"
        v-for="(plan,index) in planApps"
        :lat-lng="latLng(plan.northing,plan.easting)">
        <l-icon :icon-size="plan.iconSize"
          :icon-url="icon">
        </l-icon>
        <l-popup ref="mypopup" class="lpopup" :options="poptions">
          <!-- <h4>{{plan.plan_ref}}</h4>
          <br/>
          <b>{{plan.location}}</b>
          <br/>
          <b>Decision:</b> <p>{{plan.decision}}</p> -->
          <div class="head">
            <h3>Plan Ref: {{plan.plan_ref}}</h3>
          </div>
          <div class="body">
            <b>{{plan.location}}</b>
            <p>Application Date: {{plan.app_date}}</p>
            <p v-if="plan.decision">Decision: {{plan.decision}}</p>
            <p v-else>Decision: Undecided</p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker ref="myMarker" v-if="this.searched_"
        :lat-lng="this.map_centre">
        <l-icon :icon-size="[15,20]"
          :icon-url="redIcon">
        </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
  import { latLng } from "leaflet";
  import { LMap, LTileLayer, LMarker, LIcon, LPopup} from "vue2-leaflet";
  import houseTag from "../assets/houseTag.png"
  import redPin from "../assets/red_pin.png"

  export default {
    name: "DubMap",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon,
      LPopup
      // LTooltip
    },
    props: {
      plan_apps: Array,
      map_centre: Array,
      zoom_: Number,
      searched_: Boolean
    },
    data: function() {
      return {
        url: `https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=${process.env.VUE_APP_THUNDER_API}`,
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        icon: houseTag,
        redIcon: redPin,
        searched: false,
        poptions: {
          //This doesn't seem to work, would be nice
          opacity:0.1
        },
        // center: latLng(this.map_centre[0],this.map_centre[1]),
        // zoom: this.zoom_,
        // planApps: this.plan_apps,
        // marker: latLng(53.3498, -6.2603),
        // currentZoom: 11.5,
        // currentCenter: latLng(53.3498, -6.2603),
        // // iconSize: [15,15],
        // showParagraph: false,
        // mapOptions: {
        //   zoomSnap: 0.5
        // },
        // showMap: true
      };
    },
    watch: {
      map_centre: function() {
        console.log("map_centre changed to", this.map_centre);
        // this.$refs.lmap.mapObject.flyTo(latLng(this.map_centre[0],this.map_centre[1]),14);
        this.$refs.lmap.mapObject.setView(latLng(this.map_centre[0],this.map_centre[1]),14.5);
        console.log(this.$refs)
        this.$refs.myMarker.setLatLng(latLng(this.map_centre[0],this.map_centre[1]));
        console.log(this.$refs.mypopup)
      },
    },
    computed: {
      planApps () {
        return this.plan_apps;
      },
      currentCenter() {
        return this.$refs.lmap.mapObject.getCenter();
      }
      // center () {
      //   return latLng(this.map_centre[0],this.map_centre[1]);
      // },
      // zoom () {
      //   return this.zoom_;
      // }
    },
    methods: {
      latLng: function(lat,lng) {
        return latLng(lat,lng)
      }
    },
    mounted() {
      console.log(this.$refs)
    }
  }
</script>

<style lang="scss" scoped>
  .mapp{
    height: 95vh;
  }
  .lpopup {
    // max-width: 100%;
    // display: flex;
    // flex-direction: column;
    .head{
      // display:flex;
      // justify-content: center;
      // size: 2em;
      h3 {
        font-size: 2em;
      }
    }
  }


</style>