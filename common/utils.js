export const utils={};

utils.flaggedUsers=
   [1663882102141,1663900040545,1664485938220];

utils.formatPercent=(n)=>{
   return (n*100).toFixed(2)+"%";
}

utils.printProgress=(count,max)=>{
   process.stdout.clearLine();
   process.stdout.cursorTo(0);
   const percent=utils.formatPercent(
      count/max
   );
   process.stdout.write(count+"/"+max+
      " ("+percent+")"
   );
}

utils.groupBy=(objArray,key)=>{
   const groups={};
   for(let obj of objArray){
      const val=obj[key];
      if(groups[val]==null){
         groups[val]=[];
      }
      groups[val].push(obj);
   }
   return groups;
}

utils.invLerp=(x, min, max) => {

   return (x - min) / (max - min);
}

utils.normalizePoints=(points,minMax)=>{
   let min,max;
   const dimensions=points[0].length;
   if(minMax){
      min=minMax.min;
      max=minMax.max;
   }
   else {
   min=[...points[0]];
   max=[...points[0]];
   for (let index = 0; index < points.length; index++) {
      for (let j = 0; j < dimensions; j++) {
      min[j]=Math.min(min[j],points[index][j]);
      max[j]=Math.max(max[j],points[index][j]);
      }
   }
}
   for (let index = 0; index < points.length; index++) {
      for (let j = 0; j < dimensions; j++) {
         points[index][j]=utils.invLerp(
            points[index][j],min[j],max[j]
         );
      }
   }
   return {min, max};
}
export default utils;
if(typeof module!=='undefined'){
   module.exports=utils;
}