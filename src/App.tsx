import { useState, useEffect } from "react";

import YouTube, { YouTubePlayer } from "react-youtube";

import "./styles.css";

let videoElement: YouTubePlayer = null;

export default function App() {
  const [dataIndex, setDataIndex] = useState(0);
  const [isPaused, setPause] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [response, setResponse] = useState<
    "none" | "success" | "failure" | "failure-again"
  >("none");

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1
    }
  };

  const data = [
    { title: "La Esperanza de María", videoId: "uzx9DnAe7j0" },
    { title: "Mi Amargura", videoId: "SmzhPbsdavs" },
    { title: "Reina de Reyes", videoId: "nUQPv2izp_E" },
    { title: "Pasa la soledad", videoId: "FNzvIZHULk4" },
    { title: "Y en Triana, la O", videoId: "uCfka6QqaYk" }
  ];

  function getRandomInt(max: number, except: number) {
    const candidate = Math.floor(Math.random() * (max - 1));
    return candidate < except ? candidate : candidate + 1;
  }

  const playOther = () => {
    setResponse("none");
    setDataIndex(getRandomInt(data.length, dataIndex));
  };

  const togglePause = () => {
    setPause(!isPaused);
  };

  function updateTime(videoElement: YouTubePlayer) {
    const elapsed_seconds = videoElement.target.getCurrentTime();

    if (elapsed_seconds <= 0) {
      return;
    }

    const elapsed_milliseconds = Math.floor(elapsed_seconds * 1000);
    const min = Math.floor(elapsed_milliseconds / 60000);
    const seconds = Math.floor((elapsed_milliseconds - min * 60000) / 1000);

    const formattedTime =
      min.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    console.log(formattedTime);
    setFormattedTime(formattedTime);
  }

  useEffect(() => {
    if (videoElement) {
      updateTime(videoElement);

      // Pause and Play video
      if (isPaused) {
        videoElement.target.pauseVideo();
      } else {
        videoElement.target.playVideo();
      }
    }
  }, [isPaused, videoElement]);

  //get current time and video status in real time
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoElement) {
        updateTime(videoElement);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const _onReady = (event: YouTubePlayer) => {
    videoElement = event;
  };

  const isVisibleVideo = response === "success";

  return (
    <div className="App">
      <h1>Adivina la marcha</h1>
      <button onClick={playOther}>Dado</button>
      <span>{formattedTime}</span>
      <button onClick={togglePause}>{isPaused ? "Play" : "Pausa"}</button>
      <div className={isVisibleVideo ? "" : "hidden"}>
        <YouTube
          videoId={data[dataIndex].videoId}
          opts={opts}
          onReady={_onReady}
        />
      </div>
      <div className={isVisibleVideo ? "hidden" : ""}>
        <img src="bob-listening.gif" alt="Playing" />
      </div>
      <div>
        <h2>Elige:</h2>
        {data.map((item, index) => (
          <div>
            <button
              className="button-option"
              onClick={
                index === dataIndex
                  ? () => setResponse("success")
                  : () =>
                      setResponse(
                        response === "failure" ? "failure-again" : "failure"
                      )
              }
            >
              {data[index].title}
            </button>
          </div>
        ))}
      </div>
      {response === "success" && <h2>Bien!</h2>}
      {response === "failure" && <h2>Mal!</h2>}
      {response === "failure-again" && <h2>Otra vez mal!</h2>}
    </div>
  );
}
