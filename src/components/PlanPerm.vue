<template class="plan">
    <div class="dash"> <!-- container-fluid -->
        <!-- Header -->
        <div class="head"> 
            <div class="">
                <h1>Dublin Planning Applications</h1>
            </div>
        </div>
        <!-- List of applications -->
        <div class="mainapp">
            <!-- <div class="col-3">
                <h2>Planning List</h2>
                <PlanList :plan_apps="plan_apps"
                    @mouse-over-plan="mouseOverPlan"
                    @mouse-left-plan="mouseLeftPlan" />
            </div> -->
            <div class="controlPanel"> <!-- col-2 -->
                <div class="head">
                    <h2>Filters</h2>
                </div>
                <div class="controls">
                    <b-button-group class="btngroup decisionButtons" size="sm">
                        <b-button
                            v-for="(btn,indx) in decidedButtons" 
                            :key="indx"
                            :pressed="btn.pressed"
                            @click="decidedClick(indx)">
                            {{btn.description}}
                        </b-button>
                </b-button-group>
                <b-button-group class="btngroup" size="sm">
                    <b-button
                        v-for="(btn,indx) in timeButtons" 
                        :key="indx"
                        :pressed="btn.pressed"
                        @click="timeClick(indx)">
                        {{btn.description}}
                    </b-button>
                </b-button-group>
                </div>
            </div>
            <div class="map"> <!-- col-md-10 -->
                <!-- <h2>Map</h2> -->
                <input type="text"
                placeholder="Search Address"
                ref="autocomplete"
                id="addressAutocomplete"
                class="searchbar"
                />
                <DubMap :plan_apps="filteredApps" :map_centre="mapCentre" :zoom_="zoom" :searched_="searched"/>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import DubMap from "./DubMap.vue"
    // import PlanList from './PlanList.vue'
    export default {
        name: 'PlanPerm',
        components: {
            DubMap,
            // PlanList
        },
        data: function() {
            return {
                plan_apps: [],
                normalIconSize: [15,15],
                largeIconSize: [30,30],
                mapCentre: [53.3498, -6.2603],
                zoom: 11.5,
                searched: false,
                decided: 0,
                decidedButtons: [
                    {
                        description: "All",
                        pressed: true,
                    },
                    {
                        description: "Decided",
                        pressed: false
                    },
                    {
                        description: "Undecided",
                        pressed: false,
                    }
                ],
                timeButtons: [
                    {
                        description: "Past Week",
                        pressed: true,
                    },
                    {
                        description: "Past 30 Days",
                        pressed: false,
                    },
                    {
                        description: "Past 6 Months",
                        pressed: false,
                    }
                ],
                timeState: 0,
            }
        },
        mounted() {
            //Get data from api
              axios.get("http://localhost:5000/get/short/2020-05-27")
            //   axios.get("http://localhost:5000/get/2020-05-27")
            // axios.get("http://localhost:5000/get/null")
            .then((r)=>{
                this.plan_apps = r.data.map(r=>{
                    r.iconSize = this.normalIconSize;
                    return r;
                })
            });
            // Set up Google Autocomplete
            const google = window.google
            const googleOptions = {
                types: ['geocode'],
                componentRestrictions: {country: 'ie'}
            }
            this.autocomplete = new google.maps.places.Autocomplete(
            (this.$refs.autocomplete),googleOptions
            );
            this.autocomplete.addListener('place_changed', () => {
                let place = this.autocomplete.getPlace();
                console.log(place)
                // let ac = place.address_components;
                // let area = ac[4]["long_name"];
                let lat = place.geometry.location.lat();
                let lon = place.geometry.location.lng();
                // console.log(`The user picked ${area} with the coordinates ${lat}, ${lon}`);
                // Update PlanPerm data, which is passed as props to DubMap
                this.updateMapProps(lat,lon);
                // Once an address ahs been chosen, boolean for red marker
                this.searched = true;
            });
        },
        computed: {
            //Computed value of applications, once all filters have been applied
            filteredApps: function() {
                // Depending on timeState
                // let filtered_apps = this.plan_apps.filter(application=>this.withinDates(application.app_date,this.timeState));
                // console.log(this.filteredApps)
                let filtered_apps = this.plan_apps.filter(application=>this.mainFilter(application)); 
                return filtered_apps;
                //General computed values needed... 
                //Check if date option ticked... 
                //Check if decided option ticked
            }
        },
        methods: {
            mouseOverPlan: function(index) {
                console.log("MouseOver",index)
                //Stopped these while testing other stuff
                // this.plan_apps[index].iconSize = this.largeIconSize;
            },
            mouseLeftPlan: function(index) {
                console.log("MouseLeft",index)
                // this.plan_apps[index].iconSize = this.normalIconSize;
            },
            updateMapProps: function(lat,lon) {
                this.mapCentre = [lat,lon];
                // this.zoom = 14;
            },
            timeClick: function(index) {
                // Style buttons
                this.timeButtons.forEach((btn, i) => {
                    if(i !== index) {
                        btn.pressed = false
                    }
                })
                this.timeButtons[index].pressed = true;
                // Change state of time filter
                this.timeState = index;
            },
            decidedClick: function(index) {
                // Style buttons
                this.decidedButtons.forEach((btn, i) => {
                    if(i !== index) {
                        btn.pressed = false
                    }
                })
                this.decidedButtons[index].pressed = true;
                this.decided = index;
            },
            mainFilter(app) {
                //Not sure this even makes sense, this.decided could be evaluated once... ? maybe not
                switch (this.decided) {
                    // Return all (if within the dates)
                    case 0:
                        return this.withinDates(app.app_date);
                        // break;
                    // Return if there is a decision
                    case 1:
                        if (app.decision) {
                            return this.withinDates(app.app_date); 
                        }
                        else {
                            return false;
                        }
                        // break;
                    // Return if the decision is null
                    case 2:
                        if (!app.decision) {
                            return this.withinDates(app.app_date); 
                        }
                        else {
                            return false;
                        }
                        // break;
                } 
            },
            withinDates(date) {
                //Is the date within the bounds
                let appDate = new Date(date); // This could be resolved if the database wasnt strings
                const today = new Date(); // Can this be calculated less than every time... 
                return (this.getDays(today,appDate) < (200 + this.timeState*50)) 
            },
            getDays(d2,d1) {
                let days = Math.floor((((d2-d1) / 1000) / 3600) / 24);
                // console.log(days)
                return days ;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .plan {
        height: 95vh;
    }
    .dash {
        
        display: flex;
        flex-direction: column;
        // justify-content: center;
        .head {
            text-align: center;
            // background-color: #475ead;
            // border: 1px solid black;
        }
    }
    .mainapp {
        display: flex;
        flex-direction: row;
        justify-content:space-evenly ;
    }
    .controlPanel {
        display: flex;
        flex-direction: column;
        // justify-content: space-evenly;
        .head {
            text-align: center;
            // align-self: flex-start;
        }
    }
    .controls {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .map {
        display: flex;
        flex-basis: 80%;    
        flex-direction: column;
    }
    .searchbar {
        max-width: 25%;
    }
    .btngroup {
        padding: 10px;
    }
    
</style>