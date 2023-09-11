
bits={
  l: { y:0, b:0 , s:sl }, //stone level
  L: { y:0, b:0 , s:sl2 }, //stone level
  T: { y:0, b:0 , s:pcT }, //stone tower
  u: { y:-1, b:0 , s:pcu }, //stone up
  d: { y:1, b:0 , s:sl }, //stone down

  h: { y:0, b:1 , s:hurdle }, //hurdle
  H: { y:0, b:1 , s:bhurdle }, //hurdle (flower)
  

  i: { y:0, b:1 , s:gl }, //green level
  g: { y:0, b:0 , s:gl }, //green level
  G: { y:0, b:0 , s:gl2 }, //green level double length
  U: { y:-1, b:0 , s:gu }, //green up
  D: { y:1, b:0 , s:gd },   //green down
  F: { y:0, b:0, s:bloom}, //flower
  t: { y:0, b:0, s:tree }, //pine tree
  c: { y:0, b:1, s:cow }, //cow problem

};


//conditonal are expressed as 0,1,-1 exact difference; 5 >=0; -5 <=0; 6>=1; -6<=1
//y0 y diff underfoot
//y1 y diff next point
acts=[ //actions and possible outcomes
   {a:'hop',      y0:0,          y:-1, spd:50, stl:60, s:1, fa: ['run','run2','hop','drop','climb','groll2','vaultdown','vaultr','rolldown'] },   
   {a: 'jump',    y0:0,    y1:5 ,    y:-1, spd: 70, stl:75, s: 1, fa: ['run','run2','groll2','vaultdown','vaultr']},

   {a: 'vaultup',  y0:0, y1:-1, y:-1, spd:90, stl:80, s:2 ,fa:['run','run2','hop','drop','climb','vaultdown','vaultr','rolldown']},
   {a: 'vaulth',  y0:0, y1:0, y:0, spd:100, stl:100, s:2,fa:['vaultup','vaulth'] },
   {a: 'groll',  y0:0, y1:0, y:0, spd:90, stl:70, s:2, fa:['run','run2','hop','drop','climb','groll2','rolldown','vaultdown'] },
   {a: 'toe',           y1: 6,    y:1, spd:70, stl: 100, s:2, fa:['fly2','hop','rollfly2','toe','fall'] },
   

   {a:'rolldown',    y0:0,   y1:6,    y:1,  spd:100, stl:90, s:3, fa:['run','run2','hop','drop','rolldown'] },
   {a: 'rollfly',       y1:5,    y:0, spd: 90, stl:100, s: 3, fa: ['jump']},   
   

   //default actions
   
   {a:'fall',           y1: 6,    y:1, spd:100, stl: 70, s:0 },
   {a:'drop',           y1: 1,    y:1, spd:90, stl: 60, s:0 },
   
   {a:'climb',      y0:0, y1:-1,   y:-1,spd:30, stl: 25, s:0 },   
   {a:'run',      y0:0, y1:0,    y:0, spd:80, stl:40, s:0 },      
   {a:'run2',      y0:0, y1:0,    y:0, spd:80, stl:35, s:0, fa:['run'] },      
   {a:'crashclimb',  y0:6,   y1:0,    spd:10, stl:5, y:0, s:0 },   

   
   {a: 'fly',        y1:5,    y:0, spd: 90, stl:80, s: 0, fa: ['jump']},
   {a: 'fly2',       y1:5,    y:0, spd: 70, stl:80, s: 0, fa: ['fly']},
   {a: 'rollfly2',    y1:5,    y:0, spd: 70, stl:100, s: 0, fa: ['rollfly']},   
   {a: 'flycatch',    y1:-1,    y:-1, spd: 60, stl:50, s: 0, fa: ['fly']},   
   {a: 'rollflycatch',    y1:-1,    y:-1, spd: 60, stl:50, s: 0, fa: ['rollfly']},   

   {a: 'vaultdown',  y0:0, y1:1, y:1, spd:100, stl:80, s:0, fa:['vaultup','vaulth'] },
   {a: 'vaultr',  y0:0, y1:0, y:0, spd:70, stl:50, s:0, fa:['vaultup','vaulth'] },
   {a: 'vclimb',  y0:0, y1:-1, y:-1, spd:10, stl:10, s:0, fa:['vaultup','vaulth'] },

   {a: 'groll2',  y0:0, y1:5, y:0, spd:80, stl:90, s:0, fa:['groll'] },
   {a: 'grollcrash',  y0:0, y1:-1, y:-1, spd:10, stl:10, s:0, fa:['groll'] },      
];

function startWorld(wld_s)
{
  let tf;
  let base=$('#rendertarget');  
  let s_lst=[];
  let t_h=[];
  let wld_l=wld_s.length;

  $('.sprite').remove();

  let add=(sp,x,y,noA)=>{
    let rd=makeSprite(sp,base,x,y,0,noA);  
    s_lst.push(rd);
    return rd;
  }

  

  let addT=(s)=>{ //add a string of terrain
     let a=[...s].map(c=>bits[c]);     
     let yp=0;
     a.forEach((b,xp)=>{
       yp+=b.y; //new road level
       //add terrain piece
       let ts=add(b.s,xp*50,yp*70,(s)=>{
         if ((s.f()=='z')&&(s.x()<rd.x()+420)) {
           s.addA('zb');
         }
         if (b.s.a.da) {//we have a dude approaches animation
           if ((s.f()=='b')&&(s.x()<rd.x()+120)&&(s.x()>rd.x()-200)) 
              s.addA('da');                    
         }
       }); 
       

       t_h[xp]=(t_h[xp]<yp)?t_h[xp]:yp; //set my start position
       t_h[xp+1]=yp-b.b; //set my end position       
     });     
  }

  
  let vpm=0;  
  let vpt=0;
  let rdxp=0;
  let rdyp=0;
  let spd=50;
  let dspd=0;
  let stl=0;
  let t_spd=0;
  let t_stl=0;
  let dstl=0;
  let lastA=null;

  let test_y=(cond,actual)=>{
    if (cond==null) return true;
    if (Math.abs(cond)<2) return cond==actual;
    if (cond==5) return actual>=0;
    if (cond==-5) return actual<=0;
    if (cond==6) return actual>=1;
    if (cond==-6) return actual<=1;
    throw "bad condition";
  }

  let canDoAction=(a)=>{
    let y0=t_h[rdxp]-rdyp;
    let y1=t_h[rdxp+1]-rdyp;
    if (a.fa&&(!a.fa.includes(lastA))) return false;
    return test_y(a.y0,y0)&&test_y(a.y1,y1);    
  };

  let chooseNextAnimation=()=>{
      let cai=ctrl.get();
      let na=null
      if (cai>=0) {//after the start there should always be a chosen move
        na=acts[cai];
        //calculate length of action
        let lt=dude.a[na.a].reduce((a,v)=>a+v.t,0);
        //update position
        rdxp+=1;        
        rdyp+=na.y;
        lastA=na.a;
        //update game speed change rate
        dspd=(na.spd-spd)/lt/2;
        dstl=((na.stl||0)-stl)/lt/2;
        t_spd+=spd;
        t_stl+=stl;
                
        //do the animation
        rd.addA(na.a);

        if (rdxp>=wld_l) { //game ended
          ctrl.set([0]);
          vpm=2; vpt=0;
          //set up final scores
          $('#spdf').textC(`Speed Rating ${Math.floor(t_spd/wld_l)}%`);
          $('#stlf').textC(`Style Rating ${Math.floor(t_stl/wld_l)}%`)
        }
        
        
        
      }

      let sa=acts.reduce((a,ac,ai)=>{
        if (canDoAction(ac)) a[ac.s]=ai;
        return a;
      },[]);

      let any=ctrl.set(sa);
      if (na) //move the marker forward
         mk.addA((na.y?(na.y>0?'md':'mu'):'m')+(any?'':'z'));

      
      
  }

  var ctrl=makeController(acts,()=>mk.addA('z'));   //make a game play user interface
  let mk=add(mrk,25,0);
  let rd=add(dude,0,0,chooseNextAnimation); //add our dude   
 
  rd.addA('zb');  
  
  addT(wld_s)  //build the terrain  
  
  
  
  
  //rd.addA('groll');
  //rd.addA('grollcrash');
  //rd.addA('fly');
  //rd.addA('flycatch');


  //rd.addA('crashclimb');
  //make a frame loop for world
  let lt=0;
  let abTT=0;
  tick=(tm)=>{
    let t=tm-lt;
    if (lt==0) t=0;
    if (t>100) t=100;
    lt=tm;    
    //calculate our spd tf
    tf=0.01+0.04*spd/100;
    abTT+=t*tf;
    
    if (vpm<2) {
       s_lst.forEach((s)=>s.tick(t*tf));
       //update status
       spd+=dspd*t*tf;
       $('#spd').text(`Speed ${Math.floor(spd)}%`);
       stl+=dstl*t*tf;
       $('#stl').text(`Style ${Math.floor(stl)}%`);
    }

    //set viewport
    if (vpm==0) { //camera in to start of level
      let r=vpt/1000;      
      if (r>=1) vpm=1;
      base.attr('viewBox',`${inter(-1200,rd.x()-200,r)} ${inter(-300,rd.y()-150,r)} ${inter(1200,800,r)} 300`)
      vpt+=t;      
    } else if (vpm==1) base.attr('viewBox',`${rd.x()-200} ${rd.y()-150} 800 300`);
    else if (vpm==2) {
      let r=vpt/8000;      
      if (r>=1) { vpm=3; vpt=0; }
      base.attr('viewBox',`${inter(rd.x()-200,0,r)} ${inter(rd.y()-150,-150,r)} ${inter(800,2000,r)} 300`)
      vpt+=t;      
    }
    else if (vpm==3) {
      let r=vpt/2000;      
      if (r>=1) vpm=4;
      base.attr('viewBox',`${inter(0,-1200,r)} ${inter(-150,300,r)} ${inter(2000,1200,r)} 300`)
      vpt+=t;      
    }

     
    if (vpm<4) requestAnimationFrame(tick);    
  }
  requestAnimationFrame(tick);
}