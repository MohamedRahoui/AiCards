<template>
  <div>
    <div class="top">
      <group position="top" :number="comp_won.length"></group>
      <div class="hand">
        <card v-for="(card, index) in empty_comp_hand" :key="index" :icon="card.icon" :number="card.number" type="back"></card>
      </div>
    </div>
    <div class="right" v-if="this.current_player === 'human'">
      <div class="button">Pick</div>
      <div class="button bot">Drop</div>
    </div>
    <div class="box">
      <card v-for="(card, index) in empty_box" :key="index" :icon="card.icon" :number="card.number"></card>
    </div>
    <div class="left">
      <group position="gr-left" :number="start_cards.length"></group>
      <group position="gr-left-bot" :number="player_deck.length"></group>
    </div>
    <div class="bottom">
      <group position="bot"></group>
      <div class="hand">
        <card v-for="(card, index) in empty_player_hand" :key="index" :icon="card.icon" :number="card.number"></card>
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
          this.get_best_combination()
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
        player_won: []
      }
    },
    methods: {
      get_best_combination() {
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

        let get_max_length = combinations => {
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
        }
        let best_comb = get_max_length(combinations)
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
        } else {
          let get_min_in_hand = () => {
            let min = {}
            this.comp_hand.forEach(card => {
              if (!min.number) {
                min = card
              } else if (min.number > card.number) {
                min = card
              }
            })
            return min
          }
          let minimum = get_min_in_hand()

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
      }
    }
  }
</script>
