import os
import json
from flask import Flask, request, redirect, url_for, jsonify
from flask_login import LoginManager, login_user, login_required, UserMixin, current_user, logout_user  
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'aDprIuo4Ir6Qt5tfGQN84qbTymp7mZDmVp6zCNx44JU'

# Supabase setup
url: str = 'https://lzeydgdaeywdnrjhydyy.supabase.co'
key: str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXlkZ2RhZXl3ZG5yamh5ZHl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE4ODY5NCwiZXhwIjoyMDkxNzY0Njk0fQ.k0B-uGhMzazwJtyAcdoS-6genEWtR0UJiEAG7xrmPLw'
supabase: Client = create_client(url, key)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

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

class User(UserMixin):
    def __init__(self, id, username=None):
        self.id = id
        self.username = username

def upload(nama_siswa, kelas_siswa, jurusan_siswa, dominan_id, scores):
    try:
        data = {
            "nama_siswa": nama_siswa,
            "kelas_siswa": kelas_siswa,
            "jurusan_siswa": jurusan_siswa,
            "hasil_jurusan": CATEGORY_NAMES.get(dominan_id, "Tidak Diketahui"),
            "skor_detail": scores
        }
        response = supabase.table('hasil_survei').insert(data).execute()
        return response.data
    except Exception as e:
        print("Error uploading to supabase:", str(e))
        return None

@login_manager.user_loader
def load_user(user_id):
    # Ensure user_id is integer if that's what the DB uses
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        user_id_int = user_id

    response = supabase.table("user").select("*").eq("id", user_id_int).execute()

    if response.data:
        user_data = response.data[0]
        return User(user_data["id"], user_data.get("username") or user_data.get("email"))
    return None


@app.route("/login", methods=["POST"])
def login():
    # Support both JSON and Form data
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    response = supabase.table("user").select("*").eq("username", username).execute()
    user_list = response.data

    if user_list and str(user_list[0].get("password")) == str(password):
        user = User(user_list[0]["id"], user_list[0].get("username"))
        login_user(user)
        return jsonify({"message": "Login successful", "status": "success"}), 200

    return jsonify({"error": "Invalid username or password"}), 401


@app.route("/dashboard")
@login_required
def dashboard():
    return jsonify({"message": "Welcome to dashboard", "status": "success"}), 200

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully", "status": "success"}), 200


@app.route("/check-auth")
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            "is_authenticated": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username
            }
        }), 200
    return jsonify({"is_authenticated": False}), 401


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

    # Ambil nama, kelas, dan jurusan dari request jika frontend mengirimkannya (default: 'Anonim' / '-')
    nama_siswa = answers.get('nama_siswa', 'Anonim')
    kelas_siswa = answers.get('kelas_siswa', '-')
    jurusan_siswa = answers.get('jurusan_siswa', 'Tidak Diketahui')

    # Upload data hasil survei ke database
    upload(nama_siswa, kelas_siswa, jurusan_siswa, dominant_cat, scores)

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
    app.run(debug=True, port=5000, host='0.0.0.0')