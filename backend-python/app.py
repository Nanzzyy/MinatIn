import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Supabase setup
url: str = 'https://lzeydgdaeywdnrjhydyy.supabase.co'
key: str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXlkZ2RhZXl3ZG5yamh5ZHl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE4ODY5NCwiZXhwIjoyMDkxNzY0Njk0fQ.k0B-uGhMzazwJtyAcdoS-6genEWtR0UJiEAG7xrmPLw'
supabase: Client = create_client(url, key)

# Load questions from JSON
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Note: assuming MinatIn/frontend-react/JSON/question.json
json_path = os.path.join(BASE_DIR, '..', 'frontend-react', 'JSON', 'question.json')
with open(json_path, 'r', encoding='utf-8') as f:
    questions_data = json.load(f)

# Mapping Category to Search Keywords for Kampus
CATEGORY_KEYWORDS = {
    'Tek': ['teknologi', 'teknik', 'informatika', 'komputer', 'sains', 'institut'],
    'Sen': ['seni', 'desain', 'kreatif', 'arsitektur'],
    'Sos': ['sosial', 'hukum', 'komunikasi', 'negeri', 'universitas'],
    'Bis': ['ekonomi', 'bisnis', 'manajemen', 'keuangan'],
    'Jas': ['pariwisata', 'kesehatan', 'medis', 'kuliner', 'jasa']
}

CATEGORY_NAMES = {
    'Tek': 'Teknologi & Teknik',
    'Sen': 'Seni & Desain Kreatif',
    'Sos': 'Sosial & Komunikasi',
    'Bis': 'Bisnis & Manajemen',
    'Jas': 'Jasa, Pariwisata & Kesehatan'
}

@app.route('/survei/submit', methods=['POST'])
def submit():
    answers = request.json
    if not answers:
        return jsonify({"error": "No answers provided"}), 400

    scores = {'Tek': 0, 'Sen': 0, 'Sos': 0, 'Bis': 0, 'Jas': 0}

    # Calculate scores
    for q in questions_data:
        q_id = q['id']
        if q_id in answers:
            ans_key = answers[q_id]
            if ans_key in q['opsi']:
                points = q['opsi'][ans_key]['poin']
                for cat, val in points.items():
                    if cat in scores:
                        scores[cat] += val
    
    # Determine dominant category
    dominant_cat = max(scores, key=scores.get)
    max_score = scores[dominant_cat]

    keywords = CATEGORY_KEYWORDS.get(dominant_cat, [])

    # Construct Supabase query using .or_
    # E.g., or_("keterangan.ilike.%teknologi%,nama_kampus.ilike.%teknologi%")
    recommended_campuses = []
    if keywords:
        or_conditions = []
        for kw in keywords:
            or_conditions.append(f"keterangan.ilike.%{kw}%")
            or_conditions.append(f"nama_kampus.ilike.%{kw}%")
        or_string = ",".join(or_conditions)
        
        try:
            response = supabase.table('kampus').select('*').or_(or_string).execute()
            recommended_campuses = response.data
        except Exception as e:
            print("Error fetching from supabase:", str(e))

    return jsonify({
        "dominan_id": dominant_cat,
        "dominan": CATEGORY_NAMES.get(dominant_cat, "Tidak Diketahui"),
        "skor": scores,
        "max_score": max_score,
        "rekomendasi_kampus": recommended_campuses
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)