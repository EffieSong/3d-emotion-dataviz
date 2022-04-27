import * as TWEEN  from '@tweenjs/tween.js'

export default (
diaryObj //:DiaryObj
) => {

    let ballInfoEl = document.querySelector(`.diaryInfoContainer`);

    ballInfoEl.innerHTML = `
    <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Named Feeling</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>${diaryObj.nameOfFeelings}</dd>
        </div>
      </div>

      <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Pattern</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>/ddd</dd>
        </div>
      </div>

      <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Event</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>${diaryObj.event}</dd>
          </dd>
        </div>
      </div>

      <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Emotions</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>${diaryObj.emotions}</dd>
        </div>
      </div>

      <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Thoughts</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>${diaryObj.thoughts}</dd>
        </div>
      </div>

      <div class="perData-Wrapper">
        <div class="data-title-Wrapper">
          <dt>Body reacts</dt>
        </div>
        <div class="data-content-Wrapper">
          <dd>${diaryObj.bodyReaction}</dd>
        </div>
      </div>
    `;

    let tx = {x:-60}
    let tx2 = {x:0}
    let dx = 60; // relative tween values


    let tween_show = new TWEEN.Tween(tx)
    .to({
        x: 0
    }, 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
        ballInfoEl.style.transform = `translateX(${tx.x}vw)`;
    });

    let tween_hidden = new TWEEN.Tween(tx2)
    .to({
        x: -60
    }, 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
      console.log("hidding");
        ballInfoEl.style.transform = `translateX(${tx2.x}vw)`;
    });

    function show(){
      tween_show.start();
    }

    function hidden(){

      tween_hidden.start();
      
    }
    return {
      show,
      hidden
    }

}