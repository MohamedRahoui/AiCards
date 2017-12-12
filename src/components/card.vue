<template>
  <div class="card" :class="[{'empty': is_empty},type_comp]">
    <div class="number" v-if="number">{{number}}</div>
    <img v-if="icon" :src="'/static/' + icon +'.svg'" class="icon">
  </div>
</template>

<script>
  export default {
    props: ['type', 'icon', 'number'],
    data() {
      return {}
    },
    computed: {
      is_empty() {
        return !this.number || !this.icon
      },
      type_comp() {
        return this.type
      }
    }
  }
</script>
