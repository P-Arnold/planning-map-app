<template>
    <!-- dashboard: main container -->
    <div class="dashboard"> 
        <!-- header -->
        <div class="header"> 
            <div>
                <h1>Dublin Planning Applications</h1>
            </div>
        </div>
        <!-- main_app: Filter & Map -->
        <div class="main_app">
            <div class="control_panel"> <!-- col-2 -->
                <div class="head">
                    <h2>Filters</h2>
                </div>
                <!-- Filter controls -->
                <div class="controls">
                    <!-- Application decision control -->
                    <b-button-group class="btngroup decision_buttons" size="sm">
                        <b-button
                            v-for="(btn,indx) in decidedButtons" 
                            :key="indx"
                            :pressed="btn.pressed"
                            @click="decidedClick(indx)">
                            {{btn.description}}
                        </b-button>
                    </b-button-group>
                    <!-- Application date control -->
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
            <div class="map"> 
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
    import $Scriptjs from 'scriptjs'
    import DubMap from "./DubMap.vue"
    // import PlanList from './PlanList.vue'
    export default {
        name: 'PlanPerm',
        components: {
            DubMap
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
            // Get data from api
            axios.get("https://parnold-tech.com/flask/get/short/2020-05-27")
            .then((r)=>{
                this.plan_apps = r.data.map(r=>{
                    // Add icon size as attribute, this was for hover effects that aren't used
                    r.iconSize = this.normalIconSize;
                    return r;
                })
            });
            // Set up Google Autocomplete
            $Scriptjs(`https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GMAPS_API}&libraries=places`, () => {
                this.initMap()
            })
        },
        computed: {
            //Computed value of applications, once all filters have been applied
            filteredApps() {
                return this.plan_apps.filter(application=>this.mainFilter(application)); 
            }
        },
        methods: {
            initMap(){
                const google = window.google
                const googleOptions = {
                    types: ['geocode'],
                    componentRestrictions: {country: 'ie'}
                }
                this.autocomplete = new google.maps.places.Autocomplete(
                (this.$refs.autocomplete),googleOptions
                );
                // Listener for when a place is selected from the autocomplete
                this.autocomplete.addListener('place_changed', () => {
                    let place = this.autocomplete.getPlace();
                    // let ac = place.address_components;
                    let lat = place.geometry.location.lat();
                    let lon = place.geometry.location.lng();
                    // Update PlanPerm data, which is passed as props to DubMap
                    this.updateMapProps(lat,lon);
                    // Once an address has been chosen, boolean for red marker
                    this.searched = true;
                });
            },
            updateMapProps: function(lat,lon) {
                this.mapCentre = [lat,lon];
            },
            //Two basically identical functions that could porbably be made into one
            timeClick(index) {
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
            decidedClick(index) {
                // Style buttons
                this.decidedButtons.forEach((btn, i) => {
                    if(i !== index) {
                        btn.pressed = false
                    }
                })
                this.decidedButtons[index].pressed = true;
                this.decided = index;
            },
            // Function for filtering the planning applications, which are passed to the map child
            mainFilter(app) {
                //Not sure this even makes sense, this.decided could be evaluated once... ? maybe not
                switch (this.decided) {
                    case 0:
                        // Return all (if within the dates)
                        return this.withinDates(app.app_date);
                    case 1:
                        // Return if there is a decision
                        if (app.decision) {
                            return this.withinDates(app.app_date); 
                        }
                        else {
                            return false;
                        }
                    case 2:
                        // Return if the decision is null
                        if (!app.decision) {
                            return this.withinDates(app.app_date); 
                        }
                        else {
                            return false;
                        }
                } 
            },
            withinDates(date) {
                // Is the date within the bounds
                let appDate = new Date(date); // This could be resolved if the database wasnt strings
                const today = new Date(); // Can this be calculated less than every time... 
                // These are just arbitrary time periods, not actually weekly, monthly etc.
                return (this.getDays(today,appDate) < (200 + this.timeState*50)) 
            },
            getDays(d2,d1) {
                // Convert time to days...
                let days = Math.floor((((d2-d1) / 1000) / 3600) / 24);
                return days ;
            },
            // These functions are not being used.
            // They were for a hover effect on the list.
            mouseOverPlan: function(index) {
                console.log("MouseOver",index)
                // this.plan_apps[index].iconSize = this.largeIconSize;
            },
            mouseLeftPlan: function(index) {
                console.log("MouseLeft",index)
                // this.plan_apps[index].iconSize = this.normalIconSize;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dashboard {
        height: 95vh;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        .header {
            text-align: center;
            // background-color: #475ead;
            // border: 1px solid black;
        }
    }
    .main_app {
        display: flex;
        flex-direction: row;
        justify-content:space-evenly ;
    }
    .control_panel {
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