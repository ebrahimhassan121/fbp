import React from 'react'
import {iDeal} from '../utiles/ideal'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {makeStyles,styled} from '@material-ui/core/styles';

interface IProps{
    data:iDeal[]
}
const useStyles = makeStyles({
    container: {
      background: '#f4f4f4',
      border: 0,
      borderRadius: 3,
      padding:8,
      margin:4
    },
    fromToContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        width:"100%"
    },
    priceText:{
        fontWeight:'bold'
    },
    planeReferance:{
        fontSize:'0.8rem',
        fontStyle:"italic",
    },
    planeReferanceTransport:{
        fontSize:"1rem"
    },
    totalContainer:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }
  });
  

export default function TripsSorter(props:IProps) {
    const {data}=props
    const classes = useStyles();
    const totalMinutes=data.reduce((r,element)=>r+(Number(element.duration.h)*60)+Number(element.duration.m),0 );
    const totalCost:number=data.reduce((r,element)=>(r+(element.cost-(element.cost*element.discount/100))),0);
    return (
        <Box>
        <Typography className="title"  component='h3'>Trips Sorter</Typography>
        {data.map(e=>(
          <Box className={classes.container}>
              <Box className={classes.fromToContainer}>
                  <Typography component='h6'>{`${e.departure} > ${e.arrival}`} </Typography>
                  <Typography className={classes.priceText} component='h6'>{`${e.cost-(e.cost*e.discount/100)}`} </Typography>
              </Box>
              <Typography className={classes.planeReferance} component='h6'><b className={classes.planeReferanceTransport}>{e.transport}</b> {e.reference}  for {e.duration.h}h{e.duration.m} </Typography>
          </Box>
        ))}
        {data.length>0&&
                      <Box className={[classes.container,classes.totalContainer,]}>
                          <Typography component='h6'>{"Total"} </Typography>
                          <Typography component='h6'>{`${Math.floor(totalMinutes / 60)}h:${totalMinutes % 60}`} </Typography>
                          <Typography className={classes.priceText}  component='h6'>{totalCost} </Typography>
            </Box>}
        </Box>
    )
}

