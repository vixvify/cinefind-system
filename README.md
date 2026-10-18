# 🎬 CineFind

**Discover your next favorite movie with AI-powered recommendations.**

CineFind is a movie recommendation web application that helps users discover movies based on their interests. It uses machine learning and content-based filtering to recommend movies with similar characteristics, such as genres, keywords, cast, directors, and plot descriptions.

## ✨ Features

- 🎯 **Personalized Movie Recommendations** — Discover similar movies using machine learning.
- 🔎 **Movie Discovery** — Explore movies and find content that matches your interests.
- 🧠 **Content-Based Filtering** — Analyze movie metadata to identify similarities.
- 🎭 **Metadata Analysis** — Generate recommendations using genres, keywords, cast, directors, and overviews.

## 🛠️ Tech Stack

| Category         | Technologies               |
| ---------------- | -------------------------- |
| Frontend         | Next.js, React, TypeScript |
| Backend          | Next.js API Routes         |
| AI Service       | Python, FastAPI (planned)  |
| Machine Learning | Scikit-learn               |
| Data Processing  | Pandas, NumPy              |
| Development      | Jupyter Notebook           |
| Dataset          | TMDB 5000 Movie Dataset    |

## 🧠 Recommendation System

CineFind uses a **Content-Based Filtering** approach to recommend movies based on their metadata.

The recommendation pipeline consists of:

1. **Data Collection** — Load movie metadata from the TMDB 5000 dataset.
2. **Data Preprocessing** — Clean and combine movie information, including genres, keywords, cast, directors, and overviews.
3. **Feature Extraction** — Convert textual movie features into numerical vectors using TF-IDF.
4. **Similarity Calculation** — Calculate movie similarity using Cosine Similarity.
5. **Recommendation Generation** — Return the most similar movies based on the selected movie.

### How It Works

```text
         User Selects a Movie
                  |
                  v
          Movie Metadata
                  |
                  v
          Text Preprocessing
                  |
                  v
          TF-IDF Vectorization
                  |
                  v
           Cosine Similarity
                  |
                  v
          Top-K Similar Movies
                  |
                  v
           Recommendations
```

## 🏗️ Project Structure

The project is organized into two main applications:

```text
cinefind/
├── portal/              # Next.js full-stack application
│   ├── app/
│   ├── public/
│   └── package.json
│
├── ai/                  # Python recommendation service
│   ├── data/
│   │   └── raw/        # TMDB dataset
│   ├── notebooks/       # Data exploration and experiments
│   ├── requirements.txt
│   └── .venv/
│
└── README.md
```

## 📊 Dataset

This project uses the **TMDB 5000 Movie Dataset**, which includes movie information such as:

- Movie titles and overviews
- Genres and keywords
- Cast and crew
- Popularity and ratings

Dataset: [TMDB 5000 Movie Dataset — Kaggle](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)

## 🚀 Getting Started

### Prerequisites

- Node.js
- Python
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/vixvify/cinefind.git
cd cinefind
```

### 2. Set Up Next.js

```bash
cd portal
npm install
npm run dev
```

### 3. Set Up Python

Open another terminal:

```bash
cd ai
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 4. Explore the Recommendation Model

```bash
jupyter notebook
```

Open the notebook in the `notebooks/` directory to explore the dataset and experiment with the recommendation model.

> **Note:** The AI service and Next.js integration are still under development.

## 📄 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
