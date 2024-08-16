import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import url from './url_toggle'

export default function Picker({ driver, setDriver, drivers, setDrivers, open, setOpen }) {

    // const port = driver?.firstName === 'testing' ? '9999' : '9999'

    useEffect(() => {
        axios.get(`${url}/driver/fetchDrivers`)
            .then(res => {
                let drivers = res.data
                drivers = drivers.map(driver => { return { label: driver.firstName + ' ***-' + driver.phone.slice(-4), value: { ...driver, confirmed: false } } })
                setDrivers(drivers)
            })
            .catch(e => console.log('driver dropdown error: ', e))

    }, [])

    return (
        // <View style={{height:300, backgroundColor:null}}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                }}>
                <DropDownPicker
                    dropDownContainerStyle={{
                        // zIndex: 1000,
                        backgroundColor: "rgba(255,255,255,1)",
                        // height:300
                        opacity: 1
                    }}
                    itemKey="label"
                    // maxHeight={200}
                    open={open}
                    onClose={()=>setOpen(false)}
                    value={driver}
                    items={drivers}
                    setOpen={setOpen}
                    setValue={setDriver}
                    setItems={setDrivers}
                    placeholder={'Choose a driver.'}
                />
            </View>

        
        // </View>
    );
}