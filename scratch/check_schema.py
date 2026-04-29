
from supabase import create_client, Client
import json

url: str = 'https://lzeydgdaeywdnrjhydyy.supabase.co'
key: str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXlkZ2RhZXl3ZG5yamh5ZHl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE4ODY5NCwiZXhwIjoyMDkxNzY0Njk0fQ.k0B-uGhMzazwJtyAcdoS-6genEWtR0UJiEAG7xrmPLw'
supabase: Client = create_client(url, key)

try:
    response = supabase.table('kampus').select('*').limit(1).execute()
    print(json.dumps(response.data[0] if response.data else {}, indent=2))
except Exception as e:
    print(f"Error: {e}")
