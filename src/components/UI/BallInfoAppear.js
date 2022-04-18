import * as TWEEN  from '@tweenjs/tween.js'

export default (

) => {
    let ballInfoEl = document.querySelector(`.diaryInfoContainer`);
    let tx = {x:-60}
    let t = new TWEEN.Tween(tx)
    .to({
        x: 0
    }, 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
        ballInfoEl.style.transform = `translateX(${tx.x}vw)`;
    }).start();
   

}