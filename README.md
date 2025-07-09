# 🖼️ Image-to-Sticker Converter

A modern web application that transforms images into professional sticker-style graphics with customizable borders and backgrounds.

🔗 **Live Demo**: [https://image-to-sticker.onrender.com](https://image-to-sticker.onrender.com)

---

## 🚀 Project Overview

**Image-to-Sticker Converter** streamlines the process of turning your favorite images into high-quality digital stickers. With real-time preview, background removal, and advanced border styling, this tool offers a seamless experience for both casual and professional users.

---

## ✨ Key Features

1. **Background Removal**
   - Powered by [remove.bg](https://www.remove.bg/) API for automatic background removal.

2. **Custom Border Styling**
   - Adjustable border thickness (1–50px)
   - RGBA color support
   - Soft, blurred sticker-style borders

3. **Background Customization**
   - Apply solid background colors
   - Use an RGB color picker with instant visual feedback

4. **Multiple Upload Methods**
   - Drag & drop interface
   - Click-to-upload
   - Paste directly from clipboard

5. **Real-Time Preview**
   - Instantly see changes as you customize your sticker

6. **File Validation**
   - Accepts `.jpg`, `.jpeg`, `.png`, `.webp`
   - File size up to 10MB

7. **Download Functionality**
   - Download your final sticker with one click

---

## 🛠️ Technical Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS** (utility-first styling)
- **React Dropzone** (file upload handling)
- **React Color** (color picker components)
- **Axios** (API requests)
- **Lucide React** (icon set)

### Backend
- **FastAPI** (Python web framework)
- **OpenCV** (image processing)
- **Pillow (PIL)** (image manipulation)
- **NumPy** (numerical computations)
- **remove.bg API** (background removal)
- **CORS Middleware** (cross-origin requests)
- **Deployment**: Render.com

---

## 📁 Project Structure

```
Image-To-Sticker/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API handlers
│   │   └── utils/            # Utility functions
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── main.py               # API server
│   └── requirements.txt      # Backend dependencies
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.8+
- **Remove.bg API Key**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📡 API Endpoints

### `POST /process`
- Accepts an image file with optional customization parameters
- Returns a processed sticker image

---

## 🔐 Environment Variables

The following environment variable must be set in the backend environment:

```bash
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

---

## 🚀 Deployment

### Backend
- Hosted on [Render.com](https://render.com):  
  ➤ **https://image-to-sticker.onrender.com**

### Frontend
- Can be deployed on platforms like:
  - [Vercel](https://vercel.com/)
  - [Netlify](https://www.netlify.com/)
  - [GitHub Pages](https://pages.github.com/)

---

## 🤝 Contributing

We welcome contributions!

### Guidelines
- Fork the repository and create a feature branch
- Follow consistent naming conventions and TypeScript types
- Keep code modular and well-documented

### Development Workflow
1. Clone the repository
2. Run both frontend and backend locally
3. Make your changes with clear commit messages
4. Open a pull request with a detailed description

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.