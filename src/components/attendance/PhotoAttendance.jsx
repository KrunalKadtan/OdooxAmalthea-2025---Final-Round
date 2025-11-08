import React, { useState, useRef, useEffect } from "react";
import { Camera, MapPin, CheckCircle, X, RefreshCw } from "lucide-react";
import "./PhotoAttendance.css";

// Office location configuration
const OFFICE_LATITUDE = 28.6139; // Change to your office location
const OFFICE_LONGITUDE = 77.209; // Change to your office location
const MAX_DISTANCE_METERS = 100; // Maximum allowed distance from office

function PhotoAttendance({ userName = "Employee" }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [lastPunchType, setLastPunchType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [distance, setDistance] = useState(null);
  const [remoteWorkRequested, setRemoteWorkRequested] = useState(false);
  const [remoteReason, setRemoteReason] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c * 100) / 100;
  };

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    };
    getCameras();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      alert("Camera access denied. Please allow camera permission.");
      console.error("Error starting camera:", error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL("image/jpeg");
    setCapturedPhoto(photoData);
    stopCamera();
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Get location
  const getLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(locationData);

        // Calculate distance from office
        const dist = calculateDistance(
          locationData.latitude,
          locationData.longitude,
          OFFICE_LATITUDE,
          OFFICE_LONGITUDE
        );
        setDistance(dist);

        // Check if remote approval needed
        if (dist > MAX_DISTANCE_METERS) {
          setRemoteWorkRequested(true);
        }
      },
      (error) => {
        setLocationError("Unable to get location. Please enable GPS.");
        console.error("Location error:", error);
      }
    );
  };

  // Check last punch status
  useEffect(() => {
    // In real app, fetch from API
    // For now, simulate with localStorage
    const lastPunch = localStorage.getItem("lastPunchType");
    setLastPunchType(lastPunch);
  }, []);

  // Handle punch
  const handlePunch = async () => {
    if (!capturedPhoto) {
      alert("Please capture your photo first");
      return;
    }

    if (!location) {
      alert("Please enable location access");
      return;
    }

    if (distance > MAX_DISTANCE_METERS && !remoteWorkRequested) {
      alert(
        `You are ${distance}m away from office. Please request remote work approval.`
      );
      return;
    }

    if (remoteWorkRequested && !remoteReason.trim()) {
      alert("Please provide a reason for remote work");
      return;
    }

    setIsLoading(true);

    try {
      // Determine punch type
      const punchType = lastPunchType === "in" ? "out" : "in";

      // In real app, send to API
      const attendanceData = {
        photo: capturedPhoto,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        punchType: punchType,
        timestamp: new Date().toISOString(),
        remoteWorkRequested: remoteWorkRequested,
        remoteReason: remoteReason,
        distance: distance,
      };

      console.log("Attendance data:", attendanceData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update last punch type
      localStorage.setItem("lastPunchType", punchType);
      setLastPunchType(punchType);

      // Show success message
      setPopupMessage(
        `Successfully punched ${punchType}! ${
          remoteWorkRequested ? "(Remote approval pending)" : ""
        }`
      );
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // Reset form
      setCapturedPhoto(null);
      setLocation(null);
      setDistance(null);
      setRemoteWorkRequested(false);
      setRemoteReason("");
    } catch (error) {
      alert("Error submitting attendance. Please try again.");
      console.error("Punch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPunchType = lastPunchType === "in" ? "out" : "in";
  const buttonClass = nextPunchType === "in" ? "btn-punch-in" : "btn-punch-out";
  const buttonText = nextPunchType === "in" ? "Punch In" : "Punch Out";

  return (
    <div className="photo-attendance-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Mark Attendance</h1>
        <p className="attendance-subtitle">
          Capture your photo and location to mark attendance
        </p>
      </div>

      <div className="attendance-content">
        {/* Camera Section */}
        <div className="attendance-card">
          <div className="card-header">
            <Camera className="card-icon" />
            <h3>Capture Photo</h3>
          </div>

          {cameras.length > 1 && !capturedPhoto && (
            <div className="camera-select-group">
              <label>Select Camera:</label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="camera-select"
              >
                {cameras.map((camera, index) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="camera-preview">
            {!capturedPhoto ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="video-preview"
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div className="camera-controls">
                  {!stream ? (
                    <button onClick={startCamera} className="btn-camera">
                      <Camera className="btn-icon" />
                      Start Camera
                    </button>
                  ) : (
                    <button onClick={capturePhoto} className="btn-capture">
                      <CheckCircle className="btn-icon" />
                      Capture Photo
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="captured-image"
                />
                <button onClick={retakePhoto} className="btn-retake">
                  <RefreshCw className="btn-icon" />
                  Retake Photo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="attendance-card">
          <div className="card-header">
            <MapPin className="card-icon" />
            <h3>Location</h3>
          </div>

          {!location ? (
            <div className="location-prompt">
              <p>Click to get your current location</p>
              <button onClick={getLocation} className="btn-location">
                <MapPin className="btn-icon" />
                Get Location
              </button>
              {locationError && (
                <p className="error-message">{locationError}</p>
              )}
            </div>
          ) : (
            <div className="location-info">
              <div className="location-item">
                <span className="location-label">Latitude:</span>
                <span className="location-value">
                  {location.latitude.toFixed(6)}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label">Longitude:</span>
                <span className="location-value">
                  {location.longitude.toFixed(6)}
                </span>
              </div>
              <div className="location-item">
                <span className="location-label">Accuracy:</span>
                <span className="location-value">
                  {location.accuracy.toFixed(2)}m
                </span>
              </div>
              {distance !== null && (
                <div className="location-item">
                  <span className="location-label">Distance from office:</span>
                  <span
                    className={`location-value ${
                      distance > MAX_DISTANCE_METERS ? "text-danger" : "text-success"
                    }`}
                  >
                    {distance}m
                  </span>
                </div>
              )}
              <button onClick={getLocation} className="btn-refresh">
                <RefreshCw className="btn-icon" />
                Refresh Location
              </button>
            </div>
          )}

          {/* Remote Work Approval */}
          {distance > MAX_DISTANCE_METERS && (
            <div className="remote-approval-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remoteWorkRequested}
                  onChange={(e) => setRemoteWorkRequested(e.target.checked)}
                />
                Request Remote Work Approval
              </label>
              {remoteWorkRequested && (
                <textarea
                  value={remoteReason}
                  onChange={(e) => setRemoteReason(e.target.value)}
                  placeholder="Please provide reason for remote work..."
                  className="remote-reason-input"
                  rows="3"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="attendance-actions">
        <div className="punch-button-wrapper">
          <button
            onClick={handlePunch}
            disabled={!capturedPhoto || !location || isLoading}
            className={`btn-punch ${buttonClass}`}
          >
            {isLoading ? "Processing..." : `✓ ${buttonText}`}
          </button>
          {showPopup && (
            <div className="punch-popup">
              <p>{popupMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoAttendance;
