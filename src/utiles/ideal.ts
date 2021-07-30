

export type transportType="train"|"bus"|"car";
export type sortType ="Cheapest"|"Fastest"
export interface iDeal{
    transport:string,
    departure:string,
    arrival:string,
    duration:{h:string,m:string},
    cost:number,
    discount:number,
    reference:string
}
export interface IGraphObjecElement{
    [key: string]:string|number
}
export interface IGraphObjec{
    [key: string]: IGraphObjecElement|IGraphObjec
}