export const features={
    getPathCount: (paths) => {
        return paths.length;
    },
    getPointCount: (paths) => {
        return paths.flat().length;
    },
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = features;
}