/*
https://p5js.org/reference/
https://processing.org/
https://threejs.org/
https://d3js.org/ 
*/

window.addEventListener('load', function() {
   var video = '' + 
      '<video autoplay muted loop class="bg-video">' +
      '<source src=".\\assets\\video\\HBP_Human_Braion_Project.mp4" type="video/mp4">' +
      'Seu navegador não suporta vídeos HTML5.' +
      '</video>';
   document.getElementById('background').innerHTML = video;
});

document.querySelector('.prhase-1').classList.add('blink-caret');
setTimeout(function() {
   document.querySelector('.prhase-1').classList.remove('blink-caret');
   document.querySelector('.prhase-1').classList.add('home-prhase-end');
   document.querySelector('.prhase-2').classList.add('blink-caret');
   setTimeout(function() {
      document.querySelector('.prhase-2').classList.remove('blink-caret');
      document.querySelector('.prhase-2').classList.add('home-prhase-end');
      document.querySelector('.prhase-3').classList.add('blink-caret');
      setTimeout(function() {
         document.querySelector('.prhase-3').classList.remove('blink-caret');
         document.querySelector('.prhase-3').classList.add('home-prhase-end');
         document.querySelector('.prhase-4').classList.add('blink-caret');
      }, 2000);
   }, 6000);
}, 6000);