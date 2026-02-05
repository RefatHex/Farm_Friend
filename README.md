# 🌾 FarmFriend

<p align="center">
  <strong>A Comprehensive Agricultural Management Platform for Farmers in Bangladesh</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-6.0.1-green?logo=django" alt="Django">
  <img src="https://img.shields.io/badge/React-19.x-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Python-3.12-yellow?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/MySQL-8.0+-orange?logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/ML-Powered-purple?logo=scikitlearn" alt="Machine Learning">
</p>

<p align="center">
  <em>Developed by <strong>Team ReBuggers</strong> | Software Engineering Lab</em>
</p>

---

## 📖 About

**FarmFriend** is a full-stack agricultural platform designed to empower farmers in Bangladesh with modern technology. The platform provides AI-powered crop and fertilizer recommendations, real-time weather updates, equipment rentals, crop storage solutions, and expert agronomist consultations—all in one unified system.

The application features a Bengali (বাংলা) language interface to ensure accessibility for local farmers.

---

## ✨ Key Features

### 🤖 AI-Powered Recommendations
- **Crop Recommendation System**: ML models (Decision Tree, Naive Bayes, SVM, Logistic Regression, Random Forest, XGBoost) analyze soil NPK levels, pH, rainfall, temperature, and humidity to suggest the best crops
- **Fertilizer Recommendation System**: Random Forest with GridSearch optimization recommends appropriate fertilizers based on soil type, crop type, and environmental conditions

### 🌤️ Weather Services
- Real-time weather data integration
- 5-day weather forecasts
- Historical rainfall data
- Agricultural weather warnings and recommendations
- Location-based weather updates (Bangladesh cities)

### 🚜 Equipment Rental Marketplace
- Rent owners can list farming equipment (tractors, tillers, harvesters, etc.)
- Farmers can browse and rent equipment
- Order management with confirmation and pickup status
- Rating system for rental services

### 🏪 Crop Storage Solutions
- Storage owners can list warehouse/storage facilities
- Farmers can book storage space for their crops
- Climate-controlled storage options
- Deal management with start/end dates

### 👨‍🌾 Expert Consultations
- Connect with certified agronomists
- Book consultations with agricultural experts
- Virtual meetings via integrated meet links
- Specialty-based expert filtering
- Fee-based consultation system

### 👥 Multi-Role User System
- **Farmers**: Manage crops, book storage, rent equipment, get AI recommendations
- **Storage Owners**: List and manage storage facilities
- **Rent Owners**: List and manage equipment rentals
- **Agronomists**: Provide expert consultations
- **Admin**: System administration

### 💳 Payments & Billing
- Multiple payment methods: Credit Card, Bank Transfer, Bkash, Nagad, Cash
- Billing address management
- Payment status tracking (Pending, Completed, Failed)

### 🔔 Notifications
- Real-time notifications for orders, consultations, and updates
- Read/unread status management

### ⭐ Feedback System
- Review gigs and services
- Rate consultations
- General feedback collection

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Django 6.0.1 | Web Framework |
| Django REST Framework 3.16.1 | RESTful API |
| MySQL | Database |
| drf-yasg | Swagger/OpenAPI Documentation |
| django-cors-headers | CORS Support |
| django-filter | API Filtering |
| Pillow | Image Processing |
| scikit-learn | Machine Learning Models |
| XGBoost | Advanced ML Algorithms |
| pandas & numpy | Data Processing |
| requests | External API Calls |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.2.3 | UI Framework |
| React Router DOM 7.11.0 | Navigation |
| CSS | Styling |

### ML Models
- Decision Tree Classifier
- Naive Bayes (GaussianNB)
- Support Vector Machine (SVC)
- Logistic Regression
- Random Forest Classifier
- XGBoost Classifier

---

## 📁 Project Structure

```
Farm_Friend/
├── backend/
│   ├── farmfriend/          # Main Django project settings
│   ├── users/               # User authentication & management
│   ├── farmers/             # Farmer profiles, crops, gigs
│   ├── rentals/             # Equipment rental system
│   ├── storage/             # Storage facility management
│   ├── consultations/       # Agronomist consultations
│   ├── weather/             # Weather data services
│   ├── ai_responses/        # ML-powered recommendations
│   ├── billing/             # Billing addresses
│   ├── payments/            # Payment processing
│   ├── notifications/       # User notifications
│   ├── feedback/            # Reviews & ratings
│   ├── scripts/             # ML model training scripts
│   │   ├── models/          # Trained ML models (.pkl files)
│   │   ├── crop_recommendation.py
│   │   └── fertilizer_recommendation.py
│   └── media/               # Uploaded images
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # Reusable React components
│       └── pages/           # Page components
│           ├── CropRecommendationPage.js
│           ├── FertilizerRecommendationPage.js
│           ├── WeatherUpdatePage.js
│           ├── EquipmentPage.js
│           ├── StoragePage.js
│           ├── ExpertsListPage.js
│           └── ...
│
└── dataset/                 # ML training datasets
    ├── Crop_recommendation.csv
    └── Fertilizer Prediction.csv
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Users** | `/api/users/` | User registration, login, profile management |
| **Farmers** | `/api/farmers/` | Farmer profiles, crops, gigs |
| **Rentals** | `/api/rentals/` | Equipment rental listings and orders |
| **Storage** | `/api/storage/` | Storage facilities and deals |
| **Consultations** | `/api/consultations/` | Agronomist profiles and consultation requests |
| **Weather** | `/api/weather/` | Current weather data |
| **Weather** | `/api/current-weather/` | Detailed current weather |
| **Weather** | `/api/weather-forecast/` | 5-day forecast |
| **Weather** | `/api/weather-warnings/` | Agricultural weather alerts |
| **Weather** | `/api/historical-rainfall/` | Historical rainfall data |
| **AI** | `/api/ai_responses/crops/` | Crop recommendations |
| **AI** | `/api/ai_responses/fertilizers/` | Fertilizer recommendations |
| **Billing** | `/billing/billing-addresses/` | Billing address management |
| **Payments** | `/payment/payments/` | Payment processing |
| **Notifications** | `/api/notifications/` | User notifications |
| **Feedback** | `/api/feedback/feedbacks/` | Reviews and ratings |

### API Documentation
- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

---

## 📊 Data Models

### Core Models

| Model | Description |
|-------|-------------|
| `UserInfo` | Extended user model with role flags (farmer, storage_owner, rent_owner, agronomist, admin) |
| `UserSessions` | Track user login sessions |
| `Farmer` | Farmer profile with field size and ratings |
| `FarmerGigs` | Products/produce listed by farmers |
| `Crops` | Crop types grown by farmers |
| `RentOwner` | Equipment rental business owners |
| `RentItems` | Available rental equipment |
| `RentItemOrders` | Equipment rental transactions |
| `StorageOwner` | Storage facility owners |
| `StorageOwnerGigs` | Storage space listings |
| `StorageDeals` | Storage booking transactions |
| `Agronomist` | Agricultural expert profiles |
| `ConsultationRequest` | Consultation bookings |
| `WeatherUpdate` | Cached weather data |
| `CropSuggestion` | ML crop recommendation history |
| `FertilizerSuggestion` | ML fertilizer recommendation history |
| `Payments` | Payment transactions |
| `BillingAddress` | User billing addresses |
| `Notifications` | User notification messages |
| `Feedback` | Reviews and ratings |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- MySQL Server
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/Farm_Friend.git
   cd Farm_Friend/backend
   ```

2. **Install dependencies using Pipenv**
   ```bash
   pip install pipenv
   pipenv install
   pipenv shell
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=farmfriend
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

4. **Set up the database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Train ML models (first time only)**
   ```bash
   python train_models.py
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

---

## 📝 API Usage Examples

### User Registration
```json
POST /api/users/user-info/
{
    "username": "farmer_user",
    "password": "SecurePass123",
    "email": "farmer@example.com",
    "name": "Test Farmer",
    "is_farmer": true
}
```

### Login
```json
POST /api/users/login/
{
    "username": "farmer_user",
    "password": "SecurePass123"
}
```

### Get Crop Recommendation
```json
POST /api/ai_responses/crops/
{
    "user": 1,
    "nitrogen": 45.2,
    "phosphorus": 34.1,
    "potassium": 20.5,
    "temperature": 30.1,
    "humidity": 40.2,
    "ph": 6.5,
    "rainfall": 120.3
}
```

### Get Weather Data
```
GET /api/weather/?city=Dhaka
```

---

## 🌍 Supported Cities (Weather)
The weather service supports major cities in Bangladesh:
- Dhaka
- Chittagong
- Rajshahi
- Khulna
- Sylhet
- Rangpur
- Mymensingh
- Barisal
- And more...

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## � Team - ReBuggers

This project was developed as part of the **Software Engineering Lab** course.

---

## 🙏 Acknowledgments

- Weather data provided by OpenWeatherMap and WeatherAPI
- ML models trained on agricultural datasets
- Built with ❤️ for the farmers of Bangladesh

---

<p align="center">
  <strong>🌾 FarmFriend - Empowering Farmers with Technology 🌾</strong>
</p>
<p align="center">
  Made with ❤️ by <strong>Team ReBuggers</strong>
</p>
