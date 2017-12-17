<template>
  <div class="group" :class="[position, {'not_empty': number > 0}]">
    <span class="number" v-if="number">{{number}}</span>
    <span class="number" v-else>0</span>
  </div>
</template>

<script>
  export default {
    props: ['position', 'number'],
    data() {
      return {}
    }
  }
</script>
