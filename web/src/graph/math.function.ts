export const mathcustom={
    lerp:(a:number,b:number,t:number)=>{
        return a + (b - a) * t;
    },
    formatNumber:(n:number,dec=0)=>{
        return n.toFixed(dec);
    },
    invlerp:(a:number,b:number,v:number)=>{
        if (a === b) return 0;
        return (v - a) / (b - a);
    },
    remap:(a:number,b:number,c:number,d:number,v:number)=>{
        if (a === b) return c;
        if (c === d) return v;
        const t = mathcustom.invlerp(a, b, v);
        return mathcustom.lerp(c, d, t);
    }
}