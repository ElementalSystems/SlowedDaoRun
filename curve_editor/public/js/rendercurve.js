const pMap={
  ls: i => (i%2)?' ':((i%4)?' L ':' M '), //sequence of lines
  lp:  i => i?((i%2)?' ':' L '):'M ',  //path of connected line segments
  cs:  i => (i%6)?((i%6==2)?' Q ':' '):' M ', //series of cubic b curves
  cp: i => i?((i==2)?' Q ':((i<6)||(i%2))?' ':' T '):'M ', //smooth path of cubic b curves
  qs:  i => (i%8)?((i%8==2)?' C ':' '):' M ', //series of quad b curves
  qp:  i => i?((i==2)?' C ':((i<8)||(i%4))?' ':' S '):'M ', //smooth path of quad b curves
}

function drawCurve(data)
{
  return data.map((v,i)=>(pMap.cs(i)+v)).join('');
}
