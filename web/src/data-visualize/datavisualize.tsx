import React from 'react';
import samples from '../../../data/dataset/samples.json';
import { site } from '../constants';
import GraphTable from '../graph/Graphtable';
import dataSample from '../../../data/dataset/features.json';
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
  const groupedSamples = groupBy(samples, 'student_id');
  console.log(dataSample)
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
        <GraphTable
          samples={dataSample.samples}
        />
      </div>
    </div>
  );
};

export default DataVisuale;
