
function buildPathElement(base,cls,si)
{
    let el=$('<path>').addClass(cls);
    let rf=getRenderFunction(cls);
    let chn;
    base.append(el);

    if (getRenderFunction(cls+'x')) //do we need a chain function    
        chn=buildPathElement(base,cls+"x",si);
    
    return (dp)=>{
        el.attr("d",rf(dp[si],dp[si+1],dp[si+2],dp[si+3],dp[si+4],dp[si+5]));
        if (chn) chn(dp);
    }
}

function makeSprite(conf,base,x=0,y=0,r=0,noAction=null)
{
    //build out the config if needed
    if (!conf.f.z) { //no zero frame
      conf.f.z=conf.f.b.map((v,i,a)=>a[i-(i%6)+i%2]); //make all points the first point
      if (!conf.a) conf.a={}; //create an animations space
      conf.a.zb=[{ f: 'b', t:80 }]; //roll from frame to b is 100 treks      
    }

    let gbase=$('<g>').addClass('sprite');
    base.prepend(gbase);
    
    //create the path elements    
    let curves=[...conf.cs].map((v,i)=>buildPathElement(gbase,v,i*6));
    let aQ=[];
    let current=null;
    let lP=conf.f.b;    
    let lF='z';

    let set=(d,nx,ny,nr=0)=>{    
        lP=d;     
        x=nx;
        y=ny;           
        r=nr;
        gbase.attr('transform',`translate(${x},${y}) rotate(${r})`)      
        curves.forEach(c=>c(d))
      }


    set(conf.f.z,x,y);//build your base frame

    let sprite={    
        x: ()=>x,
        y: ()=>y,
        r: ()=>r,
        f: ()=>lF,
        kill: ()=>gbase.remove(),
        base: ()=>gbase,
        setF: (fn,x,y,r)=>set(conf.f[fn],x,y,r),
        addA: (an)=>{ //adds an animation series to the queue
          aQ=[...aQ,...conf.a[an]];          
        },
        tick: (t)=>{
           if (!current) {
            if (!aQ.length) {
                //if (noAction) 
                noAction?.(sprite);

                if (!aQ.length) return; //nothing to update
            }
            let n=aQ.shift();           
            current={
               sX:x,
               eX:x+(n.dx?n.dx:0),
               sY:y,
               eY:y+(n.dy?n.dy:0),
               sR:r,
               eR:r+(n.dr?n.dr:0),
               sD: lP,
               eD: conf.f[n.f],
               t: 0,
               fT: n.t,
            }; 
            lF=n.f;               
           }
           let rat=current.t/current.fT;
           if (rat>1) rat=1;
           let nx=inter(current.sX,current.eX,rat);
           let ny=inter(current.sY,current.eY,rat);
           let nr=inter(current.sR,current.eR,rat);
           set(intA(current.sD,current.eD,rat),nx,ny,nr);
           current.t+=t
           if (rat==1) current=null; //we're over this do the next one
        },        
    }
    return sprite;
}


var ccls='wbaaffwbwbaawb';

function setRender()
{
    var base=$('#rendertarget').empty();
    buildSpriteElement(base,ccls)(initConfig,0,0);    
}

function inter(a,b,r)
{
   return b*r+a*(1-r);
}

function intA(a,b,r)
{
   return a.map((e,i)=>inter(a[i],b[i],r))
}

function getRenderFunction(cls)
{
    switch (cls) {        
        case 's':  return (x1,y1,x2,y2,x3,y3)=> `M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`;
        case 'tx':
        case 'f':  return (x1,y1,x2,y2,x3,y3)=> `M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3} Z`;
        case 'a':  return createBSR(6,3,2);
        case 'b':  return createBSR(7,2,6);
        case 't':  return createBSR(6,3,2);         
        
        case 'j':  return createBSR(3,2,1); //maroon
        case 'k':  return createBSR(3,2,1); //dk green
        case 'K':  return createXMir(createBSR(3,2,1)) 

        case 'i':  return createBSR(4,3,1); //black ink

        case 'w':  return createBSR(4,3,1);
        case 'd':
        case 'D':  return createCSR(25,25);
        case 'Dx':  return createOffsetB(-25,-25,createCSR(5,-5));;
        case 'Dxx':  return createOffsetB(25,25,createCSR(5,-5));;
        case 'Fx':  return createCSR(25,25);        
        case 'F':  return createOffsetB(-25,-30,createCSR(5,-5));                   
        case 'Fxx':  return createOffsetB(25,225,createCSR(0,200));        
        case 'Fxxx':  return createOffsetB(25,20,createCSR(5,-5));        
        case 'm':  return createCSR(-2,3);

        //Temple World
        case 'E':  return createCSR(25,25);        
        

        //green world
        case 'g': return createVariantB(5,20,5,createCSR(25,25));
        case 'gx': return createVariantB(10,20,10,createBSR(5,6,2));

        //roofs
        case 'r': return createCSR(5,8);        
        


    }
    return null;
}

function norms(x1,y1,x2,y2)
{
    let x=x2-x1;
    let y=y2-y1;
    let n=Math.sqrt(x*x+y*y); //normalization length
    if (n==0) return {x:0,y:0,nx:0,ny:0}
    x/=n; y/=n; //line in this direction length 1
    return {
        x,
        y,
        nx:-y,
        ny: x
    }
}

function createBSR(w1,w2,w3) //Brush stroke Render
{    
    return (x1,y1,x2,y2,x3,y3)=>{
        let l=norms(x1,y1,x3,y3),l1=norms(x1,y1,x2,y2),l2=norms(x2,y2,x3,y3)
        return `M ${x1-l1.nx*w1} ${y1-l1.ny*w1} Q ${x2-l.nx*w2} ${y2-l.ny*w2} ${x3-l2.nx*w3} ${y3-l2.ny*w3}` +
               `Q ${x3+l2.x*w3} ${y3+l2.y*w3} ${x3+l2.nx*w3} ${y3+l2.ny*w3} `+
               `Q ${x2+l.nx*w2} ${y2+l.ny*w2} ${x1+l1.nx*w1} ${y1+l1.ny*w1} `+
               `Q ${x1-l1.x*w1} ${y1-l1.y*w1} ${x1-l1.nx*w1} ${y1-l1.ny*w1}`;

    } ;
}

function createOffsetB(x,y,bf)
{
    return (x1,y1,x2,y2,x3,y3)=>bf(x1+x,y1+y,x2+x,y2+y,x3+x,y3+y);
}

function createXMir(bf) {
    return (x1,y1,x2,y2,x3,y3)=>bf(x1,y1,x2,y2,x3,y3)+bf(-x1,y1,-x2,y2,-x3,y3);
}

function createVariantB(v1,v2,v3,bf)
{
    let v1x=v1*(-.5+Math.random());
    let v1y=v1*(-.5+Math.random());
    let v2x=v2*(-.5+Math.random());
    let v2y=v2*(-.5+Math.random());
    let v3x=v3*(-.5+Math.random());
    let v3y=v3*(-.5+Math.random());
    
    return (x1,y1,x2,y2,x3,y3)=>bf(x1+v1x,y1+v1y,x2+v2x,y2+v2y,x3+v3x,y3+v3y);
}


function createCSR(x,y) //Caligraphy Stroke Render
{    
    return (x1,y1,x2,y2,x3,y3)=>{
        return `M ${x1-x} ${y1-y} Q ${x2-x} ${y2-y} ${x3-x} ${y3-y}` +
               `L ${x3+x} ${y3+y}  `+
               `Q ${x2+x} ${y2+y} ${x1+x} ${y1+y} Z`;

    } ;
}