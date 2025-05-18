import samples from '../../../data/dataset/samples.json';
import { site } from '../constants';
import React from 'react';

// GroupBy Utility
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

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      {Object.entries(groupedSamples).map(([studentId, records]) => (
        <div key={studentId} style={{ marginBottom: '40px' }}>
          <h3>Student ID: {studentId}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {records.map((sample) => (
                  <td key={sample.id} style={{ textAlign: 'center', padding: '10px' }}>
                    <img
                      src={`${site}images/${sample.id}.png`}
                      alt={sample.student_name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <div style={{ marginTop: '8px' }}>{sample.student_name}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DataVisuale;
