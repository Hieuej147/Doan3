# Doan3 Project

Dự án gồm 2 phần chính:

- **Backend (Python + Poetry)**: nằm trong thư mục `research/`
- **Frontend (Next.js + Node.js)**: nằm trong thư mục `ui/`

---

## 🚀 Cách chạy dự án

### 1. Backend (research)

Di chuyển vào thư mục `research` và cài dependencies:
Research

Tạo file .env trong thư mục research với nội dung:
OPENAI_API_KEY=your_openai_api_key_here
LANGGRAPH_API=false

```bash
cd research
poetry install
Kích hoạt virtual environment (nếu chưa active):
poetry shell
2. Frontend (ui)

Sau khi backend sẵn sàng, chuyển sang frontend:
## Environment Variables

### UI
Tạo file `.env` trong thư mục `ui` với nội dung:
```ini
OPENAI_API_KEY=your_openai_api_key_here
OPENWEATHERMAP_API_KEY=your_openweathermap_key_here

cd ../ui
npm install
npm run dev

*Yêu cầu hệ thống (Python 3.12, Node.js 20, Poetry)

⚠️ Đừng quên thêm .env vào .gitignore để tránh lộ API key khi push lên GitHub.