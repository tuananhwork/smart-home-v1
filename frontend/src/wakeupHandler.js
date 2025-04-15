// wakeupHandler.js
import { recordAudio } from "./record";

export const handleWakeWordDetected = async () => {
  console.log("Wake word detected! Listening for command...");

  try {
    const audioBlob = await recordAudio(4000); // Ghi âm 4 giây
    const formData = new FormData();
    formData.append("audio", audioBlob, "command.wav");

    const response = await fetch("http://localhost:8000/api/recognize", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();
    console.log("🗣️ Speech to text result:", result.text);

    return result;
  } catch (error) {
    console.error("STT error:", error.message || error);
    throw error;
  }
};
