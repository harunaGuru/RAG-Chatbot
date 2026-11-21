# RAG-CHATBOT

An AI-powered document-based chatbot that allows users to upload documents, search their content, and ask questions using natural language. Built with Retrieval-Augmented Generation (RAG), it retrieves relevant information from uploaded documents and uses Google's Gemini models to generate context-aware responses grounded in the available knowledge base.

## Overview

RAG-CHATBOT is designed to make information stored in documents easier to access and understand. Instead of manually searching through lengthy PDF files, users can ask questions conversationally and receive answers based on relevant document content.

The application combines document processing, vector embeddings, semantic search, and AI-powered response generation to provide an interactive knowledge retrieval experience.

Document uploads are restricted to administrators, while authenticated users and administrators can interact with the shared knowledge base through the chat interface.

## Features

- **AI-Powered Chat:** Ask questions about uploaded documents using natural language.
- **PDF Document Processing:** Extract text from PDF files and split content into smaller, searchable chunks.
- **Text Embeddings:** Generate vector embeddings using Google's Gemini embedding model.
- **Semantic Search:** Retrieve relevant document chunks using PostgreSQL and pgvector.
- **Retrieval-Augmented Generation:** Use retrieved document content as context for Gemini to generate relevant answers.
- **Role-Based Access Control:** Separate administrator and regular user permissions.
- **Document Management:** Restrict document uploads to administrators.
- **Authentication:** Secure user authentication and session management with Clerk.
- **Streaming Responses:** Display AI-generated responses progressively through the chat interface.

## Technology Stack

| Category            | Technologies               |
| ------------------- | -------------------------- |
| Frontend            | Next.js, React, TypeScript |
| Styling             | Tailwind CSS               |
| Authentication      | Clerk                      |
| AI Model            | Google Gemini              |
| AI Integration      | Vercel AI SDK              |
| Embeddings          | Gemini Embedding           |
| Database            | Neon PostgreSQL            |
| Vector Search       | pgvector                   |
| ORM                 | Drizzle ORM                |
| Document Processing | pdf-parse                  |
| Text Chunking       | LangChain Text Splitters   |

## How It Works

The application follows a Retrieval-Augmented Generation workflow.

1. **Document Upload:** An administrator uploads a PDF document.
2. **Text Extraction:** The application extracts readable text from the PDF.
3. **Text Chunking:** Extracted text is divided into smaller, overlapping chunks to improve retrieval.
4. **Embedding Generation:** Gemini generates vector embeddings for each document chunk.
5. **Database Storage:** Document metadata, text chunks, and embeddings are stored in PostgreSQL using pgvector.
6. **User Query:** An authenticated user submits a question through the chat interface.
7. **Semantic Retrieval:** The query is converted into an embedding and compared against stored document embeddings to find relevant content.
8. **AI Response:** Retrieved content is provided to Gemini as context to generate a relevant response.

## Application Architecture

```text
                  RAG-CHATBOT
                       |
              Next.js Application
                       |
          +------------+------------+
          |            |            |
       Homepage       Chat        Upload
          |            |            |
          |       User Query    Admin Only
          |            |            |
          |       Gemini Tool   PDF Processing
          |            |            |
          |       Embedding    Text Chunking
          |            |            |
          |       Semantic     Embedding
          |         Search      Generation
          |            |            |
          +------------+------------+
                       |
                Neon PostgreSQL
                       |
                    pgvector
                       |
              Retrieved Document
                    Context
                       |
                 Gemini LLM
                       |
                AI-Generated
                   Response
```

## Getting Started

### Prerequisites

Ensure you have the following installed or configured:

- Node.js
- npm
- A Google AI Studio API key
- A Clerk application
- A Neon PostgreSQL database with pgvector support

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

2. Navigate into the project directory:

```bash
cd YOUR_REPOSITORY
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the project root and configure the required environment variables.

### Environment Variables

```env
# Database
DATABASE_URL="your_neon_database_connection_string"

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

Make sure you use your actual credentials and never commit your `.env.local` file.

### Database Setup

The project uses PostgreSQL with the pgvector extension for storing and querying vector embeddings.

1. Enable the pgvector extension in your Neon SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

2. Generate database migrations:

```bash
npx drizzle-kit generate
```

3. Apply migrations:

```bash
npx drizzle-kit migrate
```

4. Optionally, launch Drizzle Studio to inspect your database:

```bash
npx drizzle-kit studio
```

### Configure Administrator Access

The application uses Clerk public metadata to distinguish administrators from regular users.

To assign the administrator role:

1. Open your Clerk Dashboard.
2. Navigate to Users.
3. Select the account you want to make an administrator.
4. Open the Public Metadata section.
5. Add the following:

```json
{
  "role": "admin"
}
```

Regular users can have:

```json
{
  "role": "user"
}
```

Only administrators can access the document upload functionality. Role verification is performed on the server.

### Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Access Control

The application currently supports two roles:

| Permission       | User | Admin |
| ---------------- | ---- | ----- |
| Access homepage  | Yes  | Yes   |
| Access chat      | Yes  | Yes   |
| Ask questions    | Yes  | Yes   |
| Upload documents | No   | Yes   |

Authentication is handled by Clerk, while role-based authorization is enforced through server-side checks.

## Project Goals

This project explores the practical implementation of Retrieval-Augmented Generation and demonstrates how AI applications can combine document processing, vector databases, semantic retrieval, and large language models to build useful knowledge-based conversational systems.

## License

This project is available under the MIT License. See the `LICENSE` file for details.
