import { useRef, useState, useEffect } from "react";
import VIDEO from "./assets/menu.mp4";
import VIDEO2 from "./assets/sinhala.mp4";
import VIDEO3 from "./assets/saving.mp4";
import VIDEO4 from "./assets/thakyou.mp4";
import Sprinner from "./assets/Spinner.gif";

function App() {
  const videos = [VIDEO, VIDEO2, VIDEO3, VIDEO4];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentOverlays, setCurrentOverlays] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({ name: "", email: "", phone: "" });
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const overlays = [
    {
      id: 1,
      videoIndex: 0,
      options: [{ message: "Play Video 2", start: 10, end: 35, nextVideo: 1, x: 20, y: 70 }],
    },
    {
      id: 2,
      videoIndex: 1,
      options: [
        { message: "Play Video 3", start: 1, end: 40, nextVideo: 2, x: 70, y: 38 },
        { message: "Menu", start: 1, end: 40, nextVideo: 0, x: 7, y: 10, isMainMenu: true },
      ],
    },
    {
      id: 3,
      videoIndex: 2,
      options: [
        {
          type: "input",
          message: "Enter Details",
          start: 24,
          end: 200,
          x: 70,
          y: 50,
          isMainMenu: false,
        },
      ],
    },
    {
      id: 4,
      videoIndex: 3,
      options: [

        { message: "Menu", start: 1, end: 40, nextVideo: 0, x: 7, y: 10, isMainMenu: true },
      ],
    },
  ];

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;

    const activeOverlays = overlays
      .filter((overlay) => overlay.videoIndex === currentVideoIndex)
      .flatMap((overlay) =>
        overlay.options.filter(
          (option) => currentTime >= option.start && currentTime <= option.end
        )
      );

    setCurrentOverlays(activeOverlays);
  };

  const handleOverlayClick = (nextVideoIndex) => {
    if (nextVideoIndex < videos.length) {
      setCurrentVideoIndex(nextVideoIndex);
      setIsLoading(true);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = videos[nextVideoIndex];

        videoRef.current.addEventListener(
          "loadeddata",
          () => {
            videoRef.current.play().catch(console.error);
            setIsPlaying(true);
            setIsLoading(false);
          },
          { once: true }
        );

        videoRef.current.load();
      }
    }
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSendClick = () => {
    const { name, email, phone } = inputs;

    if (!name || !email || !phone) {
      alert("Please fill out all fields.");
      return;
    }

    // Navigate to Video ID 4
    handleOverlayClick(3);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (videoRef.current) {
      const handleWaiting = () => setIsLoading(true);
      const handlePlaying = () => setIsLoading(false);

      videoRef.current.addEventListener("waiting", handleWaiting);
      videoRef.current.addEventListener("playing", handlePlaying);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("waiting", handleWaiting);
          videoRef.current.removeEventListener("playing", handlePlaying);
        }
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={Sprinner} alt="Loading..." style={{ width: "250px", height: "250px" }} />
        </div>
      )}

      <video
        ref={videoRef}
        src={videos[currentVideoIndex]}
        style={{ width: "100%", height: "100%" }}
        onTimeUpdate={handleTimeUpdate}
        controls={true}
      />

      {currentOverlays.map((option, index) => {
        if (option.type === "input") {
          return (
            <div
            key={index}
            style={{
              position: "absolute",
              top: `${option.y}%`,
              left: `${option.x}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              backgroundColor: "rgba(250, 141, 141, 0.8)",
              padding: "30px", // Increased padding for more height
              borderRadius: "12px", // Slightly larger corner rounding
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "350px", // Slightly wider box
            }}
          >
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={{
                width: "90%", // Fits within the box
                padding: "15px", // Increased padding for taller input
                marginBottom: "15px", // More space between inputs
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                height: "45px", // Added explicit height
              }}
            />
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={{
                width: "90%", // Fits within the box
                padding: "15px", // Increased padding for taller input
                marginBottom: "15px", // More space between inputs
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                height: "45px", // Added explicit height
              }}
            />
            <input
              type="tel"
              name="phone"
              value={inputs.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone"
              style={{
                width: "90%", // Fits within the box
                padding: "15px", // Increased padding for taller input
                marginBottom: "15px", // More space between inputs
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                height: "45px", // Added explicit height
              }}
            />
            <button
              onClick={handleSendClick}
              style={{
                padding: "12px 24px", // Increased button size
                fontSize: "16px",
                backgroundColor: "rgba(250, 62, 62, 0.8)",
                color: "white",
                border: "none",
                borderRadius: "6px", // Slightly larger corners
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>          
          );
        }

        return (
          <button
            key={index}
            style={{
              position: "absolute",
              top: `${option.y}%`,
              left: `${option.x}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              zIndex: 10,
              fontSize: "5vw",
              backgroundColor: "transparent",
              color: "transparent",
              border: "none",
            }}
            onClick={() => handleOverlayClick(option.nextVideo)}
          >
            {option.message}
          </button>
        );
      })}
    </div>
  );
}

export default App;
