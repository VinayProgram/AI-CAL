import React from "react";
import "./draw.css";
import SketchPad from "./sketchPad";
import DrawContext from "./drawContext";
const Draw = () => {
  const [data, setData] = React.useState<{
    student: string;
    session: number;
    drawings: {};
  }>({
    student: "",
    session: new Date().getTime(),
    drawings: {},
  });

  const [index, setIndex] = React.useState<number>(0);
  const [instructions, setInstructions] = React.useState<string>();
  const dataContext = React.useContext(DrawContext);
  const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const start = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (data.student == "") {
      alert("Please type your name first!");
      return;
    }
    const label=labels[index];
    setInstructions("Please draw a "+label);
  };
  const onNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIndex((i) => i + 1);
    if (index < labels.length) { 
      setData((prev) => ({
        ...prev,
        drawings: {
          ...prev.drawings,
          [labels[index]]: dataContext?.paths || [],
        },
      }));
      dataContext?.reset();
    } else {
      setInstructions("Thank you! All drawings saved.");
      const element=document.createElement('a');
            element.setAttribute('href', 
               'data:text/plain;charset=utf-8,'+
               encodeURIComponent(JSON.stringify(data))
            );

            const fileName=data.session+".json";
            element.setAttribute('download', fileName);

            element.style.display='none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
    }
  };

  return (
    <div id="content">
      <h1>Data Drawing</h1>
      {data.student.length >= 1 && <h5>Draw {labels[index]}</h5>}
      <div>
        <input
          id="student"
          type="text"
          onChange={(e) =>
            setData({ ...data, ["student"]: e.currentTarget.value })
          }
          placeholder="type your name"
        />
        <button id="advanceBtn" onClick={start}>
          START
        </button>
        <br />
        {instructions}
      </div>
      {data.student.length>=1&& <SketchPad key={index} />}
      {data.student.length>=1&&<button onClick={onNext}>next</button>}
    </div>
  );
};

export default Draw;
