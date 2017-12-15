import Vue from 'vue'
import Router from 'vue-router'
import Main from '../views/main.vue'
import Game from '../views/game.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    }
  ]
})
