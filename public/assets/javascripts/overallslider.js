


function createSliderLogic(nameBullet, nameSlider){
    var bullet = document.getElementById(nameBullet);
    var slider = document.getElementById(nameSlider);

    slider.addEventListener("input", ()=>{
        bullet.innerHTML = slider.value;
        var bulletPosition = (slider.value/slider.max);

        bullet.style.left = (bulletPosition * 578) + "px";
    }, false);
}





createSliderLogic("tilsBullet","tilsSlider");
createSliderLogic("energiBullet","energiSlider");
createSliderLogic("helpBullet","helpSlider");
