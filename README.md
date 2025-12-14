# Werkly

An AI workplace onboarding and retraining tool that reduces time and costs for companies and is relevant and on-demand for employees.

## Features

- **Document Upload & Embedding**: PMs (or abstractly, "employers") can upload company documentation that gets embedded and stored in a vector database
- **Semantic Search**: RAG queries find the most relevant documentation
- **AI Chat Interface**: Natural language Q&A with context-aware responses

## Tech Stack

### Frontend
- **Next.js 14** - App router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn** - Component lib

### Backend
- **Supabase** - Authentication, PostgreSQL database, `pgvector` for embeddings
- **Next.js API Routes** - API endpoints

### AI/ML
- **OpenAI API** - Embeddings (`text-embedding-3-small`) and chat completions (`gpt-4`)
- **Supabase pgvector** - Vector similarity search

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Vercel** - Frontend deployment

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd werkly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with correct credentials:
- Supabase project URL and keys (from the Supabase dashboard)
- OpenAI API key

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

## Future Directions

- **Agent Mode**: Automated workflow execution using computer control
- **Analytics Dashboard**: Track learning progress and engagement