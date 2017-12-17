<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <i class="fa fa-times-circle modal-default-button" aria-hidden="true" @click="$emit('close')"></i>
          <div class="modal_main_body">
            <div class="modal_right">
              <img src="static/LOGO_UGA_VO_CMJN.png">
              <div class="text">
                Professor : <br>
                JULIE DUGDALE <br><br><br>
                M1 WIC <br>
                2017/2018 <br>
                <h2>Artificial Intelligence</h2>
              </div>
            </div>
            <div class="modal_left">
              <div class="img_border">
                <img src="static/ali.jpg">
                <span>Ali Saidi</span>
              </div>
              <div class="img_border">
                <img src="static/ahmed.jpg">
                <span>Ahmed GHRISSI</span>
              </div>
            </div>
            <div class="model_footer">
              References :
              <a href="https://vuejs.org/">Vue.js</a> |
              <a href="https://webpack.js.org/">Webpack.js</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
