# 🛡️ DriveSafe Vision — Road Safety AI System

A premium, real-time object detection dashboard for road safety monitoring, built with **YOLOv8** and **Flask**, featuring a beautiful smart UI.

---



![DriveSafe Vision UI](https://img.shields.io/badge/UI-Premium%20Dark%20Mode-blue)
![Model](https://img.shields.io/badge/Model-YOLOv8n-green)
![Framework](https://img.shields.io/badge/Backend-Flask-orange)
![Language](https://img.shields.io/badge/Language-Python-yellow)

---

## ✨ Features

- 🎥 **Live Camera Detection** — Real-time YOLOv8 object detection streamed directly in the browser
- 🖼️ **Static Image Analysis** — Drag & drop or browse images for instant inference
- 📊 **Confidence Meter** — Live animated bar chart showing per-class confidence scores
- 📋 **Event Log** — Real-time system event feed with detection logs
- ⚡ **System Stats** — FPS, latency, resolution, and object count shown live
- 🌙 **Smart Dark UI** — Glassmorphism + animated ambient orbs + gradient-lit panels
- 🔴 **LIVE badge** — Animated recording indicator on the live stream

---

## 🗂️ Project Structure

```
road_safety_project/
├── app.py                  # Flask backend (API + video streaming)
├── yolov8n.pt              # YOLOv8 Nano pretrained model weights
├── test.jpg                # Sample test image
├── templates/
│   └── index.html          # Main HTML page (Jinja2 template)
└── static/
    ├── css/
    │   └── style.css       # Premium dark theme stylesheet
    └── js/
        └── script.js       # Dynamic telemetry + upload logic
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Askamar/Object_Detection_for_Road_Safety.git
cd Object_Detection_for_Road_Safety
```

### 2. Install Dependencies

```bash
pip install flask ultralytics opencv-python numpy
```

### 3. Run the Application

```bash
python app.py
```

### 4. Open in Browser

Navigate to **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🧠 How It Works

### Live Detection Mode
Flask streams MJPEG frames from your webcam into the browser. Each frame is processed by **YOLOv8n** before being encoded and sent to the `<img>` tag via the `/video_feed` endpoint.

### Static Image Mode
User uploads an image via the drag-and-drop interface. Flask receives it via the `/upload_image` POST endpoint, runs YOLOv8 inference on it, and returns the annotated image as a Base64-encoded JPEG.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Object Detection | YOLOv8n (Ultralytics) |
| Backend | Python + Flask |
| Computer Vision | OpenCV |
| Frontend | HTML5, Vanilla CSS, JavaScript |
| Icons | Phosphor Icons |
| Fonts | Inter, Outfit, JetBrains Mono (Google Fonts) |

---

## 📦 Requirements

```
flask
ultralytics
opencv-python
numpy
```

---

## 👨‍💻 Author

**Amar K** — [@Askamar](https://github.com/Askamar)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
