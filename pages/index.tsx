import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Data } from "../data/itnerface";
import { getEnvironmentData } from "worker_threads";
import { getData } from "../data/data";

const firstData = {
  ip: "8.8.8.8",
  location: {
    country: "US",
    region: "California",
    city: "Mountain View",
    lat: 37.40599,
    lng: -122.078514,
    postalCode: "94043",
    timezone: "-07:00",
    geonameId: 5375481,
  },
  domains: [
    "0d2.net",
    "003725.com",
    "0f6.b0094c.cn",
    "007515.com",
    "0guhi.jocose.cn",
  ],
  as: {
    asn: 15169,
    name: "Google LLC",
    route: "8.8.8.0/24",
    domain: "https://about.google/intl/en/",
    type: "Content",
  },
  isp: "Google LLC",
};

export async function getServerSideProps(context: any) {
  let ip;

  const { req } = context;

  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(",")[0];
  } else {
    ip = req.connection.remoteAddress;
  }
  return {
    props: {
      ip,
    },
  };
}

export default function Home({ ip }: any) {
  const [ipAddress, setIpAddress] = useState("8.8.8.8");
  const [location, setLocation] = useState<Data>(firstData);
  const city = location.location.city;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    getData(ipAddress).then((result) => setLocation(result));
  };

  useEffect(() => {
    if (ip != "::1") {
      setIpAddress(ip);
      getData(ip).then((result) => setLocation(result));
    }
  }, [ip]);

  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import("../component/Map"), {
        ssr: false,
      }),
    [location]
  );
  return (
<main>
        <div className="background">
          <div id="map">
            <MapWithNoSSR
              location={[location.location.lat, location.location.lng]} />
          </div>
        </div>
        <h4>IP ADDRESS TRACKER</h4>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="submit">
              <input
                value={ipAddress}
                onChange={(e: any) => setIpAddress(e.target.value)} />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                  <path d="M6 40V8l38 16Zm3-4.65L36.2 24 9 12.5v8.4L21.1 24 9 27Zm0 0V12.5 27Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="data">
          <div className="item">
            <h5>IP ADDRES</h5>
            <p>{location.ip}</p>
          </div>
          <div className="item">
            <h5>LOCATION</h5>
            <p>{city},{location.location.region},{location.location.postalCode}</p>
          </div>
          <div className="item">
            <h5>TIMEZONE</h5>
            <p>UTC {location.location.timezone}</p>
          </div>
          <div className="item">
            <h5>ISP</h5>
            <p>{location.isp}</p>
          </div>
        </div>
      </main>
  );
}
