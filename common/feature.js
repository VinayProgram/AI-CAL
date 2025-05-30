const features={
    getPathCount: (paths) => {
        return paths.length;
    },
    getPointCount: (paths) => {
        return paths.flat().length;
    },
}
export default features;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = features;
}