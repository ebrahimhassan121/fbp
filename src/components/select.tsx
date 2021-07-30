import React from 'react'
import { FormControl, InputLabel, Select,FormHelperText} from '@material-ui/core'

interface Props {
    cities: string[],
    placeHolder: string,
    handleChange: (cityName: string) => void,
    disabled?: boolean,
    error?:string,
    value: string,
    onBlur?:()=>void
}

export default function SelectComponent(props: Props) {
    const { value, handleChange, placeHolder, cities,disabled,error,onBlur } = props
    return (
        <div>
            <FormControl 
            
            error={error?true:false}  style={{width:"100%"}}>
                <InputLabel htmlFor={"select_"+placeHolder}>{placeHolder}</InputLabel>
                <Select
                disabled={disabled}
                onBlur={onBlur}
                    native
                    value={value}
                    onChange={(e) => {
                        handleChange(e.currentTarget.value + "")
                    }}
                    inputProps={{
                        name: placeHolder,
                        id:"select_"+placeHolder
                    }}
                >
                    <option aria-label="None" value={""} disabled={true} />
                    {cities.map(e => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </Select>
                <FormHelperText>{error}</FormHelperText>
            </FormControl>
        </div>
    )
}
