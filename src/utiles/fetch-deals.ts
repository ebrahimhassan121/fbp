import Axios from 'axios'
import {sortType} from '../utiles/ideal'

export const fetchDealsApi=  async (sort:sortType='Cheapest',departure?:string,arrival?:string,) => {
    let fetchUrl="http://localhost:3000/api/deals";
    if(departure&&arrival){
        fetchUrl+=`?departure=${departure}&arrival=${arrival}&sort=${sort}`
    }
    return await Axios.get(fetchUrl).then(response=>{
        return response.data
    }).catch(err=>{
        console.log(err);
        return []
    })
}