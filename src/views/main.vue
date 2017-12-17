<template>
  <div class="main">
    <modal v-if="show_modal" @close="show_modal = false"></modal>
    <div class="title">Ai Chko.Ba</div>
    <br>
    <div class="content">
      <div class="left_side">
        <h3>Play against Ai</h3>
        <select v-model="selected_level">
          <option value="">Select Level</option>
          <option :value="level" v-for="(level, index) in levels" :key="index">{{level}}</option>
        </select>
        <div class="main_button" v-if="selected_level" @click="start_game_human">Play Game</div>
      </div>
      <div class="right_side">
        <div class="player_1">
          <h3>Ai One</h3>
          <select v-model="ai_1_level">
            <option value="">Select Level</option>
            <option :value="level" v-for="(level, index) in levels" :key="index">{{level}}</option>
          </select>
        </div>
        <div class="player_2">
          <h3>Ai Two</h3>
          <select v-model="ai_2_level">
            <option value="">Select Level</option>
            <option :value="level" v-for="(level, index) in levels" :key="index">{{level}}</option>
          </select>
        </div>
        <div class="main_button" v-if="ai_1_level && ai_2_level" @click="start_game_ai">Watch Ai Game</div>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import modal from '../components/modal'
  export default {
    components: {
      'modal': modal,
    },
    data() {
      return {
        levels: ['easy', 'medium', 'hard'],
        selected_level: '',
        show_modal: true,
        ai_1_level: '',
        ai_2_level: '',
        ai_1: {
          name: 'player1',
          level: ''
        },
        ai_2: {
          name: 'player2',
          level: ''
        },
      }
    },
    methods: {
      start_game_human() {
        localStorage.setItem('game_started', true);
        this.$router.push({name: 'game', params: {level: this.selected_level, is_vs_human: true}})
      },
      start_game_ai() {
        this.ai_1.level = this.ai_1_level
        this.ai_2.level = this.ai_2_level
        localStorage.setItem('game_started', true);
        this.$router.push({name: 'game', params: {ai_1: this.ai_1, ai_2: this.ai_2}})
      }
    },
  }
</script>
