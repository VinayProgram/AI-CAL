import { mathcustom } from "./math.function";
import './graph.css';
import GraphView from "./graphView";
export interface GraphTableProps {
    samples: samplestype[];
}
const samples: samplestype[] = [
    { id: 1, label: 'A', point: [100, 200] },
    { id: 2, label: 'B', point: [150, 250] },
    { id: 3, label: 'C', point: [200, 300] },
    { id: 4, label: 'D', point: [250, 350] },
    { id: 5, label: 'E', point: [300, 400] }
];

const GraphTable = ({samples}:GraphTableProps) => {

    return (
            <GraphView options={
                {
                    size: 500
                }
            } 
            samples={samples}
            />
    )
}

export interface samplestype {
    id: number;
    label: string;
    point: number[];
}
export default GraphTable
