
function start()
{
  //startWorld('ggHGUgggggHGgg');
}

function startLev(l)
{  
  document.documentElement.requestFullscreen();
  switch (l) {
    case 0: $('#rendertarget').attr('viewBox',"-1200 -300 1200 300"); break;
    case 1: startWorld('ggFGHGFGGhGggggUGggiicGgtGUgtGHGDgDtGggiicGDgggiicGUUTGHGDtGtGHGFGDDTGtGTG');  break;
    case 2: startWorld('ggHGTGtGtGTGgghSsTSjjJBJsssTSTSmSssmSDsmSsmSDssmSsmSDmSsrrrTSmSjjJBJmSssRRRTSjjJBJmSTSRmSTSHSggtGtGtG');  break;
    case 3: startWorld('llTluuuldllhlllludllludllulTlllhllllldlullllullhllddlllhlldduuu'); break;    
  }
}