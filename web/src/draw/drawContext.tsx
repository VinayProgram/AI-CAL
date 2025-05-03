import React, { createContext, useState } from 'react';

// 1. Define a type for the context value
type DrawContextType = {
  paths: number[][][];
  setPaths: React.Dispatch<React.SetStateAction<number[][][]>>;
  context:CanvasRenderingContext2D|null|undefined;
  setContext: React.Dispatch<CanvasRenderingContext2D|null>;
};

// 2. Create context with the correct type (initial value is null or DrawContextType)
const DrawContext = createContext<DrawContextType | null>(null);

// 3. Create provider component
const DrawGetSetData = (props: React.PropsWithChildren) => {
  const [paths, setPaths] = useState<number[][][]>([]);
    const [context,setContext]=React.useState<CanvasRenderingContext2D|null >()

  return (
    <DrawContext.Provider value={{ paths, setPaths, context,setContext }}>
      {props.children}
    </DrawContext.Provider>
  );
};

export { DrawGetSetData };
export default DrawContext;
