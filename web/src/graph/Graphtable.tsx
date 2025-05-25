import { mathcustom } from "./math.function";
import './graph.css';
import GraphView from "./GraphView";
const GraphTable = () => {
    const samples:samplestype[] = []
    const N = 1000;
    for (let i = 1; i < N; i++) {
        const type = Math.random() < 0.5 ? 'basic' : 'sport';
        const km = mathcustom.lerp(3000, 300000, Math.random());
        const price = mathcustom.remap(3000, 300000, 9000, 900, km) + mathcustom.lerp(-2000, 2000, Math.random()) + (type == 'basic' ? mathcustom.lerp(1000, 3000, Math.random()) : mathcustom.lerp(6000, 10000, Math.random()));
        samples.push({
            id: i,
            label: type,
            point: [km, price],
        })
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>type</th>
                        <th>km</th>
                        <th>price</th>
                    </tr>
                </thead>
                <tbody>
                    {samples.map((sample) => (
                        <tr key={sample.id}>
                            <td>{sample.id}</td>
                            <td>{sample.label}</td>
                            <td>{mathcustom.formatNumber(sample.point[0])}</td>
                            <td>{mathcustom.formatNumber(sample.point[1])}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <GraphView options={
                {
                    size: 500
                }
            } 
            samples={samples}
            />
        </div>
    )
}

export interface samplestype {
    id: number;
    label: string;
    point: number[];
}
export default GraphTable
