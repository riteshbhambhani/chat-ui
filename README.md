# 🌬️ AireStacks

AireStacks is a full-stack AI assistant platform powered by OpenAI’s ChatGPT. It features a modular architecture with a RESTful API backend and a dynamic frontend UI—all containerized with Docker Compose for smooth development and deployment.

---

## 🚀 Features

- 🔌 API service (`chat-api`) to handle AI requests and email-based flows
- 🖥️ Frontend (`chat-ui`) built for interactive AI conversations
- 📦 Docker Compose setup for seamless local deployment
- 🌐 Environment-based configuration for flexibility
- ✉️ Built-in SMTP support for email notifications

---

## 🧰 Tech Stack

- Backend: Node.js/Express (in `server`)
- Frontend: Vite + React (in `client`)
- Database: MongoDB (expected to be accessible externally)
- Containerization: Docker & Docker Compose

---

## 📦 Project Structure

```
AireStacks/
├── client/              # Frontend React App
├── server/              # Backend API
├── docker-compose.yaml  # Multi-container orchestration
├── .env                 # Environment variable configuration (create this)
└── README.md
```

---

## ⚙️ Environment Variables

These are set directly in `docker-compose.yaml`, but can be abstracted to a `.env` file if preferred.

### `chat-api` service

```env
PORT=3000
DB_URL=mongodb://host.docker.internal:27017/gpt
SMTP_HOST=smtp.example.com
SMTP_USER=username
SMTP_PASS=password
SITE_URL=http://localhost:8080
```

### `chat-ui` service

```env
VITE_API_URL=http://chat-api:3000
```

> 📌 **Note:** Replace placeholder values (`smtp.example.com`, credentials, DB connection) with your own.

---

## 🐳 Running with Docker Compose

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/airestacks.git
cd airestacks
```

### 2. Build and Run the App

```bash
docker-compose up --build
```

Or to run in the background:

```bash
docker-compose up -d --build
```

### 3. Stop the App

```bash
docker-compose down
```

---

## 🔁 Changing Ports

If you change the internal app port (like `3000` for the API or `80` for the UI), make sure to update it in:

- The `ports` mapping inside `docker-compose.yaml`
- All corresponding environment variables (like `PORT` and `VITE_API_URL`)

```yaml
# Example: changing backend port to 4000
ports:
  - "4000:4000"
environment:
  - PORT=4000
  - VITE_API_URL=http://chat-api:4000
```

---

## 🧪 Testing & Development

You can open the frontend at [http://localhost:8080](http://localhost:8080) and the backend (if exposed) at [http://localhost:3000](http://localhost:3000).

Use `docker-compose logs -f` to view real-time container logs.

---

## 📬 Contributing

We welcome contributions! Fork the repo, open issues, and submit pull requests with improvements.

---

## 📝 License

MIT License. See the [LICENSE](./LICENSE) file for details.
