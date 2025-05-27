import React from "react";
import axios from "axios";
import { useCallback, useEffect } from "react";

export default function LocationPermissionModal({currLocation, setCurrLocation}: any){
    const showPosition = useCallback((position: GeolocationPosition) => {
        const params = new URLSearchParams();
        params.append("latlng", `${position.coords.latitude},${position.coords.longitude}`);
        params.append("api_key", process.env.NEXT_PUBLIC_OLA_API_KEY || "");
        const queryString = params.toString();
        const url = `${process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL}?${queryString}`;
        axios.get(url, {}).then(async (res) => {
            console.log({
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString(),
                address: res.data.results[0].formatted_address
            })
            setCurrLocation({
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString(),
                address: res.data.results[0].formatted_address
            })
        })
      }, [])
    
      useEffect(() => {
        if(currLocation === null){
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    showPosition(position)
                }, (error) => {
                    console.error("Error in getCurrentPosition", error);
                    setCurrLocation(null)
                },
                {
                    enableHighAccuracy: true, 
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
      }, [])


    return <></>
}