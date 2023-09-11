
function mkSpriteEditor()
{
  updateJSONDisplay();
  $('#jsontext').on("input",()=>{
    initConfig=JSON.parse($('#jsontext').value());
    setCurveEditor(updateJSONDisplay);
    setRender();
  })
  setCurveEditor(updateJSONDisplay);
  setRender();
}

function setRender()
{
    var base=$('#rendertarget').empty();
    editSprite.f.z=initConfig;
    makeSprite(editSprite,base);    
}


function copyJson()
{
  navigator.clipboard.writeText(JSON.stringify(initConfig));
}

async function pasteJson()
{
  let nw=await navigator.clipboard.readText();
  initConfig=JSON.parse(nw);
  updateJSONDisplay();
  mkSpriteEditor();
}

function updateJSONDisplay()
{
  $('#jsontext').setValue(JSON.stringify(initConfig));  
  setRender();
}
