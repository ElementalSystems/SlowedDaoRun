var renderCs = {
  ls: {
    ptI: 'ls',
  },
  lp: {
    ptI: 'lp',
  },
}


function mkParams(rcl, base) {
  let o = {
    ...base
  };
  if (rcl)
    rcl.forEach((rc)=>{
      o.cssCls = o.cssCls ? o.cssCls + ' ' + rc : rc;
      Object.assign(o, renderCs[rc])
    });
  return o;
}
