"""
Fertilizer Recommendation System
This module provides fertilizer recommendation functionality based on soil and crop parameters.
To be used by the ai_responses API for fertilizer suggestions.
"""

import os
import pandas as pd
import numpy as np
import pickle
import warnings
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

warnings.filterwarnings('ignore')

# Get the base directory for model storage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'scripts', 'models')
DATASET_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'Fertilizer Prediction.csv')

# Create models directory if it doesn't exist
os.makedirs(MODELS_DIR, exist_ok=True)


class FertilizerRecommendationSystem:
    """
    A fertilizer recommendation system using Random Forest with GridSearch optimization.
    Predicts the best fertilizer based on soil and crop parameters.
    """
    
    def __init__(self):
        """Initialize the fertilizer recommendation system and load/train model."""
        self.model = None
        self.scaler = None
        self.soil_encoder = None
        self.crop_encoder = None
        self.fertilizer_encoder = None
        self.feature_names = ['Nitrogen', 'Phosphorous', 'Potassium', 'Soil Type', 'Crop Type', 
                             'Temparature', 'Humidity ', 'Moisture']
        
        # Fertilizer mapping
        self.fertilizer_mapping = {
            '10-26-26': 'Phosphate-rich NPK (10-26-26)',
            '14-35-14': 'Phosphate-rich NPK (14-35-14)',
            '17-17-17': 'Balanced NPK (17-17-17)',
            '20-20': 'Balanced NP (20-20)',
            '28-28': 'Nitrogen-rich NP (28-28)',
            'DAP': 'Diammonium Phosphate (DAP)',
            'Urea': 'Urea (High Nitrogen)'
        }
        
        self._load_or_train_model()
    
    def _load_or_train_model(self):
        """Load pre-trained model or train new one if it doesn't exist."""
        model_path = os.path.join(MODELS_DIR, 'fertilizer_model.pkl')
        scaler_path = os.path.join(MODELS_DIR, 'fertilizer_scaler.pkl')
        soil_encoder_path = os.path.join(MODELS_DIR, 'soil_encoder.pkl')
        crop_encoder_path = os.path.join(MODELS_DIR, 'crop_encoder.pkl')
        fertilizer_encoder_path = os.path.join(MODELS_DIR, 'fertilizer_encoder.pkl')
        
        model_exists = (
            os.path.exists(model_path) and 
            os.path.exists(scaler_path) and
            os.path.exists(soil_encoder_path) and
            os.path.exists(crop_encoder_path) and
            os.path.exists(fertilizer_encoder_path)
        )
        
        if model_exists:
            # Load existing model
            print("Loading pre-trained fertilizer model...")
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            self.soil_encoder = joblib.load(soil_encoder_path)
            self.crop_encoder = joblib.load(crop_encoder_path)
            self.fertilizer_encoder = joblib.load(fertilizer_encoder_path)
            print("✓ Fertilizer model loaded successfully!")
        else:
            # Train new model
            print("Training fertilizer recommendation model... This may take a few minutes.")
            self._train_model()
    
    def _train_model(self):
        """Train the Random Forest model with hyperparameter tuning."""
        # Load dataset
        if not os.path.exists(DATASET_PATH):
            raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
        
        df = pd.read_csv(DATASET_PATH)
        
        # Encode categorical variables
        self.soil_encoder = LabelEncoder()
        self.crop_encoder = LabelEncoder()
        self.fertilizer_encoder = LabelEncoder()
        
        df['Soil Type'] = self.soil_encoder.fit_transform(df['Soil Type'])
        df['Crop Type'] = self.crop_encoder.fit_transform(df['Crop Type'])
        df['Fertilizer Name'] = self.fertilizer_encoder.fit_transform(df['Fertilizer Name'])
        
        # Prepare features and target
        X = df.drop('Fertilizer Name', axis=1)
        y = df['Fertilizer Name']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=1
        )
        
        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Hyperparameter tuning with GridSearchCV
        print("Tuning hyperparameters...")
        params = {
            'n_estimators': [300, 400, 500],
            'max_depth': [5, 10, 15],
            'min_samples_split': [2, 5, 8]
        }
        
        base_model = RandomForestClassifier(random_state=42)
        grid_search = GridSearchCV(base_model, params, cv=3, verbose=1, n_jobs=-1)
        grid_search.fit(X_train_scaled, y_train)
        
        self.model = grid_search.best_estimator_
        
        # Evaluate model
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nModel Performance:")
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV Score: {grid_search.best_score_:.4f}")
        print(f"Test Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=self.fertilizer_encoder.classes_))
        
        # Save model and scaler
        print("\nSaving model and scaler...")
        joblib.dump(self.model, os.path.join(MODELS_DIR, 'fertilizer_model.pkl'))
        joblib.dump(self.scaler, os.path.join(MODELS_DIR, 'fertilizer_scaler.pkl'))
        
        # Save encoders for later use
        joblib.dump(self.soil_encoder, os.path.join(MODELS_DIR, 'soil_encoder.pkl'))
        joblib.dump(self.crop_encoder, os.path.join(MODELS_DIR, 'crop_encoder.pkl'))
        joblib.dump(self.fertilizer_encoder, os.path.join(MODELS_DIR, 'fertilizer_encoder.pkl'))
        print("Model and scaler saved successfully!")
    
    def predict_fertilizer(self, nitrogen, phosphorous, potassium, soil_type, crop_type,
                          temperature, humidity, moisture):
        """
        Predict the best fertilizer based on soil and crop parameters.
        
        Args:
            nitrogen (float): Nitrogen content
            phosphorous (float): Phosphorous content
            potassium (float): Potassium content
            soil_type (str): Type of soil
            crop_type (str): Type of crop
            temperature (float): Temperature in Celsius
            humidity (float): Humidity percentage
            moisture (float): Soil moisture percentage
        
        Returns:
            str: Recommended fertilizer name
        """
        # Load encoders if not already loaded
        if self.soil_encoder is None:
            encoders_path = os.path.join(MODELS_DIR, 'soil_encoder.pkl')
            if os.path.exists(encoders_path):
                self.soil_encoder = joblib.load(encoders_path)
                self.crop_encoder = joblib.load(os.path.join(MODELS_DIR, 'crop_encoder.pkl'))
                self.fertilizer_encoder = joblib.load(os.path.join(MODELS_DIR, 'fertilizer_encoder.pkl'))
        
        # Encode categorical variables
        try:
            soil_encoded = self.soil_encoder.transform([soil_type])[0]
        except ValueError:
            soil_encoded = 0  # Default if unknown soil type
        
        try:
            crop_encoded = self.crop_encoder.transform([crop_type])[0]
        except ValueError:
            crop_encoded = 0  # Default if unknown crop type
        
        # Prepare input data
        input_data = np.array([[
            float(nitrogen),
            float(phosphorous),
            float(potassium),
            soil_encoded,
            crop_encoded,
            float(temperature),
            float(humidity),
            float(moisture)
        ]])
        
        # Scale input
        input_scaled = self.scaler.transform(input_data)
        
        # Make prediction
        prediction_encoded = self.model.predict(input_scaled)[0]
        fertilizer_name = self.fertilizer_encoder.inverse_transform([prediction_encoded])[0]
        
        return fertilizer_name
    
    def predict_fertilizer_dict(self, params):
        """
        Predict fertilizer using a dictionary of parameters.
        
        Args:
            params (dict): Dictionary with keys: nitrogen, phosphorous, potassium, 
                          soil_type, crop_type, temperature, humidity, moisture
        
        Returns:
            str: Recommended fertilizer name
        """
        return self.predict_fertilizer(
            nitrogen=params.get('nitrogen', 0),
            phosphorous=params.get('phosphorous', 0),
            potassium=params.get('potassium', 0),
            soil_type=params.get('soil_type', 'Loamy'),
            crop_type=params.get('crop_type', 'Rice'),
            temperature=params.get('temperature', 0),
            humidity=params.get('humidity', 0),
            moisture=params.get('moisture', 0)
        )


# Initialize the system globally (lazy loading)
_fertilizer_system = None


def get_fertilizer_recommendation_system():
    """Get or initialize the fertilizer recommendation system."""
    global _fertilizer_system
    if _fertilizer_system is None:
        _fertilizer_system = FertilizerRecommendationSystem()
    return _fertilizer_system


def recommend_fertilizer(nitrogen, phosphorous, potassium, soil_type, crop_type,
                        temperature, humidity, moisture):
    """
    Main function to get fertilizer recommendation.
    
    Args:
        nitrogen (float): Nitrogen content
        phosphorous (float): Phosphorous content
        potassium (float): Potassium content
        soil_type (str): Type of soil
        crop_type (str): Type of crop
        temperature (float): Temperature in Celsius
        humidity (float): Humidity percentage
        moisture (float): Soil moisture percentage
    
    Returns:
        str: Recommended fertilizer name
    """
    system = get_fertilizer_recommendation_system()
    return system.predict_fertilizer(
        nitrogen, phosphorous, potassium, soil_type, crop_type,
        temperature, humidity, moisture
    )


def recommend_fertilizer_dict(params):
    """
    Get fertilizer recommendation from a dictionary of parameters.
    
    Args:
        params (dict): Dictionary with all required parameters
    
    Returns:
        str: Recommended fertilizer name
    """
    system = get_fertilizer_recommendation_system()
    return system.predict_fertilizer_dict(params)


if __name__ == '__main__':
    # Test the system
    print("Testing Fertilizer Recommendation System\n")
    
    system = get_fertilizer_recommendation_system()
    
    # Test case 1
    print("Test Case 1:")
    fertilizer1 = system.predict_fertilizer(34, 65, 62, 'Loamy', 'Rice', 30, 65, 70)
    print(f"Recommended fertilizer: {fertilizer1}\n")
    
    # Test case 2
    print("Test Case 2:")
    fertilizer2 = system.predict_fertilizer(50, 40, 30, 'Sandy', 'Wheat', 25, 70, 50)
    print(f"Recommended fertilizer: {fertilizer2}\n")
    
    # Test with dictionary
    print("Test Case 3 (using dictionary):")
    params = {
        'nitrogen': 45,
        'phosphorous': 55,
        'potassium': 45,
        'soil_type': 'Clayey',
        'crop_type': 'Corn',
        'temperature': 28,
        'humidity': 75,
        'moisture': 60
    }
    fertilizer3 = system.predict_fertilizer_dict(params)
    print(f"Recommended fertilizer: {fertilizer3}")
