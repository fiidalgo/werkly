# Werkly Employee Onboarding Guide

## Welcome to Werkly!

Welcome to the Werkly team! This guide will help you get started with our AI-powered workplace training platform.

## About Werkly

Werkly is an AI workplace retraining and onboarding tool designed to reduce onboarding time and costs while providing employees with personalized, on-demand learning experiences.

### Our Mission

To revolutionize workplace training by making it:
- **Relevant** - Tailored to specific job functions
- **On-Demand** - Available whenever employees need it
- **Efficient** - Reducing time and resource costs for employers
- **Actionable** - Providing practical, job-specific information

## Getting Started

### Your First Week

**Day 1: Setup & Access**
- Complete your Werkly account setup
- Review company policies and procedures
- Schedule 1:1 with your manager
- Join team communication channels

**Day 2-3: Product Training**
- Complete the Werkly product overview training
- Learn about our RAG (Retrieval Augmented Generation) system
- Understand our tech stack: Next.js, Supabase, OpenAI
- Review our database architecture

**Day 4-5: Team Integration**
- Meet with cross-functional teams
- Review current sprint goals
- Set up your development environment
- Complete first small task/bug fix

### Key Systems & Tools

#### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**Backend:**
- Supabase (Auth, Database, Storage)
- PostgreSQL with pgvector extension
- Row Level Security (RLS) for multi-tenancy

**AI & ML:**
- OpenAI API for embeddings (text-embedding-3-small)
- GPT-4 for chat completions
- Vector similarity search for document retrieval

**DevOps:**
- Vercel for frontend deployment
- Docker for local development
- GitHub for version control

#### Development Workflow

1. **Branch Naming Convention**
   - `feat/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring

2. **Commit Messages**
   - Keep them short and descriptive (one-liner)
   - Focus on the "what" not the "how"
   - Example: "Add document upload validation"

3. **Pull Requests**
   - Small, focused changes
   - Include description of changes
   - Wait for review before merging
   - Ensure tests pass

## Product Features

### For Employers

**Document Management**
- Upload company documentation (PDF, DOCX, TXT, MD)
- Automatic text extraction and processing
- Document status tracking
- Company-isolated storage

**Analytics** (Coming Soon)
- Employee engagement metrics
- Most queried topics
- Document effectiveness scores

### For Employees

**AI Chat Interface**
- Ask questions about company processes
- Get instant, contextualized answers
- Receive step-by-step instructions
- Access on-demand, 24/7

**Learning Paths** (Coming Soon)
- Personalized onboarding tracks
- Role-specific training modules
- Progress tracking

## Architecture Overview

### Database Schema

**Companies Table**
- Stores company information
- Each employer creates one company on signup

**Profiles Table**
- Links users to companies
- Stores user preferences and metadata

**Documents Table**
- Tracks uploaded documents
- Stores metadata: filename, size, type, status
- Linked to company via `company_id`

**Document Embeddings Table**
- Stores text chunks with vector embeddings
- 1536-dimensional vectors (OpenAI text-embedding-3-small)
- Enables semantic search via pgvector

### RAG Pipeline

1. **Document Upload**
   - Employer uploads document
   - Stored in Supabase Storage (company-specific folder)
   - Database record created with "pending" status

2. **Text Extraction**
   - PDF/DOCX parsed to extract text
   - Metadata preserved (page numbers, sections)

3. **Chunking**
   - Text split into ~1000 token chunks
   - Overlap between chunks for context preservation
   - Each chunk stored separately

4. **Embedding Generation**
   - Each chunk sent to OpenAI API
   - 1536-dimensional vector embedding returned
   - Stored in document_embeddings table

5. **Query Processing**
   - User asks question in chat
   - Question converted to embedding
   - Vector similarity search finds relevant chunks
   - Top K chunks provided as context to LLM
   - LLM generates answer based on company docs

## Common Tasks

### How to Upload Documents

1. Navigate to Dashboard → Documents (Employer only)
2. Drag and drop files or click to browse
3. Supported formats: PDF, DOCX, DOC, TXT, MD
4. Maximum file size: 50MB
5. Wait for upload completion
6. Document status will change from "pending" → "processing" → "completed"

### How to Query the AI

1. Navigate to Dashboard (any user)
2. Type your question in the chat interface
3. Press Cmd/Ctrl + Enter to submit
4. AI will search company documents and respond
5. Responses are based only on uploaded company documentation

### How to Manage User Roles

**Employee Role:**
- Can access AI chat interface
- Can query company documentation
- Cannot upload documents

**Employer Role:**
- All Employee permissions
- Can upload and manage documents
- Can view analytics (coming soon)

## Security & Privacy

### Data Isolation

- **Multi-Tenancy**: Each company's data is completely isolated
- **Row Level Security (RLS)**: Database-level protection
- **Storage Policies**: Company-specific folders in Supabase Storage
- **Vector Search**: Queries filtered by company_id

### Authentication

- Email/password authentication via Supabase
- Strong password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### Data Processing

- Documents processed securely in isolated environments
- OpenAI API used for embeddings (data not retained by OpenAI)
- No cross-company data sharing
- All queries scoped to user's company

## Troubleshooting

### I can't upload documents
- **Check**: Are you logged in as an Employer?
- **Check**: Is the file under 50MB?
- **Check**: Is the file format supported (PDF, DOCX, DOC, TXT, MD)?

### The AI isn't finding information
- **Wait**: Has the document finished processing? (Check status)
- **Check**: Is the information actually in an uploaded document?
- **Try**: Rephrasing your question for better results

### I forgot my password
- Click "Forgot Password" on login page
- Check your email for reset link
- Create a new strong password

## Getting Help

### Internal Resources

- **#engineering** - Technical questions
- **#product** - Product discussions
- **#general** - General company chat

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

## Glossary

**RAG** - Retrieval Augmented Generation: AI technique combining document retrieval with language generation

**Vector Embedding** - Mathematical representation of text as a high-dimensional vector

**Semantic Search** - Search based on meaning rather than exact keyword matching

**RLS** - Row Level Security: Database feature that filters data based on user permissions

**pgvector** - PostgreSQL extension for efficient vector similarity search

**LLM** - Large Language Model: AI model trained to understand and generate text

---

**Last Updated**: December 2025
**Version**: 1.0
**Contact**: support@werkly.io
