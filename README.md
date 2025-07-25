# 🔮 AI-Powered Customer Churn Prediction System

<div align="center">

<!-- Hero Banner with Gradient -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200§ion=header&text=Churn%20Prediction%20AI&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%"/>

<!-- Dynamic Badges -->
![Churn Prediction](https://img.shields.io/badge/🤖_ML-Churn%20Prediction-ff6b6b?style=for-the-badge&logoColor=white)
![Python](https://img.shields.io/badge/🐍_Python-3.9+-3776ab?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/⚡_FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/⚛️_React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Accuracy](https://img.shields.io/badge/🎯_Accuracy-96.9%25-00d4aa?style=for-the-badge)

<br/>

**🚀 Enterprise-grade ML application with real-time churn prediction, explainable AI insights, and stunning Liquid Glass UI**

<br/>

[![🤝 Contribute](https://img.shields.io/badge/🤝-Contribute-green?style=for-the-badge)](https://github.com/S-T-R-A-N-G-E-R/churn_prediction_app/contribute)

</div>

---

## 🌟 What Makes This Special?

<table>
<tr>
<td width="50%">

### 🎯 **High Accuracy**
- **96.9%** prediction accuracy
- Advanced ensemble modeling
- Confidence scoring system

</td>
<td width="50%">

### 🧠 **Explainable AI**
- SHAP-powered insights
- Feature importance analysis
- Transparent decision making
- Business-friendly explanations

</td>
</tr>
<tr>
<td width="50%">

### 🎨 **Stunning Interface**
- Apple-inspired Liquid Glass UI
- Responsive animations
- Modern glassmorphism effects
- Mobile-optimized design

</td>
<td width="50%">

### 📊 **Rich Dataset**
- **7,043** customer records
- **52** engineered features
- Geographic & behavioral data
- Business intelligence ready

</td>
</tr>
</table>

---

## 📸 System Preview

<div align="center">

| Dashboard Overview | Prediction Interface | SHAP Analysis |
|:--:|:--:|:--:|
| ![Dashboard](./assets/screenshots/performance-dashboard.png) | ![Prediction](./assets/screenshots/prediction-interface.png) | ![SHAP](./assets/screenshots/shap-analysis.png) |

*Screenshots showcase the modern Liquid Glass UI with real-time predictions and comprehensive analytics*

</div>

---

## ⚡ Quick Start Guide

<details>
<summary><b>🔧 Prerequisites & Setup</b></summary>

### System Requirements
- **Python** 3.9+ 🐍
- **Node.js** 16+ 🟢
- **Git** (latest version) 📂
- **8GB+ RAM** recommended 💾

</details>

### 🚀 One-Command Installation

```bash
# Clone and setup in one go
git clone https://github.com/S-T-R-A-N-G-E-R/churn_prediction_app.git && \
cd churn_prediction_app && \
chmod +x setup.sh && ./setup.sh
```

<details>
<summary><b>📋 Manual Installation Steps</b></summary>

```bash
# 1️⃣ Clone the repository
git clone https://github.com/S-T-R-A-N-G-E-R/churn_prediction_app.git
cd churn_prediction_app

# 2️⃣ Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3️⃣ Start API Server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 4️⃣ Frontend Setup (new terminal)
cd frontend
npm install
npm start

# 5️⃣ Access Your Application 🎉
# Frontend: http://localhost:3000
# API Docs: http://127.0.0.1:8000/docs
```

</details>

---

## 🏗️ Architecture & Technology

<div align="center">

```mermaid
graph TB
    subgraph "Data Layer"
        A[🗃️ Customer Data<br/>7,043 Records] --> B[🔧 Preprocessing<br/>Cleaning & Validation]
        B --> C[⚙️ Feature Engineering<br/>52 Features]
    end
    
    subgraph "ML Pipeline"
        C --> D[🤖 Model Training<br/>Ensemble Methods]
        D --> E[✅ Validation<br/>Cross-validation]
        E --> F[📊 Performance<br/>96.9% Accuracy]
    end
    
    subgraph "Backend Services"
        F --> G[⚡ FastAPI<br/>Real-time API]
        G --> H[🔍 SHAP Explainer<br/>Model Insights]
        G --> I[💾 Model Serving]
    end
    
    subgraph "Frontend Experience"
        I --> J[⚛️ React UI<br/>Liquid Glass Design]
        H --> K[📈 Analytics<br/>Interactive Dashboards]
        J --> L[📱 Responsive<br/>Multi-device]
    end
    
    style A fill:#ff6b6b,stroke:#fff,stroke-width:2px,color:#fff
    style F fill:#00d4aa,stroke:#fff,stroke-width:2px,color:#fff
    style J fill:#61dafb,stroke:#fff,stroke-width:2px,color:#000
```

</div>

### 🛠️ Tech Stack Breakdown

<table>
<tr>
<td><b>🧠 Machine Learning</b></td>
<td><b>⚡ Backend</b></td>
<td><b>🎨 Frontend</b></td>
</tr>
<tr>
<td>

- scikit-learn
- xgboost
- pandas/numpy
- joblib

</td>
<td>

- FastAPI
- Uvicorn
- Python 3.9+

</td>
<td>

- React 18
- TypeScript
- Tailwind CSS

</td>
</tr>
</table>

---

## 📊 Dataset Deep Dive

<div align="center">

### 📈 Dataset Statistics

| Metric | Value | Details |
|:------:|:-----:|:--------|
| **📊 Total Records** | `7,043` | Comprehensive customer database |
| **🔢 Features** | `52` | Engineered & original attributes |
| **📉 Churn Rate** | `26.5%` | Industry-realistic distribution |
| **🌍 Coverage** | `California` | Geographic telecom data |
| **💰 Revenue Range** | `$18.25 - $118.75` | Monthly charges spectrum |

</div>

<details>
<summary><b>🏷️ Feature Categories Breakdown</b></summary>

### 👥 **Demographics (8 features)**
```
Age, Gender, Marital Status, Dependents, Senior Citizen, 
Partner Status, Geographic Location, Customer Segment
```

### 💼 **Service & Contract (12 features)**
```
Contract Type, Internet Service, Monthly Charges, Total Charges,
Payment Method, Tenure, Service Add-ons, Plan Type
```

### 📱 **Usage Patterns (15 features)**
```
Data Usage, Call Minutes, Long Distance Charges, Device Protection,
Online Security, Tech Support, Streaming Services, Backup Services
```

### 🎯 **Business Intelligence (17 features)**
```
Customer Lifetime Value (CLTV), Satisfaction Score, Churn Risk Score,
Revenue Metrics, Geographic Coordinates, City, State
```

</details>

---

## 🎯 Model Performance

<div align="center">

### 🏆 Performance Metrics

<table>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Accuracy-96.9%25-00d4aa?style=for-the-badge&logo=target&logoColor=white"/>
<br/><b>Overall Accuracy</b>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Precision-97.0%25-ff6b6b?style=for-the-badge&logo=bullseye&logoColor=white"/>
<br/><b>Precision Score</b>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Recall-92.0%25-667eea?style=for-the-badge&logo=search&logoColor=white"/>
<br/><b>Recall Score</b>
</td>
<td align="center">
<img src="https://img.shields.io/badge/F1_Score-94.0%25-f093fb?style=for-the-badge&logo=chart-line&logoColor=white"/>
<br/><b>F1-Score</b>
</td>
</tr>
</table>

### 📊 Model Comparison

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|:--------:|:---------:|:------:|:--------:|
| **🏆 Stacking Ensemble** | **96.9%** | **97.0%** | **92.0%** | **94.0%** |
| Voting Classifier | 96.7% | 98.0% | 90.0% | 94.0% |
| Random Forest | 95.8% | 98.0% | 86.0% | 92.0% |
| XGBoost | 96.0% | 94.0% | 91.0% | 92.0% |
| Logistic Regression | 96.7% | 96.0% | 91.0% | 94.0% |

</div>

---

## 🔍 API Reference

### 🚀 Core Endpoints

<details>
<summary><b>🔮 POST /predict - Churn Prediction</b></summary>

**Request Example:**
```json
{
  "Age": 35,
  "Monthly_Charge": 75.50,
  "Tenure_in_Months": 24,
  "Contract": "Month-to-Month",
  "Satisfaction_Score": 3,
  "CLTV": 4500.00,
  "Internet_Service": "Fiber Optic",
  "Payment_Method": "Credit Card"
}
```

**Response Example:**
```json
{
  "prediction": 0,
  "churn_probability": 0.017,
  "risk_level": "🟢 Low Risk",
  "confidence": 96.9,
  "key_factors": [
    "✅ High satisfaction score reduces churn risk",
    "✅ Long tenure indicates strong customer loyalty",
    "⚠️ Month-to-month contract increases flexibility risk"
  ],
  "recommendations": [
    "Offer annual contract incentive",
    "Maintain high service quality",
    "Consider loyalty rewards program"
  ]
}
```

</details>

<details>
<summary><b>🧠 POST /explain - Model Explanations</b></summary>

Returns detailed SHAP explanations, feature importance, and decision reasoning.

</details>

<details>
<summary><b>📊 GET /health - System Status</b></summary>

Health check endpoint with model performance metrics and system status.

</details>

### 📖 Interactive Documentation

🌐 **Swagger UI**: `http://127.0.0.1:8000/docs`  
🔧 **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 📁 Project Structure

```
churn_prediction_app/
├── README.md                              # Project documentation
├── LICENSE                                # License file
│
├── assets/                               # Project assets and media
│   └── screenshots/                      # Application screenshots
│       ├── prediction-interface.png     # Main prediction page screenshot
│       ├── performance-dashboard.png    # Model performance dashboard
│       └── shap-analysis.png           # SHAP feature importance visualization
│
├── model/                               # ML model development and data
│   ├── prediction.ipynb                # Main Jupyter notebook for model training
│   ├── train.csv                       # Training dataset
│   ├── test.csv                        # Test dataset
│   └── validation.csv                  # Validation dataset
│
├── backend/                            # FastAPI Python backend
│   ├── app/
│   │   └── main.py                     # FastAPI application with ML endpoints
│   ├── models/                         # Trained model artifacts
│   │   ├── stacking_clf.joblib         # Trained stacking ensemble model
│   │   ├── scaler.pkl                  # Feature scaler
│   │   └── train_sample.csv            # Sample training data
│   ├── requirements.txt                # Python dependencies
│   ├── venv/                          # Virtual environment (local)
│   └── .env                           # Environment variables (local)
│
└── frontend/                          # React TypeScript frontend
    ├── public/
    │   ├── index.html                  # Main HTML template
    │   ├── favicon.ico                 # App icon
    │   └── manifest.json               # PWA manifest
    ├── src/
    │   ├── components/                 # Reusable UI components
    │   │   ├── LiquidNavbar.tsx        # Floating glass navigation
    │   │   ├── LiquidPredictionForm.tsx # Collapsible form sections
    │   │   ├── LiquidResultsPanel.tsx  # Results display with tabs
    │   │   └── ShapChart.tsx           # SHAP visualization component
    │   ├── pages/                      # Page components
    │   │   ├── LiquidHomePage.tsx      # Landing page
    │   │   ├── LiquidPredictionPage.tsx # Main prediction interface
    │   │   └── LiquidModelPerformancePage.tsx # Analytics dashboard
    │   ├── services/
    │   │   └── api.ts                  # API client and TypeScript types
    │   ├── App.tsx                     # Main application component
    │   ├── index.tsx                   # React entry point
    │   └── index.css                   # Global styles with glass morphism
    ├── package.json                    # Node.js dependencies and scripts
    ├── package-lock.json              # Locked dependency versions
    ├── tailwind.config.js             # Tailwind CSS configuration
    └── tsconfig.json                   # TypeScript configuration
```

---

## 🗺️ Roadmap & Future Vision

<div align="center">

### 🚀 Development Timeline

</div>

```mermaid
gantt
    title Development Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation ✅
    Dataset Integration     :done, des1, 2024-01-01, 2024-01-15
    ML Pipeline            :done, des2, 2024-01-16, 2024-02-15
    API Development        :done, des3, 2024-02-16, 2024-03-01
    UI Development         :done, des4, 2024-03-02, 2024-03-20
    
    section Advanced Analytics 🚧
    A/B Testing Framework  :active, des5, 2024-03-21, 2024-04-15
    Advanced Segmentation  :des6, 2024-04-16, 2024-05-01
    Real-time Monitoring   :des7, 2024-05-02, 2024-05-20
    
    section Enterprise Scale 🔮
    Streaming Pipeline     :des8, 2024-05-21, 2024-06-15
    Multi-tenant Architecture :des9, 2024-06-16, 2024-07-15
    CRM Integration        :des10, 2024-07-16, 2024-08-15
```

<details>
<summary><b>📋 Detailed Feature Roadmap</b></summary>

### ✅ **Phase 1: Foundation** (Complete)
- [x] 🧠 Advanced ML pipeline with ensemble methods
- [x] 🎨 Liquid Glass UI with responsive design
- [x] ⚡ Real-time prediction API
- [x] 🔍 SHAP-powered explainable AI
- [x] 📊 Comprehensive model evaluation

### 🚧 **Phase 2: Advanced Analytics** (In Progress)
- [ ] 🧪 A/B testing framework for model comparison
- [ ] 🎯 Advanced customer segmentation algorithms
- [ ] 📈 Seasonal pattern detection & forecasting
- [ ] 🔄 Multi-model ensemble comparison
- [ ] 📊 Real-time model performance monitoring

### 🔮 **Phase 3: Enterprise Scale** (Planned)
- [ ] 🌊 Streaming ML pipeline for real-time data
- [ ] 🔄 Automated model retraining & deployment
- [ ] 🏢 Multi-tenant SaaS architecture
- [ ] 🔗 CRM system integration (Salesforce, HubSpot)
- [ ] 🧠 Advanced business intelligence dashboard

</details>

---

## 🤝 Contributing

<div align="center">

**We'd love your contribution! Here's how to get started:**

### 🌟 How to Contribute

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💫 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **🚀 Push** to branch (`git push origin feature/amazing-feature`)
5. **🎯 Open** a Pull Request

### 🏆 Recognition

**Top Contributors**

*(Contributor list will be available once the repository is initialized.)*

</div>
---

## 📄 License & Acknowledgments

<div align="center">

### 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🙏 Special Thanks

**Built with these amazing technologies:**

<table>
<tr>
<td align="center"><img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white"/><br/><b>ML Foundation</b></td>
<td align="center"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/><br/><b>API Framework</b></td>
<td align="center"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/><br/><b>UI Library</b></td>
<td align="center"><img src="https://img.shields.io/badge/SHAP-FF6B6B?style=for-the-badge"/><br/><b>Explainable AI</b></td>
</tr>
</table>

**Dataset provided by:** [AAI510 Group 1](https://huggingface.co/datasets/aai510-group1/telco-customer-churn) 📊

</div>

---

## 👨‍💻 About the Author

<div align="center">

### **Swapnil Roy** 
*Master's Student in Data Science*

<table>
<tr>
<td align="center">

[![GitHub](https://img.shields.io/badge/GitHub-S--T--R--A--N--G--E--R-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/S-T-R-A-N-G-E-R)

</td>
<td align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/swapnilroy001/)

</td>
</tr>
</table>

*"Making AI accessible, explainable, and beautiful"*

</div>

---

<div align="center">

<!-- Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100§ion=footer" width="100%"/>

### ⭐ **Star this repository if you found it helpful!**

**Built with ❤️ and lots of ☕ by Swapnil**

*Transforming customer retention through intelligent AI*

---

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=S-T-R-A-N-G-E-R.churn_prediction_app)
![Last Commit](https://img.shields.io/github/last-commit/S-T-R-A-N-G-E-R/churn_prediction_app?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/S-T-R-A-N-G-E-R/churn_prediction_app?style=flat-square)

</div>