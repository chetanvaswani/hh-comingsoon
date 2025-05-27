"use client"
import React, {useState , useEffect, useCallback} from "react";
import { CiMobile1 } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/RingLoader";

export default function Home() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [currLocation, setCurrLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    ip: "",
    userAgent: "",
    platform: "",
    language: "",
    screenResolution: "",
    deviceName: "",
    model: "",
  });
  const [onWaitlist, setOnWaitlist] = useState(false)

  useEffect(() => {
    const checkWaitlistToken = () => {
      const waitlistToken = localStorage.getItem("waitlistToken");
      if (waitlistToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(waitlistToken);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded && typeof decoded.exp === "number" && decoded.exp > currentTime) {
            setOnWaitlist(true);
          } else {
            setOnWaitlist(false);
            localStorage.removeItem("waitlistToken"); 
          }
        } catch (error) {
          console.error("Invalid waitlist token:", error);
          setOnWaitlist(false);
          localStorage.removeItem("waitlistToken");
        }
      } else {
        setOnWaitlist(false);
      }
    };
    checkWaitlistToken();
  }, []);

  const getDeviceDetails = useCallback((userAgent: any) => {
    const devicePatterns = [
      { pattern: /iPhone/, name: "iPhone", modelPattern: /(iPhone[\d,]+)/ },
      { pattern: /Android/, name: "Android", modelPattern: /; ([^;)]+)/ },
      { pattern: /iPad/, name: "iPad", modelPattern: /(iPad[\d,]+)/ },
      { pattern: /Windows Phone/, name: "Windows Phone", modelPattern: /; ([^;)]+)/ },
      { pattern: /Macintosh|Mac OS X/, name: "Mac", modelPattern: null },
      { pattern: /Windows/, name: "Windows", modelPattern: null },
      { pattern: /Linux/, name: "Linux", modelPattern: null },
    ];

    for (const device of devicePatterns) {
      if (device.pattern.test(userAgent)) {
        const modelMatch = device.modelPattern ? userAgent.match(device.modelPattern) : null;
        const model = modelMatch ? modelMatch[1] || "Unknown" : "N/A";
        return { deviceName: device.name, model };
      }
    }
    return { deviceName: "Unknown", model: "N/A" };
  }, []);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        
        const browserInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        };

        const { deviceName, model } = getDeviceDetails(browserInfo.userAgent);

        setDeviceInfo({
          ip: data.ip,
          ...browserInfo,
          deviceName,
          model,
        });
      } catch (error) {
        console.error("Failed to fetch device info:", error);
        setDeviceInfo({
          ip: "N/A",
          userAgent: navigator.userAgent || "N/A",
          platform: navigator.platform || "N/A",
          language: navigator.language || "N/A",
          screenResolution: `${window.screen.width}x${window.screen.height}` || "N/A",
          deviceName: "Unknown",
          model: "N/A",
        });
      }
    };
    fetchDeviceInfo();
  }, [getDeviceDetails]);

  useEffect(() => {
    const logVisitor = async () => {
      const token = localStorage.getItem("visitorLogToken");
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token); 
          const currentTime = Math.floor(Date.now() / 1000); 
          // @ts-ignore
          if ( decoded.exp > currentTime) {
            // console.log("valid token");
            return; 
          } else {
            // console.log("token expired");
            localStorage.removeItem("visitorLogToken");
          }
        } catch (error) {
          console.error("Invalid token, proceeding with request:", error);
          localStorage.removeItem("visitorLogToken");
        }
      }

      if (currLocation) {
        try {
          const response = await axios.post("/api/waitlist-visitorlog", {
            latitude: parseFloat(currLocation.latitude),
            longitude: parseFloat(currLocation.longitude),
            address: currLocation.address,
            ...deviceInfo,
          });
          console.log(response.data);
          if (response.data.data.token) {
            localStorage.setItem("visitorLogToken", response.data.data.token);
          }
        } catch (error) {
          console.error("Failed to send visitor log:", error);
        }
      }
    };
    logVisitor();
  }, [currLocation, deviceInfo]);

  useEffect(() => {
    const isNameValid = name.trim().length > 0;
    const mobileRegex = /^\d{10}$/;
    const isMobileValid = mobileRegex.test(mobile);
    setDisabled(!(isNameValid && isMobileValid));
  }, [name, mobile]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let digits = value.replace(/\D/g, "");
    if (digits.length > 10) {
      digits = digits.slice(-10);
    }
    setMobile(digits);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const visitorLogToken = localStorage.getItem("visitorLogToken");
      let visitorLogId: number | undefined;
      if (visitorLogToken) {
        const decoded = jwtDecode<JwtPayload>(visitorLogToken);
        visitorLogId = decoded.logId;
      }

      const response = await axios.post("/api/waitlist", {
        name,
        mobileNumber: mobile,
        visitorLogId, // undefined if theres no visitorLogToken
      });

      console.log("Added to waitlist:", response.data);

      if (response.data.token) {
        localStorage.setItem("waitlistToken", response.data.token);
        setOnWaitlist(true)
      }
    } catch (error) {
      console.error("Failed to add to waitlist:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="h-svh w-full bg-black flex justify-center overflow-hidden ">
      <video loop autoPlay muted playsInline preload="metadata" className="h-full w-full fixed top-0 left-0">
          <source src="/comingsoon.MP4" type="video/mp4" />
          Your browser does not support the video.
      </video>
      <div className="relative top-[45%] left-0 flex flex-col w-full items-center gap-7">
        {
          !onWaitlist ?
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="text-white/90 tracking-wider font-bold text-3xl ">JOIN OUR WAITLIST</div>
              <div className="text-sm w-[80%] text-white/70 text-center max-w-[400px]">GET DISCOUNT COUPONS AND A CHANCE TO WIN FREE SERVICE ON OUR LAUNCH DATE</div>
            </div>
            <div className="w-full flex flex-col items-center gap-4">
              <div className=" gap-1 rounded-md p-3 w-[80%] max-w-[400px] flex justify-start shadow-md h-[50px] border-2 border-white/50 items-center ">
                <CiUser className="size-7 text-white/70" />
                <input type="text" placeholder="Enter Your Name" className=" w-full outline-0 p-1 rounded-md" value={name} onChange={handleNameChange} />
              </div>
              <div className=" gap-1 rounded-md p-3 w-[80%] max-w-[400px] flex justify-start shadow-md h-[50px] border-2 border-white/50 items-center ">
                <CiMobile1 className="size-7 text-white/70" />
                <p className="text-white/70">+91</p>
                <input type="text" placeholder="Enter Your Mobile Number" inputMode="numeric" className=" w-full outline-0 p-1 rounded-md" value={mobile} onChange={handleMobileChange}  />
              </div>
              <button disabled={disabled || loading} className="h-[40px] montserrat-font cursor-pointer bg-white/90 disabled:opacity-[50%] text-black flex items-center gap-2 justify-center w-[200px] rounded-md font-semibold" onClick={handleSubmit}>
                {
                  loading && <Loader />
                }
                {
                  loading ? "ON IT!" : "SUBMIT"
                }
              </button>
            </div>
          </> : 
          <div className="flex flex-col items-center mt-7">
            <div className="font-bold text-2xl">
              YOU ARE ON OUR WAITLIST!
            </div>
            <div className="text-sm">
              AND IT'S AN HONOR TO HAVE YOU ON BOARD.
            </div>
            <div className="w-[80%] text-center mt-7 text-sm">
              WE WILL ADD A COUPON TO YOUR HELPING HANDS ACCOUNT AS A TOKEN OF APPRECIATION. YOU CAN LOGIN VIA YOUR MOBILE NUMBER WITHIN 30 DAYS OF LAUCH TO REDEEM IT.
            </div>
          </div>
        }
      </div>
      <LocationPermissionModal currLocation={currLocation} setCurrLocation={setCurrLocation} />
    </div>
  );
}
