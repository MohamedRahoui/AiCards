<template>
  <div class="card noselect" :class="[
      {'empty': is_empty},
      type_comp,
      {'selectable': is_selectable},
      {'selected': is_selected},
    ]" @click="selected">
    <div class="number" v-if="number">{{number}}</div>
    <img v-if="icon" :src="'/static/' + icon +'.svg'" class="icon">
  </div>
</template>

<script>
  export default {
    props: ['type', 'icon', 'number', 'selectable', 'where', 'id'],
    data() {
      return {
        is_selected: false
      }
    },
    computed: {
      is_empty() {
        return !this.number || !this.icon
      },
      type_comp() {
        return this.type
      },
      is_selectable() {
        return this.selectable
      },
    },
    methods: {
      selected() {
        if (this.number) {
          if (!this.is_selected) {
            this.$emit('card-selected', this)
            this.is_selected = true
          } else {
            this.$emit('card-unselected', this)
            this.is_selected = false
          }
        } else {
          this.is_selectable = false
        }
      }
    }
  }
</script>
