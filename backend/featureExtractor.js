const fs = require('fs');
const samples = require('../data/dataset/samples.json');
const  featureDefault  = require('../common/feature');
const features = featureDefault.default;
const utils = require('../common/utils');

for (const sample of samples) {
    const jsonPath = `../data/dataset/json/${sample.id}.json`;
    const paths = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const functions = features.inUse.map(feature => feature.function);
    sample['point']=functions.map(func => func(paths));
}

// Normalize points

const minMax = utils.utils.normalizePoints(samples.map(sample => sample.point));

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

fs.writeFileSync('../data/dataset/minMax.json', JSON.stringify(minMax, null), 'utf8');