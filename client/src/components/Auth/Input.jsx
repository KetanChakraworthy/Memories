import React from 'react'

//Material UI
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core'
import Visibilty from '@material-ui/icons/Visibility';
import VisibiltyOff from '@material-ui/icons/VisibilityOff';


export default function Input({ half, name, label, autoFocus, handleChange, type, handleShowPassword }) {
    
    return (
        <Grid item xs={12} sm={half ? 6 : 12} >
            <TextField
                name={name}
                label={label}
                onChange={handleChange}
                autoFocus={autoFocus}
                type={type}
                InputProps={name === 'password' ? {
                    endAdornment: (
                        <InputAdornment position='end' >
                            <IconButton onClick={handleShowPassword} >
                                {type === 'password' ? <Visibilty /> : <VisibiltyOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                } : null}
                variant='outlined'
                fullWidth
                required
            />
        </Grid>
  )
}
