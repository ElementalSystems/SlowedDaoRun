/*
   Minimal interface to create a draggable point
   Specify the frame with a specifier '#frame'
   all co-ordinates given are % of the frame size
   mcb  is callback(x,y) for this point when it is moved.

   Depends on femtoJS

*/
function makeDragSpot(frameid, x, y, mcb) {
  let spot = $('<div>').addClass('spot').css("left:" + x + "%;").css("top:" + y + "%;");
  let calcMP = (evt) => {
    let box = $(frameid).offset();
    return {
      x: (evt.clientX - box.left) * 100 / box.width,
      y: (evt.clientY - box.top) * 100 / box.height,
    }
  };
  let isDragging = false;
  //Add house hanlding on to this stuff and hope for
  spot.on('pointerdown', (evt) => {
    let mp = calcMP(evt);
    isDragging = true;
    spot.sel()[0].setPointerCapture(evt.pointerId);
    evt.preventDefault();
    evt.stopPropagation();
  });
  spot.on('pointermove', (evt) => {
    let mp = calcMP(evt);
    if (isDragging) {
      spot.css("left:" + mp.x + "%;").css("top:" + mp.y + "%;")
      mcb(mp.x, mp.y);
    }
    evt.preventDefault();
    evt.stopPropagation();
  });
  spot.on('pointerup', (evt) => {
    isDragging = false;
    spot.sel()[0].releasePointerCapture(evt.pointerId);;
    evt.preventDefault();
    evt.stopPropagation();
  });
  spot.on('pointerend', (evt) => {
    isDragging = false;
    evt.preventDefault();
    evt.stopPropagation();
  });

  $(frameid).append(spot);
}

function killDragSpots() {
  $(".spot").remove();
}
