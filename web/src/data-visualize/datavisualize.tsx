import React from 'react';
import samples from '../../../data/dataset/samples.json';
import { site } from '../constants';
import GraphTable from '../graph/Graphtable';
import dataSample from '../../../data/dataset/features.json';
import GraphView from '../graph/graphView';
import SketchPad from '../draw/sketchPad';
import Draw from '../draw/draw';
import DrawContext from '../draw/drawContext';
//@ts-ignore
import d from '../../../common/feature.js'
type GroupByKey<T> = keyof T;

export function groupBy<T>(objArray: T[], key: GroupByKey<T>): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const obj of objArray) {
    const val = String(obj[key]);
    if (!groups[val]) {
      groups[val] = [];
    }
    groups[val].push(obj);
  }
  return groups;
}

const DataVisuale: React.FC = () => {
    const dataContext = React.useContext(DrawContext);
    const [point, setPoint] = React.useState<[number, number]>([0, 0]);

    React.useEffect(() => {    
      setPoint([d.getPathCount(dataContext?.paths),d.getPointCount(dataContext?.paths) ]);
  }, [dataContext?.paths]);

  const groupedSamples = groupBy(samples, 'student_id');
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: 'white', padding: '20px', boxSizing: 'border-box' }}>
      {/* Left Side */}
      <div style={{ width: '60%', overflowY: 'auto', paddingRight: '20px' }}>
        {Object.entries(groupedSamples).map(([studentId, records]) => (
          <div key={studentId} style={{ marginBottom: '40px' }}>
            <h3>Student ID: {studentId}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {records.map((sample) => (
                <div key={sample.id} style={{ textAlign: 'center' }}>
                  <img
                    src={`${site}images/${sample.id}.png`}
                    alt={sample.student_name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>{sample.student_name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Side */}
      <div >
        <GraphView options={
                {
                    size: 500,
                    labels: [...dataSample.featureNames],
                }
            } 
            samples={dataSample.samples}
            dyanamicPoint={point}
            />
          <SketchPad/>
        </div>

    </div>
  );
};

export default DataVisuale;
