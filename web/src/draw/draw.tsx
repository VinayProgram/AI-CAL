import React from 'react';
import './draw.css'
import SketchPad from './sketchPad';
import DrawContext from './drawContext';
const Draw = () => {
  const [data,setData]=React.useState<{
    student:string,
    session:number,
    drawings:{}
 }>({
    student:"",
    session:new Date().getTime(),
    drawings:{}
 })
 const dataContext = React.useContext(DrawContext)
    
 const labels=[1,2,3,4,5,6,7,8,9,10];
 let index=0
  const start=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    if(data.student==""){
      alert("Please type your name first!");
      return;
   }
  }

  const onNext=()=>{
    setData({...data,['drawings']:{
      [labels[index]]:dataContext?.paths
    }})
    dataContext?.setPaths([])
  }


  return (
    <div id="content">
       <h1>Data Drawing</h1>
       {data.student.length>=1&&<h1>Draw {labels[index]}</h1>}
       <div>
            <input id="student" type="text"
              onChange={(e)=>setData({...data,['student']:e.currentTarget.value})}
               placeholder="type your name"/>
            <span id="instructions"></span>
            <button id="advanceBtn" onClick={start}>
               START 
            </button>
            <button onClick={onNext}>next</button>
        </div>
       {data.student.length>=1&&<SketchPad/>}
       
    </div>
  )
}

export default Draw
