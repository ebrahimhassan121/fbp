import Head from 'next/head';
import Image from 'next/image';
import { ButtonGroup,CircularProgress, makeStyles } from '@material-ui/core'
import styles from '@/styles/Home.module.css';
import SelectComponent from '@/components/select';
import { fetchDealsApi } from '../utiles/fetch-deals'
import { Formik } from 'formik'
import * as yup from 'yup'
import { iDeal, sortType } from '@/utiles/ideal';
import { Search } from '@material-ui/icons'
import { useCallback } from 'react';
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TripsSorterResult from '@/components/trips-sorter'
interface IProps {
  deals: iDeal[]
}

const defaultSort: sortType = 'Cheapest'
const defaultResults:iDeal[]=[]
// [{"transport":"train","departure":"London","arrival":"Amsterdam","duration":{"h":"05","m":"00"},"cost":160,"discount":0,"reference":"TLA0500"},{"transport":"bus","departure":"London","arrival":"Amsterdam","duration":{"h":"07","m":"45"},"cost":40,"discount":25,"reference":"BLA0745"},{"transport":"car","departure":"London","arrival":"Amsterdam","duration":{"h":"04","m":"45"},"cost":120,"discount":0,"reference":"CLA0445"},]
function Home(props: IProps) {
  const cities = [...new Set(props.deals?.map(e => e.departure))]
  const classes = useStyle();
  return (
    <div className={styles.container}>
      <Head>
        <title>Select Best Path </title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Select Best Path - Dijkstra
        </h1>
        <Formik
          initialValues={{
            depature: "",
            arraival: "",
            sort: defaultSort,
            loading:false,
            results:defaultResults
          }}
          validationSchema={yup.object().shape({
            depature: yup.string().required("Field is required"),
            arraival: yup.string().required("Field is required"),
          })}
          onSubmit={async(values,{setFieldValue,setValues}) => {
            const {depature,arraival,sort}=values;
            setFieldValue('loading',true)
            await fetchDealsApi(sort,depature,arraival).then(deals=>{
              setValues({...values,results:deals,loading:false})
            })
           }}
           
        >
          {({ values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            setFieldValue,
            setFormikState,
            setValues,
            isValid,
            handleSubmit, }) => {
            const ArrivalCities = useCallback(() => {
              const arraivalList: string[] = [];
              props.deals.forEach(e => {
                if (e.departure == values.depature && !arraivalList.includes(e.arrival)) {
                  arraivalList.push(e.arrival);
                }
              })
              return arraivalList;
            }, [values.depature])
            return <div className={classes.formContainer} >
              <SelectComponent error={touched.depature&&errors.depature?errors.depature:undefined} cities={cities} placeHolder="Depature" key="Depature" handleChange={(value) => {
                setValues({
                  ...values,
                  arraival: "",
                  depature: value,
                })
              }} value={values.depature}
              onBlur={()=>{setFieldTouched("depature")}}
              />
              <SelectComponent cities={cities.filter(e=>e!==values.depature)} placeHolder="Arraival" key="Arraival"
                disabled={!values.depature}
                handleChange={(value) => {
                  setFieldValue("arraival", value)
                }} value={values.arraival}
                error={touched.arraival&&errors.arraival?errors.depature:undefined}
                onBlur={()=>{setFieldTouched("arraival")}}
                 />
              <br />
              <div className={classes.sortSubmitContainer}>
                <ButtonGroup  style={{margin:8}} color="primary" variant='contained' >
                  <Button color={values.sort == 'Cheapest' ? "primary" : "default"} onClick={() => { setFieldValue("sort", "Cheapest") }} >Cheapest</Button>
                  <Button color={values.sort !== 'Cheapest' ? "primary" : "default"} onClick={() => { setFieldValue("sort", "Fastest") }}  >Fastest</Button>
                </ButtonGroup>
                <Button  style={{margin:8}}  endIcon={values.loading?<CircularProgress />:<Search />} onClick={()=>{handleSubmit()}}
                  variant='contained' color='primary'>Search</Button>
              </div>
              <div>
                <TripsSorterResult data={values.results}/>
              </div>
            </div>
          }}

        </Formik>

      </main>
    </div>
  );

}
const useStyle=makeStyles({
  formContainer:{
    width:"100%"
  },
  sortSubmitContainer:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',flexWrap:'wrap' }
})
export async function getServerSideProps() {
  const deals = await fetchDealsApi()
  return {
    props: {
      deals
    },
  };

}
 export default Home;