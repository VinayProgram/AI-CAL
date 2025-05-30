const fs = require('fs');
const samples = require('../data/dataset/samples.json');
const { features } = require('../common/feature');
for (const sample of samples) {
    const jsonPath = `../data/dataset/json/${sample.id}.json`;
    const paths = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    sample["point"]=[features.getPathCount(paths), features.getPointCount(paths)]
}

const featureNames=["path count", "point count"];
fs.writeFileSync('../data/dataset/features.json', JSON.stringify({
    featureNames,
    samples: samples.map(sample => {
        return {
            id: sample.id,
            label: sample.label,
            point: sample.point
        };
    })
}, null), 'utf8');