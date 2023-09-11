var activeC=0;


function setCurveEditor(ccb)
{
   let updateCurve=()=>{
    try {
     let bs=$('#basepath');
     bs.empty();
     for (let i=0;i<initConfig.length;i+=6) {
      let cp=$('<path>');
      bs.append(cp);
      cp.attr('d',`M ${initConfig[i]}  ${initConfig[i+1]} Q ${initConfig[i+2]}  ${initConfig[i+3]}  ${initConfig[i+4]} ${initConfig[i+5]} `);
      cp.on('click',()=>{
        activeC=i/6;
        makeSpots();
      })
     }     
    } catch {  console.log("exception in curve draw")  }
   }

   let makeSpots=()=>
   {
     killDragSpots();
     //create a drag spot for each point
     for (let i=activeC*6;i<activeC*6+6;i+=2) {
       let yi=i+1;
       makeDragSpot('#edittarget',initConfig[i]/2+50,initConfig[yi]/2+50,(x,y)=>{
         initConfig[i]=Math.round(x*2-100);
         initConfig[yi]=Math.round(y*2-100);
         updateCurve();
         ccb();
       });
     }  
   }
     
   updateCurve();
   makeSpots();
   
}
