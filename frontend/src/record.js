// record.js
export const recordAudio = (duration = 4000) => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = (err) => reject(err);

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, duration);
      })
      .catch(reject);
  });
};
