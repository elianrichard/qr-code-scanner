"use client";

import {
  Scanner,
  useDevices,
  type IDetectedBarcode,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("boundingBox");
  const [rawValue, setRawValue] = useState<string>("");

  const [pause, setPause] = useState(true);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const isCameraSelected = useRef(false);

  useEffect(() => {
    if (isCameraSelected.current) return;
    if (
      !deviceId &&
      devices.length > 0 &&
      !isCameraSelected.current &&
      devices[0]
    ) {
      setDeviceId(devices[0].deviceId);
      isCameraSelected.current = true;
    }
  }, [deviceId, devices]);

  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    setRawValue(detectedCodes[0]?.rawValue ?? "");
  }, []);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <button
        className="rounded-md bg-blue-300 p-2"
        onClick={() => setPause((val) => !val)}
      >
        {pause ? "Play" : "Pause"}
      </button>
      <select onChange={(e) => setDeviceId(e.target.value)} value={deviceId}>
        <option value={undefined}>Select a device</option>
        {devices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>

      <select onChange={(e) => setTracker(e.target.value)}>
        <option value="centerText">Center Text</option>
        <option value="outline">Outline</option>
        <option value="boundingBox">Bounding Box</option>
        <option value={undefined}>No Tracker</option>
      </select>
      <div className="aspect-square w-80 overflow-hidden rounded-xl">
        <Scanner
          formats={["qr_code"]}
          constraints={{
            deviceId: deviceId,
          }}
          onScan={(detectedCodes) => {
            handleScan(detectedCodes);
          }}
          onError={(error) => {
            console.log(`onError: ${error as string}'`);
          }}
          components={{
            finder: false,
            tracker: getTracker(),
          }}
          sound={true}
          allowMultiple={true}
          scanDelay={2000}
          paused={pause}
        />
      </div>

      <p className="text-center">
        Scanned Barcode Raw Value:
        <br />
        {rawValue}
      </p>
    </main>
  );
}
