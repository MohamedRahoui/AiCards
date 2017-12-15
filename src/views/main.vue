<template>
  <div>
    <div class="title">IA Card</div>
    <div class="content">
      <div style="margin: 50px auto 0 auto;width: 150px;">
        <select v-model="selected_level" style="width: 150px">
          <option value="">Select Level</option>
          <option :value="level" v-for="(level, index) in levels" :key="index">{{level}}</option>
        </select>
      </div>
      <router-link class="start" :to="{name: 'game'}" v-if="selected_level">Start Game</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        levels: ['easy', 'medium', 'hard'],
        selected_level: ''
      }
    }
  }
</script>
