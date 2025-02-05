import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, TextField, Container, CssBaseline, MenuItem } from '@mui/material';

import AllWeather from "./AllWeather";

import CSCData from "../../../countries_states_cities.json";
import HeadBar from "../../../components/HeadBar";
import { addWeatherReq } from "../../../redux/actions/weatherAction";

export default function DashBoard() {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [data, setData] = useState({
        country: "",
        region: "",
        city: "",
        scale: 'c',
        temp: 0
    });

    const [countryList, setCountryList] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        setCountryList(CSCData);
        if (data.country) {
            const resultRegion = CSCData.filter(item => item.name === data.country);
            const result2Region = resultRegion.map(item => item.states);
            setRegionList(result2Region[0]);
            const resultCities = result2Region[0].filter(item => item.name === data.region);
            const result2Cities = resultCities.map(item => item.cities);
            setCityList(result2Cities[0]);
        }
    }, []);

    const handleInputChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

    };

    const handleCountryValue = (event) => {
        event.preventDefault();
        handleInputChange(event)
        if (event.target.value) {
            const result = CSCData.filter(item => item.name === event.target.value);
            const result2 = result.map(item => item.states);
            setRegionList(result2[0]);
        }
    }

    const handleRegionValue = (event) => {
        event.preventDefault();
        handleInputChange(event)
        if (event.target.value) {
            const result = regionList.filter(item => item.name === event.target.value);
            const result2 = result.map(item => item.cities);
            setCityList(result2[0]);
        }
    }

    const handleCelsius = (e) => {
        setData({ ...data, scale: 'c', temp: e.target.value });
    }

    const handleFahrenheit = (e) => {
        setData({ ...data, scale: 'f', temp: e.target.value });
    }

    const valTemp = data.temp;
    const valScale = data.scale;
    const celsius = valScale === 'f' ? ((valTemp - 32) * 5 / 9).toFixed(2) : valTemp;
    const fahrenheit = valScale === 'c' ? ((valTemp * 9 / 5) + 32).toFixed(2) : valTemp;

    const handleWeatherSubmit = async (e) => {
        e.preventDefault();
        try {
            let responseData = await addWeatherReq({ country: data.country, region: data.region, city: data.city, celsius, fahrenheit });
            if (responseData.error) {
                setData({ ...data, error: responseData.error });
            } else if (responseData.success) {
                setData({
                    country: "",
                    region: "",
                    city: "",
                    scale: 'c',
                    temp: 0
                });
                alert("Weather create successfully!");
                handleClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (<div>
        <HeadBar />
        <hr />
        <Button variant="contained" onClick={handleClickOpen} sx={{ m: 2 }}>
            Add Weather
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Add New Wearther"}
            </DialogTitle>
            <DialogContent>
                <Container>
                    <CssBaseline />
                    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    size="small"
                                    label="Country"
                                    name='country'
                                    value={data.country}
                                    onChange={(event) => handleCountryValue(event)}
                                >
                                    {countryList.map((option) => (
                                        <MenuItem key={option.name} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    size="small"
                                    label="State/Province/Region"
                                    name='region'
                                    value={data.region}
                                    onChange={(event) => handleRegionValue(event)}
                                >
                                    {regionList.map((option) => (
                                        <MenuItem key={option.name} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="city"
                                    select
                                    required
                                    fullWidth
                                    size="small"
                                    label="Town/City"
                                    name='city'
                                    value={data.city}
                                    onChange={handleInputChange}
                                >
                                    {cityList.map((option) => (
                                        <MenuItem key={option.name} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Typography component='h3' variant='h6' sx={{ my: 2 }}>Temperature</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={6} >
                                    <TextField
                                        required
                                        fullWidth
                                        size="small"
                                        label="Celsius"
                                        name='celsius'
                                        value={celsius}
                                        onChange={handleCelsius}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        size="small"
                                        label="Fahrenheit"
                                        name='fahrenheit'
                                        value={fahrenheit}
                                        onChange={handleFahrenheit}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>cancel</Button>
                <Button onClick={handleWeatherSubmit} autoFocus>
                    submit
                </Button>
            </DialogActions>
        </Dialog>
        <AllWeather />
    </div>)
}
