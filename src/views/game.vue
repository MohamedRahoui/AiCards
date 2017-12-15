<template>
  <div>
    <div class="top">
      <group position="top" :number="comp_won.length"></group>
      <div class="hand">
        <card v-for="(card, index) in empty_comp_hand" :key="index" :icon="card.icon" :number="card.number"
              type="" :id="card.id"></card>
      </div>
    </div>
    <div class="right" v-if="this.current_player === 'human'">
      <div class="button" :class="{'disabled': !can_pick}" @click="pick_from_table">Pick</div>
      <div class="button bot" :class="{'disabled': !can_put}" @click="put_from_hand">Drop</div>
    </div>
    <div class="box">
      <card v-for="(card, index) in empty_box" :key="index" :icon="card.icon" :number="card.number"
            :selectable="isHuman" where="box" @card-selected="handle_card_selection"
            @card-unselected="handle_card_unselection" :id="card.id"></card>
    </div>
    <div class="left">
      <group position="gr-left" :number="start_cards.length"></group>
      <group position="gr-left-bot" :number="player_deck.length"></group>
    </div>
    <div class="bottom">
      <group position="bot" :number="player_won.length"></group>
      <div class="hand">
        <card v-for="(card, index) in empty_player_hand" :key="index" :icon="card.icon" :number="card.number"
              :selectable="isHuman" where="hand" @card-selected="handle_card_selection"
              @card-unselected="handle_card_unselection" :id="card.id"></card>
      </div>
    </div>
  </div>
</template>

<script>
  import card from '../components/card'
  import group from '../components/group'
  import swal from 'sweetalert2'

  export default {
    components: {
      'card': card,
      'group': group
    },
    created() {
      // Create deck '40'
      this.colors.forEach(color => {
        for (let i = 1; i < 11; i++) {
          this.start_cards.push({
            'icon': color, 'number': i, 'id': (Math.random() * 1e32).toString(36)
          })
        }
      });

      // Remove 4 cards for the box
      for (let i = 0; i < 4; i++) {
        let index = Math.floor(Math.random() * this.start_cards.length);
        this.box_cards.push(
          this.start_cards[index]);
        this.start_cards.splice(index, 1);
      }

      // Split the rest '36' randomly
      for (let i = 0; i < 18; i++) {
        let index = Math.floor(Math.random() * this.start_cards.length);
        this.player_deck.push(
          this.start_cards[index]);
        this.start_cards.splice(index, 1);
      }

      for (let i = 0; i < 35; i++) {
        this.empty_box.push({type: 'empty'})
      }

      this.box_cards.forEach(card => {
        this.empty_box.unshift(card)
      });

      // Give first 3 card to player
      for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * this.player_deck.length);
        this.player_hand.push(
          this.player_deck[index]);
        this.player_deck.splice(index, 1);
      }

      for (let i = 0; i < 3; i++) {
        this.empty_player_hand.push({type: 'empty'})
      }

      this.player_hand.forEach(card => {
        this.empty_player_hand.unshift(card);
        this.empty_player_hand.pop()
      });


      // Give first 3 card to Comp
      for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * this.start_cards.length);
        this.comp_hand.push(
          this.start_cards[index]);
        this.start_cards.splice(index, 1);
      }

      for (let i = 0; i < 3; i++) {
        this.empty_comp_hand.push({type: 'empty'})
      }

      this.comp_hand.forEach(card => {
        this.empty_comp_hand.unshift(card);
        this.empty_comp_hand.pop()
      });

      /*
      Game started
       */

      // choose who starts
      this.current_player = this.players[Math.floor(Math.random() * this.players.length)]
      if (this.current_player === 'human') {
        swal({
          title: 'You start',
        }).then(() => {

        })
      }

      if (this.current_player === 'ai') {
        swal({
          title: 'Ai start',
        }).then(() => {
          this.ai_play()
        })
      }

    },
    data() {
      return {
        current_player: '',
        players: ['human', 'ai'],
        start_cards: [],
        colors: ['heart', 'diamond', 'club', 'spade'],
        box_cards: [],
        player_deck: [],
        empty_box: [],
        player_hand: [],
        comp_hand: [],
        empty_player_hand: [],
        empty_comp_hand: [],
        comp_won: [],
        player_won: [],
        hand_selected: {},
        box_selected: [],
        last_picker: '',
        game_ended: false,
        level: ''
      }
    },
    computed: {
      isHuman() {
        return this.current_player === 'human'
      },
      can_put() {
        return this.hand_selected.number && !this.can_pick
      },
      can_pick() {
        if (this.hand_selected.number && this.box_selected.length > 0) {
          let total = 0
          this.box_selected.forEach(card => {
            total += card.number
          })
          return total === this.hand_selected.number
        } else {
          return false
        }
      },
      both_hands_empty() {
        return this.comp_hand.length === 0 && this.player_hand.length === 0
      }
    },
    methods: {
      /*
      global
      */
      handle_card_selection(card) {
        if (card.is_selectable && card.number) {

          // Hand cards
          if (card.where === 'hand') {
            if (this.hand_selected.number) {
              this.hand_selected.is_selected = false
              this.hand_selected = card
            } else {
              this.hand_selected = card
            }
          }

          if (card.where === 'box') {
            this.box_selected.push(card)
          }
        }
      },
      handle_card_unselection(card) {
        if (card.where === 'hand') {
          if (this.hand_selected.number) {
            this.hand_selected.is_selected = false
            this.hand_selected = {}
          }
        }
        if (card.where === 'box') {
          this.box_selected = $.grep(this.box_selected, (e) => {
            return e.id !== card.id;
          });
        }
      },
      distribute_cards() {
        if (this.both_hands_empty) {
          if (this.start_cards.length > 0 && this.player_deck.length > 0) {
            // give to ai
            for (let i = 0; i < 3; i++) {
              let index = Math.floor(Math.random() * this.start_cards.length);
              this.comp_hand.push(
                this.start_cards[index]);

              this.empty_comp_hand.pop()
              this.empty_comp_hand.unshift(
                this.start_cards[index]);
              this.start_cards.splice(index, 1);
            }
            //  give to player
            for (let i = 0; i < 3; i++) {
              let index = Math.floor(Math.random() * this.player_deck.length);
              this.player_hand.push(
                this.player_deck[index]);
              this.empty_player_hand.pop()
              this.empty_player_hand.unshift(
                this.player_deck[index]);
              this.player_deck.splice(index, 1);
            }
          } else if (this.start_cards.length === 0 && this.player_deck.length === 0 && this.box_cards.length > 0) {
            if (this.last_picker === 'ai') {
              this.box_cards.forEach(card => {
                this.comp_won.push(card)
                this.empty_box = $.grep(this.empty_box, (e) => {
                  return e.id !== card.id;
                });
                this.empty_box.push({type: 'empty'})
              })
            }
            if (this.last_picker === 'human') {
              this.box_cards.forEach(card => {
                this.player_won.push(card)
                this.empty_box = $.grep(this.empty_box, (e) => {
                  return e.id !== card.id;
                });
                this.empty_box.push({type: 'empty'})
              })
            }
            this.the_end()
            this.game_ended = true
          }
        }
      },
      get_hard_comb() {
        let combinations = []
        let sum = (cards) => {
          let total = 0;
          for (let i = 0; i < cards.length; i++)
            total += cards[i].number;
          return total
        };

        let powerSet = cards => {
          let ps = [[]];
          for (let i = 0; i < cards.length; i++) {
            for (let j = 0, len = ps.length; j < len; j++) {
              ps.push(ps[j].concat(cards[i]));
            }
          }
          return ps;
        };

        let findCombs = (cards, targetCard) => {
          let sumSets = [];
          let numberSets = powerSet(cards);
          for (let i = 0; i < numberSets.length; i++) {
            let numberSet = numberSets[i];
            if (sum(numberSet) === targetCard.number)
              sumSets.push({'card': targetCard, 'numberSet': numberSet})
          }
          return sumSets;
        }

        this.comp_hand.forEach(card => {
          combinations.push(findCombs(this.box_cards, card))
        })
        let max = {}
        combinations.forEach(combination => {
          if (combination.length > 0) {
            combination.forEach(comb => {
              if (!max.numberSet) {
                max = comb
              } else if (max.numberSet.length < comb.numberSet.length) {
                max = comb
              }
            })
          }
        })
        return max
      },
      get_easy_comb() {
        let equals;
        this.comp_hand.forEach(hand_card => {
          this.box_cards.forEach(box_card => {
            if (hand_card.number === box_card.number) {
              equals = {'card': hand_card, 'numberSet': [card]}
            }
          })
        })
        return equals
      },
      get_hard_put() {
        let min = {}
        this.comp_hand.forEach(card => {
          if (!min.number) {
            min = card
          } else if (min.number > card.number) {
            min = card
          }
        })
        return min
      },
      get_easy_put() {
        let max = {}
        this.comp_hand.forEach(card => {
          if (!max.number) {
            max = card
          } else if (max.number < card.number) {
            max = card
          }
        })
        return max
      },
      get_medium_put() {
        return this.comp_hand[Math.floor(Math.random() * this.comp_hand.length)];
      },
      /*
        Ai Playing
       */
      ai_play() {
        let best_comb
        if (this.level === 'hard') {
          best_comb = this.get_hard_comb()
        }
        if (this.level === 'easy') {
          best_comb = this.get_easy_comb()
        }
        if (this.level === 'medium') {
          best_comb = this.get_hard_comb()
        }
        if (best_comb.card) {
          // Add to won
          this.comp_won.push(best_comb.card)
          best_comb.numberSet.forEach(card => {
            this.comp_won.push(card)

            this.box_cards = $.grep(this.box_cards, (e) => {
              return e.id !== card.id;
            });
            this.empty_box = $.grep(this.empty_box, (e) => {
              return e.id !== card.id;
            });
            this.empty_box.push({type: 'empty'})

          })

          // Remove from the rest
          this.empty_comp_hand = $.grep(this.empty_comp_hand, (e) => {
            return e.id !== best_comb.card.id;
          });
          this.empty_comp_hand.push({type: 'empty'})

          this.comp_hand = $.grep(this.comp_hand, (e) => {
            return e.id !== best_comb.card.id;
          });
          this.last_picker = 'ai'
        } else {
          let minimum;
          if (this.level === 'hard') {
            minimum = this.get_hard_put()
          }
          if (this.level === 'easy') {
            minimum = this.get_easy_put()
          }
          if (this.level === 'medium') {
            minimum = this.get_medium_put()
          }

          //Insert in box
          this.box_cards.push(minimum)
          this.empty_box.pop()
          this.empty_box.unshift(minimum)

          // remove from comp hand
          this.empty_comp_hand = $.grep(this.empty_comp_hand, (e) => {
            return e.id !== minimum.id;
          });
          this.comp_hand = $.grep(this.comp_hand, (e) => {
            return e.id !== minimum.id;
          });
          this.empty_comp_hand.push({type: 'empty'})
        }
        if (this.both_hands_empty) {
          this.distribute_cards()
        }
        if (!this.game_ended) {
          swal({
            title: 'Ai Played, your turn now',
          }).then(() => {
            this.current_player = "human"
          })
        }
      },

      /*
      Human playing
       */
      // Put
      put_from_hand() {
        if (this.can_put) {
          let card_to_put = {};
          Object.assign(card_to_put, this.hand_selected._props)
          this.player_hand = $.grep(this.player_hand, (e) => {
            return e.id !== card_to_put.id;
          });
          this.empty_player_hand = $.grep(this.empty_player_hand, (e) => {
            return e.id !== card_to_put.id;
          });
          this.empty_player_hand.push({type: 'empty'})
          this.box_cards.push(card_to_put)
          this.empty_box.pop()
          this.empty_box.unshift(card_to_put)
          this.box_selected = []
          this.hand_selected = {}
          this.current_player = "ai"
          if (this.both_hands_empty) {
            this.distribute_cards()
          }
          if (!this.game_ended) {
            this.ai_play()
          }
        }
      },

      pick_from_table() {
        if (this.can_pick) {
          //delete from hand
          let card_to_pick = {};
          Object.assign(card_to_pick, this.hand_selected._props)
          this.player_hand = $.grep(this.player_hand, (e) => {
            return e.id !== card_to_pick.id;
          });
          this.empty_player_hand = $.grep(this.empty_player_hand, (e) => {
            return e.id !== card_to_pick.id;
          });
          this.empty_player_hand.push({type: 'empty'})
          this.player_won.push(card_to_pick)
          //delete from table
          this.box_selected.forEach(card => {
            this.box_cards = $.grep(this.box_cards, (e) => {
              return e.id !== card.id;
            });
            this.empty_box = $.grep(this.empty_box, (e) => {
              return e.id !== card.id;
            });
            this.empty_box.push({type: 'empty'})
            this.player_won.push(card)
          })
          this.box_selected = []
          this.hand_selected = {}
          this.current_player = "ai"
          if (this.both_hands_empty) {
            this.distribute_cards()
          }
          this.last_picker = 'human'
          if (!this.game_ended) {
            this.ai_play()
          }
        }
      },

      // Game Ended
      the_end() {
        let winner = ''
        if (this.player_won.length > this.comp_won.length) {
          winner = 'You'
        } else {
          winner = 'Ai'
        }
        swal({
          title: 'The winner is ' + winner,
          html: 'Your score: ' + this.player_won.length + ' <br> ' +
          'Ai score: ' + this.comp_won.length
        }).then(() => {
          this.$router.push({name: 'main'})
        })
      },
    }
  }
</script>
