import React, { useEffect, useState } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import "./WakeWordListener.css";

import { handleWakeWordDetected } from "./wakeupHandler";

const WakeWordListener = () => {
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const [loading, setLoading] = useState(true);
  const [commandText, setCommandText] = useState("");

  // Khởi tạo Porcupine
  useEffect(() => {
    const keyword = {
      publicPath: "/Hey-home_en_wasm_v3_0_0.ppn",
      label: "Hey Home",
    };

    const model = {
      publicPath: "/porcupine_params.pv",
      // publicPath: import.meta.env.REACT_APP_MODEL_PATH,
    };

    init(
      "kRRenV7M21MRvdVDSXo5LxxAitTMYytdQ8UHyrApzf7jEVCRezbRFQ==",
      keyword,
      model
    ).then(() => {
      setLoading(false);
    });
  }, []);

  // Phản hồi khi nhận diện từ khóa
  useEffect(() => {
    if (keywordDetection !== null) {
      console.log(`🎉 Nhận diện: ${keywordDetection.label}`);
      runSpeechRecognition();
    }
  }, [keywordDetection]);

  // Hàm gọi STT từ wakeupHandler
  const runSpeechRecognition = async () => {
    try {
      const result = await handleWakeWordDetected();
      if (result?.text) {
        setCommandText(result.text);
        // TODO: gửi tới ESP32 ở đây nếu cần
      }
    } catch (error) {
      console.error("STT failed:", error);
    }
  };

  return (
    <div className="wake-word-container">
      <h2>🎤 Wake Word Listener</h2>

      {loading ? (
        <div className="loader">Đang tải Porcupine...</div>
      ) : (
        <>
          {error && <p className="error">{error.toString()}</p>}

          <div className={`mic-icon ${isListening ? "listening" : ""}`}></div>
          <p>
            Trạng thái:{" "}
            <strong>
              {isListening ? "Đang lắng nghe..." : "Không hoạt động"}
            </strong>
          </p>

          <div className="controls">
            <button onClick={start} disabled={isListening}>
              ▶️ Bắt đầu
            </button>
            <button onClick={stop} disabled={!isListening}>
              ⏹️ Dừng
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WakeWordListener;
