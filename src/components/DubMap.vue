<template>
  <div class="map_container">
    <!-- Leaflet map -->
    <l-map
      ref="lmap"
      :zoom="zoom_"
      :center="latLng(this.map_centre[0],this.map_centre[1])"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <!-- V-for on the planning applications for markers -->
      <l-marker
        :key="index"
        v-for="(plan,index) in planApps"
        :lat-lng="latLng(plan.northing,plan.easting)">
        <l-icon :icon-size="plan.iconSize"
          :icon-url="icon">
        </l-icon>
        <!-- Popup -->
        <l-popup ref="mypopup" class="lpopup" :options="poptions">
          <div class="head">
            <h3>Plan Ref: {{plan.plan_ref}}</h3>
          </div>
          <div class="body">
            <b>{{plan.location}}</b>
            <p>Application Date: {{plan.app_date}}</p>
            <p v-if="plan.decision">Decision: {{plan.decision}}</p>
            <p v-else>Decision: Undecided</p>
            <p><a :href="cityUrl(plan.plan_ref)" target="_blank" rel="noopener noreferrer">More info</a></p>
          </div>
        </l-popup>
      </l-marker>
      <!-- Centre marker for search -->
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
    },
    props: {
      plan_apps: Array,
      map_centre: Array,
      zoom_: Number,
      searched_: Boolean
    },
    data() {
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
      };
    },
    watch: {
      map_centre() {
        // When the map_centre prop is changed, recentre the map object and adjust zoom
        this.$refs.lmap.mapObject.setView(latLng(this.map_centre[0],this.map_centre[1]),14.5);
        // And adjust the centre red pin, which should only show once a search has been made
        this.$refs.myMarker.setLatLng(latLng(this.map_centre[0],this.map_centre[1]));
      },
    },
    computed: {
      planApps () {
        return this.plan_apps;
      },
      currentCenter() {
        return this.$refs.lmap.mapObject.getCenter();
      }
    },
    methods: {
      latLng: function(lat,lng) {
        return latLng(lat,lng)
      },
      cityUrl(ref) {
        return "https://webapps.dublincity.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=".concat(ref);
      },
    },
    mounted() {
      // console.log(this.$refs)
    }
  }
</script>

<style lang="scss" scoped>
  .map_container{
    height: 95vh;
  }
  .lpopup {
    .head{
      h3 {
        font-size: 2em;
      }
    }
  }


</style>