const features={
    getPathCount: (paths) => {
        return paths.length;
    },
    getPointCount: (paths) => {
        return paths.flat().length;
    },
    getWidth:(paths) => {
        const points = paths.flat();
        const xValues = points.map(point => point[0]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);  
        return maxX - minX;
    },
    getHeight:(paths) => {
        const points = paths.flat();
        const yValues = points.map(point => point[1]);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);  
        return maxY - minY;
    },
}

features["inUse"]=[
{
    name:"Width",
    function: features.getWidth,
},
{
    name:"Height",
    function: features.getHeight,
}
]

export default features;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = features;
}