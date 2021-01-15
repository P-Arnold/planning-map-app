<template>
    <div class="card plan-list" style="width: 18rem;">
        <ul class="list-group list-group-flush">
            <li
                @mouseover="mouseOver(index)"
                @mouseleave="mouseLeave(index)"
                v-for="(plan,index) in plan_apps"
                :key="index"
                class="list-group-item">{{plan.plan_ref}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "PlanList",
    props: {
        plan_apps: Array
    },
    methods: {
        mouseOver: function(index) {
            this.$emit("mouse-over-plan",index);
        },
        mouseLeave: function(index) {
            this.$emit("mouse-left-plan",index);
        }
    }
}
</script>

<style lang="scss" scoped>
    .plan-list{
        overflow-y: scroll;
        height: 95vh;
        li {
            &:hover {
                background-color: darkgray;
            }
        }
    }
</style>