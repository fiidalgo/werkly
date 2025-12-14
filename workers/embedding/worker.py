"""
Embedding worker for creating and storing vector embeddings for docs.
Listens for new documents and creates embeddings using openai.
"""

import os
import time
from openai import OpenAI
from supabase import create_client, Client

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
openai_api_key = os.environ.get("OPENAI_API_KEY")

supabase: Client = create_client(supabase_url, supabase_key)
openai_client = OpenAI(api_key=openai_api_key)

def create_embedding(text: str):
    """Generate embedding for text using OpenAI."""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def process_pending_documents():
    """Poll for documents that need embeddings and process them."""
    while True:
        try:
            # TODO: after we have db schema
            print("Polling for pending documents...")
            time.sleep(10)
        except Exception as e:
            print(f"Error processing documents: {e}")
            time.sleep(10)

if __name__ == "__main__":
    print("Starting embedding worker...")
    process_pending_documents()
