var ctl;
//Makes the control cards
function makeController(al,callb)
{
  let chosenActionIndex=-1;
  let hasChosen=0;
  let act=[];

  ctl=(i)=>{
    let ai=act[i];
    if ((ai==null)||hasChosen) return;
    $('.card').removeClass('act');
    $('.slot').removeClass('show');
    cards[ai].addClass('act');
    $('#s'+i).addClass('chosen');    

    chosenActionIndex=ai;
    hasChosen=1;
    if (callb) callb();
  }
  
  $('.card').remove();

  //keyboard driver
  let old=$('#s1').sel()[0];
  old.replaceWith(old.cloneNode(true));
  $('#s1').on('keydown',(e)=>{
    switch (e.key) {
      case 'ArrowUp': ctl(1); break;
      case 'ArrowRight': ctl(2); break;
      case 'ArrowDown': ctl(3); break;
    }
    console.log(e);
  });

  
  //for each action make a card
  let cards=al.map((a,ai)=>{
    if (a.s==0) return null; //don't need slot 0 cards
    let svg=$('<svg>').addClass('card')
                      .attr('viewBox',`-150 -150 300 300`);
    let an=dude.a[a.a]; //this our animation
    let x=-50;y=0;r=0;
    an.map((s,i)=>{ //make a list of sprites (do we care)
        let sp=makeSprite(dude,svg);
        let op=.25+(i/an.length)*.75
        sp.base().attr('opacity',op);
        x+=s.dx*2||0;
        y+=s.dy||0;
        r+=s.dr||0;        
        sp.setF(s.f,x,y,r);
        return sp;    
    })    
    makeSprite(mrk,svg,-50,0).setF('b',0,0,0)
    //svg.on('click',()=>choseAction(ai));
    $('#s'+a.s).append(svg);
    return svg;
  });
  return {
    set:(actI)=>{ //configure action options and reset status
       chosenActionIndex=actI[0]; //choose default action at least
       hasChosen=0;
       act=actI;

       $('#s1').sel()[0].focus();
       //Check all cards are off
       $('.card').removeClass('act').removeClass('chosen');
       var any=false;
       [1,2,3].forEach(i=>{
          let ac=actI[i];
          $('#s'+i).removeClass("chosen").removeClass("show");
          if (ac==null) return; //nothing in this slot
          $('#s'+i).addClass("show")
          let cd=cards[ac];
          cd.addClass('act');            
          any=true;
       });
       $('#inst').toggleClass('show',any)
       return any;
    },
    get:()=>chosenActionIndex,
  };
}