from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from vosk import Model, KaldiRecognizer
import wave
import os
import json
from io import BytesIO
from pydub import AudioSegment


bp = Blueprint('recognize', __name__)

model = Model("app/models/vosk-model-en-us-0.22")

@bp.route('/api/recognize', methods=['POST'])
@cross_origin()
def recognize_speech():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']

        # Convert định dạng bất kỳ sang WAV mono PCM chuẩn
        audio = AudioSegment.from_file(audio_file)
        audio = audio.set_channels(1).set_frame_rate(16000).set_sample_width(2)

        wav_io = BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        with wave.open(wav_io, "rb") as wf:
            rec = KaldiRecognizer(model, wf.getframerate())
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                rec.AcceptWaveform(data)

            final_result = rec.FinalResult()

        # Parse kết quả JSON trả về
        text = json.loads(final_result).get("text", "")
        print(f"Command: \"{text}\"")
        return jsonify({"text": text})


    except Exception as e:
        print("Error recognizing speech:", e)
        return jsonify({"error": "Internal server error"}), 500

