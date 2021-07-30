// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { iDeal, IGraphObjec, sortType } from '@/utiles/ideal';
import type { NextApiRequest, NextApiResponse } from 'next';
import DealsData from './response.json'
import {dijkstra} from '../../utiles/dijkstra'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<iDeal[]>,
) {
    const { departure, arrival } = req.query;
    const sort: sortType = req.query.sort == "Fastest" ? "Fastest" : "Cheapest"
    let data: iDeal[] = []
    if (departure && arrival) {
        data = getBestPath(departure + "", arrival + "", sort)
    } else {
        data = DealsData.deals
    }
    res.status(200).json(data);
}

const getBestPath = (departure: string, arrival: string, sort: sortType) => {
    const cities = DealsData.deals;
    const graph = generateGraph(departure, arrival, sort);
    const Graph = require('node-dijkstra')
    const route = new Graph()
    Object.keys(graph).forEach(e => {
        route.addNode(e, graph[e])
    })
    const graphResult = route.path(departure, arrival, { trim: true })
    let prevCity = departure;
    const path = graphResult//dijkstra(graph,departure,arrival).path;
    const paths: iDeal[] = [];
    path.forEach((e: string, i: number) => {
        const [comeToCityBy, city] = e.split("_to_");
        const pathEleme: iDeal|undefined = cities.find(ele => ele.transport == comeToCityBy && ele.departure == prevCity && ele.arrival == city)
        if(pathEleme)paths.push(pathEleme);
        // handle loop case 
        if(paths.find(e=>e.departure==departure&&e.arrival==arrival))return;

        prevCity = city
        if (i == path.length - 1) {
            const endPossiblePaths:iDeal[] = []
            Object.keys(graph[e]).forEach(e => {
                const [transport, city] = e.split("_to_")
                if (city == arrival) {
                    const endPathPossibleEleme: iDeal|undefined = cities.find(ele => ele.transport == transport && ele.departure == prevCity && ele.arrival == arrival)
                    if(endPathPossibleEleme) endPossiblePaths.push(endPathPossibleEleme)
                }
            })
            const arrivalNode = endPossiblePaths.sort((a, b) => {
                let weightValueA;
                let weightValueB;
                if (sort == 'Cheapest') {
                    weightValueA = a.cost - (a.cost * a.discount / 100);
                    weightValueB = b.cost - (b.cost * b.discount / 100);
                } else {
                    weightValueA = (Number(a.duration.h) * 60) + Number(a.duration.m)
                    weightValueB = (Number(b.duration.h) * 60) + Number(b.duration.m)
                }
                return weightValueA - weightValueB
            })[0]
            paths.push(arrivalNode)
        }
    })
    return paths


}

const generateGraph = (departure: string, arrival: string, sort: sortType) => {
    const cities = DealsData.deals;

    const _g: IGraphObjec = {}
    cities.forEach(e => {
        if (e.arrival == departure) return;
        let weightValue;
        if (sort == 'Cheapest') {
            weightValue = e.cost - (e.cost * e.discount / 100);
        } else {
            weightValue = (Number(e.duration.h) * 60) + Number(e.duration.m)
        }

        //initialze Depature where can go
        if (e.departure == departure) {
            const node = e.transport + "_to_" + e.arrival
            if (_g[departure]) _g[departure][node] = weightValue;
            else _g[departure] = { [node]: weightValue }
        }
        //initialze arraival where can be reached
        if (e.arrival == arrival) {
            const node = e.transport + "_to_" + e.departure
            if (_g[node]) _g[node][arrival] = weightValue;
            else _g[node] = { [arrival]: weightValue };
        }
        const parentNode = e.transport + "_to_" + e.departure
        const childNode = e.transport + "_to_" + e.arrival;
        // initialize all possible routes where can go
        if (_g[parentNode]) {
            _g[parentNode][childNode] = weightValue
        } else {
            _g[parentNode] = { [childNode]: weightValue }
        }

    })
    return _g
}